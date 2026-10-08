// Práctica «Divisor, múltiplo, divisible»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!, «es», «no es», «resto»…) llegan
// en `api.t` (ver `../practicas/_comun/textos.js`) y no se repiten aquí.

import { T as COMUN } from '../practicas/_comun/textos.js';

export const T = {
  es: {
    ejercicios: [
      { nombre: '¿«de» o «entre»?', detalle: 'Elige la preposición que falta' },
      { nombre: 'Con multiplicaciones', detalle: 'Divisor, múltiplo o divisible, a partir de un producto' },
      { nombre: 'Con divisiones', detalle: 'Divisor, múltiplo o divisible, a partir de una división' },
      { nombre: 'Multiplicaciones y divisiones', detalle: 'Mezcla de las dos anteriores' },
      { nombre: 'Arrastra los números', detalle: 'Completa la frase arrastrando dos números' },
      { nombre: '¿Quién miente?', detalle: 'Pulsa el bicho que miente o el que dice la verdad' },
    ],
    instruccion: {
      eleccion: 'Elige lo que va en el hueco.',
      preposicion: 'Elige la palabra que falta.',
      arrastrar: 'Arrastra dos números a los huecos para que la frase sea verdad.',
      bichos: { verdad: 'Pulsa el bicho que dice la <strong>VERDAD</strong>', mentira: 'Pulsa el bicho que <strong>MIENTE</strong>' },
    },
    bichos: {
      aplastado: '¡Aplastado! Mentía:',
      acertado: '¡Ese! Decía la verdad:',
      este_verdad: 'Este bicho decía la verdad:',
      este_mentia: 'Este bicho mentía:',
      habia_que: { verdad: 'Había que pulsar al que dice la verdad.', mentira: 'Había que pulsar al que miente.' },
      el_que_mentia: 'El que mentía era este:',
      el_sincero: 'El que decía la verdad era este:',
      cero_divisor: '0 no es divisor de ningún número: no se puede dividir entre 0',
      no_exacta: 'la división no es exacta',
    },
    relacion: { divisor: 'divisor de', multiplo: 'múltiplo de', divisible: 'divisible entre' },
    palabra: { divisor: 'divisor', multiplo: 'múltiplo', divisible: 'divisible' },
    preposicion: { de: 'de', entre: 'entre' },
    se_dice: 'Se dice «múltiplo de», «divisor de» y «divisible entre».',
  },
  en: {
    ejercicios: [
      { nombre: '“of” or “by”?', detalle: 'Choose the missing preposition' },
      { nombre: 'With multiplications', detalle: 'Divisor, multiple or divisible, from a product' },
      { nombre: 'With divisions', detalle: 'Divisor, multiple or divisible, from a division' },
      { nombre: 'Multiplications and divisions', detalle: 'A mix of the two previous ones' },
      { nombre: 'Drag the numbers', detalle: 'Complete the sentence by dragging two numbers' },
      { nombre: 'Who is lying?', detalle: 'Tap the bug that is lying or the one telling the truth' },
    ],
    instruccion: {
      eleccion: 'Choose what goes in the gap.',
      preposicion: 'Choose the missing word.',
      arrastrar: 'Drag two numbers to the gaps to make the sentence true.',
      bichos: { verdad: 'Tap the bug that is telling the <strong>TRUTH</strong>', mentira: 'Tap the bug that is <strong>LYING</strong>' },
    },
    bichos: {
      aplastado: 'Squashed! It was lying:',
      acertado: 'That one! It was telling the truth:',
      este_verdad: 'This bug was telling the truth:',
      este_mentia: 'This bug was lying:',
      habia_que: { verdad: 'You had to tap the one telling the truth.', mentira: 'You had to tap the one that is lying.' },
      el_que_mentia: 'The one lying was this one:',
      el_sincero: 'The one telling the truth was this one:',
      cero_divisor: '0 is not a divisor of any number: you cannot divide by 0',
      no_exacta: 'the division is not exact',
    },
    relacion: { divisor: 'a divisor of', multiplo: 'a multiple of', divisible: 'divisible by' },
    palabra: { divisor: 'a divisor', multiplo: 'a multiple', divisible: 'divisible' },
    preposicion: { de: 'of', entre: 'by' },
    se_dice: 'We say “a multiple of”, “a divisor of” and “divisible by”.',
  },
};

/** «12 · 5 = 60» o «75 : 3 = 25, resto = 0». */
export function textoOperacion(op, idioma) {
  return op.clase === 'producto'
    ? `${op.a} · ${op.b} = ${op.c}`
    : `${op.a} : ${op.b} = ${op.c}, ${COMUN[idioma].resto} = 0`;
}

/** «5 es divisor de 60». */
export function frase(relacion, x, y, idioma) {
  return `${x} ${COMUN[idioma].es} ${T[idioma].relacion[relacion]} ${y}`;
}

/** «3 no es múltiplo de 5». */
export function fraseNegada(relacion, x, y, idioma) {
  return `${x} ${COMUN[idioma].no_es} ${T[idioma].relacion[relacion]} ${y}`;
}

/** La cuenta que justifica la relación entre x e y: «60 = 5 · 12» o «60 : 5 = 12, resto 0». */
export function razon(relacion, x, y, idioma) {
  return relacion === 'divisor'
    ? `${y} : ${x} = ${y / x}, ${COMUN[idioma].resto} 0`
    : `${x} = ${y} · ${x / y}`;
}

/**
 * La cuenta que justifica que «x es <relación> y» es FALSA: la división que
 * tendría que ser exacta y no lo es («61 : 5 = 12, resto 1»), o el caso del 0.
 */
export function razonFalsa(relacion, x, y, idioma) {
  const tx = T[idioma].bichos;
  const [dividendo, divisor] = relacion === 'divisor' ? [y, x] : [x, y];
  if (divisor === 0) return relacion === 'divisor' ? tx.cero_divisor : tx.no_exacta;
  return `${dividendo} : ${divisor} = ${Math.floor(dividendo / divisor)}, ${COMUN[idioma].resto} ${dividendo % divisor}`;
}

/** «1 es divisor de 7: 7 : 1 = 7, resto 0» o «60 no es divisor de 5: 5 : 60 = 0, resto 5». */
export function fraseRazonada(f, idioma) {
  return f.verdadera
    ? `${frase(f.relacion, f.x, f.y, idioma)}: <span class="cuenta">${razon(f.relacion, f.x, f.y, idioma)}</span>`
    : `${fraseNegada(f.relacion, f.x, f.y, idioma)}: <span class="cuenta">${razonFalsa(f.relacion, f.x, f.y, idioma)}</span>`;
}
