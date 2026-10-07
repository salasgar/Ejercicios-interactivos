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
    ],
    instruccion: {
      eleccion: 'Elige lo que va en el hueco.',
      preposicion: 'Elige la palabra que falta.',
      arrastrar: 'Arrastra dos números a los huecos para que la frase sea verdad.',
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
    ],
    instruccion: {
      eleccion: 'Choose what goes in the gap.',
      preposicion: 'Choose the missing word.',
      arrastrar: 'Drag two numbers to the gaps to make the sentence true.',
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
