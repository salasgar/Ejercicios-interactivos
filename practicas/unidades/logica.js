// Práctica «Cambia de unidad» (unidad 7, sesiones 17-18; PU2, tarea 223): puro, sin DOM.
// Ejercicios: 1 longitud, 2 masa y capacidad, 3 horas y minutos, 4 complejo e incomplejo, 5 ¿qué unidad?
// Según el acta de la U7 (punto n): longitud, masa y capacidad con la escalera completa y la t; el tiempo en
// horas y minutos (punto o); la superficie va a la U8 y el volumen no entra. Todo es exacto con Fraccion.

import { cantidad, deTexto, mismoValor, huella } from '../_comun/proporcion.js';
import { Fraccion } from '../_comun/fracciones.js';

const F = (n, d = 1) => new Fraccion(n, d).simplificar();

// ─── Las unidades ────────────────────────────────────────────────────────────────────────────────

export const ESCALERA = {
  longitud: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
  masa: ['t', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
  capacidad: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'],
};
/** Exponente de 10 de cada unidad respecto de la base (m, g, L). */
export const EXP = {
  km: 3, hm: 2, dam: 1, m: 0, dm: -1, cm: -2, mm: -3,
  t: 6, kg: 3, hg: 2, dag: 1, g: 0, dg: -1, cg: -2, mg: -3,
  kL: 3, hL: 2, daL: 1, L: 0, dL: -1, cL: -2, mL: -3,
};
export const NUCLEARES = new Set(['km', 'm', 'cm', 'mm', 't', 'kg', 'g', 'L', 'mL']);
export const pot10 = k => (k >= 0 ? F(10 ** k) : F(1, 10 ** -k));
/** Por cuánto se multiplica un número en `de` para tenerlo en `a`. */
export const factor = (de, a) => pot10(EXP[de] - EXP[a]);
export const saltos = (de, a) => Math.abs(EXP[de] - EXP[a]);
export const enBase = (x, u) => cantidad(x, u).valorBase();
export const medida = (x, u) => cantidad(x, u);

/** Número de decimales de un decimal exacto. */
export function decimales(x) {
  let d = 0, f = x;
  while (!f.esEntera() && d < 12) { f = f.multiplicar(10).simplificar(); d++; }
  return d;
}
const esDecimalHasta = (x, n) => decimales(x) <= n;
const num = x => Number(x.num) / Number(x.den);

// ─── Reserva: casos de la hoja (en claro) y del examen (por huella) ──────────────────────────────

export const CASOS_HOJA = [
  { mag: 'longitud', de: 'km', a: 'm', x: F(9, 10) }, // apoyo: 0,9 km = 900 m
  { mag: 'longitud', de: 'm', a: 'km', x: F(900) }, // apoyo: 0,9 km = 900 m
  { mag: 'longitud', de: 'cm', a: 'm', x: F(460) }, // apoyo: 460 cm = 4,6 m
  { mag: 'longitud', de: 'm', a: 'cm', x: F(23, 5) }, // apoyo: 460 cm = 4,6 m
  { mag: 'longitud', de: 'km', a: 'm', x: F(24, 5) }, // ej. 2 a) 4,8 km
  { mag: 'longitud', de: 'm', a: 'km', x: F(4800) }, // ej. 2 a) 4,8 km
  { mag: 'longitud', de: 'mm', a: 'cm', x: F(65) }, // ej. 2 b) 65 mm
  { mag: 'longitud', de: 'cm', a: 'mm', x: F(13, 2) }, // ej. 2 b) 65 mm
  { mag: 'longitud', de: 'm', a: 'mm', x: F(3) }, // ej. 2 c) 3 m
  { mag: 'longitud', de: 'mm', a: 'm', x: F(3000) }, // ej. 2 c) 3 m
  { mag: 'longitud', de: 'cm', a: 'm', x: F(870) }, // ej. 2 d) 870 cm
  { mag: 'longitud', de: 'm', a: 'cm', x: F(87, 10) }, // ej. 2 d) 870 cm
  { mag: 'longitud', de: 'dm', a: 'cm', x: F(7) }, // ej. 2 e) 7 dm
  { mag: 'longitud', de: 'cm', a: 'dm', x: F(70) }, // ej. 2 e) 7 dm
  { mag: 'longitud', de: 'm', a: 'km', x: F(1250) }, // ej. 2 f) 1250 m
  { mag: 'longitud', de: 'km', a: 'm', x: F(5, 4) }, // ej. 2 f) 1250 m
  { mag: 'masa', de: 'kg', a: 'g', x: F(18, 5) }, // ej. 3 a) 3,6 kg
  { mag: 'masa', de: 'g', a: 'kg', x: F(3600) }, // ej. 3 a) 3,6 kg
  { mag: 'masa', de: 'g', a: 'kg', x: F(450) }, // ej. 3 b) 450 g
  { mag: 'masa', de: 'kg', a: 'g', x: F(9, 20) }, // ej. 3 b) 450 g
  { mag: 'masa', de: 't', a: 'kg', x: F(8, 5) }, // ej. 3 c) 1,6 t
  { mag: 'masa', de: 'kg', a: 't', x: F(1600) }, // ej. 3 c) 1,6 t
  { mag: 'capacidad', de: 'L', a: 'mL', x: F(9, 5) }, // ej. 3 d) 1,8 L
  { mag: 'capacidad', de: 'mL', a: 'L', x: F(1800) }, // ej. 3 d) 1,8 L
  { mag: 'capacidad', de: 'mL', a: 'L', x: F(600) }, // ej. 3 e) 600 mL
  { mag: 'capacidad', de: 'L', a: 'mL', x: F(3, 5) }, // ej. 3 e) 600 mL
  { mag: 'capacidad', de: 'cL', a: 'mL', x: F(75) }, // ej. 3 f) 75 cL
  { mag: 'capacidad', de: 'mL', a: 'cL', x: F(750) }, // ej. 3 f) 75 cL
  { mag: 'masa', de: 'kg', a: 'g', x: F(14, 5) }, // ej. 4 a) 2,8 kg
  { mag: 'masa', de: 'g', a: 'kg', x: F(2800) }, // ej. 4 a) 2,8 kg
  { mag: 'capacidad', de: 'mL', a: 'L', x: F(650) }, // ej. 4 b) 650 mL
  { mag: 'capacidad', de: 'L', a: 'mL', x: F(13, 20) }, // ej. 4 b) 650 mL
  { mag: 'longitud', de: 'dam', a: 'm', x: F(6) }, // ej. 5 a) 6 dam
  { mag: 'longitud', de: 'm', a: 'dam', x: F(60) }, // ej. 5 a) 6 dam
  { mag: 'longitud', de: 'hm', a: 'm', x: F(7, 2) }, // ej. 5 b) 3,5 hm
  { mag: 'longitud', de: 'm', a: 'hm', x: F(350) }, // ej. 5 b) 3,5 hm
  { mag: 'masa', de: 'hg', a: 'g', x: F(7) }, // ej. 5 c) 7 hg
  { mag: 'masa', de: 'g', a: 'hg', x: F(700) }, // ej. 5 c) 7 hg
  { mag: 'capacidad', de: 'daL', a: 'L', x: F(2) }, // ej. 5 d) 2 daL
  { mag: 'capacidad', de: 'L', a: 'daL', x: F(20) }, // ej. 5 d) 2 daL
  { mag: 'capacidad', de: 'hL', a: 'L', x: F(12, 5) }, // ej. 5 e) 2,4 hL
  { mag: 'capacidad', de: 'L', a: 'hL', x: F(240) }, // ej. 5 e) 2,4 hL
  { mag: 'masa', de: 'dag', a: 'g', x: F(90) }, // ej. 5 f) 90 dag
  { mag: 'masa', de: 'g', a: 'dag', x: F(900) }, // ej. 5 f) 90 dag
  { mag: 'longitud', de: 'km', a: 'm', x: F(27, 5) }, // ej. 6 a) 5 km 400 m
  { mag: 'longitud', de: 'm', a: 'km', x: F(5400) }, // ej. 6 a) 5 km 400 m
  { mag: 'masa', de: 'kg', a: 'g', x: F(15, 4) }, // ej. 6 b) 3 kg 750 g
  { mag: 'masa', de: 'g', a: 'kg', x: F(3750) }, // ej. 6 b) 3 kg 750 g
  { mag: 'longitud', de: 'km', a: 'm', x: F(152, 25) }, // ej. 6 c) 6080 m
  { mag: 'longitud', de: 'm', a: 'km', x: F(6080) }, // ej. 6 c) 6080 m
  { mag: 'tiempo', de: 'h', a: 'min', x: F(11, 3) }, // apoyo: 3 h 40 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(220) }, // apoyo: 3 h 40 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(17, 6) }, // apoyo: 170 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(170) }, // apoyo: 170 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(3, 2) }, // apoyo: 1,5 h
  { mag: 'tiempo', de: 'min', a: 'h', x: F(90) }, // apoyo: 1,5 h
  { mag: 'tiempo', de: 'h', a: 'min', x: F(53, 12) }, // ej. 7 a) 4 h 25 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(265) }, // ej. 7 a) 4 h 25 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(37, 12) }, // ej. 7 b) 3 h 5 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(185) }, // ej. 7 b) 3 h 5 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(31, 6) }, // ej. 7 c) 310 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(310) }, // ej. 7 c) 310 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(19, 12) }, // ej. 7 d) 95 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(95) }, // ej. 7 d) 95 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(21, 2) }, // ej. 7 e) 10,5 h
  { mag: 'tiempo', de: 'min', a: 'h', x: F(630) }, // ej. 7 e) 10,5 h
  { mag: 'tiempo', de: 'h', a: 'min', x: F(17, 2) }, // ej. 7 g) ocho horas y media
  { mag: 'tiempo', de: 'min', a: 'h', x: F(510) }, // ej. 7 g) ocho horas y media
  { mag: 'tiempo', de: 'h', a: 'min', x: F(13, 2) }, // ej. 8 a) 6,5 h
  { mag: 'tiempo', de: 'min', a: 'h', x: F(390) }, // ej. 8 a) 6,5 h
  { mag: 'tiempo', de: 'h', a: 'min', x: F(14, 3) }, // ej. 8 b) 280 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(280) }, // ej. 8 b) 280 min
  { mag: 'tiempo', de: 'h', a: 'min', x: F(23, 4) }, // ej. 8 c) 345 min
  { mag: 'tiempo', de: 'min', a: 'h', x: F(345) }, // ej. 8 c) 345 min
  { id: 'manzana' }, // ej. 1 b) la masa de una manzana, 180 g (ej. 5)
  { id: 'banera' }, // ej. 1 c) el agua de una bañera llena (ej. 5)
];
export const HUELLAS_EXAMEN = new Set([
  '1d3eppn',
  '1c0vocl',
  'eotcly',
  'rmt1go',
  '1tfpmfc',
  'mnb6v4',
  'bbuaqb',
  '10nxwhp',
  'u2w140',
  'bnyw7y',
  '1w97rkj',
  '6jomkd',
  'emgptd',
  'hua189',
  'zyfcp8',
  '1jm4b7o',
  'm8r47y',
  'qyiqzy',
  'dcvrge',
  '8ogqum',
  '1ki8lvk',
  '18n9vr4',
  '1id5dfq',
  '1ruwkhy',
  '1j49p70',
  '1gjjab6',
  '7qbue4',
  '1k4683a',
  '19ehveb',
  '13qwphv',
  '1xz4mow',
  'toxb76',
  '1c3x89f',
  '1ndig5h',
  '137ed4j',
  'hw5cup',
  '1ixlyup',
  '1a02sa7',
  'hmorvx',
  'wqpjn',
  '14h5kj3',
  'wyoe7',
  'zvkied',
  '1253sfp',
  '1sx1f8l',
  '1v6kp9x',
  'y5td0l',
  'r5hfcl',
  'seq3w',
  '1st6uf0',
  '1m9b0tq',
  '1rq9egu',
  '1i8acaz',
  '1sucycb',
  'rg8yxa',
  '1t25hr2',
  '1mdkwos', // ej. 5
  'jbx286', // ej. 5
  'nuhznc', // ej. 5
]);
/** El caso normalizado por valor: tipo, magnitud, unidad de partida, de llegada y la cantidad en la base. */
export const claveCaso = (tipo, mag, de, a, x) => { const b = enBase(x, de); return `${tipo}|${mag}|${de}|${a}|${b.num}/${b.den}`; };
export function esReservado(it) {
  if (it.caso) return HUELLAS_EXAMEN.has(huella(`sensata|${it.caso.id}`)) || CASOS_HOJA.some(c => c.id === it.caso.id);
  const k = claveCaso(it.tipo ?? 'cambio', it.mag, it.de, it.a, it.x);
  return CASOS_HOJA.some(c => !c.id && claveCaso('cambio', c.mag, c.de, c.a, c.x) === k) || HUELLAS_EXAMEN.has(huella(k));
}

// ─── Leer lo que teclea el alumno ────────────────────────────────────────────────────────────────

export function leerMedida(texto, unidad, idioma) {
  try { return deTexto(texto, { unidad, idioma }); } catch (e) { return null; }
}
const valida = v => v !== null && v !== undefined && v !== false;
const igual = (leido, fr, u) => valida(leido) && mismoValor(leido, cantidad(fr, u));
/** null si lo leído es la solución; el id del primer candidato con ese valor; si no, 'otra-respuesta'. */
export function clasificar(leido, bueno, candidatos, u) {
  if (!valida(leido)) return 'otra-respuesta';
  if (igual(leido, bueno, u)) return null;
  for (const [id, v] of candidatos) if (v && !v.equals(bueno) && igual(leido, v, u)) return id;
  return 'otra-respuesta';
}
/** ¿Es lo mismo que la solución pero escrito en otra unidad? (ni fallo ni acierto: se avisa). */
export const esOtraUnidad = (leido, bueno, u) => valida(leido) && leido.unidad !== u && igual(leido, bueno, u);

// ─── Datos ───────────────────────────────────────────────────────────────────────────────────────

/** Un dato con 0, 1 o 2 decimales, de 0,01 a 999. */
function dato(rng) {
  const d = rng.elegir([0, 0, 1, 1, 2]);
  const k = d === 0 ? rng.entero(1, 999) : rng.entero(d === 1 ? 11 : 101, 999);
  return F(k, 10 ** d);
}
const RES_MAX = 9999;

function pareja(rng, mag, { raras }) {
  const lista = ESCALERA[mag];
  const pool = [];
  for (const de of lista) for (const a of lista) {
    const s = saltos(de, a);
    if (s < 1 || s > 3) continue;
    if (raras && NUCLEARES.has(de) && NUCLEARES.has(a)) continue;
    pool.push([de, a]);
  }
  return rng.elegir(pool);
}

/** Un cambio de unidad (1-3 saltos, cualquier sentido) con dato y resultado dentro de las cotas y sin reservar. */
export function generarCambio(rng, mag) {
  for (let i = 0; i < 4000; i++) {
    const [de, a] = pareja(rng, mag, { raras: mag !== 'longitud' ? rng.azar() < 0.6 : rng.azar() < 0.4 });
    const x = dato(rng), res = x.multiplicar(factor(de, a)).simplificar();
    if (!esDecimalHasta(res, 3) || num(res) > RES_MAX || num(res) < 0.01) continue;
    const it = { tipo: 'cambio', mag, de, a, x, res };
    if (!esReservado(it)) return it;
  }
  throw new Error('generarCambio: sin datos');
}
export const claveCambio = it => `${it.de}|${it.a}|${it.x.num}/${it.x.den}`;
export const respuestaCambio = it => medida(it.res, it.a);

// ─── Ejercicio 1: longitud (campo de número) ─────────────────────────────────────────────────────

export const generarLongitud = rng => generarCambio(rng, 'longitud');
export const claveLongitud = claveCambio;

/** Los valores de los fallos típicos de un cambio, en la unidad de llegada (null si coinciden con el bueno). */
export function fallosCambio(it) {
  const { x, res } = it;
  return {
    'subir-por-bajar': x.dividir(factor(it.de, it.a)).simplificar(),
    'salto-de-unidad-de-mas': res.multiplicar(10).simplificar(),
    'salto-de-unidad-de-menos': res.dividir(10).simplificar(),
    'sin-cambiar-el-numero': x,
  };
}
export function errorCambio(it, texto, idioma = 'es') {
  const leido = leerMedida(texto, it.a, idioma);
  return clasificar(leido, it.res, Object.entries(fallosCambio(it)), it.a);
}

// ─── Ejercicio 2: masa y capacidad (elegir entre cuatro) ─────────────────────────────────────────

export function generarMasaCapacidad(rng) {
  for (let i = 0; i < 300; i++) {
    const it = generarCambio(rng, rng.elegir(['masa', 'capacidad']));
    const f = fallosCambio(it), malos = [], vistos = [it.res];
    for (const [error, v] of rng.barajar(Object.entries(f))) {
      if (malos.length < 3 && !vistos.some(w => w.equals(v)) && num(v) <= 99999) { vistos.push(v); malos.push({ id: `e${malos.length}`, valor: v, correcta: false, error }); }
    }
    if (malos.length < 3) continue;
    const ops = rng.barajar([{ id: 'ok', valor: it.res, correcta: true, error: null }, ...malos]).map((o, k) => ({ ...o, id: `o${k}` }));
    return { ...it, ops };
  }
  throw new Error('generarMasaCapacidad: sin datos');
}
export const claveMasaCapacidad = claveCambio;
export const respuestaMasaCapacidad = it => it.ops.find(o => o.correcta);

// ─── Ejercicio 3: horas y minutos (elegir entre cuatro) ──────────────────────────────────────────
// Horas decimales sencillas: cuartos, medias y tres cuartos (acta, punto o); minutos enteros.

export const HORAS = [F(1, 4), F(1, 2), F(3, 4), F(1), F(3, 2), F(2), F(5, 4), F(9, 4), F(5, 2), F(11, 4), F(3), F(13, 4), F(7, 2), F(4), F(9, 2), F(5)];
const HORAS_NO_ENTERAS = HORAS.filter(h => !h.esEntera());

export function generarTiempo(rng) {
  for (let i = 0; i < 300; i++) {
    const haciaMin = rng.azar() < 0.5;
    const h = haciaMin ? rng.elegir(HORAS) : rng.elegir(HORAS_NO_ENTERAS);
    const min = h.multiplicar(60).simplificar();
    const it = haciaMin
      ? { tipo: 'cambio', mag: 'tiempo', de: 'h', a: 'min', x: h, res: min, pasos: 'h-min' }
      : { tipo: 'cambio', mag: 'tiempo', de: 'min', a: 'h', x: min, res: h, pasos: 'min-h' };
    if (esReservado(it)) continue;
    const pool = haciaMin
      ? [['cien-en-vez-de-sesenta', h.multiplicar(100).simplificar()], ['subir-por-bajar', h.dividir(60).simplificar()],
        ['salto-de-unidad-de-mas', min.multiplicar(10)], ['salto-de-unidad-de-menos', min.dividir(10).simplificar()]]
      : [['cien-en-vez-de-sesenta', min.dividir(100).simplificar()], ['horas-y-minutos-pegados', pegado(h)],
        ['salto-de-unidad-de-mas', h.multiplicar(10)], ['salto-de-unidad-de-menos', h.dividir(10).simplificar()]];
    const malos = [], vistos = [it.res];
    for (const [error, v] of rng.barajar(pool)) {
      if (v && malos.length < 3 && !vistos.some(w => w.equals(v))) { vistos.push(v); malos.push({ valor: v, correcta: false, error }); }
    }
    if (malos.length < 3) continue;
    const ops = rng.barajar([{ valor: it.res, correcta: true, error: null }, ...malos]).map((o, k) => ({ ...o, id: `o${k}` }));
    return { ...it, ops };
  }
  throw new Error('generarTiempo: sin datos');
}
/** 1 h 30 min escrito como 1,30 h. */
function pegado(h) {
  const entera = Math.floor(num(h)), min = Math.round((num(h) - entera) * 60);
  return F(entera * 100 + min, 100);
}
export const claveTiempo = it => `${it.pasos}|${it.x.num}/${it.x.den}`;
export const respuestaTiempo = respuestaMasaCapacidad;

// ─── Ejercicio 4: complejo e incomplejo (campo de número) ────────────────────────────────────────

/** `grande` y `pequena`: las dos unidades de la forma compleja; `max`: la parte grande, de 1 a max. */
export const PARES = [
  { mag: 'longitud', grande: 'km', pequena: 'm', max: 12 },
  { mag: 'longitud', grande: 'm', pequena: 'cm', max: 20 },
  { mag: 'longitud', grande: 'cm', pequena: 'mm', max: 30 },
  { mag: 'masa', grande: 't', pequena: 'kg', max: 6 },
  { mag: 'masa', grande: 'kg', pequena: 'g', max: 9 },
  { mag: 'masa', grande: 'g', pequena: 'mg', max: 9 },
  { mag: 'capacidad', grande: 'L', pequena: 'mL', max: 9 },
  { mag: 'capacidad', grande: 'L', pequena: 'cL', max: 9 },
  { mag: 'tiempo', grande: 'h', pequena: 'min', max: 6 },
];
export const porCuanto = p => (p.mag === 'tiempo' ? 60 : 10 ** (EXP[p.grande] - EXP[p.pequena]));

/** La parte pequeña de una forma compleja: a veces con un cero intermedio (3 km 25 m = 3025 m). */
function partePequena(rng, FF, { decimal = false } = {}) {
  if (FF === 60) return decimal ? rng.elegir([15, 30, 45]) : 5 * rng.entero(1, 11);
  if (FF === 10) return rng.entero(1, 9);
  if (FF === 100) return rng.azar() < 1 / 3 ? rng.entero(1, 9) : (decimal ? 5 * rng.entero(1, 19) : rng.entero(10, 99));
  return rng.azar() < 1 / 3 ? 5 * rng.entero(1, 19) : 5 * rng.entero(20, 199);
}

export function generarComplejo(rng) {
  for (let i = 0; i < 2000; i++) {
    const p = rng.elegir(PARES), FF = porCuanto(p), forma = rng.elegir(['a', 'a', 'b1', 'b2']);
    const big = rng.entero(1, p.max), small = partePequena(rng, FF, { decimal: forma === 'b1' });
    if (small >= FF || (forma === 'b2' && small === big)) continue;
    const total = F(big * FF + small);
    const it = { tipo: 'complejo', forma, mag: p.mag, de: p.grande, a: p.pequena, grande: p.grande, pequena: p.pequena, FF, big, small, total,
      x: forma === 'b1' ? F(big * FF + small, FF) : total.dividir(F(FF)).simplificar() };
    if (forma !== 'a') it.dato = forma === 'b1' ? it.x : total;
    if (forma === 'b1' && decimales(it.x) > 3) continue;
    // el caso se normaliza por la cantidad total en su unidad pequeña
    it.x = forma === 'b1' ? it.x : F(big * FF + small, FF);
    it.de = p.grande;
    if (!esReservado({ ...it, tipo: 'cambio', x: it.x })) return it;
  }
  throw new Error('generarComplejo: sin datos');
}
export const claveComplejo = it => `${it.forma}|${it.grande}|${it.pequena}|${it.big}|${it.small}`;
/** La respuesta que el ejercicio da por buena: la forma «a», el total en la unidad pequeña; las otras, la parte pequeña. */
export const respuestaComplejo = it => medida(F(it.forma === 'a' ? Number(it.total.num) : it.small), it.pequena);

export function fallosComplejo(it) {
  const { forma, big, small, FF, total } = it;
  const f = {};
  if (forma === 'a') {
    f['pegar-cifras'] = F(Number(`${big}${small}`));
    f['sumar-sin-pasar'] = F(big + small);
    if (FF === 60) f['cien-en-vez-de-sesenta'] = F(big * 100 + small);
  } else if (forma === 'b1') {
    const d = decimales(it.x), frac = it.x.restar(F(big)).simplificar();
    f['decimal-como-unidad-pequena'] = F(Number(frac.multiplicar(10 ** d).simplificar().num));
    if (FF === 60) f['cien-en-vez-de-sesenta'] = frac.multiplicar(100).simplificar();
  } else {
    f['total-sin-quitar'] = total;
    f['cociente-en-vez-de-resto'] = F(big);
  }
  return f;
}
export function errorComplejo(it, texto, idioma = 'es') {
  const bueno = F(it.forma === 'a' ? Number(it.total.num) : it.small);
  const leido = leerMedida(texto, it.pequena, idioma);
  return clasificar(leido, bueno, Object.entries(fallosComplejo(it)), it.pequena);
}
export const buenoComplejo = it => F(it.forma === 'a' ? Number(it.total.num) : it.small);

// ─── Ejercicio 5: ¿qué unidad? ───────────────────────────────────────────────────────────────────
// Cada caso: lo que se mide, el número, la unidad buena y el intervalo creíble `[lo, hi]` en la unidad base
// (m, g, L). Una unidad falsa se acepta de distractor si, con ese número, la medida cae a menos de lo/5 o a
// más de 5·hi: ni siquiera «más o menos» se podría dar por buena.

const U5 = {
  longitud: ['km', 'm', 'cm', 'mm'],
  masa: ['t', 'kg', 'g', 'mg'],
  capacidad: ['kL', 'L', 'dL', 'cL', 'mL'],
};
const caso = (id, mag, es, en, n, u, lo, hi) => ({ id, mag, es, en, n: typeof n === 'number' ? F(Math.round(n * 100), 100) : n, u, lo, hi });
export const BANCO_UNIDAD = [
  caso('puerta', 'longitud', 'La altura de una puerta', 'The height of a door', 2, 'm', 1.5, 3),
  caso('murcia-cartagena', 'longitud', 'La distancia de Murcia a Cartagena por carretera', 'The road distance from Murcia to Cartagena', 50, 'km', 30000, 100000),
  caso('lapiz', 'longitud', 'La longitud de un lápiz nuevo', 'The length of a new pencil', 18, 'cm', 0.1, 0.3),
  caso('moneda', 'longitud', 'El grosor de una moneda', 'The thickness of a coin', 2, 'mm', 0.0015, 0.003),
  caso('piscina', 'longitud', 'La longitud de una piscina olímpica', 'The length of an Olympic swimming pool', 50, 'm', 25, 100),
  caso('alumno', 'longitud', 'La altura de un alumno de 1.º de ESO', 'The height of a first-year ESO student', 150, 'cm', 1.3, 1.8),
  caso('maraton', 'longitud', 'La distancia de una maratón', 'The distance of a marathon', 42, 'km', 40000, 45000),
  caso('movil', 'longitud', 'El ancho de un móvil', 'The width of a mobile phone', 7, 'cm', 0.05, 0.1),
  caso('manzana', 'masa', 'La masa de una manzana', 'The mass of an apple', 180, 'g', 100, 300),
  caso('persona', 'masa', 'La masa de una persona adulta', 'The mass of an adult', 70, 'kg', 50000, 120000),
  caso('moneda-2', 'masa', 'La masa de una moneda de 2 euros', 'The mass of a 2-euro coin', 8, 'g', 5, 12),
  caso('elefante', 'masa', 'La masa de un elefante africano', 'The mass of an African elephant', 5, 't', 3000000, 7000000),
  caso('arroz', 'masa', 'La masa de un grano de arroz', 'The mass of a grain of rice', 25, 'mg', 0.01, 0.05),
  caso('coche', 'masa', 'La masa de un coche', 'The mass of a car', 1.2, 't', 800000, 2000000),
  caso('mochila', 'masa', 'La masa de una mochila escolar', 'The mass of a school backpack', 6, 'kg', 3000, 10000),
  caso('pastilla', 'masa', 'La masa de una pastilla para el dolor de cabeza', 'The mass of a headache tablet', 500, 'mg', 0.25, 1),
  caso('botella', 'capacidad', 'La capacidad de una botella de agua', 'The capacity of a bottle of water', 1.5, 'L', 0.25, 3),
  caso('cucharada', 'capacidad', 'Lo que cabe en una cucharada de jarabe', 'The amount in a spoonful of syrup', 5, 'mL', 0.002, 0.015),
  caso('lata', 'capacidad', 'La capacidad de una lata de refresco', 'The capacity of a can of fizzy drink', 33, 'cL', 0.2, 0.5),
  caso('deposito', 'capacidad', 'La capacidad del depósito de gasolina de un coche', 'The capacity of a car’s petrol tank', 50, 'L', 30, 100),
  caso('cisterna', 'capacidad', 'La capacidad de la cisterna de un camión', 'The capacity of a lorry’s tank', 30, 'kL', 20000, 40000),
  caso('banera', 'capacidad', 'La capacidad de una bañera', 'The capacity of a bath', 200, 'L', 100, 400),
  caso('vaso', 'capacidad', 'La capacidad de un vaso de agua', 'The capacity of a glass of water', 250, 'mL', 0.15, 0.4),
  caso('brik', 'capacidad', 'La capacidad de un brik de leche', 'The capacity of a carton of milk', 1, 'L', 0.5, 2),
];
/** El valor del caso con la unidad `u`, en la base. */
export const valorEn = (c, u) => num(c.n) * 10 ** EXP[u];

export const unidadesFalsas = c => U5[c.mag].filter(u => u !== c.u && (valorEn(c, u) < c.lo / 5 || valorEn(c, u) > c.hi * 5));

export function generarUnidad(rng) {
  for (let i = 0; i < 300; i++) {
    const c = rng.elegir(BANCO_UNIDAD);
    if (esReservado({ caso: c })) continue;
    const falsas = unidadesFalsas(c);
    if (falsas.length < 3) continue;
    const ops = rng.barajar([
      { id: c.u, unidad: c.u, correcta: true, error: null },
      ...rng.barajar(falsas).slice(0, 3).map(u => ({ id: u, unidad: u, correcta: false, error: valorEn(c, u) > c.hi * 5 ? 'unidad-demasiado-grande' : 'unidad-demasiado-pequena' })),
    ]);
    return { caso: c, ops };
  }
  throw new Error('generarUnidad: sin datos');
}
export const claveUnidad = it => it.caso.id;
export const respuestaUnidad = it => it.ops.find(o => o.correcta);
