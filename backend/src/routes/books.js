import express from 'express';
import { supabase } from '../config/supabase.js';
import { optionalAuth, authenticateUser } from '../middleware/auth.js';
import { validateBookSearch } from '../utils/validators.js';
import { createSuccessResponse, parsePagination, createPaginationMeta } from '../utils/helpers.js';

const router = express.Router();

/**
 * GET /api/books/search
 * 스마트 검색 (AR × Theme × Mood) - 비회원도 접근 가능
 */
router.get('/search', optionalAuth, validateBookSearch, async (req, res, next) => {
  try {
    const { min_ar, max_ar, theme_ids, mood_ids, sort = 'latest' } = req.query;
    const { limit, offset } = parsePagination(req);

    let query = supabase
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `, { count: 'exact' });

    // AR 레벨 필터
    if (min_ar !== undefined || max_ar !== undefined) {
      if (min_ar !== undefined && max_ar !== undefined) {
        query = query.gte('ar_level', parseFloat(min_ar)).lte('ar_level', parseFloat(max_ar));
      } else if (min_ar !== undefined) {
        query = query.gte('ar_level', parseFloat(min_ar));
      } else if (max_ar !== undefined) {
        query = query.lte('ar_level', parseFloat(max_ar));
      }
    }

    // 주제 태그 필터
    if (theme_ids) {
      const themeArray = Array.isArray(theme_ids) ? theme_ids : [theme_ids];
      query = query.in('book_themes.theme_id', themeArray.map(id => parseInt(id)));
    }

    // 분위기 태그 필터
    if (mood_ids) {
      const moodArray = Array.isArray(mood_ids) ? mood_ids : [mood_ids];
      query = query.in('book_moods.mood_id', moodArray.map(id => parseInt(id)));
    }

    // 정렬
    if (sort === 'popular') {
      // 인기순: mission_logs에서 reaction='love'인 횟수 기준
      // 이 부분은 복잡하므로 서브쿼리나 뷰를 사용하거나 애플리케이션 레벨에서 처리
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1);

    const { data: books, error, count } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse({
      books,
      pagination: createPaginationMeta(
        parseInt(req.query.page) || 1,
        limit,
        count || 0
      ),
    }));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/books/:bookId
 * 도서 상세 정보 조회 - 비회원도 접근 가능
 */
router.get('/:bookId', optionalAuth, async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `)
      .eq('id', bookId)
      .single();

    if (error || !book) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Book not found',
      });
    }

    res.json(createSuccessResponse(book));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/books/daily/:childId
 * 오늘의 미션 추천 (Rule-based 알고리즘)
 */
router.get('/daily/:childId', authenticateUser, async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 정보 조회
    const { data: child, error: childError } = await supabase
      .from('children')
      .select(`
        *,
        current_level:levels(*),
        interests:child_interests(theme:themes(*))
      `)
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (childError || !child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // AR 범위 계산
    const minAr = child.current_level?.min_ar || 0;
    const maxAr = child.current_level?.max_ar || 5;
    const arMin = Math.max(0, minAr - 0.5);
    const arMax = maxAr + 0.5;

    // 관심사 태그 ID 추출
    const interestThemeIds = child.interests?.map(ci => ci.theme.id) || [];

    // 이미 읽은 책 ID 조회
    const { data: readBooks } = await supabase
      .from('mission_logs')
      .select('book_id')
      .eq('child_id', childId)
      .not('book_id', 'is', null);

    const readBookIds = readBooks?.map(rb => rb.book_id) || [];

    // 추천 쿼리 구성
    let query = supabase
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `)
      .gte('ar_level', arMin)
      .lte('ar_level', arMax);

    // 관심사 매칭 (관심사가 있는 경우)
    if (interestThemeIds.length > 0) {
      // 주제 태그가 하나라도 일치하는 책 필터링
      query = query.in('book_themes.theme_id', interestThemeIds);
    }

    // 미읽음 필터
    if (readBookIds.length > 0) {
      query = query.not('id', 'in', `(${readBookIds.join(',')})`);
    }

    // 랜덤 정렬
    query = query.order('created_at', { ascending: false }).limit(100);

    const { data: candidates, error } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // 후보가 없으면 Fallback: 베스트셀러 또는 기본 도서
    let recommendedBook = null;
    if (candidates && candidates.length > 0) {
      // 랜덤 선택
      recommendedBook = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      // Fallback: AR 레벨에 맞는 인기 도서
      const { data: fallbackBooks } = await supabase
        .from('books')
        .select('*')
        .gte('ar_level', arMin)
        .lte('ar_level', arMax)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      recommendedBook = fallbackBooks;
    }

    if (!recommendedBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No recommended book found',
      });
    }

    res.json(createSuccessResponse({
      book: recommendedBook,
      child_id: parseInt(childId),
      recommendation_reason: interestThemeIds.length > 0
        ? 'Based on your interests and reading level'
        : 'Based on your reading level',
    }));
  } catch (error) {
    next(error);
  }
});

export default router;

