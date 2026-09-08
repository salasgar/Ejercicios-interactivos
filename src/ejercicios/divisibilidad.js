// Múltiplos, divisores, criterios de divisibilidad y números primos.
// Aquí las opciones son números y el enunciado es una pregunta. La «solución»
// es la comprobación de la respuesta correcta y los «pasos» de cada
// distractor son la comprobación que desmonta esa opción.

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  confundir_multiplo_divisor: { concepto: 'divisibilidad',
    es: 'Un múltiplo de un número se obtiene multiplicándolo; un divisor es el que lo divide exactamente. No los confundas.', en: 'A multiple of a number is obtained by multiplying it; a divisor is a number that divides it exactly. Do not mix them up.' },
  un_solo_factor: { concepto: 'divisibilidad',
    es: 'Para ser múltiplo de un número compuesto hay que serlo de todos sus factores a la vez (de 6: de 2 y de 3).', en: 'To be a multiple of a composite number, it has to be a multiple of all its factors at once (for 6: of 2 and of 3).' },
  criterio_3_vs_9: { concepto: 'divisibilidad',
    es: 'Que la suma de las cifras sea múltiplo de 3 no basta: para ser múltiplo de 9, la suma de las cifras debe ser múltiplo de 9.', en: 'Having a digit sum that is a multiple of 3 is not enough: to be a multiple of 9, the digit sum must be a multiple of 9.' },
  acaba_en_9: { concepto: 'divisibilidad',
    es: 'Acabar en 9 no tiene que ver: un número es divisible por 9 si la suma de sus cifras es múltiplo de 9.', en: 'Ending in 9 has nothing to do with it: a number is divisible by 9 if the sum of its digits is a multiple of 9.' },
  impar_no_es_primo: { concepto: 'divisibilidad',
    es: 'Ser impar no significa ser primo: un primo solo tiene dos divisores, 1 y él mismo.', en: 'Being odd does not mean being prime: a prime number has only two divisors, 1 and itself.' },
  par_no_es_primo: { concepto: 'divisibilidad',
    es: 'Todos los pares mayores que 2 son divisibles por 2, así que no son primos.', en: 'Every even number greater than 2 is divisible by 2, so it is not prime.' },
  uno_no_es_primo: { concepto: 'divisibilidad',
    es: 'El 1 no se considera primo: un primo tiene exactamente dos divisores distintos.', en: '1 is not considered prime: a prime number has exactly two different divisors.' },
  no_divide: { concepto: 'divisibilidad',
    es: 'Comprueba la división: un divisor tiene que dar resto 0.', en: 'Check the division: a divisor must leave a remainder of 0.' },
  no_multiplo: { concepto: 'divisibilidad',
    es: 'Divide entre el número: si el resto no es 0, no es múltiplo suyo.', en: 'Divide by the number: if the remainder is not 0, it is not a multiple of it.' },
};
const E = erroresDe(errores);

export const preguntas = {
  multiplo_de: { es: '¿Cuál de estos números es múltiplo de {n}?', en: 'Which of these numbers is a multiple of {n}?' },
  divisor_de: { es: '¿Cuál de estos números es divisor de {n}?', en: 'Which of these numbers is a divisor of {n}?' },
  primo: { es: '¿Cuál de estos números es primo?', en: 'Which of these numbers is prime?' },
  divisible_por: { es: '¿Cuál de estos números es divisible por {n}?', en: 'Which of these numbers is divisible by {n}?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  es_multiplo: { es: 'Es múltiplo porque se obtiene multiplicando por un número natural.', en: 'It is a multiple because you get it by multiplying by a whole number.' },
  es_divisor: { es: 'Es divisor porque la división es exacta: resto 0.', en: 'It is a divisor because the division is exact: remainder 0.' },
  es_primo: { es: 'Solo se puede escribir como 1 por él mismo: tiene exactamente dos divisores.', en: 'It can only be written as 1 times itself: it has exactly two divisors.' },
  suma_cifras: { es: 'Sumamos las cifras.', en: 'We add the digits.' },
  multiplo_de_nueve: { es: 'La suma de las cifras es múltiplo de 9, así que el número también lo es.', en: 'The digit sum is a multiple of 9, so the number is too.' },
  comprobar: { es: 'Y lo comprobamos dividiendo: sale exacto.', en: 'And we check by dividing: it is exact.' },
};

const num = (v, error, pasos) => ({ tex: tex(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const IMPARES_COMPUESTOS = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99];

function divisoresPropios(n) {
  const lista = [];
  for (let d = 2; d < n; d++) if (n % d === 0) lista.push(d);
  return lista;
}

/** Menor factor primo (o el propio n si es primo). */
function menorFactor(n) {
  for (let f = 2; f * f <= n; f++) if (n % f === 0) return f;
  return n;
}

function digitos(n) {
  return String(n).split('').map(Number);
}

function sumaCifras(n) {
  return digitos(n).reduce((a, b) => a + b, 0);
}

function multiplo(rng) {
  const n = rng.elegir([4, 6, 6, 8, 9, 12, 15]);
  const correcta = n * rng.entero(3, 12);
  const k = correcta / n;
  const divisores = divisoresPropios(n);
  const factor = rng.elegir(divisores);
  // Múltiplo de un factor de n pero no de n.
  let soloUnFactor = factor * rng.entero(3, 15);
  while (soloUnFactor % n === 0) soloUnFactor += factor;
  const divisorConfundido = rng.elegir(divisores);
  const qDivisorConfundido = n / divisorConfundido;
  const noEsMultiplo = correcta + rng.elegir([1, -1, 2]);
  const diff = noEsMultiplo - correcta;
  return {
    texto: { clave: 'multiplo_de', params: { n } },
    correcta: num(correcta),
    solucion: [
      paso(`${correcta} = ${n} \\cdot ${k}`, 'es_multiplo', `${correcta} \\div ${n} = ${k}`),
    ],
    distractores: [
      num(divisorConfundido, E('confundir_multiplo_divisor'), [
        mal(`${n} = ${divisorConfundido} \\cdot ${qDivisorConfundido}`),
      ]),
      num(soloUnFactor, E('un_solo_factor'), [
        mal(`${soloUnFactor} \\div ${n} = ${Math.floor(soloUnFactor / n)} \\text{ resto } ${soloUnFactor % n}`, `${soloUnFactor} = ${factor} \\cdot ${soloUnFactor / factor}`),
      ]),
      num(noEsMultiplo, E('no_multiplo'), [
        mal(`${noEsMultiplo} \\div ${n} = ${Math.floor(noEsMultiplo / n)} \\text{ resto } ${((noEsMultiplo % n) + n) % n}`),
      ]),
    ],
    genericos: [num(correcta + n + 1), num(correcta - n - 1)],
  };
}

function divisor(rng) {
  const n = rng.elegir([24, 30, 36, 40, 42, 48, 54, 60, 72]);
  const divisores = divisoresPropios(n);
  const correcta = rng.elegir(divisores);
  const q = n / correcta;
  const noDivisor = () => {
    let x = rng.entero(2, n - 1);
    while (n % x === 0) x = rng.entero(2, n - 1);
    return x;
  };
  // Pasos que desmontan «x es divisor de n»: como (n − r) sí es múltiplo de x,
  // dividir n − r entre el cociente entero devuelve x, dejando ver el resto.
  const pasosNoDivide = x => {
    const qx = Math.floor(n / x), r = n % x;
    return [mal(`${n} \\div ${x} = ${qx} \\text{ resto } ${r}`, `${n} = ${qx} \\cdot ${x} + ${r}`)];
  };
  // Vecinos de la correcta solo si de verdad no dividen a n (y nunca el 1, que divide a todo).
  const vecinos = [correcta + 1, correcta - 1].filter(v => v > 1 && n % v !== 0);
  const multiploConfundido = n * rng.entero(2, 3);
  const factorConfundido = multiploConfundido / n;
  const noDiv1 = noDivisor();
  const noDiv2 = noDivisor();
  const noDiv3 = noDivisor();
  return {
    texto: { clave: 'divisor_de', params: { n } },
    correcta: num(correcta),
    solucion: [
      paso(`${n} \\div ${correcta} = ${q}`, 'es_divisor', `${n} = ${correcta} \\cdot ${q}`),
    ],
    distractores: [
      num(multiploConfundido, E('confundir_multiplo_divisor'), [
        mal(`${multiploConfundido} = ${n} \\cdot ${factorConfundido}`),
      ]),
      num(noDiv1, E('no_divide'), pasosNoDivide(noDiv1)),
      ...vecinos.map(v => num(v, E('no_divide'), pasosNoDivide(v))),
      num(noDiv2, E('no_divide'), pasosNoDivide(noDiv2)),
      num(noDiv3, E('no_divide'), pasosNoDivide(noDiv3)),
    ],
  };
}

function primo(rng) {
  const correcta = rng.elegir(PRIMOS.filter(p => p > 3));
  const par = 2 * rng.entero(3, 45);
  const imparNoPrimo1 = rng.elegir(IMPARES_COMPUESTOS);
  const distractor3Valor = rng.moneda(0.3) ? 1 : rng.elegir(IMPARES_COMPUESTOS);
  const imparNoPrimo2 = rng.elegir(IMPARES_COMPUESTOS);
  const pasosImparNoPrimo = v => {
    const f = menorFactor(v);
    return [mal(`${v} = ${f} \\cdot ${v / f}`)];
  };
  return {
    texto: { clave: 'primo' },
    correcta: num(correcta),
    solucion: [
      paso(`${correcta} = 1 \\cdot ${correcta}`, 'es_primo'),
    ],
    distractores: [
      num(imparNoPrimo1, E('impar_no_es_primo'), pasosImparNoPrimo(imparNoPrimo1)),
      num(par, E('par_no_es_primo'), [mal(`${par} = 2 \\cdot ${par / 2}`)]),
      distractor3Valor === 1
        ? num(1, E('uno_no_es_primo'), [mal('1 \\cdot 1 = 1')])
        : num(distractor3Valor, E('impar_no_es_primo'), pasosImparNoPrimo(distractor3Valor)),
      num(imparNoPrimo2, E('impar_no_es_primo'), pasosImparNoPrimo(imparNoPrimo2)),
    ],
  };
}

function divisiblePorNueve(rng) {
  const correcta = 9 * rng.entero(3, 30);
  const k = correcta / 9;
  let soloTres = 3 * rng.entero(4, 60);
  while (soloTres % 9 === 0) soloTres += 3;
  const m = soloTres / 3;
  let acabaEnNueve = 10 * rng.entero(1, 20) + 9;
  while (acabaEnNueve % 9 === 0) acabaEnNueve += 10;
  const cifras = digitos(correcta);
  const suma = sumaCifras(correcta);
  const noEsMultiplo = correcta + 1;
  return {
    texto: { clave: 'divisible_por', params: { n: 9 } },
    correcta: num(correcta),
    solucion: [
      paso(`${cifras.join(' + ')} = ${suma}`, 'suma_cifras'),
      paso(`${suma} = 9 \\cdot ${suma / 9}`, 'multiplo_de_nueve'),
      paso(`${correcta} \\div 9 = ${k}`, 'comprobar'),
    ],
    distractores: [
      num(soloTres, E('criterio_3_vs_9'), [
        paso(`${digitos(soloTres).join(' + ')} = ${sumaCifras(soloTres)}`),
        mal(`${soloTres} \\div 9 = ${Math.floor(soloTres / 9)} \\text{ resto } ${soloTres % 9}`, `${sumaCifras(soloTres)} = 3 \\cdot ${sumaCifras(soloTres) / 3}`),
      ]),
      num(acabaEnNueve, E('acaba_en_9'), [
        paso(`${digitos(acabaEnNueve).join(' + ')} = ${sumaCifras(acabaEnNueve)}`),
        mal(`${acabaEnNueve} \\div 9 = ${Math.floor(acabaEnNueve / 9)} \\text{ resto } ${acabaEnNueve % 9}`),
      ]),
      num(noEsMultiplo, E('no_multiplo'), [
        mal(`${noEsMultiplo} \\div 9 = ${k} \\text{ resto } 1`),
      ]),
    ],
  };
}

const FORMAS = [multiplo, multiplo, divisor, divisor, primo, divisiblePorNueve];

export default {
  id: 'divisibilidad',
  pasosLibres: true,
  nombre: { es: 'Múltiplos, divisores y primos', en: 'Multiples, divisors and primes' },
  curso: 1,
  concepto: 'divisibilidad',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado: '', solucion, opciones };
  }),
};
