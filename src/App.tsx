import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import RoomDetail from './pages/RoomDetail';
import Booking from './pages/Booking';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { CRMProvider } from './context/CRMDataContext';
import CRMApp from './components/crm/CRMApp';
import Login from './pages/crm/Login';
import PricingPage from './pages/PricingPage';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <CRMProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton />
          <div className="noise-overlay"></div>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            } />
            <Route path="/rooms/:slug" element={
              <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
                <Navbar />
                <main className="flex-grow">
                  <RoomDetail />
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            } />
            <Route path="/pricing" element={
              <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
                <Navbar />
                <main className="flex-grow">
                  <PricingPage />
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            } />
            <Route path="/book" element={
              <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
                <Navbar />
                <main className="flex-grow">
                  <Booking />
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            } />

            {/* CRM Admin Routes */}
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
