// Práctica «Léelo en inglés» de la unidad 6 (Algebra): lógica pura (sin DOM ni red).
// Cuatro ejercicios, todos de elegir una opción entre cuatro:
//   1. La palabra   un término del vocabulario y cuatro significados (o al revés)
//   2. Léelo        una expresión o ecuación y cuatro lecturas (en inglés o en español); y al revés
//   3. La consigna  una instrucción de examen en inglés y cuatro traducciones al español
//   4. Completa     una frase en inglés con un hueco y cuatro palabras
//
// Un ítem es DATOS: { plantilla, instruccion, notacion (html), opciones, solucion, sesion } con
// `opciones` ya barajada: { texto, html?, correcta, error, por_que }. `error` es el id de un error
// de ERRORES_LEELO (aquí) y `por_que` {es, en} dice qué pasa con los números del ítem.
// Ninguna falsa es otra forma válida de decir lo mismo, y dos opciones nunca valen lo mismo:
// las expresiones, por forma canónica (`_comun/algebra.js`, aritmética exacta).
//
// Casos reservados: a 2026-11-09 no existían la hoja ni el examen de ninguna semana de la U6, así
// que `RESERVADOS_HOJA` y `HUELLAS_EXAMEN` están vacíos; la tarea de publicación de cada semana
// coteja y reabre si hace falta. `esReservado` ya los aplica al generar.
//
// `sesion` es la primera sesión de la unidad en que el ítem tiene sentido (inventario propuesto:
// 1B-01…1B-03 y 1C-03 en la 1; 1B-04 en la 2-3; 2B en la 5-6; 3B-02 en la 9; 3B-01 en la 10-11;
// 4B-01 en la 13-14).

import { numeroAIngles } from '../../src/ejercicios/palabras.js';
import { Fraccion } from '../_comun/fracciones.js';
import {
  lineal, ecuacion, termino, terminosATexto, terminosAHtml, huellaCanonica, MENOS,
} from '../_comun/algebra.js';
import { mcm } from '../_comun/aritmetica.js';

const w = numeroAIngles;
const par = (es, en) => ({ es, en });
const minus = s => s.charAt(0).toLowerCase() + s.slice(1);
const frase = (texto, lang = 'en') => `<p class="texto-en" lang="${lang}">${texto}</p>`;

export const COTAS = {
  coeficiente: [2, 9], constante: [1, 9], denominador: [2, 6], valorDeX: [2, 6], solucion: [2, 9],
  lapices: [5, 30], edad: [8, 16], hace: [1, 5],
};

// ─── Errores propios de la práctica ───────────────────────────────────────────────────────

export const ERRORES_LEELO = {
  'vocabulario-confundido': { nombre: par('Ha tomado un término por la traducción de otro', 'Mixed up a term with the translation of another one') },
  'confunde-contrarios': { nombre: par('Ha confundido dos palabras contrarias (numerator y denominator, left y right…)', 'Mixed up two opposite words (numerator and denominator, left and right…)') },
  'confunde-parecidas': { nombre: par('Ha confundido dos palabras que se parecen (expression y equation, coefficient y constant term…)', 'Mixed up two words that look alike (expression and equation, coefficient and constant term…)') },
  'producto-como-suma': { nombre: par('Ha leído un producto como una suma (2x como «dos más x»)', 'Read a product as a sum (2x as “two plus x”)') },
  'producto-como-division': { nombre: par('Ha leído un producto como una división', 'Read a product as a division') },
  'producto-como-resta': { nombre: par('Ha leído un producto como una resta', 'Read a product as a subtraction') },
  'division-como-producto': { nombre: par('Ha leído una división como un producto', 'Read a division as a product') },
  'division-como-resta': { nombre: par('Ha leído una división como una resta', 'Read a division as a subtraction') },
  'division-como-suma': { nombre: par('Ha leído una división como una suma', 'Read a division as a sum') },
  'signo-cambiado': { nombre: par('Ha cambiado «más» por «menos» (o al revés)', 'Swapped “plus” and “minus”') },
  'signo-perdido': { nombre: par('Se ha dejado el «menos» de delante', 'Left out the “minus” at the front') },
  'numeros-cambiados': { nombre: par('Ha cambiado de sitio los dos números', 'Swapped the two numbers') },
  'suma-de-terminos': { nombre: par('Ha juntado los dos números en uno (3x + 2 no es 5x)', 'Put the two numbers together (3x + 2 is not 5x)') },
  'resta-al-reves': { nombre: par('Ha restado al revés (3x − 2 no es 2 − 3x)', 'Subtracted the wrong way round (3x − 2 is not 2 − 3x)') },
  'otro-numero': { nombre: par('Ha leído otro número', 'Read a different number') },
  'consigna-confundida': { nombre: par('Ha entendido otra tarea distinta de la que pide la consigna', 'Understood a different task from the one the instruction asks for') },
  'operacion-contraria': { nombre: par('Ha entendido la operación contraria (sumar en vez de restar, multiplicar en vez de dividir)', 'Understood the opposite operation (add instead of subtract, multiply instead of divide)') },
  'palabra-que-no-encaja': { nombre: par('Ha elegido una palabra que no encaja en la frase', 'Chose a word that does not fit the sentence') },
  'expresion-y-ecuacion': { nombre: par('Ha confundido expresión y ecuación', 'Mixed up expression and equation') },
  'numero-de-soluciones': { nombre: par('Ha contado mal las soluciones de la ecuación', 'Counted the solutions of the equation wrongly') },
};
export const nombreDe = id => ERRORES_LEELO[id]?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

// ─── Casos reservados ─────────────────────────────────────────────────────────────────────

export const HUELLAS_EXAMEN = new Set([]);
export const RESERVADOS_HOJA = new Set([]);
export const esReservado = x => {
  try { return HUELLAS_EXAMEN.has(huellaCanonica(x)) || RESERVADOS_HOJA.has(x.clave()); } catch { return false; }
};

class ItemPobre extends Error {}

/** Una falsa de cada error primero (al azar), luego las que sobren; sin textos repetidos. */
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
  for (const f of unicas) if (elegidas.length < n && !errores.has(f.error)) { errores.add(f.error); elegidas.push(f); }
  for (const f of unicas) if (elegidas.length < n && !elegidas.includes(f)) elegidas.push(f);
  return elegidas;
}

function armar(rng, { plantilla, instruccion, notacion = '', correcta, falsas, solucion, sesion, fijas = [] }) {
  const resto = elegirFalsas(rng, falsas.filter(f => f.texto !== correcta.texto && !fijas.some(x => x.texto === f.texto)), 3 - fijas.length);
  const buenas = [...fijas, ...resto];
  if (buenas.length < 3) throw new ItemPobre(plantilla);
  const opciones = rng.barajar([{ ...correcta, correcta: true, error: null }, ...buenas.map(f => ({ ...f, correcta: false }))]);
  return { plantilla, instruccion, notacion, opciones, solucion, sesion };
}

function generarDe(rng, plantillas, sesion) {
  for (let i = 0; i < 80; i++) {
    try { return rng.elegir(plantillas)(rng, sesion); } catch (e) { if (!(e instanceof ItemPobre)) throw e; }
  }
  throw new Error('No se ha podido generar un ítem');
}

// ─── Ejercicio 1 · La palabra ─────────────────────────────────────────────────────────────
// Cada término lleva una `familia`: en un ítem no entran dos de la misma (serían casi sinónimos).
// `contrario` es el término con el que más se confunde y entra siempre como distractor.

export const VOCABULARIO = [
  { id: 'unknown', en: 'unknown', es: 'la incógnita (la letra que hay que averiguar)', sesion: 1, familia: 'incognita' },
  { id: 'variable', en: 'variable', es: 'la variable (una letra que puede valer distintos números)', sesion: 1, familia: 'incognita' },
  { id: 'letter', en: 'letter', es: 'la letra (está en lugar de un número)', sesion: 1, familia: 'letra' },
  { id: 'expression', en: 'algebraic expression', es: 'la expresión algebraica (números y letras con operaciones, sin igual)', sesion: 1, familia: 'expresion', contrario: 'equation' },
  { id: 'term', en: 'term', es: 'el término (cada sumando de una expresión)', sesion: 1, familia: 'termino' },
  { id: 'constant', en: 'constant term', es: 'el término independiente (el que no lleva letra)', sesion: 2, familia: 'termino', contrario: 'coefficient' },
  { id: 'like', en: 'like terms', es: 'los términos semejantes (los que llevan la misma letra)', sesion: 2, familia: 'termino' },
  { id: 'coefficient', en: 'coefficient', es: 'el coeficiente (el número que multiplica a la letra)', sesion: 2, familia: 'coeficiente', contrario: 'constant' },
  { id: 'evaluate', en: 'evaluate', es: 'calcular el valor (poniendo un número en lugar de la letra)', sesion: 3, familia: 'evaluar' },
  { id: 'substitute', en: 'substitute', es: 'sustituir (poner un número en lugar de la letra)', sesion: 3, familia: 'evaluar' },
  { id: 'simplify', en: 'simplify', es: 'simplificar (escribir la expresión de forma más sencilla)', sesion: 3, familia: 'simplificar' },
  { id: 'equation', en: 'equation', es: 'la ecuación (una igualdad con una incógnita)', sesion: 5, familia: 'ecuacion', contrario: 'expression' },
  { id: 'lhs', en: 'left-hand side', es: 'el miembro de la izquierda', sesion: 5, familia: 'izquierda', contrario: 'rhs' },
  { id: 'rhs', en: 'right-hand side', es: 'el miembro de la derecha', sesion: 5, familia: 'derecha', contrario: 'lhs' },
  { id: 'solution', en: 'solution', es: 'la solución (el valor que cumple la ecuación)', sesion: 5, familia: 'solucion' },
  { id: 'solve', en: 'solve', es: 'resolver (hallar la solución)', sesion: 5, familia: 'solucion' },
  { id: 'check', en: 'check', es: 'comprobar (sustituir para ver si se cumple)', sesion: 5, familia: 'solucion' },
  { id: 'identity', en: 'identity', es: 'la identidad (se cumple para cualquier número)', sesion: 5, familia: 'identidad' },
  { id: 'both-sides', en: 'both sides', es: 'los dos miembros (los dos lados de la igualdad)', sesion: 6, familia: 'lados' },
  { id: 'no-solution', en: 'no solution', es: 'no tiene solución', sesion: 9, familia: 'sin-solucion', contrario: 'infinite' },
  { id: 'infinite', en: 'infinitely many solutions', es: 'tiene infinitas soluciones', sesion: 9, familia: 'infinitas', contrario: 'no-solution' },
  { id: 'brackets', en: 'brackets', es: 'los paréntesis', sesion: 10, familia: 'parentesis' },
  { id: 'expand', en: 'expand the brackets', es: 'quitar los paréntesis multiplicando', sesion: 10, familia: 'parentesis' },
  { id: 'denominator', en: 'denominator', es: 'el denominador', sesion: 10, familia: 'denominador', contrario: 'numerator' },
  { id: 'numerator', en: 'numerator', es: 'el numerador', sesion: 10, familia: 'numerador', contrario: 'denominator' },
  { id: 'lcm', en: 'lowest common multiple', es: 'el mínimo común múltiplo', sesion: 11, familia: 'mcm' },
  { id: 'clear', en: 'clear the fractions', es: 'quitar los denominadores (multiplicando)', sesion: 11, familia: 'denominador' },
  { id: 'twice', en: 'twice', es: 'el doble', sesion: 1, familia: 'doble' },
  { id: 'three-times', en: 'three times', es: 'el triple', sesion: 1, familia: 'triple' },
  { id: 'half', en: 'half of', es: 'la mitad de', sesion: 1, familia: 'mitad' },
  { id: 'more-than', en: 'more than', es: 'más que', sesion: 1, familia: 'mas-que', contrario: 'less-than' },
  { id: 'less-than', en: 'less than', es: 'menos que', sesion: 1, familia: 'menos-que', contrario: 'more-than' },
  { id: 'consecutive', en: 'consecutive', es: 'consecutivos (seguidos)', sesion: 1, familia: 'consecutivo' },
  { id: 'altogether', en: 'altogether', es: 'en total', sesion: 13, familia: 'total' },
  { id: 'each', en: 'each', es: 'cada uno', sesion: 13, familia: 'cada' },
  { id: 'share', en: 'share', es: 'repartir', sesion: 13, familia: 'reparto' },
  { id: 'ago', en: 'years ago', es: 'hace … años', sesion: 13, familia: 'hace', contrario: 'in-time' },
  { id: 'in-time', en: "in … years' time", es: 'dentro de … años', sesion: 13, familia: 'dentro', contrario: 'ago' },
  { id: 'times-as-many', en: 'times as many as', es: 'tantas veces como (se multiplica)', sesion: 13, familia: 'veces' },
];
const POR_ID = new Map(VOCABULARIO.map(v => [v.id, v]));
export const terminoDe = id => POR_ID.get(id);

/** Parejas de sinónimos válidos: nunca se enfrentan en un ítem (las comprueba el test). */
export const SINONIMOS = [
  ['brackets', 'parentheses'], ['solve', 'work out'], ['twice', 'double'], ['like terms', 'similar terms'],
  ['both sides', 'each side'], ['simplify', 'collect like terms'], ['evaluate', 'work out the value'],
  ['unknown', 'variable'], ['algebraic expression', 'expression'], ['check', 'work out the proof'],
  ['left-hand side', 'LHS'], ['no solution', "doesn't have a solution"], ['infinitely many solutions', 'infinite solutions'],
  ['three times', 'triple'], ['lowest common multiple', 'least common multiple'],
];

export function generarPalabra(rng) {
  const t = rng.elegir(VOCABULARIO);
  const sentido = rng.elegir(['en-es', 'es-en']);
  const opcion = (v, error) => (sentido === 'en-es'
    ? { texto: v.es, error, por_que: par(`«${v.es}» se dice «${v.en}» en inglés, no «${t.en}».`, `“${v.es}” is “${v.en}” in English, not “${t.en}”.`) }
    : { texto: v.en, error, por_que: par(`«${v.en}» significa «${v.es}», no «${t.es}».`, `“${v.en}” means “${v.es}”, not “${t.es}”.`) });
  const fijas = [];
  if (t.contrario) fijas.push(opcion(POR_ID.get(t.contrario), t.id === 'expression' || t.id === 'equation' || t.id === 'coefficient' || t.id === 'constant' ? 'confunde-parecidas' : 'confunde-contrarios'));
  const familias = new Set([t.familia, ...(t.contrario ? [POR_ID.get(t.contrario).familia] : [])]);
  const otras = [];
  for (const v of rng.barajar(VOCABULARIO)) {
    if (familias.has(v.familia)) continue;
    familias.add(v.familia);
    otras.push(opcion(v, 'vocabulario-confundido'));
  }
  const correcta = sentido === 'en-es' ? { texto: t.es } : { texto: t.en };
  return armar(rng, {
    plantilla: sentido === 'en-es' ? 'palabra_en_es' : 'palabra_es_en',
    instruccion: sentido === 'en-es' ? 'palabra_en_es' : 'palabra_es_en',
    notacion: sentido === 'en-es' ? frase(`<strong>${t.en}</strong>`) : frase(`<strong>${t.es}</strong>`, 'es'),
    correcta, falsas: otras, fijas, sesion: t.sesion,
    solucion: par(`«${t.en}» significa «${t.es}».`, `“${t.en}” means “${t.es}”.`),
  });
}

// ─── Ejercicio 2 · Léelo ─────────────────────────────────────────────────────────────────

const LETRAS = ['x', 'x', 'x', 'y', 'n', 't'];

/** Una expresión de una letra: 2x, x/3, 3x + 5, 4x − 1, x − 3, x/2 + 4, −5x + 2. Nunca un caso reservado. */
export function exprAzar(rng, letra) {
  for (let i = 0; i < 100; i++) {
    const L = letra ?? rng.elegir(LETRAS);
    const a = rng.entero(...COTAS.coeficiente), b = rng.entero(...COTAS.constante), n = rng.entero(2, 5);
    const s = rng.elegir([1, -1]);
    const e = rng.elegir([
      () => lineal(a, 0, L), () => lineal(new Fraccion(1, n), 0, L), () => lineal(a, s * b, L), () => lineal(a, s * b, L),
      () => lineal(1, s * b, L), () => lineal(new Fraccion(1, n), s * b, L), () => lineal(-a, b, L),
    ])();
    if (!esReservado(e)) return e;
  }
  throw new Error('No se ha podido sacar una expresión libre');
}

/** Una ecuación ax + b = c, ax = c, x + b = c, x/n = c, x/n + b = c con c entre 1 y 40. */
export function ecuacionAzar(rng, letra) {
  for (let i = 0; i < 100; i++) {
    const L = letra ?? rng.elegir(LETRAS);
    const izq = rng.elegir([
      () => lineal(rng.entero(2, 9), 0, L), () => lineal(rng.entero(2, 9), rng.elegir([1, -1]) * rng.entero(1, 9), L),
      () => lineal(rng.entero(2, 9), rng.elegir([1, -1]) * rng.entero(1, 9), L), () => lineal(1, rng.elegir([1, -1]) * rng.entero(1, 9), L),
      () => lineal(new Fraccion(1, rng.entero(2, 5)), 0, L),
    ])();
    const q = ecuacion(izq, rng.entero(1, 40));
    if (!esReservado(q)) return q;
  }
  throw new Error('No se ha podido sacar una ecuación libre');
}

/** Las expresiones que sale de leer mal E, cada una con el error que la produce. */
function variantes(E) {
  const a = E.a, b = E.b, L = E.letra;
  const an = a.num, ad = a.den, bn = b.num;
  const v = [];
  const poner = (expr, error) => v.push({ expr, error });
  if (bn !== 0) {
    poner(lineal(a, -bn, L), 'signo-cambiado');
    if (ad === 1 && an > 0 && bn > 0 && an !== bn) poner(lineal(bn, an, L), 'numeros-cambiados');
    if (ad === 1 && an > 0 && bn > 0) poner(lineal(an + bn, 0, L), 'suma-de-terminos');
    if (ad === 1 && an > 0 && bn < 0) poner(lineal(-an, -bn, L), 'resta-al-reves');
    if (an < 0) poner(lineal(-an, bn, L), 'signo-perdido');
    if (ad > 1) poner(lineal(ad, bn, L), 'division-como-producto');
  } else if (ad === 1) {
    poner(lineal(1, an, L), 'producto-como-suma');
    poner(lineal(1, -an, L), 'producto-como-resta');
    poner(lineal(new Fraccion(1, an), 0, L), 'producto-como-division');
  } else {
    poner(lineal(ad, 0, L), 'division-como-producto');
    poner(lineal(1, -ad, L), 'division-como-resta');
    poner(lineal(1, ad, L), 'division-como-suma');
  }
  if (ad === 1) poner(lineal(an === 9 ? an - 1 : an + 1, bn, L), 'otro-numero');
  else poner(lineal(new Fraccion(1, ad === 5 ? 4 : ad + 1), bn, L), 'otro-numero');
  return v;
}

/** Variantes de un objeto (Lineal o Ecuacion) con el mismo tipo de dato. */
function variantesDe(o, rng) {
  if (o.izq === undefined) return variantes(o);
  const c = o.der.b;
  const base = variantes(o.izq).map(({ expr, error }) => ({ expr: ecuacion(expr, c), error }));
  base.push({ expr: ecuacion(o.izq, c.num + (c.num > 20 ? -rng.entero(1, 3) : rng.entero(1, 3))), error: 'otro-numero' });
  return base;
}

function distintas(o, lista) {
  const claves = new Set([o.clave()]);
  if (o.izq !== undefined) claves.add(`${o.der.clave()}=${o.izq.clave()}`);
  const salida = [];
  for (const { expr, error } of lista) {
    if (claves.has(expr.clave())) continue;
    if (o.izq !== undefined && expr.equivalente(o)) continue;
    claves.add(expr.clave());
    salida.push({ expr, error });
  }
  return salida;
}

const aTextoDe = o => o.aTexto('es');

function itemLectura(rng, { plantilla, instruccion, objeto, idioma }) {
  const dice = o => o.enPalabras(idioma);
  const falsas = distintas(objeto, variantesDe(objeto, rng))
    .map(({ expr, error }) => ({ expr, error, texto: dice(expr) }))
    .filter(f => !objeto.esLecturaValida(f.texto, idioma) && !objeto.lecturasValidas(idioma).includes(f.texto))
    .map(f => ({
      texto: f.texto, error: f.error,
      por_que: par(`«${f.texto}» es ${aTextoDe(f.expr)}, no ${aTextoDe(objeto)}: ${minus(nombreDe(f.error).es)}.`,
        `“${f.texto}” is ${aTextoDe(f.expr)}, not ${aTextoDe(objeto)}: ${minus(nombreDe(f.error).en)}.`),
    }));
  return armar(rng, {
    plantilla, instruccion, notacion: `<div class="operacion">${objeto.aHtml()}</div>`,
    correcta: { texto: dice(objeto) }, falsas, sesion: objeto.izq === undefined ? 1 : 5,
    solucion: par(`${aTextoDe(objeto)} se lee «${dice(objeto)}».`, `${aTextoDe(objeto)} is read “${dice(objeto)}”.`),
  });
}

function itemEscritura(rng, { plantilla, objeto, idioma }) {
  const lectura = objeto.enPalabras(idioma);
  const falsas = distintas(objeto, variantesDe(objeto, rng)).map(({ expr, error }) => ({
    texto: aTextoDe(expr), html: expr.aHtml(), error,
    por_que: par(`${aTextoDe(expr)} se lee «${expr.enPalabras(idioma)}», no «${lectura}»: ${minus(nombreDe(error).es)}.`,
      `${aTextoDe(expr)} is read “${expr.enPalabras(idioma)}”, not “${lectura}”: ${minus(nombreDe(error).en)}.`),
  }));
  return armar(rng, {
    plantilla, instruccion: plantilla, notacion: frase(lectura, idioma),
    correcta: { texto: aTextoDe(objeto), html: objeto.aHtml() }, falsas, sesion: objeto.izq === undefined ? 1 : 5,
    solucion: par(`«${lectura}» se escribe ${aTextoDe(objeto)}.`, `“${lectura}” is written ${aTextoDe(objeto)}.`),
  });
}

export const PLANTILLAS_LEELO = [
  rng => itemLectura(rng, { plantilla: 'leer_expresion', instruccion: 'leer_expresion', objeto: exprAzar(rng), idioma: 'en' }),
  rng => itemLectura(rng, { plantilla: 'leer_ecuacion', instruccion: 'leer_ecuacion', objeto: ecuacionAzar(rng), idioma: 'en' }),
  rng => itemLectura(rng, { plantilla: 'leer_en_espanol', instruccion: 'leer_en_espanol', objeto: exprAzar(rng), idioma: 'es' }),
  rng => itemEscritura(rng, { plantilla: 'escribir_expresion', objeto: exprAzar(rng), idioma: rng.elegir(['en', 'en', 'es']) }),
  rng => itemEscritura(rng, { plantilla: 'escribir_ecuacion', objeto: ecuacionAzar(rng), idioma: rng.elegir(['en', 'en', 'es']) }),
];
export const generarLeelo = (rng, sesion) => generarDe(rng, PLANTILLAS_LEELO, sesion);

// ─── Ejercicio 3 · La consigna ───────────────────────────────────────────────────────────
// Cuatro grupos según lo que se ve en pantalla. Dentro de un grupo, cada plantilla es una tarea
// distinta (familia); la traducción habla de la expresión o de la ecuación sin repetirla, y lo que
// decide es el verbo. Una plantilla con `valida` solo puede ser la correcta si se cumple.

const num = n => String(n).replace('-', MENOS);

function grupoExpresion(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), c = rng.entero(2, 9), b = rng.elegir([1, -1]) * rng.entero(1, 9);
  const ts = [termino(a, L), termino(b), termino(c, L)];
  if (esReservado(lineal(a + c, b, L))) throw new ItemPobre('consigna');
  return { L, v: rng.entero(...COTAS.valorDeX), html: terminosAHtml(ts), cuenta: terminosATexto(ts) };
}
function grupoEcuacion(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.elegir([1, -1]) * rng.entero(1, 9), s = rng.entero(...COTAS.solucion);
  const c = a * s + b;
  if (c < 1) throw new ItemPobre('consigna');
  const q = ecuacion(lineal(a, b, L), c);
  if (esReservado(q)) throw new ItemPobre('consigna');
  return { L, a, b, c, s, html: q.aHtml(), cuenta: q.aTexto() };
}
function grupoParentesis(rng) {
  const L = rng.elegir(LETRAS), k = rng.entero(2, 6), m = rng.elegir([1, -1]) * rng.entero(1, 6), s = rng.entero(...COTAS.solucion);
  const c = k * (s + m);
  if (c < 1) throw new ItemPobre('consigna');
  if (esReservado(ecuacion(lineal(k, k * m, L), c))) throw new ItemPobre('consigna');
  const cuenta = `${k}(${L} ${m < 0 ? MENOS : '+'} ${Math.abs(m)}) = ${c}`;
  return { L, k, m, c, s, html: cuenta.replace(L, `<i>${L}</i>`), cuenta };
}
function grupoDenominadores(rng) {
  const L = rng.elegir(LETRAS);
  const n = rng.entero(...COTAS.denominador), m = rng.entero(...COTAS.denominador);
  if (n === m) throw new ItemPobre('consigna');
  const M = mcm(n, m), t = rng.entero(1, Math.max(1, Math.floor(60 / M))), s = M * t, c = s / n + s / m;
  const q = ecuacion([termino(new Fraccion(1, n), L), termino(new Fraccion(1, m), L)], c);
  if (esReservado(q)) throw new ItemPobre('consigna');
  return { L, n, m, M, s, c, html: q.aHtml(), cuenta: q.aTexto() };
}

const l = d => d.L;
export const GRUPOS_CONSIGNA = [
  { id: 'expresion', sesion: 3, construir: grupoExpresion, plantillas: [
    { familia: 'simplificar', en: () => 'Simplify the expression.', es: () => 'Simplifica la expresión.' },
    { familia: 'simplificar', en: () => 'Simplify the expression by collecting like terms.', es: () => 'Simplifica la expresión agrupando los términos semejantes.' },
    { familia: 'evaluar', en: d => `Evaluate the expression when ${l(d)} = ${d.v}.`, es: d => `Calcula el valor de la expresión cuando ${l(d)} = ${d.v}.` },
    { familia: 'evaluar', en: d => `Substitute ${l(d)} = ${d.v} in the expression.`, es: d => `Sustituye ${l(d)} = ${d.v} en la expresión.` },
    { familia: 'palabras', en: () => 'Write the expression in words.', es: () => 'Escribe la expresión con palabras.' },
    { familia: 'semejantes', en: () => 'Circle the like terms in the expression.', es: () => 'Rodea los términos semejantes de la expresión.' },
  ] },
  { id: 'ecuacion', sesion: 5, construir: grupoEcuacion, plantillas: [
    { familia: 'resolver', en: d => `Solve the equation for ${l(d)}.`, es: () => 'Resuelve la ecuación.' },
    { familia: 'resolver', en: () => 'Solve the equation and check your answer.', es: () => 'Resuelve la ecuación y comprueba la respuesta.' },
    { familia: 'resolver', en: d => `Check that ${l(d)} = ${d.s} is the solution of the equation.`, es: d => `Comprueba que ${l(d)} = ${d.s} es la solución de la ecuación.` },
    { familia: 'palabras', en: () => 'Write the equation in words.', es: () => 'Escribe la ecuación con palabras.' },
    { familia: 'restar-lados', contraria: 'sumar-lados', valida: d => d.b > 0, en: d => `Subtract ${d.b} from both sides of the equation.`, es: d => `Resta ${d.b} a los dos miembros de la ecuación.` },
    { familia: 'sumar-lados', contraria: 'restar-lados', valida: d => d.b < 0, en: d => `Add ${-d.b} to both sides of the equation.`, es: d => `Suma ${-d.b} a los dos miembros de la ecuación.` },
    { familia: 'dividir-lados', contraria: 'multiplicar-lados', en: d => `Divide both sides of the equation by ${d.a}.`, es: d => `Divide los dos miembros de la ecuación entre ${d.a}.` },
    { familia: 'multiplicar-lados', contraria: 'dividir-lados', valida: () => false, en: d => `Multiply both sides of the equation by ${d.a}.`, es: d => `Multiplica los dos miembros de la ecuación por ${d.a}.` },
    { familia: 'restar-lados', contraria: 'sumar-lados', valida: () => false, en: d => `Subtract ${Math.abs(d.b)} from both sides of the equation.`, es: d => `Resta ${Math.abs(d.b)} a los dos miembros de la ecuación.`, soloSiNo: d => d.b < 0 },
  ] },
  { id: 'parentesis', sesion: 10, construir: grupoParentesis, plantillas: [
    { familia: 'quitar-parentesis', en: () => 'Expand the brackets.', es: () => 'Quita los paréntesis multiplicando.' },
    { familia: 'quitar-parentesis', en: () => 'Multiply out the brackets.', es: () => 'Desarrolla los paréntesis multiplicando.' },
    { familia: 'resolver', en: d => `Solve the equation for ${l(d)}.`, es: () => 'Resuelve la ecuación.' },
    { familia: 'resolver', en: d => `Check that ${l(d)} = ${d.s} is the solution of the equation.`, es: d => `Comprueba que ${l(d)} = ${d.s} es la solución de la ecuación.` },
    { familia: 'palabras', en: () => 'Write the equation in words.', es: () => 'Escribe la ecuación con palabras.' },
    { familia: 'dividir-lados', contraria: 'multiplicar-lados', en: d => `Divide both sides of the equation by ${d.k}.`, es: d => `Divide los dos miembros de la ecuación entre ${d.k}.` },
    { familia: 'multiplicar-lados', contraria: 'dividir-lados', valida: () => false, en: d => `Multiply both sides of the equation by ${d.k}.`, es: d => `Multiplica los dos miembros de la ecuación por ${d.k}.` },
  ] },
  { id: 'denominadores', sesion: 11, construir: grupoDenominadores, plantillas: [
    { familia: 'quitar-denominadores', en: d => `Multiply both sides by ${d.M} to clear the fractions.`, es: d => `Multiplica los dos miembros por ${d.M} para quitar los denominadores.` },
    { familia: 'mcm', en: () => 'Find the lowest common multiple of the denominators.', es: () => 'Halla el mínimo común múltiplo de los denominadores.' },
    { familia: 'resolver', en: d => `Solve the equation for ${l(d)}.`, es: () => 'Resuelve la ecuación.' },
    { familia: 'resolver', en: d => `Check that ${l(d)} = ${d.s} is the solution of the equation.`, es: d => `Comprueba que ${l(d)} = ${d.s} es la solución de la ecuación.` },
    { familia: 'palabras', en: () => 'Write the equation in words.', es: () => 'Escribe la ecuación con palabras.' },
    { familia: 'dividir-lados', contraria: 'multiplicar-lados', valida: () => false, en: d => `Divide both sides of the equation by ${d.M}.`, es: d => `Divide los dos miembros de la ecuación entre ${d.M}.` },
  ] },
];

function generarConsignaDe(rng) {
  const g = rng.elegir(GRUPOS_CONSIGNA);
  const d = g.construir(rng);
  const validas = g.plantillas.filter(p => p.valida === undefined ? true : p.valida(d));
  const t = rng.elegir(validas.filter(p => !p.soloSiNo));
  const otras = g.plantillas.filter(p => p.familia !== t.familia && (!p.soloSiNo || p.soloSiNo(d)));
  const vistas = new Set();
  const falsas = [];
  for (const p of otras) {
    if (vistas.has(p.es(d))) continue;
    vistas.add(p.es(d));
    const error = t.contraria === p.familia ? 'operacion-contraria' : 'consigna-confundida';
    falsas.push({
      texto: p.es(d), error,
      por_que: par(`«${p.es(d)}» sería «${p.en(d)}» en inglés, no «${t.en(d)}».`, `“${p.es(d)}” would be “${p.en(d)}” in English, not “${t.en(d)}”.`),
    });
  }
  // de la misma familia que la correcta no puede salir ninguna (ya filtradas por `otras`)
  const fijas = falsas.filter(f => f.error === 'operacion-contraria').slice(0, 1);
  return armar(rng, {
    plantilla: `consigna_${g.id}`, instruccion: 'consigna',
    notacion: `${frase(t.en(d))}<div class="operacion">${d.html}</div>`,
    correcta: { texto: t.es(d) }, falsas, fijas, sesion: g.sesion,
    solucion: par(`«${t.en(d)}» significa «${t.es(d)}».`, `“${t.en(d)}” means “${t.es(d)}”.`),
  });
}
export const PLANTILLAS_CONSIGNA = [generarConsignaDe];
export const generarConsigna = (rng, sesion) => generarDe(rng, PLANTILLAS_CONSIGNA, sesion);

// ─── Ejercicio 4 · Completa ──────────────────────────────────────────────────────────────

const HUECO = '<span class="hueco hueco--corto" aria-label="blank"></span>';
const NOMBRES = ['Ana', 'Lucas', 'Sara', 'Marcos', 'Lucía', 'Hugo', 'Carmen', 'Pablo', 'Elena', 'Álvaro'];
const GLOSA = {
  coefficient: 'el número que multiplica a la letra', 'constant term': 'el término sin letra', solution: 'el valor que cumple la ecuación',
  denominator: 'el número de abajo de una fracción', numerator: 'el número de arriba de una fracción', equation: 'una igualdad con una incógnita',
  expression: 'números y letras con operaciones, sin igual', 'like terms': 'términos con la misma letra', evaluate: 'calcular el valor sustituyendo',
  expand: 'quitar paréntesis multiplicando', solve: 'hallar la solución', write: 'escribir', brackets: 'paréntesis', 'both sides': 'los dos miembros',
  altogether: 'en total', ago: 'hace', twice: 'el doble', consecutive: 'seguidos', identity: 'se cumple siempre', unknown: 'la incógnita',
  'no solution': 'ninguna solución', 'infinitely many solutions': 'infinitas soluciones', 'one solution': 'una sola solución', 'two solutions': 'dos soluciones',
  coefficients: 'los números que multiplican a la letra', denominators: 'los números de abajo de las fracciones', equations: 'igualdades con incógnita',
  'the denominator': 'el denominador', 'the coefficient': 'el coeficiente', 'the solution': 'la solución', 'the equation': 'la ecuación',
};
const glosa = w1 => GLOSA[w1] ?? w1;

function completa(rng, { plantilla, texto, correcta, falsas, solucion, sesion }) {
  return armar(rng, {
    plantilla, instruccion: 'completa', notacion: frase(texto), sesion,
    correcta: { texto: correcta },
    falsas: falsas.map(f => ({
      texto: f, error: 'palabra-que-no-encaja',
      por_que: par(`«${f}» (${glosa(f)}) no encaja en esta frase.`, `“${f}” (${glosa(f)}) does not fit in this sentence.`),
    })).map((f, i) => (falsas[i].error ? f : f)),
    solucion,
  });
}
const sol = (en, es) => par(es, en);
const ESCRIBE = (L, a, b) => lineal(a, b, L).aHtml();

function completaCoeficiente(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.entero(1, 9);
  const e = ESCRIBE(L, a, -b);
  return completa(rng, { plantilla: 'completa_coeficiente', sesion: 2,
    texto: `In ${e}, the ${HUECO} of <i>${L}</i> is ${a}.`, correcta: 'coefficient', falsas: ['solution', 'denominator', 'equation', 'identity'],
    solucion: sol(`The coefficient of ${L} is the number that multiplies it: ${a}.`, `El coeficiente de ${L} es el número que la multiplica: ${a}.`) });
}
function completaIndependiente(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.entero(1, 9);
  return completa(rng, { plantilla: 'completa_independiente', sesion: 2,
    texto: `In ${ESCRIBE(L, a, -b)}, the ${HUECO} is ${MENOS}${b} (the number without a letter).`, correcta: 'constant term', falsas: ['unknown', 'solution', 'equation', 'denominator'],
    solucion: sol(`The number without a letter is the constant term: ${MENOS}${b}.`, `El número sin letra es el término independiente: ${MENOS}${b}.`) });
}
function completaSemejantes(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), c = rng.entero(2, 9), b = rng.entero(1, 9);
  const ts = terminosAHtml([termino(a, L), termino(b), termino(c, L)]);
  return completa(rng, { plantilla: 'completa_semejantes', sesion: 2,
    texto: `In ${ts}, ${a}<i>${L}</i> and ${c}<i>${L}</i> are called ${HUECO}.`, correcta: 'like terms', falsas: ['denominators', 'equations', 'brackets', 'coefficients'].filter(x => x !== 'coefficients'),
    solucion: sol(`Terms with the same letter are like terms: ${a}${L} and ${c}${L}.`, `Los términos con la misma letra son semejantes: ${a}${L} y ${c}${L}.`) });
}
function completaEvaluar(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.entero(1, 9), v = rng.entero(...COTAS.valorDeX);
  return completa(rng, { plantilla: 'completa_evaluar', sesion: 3,
    texto: `To ${HUECO} ${ESCRIBE(L, a, b)} when <i>${L}</i> = ${v}, replace <i>${L}</i> by ${v} and calculate: ${a} · ${v} + ${b} = ${a * v + b}.`,
    correcta: 'evaluate', falsas: ['expand', 'solve', 'write'],
    solucion: sol(`To evaluate is to replace the letter by a number and calculate: ${a * v + b}.`, `Evaluar es poner un número en lugar de la letra y calcular: ${a * v + b}.`) });
}
function completaSolucion(rng) {
  const L = rng.elegir(LETRAS), b = rng.entero(1, 9), s = rng.entero(2, 9);
  return completa(rng, { plantilla: 'completa_solucion', sesion: 5,
    texto: `<i>${L}</i> = ${s} is the ${HUECO} of ${lineal(1, b, L).aHtml()} = ${s + b}.`, correcta: 'solution', falsas: ['coefficient', 'denominator', 'expression'],
    solucion: sol(`${L} = ${s} makes the equation true (${s} + ${b} = ${s + b}): it is the solution.`, `${L} = ${s} hace cierta la ecuación (${s} + ${b} = ${s + b}): es la solución.`) });
}
function completaLados(rng) {
  const L = rng.elegir(LETRAS), b = rng.entero(1, 9), s = rng.entero(2, 9);
  return completa(rng, { plantilla: 'completa_lados', sesion: 6,
    texto: `To solve ${lineal(1, b, L).aHtml()} = ${s + b}, subtract ${b} from ${HUECO}.`, correcta: 'both sides', falsas: ['the coefficient', 'the denominator', 'the solution'],
    solucion: sol(`What you do on one side of the equation, you do on both sides.`, `Lo que haces en un miembro de la ecuación lo haces en los dos.`) });
}
function completaExpresion(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.entero(1, 9);
  return completa(rng, { plantilla: 'completa_expresion', sesion: 5,
    texto: `${ESCRIBE(L, a, b)} has no equals sign, so it is an ${HUECO}, not an equation.`, correcta: 'expression', falsas: ['solution', 'identity', 'coefficient'],
    solucion: sol(`Without an equals sign it is an expression.`, `Sin signo igual es una expresión.`) });
}
function completaParentesis(rng) {
  const L = rng.elegir(LETRAS), k = rng.entero(2, 6), m = rng.entero(1, 6);
  return completa(rng, { plantilla: 'completa_parentesis', sesion: 10,
    texto: `To expand ${k}(<i>${L}</i> + ${m}), multiply every term inside the ${HUECO} by ${k}.`, correcta: 'brackets', falsas: ['denominator', 'solution', 'coefficient'],
    solucion: sol(`${k}(${L} + ${m}) = ${k}${L} + ${k * m}.`, `${k}(${L} + ${m}) = ${k}${L} + ${k * m}.`) });
}
function completaDenominador(rng) {
  const L = rng.elegir(LETRAS), n = rng.entero(...COTAS.denominador), c = rng.entero(2, 9);
  return completa(rng, { plantilla: 'completa_denominador', sesion: 10,
    texto: `In <i>${L}</i>/${n} = ${c}, the ${HUECO} is ${n}.`, correcta: 'denominator', falsas: ['numerator', 'solution', 'equation', 'identity'],
    solucion: sol(`The number below the fraction line is the denominator: ${n}.`, `El número de debajo de la raya de fracción es el denominador: ${n}.`) });
}
function completaNumeroSoluciones(rng) {
  const L = rng.elegir(LETRAS), a = rng.entero(2, 9), b = rng.entero(1, 9), infinita = rng.azar() < 0.4;
  const q = infinita ? `${lineal(a, b, L).aHtml()} = ${lineal(a, b, L).aHtml()}` : `${lineal(a, b, L).aHtml()} = ${lineal(a, b + rng.entero(1, 5), L).aHtml()}`;
  const buena = infinita ? 'infinitely many solutions' : 'no solution';
  return completa(rng, { plantilla: 'completa_soluciones', sesion: 9,
    texto: `${q}: this equation has ${HUECO}.`, correcta: buena,
    falsas: ['no solution', 'infinitely many solutions', 'one solution', 'two solutions'].filter(x => x !== buena),
    solucion: infinita ? sol('Both sides are the same, so every number is a solution.', 'Los dos miembros son iguales: todos los números son solución.')
      : sol(`The letter disappears and we get a false statement, so there is no solution.`, 'La letra desaparece y queda algo falso: no hay solución.') });
}
function completaTotal(rng) {
  const [n1, n2] = rng.barajar(NOMBRES);
  const p = rng.entero(...COTAS.lapices), q = rng.entero(...COTAS.lapices);
  return completa(rng, { plantilla: 'completa_total', sesion: 13,
    texto: `${n1} has ${p} pencils and ${n2} has ${q}. They have ${p + q} pencils ${HUECO}.`, correcta: 'altogether', falsas: ['ago', 'twice', 'consecutive'],
    solucion: sol(`Altogether means in total: ${p} + ${q} = ${p + q}.`, `Altogether significa en total: ${p} + ${q} = ${p + q}.`) });
}
function completaHace(rng) {
  const n = rng.elegir(NOMBRES), edad = rng.entero(...COTAS.edad), h = rng.entero(...COTAS.hace);
  return completa(rng, { plantilla: 'completa_hace', sesion: 13,
    texto: `${n} is ${edad} now. ${w(h).replace(/^./, c => c.toUpperCase())} years ${HUECO} ${n} was ${edad - h}.`, correcta: 'ago', falsas: ['altogether', 'twice', 'consecutive'],
    solucion: sol(`“${h} years ago” means ${h} years before now: ${edad} ${MENOS} ${h} = ${edad - h}.`, `«Hace ${h} años» es ${h} años antes de ahora: ${edad} ${MENOS} ${h} = ${edad - h}.`) });
}

export const PLANTILLAS_COMPLETA = [
  completaCoeficiente, completaIndependiente, completaSemejantes, completaEvaluar, completaSolucion, completaLados,
  completaExpresion, completaParentesis, completaDenominador, completaNumeroSoluciones, completaTotal, completaHace,
];
export const generarCompleta = (rng, sesion) => generarDe(rng, PLANTILLAS_COMPLETA, sesion);

export const claveItem = item => `${item.plantilla}|${item.notacion ?? ''}|${item.solucion?.es ?? ''}`;
