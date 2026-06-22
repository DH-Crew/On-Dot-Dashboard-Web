import styled from 'styled-components'
import { useAuth } from 'Hooks/useAuth'

export function ForbiddenPage() {
  const { logout } = useAuth()
  return (
    <Wrap>
      <Code>403</Code>
      <Title>대시보드 접근 권한이 없습니다</Title>
      <Desc>
        이 계정은 분석 대시보드 allowlist 에 등록되어 있지 않습니다. 접근이 필요하면
        관리자에게 등록을 요청하세요.
      </Desc>
      <LinkButton type="button" onClick={logout}>
        다른 계정으로 로그인
      </LinkButton>
    </Wrap>
  )
}

const Wrap = styled.div`
  min-height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(6)};
  text-align: center;
`

const Code = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.textWeaker};
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
`

const Desc = styled.p`
  max-width: 420px;
  color: ${({ theme }) => theme.color.textWeak};
  font-size: 14px;
  line-height: 1.5;
`

const LinkButton = styled.button`
  margin-top: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  font-size: 14px;
`
