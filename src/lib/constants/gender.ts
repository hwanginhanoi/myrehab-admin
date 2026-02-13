export const genderLabels: Record<string, string> = {
  Male: 'Nam',
  Female: 'Nữ',
  Other: 'Khác',
}

export const genderOptions = Object.entries(genderLabels).map(
  ([value, label]) => ({ value, label })
)
