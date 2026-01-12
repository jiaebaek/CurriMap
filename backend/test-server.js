/**
 * 백엔드 서버 테스트 스크립트
 * 서버가 실행 중인지 확인하고 간단한 요청을 테스트합니다.
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

const testEndpoint = async (method, endpoint, body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    log(colors.cyan, `\n📤 Testing: ${method} ${endpoint}`);
    if (body) {
      log(colors.blue, `   Body: ${JSON.stringify(body, null, 2)}`);
    }

    const startTime = Date.now();
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const responseTime = Date.now() - startTime;
    const data = await response.json();

    if (response.ok) {
      log(colors.green, `✅ Success (${response.status}) - ${responseTime}ms`);
      log(colors.blue, `   Response: ${JSON.stringify(data, null, 2)}`);
      return { success: true, data, status: response.status };
    } else {
      log(colors.red, `❌ Error (${response.status}) - ${responseTime}ms`);
      log(colors.yellow, `   Error: ${JSON.stringify(data, null, 2)}`);
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    log(colors.red, `❌ Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const runTests = async () => {
  log(colors.cyan, '\n' + '='.repeat(60));
  log(colors.cyan, '🧪 백엔드 서버 테스트 시작');
  log(colors.cyan, `📍 API URL: ${API_URL}`);
  log(colors.cyan, '='.repeat(60));

  // 1. Health Check 테스트
  log(colors.yellow, '\n1️⃣ Health Check 테스트');
  const healthResult = await testEndpoint('GET', '/health');
  
  if (!healthResult.success) {
    log(colors.red, '\n❌ 서버가 실행되지 않았거나 연결할 수 없습니다.');
    log(colors.yellow, '💡 백엔드 서버를 먼저 실행하세요: npm run dev');
    process.exit(1);
  }

  // 2. 존재하지 않는 라우트 테스트 (404 확인)
  log(colors.yellow, '\n2️⃣ 404 에러 테스트');
  await testEndpoint('GET', '/api/nonexistent');

  // 3. 인증이 필요한 엔드포인트 테스트 (401 확인)
  log(colors.yellow, '\n3️⃣ 인증 에러 테스트 (401 예상)');
  await testEndpoint('GET', '/api/children');

  // 4. 잘못된 요청 테스트 (400 확인)
  log(colors.yellow, '\n4️⃣ Validation 에러 테스트 (400 예상)');
  await testEndpoint('POST', '/api/children', {
    nickname: '',
    birth_months: -1,
  });

  log(colors.cyan, '\n' + '='.repeat(60));
  log(colors.green, '✅ 테스트 완료!');
  log(colors.cyan, '='.repeat(60));
  log(colors.yellow, '\n💡 백엔드 콘솔에서 로그를 확인하세요.');
  log(colors.yellow, '   모든 요청과 응답이 상세하게 로깅됩니다.\n');
};

runTests().catch(console.error);


