// Decimales para las prácticas de la unidad 5 (PU2, tarea 122): el modelo de decimal
// (un entero escalado, nunca un Number con coma flotante), cómo se escribe y se lee en
// los dos idiomas, y los errores típicos de la unidad, de donde salen los distractores.
// Puro (sin DOM ni red). La recta está en `recta-decimales.js`. Probado en
// `tests/practicas-decimales.test.js`.
//
// ─── El modelo ─────────────────────────────────────────────────────────────────
//
//   decimal(375, 2) → 3,75: { m: 375, k: 2 } vale m / 10^k, con `m` entero seguro (también
//   negativo) y `k` ≥ 0. Inmutable. NO se normaliza solo: 2,50 se queda con dos cifras
//   decimales hasta que se pide `normalizar()`, porque muchas prácticas preguntan justo por
//   la escritura (los ceros finales, el dinero con dos cifras). `equals` compara por valor
//   (0,5 equals 0,50); `mismaForma`, por escritura.
//   Las operaciones aceptan un Decimal, un entero o un texto que lea `deTexto`.
//     sumar(a, b), restar(a, b)   con las comas en columna: tantas cifras como el que más
//                                 (2,5 + 1,25 = 3,75; 0,5 + 0,5 = 1,0)
//     multiplicar(a, b)           tantas cifras como los dos factores juntos (1,2 · 0,3 = 0,36)
//     dividir(a, b, cifras)       → { cociente, resto, exacta }. Sin `cifras`: exacta si
//                                 termina; si no, cortada a las centésimas. Con `cifras`: el
//                                 cociente CORTADO a esas cifras (sin redondear) y el resto de
//                                 la división ORIGINAL (acta del 3-11, punto d):
//                                 6,384 : 0,49 → 13,02 y resto 0,0042 (0,49 · 13,02 + 0,0042 = 6,384)
//     porPotenciaDe10(d, n)       ×10ⁿ (n < 0 divide): mueve la coma; 2,5 · 100 = 250
//     redondear(d, cifras)        a la unidad (0), a la décima (1) o a la centésima (2), con el 5
//                                 hacia arriba (en valor absoluto); deja `cifras` cifras: 2,96 → 3,0
//     truncar(d, cifras)          cortar, sin redondear
//   comparar(a, b) → −1, 0 o 1 (también con una Fraccion: compara por valor, exacto).
//   ordenar(lista, { descendente }), entreDos(a, b) (el decimal más corto estrictamente entre los
//   dos: para intercalar), cifrasDecimales(d) (de la escritura: 2,50 → 2),
//   descomponer(d) (cada cifra con su orden: unidades, décimas, centésimas, milésimas…),
//   aFraccion(d) (la irreducible, una Fraccion de fracciones.js), aFraccionDecimal(d) (sin
//   simplificar: 3,75 = 375/100) y deFraccion(f) (el decimal exacto, o null si no termina).
//
// ─── Escritura y lectura ───────────────────────────────────────────────────────
//
//   aTexto(d, idioma, cifras?) → '3,75' en español, '3.75' en inglés; el menos es U+2212; con
//   `cifras`, rellena con ceros (dinero: dos). Sin separador de millares (hasta cuatro cifras
//   enteras en la unidad). Alias: fmtDecimal.
//   deTexto(texto) → Decimal o null. Acepta coma o punto en los dos idiomas (el teclado del
//   móvil en español saca coma), '.5' y ',5', un natural, el menos (-, − o –) y espacios
//   alrededor; rechaza dos separadores ('1.234,5', '1,2,3'), un separador al final, vacío y
//   basura. Nunca Number(texto). Alias: leerDecimal.
//   enPalabras(d, 'en') → 'three point seven five', 'nought point nought five'; enPalabras(d, 'es')
//   → 'tres coma setenta y cinco', 'cero coma cero cinco'.
//   lecturasValidas(d, idioma) → todas las que valen (nought / zero / point five; tres coma setenta y
//   cinco / tres unidades y setenta y cinco centésimas): NINGUNA puede ser distractor.
//   esLecturaValida(d, texto, idioma) compara sin mayúsculas, tildes, guiones ni espacios de más.
//   dinero(d, idioma) → '3,75 €' / '€3.75' (siempre dos cifras); dineroEnPalabras(d, 'en') →
//   'three euros seventy-five'; lecturasDinero(d, idioma) → todas las que valen.
//
// ─── Errores típicos ───────────────────────────────────────────────────────────
//
//   Cada error de la columna `nota` del inventario es una función que, con los números del
//   ítem, da el resultado equivocado, o `null` cuando ese error no sirve de distractor ahí (da
//   lo mismo que la cuenta buena o no se aplica). `ERRORES_TIPICOS[id]` = { fn, devuelve,
//   ejemplo, nombre: { es, en } }; el id es el `error` de `api.responder`.
//   `distractores([[id, …args], …], correcta)` junta los que sirven, **sin dos que valgan lo
//   mismo** entre ellos ni con la correcta (regla 1 de la unidad: 0,5, 0,50 y 1/2 son la misma
//   respuesta). `mismoValor(a, b)` y `hayIguales(lista)` comparan por valor decimales,
//   fracciones y enteros juntos.

import { MENOS } from './enteros.js';
import { Fraccion, fraccion, comparar as compararFracciones } from './fracciones.js';
import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';

export { MENOS };

export class ErrorDecimales extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorDecimales';
    this.codigo = codigo;
  }
}

/** Quita el −0 de JavaScript. */
const limpio = n => (n === 0 ? 0 : n);
const signo = n => (n > 0 ? 1 : n < 0 ? -1 : 0);
const pot10 = k => 10 ** k;
const seguro = (n, que) => {
  if (!Number.isSafeInteger(n)) throw new ErrorDecimales('desborde', `${que}: el número se sale de lo que se puede representar exacto`);
  return n;
};

// ─── El modelo ─────────────────────────────────────────────────────────────────

export class Decimal {
  constructor(m, k = 0) {
    if (!Number.isSafeInteger(m)) throw new ErrorDecimales('no-entero', `${m} no es un entero seguro`);
    if (!Number.isInteger(k) || k < 0 || k > 15) throw new ErrorDecimales('cifras', `${k} cifras decimales no valen`);
    this.m = limpio(m);
    this.k = k;
    Object.freeze(this);
  }

  /** Sin ceros finales en la parte decimal: 2,50 → 2,5; 3,0 → 3. */
  normalizar() {
    let { m, k } = this;
    while (k > 0 && m % 10 === 0) { m /= 10; k--; }
    return new Decimal(m, k);
  }
  /** La misma cantidad con `k` cifras decimales (más ceros a la derecha); null si hace falta quitar cifras que no son 0. */
  conCifras(k) {
    if (k >= this.k) return new Decimal(seguro(this.m * pot10(k - this.k), 'conCifras'), k);
    const d = pot10(this.k - k);
    return this.m % d === 0 ? new Decimal(this.m / d, k) : null;
  }
  equals(otro) { return comparar(this, otro) === 0; }
  mismaForma(otro) { const o = aDecimal(otro); return this.m === o.m && this.k === o.k; }
  /** El valor como texto canónico ('3.75', '-2'): para un Set de valores; nunca para enseñar. */
  clave() { return aFraccion(this).clave(); }
  esEntero() { return this.normalizar().k === 0; }
  esNegativo() { return this.m < 0; }
  esCero() { return this.m === 0; }
  opuesto() { return new Decimal(-this.m, this.k); }
  abs() { return new Decimal(Math.abs(this.m), this.k); }
  /** Solo para ordenar por dentro o dibujar (la posición en la recta); NUNCA para comparar ni enseñar. */
  valor() { return this.m / pot10(this.k); }
  toString() { return aTexto(this, 'es'); }
}

export const decimal = (m, k = 0) => new Decimal(m, k);

/** Un Decimal desde un Decimal, un entero o un texto ('3,75'); lanza si no se puede. */
export function aDecimal(x) {
  if (x instanceof Decimal) return x;
  if (Number.isSafeInteger(x)) return new Decimal(x, 0);
  if (typeof x === 'string') {
    const d = deTexto(x);
    if (d) return d;
  }
  throw new ErrorDecimales('no-decimal', `${String(x)} no es un decimal`);
}
const D = aDecimal;

/** Los dos con las mismas cifras decimales (las del que más tiene): [ma, mb, k]. */
function igualar(a, b) {
  const x = D(a), y = D(b);
  const k = Math.max(x.k, y.k);
  return [seguro(x.m * pot10(k - x.k), 'igualar'), seguro(y.m * pot10(k - y.k), 'igualar'), k];
}

export function sumar(a, b) { const [x, y, k] = igualar(a, b); return new Decimal(seguro(x + y, 'sumar'), k); }
export function restar(a, b) { const [x, y, k] = igualar(a, b); return new Decimal(seguro(x - y, 'restar'), k); }
export function multiplicar(a, b) { const x = D(a), y = D(b); return new Decimal(seguro(x.m * y.m, 'multiplicar'), x.k + y.k); }

/** Cociente entero hacia el 0 de dos enteros seguros, exacto (con BigInt si hace falta). */
const cocienteHaciaCero = (p, q) => Number(BigInt(p) / BigInt(q));

/** Las cifras decimales que hacen falta para que a : b sea exacta, o null si no termina. */
function cifrasExactas(a, b) {
  const f = fraccion(a.m * pot10(b.k), b.m * pot10(a.k)).simplificar();
  let d = f.den, dos = 0, cinco = 0;
  while (d % 2 === 0) { d /= 2; dos++; }
  while (d % 5 === 0) { d /= 5; cinco++; }
  return d === 1 ? Math.max(dos, cinco) : null;
}

/**
 * a : b → { cociente, resto, exacta }. Con `cifras`, el cociente CORTADO a esas cifras decimales
 * (sin redondear) y el resto de la división original, de modo que b · cociente + resto = a (con el
 * signo del dividendo). Sin `cifras`: si la división termina, la exacta (resto 0); si no, a las
 * centésimas (la regla de la unidad).
 */
export function dividir(a, b, cifras = null) {
  const x = D(a), y = D(b);
  if (y.m === 0) throw new ErrorDecimales('entre-0', 'No se divide entre 0');
  let c = cifras;
  if (c === null) c = cifrasExactas(x, y) ?? 2;
  if (!Number.isInteger(c) || c < 0) throw new ErrorDecimales('cifras', `${cifras} cifras no valen`);
  // a / b = (x.m · 10^y.k) / (y.m · 10^x.k); el cociente con c cifras es trunc(x.m · 10^(y.k + c) / (y.m · 10^x.k)) / 10^c.
  const p = BigInt(x.m) * 10n ** BigInt(y.k + c);
  const q = BigInt(y.m) * 10n ** BigInt(x.k);
  const cociente = new Decimal(seguro(Number(p / q), 'dividir'), c);
  const resto = restar(x, multiplicar(y, cociente)).normalizar();
  return { cociente, resto, exacta: resto.esCero() };
}

/** ×10ⁿ (n negativo: entre 10⁻ⁿ), moviendo la coma: 2,5 · 100 = 250; 3 : 1000 = 0,003. */
export function porPotenciaDe10(d, n) {
  const x = D(d);
  if (!Number.isInteger(n)) throw new ErrorDecimales('potencia', `${n} no es un exponente entero`);
  return x.k - n >= 0 ? new Decimal(x.m, x.k - n) : new Decimal(seguro(x.m * pot10(n - x.k), 'porPotenciaDe10'), 0);
}

/** Cortar a `cifras` cifras decimales (hacia el 0), dejando justo esas cifras: truncar(3,649, 1) = 3,6. */
export function truncar(d, cifras) {
  const x = D(d);
  if (x.k <= cifras) return x.conCifras(cifras);
  return new Decimal(cocienteHaciaCero(x.m, pot10(x.k - cifras)), cifras);
}

/** Redondear a `cifras` cifras decimales (5 o más, hacia arriba en valor absoluto), dejando justo esas cifras: 2,96 → 3,0. */
export function redondear(d, cifras) {
  const x = D(d);
  if (x.k <= cifras) return x.conCifras(cifras);
  const div = pot10(x.k - cifras);
  const a = Math.abs(x.m);
  const q = Math.floor(a / div) + (a % div >= div / 2 ? 1 : 0);
  return new Decimal(signo(x.m) * q, cifras);
}

/** −1, 0 o 1, por valor. Con una Fraccion delante o detrás, también (exacto). */
export function comparar(a, b) {
  if (a instanceof Fraccion || b instanceof Fraccion) return compararFracciones(aFraccionValor(a), aFraccionValor(b));
  const [x, y] = igualar(a, b);
  return signo(x - y);
}

export function ordenar(lista, { descendente = false } = {}) {
  const s = descendente ? -1 : 1;
  return [...lista].sort((a, b) => s * comparar(a, b));
}

/** Cifras decimales de la escritura: 2,50 → 2; 3 → 0. */
export const cifrasDecimales = d => D(d).k;

/** El suelo a `c` cifras (hacia −∞): para intercalar también con negativos. */
function suelo(x, c) {
  if (x.k <= c) return x.conCifras(c);
  const div = pot10(x.k - c);
  return new Decimal(Math.floor(x.m / div), c);
}

/**
 * Un decimal estrictamente entre a y b (en cualquier orden), con las menos cifras posibles:
 * entre 3,4 y 3,5 → 3,41; entre 2 y 3 → 2,1; entre 0,99 y 1 → 0,991.
 */
export function entreDos(a, b) {
  let x = D(a), y = D(b);
  const c0 = comparar(x, y);
  if (c0 === 0) throw new ErrorDecimales('iguales', 'No hay ningún decimal entre dos iguales');
  if (c0 > 0) [x, y] = [y, x];
  for (let c = 0; c <= 15; c++) {
    const candidato = sumar(suelo(x, c), new Decimal(1, c));
    if (comparar(candidato, y) < 0 && comparar(candidato, x) > 0) return candidato;
  }
  throw new ErrorDecimales('entre', 'No se encuentra un decimal entre los dos');
}

/** Los nombres de los órdenes, por su exponente: 0 = unidades, −1 = décimas… */
export const ORDENES = {
  3: { es: 'unidades de millar', en: 'thousands', singular: { es: 'unidad de millar', en: 'thousand' } },
  2: { es: 'centenas', en: 'hundreds', singular: { es: 'centena', en: 'hundred' } },
  1: { es: 'decenas', en: 'tens', singular: { es: 'decena', en: 'ten' } },
  0: { es: 'unidades', en: 'units', singular: { es: 'unidad', en: 'unit' } },
  '-1': { es: 'décimas', en: 'tenths', singular: { es: 'décima', en: 'tenth' } },
  '-2': { es: 'centésimas', en: 'hundredths', singular: { es: 'centésima', en: 'hundredth' } },
  '-3': { es: 'milésimas', en: 'thousandths', singular: { es: 'milésima', en: 'thousandth' } },
};

/**
 * Cada cifra del decimal (sin el signo) con su orden, de la más alta a la última de la escritura:
 * 4,507 → [{ cifra: 4, exponente: 0, valor: 4 }, { cifra: 5, exponente: −1, valor: 0,5 },
 * { cifra: 0, exponente: −2, valor: 0 }, { cifra: 7, exponente: −3, valor: 0,007 }]. Con
 * { soloNoNulas: true }, sin las cifras 0. `valor` es un Decimal.
 */
export function descomponer(d, { soloNoNulas = false } = {}) {
  const x = D(d);
  const cifras = String(Math.abs(x.m)).padStart(x.k + 1, '0');
  const salida = [...cifras].map((c, i) => {
    const exponente = cifras.length - 1 - i - x.k;
    const cifra = Number(c);
    return { cifra, exponente, valor: cifra === 0 ? new Decimal(0, 0) : porPotenciaDe10(new Decimal(cifra, 0), exponente) };
  });
  return soloNoNulas ? salida.filter(t => t.cifra !== 0) : salida;
}

/** La fracción decimal, sin simplificar: 3,75 = 375/100; 0,5 = 5/10. */
export const aFraccionDecimal = d => { const x = D(d); return fraccion(x.m, pot10(x.k)); };
/** La irreducible: 3,75 = 15/4; 1,25 = 5/4 (las impropias se quedan impropias). */
export const aFraccion = d => aFraccionDecimal(d).simplificar();
const aFraccionValor = x => (x instanceof Fraccion ? x : aFraccion(x));

/** El decimal exacto de una fracción (3/4 → 0,75; 7/8 → 0,875), o null si es periódico (1/3). */
export function deFraccion(f) {
  const x = f instanceof Fraccion ? f.simplificar() : fraccion(f).simplificar();
  const c = cifrasExactas(new Decimal(x.num, 0), new Decimal(x.den, 0));
  return c === null ? null : dividir(x.num, x.den, c).cociente;
}

// ─── Escritura y lectura ───────────────────────────────────────────────────────

/** '3,75' (es) o '3.75' (en); el menos, U+2212; con `cifras`, rellena con ceros a la derecha. */
export function aTexto(d, idioma = 'es', cifras = null) {
  let x = D(d);
  if (cifras !== null) {
    const y = x.conCifras(cifras);
    if (!y) throw new ErrorDecimales('cifras', `${aTexto(x, idioma)} tiene más de ${cifras} cifras decimales`);
    x = y;
  }
  const digitos = String(Math.abs(x.m)).padStart(x.k + 1, '0');
  const entera = digitos.slice(0, digitos.length - x.k);
  const parte = x.k ? (idioma === 'en' ? '.' : ',') + digitos.slice(digitos.length - x.k) : '';
  return (x.m < 0 ? MENOS : '') + entera + parte;
}
export const fmtDecimal = aTexto;

const ES_MENOS = /^[-−–]/;

/** Lo que teclea el alumno, a Decimal; null si no es un decimal bien escrito. Ver la cabecera. */
export function deTexto(texto) {
  if (typeof texto !== 'string' && typeof texto !== 'number') return null;
  let s = String(texto).trim();
  let negativo = false;
  if (ES_MENOS.test(s)) { negativo = true; s = s.slice(1).trim(); }
  const r = /^(\d*)(?:[.,](\d+))?$/.exec(s);
  if (!r || (r[1] === '' && r[2] === undefined)) return null;
  const entera = r[1] || '0';
  const parte = r[2] ?? '';
  if (parte.length > 12 || entera.length > 12) return null;
  const m = Number(entera + parte);
  return new Decimal(negativo ? -m : m, parte.length);
}
export const leerDecimal = deTexto;

const DIGITOS_EN = ['nought', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** Las cifras de la parte decimal, como texto ('75' en 3,75). */
const parteDecimal = x => (x.k ? String(Math.abs(x.m)).padStart(x.k + 1, '0').slice(-x.k) : '');
const parteEntera = x => cocienteHaciaCero(Math.abs(x.m), pot10(x.k));

/** 'three point seven five' (en) o 'tres coma setenta y cinco' (es). */
export function enPalabras(d, idioma = 'en') {
  const x = D(d);
  const menos = x.m < 0 ? (idioma === 'en' ? 'minus ' : 'menos ') : '';
  const entera = parteEntera(x);
  const dec = parteDecimal(x);
  if (idioma === 'en') {
    const ent = entera === 0 ? 'nought' : numeroAIngles(entera);
    return menos + ent + (dec ? ' point ' + [...dec].map(c => DIGITOS_EN[c]).join(' ') : '');
  }
  return menos + numeroAEspanol(entera) + (dec ? ' coma ' + decimalesEnEspanol(dec) : '');
}

/** La parte decimal leída en español: '75' → 'setenta y cinco'; '05' → 'cero cinco'; '005' → 'cero cero cinco'. */
function decimalesEnEspanol(dec) {
  const ceros = dec.match(/^0*/)[0].length;
  if (ceros === dec.length) return Array(ceros).fill('cero').join(' ');
  return [...Array(ceros).fill('cero'), numeroAEspanol(Number(dec.slice(ceros)))].join(' ');
}

/** En femenino, para «unidades», «décimas»…: 'veintiuno' → 'veintiuna', 'doscientos' → 'doscientas'. */
const femenino = t => t.replace(/ientos\b/g, 'ientas').replace(/uno$/, 'una').replace(/\bun$/, 'una');

/**
 * Todas las lecturas que valen. Inglés: el 0 de delante como nought, zero o nada (point five), y
 * los ceros de después como nought o zero. Español: con «coma» y con los órdenes (tres unidades
 * y setenta y cinco centésimas; setenta y cinco centésimas si no hay unidades).
 */
export function lecturasValidas(d, idioma = 'en') {
  const x = D(d);
  const entera = parteEntera(x);
  const dec = parteDecimal(x);
  const salida = new Set([enPalabras(x, idioma)]);
  if (idioma === 'en') {
    const menos = x.m < 0 ? ['minus ', 'negative '] : [''];
    // Delante: el número, o con parte entera 0, nought, zero o nada (point five; nada solo si hay decimales).
    const delante = entera !== 0 ? [numeroAIngles(entera)] : ['nought', 'zero', ...(dec ? [''] : [])];
    for (const cero of ['nought', 'zero']) {
      const detras = dec ? 'point ' + [...dec].map(c => (c === '0' ? cero : DIGITOS_EN[c])).join(' ') : '';
      for (const m of menos) for (const e of delante) salida.add(m + [e, detras].filter(Boolean).join(' '));
    }
  } else {
    const menos = x.m < 0 ? 'menos ' : '';
    if (dec && Number(dec) !== 0) {
      const orden = ORDENES[-x.k];
      if (orden) {
        const n = Number(dec);
        const decTxt = `${femenino(numeroAEspanol(n))} ${n === 1 ? orden.singular.es : orden.es}`;
        const unidades = `${femenino(numeroAEspanol(entera))} ${entera === 1 ? 'unidad' : 'unidades'}`;
        salida.add(`${menos}${unidades} y ${decTxt}`);
        if (entera === 0) salida.add(menos + decTxt);
      }
    }
  }
  return [...salida];
}

const plano = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-‐‑–—]/g, ' ').replace(/\s+/g, ' ').trim();

/** ¿Es `texto` una lectura válida de d? Sin mayúsculas, tildes, guiones ni espacios de más. */
export function esLecturaValida(d, texto, idioma = 'en') {
  const t = plano(texto);
  return lecturasValidas(d, idioma).some(l => plano(l) === t);
}

/** '3,75 €' (es) o '€3.75' (en), siempre con dos cifras. */
export function dinero(d, idioma = 'es') {
  const x = D(d);
  return idioma === 'en' ? `${x.m < 0 ? MENOS : ''}€${aTexto(x.abs(), 'en', 2)}` : `${aTexto(x, 'es', 2)} €`;
}

/** Euros y céntimos de una cantidad ≥ 0 con céntimos exactos. */
function eurosYCentimos(d) {
  const x = D(d).conCifras(2);
  if (!x || x.m < 0) throw new ErrorDecimales('dinero', `${String(d)} no es una cantidad de dinero`);
  return [Math.floor(x.m / 100), x.m % 100];
}
const eurosEn = n => `${numeroAIngles(n)} ${n === 1 ? 'euro' : 'euros'}`;
const centsEn = n => `${numeroAIngles(n)} ${n === 1 ? 'cent' : 'cents'}`;
// «un euro», «veintiún euros», «un céntimo»: el uno se apocopa delante del nombre.
const eurosEs = n => `${numeroAEspanol(n).replace(/uno$/, n === 1 ? 'un' : 'ún')} ${n === 1 ? 'euro' : 'euros'}`;
const centimosEs = n => `${numeroAEspanol(n).replace(/uno$/, n === 1 ? 'un' : 'ún')} ${n === 1 ? 'céntimo' : 'céntimos'}`;

/** 'three euros seventy-five' (en) o 'tres euros con setenta y cinco céntimos' (es). Solo cantidades ≥ 0 con céntimos exactos. */
export function dineroEnPalabras(d, idioma = 'en') {
  const [euros, cent] = eurosYCentimos(d);
  if (idioma === 'en') {
    if (!cent) return eurosEn(euros);
    return euros ? `${eurosEn(euros)} ${numeroAIngles(cent)}` : centsEn(cent);
  }
  if (!cent) return eurosEs(euros);
  return euros ? `${eurosEs(euros)} con ${centimosEs(cent)}` : centimosEs(cent);
}

/** Todas las lecturas que valen de una cantidad de dinero (con «and … cents», sin «cents»; con «con» o «y»…). */
export function lecturasDinero(d, idioma = 'en') {
  const [euros, cent] = eurosYCentimos(d);
  const salida = new Set([dineroEnPalabras(d, idioma)]);
  if (euros && cent) {
    if (idioma === 'en') {
      salida.add(`${eurosEn(euros)} and ${centsEn(cent)}`);
      salida.add(`${eurosEn(euros)} ${centsEn(cent)}`);
    } else {
      salida.add(`${eurosEs(euros)} y ${centimosEs(cent)}`);
      salida.add(`${eurosEs(euros)} con ${numeroAEspanol(cent)}`);
    }
  }
  return [...salida];
}

// ─── Errores típicos ───────────────────────────────────────────────────────────

/** El valor equivocado, o null si da lo mismo que el bueno. */
const siDistinto = (mal, bien) => (mal === null || mismoValor(mal, bien) ? null : mal);

/** −1, 0 o 1 comparando la parte entera y luego la decimal «como un número»: 3,9 < 3,10 (null si acierta). */
export function compararPorCifras(a, b) {
  const x = D(a), y = D(b);
  const ex = x.m < 0 ? -parteEntera(x) : parteEntera(x), ey = y.m < 0 ? -parteEntera(y) : parteEntera(y);
  let c = signo(ex - ey);
  if (c === 0) c = signo(Number(parteDecimal(x) || 0) - Number(parteDecimal(y) || 0)) * (x.m < 0 ? -1 : 1);
  return c === comparar(x, y) ? null : c;
}

/** Sumar o restar alineando a la derecha (sin mirar las comas): 2,5 + 1,25 = 1,50 (de 25 + 125). */
export function alinearDerecha(a, b, op = '+') {
  const x = D(a), y = D(b);
  if (x.k === y.k) return null;
  const k = Math.max(x.k, y.k);
  const mal = new Decimal(seguro(op === '−' || op === '-' ? x.m - y.m : x.m + y.m, 'alinearDerecha'), k);
  return siDistinto(mal, op === '−' || op === '-' ? restar(x, y) : sumar(x, y));
}

/**
 * El producto con la coma corrida `desplazamiento` lugares a la derecha (negativo: a la izquierda).
 * Por defecto, el error de siempre: tantas cifras como un solo factor (1,2 · 0,3 = 3,6).
 */
export function comaMalPuesta(a, b, desplazamiento = null) {
  const x = D(a), y = D(b);
  const bien = multiplicar(x, y);
  const n = desplazamiento ?? Math.min(x.k, y.k);
  return n === 0 ? null : siDistinto(porPotenciaDe10(bien, n), bien);
}

/** ×10 (×100…) añadiendo ceros detrás: 2,5 · 10 = 2,50 (vale lo mismo que 2,5). */
export function porDiezAnadiendoCero(d, n = 1) {
  const x = D(d);
  return siDistinto(new Decimal(seguro(x.m * pot10(n), 'porDiezAnadiendoCero'), x.k + n), porPotenciaDe10(x, n));
}

/** :10 (:100…) quitando ceros de detrás: 2,50 : 10 = 2,5 (null si no hay ceros que quitar). */
export function entreDiezQuitandoCero(d, n = 1) {
  const x = D(d);
  // Solo hay error si los ceros que quita son de la parte decimal (en un natural, 30 : 10 = 3 está bien).
  if (x.k < n || x.m % pot10(n) !== 0) return null;
  return siDistinto(new Decimal(x.m / pot10(n), x.k - n), porPotenciaDe10(x, -n));
}

/** Redondear cortando: 3,68 a la décima → 3,6. */
export const redondearTruncando = (d, cifras) => siDistinto(truncar(d, cifras), redondear(d, cifras));

/** Redondear cifra a cifra desde la última: 3,649 → 3,65 → 3,7 (y no 3,6). */
export function redondearEnCadena(d, cifras) {
  let x = D(d);
  for (let k = x.k - 1; k >= cifras; k--) x = redondear(x, k);
  return siDistinto(x, redondear(d, cifras));
}

/** El cociente sin la coma: 7,5 : 3 = 25 (y no 2,5). */
export function olvidarComaCociente(a, b, cifras = null) {
  const { cociente } = dividir(a, b, cifras);
  return cociente.k === 0 ? null : siDistinto(new Decimal(cociente.m, 0), cociente);
}

/** En la división con prueba, el resto de la división sin coma: 6,384 : 0,49 → 0,42 (y no 0,0042). */
export function restoSinDeshacer(a, b, cifras = 2) {
  const y = D(b);
  const { resto } = dividir(a, b, cifras);
  return y.k === 0 || resto.esCero() ? null : siDistinto(porPotenciaDe10(resto, y.k), resto);
}

/** Tomar el redondeo por el decimal de una fracción periódica: 1/3 = 0,33 (null si la fracción da un decimal exacto). */
export function periodicoPorRedondeo(f, cifras = 2) {
  const x = f instanceof Fraccion ? f : fraccion(f);
  if (deFraccion(x) !== null) return null;
  return redondear(dividir(x.num, x.den, cifras + 1).cociente, cifras);
}

/** Leer centésimas como décimas (y milésimas como centésimas): 0,05 → 0,5. */
export function decimasPorCentesimas(d) {
  const x = D(d);
  return x.k === 0 ? null : siDistinto(new Decimal(x.m, x.k - 1), x);
}

/** Dividir el denominador entre el numerador: 3/4 = 1,33 (cortado a las centésimas). */
export function fraccionAlReves(f) {
  const x = f instanceof Fraccion ? f : fraccion(f);
  if (x.num === 0) return null;
  return siDistinto(dividir(x.den, x.num, 2).cociente, x);
}

/** La fracción decimal con un cero de menos abajo: 0,75 = 75/10 (0,5 = 5/100, con uno de más). */
export function denominadorEquivocado(d) {
  const x = D(d);
  if (x.k === 0) return null;
  return siDistinto(fraccion(x.m, pot10(x.k >= 2 ? x.k - 1 : x.k + 1)), x);
}

/** Céntimos escritos como décimas de euro: 5 céntimos = 0,5 € (y no 0,05 €). Recibe los céntimos (entero). */
export function centimosPorEuros(centimos) {
  if (!Number.isSafeInteger(centimos) || centimos <= 0 || centimos >= 10) return null;
  return siDistinto(new Decimal(centimos, 1), new Decimal(centimos, 2));
}

/** Decimales negativos: el resultado con el signo cambiado (−3,5 + 1,25 = 2,25). */
export function signoPerdido(resultado) { const r = D(resultado); return r.m < 0 ? r.opuesto() : null; }

/** Al dividir entre un decimal, mover la coma solo en el divisor: 7,5 : 2,5 → 7,5 : 25 = 0,3 (y no 3). */
export function comaSoloEnDivisor(a, b, cifras = null) {
  const y = D(b);
  if (y.k === 0) return null;
  return siDistinto(dividir(a, porPotenciaDe10(y, y.k), cifras).cociente, dividir(a, b, cifras).cociente);
}

/** El numerador y el denominador escritos detrás de la coma: 3/4 = 0,34. */
export function numeradorComoDecimas(f) {
  const x = f instanceof Fraccion ? f : fraccion(f);
  if (x.num <= 0) return null;
  const cifras = `${x.num}${x.den}`;
  return siDistinto(new Decimal(Number(cifras), cifras.length), x);
}

/** Redondear a un orden de menos (a la centésima cuando se pedía la décima): 3,649 a la décima → 3,65. */
export const redondearOtroOrden = (d, cifras) => (D(d).k <= cifras + 1 ? null : siDistinto(redondear(d, cifras + 1), redondear(d, cifras)));

/**
 * Un periódico escrito con puntos suspensivos, sin arco (acta, punto f): 1/3 → '0,333…', 1/6 → '0,166…'.
 * `cifras` son las que se enseñan antes de «…» (3 por defecto). Si la fracción da un decimal exacto, ese, sin «…».
 */
export function aTextoPeriodico(f, idioma = 'es', cifras = 3) {
  const x = f instanceof Fraccion ? f : fraccion(f);
  const exacto = deFraccion(x);
  return exacto ? aTexto(exacto, idioma) : `${aTexto(dividir(x.num, x.den, cifras).cociente, idioma)}…`;
}

export const ERRORES_TIPICOS = {
  'compara-por-cifras': { fn: compararPorCifras, devuelve: 'comparacion', ejemplo: '3,9 < 3,10',
    nombre: { es: 'Ha comparado la parte decimal como si fuera un número entero', en: 'Compared the decimal parts as if they were whole numbers' } },
  'alinea-a-la-derecha': { fn: alinearDerecha, devuelve: 'decimal', ejemplo: '2,5 + 1,25 = 1,50',
    nombre: { es: 'Ha colocado los números a la derecha, sin poner coma debajo de coma', en: 'Lined the numbers up on the right, not the decimal points' } },
  'coma-mal-puesta': { fn: comaMalPuesta, devuelve: 'decimal', ejemplo: '1,2 · 0,3 = 3,6',
    nombre: { es: 'Ha puesto mal la coma del producto: lleva tantas cifras decimales como los dos factores juntos', en: 'Put the decimal point in the wrong place in the product' } },
  'por-diez-anadiendo-cero': { fn: porDiezAnadiendoCero, devuelve: 'decimal', ejemplo: '2,5 · 10 = 2,50',
    nombre: { es: 'Ha multiplicado por 10 añadiendo un cero, en vez de mover la coma', en: 'Multiplied by 10 by adding a zero instead of moving the decimal point' } },
  'entre-diez-quitando-cero': { fn: entreDiezQuitandoCero, devuelve: 'decimal', ejemplo: '2,50 : 10 = 2,5',
    nombre: { es: 'Ha dividido entre 10 quitando un cero, en vez de mover la coma', en: 'Divided by 10 by taking away a zero instead of moving the decimal point' } },
  'redondea-truncando': { fn: redondearTruncando, devuelve: 'decimal', ejemplo: '3,68 → 3,6',
    nombre: { es: 'Ha cortado en vez de redondear', en: 'Cut the number off instead of rounding it' } },
  'redondea-en-cadena': { fn: redondearEnCadena, devuelve: 'decimal', ejemplo: '3,649 → 3,65 → 3,7',
    nombre: { es: 'Ha redondeado cifra a cifra desde la última', en: 'Rounded digit by digit from the last one' } },
  'olvida-coma-cociente': { fn: olvidarComaCociente, devuelve: 'decimal', ejemplo: '7,5 : 3 = 25',
    nombre: { es: 'Se ha olvidado de poner la coma en el cociente', en: 'Forgot the decimal point in the quotient' } },
  'resto-sin-deshacer': { fn: restoSinDeshacer, devuelve: 'decimal', ejemplo: '6,384 : 0,49 → resto 0,42',
    nombre: { es: 'Ha dado el resto de la división sin coma, no el de la original', en: 'Gave the remainder of the division without the decimal point, not of the original one' } },
  'periodico-por-redondeo': { fn: periodicoPorRedondeo, devuelve: 'decimal', ejemplo: '1/3 = 0,33',
    nombre: { es: 'Ha tomado el redondeo por el decimal: 1/3 es 0,333…, que no termina', en: 'Took the rounded number for the decimal: 1/3 is 0.333…, which never ends' } },
  'decimas-por-centesimas': { fn: decimasPorCentesimas, devuelve: 'decimal', ejemplo: '0,05 = 0,5',
    nombre: { es: 'Ha confundido las décimas con las centésimas', en: 'Mixed up tenths and hundredths' } },
  'fraccion-al-reves': { fn: fraccionAlReves, devuelve: 'decimal', ejemplo: '3/4 = 1,33',
    nombre: { es: 'Ha dividido el denominador entre el numerador', en: 'Divided the denominator by the numerator' } },
  'denominador-equivocado': { fn: denominadorEquivocado, devuelve: 'fraccion', ejemplo: '0,75 = 75/10',
    nombre: { es: 'Ha puesto mal el denominador: tantos ceros como cifras decimales', en: 'Wrong denominator: as many zeros as decimal places' } },
  'centimos-por-euros': { fn: centimosPorEuros, devuelve: 'decimal', ejemplo: '5 céntimos = 0,5 €',
    nombre: { es: 'Ha escrito los céntimos como décimas de euro', en: 'Wrote the cents as tenths of a euro' } },
  'signo-perdido': { fn: signoPerdido, devuelve: 'decimal', ejemplo: '−3,5 + 1,25 = 2,25',
    nombre: { es: 'Se ha perdido el signo del resultado', en: 'Lost the sign of the answer' } },
  'coma-solo-en-divisor': { fn: comaSoloEnDivisor, devuelve: 'decimal', ejemplo: '7,5 : 2,5 → 7,5 : 25 = 0,3',
    nombre: { es: 'Ha movido la coma solo en el divisor: hay que moverla en los dos', en: 'Moved the decimal point in the divisor only: it moves in both' } },
  'numerador-como-decimas': { fn: numeradorComoDecimas, devuelve: 'decimal', ejemplo: '3/4 = 0,34',
    nombre: { es: 'Ha escrito el numerador y el denominador detrás de la coma, sin dividir', en: 'Wrote the numerator and the denominator after the point instead of dividing' } },
  'redondea-otro-orden': { fn: redondearOtroOrden, devuelve: 'decimal', ejemplo: '3,649 a la décima → 3,65',
    nombre: { es: 'Ha redondeado a otro orden del que se pedía', en: 'Rounded to the wrong place' } },
};

/**
 * A qué cálculo se puede aplicar cada error (para «¿qué error es?» de `errores5`: los distractores
 * son errores del mismo tipo de cálculo que no se han cometido).
 */
export const APLICA_A = {
  'compara-por-cifras': 'comparacion', 'alinea-a-la-derecha': 'suma', 'coma-mal-puesta': 'producto',
  'por-diez-anadiendo-cero': 'potencia10', 'entre-diez-quitando-cero': 'potencia10', 'redondea-truncando': 'redondeo',
  'redondea-en-cadena': 'redondeo', 'redondea-otro-orden': 'redondeo', 'olvida-coma-cociente': 'division',
  'resto-sin-deshacer': 'division', 'coma-solo-en-divisor': 'division', 'periodico-por-redondeo': 'fraccion',
  'decimas-por-centesimas': 'lectura', 'fraccion-al-reves': 'fraccion', 'numerador-como-decimas': 'fraccion',
  'denominador-equivocado': 'fraccion', 'centimos-por-euros': 'dinero', 'signo-perdido': 'signo',
};

/** Lo que NO es un error (regla 4): ceros finales, 2,50 € por 2,5 €, nought o zero, un decimal o su fracción. */
export const NO_ES_ERROR = {
  'ceros-finales': { es: 'Escribir ceros al final de la parte decimal (2,50 = 2,5)', en: 'Writing zeros at the end of the decimal part (2.50 = 2.5)' },
  'dinero-dos-cifras': { es: 'En dinero, escribir 2,50 € o 2,5 €', en: 'With money, writing €2.50 or €2.5' },
  'nought-zero': { es: 'Leer el 0 como nought o como zero', en: 'Reading 0 as nought or as zero' },
  'decimal-o-fraccion': { es: 'Dar el decimal o su fracción (0,5 = 1/2)', en: 'Giving the decimal or its fraction (0.5 = 1/2)' },
};

// ─── Distractores ──────────────────────────────────────────────────────────────

/** Una clave por valor para decimales, fracciones, enteros y comparaciones (−1, 0, 1 se quedan como están). */
function claveValor(v) {
  if (v instanceof Fraccion) return v.simplificar().num + '/' + v.simplificar().den;
  if (v instanceof Decimal) { const f = aFraccion(v); return f.num + '/' + f.den; }
  if (Number.isSafeInteger(v)) return v + '/1';
  if (typeof v === 'string') { const d = deTexto(v); if (d) return claveValor(d); }
  return 'x:' + String(v);
}

/** ¿Valen lo mismo? 0,5, 0,50, 1/2 y 2/4 sí. */
export const mismoValor = (a, b) => claveValor(a) === claveValor(b);
/** ¿Hay dos de la lista que valgan lo mismo? (el test de «ninguna opción equivale a otra»). */
export function hayIguales(lista) {
  const claves = lista.map(claveValor);
  return new Set(claves).size !== claves.length;
}

/**
 * [{ valor, error }] de los candidatos [[id, …args], …] que sirven: sin null, sin la correcta y
 * sin dos que valgan lo mismo (se queda el primero). El orden es el de los candidatos: barájalos
 * antes si son más de los que caben (trampa del motor: `construirOpciones` toma los primeros).
 */
export function distractores(candidatos, correcta) {
  const vistos = new Set([claveValor(correcta)]);
  const salida = [];
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id];
    if (!e) throw new Error(`Error típico desconocido: ${id}`);
    const valor = e.fn(...args);
    if (valor === null) continue;
    const clave = claveValor(valor);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push({ valor, error: id });
  }
  return salida;
}
