import type { ReactNode } from 'react'
import styled from 'styled-components'

export function StatusMessage({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>
}

const Box = styled.div`
  padding: ${({ theme }) => theme.space(8)};
  text-align: center;
  color: ${({ theme }) => theme.color.textWeak};
  font-size: 14px;
`
