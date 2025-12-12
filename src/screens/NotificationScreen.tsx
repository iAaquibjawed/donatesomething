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
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Notification {
  id: number;
  type: 'post' | 'like' | 'comment' | 'follow' | 'message' | 'system';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  avatar?: string;
  userName?: string;
}

interface NotificationScreenProps {
  navigation: any;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Dummy notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'post',
      title: 'New Post Available',
      message: 'Sarah Johnson posted about a food drive in your area',
      timeAgo: '5 minutes ago',
      isRead: false,
      avatar: '👩',
      userName: 'Sarah Johnson',
    },
    {
      id: 2,
      type: 'like',
      title: 'Post Liked',
      message: 'Michael Chen liked your post about clothing donation',
      timeAgo: '15 minutes ago',
      isRead: false,
      avatar: '👨',
      userName: 'Michael Chen',
    },
    {
      id: 3,
      type: 'comment',
      title: 'New Comment',
      message: 'Emily Rodriguez commented on your post: "Great initiative!"',
      timeAgo: '1 hour ago',
      isRead: false,
      avatar: '👩‍🦰',
      userName: 'Emily Rodriguez',
    },
    {
      id: 4,
      type: 'follow',
      title: 'New Follower',
      message: 'David Kim started following you',
      timeAgo: '2 hours ago',
      isRead: true,
      avatar: '👨‍💼',
      userName: 'David Kim',
    },
    {
      id: 5,
      type: 'post',
      title: 'New Post Available',
      message: 'Jessica Martinez posted about volunteering opportunities',
      timeAgo: '3 hours ago',
      isRead: true,
      avatar: '👩‍⚕️',
      userName: 'Jessica Martinez',
    },
    {
      id: 6,
      type: 'system',
      title: 'System Update',
      message: 'New features available! Check out the latest updates.',
      timeAgo: '1 day ago',
      isRead: true,
    },
    {
      id: 7,
      type: 'message',
      title: 'New Message',
      message: 'Robert Taylor sent you a message about your donation',
      timeAgo: '2 days ago',
      isRead: true,
      avatar: '👨‍🔧',
      userName: 'Robert Taylor',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'post':
        return 'article';
      case 'like':
        return 'favorite';
      case 'comment':
        return 'comment';
      case 'follow':
        return 'person-add';
      case 'message':
        return 'message';
      case 'system':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'post':
        return '#007AFF';
      case 'like':
        return '#FF3B30';
      case 'comment':
        return '#34C759';
      case 'follow':
        return '#5856D6';
      case 'message':
        return '#FF9500';
      case 'system':
        return '#8E8E93';
      default:
        return '#007AFF';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notification.id ? {...notif, isRead: true} : notif,
      ),
    );

    // Navigate based on notification type
    if (notification.type === 'post') {
      // Navigate to post detail if available
      // navigation.navigate('PostDetail', {post: notification});
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({...notif, isRead: true})));
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8)}]}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 80}]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification,
              ]}
              activeOpacity={0.7}
              onPress={() => handleNotificationPress(notification)}>
              {/* Avatar/Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: getNotificationColor(notification.type) + '20'},
                ]}>
                {notification.avatar ? (
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{notification.avatar}</Text>
                  </View>
                ) : (
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color={getNotificationColor(notification.type)}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.timeAgo}>{notification.timeAgo}</Text>
              </View>

              {/* Arrow */}
              <Icon name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowOpacity: 0,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationScreen;
