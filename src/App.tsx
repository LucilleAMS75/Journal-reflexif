/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivityId, AppState, ActivityData } from './types';
import { MODULES, ALL_ACTIVITIES, FINAL_ACTION_PAGE } from './constants';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ActivityPage from './components/ActivityPage';
import ActionsPage from './components/ActionsPage';
import { exportToWord } from './lib/export';
import { Menu, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'livret_reflexif_v1';

const INITIAL_STATE: AppState = {
  lastVisited: 'home',
  activities: {}
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<ActivityId | 'home'>(appState.lastVisited);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...appState, lastVisited: currentView }));
  }, [appState, currentView]);

  const handleNavigate = (view: ActivityId | 'home') => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSaveActivity = (id: ActivityId, data: ActivityData) => {
    setAppState(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [id]: data
      }
    }));
  };

  const handleExportWord = async (id?: ActivityId) => {
    await exportToWord(appState, id);
  };

  const getActivityData = (id: ActivityId): ActivityData => {
    return appState.activities[id] || { question1: '', question2: '', question3: '', lastSaved: '' };
  };

  // Calculate overall progress
  const totalRelevantActivities = ALL_ACTIVITIES.length;
  const completedActivities = ALL_ACTIVITIES.filter(a => {
    const data = appState.activities[a.id];
    return data && (data.question1 || data.question2 || data.question3);
  }).length;
  const progressPercent = Math.round((completedActivities / totalRelevantActivities) * 100);

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      {/* Sidebar */}
      <Sidebar 
        appState={appState} 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <a 
              href="https://1001parcours.cci.fr/experience/mod/page/view.php?id=2264" 
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#810464] bg-[#810464]/5 border border-[#810464]/10 rounded-md hover:bg-[#810464]/10 transition-all mr-2 shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Retour au parcours</span>
              <span className="sm:hidden">Retour</span>
            </a>
            <nav className="flex items-center gap-2 text-xs font-medium">
              <button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-[#810464]">Accueil</button>
              {currentView !== 'home' && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-700 font-bold truncate max-w-[150px]">
                    {currentView === 'actions_mener' ? 'Mes actions à mener' : ALL_ACTIVITIES.find(a => a.id === currentView)?.title}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-[#810464]"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{progressPercent}% complété</span>
            </div>
            {currentView === 'home' && (
              <div className="flex items-center gap-2 md:hidden">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[10px] font-bold">{completedActivities}/{totalRelevantActivities}</span>
              </div>
            )}
          </div>
        </header>

        {/* View Container */}
        <div className="flex-grow p-4 md:p-8">
          <AnimatePresence mode="wait">
            {currentView === 'home' ? (
              <HomePage 
                appState={appState} 
                onNavigate={handleNavigate}
                onExportWord={() => handleExportWord()}
              />
            ) : currentView === 'actions_mener' ? (
              <ActionsPage 
                data={getActivityData('actions_mener')}
                onSave={handleSaveActivity}
                onNavigate={handleNavigate}
                onExportWord={handleExportWord}
              />
            ) : (
              <ActivityPage 
                activityId={currentView}
                data={getActivityData(currentView)}
                onSave={handleSaveActivity}
                onNavigate={handleNavigate}
                onExportWord={handleExportWord}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Mon Livret Réflexif CCE — CCI FRANCE
          </p>
        </footer>
      </main>
    </div>
  );
}
