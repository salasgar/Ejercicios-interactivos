// Práctica «Descuentos y aumentos» (unidad 7, sesiones 12-14; PU2, tarea 221): puro, sin DOM.
// Ejercicios: 1 en dos pasos, 2 en un paso, 3 el IVA, 4 ¿qué piden?, 5 caza el error.
// Todo el dinero va en céntimos enteros y los datos se eligen para que nada se redondee: el precio P cumple
// P · p % 100 === 0. Subir y bajar un porcentaje es siempre calcular el porcentaje del precio de ese momento.

import { cantidad, deTexto, mismoValor, NOMBRES } from '../_comun/proporcion.js';
import { Fraccion } from '../_comun/fracciones.js';

const NBSP = ' ';

// ─── Números en pantalla ─────────────────────────────────────────────────────────────────────────

export function dineroCelda(c, idioma = 'es') {
  const e = Math.trunc(c / 100), cc = String(c % 100).padStart(2, '0');
  return `${e}${idioma === 'es' ? ',' : '.'}${cc}`;
}
export const dinero = (c, idioma = 'es') => (idioma === 'es' ? `${dineroCelda(c, 'es')}${NBSP}€` : `€${dineroCelda(c, 'en')}`);
export const pct = (p, idioma = 'es') => (idioma === 'es' ? `${p}${NBSP}%` : `${p}%`);
/** p/100 con dos decimales: 20 → «0,20»; 5 → «0,05». */
export const factorTxt = (p, idioma = 'es') => `0${idioma === 'es' ? ',' : '.'}${String(p).padStart(2, '0')}`;
/** Un multiplicador en milésimas (800 → «0,80», 85 → «0,085», 3000 → «3,00»), siempre con dos decimales como mínimo. */
export function multiplicadorTxt(m, idioma = 'es') {
  const d = String(m).padStart(4, '0'), entera = d.slice(0, -3);
  let dec = d.slice(-3);
  if (dec[2] === '0') dec = dec.slice(0, 2);
  return `${entera}${idioma === 'es' ? ',' : '.'}${dec}`;
}

// ─── Productos y cotas (céntimos) ────────────────────────────────────────────────────────────────
// `min`/`max`: cota creíble del precio; `paso`: múltiplo de precio; `iva`: tipo real en España; `clase`: de qué se
// dice el tipo. `pl`: verbo en plural. Descuentos: de 10 a 70 %; subidas: de una cuota, 5-20 %.

export const PRODUCTOS = [
  { id: 'camiseta', suj: { es: 'Una camiseta', en: 'A T-shirt' }, min: 500, max: 3000, paso: 50, iva: 21, clase: { es: 'la ropa', en: 'clothes' } },
  { id: 'sudadera', suj: { es: 'Una sudadera', en: 'A sweatshirt' }, min: 1500, max: 6000, paso: 50, iva: 21, clase: { es: 'la ropa', en: 'clothes' } },
  { id: 'chaqueta', suj: { es: 'Una chaqueta', en: 'A jacket' }, min: 3000, max: 12000, paso: 100, iva: 21, clase: { es: 'la ropa', en: 'clothes' } },
  { id: 'zapatillas', suj: { es: 'Unas zapatillas', en: 'A pair of trainers' }, min: 2000, max: 12000, paso: 100, pl: true },
  { id: 'movil', suj: { es: 'Un móvil', en: 'A mobile phone' }, min: 8000, max: 120000, paso: 1000, iva: 21, clase: { es: 'los móviles', en: 'mobile phones' } },
  { id: 'videojuego', suj: { es: 'Un videojuego', en: 'A video game' }, min: 800, max: 7000, paso: 50, iva: 21, clase: { es: 'los videojuegos', en: 'video games' } },
  { id: 'bici', suj: { es: 'Una bicicleta', en: 'A bicycle' }, min: 10000, max: 60000, paso: 1000, iva: 21, clase: { es: 'las bicicletas', en: 'bicycles' } },
  { id: 'libro', suj: { es: 'Un libro', en: 'A book' }, min: 800, max: 4000, paso: 50, iva: 4, clase: { es: 'los libros', en: 'books' } },
  { id: 'fruta', suj: { es: 'Una caja de fruta', en: 'A box of fruit' }, min: 500, max: 3000, paso: 50, iva: 4, clase: { es: 'la fruta', en: 'fruit' } },
  { id: 'cine', suj: { es: 'Una entrada de cine', en: 'A cinema ticket' }, min: 300, max: 1500, paso: 50, iva: 10, clase: { es: 'las entradas de cine', en: 'cinema tickets' } },
  { id: 'menu', suj: { es: 'Un menú del día', en: 'A set meal' }, min: 800, max: 3000, paso: 50, iva: 10, clase: { es: 'los menús de restaurante', en: 'restaurant meals' } },
  { id: 'tren', suj: { es: 'Un billete de tren', en: 'A train ticket' }, min: 1000, max: 6000, paso: 50, iva: 10, clase: { es: 'los billetes de tren', en: 'train tickets' } },
];
export const CUOTAS = [
  { id: 'gimnasio', suj: { es: 'La cuota del gimnasio', en: 'The gym fee' }, min: 2000, max: 6000, paso: 50 },
  { id: 'natacion', suj: { es: 'La cuota de natación', en: 'The swimming fee' }, min: 1500, max: 4500, paso: 50 },
  { id: 'musica', suj: { es: 'La suscripción de música', en: 'The music subscription' }, min: 1000, max: 2000, paso: 50 },
];
/** Aparatos caros para el ejercicio 5 (precio en múltiplos de 100 €, para que los dos pasos salgan al céntimo). */
export const APARATOS = [
  { id: 'bici', suj: { es: 'una bicicleta', en: 'a bicycle' }, min: 10000, max: 60000 },
  { id: 'movil', suj: { es: 'un móvil', en: 'a mobile phone' }, min: 10000, max: 120000 },
  { id: 'tablet', suj: { es: 'una tableta', en: 'a tablet' }, min: 10000, max: 50000 },
  { id: 'patinete', suj: { es: 'un patinete eléctrico', en: 'an electric scooter' }, min: 10000, max: 40000 },
];
export const DESCUENTOS = [10, 15, 20, 25, 30, 40, 50, 60, 70];
export const SUBIDAS = [5, 10, 15, 20];
export const TIPOS_IVA = [4, 10, 21];
export const PRODUCTOS_REBAJA = PRODUCTOS.filter(p => p.id !== 'fruta');
export const PRODUCTOS_IVA = PRODUCTOS.filter(p => p.iva);

/** Un precio (céntimos) con P · p múltiplo de 100 (nada que redondear); nunca 100,00 €, donde restar «p euros» da lo mismo que el p %. */
function precio(rng, prod, p) {
  const n = Math.floor((prod.max - prod.min) / prod.paso);
  for (let i = 0; i < 200; i++) {
    const P = prod.min + prod.paso * rng.entero(0, n);
    if (P % prod.paso === 0 && (P * p) % 100 === 0 && P !== 10000) return P;
  }
  const euros = Math.ceil(prod.min / 100) * 100;
  return euros === 10000 ? 11000 : euros;
}
export const cambioDe = (P, p) => (P * p) / 100;
export const finalDe = (P, p, tipo) => P + (tipo === 'descuento' ? -1 : 1) * cambioDe(P, p);

// ─── Leer lo que teclea el alumno ────────────────────────────────────────────────────────────────

export function leerDinero(texto, idioma) {
  try { return deTexto(texto, { unidad: '€', idioma }); } catch (e) { return null; }
}
const valida = v => v !== null && v !== undefined && v !== false;
export const comoDinero = c => cantidad(new Fraccion(c, 100), '€');
const igual = (leido, c) => valida(leido) && Number.isFinite(c) && Number.isInteger(c) && mismoValor(leido, comoDinero(c));

/** null si lo leído es la solución; el id del primer candidato con ese valor; si no, 'otra-respuesta'. */
function clasificar(leido, bueno, candidatos) {
  if (!valida(leido)) return 'otra-respuesta';
  if (igual(leido, bueno)) return null;
  for (const [id, v] of candidatos) if (v !== null && v !== bueno && igual(leido, v)) return id;
  return 'otra-respuesta';
}

/** Los errores de una subida o una bajada: precio final con el signo contrario y con el número del porcentaje. */
const otroSigno = (P, p, tipo) => finalDe(P, p, tipo === 'descuento' ? 'aumento' : 'descuento');
const conElNumero = (P, p, tipo) => P + (tipo === 'descuento' ? -1 : 1) * 100 * p;
const nombreNumero = tipo => (tipo === 'descuento' ? 'restar-el-porcentaje-como-numero' : 'sumar-el-porcentaje-como-numero');

// ─── Ejercicio 1: en dos pasos ───────────────────────────────────────────────────────────────────

export function generarDosPasos(rng) {
  const tipo = rng.azar() < 0.25 ? 'aumento' : 'descuento';
  const prod = tipo === 'aumento' ? rng.elegir(CUOTAS) : rng.elegir(PRODUCTOS_REBAJA.filter(x => x.id !== 'fruta'));
  const p = rng.elegir(tipo === 'aumento' ? SUBIDAS : DESCUENTOS);
  const P = precio(rng, prod, p);
  return { prod, tipo, p, P };
}
export const claveDosPasos = it => `${it.prod.id}|${it.P}|${it.p}`;

/** [errorCambio, errorFinal]; null si el campo está bien. */
export function erroresDeDosPasos(it, textoCambio, textoFinal, idioma = 'es') {
  const { P, p, tipo } = it, cambio = cambioDe(P, p), final = finalDe(P, p, tipo);
  const lc = leerDinero(textoCambio, idioma), lf = leerDinero(textoFinal, idioma);
  if (final !== cambio && igual(lc, final) && igual(lf, cambio)) return ['campos-cambiados', 'campos-cambiados'];
  const ec = clasificar(lc, cambio, [
    ['precio-final-por-descuento', final],
    ['dividir-entre-el-porcentaje', P % p === 0 ? P / p : null],
    ['porcentaje-entre-mil', (P * p) % 1000 === 0 ? (P * p) / 1000 : null],
  ]);
  const ef = clasificar(lf, final, [
    ['descuento-por-precio-final', cambio],
    ['aumento-por-descuento', otroSigno(P, p, tipo)],
    [nombreNumero(tipo), conElNumero(P, p, tipo)],
  ]);
  return [ec, ef];
}
export const errorDeDosPasos = (it, c, f, idioma) => erroresDeDosPasos(it, c, f, idioma).find(e => e !== null) ?? null;

// ─── Ejercicio 2: en un paso ─────────────────────────────────────────────────────────────────────

/** Multiplicador en milésimas: rebajar un p % → (100 − p) · 10; subir → (100 + p) · 10. */
export const multiplicadorDe = (p, tipo) => (100 + (tipo === 'descuento' ? -p : p)) * 10;

export function generarUnPaso(rng) {
  if (rng.azar() < 0.5) {
    const tipo = rng.azar() < 0.34 ? 'aumento' : 'descuento';
    const p = rng.elegir(tipo === 'aumento' ? SUBIDAS : DESCUENTOS.filter(x => x !== 50));
    const bueno = multiplicadorDe(p, tipo);
    const malos = tipo === 'descuento'
      ? [['multiplicar-por-el-porcentaje', p * 10], ['multiplicador-del-otro-signo', multiplicadorDe(p, 'aumento')], ['multiplicador-entre-mil', (100 - p)]]
      : [['multiplicar-por-el-porcentaje', p * 10], ['multiplicador-del-otro-signo', multiplicadorDe(p, 'descuento')], ['iva-como-decimas', 1000 + p * 100]];
    const ops = rng.barajar([{ m: bueno, correcta: true, error: null }, ...malos.map(([error, m]) => ({ m, correcta: false, error }))]);
    return { modo: 'elegir', tipo, p, ops };
  }
  const tipo = rng.azar() < 0.34 ? 'aumento' : 'descuento';
  const prod = tipo === 'aumento' ? rng.elegir(CUOTAS) : rng.elegir(PRODUCTOS_REBAJA.filter(x => x.id !== 'fruta'));
  const p = rng.elegir(tipo === 'aumento' ? SUBIDAS : DESCUENTOS);
  return { modo: 'calcular', tipo, prod, p, P: precio(rng, prod, p) };
}
export const claveUnPaso = it => (it.modo === 'elegir' ? `e|${it.tipo}|${it.p}` : `c|${it.prod.id}|${it.P}|${it.p}`);

export function errorDeUnPasoCalcular(it, texto, idioma = 'es') {
  const { P, p, tipo } = it;
  return clasificar(leerDinero(texto, idioma), finalDe(P, p, tipo), [
    ['descuento-por-precio-final', cambioDe(P, p)],
    ['aumento-por-descuento', otroSigno(P, p, tipo)],
    [nombreNumero(tipo), conElNumero(P, p, tipo)],
  ]);
}

// ─── Ejercicio 3: el IVA ─────────────────────────────────────────────────────────────────────────

export function generarIva(rng) {
  const prod = rng.elegir(PRODUCTOS_IVA), r = prod.iva;
  return { prod, r, P: precio(rng, prod, r) };
}
export const claveIva = it => `${it.prod.id}|${it.P}`;
export const conIva = it => it.P + cambioDe(it.P, it.r);

export function errorDeIva(it, texto, idioma = 'es') {
  const { P, r } = it;
  return clasificar(leerDinero(texto, idioma), conIva(it), [
    ['descuento-por-precio-final', cambioDe(P, r)],
    ['sumar-el-porcentaje-como-numero', P + 100 * r],
    ['aumento-por-descuento', P - cambioDe(P, r)],
    ['iva-como-decimas', (P * (10 + r)) % 10 === 0 ? (P * (10 + r)) / 10 : null],
  ]);
}

// ─── Ejercicio 4: ¿qué piden? ────────────────────────────────────────────────────────────────────

export function generarQuePiden(rng) {
  for (let intento = 0; intento < 300; intento++) {
    const tipo = rng.elegir(['descuento', 'aumento', 'iva']);
    let prod, p, t;
    if (tipo === 'iva') { prod = rng.elegir(PRODUCTOS_IVA); p = prod.iva; t = 'aumento'; }
    else if (tipo === 'aumento') { prod = rng.elegir(CUOTAS); p = rng.elegir(SUBIDAS); t = 'aumento'; }
    else { prod = rng.elegir(PRODUCTOS_REBAJA.filter(x => x.id !== 'fruta')); p = rng.elegir(DESCUENTOS.filter(x => x !== 50)); t = 'descuento'; }
    const P = precio(rng, prod, p), cambio = cambioDe(P, p), final = finalDe(P, p, t);
    const pregunta = rng.azar() < 0.5 ? 'cambio' : 'final';
    const correcta = pregunta === 'cambio' ? cambio : final;
    const otra = pregunta === 'cambio' ? [final, 'precio-final-por-descuento'] : [cambio, 'descuento-por-precio-final'];
    const pool = rng.barajar([
      ['aumento-por-descuento', otroSigno(P, p, t)],
      [nombreNumero(t), conElNumero(P, p, t)],
      ['coma-de-mas', cambio % 10 === 0 ? cambio / 10 : cambio * 10],
    ]);
    const malos = [{ valor: otra[0], error: otra[1] }];
    for (const [error, valor] of pool) {
      if (malos.length === 3) break;
      if (valor > 0 && valor !== correcta && malos.every(m => m.valor !== valor) && valor !== P) malos.push({ valor, error });
    }
    if (malos.length < 3 || malos.some(m => m.valor === correcta) || (correcta === otra[0])) continue;
    const ops = rng.barajar([{ valor: correcta, correcta: true, error: null }, ...malos.map(m => ({ ...m, correcta: false }))]);
    return { tipo, prod, p, P, pregunta, ops };
  }
  throw new Error('generarQuePiden: sin datos');
}
export const claveQuePiden = it => `${it.tipo}|${it.prod.id}|${it.P}|${it.p}|${it.pregunta}`;
export const respuestaQuePiden = it => it.ops.find(o => o.correcta).valor;

// ─── Ejercicio 5: caza el error ──────────────────────────────────────────────────────────────────

export function generarCaza(rng) {
  const prod = rng.elegir(APARATOS), p = rng.elegir(SUBIDAS), orden = rng.azar() < 0.5 ? 'sube-baja' : 'baja-sube';
  const n = Math.floor((prod.max - prod.min) / 10000);
  const P = prod.min + 10000 * rng.entero(0, n);
  const t1 = orden === 'sube-baja' ? 'aumento' : 'descuento', t2 = orden === 'sube-baja' ? 'descuento' : 'aumento';
  const medio = finalDe(P, p, t1), final = finalDe(medio, p, t2);
  return { prod, p, P, orden, medio, final, nombre: rng.elegir(NOMBRES) };
}
export const claveCaza = it => `${it.prod.id}|${it.orden}|${it.p}|${it.P}`;

/** [errorMedio, errorFinal]. */
export function erroresDeCaza(it, textoMedio, textoFinal, idioma = 'es') {
  const { P, p, orden, medio, final } = it;
  const lm = leerDinero(textoMedio, idioma), lf = leerDinero(textoFinal, idioma);
  const em = clasificar(lm, medio, [['aumento-por-descuento', otroSigno(P, p, orden === 'sube-baja' ? 'aumento' : 'descuento')]]);
  const ef = clasificar(lf, final, [['sube-y-baja-se-queda-igual', P]]);
  return [em, ef];
}
export const errorDeCaza = (it, m, f, idioma) => erroresDeCaza(it, m, f, idioma).find(e => e !== null) ?? null;
