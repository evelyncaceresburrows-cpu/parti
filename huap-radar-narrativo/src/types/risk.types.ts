export interface RiskBreakdown {
  alcance: number;
  carga_emocional: number;
  severidad_claim: number;
  credibilidad_emisor: number;
  velocidad_difusion: number;
  riesgo_fisico_asociado: number;
}

export interface RiskScore {
  irn: number;
  nivel: 'bajo' | 'medio' | 'alto' | 'critico';
  breakdown: RiskBreakdown;
}
