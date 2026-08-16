import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { supabase } from './lib/supabaseClient';
import { siteConfig } from './siteConfig';
import VideoBackground from './components/VideoBackground';

import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Tests from './pages/Tests';
import WeeklyReport from './pages/WeeklyReport';
import Notes from './pages/Notes';
import Certifications from './pages/Certifications';
import AIMentor from './pages/AIMentor';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

function AppShell({ children }) {
  return (
    <div className="app-background min-h-screen text-white">
      <VideoBackground src={siteConfig.backgroundVideoUrl} />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-semibold">
            Loading Cyber Journey...
          </div>
        </div>
      </AppShell>
    );
  }

  /*
   * LOGIN / RESET PASSWORD
   */
  if (!session) {
    return (
      <AppShell>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </AppShell>
    );
  }

  /*
   * MAIN APPLICATION
   */
  return (
    <AppShell>
      <div className="min-h-screen flex">
        <div className="relative z-20 glass-sidebar h-screen">
          <Sidebar />
        </div>

        <main className="flex-1 relative z-10 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/weekly" element={<WeeklyReport />} />
            <Route path="/notes" element={<Notes />} />
            <Route
              path="/certifications"
              element={<Certifications />}
            />
            <Route path="/ai-mentor" element={<AIMentor />} />
          </Routes>
        </main>
      </div>
    </AppShell>
  );
}
