export enum CategoryType {
    GENERAL = 'GENERAL',
    HEALTH_TIPS = 'HEALTH_TIPS',
    REHABILITATION = 'REHABILITATION',
    CLINIC_NEWS = 'CLINIC_NEWS',
    SUCCESS_STORIES = 'SUCCESS_STORIES'
}

export const newsCategoryTypeLabels: Record<CategoryType, string> = {
    [CategoryType.GENERAL]: 'Tin tức chung',
    [CategoryType.HEALTH_TIPS]: 'Mẹo sức khỏe',
    [CategoryType.REHABILITATION]: 'Phục hồi chức năng',
    [CategoryType.CLINIC_NEWS]: 'Tin tức phòng khám',
    [CategoryType.SUCCESS_STORIES]: 'Tin tức thường ngày'
}

export const newsCategoryTypeOptions = Object.entries(newsCategoryTypeLabels).map(([value, label]) => ({
    value,
    label
}))
