/** axios 인터셉터(라우터 밖)에서 발생한 인증 이벤트를 AuthContext(라우터 안)로 전달하는 경량 이벤트 버스. */
export type AuthEventKind = 'unauthorized' | 'forbidden'

type Listener = (kind: AuthEventKind) => void

const listeners = new Set<Listener>()

export const authEvents = {
  emit(kind: AuthEventKind): void {
    listeners.forEach((l) => l(kind))
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
