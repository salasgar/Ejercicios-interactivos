// Práctica «De fracción a decimal y vuelta» de la unidad 5 (Decimals): lógica pura (sin DOM ni red).
// Cuatro ejercicios de la semana 2 (sesiones 5 y 6):
//   1. De fracción a decimal   3/4 → 0,75 (escribir o elegir); a veces «¿exacto o periódico?» o 1/3 = 0,333…
//   2. De decimal a fracción   0,75 → 3/4, siempre «en su forma irreducible» (elegir o escribir)
//   3. Los que hay que saberse seis fracciones con sus seis decimales, emparejados
//   4. ¿Fracción o decimal?    una fracción y un decimal: <, = o >
//
// Un ítem es DATOS: fracciones { num, den } y decimales { m, k } (m / 10^k, entero escalado). Nada de
// `Number` con coma flotante: todo se compara con `decimales.js`. Todo error lleva un nombre de
// `ERRORES_PROPIOS` (o de `ERRORES_TIPICOS` de la base) y se calcula con los números del ítem.

import { fraccion } from '../_comun/fracciones.js';
import { mcd } from '../_comun/aritmetica.js';
import {
  decimal, aFraccion as decimalAFraccion, aFraccionDecimal, deFraccion, comparar, dividir, redondear, truncar,
  mismoValor, hayIguales, ERRORES_TIPICOS as ERRORES_BASE,
} from '../_comun/decimales.js';

export const Fr = ({ num, den }) => fraccion(num, den);
export const D = ({ m, k }) => decimal(m, k);
const datosD = d => ({ m: d.m, k: d.k });
const datosF = f => ({ num: f.num, den: f.den });
const irreducible = (p, q) => mcd(p, q) === 1;
const signoDe = c => (c < 0 ? '<' : c > 0 ? '>' : '=');

// ─── Errores propios (los de la base, de `decimales.js`, se usan con su nombre) ───────────────

export const ERRORES_PROPIOS = {
  'denominador-como-decimas': { nombre: { es: 'Ha escrito el denominador detrás de la coma', en: 'Wrote the denominator after the decimal point' } },
  'coma-corrida': { nombre: { es: 'Tiene las cifras bien, pero la coma mal puesta', en: 'Has the right digits but the decimal point in the wrong place' } },
  'corta-el-periodico': { nombre: { es: 'Ha cortado el decimal periódico en la décima', en: 'Cut the recurring decimal off at the first digit' } },
  'periodico-por-exacto': { nombre: { es: 'Cree que la división termina, pero el decimal es periódico', en: 'Thinks the division ends, but the decimal is recurring' } },
  'exacto-por-periodico': { nombre: { es: 'Cree que el decimal es periódico, pero la división termina', en: 'Thinks the decimal is recurring, but the division ends' } },
  'sin-simplificar': { nombre: { es: 'Ha dejado la fracción sin simplificar del todo', en: 'Left the fraction not fully simplified' } },
  'un-cero-de-mas': { nombre: { es: 'Ha puesto un cero de más en el denominador', en: 'Put one zero too many in the denominator' } },
  'fraccion-inversa': { nombre: { es: 'Ha escrito la fracción al revés', en: 'Wrote the fraction upside down' } },
  'olvida-parte-entera': { nombre: { es: 'Ha olvidado la parte entera', en: 'Forgot the whole part' } },
  'numerador-contra-decimas': { nombre: { es: 'Ha comparado el numerador con las cifras de detrás de la coma', en: 'Compared the numerator with the digits after the decimal point' } },
  'no-ve-que-son-iguales': { nombre: { es: 'No ha visto que la fracción y el decimal son el mismo número', en: 'Did not see that the fraction and the decimal are the same number' } },
  'otra-pareja': { nombre: { es: 'Ha emparejado una fracción con un decimal que no es', en: 'Matched a fraction with the wrong decimal' } },
  'otra-respuesta': { nombre: { es: 'Ha dado otra respuesta', en: 'Gave a different answer' } },
};

export const nombreDe = id => ERRORES_PROPIOS[id]?.nombre ?? ERRORES_BASE[id]?.nombre ?? null;

// ─── Casos que no pueden salir ───────────────────────────────────────────────────────────────
// La hoja de la semana 2 está en papel y se excluye en claro; los casos del examen final, por
// huella FNV-1a calculada fuera del repositorio (el repositorio y GitHub Pages son públicos). Las
// claves llevan prefijo: «f:» la fracción del ej. 1 (irreducible, 'num/den'), «d:» el decimal del
// ej. 2 (su fracción irreducible). Nada de los exámenes semanales: no existen todavía.

export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
export const HUELLAS_EXAMEN = new Set(['8meqnf', 'cgh07s', '11rwipd', '1e4nfr5', '1q73dd2']);

// ej. 1 (hoja: ej. 1a, 2a y los ejemplos del recuadro de apoyo)
const FRACCIONES_HOJA = new Set(['2/5', '7/25', '19/20', '11/8', '9/40', '1/8', '4/9', '5/3', '1/6']);
// ej. 2 (hoja: ej. 5, y los ejemplos del recuadro de apoyo), por valor
const DECIMALES_HOJA = new Set(['0.15', '0.24', '0.004', '1.8', '4.5', '0.08', '0.36', '2.2']);
// ej. 4 (hoja: ej. 2b y 2c), por pareja fracción|decimal
const PAREJAS_HOJA = new Set(['3/4|0.82', '3/4|0.78', '4/5|0.82', '4/5|0.78', '4/9|0.44']);

const claveFracc = f => { const x = Fr(f).simplificar(); return `${x.num}/${x.den}`; };
const claveDec = d => String(D(d).normalizar().toString()).replace(',', '.');

export const esFraccionReservada = f => FRACCIONES_HOJA.has(claveFracc(f)) || HUELLAS_EXAMEN.has(huella(`f:${claveFracc(f)}`));
export const esDecimalReservado = d => {
  const f = decimalAFraccion(D(d));
  return DECIMALES_HOJA.has(claveDec(d)) || HUELLAS_EXAMEN.has(huella(`d:${f.num}/${f.den}`));
};
export const esParejaReservada = (f, d) => PAREJAS_HOJA.has(`${claveFracc(f)}|${claveDec(d)}`);

// ─── Fracciones y decimales de las listas ────────────────────────────────────────────────────

export const DEN_EXACTOS = [2, 4, 5, 8, 10, 20, 25, 40, 50];   // decimal exacto, hasta las milésimas
export const DEN_PERIODICOS = [3, 6, 9];                      // 0,333…  0,166…  0,111…

function fraccionDe(rng, dens, maxValor) {
  for (;;) {
    const q = rng.elegir(dens), p = rng.entero(1, Math.floor(maxValor * q));
    if (irreducible(p, q) && p !== q) return { num: p, den: q };
  }
}

/** Fracción irreducible con decimal exacto (3/4, 7/20, 9/8), de valor ≤ 3. */
export const fraccionExacta = (rng, maxValor = 3) => fraccionDe(rng, DEN_EXACTOS, maxValor);
/** Fracción irreducible cuyo decimal es periódico (1/3, 5/6, 7/9), de valor ≤ 2,5. */
export const fraccionPeriodica = (rng, maxValor = 2.5) => fraccionDe(rng, DEN_PERIODICOS, maxValor);

export const esExacta = f => deFraccion(Fr(f)) !== null;
/** El decimal exacto de la fracción, o null si es periódica. */
export const decimalDe = f => { const d = deFraccion(Fr(f)); return d ? datosD(d.normalizar()) : null; };
/** Las tres primeras cifras detrás de la coma del periódico (0,333…, 0,166…): lo que se enseña antes de «…». */
export const primerasCifras = f => datosD(dividir(f.num, f.den, 3).cociente);

// ─── Ejercicio 1: de fracción a decimal ──────────────────────────────────────────────────────

/** Los errores de «dividir» una fracción exacta, en orden fijo: [{ error, valor: Decimal|null }]. */
export function erroresFraccionADecimal(f) {
  const x = Fr(f), v = D(decimalDe(f)).normalizar();
  return [
    { error: 'fraccion-al-reves', valor: ERRORES_BASE['fraccion-al-reves'].fn(x) },
    { error: 'numerador-como-decimas', valor: ERRORES_BASE['numerador-como-decimas'].fn(x) },
    { error: 'denominador-como-decimas', valor: decimal(f.den, String(f.den).length) },
    { error: 'coma-corrida', valor: v.k >= 1 ? decimal(v.m, v.k - 1) : null },
  ];
}

/** Los errores de «dividir» una fracción periódica: 1/3 → 0,33; 0,3; 3; 0,13. */
export function erroresPeriodico(f) {
  const x = Fr(f), v = dividir(f.num, f.den, 3).cociente;
  return [
    { error: 'periodico-por-redondeo', valor: ERRORES_BASE['periodico-por-redondeo'].fn(x, 2) },
    { error: 'corta-el-periodico', valor: truncar(v, 1) },
    { error: 'fraccion-al-reves', valor: ERRORES_BASE['fraccion-al-reves'].fn(x) },
    { error: 'numerador-como-decimas', valor: ERRORES_BASE['numerador-como-decimas'].fn(x) },
  ];
}

/** Tres distractores (los primeros que sirven del montón barajado): sin null, de otro valor y de otro valor entre sí. */
function tresDistractores(rng, candidatos, correcta) {
  const buenos = [];
  for (const c of rng.barajar(candidatos)) {
    if (!c.valor || mismoValor(c.valor, correcta) || buenos.some(b => mismoValor(b.valor, c.valor))) continue;
    buenos.push(c);
  }
  return buenos.length >= 3 ? buenos.slice(0, 3) : null;
}

/**
 * { ejercicio: 1, tipo, f, … }
 *   'escribir'  f exacta; respuesta { m, k }
 *   'elegir'    f exacta; opciones [{ d, correcta, error }] ×4 (las cuatro con valor distinto)
 *   'tipo'      ¿exacto o periódico?; periodica: boolean (mitad y mitad)
 *   'periodico' f periódica; opciones [{ d, puntos, correcta, error }] ×4: solo la buena lleva «…»
 */
export function generarFraccionADecimal(rng) {
  for (;;) {
    const u = rng.azar();
    if (u < 0.75) {
      const f = fraccionExacta(rng);
      if (esFraccionReservada(f)) continue;
      const respuesta = decimalDe(f);
      if (u < 0.35) return { ejercicio: 1, tipo: 'escribir', f, respuesta };
      const malos = tresDistractores(rng, erroresFraccionADecimal(f), D(respuesta));
      if (!malos) continue;
      const opciones = rng.barajar([
        { d: respuesta, correcta: true, error: null },
        ...malos.map(m => ({ d: datosD(m.valor.normalizar()), correcta: false, error: m.error })),
      ]);
      return { ejercicio: 1, tipo: 'elegir', f, respuesta, opciones };
    }
    if (u < 0.88) {
      const periodica = rng.azar() < 0.5;
      const f = periodica ? fraccionPeriodica(rng) : fraccionExacta(rng);
      if (esFraccionReservada(f)) continue;
      return { ejercicio: 1, tipo: 'tipo', f, periodica, respuesta: periodica ? null : decimalDe(f) };
    }
    const f = fraccionPeriodica(rng);
    if (esFraccionReservada(f)) continue;
    const buena = primerasCifras(f);
    const malos = tresDistractores(rng, erroresPeriodico(f), D(buena));
    if (!malos) continue;
    const opciones = rng.barajar([
      { d: buena, puntos: true, correcta: true, error: null },
      ...malos.map(m => ({ d: datosD(m.valor.normalizar()), puntos: false, correcta: false, error: m.error })),
    ]);
    return { ejercicio: 1, tipo: 'periodico', f, opciones };
  }
}

/** Error típico de un decimal escrito para una fracción exacta (null si acertó). */
export function errorFraccionADecimal(item, valor) {
  if (valor.equals(D(item.respuesta))) return null;
  for (const c of erroresFraccionADecimal(item.f)) if (c.valor && c.valor.equals(valor)) return c.error;
  return 'otra-respuesta';
}

/** «¿Exacto o periódico?»: null si acertó. `dijo` es 'exacto' o 'periodico'. */
export const errorTipo = (item, dijo) => (item.periodica === (dijo === 'periodico') ? null : (item.periodica ? 'periodico-por-exacto' : 'exacto-por-periodico'));

// ─── Ejercicio 2: de decimal a fracción ──────────────────────────────────────────────────────

/** Los errores típicos como fracciones { num, den } (o null si dan lo mismo que la respuesta o no se aplican). */
export function erroresDecimalAFraccion(d) {
  const x = D(d), buena = decimalAFraccion(x), sinSimp = aFraccionDecimal(x);
  const lista = [];
  // Sin simplificar: vale lo mismo que la buena y solo es distractor porque el enunciado pide la irreducible (acta, punto k).
  lista.push({ error: 'sin-simplificar', fraccion: sinSimp.num === buena.num && sinSimp.den === buena.den ? null : datosF(sinSimp) });
  const equivocado = ERRORES_BASE['denominador-equivocado'].fn(x);
  lista.push({ error: 'denominador-equivocado', fraccion: equivocado ? datosF(equivocado.simplificar()) : null });
  lista.push({ error: 'un-cero-de-mas', fraccion: datosF(fraccion(x.m, 10 ** (x.k + 1)).simplificar()) });
  lista.push({ error: 'fraccion-inversa', fraccion: buena.num === buena.den ? null : datosF(fraccion(buena.den, buena.num)) });
  const decimales = Math.abs(x.m) % 10 ** x.k;
  lista.push({ error: 'olvida-parte-entera', fraccion: x.m >= 10 ** x.k && decimales > 0 ? datosF(fraccion(decimales, 10 ** x.k).simplificar()) : null });
  return lista;
}

const mismaFraccion = (a, b) => Fr(a).equals(Fr(b));

/**
 * { ejercicio: 2, tipo: 'elegir'|'escribir', d, respuesta: { num, den }, opciones? }
 * El decimal tiene de 1 a 3 cifras decimales, es < 5 y no termina en 0. En 'elegir' hay cuatro
 * fracciones; a lo sumo una (la «sin simplificar») vale lo mismo que la buena, y las demás son todas
 * de valores distintos.
 */
export function generarDecimalAFraccion(rng) {
  for (;;) {
    const k = rng.elegir([1, 1, 2, 2, 2, 3]);
    const parte = rng.entero(1, 10 ** k - 1);
    if (parte % 10 === 0 || (k === 3 && mcd(parte, 1000) < 2)) continue;
    const entera = rng.azar() < 0.3 ? rng.entero(1, 4) : 0;
    const d = { m: entera * 10 ** k + parte, k };
    if (esDecimalReservado(d)) continue;
    const buena = datosF(decimalAFraccion(D(d)));
    if (rng.azar() < 0.45) return { ejercicio: 2, tipo: 'escribir', d, respuesta: buena };
    const candidatos = rng.barajar(erroresDecimalAFraccion(d)).filter(c => c.fraccion);
    const malos = [];
    for (const c of candidatos) {
      const igualBuena = mismaFraccion(c.fraccion, buena);
      if (igualBuena && c.error !== 'sin-simplificar') continue;
      if (malos.some(m => mismaFraccion(m.fraccion, c.fraccion))) continue;
      malos.push(c);
    }
    if (malos.length < 3) continue;
    const opciones = rng.barajar([
      { f: buena, correcta: true, error: null },
      ...malos.slice(0, 3).map(m => ({ f: m.fraccion, correcta: false, error: m.error })),
    ]);
    return { ejercicio: 2, tipo: 'elegir', d, respuesta: buena, opciones };
  }
}

/** Error típico de una fracción escrita (num, den) para un decimal; null si es la irreducible. */
export function errorDecimalAFraccion(item, num, den) {
  const buena = item.respuesta;
  if (num === buena.num && den === buena.den) return null;
  if (!Number.isInteger(num) || !Number.isInteger(den) || num < 0 || den < 1) return 'otra-respuesta';
  const f = { num, den };
  if (mismaFraccion(f, buena)) return 'sin-simplificar';
  for (const c of erroresDecimalAFraccion(item.d)) if (c.fraccion && c.error !== 'sin-simplificar' && mismaFraccion(c.fraccion, f)) return c.error;
  return 'otra-respuesta';
}

// ─── Ejercicio 3: los que hay que saberse ────────────────────────────────────────────────────

/** Los de memoria del acta (U5-2C-09): 1/2, 1/4, 3/4, 1/5, 1/10 y 1/100. */
export const MEMORIA = [[1, 2], [1, 4], [3, 4], [1, 5], [1, 10], [1, 100]];
/** Otros que pueden salir (no son «de memoria»). Sin 2/5 (es un caso de la hoja). */
export const EXTRAS = [[1, 8], [3, 8], [5, 8], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10], [1, 20], [7, 20], [1, 25], [1, 50]];

/**
 * { ejercicio: 3, fracciones: [{ num, den } ×6], decimales: [{ m, k } ×6], solucion: [j de cada i] }
 * Entre 3 y 5 de memoria y el resto de EXTRAS (así nunca es exactamente el ejercicio de la hoja);
 * seis valores distintos; las fracciones y los decimales, cada uno en su orden al azar.
 */
export function generarParejas(rng) {
  const elegidas = [...rng.barajar(MEMORIA).slice(0, rng.entero(3, 5))];
  elegidas.push(...rng.barajar(EXTRAS).slice(0, 6 - elegidas.length));
  const pares = elegidas.map(([num, den]) => ({ f: { num, den }, d: datosD(deFraccion(fraccion(num, den)).normalizar()) }));
  const fracciones = rng.barajar(pares), decimales = rng.barajar(pares);
  return {
    ejercicio: 3,
    fracciones: fracciones.map(p => p.f),
    decimales: decimales.map(p => p.d),
    solucion: fracciones.map(p => decimales.indexOf(p)),
  };
}

/** Error de una pareja mal hecha: la fracción i emparejada con el decimal j (que no es el suyo). */
export function errorPareja(item, i, j) {
  const f = item.fracciones[i], elegido = D(item.decimales[j]), bueno = D(item.decimales[item.solucion[i]]);
  if (elegido.equals(decimal(f.den, String(f.den).length))) return 'denominador-como-decimas';
  const v = bueno.normalizar();
  if (elegido.equals(decimal(v.m, v.k + 1)) || elegido.equals(decimal(v.m, Math.max(v.k - 1, 0)))) return 'decimas-por-centesimas';
  return 'otra-pareja';
}

/**
 * Corrige el emparejamiento: `asignacion[i]` es el decimal (índice) que el alumno ha puesto a la fracción i.
 * → { acierto, estados: ['bien'|'mal' ×6], error: el de la primera mal hecha | null, malas: [i…] }
 */
export function evaluarParejas(item, asignacion) {
  const estados = item.solucion.map((j, i) => (asignacion[i] === j ? 'bien' : 'mal'));
  const malas = estados.map((e, i) => (e === 'mal' ? i : null)).filter(i => i !== null);
  const error = malas.length ? errorPareja(item, malas[0], asignacion[malas[0]]) : null;
  return { acierto: malas.length === 0, estados, error, malas };
}

// ─── Ejercicio 4: ¿fracción o decimal? ───────────────────────────────────────────────────────

/**
 * { ejercicio: 4, tipo: 'distinto'|'igual'|'periodico', f, d, orden: 'fd'|'df', respuesta: '<'|'='|'>' }
 * `respuesta` compara lo que se ve a la izquierda con lo que se ve a la derecha (según `orden`).
 *   igual      1/4 y 0,25: el mismo número (solo exactas)
 *   periodico  2/3 y 0,67 o 0,7: el decimal es el redondeo o está cerca, nunca igual
 *   distinto   una exacta y un decimal cercano (de 1 o 2 cifras), a 1 o 2 unidades de la última cifra
 */
export function generarFraccionODecimal(rng) {
  for (;;) {
    const u = rng.azar();
    let f, d, tipo;
    if (u < 0.17) {
      tipo = 'igual';
      f = fraccionExacta(rng);
      d = decimalDe(f);
    } else if (u < 0.40) {
      tipo = 'periodico';
      f = fraccionPeriodica(rng);
      const v = dividir(f.num, f.den, 4).cociente;
      const x = u < 0.30 ? redondear(v, 2) : (rng.azar() < 0.5 ? redondear(v, 1) : truncar(v, 1));
      d = datosD(x.normalizar());
    } else {
      tipo = 'distinto';
      f = fraccionExacta(rng);
      const k = rng.elegir([1, 1, 2]);
      const base = redondear(D(decimalDe(f)), k);
      const delta = rng.elegir([-2, -1, 1, 2]);
      d = { m: base.m + delta, k };
      if (d.m <= 0 || d.m % 10 === 0 || comparar(Fr(f), D(d)) === 0) continue;
    }
    if (D(d).m <= 0 || D(d).m / 10 ** D(d).k > 3.6 || esParejaReservada(f, d)) continue;
    const orden = rng.azar() < 0.5 ? 'fd' : 'df';
    const c = comparar(Fr(f), D(d));
    return { ejercicio: 4, tipo, f, d, orden, respuesta: signoDe(orden === 'fd' ? c : -c) };
  }
}

/** Lo que diría el alumno si cometiera cada error, como signo '<', '=' o '>' según el orden en que se ve el ítem. */
export function signosDeErrores(item) {
  const x = Fr(item.f), v = D(item.d), s = c => signoDe(item.orden === 'fd' ? c : -c);
  const salida = {};
  if (v.m >= 0 && v.m < 10 ** v.k) salida['numerador-contra-decimas'] = s(Math.sign(item.f.num - v.m));
  if (item.f.num > 0) salida['fraccion-al-reves'] = s(comparar(ERRORES_BASE['fraccion-al-reves'].fn(x) ?? x, v));
  if (item.tipo === 'periodico') salida['periodico-por-redondeo'] = '=';
  return salida;
}

/** Error típico del signo elegido (null si acertó). */
export function errorSigno(item, signo) {
  if (signo === item.respuesta) return null;
  if (item.tipo === 'igual') return 'no-ve-que-son-iguales';
  if (item.tipo === 'periodico' && signo === '=' ) return 'periodico-por-redondeo';
  const posibles = signosDeErrores(item);
  for (const id of ['numerador-contra-decimas', 'fraccion-al-reves']) if (posibles[id] === signo) return id;
  return 'otra-respuesta';
}

// ─── Claves (la base no repite el ítem anterior) ─────────────────────────────────────────────

export function claveDe(item) {
  if (item.ejercicio === 3) return `3:${item.fracciones.map(f => `${f.num}/${f.den}`).sort().join(',')}`;
  const base = [item.ejercicio, item.tipo, item.f ? `${item.f.num}/${item.f.den}` : '', item.d ? `${item.d.m}e${item.d.k}` : ''];
  if (item.ejercicio === 1 && item.tipo === 'tipo') base.push(item.periodica);
  if (item.ejercicio === 4) base.push(item.orden);
  return base.join('|');
}

export { hayIguales, mismaFraccion };
