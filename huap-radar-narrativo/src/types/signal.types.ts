export type SourceType = 'social' | 'news' | 'internal' | 'community';

export interface IncomingSignalInput {
  source: string;
  source_type: SourceType;
  text: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedSignal {
  id: string;
  source: string;
  source_type: SourceType;
  text: string;
  timestamp: string;
  url: string | null;
  metadata: Record<string, unknown>;
}
