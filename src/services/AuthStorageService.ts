import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'ondot.auth.token'

interface JwtPayload {
  exp?: number
}

/** 회원 JWT 를 localStorage 에 보관/조회. axios 인터셉터가 getAuthHeader() 사용. */
export const AuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  /** 토큰 없음/디코드 실패/만료 시 true. exp 없으면 만료로 보지 않음. */
  isExpired(): boolean {
    const token = this.getToken()
    if (!token) return true
    try {
      const { exp } = jwtDecode<JwtPayload>(token)
      if (!exp) return false
      return exp * 1000 <= Date.now()
    } catch {
      return true
    }
  },

  getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
}
