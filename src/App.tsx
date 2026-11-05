/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './data/scenarios';
import { Scenario, DialogueChoice, Vitals, LogEntry, RoomAction, ScenarioId } from './types/simulation';
import { Navbar } from './components/Navbar';
import { PatientStageView } from './components/PatientStageView';
import { DialogueConsole } from './components/DialogueConsole';
import { IntroTab } from './components/IntroTab';
import { PhrasebookTab } from './components/PhrasebookTab';
import { DeJargonizerTab } from './components/DeJargonizerTab';
import { DebriefTab } from './components/DebriefTab';
import { speakText, stopSpeaking } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'simulation' | 'phrasebook' | 'dejargonizer' | 'debrief'>('intro');
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>('elena-dizziness');
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Active scenario data
  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Simulation state
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [vitals, setVitals] = useState<Vitals>(currentScenario.initialVitals);
  const [rapportScore, setRapportScore] = useState<number>(55);
  const [lastRapportDelta, setLastRapportDelta] = useState<number | null>(null);
  const [patientEmotion, setPatientEmotion] = useState<string>('');
  const [encounterLog, setEncounterLog] = useState<LogEntry[]>([]);
  const [performedActionIds, setPerformedActionIds] = useState<string[]>([]);

  const [lastFeedback, setLastFeedback] = useState<{
    choice: DialogueChoice;
    patientReply: string;
    patientEmotion: string;
  } | null>(null);

  // Reset simulation when scenario changes or on manual reset
  const handleResetEncounter = (newScenarioId?: ScenarioId) => {
    stopSpeaking();
    const scenarioToUse = newScenarioId
      ? SCENARIOS.find((s) => s.id === newScenarioId) || SCENARIOS[0]
      : currentScenario;

    if (newScenarioId) {
      setSelectedScenarioId(newScenarioId);
    }
    setCurrentStageIndex(0);
    setVitals(scenarioToUse.initialVitals);
    setRapportScore(55);
    setLastRapportDelta(null);
    setPatientEmotion(scenarioToUse.stages[0]?.patientStateDescription || '');
    setEncounterLog([]);
    setPerformedActionIds([]);
    setLastFeedback(null);
  };

  // Switch scenario
  const handleSwitchScenario = (id: string) => {
    handleResetEncounter(id as ScenarioId);
    setActiveTab('simulation');
  };

  // When a dialogue choice is picked
  const handleSelectChoice = async (choice: DialogueChoice) => {
    // 1. Calculate new rapport
    const newRapport = Math.min(100, Math.max(10, rapportScore + choice.rapportDelta));
    setRapportScore(newRapport);
    setLastRapportDelta(choice.rapportDelta);
    setPatientEmotion(choice.patientEmotion);

    // 2. Update vitals if applicable
    if (choice.updatedVitals) {
      setVitals((prev) => ({
        ...prev,
        ...choice.updatedVitals,
      }));
    }

    // 3. Log the interaction
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stageTitle: currentScenario.stages[currentStageIndex]?.title || 'Encounter Step',
      studentSpoke: choice.studentPhrase,
      patientReplied: choice.patientResponse,
      patientEmotion: choice.patientEmotion,
      rapportChange: choice.rapportDelta,
      feedbackTip: choice.clinicalTip,
    };
    setEncounterLog((prev) => [...prev, newLog]);

    // 4. Set feedback
    setLastFeedback({
      choice,
      patientReply: choice.patientResponse,
      patientEmotion: choice.patientEmotion,
    });

    // 5. Speak patient response aloud so student hears patient's voice
    const voiceType =
      selectedScenarioId === 'arthur-chest' ? 'patient-male' : 'patient-female';
    await speakText(choice.patientResponse, {
      rate: audioSpeed,
      voiceType,
    });
  };

  // Custom AI patient response handler
  const handleCustomAiResponse = (
    reply: string,
    emotion: string,
    rapportDelta: number,
    feedbackTip: string
  ) => {
    const newRapport = Math.min(100, Math.max(10, rapportScore + rapportDelta));
    setRapportScore(newRapport);
    setLastRapportDelta(rapportDelta);
    setPatientEmotion(emotion);

    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stageTitle: `Free AI Dialogue (Stage ${currentStageIndex + 1})`,
      studentSpoke: '(Free Speech Input)',
      patientReplied: reply,
      patientEmotion: emotion,
      rapportChange: rapportDelta,
      feedbackTip,
    };
    setEncounterLog((prev) => [...prev, newLog]);
  };

  // Perform room supportive actions (water, chair recline, warm blanket)
  const handlePerformRoomAction = async (action: RoomAction) => {
    if (performedActionIds.includes(action.id)) return;

    setPerformedActionIds((prev) => [...prev, action.id]);
    const newRapport = Math.min(100, Math.max(10, rapportScore + action.rapportDelta));
    setRapportScore(newRapport);
    setLastRapportDelta(action.rapportDelta);

    if (action.vitalEffect) {
      setVitals((prev) => ({
        ...prev,
        ...action.vitalEffect,
      }));
    }

    setPatientEmotion(action.patientReaction);

    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      stageTitle: 'Nursing Care Action',
      studentSpoke: action.label,
      patientReplied: action.patientReaction,
      patientEmotion: 'Comforted and relieved',
      rapportChange: action.rapportDelta,
      feedbackTip: action.performedMessage,
    };
    setEncounterLog((prev) => [...prev, newLog]);

    // Speak patient response
    const voiceType = selectedScenarioId === 'arthur-chest' ? 'patient-male' : 'patient-female';
    await speakText(action.patientReaction, {
      rate: audioSpeed,
      voiceType,
    });
  };

  // Proceed to next stage
  const handleProceedNextStage = () => {
    stopSpeaking();
    setLastFeedback(null);
    if (currentStageIndex < currentScenario.stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    } else {
      setActiveTab('debrief');
    }
  };

  const currentStage =
    currentScenario.stages[currentStageIndex] ||
    currentScenario.stages[currentScenario.stages.length - 1];
  const isLastStage = currentStageIndex >= currentScenario.stages.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetEncounter={() => handleResetEncounter()}
        audioSpeed={audioSpeed}
        setAudioSpeed={setAudioSpeed}
        scenarioName={currentScenario.patientName}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'intro' && (
          <IntroTab
            onStartScenario={(id) => {
              handleResetEncounter(id);
              setActiveTab('simulation');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'simulation' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Scenario Selection Pill-free bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Active Patient Encounter:</span>
                <span className="text-teal-800 dark:text-teal-400 font-bold">{currentScenario.patientName}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="text-slate-600 dark:text-slate-400">{currentScenario.chiefComplaint.split('.')[0]}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 mr-1">Switch Case:</span>
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleResetEncounter(s.id)}
                    className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                      s.id === selectedScenarioId
                        ? 'bg-teal-700 dark:bg-teal-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s.patientName.split(' ')[0]} ({s.id === 'elena-dizziness' ? 'Dizziness' : s.id === 'arthur-chest' ? 'Chest tightness' : 'Post-op'})
                  </button>
                ))}
              </div>
            </div>

            {/* Two-Zone Sandbox Split Layout */}
            <div className="space-y-6">
              {/* Top / Left Zone: Patient Stage & Room Context */}
              <PatientStageView
                scenario={currentScenario}
                currentStageIndex={currentStageIndex}
                vitals={vitals}
                rapportScore={rapportScore}
                lastRapportDelta={lastRapportDelta}
                patientEmotion={patientEmotion}
                encounterLog={encounterLog}
                onPerformRoomAction={handlePerformRoomAction}
                performedActionIds={performedActionIds}
              />

              {/* Bottom / Right Zone: Dialogue Console & Audio Trainer */}
              <DialogueConsole
                currentStage={currentStage}
                onSelectChoice={handleSelectChoice}
                audioSpeed={audioSpeed}
                lastFeedback={lastFeedback}
                onProceedNextStage={handleProceedNextStage}
                isLastStage={isLastStage}
                onOpenDebrief={() => setActiveTab('debrief')}
                patientName={currentScenario.patientName}
                patientAge={currentScenario.patientAge}
                patientPersona={currentScenario.patientPersona}
                chiefComplaint={currentScenario.chiefComplaint}
                vitals={vitals}
                conversationHistory={encounterLog.map((l) => ({
                  role: 'student',
                  content: l.studentSpoke,
                }))}
                onCustomAiResponse={handleCustomAiResponse}
              />
            </div>
          </div>
        )}

        {activeTab === 'phrasebook' && (
          <PhrasebookTab
            audioSpeed={audioSpeed}
            setAudioSpeed={setAudioSpeed}
          />
        )}

        {activeTab === 'dejargonizer' && (
          <DeJargonizerTab audioSpeed={audioSpeed} />
        )}

        {activeTab === 'debrief' && (
          <DebriefTab
            scenario={currentScenario}
            rapportScore={rapportScore}
            encounterLog={encounterLog}
            onRestartScenario={() => handleResetEncounter()}
            onSwitchScenario={handleSwitchScenario}
          />
        )}
      </main>

      {/* Quiet Footer without ornamental engines or fake status telemetry */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">CareSpeak Clinical Simulation Lab</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Nannestad High School- Barbara Anna Zielonka</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('phrasebook')}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Audio Pronunciation Trainer
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('dejargonizer')}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              De-Jargonizer
            </button>
            <span aria-hidden="true">·</span>
            <span>Educational Use Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
