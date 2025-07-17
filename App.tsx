
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public Pages
import Index from '@/pages/Index';
import { Login } from '@/pages/Login';
import Signup from '@/pages/Signup';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { CoverPacket } from '@/pages/CoverPacket';
import NotFound from '@/pages/NotFound';

// Protected Pages
import { Dashboard } from '@/pages/Dashboard';
import { Employees } from '@/pages/Employees';
import { Shifts } from '@/pages/Shifts';
import { Tips } from '@/pages/Tips';
import { Payroll } from '@/pages/Payroll';
import { TIEE } from '@/pages/TIEE';
import Settings from '@/pages/Settings';

// New Marketing Pages (will be created as placeholders)
import Pricing from '@/pages/Pricing';
import Demo from '@/pages/Demo';
import Testimonials from '@/pages/Testimonials';
import Support from '@/pages/Support';
import Blog from '@/pages/Blog';
import Features from '@/pages/Features';

// Onboarding Pages
import BusinessSetup from '@/pages/onboarding/BusinessSetup';
import TeamSetup from '@/pages/onboarding/TeamSetup';
import Complete from '@/pages/onboarding/Complete';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cover-packet" element={<CoverPacket />} />
            
            {/* Marketing Pages */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support/contact" element={<Support />} />
            <Route path="/support/status" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/payroll" element={<Features />} />
            <Route path="/features/tips" element={<Features />} />
            <Route path="/features/compliance" element={<Features />} />
            <Route path="/features/management" element={<Features />} />
            <Route path="/features/employee" element={<Features />} />
            
            {/* Onboarding routes */}
            <Route path="/onboarding/business-setup" element={<BusinessSetup />} />
            <Route path="/onboarding/team-setup" element={<TeamSetup />} />
            <Route path="/onboarding/complete" element={<Complete />} />
            
            {/* Protected routes - require authentication and use Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/shifts" element={<ProtectedRoute><Shifts /></ProtectedRoute>} />
              <Route path="/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />
              <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
              <Route path="/tiee" element={<ProtectedRoute><TIEE /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
