// Números enteros: sumas y restas con signos y paréntesis, y productos.
//
// Cada forma es un subtipo con las destrezas del inventario de la unidad 3
// que cubre (`items`, como en divisibilidad.js). Las formas del principio
// (sesiones 2-3) no llevan ningún paréntesis: 5 − 8, −4 + 9, −3 − 6. El
// paréntesis de un número (5 − (−3)) es de la sesión 6, y el producto y el
// cociente, también.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  negar_toda_la_suma: { concepto: 'enteros',
    es: 'Has sumado los dos valores y les has puesto signo negativo a todos. Cuando los signos son distintos, los valores se restan y el resultado lleva el signo del mayor.',
    en: 'You added both values and made the whole thing negative. When the signs are different, you subtract the values and the result takes the sign of the larger one.' },
  sumar_ignorando_signo: { concepto: 'enteros',
    es: 'Sumar un número negativo es lo mismo que restar: a + (−b) = a − b.', en: 'Adding a negative number is the same as subtracting: a + (−b) = a − b.' },
  menos_por_menos: { concepto: 'enteros',
    es: 'Restar un número negativo es sumar: a − (−b) = a + b.', en: 'Subtracting a negative number is the same as adding: a − (−b) = a + b.' },
  signo_resultado: { concepto: 'enteros',
    es: 'El resultado lleva el signo del número de mayor valor absoluto. Comprueba el signo.', en: 'The result takes the sign of the number with the greater absolute value. Check the sign.' },
  regla_signos: { concepto: 'enteros',
    es: 'Regla de los signos: dos signos iguales dan +, dos signos distintos dan −.', en: 'Rule of signs: two equal signs give +, two different signs give −.' },
  ambos_negativos: { concepto: 'enteros',
    es: 'Dos números negativos se suman y el resultado es negativo: −a − b = −(a + b).', en: 'Two negative numbers are added and the result is negative: −a − b = −(a + b).' },
  ambos_negativos_signo: { concepto: 'enteros',
    es: 'La regla de los signos es solo para multiplicar y dividir. Aquí se suma: −a − b = −(a + b), y el resultado es negativo.',
    en: 'The rule of signs is only for multiplying and dividing. Here you add: −a − b = −(a + b), and the result is negative.' },
  sumar_en_vez_de_multiplicar: { concepto: 'enteros',
    es: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.', en: 'It is a product, not a sum: multiply the values and apply the rule of signs.' },
  sumar_en_vez_de_multiplicar_signo: { concepto: 'enteros',
    es: 'Es un producto, no una suma: multiplica los valores y aplica la regla de los signos.', en: 'It is a product, not a sum: multiply the values and apply the rule of signs.' },
  sumar_en_vez_de_dividir: { concepto: 'enteros',
    es: 'Es una división, no una suma: divide los valores y aplica la regla de los signos.', en: 'It is a division, not an addition: divide the values and apply the rule of signs.' },
  derecha_a_izquierda: { concepto: 'enteros',
    es: 'Cada número lleva el signo que tiene justo delante. No le des al último el signo del anterior.',
    en: 'Each number keeps the sign right in front of it. Do not give the last number the sign of the one before.' },
  perder_signo_primero: { concepto: 'enteros',
    es: 'El primer número también lleva su signo: si empieza con un menos, ese menos cuenta.',
    en: 'The first number has its sign too: if it starts with a minus, that minus counts.' },
  ignorar_signos: { concepto: 'enteros',
    es: 'Los números negativos no se suman como si fueran positivos: cada número lleva el signo que tiene delante.',
    en: 'Negative numbers are not added as if they were positive: each number keeps the sign in front of it.' },
  dos_signos_opuesto: { concepto: 'enteros',
    es: 'Dos signos seguidos se juntan en uno: signos iguales dan +, signos distintos dan −.',
    en: 'Two signs in a row become one: equal signs give +, different signs give −.' },
  dos_signos_cero: { concepto: 'enteros',
    es: 'Los dos signos no hacen desaparecer el número: se juntan en un solo signo.',
    en: 'The two signs do not make the number disappear: they join into a single sign.' },
  restar_positivo: { concepto: 'enteros',
    es: 'Un menos delante de un paréntesis con un número positivo deja el número negativo: −(+6) = −6.',
    en: 'A minus in front of brackets with a positive number makes it negative: −(+6) = −6.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sumar_negativo: { es: 'Sumar un número negativo es restar.', en: 'Adding a negative number is subtracting.' },
  restar_negativo: { es: 'Restar un número negativo es sumar.', en: 'Subtracting a negative number is adding.' },
  ambos_negativos: { es: 'Los dos números son negativos: se suman y el resultado es negativo.', en: 'Both numbers are negative: add them and the result is negative.' },
  suma_signos_distintos: { es: 'Signos distintos: se restan los valores y el resultado lleva el signo del mayor.', en: 'Different signs: subtract the values and the result takes the sign of the larger one.' },
  resta_resultado_negativo: { es: 'Si el número que se resta es mayor, el resultado es negativo.', en: 'If the number being subtracted is bigger, the result is negative.' },
  signos_iguales: { es: 'Signos iguales: el producto es positivo.', en: 'Same signs: the product is positive.' },
  signos_distintos: { es: 'Signos distintos: el producto es negativo.', en: 'Different signs: the product is negative.' },
  cociente_signos_iguales: { es: 'Signos iguales: el cociente es positivo.', en: 'Same signs: the quotient is positive.' },
  cociente_signos_distintos: { es: 'Signos distintos: el cociente es negativo.', en: 'Different signs: the quotient is negative.' },
  cada_numero_su_signo: { es: 'Cada número lleva el signo que tiene delante; se calcula de izquierda a derecha.', en: 'Each number keeps the sign in front of it; work from left to right.' },
  agrupar_positivos_negativos: { es: 'Se ponen juntos los positivos y juntos los negativos, cada número con su signo.', en: 'Put the positives together and the negatives together, each number with its sign.' },
  sumar_cada_grupo: { es: 'Se suma cada grupo por separado.', en: 'Add each group separately.' },
  dos_signos: { es: 'Dos signos seguidos se juntan en uno: iguales dan +, distintos dan −.', en: 'Two signs in a row become one: equal give +, different give −.' },
  quitar_parentesis: { es: 'Se quita cada paréntesis juntando los dos signos en uno.', en: 'Remove each bracket by joining the two signs into one.' },
};

// ---------------------------------------------------------------------------
// Ayudas.

const T = tex;
const num = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const neg = n => `(-${n})`;
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

/** Cadena de sumas y restas: [-3, 8, -2] → «-3 + 8 - 2» (cada número con el signo que lleva delante). */
const cadena = ts => ts.map((t, i) => (i === 0 ? T(t) : t < 0 ? ` - ${-t}` : ` + ${t}`)).join('');
const suma = ts => ts.reduce((a, b) => a + b, 0);

/**
 * Tres distractores de un pool de candidatos: sin repetidos, ninguno igual a la
 * correcta, y barajados antes de recortar (si `construirOpciones` recibe más de
 * tres, los sobrantes son código muerto: ver CLAUDE.md).
 */
function tresDe(rng, correctaValor, pool) {
  const vistos = new Set([correctaValor]);
  const unicos = pool.filter(d => !vistos.has(d.clave) && vistos.add(d.clave));
  return rng.barajar(unicos).slice(0, 3);
}

// ---------------------------------------------------------------------------
// Sin paréntesis (sesiones 2-3).

function restaNaturales(rng) {
  // a − b con b > a            U3-1C-11
  const a = rng.entero(1, 12), b = a + rng.entero(1, 12);
  const enunciado = `${a} - ${b}`;
  return {
    enunciado,
    correcta: num(a - b),
    solucion: [paso(`${enunciado} = ${T(a - b)}`, 'resta_resultado_negativo')],
    distractores: [
      num(b - a, E('signo_resultado'), [mal(`${enunciado} = ${T(b - a)}`)]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = ${T(-(a + b))}`, `${a} + ${b} = ${a + b}`),
      ]),
      num(a + b, E('sumar_ignorando_signo'), [mal(`${enunciado} = ${T(a + b)}`)]),
    ],
  };
}

function negativoMasPositivo(rng) {
  // −a + b, con a ≠ b           U3-1C-12
  const a = rng.entero(2, 15);
  let b = rng.entero(2, 15);
  if (b === a) b = a === 15 ? 14 : a + 1;
  const enunciado = `-${a} + ${b}`;
  return {
    enunciado,
    correcta: num(b - a),
    solucion: [paso(`${enunciado} = ${b} - ${a} = ${T(b - a)}`, 'suma_signos_distintos')],
    distractores: [
      num(a - b, E('signo_resultado'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = ${T(-(a + b))}`, `${a} + ${b} = ${a + b}`),
      ]),
      num(a + b, E('sumar_ignorando_signo'), [
        mal(`${enunciado} = ${a} + ${b}`),
        paso(`${a} + ${b} = ${T(a + b)}`),
      ]),
    ],
  };
}

function negativoMenosPositivo(rng) {
  // −a − b                      U3-1C-13, U3-2C-21
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `-${a} - ${b}`;
  return {
    enunciado,
    correcta: num(-(a + b)),
    solucion: [
      paso(`${enunciado} = ${T(-(a + b))}`, 'ambos_negativos', `${a} + ${b} = ${a + b}`),
    ],
    distractores: [
      num(b - a, E('ambos_negativos'), [
        mal(`${enunciado} = ${b} - ${a}`),
        paso(`${b} - ${a} = ${T(b - a)}`),
      ]),
      num(a + b, E('ambos_negativos_signo'), [
        mal(`${enunciado} = ${T(a + b)}`, `${a} + ${b} = ${a + b}`),
      ]),
      num(a - b, E('ambos_negativos'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
    ],
  };
}

/** Errores típicos de una cadena de sumas y restas con los números de la cadena. */
function erroresDeCadena(ts) {
  const enunciado = cadena(ts), R = suma(ts);
  const mala = (id, malos) => num(suma(malos), E(id), [
    mal(`${enunciado} = ${cadena(malos)}`),
    paso(`${cadena(malos)} = ${T(suma(malos))}`),
  ]);
  const pool = [];
  // Operar de derecha a izquierda: 2 − 4 + 3 = 2 − 7 (el último toma el signo del anterior).
  for (let k = 1; k + 1 < ts.length; k++) {
    if (Math.sign(ts[k]) === Math.sign(ts[k + 1])) continue;
    const malos = ts.slice();
    malos[k + 1] = Math.sign(ts[k]) * Math.abs(ts[k + 1]);
    pool.push(mala('derecha_a_izquierda', malos));
  }
  // Perder el signo del primer término.
  if (ts[0] < 0) pool.push(mala('perder_signo_primero', [-ts[0], ...ts.slice(1)]));
  // Sumar todos los valores como si fueran positivos.
  pool.push(mala('ignorar_signos', ts.map(Math.abs)));
  // Signo contrario al del resultado (13 − 19 = 6).
  pool.push(num(-R, E('signo_resultado'), [mal(`${enunciado} = ${T(-R)}`)]));
  return pool;
}

function cadenaCorta(rng) {
  // −3 + 8 − 2                  U3-1A-01
  const v = () => rng.entero(1, 12);
  const s1 = rng.moneda() ? -1 : 1, s2 = rng.moneda() ? -1 : 1;
  const ts = [s1 * v(), s2 * v(), -s2 * v()];
  const R = suma(ts), enunciado = cadena(ts);
  return {
    enunciado,
    correcta: num(R),
    solucion: [
      paso(`${enunciado} = ${T(ts[0] + ts[1])} ${ts[2] < 0 ? '-' : '+'} ${Math.abs(ts[2])}`, 'cada_numero_su_signo'),
      paso(`${T(ts[0] + ts[1])} ${ts[2] < 0 ? '-' : '+'} ${Math.abs(ts[2])} = ${T(R)}`),
    ],
    distractores: tresDe(rng, R, erroresDeCadena(ts)),
  };
}

function cadenaLarga(rng) {
  // −6 + 5 − 4 + 8 − 9 = 13 − 19   U3-2A-01, U3-2C-01
  const n = rng.entero(4, 6);
  const ts = Array.from({ length: n }, () => (rng.moneda() ? -1 : 1) * rng.entero(1, 15));
  const pos = ts.filter(t => t > 0), negs = ts.filter(t => t < 0).map(t => -t);
  if (!pos.length || !negs.length) return null;
  const P = suma(pos), N = suma(negs), R = P - N;
  const enunciado = cadena(ts);
  const ordenada = [...pos, ...negs.map(t => -t)];
  const pasosBuenos = [
    paso(`${enunciado} = ${cadena(ordenada)}`, 'agrupar_positivos_negativos'),
    paso(`${cadena(ordenada)} = ${P} - ${N}`, 'sumar_cada_grupo', `${pos.join(' + ')} = ${P} ; ${negs.join(' + ')} = ${N}`),
  ];
  const alReves = num(N - P, E('signo_resultado'), [...pasosBuenos, mal(`${P} - ${N} = ${T(N - P)}`)]);
  const pool = erroresDeCadena(ts).filter(d => d.clave !== -R);
  pool.push(alReves);
  return {
    enunciado,
    correcta: num(R),
    solucion: [...pasosBuenos, paso(`${P} - ${N} = ${T(R)}`)],
    distractores: tresDe(rng, R, pool),
  };
}

// ---------------------------------------------------------------------------
// Con el paréntesis de un número (sesión 6).

function sumaNegativo(rng) {
  // a + (−b)                    U3-2C-05
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${a} + ${neg(b)}`;
  return {
    enunciado,
    correcta: num(a - b),
    solucion: [paso(`${enunciado} = ${a} - ${b} = ${T(a - b)}`, 'sumar_negativo')],
    distractores: [
      num(a + b, E('sumar_ignorando_signo'), [
        mal(`${enunciado} = ${a} + ${b}`),
        paso(`${a} + ${b} = ${T(a + b)}`),
      ]),
      num(b - a, E('signo_resultado'), [
        paso(`${enunciado} = ${a} - ${b}`),
        mal(`${a} - ${b} = ${T(b - a)}`),
      ]),
      num(-(a + b), E('negar_toda_la_suma'), [
        mal(`${enunciado} = ${T(-(a + b))}`, `${a} + ${b} = ${a + b}`),
      ]),
    ],
  };
}

function restaNegativo(rng) {
  // a − (−b)                    U3-2C-06
  const a = rng.entero(2, 15), b = rng.entero(2, 15);
  const enunciado = `${a} - ${neg(b)}`;
  return {
    enunciado,
    correcta: num(a + b),
    solucion: [paso(`${enunciado} = ${a} + ${b} = ${T(a + b)}`, 'restar_negativo')],
    distractores: [
      num(a - b, E('menos_por_menos'), [
        mal(`${enunciado} = ${a} - ${b}`),
        paso(`${a} - ${b} = ${T(a - b)}`),
      ]),
      num(b - a, E('menos_por_menos'), [
        mal(`${enunciado} = ${b} - ${a}`),
        paso(`${b} - ${a} = ${T(b - a)}`),
      ]),
      num(-(a + b), E('signo_resultado'), [
        mal(`${enunciado} = ${T(-(a + b))}`, `${a} + ${b} = ${a + b}`),
      ]),
    ],
  };
}

function negativoMenosNegativo(rng) {
  // −a − (−b), con a ≠ b        U3-2C-06
  const a = rng.entero(2, 15);
  let b = rng.entero(2, 15);
  if (b === a) b = a === 15 ? 14 : a + 1;
  const enunciado = `-${a} - ${neg(b)}`;
  return {
    enunciado,
    correcta: num(b - a),
    solucion: [paso(`${enunciado} = -${a} + ${b} = ${T(b - a)}`, 'restar_negativo')],
    distractores: tresDe(rng, b - a, [
      num(-(a + b), E('menos_por_menos'), [
        mal(`${enunciado} = -${a} - ${b}`),
        paso(`-${a} - ${b} = ${T(-(a + b))}`, null, `${a} + ${b} = ${a + b}`),
      ]),
      num(a - b, E('signo_resultado'), [
        paso(`${enunciado} = -${a} + ${b}`),
        mal(`-${a} + ${b} = ${T(a - b)}`),
      ]),
      num(a + b, E('menos_por_menos'), [mal(`${enunciado} = ${T(a + b)}`)]),
    ]),
  };
}

function dosSignos(rng) {
  // −(−9), +(−4), −(+6)         U3-2C-07
  const n = rng.entero(2, 15);
  const [enunciado, valor] = rng.elegir([
    [`-${neg(n)}`, n],
    [`+${neg(n)}`, -n],
    [`-(+${n})`, -n],
  ]);
  const genericos = [num(valor + 1), num(valor - 1)];
  return {
    enunciado,
    correcta: num(valor),
    solucion: [paso(`${enunciado} = ${T(valor)}`, 'dos_signos')],
    distractores: [
      num(-valor, E('dos_signos_opuesto'), [mal(`${enunciado} = ${T(-valor)}`)]),
      num(0, E('dos_signos_cero'), [mal(`${enunciado} = 0`)]),
    ],
    genericos,
  };
}

function quitarParentesis(rng) {
  // (−2) − (+6) + (−4) − (−9) = −2 − 6 − 4 + 9      U3-2C-08
  const k = 4;
  const terminos = Array.from({ length: k }, (_, i) => ({
    op: i === 0 ? '+' : rng.moneda() ? '-' : '+',
    s: rng.moneda() ? -1 : 1,
    n: rng.entero(1, 12),
  }));
  const texto = t => `(${t.s < 0 ? '-' : '+'}${t.n})`;
  const enunciado = terminos.map((t, i) => (i === 0 ? texto(t) : ` ${t.op} ${texto(t)}`)).join('');
  const valores = terminos.map(t => (t.op === '-' ? -t.s : t.s) * t.n);
  const R = suma(valores);
  const quitados = cadena(valores);
  const pool = [];
  terminos.forEach((t, i) => {
    if (i === 0 || (t.op === '+' && t.s > 0)) return;
    const malos = valores.slice();
    malos[i] = -malos[i];
    const id = t.op === '-' ? (t.s < 0 ? 'menos_por_menos' : 'restar_positivo') : 'sumar_ignorando_signo';
    pool.push(num(suma(malos), E(id), [
      mal(`${enunciado} = ${cadena(malos)}`),
      paso(`${cadena(malos)} = ${T(suma(malos))}`),
    ]));
  });
  // Tres errores típicos distintos, o se prueba con otros números (sin rellenar con genéricos).
  const distractores = tresDe(rng, R, pool);
  if (distractores.length < 3) return null;
  return {
    enunciado,
    correcta: num(R),
    solucion: [
      paso(`${enunciado} = ${quitados}`, 'quitar_parentesis'),
      paso(`${quitados} = ${T(R)}`),
    ],
    distractores,
  };
}

function producto(rng) {
  // (−2) · (−3), 5 · (−2)       U3-2C-15
  const a = rng.entero(2, 9), b = rng.entero(2, 9);
  const signoA = rng.moneda() ? -1 : 1, signoB = signoA > 0 ? -1 : rng.moneda() ? -1 : 1;
  const A = signoA * a, B = signoB * b;
  const izq = A < 0 ? neg(a) : `${a}`, der = B < 0 ? neg(b) : `${b}`;
  const enunciado = `${izq} \\cdot ${der}`;
  const notaSigno = signoA === signoB ? 'signos_iguales' : 'signos_distintos';
  return {
    enunciado,
    correcta: num(A * B),
    solucion: [paso(`${enunciado} = ${T(A * B)}`, notaSigno, `${a} \\cdot ${b} = ${a * b}`)],
    distractores: [
      num(-A * B, E('regla_signos'), [
        mal(`${enunciado} = ${T(-A * B)}`, `${a} \\cdot ${b} = ${a * b}`),
      ]),
      num(A + B, E('sumar_en_vez_de_multiplicar'), [
        mal(`${enunciado} = ${izq} + ${der}`),
        paso(`${izq} + ${der} = ${T(A + B)}`),
      ]),
      num(-(A + B), E('sumar_en_vez_de_multiplicar_signo'), [
        mal(`${enunciado} = ${T(-(A + B))}`, `${izq} + ${der} = ${T(A + B)}`),
      ]),
    ],
    genericos: [num(A * B + (A * B > 0 ? 1 : -1))],
  };
}

function cociente(rng) {
  // (−12) : 4, (−36) : (−9)     U3-2C-18
  const q = rng.entero(2, 9), b = rng.entero(2, 9);
  const signoA = rng.moneda() ? -1 : 1, signoB = signoA > 0 ? -1 : rng.moneda() ? -1 : 1;
  const A = signoA * q * b, B = signoB * b, C = signoA * signoB * q;
  const izq = A < 0 ? neg(q * b) : `${q * b}`, der = B < 0 ? neg(b) : `${b}`;
  const enunciado = `${izq} \\div ${der}`;
  const notaSigno = signoA === signoB ? 'cociente_signos_iguales' : 'cociente_signos_distintos';
  return {
    enunciado,
    correcta: num(C),
    solucion: [paso(`${enunciado} = ${T(C)}`, notaSigno, `${q * b} \\div ${b} = ${q}`)],
    distractores: tresDe(rng, C, [
      num(-C, E('regla_signos'), [mal(`${enunciado} = ${T(-C)}`, `${q * b} \\div ${b} = ${q}`)]),
      num(A + B, E('sumar_en_vez_de_dividir'), [
        mal(`${enunciado} = ${izq} + ${der}`),
        paso(`${izq} + ${der} = ${T(A + B)}`),
      ]),
      num(-(A + B), E('sumar_en_vez_de_dividir'), [
        mal(`${enunciado} = ${T(-(A + B))}`, `${izq} + ${der} = ${T(A + B)}`),
      ]),
    ]),
    genericos: [num(C + (C > 0 ? 1 : -1))],
  };
}

// ---------------------------------------------------------------------------

/** Convierte una forma en un generador que devuelve el ejercicio completo. */
const subtipo = (id, items, forma) => ({
  id,
  items,
  generar: conReintentos(rng => {
    const f = forma(rng);
    if (!f) return null;
    const { enunciado, correcta, solucion, distractores, genericos } = f;
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: { clave: 'calcula' }, enunciado, solucion, opciones };
  }),
});

export const SUBTIPOS = [
  subtipo('resta_naturales', ['U3-1C-11'], restaNaturales),
  subtipo('negativo_mas_positivo', ['U3-1C-12'], negativoMasPositivo),
  subtipo('negativo_menos_positivo', ['U3-1C-13', 'U3-2C-21'], negativoMenosPositivo),
  subtipo('cadena_corta', ['U3-1A-01'], cadenaCorta),
  subtipo('cadena_larga', ['U3-2A-01', 'U3-2C-01'], cadenaLarga),
  subtipo('suma_negativo', ['U3-2C-05'], sumaNegativo),
  subtipo('resta_negativo', ['U3-2C-06'], restaNegativo),
  subtipo('negativo_menos_negativo', ['U3-2C-06'], negativoMenosNegativo),
  subtipo('dos_signos', ['U3-2C-07'], dosSignos),
  subtipo('quitar_parentesis', ['U3-2C-08'], quitarParentesis),
  subtipo('producto', ['U3-2C-15'], producto),
  subtipo('cociente', ['U3-2C-18'], cociente),
];

export default {
  id: 'enteros',
  nombre: { es: 'Números enteros', en: 'Integers' },
  curso: 1,
  concepto: 'enteros',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas: {},
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
