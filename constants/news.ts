export const NEWS_CATEGORIES = {
  GENERAL: 'GENERAL',
  HEALTH_TIPS: 'HEALTH_TIPS',
  REHABILITATION: 'REHABILITATION',
  CLINIC_NEWS: 'CLINIC_NEWS',
  SUCCESS_STORIES: 'SUCCESS_STORIES',
} as const;

export type NewsCategory = typeof NEWS_CATEGORIES[keyof typeof NEWS_CATEGORIES];

export const NEWS_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type NewsStatus = typeof NEWS_STATUSES[keyof typeof NEWS_STATUSES];

export const NEWS_CATEGORY_OPTIONS = [
  { value: NEWS_CATEGORIES.GENERAL, labelKey: 'news.categories.general' },
  { value: NEWS_CATEGORIES.HEALTH_TIPS, labelKey: 'news.categories.healthTips' },
  { value: NEWS_CATEGORIES.REHABILITATION, labelKey: 'news.categories.rehabilitation' },
  { value: NEWS_CATEGORIES.CLINIC_NEWS, labelKey: 'news.categories.clinicNews' },
  { value: NEWS_CATEGORIES.SUCCESS_STORIES, labelKey: 'news.categories.successStories' },
] as const;

export const NEWS_STATUS_OPTIONS = [
  { value: NEWS_STATUSES.DRAFT, labelKey: 'news.statuses.draft' },
  { value: NEWS_STATUSES.PUBLISHED, labelKey: 'news.statuses.published' },
  { value: NEWS_STATUSES.ARCHIVED, labelKey: 'news.statuses.archived' },
] as const;
