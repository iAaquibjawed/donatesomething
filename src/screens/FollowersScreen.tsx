import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

interface User {
  id: number;
  name: string;
  avatar: string;
  location: string;
  accountType: 'want' | 'provide';
}

interface FollowersScreenProps {
  navigation: any;
  route?: {
    params?: {
      followers?: User[];
    };
  };
}

const FollowersScreen: React.FC<FollowersScreenProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();

  // Dummy followers list - in a real app, this would come from state management or API
  const [followers, setFollowers] = useState<User[]>([
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: '👨',
      location: 'New York, NY',
      accountType: 'want',
    },
    {
      id: 2,
      name: 'Lisa Wang',
      avatar: '👩',
      location: 'Los Angeles, CA',
      accountType: 'want',
    },
    {
      id: 3,
      name: 'David Kim',
      avatar: '👨‍💼',
      location: 'Seattle, WA',
      accountType: 'want',
    },
    {
      id: 4,
      name: 'Jessica Martinez',
      avatar: '👩‍⚕️',
      location: 'Miami, FL',
      accountType: 'want',
    },
  ]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Followers</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 20}]}
        showsVerticalScrollIndicator={false}>
        {followers.length > 0 ? (
          followers.map(user => (
            <TouchableOpacity
              key={user.id}
              style={[styles.userItem, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}
              activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, {color: colors.text}]}>{user.name}</Text>
                <View style={styles.userMeta}>
                  <Icon name="location-on" size={12} color={colors.textSecondary} />
                  <Text style={[styles.location, {color: colors.textSecondary}]}>{user.location}</Text>
                  <Text style={[styles.separator, {color: colors.textSecondary}]}>•</Text>
                  <Text style={[styles.accountType, {color: colors.primary}]}>
                    {user.accountType === 'want' ? 'I Want Food' : 'I Provide Food'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, {color: colors.text}]}>No followers yet</Text>
            <Text style={[styles.emptySubtext, {color: colors.textSecondary}]}>
              Share your posts to get more followers
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  accountType: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FollowersScreen;


