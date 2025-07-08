export const i18nConfig = {
  defaultLocale: 'vi',
  locales: ['vi', 'en'] as const,
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}; 