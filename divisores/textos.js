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
    // Por qué es falsa «x es <relación> y» (ver `explicacion`). Definiciones de
    // Juan Luis (2026-10-14): múltiplo = está en la tabla; divisor y divisible =
    // la división es exacta.
    tabla: {
      multiplo: (x, y, lista) => `«múltiplo de ${y}» quiere decir que está en la tabla del ${y}, y el ${x} no está: los múltiplos de ${y} son ${lista}`,
      divisor_division: (x, y, d) => `«divisor de ${y}» quiere decir que puedes dividir ${y} entre ${x} y la división es exacta; aquí no lo es: ${d}`,
      divisor_tabla: (x, y, lista) => `«divisor de ${y}» quiere decir que el ${y} está en la tabla del ${x}, y no está: los múltiplos de ${x} son ${lista}`,
      divisible_division: (x, y, d) => `«divisible entre ${y}» quiere decir que al dividirlo entre ${y} la división es exacta; aquí no lo es: ${d}`,
      divisible_tabla: (x, y, lista) => `«divisible entre ${y}» es lo mismo que «múltiplo de ${y}»: estar en la tabla del ${y}, y el ${x} no está: los múltiplos de ${y} son ${lista}`,
      al_reves: 'Es al revés:',
      queda_entre: (x, a, b) => `(el ${x} queda entre ${a} y ${b})`,
    },
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
    tabla: {
      multiplo: (x, y, lista) => `“a multiple of ${y}” means it is in the ${y} times table, and ${x} is not: the multiples of ${y} are ${lista}`,
      divisor_division: (x, y, d) => `“a divisor of ${y}” means you can divide ${y} by ${x} and the division is exact; here it is not: ${d}`,
      divisor_tabla: (x, y, lista) => `“a divisor of ${y}” means ${y} is in the ${x} times table, and it is not: the multiples of ${x} are ${lista}`,
      divisible_division: (x, y, d) => `“divisible by ${y}” means that when you divide it by ${y} the division is exact; here it is not: ${d}`,
      divisible_tabla: (x, y, lista) => `“divisible by ${y}” is the same as “a multiple of ${y}”: being in the ${y} times table, and ${x} is not: the multiples of ${y} are ${lista}`,
      al_reves: 'It is the other way round:',
      queda_entre: (x, a, b) => `(${x} is between ${a} and ${b})`,
    },
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

/**
 * Los primeros múltiplos de n, o los que rodean a x si x queda lejos:
 * «0, 20, 40, 60…» o «0, 5, 10, 15… (el 61 queda entre 60 y 65)».
 */
function listaMultiplos(n, x, idioma) {
  const lista = `0, ${n}, ${2 * n}, ${3 * n}…`;
  if (x < 3 * n) return lista;
  const q = Math.floor(x / n);
  return `${lista} ${T[idioma].tabla.queda_entre(x, q * n, (q + 1) * n)}`;
}

/** Pone el punto final, salvo que la frase acabe ya en puntos suspensivos. */
export function cerrar(texto) {
  return texto.endsWith('…') ? texto : `${texto}.`;
}

/** «x es <relación> y» al revés, cuando al revés sí es verdad; si no, null. */
function alReves(relacion, x, y) {
  if (relacion === 'divisor') return x !== 0 && y !== 0 && x % y === 0 ? { relacion: 'divisor', x: y, y: x } : null;
  return x !== 0 && y % x === 0 ? { relacion, x: y, y: x } : null;
}

/**
 * Por qué es FALSA «x es <relación> y», con las definiciones de clase: un
 * múltiplo está en la tabla; un divisor o un divisible da una división exacta.
 * Si la división sale con cociente 0 (5 : 20), que no le dice nada al alumno,
 * se explica con la tabla. Si la relación es verdad al revés (el alumno sabe
 * que 5 y 20 van juntos pero no en qué sentido), se le dice.
 * Con `conAlReves: false` se omite esa última frase (cuando ya se da la buena).
 */
export function explicacion(relacion, x, y, idioma, { conAlReves = true } = {}) {
  const tt = T[idioma].tabla;
  if (relacion === 'divisor' && x === 0) return T[idioma].bichos.cero_divisor;
  let texto;
  if (relacion === 'multiplo') texto = tt.multiplo(x, y, listaMultiplos(y, x, idioma));
  else if (relacion === 'divisor') {
    texto = x < y ? tt.divisor_division(x, y, `<span class="cuenta">${razonFalsa(relacion, x, y, idioma)}</span>`)
      : tt.divisor_tabla(x, y, listaMultiplos(x, y, idioma));
  } else {
    texto = x > y ? tt.divisible_division(x, y, `<span class="cuenta">${razonFalsa(relacion, x, y, idioma)}</span>`)
      : tt.divisible_tabla(x, y, listaMultiplos(y, x, idioma));
  }
  const r = conAlReves && alReves(relacion, x, y);
  if (!r) return texto;
  // «Divisible» se justifica con la división (20 : 5 = 4, resto 0); «múltiplo», con el producto.
  const cuenta = r.relacion === 'divisible' ? razon('divisor', r.y, r.x, idioma) : razon(r.relacion, r.x, r.y, idioma);
  return `${cerrar(texto)} ${tt.al_reves} ${frase(r.relacion, r.x, r.y, idioma)} (<span class="cuenta">${cuenta}</span>)`;
}

/** «1 es divisor de 7: 7 : 1 = 7, resto 0» o «60 no es divisor de 5: «divisor de 5» quiere decir…». */
export function fraseRazonada(f, idioma) {
  return f.verdadera
    ? `${frase(f.relacion, f.x, f.y, idioma)}: <span class="cuenta">${razon(f.relacion, f.x, f.y, idioma)}</span>`
    : f.relacion === 'divisor' && f.x === 0
      ? T[idioma].bichos.cero_divisor
      : `${fraseNegada(f.relacion, f.x, f.y, idioma)}; ${explicacion(f.relacion, f.x, f.y, idioma)}`;
}
