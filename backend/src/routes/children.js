import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js'; // supabaseAdmin 추가
import { authenticateUser } from '../middleware/auth.js';
import { validateChildProfile, validateInterests } from '../utils/validators.js';
import { createSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateUser);

/**
 * GET /api/children
 * 현재 사용자의 자녀 목록 조회
 */
router.get('/', async (req, res, next) => {
  try {
    // RLS 우회를 위해 supabaseAdmin 사용
    const { data: children, error } = await supabaseAdmin
      .from('children')
      .select(`
        *,
        current_level:levels(*),
        current_course:courses(*)
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(createSuccessResponse(children));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/children/:childId
 * 특정 자녀 정보 조회
 */
router.get('/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    const { data: child, error } = await supabaseAdmin
      .from('children')
      .select(`
        *,
        current_level:levels(*),
        current_course:courses(*),
        interests:child_interests(
          theme:themes(*)
        )
      `)
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (error || !child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    res.json(createSuccessResponse(child));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/children
 * 자녀 프로필 생성
 */
router.post('/', validateChildProfile, async (req, res, next) => {
  try {
    const { nickname, birth_months, gender } = req.body;

    const { data: child, error } = await supabaseAdmin
      .from('children')
      .insert({
        user_id: req.userId,
        nickname,
        birth_months,
        gender: gender || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.status(201).json(createSuccessResponse(child, 'Child profile created successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/children/:childId/interests
 * 자녀 관심사 태그 설정
 */
router.post('/:childId/interests', validateInterests, async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { theme_ids } = req.body;

    // 1. 자녀 소유권 확인 (supabaseAdmin 사용으로 RLS 우회)
    const { data: existingChild, error: checkError } = await supabaseAdmin
      .from('children')
      .select('id')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (checkError || !existingChild) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 2. 기존 관심사 삭제
    await supabaseAdmin
      .from('child_interests')
      .delete()
      .eq('child_id', childId);

    // 3. 새 관심사 추가
    const interests = theme_ids.map((theme_id) => ({
      child_id: parseInt(childId),
      theme_id,
    }));

    const { data: insertedInterests, error } = await supabaseAdmin
      .from('child_interests')
      .insert(interests)
      .select(`
        *,
        theme:themes(*)
      `);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.status(201).json(createSuccessResponse(insertedInterests, 'Interests updated successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/children/:childId/can-level-up
 * 특정 자녀의 레벨업 가능 여부 확인
 */
router.get('/:childId/can-level-up', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 1. 자녀 소유권 확인
    const { data: child, error: checkError } = await supabaseAdmin
      .from('children')
      .select('id')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (checkError || !child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 2. DB 함수 호출하여 레벨업 가능 여부 확인
    const { data: canLevelUp, error: rpcError } = await supabaseAdmin.rpc(
      'check_level_up_eligibility',
      { p_child_id: childId }
    );

    if (rpcError) {
      return res.status(500).json({
        error: 'Database RPC Error',
        message: rpcError.message,
      });
    }

    res.json(createSuccessResponse({ canLevelUp }));
  } catch (error) {
    next(error);
  }
});

export default router;