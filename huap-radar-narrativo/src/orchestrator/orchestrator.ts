import { CollectorAgent } from '../agents/collector.agent.js';
import { ClassifierAgent } from '../agents/classifier.agent.js';
import { NarrativeAgent } from '../agents/narrative.agent.js';
import { RiskAgent } from '../agents/risk.agent.js';
import { SecurityNarrativeAgent } from '../agents/security.agent.js';
import { AuditService } from '../services/audit.service.js';
import { SupabaseService } from '../services/supabase.service.js';
import { PipelineResult } from '../types/agent.types.js';
import { IncomingSignalInput } from '../types/signal.types.js';

export class Orchestrator {
  constructor(
    private readonly collector = new CollectorAgent(),
    private readonly classifier = new ClassifierAgent(),
    private readonly narrative = new NarrativeAgent(),
    private readonly risk = new RiskAgent(),
    private readonly security = new SecurityNarrativeAgent(),
    private readonly audit = new AuditService(),
    private readonly supabase = new SupabaseService()
  ) {}

  async analyzeSignal(input: IncomingSignalInput): Promise<PipelineResult> {
    const normalized_signal = this.collector.collect(input);
    const classification = this.classifier.classify(normalized_signal);
    const narrative_analysis = this.narrative.analyze(normalized_signal, classification);
    const risk_score = this.risk.score(normalized_signal, classification);
    const security_assessment = this.security.assess(normalized_signal);

    const human_review_required = true;
    const recommended_action = security_assessment.security_escalation_required
      ? 'Escalar a mesa de seguridad y activar protocolo interno con revisión humana inmediata.'
      : 'Monitorear narrativa y validar con analista humano antes de cualquier acción.';

    const result: PipelineResult = {
      normalized_signal,
      classification,
      narrative_analysis,
      risk_score,
      security_assessment,
      recommended_action,
      human_review_required
    };

    this.audit.record('signal.analyzed', result);
    await this.supabase.saveAnalysis(result);
    return result;
  }

  getAuditTrail() {
    return this.audit.list();
  }
}
