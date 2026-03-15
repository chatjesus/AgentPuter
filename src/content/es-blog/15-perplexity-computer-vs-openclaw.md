---
title: "Perplexity acaba de construir lo que los usuarios de OpenClaw ya ejecutaban"
description: "El 25 de febrero, Perplexity lanzó Computer: una IA en la nube que orquesta 19 modelos por 200 $/mes. Qué tienen ya los usuarios de OpenClaw, qué no tienen, y qué significa esto para la carrera de plataformas de agentes."
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "Agente IA", "Multi-Agente", "Plataforma de Agentes"]
featured: true
---


El 25 de febrero, Perplexity lanzó "Computer" — un sistema de IA en la nube que
El resumen del producto de Ars Technica: *"Luego está OpenClaw, que se podría percibir como el predecesor inmediato de este concepto."*

Este artículo cubre qué es realmente Perplexity Computer, en qué converge con OpenClaw, en qué no, y qué es lo que
5. [Lo que Perplexity hace mejor](#does-better)
6. [Para quién es realmente cada uno](#who-for)
7. [Lo que esto significa para la carrera de plataformas de agentes](#platform-race)

---

## 1. Qué es realmente Perplexity Computer {#what-it-is}
La propuesta: describe un resultado en lenguaje sencillo y la Computadora descubre cómo lograrlo. «Planifica y ejecuta una campaña de marketing digital para mi restaurante». «Créame una app para Android que me ayude a llevar un registro de mis lecturas». No estás escribiendo prompts ni seleccion
Detrás de esa interfaz, el Ordenador descompone la solicitud en subtareas estructuradas, delega cada una al modelo de sus 19 disponibles que sea más adecuado para ese paso específico y los ejecuta —algunos en paralelo, otros en serie— hasta que el trabajo está terminado.

**La pila de modelos:**

| Modelo | Rol |
| --- | --- |
| Claude Opus 4.6 | Motor principal de razonamiento y orquestación |
| ChatGPT 5.2 | Recuperación de contexto largo, búsqueda web amplia |
| Gemini | Investigación profunda, creación de subagentes |
| Nano Banana | Generación de imágenes |
| Veo 3.1 | Generación de video |
| Grok | Tareas ligeras y sensibles a la velocidad |

19 modelos en total — la tabla anterior muestra los principales con nombre. Opus es la capa de orquestación; decide qué modelo se encarga de cada subtarea. No se configura nada de esto. Ocurre de forma invisible.
**El entorno:** Cada tarea se ejecuta en un entorno de computación en la nube aislado con acceso a un sistema de archivos real, un navegador real e integraciones de herramientas preconstruidas. Nada se ejecuta en tu máquina local. Las integraciones son seleccionadas por Perplexity — sin plugins de terceros, sin servidores MCP personalizados.
**Precios:** $200/mes para Perplexity Max, que incluye 10.000 créditos. El ordenador consume créditos a medida que se ejecuta — el uso no es ilimitado. Puedes establecer límites de gasto por subagente, lo que te da un control real en dólares sobre cuánto se le permite gastar a cada tarea individual.
**Una advertencia sobre el lenguaje de marketing:** Perplexity dice que Computer es «capaz de funcionar durante horas o incluso meses». El producto se lanzó el 25 de febrero. Nadie ha verificado todavía la afirmación de varios meses en un flujo de trabajo real. Considéral
> *"Los Agentes de IA son notablemente capaces — pero no tienen un hogar, ni un espacio de trabajo persistente, ni un ordenador propio."*

Perplexity Computer es una implementación comercial precisamente de esa tesis.
No se trata de que Perplexity leyera esa publicación y creara un producto. Perplexity comenzó experimentos internos en enero — antes de que se publicara el Blog #01. Se trata de múltiples equipos que llegaron a la misma conclusión de forma independiente. Lo cual es en sí mismo una
| Espacio de trabajo persistente | Sistema de archivos en la nube por tarea | `~/.openclaw/data/` |
| Enrutamiento multimodelo | 19 modelos, orquestados por Opus | `model.fallbacks` + `modelByChannel` |
| Coordinación de subagentes | Descomposición de tareas → delegación a agentes | `sessions_spawn` fan-out |
| Autonomía de larga duración | Declarado: de horas a meses | Cron + `runTimeoutSeconds` |
| Navegador real | Integrado | `browser_snapshot`, `browser_navigate` |
| Archivos de contexto del agente | Gestionados por la plataforma, no visibles para el usuario | `SOUL.md`, `USER.md`, `HEARTBEAT.md` |
| Controles de gasto | Límites de crédito por subagente | `runTimeoutSeconds` (proxy basado en tiempo) |

Las decisiones de diseño se corresponden casi de forma unívoca. Almacenamiento persistente, acceso al navegador, enrutamiento multimodelo, paralelismo de subagentes, autonomía de larga duración — estas no son características que Perplexity haya inventado. Son características que la comunidad de OpenClaw ha estado usando, de forma configurable, desde el año pasado.
El creador de OpenClaw, Peter Steinberger, se unió a OpenAI en febrero. Altman describió los agentes personales como algo que «se convertirá rápidamente en el núcleo de nuestras ofertas de productos», y dijo que el futuro «va a ser extremadamente multiagente». Anthropic lanzó Claude Cowork en enero. Toda la industria ahora está productizando el patrón de infraestructura que la comunidad de código abierto de OpenClaw construyó primero.

---

## 3. Dónde divergen {#diverge}

Las ideas son idénticas. La filosofía de ejecución es opuesta.
Ars Technica lo expresó bien: *"Si OpenClaw fuera la web abierta de las herramientas de agentes de IA, entonces AgentPuter es la App Store de Apple."*

Esa analogía es precisa y vale la pena reflexionar sobre ella. La web abierta te permite construir cualquier cosa y
| Dimensión | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| Dónde se ejecuta | Solo en la nube | Máquina local, VPS autohospedado o TinyClaw |
| Modelo de integración | Integraciones de plataforma seleccionadas | Open Skills + ecosistema MCP |
| Configuración | Gestionada por la plataforma, invisible para el usuario | `openclaw.json`, control total del usuario |
| Modelo de seguridad | La plataforma es responsable | El usuario es responsable |
| Límite de personalización | Bajo — usa lo que Perplexity proporciona | Alto — configura cualquier cosa |
| Transparencia | Caja negra | Transcripción completa a través de `sessions_history` |
| Ubicación de los datos | La nube de Perplexity | Tu máquina o tu servidor |
| Controles de gasto | Límites de crédito por subagente | `runTimeoutSeconds` (proxy de tiempo) |

La compensación va consistentemente en una dirección: Perplexity renuncia al control a cambio de simplicidad y seguridad; OpenClaw renuncia a la simplicidad a cambio de control y extensibilidad.

---

## 4. Lo que Perplexity no puede hacer {#cant-do}
Estos no son casos límite; son capacidades que los usuarios de OpenClaw consideran un requisito básico.

**SOUL.md — identidad persistente del agente**

En OpenClaw, `SOUL.md` es un archivo que da forma a cómo el agente piensa y se comporta en todas
Perplexity Computer no tiene un equivalente. Cada tarea comienza desde los valores predeterminados de la plataforma. No puedes escribir un conjunto de instrucciones persistentes, no puedes definir cómo el agente debe manejar la ambigüedad, no puedes darle un carácter que persista. El agente con el que trabajas hoy no tiene memoria de ninguna preferencia que hayas establecido.

**Programación Cron personalizada**

Perplexity Computer es reactivo. Tú describes una tarea; él la ejecuta. Tú eres siempre quien lo inicia.
OpenClaw ejecuta flujos de trabajo programados de forma autónoma. "Todos los días laborables a las 7:50 AM, extrae la actividad de GitHub de ayer, resume los PR que necesitan revisión y envía un resumen a Telegram". Nadie presiona un botón. El agente
OpenClaw expone un endpoint /hooks/agent. Un Webhook de GitHub se dispara cuando se abre un PR; el agente lee el diff, ejecuta una revisión y publica comentarios en Slack, todo sin intervención humana. El evento externo impulsa el flujo de trabajo.

Perplexity Computer no tiene una superficie de Webhooks de entrada. No puede escuchar eventos de sistemas externos.

**Acceso a archivos locales**
Si tu flujo de trabajo accede a archivos en tu máquina —como leer código de un repositorio local, procesar documentos en tu sistema de archivos, interactuar con aplicaciones locales—, Perplexity Computer no puede acceder a ellos. Todo se ejecuta en el entorno en la nube de Perplexity. Tu máquina local es invisible para él.

**Habilidades de terceros y servidores MCP**
El ecosistema de OpenClaw incluye miles de Skills en ClawHub y agentskills.io, además de soporte para servidores MCP personalizados. Puedes instalar una Skill que se conecte a tus herramientas internas, escribir una Skill personalizada que codifique el flujo de trabajo de tu organización o conectar un servidor MCP que le dé al agente acceso a tus datos propietarios.

Perplexity Computer funciona con lo que Perplexity ha construido y mantiene. Ese conjunto es pequeño y está curado por diseño. No puedes extenderlo.

**Un registro de auditoría propio**
`sessions_history` en OpenClaw te da una transcripción completa e inspeccionable de todo lo que hizo el agente: cada llamada a una herramienta, cada respuesta del modelo, cada punto de decisión. Cuando algo sale mal, puedes leer exactamente lo que sucedió.

Perplexity Computer te muestra los
## 5. En qué es mejor Perplexity {#does-better}

Es importante ser honesto sobre lo que se compra con los 200 $/mes. Varias de estas son ventajas genuinas, no solo marketing.

**Cero configuración**

Sin servidor que aprovisionar. Sin `openclaw.json` que configurar. Sin claves de API que gestionar. Sin conexiones MCP que depurar. Abre un navegador, describe lo que quieres y el Ordenador empieza a trabajar.
En OpenClaw, incluso con TinyClaw gestionando la infraestructura, todavía hay un paso de configuración significativo: conectar canales, escribir SOUL.md, configurar la pila de modelos, decidir las programaciones de Cron. Para un usuario no técnico, esta brecha es significativa.

**En
Opus decide cuál de los 19 modelos se encarga de cada subtarea. No especificas «usa Gemini para la investigación, usa Nano Banana para las imágenes, usa Grok para tareas ligeras». Ese enrutamiento se produce automáticamente basándose en lo que el sistema de Perplexity ha determinado que funciona mejor.
En OpenClaw, construir un enrutamiento multimodelo equivalente requiere una configuración intencionada: establecer `subagents.model`, usar `modelByChannel`, escribir `model.fallbacks`, y potencialmente escribir lógica de enrutamiento personalizada en `AGENTS.md`. Es factible, pero requiere trabajo.

**Límites de gasto por subagente**
Esta es la única área en la que Perplexity tiene algo que OpenClaw explícitamente no tiene. Los límites de gasto basados en créditos te permiten decir «esta subtarea de investigación no debe gastar más de X». Eso es un control de costes directo a nivel de dólares para cada tarea
Navegador, ejecución de código, generación de imágenes, generación de video: todo esto funciona de forma nativa, sin depuración y sin gestión de credenciales. En OpenClaw, cada capacidad requiere la instalación de una Skill, una configuración del servidor MCP o una clave de API. El
El incidente ClawHavoc es el ejemplo más claro del riesgo. En febrero de 2026, se descubrieron 341 habilidades maliciosas en ClawHub en un ataque coordinado a la cadena de suministro. La carga útil principal era Atomic Stealer (AMOS), un ladrón
El modelo cerrado de Perplexity Computer elimina por completo esta superficie de ataque. No puedes instalar una habilidad maliciosa porque no puedes instalar ninguna habilidad.

**Responsabilidad comercial**

200 $/mes compran un contrato de soporte, un SLA y una organización que es responsable si el
## 6. Para quién es realmente cada uno {#who-for}

Estos no compiten por el mismo usuario. Esto es importante porque plantearlos como competidores lleva a la conclusión equivocada sobre cuál usar.

**Perplexity Computer:**
El usuario que más se beneficia de Perplexity Computer tiene flujos de trabajo basados en la nube, no necesita tocar archivos locales ni activarse por eventos externos, se siente cómodo con que una plataforma gestione todas las decisiones de enrutamiento e infraestructura, y valora más el "simplemente funciona" que el
Un consultor de marketing que automatiza la investigación de la competencia. Un escritor que usa IA para ayudar con la investigación y los borradores. El dueño de una pequeña empresa que quiere automatizar los flujos de trabajo de comunicación con el cliente que residen completamente en servicios en la nube. Para estos usuarios, la capa de configuración de OpenClaw es una fricción, no un valor. Perplexity Computer elimina esa fricción por 200 $/mes.

**OpenClaw:**
El usuario que más se beneficia de OpenClaw tiene requisitos de infraestructura específicos: acceso a archivos locales, flujos de trabajo autónomos desencadenados por Cron, gestión de eventos mediante Webhooks, Skills personalizadas para herramientas propietarias o requisitos de residencia de datos que hacen que «se ejecuta en la nube
Un ingeniero que quiere un bot de revisión de PR. Un desarrollador que necesita agentes que trabajen con código en un repositorio local. Un equipo de operaciones que necesita flujos de trabajo de monitoreo autónomos que se ejecuten contra la infraestructura interna. Un investigador que necesita agentes de larga duración que acumulen
La prueba más clara: si tu flujo de trabajo necesita iniciarse sin intervención humana (Cron o Webhook), o necesita tocar archivos que no están en la nube de Perplexity, eres un usuario de OpenClaw. Si tus flujos de trabajo son iniciados por ti y residen completamente en servicios en la nube, vale la pena evaluar Perplexity Computer.

Ambos grupos existen. Ambos crecerán. El mercado de infraestructura de agentes es lo suficientemente grande para ambos enfoques, y es probable que ambos sigan divergiendo en lugar de converger.

---
## 7. Qué significa esto para la carrera de las plataformas de agentes {#platform-race}

**La tesis de la infraestructura está zanjada.**

A principios de 2025, «los agentes necesitan su propio entorno de computación persistente» era una afirmación que había
La competencia ahora es sobre quién posee la capa de infraestructura — no sobre si la capa de infraestructura existe.

**El canal de código abierto a comercial está funcionando según lo previsto.**
OpenAI contrató al creador de OpenClaw. Perplexity creó un producto basado en el concepto. Anthropic creó Claude Cowork. El patrón coincide con lo que sucedió con Linux → Red Hat → AWS, con Android → Samsung, con Git → GitHub. El código abierto define la categoría y demuestra
La pregunta que vale la pena hacerse para el ecosistema OpenClaw: ¿conserva la versión abierta y configurable su valor distintivo a medida que mejoran las versiones cerradas y pulidas? Históricamente, la respuesta es sí, pero la propuesta de valor tiene que mantenerse clara. "Control total, cualquier infraestructura, ecosistema extensible" es una postura coherente. "Una versión ligeramente más barata de Perplexity Computer con más configuración" no lo es.

**200 $/mes con límites de crédito establece lo que el mercado soportará.**
Ese es el precio actual para la versión más pulida, sin configuración y orquestada por 19 modelos de esta capacidad. Viene con 10,000 créditos incluidos — no un uso ilimitado.
TinyClaw despliega la misma arquitectura subyacente de múltiples agentes en menos de un minuto, a un costo significativamente menor, con acceso a la programación Cron, Webhooks, acceso a archivos locales y el ecosistema completo de OpenClaw Skills. La propuesta de valor no es "un Perplexity Computer más barato". Es un producto diferente para un usuario que necesita capacidades que Perplexity Computer excluye deliberadamente.
El mercado es real. La carrera por la infraestructura ha comenzado. OpenClaw fue el prototipo de código abierto que demostró el concepto. Perplexity Computer es una de las primeras grandes apuestas comerciales en él. Se esperan más.

---

## Referencia rápida

| | Perplexity Computer | OpenClaw + TinyClaw |
| --- | --- | --- |
| Precio | $200/mes (10k créditos incluidos) | Código abierto + precios de TinyClaw |
| Tiempo de configuración | Segundos | De minutos a horas |
| Número de modelos | 19 (enrutado automáticamente por Opus) | Configurable (cualquier proveedor) |
| Límites de gasto | Basado en créditos, por subagente | Basado en tiempo (`runTimeoutSeconds`) |
| Personalización | Baja | Alta |
| Acceso a archivos locales | No | Sí |
| Cron / tareas programadas | No | Sí |
| Recepción de webhooks | No | Sí |
| Habilidades / plugins personalizados | No | Sí (ClawHub, agentskills.io) |
| Identidad de agente persistente | No | Sí (`SOUL.md`) |
| Ubicación de los datos | La nube de Perplexity | Tu elección |
| Registro de auditoría completo | No | Sí (`sessions_history`) |

---

## Recursos
- [Anuncio de Perplexity Computer](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica: Perplexity anuncia «Computer»](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://agentputer.com/) — alojamiento en la nube 24/7 para OpenClaw
- [tinyclaw.dev](https://tinyclaw.dev/) — despliegue con un solo clic
- [docs.openclaw.ai](https://docs.openclaw.ai/) — documentación de OpenClaw
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — Repositorio de OpenClaw

---

*Fuentes: Perplexity blog · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · Feb. 2026*