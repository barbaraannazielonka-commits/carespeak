import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Clock,
  User,
  MapPin,
  Smile,
  ShieldAlert,
  ChevronRight,
  ListOrdered,
  Sparkles,
  CupSoda,
  BedDouble,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Scenario, Vitals, LogEntry, RoomAction } from '../types/simulation';

interface PatientStageViewProps {
  scenario: Scenario;
  currentStageIndex: number;
  vitals: Vitals;
  rapportScore: number;
  lastRapportDelta: number | null;
  patientEmotion: string;
  encounterLog: LogEntry[];
  onPerformRoomAction: (action: RoomAction) => void;
  performedActionIds: string[];
}

export const PatientStageView: React.FC<PatientStageViewProps> = ({
  scenario,
  currentStageIndex,
  vitals,
  rapportScore,
  lastRapportDelta,
  patientEmotion,
  encounterLog,
  onPerformRoomAction,
  performedActionIds,
}) => {
  const [showTimeline, setShowTimeline] = useState(false);

  const currentStage = scenario.stages[currentStageIndex] || scenario.stages[scenario.stages.length - 1];

  // Rapport status label
  const getRapportStatus = (score: number) => {
    if (score >= 80) return { label: 'High Therapeutic Trust', color: 'text-teal-700' };
    if (score >= 60) return { label: 'Receptive & Attentive', color: 'text-sky-700' };
    if (score >= 40) return { label: 'Anxious / Guarded', color: 'text-amber-700' };
    return { label: 'Distressed / Mistrustful', color: 'text-rose-700' };
  };

  const rapportInfo = getRapportStatus(rapportScore);

  return (
    <div className="space-y-4">
      {/* Simulation Case Meta Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">{scenario.studentRole}</span>
          <span aria-hidden="true">·</span>
          <span>{scenario.setting}</span>
          <span aria-hidden="true">·</span>
          <span>{scenario.learnerLevel}</span>
          <span aria-hidden="true">·</span>
          <span>Est. {scenario.estimatedDuration}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {scenario.patientName}, {scenario.patientAge}yo ({scenario.patientPronouns})
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Chief Complaint:</span> {scenario.chiefComplaint}
            </p>
          </div>

          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{showTimeline ? 'Hide Case Timeline' : `Timeline (${encounterLog.length} events)`}</span>
          </button>
        </div>

        {/* Stage Stepper Navigation Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>Encounter Progress: Stage {currentStageIndex + 1} of {scenario.stages.length}</span>
            <span className="text-teal-700 dark:text-teal-400 font-semibold">{currentStage.title.split(':')[0]}</span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-5 gap-1.5">
            {scenario.stages.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg.id} className="flex flex-col gap-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isPast
                        ? 'bg-teal-600 dark:bg-teal-500'
                        : isCurrent
                        ? 'bg-teal-500 dark:bg-teal-400 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] truncate hidden sm:block ${
                      isCurrent
                        ? 'font-bold text-teal-800 dark:text-teal-400'
                        : isPast
                        ? 'text-slate-600 dark:text-slate-400'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {idx + 1}. {stg.title.split(':')[1]?.trim() || stg.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Clinic Visual Stage Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Patient Portrait & Clinic Context (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between transition-colors">
          <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-slate-900 overflow-hidden">
            <img
              src={scenario.patientImage}
              alt={`${scenario.patientName} in clinic examination room`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-102"
            />
            {/* Soft subtle vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent pointer-events-none" />

            {/* In-scene patient state banner */}
            <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-medium text-teal-300 mb-1">
                <Smile className="w-4 h-4 text-teal-300" />
                <span>Patient Reaction: {patientEmotion || currentStage.patientStateDescription}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 bg-slate-900/60 backdrop-blur-xs p-2 rounded-md border border-white/10">
                "{currentStage.patientStateDescription}"
              </p>
            </div>
          </div>

          {/* Rapport & Therapeutic Alliance Meter */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Patient Rapport & Comfort
              </span>
              <div className="flex items-center gap-2">
                {lastRapportDelta !== null && lastRapportDelta !== 0 && (
                  <span
                    className={`text-xs font-bold transition-all ${
                      lastRapportDelta > 0 ? 'text-teal-700 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {lastRapportDelta > 0 ? `+${lastRapportDelta}` : `${lastRapportDelta}`}
                  </span>
                )}
                <span className={`font-bold ${rapportInfo.color}`}>
                  {rapportScore}% · {rapportInfo.label}
                </span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  rapportScore >= 70
                    ? 'bg-teal-600 dark:bg-teal-500'
                    : rapportScore >= 45
                    ? 'bg-sky-600 dark:bg-sky-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, rapportScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real-time Vitals & Nursing Interventions Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* EHR Clinical Vitals Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Clinical Vitals Monitor</h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Live Telemetry</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Blood Pressure */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Blood Pressure</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {vitals.bp}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  {vitals.positionNote || 'Sitting position'}
                </span>
              </div>

              {/* Heart Rate */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Heart Rate</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {vitals.hr} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">bpm</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Regular Sinus</span>
              </div>

              {/* Oxygen Saturation */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Oxygen (SpO2)</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers block mt-0.5">
                  {vitals.spo2}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Room Air (Ambient)</span>
              </div>

              {/* Temperature */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Temperature</span>
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers block mt-0.5 truncate">
                  {vitals.temp}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Afebrile</span>
              </div>

              {/* Blood Glucose (if available) */}
              {vitals.glucose !== undefined && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Capillary Blood Sugar</span>
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono-numbers">
                      {vitals.glucose} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mg/dL</span>
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">(Euglycemic · Normal range)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Room Care Interventions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Supportive Nursing Actions
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Click to perform</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {scenario.roomActions.map((action) => {
                const isPerformed = performedActionIds.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => onPerformRoomAction(action)}
                    disabled={isPerformed}
                    className={`p-2 rounded-lg text-left transition-all border text-xs flex flex-col justify-between min-h-[64px] ${
                      isPerformed
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-default'
                        : 'bg-white dark:bg-slate-800 hover:bg-teal-50/70 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 text-slate-800 dark:text-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold truncate">{action.label}</span>
                      {isPerformed && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                      {action.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Timeline of Encounter Events */}
      {showTimeline && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs animate-in fade-in duration-200 transition-colors">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Chronological Encounter Timeline
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{encounterLog.length} recorded interactions</span>
          </div>

          {encounterLog.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
              No dialogue events recorded yet. Select an opening phrase below to begin the consultation!
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {encounterLog.map((log, index) => (
                <div key={index} className="text-xs border-l-2 border-teal-500 pl-3 py-1 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{log.stageTitle}</span>
                    <span className="font-mono-numbers text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200">
                    <span className="font-semibold text-teal-800 dark:text-teal-400">Student: </span>
                    "{log.studentSpoke}"
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">{scenario.patientName}: </span>
                    "{log.patientReplied}"
                  </div>
                  {log.feedbackTip && (
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Learning point: </span>
                      {log.feedbackTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
