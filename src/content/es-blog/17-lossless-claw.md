---
title: "OpenClaw acaba de resolver su mayor problema. Te explicamos qué hace realmente lossless-claw."
description: "La compactación por defecto de OpenClaw se activa una vez, resume todo y descarta los originales. Cuanto más tiempo funciona tu agente, más olvida. La versión 2026.3.7 abrió el motor de contexto a los plugins. lossless-claw es el primero: un sistema basado en DAG que almacena cada mensaje completo y permite a los agentes recuperar detalles históricos exactos bajo demanda."
date: "2026-03-08"
author: "AgentPuter Lab"
tiempoDeLectura: "18 min"
etiquetas: ["OpenClaw", "lossless-claw", "Motor de Contexto", "Memoria", "Plugin", "Agentes de Larga Duración", "LCM"]
destacado: true
---

#
> - [Característica: sistemas de contexto conectables, LCM para OpenClaw](https://github.com/openclaw/openclaw/discussions/22251) — Discusión #22251, @jalehman, 20 de feb. de 2026
> - [Notas de la versión de OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) — Twitter, 8 de mar. de 2026
> - [LCM: Gestión de Contexto Sin Pérdidas](https://papers.voltropy.com/LCM) — Ehrlich & Blackman

---
Imagina esto: has tenido un agente OpenClaw ejecutando un proyecto de investigación durante tres horas. Ha estado navegando, tomando notas, contrastando fuentes, haciéndose una idea de algo complejo. Entonces, alcanza su límite de contexto.

Se dispara la compactación.
El siguiente mensaje que te envía parece como si acabara de despertar con amnesia. La ruta de archivo específica que encontró hace dos horas — desaparecida. La decisión que tomaron juntos sobre qué enfoque adoptar — resumida en una sola frase vaga. Todo el hilo de razonamiento que los llevó a algo útil
Esto no es un error. Es por diseño — y hasta el 8 de marzo de 2026, era la única opción que tenía cualquier agente.

OpenClaw 2026.3.7 cambió eso.

---

## El Problema con la Compact
No lo es. He aquí por qué.

Cuando la compactación predeterminada de OpenClaw se activa, realiza una **resumización de una sola vez**: los mensajes más antiguos se colapsan en un único bloque de resumen, ese bloque se vuelve a escribir en la transcripción
[@jalehman](https://github.com/jalehman) — el desarrollador que creó lossless-claw — describió la situación con precisión en la [Discusión #22251](https://github.com/openclaw/openclaw/discussions/22
Esa última frase es importante. No es un fallo específico de OpenClaw. ChatGPT hace esto. Claude hace esto. Todos los frameworks de agentes hacen esto. Todo el campo ha estado operando bajo el supuesto de que la compresión con pérdida es la única opción.

**Las consecuencias prácticas
Para los agentes de larga duración —aquellos que la gente realmente está desplegando para funcionar 24/7, para gestionar proyectos que duran días o semanas, para coordinar entre subagentes a través de docenas de tareas— la compactación es un techo estructural. Tu agente
Hay una razón por la que los usuarios experimentados de OpenClaw han desarrollado soluciones alternativas: ejecutar manualmente `/compact` en momentos estratégicos, estructurar SOUL.md para forzar que los hechos clave sobrevivan a la compactación, dividir los proyectos en sesiones aisladas con notas de trasp
El titular que verás en Twitter es "lossless-claw — un plugin de OpenClaw que le da a tu agente una memoria perfecta". Eso es cierto, pero esa no es la verdadera noticia.

La verdadera noticia es lo que tuvo que suceder en el núcleo de OpenClaw antes de que lossless-claw pudiera existir.
Antes de la versión 2026.3.7, la gestión de contexto de OpenClaw estaba **codificada directamente en el núcleo**. No había forma de intercambiarla, extenderla o experimentar con alternativas sin bifurcar toda la base de código. La lógica de compactación
El PR que @jalehman envió — [#22201](https://github.com/openclaw/openclaw/pull/22201) — no solo añadió soporte para lossless-claw. **Extrajo la gestión de contexto a una interfaz conectable**. De
Lo que eso significa en la práctica: OpenClaw ahora tiene una interfaz definida para la gestión de contexto. Cualquier plugin que implemente esa interfaz puede reemplazar por completo el motor incorporado. El comportamiento por defecto se conserva — `LegacyContextEngine` sigue siendo la opción de respaldo si no configuras nada — pero la puerta ya está abierta.

Aquí está la interfaz:

```typescript
// OpenClaw 2026.3.7 — Interfaz de Plugin del Motor de Contexto
interface ContextEngine {
```
bootstrap(ctx):           Promise<void>           // inicializar la BD, los índices
  ingest(msg):              Promise<void>           // archivar cada mensaje a medida que llega
  assemble(opts):           Promise<AgentMessage[]> // construir el contexto del modelo en cada turno
  compact(ctx):             Promise<void>           // manejar el disparador de compactación
  afterTurn(ctx):           Promise<void>           // procesamiento posterior al turno
prepareSubagentSpawn():   ...                     // pasar contexto a los subagentes generados
  onSubagentEnded():        ...                     // reconciliar después de que el subagente complete
}
```

Este es un ciclo de vida completo. Cada momento que involucra el contexto — ingesta, ensamblaje, compactación, traspaso al subagente — es ahora un hook que un plugin puede interceptar y reemplazar.

Para usar un motor de contexto alternativo, la configuración es una sola línea:

```json
{
  "plugins": {
    "slots": {
      "contextEngine": "lossless-claw"
    }
  }
}
```

Si no añades esta línea, no cambia nada. Cero diferencia de comportamiento con respecto a las versiones anteriores. La ruta de migración es completamente opcional.

---

## Cómo funciona lossless-claw
lossless-claw es la primera implementación de esta interfaz. Está basado en el [artículo LCM (Lossless Context Management)](https://papers.voltropy.com/LCM) de Ehrlich y Blackman, investigadores que más tarde respaldaron el plugin directamente. Uno de los coautores del artículo, [@belisarius222](https://github.com/belisarius222), escribió en la discusión de GitHub:

> *"Josh le ha hecho tantas mejoras que creo que realmente debería llamarse LCM 2.0."*

La premisa central es un replanteamiento de todo el problema.
La compactación estándar espera a que ocurra el desbordamiento y luego reacciona. Para cuando se activa, ya has perdido la capacidad de preservar el contexto adecuadamente — estás haciendo un triaje de emergencia sobre una pila de mensajes que se han acumulado durante horas. El resultado es inevitablemente con pérdidas.
lossless-claw no espera. Funciona **de forma continua y asíncrona en segundo plano**, tomando decisiones de resumen incremental después de cada intercambio, antes de que ocurra cualquier crisis de desbordamiento. Los resúmenes que crea no son texto plano. Son nodos estructurados en un grafo, vinculados a los mensajes originales de los que provienen.

### La Arquitectura: Un DAG de Memoria
Cada mensaje que entra en una sesión de lossless-claw se persiste inmediatamente en una **base de datos SQLite**. No se resume, se almacena íntegramente. Esta es la fuente de verdad. Nunca se elimina.

A medida que la conversación crece, lossless-claw crea **nodos de resumen** sobre grupos de mensajes más antiguos. Esos resúmenes están conectados a los mensajes originales en un **DAG (grafo acíclico dirigido)**:

```
Mensajes brutos (almacenados íntegramente en SQLite, nunca eliminados)
      ↓
  Resúmenes de nivel 1 (cubren de 8 a 16 mensajes)
      ↓
```
Resúmenes de Nivel 2 (cubren múltiples resúmenes de Nivel 1)
      ↓
  Resúmenes de Nivel 3 (capturan las fases principales del proyecto)
```

Los resúmenes se vuelven progresivamente más abstractos a medida que
+
[Nodos de resumen llenando el presupuesto de tokens restante, del más antiguo al más reciente]
           +
[Cualquier detalle que el agente solicite explícitamente a través de lcm_expand]
```

El modelo ve los mensajes recientes completos y el material más antiguo como una jerarquía de resúmenes. Así es como se ve realmente un nodo de resumen en el contexto del modelo:

```xml
<summary id="sum_abc123" kind="condensed" depth="1"
         descendant_count="8"
         earliest_at="2026-02-17T07:37:00"
         latest_at="2026-02-17T15:43:00">
<summary>
  <parents>
    <summary_ref id="sum_def456" />
  </parents>
  <content>
    Durante esta sesión, el agente investigó tres estrategias de precios
    para el nivel de API. Concluyó que el modelo basado en el uso era preferible debido a
    [razones]. Archivo clave escrito: /workspace/pricing-analysis.md.
    Siguiente paso acordado: validar con los datos del equipo de finanzas.
  </content>
</summary>
```

El agente sabe que esto es un resumen. Sabe qué período cubre, cuántos mensajes representa y dónde buscar si necesita más información.
### Las Tres Herramientas de Recuperación

Cuando un resumen no es suficiente —cuando el agente necesita la ruta exacta de un archivo, la redacción precisa de una decisión, los datos reales de una sesión de investigación específica—, tiene tres herramientas para consultar el historial:

| Herramienta |
`lcm_expand` es la clave. En lugar de cargar toda la expansión en el contexto principal —lo que anularía su propósito—, utiliza un **subagente** para leer el contenido expandido y devolver solo el detalle específico que se solicitó. Se accede al material de origen sin saturar la ventana de contexto activa.
Esto es a lo que @jalehman se refiere con la analogía del libro en su propuesta: *"es como poder volver a cualquier página del libro."* El libro no se destruye cuando lo dejas. Está en la estantería. Puedes consultar cualquier cosa.

---

## ¿Realmente funciona? Las cifras

@jalehman pasó nueve días desarrollando lossless-claw antes de fusionar el PR, ejecutándolo en sus propios agentes durante la última semana. Su evaluación en [Discusión #22251](https://github.com/openclaw/openclaw/discussions/22251):
> *"Imagina no tener que volver a ejecutar /compact o /new nunca más. [...] he quedado increíblemente impresionado con los resultados: una conversación que da la sensación de que nunca pierde información (porque en cierto modo no lo hace), que siempre opera dentro del rango de 30
Para una imagen más cuantitativa: el desarrollador de la comunidad [@chrysb informó de los primeros resultados de benchmark](https://x.com/chrysb/status/2030526852146549140) en Twitter el día del lanzamiento. Usando el **benchmark OOLONG** —un conjunto de pruebas diseñado específicamente para evaluar la retención de contexto largo y la continuidad de la tarea— con Opus 4.6 como el modelo para ambos:

| Sistema | Puntuación OOLONG | Notas |
|--------|-------------|-------|
| lossless-claw + OpenClaw | **74.8** | La brecha se amplía con la longitud del contexto |
| Claude Code (predeterminado) | 70.3 | Ventana deslizante estándar |
| OpenClaw predeterminado | ~68 (estimado) | Compactación de un solo paso |

Estos son números reportados por la comunidad, no benchmarks oficiales, y
El coautor del artículo de LCM, @belisarius222, señaló una mejora específica que @jalehman realizó sobre la implementación original del artículo: **longitud de entrada limitada para la sumarización**. En el LCM original, resumir contenido muy largo podía por sí mismo desbordar el contexto, causar un comportamiento impredecible e introducir casos límite. El enfoque de limitación mantiene cada paso de sumarización predecible, lo que también hace que el sistema sea más fiable para las llamadas del subagente `lcm_expand`.

---
## Instalación y configuración de lossless-claw

**Prerrequisito: OpenClaw 2026.3.7 o posterior.** La ranura del plugin Context Engine no existe en versiones anteriores.
> **Aviso:** La versión inicial 2026.3.7 tiene un bug conocido de registro P1 ([Incidencia #40096](https://github.com/openclaw/openclaw/issues/40096)) donde el módulo context-engine se divide entre fragmentos del paquete (bundle chunks), provocando que lossless-claw falle con el error "Context engine 'lossless-claw' is not registered.". La corrección se incluyó en el PR #40115. Verifica que tu versión instalada incluya este parche antes de continuar — ejecuta `openclaw --version` y revisa el registro de
openclaw --version
# Debería mostrar: openclaw 2026.3.7 o superior (con la corrección del registro)

# Instalar el plugin
openclaw plugins install lossless-claw

# Reiniciar el gateway
openclaw restart
```

En la mayoría de los casos, `openclaw plugins install` autoconfigurará el slot contextEngine. Para verificar que está activo:

```bash
openclaw config show | grep contextEngine
# Esperado: contextEngine: "lossless-claw"
```

Si necesitas configurarlo manualmente, añade esto a tu configuración:

```json5
{
  plugins: {
    slots: {
contextEngine: "lossless-claw"
    }
  }
}
```

### Quién Debería Habilitarlo

lossless-claw no es la opción adecuada para todas las configuraciones de OpenClaw. Añade una sobrecarga, tanto en almacenamiento (base de datos SQLite que crece con tu historial de conversación) como en el uso de tokens (el propio proceso de resumen consume tokens).

**Habilita lossless-claw si:**
- Tu agente funciona 24/7 y gestiona proyectos en curso
- Estás realizando una investigación multisesión donde la continuidad es importante
- Estás ejecutando sistemas de subagentes donde el traspaso de contexto es crítico
- Alguna vez has perdido información importante debido a la compactación y has tenido que empezar de nuevo

**Mantén el motor predeterminado si:**
- Estás usando OpenClaw principalmente para tareas de una sola sesión que se completan en menos de una hora
- Estás ejecutando tareas cortas de alta frecuencia (trabajos cron, resúmenes diarios, consultas únicas)
- Eres muy sensible a los costos y aún no te has encontrado con problemas de compactación

### Gestionando el Costo de los Tokens
lossless-claw usa un LLM para generar resúmenes. Eso cuesta tokens. Para la mayoría de los flujos de trabajo de larga duración, el ahorro al evitar los reinicios de sesión supera con creces el coste adicional de la sumarización — pero si te preocupa el coste, hay una forma inteligente de configurar esto:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    }
  },
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```
La documentación de lossless-claw recomienda usar un modelo rápido y económico para la tarea de sumarización en segundo plano —algo como `anthropic/claude-haiku-4-5` o `MiniMax-M2.5-highspeed`— mientras se mantiene sin cambios el modelo de razonamiento principal. Consulta el [README de lossless-claw](https://github.com/Martian-Engineering/lossless-claw) para encontrar la clave de configuración exacta para apuntar la sumarización a un modelo diferente. La tarea de sumarización es lo suficientemente sencilla como para que un modelo más pequeño la maneje bien, y la diferencia de costo es significativa.
La implementación de @jalehman también tiene como objetivo mantener el contexto activo en el **rango de 30-100k tokens** a través de la cadencia de resumen adaptativa, para que el uso de tokens se mantenga predecible incluso a medida que el historial de la conversación crece indefinidamente.

---

## Lo que esto desbloquea más allá de lossless-claw

El plugin lossless-claw en sí mismo es valioso. Pero el cambio más grande es lo que la API del Motor de Contexto hace posible para la comunidad en el futuro.
Antes de la 3.7, cada intento de mejorar la gestión del contexto en OpenClaw se topaba con el mismo muro: estaba codificado de forma rígida. Podías escribir habilidades que intentaran gestionar el estado externamente. Podías estructurar tu SOUL.md para preservar los hechos clave. Podías ejecutar un `/compact` manual en momentos estratégicos. Ninguno de esos enfoques podía tocar el mecanismo central.

Ahora la interfaz está abierta.

Algunas de las direcciones que ya se están discutiendo en la comunidad:
**Búsqueda vectorial como backend de almacenamiento.** La búsqueda de texto completo de SQLite es buena para las consultas de palabras clave. Un backend de incrustación de vectores soportaría la búsqueda semántica — encontrar contenido histórico conceptualmente relevante incluso cuando las palabras exactas no están presentes. La implementación original de Volt de @belisarius222 utilizaba este enfoque.
**Motores de contexto integrados con RAG.** Un motor que se basa no solo en el historial de la conversación, sino también en una base de conocimiento externa —tu espacio de trabajo de Notion, tu base de código, tu biblioteca de documentos— ensamblada dinámicamente en cada turno según lo
**Obsidian / Notion como el backend de memoria.** En lugar de una base de datos SQLite local, persistir todo en un espacio de trabajo externo estructurado donde puedas explorarlo y editarlo tú mismo. La memoria de tu agente se vuelve auditable y consultable desde fuera del agente.
Desde el punto de vista de la infraestructura, así es como evolucionan las plataformas maduras. OpenClaw lanzó la automatización de navegadores, luego abrió la herramienta de navegador a la personalización. Lanzó habilidades, luego construyó ClawHub para distribuirlas. Lanzó la gestión de contexto, luego abrió el motor de contexto. El patrón es consistente: construirlo primero, luego hacerlo extensible.
La gestión del contexto es la capa más fundamental en un sistema de agentes. Determina lo que el agente sabe, cómo razona a lo largo del tiempo y lo que realmente puede lograr en tareas de larga duración. Abrirlo no es una característica menor. Es una decisión de arquitectura sobre quién controla la memoria del
**Enrutamiento de agentes por tema en Telegram.** Los grupos de foro ahora pueden enrutar diferentes temas a diferentes agentes. Un grupo de Telegram, múltiples agentes especializados — cada uno manejando un hilo de tema diferente con sesiones aisladas. Esta ha sido una función solicitada durante meses para las configuraciones de equipos multiagente.

**Preparación para la App Store Connect de iOS.** Identificadores de paquete, automatización de Fastlane, metadatos de capturas de pantalla — toda la infraestructura para un envío a la App Store ahora está en la base de código. OpenClaw para móviles está llegando.

---
## La conclusión

OpenClaw ha tenido un límite silencioso desde el primer día: cuanto más tiempo funciona tu agente, más olvida. Todo caso de uso serio acaba topándose con él. La comunidad ha estado buscando formas de sortearlo durante meses con trucos de SOUL.md, una
lossless-claw es la primera respuesta: un sistema de resumen basado en DAG que lo almacena todo, resume de forma incremental y permite a los agentes recuperar detalles históricos exactos bajo demanda. Las primeras cifras de los benchmarks de la comunidad muestran que supera al motor por defecto de Claude Code en todas las long
openclaw plugins install lossless-claw
```

Esa es toda la migración.

---

*¿Cuánto tiempo pasa antes de que tus agentes lleguen a la compactación? ¿Y qué pierdes cuando lo hacen? Déjalo en los comentarios — estamos rastreando cómo los diferentes tipos de flujos de trabajo experimentan la degradación del contexto, y queremos los datos.*

*A continuación: [OpenClaw vs Nanobot](/blog/openclaw-vs-nanobot) — un agente minimalista de 4,000 líneas de investigadores de la Universidad de Hong Kong. ¿Cuándo se aplica realmente el "menos es más" a la infraestructura de agentes?*

---
*Fuentes: [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [Discusión de OpenClaw #22251](https://github.com/openclaw/openclaw/discussions/22251) · [Notas de la versión de OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) · [Artículo sobre LCM, Ehrlich & Blackman](https://papers.voltropy.com/LCM)*