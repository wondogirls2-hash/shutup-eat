import { Restaurant } from '../types/food';
import { Coordinates } from './location';

const KAKAO_API_KEY = process.env.EXPO_PUBLIC_KAKAO_API_KEY;
const KEYWORD_SEARCH_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';

interface KakaoDocument {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  phone: string;
  place_url: string;
  distance: string;
}

/**
 * 카카오는 평점을 제공하지 않으므로, 거리 기반으로 "추천 강도" 점수를
 * 자체 산정한다. 가까울수록 점수가 높고, 40~99 사이로 정규화한다.
 */
function computeScore(distanceMeters: number): number {
  const raw = 100 - distanceMeters / 20;
  return Math.max(40, Math.min(99, Math.round(raw)));
}

export async function searchNearbyRestaurants(
  foodName: string,
  coords: Coordinates,
  radiusMeters = 2000
): Promise<Restaurant[]> {
  if (!KAKAO_API_KEY) {
    throw new Error('KAKAO_API_KEY_MISSING');
  }

  const params = new URLSearchParams({
    query: foodName,
    x: String(coords.longitude),
    y: String(coords.latitude),
    radius: String(radiusMeters),
    sort: 'distance',
    size: '10',
  });

  const response = await fetch(`${KEYWORD_SEARCH_URL}?${params.toString()}`, {
    headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`KAKAO_API_ERROR_${response.status}`);
  }

  const data = (await response.json()) as { documents: KakaoDocument[] };

  return data.documents.map((doc) => {
    const distanceMeters = Number(doc.distance) || 0;
    return {
      id: doc.id,
      name: doc.place_name,
      address: doc.road_address_name || doc.address_name,
      distanceMeters,
      category: doc.category_name,
      phone: doc.phone || undefined,
      placeUrl: doc.place_url,
      score: computeScore(distanceMeters),
    };
  });
}
