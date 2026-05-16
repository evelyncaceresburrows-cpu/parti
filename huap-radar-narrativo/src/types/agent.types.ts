import { NormalizedSignal } from './signal.types.js';
import { RiskScore } from './risk.types.js';

export interface ClassificationResult {
  tema: string;
  emocion_dominante: string;
  frame_narrativo: string;
  criticidad_inicial: 'baja' | 'media' | 'alta' | 'critica';
}

export interface NarrativeAnalysis {
  narrativa_emergente: string;
  frame_dominante: string;
  actores: string[];
  resumen_ejecutivo: string;
}

export interface SecurityAssessment {
  violencia: boolean;
  amenaza: boolean;
  armas: boolean;
  agresion_a_funcionarios: boolean;
  bloqueo_de_acceso: boolean;
  narcofuneral: boolean;
  miedo_funcionario: boolean;
  riesgo_territorial: boolean;
  security_escalation_required: boolean;
  notify_security_table: boolean;
}

export interface PipelineResult {
  normalized_signal: NormalizedSignal;
  classification: ClassificationResult;
  narrative_analysis: NarrativeAnalysis;
  risk_score: RiskScore;
  security_assessment: SecurityAssessment;
  recommended_action: string;
  human_review_required: boolean;
}
