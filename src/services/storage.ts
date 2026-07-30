import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyPreferences, UserPreferences } from '../types/survey';

const PREFERENCES_KEY = '@shutup-eat/preferences';

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
