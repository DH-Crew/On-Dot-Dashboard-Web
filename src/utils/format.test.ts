import { describe, expect, it } from 'vitest'
import {
  addDays,
  deltaTone,
  formatDelta,
  formatPct,
  formatSignedNumber,
  formatValue,
  presetRange,
  yesterday,
} from 'Utils/format'

describe('formatValue', () => {
  it('count 는 천단위 정수', () => {
    expect(formatValue(1234, 'count')).toBe('1,234')
  })
  it('ratio 는 *100 후 1자리 % ', () => {
    expect(formatValue(0.1234, 'ratio')).toBe('12.3%')
  })
  it('seconds 는 1자리 + 초', () => {
    expect(formatValue(3.2, 'seconds')).toBe('3.2초')
  })
  it('perMember 는 1자리 + 건/인', () => {
    expect(formatValue(1.4, 'perMember')).toBe('1.4건/인')
  })
})

describe('delta helpers', () => {
  it('formatSignedNumber 부호 표기', () => {
    expect(formatSignedNumber(10)).toBe('+10')
    expect(formatSignedNumber(-5)).toBe('-5')
    expect(formatSignedNumber(0)).toBe('0')
  })
  it('formatPct null 은 대시', () => {
    expect(formatPct(null)).toBe('–')
    expect(formatPct(10)).toBe('+10.0%')
    expect(formatPct(-4.4)).toBe('-4.4%')
  })
  it('formatDelta 결합', () => {
    expect(formatDelta({ abs: 10, pct: 10 })).toBe('+10 (+10.0%)')
    expect(formatDelta({ abs: 10, pct: null })).toBe('+10 (–)')
  })
  it('deltaTone 부호 분류', () => {
    expect(deltaTone(5)).toBe('positive')
    expect(deltaTone(-5)).toBe('negative')
    expect(deltaTone(0)).toBe('flat')
  })
})

describe('date helpers', () => {
  it('addDays 는 일자 가감', () => {
    expect(addDays('2026-06-23', -1)).toBe('2026-06-22')
    expect(addDays('2026-06-30', 1)).toBe('2026-07-01')
  })
  it('yesterday 는 KST 기준 어제', () => {
    // 2026-06-23 01:00 UTC === 2026-06-23 10:00 KST → 어제 = 2026-06-22
    expect(yesterday(new Date('2026-06-23T01:00:00Z'))).toBe('2026-06-22')
  })
  it('presetRange 7d/30d/90d 포함 범위', () => {
    expect(presetRange('7d', '2026-06-22')).toEqual({ from: '2026-06-16', to: '2026-06-22' })
    expect(presetRange('30d', '2026-06-22')).toEqual({ from: '2026-05-24', to: '2026-06-22' })
    expect(presetRange('90d', '2026-06-22')).toEqual({ from: '2026-03-25', to: '2026-06-22' })
  })
})
