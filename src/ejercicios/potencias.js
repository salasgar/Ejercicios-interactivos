// Potencias de exponente natural: cálculo directo y propiedades (producto,
// cociente y potencia de potencia con la misma base).

import { construirOpciones, conReintentos, tex } from './index.js';

const E = {
  potenciaComoProducto: {
    id: 'potencia_como_producto',
    concepto: 'potencias',
    feedback: 'La potencia repite la base tantas veces como dice el exponente: 2³ = 2·2·2, no 2·3.',
  },
  intercambiar: {
    id: 'base_exponente_intercambiados',
    concepto: 'potencias',
    feedback: 'Has cambiado la base por el exponente: la base es el número grande y se repite; el exponente cuenta las veces.',
  },
  multiplicarExponentes: {
    id: 'multiplicar_exponentes',
    concepto: 'potencias',
    feedback: 'Al multiplicar potencias de la misma base, los exponentes se suman, no se multiplican.',
  },
  multiplicarBases: {
    id: 'multiplicar_bases',
    concepto: 'potencias',
    feedback: 'Al multiplicar potencias de la misma base, la base se mantiene: solo cambian los exponentes.',
  },
  sumarExponentesPotencia: {
    id: 'sumar_exponentes_potencia',
    concepto: 'potencias',
    feedback: 'En una potencia de potencia los exponentes se multiplican, no se suman.',
  },
  sumarExponentesCociente: {
    id: 'sumar_exponentes_cociente',
    concepto: 'potencias',
    feedback: 'Al dividir potencias de la misma base, los exponentes se restan.',
  },
  dividirExponentes: {
    id: 'dividir_exponentes',
    concepto: 'potencias',
    feedback: 'Al dividir potencias de la misma base, los exponentes se restan, no se dividen.',
  },
  multiplicarExponentesCociente: {
    id: 'multiplicar_exponentes_cociente',
    concepto: 'potencias',
    feedback: 'Al dividir potencias de la misma base, los exponentes se restan, no se multiplican.',
  },
};

const num = (v, error) => ({ tex: tex(v), clave: v, error });
const pot = (base, exp, error) => ({ tex: `${base}^{${exp}}`, clave: `${base}^${exp}`, error });

function generarCalculo(rng) {
  const base = rng.elegir([2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10]);
  const exp = base === 10 ? rng.entero(2, 5) : base <= 3 ? rng.entero(2, 4) : base <= 5 ? rng.entero(2, 3) : 2;
  const correcta = base ** exp;
  return {
    texto: 'Calcula:',
    enunciado: `${base}^{${exp}}`,
    correcta: num(correcta),
    distractores: [
      num(base * exp, E.potenciaComoProducto),
      num(exp ** base, E.intercambiar),
      num(base ** (exp - 1) * exp, { ...E.potenciaComoProducto, id: 'potencia_mal_contada' }),
    ],
    genericos: [num(base + exp), num(base ** exp + base), num(base ** (exp + 1))],
  };
}

function generarProducto(rng) {
  const base = rng.entero(2, 9), m = rng.entero(2, 5), n = rng.entero(2, 5);
  return {
    texto: 'Escribe como una sola potencia:',
    enunciado: `${base}^{${m}} \\cdot ${base}^{${n}}`,
    correcta: pot(base, m + n),
    distractores: [
      pot(base, m * n, E.multiplicarExponentes),
      pot(base * base, m + n, E.multiplicarBases),
      pot(base * base, m * n, { ...E.multiplicarBases, id: 'multiplicar_todo' }),
    ],
  };
}

function generarCociente(rng) {
  const base = rng.entero(2, 9), n = rng.entero(2, 4), m = n + rng.entero(1, 4);
  return {
    texto: 'Escribe como una sola potencia:',
    enunciado: `${base}^{${m}} : ${base}^{${n}}`,
    correcta: pot(base, m - n),
    distractores: [
      pot(base, m + n, E.sumarExponentesCociente),
      pot(1, m - n, { ...E.multiplicarBases, id: 'dividir_bases', feedback: 'Al dividir potencias de la misma base, la base se mantiene: solo cambian los exponentes.' }),
      m % n === 0 ? pot(base, m / n, E.dividirExponentes) : pot(base, m * n, E.multiplicarExponentesCociente),
    ],
  };
}

function generarPotenciaDePotencia(rng) {
  const base = rng.entero(2, 9), m = rng.entero(2, 5), n = rng.entero(2, 4);
  return {
    texto: 'Escribe como una sola potencia:',
    enunciado: `\\left(${base}^{${m}}\\right)^{${n}}`,
    correcta: pot(base, m * n),
    distractores: [
      pot(base, m + n, E.sumarExponentesPotencia),
      pot(base * n, m, { ...E.multiplicarBases, id: 'exponente_a_la_base', feedback: 'El exponente de fuera afecta a toda la potencia: se multiplican los exponentes y la base no cambia.' }),
      pot(base, m ** n, { ...E.sumarExponentesPotencia, id: 'exponente_de_exponente', feedback: 'En una potencia de potencia los exponentes se multiplican: (2³)² = 2⁶.' }),
    ],
  };
}

const FORMAS = [generarCalculo, generarCalculo, generarProducto, generarCociente, generarPotenciaDePotencia];

export default {
  id: 'potencias',
  nombre: 'Potencias',
  curso: 1,
  concepto: 'potencias',
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, opciones };
  }),
};
