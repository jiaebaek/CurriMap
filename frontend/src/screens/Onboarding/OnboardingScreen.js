import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { post, get } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [childId, setChildId] = useState(null);
  
  // Step 1: 자녀 프로필
  const [nickname, setNickname] = useState('');
  const [birthMonths, setBirthMonths] = useState('');
  const [gender, setGender] = useState('');

  // Step 2: 관심사 태그
  const [themes, setThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  // Step 3: 온보딩 질문
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (step === 2) {
      loadThemes();
    } else if (step === 3 && childId) {
      loadQuestions();
    }
  }, [step, childId]);

  const loadThemes = async () => {
    try {
      const data = await get('/admin/themes');
      setThemes(data.data || []);
    } catch (error) {
      console.error('Error loading themes:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const data = await get(`/onboarding/questions/${childId}`);
      setQuestions(data.data.questions || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleStep1Submit = async () => {
    if (!nickname || !birthMonths) {
      Alert.alert('오류', '닉네임과 나이를 입력해주세요.');
      return;
    }

    try {
      const data = await post('/children', {
        nickname,
        birth_months: parseInt(birthMonths),
        gender: gender || null,
      });
      setChildId(data.data.id);
      setStep(2);
    } catch (error) {
      Alert.alert('오류', error.message || '자녀 프로필 생성에 실패했습니다.');
    }
  };

  const handleStep2Submit = async () => {
    if (selectedThemes.length < 3) {
      Alert.alert('오류', '관심사를 3개 이상 선택해주세요.');
      return;
    }

    try {
      await post(`/children/${childId}/interests`, {
        theme_ids: selectedThemes,
      });
      setStep(3);
    } catch (error) {
      Alert.alert('오류', error.message || '관심사 저장에 실패했습니다.');
    }
  };

  const handleQuestionResponse = async (questionId, optionId) => {
    try {
      await post(`/onboarding/responses/${childId}`, {
        question_id: questionId,
        option_id: optionId,
      });
      
      setResponses({ ...responses, [questionId]: optionId });
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 모든 질문 완료, 레벨 계산
        await calculateLevel();
      }
    } catch (error) {
      Alert.alert('오류', error.message || '응답 저장에 실패했습니다.');
    }
  };

  const calculateLevel = async () => {
    try {
      await post(`/onboarding/calculate-level/${childId}`);
      Alert.alert('완료', '온보딩이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error.message || '레벨 계산에 실패했습니다.');
    }
  };

  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  // Step 1: 자녀 프로필
  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>자녀 정보를 입력해주세요</Text>
          
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="아이의 닉네임"
          />

          <Text style={styles.label}>나이 (개월 수)</Text>
          <TextInput
            style={styles.input}
            value={birthMonths}
            onChangeText={setBirthMonths}
            placeholder="예: 36"
            keyboardType="numeric"
          />

          <Text style={styles.label}>성별 (선택)</Text>
          <View style={styles.genderContainer}>
            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderButtonSelected,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g && styles.genderTextSelected,
                  ]}
                >
                  {g === 'male' ? '남아' : g === 'female' ? '여아' : '기타'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStep1Submit}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 2: 관심사 태그
  if (step === 2) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>아이가 좋아하는 것을 선택해주세요</Text>
          <Text style={styles.subtitle}>3개 이상 선택해주세요</Text>

          <View style={styles.themeGrid}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeButton,
                  selectedThemes.includes(theme.id) && styles.themeButtonSelected,
                ]}
                onPress={() => toggleTheme(theme.id)}
              >
                <Text
                  style={[
                    styles.themeText,
                    selectedThemes.includes(theme.id) && styles.themeTextSelected,
                  ]}
                >
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStep2Submit}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 3: 온보딩 질문
  if (step === 3 && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.progress}>
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <Text style={styles.title}>{currentQuestion.question_text}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  responses[currentQuestion.id] === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => handleQuestionResponse(currentQuestion.id, option.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    responses[currentQuestion.id] === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.option_text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text>로딩 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  genderText: {
    fontSize: 14,
    color: '#6b7280',
  },
  genderTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  themeButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  themeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  themeTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  progress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;

