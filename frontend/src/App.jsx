import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import IndustryAnalysis from './pages/IndustryAnalysis'
import RegionalInsights from './pages/RegionalInsights'
import TrendsOverTime from './pages/TrendsOverTime'
import KeyInsights from './pages/KeyInsights'
import Recommendations from './pages/Recommendations'
import Models from './pages/Models'
import About from './pages/About'
import Contact from './pages/Contact'
import Welcome from './pages/Welcome'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Exports from './pages/Exports'
import UploadDetails from './pages/UploadDetails'
import EmailTemplates from './pages/EmailTemplates'
import WelcomeTemplate from './pages/templates/WelcomeTemplate'
import VerifyOtpTemplate from './pages/templates/VerifyOtpTemplate'
import ResetOtpTemplate from './pages/templates/ResetOtpTemplate'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Login from './auth/pages/Login'
import Register from './auth/pages/Register'
import VerifyEmail from './auth/pages/VerifyEmail'
import ForgotPassword from './auth/pages/ForgotPassword'
import ResetPassword from './auth/pages/ResetPassword'
import AuthHeader from './components/AuthHeader'
import ErrorBoundary from './components/ErrorBoundary'
import AdminTools from './pages/AdminTools'
import ModelInfo from './pages/ModelInfo'
import PredictionsOverview from './pages/PredictionsOverview'

function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isAuth = ['/login','/register','/verify-email','/forgot-password','/reset-password']
    .some(p => location.pathname.startsWith(p))

  return (
    <div className="flex flex-col min-h-screen">
      {isAuth ? <AuthHeader /> : <Navbar />}
      <main className={isDashboard || isAuth ? "" : "flex-1"}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Dashboard Routes - with sidebar layout (protected) */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/industry" element={<IndustryAnalysis />} />
                  <Route path="/regional" element={<RegionalInsights />} />
                  <Route path="/trends" element={<TrendsOverTime />} />
                  <Route path="/insights" element={<KeyInsights />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/exports" element={<Exports />} />
                  <Route path="/exports/uploads/:id" element={<UploadDetails />} />
                  <Route path="/models" element={<ModelInfo />} />
                  <Route path="/predictions" element={<Models />} />
                  <Route path="/predictions-analytics" element={<PredictionsOverview />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Other Pages - simple layout */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/email-templates/welcome" element={<WelcomeTemplate />} />
          <Route path="/email-templates/verify-otp" element={<VerifyOtpTemplate />} />
          <Route path="/email-templates/reset-otp" element={<ResetOtpTemplate />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/admin" element={<AdminTools />} />

          {/* Account Pages */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App
