const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * API 요청 헬퍼 함수
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { supabase } = await import('./supabase.js');
  
  // 현재 세션에서 액세스 토큰 가져오기
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
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

