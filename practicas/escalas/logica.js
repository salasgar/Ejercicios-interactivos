// Práctica «Escalas» (unidad 7, sesiones 16-18; PU2, tarea 222): puro, sin DOM.
// Ejercicios: 1 del plano a la realidad, 2 de la realidad al plano, 3 ¿qué escala es?, 4 ¿qué escala le va?
// Todo en milímetros enteros: el plano (`pmm`, de 5 en 5) y la realidad (`rmm = pmm · D`). Una escala se aplica a
// longitudes, nunca a áreas. Los datos se eligen para que la respuesta salga con dos decimales como mucho.

import { cantidad, deTexto, mismoValor, huellaCaso } from '../_comun/proporcion.js';
import { Fraccion } from '../_comun/fracciones.js';

// ─── Objetos y cotas ─────────────────────────────────────────────────────────────────────────────
// `fam`: plano, mapa o maqueta; `unidad`: en la que se da (y se pide) la medida real; `minMm`/`maxMm`: cota creíble
// de la medida real; `escalas`: las de ese objeto. La medida en el plano, siempre de 0,5 a 30 cm.

export const PLANO_MIN_MM = 5;
export const PLANO_MAX_MM = 300;
export const FAMILIAS = { plano: true, mapa: true, maqueta: true };

const m = x => x * 1000;
const km = x => x * 1000000;
export const OBJETOS = [
  { id: 'salon', fam: 'plano', unidad: 'm', minMm: m(3), maxMm: m(10), escalas: [50, 100, 200],
    sub: { es: 'la pared del salón', en: 'the living-room wall' }, Sub: { es: 'La pared del salón', en: 'The living-room wall' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'pasillo', fam: 'plano', unidad: 'm', minMm: m(2), maxMm: m(10), escalas: [50, 100, 200],
    sub: { es: 'el pasillo', en: 'the corridor' }, Sub: { es: 'El pasillo', en: 'The corridor' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'cocina', fam: 'plano', unidad: 'm', minMm: m(2), maxMm: m(6), escalas: [50, 100],
    sub: { es: 'la cocina', en: 'the kitchen' }, Sub: { es: 'La cocina', en: 'The kitchen' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'patio', fam: 'plano', unidad: 'm', minMm: m(4), maxMm: m(10), escalas: [50, 100, 200],
    sub: { es: 'el patio', en: 'the courtyard' }, Sub: { es: 'El patio', en: 'The courtyard' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'pueblos', fam: 'mapa', unidad: 'km', minMm: km(1), maxMm: km(60), escalas: [25000, 50000, 100000, 200000],
    sub: { es: 'la distancia entre dos pueblos', en: 'the distance between two villages' }, Sub: { es: 'La distancia entre dos pueblos', en: 'The distance between two villages' }, verbo: { es: 'es de', en: 'is' }, largo: { es: '', en: '' } },
  { id: 'ciudades', fam: 'mapa', unidad: 'km', minMm: km(20), maxMm: km(300), escalas: [200000, 500000, 1000000],
    sub: { es: 'la distancia entre dos ciudades', en: 'the distance between two cities' }, Sub: { es: 'La distancia entre dos ciudades', en: 'The distance between two cities' }, verbo: { es: 'es de', en: 'is' }, largo: { es: '', en: '' } },
  { id: 'ruta', fam: 'mapa', unidad: 'km', minMm: km(1), maxMm: km(25), escalas: [25000, 50000],
    sub: { es: 'una ruta de senderismo', en: 'a hiking route' }, Sub: { es: 'Una ruta de senderismo', en: 'A hiking route' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'coche', fam: 'maqueta', unidad: 'm', minMm: m(3.5), maxMm: m(5), escalas: [18, 24, 43],
    sub: { es: 'el coche', en: 'the car' }, Sub: { es: 'El coche', en: 'The car' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
  { id: 'vagon', fam: 'maqueta', unidad: 'm', minMm: m(15), maxMm: m(27), escalas: [87],
    sub: { es: 'el vagón', en: 'the carriage' }, Sub: { es: 'El vagón', en: 'The carriage' }, verbo: { es: 'mide', en: 'is' }, largo: { es: ' de largo', en: ' long' } },
];
const activos = () => OBJETOS.filter(o => FAMILIAS[o.fam]);

/** Cada objeto con una elección uniforme por objeto y escala, para que ninguna familia domine. */
const parejas = () => activos().flatMap(o => o.escalas.map(D => ({ o, D })));

// ─── Reserva: casos de la hoja (en claro) y del examen (por huella) ──────────────────────────────

export const CASOS_HOJA = [];
export const HUELLAS_EXAMEN = new Set([]);
const caso = it => ({ D: it.D, plano: cantidad(new Fraccion(it.pmm, 10), 'cm'), real: cantidad(new Fraccion(it.rmm, 10), 'cm') });
export function esReservado(it) {
  if (CASOS_HOJA.some(c => c.D === it.D && c.pmm === it.pmm)) return true;
  return HUELLAS_EXAMEN.has(huellaCaso('escala', caso(it)));
}

// ─── Números ─────────────────────────────────────────────────────────────────────────────────────

const MM_POR = { cm: 10, m: 1000, km: 1000000 };
/** Una medida en milímetros, en la unidad dada, como Fraccion exacta. */
export const enUnidad = (mm, u) => new Fraccion(mm, MM_POR[u]).simplificar();
export const medida = (mm, u) => cantidad(enUnidad(mm, u), u);
/** ¿Sale con dos decimales como mucho en esa unidad? */
export const conDosDecimales = (mm, u) => (mm * 100) % MM_POR[u] === 0;

/** Un ítem (objeto, escala y medida en el plano) con la real exacta, dentro de la cota y sin reservar. */
export function generarBase(rng) {
  const pool = parejas();
  for (let i = 0; i < 2000; i++) {
    const { o, D } = rng.elegir(pool);
    const pmm = 5 * rng.entero(PLANO_MIN_MM / 5, PLANO_MAX_MM / 5), rmm = pmm * D;
    if (rmm < o.minMm || rmm > o.maxMm || !conDosDecimales(rmm, o.unidad)) continue;
    if (o.unidad === 'm' && rmm % 10 !== 0) continue;
    const it = { obj: o, fam: o.fam, D, pmm, rmm, unidad: o.unidad };
    if (!esReservado(it)) return it;
  }
  throw new Error('generarBase: sin datos');
}
export const claveBase = it => `${it.obj.id}|${it.D}|${it.pmm}`;

// ─── Leer lo que teclea el alumno ────────────────────────────────────────────────────────────────

export function leerMedida(texto, unidad, idioma) {
  try { return deTexto(texto, { unidad, idioma }); } catch (e) { return null; }
}
const valida = v => v !== null && v !== undefined && v !== false;
const igual = (leido, fr, u) => valida(leido) && mismoValor(leido, cantidad(fr, u));

/** null si lo leído es la solución; el id del primer candidato con ese valor; si no, 'otra-respuesta'. */
function clasificar(leido, bueno, candidatos, u) {
  if (!valida(leido)) return 'otra-respuesta';
  if (igual(leido, bueno, u)) return null;
  for (const [id, v] of candidatos) if (v && !v.equals(bueno) && igual(leido, v, u)) return id;
  return 'otra-respuesta';
}
const F = (n, d = 1) => new Fraccion(n, d).simplificar();

// ─── Ejercicio 1: del plano a la realidad ────────────────────────────────────────────────────────

export const generarARealidad = generarBase;
export const claveARealidad = claveBase;
/** Lo que se da por bueno: la medida real en su unidad. */
export const respuestaARealidad = it => medida(it.rmm, it.unidad);

export function errorARealidad(it, texto, idioma = 'es') {
  const u = it.unidad, bueno = enUnidad(it.rmm, u), ok = bueno;
  return clasificar(leerMedida(texto, u, idioma), ok, [
    ['sin-cambio-de-unidad', F(it.pmm * it.D, 10)],
    ['dividir-en-vez-de-multiplicar', F(it.pmm, 10 * it.D)],
    ['salto-de-unidad-de-mas', bueno.multiplicar(10).simplificar()],
    ['salto-de-unidad-de-menos', bueno.dividir(10).simplificar()],
  ], u);
}

// ─── Ejercicio 2: de la realidad al plano ────────────────────────────────────────────────────────

export const generarAlPlano = generarBase;
export const claveAlPlano = claveBase;
export const respuestaAlPlano = it => medida(it.pmm, 'cm');

export function errorAlPlano(it, texto, idioma = 'es') {
  const bueno = F(it.pmm, 10), rU = enUnidad(it.rmm, it.unidad);
  return clasificar(leerMedida(texto, 'cm', idioma), bueno, [
    ['multiplicar-en-vez-de-dividir', F(it.rmm * it.D, 10)],
    ['sin-cambio-de-unidad', rU.dividir(it.D).simplificar()],
    ['salto-de-unidad-de-mas', bueno.multiplicar(10).simplificar()],
    ['salto-de-unidad-de-menos', bueno.dividir(10).simplificar()],
  ], 'cm');
}

// ─── Ejercicio 3: ¿qué escala es? ────────────────────────────────────────────────────────────────

export const escalaTxt = (n, razon = false) => (razon ? `${nTxt(n)} : 1` : `1 : ${nTxt(n)}`);
/** Un natural con espacio fino desde las cinco cifras. */
export function nTxt(n) {
  const s = String(n);
  return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
}

export function generarQueEscala(rng) {
  for (let intento = 0; intento < 300; intento++) {
    const it = generarBase(rng), { D, pmm } = it, rU = enUnidad(it.rmm, it.unidad);
    const sin = rU.dividir(F(pmm, 10)).simplificar();
    const pool = [
      ['razon-invertida', { D, inv: true }],
      ['salto-de-unidad-de-mas', { D: D * 10 }],
      ['salto-de-dos-unidades', { D: D * 100 }],
    ];
    if (D % 10 === 0) pool.push(['salto-de-unidad-de-menos', { D: D / 10 }]);
    if (sin.esEntera() && sin.num >= 2) pool.push(['sin-cambio-de-unidad', { D: sin.num }]);
    const malos = [], vistos = new Set([escalaTxt(D)]);
    for (const [error, v] of rng.barajar(pool)) {
      const texto = escalaTxt(v.D, v.inv);
      if (malos.length < 3 && !vistos.has(texto)) { vistos.add(texto); malos.push({ id: `e${v.D}${v.inv ? 'i' : ''}`, texto, correcta: false, error }); }
    }
    if (malos.length < 3) continue;
    const ops = rng.barajar([{ id: `e${D}`, texto: escalaTxt(D), correcta: true, error: null }, ...malos]);
    return { ...it, ops };
  }
  throw new Error('generarQueEscala: sin datos');
}
export const claveQueEscala = claveBase;
export const respuestaQueEscala = it => it.ops.find(o => o.correcta);

// ─── Ejercicio 4: ¿qué escala le va? ─────────────────────────────────────────────────────────────
// Un dibujo entre 5 y 30 cm sirve; con menos de 1 cm o más de 60 cm la escala no sirve de verdad.

export const DIBUJO_MIN_CM = 5;
export const DIBUJO_MAX_CM = 30;
export const ABSURDO_MIN_CM = 1;
export const ABSURDO_MAX_CM = 60;

const D4 = (o, ...ds) => ds.map(D => ({ ...o, D }));
/** Banco de objetos fijos: la medida real (mm) y la escala que sirve. `fam` activa o apaga la familia. */
export const BANCO_ENCAJA = [
  ...[3, 3.5, 4, 4.5, 5, 5.5, 6].flatMap(x => D4({ id: 'habitacion', fam: 'plano', rmm: m(x), cat: 'habitacion' }, 50)),
  ...[8, 9, 10, 11, 12, 13, 14, 15].flatMap(x => D4({ id: 'piso', fam: 'plano', rmm: m(x), cat: 'piso' }, 50, 100)),
  ...D4({ id: 'pista', fam: 'plano', rmm: m(28), cat: 'pista' }, 100),
  ...D4({ id: 'piscina', fam: 'plano', rmm: m(25), cat: 'piscina' }, 100),
  ...D4({ id: 'piscina', fam: 'plano', rmm: m(50), cat: 'piscina' }, 200),
  ...D4({ id: 'ciudades', fam: 'mapa', rmm: km(50), cat: 'ciudades' }, 200000),
  ...D4({ id: 'ciudades', fam: 'mapa', rmm: km(80), cat: 'ciudades' }, 500000),
  ...D4({ id: 'ciudades', fam: 'mapa', rmm: km(120), cat: 'ciudades' }, 500000),
  ...[3.5, 4, 4.5, 5].flatMap(x => D4({ id: 'coche', fam: 'maqueta', rmm: m(x), cat: 'coche' }, 18, 24)),
];
const dibujoCm = (rmm, D) => new Fraccion(rmm, 10 * D).simplificar();
const entre = (f, a, b) => f.num >= a * f.den && f.num <= b * f.den;
const esDec = f => { let d = f.den; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
const menosDe = (f, a) => f.num < a * f.den;
const masDe = (f, a) => f.num > a * f.den;

export function generarEncaja(rng) {
  const bancos = BANCO_ENCAJA.filter(b => FAMILIAS[b.fam]);
  for (let intento = 0; intento < 300; intento++) {
    const b = rng.elegir(bancos), D = b.D;
    if (!entre(dibujoCm(b.rmm, D), DIBUJO_MIN_CM, DIBUJO_MAX_CM) || !esDec(dibujoCm(b.rmm, D))) continue;
    const pool = [10, 100, 1000, 10000].flatMap(k => [{ D: D * k }, ...(D % k === 0 ? [{ D: D / k }] : [])])
      .filter(x => x.D >= 1 && x.D !== D)
      .filter(x => { const d = dibujoCm(b.rmm, x.D); return esDec(d) && (menosDe(d, ABSURDO_MIN_CM) || masDe(d, ABSURDO_MAX_CM)); });
    const malos = [], vistos = new Set([D]);
    for (const x of rng.barajar(pool)) {
      if (malos.length < 3 && !vistos.has(x.D)) {
        vistos.add(x.D);
        malos.push({ id: `e${x.D}`, D: x.D, texto: escalaTxt(x.D), correcta: false, error: masDe(dibujoCm(b.rmm, x.D), ABSURDO_MAX_CM) ? 'dibujo-enorme' : 'dibujo-diminuto' });
      }
    }
    if (malos.length < 3) continue;
    const ops = rng.barajar([{ id: `e${D}`, D, texto: escalaTxt(D), correcta: true, error: null }, ...malos]);
    return { b, D, rmm: b.rmm, ops, fam: b.fam };
  }
  throw new Error('generarEncaja: sin datos');
}
export const claveEncaja = it => `${it.b.id}|${it.rmm}|${it.D}`;
export const respuestaEncaja = it => it.ops.find(o => o.correcta);
export const dibujoDe = (it, op) => dibujoCm(it.rmm, op.D);
export { dibujoCm };
