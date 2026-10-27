// Práctica «Simplifica» (PU2, tarea 101): textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`. Un texto con
// números es una función en cada idioma; las fracciones llegan ya pintadas
// (`htmlFraccion`) y las cifras de los divisores, como números.

import { fraccion, htmlCuenta } from '../_comun/fracciones.js';

const EJEMPLO = htmlCuenta([fraccion(36, 48), '=', fraccion(18, 24), '=', fraccion(9, 12), '=', fraccion(3, 4)]);
const EJEMPLO_NEG = htmlCuenta([fraccion(-18, 24), '=', fraccion(-3, 4)]);
const EJEMPLO_MCD = htmlCuenta([fraccion(36, 48), '=', fraccion(3, 4)]);

export const TX = {
  pasos: {
    nombre: { es: 'Paso a paso', en: 'Step by step' },
    detalle: { es: 'Divide arriba y abajo hasta que no se pueda más', en: 'Divide the top and the bottom until you cannot any more' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Simplificar es dividir <strong>arriba y abajo entre el mismo número</strong>. Por ejemplo: ${EJEMPLO}</p>
        <p>Pulsa <strong>:2</strong>, <strong>:3</strong>, <strong>:5</strong> o <strong>:7</strong> para dividir los dos términos. Cuando ya no se pueda más, pulsa «Es irreducible». Si la fracción es negativa, el signo menos se queda delante: ${EJEMPLO_NEG}</p>`,
      en: `<h2>How it works</h2>
        <p>To simplify is to divide <strong>the top and the bottom by the same number</strong>. For example: ${EJEMPLO}</p>
        <p>Press <strong>:2</strong>, <strong>:3</strong>, <strong>:5</strong> or <strong>:7</strong> to divide both terms. When you cannot simplify any more, press “It can't be simplified”. If the fraction is negative, the minus sign stays in front: ${EJEMPLO_NEG}</p>`,
    },
    instruccion: {
      es: 'Simplifica la fracción hasta que sea <strong>irreducible</strong>',
      en: 'Simplify the fraction until it is in <strong>lowest terms</strong>',
    },
    irreducible: { es: 'Es irreducible', en: "It can't be simplified" },
    // El alumno intenta dividir entre un número que no divide a los dos términos.
    no_divide: {
      es: (k, n, d, cual) => (cual === 'numerador'
        ? `El ${k} divide a ${n}, pero no a ${d}: hay que dividir arriba y abajo entre el mismo número.`
        : cual === 'denominador'
          ? `El ${k} divide a ${d}, pero no a ${n}: hay que dividir arriba y abajo entre el mismo número.`
          : `El ${k} no divide ni a ${n} ni a ${d}.`),
      en: (k, n, d, cual) => (cual === 'numerador'
        ? `${k} divides ${n}, but not ${d}: you must divide the top and the bottom by the same number.`
        : cual === 'denominador'
          ? `${k} divides ${d}, but not ${n}: you must divide the top and the bottom by the same number.`
          : `${k} divides neither ${n} nor ${d}.`),
    },
    // Pulsa «irreducible» y todavía se puede dividir.
    todavia: {
      es: (k, n, d) => `Todavía se puede: el ${k} divide a ${n} y a ${d}.`,
      en: (k, n, d) => `You can still simplify: ${k} divides both ${n} and ${d}.`,
    },
    // Feedback final: la cadena de fracciones y por qué ya no se puede.
    final: {
      es: (cadena, n, d) => `${cadena} Ya es irreducible: el único divisor común de ${n} y ${d} es el 1.`,
      en: (cadena, n, d) => `${cadena} It is in lowest terms: the only common divisor of ${n} and ${d} is 1.`,
    },
    signo: {
      es: 'El signo menos se queda delante en todos los pasos.',
      en: 'The minus sign stays in front in every step.',
    },
  },
  irred: {
    nombre: { es: '¿Irreducible?', en: 'Lowest terms?' },
    detalle: { es: 'Marca las fracciones que ya no se pueden simplificar', en: 'Select the fractions that cannot be simplified' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una fracción es <strong>irreducible</strong> cuando el único divisor común de sus dos términos es el 1. Por ejemplo, ${htmlCuenta([fraccion(9, 14)])} es irreducible, pero ${htmlCuenta([fraccion(9, 15)])} no lo es: el 3 divide a los dos.</p>
        <p>Marca <strong>todas</strong> las fracciones irreducibles y pulsa «Comprobar». Ojo: que los dos números sean impares no basta.</p>`,
      en: `<h2>How it works</h2>
        <p>A fraction is in <strong>lowest terms</strong> when the only common divisor of its two terms is 1. For example, ${htmlCuenta([fraccion(9, 14)])} is in lowest terms, but ${htmlCuenta([fraccion(9, 15)])} is not: 3 divides both.</p>
        <p>Select <strong>all</strong> the fractions in lowest terms and press “Check”. Careful: both numbers being odd is not enough.</p>`,
    },
    instruccion: {
      es: 'Marca las fracciones <strong>irreducibles</strong> (las que no se pueden simplificar)',
      en: 'Select the fractions in <strong>lowest terms</strong> (the ones you cannot simplify)',
    },
    reducible: {
      es: (f, g, n, d, f2) => `${f}: el ${g} divide a ${n} y a ${d}, así que se puede simplificar (${f} = ${f2}).`,
      en: (f, g, n, d, f2) => `${f}: ${g} divides both ${n} and ${d}, so it can be simplified (${f} = ${f2}).`,
    },
    irreducible: {
      es: (f, n, d) => `${f}: el único divisor común de ${n} y ${d} es el 1; ya es irreducible.`,
      en: (f, n, d) => `${f}: the only common divisor of ${n} and ${d} is 1; it is already in lowest terms.`,
    },
    impares: {
      es: 'Ojo: que los dos números sean impares no basta.',
      en: 'Careful: both numbers being odd is not enough.',
    },
  },
  vez: {
    nombre: { es: 'De una vez', en: 'In one go' },
    detalle: { es: 'Halla el m.c.d. y la fracción irreducible', en: 'Find the GCD and the fraction in lowest terms' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Se puede simplificar de una sola vez dividiendo arriba y abajo entre el <strong>m.c.d.</strong> (el mayor divisor común). Por ejemplo, el m.c.d. de 36 y 48 es 12: ${EJEMPLO_MCD}</p>
        <p>Escribe el m.c.d. y la fracción irreducible. Si la fracción ya es irreducible, el m.c.d. es 1 y la fracción se queda igual. Con el botón «−» pones el signo menos delante.</p>`,
      en: `<h2>How it works</h2>
        <p>You can simplify in one go by dividing the top and the bottom by the <strong>GCD</strong> (the greatest common divisor). For example, the GCD of 36 and 48 is 12: ${EJEMPLO_MCD}</p>
        <p>Write the GCD and the fraction in lowest terms. If the fraction is already in lowest terms, the GCD is 1 and the fraction stays the same. The “−” button puts the minus sign in front.</p>`,
    },
    instruccion: {
      es: 'Escribe el <strong>m.c.d.</strong> de los dos términos y la fracción <strong>irreducible</strong>',
      en: 'Write the <strong>GCD</strong> of the two terms and the fraction in <strong>lowest terms</strong>',
    },
    etiqueta_mcd: { es: 'm.c.d.', en: 'GCD' },
    nombre_mcd: { es: 'Máximo común divisor', en: 'Greatest common divisor' },
    nombre_num: { es: 'Numerador', en: 'Numerator' },
    nombre_den: { es: 'Denominador', en: 'Denominator' },
    nombre_signo: { es: 'Signo menos delante', en: 'Minus sign in front' },
    // La cuenta buena: m.c.d.(36, 48) = 12; 36 : 12 = 3 y 48 : 12 = 4.
    cuenta: {
      es: (n, d, g, f, r) => (g === 1
        ? `m.c.d.(${n}, ${d}) = 1: ya era irreducible, ${f} se queda igual.`
        : `m.c.d.(${n}, ${d}) = ${g}; ${n} : ${g} = ${Math.abs(r.num)} y ${d} : ${g} = ${r.den}, así que ${f} = ${r.html}.`),
      en: (n, d, g, f, r) => (g === 1
        ? `GCD(${n}, ${d}) = 1: it was already in lowest terms, ${f} stays the same.`
        : `GCD(${n}, ${d}) = ${g}; ${n} : ${g} = ${Math.abs(r.num)} and ${d} : ${g} = ${r.den}, so ${f} = ${r.html}.`),
    },
    errores: {
      'simplifica-a-medias': {
        es: (r) => `${r} todavía se puede simplificar: hay que dividir arriba y abajo entre el m.c.d.`,
        en: (r) => `${r} can still be simplified: divide the top and the bottom by the GCD.`,
      },
      'simplifica-solo-numerador': {
        es: (r) => `${r}: parece que has dividido solo el numerador; hay que dividir también el denominador.`,
        en: (r) => `${r}: it looks like you divided only the numerator; the denominator must be divided too.`,
      },
      'simplifica-solo-denominador': {
        es: (r) => `${r}: parece que has dividido solo el denominador; hay que dividir también el numerador.`,
        en: (r) => `${r}: it looks like you divided only the denominator; the numerator must be divided too.`,
      },
      'signo-perdido-al-simplificar': {
        es: () => 'Has perdido el signo menos: al simplificar, el signo se queda delante.',
        en: () => 'You lost the minus sign: when you simplify, the sign stays in front.',
      },
      'signo-cambiado': {
        es: () => 'La fracción es positiva: al simplificar no cambia el signo.',
        en: () => 'The fraction is positive: simplifying does not change the sign.',
      },
      'irreducible-mal': {
        es: (r) => `${r} no es la fracción simplificada: hay que dividir arriba y abajo entre el m.c.d.`,
        en: (r) => `${r} is not the simplified fraction: divide the top and the bottom by the GCD.`,
      },
      'mcd-no-es-el-mayor': {
        es: (k, g) => `El ${k} divide a los dos términos, pero no es el mayor: el m.c.d. es ${g}.`,
        en: (k, g) => `${k} divides both terms, but it is not the greatest: the GCD is ${g}.`,
      },
      'mcd-mal': {
        es: (k, g) => `El ${k} no es el m.c.d.: el mayor divisor común de los dos términos es ${g}.`,
        en: (k, g) => `${k} is not the GCD: the greatest common divisor of the two terms is ${g}.`,
      },
    },
  },
};
