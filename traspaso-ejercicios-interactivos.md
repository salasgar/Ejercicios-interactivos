# Traspaso — Ejercicios interactivos

Actualizado: 2026-09-10 · Sesiones previas: 3 (esta sigue siendo la sesión 4, continuada desde el iPhone por control remoto sobre la misma instancia de VS Code)

## Objetivo
Aplicación web para que los alumnos de Juan Luis (profesor de Matemáticas de
Secundaria, programa bilingüe, cuentas de murciaeduca) hagan desde el móvil
ejercicios de opción múltiple generados al azar y autocorregibles, con feedback
ligado al error concreto, refuerzo automático y solución paso a paso. Él manda
las tareas, da de alta a los alumnos y descarga un CSV con el desempeño. La
batería de ejercicios se está ampliando para cubrir toda la distribución de
unidades didácticas de 1º y 2º de ESO del departamento (pedido el 2026-09-10).

## Estado actual
Publicado en https://salasgar.github.io/Ejercicios-interactivos/ (repo público
`salasgar/Ejercicios-interactivos`, rama `main`, workflow que pasa los tests
antes de publicar).

**Batería de ejercicios — fases 1 y 2 de la ampliación, terminadas, 99 tests
en verde (`npm test`):** 13 tipos de ejercicio (11 de cálculo de 1º ESO +
`lenguaje_ingles` y `lenguaje_espanol`), motor con refuerzo (+2 por fallo,
tope 6 por concepto), solución paso a paso y pasos del alumno con el error
marcado, interfaz bilingüe (texto es/en y notación 2,5/2.5 como ajustes
independientes, fijables por tarea), preguntas de dos opciones «Correcto /
Incorrecto». Con las fases 1 y 2 (`raices`, `producto_division_fracciones`,
división en `decimales`, `expresiones_algebraicas`,
`ecuaciones_primer_grado`), **1º ESO tiene completas la 1ª evaluación (UD1,
UD2, UD3) y la 2ª evaluación (UD4, UD5, UD6). Falta solo la 3ª evaluación
(UD7 y UD8) para cerrar 1º ESO, y toda 2º ESO.** Ver la hoja de ruta completa
más abajo. Commit `956ec68` (fase 1) subido a GitHub; la fase 2 está
comiteada en local, pendiente de subir (ver «Siguiente paso»).

**Firebase, configurado pero sin probar de extremo a extremo** (sin cambios
desde la sesión anterior): proyecto «ejercicios-interactivos» en la consola
(plan Spark), Authentication con Google y correo/contraseña, dominio
autorizado `salasgar.github.io`, Firestore creado (edición Standard, región
`eur3 europe-west`, base `(default)`). `src/config.js` tiene el
`firebaseConfig` real y `PROFESOR_UID` con el uid de Juan Luis
(`TaU3nTL3CnU5Uwz0GzmrNDdSbTj2`). Las reglas de `firestore.rules` (con ese
mismo uid) están pegadas y publicadas en la consola. Esto es un hilo
independiente de la ampliación de ejercicios: no se ha tocado en esta sesión.

## Siguiente paso
Subir a GitHub el commit de la fase 2 (comiteado en local, sin subir todavía
— `git push`; el workflow pasa los tests y publica solo). Después, seguir la
hoja de ruta por la **fase 3**: UD7 Magnitudes, proporcionalidad, porcentajes
y matemática financiera de 1º ESO (19 sesiones lectivas, 3ª evaluación) —
tipos nuevos `proporcionalidad` (razón, proporción, regla de tres directa e
inversa) y `porcentajes` (cálculo, aumentos/descuentos, interés simple).
Seguir el mismo patrón que `raices.js`, `producto_division_fracciones.js`,
`expresiones_algebraicas.js` y `ecuaciones_primer_grado.js` (ver
«Archivos»); añadir los ids nuevos a `TIPOS`/`CONCEPTOS` en
`src/ejercicios/index.js` y, si llevan solución paso a paso, a `CON_PASOS`
en `tests/ejercicios.test.js`; `npm test` debe seguir en verde antes de dar
la fase por terminada.

Aparte, sigue pendiente de antes (sin relación con la ampliación): la prueba
de extremo a extremo de Firebase — dar de alta un alumno con su email de
murciaeduca, crear una tarea, hacerla desde el móvil, descargar los dos CSV,
vigilando si Google Workspace bloquea la app («app bloqueada»; ver README).

Banda de modelo para retomar cualquiera de los dos: MEDIO — generadores
nuevos siguiendo un patrón ya muy establecido (fase 2 y siguientes) o trabajo
guiado paso a paso sobre la interfaz (prueba de Firebase), sin decisiones de
arquitectura.

## Hoja de ruta de la ampliación (de los dos PDF reales del departamento)
Programación real del IES «Salvador Sandoval», no un temario genérico (ver
«Contexto que no está en los archivos»). Cada fase es un bloque con
checkpoint: se para con los tests en verde antes de seguir con la siguiente.

**1º ESO** (`Distribución de unidades didácticas 1º ESO 2026-2027.pdf`):
- ~~Fase 1~~ — UD1 (raíces), UD4 (producto/división de fracciones), UD5
  (división de decimales). Hecha el 2026-09-10.
- ~~Fase 2~~ — UD6 Álgebra (2ª evaluación): `expresiones_algebraicas`
  (valor numérico con y sin paréntesis, reducir términos semejantes,
  traducir «el doble/triple de un número más/menos b»), `ecuaciones_primer_grado`
  (x±a=b, a·x=b, a·x±b=c, a·(x±b)=c). Hecha el 2026-09-10.
- Fase 3 — UD7 Magnitudes, proporcionalidad, porcentajes y matemática
  financiera (3ª evaluación): `proporcionalidad` (razón, proporción, regla de
  tres directa e inversa), `porcentajes` (cálculo, aumentos/descuentos,
  interés simple).
- Fase 4 — UD8 Geometría (3ª evaluación, 25 sesiones, la unidad más grande):
  pendiente decidir con Juan Luis cuántos tipos hacen falta (candidatos:
  ángulos y clasificación de polígonos/triángulos; perímetros y áreas de
  figuras planas incluido el círculo). Cierra 1º ESO.

**2º ESO** (`2eso_ud-y-temporalizacion_25-26.pdf`, mismo departamento):
- Fase 5 — 1ª evaluación: UD1 Números enteros/divisibilidad/potencias y
  raíces (repaso + exponente negativo o cero: ampliar `potencias.js` con
  formas nuevas, no hace falta un tipo nuevo, igual que se hizo con
  `decimales.js` en la fase 1); UD2 Números decimales y fracciones (tipo
  nuevo `operaciones_racionales`: operaciones combinadas, conversión entre
  fracción y decimal); UD3 Proporcionalidad y porcentajes más avanzado
  (ampliar `proporcionalidad`/`porcentajes` de la fase 3, o tipo nuevo
  `porcentajes_encadenados` para aumentos/descuentos sucesivos e interés
  compuesto sencillo).
- Fase 6 — 2ª evaluación: UD4 Polinomios y ecuaciones de primer y segundo
  grado (`polinomios`, `ecuaciones_segundo_grado`, y ampliar
  `ecuaciones_primer_grado` con formas más difíciles); UD5 Sistemas de
  ecuaciones (`sistemas_ecuaciones`); UD6 Estadística (`estadistica`:
  medidas de centralización, quizá dispersión y lectura de tablas/gráficos).
- Fase 7 — 3ª evaluación: UD7 Funciones (`funciones_lineales`: tablas,
  pendiente, ordenada, lectura de gráficas); UD8 Geometría plana
  (`teorema_pitagoras`, más lo que salga de la fase 4 aplicado a 2º); UD9
  Cuerpos geométricos. Volúmenes (`cuerpos_geometricos`: áreas y volúmenes de
  prismas y cilindros). Cierra 2º ESO.

Ni «estadística/probabilidad» ni «lenguaje matemático» son UD del
departamento en 1º ESO: `lenguaje_ingles`/`lenguaje_espanol` son un añadido
propio para el programa bilingüe, no del temario oficial (el README ya lo
aclara en la tabla de tipos).

## Decisiones tomadas
| Decisión | Por qué |
|---|---|
| La hoja de ruta de la ampliación sigue la programación real del departamento (dos PDF que dio Juan Luis), no un temario LOMLOE genérico | Se lo pidió el 2026-09-10 con AskUserQuestion: «mi programación exacta» en vez de «desglose estándar» |
| En 2º ESO entran ya sistemas de ecuaciones, ecuaciones de segundo grado sencillas, cuerpos geométricos y funciones lineales | Juan Luis los confirmó explícitamente el 2026-09-10; algunos centros los aplazan a 3º, el suyo no |
| La ampliación se hace por fases con checkpoint, en varias sesiones | Juan Luis eligió «trocear en varias sesiones» frente a «todo de una vez» el 2026-09-10, ante ~18-20 tipos nuevos |
| Los dos PDF de la programación no se comitean (`.gitignore: *.pdf`) | Son documentos internos del departamento; el repo es público |
| Aproximaciones (p. ej. raíces no exactas) reutilizan el flag `pasosLibres` que ya existía para `divisibilidad`, en vez de un mecanismo nuevo | Relaja el test de que el último paso «acabe en» el valor exacto; basta con que el valor aparezca (sirve con `\approx`) |
| Una expresión algebraica «coef·x + constante» como opción se representa con el helper `expr(coef, constante, ...)` de `expresiones_algebraicas.js` (`tex` vía `texExpr`, `clave` = `"coef\|constante"`) | Necesario porque `construirOpciones` compara opciones por `clave`, y dos expresiones son la misma solo si coinciden coeficiente y término independiente, no por el texto exacto; reutilizar este helper en `polinomios` (fase 6) en vez de inventar otro |
| En `ecuaciones_primer_grado`, cuando hace falta que una división intermedia salga exacta (fases con paréntesis o dos operaciones), el término independiente se construye como múltiplo del coeficiente (`b = a * bm`) en vez de un número cualquiera | Evita distractores con decimales feos; los mismos tres o cuatro distractores (olvidar el paso, no cambiar el signo, no distribuir) quedan siempre como enteros exactos |
| El campo `curso` de un tipo sigue siendo solo metadato informativo, sin tocar `src/ui/profesor.js` | Confirmado que no filtra nada en la UI; el profesor ya ve todos los tipos mezclados y elige cantidad a mano, así que los tipos de 2º funcionan sin cambios en la interfaz |
| Datos en Firebase (Auth + Firestore, plan gratuito) | GitHub Pages es estático; sin servicio externo no habría CSV con todos los alumnos |
| Acceso principal con Google, usuario/contraseña como respaldo | Los alumnos tienen cuenta de murciaeduca (Google Workspace) y están acostumbrados; el respaldo cubre a quien no la tenga o si Workspace bloquea la app |
| Fichas por email (`alumnos/{email}`), no por uid | Con Google el profesor da de alta por email sin crear cuentas; los de contraseña usan `usuario@alumnos.example` |
| Un solo profesor identificado por uid fijo en `src/config.js` y `firestore.rules` | Lo más simple; no se pone el email del profesor en un repo público |
| Los alumnos con contraseña no pueden cambiarla; el profesor la guarda en `credenciales/{email}` | Restablecer contraseñas ajenas exige Cloud Functions (plan de pago) |
| Sin build: módulos ES, KaTeX y Firebase por CDN, tests con `node --test` | Como Ajedrez-triangular; fácil de mantener y publicar |
| Panel del profesor y CSV solo en español | Son para Juan Luis; lo bilingüe es lo que ve el alumno |
| Texto y notación como dos ajustes independientes con selectores bajo la cabecera; el profesor puede fijar cualquiera por tarea | Pedido por Juan Luis: tareas en inglés y en español, unas con idioma libre y otras fijo |
| TeX neutro (`{,}`, `\cdot`, `\div`) adaptado al mostrar; palabras dentro de fórmulas (`resto`, `mcm`, `mcd`) traducidas al renderizar | Permite cambiar de notación e idioma a mitad de una tarea sin regenerar |
| Feedback, preguntas y notas de pasos en tablas `{es, en}` dentro de cada generador | Cada tipo es autocontenido; los tests exigen los dos idiomas |
| Los tests exigen que la solución acabe en la respuesta correcta y los pasos de cada distractor en su valor (salvo los tipos con `pasosLibres`) | Impide que las explicaciones se desincronicen de los números |
| Distractores de lenguaje basados en errores reales de los alumnos (fourty, thertin, one hundread, «three multiplication four», eigth, dieciseis sin tilde…) | Los aporta Juan Luis; son más valiosos que los inventados |
| Repositorio `Ejercicios-interactivos` (no `salasgar.github.io` raíz) | Como sus otros proyectos; deja libre la raíz |

## Descartado — no volver a proponer
| Se descartó | Motivo |
|---|---|
| Desglose curricular estándar (LOMLOE genérico) para decidir los tipos nuevos | Juan Luis prefirió dar su programación real (los dos PDF); ya no hace falta preguntarlo |
| Aplazar a 3º ESO los sistemas de ecuaciones, las ecuaciones de segundo grado, los cuerpos geométricos o las funciones lineales | Juan Luis los quiere ya en 2º ESO |
| Hacer toda la ampliación (los ~18-20 tipos) en una sola sesión larga | Juan Luis eligió trocear en varias sesiones |
| Comitear los PDF de la programación del departamento al repo | Son documentos internos, el repo es público; se quedan en el disco y en `.gitignore` |
| Google Sheets + Apps Script, Cloudflare Worker + D1, o sin servidor | Juan Luis eligió Firebase entre las cuatro opciones el 2026-09-08 |
| Google Analytics en el proyecto Firebase | No hace falta y son datos de menores |
| Solo Google como método de acceso | Workspace para Educación puede bloquear apps de terceros a menores; se mantiene el respaldo con contraseña |
| Cloud Functions para restablecer contraseñas | Exige plan de pago Blaze |
| Usar la skill `reparto` para este proyecto | Cabe en unas pocas sesiones troceadas con este traspaso; las tareas delegables se hacen con subagentes Sonnet |
| Cuatro botones sueltos para idioma y notación | Juan Luis dejó libertad; se hicieron dos selectores segmentados (ES/EN y 2,5/2.5) |
| Guardar la semilla en vez del ejercicio completo en el progreso | Cambiar un generador alteraría lo que el alumno ya vio |

## Archivos
Todo en `/Users/salasgar/Documents/git/Ejercicios-interactivos/`:

- `README.md` — cómo funciona, tabla de tipos de ejercicio con su unidad didáctica, puesta en marcha de Firebase paso a paso, límites conocidos, ideas para más adelante, cómo añadir un tipo de ejercicio, datos en Firestore.
- `src/ejercicios/index.js` — contrato de los tipos (comentado al principio), `construirOpciones`, `CONCEPTOS`, `TIPOS` (añadir aquí cada tipo nuevo).
- `src/ejercicios/raices.js`, `src/ejercicios/producto_division_fracciones.js` — los dos tipos nuevos de la fase 1.
- `src/ejercicios/expresiones_algebraicas.js`, `src/ejercicios/ecuaciones_primer_grado.js` — los dos tipos nuevos de la fase 2; buen ejemplo reciente del patrón para los tipos que faltan (incluye el helper `texExpr`/`expr` para representar una expresión «coef·x + constante» como opción, con su `clave` de igualdad `"coef|constante"`).
- `src/ejercicios/decimales.js` — ampliado en la fase 1 con división (`divisionDivisorEntero`/`divisionDivisorDecimal`); ejemplo de cómo añadir una forma nueva a un tipo ya existente en vez de crear un tipo nuevo.
- `src/ejercicios/*.js` — un generador por tipo; `palabras.js` convierte números a palabras (en/es).
- `tests/ejercicios.test.js` — `CON_PASOS` (tipos con solución paso a paso comprobada), 99 tests (`npm test`).
- `src/config.js` — `firebaseConfig` y `PROFESOR_UID` ya rellenos.
- `firestore.rules` — reglas ya publicadas en la consola con el uid real.
- `src/firebase.js` — Auth (Google y contraseña) y Firestore; alumnos por email.
- `src/main.js`, `src/ui/{login,alumno,tarea,profesor,csv,formulas}.js`, `css/estilos.css`, `index.html` — interfaz.
- `src/motor.js` — generar tarea, responder, refuerzos, resumen (puro).
- `src/i18n/{index,es,en}.js`, `src/textos.js` — idioma, notación y resolución de textos.
- `src/altas.js` — análisis del texto pegado para dar de alta alumnos.
- `.github/workflows/pages.yml` — tests y publicación.
- `Distribución de unidades didácticas 1º ESO 2026-2027.pdf`, `2eso_ud-y-temporalizacion_25-26.pdf` — programación real del departamento (IES «Salvador Sandoval»); en el disco pero no comiteados (`.gitignore`). Si no están, pedírselos de nuevo a Juan Luis.

## Preferencias para este proyecto
- Todo en castellano (código comentado en castellano, commits en castellano). Interfaz del alumno bilingüe.
- Pensado para el móvil primero: botones grandes, una columna.
- Cada distractor debe corresponder a un error concreto con su feedback; cuando fallan, quiere ver los pasos del alumno con el error marcado y la solución paso a paso con cada paso explicado.
- Juan Luis manda listas de errores reales de sus alumnos para convertirlas en distractores: incorporarlas tal cual.
- Al empezar una tarea nueva de perfil distinto, decir en una línea «Modelo: seguir así / cambiar a X / sesión nueva» (instrucción global suya).
- Delegar a Sonnet lo acotado (traducciones, generadores nuevos siguiendo el patrón, pasos a paso); la arquitectura la lleva la banda alta.
- Para tareas grandes con varias formas de enfocarlas (como esta ampliación), entrar en modo plan y acordar el alcance con AskUserQuestion antes de escribir código.
- Idea futura suya, apuntada en el README: sonidos, personajes animados y frases graciosas cuando haya ejercicios de toda ESO y Bachillerato.

## Contexto que no está en los archivos
- El email del profesor es su Gmail personal (el de esta cuenta); los alumnos entran con cuentas `@murciaeduca.es`. Aún no se sabe si Workspace les dejará entrar en una app de terceros: es lo primero que hay que comprobar con un alumno real, en la prueba de extremo a extremo pendiente.
- Playwright para pruebas de navegador se toma prestado de `/Users/salasgar/Documents/git/Ajedrez-triangular/node_modules/playwright-core` con el Chrome instalado (`channel: 'chrome'`); los scripts de recorrido vivían en el scratchpad de la sesión y no están en el repo.
- El IES es «Salvador Sandoval»; el documento de 2º ESO trae la cabecera «Curso 2025-2026» pero la distribución de unidades no cambia de un curso a otro, así que sigue vigente para 2026-2027.
- Memoria de la sesión con las mismas decisiones: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/proyecto-ejercicios-interactivos.md`.
