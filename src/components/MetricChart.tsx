import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dimensionLabel } from 'Constants/dimensionLabels'
import { getMetric } from 'Constants/metricCatalog'
import { StatusMessage } from 'Components/StatusMessage'
import { formatValue } from 'Utils/format'
import { toBarTotals, toLineRows } from 'Utils/chartData'
import type { MetricUnit } from 'Constants/metricCatalog'
import type { MetricSeries } from 'Types/analytics'

const PALETTE = [
  '#3182f6',
  '#1b9c5d',
  '#e5484d',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#64748b',
]

/** byAppointmentHour 처럼 차원이 숫자(시간)면 "N시" 라벨. 그 외엔 dimensionLabel. */
function axisLabel(metricKey: string, dim: string): string {
  if (metricKey === 'schedule.byAppointmentHour') return `${dim}시`
  return dimensionLabel(dim)
}

export function MetricChart({
  metricKey,
  series,
}: {
  metricKey: string
  series: MetricSeries[]
}) {
  const def = getMetric(metricKey)
  const unit: MetricUnit = def?.unit ?? 'count'
  const kind = def?.chart ?? 'line'

  const hasData = series.some((s) => s.points.length > 0)

  const lineData = useMemo(() => toLineRows(series), [series])
  const barData = useMemo(
    () => toBarTotals(series, (dim) => axisLabel(metricKey, dim)),
    [series, metricKey],
  )

  const dims = useMemo(() => series.map((s) => s.dimension), [series])
  const tickFmt = (value: number) => formatValue(value, unit)

  if (!hasData) return <StatusMessage>표시할 데이터가 없습니다.</StatusMessage>

  if (kind === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={barData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={tickFmt} width={56} />
          <Tooltip formatter={(v) => formatValue(Number(v), unit)} />
          <Bar dataKey="total" name={def?.label ?? metricKey} fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={lineData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={tickFmt} width={56} />
        <Tooltip formatter={(v, name) => [formatValue(Number(v), unit), dimensionLabel(String(name))]} />
        {dims.length > 1 && <Legend formatter={(value) => dimensionLabel(String(value))} />}
        {dims.map((dim, i) => (
          <Line
            key={dim}
            type="monotone"
            dataKey={dim}
            name={dim}
            stroke={PALETTE[i % PALETTE.length]}
            dot={false}
            strokeWidth={2}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
