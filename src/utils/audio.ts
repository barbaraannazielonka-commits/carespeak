// Speech synthesis and Speech Recognition utilities for clinical English learning

export interface SpeechMatchResult {
  matchPercentage: number;
  spokenText: string;
  targetText: string;
  wordFeedback: Array<{
    word: string;
    matched: boolean;
  }>;
  coachingNote: string;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function speakText(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    voiceType?: 'nurse' | 'patient-female' | 'patient-male' | 'doctor';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      options.onEnd?.();
      return resolve();
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      activeUtterance = utterance;

      utterance.rate = options.rate ?? 0.95; // slightly deliberate for ESL healthcare students
      utterance.pitch = options.pitch ?? 1.0;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        if (options.voiceType === 'patient-male') {
          const maleVoice = englishVoices.find(v =>
            /david|george|male|guy|daniel|james/i.test(v.name)
          );
          if (maleVoice) utterance.voice = maleVoice;
        } else if (options.voiceType === 'patient-female') {
          const femaleVoice = englishVoices.find(v =>
            /zira|samantha|female|susan|karen|victoria/i.test(v.name)
          );
          if (femaleVoice) utterance.voice = femaleVoice;
        } else {
          // Nurse or doctor default - clear en-US or en-GB
          const preferred =
            englishVoices.find(v => /google|natural|premium|online/i.test(v.name)) ||
            englishVoices[0];
          if (preferred) utterance.voice = preferred;
        }
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        activeUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        activeUtterance = null;
        options.onError?.(e);
        options.onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      options.onEnd?.();
      resolve();
    }
  });
}

// Compare student speech with expected target phrase
export function evaluateSpokenText(spoken: string, target: string): SpeechMatchResult {
  const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const cleanTarget = target.toLowerCase().replace(/[^\w\s]/g, '').trim();

  const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
  const targetWords = cleanTarget.split(/\s+/).filter(Boolean);

  let matchedCount = 0;
  const wordFeedback: Array<{ word: string; matched: boolean }> = [];

  const spokenSet = new Set(spokenWords);

  for (const word of targetWords) {
    if (spokenSet.has(word)) {
      matchedCount++;
      wordFeedback.push({ word, matched: true });
    } else {
      // Check partial similarity (e.g. plurals, small typos)
      const isClose = spokenWords.some(w => {
        if (w.length >= 4 && (w.includes(word) || word.includes(w))) return true;
        return false;
      });
      if (isClose) {
        matchedCount += 0.8;
        wordFeedback.push({ word, matched: true });
      } else {
        wordFeedback.push({ word, matched: false });
      }
    }
  }

  const rawPercent = targetWords.length > 0 ? (matchedCount / targetWords.length) * 100 : 0;
  const matchPercentage = Math.min(100, Math.round(rawPercent));

  let coachingNote = '';
  if (matchPercentage >= 85) {
    coachingNote = 'Superb pronunciation and phrasing! Clear, calm, and reassuring pacing.';
  } else if (matchPercentage >= 65) {
    coachingNote = 'Good attempt! Notice the highlighted missing words. Try pausing slightly between sentences.';
  } else {
    coachingNote = 'Keep practicing! Listen to the model audio once more, focus on the keywords, and repeat.';
  }

  return {
    matchPercentage,
    spokenText: spoken,
    targetText: target,
    wordFeedback,
    coachingNote,
  };
}

export function getFriendlySpeechErrorMessage(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'permission-denied':
      return 'Microphone permission was denied. Please allow microphone access in your browser address bar (click the lock/tune icon next to the URL), or use the quick speech test options below.';
    case 'no-speech':
      return 'No voice was detected. Please try speaking closer to your microphone or check your mic volume.';
    case 'audio-capture':
      return 'No working microphone was found on your device. Please plug in or select a microphone in your system settings.';
    case 'network':
      return 'Speech service network issue. Please check your internet connection.';
    case 'not-supported':
      return 'Speech recognition is not supported in this browser (e.g., Firefox). You can use Chrome or Edge for live speech recognition, or use the interactive speech test tools below.';
    default:
      return error || 'Unable to access microphone in this browser window.';
  }
}

// Web Speech Recognition class wrapper
export class VoiceRecognizer {
  private recognition: any = null;
  public isListening = false;

  constructor(
    private onResult: (transcript: string) => void,
    private onError: (errorMsg: string) => void,
    private onStateChange: (listening: boolean) => void
  ) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListening = true;
            this.onStateChange(true);
          };

          this.recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }

            const current = finalTranscript || interimTranscript;
            if (current) {
              this.onResult(current);
            }
          };

          this.recognition.onerror = (event: any) => {
            this.isListening = false;
            this.onStateChange(false);
            const friendly = getFriendlySpeechErrorMessage(event.error);
            this.onError(friendly);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            this.onStateChange(false);
          };
        } catch (e: any) {
          console.warn('SpeechRecognition initialization error:', e);
          this.recognition = null;
        }
      }
    }
  }

  public start(): void {
    if (!this.recognition) {
      this.onError(getFriendlySpeechErrorMessage('not-supported'));
      return;
    }
    try {
      this.recognition.start();
    } catch (e: any) {
      console.warn('Recognition start error:', e);
      if (e?.name === 'InvalidStateError') {
        // Recognition already started
        return;
      }
      this.onError(getFriendlySpeechErrorMessage(e?.message || 'not-allowed'));
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
  }
}

