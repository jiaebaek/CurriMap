// API URL 설정
// 모바일 기기/에뮬레이터에서 실행 시 localhost 대신 PC의 IP 주소 사용 필요
// Windows: ipconfig 명령어로 IPv4 주소 확인 (예: 192.168.0.1)
const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api').trim();

// 개발 환경에서 API URL 로깅
if (__DEV__) {
  console.log('🔗 [API] API URL:', API_URL);
  console.log('💡 모바일에서 실행 중이라면 localhost 대신 PC IP 주소를 사용하세요');
}

/**
 * API 요청 헬퍼 함수
 */
export const apiRequest = async (endpoint, options = {}) => {
  const startTime = Date.now();
  const { supabase } = await import('./supabase.js');
  
  // 현재 세션에서 액세스 토큰 가져오기
  let token = null;
  try {
    // Supabase는 자동으로 토큰을 갱신하지만, 명시적으로 세션을 가져옴
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('⚠️ [API] Session error:', error.message);
    } else if (data?.session) {
      token = data.session.access_token;
      
      // 토큰 만료 시간 확인 (선택적)
      if (data.session.expires_at) {
        const expiresAt = new Date(data.session.expires_at * 1000);
        const now = new Date();
        if (expiresAt < now) {
          console.warn('⚠️ [API] Token expired, attempting refresh...');
          // Supabase가 자동으로 갱신하지만, 명시적으로 시도
          const { data: refreshedData } = await supabase.auth.refreshSession();
          if (refreshedData?.session) {
            token = refreshedData.session.access_token;
            console.log('✅ [API] Token refreshed successfully');
          }
        }
      }
      
      if (__DEV__ && token) {
        console.log('✅ [API] Session found, token available');
        console.log(`   Token expires at: ${data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'N/A'}`);
      }
    } else {
      console.warn('⚠️ [API] No active session found. User may need to log in.');
    }
  } catch (error) {
    console.error('❌ [API] Failed to get session:', error);
  }

  // URL 생성 시 공백 제거 및 정규화
  const baseUrl = API_URL.trim().replace(/\s+/g, '');
  const cleanEndpoint = endpoint.trim().startsWith('/') ? endpoint.trim() : `/${endpoint.trim()}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // 요청 로깅
  console.log('\n' + '='.repeat(60));
  console.log(`📤 [API] OUTGOING REQUEST`);
  console.log(`Method: ${options.method || 'GET'}`);
  console.log(`URL: ${url}`);
  console.log(`Endpoint: ${endpoint}`);
  if (config.body) {
    try {
      const bodyData = JSON.parse(config.body);
      console.log(`Body:`, JSON.stringify(bodyData, null, 2));
    } catch (e) {
      console.log(`Body:`, config.body);
    }
  }
  console.log(`Has Token: ${token ? 'Yes' : 'No'}`);
  if (!token) {
    console.warn('⚠️ [API] WARNING: No authentication token. Request may fail with 401 Unauthorized.');
    console.warn('💡 Make sure user is logged in before making this request.');
  }
  console.log('='.repeat(60));

  try {
    const response = await fetch(url, config);
    const responseTime = Date.now() - startTime;

    // 응답이 비어있을 수 있으므로 확인
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } else {
      data = {};
    }

    // 응답 로깅
    console.log('\n' + '='.repeat(60));
    console.log(`📥 [API] INCOMING RESPONSE`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${responseTime}ms`);
    console.log(`URL: ${url}`);
    
    if (!response.ok) {
      console.error(`❌ Error Response:`, JSON.stringify(data, null, 2));
      const errorMessage = data.message || data.error || `API request failed with status ${response.status}`;
      console.log('='.repeat(60) + '\n');
      throw new Error(errorMessage);
    }

    console.log(`✅ Success Response:`, JSON.stringify(data, null, 2));
    console.log('='.repeat(60) + '\n');
    
    return data;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('\n' + '⚠'.repeat(30));
    console.error(`❌ [API] ERROR OCCURRED`);
    console.error(`URL: ${url}`);
    console.error(`Method: ${options.method || 'GET'}`);
    console.error(`Response Time: ${responseTime}ms`);
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error instanceof TypeError || error.message.includes('Network request failed')) {
      console.error(`Network Error Details: ${error.message}`);
      console.error('\n🔧 문제 해결 방법:');
      console.error('1. 백엔드 서버가 실행 중인지 확인:');
      console.error('   cd backend && npm run dev');
      console.error('\n2. API URL 확인:');
      console.error(`   현재 URL: ${API_URL}`);
      console.error('\n3. 모바일 기기/에뮬레이터에서 실행 중이라면:');
      console.error('   localhost 대신 PC의 IP 주소를 사용해야 합니다');
      console.error('   예: http://192.168.0.1:3000/api');
      console.error('   Windows에서 IP 확인: ipconfig');
      console.error('   Mac/Linux에서 IP 확인: ifconfig 또는 ip addr');
      console.error('\n4. 환경 변수 설정:');
      console.error('   frontend/.env 파일에 EXPO_PUBLIC_API_URL 설정');
      console.error('   설정 후 Metro Bundler 재시작 필요 (Ctrl+C 후 npm start)');
    }
    
    if (error.stack) {
      console.error(`Stack Trace:`, error.stack);
    }
    console.error('⚠'.repeat(30) + '\n');
    
    // TypeError나 다른 에러를 더 명확한 메시지로 변환
    if (error instanceof TypeError) {
      throw new Error(`Network error: ${error.message}. Check if backend is running at ${API_URL}`);
    }
    throw error;
  }
};

/**
 * GET 요청
 */
export const get = (endpoint) => apiRequest(endpoint, { method: 'GET' });

/**
 * POST 요청
 */
export const post = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * PUT 요청
 */
export const put = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

/**
 * DELETE 요청
 */
export const del = (endpoint) =>
  apiRequest(endpoint, { method: 'DELETE' });

