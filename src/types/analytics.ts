/** 백엔드 /analytics/** 계약 응답 타입. (api-contract.md 기준) */

/** 전일/전주/전월 대비 변화량. pct 는 직전 값이 0이면 null. */
export interface Delta {
  abs: number
  pct: number | null
}

/** /analytics/overview 의 카드 1개. */
export interface OverviewCard {
  key: string
  value: number
  dod: Delta
  wow: Delta
  mom: Delta
}

export interface OverviewResponse {
  asOf: string
  cards: OverviewCard[]
}

/** /analytics/metrics 시계열 한 점. */
export interface MetricPoint {
  date: string
  value: number
}

/** metric_key × dimension 별 시계열. */
export interface MetricSeries {
  key: string
  dimension: string
  points: MetricPoint[]
}

export interface MetricsResponse {
  series: MetricSeries[]
}

/** /auth/login/oauth 응답 (회원 JWT). */
export interface AuthResponse {
  accessToken: string
}
