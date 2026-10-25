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
  divisiones), 3 (mezcla), 4 (arrastrar dos de los tres números a
  «__ es múltiplo de __») y 5, **«¿Quién miente?»** (desde el 2026-10-08):
  varios bichos (sprites de Scratch) dicen cada uno una frase y hay que pulsar
  el que miente o el que dice la verdad, según la consigna de la ronda; salen
  2, 3 y 4 bichos conforme suben los puntos, con verdades que parecen mentira
  («1 es divisor de 7») y mentiras que parecen verdad («60 es divisor de 5»).
  Cuando «múltiplo de» y «divisible entre» valen las dos, se aceptan las dos
  (y en «18 es … 18», las tres).
- Los alumnos entran con su código de siempre, como en las demás prácticas (registrado
  en el espacio de su profesor). Los códigos de resultado de 12 caracteres de la
  versión anterior ya no los lee el panel (desde la tarea 71); la colección `divisores`
  de entonces se borra con las demás del modo antiguo.
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
| 2 | `divisiones` | Divisiones sucesivas | Divisiones sucesivas, forma de potencias, comprobar (U2-2C-10 a 2C-12) |
| 2 | `fabrica` | Fábrica de divisores | Divisores a partir de los factores primos y cuántos son (U2-3C-01, 3C-02, 2C-14) |
| 2 | `factorizaciones` | Operar con factorizaciones | Producto, cociente y «¿es múltiplo?» con exponentes (U2-2C-14) |
| 3 | `venn` | m.c.d. y m.c.m. con factores primos | Las dos reglas sin cruzarlas (U2-3C-03 a 3C-06, 3C-08, 3C-10) |
| 3 | `imposibles` | Detector de imposibles | Desigualdades del m.c.d. y el m.c.m., nombrar la respuesta (U2-3C-10, 3C-11, 1A-04) |
| 4 | `clasificador` | ¿m.c.d. o m.c.m.? | Decidir sin calcular, también cuando el enunciado empuja al revés (U2-1A-01, 4A-01) |
| 4 | `reloj` | Reloj de coincidencias | Coincidencias con listas y en hora de reloj (U2-1A-02, 4A-02) |
| 4 | `baldosas` | Baldosas y cuerdas | Cubrir con cuadrados y cortar en trozos iguales (U2-4A-03, 4A-04, 4A-07) |
| 4 | `errores` | Caza el error | Reconocer y nombrar el error, y lo que no es un error (U2-4C-01, 4C-02) |
| toda | `leelo` | Léelo en inglés | Leer factorizaciones, m.c.d. y m.c.m.; vocabulario (U2-1B, 2B-03, 3B-03) |
| toda | `divisores` | Divisor, múltiplo, divisible | No confundir múltiplo, divisor y divisible (U2-1B-01, 1C-02) |
| U1 | `jerarquia` | ¿Qué se hace primero? | Jerarquía paso a paso, con potencias, raíces y paréntesis |
| U1 | `parentesis` | Coloca los paréntesis | Qué resultados salen según dónde va el paréntesis |
| U1 | `exponente` | El exponente y su base | A qué afecta el exponente, potencia como producto repetido, cuadrado de la suma |
| U1 | `raiz` | Raíz cuadrada con cuadrados | Raíz exacta, raíz entera y resto |
| U1 | `division` | División entera: cajas y resto | Cociente, resto, la prueba y qué significa el resto |
| U1 | `expresion` | Del enunciado a la expresión | Modelar un problema con una expresión, con los paréntesis justos |
| U1 | `redondeo` | Redondeo y estimación | Redondear, estimar y decidir si un resultado es razonable |
| U1 | `constructor` | Constructor de números | Valor de las cifras, descomposición, números con cifras y con palabras |
| U1 | `distributiva` | Distributiva con rectángulos | Propiedad distributiva, factor común, compensar con 99 |
| U1 | `potencias10` | Potencias de 10 y números grandes | Potencias de 10, million, billion y trillion |
| U1 | `dictado` | Dictado de números | Numerales ingleses de oído y por escrito; ortografía española |
| U1 | `mental` | Cálculo mental con estrategia | Compensar y descomponer |
| U1 | `especiales` | Potencias especiales | Exponentes 0 y 1, potencias de 10, igualdades falsas típicas |
| U1 | `errores1` | Caza el error (unidad 1) | Reconocer y nombrar errores de jerarquía, división y potencias; ver si se ha saltado un paso |
| U1 | `propiedades` | Propiedades de las potencias | Ampliación: misma base, potencia de potencia, última cifra |

Desde el 2026-10-09 las 31 están publicadas en la portada (`disponible: true`
en el catálogo), tras corregir lo que encontraron las dos revisiones.

- **Tarea de la semana** (desde el 2026-10-15): `practicas/semana.html?t=<id>`
  abre los ejercicios de esa semana (unos obligatorios con ★ y otros a elegir),
  con un marcador («★ 4 de 6 · a elegir 2 de 4 · 60 de 100 puntos») y, al
  cumplirla, «Tu profesor ya puede verlo» (el profesor lo ve en la nube; el código de
  resultado de 20 caracteres queda en un desplegable de respaldo). Qué lleva cada
  semana lo decide cada profesor en la sección «Tareas» de su panel (se guarda en su
  espacio); `practicas/_comun/tareas.js` es la plantilla del curso («Cargar la plantilla
  del curso»). El panel da el enlace común para Classroom y la vista «Tareas de la semana».
- **Tareas v2** (desde el 2026-10-17; diseño en
  `reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md`): cada unidad
  tiene sus prácticas y sus tareas, y la portada enseña la unidad actual arriba
  y las anteriores plegadas (`UNIDADES` en `catalogo.js`). Una tarea es de
  **repaso** (sin plazo), **obligatoria** (con `hasta`, el plazo) u
  **obligatoria solo para los alumnos marcados** en el panel (`asignada: true`;
  la asignación vive en el espacio del profesor, `practicas-espacios/<uid>/asignaciones/<código>`,
  y los no marcados la ven como repaso). Lo hecho tarde sigue contando, pero sale «fuera
  de plazo» con los días de retraso (vista «Retrasos» del panel, con CSV).
  **Cada tarea lleva su propio progreso** (`…/<uid>/progreso-tareas/t<id>--<práctica>--<código>`),
  separado del de la práctica libre; **la tarea 1 de Juan Luis es la excepción**
  (`progresoPorPractica: true`): sigue con el progreso de las prácticas, como se
  mandó. Detalle en [docs/practicas-unidad2.md](docs/practicas-unidad2.md), §1.
- **Informe diario**: `node herramientas/informe-actividad.mjs --espacio <uid>`
  (por REST, con una cuenta lectora en `LECTOR_EMAIL` y `LECTOR_CLAVE`; solo números
  de lista) resume la actividad en la tarea vigente (la obligatoria de plazo abierto
  más próximo, o la que se pida con `--tarea`), con retrasos y, en las asignadas, solo
  los marcados. Una rutina de Claude en la nube lo manda por correo cada noche
  (`--espacio <uid> --alumnos 51 --horas 24 --grupos …`; docs, §2 y §9.10). La cuenta
  lectora se añade en el panel, sección «Cuenta lectora del informe diario».
- **Varios profesores** (desde el 2026-10-17; diseño en
  `reparto-practicas-u2/salidas/57-diseno-varios-profesores/DISENO.md`, revisado en la
  tarea 69): cada profesor entra en el panel con su cuenta de Google y tiene un
  **espacio** propio en la nube (`practicas-espacios/<uid>`) con sus alumnos, sus
  tareas y sus resultados; ningún profesor puede leer los de otro. Los códigos de
  sus alumnos los genera el panel **al azar** (8 caracteres, o 4 si lo elige), la
  lista de nombres sube **cifrada** con una contraseña que solo sabe él, y las
  tareas se hacen en el panel. Juan Luis da las altas (sección «Profesores»). Él pasó
  a su espacio el 18-10-2026 con los códigos de 4 de siempre de sus alumnos (tarea 70),
  y la tarea 71 quitó el modo antiguo (códigos de 4 calculables sin registrar y las
  colecciones `practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos` y
  `divisores`, que ya no tienen regla y se borran). Detalle en
  [docs/practicas-unidad2.md](docs/practicas-unidad2.md), §9; guía para los
  compañeros en [docs/practicas-como-empezar.md](docs/practicas-como-empezar.md).
- El alumno entra en todas con **el mismo código** (4 u 8 caracteres, registrado en
  el espacio de su profesor; el enlace que reparte el panel es `practicas/?c=ABCD`).
  Un código que la nube no conoce da «Ese código no existe». Lo normal es que
  el profesor vea los resultados en la nube; el único respaldo si la nube no
  llega es el código de la tarea (20 caracteres, en un desplegable), que el panel
  lee con las tareas del profesor. El código de
  resultado por práctica (16 caracteres) existió hasta el 2026-10-16: se eliminó
  y con él el tope de 32 prácticas del catálogo.
- El progreso se guarda en el navegador y en Firestore, en el espacio del profesor
  (`practicas-espacios/<uid>/progreso-libre/{práctica}--{código}`, y el de cada tarea v2
  en `progreso-tareas`; reglas en `firestore.rules`; **hay que publicarlas** para que
  funcione la nube). Al entrar con su código, el alumno
  lee su documento y la app lo fusiona con lo del navegador antes de subir
  nada (`practicas/_comun/nube.js`): se puede **seguir desde cualquier
  aparato** y un aparato no machaca lo de otro. El panel da los puntos de cada
  tarea de la semana y una vista «Qué falla más».
- Cada fallo se registra en la colección `fallos` del espacio del profesor (el ítem, la explicación que
  vio el alumno y, si la práctica lo da, el tipo de error; `practicas/_comun/registro.js`);
  el panel tiene una sección «Fallos, uno a uno» con los más repetidos, lo que le
  cuesta a cada alumno y un CSV con las destrezas.
- `practicas/_comun/`: la base (`base.js`), el catálogo con los ids (`catalogo.js`,
  no se renumera), códigos, contador, aritmética de la unidad y estilos.
- **Añadir una práctica**: copiar `practicas/plantilla/`, registrarla en
  `catalogo.js` y escribir sus ejercicios. El contrato está comentado en
  `practicas/plantilla/practica.js` (y en `reparto-practicas-u2/tareas/tarea-01-base-comun.md`).
- Tests en `tests/practicas-comun.test.js` y uno por práctica (`tests/practicas-<slug>.test.js`).
- **Por puntos, con vidas** (desde el 2026-10-08): en cada ejercicio hay que
  llegar a 10 puntos; cada acierto da 1 y 5 seguidos dan 1 extra; cada fallo
  quita 1 punto y una vida, y sin las 5 vidas el ejercicio vuelve a empezar.
  Las constantes están en `practicas/_comun/contador.js`. El **idioma de
  cada ítem sale al azar** (alterno, por bloques equilibrados de 4): el alumno
  no lo elige; tras responder puede ver el mismo ítem traducido. El enlace del
  profesor puede fijarlo para un alumno (`?idioma=es` o `?idioma=en`), con un
  selector en el panel para generarlos todos así.

## Prácticas de la unidad 3 (`practicas/`)

Doce prácticas más sobre la misma base y el mismo panel, para la unidad 3,
**Números enteros** (ids 33-44 del catálogo; la portada las enseña por semanas
desde el lunes 16-11-2026). Dos piezas comunes nuevas: `practicas/_comun/enteros.js`
(escritura con el menos de verdad, un evaluador con la jerarquía de clase y los
**errores típicos de la unidad**, de donde salen todos los distractores) y
`practicas/_comun/recta-enteros.js` (recta y termómetro en SVG). Qué hace cada
una, cómo se amplía y qué destreza cubre: [docs/practicas-unidad3.md](docs/practicas-unidad3.md).

| Semana | `slug` | Práctica | Destrezas principales |
|---|---|---|---|
| 1 | `termometro` | La recta y el termómetro | Representar, leer, comparar y ordenar enteros (U3-1C-02 a 1C-06) |
| 1 | `opuestos` | Opuesto y valor absoluto | Opuesto, valor absoluto como distancia al 0 (U3-1C-07 a 1C-10) |
| 1 | `situaciones` | Enteros en la vida real | De la situación al entero y problemas de un paso (U3-1C-01, 1C-16) |
| 1-2 | `saltos` | Sumas y restas con saltos | Sumar y restar en la recta, varios términos y problemas (U3-1C-11 a 1C-15, 2A-01, 2C-01 a 2C-04) |
| 2 | `dos-signos` | Dos signos seguidos | Quitar el paréntesis de un número (U3-2C-05 a 2C-08, 2C-10) |
| 2 | `signos-producto` | La regla de los signos | Multiplicar y dividir enteros, sin llevar la regla a la suma (U3-2C-15 a 2C-21) |
| 3 | `potencias-enteros` | Productos y potencias con signo | Signo de un producto, potencias de base negativa, −aⁿ y (−a)ⁿ, raíces (U3-3C-02 a 3C-15) |
| 3-4 | `jerarquia-enteros` | ¿Qué se hace primero? Con enteros | Jerarquía con enteros paso a paso y cadenas (U3-3A-01 a 3A-03, 3C-20, 4A-01, 4A-02) |
| 3-4 | `parentesis-enteros` | Paréntesis y corchetes | Quitar paréntesis precedidos de + y de −, corchetes, colocar paréntesis (U3-3A-04, 3C-16 a 3C-18, 4A-03 a 4A-07) |
| 4 | `variacion` | Subidas, bajadas y diferencias | Variación, diferencia, dato que falta, años a. C. y d. C. (U3-3C-21, 4C-01 a 4C-10) |
| 4 | `errores3` | Caza el error | Reconocer y nombrar los errores típicos, y lo que no es error (U3-2C-21, 3C-19, 4A-05, 4C-08, 4C-09) |
| toda | `leelo3` | Léelo en inglés | Leer enteros, operaciones y potencias en inglés (U3-1B, 2B, 3B-02, 4B) |

Cada semana tiene su tarea de revisión y publicación (tareas 93-96 del reparto), que deja
la propuesta de la tarea de la app de esa semana.

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

### Varios profesores: publicar las reglas y dar de alta a alguien

**Las reglas.** Las de varios profesores son la sección «Varios profesores» de
`firestore.rules`; se publican con el fichero entero, igual que siempre (consola:
Firestore Database → Reglas → pegar todo `firestore.rules` → **Publicar**; o la CLI
de arriba). El uid del administrador ya está escrito en `esProfesor()`. Después de
publicar un cambio en esa sección, se pasa el banco de pruebas con dos cuentas de
prueba (correo y contraseña, creadas en Authentication y dadas de alta como
profesores; sus contraseñas nunca en el repositorio):

```
PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… node herramientas/probar-reglas.mjs
```

Tiene que acabar en «N de N comprobaciones como se esperaba» (154 el 17-10; desde la
tarea 71 comprueba además que las colecciones del modo antiguo no se leen ni se
escriben). Detalle en [docs/practicas-unidad2.md](docs/practicas-unidad2.md), §9.8.

**Las colecciones del modo antiguo** (`practicas`, `practicas-tareas`,
`practicas-asignaciones`, `fallos`, `divisores`) no tienen regla desde la tarea 71:
Firestore las deniega enteras. Se borran a mano en la consola (Firestore → la
colección → «Eliminar colección»), con copia antes y fuera del repositorio.

**Dar de alta a un compañero.** No hay que tocar las reglas ni el repositorio:

1. Mándale [docs/practicas-como-empezar.md](docs/practicas-como-empezar.md) y el
   enlace del panel (`…/practicas/profesor.html`).
2. Entra con su cuenta de Google y le sale «Aún no tienes acceso»; su solicitud te
   aparece en tu panel, sección **«Profesores»**, con su nombre y su correo.
3. **Comprueba el correo** (cualquiera puede dejar una solicitud) y pulsa **«Dar de
   alta»**; si no sabes de quién es, «Rechazar».
4. Él pulsa «Volver a comprobar» y ya tiene su espacio. «Dar de baja» le quita el
   acceso sin borrar sus datos (se borran, si hace falta, desde la consola).

**Las cuotas.** La primera semana de cada compañero nuevo, mira cada día en la
consola Firestore Database → **Uso** las lecturas y escrituras: el umbral es el 70 %
del plan gratuito (35 000 lecturas o 14 000 escrituras al día). Por qué y qué hacer
si se pasa: docs, §9.9.

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
