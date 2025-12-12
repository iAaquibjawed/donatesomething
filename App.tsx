/**
 * DonateSome React Native App
 * @format
 */

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform, View, Text, StatusBar} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {UserProvider} from './src/context/UserContext';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import FollowersScreen from './src/screens/FollowersScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tabs Navigator - must be inside ThemeProvider
function MainTabsNavigator() {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useTheme();
  // This would typically come from a context or state management
  // For now, using a static value - you can make this dynamic
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + Math.max(insets.bottom, 0),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcon
              name={focused ? 'home-variant' : 'home-variant-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcon
              name={focused ? 'magnify' : 'magnify'}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <View style={{position: 'relative', width: 28, height: 28}}>
              <MaterialCommunityIcon
                name={focused ? 'bell' : 'bell-outline'}
                size={28}
                color={color}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: '#FF3B30',
                    borderRadius: unreadCount > 9 ? 9 : 10,
                    minWidth: unreadCount > 9 ? 20 : 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: unreadCount > 9 ? 5 : 0,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                  }}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: 'Notifications',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcon
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator (Tabs with Stack) - must be inside ThemeProvider
function MainAppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
              <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
              <Stack.Screen name="PostDetail" component={PostDetailScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="CreatePost" component={CreatePostScreen} />
              <Stack.Screen name="Following" component={FollowingScreen} />
              <Stack.Screen name="Followers" component={FollowersScreen} />
    </Stack.Navigator>
  );
}

// Auth Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// App component - must be inside ThemeProvider
function AppContent(): React.JSX.Element {
  const {isDark, colors} = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.primary,
          },
          fonts: {
            regular: {
              fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif',
                default: 'System',
              }),
              fontWeight: '400' as const,
            },
            medium: {
              fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-medium',
                default: 'System',
              }),
              fontWeight: '500' as const,
            },
            bold: {
              fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif',
                default: 'System',
              }),
              fontWeight: '700' as const,
            },
            heavy: {
              fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif',
                default: 'System',
              }),
              fontWeight: '800' as const,
            },
          },
        }}>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="MainApp" component={MainAppNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Root App component with ThemeProvider and UserProvider
function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
