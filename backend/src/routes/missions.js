import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateMissionComplete } from '../utils/validators.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * POST /api/missions/complete
 * 미션 완료 및 기록 저장
 */
router.post('/complete', validateMissionComplete, async (req, res, next) => {
  try {
    const { child_id, book_id, activity_type, reaction, course_id, checklist, is_manual_log } = req.body;

    // 자녀 소유권 확인
    const { data: child } = await supabase
      .from('children')
      .select('id')
      .eq('id', child_id)
      .eq('user_id', req.userId)
      .single();

    if (!child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // activity_type이 'reading'인 경우 book_id 필수
    if (activity_type === 'reading' && !book_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'book_id is required for reading activity',
      });
    }

    // 미션 로그 저장 (read_count는 트리거가 자동 설정)
    const { data: missionLog, error } = await supabase
      .from('mission_logs')
      .insert({
        child_id: parseInt(child_id),
        user_id: req.userId,
        book_id: book_id || null,
        course_id: course_id || null,
        activity_type,
        reaction: reaction || null,
        checklist: checklist || null,
        is_manual_log: is_manual_log || false,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // 통계는 트리거가 자동 업데이트하므로 여기서는 성공 응답만 반환
    res.status(201).json(createSuccessResponse(missionLog, 'Mission completed successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/missions/:childId/history
 * 자녀의 미션 기록 이력 조회
 */
router.get('/:childId/history', async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

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

    const { data: logs, error } = await supabase
      .from('mission_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('child_id', childId)
      .order('logged_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse(logs));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/missions/:childId/stats
 * 자녀의 미션 통계 요약
 */
router.get('/:childId/stats', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 소유권 확인
    const { data: child } = await supabase
      .from('children')
      .select('id, total_books_read, total_word_count, current_streak, longest_streak')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (!child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 월간 통계 (이번 달)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyCount } = await supabase
      .from('mission_logs')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .gte('logged_at', startOfMonth.toISOString());

    res.json(createSuccessResponse({
      total_books_read: child.total_books_read,
      total_word_count: child.total_word_count,
      current_streak: child.current_streak,
      longest_streak: child.longest_streak,
      monthly_mission_count: monthlyCount || 0,
    }));
  } catch (error) {
    next(error);
  }
});

export default router;

