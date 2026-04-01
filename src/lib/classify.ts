import type { FactorId } from './types';
import { FACTORS } from './factors';

export interface ClassificationResult {
  factorId: FactorId;
  confidence: number;
}

export function classifyText(text: string): ClassificationResult {
  const scores: Record<FactorId, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (const factorId of [1, 2, 3, 4] as FactorId[]) {
    const factor = FACTORS[factorId];
    for (const keyword of factor.keywords) {
      if (text.includes(keyword)) {
        scores[factorId] += 1;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) {
    // Default to ありのままに (self-acceptance) as the most universal factor
    return { factorId: 4, confidence: 0 };
  }

  const topFactorId = (Object.entries(scores) as [string, number][])
    .sort(([, a], [, b]) => b - a)[0][0];

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = total > 0 ? maxScore / total : 0;

  return { factorId: Number(topFactorId) as FactorId, confidence };
}
