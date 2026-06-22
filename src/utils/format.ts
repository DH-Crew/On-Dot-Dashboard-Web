import type { MetricUnit } from 'Constants/metricCatalog'
import type { Delta } from 'Types/analytics'

const intFmt = new Intl.NumberFormat('en-US')

/** 지표 값을 단위에 맞게 표시 문자열로. ratio 는 *100 후 %. */
export function formatValue(value: number, unit: MetricUnit): string {
  switch (unit) {
    case 'count':
      return intFmt.format(Math.round(value))
    case 'ratio':
      return `${(value * 100).toFixed(1)}%`
    case 'seconds':
      return `${value.toFixed(1)}초`
    case 'perMember':
      return `${value.toFixed(1)}건/인`
  }
}

/** 부호 있는 숫자. 정수는 천단위, 소수는 1자리. */
export function formatSignedNumber(n: number): string {
  const sign = n > 0 ? '+' : ''
  const body = Number.isInteger(n)
    ? intFmt.format(n)
    : String(Math.round(n * 10) / 10)
  return `${sign}${body}`
}

/** 변화율(%) 표시. null(직전 0) 은 대시. */
export function formatPct(pct: number | null): string {
  if (pct === null) return '–'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

/** "+10 (+10.0%)" 형태. */
export function formatDelta(delta: Delta): string {
  return `${formatSignedNumber(delta.abs)} (${formatPct(delta.pct)})`
}

export type DeltaTone = 'positive' | 'negative' | 'flat'

export function deltaTone(abs: number): DeltaTone {
  if (abs > 0) return 'positive'
  if (abs < 0) return 'negative'
  return 'flat'
}

// ---- 날짜 (KST 기준) ----

/** 주어진 시점의 KST 일자 문자열(YYYY-MM-DD). */
export function kstToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(now)
}

/** YYYY-MM-DD 에 일수를 가감. */
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

/** KST 기준 어제. */
export function yesterday(now: Date = new Date()): string {
  return addDays(kstToday(now), -1)
}

export type DatePreset = '7d' | '30d' | '90d'

/** 프리셋 → {from,to} (둘 다 포함). to=asOf. */
export function presetRange(preset: DatePreset, asOf: string): { from: string; to: string } {
  const span = preset === '7d' ? 6 : preset === '30d' ? 29 : 89
  return { from: addDays(asOf, -span), to: asOf }
}
