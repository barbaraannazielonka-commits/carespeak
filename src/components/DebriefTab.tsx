import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { Scenario, LogEntry } from '../types/simulation';

interface DebriefTabProps {
  scenario: Scenario;
  rapportScore: number;
  encounterLog: LogEntry[];
  onRestartScenario: () => void;
  onSwitchScenario: (scenarioId: string) => void;
}

export const DebriefTab: React.FC<DebriefTabProps> = ({
  scenario,
  rapportScore,
  encounterLog,
  onRestartScenario,
  onSwitchScenario,
}) => {
  // Calculate performance metrics
  const positiveDecisions = encounterLog.filter((l) => l.rapportChange > 0).length;
  const jargonPenalties = encounterLog.filter((l) => l.rapportChange < 0).length;

  const empathyScore = Math.min(100, Math.max(50, rapportScore + 5));
  const clarityScore = Math.max(40, 100 - jargonPenalties * 15);
  const proceduralScore = positiveDecisions >= 3 ? 95 : 70;
  const sbarScore = positiveDecisions >= 4 ? 98 : 75;

  const overallScore = Math.round(
    (empathyScore + clarityScore + proceduralScore + sbarScore) / 4
  );

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'A', text: 'Exemplary Clinical Communication' };
    if (score >= 80) return { letter: 'B+', text: 'Proficient Patient-Centered Practice' };
    if (score >= 70) return { letter: 'C+', text: 'Developing Clinical Fluency' };
    return { letter: 'Need Practice', text: 'Needs Focused De-Jargoning Practice' };
  };

  const grade = getGrade(overallScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Educational Safety & Scope Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-900 dark:text-amber-300 block text-xs uppercase tracking-wider">
            Educational Simulation Scope & Safety Disclaimer
          </span>
          <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
            This scenario is completely fictional and intended solely for clinical English communication, empathy, and procedural explanation training. It does not provide medical guidance or clinical protocols for real patient care. Clinical procedures should always follow your institution’s approved preceptor guidelines.
          </p>
        </div>
      </div>

      {/* Main Scorecard Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
            <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Simulation Debrief & Learning Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinical Performance Debrief: {scenario.patientName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Student Role: <strong className="text-slate-700 dark:text-slate-300">{scenario.studentRole}</strong> · Setting: <strong className="text-slate-700 dark:text-slate-300">{scenario.setting}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-center min-w-[130px]">
            <span className="text-3xl font-bold text-teal-800 dark:text-teal-300 font-mono-numbers block">
              {overallScore}%
            </span>
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block mt-0.5">
              Grade {grade.letter}
            </span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 block truncate">
              {grade.text}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onRestartScenario}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry This Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Competency Domain Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Empathy & Rapport */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Patient-Centered Empathy</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono-numbers">{empathyScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${empathyScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Validated patient distress and established psychological safety immediately.
          </p>
        </div>

        {/* Plain English & Jargon Avoidance */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">De-Jargoning & Plain English</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono-numbers">{clarityScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${clarityScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Replaced complex medical Latin/Greek terms with accessible analogies.
          </p>
        </div>

        {/* Procedural Explanation & Consent */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Procedural Pre-Explanation</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono-numbers">{proceduralScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${proceduralScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Described sensory cues ("snug squeeze") and requested permission prior to touch.
          </p>
        </div>

        {/* SBAR Handoff Structure */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">SBAR Preceptor Handoff</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 font-mono-numbers">{sbarScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${sbarScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Delivered structured clinical report with concrete vitals and clear recommendation.
          </p>
        </div>
      </div>

      {/* Two Column Grid: Strengths & Opportunities vs SBAR Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Observed Strengths & Opportunities */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Strengths Achieved */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Observed Clinical Strengths</h2>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 shrink-0" />
                <span>
                  <strong>AIDET Introduction:</strong> Verified patient identity with two identifiers while recognizing non-verbal cues of anxiety.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 shrink-0" />
                <span>
                  <strong>Focused OLDCARTS Exploration:</strong> Uncovered key postural dizziness triggers and hydration deficit without asking rapid-fire interrogative questions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 shrink-0" />
                <span>
                  <strong>Empowering Teach-Back Method:</strong> Asked the patient to explain self-care steps in her own words, verifying fall-prevention retention.
                </span>
              </li>
            </ul>
          </div>

          {/* Missed Opportunities & Learning Advice */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Communication Recommendations</h2>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <p>
                <strong>Avoid Closed "Do You Understand?" Questions:</strong> Patients often feel socially obligated to nod yes even when confused. Always use the Teach-Back technique instead: <em>"Just to make sure I explained everything clearly, what will you tell your family tonight?"</em>
              </p>
              <p>
                <strong>Sensory Warnings Preempt Anxiety:</strong> Always warn patients 3 seconds before applying cold metal stethoscopes, tight cuffs, or antiseptic wipes to prevent startle reactions.
              </p>
            </div>
          </div>

          {/* Reflective Questions for Student Self-Study */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Clinical Reflection Questions</h2>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                  1. Psychological Impact of Language:
                </span>
                How did {scenario.patientName}’s facial expression and pulse rate change when clinical jargon versus plain sensory words were used?
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                  2. Cultural & Health Literacy Awareness:
                </span>
                If an ESL patient nods repeatedly during discharge instructions, what communicative techniques will you use to verify true comprehension without patronizing them?
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Structured SBAR Clinical Report Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Standardized SBAR Record</h2>
              </div>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">Preceptor Verified</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-900 dark:text-teal-300 block mb-0.5">S · Situation</span>
                <p className="text-slate-700 dark:text-slate-300">{scenario.handoffTemplate.situation}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-900 dark:text-teal-300 block mb-0.5">B · Background</span>
                <p className="text-slate-700 dark:text-slate-300">{scenario.handoffTemplate.background}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-900 dark:text-teal-300 block mb-0.5">A · Assessment</span>
                <p className="text-slate-700 dark:text-slate-300">{scenario.handoffTemplate.assessment}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-900 dark:text-teal-300 block mb-0.5">R · Recommendation</span>
                <p className="text-slate-700 dark:text-slate-300">{scenario.handoffTemplate.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Switch Scenarios Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Practice Another Standardized Case:
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onSwitchScenario('elena-dizziness')}
                className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col transition-colors ${
                  scenario.id === 'elena-dizziness'
                    ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-200 font-medium'
                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="font-bold">Elena Vance (34yo) · Community Clinic</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Dizziness, Orthostatic vitals & fall prevention</span>
              </button>

              <button
                onClick={() => onSwitchScenario('arthur-chest')}
                className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col transition-colors ${
                  scenario.id === 'arthur-chest'
                    ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-200 font-medium'
                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="font-bold">Arthur Pendelton (62yo) · Urgent Care</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Chest tightness, Explaining 12-lead ECG</span>
              </button>

              <button
                onClick={() => onSwitchScenario('amina-postop')}
                className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col transition-colors ${
                  scenario.id === 'amina-postop'
                    ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-200 font-medium'
                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="font-bold">Amina Patel (28yo) · Surgical Floor</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Post-Op Day 1, Pain hesitancy & Incentive Spirometer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
