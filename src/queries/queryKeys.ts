export const queryKeys = {
  overview: (keys: string[], asOf: string) =>
    ['analytics', 'overview', keys.join(','), asOf] as const,
  metrics: (keys: string[], dimensions: string[], from: string, to: string) =>
    ['analytics', 'metrics', keys.join(','), dimensions.join(','), from, to] as const,
}
