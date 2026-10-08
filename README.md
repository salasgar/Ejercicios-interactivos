# Ejercicios interactivos de Matemáticas (ESO)

Aplicación web de ejercicios de opción múltiple, generados al azar y
autocorregibles, con feedback ligado al error concreto y refuerzo automático.
Pensada para hacerse desde el móvil.

- Aplicación publicada: https://salasgar.github.io/Ejercicios-interactivos/
- Sin build: HTML, CSS y JavaScript en módulos ES. KaTeX (fórmulas) y Firebase
  se cargan por CDN.
- Tests: `npm test` (usa el test runner de Node, sin dependencias).
- Prueba local: `npm run servir` y abrir http://localhost:8080/ (los módulos ES
  no funcionan abriendo el archivo directamente).

## Cómo funciona

- **Alumno**: entra con su cuenta de Google del centro (murciaeduca) o, si no
  la tiene, con un usuario y contraseña que le da el profesor. Ve las tareas de
  su grupo y las hace una a una. Cada ejercicio tiene 4 opciones; al contestar
  ve si ha acertado y, si no, un mensaje que explica el error que ha cometido.
  Cada fallo con concepto añade **2 ejercicios de refuerzo** de ese concepto al
  final de la tarea (máximo 6 por concepto). Puede salir y retomar donde lo dejó.
- **Profesor**: entra con su cuenta de Google y ve el panel con tres pestañas:
  *Alumnos* (alta por lotes), *Tareas* (crear, ocultar, borrar) y *Resultados*
  (tabla por tarea y descarga de CSV resumen y detalle, o de todo).
- **Probar sin cuenta**: en la pantalla de entrada; hace una tarea de
  demostración con todos los tipos sin guardar nada.
- **Idioma y notación**: bajo la cabecera hay dos selectores independientes,
  «Texto: ES | EN» (todos los textos que ve el alumno, incluidos los mensajes de
  feedback) y «Notación: 2,5 | 2.5» (coma o punto decimal, · o ×, : o ÷ en las
  fórmulas). Se recuerdan en el navegador. Al crear una tarea el profesor puede
  fijar cualquiera de los dos («lo elige el alumno», español o inglés); mientras
  se hace esa tarea el selector correspondiente aparece bloqueado. El panel del
  profesor y los CSV están solo en español.

### Tipos de ejercicio

Cubren la distribución de unidades didácticas del departamento de Matemáticas
(campo `curso` de cada tipo: 1 = 1º ESO, 2 = 2º ESO; es solo informativo, no
filtra nada en el formulario de tareas). Se van ampliando por evaluaciones; lo
que falta está en `traspaso-ejercicios-interactivos.md`.

| id | Tipo | Unidad didáctica |
|---|---|---|
| `jerarquia` | Jerarquía de las operaciones | UD1 Números naturales, potencias y raíces |
| `potencias` | Potencias (cálculo, propiedades, exponente negativo y cero) | UD1 (exponente negativo/cero, también 2º ESO UD1) |
| `raices` | Raíces cuadradas (exactas y aproximación) | UD1 |
| `enteros` | Números enteros (signos y productos) | UD3 Números enteros |
| `divisibilidad` | Múltiplos, divisores, criterios y primos | UD2 Divisibilidad |
| `fracciones_equivalentes` | Fracciones equivalentes y simplificar | UD4 Fracciones |
| `suma_fracciones` | Suma y resta de fracciones | UD4 |
| `producto_division_fracciones` | Multiplicación y división de fracciones | UD4 |
| `decimales` | Suma, resta, producto, división y ×/÷ 10, 100, 1000 | UD5 Números decimales |
| `expresiones_algebraicas` | Valor numérico, reducir términos semejantes y traducir enunciados | UD6 Álgebra |
| `ecuaciones_primer_grado` | Ecuaciones sencillas (con paréntesis, también con x en los dos miembros) | UD6 (x en los dos miembros, también 2º ESO UD4) |
| `proporcionalidad` | Regla de tres directa e inversa, y reparto proporcional | UD7 Magnitudes, proporcionalidad, porcentajes y matemática financiera (reparto, también 2º ESO UD3) |
| `porcentajes` | Cálculo de porcentajes, aumentos/descuentos (también encadenados), interés simple y compuesto | UD7 (encadenados e interés compuesto, también 2º ESO UD3) |
| `angulos` | Ángulos complementarios, suplementarios y clasificación | UD8 Geometría |
| `poligonos_triangulos` | Clasificar triángulos (lados, ángulos) y polígonos por su número de lados | UD8 |
| `perimetros_areas` | Perímetros y áreas de cuadrado, rectángulo, triángulo y círculo | UD8 |
| `teorema_pitagoras` | Hallar la hipotenusa o un cateto de un triángulo rectángulo | UD8 (también en 2º ESO) |
| `lenguaje_ingles` | Cómo se escriben los números y se leen las operaciones en inglés | (programa bilingüe, no es una UD) |
| `lenguaje_espanol` | Lo mismo en español | (programa bilingüe, no es una UD) |
| `operaciones_racionales` | Conversión entre fracción y decimal, y operaciones combinando los dos | 2º ESO UD2 Números decimales y fracciones |
| `polinomios` | Valor numérico, suma/resta y producto de un monomio por un binomio | 2º ESO UD4 Polinomios y ecuaciones |
| `ecuaciones_segundo_grado` | Incompletas (ax²+c=0, ax²+bx=0) y completas sencillas con raíces enteras | 2º ESO UD4 |
| `sistemas_ecuaciones` | Sistemas de dos ecuaciones lineales, por sustitución y por reducción | 2º ESO UD5 Sistemas de ecuaciones |
| `estadistica` | Media, moda, mediana, rango, marca de clase, frecuencia relativa y variables discretas/continuas | 2º ESO UD6 Estadística |

## Práctica «divisor, múltiplo, divisible» (`divisores/`)

La primera de las prácticas de la unidad 2 de 1º ESO, sin cuentas:
https://salasgar.github.io/Ejercicios-interactivos/divisores/. Español e
inglés. Conserva su URL, pero desde octubre de 2026 está montada sobre la base
común de `practicas/` (es la práctica 0 de su catálogo) y comparte su panel
del profesor: lo que sigue vale también para ella.

- **Ejercicios**: 0 («de» o «entre»), 1 (con multiplicaciones), 2 (con
  divisiones), 3 (mezcla) y 4 (arrastrar dos de los tres números a
  «__ es múltiplo de __»). Cuando «múltiplo de» y «divisible entre» valen las
  dos, se aceptan las dos (y en «18 es … 18», las tres).
- Los códigos de alumno de 4 caracteres son los mismos de siempre. Quien la
  hizo con la versión anterior tiene un código de resultado de 12 caracteres:
  el panel los sigue leyendo, mezclados con los de 16.
- Código en `divisores/` (`logica.js` es pura y tiene sus tests en
  `tests/divisores.test.js`).

## Prácticas de la unidad 2 (`practicas/`)

Treinta y una mini-aplicaciones sin cuentas sobre una **base común** (dieciséis
de la unidad 2 y quince de repaso de la unidad 1), cada una con una interacción
propia y con feedback que dice qué ha pasado con los números de ese ítem:
portada en https://salasgar.github.io/Ejercicios-interactivos/practicas/ y
**un solo panel del profesor** en `practicas/profesor.html`. Español e inglés.

**Todo lo demás está en [docs/practicas-unidad2.md](docs/practicas-unidad2.md)**:
el contrato de la base, cómo se añade una práctica, cómo lee el profesor los
resultados y qué práctica cubre qué destreza del inventario.

| Semana | `slug` | Práctica | Destrezas principales |
|---|---|---|---|
| 1 | `semaforo` | Semáforo de divisibilidad | Criterios del 2, 3, 5, 9, 10 y 11, compuestos, cifra que falta (U2-1C-05 a 1C-10) |
| 1 | `rectangulos` | Divisores por parejas | Todos los divisores por parejas y cuándo parar (U2-1C-13, 1C-14) |
| 1 | `recta` | Múltiplos y divisores en la recta | Múltiplos, divisores, el 0 y el 1 (U2-1C-02 a 1C-04) |
| 2 | `criba` | Criba y números primos | Primos menores que 100, primo o compuesto, hasta qué primo probar (U2-2C-01 a 2C-07) |
| 2 | `arbol` | Árbol de factores | Árbol de factores, factorización sin terminar (U2-2C-08, 2C-09, 2C-13) |
| 2 | `divisiones` ⏳ | Divisiones sucesivas | Divisiones sucesivas, forma de potencias, comprobar (U2-2C-10 a 2C-12) |
| 2 | `fabrica` | Fábrica de divisores | Divisores a partir de los factores primos y cuántos son (U2-3C-01, 3C-02, 2C-14) |
| 2 | `factorizaciones` | Operar con factorizaciones | Producto, cociente y «¿es múltiplo?» con exponentes (U2-2C-14) |
| 3 | `venn` | m.c.d. y m.c.m. con factores primos | Las dos reglas sin cruzarlas (U2-3C-03 a 3C-06, 3C-08, 3C-10) |
| 3 | `imposibles` ⏳ | Detector de imposibles | Desigualdades del m.c.d. y el m.c.m., nombrar la respuesta (U2-3C-10, 3C-11, 1A-04) |
| 4 | `clasificador` ⏳ | ¿m.c.d. o m.c.m.? | Decidir sin calcular, también cuando el enunciado empuja al revés (U2-1A-01, 4A-01) |
| 4 | `reloj` ⏳ | Reloj de coincidencias | Coincidencias con listas y en hora de reloj (U2-1A-02, 4A-02) |
| 4 | `baldosas` | Baldosas y cuerdas | Cubrir con cuadrados y cortar en trozos iguales (U2-4A-03, 4A-04, 4A-07) |
| 4 | `errores` ⏳ | Caza el error | Reconocer y nombrar el error, y lo que no es un error (U2-4C-01, 4C-02) |
| toda | `leelo` | Léelo en inglés | Leer factorizaciones, m.c.d. y m.c.m.; vocabulario (U2-1B, 2B-03, 3B-03) |
| toda | `divisores` | Divisor, múltiplo, divisible | No confundir múltiplo, divisor y divisible (U2-1B-01, 1C-02) |
| U1 | `jerarquia` ⏳ | ¿Qué se hace primero? | Jerarquía paso a paso, con potencias, raíces y paréntesis |
| U1 | `parentesis` | Coloca los paréntesis | Qué resultados salen según dónde va el paréntesis |
| U1 | `exponente` ⏳ | El exponente y su base | A qué afecta el exponente, potencia como producto repetido, cuadrado de la suma |
| U1 | `raiz` | Raíz cuadrada con cuadrados | Raíz exacta, raíz entera y resto |
| U1 | `division` | División entera: cajas y resto | Cociente, resto, la prueba y qué significa el resto |
| U1 | `expresion` | Del enunciado a la expresión | Modelar un problema con una expresión, con los paréntesis justos |
| U1 | `redondeo` | Redondeo y estimación | Redondear, estimar y decidir si un resultado es razonable |
| U1 | `constructor` | Constructor de números | Valor de las cifras, descomposición, números con cifras y con palabras |
| U1 | `distributiva` ⏳ | Distributiva con rectángulos | Propiedad distributiva, factor común, compensar con 99 |
| U1 | `potencias10` | Potencias de 10 y números grandes | Potencias de 10, million, billion y trillion |
| U1 | `dictado` | Dictado de números | Numerales ingleses de oído y por escrito; ortografía española |
| U1 | `mental` ⏳ | Cálculo mental con estrategia | Compensar, descomponer y elegir estrategia |
| U1 | `especiales` | Potencias especiales | Exponentes 0 y 1, potencias de 10, igualdades falsas típicas |
| U1 | `errores1` ⏳ | Caza el error (unidad 1) | Reconocer y nombrar errores de jerarquía, división y potencias |
| U1 | `propiedades` ⏳ | Propiedades de las potencias | Ampliación: misma base, potencia de potencia, última cifra |

⏳ = hecha pero **todavía no enlazada desde la portada** (`disponible: false` en
el catálogo): la revisión final del 2026-10-08 encontró en ella algo que
penaliza una respuesta correcta o que no se puede contestar. Lo que hay que
corregir está en `reparto-practicas-u2/hechos/reabiertas/` y el veredicto
completo en `reparto-practicas-u2/salidas/18-revision-final/VEREDICTO.md`.

- El alumno entra en todas con **el mismo código de 4 caracteres** que ya tenía
  en `divisores/` (el enlace que reparte el panel es `practicas/?c=ABCD`). Cada
  práctica da un **código de resultado de 16 caracteres** que dice además de
  qué práctica es; el panel lee mezclados los de 16 y los de 12 de `divisores/`.
- El progreso se copia en Firestore, en `practicas/{práctica}--{código}` (regla
  en `firestore.rules`; **hay que publicarla** para que funcione la nube).
- `practicas/_comun/`: la base (`base.js`), el catálogo con los ids (`catalogo.js`,
  no se renumera), códigos, contador, aritmética de la unidad y estilos.
- **Añadir una práctica**: copiar `practicas/plantilla/`, registrarla en
  `catalogo.js` y escribir sus ejercicios. El contrato está comentado en
  `practicas/plantilla/practica.js` (y en `reparto-practicas-u2/tareas/tarea-01-base-comun.md`).
- Tests en `tests/practicas-comun.test.js` y uno por práctica (`tests/practicas-<slug>.test.js`).
- **10 aciertos por ejercicio** (no 20), +2 por fallo, tope 20. El **idioma de
  cada ítem sale al azar** (alterno, por bloques equilibrados de 4): el alumno
  no lo elige; tras responder puede ver el mismo ítem traducido. El enlace del
  profesor puede fijarlo para un alumno (`?idioma=es` o `?idioma=en`), con un
  selector en el panel para generarlos todos así.

## Puesta en marcha de Firebase (una sola vez)

Los resultados se guardan en Firebase (plan gratuito Spark). Hay que crear el
proyecto con tu cuenta de Google; son unos 10 minutos.

1. Entra en https://console.firebase.google.com y **crea un proyecto** (por
   ejemplo «Ejercicios interactivos»). Google Analytics no hace falta.
2. **Authentication → Comenzar**. En «Método de acceso» habilita dos
   proveedores:
   - **Google** (elige un correo de asistencia del proyecto y guarda).
   - **Correo electrónico/contraseña** (solo el primer interruptor).
3. **Authentication → Configuración → Dominios autorizados → Agregar dominio**:
   `salasgar.github.io`.
4. **Firestore Database → Crear base de datos → modo de producción**, región
   de Europa (`eur3` o `europe-west1`).
5. **Configuración del proyecto (rueda dentada) → Tus apps → icono web `</>`**.
   Nombre cualquiera, sin Hosting. Copia el objeto `firebaseConfig` que muestra
   y pégalo en `src/config.js`. Haz commit y push: en un par de minutos la
   aplicación publicada ya deja entrar.
6. Entra en la aplicación con **Entrar con Google** usando tu cuenta. Como aún
   no eres el profesor, la pantalla te muestra tu **uid**: cópialo.
7. Pon ese uid en `PROFESOR_UID` de `src/config.js`, y en **Firestore Database
   → Reglas** pega el contenido de `firestore.rules` sustituyendo
   `PROFESOR_UID` por el mismo uid. **Publicar**. Commit y push.
8. Vuelve a entrar: verás el panel del profesor. Da de alta un alumno de
   prueba (tu propio email de murciaeduca sirve) y una tarea, y pruébala desde
   el móvil.

La `apiKey` es pública por diseño (identifica el proyecto, no da permisos): lo
que protege los datos son las reglas del paso 7.

### Si a los alumnos les sale «app bloqueada» al entrar con Google

Google Workspace para Educación bloquea por defecto, para menores, las
aplicaciones de terceros que el administrador del dominio no haya autorizado.
Si ocurre, hay dos salidas: pedir al administrador de murciaeduca que autorice
la aplicación (el identificador OAuth aparece en Google Cloud → APIs y
servicios → Credenciales del proyecto), o dar de alta a esos alumnos con
usuario y contraseña (formato «Nombre; Grupo» en la pestaña Alumnos).

### Alternativa para las reglas: la CLI

Si prefieres no pegar las reglas a mano:

```
npx firebase-tools login
npx firebase-tools use <id-del-proyecto>
npx firebase-tools deploy --only firestore:rules
```

## Límites conocidos (y por qué)

- **Contraseñas de los alumnos sin Google.** Desde el navegador no se puede
  cambiar la contraseña de otro usuario: haría falta un servidor (Cloud
  Functions, que exige plan de pago). Por eso el alumno no puede cambiarla y el
  profesor guarda la que le asignó en la colección `credenciales`, solo legible
  por él, para recordársela. Si hiciera falta «resetear» a un alumno, dale de
  alta con otro usuario (`ana.garcia2`).
- **Un solo profesor.** El uid del profesor está fijo en las reglas y en
  `src/config.js`. Para varios profesores habría que pasar a una lista.
- **Sin filtro por curso.** El campo `curso` de cada tipo (1º o 2º ESO) es solo
  informativo: el profesor ve todos los tipos mezclados en el formulario de
  tareas y elige a mano. Está preparado para filtrar si hiciera falta.
- **Sin conexión.** La aplicación necesita red para entrar y guardar. Si se
  pierde la conexión a mitad de una tarea, avisa y reintenta al contestar el
  siguiente ejercicio.

## Ideas para más adelante

Apuntadas para no olvidarlas; no son para ahora:

- Cuando haya ejercicios de todos los cursos de ESO y Bachillerato: efectos de
  sonido, pequeños personajes animados, frases graciosas y otros detalles para
  motivar a los alumnos (idea de Juan Luis, 2026-09-09).
- Varios profesores (lista de uids en las reglas en vez de uno fijo).
- Filtro por curso en el formulario de tareas (el campo `curso` ya existe).
- Usar como banco de ejercicios de la app todo el material que se genera para las clases
  (exámenes semanales, práctica, hojas de ejercicios, banco de preguntas validadas) y
  personalizar feedback, explicaciones y próximos ejercicios según los aciertos y fallos de
  cada alumno por destreza. Idea de Juan Luis, 2026-09-18, detallada en
  `docs/coordinacion-unidad1.md`, apartado «La tercera línea: adaptación al perfil de cada
  alumno» — sin diseñar todavía.

## Cómo añadir un tipo de ejercicio

1. Crea `src/ejercicios/<id>.js` siguiendo cualquiera de los existentes: exporta
   `{ id, nombre: { es, en }, curso, concepto, preguntas, errores, generar }`.
   `generar(rng)` recibe un generador con semilla (`rng.entero`, `rng.elegir`,
   `rng.barajar`, `rng.moneda`) y devuelve `{ texto, enunciado, opciones }`
   pasando por `construirOpciones`, que garantiza una sola correcta y 3
   distractores de valor distinto. El contrato completo está comentado al
   principio de `src/ejercicios/index.js`.
2. `texto` es la pregunta como `{ clave, params }`; la clave se define en la
   tabla `preguntas` del tipo con `{ es, en }` (o es una clave global como
   `calcula`). `enunciado` es TeX neutro: `2{,}5`, `\cdot`, `\div`, que se
   adaptan a la notación elegida al mostrarse.
3. Cada distractor lleva `error: E('id')`, y ese id va en la tabla `errores` con
   `{ concepto, es, en }` (el mensaje de feedback en los dos idiomas). El
   `concepto` decide qué tipo se añade como refuerzo (ver `CONCEPTOS`); con
   `concepto: null` no hay refuerzo.
4. Regístralo en la lista `TIPOS` de `src/ejercicios/index.js` y, si es un
   concepto nuevo, añádelo a `CONCEPTOS` con nombre bilingüe.
5. `npm test`: los tests generan 300 ejercicios de cada tipo y comprueban que
   están bien formados y que las tablas están en los dos idiomas. Aparecerá
   automáticamente en el formulario de tareas.

## Estructura

```
index.html                 página única
css/estilos.css            estilos (móvil primero)
src/main.js                arranque y cambio de pantalla
src/config.js              configuración de Firebase (rellenar)
src/firebase.js            acceso a Auth y Firestore
src/motor.js               generar tarea, responder, refuerzos, resumen (puro)
src/altas.js               alta de alumnos por lotes (puro)
src/i18n/                  idioma y notación: index.js (estado, t(), aplicarNotacion), es.js, en.js
src/textos.js              pregunta, feedback y nombres de un ejercicio en el idioma en vigor
src/ejercicios/index.js    registro de tipos, rng, construirOpciones
src/ejercicios/*.js        un generador por tipo
src/ui/*.js                pantallas: entrada, alumno, tarea, profesor, csv, fórmulas
tests/*.test.js            node --test
firestore.rules            reglas de seguridad
.github/workflows/pages.yml  tests + publicación en GitHub Pages
```

### Datos en Firestore

| Colección | Contenido | Lee | Escribe |
|---|---|---|---|
| `alumnos/{email}` | nombre, grupo, acceso (google/contrasena) | el alumno y el profesor | profesor |
| `credenciales/{email}` | contraseña asignada (solo alumnos sin Google) | profesor | profesor |
| `tareas/{id}` | título, grupo, ejercicios, activa | alumnos del grupo y profesor | profesor |
| `alumnos/{email}/progreso/{tareaId}` | ejercicios generados, respuestas, refuerzos | el alumno y el profesor | el alumno |

El `{email}` es el real si el alumno entra con Google, o `usuario@alumnos.example`
si entra con contraseña.
