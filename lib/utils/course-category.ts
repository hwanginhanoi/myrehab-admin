// Vietnamese translations for course category types
export const getCourseCategoryTypeLabel = (type?: string): string => {
  switch (type) {
    case 'DIFFICULTY_LEVEL':
      return 'Mức độ khó';
    case 'COURSE_TYPE':
      return 'Loại lộ trình';
    case 'TARGET_AUDIENCE':
      return 'Đối tượng mục tiêu';
    default:
      return 'Không xác định';
  }
};
