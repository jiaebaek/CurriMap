import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation Error', message: 'Invalid input data', errors: errors.array() });
  }
  next();
};

export const validateChildProfile = [
  body('nickname').trim().notEmpty().withMessage('Nickname is required'),
  body('birth_months').isInt({ min: 0, max: 144 }),
  handleValidationErrors,
];

export const validateInterests = [
  body('theme_ids').isArray({ min: 1 }),
  handleValidationErrors,
];

export const validateOnboardingResponse = [
  body('question_id').isInt({ min: 1 }),
  body('option_id').isInt({ min: 1 }),
  handleValidationErrors,
];

/**
 * 미션 완료 유효성 검사 (기획에 충실하게 수정)
 */
export const validateMissionComplete = [
  body('child_id').isInt({ min: 1 }),
  body('book_id').optional().isInt({ min: 1 }),
  body('activity_type')
    .isIn(['reading', 'video', 'focused_listening', 'background_listening'])
    .withMessage('Invalid activity type'),
  body('reaction')
    .optional()
    // 3단계 반응 체계 유지
    .isIn(['love', 'soso', 'hate'])
    .withMessage('Reaction must be one of: love, soso, hate'),
  handleValidationErrors,
];

export const validateBookSearch = [
  body('min_ar').optional().isFloat({ min: 0 }),
  body('max_ar').optional().isFloat({ min: 0 }),
  body('theme_ids').optional().isArray(),
  body('mood_ids').optional().isArray(),
  body('sort').optional().isIn(['latest', 'popular']),
  handleValidationErrors,
];