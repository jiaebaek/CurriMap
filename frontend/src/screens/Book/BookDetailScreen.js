import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import { get } from '../../config/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // 홈 화면에서 전달받은 파라미터
  const { bookId, childId } = route.params; 
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const data = await get(`/books/${bookId}`);
      setBook(data.data);
    } catch (error) {
      console.error('❌ [BookDetail] Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>도서 정보를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonInline}>
          <Text style={styles.backButtonTextInline}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 커스텀 헤더 (뒤로가기 버튼) */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>도서 상세</Text>
        <View style={{ width: 28 }} /> {/* 좌우 밸런스용 공백 */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {book.cover_image_url && (
          <Image
            source={{ uri: book.cover_image_url }}
            style={styles.coverImage}
            resizeMode="contain"
          />
        )}

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <View style={styles.arBadge}>
              <Text style={styles.arText}>AR {book.ar_level || 'N/A'}</Text>
            </View>
          </View>

          {book.mom_tip && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 엄마표 팁</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>{book.mom_tip}</Text>
              </View>
            </View>
          )}

          {book.key_words && book.key_words.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔑 핵심 단어</Text>
              <View style={styles.keywords}>
                {book.key_words.map((word, index) => (
                  <View key={index} style={styles.keyword}>
                    <Text style={styles.keywordText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 하단 액션 버튼 */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.missionButton}
              onPress={() =>
                navigation.navigate('MissionProgress', { 
                  bookId: book.id, 
                  childId: childId // 넘겨받은 childId 전달
                })
              }
            >
              <Text style={styles.missionButtonText}>미션 시작하기</Text>
            </TouchableOpacity>

            {book.purchase_url && (
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => {
                  // Linking API 등을 이용한 구매 페이지 연결 가능
                }}
              >
                <Text style={styles.purchaseButtonText}>구매 정보 확인</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  backButton: {
    padding: 4,
  },
  coverImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f9fafb',
    marginTop: 10,
  },
  content: {
    padding: 24,
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  arBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  arText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  tipText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  keywordText: {
    fontSize: 14,
    color: '#4b5563',
  },
  actionContainer: {
    marginTop: 20,
    gap: 12,
  },
  missionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  missionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  purchaseButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  purchaseButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonInline: {
    marginTop: 20,
    padding: 10,
  },
  backButtonTextInline: {
    color: '#6366f1',
    fontWeight: '600',
  }
});

export default BookDetailScreen;