import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회
 */
router.get('/me', authenticateUser, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/signup
 * 회원가입 (Supabase Auth에서 처리되지만, users 테이블에 메타데이터 추가)
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required',
      });
    }

    // Supabase Auth로 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        error: 'Signup Failed',
        message: authError.message,
      });
    }

    // users 테이블에 메타데이터 추가 (트리거로 자동 생성될 수도 있음)
    if (authData.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
        });

      if (userError && userError.code !== '23505') {
        // 중복 키 에러는 무시 (이미 존재하는 경우)
        console.error('Error creating user metadata:', userError);
      }
    }

    res.status(201).json({
      data: {
        user: authData.user,
        session: authData.session,
      },
      message: 'Signup successful',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * 로그인 (Supabase Auth에서 처리)
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required',
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message,
      });
    }

    res.json({
      data: {
        user: data.user,
        session: data.session,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

