---
title: "De un agente a un equipo: Cómo funcionan los subagentes de OpenClaw"
description: "Un investigador de Anthropic gastó 20.000 $ para que 16 agentes Claude paralelos escribieran un compilador de C. El sistema de subagentes de OpenClaw te permite ejecutar la misma arquitectura para tu informe matutino, por unos 0,03 $. Aquí te explicamos cómo."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 min"
tags: ["OpenClaw", "Sub-Agents", "Agent Teams", "Parallel Agents", "sessions_spawn", "Claude Code"]
featured: false
---

---

# De un agente a un equipo: Cómo funcionan los subagentes de OpenClaw — Y lo que el experimento del compilador de $20K de Anthropic nos dice sobre el futuro

**En febrero, un investigador de Anthropic gastó $20.000 para dejar que

---

Este mes, el investigador de Anthropic Nicholas Carlini publicó un experimento que se parece menos a la ingeniería de software y más a la evolución biológica.

Le encargó a 16 instancias de Claude Opus 4.6 que trabajaran en paralelo durante dos semanas. Generaron casi 2.000 sesiones de codificación, consumieron 2 mil millones de tokens de entrada y costaron poco menos de 20.000 dólares en tarifas de API.

---

¿El resultado? Un compilador de C de 100.000 líneas basado en Rust, escrito desde cero, capaz de compilar el kernel de Linux 6.9 para las arquitecturas x86, ARM y RISC-V. Incluso ejecuta Doom.

Esto no fue una demostración de un nuevo y reluciente botón «Crear App». Fue un prototipo de investigación en bruto construido con las primitivas de coordinación más básicas: un contenedor Docker por agente, un repositorio git compartido y bloqueos de archivos — sin orquestador central, sin intermediario de mensajes.

---

La mayoría de nosotros no tenemos $20,000 para gastar en llamadas a la API esta semana. Pero el patrón arquitectónico que usó Carlini —descomponer un objetivo masivo en tareas paralelas para agentes independientes— es exactamente para lo que está diseñado el sistema de **Subag

---

## Primero: Aclaremos la confusión

Hay tres conceptos "multiagente" circulando en la comunidad ahora mismo. Suenan similares, pero son herramientas completamente diferentes.

---

| Concepto | Qué es | Dónde se usa |
|---|---|---|
| **Equipos de Agentes de Claude Code** | Una función experimental en la herramienta CLI `claude` de Anthropic. Permite a los miembros del equipo enviarse mensajes directamente a través de un sistema de "Buzón" (Mailbox). | **Claude Code** (herramienta de codificación, fase Alfa) |
| **Experimento del Compilador de $20K** | El prototipo de investigación de Nicholas Carlini. Utilizaba repositorios git básicos y bloqueos de archivos para la coordinación — sin un orquestador central, sin interfaz de chat. | **Artículo de Investigación** (no es un producto) |
| **Subagentes de OpenClaw** | La herramienta integrada `sessions_spawn` de OpenClaw. Un agente principal despacha tareas a agentes trabajadores en segundo plano, los cuales informan al terminar. | **OpenClaw** (agente de propósito general) |

---

**Este artículo trata sobre los Subagentes de OpenClaw.** Es el único de los tres que está listo para producción para tareas de automatización generales a día de hoy.

---

---

## Cómo funcionan los Subagentes de OpenClaw

En lugar de que un único agente haga todo de forma secuencial, un "Agente Principal" genera "Subagentes" para realizar el trabajo en segundo plano.

---

Agente Principal (Profundidad 0)
    │
    ├── sessions_spawn(tarea="Investigar competidor A")
    │       └── Subagente A (Profundidad 1, sesión aislada)
    │               └── trabajo... trabajo... → anuncia los resultados
    │
    ├── sessions_spawn(tarea="Investigar competidor B")
    │       └── Subagente B (Profundidad 1, sesión aislada)
    │               └── trabajo... trabajo... → anuncia los resultados
    │
    └── Recibe los resultados → Sintetiza el informe final

### Comportamientos Clave

---

1.  **No bloqueante:** El comando `sessions_spawn` devuelve un `runId` inmediatamente. El Agente Principal puede seguir trabajando o generar más agentes sin esperar.
2.  **Aislamiento de contexto:** Cada Sub-Agente se ejecuta en su propia sesión nueva. No heredan el historial de chat del Agente Principal. Esto mantiene sus ventanas de contexto limpias y enfocadas.
3.  **Memoria selectiva:** Los Sub-Agentes inyectan `AGENTS.md` y `TOOLS.md`, pero **no** `SOUL.md`, `IDENTITY.md` o `USER.md`. Son trabajadores efímeros, no asistentes personalizados.
4.  **Concurrencia:** Por defecto, un solo agente puede generar hasta 5 hijos activos. El sistema limita la concurrencia global a 8 para evitar los límites de tasa de la API.

---

### El Comando

La herramienta es `sessions_spawn`. Ten en cuenta que el nombre del parámetro es `task`, no `instruction`.

```javascript
sessions_spawn({
  task: "Search for the latest HackerNews AI headlines and return top 5",
  model: "gpt-4o-mini",         // Usa un modelo más económico para el trabajador
  runTimeoutSeconds: 120,       // Límite de seguridad
  label: "news-fetcher",        // Para tus registros
  cleanup: "delete"             // Auto-eliminar la sesión al terminar
})
```

---

---

## Cuatro Arquitecturas del Mundo Real

### Patrón 1: Coordinador + Trabajadores (El más común)

Este es el patrón estándar para la investigación o el procesamiento por lotes.

```
Agente Principal (Coordinador)
  ├── Trabajador A: Investigar el modelo de precios de Notion
  ├── Trabajador B: Investigar el modelo de precios de Linear
  └── Trabajador C: Investigar el modelo de precios de Monday.com
El Agente Principal combina los resultados en una tabla comparativa de precios.
```

---

**Por qué funciona:** Si hicieras esto secuencialmente, la ventana de contexto del Agente Principal se llenaría con HTML en bruto de tres páginas de precios diferentes. Al paralelizar, cada Trabajador procesa los datos en bruto y devuelve solo el resumen estructurado.

**Modelo de Trabajador recomendado:** `gpt-4o-mini` o `gemini-2.5-flash` (bajo costo).

### Patrón 2: El Pipeline

---

Subagente 1: Extraer datos brutos (habilidad de búsqueda web)
      ↓
Subagente 2: Limpiar y estructurar datos (habilidad de razonamiento)
      ↓
Subagente 3: Generar percepciones (habilidad de análisis)
      ↓
Agente Principal: Formatear para la entrega

**Por qué funciona:** Aísla las partes "desordenadas" del proceso. El agente que realiza el análisis de alto valor nunca ve la basura de HTML en bruto del paso 1.

### Patrón 3: Enrutamiento Especializado

En lugar de un agente generalista, el Agente Principal actúa como un enrutador.

---

Agente Principal (Enrutador)
  ├── "Programar una reunión"   → Agente especialista en Google Calendar
  ├── "Redactar un correo electrónico"       → Agente especialista en redacción
  └── "Investigar este tema"  → Agente especialista en búsqueda web

**Consejo profesional:** Dado que los Subagentes no cargan `SOUL.md`, deberías poner tu lógica de enrutamiento en `AGENTS.md`.

---

## Reglas de Enrutamiento de AGENTS.md

Al enrutar tareas a subagentes:
- Solicitudes de calendario: generar con las habilidades google-calendar y google-workspace
- Solicitudes de investigación: generar con la habilidad web-search, usar el modelo g

---

**Secuencial (Forma antigua):** Consultar el tiempo (5 s) → Consultar el calendario (5 s) → Revisar el correo electrónico (10 s) → Revisar las noticias (10 s) → Resumir (5 s). Total: **~35

---

El tiempo total se determina por el agente más lento (~15 s) + la síntesis (5 s) = **~20 segundos.**

---

---

## Estrategia Crítica de Costos: "Jefe Inteligente, Pasantes Baratos"

El mayor riesgo con los Subagentes es la multiplicación de costos. Si generas 5 agentes y todos usan Claude Opus 4.6, acabas de multiplicar tu factura de API por 5.

La solución es la asignación explícita de modelos.

**El Jefe (Agente Principal):** Necesita una alta capacidad de razonamiento para descomponer tareas y sintetizar resultados.
*   **Modelo:** `anthropic/claude-opus-4-6` o `claude-sonnet-4-6`

---

**Los Pasantes (Trabajadores):** Suelen realizar tareas claras y acotadas (resume esto, encuentra aquello).
*   **Modelo:** `openai/gpt-4o-mini` o `google/gemini-2.5-flash`

Puedes establecer este valor predeterminado en tu configuración para evitar accidentes:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "openai/gpt-4o-mini",
        "maxSpawnDepth": 1,
        "maxChildrenPerAgent": 5
      }
    }
  }
}
```

---

---

## Avanzado: El patrón de orquestador (Profundidad 2)

Por defecto, OpenClaw establece `maxSpawnDepth: 1`, lo que significa que un Sub-Agente no puede generar sus propios Sub-Agentes.

Para proyectos complejos, puedes habilitar la Profundidad 2:

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

Esto habilita una jerarquía de tres niveles:

---

Agente Principal (CEO)
  └── Agente Orquestador (Gerente) — Tiene permiso sessions_spawn
        ├── Trabajador A (Pasante) — No puede generar
        ├── Trabajador B (Pasante)
        └── Trabajador C (Pasante)

Esto refleja la estructura del experimento del compilador de 20.000 $: se establece un objetivo de alto nivel, una entidad autónoma gestiona el desglose y los trabajadores individuales ejecutan las piezas.

---

---

## OpenClaw vs. Equipos de Agentes Claude Code

Ambos existen. ¿Cuál deberías usar realmente?

---

| Característica | Subagentes de OpenClaw | Equipos de agentes de Claude Code |
| :--- | :--- | :--- |
| **Público objetivo** | Automatización general (correo electrónico, investigación, operaciones) | Codificación e ingeniería de software |
| **Comunicación** | Hub-and-spoke (los trabajadores informan al principal) | Malla (los compañeros de equipo se envían mensajes entre sí) |
| **Madurez** | Característica lista para producción | Alfa / Experimental |
| **Configuración** | Integrado, no requiere configuración | Requiere editar `settings.json` |
| **Contexto** | Independiente por agente | Independiente por agente |

---

Si estás construyendo un compilador, usa Claude Code. Si estás construyendo un asistente personal o un flujo de trabajo empresarial, usa OpenClaw.

---

---

## Limitaciones Prácticas

---

1.  **Comunicación Unidireccional:** Los Subagentes solo pueden comunicarse de vuelta con su padre. No pueden consultar al padre para pedir aclaraciones a mitad de la tarea.
2.  **Sin `SOUL.md`:** Recuerda, los Subagentes son pizarras en blanco. Si quieres que tengan una personalidad o reglas de comportamiento específicas, debes incluir esas instrucciones en el prompt de la `task` o en `AGENTS.md`.
3.  **Límites de Concurrencia:** No intentes generar 50 agentes a la vez. Alcanzarás los límites de tasa de la API instantáneamente. El límite predeterminado es de 8 sesiones concurrentes.

---

---

## Si no quieres gestionar esto: TinyClaw

Gestionar arquitecturas de agentes en paralelo, configurar `maxSpawnDepth` y monitorizar los costos de tokens en múltiples modelos es complejo.

[TinyClaw](https://tinyclaw.dev) simplifica esto:

*   **

---

Gestionar un equipo de agentes no tiene por qué costar $20,000. Empieza con un informe matutino.

→ [tinyclaw.dev](https://tinyclaw.dev) · Empieza gratis · Tu equipo de agentes funcionando en 60 segundos

---

*