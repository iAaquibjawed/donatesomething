import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../context/ThemeContext';
import Logo from '../../components/Logo';

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'want' | 'provide' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone) || phone === '';
  };

  const handleSignup = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: '',
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

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!accountType) {
      newErrors.accountType = 'Please select an account type';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      // In a real app, you would handle registration here
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('MainApp');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.header, {paddingTop: Math.max(insets.top, 8)}]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Logo size={80} style={styles.logoContainer} />
            <Text style={[styles.title, {color: colors.text}]}>Create Account</Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}]}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
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
                    if (errors.firstName)
                      setErrors({...errors, firstName: ''});
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

            {/* Phone (Optional) */}
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

            {/* Account Type */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Account Type *</Text>
              <Text style={[styles.subLabel, {color: colors.textSecondary}]}>
                Are you looking for food or providing food?
              </Text>
              <View style={styles.accountTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    {backgroundColor: colors.inputBackground, borderColor: colors.border},
                    accountType === 'want' && [styles.accountTypeOptionSelected, {borderColor: colors.primary}],
                  ]}
                  onPress={() => {
                    setAccountType('want');
                    if (errors.accountType)
                      setErrors({...errors, accountType: ''});
                  }}>
                  <View
                    style={[
                      styles.radioButton,
                      {borderColor: colors.border},
                      accountType === 'want' && [styles.radioButtonSelected, {borderColor: colors.primary}],
                    ]}>
                    {accountType === 'want' && (
                      <View style={[styles.radioButtonInner, {backgroundColor: colors.primary}]} />
                    )}
                  </View>
                  <View style={styles.accountTypeContent}>
                    <Icon
                      name="restaurant"
                      size={24}
                      color={accountType === 'want' ? colors.primary : colors.textSecondary}
                    />
                    <View style={styles.accountTypeTextContainer}>
                      <Text
                        style={[
                          styles.accountTypeTitle,
                          {color: colors.text},
                          accountType === 'want' && [styles.accountTypeTitleSelected, {color: colors.primary}],
                        ]}>
                        I Want Food
                      </Text>
                      <Text style={[styles.accountTypeDescription, {color: colors.textSecondary}]}>
                        Looking for food assistance
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    {backgroundColor: colors.inputBackground, borderColor: colors.border},
                    accountType === 'provide' && [styles.accountTypeOptionSelected, {borderColor: colors.primary}],
                  ]}
                  onPress={() => {
                    setAccountType('provide');
                    if (errors.accountType)
                      setErrors({...errors, accountType: ''});
                  }}>
                  <View
                    style={[
                      styles.radioButton,
                      {borderColor: colors.border},
                      accountType === 'provide' && [styles.radioButtonSelected, {borderColor: colors.primary}],
                    ]}>
                    {accountType === 'provide' && (
                      <View style={[styles.radioButtonInner, {backgroundColor: colors.primary}]} />
                    )}
                  </View>
                  <View style={styles.accountTypeContent}>
                    <Icon
                      name="volunteer-activism"
                      size={24}
                      color={accountType === 'provide' ? colors.primary : colors.textSecondary}
                    />
                    <View style={styles.accountTypeTextContainer}>
                      <Text
                        style={[
                          styles.accountTypeTitle,
                          {color: colors.text},
                          accountType === 'provide' && [styles.accountTypeTitleSelected, {color: colors.primary}],
                        ]}>
                        I Provide Food
                      </Text>
                      <Text style={[styles.accountTypeDescription, {color: colors.textSecondary}]}>
                        Donating or providing food
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {errors.accountType ? (
                <Text style={styles.errorText}>{errors.accountType}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Password</Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon
                  name="lock"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput, {color: colors.text}]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.placeholder}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>Confirm Password</Text>
              <View style={[styles.inputWrapper, {backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
                <Icon
                  name="lock"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput, {color: colors.text}]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.placeholder}
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword)
                      setErrors({...errors, confirmPassword: ''});
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  style={styles.eyeIcon}>
                  <Icon
                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupButton, {backgroundColor: colors.primary}]}
              onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, {color: colors.textSecondary}]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, {color: colors.primary}]}>Sign In</Text>
              </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optional: {
    fontWeight: '400',
  },
  subLabel: {
    fontSize: 12,
    marginBottom: 12,
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
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signupButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    marginTop: 4,
  },
  accountTypeContainer: {
    marginTop: 8,
  },
  accountTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },
  accountTypeOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  accountTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountTypeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  accountTypeTitleSelected: {
    color: '#007AFF',
  },
  accountTypeDescription: {
    fontSize: 12,
    color: '#666',
  },
});

export default SignupScreen;

