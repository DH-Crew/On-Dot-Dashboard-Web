import styled from 'styled-components'
import { MetricChart } from 'Components/MetricChart'
import { StatusMessage } from 'Components/StatusMessage'
import { useMetrics } from 'Queries/useMetrics'
import type { MetricDef } from 'Constants/metricCatalog'

export function MetricSection({
  def,
  from,
  to,
}: {
  def: MetricDef
  from: string
  to: string
}) {
  const dimensions = def.dimensions ?? []
  const { data, isLoading, isError } = useMetrics([def.key], dimensions, from, to)

  return (
    <Card>
      <Head>
        <Title>{def.label}</Title>
        {def.isSnapshot && <Tag>스냅샷</Tag>}
      </Head>
      {def.note && <Note>ⓘ {def.note}</Note>}
      {def.isSnapshot && <Note>※ 현재값 스냅샷 — 추세 참고용입니다.</Note>}

      {isLoading && <StatusMessage>불러오는 중…</StatusMessage>}
      {isError && <StatusMessage>데이터를 불러오지 못했습니다.</StatusMessage>}
      {data && <MetricChart metricKey={def.key} series={data.series} />}
    </Card>
  )
}

const Card = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.space(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
`

const Tag = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.surfaceAlt};
  color: ${({ theme }) => theme.color.textWeaker};
`

const Note = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textWeaker};
  line-height: 1.4;
`
