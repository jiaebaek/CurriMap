import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { get, post } from '../../config/api';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [missions, setMissions] = useState([]);
  const [child, setChild] = useState(null);

  const fetchData = async () => {
    try {
      const childRes = await get('/children');
      if (childRes.data?.length > 0) {
        setChild(childRes.data[0]);
        // 백엔드의 /api/missions/today/:childId 호출
        const res = await get(`/missions/today/${childRes.data[0].id}`);
        setMissions(res.data);
      }
    } catch (e) { console.error(e); }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const handleComplete = async (mission) => {
    // 1. 낙관적 업데이트 (화면 숫자 먼저 올리기)
    const initialCount = mission.current_count;
    setMissions(prev => prev.map(m => 
      m.id === mission.id ? { ...m, current_count: m.current_count + 1 } : m
    ));

    try {
      // 2. ID 정제: "g-22" -> 22 / "b-10" -> 10
      const missionIdStr = String(mission.id);
      const pureId = missionIdStr.includes('-') ? missionIdStr.split('-')[1] : missionIdStr;

      const body = {
        childId: child.id,
        missionId: mission.book_id ? null : parseInt(pureId), // 책 미션이면 mission_id는 제외
        bookId: mission.book_id ? parseInt(mission.book_id) : null
      };

      console.log('🚀 [Request Body]', body);

      const response = await post('/missions/complete', body);

      if (response.data && response.data.updated_count !== undefined) {
        setMissions(prev => prev.map(m => 
          m.id === mission.id ? { ...m, current_count: response.data.updated_count } : m
        ));
      }
    } catch (e) {
      console.error("[API Error]", e);
      setMissions(prev => prev.map(m => m.id === mission.id ? { ...m, current_count: initialCount } : m));
      Alert.alert("알림", "기록에 실패했습니다. 네트워크를 확인해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>안녕하세요, {child?.nickname} 엄마! ✨</Text>
        <Text style={styles.sub}>오늘의 3대 미션을 수행해주세요.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {missions.map((m) => {
          const isDone = m.current_count >= m.target_count;
          const isReading = m.mission_type === 'reading' && m.book;

          return (
            <View key={m.id} style={[styles.card, isDone && styles.cardDone]}>
              <View style={styles.cardHeader}>
                <Text style={styles.mType}>{m.mission_type.toUpperCase()}</Text>
                {isDone && <Ionicons name="checkmark-circle" size={18} color="#10b981" />}
              </View>
              
              <Text style={styles.mTitle}>{m.title}</Text>
              
              {/* 추가된 부분: 독서 미션일 때 책 정보 표시 */}
              {isReading && (
                <TouchableOpacity 
                  style={styles.bookInfoBox}
                  onPress={() => navigation.navigate('BookDetail', { bookId: m.book_id })}
                >
                  <View style={styles.bookTag}>
                    <MaterialCommunityIcons name="book-open-variant" size={14} color="#6366f1" />
                    <Text style={styles.bookTagText}>추천 도서</Text>
                  </View>
                  <Text style={styles.bookTitle}>{m.book.title}</Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>{m.book.author}</Text>
                </TouchableOpacity>
              )}

              <View style={styles.progressRow}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${(m.current_count / m.target_count) * 100}%` }]} />
                </View>
                <Text style={styles.countText}>{m.current_count}/{m.target_count}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.btn, isDone && styles.btnDone]} 
                onPress={() => handleComplete(m)}
                disabled={isDone}
              >
                <Text style={styles.btnText}>{isDone ? "미션 완료 🎉" : "수행 완료 👆"}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 24, backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  sub: { color: '#64748b', marginTop: 4 },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 16, elevation: 4 },
  cardDone: { backgroundColor: '#f0fdf4', borderColor: '#10b981', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mType: { fontSize: 11, fontWeight: 'bold', color: '#6366f1' },
  mTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 4, color: '#1e293b', marginBottom: 12 },
  
  // 책 정보 박스 스타일
  bookInfoBox: { backgroundColor: '#f1f5f9', borderRadius: 16, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  bookTag: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bookTagText: { fontSize: 11, fontWeight: 'bold', color: '#6366f1', marginLeft: 4 },
  bookTitle: { fontSize: 15, fontWeight: 'bold', color: '#334155' },
  bookAuthor: { fontSize: 13, color: '#64748b', marginTop: 2 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  barBg: { flex: 1, height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#10b981' },
  countText: { marginLeft: 12, fontWeight: 'bold', color: '#334155' },
  btn: { backgroundColor: '#6366f1', borderRadius: 16, padding: 16, marginTop: 20, alignItems: 'center' },
  btnDone: { backgroundColor: '#cbd5e1' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});

export default HomeScreen;