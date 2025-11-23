import { GoogleGenAI } from "@google/genai";
import { RoundResult, AIAdvice, PriceStrategy } from "../types";
import { PRICES } from "../constants";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getConsultantAdvice = async (
  result: RoundResult,
  nextEventTitle: string
): Promise<AIAdvice> => {
  const ai = getAIClient();
  
  if (!ai) {
    return {
      analysis: "API Key fehlt. Bitte konfigurieren Sie den Key, um den KI-Berater zu nutzen.",
      tips: ["Prüfen Sie Ihre Kostenstruktur.", "Investieren Sie antizyklisch."]
    };
  }

  const prompt = `
    Du bist ein erfahrener Unternehmensberater für Startups. Analysiere die Ergebnisse der letzten Runde (Jahr ${result.round}) für das Team.
    
    **Daten der letzten Runde:**
    - Ereignis: ${result.event.title} (${result.event.description})
    - Gewinn: ${result.profit} EUR
    - Kontostand: ${result.cumulativeCapital} EUR
    - Absatz: ${result.sales} Stück (Geplant waren: ${result.decisions.plannedSales})
    - Preis: ${PRICES[result.decisions.priceStrategy]} EUR
    - Mitarbeiter: ${result.decisions.hiringDelta > 0 ? 'Aufgebaut' : result.decisions.hiringDelta < 0 ? 'Abgebaut' : 'Gehalten'}
    - Innovation Level: ${result.innovationLevel.toFixed(1)}
    - Bekanntheit: ${result.awarenessLevel.toFixed(1)}
    
    **Vorschau nächste Runde:**
    - Das nächste Ereignis könnte "${nextEventTitle}" sein (oder ähnlich, dies ist ungewiss).

    Bitte gib kurzes, prägnantes Feedback.
    1. Eine kurze Analyse (max 2 Sätze) über die Performance.
    2. Drei konkrete, kurze Handlungsempfehlungen für die nächste Runde (Bullet Points).
    
    Format: JSON
    {
      "analysis": "string",
      "tips": ["string", "string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as AIAdvice;
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      analysis: "Der KI-Berater ist momentan nicht erreichbar.",
      tips: ["Achten Sie auf Ihre Liquidität.", "Versuchen Sie, Innovation und Marketing auszubalancieren."]
    };
  }
};