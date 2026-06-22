import type { AreaKey } from 'Constants/areas'
import { AREA_LABEL } from 'Constants/areas'

// Phase 4 에서 영역별 시계열 차트 섹션으로 구현됩니다.
export function AreaPage({ area }: { area: AreaKey }) {
  return <div>{AREA_LABEL[area]} 영역 (구현 예정)</div>
}
