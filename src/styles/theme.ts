export const theme = {
  color: {
    bg: '#f7f8fa',
    surface: '#ffffff',
    surfaceAlt: '#f2f4f6',
    border: '#e5e8eb',
    text: '#191f28',
    textWeak: '#6b7684',
    textWeaker: '#8b95a1',
    primary: '#3182f6',
    positive: '#1b9c5d',
    negative: '#e5484d',
  },
  radius: { sm: '6px', md: '10px', lg: '16px' },
  /** 4px 그리드 스페이싱. space(4) === '16px' */
  space: (n: number) => `${n * 4}px`,
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  },
} as const

export type AppTheme = typeof theme
