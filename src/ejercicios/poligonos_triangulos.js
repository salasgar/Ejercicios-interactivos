// Clasificación de triángulos (por lados y por ángulos) y de polígonos por
// su número de lados. Sin fórmula en el enunciado, como en divisibilidad.js.
//
// Solo hay 3 categorías posibles por lados y 3 por ángulos, así que esas dos
// formas son preguntas «Correcto / Incorrecto» sobre una afirmación (como en
// lenguaje_ingles.js), no de 4 opciones: no hay manera de sacar 3 distractores
// distintos de un conjunto de 3 categorías. numeroLados sí tiene 6 categorías
// y es de 4 opciones normal.
// No lleva CON_PASOS: las respuestas son palabras o Correcto/Incorrecto, no
// un número en el que el último paso deba «acabar».

import { construirOpciones, conReintentos, erroresDe, opcionesCorrectoIncorrecto } from './index.js';

export const errores = {
  no_es_equilatero: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo equilátero tiene los tres lados iguales.', en: 'An equilateral triangle has all three sides equal.' },
  no_es_isosceles: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo isósceles tiene exactamente dos lados iguales, ni uno ni los tres.', en: 'An isosceles triangle has exactly two equal sides, not one and not three.' },
  no_es_escaleno: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo escaleno tiene los tres lados distintos.', en: 'A scalene triangle has all three sides different.' },
  no_es_acutangulo: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo acutángulo tiene los tres ángulos agudos (menores de 90°).', en: 'An acute triangle has all three angles acute (less than 90°).' },
  no_es_rectangulo: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo rectángulo tiene un ángulo de exactamente 90°.', en: 'A right triangle has one angle of exactly 90°.' },
  no_es_obtusangulo: { concepto: 'poligonos_triangulos',
    es: 'Un triángulo obtusángulo tiene un ángulo mayor de 90°.', en: 'An obtuse triangle has one angle greater than 90°.' },
  numero_de_lados_equivocado: { concepto: 'poligonos_triangulos',
    es: 'Cuenta otra vez el número de lados: el nombre del polígono depende de eso.', en: 'Count the number of sides again: the name of the polygon depends on it.' },
};
const E = erroresDe(errores);

export const preguntas = {
  lados_equilatero: { es: 'Un triángulo de lados {a}, {b} y {c} cm es equilátero.', en: 'A triangle with sides {a}, {b} and {c} cm is equilateral.' },
  lados_isosceles: { es: 'Un triángulo de lados {a}, {b} y {c} cm es isósceles.', en: 'A triangle with sides {a}, {b} and {c} cm is isosceles.' },
  lados_escaleno: { es: 'Un triángulo de lados {a}, {b} y {c} cm es escaleno.', en: 'A triangle with sides {a}, {b} and {c} cm is scalene.' },
  angulos_acutangulo: { es: 'Un triángulo de ángulos {a}°, {b}° y {c}° es acutángulo.', en: 'A triangle with angles {a}°, {b}° and {c}° is acute.' },
  angulos_rectangulo: { es: 'Un triángulo de ángulos {a}°, {b}° y {c}° es rectángulo.', en: 'A triangle with angles {a}°, {b}° and {c}° is right-angled.' },
  angulos_obtusangulo: { es: 'Un triángulo de ángulos {a}°, {b}° y {c}° es obtusángulo.', en: 'A triangle with angles {a}°, {b}° and {c}° is obtuse.' },
  numero_lados: { es: '¿Cómo se llama el polígono de {n} lados?', en: 'What is the polygon with {n} sides called?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  cuenta_lados: { es: 'Contamos el número de lados.', en: 'We count the number of sides.' },
};

const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });

const CATEGORIAS_LADOS = ['equilatero', 'isosceles', 'escaleno'];
const ERROR_LADOS = { equilatero: 'no_es_equilatero', isosceles: 'no_es_isosceles', escaleno: 'no_es_escaleno' };

const CATEGORIAS_ANGULOS = ['acutangulo', 'rectangulo', 'obtusangulo'];
const ERROR_ANGULOS = { acutangulo: 'no_es_acutangulo', rectangulo: 'no_es_rectangulo', obtusangulo: 'no_es_obtusangulo' };

const NOMBRE_POLIGONO = {
  3: { es: 'Triángulo', en: 'Triangle' },
  4: { es: 'Cuadrilátero', en: 'Quadrilateral' },
  5: { es: 'Pentágono', en: 'Pentagon' },
  6: { es: 'Hexágono', en: 'Hexagon' },
  7: { es: 'Heptágono', en: 'Heptagon' },
  8: { es: 'Octógono', en: 'Octagon' },
};

function ladosTriangulo(rng) {
  const categoriaReal = rng.elegir(CATEGORIAS_LADOS);
  let a, b, c;
  if (categoriaReal === 'equilatero') {
    a = b = c = rng.entero(3, 15);
  } else if (categoriaReal === 'isosceles') {
    a = b = rng.entero(4, 15);
    do { c = rng.entero(2, 2 * a - 1); } while (c === a);
  } else {
    a = rng.entero(4, 12);
    b = rng.entero(a + 1, a + 8);
    c = rng.entero(b + 1, a + b - 1);
  }
  const esCorrecta = rng.moneda();
  const afirmada = esCorrecta ? categoriaReal : rng.elegir(CATEGORIAS_LADOS.filter(k => k !== categoriaReal));
  return {
    texto: { clave: `lados_${afirmada}`, params: { a, b, c } },
    enunciado: '',
    opciones: opcionesCorrectoIncorrecto(esCorrecta, E(ERROR_LADOS[afirmada])),
  };
}

function angulosTriangulo(rng) {
  const categoriaReal = rng.elegir(CATEGORIAS_ANGULOS);
  let a, b, c;
  if (categoriaReal === 'rectangulo') {
    a = 90;
    b = rng.entero(10, 79);
    c = 180 - a - b;
  } else if (categoriaReal === 'obtusangulo') {
    a = rng.entero(91, 150);
    b = rng.entero(10, 179 - a);
    c = 180 - a - b;
  } else {
    a = rng.entero(20, 79);
    b = rng.entero(20, 79);
    c = 180 - a - b;
    if (c <= 0 || c >= 90) return null;
  }
  const esCorrecta = rng.moneda();
  const afirmada = esCorrecta ? categoriaReal : rng.elegir(CATEGORIAS_ANGULOS.filter(k => k !== categoriaReal));
  return {
    texto: { clave: `angulos_${afirmada}`, params: { a, b, c } },
    enunciado: '',
    opciones: opcionesCorrectoIncorrecto(esCorrecta, E(ERROR_ANGULOS[afirmada])),
  };
}

function numeroLados(rng) {
  const n = rng.entero(3, 8);
  const otrosN = Object.keys(NOMBRE_POLIGONO).map(Number).filter(k => k !== n);
  const distractoresN = rng.barajar(otrosN).slice(0, 3);
  return {
    texto: { clave: 'numero_lados', params: { n } },
    enunciado: '',
    correcta: { texto: NOMBRE_POLIGONO[n], clave: n },
    solucion: [paso(`${n}`, 'cuenta_lados')],
    distractores: distractoresN.map(k => ({ texto: NOMBRE_POLIGONO[k], clave: k, error: E('numero_de_lados_equivocado') })),
  };
}

const FORMAS = [ladosTriangulo, ladosTriangulo, angulosTriangulo, angulosTriangulo, numeroLados];

export default {
  id: 'poligonos_triangulos',
  nombre: { es: 'Polígonos y triángulos', en: 'Polygons and triangles' },
  curso: 1,
  concepto: 'poligonos_triangulos',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    if (datos.opciones) return datos;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: datos.texto, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
};
