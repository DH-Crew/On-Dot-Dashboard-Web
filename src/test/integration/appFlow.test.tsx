import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { handlers } from 'Mocks/handlers'
import { AuthStorage } from 'Services/AuthStorageService'
import { theme } from 'Styles/theme'
import App from '../../App'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  AuthStorage.clear()
})
afterAll(() => server.close())

function renderApp() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('App 인증 → 오버뷰 플로우', () => {
  it('미인증 시 로그인으로 가드되고, 로그인하면 오버뷰 카드가 보인다', async () => {
    renderApp()

    // 보호 라우트 → /login 리다이렉트
    const loginBtn = await screen.findByText('카카오로 로그인')
    expect(loginBtn).toBeInTheDocument()

    // dev 로그인(카카오 키 없음 → 가짜 토큰) → /auth/login/oauth 교환(MSW) → /overview
    fireEvent.click(loginBtn)

    // 오버뷰 페이지 진입(제목 heading) + 카드 로딩
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: '오버뷰' })).toBeInTheDocument(),
    )
    await waitFor(() => expect(screen.getByText('가입 수')).toBeInTheDocument())
    expect(AuthStorage.getToken()).toBeTruthy()
  })
})
