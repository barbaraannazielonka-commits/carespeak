import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Lightbulb,
  FileCheck2,
  BookOpen,
  VolumeX,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';
import { DialogueChoice, SimulationStage, LogEntry } from '../types/simulation';
import { speakText, stopSpeaking, VoiceRecognizer, evaluateSpokenText, SpeechMatchResult } from '../utils/audio';

interface DialogueConsoleProps {
  currentStage: SimulationStage;
  onSelectChoice: (choice: DialogueChoice) => void;
  audioSpeed: number;
  lastFeedback: {
    choice: DialogueChoice;
    patientReply: string;
    patientEmotion: string;
  } | null;
  onProceedNextStage: () => void;
  isLastStage: boolean;
  onOpenDebrief: () => void;
  patientName: string;
  patientAge: number;
  patientPersona: string;
  chiefComplaint: string;
  vitals: any;
  conversationHistory: any[];
  onCustomAiResponse: (reply: string, emotion: string, rapportDelta: number, feedbackTip: string) => void;
}

export const DialogueConsole: React.FC<DialogueConsoleProps> = ({
  currentStage,
  onSelectChoice,
  audioSpeed,
  lastFeedback,
  onProceedNextStage,
  isLastStage,
  onOpenDebrief,
  patientName,
  patientAge,
  patientPersona,
  chiefComplaint,
  vitals,
  conversationHistory,
  onCustomAiResponse,
}) => {
  const [playingChoiceId, setPlayingChoiceId] = useState<string | null>(null);
  const [practicingChoiceId, setPracticingChoiceId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechMatchResult | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [manualPracticeText, setManualPracticeText] = useState('');

  // Free-form AI patient mode
  const [isAiFreeMode, setIsAiFreeMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const recognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    // Stop any ongoing speech when stage changes
    stopSpeaking();
    recognizerRef.current?.stop();
    setPlayingChoiceId(null);
    setPracticingChoiceId(null);
    setSpeechResult(null);
    setMicError(null);
    setIsRecording(false);
  }, [currentStage.id]);

  // Audio Playback
  const handlePlayModelAudio = async (choiceId: string, text: string) => {
    if (playingChoiceId === choiceId) {
      stopSpeaking();
      setPlayingChoiceId(null);
      return;
    }

    setPlayingChoiceId(choiceId);
    await speakText(text, {
      rate: audioSpeed,
      voiceType: 'nurse',
      onEnd: () => setPlayingChoiceId(null),
    });
  };

  // Practice Speaking with Mic
  const handleStartPracticeMic = (choice: DialogueChoice) => {
    if (isRecording && practicingChoiceId === choice.id) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setPracticingChoiceId(choice.id);
    setSpeechResult(null);
    setSpokenTranscript('');
    setMicError(null);
    setManualPracticeText('');
    setIsRecording(true);

    const recognizer = new VoiceRecognizer(
      (transcript) => {
        setSpokenTranscript(transcript);
        const evaluation = evaluateSpokenText(transcript, choice.studentPhrase);
        setSpeechResult(evaluation);
        setMicError(null);
      },
      (err) => {
        console.warn('Speech error:', err);
        setMicError(err);
        setIsRecording(false);
      },
      (listening) => {
        setIsRecording(listening);
      }
    );

    recognizerRef.current = recognizer;
    recognizer.start();
  };

  // Self-check or simulated speech test
  const handleSimulatePractice = (choice: DialogueChoice) => {
    setIsRecording(false);
    setMicError(null);
    setSpokenTranscript(choice.studentPhrase);
    const evaluation = evaluateSpokenText(choice.studentPhrase, choice.studentPhrase);
    setSpeechResult(evaluation);
  };

  // Check manual typed text against target
  const handleCheckManualPractice = (choice: DialogueChoice) => {
    if (!manualPracticeText.trim()) return;
    setIsRecording(false);
    setSpokenTranscript(manualPracticeText.trim());
    const evaluation = evaluateSpokenText(manualPracticeText.trim(), choice.studentPhrase);
    setSpeechResult(evaluation);
    setMicError(null);
  };

  // Free-form custom AI patient message submit
  const handleSendCustomMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!customInput.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientAge,
          patientPersona,
          chiefComplaint,
          currentStage: currentStage.title,
          studentMessage: customInput.trim(),
          conversationHistory,
          vitals,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach AI patient');
      }

      const data = await res.json();
      const reply = data.patientReply || 'Thank you for explaining that clearly.';
      const emotion = data.patientEmotion || 'Attentive';
      const delta = typeof data.rapportDelta === 'number' ? data.rapportDelta : 5;
      const feedback = data.pedagogicalFeedback?.coachingTip || 'Good patient communication attempt.';

      onCustomAiResponse(reply, emotion, delta, feedback);

      // Play patient response audio
      speakText(reply, {
        rate: audioSpeed,
        voiceType: 'patient-female',
      });

      setCustomInput('');
    } catch (err: any) {
      console.warn('AI patient error, falling back:', err);
      setAiError('Could not connect to AI service. Using standard simulation choices below.');
      // Fallback
      onCustomAiResponse(
        `Thank you for saying that. My dizziness is starting to settle down, but could you tell me what you are doing next?`,
        'Calmer, attentive',
        5,
        'Good open communication.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {currentStage.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Communication Focus:</span> {currentStage.communicationFocus}
          </p>
        </div>

        {/* Free-form AI mode toggle */}
        <button
          onClick={() => setIsAiFreeMode(!isAiFreeMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isAiFreeMode
              ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 font-semibold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{isAiFreeMode ? 'Standard Choices' : 'Free AI Speech Mode'}</span>
        </button>
      </div>

      {/* Free-form AI Roleplay Dialogue Input */}
      {isAiFreeMode ? (
        <div className="space-y-4 mb-4 p-4 rounded-xl bg-teal-50/40 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-teal-950 dark:text-teal-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                Speak or Type Freely to {patientName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Practice explaining your next nursing action in your own words. The AI patient will react authentically in character and provide pedagogical feedback on your phrasing!
              </p>
            </div>
          </div>

          <form onSubmit={handleSendCustomMessage} className="space-y-3">
            <div className="relative">
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`e.g., "Elena, I am going to wrap this blood pressure cuff around your arm to see how your body handles standing up..."`}
                rows={3}
                className="w-full text-sm p-3 rounded-lg border border-teal-300 dark:border-teal-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Tip: Speak in plain English, explain procedures before touching, and ask consent.
              </span>

              <button
                type="submit"
                disabled={!customInput.trim() || isAiLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Patient responding...</span>
                  </>
                ) : (
                  <>
                    <span>Speak to Patient</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            {aiError && <p className="text-xs text-amber-700 dark:text-amber-400">{aiError}</p>}
          </form>
        </div>
      ) : null}

      {/* Pedagogical Feedback Drawer (if last choice made) */}
      {lastFeedback && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Decision Feedback & Clinical Impact
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Patient Emotion: <strong className="text-slate-800 dark:text-slate-200">{lastFeedback.patientEmotion}</strong>
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{patientName} responded: </span>
              <span className="italic text-slate-800 dark:text-slate-200">"{lastFeedback.patientReply}"</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-teal-800 dark:text-teal-400">Why this matters: </strong>
              {lastFeedback.choice.clinicalTip}
            </p>

            {lastFeedback.choice.deJargonNote && (
              <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">De-Jargoning Guidance: </span>
                {lastFeedback.choice.deJargonNote}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            {isLastStage ? (
              <button
                onClick={onOpenDebrief}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Complete Encounter & View Debrief</span>
              </button>
            ) : (
              <button
                onClick={onProceedNextStage}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
              >
                <span>Proceed to Next Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Structured Dialogue Choices */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Available Communication Options:
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {currentStage.choices.map((choice) => {
            const isPlaying = playingChoiceId === choice.id;
            const isPracticing = practicingChoiceId === choice.id;

            return (
              <div
                key={choice.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 transition-all bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850 flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{choice.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                      {choice.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Student Phrase */}
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    "{choice.studentPhrase}"
                  </p>
                </div>

                {/* Speech Practice Visualizer if student is practicing this choice */}
                {isPracticing && (
                  <div className="p-3.5 bg-teal-50/90 dark:bg-slate-800/90 rounded-lg border border-teal-200 dark:border-teal-700/80 text-xs space-y-3 animate-in fade-in transition-all">
                    {/* Header with status and close */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                            </span>
                            <span className="font-bold text-rose-800 dark:text-rose-300">
                              Recording... Speak into your mic
                            </span>
                            {/* Animated audio wave bars */}
                            <div className="flex items-center gap-0.5 ml-1">
                              <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                              <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                            </div>
                          </div>
                        ) : speechResult ? (
                          <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            Speech Evaluation Result:
                          </span>
                        ) : micError ? (
                          <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            Microphone Notice:
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Pronunciation Trainer:
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {speechResult && (
                          <span
                            className={`px-2 py-0.5 rounded font-bold font-mono-numbers text-xs ${
                              speechResult.matchPercentage >= 85
                                ? 'bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200'
                                : speechResult.matchPercentage >= 65
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                                : 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200'
                            }`}
                          >
                            {speechResult.matchPercentage}% Match
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            recognizerRef.current?.stop();
                            setIsRecording(false);
                            setPracticingChoiceId(null);
                            setSpeechResult(null);
                            setMicError(null);
                          }}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                          title="Close practice mode"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Target prompt guidance while recording */}
                    {isRecording && (
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-rose-200 dark:border-rose-900/50 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                          Say this phrase aloud now:
                        </span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          "{choice.studentPhrase}"
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Speak at a calm, reassuring nursing pace.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              recognizerRef.current?.stop();
                              setIsRecording(false);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                          >
                            Finished Speaking
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Real-time transcribed text */}
                    {spokenTranscript && !isRecording && (
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Your Spoken Words:
                        </span>
                        <p className="italic text-slate-800 dark:text-slate-200 mt-0.5">
                          "{spokenTranscript}"
                        </p>
                      </div>
                    )}

                    {/* Word-by-word evaluation breakdown */}
                    {speechResult && (
                      <div className="space-y-1.5 p-2.5 bg-white dark:bg-slate-900 rounded border border-teal-200 dark:border-teal-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                          Word Match Accuracy:
                        </span>
                        <div className="flex flex-wrap gap-1 text-[11px]">
                          {speechResult.wordFeedback.map((wf, wIdx) => (
                            <span
                              key={wIdx}
                              className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                wf.matched
                                  ? 'bg-teal-100 dark:bg-teal-900 text-teal-950 dark:text-teal-100 font-semibold'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                              }`}
                            >
                              {wf.word}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                          {speechResult.coachingNote}
                        </p>
                      </div>
                    )}

                    {/* Helpful Error Notice & Instant Self-Practice Options */}
                    {micError && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900 text-xs space-y-2.5">
                        <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                          {micError}
                        </p>

                        <div className="pt-1 border-t border-amber-200 dark:border-amber-800/60 space-y-2">
                          <span className="font-bold text-amber-950 dark:text-amber-300 block text-[11px] uppercase tracking-wider">
                            Choose an alternative practice method:
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Option 1: Speak Aloud & Score */}
                            <button
                              type="button"
                              onClick={() => handleSimulatePractice(choice)}
                              className="px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>I Spoke This Aloud (Test Fluency)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartPracticeMic(choice)}
                              className="px-2.5 py-1.5 rounded bg-amber-200/80 hover:bg-amber-300 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-medium transition-colors"
                            >
                              Retry Microphone
                            </button>
                          </div>

                          {/* Option 2: Type or dictate */}
                          <div className="pt-1 flex items-center gap-1.5">
                            <input
                              type="text"
                              value={manualPracticeText}
                              onChange={(e) => setManualPracticeText(e.target.value)}
                              placeholder="Or type/paste what you spoke to score phrasing..."
                              className="flex-1 text-xs px-2.5 py-1.5 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleCheckManualPractice(choice);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleCheckManualPractice(choice)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Score</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* Actions: Listen, Practice Mic, and Select */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {/* Listen Audio */}
                    <button
                      type="button"
                      onClick={() => handlePlayModelAudio(choice.id, choice.studentPhrase)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isPlaying
                          ? 'bg-teal-700 dark:bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title="Listen to native model pronunciation"
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                          <span>Listen Model ({audioSpeed}×)</span>
                        </>
                      )}
                    </button>

                    {/* Microphone Practice */}
                    <button
                      type="button"
                      onClick={() => handleStartPracticeMic(choice)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isPracticing && isRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title="Record your voice to test pronunciation and fluency"
                    >
                      {isPracticing && isRecording ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                          <span>Practice Mic</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Select & Speak to Patient */}
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      onSelectChoice(choice);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Say This to Patient</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
