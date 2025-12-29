import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { get } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [minAr, setMinAr] = useState('');
  const [maxAr, setMaxAr] = useState('');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [themes, setThemes] = useState([]);
  const [moods, setMoods] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const [themesData, moodsData] = await Promise.all([
        get('/admin/themes'),
        get('/admin/moods'),
      ]);
      setThemes(themesData.data || []);
      setMoods(moodsData.data || []);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minAr) params.append('min_ar', minAr);
      if (maxAr) params.append('max_ar', maxAr);
      if (selectedThemes.length > 0) {
        selectedThemes.forEach(id => params.append('theme_ids', id));
      }
      if (selectedMoods.length > 0) {
        selectedMoods.forEach(id => params.append('mood_ids', id));
      }

      const data = await get(`/books/search?${params.toString()}`);
      setBooks(data.data.books || []);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const toggleMood = (moodId) => {
    if (selectedMoods.includes(moodId)) {
      setSelectedMoods(selectedMoods.filter(id => id !== moodId));
    } else {
      setSelectedMoods([...selectedMoods, moodId]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>AR 레벨</Text>
        <View style={styles.arContainer}>
          <TextInput
            style={styles.arInput}
            placeholder="최소"
            value={minAr}
            onChangeText={setMinAr}
            keyboardType="decimal-pad"
          />
          <Text style={styles.arSeparator}>~</Text>
          <TextInput
            style={styles.arInput}
            placeholder="최대"
            value={maxAr}
            onChangeText={setMaxAr}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.sectionTitle}>주제</Text>
        <View style={styles.tagContainer}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.tag,
                selectedThemes.includes(theme.id) && styles.tagSelected,
              ]}
              onPress={() => toggleTheme(theme.id)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedThemes.includes(theme.id) && styles.tagTextSelected,
                ]}
              >
                {theme.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>분위기</Text>
        <View style={styles.tagContainer}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.tag,
                selectedMoods.includes(mood.id) && styles.tagSelected,
              ]}
              onPress={() => toggleMood(mood.id)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedMoods.includes(mood.id) && styles.tagTextSelected,
                ]}
              >
                {mood.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>
            {loading ? '검색 중...' : '검색하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
          >
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
            <Text style={styles.bookLevel}>AR {item.ar_level || 'N/A'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  arContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  arSeparator: {
    fontSize: 16,
    color: '#6b7280',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  tagSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  tagText: {
    fontSize: 14,
    color: '#6b7280',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  bookLevel: {
    fontSize: 12,
    color: '#6366f1',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default SearchScreen;

