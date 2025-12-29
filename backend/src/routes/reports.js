import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * GET /api/reports/:childId/monthly
 * 월간 리포트 조회
 */
router.get('/:childId/monthly', async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { year, month } = req.query;

    // 자녀 소유권 확인
    const { data: child } = await supabase
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

    // 년/월 파싱
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // 해당 월의 미션 로그 조회
    const { data: logs, error } = await supabase
      .from('mission_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('child_id', childId)
      .gte('logged_at', startDate.toISOString())
      .lte('logged_at', endDate.toISOString())
      .order('logged_at', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // 통계 계산
    const readingLogs = logs.filter(log => log.activity_type === 'reading' && log.book);
    const uniqueBooks = new Set(readingLogs.map(log => log.book_id)).size;
    const totalWordCount = readingLogs.reduce((sum, log) => {
      return sum + (log.book?.word_count || 0);
    }, 0);

    // 일별 통계
    const dailyStats = {};
    logs.forEach(log => {
      const date = new Date(log.logged_at).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, activities: [] };
      }
      dailyStats[date].count++;
      dailyStats[date].activities.push({
        activity_type: log.activity_type,
        book_title: log.book?.title || null,
      });
    });

    res.json(createSuccessResponse({
      period: {
        year: targetYear,
        month: targetMonth,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      summary: {
        total_missions: logs.length,
        unique_books_read: uniqueBooks,
        total_word_count: totalWordCount,
        reading_count: readingLogs.length,
        video_count: logs.filter(log => log.activity_type === 'video').length,
        listening_count: logs.filter(log =>
          log.activity_type === 'focused_listening' || log.activity_type === 'background_listening'
        ).length,
      },
      daily_stats: dailyStats,
    }));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reports/:childId/summary
 * 자녀의 전체 성장 리포트 요약
 */
router.get('/:childId/summary', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 정보 조회
    const { data: child, error: childError } = await supabase
      .from('children')
      .select(`
        *,
        current_level:levels(*),
        current_course:courses(*)
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

    // 전체 미션 로그 통계
    const { data: allLogs } = await supabase
      .from('mission_logs')
      .select('*')
      .eq('child_id', childId);

    const readingCount = allLogs?.filter(log => log.activity_type === 'reading').length || 0;
    const uniqueBooks = new Set(
      allLogs?.filter(log => log.book_id).map(log => log.book_id) || []
    ).size;

    res.json(createSuccessResponse({
      child: {
        id: child.id,
        nickname: child.nickname,
        current_level: child.current_level,
        current_course: child.current_course,
      },
      stats: {
        total_books_read: child.total_books_read,
        total_word_count: child.total_word_count,
        current_streak: child.current_streak,
        longest_streak: child.longest_streak,
        unique_books_count: uniqueBooks,
        total_reading_sessions: readingCount,
      },
    }));
  } catch (error) {
    next(error);
  }
});

export default router;

