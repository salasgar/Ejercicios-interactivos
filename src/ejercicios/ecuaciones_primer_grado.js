// Ecuaciones de primer grado (unidad 6, tarea 161 del reparto PU2). Cada subtipo declara las
// destrezas del inventario de la unidad 6 que cubre (`items`), como `enteros.js` y los
// generadores de fracciones y decimales.
//
// Aritmética EXACTA (racionales de `expresiones_algebraicas.js`): la solución es una fracción
// irreducible o un entero, nunca un decimal redondeado ni un periódico. La opción muestra el valor
// (`-\frac{5}{2}`); la clave es el valor como fracción reducida, así que `1/4`, `3/12` y `0,25`
// son la misma respuesta y nunca van juntas. Las ecuaciones se generan eligiendo primero la
// solución.
//
// Escritura (acta, punto p): `3x`, `-x`, `\frac{x}{2}`, `3(x - 2)` sin punto; la solución, «x = 7».

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';
import {
  Q, qNeg, qResta, qPor, qEntre, qEsCero, qClave, qTex,
  tX, tN, tP, texTerminos, lineal, expandirTerminos,
} from './expresiones_algebraicas.js';

export const errores = {
  no_cambia_signo_al_pasar: { concepto: 'ecuaciones_primer_grado',
    es: 'Al pasar un término al otro lado de la igualdad, cambia de signo: lo que suma pasa restando, y lo que resta pasa sumando.', en: 'When you move a term to the other side of the equals sign, it changes sign: what was added becomes subtracted, and what was subtracted becomes added.' },
  signo_de_x: { concepto: 'ecuaciones_primer_grado',
    es: 'Revisa el signo del resultado.', en: 'Check the sign of the result.' },
  signo_al_dividir: { concepto: 'ecuaciones_primer_grado',
    es: 'Al dividir entre un número negativo, el signo del resultado cambia.', en: 'When you divide by a negative number, the sign of the result changes.' },
  olvida_termino: { concepto: 'ecuaciones_primer_grado',
    es: 'Te has dejado un término sin pasar al otro lado.', en: 'You left a term without moving it to the other side.' },
  pasa_factor_restando: { concepto: 'ecuaciones_primer_grado',
    es: 'El número que multiplica a la x pasa dividiendo, no restando.', en: 'The number that multiplies x moves across by dividing, not by subtracting.' },
  multiplica_en_vez_de_dividir: { concepto: 'ecuaciones_primer_grado',
    es: 'Para despejar la x hay que dividir entre su coeficiente, no multiplicar.', en: 'To isolate x you must divide by its coefficient, not multiply.' },
  divide_en_vez_de_multiplicar: { concepto: 'ecuaciones_primer_grado',
    es: 'Si la x está dividida entre un número, ese número pasa multiplicando.', en: 'If x is divided by a number, that number moves across by multiplying.' },
  olvida_dividir_al_final: { concepto: 'ecuaciones_primer_grado',
    es: 'Te falta el último paso: dividir entre el coeficiente de la x.', en: 'You are missing the last step: dividing by the coefficient of x.' },
  olvida_multiplicar_al_final: { concepto: 'ecuaciones_primer_grado',
    es: 'Te falta el último paso: multiplicar por el número que dividía a la x.', en: 'You are missing the last step: multiplying by the number that divided x.' },
  divide_solo_la_x: { concepto: 'ecuaciones_primer_grado',
    es: 'Al dividir hay que dividir los dos miembros enteros, no solo el término con x.', en: 'When you divide you must divide both whole sides, not just the term with x.' },
  invierte_el_cociente: { concepto: 'ecuaciones_primer_grado',
    es: 'x se obtiene dividiendo el número entre el coeficiente de la x, no al revés.', en: 'You get x by dividing the number by the coefficient of x, not the other way round.' },
  olvida_pasar_x: { concepto: 'ecuaciones_primer_grado',
    es: 'Te has dejado el término con x del otro lado sin pasar: hay que juntar todos los términos con x en el mismo lado antes de despejar.', en: 'You left the x term on the other side without moving it: you must bring all the x terms together on the same side before isolating x.' },
  distribuye_solo_el_primero: { concepto: 'ecuaciones_primer_grado',
    es: 'El número de fuera del paréntesis multiplica a todo lo de dentro, no solo a la x.', en: 'The number outside the brackets multiplies everything inside, not just x.' },
  olvida_restar_b: { concepto: 'ecuaciones_primer_grado',
    es: 'Después de dividir todavía queda un término independiente dentro del paréntesis por despejar.', en: 'After dividing there is still a constant term inside the brackets left to isolate.' },
  signo_solo_el_primero: { concepto: 'ecuaciones_primer_grado',
    es: 'Un signo menos delante del paréntesis cambia el signo de todo lo de dentro, no solo del primer término.', en: 'A minus sign in front of the brackets changes the sign of everything inside, not just the first term.' },
  mcm_solo_denominadores: { concepto: 'ecuaciones_primer_grado',
    es: 'Al multiplicar por el m.c.m. hay que multiplicar todos los términos, también los que no tienen denominador.', en: 'When you multiply by the LCM you must multiply every term, also the ones without a denominator.' },
  olvida_numerador: { concepto: 'ecuaciones_primer_grado',
    es: 'Al multiplicar un término como 3x/4 por el m.c.m., el 3 del numerador también cuenta.', en: 'When you multiply a term like 3x/4 by the LCM, the 3 in the numerator counts too.' },
  multiplica_un_solo_miembro: { concepto: 'ecuaciones_primer_grado',
    es: 'Lo que se hace a un miembro hay que hacerlo también al otro: se multiplican los dos.', en: 'Whatever you do to one side you must do to the other: multiply both sides.' },
};
const E = erroresDe(errores);

export const preguntas = {
  resuelve: { es: 'Resuelve la ecuación:', en: 'Solve the equation:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  quitar_parentesis: { es: 'Quitamos el paréntesis: el de fuera multiplica a todo lo de dentro.', en: 'We remove the brackets: the number outside multiplies everything inside.' },
  quitar_denominadores: { es: 'Multiplicamos todos los términos de los dos miembros por el m.c.m. de los denominadores.', en: 'We multiply every term on both sides by the LCM of the denominators.' },
  cambiar_miembros: { es: 'Ponemos la x en el primer miembro.', en: 'We put the x on the left-hand side.' },
  transponer: { es: 'Pasamos los términos con x a un lado y los números al otro, cambiando el signo: lo que suma pasa restando; es decir, restamos en los dos miembros.', en: 'We move the x terms to one side and the numbers to the other, changing the sign: what is added moves across subtracted; that is, we subtract from both sides.' },
  reducir: { es: 'Reducimos cada miembro.', en: 'We simplify each side.' },
  despejar: { es: 'Dividimos los dos miembros entre el coeficiente de la x.', en: 'We divide both sides by the coefficient of x.' },
};

const T = tex;
const paso = (t, nota = null, calculo = null) => ({ tex: t, nota, calculo });
const mal = (t, calculo = null) => ({ tex: t, mal: true, calculo });
const abs = Math.abs;
const sg = n => (n < 0 ? '-' : '+');
const eqTex = (I, D) => `${texTerminos(I)} = ${texTerminos(D)}`;
const barajarPool = (rng, documentados, extras = []) => rng.barajar(documentados).concat(rng.barajar(extras));
const mcdN = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mcmN = lista => lista.reduce((m, v) => (m * v) / mcdN(m, v), 1);
const xv = rng => { let v; do { v = rng.entero(-9, 12); } while (v === 0); return v; };

/** La opción: el valor exacto; el paso erróneo y la solución a la que lleva. */
const opcion = (sol, error, linea) => {
  const val = qTex(sol);
  return {
    tex: val, clave: qClave(sol), error,
    pasos: linea === `x = ${val}` ? [mal(linea)] : [mal(linea), paso(`x = ${val}`)],
  };
};
/** La solución de una ecuación con términos Q (null si la x se va). */
function resolver(I, D) {
  const l = lineal(I), r = lineal(D);
  const A = qResta(l.a, r.a), C = qResta(r.b, l.b);
  return qEsCero(A) ? null : qEntre(C, A);
}
const sol = n => Q(n);

/** El método paso a paso (el de `algebra.js`): paréntesis, denominadores, transponer, reducir, despejar. */
function pasosDe(izq, der) {
  const pasos = [];
  let I = izq, D = der;
  if ([...I, ...D].some(t => t.dentro)) {
    I = expandirTerminos(I); D = expandirTerminos(D);
    pasos.push(paso(eqTex(I, D), 'quitar_parentesis'));
  }
  const ds = [...new Set([...I, ...D].filter(t => t.c.d > 1).map(t => t.c.d))].sort((a, b) => a - b);
  if (ds.length) {
    const m = mcmN(ds);
    const por = ts => ts.map(t => ({ ...t, c: qPor(t.c, Q(m)) }));
    I = por(I); D = por(D);
    pasos.push(paso(eqTex(I, D), 'quitar_denominadores', ds.length > 1 ? `\\text{mcm}(${ds.join(', ')}) = ${m}` : `\\text{mcm} = ${m}`));
  }
  if (!I.some(t => t.x)) { [I, D] = [D, I]; pasos.push(paso(eqTex(I, D), 'cambiar_miembros')); }
  const noCero = ts => ts.filter(t => !qEsCero(t.c));
  const xi = I.filter(t => t.x), ci = noCero(I.filter(t => !t.x)), xd = D.filter(t => t.x), cd = noCero(D.filter(t => !t.x));
  const neg = t => ({ ...t, c: qNeg(t.c) });
  if (xd.length || ci.length) {
    I = [...xi, ...xd.map(neg)]; D = [...cd, ...ci.map(neg)];
    if (!D.length) D = [tN(0)];
    pasos.push(paso(eqTex(I, D), 'transponer'));
  }
  const l = lineal(I), r = lineal(D);
  const A = qResta(l.a, r.a), C = qResta(r.b, l.b);
  const solucion = qEntre(C, A);
  if (I.length > 1 || D.length > 1) pasos.push(paso(eqTex([tX(A)], [tN(C)]), 'reducir'));
  if (!(A.n === 1 && A.d === 1)) {
    pasos.push(paso(`x = ${qTex(C)} \\div ${A.n < 0 ? `(${A.n})` : A.n} = ${qTex(solucion)}`, 'despejar'));
  } else if (pasos.at(-1)?.tex !== `x = ${qTex(solucion)}`) pasos.push(paso(`x = ${qTex(solucion)}`));
  return pasos;
}

/** Arma el ejercicio: enunciado, solución exacta comprobada, solución paso a paso y distractores. */
function ejercicio(rng, izq, der, solucionEsperada, documentados, extras = []) {
  const s = resolver(izq, der);
  if (!s || !qEsCero(qResta(s, solucionEsperada))) throw new Error(`La ecuación ${eqTex(izq, der)} no da ${qTex(solucionEsperada)}`);
  return {
    texto: { clave: 'resuelve' },
    enunciado: eqTex(izq, der),
    correcta: { tex: qTex(s), clave: qClave(s) },
    solucion: pasosDe(izq, der),
    distractores: barajarPool(rng, documentados.filter(Boolean), extras.filter(Boolean)),
  };
}

// ---------------------------------------------------------------------------

/** x + a = b, x - a = b, a + x = b: la x sola con un término (U6-2C-07). */
function sumaResta(rng) {
  const a = rng.entero(2, 15), v = xv(rng);
  const forma = rng.elegir(['x+a', 'x-a', 'a+x']);
  const k = forma === 'x-a' ? -a : a;
  const b = v + k;
  const izq = forma === 'a+x' ? [tN(a), tX(1)] : [tX(1), tN(k)];
  const parentesis = n => (n < 0 ? `(${n})` : String(n));
  return ejercicio(rng, izq, [tN(b)], sol(v), [
    opcion(sol(b + k), E('no_cambia_signo_al_pasar'), `x = ${T(b)} ${sg(k)} ${abs(k)}`),
    opcion(sol(k - b), E('signo_de_x'), `x = ${T(k)} - ${parentesis(b)}`),
  ], [opcion(sol(b), E('olvida_termino'), `x = ${T(b)}`)]);
}

/** ax = b, -ax = b, x/d = b (U6-2C-08). */
function productoCociente(rng) {
  const forma = rng.elegir(['ax', 'ax', '-ax', 'x/d']);
  if (forma === 'x/d') {
    const d = rng.entero(2, 9), b = xv(rng), v = b * d;
    return ejercicio(rng, [tX(Q(1, d))], [tN(b)], sol(v), [
      opcion(Q(b, d), E('divide_en_vez_de_multiplicar'), `x = ${T(b)} \\div ${d}`),
      opcion(sol(b - d), E('pasa_factor_restando'), `x = ${T(b)} - ${d}`),
      opcion(sol(-v), E('signo_de_x'), `x = ${T(-v)}`),
    ], [opcion(sol(b), E('olvida_multiplicar_al_final'), `x = ${T(b)}`)]);
  }
  const a = (forma === '-ax' ? -1 : 1) * rng.entero(2, 9), v = xv(rng), b = a * v;
  const parentesis = n => (n < 0 ? `(${n})` : String(n));
  return ejercicio(rng, [tX(a)], [tN(b)], sol(v), [
    opcion(sol(b - a), E('pasa_factor_restando'), `x = ${T(b)} - ${parentesis(a)}`),
    opcion(sol(b * a), E('multiplica_en_vez_de_dividir'), `x = ${T(b)} \\cdot ${parentesis(a)}`),
    opcion(sol(-v), E(a < 0 ? 'signo_al_dividir' : 'signo_de_x'), `x = ${T(-v)}`),
  ], [opcion(sol(b), E('olvida_dividir_al_final'), `x = ${T(b)}`)]);
}

/** ax + b = c, c = ax + b, x/d + b = c: dos operaciones (U6-2C-09). */
function dosPasos(rng) {
  const forma = rng.elegir(['ax+b', 'ax+b', 'c=ax+b', 'x/d+b']);
  if (forma === 'x/d+b') {
    const d = rng.entero(2, 6), t = xv(rng), b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
    const c = t + b, v = d * t;
    return ejercicio(rng, [tX(Q(1, d)), tN(b)], [tN(c)], sol(v), [
      opcion(sol(d * (c + b)), E('no_cambia_signo_al_pasar'), `\\frac{x}{${d}} = ${T(c)} ${sg(b)} ${abs(b)}`),
      opcion(sol(t), E('olvida_multiplicar_al_final'), `\\frac{x}{${d}} = ${T(t)}`),
      opcion(sol(-v), E('signo_de_x'), `x = ${T(-v)}`),
    ]);
  }
  const a = rng.entero(2, 9), v = xv(rng), bm = rng.elegir([-3, -2, -1, 1, 2, 3]), b = a * bm, c = a * v + b;
  const izq = [tX(a), tN(b)], der = [tN(c)];
  const docs = [
    opcion(sol(v + 2 * bm), E('no_cambia_signo_al_pasar'), `${texTerminos([tX(a)])} = ${T(c)} ${sg(b)} ${abs(b)}`),
    opcion(sol(c - b), E('divide_solo_la_x'), `x ${sg(b)} ${abs(b)} = ${T(c)}`),
    opcion(sol(-v), E('signo_de_x'), `x = ${T(-v)}`),
  ];
  return forma === 'c=ax+b' ? ejercicio(rng, der, izq, sol(v), docs) : ejercicio(rng, izq, der, sol(v), docs);
}

/** b - x = c, -x + b = c: la x restando (U6-2C-10). */
function xNegativa(rng) {
  const b = rng.entero(1, 20), v = xv(rng), c = b - v;
  const izq = rng.moneda() ? [tN(b), tX(-1)] : [tX(-1), tN(b)];
  return ejercicio(rng, izq, [tN(c)], sol(v), [
    opcion(sol(c - b), E('signo_de_x'), `-x = ${T(c - b)}`),
    opcion(sol(-(c + b)), E('no_cambia_signo_al_pasar'), `-x = ${T(c)} ${sg(b)} ${abs(b)}`),
  ], [opcion(sol(c + b), E('signo_de_x'), `x = ${T(c)} + ${b}`)]);
}

/** ax = b con solución fraccionaria irreducible (U6-2C-11). */
function solucionFraccion(rng) {
  let a, b;
  do {
    a = (rng.moneda(0.25) ? -1 : 1) * rng.entero(2, 12);
    b = (rng.moneda() ? 1 : -1) * rng.entero(1, 20);
  } while (b % a === 0);
  const s = Q(b, a);
  const parentesis = n => (n < 0 ? `(${n})` : String(n));
  return ejercicio(rng, [tX(a)], [tN(b)], s, [
    opcion(Q(a, b), E('invierte_el_cociente'), `x = ${T(a)} \\div ${parentesis(b)}`),
  ], [
    opcion(sol(b - a), E('pasa_factor_restando'), `x = ${T(b)} - ${parentesis(a)}`),
    opcion(sol(b * a), E('multiplica_en_vez_de_dividir'), `x = ${T(b)} \\cdot ${parentesis(a)}`),
    opcion(qNeg(s), E(a < 0 ? 'signo_al_dividir' : 'signo_de_x'), `x = ${qTex(qNeg(s))}`),
  ]);
}

/** ax + b = cx + d con las x en los dos miembros (U6-3C-01 con solución entera positiva; U6-3C-02 con negativa o fraccionaria). */
function dosMiembros(dificil) {
  return rng => {
    let a, b, c, d;
    if (!dificil) {
      c = rng.entero(1, 8); a = c + rng.entero(1, 6);
      const v = rng.entero(1, 12);
      b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
      d = (a - c) * v + b;
      if (d === 0) return null;
    } else {
      a = (rng.moneda(0.2) ? -1 : 1) * rng.entero(1, 9); c = rng.entero(1, 9);
      b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9); d = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
      if (a === c || d === b) return null;
      const s = Q(d - b, a - c);
      if (s.n > 0 && s.d === 1) return null;
    }
    const A = a - c, C = d - b;
    const v = Q(C, A);
    const dos = (cx, n) => `${texTerminos([tX(cx)])} = ${T(n)}`;
    return ejercicio(rng, [tX(a), tN(b)], [tX(c), tN(d)], v, [
      opcion(Q(d + b, A), E('no_cambia_signo_al_pasar'), `${texTerminos([tX(A)])} = ${T(d)} ${sg(b)} ${abs(b)}`),
      a + c !== 0 ? opcion(Q(C, a + c), E('no_cambia_signo_al_pasar'), dos(a + c, C)) : null,
      opcion(Q(C, a), E('olvida_pasar_x'), dos(a, C)),
    ], [opcion(qNeg(v), E('signo_de_x'), `x = ${qTex(qNeg(v))}`)]);
  };
}

/** k(x ± b) = c y a - (x ± b) = c: paréntesis (U6-3C-09). */
function conParentesis(rng) {
  if (rng.moneda(0.6)) {
    const k = rng.elegir([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5]);
    const v = xv(rng), b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9), c = k * (v + b);
    return ejercicio(rng, [tP(k, [tX(1), tN(b)])], [tN(c)], sol(v), [
      opcion(Q(c - b, k), E('distribuye_solo_el_primero'), `${texTerminos([tX(k), tN(b)])} = ${T(c)}`),
      opcion(sol(c / k), E('olvida_restar_b'), `x ${sg(b)} ${abs(b)} = ${T(c / k)}`),
      opcion(sol(c / k + b), E('no_cambia_signo_al_pasar'), `x = ${T(c / k)} ${sg(b)} ${abs(b)}`),
    ], [opcion(sol(-v), E('signo_de_x'), `x = ${T(-v)}`)]);
  }
  const a = rng.entero(1, 12), v = xv(rng), b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9), c = a - (v + b);
  return ejercicio(rng, [tN(a), tP(-1, [tX(1), tN(b)])], [tN(c)], sol(v), [
    opcion(sol(a + b - c), E('signo_solo_el_primero'), `${texTerminos([tN(a), tX(-1), tN(b)])} = ${T(c)}`),
    opcion(sol(-(c + a + b)), E('no_cambia_signo_al_pasar'), `${texTerminos([tX(-1), tN(-b)])} = ${T(c)} + ${a}`),
    opcion(sol(c - a + b), E('signo_de_x'), `-x = ${T(c - a + b)}`),
  ], [opcion(sol(c - a - b), E('signo_de_x'), `x = ${T(c)} - ${a} - ${b < 0 ? `(${b})` : b}`)]);
}

/** Resuelve con la ecuación equivocada que sale de multiplicar por el m.c.m. mal (U6-3C-11 y 3C-12). */
function conDenominadores(variosDenominadores) {
  return rng => {
    let izq, der, v;
    if (!variosDenominadores) {
      const forma = rng.elegir(['x/d', 'ax/d', 'x/d+b']);
      const d = rng.entero(2, 8), t = xv(rng);
      if (forma === 'x/d') { v = d * t; izq = [tX(Q(1, d))]; der = [tN(t)]; }
      else if (forma === 'ax/d') {
        const a = rng.entero(2, 5);
        if (mcdN(a, d) !== 1) return null;
        v = d * t; izq = [tX(Q(a, d))]; der = [tN(a * t)];
      } else {
        const b = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
        v = d * t; izq = [tX(Q(1, d)), tN(b)]; der = [tN(t + b)];
      }
    } else {
      const p = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]), r = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]);
      const a = rng.elegir([1, 1, 2, 3]), s = rng.moneda() ? 1 : -1;
      if (p === r) return null;
      const m = mcmN([p, r]);
      if (m > 24) return null;
      v = m * xv(rng);
      const c = (a * v) / p + (s * v) / r;
      if (c === 0) return null;
      izq = [tX(Q(a, p)), tX(Q(s, r))]; der = [tN(c)];
    }
    const todos = [...izq, ...der];
    const m = mcmN(todos.filter(t => t.c.d > 1).map(t => t.c.d));
    const M = Q(m);
    const escala = (ts, cada) => ts.map(t => cada(t));
    const solo = t => (t.c.d > 1 ? { ...t, c: qPor(t.c, M) } : t);
    const sinNumerador = t => (t.c.d > 1 && abs(t.c.n) !== 1 ? { ...t, c: Q(Math.sign(t.c.n) * (m / t.c.d)) } : { ...t, c: qPor(t.c, M) });
    const todoPorM = t => ({ ...t, c: qPor(t.c, M) });
    const mcmSolo = [escala(izq, solo), escala(der, solo)];
    const sinNum = [escala(izq, sinNumerador), escala(der, sinNumerador)];
    const unMiembro = [escala(izq, todoPorM), der];
    const cand = ([I, D], id) => {
      const s = resolver(I, D);
      return s ? opcion(s, E(id), eqTex(I, D)) : null;
    };
    const hayNumerador = todos.some(t => t.c.d > 1 && abs(t.c.n) !== 1);
    return ejercicio(rng, izq, der, sol(v), [
      cand(mcmSolo, 'mcm_solo_denominadores'),
      hayNumerador ? cand(sinNum, 'olvida_numerador') : null,
    ], [cand(unMiembro, 'multiplica_un_solo_miembro'), opcion(qNeg(sol(v)), E('signo_de_x'), `x = ${T(-v)}`)]);
  };
}

// Cada forma declara las destrezas del inventario de la unidad 6 que cubre (`items`).
export const SUBTIPOS = [
  { id: 'suma_resta', items: ['U6-2C-07'], forma: sumaResta },
  { id: 'producto_cociente', items: ['U6-2C-08'], forma: productoCociente },
  { id: 'dos_pasos', items: ['U6-2C-09'], forma: dosPasos },
  { id: 'x_negativa', items: ['U6-2C-10'], forma: xNegativa },
  { id: 'solucion_fraccion', items: ['U6-2C-11'], forma: solucionFraccion },
  { id: 'dos_miembros', items: ['U6-3C-01'], forma: dosMiembros(false) },
  { id: 'dos_miembros_dificil', items: ['U6-3C-02'], forma: dosMiembros(true) },
  { id: 'con_parentesis', items: ['U6-3C-09'], forma: conParentesis },
  { id: 'un_denominador', items: ['U6-3C-11'], forma: conDenominadores(false) },
  { id: 'varios_denominadores', items: ['U6-3C-12'], forma: conDenominadores(true) },
].map(s => ({
  ...s,
  generar: conReintentos(rng => {
    const hecho = s.forma(rng);
    if (!hecho) return null;
    const { texto, enunciado, correcta, solucion, distractores } = hecho;
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }, 300),
}));

export default {
  id: 'ecuaciones_primer_grado',
  nombre: { es: 'Ecuaciones de primer grado', en: 'First-degree equations' },
  curso: 1,
  concepto: 'ecuaciones_primer_grado',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
