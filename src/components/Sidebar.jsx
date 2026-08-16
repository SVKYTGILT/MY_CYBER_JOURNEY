import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Calendar,
  BookOpen,
  Award,
  Bot,
  ClipboardList,
  LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Roadmap', path: '/roadmap', icon: <Map size={20} /> },
  { name: 'Tests', path: '/tests', icon: <ClipboardList size={20} /> },
  { name: 'Weekly Report', path: '/weekly', icon: <Calendar size={20} /> },
  { name: 'Notes', path: '/notes', icon: <BookOpen size={20} /> },
  { name: 'Certifications', path: '/certifications', icon: <Award size={20} /> },
  { name: 'AI Mentor', path: '/ai-mentor', icon: <Bot size={20} /> },
];

export default function Sidebar() {

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="h-screen flex flex-col justify-between p-4 md:p-6">

      {/* ================================= */}
      {/* LOGO / TITLE */}
      {/* ================================= */}

      <div>

        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-rose-200 to-cyan-200 bg-clip-text text-transparent">
            CyberJourney
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Cybersecurity Career Tracker
          </p>
        </div>

        {/* ================================= */}
        {/* NAVIGATION LINKS */}
        {/* ================================= */}

        <div className="flex flex-col gap-3 w-full">

          {navItems.map((item) => (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500/60 to-pink-500/60 border border-white/30 shadow-lg shadow-rose-500/30 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                }`
              }
            >

              <div className="flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>

              <span className="hidden md:block font-semibold tracking-wide text-sm">
                {item.name}
              </span>

            </NavLink>

          ))}

        </div>

      </div>


      {/* ================================= */}
      {/* BOTTOM SECTION */}
      {/* ================================= */}

      <div className="flex flex-col gap-4">

        {/* User Information */}

        <div className="hidden md:block text-xs text-gray-400 px-2">
          <p>Vasu • Target 2030</p>
        </div>


        {/* Logout Button */}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-red-300 hover:text-red-200 hover:bg-red-500/10 border border-transparent hover:border-red-400/20 transition-all duration-300"
        >

          <div className="flex items-center justify-center flex-shrink-0">
            <LogOut size={20} />
          </div>

          <span className="hidden md:block font-semibold tracking-wide text-sm">
            Logout
          </span>

        </button>

      </div>

    </nav>
  );
}

