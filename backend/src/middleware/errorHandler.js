/**
 * 전역 에러 핸들링 미들웨어
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase 에러 처리
  if (err.code && err.message) {
    return res.status(err.status || 500).json({
      error: err.code || 'Internal Server Error',
      message: err.message,
    });
  }

  // Express 에러 처리
  if (err.status) {
    return res.status(err.status).json({
      error: err.name || 'Error',
      message: err.message,
    });
  }

  // 기본 에러 처리
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

/**
 * 404 Not Found 핸들러
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

