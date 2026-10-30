import React from 'react';
import { MODULES, FINAL_ACTION_PAGE } from '../constants';
import { ActivityId, AppState } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2, ChevronRight, Home, BookOpen, PenTool, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  appState: AppState;
  currentView: ActivityId | 'home';
  onNavigate: (view: ActivityId | 'home') => void;
  isOpen: boolean;
  onToggle: () => void;
}

import SidebarLogo from './Logo';

export default function Sidebar({ appState, currentView, onNavigate, isOpen, onToggle }: SidebarProps) {
  const isActivityCompleted = (id: ActivityId) => {
    const data = appState.activities[id];
    return !!(data && (data.question1 || data.question2 || data.question3));
  };

  const getModuleCompletedCount = (moduleId: number) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return 0;
    return module.activities.filter(a => isActivityCompleted(a.id)).length;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-[280px] bg-white border-r border-[#E5E7EB] transition-transform duration-300 z-50 overflow-y-auto flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="cursor-pointer space-y-4" onClick={() => onNavigate('home')}>
              <SidebarLogo className="scale-[0.85] -ml-2 origin-left" />
              <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest leading-tight">
                Mon Livret Réflexif CCE
              </div>
            </div>
          </div>

          <nav className="p-3 overflow-y-auto flex-1">
            <button
              onClick={() => onNavigate('home')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] font-medium mb-4",
                currentView === 'home' ? "bg-[#F3E6F0] text-[#810464]" : "text-[#4B5563] hover:bg-gray-50"
              )}
            >
              <LayoutDashboard size={18} />
              Accueil
            </button>

            <div className="space-y-6">
              {MODULES.map((module) => (
                <div key={module.id} className="module-item">
                  <div className="flex justify-between items-center px-3 py-2 text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.05em]">
                    <span>{`Module ${module.id}`}</span>
                    <span className="text-[9px] font-normal lowercase">{getModuleCompletedCount(module.id)}/{module.activities.length}</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {module.activities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => onNavigate(activity.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] transition-all text-left",
                          currentView === activity.id 
                            ? "bg-[#F3E6F0] text-[#810464] font-medium" 
                            : "text-[#4B5563] hover:bg-gray-50"
                        )}
                      >
                        <span className="shrink-0 flex items-center justify-center">
                          {isActivityCompleted(activity.id) ? (
                            <CheckCircle2 size={14} className="text-[#22C55E]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                          )}
                        </span>
                        <span className="truncate">{activity.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="p-6 border-top border-[#E5E7EB]">
            <button
              onClick={() => onNavigate(FINAL_ACTION_PAGE.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all text-[13px] font-bold",
                currentView === 'actions_mener' 
                  ? "bg-[#810464] text-white" 
                  : "text-[#1A1A2E] hover:bg-gray-50 border border-transparent"
              )}
            >
              <PenTool size={18} />
              🎯 Mes actions finales
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
