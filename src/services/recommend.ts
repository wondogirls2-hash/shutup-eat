import { FOODS } from '../data/foods';
import { FoodItem } from '../types/food';
import { UserPreferences } from '../types/survey';

function isSafeForUser(food: FoodItem, prefs: UserPreferences): boolean {
  const hasAllergen = food.allergens.some((a) => prefs.allergies.includes(a));
  if (hasAllergen) return false;

  const isDisliked = prefs.dislikedCategories.includes(food.category);
  if (isDisliked) return false;

  return true;
}

/**
 * 알러지/못먹는 음식은 완전히 제외하고, 선호 카테고리는 가중치를 줘서
 * 더 자주(하지만 배타적이진 않게) 뽑히도록 후보 풀을 만든다.
 */
function buildWeightedPool(prefs: UserPreferences, excludeId?: string): FoodItem[] {
  const safeFoods = FOODS.filter((f) => isSafeForUser(f, prefs) && f.id !== excludeId);
  const pool = safeFoods.length > 0 ? safeFoods : FOODS.filter((f) => f.id !== excludeId);

  const weighted: FoodItem[] = [];
  for (const food of pool) {
    const weight = prefs.preferredCategories.includes(food.category) ? 3 : 1;
    for (let i = 0; i < weight; i++) weighted.push(food);
  }
  return weighted.length > 0 ? weighted : FOODS;
}

export function pickRandomFood(prefs: UserPreferences, excludeId?: string): FoodItem {
  const pool = buildWeightedPool(prefs, excludeId);
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
