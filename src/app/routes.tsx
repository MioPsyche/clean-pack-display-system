import { Route, Routes } from 'react-router-dom';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
