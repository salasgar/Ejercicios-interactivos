// Práctica «¿Qué se hace primero? Con enteros»: lógica pura (sin DOM ni red), probada
// por fuerza bruta en `tests/practicas-jerarquia-enteros.test.js`. Los generadores
// devuelven DATOS (el texto de la expresión), nunca HTML ni funciones.
//
// Cotas (no hay contexto: son de tamaño, para que las cuentas se hagan de cabeza):
// resultado final entre −100 y 100; todo resultado intermedio, en cualquier orden
// válido de pasos, entre −200 y 200 y distinto de 0; divisiones exactas; factores de
// 2 a 9; bases de potencia de 2 a 6 (cubos, de 2 a 4).
//
// Forma de una expresión: `texto` se escribe con U+2212 y `·`; un negativo que no va
// el primero va entre paréntesis (`3 + 4 · (−2)`). Ningún paréntesis envuelve una
// operación, salvo el de U3-3C-20 (`30 : (−5 · 2)`) en los pares del ejercicio 3.

import { crearRng } from '../_comun/rng.js';
import {
  MENOS, fmt, fmtPar, analizar, evaluar, aTexto, pasosPosibles, aplicarPaso, pasoCanonico,
  valorLiteral, nodoEn, NIVEL, ERRORES_TIPICOS, distractores, sinJerarquia, derechaAIzquierda,
} from '../_comun/enteros.js';

export const MAX_FINAL = 100;
export const MAX_PASO = 200;

const SUPERINDICE = { 2: '²', 3: '³' };

// ─── Escritura ────────────────────────────────────────────────────────────────────

/** Un entero como operando: el negativo que no va el primero, entre paréntesis. */
const t = (n, primero = false) => (primero ? fmt(n) : fmtPar(n));
const pot = (b, n) => `${fmtPar(b)}${SUPERINDICE[n]}`;
const signoAlAzar = (rng, n) => (rng.azar() < 0.5 ? -n : n);

// ─── Comprobación de un ítem ──────────────────────────────────────────────────────

/** ¿Vale la expresión? Final en ±100 y, en todos los órdenes válidos, pasos en ±200 y distintos de 0. */
export function valida(texto) {
  let arbol;
  try { arbol = analizar(texto); } catch { return false; }
  let final;
  try { final = evaluar(arbol); } catch { return false; }
  if (final === 0 || Math.abs(final) > MAX_FINAL) return false;
  const visto = new Set();
  const explorar = x => {
    const clave = aTexto(x);
    if (visto.has(clave)) return true;
    visto.add(clave);
    if (visto.size > 300) return false;
    if (valorLiteral(x) !== null) return true;
    const pasos = pasosPosibles(x);
    if (!pasos.length) return false;
    return pasos.every(p => p.valor !== 0 && Math.abs(p.valor) <= MAX_PASO
      && opcionesDePaso(x, p).falsas.length >= 2 && explorar(aplicarPaso(x, p)));
  };
  return explorar(arbol);
}

/** Repite un generador de texto hasta que la expresión valga. */
function hastaQueValga(rng, hacer) {
  for (;;) {
    const texto = hacer(rng);
    if (valida(texto)) return texto;
  }
}

// ─── Piezas de las expresiones ────────────────────────────────────────────────────

/** Un factor de 2 a 9, con signo al azar. */
const factor = rng => signoAlAzar(rng, rng.entero(2, 9));
/** Un término suelto de 1 a 20. Detrás de un + o un − va siempre sin signo (el signo está en el operador). */
const termino = rng => rng.entero(1, 20);
/** El primer término de una expresión: puede ser negativo (−5 + 4 · 3). */
const primerTermino = rng => signoAlAzar(rng, rng.entero(1, 20));
const baseDe = (rng, n) => signoAlAzar(rng, n === 3 ? rng.entero(2, 4) : rng.entero(2, 6));

/** «B · C» o «B : C» (cociente exacto), como pareja de textos para pegar tras un operador. */
function productoOCociente(rng, primero) {
  if (rng.azar() < 0.65) return { texto: `${t(factor(rng), primero)} · ${t(factor(rng))}`, op: '·' };
  const d = rng.entero(2, 5), q = rng.entero(2, 9);
  return { texto: `${t(signoAlAzar(rng, d * q), primero)} : ${t(signoAlAzar(rng, d))}`, op: ':' };
}

/** Una potencia suelta: b², b³, (−b)², (−b)³ y, solo al principio de la expresión, −b². */
function potenciaSuelta(rng, primero) {
  const n = rng.azar() < 0.7 ? 2 : 3;
  if (primero && rng.azar() < 0.25) return `${MENOS}${rng.entero(2, n === 3 ? 4 : 6)}${SUPERINDICE[n]}`;
  return pot(baseDe(rng, n), n);
}

// ─── Ejercicio 2: un producto, un cociente o una potencia dentro de una suma ──────

/** Producto o cociente dentro de una suma o resta: A + B · C, A − B : C, A · B + C… */
function formaProducto(rng) {
  const sumar = rng.azar() < 0.5 ? '+' : MENOS;
  if (rng.azar() < 0.5) return `${t(primerTermino(rng), true)} ${sumar} ${productoOCociente(rng, false).texto}`;
  return `${productoOCociente(rng, true).texto} ${sumar} ${termino(rng)}`;
}

/** Potencia dentro de una suma o resta: A + P, A − P, P + A, P − A. */
function formaPotencia(rng) {
  const sumar = rng.azar() < 0.5 ? '+' : MENOS;
  if (rng.azar() < 0.5) return `${t(primerTermino(rng), true)} ${sumar} ${potenciaSuelta(rng, false)}`;
  return `${potenciaSuelta(rng, true)} ${sumar} ${termino(rng)}`;
}

/** Ítem: { texto }. La mitad con un producto o cociente, la mitad con una potencia. */
export function generarMezcla(rng) {
  const texto = hastaQueValga(rng, r => (r.azar() < 0.5 ? formaProducto(r) : formaPotencia(r)));
  return { texto };
}

// ─── Ejercicio 3: cadenas de · y : ────────────────────────────────────────────────

/** De 4 a 5 números unidos por · y :, de izquierda a derecha, con todas las divisiones exactas. */
function cadenaAzar(rng) {
  const n = rng.entero(4, 5);
  let actual = signoAlAzar(rng, rng.entero(2, 12));
  let texto = t(actual, true);
  for (let i = 1; i < n; i++) {
    const divisores = [2, 3, 4, 5, 6, 8, 9].filter(d => Math.abs(actual) % d === 0 && Math.abs(actual) !== d);
    if (divisores.length && rng.azar() < 0.45) {
      const d = signoAlAzar(rng, rng.elegir(divisores));
      texto += ` : ${t(d)}`;
      actual /= d;
    } else {
      const m = factor(rng);
      texto += ` · ${t(m)}`;
      actual *= m;
    }
  }
  return texto;
}

/** El par de U3-3C-20: `A : (B) · C` frente a `A : (B · C)`, los dos exactos. */
function parAzar(rng) {
  const b = signoAlAzar(rng, rng.entero(2, 6));
  const c = signoAlAzar(rng, rng.entero(2, 6));
  const a = signoAlAzar(rng, Math.abs(b * c) * rng.entero(1, 3));
  return { sin: `${t(a, true)} : ${t(b)} · ${t(c)}`, con: `${t(a, true)} : (${t(b, true)} · ${t(c)})` };
}

/** Ítem: { tipo: 'cadena', texto } o { tipo: 'par', sin, con } (dos de cada cinco son pares). */
export function generarCadena(rng) {
  if (rng.azar() < 0.4) {
    for (;;) {
      const par = parAzar(rng);
      if (valida(par.sin) && valida(par.con) && evaluar(par.sin) !== evaluar(par.con)) return { tipo: 'par', ...par };
    }
  }
  return { tipo: 'cadena', texto: hastaQueValga(rng, cadenaAzar) };
}

/** Los dos valores de un par: [sin paréntesis que agrupe, con él]. */
export const valoresDelPar = item => [evaluar(item.sin), evaluar(item.con)];

/** Id del error de quien se equivoca en un par: usa el mismo valor en los dos, o solo ignora el paréntesis. */
export function errorPar(item, i, valor) {
  const buenos = valoresDelPar(item);
  if (i === 1 && valor === buenos[0]) return 'ignora-el-parentesis';
  if (i === 0 && valor === buenos[1]) return 'ignora-el-parentesis';
  if (valor === -buenos[i]) return 'signo-cambiado';
  return 'otro-error-cadena';
}

// ─── Ejercicio 4 (y parte del 1): combinadas ──────────────────────────────────────

/** Potencias, productos y sumas juntas, sin paréntesis que envuelvan operaciones. */
function combinadaAzar(rng) {
  const n = rng.azar() < 0.75 ? 2 : 3;
  const base = () => pot(baseDe(rng, n), n);
  const sumar = rng.azar() < 0.5 ? '+' : MENOS;
  const a = t(primerTermino(rng), true);        // primer término: puede ir sin paréntesis
  const primerFactor = t(factor(rng), true);
  const otroFactor = t(factor(rng));            // un factor que no va el primero
  const c = t(factor(rng));
  const formas = [
    () => `${a} ${sumar} ${otroFactor} · ${base()}`,
    () => `${a} ${sumar} ${base()} · ${c}`,
    () => `${base()} ${sumar} ${t(factor(rng))} · ${c}`,
    () => `${primerFactor} · ${base()} ${sumar} ${termino(rng)}`,
    () => `${a} ${sumar} ${base()} : ${t(signoAlAzar(rng, rng.elegir(n === 2 ? [2, 4] : [2, 4, 8])))}`,
  ];
  return rng.elegir(formas)();
}

/** Ítem: { texto }. */
export function generarCombinada(rng) {
  return { texto: hastaQueValga(rng, combinadaAzar) };
}

// ─── Ejercicio 1: ¿qué va primero? ────────────────────────────────────────────────

/**
 * Ítem: { texto }. Producto o cociente en una suma (40 %), potencia en una suma (35 %) y cadena (25 %).
 * Sin combinadas (potencia, producto y suma juntos): son de la sesión 13 (U3-4A-02) y la práctica
 * se publica en la semana 3 (decisión de Juan Luis, 25-10).
 */
export function generarPrimero(rng) {
  const r = rng.azar();
  if (r < 0.4) return { texto: hastaQueValga(rng, formaProducto) };
  if (r < 0.75) return { texto: hastaQueValga(rng, formaPotencia) };
  return { texto: hastaQueValga(rng, cadenaAzar) };
}

// ─── Pasos y toques ───────────────────────────────────────────────────────────────

export const arbolDe = texto => analizar(texto);

/**
 * ¿Qué pasa si el alumno toca la operación de `ruta`? Si vale: { valido: true, paso }.
 * Si no: { valido: false, error, canonico } con el paso que sí tocaba y el id del error:
 * 'derecha-a-izquierda' (tocó la segunda de una cadena del mismo nivel) o 'sin-jerarquia'.
 */
export function clasificarToque(arbol, ruta) {
  const paso = pasosPosibles(arbol).find(p => p.ruta === ruta);
  if (paso) return { valido: true, paso };
  const nodo = nodoEn(arbol, ruta);
  const cadena = nodo?.tipo === 'op' && nodo.izq.tipo === 'op' && NIVEL[nodo.izq.op] === NIVEL[nodo.op];
  return { valido: false, error: cadena ? 'derecha-a-izquierda' : 'sin-jerarquia', canonico: pasoCanonico(arbol) };
}

/** Las operaciones que valen para empezar, como texto (para decir cuáles podían ir primero). */
export const primerosPasos = arbol => pasosPosibles(arbol).map(p => p.operacion);

/** Las rutas de esas mismas operaciones (la `data-ruta` de su marca en pantalla). */
export const rutasPrimeras = arbol => pasosPosibles(arbol).map(p => p.ruta);

/** ¿Es el último paso (el que deja un solo número)? */
export const esUltimo = (arbol, paso) => valorLiteral(aplicarPaso(arbol, paso)) !== null;

// ─── Opciones de resultado de un paso ─────────────────────────────────────────────

const hash = s => [...s].reduce((h, c) => (Math.imul(h, 31) + c.codePointAt(0)) >>> 0, 7);

/** Lo que saldría tomando −b² por (−b)²: el valor de toda la expresión con ese error, o null. */
export function trampaMenosEnLaBase(arbol) {
  let cambiado = false;
  const cambiar = n => {
    switch (n.tipo) {
      case 'neg':
        if (n.arg.tipo === 'pot' && n.arg.base.tipo === 'num') {
          cambiado = true;
          return { tipo: 'pot', base: { tipo: 'par', forma: '(', arg: { tipo: 'neg', arg: n.arg.base } }, exp: n.arg.exp };
        }
        return { ...n, arg: cambiar(n.arg) };
      case 'pos': case 'par': return { ...n, arg: cambiar(n.arg) };
      case 'pot': return { ...n, base: cambiar(n.base) };
      case 'op': return { ...n, izq: cambiar(n.izq), der: cambiar(n.der) };
      default: return n;
    }
  };
  const nuevo = cambiar(arbol);
  if (!cambiado) return null;
  try { return evaluar(nuevo); } catch { return null; }
}

/** Las trampas de toda la expresión: lo que sale con un error que afecta al resultado final. */
export function trampasFinales(arbol) {
  const lista = [];
  const meter = (error, valor) => { if (valor !== null && valor !== undefined) lista.push({ valor, error }); };
  meter('sin-jerarquia', sinJerarquia(arbol));
  meter('derecha-a-izquierda', derechaAIzquierda(arbol));
  meter('menos-en-la-base', trampaMenosEnLaBase(arbol));
  return lista;
}

/** Candidatos [id, …argumentos] de ERRORES_TIPICOS para el resultado de un paso. */
function candidatosDe(paso) {
  const { op, a, b } = paso;
  if (paso.tipo === 'pot') {
    return [['potencia-par-negativa', a, b], ['potencia-impar-positiva', a, b], ['base-por-exponente', a, b],
      ['potencia-positiva-negativa', a, b], ['signo-cambiado', paso.valor]];
  }
  if (op === '+') {
    return [['regla-signos-en-suma', a, b], ['suma-valores-absolutos', a, b], ['olvida-el-signo', a, b],
      ['signo-del-primero', a, b], ['sumar-negativo', a, b], ['signo-cambiado', paso.valor]];
  }
  if (op === '-') {
    return [['regla-signos-en-suma', a, -b], ['suma-valores-absolutos', a, -b], ['olvida-el-signo', a, -b],
      ['signo-del-primero', a, -b], ['restar-negativo', a, b], ['mismo-signo-dos-veces', a, b], ['signo-cambiado', paso.valor]];
  }
  if (op === '*') return [['signo-del-mayor-producto', a, b], ['signo-cambiado', paso.valor]];
  return [['signo-del-mayor-cociente', a, b], ['signo-cambiado', paso.valor]];
}

/** Errores propios de la práctica: confundir la operación (suma en vez de producto…). */
function confusionDe(paso) {
  const { op, a, b } = paso;
  if (paso.tipo === 'pot') return { valor: a * b, error: 'base-por-exponente' };
  if (op === '*') return { valor: a + b, error: 'confunde-la-operacion' };
  if (op === ':') return { valor: a * b, error: 'confunde-la-operacion' };
  return { valor: a * b, error: 'confunde-la-operacion' };
}

/**
 * Las opciones al preguntar cuánto vale un paso: { correcta, falsas: [{ valor, error }] }
 * con 2 o 3 falsas, todas distintas de la buena y cada una de un error con nombre.
 * Si el paso es el último, las trampas de toda la expresión van delante. Determinista
 * (se sortea con una semilla sacada del paso), para que el mismo ítem dé las mismas opciones.
 */
export function opcionesDePaso(arbol, paso, original = null) {
  const correcta = paso.valor;
  const rng = crearRng(hash(`${aTexto(arbol)}|${paso.ruta}`));
  const trampas = original && esUltimo(arbol, paso) ? trampasFinales(original).filter(x => x.valor !== correcta && Math.abs(x.valor) <= 400) : [];
  const falsas = [];
  const vistas = new Set([correcta]);
  const meter = x => {
    if (x && !vistas.has(x.valor) && Math.abs(x.valor) <= 400) { vistas.add(x.valor); falsas.push(x); }
  };
  trampas.forEach(meter);
  const resto = [...distractores(candidatosDe(paso), correcta), confusionDe(paso)];
  const [signo, ...otras] = [resto.find(x => x.error === 'signo-cambiado'), ...resto.filter(x => x.error !== 'signo-cambiado')];
  rng.barajar(otras).forEach(meter);
  meter(signo);
  return { correcta, falsas: falsas.slice(0, 3) };
}

/** Todas las opciones, ordenadas de menor a mayor: [{ valor, error }] con error null en la buena. */
export function opcionesOrdenadas(opciones) {
  return [{ valor: opciones.correcta, error: null }, ...opciones.falsas].sort((x, y) => x.valor - y.valor);
}

export { ERRORES_TIPICOS };
