// Proporcionalidad directa e inversa: problemas de regla de tres con
// enunciado (sin fórmula), como en divisibilidad.js.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  multiplica_sin_hallar_unidad: { concepto: 'proporcionalidad',
    es: 'Antes de multiplicar hay que hallar cuánto vale una sola unidad, dividiendo primero.', en: 'Before multiplying you must first find the value of a single unit, by dividing first.' },
  suma_en_vez_de_multiplicar: { concepto: 'proporcionalidad',
    es: 'El último paso es un producto, no una suma.', en: 'The last step is a product, not a sum.' },
  escala_con_dato_equivocado: { concepto: 'proporcionalidad',
    es: 'El factor que hay que multiplicar es el valor de una unidad, no el dato original.', en: 'The factor you must multiply by is the value of a single unit, not the original figure.' },
  no_ajusta_al_cambiar: { concepto: 'proporcionalidad',
    es: 'Al cambiar el número de trabajadores, el tiempo también cambia: no se queda igual.', en: 'When the number of workers changes, the time changes too: it does not stay the same.' },
  trata_como_suma: { concepto: 'proporcionalidad',
    es: 'La proporcionalidad inversa no es una diferencia: hay que multiplicar y dividir, no sumar ni restar.', en: 'Inverse proportionality is not a difference: you must multiply and divide, not add or subtract.' },
  confunde_dias_con_obreros: { concepto: 'proporcionalidad',
    es: 'Esa cifra es el número de trabajadores, no el número de días que pide la pregunta.', en: 'That figure is the number of workers, not the number of days the question asks for.' },
  reparte_a_partes_iguales: { concepto: 'proporcionalidad',
    es: 'Un reparto proporcional no es a partes iguales: cada parte depende del número al que es proporcional.', en: 'A proportional share is not split equally: each part depends on the number it is proportional to.' },
  invierte_las_partes: { concepto: 'proporcionalidad',
    es: 'Has calculado la otra parte: revisa a qué número corresponde la parte que te piden.', en: 'You worked out the other part: check which number the requested part corresponds to.' },
  multiplica_sin_dividir_entre_suma: { concepto: 'proporcionalidad',
    es: 'Antes de multiplicar por la parte hay que dividir el total entre la suma de todas las partes.', en: 'Before multiplying by the part, you must divide the total by the sum of all the parts.' },
};
const E = erroresDe(errores);

export const preguntas = {
  directa: { es: 'Si {a} kg de fruta cuestan {b} euros, ¿cuánto cuestan {c} kg?', en: 'If {a} kg of fruit cost {b} euros, how much do {c} kg cost?' },
  inversa: { es: 'Si {a} obreros hacen un trabajo en {b} días, ¿cuántos días tardarán {c} obreros?', en: 'If {a} workers finish a job in {b} days, how many days will {c} workers take?' },
  reparto: { es: 'Reparte {total} € en partes proporcionales a {a} y {b}. ¿Cuánto corresponde a la primera parte?', en: 'Share {total} € in parts proportional to {a} and {b}. How much does the first part get?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  hallar_unidad: { es: 'Hallamos cuánto cuesta 1 kg.', en: 'We find the cost of 1 kg.' },
  multiplicar_unidad: { es: 'Multiplicamos el precio de 1 kg por la cantidad pedida.', en: 'We multiply the price of 1 kg by the amount asked for.' },
  trabajo_total: { es: 'Calculamos el trabajo total, en obreros por día: no cambia aunque cambien los obreros.', en: 'We work out the total work, in worker-days: it stays the same even if the number of workers changes.' },
  dividir_entre_obreros: { es: 'Repartimos ese trabajo total entre los nuevos obreros.', en: 'We share that total work among the new workers.' },
  sumar_partes: { es: 'Sumamos los números a los que hay que repartir de forma proporcional.', en: 'We add the numbers the amount has to be shared proportionally to.' },
  hallar_unidad_reparto: { es: 'Dividimos el total entre esa suma para saber cuánto vale cada parte.', en: 'We divide the total by that sum to find the value of each part.' },
  multiplicar_por_parte: { es: 'Multiplicamos el valor de cada parte por el número correspondiente a la primera parte.', en: 'We multiply the value of each part by the number corresponding to the first part.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function divisoresDe(n) {
  const lista = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) lista.push(d);
  return lista;
}

function directa(rng) {
  const a = rng.entero(2, 9);
  const precioUnidad = rng.entero(2, 9);
  const b = a * precioUnidad;
  const c = rng.entero(2, 15);
  const correcta = precioUnidad * c;
  return {
    texto: { clave: 'directa', params: { a, b, c } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(b)} \\div ${a} = ${T(precioUnidad)}`, 'hallar_unidad'),
      paso(`${T(precioUnidad)} \\cdot ${c} = ${T(correcta)}`, 'multiplicar_unidad'),
    ],
    distractores: [
      num(b * c, E('multiplica_sin_hallar_unidad'), [
        mal(`${T(b)} \\cdot ${c} = ${T(b * c)}`),
      ]),
      num(precioUnidad + c, E('suma_en_vez_de_multiplicar'), [
        paso(`${T(b)} \\div ${a} = ${T(precioUnidad)}`),
        mal(`${T(precioUnidad)} + ${c} = ${T(precioUnidad + c)}`),
      ]),
      num(a * c, E('escala_con_dato_equivocado'), [
        mal(`${a} \\cdot ${c} = ${T(a * c)}`),
      ]),
    ],
  };
}

function inversa(rng) {
  const a = rng.entero(2, 9);
  const dias = rng.entero(2, 9);
  const trabajoTotal = a * dias;
  const divs = divisoresDe(trabajoTotal).filter(d => d >= 2 && d !== a);
  if (!divs.length) return null;
  const c = rng.elegir(divs);
  const correcta = trabajoTotal / c;
  return {
    texto: { clave: 'inversa', params: { a, b: dias, c } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${a} \\cdot ${dias} = ${T(trabajoTotal)}`, 'trabajo_total'),
      paso(`${T(trabajoTotal)} \\div ${c} = ${T(correcta)}`, 'dividir_entre_obreros'),
    ],
    distractores: [
      num(dias, E('no_ajusta_al_cambiar'), [
        mal(`x = ${T(dias)}`),
      ]),
      num(dias + (c - a), E('trata_como_suma'), [
        mal(`${T(dias)} + (${T(c)} - ${a}) = ${T(dias + (c - a))}`),
      ]),
      num(c, E('confunde_dias_con_obreros'), [
        mal(`x = ${T(c)}`),
      ]),
    ],
  };
}

function repartoProporcional(rng) {
  let a = rng.entero(1, 9), b = rng.entero(1, 9);
  while (b === a) b = rng.entero(1, 9);
  const suma = a + b;
  const k = rng.entero(2, 15);
  const total = suma * k;
  const correcta = a * k;
  const otraParte = b * k;
  return {
    texto: { clave: 'reparto', params: { total, a, b } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${a} + ${b} = ${T(suma)}`, 'sumar_partes'),
      paso(`${T(total)} \\div ${suma} = ${T(k)}`, 'hallar_unidad_reparto'),
      paso(`${T(k)} \\cdot ${a} = ${T(correcta)}`, 'multiplicar_por_parte'),
    ],
    distractores: [
      num(total / 2, E('reparte_a_partes_iguales'), [
        mal(`${T(total)} \\div 2 = ${T(total / 2)}`),
      ]),
      num(otraParte, E('invierte_las_partes'), [
        paso(`${T(total)} \\div ${suma} = ${T(k)}`),
        mal(`${T(k)} \\cdot ${b} = ${T(otraParte)}`),
      ]),
      num(total * a, E('multiplica_sin_dividir_entre_suma'), [
        mal(`${T(total)} \\cdot ${a} = ${T(total * a)}`),
      ]),
    ],
  };
}

const FORMAS = [directa, directa, inversa, inversa, repartoProporcional, repartoProporcional];

export default {
  id: 'proporcionalidad',
  nombre: { es: 'Proporcionalidad', en: 'Proportionality' },
  curso: 1,
  concepto: 'proporcionalidad',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores, datos.genericos);
    return opciones && { texto: datos.texto, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
};
