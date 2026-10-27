// «Suma y resta» de fracciones (PU2, tarea 104): lógica pura (sin DOM ni red).
//
// Cinco ejercicios, cuyos ítems son DATOS ({ n, d } con el signo en n); las frases y las
// cuentas se pintan en `textos.js` y `practica.js`:
//   1. generarMismo     { a, b, op, neg, irred }                       mismo denominador (U4-2C-01, 2C-07)
//   2. generarPasos     { fracs, ops, m, irred }                       distinto denominador, paso a paso (U4-1C-16, 2C-02, 2C-04)
//   3. generarNaturales { tipo, nat, f }                               un natural y una fracción (U4-2C-03, 2C-07)
//   4. generarQueda     { ctx, pregunta, a, b, opciones }              partes de un todo (U4-2A-01, 2A-04)
//   5. generarCaza      { a, b, m, l1, l2, l3, mala, error, razones }  una suma en tres líneas con un paso mal (U4-3C-11)
//
// Los resultados de los ejercicios 1-3 son siempre fracciones no enteras (y las irreducibles,
// propias o impropias; nunca números mixtos ni decimales). Los distractores y los errores que
// se reconocen salen de `ERRORES_TIPICOS` (con nombre) o de `ERRORES_PROPIOS`.
// Las negativas solo van delante (−1/8 + 5/8) o como resultado (3/10 − 7/10): sin paréntesis.

import { fraccion, ERRORES_TIPICOS } from '../_comun/fracciones.js';

const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));
const mcm = (a, b) => (a / mcd(a, b)) * b;

/** La fracción de un ítem ({ n, d } → Fraccion). */
export const F = x => fraccion(x.n, x.d);
const dato = f => ({ n: f.num, d: f.den });

/** Errores típicos propios de la práctica (los demás vienen de `_comun/fracciones.js`). */
export const ERRORES_PROPIOS = {
  'sin-simplificar': { nombre: { es: 'El resultado es el bueno, pero no está simplificado', en: 'The result is right, but it is not in its simplest form' } },
  'mcm-equivocado': { nombre: { es: 'Se ha equivocado con el m.c.m. de los denominadores', en: 'Got the l.c.m. of the denominators wrong' } },
  'equivalente-equivocada': { nombre: { es: 'Ha escrito mal una fracción equivalente', en: 'Wrote an equivalent fraction wrongly' } },
  'queda-como-gastado': { nombre: { es: 'Ha dado lo que queda en vez de lo que se gasta', en: 'Gave what is left instead of what is spent' } },
  'linea-equivocada': { nombre: { es: 'Ha señalado una línea que estaba bien', en: 'Pointed at a line that was right' } },
  'no-ve-el-error': { nombre: { es: 'Ha dicho que no había error y sí lo había', en: 'Said there was no mistake, but there was' } },
  've-un-error-donde-no-lo-hay': { nombre: { es: 'Ha buscado un error donde no lo había', en: 'Looked for a mistake where there was none' } },
  'razon-equivocada': { nombre: { es: 'Ha visto la línea con el error, pero no ha elegido bien la razón', en: 'Found the line with the mistake, but chose the wrong reason' } },
  'otro-error': { nombre: { es: 'Otro error', en: 'Another mistake' } },
};

/** ¿Es `id` un error con nombre (de la base o propio)? */
export const errorConNombre = id => id in ERRORES_TIPICOS || id in ERRORES_PROPIOS;

/** El primer error de la lista cuyo valor (Fraccion) vale lo mismo que `v`; si no, `otro-error`. */
function nombrarError(v, candidatos) {
  for (const [id, ...args] of candidatos) {
    const e = ERRORES_TIPICOS[id].fn(...args);
    if (e && v.equals(e)) return id;
  }
  return 'otro-error';
}

const noEntero = f => !f.simplificar().esEntera();

// ─── Ejercicio 1: mismo denominador ────────────────────────────────────────────

/**
 * Ítem: { a, b, op, neg, irred }. Un 25 % lleva una negativa: o el resultado de una resta
 * es negativo (3/10 − 7/10), o el primer término es negativo (−1/8 + 5/8). La mitad pide la
 * fracción irreducible. El resultado nunca es entero.
 */
export function generarMismo(rng) {
  for (let intento = 0; intento < 1000; intento++) {
    const d = rng.entero(3, 12);
    const neg = rng.azar() < 0.25;
    let op = rng.azar() < 0.5 ? '+' : '-';
    let n1 = rng.entero(1, d - 1), n2 = rng.entero(1, d - 1);
    if (neg) {
      if (rng.azar() < 0.5) { op = '-'; if (n1 >= n2) continue; } else n1 = -n1;
    } else if (op === '-' && n1 <= n2) {
      [n1, n2] = [n2, n1];
      if (n1 === n2) continue;
    }
    const total = op === '+' ? n1 + n2 : n1 - n2;
    if (total % d === 0) continue;
    if (neg && total > 0 && n1 > 0) continue;
    return { a: { n: n1, d }, b: { n: n2, d }, op, neg, irred: rng.azar() < 0.5 };
  }
  throw new Error('generarMismo: sin ítem posible');
}

const operar = (x, y, op) => (op === '+' ? F(x).sumar(F(y)) : F(x).restar(F(y)));

/** El resultado sin simplificar de una cuenta de dos fracciones. */
export const resultadoMismo = item => operar(item.a, item.b, item.op);

/**
 * Qué error explica la fracción `v` (Fraccion, tal como la escribió el alumno): `null` si vale;
 * `sin-simplificar` si vale lo mismo pero se pedía la irreducible; el error típico o `otro-error`.
 */
export function errorDeMismo(item, v) {
  const r = resultadoMismo(item);
  if (v.equals(r)) return item.irred && !v.esIrreducible() ? 'sin-simplificar' : null;
  return nombrarError(v, [
    ...(item.op === '+' ? [['suma-arriba-y-abajo', F(item.a), F(item.b)]] : []),
    ['signo-perdido', r],
    ['signo-del-primero', F(item.a), F(item.b), item.op],
  ]);
}

// ─── Ejercicio 2: distinto denominador, paso a paso ────────────────────────────

/**
 * Ítem: { fracs: [{ n, d }…], ops: ['+' | '-'…] (ops[i] une fracs[i] con fracs[i+1]), m, irred }.
 * Dos fracciones (un tercio de las veces, un denominador es múltiplo del otro) o, en un
 * 20 %, tres. Denominadores de 2 a 12, m.c.m. ≤ 60, sin negativas, resultado positivo y no entero.
 */
export function generarPasos(rng) {
  const tres = rng.azar() < 0.2;
  const multiplo = !tres && rng.azar() < 1 / 3;
  for (let intento = 0; intento < 5000; intento++) {
    let dens;
    if (tres) {
      dens = [rng.entero(2, 12), rng.entero(2, 12), rng.entero(2, 12)];
      if (new Set(dens).size < 3) continue;
    } else if (multiplo) {
      const d1 = rng.entero(2, 6);
      dens = rng.barajar([d1, d1 * rng.entero(2, Math.floor(12 / d1))]);
    } else {
      dens = [rng.entero(2, 12), rng.entero(2, 12)];
      const [x, y] = dens;
      if (x === y || x % y === 0 || y % x === 0) continue;
    }
    const m = dens.reduce(mcm, 1);
    if (m > 60) continue;
    const fracs = dens.map(d => ({ n: rng.entero(1, d - 1), d }));
    const ops = fracs.slice(1).map(() => (rng.azar() < 0.5 ? '+' : '-'));
    const item = { fracs, ops, m, irred: rng.azar() < 0.5 };
    const r = resultadoPasos(item);
    if (r.num <= 0 || r.simplificar().esEntera()) continue;
    return item;
  }
  throw new Error('generarPasos: sin ítem posible');
}

/** Los numeradores de las equivalentes con denominador m. */
export const equivalentes = item => item.fracs.map(f => (f.n * item.m) / f.d);

/** El resultado (sin simplificar, con denominador m) y su construcción con los numeradores dados. */
export const sumaDeNumeradores = (item, nums) => nums.reduce((s, x, i) => s + (i === 0 || item.ops[i - 1] === '+' ? x : -x), 0);
export const resultadoPasos = item => fraccion(sumaDeNumeradores(item, equivalentes(item)), item.m);

/**
 * Corrige un ítem del ejercicio 2. `resp` = { m, equivs: [Fraccion…] (cada equivalente con su
 * numerador y su denominador, tal como los escribió el alumno), res: Fraccion }. Cada paso se
 * corrige solo: una equivalente está bien si vale lo mismo que la fracción y tiene el
 * denominador que el alumno puso como m.c.m. (un m.c.m. mal no la castiga otra vez); el
 * resultado se compara también con el que sale de las equivalentes del alumno (`coherente`).
 * `error` es el primer paso mal, con su nombre; `null` si todo está bien.
 */
export function corregirPasos(item, resp) {
  const mcmBien = resp.m === item.m;
  const equivBien = item.fracs.map((f, i) => resp.equivs[i].equals(F(f)) && resp.equivs[i].den === resp.m);
  const r = resultadoPasos(item);
  const igual = resp.res.equals(r);
  const resBien = igual && (!item.irred || resp.res.esIrreducible());
  const propio = fraccion(sumaDeNumeradores(item, resp.equivs.map(e => e.num)), resp.m);
  const coherente = resp.res.equals(propio) && (!item.irred || resp.res.esIrreducible());
  let error = null;
  if (!mcmBien) error = 'mcm-equivocado';
  else if (equivBien.includes(false)) {
    const i = equivBien.indexOf(false);
    error = resp.equivs[i].num === item.fracs[i].n && resp.equivs[i].den === resp.m ? 'amplia-solo-denominador' : 'equivalente-equivocada';
  } else if (!resBien) {
    if (igual) error = 'sin-simplificar';
    else {
      const [a, b] = item.fracs.map(F);
      error = item.fracs.length === 2
        ? nombrarError(resp.res, [
          ['suma-arriba-y-abajo', a, b], ['en-cruz-al-sumar', a, b],
          ['suma-solo-cambia-denominador', a, b, item.ops[0]], ['suma-multiplicando-denominadores', a, b],
        ])
        : 'otro-error';
    }
  }
  return { mcmBien, equivBien, resBien, coherente, error, acierto: error === null };
}

// ─── Ejercicio 3: con naturales ────────────────────────────────────────────────

/** Las cuatro formas del ejercicio 3. `f-nat` es la de resultado negativo (1/2 − 2). */
export const TIPOS_NAT = ['nat+f', 'nat-f', 'f+nat', 'f-nat'];

/**
 * Ítem: { tipo, nat, f }. El natural es de 1 a 5 y la fracción, irreducible y propia, con
 * denominador de 2 a 12. Un 25 % de los ítems es `f-nat` (resultado negativo). El resultado
 * ya sale irreducible (nat·d ± n sobre d).
 */
export function generarNaturales(rng) {
  const d = rng.entero(2, 12);
  let n = rng.entero(1, d - 1);
  while (mcd(n, d) !== 1) n = rng.entero(1, d - 1);
  const tipo = rng.azar() < 0.25 ? 'f-nat' : rng.elegir(['nat+f', 'nat-f', 'f+nat']);
  return { tipo, nat: rng.entero(1, 5), f: { n, d } };
}

/** Los dos términos y la operación, en el orden en que se escriben: { x, op, y } (Fraccion). */
export function terminosNat(item) {
  const nat = fraccion(item.nat, 1), f = F(item.f);
  return { 'nat+f': { x: nat, op: '+', y: f }, 'nat-f': { x: nat, op: '-', y: f }, 'f+nat': { x: f, op: '+', y: nat }, 'f-nat': { x: f, op: '-', y: nat } }[item.tipo];
}
export const resultadoNat = item => { const { x, op, y } = terminosNat(item); return op === '+' ? x.sumar(y) : x.restar(y); };

/** Qué error explica `v` (Fraccion): `null` si vale; `sin-simplificar`; el error típico o `otro-error`. */
export function errorDeNat(item, v) {
  const r = resultadoNat(item);
  if (v.equals(r)) return v.esIrreducible() ? null : 'sin-simplificar';
  const { x, op, y } = terminosNat(item);
  const natural = item.nat, f = F(item.f);
  return nombrarError(v, [
    ['signo-perdido', r],
    ['natural-al-numerador', natural, f, op],
    ['suma-arriba-y-abajo', x, y],
  ]);
}

// ─── Ejercicio 4: ¿qué queda? ──────────────────────────────────────────────────

export const CONTEXTOS_QUEDA = ['dinero', 'pizza', 'deposito', 'libro', 'ruta'];
const DENS_QUEDA = [2, 3, 4, 5, 6, 8, 10, 12];

const propia = f => f.num > 0 && f.num < f.den;

/**
 * Elige tres opciones del *pool* (ya barajado aquí; trampa del motor): fracciones propias,
 * irreducibles, distintas por valor entre sí y de la buena. `null` si no salen tres.
 */
function tresOpciones(rng, buena, pool) {
  const vistos = new Set([buena.clave()]);
  const salida = [];
  for (const o of rng.barajar(pool)) {
    if (!o.valor || !propia(o.valor)) continue;
    const s = o.valor.simplificar();
    if (vistos.has(s.clave())) continue;
    vistos.add(s.clave());
    salida.push({ ...dato(s), error: o.error });
    if (salida.length === 3) break;
  }
  return salida.length === 3 ? rng.barajar([{ ...dato(buena), error: null }, ...salida]) : null;
}

/**
 * Ítem: { ctx, pregunta: 'queda' | 'gastan', a, b, opciones: [{ n, d, error }] }. Dos partes
 * (irreducibles) que suman menos de 1; se pregunta por lo que queda o por lo que suman las dos
 * partes. Cuatro opciones (irreducibles, propias, ninguna equivalente a otra).
 */
export function generarQueda(rng) {
  for (let intento = 0; intento < 2000; intento++) {
    const [da, db] = [rng.elegir(DENS_QUEDA), rng.elegir(DENS_QUEDA)];
    if (da === db) continue;
    const a = fraccion(rng.entero(1, da - 1), da), b = fraccion(rng.entero(1, db - 1), db);
    if (!a.esIrreducible() || !b.esIrreducible()) continue;
    const suma = a.sumar(b);
    if (!propia(suma)) continue;
    const uno = fraccion(1, 1);
    const queda = uno.restar(suma);
    const pregunta = rng.azar() < 0.5 ? 'queda' : 'gastan';
    const mal = id => ERRORES_TIPICOS[id].fn(a, b);
    const malSuma = mal('suma-arriba-y-abajo');
    const pool = pregunta === 'queda'
      ? [
        { valor: ERRORES_TIPICOS['gastado-como-queda'].fn(a, b), error: 'gastado-como-queda' },
        { valor: malSuma && uno.restar(malSuma), error: 'suma-arriba-y-abajo' },
        { valor: uno.restar(a), error: 'olvida-restar-la-segunda' },
        { valor: uno.restar(b), error: 'olvida-restar-la-primera' },
      ]
      : [
        { valor: queda, error: 'queda-como-gastado' },
        { valor: malSuma, error: 'suma-arriba-y-abajo' },
        { valor: mal('suma-solo-cambia-denominador') || ERRORES_TIPICOS['suma-solo-cambia-denominador'].fn(a, b, '+'), error: 'suma-solo-cambia-denominador' },
        { valor: mal('suma-multiplicando-denominadores'), error: 'suma-multiplicando-denominadores' },
        { valor: mal('en-cruz-al-sumar'), error: 'en-cruz-al-sumar' },
      ];
    const opciones = tresOpciones(rng, (pregunta === 'queda' ? queda : suma).simplificar(), pool.map(o => (o.valor === undefined ? { ...o, valor: null } : o)));
    if (!opciones) continue;
    return { ctx: rng.elegir(CONTEXTOS_QUEDA), pregunta, a: dato(a), b: dato(b), opciones };
  }
  throw new Error('generarQueda: sin ítem posible');
}

/** La respuesta buena (irreducible) de un ítem del ejercicio 4. */
export function respuestaQueda(item) {
  const suma = F(item.a).sumar(F(item.b));
  return item.pregunta === 'queda' ? fraccion(1, 1).restar(suma).simplificar() : suma.simplificar();
}

// Los errores propios de lo que queda se llaman como los de ERRORES_PROPIOS (los de «olvida»
// no están en `fracciones.js`).
ERRORES_PROPIOS['olvida-restar-la-primera'] = { nombre: { es: 'Ha olvidado restar la primera parte', en: 'Forgot to subtract the first part' } };
ERRORES_PROPIOS['olvida-restar-la-segunda'] = { nombre: { es: 'Ha olvidado restar la segunda parte', en: 'Forgot to subtract the second part' } };

// ─── Ejercicio 5: caza el error ────────────────────────────────────────────────

const ERRORES_CAZA = ['amplia-solo-denominador', 'suma-arriba-y-abajo', 'simplifica-solo-numerador'];

/**
 * Ítem: una suma a + b resuelta en tres líneas,
 *   línea 1: a + b = x + y      (las equivalentes con denominador m)
 *   línea 2: = s                (la suma, sin simplificar)
 *   línea 3: = r                (la irreducible)
 * `mala` es la línea con el error (0, 1 o 2) o null (la mitad de los ítems, todo bien); `error`, su
 * nombre; `razones`, las dos opciones de «por qué» (la buena y otra falsa). Las líneas siguientes a
 * la mala son coherentes con ella: solo hay UNA línea mal.
 */
export function generarCaza(rng) {
  const mala = rng.azar() < 0.5 ? null : rng.entero(0, 2);   // se decide antes de reintentar: si no, se sesga el reparto
  for (let intento = 0; intento < 5000; intento++) {
    const d1 = rng.entero(2, 12), d2 = rng.entero(2, 12);
    if (d1 === d2) continue;
    const m = mcm(d1, d2);
    if (m > 60 || (mala === 0 && m === d1)) continue;   // para equivocar la 1.ª equivalente hace falta que cambie (k1 > 1)
    const a = fraccion(rng.entero(1, d1 - 1), d1), b = fraccion(rng.entero(1, d2 - 1), d2);
    if (!a.esIrreducible() || !b.esIrreducible() || !propia(a.sumar(b))) continue;
    const k1 = m / d1, k2 = m / d2;
    let x = a.num * k1, y = b.num * k2;
    if (mala === 0) x = a.num;                                  // amplia-solo-denominador: 2/3 = 2/6
    let l1 = { x: { n: x, d: m }, y: { n: y, d: m } };
    let s = { n: x + y, d: m };
    if (mala === 1) s = { n: x + y, d: 2 * m };                 // suma-arriba-y-abajo: 3/12 + 2/12 = 5/24
    const g = mcd(s.n, s.d);
    if (g < 2) continue;
    let r = { n: s.n / g, d: s.d / g };
    if (mala === 2) r = { n: s.n / g, d: s.d };                 // simplifica-solo-numerador
    if (F(r).esEntera()) continue;
    const error = mala === null ? null : ERRORES_CAZA[mala];
    const razones = error === null ? [] : rng.barajar([error, rng.elegir(ERRORES_CAZA.filter(e => e !== error))]);
    return { a: dato(a), b: dato(b), m, l1, l2: { s }, l3: { r }, mala, error, razones };
  }
  throw new Error('generarCaza: sin ítem posible');
}

/** ¿Está bien la línea `i` (0, 1 o 2) de un ítem del ejercicio 5? Se recalcula desde la línea anterior. */
export function lineaCorrecta(item, i) {
  const { a, b, m, l1, l2, l3 } = item;
  if (i === 0) return F(l1.x).equals(F(a)) && F(l1.y).equals(F(b)) && l1.x.d === m && l1.y.d === m;
  if (i === 1) return F(l2.s).equals(F(l1.x).sumar(F(l1.y))) && l2.s.d === l1.x.d;
  return F(l3.r).equals(F(l2.s)) && F(l3.r).esIrreducible();
}
