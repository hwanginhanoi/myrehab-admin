export enum CategoryType {
  BODY_PART = 'BODY_PART',                 // Categories based on body parts (e.g., Neck, Shoulder, Back, Knee)
  HEALTH_CONDITION = 'HEALTH_CONDITION',    // Categories based on health conditions (e.g., Arthritis, Post-surgery)
  EXERCISE_TYPE = 'EXERCISE_TYPE',          // Categories based on exercise types (e.g., Stretching, Strengthening)
  EXERCISE_EQUIPMENTS = 'EXERCISE_EQUIPMENTS', // Categories based on equipment (e.g., Resistance Bands, Dumbbells)
  OTHERS = 'OTHERS'                        // Other types of categories
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.BODY_PART]: 'Bộ phận cơ thể',
  [CategoryType.HEALTH_CONDITION]: 'Tình trạng sức khỏe',
  [CategoryType.EXERCISE_TYPE]: 'Loại bài tập',
  [CategoryType.EXERCISE_EQUIPMENTS]: 'Dụng cụ tập luyện',
  [CategoryType.OTHERS]: 'Khác'
}

export const categoryTypeOptions = Object.entries(categoryTypeLabels).map(([value, label]) => ({
  value,
  label
}))
