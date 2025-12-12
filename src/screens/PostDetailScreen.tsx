import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';

interface PostDetailScreenProps {
  route: {
    params: {
      post: {
        id: number;
        userName: string;
        userAvatar: string;
        location: string;
        timeAgo: string;
        content: string;
        image?: string;
        likes: number;
        comments: number;
      };
    };
  };
  navigation: any;
}

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({route, navigation}) => {
  const {post} = route.params;
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async () => {
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

  const handleReport = () => {
    setShowMenu(false);
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

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Post Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setShowMenu(true)}>
            <Icon name="more-vert" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, {backgroundColor: colors.surface}]}
        contentContainerStyle={[styles.scrollContent, {flexGrow: 1, paddingBottom: Math.max(insets.bottom, 0) + 20, backgroundColor: colors.surface}]}
        showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={[styles.userSection, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.userAvatar}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, {color: colors.text}]}>{post.userName}</Text>
              <View style={styles.postMeta}>
                <Icon name="location-on" size={14} color={colors.textSecondary} />
                <Text style={[styles.location, {color: colors.textSecondary}]}>{post.location}</Text>
                <Text style={[styles.separator, {color: colors.textSecondary}]}>•</Text>
                <Text style={[styles.timeAgo, {color: colors.textSecondary}]}>{post.timeAgo}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post Image */}
        {post.image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: post.image}}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <View style={[styles.postImagePlaceholder, {backgroundColor: colors.inputBackground}]}>
              <Icon name="image" size={60} color={colors.textSecondary} />
              <Text style={[styles.imagePlaceholderText, {color: colors.textSecondary}]}>Post Image</Text>
            </View>
          </View>
        )}

        {/* Post Content */}
        <View style={[styles.contentSection, {backgroundColor: colors.surface, flexGrow: 1}]}>
          <Text style={[styles.postContent, {color: colors.text}]}>{post.content}</Text>
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionsSection, {backgroundColor: colors.surface, borderTopColor: colors.border}]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" size={24} color={colors.textSecondary} />
            <Text style={[styles.actionText, {color: colors.textSecondary}]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Post Options Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}>
          <View style={[styles.modalContent, {backgroundColor: colors.surface}]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleReport}>
              <Icon name="flag" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.reportText]}>
                Report Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.cancelItem]}
              onPress={() => setShowMenu(false)}>
              <Text style={[styles.menuItemText, styles.cancelText, {color: colors.text}]}>
                Cancel
              </Text>
            </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 4,
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 28,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  separator: {
    fontSize: 14,
    marginHorizontal: 6,
  },
  timeAgo: {
    fontSize: 14,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  contentSection: {
    padding: 16,
    minHeight: 200,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
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

export default PostDetailScreen;

