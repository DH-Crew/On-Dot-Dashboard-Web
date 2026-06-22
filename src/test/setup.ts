import '@testing-library/jest-dom/vitest'

// jsdom 의 localStorage 가 opaque origin 등으로 동작하지 않는 경우가 있어
// 테스트에서는 결정적인 인메모리 구현으로 대체한다.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    },
    removeItem(key: string) {
      store.delete(key)
    },
    key(index: number) {
      return [...store.keys()][index] ?? null
    },
  } as Storage
}

Object.defineProperty(globalThis, 'localStorage', {
  value: createMemoryStorage(),
  configurable: true,
})
