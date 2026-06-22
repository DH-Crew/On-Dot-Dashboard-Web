import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from 'Styles/theme'
import { OverviewCard } from 'Components/OverviewCard'
import type { OverviewCard as OverviewCardData } from 'Types/analytics'

function renderCard(card: OverviewCardData) {
  return render(
    <ThemeProvider theme={theme}>
      <OverviewCard card={card} />
    </ThemeProvider>,
  )
}

describe('OverviewCard', () => {
  it('라벨/값/전일·전주·전월 Δ 를 렌더한다', () => {
    renderCard({
      key: 'signup.count',
      value: 110,
      dod: { abs: 10, pct: 10 },
      wow: { abs: -5, pct: -4.3 },
      mom: { abs: 40, pct: 57.1 },
    })
    expect(screen.getByText('가입 수')).toBeInTheDocument()
    expect(screen.getByText('110')).toBeInTheDocument()
    expect(screen.getByText('+10 (+10.0%)')).toBeInTheDocument()
    expect(screen.getByText('-5 (-4.3%)')).toBeInTheDocument()
    expect(screen.getByText('+40 (+57.1%)')).toBeInTheDocument()
  })

  it('ratio 스냅샷 지표는 % 표기 + 스냅샷 태그를 노출한다', () => {
    renderCard({
      key: 'onboarding.completedRatio',
      value: 0.62,
      dod: { abs: 0.01, pct: 1.6 },
      wow: { abs: 0, pct: 0 },
      mom: { abs: 0.05, pct: 8.8 },
    })
    expect(screen.getByText('62.0%')).toBeInTheDocument()
    expect(screen.getByText('스냅샷')).toBeInTheDocument()
  })
})
