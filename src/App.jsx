import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<ApplicationsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}