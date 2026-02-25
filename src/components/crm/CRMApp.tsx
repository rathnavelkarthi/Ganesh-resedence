import { Routes, Route, Navigate } from 'react-router-dom';
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

export default function CRMApp() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
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

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
