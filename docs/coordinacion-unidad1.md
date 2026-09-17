# Coordinación de los tres materiales de cada unidad

Escrito el 2026-09-13, a petición de Juan Luis, para dejar fijada una decisión de
organización que afecta a este repositorio y a la carpeta de apuntes de iCloud.

## La idea

Este proyecto arrancó como una aplicación web de ejercicios autocorregibles. Alrededor
de ella han crecido dos materiales más para la misma asignatura (1.º ESO bilingüe), y
los tres viven en el mismo proyecto porque se retroalimentan:

| Material | Qué es | Dónde vive |
|---|---|---|
| **App web** | Ejercicios de opción múltiple generados al azar, con feedback por error y refuerzo automático. Este repositorio | `src/ejercicios/*.js`, publicada en GitHub Pages |
| **Exámenes tipo test y práctica** | Por semana: un examen en clase de 4 versiones (más una extra) y 8 versiones de práctica con el mismo formato, en LaTeX (ver abajo) | iCloud: `apuntes-1eso-bilingue/<N>. <Unidad>/examenes-en-clase/semana-<N>/` |
| **Hojas de ejercicios** | Una hoja por semana de ejercicios abiertos, en tres niveles (L1, L2, L3), en LaTeX | iCloud: `apuntes-1eso-bilingue/<N>. <Unidad>/hojas-de-ejercicios/` |

**Cambio del 2026-09-17.** Los 20 cuestionarios por semana que se habían planificado
(`cuestionarios/PLAN-DE-ACTUACION.md`) se sustituyen por el paquete semanal de más abajo. De
aquel plan siguen valiendo, como fuentes, las salidas de su fase común
(`cuestionarios/comun/reparto/salidas/`): el banco de preguntas validadas, el inventario
único, los casos de operaciones combinadas y el verificador. Los repartos semanales de
cuestionarios no se llegan a montar.

Sí, es adecuado que vivan juntos, con una condición: **la coordinación es por
documentos con identificadores, no por sesiones que se hablen**. Cada sesión de Claude
Code trabaja en un solo material y no ve a las demás; lo único que comparten es lo que
está escrito en disco. Por eso hace falta una columna vertebral común.

## La columna vertebral: la secuenciación y el inventario único

Para cada unidad hay dos documentos que mandan sobre los tres materiales:

1. **La secuenciación** (`<Unidad>/secuenciación-unidadN.tex`): qué se enseña cada
   semana, en qué orden y con qué hilos transversales. Para la unidad 1: cuatro semanas,
   y el hilo de operaciones combinadas con dificultad creciente desde la semana 1.
   **Ningún material puede usar un contenido antes de la semana en que se enseña.**
2. **El inventario único de la unidad** (`<Unidad>/cuestionarios/comun/reparto/salidas/06-reserva/inventario-unidad1.tsv`
   cuando exista; lo produce la fase común del reparto de cuestionarios): una fila por
   destreza evaluable, con identificador `<semana><parte>-<nn>` (por ejemplo `1B-03`,
   `3C-12`, `2A-05`), descripción en español e inglés, dificultad, semana en que se
   enseña, fuente en la secuenciación y número de casos concretos disponibles.

Los tres materiales **citan esos identificadores**:

- Los exámenes y la práctica, en el campo `item` de cada posición de su generador
  (`generar.py`), que la clave de cada semana imprime.
- Las hojas de ejercicios, en un comentario `% 1C-04` delante de cada ejercicio.
- La app, en un campo `items: ['1A-01', '1A-03']` de cada generador (o de cada
  subtipo, donde un generador cubra varias destrezas).

Con eso se puede responder con un `grep` a «¿qué material practica la destreza `2C-07`?»
y a «¿qué destrezas de la semana 3 no tienen ningún ejercicio en la app?».

## Flujos de retroalimentación

| De | A | Qué pasa |
|---|---|---|
| Banco de 480 preguntas validadas, exámenes y práctica | Hojas | Se usan tal cual o se convierten en ejercicios abiertos («calcula y explica», «di qué opción es falsa y por qué») |
| Casos concretos calculados con `assert` (`casos-A.tsv`) y generadores de los exámenes | App | Son la especificación de un generador: rangos, condiciones (divisiones exactas, radicandos cuadrados perfectos), lo que la app calcula al azar |
| Catálogo de distractores con «por qué es falso» y soluciones explicadas de los exámenes | App | Son los mensajes de feedback por error de la app; el error que explica cada distractor es el `concepto` del refuerzo |
| App (`lenguaje_ingles.js`, `lenguaje_espanol.js`: listas de errores típicos) | Exámenes y práctica | Son la fuente de los distractores de la parte de lenguaje |
| App (resultados por concepto, CSV) | Secuenciación y hojas | Qué destrezas fallan más orienta qué se refuerza en la hoja de la semana siguiente |
| Hojas (retos L3) | Exámenes y práctica | Un reto bien planteado da varios casos concretos de una pregunta difícil |

Regla común a los tres: **todo distractor y toda respuesta modelo tienen que ser
inequívocamente correctos o falsos** (la regla de oro de `CLAUDE.md` y del memorándum
de pruebas tipo test). Un material que falla ahí contamina a los otros dos.

## Estado de la app respecto a la unidad 1

Tipos que ya existen y a qué semana de la secuenciación de la unidad 1 corresponden:

| Tipo | Semana | Observación |
|---|---|---|
| `lenguaje_ingles`, `lenguaje_espanol` | 1 (números), 2 (operaciones), 3 (potencias y raíces) | Cubren las preguntas de lenguaje de los exámenes; falta etiquetar cada subtipo con su semana |
| `jerarquia` | 1 a 4 (hilo de operaciones combinadas) | Hace falta poder pedir el **nivel**, que lo marca el número de operaciones (decisión 5 del 2026-09-14): semana 1, exactamente 2, ya con potencias sencillas y raíces exactas, que vieron en Primaria; semana 2, hasta 3; semana 3, hasta 4, con la raya de fracción; semana 4, hasta 5, con anidados |
| `potencias` | 3 | El exponente negativo y cero es de 2.º ESO; en 1.º solo exponentes naturales |
| `raices` | 3 | Raíz exacta y raíz entera con resto |

Generadores que **faltan** para cubrir la unidad 1 (backlog, en orden de la
secuenciación; no se hacen en esta fase):

1. Valor posicional: valor de una cifra, descomposición polinómica, escribir con cifras un
   número con ceros interiores, construir el mayor o el menor número con condiciones.
2. Redondeo y estimación: redondear a un orden dado, estimar un producto o una suma,
   diferencia entre la estimación y el valor exacto.
3. División con cociente y resto, y la prueba de la división (elegir la comprobación
   correcta; detectar un resto mayor que el divisor).
4. Propiedades de las operaciones: reconocer la propiedad aplicada, sacar factor común,
   contraejemplos de la conmutativa y la asociativa.
5. Cálculo mental: compensación y descomposición (elegir la estrategia correcta).
6. Problemas de enunciado: elegir la expresión que modela el problema; paréntesis
   imprescindible; interpretar el resto.

Y una función nueva de la app que da sentido a todo lo anterior: **la tarea semanal**,
que el profesor crea eligiendo una semana de una unidad y que reúne los generadores cuyos
`items` pertenecen a esa semana o a semanas anteriores, con el nivel de jerarquía que le
corresponde.

## El paquete de cada semana

Decidido por Juan Luis el 2026-09-17. Para cada semana de la unidad hace falta:

1. **Inventario** de los contenidos de la semana (extracto del inventario único) y un PDF
   adaptado para los alumnos, a modo de lista de «sé hacerlo», sin casos de examen.
2. **Examen en clase**: 4 versiones de 20 preguntas tipo test (`.tex` y PDF), con el
   **orden de las preguntas barajado** en cada versión. Folio a doble cara con franja
   recortable de respuestas; la infografía del procedimiento sirve para todo el curso.
3. **Examen resuelto** (`.tex` y PDF), para Classroom **después** del examen (los dos grupos lo
   hacen el mismo día): cruces, opción correcta y **explicación de cada opción**.
4. **Versión extra** del examen, con su resuelto, para quien falte.
5. **Tabla de claves** de todas las versiones, para corregir.
6. **Práctica**: 8 versiones con el mismo formato, que entre todas cubren el inventario de la
   semana (dos bloques de 4 que lo cubren cada uno), también con el orden barajado para que no
   se aprenda la plantilla. Un PDF con las 8 y otro con sus soluciones explicadas; se suben el
   lunes avisando de que son los contenidos de la semana.
7. **Hoja de ejercicios** abiertos (L1/L2/L3) con **solucionario explicado** para alumnos.
8. **Vocabulario**: glosario completo en PDF y diapositiva 16:9 para la pizarra, solo con
   términos de las 4 versiones del examen.

Puntuación del examen: acierto $+1$, fallo $-1/(N-1)$ ($-1/3$ con 4 opciones), en blanco 0; la
nota nunca baja de 0. Duración: 55 minutos de clase, unos 50 efectivos. Las pruebas semanales
pesan poco en la nota: tras el primer examen se revisa el acierto por pregunta y por versión
para mejorar el material, sin exigir equivalencia exacta.

## Cómo llega cada material a los alumnos

Decisiones de Juan Luis del 2026-09-17:

- **Hojas de ejercicios**: impresas a doble cara (por eso cada hoja ocupa **exactamente dos
  páginas**; no deben crecer) y además subidas a Classroom.
- **Soluciones de las hojas**, con las explicaciones paso a paso: **solo en Classroom**, para
  no gastar papel (ocupan 6-7 páginas por semana).

## Lo que se practica pero no se evalúa

Contenidos que aparecen en las hojas o en sus soluciones como **ampliación para los alumnos
más aventajados**, y que **no pueden aparecer en los exámenes semanales ni en sus versiones
de práctica** (y tampoco conviene que la app los exija):

| Contenido | Dónde aparece | Qué sí entra en el examen |
|---|---|---|
| La regla general **«el resto de una raíz entera es como mucho $2\times$ raíz»** | Soluciones de la semana 3, ejercicio 12 | La destreza `3C-22` solo en su forma concreta: comprobar que con un resto demasiado grande se llega al cuadrado siguiente (raíz 4 y resto 9 da $16+9=25=5^2$, así que la raíz era 5). Nunca la fórmula general. |

## La tercera línea: adaptación al perfil de cada alumno

Queda registrada como objetivo del proyecto, **sin diseñar todavía**. Lo que ya existe
apunta en esa dirección (refuerzo automático por concepto fallado, resultados por
alumno y concepto). Cuando se diseñe, la unidad de adaptación debería ser el
identificador del inventario: «este alumno falla `1A-03` y `2C-07`» es lo que permite
elegir qué generar, qué hoja recomendar y qué preguntas del banco poner en su repaso.

## Dónde está cada cosa (unidad 1)

- Secuenciación y resumen para familias:
  `~/Library/Mobile Documents/com~apple~CloudDocs/ex Dropbox/mat/1º ESO/apuntes-1eso-bilingue/1. Natural numbers, powers and roots/`
- Exámenes, práctica y vocabulario: `…/1. Natural numbers, powers and roots/examenes-en-clase/`
  (una carpeta por semana; la semana 1 tiene `generar.py`, que produce examen, resuelto,
  versión extra y clave).
- Fuentes heredadas del plan de cuestionarios, de solo lectura:
  `…/1. Natural numbers, powers and roots/cuestionarios/comun/reparto/salidas/` (banco,
  inventario único, casos de combinadas, verificador).
- Hojas: `…/1. Natural numbers, powers and roots/hojas-de-ejercicios/` (encargo en
  `ENCARGO-hojas-semanales.md`).
- Archivo de la tanda anterior de cuestionarios, de solo lectura:
  `…/apuntes-1eso-bilingue/pruebas-oc/`.

Las sesiones que producen exámenes, práctica u hojas **no escriben en este repositorio**;
solo lo leen (las listas de errores). Los cambios en la app se hacen desde sesiones
abiertas en el repositorio, con `npm test`.
