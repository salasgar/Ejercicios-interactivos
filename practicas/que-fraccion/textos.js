// Práctica «¿Qué fracción es?»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, ¡Bien!…) están en `../_comun/textos.js` y llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 4): la fracción en pantalla con
// raya horizontal (`htmlFraccion`), nunca «3/5» con barra salvo en una frase en inglés hablado;
// producto con «·», nunca «×»; inglés sencillo; el feedback dice qué pasa con LOS NÚMEROS DE ESE
// ÍTEM; ni decimales, ni números mixtos, ni letras de variable.

import { htmlFraccion } from '../_comun/fracciones.js';

const h = (num, den) => htmlFraccion({ num, den }, { compacta: true });

const PIEZA = {
  barra: { es: 'barra', en: 'bar' },
  pizza: { es: 'pizza', en: 'pizza' },
  cuadricula: { es: 'cuadrícula', en: 'grid' },
};
const FIGURA = {
  barra: { es: 'la barra', en: 'the bar' },
  pizza: { es: 'la pizza', en: 'the pizza' },
  cuadricula: { es: 'la cuadrícula', en: 'the grid' },
};

export const TX = {
  pieza: PIEZA,
  figura: FIGURA,

  ej1: {
    nombre: { es: 'Lee la figura', en: 'Read the figure' },
    detalle: { es: 'Escribe la fracción que representa el dibujo', en: 'Write the fraction the picture shows' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una fracción cuenta <strong>partes iguales</strong>: el número de <strong>abajo</strong> dice en cuántas partes
        iguales está dividido el todo, y el de <strong>arriba</strong>, cuántas partes están sombreadas.</p>
        <p>Ejemplo: una barra de 5 partes iguales con 2 sombreadas es ${h(2, 5)}: arriba 2, abajo 5.</p>
        <p>Si hay más de una figura, <strong>cada figura</strong> tiene las mismas partes: el de abajo es el de una sola figura.</p>`,
      en: `<h2>How it works</h2>
        <p>A fraction counts <strong>equal parts</strong>: the <strong>bottom</strong> number says how many equal parts the
        whole is divided into, and the <strong>top</strong> number says how many parts are shaded (sombreadas).</p>
        <p>Example: a bar with 5 equal parts and 2 shaded is ${h(2, 5)}: 2 on top, 5 at the bottom.</p>
        <p>If there is more than one figure, <strong>each figure</strong> has the same number of parts: the bottom number is for one figure.</p>`,
    },
    instruccion: {
      es: (item) => `Escribe la fracción que está sombreada en ${item.figuras > 1 ? 'las figuras' : FIGURA[item.tipo].es}.`
        + (item.exacta ? ' <strong>Cuenta las partes y no simplifiques.</strong>' : ' Vale cualquier fracción equivalente.'),
      en: (item) => `Write the fraction that is shaded (sombreada) in ${item.figuras > 1 ? 'the figures' : FIGURA[item.tipo].en}.`
        + (item.exacta ? ' <strong>Count the parts; do not simplify.</strong>' : ' Any equivalent fraction is fine.'),
    },
    arriba: { es: 'Numerador (arriba)', en: 'Numerator (top)' },
    abajo: { es: 'Denominador (abajo)', en: 'Denominator (bottom)' },
    nombreFigura: { es: 'Figura con partes sombreadas', en: 'Figure with shaded parts' },
    correcto: {
      es: item => `Correcto: ${item.figuras > 1 ? `cada figura tiene ${item.den} partes y hay ${item.num} ${item.num === 1 ? 'sombreada' : 'sombreadas'}` : `hay ${item.den} partes y ${item.num} ${item.num === 1 ? 'sombreada' : 'sombreadas'}`}: ${h(item.num, item.den)}.`,
      en: item => `Correct: ${item.figuras > 1 ? `each figure has ${item.den} parts and ${item.num} ${item.num === 1 ? 'is' : 'are'} shaded` : `there are ${item.den} parts and ${item.num} ${item.num === 1 ? 'is' : 'are'} shaded`}: ${h(item.num, item.den)}.`,
    },
    solucion: {
      es: item => `${item.figuras > 1 ? `Cada figura tiene ${item.den} partes iguales y hay ${item.num} ${item.num === 1 ? 'sombreada' : 'sombreadas'} en total` : `La figura tiene ${item.den} partes iguales y hay ${item.num} ${item.num === 1 ? 'sombreada' : 'sombreadas'}`}: abajo ${item.den}, arriba ${item.num}, es ${h(item.num, item.den)}.`,
      en: item => `${item.figuras > 1 ? `Each figure has ${item.den} equal parts and ${item.num} ${item.num === 1 ? 'is' : 'are'} shaded in all` : `The figure has ${item.den} equal parts and ${item.num} ${item.num === 1 ? 'is' : 'are'} shaded`}: ${item.den} at the bottom, ${item.num} on top, so it is ${h(item.num, item.den)}.`,
    },
    por_que: {
      'simplificada-sin-pedirlo': {
        es: item => `Tu fracción vale lo mismo, pero aquí se pedía contar las partes sin simplificar. `,
        en: item => `Your fraction has the same value, but here you had to count the parts and not simplify. `,
      },
      'parte-entre-el-resto': {
        es: item => `Has puesto abajo las partes sin sombrear (${item.den - item.num}); abajo van todas las partes, ${item.den}. `,
        en: item => `You put the unshaded parts (${item.den - item.num}) at the bottom; the bottom number is all the parts, ${item.den}. `,
      },
      'terminos-al-reves': {
        es: item => `Has puesto los números al revés: arriba las sombreadas (${item.num}) y abajo el total de partes (${item.den}). `,
        en: item => `You wrote the numbers the wrong way round: shaded parts (${item.num}) on top and all the parts (${item.den}) at the bottom. `,
      },
      'cuenta-todas-las-partes': {
        es: item => `Has contado las partes de las dos figuras (${item.den * item.figuras}); el de abajo es el de una sola figura, ${item.den}. `,
        en: item => `You counted the parts of both figures (${item.den * item.figuras}); the bottom number is for one figure, ${item.den}. `,
      },
      'otra-fraccion': {
        es: item => `Vuelve a contar: ${item.den} partes${item.figuras > 1 ? ' en cada figura' : ''} y ${item.num} ${item.num === 1 ? 'sombreada' : 'sombreadas'}. `,
        en: item => `Count again: ${item.den} parts${item.figuras > 1 ? ' in each figure' : ''} and ${item.num} shaded. `,
      },
    },
  },

  ej2: {
    nombre: { es: 'Sombrea la fracción', en: 'Shade the fraction' },
    detalle: { es: 'Toca las partes que hay que sombrear', en: 'Tap the parts to shade' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Toca las partes que quieres sombrear (vuelve a tocar una para quitarla) y pulsa <strong>Comprobar</strong>.
        Da igual cuáles toques: lo que cuenta es <strong>cuántas</strong>.</p>
        <p>Ejemplo: ${h(3, 4)} en una barra de 8 partes. Cada cuarto son 2 partes, así que ${h(3, 4)} son 3 · 2 = 6 partes.</p>
        <p>Cuidado: la figura puede tener <strong>más partes</strong> que el denominador.</p>`,
      en: `<h2>How it works</h2>
        <p>Tap the parts you want to shade (tap again to remove one) and press <strong>Check</strong>.
        It does not matter which ones you tap: what counts is <strong>how many</strong>.</p>
        <p>Example: ${h(3, 4)} on a bar with 8 parts. Each quarter is 2 parts, so ${h(3, 4)} is 3 · 2 = 6 parts.</p>
        <p>Careful: the figure can have <strong>more parts</strong> than the denominator.</p>`,
    },
    instruccion: {
      es: item => `Sombrea ${h(item.num, item.den)} de ${FIGURA[item.tipo].es}, que tiene ${item.partes} partes iguales.`,
      en: item => `Shade ${h(item.num, item.den)} of ${FIGURA[item.tipo].en}, which has ${item.partes} equal parts.`,
    },
    nombreFigura: { es: item => `${item.partes} partes iguales`, en: item => `${item.partes} equal parts` },
    correcto: {
      es: item => (item.m === 1
        ? `Correcto: ${h(item.num, item.den)} de ${item.partes} partes son ${item.objetivo}.`
        : `Correcto: ${item.partes} : ${item.den} = ${item.m} partes por cada trozo, y ${item.num} · ${item.m} = ${item.objetivo}.`),
      en: item => (item.m === 1
        ? `Correct: ${h(item.num, item.den)} of ${item.partes} parts is ${item.objetivo}.`
        : `Correct: ${item.partes} : ${item.den} = ${item.m} parts for each share, and ${item.num} · ${item.m} = ${item.objetivo}.`),
    },
    solucion: {
      es: item => (item.m === 1
        ? `La figura tiene ${item.partes} partes, tantas como el denominador: hay que sombrear ${item.num}.`
        : `La figura tiene ${item.partes} partes y ${item.partes} : ${item.den} = ${item.m}: cada trozo son ${item.m} partes. Hay que sombrear ${item.num} · ${item.m} = ${item.objetivo} partes.`),
      en: item => (item.m === 1
        ? `The figure has ${item.partes} parts, as many as the denominator: shade ${item.num}.`
        : `The figure has ${item.partes} parts and ${item.partes} : ${item.den} = ${item.m}, so each share is ${item.m} parts. Shade ${item.num} · ${item.m} = ${item.objetivo} parts.`),
    },
    por_que: {
      'solo-el-numerador': {
        es: (item, hechas) => `Has sombreado ${hechas}, que es el numerador. Pero la figura tiene ${item.partes} partes, no ${item.den}. `,
        en: (item, hechas) => `You shaded ${hechas}, the numerator. But the figure has ${item.partes} parts, not ${item.den}. `,
      },
      'sombrea-el-resto': {
        es: (item, hechas) => `Has sombreado ${hechas}, que son las que sobran (${item.partes} − ${item.objetivo}). `,
        en: (item, hechas) => `You shaded ${hechas}, the ones left over (${item.partes} − ${item.objetivo}). `,
      },
      'otra-cantidad': {
        es: (item, hechas) => `Has sombreado ${hechas} partes y tocaban ${item.objetivo}. `,
        en: (item, hechas) => `You shaded ${hechas} parts and you needed ${item.objetivo}. `,
      },
    },
  },

  ej3: {
    nombre: { es: 'De la frase a la fracción', en: 'From words to fraction' },
    detalle: { es: 'Escribe o elige la fracción de un grupo', en: 'Write or choose the fraction of a group' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>La fracción de un grupo se escribe con <strong>los que cumplen</strong> arriba y <strong>el total del grupo</strong> abajo.</p>
        <p>Ejemplo: en una clase de 25 alumnos, 9 tienen un perro: ${h(9, 25)}. No es ${h(9, 16)} (eso compara con los que no tienen):
        abajo van <em>todos</em> los alumnos.</p>
        <p>Aquí no se simplifica: deja la fracción tal como sale de contar.</p>`,
      en: `<h2>How it works</h2>
        <p>The fraction of a group has <strong>those who do</strong> on top and <strong>the whole group</strong> at the bottom.</p>
        <p>Example: in a class of 25 students, 9 have a dog: ${h(9, 25)}. It is not ${h(9, 16)} (that compares with those who do not):
        the bottom number is <em>all</em> the students.</p>
        <p>Here we do not simplify: leave the fraction as it comes out of counting.</p>`,
    },
    escribe: { es: 'Escribe la fracción sin simplificar.', en: 'Write the fraction without simplifying.' },
    elige: { es: 'Elige la fracción.', en: 'Choose the fraction.' },
    correcto: {
      es: item => `Correcto: ${item.k} de ${item.n} es ${h(item.k, item.n)}.`,
      en: item => `Correct: ${item.k} out of ${item.n} is ${h(item.k, item.n)}.`,
    },
    solucion: {
      es: item => `Arriba, los que cumplen (${item.k}); abajo, el total del grupo (${item.n}): ${h(item.k, item.n)}.`,
      en: item => `On top, those who do (${item.k}); at the bottom, the whole group (${item.n}): ${h(item.k, item.n)}.`,
    },
    equivalente: {
      es: item => `Tu fracción vale lo mismo que ${h(item.k, item.n)}, que es la que sale de contar. `,
      en: item => `Your fraction has the same value as ${h(item.k, item.n)}, the one you get by counting. `,
    },
    por_que: {
      'parte-entre-el-resto': {
        es: item => `Has dividido entre los que no cumplen (${item.n - item.k}), pero abajo va el total, ${item.n}. `,
        en: item => `You used those who do not (${item.n - item.k}) at the bottom, but the bottom number is the whole group, ${item.n}. `,
      },
      'la-parte-que-falta': {
        es: item => `${h(item.n - item.k, item.n)} es la fracción de los que NO cumplen (${item.n - item.k} de ${item.n}). `,
        en: item => `${h(item.n - item.k, item.n)} is the fraction of those who do NOT (${item.n - item.k} out of ${item.n}). `,
      },
      'terminos-al-reves': {
        es: item => `Has puesto el total (${item.n}) arriba; arriba van los que cumplen (${item.k}). `,
        en: item => `You put the whole group (${item.n}) on top; the top number is those who do (${item.k}). `,
      },
      'otra-fraccion': {
        es: item => `Cuenta otra vez: ${item.k} de un total de ${item.n}. `,
        en: item => `Count again: ${item.k} out of a total of ${item.n}. `,
      },
    },
  },

  ej4: {
    nombre: { es: 'Léela', en: 'Say it' },
    detalle: { es: 'Cómo se lee una fracción', en: 'How a fraction is read' },
    introduccion: {
      es: `<h2>Cómo se lee</h2>
        <p>El numerador se lee como un número normal y el denominador, como un <strong>ordinal</strong> (en inglés, en plural):
        ${h(3, 5)} es <em>three fifths</em>. En español, ${h(3, 5)} es <em>tres quintos</em>.</p>
        <p>Casos especiales: ${h(1, 2)} es <em>a half</em> (un medio), ${h(1, 4)} es <em>a quarter</em> (un cuarto)
        y ${h(3, 4)} es <em>three quarters</em> (tres cuartos).</p>
        <p>Los ítems salen unas veces en inglés y otras en español.</p>`,
      en: `<h2>How to say it</h2>
        <p>The numerator is said like a normal number and the denominator like an <strong>ordinal</strong> (plural):
        ${h(3, 5)} is <em>three fifths</em>. In Spanish, ${h(3, 5)} is <em>tres quintos</em>.</p>
        <p>Special cases: ${h(1, 2)} is <em>a half</em> (un medio), ${h(1, 4)} is <em>a quarter</em> (un cuarto)
        and ${h(3, 4)} is <em>three quarters</em> (tres cuartos).</p>
        <p>Some items come in English and some in Spanish.</p>`,
    },
    instruccionLectura: {
      es: item => `Elige cómo se lee esta fracción ${item.idioma === 'en' ? 'en inglés' : 'en español'}.`,
      en: item => `Choose how this fraction is read ${item.idioma === 'en' ? 'in English' : 'in Spanish'}.`,
    },
    instruccionFraccion: {
      es: item => `Elige la fracción que se lee así ${item.idioma === 'en' ? '(en inglés)' : '(en español)'}:`,
      en: item => `Choose the fraction that is read like this ${item.idioma === 'en' ? '(in English)' : '(in Spanish)'}:`,
    },
    solucion: {
      es: item => `${h(item.num, item.den)} se lee «${item.texto}».`,
      en: item => `${h(item.num, item.den)} is read “${item.texto}”.`,
    },
    por_que: {
      'lee-con-cardinales': {
        es: (item, texto) => `«${texto}» lee también el ${item.den} como un número normal; el denominador se dice como ordinal. `,
        en: (item, texto) => `“${texto}” says ${item.den} like an ordinary number; the denominator is said as an ordinal. `,
      },
      'terminos-al-reves': {
        es: (item, texto) => `Eso es otra fracción: ${h(item.den, item.num)}. En ${h(item.num, item.den)} el ${item.num} va arriba y el ${item.den} abajo. `,
        en: (item, texto) => `That is a different fraction: ${h(item.den, item.num)}. In ${h(item.num, item.den)} the ${item.num} is on top and the ${item.den} at the bottom. `,
      },
      'ordinal-en-el-numerador': {
        es: (item, texto) => `«${texto}» cambia el ordinal y el número de sitio: el numerador es el número normal. `,
        en: (item, texto) => `“${texto}” swaps the ordinal and the number: the numerator is the ordinary number. `,
      },
      'otro-denominador': {
        es: (item, texto) => `Ese es otro denominador: aquí abajo hay un ${item.den}. `,
        en: (item, texto) => `That is a different denominator: here the bottom number is ${item.den}. `,
      },
      'otro-numerador': {
        es: (item, texto) => `Ese es otro numerador: aquí arriba hay un ${item.num}. `,
        en: (item, texto) => `That is a different numerator: here the top number is ${item.num}. `,
      },
    },
  },

  comprobar: { es: 'Comprobar', en: 'Check' },
};
