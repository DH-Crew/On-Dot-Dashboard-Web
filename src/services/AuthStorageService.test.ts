import { afterEach, describe, expect, it } from 'vitest'
import { AuthStorage } from 'Services/AuthStorageService'

/** 검증/서명 없이 디코드만 가능한 가짜 JWT 생성 (header.payload.sig). */
function fakeJwt(payload: Record<string, unknown>): string {
  const b64 = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.sig`
}

describe('AuthStorage', () => {
  afterEach(() => {
    AuthStorage.clear()
  })

  it('setToken 후 getToken 으로 동일 값을 반환한다', () => {
    AuthStorage.setToken('abc.def.ghi')
    expect(AuthStorage.getToken()).toBe('abc.def.ghi')
  })

  it('clear 후에는 null 을 반환한다', () => {
    AuthStorage.setToken('abc.def.ghi')
    AuthStorage.clear()
    expect(AuthStorage.getToken()).toBeNull()
  })

  it('토큰이 없으면 isExpired 는 true', () => {
    expect(AuthStorage.isExpired()).toBe(true)
  })

  it('만료된 exp 토큰은 isExpired true', () => {
    AuthStorage.setToken(fakeJwt({ exp: Math.floor(Date.now() / 1000) - 60 }))
    expect(AuthStorage.isExpired()).toBe(true)
  })

  it('미래 exp 토큰은 isExpired false', () => {
    AuthStorage.setToken(fakeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 }))
    expect(AuthStorage.isExpired()).toBe(false)
  })

  it('디코드 불가 토큰은 isExpired true', () => {
    AuthStorage.setToken('not-a-jwt')
    expect(AuthStorage.isExpired()).toBe(true)
  })

  it('getAuthHeader 는 토큰 있으면 Bearer, 없으면 빈 객체', () => {
    expect(AuthStorage.getAuthHeader()).toEqual({})
    AuthStorage.setToken('tok')
    expect(AuthStorage.getAuthHeader()).toEqual({ Authorization: 'Bearer tok' })
  })
})
