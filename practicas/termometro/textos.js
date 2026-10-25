// Práctica «La recta y el termómetro»: textos propios, { es, en }. Los comunes
// (Comprobar, Siguiente, Borrar…) llegan en `api.t`. Los números se escriben con
// `fmt` (el menos es U+2212), y las expresiones, con `·`, nunca `×`.

import { fmt } from '../_comun/enteros.js';

const lado = (v, es) => (v < 0 ? (es ? 'izquierda' : 'left') : (es ? 'derecha' : 'right'));
const marcas = (n, es) => (es ? (n === 1 ? '1 marca' : `${n} marcas`) : (n === 1 ? '1 mark' : `${n} marks`));

export const TX = {
  ej1: {
    nombre: { es: 'Coloca el entero', en: 'Place the integer' },
    detalle: { es: 'Toca en la recta el número que te piden', en: 'Tap the number you are asked for on the number line' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En la recta hay una marca por cada entero, pero solo algunos números están escritos. Los números <strong>negativos</strong> están a la <strong>izquierda del 0</strong>.</p>
        <p>Por ejemplo, para colocar el <strong>−3</strong> cuentas tres marcas hacia la izquierda desde el 0 y la tocas.</p>`,
      en: `<h2>How it works</h2>
        <p>The number line has a mark for each integer, but only some numbers are written. <strong>Negative</strong> numbers are to the <strong>left of 0</strong>.</p>
        <p>For example, to place <strong>−3</strong> you count three marks to the left from 0 and tap it.</p>`,
    },
    pregunta: { es: n => `Toca el número <strong>${fmt(n)}</strong> en la recta.`, en: n => `Tap the number <strong>${fmt(n)}</strong> on the number line.` },
    bien: {
      es: (n, paso) => `${fmt(n)} está a ${Math.abs(n)} unidades a la ${lado(n, true)} del 0${paso > 1 ? ` (${marcas(Math.abs(n) / paso, true)}, de ${paso} en ${paso})` : ''}`,
      en: (n, paso) => `${fmt(n)} is ${Math.abs(n)} units to the ${lado(n, false)} of 0${paso > 1 ? ` (${marcas(Math.abs(n) / paso, false)}, going up in ${paso}s)` : ''}`,
    },
    simetrico: {
      es: (n, toque) => `Has tocado el ${fmt(toque)}, que es el simétrico: está al otro lado del 0. El ${fmt(n)} está a la ${lado(n, true)}`,
      en: (n, toque) => `You tapped ${fmt(toque)}, its opposite: it is on the other side of 0. ${fmt(n)} is to the ${lado(n, false)}`,
    },
    vecina: {
      es: (n, toque) => `Has tocado el ${fmt(toque)}, que está justo al lado. Cuenta las marcas desde el 0`,
      en: (n, toque) => `You tapped ${fmt(toque)}, right next to it. Count the marks from 0`,
    },
    otra: {
      es: (n, toque) => `Has tocado el ${fmt(toque)}. Cuenta las marcas desde el 0 hacia la ${lado(n, true)}`,
      en: (n, toque) => `You tapped ${fmt(toque)}. Count the marks from 0 towards the ${lado(n, false)}`,
    },
    recta: { es: 'Recta numérica', en: 'Number line' },
  },
  ej2: {
    nombre: { es: '¿Qué temperatura marca?', en: 'What does it show?' },
    detalle: { es: 'Lee el termómetro y escribe el número', en: 'Read the thermometer and write the number' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Mira hasta dónde llega el líquido y escribe el número de esa marca, <strong>con su signo</strong>. Por debajo del 0, la temperatura es negativa.</p>
        <p>Fíjate de cuánto en cuánto va la escala: unos termómetros van de 1 en 1, y otros de 2 en 2 o de 5 en 5. Por ejemplo, dos marcas por debajo del 0, de 5 en 5, son <strong>−10</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Look at where the liquid reaches and write the number of that mark, <strong>with its sign</strong>. Below 0, the temperature is negative.</p>
        <p>Check how the scale goes up: some thermometers go up in 1s, others in 2s or 5s. For example, two marks below 0, going up in 5s, is <strong>−10</strong>.</p>`,
    },
    contexto: {
      ciudad: { es: 'Este termómetro está en una ciudad.', en: 'This thermometer is in a city.' },
      montana: { es: 'Este termómetro está en un pueblo de montaña.', en: 'This thermometer is in a mountain village.' },
    },
    pregunta: { es: 'Escribe la temperatura que marca, en grados.', en: 'Write the temperature it shows, in degrees.' },
    escala: { es: p => `La escala va de ${p} en ${p}.`, en: p => `The scale goes up in ${p}s.` },
    campo: { es: 'Temperatura', en: 'Temperature' },
    bien: {
      es: (v, paso) => `El líquido llega a ${fmt(v)} °C: ${v === 0 ? 'justo en el 0' : `${marcas(Math.abs(v) / paso, true)} ${v < 0 ? 'por debajo' : 'por encima'} del 0${paso > 1 ? `, de ${paso} en ${paso}: <span class="cuenta">${Math.abs(v) / paso} · ${paso} = ${Math.abs(v)}</span>` : ''}`}`,
      en: (v, paso) => `The liquid reaches ${fmt(v)} °C: ${v === 0 ? 'exactly at 0' : `${marcas(Math.abs(v) / paso, false)} ${v < 0 ? 'below' : 'above'} 0${paso > 1 ? `, going up in ${paso}s: <span class="cuenta">${Math.abs(v) / paso} · ${paso} = ${Math.abs(v)}</span>` : ''}`}`,
    },
    signo: {
      es: v => `Has escrito ${fmt(-v)}, pero el líquido está ${v < 0 ? 'por debajo' : 'por encima'} del 0: es ${v < 0 ? 'negativo' : 'positivo'}`,
      en: v => `You wrote ${fmt(-v)}, but the liquid is ${v < 0 ? 'below' : 'above'} 0: it is ${v < 0 ? 'negative' : 'positive'}`,
    },
    marcas: {
      es: (v, r, paso) => `Has contado las marcas (${Math.abs(r)}), pero cada una vale ${paso}`,
      en: (v, r, paso) => `You counted the marks (${Math.abs(r)}), but each one is worth ${paso}`,
    },
    otro: { es: r => `Has escrito ${fmt(r)}`, en: r => `You wrote ${fmt(r)}` },
  },
  ej3: {
    nombre: { es: 'Mayor o menor', en: 'Greater or less' },
    detalle: { es: 'Pon < o > entre dos enteros', en: 'Put < or > between two integers' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Elige el símbolo que va entre los dos números. En la recta, <strong>el que está más a la derecha es el mayor</strong>.</p>
        <p>Por ejemplo, <strong>−5 &lt; −2</strong>, porque −5 está más a la izquierda que −2. Y <strong>0 &gt; −7</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Choose the symbol that goes between the two numbers. On the number line, <strong>the one further to the right is the greater</strong>.</p>
        <p>For example, <strong>−5 &lt; −2</strong>, because −5 is further to the left than −2. And <strong>0 &gt; −7</strong>.</p>`,
    },
    pregunta: { es: 'Elige el símbolo que falta.', en: 'Choose the missing symbol.' },
    bien: {
      es: (a, b) => `${fmt(a)} está más a la ${a < b ? 'izquierda' : 'derecha'} que ${fmt(b)}, así que <span class="cuenta">${fmt(a)} ${a < b ? '&lt;' : '&gt;'} ${fmt(b)}</span>`,
      en: (a, b) => `${fmt(a)} is further to the ${a < b ? 'left' : 'right'} than ${fmt(b)}, so <span class="cuenta">${fmt(a)} ${a < b ? '&lt;' : '&gt;'} ${fmt(b)}</span>`,
    },
    naturales: {
      es: (a, b) => `Entre negativos, el que está más cerca del 0 es el mayor: ${fmt(Math.max(a, b))} es mayor que ${fmt(Math.min(a, b))}, aunque ${Math.abs(Math.max(a, b))} sea menos que ${Math.abs(Math.min(a, b))}`,
      en: (a, b) => `Among negative numbers, the one closer to 0 is the greater: ${fmt(Math.max(a, b))} is greater than ${fmt(Math.min(a, b))}, even though ${Math.abs(Math.max(a, b))} is less than ${Math.abs(Math.min(a, b))}`,
    },
    absoluto: {
      es: (a, b) => `Un número negativo es siempre menor que uno positivo o que el 0, aunque su número sea grande: ${fmt(Math.min(a, b))} está a la izquierda de ${fmt(Math.max(a, b))}`,
      en: (a, b) => `A negative number is always less than a positive number or 0, even if its number is big: ${fmt(Math.min(a, b))} is to the left of ${fmt(Math.max(a, b))}`,
    },
    positivos: {
      es: (a, b) => `Mira la recta: ${fmt(Math.max(a, b))} es mayor que ${fmt(Math.min(a, b))}`,
      en: (a, b) => `Look at the number line: ${fmt(Math.max(a, b))} is greater than ${fmt(Math.min(a, b))}`,
    },
    recta: { es: 'Recta numérica', en: 'Number line' },
  },
  ej4: {
    nombre: { es: 'Ordena', en: 'Put in order' },
    detalle: { es: 'Ordena los números tocándolos', en: 'Put the numbers in order by tapping them' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca los números <strong>uno a uno</strong>, en el orden que te piden. Si te equivocas, pulsa «Borrar».</p>
        <p>Por ejemplo, de menor a mayor: 3, −7, 0, −2 se ordenan <strong>−7, −2, 0, 3</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the numbers <strong>one by one</strong>, in the order you are asked for. If you make a mistake, press “Delete”.</p>
        <p>For example, from least to greatest: 3, −7, 0, −2 go <strong>−7, −2, 0, 3</strong>.</p>`,
    },
    pregunta: {
      es: creciente => `Ordena los números de <strong>${creciente ? 'menor a mayor' : 'mayor a menor'}</strong>.`,
      en: creciente => `Put the numbers in order, from <strong>${creciente ? 'least to greatest' : 'greatest to least'}</strong>.`,
    },
    tuOrden: { es: 'Tu orden:', en: 'Your order:' },
    bien: { es: lista => `El orden es <span class="cuenta">${lista}</span>`, en: lista => `The order is <span class="cuenta">${lista}</span>` },
    naturales: {
      es: (a, b) => `Entre negativos, el que está más cerca del 0 es el mayor (${fmt(a)} es mayor que ${fmt(b)})`,
      en: (a, b) => `Among negative numbers, the one closer to 0 is the greater (${fmt(a)} is greater than ${fmt(b)})`,
    },
    reves: { es: 'Lo has puesto al revés', en: 'You put it the other way round' },
    suyo: { es: lista => `Has puesto ${lista}`, en: lista => `You put ${lista}` },
  },
  ej5: {
    nombre: { es: '¿Positivo, negativo o ninguno?', en: 'Positive, negative or neither?' },
    detalle: { es: 'Reparte ocho números en tres cajas', en: 'Sort eight numbers into three boxes' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca un número y después la caja donde va. Hay tres cajas: <strong>positivos</strong>, <strong>negativos</strong> y <strong>ni positivo ni negativo</strong>.</p>
        <p>Recuerda: el <strong>0</strong> no es positivo ni negativo, y <strong>+5</strong> es lo mismo que <strong>5</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap a number and then the box where it goes. There are three boxes: <strong>positive</strong>, <strong>negative</strong> and <strong>neither positive nor negative</strong>.</p>
        <p>Remember: <strong>0</strong> is neither positive nor negative, and <strong>+5</strong> is the same as <strong>5</strong>.</p>`,
    },
    pregunta: { es: 'Reparte los ocho números en las cajas.', en: 'Sort the eight numbers into the boxes.' },
    cajas: {
      positivo: { es: 'Positivos', en: 'Positive' },
      negativo: { es: 'Negativos', en: 'Negative' },
      ninguno: { es: 'Ni positivo ni negativo', en: 'Neither' },
    },
    cajaTexto: {
      positivo: { es: 'positivo', en: 'positive' },
      negativo: { es: 'negativo', en: 'negative' },
      ninguno: { es: 'ni positivo ni negativo', en: 'neither positive nor negative' },
    },
    bien: { es: 'Todos están en su caja', en: 'Every number is in its box' },
    cero: { es: 'El 0 no es positivo ni negativo', en: '0 is neither positive nor negative' },
    mas: { es: n => `+${n} es lo mismo que ${n}: es positivo`, en: n => `+${n} is the same as ${n}: it is positive` },
    otro: {
      es: (n, caja) => `${fmt(n)} es ${caja}`,
      en: (n, caja) => `${fmt(n)} is ${caja}`,
    },
    sinPoner: { es: 'Falta repartir algún número.', en: 'Some numbers are still not sorted.' },
  },
};
