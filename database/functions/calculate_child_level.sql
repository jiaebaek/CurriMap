CREATE OR REPLACE FUNCTION calculate_child_level(p_child_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
    v_birth_months INTEGER;
    v_age_group VARCHAR(20);
    v_total_score INTEGER;
    v_level_id INTEGER;
BEGIN
    -- 1. 자녀 나이 가져오기
    SELECT birth_months INTO v_birth_months
    FROM children
    WHERE id = p_child_id;
    
    -- 2. 연령 그룹 결정
    v_age_group := CASE
        WHEN v_birth_months < 48 THEN 'infant'           -- 0~3세
        WHEN v_birth_months < 84 THEN 'preschool'        -- 4~6세
        WHEN v_birth_months < 120 THEN 'lower_elem'      -- 초1~3
        ELSE 'upper_elem'                                 -- 초4~6
    END;
    
    -- 3. 응답 점수 합계 계산 (현재 응답 테이블 구조 반영)
    SELECT COALESCE(SUM(qo.score), 0) INTO v_total_score
    FROM onboarding_responses or_table
    JOIN question_options qo ON or_table.option_id = qo.id
    JOIN onboarding_questions oq ON qo.question_id = oq.id
    WHERE or_table.child_id = p_child_id
      AND oq.age_group = v_age_group;
    
    -- 4. 점수 구간에 맞는 레벨 찾기
    SELECT level_id INTO v_level_id
    FROM level_thresholds
    WHERE age_group = v_age_group
      AND v_total_score BETWEEN min_score AND max_score
    LIMIT 1;
    
    -- 5. 레벨이 없으면 연령 기반 기본 레벨 할당
    IF v_level_id IS NULL THEN
        v_level_id := assign_level_by_age(v_birth_months);
    END IF;
    
    RETURN v_level_id;
END;
$$ LANGUAGE plpgsql;