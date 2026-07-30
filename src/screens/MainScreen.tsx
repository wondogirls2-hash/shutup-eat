import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/layout';
import { BigButton } from '../components/BigButton';
import { FoodCard } from '../components/FoodCard';
import { RestaurantList } from '../components/RestaurantList';
import { FoodItem, Restaurant } from '../types/food';
import { emptyPreferences, UserPreferences } from '../types/survey';
import { loadPreferences, resetPreferences } from '../services/storage';
import { pickRandomFood } from '../services/recommend';
import { getCurrentCoordinates } from '../services/location';
import { searchNearbyRestaurants } from '../services/kakaoLocal';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const ERROR_MESSAGES: Record<string, string> = {
  LOCATION_PERMISSION_DENIED: '위치 권한 안 주면 나도 몰라. 그냥 아무데나 가서 처먹어.',
  KAKAO_API_KEY_MISSING: '지도 API 키가 아직 안 꽂혀있다. 그냥 아무데나 가서 처먹어.',
};

export function MainScreen({ navigation }: Props) {
  const [prefs, setPrefs] = useState<UserPreferences>(emptyPreferences);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [restaurantError, setRestaurantError] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadPreferences().then(setPrefs);
  }, []);

  const fetchRestaurantsFor = async (food: FoodItem) => {
    setLoadingRestaurants(true);
    setRestaurantError(undefined);
    setRestaurants([]);
    try {
      const coords = await getCurrentCoordinates();
      const results = await searchNearbyRestaurants(food.name, coords);
      setRestaurants(results);
    } catch (e) {
      const key = e instanceof Error ? e.message : '';
      setRestaurantError(ERROR_MESSAGES[key] ?? '식당 검색하다 뭔가 꼬였다. 그냥 아무데나 가서 처먹어.');
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const handlePick = () => {
    const food = pickRandomFood(prefs, currentFood?.id);
    setCurrentFood(food);
    fetchRestaurantsFor(food);
  };

  const handleResetPreferences = async () => {
    await resetPreferences();
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.title, styles.headerTitle]}>닥치고{'\n'}이거먹어</Text>
        {currentFood && (
          <Pressable style={styles.rerollButton} onPress={handlePick}>
            <Text style={[typography.button, styles.rerollText]}>다시뽑기</Text>
          </Pressable>
        )}
      </View>

      {!currentFood ? (
        <View style={styles.emptyState}>
          <Text style={[typography.body, styles.emptyHint]}>
            뭘 먹을지 고민하지 말고{'\n'}그냥 눌러.
          </Text>
          <BigButton label={'이거나\n처먹어'} onPress={handlePick} size={220} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.resultScroll}
          showsVerticalScrollIndicator={false}
        >
          <FoodCard food={currentFood} />
          <RestaurantList
            restaurants={restaurants}
            loading={loadingRestaurants}
            errorMessage={restaurantError}
          />
        </ScrollView>
      )}

      <Pressable style={styles.resetLink} onPress={handleResetPreferences}>
        <Text style={[typography.caption, styles.resetLinkText]}>취향 다시 설정하기</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
  },
  rerollButton: {
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rerollText: {
    color: colors.textOnAccent,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHint: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  resultScroll: {
    paddingBottom: spacing.xl,
  },
  resetLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  resetLinkText: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
