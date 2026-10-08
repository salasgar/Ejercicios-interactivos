// Práctica «Potencias especiales, verdadero o falso»: textos propios, siempre
// { es, en }. Los comunes (Comprobar, Siguiente, Verdadero, Falso…) están en
// `../_comun/textos.js` y llegan a `montar` en `api.t`.
//
// Cada plantilla tiene su renderizado (la igualdad, con los números del
// ítem) y su explicación (confirmando el cálculo si es verdadera, o
// contrastando el cálculo real con la afirmación falsa si no lo es).

import { agrupar } from '../potencias10/logica.js';

export const TX = {
  nombre: { es: '¿Verdadero o falso?', en: 'True or false?' },
  detalle: { es: 'Las igualdades con las que todos se confunden', en: 'The equalities everyone gets wrong' },
  racha: { es: n => (n === 1 ? '1 acierto seguido' : `${n} aciertos seguidos`), en: n => (n === 1 ? '1 in a row' : `${n} in a row`) },
  nombre2: { es: '¿Cuál es la falsa?', en: 'Which one is false?' },
  detalle2: { es: 'De cuatro igualdades, solo una es falsa', en: 'Of four equalities, only one is false' },
  instruccion2: { es: 'Toca la igualdad que es falsa.', en: 'Tap the equality that is false.' },
  correcta2: { es: 'Correcto: es la única falsa.', en: "Correct: it's the only false one." },
  incorrecta2: { es: 'Esa es verdadera. La falsa es esta:', en: 'That one is true. The false one is this:' },
};

/** La igualdad de cada plantilla, con sus números, como texto (usar <sup> para el exponente). */
export function renderPlantilla(id, vars) {
  const { a, n } = vars;
  switch (id) {
    case 1: return `${a}<sup>0</sup> = 1`;
    case 2: return `${a}<sup>0</sup> = 0`;
    case 3: return `${a}<sup>0</sup> = ${a}`;
    case 4: return `0<sup>${n}</sup> = 0`;
    case 5: return `1<sup>${n}</sup> = 1`;
    case 6: return `1<sup>${n}</sup> = ${n}`;
    case 7: return `${a}<sup>1</sup> = ${a}`;
    case 8: return `${a}<sup>1</sup> = 1`;
    case 9: return `10<sup>${n}</sup> = ${agrupar('1'.concat('0'.repeat(n)))}`;
    case 10: return `10<sup>${n}</sup> = 10 · ${n}`;
    case 11: return `${a}<sup>${n}</sup> = ${a} · ${n}`;
    case 12: return `${a}<sup>3</sup> = ${a + 1}<sup>2</sup>`;
    case 13: return '2<sup>4</sup> = 4<sup>2</sup>';
    case 14: return `${a}<sup>${n}</sup> = ${Array(n).fill(a).join(' · ')}`;
    default: return '';
  }
}

/** La explicación de cada plantilla, { es, en }, con los números del ítem y el resultado real. */
export function explicarPlantilla(id, vars, lado1, lado2) {
  const { a, n } = vars;
  lado1 = agrupar(lado1); lado2 = agrupar(lado2);   // 10⁶ = 1 000 000, no 1000000
  const tabla = {
    1: {
      es: () => `Cualquier número distinto de 0 elevado a 0 vale 1: ${a}<sup>0</sup> = 1.`,
      en: () => `Any number other than 0 raised to the power of 0 is 1: ${a}<sup>0</sup> = 1.`,
    },
    2: {
      es: () => `${a}<sup>0</sup> = ${lado1}, no 0: el exponente 0 no deja la potencia en 0.`,
      en: () => `${a}<sup>0</sup> = ${lado1}, not 0: an exponent of 0 does not leave the power at 0.`,
    },
    3: {
      es: () => `${a}<sup>0</sup> = ${lado1}, no ${a}: el exponente 0 no deja el número igual.`,
      en: () => `${a}<sup>0</sup> = ${lado1}, not ${a}: an exponent of 0 does not leave the number unchanged.`,
    },
    4: {
      es: () => `0 multiplicado por sí mismo, las veces que sea, sigue dando 0: 0<sup>${n}</sup> = 0.`,
      en: () => `0 multiplied by itself, however many times, is still 0: 0<sup>${n}</sup> = 0.`,
    },
    5: {
      es: () => `1 multiplicado por sí mismo, las veces que sea, sigue dando 1: 1<sup>${n}</sup> = 1.`,
      en: () => `1 multiplied by itself, however many times, is still 1: 1<sup>${n}</sup> = 1.`,
    },
    6: {
      es: () => `1<sup>${n}</sup> = ${Array(n).fill(1).join(' · ')} = 1, no ${n}: el exponente no sale como resultado.`,
      en: () => `1<sup>${n}</sup> = ${Array(n).fill(1).join(' · ')} = 1, not ${n}: the exponent is not the result.`,
    },
    7: {
      es: () => `Un exponente 1 deja el número igual: ${a}<sup>1</sup> = ${a}.`,
      en: () => `An exponent of 1 leaves the number unchanged: ${a}<sup>1</sup> = ${a}.`,
    },
    8: {
      es: () => `${a}<sup>1</sup> = ${a}, no 1: un exponente 1 deja el número igual, no lo convierte en 1.`,
      en: () => `${a}<sup>1</sup> = ${a}, not 1: an exponent of 1 leaves the number unchanged, it does not turn it into 1.`,
    },
    9: {
      es: () => `10<sup>${n}</sup> es un 1 seguido de ${n} ceros: ${lado1}.`,
      en: () => `10<sup>${n}</sup> is a 1 followed by ${n} zeros: ${lado1}.`,
    },
    10: {
      es: () => `10<sup>${n}</sup> = ${lado1}, no ${lado2}: la potencia no es multiplicar 10 por el exponente.`,
      en: () => `10<sup>${n}</sup> = ${lado1}, not ${lado2}: the power is not 10 times the exponent.`,
    },
    11: {
      es: () => `${a}<sup>${n}</sup> = ${Array(n).fill(a).join(' · ')} = ${lado1}, no ${a} · ${n} = ${lado2}: la potencia repite la base, no la multiplica por el exponente.`,
      en: () => `${a}<sup>${n}</sup> = ${Array(n).fill(a).join(' · ')} = ${lado1}, not ${a} · ${n} = ${lado2}: a power repeats the base, it does not multiply it by the exponent.`,
    },
    12: {
      es: () => `${a}<sup>3</sup> = ${lado1} y ${a + 1}<sup>2</sup> = ${lado2}: son potencias distintas y no coinciden.`,
      en: () => `${a}<sup>3</sup> = ${lado1} and ${a + 1}<sup>2</sup> = ${lado2}: they are different powers and do not match.`,
    },
    13: {
      es: () => `Es una excepción curiosa: 2<sup>4</sup> = 16 y 4<sup>2</sup> = 16. No pasa con otras bases pequeñas.`,
      en: () => `It's a curious exception: 2<sup>4</sup> = 16 and 4<sup>2</sup> = 16. It doesn't happen with other small bases.`,
    },
    14: {
      es: () => `${a}<sup>${n}</sup> es la base repetida ${n} veces: ${Array(n).fill(a).join(' · ')} = ${lado1}.`,
      en: () => `${a}<sup>${n}</sup> is the base repeated ${n} times: ${Array(n).fill(a).join(' · ')} = ${lado1}.`,
    },
  };
  return { es: tabla[id].es(), en: tabla[id].en() };
}
