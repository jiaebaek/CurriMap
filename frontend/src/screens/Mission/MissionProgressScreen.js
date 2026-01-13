import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { post } from '../../config/api';

const MissionProgressScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bookId, childId } = route.params;
  const [loading, setLoading] = useState(false);

  // 미션 완료 처리 함수
  const handleComplete = async (reactionValue) => {
    if (loading) return; // 중복 클릭 방지
    setLoading(true);

    try {
      // 3단계 반응(love, soso, hate)과 필수 활동 유형(reading) 전송
      const response = await post('/missions/complete', {
        child_id: childId,
        book_id: bookId,
        activity_type: 'reading',
        reaction: reactionValue, 
      });

      if (response.data) {
        // 웹 환경에서는 Alert가 로직을 방해할 수 있으므로 즉시 이동하거나 브라우저 알림 사용
        if (Platform.OS === 'web') {
          // 웹일 경우 브라우저 기본 alert 사용 후 즉시 이동
          alert('참 잘했어요! 오늘 독서 미션을 완료했습니다. 🎉');
          navigation.navigate('Home');
        } else {
          // 모바일 환경일 경우 기존 Alert.alert 사용
          Alert.alert('참 잘했어요! 🎉', '오늘의 독서 기록이 저장되었습니다.', [
            { text: '확인', onPress: () => navigation.navigate('Home') }
          ]);
        }
      }
    } catch (error) {
      console.error('❌ [Mission] Complete error:', error);
      const errorMsg = error.message || '데이터 저장 중 문제가 발생했습니다.';
      if (Platform.OS === 'web') alert(errorMsg);
      else Alert.alert('오류', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>책을 다 읽었나요? 📖</Text>
      <Text style={styles.subtitle}>오늘 읽은 책이 어땠는지 알려주세요!</Text>

      <View style={styles.reactionGrid}>
        {/* 'love' 반응 */}
        <TouchableOpacity 
          style={[styles.reactionButton, loading && styles.disabledButton]} 
          onPress={() => handleComplete('love')}
          disabled={loading}
        >
          <Text style={styles.emoji}>😍</Text>
          <Text style={styles.reactionLabel}>최고예요</Text>
        </TouchableOpacity>

        {/* 'soso' 반응 */}
        <TouchableOpacity 
          style={[styles.reactionButton, loading && styles.disabledButton]} 
          onPress={() => handleComplete('soso')}
          disabled={loading}
        >
          <Text style={styles.emoji}>🙂</Text>
          <Text style={styles.reactionLabel}>그저 그래요</Text>
        </TouchableOpacity>

        {/* 'hate' 반응 */}
        <TouchableOpacity 
          style={[styles.reactionButton, loading && styles.disabledButton]} 
          onPress={() => handleComplete('hate')}
          disabled={loading}
        >
          <Text style={styles.emoji}>☹️</Text>
          <Text style={styles.reactionLabel}>별로예요</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loaderText}>기록을 저장하고 있어요...</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.closeButtonText}>나중에 할게요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 40 },
  reactionGrid: { flexDirection: 'row', gap: 20 },
  reactionButton: { alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, width: 95, backgroundColor: '#fff' },
  disabledButton: { opacity: 0.5 },
  emoji: { fontSize: 40, marginBottom: 8 },
  reactionLabel: { fontSize: 12, color: '#374151', fontWeight: '500' },
  loaderContainer: { marginTop: 30, alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#6366f1', fontWeight: '500' },
  closeButton: { marginTop: 60 },
  closeButtonText: { color: '#9ca3af', fontSize: 14, textDecorationLine: 'underline' }
});

export default MissionProgressScreen;