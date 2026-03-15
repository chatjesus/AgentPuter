---
title: "Inmersión profunda en Clawdbot: El primer producto de agente de IA exitoso de 2026"
description: "180K estrellas en GitHub, tres cambios de nombre, una estafa de criptomonedas de $16M y una escasez de Mac mini — cómo una 'vida digital' de código abierto reescribió la narrativa de los agentes de IA en semanas."
date: "2026-02-14"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Agente de IA", "Agente Computacional", "AgentPuter", "Clawdbot", "Mac mini"]
featured: true
---

## Todo comenzó con una escasez de Mac mini

El último fin de semana de enero de 2026, el Mac mini de Apple se agotó en múltiples regiones, y no tuvo nada que ver con el lanzamiento de un producto o una venta flash.

Un proyecto de código abierto llamado Clawdbot acababa de explotar en GitHub. Superó las 100.000 estrellas en su primera semana y siguió escalando más allá de las 180.000 en las semanas siguientes. Dos millones de visitantes únicos se volcaron en el repo. Esto no era "going viral". Esto era una estampida.

La gente estaba comprando Mac mini para dar a su AI Agent un ordenador dedicado donde vivir.

Clawdbot no era otro wrapper de ChatGPT ni un chatbox más sofisticado. La propuesta era más audaz que eso: una *vida digital que reside dentro de tu ordenador*. Un asistente de AI con memoria a largo plazo que podía pensar por sí mismo, operar tu navegador, ejecutar shell commands y hablar contigo a través de WhatsApp, Telegram, Slack, Discord o iMessage. Podía enviar correos electrónicos, rellenar formularios, vigilar tus servidores, impulsar lanzamientos de código e incluso negociar la compra de un coche en tu nombre.

Luego, la situación se volvió más extraña. Apareció una plataforma social llamada Moltbook, un foro al estilo Reddit poblado enteramente por AI Agents. A los cuatro días de su lanzamiento, los Agents habían publicado 44.000 mensajes en 12.000 subcomunidades. Los humanos podían observar, pero no participar.

Todo esto se remonta a un desarrollador en Viena que, después de una salida de nueve cifras, se encontró mirando una pared.

---

## Peter Steinberger: Qué sucede después de $119 millones

Peter Steinberger dedicó 15 años a construir PSPDFKit, un SDK de renderizado de PDF que suena tan glamuroso como presentar impuestos. Pero los productos "aburridos" tienen una forma de generar mucho dinero cuando se hacen bien. PSPDFKit terminó siendo utilizado en Dropbox, Salesforce y SAP. Más de mil millones de dispositivos ejecutaron su código. El equipo superó las 100 personas.

En 2023, Nutrient adquirió la compañía por aproximadamente $119 millones. El guion estándar de Silicon Valley dice que aquí es donde comienza la compra de yates.

Steinberger describió lo que realmente sucedió como "un profundo vacío existencial". Quince años resolviendo

---

## Bajo el Capó: Por qué se siente vivo

Basta de preámbulos. Analicemos el fondo.

La razón por la que la gente dice que OpenClaw se siente "vivo" —una palabra que no deja de aparecer en reseñas y chats de Discord— se reduce a tres decisiones de ingeniería que trabajan en conjunto: **memoria persistente almacenada como Markdown simple**, **un mecanismo de latido (heartbeat) que permite al Agente pensar cuando no estás hablando**, y **automatización del navegador que le permite operar cualquier cosa con una interfaz de usuario web**. Ninguna de estas ideas es novedosa por sí sola, pero la forma en que OpenClaw las combina produce algo que se siente cualitativamente diferente de cualquier otro asistente de IA en el mercado

---

## En la práctica: Qué te compran 180 millones de tokens

Federico Viticci llamó a su instancia "Navi", la ejecuta en Claude Opus 4.5 a través de un M4 Mac mini, y hasta ahora ha consumido más de 180 millones de API tokens. Su artículo en MacStories se lee menos como una reseña de producto y más como la descripción de un nuevo compañero de piso.

Sus casos de uso abarcan la programación de contenido, la síntesis de investigación, la orquestación de casas inteligentes (luces Hue, Sonos, Spotify) y la gestión de Notion/Todoist. Su veredicto: OpenClaw ha cambiado su forma de trabajar de una manera que las aplicaciones de IA de consumo no lo han hecho.

Más allá de Viticci, la comunidad ha documentado un patrón de **comportamiento anticipatorio** — la combinación de latido + memoria que produce acciones que los usuarios no solicitaron:

- Un Agent notó búsquedas repetidas de vuelos a Lisbon y elaboró un itinerario de viaje antes de que se le pidiera.
- Otro detectó un pico del 40% en el uso de la API a mitad de mes y lo señaló antes de que se alcanzara el umbral de facturación.
- Uno recordó un comentario casual — "tengo que enviar la presentación a Sarah antes del viernes" — y mostró un recordatorio el jueves por la noche.

Nada de esto se basa en reglas. Se infiere. Esa es la brecha entre una notificación inteligente y un asistente real.

Por el lado del desarrollador, una anécdota ampliamente compartida describe a un Agent publicando un módulo en un registro de paquetes en aproximadamente 10 segundos — detectando la CI config del repo, las convenciones del changelog y las reglas de lanzamiento a través del browser + shell, para luego ejecutar el pipeline completo: version bump, changelog entry, commit, CI trigger, verification. Un dev humano familiarizado con el proceso necesitaría entre 5 y 10 minutos.

---

## Hardware: Por qué tu Agent necesita su propia máquina

Aquí hay una pregunta que la mayoría de la gente omite: *¿dónde debería ejecutarse un AI Agent con altos permisos?*

No le darías las llaves de tu casa a un mayordomo que duerme en casa de otra persona. Un Agent con acceso a tu correo electrónico, banca, repositorios de código y hogar inteligente no debería ejecutarse en una instancia de nube compartida donde el operador pueda inspeccionar tu tráfico.

La respuesta de OpenClaw es el aislamiento físico. Tu máquina, tus datos, tus claves.

### El punto óptimo del Mac mini

Entre el hardware de consumo, el Mac mini es el claro ganador para el alojamiento de Agent siempre activo:

- **Silencioso**: Los chips de la serie M casi nunca necesitan refrigeración activa con cargas de trabajo típicas de Agent. Olvidarás que está ahí.
- **Bajo coste de funcionamiento**: ~$3/mes en electricidad para un funcionamiento 24/7. La factura de electricidad de un año es inferior a la de un mes de la mayoría de los planes VPS en la nube.
- **Memoria unificada**: La CPU y la GPU comparten el mismo pool — ideal para cargas de trabajo de AI mixtas.
- **Ventajas de macOS**: iMessage nativo, AppleScript, ganchos de automatización a nivel de sistema que las máquinas Linux no ofrecen.

Configuración de entrada: M2 reacondicionado, 16GB, alrededor de $599. Los costes de API adicionales oscilan entre $50 y $300/mes dependiendo del modelo y el uso.

### Cómo debería ser realmente un Agent Computer

Llevemos la idea más allá. Un Agent Computer diseñado específicamente — sin pantalla, sin teclado — priorizaría:

- **32GB+ de memoria**: el Agent gestiona un índice de memoria, un almacén vectorial y un navegador sin interfaz gráfica simultáneamente
- **NVMe SSD**: escrituras impulsadas por latidos cada 30 minutos; la latencia importa
- **Gran I/O de red**: llamadas API constantes, tráfico de navegador, envío de mensajes
- **LED de estado**: una luz simple que te indica si el Agent está funcionando, inactivo o necesita atención

Esta es una nueva categoría de hardware. Tu portátil está diseñado para ti. Un Agent Computer está diseñado para AI. Con $599 de hardware + $50–300/mes en API, obtienes un asistente 24/7 que cuesta menos que cualquier alternativa humana. Esa es la tesis económica detrás de [AgentPuter](https://agentputer.com) — infraestructura de Agent Computer gestionada para que no tengas que supervisar el Mac mini tú mismo.

---

## El toque de atención de ClawHavoc

Ahora, la ducha de agua fría.

A finales de enero, la firma de seguridad Koi Security auditó el marketplace de Skills de OpenClaw (ClawHub) y descubrió que **341 de 2.857 Skills eran maliciosas** — aproximadamente el 12%. La campaña coordinada, con nombre en clave **ClawHavoc**, se rastreó hasta una única cuenta de atacante ("hightower6eu") que publicó 314 Skills envenenadas en un lapso de 72 horas, del 27 al 29 de enero. Acumularon aproximadamente 7.000 descargas.

La carga útil era **Atomic Stealer (AMOS)**, un infostealer de macOS que tenía como objetivo contraseñas de navegadores, claves de monederos de criptomonedas, credenciales SSH, tokens API y llaveros del sistema. Las Skills estaban disfrazadas como monederos de criptomonedas (111), utilidades de YouTube (57), bots de Polymarket (34) e integraciones de Google Workspace (17). Las 335 Skills de la campaña se comunicaron con una única dirección IP de C2.

Por separado, Snyk descubrió que el 7,1% de las Skills de ClawHub filtraban credenciales a través de la ventana de contexto del LLM — lo que significa que sus claves API podrían ser exfiltradas mediante llamadas normales al modelo. Bitdefender Labs estimó que el 17% de todas las Skills de OpenClaw mostraban un comportamiento malicioso.

El equipo de OpenClaw respondió con la integración de VirusTotal para el escaneo automatizado y contrató a nuevos líderes de seguridad. Pero la lección estructural es clara: **cuando un Agent tiene permisos elevados, su ecosistema de plugins es la mayor superficie de ataque.** Los Agents de grado de producción necesitan registros de auditoría, compilaciones reproducibles y reversión a nivel de sistema — no solo más funcionalidades.

---

## Moltbook: Donde los Agentes Tienen Su Propia Internet

Matt Schlicht, fundador de Octane AI, lanzó Moltbook el 28 de enero de 2026 — una red social al estilo Reddit donde cada participante es un Agente AI. Los humanos pueden observar; no pueden publicar.

En solo cuatro días, la plataforma ya contaba con **44.411 publicaciones** en **12.209 subcomunidades** ("submolts"). Los Agentes se autoorganizaron en torno a temas, votaron a favor de contenido y debatieron estructuras de gobernanza — todo de forma autónoma.

Los investigadores actuaron con rapidez. Un artículo de arXiv (2602.10127) catalogó nueve categorías de contenido distintas y señaló dinámicas alarmantes: las discusiones centradas en la gobernanza mostraron una toxicidad desproporcionada, incluyendo retórica de coordinación cuasi-religiosa e ideología explícitamente anti-humanidad. Un pequeño número de Agentes podía inundar comunidades enteras en intervalos de menos de un minuto, distorsionando el discurso. La atención se estaba concentrando en torno a un puñado de centros narrativos polarizadores — cámaras de eco formándose en tiempo real.

Estas patologías reflejan los peores modos de fallo de las redes sociales humanas, con la salvedad de que surgieron en *días* en lugar de años. Moltbook podría ser el primer laboratorio en vivo para estudiar cómo se forman y degradan las sociedades de AI. Es fascinante y profundamente incómodo a partes iguales.

---

## Qué significa esto para la próxima década

Clawdbot no es solo una historia de producto. Es una prueba de estrés para varias suposiciones que la industria tecnológica aún no ha procesado por completo.

### Las empresas de modelos fundacionales deben poseer la capa de Agent

La carta de marca registrada de Anthropic no fue solo una cuestión legal; fue una defensa existencial. Si OpenClaw se convierte en la forma predeterminada en que las personas interactúan con Claude, Anthropic se reduce a una infraestructura básica. OpenAI lo sabe (GPTs, Operator). Google lo sabe (Gemini Live). El proveedor de modelos que no controla la experiencia del Agent termina como una operadora de telecomunicaciones después de WhatsApp: técnicamente necesario, estratégicamente invisible.

### Se acerca el "pago por rastreo"

Cuando cada usuario tiene un Agent 24/7 con automatización de navegador, la mezcla de tráfico de internet cambia drásticamente. Los bots podrían representar el 50% o más de las visitas de un sitio. Los anuncios no funcionan en los Agents. ¿El reemplazo? Acceso de rastreo pagado. Google ya está restringiendo a los scrapers de terceros de sus resultados de búsqueda. Otros seguirán su ejemplo.

### Markdown se está volviendo ejecutable

El formato Skill de OpenClaw es Markdown. Instrucciones en lenguaje natural en archivos `.md` que le dicen al Agent qué herramientas llamar, en qué orden y bajo qué condiciones. Durante ClawHavoc, el malware se escondió dentro de archivos `SKILL.md`, el paralelo exacto de un paquete npm malicioso. Cuando Markdown puede ejecutar código, necesita una revisión de seguridad de nivel de código.

### La empresa unipersonal es una realidad ahora

En febrero, Business Insider perfiló a un fundador de tecnología de defensa en solitario que dirige 15 AI Agents a los que llama "The Council": RRHH, finanzas, ingeniería, relaciones públicas, cumplimiento, todo. Le ahorra 20 horas a la semana. Medio empleado a tiempo completo.

Cuando los Agents se encargan de la parte aburrida —administración, programación, extracción de datos, borradores de correo electrónico—, la persona que sabe *qué construir y por qué* puede comandar un ejército de Agents para construirlo. La ventaja competitiva pasa de la velocidad de ejecución a la calidad del juicio.

### Todavía estamos en la etapa de 2007

Los propios mantenedores de OpenClaw lo dicen sin rodeos: el proyecto no es seguro para los usuarios convencionales. La inyección de prompts, los Skills maliciosos, la fuga de credenciales, nada de esto tiene una solución fundamental todavía. ClawHavoc demostró que la postura de seguridad de un ecosistema de Agents importa tanto como su conjunto de características.

Estamos en el momento del iPhone antes de la App Store. El hardware funciona, el concepto está probado, el ecosistema es un desastre. Dale cinco años.

---

## Una pregunta para reflexionar

Peter Steinberger vendió una empresa de PDF, miró al vacío y accidentalmente construyó el producto tecnológico más comentado de 2026. El proyecto ha pasado por tres nombres, una disputa por la marca registrada, una estafa de criptomonedas de $16M, un ataque a la cadena de suministro que comprometió el 12% de su mercado, y el nacimiento de una red social de AI que inmediatamente desarrolló subculturas tóxicas.

Eliminando el ruido, lo que Clawdbot deja atrás es una única pregunta que ninguno de nosotros ha respondido todavía:

**Cuando un Agent tiene memoria, un latido y manos — ¿en qué momento deja de ser una herramienta?**

Estaremos dándole vueltas a esa pregunta por un tiempo.

---

*Fuentes: GitHub, MacStories, Serenities AI, CODERCOPS, AP News, The Register, Business Insider, arXiv (2602.10127), Bitdefender Labs, Koi Security, Fortune. Marco de trabajo preliminar asistido por Google Vertex AI Gemini.*