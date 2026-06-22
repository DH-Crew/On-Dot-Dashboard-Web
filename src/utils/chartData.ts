import type { MetricSeries } from 'Types/analytics'

export type LineRow = Record<string, number | string>
export interface BarTotal {
  label: string
  total: number
}

/** 차원별 시계열을 recharts 라인용 [{date, dimA, dimB...}] 행으로 병합(날짜 오름차순). */
export function toLineRows(series: MetricSeries[]): LineRow[] {
  const byDate = new Map<string, LineRow>()
  for (const s of series) {
    for (const p of s.points) {
      const row = byDate.get(p.date) ?? { date: p.date }
      row[s.dimension] = p.value
      byDate.set(p.date, row)
    }
  }
  return [...byDate.values()].sort((a, b) => (String(a.date) < String(b.date) ? -1 : 1))
}

/** 차원 코드가 모두 숫자인지(예: byAppointmentHour 0~23). */
export function isAllNumeric(dims: string[]): boolean {
  return dims.length > 0 && dims.every((d) => /^\d+$/.test(d))
}

/** 차원별로 기간 합산 → 막대용 [{label, total}]. 숫자 차원이면 숫자 정렬. */
export function toBarTotals(series: MetricSeries[], label: (dim: string) => string): BarTotal[] {
  const dims = series.map((s) => s.dimension)
  const sorted = isAllNumeric(dims)
    ? [...series].sort((a, b) => Number(a.dimension) - Number(b.dimension))
    : series
  return sorted.map((s) => ({
    label: label(s.dimension),
    total: s.points.reduce((sum, p) => sum + p.value, 0),
  }))
}
