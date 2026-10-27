// Práctica «Léelo en inglés» de la unidad 4 (Fractions): lógica pura (sin DOM ni red).
// Cuatro ejercicios:
//   1. Emparejar   cinco términos en inglés con cinco en español (vocabulario de 1B, 2B y 3B)
//   2. La lectura  una fracción o una cuenta con fracciones y cuatro lecturas en inglés
//   3. ¿Qué pide?  un enunciado corto en inglés con su palabra clave y cuatro traducciones de la pregunta
//   4. Dictado     una frase en inglés y el alumno escribe la cuenta con fracciones
//
// Un ítem es DATOS. Los de elegir (2 y 3) son
// { plantilla, instruccion, notacion (html), opciones, solucion, sesion }, con `opciones` ya
// barajada: { texto, html?, correcta, error, por_que } donde `error` es el id de un error
// típico (de ERRORES_TIPICOS de `_comun/fracciones.js` o de ERRORES_LECTURA, aquí) y `por_que`
// {es, en} dice qué pasa con los números del ítem. Ninguna falsa es otra forma válida de decir
// lo mismo: three quarters / three fourths, a half / one half, times / multiplied by, equals / is,
// simplify / reduce y compañía no se enfrentan, y una fracción y sus equivalentes cuentan como
// la misma respuesta (se comprueba por valor, nunca con decimales).
//
// `sesion` es la primera sesión de la unidad en la que el ítem tiene sentido (inventario:
// 1B-01…1B-07 en la 1; 2B-01 y 2B-02 en la 5; el producto y las potencias, en la 7; el
// cociente, en la 9). Esta práctica es de toda la unidad; el campo existe para que la tarea de
// la semana, si quiere, restrinja.

import { numeroAIngles } from '../../src/ejercicios/palabras.js';
import {
  fraccion, enPalabras, lecturasValidas, ordinalIngles, leerFraccion, aTexto,
  htmlFraccion, htmlCuenta, ERRORES_TIPICOS, MENOS,
} from '../_comun/fracciones.js';

export { numeroAIngles };
const w = numeroAIngles;

// ─── Errores propios de la lectura (los de las cuentas están en ERRORES_TIPICOS) ──────────

export const ERRORES_LECTURA = {
  'cardinal-en-vez-de-ordinal': { nombre: { es: 'Ha leído el denominador con un número normal (cardinal) y no con un ordinal', en: 'Read the denominator with a normal number (cardinal) instead of an ordinal' } },
  'numerador-y-denominador-al-reves': { nombre: { es: 'Ha confundido el numerador con el denominador', en: 'Mixed up the numerator and the denominator' } },
  'ordinal-parecido': { nombre: { es: 'Ha confundido dos ordinales que suenan parecido (fifths y fifteenths)', en: 'Mixed up two ordinals that sound alike (fifths and fifteenths)' } },
  'ordinal-literal': { nombre: { es: 'Ha leído el 2 como «second» en vez de «half»', en: 'Read the 2 as “second” instead of “half”' } },
  'operacion-cambiada': { nombre: { es: 'Ha cambiado la operación', en: 'Changed the operation' } },
  'cuadrado-y-cubo-confundidos': { nombre: { es: 'Ha confundido squared (al cuadrado) con cubed (al cubo)', en: 'Mixed up squared with cubed' } },
  // Ejercicio 1
  'vocabulario-confundido': { nombre: { es: 'Ha emparejado un término con la traducción de otro', en: 'Matched a term with the translation of another one' } },
  'confunde-contrarios': { nombre: { es: 'Ha confundido dos palabras contrarias (numerator y denominator, proper e improper, greater y less…)', en: 'Mixed up two opposite words (numerator and denominator, proper and improper, greater and less…)' } },
  // Ejercicio 3
  'confunde-lo-que-queda-con-lo-gastado': { nombre: { es: 'Ha confundido lo que queda con lo que se gasta', en: 'Mixed up what is left with what is spent' } },
  'confunde-lo-que-da-con-lo-que-queda': { nombre: { es: 'Ha confundido lo que se da con lo que queda', en: 'Mixed up what is given away with what is left' } },
  'confunde-el-resto-con-la-parte': { nombre: { es: 'Ha confundido «the rest» (el resto) con la parte', en: 'Mixed up “the rest” with the part' } },
  'confunde-sombreado-con-sin-sombrear': { nombre: { es: 'Ha confundido lo sombreado con lo que no lo está', en: 'Mixed up the shaded part with the unshaded part' } },
  'confunde-lo-que-cumple-con-lo-que-no': { nombre: { es: 'Ha confundido los alumnos que lo cumplen con los que no', en: 'Mixed up the students who do it with those who do not' } },
  'confunde-el-total-con-lo-pedido': { nombre: { es: 'Ha preguntado por el total y no por lo que pide el enunciado', en: 'Asked for the total instead of what the problem asks' } },
  'confunde-partes-iguales-con-sombreadas': { nombre: { es: 'Ha confundido el número de partes iguales con las partes sombreadas', en: 'Mixed up the number of equal parts with the shaded parts' } },
  'fraccion-en-vez-de-cantidad': { nombre: { es: 'Ha leído «how much / how many» como si pidiera una fracción', en: 'Read “how much / how many” as if it asked for a fraction' } },
  'cantidad-en-vez-de-fraccion': { nombre: { es: 'Ha leído «what fraction» como si pidiera una cantidad', en: 'Read “what fraction” as if it asked for an amount' } },
  // Ejercicio 4
  'operacion-confundida': { nombre: { es: 'Ha elegido otra operación', en: 'Chose a different operation' } },
  'orden-invertido': { nombre: { es: 'Ha puesto las fracciones en el orden contrario (en una resta o un cociente importa)', en: 'Put the fractions the other way round (it matters in a subtraction or a quotient)' } },
  'fraccion-mal-escrita': { nombre: { es: 'Ha escrito una fracción que no es la que dice la frase', en: 'Wrote a fraction that is not the one in the sentence' } },
};

/** Nombre {es, en} de cualquier error de la práctica. */
export const nombreDe = id => (ERRORES_TIPICOS[id] ?? ERRORES_LECTURA[id])?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

// ─── Utilidades ──────────────────────────────────────────────────────────────────────────

class ItemPobre extends Error {}

const par = (es, en) => ({ es, en });
const H = (f, compacta = true) => htmlFraccion(f, { compacta });
const euros = k => `${k} €`;

/** Una de cada error primero (al azar), luego las que sobren, sin textos repetidos. */
function elegirFalsas(rng, falsas, n = 3) {
  const vistos = new Set();
  const unicas = [];
  for (const f of rng.barajar(falsas)) {
    if (vistos.has(f.texto)) continue;
    vistos.add(f.texto);
    unicas.push(f);
  }
  const elegidas = [];
  const errores = new Set();
  for (const f of unicas) {
    if (elegidas.length >= n) break;
    if (!errores.has(f.error)) { errores.add(f.error); elegidas.push(f); }
  }
  for (const f of unicas) {
    if (elegidas.length >= n) break;
    if (!elegidas.includes(f)) elegidas.push(f);
  }
  return elegidas;
}

function armar(rng, { plantilla, instruccion, notacion = '', correcta, falsas, solucion, sesion, minFalsas = 2 }) {
  const buenas = elegirFalsas(rng, falsas.filter(f => f.texto !== correcta.texto));
  if (buenas.length < minFalsas) throw new ItemPobre(plantilla);
  const opciones = rng.barajar([{ ...correcta, correcta: true, error: null }, ...buenas.map(f => ({ ...f, correcta: false }))]);
  return { plantilla, instruccion, notacion, opciones, solucion, sesion };
}

/** Elige una plantilla y repite hasta que el ítem salga con las opciones suficientes. */
function generarDe(rng, plantillas) {
  for (let i = 0; i < 60; i++) {
    try {
      return rng.elegir(plantillas)(rng);
    } catch (e) {
      if (!(e instanceof ItemPobre)) throw e;
    }
  }
  throw new Error('No se ha podido generar un ítem');
}

const propia = (rng, dmax = 12) => {
  for (;;) {
    const d = rng.entero(2, dmax);
    const f = fraccion(rng.entero(1, d - 1), d);
    if (f.esIrreducible()) return f;
  }
};

/** Cardinal erróneo: «three five». */
const cardinal = f => (f.den === 1 ? w(f.num) : `${w(f.num)} ${w(f.den)}`);
/** «one half» y «one quarter» en vez de «a half» y «a quarter» (para frases enteras). */
export function leer(f) {
  if (f.den === 2 && f.num === 1) return 'one half';
  if (f.den === 4 && f.num === 1) return 'one quarter';
  return enPalabras(f);
}
const alReves = f => fraccion(f.den, f.num);
const sinOver = f => lecturasValidas(f).filter(l => !l.includes(' over '));

// ─── Ejercicio 1 · Emparejar ─────────────────────────────────────────────────────────────
//
// Cada término lleva una `familia`: en un ítem no entran dos de la misma, porque serían
// casi sinónimos (to add / sum, to divide / quotient / to share, fraction / proper fraction)
// y el alumno podría darlos por buenos al revés. `contrario` solo sirve para nombrar el error.

export const VOCABULARIO = [
  // tramo 1 · sesiones 1-3 (U4-1B-01 a 1B-07)
  { id: 'numerator', en: 'numerator', es: 'numerador', tramo: 1, sesion: 1, familia: 'numerador', contrario: 'denominator' },
  { id: 'denominator', en: 'denominator', es: 'denominador', tramo: 1, sesion: 1, familia: 'denominador', contrario: 'numerator' },
  { id: 'common-denominator', en: 'common denominator', es: 'denominador común', tramo: 1, sesion: 2, familia: 'denominador' },
  { id: 'fraction', en: 'fraction', es: 'fracción', tramo: 1, sesion: 1, familia: 'fraccion' },
  { id: 'proper', en: 'proper fraction', es: 'fracción propia', tramo: 1, sesion: 1, familia: 'fraccion', contrario: 'improper' },
  { id: 'improper', en: 'improper fraction', es: 'fracción impropia', tramo: 1, sesion: 1, familia: 'fraccion', contrario: 'proper' },
  { id: 'equivalent', en: 'equivalent fractions', es: 'fracciones equivalentes', tramo: 1, sesion: 2, familia: 'fraccion' },
  { id: 'whole', en: 'whole', es: 'el todo (la unidad)', tramo: 1, sesion: 1, familia: 'todo' },
  { id: 'shaded', en: 'shaded', es: 'sombreado', tramo: 1, sesion: 1, familia: 'sombreado' },
  { id: 'equal-parts', en: 'equal parts', es: 'partes iguales', tramo: 1, sesion: 1, familia: 'partes' },
  { id: 'simplify', en: 'to simplify', es: 'simplificar', tramo: 1, sesion: 2, familia: 'simplificar' },
  { id: 'lowest-terms', en: 'lowest terms', es: 'fracción irreducible', tramo: 1, sesion: 2, familia: 'simplificar' },
  { id: 'greater', en: 'greater than', es: 'mayor que', tramo: 1, sesion: 3, familia: 'comparar', contrario: 'less' },
  { id: 'less', en: 'less than', es: 'menor que', tramo: 1, sesion: 3, familia: 'comparar', contrario: 'greater' },
  { id: 'number-line', en: 'number line', es: 'recta numérica', tramo: 1, sesion: 3, familia: 'recta' },
  { id: 'out-of', en: 'out of', es: 'de cada', tramo: 1, sesion: 1, familia: 'decada' },
  // tramo 2 · sesiones 5-7 (U4-2B-01 y 2B-03)
  { id: 'add', en: 'to add', es: 'sumar', tramo: 2, sesion: 5, familia: 'sumar', contrario: 'subtract' },
  { id: 'sum', en: 'sum', es: 'suma', tramo: 2, sesion: 5, familia: 'sumar' },
  { id: 'subtract', en: 'to subtract', es: 'restar', tramo: 2, sesion: 5, familia: 'restar', contrario: 'add' },
  { id: 'difference', en: 'difference', es: 'diferencia', tramo: 2, sesion: 5, familia: 'restar' },
  { id: 'lcm', en: 'least common multiple', es: 'mínimo común múltiplo', tramo: 2, sesion: 5, familia: 'mcm' },
  { id: 'the-rest', en: 'the rest', es: 'el resto', tramo: 2, sesion: 5, familia: 'resto' },
  { id: 'multiply', en: 'to multiply', es: 'multiplicar', tramo: 2, sesion: 7, familia: 'multiplicar' },
  { id: 'product', en: 'product', es: 'producto', tramo: 2, sesion: 7, familia: 'multiplicar' },
  { id: 'squared', en: 'squared', es: 'al cuadrado', tramo: 2, sesion: 7, familia: 'potencia', contrario: 'cubed' },
  { id: 'cubed', en: 'cubed', es: 'al cubo', tramo: 2, sesion: 7, familia: 'potencia', contrario: 'squared' },
  // tramo 3 · sesiones 9-10 (U4-3B-01 y 3B-02)
  { id: 'divide', en: 'to divide', es: 'dividir', tramo: 3, sesion: 9, familia: 'dividir' },
  { id: 'divided-by', en: 'divided by', es: 'dividido entre', tramo: 3, sesion: 9, familia: 'dividir' },
  { id: 'quotient', en: 'quotient', es: 'cociente', tramo: 3, sesion: 9, familia: 'dividir' },
  { id: 'share', en: 'to share', es: 'repartir', tramo: 3, sesion: 10, familia: 'dividir' },
  { id: 'reciprocal', en: 'reciprocal', es: 'fracción inversa', tramo: 3, sesion: 9, familia: 'inversa' },
  { id: 'savings', en: 'savings', es: 'ahorros', tramo: 3, sesion: 10, familia: 'ahorros' },
  { id: 'spend', en: 'to spend', es: 'gastar', tramo: 3, sesion: 10, familia: 'gastar' },
  { id: 'in-total', en: 'in total', es: 'en total', tramo: 3, sesion: 10, familia: 'total' },
];

const POR_ID = new Map(VOCABULARIO.map(v => [v.id, v]));
export const terminoDe = id => POR_ID.get(id);
export const PAREJAS_POR_ITEM = 5;

/** Cinco términos de un mismo tramo, de cinco familias distintas, en dos órdenes distintos. */
export function generarEmparejar(rng) {
  const tramo = rng.elegir([1, 2, 3]);
  const pool = rng.barajar(VOCABULARIO.filter(v => v.tramo === tramo));
  const elegidos = [];
  const familias = new Set();
  for (const v of pool) {
    if (familias.has(v.familia)) continue;
    familias.add(v.familia);
    elegidos.push(v);
    if (elegidos.length === PAREJAS_POR_ITEM) break;
  }
  if (elegidos.length < PAREJAS_POR_ITEM) throw new Error(`Tramo ${tramo} sin cinco familias`);
  const ids = elegidos.map(v => v.id);
  let en = rng.barajar(ids);
  let es = rng.barajar(ids);
  // Que no salga ya emparejado en el mismo orden (sería regalar la respuesta).
  for (let i = 0; i < 20 && en.every((id, k) => id === es[k]); i++) es = rng.barajar(ids);
  return {
    plantilla: 'emparejar', instruccion: 'emparejar', tramo,
    sesion: Math.min(...elegidos.map(v => v.sesion)),
    en, es,
  };
}

/** Nombre del error de un par equivocado (el término inglés `idEn` emparejado con la traducción de `idEs`). */
export function errorDePar(idEn, idEs) {
  return POR_ID.get(idEn)?.contrario === idEs ? 'confunde-contrarios' : 'vocabulario-confundido';
}

/** Corrige un emparejamiento { idEn: idEs }: { aciertos, fallos: [{ en, puesto, error }], sinPoner }. */
export function corregirEmparejar(item, pares) {
  const fallos = [];
  let aciertos = 0;
  for (const id of item.en) {
    const puesto = pares[id];
    if (puesto === id) aciertos++;
    else fallos.push({ en: id, puesto: puesto ?? null, error: puesto ? errorDePar(id, puesto) : 'vocabulario-confundido' });
  }
  return { aciertos, fallos };
}

export const claveEmparejar = item => `${item.plantilla}|${[...item.en].sort().join(',')}|${item.es.join(',')}`;

// ─── Ejercicio 2 · La lectura ────────────────────────────────────────────────────────────

const SIMBOLO = { '+': '+', '-': MENOS, '*': '·', ':': ':' };

const estiloDe = rng => ({ por: rng.elegir(['times', 'multiplied by']), igual: rng.elegir(['equals', 'is']) });
const VERBOS = (est) => ({ '+': 'plus', '-': 'minus', '*': est.por, ':': 'divided by' });
const OTRA_OP = { '+': '-', '-': '+', '*': ':', ':': '*' };

/** «two thirds plus one sixth equals five sixths». */
export function leerCuenta(a, op, b, c, est) {
  return `${leer(a)} ${VERBOS(est)[op]} ${leer(b)} ${est.igual} ${leer(c)}`;
}

function leerFraccionItem(rng) {
  const d = rng.elegir([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
  const n = rng.azar() < 0.8 ? rng.entero(1, d - 1) : rng.entero(d, 2 * d - 1);
  const f = fraccion(n, d);
  const buena = rng.elegir(sinOver(f));
  const ultima = buena.split(' ').pop();   // fifths, halves, quarters, third
  const falsas = [];
  falsas.push({
    texto: cardinal(f), error: 'cardinal-en-vez-de-ordinal',
    por_que: par(`«${cardinal(f)}» no se dice así en inglés: el denominador se lee con un ordinal («${ultima}»), no con «${w(d)}».`,
      `“${cardinal(f)}” is not said like that in English: the denominator is read with an ordinal (“${ultima}”), not with “${w(d)}”.`),
  });
  falsas.push({
    texto: `${w(d)} ${w(n)}`, error: 'cardinal-en-vez-de-ordinal',
    por_que: par(`«${w(d)} ${w(n)}» no se dice así en inglés, y además va al revés: arriba está el ${n}.`,
      `“${w(d)} ${w(n)}” is not said like that in English, and it is the wrong way round: the ${n} is on top.`),
  });
  if (n !== d) {
    const inv = alReves(f);
    falsas.push({
      texto: enPalabras(inv), error: 'numerador-y-denominador-al-reves',
      por_que: par(`«${enPalabras(inv)}» es ${H(inv)}: has leído el denominador como numerador.`,
        `“${enPalabras(inv)}” is ${H(inv)}: you read the denominator as the numerator.`),
    });
  }
  if (d >= 3 && d <= 9) {
    const otra = fraccion(n, d + 10);
    falsas.push({
      texto: enPalabras(otra), error: 'ordinal-parecido',
      por_que: par(`«${enPalabras(otra)}» es ${H(otra)}: «${ordinalIngles(d)}» y «${ordinalIngles(d + 10)}» suenan parecido.`,
        `“${enPalabras(otra)}” is ${H(otra)}: “${ordinalIngles(d)}” and “${ordinalIngles(d + 10)}” sound alike.`),
    });
  }
  if (d === 12) {
    const otra = fraccion(n, 20);
    falsas.push({
      texto: enPalabras(otra), error: 'ordinal-parecido',
      por_que: par(`«${enPalabras(otra)}» es ${H(otra)}: «twelfth» y «twentieth» suenan parecido.`,
        `“${enPalabras(otra)}” is ${H(otra)}: “twelfth” and “twentieth” sound alike.`),
    });
  }
  if (d === 2) {
    const texto = n === 1 ? 'one second' : `${w(n)} seconds`;
    falsas.push({
      texto, error: 'ordinal-literal',
      por_que: par(`«${texto}» no es ${H(f)}: el denominador 2 se lee «half» o «halves», no «second».`,
        `“${texto}” is not ${H(f)}: the denominator 2 is read “half” or “halves”, not “second”.`),
    });
  }
  const otras = lecturasValidas(f).filter(l => l !== buena && !l.includes(' over ')).slice(0, 2);
  const tambien = (idioma) => (otras.length
    ? (idioma === 'es' ? `; también vale ${otras.map(o => `«${o}»`).join(' o ')}` : `; ${otras.map(o => `“${o}”`).join(' or ')} also works`)
    : '');
  return armar(rng, {
    plantilla: 'leer_fraccion', instruccion: 'leer_fraccion', notacion: `<div class="operacion">${H(f, false)}</div>`,
    correcta: { texto: buena }, falsas, sesion: 1, minFalsas: 3,
    solucion: par(`${H(f)} se lee «${buena}»${tambien('es')}.`, `${H(f)} is read “${buena}”${tambien('en')}.`),
  });
}

/** Operandos y resultado (simplificado) de una cuenta con fracciones propias, o null si no sirve. */
function cuentaDe(rng, op) {
  for (let i = 0; i < 200; i++) {
    const a = propia(rng, 12), b = propia(rng, 12);
    if (a.equals(b)) continue;
    if (op === '-' && !(a.valor() > b.valor())) continue;
    const r = ({ '+': () => a.sumar(b), '-': () => a.restar(b), '*': () => a.multiplicar(b), ':': () => a.dividir(b) })[op]().simplificar();
    if (r.den > 36 || r.num > 60 || r.num === 0) continue;
    return { a, b, r };
  }
  throw new Error('No se ha podido armar la cuenta');
}

/** Resultados equivocados por errores típicos, cada uno con su id (distintos entre sí y del bueno). */
const ERRORES_DE_LA_CUENTA = {
  '+': ['suma-arriba-y-abajo', 'suma-multiplicando-denominadores', 'en-cruz-al-sumar'],
  '-': ['resta-arriba-y-abajo'],
  '*': ['suma-en-vez-de-multiplicar', 'multiplica-sumando-denominadores', 'multiplica-en-cruz'],
  ':': ['no-invierte', 'invierte-la-primera', 'invierte-las-dos'],
};

function resultadosMalos(op, a, b, buena) {
  const vistos = new Set([buena.clave()]);
  const lista = [];
  for (const id of ERRORES_DE_LA_CUENTA[op]) {
    const r = ERRORES_TIPICOS[id].fn(a, b);
    if (r === null || r.num <= 0 || r.num > 99 || r.den > 99 || vistos.has(r.clave())) continue;
    vistos.add(r.clave());
    lista.push({ id, r });
  }
  return lista;
}

const NOMBRE_OP = { '+': par('suma', 'addition'), '-': par('resta', 'subtraction'), '*': par('producto', 'product'), ':': par('cociente', 'quotient') };

function leerCuentaItem(op, sesion) {
  return rng => {
    const { a, b, r } = cuentaDe(rng, op);
    const est = estiloDe(rng);
    const buena = leerCuenta(a, op, b, r, est);
    const cuenta = htmlCuenta([a, SIMBOLO[op], b, '=', r], { compacta: true });
    const falsas = [];
    const otra = OTRA_OP[op];
    falsas.push({
      texto: leerCuenta(a, otra, b, r, est), error: 'operacion-cambiada',
      por_que: par(`La cuenta es ${SIMBOLO[op]}, no ${SIMBOLO[otra]}: se lee «${VERBOS(est)[op]}», no «${VERBOS(est)[otra]}».`,
        `The sign is ${SIMBOLO[op]}, not ${SIMBOLO[otra]}: it is read “${VERBOS(est)[op]}”, not “${VERBOS(est)[otra]}”.`),
    });
    for (const { id, r: mala } of resultadosMalos(op, a, b, r)) {
      falsas.push({
        texto: leerCuenta(a, op, b, mala, est), error: id,
        por_que: par(`En la cuenta el resultado es ${H(r)}, no ${H(mala)}: ${nombreDe(id).es.charAt(0).toLowerCase()}${nombreDe(id).es.slice(1)}.`,
          `In the calculation the result is ${H(r)}, not ${H(mala)}: ${nombreDe(id).en.charAt(0).toLowerCase()}${nombreDe(id).en.slice(1)}.`),
      });
    }
    for (const [cual, f] of [['primera', a], ['segunda', b]]) {
      const inv = alReves(f);
      if (inv.equals(f)) continue;
      falsas.push({
        texto: cual === 'primera' ? leerCuenta(inv, op, b, r, est) : leerCuenta(a, op, inv, r, est),
        error: 'numerador-y-denominador-al-reves',
        por_que: par(`En la ${cual} fracción hay ${H(f)}, no ${H(inv)}: has leído el denominador como numerador.`,
          `The ${cual === 'primera' ? 'first' : 'second'} fraction is ${H(f)}, not ${H(inv)}: you read the denominator as the numerator.`),
      });
    }
    falsas.push({
      texto: `${cardinal(a)} ${VERBOS(est)[op]} ${cardinal(b)} ${est.igual} ${cardinal(r)}`,
      error: 'cardinal-en-vez-de-ordinal',
      por_que: par('Los denominadores se leen con ordinales («thirds», «sixths»), no con números normales.',
        'Denominators are read with ordinals (“thirds”, “sixths”), not with normal numbers.'),
    });
    return armar(rng, {
      plantilla: `leer_${{ '+': 'suma', '-': 'resta', '*': 'producto', ':': 'cociente' }[op]}`, instruccion: 'leer_cuenta',
      notacion: `<div class="operacion">${cuenta}</div>`,
      correcta: { texto: buena }, falsas, sesion, minFalsas: 3,
      solucion: par(`${cuenta} se lee «${buena}». (${op === '*' ? '«times» y «multiplied by» valen las dos; ' : ''}«equals» e «is» valen las dos.)`,
        `${cuenta} is read “${buena}”. (${op === '*' ? '“times” and “multiplied by” are both fine; ' : ''}“equals” and “is” are both fine.)`),
    });
  };
}

function leerPotenciaItem(rng) {
  // Hasta 9 al cuadrado (81) y hasta 4 al cubo (64): los denominadores se leen con ordinal (< 100).
  const e = rng.elegir([2, 2, 3]);
  const f = propia(rng, e === 2 ? 9 : 4);
  const palabra = e === 2 ? 'squared' : 'cubed';
  const otraPal = e === 2 ? 'cubed' : 'squared';
  const r = f.potencia(e);
  const igual = rng.elegir(['equals', 'is']);
  const dice = (x, pal, res) => `${leer(x)} ${pal} ${igual} ${leer(res)}`;
  const notacion = `<div class="operacion">(${H(f)})<sup>${e}</sup> = ${H(r)}</div>`;
  const falsas = [];
  falsas.push({
    texto: dice(f, otraPal, r), error: 'cuadrado-y-cubo-confundidos',
    por_que: par(`El exponente es ${e}: se lee «${palabra}», no «${otraPal}».`, `The exponent is ${e}: it is read “${palabra}”, not “${otraPal}”.`),
  });
  const vistos = new Set([r.clave()]);
  for (const id of ['eleva-solo-el-numerador', 'base-por-exponente']) {
    const mala = ERRORES_TIPICOS[id].fn(f, e);
    // Dos resultados que valen lo mismo (1/5 y 2/10) serían la misma respuesta: solo el primero.
    if (mala === null || vistos.has(mala.clave()) || mala.num > 99 || mala.den > 99) continue;
    vistos.add(mala.clave());
    falsas.push({
      texto: dice(f, palabra, mala), error: id,
      por_que: par(`El resultado es ${H(r)}, no ${H(mala)}: ${nombreDe(id).es.charAt(0).toLowerCase()}${nombreDe(id).es.slice(1)}.`,
        `The result is ${H(r)}, not ${H(mala)}: ${nombreDe(id).en.charAt(0).toLowerCase()}${nombreDe(id).en.slice(1)}.`),
    });
  }
  const inv = alReves(f);
  falsas.push({
    texto: dice(inv, palabra, inv.potencia(e)), error: 'numerador-y-denominador-al-reves',
    por_que: par(`La base es ${H(f)}, no ${H(inv)}: has leído el denominador como numerador.`, `The base is ${H(f)}, not ${H(inv)}: you read the denominator as the numerator.`),
  });
  return armar(rng, {
    plantilla: 'leer_potencia', instruccion: 'leer_cuenta', notacion,
    correcta: { texto: dice(f, palabra, r) }, falsas, sesion: 7, minFalsas: 3,
    solucion: par(`(${H(f)})<sup>${e}</sup> = ${H(r)} se lee «${dice(f, palabra, r)}». («${igual === 'equals' ? 'equals' : 'is'}» e «${igual === 'equals' ? 'is' : 'equals'}» valen las dos.)`,
      `(${H(f)})<sup>${e}</sup> = ${H(r)} is read “${dice(f, palabra, r)}”. (“equals” and “is” are both fine.)`),
  });
}

export const PLANTILLAS_LECTURA = [
  leerFraccionItem, leerFraccionItem,
  leerCuentaItem('+', 5), leerCuentaItem('-', 5), leerCuentaItem('*', 7), leerCuentaItem(':', 9), leerPotenciaItem,
];
export const generarLectura = rng => generarDe(rng, PLANTILLAS_LECTURA);

// ─── Ejercicio 3 · ¿Qué pide? ────────────────────────────────────────────────────────────
//
// El enunciado va en inglés y las cuatro opciones son la pregunta en español. No hay que
// calcular: la solución dice los números del ítem para enseñar qué es lo que pide.

const NOMBRES = ['Ana', 'Lucas', 'Sara', 'Marcos', 'Lucía', 'Hugo', 'Carmen', 'Pablo', 'Elena', 'Álvaro'];
const DOS_NOMBRES = rng => { const [x, y] = rng.barajar(NOMBRES); return [x, y]; };
const DEN_COMUNES = [2, 3, 4, 5, 6, 8, 10];

/** Cotas de realismo de cada contexto (se escriben en la ENTREGA y las comprueba el test). */
export const COTAS = {
  dinero: { min: 20, max: 600 },        // dinero de un alumno, enteros (la cota general de la unidad es 2000)
  pegatinas: { min: 12, max: 60 },
  trozos: { min: 4, max: 12 },          // una pizza o una tarta tiene de 3 a 15 trozos
  partes: { min: 3, max: 12 },          // partes iguales de un rectángulo
  clase: { min: 12, max: 36 },          // alumnos de una clase
};

/** a/b con b de DEN_COMUNES, a de 1 a b-1, y una cantidad múltiplo de b dentro de la cota. */
function fraccionDeCantidad(rng, { min, max }) {
  const b = rng.elegir(DEN_COMUNES.filter(x => x <= max / 2));
  const a = rng.entero(1, b - 1);
  const m = b * rng.entero(Math.ceil(min / b), Math.floor(max / b));
  return { f: fraccion(a, b), m };
}

function queda(rng) {
  const [N] = DOS_NOMBRES(rng);
  const { f, m } = fraccionDeCantidad(rng, COTAS.dinero);
  const gastado = f.de(m), resto = m - gastado;
  const sol = par(`«Left» es «que queda»: ${euros(m)} − ${euros(gastado)} = ${euros(resto)}.`, `“Left” means “what remains”: ${euros(m)} − ${euros(gastado)} = ${euros(resto)}.`);
  return armar(rng, {
    plantilla: 'queda', instruccion: 'que_pide',
    notacion: `<p class="texto-en" lang="en">${N} has ${m} euros and spends (gasta) ${H(f)} of the money. How much money is left?</p>`,
    correcta: { texto: `¿Cuánto dinero le queda a ${N}?` },
    falsas: [
      { texto: `¿Cuánto dinero gasta ${N}?`, error: 'confunde-lo-que-queda-con-lo-gastado',
        por_que: par(`${N} gasta ${H(f)} de ${euros(m)} = ${euros(gastado)}, pero «left» no pregunta por eso.`, `${N} spends ${H(f)} of ${euros(m)} = ${euros(gastado)}, but “left” does not ask for that.`) },
      { texto: `¿Cuánto dinero tenía ${N} al principio?`, error: 'confunde-el-total-con-lo-pedido',
        por_que: par(`Eso son los ${euros(m)} del principio; «left» pregunta por lo que sobra después de gastar.`, `That is the ${euros(m)} at the start; “left” asks for what remains after spending.`) },
      { texto: `¿Qué fracción del dinero le queda a ${N}?`, error: 'fraccion-en-vez-de-cantidad',
        por_que: par('«How much money» pide una cantidad de dinero, no una fracción.', '“How much money” asks for an amount of money, not a fraction.') },
    ],
    solucion: sol, sesion: 1,
  });
}

function resto(rng) {
  const [N1, N2] = DOS_NOMBRES(rng);
  const d = rng.entero(COTAS.trozos.min, COTAS.trozos.max);
  const a = rng.entero(1, d - 2);
  const f = fraccion(a, d);
  return armar(rng, {
    plantilla: 'resto', instruccion: 'que_pide',
    notacion: `<p class="texto-en" lang="en">A pizza has ${d} equal slices. ${N1} eats ${H(f)} of the pizza. ${N2} eats the rest. How many slices does ${N2} eat?</p>`,
    correcta: { texto: `¿Cuántos trozos come ${N2}?` },
    falsas: [
      { texto: `¿Cuántos trozos come ${N1}?`, error: 'confunde-el-resto-con-la-parte',
        por_que: par(`${N1} come ${H(f)} de ${d} = ${a} trozos; «the rest» es lo que no ha comido ${N1}.`, `${N1} eats ${H(f)} of ${d} = ${a} slices; “the rest” is what ${N1} has not eaten.`) },
      { texto: `¿Cuántos trozos tiene la pizza?`, error: 'confunde-el-total-con-lo-pedido',
        por_que: par(`Eso son los ${d} trozos del total; la pregunta es por lo que come ${N2}.`, `That is the ${d} slices in total; the question is about what ${N2} eats.`) },
      { texto: `¿Qué fracción de la pizza come ${N2}?`, error: 'fraccion-en-vez-de-cantidad',
        por_que: par('«How many slices» pide un número de trozos, no una fracción.', '“How many slices” asks for a number of slices, not a fraction.') },
    ],
    solucion: par(`«The rest» es el resto: ${d} − ${a} = ${d - a} trozos.`, `“The rest” is what remains: ${d} − ${a} = ${d - a} slices.`),
    sesion: 5,
  });
}

function sombreado(rng) {
  const d = rng.entero(COTAS.partes.min, COTAS.partes.max);
  const n = rng.entero(1, d - 1);
  const f = fraccion(n, d), sin = fraccion(d - n, d);
  return armar(rng, {
    plantilla: 'sombreado', instruccion: 'que_pide',
    notacion: `<p class="texto-en" lang="en">A rectangle is divided into ${d} equal parts. ${n} ${n === 1 ? 'part is' : 'parts are'} shaded. What fraction of the rectangle is shaded?</p>`,
    correcta: { texto: '¿Qué fracción del rectángulo está sombreada?' },
    falsas: [
      { texto: '¿Qué fracción del rectángulo no está sombreada?', error: 'confunde-sombreado-con-sin-sombrear',
        por_que: par(`Lo sombreado es ${H(f)}; lo que no está sombreado, ${H(sin)}.`, `The shaded part is ${H(f)}; the unshaded part is ${H(sin)}.`) },
      { texto: '¿Cuántas partes iguales tiene el rectángulo?', error: 'confunde-partes-iguales-con-sombreadas',
        por_que: par(`Eso son las ${d} partes iguales, el denominador; la pregunta es por lo sombreado.`, `That is the ${d} equal parts, the denominator; the question is about the shaded part.`) },
      { texto: '¿Cuántas partes están sombreadas?', error: 'cantidad-en-vez-de-fraccion',
        por_que: par(`Eso es ${n}, el numerador; «what fraction» pide la fracción ${H(f)}.`, `That is ${n}, the numerator; “what fraction” asks for the fraction ${H(f)}.`) },
    ],
    solucion: par(`«Shaded» es «sombreado»: ${n} de ${d} partes iguales es ${H(f)}.`, `“Shaded” means coloured in: ${n} out of ${d} equal parts is ${H(f)}.`),
    sesion: 1,
  });
}

const CONTEXTOS_CLASE = [
  { en: 'wear glasses (llevan gafas)', es: 'llevan gafas', esNo: 'no llevan gafas', enCorto: 'wear glasses' },
  { en: 'have a pet (tienen mascota)', es: 'tienen mascota', esNo: 'no tienen mascota', enCorto: 'have a pet' },
  { en: 'play an instrument (tocan un instrumento)', es: 'tocan un instrumento', esNo: 'no tocan ningún instrumento', enCorto: 'play an instrument' },
  { en: 'walk to school (van andando al instituto)', es: 'van andando al instituto', esNo: 'no van andando al instituto', enCorto: 'walk to school' },
];

function deCada(rng) {
  const ctx = rng.elegir(CONTEXTOS_CLASE);
  for (;;) {
    const total = rng.entero(COTAS.clase.min, COTAS.clase.max);
    const b = rng.elegir(DEN_COMUNES.filter(x => total % x === 0 && x < total));
    if (!b) continue;
    const a = rng.entero(1, Math.floor(b * 0.75));
    if (a < 1 || a >= b) continue;
    const f = fraccion(a, b);
    const alumnos = f.de(total);
    return armar(rng, {
      plantilla: 'de_cada', instruccion: 'que_pide',
      notacion: `<p class="texto-en" lang="en">In a class of ${total} students, ${a} out of ${b} students ${ctx.en}. What fraction of the students ${ctx.enCorto}?</p>`,
      correcta: { texto: `¿Qué fracción de los alumnos ${ctx.es}?` },
      falsas: [
        { texto: `¿Cuántos alumnos ${ctx.es}?`, error: 'cantidad-en-vez-de-fraccion',
          por_que: par(`Serían ${alumnos} alumnos (${H(f)} de ${total}); «what fraction» pide la fracción ${H(f)}.`, `That would be ${alumnos} students (${H(f)} of ${total}); “what fraction” asks for the fraction ${H(f)}.`) },
        { texto: `¿Qué fracción de los alumnos ${ctx.esNo}?`, error: 'confunde-lo-que-cumple-con-lo-que-no',
          por_que: par(`${H(f)} sí lo hacen; los que no son ${H(fraccion(b - a, b))}.`, `${H(f)} do; those who do not are ${H(fraccion(b - a, b))}.`) },
        { texto: '¿Cuántos alumnos hay en la clase?', error: 'confunde-el-total-con-lo-pedido',
          por_que: par(`Eso son los ${total} alumnos del enunciado; la pregunta es por la fracción.`, `That is the ${total} students in the problem; the question is about the fraction.`) },
      ],
      solucion: par(`«${a} out of ${b}» se lee «${a} de cada ${b}»: es la fracción ${H(f)}.`, `“${a} out of ${b}” means ${a} in every ${b}: it is the fraction ${H(f)}.`),
      sesion: 1,
    });
  }
}

function de(rng) {
  const [N] = DOS_NOMBRES(rng);
  const { f, m } = fraccionDeCantidad(rng, COTAS.pegatinas);
  const da = f.de(m), queda_ = m - da;
  return armar(rng, {
    plantilla: 'de', instruccion: 'que_pide',
    notacion: `<p class="texto-en" lang="en">${N} has ${m} stickers and gives (da) ${H(f)} of them to a friend. How many stickers does ${N} give to the friend?</p>`,
    correcta: { texto: `¿Cuántas pegatinas da ${N} a un amigo?` },
    falsas: [
      { texto: `¿Cuántas pegatinas le quedan a ${N}?`, error: 'confunde-lo-que-da-con-lo-que-queda',
        por_que: par(`A ${N} le quedan ${m} − ${da} = ${queda_}; la pregunta es por las que da.`, `${N} has ${m} − ${da} = ${queda_} left; the question is about the ones given away.`) },
      { texto: `¿Cuántas pegatinas tiene ${N} en total?`, error: 'confunde-el-total-con-lo-pedido',
        por_que: par(`Eso son las ${m} del principio; la pregunta es por las que da.`, `That is the ${m} at the start; the question is about the ones given away.`) },
      { texto: `¿Qué fracción de las pegatinas da ${N}?`, error: 'fraccion-en-vez-de-cantidad',
        por_que: par('«How many stickers» pide un número de pegatinas, no una fracción.', '“How many stickers” asks for a number of stickers, not a fraction.') },
    ],
    solucion: par(`«${H(f)} of ${m}» es ${H(f)} de ${m} = ${da} pegatinas.`, `“${H(f)} of ${m}” is ${H(f)} of ${m} = ${da} stickers.`),
    sesion: 1,
  });
}

export const PLANTILLAS_QUE_PIDE = [queda, resto, sombreado, deCada, de];
export const generarQuePide = rng => generarDe(rng, PLANTILLAS_QUE_PIDE);

// ─── Ejercicio 4 · Dictado ───────────────────────────────────────────────────────────────
//
// Un ítem: { plantilla, instruccion, frase, a, op, b, c, conmutativa, sesion } con las
// fracciones como [num, den]. El alumno escribe `a op b = c`; vale por valor (6/8 = 3/4) y,
// en la suma y el producto, en cualquier orden de los dos primeros.

const F2 = f => [f.num, f.den];
const deF2 = p => fraccion(p[0], p[1]);

function dictadoDeNatural(rng) {
  for (;;) {
    const f = propia(rng, 10);
    const m = f.den * rng.entero(1, Math.max(1, Math.floor(60 / f.den)));
    const r = f.de(m);
    return { plantilla: 'dictado_de', instruccion: 'dictado', frase: `${leer(f)} of ${w(m)} is ${w(r)}`, a: F2(f), op: '*', b: [m, 1], c: [r, 1], conmutativa: true, sesion: 1 };
  }
}

function dictadoCuenta(op, sesion, frases) {
  return rng => {
    const { a, b, r } = cuentaDe(rng, op);
    const frase = rng.elegir(frases)({ a: leer(a), b: leer(b), c: leer(r), est: estiloDe(rng) });
    return { plantilla: `dictado_${{ '+': 'suma', '-': 'resta', '*': 'producto', ':': 'cociente' }[op]}`, instruccion: 'dictado', frase, a: F2(a), op, b: F2(b), c: F2(r), conmutativa: op === '+' || op === '*', sesion };
  };
}

const FRASES_SUMA = [
  ({ a, b, c, est }) => `${a} plus ${b} ${est.igual} ${c}`,
  ({ a, b, c }) => `the sum of ${a} and ${b} is ${c}`,
];
const FRASES_RESTA = [
  ({ a, b, c, est }) => `${a} minus ${b} ${est.igual} ${c}`,
  ({ a, b, c }) => `subtract ${b} from ${a}: the difference is ${c}`,
];
const FRASES_PRODUCTO = [
  ({ a, b, c, est }) => `${a} ${est.por} ${b} ${est.igual} ${c}`,
  ({ a, b, c }) => `the product of ${a} and ${b} is ${c}`,
  ({ a, b, c }) => `${a} of ${b} is ${c}`,
];
const FRASES_COCIENTE = [
  ({ a, b, c, est }) => `${a} divided by ${b} ${est.igual} ${c}`,
  ({ a, b, c }) => `the quotient of ${a} and ${b} is ${c}`,
];

export const PLANTILLAS_DICTADO = [
  dictadoDeNatural,
  dictadoCuenta('+', 5, FRASES_SUMA), dictadoCuenta('-', 5, FRASES_RESTA),
  dictadoCuenta('*', 7, FRASES_PRODUCTO), dictadoCuenta(':', 9, FRASES_COCIENTE),
];
export const generarDictado = rng => rng.elegir(PLANTILLAS_DICTADO)(rng);

/**
 * Corrige lo escrito: `escrito` = { a, op, b, c } con a, b, c Fraccion (de `leerFraccion`) y op
 * uno de + - * :. Devuelve { acierto, error } con el id del error típico si falla.
 */
export function corregirDictado(item, escrito) {
  const a = deF2(item.a), b = deF2(item.b), c = deF2(item.c);
  const { a: x, b: y, c: z, op } = escrito;
  const mismoOrden = x.equals(a) && y.equals(b);
  const cambiado = x.equals(b) && y.equals(a);
  if (op === item.op && (mismoOrden || (item.conmutativa && cambiado)) && z.equals(c)) return { acierto: true, error: null };
  if (op !== item.op) return { acierto: false, error: 'operacion-confundida' };
  if (!mismoOrden && !(item.conmutativa && cambiado)) {
    if (cambiado) return { acierto: false, error: 'orden-invertido' };
    const invierte = (u, v) => u.num !== 0 && u.inversa().equals(v);
    if (invierte(x, a) || invierte(y, b) || invierte(x, b) || invierte(y, a)) return { acierto: false, error: 'numerador-y-denominador-al-reves' };
    return { acierto: false, error: 'fraccion-mal-escrita' };
  }
  if (z.num !== 0 && z.inversa().equals(c)) return { acierto: false, error: 'numerador-y-denominador-al-reves' };
  return { acierto: false, error: 'fraccion-mal-escrita' };
}

/** La cuenta correcta en HTML, con la raya de las fracciones. */
export function cuentaDelItem(item, compacta = true) {
  return htmlCuenta([deF2(item.a), SIMBOLO[item.op], deF2(item.b), '=', deF2(item.c)], { compacta });
}

/** Lo que escribió el alumno en texto plano, para el registro de fallos. */
export const textoEscrito = ({ a, op, b, c }) => `${aTexto(a)} ${SIMBOLO[op]} ${aTexto(b)} = ${aTexto(c)}`;

/** Lee un campo del dictado: Fraccion o null. Reexporta `leerFraccion` para que la interfaz no importe de dos sitios. */
export const leerCampo = leerFraccion;

export const claveItem = item => `${item.plantilla}|${item.frase ?? ''}|${item.notacion ?? ''}`;
