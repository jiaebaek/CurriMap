import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();
router.use(authenticateUser);

// 오늘의 미션 조회 (홈 화면용)

router.get('/today/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { data: child } = await supabaseAdmin.from('children').select('current_level_id').eq('id', childId).single();

    const { data: missions } = await supabaseAdmin
      .from('daily_missions')
      .select('*, book:books(*)')
      .eq('level_id', child.current_level_id)
      .order('sequence_order', { ascending: true });

    const formattedMissions = await Promise.all(missions.map(async (m) => {
      // ✅ 횟수 집계 로직: 
      // 독서 미션이면 book_id로 찾고, 일반 미션이면 mission_id로 정확히 찾음
      const query = supabaseAdmin
        .from('mission_logs')
        .select('*', { count: 'exact', head: true })
        .eq('child_id', childId);

      if (m.book_id) {
        query.eq('book_id', m.book_id);
      } else {
        query.eq('mission_id', m.id);
      }

      const { count } = await query;

      return {
        ...m,
        // 프론트엔드와 ID 형식을 맞춤 (기존 로직 유지)
        id: m.book_id ? `b-${m.id}` : `g-${m.id}`, 
        current_count: count || 0,
        is_completed: (count || 0) >= m.target_count
      };
    }));

    res.json(createSuccessResponse(formattedMissions));
  } catch (error) { next(error); }
});

// 미션 수행 기록 저장
router.post('/complete', async (req, res, next) => {
  try {
    const { childId, missionId, bookId } = req.body;

    // 🚩 서버 터미널에 로그 출력 (데이터가 어떻게 들어오는지 확인용)
    console.log('📥 [Mission Complete Request]', { childId, missionId, bookId });

    // ID 값들을 숫자로 강제 변환 (문자열 "22"가 들어와도 DB에는 숫자 22로 저장되게 함)
    const payload = {
      child_id: Number(childId),
      mission_id: missionId ? Number(missionId) : null,
      book_id: bookId ? Number(bookId) : null,
      completed_at: new Date()
    };

    // 🚩 변환된 데이터 로그 출력
    console.log('📤 [Formatted Payload]', payload);

    const { data, error } = await supabaseAdmin
      .from('mission_logs')
      .insert(payload)
      .select(); // 저장된 결과 반환 요청

    if (error) {
      console.error('❌ [DB Insert Error]', error);
      return res.status(400).json({ error: error.message });
    }

    // 최신 카운트 계산
    const query = supabaseAdmin
      .from('mission_logs')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', payload.child_id);

    if (payload.book_id) {
      query.eq('book_id', payload.book_id);
    } else {
      query.eq('mission_id', payload.mission_id);
    }

    const { count } = await query;

    res.json(createSuccessResponse({ 
      success: true, 
      updated_count: count || 0 
    }));
  } catch (error) {
    console.error('🔥 [Server Error]', error);
    next(error);
  }
});

export default router;