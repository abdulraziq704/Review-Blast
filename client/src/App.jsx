import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Contacts from './pages/Contacts';
import SendCampaign from './pages/SendCampaign';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Public Pages
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Pricing from './pages/Pricing';

import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/dashboard-app" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard-app/stats" />} />
            <Route path="stats" element={<Dashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="send" element={<SendCampaign />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />} />

          {/* Legacy redirect or Catch-all */}
          <Route path="/dashboard" element={<Navigate to="/dashboard-app/stats" />} />
          <Route path="/contacts" element={<Navigate to="/dashboard-app/contacts" />} />
          <Route path="/send" element={<Navigate to="/dashboard-app/send" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
