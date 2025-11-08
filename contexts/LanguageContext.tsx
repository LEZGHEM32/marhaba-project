import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';
type Translations = { [key: string]: string };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dir: Direction;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [translations, setTranslations] = useState<{ [key in Language]?: Translations }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [arRes, enRes] = await Promise.all([
          fetch('./i18n/ar.json'),
          fetch('./i18n/en.json')
        ]);
        
        if (!arRes.ok || !enRes.ok) {
          throw new Error('Failed to fetch translation files');
        }

        const arJson = await arRes.json();
        const enJson = await enRes.json();
        setTranslations({ ar: arJson, en: enJson });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language]?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach((replacementKey) => {
            const value = replacements[replacementKey];
            translation = translation.replace(
                new RegExp(`{{${replacementKey}}}`, 'g'),
                String(value)
            );
        });
    }
    return translation;
  };

  if (isLoading) {
    // Render nothing or a loading spinner while translations are loading
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
