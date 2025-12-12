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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';

interface CreatePostScreenProps {
  navigation: any;
  route: {
    params: {
      userData: {
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
  const {userData} = route.params;
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
            // Navigate back to profile and pass the new post
            navigation.navigate('MainTabs', {
              screen: 'Profile',
              params: {
                newPost: newPost,
              },
            });
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={handlePost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
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
                <Text style={styles.avatarText}>
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {userData.firstName} {userData.lastName}
                </Text>
                <Text style={styles.userType}>Food Provider</Text>
              </View>
            </View>
          </View>

          {/* Content Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>What food are you providing? *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Describe the food you have available (e.g., Fresh vegetables, cooked meals, canned goods, etc.)"
              placeholderTextColor="#999"
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
          <View style={styles.inputSection}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="location-on" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter location (e.g., New York, NY)"
                placeholderTextColor="#999"
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
            <Text style={styles.label}>Add Photo (Optional)</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePicker}>
              {postImage ? (
                <Image source={{uri: postImage}} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="add-photo-alternate" size={48} color="#999" />
                  <Text style={styles.imagePlaceholderText}>
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
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#000',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    color: '#000',
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: '#666',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  contentInput: {
    minHeight: 120,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
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

