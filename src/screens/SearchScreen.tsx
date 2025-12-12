import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

interface SearchResult {
  id: number;
  type: 'user' | 'post' | 'location';
  title: string;
  subtitle: string;
  avatar?: string;
}

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Dummy search results - in a real app, this would come from an API
  const allResults: SearchResult[] = [
    // Users
    {
      id: 1,
      type: 'user',
      title: 'Sarah Johnson',
      subtitle: 'New York, NY',
      avatar: '👩',
    },
    {
      id: 2,
      type: 'user',
      title: 'Michael Chen',
      subtitle: 'Los Angeles, CA',
      avatar: '👨',
    },
    {
      id: 3,
      type: 'user',
      title: 'Emily Rodriguez',
      subtitle: 'Chicago, IL',
      avatar: '👩‍🦰',
    },
    // Posts
    {
      id: 4,
      type: 'post',
      title: 'Food Drive Success',
      subtitle: 'Collected 200+ items for local shelter',
    },
    {
      id: 5,
      type: 'post',
      title: 'Clothing Donation',
      subtitle: 'Helping families in need',
    },
    {
      id: 6,
      type: 'post',
      title: 'Animal Shelter Volunteer',
      subtitle: 'Weekend volunteering opportunity',
    },
    // Locations
    {
      id: 7,
      type: 'location',
      title: 'New York, NY',
      subtitle: '123 active donations',
    },
    {
      id: 8,
      type: 'location',
      title: 'Los Angeles, CA',
      subtitle: '89 active donations',
    },
    {
      id: 9,
      type: 'location',
      title: 'Chicago, IL',
      subtitle: '67 active donations',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    if (query.length > 0) {
      // Filter results based on search query
      const filtered = allResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderSearchResult = ({item}: {item: SearchResult}) => {
    let iconName = 'person';
    let iconColor = colors.primary;

    if (item.type === 'post') {
      iconName = 'article';
      iconColor = '#34C759';
    } else if (item.type === 'location') {
      iconName = 'location-on';
      iconColor = '#FF9500';
    }

    return (
      <TouchableOpacity style={[styles.resultItem, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <View style={styles.resultIconContainer}>
          {item.avatar ? (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
          ) : (
            <View style={[styles.iconContainer, {backgroundColor: iconColor}]}>
              <Icon name={iconName} size={20} color="#FFF" />
            </View>
          )}
        </View>
        <View style={styles.resultContent}>
          <Text style={[styles.resultTitle, {color: colors.text}]}>{item.title}</Text>
          <Text style={[styles.resultSubtitle, {color: colors.textSecondary}]}>{item.subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      {/* Search Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <View style={[styles.searchContainer, {backgroundColor: colors.inputBackground}]}>
          <Icon name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, {color: colors.text}]}
            placeholder="Search users, posts, locations..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            autoFocus={true}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {!isSearching ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentContainer, {paddingBottom: Math.max(insets.bottom, 0) + 80}]}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, {color: colors.text}]}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={[styles.clearText, {color: colors.primary}]}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.recentSearchItem, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}
                  onPress={() => handleRecentSearch(search)}>
                  <Icon name="history" size={20} color={colors.textSecondary} />
                  <Text style={[styles.recentSearchText, {color: colors.text}]}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Suggested Searches */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Suggested</Text>
            <View style={styles.suggestedContainer}>
              <TouchableOpacity
                style={[styles.suggestedChip, {backgroundColor: colors.primary + '20'}]}
                onPress={() => handleSearch('Food Drive')}>
                <Icon name="restaurant" size={16} color={colors.primary} />
                <Text style={[styles.suggestedText, {color: colors.primary}]}>Food Drive</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.suggestedChip, {backgroundColor: colors.primary + '20'}]}
                onPress={() => handleSearch('Clothing')}>
                <Icon name="checkroom" size={16} color={colors.primary} />
                <Text style={[styles.suggestedText, {color: colors.primary}]}>Clothing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.suggestedChip, {backgroundColor: colors.primary + '20'}]}
                onPress={() => handleSearch('Volunteer')}>
                <Icon name="volunteer-activism" size={16} color={colors.primary} />
                <Text style={[styles.suggestedText, {color: colors.primary}]}>Volunteer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.suggestedChip, {backgroundColor: colors.primary + '20'}]}
                onPress={() => handleSearch('New York')}>
                <Icon name="location-on" size={16} color={colors.primary} />
                <Text style={[styles.suggestedText, {color: colors.primary}]}>New York</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Popular</Text>
            <View style={[styles.popularList, {backgroundColor: colors.surface}]}>
              {['Donation Centers', 'Animal Shelter', 'Food Bank', 'Community Help'].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.popularItem, {borderBottomColor: colors.border}]}
                    onPress={() => handleSearch(item)}>
                    <Icon name="trending-up" size={20} color="#FF9500" />
                    <Text style={[styles.popularText, {color: colors.text}]}>{item}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.resultsContainer, {backgroundColor: colors.background}]}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={[styles.resultsList, {paddingBottom: Math.max(insets.bottom, 0) + 80}]}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search-off" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, {color: colors.text}]}>No results found</Text>
              <Text style={[styles.emptyStateText, {color: colors.textSecondary}]}>
                Try searching for something else
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowOpacity: 0,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentSearchText: {
    fontSize: 16,
    marginLeft: 12,
  },
  suggestedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestedText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  popularList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  popularText: {
    fontSize: 16,
    marginLeft: 12,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultIconContainer: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SearchScreen;
