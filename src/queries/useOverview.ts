import { useQuery } from '@tanstack/react-query'
import { getOverview } from 'Api/analytics'
import { queryKeys } from 'Queries/queryKeys'

export function useOverview(keys: string[], asOf: string) {
  return useQuery({
    queryKey: queryKeys.overview(keys, asOf),
    queryFn: () => getOverview({ keys, asOf }),
    enabled: keys.length > 0 && Boolean(asOf),
  })
}
