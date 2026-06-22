import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from 'Components/ProtectedRoute'
import { Layout } from 'Components/Layout'
import { LoginPage } from 'Features/auth/LoginPage'
import { ForbiddenPage } from 'Features/auth/ForbiddenPage'
import { OverviewPage } from 'Features/overview/OverviewPage'
import { AreaPage } from 'Features/area/AreaPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/growth" element={<AreaPage area="growth" />} />
          <Route path="/schedule" element={<AreaPage area="schedule" />} />
          <Route path="/alarm" element={<AreaPage area="alarm" />} />
          <Route path="/usage" element={<AreaPage area="usage" />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  )
}
