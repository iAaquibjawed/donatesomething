import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.userAvatar}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{post.userName}</Text>
              <View style={styles.postMeta}>
                <Icon name="location-on" size={14} color="#999" />
                <Text style={styles.location}>{post.location}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post Image */}
        <View style={styles.imageContainer}>
          <View style={styles.postImage}>
            <Icon name="image" size={60} color="#CCC" />
            <Text style={styles.imagePlaceholder}>Post Image</Text>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.contentSection}>
          <Text style={styles.postContent}>{post.content}</Text>
        </View>

        {/* Engagement Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={20} color="#FF3B30" />
            <Text style={styles.statText}>{likeCount} likes</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="chat-bubble" size={20} color="#007AFF" />
            <Text style={styles.statText}>{post.comments} comments</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={handleLike}>
            <Icon
              name={isLiked ? 'favorite' : 'favorite-border'}
              size={24}
              color={isLiked ? '#FF3B30' : '#666'}
            />
            <Text
              style={[
                styles.actionText,
                isLiked && styles.actionTextActive,
              ]}>
              Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chat-bubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={24} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments ({post.comments})</Text>
          </View>

          {/* Dummy Comments */}
          <View style={styles.commentItem}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>👤</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>Alex Thompson</Text>
              <Text style={styles.commentText}>
                Great initiative! How can I help?
              </Text>
              <Text style={styles.commentTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.commentItem}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>👤</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>Maria Garcia</Text>
              <Text style={styles.commentText}>
                I'd love to volunteer! Where can I sign up?
              </Text>
              <Text style={styles.commentTime}>5 hours ago</Text>
            </View>
          </View>

          <View style={styles.commentItem}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>👤</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>James Wilson</Text>
              <Text style={styles.commentText}>
                This is amazing! Keep up the good work! 🙌
              </Text>
              <Text style={styles.commentTime}>1 day ago</Text>
            </View>
          </View>
        </View>

        {/* Add Comment Input */}
        <View style={styles.addCommentSection}>
          <View style={styles.addCommentInput}>
            <Text style={styles.addCommentPlaceholder}>
              Add a comment...
            </Text>
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Icon name="send" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  shareButton: {
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
    borderBottomColor: '#F0F0F0',
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
    color: '#000',
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  separator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 6,
  },
  timeAgo: {
    fontSize: 14,
    color: '#999',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
  },
  postImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  imagePlaceholder: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  contentSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  postContent: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionButtonActive: {
    // Active state styling
  },
  actionText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  actionTextActive: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  commentsSection: {
    padding: 16,
  },
  commentsHeader: {
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
  },
  addCommentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  addCommentPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  sendButton: {
    padding: 8,
  },
});

export default PostDetailScreen;

