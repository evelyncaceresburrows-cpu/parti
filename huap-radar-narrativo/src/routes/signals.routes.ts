import { Router } from 'express';
import { Orchestrator } from '../orchestrator/orchestrator.js';
import { IncomingSignalInput } from '../types/signal.types.js';

export const signalsRouter = Router();
const orchestrator = new Orchestrator();

signalsRouter.post('/analyze', async (req, res) => {
  const payload = req.body as IncomingSignalInput;
  if (!payload?.source || !payload?.source_type || !payload?.text) {
    return res.status(400).json({ error: 'source, source_type y text son obligatorios' });
  }

  const analysis = await orchestrator.analyzeSignal(payload);
  return res.json(analysis);
});

signalsRouter.get('/audit', (_req, res) => {
  res.json({ logs: orchestrator.getAuditTrail() });
});
