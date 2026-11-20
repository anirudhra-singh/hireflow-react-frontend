import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

// ROUTES: "/" is the public landing page. "/login" is the sign-in page. Everything
// inside ProtectedRoute needs a logged-in user; AppLayout draws the sidebar, and the
// matching page appears inside AppLayout's <Outlet />.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="board" element={<ApplicationsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}