// notas_tarea_app.mjs N [M …] — nota (sobre 100, o más con el reto: base + extra; la que ve el alumno en la app: estadoTarea) de los 51 alumnos
// en las tareas N, M… de la app de Juan Luis. Solo lee. Para la skill «atender-correo» (referencias/calificar.md, «Tareas de la app»).
// Uso: cd ~/Documents/git/Ejercicios-interactivos && LECTOR_EMAIL="lector-informe@example.com" \
//   LECTOR_CLAVE="$(security find-generic-password -s firebase-lector-informe -w)" node ~/.claude/lanzador/notas_tarea_app.mjs 15 16 17
// Salida (una línea JSON):
//   - con UN número, la de siempre: { titulo, hasta, alumnos: [{ numero, existe, puntos, base, extra, cumplida, hechos, de }] };
//   - con VARIOS, todas de UNA lectura: { tareas: [{ id, titulo, hasta, alumnos: […] }, …] }, en el orden pedido.
// OJO: el «puntos» de herramientas/informe-actividad.mjs NO es la nota (suma objetivos; 74 en una tarea completa).
//
// CUOTA (18-11-2026; tarea 210 de PU2, 19-11): el plan gratuito da ~50 000 lecturas al día (se renuevan a las 9:00 de Madrid) y
// una lectura completa de progreso-libre + progreso-tareas son ~1 300. El 18-11 dos bucles de subagentes agotaron la cuota y la
// app de los alumnos se quedó sin leer hasta el día siguiente. Desde la 210:
//   - VARIAS TAREAS EN UNA EJECUCIÓN (`… 15 16 17`), nunca un bucle sobre tareas ni para buscar la vigente (eso está en config/tareas);
//   - caché local (herramientas/cache-lecturas.mjs; fuera del repo, en ~/.claude/cache/firestore-practicas/, 600): la primera vez
//     lee todo; después solo lo cambiado (con 2 días de margen); NADA si la última lectura es de hace menos de 10 min (usa la
//     caché y lo dice en stderr); todo otra vez cada 7 días. `--leer-todo` fuerza la lectura completa; `--sin-cache`, la de antes
//     (todo, sin guardar nada);
//   - ante un 429 (cuota agotada) o un 5xx: una línea en stderr y salida 3 (cuota) o 4 (servidor), sin JSON y sin caché a medias.
//     NO reintentes: con 3, hasta las 9:00 de Madrid no hay nada que hacer.
import { tareaPorId, configDeJSON } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/practicas/_comun/tareas.js';
import { leerConfig } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/practicas/_comun/nube.js';
import { firebaseConfig } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/src/config.js';
import {
  leerEspacio, documentosAMapa, notasDeTarea, listaDeSiempre, leerIdsTareas, ErrorFirestore, codigoDeSalida,
} from '/Users/salasgar/Documents/git/Ejercicios-interactivos/herramientas/informe-actividad.mjs';

const uid = 'TaU3nTL3CnU5Uwz0GzmrNDdSbTj2';
const opciones = process.argv.slice(2).filter(a => a.startsWith('--'));
const ids = leerIdsTareas(process.argv.slice(2).filter(a => !a.startsWith('--')).join(' '));
const parar = (texto, codigo) => { console.error(texto); process.exit(codigo); };
if (!ids) parar('Uso: node ~/.claude/lanzador/notas_tarea_app.mjs N [M …] [--leer-todo | --sin-cache] (números de tarea de la app)', 2);

try {
  // Guarda del 18-11, ampliada: sin configuración no se lee nada más.
  const lectura = await leerConfig(uid);
  if (!lectura || lectura.estado !== 'ok' || !lectura.json) {
    if (lectura?.motivo) throw new ErrorFirestore(lectura.motivo === 'cuota' ? 429 : 500, 'config/tareas');
    parar('No se puede leer la configuración de la app (estado: ' + (lectura?.estado ?? 'desconocido') + '). Si es 429, la cuota diaria de Firestore está agotada hasta las 9:00 de Madrid: NO reintentes.', 2);
  }
  const todas = configDeJSON(lectura.json)?.tareas ?? [];
  const faltan = ids.filter(id => !tareaPorId(id, todas));
  if (faltan.length) parar(`La app no tiene la tarea ${faltan.join(', ')}`, 2);

  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.LECTOR_EMAIL, password: process.env.LECTOR_CLAVE, returnSecureToken: true }) });
  const token = (await r.json().catch(() => ({}))).idToken;
  if (!r.ok || !token) parar(`No se ha podido iniciar sesión con la cuenta lectora (HTTP ${r.status}); ¿LECTOR_EMAIL y LECTOR_CLAVE?`, 2);

  const sinCache = opciones.includes('--sin-cache');
  const { docs: crudos, lectura: deCache } = await leerEspacio(uid, ['progreso-libre', 'progreso-tareas'], token,
    { cache: !sinCache, leerTodo: opciones.includes('--leer-todo') });
  if (deCache) console.error((await import('/Users/salasgar/Documents/git/Ejercicios-interactivos/herramientas/cache-lecturas.mjs')).textoLectura(deCache));
  const docs = documentosAMapa(crudos['progreso-libre'], crudos['progreso-tareas']);
  const lista = listaDeSiempre(51);
  const notas = ids.map(id => ({ id, ...notasDeTarea(tareaPorId(id, todas), docs, lista) }));
  if (ids.length === 1) { const { id, ...una } = notas[0]; console.log(JSON.stringify(una)); }
  else console.log(JSON.stringify({ tareas: notas }));
} catch (e) {
  parar(e instanceof ErrorFirestore ? e.message : String(e?.message ?? e), codigoDeSalida(e));
}
