import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {useTheme} from '../context/ThemeContext';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark, themeMode, setThemeMode} = useTheme();

  // Dummy user data - in a real app, this would come from state management or API
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    profileImage: null as string | null,
    accountType: 'provide' as 'want' | 'provide',
  });

  // User's posts - in a real app, this would come from state management or API
  const [myPosts, setMyPosts] = useState([
    {
      id: 1,
      content:
        'Fresh vegetables available! Carrots, tomatoes, and lettuce from my garden. Available for pickup today.',
      location: 'New York, NY',
      timeAgo: '2 hours ago',
      image: null as string | null,
    },
    {
      id: 2,
      content:
        'Cooked meals ready - pasta, rice, and soup. Can feed 10-15 people. Please contact me for details.',
      location: 'New York, NY',
      timeAgo: '1 day ago',
      image: null as string | null,
    },
  ]);

  // Update user data if coming from EditProfileScreen
  useEffect(() => {
    if (route?.params?.updatedUserData) {
      setUserData(route.params.updatedUserData);
    }
  }, [route?.params?.updatedUserData]);

  // Update posts if a new post was created
  useEffect(() => {
    if (route?.params?.newPost) {
      setMyPosts(prevPosts => [route.params.newPost, ...prevPosts]);
    }
  }, [route?.params?.newPost]);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      } else if (response.assets && response.assets[0]) {
        setUserData({
          ...userData,
          profileImage: response.assets[0].uri || null,
        });
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 80}]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Profile</Text>
        </View>

        {/* Profile Image Section */}
        <View style={[styles.profileImageSection, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
          <View style={styles.imageContainer}>
            {userData.profileImage ? (
              <Image
                source={{uri: userData.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="person" size={60} color="#999" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImagePicker}>
              <Icon name="camera-alt" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePicker}>
            <Text style={styles.uploadButtonText}>
              {userData.profileImage ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={[styles.infoSection, {backgroundColor: colors.surface}]}>
          {/* Name */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon name="person" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Full Name</Text>
            </View>
            <Text style={[styles.infoValue, {color: colors.text}]}>
              {userData.firstName} {userData.lastName}
            </Text>
          </View>

          {/* Email */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon name="email" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Email</Text>
            </View>
            <Text style={[styles.infoValue, {color: colors.text}]}>{userData.email}</Text>
          </View>

          {/* Phone */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon name="phone" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Phone Number</Text>
            </View>
            <Text style={[styles.infoValue, {color: colors.text}]}>
              {userData.phone || 'Not provided'}
            </Text>
          </View>

          {/* Account Type */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon
                name={
                  userData.accountType === 'want'
                    ? 'restaurant'
                    : 'volunteer-activism'
                }
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Account Type</Text>
            </View>
            <View style={styles.accountTypeBadge}>
              <Text style={[styles.accountTypeText, {color: colors.primary}]}>
                {userData.accountType === 'want'
                  ? 'I Want Food'
                  : 'I Provide Food'}
              </Text>
            </View>
          </View>
        </View>

        {/* My Posts Section - Only for Food Providers */}
        {userData.accountType === 'provide' && (
          <View style={[styles.myPostsSection, {backgroundColor: colors.surface}]}>
            <View style={styles.myPostsHeader}>
              <Text style={[styles.myPostsTitle, {color: colors.text}]}>My Posts</Text>
              <TouchableOpacity
                style={styles.createPostButton}
                onPress={() =>
                  navigation.navigate('CreatePost', {userData})
                }>
                <Icon name="add" size={20} color="#FFF" />
                <Text style={styles.createPostButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>

            {myPosts.length > 0 ? (
              <View style={styles.postsList}>
                {myPosts.map(post => (
                  <TouchableOpacity
                    key={post.id}
                    style={[styles.postCard, {backgroundColor: colors.cardBackground, borderColor: colors.border}]}
                    onPress={() =>
                      navigation.navigate('PostDetail', {
                        post: {
                          ...post,
                          userName: `${userData.firstName} ${userData.lastName}`,
                          userAvatar: `${userData.firstName[0]}${userData.lastName[0]}`,
                          likes: 0,
                          comments: 0,
                        },
                      })
                    }>
                    <View style={styles.postCardHeader}>
                      <View style={styles.postCardContent}>
                        <Text style={[styles.postCardText, {color: colors.text}]} numberOfLines={2}>
                          {post.content}
                        </Text>
                        <View style={styles.postCardMeta}>
                          <Icon name="location-on" size={12} color={colors.textSecondary} />
                          <Text style={[styles.postCardLocation, {color: colors.textSecondary}]}>
                            {post.location}
                          </Text>
                          <Text style={[styles.postCardSeparator, {color: colors.textSecondary}]}>•</Text>
                          <Text style={[styles.postCardTime, {color: colors.textSecondary}]}>{post.timeAgo}</Text>
                        </View>
                      </View>
                      {post.image ? (
                        <Image
                          source={{uri: post.image}}
                          style={styles.postCardImage}
                        />
                      ) : (
                        <View style={styles.postCardImagePlaceholder}>
                          <Icon name="image" size={24} color="#CCC" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyPostsContainer}>
                <Icon name="article" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyPostsText, {color: colors.text}]}>
                  You haven't created any posts yet
                </Text>
                <Text style={[styles.emptyPostsSubtext, {color: colors.textSecondary}]}>
                  Tap "Create Post" to share food you're providing
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={[styles.actionsSection, {backgroundColor: colors.surface}]}>
          <TouchableOpacity
            style={[styles.actionButton, {borderBottomColor: colors.border}]}
            onPress={() => navigation.navigate('EditProfile', {userData})}>
            <Icon name="edit" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, {color: colors.text}]}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, {borderBottomColor: colors.border}]}>
            <Icon name="settings" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, {color: colors.text}]}>Settings</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.actionButton, styles.darkModeButton, {borderBottomColor: colors.border}]}>
            <Icon name="dark-mode" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, {color: colors.text, flex: 1}]}>
              Dark Mode
            </Text>
            <View style={styles.darkModeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  {backgroundColor: themeMode === 'system' ? colors.primary : colors.inputBackground},
                  themeMode === 'system' && {borderColor: colors.primary},
                ]}
                onPress={() => setThemeMode('system')}>
                <Text
                  style={[
                    styles.themeOptionText,
                    {color: themeMode === 'system' ? '#FFFFFF' : colors.textSecondary},
                  ]}>
                  System
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  {backgroundColor: themeMode === 'light' ? colors.primary : colors.inputBackground},
                  themeMode === 'light' && {borderColor: colors.primary},
                ]}
                onPress={() => setThemeMode('light')}>
                <Text
                  style={[
                    styles.themeOptionText,
                    {color: themeMode === 'light' ? '#FFFFFF' : colors.textSecondary},
                  ]}>
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  {backgroundColor: themeMode === 'dark' ? colors.primary : colors.inputBackground},
                  themeMode === 'dark' && {borderColor: colors.primary},
                ]}
                onPress={() => setThemeMode('dark')}>
                <Text
                  style={[
                    styles.themeOptionText,
                    {color: themeMode === 'dark' ? '#FFFFFF' : colors.textSecondary},
                  ]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="help-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, {color: colors.text}]}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton, {borderBottomColor: colors.border}]}
            onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                      // Navigate to Auth screen (Login) - reset navigation stack
                      // Get root navigator and reset to Auth
                      const rootNavigation = navigation.getParent()?.getParent();
                      if (rootNavigation) {
                        rootNavigation.reset({
                          index: 0,
                          routes: [{name: 'Auth'}],
                        });
                      } else {
                        // Fallback: try direct navigation
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [
                              {
                                name: 'Auth',
                                state: {
                                  routes: [{name: 'Login'}],
                                },
                              },
                            ],
                          }),
                        );
                      }
                    },
                  },
                ],
              );
            }}>
            <Icon name="logout" size={20} color="#FF3B30" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  profileImageSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 28,
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 20,
  },
  darkModeButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  darkModeOptions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#FF3B30',
  },
  accountTypeBadge: {
    marginLeft: 28,
    marginTop: 4,
  },
  accountTypeText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  myPostsSection: {
    marginBottom: 20,
    padding: 16,
  },
  myPostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  myPostsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  postsList: {
    gap: 12,
  },
  postCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  postCardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  postCardContent: {
    flex: 1,
  },
  postCardText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  postCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postCardLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  postCardSeparator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 6,
  },
  postCardTime: {
    fontSize: 12,
  },
  postCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  postCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPostsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPostsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPostsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProfileScreen;
