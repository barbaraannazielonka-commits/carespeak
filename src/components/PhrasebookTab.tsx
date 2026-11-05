import React, { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PHRASEBOOK_CATEGORIES, PHRASEBOOK_ITEMS } from '../data/phrasebook';
import { PhraseItem } from '../types/simulation';
import { speakText, stopSpeaking, VoiceRecognizer, evaluateSpokenText, SpeechMatchResult } from '../utils/audio';

interface PhrasebookTabProps {
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
}

export const PhrasebookTab: React.FC<PhrasebookTabProps> = ({
  audioSpeed,
  setAudioSpeed,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Phrases');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  // Voice recording & scoring states
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscripts, setUserTranscripts] = useState<Record<string, string>>({});
  const [evaluationResults, setEvaluationResults] = useState<Record<string, SpeechMatchResult>>({});
  const [micErrors, setMicErrors] = useState<Record<string, string>>({});

  const recognizerRef = useRef<VoiceRecognizer | null>(null);

  const filteredItems = PHRASEBOOK_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Phrases' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clinicalPurpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayAudio = async (item: PhraseItem) => {
    if (playingPhraseId === item.id) {
      stopSpeaking();
      setPlayingPhraseId(null);
      return;
    }

    setPlayingPhraseId(item.id);
    await speakText(item.englishText, {
      rate: audioSpeed,
      voiceType: 'nurse',
      onEnd: () => setPlayingPhraseId(null),
    });
  };

  const handleToggleRecord = (item: PhraseItem) => {
    if (isRecording && activeRecordingId === item.id) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      return;
    }

    stopSpeaking();
    setActiveRecordingId(item.id);
    setIsRecording(true);
    setMicErrors((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });

    const recognizer = new VoiceRecognizer(
      (transcript) => {
        setUserTranscripts((prev) => ({ ...prev, [item.id]: transcript }));
        const result = evaluateSpokenText(transcript, item.englishText);
        setEvaluationResults((prev) => ({ ...prev, [item.id]: result }));
        setMicErrors((prev) => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      },
      (err) => {
        console.warn('Speech error:', err);
        setMicErrors((prev) => ({ ...prev, [item.id]: err }));
        setIsRecording(false);
      },
      (listening) => {
        setIsRecording(listening);
      }
    );

    recognizerRef.current = recognizer;
    recognizer.start();
  };

  const handleSimulateRecord = (item: PhraseItem) => {
    setIsRecording(false);
    setUserTranscripts((prev) => ({ ...prev, [item.id]: item.englishText }));
    const result = evaluateSpokenText(item.englishText, item.englishText);
    setEvaluationResults((prev) => ({ ...prev, [item.id]: result }));
    setMicErrors((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Clinical English Speech & Pronunciation Lab</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              High-Yield Patient Communication Phrasebook
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Listen to native clinical phrasing and practice speaking into your microphone to receive word-by-word accuracy scoring.
            </p>
          </div>

          {/* Speed & Stats */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Model Audio Speed:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAudioSpeed(0.8)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    audioSpeed === 0.8
                      ? 'bg-teal-700 dark:bg-teal-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  0.8× (ESL Pace)
                </button>
                <button
                  onClick={() => setAudioSpeed(1.0)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    audioSpeed === 1.0
                      ? 'bg-teal-700 dark:bg-teal-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  1.0× (Standard)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar & Category filter tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phrases, procedures, keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Tabs (Segmented control) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {PHRASEBOOK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 font-medium ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phrase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isPlaying = playingPhraseId === item.id;
          const isThisRecording = isRecording && activeRecordingId === item.id;
          const transcript = userTranscripts[item.id];
          const evaluation = evaluationResults[item.id];

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-teal-800 dark:text-teal-400">{item.title}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.category.replace(/^\d+\.\s*/, '')}</span>
                </div>

                {/* Spoken English Quote */}
                <p className="text-base font-medium text-slate-900 dark:text-white mt-2 leading-relaxed">
                  "{item.englishText}"
                </p>

                {/* Clinical Context & Rationale */}
                <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Clinical Purpose: </strong>
                    {item.clinicalPurpose}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-teal-800 dark:text-teal-400">Why it works: </strong>
                    {item.patientFriendlyWhy}
                  </p>
                  {item.jargonToAvoid && (
                    <p className="text-rose-700 dark:text-rose-400 font-medium pt-0.5">
                      ⚠️ {item.jargonToAvoid}
                    </p>
                  )}
                </div>

                {/* Active recording visualizer */}
                {isThisRecording && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                        </span>
                        <span className="font-bold text-rose-800 dark:text-rose-300">
                          Listening... Speak this phrase into your mic
                        </span>
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-rose-900 dark:text-rose-200 italic">
                      "{item.englishText}"
                    </p>
                  </div>
                )}

                {/* Helpful Microphone Error Notice & Quick Practice Options */}
                {micErrors[item.id] && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Microphone Notice</span>
                    </div>
                    <p className="text-amber-900 dark:text-amber-200 leading-relaxed text-[11px]">
                      {micErrors[item.id]}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200 dark:border-amber-800/60">
                      <button
                        type="button"
                        onClick={() => handleSimulateRecord(item)}
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Self-Check Fluency (Simulate)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleRecord(item)}
                        className="px-2 py-1 rounded bg-amber-200/80 hover:bg-amber-300 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-medium transition-colors"
                      >
                        Retry Mic
                      </button>
                    </div>
                  </div>
                )}

                {/* Speech Practice Result Box (if evaluated) */}
                {evaluation && (
                  <div className="mt-3 p-3 rounded-lg bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        Speech Evaluation Result:
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-xs ${
                          evaluation.matchPercentage >= 80
                            ? 'bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100'
                            : evaluation.matchPercentage >= 60
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                            : 'bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        {evaluation.matchPercentage}% Accuracy
                      </span>
                    </div>

                    {transcript && (
                      <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                        Recognized: "{transcript}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                      {evaluation.wordFeedback.map((wf, wIndex) => (
                        <span
                          key={wIndex}
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            wf.matched
                              ? 'bg-teal-200/80 dark:bg-teal-800 text-teal-950 dark:text-teal-100 font-medium'
                              : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 line-through'
                          }`}
                        >
                          {wf.word}
                        </span>
                      ))}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{evaluation.coachingNote}</p>
                  </div>
                )}

              </div>

              {/* Bottom interactive controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                <button
                  onClick={() => handlePlayAudio(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isPlaying
                      ? 'bg-teal-700 dark:bg-teal-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                      <span>Listen ({audioSpeed}×)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggleRecord(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isThisRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {isThisRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                      <span>Practice Mic</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
