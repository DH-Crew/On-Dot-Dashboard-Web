export type AreaKey = 'growth' | 'schedule' | 'alarm' | 'usage'

export interface NavItem {
  key: 'overview' | AreaKey
  label: string
  path: string
}

/** 상단 탭 / 라우팅 네비게이션 정의. */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'overview', label: '오버뷰', path: '/overview' },
  { key: 'growth', label: '성장', path: '/growth' },
  { key: 'schedule', label: '일정', path: '/schedule' },
  { key: 'alarm', label: '알람', path: '/alarm' },
  { key: 'usage', label: '기능사용', path: '/usage' },
] as const

export const AREA_LABEL: Record<AreaKey, string> = {
  growth: '성장',
  schedule: '일정',
  alarm: '알람',
  usage: '기능사용',
}
