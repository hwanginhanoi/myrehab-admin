export interface CategoryFormData {
  name: string;
  description: string;
  type: string;
}

export type CategoryType =
  | 'BODY_PART'
  | 'RECOVERY_STAGE'
  | 'HEALTH_CONDITION'
  | 'DIFFICULTY_LEVEL'
  | 'EXERCISE_TYPE';