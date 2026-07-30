import * as Haptics from 'expo-haptics';

/**
 * 버튼 누를 때 살짝 "톡" 하는 정도의 약한 진동.
 * 웹 등 진동을 지원하지 않는 환경에서는 조용히 무시한다.
 */
export function triggerLightHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
