import { ClassificationResult } from '../types/agent.types.js';
import { RiskScore } from '../types/risk.types.js';
import { NormalizedSignal } from '../types/signal.types.js';

export class RiskAgent {
  score(signal: NormalizedSignal, classification: ClassificationResult): RiskScore {
    const text = signal.text.toLowerCase();
    const breakdown = {
      alcance: /viral|masivo/.test(text) ? 18 : 10,
      carga_emocional: /agresi[oó]n|violencia|amenaza/.test(text) ? 18 : 9,
      severidad_claim: classification.criticidad_inicial === 'alta' ? 18 : 10,
      credibilidad_emisor: signal.source_type === 'news' ? 16 : 12,
      velocidad_difusion: signal.source_type === 'social' ? 16 : 9,
      riesgo_fisico_asociado: /agresi[oó]n|armas|ataque/.test(text) ? 20 : 8
    };

    const irn = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0));
    const nivel: RiskScore['nivel'] = irn >= 80 ? 'critico' : irn >= 60 ? 'alto' : irn >= 40 ? 'medio' : 'bajo';

    return { irn, nivel, breakdown };
  }
}
