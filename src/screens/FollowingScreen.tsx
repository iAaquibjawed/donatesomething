import React from 'react';
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
import {useUser} from '../context/UserContext';

interface User {
  id: number;
  name: string;
  avatar: string;
  location: string;
  accountType: 'want' | 'provide';
}

interface FollowingScreenProps {
  navigation: any;
  route?: {
    params?: {
      following?: User[];
    };
  };
}

const FollowingScreen: React.FC<FollowingScreenProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const {following: followingSet, removeFollowing} = useUser();

  // Map following user names to user objects
  // In a real app, this would come from an API
  const allUsers: User[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩',
      location: 'New York, NY',
      accountType: 'provide',
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: '👨',
      location: 'Los Angeles, CA',
      accountType: 'provide',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '👩‍🦰',
      location: 'Chicago, IL',
      accountType: 'provide',
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: '👨‍💼',
      location: 'Seattle, WA',
      accountType: 'provide',
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      avatar: '👩‍⚕️',
      location: 'Miami, FL',
      accountType: 'provide',
    },
  ];

  // Filter to only show users that are being followed
  const following = allUsers.filter(user => followingSet.has(user.name));

  const handleUnfollow = (userName: string) => {
    removeFollowing(userName);
    // In a real app, you would call an API to unfollow
  };

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
        <Text style={[styles.headerTitle, {color: colors.text}]}>Following</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 20}]}
        showsVerticalScrollIndicator={false}>
        {following.length > 0 ? (
          following.map(user => (
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
              <TouchableOpacity
                style={[styles.unfollowButton, {borderColor: colors.border}]}
                onPress={() => handleUnfollow(user.name)}>
                <Text style={[styles.unfollowButtonText, {color: colors.text}]}>Unfollow</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, {color: colors.text}]}>You're not following anyone yet</Text>
            <Text style={[styles.emptySubtext, {color: colors.textSecondary}]}>
              Start following food providers to see their posts
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
  unfollowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  unfollowButtonText: {
    fontSize: 14,
    fontWeight: '600',
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

export default FollowingScreen;

