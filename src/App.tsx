import { AuthProvider } from 'Features/auth/AuthProvider'
import { AppRoutes } from 'Routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
