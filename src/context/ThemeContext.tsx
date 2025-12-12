import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';

// Safe AsyncStorage import with fallback
let AsyncStorage: any = null;
try {
  const AsyncStorageModule = require('@react-native-async-storage/async-storage');
  AsyncStorage = AsyncStorageModule.default || AsyncStorageModule;
} catch (error) {
  console.warn('AsyncStorage not available, theme preference will not persist');
  // Fallback in-memory storage
  const memoryStorage: {[key: string]: string} = {};
  AsyncStorage = {
    getItem: async (key: string) => memoryStorage[key] || null,
    setItem: async (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    removeItem: async (key: string) => {
      delete memoryStorage[key];
    },
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  cardBackground: string;
  headerBackground: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBackground: string;
  placeholder: string;
}

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E5E5EA',
  primary: '#007AFF',
  cardBackground: '#FFFFFF',
  headerBackground: '#F5F5F5',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#007AFF',
  tabBarInactive: '#8E8E93',
  inputBackground: '#FFFFFF',
  placeholder: '#999999',
};

const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  border: '#38383A',
  primary: '#0A84FF',
  cardBackground: '#1C1C1E',
  headerBackground: '#000000',
  tabBarBackground: '#1C1C1E',
  tabBarActive: '#0A84FF',
  tabBarInactive: '#8E8E93',
  inputBackground: '#2C2C2E',
  placeholder: '#8E8E93',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@donatesome_theme_mode';

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  // Determine if dark mode should be active
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (AsyncStorage && AsyncStorage.getItem) {
          const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
          if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
            setThemeModeState(savedTheme as ThemeMode);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      if (AsyncStorage && AsyncStorage.setItem) {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else {
      setThemeMode(isDark ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        colors,
        setThemeMode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default export for compatibility
export default ThemeProvider;

