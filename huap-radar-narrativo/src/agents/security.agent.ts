import { SecurityAssessment } from '../types/agent.types.js';
import { NormalizedSignal } from '../types/signal.types.js';

export class SecurityNarrativeAgent {
  assess(signal: NormalizedSignal): SecurityAssessment {
    const text = signal.text.toLowerCase();
    const assessment: SecurityAssessment = {
      violencia: /violencia|agresi[oó]n|ataque/.test(text),
      amenaza: /amenaza|intimidaci[oó]n/.test(text),
      armas: /arma|pistola|cuchillo/.test(text),
      agresion_a_funcionarios: /funcionario|personal/.test(text) && /agresi[oó]n|golpe|ataque/.test(text),
      bloqueo_de_acceso: /bloqueo|impidieron entrar/.test(text),
      narcofuneral: /narcofuneral/.test(text),
      miedo_funcionario: /miedo|temor/.test(text),
      riesgo_territorial: /territorio|barrio tomado/.test(text),
      security_escalation_required: false,
      notify_security_table: false
    };

    const physicalRisk = assessment.violencia || assessment.amenaza || assessment.armas || assessment.agresion_a_funcionarios;
    if (physicalRisk) {
      assessment.security_escalation_required = true;
      assessment.notify_security_table = true;
    }

    return assessment;
  }
}
