export type ActivityId = 
  | 'analyse_demande_checklist' | 'analyse_demande_qqoqccp' | 'analyse_demande_persona'
  | 'formuler_objectifs' | 'fiche_formation' | 'construire_deroule'
  | 'rediger_prompt' | 'support_iag' | 'checklist_presession'
  | 'micro_sequence_video' | 'evaluation_diagnostique'
  | 'questionnaire_chaud' | 'partie_bilan'
  | 'actions_finales' | 'actions_mener';

export interface ActivityData {
  question1: string;
  question2: string;
  question3: string;
  lastSaved: string; // ISO date
}

export interface AppState {
  lastVisited: ActivityId | 'home';
  activities: Partial<Record<ActivityId, ActivityData>>;
}
