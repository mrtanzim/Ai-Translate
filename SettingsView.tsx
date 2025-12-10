
import React from 'react';
import { GlassCard } from './GlassCard';
import { AppSettings } from '../types';
import { 
  XMarkIcon, 
  SwatchIcon, 
  LanguageIcon, 
  SparklesIcon, 
  SpeakerWaveIcon, 
  CircleStackIcon
} from '@heroicons/react/24/outline';

interface SettingsViewProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onClose: () => void;
}

const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-white/5 last:border-0">
    <span className="text-gray-700 dark:text-white/80 font-medium">{label}</span>
    {children}
  </div>
);

const Toggle = ({ value, onChange }: { value: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!value)}
    className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-purple-500' : 'bg-gray-300 dark:bg-white/20'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSetting, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl no-scrollbar">
        <GlassCard className="h-full flex flex-col relative" intensity="high">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-transparent z-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="bg-purple-500/10 p-2 rounded-lg mr-3 text-purple-600 dark:text-purple-400">
                <SwatchIcon className="w-6 h-6" />
              </span>
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-white/60" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Appearance Section */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Appearance</h3>
              <GlassCard className="bg-white/50 dark:bg-black/20" noPadding>
                <div className="px-6 py-2">
                  <SettingRow label="Theme">
                    <div className="flex space-x-1 bg-gray-100 dark:bg-black/30 p-1 rounded-lg">
                      {['light', 'dark', 'auto'].map((t) => (
                        <button
                          key={t}
                          onClick={() => updateSetting('theme', t as any)}
                          className={`px-3 py-1 text-sm rounded-md capitalize transition-all ${settings.theme === t ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-white/50'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                  <SettingRow label="Glassmorphism Level">
                    <select 
                      value={settings.glassmorphismLevel}
                      onChange={(e) => updateSetting('glassmorphismLevel', e.target.value as any)}
                      className="bg-transparent text-gray-800 dark:text-white font-medium focus:outline-none text-right cursor-pointer"
                    >
                      <option className="text-black" value="low">Low</option>
                      <option className="text-black" value="medium">Medium</option>
                      <option className="text-black" value="high">High</option>
                    </select>
                  </SettingRow>
                </div>
              </GlassCard>
            </section>

            {/* Translation Section */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Translation</h3>
              <GlassCard className="bg-white/50 dark:bg-black/20" noPadding>
                <div className="px-6 py-2">
                  <SettingRow label="Auto Detect Language">
                    <Toggle value={settings.autoDetectLanguage} onChange={(v) => updateSetting('autoDetectLanguage', v)} />
                  </SettingRow>
                  <SettingRow label="Translation Speed">
                    <select 
                      value={settings.translationSpeed}
                      onChange={(e) => updateSetting('translationSpeed', e.target.value as any)}
                      className="bg-transparent text-gray-800 dark:text-white font-medium focus:outline-none text-right cursor-pointer"
                    >
                      <option className="text-black" value="fast">Fast</option>
                      <option className="text-black" value="balanced">Balanced</option>
                      <option className="text-black" value="accurate">Accurate</option>
                    </select>
                  </SettingRow>
                </div>
              </GlassCard>
            </section>

            {/* Voice Section */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Voice & Audio</h3>
              <GlassCard className="bg-white/50 dark:bg-black/20" noPadding>
                <div className="px-6 py-2">
                  <SettingRow label="Show Pronunciation">
                     <Toggle value={settings.showPronunciation} onChange={(v) => updateSetting('showPronunciation', v)} />
                  </SettingRow>
                  <SettingRow label="Auto-play Translation">
                     <Toggle value={settings.autoPlayTranslation} onChange={(v) => updateSetting('autoPlayTranslation', v)} />
                  </SettingRow>
                  <SettingRow label="Voice Speed">
                    <select 
                      value={settings.voiceSpeed}
                      onChange={(e) => updateSetting('voiceSpeed', e.target.value as any)}
                      className="bg-transparent text-gray-800 dark:text-white font-medium focus:outline-none text-right cursor-pointer"
                    >
                      <option className="text-black" value="slow">Slow</option>
                      <option className="text-black" value="normal">Normal</option>
                      <option className="text-black" value="fast">Fast</option>
                    </select>
                  </SettingRow>
                </div>
              </GlassCard>
            </section>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400 dark:text-white/30">
            TranslateAI v1.0.0 • Powered by Google Gemini 2.0 Flash
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
