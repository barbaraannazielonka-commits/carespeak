import React from 'react';
import {
  Stethoscope,
  Heart,
  Volume2,
  Mic,
  Languages,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Users,
  Compass,
  GraduationCap,
  Activity,
  Smile,
  Clock,
  BookOpen
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioId } from '../types/simulation';

interface IntroTabProps {
  onStartScenario: (scenarioId: ScenarioId) => void;
  onNavigateTab: (tab: 'simulation' | 'phrasebook' | 'dejargonizer' | 'debrief') => void;
}

export const IntroTab: React.FC<IntroTabProps> = ({
  onStartScenario,
  onNavigateTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Nannestad High School · Barbara Anna Zielonka
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span>Healthcare Communication Lab</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            English for Healthcare Communication & Patient-Centered Care
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A standardized-patient simulation designed for healthcare students who need to communicate with patients in English. Practice taking focused histories, de-jargoning medical terms, explaining physical procedures before touching, and calming patient anxiety through authentic spoken role-play.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartScenario('elena-dizziness')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-all shadow-sm hover:shadow"
            >
              <span>Launch Standardized Case (Elena Vance)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('phrasebook')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Explore Audio Phrasebook</span>
            </button>

            <button
              onClick={() => onNavigateTab('dejargonizer')}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Languages className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>De-Jargonizer Dictionary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Section: What This Simulation Is All About */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
              Curriculum Foundation
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              What This Simulation Is All About
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              1. Who It Is For
            </span>
            <p className="text-xs leading-relaxed">
              Designed specifically for <strong>healthcare and nursing students</strong> who need to communicate with patients in English. Whether preparing for international hospital placements or caring for non-native speaking patients, students practice building genuine rapport, showing bedside empathy, and speaking clearly under clinical pressure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              2. How It Works (The Role-Play Game)
            </span>
            <p className="text-xs leading-relaxed">
              Students step directly into the shoes of the nurse at the patient's bedside. In short, structured stages, you choose what to say and what actions to take. The virtual patient responds in real time—their emotional state, dialogue, and <strong>vital signs (blood pressure, heart rate, oxygen)</strong> dynamically rise or stabilize based on how reassuring and clear your English is.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Mic className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              3. Spoken Practice with Audio
            </span>
            <p className="text-xs leading-relaxed">
              Communication cannot be learned by silent reading alone. Students can click <strong>"Listen Model"</strong> to hear clear clinical pronunciation at adjustable speeds (`0.8×` to `1.0×`), and use the <strong>"Practice Mic"</strong> or speech evaluation tools to speak sentences aloud and receive instant word-by-word accuracy scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Purpose & Clinical Communication Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              The Purpose of This Simulation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In clinical settings, miscommunication is one of the leading causes of preventable patient anxiety, non-compliance, and medical errors. Healthcare trainees frequently default to textbook medical terminology (e.g. <em>"orthostatic hypotension"</em>, <em>"incentive spirometry"</em>) that intimidates vulnerable patients and leaves them feeling alienated.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The primary purpose of this simulation is to provide a <strong>risk-free training ground</strong> where students learn to:
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-4">
              <li><strong>Explain procedures before physical contact:</strong> Always describe sensations (e.g. <em>"a snug squeeze on your arm"</em>) and obtain consent before touching.</li>
              <li><strong>De-jargonize medical language:</strong> Translate diagnostic terms into plain, comforting everyday English.</li>
              <li><strong>Verify patient understanding with Teach-Back:</strong> Confirm comprehension without asking patronizing closed questions.</li>
              <li><strong>Synthesize findings into SBAR reports:</strong> Deliver crisp, professional handoffs to supervising physicians.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/50 text-xs text-teal-900 dark:text-teal-200 space-y-1">
            <span className="font-bold block">
              Core Educational Target:
            </span>
            <p>
              Transforming clinical knowledge into compassionate, patient-centered spoken English that builds trust, lowers patient blood pressure, and ensures safe healthcare delivery.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center text-sky-700 dark:text-sky-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              How to Practice Speaking & Using the Mic
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every dialogue option features interactive speech tools so students can build genuine vocal fluency:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-800 dark:text-teal-400 block mb-0.5">
                  1. Listen Model (Audio Playback)
                </span>
                Click the "Listen" button on any phrase to hear natural clinical pronunciation at your chosen pace (`0.8×` deliberate or `1.0×` standard).
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-800 dark:text-teal-400 block mb-0.5">
                  2. Practice Mic (Voice Recognition)
                </span>
                Click "Practice Mic" and speak into your device. If your browser asks for microphone access, click <strong>Allow</strong> in the address bar lock icon.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-800 dark:text-teal-400 block mb-0.5">
                  3. Instant Fallback (No Hardware Mic Needed)
                </span>
                If microphone permission is restricted in your browser or iframe, you can click <strong>"I Spoke This Aloud"</strong> or type what you said to test phrasing and receive full word-by-word feedback!
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900/50 text-xs text-sky-900 dark:text-sky-200">
            <span className="font-bold block mb-0.5">💡 Quick Tip for Students:</span>
            Always practice saying the sentence out loud before submitting your choice to train your muscle memory and vocal pacing!
          </div>
        </div>
      </div>


      {/* 5 Core Learning Competencies */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            5 Core Clinical Communication Competencies
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every simulation stage assesses your mastery of these evidence-based healthcare communication standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. AIDET Introduction */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Smile className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. AIDET Protocol</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Acknowledge, Introduce, Duration, Explanation, Thank you.</strong> Confirm two patient identifiers and establish psychological safety before beginning any assessment.
            </p>
          </div>

          {/* 2. Procedural Consent */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Procedural Pre-Explanation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Always describe the physical sensory feeling (e.g., <em>"a firm, snug squeeze for twenty seconds"</em>) and ask explicit consent before touching the patient.
            </p>
          </div>

          {/* 3. Medical De-Jargoning */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Languages className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. De-Jargoning Health Literacy</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Strip away intimidating Latinate terms. Replace <em>orthostatic hypotension</em> with <em>temporary blood pressure dip when standing</em> to prevent catastrophic patient fear.
            </p>
          </div>

          {/* 4. Teach-Back Method */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. The Teach-Back Method</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Never ask <em>"Do you understand?"</em> (patients nod yes even when confused). Ask: <em>"In your own words, could you walk me through the steps you will take when getting out of bed?"</em>
            </p>
          </div>

          {/* 5. SBAR Handoff */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <FileCheck2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">5. Standardized SBAR Handoff</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Synthesize findings cleanly for supervising doctors and preceptors using <strong>Situation, Background, Assessment, and Recommendation</strong>.
            </p>
          </div>

          {/* 6. Empathetic De-escalation */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Heart className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">6. Trauma-Informed Empathy</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Validate patient emotions immediately (<em>"Anyone would feel frightened when the room starts spinning"</em>) to stimulate vagal calming and reduce tachycardia.
            </p>
          </div>
        </div>
      </div>

      {/* Standardized Patient Cases Showcase */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Available Standardized Clinical Encounters
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a clinical role-play scenario to begin your clinical simulation session:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-teal-400 dark:hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={sc.patientImage}
                    alt={sc.patientName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded font-medium">
                    {sc.id === 'elena-dizziness' ? 'Community Clinic' : sc.id === 'arthur-chest' ? 'Urgent Care' : 'Inpatient Surgery'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {sc.patientName}, {sc.patientAge}yo
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {sc.setting}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    <strong>Concern:</strong> {sc.chiefComplaint}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Learning Focus:
                    </span>
                    <p>
                      {sc.id === 'elena-dizziness' && 'Orthostatic vitals, fasting & dehydration, Teach-Back fall prevention.'}
                      {sc.id === 'arthur-chest' && 'De-escalating cardiac panic, explaining 12-lead ECG & blood tests.'}
                      {sc.id === 'amina-postop' && 'Post-op pain hesitancy, incentive spirometry milkshake analogy.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onStartScenario(sc.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors shadow-xs"
                >
                  <span>Start Role-Play Encounter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Educational Attribution Footer Card */}
      <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-teal-950 dark:text-teal-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-teal-900 dark:text-teal-100 block text-xs uppercase tracking-wider">
              Educational Scope & Institution Attribution
            </span>
            <p className="text-teal-800 dark:text-teal-300 leading-relaxed max-w-3xl">
              Curriculum framework designed for healthcare education at <strong>Nannestad High School</strong> by <strong>Barbara Anna Zielonka</strong>. All cases and clinical telemetry are fictional and created exclusively for communication training, empathy modeling, and health literacy education.
            </p>
          </div>
        </div>

        <button
          onClick={() => onStartScenario('elena-dizziness')}
          className="px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg whitespace-nowrap shrink-0 transition-colors"
        >
          Begin Simulation
        </button>
      </div>
    </div>
  );
};
