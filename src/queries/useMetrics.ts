import { useQuery } from '@tanstack/react-query'
import { getMetrics } from 'Api/analytics'
import { queryKeys } from 'Queries/queryKeys'

export function useMetrics(
  keys: string[],
  dimensions: string[],
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: queryKeys.metrics(keys, dimensions, from, to),
    queryFn: () => getMetrics({ keys, dimensions, from, to }),
    enabled: keys.length > 0 && Boolean(from) && Boolean(to),
  })
}
