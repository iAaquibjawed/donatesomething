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
import {useTheme} from '../context/ThemeContext';

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
  const {colors, isDark} = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Dummy notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'post',
      title: 'New Post Available',
      message: 'Sarah Johnson posted about a food drive in your area',
      timeAgo: '2 minutes ago',
      isRead: false,
      avatar: '👩',
      userName: 'Sarah Johnson',
    },
    {
      id: 2,
      type: 'follow',
      title: 'New Follower',
      message: 'Alex Thompson started following you',
      timeAgo: '8 minutes ago',
      isRead: false,
      avatar: '👨',
      userName: 'Alex Thompson',
    },
    {
      id: 3,
      type: 'like',
      title: 'Post Liked',
      message: 'Michael Chen liked your post about clothing donation',
      timeAgo: '15 minutes ago',
      isRead: false,
      avatar: '👨',
      userName: 'Michael Chen',
    },
    {
      id: 4,
      type: 'comment',
      title: 'New Comment',
      message: 'Emily Rodriguez commented on your post: "Great initiative!"',
      timeAgo: '25 minutes ago',
      isRead: false,
      avatar: '👩‍🦰',
      userName: 'Emily Rodriguez',
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message',
      message: 'Lisa Wang sent you a message about food donation',
      timeAgo: '45 minutes ago',
      isRead: false,
      avatar: '👩',
      userName: 'Lisa Wang',
    },
    {
      id: 6,
      type: 'post',
      title: 'New Post Available',
      message: 'James Wilson shared a new food donation opportunity',
      timeAgo: '1 hour ago',
      isRead: false,
      avatar: '👨‍💼',
      userName: 'James Wilson',
    },
    {
      id: 7,
      type: 'follow',
      title: 'New Follower',
      message: 'David Kim started following you',
      timeAgo: '2 hours ago',
      isRead: true,
      avatar: '👨‍💼',
      userName: 'David Kim',
    },
    {
      id: 8,
      type: 'post',
      title: 'New Post Available',
      message: 'Jessica Martinez posted about volunteering opportunities',
      timeAgo: '3 hours ago',
      isRead: true,
      avatar: '👩‍⚕️',
      userName: 'Jessica Martinez',
    },
    {
      id: 9,
      type: 'system',
      title: 'System Update',
      message: 'New features available! Check out the latest updates.',
      timeAgo: '1 day ago',
      isRead: true,
    },
    {
      id: 10,
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

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 16), backgroundColor: colors.headerBackground, borderBottomColor: colors.border}]}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 0) + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, {color: colors.text}]}>No notifications</Text>
            <Text style={[styles.emptySubtext, {color: colors.textSecondary}]}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  {backgroundColor: colors.surface, borderColor: colors.border},
                  !notification.isRead && styles.unreadNotification,
                ]}
                activeOpacity={0.7}
                onPress={() => handleNotificationPress(notification)}>
              {/* Avatar/Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: getNotificationColor(notification.type) + '20',
                    zIndex: 1,
                  },
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
              <View style={[styles.contentContainer, {minWidth: 0, zIndex: 1}]}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      {color: colors.text},
                      !notification.isRead && styles.unreadTitle,
                    ]}
                    numberOfLines={1}>
                    {notification.title || 'Notification'}
                  </Text>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text
                  style={[
                    styles.notificationMessage,
                    {color: colors.textSecondary},
                    !notification.isRead && styles.unreadMessage,
                  ]}
                  numberOfLines={2}>
                  {notification.message || 'No message'}
                </Text>
                <Text style={[styles.timeAgo, {color: colors.textSecondary, marginTop: 2}]}>{notification.timeAgo || 'Just now'}</Text>
              </View>

              {/* Arrow */}
              <Icon name="chevron-right" size={20} color={colors.textSecondary} style={{marginLeft: 8}} />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 0,
    borderBottomWidth: 1,
    minHeight: 50,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 8,
    alignItems: 'center',
    overflow: 'visible',
    borderWidth: 0.5,
    minHeight: 80,
    position: 'relative',
  },
  unreadNotification: {
    // No background override - uses theme colors from inline style
  },
  unreadIndicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#007AFF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 0,
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
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flexShrink: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    // Color is set inline with theme colors
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 6,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    flexShrink: 1,
  },
  unreadMessage: {
    fontWeight: '400',
    // Color is set inline with theme colors
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default NotificationScreen;
