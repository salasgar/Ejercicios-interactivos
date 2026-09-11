// Estadística: medidas de centralización (media, moda, mediana), medida de
// dispersión (rango), marca de clase, frecuencia relativa y clasificación de
// variables estadísticas en discretas o continuas.

import { construirOpciones, conReintentos, erroresDe, tex, texFraccion, claveFraccion, redondear } from './index.js';

export const errores = {
  olvida_dividir_entre_n: { concepto: 'estadistica',
    es: 'La media se calcula dividiendo la suma de los datos entre cuántos datos hay; te falta esa división.', en: 'The mean is found by dividing the sum of the data by how many data there are; you are missing that division.' },
  divide_entre_n_menos_uno: { concepto: 'estadistica',
    es: 'Has contado mal cuántos datos hay: divide entre el número total de datos, ni uno menos ni uno más.', en: 'You miscounted how many data there are: divide by the total number of data, not one fewer or one more.' },
  divide_entre_n_mas_uno: { concepto: 'estadistica',
    es: 'Has contado mal cuántos datos hay: divide entre el número total de datos, ni uno menos ni uno más.', en: 'You miscounted how many data there are: divide by the total number of data, not one fewer or one more.' },
  confunde_con_media: { concepto: 'estadistica',
    es: 'Eso es la media, no lo que te piden: revisa la diferencia entre las medidas de centralización.', en: 'That is the mean, not what you are asked for: check the difference between the measures of central tendency.' },
  confunde_con_frecuencia: { concepto: 'estadistica',
    es: 'La moda es el valor que más se repite, no el número de veces que se repite.', en: 'The mode is the value that repeats the most, not the number of times it repeats.' },
  elige_valor_no_frecuente: { concepto: 'estadistica',
    es: 'Ese valor solo aparece una vez: la moda es el que más veces se repite.', en: 'That value only appears once: the mode is the one that repeats the most times.' },
  no_ordena_antes: { concepto: 'estadistica',
    es: 'Antes de hallar la mediana hay que ordenar los datos de menor a mayor; el valor central cambia si no los ordenas.', en: 'Before finding the median you must sort the data from smallest to largest; the middle value changes if you do not sort them.' },
  usa_extremo_en_vez_de_centro: { concepto: 'estadistica',
    es: 'La mediana es el valor central de los datos ordenados, no el mayor ni el menor.', en: 'The median is the middle value of the sorted data, not the largest or the smallest.' },
  suma_en_vez_de_restar: { concepto: 'estadistica',
    es: 'El rango es la diferencia entre el mayor y el menor valor, no su suma.', en: 'The range is the difference between the largest and smallest value, not their sum.' },
  invierte_resta: { concepto: 'estadistica',
    es: 'Al valor mayor se le resta el menor, no al revés.', en: 'The smallest value is subtracted from the largest one, not the other way round.' },
  resta_en_vez_de_promediar: { concepto: 'estadistica',
    es: 'La marca de clase es el punto medio del intervalo (la media de sus extremos), no la diferencia entre ellos: eso es la amplitud.', en: 'The class mark is the midpoint of the interval (the mean of its ends), not the difference between them: that is the class width.' },
  usa_extremo_inferior: { concepto: 'estadistica',
    es: 'La marca de clase es el punto medio del intervalo, no su extremo inferior.', en: 'The class mark is the midpoint of the interval, not its lower end.' },
  usa_extremo_superior: { concepto: 'estadistica',
    es: 'La marca de clase es el punto medio del intervalo, no su extremo superior.', en: 'The class mark is the midpoint of the interval, not its upper end.' },
  invierte_fraccion_frecuencia: { concepto: 'estadistica',
    es: 'La frecuencia relativa se calcula dividiendo la frecuencia absoluta entre el total, no al revés.', en: 'The relative frequency is found by dividing the absolute frequency by the total, not the other way round.' },
  usa_fi_sin_dividir: { concepto: 'estadistica',
    es: 'Esa es la frecuencia absoluta; para hallar la relativa hay que dividirla entre el total de datos.', en: 'That is the absolute frequency; to find the relative frequency you must divide it by the total number of data.' },
  confunde_con_frecuencia_complementaria: { concepto: 'estadistica',
    es: 'Esa es la frecuencia relativa del resto de los datos, no la del valor que te piden.', en: 'That is the relative frequency of the rest of the data, not of the value you are asked about.' },
  confunde_tipo_variable: { concepto: 'estadistica',
    es: 'Una variable discreta solo toma valores exactos y contables (como un número de cosas); una continua puede tomar cualquier valor dentro de un intervalo (como una medida).', en: 'A discrete variable only takes exact, countable values (like a number of things); a continuous variable can take any value within an interval (like a measurement).' },
};
const E = erroresDe(errores);

export const preguntas = {
  media: { es: 'Calcula la media de estos datos: {datos}', en: 'Work out the mean of this data: {datos}' },
  moda: { es: 'Calcula la moda de estos datos: {datos}', en: 'Work out the mode of this data: {datos}' },
  mediana: { es: 'Calcula la mediana de estos datos: {datos}', en: 'Work out the median of this data: {datos}' },
  rango: { es: 'Calcula el rango (la diferencia entre el mayor y el menor valor) de estos datos: {datos}', en: 'Work out the range (the difference between the largest and smallest value) of this data: {datos}' },
  marca_clase: { es: '¿Cuál es la marca de clase del intervalo [{a}, {b})?', en: 'What is the class mark of the interval [{a}, {b})?' },
  frecuencia_relativa: { es: 'En una tabla con {total} datos en total, un valor tiene una frecuencia absoluta de {fi}. ¿Cuál es su frecuencia relativa?', en: 'In a table with {total} data in total, a value has an absolute frequency of {fi}. What is its relative frequency?' },
  variable_hermanos: { es: '¿El número de hermanos de cada alumno es una variable discreta o continua?', en: 'Is the number of siblings each student has a discrete or continuous variable?' },
  variable_goles: { es: '¿El número de goles marcados en un partido es una variable discreta o continua?', en: 'Is the number of goals scored in a match a discrete or continuous variable?' },
  variable_coches: { es: '¿El número de coches en un aparcamiento es una variable discreta o continua?', en: 'Is the number of cars in a car park a discrete or continuous variable?' },
  variable_asignaturas: { es: '¿El número de asignaturas aprobadas es una variable discreta o continua?', en: 'Is the number of subjects passed a discrete or continuous variable?' },
  variable_libros: { es: '¿El número de libros leídos en un mes es una variable discreta o continua?', en: 'Is the number of books read in a month a discrete or continuous variable?' },
  variable_hijos: { es: '¿El número de hijos de una familia es una variable discreta o continua?', en: 'Is the number of children in a family a discrete or continuous variable?' },
  variable_estatura: { es: '¿La estatura de los alumnos, en cm, es una variable discreta o continua?', en: 'Is the height of the students, in cm, a discrete or continuous variable?' },
  variable_peso: { es: '¿El peso de un paquete, en kg, es una variable discreta o continua?', en: 'Is the weight of a parcel, in kg, a discrete or continuous variable?' },
  variable_tiempo: { es: '¿El tiempo en resolver un examen, en minutos, es una variable discreta o continua?', en: 'Is the time taken to finish an exam, in minutes, a discrete or continuous variable?' },
  variable_temperatura: { es: '¿La temperatura registrada cada día, en ºC, es una variable discreta o continua?', en: 'Is the temperature recorded each day, in ºC, a discrete or continuous variable?' },
  variable_agua: { es: '¿La cantidad de agua en un depósito, en litros, es una variable discreta o continua?', en: 'Is the amount of water in a tank, in litres, a discrete or continuous variable?' },
  variable_longitud: { es: '¿La longitud de un objeto, en metros, es una variable discreta o continua?', en: 'Is the length of an object, in metres, a discrete or continuous variable?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  sumar_datos: { es: 'Sumamos todos los datos.', en: 'We add up all the data.' },
  dividir_entre_n: { es: 'Dividimos entre el número de datos.', en: 'We divide by the number of data.' },
  identificar_moda: { es: 'La moda es el valor que más veces se repite.', en: 'The mode is the value that repeats the most times.' },
  ordenar_datos: { es: 'Ordenamos los datos de menor a mayor.', en: 'We sort the data from smallest to largest.' },
  identificar_mediana: { es: 'Con un número impar de datos, la mediana es el valor central.', en: 'With an odd number of data, the median is the middle value.' },
  restar_extremos: { es: 'Restamos el valor menor al mayor.', en: 'We subtract the smallest value from the largest one.' },
  promediar_extremos: { es: 'La marca de clase es la media de los dos extremos del intervalo.', en: 'The class mark is the mean of the interval’s two ends.' },
  dividir_fi_entre_n: { es: 'Dividimos la frecuencia absoluta entre el total de datos.', en: 'We divide the absolute frequency by the total number of data.' },
  definicion_discreta: { es: 'Solo toma valores exactos y contables (un número de cosas): es discreta.', en: 'It only takes exact, countable values (a number of things): it is discrete.' },
  definicion_continua: { es: 'Puede tomar cualquier valor dentro de un intervalo (una medida): es continua.', en: 'It can take any value within an interval (a measurement): it is continuous.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: redondear(v), error, pasos });
const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function media(rng) {
  const n = rng.entero(4, 6);
  const mediaObjetivo = rng.entero(3, 12);
  const valores = [];
  for (let i = 0; i < n - 1; i++) valores.push(rng.entero(1, 20));
  const sumaParcial = valores.reduce((a, b) => a + b, 0);
  const ultimo = mediaObjetivo * n - sumaParcial;
  if (ultimo < 1 || ultimo > 25) return null;
  const datos = rng.barajar([...valores, ultimo]);
  const suma = mediaObjetivo * n;
  return {
    texto: { clave: 'media', params: { datos: datos.join(', ') } },
    enunciado: '',
    correcta: num(mediaObjetivo),
    solucion: [
      paso(`${datos.join(' + ')} = ${T(suma)}`, 'sumar_datos'),
      paso(`${T(suma)} \\div ${n} = ${T(mediaObjetivo)}`, 'dividir_entre_n'),
    ],
    distractores: [
      num(suma, E('olvida_dividir_entre_n'), [
        paso(`${datos.join(' + ')} = ${T(suma)}`),
        mal(`x = ${T(suma)}`),
      ]),
      num(redondear(suma / (n - 1), 2), E('divide_entre_n_menos_uno'), [
        paso(`${datos.join(' + ')} = ${T(suma)}`),
        mal(`${T(suma)} \\div ${n - 1} = ${T(redondear(suma / (n - 1), 2))}`),
      ]),
      num(redondear(suma / (n + 1), 2), E('divide_entre_n_mas_uno'), [
        paso(`${datos.join(' + ')} = ${T(suma)}`),
        mal(`${T(suma)} \\div ${n + 1} = ${T(redondear(suma / (n + 1), 2))}`),
      ]),
    ],
  };
}

function moda(rng) {
  const modaValor = rng.entero(1, 15);
  const otros = new Set([modaValor]);
  while (otros.size < 5) otros.add(rng.entero(1, 15));
  otros.delete(modaValor);
  const otrosArr = [...otros];
  const datos = rng.barajar([modaValor, modaValor, modaValor, ...otrosArr]);
  const mediaDatos = redondear(datos.reduce((a, b) => a + b, 0) / datos.length, 2);
  return {
    texto: { clave: 'moda', params: { datos: datos.join(', ') } },
    enunciado: '',
    correcta: num(modaValor),
    solucion: [
      paso(`${T(modaValor)}`, 'identificar_moda'),
    ],
    distractores: [
      num(mediaDatos, E('confunde_con_media'), [
        mal(`x = ${T(mediaDatos)}`),
      ]),
      num(3, E('confunde_con_frecuencia'), [
        mal(`x = 3`),
      ]),
      num(otrosArr[0], E('elige_valor_no_frecuente'), [
        mal(`x = ${T(otrosArr[0])}`),
      ]),
    ],
  };
}

function mediana(rng) {
  const set = new Set();
  while (set.size < 5) set.add(rng.entero(1, 30));
  const ordenados = [...set].sort((a, b) => a - b);
  const datos = rng.barajar(ordenados);
  const medianaValor = ordenados[2];
  const sinOrdenar = datos[2];
  const mediaDatos = redondear(ordenados.reduce((a, b) => a + b, 0) / 5, 2);
  return {
    texto: { clave: 'mediana', params: { datos: datos.join(', ') } },
    enunciado: '',
    correcta: num(medianaValor),
    solucion: [
      paso(ordenados.join(', '), 'ordenar_datos'),
      paso(`${T(medianaValor)}`, 'identificar_mediana'),
    ],
    distractores: [
      num(sinOrdenar, E('no_ordena_antes'), [
        mal(`x = ${T(sinOrdenar)}`),
      ]),
      num(mediaDatos, E('confunde_con_media'), [
        mal(`x = ${T(mediaDatos)}`),
      ]),
      num(ordenados[4], E('usa_extremo_en_vez_de_centro'), [
        mal(`x = ${T(ordenados[4])}`),
      ]),
    ],
  };
}

function rango(rng) {
  const n = rng.entero(5, 7);
  const set = new Set();
  while (set.size < n) set.add(rng.entero(1, 40));
  const ordenados = [...set].sort((a, b) => a - b);
  const datos = rng.barajar(ordenados);
  const minV = ordenados[0], maxV = ordenados[ordenados.length - 1];
  const correcta = maxV - minV;
  const mediaDatos = redondear(ordenados.reduce((a, b) => a + b, 0) / n, 2);
  return {
    texto: { clave: 'rango', params: { datos: datos.join(', ') } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${maxV} - ${minV} = ${T(correcta)}`, 'restar_extremos'),
    ],
    distractores: [
      num(maxV + minV, E('suma_en_vez_de_restar'), [
        mal(`${maxV} + ${minV} = ${T(maxV + minV)}`),
      ]),
      num(minV - maxV, E('invierte_resta'), [
        mal(`${minV} - ${maxV} = ${T(minV - maxV)}`),
      ]),
      num(mediaDatos, E('confunde_con_media'), [
        mal(`x = ${T(mediaDatos)}`),
      ]),
    ],
  };
}

function marcaDeClase(rng) {
  const a = rng.entero(0, 40);
  const amplitud = rng.entero(2, 6) * 2;
  const b = a + amplitud;
  const correcta = (a + b) / 2;
  return {
    texto: { clave: 'marca_clase', params: { a, b } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`(${a} + ${b}) \\div 2 = ${T(correcta)}`, 'promediar_extremos'),
    ],
    distractores: [
      num(b - a, E('resta_en_vez_de_promediar'), [
        mal(`${b} - ${a} = ${T(b - a)}`),
      ]),
      num(a, E('usa_extremo_inferior'), [
        mal(`x = ${T(a)}`),
      ]),
      num(b, E('usa_extremo_superior'), [
        mal(`x = ${T(b)}`),
      ]),
    ],
  };
}

const TOTALES = [10, 20, 25, 40, 50];

function frecuenciaRelativa(rng) {
  const total = rng.elegir(TOTALES);
  const fi = rng.entero(1, total - 1);
  return {
    texto: { clave: 'frecuencia_relativa', params: { total, fi } },
    enunciado: '',
    correcta: fr(fi, total),
    solucion: [
      paso(`${fi} \\div ${total} = ${texFraccion(fi, total)}`, 'dividir_fi_entre_n'),
    ],
    distractores: [
      fr(total, fi, E('invierte_fraccion_frecuencia'), [
        mal(`${total} \\div ${fi} = ${texFraccion(total, fi)}`),
      ]),
      num(fi, E('usa_fi_sin_dividir'), [
        mal(`x = ${fi}`),
      ]),
      fr(total - fi, total, E('confunde_con_frecuencia_complementaria'), [
        mal(`${total} - ${fi} = ${total - fi}`, texFraccion(total - fi, total)),
      ]),
    ],
  };
}

const OPCION_DISCRETA = { texto: { es: 'Discreta', en: 'Discrete' }, clave: 'discreta' };
const OPCION_CONTINUA = { texto: { es: 'Continua', en: 'Continuous' }, clave: 'continua' };

const VARIABLES = [
  { clave: 'variable_hermanos', tipo: 'discreta' },
  { clave: 'variable_goles', tipo: 'discreta' },
  { clave: 'variable_coches', tipo: 'discreta' },
  { clave: 'variable_asignaturas', tipo: 'discreta' },
  { clave: 'variable_libros', tipo: 'discreta' },
  { clave: 'variable_hijos', tipo: 'discreta' },
  { clave: 'variable_estatura', tipo: 'continua' },
  { clave: 'variable_peso', tipo: 'continua' },
  { clave: 'variable_tiempo', tipo: 'continua' },
  { clave: 'variable_temperatura', tipo: 'continua' },
  { clave: 'variable_agua', tipo: 'continua' },
  { clave: 'variable_longitud', tipo: 'continua' },
];

function clasificaVariable(rng) {
  const v = rng.elegir(VARIABLES);
  const correctaOpcion = v.tipo === 'discreta' ? OPCION_DISCRETA : OPCION_CONTINUA;
  const distractorOpcion = v.tipo === 'discreta' ? OPCION_CONTINUA : OPCION_DISCRETA;
  const opciones = construirOpciones(rng, correctaOpcion, [{ ...distractorOpcion, error: E('confunde_tipo_variable') }], [], { numero: 2 });
  return opciones && {
    texto: { clave: v.clave },
    enunciado: '',
    solucion: [paso(`\\text{${v.tipo}}`, `definicion_${v.tipo}`)],
    opciones,
  };
}

const FORMAS = [media, media, moda, mediana, rango, marcaDeClase, frecuenciaRelativa, clasificaVariable, clasificaVariable];

export default {
  id: 'estadistica',
  nombre: { es: 'Estadística', en: 'Statistics' },
  curso: 2,
  concepto: 'estadistica',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    if (datos.opciones) return datos;
    const { texto, enunciado, correcta, solucion, distractores, genericos } = datos;
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
