import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from 'Constants/areas'

export function AreaTabs() {
  return (
    <Nav>
      {NAV_ITEMS.map((item) => (
        <Tab key={item.key} to={item.path}>
          {item.label}
        </Tab>
      ))}
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space(1)};
  padding: 0 ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
`

const Tab = styled(NavLink)`
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(3)}`};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textWeak};
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;

  &.active {
    color: ${({ theme }) => theme.color.primary};
    border-bottom-color: ${({ theme }) => theme.color.primary};
  }
`
