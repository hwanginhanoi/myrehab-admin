'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'next-intl';
import { i18nConfig, type Locale } from './config';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

type I18nProviderProps = {
  children: React.ReactNode;
  initialLocale?: Locale;
};

const LOCALE_STORAGE_KEY = 'myrehab-locale';

export const I18nProvider = ({ children, initialLocale }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Try to get locale from localStorage first
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale && i18nConfig.locales.includes(savedLocale as Locale)) {
        return savedLocale as Locale;
      }
    }
    return initialLocale || i18nConfig.defaultLocale;
  });

  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await import(`../../messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to default locale messages
        const fallbackMessages = await import(`../../messages/${i18nConfig.defaultLocale}.json`);
        setMessages(fallbackMessages.default);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }
  };

  if (isLoading || !messages) {
    return null; // Or a loading spinner
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}; 