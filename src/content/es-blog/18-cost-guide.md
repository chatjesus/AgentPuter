Parte 1/55.
---
title: "Cómo Usar OpenClaw por Menos de $30/Mes (La Guía Completa de Costos)"
description: "Un usuario gastó $254 en dos semanas. Federico Viticci alcanzó los $3,600 en un mes. Alguien se despertó con una sorpresa de $141 por los heartbeats nocturnos. Seis lugares donde OpenClaw quema tokens, qué cambió en las versiones 3.7 y 3.8, y cómo usuarios reales redujeron sus facturas de cientos a menos de $30 — sin sacrificar nada importante."
date: "2026-03-09"
author: "AgentPuter Lab"
readingTime: "20 min"
etiquetas: ["OpenClaw", "Optimización de Costos", "Enrutamiento de Modelos", "Ollama", "Presupuesto", "Heartbeat", "lossless-claw"]
destacado: true
---

# Cómo Ejecutar OpenClaw por Menos de $30/Mes (La Guía Completa de Costos)

AgentPuter · Marzo 2026 · ~20 min · #OpenClaw #OptimizacionDeCostos #EnrutamientoDeModelos #Ollama #Presupuesto

> **Fuentes:**
> - [Cómo dejar de quemar dinero en OpenClaw](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [El mejor LLM asequible del momento (feb 2026)](https://github.com/openclaw/openclaw/discussions/12267) — Discusión de GitHub #12267
> - [Cómo el plugin Mem
> - [Reduce tus costos de LLM de OpenClaw: Guía de SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — Blog de SaladCloud, 9 de feb. de 2026
> - [¿Por qué OpenClaw consume tantos tokens? 6 razones analizadas](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Blog de Apiyi, feb. de 2026
> - [Cómo ejecuto 19 agentes de OpenClaw por $6 al mes](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube, 1 de mar. de 2026
> - [Notas de la versión de OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Notas de la versión de OpenCl
*«¿Por qué mi agente cuesta tanto?»*

Un usuario gastó 254 $ en dos semanas. Otro alcanzó los 800 $ en un mes. El bloguero de tecnología Federico Viticci acumuló una [factura mensual de 3600
No se trata de usuarios avanzados forzando los límites. Son configuraciones normales con un uso normal.

OpenClaw es gratuito, pero los modelos que utiliza no lo son. Y como OpenClaw está diseñado para funcionar 24/7 —reportándose, navegando, pensando, enviando
Esta publicación es la guía que debería haber venido con OpenClaw. Analizaremos exactamente a dónde va el dinero, qué cambiaron las últimas versiones (3.7 y 3.8) para ayudar, y cómo usuarios reales han reducido sus facturas de cientos a menos de 3
Cada vez que OpenClaw realiza una llamada a la API, carga tus archivos `SOUL.md`, `AGENTS.md` y otros archivos de arranque en el prompt. Estos no se cargan una sola vez — se envían con **cada solicitud**. Si tu SOUL.md
Un usuario en r/LocalLLaMA [redujo su bootstrap de 85 KB a 27 KB](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) — una reducción del 69,8 % — elimin
El historial de tu sesión crece con cada intercambio. Tras unas horas de uso activo, llevas contigo decenas de miles de tokens en el historial. Todo ello acompaña a cada nueva solicitud. Este es el principal factor de coste para los usuarios intensivos — y la razón por la que [lossless-claw](/blog/lossless-claw) es importante (más sobre esto a continuación).

### 3. Latido (El Asesino Silencioso)
El pulso de OpenClaw se ejecuta cada 30 minutos por defecto. Cada comprobación es una llamada completa a la API con todo el contexto de tu sistema incluido. En Opus, eso es un gasto significativo: 48 pulsos por día, cada uno llevando tu prompt completo del sistema.

Un usuario informó haber gastado 50 $ en un solo día solo en pulsos. Otro tuvo [5,7 millones de tokens consumidos durante la noche](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/): la mayor parte provenía de pulsos y tareas programadas que había olvidado que se estaban ejecutando.
### 4. Generación de Subagentes

Cuando tu agente principal delega en subagentes, cada uno se inicia con su propio contexto, su propia memoria y sus propias llamadas al modelo. Los usuarios que ejecutan configuraciones multiagente (uno para escribir, uno para investigar, uno para programar) están pagando una sobrecarga de contexto por cada agente — y perdiendo contexto
Extracciones del navegador, lecturas de archivos, resultados de búsqueda: los resultados de las herramientas se almacenan en la transcripción y se reenvían con los mensajes posteriores. Una sola extracción web puede volcar miles de tokens en tu historial que persisten durante el resto de la sesión
## Si aún no has empezado: La forma gratuita de hacerlo

Antes de pasar a la optimización, una nota para cualquiera que aún no haya configurado OpenClaw.

No necesitas gastar ni un dólar para probarlo. **Gemini 2.5 Flash-Lite**
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // nivel gratuito
    }
  }
}
```

Conecta un canal (solo Telegram o WebChat), mantén SOUL.md corto, y tendrás un agente personal funcional a coste cero. A partir de ahí, puedes escalar.

---

## Cambios en 3.7 y 3.8 (Funcionalidades Relevantes para el Coste)

Las dos últimas versiones incluyeron varias funcionalidades que afectan directamente a los costes. Esto es lo que importa:

### De la 3.7 (8 de marzo)
**API de Plugin del Motor de Contexto + lossless-claw.** El [plugin lossless-claw](/blog/lossless-claw) mantiene tu contexto activo en el rango de 30–100K tokens sin importar cuánto dure la conversación. Sin él, las sesiones se desbordan
**MiniMax-M2.5-highspeed como modelo de primera clase.** Ya no es una improvisación — está correctamente integrado en el catálogo de modelos, la incorporación y el enrutamiento. Este es un modelo rápido y económico que se encarga del 80% del trabajo de agente rutinario.

**
**`openclaw backup create` y `openclaw backup verify`.** No es directamente una función de costes, pero si alguna vez has perdido una configuración y has tenido que reconstruirla, eso es tiempo y tokens desperdiciados restableciendo el contexto con tu agente.

**Modo de contexto LLM para la búsqueda web de Brave.** `tools.web.search.brave.mode: "llm-context"` devuelve fragmentos extraídos para contextualizar en lugar del contenido bruto de la página. Unos resultados de búsqueda estructurados significan menos tokens de seguimiento para analizar y volver a consultar.
**Tiempo de espera por silencio en el modo de conversación.** `talk.silenceTimeoutMs` te permite controlar cuándo se envía automáticamente la entrada de voz. Evita envíos prematuros que desperdician una llamada de ida y vuelta a la API por una frase a medias.

**Corrección
Todos los usuarios que redujeron su factura dicen lo mismo: la solución no fue una técnica específica — sino ver a dónde iba el dinero.
Accede ahora mismo al panel de control de tu proveedor de API. Revisa el gasto diario. Encuentra los picos. Un usuario en [r/openclaw hizo un seguimiento de cada dólar durante 30 días](https://www.reddit.com/r/LocalLLM/comments
Dentro de OpenClaw, usa `/status` para ver el modelo y el recuento de tokens de la sesión actual. Usa `/usage full` para obtener desgloses de costos por respuesta. No puedes optimizar lo que no puedes medir.

---

## Estrategia 2
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

Eso reduce las llamadas de 48 a 12 por día, una reducción del 75% en los costos de heartbeat con un impacto mínimo en la capacidad de respuesta.

**Dirige los heartbeats a un modelo económico.** Si estás usando un proxy de enrutamiento (ver Estrategia 5), los heartbeats se clasifican automáticamente como "ligeros" y se envían a Haiku. Si usas un modelo local a través de Ollama, los heartbeats cuestan $0.

---

## Estrategia 3: Recorta tu SOUL.md (Elimina Texto, Ahorra un 70%)
Cada token de tu prompt de sistema se factura en cada llamada. Este es el costo multiplicativo que la mayoría de la gente pasa por alto.

Un ejemplo real de la comunidad:

| Métrica | Antes | Después |
|---|---|---|
| Tamaño de SOUL.md
Abre tu SOUL.md. Lee cada línea. Pregunta: «¿Realmente necesita el agente esto en cada llamada?». ¿Contexto específico de un proyecto de hace tres meses? Muévelo a una habilidad. ¿Notas históricas? Muévelas a un archivo de referencia. Tu prompt de sistema debe ser escueto y atemporal.

Además: usa `/new` al cambiar entre tareas no relacionadas. No arrastres una conversación de 50.000 tokens sobre el proyecto A al proyecto B.

---

## Estrategia 4: Habilitar el almacenamiento en caché de prompts (Una línea, ahorra un 40 % en la entrada)
Esta es la ganancia más fácil que los datos fuente del artículo resaltan repetidamente.

Anthropic admite el almacenamiento en caché automático de prompts para los modelos Claude. Como OpenClaw envía el mismo prompt de sistema (SOUL.md + AGENTS.md) en cada llamada, es un candidato perfecto para el almacenamiento en caché. La primera llamada paga el precio completo; las llamadas posteriores dentro de la ventana de caché obtienen los tokens del prompt de sistema con un 90 % de descuento.
Un usuario [que hizo un seguimiento de los costes durante 30 días](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/) informó: *«
Para los modelos de Anthropic, el almacenamiento en caché de prompts está habilitado por defecto en las versiones recientes de OpenClaw. Para otros proveedores, comprueba si tu modelo lo admite; los modelos Gemini de Google también ofrecen [almacenamiento en caché de contexto](https://ai.google.dev/gemini-api/docs/pricing) con descuentos significativos.

---

## Estrategia 5: Enrutar modelos por tarea (Ahorra un 70–90%)

Este es el cambio estructural de mayor impacto. La idea: no todas las solicitudes merecen tu modelo más caro.
Una verificación periódica que pregunta «¿algo nuevo en mi bandeja de entrada?» no necesita Opus. Una clasificación de mensajes («¿es esto urgente?») no necesita Sonnet. Estas son tareas de nivel Haiku.

Aquí hay una comparación de costos real de la comunidad:

| Configuración | Costo Mensual | Notas |
|-------|-------------|-------|
| Todo en Opus | $347 | Configuración predeterminada de un solo modelo |
| Enrutado (Haiku/Sonnet/Opus) | $68 | Misma carga de trabajo, misma calidad |
| Todo en Opus | $150 | Carga de trabajo más ligera |
| Enrutado | $35 | Mismo usuario, mismas tareas |

**Cómo hacerlo — Opción A: Configuración manual**

Establece tu modelo predeterminado a uno económico y usa Opus solo donde lo necesites explícitamente:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // predeterminado para todo
      subagents: {
        model: "anthropic/claude-haiku-4-5", // subagentes también
      }
    }
  }
}
```

Luego, cambia a un modelo más potente cuando necesites razonamiento:

```
/model claude-opus-4-6
```
Cuando termines con la tarea compleja, vuelve a cambiar:

```
/model claude-haiku-4-5
```

**Cómo hacerlo — Opción B: Proxy de enrutamiento automático**

Ahora existen varios enrutadores de código abierto que clasifican cada solicitud y la enrutan automáticamente:

- [**ibl.ai OpenClaw Router**](https://github.com/iblai/iblai-openclaw-router) — proxy de Node.js sin dependencias, puntúa las solicitudes en 14 dimensiones en <1ms, enruta a Ligero (Haiku) / Medio (Sonnet) / Pesado (Opus). Se ejecuta localmente, no se envían datos a terceros.
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — Puntuación local de 15 dimensiones, la comunidad reporta un ahorro de ~90 % frente a usar siempre Opus.

Ambos se sitúan entre OpenClaw y
          "anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

Esto no es un enrutamiento por complejidad — es una red de seguridad para los límites de tasa y las interrupciones. Pero combinado con la asignación de modelos por canal o por agente, puedes enrutar diferentes cargas de trabajo a diferentes niveles de precios.

---

## Estrategia 6: Un Agente, Muchas Habilidades (Los Mayores Ahorros de los que Nadie Habla)
Esto proviene directamente de la [guía de costos de r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/):

> *"Un usuario pasó de gastar cientos por semana en una configuración multiagente a 90 $ al mes con un solo agente y una docena de habilidades. La calidad mejoró porque el contexto dejó de perderse entre traspasos."*
Cada instancia de agente tiene una sobrecarga: su propio prompt de sistema, su propia memoria, su propia ventana de contexto. Ejecutar cinco agentes significa pagar cinco veces el costo de arranque en cada llamada.

Las Skills de OpenClaw son archivos markdown que le dan a tu agente nuevas capacidades sin generar una nueva instancia. Mismo cerebro, misma memoria, mismo contexto. Una habilidad para escribir, una habilidad para investigar, una habilidad para programar — todas ejecutándose en una sola sesión de agente.

```
~/.openclaw/workspace/skills/
├── research/SKILL.md
├── writing/SKILL.md
```
├── coding/SKILL.md
└── calendar/SKILL.md
```

El agente elige la habilidad correcta basándose en lo que le pides que haga. Sin traspasos. Sin pérdida de contexto. Sin tokens de arranque duplicados.

**Cuándo usar multiagente:** Cuando realmente necesitas ejecución en paralelo — múltiples tareas ejecutándose simultáneamente, no secuencialmente. Para todo lo demás, las habilidades son más baratas y mejores.

---

## Estrategia 7: Ejecutar Modelos Locales para Tareas Rutinarias (Costo Marginal Cero)
Ejecutar un modelo en tu propio hardware significa que cada inferencia es gratuita después de la configuración inicial.

**Lo que funciona para OpenClaw:**

| Modelo | Hardware | Velocidad | Bueno para |
|--------|----------|-----------|------------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | Trabajo general de agente |
| Qwen 3 14B | RTX 3060 / Mac Mini M2 | 25+ tok/s | Heartbeats, clasificación |
| Llama 3.3 70B | 2x RTX 4090 | 20+ tok/s | Código, razonamiento
curl -fsSL https://ollama.com/install.sh | sh

# Descarga tu modelo
ollama pull qwen3:32b

# Configuración de OpenClaw
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}
```

OpenClaw 3.7+ soporta los embeddings de Ollama de forma nativa para la búsqueda en la memoria, por lo que tu memoria a largo plazo también permanece local.
**El enfoque híbrido** (lo que hacen la mayoría de los usuarios conscientes de los costos): modelo local por defecto para tareas rutinarias, API en la nube (Sonnet u Opus) solo cuando el agente necesita un razonamiento profundo. Un creador de YouTube documentó cómo ejecutaba [19 agentes por 6 $/mes](https://www.youtube.com/watch?v=-MtzLiQ9w1c) usando MiniMax M2.5 para el trabajo general y solo recurriendo a modelos de frontera para tareas complejas.
**Usa memoria vectorial en lugar de contexto sin procesar.** La búsqueda en la memoria de OpenClaw extrae recuerdos relevantes mediante la búsqueda de embeddings en lugar de cargar todo en el prompt. Con los embeddings de Ollama (3.7+), esto es más inteligente y gratuito:

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```
**Instala lossless-claw.** Como se explica en [nuestra publicación anterior](/blog/lossless-claw), el plugin lossless-claw mantiene un contexto activo de entre 30K y 100K tokens mediante la sumarización incremental. Nunca alcanzas el límite que fuerza una compactación de emergencia y nunca pierdes información que te obligue a rehacer el trabajo.

---

## Guía de Precios de Modelos 2026

Los precios de los modelos cambian rápidamente. Así es como están las cosas a marzo de 2026:

| Modelo | Entrada (por 1M de tokens) | Salida (por 1M de tokens) | Ideal para | Fuente |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | Extracción económica, consultas simples | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Tareas ligeras, ventana de contexto de 1M | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | Trabajo de agente general, contexto de 197K | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | Pulsos, clasificación, formato | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | Tareas estructuradas, revisión de código | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | Razonamiento complejo, arquitectura | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (local)** | $0 | $0 | Pulsos, embeddings, tareas rutinarias | Autoalojado |
El cálculo es simple: si el 80% de las llamadas de tu agente son rutinarias y las diriges a Haiku ($1/$5) en lugar de a Opus ($5/$25), has reducido tu factura en un 80% en esas llamadas. Añade el almacenamiento en caché de prompts, un SOUL.md recortado y modelos locales para los heartbeats y embeddings, y un agente de $200/mes baja a menos de $30.

---

## Poniéndolo todo junto: La configuración de $30/mes

Aquí tienes una configuración del mundo real para un agente OpenClaw productivo 24/7 que mantiene los costos por debajo de los $30/mes:

```json5
{
  agents: {
    defaults: {
// Sonnet para tu interacción principal — suficientemente potente para el trabajo real
      model: "anthropic/claude-sonnet-4-6",

      // Los subagentes usan Haiku por defecto
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // Heartbeat: modelo local, intervalo más largo
      heartbeat: {
        intervalMinutes: 120,
        // O enrutar a Haiku si no hay un modelo local
      }
    }
  },

  // Ollama local para embeddings (búsqueda en memoria gratuita)
  memory: {
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw para evitar el desbordamiento del contexto
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Búsqueda Brave con modo LLM-context (menos tokens de seguimiento)
  tools: {
    web: {
      search: {
        brave: {
          mode: "llm-context"
        }
      }
    }
  }
}
```

**Desglose del costo mensual (estimado, 30 días):**
| Componente | Tokens/día | Modelo | Costo/mes |
|-----------|-----------|-------|------------|
| Interacción principal (~2 h activo) | ~80K (50K entrada + 30K salida) | Sonnet | ~$18 |
| Llamadas a subagentes | ~30K | Haiku | ~$1.50 |
| Latido (12/día) | ~30K | Local/Haiku | $0–$1 |
| Incrustaciones de memoria | — | Local (Ollama) | $0 |
| Seguimientos de búsqueda web | ~20K | Sonnet | ~$2 |
| Ahorros por caché de prompts | — | — | –$4 |
| **Total** | | | **~$19–22** |
*Cálculo: Interacción principal = 50K de entrada × $3/M × 30 = $4,50, más 30K de salida × $15/M × 30 = $13,50 = $18/mes
**1. Revisa tu factura.** Inicia sesión en el panel de control de tu proveedor de API. Mira el gasto por día. Encuentra los picos.

**2. Extiende tu intervalo de latido (heartbeat).** Añade `heartbeat.intervalMinutes: 120` a tu configuración. Ahorro instantáneo.

**3. Revisa el tamaño de tu SOUL.md.**

```bash
wc -c ~/.openclaw/workspace/SOUL.md
```

Si supera los 30 KB, recórtalo. Mueve el contexto específico del proyecto a las habilidades (skills).
**4. Establece un modelo de subagente.** Añade `agents.defaults.subagents.model` a tu configuración. No dejes que los subagentes hereden tu modelo principal costoso.

**5. Instala lossless-claw.** `openclaw plugins install lossless-claw`. Evita el ciclo de explosión de contexto → compactación → rehacer trabajo que duplica silenciosamente tu gasto de tokens.

---

## Lo que viene

El ecosistema OpenClaw está convergiendo en el problema del costo desde múltiples direcciones:
- El **plugin MemOS Cloud** informó de una [reducción de tokens del 72 %](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) en el benchmark de conversación larga LOCOMO al descargar la memoria a un sistema dedicado
- **QMD** (del cofundador de Shopify, Tobi Lütke) proporciona un ahorro de tokens del 60–97 % a través de la búsqueda semántica local
- Los **proxies de enrutamiento automático** como ibl.ai Router y ClawRouter están haciendo que la selección manual de modelos sea obsoleta
- La **API del Motor de Contexto** abierta en la 3.7 significa que la comunidad puede desarrollar enfoques completamente nuevos para la eficiencia del contexto.

La tendencia es clara: el entorno de ejecución del agente se está volviendo consciente de los costos en cada capa. La gestión del contexto,
*¿Usas OpenClaw con un presupuesto ajustado? Comparte tu coste mensual y configuración en los comentarios. Estamos recopilando datos para una comparativa de costes comunitaria — el objetivo es encontrar el coste más bajo posible para cada nivel de capacidad de agente.*

*A continuación: [OpenClaw vs. Nanobot](/blog/openclaw-vs-nanobot) — cuándo un agente minimalista de 4000 líneas de la Universidad de Hong Kong podría ser la elección correcta.*

---
*Fuentes: [Guía de costos de r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [Discusión de GitHub #12267](https://github.com/openclaw/openclaw/discussions/12267) · [Análisis del Plugin MemOS](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai Router](https://github.com/iblai/iblai-openclaw-router) · [Guía de costos de SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Análisis de tokens de Apiyi](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*