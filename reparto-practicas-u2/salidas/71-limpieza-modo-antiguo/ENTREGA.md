# Entrega de la tarea 71 · Limpieza del modo antiguo

Sesión `s-20261025T000539-5cc03a47` (PU2 T71, ALTO), 25-10-2026, de 00:05Z a 00:5xZ.
Juan Luis no estaba delante: por la decisión 7 de la coordinadora
(`hechos/notas/s-20261025T003735-56c33ec7-decisiones-25-10.md`, por delegación suya), la tarea
cierra **LISTA salvo los pasos 1-2 y 4-6, que son de Juan Luis** (lista de comprobación al final).

Commit del código: **`a061493`**, subido a `main` y publicado en Pages (Actions 40148031463: success).

## Qué se ha hecho (paso 3, código, y 7, documentación)

- **Alumno** (`espacio.js`, `base.js`, `nube.js`, `registro.js`, `vista-tareas.js`, `portada.js`, `semana.js`):
  - un código, de 4 u 8, vale si la nube lo conoce;
  - uno de 4 sin registrar da «Ese código no existe»; ya no cae en las colecciones viejas ni se recuerda una hora como «antiguo»;
  - sin red y sin copia en el navegador, se practica y se guarda solo aquí, como con uno de 8;
  - `nube.js` ya no tiene `COLECCION_PRACTICAS/TAREAS/ASIGNACIONES` ni colección por defecto: sin colección no hay URL;
  - los fallos sin profesor conocido esperan en la cola, ya no van a `fallos`;
  - fuera `leerFallos`, `consultaDesde`, `leerConsulta`, `deLaTarea` y `contextoAntiguo`.
- **Panel** (`profesor.js`, `profesor.html`):
  - fuera el «sistema actual»: lista local, códigos calculados, «Cargar de la nube» de las colecciones viejas y los fallos de `fallos`;
  - fuera el selector de sistema y el botón «Abrir el sistema actual»;
  - el panel abre siempre el espacio del que entra.
- **Herramienta de la 70 retirada:** `profesor-migracion.js`, `herramientas/ensayar-migracion.mjs` y su test. Queda en el historial (`git show a061493^:practicas/profesor-migracion.js`).
- **«Cuenta lectora del informe diario»:** pasa a su propia sección del panel, solo para el administrador (`practicas/profesor-lectores.js`, nuevo).
- **`resultados.js`:** `leerDocumentos` solo acepta `progreso-libre` y `progreso-tareas`, con el `indiceDe` del espacio; la rama `divisores` se ha quitado.
- **`src/firebase.js`:** fuera `listarPracticaDivisores`, `listarPracticas`, `listarPracticasTareas`, `listarAsignaciones` y `guardarAsignacion` (la vieja). La aplicación antigua de `src/` no se ha tocado.
- **Informe** (`herramientas/informe-actividad.mjs`): solo con `--espacio`. Sin él, sale el mensaje de uso y exit 2.
- **Reglas** (`firestore.rules`, **sin publicar**):
  - fuera los bloques de primer nivel de `divisores`, `practicas`, `practicas-tareas`, `practicas-asignaciones` y `fallos`: sin regla, Firestore las deniega;
  - la aplicación antigua de `src/` y los espacios no cambian.
- **Banco** (`herramientas/probar-reglas.mjs`): fuera las 7 comprobaciones del modo antiguo. Entran 30 nuevas: las cinco colecciones, sin cuenta y con la cuenta A, no dejan get, list ni create (403). Hay también una comprobación sin red: el fichero no tiene reglas para ellas.
- **Documentación:** `docs/practicas-unidad2.md` y `README.md` sin el modo antiguo; el §7 no se ha tocado.
- **Se quedan, como dice la ficha:**
  - los códigos de 4 registrados y `codigoSecreto(4)`, que descarta los calculables;
  - `tareas.js`, como plantilla y para lo que se ve sin código;
  - `adaptarProgreso` y `quitados`;
  - `divisores/index.html` sin redirigir;
  - `divisores/profesor.html`, que ya llevaba a `practicas/profesor.html` (no ha hecho falta tocarlo).

## Lo comprobado

- `npm test`: **1145 de 1145** antes del commit.
- **Tests nuevos** (`tests/practicas-codigos-4.test.js`):
  - un código de 4 registrado (el 62, XY4Z) entra en su espacio y ve su progreso;
  - uno de 4 sin registrar (el 60, 7NPD) no existe y no deja nada en el navegador;
  - uno de 8 sigue igual.
- **Tests rehechos** (lo que el modo antiguo daba por bueno ahora tiene que fallar): `espacio`, `nube`, `registro`, `semana`, `renumerar`, `resultados`, `comun` e `informe`.
- **Nube real, solo lecturas, con el código de este commit (Node):**
  - `7NPD` → «no-existe»;
  - `XY4Z` → espacio de A, n.º 62, 8 tareas; recta en `progreso-libre`: ej. 1 hecho, ej. 2 con 6 puntos (lo de la 70);
  - `B5YN` → espacio de A, n.º 63.
- **Pages, tras publicar:**
  - `practicas/_comun/espacio.js` es el nuevo;
  - `practicas/profesor-migracion.js` da 404;
  - `profesor.html` lleva `seccion-lectores`.
- **Informe con la cuenta lectora**, el mismo comando que la rutina (`--espacio <uid> --alumnos 51 --horas 24 --grupos …`), sin correo: exit 0, informe completo.
- **La cuenta lectora y las colecciones viejas:** `practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos` y `divisores` dan **403** con la lectora y sin cuenta. Las reglas publicadas solo se las dejan leer a la cuenta de Juan Luis (`esProfesor()`), así que **los pasos 1 y 2 no se han podido hacer con la lectora**.
- **El CSV de «Qué falla más» del 18-10:** está en `Curso 2026-2027/app/Fallos/fallos.csv` (232 líneas, las de la 70).
- **No comprobado en el navegador:** la extensión de Chrome estaba desconectada. Queda el panel (punto 3 de la lista).

## Lista de comprobación para Juan Luis (por este orden; nada se borra antes del punto 4)

1. **Pasos 1 y 2: comprobar y copiar las colecciones viejas** (solo tu cuenta puede leerlas).
   - Abre tu panel publicado con tu sesión: https://salasgar.github.io/Ejercicios-interactivos/practicas/profesor.html
   - En la consola (⌥⌘J; si Chrome lo pide, escribe antes «allow pasting»), pega el fragmento del final de esta entrega. Solo lee.
   - Saca una tabla con los documentos de cada colección, el recuento hecho por otro camino (consulta de recuento de Firestore) y cuántos se tocaron después del paso (18-10, 07:35Z). Descarga `copia-firestore-modo-antiguo-2026-10-25.json`.
   - Guárdalo en `Curso 2026-2027/copias-firestore/2026-10-25/` (nunca en el repositorio) y pide a una sesión que lo reparta documento a documento y cuadre los recuentos.
   - Si «tocados después del paso» no es 0 en alguna colección, **no borres**: hay que ver de quién es.
2. **Publicar las reglas.**
   - Consola: https://console.firebase.google.com/u/0/project/ejercicios-interactivos/firestore/databases/-default-/security/rules
   - Fichero, que se copia entero y luego «Publicar»: `/Users/salasgar/Documents/git/Ejercicios-interactivos/firestore.rules`
   - Después, el banco entero en Terminal, con las cuentas de prueba: `PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… node herramientas/probar-reglas.mjs`. Todo en verde, incluidas las 30 de «Colecciones del modo antiguo, cerradas».
3. **El panel** (recarga forzada, ⇧⌘R):
   - entra y comprueba que no sale el selector de sistema;
   - **«Mis alumnos»**: tus 51 alumnos con sus códigos de 4 de siempre;
   - **«Hoy»**: cuenta a los 51 (sin AJJN);
   - **«Qué falla más»**, tras «Cargar de la nube» y «Cargar fallos»: sale con datos;
   - la sección «Cuenta lectora del informe diario» enseña la lectora;
   - comprueba que esa noche llega el informe de las 21:30.
4. **Borrar**, solo con 1-3 en verde: en la consola de Firebase (Firestore → la colección → ⋮ → «Eliminar colección»), una a una: `practicas`, `practicas-tareas`, `practicas-asignaciones`, `fallos` y `divisores`. Que nadie lo haga por REST.
   - Para confirmar que quedan vacías, en la consola del panel, con tu sesión:
     ```js
     const { iniciarFirebase } = await import('/Ejercicios-interactivos/src/firebase.js'); const fb = await iniciarFirebase(); await new Promise(h => fb.observarSesion(h)); const t = await fb.usuario().getIdToken();
     for (const c of ['practicas', 'practicas-tareas', 'practicas-asignaciones', 'fallos', 'divisores']) console.log(c, (await (await fetch(`https://firestore.googleapis.com/v1/projects/ejercicios-interactivos/databases/(default)/documents/${c}?pageSize=1`, { headers: { Authorization: `Bearer ${t}` } })).json()).documents?.length ?? 0);
     ```
   - Con las reglas nuevas ya publicadas, esa consulta da 403 hasta para ti: comprueba en la propia consola de Firebase que las cinco ya no aparecen. Si quieres el comando, hazlo antes de publicar las reglas.
   - **Aviso:** hacerlo antes de publicar las reglas cambia el orden de la ficha. Lo seguro es: copia (1) → borrar (4) → comprobar vacías con el comando → publicar reglas (2) → panel (3).

## Fragmento del punto 1 (solo lee; el token no sale del navegador)

```js
(async () => {
  const { iniciarFirebase } = await import('/Ejercicios-interactivos/src/firebase.js');
  const fb = await iniciarFirebase();
  await new Promise(hecho => fb.observarSesion(hecho));
  if (!fb.usuario()) throw new Error('No hay sesión: entra antes en el panel con Google');
  const token = await fb.usuario().getIdToken();
  const base = 'https://firestore.googleapis.com/v1/projects/ejercicios-interactivos/databases/(default)/documents';
  const cabeceras = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const PASO = '2026-10-18T07:35:00Z';
  const salida = { hecho: new Date().toISOString(), cuenta: fb.usuario().email, paso: PASO, recuento: {}, recuentoIndependiente: {}, posterioresAlPaso: {}, documentos: {} };
  for (const col of ['practicas', 'practicas-tareas', 'practicas-asignaciones', 'fallos', 'divisores']) {
    const docs = [];
    let pagina = '';
    do {
      const r = await fetch(`${base}/${col}?pageSize=300${pagina}`, { headers: cabeceras });
      const j = await r.json();
      if (!r.ok) throw new Error(`${col}: HTTP ${r.status} ${JSON.stringify(j)}`);
      docs.push(...(j.documents ?? []));
      pagina = j.nextPageToken ? `&pageToken=${encodeURIComponent(j.nextPageToken)}` : '';
    } while (pagina);
    salida.documentos[col] = docs;
    salida.recuento[col] = docs.length;
    salida.posterioresAlPaso[col] = docs.filter(d => d.updateTime > PASO).map(d => ({ id: d.name.split('/').pop(), updateTime: d.updateTime }));
    const ra = await fetch(`${base}:runAggregationQuery`, {
      method: 'POST', headers: cabeceras,
      body: JSON.stringify({ structuredAggregationQuery: { structuredQuery: { from: [{ collectionId: col }] }, aggregations: [{ alias: 'n', count: {} }] } }),
    });
    const ja = await ra.json();
    salida.recuentoIndependiente[col] = ra.ok ? Number(ja?.[0]?.result?.aggregateFields?.n?.integerValue) : `error HTTP ${ra.status}`;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(salida)], { type: 'application/json' }));
  a.download = 'copia-firestore-modo-antiguo-2026-10-25.json';
  a.click();
  console.table(Object.keys(salida.recuento).map(c => ({ coleccion: c, documentos: salida.recuento[c], recuento_aparte: salida.recuentoIndependiente[c], tocados_despues_del_paso: salida.posterioresAlPaso[c].length })));
  return 'Hecho: mira la tabla y el fichero descargado.';
})();
```

## Correcciones a DISENO.md (para la 57; no se escribe allí)

- **E.4 / F.2:** los enlaces viejos no dicen «Tu código ha cambiado». Los códigos de 4 de Juan Luis siguen siendo los mismos, y uno sin registrar da «Ese código no existe».
- **F.4:** `divisores/` es la práctica viva (id 0), no se redirige. Solo `divisores/profesor.html` lleva al panel.
- **H.2, N11:** banda ALTO (no MEDIO); `tareas.js` se queda como plantilla.

## Lo que queda

- Los pasos 1-2 y 4-6 de la ficha, de Juan Luis (lista de arriba).
- La prueba del panel en navegador, que es el punto 3.
- En los navegadores de algunos alumnos pueden quedar claves `practicas.v1.antiguo.<código>`. Ya no las lee nadie; no molestan.
