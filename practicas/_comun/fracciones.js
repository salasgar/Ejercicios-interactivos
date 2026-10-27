// Fracciones para las prácticas de la unidad 4 (PU2, tarea 98): el modelo de
// fracción, cómo se pintan, se leen y se dicen en los dos idiomas, los errores
// típicos de la unidad (de donde salen los distractores) y un evaluador de
// expresiones con fracciones y su paso a paso, hermano del de `enteros.js`. Puro
// (sin DOM ni red). Los dibujos (barras, pizzas, cuadrículas y la recta) están en
// `dibujo-fracciones.js`. Probado en `tests/practicas-fracciones.test.js`.
//
// ─── El modelo ─────────────────────────────────────────────────────────────────
//
//   fraccion(5, -12) → −5/12. Inmutable; el denominador siempre > 0 y el signo en el
//   numerador. NO se simplifica sola: 6/8 se queda 6/8 hasta que se pide
//   `simplificar()`, porque muchas prácticas preguntan justo por la forma.
//   Las operaciones aceptan una Fraccion, un entero o un texto que lea `leerFraccion`.
//     a.sumar(b), a.restar(b)    sobre el m.c.m. de los denominadores, sin simplificar:
//                                1/4 + 2/3 = 11/12; 5/9 − 2/9 = 3/9
//     a.multiplicar(b)           arriba por arriba y abajo por abajo: 2/5 · 3/4 = 6/20
//     a.dividir(b)               por la inversa: 2/3 : 4/5 = 10/12 (los dos métodos dan esto)
//     potencia(n)                (2/3)² = 4/9 (la base negativa no entra en la app)
//     simplificar()              la irreducible, con su signo: −6/8 → −3/4
//     simplificarPor(k)          arriba y abajo entre k, o null si k no divide a los dos
//     equivalentePor(k), amplificaciones(hasta), inversa(), opuesta(), de(cantidad)
//     equals(b)                  por valor: 1/2 equals 4/8. `mismaForma(b)`: 1/2 y 1/2 sí, 4/8 no
//     clave()                    la irreducible como texto ('−3/4'): sirve para un Set de valores
//     valor()                    el decimal: SOLO para ordenar por dentro, nunca para mostrar
//   comparar(a, b) → −1, 0 o 1, con enteros (productos cruzados), nunca con decimales.
//   comunDenominador(a, b, …) → { mcm, fracciones }: 5/6 y 3/8 → 24, [20/24, 9/24].
//
// ─── Escritura ─────────────────────────────────────────────────────────────────
//
//   htmlFraccion(f) → <span class="frac"><span>3</span><span>5</span></span>: la raya
//   horizontal la pone `.frac` de `_comun/estilos.css`. Un natural va sin raya (3), salvo
//   con { conUno: true } (3/1). Una negativa lleva el menos (U+2212) delante de la raya,
//   a su altura, dentro de <span class="frac-neg"> para que no se separe al partir la
//   línea; con { parentesis: true }, entre paréntesis si es negativa.
//   htmlRaya(arriba, abajo) pinta la raya con lo que se quiera arriba y abajo (un □, un campo).
//   htmlCuenta([a, '+', b, '=', c]) → la cuenta en línea; una negativa que va detrás de
//   una operación sale entre paréntesis: 1/2 · (−3/4).
//   aTexto(f) → '−3/5' (con U+2212 y barra): para claves, consola y frases en inglés hablado.
//   leerFraccion('3 / 5') → 3/5. Acepta /, ⁄ y ∕, espacios, un natural, y las tres
//   escrituras de una negativa (−5/12, (−5)/12, 5/(−12), con -, − o –); null con
//   decimales, con 0 abajo, vacío o basura. Devuelve la fracción tal como se escribió.
//
// ─── En palabras ───────────────────────────────────────────────────────────────
//
//   enPalabras(f, 'en') → 'three fifths', 'a half', 'a quarter', 'three quarters',
//   'one third', 'minus three fifths'. enPalabras(f, 'es') → 'tres quintos', 'un medio',
//   'siete doceavos', 'menos tres quintos'.
//   lecturasValidas(f, idioma) → todas las que valen (one half, one fourth, three fourths,
//   a third, three over five, negative three fifths; la mitad, dozavo, tres partido por
//   cinco…): NINGUNA puede ser distractor en una pregunta de lectura.
//   esLecturaValida(f, texto, idioma) compara sin mayúsculas, guiones ni espacios de más.
//
// ─── Errores típicos ───────────────────────────────────────────────────────────
//
//   Cada error de la columna `nota` del inventario es una función que, con los números
//   del ítem, da el resultado equivocado, o `null` cuando ese error no sirve de
//   distractor ahí (da lo mismo que la cuenta buena o no se aplica):
//   sumarArribaYAbajo(1/2, 1/3) → 2/5. `ERRORES_TIPICOS[id]` = { fn, ejemplo, nombre: { es,
//   en } }; el id es el `error` de `api.responder`. `distractores([[id, …args], …], correcta)`
//   junta los que sirven, **sin dos que valgan lo mismo** entre ellos ni con la correcta
//   (regla 1 de la unidad: dos equivalentes son la misma respuesta). Lo que NO es un
//   error está en NO_ES_ERROR (dividir término a término si es exacto, otro denominador
//   común, simplificar antes o después, «en cruz» al dividir).
//
// ─── Expresiones ───────────────────────────────────────────────────────────────
//
//   analizar('1/2 + 1/3 · 3/4') → árbol. «a/b» (dos naturales con la barra en medio) es
//   UNA fracción; la división es «:» (o ÷). Admite + − · : ( ) [ ], el menos delante,
//   potencias con ^ o superíndice ((2/3)²) y también * x ×. El árbol es el de
//   `enteros.js`, con `valor` una Fraccion en los { tipo: 'num' } (tal como se escribió:
//   6/8 se queda 6/8). evaluar(x) → la Fraccion irreducible.
//   html(x, { marcarOperadores, envolver, dividir }) y aTextoExpresion(x), como en enteros.js
//   (las operaciones marcadas van en <span class="frac-op" data-ruta="…">).
//   pasosPosibles(x), aplicarPaso(x, p), pasoCanonico(x), cadenaDePasos(x): con la regla
//   de Juan Luis del 8-10 (lo independiente vale; en una cadena del mismo nivel, de
//   izquierda a derecha salvo que adelantar la segunda no cambie el valor, `cadena: true`).
//   El `valor` de un paso es irreducible; `sinSimplificar`, la cuenta tal cual (1/3 · 3/4 = 3/12).

import { mcd, mcm } from './aritmetica.js';
import { MENOS } from './enteros.js';
import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';

export { MENOS };

export class ErrorFracciones extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorFracciones';
    this.codigo = codigo;
  }
}

/** Quita el −0 de JavaScript. */
const limpio = n => (n === 0 ? 0 : n);
const signo = n => (n > 0 ? 1 : n < 0 ? -1 : 0);
const mcdAbs = (a, b) => mcd(Math.abs(a), Math.abs(b));

// ─── El modelo ─────────────────────────────────────────────────────────────────

export class Fraccion {
  constructor(num, den = 1) {
    if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) throw new ErrorFracciones('no-entero', `${num}/${den} no tiene términos enteros`);
    if (den === 0) throw new ErrorFracciones('denominador-0', `${num}/0 no existe`);
    if (den < 0) { num = -num; den = -den; }
    this.num = limpio(num);
    this.den = den;
    Object.freeze(this);
  }

  static deNatural(n) { return new Fraccion(n, 1); }

  /** La irreducible, con su signo. 0/5 → 0/1. */
  simplificar() {
    const g = mcdAbs(this.num, this.den);
    return new Fraccion(this.num / g, this.den / g);
  }
  esIrreducible() { return mcdAbs(this.num, this.den) === 1; }
  /** Arriba y abajo entre k (un paso de simplificar), o null si k no divide a los dos. */
  simplificarPor(k) {
    if (!Number.isInteger(k) || k < 1 || this.num % k !== 0 || this.den % k !== 0) return null;
    return new Fraccion(this.num / k, this.den / k);
  }
  /** Arriba y abajo por k (k natural ≥ 1). */
  equivalentePor(k) {
    if (!Number.isInteger(k) || k < 1) throw new ErrorFracciones('factor', `No se amplía por ${k}`);
    return new Fraccion(this.num * k, this.den * k);
  }
  /** Las ampliadas por 2, 3, …, hasta: 2/3 → 4/6, 6/9, … */
  amplificaciones(hasta) {
    const salida = [];
    for (let k = 2; k <= hasta; k++) salida.push(this.equivalentePor(k));
    return salida;
  }

  equals(otra) { const o = aFraccion(otra); return this.num * o.den === o.num * this.den; }
  mismaForma(otra) { const o = aFraccion(otra); return this.num === o.num && this.den === o.den; }

  sumar(otra) { return sumaOResta(this, aFraccion(otra), 1); }
  restar(otra) { return sumaOResta(this, aFraccion(otra), -1); }
  multiplicar(otra) { const o = aFraccion(otra); return new Fraccion(this.num * o.num, this.den * o.den); }
  dividir(otra) {
    const o = aFraccion(otra);
    if (o.num === 0) throw new ErrorFracciones('division-entre-0', `${aTexto(this)} : 0 no se puede hacer`);
    return new Fraccion(this.num * o.den, this.den * o.num);
  }
  inversa() {
    if (this.num === 0) throw new ErrorFracciones('division-entre-0', '0 no tiene inversa');
    return new Fraccion(this.den, this.num);
  }
  opuesta() { return new Fraccion(-this.num, this.den); }
  /** (a/b)ⁿ con n natural: se elevan los dos términos. */
  potencia(n) {
    if (!Number.isInteger(n) || n < 0) throw new ErrorFracciones('exponente', `Exponente ${n}`);
    return new Fraccion(this.num ** n, this.den ** n);
  }
  /** La fracción de una cantidad entera: 3/5 de 40 = 24. Lanza 'no-exacta' si no da un entero. */
  de(cantidad) {
    if (!Number.isSafeInteger(cantidad)) throw new ErrorFracciones('no-entero', `${cantidad} no es entero`);
    const p = cantidad * this.num;
    if (p % this.den !== 0) throw new ErrorFracciones('no-exacta', `${aTexto(this)} de ${cantidad} no es exacta`);
    return limpio(p / this.den);
  }

  esNegativa() { return this.num < 0; }
  esCero() { return this.num === 0; }
  /** Propia: menor que 1 (en valor absoluto). 6/6 es impropia (decisión de Juan Luis, 26-10). */
  esPropia() { return Math.abs(this.num) < this.den; }
  esImpropia() { return !this.esPropia(); }
  /** ¿Vale un entero? 12/4 sí; 3/5 no. `esNatural`: además, ≥ 0. */
  esEntera() { return this.num % this.den === 0; }
  esNatural() { return this.esEntera() && this.num >= 0; }
  /** El entero que vale, o null. */
  aEntero() { return this.esEntera() ? limpio(this.num / this.den) : null; }
  /** El decimal: solo para ordenar por dentro (regla de la ficha 98), nunca para mostrar ni comparar. */
  valor() { return this.num / this.den; }
  clave() { return aTexto(this.simplificar()); }
  toString() { return aTexto(this); }
}

function sumaOResta(a, b, s) {
  const m = mcm(a.den, b.den);
  return new Fraccion(a.num * (m / a.den) + s * b.num * (m / b.den), m);
}

/** fraccion(5, -12) → −5/12. */
export const fraccion = (num, den = 1) => new Fraccion(num, den);
export const deNatural = n => new Fraccion(n, 1);

/** Una Fraccion a partir de una Fraccion, un entero o un texto ('3/5'). */
export function aFraccion(x) {
  if (x instanceof Fraccion) return x;
  if (Number.isSafeInteger(x)) return new Fraccion(x, 1);
  if (typeof x === 'string') {
    const f = leerFraccion(x);
    if (f) return f;
  }
  if (x && typeof x === 'object' && Number.isSafeInteger(x.num) && Number.isSafeInteger(x.den)) return new Fraccion(x.num, x.den);
  throw new ErrorFracciones('no-es-fraccion', `«${x}» no es una fracción`);
}

/** −1, 0 o 1, por productos cruzados (con los denominadores positivos). */
export function comparar(a, b) {
  const x = aFraccion(a), y = aFraccion(b);
  return signo(x.num * y.den - y.num * x.den);
}

export const sonEquivalentes = (a, b) => aFraccion(a).equals(b);

/** Los dos productos cruzados de a/b y c/d: [a · d, b · c]. Iguales si son equivalentes. */
export function productosCruzados(a, b) {
  const x = aFraccion(a), y = aFraccion(b);
  return [x.num * y.den, x.den * y.num];
}

/** Común denominador con el m.c.m.: { mcm, fracciones } (las equivalentes, en el mismo orden). */
export function comunDenominador(...lista) {
  const fs = lista.flat().map(aFraccion);
  const m = mcm(...fs.map(f => f.den));
  return { mcm: m, fracciones: fs.map(f => f.equivalentePor(m / f.den)) };
}

/** Ordenadas de menor a mayor (o de mayor a menor), con `comparar`. */
export function ordenar(lista, { descendente = false } = {}) {
  return lista.map(aFraccion).sort((a, b) => (descendente ? -1 : 1) * comparar(a, b));
}

// ─── Escritura ─────────────────────────────────────────────────────────────────

/** La fracción como texto plano: '3/5', '−3/5', '4' (con { conUno: true }, '4/1'). */
export function aTexto(x, { conUno = false } = {}) {
  const f = aFraccion(x);
  const s = f.num < 0 ? MENOS : '';
  return f.den === 1 && !conUno ? `${s}${Math.abs(f.num)}` : `${s}${Math.abs(f.num)}/${f.den}`;
}

/** La raya con lo que se quiera arriba y abajo (HTML): htmlRaya('□', 20). */
export function htmlRaya(arriba, abajo, { compacta = false } = {}) {
  return `<span class="frac${compacta ? ' frac--compacta' : ''}"><span>${arriba}</span><span>${abajo}</span></span>`;
}

/** La fracción en HTML con raya horizontal (ver la cabecera). */
export function htmlFraccion(x, { compacta = false, conUno = false, parentesis = false } = {}) {
  const f = aFraccion(x);
  const n = Math.abs(f.num);
  const cuerpo = f.den === 1 && !conUno ? `${n}` : htmlRaya(n, f.den, { compacta });
  if (f.num >= 0) return cuerpo;
  const s = `<span class="frac-neg">${MENOS}${cuerpo}</span>`;
  return parentesis ? `(${s})` : s;
}

const SIMBOLOS = { '+': '+', '-': MENOS, [MENOS]: MENOS, '*': '·', '·': '·', ':': ':', '÷': '÷', '=': '=', '<': '&lt;', '>': '&gt;', '(': '(', ')': ')', '[': '[', ']': ']' };
const ABREN = new Set(['(', '[']);
const CIERRAN = new Set([')', ']']);
const OPERACIONES = new Set(['+', '-', MENOS, '*', '·', ':', '÷']);

/**
 * Una cuenta en línea: htmlCuenta([1/2, '+', 1/3, '=', 5/6]). Las fracciones pueden ser
 * Fraccion, enteros o textos ('3/5'); los operadores, + - · * : ÷ = < > y paréntesis;
 * cualquier otro texto se pone tal cual (un □, un campo). Una negativa detrás de una
 * operación (+ − · : ÷) va entre paréntesis; detrás de «=», «<», «>», «(» o la primera, no.
 */
export function htmlCuenta(partes, { compacta = false } = {}) {
  let s = '';
  let anterior = null;
  for (const p of partes) {
    const esSimbolo = typeof p === 'string' && SIMBOLOS[p] !== undefined;
    let trozo;
    if (esSimbolo) {
      trozo = SIMBOLOS[p];
    } else {
      const f = p instanceof Fraccion || Number.isSafeInteger(p) ? aFraccion(p) : (typeof p === 'string' ? leerFraccion(p) : null);
      const tras = OPERACIONES.has(anterior);
      trozo = f ? htmlFraccion(f, { compacta, parentesis: tras }) : String(p);
    }
    const pegado = anterior === null || ABREN.has(anterior) || (esSimbolo && CIERRAN.has(p));
    s += (pegado ? '' : ' ') + trozo;
    anterior = esSimbolo ? p : '·frac·';
  }
  return `<span class="cuenta-frac">${s}</span>`;
}

const BARRA = /[⁄∕]/g;
const GUIONES = /[−‒–—﹣－]/g;
// El numerador lleva su signo delante o entre paréntesis (nunca dos signos seguidos: «--3/5» no vale);
// el denominador, también suelto (5/-12).
const NUMERADOR = String.raw`(\d+|\([+-]?\d+\))`;
const DENOMINADOR = String.raw`([+-]?\d+|\([+-]?\d+\))`;
const FORMA = new RegExp(`^([+-]?)${NUMERADOR}(?:/${DENOMINADOR})?$`);

/** Lo que escribe el alumno, como Fraccion (tal cual, sin simplificar), o null (ver la cabecera). */
export function leerFraccion(texto) {
  if (/\d\s+\d/.test(String(texto ?? ''))) return null;   // «3 5» no es 35
  let t = String(texto ?? '').replace(/[\s  ]+/g, '').replace(GUIONES, '-').replace(BARRA, '/');
  if (/^\(.*\)$/.test(t) && !/^\([^()]*\)\/|\/\(/.test(t)) t = t.slice(1, -1);
  const m = FORMA.exec(t);
  if (!m) return null;
  const termino = s => Number(s.replace(/[()]/g, ''));
  const num = termino(m[2]) * (m[1] === '-' ? -1 : 1);
  const den = m[3] === undefined ? 1 : termino(m[3]);
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den) || den === 0) return null;
  return new Fraccion(num, den);
}

// ─── En palabras ───────────────────────────────────────────────────────────────

const EN_ORDINAL_IRREGULAR = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };

/** El ordinal inglés: 5 → fifth, 21 → twenty-first, 40 → fortieth. */
export function ordinalIngles(n) {
  const c = numeroAIngles(n);
  const m = /([a-z]+)$/.exec(c);
  const ultima = m[1];
  const ord = EN_ORDINAL_IRREGULAR[ultima] ?? (ultima.endsWith('y') ? `${ultima.slice(0, -1)}ieth` : `${ultima}th`);
  return c.slice(0, -ultima.length) + ord;
}

const ES_PARTES = { 2: 'medio', 3: 'tercio', 4: 'cuarto', 5: 'quinto', 6: 'sexto', 7: 'séptimo', 8: 'octavo', 9: 'noveno', 10: 'décimo', 100: 'centésimo', 1000: 'milésimo' };
/** Formas también admitidas por la RAE (onzavo, dozavo…), que nunca son distractor. */
const ES_PARTES_VARIANTES = { 11: ['onzavo'], 12: ['dozavo'], 13: ['trezavo'], 14: ['catorzavo'], 15: ['quinzavo'], 20: ['veintavo'], 100: ['centavo'] };
const sinTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** El partitivo español en singular (quinto, doceavo, treintaidosavo), o null si no lo hay (se dice «partido por»). */
export function partitivoEspanol(d) {
  if (ES_PARTES[d]) return ES_PARTES[d];
  if (d < 11 || d > 99) return null;
  const c = sinTildes(numeroAEspanol(d)).replace(/ y /g, 'i').replace(/\s+/g, '');
  if (c.endsWith('uno')) return `${c.slice(0, -1)}avo`;
  if (c.endsWith('a')) return `${c}vo`;
  return `${c}avo`;
}

/** El cardinal español delante de un nombre masculino: uno → un, veintiuno → veintiún. */
function cardinalEspanol(n) {
  const s = numeroAEspanol(n);
  if (s === 'uno') return 'un';
  if (s.endsWith('veintiuno')) return `${s.slice(0, -'veintiuno'.length)}veintiún`;
  if (s.endsWith(' uno')) return `${s.slice(0, -'uno'.length)}un`;
  return s;
}

function lecturasIngles(f) {
  const n = Math.abs(f.num), d = f.den;
  if (d === 1) return [numeroAIngles(n)];
  const cn = numeroAIngles(n), cd = numeroAIngles(d);
  const lista = [];
  if (d === 2) lista.push(...(n === 1 ? ['a half', 'one half'] : [`${cn} halves`]));
  else if (d === 4) lista.push(...(n === 1 ? ['a quarter', 'one quarter', 'a fourth', 'one fourth'] : [`${cn} quarters`, `${cn} fourths`]));
  else {
    // 1/100 es «one hundredth», no «one one hundredth».
    const o = ordinalIngles(d).replace(/^one (hundred|thousand)/, '$1');
    lista.push(...(n === 1 ? [`one ${o}`, `a ${o}`] : [`${cn} ${o}s`]));
  }
  lista.push(`${cn} over ${cd}`);
  return lista;
}

function lecturasEspanol(f) {
  const n = Math.abs(f.num), d = f.den;
  if (d === 1) return [numeroAEspanol(n)];
  const lista = [];
  const plural = s => (n === 1 ? s : `${s}s`);
  const p = partitivoEspanol(d);
  if (p) {
    lista.push(`${cardinalEspanol(n)} ${plural(p)}`);
    for (const v of ES_PARTES_VARIANTES[d] ?? []) lista.push(`${cardinalEspanol(n)} ${plural(v)}`);
    if (d === 2 && n === 1) lista.push('la mitad');
  }
  lista.push(`${numeroAEspanol(n)} partido por ${numeroAEspanol(d)}`);
  return lista;
}

/** Todas las lecturas que valen (la primera es la de `enPalabras`). */
export function lecturasValidas(x, idioma = 'en') {
  const f = aFraccion(x);
  const base = idioma === 'es' ? lecturasEspanol(f) : lecturasIngles(f);
  if (f.num >= 0) return base;
  return idioma === 'es' ? base.map(s => `menos ${s}`) : [...base.map(s => `minus ${s}`), ...base.map(s => `negative ${s}`)];
}

/** La lectura de la fracción tal como está escrita (3/5, no su irreducible). */
export function enPalabras(x, idioma = 'en') {
  return lecturasValidas(x, idioma)[0];
}

const normalizarLectura = s => sinTildes(String(s ?? '').toLowerCase()).replace(/[-\s]+/g, ' ').trim();

/** ¿Es una lectura válida? Sin mayúsculas, tildes, guiones ni espacios de más (three-fifths = three fifths). */
export function esLecturaValida(x, texto, idioma = 'en') {
  const t = normalizarLectura(texto);
  return lecturasValidas(x, idioma).some(l => normalizarLectura(l) === t);
}

// ─── Errores típicos ───────────────────────────────────────────────────────────
//
// Todas reciben Fraccion, enteros o textos; devuelven una Fraccion (o un entero, o una
// comparación −1/0/1, según el error) o null cuando el error no sirve ahí.

const F = aFraccion;
const siDistinta = (mal, bien) => (mal === null || F(mal).equals(bien) ? null : mal);
const fr = (num, den) => (den === 0 || !Number.isSafeInteger(num) || !Number.isSafeInteger(den) ? null : new Fraccion(num, den));

// Sumas y restas
/** 1/2 + 1/3 = 2/5: suma los numeradores y los denominadores (también 3/7 + 2/7 = 5/14 y 2 + 1/3 = 3/4). */
export function sumarArribaYAbajo(a, b) { const x = F(a), y = F(b); return siDistinta(fr(x.num + y.num, x.den + y.den), x.sumar(y)); }
/** 5/6 − 1/2 = 4/4: resta los numeradores y los denominadores (null si abajo queda 0 o menos). */
export function restarArribaYAbajo(a, b) {
  const x = F(a), y = F(b);
  const d = x.den - y.den;
  return d <= 0 ? null : siDistinta(fr(x.num - y.num, d), x.restar(y));
}
/** 1/4 + 2/3 = 3/8: hace el «en cruz» de la división en una suma. */
export function enCruzAlSumar(a, b) { const x = F(a), y = F(b); return y.num === 0 ? null : siDistinta(fr(x.num * y.den, x.den * y.num), x.sumar(y)); }
/** 1/4 + 2/3 = 1/12 + 2/12 = 3/12: pone el m.c.m. abajo sin cambiar los numeradores (`op` '+' o '-'). */
export function sumarCambiandoSoloDenominador(a, b, op = '+') {
  const x = F(a), y = F(b);
  const m = mcm(x.den, y.den);
  return siDistinta(fr(op === '-' ? x.num - y.num : x.num + y.num, m), op === '-' ? x.restar(y) : x.sumar(y));
}
/** 2 + 1/3 = 3/3: suma el natural al numerador (con '-': 1 − 3/8 = 2/8, la diferencia de los dos). */
export function naturalAlNumerador(n, b, op = '+') {
  const y = F(b);
  if (!Number.isInteger(n) || y.den === 1) return null;
  const bien = op === '-' ? F(n).restar(y) : F(n).sumar(y);
  return siDistinta(fr(op === '-' ? Math.abs(n - y.num) : n + y.num, y.den), bien);
}
/** 1/2 + 1/3 = 2/6: suma arriba y multiplica abajo (cruza las reglas de la suma y el producto). */
export function sumarMultiplicandoDenominadores(a, b) { const x = F(a), y = F(b); return siDistinta(fr(x.num + y.num, x.den * y.den), x.sumar(y)); }
/** 1/4 − 2/3 = 5/12: pierde el signo de un resultado negativo (recibe el resultado bueno). */
export function signoPerdido(resultado) { const r = F(resultado); return r.num < 0 ? r.opuesta() : null; }
/** −2/7 + 2 = −12/7: pone al resultado el signo del primero (`op` '+' o '-'). */
export function signoDelPrimero(a, b, op = '+') {
  const x = F(a), y = F(b);
  const bien = op === '-' ? x.restar(y) : x.sumar(y);
  if (x.num === 0 || bien.num === 0) return null;
  const mal = signo(bien.num) === signo(x.num) ? bien : bien.opuesta();
  return siDistinta(mal, bien);
}

// Equivalentes y simplificar
/** 12/18 → 6/18: divide solo el numerador entre k. */
export function simplificarSoloNumerador(f, k) { const x = F(f); return k > 1 && x.num % k === 0 ? siDistinta(fr(x.num / k, x.den), x) : null; }
/** 12/18 → 12/9: divide solo el denominador entre k. */
export function simplificarSoloDenominador(f, k) { const x = F(f); return k > 1 && x.den % k === 0 ? siDistinta(fr(x.num, x.den / k), x) : null; }
/** 2/3 → 4/3: multiplica solo el numerador por k. */
export function ampliarSoloNumerador(f, k) { const x = F(f); return k > 1 ? siDistinta(fr(x.num * k, x.den), x) : null; }
/** 2/3 → 2/6: multiplica solo el denominador por k. */
export function ampliarSoloDenominador(f, k) { const x = F(f); return k > 1 ? siDistinta(fr(x.num, x.den * k), x) : null; }
/** 2/3 → 3/4: suma el mismo número arriba y abajo. */
export function sumarMismoNumero(f, k) { const x = F(f); return k > 0 ? siDistinta(fr(x.num + k, x.den + k), x) : null; }
/**
 * 3/5 = □/20 → □ = 18: completa sumando (5 + 15 = 20, así que 3 + 15). `conocido` es el
 * término de la otra fracción que da el enunciado, y `cual` dice cuál es ('den': el
 * denominador, se busca el numerador; 'num': al revés). Devuelve el número del hueco.
 */
export function huecoSumando(f, conocido, cual = 'den') {
  const x = F(f);
  const bien = cual === 'den' ? x.num * conocido / x.den : x.den * conocido / x.num;
  const mal = cual === 'den' ? x.num + (conocido - x.den) : x.den + (conocido - x.num);
  return mal > 0 && mal !== bien ? mal : null;
}
/** 36/48 → 18/24: se queda a medias, dividiendo entre un divisor común que no es el m.c.d. (por defecto, el menor primo). Solo vale de distractor en U4-1C-13 y U4-1C-14, con «la fracción irreducible» en el enunciado (acta del 26-10, punto i). */
export function simplificarAMedias(f, k = null) {
  const x = F(f);
  const g = mcdAbs(x.num, x.den);
  const d = k ?? menorPrimo(g);
  if (g < 2 || d === null || d <= 1 || d >= g || g % d !== 0) return null;
  return x.simplificarPor(d);
}
const menorPrimo = n => { for (let p = 2; p * p <= n; p++) if (n % p === 0) return p; return n > 1 ? n : null; };
/** −6/8 = 3/4: pierde el signo al simplificar (recibe la fracción sin simplificar). */
export function signoPerdidoAlSimplificar(f) { const x = F(f); return x.num < 0 ? x.simplificar().opuesta() : null; }

// La fracción de una cantidad
/** 3/5 de 40 = 40 : 3 · 5: divide entre el numerador y multiplica por el denominador (puede no dar un entero). */
export function fraccionDeAlReves(f, n) { const x = F(f); return x.num === 0 ? null : siDistinta(fr(n * x.den, x.num), x.multiplicar(n)); }
/** 3/5 de 40 = 8: se queda en la fracción unitaria (40 : 5). */
export function quedarseEnLaUnitaria(f, n) { const x = F(f); return siDistinta(fr(n, x.den), x.multiplicar(n)); }
/** 1/4 de 36 = 144: multiplica por el denominador en vez de dividir. */
export function multiplicarPorElDenominador(f, n) { const x = F(f); return x.den === 1 ? null : siDistinta(fr(n * x.den * x.num, 1), x.multiplicar(n)); }
/** Si 3/5 son 15, el total no es 3/5 de 15 = 9: aplica la fracción al dato en vez de buscar el total. */
export function fraccionDelDato(f, dato) { const x = F(f); return x.num === 0 ? null : siDistinta(x.multiplicar(dato), F(dato).dividir(x)); }
/** 8 de 20 con gafas → 8/12: pone la parte entre lo que queda, no entre el total. */
export function parteEntreElResto(parte, total) { return total - parte <= 0 ? null : siDistinta(fr(parte, total - parte), fr(parte, total)); }
/** 1/3 y 1/4 del resto → 1/3 + 1/4: toma «del resto» como «del total». */
export function delRestoComoDelTotal(a, b) {
  const x = F(a), y = F(b);
  return siDistinta(x.sumar(y), x.sumar(y.multiplicar(F(1).restar(x))));
}
/** Da lo gastado (la suma de las partes) como lo que queda (1 − la suma). */
export function gastadoComoQueda(...partes) {
  const suma = partes.map(F).reduce((s, p) => s.sumar(p), F(0));
  return siDistinta(suma, F(1).restar(suma));
}

// Comparar y la recta
/** Compara solo los numeradores: −1, 0 o 1 (1/3 y 2/5 «porque 1 < 2»; null si sale lo mismo que la buena). */
export function compararSoloNumeradores(a, b) { const x = F(a), y = F(b); const c = signo(x.num - y.num); return c === comparar(x, y) ? null : c; }
/** Compara solo los denominadores, como si mayor denominador fuera mayor fracción (3/7 > 3/5 «porque 7 > 5»). */
export function compararSoloDenominadores(a, b) { const x = F(a), y = F(b); const c = signo(x.den - y.den); return c === comparar(x, y) ? null : c; }
/** Compara sin el signo: −3/4 > −2/3 «porque 3/4 > 2/3». También: tocar el simétrico en la recta. */
export function ignoraElSigno(a, b) {
  const x = F(a), y = F(b);
  const c = comparar(new Fraccion(Math.abs(x.num), x.den), new Fraccion(Math.abs(y.num), y.den));
  return c === comparar(x, y) ? null : c;
}
/** Cuenta marcas en vez de huecos: la marca de 3/4 la pone en 2/4 (cuenta el 0 como primera). */
export function contarMarcas(f) { const x = F(f); return x.num === 0 ? null : fr(x.num - signo(x.num), x.den); }
/** Entre −1 y 0, cuenta desde el −1 hacia la derecha: −3/4 lo pone en −1/4. */
export function contarDesdeMenosUno(f) {
  const x = F(f);
  if (!(x.num < 0 && -x.num < x.den)) return null;
  return siDistinta(fr(-(x.den + x.num), x.den), x);
}

// Producto, inversa y cociente
/** 2/5 · 3/5 = 6/5: con el mismo denominador, lo deja como en la suma (null si los denominadores son distintos). */
export function productoConDenominadorComun(a, b) { const x = F(a), y = F(b); return x.den !== y.den ? null : siDistinta(fr(x.num * y.num, x.den), x.multiplicar(y)); }
/** 3 · 2/5 = 6/15: multiplica también el denominador por el natural. */
export function naturalPorAmbos(n, b) { const y = F(b); return !Number.isInteger(n) || n === 1 ? null : siDistinta(fr(n * y.num, n * y.den), y.multiplicar(n)); }
/** 2/3 · 3/4 = 8/9: multiplica en cruz (como al dividir). */
export function multiplicarEnCruz(a, b) { const x = F(a), y = F(b); return y.num === 0 ? null : siDistinta(fr(x.num * y.den, x.den * y.num), x.multiplicar(y)); }
/** 2/5 · 3/4 = 6/9: multiplica arriba y suma abajo. */
export function multiplicarSumandoDenominadores(a, b) { const x = F(a), y = F(b); return siDistinta(fr(x.num * y.num, x.den + y.den), x.multiplicar(y)); }
/** 2/3 de 3/4 = 2/3 + 3/4: suma en vez de multiplicar. */
export function sumarEnVezDeMultiplicar(a, b) { const x = F(a), y = F(b); return siDistinta(x.sumar(y), x.multiplicar(y)); }
/** La inversa de 3/5 es −3/5: confunde la inversa con la opuesta. */
export function inversaComoOpuesta(f) { const x = F(f); return x.num === 0 ? null : siDistinta(x.opuesta(), x.inversa()); }
/** La inversa de 3 es 3/1: escribe el natural como fracción y no la invierte. */
export function inversaDelNatural(n) { return !Number.isInteger(n) || Math.abs(n) === 1 || n === 0 ? null : fr(n, 1); }
/** 2/3 : 4/5 = 3/2 · 4/5: invierte la primera en vez de la segunda. */
export function invertirLaPrimera(a, b) { const x = F(a), y = F(b); return x.num === 0 || y.num === 0 ? null : siDistinta(x.inversa().multiplicar(y), x.dividir(y)); }
/** 2/3 : 4/5 = 8/15: multiplica sin invertir ninguna. */
export function noInvertir(a, b) { const x = F(a), y = F(b); return y.num === 0 ? null : siDistinta(x.multiplicar(y), x.dividir(y)); }
/** 2/3 : 4/5 = 3/2 · 5/4: invierte las dos. */
export function invertirLasDos(a, b) { const x = F(a), y = F(b); return x.num === 0 || y.num === 0 ? null : siDistinta(x.inversa().multiplicar(y.inversa()), x.dividir(y)); }

// Potencias (base positiva)
/** (2/3)² = 4/3: eleva solo el numerador. */
export function elevarSoloElNumerador(f, n) { const x = F(f); return x.den === 1 ? null : siDistinta(fr(x.num ** n, x.den), x.potencia(n)); }
/** (2/3)² = 4/6: multiplica los dos términos por el exponente. */
export function basePorExponente(f, n) { const x = F(f); return siDistinta(fr(x.num * n, x.den * n), x.potencia(n)); }

// Combinadas
/** 1/2 + 1/3 · 3/4 = 5/6 · 3/4: opera de izquierda a derecha sin jerarquía (respeta los paréntesis). */
export function deIzquierdaADerecha(x) {
  try {
    return siDistinta(evaluar(analizar(aTextoExpresion(x), { sinJerarquia: true })), evaluar(x));
  } catch (e) {
    if (e instanceof ErrorFracciones) return null;
    throw e;
  }
}

/**
 * Los errores típicos con su nombre: `fn` da el valor equivocado con los números del ítem
 * (o null), `ejemplo` lo enseña y `nombre` sirve de opción en «¿qué error es?» y de
 * `error` en `api.responder` (el id). `devuelve`: 'fraccion', 'entero' o 'comparacion'.
 */
export const ERRORES_TIPICOS = {
  'suma-arriba-y-abajo': { fn: sumarArribaYAbajo, devuelve: 'fraccion', ejemplo: '1/2 + 1/3 = 2/5',
    nombre: { es: 'Ha sumado los numeradores y también los denominadores', en: 'Added the numerators and also the denominators' } },
  'resta-arriba-y-abajo': { fn: restarArribaYAbajo, devuelve: 'fraccion', ejemplo: '5/6 − 1/2 = 4/4',
    nombre: { es: 'Ha restado los numeradores y también los denominadores', en: 'Subtracted the numerators and also the denominators' } },
  'en-cruz-al-sumar': { fn: enCruzAlSumar, devuelve: 'fraccion', ejemplo: '1/4 + 2/3 = 3/8',
    nombre: { es: 'Ha multiplicado en cruz, como al dividir, en una suma', en: 'Cross-multiplied, as when dividing, in an addition' } },
  'suma-solo-cambia-denominador': { fn: sumarCambiandoSoloDenominador, devuelve: 'fraccion', ejemplo: '1/4 + 2/3 = 1/12 + 2/12',
    nombre: { es: 'Ha cambiado el denominador sin cambiar el numerador', en: 'Changed the denominator without changing the numerator' } },
  'natural-al-numerador': { fn: naturalAlNumerador, devuelve: 'fraccion', ejemplo: '2 + 1/3 = 3/3',
    nombre: { es: 'Ha sumado el número entero solo al numerador', en: 'Added the whole number to the numerator only' } },
  'suma-multiplicando-denominadores': { fn: sumarMultiplicandoDenominadores, devuelve: 'fraccion', ejemplo: '1/2 + 1/3 = 2/6',
    nombre: { es: 'Ha multiplicado los denominadores en una suma', en: 'Multiplied the denominators in an addition' } },
  'signo-perdido': { fn: signoPerdido, devuelve: 'fraccion', ejemplo: '1/4 − 2/3 = 5/12',
    nombre: { es: 'Ha perdido el signo menos del resultado', en: 'Lost the minus sign of the result' } },
  'signo-del-primero': { fn: signoDelPrimero, devuelve: 'fraccion', ejemplo: '−2/7 + 2 = −12/7',
    nombre: { es: 'Ha puesto el signo del primer número, no el del resultado', en: 'Used the sign of the first number, not the sign of the result' } },
  'simplifica-solo-numerador': { fn: simplificarSoloNumerador, devuelve: 'fraccion', ejemplo: '12/18 = 6/18',
    nombre: { es: 'Ha dividido solo el numerador', en: 'Divided only the numerator' } },
  'simplifica-solo-denominador': { fn: simplificarSoloDenominador, devuelve: 'fraccion', ejemplo: '12/18 = 12/9',
    nombre: { es: 'Ha dividido solo el denominador', en: 'Divided only the denominator' } },
  'amplia-solo-numerador': { fn: ampliarSoloNumerador, devuelve: 'fraccion', ejemplo: '2/3 = 4/3',
    nombre: { es: 'Ha multiplicado solo el numerador', en: 'Multiplied only the numerator' } },
  'amplia-solo-denominador': { fn: ampliarSoloDenominador, devuelve: 'fraccion', ejemplo: '2/3 = 2/6',
    nombre: { es: 'Ha multiplicado solo el denominador', en: 'Multiplied only the denominator' } },
  'suma-mismo-numero': { fn: sumarMismoNumero, devuelve: 'fraccion', ejemplo: '2/3 = 3/4',
    nombre: { es: 'Ha sumado el mismo número arriba y abajo', en: 'Added the same number to the top and the bottom' } },
  'hueco-sumando': { fn: huecoSumando, devuelve: 'entero', ejemplo: '3/5 = 18/20',
    nombre: { es: 'Ha completado sumando en vez de multiplicando', en: 'Added instead of multiplying to fill the gap' } },
  'simplifica-a-medias': { fn: simplificarAMedias, devuelve: 'fraccion', ejemplo: '36/48 = 18/24',
    nombre: { es: 'Ha dejado la simplificación a medias', en: 'Stopped before the fraction was in lowest terms' } },
  'signo-perdido-al-simplificar': { fn: signoPerdidoAlSimplificar, devuelve: 'fraccion', ejemplo: '−6/8 = 3/4',
    nombre: { es: 'Ha perdido el signo menos al simplificar', en: 'Lost the minus sign when simplifying' } },
  'fraccion-de-al-reves': { fn: fraccionDeAlReves, devuelve: 'fraccion', ejemplo: '3/5 de 40 = 40 : 3 · 5',
    nombre: { es: 'Ha dividido entre el numerador y multiplicado por el denominador', en: 'Divided by the numerator and multiplied by the denominator' } },
  'se-queda-en-la-unitaria': { fn: quedarseEnLaUnitaria, devuelve: 'fraccion', ejemplo: '3/5 de 40 = 8',
    nombre: { es: 'Ha dividido entre el denominador pero no ha multiplicado por el numerador', en: 'Divided by the denominator but did not multiply by the numerator' } },
  'multiplica-por-el-denominador': { fn: multiplicarPorElDenominador, devuelve: 'fraccion', ejemplo: '1/4 de 36 = 144',
    nombre: { es: 'Ha multiplicado por el denominador en vez de dividir', en: 'Multiplied by the denominator instead of dividing' } },
  'fraccion-del-dato': { fn: fraccionDelDato, devuelve: 'fraccion', ejemplo: 'si 3/5 son 15, el total es 9',
    nombre: { es: 'Ha calculado la fracción del dato en vez de buscar el total', en: 'Worked out the fraction of the given amount instead of finding the whole' } },
  'parte-entre-el-resto': { fn: parteEntreElResto, devuelve: 'fraccion', ejemplo: '8 de 20 = 8/12',
    nombre: { es: 'Ha dividido la parte entre lo que queda, no entre el total', en: 'Divided the part by the rest, not by the whole' } },
  'del-resto-como-del-total': { fn: delRestoComoDelTotal, devuelve: 'fraccion', ejemplo: '1/3 y 1/4 del resto = 7/12',
    nombre: { es: 'Ha tomado la fracción del resto como si fuera del total', en: 'Took the fraction of the rest as a fraction of the whole' } },
  'gastado-como-queda': { fn: gastadoComoQueda, devuelve: 'fraccion', ejemplo: 'gasta 1/3 y 1/4: quedan 7/12',
    nombre: { es: 'Ha dado lo gastado como lo que queda', en: 'Gave the part used as the part that is left' } },
  'compara-solo-numeradores': { fn: compararSoloNumeradores, devuelve: 'comparacion', ejemplo: '2/3 < 3/5 porque 2 < 3',
    nombre: { es: 'Ha comparado solo los numeradores', en: 'Compared only the numerators' } },
  'compara-solo-denominadores': { fn: compararSoloDenominadores, devuelve: 'comparacion', ejemplo: '3/7 > 3/5 porque 7 > 5',
    nombre: { es: 'Ha creído que el denominador mayor da la fracción mayor', en: 'Thought the bigger denominator gives the bigger fraction' } },
  'ignora-el-signo': { fn: ignoraElSigno, devuelve: 'comparacion', ejemplo: '−3/4 > −2/3 porque 3/4 > 2/3',
    nombre: { es: 'Ha comparado sin tener en cuenta el signo', en: 'Compared without looking at the sign' } },
  'contar-marcas': { fn: contarMarcas, devuelve: 'fraccion', ejemplo: '3/4 en la marca de 2/4',
    nombre: { es: 'Ha contado las marcas en vez de los espacios', en: 'Counted the marks instead of the spaces' } },
  'contar-desde-menos-uno': { fn: contarDesdeMenosUno, devuelve: 'fraccion', ejemplo: '−3/4 en la marca de −1/4',
    nombre: { es: 'Ha contado desde el −1 en vez de desde el 0', en: 'Counted from −1 instead of from 0' } },
  'producto-denominador-comun': { fn: productoConDenominadorComun, devuelve: 'fraccion', ejemplo: '2/5 · 3/5 = 6/5',
    nombre: { es: 'Ha dejado el denominador como en una suma', en: 'Kept the denominator as in an addition' } },
  'natural-por-ambos': { fn: naturalPorAmbos, devuelve: 'fraccion', ejemplo: '3 · 2/5 = 6/15',
    nombre: { es: 'Ha multiplicado también el denominador por el número entero', en: 'Also multiplied the denominator by the whole number' } },
  'multiplica-en-cruz': { fn: multiplicarEnCruz, devuelve: 'fraccion', ejemplo: '2/3 · 3/4 = 8/9',
    nombre: { es: 'Ha multiplicado en cruz, como al dividir', en: 'Cross-multiplied, as when dividing' } },
  'multiplica-sumando-denominadores': { fn: multiplicarSumandoDenominadores, devuelve: 'fraccion', ejemplo: '2/5 · 3/4 = 6/9',
    nombre: { es: 'Ha sumado los denominadores en un producto', en: 'Added the denominators in a multiplication' } },
  'suma-en-vez-de-multiplicar': { fn: sumarEnVezDeMultiplicar, devuelve: 'fraccion', ejemplo: '2/3 de 3/4 = 2/3 + 3/4',
    nombre: { es: 'Ha sumado en vez de multiplicar', en: 'Added instead of multiplying' } },
  'inversa-como-opuesta': { fn: inversaComoOpuesta, devuelve: 'fraccion', ejemplo: 'la inversa de 3/5 es −3/5',
    nombre: { es: 'Ha confundido la inversa con la opuesta', en: 'Mixed up the reciprocal and the opposite' } },
  'inversa-del-natural': { fn: inversaDelNatural, devuelve: 'fraccion', ejemplo: 'la inversa de 3 es 3/1',
    nombre: { es: 'Ha escrito el número sobre 1 sin darle la vuelta', en: 'Wrote the number over 1 without turning it upside down' } },
  'invierte-la-primera': { fn: invertirLaPrimera, devuelve: 'fraccion', ejemplo: '2/3 : 4/5 = 3/2 · 4/5',
    nombre: { es: 'Ha invertido la primera fracción en vez de la segunda', en: 'Turned the first fraction upside down instead of the second' } },
  'no-invierte': { fn: noInvertir, devuelve: 'fraccion', ejemplo: '2/3 : 4/5 = 8/15',
    nombre: { es: 'Ha multiplicado sin invertir la segunda fracción', en: 'Multiplied without turning the second fraction upside down' } },
  'invierte-las-dos': { fn: invertirLasDos, devuelve: 'fraccion', ejemplo: '2/3 : 4/5 = 3/2 · 5/4',
    nombre: { es: 'Ha invertido las dos fracciones', en: 'Turned both fractions upside down' } },
  'eleva-solo-el-numerador': { fn: elevarSoloElNumerador, devuelve: 'fraccion', ejemplo: '(2/3)² = 4/3',
    nombre: { es: 'Ha elevado solo el numerador', en: 'Raised only the numerator to the power' } },
  'base-por-exponente': { fn: basePorExponente, devuelve: 'fraccion', ejemplo: '(2/3)² = 4/6',
    nombre: { es: 'Ha multiplicado por el exponente en vez de elevar', en: 'Multiplied by the index instead of raising to the power' } },
  'izquierda-a-derecha': { fn: deIzquierdaADerecha, devuelve: 'fraccion', ejemplo: '1/2 + 1/3 · 3/4 = 5/6 · 3/4',
    nombre: { es: 'Ha operado de izquierda a derecha sin respetar la jerarquía', en: 'Worked from left to right without following the order of operations' } },
};

/**
 * Lo que NO es un error (regla 4 de la unidad y U4-3C-12): nunca se corrige como fallo
 * ni sirve de distractor. `terminoATermino` da el resultado de dividir arriba entre
 * arriba y abajo entre abajo cuando las dos divisiones son exactas (6/8 : 2/4 = 3/2), o null.
 */
export const NO_ES_ERROR = {
  'otro-denominador-comun': { es: 'Usar otro denominador común (no el m.c.m.) y simplificar al final', en: 'Using another common denominator (not the LCM) and simplifying at the end' },
  'simplificar-antes-o-despues': { es: 'Simplificar antes o después de operar', en: 'Simplifying before or after the operation' },
  'en-cruz-al-dividir': { es: 'Dividir en cruz: es el mismo método que multiplicar por la inversa', en: 'Dividing by cross-multiplying: it is the same as multiplying by the reciprocal' },
  'termino-a-termino': { es: 'Dividir término a término cuando las dos divisiones son exactas', en: 'Dividing top by top and bottom by bottom when both divisions are exact' },
  'mismo-numerador': { es: 'Comparar por los denominadores cuando los numeradores son iguales', en: 'Comparing the denominators when the numerators are the same' },
};

/** 6/8 : 2/4 = 3/2 (arriba entre arriba, abajo entre abajo), o null si alguna no es exacta. No es un error. */
export function terminoATermino(a, b) {
  const x = F(a), y = F(b);
  if (y.num === 0 || x.num % y.num !== 0 || x.den % y.den !== 0) return null;
  return new Fraccion(x.num / y.num, x.den / y.den);
}

const claveDe = (v, porForma) => {
  if (typeof v === 'number' && !Number.isSafeInteger(v)) return `n:${v}`;
  const f = F(v);
  return porForma ? `${f.num}/${f.den}` : f.clave();
};

/**
 * Los distractores que sirven: `candidatos` = [[id, …argumentos], …] de ERRORES_TIPICOS;
 * devuelve [{ valor, error }] sin los null, sin la correcta y sin dos que valgan lo mismo
 * (se queda el primero). Con { porForma: true } compara la forma y no el valor: SOLO en las
 * preguntas de «la fracción irreducible» de U4-1C-13 y U4-1C-14 (acta del 26-10, punto i).
 */
export function distractores(candidatos, correcta, { porForma = false } = {}) {
  const vistos = new Set([claveDe(correcta, porForma)]);
  const salida = [];
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id];
    if (!e) throw new Error(`Error típico desconocido: ${id}`);
    const valor = e.fn(...args);
    if (valor === null) continue;
    const clave = claveDe(valor, porForma);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push({ valor, error: id });
  }
  return salida;
}

/** ¿Hay en la lista dos que valgan lo mismo? (La regla 1 de la unidad: no puede haberlas.) */
export function hayEquivalentes(lista) {
  const claves = lista.map(v => F(v).clave());
  return new Set(claves).size !== claves.length;
}

// ─── Expresiones ───────────────────────────────────────────────────────────────

const SUPERINDICE = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const A_SUPERINDICE = Object.fromEntries(Object.entries(SUPERINDICE).map(([s, d]) => [d, s]));
const ES_MENOS = /[-−‒–—﹣－]/;

function fichas(texto) {
  const s = String(texto ?? '');
  const salida = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/\d/.test(c) || SUPERINDICE[c]) {
      const sup = Boolean(SUPERINDICE[c]);
      let j = i, cifras = '';
      while (j < s.length && (sup ? SUPERINDICE[s[j]] : /\d/.test(s[j]))) cifras += sup ? SUPERINDICE[s[j++]] : s[j++];
      if (sup) salida.push({ t: '^' });
      salida.push({ t: 'num', v: Number(cifras) });
      i = j;
      continue;
    }
    if (c === '+') salida.push({ t: '+' });
    else if (ES_MENOS.test(c)) salida.push({ t: '-' });
    else if ('*·xX×⋅∙'.includes(c)) salida.push({ t: '*' });
    else if (':÷'.includes(c)) salida.push({ t: ':' });
    else if ('/⁄∕'.includes(c)) salida.push({ t: '/' });
    else if ('^()[]'.includes(c)) salida.push({ t: c });
    else throw new ErrorFracciones('sintaxis', `No se entiende «${c}» en «${s}»`);
    i++;
  }
  return salida;
}

/** Un número del árbol: su `valor` es una Fraccion (tal como se escribió). */
export const num = valor => ({ tipo: 'num', valor: aFraccion(valor) });

/** El árbol de una expresión con fracciones (si ya es un árbol, se devuelve tal cual). */
export function analizar(texto, { sinJerarquia = false } = {}) {
  if (texto && typeof texto === 'object') return texto;
  const ts = fichas(texto);
  let k = 0;
  const ver = () => ts[k]?.t;
  const mal = que => new ErrorFracciones('sintaxis', `${que} en «${texto}»`);
  function suma() {
    let izq = sinJerarquia ? signo() : producto();
    while (ver() === '+' || ver() === '-' || (sinJerarquia && (ver() === '*' || ver() === ':'))) {
      const op = ts[k++].t;
      izq = { tipo: 'op', op, izq, der: sinJerarquia ? signo() : producto() };
    }
    return izq;
  }
  function producto() {
    let izq = signo();
    while (ver() === '*' || ver() === ':') { const op = ts[k++].t; izq = { tipo: 'op', op, izq, der: signo() }; }
    return izq;
  }
  function signo() {
    if (ver() === '-') { k++; return { tipo: 'neg', arg: signo() }; }
    if (ver() === '+') { k++; return { tipo: 'pos', arg: signo() }; }
    return potencia();
  }
  function potencia() {
    const base = atomo();
    if (ver() !== '^') return base;
    k++;
    if (ver() !== 'num') throw mal('Falta el exponente');
    const exp = ts[k++].v;
    if (ver() === '^') throw mal('Dos exponentes seguidos');
    return { tipo: 'pot', base, exp };
  }
  function atomo() {
    const f = ts[k++];
    if (!f) throw mal('Falta un número');
    if (f.t === 'num') {
      if (ver() !== '/') return num(f.v);
      k++;
      const d = ts[k++];
      if (d?.t !== 'num') throw mal('Falta el denominador');
      if (d.v === 0) throw new ErrorFracciones('denominador-0', `${f.v}/0 en «${texto}»`);
      return num(new Fraccion(f.v, d.v));
    }
    if (f.t === '(' || f.t === '[') {
      const arg = suma();
      if (ver() !== (f.t === '(' ? ')' : ']')) throw mal('Falta cerrar un paréntesis');
      k++;
      return { tipo: 'par', forma: f.t, arg };
    }
    throw mal(`Sobra «${f.t}»`);
  }
  const arbol = suma();
  if (k < ts.length) throw mal(`Sobra «${ts[k].t}»`);
  return arbol;
}

const arbolDe = x => analizar(x);

/** a op b con fracciones, sin simplificar (op: + - * :). */
export function operar(op, a, b) {
  const x = F(a), y = F(b);
  if (op === '+') return x.sumar(y);
  if (op === '-') return x.restar(y);
  if (op === '*') return x.multiplicar(y);
  return x.dividir(y);
}

function evaluarCrudo(n) {
  switch (n.tipo) {
    case 'num': return n.valor;
    case 'neg': return evaluarCrudo(n.arg).opuesta();
    case 'pos': case 'par': return evaluarCrudo(n.arg);
    case 'pot': return evaluarCrudo(n.base).potencia(n.exp);
    case 'op': return operar(n.op, evaluarCrudo(n.izq), evaluarCrudo(n.der)).simplificar();
    default: throw new ErrorFracciones('sintaxis', `Nodo desconocido: ${n.tipo}`);
  }
}

/** El valor de una expresión (árbol o texto), irreducible. Lanza un ErrorFracciones con `codigo`. */
export function evaluar(x) {
  return evaluarCrudo(arbolDe(x)).simplificar();
}

const esNumeroConSigno = n => (n.tipo === 'neg' || n.tipo === 'pos') && n.arg.tipo === 'num' && n.arg.valor.num >= 0;

/** El valor si el nodo es un número ya escrito (2/3, −2/3, (−2/3)), o null si todavía hay que operar. */
export function valorLiteral(n) {
  if (n.tipo === 'num') return n.valor;
  if (esNumeroConSigno(n)) return n.tipo === 'neg' ? n.arg.valor.opuesta() : n.arg.valor;
  if (n.tipo === 'par') return valorLiteral(n.arg);
  return null;
}

// Pintar

const hijo = (ruta, k) => (ruta ? `${ruta}.${k}` : k);
const supTexto = e => [...String(e)].map(d => A_SUPERINDICE[d]).join('');

function pintar(n, ruta, primero, o) {
  const marcar = (s, r) => (o.marcarOperadores && !o.texto ? `<span class="frac-op" data-ruta="${r}">${s}</span>` : s);
  const fraccionEn = (f, entreParentesis) => (o.texto
    ? (entreParentesis ? `(${aTexto(f)})` : aTexto(f))
    : (entreParentesis ? `(${htmlFraccion(f, { compacta: o.compacta })})` : htmlFraccion(f, { compacta: o.compacta })));
  let s;
  switch (n.tipo) {
    case 'num':
      s = fraccionEn(n.valor, n.valor.num < 0 && !primero);
      break;
    case 'neg': case 'pos': {
      const sg = n.tipo === 'neg' ? MENOS : '+';
      s = `${esNumeroConSigno(n) ? sg : marcar(sg, ruta)}${pintar(n.arg, hijo(ruta, 'arg'), false, o)}`;
      break;
    }
    case 'par': {
      const [abre, cierra] = n.forma === '[' ? ['[', ']'] : ['(', ')'];
      s = `${abre}${pintar(n.arg, hijo(ruta, 'arg'), true, o)}${cierra}`;
      break;
    }
    case 'pot': {
      // Una fracción (o una negativa) como base va siempre entre paréntesis: (2/3)².
      const b = n.base;
      const base = b.tipo === 'num' && (b.valor.den !== 1 || b.valor.num < 0)
        ? (o.texto ? `(${aTexto(b.valor)})` : `(${htmlFraccion(b.valor, { compacta: o.compacta })})`)
        : pintar(b, hijo(ruta, 'base'), false, o);
      s = `${base}${marcar(o.texto ? supTexto(n.exp) : `<sup>${n.exp}</sup>`, ruta)}`;
      break;
    }
    case 'op': {
      const simbolo = { '+': '+', '-': MENOS, '*': '·', ':': o.dividir === '÷' ? '÷' : ':' }[n.op];
      s = `${pintar(n.izq, hijo(ruta, 'izq'), primero, o)} ${marcar(simbolo, ruta)} ${pintar(n.der, hijo(ruta, 'der'), false, o)}`;
      break;
    }
    default: throw new ErrorFracciones('sintaxis', `Nodo desconocido: ${n.tipo}`);
  }
  const clase = o.envolver?.[ruta];
  return clase && !o.texto ? `<span class="${clase}">${s}</span>` : s;
}

/** HTML de una expresión con fracciones de raya, −, ·, : y <sup> (opciones: marcarOperadores, envolver, dividir, compacta). */
export function html(x, opciones = {}) {
  return `<span class="cuenta-frac">${pintar(arbolDe(x), '', true, { ...opciones, texto: false })}</span>`;
}

/** La expresión como texto ('1/2 + 1/3 · 3/4', con − y ²); `analizar` la vuelve a leer. */
export function aTextoExpresion(x, opciones = {}) {
  return pintar(arbolDe(x), '', true, { ...opciones, texto: true });
}

// Rutas y paso a paso

/** El nodo de una ruta ('' es la raíz). */
export function nodoEn(x, ruta) {
  let n = arbolDe(x);
  for (const k of ruta ? ruta.split('.') : []) n = n?.[k];
  return n ?? null;
}

/** Copia del árbol con el nodo de `ruta` cambiado por `nuevo`. */
export function reemplazar(x, ruta, nuevo) {
  const n = arbolDe(x);
  if (!ruta) return nuevo;
  const [k, ...resto] = ruta.split('.');
  return { ...n, [k]: reemplazar(n[k], resto.join('.'), nuevo) };
}

/** Quita los paréntesis que solo tienen dentro un número (los que deja un paso). */
function normalizar(n) {
  switch (n.tipo) {
    case 'par': return n.arg.tipo === 'num' ? n.arg : { ...n, arg: normalizar(n.arg) };
    case 'neg': case 'pos': return { ...n, arg: normalizar(n.arg) };
    case 'pot': return { ...n, base: normalizar(n.base) };
    case 'op': return { ...n, izq: normalizar(n.izq), der: normalizar(n.der) };
    default: return n;
  }
}

export const NIVEL = { '+': 1, '-': 1, '*': 2, ':': 2, pot: 3, signo: 4 };

function textoOperacion(tipo, op, a, b) {
  const par = f => (f.num < 0 || (tipo === 'pot' && f.den !== 1) ? `(${aTexto(f)})` : aTexto(f));
  if (tipo === 'pot') return `${par(a)}${supTexto(b)}`;
  if (tipo === 'neg') return `${MENOS}${par(a)}`;
  if (tipo === 'pos') return `+${par(a)}`;
  return `${aTexto(a)} ${{ '+': '+', '-': MENOS, '*': '·', ':': ':' }[op]} ${par(b)}`;
}

/** Las operaciones que se pueden hacer ya, en el orden en que se leen (ver la cabecera). */
export function pasosPosibles(x, { cadenas = true } = {}) {
  const salida = [];
  const intentar = (paso, calcular) => {
    try {
      const crudo = calcular();
      salida.push({ ...paso, valor: crudo.simplificar(), sinSimplificar: crudo, operacion: textoOperacion(paso.tipo, paso.op, paso.a, paso.b) });
    } catch (e) {
      if (!(e instanceof ErrorFracciones) && e?.message !== 'cambia el valor') throw e;
    }
  };
  function recorrer(n, ruta, profundidad) {
    switch (n.tipo) {
      case 'par': recorrer(n.arg, hijo(ruta, 'arg'), profundidad + 1); break;
      case 'neg': case 'pos': {
        const a = esNumeroConSigno(n) ? null : valorLiteral(n.arg);
        if (a !== null) intentar({ ruta, tipo: n.tipo, op: n.tipo === 'neg' ? '-' : '+', a, b: null, nivel: NIVEL.signo, profundidad, cadena: false }, () => (n.tipo === 'neg' ? a.opuesta() : a));
        recorrer(n.arg, hijo(ruta, 'arg'), profundidad);
        break;
      }
      case 'pot': {
        recorrer(n.base, hijo(ruta, 'base'), profundidad);
        const a = valorLiteral(n.base);
        if (a !== null) intentar({ ruta, tipo: 'pot', op: '^', a, b: n.exp, nivel: NIVEL.pot, profundidad, cadena: false }, () => a.potencia(n.exp));
        break;
      }
      case 'op': {
        recorrer(n.izq, hijo(ruta, 'izq'), profundidad);
        const a = valorLiteral(n.izq), b = valorLiteral(n.der);
        if (a !== null && b !== null) {
          intentar({ ruta, tipo: 'op', op: n.op, a, b, nivel: NIVEL[n.op], profundidad, cadena: false }, () => operar(n.op, a, b));
        } else if (cadenas && b !== null && n.izq.tipo === 'op' && NIVEL[n.izq.op] === NIVEL[n.op]) {
          // a op1 m op2 b: adelantar «m op2 b» solo vale si no cambia el valor.
          const m = valorLiteral(n.izq.der);
          if (m !== null) {
            intentar({ ruta, tipo: 'op', op: n.op, a: m, b, nivel: NIVEL[n.op], profundidad, cadena: true }, () => {
              const v = operar(n.op, m, b);
              if (!evaluar({ tipo: 'op', op: n.izq.op, izq: n.izq.izq, der: num(v) }).equals(evaluar(n))) throw new Error('cambia el valor');
              return v;
            });
          }
        }
        recorrer(n.der, hijo(ruta, 'der'), profundidad);
        break;
      }
      default: break;
    }
  }
  recorrer(arbolDe(x), '', 0);
  return salida;
}

/** El árbol con el paso hecho (`p`: su índice en `pasosPosibles(árbol)` o el propio paso); el resultado, irreducible. */
export function aplicarPaso(x, p) {
  const arbol = arbolDe(x);
  const paso = typeof p === 'number' ? pasosPosibles(arbol)[p] : p;
  if (!paso) throw new ErrorFracciones('sintaxis', 'Ese paso no existe');
  const nodo = nodoEn(arbol, paso.ruta);
  const nuevo = paso.cadena ? { tipo: 'op', op: nodo.izq.op, izq: nodo.izq.izq, der: num(paso.valor) } : num(paso.valor);
  return normalizar(reemplazar(arbol, paso.ruta, nuevo));
}

/** El paso que toca: el paréntesis de más adentro, la operación de más nivel y, a igualdad, la de la izquierda. */
export function pasoCanonico(x) {
  let mejor = null;
  for (const p of pasosPosibles(x, { cadenas: false })) {
    if (!mejor || p.profundidad > mejor.profundidad || (p.profundidad === mejor.profundidad && p.nivel > mejor.nivel)) mejor = p;
  }
  return mejor;
}

/** Todos los estados, del primero al número final, con los pasos canónicos: [{ arbol }, { arbol, paso }, …]. */
export function cadenaDePasos(x) {
  let arbol = arbolDe(x);
  const estados = [{ arbol }];
  for (let i = 0; i < 200 && valorLiteral(arbol) === null; i++) {
    const paso = pasoCanonico(arbol);
    if (!paso) throw new ErrorFracciones('division-entre-0', `No se puede terminar «${aTextoExpresion(arbol)}»`);
    arbol = aplicarPaso(arbol, paso);
    estados.push({ arbol, paso });
  }
  return estados;
}
