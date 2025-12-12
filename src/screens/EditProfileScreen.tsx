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

interface EditProfileScreenProps {
  route: {
    params: {
      userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profileImage: string | null;
        backgroundImage: string | null;
        accountType: 'want' | 'provide';
      };
    };
  };
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const {userData: initialUserData} = route.params;

  const [firstName, setFirstName] = useState(initialUserData.firstName);
  const [lastName, setLastName] = useState(initialUserData.lastName);
  const [email, setEmail] = useState(initialUserData.email);
  const [phone, setPhone] = useState(initialUserData.phone);
  const [accountType, setAccountType] = useState<'want' | 'provide'>(
    initialUserData.accountType,
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    initialUserData.profileImage,
  );
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    initialUserData.backgroundImage || null,
  );
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone) || phone === '';
  };

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
        setProfileImage(response.assets[0].uri || null);
      }
    });
  };

  const handleBackgroundImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 400,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      } else if (response.assets && response.assets[0]) {
        setBackgroundImage(response.assets[0].uri || null);
      }
    });
  };

  const handleSave = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (phone.trim() && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      // Pass updated data back to ProfileScreen
      navigation.navigate('MainTabs', {
        screen: 'Profile',
        params: {
          updatedUserData: {
            firstName,
            lastName,
            email,
            phone,
            profileImage,
            backgroundImage,
            accountType,
          },
        },
      });
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
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
          <Text style={[styles.headerTitle, {color: colors.text}]}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={[styles.saveButtonText, {color: colors.primary}]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.scrollView, {backgroundColor: colors.background}]}
          contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 0) + 20}]}
          showsVerticalScrollIndicator={false}>
          {/* Profile Image Section with Background */}
          <View style={[styles.profileImageSection, {borderBottomColor: colors.border}]}>
            {/* Background Image */}
            <View style={styles.backgroundImageContainer}>
              {backgroundImage ? (
                <Image
                  source={{uri: backgroundImage}}
                  style={styles.backgroundImage}
                />
              ) : (
                <View style={[styles.backgroundImagePlaceholder, {backgroundColor: colors.inputBackground}]}>
                  <Icon name="image" size={48} color={colors.textSecondary} />
                </View>
              )}
              <TouchableOpacity
                style={[styles.editBackgroundButton, {backgroundColor: colors.primary + 'D9'}]}
                onPress={handleBackgroundImagePicker}
                activeOpacity={0.8}>
                <Icon name="camera-alt" size={12} color="#FFF" />
                <Text style={styles.editBackgroundButtonText}>
                  {backgroundImage ? 'Change Background' : 'Add Background'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Profile Image on top */}
            <View style={styles.profileImageContent}>
              <View style={styles.imageContainer}>
                {profileImage ? (
                  <Image
                    source={{uri: profileImage}}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={[styles.placeholderImage, {backgroundColor: colors.surface}]}>
                    <Icon name="person" size={60} color={colors.textSecondary} />
                  </View>
                )}
                <TouchableOpacity
                  style={[styles.editImageButton, {backgroundColor: colors.primary}]}
                  onPress={handleImagePicker}>
                  <Icon name="camera-alt" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.changePhotoButton, {backgroundColor: colors.primary + '20'}]}
                onPress={handleImagePicker}>
                <Text style={[styles.changePhotoText, {color: colors.primary}]}>
                  {profileImage ? 'Change Photo' : 'Add Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={[styles.formSection, {backgroundColor: colors.surface}]}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>First Name</Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon name="person" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={[styles.input, {color: colors.text}]}
                  placeholder="Enter your first name"
                  placeholderTextColor={colors.placeholder}
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                    if (errors.firstName) setErrors({...errors, firstName: ''});
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.firstName ? (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              ) : null}
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Last Name</Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon name="person" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={[styles.input, {color: colors.text}]}
                  placeholder="Enter your last name"
                  placeholderTextColor={colors.placeholder}
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                    if (errors.lastName) setErrors({...errors, lastName: ''});
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.lastName ? (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Email</Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon name="email" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={[styles.input, {color: colors.text}]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>
                Phone Number <Text style={[styles.optional, {color: colors.textSecondary}]}>(Optional)</Text>
              </Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon name="phone" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={[styles.input, {color: colors.text}]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.placeholder}
                  value={phone}
                  onChangeText={text => {
                    setPhone(text);
                    if (errors.phone) setErrors({...errors, phone: ''});
                  }}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>

            {/* Account Type - Read Only */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Account Type</Text>
              <View style={[styles.accountTypeDisplay, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon
                  name={accountType === 'want' ? 'restaurant' : 'volunteer-activism'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.accountTypeDisplayText, {color: colors.text}]}>
                  {accountType === 'want' ? 'I Want Food' : 'I Provide Food'}
                </Text>
                <Icon name="lock" size={16} color={colors.textSecondary} style={{marginLeft: 'auto'}} />
              </View>
              <Text style={[styles.subLabel, {color: colors.textSecondary, marginTop: 8}]}>
                Account type cannot be changed after signup
              </Text>
            </View>
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
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileImageSection: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backgroundImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBackgroundButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    zIndex: 1,
    elevation: 2,
  },
  editBackgroundButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  profileImageContent: {
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 30,
    position: 'relative',
    zIndex: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 3,
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
  changePhotoButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optional: {
    fontWeight: '400',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  subLabel: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: 4,
  },
  accountTypeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  accountTypeDisplayText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});

export default EditProfileScreen;

