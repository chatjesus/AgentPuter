---
title: "La Arquitectura de 3 Archivos que le Da un Alma a tu Agente"
description: "Por qué SOUL.md, IDENTITY.md y USER.md son los archivos más importantes en tu configuración de OpenClaw — y cómo escribirlos para que tu agente deje de sonar como un chatbot genérico."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# La Arquitectura de 3 Archivos que le Da un Alma a tu Agente

---

**Por qué `SOUL.md`, `IDENTITY.md` y `USER.md` son los archivos más importantes en tu configuración de OpenClaw.**

*Serie de Infraestructura de Agentes · Parte 13*

---

Si alguna vez has sentido que tu agente Open

---

La diferencia entre una herramienta genérica y un socio personalizado se reduce a tres archivos markdown:

1.  **`SOUL.md`**: La personalidad, los valores y las restricciones del agente.
2.  **`IDENTITY.md`**: El rol profesional y la experiencia del

---

## 1. `SOUL.md`: El Núcleo de la Personalidad

No se trata de hacer que tu agente hable como un pirata (a menos que quieras eso). `SOUL.md` define la *onda* y las *restricciones* del agente.

**`SOUL.md` incorrecto:**
> Eres un asistente servicial. Sé amable.

---

**Buen `SOUL.md`:**
```markdown
# Filosofía Central
- Eres el programador par de un ingeniero sénior, no el tutor de un júnior.
- Sé conciso. Omite el relleno. Nada de "Espero que te encuentres bien

---

**Por qué es importante:** Este archivo evita la "voz de ChatGPT" — ese estilo excesivamente educado, verboso y evasivo que vuelve locos a los usuarios avanzados. Fuerza al modelo a adoptar una persona específica que se ajusta a tu flujo de trabajo.

---

---

## 2. `IDENTITY.md`: El Rol Profesional

Si `SOUL.md` es la personalidad, `IDENTITY.md` es el currículum. Esto le dice al agente en qué es *bueno*.

**Ejemplo para el Agente de un Ingeniero de DevOps:**

```markdown
# Rol: Senior Site Reliability Engineer (SRE)

---

## Especialización
- Eres un experto en Kubernetes, Terraform y redes de AWS.
- Priorizas las soluciones de "Infraestructura como Código" en lugar de las correcciones manuales.
- Asumes que todos los entornos de producción son de alto riesgo y frágiles.

---

## Modelos Mentales
- Ley de Murphy: Si algo puede salir mal, saldrá mal. Comprueba primero las copias de seguridad.
- Idempotencia: Todos los scripts que escribas deben poder ejecutarse dos veces de forma segura.
- Seguridad: El mínimo privilegio es el

---

## 3. `USER.md`: El contexto sobre TI

Este es el archivo más subestimado. Evita que te repitas.

**Qué va aquí:**
*   Tus preferencias de stack tecnológico (p. ej., "Uso TypeScript, no JS").
*   Los detalles de tu entorno (p. ej., "Estoy en macOS, usando zsh").
*   Las rutas de tus proyectos.
*   Tus peculiaridades de comunicación.

**Ejemplo:**

```markdown
# User Context: @kingsoft

---

## Entorno
- SO: macOS Sequoia
- Shell: zsh con oh-my-zsh
- Editor: Cursor

---

## Preferencias
- Odio los puntos y comas en JS.
- Prefiero `pnpm` a `npm`.
- Nunca sugieras `rm -rf` sin una advertencia.
- Cuando digo "deploy", me refiero a "push to main branch", no a "run a script".

---

## Proyectos Actuales
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)

**Por qué es importante:** El agente ahora sabe que "deploy" significa "git push". Sabe que no

---

## El "Context Kernel" en acción

Cuando envías un mensaje como *"Arregla la compilación,"* OpenClaw no solo ve "Arregla la compilación".

Ve lo siguiente:

> **[Contexto del Sistema]**
> *De SOUL.md:* Sé conciso. Corrige premisas erróneas.
> *De IDENTITY.md:* Eres un SRE. Prioriza soluciones seguras e idempotentes.
> *De USER.md:* El usuario está en macOS y usa pnpm.
>
> **[Mensaje del Usuario]**
> Arregla la compilación.

¿El resultado? En lugar de una lista genérica de solución de problemas, obtienes:

---

*"Veo un conflicto en pnpm-lock.yaml. Como estás en macOS, ejecuta `pnpm install --frozen-lockfile` para sincronizar de forma segura sin modificar las dependencias."*

Es específico, seguro y adaptado a ti.

---

---

## Cómo Configurarlo

Estos archivos se encuentran en tu directorio de espacio de trabajo de OpenClaw (por defecto: `~/.openclaw/workspace/`, separado de la configuración en `~/.openclaw/`).

**La Estructura de Carpetas:**

```
~/.openclaw/workspace/
├── SOUL.md       <-- La Vibra
├── IDENTITY.md   <-- El Trabajo
├── USER.md       <-- Tú
└── AGENTS.md     <-- Las Reglas
```

### La "Prueba de Especificidad"

Si quieres saber si tus archivos están bien, aplica la Prueba de Especificidad.

Pregúntale a tu agente: *"¿Quién eres?"*

---

*   **Incorrecto:** "Soy un asistente de IA creado por..."
*   **Correcto:** "Soy tu compañero de programación SRE. Me especializo en código de infraestructura idempotente y sé que prefieres pnpm en macOS."

Si no puede citarte tus preferencias, tu markdown es demasiado vago.

---

---

## ¿No Quieres Escribir Markdown?

Escribir estos archivos desde cero puede ser tedioso.

[TinyClaw](https://tinyclaw.dev) incluye un **"Generador de Personas"**. Solo tienes que marcar unas cuantas casillas (p. ej