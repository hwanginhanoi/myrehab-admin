export enum CategoryType {
  BODY_PART = 'BODY_PART',           // Categories based on body parts (e.g., Neck, Shoulder, Back, Knee)
  RECOVERY_STAGE = 'RECOVERY_STAGE',      // Categories based on recovery stages (e.g., Early, Mid, Late recovery)
  HEALTH_CONDITION = 'HEALTH_CONDITION',    // Categories based on health conditions (e.g., Arthritis, Post-surgery)
  DIFFICULTY_LEVEL = 'DIFFICULTY_LEVEL',    // Categories based on difficulty (e.g., Beginner, Intermediate, Advanced)
  EXERCISE_TYPE = 'EXERCISE_TYPE'        // Categories based on exercise type (e.g., Stretching, Strength, Balance)
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.BODY_PART]: 'Bộ phận cơ thể',
  [CategoryType.RECOVERY_STAGE]: 'Giai đoạn phục hồi',
  [CategoryType.HEALTH_CONDITION]: 'Tình trạng sức khỏe',
  [CategoryType.DIFFICULTY_LEVEL]: 'Mức độ khó',
  [CategoryType.EXERCISE_TYPE]: 'Loại bài tập'
}

export const categoryTypeOptions = Object.entries(categoryTypeLabels).map(([value, label]) => ({
  value,
  label
}))
