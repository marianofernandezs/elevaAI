# Career LinkedIn Copilot

MVP SaaS en español para profesionales que quieren mejorar su marca personal en LinkedIn, crear contenido útil y detectar brechas de habilidades para crecer en el mercado laboral.

## Stack

- React + Vite + TypeScript
- TailwindCSS
- React Router
- Supabase Auth / PostgreSQL / Storage
- Sentry
- Capa de IA desacoplada para OpenRouter, OpenAI, Anthropic o Gemini

## Qué incluye este MVP

- Landing page con propuesta de valor y CTA principal.
- Registro e inicio de sesión por email/password.
- Perfil profesional completo.
- Dashboard con posts, ideas, CV, skill gap y roadmap.
- Generador de posts LinkedIn.
- Generador de hooks.
- Reescritor de contenido.
- Biblioteca de posts con estados draft, published y archived.
- Upload de CV listo para integrarse con Supabase Storage.
- Skill Gap Analysis con score 0-100.
- Roadmap de upskilling a 30 días, 90 días y 6 meses.

## Estructura

```text
src/
  components/
  contexts/
  hooks/
  lib/
  pages/
  services/
  types/
  utils/
supabase/
  schema.sql
```

## Variables de entorno

Usa el archivo `.env.example` como base:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct

SENTRY_DSN=
```

## Instalación

```bash
pnpm install
pnpm dev
```

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta [`supabase/schema.sql`](/Users/mariano/Documents/Universidad/Noveno%20Semestre/TOP2-Desarrollo-De-Aplicaciones%20/elevaAI/supabase/schema.sql).
3. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Crea un bucket de Storage para CVs, por ejemplo `resumes`.

## IA

La app centraliza la generación en [`src/services/aiService.ts`](/Users/mariano/Documents/Universidad/Noveno%20Semestre/TOP2-Desarrollo-De-Aplicaciones%20/elevaAI/src/services/aiService.ts).

Notas importantes para producción:

- En el frontend actual existe fallback local para acelerar el MVP.
- La clave `OPENROUTER_API_KEY` no debe exponerse en cliente en un despliegue real.
- La siguiente iteración recomendada es mover la llamada al proveedor de IA a una Supabase Edge Function o backend serverless.
- La interfaz ya está desacoplada para cambiar proveedor sin tocar la UI.

## Sentry

Configura `SENTRY_DSN` para activar monitoreo de errores de frontend y servicios.

## Deploy en Vercel

1. Importa el repo en Vercel.
2. Configura las variables de entorno.
3. Mantén el rewrite definido en `vercel.json` para soportar React Router.
4. Despliega.

## Estado actual del MVP

- El frontend está funcional.
- Si no configuras Supabase, la autenticación cae en modo local para demo rápida.
- Si no configuras IA remota, las generaciones usan respuestas fallback para que el flujo siga operativo.
