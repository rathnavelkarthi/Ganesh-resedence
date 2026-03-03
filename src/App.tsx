import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SaaSHome from './pages/SaaSHome';
import SaaSNavbar from './components/saas/SaaSNavbar';
import SaaSFooter from './components/saas/SaaSFooter';
import { AuthProvider } from './context/AuthContext';
import { CRMProvider } from './context/CRMDataContext';
import CRMApp from './components/crm/CRMApp';
import Login from './pages/crm/Login';
import Signup from './pages/Signup';
import TenantSite from './pages/TenantSite';
import RoomDetail from './pages/RoomDetail';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <CRMProvider>
        <Router basename="/">
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton />
          <div className="noise-overlay"></div>
          <Routes>
            {/* SaaS landing page */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
                <SaaSNavbar />
                <main className="flex-grow">
                  <SaaSHome />
                </main>
                <SaaSFooter />
              </div>
            } />

            {/* Tenant websites */}
            <Route path="/site/:subdomain" element={<TenantSite />} />
            <Route path="/site/:subdomain/room/:roomId" element={<RoomDetail />} />

            {/* Signup */}
            <Route path="/signup" element={<Signup />} />

            {/* CRM admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={<CRMApp />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CRMProvider>
    </AuthProvider>
  );
}
