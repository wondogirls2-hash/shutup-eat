export type FoodCategory =
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '아시안'
  | '야식'
  | '디저트';

export type AllergenTag =
  | '갑각류'
  | '견과류'
  | '유제품'
  | '밀가루'
  | '계란'
  | '해산물'
  | '돼지고기'
  | '땅콩';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  imageUrl: string;
  tags: string[];
  allergens: AllergenTag[];
  spicyLevel: 0 | 1 | 2 | 3;
  isVegetarian: boolean;
  roast: string; // 결과 화면에서 보여줄 건방진 한마디
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  distanceMeters: number;
  category: string;
  phone?: string;
  placeUrl?: string;
  score: number; // 0~100, 자체 산정 "추천 강도"
}
