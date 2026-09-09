# Traspaso — Ejercicios interactivos

Actualizado: 2026-09-09 · Sesiones previas: 2

## Objetivo
Aplicación web para que los alumnos de Juan Luis (profesor de Matemáticas de
Secundaria, programa bilingüe, cuentas de murciaeduca) hagan desde el móvil
ejercicios de opción múltiple generados al azar y autocorregibles, con feedback
ligado al error concreto, refuerzo automático y solución paso a paso. Él manda
las tareas, da de alta a los alumnos y descarga un CSV con el desempeño.

## Estado actual
Hecho y publicado en https://salasgar.github.io/Ejercicios-interactivos/
(repo público `salasgar/Ejercicios-interactivos`, rama `main`, workflow que
pasa los tests antes de publicar; último commit `e4af512`):

- Motor, 9 tipos de ejercicio (7 de cálculo de 1º ESO + `lenguaje_ingles` y
  `lenguaje_espanol`), refuerzo (+2 por fallo, tope 6 por concepto), solución
  paso a paso y pasos del alumno con el error marcado, interfaz bilingüe
  (texto es/en y notación 2,5/2.5 como ajustes independientes, fijables por
  tarea), preguntas de dos opciones «Correcto / Incorrecto».
- Panel del profesor (alumnos, tareas, resultados y CSV) y capa Firebase
  escritos. 79 tests en verde (`npm test`). Recorrido de 270 ejercicios en
  Chrome móvil sin errores de consola.
- Firebase completamente configurado: proyecto «ejercicios-interactivos» en
  la consola (plan Spark), Authentication con Google y correo/contraseña,
  dominio autorizado `salasgar.github.io`, Firestore creado (edición Standard,
  región `eur3 europe-west`, base `(default)`). `src/config.js` tiene el
  `firebaseConfig` real y `PROFESOR_UID` con el uid de Juan Luis
  (`TaU3nTL3CnU5Uwz0GzmrNDdSbTj2`, obtenido entrando con Google). Las reglas de
  `firestore.rules` (con ese mismo uid) están pegadas y publicadas en la
  consola (Firestore → Reglas). **Sin probar todavía de extremo a extremo.**

## Siguiente paso
Prueba de extremo a extremo: dar de alta un alumno con su email de
murciaeduca, crear una tarea, hacerla desde el móvil, descargar los dos CSV.
Vigilar si Google Workspace bloquea la app a los menores («app bloqueada»): si
pasa, alta con usuario y contraseña o pedir autorización al administrador de
murciaeduca (ver README, sección «Si a los alumnos les sale "app bloqueada"»).

Banda de modelo para retomar: MEDIO — sigue siendo trabajo guiado paso a paso
sobre la interfaz (dar de alta, crear tarea, leer capturas de pantalla,
depurar si algo falla), sin decisiones de diseño.

## Decisiones tomadas
| Decisión | Por qué |
|---|---|
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
| Los tests exigen que la solución acabe en la respuesta correcta y los pasos de cada distractor en su valor (salvo `divisibilidad`, marcada `pasosLibres`) | Impide que las explicaciones se desincronicen de los números |
| Distractores de lenguaje basados en errores reales de los alumnos (fourty, thertin, one hundread, «three multiplication four», eigth, dieciseis sin tilde…) | Los aporta Juan Luis; son más valiosos que los inventados |
| Repositorio `Ejercicios-interactivos` (no `salasgar.github.io` raíz) | Como sus otros proyectos; deja libre la raíz |

## Descartado — no volver a proponer
| Se descartó | Motivo |
|---|---|
| Google Sheets + Apps Script, Cloudflare Worker + D1, o sin servidor | Juan Luis eligió Firebase entre las cuatro opciones el 2026-09-08 |
| Google Analytics en el proyecto Firebase | No hace falta y son datos de menores |
| Solo Google como método de acceso | Workspace para Educación puede bloquear apps de terceros a menores; se mantiene el respaldo con contraseña |
| Cloud Functions para restablecer contraseñas | Exige plan de pago Blaze |
| Usar la skill `reparto` para este proyecto | Cabía en una sesión; las tareas delegables se hicieron con subagentes Sonnet |
| Cuatro botones sueltos para idioma y notación | Juan Luis dejó libertad; se hicieron dos selectores segmentados (ES/EN y 2,5/2.5) |
| Guardar la semilla en vez del ejercicio completo en el progreso | Cambiar un generador alteraría lo que el alumno ya vio |

## Archivos
Todo en `/Users/salasgar/Documents/git/Ejercicios-interactivos/`:

- `README.md` — cómo funciona, puesta en marcha de Firebase paso a paso (los 8 pasos), límites conocidos, ideas para más adelante, cómo añadir un tipo de ejercicio, datos en Firestore.
- `src/config.js` — `firebaseConfig` (null, pendiente), `PROFESOR_UID` (vacío, pendiente), `DOMINIO_GOOGLE`, `DOMINIO_ALUMNOS`.
- `firestore.rules` — reglas; hay que sustituir `PROFESOR_UID` por el uid real antes de pegarlas en la consola.
- `src/firebase.js` — Auth (Google y contraseña) y Firestore; alumnos por email.
- `src/main.js`, `src/ui/{login,alumno,tarea,profesor,csv,formulas}.js`, `css/estilos.css`, `index.html` — interfaz.
- `src/motor.js` — generar tarea, responder, refuerzos, resumen (puro).
- `src/ejercicios/index.js` — contrato de los tipos (comentado al principio), `construirOpciones`, `opcionesCorrectoIncorrecto`, `CONCEPTOS`, `TIPOS`.
- `src/ejercicios/*.js` — un generador por tipo; `palabras.js` convierte números a palabras (en/es).
- `src/i18n/{index,es,en}.js`, `src/textos.js` — idioma, notación y resolución de textos.
- `src/altas.js` — análisis del texto pegado para dar de alta alumnos.
- `tests/*.test.js` — 79 tests (`npm test`).
- `.github/workflows/pages.yml` — tests y publicación.

## Preferencias para este proyecto
- Todo en castellano (código comentado en castellano, commits en castellano). Interfaz del alumno bilingüe.
- Pensado para el móvil primero: botones grandes, una columna.
- Cada distractor debe corresponder a un error concreto con su feedback; cuando fallan, quiere ver los pasos del alumno con el error marcado y la solución paso a paso con cada paso explicado.
- Juan Luis manda listas de errores reales de sus alumnos para convertirlas en distractores: incorporarlas tal cual.
- Al empezar una tarea nueva de perfil distinto, decir en una línea «Modelo: seguir así / cambiar a X / sesión nueva» (instrucción global suya).
- Delegar a Sonnet lo acotado (traducciones, generadores nuevos siguiendo el patrón, pasos a paso); la arquitectura la lleva la banda alta.
- Idea futura suya, apuntada en el README: sonidos, personajes animados y frases graciosas cuando haya ejercicios de toda ESO y Bachillerato.

## Contexto que no está en los archivos
- El email del profesor es su Gmail personal (el de esta cuenta); los alumnos entran con cuentas `@murciaeduca.es`. Aún no se sabe si Workspace les dejará entrar en una app de terceros: es lo primero que hay que comprobar con un alumno real.
- Playwright para pruebas de navegador se toma prestado de `/Users/salasgar/Documents/git/Ajedrez-triangular/node_modules/playwright-core` con el Chrome instalado (`channel: 'chrome'`); los scripts de recorrido vivían en el scratchpad de la sesión y no están en el repo.
- Memoria de la sesión con las mismas decisiones: `~/.claude/projects/-Users-salasgar-Documents-git-Ejercicios-interactivos/memory/proyecto-ejercicios-interactivos.md`.
