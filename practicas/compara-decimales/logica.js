// Práctica «Compara, ordena y redondea» de la unidad 5 (PU2, tarea 124): lógica pura (sin DOM ni
// red), probada en `tests/practicas-compara-decimales.test.js`. Cuatro ejercicios:
//   1. ¿Cuál es mayor?  <, = o > entre dos decimales (la trampa de las cifras, los ceros, los negativos)
//   2. Ordena           cuatro o cinco decimales de menor a mayor o de mayor a menor
//   3. Entre dos        escribir (o elegir) un decimal estrictamente entre otros dos
//   4. Redondea         a la unidad, a la décima o a la centésima (el 9 que arrastra), escribiendo o eligiendo
//
// Un ítem es DATOS (decimales como { m, k } = m / 10^k; nunca HTML ni funciones): la base vuelve a
// montar el mismo ítem al cambiar de idioma. Toda la aritmética es de enteros escalados
// (`../_comun/decimales.js`), nunca `Number` con coma flotante. Cada distractor sale de un error
// típico con nombre, se calcula con los números del ítem y vale algo distinto de la respuesta buena y
// de los demás (0,5 y 0,50 nunca se enfrentan; la excepción es U5-1C-05, donde la escritura es lo que
// se pregunta).
//
// Destrezas (ids del inventario aprobado el 3-11): U5-1C-05 (qué ceros cambian el valor: ítems de «=» y
// de cero en medio, ej. 1), 1C-07 (comparar, ej. 1), 1C-08 (ordenar, ej. 2), 1C-09 (intercalar, ej. 3),
// 1C-10 (redondear, ej. 4) y 1C-11 (el 9 que arrastra, ej. 4); y, como propuesta, 1C-17 (negativos: un
// ítem de cada cinco en el ej. 1 y uno de cuatro en el ej. 2). U5-1C-12 (estimar) no tiene ítem: el
// acta lo deja fuera de la app.
//
// Cotas: sin contexto, solo números. Parte entera de 0 a 20 (ej. 4: de 0 a 20; con arrastre de la
// unidad, 9 o 19), hasta 3 cifras decimales, negativos hasta −20.
//
// Errores que pueden salir (ids de ERRORES_TIPICOS de la base: compara-por-cifras, redondea-truncando,
// redondea-en-cadena, redondea-otro-orden) y propios: cero-en-medio-sin-valor, cree-iguales,
// cero-final-cambia-el-valor, ignora-el-signo, compara-mal, orden-al-reves, orden-mal, repite-un-extremo,
// fuera-por-debajo, fuera-por-encima, ignora-parte-entera, sube-siempre, sin-llevar, cifras-distintas,
// redondeo-mal.
//
// Casos que no salen nunca: los de la hoja 1 de la unidad 5 (en claro, abajo) y los del examen de la
// semana 1 (por huella FNV-1a: ver HUELLAS_*; el 6-11 el examen aún no tenía fichero de casos, así que
// las listas están vacías y la tarea de publicación de la semana coteja).

import {
  decimal, aTexto, deTexto, comparar, redondear, truncar, sumar, mismoValor, hayIguales,
  compararPorCifras, ERRORES_TIPICOS, ORDENES,
} from '../_comun/decimales.js';
import { TX } from './textos.js';

const D = ({ m, k }) => decimal(m, k);
const P = d => ({ m: d.m, k: d.k });
const pot = n => 10 ** n;
const T = (d, idioma) => aTexto(D(d), idioma);
const SIGNO = { '<': '&lt;', '>': '&gt;', '=': '=' };
const simbolo = c => (c < 0 ? '<' : c > 0 ? '>' : '=');
const H = s => SIGNO[s];

/** Parte entera + decimales de 1 a k cifras con la última distinta de 0: m en 1..10^k−1 sin cero final. */
const sinCeroFinal = (rng, k) => { let m; do m = rng.entero(1, pot(k) - 1); while (m % 10 === 0); return m; };
/** e + m/10^k, sin signo. */
const mk = (e, m, k) => decimal(e * pot(k) + m, k);

// ─── Casos reservados ────────────────────────────────────────────────────────────────────

/** FNV-1a de 32 bits: los casos de examen no se escriben en claro (el repositorio y Pages son públicos). */
export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };

/** Valor canónico de un decimal como texto ('3.5' para 3,50 y para 3,5; '−2'): para comparar casos por valor. */
export const clave = d => aTexto(D(d).normalizar(), 'en');
const kv = s => clave(deTexto(s));

// Hoja 1 de la unidad 5 (hoja-unidad5-semana1.tex), en claro: comparar, ordenar, intercalar y redondear.
// Cada grupo es una lista que la hoja pide comparar u ordenar (se reserva todo par o todo trío que salga de él).
const GRUPOS_HOJA = [
  ['9.3', '9.25'], ['0.6', '0.59'], ['5.60', '5.6'], ['3.04', '3.4'], ['0.37', '0.4'], ['12.09', '12.1'], ['8.62', '8.602'],
  ['5.8', '5.79', '5.093', '5.791'], ['4.12', '4.7'], ['-1.7', '-1.07'], ['0.04', '-0.4'],
  ['8.3', '8.03', '8.31', '8.033'], ['0.61', '0.6', '0.059', '0.65', '0.601'],
  ['15.2', '15.08', '15.19', '14.9'], ['-3.5', '-3.05', '0.5', '-3.45'],
].map(g => new Set(g.map(kv)));
const ENTRE_HOJA = new Set([['6.8', '6.9'], ['0.4', '0.41']].map(p => p.map(kv).sort().join(' y ')));
const REDONDEO_HOJA = new Set(['4.726', '9.153', '12.849', '5.97', '0.996', '6.349'].map(kv));

// Examen de la semana 1 (por huella; vacío hasta que exista su fichero de casos). Claves: pareja = los dos
// valores canónicos ordenados y unidos con ' y '; conjunto = valores canónicos ordenados y unidos con ',';
// entre = como la pareja; redondeo = valor canónico + '@' + cifras.
const HUELLAS_PAREJAS = new Set([]);
const HUELLAS_CONJUNTOS = new Set([]);
const HUELLAS_ENTRE = new Set([]);
const HUELLAS_REDONDEO = new Set([]);

const clavePareja = (a, b) => [clave(a), clave(b)].sort().join(' y ');
const claveConjunto = lista => lista.map(clave).sort().join(',');

export const esParejaReservada = (a, b) => {
  const c = clavePareja(a, b);
  const ka = clave(a), kb = clave(b);
  return HUELLAS_PAREJAS.has(huella(c)) || GRUPOS_HOJA.some(g => g.has(ka) && g.has(kb));
};
export const esConjuntoReservado = lista => {
  const claves = lista.map(clave);
  return HUELLAS_CONJUNTOS.has(huella(claveConjunto(lista))) || GRUPOS_HOJA.some(g => claves.filter(c => g.has(c)).length >= 3);
};
export const esEntreReservado = (a, b) => { const c = clavePareja(a, b); return ENTRE_HOJA.has(c) || HUELLAS_ENTRE.has(huella(c)); };
export const esRedondeoReservado = (d, c) => REDONDEO_HOJA.has(clave(d)) || HUELLAS_REDONDEO.has(huella(`${clave(d)}@${c}`));

// ─── Ejercicio 1: ¿cuál es mayor? ────────────────────────────────────────────────────────

export const CASOS_COMPARAR = ['trampa', 'normal', 'iguales', 'ceros', 'negativo'];

/**
 * Ítem: { a, b, caso }. 40 % «trampa» (misma parte entera, uno con más cifras, y comparar por cifras daría
 * la respuesta mala), 18 % normal, 12 % iguales («=», distinta escritura: 2,5 y 2,50), 10 % cero en medio
 * (2,05 y 2,5), 20 % con negativos. Con «=» solo en los ítems iguales.
 */
export function generarComparar(rng) {
  const r = rng.azar();
  const caso = r < 0.40 ? 'trampa' : r < 0.58 ? 'normal' : r < 0.70 ? 'iguales' : r < 0.80 ? 'ceros' : 'negativo';
  const dosNegativos = rng.azar() < 0.6;
  for (;;) {
    let a, b;
    if (caso === 'trampa' || (caso === 'negativo' && dosNegativos)) {
      const e = rng.entero(0, 15);
      const k1 = rng.entero(1, 2), k2 = rng.entero(k1 + 1, 3);
      a = mk(e, sinCeroFinal(rng, k1), k1); b = mk(e, sinCeroFinal(rng, k2), k2);
      if (comparar(a, b) === 0 || !compararPorCifras(a, b)) continue;   // null (acierta) o 0 (empata): no es trampa
      if (caso === 'negativo') { a = a.opuesto(); b = b.opuesto(); }
    } else if (caso === 'negativo') {
      // Uno negativo y otro positivo: ignorar el signo daría la respuesta mala (|negativo| > |positivo|).
      const k1 = rng.entero(1, 3), k2 = rng.entero(1, 3);
      const x = mk(rng.entero(0, 15), sinCeroFinal(rng, k1), k1), y = mk(rng.entero(0, 15), sinCeroFinal(rng, k2), k2);
      if (comparar(x, y) <= 0) continue;
      a = x.opuesto(); b = y;
    } else if (caso === 'normal') {
      const e1 = rng.entero(0, 20), e2 = rng.entero(0, 20);
      const k1 = rng.entero(1, 3), k2 = e1 === e2 ? k1 : rng.entero(1, 3);
      a = mk(e1, sinCeroFinal(rng, k1), k1); b = mk(e2, sinCeroFinal(rng, k2), k2);
      if (comparar(a, b) === 0) continue;
    } else if (caso === 'iguales') {
      const k0 = rng.entero(0, 2);
      const x = k0 === 0 ? decimal(rng.entero(1, 20), 0) : mk(rng.entero(0, 15), sinCeroFinal(rng, k0), k0);
      a = x; b = x.conCifras(Math.min(3, k0 + rng.entero(1, 2)));
    } else {
      const e = rng.entero(0, 15);
      a = decimal(e * 100 + rng.entero(1, 9), 2);   // e,0d
      b = decimal(e * 10 + rng.entero(1, 9), 1);    // e,t
    }
    if (rng.azar() < 0.5) [a, b] = [b, a];
    if (esParejaReservada(P(a), P(b))) continue;
    return { a: P(a), b: P(b), caso };
  }
}

/** La respuesta buena: '<', '=' o '>'. */
export const simboloComparar = item => simbolo(comparar(D(item.a), D(item.b)));

/** El error típico que explica el símbolo elegido mal; null si acertó. */
export function errorComparar(item, elegido) {
  const a = D(item.a), b = D(item.b);
  const c = elegido === '<' ? -1 : elegido === '>' ? 1 : 0;
  const real = comparar(a, b);
  if (c === real) return null;
  if (c === 0) return item.caso === 'ceros' ? 'cero-en-medio-sin-valor' : 'cree-iguales';
  if (real === 0) return 'cero-final-cambia-el-valor';
  if ((a.m < 0 || b.m < 0) && comparar(a.abs(), b.abs()) === c) return 'ignora-el-signo';
  if (compararPorCifras(a, b) === c) return 'compara-por-cifras';
  return 'compara-mal';
}

/** «0,1 = 0,10 y 13,01 = 13,01» sin repetir el que ya tiene las cifras: solo los que cambian de escritura. */
function igualadas(a, b, idioma) {
  const k = Math.max(a.k, b.k);
  const cambia = [a, b].filter(x => x.k !== k).map(x => `${aTexto(x, idioma)} = ${aTexto(x, idioma, k)}`);
  return cambia.join(idioma === 'es' ? ' y ' : ' and ');
}

/** Feedback del ejercicio 1: el método que tocaba con los números del ítem (y qué error se cometió). */
export function explicarComparar(item, elegido, idioma) {
  const t = TX.comp;
  const a = D(item.a), b = D(item.b);
  const A = aTexto(a, idioma), B = aTexto(b, idioma);
  const real = comparar(a, b);
  const s = H(simbolo(real));
  let metodo;
  if (real === 0) metodo = t.metodo.iguales[idioma](A, B);
  else if (item.caso === 'ceros') {
    const k = Math.max(a.k, b.k);
    metodo = t.metodo.ceros[idioma](A, B, aTexto(a, idioma, k), aTexto(b, idioma, k), s);
  } else if (a.m < 0 && b.m < 0) {
    metodo = t.metodo.negativos[idioma](aTexto(a.abs(), idioma), H(simbolo(comparar(a.abs(), b.abs()))), aTexto(b.abs(), idioma), A, s, B);
  } else if (a.m < 0 || b.m < 0) {
    const [neg, pos] = a.m < 0 ? [A, B] : [B, A];
    metodo = t.metodo.mixto[idioma](neg, pos, A, s, B);
  } else if (a.k === b.k) metodo = t.metodo.cifrasIguales[idioma](A, B, s);
  else {
    const k = Math.max(a.k, b.k);
    metodo = t.metodo.cifras[idioma](igualadas(a, b, idioma), aTexto(a, idioma, k), s, aTexto(b, idioma, k), A, B);
  }
  const error = elegido ? errorComparar(item, elegido) : null;
  return error ? `${t.errores[error][idioma]} ${metodo}` : metodo;
}

// ─── Ejercicio 2: ordena ────────────────────────────────────────────────────────────────────

/** Cifras de la escritura como un natural (la parte decimal "como un número"): 3,05 → 5, 3,5 → 5. */
const clavePorCifras = d => {
  const x = D(d);
  const entera = Math.floor(Math.abs(x.m) / pot(x.k)), fraccion = Math.abs(x.m) % pot(x.k);
  return (x.m < 0 ? -1 : 1) * (entera * 1e7 + fraccion);
};
const ordenarIdx = (vals, cmp, creciente) =>
  vals.map((_, i) => i).sort((i, j) => (creciente ? 1 : -1) * cmp(vals[i], vals[j]) || i - j);
const ordenPorCifras = (item) => ordenarIdx(item.vals, (x, y) => clavePorCifras(x) - clavePorCifras(y), item.creciente);
const ordenPorAbs = (item) => ordenarIdx(item.vals, (x, y) => comparar(D(x).abs(), D(y).abs()), item.creciente);
const mismoOrden = (x, y) => x.length === y.length && x.every((v, i) => v === y[i]);

/**
 * Ítem: { vals: [{ m, k }…] (en el orden en que se enseñan, barajado), creciente, tipo }. 4 o 5 decimales con
 * la misma parte entera y distinto número de cifras (hasta 3), ninguno repetido por valor. 75 % positivos,
 * 13 % todos negativos y 12 % con alguno negativo. En los positivos, ordenar «por cifras» da otro orden y
 * sus claves no empatan; en los de signo, ignorar el signo da otro orden.
 */
export function generarOrden(rng) {
  for (;;) {
    const n = rng.elegir([4, 4, 5]);
    const e = rng.entero(0, 12);
    const base = [];
    while (base.length < n) {
      const k = rng.entero(1, 3);
      const d = mk(e, sinCeroFinal(rng, k), k);
      if (!base.some(v => comparar(v, d) === 0)) base.push(d);
    }
    if (new Set(base.map(v => v.k)).size < 2) continue;
    const r = rng.azar();
    const tipo = r < 0.75 ? 'positivos' : r < 0.88 ? 'negativos' : 'mezcla';
    let lista = base;
    if (tipo === 'negativos') lista = base.map(v => v.opuesto());
    else if (tipo === 'mezcla') { const q = rng.entero(1, 2); lista = base.map((v, i) => (i < q ? v.opuesto() : v)); }
    lista = rng.barajar(lista);
    const item = { vals: lista.map(P), creciente: rng.azar() < 0.5, tipo };
    const buena = ordenCorrecto(item);
    if (mismoOrden(buena, item.vals.map((_, i) => i)) || mismoOrden(buena, [...item.vals.keys()].reverse())) continue;
    if (tipo === 'positivos') {
      if (new Set(item.vals.map(clavePorCifras)).size !== n || mismoOrden(buena, ordenPorCifras(item))) continue;
    } else if (mismoOrden(buena, ordenPorAbs(item))) continue;
    if (esConjuntoReservado(item.vals)) continue;
    return item;
  }
}

/** Los índices de `vals` en el orden que se pide. */
export const ordenCorrecto = item => ordenarIdx(item.vals, (x, y) => comparar(D(x), D(y)), item.creciente);
export const ordenBien = (item, mio) => mismoOrden(ordenCorrecto(item), mio);

/** El error típico del orden elegido (lista de índices); null si es el bueno. */
export function errorOrden(item, mio) {
  const buena = ordenCorrecto(item);
  if (mismoOrden(buena, mio)) return null;
  if (item.tipo !== 'positivos' && mismoOrden(ordenPorAbs(item), mio)) return 'ignora-el-signo';
  if (item.tipo === 'positivos' && mismoOrden(ordenPorCifras(item), mio)) return 'compara-por-cifras';
  if (mismoOrden([...buena].reverse(), mio)) return 'orden-al-reves';
  return 'orden-mal';
}

/** Feedback del ejercicio 2: todos con las mismas cifras decimales y el orden bueno. */
export function explicarOrden(item, mio, idioma) {
  const t = TX.orden;
  const k = Math.max(...item.vals.map(v => v.k));
  const sep = idioma === 'es' ? '; ' : ', ';
  const lista = item.vals.map(v => aTexto(D(v), idioma, k)).join(sep);
  const buena = ordenCorrecto(item);
  const orden = buena.map(i => aTexto(D(item.vals[i]), idioma)).join(item.creciente ? ' &lt; ' : ' &gt; ');
  const metodo = t.metodo[idioma](lista, orden, item.creciente);
  const error = mio ? errorOrden(item, mio) : null;
  return error ? `${t.errores[error][idioma]} ${metodo}` : metodo;
}

// ─── Ejercicio 3: entre dos ─────────────────────────────────────────────────────────────────

/**
 * Ítem: { a, b, modo: 'escribe' | 'elige', opciones? } con a < b. b = a + 1 (65 %) o + 2…4 unidades de
 * décima, centésima o milésima (a con 1 o 2 cifras; b, con una más a veces). En «elige», cuatro opciones
 * { d, error }: una entre los dos (error null) y tres fuera, con error típico: un poco por debajo de a,
 * un poco por encima de b, o con otra parte entera.
 */
export function generarEntre(rng) {
  for (;;) {
    const e = rng.entero(0, 15);
    const k = rng.entero(1, 2);
    const a = mk(e, sinCeroFinal(rng, k), k);
    const kb = k === 1 ? rng.elegir([1, 1, 2]) : 2;
    const paso = rng.azar() < 0.65 ? 1 : rng.entero(2, 4);
    const b = sumar(a, decimal(paso, kb)).normalizar();
    if (esEntreReservado(P(a), P(b))) continue;
    const item = { a: P(a), b: P(b), modo: rng.azar() < 0.55 ? 'escribe' : 'elige' };
    if (item.modo === 'elige') {
      const opciones = opcionesEntre(rng, a, b);
      if (!opciones) continue;
      item.opciones = opciones;
    }
    return item;
  }
}

function opcionesEntre(rng, a, b) {
  const kc = Math.max(a.k, b.k) + 1;
  const mA = a.conCifras(kc).m, mB = b.conCifras(kc).m;
  const buena = decimal(rng.entero(mA + 1, mB - 1), kc).normalizar();
  const debajo = mA - rng.entero(1, 9), encima = mB + rng.entero(1, 9);
  const otraM = buena.conCifras(kc).m;
  const otra = otraM >= pot(kc) && rng.azar() < 0.5 ? otraM - pot(kc) : otraM + pot(kc);
  if (debajo < 1) return null;
  const malas = [
    { d: decimal(debajo, kc).normalizar(), error: 'fuera-por-debajo' },
    { d: decimal(encima, kc).normalizar(), error: 'fuera-por-encima' },
    { d: decimal(otra, kc).normalizar(), error: 'ignora-parte-entera' },
  ];
  const todas = [buena, ...malas.map(x => x.d)];
  if (hayIguales(todas)) return null;
  if (malas.some(x => estaEntre({ a: P(a), b: P(b) }, x.d) || x.d.equals(a) || x.d.equals(b))) return null;
  return rng.barajar([{ d: P(buena), error: null }, ...malas.map(x => ({ d: P(x.d), error: x.error }))]);
}

/** ¿Está el decimal `t` (Decimal) estrictamente entre a y b? Vale cualquier escritura. */
export const estaEntre = (item, t) => comparar(t, D(item.a)) > 0 && comparar(t, D(item.b)) < 0;

/** El error típico de lo escrito `t` (Decimal); null si está entre los dos. */
export function errorEntre(item, t) {
  if (estaEntre(item, t)) return null;
  if (t.equals(D(item.a)) || t.equals(D(item.b))) return 'repite-un-extremo';
  return comparar(t, D(item.a)) < 0 ? 'fuera-por-debajo' : 'fuera-por-encima';
}

/** El error de la opción elegida (índice en `item.opciones`); null si es la buena. */
export const errorEntreOpcion = (item, i) => item.opciones[i].error;

/** Un decimal bueno para enseñar de ejemplo (el de la opción buena, o el más corto entre los dos). */
export function ejemploEntre(item) {
  if (item.opciones) return D(item.opciones.find(o => o.error === null).d);
  const a = D(item.a), b = D(item.b);
  const kc = Math.max(a.k, b.k) + 1;
  return decimal(a.conCifras(kc).m + 1, kc).normalizar();
}

/** Feedback del ejercicio 3: pasar a una cifra más y dar un ejemplo (y qué falló). */
export function explicarEntre(item, error, idioma) {
  const t = TX.entre;
  const a = D(item.a), b = D(item.b);
  const kc = Math.max(a.k, b.k) + 1;
  const metodo = t.metodo[idioma](aTexto(a, idioma), aTexto(b, idioma), aTexto(a, idioma, kc), aTexto(b, idioma, kc), aTexto(ejemploEntre(item), idioma));
  return error ? `${t.errores[error][idioma]} ${metodo}` : metodo;
}

// ─── Ejercicio 4: redondea ──────────────────────────────────────────────────────────────────

/** La cifra decimal que sigue a las `c` que se dejan. */
export const cifraSiguiente = (d, c) => Math.floor(Math.abs(d.m) / pot(d.k - c - 1)) % 10;
/** ¿Sube un 9? (la última cifra que se deja es 9 y la siguiente es 5 o más) */
export function haceArrastre(d, c) {
  const x = D(d);
  const dejadas = truncar(x, c);
  return dejadas.m % 10 === 9 && cifraSiguiente(x, c) >= 5;
}

/**
 * Ítem: { d, c, consigna: 'entero' | 'orden' | 'cifras', modo: 'escribe' | 'elige', opciones? }. c = 0, 1 o 2
 * cifras decimales que se dejan (25 / 40 / 35 %); d tiene 1-3 cifras decimales y la última no es 0; un 25 %
 * de los ítems tiene un 9 que arrastra (2,96 → 3,0). En «elige», cuatro opciones { d, error } distintas
 * por valor; en «escribe», se pide el resultado con exactamente c cifras.
 */
export function generarRedondeo(rng) {
  const rc = rng.azar();
  const c = rc < 0.25 ? 0 : rc < 0.65 ? 1 : 2;
  const arrastre = rng.azar() < 0.25;
  let modo = rng.azar() < 0.5 ? 'escribe' : 'elige';
  const consigna = c === 0 ? 'entero' : rng.elegir(['orden', 'cifras']);
  const trampaCadena = !arrastre && c <= 1 && rng.azar() < 0.2;   // 6,349 a la décima: 6,35 → 6,4
  for (;;) {
    // Para elegir a la unidad hacen falta tres cifras decimales: con menos no hay tres distractores distintos.
    const k = c === 0 && modo === 'elige' ? 3 : Math.min(3, c + (trampaCadena ? 2 : rng.entero(1, 2)) + (c === 0 && !trampaCadena && rng.azar() < 0.4 ? 1 : 0));
    const frac = Array.from({ length: k }, () => rng.entero(0, 9));
    let e = rng.entero(0, 20);
    if (frac[k - 1] === 0) frac[k - 1] = rng.entero(1, 9);
    if (arrastre) {
      frac[c] = rng.entero(5, 9);
      if (c === 0) e = rng.elegir([9, 19]); else frac[c - 1] = 9;
    } else if (trampaCadena) {
      frac[c] = 4; frac[c + 1] = rng.entero(5, 9);
    }
    const d = decimal(Number(String(e) + frac.join('')), k);
    if (haceArrastre(P(d), c) !== arrastre || esRedondeoReservado(P(d), c)) continue;
    const item = { d: P(d), c, consigna, modo };
    if (modo === 'elige') {
      const pool = distractoresRedondeo(item);
      if (pool.length < 3) { modo = 'escribe'; continue; }
      // La trampa de la cadena entra siempre que existe; el resto, al azar.
      const cadena = pool.filter(x => x.error === 'redondea-en-cadena');
      const resto = rng.barajar(pool.filter(x => x.error !== 'redondea-en-cadena'));
      item.opciones = rng.barajar([
        { d: P(redondear(d, c)), error: null },
        ...[...cadena, ...resto].slice(0, 3).map(x => ({ d: P(x.valor), error: x.error })),
      ]);
    }
    return item;
  }
}

/** El redondeo bueno (Decimal con exactamente c cifras). */
export const redondeoBueno = item => redondear(D(item.d), item.c);

/** Todos los distractores posibles [{ valor, error }], distintos por valor entre sí y de la respuesta buena. */
export function distractoresRedondeo(item) {
  const d = D(item.d), c = item.c;
  const buena = redondeoBueno(item);
  const subeSiempre = sumar(truncar(d, c), decimal(1, c));
  const cadena = ERRORES_TIPICOS['redondea-en-cadena'].fn(d, c);
  const dejadas = truncar(d, c);
  const sinLlevar = c >= 1 && haceArrastre(item.d, c) ? decimal(Math.floor(dejadas.m / 10) * 100 + 10, c + 1) : null;
  const candidatos = [
    ['redondea-truncando', truncar(d, c)],
    ['redondea-en-cadena', cadena],   // antes que «sube-siempre»: si dan lo mismo, el nombre es el más específico
    ['sube-siempre', subeSiempre],
    ['redondea-otro-orden', d.k > c + 1 ? redondear(d, c + 1) : d],
    ['redondea-otro-orden', d.k > c + 2 ? redondear(d, c + 2) : null],
    ['redondea-otro-orden', c >= 1 ? redondear(d, c - 1) : null],
    ['sin-llevar', sinLlevar],
  ];
  const vistos = [buena];
  const salida = [];
  for (const [error, valor] of candidatos) {
    if (valor === null || vistos.some(v => mismoValor(v, valor))) continue;
    vistos.push(valor);
    salida.push({ valor, error });
  }
  return salida;
}

/** El error típico de la respuesta `t` (Decimal); null si es la buena (valor y número de cifras). */
export function errorRedondeo(item, t) {
  const buena = redondeoBueno(item);
  if (mismoValor(t, buena)) return t.k === item.c ? null : 'cifras-distintas';
  const hallado = distractoresRedondeo(item).find(x => mismoValor(x.valor, t));
  return hallado ? hallado.error : 'redondeo-mal';
}

/** Feedback del ejercicio 4: mirar la cifra siguiente, el resultado, el arrastre y el error. */
export function explicarRedondeo(item, error, idioma) {
  const t = TX.red;
  const d = D(item.d), c = item.c;
  const R = aTexto(redondeoBueno(item), idioma);
  const sig = cifraSiguiente(d, c);
  const orden = ORDENES[-(c + 1)].singular[idioma];
  let texto = t.metodo[idioma](aTexto(d, idioma), sig, orden, sig >= 5, R);
  if (haceArrastre(item.d, c)) texto += ` ${t.acarreo[idioma](aTexto(truncar(d, c), idioma), R)}`;
  return error ? `${t.errores[error][idioma]} ${texto}` : texto;
}

/** El enunciado del ejercicio 4 en un idioma: la consigna con el número escrito en ese idioma. */
export function consignaRedondeo(item, idioma) {
  const N = aTexto(D(item.d), idioma);
  const c = item.c;
  const f = item.consigna === 'entero' ? TX.red.consigna.entero : TX.red.consigna[item.consigna][c];
  return f[idioma](N);
}
