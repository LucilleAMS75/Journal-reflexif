import React from 'react';
import { MODULES } from '../constants';
import { AppState, ActivityId } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { FileText, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

interface HomePageProps {
  appState: AppState;
  onNavigate: (view: ActivityId) => void;
  onExportWord: () => void;
}

import CCILogo from './Logo';

export default function HomePage({ appState, onNavigate, onExportWord }: HomePageProps) {
  const getModuleProgress = (moduleId: number) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0 };
    const total = module.activities.length;
    const completed = module.activities.filter(a => {
      const data = appState.activities[a.id];
      return data && (data.question1 || data.question2 || data.question3);
    }).length;
    return { completed, total };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <header className="text-center space-y-8 flex flex-col items-center">
        <CCILogo className="scale-110 mb-2" />
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-[#1A1A2E] tracking-tight">Mon Livret Réflexif</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-tight">
            CCE - Exercer la mission de formateur en entreprise
          </p>
        </div>
        <div className="w-20 h-1 bg-[#810464] mx-auto rounded-full" />
        
        <div className="pt-4">
          <button
            onClick={onExportWord}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#810464] text-white rounded-lg font-bold hover:bg-[#6b0353] transition-all shadow-md active:scale-95"
          >
            <FileText size={20} />
            Télécharger mon livret complet (Word)
          </button>
        </div>

        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Ce livret est votre compagnon de route. Consignez-y vos réflexions après chaque activité pour ancrer vos apprentissages et préparer votre certification.
        </p>
      </header>

      <section className="bg-white p-8 rounded-lg shadow-editorial border-l-4 border-[#810464]">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
          La réflexivité : un levier essentiel pour votre développement professionnel
        </h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed text-justify">
          <p>
            La réflexivité en formation consiste à porter un regard conscient et structuré sur votre propre expérience : ce que vous faites, comment vous le faites, et surtout pourquoi vous agissez ainsi. Elle ne se résume pas à raconter ce qui s'est passé, mais à analyser vos pratiques pour en tirer des apprentissages durables.
          </p>
          <p>
            En tant que formateur, cette posture est particulièrement précieuse : elle vous permet de mieux comprendre vos forces, d'identifier vos axes de progrès, et d'ajuster votre manière de concevoir et animer au fil des situations rencontrées.
          </p>
          <p>
            Ce livret réflexif que vous allez compléter tout au long de cette formation est un espace qui vous appartient — un outil pour donner du sens à vos apprentissages, faire le lien entre les apports théoriques et votre réalité professionnelle, et construire progressivement votre propre pratique de formateur.
          </p>
          <p className="font-medium italic text-[#1A1A2E]">
            Prendre le temps d'écrire, c'est prendre le temps de penser. Et penser sa pratique, c'est déjà commencer à la transformer.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => {
          const { completed, total } = getModuleProgress(module.id);
          const isDone = completed === total && total > 0;

          return (
            <motion.div
              key={module.id}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-lg shadow-editorial flex flex-col justify-between group cursor-pointer border border-transparent hover:border-[#E5E7EB] transition-all"
              onClick={() => onNavigate(module.activities[0].id)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase">
                    Module {module.id}
                  </span>
                  {isDone && <CheckCircle2 size={16} className="text-[#22C55E]" />}
                </div>
                <h3 className="text-[15px] font-bold text-[#1A1A2E] leading-snug group-hover:text-[#810464] transition-colors">
                  {module.title}
                </h3>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-wider">Activités</span>
                  <span className={cn(
                    "text-xs font-bold",
                    isDone ? "text-[#22C55E]" : "text-[#4B5563]"
                  )}>
                    {completed} / {total} {isDone ? 'Complétées' : 'en cours'}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#D1D5DB] group-hover:bg-[#810464] group-hover:text-white transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
