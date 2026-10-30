import React, { useState, useEffect, useCallback } from 'react';
import { MODULES, ALL_ACTIVITIES } from '../constants';
import { ActivityId, ActivityData } from '../types';
import { cn, formatDate } from '../lib/utils';
import { ChevronLeft, ChevronRight, FileText, Save, ListChecks } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityPageProps {
  activityId: ActivityId;
  data: ActivityData;
  onSave: (id: ActivityId, data: ActivityData) => void;
  onNavigate: (id: ActivityId | 'home') => void;
  onExportWord: (id: ActivityId) => void;
}

export default function ActivityPage({ activityId, data, onSave, onNavigate, onExportWord }: ActivityPageProps) {
  const [localData, setLocalData] = useState<ActivityData>(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data, activityId]);

  // Find module info
  const module = MODULES.find(m => m.activities.some(a => a.id === activityId));
  const activityIndex = ALL_ACTIVITIES.findIndex(a => a.id === activityId);
  const currentActivity = ALL_ACTIVITIES[activityIndex];

  const handleUpdate = (field: keyof ActivityData, value: string) => {
    const newData = { ...localData, [field]: value, lastSaved: new Date().toISOString() };
    setLocalData(newData);
    debouncedSave(newData);
  };

  // Basic debounce implementation
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const debouncedSave = (newData: ActivityData) => {
    if (timer) clearTimeout(timer);
    setIsSaving(true);
    const newTimer = setTimeout(() => {
      onSave(activityId, newData);
      setIsSaving(false);
    }, 800);
    setTimer(newTimer);
  };

  const goNext = () => {
    if (activityIndex < ALL_ACTIVITIES.length - 1) {
      onNavigate(ALL_ACTIVITIES[activityIndex + 1].id);
    } else {
      onNavigate('actions_finales');
    }
  };

  const goPrev = () => {
    if (activityIndex > 0) {
      onNavigate(ALL_ACTIVITIES[activityIndex - 1].id);
    } else {
      onNavigate('home');
    }
  };

  return (
    <motion.div 
      key={activityId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <header className="mb-6 px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-2">
          <h1 className="text-2xl font-bold text-[#1A1A2E] leading-none mb-0">{currentActivity?.title}</h1>
          <div className="text-sm text-[#6B7280]">Activité {activityIndex + 1} sur 13</div>
        </div>
        <p className="text-sm text-[#6B7280]">Module {module?.id} : {module?.title}</p>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-editorial flex flex-col min-h-[500px]">
        <span className="text-[#810464] font-bold text-[11px] tracking-[0.15em] uppercase mb-8 block">
          Mes réflexions
        </span>

        <div className="space-y-6 flex-1 flex flex-col">
          <QuestionField 
            label="1. Qu'est-ce que je retiens de cette activité ?"
            value={localData.question1}
            onChange={(val) => handleUpdate('question1', val)}
          />
          <QuestionField 
            label="2. Quelles questions me suis-je posé pendant cette activité ?"
            value={localData.question2}
            onChange={(val) => handleUpdate('question2', val)}
          />
          <QuestionField 
            label="3. Quelle est la première chose concrète que je vais faire différemment ?"
            value={localData.question3}
            onChange={(val) => handleUpdate('question3', val)}
          />
        </div>

        <div className="mt-8 pt-4 flex items-center justify-end">
          {isSaving ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Sauvegarde...
            </div>
          ) : data.lastSaved && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
              Sauvegardé à {formatDate(data.lastSaved).split(' ')[1]}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
        <button
          onClick={goPrev}
          className="px-5 py-2.5 bg-[#E5E7EB] text-[#374151] rounded-md font-medium text-sm hover:bg-gray-200 transition-all"
        >
          PRÉCÉDENT
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onExportWord(activityId)}
            className="px-5 py-2.5 border border-[#810464] text-[#810464] rounded-md font-medium text-sm hover:bg-[#810464]/5 transition-all"
          >
            WORD ACTUEL
          </button>
          <button
            onClick={goNext}
            className="px-5 py-2.5 bg-[#810464] text-white rounded-md font-medium text-sm hover:bg-[#6b0353] transition-all shadow-sm"
          >
            ACTIVITÉ SUIVANTE
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

function QuestionField({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <label className="block text-[14px] font-medium text-[#1A1A2E] mb-2">{label}</label>
      <textarea
        rows={4}
        className="w-full flex-1 p-3 bg-[#F9F9FB] border border-[#E5E7EB] rounded-md text-[14px] leading-relaxed resize-none outline-none focus:border-[#810464] focus:bg-white transition-all text-[#1A1A2E]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Saisissez vos réflexions..."
      />
    </div>
  );
}
