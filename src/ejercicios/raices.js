// Raíces cuadradas de números naturales: exactas y aproximación a la unidad
// (entre qué dos cuadrados perfectos consecutivos está el radicando).

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  raiz_como_mitad: { concepto: 'raices',
    es: 'La raíz cuadrada no es la mitad del número: busca qué número multiplicado por sí mismo da el radicando.',
    en: 'The square root is not half the number: look for the number that multiplied by itself gives the radicand.' },
  raiz_como_cuadrado: { concepto: 'raices',
    es: 'Has elevado al cuadrado en vez de calcular la raíz: son operaciones opuestas.',
    en: 'You squared the number instead of taking its square root: they are opposite operations.' },
  vecino_sin_comprobar: { concepto: 'raices',
    es: 'Te has quedado con un número cercano sin comprobarlo: multiplícalo por sí mismo para ver si da el radicando.',
    en: 'You picked a nearby number without checking it: multiply it by itself to see if it gives the radicand.' },
  redondeo_equivocado: { concepto: 'raices',
    es: 'Te has quedado con el cuadrado perfecto más lejano. Compara las dos diferencias y elige la más pequeña.',
    en: 'You picked the farther perfect square. Compare both differences and choose the smaller one.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  comprobar_cuadrado: { es: 'Buscamos qué número multiplicado por sí mismo da el radicando.', en: 'We look for the number that multiplied by itself gives the radicand.' },
  entre_dos_cuadrados: { es: 'El radicando está entre estos dos cuadrados perfectos consecutivos.', en: 'The radicand is between these two consecutive perfect squares.' },
  mas_cercano: { es: 'Nos quedamos con el cuadrado perfecto más cercano.', en: 'We keep the closer perfect square.' },
};

const num = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const T = tex;

function generarExacta(rng) {
  const b = rng.entero(2, 15);
  const n = b * b;
  const enunciado = `\\sqrt{${n}}`;
  const vecino = rng.moneda() || b === 2 ? b + 1 : b - 1;
  return {
    texto: { clave: 'calcula' },
    enunciado,
    correcta: num(b),
    solucion: [
      paso(`${enunciado} = ${b}`, 'comprobar_cuadrado', `${b} \\cdot ${b} = ${n}`),
    ],
    distractores: [
      num(Math.round(n / 2), E('raiz_como_mitad'), [
        mal(`${enunciado} = ${n} \\div 2 = ${T(Math.round(n / 2))}`),
      ]),
      num(n * n, E('raiz_como_cuadrado'), [
        mal(`${enunciado} = ${n}^{2} = ${T(n * n)}`),
      ]),
      num(vecino, E('vecino_sin_comprobar'), [
        mal(`${enunciado} = ${vecino}`, `${vecino} \\cdot ${vecino} = ${vecino * vecino} \\neq ${n}`),
      ]),
    ],
    genericos: [num(b + 3), num(Math.max(1, b - 3))],
  };
}

function generarAproximada(rng) {
  const b = rng.entero(2, 11);
  const n = b * b + rng.entero(1, 2 * b);
  const b1 = b + 1;
  const distB = n - b * b, distB1 = b1 * b1 - n;
  const correcta = distB <= distB1 ? b : b1;
  const otro = correcta === b ? b1 : b;
  const enunciado = `\\sqrt{${n}}`;
  const lejos1 = b > 2 ? b - 1 : b1 + 2;
  const lejos2 = b1 + 1;
  return {
    texto: { clave: 'calcula' },
    enunciado,
    correcta: num(correcta),
    solucion: [
      paso(`${b}^{2} = ${b * b} \\quad ${b1}^{2} = ${b1 * b1}`, 'entre_dos_cuadrados'),
      paso(`${enunciado} \\approx ${correcta}`, 'mas_cercano', `${n} - ${b * b} = ${distB} \\quad ${b1 * b1} - ${n} = ${distB1}`),
    ],
    distractores: [
      num(otro, E('redondeo_equivocado'), [
        mal(`${enunciado} \\approx ${otro}`, `${otro}^{2} = ${otro * otro}`),
      ]),
      num(lejos1, E('vecino_sin_comprobar'), [
        mal(`${enunciado} \\approx ${lejos1}`),
      ]),
      num(lejos2, E('vecino_sin_comprobar'), [
        mal(`${enunciado} \\approx ${lejos2}`),
      ]),
    ],
  };
}

const FORMAS = [generarExacta, generarExacta, generarAproximada];

export default {
  id: 'raices',
  pasosLibres: true,
  nombre: { es: 'Raíces cuadradas', en: 'Square roots' },
  curso: 1,
  concepto: 'raices',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
