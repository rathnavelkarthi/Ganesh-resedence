import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import RoleGuard from './RoleGuard';

// Pages
import Dashboard from '../../pages/crm/Dashboard';
import Reservations from '../../pages/crm/Reservations';
import Calendar from '../../pages/crm/Calendar';
import Guests from '../../pages/crm/Guests';
import Rooms from '../../pages/crm/Rooms';
import Payments from '../../pages/crm/Payments';
import Invoices from '../../pages/crm/Invoices';
import Reports from '../../pages/crm/Reports';
import Staff from '../../pages/crm/Staff';
import Settings from '../../pages/crm/Settings';

export default function CRMApp() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#F8F9FB] to-[#EEF1F5] overflow-hidden font-sans text-gray-900 relative">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Off-canvas on mobile, static on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white w-64`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="reservations" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAGER', 'RECEPTION']}>
                <Reservations />
              </RoleGuard>
            } />

            <Route path="calendar" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAGER', 'RECEPTION']}>
                <Calendar />
              </RoleGuard>
            } />

            <Route path="guests" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAGER', 'RECEPTION']}>
                <Guests />
              </RoleGuard>
            } />

            <Route path="rooms" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING']}>
                <Rooms />
              </RoleGuard>
            } />

            <Route path="payments" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ACCOUNTANT']}>
                <Payments />
              </RoleGuard>
            } />

            <Route path="invoices" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'RECEPTION', 'ACCOUNTANT']}>
                <Invoices />
              </RoleGuard>
            } />

            <Route path="reports" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ACCOUNTANT']}>
                <Reports />
              </RoleGuard>
            } />

            <Route path="staff" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                <Staff />
              </RoleGuard>
            } />

            <Route path="settings" element={
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAGER']}>
                <Settings />
              </RoleGuard>
            } />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
