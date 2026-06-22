/** dimension 코드 → 표시 레이블. 없으면 코드 그대로 노출. */
const DIMENSION_LABELS: Record<string, string> = {
  _ALL_: '전체',
  // 가입 provider / 플랫폼
  KAKAO: '카카오',
  APPLE: '애플',
  IOS: 'iOS',
  ANDROID: 'Android',
  // 교통수단
  PUBLIC_TRANSPORT: '대중교통',
  CAR: '자동차',
  // 알람 반응
  STOP: '중지',
  SNOOZE: '스누즈',
  VIEW_ROUTE: '경로 보기',
  START_PREPARE: '준비 시작',
  // 외부 API
  ODSAY: 'ODsay',
  TMAP: 'TMAP',
  TMAP_TRANSIT: 'TMAP 대중교통',
  // 기타
  UNKNOWN: '알 수 없음',
}

export function dimensionLabel(dimension: string): string {
  return DIMENSION_LABELS[dimension] ?? dimension
}
