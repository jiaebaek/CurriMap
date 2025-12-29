import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { get } from '../../config/api';

const ReportScreen = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const childId = 1; // 임시

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [summaryData, monthlyData] = await Promise.all([
        get(`/reports/${childId}/summary`),
        get(`/reports/${childId}/monthly`),
      ]);
      setSummary(summaryData.data);
      setMonthly(monthlyData.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>성장 리포트</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.stats.total_books_read}</Text>
          <Text style={styles.statLabel}>누적 읽은 책</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {Math.floor(summary.stats.total_word_count / 1000)}K
          </Text>
          <Text style={styles.statLabel}>누적 단어 수</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.stats.current_streak}</Text>
          <Text style={styles.statLabel}>연속 학습일</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{summary.stats.longest_streak}</Text>
          <Text style={styles.statLabel}>최장 연속일</Text>
        </View>
      </View>

      {monthly && (
        <View style={styles.monthlyContainer}>
          <Text style={styles.sectionTitle}>이번 달 통계</Text>
          <View style={styles.monthlyStats}>
            <Text style={styles.monthlyStat}>
              총 미션: {monthly.summary.total_missions}회
            </Text>
            <Text style={styles.monthlyStat}>
              읽은 책: {monthly.summary.unique_books_read}권
            </Text>
            <Text style={styles.monthlyStat}>
              노출 단어: {Math.floor(monthly.summary.total_word_count / 1000)}K개
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  monthlyContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  monthlyStats: {
    gap: 8,
  },
  monthlyStat: {
    fontSize: 16,
    color: '#374151',
  },
});

export default ReportScreen;

