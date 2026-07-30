import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyPreferences, UserPreferences } from '../types/survey';

const PREFERENCES_KEY = '@shutup-eat/preferences';
const EAT_COUNTS_KEY = '@shutup-eat/eat-counts';

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (!raw) return emptyPreferences;
    return { ...emptyPreferences, ...JSON.parse(raw) } as UserPreferences;
  } catch {
    return emptyPreferences;
  }
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

export async function resetPreferences(): Promise<void> {
  await AsyncStorage.removeItem(PREFERENCES_KEY);
}

export type EatCounts = Record<string, number>;

/**
 * "몇 번 먹었는지"는 재추첨(다시뽑기)이나 단순 노출만으로는 절대 올라가지 않는다.
 * 오직 사용자가 O(먹는다) 버튼을 눌러 실제로 먹겠다고 확정한 순간에만 증가시킨다.
 */
export async function loadEatCounts(): Promise<EatCounts> {
  try {
    const raw = await AsyncStorage.getItem(EAT_COUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EatCounts;
  } catch {
    return {};
  }
}

export async function incrementEatCount(foodId: string): Promise<EatCounts> {
  const counts = await loadEatCounts();
  const next: EatCounts = { ...counts, [foodId]: (counts[foodId] ?? 0) + 1 };
  await AsyncStorage.setItem(EAT_COUNTS_KEY, JSON.stringify(next));
  return next;
}
