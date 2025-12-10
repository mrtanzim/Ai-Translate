
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  selected: string;
  onChange: (code: string) => void;
  label: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange, label }) => {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="block text-xs font-bold text-gray-500 dark:text-white/60 mb-1 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full appearance-none 
            bg-white/50 dark:bg-black/30 
            backdrop-blur-sm 
            border border-gray-200 dark:border-white/20 
            hover:border-purple-400 dark:hover:border-white/40 
            text-gray-800 dark:text-white 
            rounded-xl py-3 px-4 pr-8 
            focus:outline-none focus:ring-2 focus:ring-purple-400/50 
            transition-all cursor-pointer font-medium
          "
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-white/70">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
