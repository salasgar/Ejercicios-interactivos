// Práctica «Sumas y restas con saltos» (PU2, tarea 83): lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS: listas de términos con su signo (`[−3, 8, −2]` es
// −3 + 8 − 2), números y textos, nunca HTML. Todo sin paréntesis (regla 1 de la unidad 3).
//
//   ej. 1  generarSalto    dos términos, de −10 a 10 (U3-1C-11, 12, 13)
//   ej. 2  generarSigno    dos términos, antes de calcular: ¿positivo o negativo? (U3-1C-14)
//   ej. 3  generarCadena   tres o cuatro términos; la mitad, contados con palabras (U3-1A-01, 1A-02)
//   ej. 4  generarTerminos de cuatro a seis términos; positivos aparte y negativos aparte
//                          (U3-1C-15, 2A-01, 2C-01, 2C-02, 2C-03)
//   ej. 5  generarProblema tres o cuatro movimientos en un contexto, con su cota (U3-2C-04)

import { fmt, evaluar, distractores, derechaAIzquierda } from '../_comun/enteros.js';

// ─── Términos ──────────────────────────────────────────────────────────────────

/** Lo que vale una lista de términos con su signo. */
export const valorDe = terminos => terminos.reduce((a, b) => a + b, 0);

/** `−3 + 8 − 2`: el primero con su signo (el menos, U+2212); los demás, `+` o `−` y el valor absoluto. */
export function textoDe(terminos) {
  return terminos.map((t, i) => (i === 0 ? fmt(t) : `${t < 0 ? '−' : '+'} ${Math.abs(t)}`)).join(' ');
}

/** Las sumas parciales de izquierda a derecha: [−3, 8, −2] → [−3, 5, 3]. */
export function parciales(terminos) {
  let acc = 0;
  return terminos.map(t => (acc += t));
}

/** Cierto si algún valor parcial (o el último) se sale de [min, max]. */
const fuera = (terminos, min, max) => parciales(terminos).some(p => p < min || p > max);

// ─── Ejercicio 1: salta en la recta ────────────────────────────────────────────

export const TIPOS_SALTO = ['resta', 'menos-mas', 'menos-menos'];
/** La recta de este ejercicio va de −10 a 10. */
export const LIMITE_RECTA = 10;

/** Ítem: { tipo, terminos: [x, y] }. Un tercio de cada tipo; el resultado, de −10 a 10 y nunca 0. */
export function generarSalto(rng) {
  const tipo = rng.elegir(TIPOS_SALTO);
  if (tipo === 'resta') {                                 // 3 − 7: resta de naturales con resultado negativo
    const a = rng.entero(1, 9), b = rng.entero(a + 1, 10);
    return { tipo, terminos: [a, -b] };
  }
  if (tipo === 'menos-mas') {                             // −5 + 3 y −3 + 5
    const a = rng.entero(1, 10);
    let b = rng.entero(1, 10);
    if (b === a) b = a === 10 ? 9 : a + 1;
    return { tipo, terminos: [-a, b] };
  }
  const a = rng.entero(1, 9), b = rng.entero(1, 10 - a);  // −5 − 3
  return { tipo, terminos: [-a, -b] };
}

/** Errores típicos de una suma de dos términos: [{ valor, error }] (sin el resultado bueno ni repetidos). */
export function erroresDeDos([x, y]) {
  return distractores([
    ['regla-signos-en-suma', x, y],
    ['suma-valores-absolutos', x, y],
    ['olvida-el-signo', x, y],
    ['signo-del-primero', x, y],
  ], x + y);
}

/** ¿Qué error explica que el alumno haya contestado `respuesta` a la cuenta de dos términos? (id o null) */
export function errorDe(terminos, respuesta) {
  return erroresDeDos(terminos).find(e => e.valor === respuesta)?.error ?? null;
}

// ─── Ejercicio 2: ¿qué signo tendrá? ───────────────────────────────────────────

/** Ítem: { terminos: [x, y] }. Términos de 1 a 15 y resultado de −20 a 20, nunca 0; la mitad, positivo. */
export function generarSigno(rng) {
  for (;;) {
    const tipo = rng.elegir(['resta', 'menos-mas', 'menos-menos']);
    const a = rng.entero(1, 15), b = rng.entero(1, 15);
    const terminos = tipo === 'resta' ? [a, -b] : tipo === 'menos-mas' ? [-a, b] : [-a, -b];
    const v = valorDe(terminos);
    if (v === 0 || Math.abs(v) > 20) continue;
    // Los dos de signos distintos dan positivo la mitad de las veces; esto evita que los positivos sean pocos.
    if (v < 0 && rng.azar() < 0.15) continue;
    return { terminos };
  }
}

export const signoDe = terminos => (valorDe(terminos) > 0 ? 'positivo' : 'negativo');

/** El término de mayor valor absoluto de una cuenta de dos (en un empate no hay: el resultado sería 0 o los dos van igual). */
export const mayorDe = ([x, y]) => (Math.abs(x) >= Math.abs(y) ? x : y);

// ─── Ejercicio 3: de izquierda a derecha ───────────────────────────────────────

const generarTerminosCadena = (rng, n, maximo, min = -20, max = 20) => {
  for (;;) {
    const t = Array.from({ length: n }, () => rng.entero(1, maximo) * (rng.azar() < 0.5 ? -1 : 1));
    if (fuera(t, min, max) || valorDe(t) === 0) continue;
    if (t.every(x => x > 0) || t.every(x => x < 0)) continue;
    return t;
  }
};

/**
 * Las variantes de una cuenta con un signo cambiado (el del inicio, un verbo sube ↔ baja, o todos
 * los verbos): sirven de opciones falsas, todas con otro valor que la buena.
 */
export function variantesDeSigno(terminos) {
  const salida = [];
  const mover = i => terminos.map((t, j) => (j === i ? -t : t));
  for (let i = 0; i < terminos.length; i++) salida.push(mover(i));     // un signo cambiado (el del inicio, o un verbo)
  salida.push(terminos.map((t, j) => (j === 0 ? t : -t)));                    // todos los verbos al revés
  return salida.filter(v => valorDe(v) !== valorDe(terminos));
}

/** Cuatro formas de escribir la cuenta de los movimientos: la buena y tres con un verbo cambiado. */
export function opcionesExpresion(rng, terminos) {
  const falsas = rng.barajar(variantesDeSigno(terminos)).slice(0, 3);
  const todas = rng.barajar([{ terminos, buena: true }, ...falsas.map(t => ({ terminos: t, buena: false }))]);
  return { opciones: todas.map(o => textoDe(o.terminos)), correcta: todas.findIndex(o => o.buena) };
}

/**
 * Ítem: { modo: 'numeros' | 'palabras', terminos, opciones?, correcta? }. De tres o cuatro
 * términos, sin pasarse de ±20 en ningún paso. En 'numeros' se intenta (3 de cada 4) que
 * ir de derecha a izquierda dé otro resultado, para que ese error se pueda detectar.
 */
export function generarCadena(rng) {
  const modo = rng.azar() < 0.5 ? 'numeros' : 'palabras';
  const n = rng.azar() < 0.6 ? 3 : 4;
  let terminos = generarTerminosCadena(rng, n, 12);
  if (modo === 'numeros' && rng.azar() < 0.75) {
    for (let i = 0; i < 20 && derechaAIzquierda(textoDe(terminos)) === null; i++) terminos = generarTerminosCadena(rng, n, 12);
  }
  if (modo === 'numeros') return { modo, terminos };
  return { modo, terminos, ...opcionesExpresion(rng, terminos) };
}

/** Los pasos de izquierda a derecha: [{ antes: '2 − 4 + 3', valor: −2 }, …] para la explicación. */
export function pasosIzquierdaADerecha(terminos) {
  const pasos = [];
  let parcial = terminos[0];
  for (let i = 1; i < terminos.length; i++) {
    const hecho = parcial + terminos[i];
    const resto = terminos.slice(i + 1);
    pasos.push({
      cuenta: `${fmt(parcial)} ${terminos[i] < 0 ? '−' : '+'} ${Math.abs(terminos[i])}`,
      valor: hecho,
      queda: resto.length ? textoDe([hecho, ...resto]) : null,
    });
    parcial = hecho;
  }
  return pasos;
}

// ─── Ejercicio 4: varios términos ──────────────────────────────────────────────

/** Ítem: { terminos, pareja }. De 4 a 6 términos, al menos uno positivo y uno negativo; la mitad, con una pareja de opuestos. */
export function generarTerminos(rng) {
  for (;;) {
    const n = rng.entero(4, 6);
    const maximo = n === 6 ? 9 : 12;
    const conPareja = rng.azar() < 0.5;
    let t = Array.from({ length: n }, () => rng.entero(1, maximo) * (rng.azar() < 0.5 ? -1 : 1));
    let pareja = null;
    if (conPareja) {
      pareja = rng.entero(1, maximo);
      const i = rng.entero(0, n - 1);
      let j = rng.entero(0, n - 2);
      if (j >= i) j++;
      t[i] = pareja;
      t[j] = -pareja;
    }
    const pos = t.filter(x => x > 0), neg = t.filter(x => x < 0);
    if (!pos.length || !neg.length) continue;
    if (Math.abs(valorDe(t)) > 20 || valorDe(pos) > 30 || -valorDe(neg) > 30) continue;
    // Como mucho una pareja de opuestos (y sin valores repetidos que se confundan con ella).
    if (t.filter(x => x > 0 && t.includes(-x)).length > 1 || new Set(t).size < n) continue;
    if (conPareja && hayPareja(t) === null) continue;
    return { terminos: t, pareja: hayPareja(t) };
  }
}

/** La pareja de opuestos (su valor positivo), o null. */
export function hayPareja(terminos) {
  return terminos.find(x => x > 0 && terminos.includes(-x)) ?? null;
}

export const positivosDe = terminos => terminos.filter(x => x > 0);
export const negativosDe = terminos => terminos.filter(x => x < 0);

/** Los errores del último paso (positivos con negativos): [{ valor, error }]. */
export function erroresDeAgrupar(sumaPos, sumaNeg) {
  return distractores([
    ['olvida-el-signo', sumaPos, sumaNeg],
    ['inicial-menos-final', sumaPos, -sumaNeg],
    ['suma-valores-absolutos', sumaPos, sumaNeg],
  ], sumaPos + sumaNeg);
}

// ─── Ejercicio 5: varios movimientos ───────────────────────────────────────────

/**
 * Los contextos y su cota creíble (el test la comprueba en todos los pasos del generador):
 * un buceador no sube por encima de la superficie ni pasa de 40 m; un ascensor llega de
 * −3 (garaje) a 12; el saldo de un alumno no baja de −50 € ni pasa de 300 €; la
 * temperatura de una ciudad, de −20 a 35 °C, y cada cambio, de 1 a 12 grados.
 */
export const CONTEXTOS = {
  buzo: { min: -40, max: -1, inicio: [-30, -2], mueve: [1, 15], paso: 1 },
  ascensor: { min: -3, max: 12, inicio: [-3, 10], mueve: [1, 8], paso: 1 },
  saldo: { min: -50, max: 300, inicio: [-20, 120], mueve: [5, 120], paso: 5 },
  temperatura: { min: -20, max: 35, inicio: [-10, 15], mueve: [1, 12], paso: 1 },
};

/** Ítem: { contexto, terminos, opciones, correcta, frases, frase }. Tres o cuatro movimientos tras el inicio. */
export function generarProblema(rng) {
  for (;;) {
    const contexto = rng.elegir(Object.keys(CONTEXTOS));
    const c = CONTEXTOS[contexto];
    const aleatorio = (a, b) => rng.entero(Math.ceil(a / c.paso), Math.floor(b / c.paso)) * c.paso;
    const inicio = aleatorio(c.inicio[0], c.inicio[1]);
    const movimientos = Array.from({ length: rng.entero(3, 4) }, () => aleatorio(c.mueve[0], c.mueve[1]) * (rng.azar() < 0.5 ? -1 : 1));
    const terminos = [inicio, ...movimientos];
    if (inicio === 0 || fuera(terminos, c.min, c.max) || valorDe(terminos) === 0) continue;
    if (movimientos.every(m => m > 0) || movimientos.every(m => m < 0)) continue;
    const resultado = valorDe(terminos);
    const falsas = distractores([
      ['signo-cambiado', resultado],
      ['derecha-a-izquierda', textoDe(terminos)],
    ], resultado);
    if (falsas.length < 2) continue;
    const variantes = variantesDeSigno(terminos);
    if (variantes.length < 3) continue;
    const frases = rng.barajar([{ valor: resultado, buena: true }, ...falsas.map(f => ({ valor: f.valor, error: f.error, buena: false }))]);
    return {
      contexto, terminos,
      ...opcionesExpresion(rng, terminos),
      frases: frases.map(f => f.valor),
      frase: frases.findIndex(f => f.buena),
      erroresFrase: frases.map(f => f.error ?? null),
    };
  }
}

/** Sanidad de un ítem de ejercicio 5: el valor, calculado con el evaluador de la base. */
export const valorEvaluado = terminos => evaluar(textoDe(terminos));
