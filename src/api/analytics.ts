import { apiClient } from 'Api/client'
import type { MetricsResponse, OverviewResponse } from 'Types/analytics'

export interface OverviewParams {
  keys: string[]
  asOf: string
}

export async function getOverview(params: OverviewParams): Promise<OverviewResponse> {
  const { data } = await apiClient.get<OverviewResponse>('/analytics/overview', {
    params: { keys: params.keys.join(','), asOf: params.asOf },
  })
  return data
}

export interface MetricsParams {
  keys: string[]
  dimensions?: string[]
  from: string
  to: string
}

export async function getMetrics(params: MetricsParams): Promise<MetricsResponse> {
  const { data } = await apiClient.get<MetricsResponse>('/analytics/metrics', {
    params: {
      keys: params.keys.join(','),
      dimensions: params.dimensions?.length ? params.dimensions.join(',') : undefined,
      from: params.from,
      to: params.to,
    },
  })
  return data
}
