import { useMemo, useState } from 'react'
import { presetRange, yesterday } from 'Utils/format'
import type { DatePreset } from 'Utils/format'

export type RangeMode = DatePreset | 'custom'

export interface DateRangeState {
  /** 기준일(어제, KST). 오버뷰 카드의 asOf. */
  asOf: string
  mode: RangeMode
  setMode: (mode: RangeMode) => void
  from: string
  to: string
  customFrom: string
  customTo: string
  setCustomFrom: (v: string) => void
  setCustomTo: (v: string) => void
}

export function useDateRange(defaultMode: RangeMode = '30d'): DateRangeState {
  const asOf = useMemo(() => yesterday(), [])
  const [mode, setMode] = useState<RangeMode>(defaultMode)
  const [customFrom, setCustomFrom] = useState(() => presetRange('7d', asOf).from)
  const [customTo, setCustomTo] = useState(asOf)

  const { from, to } = useMemo(() => {
    if (mode === 'custom') return { from: customFrom, to: customTo }
    return presetRange(mode, asOf)
  }, [mode, customFrom, customTo, asOf])

  return {
    asOf,
    mode,
    setMode,
    from,
    to,
    customFrom,
    customTo,
    setCustomFrom,
    setCustomTo,
  }
}
