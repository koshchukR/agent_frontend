import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { CandidatesList } from '../components/dashboard/CandidatesList';
import { CandidateDetail } from '../components/dashboard/CandidateDetail';
import { CandidateComparison } from '../components/dashboard/CandidateComparison';
import { ScreeningScheduler } from '../components/dashboard/ScreeningScheduler';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { AIRecruiters } from '../components/dashboard/AIRecruiters';
import { SettingsPage } from '../components/dashboard/SettingsPage';
import { CommunicationCentral } from '../components/dashboard/CommunicationCentral';
import { JobPostings } from '../pages/JobPostings';
import { JobDetails } from '../pages/JobDetails';
import { JobsProvider } from '../contexts/JobsContext';
import { RecruitersProvider } from '../contexts/RecruitersContext';
import { CandidatesProvider } from '../contexts/CandidatesContext';

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  return (
    <JobsProvider>
      <RecruitersProvider>
        <CandidatesProvider>
          <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/candidates" element={<CandidatesList />} />
              <Route path="/candidates/:id" element={<CandidateDetail />} />
              <Route path="/compare" element={<CandidateComparison />} />
              <Route path="/schedule" element={<ScreeningScheduler />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-recruiters" element={<AIRecruiters />} />
              <Route path="/jobs" element={<JobPostings />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/communication" element={<CommunicationCentral />} />
            </Routes>
          </main>
          </div>
        </div>
        </CandidatesProvider>
      </RecruitersProvider>
    </JobsProvider>
  );
};