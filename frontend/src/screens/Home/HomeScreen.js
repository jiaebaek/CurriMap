import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [dailyMission, setDailyMission] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 임시: 첫 번째 자녀 ID 사용 (실제로는 선택된 자녀 사용)
  const childId = 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 오늘의 미션 조회
      const missionData = await get(`/books/daily/${childId}`);
      setDailyMission(missionData.data);

      // 통계 조회
      const statsData = await get(`/missions/${childId}/stats`);
      setStats(statsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요! 👋</Text>
        <Text style={styles.subtitle}>오늘도 함께 영어를 배워요</Text>
      </View>

      {/* 통계 요약 */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total_books_read}</Text>
            <Text style={styles.statLabel}>읽은 책</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.current_streak}</Text>
            <Text style={styles.statLabel}>연속 학습일</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {Math.floor(stats.total_word_count / 1000)}K
            </Text>
            <Text style={styles.statLabel}>누적 단어</Text>
          </View>
        </View>
      )}

      {/* 오늘의 미션 */}
      {dailyMission && (
        <View style={styles.missionContainer}>
          <Text style={styles.sectionTitle}>📖 오늘의 미션</Text>
          <TouchableOpacity
            style={styles.missionCard}
            onPress={() =>
              navigation.navigate('BookDetail', {
                bookId: dailyMission.book.id,
              })
            }
          >
            <Text style={styles.bookTitle}>{dailyMission.book.title}</Text>
            <Text style={styles.bookAuthor}>{dailyMission.book.author}</Text>
            <Text style={styles.bookLevel}>
              AR {dailyMission.book.ar_level || 'N/A'}
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() =>
                navigation.navigate('MissionProgress', {
                  bookId: dailyMission.book.id,
                  childId,
                })
              }
            >
              <Text style={styles.startButtonText}>미션 시작하기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      {/* 다른 책 기록하기 */}
      <TouchableOpacity
        style={styles.otherBookButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.otherBookText}>
          오늘 다른 책을 읽었어요 📚
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  missionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  bookLevel: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  otherBookButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  otherBookText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
});

export default HomeScreen;

