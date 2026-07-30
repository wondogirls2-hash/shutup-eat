# 닥치고 이거먹어 (shutup-eat)

고민 그만하고 뭘 먹을지 정해주는, 무례하고 건방진 랜덤 음식 추천 앱.

- 처음 실행 시 알러지 / 못 먹는 음식 / 선호 음식을 간단히 서베이
- 화면 가운데 큰 버튼("이거나 처먹어")을 누르면 음식 사진 + 이름 + 근처 식당(추천 강도 포함) 추천
- 마음에 안 들면 화면 상단 "다시뽑기"로 재추첨

## 기술 스택

- [Expo SDK 54](https://expo.dev) (React Native, TypeScript) — 스토어에 배포된 Expo Go 앱이 최신 SDK보다 지원이 늦는 경우가 있어, 별도 Dev Client 빌드 없이 Expo Go로 바로 테스트할 수 있도록 SDK 54로 고정했습니다. Expo Go 업데이트로 최신 SDK 지원이 확인되면 `npm install expo@latest && npx expo install --fix`로 올릴 수 있습니다.
- `@react-navigation` (온보딩 ↔ 메인 화면 전환)
- `@react-native-async-storage/async-storage` (서베이 결과 로컬 저장)
- `expo-location` (근처 식당 검색을 위한 현재 위치)
- 카카오 로컬 API (근처 식당 검색)
- `@expo-google-fonts/black-han-sans`, `@expo-google-fonts/do-hyeon` (거칠고 임팩트 있는 폰트)

## 폴더 구조

```
src/
  components/   BigButton, FoodCard, RestaurantList, SurveyChip
  data/         음식 시드 데이터 (foods.ts)
  navigation/   RootNavigator, 화면 타입
  screens/      OnboardingScreen, MainScreen
  services/     storage(로컬저장), recommend(추천로직), location, kakaoLocal(식당검색)
  theme/        colors, typography, layout(두꺼운 테두리/하드섀도 스타일)
  types/        food.ts, survey.ts
```

## 시작하기

```bash
npm install
npm run start   # Expo 개발 서버 실행 (Expo Go 앱으로 QR 스캔 or 시뮬레이터)
```

### 근처 식당 검색 API 키 설정 (필수)

근처 식당 검색은 [카카오 로컬 API](https://developers.kakao.com/docs/latest/ko/local/dev-guide)를 사용합니다.

1. [Kakao Developers](https://developers.kakao.com)에서 애플리케이션 생성
2. "앱 키" 중 **REST API 키** 복사
3. 프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고)

```
EXPO_PUBLIC_KAKAO_API_KEY=발급받은_REST_API_키
```

키가 없으면 앱은 죽지 않고, 결과 화면에 "지도 API 키가 아직 안 꽂혀있다" 같은 안내 문구가 대신 노출됩니다.

### 음식 이미지

`src/data/foods.ts`의 `imageUrl`은 데모용으로 [LoremFlickr](https://loremflickr.com) 키워드 이미지를 사용합니다. 실제 사진이 준비되면 자동으로 그쪽을 우선 사용하도록 로컬 이미지 레이어(`src/data/localImages.ts`)가 연결되어 있습니다.

실제 사진 추가하는 법:

1. `assets/foods/{음식id}.jpg` 형식으로 사진 파일을 넣는다 (id는 `src/data/foods.ts`의 각 항목 `id` 값과 동일해야 함, 예: `assets/foods/sundae.jpg`)
2. `src/data/localImages.ts`에 `{음식id}: require('../../assets/foods/{음식id}.jpg'),` 한 줄 추가
3. 등록 안 된 음식은 자동으로 임시 이미지(LoremFlickr)로 대체되니, 준비되는 대로 하나씩 추가하면 됨

사진을 넣은 뒤에는 `npm run compress-images`로 용량을 줄이는 걸 추천합니다 (가장 긴 변 1200px 제한 + JPEG 품질 78로 재인코딩, `.png`로 넣어도 자동으로 `.jpg`로 통일됨). 확장자가 바뀌면 `localImages.ts`의 `require` 경로도 맞춰서 수정해야 합니다.

## 톤 & 무드 가이드

- 컬러: 어두운 배경(`#121212`) + 강렬한 레드(`#FF3B30`) + 옐로우 포인트(`#FFD400`)
- 스타일: 두꺼운 검은 테두리 + 하드 섀도(네오브루탈리즘) — 버튼/카드가 눌리면 그림자가 눌려 들어가는 느낌
- 폰트: BlackHanSans(제목/버튼), DoHyeon(본문) — 둘 다 두껍고 포스터 느낌의 무료 구글 폰트
- 카피: 반말 + 가벼운 츤데레 반말투("~해", "~처먹어", "안 주면 나도 몰라") — 실제 비속어는 배제하고 장난스러운 선을 유지

## 추천 로직

- `src/services/recommend.ts`: 알러지 성분이 포함되거나 사용자가 못 먹는다고 표시한 카테고리는 후보에서 완전히 제외
- 선호 카테고리로 등록된 음식은 가중치를 3배로 줘서 더 자주(하지만 배타적이지 않게) 등장
- "다시뽑기" 시 방금 나온 메뉴는 제외하고 다시 추첨

## 향후 확장 아이디어

- 서베이/추천 이력 서버 저장 (Firebase/Supabase) → 기기 변경 시에도 유지
- 음식 DB를 자체 백엔드로 이전, 관리자 페이지에서 이미지/카피 관리
- 하루 다시뽑기 횟수 제한 + 리텐션용 푸시 알림("점심때 됐다, 닥치고 뽑아")
- 카카오 API 대신/추가로 네이버 지역 검색 API, Google Places API 이중화
