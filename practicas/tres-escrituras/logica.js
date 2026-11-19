// Práctica «Porcentaje, fracción y decimal» de la unidad 7 (PU2 tarea 218): lógica pura (sin DOM ni red).
// Cuatro ejercicios:
//   1. Los porcentajes fáciles   50, 25, 10, 20, 75 y 1 % ↔ fracción (elegir entre cuatro, en los dos sentidos)
//   2. Escríbelo de otra forma   35 % → 0,35 | 7/20; 0,08 → 8 %; 3/5 → 60 %
//   3. Une las tres              tres fracciones con su decimal y su porcentaje (y un señuelo de cada)
//   4. Ordena                    cuatro números en escrituras mezcladas
//
// Una escritura (E) es DATOS: { t: 'p', m, k } el porcentaje (el número m / 10^k, sin el signo), { t: 'd', m, k }
// el decimal y { t: 'f', num, den } la fracción. Todo se compara por valor con fracciones exactas (`valorDe`),
// nunca con `Number`. Aquí las escrituras equivalentes son la RESPUESTA, no un distractor: los distractores y
// los señuelos son siempre valores distintos, cada uno de un error con nombre.

import { fraccion, htmlFraccion, leerFraccion } from '../_comun/fracciones.js';
import { mcd } from '../_comun/aritmetica.js';
import { decimal, aTexto as decimalATexto, deTexto as leerDecimal, aFraccionDecimal } from '../_comun/decimales.js';
import { NBSP } from '../_comun/proporcion.js';

// ─── Escrituras ──────────────────────────────────────────────────────────────────────────────

const quitaCeros = ({ m, k }) => { while (k > 0 && m % 10 === 0) { m /= 10; k--; } return { m, k }; };

export const pctE = (m, k = 0) => ({ t: 'p', ...quitaCeros({ m, k }) });
export const decE = (m, k) => ({ t: 'd', ...quitaCeros({ m, k }) });
export const fracE = (num, den) => { const g = mcd(num, den); return { t: 'f', num: num / g, den: den / g }; };

/** Las tres escrituras del porcentaje entero p (1 a 99). */
export const escrituras = p => ({ p: pctE(p), d: decE(p, 2), f: fracE(p, 100) });

/** El valor de una escritura, como Fraccion exacta (el 75 % es 3/4). */
export function valorDe(e) {
  if (e.t === 'p') return fraccion(e.m, 100 * 10 ** e.k).simplificar();
  if (e.t === 'd') return fraccion(e.m, 10 ** e.k).simplificar();
  return fraccion(e.num, e.den).simplificar();
}
export const mismoValor = (a, b) => valorDe(a).equals(valorDe(b));
const distintos = lista => lista.every((a, i) => lista.every((b, j) => i === j || !mismoValor(a, b)));
const aP = f => Math.round(100 * f.num / f.den);   // el porcentaje entero de una fracción que vale p/100

/** La escritura como HTML, en el idioma: 75 % (con espacio de no separación) o 75%; 0,75 o 0.75; 3/4 con raya. */
export function txt(e, idioma) {
  if (e.t === 'f') return htmlFraccion(fraccion(e.num, e.den), { compacta: true });
  const n = decimalATexto(decimal(e.m, e.k), idioma);
  if (e.t === 'd') return n;
  return idioma === 'en' ? `${n}%` : `${n}${NBSP}%`;
}

/** Los porcentajes enteros que se pueden usar: los de las listas (denominadores sencillos). */
export const AMIGAS = [2, 4, 5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95];
export const FACILES = [50, 25, 10, 20, 75, 1];

// ─── Ejercicio 1: los porcentajes fáciles ────────────────────────────────────────────────────

export const ERRORES_EJ1 = {
  'porcentaje-al-denominador': { es: 'Ha puesto el porcentaje como denominador', en: 'Put the percentage as the denominator' },
  invertida: { es: 'Ha escrito la fracción al revés', en: 'Wrote the fraction upside down' },
  'entre-diez': { es: 'Ha dividido entre 10 en vez de entre 100', en: 'Divided by 10 instead of by 100' },
  vecina: { es: 'Ha elegido la fracción de otro porcentaje', en: 'Chose the fraction of a different percentage' },
  'cifras-pegadas': { es: 'Ha pegado el numerador y el denominador', en: 'Stuck the numerator and the denominator together' },
  'denominador-como-porcentaje': { es: 'Ha tomado el denominador como porcentaje', en: 'Took the denominator as the percentage' },
  'coma-mal': { es: 'Tiene las cifras bien, pero la coma mal puesta', en: 'Has the right digits but the decimal point in the wrong place' },
  'decimal-con-signo': { es: 'Ha escrito el decimal con el signo %', en: 'Wrote the decimal with a % sign' },
};

/** Los candidatos a distractor al pasar el porcentaje p a fracción: [{ e, error }] (sin los que no sirven). */
export function distractoresFraccion(p) {
  const buena = fracE(p, 100), lista = [];
  if (p > 1) lista.push({ error: 'porcentaje-al-denominador', e: fracE(1, p) });
  if (buena.num > 1) lista.push({ error: 'invertida', e: fracE(buena.den, buena.num) });
  const dieces = fracE(p, 10);
  if (dieces.den > 1) lista.push({ error: 'entre-diez', e: dieces });
  for (const q of FACILES) if (q !== p) lista.push({ error: 'vecina', e: fracE(q, 100) });
  return lista.filter(c => c.e.den > 1 && !mismoValor(c.e, buena));
}

/** Los candidatos a distractor al pasar la fracción de p a porcentaje. */
export function distractoresPorcentaje(p) {
  const f = fracE(p, 100), lista = [];
  const pegadas = Number(`${f.num}${f.den}`);
  if (pegadas < 100) lista.push({ error: 'cifras-pegadas', e: pctE(pegadas) });
  if (f.den < 100) lista.push({ error: 'denominador-como-porcentaje', e: pctE(f.den) });
  lista.push({ error: 'coma-mal', e: pctE(p, 1) });
  lista.push({ error: 'decimal-con-signo', e: pctE(p, 2) });
  for (const q of FACILES) if (q !== p) lista.push({ error: 'vecina', e: pctE(q) });
  return lista.filter(c => !mismoValor(c.e, pctE(p)));
}

/**
 * { ejercicio: 1, sentido: 'pf'|'fp', p, dado: E, opciones: [{ e, correcta, error }] ×4 }
 * pf: «¿qué fracción es el 75 %?» (cuatro fracciones); fp: «¿qué porcentaje es 1/4?» (cuatro porcentajes).
 * Las cuatro opciones, en la misma escritura y de cuatro valores distintos. El pool se baraja antes de
 * quedarse con tres.
 */
export function generarFaciles(rng) {
  for (;;) {
    const sentido = rng.elegir(['pf', 'fp']), p = rng.elegir(FACILES);
    const buena = sentido === 'pf' ? fracE(p, 100) : pctE(p);
    const pool = rng.barajar(sentido === 'pf' ? distractoresFraccion(p) : distractoresPorcentaje(p));
    const malos = [];
    for (const c of pool) if (malos.length < 3 && distintos([buena, ...malos.map(m => m.e), c.e])) malos.push(c);
    if (malos.length < 3) continue;
    const opciones = rng.barajar([{ e: buena, correcta: true, error: null }, ...malos.map(m => ({ e: m.e, correcta: false, error: m.error }))]);
    return { ejercicio: 1, sentido, p, dado: sentido === 'pf' ? pctE(p) : fracE(p, 100), opciones };
  }
}

// ─── Ejercicio 2: escríbelo de otra forma ────────────────────────────────────────────────────

export const ERRORES_EJ2 = {
  'coma-de-mas': { es: 'Ha corrido la coma tres lugares en vez de dos', en: 'Moved the decimal point three places instead of two' },
  'unidades-como-decimas': { es: 'Ha tomado las unidades como décimas', en: 'Took the units as tenths' },
  'entre-diez': { es: 'Ha dividido entre 10 en vez de entre 100', en: 'Divided by 10 instead of by 100' },
  'numero-tal-cual': { es: 'Ha dejado el número como estaba', en: 'Left the number as it was' },
  'por-diez': { es: 'Ha multiplicado por 10 en vez de por 100', en: 'Multiplied by 10 instead of by 100' },
  'decimal-con-signo': { es: 'Ha escrito el decimal con el signo %', en: 'Wrote the decimal with a % sign' },
  'cifras-pegadas': { es: 'Ha pegado el numerador y el denominador', en: 'Stuck the numerator and the denominator together' },
  'denominador-como-porcentaje': { es: 'Ha tomado el denominador como porcentaje', en: 'Took the denominator as the percentage' },
  'sin-simplificar': { es: 'Ha dejado la fracción sin simplificar del todo', en: 'Left the fraction not fully simplified' },
  'porcentaje-al-denominador': ERRORES_EJ1['porcentaje-al-denominador'],
  invertida: ERRORES_EJ1.invertida,
  'otra-respuesta': { es: 'Ha dado otra respuesta', en: 'Gave a different answer' },
};

export const TIPOS_EJ2 = ['p-d', 'p-f', 'd-p', 'f-p'];

/**
 * { ejercicio: 2, tipo: 'p-d'|'p-f'|'d-p'|'f-p', p, desde: E, a: 'd'|'f'|'p' }
 * p es el porcentaje entero (1 a 99). Uno de cada tres ítems es de una cifra (5 %, 8 %, 0,05).
 */
export function generarOtraForma(rng) {
  const tipo = rng.elegir(TIPOS_EJ2);
  const p = rng.azar() < 1 / 3 ? rng.entero(1, 9) : rng.entero(10, 99);
  const e = escrituras(p);
  const [de, a] = tipo.split('-');
  return { ejercicio: 2, tipo, p, desde: e[de], a };
}

/** Lo que vale la respuesta buena, como escritura. */
export const respuestaBuena = item => escrituras(item.p)[item.a];

const F = (n, d = 1) => fraccion(n, d).simplificar();
const entero = n => String(n);

/**
 * Corrige lo escrito. `texto` es lo que teclea el alumno (decimal o porcentaje) o { num, den } (fracción).
 * → { acierto, error } (error null si acierta); null si no se entiende.
 */
export function evaluarOtraForma(item, texto) {
  const p = item.p;
  if (item.a === 'f') {
    const { num, den } = texto;
    if (!Number.isInteger(num) || !Number.isInteger(den) || den < 1 || num < 0) return null;
    const w = F(num, den), buena = fracE(p, 100);
    if (num === buena.num && den === buena.den) return { acierto: true, error: null };
    if (w.equals(F(p, 100))) return { acierto: false, error: 'sin-simplificar' };
    if (item.tipo === 'p-f') {
      if (w.equals(F(1, p))) return { acierto: false, error: 'porcentaje-al-denominador' };
      if (buena.num > 1 && w.equals(F(buena.den, buena.num))) return { acierto: false, error: 'invertida' };
      if (w.equals(F(p, 10))) return { acierto: false, error: 'entre-diez' };
    }
    return { acierto: false, error: 'otra-respuesta' };
  }
  const limpio = String(texto).replace(/[\s  ]+/g, '').replace(/%$/, '');
  const d = leerDecimal(limpio);
  if (d === null) return null;
  const w = aFraccionDecimal(d).simplificar();
  if (item.a === 'd') {
    if (w.equals(F(p, 100))) return { acierto: true, error: null };
    if (w.equals(F(p, 1000))) return { acierto: false, error: 'coma-de-mas' };
    if (w.equals(F(p, 10))) return { acierto: false, error: p < 10 ? 'unidades-como-decimas' : 'entre-diez' };
    if (w.equals(F(p))) return { acierto: false, error: 'numero-tal-cual' };
    return { acierto: false, error: 'otra-respuesta' };
  }
  // a === 'p'
  if (w.equals(F(p))) return { acierto: true, error: null };
  if (item.tipo === 'd-p') {
    if (w.equals(F(p * 10))) return { acierto: false, error: 'por-diez' };
    if (w.equals(F(p, 100))) return { acierto: false, error: 'decimal-con-signo' };
    return { acierto: false, error: 'otra-respuesta' };
  }
  const f = item.desde;
  if (w.equals(F(Number(`${f.num}${f.den}`)))) return { acierto: false, error: 'cifras-pegadas' };
  if (w.equals(F(f.den))) return { acierto: false, error: 'denominador-como-porcentaje' };
  if (w.equals(F(f.num, f.den))) return { acierto: false, error: 'decimal-con-signo' };
  return { acierto: false, error: 'otra-respuesta' };
}

/** Lo que tecleó el alumno en un campo de fracción: { num, den } desde dos naturales. */
export const fraccionEscrita = (num, den) => ({ num, den });
export { leerFraccion, entero };

// ─── Ejercicio 3: une las tres ───────────────────────────────────────────────────────────────

export const ERRORES_EJ3 = {
  'coma-de-mas': ERRORES_EJ2['coma-de-mas'],
  'unidades-como-decimas': ERRORES_EJ2['unidades-como-decimas'],
  'cifras-pegadas': ERRORES_EJ2['cifras-pegadas'],
  'otra-pareja': { es: 'Ha emparejado una fracción con algo que no es', en: 'Matched a fraction with something that is not it' },
};

/** Parejas que se confunden a propósito (porcentajes): 1/5 y 1/20, 1/4 y 1/25, 1/2 y 1/20, 1/10 y 1/100. */
export const TRAMPAS3 = [[20, 5], [25, 4], [50, 5], [10, 1]];

/** Los señuelos que da el error de la fracción de p: { error, d: E, p: E } (válidos solo si no valen lo de las tres). */
export function senuelosDe(p) {
  const f = fracE(p, 100), lista = [{ error: 'coma-de-mas', d: decE(p, 3), p: pctE(p, 1) }];
  if (p < 10) lista.push({ error: 'unidades-como-decimas', d: decE(p, 1), p: pctE(p * 10) });
  const pegadas = Number(`${f.num}${f.den}`);
  if (pegadas < 100) lista.push({ error: 'cifras-pegadas', d: decE(pegadas, 2), p: pctE(pegadas) });
  return lista;
}

/**
 * { ejercicio: 3, ps: [p ×3], fracciones: [E ×3], decimales: [E ×4], porcentajes: [E ×4],
 *   solD: [j de cada fracción], solP: [j de cada fracción], senuelo: { error, de: i } }
 */
export function generarUne(rng) {
  for (;;) {
    let ps;
    if (rng.azar() < 0.5) {
      const par = rng.elegir(TRAMPAS3);
      ps = [...par, rng.elegir(AMIGAS)];
    } else ps = [rng.elegir(AMIGAS), rng.elegir(AMIGAS), rng.elegir(AMIGAS)];
    if (new Set(ps).size < 3) continue;
    ps = rng.barajar(ps);
    const tres = ps.map(p => fracE(p, 100));
    const candidatos = [];
    ps.forEach((p, i) => { for (const s of senuelosDe(p)) candidatos.push({ ...s, de: i }); });
    const validos = rng.barajar(candidatos).filter(s => !tres.some(f => mismoValor(f, s.d) || mismoValor(f, s.p)));
    if (!validos.length) continue;
    const s = validos[0];
    const ds = rng.barajar([...ps.map(p => decE(p, 2)), s.d].map((e, idx) => ({ e, idx })));
    const pcs = rng.barajar([...ps.map(p => pctE(p)), s.p].map((e, idx) => ({ e, idx })));
    return {
      ejercicio: 3, ps, fracciones: tres,
      decimales: ds.map(x => x.e), porcentajes: pcs.map(x => x.e),
      solD: ps.map((_, i) => ds.findIndex(x => x.idx === i)), solP: ps.map((_, i) => pcs.findIndex(x => x.idx === i)),
      senuelo: { error: s.error, de: s.de },
    };
  }
}

/** Corrige: asigD[i] y asigP[i] son los índices elegidos para la fracción i. */
export function evaluarUne(item, asigD, asigP) {
  const estadosD = item.solD.map((j, i) => (asigD[i] === j ? 'bien' : 'mal'));
  const estadosP = item.solP.map((j, i) => (asigP[i] === j ? 'bien' : 'mal'));
  const acierto = [...estadosD, ...estadosP].every(e => e === 'bien');
  let error = null, mala = null;
  if (!acierto) {
    const i = estadosD.findIndex(e => e === 'mal') >= 0 ? estadosD.findIndex(e => e === 'mal') : estadosP.findIndex(e => e === 'mal');
    const eligioD = estadosD[i] === 'mal', elegido = eligioD ? item.decimales[asigD[i]] : item.porcentajes[asigP[i]];
    const bueno = eligioD ? item.decimales[item.solD[i]] : item.porcentajes[item.solP[i]];
    const senuelo = eligioD ? item.decimales.length - 1 : item.porcentajes.length - 1;
    mala = { i, eligioD, elegido, bueno };
    const vale = senuelosDe(item.ps[item.senuelo.de]).find(s => s.error === item.senuelo.error);
    error = vale && mismoValor(elegido, eligioD ? vale.d : vale.p) ? item.senuelo.error : 'otra-pareja';
    void senuelo;
  }
  return { acierto, estadosD, estadosP, error, mala };
}

// ─── Ejercicio 4: ordena ─────────────────────────────────────────────────────────────────────

export const ERRORES_EJ4 = {
  'orden-al-reves': { es: 'Los ha ordenado al revés', en: 'Put them in the wrong order' },
  'sin-pasar-a-la-misma-escritura': { es: 'Los ha ordenado sin pasarlos todos a la misma escritura', en: 'Ordered them without changing them all to the same form' },
};

/** Parejas con trampa: 5 % y 0,5; 20 % y 0,02; 1/4 y 4 %. */
const TRAMPAS4 = [
  [escrituras(5).p, escrituras(50).d],
  [escrituras(20).p, escrituras(2).d],
  [escrituras(25).f, escrituras(4).p],
];

/**
 * { ejercicio: 4, orden: 'menor-mayor'|'mayor-menor', numeros: [E ×4], solucion: [índices en el orden pedido],
 *   trampa: boolean }
 */
export function generarOrdena(rng) {
  for (;;) {
    const trampa = rng.azar() < 0.5;
    const numeros = trampa ? [...rng.elegir(TRAMPAS4)] : [];
    while (numeros.length < 4) {
      const e = escrituras(rng.elegir(AMIGAS));
      numeros.push(e[rng.elegir(['p', 'd', 'f'])]);
    }
    if (!distintos(numeros) || new Set(numeros.map(e => e.t)).size < 2) continue;
    const barajados = rng.barajar(numeros);
    const orden = rng.azar() < 0.5 ? 'menor-mayor' : 'mayor-menor';
    const idx = barajados.map((_, i) => i).sort((a, b) => {
      const c = valorDe(barajados[a]).restar(valorDe(barajados[b]));
      return (orden === 'menor-mayor' ? 1 : -1) * Math.sign(c.num);
    });
    return { ejercicio: 4, orden, numeros: barajados, solucion: idx, trampa };
  }
}

/** Corrige la secuencia de índices del alumno. */
export function evaluarOrdena(item, secuencia) {
  if (secuencia.length === item.solucion.length && secuencia.every((x, i) => x === item.solucion[i])) return { acierto: true, error: null };
  const alReves = secuencia.every((x, i) => x === item.solucion[item.solucion.length - 1 - i]);
  return { acierto: false, error: alReves ? 'orden-al-reves' : 'sin-pasar-a-la-misma-escritura' };
}

/** Los números pasados a porcentaje (entero o con decimales) como texto del idioma, en el orden pedido. */
export const enPorcentaje = (e, idioma) => txt(escrituraComoPorcentaje(e), idioma);
export const escrituraComoPorcentaje = e => pctE(aP(valorDe(e)));

// ─── Claves y nombres ────────────────────────────────────────────────────────────────────────

export const nombreDe = id => (ERRORES_EJ1[id] ?? ERRORES_EJ2[id] ?? ERRORES_EJ3[id] ?? ERRORES_EJ4[id] ?? null);

export function claveDe(item) {
  if (item.ejercicio === 1) return `1|${item.sentido}|${item.p}`;
  if (item.ejercicio === 2) return `2|${item.tipo}|${item.p}`;
  if (item.ejercicio === 3) return `3|${[...item.ps].sort((a, b) => a - b).join(',')}`;
  return `4|${item.orden}|${item.numeros.map(e => valorDe(e).clave()).sort().join(',')}`;
}
