/**
 * 요청/응답 로깅 미들웨어
 * 모든 API 요청과 응답을 상세하게 로깅
 */

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatRequest = (req) => {
  return {
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: req.query,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Bearer ***' : undefined,
      'user-agent': req.headers['user-agent'],
    },
    body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.userId || 'anonymous',
  };
};

const formatResponse = (res, responseTime) => {
  return {
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
  };
};

/**
 * 요청 로깅 미들웨어
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // 요청 정보 로깅
  const requestInfo = formatRequest(req);
  console.log('\n' + '='.repeat(80));
  console.log(`[${getTimestamp()}] 📥 INCOMING REQUEST`);
  console.log(`Method: ${requestInfo.method}`);
  console.log(`URL: ${requestInfo.url}`);
  console.log(`Path: ${requestInfo.path}`);
  if (requestInfo.query && Object.keys(requestInfo.query).length > 0) {
    console.log(`Query:`, requestInfo.query);
  }
  if (requestInfo.body) {
    console.log(`Body:`, JSON.stringify(requestInfo.body, null, 2));
  }
  console.log(`User ID: ${requestInfo.userId}`);
  console.log(`IP: ${requestInfo.ip}`);
  console.log('='.repeat(80));

  // 응답 완료 시 로깅
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;
    const responseInfo = formatResponse(res, responseTime);
    
    console.log('\n' + '='.repeat(80));
    console.log(`[${getTimestamp()}] 📤 OUTGOING RESPONSE`);
    console.log(`Status: ${responseInfo.statusCode}`);
    console.log(`Response Time: ${responseInfo.responseTime}`);
    
    // 응답 본문 로깅 (너무 크면 요약만)
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      const dataString = JSON.stringify(parsedData, null, 2);
      
      if (dataString.length > 1000) {
        console.log(`Response Body: (truncated, ${dataString.length} chars)`);
        console.log(dataString.substring(0, 1000) + '...');
      } else {
        console.log(`Response Body:`, dataString);
      }
    } catch (e) {
      console.log(`Response Body: (non-JSON)`);
    }
    
    console.log('='.repeat(80) + '\n');
    
    return originalSend.call(this, data);
  };

  next();
};

/**
 * 에러 로깅 미들웨어 (에러 핸들러 전에 사용)
 */
export const errorLogger = (err, req, res, next) => {
  const errorInfo = {
    timestamp: getTimestamp(),
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    userId: req.userId || 'anonymous',
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
      status: err.status,
    },
    body: req.body,
    query: req.query,
  };

  console.error('\n' + '⚠'.repeat(40));
  console.error(`[${errorInfo.timestamp}] ❌ ERROR OCCURRED`);
  console.error(`Method: ${errorInfo.method}`);
  console.error(`URL: ${errorInfo.url}`);
  console.error(`User ID: ${errorInfo.userId}`);
  console.error(`Error Name: ${errorInfo.error.name}`);
  console.error(`Error Message: ${errorInfo.error.message}`);
  console.error(`Error Code: ${errorInfo.error.code || 'N/A'}`);
  console.error(`Status Code: ${errorInfo.error.status || 500}`);
  
  if (errorInfo.body && Object.keys(errorInfo.body).length > 0) {
    console.error(`Request Body:`, JSON.stringify(errorInfo.body, null, 2));
  }
  
  if (errorInfo.error.stack) {
    console.error(`Stack Trace:`);
    console.error(errorInfo.error.stack);
  }
  
  console.error('⚠'.repeat(40) + '\n');

  next(err);
};

