import axios, { AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { ENV } from 'Constants/env'
import { AuthStorage } from 'Services/AuthStorageService'
import { authEvents } from 'Services/authEvents'

/** allowlist 미등록(403). 대시보드 접근 불가. */
export class ForbiddenError extends Error {
  constructor() {
    super('FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

/** 토큰 없음/무효(401). */
export class UnauthorizedError extends Error {
  constructor() {
    super('UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

/** 그 외 서버 에러. */
export class ServerError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ServerError'
    this.status = status
  }
}

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
})

axiosRetry(apiClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  // GET 등 idempotent 요청 + 네트워크/5xx 에만 재시도 (기본 동작).
})

apiClient.interceptors.request.use((config) => {
  Object.assign(config.headers, AuthStorage.getAuthHeader())
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      AuthStorage.clear()
      authEvents.emit('unauthorized')
      return Promise.reject(new UnauthorizedError())
    }
    if (status === 403) {
      authEvents.emit('forbidden')
      return Promise.reject(new ForbiddenError())
    }
    return Promise.reject(new ServerError(error.message, status))
  },
)
