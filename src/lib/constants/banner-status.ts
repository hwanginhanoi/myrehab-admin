export enum BannerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export const bannerStatusLabels: Record<BannerStatus, string> = {
  [BannerStatus.ACTIVE]: 'Hoạt động',
  [BannerStatus.INACTIVE]: 'Không hoạt động',
  [BannerStatus.ARCHIVED]: 'Đã lưu trữ',
}

export const bannerStatusOptions = Object.entries(bannerStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
)
