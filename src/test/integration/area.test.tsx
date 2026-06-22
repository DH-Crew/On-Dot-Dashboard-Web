import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { handlers } from 'Mocks/handlers'
import { theme } from 'Styles/theme'
import { AreaPage } from 'Features/area/AreaPage'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderArea() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AreaPage area="growth" />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('AreaPage (integration)', () => {
  it('성장 영역의 지표 섹션들을 렌더하고 데이터 로딩이 끝난다', async () => {
    renderArea()
    expect(screen.getByText('성장')).toBeInTheDocument()
    // 성장 영역 지표 섹션 타이틀 (카탈로그 기반)
    expect(screen.getByText('가입 수')).toBeInTheDocument()
    expect(screen.getByText('순증(가입-탈퇴)')).toBeInTheDocument()

    // 로딩 상태가 해소되고 에러가 없어야 한다
    await waitFor(() =>
      expect(screen.queryByText('불러오는 중…')).not.toBeInTheDocument(),
    )
    expect(screen.queryByText('데이터를 불러오지 못했습니다.')).not.toBeInTheDocument()
  })
})
