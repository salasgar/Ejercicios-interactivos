// Fracciones equivalentes: reconocer una equivalente y simplificar.

import { construirOpciones, conReintentos, texFraccion, claveFraccion, mcd } from './index.js';

const E = {
  sumarMismoNumero: {
    id: 'sumar_mismo_numero',
    concepto: 'fracciones_equivalentes',
    feedback: 'Para obtener una fracción equivalente se multiplica (o divide) numerador y denominador por el mismo número; sumar no vale.',
  },
  soloNumerador: {
    id: 'solo_numerador',
    concepto: 'fracciones_equivalentes',
    feedback: 'Hay que multiplicar el numerador y el denominador por el mismo número, no solo uno de los dos.',
  },
  soloDenominador: {
    id: 'solo_denominador',
    concepto: 'fracciones_equivalentes',
    feedback: 'Hay que multiplicar el numerador y el denominador por el mismo número, no solo uno de los dos.',
  },
  invertir: {
    id: 'invertir',
    concepto: 'fracciones_equivalentes',
    feedback: 'Has intercambiado numerador y denominador: la fracción invertida no es equivalente.',
  },
  simplificarUnoSolo: {
    id: 'simplificar_uno_solo',
    concepto: 'fracciones_equivalentes',
    feedback: 'Al simplificar hay que dividir numerador y denominador por el mismo número.',
  },
  restarMismoNumero: {
    id: 'restar_mismo_numero',
    concepto: 'fracciones_equivalentes',
    feedback: 'Simplificar es dividir arriba y abajo por el mismo número; restar cambia el valor de la fracción.',
  },
};

const fr = (n, d, error) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error });

function fraccionIrreducible(rng) {
  let n = rng.entero(1, 9), d = rng.entero(2, 9);
  while (n === d || mcd(n, d) !== 1) { n = rng.entero(1, 9); d = rng.entero(2, 9); }
  return [n, d];
}

function equivalente(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.entero(2, 5);
  return {
    texto: '¿Qué fracción es equivalente a esta?',
    enunciado: `\\frac{${n}}{${d}}`,
    correcta: fr(n * k, d * k),
    distractores: [
      fr(n + k, d + k, E.sumarMismoNumero),
      fr(n * k, d, E.soloNumerador),
      fr(n, d * k, E.soloDenominador),
      fr(d * k, n * k, E.invertir),
    ],
  };
}

function simplificar(rng) {
  const [n, d] = fraccionIrreducible(rng);
  const k = rng.entero(2, 6);
  const N = n * k, D = d * k;
  const j = rng.entero(1, Math.min(N, D) - 1);
  return {
    texto: 'Simplifica la fracción:',
    enunciado: `\\frac{${N}}{${D}}`,
    correcta: fr(n, d),
    distractores: [
      fr(n, D, E.simplificarUnoSolo),
      fr(N, d, E.simplificarUnoSolo),
      fr(N - j, D - j, E.restarMismoNumero),
      fr(d, n, E.invertir),
    ],
  };
}

const FORMAS = [equivalente, simplificar];

export default {
  id: 'fracciones_equivalentes',
  nombre: 'Fracciones equivalentes',
  curso: 1,
  concepto: 'fracciones_equivalentes',
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, distractores } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, opciones };
  }),
};
