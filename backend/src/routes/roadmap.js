import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();
router.use(authenticateUser);

/**
 * GET /api/roadmap/:childId
 * 현재 레벨의 미션 수행 횟수 기반 로드맵 데이터 조회
 */
router.get('/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 1. 자녀 정보 및 현재 레벨/코스 정보 가져오기
    const { data: child, error: childError } = await supabaseAdmin
      .from('children')
      .select('*, current_level:levels(*), current_course:courses(*)')
      .eq('id', childId)
      .single();

    if (childError || !child) return res.status(404).json({ error: 'Child not found' });

    // 2. 현재 레벨에 해당하는 3대 미션 조회
    const { data: missions, error: missionError } = await supabaseAdmin
      .from('daily_missions')
      .select('*, book:books(*)')
      .eq('level_id', child.current_level_id)
      .order('sequence_order', { ascending: true });

    if (missionError) throw missionError;

    // 3. [최적화] 미션 수행 기록 한 번에 조회 (N+1 문제 해결)
    // 미션에 연결된 책 ID 목록 추출
    const bookIds = missions
      .map((m) => m.book_id)
      .filter((id) => id !== null);

    // 해당 자녀가 읽은 책 중, 이번 레벨 미션에 포함된 책들의 로그만 조회
    const { data: logs, error: logError } = await supabaseAdmin
      .from('mission_logs')
      .select('book_id')
      .eq('child_id', childId)
      .in('book_id', bookIds);

    if (logError) throw logError;

    // 책 별로 읽은 횟수 메모리 내 집계
    const readCounts = logs.reduce((acc, log) => {
      if (log.book_id) {
        acc[log.book_id] = (acc[log.book_id] || 0) + 1;
      }
      return acc;
    }, {});

    // 4. 미션 데이터에 진행률 매핑
    const missionsWithProgress = missions.map((m) => {
      // book_id가 있으면 집계된 카운트 사용, 없으면(기타 미션) 0 처리
      const count = m.book_id ? (readCounts[m.book_id] || 0) : 0;

      return {
        ...m, // 여기에 description, target_count 등이 모두 포함됩니다.
        current_count: count,
        status: count >= m.target_count ? 'past' : 'current',
        progress_percent: Math.min(Math.round((count / m.target_count) * 100), 100)
      };
    });

    // 5. 레벨 전체 진행률 계산
    const totalProgress = missionsWithProgress.reduce((acc, curr) => acc + curr.progress_percent, 0);
    const overallPercent = missionsWithProgress.length > 0 
      ? Math.round(totalProgress / missionsWithProgress.length) 
      : 0;

    res.json(createSuccessResponse({
      child,
      missions: missionsWithProgress,
      overall_progress: overallPercent
    }));
  } catch (error) {
    next(error);
  }
});

export default router;