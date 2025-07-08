// This file provides type safety for translation keys
// It's automatically generated based on the messages structure

type Messages = typeof import('../messages/vi.json');

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

export {}; 