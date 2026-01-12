import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigation = useNavigation();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        // 회원가입 성공 후 세션이 있으면 온보딩으로 이동
        if (result.session) {
          Alert.alert('성공', '회원가입이 완료되었습니다.');
          // AuthContext의 상태 업데이트로 AppNavigator가 자동으로 전환됨
          // 하지만 명시적으로 온보딩으로 이동
          navigation.navigate('Onboarding');
        } else {
          // 이메일 확인이 필요한 경우
          Alert.alert(
            '이메일 확인 필요',
            '회원가입이 완료되었습니다. 이메일을 확인해주세요.'
          );
        }
      } else {
        // 로그인
        await signIn(email, password);
        // AuthContext의 상태 업데이트로 AppNavigator가 자동으로 MainTabs로 전환됨
        // 명시적인 네비게이션은 필요 없음
      }
    } catch (error) {
      console.error('❌ [Auth] Auth error:', error);
      let errorMessage = '인증에 실패했습니다.';
      
      // Supabase 에러 메시지 처리
      if (error.code === 'invalid_credentials' || error.message?.includes('Invalid login credentials')) {
        // 이메일 확인이 안 된 경우일 가능성이 높음
        errorMessage = `로그인에 실패했습니다.\n\n입력한 이메일: ${email}\n\n가능한 원인:\n1. 이메일 확인이 필요합니다\n   → Supabase 대시보드에서 이메일 확인을 비활성화하거나\n   → 이메일 받은편지함에서 인증 링크를 클릭하세요\n\n2. 비밀번호가 올바르지 않습니다\n   → 회원가입 시 사용한 비밀번호를 확인하세요\n\n3. 회원가입이 완료되지 않았습니다\n   → 회원가입 화면에서 다시 시도하세요\n\n💡 빠른 해결 방법 (개발 환경):\nSupabase 대시보드 → Authentication → Settings\n→ "Enable email confirmations" 비활성화`;
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 완료되지 않았습니다.\n이메일을 확인하여 인증 링크를 클릭해주세요.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = '이미 등록된 이메일입니다.';
      } else if (error.message?.includes('Password')) {
        errorMessage = '비밀번호가 올바르지 않습니다.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // 디버깅을 위한 추가 정보
      console.log('❌ [Auth] Full error object:', JSON.stringify(error, null, 2));
      
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>CurriMap</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? '회원가입' : '로그인'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? '이미 계정이 있으신가요? 로그인'
              : '계정이 없으신가요? 회원가입'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#6366f1',
    fontSize: 14,
  },
});

export default AuthScreen;

