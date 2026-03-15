---
title: "Guía para Usuarios Avanzados de OpenClaw: 30 Consejos que Nadie te Cuenta"
description: "maxSpawnDepth se establece por defecto en 1, no en infinito. SOUL.md es invisible para los subagentes. cleanup conserva los archivos para siempre a menos que lo cambies. 30 consejos probados en producción para cerrar la brecha entre 'funciona' y 'bien configurado'."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

---

# Guía para usuarios avanzados de OpenClaw: 30 consejos que nadie te cuenta

*Comunidad de OpenClaw · Febrero de 2026*

La mayoría de la gente instala OpenClaw, pone en marcha un agente y cree que ya ha terminado. No se

---

Estos 30 consejos provienen del uso en producción y de una lectura atenta de la documentación oficial. Algunos son obvios en retrospectiva. La mayoría no lo son en absoluto.

---

---

## Índice

1. [Fundamentos de Configuración (Consejos 01–08)](#chapter-1)
2. [Selección y Uso de Habilidades (Consejos 09–14)](#chapter-2)
3. [Arquitectura de Subagentes (Consejos 15–20)](#chapter-3)
4. [Control de Costos (Consejos 21–25)](#chapter-4)
5. [Depuración y Seguridad (Consejos 26–30)](#chapter-5)
6. [Sáltate Todo Esto: TinyClaw](#tinyclaw)

---

---

## Fundamentos de la Configuración {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md: dónde miran realmente los subagentes

OpenClaw carga archivos en una jerarquía de tres niveles:

```
~/.openclaw/SOUL.md   ← global
./SOUL.md             ← proyecto
AGENTS.md + TOOLS.md  ← sesión (lo que ven los subagentes)
```

Los subagentes cargan solo `AGENTS.md` y `TOOLS.md`. Todo lo demás —`SOUL.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `BOOTSTRAP

---

Esto confunde a mucha gente. Escriben la lógica de enrutamiento en `SOUL.md`, despliegan una arquitectura *fan-out* y luego se pasan una hora preguntándose por qué los subagentes no están enrutando correctamente. No están enrutando

---

## Enrutamiento
- Preguntas de finanzas → finance-agent
- Revisión de código → code-reviewer
- Investigación → research-storm
```

Regla simple: si un subagente necesita saberlo, no puede estar en `SOUL.md`.

---

### 02. Las cadenas de modelo necesitan el prefijo del proveedor

```json
{ "model": "claude-opus-4-6" }     ← fallará
{ "model": "anthropic/claude-opus-4-6" }  ← correcto
```

El formato es `proveedor/nombre-del-modelo`. Sin él, el enrutador de modelos puede fallar silenciosamente cuando dos proveedores tienen nombres similares, y los tienen.

---

Cadenas comunes a fecha de febrero de 2026:

---

| Modelo | Bueno para |
|-------|---------|
| `anthropic/claude-opus-4-6` | Cualquier cosa que requiera razonamiento real |
| `anthropic/claude-sonnet-4-6` | La mayoría de las cosas — calidad cercana a Opus, mucho más económico |
| `anthropic/claude-haiku-4-5` | Tareas de ejecución donde la velocidad importa más que la profundidad |
| `google/gemini-3.1-pro-preview` | Documentos largos, entradas multimodales |
| `openai/gpt-4o-mini` | Resumen, clasificación, conversión de formato |
| `ollama/qwen2.5` | Cualquier cosa que no pueda salir de tu red |

---

Para establecer el valor predeterminado global para los subagentes:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }

---

OpenClaw lee .env automáticamente. No hay razón para poner las claves en ningún otro lugar.

---

### 04. maxSpawnDepth por defecto es 1

Si has visto SpawnDepthExceeded y no sabías por qué, esta es la razón.

```json
{

---

El valor predeterminado es 1 — un nivel de subagentes. El máximo es 5, pero en la práctica 2 cubre casi todas las arquitecturas reales. Los nodos hoja de profundidad 2 no pueden generar más; intentar ir más profundo lanza errores de tiempo de ejecución que son molest

---

### 05. runTimeoutSeconds es 0 por defecto

Cero significa que no hay tiempo de espera. Un subagente atascado se ejecuta para siempre.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "runTimeoutSeconds": 120
      }
    }
  }
}
```

---

120 segundos funciona para la mayoría de las tareas. Los agentes que procesan muchos datos a veces necesitan 300. Lo importante a entender es que: alcanzar el tiempo de espera detiene la ejecución pero no elimina la sesión. Para eso necesitas `cleanup` (Consejo 0

---

{
  "agents": {
    "defaults": {
      "subagents": {
        "cleanup": "delete"
      }
    }
  }
}
```

"delete" es un nombre inapropiado — renombra la transc

---

Este es el MCP de mayor impacto que puedes añadir para los flujos de trabajo de desarrollo. Los agentes consultan documentación oficial en tiempo real en lugar de adivinar a partir de datos de entrenamiento con meses o años de antigüedad.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

La clave de API es opcional — obtén una gratis en `context7.com/dashboard` si alcanzas los límites de tasa. Una vez conectado, añade `

---

Pregunta *"¿cómo funcionan las Server Actions en el último Next.js?"* y obtienes la documentación actual, no algo de la beta de 2023.

---

### 08. TOOLS.md es tu límite de permisos

Sin `TOOLS.md`, los agentes pueden llamar a cualquier cosa disponible.

```markdown
# TOOLS.md

deny: ["gateway", "cron", "billing", "admin_delete"]
```

---

`deny` anula a `allow`. En configuraciones multiagente esto importa más de lo que parece — si una habilidad se ve comprometida, un `TOOLS.md` permisivo permite que el radio de explosión se extienda por todo tu grafo de agentes.

---

---

## Selección y uso de habilidades {#chapter-2}

---

### 09. La puntuación de seguridad no es un adorno

Tanto ClawHub como agentskills.io muestran una puntuación de seguridad para cada habilidad. Léela.

- **A/B (80+):** Apta para producción
- **C (70–79):** Comprueba qué ámbitos de OAuth solicita antes de instalarla
- **D (≤69):** Pruébala en un sandbox. En serio.

---

En febrero de 2026, el incidente ClawHavoc retiró 341 habilidades de ClawHub. Contenían cargas útiles de inyección de prompts — algunas tan sutiles que una inspección manual las habría pasado por alto. La puntuación de seguridad es un análisis automatizado que detecta lo que no se puede ver a simple vista.

---

### 10. automejora: la única habilidad que realmente se vuelve más inteligente con el tiempo

---

`self-improvement` registra errores, correcciones y lagunas de conocimiento de cada sesión en `.learnings/ERRORS.md`. Antes de que comience la siguiente sesión, el agente vuelve a leer ese archivo — así que entra sabiendo ya lo que salió mal la última vez.

Sin configuración adicional. No se requiere una segunda habilidad. Instálalo, ejecuta la misma tarea recurrente durante dos semanas y compara. El efecto compuesto es real.

---

### 11. Orden de carga de habilidades: el último gana

---

El orden de carga es `TOOLS.md` → `AGENTS.md` → `SKILL.md`. Si una habilidad define una herramienta con el mismo nombre que algo en tu `AGENTS.md`, la versión de la habilidad prevalece.

A veces esto es lo que quieres (

---

El `SKILL.md` mínimo viable tiene tres secciones:

```markdown
# my-skill/SKILL.md

---

## Qué hago
Analizar datos de ventas CSV y generar resúmenes semanales.

---

## Cuándo usarme
Después de que cierre un período de ventas, cuando tengas una exportación del CRM.
No para datos en tiempo real ni conjuntos de datos que no sean de ventas.

---

## Cómo trabajo
1. Leer el CSV de la ruta en la instrucción de la tarea
2. Calcular totales, mejores rendimientos, delta período a período
3. Formatear como una tabla Markdown
4. Guardar en output/sales_summary_[fecha].md
```

Eso es todo. Los agentes pueden seguir instrucciones en inglés simple. No necesitas aprender una sintaxis especial.

---

### 13. ClawHub vs agentskills.io: herramientas diferentes para trabajos diferentes

---

| | clawhub.ai | agentskills.io |
|-|-----------|----------------|
| Tamaño del catálogo | 3.286 habilidades | 19.309 habilidades |
| Curación | Auditado por seguridad, curado | Envíos de la comunidad, de cola larga |
| Ideal para | Uso en producción | Encontrar habilidades de nicho que

---

`proactive-agent` soporta WAL (recuperación ante fallos, persistencia del contexto entre reinicios), programación autónoma de Cron y restauración del contexto después de una interrupción.

Un ejemplo concreto de lo que esto permite:

```
Programación: diariamente a las 0

---

Sin botón que presionar. Sin intervención humana. Simplemente se ejecuta. Este es el punto en el que los agentes dejan de sentirse como herramientas y empiezan a sentirse como infraestructura.

---

---

## Arquitectura de Subagentes {#chapter-3}

---

### 15. Distribución en abanico: el cambio más impactante que la mayoría de los equipos no han implementado

Secuencial:
```
Principal → obtener datos (12s) →

---

Distribución en abanico (Fan-out):
```python
sessions_spawn(tarea="obtener datos de mercado", etiqueta="datos-mercado",   modelo="anthropic/claude-haiku-4-5")
sessions_spawn(tarea="resumir noticias",

---

`sessions_spawn` devuelve un `runId` inmediatamente y no se bloquea. El agente principal continúa. Este único cambio —reestructurar el trabajo secuencial en un modelo de distribución (fan-out)— reduce la latencia entre un 30 y un 40 % para los flujos de trabajo del tipo informe matutino.

---

### 16. Usar Haiku para los subagentes por defecto, Opus para las excepciones

Establece Haiku globalmente, anúlalo cuando realmente necesites razonamiento:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

---

# Sobrescritura para la única tarea que realmente lo necesita
sessions_spawn(
    task="diseñar el modelo de datos para la facturación multi-inquilino",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

En la práctica: Haiku maneja más del 80 % de las tareas de ejecución sin una pérdida de calidad significativa. La diferencia de costo es real: una reducción del 50-60 % en el gasto de API para arquitecturas fan-out típicas.

---

### 17. Lógica de enrutamiento en AGENTS.md, no en SOUL.md

---

Vale la pena repetirlo, ya que siempre causa fallos silenciosos:

```markdown
# ❌ En SOUL.md — los subagentes no pueden ver esto
Cuando el usuario pregunte sobre finanzas, delega a finance-agent.

# ✅ En AGENTS.

---

# ✅
```
sessions_spawn(
    task="analizar las cifras del Q4",
    label="q4-sales-analysis-2026"
)
```

Sin una etiqueta, `/subagents list` te da un muro de sesiones anón

---

El mecanismo `announce` es unidireccional: el subagente informa al completarse. No puede pausar para hacer una pregunta aclaratoria a mitad de la ejecución.

Esto significa que tu prompt de tarea tiene que contener todo lo que el agente necesita:

```python
# ❌ Demasiado vago — producirá basura o nada
sessions_spawn(task="analyze the data", label="analysis")
```

---

# ✅ Autónomo
sessions_spawn(
    task="""
    Analizar /data/sales_jan_2026.csv.
    Salida: 1) Ingresos mensuales totales, 2) Top 5 productos por unidades,
    3) Cambio MoM (mes a mes) vs /data/sales_dec_2025.csv.
    Formato: Tabla Markdown. Guardar en /output/jan_2026_report.md.
    Si falta alguno de los archivos, escribir en /output/errors.log y detenerse.
    """,
    label="jan-2026-analysis"
)

---

Piénsalo como si escribieras instrucciones para alguien que va a entrar en una habitación, cerrar la puerta y no puede volver a salir para preguntarte nada.

---

### 20. Vigila tus límites de concurrencia

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 3
      }
    }
  }
}
```

`maxChildrenPerAgent` limita cuántos subagentes puede generar un padre (predeterminado: 5). `maxConcurrent` es el límite máximo global de agentes en paralelo (predeterminado: 8).

---

Alcanzar cualquiera de los dos límites no bloquea nada —los agentes se encolan—, pero la latencia aumenta. Si tienes un plan de API personal con límites de tasa más bajos, bajar `maxConcurrent` a 3 o 4 evita los errores 429. En un plan empresarial, puedes aumentarlo.

---

---

## Control de Costos {#chapter-4}

---

### 21. Instalar save-money para el enrutamiento automático de modelos

```bash
openclaw install save-money
```

La habilidad monitorea la complejidad de la tarea y la enruta al modelo más económico que pueda manejarla: Haiku para clasificación y formato, Sonnet para generación estándar, Opus para cualquier cosa que requiera razonamiento real. El umbral es configurable.

---

Los usuarios informan consistentemente una reducción de costos mensuales de más del 50%. El enrutamiento no es perfecto, pero no necesita serlo — incluso enrutar el 60% de las tareas a Haiku en lugar de a Opus se acumula rápidamente.

---

### 22. Compactación de Contexto para sesiones de larga duración

Tanto Claude Opus como Sonnet 4.6 admiten la Compactación de Contexto. Cuando el historial de la conversación se alarga, la compactación resume de forma inteligente en lugar de truncar. Mantienes la coherencia; no te topas con un muro.

---

Especialmente relevante para agentes de investigación que se ejecutan durante varias horas, edición iterativa de documentos y largas sesiones de depuración. Si tus agentes se acercan regularmente a los límites de contexto, activa esta opción.

---

### 23. uso de openclaw: ejecútalo y analízalo

```bash
openclaw usage
```

Desglosa el consumo de tokens por sesión, modelo y herramienta. La mayoría de la gente lo ejecuta una vez, mira por encima el total y lo cierra. El valor está en el desglose por agente.

---

En qué fijarse: un subagente que usa 5 veces más tokens que el resto (el prompt es demasiado largo), una herramienta invocada 20 veces en una sola sesión (el agente está en un bucle), Opus en tareas que Sonnet podría manejar (enrutamiento mal configurado). Corregir estos patrones se amortiza por sí solo.

---

### 24. Fijar gpt-4o-mini para resumen y clasificación

---

{
  "tareas": {
    "resumir":   { "modelo": "openai/gpt-4o-mini" },
    "clasificar":{ "modelo": "openai/gpt-4o-mini" },
    "traduc

---

### 25. Los datos sensibles pasan por un modelo local

```json
{
  "mcpServers": {
    "local-llm": {
      "model": "ollama/qwen2.5",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

---

Registros financieros, datos de empleados, documentos internos — todo lo que no debería salir de tu red va a Ollama. Qwen2.5 funciona bien en hardware local (múltiples opciones de tamaño desde 0.5B hasta 72B), soporta un contexto de 128K y maneja la llamada a funciones. Es más lento que las API en la nube, pero para cargas de trabajo sensibles, esa es la concesión que se hace.

---

---

## Depuración y Seguridad {#chapter-5}

---

### 26. Registros detallados antes que nada

```bash
openclaw debug --verbose
/subagents log <runId>
```

El registro detallado muestra cada llamada a herramienta, cada decisión de enrutamiento y el contexto completo en cada paso. Nueve de cada diez veces, el problema es evidente en el momento en que ves el registro — el agente intentó llamar a una herramienta que no existe, se quedó atascado en un bucle de reintentos o estaba trabajando desde un prompt que no incluía la información que necesitaba.

---

No depures por hipótesis cuando puedes simplemente leer lo que pasó.

---

### 27. El timeout y el fallo son diferentes — trátalos de forma diferente

```bash
/subagents list
```

Revisa la columna `status` antes de hacer cualquier cosa:

- `timeout` — el agente superó `runTimeoutSeconds`. Aumenta el límite, vuelve a ejecutar. Ejecutarlo de nuevo con la misma configuración reproduce el timeout.
- `error` — un fallo real. Abre el log, busca el mensaje de error.

---

Necesitan correcciones diferentes. Tratar un tiempo de espera agotado como un fallo te envía en la dirección equivocada.

---

### 28. Escanear las skills instaladas con clawdefender

```bash
clawdefender scan --all
```

Después de ClawHavoc, esto

---

Si una skill falla, desinstálala y busca una alternativa con una puntuación de seguridad más alta. No hay una forma segura de «confiar parcialmente» en una skill que está intentando exfiltrar credenciales.

---

### 29. Ámbito de OAuth: solicita exactamente

---

| No solicitar | Solicitar en su lugar |
|---------------|-----------------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

Una habilidad de lectura de calendario no necesita acceso de escritura. Una habilidad de redacción de correos electrónicos no necesita eliminar mensajes. Las solicitudes de alcance que exceden lo que promete la descripción de la habilidad son una señal de alerta que vale la pena investigar antes de autorizar.

---

### 30. TinyClaw tiene todo esto preconfigurado

---

La configuración de esta guía —ajustes de tiempo de espera, políticas de cleanup, enrutamiento de modelos, valores de seguridad por defecto— ya está integrada en TinyClaw. Si prefieres saltarte la configuración y tener una instancia lista para producción funcionando en menos de un minuto:

```

---

## Sáltate todo esto: TinyClaw {#tinyclaw}

La configuración manual de OpenClaw, si conoces los pasos, toma aproximadamente una hora:

| Paso | Tiempo |
|------|------|
| Aprovisionar un servidor | 15 min |
| Configurar claves SSH | 10 min |
| Instalar Node.js | 5 min |
| Instalar y configurar OpenClaw | 17 min |
| Conectar a un proveedor de IA | 10 min |
| **Total** | **~60 min** |

Si no tienes conocimientos técnicos, multiplica por 10 — tienes que aprender cada paso antes de hacerlo.

---

TinyClaw omite esto por completo. Los servidores están preaprovisionados, el entorno ya está configurado. Eliges tres cosas:

**Modelo:** Claude Opus 4.6, GPT-5.2 o Gemini 3.1 Pro

**Canal:** Telegram, Discord o WhatsApp

**Cuenta:** Inicia sesión con Google.

Ese es todo el proceso. En menos de un minuto.

Lo que puedes hacer inmediatamente después:

---

- Leer y resumir correos electrónicos, redactar borradores de respuestas
- Recordatorios de reuniones y detección de conflictos de agenda
- Seguimiento de gastos a partir de recibos
- Investigar a la competencia, filtrar clientes potenciales
- Resúmenes de reuniones diarias, seguimiento de OKR
- Redactar borradores de contratos, descripciones de puestos de trabajo, publicaciones para redes sociales
- Comparación de precios, búsqueda de cupones

Y cualquier otra cosa que puedas describir en una frase. Las plazas en el servidor son limitadas — comprueba la disponibilidad en [tinyclaw.dev](https://tinyclaw.dev).

---

---

## Referencia rápida

| Capítulo | Consejos | Leer cuándo |
|---------|------|-----------|
| Configuración | 01–08 | Antes de tocar la configuración |
| Habilidades | 09–14 | Antes de instalar cualquier cosa |
| Subagentes | 15–20 | Antes de crear flujos de trabajo multiagente |
| Costo | 21–25 | Después de tu primera carga de trabajo real |
| Depuración y seguridad | 26–30 | Cuando las cosas se rompen |

---

---

## Recursos

- [docs.openclaw.ai](https://docs.openclaw.ai) — documentación oficial
- [clawhub.ai](https://clawhub.ai) — habilidades seleccionadas, auditadas en seguridad
- [agentskills.io](https://agentskills.io) — catálogo más amplio, de cola larga
- [tinyclaw.dev](https://tinyclaw.dev) — despliegue con un solo clic
- [agentputer.com](https://agentputer.com) — alojamiento en la nube 24/7

---

---

*Fuentes: documentación de OpenClaw (docs.openclaw.ai) · datos de seguridad de ClawHub (feb. de 2026) · documentación del modelo de Anthropic (docs.anthropic.com) · documentación de context7 (context7.com)*