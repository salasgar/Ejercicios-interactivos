// Sistemas de dos ecuaciones lineales con dos incógnitas: por sustitución
// (la primera ecuación ya tiene la y despejada) y por reducción (los
// coeficientes de la y son opuestos). Como hay dos incógnitas, la opción
// correcta las representa juntas en un solo texto («x, y»).

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  confunde_x_con_y: { concepto: 'sistemas_ecuaciones',
    es: 'Has intercambiado los valores de x e y: revisa en qué ecuación despejaste cada una.', en: 'You swapped the values of x and y: check which equation you isolated each one from.' },
  repite_valor_de_x: { concepto: 'sistemas_ecuaciones',
    es: 'Te has quedado con el valor de x para las dos incógnitas: falta sustituirlo y resolver también para y.', en: 'You kept the value of x for both unknowns: you still need to substitute it and solve for y too.' },
  repite_valor_de_y: { concepto: 'sistemas_ecuaciones',
    es: 'Te has quedado con el valor de y para las dos incógnitas: falta resolver también para x.', en: 'You kept the value of y for both unknowns: you still need to solve for x too.' },
};
const E = erroresDe(errores);

export const preguntas = {
  resuelve: { es: 'Resuelve el sistema de ecuaciones:', en: 'Solve the system of equations:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  despejar_y: { es: 'La y ya está despejada en la primera ecuación.', en: 'y is already isolated in the first equation.' },
  sustituir_en_segunda: { es: 'Sustituimos esa expresión de y en la segunda ecuación.', en: 'We substitute that expression for y into the second equation.' },
  resolver_x: { es: 'Resolvemos la ecuación con una sola incógnita.', en: 'We solve the equation, which now has a single unknown.' },
  sustituir_x_en_y: { es: 'Sustituimos el valor de x para hallar y.', en: 'We substitute the value of x to find y.' },
  sumar_ecuaciones: { es: 'Los coeficientes de la y son opuestos: al sumar las dos ecuaciones, la y desaparece.', en: 'The coefficients of y are opposites: adding the two equations makes y disappear.' },
  despejar_x: { es: 'Resolvemos la ecuación resultante, con una sola incógnita.', en: 'We solve the resulting equation, which has a single unknown.' },
  sustituir_x_en_una_ecuacion: { es: 'Sustituimos el valor de x en cualquiera de las dos ecuaciones para hallar y.', en: 'We substitute the value of x into either equation to find y.' },
};

const T = tex;
const signo = n => (n >= 0 ? '+' : '-');
const abs = n => Math.abs(n);
const terminoX = a => (a === 1 ? 'x' : a === -1 ? '-x' : `${T(a)}x`);
const terminoY = a => (a === 1 ? 'y' : a === -1 ? '-y' : `${T(a)}y`);
const par = (texto, clave, error, pasos) => ({ tex: texto, clave, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

/** Los tres distractores «genéricos» de cualquier sistema: intercambiar x e y, o repetir una de las dos. */
function distractoresComunes(x, y) {
  return [
    par(`${T(y)}, ${T(x)}`, `${y}|${x}`, E('confunde_x_con_y'), [
      mal(`x = ${T(y)}, y = ${T(x)}`),
    ]),
    par(`${T(x)}, ${T(x)}`, `${x}|${x}`, E('repite_valor_de_x'), [
      mal(`x = ${T(x)}, y = ${T(x)}`),
    ]),
    par(`${T(y)}, ${T(y)}`, `${y}|${y}`, E('repite_valor_de_y'), [
      mal(`x = ${T(y)}, y = ${T(y)}`),
    ]),
  ];
}

const COEFS = [-4, -3, -2, -1, 1, 2, 3, 4];

function sustitucion(rng) {
  const x = rng.entero(-8, 8), y = rng.entero(-8, 8);
  if (x === y) return null; // evita que los distractores «intercambia» o «repite» coincidan con la correcta
  const a1 = rng.elegir(COEFS);
  const c1 = a1 * x + y;
  const a2 = rng.elegir(COEFS);
  const b2 = rng.elegir(COEFS);
  if (a2 === a1 * b2) return null;
  const c2 = a2 * x + b2 * y;
  const enunciado = `${terminoX(a1)} + y = ${T(c1)} \\quad ${terminoX(a2)} ${signo(b2)} ${T(abs(b2))}y = ${T(c2)}`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: par(`${T(x)}, ${T(y)}`, `${x}|${y}`),
    solucion: [
      paso(`y = ${T(c1)} ${signo(-a1)} ${T(abs(a1))}x`, 'despejar_y'),
      paso(`${terminoX(a2)} ${signo(b2)} ${T(abs(b2))}(${T(c1)} ${signo(-a1)} ${T(abs(a1))}x) = ${T(c2)}`, 'sustituir_en_segunda'),
      paso(`x = ${T(x)}`, 'resolver_x'),
      paso(`y = ${T(c1)} ${signo(-a1)} ${T(abs(a1))} \\cdot ${T(x)} = ${T(y)}`, 'sustituir_x_en_y'),
    ],
    distractores: distractoresComunes(x, y),
  };
}

function reduccion(rng) {
  const x = rng.entero(-8, 8), y = rng.entero(-8, 8);
  if (x === y) return null; // evita que los distractores «intercambia» o «repite» coincidan con la correcta
  const a1 = rng.entero(1, 6), a2 = rng.entero(1, 6);
  const b = rng.entero(1, 6);
  const c1 = a1 * x + b * y;
  const c2 = a2 * x - b * y;
  const enunciado = `${terminoX(a1)} + ${terminoY(b)} = ${T(c1)} \\quad ${terminoX(a2)} - ${terminoY(b)} = ${T(c2)}`;
  const sumaCoefs = a1 + a2, sumaTotales = c1 + c2;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: par(`${T(x)}, ${T(y)}`, `${x}|${y}`),
    solucion: [
      paso(`(${terminoX(a1)} + ${terminoY(b)}) + (${terminoX(a2)} - ${terminoY(b)}) = ${T(c1)} + ${T(c2)}`, 'sumar_ecuaciones'),
      paso(`${T(sumaCoefs)}x = ${T(sumaTotales)}`, null),
      paso(`x = ${T(sumaTotales)} \\div ${T(sumaCoefs)} = ${T(x)}`, 'despejar_x'),
      paso(`${terminoX(a1)} + ${terminoY(b)} = ${T(c1)} \\Rightarrow y = ${T(y)}`, 'sustituir_x_en_una_ecuacion'),
    ],
    distractores: distractoresComunes(x, y),
  };
}

const FORMAS = [sustitucion, sustitucion, reduccion, reduccion];

export default {
  id: 'sistemas_ecuaciones',
  nombre: { es: 'Sistemas de ecuaciones', en: 'Systems of equations' },
  curso: 2,
  concepto: 'sistemas_ecuaciones',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    const { texto, enunciado, correcta, solucion, distractores } = datos;
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
