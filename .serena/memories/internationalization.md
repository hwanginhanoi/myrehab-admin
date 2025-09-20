# Internationalization (i18n)

## Configuration
- **Library**: next-intl
- **Default Locale**: Vietnamese (`vi`)
- **Supported Locales**: Vietnamese (`vi`), English (`en`)
- **Config File**: `lib/i18n/config.ts`

## Message Files
- `messages/vi.json` - Vietnamese translations (default)
- `messages/en.json` - English translations

## Implementation Details
- Uses next-intl for React internationalization
- Locale detection and switching implemented
- Language switcher component available
- Context provider in `lib/i18n/i18n-context.tsx`

## Usage Patterns
- Import translations using next-intl hooks
- Locale routing handled by Next.js middleware
- Default locale is Vietnamese, making this primarily a Vietnamese application with English support