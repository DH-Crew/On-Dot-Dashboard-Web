import styled from 'styled-components'
import type { DateRangeState, RangeMode } from 'Hooks/useDateRange'

const PRESETS: { value: RangeMode; label: string }[] = [
  { value: '7d', label: '7일' },
  { value: '30d', label: '30일' },
  { value: '90d', label: '90일' },
  { value: 'custom', label: '직접 선택' },
]

export function DateRangeControl({ range }: { range: DateRangeState }) {
  return (
    <Wrap>
      <Presets>
        {PRESETS.map((p) => (
          <PresetButton
            key={p.value}
            type="button"
            $active={range.mode === p.value}
            onClick={() => range.setMode(p.value)}
          >
            {p.label}
          </PresetButton>
        ))}
      </Presets>
      {range.mode === 'custom' ? (
        <Custom>
          <DateInput
            type="date"
            value={range.customFrom}
            max={range.customTo}
            onChange={(e) => range.setCustomFrom(e.target.value)}
          />
          <span>~</span>
          <DateInput
            type="date"
            value={range.customTo}
            min={range.customFrom}
            max={range.asOf}
            onChange={(e) => range.setCustomTo(e.target.value)}
          />
        </Custom>
      ) : (
        <RangeLabel>
          {range.from} ~ {range.to}
        </RangeLabel>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  flex-wrap: wrap;
`

const Presets = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space(1)};
`

const PresetButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.color.primary : theme.color.border)};
  background: ${({ theme, $active }) => ($active ? theme.color.primary : theme.color.surface)};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.color.textWeak)};
  font-size: 13px;
  font-weight: 600;
`

const Custom = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.color.textWeak};
`

const DateInput = styled.input`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2)}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
`

const RangeLabel = styled.span`
  color: ${({ theme }) => theme.color.textWeak};
  font-size: 13px;
`
