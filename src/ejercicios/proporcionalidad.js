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
};
const E = erroresDe(errores);

export const preguntas = {
  directa: { es: 'Si {a} kg de fruta cuestan {b} euros, ¿cuánto cuestan {c} kg?', en: 'If {a} kg of fruit cost {b} euros, how much do {c} kg cost?' },
  inversa: { es: 'Si {a} obreros hacen un trabajo en {b} días, ¿cuántos días tardarán {c} obreros?', en: 'If {a} workers finish a job in {b} days, how many days will {c} workers take?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  hallar_unidad: { es: 'Hallamos cuánto cuesta 1 kg.', en: 'We find the cost of 1 kg.' },
  multiplicar_unidad: { es: 'Multiplicamos el precio de 1 kg por la cantidad pedida.', en: 'We multiply the price of 1 kg by the amount asked for.' },
  trabajo_total: { es: 'Calculamos el trabajo total, en obreros por día: no cambia aunque cambien los obreros.', en: 'We work out the total work, in worker-days: it stays the same even if the number of workers changes.' },
  dividir_entre_obreros: { es: 'Repartimos ese trabajo total entre los nuevos obreros.', en: 'We share that total work among the new workers.' },
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

const FORMAS = [directa, directa, inversa, inversa];

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
