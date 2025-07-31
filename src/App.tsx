import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';
import { DashboardPreview } from './components/DashboardPreview';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Calendar } from './pages/Calendar';
import { CalendarTest } from './pages/CalendarTest';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen w-full bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar-test" element={<CalendarTest />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={
              <>
                <Header />
                <main className="flex-grow">
                  <HeroSection />
                  <FeatureSection />
                  <DashboardPreview />
                  <CTASection />
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}