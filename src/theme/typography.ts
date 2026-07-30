// BlackHanSans: 포스터 느낌의 두꺼운 임팩트 폰트 (제목, 버튼)
// DoHyeon: 둥글고 단단한 임팩트 폰트 (본문, 서브 텍스트)
export const fonts = {
  impact: 'BlackHanSans_400Regular',
  body: 'DoHyeon_400Regular',
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.impact,
    fontSize: 40,
    lineHeight: 46,
  },
  title: {
    fontFamily: fonts.impact,
    fontSize: 26,
    lineHeight: 32,
  },
  button: {
    fontFamily: fonts.impact,
    fontSize: 20,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
} as const;
