// Álgebra para las prácticas de la unidad 6 (PU2, tarea 144): la expresión lineal, la
// ecuación de primer grado, cómo se escriben, se leen y se dicen en los dos idiomas, el
// método de resolver paso a paso, los errores típicos de la unidad (de donde salen los
// distractores) y la tabla de traducción del hilo «del enunciado al álgebra». Puro (sin DOM
// ni red). Los coeficientes son siempre `Fraccion` de `fracciones.js`: nada de coma flotante
// ni de `eval`. Probado en `tests/practicas-algebra.test.js`.
//
// ─── El modelo ─────────────────────────────────────────────────────────────────
//
//   lineal(3, 2) → 3x + 2. lineal(fraccion(1, 2), -3, 'n') → n/2 − 3.
//   new Lineal({ x: 7, y: 2 }, 0) → 7x + 2y (dos letras: solo para reducir y para el valor
//   numérico con dos letras, U6-1C-08; nunca en una ecuación).
//   Inmutable y siempre REDUCIDA: los coeficientes, irreducibles; sin términos de coeficiente 0.
//   Para enseñar una suma sin reducir (5x + 2x − 3x, o los pasos de una ecuación) están los
//   TÉRMINOS: listas de { coef: Fraccion, letra: 'x' | null } en el orden en que se escriben.
//     e.a, e.b, e.letra          coeficiente de la letra principal, término independiente, la letra
//     e.coefs                    { letra: Fraccion } (solo las letras que están)
//     e.clave() / canonica()     'x:3|b:2': la forma canónica como texto; sirve para un Set
//     e.equals(otra)             por forma canónica: 2x + 3 = 3 + 2x; x/2 = ½x = 0,5x
//     e.evaluar(v)               Fraccion exacta; con dos letras, evaluar({ a: 2, b: −1 })
//     e.sumar(o), e.restar(o), e.porNumero(k), e.opuesta()
//     e.terminos()               los términos en el orden canónico (letras y después el número)
//     e.aTexto(), e.aHtml(), e.enPalabras(idioma), e.lecturasValidas(idioma)
//   expandir(k, expr) → k(ax + b) = kax + kb; expandirTerminos(k, términos) conserva el orden.
//   reducir(términos | texto) → { resultado, grupos, agrupados }: el resultado y, para el
//   feedback, cada grupo de semejantes con su total.
//
// ─── La ecuación ───────────────────────────────────────────────────────────────
//
//   ecuacion('x + 3', 10), new Ecuacion(izq, der): cada miembro es un Lineal, un número, un texto
//   o una lista de términos, y se guarda COMO TÉRMINOS (x/2 + x/3 = 5 sigue siendo eso, no 5x/6 = 5).
//     q.izq, q.der               los miembros reducidos (Lineal)
//     q.resolver()               Fraccion, o { tipo: 'ninguna' } (0x = 2) o { tipo: 'infinitas' } (0x = 0)
//     q.esSolucion(v)            sustituyendo en los dos miembros tal como están escritos
//     q.equivalente(otra)        las mismas soluciones (x + 3 = 10 y 2x + 6 = 20)
//     q.pasos()                  el método: [{ tipo, ecuacion, … }] con los tipos 'denominadores'
//                                (con `mcm`), 'cambiar-miembros' (la x a la izquierda), 'transponer',
//                                'reducir', 'despejar' (con `divisor`), 'simplificar' y, si la x se va, 'sin-solucion'
//                                o 'infinitas'. La última es «x = solución» (irreducible).
//     q.sinDenominadores(m?)     todos los términos por m (por defecto el m.c.m. de los denominadores)
//     q.porNumero(k), q.aTexto(), q.aHtml(), q.enPalabras(idioma), q.lecturasValidas(idioma), q.clave()
//
// ─── Lo que teclea el alumno ───────────────────────────────────────────────────
//
//   leerExpresion(texto, { letras, variasLetras }) → { ok: true, valor, terminos } o
//   { ok: false, motivo, mensaje: { es, en } }; deTexto(texto) → Lineal o null.
//   leerEcuacion(texto) y deEcuacion(texto), igual con un «=».
//   Acepta: 2x+3, 3 + 2x, 2·x + 3, 2*x+3, 2 x, X mayúscula, x·3, -x, −x, –x, x/2, 3x/4, x : 2,
//   ½x, 0,5x, 1.5, 7x + 2y (con variasLetras), espacios en cualquier sitio. Rechaza, con un
//   motivo y un mensaje para el alumno: vacío, x2 (¿2x o x²?), x², x^2, x·x, paréntesis, la letra
//   en el denominador, 1/2x (¿la x arriba o abajo?), dos letras (sin variasLetras), un «=», basura.
//   Nunca `eval` ni `Number(texto)`.
//
// ─── Errores típicos ───────────────────────────────────────────────────────────
//
//   Cada error de la columna `nota` del inventario es una función que, con los números del
//   ítem, da el resultado equivocado, o null cuando ese error no sirve de distractor ahí (da
//   lo mismo que lo bueno o no se aplica). ERRORES_TIPICOS[id] = { fn, devuelve, ejemplo,
//   nombre: { es, en } }, con devuelve 'lineal', 'numero' (Fraccion) o 'ecuacion' (el paso
//   equivocado; su `resolver()` da la solución equivocada). El id es el `error` de
//   `api.responder`. distractores([[id, …args], …], correcta) junta los que sirven, sin dos
//   equivalentes entre sí ni con la correcta (expresiones por forma canónica, números por
//   valor, ecuaciones POR SOLUCIÓN: una ecuación equivocada y un número se comparan por su
//   solución). NO_ES_ERROR: lo que nunca se corrige como fallo.
//
// ─── Traducción ────────────────────────────────────────────────────────────────
//
//   FRASES: las construcciones del hilo A (el doble, la mitad, n más que, n menos que, el
//   siguiente, dos consecutivos…), cada una con su texto en los dos idiomas (el número n que
//   lleve, de 2 en adelante), su glosa, su expresión y sus errores típicos.

import { mcm } from './aritmetica.js';
import { Fraccion, aFraccion, aTexto as textoFraccion, htmlFraccion, htmlRaya, lecturasValidas as lecturasFraccion, enPalabras as palabrasFraccion, MENOS } from './fracciones.js';
import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';

export { MENOS };

export class ErrorAlgebra extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorAlgebra';
    this.codigo = codigo;
  }
}

const F = x => aFraccion(x).simplificar();
const CERO = new Fraccion(0, 1);
const UNO = new Fraccion(1, 1);
const esCero = f => f.num === 0;
const claveF = f => { const s = f.simplificar(); return s.den === 1 ? `${s.num}` : `${s.num}/${s.den}`; };

// ─── Términos ──────────────────────────────────────────────────────────────────

/** Un término: coef · letra (letra null para el número). Inmutable. */
export function termino(coef, letra = null) {
  if (letra !== null && !/^[a-z]$/.test(letra)) throw new ErrorAlgebra('letra', `«${letra}» no es una letra`);
  return Object.freeze({ coef: aFraccion(coef), letra });
}

const opuestoT = t => termino(t.coef.opuesta(), t.letra);
const porT = (t, k) => termino(t.coef.multiplicar(k).simplificar(), t.letra);

/** Una lista de términos a partir de un Lineal, un número, un texto o una lista (se copia). */
export function aTerminos(x) {
  if (Array.isArray(x)) return Object.freeze(x.map(t => termino(t.coef, t.letra ?? null)));
  if (x instanceof Lineal) return x.terminos();
  if (typeof x === 'string') {
    const r = leerExpresion(x, { variasLetras: true });
    if (!r.ok) throw new ErrorAlgebra(r.motivo, `«${x}»: ${r.mensaje.es}`);
    return r.terminos;
  }
  return Object.freeze([termino(x)]);
}

/** La suma de una lista de términos, reducida. */
export function sumaDeTerminos(terminos) {
  const coefs = {};
  let b = CERO;
  for (const t of terminos) {
    if (t.letra === null) b = b.sumar(t.coef);
    else coefs[t.letra] = (coefs[t.letra] ?? CERO).sumar(t.coef);
  }
  const letras = terminos.filter(t => t.letra).map(t => t.letra);
  return new Lineal(coefs, b, letras[0] ?? 'x');
}

// ─── La expresión lineal ───────────────────────────────────────────────────────

export class Lineal {
  /** coefs: { letra: Fraccion | entero | texto }; b: el término independiente; letra: la principal. */
  constructor(coefs = {}, b = 0, letra = null) {
    const limpios = {};
    for (const l of Object.keys(coefs).sort()) {
      if (!/^[a-z]$/.test(l)) throw new ErrorAlgebra('letra', `«${l}» no es una letra`);
      const c = F(coefs[l]);
      if (!esCero(c)) limpios[l] = c;
    }
    this.coefs = Object.freeze(limpios);
    this.b = F(b);
    const ls = Object.keys(limpios);
    this.letra = ls.length === 1 ? ls[0] : (letra && /^[a-z]$/.test(letra) ? letra : (ls[0] ?? 'x'));
    Object.freeze(this);
  }

  /** El coeficiente de la letra principal (0 si no está). */
  get a() { return this.coefs[this.letra] ?? CERO; }
  letras() { return Object.keys(this.coefs); }
  esConstante() { return this.letras().length === 0; }
  /** La forma canónica como texto: 'x:3|b:2', 'x:-1/2|y:1|b:0'. */
  canonica() { return [...this.letras().map(l => `${l}:${claveF(this.coefs[l])}`), `b:${claveF(this.b)}`].join('|'); }
  clave() { return this.canonica(); }
  equals(otra) { return this.clave() === aLineal(otra).clave(); }

  /** El valor con la letra (o las letras) sustituida: exacto. */
  evaluar(valor) {
    const valores = valor !== null && typeof valor === 'object' && !(valor instanceof Fraccion) ? valor : null;
    if (!valores && this.letras().length > 1) throw new ErrorAlgebra('dos-letras', 'Con dos letras, evaluar({ x: …, y: … })');
    let r = this.b;
    for (const l of this.letras()) {
      const v = valores ? valores[l] : valor;
      if (v === undefined) throw new ErrorAlgebra('sin-valor', `Falta el valor de ${l}`);
      r = r.sumar(this.coefs[l].multiplicar(aFraccion(v)));
    }
    return r.simplificar();
  }

  sumar(otra) { return sumaDeTerminos([...this.terminos(), ...aLineal(otra).terminos()]).conLetra(this.letra); }
  restar(otra) { return this.sumar(aLineal(otra).opuesta()); }
  porNumero(k) { return sumaDeTerminos(this.terminos().map(t => porT(t, aFraccion(k)))).conLetra(this.letra); }
  opuesta() { return this.porNumero(-1); }
  conLetra(letra) { return new Lineal(this.coefs, this.b, letra); }

  /** Los términos en el orden canónico: las letras en orden alfabético y después el número (si no es 0). */
  terminos() {
    const ts = this.letras().map(l => termino(this.coefs[l], l));
    if (!esCero(this.b) || ts.length === 0) ts.push(termino(this.b));
    return Object.freeze(ts);
  }

  /** '3x + 2', '−x', 'x/2 − 3', '3x/4'; con { constanteDelante: true }, '5 + 2g'. */
  aTexto(_idioma = 'es', { constanteDelante = false } = {}) { return terminosATexto(ordenar(this.terminos(), constanteDelante)); }
  aHtml({ constanteDelante = false } = {}) { return terminosAHtml(ordenar(this.terminos(), constanteDelante)); }
  enPalabras(idioma = 'en') { return terminosEnPalabras(this.terminos(), idioma); }
  /** Todas las lecturas que valen, también en el otro orden (3 + 2x es la misma expresión). */
  lecturasValidas(idioma = 'en') { return lecturasDeTerminos(this.terminos(), idioma, { reordenar: true }); }
  esLecturaValida(texto, idioma = 'en') { return this.lecturasValidas(idioma).some(l => plano(l) === plano(texto)); }
  toString() { return this.aTexto(); }
}

const ordenar = (ts, constanteDelante) => (constanteDelante && ts.length > 1 && ts[ts.length - 1].letra === null ? [ts[ts.length - 1], ...ts.slice(0, -1)] : ts);

/** lineal(3, 2) → 3x + 2; lineal(1, 0, 'n') → n. */
export const lineal = (a, b = 0, letra = 'x') => new Lineal({ [letra]: a }, b, letra);

/** Un Lineal a partir de un Lineal, un número, un texto o una lista de términos. */
export function aLineal(x) {
  if (x instanceof Lineal) return x;
  if (Array.isArray(x)) return sumaDeTerminos(aTerminos(x));
  if (typeof x === 'string') {
    const r = leerExpresion(x, { variasLetras: true });
    if (!r.ok) throw new ErrorAlgebra(r.motivo, `«${x}»: ${r.mensaje.es}`);
    return r.valor;
  }
  return new Lineal({}, x);
}

/** k(ax + b) → kax + kb, reducido. */
export const expandir = (k, expr) => sumaDeTerminos(expandirTerminos(k, expr));
/** k(…) término a término, en el orden en que están escritos: −2(3 − x) → [−6, 2x]. */
export const expandirTerminos = (k, expr) => Object.freeze(aTerminos(expr).map(t => porT(t, aFraccion(k))));

/**
 * Reduce una suma de términos: { resultado (Lineal), grupos: [{ letra, terminos, total }] en el
 * orden en que aparece cada letra (el número al final), agrupados: los términos ordenados por
 * grupos, la línea intermedia del feedback (5x + 2x − 3x + 4 − 1) }.
 */
export function reducir(entrada) {
  const ts = aTerminos(entrada);
  const orden = [];
  for (const t of ts) if (t.letra !== null && !orden.includes(t.letra)) orden.push(t.letra);
  if (ts.some(t => t.letra === null)) orden.push(null);
  const grupos = orden.map(letra => {
    const del = ts.filter(t => t.letra === letra);
    return { letra, terminos: Object.freeze(del), total: termino(del.reduce((s, t) => s.sumar(t.coef), CERO).simplificar(), letra) };
  });
  return { resultado: sumaDeTerminos(ts), grupos, agrupados: Object.freeze(grupos.flatMap(g => g.terminos)) };
}

// ─── Escritura ─────────────────────────────────────────────────────────────────

function textoTermino(t, html) {
  const c = t.coef;
  const n = Math.abs(c.num), d = c.den;
  if (t.letra === null) return html ? htmlFraccion(new Fraccion(n, d)) : textoFraccion(new Fraccion(n, d));
  const L = html ? `<i>${t.letra}</i>` : t.letra;
  const arriba = n === 1 ? L : `${n}${L}`;
  if (d === 1) return arriba;
  return html ? htmlRaya(arriba, d) : `${arriba}/${d}`;
}

function juntar(ts, html) {
  if (!ts.length) return '0';
  return ts.map((t, i) => {
    const neg = t.coef.num < 0;
    const cuerpo = textoTermino(t, html);
    if (i === 0) return neg ? `${MENOS}${cuerpo}` : cuerpo;
    return `${neg ? ` ${MENOS} ` : ' + '}${cuerpo}`;
  }).join('');
}

/** Una suma de términos como texto, tal como está: '5x + 2x − 3x', 'x/2 + x/3'. */
export const terminosATexto = ts => juntar(aTerminos(ts), false);
/** Igual, en HTML: la letra en cursiva y los coeficientes fraccionarios con raya (htmlRaya). */
export const terminosAHtml = ts => juntar(aTerminos(ts), true);

// ─── En palabras ───────────────────────────────────────────────────────────────

/** Cómo se llama cada letra en español (la RAE: «ye» mejor que «i griega», y las dos valen). */
export const LETRAS_ES = { a: 'a', b: 'be', c: 'ce', d: 'de', e: 'e', f: 'efe', g: 'ge', h: 'hache', i: 'i', j: 'jota', k: 'ka', l: 'ele', m: 'eme', n: 'ene', o: 'o', p: 'pe', q: 'cu', r: 'erre', s: 'ese', t: 'te', u: 'u', v: 'uve', w: 'uve doble', x: 'equis', y: 'ye', z: 'zeta' };
const LETRAS_ES_VARIANTES = { y: ['i griega'], w: ['doble uve', 'doble ve'], v: ['ve'] };

const numEs = n => {
  const s = numeroAEspanol(n);
  if (s === 'uno') return 'un';
  if (s.endsWith('veintiuno')) return `${s.slice(0, -'veintiuno'.length)}veintiún`;
  if (s.endsWith(' uno')) return `${s.slice(0, -3)}un`;
  return s;
};

/** Las lecturas de un término, sin signo (la primera es la de enPalabras). */
function lecturasTermino(t, idioma) {
  const c = t.coef.simplificar();
  const n = Math.abs(c.num), d = c.den;
  if (t.letra === null) return lecturasFraccion(new Fraccion(n, d), idioma);
  const es = idioma === 'es';
  const nombres = es ? [LETRAS_ES[t.letra], ...(LETRAS_ES_VARIANTES[t.letra] ?? [])] : [t.letra];
  const salida = [];
  for (const L of nombres) {
    if (d === 1) {
      if (n === 1) { salida.push(L); continue; }
      if (es) {
        salida.push(`${numEs(n)} ${L}`, `${numeroAEspanol(n)} por ${L}`);
        if (n === 2) salida.push(`el doble de ${L}`);
        if (n === 3) salida.push(`el triple de ${L}`);
      } else {
        salida.push(`${numeroAIngles(n)} ${L}`, `${numeroAIngles(n)} times ${L}`);
        if (n === 2) salida.push(`twice ${L}`, `double ${L}`);
      }
      continue;
    }
    const arriba = n === 1 ? L : (es ? `${numEs(n)} ${L}` : `${numeroAIngles(n)} ${L}`);
    const f = new Fraccion(n, d);
    if (es) {
      salida.push(`${arriba} partido por ${numeroAEspanol(d)}`, `${arriba} entre ${numeroAEspanol(d)}`);
      for (const l of lecturasFraccion(f, 'es')) if (!/partido por/.test(l)) salida.push(l === 'la mitad' ? `la mitad de ${L}` : `${l} de ${L}`);
      if (n === 1 && d === 3) salida.push(`la tercera parte de ${L}`);
      if (n === 1 && d === 4) salida.push(`la cuarta parte de ${L}`);
    } else {
      salida.push(`${arriba} over ${numeroAIngles(d)}`, `${arriba} divided by ${numeroAIngles(d)}`);
      for (const l of lecturasFraccion(f, 'en')) if (!/ over /.test(l)) salida.push(`${l} of ${L}`);
      if (n === 1 && d === 2) salida.push(`half ${L}`, `half of ${L}`);
    }
  }
  return [...new Set(salida)];
}

const MAS = { es: ['más'], en: ['plus'] };
const MENOS_P = { es: ['menos'], en: ['minus', 'take away'] };
const DELANTE = { es: ['menos'], en: ['minus', 'negative'] };

function lecturasSecuencia(ts, idioma) {
  let salida = [''];
  ts.forEach((t, i) => {
    const neg = t.coef.num < 0;
    const unes = i === 0 ? (neg ? DELANTE[idioma] : ['']) : (neg ? MENOS_P[idioma] : MAS[idioma]);
    const lecturas = lecturasTermino(t, idioma);
    const nueva = [];
    for (const previa of salida) for (const u of unes) for (const l of lecturas) nueva.push([previa, u, l].filter(Boolean).join(' '));
    salida = nueva;
  });
  return salida;
}

/** Las lecturas de una suma de términos (con { reordenar: true }, también con el número delante). */
export function lecturasDeTerminos(entrada, idioma = 'en', { reordenar = false } = {}) {
  const ts = aTerminos(entrada);
  const salida = new Set(lecturasSecuencia(ts, idioma));
  if (reordenar && ts.length > 1) {
    for (let i = 1; i < ts.length; i++) for (const l of lecturasSecuencia([...ts.slice(i), ...ts.slice(0, i)], idioma)) salida.add(l);
  }
  return [...salida];
}

/** La lectura de una suma de términos: 'two x plus three', 'dos equis más tres'. */
export const terminosEnPalabras = (entrada, idioma = 'en') => lecturasSecuencia(aTerminos(entrada), idioma)[0];

const plano = t => String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-‐‑–—,]/g, ' ').replace(/\s+/g, ' ').trim();
/** ¿Es `texto` una de las `lecturas`? Sin mayúsculas, tildes, guiones ni espacios de más. */
export const esLecturaDe = (lecturas, texto) => lecturas.some(l => plano(l) === plano(texto));

// ─── Lo que teclea el alumno ───────────────────────────────────────────────────

export const MENSAJES = {
  vacio: { es: 'Escribe una expresión.', en: 'Type an expression.' },
  x2: { es: 'El número va delante de la letra: escribe 2x, no x2.', en: 'Put the number before the letter: write 2x, not x2.' },
  potencia: { es: 'Aquí no hay potencias de la letra.', en: 'There are no powers of the letter here.' },
  'producto-letras': { es: 'Aquí no se multiplican dos letras.', en: 'Two letters are not multiplied here.' },
  'dos-letras': { es: 'Usa una sola letra.', en: 'Use only one letter.' },
  'letra-no-valida': { es: 'Esa letra no es la del ejercicio.', en: 'That is not the letter in the exercise.' },
  parentesis: { es: 'Escríbelo sin paréntesis.', en: 'Write it without brackets.' },
  ambiguo: { es: 'No se sabe si la letra va arriba o abajo: escribe 3x/4.', en: 'It is not clear if the letter goes on top or underneath: write 3x/4.' },
  'letra-en-denominador': { es: 'La letra no puede ir en el denominador.', en: 'The letter cannot go in the denominator.' },
  'division-entre-0': { es: 'No se puede dividir entre 0.', en: 'You cannot divide by 0.' },
  ecuacion: { es: 'Escribe solo la expresión, sin el signo =.', en: 'Type only the expression, without the = sign.' },
  'sin-igual': { es: 'Una ecuación lleva un signo =.', en: 'An equation has an = sign.' },
  'dos-iguales': { es: 'Una ecuación lleva un solo signo =.', en: 'An equation has only one = sign.' },
  basura: { es: 'No se entiende lo que has escrito.', en: 'That cannot be read.' },
};

const fallo = motivo => ({ ok: false, motivo, mensaje: MENSAJES[motivo] });
const VULGARES = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅛': [1, 8] };

/** Los tokens: { t: 'num', v: Fraccion } | { t: 'let', v } | { t: op } | un fallo. */
function tokenizar(texto) {
  const s = String(texto ?? '').replace(/[−–—‒]/g, '-').replace(/[·⋅•×*]/g, '*').replace(/[÷:]/g, '/');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.,]/.test(c)) {
      const m = /^(\d*)(?:[.,](\d+))?/.exec(s.slice(i));
      if (!m[0] || (m[1] === '' && m[2] === undefined) || /^[.,]/.test(s.slice(i + m[0].length))) return fallo('basura');
      const ent = m[1] || '0', dec = m[2] ?? '';
      if (ent.length + dec.length > 12) return fallo('basura');
      tokens.push({ t: 'num', v: new Fraccion(Number(ent + dec), 10 ** dec.length).simplificar() });
      i += m[0].length;
      continue;
    }
    if (VULGARES[c]) { tokens.push({ t: 'num', v: new Fraccion(...VULGARES[c]) }); i++; continue; }
    if (/[a-zA-Z]/.test(c)) { tokens.push({ t: 'let', v: c.toLowerCase() }); i++; continue; }
    if ('+-*/'.includes(c)) { tokens.push({ t: c }); i++; continue; }
    if (/[²³⁴^]/.test(c)) return fallo('potencia');
    if ('()[]{}'.includes(c)) return fallo('parentesis');
    if (c === '=') return fallo('ecuacion');
    return fallo('basura');
  }
  return tokens;
}

/** Los términos de una suma ya tokenizada, o un fallo. */
function analizarTokens(tokens) {
  if (!tokens.length) return fallo('vacio');
  const terminos = [];
  let i = 0;
  while (i < tokens.length) {
    // Los signos de delante (−, +, y también «+ −» o «− −»).
    let negativo = false, signos = 0;
    while (i < tokens.length && (tokens[i].t === '+' || tokens[i].t === '-')) { if (tokens[i].t === '-') negativo = !negativo; signos++; i++; }
    if (terminos.length && signos === 0) return fallo('basura');
    if (i >= tokens.length) return fallo(terminos.length || signos ? 'basura' : 'vacio');
    // Los factores: números y como mucho una letra, pegados (2x) o con «·» (2·x, x·3).
    let coef = UNO, letra = null, factores = 0, previo = null;
    while (i < tokens.length && (tokens[i].t === 'num' || tokens[i].t === 'let' || tokens[i].t === '*')) {
      const tk = tokens[i];
      if (tk.t === '*') {
        if (!factores || i + 1 >= tokens.length || (tokens[i + 1].t !== 'num' && tokens[i + 1].t !== 'let')) return fallo('basura');
        previo = '*'; i++; continue;
      }
      if (tk.t === 'num') {
        if (previo === 'num') return fallo('basura');
        if (previo === 'let') return fallo('x2');
        coef = coef.multiplicar(tk.v);
      } else {
        if (letra !== null) return fallo('producto-letras');
        letra = tk.v;
      }
      previo = tk.t; factores++; i++;
    }
    if (!factores) return fallo('basura');
    // Un denominador: un número natural, y el término se acaba ahí.
    if (i < tokens.length && tokens[i].t === '/') {
      const d = tokens[i + 1];
      if (!d) return fallo('basura');
      if (d.t === 'let') return fallo('letra-en-denominador');
      if (d.t !== 'num' || d.v.den !== 1) return fallo('basura');
      if (d.v.num === 0) return fallo('division-entre-0');
      coef = coef.dividir(d.v); // sin simplificar: 6/4 se queda 6/4 en los términos (la práctica puede pedir la irreducible)
      i += 2;
      const sig = tokens[i];
      if (sig && sig.t === 'let') return fallo(letra === null ? 'ambiguo' : 'producto-letras');
      if (sig && sig.t !== '+' && sig.t !== '-') return fallo('basura');
    }
    terminos.push(termino(negativo ? coef.opuesta() : coef, letra));
  }
  return { ok: true, terminos: Object.freeze(terminos) };
}

function comprobarLetras(terminos, { letras = null, variasLetras = false } = {}) {
  const usadas = [...new Set(terminos.filter(t => t.letra).map(t => t.letra))];
  if (letras !== null) {
    const validas = [...(Array.isArray(letras) ? letras : String(letras))].map(l => l.toLowerCase());
    if (usadas.some(l => !validas.includes(l))) return fallo('letra-no-valida');
  }
  if (!variasLetras && usadas.length > 1) return fallo('dos-letras');
  return null;
}

/**
 * Lee una expresión tecleada: { ok: true, valor: Lineal, terminos } o { ok: false, motivo,
 * mensaje }. `letras`: las que valen ('x' o ['x', 'n']; por defecto, cualquiera); `variasLetras`:
 * si valen dos letras distintas (7x + 2y), solo en los ejercicios que las piden.
 */
export function leerExpresion(texto, opciones = {}) {
  const tokens = tokenizar(texto);
  if (!Array.isArray(tokens)) return tokens;
  const r = analizarTokens(tokens);
  if (!r.ok) return r;
  const malas = comprobarLetras(r.terminos, opciones);
  if (malas) return malas;
  return { ok: true, terminos: r.terminos, valor: sumaDeTerminos(r.terminos) };
}

/** Lo tecleado como Lineal, o null. */
export const deTexto = (texto, opciones = {}) => { const r = leerExpresion(texto, opciones); return r.ok ? r.valor : null; };

/** Lee una ecuación tecleada: { ok: true, valor: Ecuacion } o { ok: false, motivo, mensaje }. */
export function leerEcuacion(texto, opciones = {}) {
  const partes = String(texto ?? '').split('=');
  if (!String(texto ?? '').trim()) return fallo('vacio');
  if (partes.length === 1) return fallo('sin-igual');
  if (partes.length > 2) return fallo('dos-iguales');
  const lados = partes.map(p => leerExpresion(p, { ...opciones, variasLetras: true }));
  const malo = lados.find(l => !l.ok);
  if (malo) return malo;
  const todos = [...lados[0].terminos, ...lados[1].terminos];
  const malas = comprobarLetras(todos, opciones);
  if (malas) return malas;
  return { ok: true, valor: new Ecuacion(lados[0].terminos, lados[1].terminos) };
}

/** Lo tecleado como Ecuacion, o null. */
export const deEcuacion = (texto, opciones = {}) => { const r = leerEcuacion(texto, opciones); return r.ok ? r.valor : null; };

// ─── La ecuación ───────────────────────────────────────────────────────────────

const NINGUNA = Object.freeze({ tipo: 'ninguna' });
const INFINITAS = Object.freeze({ tipo: 'infinitas' });
const claveSolucion = s => (s instanceof Fraccion ? `n:${claveF(s)}` : `s:${s.tipo}`);

export class Ecuacion {
  constructor(izq, der) {
    const ti = aTerminos(izq), td = aTerminos(der);
    this.terminosIzq = ti.length ? ti : Object.freeze([termino(0)]);
    this.terminosDer = td.length ? td : Object.freeze([termino(0)]);
    const letras = [...new Set([...this.terminosIzq, ...this.terminosDer].filter(t => t.letra).map(t => t.letra))];
    if (letras.length > 1) throw new ErrorAlgebra('dos-letras', 'Una ecuación de esta unidad tiene una sola incógnita');
    this.letra = letras[0] ?? 'x';
    Object.freeze(this);
  }

  get izq() { return sumaDeTerminos(this.terminosIzq).conLetra(this.letra); }
  get der() { return sumaDeTerminos(this.terminosDer).conLetra(this.letra); }

  /** El coeficiente y el número de «A·x = C» (todo pasado y reducido). */
  forma() {
    const i = this.izq, d = this.der;
    return { A: i.a.restar(d.a).simplificar(), C: d.b.restar(i.b).simplificar() };
  }

  /** La solución (Fraccion irreducible), o { tipo: 'ninguna' } o { tipo: 'infinitas' }. */
  resolver() {
    const { A, C } = this.forma();
    if (esCero(A)) return esCero(C) ? INFINITAS : NINGUNA;
    return C.dividir(A).simplificar();
  }

  /** ¿Cumple v la igualdad? Sustituyendo en los dos miembros tal como están escritos. */
  esSolucion(v) {
    const val = ts => ts.reduce((s, t) => s.sumar(t.letra ? t.coef.multiplicar(aFraccion(v)) : t.coef), CERO);
    return val(this.terminosIzq).equals(val(this.terminosDer));
  }

  /** ¿Tienen las dos las mismas soluciones? */
  equivalente(otra) { return claveSolucion(this.resolver()) === claveSolucion(aEcuacion(otra).resolver()); }

  /** Cada término de los dos miembros por k (k ≠ 0). */
  porNumero(k) {
    const f = aFraccion(k);
    if (esCero(f)) throw new ErrorAlgebra('por-cero', 'Multiplicar por 0 no da una ecuación equivalente');
    return new Ecuacion(this.terminosIzq.map(t => porT(t, f)), this.terminosDer.map(t => porT(t, f)));
  }

  /** El m.c.m. de los denominadores de todos los términos (1 si no hay). */
  mcmDenominadores() { return mcm(...[...this.terminosIzq, ...this.terminosDer].map(t => t.coef.simplificar().den)); }

  /** Todos los términos por m (por defecto, el m.c.m. de los denominadores). */
  sinDenominadores(m = this.mcmDenominadores()) { return this.porNumero(m); }

  /** El método, paso a paso (ver la cabecera). */
  pasos() {
    const salida = [];
    let q = this;
    const m = q.mcmDenominadores();
    const resuelta = q.terminosIzq.length === 1 && q.terminosIzq[0].letra !== null && q.terminosIzq[0].coef.equals(1)
      && q.terminosDer.length === 1 && q.terminosDer[0].letra === null;
    if (m > 1 && !resuelta) { q = q.sinDenominadores(m); salida.push({ tipo: 'denominadores', mcm: m, ecuacion: q }); }
    const conLetra = ts => ts.filter(t => t.letra !== null && !esCero(t.coef));
    const sinLetra = ts => ts.filter(t => t.letra === null && !esCero(t.coef));
    if (!conLetra(q.terminosIzq).length && conLetra(q.terminosDer).length) {
      q = new Ecuacion(q.terminosDer, q.terminosIzq);
      salida.push({ tipo: 'cambiar-miembros', ecuacion: q });
    }
    const xi = conLetra(q.terminosIzq), ci = sinLetra(q.terminosIzq), xd = conLetra(q.terminosDer), cd = sinLetra(q.terminosDer);
    if (xd.length || ci.length) {
      q = new Ecuacion([...xi, ...xd.map(opuestoT)], [...cd, ...ci.map(opuestoT)]);
      salida.push({ tipo: 'transponer', ecuacion: q });
    }
    const { A, C } = q.forma();
    if (q.terminosIzq.length > 1 || q.terminosDer.length > 1) {
      q = new Ecuacion([termino(A, this.letra)], [termino(C)]);
      salida.push({ tipo: 'reducir', ecuacion: q });
    }
    if (esCero(A)) { salida.push({ tipo: esCero(C) ? 'infinitas' : 'sin-solucion', ecuacion: q }); return salida; }
    if (!A.equals(1)) {
      q = new Ecuacion([termino(1, this.letra)], [termino(C.dividir(A).simplificar())]);
      salida.push({ tipo: 'despejar', divisor: A, ecuacion: q });
    } else if (!q.terminosDer[0].coef.mismaForma(C)) {
      q = new Ecuacion([termino(1, this.letra)], [termino(C)]);
      salida.push({ tipo: 'simplificar', ecuacion: q });
    }
    return salida;
  }

  /** La forma canónica: los dos miembros reducidos, en ese orden ('x:1|b:3=b:10'). Para las huellas. */
  clave() { return `${this.izq.clave()}=${this.der.clave()}`; }
  aTexto() { return `${terminosATexto(this.terminosIzq)} = ${terminosATexto(this.terminosDer)}`; }
  aHtml() { return `${terminosAHtml(this.terminosIzq)} = ${terminosAHtml(this.terminosDer)}`; }
  enPalabras(idioma = 'en') { return `${terminosEnPalabras(this.terminosIzq, idioma)} ${IGUAL[idioma][0]} ${terminosEnPalabras(this.terminosDer, idioma)}`; }
  /** Todas las lecturas (sin reordenar los términos: es la ecuación tal como está escrita). */
  lecturasValidas(idioma = 'en') {
    const izq = lecturasDeTerminos(this.terminosIzq, idioma), der = lecturasDeTerminos(this.terminosDer, idioma);
    const salida = [];
    for (const a of izq) for (const igual of IGUAL[idioma]) for (const b of der) salida.push(`${a} ${igual} ${b}`);
    return salida;
  }
  esLecturaValida(texto, idioma = 'en') { return esLecturaDe(this.lecturasValidas(idioma), texto); }
  toString() { return this.aTexto(); }
}

const IGUAL = { en: ['equals', 'is equal to', 'is'], es: ['es igual a', 'igual a'] };

/** ecuacion('x + 3', 10) → x + 3 = 10. */
export const ecuacion = (izq, der) => new Ecuacion(izq, der);

/** Una Ecuacion a partir de una Ecuacion o de un texto con «=». */
export function aEcuacion(x) {
  if (x instanceof Ecuacion) return x;
  const r = leerEcuacion(x);
  if (!r.ok) throw new ErrorAlgebra(r.motivo, `«${x}»: ${r.mensaje.es}`);
  return r.valor;
}

/** FNV-1a de 32 bits en base 36, la de `equivalentes/logica.js`: para excluir casos de examen sin escribirlos. */
export const huella = s => { let h = 0x811c9dc5; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
/** La huella de la forma canónica de una expresión o una ecuación (no la del texto: 3 + x y x + 3 dan la misma). */
export const huellaCanonica = x => huella((x instanceof Ecuacion || (typeof x === 'string' && x.includes('=')) ? aEcuacion(x) : aLineal(x)).clave());

// ─── Errores típicos ───────────────────────────────────────────────────────────

const mismaExpr = (mal, bien) => mal === null || aLineal(mal).equals(bien);
const siDistintaExpr = (mal, bien) => (mismaExpr(mal, bien) ? null : mal);
const siDistintoNum = (mal, bien) => (mal === null || aFraccion(mal).equals(bien) ? null : mal);
const siDistintaEc = (mal, bien) => (mal === null || mal.equivalente(bien) ? null : mal);
const entero = f => f.den === 1;

/** 3x + 2 = 5x: suma el número (y las otras letras) con la x. */
export function sumarNoSemejantes(expr) {
  const e = aLineal(expr);
  if (e.esConstante() || (esCero(e.b) && e.letras().length === 1)) return null;
  const total = [...e.letras().map(l => e.coefs[l]), e.b].reduce((s, c) => s.sumar(c), CERO);
  return siDistintaExpr(lineal(total, 0, e.letra), e);
}

/** x · x = 2x (y 3x · 2x = 5x): suma los coeficientes como si fuera x + x. Lo bueno, x², no es lineal. */
export const xPorXDosX = (a = 1, c = 1, letra = 'x') => lineal(aFraccion(a).sumar(c), 0, letra);

/** 3x con x = 4 → 34: escribe el número pegado al coeficiente. Solo con coeficiente y valor naturales. */
export function yuxtaponerAlSustituir(expr, valor) {
  const e = aLineal(expr), v = aFraccion(valor);
  if (e.letras().length !== 1 || !entero(e.a) || e.a.num < 2 || !entero(v) || v.num < 0) return null;
  return siDistintoNum(new Fraccion(Number(`${e.a.num}${v.num}`), 1).sumar(e.b).simplificar(), e.evaluar(v));
}

/** 5 − x con x = −2 → 3: sustituye sin el signo del número negativo (sin paréntesis). */
export function perderSignoAlSustituir(expr, valor) {
  const e = aLineal(expr), v = aFraccion(valor);
  return v.num >= 0 ? null : siDistintoNum(e.evaluar(v.opuesta()), e.evaluar(v));
}

/** 2 + 3x con x = 4 → (2 + 3) · 4 = 20: opera de izquierda a derecha. Con el número detrás (3x + 2), 3 · (4 + 2). */
export function saltarseJerarquia(expr, valor, { constanteDelante = true } = {}) {
  const e = aLineal(expr), v = aFraccion(valor);
  if (e.letras().length !== 1 || esCero(e.b)) return null;
  const mal = constanteDelante ? e.b.sumar(e.a).multiplicar(v) : e.a.multiplicar(v.sumar(e.b));
  return siDistintoNum(mal.simplificar(), e.evaluar(v));
}

/** «el doble» como x + 2 (y «el triple», x + 3). */
export const porComoMas = (k, letra = 'x') => (aFraccion(k).equals(1) ? null : lineal(1, k, letra));
/** «tres más que un número» como 3x. */
export const masComoPor = (n, letra = 'x') => (aFraccion(n).equals(1) || esCero(aFraccion(n)) ? null : lineal(n, 0, letra));
/** «la mitad» como 2x. */
export const entreComoPor = (k, letra = 'x') => (aFraccion(k).equals(1) ? null : lineal(k, 0, letra));
/** «la mitad» como x − 2. */
export const entreComoMenos = (k, letra = 'x') => lineal(1, aFraccion(k).opuesta(), letra);
/** «tres menos que un número» como 3 − x. */
export const menosQueAlReves = (n, letra = 'x') => (esCero(aFraccion(n)) ? null : lineal(-1, n, letra));
/** «el siguiente» como x − 1, y «el anterior» como x + 1: `paso` es +1 (lo bueno es el siguiente) o −1. */
export const siguienteYAnterior = (paso = 1, letra = 'x') => lineal(1, -paso, letra);
/** «el doble de la suma de un número y cinco» como 2x + 5: el paréntesis olvidado. */
export const parentesisOlvidado = (k, n, letra = 'x') => siDistintaExpr(lineal(k, n, letra), expandir(k, lineal(1, n, letra)));
/** «el doble de un número más cinco» como 2x + 10: un paréntesis que no está. */
export const parentesisDeMas = (k, n, letra = 'x') => siDistintaExpr(expandir(k, lineal(1, n, letra)), lineal(k, n, letra));

/** 3(x − 2) = 3x − 2: multiplica solo el primer término (en el orden escrito). */
export function distribuirSoloPrimero(k, expr) {
  const ts = aTerminos(expr), f = aFraccion(k);
  if (ts.length < 2) return null;
  return siDistintaExpr(sumaDeTerminos([porT(ts[0], f), ...ts.slice(1)]), expandir(f, ts));
}
/** −2(3 − x) = −6 − 2x: el signo menos solo se aplica al primer término; los demás, por el número sin signo. */
export function signoSoloPrimero(k, expr) {
  const ts = aTerminos(expr), f = aFraccion(k);
  if (f.num >= 0 || ts.length < 2) return null;
  return siDistintaExpr(sumaDeTerminos([porT(ts[0], f), ...ts.slice(1).map(t => porT(t, f.opuesta()))]), expandir(f, ts));
}
/** 3(x − 2) = 3x − 2 también cuando el número va delante: multiplica solo los términos con letra. */
export function multiplicarSoloLaX(k, expr) {
  const ts = aTerminos(expr), f = aFraccion(k);
  return siDistintaExpr(sumaDeTerminos(ts.map(t => (t.letra ? porT(t, f) : t))), expandir(f, ts));
}
/** 4 + 4(5 − 2x) = 8(5 − 2x): suma antes de multiplicar. */
export function sumarAntesDelParentesis(c, k, expr) {
  const fc = aFraccion(c), fk = aFraccion(k);
  if (esCero(fc)) return null;
  return siDistintaExpr(expandir(fc.sumar(fk), expr), expandir(fk, expr).sumar(fc));
}

/** x + 3 = 10 → x = 10 + 3: pasa los términos al otro miembro sin cambiarles el signo. */
export function transponerSinSigno(ec) {
  const q = aEcuacion(ec);
  const L = t => t.letra !== null;
  const xi = q.terminosIzq.filter(L), ci = q.terminosIzq.filter(t => !L(t) && !esCero(t.coef));
  const xd = q.terminosDer.filter(L), cd = q.terminosDer.filter(t => !L(t) && !esCero(t.coef));
  if (!xi.length || (!ci.length && !xd.length)) return null;
  return siDistintaEc(new Ecuacion([...xi, ...xd], [...cd, ...ci]), q);
}

/** 3x = 12 → x = 12 − 3: el número que multiplica pasa restando. Sobre la ecuación ya reducida (Ax = C). */
export function pasarFactorRestando(ec) {
  const q = aEcuacion(ec), { A, C } = q.forma();
  if (esCero(A) || A.equals(1)) return null;
  return siDistintaEc(new Ecuacion([termino(1, q.letra)], [termino(C), termino(A.opuesta())]), q);
}
/** 3x = 12 → x = 36: multiplica en vez de dividir. */
export function multiplicarEnVezDeDividir(ec) {
  const q = aEcuacion(ec), { A, C } = q.forma();
  if (esCero(A)) return null;
  return siDistintaEc(new Ecuacion([termino(1, q.letra)], [termino(C.multiplicar(A).simplificar())]), q);
}
/** 12x = 3 → x = 4: divide al revés. */
export function invertirCoeficiente(ec) {
  const q = aEcuacion(ec), { A, C } = q.forma();
  if (esCero(A) || esCero(C)) return null;
  return siDistintaEc(new Ecuacion([termino(1, q.letra)], [termino(A.dividir(C).simplificar())]), q);
}
/** −2x = 8 → x = 4: al pasar dividiendo un número negativo, le quita el signo. */
export function signoAlDividir(ec) {
  const q = aEcuacion(ec), { A, C } = q.forma();
  if (A.num >= 0 || esCero(C)) return null;
  return siDistintaEc(new Ecuacion([termino(1, q.letra)], [termino(C.dividir(A.opuesta()).simplificar())]), q);
}
/** 0x = 2 → x = 2 (y 0x = 0 → x = 0): da un valor cuando la x se ha ido. */
export function ceroXComoX(ec) {
  const q = aEcuacion(ec), { A, C } = q.forma();
  if (!esCero(A)) return null;
  return new Ecuacion([termino(1, q.letra)], [termino(C)]);
}
/** x/2 + 1 = x/3 con m.c.m. 6 → 3x + 1 = 2x: multiplica solo los términos que tienen denominador. */
export function mcmSoloDenominadores(ec, m = null) {
  const q = aEcuacion(ec), k = m ?? q.mcmDenominadores();
  const conDen = t => t.coef.simplificar().den > 1;
  const todos = [...q.terminosIzq, ...q.terminosDer];
  if (k === 1 || !todos.some(conDen) || todos.every(conDen)) return null;
  const f = t => (conDen(t) ? porT(t, k) : t);
  return siDistintaEc(new Ecuacion(q.terminosIzq.map(f), q.terminosDer.map(f)), q);
}
/** 3x/4 por 12 → 3x en vez de 9x: divide el m.c.m. entre el denominador y no multiplica por el numerador. */
export function olvidarNumerador(ec, m = null) {
  const q = aEcuacion(ec), k = m ?? q.mcmDenominadores();
  const raro = t => { const c = t.coef.simplificar(); return c.den > 1 && Math.abs(c.num) !== 1; };
  if (![...q.terminosIzq, ...q.terminosDer].some(raro)) return null;
  const f = t => { const c = t.coef.simplificar(); return raro(t) ? termino(Math.sign(c.num) * (k / c.den), t.letra) : porT(t, k); };
  return siDistintaEc(new Ecuacion(q.terminosIzq.map(f), q.terminosDer.map(f)), q);
}
/** x = −5 escrito como x = 5: el signo de la solución perdido o cambiado. */
export function signoDeLaSolucion(ec) {
  const q = aEcuacion(ec), s = q.resolver();
  if (!(s instanceof Fraccion) || esCero(s)) return null;
  return new Ecuacion([termino(1, q.letra)], [termino(s.opuesta())]);
}
/** Contesta el valor de x cuando el problema pide otra cosa (la edad de la hermana, x + 3). */
export const contestarX = (x, pedido) => siDistintoNum(aFraccion(x), pedido);

export const ERRORES_TIPICOS = {
  'suma-no-semejantes': { fn: sumarNoSemejantes, devuelve: 'lineal', ejemplo: '3x + 2 = 5x',
    nombre: { es: 'Ha sumado términos que no son semejantes', en: 'Added terms that are not like terms' } },
  'x-por-x-dos-x': { fn: xPorXDosX, devuelve: 'lineal', ejemplo: 'x · x = 2x',
    nombre: { es: 'Ha sumado en vez de multiplicar: x · x no es 2x', en: 'Added instead of multiplying: x · x is not 2x' } },
  'yuxtaponer-al-sustituir': { fn: yuxtaponerAlSustituir, devuelve: 'numero', ejemplo: '3x con x = 4 da 34',
    nombre: { es: 'Ha escrito el número pegado al coeficiente en vez de multiplicar', en: 'Wrote the number next to the coefficient instead of multiplying' } },
  'signo-al-sustituir': { fn: perderSignoAlSustituir, devuelve: 'numero', ejemplo: '5 − x con x = −2 da 3',
    nombre: { es: 'Ha sustituido sin poner el número negativo entre paréntesis', en: 'Substituted the negative number without brackets' } },
  'jerarquia-al-sustituir': { fn: saltarseJerarquia, devuelve: 'numero', ejemplo: '2 + 3x con x = 4 da 20',
    nombre: { es: 'Ha operado de izquierda a derecha sin respetar la jerarquía', en: 'Worked from left to right without following the order of operations' } },
  'por-como-mas': { fn: porComoMas, devuelve: 'lineal', ejemplo: 'el doble de un número: x + 2',
    nombre: { es: 'Ha sumado en vez de multiplicar', en: 'Added instead of multiplying' } },
  'mas-como-por': { fn: masComoPor, devuelve: 'lineal', ejemplo: 'tres más que un número: 3x',
    nombre: { es: 'Ha multiplicado en vez de sumar', en: 'Multiplied instead of adding' } },
  'entre-como-por': { fn: entreComoPor, devuelve: 'lineal', ejemplo: 'la mitad de un número: 2x',
    nombre: { es: 'Ha multiplicado en vez de dividir', en: 'Multiplied instead of dividing' } },
  'entre-como-menos': { fn: entreComoMenos, devuelve: 'lineal', ejemplo: 'la mitad de un número: x − 2',
    nombre: { es: 'Ha restado en vez de dividir', en: 'Subtracted instead of dividing' } },
  'menos-que-al-reves': { fn: menosQueAlReves, devuelve: 'lineal', ejemplo: 'tres menos que un número: 3 − x',
    nombre: { es: 'Ha restado al revés: «tres menos que un número» es x − 3', en: 'Subtracted the wrong way round: «three less than a number» is x − 3' } },
  'siguiente-y-anterior': { fn: siguienteYAnterior, devuelve: 'lineal', ejemplo: 'el siguiente de un número: x − 1',
    nombre: { es: 'Ha confundido el siguiente con el anterior', en: 'Mixed up the next number and the previous number' } },
  'parentesis-olvidado': { fn: parentesisOlvidado, devuelve: 'lineal', ejemplo: 'el doble de la suma de un número y cinco: 2x + 5',
    nombre: { es: 'Ha olvidado el paréntesis: el doble es de toda la suma', en: 'Forgot the brackets: it is twice the whole sum' } },
  'parentesis-de-mas': { fn: parentesisDeMas, devuelve: 'lineal', ejemplo: 'el doble de un número más cinco: 2x + 10',
    nombre: { es: 'Ha multiplicado también el número que se suma después', en: 'Also multiplied the number that is added afterwards' } },
  'distribuir-solo-primero': { fn: distribuirSoloPrimero, devuelve: 'lineal', ejemplo: '3(x − 2) = 3x − 2',
    nombre: { es: 'Ha multiplicado solo el primer término del paréntesis', en: 'Multiplied only the first term in the brackets' } },
  'signo-solo-primero': { fn: signoSoloPrimero, devuelve: 'lineal', ejemplo: '−(x − 2) = −x − 2',
    nombre: { es: 'Ha cambiado el signo solo del primer término del paréntesis', en: 'Changed the sign of the first term in the brackets only' } },
  'multiplicar-solo-la-x': { fn: multiplicarSoloLaX, devuelve: 'lineal', ejemplo: '3(5 − x) = 5 − 3x',
    nombre: { es: 'Ha multiplicado solo el término con x', en: 'Multiplied only the term with x' } },
  'sumar-antes-del-parentesis': { fn: sumarAntesDelParentesis, devuelve: 'lineal', ejemplo: '4 + 4(5 − 2x) = 8(5 − 2x)',
    nombre: { es: 'Ha sumado antes de multiplicar el paréntesis', en: 'Added before multiplying out the brackets' } },
  'transponer-sin-signo': { fn: transponerSinSigno, devuelve: 'ecuacion', ejemplo: 'x + 3 = 10 → x = 10 + 3',
    nombre: { es: 'Ha pasado un término al otro miembro sin cambiarle el signo', en: 'Moved a term to the other side without changing its sign' } },
  'pasar-factor-restando': { fn: pasarFactorRestando, devuelve: 'ecuacion', ejemplo: '3x = 12 → x = 12 − 3',
    nombre: { es: 'Ha pasado restando el número que multiplica a la x', en: 'Subtracted the number that multiplies x instead of dividing' } },
  'multiplicar-en-vez-de-dividir': { fn: multiplicarEnVezDeDividir, devuelve: 'ecuacion', ejemplo: '3x = 12 → x = 36',
    nombre: { es: 'Ha multiplicado en vez de dividir', en: 'Multiplied instead of dividing' } },
  'invertir-coeficiente': { fn: invertirCoeficiente, devuelve: 'ecuacion', ejemplo: '12x = 3 → x = 4',
    nombre: { es: 'Ha dividido al revés', en: 'Divided the wrong way round' } },
  'signo-al-dividir': { fn: signoAlDividir, devuelve: 'ecuacion', ejemplo: '−2x = 8 → x = 4',
    nombre: { es: 'Ha perdido el signo del número que pasa dividiendo', en: 'Lost the sign of the number you divide by' } },
  'cero-x-como-x': { fn: ceroXComoX, devuelve: 'ecuacion', ejemplo: '0x = 2 → x = 2',
    nombre: { es: 'Ha dado un valor a x cuando la x se había ido', en: 'Gave x a value when the x had gone' } },
  'mcm-solo-denominadores': { fn: mcmSoloDenominadores, devuelve: 'ecuacion', ejemplo: 'x/2 + 1 = x/3 → 3x + 1 = 2x',
    nombre: { es: 'Ha multiplicado por el m.c.m. solo los términos con denominador', en: 'Multiplied by the LCM only the terms with a denominator' } },
  'olvidar-numerador': { fn: olvidarNumerador, devuelve: 'ecuacion', ejemplo: '3x/4 = 6 → x = 24 (es 3x = 24)',
    nombre: { es: 'Ha dividido el m.c.m. entre el denominador y no ha multiplicado por el numerador', en: 'Divided the LCM by the denominator but did not multiply by the numerator' } },
  'signo-de-la-solucion': { fn: signoDeLaSolucion, devuelve: 'ecuacion', ejemplo: 'x + 9 = 4 → x = 5',
    nombre: { es: 'Ha perdido el signo de la solución', en: 'Lost the sign of the solution' } },
  'contestar-x': { fn: contestarX, devuelve: 'numero', ejemplo: 'pide la edad de la hermana (x + 3) y contesta x',
    nombre: { es: 'Ha contestado el valor de x, pero el problema pregunta otra cosa', en: 'Gave the value of x, but the problem asks for something else' } },
};

/**
 * Lo que NO es un error (regla 4 de la unidad): nunca se corrige como fallo ni sirve de
 * distractor.
 */
export const NO_ES_ERROR = {
  'x-por-numero': { es: 'Escribir x · 3 en vez de 3x', en: 'Writing x · 3 instead of 3x' },
  'uno-x': { es: 'Escribir 1x en vez de x', en: 'Writing 1x instead of x' },
  'otro-orden': { es: 'Escribir los términos en otro orden (3 + 2x es 2x + 3)', en: 'Writing the terms in another order (3 + 2x is 2x + 3)' },
  'sin-simplificar': { es: 'Dar la solución sin simplificar cuando no se pide la irreducible', en: 'Giving the solution unsimplified when the simplest form is not asked for' },
  'otro-camino': { es: 'Resolver con otros pasos que también valen (pasar antes la x o el número; multiplicar por un múltiplo del m.c.m.)', en: 'Solving with other valid steps (moving x or the number first; multiplying by a multiple of the LCM)' },
  'punto-con-parentesis': { es: 'Escribir 3 · (x − 2) en vez de 3(x − 2)', en: 'Writing 3 · (x − 2) instead of 3(x − 2)' },
};

function claveDe(v) {
  if (v instanceof Ecuacion) return claveSolucion(v.resolver());
  if (v instanceof Lineal) return v.esConstante() ? `n:${claveF(v.b)}` : `e:${v.clave()}`;
  if (v instanceof Fraccion || Number.isSafeInteger(v)) return `n:${claveF(aFraccion(v))}`;
  if (v && typeof v === 'object' && v.tipo) return `s:${v.tipo}`;
  if (typeof v === 'string') return v.includes('=') ? claveDe(aEcuacion(v)) : claveDe(aLineal(v));
  throw new ErrorAlgebra('valor', `No sé comparar «${v}»`);
}

/**
 * Los distractores que sirven: `candidatos` = [[id, …argumentos], …] de ERRORES_TIPICOS;
 * devuelve [{ valor, error }] sin los null, sin el equivalente de la correcta y sin dos
 * equivalentes entre sí (se queda el primero). Una ecuación cuenta por su solución, así que
 * x = 13 y 13 son el mismo valor: con la solución como correcta, sobra la ecuación que la da.
 */
export function distractores(candidatos, correcta) {
  const vistos = new Set([claveDe(correcta)]);
  const salida = [];
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id];
    if (!e) throw new Error(`Error típico desconocido: ${id}`);
    const valor = e.fn(...args);
    if (valor === null) continue;
    const clave = claveDe(valor);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push({ valor, error: id });
  }
  return salida;
}

/** ¿Hay en la lista dos equivalentes (expresiones por forma canónica, números por valor, ecuaciones por solución)? */
export function hayEquivalentes(lista) {
  const claves = lista.map(claveDe);
  return new Set(claves).size !== claves.length;
}

// ─── Traducción: el hilo A ─────────────────────────────────────────────────────

/**
 * Las construcciones de traducir (U6-1A-01, 1A-02, 1A-04, 3A-02 y U6-1B-02). Cada una:
 * { id, es(n), en(n), glosa (la palabra inglesa que decide, con su traducción), expresion(n, letra) → Lineal (o null en las
 * parejas), pareja(n, letra) → [Lineal, Lineal] (solo las parejas), errores(n) → candidatos de
 * `distractores` }. `n` es el número que lleva la frase (de 2 en adelante; se ignora si no
 * lleva ninguno). Las frases en inglés no son ambiguas: «twice a number, plus five» frente a
 * «twice the sum of a number and five» (regla 6 de la unidad).
 */
const nEn = n => numeroAIngles(n), nEs = n => numeroAEspanol(n);
export const FRASES = Object.freeze([
  { id: 'doble', es: () => 'el doble de un número', en: () => 'twice a number', glosa: 'twice (el doble)',
    expresion: (_n, L = 'x') => lineal(2, 0, L), errores: () => [['por-como-mas', 2]] },
  { id: 'triple', es: () => 'el triple de un número', en: () => 'three times a number', glosa: 'three times (el triple)',
    expresion: (_n, L = 'x') => lineal(3, 0, L), errores: () => [['por-como-mas', 3]] },
  { id: 'mitad', es: () => 'la mitad de un número', en: () => 'half of a number', glosa: 'half of (la mitad de)',
    expresion: (_n, L = 'x') => lineal(new Fraccion(1, 2), 0, L), errores: () => [['entre-como-por', 2], ['entre-como-menos', 2]] },
  { id: 'tercio', es: () => 'la tercera parte de un número', en: () => 'a third of a number', glosa: 'a third of (la tercera parte de)',
    expresion: (_n, L = 'x') => lineal(new Fraccion(1, 3), 0, L), errores: () => [['entre-como-por', 3], ['entre-como-menos', 3]] },
  { id: 'mas-que', es: n => `${nEs(n)} más que un número`, en: n => `${nEn(n)} more than a number`, glosa: 'more than (más que)',
    expresion: (n, L = 'x') => lineal(1, n, L), errores: n => [['mas-como-por', n]] },
  { id: 'menos-que', es: n => `${nEs(n)} menos que un número`, en: n => `${nEn(n)} less than a number`, glosa: 'less than (menos que)',
    expresion: (n, L = 'x') => lineal(1, -n, L), errores: n => [['menos-que-al-reves', n]] },
  { id: 'siguiente', es: () => 'el siguiente de un número', en: () => 'the next number after a number', glosa: 'the next number (el siguiente)',
    expresion: (_n, L = 'x') => lineal(1, 1, L), errores: () => [['siguiente-y-anterior', 1]] },
  { id: 'anterior', es: () => 'el anterior de un número', en: () => 'the number before a number', glosa: 'the number before (el anterior)',
    expresion: (_n, L = 'x') => lineal(1, -1, L), errores: () => [['siguiente-y-anterior', -1]] },
  { id: 'doble-mas', es: n => `el doble de un número más ${nEs(n)}`, en: n => `twice a number, plus ${nEn(n)}`, glosa: 'twice (el doble)',
    expresion: (n, L = 'x') => lineal(2, n, L), errores: n => [['parentesis-de-mas', 2, n]] },
  { id: 'doble-de-la-suma', es: n => `el doble de la suma de un número y ${nEs(n)}`, en: n => `twice the sum of a number and ${nEn(n)}`, glosa: 'twice the sum (el doble de la suma)',
    expresion: (n, L = 'x') => lineal(2, 2 * n, L), errores: n => [['parentesis-olvidado', 2, n]] },
  { id: 'mitad-menos', es: n => `la mitad de un número menos ${nEs(n)}`, en: n => `half of a number, minus ${nEn(n)}`, glosa: 'half of (la mitad de)',
    expresion: (n, L = 'x') => lineal(new Fraccion(1, 2), -n, L), errores: n => [['parentesis-de-mas', new Fraccion(1, 2), -n]] },
  { id: 'suma-consecutivos', es: () => 'la suma de dos números consecutivos', en: () => 'the sum of two consecutive numbers', glosa: 'consecutive (seguidos)',
    expresion: (_n, L = 'x') => lineal(2, 1, L), errores: () => [['suma-no-semejantes', lineal(2, 1)]] },
  { id: 'consecutivos', es: () => 'dos números consecutivos', en: () => 'two consecutive numbers', glosa: 'consecutive (seguidos)',
    expresion: () => null, pareja: (_n, L = 'x') => [lineal(1, 0, L), lineal(1, 1, L)], errores: () => [] },
  { id: 'pares-consecutivos', es: () => 'dos números pares consecutivos', en: () => 'two consecutive even numbers', glosa: 'consecutive even numbers (pares seguidos)',
    expresion: () => null, pareja: (_n, L = 'x') => [lineal(1, 0, L), lineal(1, 2, L)], errores: () => [] },
  { id: 'numero-y-doble', es: () => 'un número y su doble', en: () => 'a number and twice that number', glosa: 'twice (el doble)',
    expresion: () => null, pareja: (_n, L = 'x') => [lineal(1, 0, L), lineal(2, 0, L)], errores: () => [] },
].map(f => Object.freeze(f)));
