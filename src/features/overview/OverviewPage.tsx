import styled from 'styled-components'
import { OVERVIEW_KEYS } from 'Constants/metricCatalog'
import { OverviewCard } from 'Components/OverviewCard'
import { StatusMessage } from 'Components/StatusMessage'
import { useDateRange } from 'Hooks/useDateRange'
import { useOverview } from 'Queries/useOverview'

const KEYS = [...OVERVIEW_KEYS]

export function OverviewPage() {
  const { asOf } = useDateRange()
  const { data, isLoading, isError } = useOverview(KEYS, asOf)

  return (
    <Section>
      <Header>
        <Title>오버뷰</Title>
        <AsOf>기준일 {asOf}</AsOf>
      </Header>

      {isLoading && <StatusMessage>불러오는 중…</StatusMessage>}
      {isError && <StatusMessage>데이터를 불러오지 못했습니다.</StatusMessage>}
      {data &&
        (data.cards.length === 0 ? (
          <StatusMessage>표시할 지표가 없습니다.</StatusMessage>
        ) : (
          <Grid>
            {data.cards.map((card) => (
              <OverviewCard key={card.key} card={card} />
            ))}
          </Grid>
        ))}
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
`

const AsOf = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.color.textWeak};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.space(3)};
`
