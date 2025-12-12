import React from 'react';
import {Image, StyleSheet, View, ImageSourcePropType} from 'react-native';

interface LogoProps {
  size?: number;
  style?: any;
}

const Logo: React.FC<LogoProps> = ({size = 120, style}) => {
  // Try to load the logo from assets, fallback to a placeholder if not found
  let logoSource: ImageSourcePropType;

  try {
    // Try to require the logo image
    logoSource = require('../assets/images/logo.png');
  } catch (error) {
    // If logo doesn't exist, use a placeholder or return null
    console.warn('Logo image not found. Please add logo.png to src/assets/images/');
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSource}
        style={[styles.logo, {width: size, height: size}]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default Logo;

