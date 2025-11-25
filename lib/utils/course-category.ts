// Vietnamese translations for course category types
export const getCourseCategoryTypeLabel = (type?: string): string => {
  switch (type) {
    case 'BODY_PART':
      return 'Bộ phận cơ thể';
    case 'RECOVERY_STAGE':
      return 'Giai đoạn phục hồi';
    case 'HEALTH_CONDITION':
      return 'Tình trạng sức khỏe';
    case 'DIFFICULTY_LEVEL':
      return 'Mức độ khó';
    case 'EXERCISE_TYPE':
      return 'Loại bài tập';
    default:
      return 'Không xác định';
  }
};
