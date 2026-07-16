import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import CollectLeadPage from './pages/CollectLeadPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { CampaignListPage } from './pages/CampaignListPage';
import { CampaignCreatePage } from './pages/CampaignCreatePage';
import { CampaignViewPage } from './pages/CampaignViewPage';
import AssetUploadPage from './pages/AssetUploadPage';
import AssetListPage from './pages/AssetListPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/collect" element={<CollectLeadPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <CampaignListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/create"
            element={
              <ProtectedRoute>
                <CampaignCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute>
                <CampaignViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/upload"
            element={
              <ProtectedRoute>
                <AssetUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <AssetListPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

