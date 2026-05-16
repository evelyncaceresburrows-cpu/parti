import { IncomingSignalInput, NormalizedSignal } from '../types/signal.types.js';

export class CollectorAgent {
  collect(input: IncomingSignalInput): NormalizedSignal {
    return {
      id: `sig-${Date.now()}`,
      source: input.source.trim(),
      source_type: input.source_type,
      text: input.text.trim(),
      timestamp: new Date().toISOString(),
      url: input.url ?? null,
      metadata: input.metadata ?? {}
    };
  }
}
