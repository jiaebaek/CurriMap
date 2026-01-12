import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase.js';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    const initializeAuth = async () => {
      try {
        console.log('🔍 [Auth] Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [Auth] Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('✅ [Auth] Existing session found');
          console.log('   User ID:', session.user.id);
          console.log('   Email:', session.user.email);
          
          // 세션의 유효성 검증: 사용자가 실제로 존재하는지 확인
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
            
            if (userError || !user) {
              console.warn('⚠️ [Auth] Session exists but user is invalid, clearing session...');
              console.warn('   Error:', userError?.message || 'User not found');
              // 유효하지 않은 세션 제거
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setLoading(false);
              return;
            }
            
            console.log('✅ [Auth] Session validated, user exists');
          } catch (validationError) {
            console.error('❌ [Auth] Error validating session:', validationError);
            // 검증 실패 시 세션 제거
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
        } else {
          console.log('ℹ️ [Auth] No existing session found');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('❌ [Auth] Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 [Auth] Auth state changed:', event);
      if (session) {
        console.log('   User ID:', session.user.id);
        console.log('   Email:', session.user.email);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    try {
      console.log('📝 [Auth] Attempting sign up...');
      console.log('   Email:', email);
      
      // 이메일 정규화 (공백 제거 및 소문자 변환)
      const normalizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          // 개발 환경에서는 이메일 확인 없이 바로 로그인 가능하도록 설정
          // (Supabase 대시보드에서 이메일 확인을 비활성화한 경우)
          emailRedirectTo: undefined,
        },
      });
      
      if (error) {
        console.error('❌ [Auth] Sign up error:', error);
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        throw error;
      }
      
      console.log('✅ [Auth] Sign up successful');
      console.log('   User ID:', data.user?.id);
      console.log('   Email:', data.user?.email);
      console.log('   Has session:', !!data.session);
      console.log('   Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      
      // 회원가입 성공 후 세션 확인 및 상태 업데이트
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log('✅ [Auth] Session set, user logged in');
      } else {
        // 이메일 확인이 필요한 경우
        console.log('⚠️ [Auth] Sign up successful but email confirmation required');
        console.log('   User needs to confirm email before logging in');
        // 세션이 없어도 상태는 업데이트하지 않음 (이메일 확인 필요)
      }
      
      return data;
    } catch (error) {
      console.error('❌ [Auth] Sign up failed:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('🔐 [Auth] Attempting sign in...');
      console.log('   Email:', email);
      console.log('   Password length:', password.length);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // 공백 제거 및 소문자 변환
        password,
      });
      
      if (error) {
        console.error('❌ [Auth] Sign in error:', error);
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        
        // 더 자세한 에러 정보 제공
        if (error.code === 'invalid_credentials') {
          // 사용자가 존재하는지 확인
          console.log('💡 [Auth] Checking if user exists...');
          // Supabase에서는 직접 사용자 존재 여부를 확인할 수 없지만,
          // 에러 메시지를 더 명확하게 만들 수 있음
        }
        
        throw error;
      }
      
      // 로그인 성공 후 명시적으로 세션 확인 및 상태 업데이트
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setLoading(false);
        console.log('✅ [Auth] Sign in successful, session set');
        console.log('   User ID:', data.session.user.id);
        console.log('   Email:', data.session.user.email);
      } else {
        // 세션이 없는 경우 (이상한 상황)
        console.error('⚠️ [Auth] Sign in successful but no session received');
        // 세션을 다시 가져와서 확인
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw new Error('세션을 가져올 수 없습니다.');
        }
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          setLoading(false);
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ [Auth] Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 [Auth] Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [Auth] Sign out error:', error);
        throw error;
      }
      // 상태도 명시적으로 초기화
      setSession(null);
      setUser(null);
      console.log('✅ [Auth] Sign out successful');
    } catch (error) {
      console.error('❌ [Auth] Sign out failed:', error);
      throw error;
    }
  };

  // 개발용: 세션 강제 클리어 함수
  const clearSession = async () => {
    try {
      console.log('🧹 [Auth] Clearing session...');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      console.log('✅ [Auth] Session cleared');
    } catch (error) {
      console.error('❌ [Auth] Error clearing session:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    clearSession, // 개발용
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

