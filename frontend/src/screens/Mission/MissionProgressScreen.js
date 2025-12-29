import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { post } from '../../config/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const MissionProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, childId } = route.params;
  const [reaction, setReaction] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!reaction) {
      Alert.alert('알림', '아이의 반응을 선택해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await post('/missions/complete', {
        child_id: childId,
        book_id: bookId,
        activity_type: 'reading',
        reaction,
      });

      Alert.alert('완료', '미션이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error.message || '미션 완료에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>미션 완료</Text>
        <Text style={styles.subtitle}>
          아이가 이 책을 좋아했나요?
        </Text>

        <View style={styles.reactionContainer}>
          <TouchableOpacity
            style={[
              styles.reactionButton,
              reaction === 'love' && styles.reactionButtonSelected,
            ]}
            onPress={() => setReaction('love')}
          >
            <Text style={styles.reactionEmoji}>😍</Text>
            <Text style={styles.reactionText}>좋아요</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reactionButton,
              reaction === 'soso' && styles.reactionButtonSelected,
            ]}
            onPress={() => setReaction('soso')}
          >
            <Text style={styles.reactionEmoji}>🙂</Text>
            <Text style={styles.reactionText}>보통</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reactionButton,
              reaction === 'hate' && styles.reactionButtonSelected,
            ]}
            onPress={() => setReaction('hate')}
          >
            <Text style={styles.reactionEmoji}>☹️</Text>
            <Text style={styles.reactionText}>별로</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.completeButton, submitting && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={submitting}
        >
          <Text style={styles.completeButtonText}>
            {submitting ? '처리 중...' : '완료하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 32,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  reactionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 100,
  },
  reactionButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  reactionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  reactionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  completeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MissionProgressScreen;

