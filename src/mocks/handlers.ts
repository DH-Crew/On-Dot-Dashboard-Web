import { http, HttpResponse } from 'msw'
import { genCard, genSeries, MOCK_JWT } from 'Mocks/data'

function csv(value: string | null): string[] {
  return (value ?? '').split(',').filter(Boolean)
}

export const handlers = [
  // 카카오 access_token → 회원 JWT 교환
  http.post('*/auth/login/oauth', () => HttpResponse.json({ accessToken: MOCK_JWT })),

  // 오버뷰 카드
  http.get('*/analytics/overview', ({ request }) => {
    const url = new URL(request.url)
    const keys = csv(url.searchParams.get('keys'))
    const asOf = url.searchParams.get('asOf') ?? ''
    return HttpResponse.json({ asOf, cards: keys.map((k) => genCard(k, asOf)) })
  }),

  // 시계열
  http.get('*/analytics/metrics', ({ request }) => {
    const url = new URL(request.url)
    const keys = csv(url.searchParams.get('keys'))
    const dims = csv(url.searchParams.get('dimensions'))
    const from = url.searchParams.get('from') ?? ''
    const to = url.searchParams.get('to') ?? ''
    const dimensions = dims.length ? dims : ['_ALL_']
    const series = keys.flatMap((k) => dimensions.map((d) => genSeries(k, d, from, to)))
    return HttpResponse.json({ series })
  }),
]
