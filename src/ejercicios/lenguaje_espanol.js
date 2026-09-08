// Cómo se dicen y escriben los números y las operaciones en español.

import { construirOpciones, conReintentos, erroresDe, tex, opcionesCorrectoIncorrecto } from './index.js';
import { numeroAEspanol, esDosDigitos, esGrupoDeTres } from './palabras.js';

export const errores = {
  // --- Número → palabras ---
  cien_en_vez_de_ciento: { concepto: 'lenguaje_espanol',
    es: 'Delante de otra cifra se dice "ciento", no "cien": "cien" solo se usa cuando el número es exactamente 100.', en: 'Before another digit you say "ciento", not "cien": "cien" is only used when the number is exactly 100.' },
  ciento_en_vez_de_cien: { concepto: 'lenguaje_espanol',
    es: 'Cuando el número es exactamente 100 (sin nada detrás) se dice "cien", no "ciento".', en: 'When the number is exactly 100 (with nothing after it) you say "cien", not "ciento".' },
  y_de_mas: { concepto: 'lenguaje_espanol',
    es: 'No se pone "y" justo después de "ciento" ni de las centenas: la "y" solo va entre las decenas y las unidades.', en: 'There is no "y" right after "ciento" or the hundreds word: the "y" only goes between the tens and the units.' },
  falta_y: { concepto: 'lenguaje_espanol',
    es: 'Falta la "y" entre las decenas y las unidades: se dice "setenta y tres", no "setenta tres".', en: 'The "y" between the tens and the units is missing: it is "setenta y tres", not "setenta tres".' },
  cifras_cambiadas: { concepto: 'lenguaje_espanol',
    es: 'Las cifras de las decenas y las unidades están cambiadas de orden: no corresponden a este número.', en: 'The tens and units digits are swapped: they do not match this number.' },
  cientos_separado: { concepto: 'lenguaje_espanol',
    es: 'Las centenas se escriben juntas en una sola palabra: "doscientos", no "dos cientos".', en: 'The hundreds word is written as one single word: "doscientos", not "dos cientos".' },
  ortografia_setecientos: { concepto: 'lenguaje_espanol',
    es: '700 se escribe "setecientos", no "sietecientos".', en: '700 is spelt "setecientos", not "sietecientos".' },
  ortografia_novecientos: { concepto: 'lenguaje_espanol',
    es: '900 se escribe "novecientos", no "nuevecientos".', en: '900 is spelt "novecientos", not "nuevecientos".' },
  diez_y_separado: { concepto: 'lenguaje_espanol',
    es: 'Los números del 16 al 19 se escriben en una sola palabra: "dieciséis", no "diez y seis".', en: 'Numbers from 16 to 19 are written as one word: "dieciséis", not "diez y seis".' },
  veinte_y_separado: { concepto: 'lenguaje_espanol',
    es: 'Los números del 21 al 29 se escriben en una sola palabra: "veintiuno", no "veinte y uno".', en: 'Numbers from 21 to 29 are written as one word: "veintiuno", not "veinte y uno".' },
  un_mil: { concepto: 'lenguaje_espanol',
    es: 'Delante de "mil" no se pone "un": se dice "mil", no "un mil".', en: 'You do not put "un" before "mil": it is just "mil", not "un mil".' },
  mil_plural: { concepto: 'lenguaje_espanol',
    es: '"Mil" no se pone en plural: se dice "tres mil", no "tres miles".', en: '"Mil" does not take a plural: it is "tres mil", not "tres miles".' },
  cifras_invertidas: { concepto: 'lenguaje_espanol',
    es: 'Has escrito las cifras del número en un orden distinto al que se pedía.', en: 'You wrote the digits of the number in a different order than the one asked.' },
  sin_tilde: { concepto: 'lenguaje_espanol',
    es: 'Le falta la tilde: esta palabra lleva acento escrito.', en: 'The written accent (tilde) is missing on this word.' },

  // --- Palabras → número ---
  cifras_cambiadas_numero: { concepto: 'lenguaje_espanol',
    es: 'Has cambiado el orden de las cifras de las decenas y las unidades al pasarlo a número.', en: 'You swapped the order of the tens and units digits when writing the number.' },
  orden_de_magnitud: { concepto: 'lenguaje_espanol',
    es: 'Este número tiene un cero de más o de menos: revisa el orden de magnitud.', en: 'This number has one zero too many or too few: check the order of magnitude.' },
  cifras_invertidas_numero: { concepto: 'lenguaje_espanol',
    es: 'Has escrito las cifras del número en un orden distinto al que decían las palabras.', en: 'You wrote the digits in a different order than the one the words said.' },

  // --- Cómo se lee: raíz cuadrada ---
  orden_raiz: { concepto: 'lenguaje_espanol',
    es: '"Cuadrada" va justo después de "raíz", no al final de la frase.', en: '"Cuadrada" goes right after "raíz", not at the end of the phrase.' },
  cuadrado_de_la_raiz: { concepto: 'lenguaje_espanol',
    es: 'Esto es la raíz cuadrada del número, no el cuadrado de una raíz: son cosas distintas.', en: 'This is the square root of the number, not the square of a root: they are different things.' },
  orden_invertido_raiz: { concepto: 'lenguaje_espanol',
    es: '"La raíz cuadrada de" va delante del número, no detrás.', en: 'The phrase "the square root of" goes before the number, not after it.' },

  // --- Cómo se lee: al cuadrado ---
  falta_al: { concepto: 'lenguaje_espanol',
    es: 'Falta el "al": se dice "al cuadrado", no solo "cuadrado".', en: 'The "al" is missing: it is "al cuadrado", not just "cuadrado".' },
  interpretar_como_producto: { concepto: 'lenguaje_espanol',
    es: 'Elevar al cuadrado no es multiplicar por dos: es multiplicar el número por sí mismo.', en: 'Squaring is not multiplying by two: it means multiplying the number by itself.' },
  orden_invertido_cuadrado: { concepto: 'lenguaje_espanol',
    es: '"Al cuadrado" va después del número, no delante.', en: '"Al cuadrado" goes after the number, not before it.' },

  // --- Cómo se lee: al cubo ---
  falta_al_cubo: { concepto: 'lenguaje_espanol',
    es: 'Falta el "al": se dice "al cubo", no solo "cubo".', en: 'The "al" is missing: it is "al cubo", not just "cubo".' },
  interpretar_como_producto_cubo: { concepto: 'lenguaje_espanol',
    es: 'Elevar al cubo no es multiplicar por tres: es multiplicar el número por sí mismo tres veces.', en: 'Cubing is not multiplying by three: it means multiplying the number by itself three times.' },
  falta_al_y_cubo: { concepto: 'lenguaje_espanol',
    es: 'Faltan las palabras "al cubo" enteras, no solo el número del exponente.', en: 'The whole phrase "al cubo" is missing, not just the exponent number.' },

  // --- Cómo se lee: potencia de cinco ---
  interpretar_como_producto_potencia: { concepto: 'lenguaje_espanol',
    es: 'Elevar a una potencia no es multiplicar por el exponente: es repetir la base como factor.', en: 'Raising to a power is not multiplying by the exponent: it means repeating the base as a factor.' },
  falta_elevado: { concepto: 'lenguaje_espanol',
    es: 'Falta la palabra "elevado": se dice "elevado a cinco", no solo "a cinco".', en: 'The word "elevado" is missing: it is "elevado a cinco", not just "a cinco".' },
  falta_elevado_a: { concepto: 'lenguaje_espanol',
    es: 'Faltan las palabras "elevado a": no se puede decir solo el exponente pegado al número.', en: 'The words "elevado a" are missing: you cannot just say the exponent next to the number.' },

  // --- Cómo se lee: fracciones ---
  denominador_cardinal: { concepto: 'lenguaje_espanol',
    es: 'El denominador de una fracción se dice con un ordinal ("cuartos"), no con el número normal ("cuatros").', en: 'A fraction denominator uses an ordinal-style word ("cuartos"), not the plain number ("cuatros").' },
  de_en_vez_de_fraccion: { concepto: 'lenguaje_espanol',
    es: 'Una fracción no se lee con "de" entre los números: se dice "tres cuartos", no "tres de cuatro".', en: 'A fraction is not read with "de" between the numbers: it is "tres cuartos", not "tres de cuatro".' },
  singular_en_vez_de_plural: { concepto: 'lenguaje_espanol',
    es: 'Con un numerador mayor que uno, la palabra del denominador va en plural.', en: 'With a numerator greater than one, the denominator word must be plural.' },

  // --- Cómo se lee: decimales ---
  decimal_como_decena_es: { concepto: 'lenguaje_espanol',
    es: 'Después de la coma cada cifra se lee suelta: no se lee como una decena.', en: 'After the comma each digit is read on its own: it is not read as a multiple of ten.' },
  y_en_vez_de_coma: { concepto: 'lenguaje_espanol',
    es: 'Un número decimal no se lee con "y": la parte decimal va después de "coma".', en: 'A decimal number is not read with "y": the decimal part comes after "coma".' },
  con_decimales_mal: { concepto: 'lenguaje_espanol',
    es: 'No se dice "con... decimales": basta con decir "coma" seguido de las cifras.', en: 'You do not say "con... decimales": you just say "coma" followed by the digits.' },

  // --- Cómo se lee: operaciones (usan la operación equivocada) ---
  operacion_equivocada_suma: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una suma, pero la expresión es una resta: se usa "menos".', en: 'That reads as an addition, but the expression is a subtraction: use "menos".' },
  operacion_equivocada_producto: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una multiplicación, pero la expresión es una resta: se usa "menos".', en: 'That reads as a multiplication, but the expression is a subtraction: use "menos".' },
  operacion_equivocada_division: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una división, pero la expresión es una resta: se usa "menos".', en: 'That reads as a division, but the expression is a subtraction: use "menos".' },
  operacion_equivocada_suma_mult: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una suma, pero la expresión es una multiplicación: se usa "por".', en: 'That reads as an addition, but the expression is a multiplication: use "por".' },
  operacion_equivocada_resta_mult: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una resta, pero la expresión es una multiplicación: se usa "por".', en: 'That reads as a subtraction, but the expression is a multiplication: use "por".' },
  operacion_equivocada_division_mult: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una división, pero la expresión es una multiplicación: se usa "por".', en: 'That reads as a division, but the expression is a multiplication: use "por".' },
  operacion_equivocada_producto_div: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una multiplicación, pero la expresión es una división: se usa "entre".', en: 'That reads as a multiplication, but the expression is a division: use "entre".' },
  operacion_equivocada_resta_div: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una resta, pero la expresión es una división: se usa "entre".', en: 'That reads as a subtraction, but the expression is a division: use "entre".' },
  operacion_equivocada_suma_div: { concepto: 'lenguaje_espanol',
    es: 'Eso se lee como una suma, pero la expresión es una división: se usa "entre".', en: 'That reads as an addition, but the expression is a division: use "entre".' },

  // --- ¿Correcto o incorrecto? (la afirmación era verdadera) ---
  era_correcta: { concepto: 'lenguaje_espanol',
    es: 'Estaba bien escrito: esa es la forma correcta.', en: 'It was written correctly: that is the correct form.' },
};
const E = erroresDe(errores);

export const preguntas = {
  numero_en_palabras: { es: '¿Cómo se escribe este número con palabras?', en: 'How do you write this number in words (in Spanish)?' },
  que_numero: { es: '¿Qué número es «{palabras}»?', en: 'Which number is "{palabras}"?' },
  como_se_lee: { es: '¿Cómo se lee esto en español?', en: 'How do you read this (in Spanish)?' },
  se_escribe: { es: '{n} se escribe «{palabras}».', en: '{n} is written "{palabras}".' },
};

// ---------------------------------------------------------------------------
// Ayudas.

const numTex = (v, error) => ({ tex: tex(v), clave: v, error });
const CENTENAS_PALABRA = { 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos', 6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos' };
const DECENAS_PALABRA = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa' };

function descomponer(n) {
  const millones = Math.floor(n / 1000000);
  const restoM = n % 1000000;
  const miles = Math.floor(restoM / 1000);
  const resto3 = restoM % 1000;
  const centena = Math.floor(resto3 / 100);
  const cola = resto3 % 100;
  return { millones, miles, centena, cola, resto3 };
}

function elegirNumero(rng) {
  switch (rng.entero(0, 7)) {
    case 0: return rng.entero(11, 19);
    case 1: return rng.entero(21, 29);
    case 2: return rng.elegir([30, 40, 50, 60, 70, 80, 90]);
    case 3: return rng.entero(31, 99);
    case 4: return rng.elegir([100, 200, 300, 400, 500, 600, 700, 800, 900]);
    case 5: return 100 + rng.entero(1, 99);
    case 6: {
      let miles = rng.entero(2, 999);
      while (miles > 1 && miles % 10 === 1) miles = rng.entero(2, 999);
      return miles * 1000 + rng.entero(0, 999);
    }
    default: return rng.elegir([1000, 1001, 1000000]);
  }
}

// ---------------------------------------------------------------------------
// Número → palabras.

/** Forma correcta de n y candidatos a distractor (con su error real), reutilizados por
 * "numero_en_palabras" y por "se_escribe". */
function candidatosNumeroEnPalabras(n) {
  const correcta = numeroAEspanol(n);
  const { millones, miles, centena, cola, resto3 } = descomponer(n);
  const prefijo = () => {
    const p = [];
    if (millones > 0) p.push(millones === 1 ? 'un millón' : `${esGrupoDeTres(millones)} millones`);
    return p;
  };
  const conMiles = piezas => {
    if (miles > 0) piezas.push(miles === 1 ? 'mil' : `${esGrupoDeTres(miles)} mil`);
    return piezas;
  };

  const candidatos = [];

  if (centena === 1 && cola > 0) {
    const piezas = conMiles(prefijo());
    piezas.push(`cien ${esDosDigitos(cola)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('cien_en_vez_de_ciento') });
  }
  if (centena === 1 && cola === 0) {
    const piezas = conMiles(prefijo());
    piezas.push('ciento');
    candidatos.push({ texto: piezas.join(' '), error: E('ciento_en_vez_de_cien') });
  }
  if (centena > 0 && cola > 0) {
    const piezas = conMiles(prefijo());
    const prefijoCentena = centena === 1 ? 'ciento' : CENTENAS_PALABRA[centena];
    piezas.push(`${prefijoCentena} y ${esDosDigitos(cola)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('y_de_mas') });
  }
  if (cola >= 31 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    const piezas = conMiles(prefijo());
    if (centena > 0) piezas.push(esGrupoDeTres(centena * 100));
    piezas.push(`${DECENAS_PALABRA[d]} ${esDosDigitos(u)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('falta_y') });
  }
  if (cola >= 21 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    if (d !== u) {
      const nCambiado = n - cola + (u * 10 + d);
      candidatos.push({ texto: numeroAEspanol(nCambiado), error: E('cifras_cambiadas') });
    }
  }
  if (centena >= 2) {
    const piezas = conMiles(prefijo());
    let piezaCentena = `${esDosDigitos(centena)} cientos`;
    if (cola > 0) piezaCentena += ` ${esDosDigitos(cola)}`;
    piezas.push(piezaCentena);
    candidatos.push({ texto: piezas.join(' '), error: E('cientos_separado') });

    if (centena === 7 || centena === 9) {
      const piezas2 = conMiles(prefijo());
      let pc2 = centena === 7 ? 'sietecientos' : 'nuevecientos';
      if (cola > 0) pc2 += ` ${esDosDigitos(cola)}`;
      piezas2.push(pc2);
      candidatos.push({ texto: piezas2.join(' '), error: E(centena === 7 ? 'ortografia_setecientos' : 'ortografia_novecientos') });
    }
  }
  if (cola >= 16 && cola <= 19) {
    const piezas = conMiles(prefijo());
    if (centena > 0) piezas.push(esGrupoDeTres(centena * 100));
    piezas.push(`diez y ${esDosDigitos(cola - 10)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('diez_y_separado') });
  }
  if (cola >= 21 && cola <= 29) {
    const piezas = conMiles(prefijo());
    if (centena > 0) piezas.push(esGrupoDeTres(centena * 100));
    piezas.push(`veinte y ${esDosDigitos(cola - 20)}`);
    candidatos.push({ texto: piezas.join(' '), error: E('veinte_y_separado') });
  }
  if (miles === 1) {
    const piezas = prefijo();
    piezas.push('un mil');
    if (resto3 > 0) piezas.push(esGrupoDeTres(resto3));
    candidatos.push({ texto: piezas.join(' '), error: E('un_mil') });
  }
  if (miles >= 2) {
    const piezas = prefijo();
    piezas.push(`${esGrupoDeTres(miles)} miles`);
    if (resto3 > 0) piezas.push(esGrupoDeTres(resto3));
    candidatos.push({ texto: piezas.join(' '), error: E('mil_plural') });
  }
  {
    const invertido = Number(String(n).split('').reverse().join(''));
    if (invertido !== n && invertido >= 0 && invertido <= 1000000) {
      candidatos.push({ texto: numeroAEspanol(invertido), error: E('cifras_invertidas') });
    }
  }
  const SIN_TILDE_COLA = { 16: 'dieciseis', 22: 'veintidos', 23: 'veintitres', 26: 'veintiseis' };
  if (SIN_TILDE_COLA[cola]) {
    const piezas = conMiles(prefijo());
    if (centena > 0) piezas.push(esGrupoDeTres(centena * 100));
    piezas.push(SIN_TILDE_COLA[cola]);
    candidatos.push({ texto: piezas.join(' '), error: E('sin_tilde') });
  }

  return { correcta, candidatos: candidatos.filter(c => c.texto !== correcta) };
}

function generarNumeroEnPalabras(rng) {
  const n = elegirNumero(rng);
  const { correcta, candidatos } = candidatosNumeroEnPalabras(n);

  const distractores = candidatos.map(c => ({ texto: c.texto, clave: c.texto, error: c.error }));

  const genericos = [n + 1, n - 1, n + 2, n - 2]
    .filter(m => m >= 0 && m <= 1000000 && numeroAEspanol(m) !== correcta)
    .map(m => ({ texto: numeroAEspanol(m), clave: `g${m}` }));

  return {
    texto: { clave: 'numero_en_palabras' },
    enunciado: tex(n),
    correcta: { texto: correcta, clave: 'correcta' },
    distractores,
    genericos,
  };
}

// ---------------------------------------------------------------------------
// Palabras → número.

function generarQueNumero(rng) {
  const n = elegirNumero(rng);
  const palabras = numeroAEspanol(n);
  const { cola } = descomponer(n);

  const candidatos = [];
  if (cola >= 21 && cola % 10 !== 0) {
    const d = Math.floor(cola / 10), u = cola % 10;
    if (d !== u) candidatos.push({ n: n - cola + (u * 10 + d), error: E('cifras_cambiadas_numero') });
  }
  if (n * 10 <= 999999) candidatos.push({ n: n * 10, error: E('orden_de_magnitud') });
  else if (n % 10 === 0) candidatos.push({ n: n / 10, error: E('orden_de_magnitud') });
  {
    const invertido = Number(String(n).split('').reverse().join(''));
    if (invertido !== n) candidatos.push({ n: invertido, error: E('cifras_invertidas_numero') });
  }

  const distractores = candidatos.filter(c => c.n !== n && c.n >= 0).map(c => numTex(c.n, c.error));
  const genericos = [n + 2, n - 2, n + 5].filter(m => m >= 0 && m <= 1000000 && m !== n).map(m => numTex(m));

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
  const w = numeroAEspanol(cuadrado);
  return casoTexto(`\\sqrt{${cuadrado}}`, `la raíz cuadrada de ${w}`, [
    palabra(`raíz de ${w} cuadrada`, 'orden_raiz'),
    palabra(`el cuadrado de la raíz de ${w}`, 'cuadrado_de_la_raiz'),
    palabra(`${w} raíz cuadrada`, 'orden_invertido_raiz'),
  ]);
}

function comoSeLeeAlCuadrado(rng) {
  const base = rng.entero(2, 12);
  const w = numeroAEspanol(base);
  return casoTexto(`${base}^{2}`, `${w} al cuadrado`, [
    palabra(`${w} cuadrado`, 'falta_al'),
    palabra(`${w} por dos`, 'interpretar_como_producto'),
    palabra(`al cuadrado ${w}`, 'orden_invertido_cuadrado'),
  ]);
}

function comoSeLeeAlCubo(rng) {
  const base = rng.entero(2, 9);
  const w = numeroAEspanol(base);
  return casoTexto(`${base}^{3}`, `${w} al cubo`, [
    palabra(`${w} cubo`, 'falta_al_cubo'),
    palabra(`${w} por tres`, 'interpretar_como_producto_cubo'),
    palabra(`${w} tres`, 'falta_al_y_cubo'),
  ]);
}

function comoSeLeePotenciaCinco(rng) {
  const base = rng.entero(2, 9);
  const w = numeroAEspanol(base);
  return casoTexto(`${base}^{5}`, `${w} elevado a cinco`, [
    palabra(`${w} por cinco`, 'interpretar_como_producto_potencia'),
    palabra(`${w} a cinco`, 'falta_elevado'),
    palabra(`${w} cinco`, 'falta_elevado_a'),
  ]);
}

const DEN_PAL = { 3: 'tercio', 4: 'cuarto', 5: 'quinto', 8: 'octavo' };
const FRACCIONES = [[1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8]];

function comoSeLeeFraccion(rng) {
  const [num, den] = rng.elegir(FRACCIONES);
  const denPal = DEN_PAL[den];
  const wordNum = numeroAEspanol(num);
  const wordDen = numeroAEspanol(den);
  const correcta = num === 1 ? `un ${denPal}` : `${wordNum} ${denPal}s`;

  const candidatos = [
    palabra(`${wordNum} ${wordDen}s`, 'denominador_cardinal'),
    palabra(`${wordNum} de ${wordDen}`, 'de_en_vez_de_fraccion'),
  ];
  if (num >= 2) candidatos.push(palabra(`${wordNum} ${denPal}`, 'singular_en_vez_de_plural'));
  const distractores = candidatos.filter(c => c.texto !== correcta);

  const otras = FRACCIONES.filter(([n2, d2]) => !(n2 === num && d2 === den));
  const genericos = rng.barajar(otras).slice(0, 2).map(([n2, d2]) => {
    const t = n2 === 1 ? `un ${DEN_PAL[d2]}` : `${numeroAEspanol(n2)} ${DEN_PAL[d2]}s`;
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
  const wordEntero = numeroAEspanol(entero);
  const wordDecimal = numeroAEspanol(decimal);
  return casoTexto(`${entero}{,}${decimal}`, `${wordEntero} coma ${wordDecimal}`, [
    palabra(`${wordEntero} coma ${numeroAEspanol(decimal * 10)}`, 'decimal_como_decena_es'),
    palabra(`${wordEntero} y ${wordDecimal}`, 'y_en_vez_de_coma'),
    palabra(`${wordEntero} con ${wordDecimal} decimales`, 'con_decimales_mal'),
  ]);
}

function comoSeLeeResta(rng) {
  const b = rng.entero(1, 15);
  const a = b + rng.entero(1, 15);
  const wordA = numeroAEspanol(a), wordB = numeroAEspanol(b);
  return casoTexto(`${a} - ${b}`, `${wordA} menos ${wordB}`, [
    palabra(`${wordA} más ${wordB}`, 'operacion_equivocada_suma'),
    palabra(`${wordA} por ${wordB}`, 'operacion_equivocada_producto'),
    palabra(`${wordA} entre ${wordB}`, 'operacion_equivocada_division'),
  ]);
}

function comoSeLeeMultiplicacion(rng) {
  const a = rng.entero(2, 12), b = rng.entero(2, 12);
  const wordA = numeroAEspanol(a), wordB = numeroAEspanol(b);
  return casoTexto(`${a} \\cdot ${b}`, `${wordA} por ${wordB}`, [
    palabra(`${wordA} más ${wordB}`, 'operacion_equivocada_suma_mult'),
    palabra(`${wordA} menos ${wordB}`, 'operacion_equivocada_resta_mult'),
    palabra(`${wordA} entre ${wordB}`, 'operacion_equivocada_division_mult'),
  ]);
}

function comoSeLeeDivision(rng) {
  const b = rng.entero(2, 9), k = rng.entero(2, 9);
  const a = b * k;
  const wordA = numeroAEspanol(a), wordB = numeroAEspanol(b);
  return casoTexto(`${a} \\div ${b}`, `${wordA} entre ${wordB}`, [
    palabra(`${wordA} por ${wordB}`, 'operacion_equivocada_producto_div'),
    palabra(`${wordA} menos ${wordB}`, 'operacion_equivocada_resta_div'),
    palabra(`${wordA} más ${wordB}`, 'operacion_equivocada_suma_div'),
  ]);
}

const COMO_SE_LEE = [
  comoSeLeeRaiz, comoSeLeeAlCuadrado, comoSeLeeAlCubo, comoSeLeePotenciaCinco, comoSeLeeFraccion,
  comoSeLeeDecimal, comoSeLeeResta, comoSeLeeMultiplicacion, comoSeLeeDivision,
];

function generarComoSeLee(rng) {
  return rng.elegir(COMO_SE_LEE)(rng);
}

// ---------------------------------------------------------------------------
// ¿Correcto o incorrecto? (verdadero/falso sobre una forma escrita)

function generarSeEscribe(rng) {
  const n = elegirNumero(rng);
  const { correcta, candidatos } = candidatosNumeroEnPalabras(n);
  const esCorrecta = rng.moneda(0.5);

  let palabras, error;
  if (esCorrecta) {
    palabras = correcta;
    error = E('era_correcta');
  } else {
    if (candidatos.length === 0) return null;
    const elegido = rng.elegir(candidatos);
    palabras = elegido.texto;
    error = elegido.error;
  }

  return {
    texto: { clave: 'se_escribe', params: { n, palabras } },
    enunciado: '',
    opciones: opcionesCorrectoIncorrecto(esCorrecta, error),
  };
}

// ---------------------------------------------------------------------------

const FORMAS = [generarNumeroEnPalabras, generarNumeroEnPalabras, generarQueNumero, generarComoSeLee, generarComoSeLee];

function elegirForma(rng) {
  return rng.moneda(0.25) ? generarSeEscribe(rng) : rng.elegir(FORMAS)(rng);
}

export default {
  id: 'lenguaje_espanol',
  nombre: { es: 'Matemáticas en español', en: 'Maths in Spanish' },
  curso: 1,
  concepto: 'lenguaje_espanol',
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
