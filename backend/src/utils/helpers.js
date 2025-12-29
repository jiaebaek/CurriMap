/**
 * 자녀의 연령 그룹 결정
 * @param {number} birthMonths - 나이(개월 수)
 * @returns {string} 연령 그룹 코드
 */
export const getAgeGroup = (birthMonths) => {
  if (birthMonths < 48) return 'infant'; // 0~3세
  if (birthMonths < 84) return 'preschool'; // 4~6세
  if (birthMonths < 120) return 'lower_elem'; // 초1~3
  return 'upper_elem'; // 초4~6
};

/**
 * 에러 응답 생성 헬퍼
 */
export const createErrorResponse = (status, message, details = null) => {
  const response = {
    error: getErrorName(status),
    message,
  };
  if (details) {
    response.details = details;
  }
  return { status, response };
};

/**
 * HTTP 상태 코드에 따른 에러 이름 반환
 */
const getErrorName = (status) => {
  const errorNames = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  return errorNames[status] || 'Error';
};

/**
 * 성공 응답 생성 헬퍼
 */
export const createSuccessResponse = (data, message = null) => {
  const response = { data };
  if (message) {
    response.message = message;
  }
  return response;
};

/**
 * 페이지네이션 파라미터 파싱
 */
export const parsePagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * 페이지네이션 메타데이터 생성
 */
export const createPaginationMeta = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};

