import { colors } from './colors';

// 두꺼운 테두리 + 딱딱한 그림자로 "네오브루탈리즘" 느낌의 거친 카드 스타일을 만든다.
export const hardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export const thickBorder = {
  borderWidth: 3,
  borderColor: colors.border,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
