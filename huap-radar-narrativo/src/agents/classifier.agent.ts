import { ClassificationResult } from '../types/agent.types.js';
import { NormalizedSignal } from '../types/signal.types.js';

export class ClassifierAgent {
  classify(signal: NormalizedSignal): ClassificationResult {
    const text = signal.text.toLowerCase();
    const hasAggression = /agresi[oó]n|violencia|ataque/.test(text);
    const hasUrgency = /urgencia|hospital|posta/.test(text);

    return {
      tema: hasUrgency ? 'salud pública' : 'opinión pública',
      emocion_dominante: hasAggression ? 'indignación' : 'preocupación',
      frame_narrativo: hasAggression ? 'deterioro de seguridad en servicios públicos' : 'alerta comunitaria',
      criticidad_inicial: hasAggression ? 'alta' : 'media'
    };
  }
}
