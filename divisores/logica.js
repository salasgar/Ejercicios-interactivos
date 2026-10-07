// Práctica «divisor, múltiplo, divisible»: generadores, contador de
// repeticiones y códigos (el del alumno y el de resultado). Todo puro, sin
// DOM ni red, para poder probarlo con `npm test`.

// --- Azar -------------------------------------------------------------------

/** Generador con semilla (mulberry32): mismos números con la misma semilla. */
export function crearRng(semilla) {
  let s = semilla >>> 0;
  const azar = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const entero = (min, max) => min + Math.floor(azar() * (max - min + 1));
  const elegir = lista => lista[Math.floor(azar() * lista.length)];
  const barajar = lista => {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };
  return { azar, entero, elegir, barajar };
}

// --- Las tres relaciones ----------------------------------------------------

export const RELACIONES = ['divisor', 'multiplo', 'divisible'];

/**
 * ¿Es verdad «x es <relación> y»? «Múltiplo de» y «divisible entre» dicen lo
 * mismo (x = y · k); «divisor de» es lo contrario (y = x · k). Nunca se
 * pregunta por «múltiplo de 0» ni «divisible entre 0».
 */
export function cumple(relacion, x, y) {
  if (relacion === 'divisor') return x !== 0 && y % x === 0;
  return y !== 0 && x % y === 0;
}

/** Todas las relaciones que cumple la pareja (x, y). */
export function relacionesDe(x, y) {
  return RELACIONES.filter(r => cumple(r, x, y));
}

// --- Generadores ------------------------------------------------------------

export const EJERCICIOS = [0, 1, 2, 3, 4];

// Una operación es { clase, a, b, c }: a · b = c, o bien a : b = c (resto 0).
// Salen también los casos especiales: un factor 1 y un factor 0.

function producto(rng, conCero = true) {
  const r = rng.azar();
  let a, b;
  if (conCero && r < 0.06) { a = rng.entero(2, 20); b = 0; }
  else if (r < 0.18) { a = rng.entero(2, 30); b = 1; }
  else { a = rng.entero(2, 25); b = rng.entero(2, 12); }
  if (rng.azar() < 0.5) [a, b] = [b, a];
  return { clase: 'producto', a, b, c: a * b };
}

function division(rng, conCero = true) {
  const r = rng.azar();
  let divisor, cociente;
  if (conCero && r < 0.05) { divisor = rng.entero(2, 20); cociente = 0; }
  else if (r < 0.17) { divisor = rng.entero(2, 30); cociente = 1; if (rng.azar() < 0.5) [divisor, cociente] = [cociente, divisor]; }
  else { divisor = rng.entero(2, 12); cociente = rng.entero(2, 25); if (rng.azar() < 0.5) [divisor, cociente] = [cociente, divisor]; }
  return { clase: 'division', a: divisor * cociente, b: divisor, c: cociente };
}

/** El número «grande» (producto o dividendo) y los dos «pequeños». */
function partes(op) {
  return op.clase === 'producto' ? { grande: op.c, pequenos: [op.a, op.b] } : { grande: op.a, pequenos: [op.b, op.c] };
}

/**
 * Una pareja (x, y) de la operación. `sentido` es 'pequeno' (x es uno de los
 * pequeños: «5 es … 60») o 'grande' («60 es … 5»). Con el cero solo se
 * pregunta «0 es … 14».
 */
function pareja(op, sentido, rng) {
  const { grande, pequenos } = partes(op);
  if (grande === 0) return [0, pequenos.find(p => p !== 0)];
  const p = rng.elegir(pequenos);
  return sentido === 'pequeno' ? [p, grande] : [grande, p];
}

function operacion(clase, rng, conCero = true) {
  return clase === 'producto' ? producto(rng, conCero) : division(rng, conCero);
}

/** Ejercicios 1, 2 y 3: elegir la relación que va en el hueco. */
function eleccion(clase, rng) {
  const op = operacion(clase, rng);
  const [x, y] = pareja(op, rng.azar() < 0.5 ? 'pequeno' : 'grande', rng);
  return { tipo: 'eleccion', op, x, y, opciones: RELACIONES, correctas: relacionesDe(x, y) };
}

/** Ejercicio 0: «400 es múltiplo ___ 16» → «de» o «entre». Mitad y mitad. */
function preposicion(rng) {
  const op = producto(rng);
  const quiereEntre = rng.azar() < 0.5;
  const [x, y] = pareja(op, quiereEntre || rng.azar() < 0.5 ? 'grande' : 'pequeno', rng);
  const validas = relacionesDe(x, y);
  let relacion = quiereEntre ? 'divisible' : rng.elegir(validas.filter(r => r !== 'divisible'));
  if (!validas.includes(relacion)) relacion = validas[0];
  return { tipo: 'preposicion', op, x, y, relacion, opciones: ['de', 'entre'], correcta: relacion === 'divisible' ? 'entre' : 'de' };
}

/** Ejercicio 4: arrastrar dos de los tres números a «__ es múltiplo de __». */
function arrastrar(rng) {
  const op = operacion(rng.azar() < 0.7 ? 'producto' : 'division', rng, false);
  return { tipo: 'arrastrar', op, relacion: rng.elegir(RELACIONES), numeros: rng.barajar([op.a, op.b, op.c]) };
}

export function generar(ejercicio, rng) {
  switch (ejercicio) {
    case 0: return preposicion(rng);
    case 1: return eleccion('producto', rng);
    case 2: return eleccion('division', rng);
    case 3: return eleccion(rng.azar() < 0.5 ? 'producto' : 'division', rng);
    case 4: return arrastrar(rng);
    default: throw new Error(`Ejercicio desconocido: ${ejercicio}`);
  }
}

/** ¿Es correcta la respuesta? En el ejercicio 4 la respuesta es [x, y]. */
export function esCorrecta(item, respuesta) {
  if (item.tipo === 'eleccion') return item.correctas.includes(respuesta);
  if (item.tipo === 'preposicion') return respuesta === item.correcta;
  return cumple(item.relacion, respuesta[0], respuesta[1]);
}

/** Una colocación correcta del ejercicio 4 (para enseñarla tras un fallo). */
export function solucionArrastrar(item) {
  const n = item.numeros;
  for (let i = 0; i < n.length; i++) {
    for (let j = 0; j < n.length; j++) {
      if (i !== j && cumple(item.relacion, n[i], n[j])) return [n[i], n[j]];
    }
  }
  return null;
}

/** Identifica un ítem, para no repetir el mismo dos veces seguidas. */
export function claveDe(item) {
  return JSON.stringify([item.tipo, item.op, item.x, item.y, item.relacion]);
}

// --- Contador de repeticiones -----------------------------------------------

export const INICIALES = 20;
export const PENALIZACION = 5;
export const MAXIMO = 40;   // tope de pendientes, para que nadie se hunda

export function ejercicioNuevo() {
  return { pendientes: INICIALES, aciertos: 0, fallos: 0, terminado: false, dia: 0, repeticiones: 0 };
}

/** Anota una respuesta: un acierto quita una pendiente; un fallo añade cinco (hasta el máximo). */
export function anotar(ej, acierto, dia = 0) {
  if (ej.terminado) return ej;
  const sig = { ...ej };
  if (acierto) { sig.aciertos++; sig.pendientes--; } else { sig.fallos++; sig.pendientes = Math.max(sig.pendientes, Math.min(MAXIMO, sig.pendientes + PENALIZACION)); }
  if (sig.pendientes <= 0) { sig.pendientes = 0; sig.terminado = true; sig.dia = dia; }
  return sig;
}

// --- Fechas -----------------------------------------------------------------

const ORIGEN = Date.UTC(2026, 8, 1); // 1 de septiembre de 2026 = día 0

/** Días desde el 1-9-2026 (en la fecha local del alumno), entre 0 y 1023. */
export function diaDe(fecha) {
  const utc = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  return Math.max(0, Math.min(1023, Math.round((utc - ORIGEN) / 86400000)));
}

/** «7/10/2026» a partir del número de día. */
export function fechaDeDia(dia) {
  const f = new Date(ORIGEN + dia * 86400000);
  return `${f.getUTCDate()}/${f.getUTCMonth() + 1}/${f.getUTCFullYear()}`;
}

// --- Códigos ----------------------------------------------------------------
//
// El código del alumno (4 caracteres) lleva su número de lista y dos
// caracteres de control. El código de resultado (12 caracteres) lleva ese
// número, qué ejercicios ha terminado, con cuántos fallos, la fecha y tres
// caracteres de control; va enmascarado para que no se lea a simple vista.
//
// No es criptografía: este archivo es público, así que quien lo lea puede
// fabricarse un código. Basta para que no se invente a ojo ni se copie el de
// un compañero (el código de resultado dice de quién es).

/** Sin I, O, 0 ni 1, que se confunden al copiar a mano. */
export const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const MAX_ALUMNOS = 1024;
const SAL = 'divisores/1eso/2026-27';
const PASO = 389;      // impar: recorre los 1024 valores sin repetir
const DESFASE = 517;

function hash(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

const simbolos = valores => valores.map(v => ALFABETO[v]).join('');
const valores = texto => [...texto].map(c => ALFABETO.indexOf(c));
const limpiar = texto => String(texto).toUpperCase().replace(/[^A-Z0-9]/g, '');

const mezclado = indice => (indice * PASO + DESFASE) % MAX_ALUMNOS;
const DESMEZCLADO = new Map(Array.from({ length: MAX_ALUMNOS }, (_, i) => [mezclado(i), i]));

/** Código del alumno número `indice` (0 = el primero de la lista). */
export function codigoAlumno(indice) {
  const s = mezclado(indice);
  const c = hash(`${SAL}|alumno|${s}`) % 1024;
  return simbolos([s >> 5, s & 31, c >> 5, c & 31]);
}

/** Número de lista de un código de alumno, o `null` si no es válido. */
export function leerCodigoAlumno(texto) {
  const t = limpiar(texto);
  if (t.length !== 4) return null;
  const v = valores(t);
  if (v.includes(-1)) return null;
  const s = (v[0] << 5) | v[1];
  if (hash(`${SAL}|alumno|${s}`) % 1024 !== ((v[2] << 5) | v[3])) return null;
  return DESMEZCLADO.get(s);
}

const mascara = (control, i) => hash(`${SAL}|mascara|${control}|${i}`) & 31;
const controlDe = datos => hash(`${SAL}|resultado|${datos.join(',')}`) % 32768;

/**
 * Código de resultado. `ejercicios` son los cinco, en orden, con `terminado`
 * y `fallos` (se guardan hasta 15); `dia` es el del último que terminó.
 */
export function codigoResultado(indice, ejercicios, dia) {
  const s = mezclado(indice);
  const datos = [
    s >> 5, s & 31,
    ...EJERCICIOS.map(n => (ejercicios[n].terminado ? 16 : 0) | Math.min(ejercicios[n].fallos, 15)),
    (dia >> 5) & 31, dia & 31,
  ];
  const control = controlDe(datos);
  const texto = simbolos([...datos.map((d, i) => d ^ mascara(control, i)), control >> 10, (control >> 5) & 31, control & 31]);
  return texto.match(/.{4}/g).join('-');
}

/** Lo contrario: { indice, ejercicios: [{ terminado, fallos }], dia } o `null`. */
export function leerCodigoResultado(texto) {
  const t = limpiar(texto);
  if (t.length !== 12) return null;
  const v = valores(t);
  if (v.includes(-1)) return null;
  const control = (v[9] << 10) | (v[10] << 5) | v[11];
  const datos = v.slice(0, 9).map((d, i) => d ^ mascara(control, i));
  if (controlDe(datos) !== control) return null;
  const indice = DESMEZCLADO.get((datos[0] << 5) | datos[1]);
  const ejercicios = datos.slice(2, 7).map(d => ({ terminado: Boolean(d & 16), fallos: d & 15 }));
  return { indice, ejercicios, dia: (datos[7] << 5) | datos[8] };
}

/** Todos los códigos de resultado que aparezcan en un texto cualquiera. */
export function extraerCodigosResultado(texto) {
  const c = '[A-HJ-NP-Z2-9]';
  const patron = new RegExp(`(?<![A-Z0-9])${c}{4}[- ]?${c}{4}[- ]?${c}{4}(?![A-Z0-9])`, 'g');
  return [...new Set(String(texto).toUpperCase().match(patron) ?? [])];
}
