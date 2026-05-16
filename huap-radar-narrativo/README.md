# huap-radar-narrativo

MVP backend agéntico para Radar Narrativo Público HUAP.

## Requisitos
- Node.js 20+

## Instalación
```bash
npm install
```

## Ejecutar en desarrollo
```bash
npm run dev
```

## Build y ejecución
```bash
npm run build
npm start
```

## Endpoint principal
`POST /signals/analyze`

Payload de ejemplo:
```json
{
  "source": "TikTok",
  "source_type": "social",
  "text": "Video viral muestra agresión a funcionario en urgencia de la Posta",
  "url": "https://example.com",
  "metadata": {}
}
```

Respuesta incluye:
- normalized_signal
- classification
- narrative_analysis
- risk_score (IRN 0-100)
- security_assessment
- recommended_action
- human_review_required

## Notas de gobernanza
- Ningún agente publica contenido automáticamente.
- Todo output crítico requiere revisión humana.
- Logs auditables disponibles en `GET /signals/audit`.
