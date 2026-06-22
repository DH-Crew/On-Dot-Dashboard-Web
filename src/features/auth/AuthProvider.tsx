import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from 'Features/auth/authContext'
import { AuthStorage } from 'Services/AuthStorageService'
import { authEvents } from 'Services/authEvents'
import { loginKakao } from 'Services/kakao'
import { loginWithKakao } from 'Api/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [isAuthed, setIsAuthed] = useState(() => !AuthStorage.isExpired())
  const [loggingIn, setLoggingIn] = useState(false)

  const login = useCallback(async () => {
    setLoggingIn(true)
    try {
      const accessToken = await loginKakao()
      const { accessToken: jwt } = await loginWithKakao(accessToken)
      AuthStorage.setToken(jwt)
      setIsAuthed(true)
      navigate('/overview', { replace: true })
    } finally {
      setLoggingIn(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    AuthStorage.clear()
    setIsAuthed(false)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    return authEvents.subscribe((kind) => {
      if (kind === 'unauthorized') {
        setIsAuthed(false)
        navigate('/login', { replace: true })
      } else if (kind === 'forbidden') {
        navigate('/forbidden', { replace: true })
      }
    })
  }, [navigate])

  const value = useMemo(
    () => ({ isAuthed, loggingIn, login, logout }),
    [isAuthed, loggingIn, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
