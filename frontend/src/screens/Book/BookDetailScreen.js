import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { get } from '../../config/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const childId = 1; // 임시

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const data = await get(`/books/${bookId}`);
      setBook(data.data);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !book) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {book.cover_image_url && (
        <Image
          source={{ uri: book.cover_image_url }}
          style={styles.coverImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.level}>AR {book.ar_level || 'N/A'}</Text>

        {book.themes && book.themes.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>주제</Text>
            <View style={styles.tags}>
              {book.themes.map((bt) => (
                <View key={bt.theme.id} style={styles.tag}>
                  <Text style={styles.tagText}>{bt.theme.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {book.moods && book.moods.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>분위기</Text>
            <View style={styles.tags}>
              {book.moods.map((bm) => (
                <View key={bm.mood.id} style={styles.tag}>
                  <Text style={styles.tagText}>{bm.mood.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {book.mom_tip && (
          <View style={styles.tipContainer}>
            <Text style={styles.sectionTitle}>💡 엄마표 팁</Text>
            <Text style={styles.tipText}>{book.mom_tip}</Text>
          </View>
        )}

        {book.key_words && book.key_words.length > 0 && (
          <View style={styles.keywordsContainer}>
            <Text style={styles.sectionTitle}>핵심 단어</Text>
            <View style={styles.keywords}>
              {book.key_words.map((word, index) => (
                <View key={index} style={styles.keyword}>
                  <Text style={styles.keywordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.missionButton}
          onPress={() =>
            navigation.navigate('MissionProgress', { bookId: book.id, childId })
          }
        >
          <Text style={styles.missionButtonText}>미션 시작하기</Text>
        </TouchableOpacity>

        {book.purchase_url && (
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={() => {
              // 외부 링크 열기 (Linking API 사용 필요)
            }}
          >
            <Text style={styles.purchaseButtonText}>구매하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  coverImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f9fafb',
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
  author: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  level: {
    fontSize: 14,
    color: '#6366f1',
    marginBottom: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  tipContainer: {
    marginBottom: 24,
  },
  tipText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  keywordsContainer: {
    marginBottom: 24,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  missionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  missionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  purchaseButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  purchaseButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookDetailScreen;

