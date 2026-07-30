/**
 * 실제 촬영/구매한 음식 사진을 준비되는 대로 여기에 하나씩 등록한다.
 * key는 foods.ts의 FoodItem.id와 반드시 일치해야 한다.
 *
 * Metro 번들러 제약상 require() 경로는 동적으로 만들 수 없어서
 * 사진이 준비된 항목만 이렇게 한 줄씩 정적으로 추가해야 한다.
 *
 * 사용법:
 * 1. assets/foods/{id}.jpg (또는 .png) 로 사진 파일을 넣는다.
 * 2. 아래 객체에 `id: require('../../assets/foods/{id}.jpg'),` 한 줄 추가.
 * 3. 등록되지 않은 음식은 자동으로 foods.ts의 imageUrl(임시 이미지)로 대체된다.
 */
export const LOCAL_FOOD_IMAGES: Record<string, ReturnType<typeof require>> = {
  sundae: require('../../assets/foods/sundae.jpg'),
};
