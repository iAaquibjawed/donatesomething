import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Image,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';

interface Post {
  id: number;
  userName: string;
  userAvatar: string;
  location: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

interface HomeScreenProps {
  navigation: any;
  route?: {
    params?: {
      accountType?: 'want' | 'provide';
      following?: Set<string>;
    };
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const {accountType: currentAccountType, following, addFollowing, removeFollowing} = useUser();
  // Track which post's menu is open
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleFollow = (userName: string, e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking follow button

    if (following.has(userName)) {
      removeFollowing(userName);
      Alert.alert('Unfollowed', `You unfollowed ${userName}`);
    } else {
      addFollowing(userName);
      Alert.alert('Following', `You are now following ${userName}`);
    }
  };

  const handleShare = async (post: Post) => {
    try {
      const shareMessage = `${post.userName} - ${post.content}\n\nLocation: ${post.location}\n\nShared via DonateSome`;
      const result = await Share.share({
        message: shareMessage,
        title: 'Share Post',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with', result.activityType);
        } else {
          // Shared
          console.log('Post shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share post');
    }
  };

  const handleMoreOptions = (postId: number, e: any) => {
    e.stopPropagation();
    setSelectedPostId(postId);
  };

  const handleReport = (post: Post) => {
    setSelectedPostId(null);
    Alert.alert(
      'Report Post',
      `Are you sure you want to report this post by ${post.userName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would send this to your backend
            Alert.alert(
              'Report Submitted',
              'Thank you for your report. We will review this post and take appropriate action.',
            );
          },
        },
      ],
    );
  };

  const handleHidePost = (postId: number) => {
    setSelectedPostId(null);
    Alert.alert('Hide Post', 'This post will be hidden from your feed.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Hide',
        onPress: () => {
          // In a real app, you would hide this post
          Alert.alert('Post Hidden', 'This post has been hidden from your feed.');
        },
      },
    ]);
  };

  const closeMenu = () => {
    setSelectedPostId(null);
  };

  const allPosts: Post[] = [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: '👩',
      location: 'New York, NY',
      timeAgo: '2 hours ago',
      content:
        'Just donated some clothes to the local shelter. It feels great to help those in need! 🙏 #DonateSome #GivingBack',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      userName: 'Michael Chen',
      userAvatar: '👨',
      location: 'Los Angeles, CA',
      timeAgo: '5 hours ago',
      content:
        'Organized a food drive in my neighborhood today. We collected over 200 items! Thank you to everyone who contributed. 🍎🥫',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
      likes: 89,
      comments: 12,
    },
    {
      id: 3,
      userName: 'Emily Rodriguez',
      userAvatar: '👩‍🦰',
      location: 'Chicago, IL',
      timeAgo: '1 day ago',
      content:
        'Volunteered at the animal shelter this weekend. These furry friends need our help too! 🐕🐱 #Volunteer #AnimalRescue',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
      likes: 156,
      comments: 23,
    },
    {
      id: 4,
      userName: 'David Kim',
      userAvatar: '👨‍💼',
      location: 'Seattle, WA',
      timeAgo: '2 days ago',
      content:
        'Donated books to the local library. Knowledge should be accessible to everyone! 📚✨',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      likes: 42,
      comments: 8,
    },
    {
      id: 5,
      userName: 'Jessica Martinez',
      userAvatar: '👩‍⚕️',
      location: 'Miami, FL',
      timeAgo: '3 days ago',
      content:
        'Helped organize a blood drive at the community center. Every donation counts! 🩸❤️',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      likes: 203,
      comments: 31,
    },
    {
      id: 6,
      userName: 'Robert Taylor',
      userAvatar: '👨‍🔧',
      location: 'Boston, MA',
      timeAgo: '4 days ago',
      content:
        'Donated some tools to a local workshop that teaches skills to underprivileged youth. Building futures! 🔧🛠️',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
      likes: 67,
      comments: 15,
    },
  ];

  // Filter posts based on account type
  // For "I Want Food" users: only show posts from users they're following
  // For "I Provide Food" users: show all posts
  const posts =
    currentAccountType === 'want'
      ? allPosts.filter(post => following.has(post.userName))
      : allPosts;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <Icon name="location-on" size={24} color={colors.primary} />
        <Text style={[styles.locationText, {color: colors.text}]}>New York, NY</Text>
      </View>

      {/* Content Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={[styles.feedContent, {paddingBottom: Math.max(insets.bottom, 0) + 80}]}
        showsVerticalScrollIndicator={false}>
        {currentAccountType === 'want' && following.size === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, {color: colors.text}]}>No posts to show</Text>
            <Text style={[styles.emptySubtext, {color: colors.textSecondary}]}>
              Start following food providers to see their posts
            </Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="article" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, {color: colors.text}]}>No posts available</Text>
          </View>
        ) : (
          posts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={[styles.post, {backgroundColor: colors.surface, borderColor: colors.border}]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PostDetail', {post})}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.userAvatar}</Text>
              </View>
              <View style={styles.userDetails}>
                <View style={styles.userNameRow}>
                  <Text style={[styles.userName, {color: colors.text}]} numberOfLines={1}>
                    {post.userName}
                  </Text>
                  {currentAccountType === 'want' && (
                    <TouchableOpacity
                      style={[
                        styles.followButton,
                        following.has(post.userName) && styles.followingButton,
                      ]}
                      onPress={e => handleFollow(post.userName, e)}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.followButtonText,
                          following.has(post.userName) && styles.followingButtonText,
                        ]}>
                        {following.has(post.userName) ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={e => handleMoreOptions(post.id, e)}>
                    <Icon name="more-vert" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.postMeta}>
                  <Icon name="location-on" size={12} color={colors.textSecondary} />
                  <Text style={[styles.location, {color: colors.textSecondary}]}>{post.location}</Text>
                  <Text style={[styles.separator, {color: colors.textSecondary}]}>•</Text>
                  <Text style={[styles.timeAgo, {color: colors.textSecondary}]}>{post.timeAgo}</Text>
                </View>
              </View>
            </View>

            {/* Post Content */}
            <Text style={[styles.postContent, {color: colors.text}]}>{post.content}</Text>

            {/* Post Image */}
            {post.image && (
              <View style={styles.postImageContainer}>
                <Image
                  source={{uri: post.image}}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleShare(post);
                }}>
                <Icon name="share" size={24} color={colors.textSecondary} />
                <Text style={[styles.actionText, {color: colors.textSecondary}]}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Post Options Modal */}
      <Modal
        visible={selectedPostId !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}>
          <View style={[styles.modalContent, {backgroundColor: colors.surface}]}>
            {selectedPostId && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    const post = posts.find(p => p.id === selectedPostId);
                    if (post) {
                      handleReport(post);
                    }
                  }}>
                  <Icon name="flag" size={24} color="#FF3B30" />
                  <Text style={[styles.menuItemText, styles.reportText]}>
                    Report Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    if (selectedPostId) {
                      handleHidePost(selectedPostId);
                    }
                  }}>
                  <Icon name="visibility-off" size={24} color={colors.textSecondary} />
                  <Text style={[styles.menuItemText, {color: colors.text}]}>Hide Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItem, styles.cancelItem]}
                  onPress={closeMenu}>
                  <Text style={[styles.menuItemText, styles.cancelText, {color: colors.text}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  post: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
    minWidth: 0, // Allows flex shrinking
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexShrink: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 8,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 8,
    flexShrink: 0,
  },
  moreButton: {
    padding: 4,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  followingButton: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followingButtonText: {
    color: '#666',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  timeAgo: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxWidth: 320,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cancelItem: {
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  reportText: {
    color: '#FF3B30',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
    marginLeft: 0,
  },
});

export default HomeScreen;
