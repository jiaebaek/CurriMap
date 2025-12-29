import { body, validationResult } from 'express-validator';

/**
 * 유효성 검사 결과 처리 미들웨어
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * 자녀 프로필 생성 유효성 검사
 */
export const validateChildProfile = [
  body('nickname')
    .trim()
    .notEmpty()
    .withMessage('Nickname is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Nickname must be between 1 and 50 characters'),
  body('birth_months')
    .isInt({ min: 0, max: 144 })
    .withMessage('Birth months must be between 0 and 144'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  handleValidationErrors,
];

/**
 * 관심사 태그 선택 유효성 검사
 */
export const validateInterests = [
  body('theme_ids')
    .isArray({ min: 1 })
    .withMessage('At least one theme must be selected')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('theme_ids must be a non-empty array');
      }
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error('All theme_ids must be positive integers');
      }
      return true;
    }),
  handleValidationErrors,
];

/**
 * 온보딩 응답 유효성 검사
 */
export const validateOnboardingResponse = [
  body('question_id')
    .isInt({ min: 1 })
    .withMessage('question_id must be a positive integer'),
  body('option_id')
    .isInt({ min: 1 })
    .withMessage('option_id must be a positive integer'),
  handleValidationErrors,
];

/**
 * 미션 완료 유효성 검사
 */
export const validateMissionComplete = [
  body('book_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('book_id must be a positive integer'),
  body('activity_type')
    .isIn(['reading', 'video', 'focused_listening', 'background_listening'])
    .withMessage('activity_type must be one of: reading, video, focused_listening, background_listening'),
  body('reaction')
    .optional()
    .isIn(['love', 'soso', 'hate'])
    .withMessage('reaction must be one of: love, soso, hate'),
  body('course_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('course_id must be a positive integer'),
  handleValidationErrors,
];

/**
 * 도서 검색 필터 유효성 검사
 */
export const validateBookSearch = [
  body('min_ar')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('min_ar must be a non-negative number'),
  body('max_ar')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('max_ar must be a non-negative number'),
  body('theme_ids')
    .optional()
    .isArray()
    .withMessage('theme_ids must be an array'),
  body('mood_ids')
    .optional()
    .isArray()
    .withMessage('mood_ids must be an array'),
  body('sort')
    .optional()
    .isIn(['latest', 'popular'])
    .withMessage('sort must be latest or popular'),
  handleValidationErrors,
];

