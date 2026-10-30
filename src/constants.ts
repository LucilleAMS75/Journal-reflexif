import { ActivityId } from './types';

export interface Activity {
  id: ActivityId;
  title: string;
}

export interface Module {
  id: number;
  title: string;
  activities: Activity[];
}

export const MODULES: Module[] = [
  {
    id: 1,
    title: "1. Analyser une demande de formation",
    activities: [
      { id: 'analyse_demande_checklist', title: "La checklist : QQOQCCP" },
      { id: 'analyse_demande_qqoqccp', title: "L'analyse QQOQCCP" },
      { id: 'analyse_demande_persona', title: "Construire un persona" }
    ]
  },
  {
    id: 2,
    title: "2. Concevoir une formation",
    activities: [
      { id: 'formuler_objectifs', title: "Formuler des objectifs pédagogiques" },
      { id: 'fiche_formation', title: "Compléter une fiche formation" },
      { id: 'construire_deroule', title: "Construire un résumé de déroulé pédagogique" }
    ]
  },
  {
    id: 3,
    title: "3. Appliquer l'IAG au service de la formation",
    activities: [
      { id: 'rediger_prompt', title: "Rédiger un prompt" }
    ]
  },
  {
    id: 4,
    title: "4. Concevoir des supports pédagogiques",
    activities: [
      { id: 'support_iag', title: "Construire un support à l'aide de l'IAG" }
    ]
  },
  {
    id: 5,
    title: "5. Organiser les conditions logistiques",
    activities: [
      { id: 'checklist_presession', title: "Construire sa checklist pré-session" }
    ]
  },
  {
    id: 6,
    title: "6. Animer une séquence de formation",
    activities: [
      { id: 'micro_sequence_video', title: "Préparer une micro-séquence vidéo" }
    ]
  },
  {
    id: 7,
    title: "7. Evaluer les acquis des apprenants",
    activities: [
      { id: 'evaluation_diagnostique', title: "Concevoir une évaluation diagnostique" }
    ]
  },
  {
    id: 8,
    title: "8. Evaluer la formation",
    activities: [
      { id: 'questionnaire_chaud', title: "Rédiger un questionnaire à chaud" },
      { id: 'partie_bilan', title: "Rédiger une partie d'un bilan" }
    ]
  }
];

export const ALL_ACTIVITIES = MODULES.flatMap(m => m.activities);

export const FINAL_ACTION_PAGE: Activity = {
  id: 'actions_mener',
  title: "Mes actions à mener"
};
