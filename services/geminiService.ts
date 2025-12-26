
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-3-flash-preview';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  const prompt = `
You are an expert clinical diagnostic AI specializing exclusively in mammography and breast ultrasound analysis.

CRITICAL INSTRUCTION: 
1. First, determine if the provided image is a medical breast scan (Mammogram or Breast Ultrasound).
2. IF the image is NOT a medical breast scan, you MUST set "diagnosis" to "Invalid".
3. IF the image is a valid breast scan, proceed with diagnosis: "Malignant" or "Benign".

JSON Output Schema Requirements:
- diagnosis: "Malignant", "Benign", or "Invalid".
- confidence: Decimal (0.0 to 1.0). If Invalid, set to 0.0.
- limeExplanation: Detailed paragraph explaining local features or why the image was rejected.
- shapExplanation: Array of top 3 contributing factors (e.g., "Density", "Margins"). Empty if Invalid.
- gradCamRegion: Normalized {x, y, r} for ROI. For Invalid, set all to 0.
`;

  try {
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            limeExplanation: { type: Type.STRING },
            shapExplanation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            gradCamRegion: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                r: { type: Type.NUMBER },
              },
              required: ['x', 'y', 'r'],
            },
          },
          required: ['diagnosis', 'confidence', 'limeExplanation', 'shapExplanation', 'gradCamRegion'],
        },
      },
    });

    const result: AnalysisResult = JSON.parse(response.text.trim());
    return result;
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('AI analysis failed. The system requires a clear medical scan image.');
  }
};

export const continueChatStream = async (
  analysisContext: AnalysisResult,
  history: ChatMessage[],
  newMessage: string
) => {
  const systemInstruction = `You are an expert oncology assistant. Provide clinical follow-up based on this analysis: ${JSON.stringify(analysisContext)}. If the analysis was Invalid, explain that the system only processes mammograms or ultrasound scans.`;
  
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model,
    history: formattedHistory,
    config: { systemInstruction },
  });

  const resultStream = await chat.sendMessageStream({ message: newMessage });
  return resultStream;
};
