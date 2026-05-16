import { Router } from 'express';

export const alertsRouter = Router();

alertsRouter.get('/', (_req, res) => {
  res.json({
    message: 'No hay publicación automática. Todas las alertas requieren revisión humana.',
    human_in_the_loop: true
  });
});
