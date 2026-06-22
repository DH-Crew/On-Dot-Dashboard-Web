import styled from 'styled-components'
import type { DeltaTone } from 'Utils/format'

export const Card = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.space(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
`

export const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textWeak};
`

export const HeadActions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
`

export const Tag = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.surfaceAlt};
  color: ${({ theme }) => theme.color.textWeaker};
`

export const Value = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
`

export const Deltas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const DeltaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
`

export const DeltaLabel = styled.span`
  color: ${({ theme }) => theme.color.textWeaker};
`

const toneColor = (theme: import('Styles/theme').AppTheme, tone: DeltaTone) =>
  tone === 'positive'
    ? theme.color.positive
    : tone === 'negative'
      ? theme.color.negative
      : theme.color.textWeaker

export const DeltaValue = styled.span<{ $tone: DeltaTone }>`
  font-weight: 600;
  color: ${({ theme, $tone }) => toneColor(theme, $tone)};
`

export const Note = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.textWeaker};
  cursor: help;
`
