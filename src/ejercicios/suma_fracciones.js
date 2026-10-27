// Suma y resta de fracciones (unidad 4, semana 2). El resultado correcto se da
// irreducible y ningún distractor tiene el mismo valor que él.
//
// Cada forma es un subtipo con las destrezas del inventario de la unidad 4 que
// cubre (`items`, como en enteros.js). Las negativas entran en U4-2C-07 (acta del
// 26-10): se escriben sin paréntesis al empezar, `-2/7 + 2`, nunca `(-2/7) + (+2)`.
// Ni decimales ni números mixtos: un resultado mayor que 1 se deja como impropia.

import { construirOpciones, conReintentos, erroresDe, texFraccion, claveFraccion, mcm, mcd, reducir } from './index.js';

export const errores = {
  sumar_numeradores_y_denominadores: { concepto: 'suma_fracciones',
    es: 'No se suman los denominadores: primero se reducen a común denominador y luego se suman solo los numeradores.', en: 'You do not add the denominators: first find a common denominator, then add only the numerators.' },
  no_multiplicar_numerador: { concepto: 'suma_fracciones',
    es: 'Al cambiar el denominador hay que multiplicar también el numerador por el mismo número.', en: 'When you change the denominator, you must also multiply the numerator by the same number.' },
  convertir_una_sola: { concepto: 'suma_fracciones',
    es: 'Las dos fracciones tienen que ponerse con el denominador común, no solo una de ellas.', en: 'Both fractions need to be converted to the common denominator, not just one of them.' },
  multiplicar_numeradores: { concepto: 'suma_fracciones',
    es: 'Es una suma, no un producto: con el mismo denominador se suman los numeradores.', en: 'It is a sum, not a product: with the same denominator, you add the numerators.' },
  operacion_contraria: { concepto: 'suma_fracciones',
    es: 'Mira el signo de la operación: aquí se hace la contraria de la que has hecho con los numeradores.', en: 'Look at the sign of the operation: you did the opposite one with the numerators.' },
  en_cruz: { concepto: 'suma_fracciones',
    es: 'Multiplicar en cruz es para dividir. Para sumar o restar, primero común denominador.', en: 'Cross-multiplying is for dividing. To add or subtract, first find a common denominator.' },
  natural_al_numerador: { concepto: 'suma_fracciones',
    es: 'Un número natural no se suma al numerador: primero se escribe como fracción con el mismo denominador (2 = 6/3).', en: 'A whole number is not added to the numerator: first write it as a fraction with the same denominator (2 = 6/3).' },
  signo_opuesto: { concepto: 'suma_fracciones',
    es: 'Comprueba el signo: gana el de la fracción con mayor valor absoluto, no siempre el del primero.', en: 'Check the sign: the result takes the sign of the fraction with the greater absolute value, not always the sign of the first one.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  comun_denominador: { es: 'Reducimos a común denominador.', en: 'We convert to a common denominator.' },
  sumar_numeradores: { es: 'Ahora se suman los numeradores; el denominador no cambia.', en: 'Now we add the numerators; the denominator stays the same.' },
  restar_numeradores: { es: 'Ahora se restan los numeradores; el denominador no cambia.', en: 'Now we subtract the numerators; the denominator stays the same.' },
  operar_numeradores: { es: 'Ahora se opera con los numeradores, cada uno con su signo; el denominador no cambia.', en: 'Now we work with the numerators, each with its sign; the denominator stays the same.' },
  simplificar: { es: 'Por último, simplificamos dividiendo numerador y denominador por el mismo número.', en: 'Finally, we simplify by dividing numerator and denominator by the same number.' },
};

const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

/** Los distractores documentados, barajados (el motor se planta en tres), y después los de relleno, también barajados. */
const pool = (rng, documentados, extras = []) => rng.barajar(documentados.filter(Boolean)).concat(rng.barajar(extras.filter(Boolean)));

/** Un término: { s: +1 | -1, n, d }; d = 1 es un número natural. */
const t = (s, n, d) => ({ s, n, d });
const escribe = ({ n, d }) => (d === 1 ? `${n}` : `\\frac{${n}}{${d}}`);
function suma(terminos, denominador = null) {
  return terminos.map((x, i) => {
    const cuerpo = denominador ? `\\frac{${x.n * (denominador / x.d)}}{${denominador}}` : escribe(x);
    return i === 0 ? `${x.s < 0 ? '-' : ''}${cuerpo}` : ` ${x.s < 0 ? '-' : '+'} ${cuerpo}`;
  }).join('');
}

/**
 * Calcula la cuenta y devuelve el ejercicio con la solución paso a paso y las
 * cuentas de los errores típicos (todas con los números del ítem).
 * `elegir(c)` recibe los candidatos y devuelve el pool de distractores.
 */
function cuenta(terminos, elegir) {
  const m = terminos.map(x => x.d).reduce(mcm);
  const num = terminos.reduce((a, x) => a + x.s * x.n * (m / x.d), 0);
  if (num === 0) return null;
  const enunciado = suma(terminos);
  const combinado = suma(terminos, m);
  const [nR, dR] = reducir(num, m);
  const g = mcd(num, m);
  const sinSimplificar = texFraccion(num, m);
  const signoNum = terminos.reduce((a, x) => a + x.s * x.n, 0); // los numeradores tal cual
  const sumaDen = terminos.reduce((a, x) => a + x.d, 0);
  const todosMas = terminos.every(x => x.s > 0);
  const todosMenos = terminos.slice(1).every(x => x.s < 0) && terminos[0].s > 0;
  const notaNum = terminos.length === 2 && todosMas ? 'sumar_numeradores' : terminos.length === 2 && todosMenos ? 'restar_numeradores' : 'operar_numeradores';
  const mismoDen = terminos.every(x => x.d === terminos[0].d);
  const c = {
    sumarDenominadores: fr(signoNum, sumaDen, E('sumar_numeradores_y_denominadores'), [
      mal(`${enunciado} = \\frac{${terminos.map((x, i) => `${i === 0 ? (x.s < 0 ? '-' : '') : (x.s < 0 ? '- ' : '+ ')}${x.n}`).join(' ')}}{${terminos.map(x => x.d).join(' + ')}} = ${texFraccion(signoNum, sumaDen)}`),
    ]),
    soloDenominador: mismoDen ? null : fr(signoNum, m, E('no_multiplicar_numerador'), [
      mal(`${enunciado} = \\frac{${terminos.map((x, i) => `${i === 0 ? (x.s < 0 ? '-' : '') : (x.s < 0 ? '- ' : '+ ')}${x.n}`).join(' ')}}{${m}} = ${texFraccion(signoNum, m)}`),
    ]),
    opuesto: fr(-num, m, E('signo_opuesto'), [
      paso(`${enunciado} = ${combinado}`, null, `\\text{mcm}(${terminos.map(x => x.d).join(', ')}) = ${m}`),
      mal(`${combinado} = ${texFraccion(-num, m)}`),
    ]),
    unaSola: terminos.map((x, i) => {
      if (x.d === m) return null;
      const num2 = terminos.reduce((a, y, j) => a + y.s * (j === i ? y.n : y.n * (m / y.d)), 0);
      const hecho = terminos.map((y, j) => ({ ...y, n: j === i ? y.n : y.n * (m / y.d), d: m }));
      return fr(num2, m, E('convertir_una_sola'), [
        mal(`${enunciado} = ${suma(hecho)} = ${texFraccion(num2, m)}`),
      ]);
    }),
  };
  const pasoSimplificar = g > 1
    ? [paso(`${sinSimplificar} = ${num < 0 ? '-' : ''}\\frac{${Math.abs(num)} \\div ${g}}{${m} \\div ${g}} = ${texFraccion(nR, dR)}`, 'simplificar', `\\text{mcd}(${Math.abs(num)}, ${m}) = ${g}`)]
    : [];
  return {
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = ${combinado}`, 'comun_denominador', `\\text{mcm}(${terminos.map(x => x.d).join(', ')}) = ${m}`),
      paso(`${combinado} = ${sinSimplificar}`, notaNum),
      ...pasoSimplificar,
    ],
    distractores: elegir(c, { m, num, enunciado, combinado }),
  };
}

// ---------------------------------------------------------------------------
// Formas.

/** U4-2C-01 · mismo denominador; el resultado es positivo. */
function mismoDenominador(rng) {
  const b = rng.entero(3, 12);
  let a = rng.entero(1, b - 1), c = rng.entero(1, b - 1);
  const resta = rng.moneda(0.4);
  if (resta) { if (a === c) return null; if (a < c) [a, c] = [c, a]; }
  const signo = resta ? -1 : 1;
  return cuenta([t(1, a, b), t(signo, c, b)], (k, { enunciado, combinado }) => pool(rng, [
    k.sumarDenominadores,
    fr(a * c, b, E('multiplicar_numeradores'), [mal(`${enunciado} = \\frac{${a} \\cdot ${c}}{${b}} = ${texFraccion(a * c, b)}`)]),
    fr(a - signo * c, b, E('operacion_contraria'), [mal(`${enunciado} = \\frac{${a} ${resta ? '+' : '-'} ${c}}{${b}} = ${texFraccion(a - signo * c, b)}`)]),
  ], [k.opuesto]));
}

/** U4-2C-02 · distinto denominador, con el m.c.m.; el resultado es positivo. */
function distintoDenominador(rng) {
  let b = rng.entero(2, 10), d = rng.entero(2, 10);
  while (b === d) d = rng.entero(2, 10);
  let a = rng.entero(1, b - 1), c = rng.entero(1, d - 1);
  const resta = rng.moneda(0.4);
  if (resta && a * d < c * b) { [a, b, c, d] = [c, d, a, b]; }
  const signo = resta ? -1 : 1;
  return cuenta([t(1, a, b), t(signo, c, d)], (k, { enunciado }) => pool(rng, [
    k.sumarDenominadores,
    fr(a * d, b * c, E('en_cruz'), [mal(`${enunciado} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = ${texFraccion(a * d, b * c)}`)]),
    k.soloDenominador,
  ], k.unaSola));
}

/** U4-2C-03 · un natural y una fracción: 2 + 1/3, 1 - 3/8. */
function naturalYFraccion(rng) {
  const b = rng.entero(2, 9);
  const resta = rng.moneda(0.4);
  const n = rng.entero(1, 4);
  const a = resta ? rng.entero(1, n * b - 1) : rng.entero(1, b - 1);
  const naturalPrimero = resta ? true : rng.moneda(0.5);
  const terminos = naturalPrimero ? [t(1, n, 1), t(resta ? -1 : 1, a, b)] : [t(1, a, b), t(1, n, 1)];
  const enun = suma(terminos);
  return cuenta(terminos, (k) => pool(rng, [
    // 2 + 1/3 = 3/3 (el natural al numerador) y 2 + 1/3 = 3/4 (sumar arriba y abajo).
    fr(n + (resta ? -a : a), b, E('natural_al_numerador'), [mal(`${enun} = \\frac{${n} ${resta ? '-' : '+'} ${a}}{${b}} = ${texFraccion(n + (resta ? -a : a), b)}`)]),
    k.sumarDenominadores,
  ], [
    fr(n * a, b, E('multiplicar_numeradores'), [mal(`${enun} = \\frac{${n} \\cdot ${a}}{${b}} = ${texFraccion(n * a, b)}`)]),
    fr(n * b + (resta ? a : -a), b, E('operacion_contraria'), [mal(`${enun} = \\frac{${n} \\cdot ${b} ${resta ? '+' : '-'} ${a}}{${b}} = ${texFraccion(n * b + (resta ? a : -a), b)}`)]),
  ]));
}

/** U4-2C-04 · tres fracciones con denominadores grandes (m.c.m. por factorización); resultado positivo. */
function tresFracciones(rng) {
  const DEN = [6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24, 28, 30, 36, 40];
  const ds = rng.barajar(DEN).slice(0, 3);
  const m = ds.reduce(mcm);
  if (m > 360) return null;
  const ns = ds.map(d => rng.entero(1, d - 1));
  const signos = [1, rng.moneda(0.5) ? 1 : -1, rng.moneda(0.5) ? 1 : -1];
  const terminos = ds.map((d, i) => t(signos[i], ns[i], d));
  if (terminos.reduce((a, x) => a + x.s * x.n * (m / x.d), 0) <= 0) return null; // aquí, resultado positivo
  return cuenta(terminos, k => pool(rng, [k.sumarDenominadores, k.soloDenominador], k.unaSola));
}

/** U4-2C-07 · con negativas: 1/4 - 2/3, -2/7 + 2, -1/4 - 2/3, -3/4 + 1/6. Sin paréntesis al empezar. */
function conNegativas(rng) {
  const forma = rng.elegir(['resta_negativa', 'natural', 'dos_negativas', 'mixta']);
  let b = rng.entero(2, 9), d = rng.entero(2, 9);
  const a = rng.entero(1, b - 1), c = rng.entero(1, d - 1);
  let terminos;
  if (forma === 'resta_negativa') {
    if (a * d >= c * b) return null; // la primera tiene que ser la menor: el resultado sale negativo
    terminos = [t(1, a, b), t(-1, c, d)];
  } else if (forma === 'natural') {
    terminos = [t(-1, a, b), t(1, rng.entero(1, 3), 1)];
  } else if (forma === 'dos_negativas') {
    terminos = [t(-1, a, b), t(-1, c, d)];
  } else {
    terminos = [t(-1, a, b), t(1, c, d)];
  }
  if (terminos[0].d === terminos[1].d && forma !== 'natural') return null; // aquí, denominadores distintos
  return cuenta(terminos, k => pool(rng, [
    k.opuesto,
    k.sumarDenominadores,
    k.soloDenominador,
  ], k.unaSola));
}

// ---------------------------------------------------------------------------

const subtipo = (id, items, forma) => ({
  id,
  items,
  generar: conReintentos(rng => {
    const datos = forma(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: { clave: 'calcula' }, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
});

export const SUBTIPOS = [
  subtipo('mismo_denominador', ['U4-2C-01'], mismoDenominador),
  subtipo('distinto_denominador', ['U4-2C-02'], distintoDenominador),
  subtipo('natural_y_fraccion', ['U4-2C-03'], naturalYFraccion),
  subtipo('tres_fracciones', ['U4-2C-04'], tresFracciones),
  subtipo('con_negativas', ['U4-2C-07'], conNegativas),
];

export default {
  id: 'suma_fracciones',
  nombre: { es: 'Suma y resta de fracciones', en: 'Adding and subtracting fractions' },
  curso: 1,
  concepto: 'suma_fracciones',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas: {},
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
