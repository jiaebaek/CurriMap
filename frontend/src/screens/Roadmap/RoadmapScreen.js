import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, Modal, Pressable
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { get } from '../../config/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const RoadmapScreen = () => {
  const navigation = useNavigation();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 상세 설명을 위한 모달 상태
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const loadRoadmap = async () => {
    try {
      const childRes = await get('/children');
      if (childRes.data?.length > 0) {
        const res = await get(`/roadmap/${childRes.data[0].id}`);
        setRoadmap(res.data);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { loadRoadmap(); }, []));

  const getMissionStyle = (type) => {
    switch (type) {
      case 'reading': return { icon: 'book-open-variant', color: '#10b981', label: '독서' };
      case 'video': return { icon: 'play-circle', color: '#ef4444', label: '영상' };
      case 'audio': return { icon: 'headphones', color: '#3b82f6', label: '음원' };
      default: return { icon: 'star', color: '#8b5cf6', label: '활동' };
    }
  };

  const openDetail = (mission) => {
    setSelectedMission(mission);
    setDetailVisible(true);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6366f1" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>학습 로드맵</Text>
        <Text style={styles.headerSub}>{roadmap?.child?.nickname}의 성장 여정을 확인하세요</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 상단 전체 진행률 카드 */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <View>
              <Text style={styles.label}>현재 단계</Text>
              <Text style={styles.levelName}>{roadmap?.child?.current_level?.name}</Text>
            </View>
            <View style={styles.percentBox}>
              <Text style={styles.percentText}>{roadmap?.overall_progress}%</Text>
              <Text style={styles.percentSub}>완료</Text>
            </View>
          </View>
          <View style={styles.barWrapper}>
            <View style={styles.barBg}><View style={[styles.barFill, { width: `${roadmap?.overall_progress}%` }]} /></View>
            <View style={[styles.barPointer, { left: `${roadmap?.overall_progress}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>🎯 오늘의 3대 미션 가이드</Text>
        <View style={styles.missionList}>
          {roadmap?.missions?.map((m) => {
            const mStyle = getMissionStyle(m.mission_type);
            const isDone = m.status === 'past';

            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.missionCard, isDone && styles.cardPast]}
                onPress={() => openDetail(m)} // 클릭 시 모달 열기
              >
                <View style={styles.cardMain}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name={isDone ? 'check-circle' : mStyle.icon} size={30} color={isDone ? '#10b981' : mStyle.color} />
                  </View>
                  <View style={styles.missionText}>
                    <Text style={styles.mTypeLabel}>{mStyle.label}</Text>
                    <Text style={[styles.mTitle, isDone && styles.textDone]}>{m.title}</Text>
                  </View>
                  <View style={styles.statusBox}>
                    <Text style={[styles.statusPercent, isDone && styles.textActive]}>{m.progress_percent}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* --- 상세 설명 모달 --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={detailVisible}
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalType}>{selectedMission?.mission_type.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => setDetailVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{selectedMission?.title}</Text>
            
            <View style={styles.descBox}>
              <Text style={styles.modalDesc}>{selectedMission?.description || "상세 설명이 등록되지 않았습니다."}</Text>
            </View>

            <View style={styles.goalInfo}>
              <Text style={styles.goalText}>• 목표 횟수: {selectedMission?.target_count}회</Text>
              <Text style={styles.goalText}>• 현재 달성: {selectedMission?.current_count}회</Text>
            </View>

            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => {
                setDetailVisible(false);
                if (selectedMission?.book_id) {
                  navigation.navigate('BookDetail', { bookId: selectedMission.book_id });
                }
              }}
            >
              <Text style={styles.closeBtnText}>
                {selectedMission?.book_id ? "책 상세 정보 보기" : "확인"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  scrollContent: { padding: 20 },
  progressCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 30, elevation: 4 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 13, color: '#64748b' },
  levelName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  percentBox: { alignItems: 'flex-end' },
  percentText: { fontSize: 26, fontWeight: 'bold', color: '#10b981' },
  percentSub: { fontSize: 12, color: '#94a3b8' },
  barWrapper: { height: 24, justifyContent: 'center' },
  barBg: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 5 },
  barFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 5 },
  barPointer: { position: 'absolute', width: 20, height: 20, backgroundColor: '#10b981', borderRadius: 10, borderWidth: 4, borderColor: '#fff', transform: [{translateX: -10}] },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  missionList: { gap: 12 },
  missionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderLeftWidth: 6, borderLeftColor: '#e2e8f0', elevation: 2 },
  cardPast: { borderLeftColor: '#10b981', backgroundColor: '#f0fdf4' },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, alignItems: 'center' },
  missionText: { flex: 1, marginLeft: 15 },
  mTypeLabel: { fontSize: 11, color: '#64748b', fontWeight: 'bold' },
  mTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  textDone: { color: '#94a3b8', textDecorationLine: 'line-through' },
  statusBox: { marginLeft: 10 },
  statusPercent: { fontSize: 15, fontWeight: 'bold', color: '#94a3b8' },
  textActive: { color: '#10b981' },

  // --- 모달 스타일 ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalView: { width: '100%', backgroundColor: '#fff', borderRadius: 30, padding: 30, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalType: { fontSize: 12, fontWeight: 'bold', color: '#6366f1' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  descBox: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 20, marginBottom: 20 },
  modalDesc: { fontSize: 15, color: '#475569', lineHeight: 22 },
  goalInfo: { marginBottom: 25 },
  goalText: { fontSize: 14, color: '#64748b', marginBottom: 5 },
  closeBtn: { backgroundColor: '#6366f1', borderRadius: 16, padding: 18, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default RoadmapScreen;