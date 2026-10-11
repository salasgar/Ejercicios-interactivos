// Múltiplos, divisores, criterios de divisibilidad y números primos.
// Aquí las opciones son números y el enunciado es una pregunta. La «solución»
// es la comprobación de la respuesta correcta y los «pasos» de cada
// distractor son la comprobación que desmonta esa opción.

import { construirOpciones, conReintentos, erroresDe, tex, mcd } from './index.js';

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
  criterio_3_ultima_cifra: { concepto: 'divisibilidad',
    es: 'Para el 3 no vale mirar la última cifra: hay que sumar todas las cifras y ver si la suma es múltiplo de 3.', en: 'For 3 the last digit is not enough: add all the digits and check whether the sum is a multiple of 3.' },
  criterio_ultima_cifra: { concepto: 'divisibilidad',
    es: 'Mira la última cifra: es divisible por 2 si acaba en cifra par, por 5 si acaba en 0 o en 5, y por 10 solo si acaba en 0.', en: 'Look at the last digit: it is divisible by 2 if it ends in an even digit, by 5 if it ends in 0 or 5, and by 10 only if it ends in 0.' },
  acaba_en_5_no_10: { concepto: 'divisibilidad',
    es: 'Acabar en 5 vale para el 5, pero no para el 10: para ser divisible por 10 hay que acabar en 0.', en: 'Ending in 5 works for 5, but not for 10: to be divisible by 10 a number has to end in 0.' },
  solo_una_condicion: { concepto: 'divisibilidad',
    es: 'Ser múltiplo de uno solo de los factores no basta: divide entre el número y mira si el resto es 0.', en: 'Being a multiple of only one of the factors is not enough: divide by the number and check whether the remainder is 0.' },
  no_se_combinan: { concepto: 'divisibilidad',
    es: 'Divisible entre 4 y entre 6 no quiere decir divisible entre 24: el 12 lo es entre 4 y entre 6, y entre 24 no. Divide entre 24 y mira el resto.', en: 'Divisible by 4 and by 6 does not mean divisible by 24: 12 is divisible by 4 and by 6, but not by 24. Divide by 24 and check the remainder.' },
  compuesto_parece_primo: { concepto: 'divisibilidad',
    es: 'Parece primo y no lo es. El 51, el 57 y el 87 son múltiplos de 3 (criterio del 3); el 91 y el 119 son múltiplos de 7, y el 143 de 11.', en: 'It looks prime but it is not. 51, 57 and 87 are multiples of 3 (digit-sum rule); 91 and 119 are multiples of 7, and 143 of 11.' },
  factorizacion_sin_terminar: { concepto: 'divisibilidad',
    es: 'Esa factorización no está terminada: un factor compuesto se puede descomponer más. En la factorización en primos todos los factores son primos.', en: 'That factorisation is not finished: a composite factor can be broken down further. In a prime factorisation every factor is prime.' },
  potencia_como_producto: { concepto: 'divisibilidad',
    es: 'El exponente dice cuántas veces se repite la base: 2³ = 2 · 2 · 2, no 2 · 3.', en: 'The exponent says how many times the base is repeated: 2³ = 2 · 2 · 2, not 2 · 3.' },
  factorizacion_no_multiplica: { concepto: 'divisibilidad',
    es: 'Comprueba multiplicando: el producto de los factores tiene que dar el número de partida.', en: 'Check by multiplying: the product of the factors must give the starting number.' },
  mcd_en_vez_de_mcm: { concepto: 'divisibilidad',
    es: 'Has hallado el m.c.d. (GCD). Cuando algo vuelve a coincidir se busca el menor múltiplo común: es un m.c.m. (LCM).', en: 'You found the GCD. When two things coincide again you look for the smallest common multiple: it is an LCM.' },
  mcm_en_vez_de_mcd: { concepto: 'divisibilidad',
    es: 'Has hallado el m.c.m. (LCM). Cuando se reparte en grupos iguales sin que sobre nada se busca el mayor divisor común: es un m.c.d. (GCD).', en: 'You found the LCM. When you share things into equal groups with none left over you look for the greatest common divisor: it is a GCD.' },
  producto_en_vez_de_mcm: { concepto: 'divisibilidad',
    es: 'El producto de los dos números es un múltiplo común, pero no el menor: busca el menor múltiplo común.', en: 'The product of the two numbers is a common multiple, but not the smallest one: look for the smallest common multiple.' },
  producto_en_vez_de_mcd: { concepto: 'divisibilidad',
    es: 'El producto es mayor que los datos: no se pueden hacer tantos grupos. Busca el mayor divisor común.', en: 'The product is bigger than the data: you cannot make that many groups. Look for the greatest common divisor.' },
  no_es_comun: { concepto: 'divisibilidad',
    es: 'Ese número tiene que ser múltiplo de los dos datos: divide y comprueba que el resto es 0 en los dos.', en: 'That number has to be a multiple of both data: divide and check that the remainder is 0 for both.' },
  divisor_no_mayor: { concepto: 'divisibilidad',
    es: 'Ese reparto se puede hacer, pero se pide el mayor número posible: busca el mayor divisor común.', en: 'That sharing is possible, but you are asked for the greatest possible number: look for the greatest common divisor.' },
  uno_y_cero_al_reves: { concepto: 'divisibilidad',
    es: 'No los des la vuelta: el 1 es divisor de todos los números y el 0 es múltiplo de todos (0 = n · 0).', en: 'Do not swap them: 1 is a divisor of every number and 0 is a multiple of every number (0 = n · 0).' },
};
const E = erroresDe(errores);

export const preguntas = {
  multiplo_de: { es: '¿Cuál de estos números es múltiplo de {n}?', en: 'Which of these numbers is a multiple of {n}?' },
  divisor_de: { es: '¿Cuál de estos números es divisor de {n}?', en: 'Which of these numbers is a divisor of {n}?' },
  primo: { es: '¿Cuál de estos números es primo?', en: 'Which of these numbers is prime?' },
  divisible_por: { es: '¿Cuál de estos números es divisible por {n}?', en: 'Which of these numbers is divisible by {n}?' },
  factorizacion: { es: '¿Cuál es la factorización en primos de {n}?', en: 'Which is the prime factorisation of {n}?' },
  coincidencia: {
    es: 'Un autobús sale cada {a} minutos y otro cada {b} minutos, y acaban de salir a la vez. ¿Cuál es el menor número de minutos que tiene que pasar para que vuelvan a salir a la vez?',
    en: 'One bus leaves every {a} minutes and another every {b} minutes, and they have just left at the same time. What is the least number of minutes before they leave at the same time again?',
  },
  reparto: {
    es: 'Hay {a} lápices y {b} gomas. Se quieren hacer grupos iguales, sin que sobre nada y con el mayor número posible de grupos. ¿Cuántos grupos se hacen?',
    en: 'There are {a} pencils and {b} erasers. We want to make equal groups, with nothing left over and with the greatest possible number of groups. How many groups are made?',
  },
  divisor_de_todos: { es: '¿Cuál de estos números es divisor de todos los números?', en: 'Which of these numbers is a divisor of every number?' },
  multiplo_de_todos: { es: '¿Cuál de estos números es múltiplo de todos los números?', en: 'Which of these numbers is a multiple of every number?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  es_multiplo: { es: 'Es múltiplo porque se obtiene multiplicando por un número natural.', en: 'It is a multiple because you get it by multiplying by a whole number.' },
  es_divisor: { es: 'Es divisor porque la división es exacta: resto 0.', en: 'It is a divisor because the division is exact: remainder 0.' },
  es_primo: { es: 'Solo se puede escribir como 1 por él mismo: tiene exactamente dos divisores.', en: 'It can only be written as 1 times itself: it has exactly two divisors.' },
  suma_cifras: { es: 'Sumamos las cifras.', en: 'We add the digits.' },
  multiplo_de_nueve: { es: 'La suma de las cifras es múltiplo de 9, así que el número también lo es.', en: 'The digit sum is a multiple of 9, so the number is too.' },
  comprobar: { es: 'Y lo comprobamos dividiendo: sale exacto.', en: 'And we check by dividing: it is exact.' },
  criterio_ultima_cifra: { es: 'Basta mirar la última cifra; y lo comprobamos dividiendo: sale exacto.', en: 'The last digit is enough; and we check by dividing: it is exact.' },
  multiplo_de_tres: { es: 'La suma de las cifras es múltiplo de 3, así que el número también lo es.', en: 'The digit sum is a multiple of 3, so the number is too.' },
  multiplo_del_compuesto: { es: 'Es múltiplo de todos los factores a la vez y, además, la división es exacta.', en: 'It is a multiple of all the factors at once and, besides, the division is exact.' },
  es_factorizacion: { es: 'Todos los factores son primos: no se puede descomponer más.', en: 'Every factor is prime: it cannot be broken down any further.' },
  comprobar_multiplicando: { es: 'Lo comprobamos multiplicando: sale el número de partida.', en: 'We check by multiplying: we get the starting number.' },
  es_multiplo_comun: { es: 'Es múltiplo de los dos números y es el menor que lo es.', en: 'It is a multiple of both numbers and it is the smallest one that is.' },
  es_divisor_comun: { es: 'Divide a los dos números y es el mayor que lo hace.', en: 'It divides both numbers and it is the greatest that does.' },
  uno_divisor_de_todos: { es: 'Todo número es 1 por él mismo: el 1 divide a todos.', en: 'Every number is 1 times itself: 1 divides all of them.' },
  cero_multiplo_de_todos: { es: 'Todo número multiplicado por 0 da 0: el 0 es múltiplo de todos.', en: 'Every number times 0 gives 0: 0 is a multiple of every number.' },
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

// Paso erróneo «v = n · q + r»: neutro en idioma, a diferencia de «resto r».
const resto = (v, n) => mal(`${v} = ${n} \\cdot ${Math.floor(v / n)} + ${v % n}`);
const pasoCifras = v => paso(`${digitos(v).join(' + ')} = ${sumaCifras(v)}`);

function divisiblePorTres(rng) {
  const k = rng.entero(5, 120);
  const correcta = 3 * k;
  const suma = sumaCifras(correcta);
  // Acaban en 3, 6 o 9 (como los múltiplos de 3 más conocidos) y no lo son.
  const parecido = () => {
    let v = 10 * rng.entero(2, 60) + rng.elegir([3, 6, 9]);
    while (v % 3 === 0) v += 10;
    return v;
  };
  const noEsMultiplo = correcta + 1;
  return {
    texto: { clave: 'divisible_por', params: { n: 3 } },
    correcta: num(correcta),
    solucion: [
      paso(`${digitos(correcta).join(' + ')} = ${suma}`, 'suma_cifras'),
      paso(`${suma} = 3 \\cdot ${suma / 3}`, 'multiplo_de_tres'),
      paso(`${correcta} \\div 3 = ${k}`, 'comprobar'),
    ],
    distractores: [parecido(), parecido()].map(v =>
      num(v, E('criterio_3_ultima_cifra'), [pasoCifras(v), resto(v, 3)])
    ).concat([num(noEsMultiplo, E('no_multiplo'), [resto(noEsMultiplo, 3)])]),
  };
}

const CIFRAS_BUENAS = { 2: [0, 2, 4, 6, 8], 5: [0, 5], 10: [0] };

function divisibleUltimaCifra(rng) {
  const n = rng.elegir([2, 5, 10]);
  const buenas = CIFRAS_BUENAS[n];
  const malas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !buenas.includes(d));
  const conCifra = d => 10 * rng.entero(2, 99) + d;
  const correcta = conCifra(rng.elegir(buenas));
  // Para el 10 el error informativo es acabar en 5: sale siempre.
  const cifras = n === 10 ? [5, ...rng.barajar(malas.filter(d => d !== 5)).slice(0, 2)] : rng.barajar(malas).slice(0, 3);
  return {
    texto: { clave: 'divisible_por', params: { n } },
    correcta: num(correcta),
    solucion: [paso(`${correcta} = ${n} \\cdot ${correcta / n}`, 'criterio_ultima_cifra')],
    distractores: cifras.map(d => {
      const v = conCifra(d);
      return num(v, E(n === 10 && d === 5 ? 'acaba_en_5_no_10' : 'criterio_ultima_cifra'), [resto(v, n)]);
    }),
  };
}

function divisibleCompuesto(rng) {
  const n = rng.elegir([6, 15, 30, 24]);
  const correcta = n * rng.entero(3, n === 24 ? 20 : 15);
  const k = correcta / n;
  const noEsMultiplo = num(correcta + 1, E('no_multiplo'), [resto(correcta + 1, n)]);
  const con = (d, error) => {
    let v = d * rng.entero(2, 40);
    while (v % n === 0) v += d;
    return num(v, E(error), [resto(v, n)]);
  };
  let distractores;
  if (n === 24) {
    // 12 por impar es divisible entre 4 y entre 6 y no entre 24; 4 por algo que no
    // sea múltiplo de 3 solo cumple lo del 4; 6 por impar solo lo del 6.
    const divisibleEntre4y6 = 12 * (2 * rng.entero(1, 12) + 1);
    let soloCuatro = 4 * rng.entero(2, 40);
    while (soloCuatro % 3 === 0) soloCuatro += 4;
    const soloSeis = 6 * (2 * rng.entero(1, 20) + 1);
    distractores = [
      num(divisibleEntre4y6, E('no_se_combinan'), [resto(divisibleEntre4y6, 24)]),
      ...rng.barajar([
        num(soloCuatro, E('solo_una_condicion'), [resto(soloCuatro, 24)]),
        num(soloSeis, E('solo_una_condicion'), [resto(soloSeis, 24)]),
        noEsMultiplo,
      ]),
    ];
  } else {
    const factores = [2, 3, 5].filter(d => n % d === 0);
    distractores = [
      ...rng.barajar(factores).slice(0, 2).map(d => con(d, 'solo_una_condicion')),
      noEsMultiplo,
    ];
  }
  return {
    texto: { clave: 'divisible_por', params: { n } },
    correcta: num(correcta),
    solucion: [paso(`${correcta} \\div ${n} = ${k}`, 'multiplo_del_compuesto')],
    distractores,
  };
}

// Compuestos que parecen primos: 51, 57 y 87 (criterio del 3), 91 y 119 (el 7), 143 (el 11).
const TRAMPAS = [51, 57, 87, 91, 119, 143];

function primoTramposo(rng) {
  const correcta = rng.elegir(PRIMOS.filter(p => p > 50));
  return {
    texto: { clave: 'primo' },
    correcta: num(correcta),
    solucion: [paso(`${correcta} = 1 \\cdot ${correcta}`, 'es_primo')],
    distractores: rng.barajar(TRAMPAS).slice(0, 3).map(v => {
      const f = menorFactor(v);
      return num(v, E('compuesto_parece_primo'), [mal(`${v} = ${f} \\cdot ${v / f}`)]);
    }),
  };
}

/** Factorización en TeX con potencias: lista de primos con repetición, de menor a mayor. */
function texFactorizacion(lista) {
  const grupos = [];
  for (const p of lista) {
    const g = grupos.find(x => x.p === p);
    if (g) g.e++; else grupos.push({ p, e: 1 });
  }
  return grupos.map(({ p, e }) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(' \\cdot ');
}

const producto = lista => lista.reduce((a, b) => a * b, 1);

function factorizacion(rng) {
  // Uno o dos exponentes mayores que 1, y un número que se pueda factorizar a mano.
  let lista;
  for (let i = 0; i < 30; i++) {
    const primos = rng.barajar([2, 3, 5, 7]).slice(0, rng.entero(2, 3)).sort((a, b) => a - b);
    const candidata = [];
    primos.forEach((p, j) => {
      const e = j === 0 ? rng.entero(2, 3) : rng.entero(1, 2);
      for (let c = 0; c < e; c++) candidata.push(p);
    });
    if (producto(candidata) <= 600) { lista = candidata; break; }
  }
  lista = lista ?? [2, 2, 3, 5];
  const n = producto(lista);
  const correcta = texFactorizacion(lista);
  const pool = [];
  // Sin terminar: se funden dos factores primos en uno compuesto.
  const parejas = [];
  for (let i = 0; i < lista.length; i++) for (let j = i + 1; j < lista.length; j++) parejas.push([i, j]);
  for (const [i, j] of rng.barajar(parejas).slice(0, 2)) {
    const c = lista[i] * lista[j];
    const resto_ = lista.filter((_, x) => x !== i && x !== j);
    const tex_ = [...resto_, c].sort((a, b) => a - b).join(' \\cdot ');
    pool.push(num(tex_, E('factorizacion_sin_terminar'), [
      paso(`${tex_} = ${n}`),
      mal(`${c} = ${lista[i]} \\cdot ${lista[j]}`),
    ]));
  }
  // La potencia como producto: p^e escrito como p · e.
  const grupos = [...new Set(lista)].map(p => ({ p, e: lista.filter(x => x === p).length }));
  const potencia = grupos
    .map(({ p, e }) => (e === 1 ? `${p}` : `${p} \\cdot ${e}`))
    .join(' \\cdot ');
  const valorPotencia = grupos.reduce((a, { p, e }) => a * (e === 1 ? p : p * e), 1);
  if (grupos.some(g => g.e > 1) && valorPotencia !== n) {
    pool.push(num(potencia, E('potencia_como_producto'), [mal(`${potencia} = ${valorPotencia}`)]));
  }
  // Un primo cambiado: el producto ya no da n.
  const i = rng.entero(0, lista.length - 1);
  const otro = rng.elegir([2, 3, 5, 7, 11].filter(p => p !== lista[i]));
  const cambiada = lista.map((p, x) => (x === i ? otro : p)).sort((a, b) => a - b);
  const texCambiada = texFactorizacion(cambiada);
  if (producto(cambiada) !== n) {
    pool.push(num(texCambiada, E('factorizacion_no_multiplica'), [mal(`${texCambiada} = ${producto(cambiada)}`)]));
  }
  return {
    texto: { clave: 'factorizacion', params: { n } },
    correcta: num(correcta),
    solucion: [
      paso(`${n} = ${correcta}`, 'es_factorizacion'),
      paso(`${correcta} = ${n}`, 'comprobar_multiplicando'),
    ],
    distractores: rng.barajar(pool).slice(0, 3),
  };
}

/** Dos datos hasta 50 con m.c.d. g entre 2 y 6 y ninguno múltiplo del otro. */
function parDeDatos(rng) {
  for (let i = 0; i < 100; i++) {
    const g = rng.entero(2, 6);
    const x = rng.entero(2, 9);
    const y = rng.entero(2, 9);
    if (x === y || mcd(x, y) !== 1) continue;
    const a = g * x, b = g * y;
    if (a <= 50 && b <= 50) return { a, b, g, m: g * x * y };
  }
  return { a: 12, b: 18, g: 6, m: 36 };
}

const pasoDivisorComun = (a, b, d) => `${a} = ${d} \\cdot ${a / d} \\quad ${b} = ${d} \\cdot ${b / d}`;
const pasoMultiploComun = (a, b, m) => `${m} = ${a} \\cdot ${m / a} = ${b} \\cdot ${m / b}`;

function problemaCoincidencia(rng) {
  const { a, b, g, m } = parDeDatos(rng);
  const menor = Math.min(a, b), mayor = Math.max(a, b);
  return {
    texto: { clave: 'coincidencia', params: { a, b } },
    correcta: num(m),
    solucion: [paso(pasoMultiploComun(a, b, m), 'es_multiplo_comun')],
    distractores: [
      num(g, E('mcd_en_vez_de_mcm'), [mal(pasoDivisorComun(a, b, g))]),
      num(a * b, E('producto_en_vez_de_mcm'), [mal(`${a} \\cdot ${b} = ${a * b}`)]),
      num(mayor, E('no_es_comun'), [resto(mayor, menor)]),
    ],
  };
}

function problemaReparto(rng) {
  const { a, b, g, m } = parDeDatos(rng);
  const menor = divisoresPropios(g)[0] ?? 1;
  return {
    texto: { clave: 'reparto', params: { a, b } },
    correcta: num(g),
    solucion: [paso(pasoDivisorComun(a, b, g), 'es_divisor_comun')],
    distractores: [
      num(m, E('mcm_en_vez_de_mcd'), [mal(pasoMultiploComun(a, b, m))]),
      num(a * b, E('producto_en_vez_de_mcd'), [mal(`${a} \\cdot ${b} = ${a * b}`)]),
      num(menor, E('divisor_no_mayor'), [mal(pasoDivisorComun(a, b, menor))]),
    ],
  };
}

function unoYCero(rng) {
  const n = rng.entero(5, 20);
  if (rng.moneda()) {
    // Divisor de todos: el 1 (no el 0). Los otros fallan con un número concreto.
    const otros = rng.barajar([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 2).map(d => {
      const v = d * rng.entero(2, 6) + 1;
      return num(d, E('no_divide'), [mal(`${v} = ${d} \\cdot ${(v - 1) / d} + 1`)]);
    });
    return {
      texto: { clave: 'divisor_de_todos' },
      correcta: num(1),
      solucion: [paso(`${n} = 1 \\cdot ${n}`, 'uno_divisor_de_todos')],
      distractores: [num(0, E('uno_y_cero_al_reves'), [mal(`0 \\cdot ${n} = 0`)]), ...otros],
    };
  }
  // Múltiplo de todos: el 0 (no el 1). Los otros no son múltiplos de algún número.
  const otros = rng.barajar([6, 10, 12, 15, 20, 24, 30, 36]).slice(0, 2).map(v => {
    const d = [4, 5, 7, 9, 11].find(x => v % x !== 0);
    return num(v, E('no_multiplo'), [resto(v, d)]);
  });
  return {
    texto: { clave: 'multiplo_de_todos' },
    correcta: num(0),
    solucion: [paso(`0 = ${n} \\cdot 0`, 'cero_multiplo_de_todos')],
    distractores: [num(1, E('uno_y_cero_al_reves'), [mal(`1 = ${n} \\cdot 0 + 1`)]), ...otros],
  };
}

// Cada subtipo declara las destrezas del inventario de la unidad 2
// (`2. Divisibility/inventario-unidad2.tsv`) que practica. Es un dato
// declarativo: el filtrado por semana lo hará el motor.
export const SUBTIPOS = [
  { id: 'multiplo', items: ['U2-1C-02', 'U2-1C-03'], generar: multiplo },
  { id: 'divisor', items: ['U2-1C-01', 'U2-1C-02'], generar: divisor },
  { id: 'primo', items: ['U2-2C-01', 'U2-2C-02', 'U2-2C-03', 'U2-2C-05'], generar: primo },
  { id: 'divisible_9', items: ['U2-1C-07'], generar: divisiblePorNueve },
  { id: 'divisible_3', items: ['U2-1C-06'], generar: divisiblePorTres },
  { id: 'divisible_ultima_cifra', items: ['U2-1C-05'], generar: divisibleUltimaCifra },
  { id: 'divisible_compuesto', items: ['U2-1C-09'], generar: divisibleCompuesto },
  { id: 'primo_tramposo', items: ['U2-2C-05', 'U2-2C-07'], generar: primoTramposo },
  { id: 'factorizacion', items: ['U2-2C-09', 'U2-2C-11', 'U2-2C-12'], generar: factorizacion },
  { id: 'problema_coincidencia', items: ['U2-1A-02', 'U2-1C-16'], generar: problemaCoincidencia },
  { id: 'problema_reparto', items: ['U2-1A-03', 'U2-1C-16'], generar: problemaReparto },
  { id: 'uno_y_cero', items: ['U2-1C-04'], generar: unoYCero },
];

// El múltiplo y el divisor, que son lo básico, salen el doble.
const FORMAS = [
  ...SUBTIPOS.map(s => s.generar),
  multiplo, divisor,
];

export default {
  id: 'divisibilidad',
  pasosLibres: true,
  nombre: { es: 'Múltiplos, divisores y primos', en: 'Multiples, divisors and primes' },
  curso: 1,
  concepto: 'divisibilidad',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado: '', solucion, opciones };
  }),
};
