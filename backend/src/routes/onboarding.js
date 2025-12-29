import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateOnboardingResponse } from '../utils/validators.js';
import { createSuccessResponse, getAgeGroup } from '../utils/helpers.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * GET /api/onboarding/questions/:childId
 * 자녀의 연령에 맞는 온보딩 질문 조회
 */
router.get('/questions/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 정보 조회
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('birth_months')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (childError || !child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 연령 그룹 결정
    const ageGroup = getAgeGroup(child.birth_months);

    // 해당 연령 그룹의 질문 조회
    const { data: questions, error: questionsError } = await supabase
      .from('onboarding_questions')
      .select(`
        *,
        options:question_options(*)
      `)
      .eq('age_group', ageGroup)
      .order('question_order', { ascending: true });

    if (questionsError) {
      return res.status(500).json({
        error: 'Database Error',
        message: questionsError.message,
      });
    }

    // 옵션을 question_order와 option_order로 정렬
    const formattedQuestions = questions.map((q) => ({
      ...q,
      options: q.options.sort((a, b) => a.option_order - b.option_order),
    }));

    res.json(createSuccessResponse({
      child_id: parseInt(childId),
      age_group: ageGroup,
      questions: formattedQuestions,
    }));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/onboarding/responses/:childId
 * 온보딩 질문 응답 저장
 */
router.post('/responses/:childId', validateOnboardingResponse, async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { question_id, option_id } = req.body;

    // 자녀 소유권 확인
    const { data: existingChild } = await supabase
      .from('children')
      .select('id')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (!existingChild) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 응답 저장 (중복 시 업데이트)
    const { data: response, error } = await supabase
      .from('onboarding_responses')
      .upsert({
        child_id: parseInt(childId),
        question_id,
        option_id,
        responded_at: new Date().toISOString(),
      }, {
        onConflict: 'child_id,question_id',
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.status(201).json(createSuccessResponse(response, 'Response saved successfully'));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/onboarding/calculate-level/:childId
 * 온보딩 완료 후 레벨 자동 계산 및 업데이트
 */
router.post('/calculate-level/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 자녀 정보 조회
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('birth_months')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (childError || !child) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    // 레벨 계산 함수 호출 (Supabase Admin 사용)
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Server Error',
        message: 'Admin client not configured',
      });
    }

    const { data: levelId, error: levelError } = await supabaseAdmin.rpc(
      'calculate_child_level',
      { p_child_id: parseInt(childId) }
    );

    if (levelError || !levelId) {
      return res.status(500).json({
        error: 'Calculation Error',
        message: levelError?.message || 'Failed to calculate level',
      });
    }

    // 기본 코스 배정 (레벨에 맞는 코스 찾기)
    const ageGroup = getAgeGroup(child.birth_months);
    let defaultCourseId = null;

    if (ageGroup === 'infant') {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('code', 'YELLOW_BASIC')
        .single();
      defaultCourseId = course?.id;
    } else if (ageGroup === 'preschool') {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('code', 'GREEN_PHONICS')
        .single();
      defaultCourseId = course?.id;
    } else if (ageGroup === 'lower_elem') {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('code', 'BLUE_READER')
        .single();
      defaultCourseId = course?.id;
    } else if (ageGroup === 'upper_elem') {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('code', 'PURPLE_CHAPTER')
        .single();
      defaultCourseId = course?.id;
    }

    // 자녀 레벨 및 코스 업데이트
    const { data: updatedChild, error: updateError } = await supabase
      .from('children')
      .update({
        current_level_id: levelId,
        current_course_id: defaultCourseId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', childId)
      .select(`
        *,
        current_level:levels(*),
        current_course:courses(*)
      `)
      .single();

    if (updateError) {
      return res.status(500).json({
        error: 'Update Error',
        message: updateError.message,
      });
    }

    res.json(createSuccessResponse({
      child: updatedChild,
      calculated_level_id: levelId,
    }, 'Level calculated and updated successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;

