// Práctica «¿Qué se hace primero? Con fracciones»: lógica pura (sin DOM ni red), probada por
// fuerza bruta en `tests/practicas-combinadas-fracciones.test.js`. Los generadores devuelven
// DATOS (textos de expresiones, líneas de un procedimiento), nunca HTML ni funciones.
//
// Cotas (no hay contexto: son de tamaño, para que las cuentas se hagan a mano):
// operandos con denominador de 2 a 12 (y algún natural de 1 a 4); todo resultado de un paso, en
// cualquier orden válido, con numerador y denominador de 72 como mucho y distinto de 0; resultado
// final con denominador de 36 como mucho; nada de dividir entre 0. Entre 2 y 3 operaciones.
//
// Forma de una expresión: `texto` se escribe con U+2212 y `·`; un negativo que no va el primero
// (ni el primero de un paréntesis) va entre paréntesis y solo detrás de · o : (`1/2 · (−3/4)`);
// ninguna potencia (son de la sesión 7 y la práctica no las mezcla), decimales ni números mixtos.

import { crearRng } from '../_comun/rng.js';
import { mcd } from '../_comun/aritmetica.js';
import {
  MENOS, ErrorFracciones, analizar, evaluar, aTextoExpresion, pasosPosibles, aplicarPaso,
  pasoCanonico, valorLiteral, nodoEn, reemplazar, num, NIVEL, ERRORES_TIPICOS, distractores,
} from '../_comun/fracciones.js';

export const MAX_TERMINO_PASO = 72;
export const MAX_DEN_FINAL = 36;

const DENS = [2, 3, 4, 5, 6, 8, 9, 10, 12];

// ─── Piezas de las expresiones ────────────────────────────────────────────────────

/** Un operando como texto: irreducible, casi siempre propia, a veces impropia o un natural pequeño. */
function operando(rng, sinUno = false) {
  const r = rng.azar();
  if (r < 0.1) return String(rng.entero(sinUno ? 2 : 1, 4));
  for (;;) {
    const d = rng.elegir(DENS);
    const n = rng.entero(1, r < 0.25 ? 2 * d - 1 : d - 1);
    if (mcd(n, d) === 1) return `${n}/${d}`;
  }
}

/**
 * Formas: letras A-D son operandos; el resto, tal cual. Sin paréntesis (grupo 'sin') o con uno
 * (grupo 'con'); 'cadena' son las de dos operaciones del mismo nivel (solo en el ejercicio 1).
 */
const FORMAS = {
  sin: [
    'A + B · C', 'A − B · C', 'A · B + C', 'A · B − C', 'A + B : C', 'A − B : C', 'A : B + C', 'A : B − C',
    'A + B · C − D', 'A · B + C · D', 'A − B : C + D',
  ],
  con: [
    '(A + B) · C', '(A − B) · C', '(A + B) : C', '(A − B) : C', 'A : (B + C)', 'A · (B − C)',
    'A − B : (C + D)', 'A + B · (C − D)', '(A + B) · C − D', 'A : (B − C) + D',
  ],
  cadena: ['A − B + C', 'A : B · C', 'A · B : C'],
};

const LETRAS = 'ABCD';

/**
 * Pone operandos a una forma. `negativo` = índice de operando (0-3) que va con el signo menos, o
 * -1. Solo se niega el primero de todos (o del paréntesis) o el segundo de un · o : .
 */
function rellenar(forma, rng, negativo) {
  const fichas = forma.split(' ');
  // El natural 1 no va detrás de · o : ni delante de · (1 · x o x : 1 no enseñan nada).
  const sinUno = LETRAS.split('').map(l => fichas.some((f, i) => f.replace(/[()]/g, '') === l
    && (fichas[i - 1] === '·' || fichas[i - 1] === ':' || fichas[i + 1] === '·')));
  const textos = LETRAS.split('').map((_, k) => operando(rng, sinUno[k]));
  return fichas.map((ficha, i) => {
    const m = /^(\(?)([A-D])(\)?)$/.exec(ficha);
    if (!m) return ficha;
    const k = LETRAS.indexOf(m[2]);
    let t = textos[k];
    if (k === negativo) {
      const anterior = fichas[i - 1];
      t = !m[1] && (anterior === '·' || anterior === ':') ? `(${MENOS}${t})` : `${MENOS}${t}`;
    }
    return `${m[1]}${t}${m[3]}`;
  }).join(' ');
}

/** Los índices de operando que se pueden negar en una forma. */
function negables(forma) {
  const fichas = forma.split(' ');
  const salida = [];
  fichas.forEach((ficha, i) => {
    const m = /^\(?([A-D])\)?$/.exec(ficha);
    if (!m) return;
    const k = LETRAS.indexOf(m[1]);
    const anterior = fichas[i - 1];
    if (i === 0 || anterior === '·' || anterior === ':') salida.push(k);
  });
  return salida;
}

// ─── Comprobación de una expresión ────────────────────────────────────────────────

const dentroDeCota = f => Math.abs(f.num) <= MAX_TERMINO_PASO && f.den <= MAX_TERMINO_PASO;

/**
 * ¿Vale la expresión? Se calcula sin error, el final tiene denominador de 36 como mucho y no es 0,
 * y en TODOS los órdenes válidos de pasos cada resultado está en cota, no es 0 y tiene al menos
 * dos opciones falsas con nombre. `minOperaciones`: operaciones que tiene que llevar.
 */
export function valida(texto, { minOperaciones = 2, maxOperaciones = 3 } = {}) {
  let arbol, final;
  try { arbol = analizar(texto); final = evaluar(arbol); } catch (e) { if (e instanceof ErrorFracciones) return false; throw e; }
  if (final.num === 0 || final.den > MAX_DEN_FINAL || Math.abs(final.num) > MAX_TERMINO_PASO) return false;
  const visto = new Set();
  let operaciones = 0;
  const explorar = (x, nivel) => {
    const clave = aTextoExpresion(x);
    if (visto.has(clave)) return true;
    visto.add(clave);
    if (visto.size > 300) return false;
    if (valorLiteral(x) !== null) return true;
    const pasos = pasosPosibles(x);
    if (!pasos.length) return false;
    if (nivel === 0) operaciones = cuentaOperaciones(x);
    return pasos.every(p => p.valor.num !== 0 && dentroDeCota(p.valor)
      && opcionesDePaso(x, p).falsas.length >= 2 && explorar(aplicarPaso(x, p), nivel + 1));
  };
  return explorar(arbol, 0) && operaciones >= minOperaciones && operaciones <= maxOperaciones;
}

/** Cuántas operaciones (+ − · :) quedan por hacer en un árbol. */
export function cuentaOperaciones(x) {
  const n = analizar(x);
  switch (n.tipo) {
    case 'op': return 1 + cuentaOperaciones(n.izq) + cuentaOperaciones(n.der);
    case 'par': case 'pos': return cuentaOperaciones(n.arg);
    case 'neg': return cuentaOperaciones(n.arg);
    case 'pot': return 1 + cuentaOperaciones(n.base);
    default: return 0;
  }
}

function hastaQueValga(rng, hacer, opciones) {
  for (let i = 0; i < 5000; i++) {
    const texto = hacer(rng);
    if (valida(texto, opciones)) return texto;
  }
  throw new Error('No se encuentra una expresión válida');
}

// ─── Generadores ──────────────────────────────────────────────────────────────────

/** Una expresión de los grupos pedidos; 30 % lleva un negativo (el primero o un factor). */
function expresionAzar(rng, grupos) {
  const grupo = rng.elegir(grupos);
  const forma = rng.elegir(FORMAS[grupo]);
  const posibles = negables(forma);
  const negativo = rng.azar() < 0.32 ? rng.elegir(posibles) : -1;
  return rellenar(forma, rng, negativo);
}

/** Ítem de los ejercicios 1 y 2: { texto }. Mitad sin paréntesis, mitad con uno; en el 1, algo de cadenas. */
export function generarPrimero(rng) {
  const grupos = ['sin', 'sin', 'sin', 'con', 'con', 'con', 'cadena'];
  return { texto: hastaQueValga(rng, r => expresionAzar(r, grupos)) };
}
export function generarPasos(rng) {
  return { texto: hastaQueValga(rng, r => expresionAzar(r, ['sin', 'sin', 'con', 'con'])) };
}

// ─── Toques ───────────────────────────────────────────────────────────────────────

export const arbolDe = texto => analizar(texto);

/**
 * ¿Qué pasa si el alumno toca la operación de `ruta`? Si vale: { valido: true, paso }. Si no:
 * { valido: false, error, canonico } con el paso que sí tocaba y el id del error:
 * 'derecha-a-izquierda' (tocó la segunda de una cadena del mismo nivel) o 'izquierda-a-derecha'
 * (tocó una operación sin respetar la jerarquía ni el paréntesis).
 */
export function clasificarToque(arbol, ruta) {
  const paso = pasosPosibles(arbol).find(p => p.ruta === ruta);
  if (paso) return { valido: true, paso };
  const nodo = nodoEn(arbol, ruta);
  // «De derecha a izquierda» solo si la operación de la izquierda, del mismo nivel, se podía hacer ya.
  const rutaIzq = ruta ? `${ruta}.izq` : 'izq';
  const cadena = nodo?.tipo === 'op' && nodo.izq.tipo === 'op' && NIVEL[nodo.izq.op] === NIVEL[nodo.op]
    && pasosPosibles(arbol).some(p => p.ruta === rutaIzq);
  return { valido: false, error: cadena ? 'derecha-a-izquierda' : 'jerarquia-olvidada', canonico: pasoCanonico(arbol) };
}

export const primerosPasos = arbol => pasosPosibles(arbol).map(p => p.operacion);
export const rutasPrimeras = arbol => pasosPosibles(arbol).map(p => p.ruta);

/** ¿Es el último paso (el que deja un solo número)? */
export const esUltimo = (arbol, paso) => valorLiteral(aplicarPaso(arbol, paso)) !== null;

// ─── Opciones de resultado de un paso ─────────────────────────────────────────────

const hash = s => [...s].reduce((h, c) => (Math.imul(h, 31) + c.codePointAt(0)) >>> 0, 7);
const claveDe = f => f.clave();

/** Candidatos [id, …argumentos] de ERRORES_TIPICOS para el resultado de un paso. */
function candidatosDe(paso) {
  const { op, a, b, valor } = paso;
  if (paso.tipo !== 'op') return [];
  const natural = x => x.den === 1;
  if (op === '+') {
    const c = [['suma-arriba-y-abajo', a, b], ['en-cruz-al-sumar', a, b], ['suma-multiplicando-denominadores', a, b],
      ['suma-solo-cambia-denominador', a, b, '+'], ['signo-del-primero', a, b, '+']];
    // Con un natural, «sumar al numerador» y «multiplicar denominadores» dan el mismo valor: manda el natural.
    if (natural(a) && !natural(b)) c.unshift(['natural-al-numerador', a.num, b, '+']);
    if (natural(b) && !natural(a)) c.unshift(['natural-al-numerador', b.num, a, '+']);
    return c;
  }
  if (op === '-') {
    const c = [['resta-arriba-y-abajo', a, b], ['en-cruz-al-sumar', a, b], ['suma-solo-cambia-denominador', a, b, '-'],
      ['signo-perdido', valor], ['signo-del-primero', a, b, '-']];
    if (natural(a) && !natural(b) && a.num > 0) c.push(['natural-al-numerador', a.num, b, '-']);
    return c;
  }
  if (op === '*') {
    const c = [['producto-denominador-comun', a, b], ['multiplica-en-cruz', a, b], ['multiplica-sumando-denominadores', a, b],
      ['suma-en-vez-de-multiplicar', a, b], ['signo-perdido', valor]];
    if (natural(a) && !natural(b)) c.push(['natural-por-ambos', a.num, b]);
    if (natural(b) && !natural(a)) c.push(['natural-por-ambos', b.num, a]);
    return c;
  }
  return [['invierte-la-primera', a, b], ['no-invierte', a, b], ['invierte-las-dos', a, b], ['signo-perdido', valor]];
}

/** Errores propios de la práctica: confundir la operación (sumar en vez de restar, de dividir…). */
function confusionDe(paso) {
  const { op, a, b } = paso;
  if (paso.tipo !== 'op') return null;
  if (op === '+') return { valor: a.multiplicar(b), error: 'confunde-la-operacion' };
  if (op === '-') return { valor: a.sumar(b), error: 'confunde-la-operacion' };
  if (op === ':') return { valor: a.sumar(b), error: 'confunde-la-operacion' };
  return null;
}

const utilizable = f => f && Math.abs(f.num) <= 2000 && f.den <= 2000;

/**
 * Las opciones al preguntar cuánto vale un paso: { correcta, falsas: [{ valor, error }] } con 2 o
 * 3 falsas, todas irreducibles, distintas de la buena y entre sí POR VALOR, y cada una de un error
 * con nombre. Determinista (semilla sacada del paso). `original` se conserva por compatibilidad:
 * la trampa de ir de izquierda a derecha ya no se ofrece como opción de un paso (la app hace
 * respetar el orden al tocar; la trampa vive en los ejercicios 1 y 3).
 */
export function opcionesDePaso(arbol, paso, original = null) {
  const correcta = paso.valor;
  const rng = crearRng(hash(`${aTextoExpresion(arbol)}|${paso.ruta}`));
  const vistas = new Set([claveDe(correcta)]);
  const falsas = [];
  const meter = x => {
    if (!x || !utilizable(x.valor)) return;
    const valor = x.valor.simplificar();
    if (vistas.has(claveDe(valor))) return;
    vistas.add(claveDe(valor));
    falsas.push({ valor, error: x.error });
  };
  const resto = [...distractores(candidatosDe(paso), correcta), confusionDe(paso)].filter(Boolean);
  const [signo, ...otras] = [resto.find(x => x.error === 'signo-perdido'), ...resto.filter(x => x.error !== 'signo-perdido')];
  rng.barajar(otras).forEach(meter);
  meter(signo);
  return { correcta, falsas: falsas.slice(0, 3) };
}

/** Todas las opciones ordenadas de menor a mayor por valor: [{ valor, error }] con error null en la buena. */
export function opcionesOrdenadas(opciones) {
  const comparar = (x, y) => x.valor.num * y.valor.den - y.valor.num * x.valor.den;
  return [{ valor: opciones.correcta, error: null }, ...opciones.falsas].sort(comparar);
}

// ─── Ejercicio 3: caza el error ───────────────────────────────────────────────────

/**
 * Operar de izquierda a derecha sin respetar la jerarquía: el estado que resulta de hacer la
 * primera operación «en fila» y no la que tocaba. Devuelve { arbol, operacion } o null si esa
 * operación sí era válida (era independiente) o si el valor de toda la expresión no cambia.
 */
export function pasoDeOrdenEquivocado(arbol) {
  const lineal = analizar(aTextoExpresion(arbol), { sinJerarquia: true });
  const paso = pasosPosibles(lineal, { cadenas: false })[0];
  if (!paso) return null;
  if (pasosPosibles(arbol).some(p => p.operacion === paso.operacion)) return null;
  const nuevo = analizar(aTextoExpresion(aplicarPaso(lineal, paso)));
  try {
    if (evaluar(nuevo).equals(evaluar(arbol))) return null;
  } catch (e) {
    if (e instanceof ErrorFracciones) return null;
    throw e;
  }
  return { arbol: nuevo, operacion: paso.operacion };
}

/** Sigue con los pasos canónicos hasta un solo número; null si en algún paso se sale de cota. */
function terminar(arbol) {
  const estados = [arbol];
  let x = arbol;
  for (let i = 0; i < 10 && valorLiteral(x) === null; i++) {
    const paso = pasoCanonico(x);
    if (!paso || paso.valor.num === 0 || !dentroDeCota(paso.valor)) return null;
    x = aplicarPaso(x, paso);
    estados.push(x);
  }
  return valorLiteral(x) === null ? null : estados;
}

/**
 * Ítem del ejercicio 3: { lineas: [texto, …], linea, tipo, error, operacion, bueno }.
 *  - `lineas[0]` es la expresión y `lineas[k]` el resultado del paso k; el último es un número.
 *  - `linea`: índice (≥ 1) de la línea mal hecha; `tipo`: 'orden' (se hizo una operación que no
 *    tocaba) o 'calculo' (la operación era la que tocaba, pero está mal hecha).
 *  - `error`: el id del error típico; `operacion`: la operación de ese paso, como texto;
 *    `bueno`: la línea que tocaba, como texto, y `canonica`: la operación que tocaba.
 * Solo una línea está mal; las siguientes se calculan bien a partir de la mala.
 */
export function generarError(rng) {
  // El tipo se sortea una sola vez: si se sortease en cada intento, el de orden (que falla más
  // veces porque no siempre hay un orden equivocado que cambie el valor) saldría de menos.
  const deOrden = rng.azar() < 0.5;
  for (let intento = 0; intento < 5000; intento++) {
    const texto = hastaQueValga(rng, r => expresionAzar(r, ['sin', 'sin', 'con', 'con']), { maxOperaciones: 3 });
    const buenos = terminar(analizar(texto));
    if (!buenos || buenos.length < 3) continue;
    const k = rng.entero(0, buenos.length - 2);           // se falla al hacer el paso k+1
    const antes = buenos[k];
    const canonico = pasoCanonico(antes);
    let malo;
    if (deOrden) {
      const orden = pasoDeOrdenEquivocado(antes);
      if (!orden) continue;
      malo = { tipo: 'orden', arbol: orden.arbol, error: 'izquierda-a-derecha', operacion: orden.operacion };
    } else {
      const falsa = rng.elegir(opcionesDePaso(antes, canonico).falsas);
      if (!falsa) continue;
      malo = {
        tipo: 'calculo', error: falsa.error, operacion: canonico.operacion,
        arbol: aplicarPaso(antes, { ...canonico, valor: falsa.valor }),
      };
    }
    const resto = terminar(malo.arbol);
    if (!resto) continue;
    const estados = [...buenos.slice(0, k + 1), ...resto];
    const lineas = estados.map(e => aTextoExpresion(e));
    if (new Set(lineas).size !== lineas.length) continue;
    return {
      lineas, linea: k + 1, tipo: malo.tipo, error: malo.error, operacion: malo.operacion,
      bueno: aTextoExpresion(buenos[k + 1]), canonica: canonico.operacion, valorBueno: canonico.valor.clave(),
    };
  }
  throw new Error('No se encuentra un ítem de caza el error');
}

/**
 * Recalcula, para un ítem, qué le pasa a cada línea sin fiarse de sus datos: 'bien' (es el resultado de
 * una operación que podía hacerse ya), 'orden' (es el de operar en fila, sin jerarquía) o 'calculo' (tiene
 * una operación menos que la anterior pero no es ninguna de las dos). Sirve al test.
 */
export function diagnosticar(item) {
  return item.lineas.slice(1).map((linea, i) => {
    const antes = analizar(item.lineas[i]);
    if (pasosPosibles(antes).some(p => aTextoExpresion(aplicarPaso(antes, p)) === linea)) return 'bien';
    const enFila = pasoDeOrdenEquivocado(antes);
    if (enFila && aTextoExpresion(enFila.arbol) === linea) return 'orden';
    return cuentaOperaciones(linea) === cuentaOperaciones(antes) - 1 ? 'calculo' : 'raro';
  });
}

export { ERRORES_TIPICOS };
