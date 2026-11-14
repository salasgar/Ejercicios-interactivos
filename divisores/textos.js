// Práctica «Divisor, múltiplo, divisible»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!, «es», «no es», «resto»…) llegan
// en `api.t` (ver `../practicas/_comun/textos.js`) y no se repiten aquí.

import { T as COMUN } from '../practicas/_comun/textos.js';
import { explicacion, explicacionCompleta, cerrar } from '../practicas/_comun/relaciones.js';

// La explicación de los fallos (tabla, división exacta, «al revés») es común con `recta/`.
export { explicacion, cerrar };

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

// ─── «No lo sé» (tarea 183): la explicación de cada ejercicio, con los números del ítem ───────────

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const cuenta = texto => `<span class="cuenta">${texto}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const comillas = (texto, idioma) => (idioma === 'es' ? `«${texto}»` : `“${texto}”`);
const nombreRelacion = (relacion, idioma) => comillas(T[idioma].relacion[relacion], idioma);

/** Qué quiere decir «x es <relación> y», en una frase y con los números del ítem. */
export function reglaRelacion(relacion, x, y, idioma) {
  const nombre = nombreRelacion(relacion, idioma);
  if (idioma === 'es') {
    if (relacion === 'multiplo') return `${nombre} quiere decir que está en la tabla del ${y}: ${x} = ${y} · algún número.`;
    if (relacion === 'divisor') return `${nombre} quiere decir que puedes dividir ${y} entre ${x} y el resto es 0.`;
    return `${nombre} quiere decir que al dividir ${x} entre ${y} el resto es 0 (lo mismo que «múltiplo de»).`;
  }
  if (relacion === 'multiplo') return `${nombre} means it is in the ${y} times table: ${x} = ${y} · some number.`;
  if (relacion === 'divisor') return `${nombre} means you can divide ${y} by ${x} and the remainder is 0.`;
  return `${nombre} means that when you divide ${x} by ${y} the remainder is 0 (the same as “a multiple of”).`;
}

/** La cuenta que acompaña a la regla: «divisible» se comprueba dividiendo; las otras, como en `razon`. */
export function cuentaRelacion(relacion, x, y, idioma) {
  return relacion === 'divisible' ? `${x} : ${y} = ${x / y}, ${COMUN[idioma].resto} 0` : razon(relacion, x, y, idioma);
}

/** Ejercicio 0 («de» o «entre»): la preposición depende de la palabra, no de los números. */
export function explicaPreposicion(item, { idioma }) {
  const es = idioma === 'es';
  const { x, y, relacion } = item;
  const palabra = item.correcta;
  const regla = es
    ? 'Se dice «múltiplo de» y «divisor de», pero «divisible entre».'
    : 'We say “a multiple of” and “a divisor of”, but “divisible by”.';
  const prep = T[idioma].preposicion[palabra];
  const aqui = es
    ? `Aquí la frase es «${x} es ${T.es.palabra[relacion]} … ${y}»: lleva «${prep}».`
    : `Here the sentence is “${x} is ${T.en.palabra[relacion]} … ${y}”: it takes “${prep}”.`;
  const verdad = `${frase(relacion, x, y, idioma)}: ${cuenta(cuentaRelacion(relacion, x, y, idioma))}.`;
  const fin = es ? `La respuesta es «${prep}».` : `The answer is “${prep}”.`;
  return `${pasos([regla, aqui, verdad])}${fin}`;
}

/** Ejercicios 1, 2 y 3 (elegir la relación): se comprueba con la cuenta de cada relación que es verdad. */
export function explicaEleccion(item, { idioma }) {
  const es = idioma === 'es';
  const { x, y, correctas } = item;
  const comprobar = es
    ? `Mira ${cuenta(textoOperacion(item.op, idioma))}: ¿está el ${x} en la tabla del ${y}, o el ${y} en la tabla del ${x}?`
    : `Look at ${cuenta(textoOperacion(item.op, idioma))}: is ${x} in the ${y} times table, or ${y} in the ${x} times table?`;
  const verdades = correctas.map(r => `${reglaRelacion(r, x, y, idioma)} ${es ? 'Aquí:' : 'Here:'} ${cuenta(cuentaRelacion(r, x, y, idioma))}, ${es ? 'así que' : 'so'} ${frase(r, x, y, idioma)}.`);
  const nombres = correctas.map(r => nombreRelacion(r, idioma)).join(es ? ' o ' : ' or ');
  const fin = es
    ? `La respuesta es ${nombres}${correctas.length > 1 ? ' (las dos valen)' : ''}.`
    : `The answer is ${nombres}${correctas.length > 1 ? ' (both are right)' : ''}.`;
  return `${pasos([comprobar, ...verdades])}${fin}`;
}

/** Ejercicio 4 (arrastrar dos números a la frase): una colocación que sea verdad, con su cuenta. */
export function explicaArrastrar(item, { idioma }, [sx, sy]) {
  const es = idioma === 'es';
  const dados = es
    ? `Tienes los números ${item.numeros.join(', ')}; vienen de ${cuenta(textoOperacion(item.op, idioma))}.`
    : `You have the numbers ${item.numeros.join(', ')}; they come from ${cuenta(textoOperacion(item.op, idioma))}.`;
  const regla = reglaRelacion(item.relacion, sx, sy, idioma);
  const buena = `${es ? 'Aquí:' : 'Here:'} ${cuenta(cuentaRelacion(item.relacion, sx, sy, idioma))}, ${es ? 'así que' : 'so'} ${frase(item.relacion, sx, sy, idioma)}.`;
  const fin = es ? `Una solución es ${sx} y ${sy}.` : `One solution is ${sx} and ${sy}.`;
  const consejo = es
    ? ' Consejo: el número más grande de la operación es el múltiplo; los otros dos son divisores suyos.'
    : ' Tip: the biggest number in the operation is the multiple; the other two are divisors of it.';
  return `${pasos([dados, regla, buena])}${fin}${consejo}`;
}

/** «1 es divisor de 7: 7 : 1 = 7, resto 0» o «60 no es divisor de 5: «divisor de 5» quiere decir…». */
export function fraseRazonada(f, idioma) {
  return f.verdadera
    ? `${frase(f.relacion, f.x, f.y, idioma)}: <span class="cuenta">${razon(f.relacion, f.x, f.y, idioma)}</span>`
    : explicacionCompleta(f.relacion, f.x, f.y, idioma);
}
