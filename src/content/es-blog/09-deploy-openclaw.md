---
title: "Cuatro formas de desplegar OpenClaw: Mac Mini, VPS, Pod en la nube o en menos de 60 segundos"
description: "OpenClaw superó las 207.000 estrellas en GitHub esta semana. Aquí te explicamos cómo configurarlo de verdad —desde bare metal hasta la nube con un solo clic— sin las lagunas que la mayoría de los tutoriales dejan."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Deployment", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "Tutorial"]
featured: true
---

*Parte 9 de la Serie sobre Infraestructura de Agentes*

---

OpenClaw es el proyecto de IA de código abierto de más rápido crecimiento en GitHub en este momento: 207.000 estrellas, 38.000 forks, 683 colaboradores, más de 12.000 commits. El editor de MacStories, Federico Viticci, consumió 180 millones de tokens con su instancia "Navi" y lo llamó "lo que cambió la forma en que uso la IA". Las unidades de Mac Mini se agotaron en las Apple Stores de varias ciudades, en parte porque la gente quería una máquina dedicada y siempre encendida para ejecutarlo.

Quieres probarlo. La pregunta es: ¿cómo se configura realmente?

Los tutoriales existentes se dividen en dos categorías: o bien asumen que ya sabes lo que es `systemd`, o se saltan tres pasos y te dejan mirando un error. Esta guía cubre cuatro caminos —desde construir tu propio servidor local hasta desplegar en menos de 60 segundos— para que puedas elegir el que mejor se adapte a tu nivel de habilidad y prioridades.

**Los cuatro caminos:**

---

| Ruta | Tiempo | Nivel de Habilidad | Ideal Para |
|------|------|-------------|----------|
| A. Mac Mini | 15–30 min | Conceptos básicos de la terminal | Privacidad primero, control total |
| B1. VPS autogestionado | 15–30 min | SSH + operaciones de Linux | Desarrolladores, cumplimiento |
| B2. AgentPuter | ~2 min | CLI básico | Multiagente, cero DevOps |
| C. TinyClaw | < 1 min | Ninguno | Todos |

---

---

## Primero: ¿Qué es OpenClaw? (Versión de 30 segundos)

OpenClaw no es otro chatbot que visitas en un navegador. Es un **asistente personal de IA que funciona 24/7 en segundo plano** y habla contigo a través de las aplicaciones de mensajería que ya usas — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (a través de BlueBubbles), Microsoft Teams, WebChat, Matrix, y más. Doce canales y sumando.

Lo que lo diferencia de ChatGPT:

- **Memoria persistente.** OpenClaw tiene un archivo `SOUL.md` que define quién es para *ti* — tu nombre, tus preferencias, tu estilo de trabajo, tu zona horaria. Recuerda la información entre sesiones.
- **Acciones en el mundo real.** Lee tu correo electrónico, gestiona tu calendario, opera sobre tus archivos, controla dispositivos de hogar inteligente, investiga y redacta respuestas — de forma autónoma.
- **Voz y lienzo.** Voice Wake y Talk Mode (impulsados por ElevenLabs) te permiten hablarle en manos libres. Live Canvas (A2UI) le proporciona un espacio de trabajo visual.
- **Primero local.** Tus datos permanecen en tu equipo. No se entrena con tus conversaciones. Sin nube de terceros a menos que elijas una.

---

**Lo que necesitas para ejecutarlo:**
- Una máquina con **Node.js 22+** (macOS, Linux o Windows a través de WSL2)
- Una suscripción a un modelo de IA: **Anthropic API key o Claude Pro/Max OAuth** (muy recomendado por el creador del proyecto), o OpenAI / Google Gemini
- La recomendación oficial: **Anthropic Pro/Max + Opus 4.6** — el mejor rendimiento con contexto largo y la mayor resistencia a la inyección de prompts entre los modelos compatibles

---

---

## Ruta A: Mac Mini — El servidor local

**A quién va dirigido:** Tienes (o quieres) un Mac Mini. Quieres un control 100 % local. Te importa la soberanía de los datos. Quieres integración con iMessage y activación por voz (Voice Wake).

### Hardware

Un modelo base de Mac Mini M4 (599 $) es más que suficiente: 16 GB de memoria unificada, 256 GB de almacenamiento. Consume entre 5 y 10 W en reposo, aproximadamente 15 $ al año en electricidad. Es silencioso, siempre está encendido y soporta iMessage de forma nativa a través de BlueBubbles, algo que ninguna implementación en la nube puede igualar.

Si compras uno reacondicionado, un M2 con 16 GB también funciona bien. Evita los modelos de 8 GB: OpenClaw más la ventana de contexto del modelo usarán la memoria de intercambio (swap) bajo un uso intensivo, y el uso de la memoria de intercambio en un SSD acorta la vida útil del disco.

### Prerrequisitos

Antes de empezar, confirma que tienes:

- [x] macOS 13 (Ventura) o superior
- [x] Homebrew instalado (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [x] Node.js 22+ (`brew install node@22`, luego verifica con `node --version`)
- [x] Una clave de API de Anthropic, o una suscripción a Claude Pro (20 $/mes) / Max (100 $/mes) para iniciar sesión con OAuth
- [x] Una cuenta de Telegram (el canal más fácil para empezar)

### Instalación paso a paso

**Paso 1: Instala OpenClaw globalmente**

```bash
npm install -g openclaw@latest
```

También puedes usar pnpm (`pnpm add -g openclaw@latest`) o bun. Los tres son compatibles oficialmente.

Deberías ver una salida que termine con algo como:

---

se añadió 1 paquete en 12s
```

Verifica la instalación:

```bash
openclaw --version
```

Salida esperada: `2026.2.17` (o el número de la última versión).

**Paso 2: Ejecuta el asistente de incorporación**

```bash
openclaw onboard --install-daemon
```

El asistente te guiará interactivamente a través de todo:

1. **Elige tu modelo.** Selecciona Anthropic Claude (recomendado). Si tienes una suscripción a Claude Pro/Max, elige el inicio de sesión con OAuth — no se necesita gestionar claves de API.
2. **Introduce tu clave de API o autentícate mediante OAuth.**
3. **Elige un canal de mensajería.** Telegram es el más sencillo para empezar. El asistente te indicará que envíes un mensaje a @BotFather en Telegram, crees un nuevo bot con `/newbot` y pegues el token de vuelta.
4. **Instala el demonio de fondo.** En macOS, esto crea un servicio `launchd` para que OpenClaw sobreviva a los reinicios y se ejecute incluso cuando la terminal está cerrada.

Todo el proceso dura unos 5 minutos.

**Paso 3: Verifica la instalación**

```bash
openclaw doctor
```

Esta es la herramienta de diagnóstico oficial. Comprueba tu versión de Node.js, la conectividad del Gateway, la configuración del canal, el acceso al modelo y el estado del demonio. Cada comprobación debería mostrar una marca de verificación verde. Si algo es amarillo o rojo, el doctor te dirá exactamente qué arreglar.

**Paso 4: Empareja tu primer dispositivo**

---

Abre Telegram y envía cualquier mensaje a tu nuevo bot. El bot responderá con un **código de emparejamiento** — este es el mecanismo de seguridad predeterminado de OpenClaw. Los remitentes desconocidos reciben un código; no pueden interactuar con tu asistente hasta que los apruebes.

```bash
openclaw pairing approve telegram <CODE>
```

Eso es todo. Tu bot ya está activo. Envíale "¿Qué puedes hacer?" y observa cómo responde.

> **Solución de problemas:** Si el bot no responde, ejecuta `openclaw doctor` primero. Problemas comunes: el demonio no se inició (ejecuta `openclaw onboard --install-daemon` de nuevo), o el token de Telegram tiene un error tipográfico (revisa `~/.openclaw/openclaw.json`).

### Después de la instalación

Tres cosas que hacer inmediatamente:

1. **Escribe tu SOUL.md.** Abre `~/.openclaw/workspace/SOUL.md` en cualquier editor de texto. Dile tu nombre, a qué te dedicas, tus preferencias de comunicación, tu zona horaria. Esto no es un prompt — es un archivo de identidad que persiste en cada conversación.

2. **Conecta tus herramientas.** Gmail (a través de Pub/Sub), Google Calendar, Notion, Todoist, Slack — OpenClaw se conecta a través de las herramientas y Skills de MCP. Es posible que el asistente ya te haya solicitado algunos de estos.

3. **Ejecuta una tarea real.** No empieces con "cuéntame un chiste". Prueba: "Resume mis correos no leídos y ordénalos por prioridad" o "¿Qué tengo en mi calendario mañana y tengo algún conflicto?"

### Costos reales

---

| Artículo | Costo |
|---|---|
| Hardware | $599 pago único (Mac Mini M4 base) |
| API (uso moderado) | $15–50/mes (o $20/mes con la suscripción a Claude Pro) |
| API (uso intensivo) | $100–300/mes (nivel Viticci) |
| Electricidad | ~$15/año |
| Tiempo de configuración | 15–30 minutos |

---

---

## Ruta B: Despliegue en la Nube — Autogestionado o AgentPuter

**Para quién es esto:** No tienes un Mac. Usas Linux o Windows. Quieres acceder a tu asistente desde cualquier lugar. Necesitas un tiempo de actividad real 24/7, no "mi portátil está abierto".

Hay dos enfoques para el despliegue en la nube: **gestionar tu propio servidor** (control total, responsabilidad total) o **usar AgentPuter** (un entorno de ejecución en la nube creado específicamente para agentes de IA, cero DevOps). Cubriremos ambos.

---

### B1: VPS Autogestionado

**Para quién es esto:** Sabes usar SSH. Quieres acceso root. Tu empresa requiere infraestructura autohospedada. Estás optimizando por coste.

#### Elige un Servidor

| Proveedor | Especificación Mínima | Coste Mensual |
|-----------|-----------------------|---------------|
| Hetzner | 2 vCPU, 4GB RAM, 20GB SSD | ~$5/mes |
| DigitalOcean | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/mes |
| Vultr | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/mes |

> **Advertencia:** No bajes de 4GB de RAM. Con Docker, 2GB provocarán un OOM-kill del proceso. Confía en mí en esto.

SO: Ubuntu 22.04 LTS.

**Usuarios de Windows:** No necesitas un VPS. OpenClaw soporta oficialmente Windows a través de WSL2, y el README lo marca como "fuertemente recomendado". Instala WSL2 y luego sigue las mismas instrucciones para Linux a continuación.

#### Opción A: Instalación Directa (Recomendado para Principiantes)

```bash
ssh root@your-server-ip
```

---

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar OpenClaw
npm install -g openclaw@latest

# Ejecutar el asistente
openclaw onboard --install-daemon
```

En Linux, el demonio se instala como un servicio de usuario de `systemd` en lugar de `launchd`. Todo lo demás es idéntico a la ruta del Mac Mini — el asistente se encarga de ello.

Verificar:

```bash
openclaw doctor
```

#### Opción B: Docker Compose (Nivel de Producción)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Ventajas:
- Aislamiento de procesos — OpenClaw se ejecuta en su propio contenedor
- Reinicio con un solo comando: `docker compose restart`
- Gestión de registros integrada
- Modo sandbox: establece `sandbox.mode: "non-main"` para ejecutar sesiones de grupo/canal en contenedores Docker aislados

Desventajas:
- Requiere Docker Engine 24+
- Otra capa de abstracción para depurar

El panel de control del Gateway está disponible en `http://localhost:18789` — pero solo localmente, lo que nos lleva a la parte más importante.

#### Acceso Remoto: Haz Esto Correctamente

> **Esto no es opcional.** CVE-2026-25253 demostró que exponer el puerto del Gateway directamente a internet permite la exfiltración de tokens, lo que conduce a la ejecución remota de código. No lo hagas.

**Recomendado: Tailscale Serve/Funnel**

Tailscale te proporciona una superposición de red privada. OpenClaw tiene soporte de primera clase:

---

{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"` — accesible solo dentro de tu red Tailscale (más seguro)
- `"funnel"` — HTTPS público, pero requiere autenticación con contraseña (`gateway.auth.mode: "password"`)

**Alternativa: túnel SSH**

```bash
ssh -L 18789:localhost:18789 user@your-server-ip
```

Luego, accede al panel de control en `http://localhost:18789` en tu máquina local.

#### Copia de seguridad

Todo el estado de OpenClaw se encuentra en `~/.openclaw/`:

| Ruta | Contenido |
|------|----------|
| `openclaw.json` | Configuración principal |
| `workspace/` | SOUL.md, AGENTS.md, TOOLS.md, skills/ |
| `credentials/` | Credenciales de canal (sesión de WhatsApp, token de Telegram, etc.) |

Haz una copia de seguridad de esto diariamente. Un simple trabajo de cron funciona:

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### Los puntos débiles de la autogestión

He estado ejecutando OpenClaw en un VPS autogestionado durante tres meses. Esto es lo que he aprendido:

---

- Tienes que instalar Node.js, configurar systemd, establecer Tailscale y gestionar el TLS por tu cuenta.
- Los tokens de OAuth expiran. Si estás durmiendo en una zona horaria diferente, tu conexión de WhatsApp se cae a las 3 AM y tu agente se queda en silencio hasta que te despiertas y te vuelves a autenticar.
- Después de un reinicio del servidor (actualización del kernel, mantenimiento del proveedor), OpenClaw no siempre se recupera limpiamente. Aprendes a escribir scripts de recuperación.
- Ejecutar múltiples agentes requiere aislamiento manual de procesos y asignación de recursos.

**En una frase: un VPS autogestionado te da la máxima libertad, pero también eres tu propio equipo de DevOps.**

Si ese último párrafo te ha cansado, hay otra manera.

---

### B2: AgentPuter — Un Entorno de Ejecución en la Nube Creado para Agentes de IA

**Para quién es esto:** Quieres despliegue en la nube sin el DevOps. Necesitas soporte para múltiples agentes. Te importa la fiabilidad 24/7 con garantías de SLA.

#### ¿Qué es AgentPuter?

[AgentPuter](https://www.agentputer.com/) no es un VPS genérico. Es un **entorno de ejecución en la nube dedicado y diseñado específicamente para agentes de IA** — OpenClaw, ClawBot, MoltBot y agentes personalizados. Piensa en ello como el "Heroku para asistentes de IA": no gestionas el servidor, el contenedor ni el demonio. Obtienes un Pod que nunca se apaga.

Resuelve los cuatro puntos débiles de los VPS autogestionados:

---

| Problema de un VPS autogestionado | Cómo lo resuelve AgentPuter |
|-----------------------------------|----------------------------------------------------------------|
| Reinicios del servidor = agente desconectado | El Pod se ejecuta 24/7 con recuperación automática y SLA de tiempo de actividad |
| Los tokens de OAuth expiran = reinicio de sesión manual | Gestión de tokens del lado del servidor con actualización automática |
| Los agentes consumen CPU/memoria local | Recursos aislados en la nube; tu máquina local no se ve afectada |
| Acceso solo desde la misma red | Controla tus agentes desde cualquier dispositivo, en cualquier lugar |

#### Implementación en Tres Pasos

```bash
# Paso 1: Crea tu Pod
agentputer create openclaw
# → Asigna un entorno en la nube, elige tu configuración

# Paso 2: Conecta tus servicios
agentputer connect
# → Autoriza Google, Notion, Slack, etc. Las credenciales se almacenan de forma segura en el Pod

# Paso 3: Implementa OpenClaw
agentputer deploy openclaw
# → Tu agente comienza a trabajar 24/7. WhatsApp, Telegram, Discord — todos los canales están activos
```

Tiempo total: unos 2 minutos.

#### Por qué se destaca AgentPuter

---

- **Ejecución paralela de múltiples agentes.** Ejecuta ClawBot (asistente personal) + MoltBot (calendario/programación) + un agente de investigación personalizado en el mismo Pod, cada uno con recursos aislados.
- **Autenticación que nunca expira.** Los tokens OAuth se mantienen en el lado del servidor con actualización automática. Tu conexión de WhatsApp no se caerá a las 3 AM porque un token expiró.
- **Acceso desde cualquier lugar.** Teléfono, tableta, otra computadora — tu IA te sigue a ti, no al revés.
- **Estado actual:** Acceso Anticipado. Solicita un código de invitación en [agentputer.com](https://www.agentputer.com/) — los códigos se envían en un plazo de 24 horas.

#### AgentPuter vs. VPS autogestionado

| | VPS autogestionado | AgentPuter |
|--|-----------------|------------|
| Tiempo de despliegue | 15–30 minutos | ~2 minutos |
| Operaciones | Tú gestionas systemd, Tailscale, copias de seguridad, TLS | Cero operaciones — el Pod se mantiene automáticamente |
| Mult agente | Aislamiento manual | Soporte nativo paralelo |
| Gestión de autenticación | Gestionar la expiración de tokens manualmente | Actualización automática |
| Costo mensual | VPS $5–24 + tarifas de API | Suscripción de Pod + tarifas de API |
| Control | Acceso root al 100% | Limitado al entorno del Pod |
| Ideal para | Habilidades sólidas de operaciones / cumplimiento | Quienes buscan simplicidad / usuarios de múltiples agentes |

---

---

## Ruta C: TinyClaw — 60 segundos, cero terminal

**Para quién es esto:** No quieres aprender a usar herramientas de línea de comandos. No quieres administrar servidores. Solo quieres *usar* un asistente de IA, no *instalar* uno. Quieres probarlo ahora mismo.

### Por qué existe esta ruta

La Ruta A requiere 599 $ y saber qué es Node.js. La Ruta B (autogestionada) requiere SSH, Docker y Tailscale. Incluso AgentPuter, aunque es mucho más simple, todavía implica una CLI y un código de invitación.

La mayoría de la gente ve `npm install -g` y cierra la pestaña.

Las 207.000 estrellas de OpenClaw demuestran que la demanda es real. El cuello de botella no es el producto, es la barrera de implementación. TinyClaw la elimina.

### ¿Qué es TinyClaw?

[TinyClaw](https://tinyclaw.dev) es el producto de consumo creado por el equipo de [AgentPuter](https://www.agentputer.com/). Si AgentPuter es "la nube de agentes de IA para desarrolladores", TinyClaw es "el punto de entrada al agente de IA para todos".

**Tres pasos para empezar:**

1. **Elige tu modelo** — Claude Opus 4.6, GPT-5.2 o Gemini 3
2. **Elige tu canal** — Telegram (Discord y WhatsApp próximamente)
3. **Inicia sesión con Google** → implementación completada

Sin servidor. Sin SSH. Sin Node.js. Sin terminal. La infraestructura está preconfigurada y esperando a serte asignada.

**Del clic a la primera conversación con tu asistente de IA: menos de 60 segundos.**

### Qué puedes hacer con él

Una vez implementado, tu OpenClaw alojado en TinyClaw puede:

---

- Lee, resume y redacta respuestas a tus correos electrónicos
- Gestiona tu calendario, establece recordatorios, resuelve conflictos de agenda
- Resume documentos, redacta contratos, genera facturas
- Realiza un seguimiento de los gastos, compara precios, ayuda con la preparación de impuestos
- Realiza investigaciones de la competencia, redacta publicaciones para redes sociales, realiza un seguimiento de los OKR
- Supervisa las fuentes de noticias, reserva viajes
- Aprende nuevas capacidades a través del lenguaje natural — solo dile lo que necesitas

### La Comparación Definitiva

| | Mac Mini | VPS autogestionado | AgentPuter | TinyClaw |
|--|---------|-----------------|------------|----------|
| Tiempo de despliegue | 15–30 min | 15–30 min | ~2 min | < 1 min |
| Habilidad técnica | Terminal | SSH + ops | CLI básico | Ninguna (solo GUI) |
| Costo de hardware | $599 | $0 | $0 | $0 |
| Costo mensual | Solo API | VPS + API | Pod + API | Hosting + API |
| Ubicación de los datos | 100 % local | Tu VPS | Nube de AgentPuter | Nube de TinyClaw |
| Fiabilidad 24/7 | Depende de tu Mac | Depende de tus ops | Respaldado por SLA | Respaldado por SLA |
| Multiagente | Configuración manual | Aislamiento manual | Paralelo nativo | Agente único |
| Gestión de autenticación | Manual | Manual | Actualización automática | Automática |
| iMessage | Sí (BlueBubbles) | No | No | No |
| Activación por voz | Sí (app de macOS) | No | No | No |
| Windows | No | Sí (WSL2) | Sí (CLI) | Sí (navegador) |
| Ideal para | Privacidad / usuarios avanzados | DevOps / cumplimiento | Desarrolladores / multiagente | Todos |

---

---

## Después de la configuración: 7 pasos para convertir tu OpenClaw de un juguete a un empleado

Independientemente de la ruta que hayas elegido, la instalación es solo el comienzo. A continuación, te explicamos cómo hacerlo realmente útil:

### 1. Escribe tu SOUL.md

Ubicación: `~/.openclaw/workspace/SOUL.md`

Esto no es un prompt del sistema. Es un archivo de identidad. Dile:
- Tu nombre, cargo y a qué te dedicas
- Tu estilo de comunicación (¿formal? ¿casual? ¿listas de puntos?)
- Tu zona horaria y horario laboral
- Tus preferencias ("Prefiero Markdown", "Nunca programes reuniones antes de las 10 AM")

Cuanto más específico seas, menos tendrás que repetirte.

### 2. Ejecuta `openclaw doctor`

Haz esto después de la configuración, después de cada actualización y siempre que algo no parezca funcionar bien. Verifica todo — versión de Node, estado del Gateway, conectividad del canal, acceso al modelo, estado del demonio — y te dice exactamente qué arreglar.

### 3. Aprende los comandos del chat

Estos funcionan en cualquier canal conectado — Telegram, WhatsApp, Slack, Discord:

| Comando | Qué hace |
|---------|-------------|
| `/status` | Muestra el modelo actual, el uso de tokens, información de la sesión |
| `/new` o `/reset` | Reinicia la sesión de conversación |
| `/compact` | Comprime el contexto para ahorrar tokens |
| `/think high` | Activa el modo de pensamiento profundo (Opus 4.6) |
| `/verbose on` | Respuestas más detalladas |
| `/usage full` | Muestra el consumo de tokens después de cada respuesta |

---

Estos son tus controles diarios. Solo `/compact` puede ahorrarte entre un 30 y un 40 % en costos de tokens en conversaciones largas.

### 4. Conecta tus herramientas

OpenClaw utiliza herramientas MCP (Model Context Protocol) y Skills para integrarse con servicios externos:

- **Gmail** — a través de Pub/Sub para notificaciones de correo electrónico en tiempo real
- **Google Calendar** — leer, crear y modificar eventos
- **Notion / Todoist / Linear** — gestión de tareas
- **Slack** — tanto como un canal como una herramienta
- **Browser** — OpenClaw puede controlar una instancia dedicada de Chrome

### 5. Planta semillas de memoria

Dale un contexto inicial que recordará para siempre:

> "Tengo una reunión de equipo todos los lunes a las 10 a. m. El nombre de mi jefa es Sarah. Prefiero las respuestas en Markdown. Estoy trabajando en el lanzamiento del primer trimestre para el Proyecto Atlas."

Estos datos persisten en la memoria e informan cada interacción futura.

### 6. Ejecuta un flujo de trabajo real

No lo pruebes con trivialidades. Dale trabajo:

- "Resume mis correos electrónicos no leídos y ordénalos por prioridad"
- "¿Qué hay en mi calendario esta semana? Señala cualquier conflicto"
- "Investiga los 5 principales competidores de [producto] y dame una tabla comparativa"
- "Redacta una respuesta al correo electrónico de [persona] — tono profesional, acepta la reunión pero sugiere el jueves en su lugar"

### 7. Instala Skills de la comunidad

---

Habilita **ClawHub** en tu configuración y tu agente puede buscar e instalar automáticamente nuevas Skills según sea necesario. También puedes explorar manualmente en [SkillsMP](https://skillsmp.com) — el marketplace tiene miles de Skills aportadas por la comunidad para todo, desde la integración con Jira hasta el seguimiento de precios de vuelos.

---

---

## Preguntas frecuentes

**¿Cuánto cuesta la API?**
Uso ligero: ~$15/mes. Moderado: $30–50/mes. Intensivo (nivel Viticci): $100–300/mes. Alternativamente, una suscripción a Claude Pro ($20/mes) o Max ($100/mes) te permite autenticarte mediante OAuth sin tener que gestionar claves de API por separado.

**¿Qué modelo es el mejor?**
El creador del proyecto recomienda encarecidamente **Claude Opus 4.6** — tiene el mejor rendimiento con contextos largos y la mayor resistencia a la inyección de prompts. GPT-5.2 y Gemini 3 también son compatibles. Elige aquel para el que ya tengas una suscripción.

**¿Es seguro?**
Por defecto, OpenClaw utiliza el **emparejamiento por MD** — cualquier remitente desconocido recibe un código de emparejamiento y no puede interactuar con tu asistente hasta que lo apruebes con `openclaw pairing approve`. Las implementaciones locales mantienen todos los datos en tu máquina. Para el acceso remoto, usa Tailscale — nunca expongas el puerto del Gateway (18789) directamente a internet.

**¿Es compatible con el chino?**
Sí. Los modelos subyacentes son compatibles con el chino de forma nativa. Hay un sitio de documentación de la comunidad en clawd.org.cn, y funciona con modelos nacionales como DeepSeek, Moonshot Kimi y Qwen.

**¿Funciona en Windows?**
Sí, a través de WSL2 (Subsistema de Windows para Linux) — oficialmente compatible y muy recomendado. O usa TinyClaw para una experiencia basada en navegador sin ninguna configuración local.

---

**¿En qué se diferencia esto de ChatGPT Plus?**
ChatGPT espera a que lo visites. OpenClaw te contacta — a través de WhatsApp, Telegram, Slack, dondequiera que estés. ChatGPT no tiene memoria persistente entre sesiones; OpenClaw sí. ChatGPT no puede operar en tus archivos o correo electrónico; OpenClaw sí puede. ChatGPT no es compatible con Voice Wake o Live Canvas; OpenClaw sí.

**Algo salió mal. ¿Y ahora qué?**
Ejecuta `openclaw doctor`. Realiza un autodiagnóstico y proporciona instrucciones de reparación específicas. El Discord de la comunidad tiene más de 5,000 miembros activos que pueden ayudar con casos excepcionales.

**¿Cómo actualizo?**
```bash
openclaw update --channel stable
```
También existen los canales `beta` y `dev` si quieres las funcionalidades más novedosas.

---

---

## Reflexiones finales

Cuatro caminos, un destino: tu propio asistente de IA 24/7.

- **Mac Mini** si eres un usuario avanzado que quiere control total, Voice Wake e iMessage.
- **VPS autogestionado** si eres un desarrollador que quiere acceso root y la máxima flexibilidad.
- **[AgentPuter](https://www.agentputer.com/)** si quieres fiabilidad en la nube, soporte multiagente y cero DevOps.
- **[TinyClaw](https://tinyclaw.dev)** si solo quieres que funcione — 60 segundos, sin terminal.

Estos caminos no son mutuamente excluyentes. Puedes empezar con TinyClaw para experimentar OpenClaw en menos de un minuto, pasar a AgentPuter cuando quieras ejecutar múltiples agentes y finalmente construir una configuración totalmente soberana en un Mac Mini cuando estés listo para el control total.

Esta es la Parte 9 de nuestra serie sobre Infraestructura de Agentes. Hemos cubierto [por qué tu agente necesita su propio ordenador](/blog/agent-needs-its-own-computer/), la [arquitectura](/blog/dissecting-openclaw-architecture/) de OpenClaw, el [ecosistema de habilidades](/blog/agent-skills-ecosystem/), los [flujos de trabajo empresariales](/blog/vibe-working-when-agents-work/), [el análisis a fondo de ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), los [modelos de negocio](/blog/who-makes-money-from-openclaw/) y [lo que significa que su creador se una a OpenAI](/blog/openclaw-creator-joins-openai/). Hoy fue el capítulo de "hazlo tú mismo".

---

Si has realizado el despliegue con éxito, ven y cuéntanos en los comentarios o en Discord: **¿qué nombre le pusiste a tu agente y cuál fue la primera tarea real que le asignaste?**

---

*Referencias:*
- [Repositorio de OpenClaw en GitHub](https://github.com/openclaw/openclaw) (207K estrellas, v2026.2.17)
- [AgentPuter — El entorno de ejecución en la nube 24/7 para tu agente de IA](https://www.agentputer.com/)
- [TinyClaw — Despliegue de OpenClaw con un solo clic](https://tinyclaw.dev)
- [Documentación oficial de OpenClaw](https://docs.openclaw.ai)
- CVE-2026-25253 — Exfiltración de token del gateway de OpenClaw (referenciado en nuestro análisis de seguridad)