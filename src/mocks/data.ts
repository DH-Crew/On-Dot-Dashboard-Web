import { getMetric } from 'Constants/metricCatalog'
import type { MetricUnit } from 'Constants/metricCatalog'
import { addDays } from 'Utils/format'
import type { Delta, MetricPoint, MetricSeries, OverviewCard } from 'Types/analytics'

/** FNV-1a 해시 — (key,dimension,date) 조합에서 결정적 값 생성용. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function unitValue(seed: number, unit: MetricUnit): number {
  const r = (seed % 1000) / 1000 // 0..1
  switch (unit) {
    case 'ratio':
      return Math.round((0.2 + r * 0.6) * 10000) / 10000 // 0.2..0.8 (4자리)
    case 'seconds':
      return Math.round((10 + r * 110) * 10) / 10 // 10..120
    case 'perMember':
      return Math.round((1 + r * 4) * 100) / 100 // 1..5
    case 'count':
    default:
      return Math.round(20 + r * 200) // 20..220
  }
}

/** 지표/차원/일자에 대한 결정적 목 값. */
export function genValue(key: string, dimension: string, date: string): number {
  const unit = getMetric(key)?.unit ?? 'count'
  return unitValue(hash(`${key}|${dimension}|${date}`), unit)
}

function roundAbs(diff: number, unit: MetricUnit): number {
  return unit === 'count' ? Math.round(diff) : Math.round(diff * 10000) / 10000
}

function makeDelta(value: number, prev: number, unit: MetricUnit): Delta {
  const abs = roundAbs(value - prev, unit)
  const pct = prev === 0 ? null : Math.round(((value - prev) / prev) * 10000) / 100
  return { abs, pct }
}

export function genCard(key: string, asOf: string): OverviewCard {
  const unit = getMetric(key)?.unit ?? 'count'
  const value = genValue(key, '_ALL_', asOf)
  return {
    key,
    value,
    dod: makeDelta(value, genValue(key, '_ALL_', addDays(asOf, -1)), unit),
    wow: makeDelta(value, genValue(key, '_ALL_', addDays(asOf, -7)), unit),
    mom: makeDelta(value, genValue(key, '_ALL_', addDays(asOf, -30)), unit),
  }
}

export function genSeries(
  key: string,
  dimension: string,
  from: string,
  to: string,
): MetricSeries {
  const points: MetricPoint[] = []
  let d = from
  // 안전장치: 최대 400 포인트
  for (let i = 0; i < 400 && d <= to; i++) {
    points.push({ date: d, value: genValue(key, dimension, d) })
    d = addDays(d, 1)
  }
  return { key, dimension, points }
}

function b64url(obj: unknown): string {
  return btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** 디코드 가능한 가짜 회원 JWT(1년 만료). MSW 가 /auth/login/oauth 응답으로 반환. */
export const MOCK_JWT = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({
  sub: 'mock-analyst',
  name: 'Mock Analyst',
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
})}.mock-signature`
