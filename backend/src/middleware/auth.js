import { supabase } from '../config/supabase.js';

/**
 * Supabase 인증 토큰 검증 미들웨어
 * 요청 헤더의 Authorization Bearer 토큰을 검증하고 사용자 정보를 req.user에 추가
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    // Supabase에서 토큰 검증
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // 사용자 정보를 req에 추가
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * 선택적 인증 미들웨어 (비회원도 접근 가능하지만, 로그인한 경우 사용자 정보 제공)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }

    next();
  } catch (error) {
    // 에러가 발생해도 계속 진행 (비회원 접근 허용)
    next();
  }
};

