# Internationalization (i18n) Guide

This project uses `next-intl` for internationalization without routing. Vietnamese is the default language.

## Overview

- **Default Language**: Vietnamese (`vi`)
- **Supported Languages**: Vietnamese (`vi`), English (`en`)
- **No i18n Routing**: Language switching is handled via client-side state, not URL paths

## Configuration

### Language Configuration
Located in `lib/i18n/config.ts`:
```typescript
export const i18nConfig = {
  defaultLocale: 'vi',
  locales: ['vi', 'en'] as const,
} as const;
```

### Translation Files
Translation files are stored in the `messages` directory:
- `messages/vi.json` - Vietnamese translations
- `messages/en.json` - English translations

## Usage

### In Client Components

Use the `useTranslations` hook from `next-intl`:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### With Specific Namespaces

```typescript
const t = useTranslations('navigation');
// Access: t('dashboard'), t('patients'), etc.
```

### In Server Components

For server components, you'll need to get the locale from the context:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

## Language Switching

The language switcher is available in the header. It:
1. Saves the selected language to localStorage
2. Updates the UI immediately without page reload
3. Persists across sessions

### Using the Language Switcher Hook

```typescript
import { useI18n } from '@/lib/i18n/i18n-context';

export function MyComponent() {
  const { locale, setLocale } = useI18n();
  
  return (
    <button onClick={() => setLocale('en')}>
      Switch to English
    </button>
  );
}
```

## Adding New Translations

1. Add your translations to both language files:

`messages/vi.json`:
```json
{
  "myFeature": {
    "title": "Tiêu đề của tôi",
    "description": "Mô tả của tôi"
  }
}
```

`messages/en.json`:
```json
{
  "myFeature": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

2. Use in your component:
```typescript
const t = useTranslations('myFeature');
// t('title'), t('description')
```

## Translation Structure

The translations are organized by feature/domain:

- `common` - Common UI elements (save, cancel, delete, etc.)
- `navigation` - Navigation menu items
- `auth` - Authentication related texts
- `exercise` - Exercise management texts
- `plan` - Treatment plan texts
- `patient` - Patient management texts
- `messages` - Success/error messages

## Best Practices

1. **Always provide translations for both languages** when adding new text
2. **Use namespaces** to organize translations by feature
3. **Keep translation keys descriptive** (e.g., `exercise.deleteConfirm` not `exercise.msg1`)
4. **Avoid hardcoded text** - always use translations
5. **Test both languages** when developing new features

## Example Page

See `/i18n-example` for a working example of how to use translations in various scenarios.

## Troubleshooting

### Translation not showing
- Check if the translation key exists in both language files
- Ensure you're using the correct namespace
- Verify the component is wrapped with `I18nProvider`

### Language not persisting
- Check browser's localStorage for `myrehab-locale` key
- Ensure JavaScript is enabled
- Clear browser cache if needed 