import { ClassificationResult, NarrativeAnalysis } from '../types/agent.types.js';
import { NormalizedSignal } from '../types/signal.types.js';
import { LlmService } from '../services/llm.service.js';

export class NarrativeAgent {
  constructor(private readonly llm = new LlmService()) {}

  analyze(signal: NormalizedSignal, classification: ClassificationResult): NarrativeAnalysis {
    return {
      narrativa_emergente: `Se instala una narrativa de ${classification.frame_narrativo}.`,
      frame_dominante: classification.frame_narrativo,
      actores: ['funcionarios', 'usuarios', signal.source],
      resumen_ejecutivo: this.llm.summarize(signal.text)
    };
  }
}
