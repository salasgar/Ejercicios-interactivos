// Práctica «Léelo en inglés» de la unidad 3 (Integers): lógica pura (sin DOM ni red).
// Cuatro ejercicios, uno por semana, todos de elegir entre opciones:
//   1. Los enteros (semana 1)            leer −7, −3 °C, |−7|, comparar y ordenar
//   2. Sumas, restas y productos (sem. 2) leer 5 − (−3), 5 · (−2), take away, sum / product…
//   3. Potencias (semana 3)               (−2)³ «negative two, cubed», base, exponent / index
//   4. Palabras y símbolos (semana 4)     de la frase a la expresión y los problemas (change, balance…)
//
// Un ítem es DATOS: { plantilla, instruccion, frase, notacion, opciones, solucion }.
// `opciones` ya viene barajada: { texto, html?, correcta, error, por_que } con `error`
// el id del error típico (de ERRORES_TIPICOS o de ERRORES_LECTURA) y `por_que` {es, en}
// con los números del ítem. Todo distractor lleva un error con nombre y NUNCA es otra
// forma válida de decir lo mismo: negative / minus, subtract / take away, times /
// multiplied by y exponent / index no se enfrentan, y un distractor de una expresión
// nunca tiene el mismo valor que la buena (sería otra forma de escribir lo mismo).

import { numeroAIngles } from '../../src/ejercicios/palabras.js';
import {
  fmt, fmtPar, evaluar, html as htmlEnt, aTexto, ERRORES_TIPICOS, ordenaComoNaturales,
} from '../_comun/enteros.js';

export { numeroAIngles };
const w = numeroAIngles;

// ─── Errores propios de la lectura (los de los números están en ERRORES_TIPICOS) ──────

export const ERRORES_LECTURA = {
  'numero-parecido': { nombre: { es: 'Ha confundido dos números que suenan parecido (13 y 30, 41 y 14)', en: 'Mixed up two numbers that sound alike (13 and 30, 41 and 14)' } },
  'calco-del-espanol': { nombre: { es: 'Ha usado una construcción calcada del español', en: 'Used a structure copied from Spanish' } },
  'operacion-cambiada': { nombre: { es: 'Ha cambiado la operación', en: 'Changed the operation' } },
  'orden-invertido': { nombre: { es: 'Ha puesto los números en el orden contrario', en: 'Put the numbers the other way round' } },
  'confunde-opuesto-y-absoluto': { nombre: { es: 'Ha confundido el opuesto con el valor absoluto', en: 'Mixed up the opposite with the absolute value' } },
  'operacion-confundida': { nombre: { es: 'Ha confundido el nombre de una operación', en: 'Mixed up the name of an operation' } },
  'regla-de-los-signos': { nombre: { es: 'Ha aplicado mal la regla de los signos', en: 'Applied the rule of signs wrongly' } },
  'parentesis-ignorado': { nombre: { es: 'Ha leído (−3)² como −3²: el menos no está en la base', en: 'Read (−3)² as −3²: the minus sign is not part of the base' } },
  'exponente-cambiado': { nombre: { es: 'Ha cambiado el exponente', en: 'Changed the exponent' } },
  'base-exponente-confundidos': { nombre: { es: 'Ha confundido la base con el exponente', en: 'Mixed up the base and the exponent' } },
  'resultado-por-base': { nombre: { es: 'Ha dado el resultado de la potencia en vez de la base o el exponente', en: 'Gave the value of the power instead of the base or the exponent' } },
  'par-impar-confundido': { nombre: { es: 'Ha confundido par e impar', en: 'Mixed up even and odd' } },
  'orden-contrario': { nombre: { es: 'Ha cambiado el sentido de la comparación', en: 'Reversed the comparison' } },
};

/** Nombre {es, en} de cualquier error de la práctica. */
export const nombreDe = id => (ERRORES_TIPICOS[id] ?? ERRORES_LECTURA[id])?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

// ─── Utilidades ──────────────────────────────────────────────────────────────────────

class ItemPobre extends Error {}

/** Números cuya palabra se parece: 13↔30 (-teen/-ty) y 41↔14 (cifras invertidas). */
export function numerosParecidos(x) {
  const s = new Set();
  if (x >= 13 && x <= 19) s.add((x - 10) * 10);
  if (x >= 30 && x <= 90 && x % 10 === 0) s.add(x / 10 + 10);
  if (x >= 10 && x <= 99) {
    const d = Math.floor(x / 10), u = x % 10;
    if (u !== 0 && d !== u) s.add(u * 10 + d);
  }
  s.delete(x);
  return [...s];
}

const lastima = (es, en) => ({ es, en });
/** «seven» es 7 / “seven” is 7 */
const significa = (texto, otro) => lastima(`«${texto}» es ${otro}.`, `“${texto}” is ${otro}.`);
const seLee = (otro, texto) => lastima(`${otro} se lee «${texto}».`, `${otro} is read “${texto}”.`);
const noIngles = texto => lastima(`«${texto}» no se dice así en inglés.`, `“${texto}” is not said like that in English.`);
const conError = (error, cuenta) => {
  const n = nombreDe(error);
  const minus = s => s.charAt(0).toLowerCase() + s.slice(1);
  return lastima(`${cuenta}: ${minus(n.es)}.`, `${cuenta}: ${minus(n.en)}.`);
};

/** «X se lee A»; si hay otra forma igual de buena, «A o B: las dos valen». */
const lectura = (nota, buena, otra) => (otra === buena
  ? lastima(`${nota} se lee «${buena}».`, `${nota} is read “${buena}”.`)
  : lastima(`${nota} se lee «${buena}» o «${otra}»: las dos valen.`, `${nota} is read “${buena}” or “${otra}”: both are fine.`));

const grados = k => (Math.abs(k) === 1 ? 'degree' : 'degrees');
const euros = k => `${fmt(k)} €`;

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

function armar(rng, { plantilla, instruccion, frase = '', notacion = '', correcta, falsas, solucion, minFalsas = 2 }) {
  const buenas = elegirFalsas(rng, falsas.filter(f => f.texto !== correcta.texto));
  if (buenas.length < minFalsas) throw new ItemPobre(plantilla);
  const opciones = rng.barajar([{ ...correcta, correcta: true, error: null }, ...buenas.map(f => ({ ...f, correcta: false }))]);
  return { plantilla, instruccion, frase, notacion, opciones, solucion };
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

const opNumero = (a, op, b) => {
  const izq = a < 0 ? `-${-a}` : `${a}`;
  const der = b < 0 ? `(-${-b})` : `${b}`;
  return `${izq} ${op} ${der}`;
};

/** Valor de una expresión, o null si la división no sale exacta. */
function valorONull(texto) {
  try { return evaluar(texto); } catch { return null; }
}

// ─── Lectura de expresiones con signos (ejercicios 2 y 4) ────────────────────────────

export const OPERADORES = { '+': 'plus', '-': 'minus', '*': 'times', ':': 'divided by' };

/** Estilo de lectura de un ítem: neg «negative / minus», restar «minus / take away», por «times / multiplied by». */
function estiloDe(rng, a) {
  return {
    neg: a < 0 ? 'negative' : rng.elegir(['negative', 'minus']),
    restar: a < 0 ? 'minus' : rng.elegir(['minus', 'take away']),
    por: rng.elegir(['times', 'multiplied by']),
  };
}

export function leerOperando(k, est) {
  return k < 0 ? `${est.neg} ${w(-k)}` : w(k);
}

export function leerOperacion(a, op, b, est) {
  const verbo = op === '-' ? est.restar : op === '*' ? est.por : OPERADORES[op];
  return `${leerOperando(a, est)} ${verbo} ${leerOperando(b, est)}`;
}

/** Todas las formas de leer lo mismo (para decírselo al alumno en el feedback). */
function otraLectura(a, op, b, est) {
  const otro = { neg: est.neg === 'negative' ? 'minus' : 'negative', restar: est.restar === 'minus' ? 'take away' : 'minus', por: est.por === 'times' ? 'multiplied by' : 'times' };
  if (a < 0) { otro.neg = 'negative'; otro.restar = 'minus'; }
  return leerOperacion(a, op, b, otro);
}

/** Cambios de la expresión `a op b` que dan otra con distinto valor, cada una con su error. */
function mutaciones(a, op, b) {
  const lista = [];
  const poner = (a2, op2, b2, error, cuenta = null) => lista.push({ a: a2, op: op2, b: b2, error, cuenta });
  if (b < 0) poner(a, op, -b, op === '-' ? 'restar-negativo' : op === '+' ? 'sumar-negativo' : 'signo-cambiado');
  else poner(a, op, -b, 'signo-cambiado');
  poner(-a, op, b, 'signo-cambiado');
  if (op === '+' || op === '-') poner(a, op === '+' ? '-' : '+', b, 'operacion-cambiada');
  if (op === '*') { poner(a, '+', b, 'operacion-cambiada'); poner(a, '-', b, 'operacion-cambiada'); }
  if (op === ':') poner(a, '*', b, 'operacion-cambiada');
  if (op === '*' && b !== 0) poner(a, ':', b, 'operacion-cambiada');
  if (op === '-') poner(b, op, a, 'orden-invertido');
  if (op === ':') poner(b, op, a, 'orden-invertido');
  return lista;
}

// ─── Ejercicio 1 · Los enteros ───────────────────────────────────────────────────────

function leerEntero(rng) {
  const n = rng.entero(2, 60);
  const neg = rng.elegir(['negative', 'minus']);
  const otro = neg === 'negative' ? 'minus' : 'negative';
  const lec = k => `${neg} ${w(k)}`;
  const falsas = [
    { texto: w(n), error: 'signo-cambiado', por_que: significa(w(n), n) },
    { texto: `positive ${w(n)}`, error: 'signo-cambiado', por_que: significa(`positive ${w(n)}`, n) },
    { texto: `${w(n)} negative`, error: 'calco-del-espanol', por_que: noIngles(`${w(n)} negative`) },
    { texto: `less ${w(n)}`, error: 'calco-del-espanol', por_que: noIngles(`less ${w(n)}`) },
  ];
  const p = numerosParecidos(n);
  if (p.length) { const q = rng.elegir(p); falsas.push({ texto: lec(q), error: 'numero-parecido', por_que: significa(lec(q), fmt(-q)) }); }
  return armar(rng, {
    plantilla: 'leer_entero', instruccion: 'leer', notacion: fmt(-n),
    correcta: { texto: lec(n) }, falsas,
    solucion: lastima(`${fmt(-n)} se lee «${lec(n)}» o «${otro} ${w(n)}»: las dos valen.`, `${fmt(-n)} is read “${lec(n)}” or “${otro} ${w(n)}”: both are fine.`),
  });
}

function leerTemperatura(rng) {
  const n = rng.entero(2, 25);
  const estilo = rng.elegir(['negative', 'minus', 'below']);
  const lec = k => (estilo === 'below' ? `${w(k)} degrees below zero` : `${estilo} ${w(k)} degrees`);
  const falsas = [
    { texto: `${w(n)} degrees above zero`, error: 'signo-cambiado', por_que: significa(`${w(n)} degrees above zero`, `${n} °C`) },
    { texto: `${w(n)} degrees`, error: 'signo-cambiado', por_que: significa(`${w(n)} degrees`, `${n} °C`) },
    { texto: `${w(n)} degrees negative`, error: 'calco-del-espanol', por_que: noIngles(`${w(n)} degrees negative`) },
    { texto: `less ${w(n)} degrees`, error: 'calco-del-espanol', por_que: noIngles(`less ${w(n)} degrees`) },
  ];
  const p = numerosParecidos(n);
  if (p.length) { const q = rng.elegir(p); falsas.push({ texto: lec(q), error: 'numero-parecido', por_que: significa(lec(q), `${fmt(-q)} °C`) }); }
  return armar(rng, {
    plantilla: 'leer_temperatura', instruccion: 'leer', notacion: `${fmt(-n)} °C`,
    correcta: { texto: lec(n) }, falsas,
    solucion: lastima(`${fmt(-n)} °C se lee «minus ${w(n)} degrees», «negative ${w(n)} degrees» o «${w(n)} degrees below zero»: las tres valen.`,
      `${fmt(-n)} °C is read “minus ${w(n)} degrees”, “negative ${w(n)} degrees” or “${w(n)} degrees below zero”: all three are fine.`),
  });
}

const CON_PARECIDO = Array.from({ length: 98 }, (_, i) => i + 2).filter(k => numerosParecidos(k).length);

function palabrasAEntero(rng) {
  const n = rng.elegir(CON_PARECIDO.filter(k => k <= 60));
  const grado = rng.azar() < 0.5;
  const estilo = rng.elegir(['negative', 'minus', 'below']);
  const frase = grado && estilo === 'below' ? `${w(n)} degrees below zero`
    : grado ? `${estilo} ${w(n)} degrees` : estilo === 'below' ? `${w(n)} below zero` : `${estilo} ${w(n)}`;
  const nota = k => (grado ? `${fmt(k)} °C` : fmt(k));
  const p = rng.elegir(numerosParecidos(n));
  const falsas = [
    { texto: nota(n), error: 'signo-cambiado', por_que: seLee(nota(n), grado ? `${w(n)} degrees` : w(n)) },
    { texto: nota(-p), error: 'numero-parecido', por_que: seLee(nota(-p), grado ? `minus ${w(p)} degrees` : `minus ${w(p)}`) },
    { texto: nota(p), error: 'numero-parecido', por_que: seLee(nota(p), grado ? `${w(p)} degrees` : w(p)) },
  ];
  return armar(rng, {
    plantilla: 'palabras_a_entero', instruccion: 'escribir', frase,
    correcta: { texto: nota(-n) }, falsas,
    solucion: lastima(`«${frase}» es ${nota(-n)}.`, `“${frase}” is ${nota(-n)}.`),
  });
}

function comparar(rng) {
  let a, b;
  do { a = rng.entero(-20, 20); b = rng.entero(-20, 20); } while (a === b || (a >= 0 && b >= 0));
  const temperatura = rng.azar() < 0.5;
  const [mas, menos] = temperatura ? ['warmer', 'colder'] : ['greater', 'less'];
  const u = temperatura ? ' °C' : '';
  const palabra = rng.elegir([mas, menos]);
  const cierto = palabra === mas ? a > b : a < b;
  const correcta = cierto ? palabra : (palabra === mas ? menos : mas);
  const falsa = correcta === mas ? menos : mas;
  const dosNeg = a < 0 && b < 0;
  const error = dosNeg ? 'compara-como-naturales' : 'orden-contrario';
  const frase = `${fmt(a)}${u} is ___ than ${fmt(b)}${u}`;
  const [may, men] = a > b ? [a, b] : [b, a];
  return armar(rng, {
    plantilla: 'comparar', instruccion: 'completar', frase,
    correcta: { texto: correcta }, minFalsas: 1,
    falsas: [{ texto: falsa, error, por_que: lastima(`${fmt(a)}${u} no es «${falsa}» que ${fmt(b)}${u}: ${fmt(may)} > ${fmt(men)}.`,
      `${fmt(a)}${u} is not “${falsa}” than ${fmt(b)}${u}: ${fmt(may)} > ${fmt(men)}.`) }],
    solucion: lastima(`${fmt(a)}${u} es «${correcta}» que ${fmt(b)}${u}, porque ${fmt(may)} > ${fmt(men)}.`,
      `${fmt(a)}${u} is “${correcta}” than ${fmt(b)}${u}, because ${fmt(may)} > ${fmt(men)}.`),
  });
}

function orden(rng) {
  let lista;
  do {
    const s = new Set();
    while (s.size < 4) s.add(rng.entero(-9, 9));
    lista = rng.barajar([...s]);
  } while (lista.filter(x => x < 0).length < 2);
  const creciente = rng.azar() < 0.5;
  const buena = [...lista].sort((x, y) => (creciente ? x - y : y - x));
  const t = l => l.map(fmt).join(', ');
  const natural = ordenaComoNaturales(lista, creciente);
  const naturalOpuesto = ordenaComoNaturales(lista, !creciente);
  const falsas = [{ texto: t([...buena].reverse()), error: 'orden-contrario',
    por_que: lastima(`Esa lista va en el orden contrario.`, `That list goes the other way round.`) }];
  if (natural) falsas.push({ texto: t(natural), error: 'ordena-como-naturales', por_que: conError('ordena-como-naturales', t(natural)) });
  if (naturalOpuesto) falsas.push({ texto: t(naturalOpuesto), error: 'ordena-como-naturales', por_que: conError('ordena-como-naturales', t(naturalOpuesto)) });
  const orden1 = creciente ? 'ascending' : 'descending';
  return armar(rng, {
    plantilla: 'orden', instruccion: 'orden', frase: `${t(lista)}: which list is in ${orden1} order?`,
    correcta: { texto: t(buena) }, falsas,
    solucion: lastima(`${orden1 === 'ascending' ? 'Ascending = de menor a mayor' : 'Descending = de mayor a menor'}: ${t(buena)}.`,
      `${orden1 === 'ascending' ? 'Ascending = from the least to the greatest' : 'Descending = from the greatest to the least'}: ${t(buena)}.`),
  });
}

function absolutoOpuesto(rng) {
  const n = rng.entero(2, 60);
  const neg = rng.elegir(['negative', 'minus']);
  const absoluto = rng.azar() < 0.5;
  const base = absoluto && rng.azar() < 0.4 ? n : -n;
  const nombre = k => (k < 0 ? `${neg} ${w(-k)}` : w(k));
  const lec = (de, k) => `the ${de} of ${nombre(k)}`;
  const buena = absoluto ? lec('absolute value', base) : lec('opposite', base);
  const notacion = absoluto ? `|${fmt(base)}|` : `−(${fmt(base)})`;
  const otraCosa = absoluto ? lec('opposite', base) : lec('absolute value', base);
  const falsas = [
    { texto: otraCosa, error: 'confunde-opuesto-y-absoluto', por_que: seLee(absoluto ? `−(${fmt(base)})` : `|${fmt(base)}|`, otraCosa) },
    { texto: absoluto ? `the value absolute of ${nombre(base)}` : `the contrary of ${nombre(base)}`, error: 'calco-del-espanol',
      por_que: noIngles(absoluto ? `the value absolute of ${nombre(base)}` : `the contrary of ${nombre(base)}`) },
    { texto: absoluto ? `the module of ${nombre(base)}` : `the opposite of ${w(n)}`, error: absoluto ? 'calco-del-espanol' : 'signo-cambiado',
      por_que: absoluto ? noIngles(`the module of ${nombre(base)}`) : seLee(`−(${n})`, `the opposite of ${w(n)}`) },
  ];
  const falsasOk = falsas.filter(f => f.texto !== buena);
  return armar(rng, {
    plantilla: 'absoluto_opuesto', instruccion: 'leer', notacion: absoluto ? `|${fmt(base)}|` : htmlEnt(`-(${base < 0 ? `-${-base}` : base})`),
    correcta: { texto: buena }, falsas: falsasOk,
    solucion: lastima(`${notacion} se lee «${buena}».`, `${notacion} is read “${buena}”.`),
  });
}

export const PLANTILLAS_ENTEROS = [leerEntero, leerTemperatura, palabrasAEntero, comparar, orden, absolutoOpuesto];
export const generarEnteros = rng => generarDe(rng, PLANTILLAS_ENTEROS);

// ─── Ejercicio 2 · Sumas, restas y productos ─────────────────────────────────────────

function leerExpresion(rng) {
  const op = rng.elegir(['+', '-']);
  let a, b;
  do {
    a = rng.entero(-12, 12); b = rng.entero(-12, 12);
  } while (a === 0 || b === 0 || (a > 0 && b > 0) || Math.abs(a) === Math.abs(b));
  const est = estiloDe(rng, a);
  const correcta = leerOperacion(a, op, b, est);
  const v = evaluar(opNumero(a, op, b));
  const falsas = mutaciones(a, op, b)
    .filter(m => valorONull(opNumero(m.a, m.op, m.b)) !== v && valorONull(opNumero(m.a, m.op, m.b)) !== null)
    .map(m => {
      const texto = leerOperacion(m.a, m.op, m.b, est);
      return { texto, error: m.error, por_que: seLee(aTexto(opNumero(m.a, m.op, m.b)), texto) };
    });
  return armar(rng, {
    plantilla: 'leer_expresion', instruccion: 'leer', notacion: htmlEnt(opNumero(a, op, b)),
    correcta: { texto: correcta }, falsas,
    solucion: lectura(aTexto(opNumero(a, op, b)), correcta, otraLectura(a, op, b, est)),
  });
}

function leerProducto(rng) {
  const op = rng.elegir(['*', ':']);
  let a, b;
  do {
    const x = rng.entero(2, 9), y = rng.entero(2, 9);
    b = op === ':' ? x : y;
    a = op === ':' ? x * y : x;
    if (rng.azar() < 0.5) a = -a;
    if (rng.azar() < 0.5) b = -b;
  } while (a > 0 && b > 0);
  const est = estiloDe(rng, a);
  const correcta = leerOperacion(a, op, b, est);
  const v = evaluar(opNumero(a, op, b));
  const falsas = mutaciones(a, op, b)
    .filter(m => { const x = valorONull(opNumero(m.a, m.op, m.b)); return x !== null && x !== v; })
    .map(m => {
      const texto = leerOperacion(m.a, m.op, m.b, est);
      return { texto, error: m.error, por_que: seLee(aTexto(opNumero(m.a, m.op, m.b)), texto) };
    });
  return armar(rng, {
    plantilla: 'leer_producto', instruccion: 'leer', notacion: htmlEnt(opNumero(a, op, b)),
    correcta: { texto: correcta }, falsas,
    solucion: lectura(aTexto(opNumero(a, op, b)), correcta, op === '*' ? otraLectura(a, op, b, est) : correcta),
  });
}

function takeAway(rng) {
  let a, b;
  do { a = rng.entero(1, 15); b = rng.entero(1, 15); } while (a === b);
  const forma = rng.elegir(['take', 'subtract']);
  const frase = forma === 'take' ? `take ${w(b)} away from ${w(a)}` : `subtract ${w(b)} from ${w(a)}`;
  const v = a - b;
  const est = { neg: 'negative', restar: 'minus', por: 'times' };
  const candidatos = [
    [b, '-', a, 'orden-invertido'], [a, '+', b, 'operacion-cambiada'], [-a, '-', b, 'signo-cambiado'], [-a, '+', b, 'orden-invertido'],
  ];
  const vistos = new Set([v]);
  const falsas = [];
  for (const [x, o, y, error] of candidatos) {
    const val = evaluar(opNumero(x, o, y));
    if (vistos.has(val)) continue;
    vistos.add(val);
    const t = aTexto(opNumero(x, o, y));
    falsas.push({ texto: t, html: htmlEnt(opNumero(x, o, y)), error, por_que: seLee(t, leerOperacion(x, o, y, est)) });
  }
  return armar(rng, {
    plantilla: 'take_away_from', instruccion: 'escribir', frase,
    correcta: { texto: aTexto(opNumero(a, '-', b)), html: htmlEnt(opNumero(a, '-', b)) }, falsas,
    solucion: lastima(`«${frase}» es ${aTexto(opNumero(a, '-', b))} = ${fmt(v)}: se empieza por el número de «from».`,
      `“${frase}” is ${aTexto(opNumero(a, '-', b))} = ${fmt(v)}: you start with the number after “from”.`),
  });
}

const NOMBRES_RESULTADO = {
  sum: { es: 'sum = suma', op: '+' }, difference: { es: 'difference = resta', op: '-' },
  product: { es: 'product = producto', op: '*' }, quotient: { es: 'quotient = cociente', op: ':' },
};

function nombreResultado(rng) {
  let a, b, q;
  do {
    b = rng.entero(2, 9); q = rng.entero(2, 9); a = b * q;
  } while (new Set([a + b, a - b, a * b, q]).size < 4);
  const palabra = rng.elegir(Object.keys(NOMBRES_RESULTADO));
  const cuenta = (p) => {
    const o = NOMBRES_RESULTADO[p].op;
    return `${a} ${o === '*' ? '·' : o === '-' ? '−' : o} ${b} = ${evaluar(`${a} ${o} ${b}`)}`;
  };
  const r = evaluar(`${a} ${NOMBRES_RESULTADO[palabra].op} ${b}`);
  const falsas = Object.keys(NOMBRES_RESULTADO).filter(p => p !== palabra).map(p => ({
    texto: p, error: 'operacion-confundida',
    por_que: lastima(`${p === 'sum' || p === 'difference' ? 'La' : 'El'} ${NOMBRES_RESULTADO[p].es.split(' = ')[1]} de ${a} y ${b} es ${evaluar(`${a} ${NOMBRES_RESULTADO[p].op} ${b}`)}, no ${r}: ${cuenta(p)}.`,
      `The ${p} of ${a} and ${b} is ${evaluar(`${a} ${NOMBRES_RESULTADO[p].op} ${b}`)}, not ${r}: ${cuenta(p)}.`),
  }));
  return armar(rng, {
    plantilla: 'nombre_resultado', instruccion: 'completar', frase: `The ___ of ${a} and ${b} is ${r}`,
    correcta: { texto: palabra }, falsas,
    solucion: lastima(`${cuenta(palabra)}: es el ${NOMBRES_RESULTADO[palabra].es.replace(' = ', ' (')}).`, `${cuenta(palabra)}: it is the ${palabra}.`),
  });
}

function reglaDeSignos(rng) {
  const multiplicar = rng.azar() < 0.5;
  const iguales = rng.azar() < 0.5;
  const b = rng.entero(2, 9), q = rng.entero(2, 9);
  // Iguales: los dos negativos; distintos: el primero positivo y el segundo negativo.
  const a0 = multiplicar ? q : b * q;
  const a = iguales ? -a0 : a0;
  const bb = -b;
  const op = multiplicar ? '*' : ':';
  const cuenta = `${aTexto(opNumero(a, op, bb))} = ${fmt(evaluar(opNumero(a, op, bb)))}`;
  const resultado = iguales ? 'positive' : 'negative';
  const otro = iguales ? 'negative' : 'positive';
  const verbo = multiplicar ? 'multiply' : 'divide';
  return armar(rng, {
    plantilla: 'regla_de_signos', instruccion: 'completar',
    frase: `When you ${verbo} two numbers with ${iguales ? 'the same' : 'different'} signs, the result is ___`,
    correcta: { texto: resultado }, minFalsas: 1,
    falsas: [{ texto: otro, error: 'regla-de-los-signos', por_que: lastima(`${cuenta}: el resultado es ${resultado === 'positive' ? 'positivo' : 'negativo'}.`, `${cuenta}: the result is ${resultado}.`) }],
    solucion: lastima(`Signos ${iguales ? 'iguales (same signs)' : 'distintos (different signs)'}: ${cuenta}, es ${resultado === 'positive' ? 'positivo' : 'negativo'}.`,
      `${iguales ? 'Same' : 'Different'} signs: ${cuenta}, it is ${resultado}.`),
  });
}

export const PLANTILLAS_OPERACIONES = [leerExpresion, leerProducto, takeAway, nombreResultado, reglaDeSignos];
export const generarOperaciones = rng => generarDe(rng, PLANTILLAS_OPERACIONES);

// ─── Ejercicio 3 · Potencias ─────────────────────────────────────────────────────────

const sufijo = e => (e === 2 ? 'squared' : e === 3 ? 'cubed' : `to the power of ${w(e)}`);

function leerPotencia(rng) {
  const b0 = rng.entero(2, 9);
  const b = rng.azar() < 0.5 ? -b0 : b0;
  const e = rng.entero(2, 5);
  const neg = rng.elegir(['negative', 'minus']);
  const otro = neg === 'negative' ? 'minus' : 'negative';
  const baseTxt = (k, n = neg) => (k < 0 ? `${n} ${w(-k)}` : w(k));
  const sep = b < 0 ? ', ' : ' ';
  const lec = (k, ex, n = neg) => `${baseTxt(k, n)}${k < 0 ? ', ' : ' '}${sufijo(ex)}`;
  const nota = (k, ex) => aTexto(k < 0 ? `(-${-k})^${ex}` : `${k}^${ex}`);
  const valor = Math.pow(b, e);
  const falsas = [];
  const prueba = (texto, v, error, por_que) => { if (v === null || v !== valor) falsas.push({ texto, error, por_que }); };
  if (b < 0) {
    const t = `the opposite of ${w(-b)} ${sufijo(e)}`;
    prueba(t, -Math.pow(-b, e), 'parentesis-ignorado', seLee(aTexto(`-${-b}^${e}`), t));
  }
  const t1 = `${baseTxt(b)} times ${w(e)}`;
  prueba(t1, b * e, 'base-por-exponente', seLee(aTexto(opNumero(b, '*', e)), t1));
  for (const e2 of rng.barajar([2, 3, 4, 5].filter(x => x !== e)).slice(0, 2)) {
    const t = lec(b, e2);
    prueba(t, Math.pow(b, e2), 'exponente-cambiado', seLee(nota(b, e2), t));
  }
  const calco = e === 2 ? 'square' : e === 3 ? 'cube' : `elevated to ${w(e)}`;
  const tc = `${baseTxt(b)}${sep}${calco}`;
  prueba(tc, null, 'calco-del-espanol', noIngles(tc));
  return armar(rng, {
    plantilla: 'leer_potencia', instruccion: 'leer', notacion: htmlEnt(b < 0 ? `(-${-b})^${e}` : `${b}^${e}`),
    correcta: { texto: lec(b, e) }, falsas,
    solucion: lastima(`${nota(b, e)} se lee «${lec(b, e)}»${b < 0 ? ` o «${lec(b, e, otro)}»` : ''}.`, `${nota(b, e)} is read “${lec(b, e)}”${b < 0 ? ` or “${lec(b, e, otro)}”` : ''}.`),
  });
}

function baseExponente(rng) {
  let b, e;
  do {
    b = rng.entero(2, 6); if (rng.azar() < 0.5) b = -b;
    e = rng.entero(2, 5);
  } while (new Set([b, e, Math.pow(b, e), b * e]).size < 4);
  const parte = rng.elegir(['base', 'exponent', 'index']);
  const pregunta = parte === 'base';
  const nota = aTexto(b < 0 ? `(-${-b})^${e}` : `${b}^${e}`);
  const buena = pregunta ? b : e;
  const falsas = [
    { texto: fmt(pregunta ? e : b), error: 'base-exponente-confundidos', por_que: lastima(`${fmt(pregunta ? e : b)} es ${pregunta ? 'el exponente' : 'la base'}.`, `${fmt(pregunta ? e : b)} is the ${pregunta ? 'exponent' : 'base'}.`) },
    { texto: fmt(Math.pow(b, e)), error: 'resultado-por-base', por_que: lastima(`${fmt(Math.pow(b, e))} es el valor de la potencia, no la ${pregunta ? 'base' : 'del exponente'}.`, `${fmt(Math.pow(b, e))} is the value of the power, not the ${parte}.`) },
    { texto: fmt(b * e), error: 'base-por-exponente', por_que: conError('base-por-exponente', `${aTexto(opNumero(b, '*', e))} = ${fmt(b * e)}`) },
  ];
  return armar(rng, {
    plantilla: 'base_exponente', instruccion: 'completar', notacion: htmlEnt(b < 0 ? `(-${-b})^${e}` : `${b}^${e}`),
    frase: `In this power, the ${parte} is ___`,
    correcta: { texto: fmt(buena) }, falsas,
    solucion: lastima(`En ${nota} la base (base) es ${fmt(b)} y el exponente (exponent o index) es ${e}.`, `In ${nota} the base is ${fmt(b)} and the exponent (or index) is ${e}.`),
  });
}

function cuadradoCubo(rng) {
  const b = rng.entero(3, 9);
  const cubo = rng.azar() < 0.5;
  const palabra = cubo ? 'cubed' : 'squared';
  const buena = cubo ? [b, b, b] : [b, b];
  const t = l => l.join(' · ');
  const falsas = cubo
    ? [{ texto: t([b, 3]), error: 'base-por-exponente', por_que: conError('base-por-exponente', `${b} · 3 = ${3 * b}`) },
      { texto: t([b, b]), error: 'exponente-cambiado', por_que: lastima(`${t([b, b])} es ${b} al cuadrado (squared), no al cubo.`, `${t([b, b])} is ${b} squared, not cubed.`) }]
    : [{ texto: t([b, 2]), error: 'base-por-exponente', por_que: conError('base-por-exponente', `${b} · 2 = ${2 * b}`) },
      { texto: t([b, b, b]), error: 'exponente-cambiado', por_que: lastima(`${t([b, b, b])} es ${b} al cubo (cubed), no al cuadrado.`, `${t([b, b, b])} is ${b} cubed, not squared.`) }];
  return armar(rng, {
    plantilla: 'cuadrado_cubo', instruccion: 'significa', frase: `${w(b)} ${palabra}`,
    correcta: { texto: t(buena) }, falsas,
    solucion: lastima(`${w(b)} ${palabra} = ${b}${cubo ? '³' : '²'} = ${t(buena)} = ${Math.pow(b, buena.length)}.`, `${w(b)} ${palabra} = ${b}${cubo ? '³' : '²'} = ${t(buena)} = ${Math.pow(b, buena.length)}.`),
  });
}

function parImpar(rng) {
  if (rng.azar() < 0.5) {
    const b0 = rng.entero(2, 9), e = rng.entero(2, 7);
    const b = rng.azar() < 0.5 ? -b0 : b0;
    const par = e % 2 === 0;
    const nota = aTexto(b < 0 ? `(-${-b})^${e}` : `${b}^${e}`);
    return armar(rng, {
      plantilla: 'par_impar', instruccion: 'completar', notacion: htmlEnt(b < 0 ? `(-${-b})^${e}` : `${b}^${e}`),
      frase: 'The exponent of this power is an ___ number',
      correcta: { texto: par ? 'even' : 'odd' }, minFalsas: 1,
      falsas: [{ texto: par ? 'odd' : 'even', error: 'par-impar-confundido', por_que: lastima(`${e} es ${par ? 'par (even)' : 'impar (odd)'}.`, `${e} is ${par ? 'even' : 'odd'}.`) }],
      solucion: lastima(`El exponente de ${nota} es ${e}: ${par ? 'par (even)' : 'impar (odd)'}.`, `The exponent of ${nota} is ${e}: ${par ? 'even' : 'odd'}.`),
    });
  }
  const par = rng.azar() < 0.5;
  const b = rng.entero(2, 5), e = par ? rng.elegir([2, 4]) : rng.elegir([3, 5]);
  const cuenta = `${aTexto(`(-${b})^${e}`)} = ${fmt(Math.pow(-b, e))}`;
  const buena = par ? 'positive' : 'negative';
  const falsa = par ? 'negative' : 'positive';
  return armar(rng, {
    plantilla: 'par_impar', instruccion: 'completar',
    frase: `A negative base with an ${par ? 'even (par)' : 'odd (impar)'} exponent gives a ___ result`,
    correcta: { texto: buena }, minFalsas: 1,
    falsas: [{ texto: falsa, error: par ? 'potencia-par-negativa' : 'potencia-impar-positiva', por_que: conError(par ? 'potencia-par-negativa' : 'potencia-impar-positiva', cuenta) }],
    solucion: lastima(`Por ejemplo, ${cuenta}: es ${buena === 'positive' ? 'positivo' : 'negativo'}.`, `For example, ${cuenta}: it is ${buena}.`),
  });
}

export const PLANTILLAS_POTENCIAS = [leerPotencia, baseExponente, cuadradoCubo, parImpar];
export const generarPotencias = rng => generarDe(rng, PLANTILLAS_POTENCIAS);

// ─── Ejercicio 4 · Palabras y símbolos ───────────────────────────────────────────────

/** Falsas de una frase que se pasa a símbolos: otras expresiones con DISTINTO valor. */
function simbolos(lista, v) {
  const falsas = [];
  const vistos = new Set([v]);
  for (const [txt, error, extra] of lista) {
    const val = valorONull(txt);
    if (val === null || vistos.has(val)) continue;
    vistos.add(val);
    falsas.push({ texto: aTexto(txt), html: htmlEnt(txt), error, por_que: extra ?? conError(error, `${aTexto(txt)} = ${fmt(val)}`) });
  }
  return falsas;
}

function frasePotencia(rng) {
  const n = rng.entero(3, 9);
  const opuesto = rng.azar() < 0.5;
  const neg = rng.elegir(['negative', 'minus']);
  const frase = opuesto ? `the opposite of ${w(n)} squared` : `${neg} ${w(n)}, squared`;
  const buena = opuesto ? `-${n}^2` : `(-${n})^2`;
  const v = evaluar(buena);
  const falsas = simbolos(opuesto
    ? [[`(-${n})^2`, 'menos-en-la-base'], [`-${n}^3`, 'exponente-cambiado'], [`-${n} * 2`, 'base-por-exponente'], [`${n} ^ 2`, 'signo-cambiado']]
    : [[`-${n}^2`, 'parentesis-ignorado'], [`(-${n})^3`, 'exponente-cambiado'], [`-${n} * 2`, 'base-por-exponente'], [`${n} * 2`, 'base-por-exponente']], v);
  return armar(rng, {
    plantilla: 'frase_potencia', instruccion: 'simbolos', frase,
    correcta: { texto: aTexto(buena), html: htmlEnt(buena) }, falsas,
    solucion: lastima(`«${frase}» es ${aTexto(buena)} = ${fmt(v)}.`, `“${frase}” is ${aTexto(buena)} = ${fmt(v)}.`),
  });
}

function fraseOperacion(rng) {
  const op = rng.elegir(['+', '-']);
  let a, b;
  do { a = rng.entero(-12, 12); b = rng.entero(-12, 12); } while (a === 0 || b === 0 || (a > 0 && b > 0) || Math.abs(a) === Math.abs(b));
  const est = estiloDe(rng, a);
  const frase = leerOperacion(a, op, b, est);
  const v = evaluar(opNumero(a, op, b));
  const falsas = simbolos(mutaciones(a, op, b).map(m => [opNumero(m.a, m.op, m.b), m.error]), v);
  return armar(rng, {
    plantilla: 'frase_operacion', instruccion: 'simbolos', frase,
    correcta: { texto: aTexto(opNumero(a, op, b)), html: htmlEnt(opNumero(a, op, b)) }, falsas,
    solucion: lastima(`«${frase}» es ${aTexto(opNumero(a, op, b))} = ${fmt(v)}.`, `“${frase}” is ${aTexto(opNumero(a, op, b))} = ${fmt(v)}.`),
  });
}

function cambio(rng) {
  let x, y;
  do {
    x = rng.entero(1, 12) * (rng.azar() < 0.5 ? -1 : 1);
    y = rng.entero(1, 12) * (x < 0 ? 1 : -1);
  } while (Math.abs(y - x) > 20 || Math.abs(y - x) < 4);
  const d = y - x;
  const g = k => `${fmt(k)} ${grados(k)}`;
  const cand = [
    ['inicial-menos-final', x - y, `${fmt(x)} − ${fmtPar(y)}`],
    ['diferencia-sin-signo', Math.abs(Math.abs(x) - Math.abs(y)), `${Math.abs(x)} − ${Math.abs(y)}`],
    ['restar-negativo', x + y, `${fmt(x)} + ${fmtPar(y)}`],
  ];
  const falsas = cand.filter(([, v]) => v !== d).map(([error, v, cuenta]) => ({
    texto: g(v), error, por_que: conError(error, `${cuenta} = ${fmt(v)}`),
  }));
  return armar(rng, {
    plantilla: 'cambio', instruccion: 'problema',
    frase: `At 8:00 the temperature was ${fmt(x)} °C. At 20:00 it was ${fmt(y)} °C. What is the change in temperature?`,
    correcta: { texto: g(d) }, falsas,
    solucion: lastima(`Change = final − inicial: ${fmt(y)} − ${fmtPar(x)} = ${fmt(d)}.`, `Change = final − start: ${fmt(y)} − ${fmtPar(x)} = ${fmt(d)}.`),
  });
}

const CIUDADES = [['Madrid', 'Oslo'], ['Rome', 'Moscow'], ['Cairo', 'Helsinki'], ['Lima', 'Toronto'], ['Athens', 'Warsaw']];

function cuantoMas(rng) {
  const frio = rng.entero(-15, -1), calor = rng.entero(1, 30);
  const [c1, c2] = rng.elegir(CIUDADES);
  const caliente = rng.azar() < 0.5;
  const d = calor - frio;
  const g = k => `${fmt(k)} ${grados(k)}`;
  const frase = caliente
    ? `How much warmer is ${c1} (${fmt(calor)} °C) than ${c2} (${fmt(frio)} °C)?`
    : `How much colder is ${c2} (${fmt(frio)} °C) than ${c1} (${fmt(calor)} °C)?`;
  const cand = [
    ['diferencia-sin-signo', Math.abs(Math.abs(calor) - Math.abs(frio)), `${Math.abs(calor)} − ${Math.abs(frio)}`],
    ['restar-negativo', calor + frio, `${calor} + ${fmtPar(frio)}`],
    ['inicial-menos-final', frio - calor, `${fmt(frio)} − ${calor}`],
  ];
  const vistos = new Set([d]);
  const falsas = [];
  for (const [error, v, cuenta] of cand) {
    if (vistos.has(v)) continue;
    vistos.add(v);
    falsas.push({ texto: g(v), error, por_que: conError(error, `${cuenta} = ${fmt(v)}`) });
  }
  return armar(rng, {
    plantilla: 'cuanto_mas', instruccion: 'problema', frase,
    correcta: { texto: g(d) }, falsas,
    solucion: lastima(`La diferencia: ${calor} − ${fmtPar(frio)} = ${d} grados.`, `The difference: ${calor} − ${fmtPar(frio)} = ${d} degrees.`),
  });
}

function saldo(rng) {
  const retirar = rng.azar() < 0.5;
  let a, k, v, frase, textoCuenta;
  if (retirar) {
    a = rng.entero(10, 200);
    k = a + rng.entero(5, 50);
    v = a - k;
    textoCuenta = `${a} − ${k}`;
    frase = `Your balance is ${a} €. You withdraw (retiras) ${k} €. What is your new balance?`;
  } else {
    a = rng.entero(10, 50);
    k = rng.entero(5, 150);
    while (k === a) k = rng.entero(5, 150);
    v = k - a;
    textoCuenta = `${fmt(-a)} + ${k}`;
    frase = `Your balance is ${fmt(-a)} €. You deposit (ingresas) ${k} €. What is your new balance?`;
  }
  const cand = retirar
    ? [['olvida-el-signo', Math.abs(v), `${k} − ${a}`], ['suma-valores-absolutos', a + k, `${a} + ${k}`], ['signo-cambiado', -(a + k), `−${a} − ${k}`]]
    : [['olvida-el-signo', Math.abs(v), `${Math.max(a, k)} − ${Math.min(a, k)}`], ['suma-valores-absolutos', -(a + k), `−${a} − ${k}`], ['signo-cambiado', -v, `${a} − ${k}`]];
  const vistos = new Set([v]);
  const falsas = [];
  for (const [error, val, c] of cand) {
    if (vistos.has(val)) continue;
    vistos.add(val);
    falsas.push({ texto: euros(val), error, por_que: conError(error, `${c} = ${fmt(val)}`) });
  }
  return armar(rng, {
    plantilla: 'saldo', instruccion: 'problema', frase,
    correcta: { texto: euros(v) }, falsas,
    solucion: lastima(`${textoCuenta} = ${fmt(v)}: el nuevo saldo (balance) es ${euros(v)}.`, `${textoCuenta} = ${fmt(v)}: the new balance is ${euros(v)}.`),
  });
}

function profundidad(rng) {
  const mas = rng.azar() < 0.5;
  if (mas) {
    const d = rng.entero(3, 25), k = rng.entero(2, Math.min(12, 38 - d + 0));
    const v = -(d + k);
    const m = (z) => `${fmt(z)} m`;
    const cand = [['signo-cambiado', d + k, `${d} + ${k}`], ['operacion-cambiada', k - d, `${fmt(-d)} + ${k}`], ['operacion-cambiada', d - k, `${d} − ${k}`]];
    const vistos = new Set([v]);
    const falsas = [];
    for (const [error, val, c] of cand) {
      if (vistos.has(val)) continue;
      vistos.add(val);
      falsas.push({ texto: m(val), error, por_que: error === 'signo-cambiado' ? conError('signo-cambiado', `${c} = ${fmt(val)}`) : conError('operacion-cambiada', `${c} = ${fmt(val)}`) });
    }
    return armar(rng, {
      plantilla: 'profundidad', instruccion: 'problema',
      frase: `A diver is at ${fmt(-d)} m. She swims ${k} m deeper. Where is she now?`,
      correcta: { texto: m(v) }, falsas,
      solucion: lastima(`Más profundo (deeper) es más negativo: ${fmt(-d)} − ${k} = ${fmt(v)}.`, `Deeper means more negative: ${fmt(-d)} − ${k} = ${fmt(v)}.`),
    });
  }
  const hondo = rng.entero(10, 38), alto = rng.entero(2, hondo - 4);
  const d = hondo - alto;
  const m = z => `${fmt(z)} m`;
  const cand = [['suma-valores-absolutos', hondo + alto, `${hondo} + ${alto}`], ['signo-cambiado', -d, `${fmt(-hondo)} − ${fmt(-alto)} → ${fmt(-d)}`], ['diferencia-sin-signo', Math.abs(hondo - alto) + alto, `${hondo} − ${alto} + ${alto}`]];
  const vistos = new Set([d]);
  const falsas = [];
  for (const [error, val, c] of cand) {
    if (vistos.has(val)) continue;
    vistos.add(val);
    falsas.push({ texto: m(val), error, por_que: conError(error, `${c} = ${fmt(val)}`) });
  }
  return armar(rng, {
    plantilla: 'profundidad', instruccion: 'problema',
    frase: `A fish is at ${fmt(-hondo)} m and a turtle is at ${fmt(-alto)} m. How much deeper is the fish than the turtle?`,
    correcta: { texto: m(d) }, falsas,
    solucion: lastima(`${hondo} − ${alto} = ${d}: el pez está ${d} m más profundo.`, `${hondo} − ${alto} = ${d}: the fish is ${d} m deeper.`),
  });
}

function beneficioPerdida(rng) {
  let p, l;
  do { p = rng.entero(2, 20) * 10; l = rng.entero(2, 20) * 10; } while (p === l);
  const v = p - l;
  const cand = [['signo-cambiado', -v, `${l} − ${p}`], ['suma-valores-absolutos', p + l, `${p} + ${l}`], ['regla-signos-en-suma', -(p + l), `−${p} − ${l}`]];
  const vistos = new Set([v]);
  const falsas = [];
  for (const [error, val, c] of cand) {
    if (vistos.has(val)) continue;
    vistos.add(val);
    falsas.push({ texto: euros(val), error, por_que: conError(error, `${c} = ${fmt(val)}`) });
  }
  return armar(rng, {
    plantilla: 'beneficio_perdida', instruccion: 'problema',
    frase: `On Monday a shop makes a profit of ${p} €. On Tuesday it has a loss of ${l} €. What is the result of the two days together?`,
    correcta: { texto: euros(v) }, falsas,
    solucion: lastima(`Beneficio (profit) = +${p}; pérdida (loss) = −${l}: ${p} − ${l} = ${fmt(v)}.`, `Profit = +${p}; loss = −${l}: ${p} − ${l} = ${fmt(v)}.`),
  });
}

export const PLANTILLAS_PALABRAS = [frasePotencia, fraseOperacion, cambio, cuantoMas, saldo, profundidad, beneficioPerdida];
export const generarPalabras = rng => generarDe(rng, PLANTILLAS_PALABRAS);

/** Texto que identifica el ítem (para que la base no repita el anterior). */
export const claveDe = item => `${item.plantilla}|${item.frase}|${item.notacion}`;
