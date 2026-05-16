import express from 'express';
import { env } from './config/env.js';
import { signalsRouter } from './routes/signals.routes.js';
import { alertsRouter } from './routes/alerts.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/signals', signalsRouter);
app.use('/alerts', alertsRouter);

app.listen(env.PORT, () => {
  console.log(`HUAP Radar Narrativo MVP escuchando en puerto ${env.PORT}`);
});
