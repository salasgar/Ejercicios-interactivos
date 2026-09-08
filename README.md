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

- **Alumno**: entra con usuario y contraseña, ve las tareas de su grupo y las
  hace una a una. Cada ejercicio tiene 4 opciones; al contestar ve si ha
  acertado y, si no, un mensaje que explica el error que ha cometido. Cada
  fallo con concepto añade **2 ejercicios de refuerzo** de ese concepto al final
  de la tarea (máximo 6 por concepto). Puede salir y retomar donde lo dejó.
- **Profesor**: entra con su cuenta y ve el panel con tres pestañas:
  *Alumnos* (alta por lotes, contraseñas), *Tareas* (crear, ocultar, borrar) y
  *Resultados* (tabla por tarea y descarga de CSV resumen y detalle, o de todo).
- **Probar sin cuenta**: en la pantalla de entrada; hace una tarea de
  demostración con todos los tipos sin guardar nada.

### Tipos de ejercicio (1º ESO)

| id | Tipo |
|---|---|
| `jerarquia` | Jerarquía de las operaciones |
| `potencias` | Potencias (cálculo y propiedades) |
| `enteros` | Números enteros (signos y productos) |
| `divisibilidad` | Múltiplos, divisores, criterios y primos |
| `fracciones_equivalentes` | Fracciones equivalentes y simplificar |
| `suma_fracciones` | Suma y resta de fracciones |
| `decimales` | Suma, resta, producto y ×/÷ 10, 100, 1000 |

## Puesta en marcha de Firebase (una sola vez)

Los resultados se guardan en Firebase (plan gratuito Spark). Hay que crear el
proyecto con tu cuenta de Google; son unos 10 minutos.

1. Entra en https://console.firebase.google.com y **crea un proyecto** (por
   ejemplo `ejercicios-eso`). Google Analytics no hace falta.
2. **Authentication → Comenzar → Email/Password → Habilitar** (solo el primer
   interruptor; el de «vínculo por correo» no). Guardar.
3. **Authentication → Settings → Dominios autorizados → Añadir dominio**:
   `salasgar.github.io`.
4. **Authentication → Users → Añadir usuario**: tu email real y una contraseña
   buena. Es la cuenta de profesor. Copia su **UID de usuario** (columna de la
   tabla).
5. **Firestore Database → Crear base de datos → modo de producción**, región
   `europe-west` (la que sea de Europa). Cuando esté creada, pestaña
   **Reglas**: pega el contenido de `firestore.rules` sustituyendo
   `PROFESOR_UID` por el uid del paso 4, y **Publicar**.
6. **Configuración del proyecto (rueda dentada) → Tus apps → icono web `</>`**.
   Nombre cualquiera, sin Hosting. Copia el objeto `firebaseConfig` que muestra.
7. En este repositorio, edita `src/config.js`:
   - pega el objeto en `firebaseConfig`;
   - pon el uid del paso 4 en `PROFESOR_UID`.
   Haz commit y push: el workflow publica la nueva versión en un par de minutos.
8. Entra en la aplicación con tu email y contraseña. Verás el panel del
   profesor. Da de alta un alumno de prueba y una tarea, y pruébala desde el
   móvil con ese alumno.

La `apiKey` es pública por diseño (identifica el proyecto, no da permisos): lo
que protege los datos son las reglas del paso 5.

### Alternativa para las reglas: la CLI

Si prefieres no pegar las reglas a mano:

```
npx firebase-tools login
npx firebase-tools use <id-del-proyecto>
npx firebase-tools deploy --only firestore:rules
```

## Límites conocidos (y por qué)

- **Contraseñas de los alumnos.** Desde el navegador no se puede cambiar la
  contraseña de otro usuario: haría falta un servidor (Cloud Functions, que
  exige plan de pago). Por eso el alumno no puede cambiarla y el profesor guarda
  la que le asignó en la colección `credenciales`, solo legible por él, para
  recordársela. Si hiciera falta «resetear» a un alumno, dale de alta con otro
  usuario (`ana.garcia2`).
- **Un solo profesor.** El uid del profesor está fijo en las reglas y en
  `src/config.js`. Para varios profesores habría que pasar a una lista.
- **Un solo curso (1º ESO).** El campo `curso` de cada tipo está preparado para
  filtrar por curso cuando haya más.
- **Sin conexión.** La aplicación necesita red para entrar y guardar. Si se
  pierde la conexión a mitad de una tarea, avisa y reintenta al contestar el
  siguiente ejercicio.

## Cómo añadir un tipo de ejercicio

1. Crea `src/ejercicios/<id>.js` siguiendo cualquiera de los existentes: exporta
   `{ id, nombre, curso, concepto, generar }`. `generar(rng)` recibe un generador
   con semilla (`rng.entero`, `rng.elegir`, `rng.barajar`, `rng.moneda`) y debe
   devolver `{ enunciado, opciones }` pasando por `construirOpciones`, que
   garantiza una sola correcta y 3 distractores de valor distinto.
2. Cada distractor lleva `error: { id, concepto, feedback }`. El `concepto` decide
   qué tipo se añade como refuerzo (ver `CONCEPTOS` en `src/ejercicios/index.js`);
   si el error no apunta a un concepto, pon `concepto: null` y no habrá refuerzo.
3. Regístralo en la lista `TIPOS` de `src/ejercicios/index.js` y, si es un
   concepto nuevo, añádelo a `CONCEPTOS`.
4. `npm test`: los tests generan 300 ejercicios de cada tipo y comprueban que
   están bien formados. Aparecerá automáticamente en el formulario de tareas.

## Estructura

```
index.html                 página única
css/estilos.css            estilos (móvil primero)
src/main.js                arranque y cambio de pantalla
src/config.js              configuración de Firebase (rellenar)
src/firebase.js            acceso a Auth y Firestore
src/motor.js               generar tarea, responder, refuerzos, resumen (puro)
src/altas.js               alta de alumnos por lotes (puro)
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
| `alumnos/{uid}` | usuario, nombre, grupo | el alumno y el profesor | profesor |
| `credenciales/{uid}` | contraseña asignada | profesor | profesor |
| `tareas/{id}` | título, grupo, ejercicios, activa | alumnos del grupo y profesor | profesor |
| `alumnos/{uid}/progreso/{tareaId}` | ejercicios generados, respuestas, refuerzos | el alumno y el profesor | el alumno |
