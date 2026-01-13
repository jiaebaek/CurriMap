import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * GET /api/roadmap/:childId
 * 자녀의 현재 로드맵 조회
 */
router.get('/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 정보 및 현재 코스 조회
    const { data: child, error: childError } = await supabaseAdmin
      .from('children')
      .select(`
        *,
        current_course:courses(*),
        current_level:levels(*),
        progress:child_course_progress(*)
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

    if (!child.current_course_id) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No course assigned to child',
      });
    }

    // 코스 내 도서 리스트 조회
    const { data: courseBooks, error: booksError } = await supabaseAdmin
      .from('course_books')
      .select(`
        *,
        book:books(*),
        level:levels(*)
      `)
      .eq('course_id', child.current_course_id)
      .order('sequence_order', { ascending: true });

    if (booksError) {
      return res.status(500).json({
        error: 'Database Error',
        message: booksError.message,
      });
    }

    // 읽은 책 ID 조회
    const { data: readLogs } = await supabaseAdmin
      .from('mission_logs')
      .select('book_id')
      .eq('child_id', childId)
      .not('book_id', 'is', null);

    const readBookIds = readLogs?.map(log => log.book_id) || [];

    // 각 도서의 상태 분류 (Past/Current/Future)
    const currentPosition = child.progress?.[0]?.current_position || 0;
    const booksWithStatus = courseBooks.map((cb) => {
      const isRead = readBookIds.includes(cb.book_id);
      const isCurrent = cb.sequence_order === currentPosition || (!isRead && cb.sequence_order <= currentPosition + 1);
      const isFuture = cb.sequence_order > currentPosition + 1 && !isRead;

      return {
        ...cb,
        status: isRead ? 'past' : isCurrent ? 'current' : 'future',
        read_count: isRead
          ? readLogs.filter(log => log.book_id === cb.book_id).length
          : 0,
      };
    });

    res.json(createSuccessResponse({
      child: {
        id: child.id,
        nickname: child.nickname,
        current_level: child.current_level,
        current_course: child.current_course,
      },
      progress: child.progress?.[0] || null,
      books: booksWithStatus,
    }));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/roadmap/:childId/level/:levelId
 * 특정 레벨의 도서 리스트 조회
 */
router.get('/:childId/level/:levelId', async (req, res, next) => {
  try {
    const { childId, levelId } = req.params;

    // 자녀 소유권 확인
    const { data: child } = await supabaseAdmin
      .from('children')
      .select('id')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (!child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 해당 레벨의 도서 조회
    const { data: books, error } = await supabaseAdmin
      .from('course_books')
      .select(`
        *,
        book:books(*),
        level:levels(*)
      `)
      .eq('level_id', parseInt(levelId))
      .order('sequence_order', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse(books));
  } catch (error) {
    next(error);
  }
});

export default router;
