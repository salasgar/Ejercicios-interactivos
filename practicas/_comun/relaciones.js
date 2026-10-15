// Por qué es falsa «x es múltiplo de / divisor de / divisible entre y», con las
// definiciones de clase de Juan Luis (2026-10-14):
//   - un múltiplo de 50 es cualquier número de la tabla del 50;
//   - un divisor de 50 es un número entre el que se puede dividir 50 y la
//     división es exacta (resto 0);
//   - un número es divisible entre 50 si al dividirlo entre 50 la división es
//     exacta: es lo mismo que ser múltiplo de 50.
// Si la división saldría con cociente 0 (5 : 20), que no le dice nada al
// alumno, se explica con la tabla. Si la relación es verdad al revés (el alumno
// sabe que 5 y 20 van juntos pero no en qué sentido), se le dice.
// Las frases se separan con «;», nunca con «·», que parece una multiplicación.
// Lo usan `divisores/` y `recta/`. Todo puro, sin DOM.

import { T as COMUN } from './textos.js';

const RELACION = {
  es: { divisor: 'divisor de', multiplo: 'múltiplo de', divisible: 'divisible entre' },
  en: { divisor: 'a divisor of', multiplo: 'a multiple of', divisible: 'divisible by' },
};

const TX = {
  es: {
    multiplo: (x, y, lista) => `«múltiplo de ${y}» quiere decir que está en la tabla del ${y}, y el ${x} no está: los múltiplos de ${y} son ${lista}`,
    divisor_division: (x, y, d) => `«divisor de ${y}» quiere decir que puedes dividir ${y} entre ${x} y la división es exacta; aquí no lo es: ${d}`,
    divisor_tabla: (x, y, lista) => `«divisor de ${y}» quiere decir que el ${y} está en la tabla del ${x}, y no está: los múltiplos de ${x} son ${lista}`,
    divisible_division: (x, y, d) => `«divisible entre ${y}» quiere decir que al dividirlo entre ${y} la división es exacta; aquí no lo es: ${d}`,
    divisible_tabla: (x, y, lista) => `«divisible entre ${y}» es lo mismo que «múltiplo de ${y}»: estar en la tabla del ${y}, y el ${x} no está: los múltiplos de ${y} son ${lista}`,
    cero_divisor: '0 no es divisor de ningún número: no se puede dividir entre 0',
    al_reves: 'Es al revés:',
    queda_entre: (x, a, b) => `(el ${x} queda entre ${a} y ${b})`,
    // Versiones cortas, para cuando se explican varios números a la vez (marcar en la recta).
    corto_multiplo: (x, y, a, b) => `${x} no es múltiplo de ${y}: no está en la tabla del ${y} (queda entre ${a} y ${b})`,
    corto_divisor_division: (x, y, d) => `${x} no es divisor de ${y}: ${d}; la división no es exacta`,
    corto_divisor_tabla: (x, y) => `${x} no es divisor de ${y}: el ${y} no está en la tabla del ${x}`,
  },
  en: {
    multiplo: (x, y, lista) => `“a multiple of ${y}” means it is in the ${y} times table, and ${x} is not: the multiples of ${y} are ${lista}`,
    divisor_division: (x, y, d) => `“a divisor of ${y}” means you can divide ${y} by ${x} and the division is exact; here it is not: ${d}`,
    divisor_tabla: (x, y, lista) => `“a divisor of ${y}” means ${y} is in the ${x} times table, and it is not: the multiples of ${x} are ${lista}`,
    divisible_division: (x, y, d) => `“divisible by ${y}” means that when you divide it by ${y} the division is exact; here it is not: ${d}`,
    divisible_tabla: (x, y, lista) => `“divisible by ${y}” is the same as “a multiple of ${y}”: being in the ${y} times table, and ${x} is not: the multiples of ${y} are ${lista}`,
    cero_divisor: '0 is not a divisor of any number: you cannot divide by 0',
    al_reves: 'It is the other way round:',
    queda_entre: (x, a, b) => `(${x} is between ${a} and ${b})`,
    corto_multiplo: (x, y, a, b) => `${x} is not a multiple of ${y}: it is not in the ${y} times table (it is between ${a} and ${b})`,
    corto_divisor_division: (x, y, d) => `${x} is not a divisor of ${y}: ${d}; the division is not exact`,
    corto_divisor_tabla: (x, y) => `${x} is not a divisor of ${y}: ${y} is not in the ${x} times table`,
  },
};

const cuenta = texto => `<span class="cuenta">${texto}</span>`;

/** «5 es divisor de 60». */
export function fraseRelacion(relacion, x, y, idioma) {
  return `${x} ${COMUN[idioma].es} ${RELACION[idioma][relacion]} ${y}`;
}

/** «3 no es múltiplo de 5». */
export function fraseRelacionNegada(relacion, x, y, idioma) {
  return `${x} ${COMUN[idioma].no_es} ${RELACION[idioma][relacion]} ${y}`;
}

/** «61 : 5 = 12, resto 1». */
function division(dividendo, divisor, idioma) {
  return `${dividendo} : ${divisor} = ${Math.floor(dividendo / divisor)}, ${COMUN[idioma].resto} ${dividendo % divisor}`;
}

/** Pone el punto final, salvo que la frase acabe ya en puntos suspensivos. */
export function cerrar(texto) {
  return texto.endsWith('…') ? texto : `${texto}.`;
}

/** «0, 20, 40, 60…» o, si x queda lejos, «0, 5, 10, 15… (el 61 queda entre 60 y 65)». */
function listaMultiplos(n, x, idioma) {
  const lista = `0, ${n}, ${2 * n}, ${3 * n}…`;
  if (x < 3 * n) return lista;
  const q = Math.floor(x / n);
  return `${lista} ${TX[idioma].queda_entre(x, q * n, (q + 1) * n)}`;
}

/** «x es <relación> y» al revés, cuando al revés sí es verdad; si no, null. */
export function relacionAlReves(relacion, x, y) {
  if (relacion === 'divisor') return x !== 0 && y !== 0 && x % y === 0 ? { relacion, x: y, y: x } : null;
  return x !== 0 && y % x === 0 ? { relacion, x: y, y: x } : null;
}

/** «Es al revés: 20 es múltiplo de 5 (20 = 5 · 4).», o '' si al revés tampoco es verdad. */
export function fraseAlReves(relacion, x, y, idioma) {
  const r = relacionAlReves(relacion, x, y);
  if (!r) return '';
  // «Múltiplo» se justifica con el producto; «divisor» y «divisible», con la división exacta.
  const c = r.relacion === 'multiplo' ? `${r.x} = ${r.y} · ${r.x / r.y}`
    : r.relacion === 'divisor' ? `${r.y} : ${r.x} = ${r.y / r.x}, ${COMUN[idioma].resto} 0`
      : `${r.x} : ${r.y} = ${r.x / r.y}, ${COMUN[idioma].resto} 0`;
  return `${TX[idioma].al_reves} ${fraseRelacion(r.relacion, r.x, r.y, idioma)} (${cuenta(c)}).`;
}

/**
 * Por qué es FALSA «x es <relación> y» (sin la frase negada delante). Con
 * `conAlReves: false` se omite el «Es al revés…» (cuando ya se da la buena).
 */
export function explicacion(relacion, x, y, idioma, { conAlReves = true } = {}) {
  const tt = TX[idioma];
  if (relacion === 'divisor' && x === 0) return tt.cero_divisor;
  let texto;
  if (relacion === 'multiplo') texto = tt.multiplo(x, y, listaMultiplos(y, x, idioma));
  else if (relacion === 'divisor') {
    texto = x < y ? tt.divisor_division(x, y, cuenta(division(y, x, idioma))) : tt.divisor_tabla(x, y, listaMultiplos(x, y, idioma));
  } else {
    texto = x > y ? tt.divisible_division(x, y, cuenta(division(x, y, idioma))) : tt.divisible_tabla(x, y, listaMultiplos(y, x, idioma));
  }
  const reves = conAlReves ? fraseAlReves(relacion, x, y, idioma) : '';
  return reves ? `${cerrar(texto)} ${reves.slice(0, -1)}` : texto;
}

/** «60 no es divisor de 5; «divisor de 5» quiere decir…» (sin punto final: ver `cerrar`). */
export function explicacionCompleta(relacion, x, y, idioma, opciones) {
  if (relacion === 'divisor' && x === 0) return TX[idioma].cero_divisor;
  return `${fraseRelacionNegada(relacion, x, y, idioma)}; ${explicacion(relacion, x, y, idioma, opciones)}`;
}

/** Versión corta, con punto final, de por qué x no es múltiplo de y (y > 0). Con el «al revés» si toca. */
export function noEsMultiploCorto(x, y, idioma) {
  const q = Math.floor(x / y);
  const reves = fraseAlReves('multiplo', x, y, idioma);
  return `${TX[idioma].corto_multiplo(x, y, q * y, (q + 1) * y)}.${reves ? ` ${reves}` : ''}`;
}

/** Versión corta, con punto final, de por qué x (> 0) no es divisor de y. Con el «al revés» si toca. */
export function noEsDivisorCorto(x, y, idioma) {
  const reves = fraseAlReves('divisor', x, y, idioma);
  const texto = x < y ? TX[idioma].corto_divisor_division(x, y, cuenta(division(y, x, idioma))) : TX[idioma].corto_divisor_tabla(x, y);
  return `${texto}.${reves ? ` ${reves}` : ''}`;
}
