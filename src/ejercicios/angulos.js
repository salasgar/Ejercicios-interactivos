// Ángulos: complementarios, suplementarios y clasificación (agudo, recto,
// obtuso, llano). Sin fórmula en el enunciado, como en divisibilidad.js.
// No lleva CON_PASOS: clasificar da una respuesta en palabras, no un número,
// así que no tiene sentido el «último paso acaba en el valor».

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  usa_180: { concepto: 'angulos',
    es: 'Dos ángulos complementarios suman 90°, no 180°: eso es lo que suman los suplementarios.', en: 'Two complementary angles add up to 90°, not 180°: that is what supplementary angles add up to.' },
  usa_90: { concepto: 'angulos',
    es: 'Dos ángulos suplementarios suman 180°, no 90°: eso es lo que suman los complementarios.', en: 'Two supplementary angles add up to 180°, not 90°: that is what complementary angles add up to.' },
  suma_en_vez_de_restar: { concepto: 'angulos',
    es: 'Para hallar el ángulo que falta hay que restar, no sumar.', en: 'To find the missing angle you have to subtract, not add.' },
  resta_al_reves: { concepto: 'angulos',
    es: 'Se resta el ángulo dado del total (90° o 180°), no al revés.', en: 'You subtract the given angle from the total (90° or 180°), not the other way round.' },
  no_es_agudo: { concepto: 'angulos',
    es: 'Un ángulo agudo mide menos de 90°.', en: 'An acute angle measures less than 90°.' },
  no_es_recto: { concepto: 'angulos',
    es: 'Un ángulo recto mide exactamente 90°, ni más ni menos.', en: 'A right angle measures exactly 90°, no more and no less.' },
  no_es_obtuso: { concepto: 'angulos',
    es: 'Un ángulo obtuso mide más de 90° y menos de 180°.', en: 'An obtuse angle measures more than 90° and less than 180°.' },
  no_es_llano: { concepto: 'angulos',
    es: 'Un ángulo llano mide exactamente 180°: es una línea recta.', en: 'A straight angle measures exactly 180°: it is a straight line.' },
};
const E = erroresDe(errores);

export const preguntas = {
  complementario: { es: '¿Cuál es el ángulo complementario de {a}°? (los dos suman 90°)', en: 'What is the complementary angle of {a}°? (the two add up to 90°)' },
  suplementario: { es: '¿Cuál es el ángulo suplementario de {a}°? (los dos suman 180°)', en: 'What is the supplementary angle of {a}°? (the two add up to 180°)' },
  clasifica: { es: '¿Cómo se llama un ángulo de {a}°?', en: 'What is an angle of {a}° called?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  restar_de_90: { es: 'Restamos de 90°.', en: 'We subtract from 90°.' },
  restar_de_180: { es: 'Restamos de 180°.', en: 'We subtract from 180°.' },
  definicion_agudo: { es: 'Mide menos de 90°: es agudo.', en: 'It measures less than 90°: it is acute.' },
  definicion_recto: { es: 'Mide exactamente 90°: es recto.', en: 'It measures exactly 90°: it is right.' },
  definicion_obtuso: { es: 'Mide más de 90° y menos de 180°: es obtuso.', en: 'It measures more than 90° and less than 180°: it is obtuse.' },
  definicion_llano: { es: 'Mide exactamente 180°: es llano.', en: 'It measures exactly 180°: it is straight.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

const PALABRAS = {
  agudo: { es: 'Agudo', en: 'Acute' },
  recto: { es: 'Recto', en: 'Right' },
  obtuso: { es: 'Obtuso', en: 'Obtuse' },
  llano: { es: 'Llano', en: 'Straight' },
};
const NOTA_CATEGORIA = { agudo: 'definicion_agudo', recto: 'definicion_recto', obtuso: 'definicion_obtuso', llano: 'definicion_llano' };
const ERROR_CATEGORIA = { agudo: 'no_es_agudo', recto: 'no_es_recto', obtuso: 'no_es_obtuso', llano: 'no_es_llano' };

function complementario(rng) {
  const a = rng.entero(1, 89);
  const correcta = 90 - a;
  return {
    texto: { clave: 'complementario', params: { a } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [paso(`90 - ${a} = ${T(correcta)}`, 'restar_de_90')],
    distractores: [
      num(180 - a, E('usa_180'), [mal(`180 - ${a} = ${T(180 - a)}`)]),
      num(90 + a, E('suma_en_vez_de_restar'), [mal(`90 + ${a} = ${T(90 + a)}`)]),
      num(a - 90, E('resta_al_reves'), [mal(`${a} - 90 = ${T(a - 90)}`)]),
    ],
  };
}

function suplementario(rng) {
  const a = rng.entero(1, 179);
  const correcta = 180 - a;
  return {
    texto: { clave: 'suplementario', params: { a } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [paso(`180 - ${a} = ${T(correcta)}`, 'restar_de_180')],
    distractores: [
      num(90 - a, E('usa_90'), [mal(`90 - ${a} = ${T(90 - a)}`)]),
      num(180 + a, E('suma_en_vez_de_restar'), [mal(`180 + ${a} = ${T(180 + a)}`)]),
      num(a - 180, E('resta_al_reves'), [mal(`${a} - 180 = ${T(a - 180)}`)]),
    ],
  };
}

function clasifica(rng) {
  const categorias = ['agudo', 'recto', 'obtuso', 'llano'];
  const categoria = rng.elegir(categorias);
  const a = categoria === 'agudo' ? rng.entero(10, 89)
    : categoria === 'recto' ? 90
    : categoria === 'obtuso' ? rng.entero(91, 179)
    : 180;
  const otras = categorias.filter(c => c !== categoria);
  return {
    texto: { clave: 'clasifica', params: { a } },
    enunciado: '',
    correcta: { texto: PALABRAS[categoria], clave: categoria },
    solucion: [paso(`${a}^{\\circ}`, NOTA_CATEGORIA[categoria])],
    distractores: otras.map(c => ({ texto: PALABRAS[c], clave: c, error: E(ERROR_CATEGORIA[c]) })),
  };
}

const FORMAS = [complementario, complementario, suplementario, suplementario, clasifica, clasifica, clasifica];

export default {
  id: 'angulos',
  nombre: { es: 'Ángulos', en: 'Angles' },
  curso: 1,
  concepto: 'angulos',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
