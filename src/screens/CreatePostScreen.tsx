import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {useTheme} from '../context/ThemeContext';

interface CreatePostScreenProps {
  navigation: any;
  route?: {
    params?: {
      userData?: {
        firstName: string;
        lastName: string;
        accountType: 'want' | 'provide';
      };
    };
  };
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  // Default user data if not provided
  const defaultUserData = {
    firstName: 'User',
    lastName: 'Name',
    accountType: 'provide' as 'want' | 'provide',
  };
  const userData = route?.params?.userData || defaultUserData;
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    content: '',
    location: '',
  });

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      } else if (response.assets && response.assets[0]) {
        setPostImage(response.assets[0].uri || null);
      }
    });
  };

  const handlePost = () => {
    const newErrors = {
      content: '',
      location: '',
    };

    if (!content.trim()) {
      newErrors.content = 'Please describe the food you are providing';
    }

    if (!location.trim()) {
      newErrors.location = 'Please provide a location';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      // Create new post object
      const newPost = {
        id: Date.now(), // In a real app, this would come from the backend
        content: content.trim(),
        location: location.trim(),
        timeAgo: 'Just now',
        image: postImage,
      };

      // In a real app, you would save the post to your backend here
      Alert.alert('Success', 'Your post has been created!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home screen
            navigation.goBack();
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* Header */}
        <View style={[styles.header, {paddingTop: Math.max(insets.top, 8), backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Create Post</Text>
          <TouchableOpacity onPress={handlePost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.scrollView, {backgroundColor: colors.background}]}
          contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 20}]}
          showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={[styles.userSection, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, {color: colors.text}]}>
                  {userData.firstName} {userData.lastName}
                </Text>
                <Text style={[styles.userType, {color: colors.textSecondary}]}>Food Provider</Text>
              </View>
            </View>
          </View>

          {/* Content Input */}
          <View style={[styles.inputSection, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
            <Text style={[styles.label, {color: colors.text}]}>What food are you providing? *</Text>
            <TextInput
              style={[styles.contentInput, {backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border}]}
              placeholder="Describe the food you have available (e.g., Fresh vegetables, cooked meals, canned goods, etc.)"
              placeholderTextColor={colors.placeholder}
              value={content}
              onChangeText={text => {
                setContent(text);
                if (errors.content) setErrors({...errors, content: ''});
              }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {errors.content ? (
              <Text style={styles.errorText}>{errors.content}</Text>
            ) : null}
          </View>

          {/* Location Input */}
          <View style={[styles.inputSection, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
            <Text style={[styles.label, {color: colors.text}]}>Location *</Text>
            <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
              <Icon name="location-on" size={20} color={colors.textSecondary} style={styles.icon} />
              <TextInput
                style={[styles.input, {color: colors.text}]}
                placeholder="Enter location (e.g., New York, NY)"
                placeholderTextColor={colors.placeholder}
                value={location}
                onChangeText={text => {
                  setLocation(text);
                  if (errors.location) setErrors({...errors, location: ''});
                }}
              />
            </View>
            {errors.location ? (
              <Text style={styles.errorText}>{errors.location}</Text>
            ) : null}
          </View>

          {/* Image Section */}
          <View style={styles.imageSection}>
            <Text style={[styles.label, {color: colors.text}]}>Add Photo (Optional)</Text>
            <TouchableOpacity
              style={[styles.imagePickerButton, {borderColor: colors.border}]}
              onPress={handleImagePicker}>
              {postImage ? (
                <Image source={{uri: postImage}} style={styles.previewImage} />
              ) : (
                <View style={[styles.imagePlaceholder, {backgroundColor: colors.inputBackground}]}>
                  <Icon name="add-photo-alternate" size={48} color={colors.textSecondary} />
                  <Text style={[styles.imagePlaceholderText, {color: colors.textSecondary}]}>
                    Tap to add photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {postImage && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setPostImage(null)}>
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    padding: 4,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
  },
  inputSection: {
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentInput: {
    minHeight: 120,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  imageSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  removeImageButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePostScreen;

