export type ScenarioId = 'elena-dizziness' | 'arthur-chest' | 'amina-postop';

export interface Vitals {
  hr: number; // bpm
  bp: string; // mmHg e.g. "102/64"
  spo2: number; // %
  temp: string; // °C or °F e.g. "36.8°C / 98.2°F"
  glucose?: number; // mg/dL
  respiratoryRate: number; // breaths/min
  positionNote?: string; // "Sitting" | "Standing"
}

export interface DialogueChoice {
  id: string;
  category: 'empathy' | 'plain-english' | 'procedural-consent' | 'assessment' | 'jargon-heavy' | 'abrupt';
  label: string;
  studentPhrase: string;
  phoneticGuide?: string;
  rationale: string;
  patientResponse: string;
  patientEmotion: string;
  rapportDelta: number; // e.g. +10, -5
  updatedVitals?: Partial<Vitals>;
  clinicalTip: string;
  deJargonNote?: string;
  nextStageId?: string;
}

export interface SimulationStage {
  id: string;
  stageNumber: number;
  title: string;
  clinicalObjective: string;
  communicationFocus: string;
  patientStateDescription: string;
  choices: DialogueChoice[];
}

export interface RoomAction {
  id: string;
  label: string;
  description: string;
  iconName: string;
  patientReaction: string;
  rapportDelta: number;
  vitalEffect?: Partial<Vitals>;
  performedMessage: string;
}

export interface Scenario {
  id: ScenarioId;
  patientName: string;
  patientAge: number;
  patientPronouns: string;
  studentRole: string;
  setting: string;
  learnerLevel: string;
  estimatedDuration: string;
  chiefComplaint: string;
  patientPersona: string;
  roomImage: string;
  patientImage: string;
  initialVitals: Vitals;
  successCriteria: string[];
  learningGoals: string[];
  stages: SimulationStage[];
  roomActions: RoomAction[];
  handoffTemplate: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
}

export interface LogEntry {
  timestamp: string;
  stageTitle: string;
  studentSpoke: string;
  patientReplied: string;
  patientEmotion: string;
  rapportChange: number;
  feedbackTip: string;
}

export interface PhraseItem {
  id: string;
  category: string;
  title: string;
  englishText: string;
  phoneticGuide: string;
  clinicalPurpose: string;
  patientFriendlyWhy: string;
  jargonToAvoid?: string;
}

export interface JargonTerm {
  id: string;
  term: string;
  phonetic: string;
  medicalMeaning: string;
  whyPatientsWorry: string;
  recommendedPlainEnglish: string;
  examplePatientSentence: string;
}
