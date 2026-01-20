import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { post, get } from '../../config/api';

const OnboardingScreen = () => {
  const { refreshOnboardingStatus } = useAuth(); // 전역 상태 갱신 함수 가져오기
  const [step, setStep] = useState(1);
  const [childId, setChildId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [nickname, setNickname] = useState('');
  const [birthMonths, setBirthMonths] = useState('');
  const [gender, setGender] = useState('');

  const [themes, setThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (step === 2) loadThemes();
    else if (step === 3 && childId) loadQuestions();
  }, [step, childId]);

  const loadThemes = async () => {
    try {
      const data = await get('/admin/themes');
      setThemes(data.data || []);
    } catch (error) { console.error(error); }
  };

  const loadQuestions = async () => {
    try {
      const data = await get(`/onboarding/questions/${childId}`);
      setQuestions(data.data.questions || []);
    } catch (error) { console.error(error); }
  };

  const handleStep1Submit = async () => {
    if (!nickname || !birthMonths) return Alert.alert('오류', '입력란을 채워주세요.');
    setLoading(true);
    try {
      const data = await post('/children', { nickname, birth_months: parseInt(birthMonths), gender: gender || null });
      setChildId(data.data.id);
      setStep(2);
    } catch (error) { Alert.alert('오류', error.message); }
    finally { setLoading(false); }
  };

  const handleStep2Submit = async () => {
    if (selectedThemes.length < 3) return Alert.alert('오류', '관심사를 3개 이상 선택해주세요.');
    setLoading(true);
    try {
      await post(`/children/${childId}/interests`, { theme_ids: selectedThemes });
      setStep(3);
    } catch (error) { Alert.alert('오류', error.message); }
    finally { setLoading(false); }
  };

  const handleQuestionResponse = async (questionId, optionId) => {
    try {
      await post(`/onboarding/responses/${childId}`, { question_id: questionId, option_id: optionId });
      setResponses({ ...responses, [questionId]: optionId });
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await calculateLevel();
      }
    } catch (error) { Alert.alert('오류', error.message); }
  };

  const calculateLevel = async () => {
    try {
      // 1. 서버에서 레벨 계산 수행
      await post(`/onboarding/calculate-level/${childId}`);
      
      // 2. 전역 상태를 갱신하여 AppNavigator가 Home으로 화면을 전환하게 함
      refreshOnboardingStatus();
      
      Alert.alert('완료', '온보딩이 완료되었습니다!');
    } catch (error) { 
      Alert.alert('오류', '레벨 계산 중 문제가 발생했습니다.'); 
    }
  };

  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    else setSelectedThemes([...selectedThemes, themeId]);
  };

  // ... 렌더링 로직 (Step 1, 2, 3) 이전 코드와 동일
  if (step === 1) {
    return (
      <ScrollView style={styles.container}><View style={styles.content}>
        <Text style={styles.title}>자녀 정보를 입력해주세요</Text>
        <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="닉네임" />
        <TextInput style={styles.input} value={birthMonths} onChangeText={setBirthMonths} placeholder="나이(개월)" keyboardType="numeric" />
        <TouchableOpacity style={styles.button} onPress={handleStep1Submit} disabled={loading}><Text style={styles.buttonText}>다음</Text></TouchableOpacity>
      </View></ScrollView>
    );
  }

  if (step === 2) {
    return (
      <ScrollView style={styles.container}><View style={styles.content}>
        <Text style={styles.title}>관심사를 선택해주세요(3개 이상)</Text>
        <View style={styles.themeGrid}>{themes.map(t => (
          <TouchableOpacity key={t.id} onPress={() => toggleTheme(t.id)} style={[styles.themeButton, selectedThemes.includes(t.id) && styles.themeButtonSelected]}>
            <Text style={[styles.themeText, selectedThemes.includes(t.id) && styles.themeTextSelected]}>{t.name}</Text>
          </TouchableOpacity>
        ))}</View>
        <TouchableOpacity style={styles.button} onPress={handleStep2Submit} disabled={loading}><Text style={styles.buttonText}>다음</Text></TouchableOpacity>
      </View></ScrollView>
    );
  }

  if (step === 3 && questions.length > 0) {
    const q = questions[currentQuestionIndex];
    return (
      <View style={styles.container}><View style={styles.content}>
        <Text style={styles.progress}>{currentQuestionIndex + 1} / {questions.length}</Text>
        <Text style={styles.title}>{q.question_text}</Text>
        {q.options.map(o => (
          <TouchableOpacity key={o.id} onPress={() => handleQuestionResponse(q.id, o.id)} style={styles.optionButton}>
            <Text style={styles.optionText}>{o.option_text}</Text>
          </TouchableOpacity>
        ))}
      </View></View>
    );
  }

  return <View style={styles.container}><Text>로딩 중...</Text></View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#6366f1', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  themeButton: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 20 },
  themeButtonSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  themeText: { fontSize: 14 },
  themeTextSelected: { color: '#fff' },
  progress: { marginBottom: 10, color: '#666' },
  optionButton: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10 },
  optionText: { fontSize: 16 }
});

export default OnboardingScreen;