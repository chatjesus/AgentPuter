---
title: "Vibe Working: Cuando el \"Simplemente Dile al Agente\" Realmente Funciona"
description: "La IA empresarial ahorra a los analistas 1.5 horas al día; sin embargo, el mejor Agente aún falla en el 53% de las tareas de oficina multi-aplicación. La brecha entre el ahorro de tiempo en una sola aplicación y la automatización de extremo a extremo es donde reside la verdadera oportunidad."
date: "2026-02-12"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["Vibe Working", "Habilidades de Oficina", "AgentPuter", "Productividad", "Agente de IA"]
featured: true
---

En nuestras tres publicaciones anteriores, trazamos un único hilo: desde OpenClaw como producto → hasta su arquitectura Cerebro-Cuerpo-Alma → hasta la pila de capacidades de Habilidades + Gateway + MCP subyacente.

Seguimos diciendo "Las habilidades transformarán el trabajo diario". Es hora de mostrar cómo se ve eso realmente.

---

## I. Microsoft Lo Llamó "Vibe Working"

El 29 de septiembre de 2025, Microsoft lanzó dos funciones en Microsoft 365 Copilot y les dio un nombre: **Vibe Working**.

El **Modo Agente** aterrizó en Excel y Word. Escribes un *prompt* — *"Constrúyeme una calculadora de amortización de préstamos con desgloses de pagos mensuales"* — y el Agente no solo escupe una fórmula. Crea hojas, escribe fórmulas, genera gráficos, valida resultados, detecta errores, los corrige e itera hasta que la salida se verifica. Multi-paso. Auto-corrección.

El **Agente de Oficina** aterrizó en la barra lateral de chat de Copilot. Dices *"Haz una presentación lista para la junta directiva a partir de estos datos trimestrales"* y produce un PowerPoint pulido. No una plantilla con texto de marcador de posición, sino una presentación real con tus números, formateada, lista para presentar.

El nombre se remonta a Andrej Karpathy. El 2 de febrero de 2025, el miembro fundador de OpenAI tuiteó: *"Hay un nuevo tipo de codificación que llamo 'vibe coding', donde te entregas por completo a las vibraciones, abrazas los exponenciales y olvidas que el código siquiera existe."* Siete meses después, Microsoft tomó esa idea del código y la aplicó a hojas de cálculo, documentos y diapositivas: **tú proporcionas la intención, el Agente entrega el artefacto.**

No más luchas con la sintaxis de BUSCARV. No más formateo manual de 47 diapositivas. No más copiado de números entre tres hojas de cálculo y un documento de Word.

Al menos, esa es la promesa. El propio **SpreadsheetBench** de Microsoft muestra que el Modo Agente en Excel alcanza una **precisión del 57.2%** en tareas complejas. Mejor que manual para algunos usuarios, pero muy lejos de ser confiable.

---

## II. La Promesa vs la Realidad

Esto es lo que realmente dice la investigación.

Los *benchmarks* para la automatización de oficinas, como **SpreadsheetBench**, probaron los mejores modelos en flujos de trabajo realistas: filtrar conjuntos de datos, hacer referencias cruzadas de tablas y producir análisis resumidos. Tareas que un oficinista competente maneja diariamente sin pensarlo dos veces.

**Incluso los mejores sistemas fallan casi la mitad del tiempo.** La conclusión de los investigadores es contundente: el rendimiento aún está "muy por debajo de los estándares de precisión humana requeridos por los flujos de trabajo de oficina del mundo real".

Los modos de falla son instructivos:

- **Redundancia de operación**: el Agente repite la misma acción tres veces seguidas, desperdiciando *tokens* y, a veces, corrompiendo su propia salida.
- **Referencias alucinadas**: edita con confianza la celda B14 en una hoja de cálculo que solo tiene 10 filas.
- **Fallos al cambiar de aplicación**: mover datos de Excel a Word a Email rompe el contexto más a menudo que no.
- **Deriva de largo alcance**: en tareas con más de 10 pasos, el Agente olvida gradualmente lo que estaba tratando de lograr.

Pero esto es lo que la mayoría de la gente pasa por alto sobre estos fallos. El propio Equipo Rojo de IA de Microsoft publicó una taxonomía de modos de falla en los sistemas de agentes, y el hallazgo más aterrador no es la alucinación, sino **la erosión de la supervisión humana**.

Cuando el Agente genera una hoja de cálculo que *parece* correcta, los usuarios dejan de verificar las fórmulas. Cuando redacta un correo electrónico que *suena* bien, los usuarios presionan enviar sin leer. El riesgo real no es que el Agente se equivoque. Es que el humano deja de darse cuenta.

Esta es la tensión central en Vibe Working: cuanto más capaz se vuelve el Agente, más peligroso es confiar en él sin protecciones.

---

## III. Cuatro Escenarios: Antes y Después

Antes de sumergirnos en nuestro propio trabajo, algo de contexto sobre lo que ya se ha medido en el mundo real.

Un **estudio de campo de NBER** (aceptado condicionalmente en *American Economic Review: Insights*) rastreó a **7,137 trabajadores del conocimiento** en 66 empresas durante seis meses. Los trabajadores que usaron herramientas de IA integradas dedicaron **entre un 25 y un 31% menos de tiempo al correo electrónico**, aproximadamente entre dos y tres horas menos por semana.

- Los analistas financieros de **Morgan Stanley** ahorraron **1.5 horas por día** en la preparación de investigaciones e informes.
- **Repsol** ejecutó un piloto de Copilot y descubrió que los empleados ahorraban **121 minutos por semana** en promedio, con una mejora del 16.2% en la calidad de la producción.
- **World Wide Technology** implementó Copilot para 941 usuarios y midió **446 horas ahorradas por semana**, principalmente en resúmenes de reuniones, borradores de correo electrónico y generación de informes.

Esos números son reales. Pero el hallazgo enterrado del estudio de NBER es igualmente importante: a pesar de ahorrar horas en el correo electrónico, **no hubo un cambio significativo en la cantidad o composición de las tareas generales de los trabajadores**. Los trabajadores podían acelerar las cosas que controlaban individualmente, pero no podían cambiar los flujos de trabajo que requerían coordinación con otros. La IA aceleró las celdas; no reconectó el organismo.

Esa es la clave. Las herramientas actuales ahorran tiempo en tareas *individuales* dentro de *una* aplicación. La parte difícil, la parte donde la precisión cae a ~50%, es cuando el Agente necesita encadenar tareas en múltiples aplicaciones y entregar un artefacto completo.

Ahí es donde entra en juego la orquestación basada en Habilidades. Esto es lo que hemos estado construyendo y probando.

### Escenario 1: Informe de Ventas Trimestral

**Antes:** Abres tres exportaciones CSV del CRM. Los pegas en Excel. Dedicas 40 minutos a construir tablas dinámicas, escribir fórmulas SUMIFS, formatear colores condicionales y crear gráficos. Luego copias los gráficos en un documento de Word, escribes comentarios sobre ellos y se los envías por correo electrónico a tu gerente. Total: ~2 horas.

**Después:** Le dices al Agente: *"Extrae los datos de ventas del cuarto trimestre, desglósalos por región y línea de productos, marca cualquier cosa que haya caído más del 15% trimestre tras trimestre y dame un informe con gráficos."*

Lo que sucede bajo el capó:
- Se activa una **Habilidad de Informes de Ventas**: conoce la estructura estándar del informe, qué métricas importan y cómo marcar anomalías.
- La Habilidad orquesta **herramientas MCP**: una se conecta a la base de datos CRM, otra escribe en Excel, otra genera el documento de Word.
- El **Gateway** administra la sesión: si la consulta CRM tarda 30 segundos, no se agota el tiempo; si la escritura de Excel falla, lo reintenta.
- Obtienes un libro de trabajo de Excel formateado y un resumen de Word. Total: ~3 minutos de tu tiempo.

El Agente no improvisó. Siguió una receta, una que codifica cómo tu empresa estructura sus informes trimestrales.

### Escenario 2: Notas de la Reunión

**Antes:** Te sientas durante una reunión de 45 minutos. Garabateas notas. Después, dedicas 20 minutos a escribirlas, organizarlas por tema, identificar los elementos de acción y enviarlos a los asistentes. La mitad de las veces te pierdes algo y tienes que revisar la grabación.

**Después:** Dices: *"Transcribe la sincronización del producto de ayer, organiza por tema, extrae los elementos de acción con los propietarios y los plazos, y envía el resumen a todos los que asistieron."*

Bajo el capó:
- Se activa una **Habilidad de Notas de Reunión**: conoce la diferencia entre una decisión, un elemento de acción y una discusión de fondo.
- Las **herramientas MCP** manejan la transcripción (API Whisper), la búsqueda en el calendario (quién asistió) y el envío de correo electrónico.
- La Habilidad aplica el formato preferido de tu equipo, no una plantilla genérica, sino la estructura real que usa tu equipo.

El resultado es un documento que parece que lo escribió un humano, porque la Habilidad fue entrenada sobre cómo tu equipo escribe las notas de la reunión.

### Escenario 3: Revisión de Riesgos del Contrato

**Antes:** El departamento legal te envía un contrato de proveedor de 30 páginas. Lo lees. Destacas las cláusulas que parecen inusuales. Haces referencias cruzadas con los términos estándar de tu empresa. Escribes un resumen de riesgos. Esto lleva la mayor parte de una tarde.

**Después:** Dices: *"Revisa este contrato de proveedor con nuestros términos estándar. Marca las desviaciones, califica cada una por nivel de riesgo y dame un resumen que pueda enviar al departamento legal."*

Bajo el capó:
- Se activa una **Habilidad de Revisión de Contratos**: conoce los términos estándar de tu empresa, los patrones de riesgo comunes y cómo tu equipo legal prefiere las calificaciones de riesgo.
- Las **herramientas MCP** manejan el análisis de PDF, la extracción de texto y la comparación estructurada.
- El Gateway aplica los controles de acceso: los datos del contrato permanecen dentro del tiempo de ejecución seguro, nunca salen del *sandbox*.

Obtienes un informe de riesgo estructurado en 4 minutos. El departamento legal todavía hace la revisión final: el Agente no reemplaza a los abogados, reemplaza las 3 horas de lectura y resaltado que preceden al juicio legal real.

### Escenario 4: Clasificación de Correo Electrónico

**Antes:** Lunes por la mañana. 127 correos electrónicos no leídos. Dedicas 45 minutos a escanear las líneas de asunto, abrir mensajes, categorizar mentalmente (urgente / FYI / necesita respuesta / *spam*) y redactar respuestas. Para cuando terminas, han llegado tres nuevos correos electrónicos urgentes.

**Después:** Dices: *"Clasifica mi bandeja de entrada. Marca cualquier cosa urgente de mis subordinados directos o clientes. Redacta respuestas para cualquier cosa que solo necesite un reconocimiento. Resume el resto en tres puntos."*

Bajo el capó:
- Se activa una **Habilidad de Clasificación de Correo Electrónico**: sabe quiénes son tus subordinados directos, qué clientes son prioritarios y qué significa "urgente" en tu contexto.
- Las **herramientas MCP** se conectan a tu proveedor de correo electrónico, extraen mensajes y redactan respuestas.
- El Gateway asegura que ningún contenido de correo electrónico se almacene más allá de la sesión: cuando la tarea está terminada, los datos desaparecen.

Revisas 127 correos electrónicos en 6 minutos. Editas dos respuestas redactadas, apruebas el resto y sigues adelante.

---

## IV. Qué Hace Que Esto Funcione (y Qué No)

Los cuatro escenarios comparten un patrón. Hagámoslo explícito.

**Lo que hace que funcione:**

1.  **Una Habilidad que codifica el conocimiento del dominio.** No un *prompt* genérico, sino un conjunto de instrucciones estructurado que conoce el formato de informe de tu empresa, el estilo de notas de reunión de tu equipo, la escala de calificación de riesgo de tu equipo legal. Esta es la razón por la que un enfoque basado en Habilidades supera al *prompting* sin procesar.
2.  **Herramientas MCP que manejan la mecánica.** El Agente no necesita "averiguar" cómo conectarse a tu CRM o analizar un PDF. MCP proporciona integraciones pre-construidas y probadas. La Habilidad simplemente dice "usa esta herramienta" y MCP maneja el protocolo.
3.  **Un Gateway que mantiene todo en funcionamiento.** El estado de la sesión no desaparece a mitad de la tarea. Si un paso falla, el Gateway reintenta o revierte. Los permisos se aplican: la Habilidad de revisión de contratos no puede acceder a tu correo electrónico, y la Habilidad de correo electrónico no puede acceder al contrato.

**Lo que no funciona (todavía):**

1.  **Flujos de trabajo entre aplicaciones con muchos pasos.** La tasa de aprobación disminuye significativamente cuando las tareas abarcan más de 4 aplicaciones. La fragmentación del contexto es el mayor problema sin resolver.
2.  **Intención ambigua.** "Mejora este informe" no es suficiente. El Agente necesita una intención específica: "marcar caídas superiores al 15%" es procesable, "haz que se vea bien" no lo es. Vibe Working requiere que los usuarios tengan claro cómo se ve "hecho".
3.  **Configuración inicial.** Una Habilidad necesita aprender las convenciones de tu empresa antes de que pueda replicarlas. El primer informe trimestral requiere esfuerzo para configurarlo. El vigésimo toma 3 minutos.

---

## V. Por Qué Las Soluciones Actuales Se Quedan Cortas

Las funciones de Vibe Working de Microsoft son demostraciones impresionantes. Pero existen limitaciones estructurales en el enfoque actual.

**Copilot está bloqueado en el ecosistema de Microsoft.** El Modo Agente funciona en Excel y Word. ¿Qué pasa si tus datos están en Google Sheets, tu CRM es Salesforce y tus grabaciones de reuniones están en Otter.ai? Necesitas algo que orqueste entre proveedores, no dentro de uno.

**Sin memoria persistente entre sesiones.** Copilot no recuerda que el informe del mes pasado usó un estilo de gráfico específico, o que tu equipo legal prefiere una escala de riesgo de 3 niveles. Cada sesión comienza desde cero. Las habilidades resuelven esto: el conocimiento está en el archivo de la Habilidad, no en la sesión.

**Sin aislamiento de seguridad.** Cuando Copilot procesa tu contrato de proveedor, ¿a dónde van esos datos? ¿A través de la API de OpenAI? ¿De Anthropic? Microsoft usa ambos, y aquí hay un detalle enterrado en su propia documentación: **Los modelos de Anthropic dentro de las experiencias de Microsoft 365 Copilot están explícitamente fuera del alcance del Límite de Datos de la UE**. Si eres una empresa europea que ejecuta el Modo Agente, algunos de tus datos pueden procesarse fuera de los centros de datos de la UE (específicamente en AWS US). Para documentos confidenciales, necesitas un tiempo de ejecución con límites de datos claros: un Gateway con *sandboxing*, no una ventana de chat con API en la nube.

**Los números de precisión son brutales.** 57.2% en SpreadsheetBench para tareas solo de Excel, y ese es el Modo Agente *propio* de Microsoft en su *propio* *benchmark*. El trabajo académico sobre el razonamiento de hojas de cálculo (como SheetBrain, SheetAgent) muestra que incluso los sistemas neuro-simbólicos construidos a propósito necesitan módulos de validación explícitos para evitar la corrupción de datos. La inteligencia del modelo sin procesar, sin importar cuán impresionante sea, no está lista para la producción para la automatización de oficinas sin infraestructura.

---

## VI. El Enfoque Que Estamos Adoptando

La pila de Vibe Working de AgentPuter tiene tres capas, las mismas tres que describimos en nuestra publicación anterior:

**Las habilidades** definen el *playbook* para cada escenario. Una Habilidad de Informes de Ventas es diferente de una Habilidad de Notas de Reunión es diferente de una Habilidad de Revisión de Contratos. Cada una codifica conocimiento de dominio específico, secuencias de pasos, requisitos de herramientas y formatos de salida.

**El Agent Gateway** orquesta la ejecución. Carga la Habilidad correcta, enruta las llamadas a las herramientas MCP, administra el estado de la sesión, aplica los permisos y maneja los fallos. El Gateway es la razón por la que el sistema no se desmorona en el paso 7 de un flujo de trabajo de 12 pasos.

**Las herramientas MCP** manejan las conexiones reales: consultas de bases de datos, E/S de archivos, API de correo electrónico, búsquedas en el calendario, análisis de PDF. Estandarizado, probado, contenedorizado.

¿Qué hace que esto sea diferente de Copilot? Tres cosas:

1.  **Neutral al proveedor.** Nuestro Gateway orquesta a través de Google Workspace, Microsoft 365, Salesforce, Slack, Notion, donde sea que realmente vivan tus datos. No está bloqueado en un ecosistema.
2.  **Conocimiento persistente.** Las habilidades recuerdan tus convenciones entre sesiones. El vigésimo informe trimestral es tan rápido como el segundo, porque la Habilidad ya conoce tu formato, tus métricas, tu audiencia.
3.  **Tiempo de ejecución con seguridad primero.** Cada Habilidad se ejecuta en un entorno *sandbox*. Los datos del contrato no tocan el contexto de la Habilidad de correo electrónico. Los datos de la sesión son efímeros a menos que se persistan explícitamente. Registros de auditoría para cada paso.

---

## Reflexiones Finales

"Vibe Working" es un buen nombre para lo que viene. La idea de que describes lo que quieres y un Agente entrega el artefacto terminado, ese es el estado final hacia el que todos están construyendo.

Pero la verdad honesta es: todavía no estamos allí. La brecha entre la demostración y el controlador diario es real. Las tasas de aprobación de ~50% en los flujos de trabajo de oficina te dicen que la inteligencia del modelo sin procesar no es suficiente.

Lo que cierra la brecha no es un modelo mejor. Es la infraestructura alrededor del modelo:

- **Habilidades** que limitan al Agente a flujos de trabajo probados en lugar de dejar que improvise
- **Un Gateway** que mantiene las tareas de varios pasos en el camino, con reintentos, reversiones y control de acceso
- **Herramientas MCP** que proporcionan integraciones probadas y confiables en lugar de pedirle al Agente que averigüe las API por su cuenta

Durante las últimas cuatro publicaciones, pasamos de diseccionar un proyecto viral de código abierto a construir una imagen completa de lo que realmente requiere la infraestructura de Agentes.

Aquí está la parte que debería molestar a todos los que construyen en este espacio: los analistas de Morgan Stanley ahorran 1.5 horas al día con la IA, sin embargo, el mejor Agente de propósito general todavía falla en la mitad de todas las tareas de oficina de múltiples aplicaciones. **El ROI ya es real, dentro de aplicaciones individuales, con supervisión humana. En el momento en que eliminas al humano o cruzas los límites de la aplicación, las cosas se rompen.**

La conclusión es simple: **el Agente que hace tu informe trimestral no es más inteligente que ChatGPT. Simplemente tiene mejores instrucciones, un tiempo de ejecución confiable y las herramientas correctas conectadas.** Los 7,137 trabajadores en ese estudio de NBER no necesitaban un modelo más inteligente. Necesitaban una mejor infraestructura alrededor del modelo que ya tenían.

Eso es Vibe Working. No vibras. Infraestructura.

---

*Esta es la cuarta publicación de nuestra serie sobre la infraestructura de Agentes. Hemos pasado de OpenClaw → arquitectura → la pila de capacidades de Habilidades + Gateway + MCP → y ahora cómo se ve en la práctica. A continuación, pasaremos al modelo de negocio: ¿cómo se monetiza realmente una plataforma de Agentes? Si tienes un flujo de trabajo de oficina que has intentado, y no has podido, automatizar con IA, nos encantaría saberlo.*