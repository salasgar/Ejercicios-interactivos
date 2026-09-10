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
(campo `curso` de cada tipo: 1 = 1º ESO). Se van ampliando por evaluaciones;
lo que falta está en `traspaso-ejercicios-interactivos.md`.

| id | Tipo | Unidad didáctica |
|---|---|---|
| `jerarquia` | Jerarquía de las operaciones | UD1 Números naturales, potencias y raíces |
| `potencias` | Potencias (cálculo y propiedades) | UD1 |
| `raices` | Raíces cuadradas (exactas y aproximación) | UD1 |
| `enteros` | Números enteros (signos y productos) | UD3 Números enteros |
| `divisibilidad` | Múltiplos, divisores, criterios y primos | UD2 Divisibilidad |
| `fracciones_equivalentes` | Fracciones equivalentes y simplificar | UD4 Fracciones |
| `suma_fracciones` | Suma y resta de fracciones | UD4 |
| `producto_division_fracciones` | Multiplicación y división de fracciones | UD4 |
| `decimales` | Suma, resta, producto, división y ×/÷ 10, 100, 1000 | UD5 Números decimales |
| `expresiones_algebraicas` | Valor numérico, reducir términos semejantes y traducir enunciados | UD6 Álgebra |
| `ecuaciones_primer_grado` | Ecuaciones sencillas (con paréntesis) de una incógnita | UD6 |
| `proporcionalidad` | Regla de tres directa e inversa | UD7 Magnitudes, proporcionalidad, porcentajes y matemática financiera |
| `porcentajes` | Cálculo de porcentajes, aumentos/descuentos e interés simple | UD7 |
| `lenguaje_ingles` | Cómo se escriben los números y se leen las operaciones en inglés | (programa bilingüe, no es una UD) |
| `lenguaje_espanol` | Lo mismo en español | (programa bilingüe, no es una UD) |

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
- **Un solo curso (1º ESO).** El campo `curso` de cada tipo está preparado para
  filtrar por curso cuando haya más.
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
