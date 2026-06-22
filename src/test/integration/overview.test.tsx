import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { handlers } from 'Mocks/handlers'
import { theme } from 'Styles/theme'
import { OverviewPage } from 'Features/overview/OverviewPage'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <OverviewPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('OverviewPage (integration: axios → MSW → react-query)', () => {
  it('목 백엔드에서 카드를 받아 라벨/값을 렌더한다', async () => {
    renderPage()
    expect(screen.getByText('오버뷰')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('가입 수')).toBeInTheDocument())
    expect(screen.getByText('활성 회원')).toBeInTheDocument()
    expect(screen.getByText('AI 사용 횟수')).toBeInTheDocument()

    // 전일/전주/전월 행이 카드마다 존재
    expect(screen.getAllByText('전일').length).toBeGreaterThan(0)
  })
})
