import React from 'react';
import { Stethoscope, RotateCcw, Volume2, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'intro' | 'simulation' | 'phrasebook' | 'dejargonizer' | 'debrief';
  setActiveTab: (tab: 'intro' | 'simulation' | 'phrasebook' | 'dejargonizer' | 'debrief') => void;
  onResetEncounter: () => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  scenarioName: string;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetEncounter,
  audioSpeed,
  setAudioSpeed,
  scenarioName,
  isDark,
  setIsDark,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('intro');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
            >
              CareSpeak
            </a>
            <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-600">·</span>
            <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
              {scenarioName}
            </span>
          </div>

          {/* Zone 2: clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('intro')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'intro'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-300'
              }`}
            >
              Overview & Purpose
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'simulation'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-300'
              }`}
            >
              Simulation Encounter
            </button>
            <button
              onClick={() => setActiveTab('phrasebook')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'phrasebook'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-300'
              }`}
            >
              Audio Phrasebook
            </button>
            <button
              onClick={() => setActiveTab('dejargonizer')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dejargonizer'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-300'
              }`}
            >
              De-Jargonizer
            </button>
            <button
              onClick={() => setActiveTab('debrief')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'debrief'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-300'
              }`}
            >
              Clinical Debrief
            </button>
          </nav>

          {/* Zone 3: 1 primary action button & speed toggle & dark mode toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Speed toggle for ESL learners */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Speed:</span>
              <button
                onClick={() => setAudioSpeed(0.8)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  audioSpeed === 0.8
                    ? 'bg-white dark:bg-slate-700 font-bold text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Slower speech rate for language learners"
              >
                0.8×
              </button>
              <button
                onClick={() => setAudioSpeed(1.0)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  audioSpeed === 1.0
                    ? 'bg-white dark:bg-slate-700 font-bold text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Standard speech rate"
              >
                1.0×
              </button>
            </div>

            <button
              onClick={onResetEncounter}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
              title="Restart simulation from Stage 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset Case</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar for smaller screens */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-2 py-1 ${activeTab === 'intro' ? 'text-teal-700 dark:text-teal-400 font-bold border-b border-teal-600 dark:border-teal-400' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-2 py-1 ${activeTab === 'simulation' ? 'text-teal-700 dark:text-teal-400 font-bold border-b border-teal-600 dark:border-teal-400' : ''}`}
          >
            Simulation
          </button>
          <button
            onClick={() => setActiveTab('phrasebook')}
            className={`px-2 py-1 ${activeTab === 'phrasebook' ? 'text-teal-700 dark:text-teal-400 font-bold border-b border-teal-600 dark:border-teal-400' : ''}`}
          >
            Phrasebook
          </button>
          <button
            onClick={() => setActiveTab('dejargonizer')}
            className={`px-2 py-1 ${activeTab === 'dejargonizer' ? 'text-teal-700 dark:text-teal-400 font-bold border-b border-teal-600 dark:border-teal-400' : ''}`}
          >
            De-Jargon
          </button>
          <button
            onClick={() => setActiveTab('debrief')}
            className={`px-2 py-1 ${activeTab === 'debrief' ? 'text-teal-700 dark:text-teal-400 font-bold border-b border-teal-600 dark:border-teal-400' : ''}`}
          >
            Debrief
          </button>
        </div>
      </div>
    </header>
  );
};
