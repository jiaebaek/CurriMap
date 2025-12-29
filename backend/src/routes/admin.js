import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { createSuccessResponse, parsePagination, createPaginationMeta } from '../utils/helpers.js';

const router = express.Router();

// TODO: Admin 권한 체크 미들웨어 추가 필요
router.use(authenticateUser);

/**
 * GET /api/admin/books
 * 도서 목록 조회 (Admin)
 */
router.get('/books', async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const { limit, offset } = parsePagination(req);
    const { search, theme_id, mood_id } = req.query;

    let query = supabaseAdmin
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `, { count: 'exact' });

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

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
 * POST /api/admin/books
 * 도서 등록 (Admin)
 */
router.post('/books', async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const {
      title,
      author,
      isbn,
      cover_image_url,
      ar_level,
      mom_tip,
      key_words,
      purchase_url,
      word_count,
      series_name,
      series_order,
      theme_ids,
      mood_ids,
    } = req.body;

    // 필수 필드 검증
    if (!title || !author) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title and author are required',
      });
    }

    // 도서 기본 정보 저장
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .insert({
        title,
        author,
        isbn: isbn || null,
        cover_image_url: cover_image_url || null,
        ar_level: ar_level ? parseFloat(ar_level) : null,
        mom_tip: mom_tip || null,
        key_words: Array.isArray(key_words) ? key_words : null,
        purchase_url: purchase_url || null,
        word_count: word_count ? parseInt(word_count) : null,
        series_name: series_name || null,
        series_order: series_order ? parseInt(series_order) : null,
      })
      .select()
      .single();

    if (bookError) {
      return res.status(500).json({
        error: 'Database Error',
        message: bookError.message,
      });
    }

    // 주제 태그 연결
    if (theme_ids && Array.isArray(theme_ids) && theme_ids.length > 0) {
      const themeRelations = theme_ids.map(theme_id => ({
        book_id: book.id,
        theme_id: parseInt(theme_id),
      }));

      await supabaseAdmin
        .from('book_themes')
        .insert(themeRelations);
    }

    // 분위기 태그 연결
    if (mood_ids && Array.isArray(mood_ids) && mood_ids.length > 0) {
      const moodRelations = mood_ids.map(mood_id => ({
        book_id: book.id,
        mood_id: parseInt(mood_id),
      }));

      await supabaseAdmin
        .from('book_moods')
        .insert(moodRelations);
    }

    // 최종 도서 정보 조회
    const { data: finalBook } = await supabaseAdmin
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `)
      .eq('id', book.id)
      .single();

    res.status(201).json(createSuccessResponse(finalBook, 'Book created successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/books/:bookId
 * 도서 수정 (Admin)
 */
router.put('/books/:bookId', async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const { bookId } = req.params;
    const {
      title,
      author,
      isbn,
      cover_image_url,
      ar_level,
      mom_tip,
      key_words,
      purchase_url,
      word_count,
      series_name,
      series_order,
      theme_ids,
      mood_ids,
    } = req.body;

    // 도서 기본 정보 업데이트
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
    if (ar_level !== undefined) updateData.ar_level = ar_level ? parseFloat(ar_level) : null;
    if (mom_tip !== undefined) updateData.mom_tip = mom_tip;
    if (key_words !== undefined) updateData.key_words = Array.isArray(key_words) ? key_words : null;
    if (purchase_url !== undefined) updateData.purchase_url = purchase_url;
    if (word_count !== undefined) updateData.word_count = word_count ? parseInt(word_count) : null;
    if (series_name !== undefined) updateData.series_name = series_name;
    if (series_order !== undefined) updateData.series_order = series_order ? parseInt(series_order) : null;

    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .update(updateData)
      .eq('id', parseInt(bookId))
      .select()
      .single();

    if (bookError) {
      return res.status(500).json({
        error: 'Database Error',
        message: bookError.message,
      });
    }

    // 태그 관계 업데이트 (제공된 경우)
    if (theme_ids !== undefined) {
      // 기존 태그 삭제
      await supabaseAdmin
        .from('book_themes')
        .delete()
        .eq('book_id', parseInt(bookId));

      // 새 태그 추가
      if (Array.isArray(theme_ids) && theme_ids.length > 0) {
        const themeRelations = theme_ids.map(theme_id => ({
          book_id: parseInt(bookId),
          theme_id: parseInt(theme_id),
        }));

        await supabaseAdmin
          .from('book_themes')
          .insert(themeRelations);
      }
    }

    if (mood_ids !== undefined) {
      // 기존 태그 삭제
      await supabaseAdmin
        .from('book_moods')
        .delete()
        .eq('book_id', parseInt(bookId));

      // 새 태그 추가
      if (Array.isArray(mood_ids) && mood_ids.length > 0) {
        const moodRelations = mood_ids.map(mood_id => ({
          book_id: parseInt(bookId),
          mood_id: parseInt(mood_id),
        }));

        await supabaseAdmin
          .from('book_moods')
          .insert(moodRelations);
      }
    }

    // 최종 도서 정보 조회
    const { data: finalBook } = await supabaseAdmin
      .from('books')
      .select(`
        *,
        themes:book_themes(theme:themes(*)),
        moods:book_moods(mood:moods(*))
      `)
      .eq('id', parseInt(bookId))
      .single();

    res.json(createSuccessResponse(finalBook, 'Book updated successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/themes
 * 주제 태그 목록 조회 (Admin)
 */
router.get('/themes', async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const { data: themes, error } = await supabaseAdmin
      .from('themes')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse(themes));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/moods
 * 분위기 태그 목록 조회 (Admin)
 */
router.get('/moods', async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const { data: moods, error } = await supabaseAdmin
      .from('moods')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse(moods));
  } catch (error) {
    next(error);
  }
});

export default router;

