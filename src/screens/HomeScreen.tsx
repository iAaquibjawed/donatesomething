import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const posts: Post[] = [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: '👩',
      location: 'New York, NY',
      timeAgo: '2 hours ago',
      content:
        'Just donated some clothes to the local shelter. It feels great to help those in need! 🙏 #DonateSome #GivingBack',
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
      likes: 67,
      comments: 15,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Icon name="location-on" size={24} color="#007AFF" />
        <Text style={styles.locationText}>New York, NY</Text>
      </View>

      {/* Content Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}>
        {posts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.post}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PostDetail', {post})}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.userAvatar}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.userName}</Text>
                  <View style={styles.postMeta}>
                    <Icon name="location-on" size={12} color="#999" />
                    <Text style={styles.location}>{post.location}</Text>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <Icon name="more-vert" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Image Placeholder */}
            <View style={styles.postImageContainer}>
              <View style={styles.postImage}>
                <Icon name="image" size={40} color="#CCC" />
              </View>
            </View>

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                }}>
                <Icon name="share" size={24} color="#666" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#666',
    marginLeft: 6,
  },
});

export default HomeScreen;
