// Registro de cada fallo (tarea 39 del reparto PU2).
//
// Cada vez que un alumno con código falla un ítem, la base guarda en Firestore
// un documento en la colección `fallos` del espacio de su profesor (uno por fallo: decisión de Juan Luis
// del 16-10-2026) con qué práctica y ejercicio era, el ítem (lo que devolvió
// `generar`, recortado), el feedback en texto plano (que ya dice qué ha pasado
// con esos números) y, si la práctica los pasa a `api.responder`, el tipo de
// `error` y la `respuesta` del alumno; si se hizo desde una tarea, su id
// (`tarea`, desde la tarea 51). Los aciertos no se registran uno a uno
// (ya están los recuentos del progreso).
//
// El alumno solo puede CREAR documentos (regla en `firestore.rules`); leerlos,
// solo el profesor (desde el panel) y sus lectores. El alumno no nota nada: la escritura no se
// espera, y si falla (sin red) queda en una cola del navegador que se reintenta
// en el siguiente fallo o al entrar. El id del documento lo pone la app, así que
// un reintento de algo que sí llegó no lo duplica (Firestore responde 409).
//
// La colección es `practicas-espacios/{uid}/fallos`, la del profesor del código
// (varios profesores, tareas 64 y 72; de 4 u 8 caracteres). Si al fallar aún no
// se sabe de qué profesor es el código (sin red al entrar), se queda en la cola
// hasta que lo diga la copia del navegador que deja `espacio.js`. Desde la tarea
// 71 no hay colección sin profesor: la `fallos` del modo antiguo ya no existe.

import { firebaseConfig } from '../../src/config.js';
import { claveEspacio } from './espacio.js';
import { coleccionEspacio } from './nube.js';

/** Topes de cada campo de texto (los mismos que comprueba la regla). */
export const LIMITES = { item: 400, feedback: 500, respuesta: 80, error: 40 };
/** Fallos sin enviar que se guardan en el navegador, como mucho. */
export const MAX_PENDIENTES = 50;
const CLAVE_PENDIENTES = 'practicas.fallos.pendientes';
export const VERSION = 1;

/**
 * Qué destrezas del inventario trabaja cada práctica: las de la unidad 2, como en el §7 de
 * docs/practicas-unidad2.md, y las de la unidad 3, como en el §7 de docs/practicas-unidad3.md
 * (puestas por la tarea 79 de PU2 a partir de las fichas 80-91). En el orden del inventario.
 */
export const DESTREZAS = {
  arbol: ['U2-2B-02', 'U2-2C-08', 'U2-2C-09', 'U2-2C-11', 'U2-2C-13'],
  baldosas: ['U2-2A-02', 'U2-3A-01', 'U2-4A-03', 'U2-4A-04', 'U2-4A-07'],
  clasificador: ['U2-1A-01', 'U2-1A-04', 'U2-4A-01', 'U2-4B-01', 'U2-4B-02'],
  criba: ['U2-2B-01', 'U2-2C-01', 'U2-2C-02', 'U2-2C-03', 'U2-2C-04', 'U2-2C-05', 'U2-2C-06', 'U2-2C-07'],
  divisiones: ['U2-2B-02', 'U2-2C-10', 'U2-2C-11', 'U2-2C-12'],
  divisores: ['U2-1B-01', 'U2-1C-01', 'U2-1C-02'],
  errores: ['U2-4C-01', 'U2-4C-02', 'U2-4C-03'],
  fabrica: ['U2-2C-14', 'U2-3C-02'],   // sin U2-3C-01 desde que se quitó «Construye el divisor» (tarea 76)
  factorizaciones: ['U2-2C-11', 'U2-2C-12', 'U2-2C-14', 'U2-3C-03', 'U2-3C-04'],
  imposibles: ['U2-1A-04', 'U2-3C-10', 'U2-3C-11', 'U2-4C-03'],
  leelo: ['U2-1B-01', 'U2-1B-02', 'U2-1B-05', 'U2-2B-01', 'U2-2B-02', 'U2-2B-03', 'U2-3B-03'],
  recta: ['U2-1C-02', 'U2-1C-03', 'U2-1C-04'],
  rectangulos: ['U2-1B-04', 'U2-1C-13', 'U2-1C-14'],
  reloj: ['U2-1A-02', 'U2-2A-03', 'U2-3A-04', 'U2-4A-02', 'U2-4A-07'],
  semaforo: ['U2-1C-05', 'U2-1C-06', 'U2-1C-07', 'U2-1C-08', 'U2-1C-09', 'U2-1C-10'],
  venn: ['U2-3B-01', 'U2-3C-03', 'U2-3C-04', 'U2-3C-05', 'U2-3C-06', 'U2-3C-08', 'U2-3C-10'],
  // Unidad 3
  'dos-signos': ['U3-2C-05', 'U3-2C-06', 'U3-2C-07', 'U3-2C-08', 'U3-2C-10'],
  errores3: ['U3-2C-21', 'U3-3C-19', 'U3-4A-05', 'U3-4C-08', 'U3-4C-09'],
  'jerarquia-enteros': ['U3-3A-01', 'U3-3A-02', 'U3-3A-03', 'U3-3C-20', 'U3-4A-01', 'U3-4A-02'],
  leelo3: ['U3-1B-01', 'U3-1B-02', 'U3-1B-03', 'U3-2B-01', 'U3-2B-02', 'U3-2B-03', 'U3-3B-02', 'U3-4B-01', 'U3-4B-02'],
  opuestos: ['U3-1C-07', 'U3-1C-08', 'U3-1C-09', 'U3-1C-10'],
  'parentesis-enteros': ['U3-3A-04', 'U3-3C-16', 'U3-3C-17', 'U3-3C-18', 'U3-4A-03', 'U3-4A-04', 'U3-4A-06', 'U3-4A-07'],
  'potencias-enteros': ['U3-3C-02', 'U3-3C-03', 'U3-3C-10', 'U3-3C-11', 'U3-3C-12', 'U3-3C-13', 'U3-3C-14', 'U3-3C-15'],
  saltos: ['U3-1A-01', 'U3-1A-02', 'U3-1C-11', 'U3-1C-12', 'U3-1C-13', 'U3-1C-14', 'U3-1C-15', 'U3-2A-01', 'U3-2C-01', 'U3-2C-02', 'U3-2C-03', 'U3-2C-04'],
  'signos-producto': ['U3-2C-15', 'U3-2C-16', 'U3-2C-17', 'U3-2C-18', 'U3-2C-19', 'U3-2C-20', 'U3-2C-21'],
  situaciones: ['U3-1B-04', 'U3-1C-01', 'U3-1C-16'],
  termometro: ['U3-1C-02', 'U3-1C-03', 'U3-1C-04', 'U3-1C-05', 'U3-1C-06'],
  variacion: ['U3-3C-21', 'U3-4B-02', 'U3-4C-01', 'U3-4C-02', 'U3-4C-03', 'U3-4C-04', 'U3-4C-05', 'U3-4C-07', 'U3-4C-10'],
};

// --- Qué se guarda -------------------------------------------------------------------

const SUPERINDICES = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', times: '×', divide: '÷', minus: '−', hellip: '…', rarr: '→', larr: '←' };

/** Recorta un texto a `max` caracteres (con «…» al final si sobraba). */
export function recortar(texto, max) {
  const s = String(texto ?? '');
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

/**
 * El texto de un HTML de feedback: sin etiquetas, con los exponentes como
 * superíndices («2<sup>3</sup>» → «2³»), los saltos de línea como « / » y los
 * espacios juntados. No interpreta el HTML: solo lo limpia para leerlo.
 */
export function textoPlano(html) {
  return String(html ?? '')
    .replace(/<sup>\s*([0-9]+)\s*<\/sup>/gi, (_, n) => [...n].map(c => SUPERINDICES[c]).join(''))
    .replace(/<br\s*\/?>|<\/(p|li|div|tr)>/gi, ' / ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (todo, e) => {
      if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : todo;
      }
      return ENTIDADES[e.toLowerCase()] ?? todo;
    })
    .replace(/\s+/g, ' ')
    .replace(/^( \/ |\s)+|( \/ |\s)+$/g, '')
    .replace(/( \/ ){2,}/g, ' / ');
}

/** El ítem (lo que devolvió `generar`) en JSON, sin funciones ni ciclos, recortado. */
export function itemTexto(item, max = LIMITES.item) {
  const vistos = new WeakSet();
  let texto;
  try {
    texto = JSON.stringify(item, (_, v) => {
      if (typeof v === 'function' || typeof v === 'symbol') return undefined;
      if (typeof v === 'bigint') return String(v);
      if (v && typeof v === 'object') {
        if (vistos.has(v)) return '[…]';
        vistos.add(v);
      }
      return v;
    });
  } catch { texto = String(item); }
  return recortar(texto ?? '', max);
}

/** Un identificador de error válido (minúsculas, cifras y guiones, hasta 40) o ''. */
export function errorValido(error) {
  const s = String(error ?? '').trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{0,39}$/.test(s) ? s : '';
}

/** Id del documento: «<código>-<hora en base 36>-<4 al azar>». La regla comprueba la forma. */
export function idFallo(codigo, t, azar = Math.random) {
  const sufijo = Array.from({ length: 4 }, () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(azar() * 36)]).join('');
  return `${codigo}-${Math.max(0, Math.floor(t)).toString(36)}-${sufijo}`;
}

/** Tope del id de tarea (el de `tareas.js` y el de la regla). */
const MAX_TAREA = 1023;
/** Un id de tarea que la regla acepta (entero de 1 a 1023), o null. */
export const tareaValida = tarea => (Number.isInteger(tarea) && tarea >= 1 && tarea <= MAX_TAREA ? tarea : null);

/**
 * Los datos de UN fallo, tal como se guardan. `ejercicio` empieza en 1.
 * `repeticion`: el ejercicio ya estaba terminado y lo está practicando otra vez.
 * `tarea`: el id de la tarea desde la que se hizo (tarea 51; también la 1); sin
 * tarea (práctica libre) el campo no va.
 */
export function datosFallo({ codigo, slug, ejercicio, idioma, item, html, respuesta, error, t = Date.now(), dia = 0, repeticion = false, tarea = null }) {
  const datos = {
    v: VERSION,
    alumno: String(codigo),
    practica: String(slug),
    ejercicio: Math.max(1, Math.floor(ejercicio) || 1),
    t: Math.floor(t),
    dia: Math.max(0, Math.floor(dia) || 0),
    idioma: idioma === 'en' ? 'en' : 'es',
    item: itemTexto(item),
    feedback: recortar(textoPlano(html), LIMITES.feedback),
    repeticion: Boolean(repeticion),
  };
  const r = respuesta === undefined || respuesta === null ? '' : recortar(textoPlano(String(respuesta)), LIMITES.respuesta);
  if (r) datos.respuesta = r;
  const e = errorValido(error);
  if (e) datos.error = e;
  const id = tareaValida(tarea);
  if (id !== null) datos.tarea = id;
  return datos;
}

/** Los datos en el formato de campos de Firestore REST. */
export function camposRest(datos) {
  const fields = {};
  for (const [k, v] of Object.entries(datos)) {
    fields[k] = typeof v === 'boolean' ? { booleanValue: v } : Number.isInteger(v) ? { integerValue: String(v) } : { stringValue: String(v) };
  }
  return fields;
}

/** Lo contrario: un documento de Firestore REST → datos planos (o null si no es un fallo). */
export function datosDeDocumento(doc) {
  const f = doc?.fields;
  if (!f) return null;
  const datos = {};
  for (const [k, v] of Object.entries(f)) {
    datos[k] = 'integerValue' in v ? Number(v.integerValue) : 'booleanValue' in v ? v.booleanValue : 'doubleValue' in v ? v.doubleValue : v.stringValue ?? null;
  }
  if (typeof datos.alumno !== 'string' || typeof datos.practica !== 'string' || !Number.isInteger(datos.ejercicio)) return null;
  datos.id = String(doc.name ?? '').split('/').pop();
  return datos;
}

// --- Escritura (alumno) ------------------------------------------------------------------

const urlColeccion = (config, coleccion) => (config?.apiKey && config?.projectId
  ? `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${coleccion}` : null);

/** El profesor de un código secreto según la copia del navegador de `espacio.js`, o null. */
function profesorGuardado(almacen, codigo) {
  try {
    const profesor = JSON.parse(almacen?.getItem(claveEspacio(codigo)) ?? 'null')?.profesor;
    return typeof profesor === 'string' && profesor ? profesor : null;
  } catch { return null; }
}

/**
 * La colección a la que va un fallo pendiente: la del espacio de su profesor si
 * se sabe cuál es (el del fallo o el de la copia del navegador); si no, null
 * (se queda en la cola).
 */
export function coleccionFallo(pendiente, almacen = null) {
  const alumno = String(pendiente?.datos?.alumno ?? '');
  const profesor = pendiente?.profesor ?? profesorGuardado(almacen, alumno);
  if (!profesor) return null;
  try { return coleccionEspacio(profesor, 'fallos'); } catch { return null; }
}

function leerPendientes(almacen) {
  try {
    const lista = JSON.parse(almacen?.getItem(CLAVE_PENDIENTES) ?? '[]');
    return Array.isArray(lista) ? lista.filter(p => p && typeof p.id === 'string' && p.datos) : [];
  } catch { return []; }
}
function guardarPendientes(almacen, lista) {
  try {
    if (lista.length) almacen?.setItem(CLAVE_PENDIENTES, JSON.stringify(lista.slice(-MAX_PENDIENTES)));
    else almacen?.removeItem(CLAVE_PENDIENTES);
  } catch { /* sin almacén: se pierde, el alumno no nota nada */ }
}

let enviando = Promise.resolve();

/**
 * Manda los fallos pendientes de este navegador, uno detrás de otro. Lo que no
 * llega se queda para la próxima vez; lo que la regla rechaza (403, 400) se
 * descarta, para no reintentarlo siempre. Nunca lanza.
 */
export function enviarPendientes({ fetch: pedir = globalThis.fetch, config = firebaseConfig, almacen = globalThis.localStorage } = {}) {
  enviando = enviando.then(async () => {
    const pendientes = leerPendientes(almacen);
    if (!pendientes.length) return;
    const quedan = [];
    for (const p of pendientes) {
      const coleccion = coleccionFallo(p, almacen);
      const url = coleccion && urlColeccion(config, coleccion);
      if (!url || typeof pedir !== 'function') { quedan.push(p); continue; }
      let r = null;
      try {
        r = await pedir(`${url}?documentId=${encodeURIComponent(p.id)}&key=${config.apiKey}`, {
          method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: camposRest(p.datos) }),
        });
      } catch { r = null; }
      const definitivo = r && (r.ok || r.status === 409 || r.status === 400 || r.status === 403);
      if (!definitivo) quedan.push(p);
    }
    // Lo que se haya añadido mientras tanto, también se conserva.
    const ahora = leerPendientes(almacen).filter(p => !pendientes.some(q => q.id === p.id));
    guardarPendientes(almacen, [...quedan, ...ahora]);
  }).catch(() => {});
  return enviando;
}

/**
 * Registra un fallo: lo pone en la cola del navegador y la manda. No hay que
 * esperarlo (devuelve la promesa por si un test quiere hacerlo). `profesor`
 * es el uid del espacio del alumno (null si aún no se sabe).
 */
export function registrarFallo(datos, { profesor = null, ...opciones } = {}) {
  const almacen = opciones.almacen ?? globalThis.localStorage;
  const pendiente = { id: idFallo(datos.alumno, datos.t), datos, ...(profesor && { profesor }) };
  guardarPendientes(almacen, [...leerPendientes(almacen), pendiente]);
  return enviarPendientes({ ...opciones, almacen });
}
