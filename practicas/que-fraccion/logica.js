// Práctica «¿Qué fracción es?» de la unidad 4 (Fractions): lógica pura (sin DOM ni red).
// Cuatro ejercicios de la semana 1:
//   1. Lee la figura           barra, pizza o cuadrícula con partes sombreadas → escribir la fracción
//   2. Sombrea la fracción     una fracción propia y una figura de n partes → tocar las que tocan
//   3. De la frase a la fracción   una parte de un grupo → elegir o escribir la fracción
//   4. Léela                   fracción → lectura, o lectura → fracción (en el idioma del ítem)
//
// Un ítem es DATOS (números y textos sueltos, nada de Fraccion: `fr()` los convierte).
// Todo distractor sale de un error típico con nombre (los de `fracciones.js` o los propios de
// aquí, `ERRORES_PROPIOS`), calculado con los números del ítem, y nunca vale lo mismo que la
// respuesta ni que otro distractor (por valor, con enteros).

import { Fraccion, fraccion, aFraccion, enPalabras, lecturasValidas, ordinalIngles, ERRORES_TIPICOS } from '../_comun/fracciones.js';

export const fr = ({ num, den }) => new Fraccion(num, den);
const plano = f => ({ num: f.num, den: f.den });

// ─── Errores propios (los demás están en ERRORES_TIPICOS de fracciones.js) ──────────

export const ERRORES_PROPIOS = {
  'terminos-al-reves': { nombre: { es: 'Ha puesto los términos al revés (el total arriba)', en: 'Wrote the terms the wrong way round (the whole on top)' } },
  'cuenta-todas-las-partes': { nombre: { es: 'Ha contado como denominador las partes de todas las figuras', en: 'Used the parts of all the figures as the denominator' } },
  'simplificada-sin-pedirlo': { nombre: { es: 'Ha dado una fracción equivalente cuando se pedía contar las partes', en: 'Gave an equivalent fraction when the task was to count the parts' } },
  'otra-fraccion': { nombre: { es: 'Ha dado otra fracción', en: 'Gave a different fraction' } },
  'solo-el-numerador': { nombre: { es: 'Ha sombreado tantas partes como dice el numerador, sin mirar el denominador de la figura', en: 'Shaded as many parts as the numerator says, ignoring the parts of the figure' } },
  'sombrea-el-resto': { nombre: { es: 'Ha sombreado las partes que sobran en vez de las que tocan', en: 'Shaded the parts that were left over instead of the ones asked for' } },
  'otra-cantidad': { nombre: { es: 'Ha sombreado otra cantidad de partes', en: 'Shaded a different number of parts' } },
  'la-parte-que-falta': { nombre: { es: 'Ha dado la fracción de los que no cumplen, no de los que sí', en: 'Gave the fraction of those who do not, not of those who do' } },
  'lee-con-cardinales': { nombre: { es: 'Ha leído el denominador como un número normal (tres cinco / three five)', en: 'Read the denominator as an ordinary number (three five)' } },
  'ordinal-en-el-numerador': { nombre: { es: 'Ha leído el numerador como ordinal y el denominador como número', en: 'Read the numerator as an ordinal and the denominator as a number' } },
  'otro-denominador': { nombre: { es: 'Ha leído otro denominador', en: 'Read a different denominator' } },
  'otro-numerador': { nombre: { es: 'Ha escrito otro numerador', en: 'Wrote a different numerator' } },
};

/** Nombre {es, en} de cualquier error de la práctica (los propios y los de fracciones.js). */
export function nombreDe(id) {
  return ERRORES_PROPIOS[id]?.nombre ?? ERRORES_TIPICOS[id]?.nombre ?? null;
}

// ─── Figuras ───────────────────────────────────────────────────────────────────────

const TIPOS_FIGURA = ['barra', 'pizza', 'cuadricula'];
// Cuadrículas con filas × columnas = partes (las partes que admite una cuadrícula sin ser una tira).
const CUADRICULAS = { 4: [2, 2], 6: [2, 3], 8: [2, 4], 9: [3, 3], 10: [2, 5], 12: [3, 4] };
export const PARTES_CUADRICULA = Object.keys(CUADRICULAS).map(Number);
export const PARTES_MAX = 12;
// Fracciones que ya se dieron en clase o se reservan para el examen/hoja: no salen en la práctica.
const RESERVADAS = new Set(['13/13', '17/5']);

function figuraConPartes(rng, tipo, partes) {
  if (tipo === 'cuadricula') {
    const [filas, columnas] = CUADRICULAS[partes];
    return { tipo, partes, filas, columnas };
  }
  return { tipo, partes };
}

function tipoParaPartes(rng, partes) {
  const tipos = TIPOS_FIGURA.filter(t => t !== 'cuadricula' || CUADRICULAS[partes]);
  return rng.elegir(tipos);
}

// ─── Ejercicio 1: lee la figura ────────────────────────────────────────────────────

/**
 * { ejercicio: 1, tipo, partes, filas?, columnas?, num, den, figuras, exacta }
 * `den` = partes de CADA figura; `num` = sombreadas en total (> den en las impropias, con
 * `figuras` = 2). `exacta`: la consigna pide contar las partes (sin simplificar); si no,
 * vale cualquier equivalente.
 */
export function generarLeeFigura(rng) {
  for (;;) {
    const impropia = rng.azar() < 0.25;
    const den = impropia ? rng.entero(2, 8) : rng.entero(2, PARTES_MAX);
    const num = impropia ? rng.entero(den, 2 * den - 1) : rng.entero(1, den - 1);
    if (RESERVADAS.has(`${num}/${den}`)) continue;
    const tipo = tipoParaPartes(rng, den);
    const figuras = Math.max(1, Math.ceil(num / den));
    const exacta = rng.azar() < 0.5;
    return { ejercicio: 1, ...figuraConPartes(rng, tipo, den), num, den, figuras, exacta };
  }
}

/** Error típico de lo que escribió el alumno en el ejercicio 1 (null si acertó). */
export function errorLeeFigura(item, escrita) {
  const f = aFraccion(escrita);
  const buena = fraccion(item.num, item.den);
  if (item.exacta ? f.mismaForma(buena) : f.equals(buena)) return null;
  if (item.exacta && f.equals(buena)) return 'simplificada-sin-pedirlo';
  if (item.num < item.den && f.mismaForma(fraccion(item.num, item.den - item.num))) return 'parte-entre-el-resto';
  if (f.mismaForma(fraccion(item.den, item.num))) return 'terminos-al-reves';
  if (item.figuras > 1 && f.mismaForma(fraccion(item.num, item.den * item.figuras))) return 'cuenta-todas-las-partes';
  return 'otra-fraccion';
}

// ─── Ejercicio 2: sombrea la fracción ──────────────────────────────────────────────

/**
 * { ejercicio: 2, tipo, partes, filas?, columnas?, num, den, objetivo }
 * Fracción propia e irreducible; las partes de la figura son un múltiplo del denominador
 * (`m` ≥ 1 veces) y `objetivo` = num · m.
 */
export function generarSombrea(rng) {
  for (;;) {
    const den = rng.entero(2, 6);
    const num = rng.entero(1, den - 1);
    if (aFraccion(fraccion(num, den)).simplificar().den !== den) continue;
    const m = rng.elegir([1, 1, 2, 2, 3].filter(k => den * k <= PARTES_MAX));
    const partes = den * m;
    const tipo = tipoParaPartes(rng, partes);
    return { ejercicio: 2, ...figuraConPartes(rng, tipo, partes), num, den, objetivo: num * m, m };
  }
}

/** Error típico de la cantidad de partes sombreadas en el ejercicio 2 (null si acertó). */
export function errorSombrea(item, sombreadas) {
  if (sombreadas === item.objetivo) return null;
  if (item.m > 1 && sombreadas === item.num) return 'solo-el-numerador';
  if (sombreadas === item.partes - item.objetivo) return 'sombrea-el-resto';
  return 'otra-cantidad';
}

// ─── Ejercicio 3: de la frase a la fracción ────────────────────────────────────────

// Contextos con su cota de realismo (regla de Juan Luis, 2026-10-16; cotas del acta del 26-10):
// una clase tiene 12-36 alumnos, una pizza o tarta de 3 a 15 trozos, un equipo 11-25, una caja
// 6-24. `frac`: qué parte del total puede ser la parte (para que «la mitad de la clase lleva
// gafas» no salga con 25 de 28): todas las partes de aquí abajo son creíbles.
export const CONTEXTOS = [
  {
    id: 'clase-gafas', min: 12, max: 36, frac: [0.15, 0.6],
    es: (n, k) => `En una clase de ${n} alumnos, ${k} llevan gafas.`,
    en: (n, k) => `In a class of ${n} students, ${k} wear glasses (gafas).`,
    pregunta: { es: '¿Qué fracción de la clase lleva gafas?', en: 'What fraction of the class wears glasses?' },
  },
  {
    id: 'clase-bici', min: 12, max: 36, frac: [0.1, 0.5],
    es: (n, k) => `De los ${n} alumnos de una clase, ${k} van al instituto en bici.`,
    en: (n, k) => `Of the ${n} students in a class, ${k} cycle (van en bici) to school.`,
    pregunta: { es: '¿Qué fracción de la clase va en bici?', en: 'What fraction of the class cycles to school?' },
  },
  {
    id: 'tarta', min: 3, max: 15, frac: [0.1, 0.9],
    es: (n, k) => `Una tarta está cortada en ${n} trozos iguales. Se han comido ${k}.`,
    en: (n, k) => `A cake is cut into ${n} equal slices. ${k} ${k === 1 ? 'has' : 'have'} been eaten.`,
    pregunta: { es: '¿Qué fracción de la tarta se ha comido?', en: 'What fraction of the cake has been eaten?' },
  },
  {
    id: 'equipo', min: 11, max: 25, frac: [0.15, 0.6],
    es: (n, k) => `Un equipo tiene ${n} jugadores y ${k} llevan la camiseta roja.`,
    en: (n, k) => `A team has ${n} players and ${k} wear a red shirt (camiseta roja).`,
    pregunta: { es: '¿Qué fracción de los jugadores lleva camiseta roja?', en: 'What fraction of the players wears a red shirt?' },
  },
  {
    id: 'caja', min: 6, max: 24, frac: [0.15, 0.85],
    es: (n, k) => `Una caja tiene ${n} bombones y ${k} son de chocolate negro.`,
    en: (n, k) => `A box has ${n} chocolates and ${k} ${k === 1 ? 'is' : 'are'} dark (negro).`,
    pregunta: { es: '¿Qué fracción de los bombones es de chocolate negro?', en: 'What fraction of the chocolates is dark?' },
  },
];

const MISMO_VALOR = (a, b) => aFraccion(a).equals(b);

/** Opciones del ejercicio 3: la buena y tres falsas de error típico, dos a dos no equivalentes. */
function opcionesFrase(rng, n, k) {
  const buena = { ...plano(fraccion(k, n)), correcta: true, error: null };
  const candidatos = [
    ['parte-entre-el-resto', fraccion(k, n - k)],        // 7/21: la parte entre lo que queda
    ['la-parte-que-falta', fraccion(n - k, n)],          // 21/28: los que no cumplen
    ['terminos-al-reves', fraccion(n, k)],               // 28/7: el total arriba
  ];
  const opciones = [buena];
  for (const [error, f] of candidatos) {
    if (opciones.some(o => MISMO_VALOR(o, f))) return null;
    opciones.push({ ...plano(f), correcta: false, error });
  }
  return rng.barajar(opciones);
}

/**
 * { ejercicio: 3, contexto, n, k, modo: 'elegir' | 'escribir', opciones? }
 * `n` = total del grupo, `k` = parte (1 ≤ k < n). La respuesta es k/n SIN simplificar (en la
 * sesión 1 todavía no se simplifica); en `escribir` vale cualquier equivalente.
 */
export function generarFrase(rng) {
  for (;;) {
    const c = rng.elegir(CONTEXTOS);
    const n = rng.entero(c.min, c.max);
    const k = rng.entero(Math.max(1, Math.ceil(n * c.frac[0])), Math.min(n - 1, Math.floor(n * c.frac[1])));
    if (k >= n || k < 1 || 2 * k === n) continue;
    if (n === 20 && k === 8) continue;   // el ejemplo de clase del inventario (8 de 20 con gafas)
    if (n === 30 && k === 12) continue;  // «2 de cada 5 de una clase de 30»
    const modo = rng.azar() < 0.6 ? 'elegir' : 'escribir';
    const item = { ejercicio: 3, contexto: c.id, n, k, modo };
    if (modo === 'elegir') {
      const opciones = opcionesFrase(rng, n, k);
      if (!opciones) continue;
      item.opciones = opciones;
    }
    return item;
  }
}

export const contextoDe = id => CONTEXTOS.find(c => c.id === id);

/** Error típico de lo que escribió el alumno en el ejercicio 3 (null si acertó). */
export function errorFrase(item, escrita) {
  const f = aFraccion(escrita);
  const buena = fraccion(item.k, item.n);
  if (f.equals(buena)) return null;
  if (f.mismaForma(fraccion(item.k, item.n - item.k))) return 'parte-entre-el-resto';
  if (f.mismaForma(fraccion(item.n - item.k, item.n))) return 'la-parte-que-falta';
  if (f.mismaForma(fraccion(item.n, item.k))) return 'terminos-al-reves';
  return 'otra-fraccion';
}

// ─── Ejercicio 4: léela ───────────────────────────────────────────────────────────

// Fracciones que no se usan en las lecturas: la 9/11 es de la hoja de la semana 1 (RESERVADOS).
const LECTURAS_RESERVADAS = new Set(['9/11']);
const ESPECIALES = [[1, 2], [1, 4], [3, 4]];

const normaliza = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-\s]+/g, ' ').trim();
const cardinal = (n, idioma) => enPalabras(fraccion(n, 1), idioma);

/** Cómo se lee n/d con los números «normales» (el error de leer el denominador como cardinal). */
function lecturaConCardinales(n, d, idioma) {
  return `${cardinal(n, idioma)} ${cardinal(d, idioma)}`;
}

/** Candidatos de lectura falsa para n/d: { texto, valor, error } con `valor` la fracción que dicen (o null). */
function candidatosLectura(n, d, idioma) {
  const lista = [
    { texto: lecturaConCardinales(n, d, idioma), valor: null, error: 'lee-con-cardinales' },
    { texto: enPalabras(fraccion(d, n), idioma), valor: fraccion(d, n), error: 'terminos-al-reves' },
  ];
  if (idioma === 'en') {
    // «third fives»: el ordinal en el numerador y el número en el denominador.
    lista.push({ texto: `${ordinalIngles(n)} ${cardinal(d, 'en')}s`, valor: null, error: 'ordinal-en-el-numerador' });
  }
  for (const dd of [d + 1, d - 1]) {
    if (dd >= 2 && dd <= PARTES_MAX) lista.push({ texto: enPalabras(fraccion(n, dd), idioma), valor: fraccion(n, dd), error: 'otro-denominador' });
  }
  return lista;
}

/** Tres lecturas falsas de n/d, sin ninguna lectura válida de n/d ni dos iguales ni dos que digan lo mismo. */
function lecturasFalsas(rng, n, d, idioma) {
  const buena = fraccion(n, d);
  const validas = new Set(lecturasValidas(buena, idioma).map(normaliza));
  const vistas = new Set(validas);
  const salida = [];
  // Primero los errores más típicos (cardinal, términos al revés, ordinal); el denominador vecino rellena.
  const lista = candidatosLectura(n, d, idioma);
  const principales = rng.barajar(lista.filter(c => c.error !== 'otro-denominador'));
  const vecinos = rng.barajar(lista.filter(c => c.error === 'otro-denominador'));
  for (const c of [...principales, ...vecinos]) {
    if (salida.length === 3) break;
    if (c.valor && c.valor.equals(buena)) continue;
    const t = normaliza(c.texto);
    // Ninguna lectura válida de otra fracción equivalente a la buena: el valor mandaría.
    if (vistas.has(t)) continue;
    vistas.add(t);
    salida.push(c);
  }
  return salida.length === 3 ? salida : null;
}

/** Tres fracciones falsas para una lectura de n/d (su error típico), no equivalentes entre sí ni a n/d. */
function fraccionesFalsas(rng, n, d) {
  const buena = fraccion(n, d);
  const candidatos = [
    ['terminos-al-reves', fraccion(d, n)],
    ['otro-denominador', fraccion(n, d + 1)],
    ['otro-denominador', fraccion(n, d - 1)],
    ['otro-numerador', fraccion(n + 1, d)],
    ['otro-numerador', fraccion(n - 1, d)],
  ].filter(([, f]) => f.den >= 2 && f.num >= 1 && f.den <= PARTES_MAX + 4);
  const principales = candidatos.filter(([e]) => e === 'terminos-al-reves');
  const otros = rng.barajar(candidatos.filter(([e]) => e !== 'terminos-al-reves'));
  const salida = [];
  for (const [error, f] of [...principales, ...otros]) {
    if (salida.length === 3) break;
    if (f.equals(buena) || salida.some(s => fr(s).equals(f))) continue;
    salida.push({ ...plano(f), error });
  }
  return salida.length === 3 ? salida : null;
}

/**
 * { ejercicio: 4, sentido: 'lectura' | 'fraccion', idioma, num, den, texto, opciones }
 * 'lectura': se enseña la fracción y se eligen entre cuatro lecturas (`opciones`: { texto, correcta, error });
 * 'fraccion': se enseña la lectura (`texto`) y se eligen entre cuatro fracciones. La lectura va en el idioma
 * del ítem (`sesion.idioma`): inglés con ordinales (three fifths) o español con partitivos (tres quintos).
 * Un tercio de los ítems son 1/2, 1/4 y 3/4 (a half, a quarter, three quarters).
 */
export function generarLee(rng, sesion = {}) {
  const idioma = sesion.idioma === 'en' ? 'en' : 'es';
  for (;;) {
    let num, den;
    if (rng.azar() < 1 / 3) {
      [num, den] = rng.elegir(ESPECIALES);
    } else {
      den = rng.entero(2, PARTES_MAX);
      num = rng.azar() < 0.15 ? rng.entero(den + 1, den + 5) : rng.entero(1, den - 1);
      if (den === 2 || den === 4) continue;           // 1/2, 1/4 y 3/4 ya salen en las especiales
    }
    if (LECTURAS_RESERVADAS.has(`${num}/${den}`)) continue;
    const sentido = rng.azar() < 0.5 ? 'lectura' : 'fraccion';
    const buena = fraccion(num, den);
    const texto = enPalabras(buena, idioma);
    let opciones;
    if (sentido === 'lectura') {
      const falsas = lecturasFalsas(rng, num, den, idioma);
      if (!falsas) continue;
      opciones = rng.barajar([
        { texto, correcta: true, error: null },
        ...falsas.map(f => ({ texto: f.texto, correcta: false, error: f.error })),
      ]);
    } else {
      const falsas = fraccionesFalsas(rng, num, den);
      if (!falsas) continue;
      opciones = rng.barajar([
        { ...plano(buena), correcta: true, error: null },
        ...falsas.map(f => ({ ...f, correcta: false })),
      ]);
    }
    return { ejercicio: 4, sentido, idioma, num, den, texto, opciones };
  }
}

export function claveDe(item) {
  switch (item.ejercicio) {
    case 1: return `1:${item.tipo}:${item.num}/${item.den}:${item.exacta ? 'e' : 'v'}`;
    case 2: return `2:${item.tipo}:${item.num}/${item.den}:${item.partes}`;
    case 3: return `3:${item.contexto}:${item.n}:${item.k}:${item.modo}`;
    default: return `4:${item.sentido}:${item.idioma}:${item.num}/${item.den}`;
  }
}
