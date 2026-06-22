import 'styled-components'
import type { AppTheme } from 'Styles/theme'

declare module 'styled-components' {
  // styled-components 의 DefaultTheme 을 앱 테마 타입으로 보강.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
