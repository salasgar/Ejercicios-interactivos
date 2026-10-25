// Práctica «Opuesto y valor absoluto»: textos propios, { es, en }. Los comunes
// (Comprobar, Siguiente, Borrar…) llegan en `api.t`. Los números se escriben con
// `fmt` (el menos es U+2212); nada de letras de variable: el hueco es □.

import { fmt } from '../_comun/enteros.js';

const unidades = (n, es) => (es ? (n === 1 ? '1 unidad' : `${n} unidades`) : (n === 1 ? '1 unit' : `${n} units`));

export const TX = {
  ej1: {
    nombre: { es: 'El opuesto', en: 'The opposite' },
    detalle: { es: 'Halla el opuesto de un número', en: 'Find the opposite of a number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El <strong>opuesto</strong> de un número está al otro lado del 0, a la misma distancia. Por ejemplo, el opuesto de <strong>4</strong> es <strong>−4</strong>, y el opuesto de <strong>−4</strong> es <strong>4</strong>.</p>
        <p>Se escribe con un menos delante: <strong>−(−4) = 4</strong>. El opuesto de un opuesto es el número de partida.</p>`,
      en: `<h2>How it works</h2>
        <p>The <strong>opposite</strong> of a number is on the other side of 0, at the same distance. For example, the opposite of <strong>4</strong> is <strong>−4</strong>, and the opposite of <strong>−4</strong> is <strong>4</strong>.</p>
        <p>It is written with a minus sign in front: <strong>−(−4) = 4</strong>. The opposite of an opposite is the number you started with.</p>`,
    },
    toca: {
      es: n => `Toca en la recta el <strong>opuesto de ${fmt(n)}</strong>.`,
      en: n => `Tap the <strong>opposite of ${fmt(n)}</strong> on the number line.`,
    },
    doble: {
      es: n => `¿Cuánto es <strong>−(${fmt(n)})</strong>? Escribe el resultado.`,
      en: n => `What is <strong>−(${fmt(n)})</strong>? Write the result.`,
    },
    recta: { es: 'Recta numérica', en: 'Number line' },
    campo: { es: 'Resultado', en: 'Result' },
    bien: {
      es: n => `El opuesto de ${fmt(n)} es ${fmt(-n)}: están a la misma distancia del 0, uno a cada lado`,
      en: n => `The opposite of ${fmt(n)} is ${fmt(-n)}: they are the same distance from 0, one on each side`,
    },
    bienDoble: {
      es: n => `El opuesto de ${fmt(n)} es ${fmt(-n)}, así que <span class="cuenta">−(${fmt(n)}) = ${fmt(-n)}</span>`,
      en: n => `The opposite of ${fmt(n)} is ${fmt(-n)}, so <span class="cuenta">−(${fmt(n)}) = ${fmt(-n)}</span>`,
    },
    sinCambiar: {
      es: n => `Has dejado el ${fmt(n)}, pero el opuesto está al otro lado del 0`,
      en: n => `You kept ${fmt(n)}, but the opposite is on the other side of 0`,
    },
    delOpuesto: {
      es: n => `Has dejado el ${fmt(n)}, pero el opuesto de un número negativo es positivo`,
      en: n => `You kept ${fmt(n)}, but the opposite of a negative number is positive`,
    },
    otro: { es: (n, r) => `Has puesto el ${fmt(r)}, que no está a la misma distancia del 0 que ${fmt(n)}`, en: (n, r) => `You put ${fmt(r)}, which is not the same distance from 0 as ${fmt(n)}` },
  },
  ej2: {
    nombre: { es: 'Distancia al cero', en: 'Distance from zero' },
    detalle: { es: 'Cuenta los saltos hasta el 0', en: 'Count the jumps to 0' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El <strong>valor absoluto</strong> de un número es su <strong>distancia al 0</strong>. Se escribe con dos barras: <strong>|−6| = 6</strong>.</p>
        <p>Cuenta cuántos saltos hay desde el número hasta el 0. Una distancia es siempre un número positivo (o 0).</p>`,
      en: `<h2>How it works</h2>
        <p>The <strong>absolute value</strong> of a number is its <strong>distance from 0</strong>. It is written with two bars: <strong>|−6| = 6</strong>.</p>
        <p>Count how many jumps there are from the number to 0. A distance is always a positive number (or 0).</p>`,
    },
    pregunta: { es: 'Cuenta los saltos desde el punto hasta el 0 y escribe el valor absoluto.', en: 'Count the jumps from the point to 0 and write the absolute value.' },
    campo: { es: 'Valor absoluto', en: 'Absolute value' },
    bien: {
      es: n => `${n === 0 ? 'El 0 está en el 0: no hay que saltar' : `De ${fmt(n)} al 0 hay ${unidades(Math.abs(n), true)}`}: <span class="cuenta">|${fmt(n)}| = ${Math.abs(n)}</span>`,
      en: n => `${n === 0 ? '0 is at 0: there is no jump' : `From ${fmt(n)} to 0 there are ${unidades(Math.abs(n), false)}`}: <span class="cuenta">|${fmt(n)}| = ${Math.abs(n)}</span>`,
    },
    negativo: {
      es: n => `Has puesto un número negativo, pero una distancia no puede ser negativa`,
      en: n => `You wrote a negative number, but a distance cannot be negative`,
    },
    otro: { es: r => `Has escrito ${fmt(r)}`, en: r => `You wrote ${fmt(r)}` },
    salto: { es: 'saltos hasta el 0', en: 'jumps to 0' },
  },
  ej3: {
    nombre: { es: 'Opuesto y valor absoluto', en: 'Opposite and absolute value' },
    detalle: { es: 'Los dos a la vez, para un mismo número', en: 'Both at once, for the same number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para un mismo número, rellena los dos huecos: su <strong>opuesto</strong> y su <strong>valor absoluto</strong>.</p>
        <p>Por ejemplo, de <strong>6</strong>: el opuesto es −6 y el valor absoluto es 6. De <strong>−6</strong>: el opuesto es 6 y el valor absoluto es 6.</p>`,
      en: `<h2>How it works</h2>
        <p>For one number, fill in both blanks: its <strong>opposite</strong> and its <strong>absolute value</strong>.</p>
        <p>For example, for <strong>6</strong>: the opposite is −6 and the absolute value is 6. For <strong>−6</strong>: the opposite is 6 and the absolute value is 6.</p>`,
    },
    opuestoDe: { es: n => `El opuesto de ${fmt(n)} es`, en: n => `The opposite of ${fmt(n)} is` },
    absolutoDe: { es: n => `El valor absoluto de ${fmt(n)} es`, en: n => `The absolute value of ${fmt(n)} is` },
    hueco: { es: 'Número', en: 'Number' },
    bien: {
      es: n => `<span class="cuenta">Opuesto de ${fmt(n)} = ${fmt(-n)}</span> <span class="cuenta">|${fmt(n)}| = ${Math.abs(n)}</span>`,
      en: n => `<span class="cuenta">Opposite of ${fmt(n)} = ${fmt(-n)}</span> <span class="cuenta">|${fmt(n)}| = ${Math.abs(n)}</span>`,
    },
    explica: {
      es: n => (n < 0
        ? `${fmt(n)} está a ${unidades(-n, true)} del 0, a la izquierda; su opuesto, ${fmt(-n)}, a la derecha. Con un número negativo, el opuesto y el valor absoluto dan lo mismo`
        : `${fmt(n)} está a ${unidades(n, true)} del 0, a la derecha; su opuesto, ${fmt(-n)}, a la izquierda. El valor absoluto es la distancia (${n}); el opuesto, el punto del otro lado (${fmt(-n)})`),
      en: n => (n < 0
        ? `${fmt(n)} is ${unidades(-n, false)} from 0, on the left; its opposite, ${fmt(-n)}, is on the right. With a negative number, the opposite and the absolute value are the same`
        : `${fmt(n)} is ${unidades(n, false)} from 0, on the right; its opposite, ${fmt(-n)}, is on the left. The absolute value is the distance (${n}); the opposite is the point on the other side (${fmt(-n)})`),
    },
    sinCambiar: { es: n => `El opuesto de ${fmt(n)} no es ${fmt(n)}: está al otro lado del 0`, en: n => `The opposite of ${fmt(n)} is not ${fmt(n)}: it is on the other side of 0` },
    delOpuesto: { es: n => `El opuesto de un número negativo (${fmt(n)}) es positivo`, en: n => `The opposite of a negative number (${fmt(n)}) is positive` },
    negativo: { es: 'Un valor absoluto, que es una distancia, no es negativo', en: 'An absolute value, which is a distance, is not negative' },
    comoOpuesto: { es: n => `El valor absoluto de ${fmt(n)} no es su opuesto: es su distancia al 0`, en: n => `The absolute value of ${fmt(n)} is not its opposite: it is its distance from 0` },
    recta: { es: 'Recta numérica', en: 'Number line' },
  },
  ej4: {
    nombre: { es: '¿Quiénes están a esa distancia?', en: 'Which integers are that far from zero?' },
    detalle: { es: 'Valor absoluto dado, y mayor entre dos negativos', en: 'A given absolute value, and the greater of two negatives' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Si el valor absoluto es <strong>3</strong>, hay <strong>dos</strong> enteros a esa distancia del 0: el <strong>3</strong> y el <strong>−3</strong>.</p>
        <p>Entre dos negativos, <strong>es mayor el de menor valor absoluto</strong>: −2 &gt; −5, porque 2 &lt; 5 (−2 está más cerca del 0).</p>`,
      en: `<h2>How it works</h2>
        <p>If the absolute value is <strong>3</strong>, there are <strong>two</strong> integers that far from 0: <strong>3</strong> and <strong>−3</strong>.</p>
        <p>Between two negative numbers, <strong>the one with the smaller absolute value is the greater</strong>: −2 &gt; −5, because 2 &lt; 5 (−2 is closer to 0).</p>`,
    },
    marcar: {
      es: k => `Marca <strong>todos los enteros</strong> cuyo valor absoluto es ${k}.`,
      en: k => `Mark <strong>all the integers</strong> whose absolute value is ${k}.`,
    },
    comparar: {
      es: (a, b) => `¿Cuál es <strong>mayor</strong>, ${fmt(a)} o ${fmt(b)}?`,
      en: (a, b) => `Which is <strong>greater</strong>, ${fmt(a)} or ${fmt(b)}?`,
    },
    bienMarcar: {
      es: k => `Los enteros a ${unidades(k, true)} del 0 son ${fmt(-k)} y ${fmt(k)}: <span class="cuenta">|${fmt(-k)}| = ${k}</span> <span class="cuenta">|${fmt(k)}| = ${k}</span>`,
      en: k => `The integers ${unidades(k, false)} from 0 are ${fmt(-k)} and ${fmt(k)}: <span class="cuenta">|${fmt(-k)}| = ${k}</span> <span class="cuenta">|${fmt(k)}| = ${k}</span>`,
    },
    soloUno: { es: 'Falta otro: a cada lado del 0 hay uno', en: 'One is missing: there is one on each side of 0' },
    marcaMal: { es: 'Alguna marca no está a esa distancia del 0', en: 'One of the marks is not that far from 0' },
    bienComparar: {
      es: (a, b) => `${fmt(Math.max(a, b))} está más cerca del 0 (${Math.abs(Math.max(a, b))} &lt; ${Math.abs(Math.min(a, b))}): es el mayor, <span class="cuenta">${fmt(Math.max(a, b))} &gt; ${fmt(Math.min(a, b))}</span>`,
      en: (a, b) => `${fmt(Math.max(a, b))} is closer to 0 (${Math.abs(Math.max(a, b))} &lt; ${Math.abs(Math.min(a, b))}): it is the greater, <span class="cuenta">${fmt(Math.max(a, b))} &gt; ${fmt(Math.min(a, b))}</span>`,
    },
    naturales: {
      es: (a, b) => `Entre negativos no gana el de número mayor: ${Math.abs(Math.min(a, b))} es mayor que ${Math.abs(Math.max(a, b))}, pero ${fmt(Math.min(a, b))} está más a la izquierda`,
      en: (a, b) => `Between negatives the bigger number does not win: ${Math.abs(Math.min(a, b))} is greater than ${Math.abs(Math.max(a, b))}, but ${fmt(Math.min(a, b))} is further to the left`,
    },
    recta: { es: 'Recta numérica', en: 'Number line' },
  },
};
