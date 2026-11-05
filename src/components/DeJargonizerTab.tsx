import React, { useState } from 'react';
import {
  Search,
  Languages,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { JARGON_TERMS } from '../data/dejargonizer';
import { JargonTerm } from '../types/simulation';
import { speakText, stopSpeaking } from '../utils/audio';

interface DeJargonizerTabProps {
  audioSpeed: number;
}

export const DeJargonizerTab: React.FC<DeJargonizerTabProps> = ({ audioSpeed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTermId, setPlayingTermId] = useState<string | null>(null);

  // Quiz / Practice Challenge state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const QUIZ_QUESTIONS = [
    {
      jargonSentence: "Nurse to patient: 'You need to be placed on strict NPO status starting at 2200 hours.'",
      patientPerception: "Patient wonders: 'What is NPO? Can I still have water? Am I being starved?'",
      options: [
        {
          text: "You must remain nil per os to prevent aspiration during sedation.",
          isCorrect: false,
          rationale: "Still uses Latin medical jargon ('nil per os', 'aspiration') which confuses non-medical patients.",
        },
        {
          text: "Starting at 10 PM tonight, we need your stomach completely empty. Please have nothing to eat or drink—not even water, gum, or mints—so you stay completely safe during your procedure tomorrow.",
          isCorrect: true,
          rationale: "Gold standard plain English: specifies exact time (10 PM), defines 'nothing' explicitly (including water/gum), and connects it to patient safety.",
        },
        {
          text: "Don't eat anything tonight because the doctor ordered it.",
          isCorrect: false,
          rationale: "Too vague: patients will often still drink tea or coffee without realizing it breaks fasting rules.",
        },
      ],
    },
    {
      jargonSentence: "Nurse to patient: 'Your bilateral pretibial edema is consistent with secondary dependent fluid retention.'",
      patientPerception: "Patient thinks: 'Edema?! Is my kidney failing or do I have a tumor?!'",
      options: [
        {
          text: "You have peripheral pitting edema on both extremities.",
          isCorrect: false,
          rationale: "Merely restates clinical diagnosis with more medical descriptors.",
        },
        {
          text: "You have mild swelling around both ankles—it is simply a little bit of extra fluid resting under the skin like a damp sponge. Putting your feet up on a stool will help it drain away comfortably.",
          isCorrect: true,
          rationale: "Reassuring, uses familiar analogy ('like a damp sponge'), and gives a practical action (elevating feet).",
        },
        {
          text: "Your legs are full of water because your blood vessels are leaking.",
          isCorrect: false,
          rationale: "Saying 'blood vessels are leaking' sounds catastrophic and frightening.",
        },
      ],
    },
    {
      jargonSentence: "Nurse to patient: 'We are monitoring you for acute orthostatic hypotension and syncopal episodes.'",
      patientPerception: "Patient panics: 'Is there something broken in my brain or heart valve?!'",
      options: [
        {
          text: "We want to see if gravity causes cerebral ischemia when you assume an erect posture.",
          isCorrect: false,
          rationale: "Alarmist language that triggers intense fear of strokes or fainting.",
        },
        {
          text: "Because you have been low on fluids today, your blood pressure dips a little when you stand up quickly, which makes you feel lightheaded. We will check it while sitting and standing to make sure you stay safe.",
          isCorrect: true,
          rationale: "Clear everyday physiology: connects dehydration to the temporary pressure dip and establishes a plan to keep them safe.",
        },
      ],
    },
  ];

  const filteredTerms = JARGON_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.medicalMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recommendedPlainEnglish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayAudio = async (term: JargonTerm) => {
    if (playingTermId === term.id) {
      stopSpeaking();
      setPlayingTermId(null);
      return;
    }

    setPlayingTermId(term.id);
    await speakText(term.examplePatientSentence, {
      rate: audioSpeed,
      voiceType: 'nurse',
      onEnd: () => setPlayingTermId(null),
    });
  };

  const handleSelectQuizOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (QUIZ_QUESTIONS[quizIndex].options[index].isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Languages className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Medical De-Jargoning & Health Literacy Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Clinical De-Jargonizer & Patient Translator
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Healthcare jargon frightens vulnerable patients and causes miscommunication. Use this reference to replace frightening Latin/Greek clinical terminology with warm, accessible English that empowers patients.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medical term (e.g. NPO, Edema)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Interactive De-Jargonizing Challenge Mini-Game */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive De-Jargoning Challenge
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Question {quizIndex + 1} of {QUIZ_QUESTIONS.length} · Score: {quizScore}/{QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div className="space-y-4">
          {/* Frightening Jargon sentence */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Jargon-Heavy Clinical Phrase:</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-amber-100 font-mono-numbers">
              {QUIZ_QUESTIONS[quizIndex].jargonSentence}
            </p>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 italic">
              {QUIZ_QUESTIONS[quizIndex].patientPerception}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              How would you translate this into compassionate, plain English?
            </h3>
            {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                    selectedOption === null
                      ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : isSelected && opt.isCorrect
                      ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-200 font-medium'
                      : isSelected && !opt.isCorrect
                      ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200'
                      : opt.isCorrect
                      ? 'bg-teal-50/40 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-300 font-medium'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-bold shrink-0 mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm">{opt.text}</p>
                    {showExplanation && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        <strong>Feedback: </strong> {opt.rationale}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuizQuestion}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors"
              >
                <span>Next Translation Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Clinical Terms Database ({filteredTerms.length} Terms)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sorted by common clinic usage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item) => {
            const isPlaying = playingTermId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.term}</h3>
                    </div>
                  </div>

                  {/* Why it worries patients */}
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
                    <span className="font-bold flex items-center gap-1 text-rose-950 dark:text-rose-100">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      Why it alarms patients:
                    </span>
                    <p className="mt-0.5 text-rose-800 dark:text-rose-300">{item.whyPatientsWorry}</p>
                  </div>

                  {/* Recommended Plain English Alternative */}
                  <div className="mt-2.5 p-3 rounded-lg bg-teal-50/70 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 space-y-1">
                    <span className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      Recommended Plain English:
                    </span>
                    <p className="text-teal-900 dark:text-teal-100 font-medium">{item.recommendedPlainEnglish}</p>
                  </div>

                  {/* Example Patient Sentence */}
                  <div className="mt-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Example Patient Explanation: </span>
                    <p className="italic text-slate-800 dark:text-slate-200 mt-0.5">"{item.examplePatientSentence}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Practice saying this example</span>
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
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                        <span>Listen ({audioSpeed}×)</span>
                      </>
                    )}
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
