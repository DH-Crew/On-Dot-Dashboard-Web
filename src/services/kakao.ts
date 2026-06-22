import { ENV } from 'Constants/env'

interface KakaoAuth {
  login(options: {
    success: (auth: { access_token: string }) => void
    fail: (err: unknown) => void
  }): void
}

interface KakaoSDK {
  init(key: string): void
  isInitialized(): boolean
  Auth: KakaoAuth
}

declare global {
  interface Window {
    Kakao?: KakaoSDK
  }
}

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'

let sdkPromise: Promise<KakaoSDK> | null = null

function loadSdk(): Promise<KakaoSDK> {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise<KakaoSDK>((resolve, reject) => {
    if (window.Kakao) {
      resolve(window.Kakao)
      return
    }
    const script = document.createElement('script')
    script.src = SDK_URL
    script.onload = () => {
      if (window.Kakao) resolve(window.Kakao)
      else reject(new Error('Kakao SDK 로드 실패'))
    }
    script.onerror = () => reject(new Error('Kakao SDK 스크립트 에러'))
    document.head.appendChild(script)
  })
  return sdkPromise
}

/**
 * 카카오 로그인으로 access_token 획득.
 * KAKAO_JS_KEY 가 비어 있으면 dev 모드: 가짜 토큰 반환(MSW 가 교환을 목킹).
 */
export async function loginKakao(): Promise<string> {
  if (!ENV.KAKAO_JS_KEY) {
    return 'dev-kakao-access-token'
  }
  const Kakao = await loadSdk()
  if (!Kakao.isInitialized()) Kakao.init(ENV.KAKAO_JS_KEY)
  return new Promise<string>((resolve, reject) => {
    Kakao.Auth.login({
      success: (auth) => resolve(auth.access_token),
      fail: (err) => reject(err),
    })
  })
}
