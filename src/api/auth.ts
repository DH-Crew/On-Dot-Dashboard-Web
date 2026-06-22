import { apiClient } from 'Api/client'
import type { AuthResponse } from 'Types/analytics'

/** 카카오 access_token 을 회원 JWT 로 교환. */
export async function loginWithKakao(accessToken: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login/oauth', null, {
    params: { provider: 'KAKAO', access_token: accessToken },
  })
  return data
}
