import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const MainLayout = () => {
  const { isDark } = useTheme();
  
  // Custom Dark Theme that fully satisfies the Theme type
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#8B5CF6',
      background: 'transparent',
      card: '#1F2937',
      text: '#FFF',
      border: '#374151',
      notification: '#F59E0B'
    },
    fonts: DarkTheme.fonts // Ensure fonts property is included
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#e2e8f0']}
        style={StyleSheet.absoluteFill}
      />
      <NavigationContainer theme={isDark ? customDarkTheme : undefined}>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}