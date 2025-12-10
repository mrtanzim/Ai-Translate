import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  noPadding = false,
  intensity = 'medium' 
}) => {
  const { isDark } = useTheme();

  const blurAmount = {
    low: 10,
    medium: 20,
    high: 40
  };

  const tint = isDark ? 'dark' : 'light';
  
  // Fallback background color for android if blur is subtle
  const bgStyle = isDark 
    ? { backgroundColor: 'rgba(30, 30, 30, 0.6)' }
    : { backgroundColor: 'rgba(255, 255, 255, 0.6)' };

  return (
    <View style={[styles.container, style]}>
      <BlurView 
        intensity={blurAmount[intensity]} 
        tint={tint} 
        style={[StyleSheet.absoluteFill, bgStyle]} 
      />
      <View style={[styles.content, !noPadding && styles.padding]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Android Shadow
    elevation: 5,
  },
  content: {
    zIndex: 1,
  },
  padding: {
    padding: 20,
  }
});
