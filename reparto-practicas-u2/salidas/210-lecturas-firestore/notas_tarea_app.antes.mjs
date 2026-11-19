// notas_tarea_app.mjs N — nota (sobre 100, o más con el reto: base + extra; la que ve el alumno en la app: estadoTarea) de los 51 alumnos en la tarea N
// de la app de Juan Luis. Solo lee. Para la skill «atender-correo» (referencias/calificar.md, «Tareas de la app»).
// Uso: cd ~/Documents/git/Ejercicios-interactivos && LECTOR_EMAIL="lector-informe@example.com" \
//   LECTOR_CLAVE="$(security find-generic-password -s firebase-lector-informe -w)" node ~/.claude/lanzador/notas_tarea_app.mjs 15
// OJO: el «puntos» de herramientas/informe-actividad.mjs NO es la nota (suma objetivos; 74 en una tarea completa).
// CUOTA (18-11-2026): cada ejecución lee ENTERAS progreso-libre y progreso-tareas (~1 300 lecturas de las 50 000
// diarias del plan gratuito, y crece). NUNCA en bucle sobre tareas ni para buscar cuál es la vigente (eso está en
// config/tareas). Como mucho 2-3 por pasada. El 18-11 dos bucles de subagentes agotaron la cuota y la app de los
// alumnos se quedó sin leer hasta las 9:00 del día siguiente.
import { tareaPorId, estadoTarea, configDeJSON } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/practicas/_comun/tareas.js';
import { leerConfig } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/practicas/_comun/nube.js';
import { firebaseConfig } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/src/config.js';
import { listarSubcoleccion, documentosAMapa, claveDocumento, ejerciciosDe, listaDeSiempre } from '/Users/salasgar/Documents/git/Ejercicios-interactivos/herramientas/informe-actividad.mjs';
const uid = 'TaU3nTL3CnU5Uwz0GzmrNDdSbTj2', id = Number(process.argv[2]);
const lectura = await leerConfig(uid);
if (!lectura || lectura.estado !== 'ok' || !lectura.json) {
  console.error('No se puede leer la configuración de la app (estado: ' + (lectura?.estado ?? 'desconocido') + '). Si es 429, la cuota diaria de Firestore está agotada hasta las 9:00 de Madrid: NO reintentes.');
  process.exit(2);
}
const tarea = tareaPorId(id, configDeJSON(lectura.json).tareas);
const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.LECTOR_EMAIL, password: process.env.LECTOR_CLAVE, returnSecureToken: true }) });
const token = (await r.json()).idToken;
const [libre, deTareas] = await Promise.all(['progreso-libre', 'progreso-tareas'].map(s => listarSubcoleccion(uid, s, token)));
const docs = documentosAMapa(libre, deTareas);
// Con el reto: ejerciciosDe no lo incluye y, sin leer sus documentos, el extra saldría 0 sin avisar (tarea 205 de PU2).
const slugs = [...new Set([...tarea.estrella, ...tarea.elegir, ...(tarea.reto ?? [])].map(([s]) => s))];
const out = [];
for (const { numero, codigo } of listaDeSiempre(51)) {
  const porSlug = new Map(); let existe = false;
  for (const slug of slugs) { const d = docs.get(claveDocumento(tarea, slug, codigo)); if (d) { existe = true; porSlug.set(slug, Array.isArray(d.ej) ? d.ej : []); } }
  const e = estadoTarea(tarea, (slug, n) => porSlug.get(slug)?.[n - 1] ?? null);
  out.push({ numero, existe, puntos: e.puntos, base: e.base, extra: e.extra, cumplida: e.cumplida, hechos: e.estrellaHechos, de: tarea.estrella.length });
}
console.log(JSON.stringify({ titulo: tarea.titulo.es, hasta: tarea.hasta, alumnos: out }));
