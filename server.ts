import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for standardized AI patient interaction & clinical communication evaluation
app.post('/api/patient-chat', async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientPersona,
      chiefComplaint,
      currentStage,
      studentMessage,
      conversationHistory,
      vitals,
    } = req.body;

    if (!studentMessage) {
      return res.status(400).json({ error: 'Student message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return smart simulated response if no key
      return res.json({
        patientReply: `Thank you for asking. As ${patientName}, I can tell you that my head is still swimming a bit, especially when I stood up this morning. Could you explain what you're checking next?`,
        patientEmotion: 'Attentive, mild anxiety',
        rapportDelta: 4,
        pedagogicalFeedback: {
          whatWentWell: 'You acknowledged the patient and asked an open question.',
          coachingTip: 'Remember to explain physical procedures (like blood pressure or looking into their eyes) before beginning.',
          plainEnglishEquivalent: 'Good use of straightforward language.',
        },
      });
    }

    const systemPrompt = `You are playing the standardized patient "${patientName}" (${patientAge} years old) in a clinical English educational simulation for nursing and healthcare students.
Patient Background & Condition:
${patientPersona}
Chief Complaint: ${chiefComplaint}
Current Stage of Clinical Encounter: ${currentStage}
Current Patient Vitals: Heart Rate ${vitals?.hr || 88} bpm, BP ${vitals?.bp || '104/66'}, SpO2 ${vitals?.spo2 || '98%'}, Glucose ${vitals?.glucose || '92 mg/dL'}.

YOUR DUAL ROLE:
1. Stay in character as ${patientName}. You speak in natural, everyday patient English (non-medical terminology). You feel slightly vulnerable, anxious, or dizzy as appropriate to the scenario. If the student uses dense medical jargon (e.g., "orthostatic hypotension", "auscultation", "NPO", "ambulate"), you act confused or ask them to explain in plain English. If the student speaks empathetically and clearly explains what they are doing, you feel reassured and express appreciation.
2. Provide brief, constructive pedagogical feedback to help the healthcare student improve their clinical English communication, empathy, and procedural explanations.

Respond strictly in JSON format with this structure:
{
  "patientReply": "Patient's direct verbal response in quotes (1-3 natural sentences)",
  "patientEmotion": "Short description of patient physical/emotional reaction (e.g. Relieved, Nodding with trust, Confused by medical terms)",
  "rapportDelta": number between -10 and +15 reflecting impact on patient trust,
  "pedagogicalFeedback": {
    "whatWentWell": "1 clear sentence praising student communication strengths (e.g. empathy, asking consent, avoiding jargon)",
    "coachingTip": "1 concise recommendation on clinical English phrasing or next clinical step",
    "plainEnglishEquivalent": "If student used jargon, give the patient-friendly alternative; otherwise leave as empty string or highlight key positive phrase"
  }
}`;

    const recentHistory = (conversationHistory || [])
      .slice(-4)
      .map((m: { role: string; content: string }) => `${m.role === 'student' ? 'Student Nurse' : patientName}: ${m.content}`)
      .join('\n');

    const prompt = `Conversation so far:
${recentHistory}

Student Nurse just said: "${studentMessage}"

Respond as ${patientName} and evaluate the student's communication in JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const replyText = response.text || '{}';
    const parsed = JSON.parse(replyText);
    return res.json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in patient-chat API:', error);
    return res.status(500).json({
      error: 'Failed to generate patient response',
      patientReply: "I'm sorry, I felt a slight wave of dizziness just now. Could you repeat that for me?",
      patientEmotion: 'Slightly fatigued',
      rapportDelta: 0,
      pedagogicalFeedback: {
        whatWentWell: 'Student attempted communication.',
        coachingTip: 'Maintain a calm tone and rephrase clearly if the patient is fatigued.',
        plainEnglishEquivalent: '',
      },
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`CareSpeak Simulation Server running on http://localhost:${port}`);
  });
}

startServer();
