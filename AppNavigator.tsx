import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          width: 240,
        },
        drawerLabelStyle: {
          color: isDark ? '#FFFFFF' : '#333333',
        },
        drawerActiveBackgroundColor: isDark ? '#374151' : '#F3F4F6',
        drawerActiveTintColor: '#8B5CF6',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="language" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="History" 
        component={HomeScreen} // Reuse Home for demo
        options={{
          drawerIcon: ({ color }) => <Ionicons name="time-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Favorites" 
        component={HomeScreen} // Reuse Home for demo
        options={{
          drawerIcon: ({ color }) => <Ionicons name="star-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}