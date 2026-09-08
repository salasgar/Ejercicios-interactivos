// Cómo se dicen y escriben los números y las operaciones en inglés.

import { construirOpciones, conReintentos, erroresDe, tex, opcionesCorrectoIncorrecto } from './index.js';
import { numeroAIngles, numeroAInglesSinAnd, enDosDigitos, enGrupoDeTres } from './palabras.js';

export const errores = {
  // --- Número → palabras ---
  and_mal_puesto: { concepto: 'lenguaje_ingles',
    es: 'El "and" va justo después de "hundred", no entre las decenas y las unidades.', en: 'The "and" goes right after "hundred", not between the tens and the units.' },
  teen_ty_confundido: { concepto: 'lenguaje_ingles',
    es: 'Has confundido el -teen (10+) con el -ty (decena): son números distintos, por ejemplo thirteen es 13 y thirty es 30.', en: 'You mixed up -teen (10+) with -ty (a multiple of ten): thirteen is 13 but thirty is 30.' },
  cifras_cambiadas: { concepto: 'lenguaje_ingles',
    es: 'Las cifras de las decenas y las unidades están cambiadas de orden: no corresponden a este número.', en: 'The tens and units digits are swapped: they do not match this number.' },
  centena_plural: { concepto: 'lenguaje_ingles',
    es: '"Hundred" no se pone en plural cuando va después de un número: se dice "two hundred", no "two hundreds".', en: '"Hundred" does not take a plural after a number: it is "two hundred", not "two hundreds".' },
  falta_uno_centena: { concepto: 'lenguaje_ingles',
    es: 'Falta el "one" delante de "hundred": se dice "one hundred", no solo "hundred".', en: 'The "one" before "hundred" is missing: it is "one hundred", not just "hundred".' },
  mil_plural: { concepto: 'lenguaje_ingles',
    es: '"Thousand" no se pone en plural cuando va después de un número: se dice "three thousand", no "three thousands".', en: '"Thousand" does not take a plural after a number: it is "three thousand", not "three thousands".' },

  // --- Palabras → número ---
  cifras_cambiadas_numero: { concepto: 'lenguaje_ingles',
    es: 'Has cambiado el orden de las cifras de las decenas y las unidades al pasarlo a número.', en: 'You swapped the order of the tens and units digits when writing the number.' },
  teen_ty_numero: { concepto: 'lenguaje_ingles',
    es: 'Has confundido un -teen con un -ty: no es la decena, es el número entre 10 y 20 (o al revés).', en: 'You mixed up a -teen with a -ty: it is not the multiple of ten, it is the number between 10 and 20 (or the other way round).' },
  orden_de_magnitud: { concepto: 'lenguaje_ingles',
    es: 'Este número tiene un cero de más o de menos: revisa el orden de magnitud.', en: 'This number has one zero too many or too few: check the order of magnitude.' },

  // --- Cómo se lee: raíz cuadrada ---
  raiz_squared_root: { concepto: 'lenguaje_ingles',
    es: 'El orden correcto es "square root", no "squared root".', en: 'The correct order is "square root", not "squared root".' },
  raiz_root_square: { concepto: 'lenguaje_ingles',
    es: 'Se dice "square root", con "square" delante de "root", no al revés.', en: 'It is "square root", with "square" before "root", not the other way round.' },
  raiz_orden_invertido: { concepto: 'lenguaje_ingles',
    es: 'La expresión "square root of" va delante del número, no detrás.', en: 'The phrase "square root of" goes before the number, not after it.' },

  // --- Cómo se lee: al cuadrado ---
  squared_con_exponente: { concepto: 'lenguaje_ingles',
    es: '"Squared" ya incluye el exponente 2: no hace falta repetir el número después.', en: '"Squared" already includes the exponent 2: there is no need to repeat the number after it.' },
  raised_to_squared: { concepto: 'lenguaje_ingles',
    es: '"Raised to" se usa con "the power of", no con "squared": se dice solo "squared".', en: '"Raised to" goes with "the power of", not with "squared": just say "squared".' },
  reist: { concepto: 'lenguaje_ingles',
    es: '"Reist" no es una palabra inglesa: la forma correcta y más simple aquí es "squared".', en: '"Reist" is not an English word: the correct and simplest form here is "squared".' },
  root_en_vez_de_squared: { concepto: 'lenguaje_ingles',
    es: '"Root" es de la raíz cuadrada, no del cuadrado: un número al cuadrado se dice "squared".', en: '"Root" belongs to square roots, not to squares: a squared number is "squared".' },
  square_sin_d: { concepto: 'lenguaje_ingles',
    es: 'Falta la "d": el adjetivo es "squared", no "square".', en: 'The "d" is missing: the word is "squared", not "square".' },

  // --- Cómo se lee: al cubo ---
  cube_sin_d: { concepto: 'lenguaje_ingles',
    es: 'Falta la "d": el adjetivo es "cubed", no "cube".', en: 'The "d" is missing: the word is "cubed", not "cube".' },
  exponente_como_cuenta: { concepto: 'lenguaje_ingles',
    es: 'El exponente no cuenta cuántas veces se repite la base como palabra: se dice "X cubed".', en: 'The exponent is not the count of how many times the base word repeats: it is "X cubed".' },
  to_sin_power: { concepto: 'lenguaje_ingles',
    es: 'Falta "the power of": aquí lo más simple es decir "cubed".', en: 'It is missing "the power of": the simplest way here is "cubed".' },

  // --- Cómo se lee: potencia de cinco ---
  falta_to_the: { concepto: 'lenguaje_ingles',
    es: 'Falta "to the": se dice "to the power of five", no solo "power five".', en: 'It is missing "to the": it is "to the power of five", not just "power five".' },
  powered_by_mal: { concepto: 'lenguaje_ingles',
    es: '"Powered by" no se usa para leer potencias: se dice "to the power of".', en: '"Powered by" is not used to read powers: it is "to the power of".' },
  to_incompleto: { concepto: 'lenguaje_ingles',
    es: 'Falta "the power of" entre el "to" y el exponente.', en: 'It is missing "the power of" between the "to" and the exponent.' },

  // --- Cómo se lee: fracciones ---
  singular_en_vez_de_plural: { concepto: 'lenguaje_ingles',
    es: 'Con un numerador mayor que uno, el denominador va en plural.', en: 'With a numerator greater than one, the denominator word must be plural.' },
  numerador_como_ordinal: { concepto: 'lenguaje_ingles',
    es: 'El numerador se dice con un número normal (three), no con un ordinal (third).', en: 'The numerator is a plain number (three), not an ordinal (third).' },
  denominador_cardinal: { concepto: 'lenguaje_ingles',
    es: 'El denominador de una fracción se dice con un ordinal (quarters), no con el número normal (fours).', en: 'A fraction denominator uses an ordinal word (quarters), not the plain number (fours).' },

  // --- Cómo se lee: decimales ---
  comma_en_vez_de_point: { concepto: 'lenguaje_ingles',
    es: 'En inglés la coma decimal se dice "point", no "comma".', en: 'In English the decimal separator is read as "point", not "comma".' },
  decimal_como_decena: { concepto: 'lenguaje_ingles',
    es: 'Después de "point" cada cifra se lee suelta: no se lee como una decena.', en: 'After "point" each digit is read on its own: it is not read as a multiple of ten.' },
  and_en_vez_de_point: { concepto: 'lenguaje_ingles',
    es: 'Un número decimal no se lee con "and": la coma decimal se dice "point".', en: 'A decimal number is not read with "and": the decimal separator is "point".' },

  // --- Cómo se lee: resta ---
  less_en_vez_de_minus: { concepto: 'lenguaje_ingles',
    es: 'Para restar se dice "minus", no "less".', en: 'For subtraction you say "minus", not "less".' },
  rest_no_es_ingles: { concepto: 'lenguaje_ingles',
    es: '"Rest" no significa restar en inglés: la palabra correcta es "minus".', en: '"Rest" does not mean to subtract in English: the correct word is "minus".' },
  take_sin_away: { concepto: 'lenguaje_ingles',
    es: 'Falta "away": "take away" sí vale, pero "take" solo no; lo más simple es "minus".', en: 'It is missing "away": "take away" works, but "take" alone does not; the simplest word is "minus".' },

  // --- Cómo se lee: multiplicación ---
  for_en_vez_de_times: { concepto: 'lenguaje_ingles',
    es: 'Para multiplicar se dice "times", no "for" (aunque en español se diga "por").', en: 'For multiplication you say "times", not "for".' },
  by_en_vez_de_times: { concepto: 'lenguaje_ingles',
    es: 'Para multiplicar se dice "times", no "by" ("by" se usa para dividir).', en: 'For multiplication you say "times", not "by" ("by" is used for division).' },
  multiply_sin_by: { concepto: 'lenguaje_ingles',
    es: '"Multiply" necesita "by" entre los números: la forma más simple aquí es "times".', en: '"Multiply" needs "by" between the numbers: the simplest word here is "times".' },
  multiplication_en_vez_de_times: { concepto: 'lenguaje_ingles',
    es: '"Multiplication" es el nombre de la operación, no la palabra que va entre los números: se dice "times".', en: '"Multiplication" is the name of the operation, not the word between the numbers: it is "times".' },

  // --- Cómo se lee: división ---
  falta_by: { concepto: 'lenguaje_ingles',
    es: 'Falta "by": se dice "divided by", no solo "divided".', en: 'It is missing "by": it is "divided by", not just "divided".' },
  between_no_es_ingles: { concepto: 'lenguaje_ingles',
    es: '"Between" no significa dividir en inglés: la forma correcta es "divided by".', en: '"Between" does not mean divided in English: the correct phrase is "divided by".' },
  divide_sin_d: { concepto: 'lenguaje_ingles',
    es: 'El verbo va en participio: se dice "divided by", no "divide by".', en: 'The verb goes in the past participle: it is "divided by", not "divide by".' },

  // --- Cómo se lee: suma con igual ---
  is_equal_mal: { concepto: 'lenguaje_ingles',
    es: 'Para el resultado se dice "equals", no "is equal" seguido del número.', en: 'For the result you say "equals", not "is equal" followed by the number.' },
  more_en_vez_de_plus: { concepto: 'lenguaje_ingles',
    es: 'Para sumar se dice "plus", no "more".', en: 'For addition you say "plus", not "more".' },
  and_en_vez_de_plus: { concepto: 'lenguaje_ingles',
    es: 'Aquí para sumar se dice "plus" y para el resultado "equals", no "and... equal".', en: 'Here addition uses "plus" and the result uses "equals", not "and... equal".' },
  plas_en_vez_de_plus: { concepto: 'lenguaje_ingles',
    es: '"Plas" no existe: la palabra es "plus".', en: '"Plas" is not a word: it is spelt "plus".' },

  // --- ¿Cuál está bien escrito? (13) ---
  orto_13_thertin: { concepto: 'lenguaje_ingles', es: '"Thertin" no existe: 13 se escribe "thirteen".', en: 'There is no "thertin": 13 is spelt "thirteen".' },
  orto_13_threeten: { concepto: 'lenguaje_ingles', es: '"Threeten" no existe: 13 se escribe "thirteen".', en: 'There is no "threeten": 13 is spelt "thirteen".' },
  orto_13_treeteen: { concepto: 'lenguaje_ingles', es: '"Treeteen" no existe: 13 se escribe "thirteen".', en: 'There is no "treeteen": 13 is spelt "thirteen".' },
  confusion_13_thirty: { concepto: 'lenguaje_ingles', es: '"Thirty" es 30, no 13: 13 se escribe "thirteen".', en: '"Thirty" is 30, not 13: 13 is spelt "thirteen".' },
  confusion_13_threty: { concepto: 'lenguaje_ingles', es: '"Threty" no existe y además confunde 13 con 30: se escribe "thirteen".', en: '"Threty" is not a word and it also confuses 13 with 30: it is "thirteen".' },
  confusion_13_threety: { concepto: 'lenguaje_ingles', es: '"Threety" no existe y además confunde 13 con 30: se escribe "thirteen".', en: '"Threety" is not a word and it also confuses 13 with 30: it is "thirteen".' },

  // --- ¿Cuál está bien escrito? (15) ---
  orto_15_fiveteen: { concepto: 'lenguaje_ingles', es: '"Fiveteen" no existe: 15 se escribe "fifteen".', en: 'There is no "fiveteen": 15 is spelt "fifteen".' },
  confusion_15_fifty: { concepto: 'lenguaje_ingles', es: '"Fifty" es 50, no 15: 15 se escribe "fifteen".', en: '"Fifty" is 50, not 15: 15 is spelt "fifteen".' },
  orto_15_fifetin: { concepto: 'lenguaje_ingles', es: '"Fifetin" no existe: 15 se escribe "fifteen".', en: 'There is no "fifetin": 15 is spelt "fifteen".' },

  // --- ¿Cuál está bien escrito? (40, 50, 80) ---
  orto_40_fourty: { concepto: 'lenguaje_ingles', es: '"Fourty" no existe, aunque venga de "four": 40 se escribe "forty".', en: 'There is no "fourty", even though it comes from "four": 40 is spelt "forty".' },
  orto_50_fivety: { concepto: 'lenguaje_ingles', es: '"Fivety" no existe, aunque venga de "five": 50 se escribe "fifty".', en: 'There is no "fivety", even though it comes from "five": 50 is spelt "fifty".' },
  orto_80_eichty: { concepto: 'lenguaje_ingles', es: '"Eichty" no existe: 80 se escribe "eighty".', en: 'There is no "eichty": 80 is spelt "eighty".' },
  orto_80_eigty: { concepto: 'lenguaje_ingles', es: '"Eigty" no existe: 80 se escribe "eighty".', en: 'There is no "eigty": 80 is spelt "eighty".' },

  // --- ¿Cuál está bien escrito? (90 / 19) ---
  confusion_90_nineteen: { concepto: 'lenguaje_ingles', es: '"Nineteen" es 19, no 90: 90 se escribe "ninety".', en: '"Nineteen" is 19, not 90: 90 is spelt "ninety".' },
  confusion_19_ninety: { concepto: 'lenguaje_ingles', es: '"Ninety" es 90, no 19: 19 se escribe "nineteen".', en: '"Ninety" is 90, not 19: 19 is spelt "nineteen".' },

  // --- ¿Cuál está bien escrito? (100, 1000, 10000) ---
  orto_100_hundread: { concepto: 'lenguaje_ingles', es: '"Hundread" no existe: 100 se escribe "one hundred".', en: 'There is no "hundread": 100 is spelt "one hundred".' },
  orto_100_handred: { concepto: 'lenguaje_ingles', es: '"Handred" no existe: 100 se escribe "one hundred".', en: 'There is no "handred": 100 is spelt "one hundred".' },
  magnitud_100_thosand: { concepto: 'lenguaje_ingles', es: 'Eso es mil (y encima mal escrito): 100 se escribe "one hundred".', en: 'That is a thousand (and misspelt too): 100 is spelt "one hundred".' },
  magnitud_100_thousand: { concepto: 'lenguaje_ingles', es: '"One thousand" es 1000, no 100: 100 se escribe "one hundred".', en: '"One thousand" is 1000, not 100: 100 is spelt "one hundred".' },
  magnitud_1000_hundred: { concepto: 'lenguaje_ingles', es: '"One hundred" es 100, no 1000: 1000 se escribe "one thousand".', en: '"One hundred" is 100, not 1000: 1000 is spelt "one thousand".' },
  orto_1000_thosand: { concepto: 'lenguaje_ingles', es: '"Thosand" no existe: 1000 se escribe "one thousand".', en: 'There is no "thosand": 1000 is spelt "one thousand".' },
  magnitud_10000_onethousand: { concepto: 'lenguaje_ingles', es: '"One thousand" es 1000, no 10000: 10000 se escribe "ten thousand".', en: '"One thousand" is 1000, not 10000: 10000 is spelt "ten thousand".' },
  magnitud_10000_onemillion: { concepto: 'lenguaje_ingles', es: '"One million" es 1000000, no 10000: 10000 se escribe "ten thousand".', en: '"One million" is 1,000,000, not 10000: 10000 is spelt "ten thousand".' },
  orto_10000_milion: { concepto: 'lenguaje_ingles', es: '"Milion" se escribe con dos "l" y además es otra cifra: 10000 se escribe "ten thousand".', en: '"Milion" needs a double "l" and it is also the wrong number: 10000 is spelt "ten thousand".' },
  orto_10000_millon: { concepto: 'lenguaje_ingles', es: '"Millon" no existe y además es otra cifra: 10000 se escribe "ten thousand".', en: '"Millon" is not a word and it is also the wrong number: 10000 is spelt "ten thousand".' },

  // --- Ordinales ---
  ord_1_oneth: { concepto: 'lenguaje_ingles', es: '"Oneth" no existe: el ordinal de 1 es "first".', en: 'There is no "oneth": the ordinal of 1 is "first".' },
  ord_2_twoth: { concepto: 'lenguaje_ingles', es: '"Twoth" no existe: el ordinal de 2 es "second".', en: 'There is no "twoth": the ordinal of 2 is "second".' },
  ord_3_threeth: { concepto: 'lenguaje_ingles', es: '"Threeth" no existe: el ordinal de 3 es "third".', en: 'There is no "threeth": the ordinal of 3 is "third".' },
  ord_5_fiveth: { concepto: 'lenguaje_ingles', es: '"Fiveth" no existe: el ordinal de 5 es "fifth".', en: 'There is no "fiveth": the ordinal of 5 is "fifth".' },
  ord_8_eight: { concepto: 'lenguaje_ingles', es: 'Falta el "th" final: el ordinal de 8 es "eighth", no "eight".', en: 'The final "th" is missing: the ordinal of 8 is "eighth", not "eight".' },
  ord_8_eigth: { concepto: 'lenguaje_ingles', es: 'Las letras están cambiadas de orden: el ordinal de 8 es "eighth".', en: 'The letters are in the wrong order: the ordinal of 8 is "eighth".' },
  ord_9_nineth: { concepto: 'lenguaje_ingles', es: '"Nineth" no existe: el ordinal de 9 es "ninth", sin la "e".', en: 'There is no "nineth": the ordinal of 9 is "ninth", without the "e".' },
  ord_12_twelveth: { concepto: 'lenguaje_ingles', es: '"Twelveth" no existe: el ordinal de 12 es "twelfth".', en: 'There is no "twelveth": the ordinal of 12 is "twelfth".' },
  ord_20_twentyth: { concepto: 'lenguaje_ingles', es: '"Twentyth" no existe: el ordinal de 20 es "twentieth".', en: 'There is no "twentyth": the ordinal of 20 is "twentieth".' },

  // --- ¿Correcto o incorrecto? (la afirmación era verdadera) ---
  era_correcta: { concepto: 'lenguaje_ingles',
    es: 'Estaba bien escrito: esa es una forma correcta de escribirlo.', en: 'It was written correctly: that is a correct way to write it.' },
  era_correcta_and: { concepto: 'lenguaje_ingles',
    es: 'Estaba bien escrito: en inglés valen tanto la forma con "and" como la forma sin él.', en: 'It was written correctly: in English both the form with "and" and the form without it are valid.' },
};
const E = erroresDe(errores);

export const preguntas = {
  numero_en_palabras: { es: '¿Cómo se escribe este número en inglés?', en: 'How do you write this number in words?' },
  que_numero: { es: '¿Qué número es «{palabras}»?', en: 'Which number is "{palabras}"?' },
  como_se_lee: { es: '¿Cómo se lee esto en inglés?', en: 'How do you read this?' },
  bien_escrito: { es: '¿Cuál está bien escrito?', en: 'Which one is spelt correctly?' },
  ordinal: { es: '¿Cómo se escribe este ordinal en inglés: {n}?', en: 'How do you write this ordinal in words: {n}?' },
  se_escribe: { es: '{n} se escribe «{palabras}».', en: '{n} is written "{palabras}".' },
};

// ---------------------------------------------------------------------------
// Ayudas.

const numTex = (v, error) => ({ tex: tex(v), clave: v, error });

function pluralInglesSimple(w) {
  return /[xsz]$|sh$|ch$/.test(w) ? `${w}es` : `${w}s`;
}

function descomponer(n) {
  const millones = Math.floor(n / 1000000);
  const restoM = n % 1000000;
  const miles = Math.floor(restoM / 1000);
  const resto3 = restoM % 1000;
  const centena = Math.floor(resto3 / 100);
  const cola = resto3 % 100;
  return { millones, miles, centena, cola };
}

function elegirNumero(rng) {
  switch (rng.entero(0, 7)) {
    case 0: return rng.elegir([13, 14, 15, 16, 17, 18, 19]);
    case 1: return rng.elegir([30, 40, 50, 60, 70, 80, 90]);
    case 2: return rng.entero(21, 99);
    case 3: return rng.elegir([100, 200, 300, 400, 500, 600, 700, 800, 900]);
    case 4: return 100 + rng.entero(1, 99);
    case 5: return rng.entero(101, 999);
    case 6: return rng.entero(1000, 99999);
    default: return rng.entero(100000, 999999);
  }
}

// ---------------------------------------------------------------------------
// Número → palabras.

/** Formas válidas de n y candidatos a distractor (con su error real), reutilizados por
 * "numero_en_palabras" y por "se_escribe". */
function candidatosNumeroEnPalabras(n) {
  const formasValidas = new Set([numeroAIngles(n), numeroAInglesSinAnd(n)]);
  const { millones, miles, centena, cola } = descomponer(n);
  const prefijo = () => {
    const p = [];
    if (millones > 0) p.push(`${enGrupoDeTres(millones, true)} million`);
    if (miles > 0) p.push(`${enGrupoDeTres(miles, true)} thousand`);
    return p;
  };

  const candidatos = [];

  if (centena > 0 && cola >= 21 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    const piezas = prefijo();
    piezas.push(`${enDosDigitos(centena)} hundred ${enDosDigitos(d * 10)} and ${enDosDigitos(u)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('and_mal_puesto') });
  }

  const TEEN_A_TY = { 13: 'thirty', 14: 'forty', 15: 'fifty', 16: 'sixty', 17: 'seventy', 18: 'eighty', 19: 'ninety' };
  const TY_A_TEEN = { 30: 'thirteen', 40: 'fourteen', 50: 'fifteen', 60: 'sixteen', 70: 'seventeen', 80: 'eighteen', 90: 'nineteen' };
  const colaMal = TEEN_A_TY[cola] ?? TY_A_TEEN[cola];
  if (colaMal) {
    const piezas = prefijo();
    if (centena > 0) piezas.push(`${enDosDigitos(centena)} hundred and ${colaMal}`);
    else if (piezas.length > 0) piezas.push(`and ${colaMal}`);
    else piezas.push(colaMal);
    candidatos.push({ texto: piezas.join(' '), error: E('teen_ty_confundido') });
  }

  if (cola >= 21 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    if (d !== u) {
      const colaCambiada = u * 10 + d;
      const piezas = prefijo();
      if (centena > 0) piezas.push(`${enDosDigitos(centena)} hundred and ${enDosDigitos(colaCambiada)}`);
      else if (piezas.length > 0) piezas.push(`and ${enDosDigitos(colaCambiada)}`);
      else piezas.push(enDosDigitos(colaCambiada));
      candidatos.push({ texto: piezas.join(' '), error: E('cifras_cambiadas') });
    }
  }

  if (centena >= 2) {
    const piezas = prefijo();
    piezas.push(cola > 0 ? `${enDosDigitos(centena)} hundreds and ${enDosDigitos(cola)}` : `${enDosDigitos(centena)} hundreds`);
    candidatos.push({ texto: piezas.join(' '), error: E('centena_plural') });
  } else if (centena === 1) {
    const piezas = prefijo();
    piezas.push(cola > 0 ? `hundred and ${enDosDigitos(cola)}` : 'hundred');
    candidatos.push({ texto: piezas.join(' '), error: E('falta_uno_centena') });
  }

  if (miles >= 1) {
    const piezas = [];
    if (millones > 0) piezas.push(`${enGrupoDeTres(millones, true)} million`);
    piezas.push(`${enGrupoDeTres(miles, true)} thousands`);
    if (centena > 0) piezas.push(cola > 0 ? `${enDosDigitos(centena)} hundred and ${enDosDigitos(cola)}` : `${enDosDigitos(centena)} hundred`);
    else if (cola > 0) piezas.push(`and ${enDosDigitos(cola)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('mil_plural') });
  }

  return { formasValidas, candidatos: candidatos.filter(c => !formasValidas.has(c.texto)) };
}

function generarNumeroEnPalabras(rng) {
  const n = elegirNumero(rng);
  const formaCorrecta = rng.moneda(0.5) ? numeroAIngles(n) : numeroAInglesSinAnd(n);
  const { formasValidas, candidatos } = candidatosNumeroEnPalabras(n);

  const distractores = candidatos.map(c => ({ texto: c.texto, clave: c.texto, error: c.error }));

  const genericos = [n + 1, n - 1]
    .filter(m => m >= 0 && m <= 999999 && !formasValidas.has(numeroAIngles(m)))
    .map(m => ({ texto: numeroAIngles(m), clave: `g${m}` }));

  return {
    texto: { clave: 'numero_en_palabras' },
    enunciado: tex(n),
    correcta: { texto: formaCorrecta, clave: 'correcta' },
    distractores,
    genericos,
  };
}

// ---------------------------------------------------------------------------
// Palabras → número.

function generarQueNumero(rng) {
  const n = elegirNumero(rng);
  const palabras = rng.moneda(0.5) ? numeroAIngles(n) : numeroAInglesSinAnd(n);
  const { cola } = descomponer(n);

  const candidatos = [];
  const TEEN_TY_NUM = { 13: 30, 14: 40, 15: 50, 16: 60, 17: 70, 18: 80, 19: 90, 30: 13, 40: 14, 50: 15, 60: 16, 70: 17, 80: 18, 90: 19 };
  if (TEEN_TY_NUM[cola] !== undefined) candidatos.push({ n: n - cola + TEEN_TY_NUM[cola], error: E('teen_ty_numero') });

  if (cola >= 21 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    if (d !== u) candidatos.push({ n: n - cola + (u * 10 + d), error: E('cifras_cambiadas_numero') });
  }

  if (n * 10 <= 999999) candidatos.push({ n: n * 10, error: E('orden_de_magnitud') });
  else if (n % 10 === 0) candidatos.push({ n: n / 10, error: E('orden_de_magnitud') });

  const distractores = candidatos
    .filter(c => c.n !== n && c.n >= 0)
    .map(c => numTex(c.n, c.error));

  const genericos = [n + 2, n - 2, n + 5]
    .filter(m => m >= 0 && m <= 999999 && m !== n)
    .map(m => numTex(m));

  return {
    texto: { clave: 'que_numero', params: { palabras } },
    enunciado: '',
    correcta: numTex(n),
    distractores,
    genericos,
  };
}

// ---------------------------------------------------------------------------
// Cómo se lee.

function palabra(texto, id) {
  return { texto, clave: texto, error: E(id) };
}

function casoTexto(enunciado, correctaTexto, distractoresLista) {
  return {
    texto: { clave: 'como_se_lee' },
    enunciado,
    correcta: { texto: correctaTexto, clave: 'correcta' },
    distractores: distractoresLista,
    genericos: [],
  };
}

function comoSeLeeRaiz(rng) {
  const base = rng.entero(2, 12);
  const cuadrado = base * base;
  const w = numeroAIngles(cuadrado);
  return casoTexto(`\\sqrt{${cuadrado}}`, `the square root of ${w}`, [
    palabra(`squared root ${w}`, 'raiz_squared_root'),
    palabra(`the root square of ${w}`, 'raiz_root_square'),
    palabra(`${w} square root`, 'raiz_orden_invertido'),
  ]);
}

function comoSeLeeAlCuadrado(rng) {
  const base = rng.entero(2, 12);
  const wordB = numeroAIngles(base);
  const pool = [
    palabra(`${wordB} squared two`, 'squared_con_exponente'),
    palabra(`${wordB} raised to squared`, 'raised_to_squared'),
    palabra(`${wordB} reist to two`, 'reist'),
    palabra(`${wordB} root two`, 'root_en_vez_de_squared'),
    palabra(`${wordB} square`, 'square_sin_d'),
  ];
  return casoTexto(`${base}^{2}`, `${wordB} squared`, rng.barajar(pool).slice(0, 3));
}

function comoSeLeeAlCubo(rng) {
  const base = rng.entero(2, 9);
  const wordB = numeroAIngles(base);
  const wordTres = numeroAIngles(3);
  return casoTexto(`${base}^{3}`, `${wordB} cubed`, [
    palabra(`${wordB} cube`, 'cube_sin_d'),
    palabra(`${wordTres} ${pluralInglesSimple(wordB)}`, 'exponente_como_cuenta'),
    palabra(`${wordB} to ${wordTres}`, 'to_sin_power'),
  ]);
}

function comoSeLeePotenciaCinco(rng) {
  const base = rng.entero(2, 9);
  const wordB = numeroAIngles(base);
  const wordCinco = numeroAIngles(5);
  return casoTexto(`${base}^{5}`, `${wordB} to the power of ${wordCinco}`, [
    palabra(`${wordB} power ${wordCinco}`, 'falta_to_the'),
    palabra(`${wordB} powered by ${wordCinco}`, 'powered_by_mal'),
    palabra(`${wordB} to ${wordCinco}`, 'to_incompleto'),
  ]);
}

const FRACCIONES = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8]];
const ORDINAL_CARDINAL = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth' };

function ordinalDenominador(den) {
  if (den === 2) return 'half';
  if (den === 4) return 'quarter';
  return ORDINAL_CARDINAL[den];
}
function pluralOrdinal(den) {
  const o = ordinalDenominador(den);
  return o === 'half' ? 'halves' : `${o}s`;
}

function comoSeLeeFraccion(rng) {
  const [num, den] = rng.elegir(FRACCIONES);
  const ordinal = ordinalDenominador(den);
  const plural = pluralOrdinal(den);
  const wordNum = numeroAIngles(num);
  const correcta = num === 1
    ? (rng.moneda(0.5) ? `${ordinal === 'eighth' ? 'an' : 'a'} ${ordinal}` : `one ${ordinal}`)
    : `${wordNum} ${plural}`;

  const candidatos = [];
  if (num >= 2) candidatos.push(palabra(`${wordNum} ${ordinal}`, 'singular_en_vez_de_plural'));
  candidatos.push(palabra(`${ORDINAL_CARDINAL[num]} ${plural}`, 'numerador_como_ordinal'));
  candidatos.push(palabra(`${wordNum} ${pluralInglesSimple(numeroAIngles(den))}`, 'denominador_cardinal'));
  const distractores = candidatos.filter(c => c.texto !== correcta);

  const otras = FRACCIONES.filter(([n2, d2]) => !(n2 === num && d2 === den));
  const genericos = rng.barajar(otras).slice(0, 2).map(([n2, d2]) => {
    const o2 = ordinalDenominador(d2), p2 = pluralOrdinal(d2);
    const t = n2 === 1 ? `a ${o2}` : `${numeroAIngles(n2)} ${p2}`;
    return { texto: t, clave: t };
  });

  return {
    texto: { clave: 'como_se_lee' },
    enunciado: `\\frac{${num}}{${den}}`,
    correcta: { texto: correcta, clave: 'correcta' },
    distractores,
    genericos,
  };
}

function comoSeLeeDecimal(rng) {
  const entero = rng.entero(0, 12);
  const decimal = rng.entero(1, 9);
  const wordEntero = numeroAIngles(entero);
  const wordDecimal = numeroAIngles(decimal);
  return casoTexto(`${entero}{,}${decimal}`, `${wordEntero} point ${wordDecimal}`, [
    palabra(`${wordEntero} comma ${wordDecimal}`, 'comma_en_vez_de_point'),
    palabra(`${wordEntero} point ${numeroAIngles(decimal * 10)}`, 'decimal_como_decena'),
    palabra(`${wordEntero} and ${wordDecimal}`, 'and_en_vez_de_point'),
  ]);
}

function comoSeLeeResta(rng) {
  const b = rng.entero(1, 15);
  const a = b + rng.entero(1, 15);
  const wordA = numeroAIngles(a), wordB = numeroAIngles(b);
  return casoTexto(`${a} - ${b}`, `${wordA} minus ${wordB}`, [
    palabra(`${wordA} less ${wordB}`, 'less_en_vez_de_minus'),
    palabra(`${wordA} rest ${wordB}`, 'rest_no_es_ingles'),
    palabra(`${wordA} take ${wordB}`, 'take_sin_away'),
  ]);
}

function comoSeLeeMultiplicacion(rng) {
  const a = rng.entero(2, 12), b = rng.entero(2, 12);
  const wordA = numeroAIngles(a), wordB = numeroAIngles(b);
  const pool = [
    palabra(`${wordA} for ${wordB}`, 'for_en_vez_de_times'),
    palabra(`${wordA} by ${wordB}`, 'by_en_vez_de_times'),
    palabra(`${wordA} multiply ${wordB}`, 'multiply_sin_by'),
    palabra(`${wordA} multiplication ${wordB}`, 'multiplication_en_vez_de_times'),
  ];
  return casoTexto(`${a} \\cdot ${b}`, `${wordA} times ${wordB}`, rng.barajar(pool).slice(0, 3));
}

function comoSeLeeDivision(rng) {
  const b = rng.entero(2, 9), k = rng.entero(2, 9);
  const a = b * k;
  const wordA = numeroAIngles(a), wordB = numeroAIngles(b);
  return casoTexto(`${a} \\div ${b}`, `${wordA} divided by ${wordB}`, [
    palabra(`${wordA} divided ${wordB}`, 'falta_by'),
    palabra(`${wordA} between ${wordB}`, 'between_no_es_ingles'),
    palabra(`${wordA} divide by ${wordB}`, 'divide_sin_d'),
  ]);
}

function comoSeLeeSuma(rng) {
  const a = rng.entero(1, 12), b = rng.entero(1, 12);
  const c = a + b;
  const wordA = numeroAIngles(a), wordB = numeroAIngles(b), wordC = numeroAIngles(c);
  const pool = [
    palabra(`${wordA} plus ${wordB} is equal ${wordC}`, 'is_equal_mal'),
    palabra(`${wordA} more ${wordB} equals ${wordC}`, 'more_en_vez_de_plus'),
    palabra(`${wordA} and ${wordB} equal ${wordC}`, 'and_en_vez_de_plus'),
    palabra(`${wordA} plas ${wordB} equals ${wordC}`, 'plas_en_vez_de_plus'),
  ];
  return casoTexto(`${a} + ${b} = ${c}`, `${wordA} plus ${wordB} equals ${wordC}`, rng.barajar(pool).slice(0, 3));
}

const COMO_SE_LEE = [
  comoSeLeeRaiz, comoSeLeeAlCuadrado, comoSeLeeAlCubo, comoSeLeePotenciaCinco, comoSeLeeFraccion,
  comoSeLeeDecimal, comoSeLeeResta, comoSeLeeMultiplicacion, comoSeLeeDivision, comoSeLeeSuma,
];

function generarComoSeLee(rng) {
  return rng.elegir(COMO_SE_LEE)(rng);
}

// ---------------------------------------------------------------------------
// ¿Cuál está bien escrito?

const BIEN_ESCRITO = [
  { n: 13, correcta: 'thirteen', opciones: [
    ['thertin', 'orto_13_thertin'], ['threeten', 'orto_13_threeten'], ['treeteen', 'orto_13_treeteen'],
    ['thirty', 'confusion_13_thirty'], ['threty', 'confusion_13_threty'], ['threety', 'confusion_13_threety'],
  ] },
  { n: 15, correcta: 'fifteen', opciones: [
    ['fiveteen', 'orto_15_fiveteen'], ['fifty', 'confusion_15_fifty'], ['fifetin', 'orto_15_fifetin'],
  ] },
  { n: 40, correcta: 'forty', opciones: [['fourty', 'orto_40_fourty']] },
  { n: 50, correcta: 'fifty', opciones: [['fivety', 'orto_50_fivety']] },
  { n: 80, correcta: 'eighty', opciones: [['eichty', 'orto_80_eichty'], ['eigty', 'orto_80_eigty']] },
  { n: 90, correcta: 'ninety', opciones: [['nineteen', 'confusion_90_nineteen']] },
  { n: 19, correcta: 'nineteen', opciones: [['ninety', 'confusion_19_ninety']] },
  { n: 100, correcta: 'one hundred', opciones: [
    ['one hundread', 'orto_100_hundread'], ['one handred', 'orto_100_handred'],
    ['one thosand', 'magnitud_100_thosand'], ['one thousand', 'magnitud_100_thousand'],
  ] },
  { n: 1000, correcta: 'one thousand', opciones: [
    ['one hundred', 'magnitud_1000_hundred'], ['one thosand', 'orto_1000_thosand'],
  ] },
  { n: 10000, correcta: 'ten thousand', opciones: [
    ['one thousand', 'magnitud_10000_onethousand'], ['one million', 'magnitud_10000_onemillion'],
    ['one milion', 'orto_10000_milion'], ['one millon', 'orto_10000_millon'],
  ] },
];

function generarBienEscrito(rng) {
  const caso = rng.elegir(BIEN_ESCRITO);
  const propias = caso.opciones.map(([t, id]) => palabra(t, id));
  const otras = BIEN_ESCRITO
    .filter(c => c.n !== caso.n)
    .flatMap(c => c.opciones.map(([t]) => t))
    .filter(t => t !== caso.correcta);
  const genericos = rng.barajar(otras).slice(0, 4).map(t => ({ texto: t, clave: t }));
  return {
    texto: { clave: 'bien_escrito' },
    enunciado: tex(caso.n),
    correcta: { texto: caso.correcta, clave: 'correcta' },
    distractores: propias,
    genericos,
  };
}

// ---------------------------------------------------------------------------
// Ordinales.

const ORDINAL_CASOS = [
  { n: '1st', correcta: 'first', opciones: [['oneth', 'ord_1_oneth']] },
  { n: '2nd', correcta: 'second', opciones: [['twoth', 'ord_2_twoth']] },
  { n: '3rd', correcta: 'third', opciones: [['threeth', 'ord_3_threeth']] },
  { n: '5th', correcta: 'fifth', opciones: [['fiveth', 'ord_5_fiveth']] },
  { n: '8th', correcta: 'eighth', opciones: [['eight', 'ord_8_eight'], ['eigth', 'ord_8_eigth']] },
  { n: '9th', correcta: 'ninth', opciones: [['nineth', 'ord_9_nineth']] },
  { n: '12th', correcta: 'twelfth', opciones: [['twelveth', 'ord_12_twelveth']] },
  { n: '20th', correcta: 'twentieth', opciones: [['twentyth', 'ord_20_twentyth']] },
];

function generarOrdinal(rng) {
  const caso = rng.elegir(ORDINAL_CASOS);
  const propias = caso.opciones.map(([t, id]) => palabra(t, id));
  const otras = ORDINAL_CASOS
    .filter(c => c.n !== caso.n)
    .flatMap(c => [c.correcta, ...c.opciones.map(([t]) => t)])
    .filter(t => t !== caso.correcta);
  const genericos = rng.barajar(otras).slice(0, 4).map(t => ({ texto: t, clave: t }));
  return {
    texto: { clave: 'ordinal', params: { n: caso.n } },
    enunciado: '',
    correcta: { texto: caso.correcta, clave: 'correcta' },
    distractores: propias,
    genericos,
  };
}

// ---------------------------------------------------------------------------
// ¿Correcto o incorrecto? (verdadero/falso sobre una forma escrita)

function casoSeEscribe(n, palabras, esCorrecta, error) {
  return {
    texto: { clave: 'se_escribe', params: { n, palabras } },
    enunciado: '',
    opciones: opcionesCorrectoIncorrecto(esCorrecta, error),
  };
}

function generarSeEscribe(rng) {
  const esCorrecta = rng.moneda(0.5);

  if (rng.moneda(0.5)) {
    // Fuente 1: un número cualquiera, con las dos formas válidas (con/sin "and")
    // y los mismos errores reales que en "numero_en_palabras".
    const n = elegirNumero(rng);
    const { formasValidas, candidatos } = candidatosNumeroEnPalabras(n);
    if (esCorrecta) return casoSeEscribe(n, rng.elegir([...formasValidas]), true, E('era_correcta_and'));
    if (candidatos.length === 0) return null;
    const elegido = rng.elegir(candidatos);
    return casoSeEscribe(n, elegido.texto, false, elegido.error);
  }

  // Fuente 2: el banco de ortografías y ordinales reales de los alumnos.
  const caso = rng.elegir([...BIEN_ESCRITO, ...ORDINAL_CASOS]);
  if (esCorrecta) return casoSeEscribe(caso.n, caso.correcta, true, E('era_correcta'));
  const [texto, id] = rng.elegir(caso.opciones);
  return casoSeEscribe(caso.n, texto, false, E(id));
}

// ---------------------------------------------------------------------------

const FORMAS = [
  generarNumeroEnPalabras, generarNumeroEnPalabras,
  generarQueNumero,
  generarComoSeLee, generarComoSeLee, generarComoSeLee,
  generarBienEscrito,
  generarOrdinal,
];

function elegirForma(rng) {
  return rng.moneda(0.25) ? generarSeEscribe(rng) : rng.elegir(FORMAS)(rng);
}

export default {
  id: 'lenguaje_ingles',
  nombre: { es: 'Matemáticas en inglés', en: 'Maths in English' },
  curso: 1,
  concepto: 'lenguaje_ingles',
  preguntas,
  errores,
  generar: conReintentos(rng => {
    const resultado = elegirForma(rng);
    if (!resultado) return null;
    if (resultado.opciones) return resultado;
    const { texto, enunciado, correcta, distractores, genericos } = resultado;
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, opciones };
  }),
};
