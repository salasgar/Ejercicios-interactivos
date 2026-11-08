// Práctica «Suma y resta decimales» de la unidad 5 (Decimals): lógica pura (sin DOM ni red).
// Cuatro ejercicios de la semana 1 (sesión 3):
//   1. Alinea la coma   4,7 + 3,25; 8 − 0,46; a veces tres términos (escribir, elegir o tres términos)
//   2. En el súper      fruta al peso y gasolina: el total o la vuelta de un billete (escribir)
//   3. Medidas          un listón, una botella, dos personas, dos paquetes (escribir o elegir)
//   4. Mueve la coma    × y : por 10, 100 y 1000 (escribir o elegir)
//
// Un ítem es DATOS: decimales { m, k } (m / 10^k, entero escalado) y el dinero en céntimos enteros. Nada de
// `Number` con coma flotante: todo se calcula y se compara con `decimales.js`. Todo error lleva un nombre de
// `ERRORES_PROPIOS` (o de `ERRORES_TIPICOS` de la base) y se calcula con los números del ítem.

import {
  decimal, sumar, restar, comparar, porPotenciaDe10, mismoValor, deTexto,
  ERRORES_TIPICOS as ERRORES_BASE,
} from '../_comun/decimales.js';

export const D = ({ m, k }) => decimal(m, k);
const datos = d => ({ m: d.m, k: d.k });
const datosN = d => datos(d.normalizar());
const pot = n => 10 ** n;
const parteEntera = d => Math.floor(Math.abs(d.m) / pot(d.k));
const cifrasDetras = d => (d.k === 0 ? '' : String(Math.abs(d.m) % pot(d.k)).padStart(d.k, '0'));
const claveDec = d => D(d).normalizar().toString().replace(',', '.');

// ─── Errores propios (los de la base, de `decimales.js`, se usan con su nombre) ───────────────

export const ERRORES_PROPIOS = {
  'decimales-por-separado': { nombre: { es: 'Ha sumado las partes enteras por un lado y las decimales por otro, sin llevar', en: 'Added the whole parts and the decimal parts separately, without carrying' } },
  'columnas-al-reves': { nombre: { es: 'En cada columna ha restado la cifra pequeña de la grande', en: 'In each column took the smaller digit from the bigger one' } },
  'coma-olvidada': { nombre: { es: 'Ha olvidado poner la coma en el resultado', en: 'Forgot the decimal point in the answer' } },
  'coma-corrida': { nombre: { es: 'Tiene las cifras bien, pero la coma mal puesta', en: 'Has the right digits but the decimal point in the wrong place' } },
  'centimos-sin-llevar': { nombre: { es: 'Ha sumado los euros y los céntimos como dos números aparte, sin llevar', en: 'Added the euros and the cents as two separate numbers, without carrying' } },
  'resta-al-reves': { nombre: { es: 'Ha restado al revés (el billete menos el total sale negativo)', en: 'Subtracted the wrong way round' } },
  'da-el-total': { nombre: { es: 'Ha dado el total en lugar de la vuelta', en: 'Gave the total instead of the change' } },
  'olvida-un-trozo': { nombre: { es: 'Ha quitado solo un trozo y se ha olvidado del otro', en: 'Took away only one piece and forgot the other' } },
  'da-lo-cortado': { nombre: { es: 'Ha dado lo que se corta o se bebe en lugar de lo que queda', en: 'Gave what was taken away instead of what is left' } },
  'suma-en-vez-de-resta': { nombre: { es: 'Ha sumado en lugar de restar', en: 'Added instead of subtracting' } },
  'coma-un-solo-lugar': { nombre: { es: 'Ha movido la coma un solo lugar', en: 'Moved the decimal point only one place' } },
  'coma-al-reves': { nombre: { es: 'Ha movido la coma hacia el lado contrario', en: 'Moved the decimal point the wrong way' } },
  'coma-de-mas': { nombre: { es: 'Ha movido la coma un lugar de más', en: 'Moved the decimal point one place too many' } },
  'otra-respuesta': { nombre: { es: 'Ha dado otra respuesta', en: 'Gave a different answer' } },
};

export const nombreDe = id => ERRORES_PROPIOS[id]?.nombre ?? ERRORES_BASE[id]?.nombre ?? null;

// ─── Casos que no pueden salir ───────────────────────────────────────────────────────────────
// La hoja de la semana 1 está en papel y se excluye en claro; los casos del examen de la semana 1 y del
// final, por huella FNV-1a calculada fuera del repositorio (el repositorio y GitHub Pages son públicos).
// 64 huellas (exámenes semanales 1 y 2 y final, calculadas por la tarea de publicación). Claves con prefijo: «s:» un cálculo de sumas y restas,
// «m:» un movimiento de la coma.

export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
export const HUELLAS_EXAMEN = new Set(["k0bwlg","118uug2","1lny68q","1yb61bo","1fk4mik","117u0b","mivt2p","4wm0il","1r34960","z8w0c2","1m08jrx","1o6vci8","1bys59s","1ghhwhi","1fmrpy7","vfa0j8","oygecq","10fhg9g","t9yy3a","ehgfbx","v5f99g","7s7wy1","e352ub","fge1rc","v593ba","1snfb3","38n0fa","7jpmkl","l4pzmh","paa6ph","1hmezys","1lthmiy","1213j3e","h470i0","1qk2slt","1xkvdq0","oo0s0m","132j0x4","ydqkm","1di1lbf","5jyuhh","dhijhs","zl81h6","1vrord4","1eb23s6","142wzfr","18mk3d0","137com","cwrfzd","1b95mmm","koefro","pkhl3j","1elfauz","1a3ai8b","1yyfnbf","1c4f6ij","i4s5e6","fcbuug","yea7fl","gr2y15","6ebkxg","19t9asm","12qjsd8","1wiunvm"]);

/** Clave de un cálculo con sumas y restas, sin importar el orden de lo que se suma ni el de lo que se resta. */
export function claveCalculo(terminos, ops) {
  const mas = [claveDec(terminos[0])], menos = [];
  ops.forEach((op, i) => (op === '+' ? mas : menos).push(claveDec(terminos[i + 1])));
  return `${mas.sort().join('+')}-${menos.sort().join('-')}`;
}

/** '9.05-3.8' → { terminos, ops }. */
function calculoDe(texto) {
  const partes = texto.match(/[+-]?[\d.]+/g);
  const terminos = partes.map(p => deTexto(p.replace(/^[+-]/, '')));
  const ops = partes.slice(1).map(p => (p[0] === '-' ? '−' : '+'));
  return { terminos, ops };
}

// ej. 1, 2 y 3 (hoja: ej. «Work out», el ejemplo del recuadro de apoyo, las dos estimaciones y los dos problemas)
const CALCULOS_HOJA = new Set([
  '4.7+3.25', '12.6+0.84', '9.05-3.8', '15.2-7.64', '8-0.46', '15+0.7+4.25', '20-3.85-6.5',
  '8.6+2.75', '20-7.35', '14.6+8.3', '31.2-9.8', '3.65+2.1+1.2', '2.8-0.85-0.9',
  '6.7+2.85', '12-4.37', '0.9-0.36',
].map(t => { const c = calculoDe(t); return claveCalculo(c.terminos, c.ops); }));

// ej. 4 (hoja: los de multiplicar y dividir, los huecos, los ejemplos del recuadro y los cambios de unidad)
const MOVIMIENTOS_HOJA = new Set([
  '6.82*10', '0.072*100', '1.6*1000', '23.8*100', '38:10', '4.6:100', '275:1000', '0.9:10', '46:100', '0.46*100', '0.07*1000', '5.7*100',
  '0.58*10', '5.3*100', '6.3:10', '52:1000', '3.4*10',
  '3.2*1000', '4500:1000', '0.8*1000', '6.35*100', '2.4*100', '85:100',
]);

export const esCalculoReservado = (terminos, ops) => {
  const clave = claveCalculo(terminos.map(D), ops);
  return CALCULOS_HOJA.has(clave) || HUELLAS_EXAMEN.has(huella(`s:${clave}`));
};
const claveMovimiento = (d, op, n) => `${claveDec(d)}${op === 'por' ? '*' : ':'}${pot(n)}`;
export const esMovimientoReservado = (d, op, n) => {
  const clave = claveMovimiento(d, op, n);
  return MOVIMIENTOS_HOJA.has(clave) || HUELLAS_EXAMEN.has(huella(`m:${clave}`));
};

// ─── Piezas comunes ──────────────────────────────────────────────────────────────────────────

/** Un decimal sin cero final (los naturales no tienen), de 0 < valor ≤ tope, con entre kMin y kMax cifras decimales. */
function numero(rng, kMin, kMax, tope) {
  const k = rng.entero(kMin, kMax);
  for (;;) {
    const m = rng.entero(1, tope * pot(k));
    if (k === 0 || m % 10 !== 0) return { m, k };
  }
}

const aplicar = (a, op, b) => (op === '+' ? sumar(a, b) : restar(a, b));
const sinSigno = d => (d === null ? null : d.m < 0 ? d.opuesto() : d);

/** Alinear a la derecha (de la base); si sale negativo se toma el valor absoluto (5 − 0,37 → 0,05 − 0,37). */
const alineaDerecha = (a, op, b) => sinSigno(ERRORES_BASE['alinea-a-la-derecha'].fn(a, b, op));

/** Los candidatos a distractor y a clasificar lo que escribe el alumno: [{ error, valor: Decimal | null }]. */
const comaCorrida = r => [
  { error: 'coma-corrida', valor: decimal(r.m, r.k + 1) },
  { error: 'coma-corrida', valor: r.k >= 1 ? decimal(r.m, r.k - 1) : null },
];

/** Solo los que valen algo distinto de la correcta y entre sí, y más de 0. */
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
  // Primero se quitan los que valen lo mismo (se queda el primero de la lista), después se baraja.
  const tres = rng.barajar(buenos(candidatos, correcta)).slice(0, 3);
  if (tres.length < 3) return null;
  const forma = c => (c.error === 'por-diez-anadiendo-cero' ? datos(c.valor) : datosN(c.valor));
  return rng.barajar([
    { d: datosN(correcta), correcta: true, error: null },
    ...tres.map(c => ({ d: forma(c), correcta: false, error: c.error })),
  ]);
}

/** El nombre del error de lo que ha escrito el alumno (null si acierta). */
function clasificar(candidatos, correcta, valor) {
  if (mismoValor(valor, correcta)) return null;
  return candidatos.find(c => c.valor && mismoValor(c.valor, valor))?.error ?? 'otra-respuesta';
}

// ─── Ejercicio 1: alinea la coma ─────────────────────────────────────────────────────────────

/** Sumar o restar cifra a cifra, sin llevar: 2,7 + 1,5 = 3,12 (el 7 + 5 = 12 detrás de la coma). */
function decimalesPorSeparado(a, b) {
  const entera = parteEntera(a) + parteEntera(b);
  const parte = Number(cifrasDetras(a) || '0') + Number(cifrasDetras(b) || '0');
  const texto = String(parte);
  return decimal(entera * pot(texto.length) + parte, texto.length);
}

/** En cada columna, la cifra pequeña menos la grande al revés: 7,30 − 2,85 → 5,55. */
function columnasAlReves(a, b) {
  const k = Math.max(a.k, b.k);
  const sa = String(Math.abs(a.m) * pot(k - a.k)), sb = String(Math.abs(b.m) * pot(k - b.k));
  const n = Math.max(sa.length, sb.length);
  const pa = sa.padStart(n, '0'), pb = sb.padStart(n, '0');
  let salida = '';
  for (let i = 0; i < n; i++) salida += Math.abs(Number(pa[i]) - Number(pb[i]));
  return decimal(Number(salida), k);
}

export function candidatosAlinea(item) {
  if (item.tipo === 'tres') {
    let acumulado = D(item.terminos[0]), exacto = D(item.terminos[0]);
    item.ops.forEach((op, i) => {
      const t = D(item.terminos[i + 1]);
      exacto = aplicar(exacto, op, t);
      acumulado = alineaDerecha(acumulado, op, t) ?? aplicar(acumulado, op, t);
    });
    return [{ error: 'alinea-a-la-derecha', valor: mismoValor(acumulado, exacto) ? null : acumulado }];
  }
  const a = D(item.a), b = D(item.b), r = D(item.resultado).normalizar();
  return [
    { error: 'alinea-a-la-derecha', valor: alineaDerecha(a, item.op, b) },
    item.op === '+'
      ? { error: 'decimales-por-separado', valor: decimalesPorSeparado(a, b) }
      : { error: 'columnas-al-reves', valor: columnasAlReves(a, b) },
    { error: 'coma-olvidada', valor: r.k > 0 ? decimal(r.m, 0) : null },
    ...comaCorrida(r),
  ];
}

function itemDos(rng, tipo) {
  const op = rng.azar() < 0.55 ? '+' : '−';
  let a, b;
  if (rng.azar() < 0.25) {
    const n = { m: rng.entero(1, 30), k: 0 }, x = numero(rng, 1, 3, 20);
    [a, b] = rng.azar() < 0.6 ? [n, x] : [x, n];
  } else {
    a = numero(rng, 1, 2, 20);
    b = numero(rng, 1, 3, 20);
    if (rng.azar() < 0.5) [a, b] = [b, a];
    if (a.k === b.k && (tipo === 'elegir' || rng.azar() < 0.8)) return null;
  }
  if (op === '−') {
    const c = comparar(D(a), D(b));
    if (c === 0) return null;
    if (c < 0) [a, b] = [b, a];
  }
  const resultado = aplicar(D(a), op, D(b));
  if (resultado.k > 3 || resultado.m <= 0 || esCalculoReservado([a, b], [op])) return null;
  const item = { ejercicio: 1, tipo, op, a, b, resultado: datos(resultado) };
  if (tipo === 'elegir') {
    item.opciones = opcionesDe(rng, candidatosAlinea(item), resultado);
    if (!item.opciones) return null;
  }
  return item;
}

function itemTres(rng) {
  const ops = rng.elegir([['+', '+'], ['−', '−'], ['+', '−']]);
  const terminos = [numero(rng, 0, 2, 20), numero(rng, 0, 2, 20), numero(rng, 0, 2, 10)];
  if (terminos.every(t => t.k === terminos[0].k) || terminos.every(t => t.k === 0)) return null;
  let r = D(terminos[0]);
  for (let i = 0; i < 2; i++) {
    r = aplicar(r, ops[i], D(terminos[i + 1]));
    if (r.m <= 0) return null;
  }
  if (esCalculoReservado(terminos, ops)) return null;
  const item = { ejercicio: 1, tipo: 'tres', ops, terminos, resultado: datos(r) };
  return candidatosAlinea(item)[0].valor ? item : null;
}

/**
 * { ejercicio: 1, tipo, … }
 *   'escribir'  a ± b; el alumno escribe el resultado (a veces uno de los dos es natural)
 *   'elegir'    a ± b; opciones [{ d, correcta, error }] ×4 (las cuatro con valor distinto)
 *   'tres'      a ± b ± c; el alumno escribe el resultado
 */
export function generarAlinea(rng) {
  for (;;) {
    const u = rng.azar();
    const tipo = u < 0.45 ? 'escribir' : u < 0.8 ? 'elegir' : 'tres';
    const item = tipo === 'tres' ? itemTres(rng) : itemDos(rng, tipo);
    if (item) return item;
  }
}

export const errorDeAlinea = (item, valor) => clasificar(candidatosAlinea(item), D(item.resultado), valor);

// ─── Ejercicio 2: en el súper ────────────────────────────────────────────────────────────────

export const BILLETES = [5, 10, 20, 50];

/** Cotas del acta (punto l): fruta al peso, de 0,80 a 6 € el kilo y de 0,5 a 5 kg → un producto de 0,40 a 30 €; en esta práctica,
 *  de 0,50 a 15 €. Gasolina de 1,20 a 2,00 € el litro y de 5 a 70 L: un repostaje se paga con un billete, de 6 a 48 €. */
export const CONTEXTOS_SUPER = {
  fruta: { min: 50, max: 1500, n: [2, 3], totalMax: 4000 },
  gasolina: { min: 600, max: 4800, n: [1, 2], totalMax: 9600 },
};

export const FRUTAS = [
  { es: 'Manzanas', en: 'Apples' }, { es: 'Plátanos', en: 'Bananas' }, { es: 'Uvas', en: 'Grapes' },
  { es: 'Naranjas', en: 'Oranges' }, { es: 'Peras', en: 'Pears' }, { es: 'Tomates', en: 'Tomatoes' },
  { es: 'Patatas', en: 'Potatoes' }, { es: 'Zanahorias', en: 'Carrots' }, { es: 'Fresas', en: 'Strawberries' },
  { es: 'Melocotones', en: 'Peaches' },
];

const euros = c => decimal(c, 2);
export const totalCentimos = item => item.importes.reduce((s, c) => s + c, 0);

export function candidatosSuper(item) {
  const total = totalCentimos(item);
  if (item.pregunta === 'total') {
    const e = item.importes.reduce((s, c) => s + Math.floor(c / 100), 0), c = item.importes.reduce((s, x) => s + (x % 100), 0);
    const texto = String(c);
    return [{ error: 'centimos-sin-llevar', valor: c < 100 ? null : decimal(e * pot(texto.length) + c, texto.length) }];
  }
  return [
    { error: 'resta-al-reves', valor: euros(total - item.billete * 100) },
    { error: 'da-el-total', valor: euros(total) },
  ];
}

export const respuestaSuper = item => (item.pregunta === 'total' ? euros(totalCentimos(item)) : euros(item.billete * 100 - totalCentimos(item)));

/**
 * { ejercicio: 2, contexto: 'fruta' | 'gasolina', pregunta: 'total' | 'vuelta', importes: [céntimos], nombres?: [{es,en}],
 *   billete?: 5 | 10 | 20 | 50, respuesta: { m, k: 2 } }
 */
export function generarSuper(rng) {
  for (;;) {
    const contexto = rng.azar() < 0.55 ? 'fruta' : 'gasolina';
    const cota = CONTEXTOS_SUPER[contexto];
    const pregunta = rng.azar() < 0.5 ? 'total' : 'vuelta';
    const n = contexto === 'gasolina' ? (pregunta === 'total' ? 2 : 1) : rng.entero(...cota.n);
    const importes = Array.from({ length: n }, () => {
      const c = rng.entero(cota.min, cota.max);
      return rng.azar() < 0.2 ? Math.round(c / 10) * 10 : c;
    });
    const total = importes.reduce((s, c) => s + c, 0);
    if (total > cota.totalMax || importes.some(c => c < cota.min || c > cota.max)) continue;
    if (esCalculoReservado(importes.map(c => ({ m: c, k: 2 })), importes.slice(1).map(() => '+'))) continue;
    const item = { ejercicio: 2, contexto, pregunta, importes };
    if (contexto === 'fruta') item.nombres = rng.barajar(FRUTAS).slice(0, n);
    if (pregunta === 'vuelta') {
      const posibles = BILLETES.filter(b => b * 100 > total);
      if (posibles.length === 0) continue;
      item.billete = rng.elegir(posibles);
    }
    item.respuesta = datos(respuestaSuper(item));
    return item;
  }
}

export const errorDeSuper = (item, valor) => clasificar(candidatosSuper(item), D(item.respuesta), valor);

// ─── Ejercicio 3: medidas ────────────────────────────────────────────────────────────────────

/** Cotas del acta: un listón 1-3 m; una botella de 1, 1,5 o 2 L y un vaso 0,2-0,33 L; una persona 1,20-2,10 m;
 *  un paquete 0,1-30 kg. Todo en centésimas (k = 2); lo que queda nunca es negativo (siempre ≥ 0,10). */
export const CONTEXTOS_MEDIDAS = {
  liston: { forma: 'resto2', unidad: 'm', total: [100, 300], parte: [10, 150], resto: 10 },
  botella: { forma: 'resto2', unidad: 'L', totales: [100, 150, 200], parte: [20, 33], resto: 50 },
  personas: { forma: 'diferencia', unidad: 'm', valor: [120, 210], dif: [3, 90] },
  paquetes: { forma: 'suma2', unidad: 'kg', valor: [10, 3000] },
};

const centesimas = c => (c % 10 === 0 ? datos(decimal(c, 2).normalizar()) : { m: c, k: 2 });

/** total − trozo − trozo alineando a la derecha en cada paso (null si ningún paso se equivoca). */
function restaAlineada([total, a, b]) {
  let mal = total, bien = total;
  for (const t of [a, b]) {
    bien = restar(bien, t);
    mal = alineaDerecha(mal, '−', t) ?? restar(mal, t);
  }
  return mismoValor(mal, bien) ? null : mal;
}

export function candidatosMedidas(item) {
  const t = item.datos.map(D), r = D(item.respuesta).normalizar();
  if (item.forma === 'resto2') {
    return [
      { error: 'alinea-a-la-derecha', valor: restaAlineada(t) },
      { error: 'olvida-un-trozo', valor: restar(t[0], t[1]) },
      { error: 'da-lo-cortado', valor: sumar(t[1], t[2]) },
      ...comaCorrida(r),
    ];
  }
  if (item.forma === 'diferencia') {
    return [
      { error: 'alinea-a-la-derecha', valor: alineaDerecha(t[1], '−', t[0]) },
      { error: 'suma-en-vez-de-resta', valor: sumar(t[0], t[1]) },
      ...comaCorrida(r),
    ];
  }
  return [
    { error: 'alinea-a-la-derecha', valor: alineaDerecha(t[0], '+', t[1]) },
    { error: 'coma-olvidada', valor: r.k > 0 ? decimal(r.m, 0) : null },
    ...comaCorrida(r),
  ];
}

/**
 * { ejercicio: 3, tipo: 'escribir' | 'elegir', contexto, forma, datos: [{m,k}], respuesta, opciones? }
 *   resto2      [total, trozo, trozo]  → lo que queda
 *   diferencia  [menor, mayor]         → cuánto más
 *   suma2       [a, b]                 → juntos
 */
export function generarMedidas(rng) {
  for (;;) {
    const contexto = rng.elegir(Object.keys(CONTEXTOS_MEDIDAS));
    const c = CONTEXTOS_MEDIDAS[contexto];
    let cents, respuesta;
    if (c.forma === 'resto2') {
      const total = c.totales ? rng.elegir(c.totales) : rng.entero(...c.total);
      const a = rng.entero(...c.parte), b = rng.entero(...c.parte);
      if (total - a - b < c.resto) continue;
      cents = [total, a, b];
      respuesta = restar(restar(decimal(total, 2), decimal(a, 2)), decimal(b, 2));
    } else if (c.forma === 'diferencia') {
      const a = rng.entero(...c.valor), b = rng.entero(...c.valor);
      if (b - a < c.dif[0] || b - a > c.dif[1]) continue;
      cents = [a, b];
      respuesta = restar(decimal(b, 2), decimal(a, 2));
    } else {
      const a = rng.entero(...c.valor), b = rng.entero(...c.valor);
      cents = [a, b];
      respuesta = sumar(decimal(a, 2), decimal(b, 2));
    }
    const dat = cents.map(centesimas);
    const ops = c.forma === 'resto2' ? ['−', '−'] : c.forma === 'diferencia' ? ['−'] : ['+'];
    const orden = c.forma === 'diferencia' ? [dat[1], dat[0]] : dat;
    if (esCalculoReservado(orden, ops)) continue;
    const tipo = rng.azar() < 0.4 ? 'elegir' : 'escribir';
    const item = { ejercicio: 3, tipo, contexto, forma: c.forma, datos: dat, respuesta: datos(respuesta) };
    if (tipo === 'elegir') {
      const opciones = opcionesDe(rng, candidatosMedidas(item), respuesta);
      if (opciones) item.opciones = opciones; else item.tipo = 'escribir';
    }
    return item;
  }
}

export const errorDeMedidas = (item, valor) => clasificar(candidatosMedidas(item), D(item.respuesta), valor);

// ─── Ejercicio 4: mueve la coma ──────────────────────────────────────────────────────────────

export function candidatosMueve(item) {
  const d = D(item.d), n = item.n;
  if (item.op === 'por') {
    return [
      { error: 'por-diez-anadiendo-cero', valor: ERRORES_BASE['por-diez-anadiendo-cero'].fn(d, n) },
      { error: 'coma-al-reves', valor: porPotenciaDe10(d, -n) },
      { error: 'coma-un-solo-lugar', valor: n >= 2 ? porPotenciaDe10(d, 1) : null },
      { error: 'coma-de-mas', valor: porPotenciaDe10(d, n + 1) },
    ];
  }
  return [
    { error: 'coma-al-reves', valor: porPotenciaDe10(d, n) },
    { error: 'coma-un-solo-lugar', valor: n >= 2 ? porPotenciaDe10(d, -1) : null },
    { error: 'coma-de-mas', valor: porPotenciaDe10(d, -(n + 1)) },
  ];
}

/**
 * { ejercicio: 4, tipo: 'escribir' | 'elegir', op: 'por' | 'entre', n: 1 | 2 | 3, d: {m,k}, respuesta, opciones? }
 * El decimal no lleva cero final; el resultado, a lo sumo 4 cifras decimales.
 */
export function generarMueve(rng) {
  for (;;) {
    const op = rng.azar() < 0.5 ? 'por' : 'entre';
    const n = rng.entero(1, 3);
    const d = rng.azar() < 0.2 ? { m: rng.entero(2, 400), k: 0 } : numero(rng, 1, 3, 30);
    const respuesta = porPotenciaDe10(D(d), op === 'por' ? n : -n);
    if (respuesta.k > 4 || d.m === 0 || esMovimientoReservado(d, op, n)) continue;
    const tipo = rng.azar() < 0.45 ? 'elegir' : 'escribir';
    const item = { ejercicio: 4, tipo, op, n, d, respuesta: datos(respuesta) };
    if (tipo === 'elegir') {
      item.opciones = opcionesDe(rng, candidatosMueve(item), respuesta);
      if (!item.opciones) continue;
    }
    return item;
  }
}

export const errorDeMueve = (item, valor) => clasificar(candidatosMueve(item), D(item.respuesta), valor);

// ─── Clave para no repetir ítem seguido ──────────────────────────────────────────────────────

export function claveDe(item) {
  const t = x => `${x.m}e${x.k}`;
  switch (item.ejercicio) {
    case 1: return item.tipo === 'tres' ? `1|tres|${item.ops.join('')}|${item.terminos.map(t).join(',')}` : `1|${item.tipo}|${item.op}|${t(item.a)}|${t(item.b)}`;
    case 2: return `2|${item.contexto}|${item.pregunta}|${item.importes.join(',')}|${item.billete ?? ''}`;
    case 3: return `3|${item.contexto}|${item.datos.map(t).join(',')}`;
    default: return `4|${item.op}|${item.n}|${t(item.d)}`;
  }
}
