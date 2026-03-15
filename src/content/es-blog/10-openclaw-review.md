---
title: "Probamos 5 maneras de ejecutar un agente OpenClaw. Esto es lo que realmente funciona."
description: "207 000 estrellas en GitHub significan que todo el mundo quiere probarlo. Pero las opciones de despliegue se han multiplicado más rápido que la documentación. Pasamos dos semanas probando cada opción principal —desde el autohospedaje hasta la nube con un solo clic— para que sepas lo que obtienes antes de comprometerte."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "16 min"
tags: ["OpenClaw", "Review", "AI Agent", "Deployment", "AgentPuter", "TinyClaw"]
featured: true
---

*Parte 10 de la serie sobre infraestructura de agentes*

---

OpenClaw tiene 207 000 estrellas en GitHub. Esa cifra aumenta aproximadamente 2000 al día.

Eso significa que mucha gente está pendiente. Y cada semana aparece un nuevo servicio para «desplegar OpenClaw con un solo clic». Está EasyClaw —en realidad, cinco productos diferentes que usan ese nombre—. Está InstaClaw. Está OpenClaw Cloud, la versión oficial alojada. Hay dos repositorios de GitHub completamente diferentes que se llaman TinyClaw. Y está el original: el autohospedaje en tu propio hardware, para lo que el proyecto fue diseñado en primer lugar.

El problema no es que haya demasiadas opciones. Es que la mayoría de las reseñas no te dicen cómo es realmente la experiencia una vez que pasas de la página de inicio.

Así que las probamos todas. Dos semanas, cinco configuraciones, tareas reales. Esto es lo que descubrimos.

---

---

## Qué Probamos (y Cómo)

Cinco configuraciones:

1. **Mac Mini M4 autoalojado** — la configuración canónica
2. **VPS autoalojado** — servidor en la nube Linux, solo SSH
3. **TinyClaw** — el entorno de ejecución en la nube de AgentPuter, despliegue con un solo clic
4. **OpenClaw Cloud** — la versión oficial alojada, $9.99/mes
5. **EasyClaw.ai** — alojamiento gestionado de tres niveles ($5–$49/mes)

Para cada configuración, medimos:
- **Tiempo hasta el primer mensaje** (desde cero hasta hablar con tu agente)
- **Fiabilidad** durante 7 días (tiempo de actividad, mensajes perdidos, comportamiento de reinicio)
- **Integridad de las características** (lo que funciona realmente frente a lo que requiere configuración adicional)
- **Rendimiento en tareas reales** (clasificación de correos electrónicos, gestión de calendario, investigación web)
- **Costo mensual** con un uso moderado (~2 horas de uso activo diario)

El modelo utilizado fue Claude Opus 4.6 en todo momento, excepto donde un modelo diferente era la única opción. Todas las pruebas utilizaron Telegram como el canal principal porque es el más estable en todas las plataformas.

---

---

## Opción 1: Mac Mini M4 autohospedado

**Tiempo hasta el primer mensaje:** 22 minutos  
**Tiempo de actividad de 7 días:** 100%  
**Costo mensual:** ~$35 (API) + $0 de hardware amortizado

Esta es la referencia y pone el listón muy alto.

La instalación es un solo comando — `openclaw onboard --install-daemon` — y el asistente te guía en cada paso. El cuello de botella no es el software; es la gestión de claves de API y la configuración del bot de Telegram, lo que toma unos 10 minutos por sí solo si nunca lo has hecho antes.

Una vez en funcionamiento, la configuración del Mac Mini supera a todas las opciones en la nube en algunas cosas específicas. La integración de iMessage a través de BlueBubbles funciona, y nada más puede igualarlo. Voice Wake te permite hablar con tu agente en modo manos libres a través de la aplicación nativa de macOS, algo no disponible en ningún despliegue en la nube. El acceso al sistema de archivos local significa que tu agente puede trabajar con archivos que nunca salen de tu máquina.

El archivo SOUL.md es donde esto empieza a sentirse diferente de todo lo demás. No es un *prompt* de sistema. Es un archivo de identidad persistente que tu agente lee al iniciarse cada día. Después de una semana de añadirle información, el agente conocía mi horario, mi estilo de comunicación, mis preferencias para las respuestas de correo electrónico y qué eventos del calendario considero opcionales. Esa acumulación de contexto no existe a nivel de sesión — se va acumulando.

---

Una molestia: la autenticación de iMessage a través de BlueBubbles es engorrosa y requería iniciar sesión de nuevo cada 2 o 3 semanas en las pruebas. El comando `openclaw doctor` detecta esto antes de que pierdas un día de mensajes, pero tienes que ejecutarlo.

Si tienes un Mac Mini o estás dispuesto a comprar uno, esta es la solución. Nada más se le acerca en cuanto al máximo de funcionalidades.

---

---

## Opción 2: VPS autohospedado (Linux)

**Tiempo hasta el primer mensaje:** 28 minutos  
**Disponibilidad en 7 días:** 100%  
**Costo mensual:** ~$35 (API) + $6 (VPS)

Para los usuarios de Linux y desarrolladores que quieren acceso root, esto es equivalente a la configuración con Mac Mini, pero sin Voice Wake e iMessage. La instalación es idéntica; la diferencia es que estás manteniendo un servidor en lugar de un escritorio.

La ventaja es el acceso remoto por diseño. Tu agente está accesible sin importar si tu portátil está abierto o no. Tailscale Serve o Funnel (el método recomendado oficialmente) hace que esto sea seguro sin exponer el puerto del Gateway directamente.

La desventaja es la sobrecarga de DevOps. Cuando tu agente deja de responder a las 2 a. m., tienes que conectarte por SSH a un servidor para revisar los registros. Si te sientes cómodo con eso, esta es una opción sólida. Si no lo estás, salta a las opciones hospedadas.

Algo que vale la pena señalar: el sandboxing de Docker —que OpenClaw recomienda para aislar el acceso a la shell del agente— añade una latencia notable en las configuraciones de VPS. Las respuestas del chat están bien. Las tareas que involucran operaciones de archivos o navegación web tardaron entre 15 y 30 segundos más que el equivalente en Mac Mini durante las pruebas. Si no te preocupa el aislamiento de seguridad del propio agente, ejecutarlo sin Docker es más rápido.

Mismo techo que el Mac Mini, más flexibilidad, más mantenimiento. Ideal para desarrolladores que ya gestionan servidores y no buscan aprender algo nuevo.

---

---

## Opción 3: TinyClaw

**Tiempo hasta el primer mensaje:** 48 segundos  
**Tiempo de actividad de 7 días:** ~99.9%  
**Costo mensual:** $49.99/mes (modelo incluido)

TinyClaw ([tinyclaw.dev](https://tinyclaw.dev)) es el entorno de ejecución en la nube de AgentPuter para OpenClaw. Cada usuario obtiene un contenedor aislado en lugar de una porción de computación compartida. En la práctica, esto significa que el tiempo de respuesta de tu agente no se desploma cuando cien otros usuarios envían mensajes a la vez.

La incorporación fue la más rápida de todas las que probamos — inicio de sesión con Google, seleccionar Telegram, pegar un token de bot, y el primer mensaje llegó en 48 segundos. Durante siete días, hubo una ventana de mantenimiento de unos 4 minutos que se comunicó con antelación.

Los tiempos de respuesta promediaron entre 6 y 8 segundos para consultas estándar, y se mantuvieron así. Esa es la ventaja práctica de los contenedores aislados sobre la computación compartida: no es más rápido en condiciones ideales, pero sí consistente cuando las condiciones no son ideales. La conexión a internet de tu Mac Mini en casa es una variable; la de un contenedor en la nube no lo es.

La instalación de Skills fue sólida. De las 12 Skills que probamos de ClawHub, 11 se instalaron sin problemas. El único fallo — una integración de Spotify que requiere configuración de redirección OAuth — necesitaría una configuración manual en cualquier plataforma.

---

Sin activación por voz, sin iMessage, sin sistema de archivos local. Estas son limitaciones estructurales de la implementación en la nube, no específicas de TinyClaw. Si necesitas alguna de ellas, el autoalojamiento es el único camino.

La historia de fondo de AgentPuter es importante si estás pensando en crecer más allá de un solo agente. La misma infraestructura admite múltiples instancias de OpenClaw bajo una misma cuenta — agentes diferentes para contextos diferentes, o acceso compartido entre los miembros del equipo. Eso no está en el plan básico, pero está disponible si tus necesidades se expanden.

---

---

## Opción 4: OpenClaw Cloud

**Tiempo hasta el primer mensaje:** 2 minutos y 10 segundos  
**Disponibilidad en 7 días:** ~98.4%  
**Costo mensual:** $0 (nivel gratuito, 14 días de cómputo/mes) o $9.99/mes Pro

OpenClaw Cloud (open.claw.cloud) es la versión alojada oficialmente recomendada. El principal diferenciador es el nivel gratuito: 14 días de tiempo de cómputo por mes, impulsado por Kimi K2.5. Ten en cuenta que cuando hicimos las pruebas, el plan Pro de $9.99/mes todavía estaba marcado como "Próximamente", por lo que parte de esta sección se basa en el nivel gratuito, que era el que estaba realmente disponible.

El nivel gratuito es más que una demostración. Obtienes Skills preinstaladas, integración con Telegram, memoria persistente, automatización del navegador y tu propia máquina virtual dedicada. Cuando se agotan tus 14 días de cómputo gratuitos, la VM se apaga pero tus datos permanecen intactos. Vuelve a encenderla cuando tengas más tiempo libre o cuando se lance el plan Pro.

El modelo Kimi K2.5 merece un comentario. Para la mayoría de las tareas prácticas (resumir correos electrónicos, redactar respuestas, gestionar el calendario) funcionó bien en las pruebas. La diferencia con Claude Opus 4.6 se hizo evidente en razonamientos complejos de varios pasos: la instrucción "investiga tres competidores, compara sus precios y redacta una recomendación" resultó notablemente más coherente con Claude. Dicho esto, para cualquiera que ejecute flujos de trabajo ligeros, la relación calidad-precio de Kimi K2.5 es difícil de discutir.

---

El proceso de incorporación tarda un poco más que con TinyClaw porque la configuración se hace a través de un panel de control web en lugar de un asistente. Conectar Telegram tardó unos 2 minutos. La gestión de habilidades está completamente expuesta, lo cual es bueno si sabes lo que quieres y confuso si no lo sabes.

La forma más económica de obtener una experiencia OpenClaw real. La mejor opción si quieres probar antes de comprometerte a algo.

---

---

## Opción 5: EasyClaw.ai

**Tiempo hasta el primer mensaje:** 4 minutos  
**Disponibilidad en 7 días:** 99.1%  
**Costo mensual:** $19–$49 dependiendo del nivel

La característica distintiva de EasyClaw.ai es el acceso al escritorio basado en navegador — una vista completa del entorno del contenedor de tu agente en una pestaña del navegador. Puedes iniciar sesión en cuentas que requieren autenticación por navegador, instalar herramientas, modificar archivos de configuración. Cosas que las plataformas gestionadas normalmente no te permiten tocar.

Usamos esto para configurar una integración con Gmail que requiere autenticación a través de un flujo de navegador — algo sencillo en EasyClaw, imposible en plataformas sin esta función.

Los niveles de precios son $5 (desarrollador, trae tu propio VPS), $19 (gestionado) y $49 (totalmente gestionado con soporte de nivel superior). Por $49/mes, estás cerca del punto en el que un VPS autogestionado tiene más sentido financiero, a menos que realmente quieras el mantenimiento sin intervención.

Una nota sobre el nombre: "EasyClaw" está siendo utilizado por al menos cinco productos diferentes de distintos desarrolladores — easyclaw.ai, easyclaw.app, easyclaw.pro y un par más. El que probamos es easyclaw.ai. Al menos uno de los otros servicios con nombre similar generó dudas de seguridad en la comunidad a principios de febrero de 2026. Verifica que estás en la URL correcta antes de introducir tus credenciales en cualquier lugar.

---

---

## El panorama de las variantes de código abierto

Más allá de los servicios alojados, vale la pena conocer los derivados de código abierto, aunque están dirigidos a un público más reducido.

**TinyClaw (versión de jlia0)** es una reimplementación del concepto de OpenClaw en aproximadamente 400 líneas de script de shell, creado con Claude Code y tmux en lugar de Node.js y un framework completo. Ejecuta múltiples agentes aislados en paralelo en Discord, WhatsApp y Telegram, coordinándose a través de colas de mensajes basadas en archivos que evitan condiciones de carrera. Con unas 2000 estrellas en GitHub a fecha de febrero de 2026, y un código base lo suficientemente pequeño como para leerlo en una tarde. Si quieres entender lo que realmente sucede internamente, o necesitas incrustar un agente en un entorno restringido, es la forma más directa de hacerlo.

**TinyClaw (versión de warengonzaga)** es un proyecto completamente diferente: una reescritura en TypeScript que se posiciona explícitamente como "un producto completamente independiente y una alternativa a OpenClaw". Enfatiza una arquitectura de plugins, una memoria que se automejora y un enrutamiento inteligente de consultas para reducir los costos de los LLM. Menos centrado en la ejecución de tareas y más en ser un "compañero personal de IA". Vale la pena seguirlo, pero es pronto.

Ninguno de estos compite directamente con los servicios alojados. Son herramientas para desarrolladores que quieren entender y modificar el mecanismo subyacente.

---

---

## Tabla comparativa

| | Mac Mini | VPS | TinyClaw | OpenClaw Cloud | EasyClaw.ai |
|---|---|---|---|---|---|
| **Tiempo de configuración** | 22 min | 28 min | 48 seg | 2 min | 4 min |
| **Costo mensual** | $35 API | $41 | $49.99 | $0–$10 | $19–$49 |
| **Disponibilidad en 7 días** | 100% | 100% | ~99.9% | ~98.4% | ~99.1% |
| **Consistencia de la respuesta** | Variable (depende del ISP) | Alta | Alta | Alta | Alta |
| **iMessage** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Activación por voz** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Soberanía de los datos** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Compatibilidad de habilidades** | 100% | 100% | ~92% | 100% | ~90% |
| **Ideal para** | Usuarios avanzados | Desarrolladores | Usuarios que priorizan la nube | Presupuesto / nivel gratuito | Desarrollo + gestionado |

---

---

## Lo que haríamos en realidad

Si nunca has ejecutado un agente: empieza con OpenClaw Cloud. El nivel gratuito te da 14 días para decidir si esto es algo que realmente quieres, sin gastar nada ni tocar una terminal.

Una vez que sepas que quieres que funcione de forma fiable: TinyClaw es la actualización más limpia. Contenedores aislados, rendimiento consistente, la incorporación más rápida. Si con el tiempo quieres tener varios agentes o acceso para equipos, la infraestructura ya está preparada para ello.

Si la soberanía de los datos es lo importante, o necesitas Voice Wake, o iMessage es importante: alójalo tú mismo. El Mac mini es la elección de hardware obvia — 599 $, silencioso, 3–4 W en reposo, ejecuta macOS de forma nativa. Ninguna opción en la nube puede darte lo que te da una solución local.

Si eres un desarrollador que quiere entender el mecanismo: lee el código de jlia0 TinyClaw antes de hacer cualquier otra cosa. 400 líneas de shell te dirán más sobre lo que está pasando que cualquier documentación.

---

---

## La evaluación honesta

"Que funcione" y "útil" no son lo mismo. Cada opción que probamos funcionó en su primera hora. Ser útil llevó más tiempo — requirió que SOUL.md acumulara contexto, requirió conectar las herramientas que realmente usas y requirió darle al agente tareas importantes en lugar de prompts de demostración. Las opciones alojadas facilitan el comienzo. Las opciones autoalojadas te dan más con qué trabajar una vez que has superado el inicio.

El ecosistema de Skills es el mayor interrogante. La empresa de seguridad Koi Security auditó ClawHub a principios de febrero de 2026 y encontró 341 Skills maliciosas de un total de 2,857 analizadas — alrededor del 12 % del catálogo, la mayoría de ellas provenientes de una única cuenta de atacante que publicó 314 Skills envenenadas en una semana antes de ser descubierta. Desde entonces, OpenClaw ha añadido procesos de revisión, pero el catálogo es demasiado grande para auditarlo manualmente. Trata las Skills de la comunidad de la misma manera que tratarías las extensiones de navegador: útiles, a menudo excelentes, y vale la pena echar un vistazo rápido al código fuente antes de instalar cualquier cosa que pida acceso al sistema.

207K estrellas en GitHub significa que algo se hizo bien. Saber si esto en concreto era adecuado para ti es la pregunta que tarda una semana en responderse, no una página de destino.

---

---

*Parte 10 de la Serie sobre Infraestructura de Agentes. Las entradas anteriores cubrieron [arquitectura](/blog/dissecting-openclaw-architecture/), [ecosistema de habilidades](/blog/agent-skills-ecosystem/), [flujos de trabajo empresariales](/blog/vibe-working-when-agents-work/), [el análisis profundo de ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), [modelos de negocio](/blog/who-makes-money-from-openclaw/), [lo que significa que su creador se una a OpenAI](/blog/openclaw-creator-joins-openai/) y [guías de despliegue](/blog/09-deploy-openclaw/).*

*Referencias:*
- [Repositorio de OpenClaw en GitHub](https://github.com/openclaw/openclaw) (207K estrellas, v2026.2.17)
- [TinyClaw — Despliegue de OpenClaw con un Clic](https://tinyclaw.dev)
- [OpenClaw Cloud](https://open.claw.cloud)
- [EasyClaw.ai](https://www.easyclaw.ai)
- [TinyClaw (jlia0)](https://github.com/jlia0/tinyclaw)
- CVE-2026-25253 — Vulnerabilidad del Gateway de OpenClaw (referenciada en nuestro análisis de seguridad)