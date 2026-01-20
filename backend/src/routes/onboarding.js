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

    // 수정: RLS 정책 우회를 위해 supabaseAdmin 사용
    const { data: child, error: childError } = await supabaseAdmin
      .from('children')
      .select('birth_months')
      .eq('id', childId)
      .eq('user_id', req.userId)
      .single();

    if (childError || !child) {
      console.error('❌ [Onboarding] Child not found or error:', childError);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Child not found',
      });
    }

    const ageGroup = getAgeGroup(child.birth_months);

    // 질문 정보 조회 시 supabase 대신 supabaseAdmin 사용
    const { data: questions, error: questionsError } = await supabaseAdmin
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
 * 응답 저장
 */
router.post('/responses/:childId', validateOnboardingResponse, async (req, res, next) => {
  try {
    const { childId } = req.params;
    const { question_id, option_id } = req.body;

    const { data: existingChild } = await supabaseAdmin
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

    const { data: response, error } = await supabaseAdmin
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
 */
router.post('/calculate-level/:childId', async (req, res, next) => {
  try {
    const { childId } = req.params;

    const { data: child, error: childError } = await supabaseAdmin
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

    const ageGroup = getAgeGroup(child.birth_months);
    const courseCodeMap = {
      infant: 'YELLOW_BASIC',
      preschool: 'GREEN_PHONICS',
      lower_elem: 'BLUE_READER',
      upper_elem: 'PURPLE_CHAPTER'
    };

    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('code', courseCodeMap[ageGroup])
      .single();

    const { data: updatedChild, error: updateError } = await supabaseAdmin
      .from('children')
      .update({
        current_level_id: levelId,
        current_course_id: course?.id || null,
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