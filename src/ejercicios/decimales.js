// Números decimales: suma, resta, producto y multiplicar o dividir por 10, 100, 1000.

import { construirOpciones, conReintentos, tex, redondear } from './index.js';

const E = {
  alinearComa: {
    id: 'no_alinear_coma',
    concepto: 'decimales',
    feedback: 'Para sumar o restar decimales hay que alinear las comas: décimas con décimas, centésimas con centésimas.',
  },
  parteDecimalEntera: {
    id: 'parte_decimal_como_entero',
    concepto: 'decimales',
    feedback: 'La parte decimal no se suma como si fuera un número entero: 0,5 + 0,75 = 1,25, no 0,80.',
  },
  contarDecimales: {
    id: 'contar_decimales_producto',
    concepto: 'decimales',
    feedback: 'El producto tiene tantas cifras decimales como los dos factores juntos: 0,2 · 0,3 = 0,06.',
  },
  olvidarComa: {
    id: 'olvidar_coma',
    concepto: 'decimales',
    feedback: 'Te has olvidado de la coma: multiplica como enteros y luego coloca los decimales.',
  },
  ladoContrario: {
    id: 'mover_coma_lado_contrario',
    concepto: 'decimales',
    feedback: 'Multiplicar por 10, 100, 1000 mueve la coma a la derecha; dividir, a la izquierda.',
  },
  contarPosiciones: {
    id: 'contar_posiciones',
    concepto: 'decimales',
    feedback: 'La coma se mueve tantas posiciones como ceros tiene el 10, 100 o 1000.',
  },
};

const num = (v, error) => ({ tex: tex(v), clave: redondear(v), error });
const r = v => redondear(v);

function decimal(rng, enteroMax, decimales) {
  return r(rng.entero(0, enteroMax) + rng.entero(1, 10 ** decimales - 1) / 10 ** decimales);
}

function partes(x, decimales) {
  const entera = Math.floor(x);
  const dec = Math.round((x - entera) * 10 ** decimales);
  return [entera, dec];
}

function suma(rng) {
  // Con distinto número de decimales, los dos errores típicos dan resultados
  // distintos del correcto (con el mismo número, "sumar como enteros" acierta).
  const da = rng.moneda() ? 1 : 2, db = 3 - da;
  const a = decimal(rng, 9, da), b = decimal(rng, 9, db);
  const [ea, fa] = partes(a, da), [eb, fb] = partes(b, db);
  const maxDec = Math.max(da, db);
  // Error: sumar las partes decimales como enteros.
  const malDecimal = r(ea + eb + (fa + fb) / 10 ** maxDec);
  // Error: sumar como enteros sin alinear (25 + 75 → 100) y poner la coma según el mayor.
  const sinAlinear = r((Number(String(a).replace('.', '')) + Number(String(b).replace('.', ''))) / 10 ** maxDec);
  return {
    enunciado: `${tex(a)} + ${tex(b)}`,
    correcta: num(a + b),
    distractores: [num(malDecimal, E.parteDecimalEntera), num(sinAlinear, E.alinearComa)],
    genericos: [num(a + b + 0.1), num(a + b - 0.1), num(a + b + 1)],
  };
}

function resta(rng) {
  const db = 2;
  const b = decimal(rng, 5, db);
  const a = r(Math.floor(b) + rng.entero(1, 5) + rng.entero(1, 9) / 10);
  const [ea] = partes(a, 1), [eb, fb] = partes(b, db);
  const restarEnteras = r(ea - eb + fb / 10 ** db);
  const sinAlinear = r((Number(String(a).replace('.', '')) * 10 ** (db - 1) - Number(String(b).replace('.', ''))) / 10 ** db);
  return {
    enunciado: `${tex(a)} - ${tex(b)}`,
    correcta: num(a - b),
    distractores: [num(restarEnteras, E.parteDecimalEntera), num(sinAlinear, E.alinearComa)],
    genericos: [num(a - b + 0.1), num(a - b - 0.1), num(a - b + 1)],
  };
}

function producto(rng) {
  const a = r(rng.entero(1, 9) / 10), b = r(rng.entero(2, 9) / 10);
  const ab = r(a * b);
  return {
    enunciado: `${tex(a)} \\cdot ${tex(b)}`,
    correcta: num(ab),
    distractores: [num(ab * 10, E.contarDecimales), num(ab * 100, E.olvidarComa), num(r(a + b), { ...E.contarDecimales, id: 'sumar_en_vez_de_multiplicar', feedback: 'Es un producto, no una suma.' })],
    genericos: [num(ab / 10)],
  };
}

function porPotenciaDeDiez(rng) {
  const x = decimal(rng, 9, rng.entero(1, 3));
  const n = rng.entero(1, 3), p = 10 ** n;
  const multiplicar = rng.moneda();
  const correcta = multiplicar ? r(x * p) : r(x / p);
  return {
    enunciado: `${tex(x)} ${multiplicar ? '\\cdot' : ':'} ${p}`,
    correcta: num(correcta),
    distractores: [
      num(multiplicar ? r(x / p) : r(x * p), E.ladoContrario),
      num(multiplicar ? r(x * p / 10) : r(x / p * 10), E.contarPosiciones),
      num(multiplicar ? r(x * p * 10) : r(x / p / 10), E.contarPosiciones),
    ],
  };
}

const FORMAS = [suma, resta, producto, porPotenciaDeDiez, porPotenciaDeDiez];

export default {
  id: 'decimales',
  nombre: 'Números decimales',
  curso: 1,
  concepto: 'decimales',
  generar: conReintentos(rng => {
    const { enunciado, correcta, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: 'Calcula:', enunciado, opciones };
  }),
};
