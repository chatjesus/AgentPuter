---
title: "Agent Skills: La App Store del mundo de la IA está tomando forma"
description: "Más de 170 mil Skills de código abierto, la capa Gateway que faltaba y por qué la plataforma de Agentes sigue la estrategia de Windows."
date: "2026-02-09"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["OpenClaw", "AI Agent", "Skills", "MCP", "Agent Gateway", "AgentPuter"]
featured: true
---

En nuestras dos primeras publicaciones, profundizamos en OpenClaw: qué es, cómo funciona su arquitectura Cerebro-Cuerpo-Alma y las lecciones de seguridad de los 1,100 puertos Gateway expuestos.

Pero hay algo que mencionamos repetidamente sin explicarlo del todo: los **Skills**.

OpenClaw viene con más de 100 Skills integrados. Anthropic convirtió los Skills en un estándar abierto. SkillsMP ya aloja más de 170,000 Skills de código abierto.

Esas cifras plantean una pregunta más importante:

**¿Qué son exactamente los Skills? ¿Cómo se relacionan con MCP? ¿Y es este realmente el "momento App Store" del mundo de la IA?**

Vamos a aclarar esto.

---

## I. El problema básico que resuelven los Skills

Cuando le pides a ChatGPT que haga algo, ¿cómo aborda la tarea?

Improvisa basándose en sus datos de entrenamiento. Si tienes suerte, el resultado es decente. Si no, se equivoca con confianza, porque no conoce tu contexto específico, las convenciones de tu sector o tus flujos de trabajo.

**Los Skills existen para solucionar esto.**

Un Skill es un manual de instrucciones que le dice al Agente: cuando te encuentres con este tipo de tarea, sigue estos pasos, usa estas herramientas y ten cuidado con estos casos excepcionales.

En lugar de improvisar, el Agente sigue una receta.

---

## II. ¿Qué aspecto tiene realmente un Skill?

Esto podría sorprenderte: un Skill es solo una carpeta con un archivo Markdown dentro.

El archivo se llama `SKILL.md`. Comienza con unas pocas líneas de metadatos YAML: nombre, descripción, licencia, autor. Luego, el cuerpo está escrito en Markdown simple: instrucciones paso a paso, ejemplos de entrada/salida, cómo manejar errores comunes.

Si es necesario, la carpeta también puede contener scripts (por ejemplo, un archivo de Python), documentos de referencia y archivos de plantilla.

Eso es todo. No hay que instalar ningún SDK. No hay que levantar ningún servidor. No hay que implementar ningún protocolo JSON-RPC.

**Carpeta = skill. Markdown = interfaz.**

Esta es exactamente la razón por la que el ecosistema está creciendo tan rápido: la barrera para crear un Skill es absurdamente baja. Si sabes escribir en Markdown, puedes escribir un Skill.

---

## III. ¿Quién está usando los Skills?

Originalmente, Anthropic publicó los Skills como un estándar abierto en agentskills.io. Pero no es un formato exclusivo de Anthropic; la lista de compatibilidad se ha ampliado mucho:

- **Claude Code** — el propio agente de codificación de Anthropic; los Skills son el mecanismo de extensión principal
- **OpenAI Codex CLI / ChatGPT** — OpenAI adoptó el mismo estándar; los Skills ahora funcionan tanto en el ecosistema de Anthropic como en el de OpenAI
- **Cursor** — una de las herramientas de codificación con IA más populares; descubrimiento y carga nativa de Skills
- **GitHub Copilot** — el ecosistema de Microsoft; ya es compatible
- **Windsurf** — el entorno de desarrollo de IA de Cognition
- **OpenClaw** — el proyecto que hemos estado analizando; más de 100 Skills integrados

Escribes un Skill una vez y funciona en todos ellos. Que Anthropic y OpenAI respalden el mismo formato abierto es algo casi sin precedentes; estas dos empresas están de acuerdo en muy pocas cosas. Solo eso ya te dice cuán fuerte es la presión hacia la convergencia. Hace un año, cada plataforma tenía su propio formato de plugin. Ahora hay un estándar compartido.

---

## IV. Skills vs MCP: Dejemos de confundirlos

Esta pregunta surge constantemente. Vamos a zanjarla.

