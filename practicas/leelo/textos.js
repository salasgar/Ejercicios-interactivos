// Práctica «Léelo en inglés»: textos propios. Las instrucciones y el feedback
// son bilingües ({ es, en }); lo que se oye o se lee (la frase, las opciones)
// es siempre inglés, porque esa es la destreza que se practica.

import { leer, notacion, leerExponente, numeroAIngles, ESTILOS } from './logica.js';

export const TX = {
  escuchar: {
    nombre: { es: 'Escúchalo', en: 'Listen to it' },
    detalle: { es: 'Oye la frase y elige la notación que dice', en: 'Listen to the sentence and choose the matching notation' },
    escucha: { es: '▶ Escuchar', en: '▶ Listen' },
    sin_voz: { es: 'Tu dispositivo no tiene voz: lee la frase.', en: 'Your device has no voice: read the sentence.' },
    correcta: { es: 'Era:', en: 'It was:' },
  },
  leer: {
    nombre: { es: '¿Cómo se lee?', en: 'How do you read it?' },
    detalle: { es: 'Elige la lectura correcta en inglés', en: 'Choose the correct reading in English' },
    escucha: { es: '▶ Oír la correcta', en: '▶ Hear the correct one' },
  },
  completar: {
    nombre: { es: 'Completa la frase', en: 'Complete the sentence' },
    detalle: { es: 'Elige la palabra que falta', en: 'Choose the missing word' },
    correcta_fue: { es: 'La frase correcta es:', en: 'The correct sentence is:' },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio (tarea 186) ─────────────────
// Lo que se oye o se lee es siempre inglés; la explicación va en el idioma del alumno.

const cuenta = c => `<span class="cuenta">${c}</span>`;
const supers = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);

/**
 * Las piezas de la expresión: [inglés, símbolo en HTML], en el orden en que se leen (tarea 193: el «·» va
 * entre los factores, donde se dice, y no al final; y la coma de GCD(a, b) es el «and» de la lectura).
 */
export function piezas(item, estilo = ESTILOS[0]) {
  if (item.clase === 'fact') {
    const lista = [[numeroAIngles(item.n), `${item.n}`], [estilo.verboFact, '=']];
    item.f.forEach(([p, e], i) => {
      if (i === 1) lista.push([estilo.veces, '·']);   // una vez basta: todos los «·» se leen igual
      lista.push([leerExponente(p, e), supers(p, e)]);
    });
    return lista;
  }
  const clase = item.clase === 'gcd' ? 'GCD' : 'LCM';
  const nombre = item.clase === 'gcd' ? estilo.gcd : estilo.lcm;
  return [
    [`the ${nombre} of`, clase], [numeroAIngles(item.a), `${item.a}`], ['and', ','], [numeroAIngles(item.b), `${item.b}`],
    [estilo.verboPred, '='], [numeroAIngles(item.valor), `${item.valor}`],
  ];
}

// La regla, delante: cada símbolo tiene su palabra y se dicen en el orden en que están escritos.
const REGLA = {
  leer: { es: 'Cada símbolo se lee con su palabra, en el orden en que está escrito:', en: 'Each symbol is read with its word, in the order it is written:' },
  escuchar: { es: 'Cada trozo se escribe con su símbolo, en el orden en que se dice:', en: 'Each part is written with its symbol, in the order it is said:' },
};

function listaPiezas(item, estilo, alReves, { esc }) {
  return piezas(item, estilo).map(([ing, sim]) => cuenta(alReves ? `${sim} → ${esc(ing)}` : `${esc(ing)} → ${sim}`)).join('; ');
}

/** El número del ítem que tiene pareja «-teen»/«-ty» (14 ↔ 40, 60 ↔ 16), y su pareja; o null. */
function parejaTeenTy(item) {
  for (const x of [item.n, item.a, item.b, item.valor]) {
    if (x >= 13 && x <= 19) return [x, (x - 10) * 10];
    if (x >= 30 && x <= 90 && x % 10 === 0) return [x, x / 10 + 10];
  }
  return null;
}

// El consejo antiguo («-teen suena distinto de -ty») salía también con el 20, que no tiene pareja, y no con
// 50-90 (fifty/fifteen); y no decía cuál es cuál. Ahora, solo si un número del ítem tiene pareja, y con ella.
function consejoTeenTy(item, { idioma }) {
  const par = parejaTeenTy(item);
  if (!par) return '';
  const [teen, ty] = par[0] < 20 ? par : [par[1], par[0]];
  return idioma === 'es'
    ? ` Consejo: no confundas «-teen» con «-ty»: «${numeroAIngles(teen)}» es ${teen} y «${numeroAIngles(ty)}» es ${ty}.`
    : ` Tip: do not mix up “-teen” and “-ty”: “${numeroAIngles(teen)}” is ${teen} and “${numeroAIngles(ty)}” is ${ty}.`;
}

const FIN = { es: 'La respuesta es', en: 'The answer is' };

/** Ejercicio 1 (escuchar y elegir la notación): lo que se oye, pieza a pieza, y la notación. */
export function explicaEscuchar(item, textos) {
  const { tt, esc } = textos;
  const oido = {
    es: `Has oído «${esc(leer(item))}».`,
    en: `You heard “${esc(leer(item))}”.`,
  };
  return `<p>${tt(oido)} ${tt(REGLA.escuchar)} ${listaPiezas(item, ESTILOS[0], false, textos)}.</p>`
    + `<p>${tt(FIN)} ${cuenta(notacion(item))}.${consejoTeenTy(item, textos)}</p>`;
}

/** Ejercicio 2 (ver la notación y elegir la lectura): cada símbolo en inglés y la lectura entera. */
export function explicaLeer(item, textos) {
  const { tt, esc } = textos;
  const estilo = item.estilo ?? ESTILOS[0];
  const lectura = esc(leer(item, estilo));
  return `<p>${tt(REGLA.leer)} ${listaPiezas(item, estilo, true, textos)}.</p>`
    + `<p>${tt(FIN)} ${cuenta(tt({ es: `«${lectura}»`, en: `“${lectura}”` }))}.${consejoTeenTy(item, textos)}</p>`;
}

/** Ejercicio 3 (completar la frase): por qué se dice así y la frase completa. */
const REGLAS_COMPLETAR = {
  divisible_by: ({ a, b }) => ({
    es: `En inglés se dice <strong>divisible by</strong> (divisible entre). Aquí ${a} : ${b} = ${a / b}, sin resto.`,
    en: `We say <strong>divisible by</strong>. Here ${a} ÷ ${b} = ${a / b}, with no remainder.`,
  }),
  divisor_of: ({ a, b }) => ({
    es: `Se dice <strong>divisor of</strong> (divisor de). ${b} es divisor de ${a} porque ${a} : ${b} = ${a / b}, sin resto.`,
    en: `We say <strong>divisor of</strong>. ${b} is a divisor of ${a} because ${a} ÷ ${b} = ${a / b}, with no remainder.`,
  }),
  multiple_of: ({ a, b }) => ({
    es: `Se dice <strong>multiple of</strong> (múltiplo de). ${a} es múltiplo de ${b} porque ${b} · ${a / b} = ${a}.`,
    en: `We say <strong>multiple of</strong>. ${a} is a multiple of ${b} because ${b} · ${a / b} = ${a}.`,
  }),
  goes_into: ({ a, b }) => ({
    es: `<strong>Goes into</strong> significa «cabe en»: ${b} · ${a / b} = ${a}, así que ${b} cabe ${a / b} veces en ${a}.`,
    en: `<strong>Goes into</strong> means “fits in”: ${b} · ${a / b} = ${a}, so ${b} fits ${a / b} times in ${a}.`,
  }),
  gcd_stands_for: () => ({
    es: 'GCD es el m.c.d.: el mayor (<strong>greatest</strong>) de los divisores comunes de dos números.',
    en: 'GCD is the highest number that is a divisor of both numbers: the <strong>greatest</strong> common divisor.',
  }),
  lcm_stands_for: () => ({
    es: 'LCM es el m.c.m.: el menor (<strong>lowest</strong>) de los múltiplos comunes de dos números, sin contar el 0.',
    en: 'LCM is the smallest multiple that both numbers share, not counting 0: the <strong>lowest</strong> common multiple.',
  }),
  one_is: () => ({
    es: 'Un número primo tiene exactamente dos divisores y uno compuesto tiene más de dos. El 1 solo tiene uno (él mismo): no es primo ni compuesto (<strong>neither … nor</strong> = ni … ni).',
    en: 'A prime number has exactly two divisors and a composite number has more than two. 1 has only one (itself): it is <strong>neither</strong> prime <strong>nor</strong> composite.',
  }),
  divisor_pair: ({ x, y, a }) => ({
    es: `Dos números que multiplicados dan ${a} forman una pareja de divisores: <strong>divisor pair</strong>. Aquí ${x} · ${y} = ${a}.`,
    en: `Two numbers that multiply to give ${a} are a <strong>divisor pair</strong> of ${a}. Here ${x} · ${y} = ${a}.`,
  }),
  sieve_composite: ({ n }) => ({
    es: `En la criba solo quedan sin tachar los primos. ${n} está tachado, así que es <strong>composite</strong> (compuesto).`,
    en: `In the sieve only the primes are not crossed out. ${n} is crossed out, so it is <strong>composite</strong>.`,
  }),
  zero_multiple: ({ n }) => ({
    // («Un número es múltiplo de otro cuando sale al multiplicarlo» no decía multiplicar qué por qué.)
    es: `${n} · 0 = 0, así que el 0 es un <strong>multiple</strong> (múltiplo) de ${n}: el 0 es múltiplo de todos los números.`,
    en: `${n} · 0 = 0, so 0 is a <strong>multiple</strong> of ${n}: 0 is a multiple of every number.`,
  }),
  smallest_prime: () => ({
    es: 'El 1 no es primo (solo tiene un divisor). El 2 tiene exactamente dos divisores, 1 y 2: es el primo más pequeño.',
    en: '1 is not prime (it has only one divisor). 2 has exactly two divisors, 1 and 2: it is the smallest prime.',
  }),
};

// La tarjeta cierra con la palabra que se elige y la frase completa; no reutiliza «La frase correcta es: …»
// del feedback (dos puntos entre el verbo y lo que sigue), ni la lista de un solo paso.
export function explicaCompletar(item, { tt, idioma, esc }) {
  const regla = REGLAS_COMPLETAR[item.plantilla](item.datos);
  const frase = item.frase.replace('___', item.solucion);
  const palabra = idioma === 'es' ? `«${esc(item.solucion)}»` : `“${esc(item.solucion)}”`;
  return `<p>${tt(regla)}</p><p>${tt(FIN)} <strong>${palabra}</strong>: ${cuenta(esc(frase))}.</p>`;
}
