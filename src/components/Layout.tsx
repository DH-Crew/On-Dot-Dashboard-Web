import { Suspense } from 'react'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { AreaTabs } from 'Components/AreaTabs'
import { StatusMessage } from 'Components/StatusMessage'
import { useAuth } from 'Hooks/useAuth'

export function Layout() {
  const { logout } = useAuth()
  return (
    <Shell>
      <Header>
        <Brand>On-Dot Dashboard</Brand>
        <LogoutButton type="button" onClick={logout}>
          로그아웃
        </LogoutButton>
      </Header>
      <AreaTabs />
      <Content>
        <Suspense fallback={<StatusMessage>불러오는 중…</StatusMessage>}>
          <Outlet />
        </Suspense>
      </Content>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(6)}`};
  background: ${({ theme }) => theme.color.surface};
`

const Brand = styled.div`
  font-size: 16px;
  font-weight: 700;
`

const LogoutButton = styled.button`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface};
  font-size: 13px;
  color: ${({ theme }) => theme.color.textWeak};
`

const Content = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space(6)};
`
