/**
 * 전역 에러 핸들링 미들웨어
 * 에러 로깅은 errorLogger에서 이미 처리되므로 여기서는 응답만 처리
 */
export const errorHandler = (err, req, res, next) => {
  // Supabase 에러 처리
  if (err.code && err.message) {
    return res.status(err.status || 500).json({
      error: err.code || 'Internal Server Error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err.details 
      }),
    });
  }

  // Validation 에러 처리 (express-validator)
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      errors: err.array(),
    });
  }

  // Express 에러 처리
  if (err.status) {
    return res.status(err.status).json({
      error: err.name || 'Error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack 
      }),
    });
  }

  // 기본 에러 처리
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      name: err.name 
    }),
  });
};

/**
 * 404 Not Found 핸들러
 */
export const notFoundHandler = (req, res) => {
  console.warn(`\n⚠️  [${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.path}`);
  console.warn(`Query:`, req.query);
  console.warn(`Body:`, req.body);
  console.warn('');
  
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

