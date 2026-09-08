// Suma y resta de fracciones con distinto denominador. El resultado correcto
// se da simplificado, y ningún distractor tiene el mismo valor que él.

import { construirOpciones, conReintentos, texFraccion, claveFraccion, mcm } from './index.js';

const E = {
  sumarTodo: {
    id: 'sumar_numeradores_y_denominadores',
    concepto: 'suma_fracciones',
    feedback: 'No se suman los denominadores: primero se reducen a común denominador y luego se suman solo los numeradores.',
  },
  noMultiplicarNumerador: {
    id: 'no_multiplicar_numerador',
    concepto: 'suma_fracciones',
    feedback: 'Al cambiar el denominador hay que multiplicar también el numerador por el mismo número.',
  },
  convertirUnaSola: {
    id: 'convertir_una_sola',
    concepto: 'suma_fracciones',
    feedback: 'Las dos fracciones tienen que ponerse con el denominador común, no solo una de ellas.',
  },
  ordenResta: {
    id: 'orden_resta',
    concepto: 'suma_fracciones',
    feedback: 'Cuidado con el orden de la resta: el signo del resultado depende de cuál fracción es mayor.',
  },
};

const fr = (n, d, error) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error });

function generar(rng) {
  let b = rng.entero(2, 8), d = rng.entero(2, 8);
  while (b === d) d = rng.entero(2, 8);
  const a = rng.entero(1, b - 1), c = rng.entero(1, d - 1);
  const resta = rng.moneda(0.4);
  const m = mcm(b, d);
  const A = a * (m / b), C = c * (m / d);
  const signo = resta ? -1 : 1;
  const numCorrecto = A + signo * C;
  if (numCorrecto === 0) return null;
  const operador = resta ? '-' : '+';
  return {
    texto: 'Calcula:',
    enunciado: `\\frac{${a}}{${b}} ${operador} \\frac{${c}}{${d}}`,
    correcta: fr(numCorrecto, m),
    distractores: [
      fr(a + signo * c, b + d, E.sumarTodo),
      fr(a + signo * c, m, E.noMultiplicarNumerador),
      fr(A + signo * c, m, E.convertirUnaSola),
      fr(a + signo * C, m, E.convertirUnaSola),
      resta ? fr(-numCorrecto, m, E.ordenResta) : fr(A * C, m, { ...E.sumarTodo, id: 'multiplicar_numeradores', feedback: 'Es una suma, no un producto: con el mismo denominador se suman los numeradores.' }),
    ],
  };
}

export default {
  id: 'suma_fracciones',
  nombre: 'Suma y resta de fracciones',
  curso: 1,
  concepto: 'suma_fracciones',
  generar: conReintentos(rng => {
    const datos = generar(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: datos.texto, enunciado: datos.enunciado, opciones };
  }),
};
