// Práctica «Lee y escribe decimales» de la unidad 5 (Decimals): lógica pura (sin DOM ni red).
// Cuatro ejercicios:
//   1. Léelo               un decimal y cuatro lecturas, o una lectura y cuatro decimales (en el idioma del ítem)
//   2. ¿Qué vale la cifra? el valor de una cifra marcada, o la descomposición de un decimal
//   3. La fracción decimal de un decimal (sin simplificar) y, al revés, el decimal de una fracción decimal
//   4. En la recta         tocar la marca de un decimal, o escribir el que marca un punto
//
// Un ítem es DATOS (decimales como { m, k } = m / 10^k; nunca HTML ni funciones): la base vuelve a
// montar el mismo ítem al cambiar de idioma. Toda la aritmética es de enteros escalados
// (`../_comun/decimales.js`), nunca `Number` con coma flotante. Cada distractor sale de un error
// típico con nombre (ERRORES de aquí o ERRORES_TIPICOS de la base), se calcula con los números del
// ítem y vale algo distinto de la respuesta buena y de los demás: 0,5 y 0,50, o 3/4 y 75/100, nunca
// se enfrentan.
//
// Destrezas (ids del inventario aprobado el 3-11): U5-1B-01 (leer en inglés), 1B-02 (leer en
// español), 1B-03 (escribir con cifras, también con ceros intermedios), 1B-04 (vocabulario de los
// órdenes), 1C-01 (valor de cada cifra), 1C-03 (descomponer), 1C-04 (fracción decimal sin
// simplificar) y 1C-06 (la recta). Todas son de la sesión 1.
//
// Casos que no salen nunca: los de la hoja 1 de la unidad 5 (en claro, abajo) y los del examen de
// la semana 1 (por huella FNV-1a: ver HUELLAS_EXAMEN; el 5-11 el examen aún no tenía fichero de
// casos, así que la lista está vacía y la tarea de publicación de la semana coteja).

import {
  Decimal, decimal, aTexto, deTexto, enPalabras, lecturasValidas, descomponer, ORDENES,
  aFraccionDecimal, sumar, hayIguales, mismoValor, comparar, restar, ERRORES_TIPICOS,
} from '../_comun/decimales.js';
import { fraccion } from '../_comun/fracciones.js';

// ─── Casos reservados ────────────────────────────────────────────────────────────────────

/** FNV-1a de 32 bits: los casos de examen no se escriben en claro (el repositorio y Pages son públicos). */
export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };

/** Decimales de la hoja 1 de la unidad 5 (hoja-unidad5-semana1.tex, ejercicios de leer, valor, fracción decimal y recta), en claro. */
const DE_LA_HOJA = [
  '8.263', '6.318', '0.04', '6.28', '0.07', '12.5', '9.304', '15.06', '2.005', '7.206', '6.25', '4.18', '0.7', '8.4', '0.06',
  '4.63', '0.009', '3.1', '0.17', '0.003', '5.2', '1.04', '6.3', '6.35', '0.9', '9.1', '7.2', '7.4', '7.6', '7.75', '7.9',
];

/** Valor canónico (sin ceros finales, punto inglés): la clave de un caso reservado. */
const clave = d => aTexto(d.normalizar(), 'en');
export const CASOS_DE_LA_HOJA = new Set(DE_LA_HOJA.map(t => clave(deTexto(t))));
/** Huellas (huella(clave del decimal)) de los casos del examen de la semana 1. Vacío mientras no exista su fichero de casos. */
export const HUELLAS_EXAMEN = new Set([]);

/** ¿Es un caso de la hoja o del examen? Por valor: 6,3 y 6,30 son el mismo caso. */
export const esReservado = d => CASOS_DE_LA_HOJA.has(clave(d)) || HUELLAS_EXAMEN.has(huella(clave(d)));

// ─── Errores propios (los de la base están en ERRORES_TIPICOS) ───────────────────────────

export const ERRORES = {
  // Ejercicio 1
  'coma-mal-colocada': { nombre: { es: 'Ha colocado la coma en otro sitio', en: 'Put the decimal point in the wrong place' } },
  'lee-sin-coma': { nombre: { es: 'Ha leído el número sin la coma, como un natural', en: 'Read the number without the point, as a whole number' } },
  'cifras-intercambiadas': { nombre: { es: 'Ha cambiado el orden de dos cifras', en: 'Swapped the order of two digits' } },
  'cero-saltado': { nombre: { es: 'Se ha saltado el 0 de en medio', en: 'Skipped the zero in the middle' } },
  // Ejercicio 2
  'orden-contiguo': { nombre: { es: 'Ha confundido el orden con el de al lado (décimas por centésimas, o unidades por decenas)', en: 'Mixed up the place with the one next to it (tenths and hundredths, or units and tens)' } },
  'orden-lejano': { nombre: { es: 'Ha confundido el orden con otro mucho mayor o menor', en: 'Mixed up the place with one much bigger or smaller' } },
  'cifra-como-natural': { nombre: { es: 'Ha dado la cifra sola, como si valiera lo mismo en cualquier orden', en: 'Gave the digit on its own, as if it were worth the same in every place' } },
  'cifras-sin-orden': { nombre: { es: 'Ha puesto todas las cifras decimales como décimas', en: 'Wrote all the decimal digits as tenths' } },
  'un-orden-de-menos': { nombre: { es: 'Ha puesto cada cifra decimal un orden más abajo', en: 'Put every decimal digit one place lower' } },
  'un-orden-de-mas': { nombre: { es: 'Ha puesto cada cifra decimal un orden más arriba', en: 'Put every decimal digit one place higher' } },
  // Ejercicio 3
  'denominador-con-un-cero-de-mas': { nombre: { es: 'Ha puesto un cero de más en el denominador', en: 'Put one zero too many in the denominator' } },
  'solo-la-parte-decimal': { nombre: { es: 'Se ha olvidado de la parte entera', en: 'Forgot the whole part' } },
  'entero-sobre-decimales': { nombre: { es: 'Ha puesto la parte entera sobre la parte decimal', en: 'Put the whole part over the decimal part' } },
  'cuenta-mal-los-ceros': { nombre: { es: 'Ha puesto la coma contando mal los ceros del denominador', en: 'Put the decimal point in the wrong place, counting the zeros of the denominator wrongly' } },
  // Ejercicio 4
  'cuenta-marcas-en-vez-de-huecos': { nombre: { es: 'Ha contado marcas en vez de huecos', en: 'Counted marks instead of gaps' } },
  'recta-otro-lugar': { nombre: { es: 'Ha leído otra marca de la recta', en: 'Read another mark on the number line' } },
};

/** Nombre {es, en} de cualquier error de la práctica. */
export const nombreDe = id => (ERRORES[id] ?? ERRORES_TIPICOS[id])?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

// ─── Utilidades ──────────────────────────────────────────────────────────────────────────

/** { m, k } ↔ Decimal. Los ítems guardan lo primero. */
export const P = d => ({ m: d.m, k: d.k });
export const D = p => decimal(p.m, p.k);

/** Hasta tres cifras decimales: las milésimas (acta del 3-11). */
export const MAX_CIFRAS = 3;

const digitos = d => String(Math.abs(d.m)).padStart(d.k + 1, '0');
const parteEntera = d => digitos(d).slice(0, digitos(d).length - d.k);
const parteDecimal = d => digitos(d).slice(digitos(d).length - d.k);
const desdeTexto = (entera, dec) => decimal(Number(entera + dec), dec.length);

/**
 * Un decimal con 1-3 cifras decimales que no acaba en 0. Con `enteraMax` > 0 la parte entera es 0
 * (un tercio de las veces: «nought point…») o de 1 a `enteraMax`. Una de cada tres veces, con un 0 en
 * medio (2,05; 0,308), que es lo que más falla.
 */
export function decimalAleatorio(rng, { enteraMax = 99, cifras = [1, 2, 3], cero = 0.3 } = {}) {
  const k = rng.elegir(cifras);
  const entera = rng.azar() < 1 / 3 ? 0 : rng.entero(1, enteraMax);
  let dec = '';
  for (let i = 0; i < k; i++) {
    const ultima = i === k - 1;
    dec += ultima ? rng.entero(1, 9) : (rng.azar() < cero ? 0 : rng.entero(1, 9));
  }
  return desdeTexto(String(entera), dec);
}

// ─── Ejercicio 1 · Léelo ─────────────────────────────────────────────────────────────────

/** Una cifra de más o de menos: las candidatas a distractor de un decimal, con su error (valor distinto del de d). */
function candidatosLectura(d, rng) {
  const lista = [];
  const entera = parteEntera(d), dec = parteDecimal(d);
  // La coma, un lugar a la derecha (3,75 → 37,5) o dos.
  for (const n of [1, 2]) if (d.k - n >= 0) lista.push({ valor: new Decimal(d.m, d.k - n), error: n === 1 ? 'decimas-por-centesimas' : 'coma-mal-colocada' });
  // La coma, a la izquierda (3,75 → 0,375): solo mientras no pase de las milésimas.
  for (const n of [1, 2]) if (d.k + n <= MAX_CIFRAS) lista.push({ valor: new Decimal(d.m, d.k + n), error: 'coma-mal-colocada' });
  // Sin coma (375).
  lista.push({ valor: new Decimal(d.m, 0), error: 'lee-sin-coma' });
  // Dos cifras seguidas cambiadas de sitio (3,57; 7,35).
  const todas = entera + dec;
  const pares = [];
  for (let i = entera === '0' ? 1 : 0; i < todas.length - 1; i++) {
    if (todas[i] === todas[i + 1]) continue;
    const t = todas.slice(0, i) + todas[i + 1] + todas[i] + todas.slice(i + 2);
    const e = t.slice(0, entera.length), r = t.slice(entera.length);
    if (e.length > 1 && e[0] === '0') continue;
    if (r.endsWith('0')) continue;
    pares.push(desdeTexto(e, r));
  }
  if (pares.length) lista.push({ valor: rng.elegir(pares), error: 'cifras-intercambiadas' });
  // El 0 de en medio, saltado (2,05 → 2,5).
  if (dec.slice(0, -1).includes('0')) {
    const r = dec.replace('0', '');
    if (r.length) lista.push({ valor: desdeTexto(entera, r), error: 'cero-saltado' });
  }
  return lista;
}

/** Tres distractores de un decimal: [{ valor: Decimal, error }], sin repetir valor ni valer lo mismo que d. */
export function distractoresDeDecimal(d, rng) {
  const vistos = [d];
  const salida = [];
  for (const c of rng.barajar(candidatosLectura(d, rng))) {
    if (vistos.some(v => mismoValor(v, c.valor))) continue;
    vistos.push(c.valor);
    salida.push(c);
    if (salida.length === 3) break;
  }
  return salida;
}

/** Una lectura buena de d (varias valen: nunca se enfrentan). En inglés, solo la canónica (nought point…). */
const lecturaBuena = (d, idioma, rng) => {
  if (idioma === 'en') return enPalabras(d, 'en');
  // Sin «cero unidades y…»: con parte entera 0 se lee «doscientas dos milésimas» o «cero coma doscientos dos».
  return rng.elegir(lecturasValidas(d, 'es').filter(l => !l.startsWith('cero unidades')));
};

/**
 * Ítem del ejercicio 1: { sentido: 'lectura' | 'cifras', idioma, d, lectura, opciones }.
 *   'lectura'  se ve el decimal; las opciones son lecturas ({ texto }) y una es la buena.
 *   'cifras'   se ve la lectura (`lectura`); las opciones son decimales ({ valor }).
 * Cada opción: { texto?, valor, correcta, error } con la opción buena marcada.
 */
export function generarLeelo(rng, sesion = {}) {
  const idioma = sesion.idioma ?? 'en';
  for (let intento = 0; intento < 100; intento++) {
    const d = decimalAleatorio(rng);
    if (esReservado(d)) continue;
    const falsas = distractoresDeDecimal(d, rng);
    if (falsas.length < 3) continue;
    const sentido = rng.azar() < 0.5 ? 'lectura' : 'cifras';
    const buena = lecturaBuena(d, idioma, rng);
    const todas = [{ valor: P(d), correcta: true, error: null }, ...falsas.map(f => ({ valor: P(f.valor), correcta: false, error: f.error }))];
    const opciones = rng.barajar(todas).map(o => (sentido === 'lectura'
      ? { ...o, texto: o.correcta ? buena : enPalabras(D(o.valor), idioma) }
      : o));
    return { sentido, idioma, d: P(d), lectura: buena, opciones };
  }
  throw new Error('generarLeelo: no sale ningún ítem');
}

// ─── Ejercicio 2 · ¿Qué vale esta cifra? ─────────────────────────────────────────────────

/** Las cifras de d con su orden: [{ cifra, exponente, valor: Decimal }] (de la más alta a la última de la escritura). */
export const cifrasDe = d => descomponer(d);

/** La cifra `c` en el orden de exponente `x` (0 = unidades, −1 = décimas, 2 = centenas): 7 en −2 → 0,07. */
const valorEn = (c, x) => (x >= 0 ? new Decimal(c * 10 ** x, 0) : new Decimal(c, -x));

/** Ítem 'valor': una cifra marcada de un decimal con 1-3 cifras decimales; cuatro valores posibles. */
function generarValor(rng) {
  for (let intento = 0; intento < 100; intento++) {
    const d = decimalAleatorio(rng, { enteraMax: 99, cifras: [2, 3] });
    if (esReservado(d)) continue;
    const todas = cifrasDe(d);
    const posibles = todas.map((t, i) => ({ ...t, i })).filter(t => t.cifra !== 0);
    const elegida = rng.elegir(posibles);
    const v = elegida.valor;
    // La misma cifra en otro orden: un lugar más arriba o más abajo (contiguo), o dos (lejano); y la cifra sola.
    const candidatos = [];
    for (const dx of [-2, -1, 1, 2]) {
      const x = elegida.exponente + dx;
      if (x < -MAX_CIFRAS || x > 3) continue;
      candidatos.push({ valor: valorEn(elegida.cifra, x), error: Math.abs(dx) === 1 ? 'orden-contiguo' : 'orden-lejano' });
    }
    if (elegida.exponente !== 0) candidatos.push({ valor: new Decimal(elegida.cifra, 0), error: 'cifra-como-natural' });
    const vistos = [v];
    const falsas = [];
    for (const c of rng.barajar(candidatos)) {
      if (vistos.some(x => mismoValor(x, c.valor))) continue;
      vistos.push(c.valor);
      falsas.push(c);
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    const opciones = rng.barajar([
      { valor: P(v), correcta: true, error: null },
      ...falsas.map(f => ({ valor: P(f.valor), correcta: false, error: f.error })),
    ]);
    return { tipo: 'valor', d: P(d), indice: elegida.i, cifra: elegida.cifra, exponente: elegida.exponente, opciones };
  }
  throw new Error('generarValor: no sale ningún ítem');
}

/** Los términos de la descomposición de d (solo cifras no nulas), cada uno con su valor. */
export const terminosDe = d => descomponer(d, { soloNoNulas: true }).map(t => t.valor);

/** La suma de una lista de Decimal, exacta. */
export const sumaDe = lista => lista.reduce((s, t) => sumar(s, t), decimal(0, 0));

/** Candidatas a descomposición equivocada de d (k ≥ 2): listas de Decimal. */
function descomposicionesFalsas(d) {
  const cs = cifrasDe(d);
  const enteras = cs.filter(c => c.exponente >= 0);
  const decs = cs.filter(c => c.exponente < 0);
  const lista = [];
  const armar = (ds, f) => [...enteras.filter(c => c.cifra !== 0).map(c => c.valor), ...ds.map((c, i) => f(c, i)).filter(x => x !== null)];
  const unidad = (cifra, exp) => (cifra === 0 ? null : decimal(cifra, -exp));
  // Las cifras decimales, al revés de orden (3,75 → 3 + 0,5 + 0,07).
  const rev = [...decs].reverse();
  lista.push({ error: 'cifras-intercambiadas', terminos: [...enteras.filter(c => c.cifra !== 0).map(c => c.valor), ...decs.map((c, i) => unidad(rev[i].cifra, c.exponente)).filter(Boolean)] });
  // Todas como décimas (3 + 0,7 + 0,5).
  lista.push({ error: 'cifras-sin-orden', terminos: armar(decs, c => unidad(c.cifra, -1)) });
  // Cifras sueltas, como naturales (3 + 7 + 5).
  lista.push({ error: 'cifra-como-natural', terminos: armar(decs, c => (c.cifra === 0 ? null : decimal(c.cifra, 0))) });
  // Un orden más abajo (3 + 0,07 + 0,005) y un orden más arriba (3 + 7 + 0,5).
  if (d.k + 1 <= MAX_CIFRAS) lista.push({ error: 'un-orden-de-menos', terminos: armar(decs, c => unidad(c.cifra, c.exponente - 1)) });
  lista.push({ error: 'un-orden-de-mas', terminos: armar(decs, c => unidad(c.cifra, c.exponente + 1)) });
  return lista.filter(c => c.terminos.length > 0);
}

/** Ítem 'suma': la descomposición buena de un decimal con 2-3 cifras decimales y tres falsas. */
function generarSuma(rng) {
  for (let intento = 0; intento < 100; intento++) {
    const d = decimalAleatorio(rng, { enteraMax: 9, cifras: [2, 3], cero: 0.2 });
    if (esReservado(d)) continue;
    const buena = terminosDe(d);
    if (buena.length < 2) continue;
    const vistos = [sumaDe(buena)];
    const falsas = [];
    for (const c of rng.barajar(descomposicionesFalsas(d))) {
      const total = sumaDe(c.terminos);
      if (vistos.some(x => mismoValor(x, total))) continue;
      vistos.push(total);
      falsas.push(c);
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    const opciones = rng.barajar([
      { terminos: buena.map(P), correcta: true, error: null },
      ...falsas.map(f => ({ terminos: f.terminos.map(P), correcta: false, error: f.error })),
    ]);
    return { tipo: 'suma', d: P(d), opciones };
  }
  throw new Error('generarSuma: no sale ningún ítem');
}

/** Ítem del ejercicio 2: mitad 'valor' y mitad 'suma'. */
export function generarCifra(rng) {
  return rng.azar() < 0.55 ? generarValor(rng) : generarSuma(rng);
}

/** Cómo se llama el orden de una cifra (exponente 0 = unidades, −1 = décimas…), en singular o plural. */
export const ordenDe = (exponente, idioma, cantidad = 2) => {
  const o = ORDENES[exponente];
  return cantidad === 1 ? o.singular[idioma] : o[idioma];
};

// ─── Ejercicio 3 · La fracción decimal ───────────────────────────────────────────────────

const f = (n, den) => ({ n, d: den });
export const Fr = x => fraccion(x.n, x.d);

/** Candidatas de fracción decimal equivocada de d (parte entera ≥ 1): [{ fr: {n, d}, error }]. */
function fraccionesFalsas(d) {
  const x = D(d);
  const entera = Number(parteEntera(x)), dec = parteDecimal(x);
  const den = 10 ** x.k;
  const lista = [];
  if (x.k >= 2) lista.push({ fr: f(x.m, den / 10), error: 'denominador-equivocado' });
  lista.push({ fr: f(x.m, den * 10), error: 'denominador-con-un-cero-de-mas' });
  if (entera >= 1) {
    lista.push({ fr: f(Number(dec), den), error: 'solo-la-parte-decimal' });
    lista.push({ fr: f(entera, Number(dec)), error: 'entero-sobre-decimales' });
  }
  return lista;
}

/** Ítem 'a-fraccion': de 3,75 a 375/100 (denominador 10, 100 o 1000, sin simplificar). */
function generarAFraccion(rng) {
  for (let intento = 0; intento < 100; intento++) {
    const d = decimalAleatorio(rng, { enteraMax: 20, cifras: [1, 2, 3], cero: 0.2 });
    if (Number(parteEntera(d)) < 1 || esReservado(d)) continue;
    const buena = aFraccionDecimal(d);
    const vistas = [buena];
    const falsas = [];
    for (const c of rng.barajar(fraccionesFalsas(P(d)))) {
      const fr = Fr(c.fr);
      if (vistas.some(v => mismoValor(v, fr))) continue;
      vistas.push(fr);
      falsas.push(c);
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    const opciones = rng.barajar([
      { fr: f(buena.num, buena.den), correcta: true, error: null },
      ...falsas.map(c => ({ fr: c.fr, correcta: false, error: c.error })),
    ]);
    return { sentido: 'a-fraccion', d: P(d), opciones };
  }
  throw new Error('generarAFraccion: no sale ningún ítem');
}

/** Ítem 'a-decimal': de 463/100 a 4,63. */
function generarADecimal(rng) {
  for (let intento = 0; intento < 100; intento++) {
    const j = rng.elegir([1, 1, 2, 2, 3]);
    const maximo = 10 ** (j + 2) - 1;
    const n = rng.entero(1, maximo);
    if (n % 10 === 0) continue;
    const d = decimal(n, j);
    if (esReservado(d)) continue;
    const candidatos = [];
    for (const salto of [-3, -2, -1, 1, 2]) {
      const k = j + salto;
      if (k < 0 || k > MAX_CIFRAS) continue;
      candidatos.push({ valor: new Decimal(n, k), error: 'cuenta-mal-los-ceros' });
    }
    const vistos = [d];
    const falsas = [];
    for (const c of rng.barajar(candidatos)) {
      if (vistos.some(v => mismoValor(v, c.valor))) continue;
      vistos.push(c.valor);
      falsas.push(c);
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    const opciones = rng.barajar([
      { valor: P(d), correcta: true, error: null },
      ...falsas.map(c => ({ valor: P(c.valor), correcta: false, error: c.error })),
    ]);
    return { sentido: 'a-decimal', fr: f(n, 10 ** j), d: P(d), opciones };
  }
  throw new Error('generarADecimal: no sale ningún ítem');
}

export function generarFraccionDecimal(rng) {
  return rng.azar() < 0.5 ? generarAFraccion(rng) : generarADecimal(rng);
}

// ─── Ejercicio 4 · En la recta ───────────────────────────────────────────────────────────

/** Cotas de la recta: de 0 a 29 en las décimas y de 0 a 9,9 en las centésimas (números pequeños, como en el cuaderno). */
export const COTAS_RECTA = { enteroMax: 29, enteroMaxCentesimas: 9 };

/**
 * Ítem del ejercicio 4: { sentido: 'tocar' | 'leer', idioma, cifras, desde, hasta, valor }.
 *   cifras 1: tramo entre dos naturales, marcas cada 0,1.  cifras 2: tramo entre dos décimas, marcas cada 0,01.
 *   'tocar' toca la marca de `valor`; 'leer' escribe el decimal que marca el punto.
 */
export function generarRecta(rng, sesion = {}) {
  const idioma = sesion.idioma ?? 'en';
  for (let intento = 0; intento < 100; intento++) {
    const cifras = rng.azar() < 0.5 ? 1 : 2;
    const desde = cifras === 1
      ? decimal(rng.entero(0, COTAS_RECTA.enteroMax), 0)
      : decimal(rng.entero(1, COTAS_RECTA.enteroMaxCentesimas * 10 - 1), 1);
    const hasta = cifras === 1 ? decimal(desde.m + 1, 0) : decimal(desde.m + 1, 1);
    const j = rng.entero(1, 9);
    const valor = cifras === 1 ? decimal(desde.m * 10 + j, 1) : decimal(desde.m * 10 + j, 2);
    if (esReservado(valor)) continue;
    const sentido = rng.azar() < 0.5 ? 'tocar' : 'leer';
    return { sentido, idioma, cifras, desde: P(desde), hasta: P(hasta), valor: P(valor), marcas: j };
  }
  throw new Error('generarRecta: no sale ningún ítem');
}

/** El paso de la recta (0,1 o 0,01) como Decimal. */
export const pasoDeRecta = item => decimal(1, item.cifras);

/** Cuántos huecos hay de `desde` a `valor` (un entero: las marcas de la recta son los extremos de los huecos). */
export function huecosHasta(item, valor) {
  const v = D(valor).conCifras(item.cifras);
  const a = D(item.desde).conCifras(item.cifras);
  return v === null ? null : v.m - a.m;
}

/** Corrige lo tocado: { acierto, error }. */
export function corregirToque(item, tocado) {
  const buena = D(item.valor);
  if (buena.equals(tocado)) return { acierto: true, error: null };
  const dif = huecosHasta(item, tocado) - huecosHasta(item, buena);
  return { acierto: false, error: Math.abs(dif) === 1 ? 'cuenta-marcas-en-vez-de-huecos' : 'recta-otro-lugar' };
}

/**
 * Corrige lo escrito (un Decimal ya leído con `deTexto`; null no llega aquí): { acierto, error }.
 * Se acepta por valor (2,7 = 2,70), no por escritura.
 */
export function corregirLeido(item, escrito) {
  const buena = D(item.valor);
  if (buena.equals(escrito)) return { acierto: true, error: null };
  // 2,7 leído como 2,07: la décima como centésima.
  if (item.cifras === 1 && escrito.equals(decimal(D(item.desde).m * 100 + item.marcas, 2))) return { acierto: false, error: 'decimas-por-centesimas' };
  const paso = pasoDeRecta(item);
  const mas = sumar(buena, paso), menos = restar(buena, paso);
  if (escrito.equals(mas) || escrito.equals(menos)) return { acierto: false, error: 'cuenta-marcas-en-vez-de-huecos' };
  return { acierto: false, error: 'recta-otro-lugar' };
}

// ─── Clave de ítem y comprobaciones comunes ──────────────────────────────────────────────

/** Qué identifica un ítem para no repetir el anterior. */
export const claveItem = item => JSON.stringify([item.sentido ?? item.tipo, item.d ?? item.valor, item.fr ?? null, item.cifras ?? null]);

/** Lee lo que teclea el alumno: coma o punto, en los dos idiomas. */
export const leerCampo = texto => deTexto(texto);

export { comparar, hayIguales };
