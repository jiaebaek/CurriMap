import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [child, setChild] = useState(null);
  const [dailyMission, setDailyMission] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. 로그인한 사용자의 자녀 정보 목록 조회
      const childResponse = await get('/children');
      
      if (childResponse.data && childResponse.data.length > 0) {
        // 첫 번째 자녀를 활성 자녀로 설정 (추후 자녀 선택 기능 추가 가능)
        const activeChild = childResponse.data[0];
        setChild(activeChild);

        // 2. 해당 자녀의 ID로 오늘의 미션 조회
        const missionData = await get(`/books/daily/${activeChild.id}`);
        setDailyMission(missionData.data);

        // 3. 해당 자녀의 학습 통계 조회
        const statsData = await get(`/missions/${activeChild.id}/stats`);
        setStats(statsData.data);
      } else {
        // 자녀 정보가 없는 경우 온보딩으로 이동
        console.log('ℹ️ [Home] No child profile found. Redirecting to Onboarding...');
        setChild(null);
      }
    } catch (error) {
      console.error('❌ [Home] Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 로딩 중 표시
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>아이의 로드맵을 불러오는 중...</Text>
      </View>
    );
  }

  // 자녀 정보가 없을 때의 화면 (예외 처리)
  if (!child) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.noChildText}>등록된 자녀 정보가 없습니다. 🧐</Text>
        <Text style={styles.noChildSubText}>먼저 아이의 프로필을 만들어주세요.</Text>
        <TouchableOpacity
          style={styles.onboardingButton}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.onboardingButtonText}>온보딩 시작하기</Text>
        </TouchableOpacity>
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
        <Text style={styles.greeting}>{child.nickname} 안녕! 👋</Text>
        <Text style={styles.subtitle}>오늘도 즐겁게 영어랑 놀아볼까?</Text>
      </View>

      {/* 통계 요약 */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total_books_read || 0}</Text>
            <Text style={styles.statLabel}>읽은 책</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.current_streak || 0}</Text>
            <Text style={styles.statLabel}>연속 학습일</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {stats.total_word_count ? Math.floor(stats.total_word_count / 1000) : 0}K
            </Text>
            <Text style={styles.statLabel}>누적 단어</Text>
          </View>
        </View>
      )}

      {/* 오늘의 미션 */}
      {dailyMission && dailyMission.book ? (
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
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{dailyMission.book.title}</Text>
              <Text style={styles.bookAuthor}>{dailyMission.book.author}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.arBadge}>
                  <Text style={styles.arText}>AR {dailyMission.book.ar_level || 'N/A'}</Text>
                </View>
                {dailyMission.recommendation_reason && (
                  <Text style={styles.reasonText}>✨ {dailyMission.recommendation_reason}</Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={() =>
                navigation.navigate('MissionProgress', {
                  bookId: dailyMission.book.id,
                  childId: child.id,
                })
              }
            >
              <Text style={styles.startButtonText}>미션 시작하기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.missionContainer}>
          <Text style={styles.sectionTitle}>📖 오늘의 미션</Text>
          <View style={styles.emptyMissionCard}>
            <Text style={styles.emptyText}>오늘은 모든 미션을 완료했어요! 🎉</Text>
            <Text style={styles.emptySubText}>검색에서 다른 책을 찾아보거나 로드맵을 확인해보세요.</Text>
          </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    elevation: 2, // Android 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  missionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 3,
  },
  bookInfo: {
    marginBottom: 16,
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
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  arText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  otherBookButton: {
    margin: 16,
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  otherBookText: {
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  noChildText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  noChildSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  onboardingButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  onboardingButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyMissionCard: {
    padding: 30,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  }
});

export default HomeScreen;