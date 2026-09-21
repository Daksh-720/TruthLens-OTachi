// TruthLens Gemini AI & Instant Forensic Integration Service
// Delivers sub-10ms deterministic verification with optional cloud enrichment

import {
  verifyInstantaneously,
  inspectImageBinary,
  evaluateTextForensic,
  evaluateMediaForensic
} from './instantForensicEngine';

export { verifyInstantaneously, inspectImageBinary, evaluateTextForensic, evaluateMediaForensic };

// Production Gemini flash models
const MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

export function getActiveApiKey() {
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('TRUTHLENS_GEMINI_KEY') : null;
  if (localKey && localKey.trim()) return localKey.trim();
  
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();

  return '';
}

export function setActiveApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('TRUTHLENS_GEMINI_KEY', key.trim());
    } else {
      localStorage.removeItem('TRUTHLENS_GEMINI_KEY');
    }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SYSTEM_PROMPT = `
You are an expert misinformation detection and forensic fact-checking AI for TruthLens.
Analyze claims using rigorous evidence-based reasoning. Accuracy is paramount.

RULES:
1. IDENTIFY THE CLAIM: Dissect core assertions from opinions or satire.
2. VERDICT SELECTION: Must be one of: "GENUINE", "MISLEADING", "FAKE", "POTENTIALLY MANIPULATED".
3. CREDIBILITY SCORE: An integer from 0 to 100:
   - 75-100: Strongly supported / highly credible.
   - 45-74: Partially supported, misleading context, or mixed truth.
   - 0-44: Weakly supported, fabricated, or demonstrably contradicted.
4. STRUCTURED RESPONSE:
   Return ONLY valid JSON matching this schema:
   {
     "verdict": "GENUINE | MISLEADING | FAKE | POTENTIALLY MANIPULATED",
     "credibilityScore": 75,
     "explanation": "Clear, concise forensic rationale of the conclusion.",
     "actualFacts": ["List of verifiable factual components supported by evidence"],
     "falseClaims": ["List of false or misleading statements identified"],
     "evidence": ["Evidence cross-referencing primary documents, registries, or consensus"],
     "sources": ["Accredited news or fact-check database (e.g., Reuters, AP News, Snopes, WHO)"]
   }
`;

/**
 * Instant-First Analysis Engine
 * Delivers sub-10ms response immediately.
 */
export async function analyzeWithGemini(claimText, mode = 'text', file = null, preferCloud = false) {
  // If instant mode is preferred (default), return high-accuracy result in 5-10ms
  if (!preferCloud) {
    return await verifyInstantaneously(claimText, mode, file);
  }

  // Cloud route if explicitly requested and key exists
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    return await verifyInstantaneously(claimText, mode, file);
  }

  let contentParts = [];
  if (mode === 'media' && file) {
    try {
      const base64Data = await fileToBase64(file);
      contentParts.push({
        inlineData: {
          mimeType: file.type || 'image/jpeg',
          data: base64Data
        }
      });
      contentParts.push({
        text: `${SYSTEM_PROMPT}\n\nExamine this media asset. Detect synthetic generation, tampering, or misleading framing.`
      });
    } catch {
      contentParts.push({
        text: `${SYSTEM_PROMPT}\n\nAnalyze claim related to image: ${claimText}`
      });
    }
  } else {
    contentParts.push({
      text: `${SYSTEM_PROMPT}\n\nCONTENT TO ANALYZE (${mode.toUpperCase()}):\n${claimText}`
    });
  }

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s max timeout guard

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: contentParts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      return {
        ...parsed,
        sourceModel: `Gemini Cloud (${model})`
      };
    } catch {
      // Continue to next model or instant fallback
    }
  }

  // Instant fallback guarantee
  return await verifyInstantaneously(claimText, mode, file);
}

// Built-in backward-compatible forensic fallback
export function generateForensicAnalysis(content) {
  return evaluateTextForensic(content, 'text');
}
