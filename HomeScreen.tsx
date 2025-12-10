import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { translateText } from '../services/geminiAPI';
import { SUPPORTED_LANGUAGES } from '../constants';
import { TranslationResult, HistoryItem } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const navigation = useNavigation<any>();
  
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<'initial' | 'feedback'>('initial');

  const colors = isDark ? {
    text: '#FFF',
    subText: '#AAA',
    placeholder: '#666',
    icon: '#FFF'
  } : {
    text: '#1F2937',
    subText: '#6B7280',
    placeholder: '#9CA3AF',
    icon: '#374151'
  };

  const handleTranslate = async () => {
    if (!text.trim() && !imageBase64) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await translateText(text, targetLang, imageBase64 || undefined);
      setResult(data);
      
      // Save History
      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(),
        original_text: text || '[Image]',
        timestamp: Date.now()
      };
      
      try {
        const storedHistory = await AsyncStorage.getItem('history');
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedHistory = [newItem, ...history].slice(0, 50);
        await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.warn("Failed to save history", e);
      }

      // Trigger feedback modal if it was an image translation
      if (imageBase64) {
        setFeedbackStep('initial');
        setShowFeedbackModal(true);
      }

    } catch (error: any) {
      console.error(error);
      Alert.alert("Translation Failed", error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 || null);
        setText(''); // Clear text if image is selected
      }
    } catch (e) {
      Alert.alert("Error", "Failed to select image.");
    }
  };

  const speak = (content: string) => {
    Speech.speak(content, { language: targetLang });
  };

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content);
    // Could add toast here
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>TranslateAI</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Language Selector (Simplified) */}
          <GlassCard style={styles.langCard}>
            <View style={styles.langRow}>
              <TouchableOpacity style={styles.langButton}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                const temp = sourceLang; setSourceLang(targetLang); setTargetLang(temp);
              }}>
                <Ionicons name="swap-horizontal" size={24} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.langButton}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name}</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Input Area */}
          <GlassCard style={styles.inputCard}>
            {imageUri && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity onPress={() => { setImageUri(null); setImageBase64(null); }} style={styles.closeImage}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter text..."
              placeholderTextColor={colors.placeholder}
              multiline
              value={text}
              onChangeText={setText}
            />
            
            <View style={styles.inputActions}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
                  <Ionicons name="image-outline" size={24} color={colors.icon} />
                </TouchableOpacity>
                {/* Voice Input would go here using expo-av/recording logic (omitted for brevity) */}
              </View>
              
              <TouchableOpacity 
                style={[styles.translateBtn, (!text && !imageUri) && styles.disabledBtn]} 
                onPress={handleTranslate}
                disabled={loading || (!text && !imageUri)}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.translateBtnText}>Translate</Text>}
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Results */}
          {result && (
            <View style={styles.resultsContainer}>
              <GlassCard intensity="high" style={{ borderColor: '#8B5CF6', borderWidth: 1 }}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.langLabel, { color: '#8B5CF6' }]}>{result.target_language_name}</Text>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => speak(result.translations.primary)} style={styles.resultIcon}>
                      <Ionicons name="volume-high-outline" size={20} color={colors.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => copyToClipboard(result.translations.primary)} style={styles.resultIcon}>
                      <Ionicons name="copy-outline" size={20} color={colors.icon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.primaryText, { color: colors.text }]}>{result.translations.primary}</Text>
                
                {result.translations.formal_version && (
                   <View style={styles.variantBox}>
                     <Text style={styles.variantLabel}>Formal</Text>
                     <Text style={[styles.variantText, { color: colors.text }]}>{result.translations.formal_version}</Text>
                   </View>
                )}
              </GlassCard>

              {/* Synonyms */}
              {result.synonyms && result.synonyms.length > 0 && (
                <GlassCard intensity="low">
                  <Text style={[styles.sectionTitle, { color: '#3B82F6' }]}>Synonyms</Text>
                  <View style={styles.chipsContainer}>
                    {result.synonyms.map((syn, idx) => (
                      <View key={idx} style={styles.chip}>
                        <Text style={styles.chipText}>{syn.word}</Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent} intensity="high">
            {feedbackStep === 'initial' ? (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Did the image translation succeed?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#22c55e', marginRight: 10 }]}
                    onPress={() => setShowFeedbackModal(false)}
                  >
                    <Text style={styles.modalBtnText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                    onPress={() => setFeedbackStep('feedback')}
                  >
                    <Text style={styles.modalBtnText}>No</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>What happened?</Text>
                <View style={styles.modalButtonsColumn}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#3b82f6', marginBottom: 10, width: '100%' }]}
                    onPress={() => {
                      setShowFeedbackModal(false);
                      handleTranslate(); // Retry
                    }}
                  >
                    <Text style={styles.modalBtnText}>Try Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#6b7280', width: '100%' }]}
                    onPress={() => {
                      setShowFeedbackModal(false);
                      Alert.alert("Feedback Sent", "Thank you for helping us improve!");
                    }}
                  >
                    <Text style={styles.modalBtnText}>Provide Feedback</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </GlassCard>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  langCard: { marginBottom: 16 },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langButton: { padding: 8 },
  inputCard: { minHeight: 150 },
  input: { fontSize: 18, minHeight: 80, textAlignVertical: 'top' },
  inputActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 10 },
  row: { flexDirection: 'row' },
  iconBtn: { padding: 8 },
  translateBtn: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  translateBtnText: { color: '#FFF', fontWeight: '600' },
  disabledBtn: { opacity: 0.5 },
  imagePreview: { position: 'relative', marginBottom: 10 },
  previewImage: { width: '100%', height: 200, borderRadius: 10 },
  closeImage: { position: 'absolute', top: 5, right: 5 },
  resultsContainer: { marginTop: 10 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  langLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  resultIcon: { padding: 4, marginLeft: 8 },
  primaryText: { fontSize: 24, fontWeight: '300', marginBottom: 16 },
  variantBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  variantLabel: { fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 2 },
  variantText: { fontSize: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginRight: 6, marginBottom: 6 },
  chipText: { color: '#3B82F6', fontSize: 12, fontWeight: '600' },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    padding: 24
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  modalButtonsColumn: {
    width: '100%',
    alignItems: 'center'
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center'
  },
  modalBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16
  }
});