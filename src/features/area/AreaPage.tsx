import styled from 'styled-components'
import { AREA_LABEL } from 'Constants/areas'
import type { AreaKey } from 'Constants/areas'
import { metricsByArea } from 'Constants/metricCatalog'
import { DateRangeControl } from 'Components/DateRangeControl'
import { StatusMessage } from 'Components/StatusMessage'
import { MetricSection } from 'Features/area/MetricSection'
import { useDateRange } from 'Hooks/useDateRange'

export function AreaPage({ area }: { area: AreaKey }) {
  const range = useDateRange()
  const metrics = metricsByArea(area)

  return (
    <Section>
      <Header>
        <Title>{AREA_LABEL[area]}</Title>
        <DateRangeControl range={range} />
      </Header>

      {metrics.length === 0 ? (
        <StatusMessage>이 영역에 표시할 지표가 없습니다.</StatusMessage>
      ) : (
        <Charts>
          {metrics.map((def) => (
            <MetricSection key={def.key} def={def} from={range.from} to={range.to} />
          ))}
        </Charts>
      )}
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
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(4)};
  flex-wrap: wrap;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
`

const Charts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: ${({ theme }) => theme.space(3)};
`
