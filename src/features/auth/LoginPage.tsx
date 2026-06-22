import styled from 'styled-components'
import { Navigate } from 'react-router-dom'
import { useAuth } from 'Hooks/useAuth'

export function LoginPage() {
  const { isAuthed, login, loggingIn } = useAuth()

  if (isAuthed) return <Navigate to="/overview" replace />

  return (
    <Wrap>
      <Card>
        <Title>On-Dot Dashboard</Title>
        <Desc>내부 분석 대시보드입니다. 카카오 계정으로 로그인하세요.</Desc>
        <KakaoButton type="button" onClick={() => void login()} disabled={loggingIn}>
          {loggingIn ? '로그인 중…' : '카카오로 로그인'}
        </KakaoButton>
        <Hint>접근 권한(allowlist)이 있는 계정만 이용할 수 있습니다.</Hint>
      </Card>
    </Wrap>
  )
}

const Wrap = styled.div`
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.space(6)};
`

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.space(8)};
  text-align: center;
`

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
`

const Desc = styled.p`
  margin-top: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.color.textWeak};
  font-size: 14px;
`

const KakaoButton = styled.button`
  margin-top: ${({ theme }) => theme.space(6)};
  width: 100%;
  padding: ${({ theme }) => theme.space(3)};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fee500;
  color: #191600;
  font-size: 15px;
  font-weight: 600;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const Hint = styled.p`
  margin-top: ${({ theme }) => theme.space(4)};
  color: ${({ theme }) => theme.color.textWeaker};
  font-size: 12px;
`
