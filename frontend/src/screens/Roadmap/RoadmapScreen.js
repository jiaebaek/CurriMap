import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { get } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const RoadmapScreen = () => {
  const navigation = useNavigation();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const childId = 1; // 임시

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const data = await get(`/roadmap/${childId}`);
      setRoadmap(data.data);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!roadmap) {
    return (
      <View style={styles.container}>
        <Text>로드맵 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>로드맵</Text>
        <Text style={styles.subtitle}>
          {roadmap.child.current_course?.name || '코스'}
        </Text>
      </View>

      {roadmap.progress && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            진행률: {roadmap.progress.progress_percent || 0}%
          </Text>
        </View>
      )}

      <View style={styles.booksContainer}>
        {roadmap.books.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.bookItem,
              item.status === 'past' && styles.bookItemPast,
              item.status === 'future' && styles.bookItemFuture,
            ]}
            onPress={() =>
              navigation.navigate('BookDetail', { bookId: item.book.id })
            }
          >
            <Text
              style={[
                styles.bookTitle,
                item.status === 'past' && styles.bookTitlePast,
                item.status === 'future' && styles.bookTitleFuture,
              ]}
            >
              {item.book.title}
            </Text>
            <Text style={styles.bookAuthor}>{item.book.author}</Text>
            {item.status === 'past' && item.read_count > 0 && (
              <Text style={styles.readCount}>
                {item.read_count}번 읽음
              </Text>
            )}
            {item.status === 'future' && (
              <Text style={styles.lockedText}>🔒</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  progressText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  booksContainer: {
    padding: 16,
  },
  bookItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  bookItemPast: {
    borderColor: '#e5e7eb',
    opacity: 0.6,
  },
  bookItemFuture: {
    borderColor: '#e5e7eb',
    opacity: 0.4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  bookTitlePast: {
    color: '#6b7280',
  },
  bookTitleFuture: {
    color: '#9ca3af',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  readCount: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 4,
  },
  lockedText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default RoadmapScreen;

