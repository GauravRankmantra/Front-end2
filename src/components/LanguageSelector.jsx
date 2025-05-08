// src/components/LanguageSelector.js
import React from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
];

const LanguageSelector = () => {
  const changeLanguage = (lang) => {
    const tryTranslate = () => {
      const select = document.querySelector("select.goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      } else {
        // Retry after a short delay if the element is not yet available
        setTimeout(tryTranslate, 100);
      }
    };

    tryTranslate();
  };

  return (
    <div className="language-selector flex flex-wrap gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className="lang-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-1"
        >
          <span className="flag text-lg">{lang.flag}</span> {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
