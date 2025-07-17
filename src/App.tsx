import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';
import { DashboardPreview } from './components/DashboardPreview';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
export function App() {
  return <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/" element={<>
                <Header />
                <main className="flex-grow">
                  <HeroSection />
                  <FeatureSection />
                  <DashboardPreview />
                  <CTASection />
                </main>
                <Footer />
              </>} />
        </Routes>
      </div>
    </BrowserRouter>;
}