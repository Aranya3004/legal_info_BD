import HeroPage from './pages/HeroPage';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AiChatPage from './pages/AiChatPage';
import CasesPage from './pages/CasesPage';
import LaborLawPage from './pages/LaborLawPage';
import ValidationPage from './pages/ValidationPage';
import Footer from './components/Footer';

// Layout wrapper that includes the navbar (top bar)
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem',
              background: '#3a302a',
              color: '#faf5ee',
              border: '1px solid rgba(194,101,42,0.3)',
              borderRadius: '8px',
            },
            success: {
              iconTheme: { primary: '#c2652a', secondary: '#fff' },
            },
          }}
        />

        {/* Import fonts globally */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Manrope', sans-serif;
            background: #faf5ee;
            color: #3a302a;
            -webkit-font-smoothing: antialiased;
          }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: #f6f0e8; }
          ::-webkit-scrollbar-thumb { background: #d8d0c8; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #c2652a; }
          ::selection { background: #fbe8d8; color: #3a302a; }
        `}</style>

        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public landing page */}
          <Route path="/" element={<HeroPage />} />

          {/* Protected routes — all logged-in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/cases" element={
            <ProtectedRoute>
              <AppLayout><CasesPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/labor-law" element={
            <ProtectedRoute>
              <AppLayout><LaborLawPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Lawyer-only routes */}
          <Route path="/ai-chat" element={
            <ProtectedRoute lawyerOnly={true}>
              <AppLayout><AiChatPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/validation" element={
            <ProtectedRoute lawyerOnly={true}>
              <AppLayout><ValidationPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;