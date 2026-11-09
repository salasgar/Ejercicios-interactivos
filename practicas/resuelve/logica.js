// Práctica «Resuelve» de la unidad 6 (Algebra): lógica pura (sin DOM ni red). PU2, tarea 150.
// Cuatro ejercicios (semana 3, sesión 9; el 2 también trae «reducir antes de resolver», de la sesión 7):
//   1. El primer paso     ax + b = cx + d: elegir entre cuatro líneas la que pasa bien los términos
//   2. Paso a paso        tres huecos en cadena: Ax = C, y después x = solución
//   3. Resuélvela         escribir la solución (o elegirla entre cuatro, salvo x = 0)
//   4. ¿Está bien resuelta?  tocar el paso malo de una resolución de tres pasos (un tercio, sin error)
//
// Un ítem es DATOS (números sueltos, sin funciones ni HTML). Un término es { c, x, d? }: coeficiente
// entero (o c/d si hay denominador, solo en la línea final «x = 3/2») y si lleva x. Toda cuenta es
// exacta con `Fraccion` (nunca coma flotante) y todo error lleva nombre y se calcula con los números
// del ítem; ninguna opción vale lo mismo que otra POR SOLUCIÓN.

import {
  Ecuacion, termino, huellaCanonica, leerExpresion, distractores, deEcuacion,
  transponerSinSigno, pasarFactorRestando, multiplicarEnVezDeDividir, invertirCoeficiente, signoAlDividir, signoDeLaSolucion,
  ERRORES_TIPICOS, terminosATexto,
} from '../_comun/algebra.js';
import { Fraccion, fraccion } from '../_comun/fracciones.js';

// --- Cotas (regla 7: nada de contextos, pero los números tienen que ser razonables) --------------
export const COEF_MAX = 9;          // |coeficiente de x| ≤ 9
export const NUM_MAX = 12;          // |número suelto| ≤ 12 (en «dos miembros»)
export const NUM_MAX_REDUCIR = 40;  // el número del otro miembro en «reducir» (2x + 3x = 20)
export const SOL_ENTERA_MAX = 12;   // |solución entera| ≤ 12
export const SOL_NUM_MAX = 20;      // fracción: |numerador| ≤ 20 y denominador ≤ 9
export const SOL_DEN_MAX = 9;

export const ERRORES_PROPIOS = {
  'x-sin-signo': { nombre: { es: 'Ha pasado el término con x al otro miembro sin cambiarle el signo', en: 'Moved the term with x to the other side without changing its sign' } },
  'numero-sin-signo': { nombre: { es: 'Ha pasado el número al otro miembro sin cambiarle el signo', en: 'Moved the number to the other side without changing its sign' } },
  'pierde-un-termino': { nombre: { es: 'Ha perdido un término al pasarlo al otro miembro', en: 'Lost a term when moving it to the other side' } },
  'reduce-mal-las-x': { nombre: { es: 'Ha sumado mal los coeficientes de la x (sin respetar el signo)', en: 'Added the coefficients of x wrongly (ignoring the signs)' } },
  'reduce-mal-los-numeros': { nombre: { es: 'Ha sumado mal los números (sin respetar el signo)', en: 'Added the numbers wrongly (ignoring the signs)' } },
  'otra-respuesta': { nombre: { es: 'Ha dado otro número', en: 'Gave a different number' } },
  'no-ve-el-error': { nombre: { es: 'No ha visto el paso con el error', en: 'Did not spot the step with the mistake' } },
  've-error-donde-no-lo-hay': { nombre: { es: 'Ha marcado como malo un paso que está bien', en: 'Marked a correct step as wrong' } },
};

/** El nombre de un error (propio o de `algebra.js`), o null. */
export const nombreDe = id => ERRORES_PROPIOS[id]?.nombre ?? ERRORES_TIPICOS[id]?.nombre ?? null;

// --- Casos que se dejan libres para la hoja (en claro) y para los exámenes (por huella FNV-1a) -----
// Al escribir esta práctica no existían ni la hoja ni el examen de la semana 3 de la unidad 6 (se dice en
// la ENTREGA): la tarea de publicación de su semana los coteja y rellena estas dos listas. La hoja va en
// claro, como ecuaciones tecleadas; el examen, SOLO como huella de la forma canónica de la ecuación
// (`huellaCanonica`, calculada fuera del repositorio), nunca en claro: el repositorio es público.
export const CASOS_HOJA = [];
export const HUELLAS_EXAMEN = new Set();

// Los ejemplos de las introducciones (textos.js) tampoco salen como ítem.
export const EJEMPLOS_INTRO = ['6x − 2 = 2x + 14', '4x − 3 = 7x − 18'];

const clavesHoja = new WeakMap();
function clavesDe(lista) {
  const guardado = clavesHoja.get(lista);
  if (guardado && guardado.n === lista.length) return guardado.claves;
  const claves = new Set(lista.map(t => deEcuacion(t)?.clave()).filter(Boolean));
  clavesHoja.set(lista, { n: lista.length, claves });
  return claves;
}

/** ¿Es una ecuación de la hoja o del examen? (por forma canónica: el orden de los términos no cuenta). */
export function esReservada(ec, hoja = CASOS_HOJA, huellas = HUELLAS_EXAMEN) {
  return clavesDe(hoja).has(ec.clave()) || clavesDe(EJEMPLOS_INTRO).has(ec.clave()) || huellas.has(huellaCanonica(ec));
}

// --- Datos ↔ Ecuacion ---------------------------------------------------------------------------

const T = (c, x = false, d = 1) => (d === 1 ? { c, x } : { c, x, d });
const aTerminos = ts => ts.map(t => termino(fraccion(t.c, t.d ?? 1), t.x ? 'x' : null));

/** La Ecuacion de un ítem { izq, der }. */
export const ecDe = ({ izq, der }) => new Ecuacion(aTerminos(izq), aTerminos(der));

/** Los datos de una Ecuacion (los términos tal como están escritos). */
export function datosDe(ec) {
  const f = ts => ts.map(t => { const c = t.coef.simplificar(); return T(c.num, t.letra !== null, c.den); });
  return { izq: f(ec.terminosIzq), der: f(ec.terminosDer) };
}

/** La ecuación «Ax = C» ya reducida. */
export const ecuacionAC = (A, C) => new Ecuacion([termino(A, 'x')], [termino(C)]);

/** x = s */
export const ecuacionSolucion = s => new Ecuacion([termino(1, 'x')], [termino(s)]);

export const solucionDe = ec => {
  const s = ec.resolver();
  if (!(s instanceof Fraccion)) throw new Error('La ecuación no tiene una solución única');
  return s;
};

/** Los términos de una lista de datos, para escribirlos con `terminosAHtml`. */
export const terminosDe = aTerminos;

const datosSol = s => [s.num, s.den];
const solDeDatos = ([n, d]) => fraccion(n, d);

// --- Generar ecuaciones -------------------------------------------------------------------------

const nz = (rng, m) => { let v; do v = rng.entero(-m, m); while (v === 0); return v; };

const TIPOS_SOL = ['entera+', 'entera-', 'fraccion+', 'fraccion-', 'cero'];
const tipoSol = s => (s.num === 0 ? 'cero' : s.den === 1 ? (s.num > 0 ? 'entera+' : 'entera-') : (s.num > 0 ? 'fraccion+' : 'fraccion-'));
const solucionValida = s => (s.den === 1 ? Math.abs(s.num) <= SOL_ENTERA_MAX : s.den <= SOL_DEN_MAX && Math.abs(s.num) <= SOL_NUM_MAX);

function elegirTipoSol(rng, conCero) {
  const r = rng.azar() * (conCero ? 1 : 0.92);
  if (r < 0.28) return 'entera+';
  if (r < 0.52) return 'entera-';
  if (r < 0.66) return 'fraccion+';
  if (r < 0.92) return 'fraccion-';
  return 'cero';
}

/** Una constante, y a veces dos que suman lo mismo (3 − 2x + 7 en vez de 10 − 2x). */
function constantes(rng, n, cortar) {
  if (n === 0) return [];
  if (cortar && rng.azar() < 0.35) {
    const p = nz(rng, NUM_MAX), resto = n - p;
    if (resto !== 0 && Math.abs(resto) <= NUM_MAX) return [T(p), T(resto)];
  }
  return [T(n)];
}

/** Un miembro con x y números en el orden que toque (la x primero casi siempre). */
function miembro(rng, xCoef, numeros) {
  const lista = [...numeros];
  lista.splice(rng.azar() < 0.65 ? 0 : rng.entero(0, lista.length), 0, T(xCoef, true));
  return lista;
}

/** «ax + b = cx + d»: la x en los dos miembros. `minA` es el mínimo de |a − c|. */
function muestraDos(rng, tipoObjetivo, minA) {
  for (let i = 0; i < 50000; i++) {
    const a = nz(rng, COEF_MAX), c = nz(rng, COEF_MAX), b = nz(rng, NUM_MAX);
    const d = tipoObjetivo === 'cero' ? b : nz(rng, NUM_MAX);
    const A = a - c, C = d - b;
    if (Math.abs(A) < minA) continue;
    const s = fraccion(C, A).simplificar();
    if (!solucionValida(s) || (tipoObjetivo && tipoSol(s) !== tipoObjetivo)) continue;
    return { izq: miembro(rng, a, constantes(rng, b, rng.azar() < 0.4)), der: miembro(rng, c, constantes(rng, d, true)) };
  }
  throw new Error(`No sale una ecuación de tipo ${tipoObjetivo}`);
}

/** «2x + 3x = 20», «3x − x + 2 = 12»: las x se reducen en un miembro. */
function muestraReducir(rng, tipoObjetivo) {
  for (let i = 0; i < 50000; i++) {
    const n = rng.azar() < 0.65 ? 2 : 3;
    const cs = Array.from({ length: n }, () => nz(rng, COEF_MAX));
    const A = cs.reduce((s, c) => s + c, 0);
    if (Math.abs(A) < 2) continue;
    const k = rng.azar() < 0.5 ? 0 : nz(rng, NUM_MAX);
    const m = nz(rng, NUM_MAX_REDUCIR);
    const C = tipoObjetivo === 'cero' ? 0 : m - k;
    const rhs = tipoObjetivo === 'cero' ? k : m;
    const s = fraccion(C, A).simplificar();
    if (!solucionValida(s) || (tipoObjetivo && tipoSol(s) !== tipoObjetivo)) continue;
    const izq = cs.map(c => T(c, true));
    if (k !== 0) izq.splice(rng.entero(0, izq.length), 0, T(k));
    return { izq, der: [T(rhs)] };
  }
  throw new Error(`No sale una ecuación «reducir» de tipo ${tipoObjetivo}`);
}

// --- Ejercicio 1: el primer paso -----------------------------------------------------------------

const eqIgualSol = (a, b) => a.equivalente(b);

/** Las cuatro líneas del ejercicio 1 para una ecuación: la buena y los candidatos con su error. */
export function movimientos(ec) {
  const L = t => t.letra !== null;
  const noCero = t => t.coef.num !== 0;
  const xi = ec.terminosIzq.filter(L), ci = ec.terminosIzq.filter(t => !L(t) && noCero(t));
  const xd = ec.terminosDer.filter(L), cd = ec.terminosDer.filter(t => !L(t) && noCero(t));
  const neg = t => termino(t.coef.opuesta(), t.letra);
  return {
    xi, ci, xd, cd,
    buena: new Ecuacion([...xi, ...xd.map(neg)], [...cd, ...ci.map(neg)]),
    candidatos: [
      ['transponer-sin-signo', transponerSinSigno(ec)],
      ['x-sin-signo', new Ecuacion([...xi, ...xd], [...cd, ...ci.map(neg)])],
      ['numero-sin-signo', new Ecuacion([...xi, ...xd.map(neg)], [...cd, ...ci])],
      ['pierde-un-termino', new Ecuacion([...xi, ...xd.map(neg)], [...cd, ...ci.slice(0, -1).map(neg)])],
    ].filter(([, e]) => e !== null),
  };
}

/** Ítem: { izq, der, opciones: [{ izq, der, error }], buena }. Solo una opción es equivalente a la original. */
export function generarPrimerPaso(rng) {
  for (let i = 0; i < 2000; i++) {
    const datos = muestraDos(rng, elegirTipoSol(rng, false), 1);
    const ec = ecDe(datos);
    if (esReservada(ec)) continue;
    const m = movimientos(ec);
    const validos = [];
    for (const [error, e] of m.candidatos) {
      if (eqIgualSol(e, ec) || validos.some(v => eqIgualSol(v.e, e))) continue;
      validos.push({ error, e });
    }
    if (validos.length < 3) continue;
    const malos = rng.barajar(validos).slice(0, 3);
    const opciones = rng.barajar([{ error: null, e: m.buena }, ...malos]).map(({ error, e }) => ({ ...datosDe(e), error }));
    return { ...datos, opciones, buena: opciones.findIndex(o => o.error === null) };
  }
  throw new Error('No sale un ítem de «el primer paso»');
}

// --- Ejercicio 2: paso a paso --------------------------------------------------------------------

/** Ítem: { tipo: 'dos' | 'reducir', izq, der, A, C, sol: [num, den] }. Tres huecos: A, C y la solución. */
export function generarPasoAPaso(rng) {
  for (let i = 0; i < 2000; i++) {
    const tipoSolObj = elegirTipoSol(rng, true);
    const tipo = rng.azar() < 0.6 ? 'dos' : 'reducir';
    const datos = tipo === 'dos' ? muestraDos(rng, tipoSolObj, 2) : muestraReducir(rng, tipoSolObj);
    const ec = ecDe(datos);
    if (esReservada(ec)) continue;
    const { A, C } = ec.forma();
    if (Math.abs(A.num) < 2 || A.den !== 1 || C.den !== 1) continue;
    return { tipo, ...datos, A: A.num, C: C.num, sol: datosSol(solucionDe(ec)) };
  }
  throw new Error('No sale un ítem de «paso a paso»');
}

/** Las líneas que se ven antes de los huecos: la ecuación y, si hace falta, la que pasa los términos. */
export function lineasPrevias(item) {
  const ec = ecDe(item);
  const pasos = ec.pasos();
  const trans = pasos.find(p => p.tipo === 'transponer');
  return trans ? [ec, trans.ecuacion] : [ec];
}

/** ¿Cuál es el primer hueco mal? 'A', 'C' o 'sol'; null si los tres están bien. Valores: Fraccion o null. */
export function huecoMalo(item, { A, C, sol }) {
  if (A === null || !A.equals(item.A)) return 'A';
  if (C === null || !C.equals(item.C)) return 'C';
  if (sol === null || !sol.equals(solDeDatos(item.sol))) return 'sol';
  return null;
}

/** El nombre del error de un hueco mal (los de `ERRORES_TIPICOS` para la solución, con A y C buenos). */
export function errorHueco(item, hueco, valor) {
  if (hueco === 'A') return 'reduce-mal-las-x';
  if (hueco === 'C') return 'reduce-mal-los-numeros';
  return errorSolucion(ecuacionAC(item.A, item.C), valor);
}

// --- Ejercicio 3: resuélvela ---------------------------------------------------------------------

/** Lo que escribe el alumno: «3», «-5/2», «x = 1,5», «6/4». { ok: true, valor: Fraccion } o { ok: false, mensaje }. */
export function leerSolucion(texto) {
  const t = String(texto ?? '').replace(/^\s*x\s*=\s*/i, '');
  const r = leerExpresion(t);
  if (!r.ok) return { ok: false, motivo: r.motivo, mensaje: r.mensaje };
  if (!r.valor.esConstante()) {
    return { ok: false, motivo: 'no-es-numero', mensaje: { es: 'Escribe solo un número o una fracción, sin letras.', en: 'Write just a number or a fraction, with no letters.' } };
  }
  return { ok: true, valor: r.valor.b };
}

/** Los errores típicos de la solución de `ec` con sus valores: [[id, Fraccion], …] (sin repetir ni coincidir con la buena). */
export function erroresDeSolucion(ec) {
  const { A, C } = ec.forma();
  if (A.num === 0) return [];
  const s = solucionDe(ec);
  const eqAC = ecuacionAC(A, C);
  const candidatos = [
    ['transponer-sin-signo', ec],
    ['pasar-factor-restando', eqAC],
    ['multiplicar-en-vez-de-dividir', eqAC],
    ['invertir-coeficiente', eqAC],
    ['signo-al-dividir', eqAC],
    ['signo-de-la-solucion', ec],
  ];
  return distractores(candidatos.map(([id, e]) => [id, e]), s)
    .map(({ valor, error }) => [error, valor.resolver()])
    .filter(([, v]) => v instanceof Fraccion);
}

/** El nombre del error de una solución mal escrita (o 'otra-respuesta'). null si es la buena. */
export function errorSolucion(ec, valor) {
  const s = solucionDe(ec);
  if (valor.equals(s)) return null;
  const hit = erroresDeSolucion(ec).find(([, v]) => v.equals(valor));
  return hit ? hit[0] : 'otra-respuesta';
}

/**
 * Ítem: { modo: 'escribir' | 'elegir', izq, der, sol, opciones? }. Con x = 0 siempre se escribe (no hay
 * tres errores distintos que dar como opción). `opciones` (modo elegir): cuatro [num, den] distintos, con su error.
 */
export function generarResuelve(rng) {
  for (let i = 0; i < 2000; i++) {
    const objetivo = elegirTipoSol(rng, true);
    const datos = muestraDos(rng, objetivo, 1);
    const ec = ecDe(datos);
    if (esReservada(ec)) continue;
    const s = solucionDe(ec);
    const item = { modo: 'escribir', ...datos, sol: datosSol(s) };
    if (s.num !== 0 && rng.azar() < 0.4) {
      const candidatos = rng.barajar(erroresDeSolucion(ec));
      if (candidatos.length >= 3) {
        const malos = candidatos.slice(0, 3).map(([error, v]) => ({ v: datosSol(v), error }));
        const todos = rng.barajar([{ v: datosSol(s), error: null }, ...malos]);
        item.modo = 'elegir';
        item.opciones = todos.map(o => ({ num: o.v[0], den: o.v[1], error: o.error }));
      }
    }
    return item;
  }
  throw new Error('No sale un ítem de «resuélvela»');
}

export const solDe = item => solDeDatos(item.sol);

// --- Ejercicio 4: ¿está bien resuelta? -----------------------------------------------------------

/** Cómo se equivocaría cada paso (los candidatos de cada uno). */
function cadenaBuena(ec) {
  const pasos = ec.pasos();
  if (pasos.map(p => p.tipo).join() !== 'transponer,reducir,despejar') return null;
  return pasos.map(p => p.ecuacion);
}

/** Un paso 2 equivocado: la suma de los coeficientes o de los números sin respetar el signo. */
function reducirMal(p1, p2) {
  const sumaAbs = ts => ts.reduce((s, t) => s + Math.abs(t.coef.simplificar().num), 0);
  const x = p1.terminosIzq.filter(t => t.letra !== null), n = p1.terminosDer.filter(t => t.letra === null);
  const { A, C } = p2.forma();
  const candidatos = [];
  const A2 = sumaAbs(x), C2 = sumaAbs(n);
  if (A2 !== A.num) candidatos.push(['reduce-mal-las-x', ecuacionAC(A2, C.num)]);
  if (C2 !== C.num) candidatos.push(['reduce-mal-los-numeros', ecuacionAC(A.num, C2)]);
  return candidatos;
}

/**
 * Ítem: { lineas: [ec, paso1, paso2, paso3] (datos), malo: 0 | 1 | 2 | 3, error, correcta }.
 * `malo` es el paso que NO sale de la línea anterior (0 = ninguno); desde él, el resto sigue bien
 * a partir de su propia línea. `correcta`: la línea que tendría que ser en el paso malo (datos).
 */
export function generarResolucion(rng) {
  for (let i = 0; i < 3000; i++) {
    const datos = muestraDos(rng, elegirTipoSol(rng, false), 2);
    const ec = ecDe(datos);
    if (esReservada(ec)) continue;
    const buena = cadenaBuena(ec);
    if (!buena) continue;
    const [p1, p2, p3] = buena;
    const malo = rng.azar() < 1 / 3 ? 0 : rng.elegir([1, 2, 3]);
    let lineas = buena, error = null;
    if (malo === 1) {
      const cand = rng.barajar(movimientos(ec).candidatos).filter(([, e]) => !eqIgualSol(e, ec));
      for (const [id, e] of cand) {
        const resto = e.pasos();
        if (resto.map(p => p.tipo).join() !== 'reducir,despejar') continue;
        lineas = [e, resto[0].ecuacion, resto[1].ecuacion]; error = id; break;
      }
      if (!error) continue;
    } else if (malo === 2) {
      const cand = rng.barajar(reducirMal(p1, p2));
      for (const [id, e] of cand) {
        const resto = e.pasos();
        if (resto.map(p => p.tipo).join() !== 'despejar' || eqIgualSol(e, p1)) continue;
        lineas = [p1, e, resto[0].ecuacion]; error = id; break;
      }
      if (!error) continue;
    } else if (malo === 3) {
      const cand = rng.barajar([
        ['invertir-coeficiente', invertirCoeficiente(p2)], ['signo-al-dividir', signoAlDividir(p2)],
        ['pasar-factor-restando', pasarFactorRestando(p2)], ['multiplicar-en-vez-de-dividir', multiplicarEnVezDeDividir(p2)],
        ['signo-de-la-solucion', signoDeLaSolucion(p3)],
      ]).filter(([, e]) => e !== null && !eqIgualSol(e, p3));
      if (!cand.length) continue;
      lineas = [p1, p2, cand[0][1]]; error = cand[0][0];
    }
    // La cadena tiene que ser coherente: solo el paso malo rompe la equivalencia con la línea anterior.
    const todas = [ec, ...lineas];
    const rotos = [1, 2, 3].filter(k => !eqIgualSol(todas[k], todas[k - 1]));
    if (malo === 0 ? rotos.length !== 0 : rotos.length !== 1 || rotos[0] !== malo) continue;
    if (todas.some(e => !(e.resolver() instanceof Fraccion))) continue;
    return {
      lineas: todas.map(datosDe), malo, error,
      correcta: malo === 0 ? null : datosDe(buena[malo - 1]),
    };
  }
  throw new Error('No sale un ítem de «¿está bien resuelta?»');
}

export const lineasDeResolucion = item => item.lineas.map(ecDe);

// --- Ayudas para el feedback ---------------------------------------------------------------------

/** «3 − 5 = −2», «3 + 7 + 4 = 14»: la suma de un lado de la línea que pasa los términos. */
export function sumaDe(terminos) {
  return terminosATexto(terminos);
}

/** Las ecuaciones de la resolución completa de un ítem (para el feedback): [{ tipo, ecuacion, divisor? }]. */
export const resolucionDe = item => ecDe(item).pasos();

export { fraccion };
export { TIPOS_SOL, tipoSol };
