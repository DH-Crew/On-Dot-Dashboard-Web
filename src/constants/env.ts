/** 환경변수 중앙 접근점. 산발적인 import.meta.env 접근 금지 — 항상 이 모듈 경유. */
export const ENV = {
  /** On-Dot_BE 서버 베이스 URL (환경별). 비어 있으면 동일 오리진. */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  /** true 면 MSW 목 핸들러 사용 (백엔드 미구현 대응). */
  USE_MOCK: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
  /** 카카오 JS SDK 앱 키. 비어 있으면 dev 로그인 모드. */
  KAKAO_JS_KEY: import.meta.env.VITE_KAKAO_JS_KEY ?? '',
} as const
