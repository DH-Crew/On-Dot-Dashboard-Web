import { getMetric } from 'Constants/metricCatalog'
import type { OverviewCard as OverviewCardData } from 'Types/analytics'
import { deltaTone, formatDelta, formatValue } from 'Utils/format'
import * as S from 'Components/OverviewCard.styled'

const DELTA_ROWS = [
  { key: 'dod', label: '전일' },
  { key: 'wow', label: '전주' },
  { key: 'mom', label: '전월' },
] as const

export function OverviewCard({ card }: { card: OverviewCardData }) {
  const def = getMetric(card.key)
  const unit = def?.unit ?? 'count'
  return (
    <S.Card>
      <S.Head>
        <S.Label>{def?.label ?? card.key}</S.Label>
        <S.HeadActions>
          {def?.note && <S.Note title={def.note}>ⓘ</S.Note>}
          {def?.isSnapshot && <S.Tag>스냅샷</S.Tag>}
        </S.HeadActions>
      </S.Head>
      <S.Value>{formatValue(card.value, unit)}</S.Value>
      <S.Deltas>
        {DELTA_ROWS.map((row) => {
          const d = card[row.key]
          return (
            <S.DeltaRow key={row.key}>
              <S.DeltaLabel>{row.label}</S.DeltaLabel>
              <S.DeltaValue $tone={deltaTone(d.abs)}>{formatDelta(d)}</S.DeltaValue>
            </S.DeltaRow>
          )
        })}
      </S.Deltas>
    </S.Card>
  )
}
