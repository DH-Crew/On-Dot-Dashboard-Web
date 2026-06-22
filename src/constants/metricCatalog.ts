import type { AreaKey } from 'Constants/areas'

export type MetricUnit = 'count' | 'ratio' | 'seconds' | 'perMember'
export type ChartKind = 'line' | 'bar'

export interface MetricDef {
  key: string
  label: string
  area: AreaKey
  unit: MetricUnit
  /** 스냅샷 지표(그날의 현재값) — 일별 증감보다 추세로 본다. */
  isSnapshot: boolean
  /** 차트 분해축. 생략 시 _ALL_ 만. */
  dimensions?: string[]
  /** 기본 line. 카테고리 분해/히스토그램은 bar. */
  chart?: ChartKind
  note?: string
}

const HOURS = Array.from({ length: 24 }, (_, h) => String(h))

export const METRIC_CATALOG: readonly MetricDef[] = [
  // ① 성장
  {
    key: 'signup.count',
    label: '가입 수',
    area: 'growth',
    unit: 'count',
    isSnapshot: false,
    dimensions: ['KAKAO', 'APPLE', 'IOS', 'ANDROID'],
    chart: 'line',
    note: 'iOS/Android 분해는 mobileType 컬럼 추가 시점 이후 가입자만 정확(과거는 UNKNOWN).',
  },
  { key: 'member.active', label: '활성 회원', area: 'growth', unit: 'count', isSnapshot: true },
  { key: 'withdrawal.count', label: '탈퇴 수', area: 'growth', unit: 'count', isSnapshot: false },
  {
    key: 'withdrawal.byReason',
    label: '탈퇴 사유별',
    area: 'growth',
    unit: 'count',
    isSnapshot: false,
    chart: 'bar',
    note: '사유 텍스트 매핑 API 미제공 — reason_id 로 표시될 수 있음.',
  },
  { key: 'growth.net', label: '순증(가입-탈퇴)', area: 'growth', unit: 'count', isSnapshot: false },
  {
    key: 'onboarding.completedDaily',
    label: '온보딩 완료(일간)',
    area: 'growth',
    unit: 'count',
    isSnapshot: false,
    note: '그날 처음 HOME 주소를 저장한 회원 수.',
  },
  {
    key: 'onboarding.completedRatio',
    label: '온보딩 완료율',
    area: 'growth',
    unit: 'ratio',
    isSnapshot: true,
    note: '활성 회원 중 HOME 주소 보유 비율(스냅샷).',
  },

  // ③ 일정
  { key: 'schedule.created', label: '일정 생성', area: 'schedule', unit: 'count', isSnapshot: false },
  { key: 'schedule.active', label: '활성 일정', area: 'schedule', unit: 'count', isSnapshot: true },
  {
    key: 'schedule.perMember',
    label: '인당 일정 수',
    area: 'schedule',
    unit: 'perMember',
    isSnapshot: true,
  },
  {
    key: 'schedule.byTransport',
    label: '교통수단별 일정',
    area: 'schedule',
    unit: 'count',
    isSnapshot: false,
    dimensions: ['PUBLIC_TRANSPORT', 'CAR'],
    chart: 'line',
  },
  {
    key: 'schedule.repeatRatio',
    label: '반복 일정 비율',
    area: 'schedule',
    unit: 'ratio',
    isSnapshot: false,
  },
  {
    key: 'schedule.medicationRatio',
    label: '약 복용 일정 비율',
    area: 'schedule',
    unit: 'ratio',
    isSnapshot: false,
  },
  {
    key: 'schedule.byAppointmentHour',
    label: '약속 시간대 분포',
    area: 'schedule',
    unit: 'count',
    isSnapshot: false,
    dimensions: HOURS,
    chart: 'bar',
    note: 'KST 기준 약속 시각(hour) 분포. 기간 합산.',
  },

  // ④ 알람
  {
    key: 'alarm.action',
    label: '알람 반응',
    area: 'alarm',
    unit: 'count',
    isSnapshot: false,
    dimensions: ['STOP', 'SNOOZE', 'VIEW_ROUTE', 'START_PREPARE'],
    chart: 'line',
    note: 'SCHEDULED(등록 기록) 제외한 실제 반응.',
  },
  { key: 'alarm.snoozeRatio', label: '스누즈 비율', area: 'alarm', unit: 'ratio', isSnapshot: false },
  {
    key: 'alarm.responseLatencySecAvg',
    label: '평균 응답 지연',
    area: 'alarm',
    unit: 'seconds',
    isSnapshot: false,
    note: 'respondedAt - triggeredAt 평균(응답 있는 건만).',
  },
  {
    key: 'alarm.byDevice',
    label: '기기별 알람 반응',
    area: 'alarm',
    unit: 'count',
    isSnapshot: false,
    dimensions: ['iOS', 'Android'],
    chart: 'line',
  },

  // ⑤ 기능 사용
  { key: 'ai.usageTotal', label: 'AI 사용 횟수', area: 'usage', unit: 'count', isSnapshot: false },
  { key: 'ai.activeUsers', label: 'AI 사용 유저', area: 'usage', unit: 'count', isSnapshot: false },
  {
    key: 'api.usage',
    label: '외부 API 호출',
    area: 'usage',
    unit: 'count',
    isSnapshot: false,
    dimensions: ['ODSAY', 'TMAP', 'TMAP_TRANSIT'],
    chart: 'line',
    note: '타입별 총량만(유저별 분해 불가).',
  },
  {
    key: 'member.dailyReminderRatio',
    label: '데일리 리마인더 설정률',
    area: 'usage',
    unit: 'ratio',
    isSnapshot: true,
    note: '현재값 스냅샷만 의미 있음(과거 시계열은 배치 시작 이후부터).',
  },
] as const

const BY_KEY = new Map(METRIC_CATALOG.map((m) => [m.key, m]))

export function getMetric(key: string): MetricDef | undefined {
  return BY_KEY.get(key)
}

export function metricsByArea(area: AreaKey): MetricDef[] {
  return METRIC_CATALOG.filter((m) => m.area === area)
}

/** 오버뷰 카드 그리드에 노출할 대표 지표. */
export const OVERVIEW_KEYS: readonly string[] = [
  'signup.count',
  'growth.net',
  'member.active',
  'withdrawal.count',
  'onboarding.completedRatio',
  'schedule.created',
  'schedule.active',
  'alarm.snoozeRatio',
  'alarm.responseLatencySecAvg',
  'ai.usageTotal',
  'ai.activeUsers',
  'member.dailyReminderRatio',
]
