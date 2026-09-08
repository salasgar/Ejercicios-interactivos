// Jerarquía de las operaciones: sumas, restas, productos, paréntesis y
// cuadrados combinados. Cada distractor reproduce un error concreto.

import { construirOpciones, conReintentos, tex } from './index.js';

const E = {
  izquierdaDerecha: {
    id: 'izquierda_derecha',
    concepto: 'jerarquia',
    feedback: 'Recuerda que la multiplicación se hace antes que la suma y la resta, aunque esté escrita después.',
  },
  potenciaComoProducto: {
    id: 'potencia_como_producto',
    concepto: 'potencias',
    feedback: 'Una potencia no es un producto: 10² significa 10·10, no 10·2.',
  },
  elevarProducto: {
    id: 'elevar_producto',
    concepto: 'jerarquia',
    feedback: 'La potencia se calcula antes que el producto: solo se eleva el número que lleva el exponente.',
  },
  ignorarExponente: {
    id: 'ignorar_exponente',
    concepto: 'potencias',
    feedback: 'Te has olvidado del exponente: hay que calcular la potencia antes de multiplicar.',
  },
  ignorarParentesis: {
    id: 'ignorar_parentesis',
    concepto: 'jerarquia',
    feedback: 'Los paréntesis se calculan primero: lo que hay dentro se resuelve antes de multiplicar.',
  },
  parentesisParcial: {
    id: 'parentesis_parcial',
    concepto: 'jerarquia',
    feedback: 'Al multiplicar un paréntesis, el resultado del paréntesis completo es lo que se multiplica.',
  },
};

const op = (v, error) => ({ tex: tex(v), clave: v, error });

function generarSuma(rng) {
  // a + b·c²
  const a = rng.entero(1, 9), b = rng.entero(2, 9), c = rng.entero(2, 10);
  const correcta = a + b * c * c;
  return {
    enunciado: `${a} + ${b} \\cdot ${c}^{2}`,
    correcta: { tex: tex(correcta), clave: correcta },
    distractores: [
      op(a + b * c * 2, E.potenciaComoProducto),
      op((a + b) * c * c, E.izquierdaDerecha),
      op(a + (b * c) * (b * c), E.elevarProducto),
      op(a + b * c, E.ignorarExponente),
    ],
  };
}

function generarResta(rng) {
  // a − b·c  (con a > b·c para que salga positivo en 1º ESO)
  const b = rng.entero(2, 9), c = rng.entero(2, 9);
  const a = b * c + rng.entero(1, 20);
  const correcta = a - b * c;
  return {
    enunciado: `${a} - ${b} \\cdot ${c}`,
    correcta: { tex: tex(correcta), clave: correcta },
    distractores: [
      op((a - b) * c, E.izquierdaDerecha),
      op(a - b + c, { ...E.izquierdaDerecha, id: 'resta_izquierda_derecha' }),
    ],
    genericos: [op(a - b * c + 1), op(a - b * c - 1), op(a + b * c)],
  };
}

function generarParentesis(rng) {
  // (a + b)·c
  const a = rng.entero(1, 9), b = rng.entero(1, 9), c = rng.entero(2, 9);
  const correcta = (a + b) * c;
  return {
    enunciado: `(${a} + ${b}) \\cdot ${c}`,
    correcta: { tex: tex(correcta), clave: correcta },
    distractores: [
      op(a + b * c, E.ignorarParentesis),
      op(a * c + b, E.parentesisParcial),
      op(a + b + c, { ...E.parentesisParcial, id: 'parentesis_suma' }),
    ],
    genericos: [op((a + b) * c + c)],
  };
}

function generarDosProductos(rng) {
  // a·b + c·d
  const a = rng.entero(2, 9), b = rng.entero(2, 9), c = rng.entero(2, 9), d = rng.entero(2, 9);
  const correcta = a * b + c * d;
  return {
    enunciado: `${a} \\cdot ${b} + ${c} \\cdot ${d}`,
    correcta: { tex: tex(correcta), clave: correcta },
    distractores: [
      op((a * b + c) * d, E.izquierdaDerecha),
      op(a * (b + c) * d, { ...E.izquierdaDerecha, id: 'agrupar_suma' }),
    ],
    genericos: [op(a * b + c + d), op(a + b * c + d), op(a * b * c * d)],
  };
}

function generarMixta(rng) {
  // a + b·c − d
  const b = rng.entero(2, 9), c = rng.entero(2, 9);
  const a = rng.entero(1, 15), d = rng.entero(1, Math.min(a + b * c, 20));
  const correcta = a + b * c - d;
  return {
    enunciado: `${a} + ${b} \\cdot ${c} - ${d}`,
    correcta: { tex: tex(correcta), clave: correcta },
    distractores: [
      op((a + b) * c - d, E.izquierdaDerecha),
      op(a + b * (c - d), { ...E.izquierdaDerecha, id: 'agrupar_resta' }),
    ],
    genericos: [op(a + b * c + d), op(a + b + c - d)],
  };
}

const FORMAS = [generarSuma, generarSuma, generarResta, generarParentesis, generarDosProductos, generarMixta];

export default {
  id: 'jerarquia',
  nombre: 'Jerarquía de las operaciones',
  curso: 1,
  concepto: 'jerarquia',
  generar: conReintentos(rng => {
    const forma = rng.elegir(FORMAS);
    const { enunciado, correcta, distractores, genericos } = forma(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: 'Calcula:', enunciado, opciones };
  }),
};
