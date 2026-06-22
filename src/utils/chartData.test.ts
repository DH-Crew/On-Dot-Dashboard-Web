import { describe, expect, it } from 'vitest'
import { isAllNumeric, toBarTotals, toLineRows } from 'Utils/chartData'
import type { MetricSeries } from 'Types/analytics'

const series: MetricSeries[] = [
  {
    key: 'k',
    dimension: 'CAR',
    points: [
      { date: '2026-06-02', value: 5 },
      { date: '2026-06-01', value: 3 },
    ],
  },
  {
    key: 'k',
    dimension: 'PUBLIC_TRANSPORT',
    points: [
      { date: '2026-06-01', value: 7 },
      { date: '2026-06-02', value: 9 },
    ],
  },
]

describe('toLineRows', () => {
  it('날짜별로 차원 값을 병합하고 오름차순 정렬한다', () => {
    expect(toLineRows(series)).toEqual([
      { date: '2026-06-01', CAR: 3, PUBLIC_TRANSPORT: 7 },
      { date: '2026-06-02', CAR: 5, PUBLIC_TRANSPORT: 9 },
    ])
  })
})

describe('toBarTotals', () => {
  it('차원별 기간 합산', () => {
    expect(toBarTotals(series, (d) => d)).toEqual([
      { label: 'CAR', total: 8 },
      { label: 'PUBLIC_TRANSPORT', total: 16 },
    ])
  })

  it('숫자 차원(시간)은 숫자 정렬', () => {
    const hours: MetricSeries[] = [
      { key: 'h', dimension: '10', points: [{ date: '2026-06-01', value: 2 }] },
      { key: 'h', dimension: '2', points: [{ date: '2026-06-01', value: 1 }] },
    ]
    expect(toBarTotals(hours, (d) => `${d}시`)).toEqual([
      { label: '2시', total: 1 },
      { label: '10시', total: 2 },
    ])
  })
})

describe('isAllNumeric', () => {
  it('판정', () => {
    expect(isAllNumeric(['0', '1', '23'])).toBe(true)
    expect(isAllNumeric(['CAR', '1'])).toBe(false)
    expect(isAllNumeric([])).toBe(false)
  })
})
