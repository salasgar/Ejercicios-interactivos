// Práctica «Multiplica y divide decimales» de la unidad 5 (Decimals): lógica pura (sin DOM ni red).
// Seis ejercicios de la semana 2 (sesiones 5 y 6):
//   1. Coloca la coma    1,2 · 0,3 con el producto de enteros hecho; 3,2 · 0,01 y 0,56 : 0,1 (escribir o elegir)
//   2. Divide entre un natural    9,6 : 8; 7 : 4 (escribir o elegir)
//   3. Divide entre un decimal    7,5 : 0,25 → 750 : 25 (elegir la división equivalente o escribir el cociente)
//   4. ¿Está bien?       una división con dos decimales cortados y su resto: bien o mal
//   5. Problemas         fruta al peso y gasolina: importe, precio, litros y gasto de un viaje (escribir)
//   6. Combinadas        2,5 + 1,2 · 3; (2,5 + 1,5) · 0,3 (escribir o elegir)
//
// Un ítem es DATOS: decimales { m, k } (m / 10^k, entero escalado) y el dinero en céntimos enteros. Nada de
// `Number` con coma flotante: todo se calcula y se compara con `decimales.js`. Todo error lleva un nombre de
// `ERRORES_PROPIOS` (o de `ERRORES_TIPICOS` de la base) y se calcula con los números del ítem.

import {
  decimal, sumar, restar, multiplicar, dividir, comparar, porPotenciaDe10, redondear, truncar, mismoValor,
  deTexto, aTexto, ERRORES_TIPICOS as ERRORES_BASE,
} from '../_comun/decimales.js';

export const D = ({ m, k }) => decimal(m, k);
const datos = d => ({ m: d.m, k: d.k });
const datosN = d => datos(d.normalizar());
const pot = n => 10 ** n;
const claveDec = d => D(d).normalizar().toString().replace(',', '.');

// ─── Errores propios (los de la base, de `decimales.js`, se usan con su nombre) ───────────────

export const ERRORES_PROPIOS = {
  'coma-olvidada': { nombre: { es: 'Ha olvidado poner la coma en el resultado', en: 'Forgot the decimal point in the answer' } },
  'coma-corrida': { nombre: { es: 'Tiene las cifras bien, pero la coma mal puesta', en: 'Has the right digits but the decimal point in the wrong place' } },
  'coma-de-menos': { nombre: { es: 'Ha puesto una cifra decimal de menos', en: 'Put one decimal place too few' } },
  'coma-de-mas': { nombre: { es: 'Ha puesto una cifra decimal de más', en: 'Put one decimal place too many' } },
  'coma-al-reves': { nombre: { es: 'Ha movido la coma hacia el lado contrario', en: 'Moved the decimal point the wrong way' } },
  'coma-un-solo-lugar': { nombre: { es: 'Ha movido la coma un solo lugar', en: 'Moved the decimal point only one place' } },
  'cociente-entero': { nombre: { es: 'Ha parado en el resto: solo ha dado la parte entera del cociente', en: 'Stopped at the remainder: gave only the whole part of the quotient' } },
  'coma-solo-en-dividendo': { nombre: { es: 'Ha movido la coma solo en el dividendo', en: 'Moved the decimal point in the dividend only' } },
  'coma-distinto-numero-de-lugares': { nombre: { es: 'Ha movido la coma un número distinto de lugares en el dividendo y en el divisor', en: 'Moved the point a different number of places in the dividend and the divisor' } },
  'cociente-redondeado': { nombre: { es: 'Ha redondeado el cociente en vez de cortarlo', en: 'Rounded the quotient instead of cutting it off' } },
  'cociente-coma-corrida': { nombre: { es: 'Tiene el cociente con la coma mal puesta', en: 'The quotient has the decimal point in the wrong place' } },
  'da-por-mala-una-buena': { nombre: { es: 'Ha dado por mala una división bien hecha', en: 'Said a correct division was wrong' } },
  'quita-el-parentesis': { nombre: { es: 'Ha calculado como si no hubiera paréntesis', en: 'Worked it out as if there were no brackets' } },
  'izquierda-a-derecha': { nombre: { es: 'Ha operado de izquierda a derecha, sin la jerarquía', en: 'Worked from left to right, ignoring the order of operations' } },
  'suma-en-vez-de-multiplica': { nombre: { es: 'Ha sumado en lugar de multiplicar', en: 'Added instead of multiplying' } },
  'multiplica-en-vez-de-divide': { nombre: { es: 'Ha multiplicado en lugar de dividir', en: 'Multiplied instead of dividing' } },
  'da-el-total': { nombre: { es: 'Ha dado el total, sin repartirlo', en: 'Gave the total without sharing it out' } },
  'otra-respuesta': { nombre: { es: 'Ha dado otra respuesta', en: 'Gave a different answer' } },
};

export const nombreDe = id => ERRORES_PROPIOS[id]?.nombre ?? ERRORES_BASE[id]?.nombre ?? null;

// ─── Casos que no pueden salir ───────────────────────────────────────────────────────────────
// La hoja de la semana 2 está en papel y se excluye en claro (con los ejemplos de su recuadro y los del
// inventario); los casos del examen de la semana 2 y del final, por huella FNV-1a calculada fuera del
// repositorio (el repositorio y GitHub Pages son públicos). `HUELLAS_EXAMEN` lleva
// los 42 casos de productos, divisiones y combinadas del examen de la semana 2; el final de la U5 aún no existe.
// Claves con prefijo: «p:» un producto (sin importar el orden), «m:» un ×/÷ por 0,1…, «q:» una división,
// «c:» una combinada escrita con punto decimal.

export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
export const HUELLAS_EXAMEN = new Set([
  '1n6g2ga', 'qbuh7y', '1omcidn', '182ts7w', 'jawd1x', 'gahi7r', '13p1wzx', '12wty3q', '1w2wq22', 'pt4uoe', '1rjozct', '8fh8x9', 'wyqch', '1xfuydy', '15mj9b7', '11oxb27', '1hizosu', 'di4wdp', 't0op8n', 'z1qn9u', '1qgijyv', '102343', 'beywd5', '1046wts', '1kjo9r4', '14g0o53', '1tu4nu5', '1we2vby', '4khqjo', '237gjr', 'ugxqul', '15w0zvy', 'vw7qev', 'fsj79s', '1jumy80', '173a1df', 'bzmy3i', '1yfyre9', '17zhe7d', 'u8ibbo', 'zi3fu2', '1bpvo1u',
]);   // examen de la semana 2 (casos-examen-semana2.tsv, 2-11-2026); falta el examen final de la U5

const clave = (prefijo, texto) => `${prefijo}:${texto}`;
const claveProducto = (a, b) => clave('p', [claveDec(a), claveDec(b)].sort().join('*'));
const clavePotencia = (d, op, p) => clave('m', `${claveDec(d)}${op === 'por' ? '*' : ':'}0.${'0'.repeat(p - 1)}1`);
const claveDivision = (a, b) => clave('q', `${claveDec(a)}:${claveDec(b)}`);

const delTexto = t => deTexto(t);
const PRODUCTOS_HOJA = ['3.4*6', '0.15*7', '2.6*0.3', '1.25*0.8', '0.07*0.4', '4.3*2.1', '0.6*0.7', '3.9*2.1', '2.5*0.4', '2.3*0.4', '0.9*3.5',
  '1.2*0.3', '1.45*3', '2.5*1.4', '0.25*8', '12.03*40', '0.31*0.228', '2.5*1.2'].map(t => { const [a, b] = t.split('*'); return claveProducto(delTexto(a), delTexto(b)); });
const POTENCIAS_HOJA = [['56.2', 'por', 1], ['3.9', 'por', 2], ['840', 'por', 3], ['0.72', 'entre', 1], ['4.5', 'entre', 2], ['0.006', 'entre', 3],
  ['45.6', 'por', 2], ['0.38', 'entre', 1], ['2.7', 'por', 2], ['3.5', 'entre', 1], ['719.8', 'por', 3], ['0.56', 'entre', 1], ['3.2', 'por', 2]]
  .map(([d, op, p]) => clavePotencia(delTexto(d), op, p));
const DIVISIONES_HOJA = ['7.5:5', '0.84:7', '21.6:8', '0.045:5', '11:4', '17:5', '21:8', '23:6', '9.6:3', '5:4', '9:2', '7:4', '9.6:8', '5:8', '9:8', '10:3',
  '22.8:4', '8.4:4', '0.036:9', '3.6:0.4', '1.5:0.25', '7:0.05', '2.04:0.6', '0.3:0.012', '4.8:0.12', '2.7:0.09', '14.9:3', '8.15:0.7', '2.53:0.06',
  '3.1:0.6', '6.3:0.9', '8:0.25', '7.5:0.25', '3:0.5', '8.4:0.16', '0.56:0.025', '6:0.75', '6.384:0.49', '74.4:6', '0.72:0.1']
  .map(t => { const [a, b] = t.split(':'); return claveDivision(delTexto(a), delTexto(b)); });
const COMBINADAS_HOJA = ['3.5 + 4 · 0.25', '10 − 2.4 · 3', '7.2 : 4 + 1.3 · 2', '(6.4 − 2.9) · 0.2', '12 − 3 · (2.6 + 0.15)', '8 − 1.5 · 2',
  '5.02 + 200 · 0.087', '4.5 − 1.2 · 3', '(4.5 − 1.7) · 0.5', '10 − 2 · (3.5 − 1.25)', '2.5 + 1.2 · 3', '(2.5 + 1.5) · 0.3'].map(t => clave('c', t));
const RESERVADAS_HOJA = new Set([...PRODUCTOS_HOJA, ...POTENCIAS_HOJA, ...DIVISIONES_HOJA, ...COMBINADAS_HOJA]);

export const esReservada = k => RESERVADAS_HOJA.has(k) || HUELLAS_EXAMEN.has(huella(k));
export const esProductoReservado = (a, b) => esReservada(claveProducto(a, b));
export const esPotenciaReservada = (d, op, p) => esReservada(clavePotencia(d, op, p));
export const esDivisionReservada = (a, b) => esReservada(claveDivision(a, b));

// ─── Piezas comunes ──────────────────────────────────────────────────────────────────────────

/** Un decimal sin cero final (los naturales no tienen), de 0 < valor ≤ tope, con entre kMin y kMax cifras decimales. */
function numero(rng, kMin, kMax, tope) {
  const k = rng.entero(kMin, kMax);
  for (;;) {
    const m = rng.entero(1, tope * pot(k));
    if (k === 0 || m % 10 !== 0) return { m, k };
  }
}

/** Solo los candidatos que valen algo distinto de la correcta y entre sí, y más de 0. */
function buenos(candidatos, correcta) {
  const salida = [];
  for (const c of candidatos) {
    if (!c.valor || c.valor.m <= 0 || mismoValor(c.valor, correcta) || salida.some(b => mismoValor(b.valor, c.valor))) continue;
    salida.push(c);
  }
  return salida;
}

/** Cuatro opciones barajadas (la buena y tres falsas de errores con nombre), o null si no hay tres. */
function opcionesDe(rng, candidatos, correcta) {
  const tres = rng.barajar(buenos(candidatos, correcta)).slice(0, 3);
  if (tres.length < 3) return null;
  return rng.barajar([
    { d: datosN(correcta), correcta: true, error: null },
    ...tres.map(c => ({ d: datosN(c.valor), correcta: false, error: c.error })),
  ]);
}

/** El nombre del error de lo que ha escrito el alumno (null si acierta). */
function clasificar(candidatos, correcta, valor) {
  if (mismoValor(valor, correcta)) return null;
  return candidatos.find(c => c.valor && mismoValor(c.valor, valor))?.error ?? 'otra-respuesta';
}

const desplazada = (r, n) => porPotenciaDe10(r, n);
/** La coma un lugar a un lado o a otro: las cifras bien y la coma mal. */
const comaCorrida = r => [
  { error: 'coma-corrida', valor: desplazada(r, -1) },
  { error: 'coma-corrida', valor: r.k >= 1 ? desplazada(r, 1) : null },
];

// ─── Ejercicio 1: coloca la coma ─────────────────────────────────────────────────────────────

export function candidatosComa(item) {
  if (item.forma === 'potencia') {
    const d = D(item.d), p = item.p, sentido = item.op === 'por' ? -1 : 1;   // por 0,1: la coma va a la izquierda
    return [
      { error: 'coma-al-reves', valor: porPotenciaDe10(d, -sentido * p) },
      { error: 'coma-un-solo-lugar', valor: p >= 2 ? porPotenciaDe10(d, sentido) : null },
      { error: 'coma-de-mas', valor: porPotenciaDe10(d, sentido * (p + 1)) },
    ];
  }
  const x = D(item.a), y = D(item.b), r = D(item.resultado);
  return [
    { error: 'coma-mal-puesta', valor: ERRORES_BASE['coma-mal-puesta'].fn(x, y) },
    { error: 'coma-olvidada', valor: r.k > 0 ? decimal(r.m, 0) : null },
    { error: 'coma-de-menos', valor: r.k >= 1 ? decimal(r.m, r.k - 1) : null },
    { error: 'coma-de-mas', valor: decimal(r.m, r.k + 1) },
  ];
}

function itemProducto(rng, tipo) {
  const a = numero(rng, 1, 2, 12);
  const b = rng.azar() < 0.35 ? { m: rng.entero(2, 9), k: 0 } : numero(rng, 1, 2, 9);
  const r = multiplicar(D(a), D(b));
  if (r.k > 4 || r.m % 10 === 0 || esProductoReservado(a, b)) return null;
  const item = { ejercicio: 1, tipo, forma: 'producto', a, b, enteros: a.m * b.m, resultado: datos(r) };
  if (tipo === 'elegir') {
    item.opciones = opcionesDe(rng, candidatosComa(item), r);
    if (!item.opciones) return null;
  }
  return item;
}

function itemPotencia(rng, tipo) {
  const op = rng.azar() < 0.5 ? 'por' : 'entre';
  const p = rng.entero(1, 3);
  const d = rng.azar() < 0.25 ? { m: rng.entero(2, 900), k: 0 } : numero(rng, 1, 3, 90);
  if (d.k === 0 && d.m % 10 === 0) return null;
  const r = porPotenciaDe10(D(d), op === 'por' ? -p : p);
  if (r.k > 4 || esPotenciaReservada(d, op, p)) return null;
  const item = { ejercicio: 1, tipo, forma: 'potencia', op, p, d, resultado: datosN(r) };
  if (tipo === 'elegir') {
    item.opciones = opcionesDe(rng, candidatosComa(item), r);
    if (!item.opciones) return null;
  }
  return item;
}

/**
 * { ejercicio: 1, tipo: 'escribir' | 'elegir', forma: 'producto' | 'potencia', … }
 *   producto   a, b, enteros (el producto de a.m · b.m, ya hecho), resultado
 *   potencia   op ('por' | 'entre'), p (1, 2, 3: ×0,1 / ×0,01 / ×0,001), d, resultado
 */
export function generarComa(rng) {
  for (;;) {
    const tipo = rng.azar() < 0.5 ? 'elegir' : 'escribir';
    const item = rng.azar() < 0.75 ? itemProducto(rng, tipo) : itemPotencia(rng, tipo);
    if (item) return item;
  }
}

export const errorDeComa = (item, valor) => clasificar(candidatosComa(item), D(item.resultado), valor);

// ─── Ejercicio 2: divide entre un natural ────────────────────────────────────────────────────

const quitaComa = r => { const x = r.normalizar(); return x.k > 0 ? decimal(x.m, 0) : null; };

export function candidatosEntre(item) {
  const q = D(item.cociente).normalizar();
  return [
    { error: 'olvida-coma-cociente', valor: quitaComa(q) },
    { error: 'cociente-entero', valor: item.forma === 'natural' && q.k > 0 ? decimal(Math.floor(q.m / pot(q.k)), 0) : null },
    ...comaCorrida(q),
  ];
}

const NATURALES_EXACTOS = [2, 4, 5, 8, 16, 20, 25, 40, 50];
const NATURALES_DECIMAL = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15];

/**
 * { ejercicio: 2, tipo: 'escribir' | 'elegir', forma: 'natural' | 'decimal', dividendo, divisor (natural), cociente (exacto, ≤ 3 cifras) }
 *   natural   7 : 4; el cociente se sigue sacando detrás de la coma
 *   decimal   9,6 : 8; la coma se pone en el cociente al bajar la primera cifra decimal
 */
export function generarEntre(rng) {
  for (;;) {
    const forma = rng.azar() < 0.45 ? 'natural' : 'decimal';
    let dividendo, divisor, cociente;
    if (forma === 'natural') {
      divisor = rng.elegir(NATURALES_EXACTOS);
      dividendo = { m: rng.entero(1, divisor <= 8 ? 60 : 199), k: 0 };
      if (dividendo.m % divisor === 0) continue;
      const r = dividir(D(dividendo), divisor, 3);
      if (!r.exacta) continue;
      cociente = r.cociente.normalizar();
    } else {
      divisor = rng.elegir(NATURALES_DECIMAL);
      const q = numero(rng, 1, 3, 20);
      dividendo = datosN(multiplicar(D(q), divisor));
      if (dividendo.k > 3 || dividendo.m / pot(dividendo.k) > 400) continue;
      cociente = D(q);
    }
    if (esDivisionReservada(dividendo, { m: divisor, k: 0 })) continue;
    const tipo = rng.azar() < 0.65 ? 'escribir' : 'elegir';
    const item = { ejercicio: 2, tipo, forma, dividendo, divisor, cociente: datosN(cociente) };
    if (tipo === 'elegir') {
      item.opciones = opcionesDe(rng, candidatosEntre(item), cociente);
      if (!item.opciones) item.tipo = 'escribir';
    }
    return item;
  }
}

export const errorDeEntre = (item, valor) => clasificar(candidatosEntre(item), D(item.cociente), valor);

/**
 * Los pasos de sacar decimales al cociente de un natural entre un natural: 7 : 4 → [{ texto de cada paso }].
 * [{ cuenta: [dividendo parcial, divisor], cifra, resto }] (el primero es la parte entera; los demás añaden un cero).
 */
export function pasosNatural(dividendo, divisor) {
  const pasos = [{ parcial: dividendo, divisor, cifra: Math.floor(dividendo / divisor), resto: dividendo % divisor, cero: false }];
  let resto = pasos[0].resto;
  while (resto !== 0) {
    const parcial = resto * 10;
    resto = parcial % divisor;
    pasos.push({ parcial, divisor, cifra: Math.floor(parcial / divisor), resto, cero: true });
  }
  return pasos;
}

// ─── Ejercicio 3: divide entre un decimal ────────────────────────────────────────────────────

const DIVISORES_DECIMALES = ['0.5', '0.25', '0.2', '0.4', '0.05', '0.15', '0.12', '0.16', '0.75', '0.8', '0.6', '0.9', '1.5', '2.5', '1.2', '0.04', '0.025', '0.125', '0.08', '0.35']
  .map(t => datos(deTexto(t)));

/** Los pares (lugares en el dividendo, lugares en el divisor) que se enseñan; solo (s, s) es la división equivalente. */
function movimientos(s) {
  return [
    { p: s, q: s, error: null },
    { p: 0, q: s, error: 'coma-solo-en-divisor' },
    { p: s, q: 0, error: 'coma-solo-en-dividendo' },
    { p: s + 1, q: s, error: 'coma-distinto-numero-de-lugares' },
    { p: s, q: s + 1, error: 'coma-distinto-numero-de-lugares' },
    { p: s - 1, q: s, error: s >= 2 ? 'coma-distinto-numero-de-lugares' : null },
  ].filter(m => m.p >= 0 && m.q >= 0 && (m.error !== null || (m.p === s && m.q === s)) || (m.error === null && m.p === s));
}

const mover = (d, n) => porPotenciaDe10(D(d), n);

export function candidatosDecimal(item) {
  const q = D(item.cociente), s = D(item.divisor).k;
  return [
    { error: 'coma-solo-en-divisor', valor: porPotenciaDe10(q, -s) },
    { error: 'coma-solo-en-dividendo', valor: porPotenciaDe10(q, s) },
    { error: 'coma-distinto-numero-de-lugares', valor: porPotenciaDe10(q, 1) },
    { error: 'coma-distinto-numero-de-lugares', valor: s >= 2 ? porPotenciaDe10(q, -1) : null },
  ];
}

/** Las opciones de «¿qué división es equivalente?»: [{ a, b, correcta, error }] ×4, todas con el texto distinto. */
function opcionesEquivalentes(rng, dividendo, divisor) {
  const s = D(divisor).k;
  const falsas = rng.barajar(movimientos(s).filter(m => m.error !== null && m.p !== m.q)).slice(0, 3);
  if (falsas.length < 3) return null;
  const hacer = m => ({ a: datosN(mover(dividendo, m.p)), b: datosN(mover(divisor, m.q)), correcta: m.p === m.q, error: m.error });
  const todas = [hacer({ p: s, q: s, error: null }), ...falsas.map(hacer)];
  return new Set(todas.map(o => `${claveDec(o.a)}:${claveDec(o.b)}`)).size === 4 ? rng.barajar(todas) : null;
}

/**
 * { ejercicio: 3, tipo: 'equivalente' | 'escribir', dividendo, divisor (con coma, 1 a 3 cifras decimales), cociente (exacto), opciones? }
 * 'equivalente': el alumno elige la división sin coma en el divisor; 'escribir': escribe el cociente.
 */
export function generarDecimal(rng) {
  for (;;) {
    const divisor = rng.elegir(DIVISORES_DECIMALES);
    const q = rng.azar() < 0.65 ? { m: rng.entero(2, 99), k: 0 } : numero(rng, 1, 1, 20);
    if (q.k === 0 && q.m === 1) continue;
    const dividendo = datosN(multiplicar(D(q), D(divisor)));
    if (dividendo.k > 3 || dividendo.m / pot(dividendo.k) > 300 || esDivisionReservada(dividendo, divisor)) continue;
    const tipo = rng.azar() < 0.45 ? 'equivalente' : 'escribir';
    const item = { ejercicio: 3, tipo, dividendo, divisor, cociente: datosN(D(q)) };
    if (tipo === 'equivalente') {
      item.opciones = opcionesEquivalentes(rng, dividendo, divisor);
      if (!item.opciones) continue;
    }
    return item;
  }
}

export const errorDeDecimal = (item, valor) => clasificar(candidatosDecimal(item), D(item.cociente), valor);

// ─── Ejercicio 4: ¿está bien? ────────────────────────────────────────────────────────────────

/**
 * { ejercicio: 4, a, b, cociente (2 cifras, CORTADO), resto (el de la división original), mostrado: { cociente, resto }, estaBien, error }
 * Falso: el resto de la división sin coma (`resto-sin-deshacer`), el cociente redondeado o el cociente con la coma corrida.
 */
export function generarEstaBien(rng) {
  for (;;) {
    const a = rng.azar() < 0.15 ? { m: rng.entero(2, 99), k: 0 } : numero(rng, 1, 3, 60);
    const b = rng.azar() < 0.3 ? { m: rng.elegir([3, 6, 7, 9, 11, 12, 13]), k: 0 } : numero(rng, 1, 2, 9);
    if (b.k === 0 && a.m < 3 && a.k === 0) continue;
    const { cociente, resto, exacta } = dividir(D(a), D(b), 2);
    if (exacta || cociente.m < 10 || cociente.m > 99999 || esDivisionReservada(a, b)) continue;
    const mostrado = { cociente: datos(cociente), resto: datosN(resto) };
    let estaBien = rng.azar() < 0.4, error = null;
    if (!estaBien) {
      const redondeado = redondear(dividir(D(a), D(b), 5).cociente, 2);
      const posibles = [
        D(b).k >= 1 ? 'resto-sin-deshacer' : null,
        'cociente-coma-corrida',
        mismoValor(redondeado, cociente) ? null : 'cociente-redondeado',
      ].filter(Boolean);
      const ponderadas = posibles.flatMap(e => (e === 'resto-sin-deshacer' ? [e, e] : [e]));
      error = rng.elegir(ponderadas);
      if (error === 'resto-sin-deshacer') mostrado.resto = datosN(porPotenciaDe10(resto, D(b).k));
      else if (error === 'cociente-redondeado') mostrado.cociente = datos(redondeado);
      else mostrado.cociente = datos(porPotenciaDe10(cociente, 1));
    }
    return { ejercicio: 4, a: datosN(D(a)), b: datosN(D(b)), cociente: datos(cociente), resto: datosN(resto), mostrado, estaBien, error };
  }
}

/** ¿Cuadra el cociente · divisor + resto con el dividendo? (comparado por valor, con las cifras que haya). */
export const cuadra = (a, b, cociente, resto) => comparar(sumar(multiplicar(D(b), D(cociente)), D(resto)), D(a)) === 0;

/** El nombre del error de contestar «bien» o «mal» (null si acierta). */
export const errorDeEstaBien = (item, dijoBien) => {
  if (dijoBien === item.estaBien) return null;
  return item.estaBien ? 'da-por-mala-una-buena' : item.error;
};

// ─── Ejercicio 5: problemas ──────────────────────────────────────────────────────────────────

export const FRUTAS = [
  { es: 'manzanas', en: 'apples' }, { es: 'plátanos', en: 'bananas' }, { es: 'uvas', en: 'grapes' }, { es: 'naranjas', en: 'oranges' },
  { es: 'peras', en: 'pears' }, { es: 'tomates', en: 'tomatoes' }, { es: 'patatas', en: 'potatoes' }, { es: 'zanahorias', en: 'carrots' },
  { es: 'fresas', en: 'strawberries' }, { es: 'melocotones', en: 'peaches' },
];

/**
 * Cotas del acta (punto l): fruta al peso, de 0,80 a 6,00 € el kilo y de 0,5 a 5 kg (un importe de 0,40 a 30 €);
 * gasolina de 1,20 a 2,00 € el litro y de 5 a 70 L; un viaje gasta de 15 a 60 L entre 2 y 5 personas.
 */
export const CONTEXTOS_PROBLEMAS = {
  fruta: { precio: [80, 600], peso: [50, 500], importe: [40, 3000] },
  gasolina: { precio: [120, 200], litros: [5, 70] },
  viaje: { precio: [120, 200], litros: [15, 60], personas: [2, 5] },
};

const euros = c => decimal(c, 2);

/** Un peso en kg con 1 o 2 cifras decimales entre 0,5 y 5 (2 cifras: múltiplos de 0,25). */
function pesoFruta(rng) {
  return rng.azar() < 0.7 ? datosN(decimal(rng.entero(5, 50), 1)) : datosN(decimal(rng.entero(2, 20) * 25, 2));
}

export function respuestaProblema(item) {
  switch (item.tipo) {
    case 'importe': return euros(item.importe);
    case 'precio': return euros(item.precio);
    case 'litros': return D(item.litros);
    default: return D(item.porPersona);
  }
}

export function candidatosProblema(item) {
  const resp = respuestaProblema(item).normalizar();
  switch (item.tipo) {
    case 'importe': return [
      { error: 'suma-en-vez-de-multiplica', valor: sumar(D(item.peso), euros(item.precio)) },
      { error: 'coma-olvidada', valor: decimal(item.importe, 0) },
      ...comaCorrida(resp),
    ];
    case 'precio': return [
      { error: 'multiplica-en-vez-de-divide', valor: multiplicar(euros(item.importe), D(item.peso)) },
      { error: 'coma-solo-en-divisor', valor: ERRORES_BASE['coma-solo-en-divisor'].fn(euros(item.importe), D(item.peso)) },
      ...comaCorrida(resp),
    ];
    case 'litros': return [
      { error: 'multiplica-en-vez-de-divide', valor: multiplicar(euros(item.importe), euros(item.precio)) },
      { error: 'redondea-truncando', valor: item.redondeo ? truncar(dividir(euros(item.importe), euros(item.precio), 6).cociente, 1) : null },
      ...comaCorrida(resp),
    ];
    default: return [
      { error: 'da-el-total', valor: euros(item.total) },
      { error: 'redondea-truncando', valor: item.redondeo ? truncar(dividir(euros(item.total), item.personas, 6).cociente, 2) : null },
      ...comaCorrida(resp),
    ];
  }
}

/**
 * { ejercicio: 5, tipo: 'importe' | 'precio' | 'litros' | 'viaje', contexto: 'fruta' | 'gasolina', … } (siempre se escribe)
 *   importe  fruta: nombre, peso, precio (céntimos por kilo) → importe (céntimos)
 *   precio   fruta: nombre, peso, importe → precio por kilo (céntimos)
 *   litros   gasolina: precio (céntimos por litro), importe (céntimos) → litros; con `redondeo` el enunciado pide la décima
 *   viaje    gasolina: litros, precio, personas, total (céntimos) → porPersona; con `redondeo` el enunciado pide el céntimo
 */
export function generarProblema(rng) {
  for (;;) {
    const u = rng.azar();
    const tipo = u < 0.3 ? 'importe' : u < 0.5 ? 'precio' : u < 0.75 ? 'litros' : 'viaje';
    const item = { ejercicio: 5, tipo };
    if (tipo === 'importe' || tipo === 'precio') {
      const c = CONTEXTOS_PROBLEMAS.fruta;
      item.contexto = 'fruta';
      item.nombre = rng.elegir(FRUTAS);
      item.peso = pesoFruta(rng);
      item.precio = rng.entero(c.precio[0] / 5, c.precio[1] / 5) * 5;
      const producto = D(item.peso).m * item.precio / pot(D(item.peso).k);
      if (!Number.isInteger(producto) || producto < c.importe[0] || producto > c.importe[1]) continue;
      item.importe = producto;
      if (esProductoReservado(item.peso, euros(item.precio))) continue;
    } else if (tipo === 'litros') {
      const c = CONTEXTOS_PROBLEMAS.gasolina;
      item.contexto = 'gasolina';
      item.precio = rng.entero(...c.precio);
      item.redondeo = rng.azar() < 0.4;
      if (item.redondeo) {
        item.importe = rng.entero(6, 100) * 100;
        const lit = dividir(euros(item.importe), euros(item.precio), 6);
        if (lit.exacta || lit.cociente.m / pot(6) < c.litros[0] || lit.cociente.m / pot(6) > c.litros[1]) continue;
        const r = redondear(lit.cociente, 1);
        if (mismoValor(truncar(lit.cociente, 1), r)) continue;
        item.litros = datosN(r);
      } else {
        const unaCifra = rng.azar() < 0.3;
        const litros = unaCifra ? { m: rng.entero(c.litros[0] * 10, c.litros[1] * 10), k: 1 } : { m: rng.entero(...c.litros), k: 0 };
        const importe = litros.m * item.precio / pot(litros.k);
        if (!Number.isInteger(importe) || (unaCifra && litros.m % 10 === 0)) continue;
        item.litros = datosN(D(litros));
        item.importe = importe;
      }
    } else {
      const c = CONTEXTOS_PROBLEMAS.viaje;
      item.contexto = 'gasolina';
      item.litros = rng.entero(...c.litros);
      item.precio = rng.entero(...c.precio);
      item.personas = rng.entero(...c.personas);
      item.total = item.litros * item.precio;
      item.redondeo = rng.azar() < 0.4;
      if ((item.total % item.personas !== 0) !== item.redondeo) continue;
      item.porPersona = datosN(redondear(dividir(euros(item.total), item.personas, 6).cociente, 2));
    }
    return item;
  }
}

export const errorDeProblema = (item, valor) => clasificar(candidatosProblema(item), respuestaProblema(item), valor);

// ─── Ejercicio 6: combinadas ─────────────────────────────────────────────────────────────────
// Una expresión es una lista que alterna números ({m,k}) y operadores ('+', '−', '·', ':'); un paréntesis es una lista dentro de otra.

const aplicarOp = (x, op, y) => {
  if (op === '+') return sumar(x, y);
  if (op === '−') return restar(x, y);
  if (op === '·') return multiplicar(x, y);
  if (y.m === 0) return null;
  const r = dividir(x, y, 3);
  return r.exacta ? r.cociente.normalizar() : null;
};

function plano(nums, ops, izquierda) {
  const paso = i => {
    const v = aplicarOp(nums[i], ops[i], nums[i + 1]);
    if (!v || v.m < 0) return false;
    nums.splice(i, 2, v);
    ops.splice(i, 1);
    return true;
  };
  if (!izquierda) {
    for (let i = ops.findIndex(o => o === '·' || o === ':'); i >= 0; i = ops.findIndex(o => o === '·' || o === ':')) if (!paso(i)) return null;
  }
  while (ops.length) if (!paso(0)) return null;
  return nums[0];
}

const aplanar = e => e.flatMap((x, i) => (i % 2 === 0 && Array.isArray(x) ? aplanar(x) : [x]));

/**
 * El valor de la expresión: modo 'jerarquia' (la buena), 'izquierda' (de izquierda a derecha, sin la jerarquía) o
 * 'sin-parentesis' (la jerarquía pero sin el paréntesis). null si algún paso da negativo o una división no es exacta (≤ 3 cifras).
 */
export function evaluar(expr, modo = 'jerarquia') {
  const e = modo === 'sin-parentesis' ? aplanar(expr) : expr;
  const nums = [], ops = [];
  for (let i = 0; i < e.length; i++) {
    if (i % 2 === 1) { ops.push(e[i]); continue; }
    const v = Array.isArray(e[i]) ? evaluar(e[i], modo) : D(e[i]);
    if (!v) return null;
    nums.push(v);
  }
  return plano(nums, ops, modo === 'izquierda');
}

/** Un paso de cálculo de la expresión (el del paréntesis primero, luego · y :, luego + y −). */
function unPaso(e) {
  const i = e.findIndex((x, j) => j % 2 === 0 && Array.isArray(x));
  if (i >= 0) {
    const dentro = unPaso(e[i]);
    return [...e.slice(0, i), dentro.length === 1 ? dentro[0] : dentro, ...e.slice(i + 1)];
  }
  let j = e.findIndex((x, k) => k % 2 === 1 && (x === '·' || x === ':'));
  if (j < 0) j = 1;
  return [...e.slice(0, j - 1), datosN(aplicarOp(D(e[j - 1]), e[j], D(e[j + 1]))), ...e.slice(j + 2)];
}

/** Las expresiones sucesivas, una operación por línea: [e0, e1, …, número]. */
export function pasosCombinada(expr) {
  const salida = [expr];
  let e = expr;
  while (e.length > 1) { e = unPaso(e); salida.push(e); }
  return salida;
}

/** La expresión como texto en el idioma (para el alumno, la huella y el test). */
export function textoExpresion(e, idioma) {
  return e.map((x, i) => (i % 2 === 1 ? x : Array.isArray(x) ? `(${textoExpresion(x, idioma)})` : aTexto(D(x), idioma))).join(' ');
}

export const tienParentesis = e => e.some((x, i) => i % 2 === 0 && Array.isArray(x));

const DIVISORES_COMBINADA = [2, 4, 5, 8, '0.5', '0.25', '0.2'].map(x => (typeof x === 'string' ? datos(deTexto(x)) : { m: x, k: 0 }));

export function candidatosCombinada(item) {
  const r = D(item.resultado);
  return [
    { error: 'izquierda-a-derecha', valor: evaluar(item.expresion, 'izquierda') },
    { error: 'quita-el-parentesis', valor: tienParentesis(item.expresion) ? evaluar(item.expresion, 'sin-parentesis') : null },
    ...comaCorrida(r),
  ];
}

/** Las plantillas. A y B son aditivos; C y D multiplicadores; Z un divisor exacto. */
function plantillas(rng) {
  const ad = () => numero(rng, 1, 2, 12);
  const natural = () => ({ m: rng.entero(2, 9), k: 0 });
  const mu = () => (rng.azar() < 0.5 ? natural() : numero(rng, 1, 1, 3));
  const z = () => rng.elegir(DIVISORES_COMBINADA);
  const A = ad(), B = ad(), C = mu(), Dd = mu(), Z = z();
  return [
    { par: false, e: [A, '+', B, '·', C] },
    { par: false, e: [A, '−', B, '·', C] },
    { par: false, e: [A, '+', B, ':', Z] },
    { par: false, e: [A, '·', C, '+', B] },
    { par: false, e: [A, '+', B, '·', C, '−', ad()] },
    { par: false, e: [A, ':', Z, '+', B, '·', Dd] },
    { par: true, e: [[A, '+', B], '·', C] },
    { par: true, e: [[A, '−', B], '·', C] },
    { par: true, e: [C, '·', [A, '+', B]] },
    { par: true, e: [[A, '+', B], ':', Z] },
    { par: true, e: [A, '−', B, '·', [C, '+', Dd]] },
    { par: true, e: [A, '+', [B, '−', C], '·', Dd] },
  ];
}

/**
 * { ejercicio: 6, tipo: 'escribir' | 'elegir', expresion, resultado, opciones? }
 * Dos o tres operaciones; sin paréntesis (U5-2C-14) o con uno (U5-2C-15); una división, si la hay, es exacta; el resultado
 * tiene a lo sumo 3 cifras decimales y nunca es negativo (ningún paso lo es). Distinto del que sale de izquierda a derecha.
 */
export function generarCombinada(rng) {
  for (;;) {
    const lista = plantillas(rng);
    const p = rng.elegir(lista);
    const r = evaluar(p.e);
    if (!r || r.k > 3 || r.m / pot(r.k) > 400 || r.m === 0) continue;
    const alt = evaluar(p.e, p.par ? 'sin-parentesis' : 'izquierda');
    if (!alt || mismoValor(alt, r)) continue;
    if (esReservada(clave('c', textoExpresion(p.e, 'en')))) continue;
    const planos = aplanar(p.e).filter((x, i) => i % 2 === 0);
    if (planos.every(x => x.k === 0)) continue;
    const tipo = rng.azar() < 0.4 ? 'elegir' : 'escribir';
    const item = { ejercicio: 6, tipo, expresion: p.e, resultado: datosN(r) };
    if (tipo === 'elegir') {
      item.opciones = opcionesDe(rng, candidatosCombinada(item), r);
      if (!item.opciones) item.tipo = 'escribir';
    }
    return item;
  }
}

export const errorDeCombinada = (item, valor) => clasificar(candidatosCombinada(item), D(item.resultado), valor);

// ─── Clave para no repetir ítem seguido ──────────────────────────────────────────────────────

export function claveDe(item) {
  const t = x => `${x.m}e${x.k}`;
  switch (item.ejercicio) {
    case 1: return item.forma === 'producto' ? `1|${item.tipo}|${t(item.a)}|${t(item.b)}` : `1|${item.tipo}|${item.op}|${item.p}|${t(item.d)}`;
    case 2: return `2|${item.tipo}|${t(item.dividendo)}|${item.divisor}`;
    case 3: return `3|${item.tipo}|${t(item.dividendo)}|${t(item.divisor)}`;
    case 4: return `4|${t(item.a)}|${t(item.b)}|${item.estaBien}|${item.error}`;
    case 5: return `5|${item.tipo}|${item.precio}|${item.importe ?? ''}|${item.litros?.m ?? item.litros ?? ''}|${item.personas ?? ''}|${item.peso ? t(item.peso) : ''}`;
    default: return `6|${item.tipo}|${textoExpresion(item.expresion, 'en')}`;
  }
}
