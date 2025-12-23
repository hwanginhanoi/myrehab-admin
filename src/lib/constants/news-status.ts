export enum NewsStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export const newsStatusLabels: Record<NewsStatus, string> = {
  [NewsStatus.DRAFT]: 'Bản nháp',
  [NewsStatus.PUBLISHED]: 'Đã công khai',
  [NewsStatus.ARCHIVED]: 'Đã ẩn'
}

export const newsStatusOptions = Object.entries(newsStatusLabels).map(([value, label]) => ({
  value,
  label
}))
