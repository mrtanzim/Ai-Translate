import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation();

  const textColor = isDark ? '#FFF' : '#333';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#111' : '#F9FAFB' }]}>
       <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
         </TouchableOpacity>
         <Text style={[styles.title, { color: textColor }]}>Settings</Text>
       </View>

       <View style={styles.section}>
         <Text style={styles.sectionTitle}>Appearance</Text>
         <GlassCard>
           <View style={styles.row}>
             <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
             <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
           </View>
         </GlassCard>
       </View>

       <View style={styles.section}>
         <Text style={styles.sectionTitle}>Preferences</Text>
         <GlassCard>
           <View style={styles.row}>
             <Text style={[styles.label, { color: textColor }]}>Auto-play Audio</Text>
             <Switch value={false} onValueChange={() => {}} />
           </View>
           <View style={[styles.row, { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#EEE', paddingTop: 15, marginTop: 15 }]}>
             <Text style={[styles.label, { color: textColor }]}>Save History</Text>
             <Switch value={true} onValueChange={() => {}} />
           </View>
         </GlassCard>
       </View>

       <View style={styles.footer}>
         <Text style={{ color: '#888' }}>TranslateAI v1.0.0 (Native)</Text>
       </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '500' },
  footer: { alignItems: 'center', marginTop: 20, marginBottom: 40 }
});
