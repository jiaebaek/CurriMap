import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js'; // supabaseAdmin 추가
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
    query = query.order('created_at', { ascending: false });

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
 * 오늘의 미션 추천 (개선된 Rule-based 알고리즘)
 */
router.get('/daily/:childId', authenticateUser, async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 1. 자녀 정보 조회 (supabaseAdmin 사용하여 RLS 우회)
    const { data: child, error: childError } = await supabaseAdmin
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

    // 2. AR 추천 범위 계산 (±0.5)
    const minAr = child.current_level?.min_ar || 0;
    const maxAr = child.current_level?.max_ar || 5;
    const arMin = Math.max(0, minAr - 0.5);
    const arMax = maxAr + 0.5;

    // 3. 이미 읽은 책 ID 조회
    const { data: readBooks } = await supabaseAdmin
      .from('mission_logs')
      .select('book_id')
      .eq('child_id', childId)
      .not('book_id', 'is', null);

    const readBookIds = readBooks?.map(rb => rb.book_id) || [];

    // 4. [알고리즘 Step 1] 레벨 범위 내 + 관심사(Theme) 매칭 도서 찾기
    const interestThemeIds = child.interests?.map(ci => ci.theme.id) || [];
    let recommendedBook = null;
    let reason = '아이의 관심사와 레벨을 반영한 추천이에요 ✨';

    if (interestThemeIds.length > 0) {
      let query = supabaseAdmin
        .from('books')
        .select(`
          *,
          themes:book_themes!inner(theme_id)
        `)
        .gte('ar_level', arMin)
        .lte('ar_level', arMax)
        .in('book_themes.theme_id', interestThemeIds);

      if (readBookIds.length > 0) {
        query = query.not('id', 'in', `(${readBookIds.join(',')})`);
      }

      const { data: interestMatch } = await query.limit(20);

      if (interestMatch && interestMatch.length > 0) {
        recommendedBook = interestMatch[Math.floor(Math.random() * interestMatch.length)];
      }
    }

    // 5. [알고리즘 Step 2] 관심사 매칭이 없으면 레벨 범위 내에서 랜덤 추천 (Fallback)
    if (!recommendedBook) {
      reason = '아이의 읽기 레벨에 딱 맞는 도서예요 📖';
      let query = supabaseAdmin
        .from('books')
        .select('*')
        .gte('ar_level', arMin)
        .lte('ar_level', arMax);

      if (readBookIds.length > 0) {
        query = query.not('id', 'in', `(${readBookIds.join(',')})`);
      }

      const { data: levelMatch } = await query.limit(20);

      if (levelMatch && levelMatch.length > 0) {
        recommendedBook = levelMatch[Math.floor(Math.random() * levelMatch.length)];
      }
    }

    // 최종 결과 확인
    if (!recommendedBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: '현재 레벨에 맞는 도서 데이터가 없습니다. 도서를 추가해 주세요.',
      });
    }

    res.json(createSuccessResponse({
      book: recommendedBook,
      child_id: parseInt(childId),
      recommendation_reason: reason,
    }));
  } catch (error) {
    next(error);
  }
});

export default router;