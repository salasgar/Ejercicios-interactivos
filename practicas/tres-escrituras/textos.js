// Práctica «Porcentaje, fracción y decimal»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente…) llegan a `montar` en `api.t`. Reglas: «75 %» con espacio duro en español y «75%» en inglés
// (todo porcentaje sale de `txt`), coma en español y punto en inglés, fracciones con raya, «·» y «:», nunca «×».

import { txt, escrituraComoPorcentaje, respuestaBuena, fracE, pctE, decE } from './logica.js';
import { mcd } from '../_comun/aritmetica.js';
import { htmlFraccion, fraccion } from '../_comun/fracciones.js';

const h = (num, den) => htmlFraccion(fraccion(num, den), { compacta: true });
const cf = t => `<span class="cuenta-frac">${t}</span>`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);
const fin = (idioma, t) => ` ${dos('La respuesta es', 'The answer is', idioma)} <strong>${t}</strong>.`;
const P = (p, idioma) => txt(pctE(p), idioma);
const D = (p, idioma) => txt(decE(p, 2), idioma);
const F = (p, idioma) => txt(fracE(p, 100), idioma);

export const TX = {
  campos: {
    decimal: { es: 'Decimal', en: 'Decimal' },
    porcentaje: { es: 'Porcentaje', en: 'Percentage' },
    numerador: { es: 'Numerador', en: 'Numerator' },
    denominador: { es: 'Denominador', en: 'Denominator' },
  },
  ej1: {
    nombre: { es: 'Los porcentajes fáciles', en: 'The easy percentages' },
    detalle: { es: 'El 50 %, el 25 %, el 10 %, el 20 %, el 75 % y el 1 %', en: '50%, 25%, 10%, 20%, 75% and 1%' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un porcentaje es una fracción de denominador 100: <strong>${P(75, 'es')} = ${h(75, 100)}</strong>. Se simplifica y queda ${h(3, 4)}.</p>
        <p>Hay seis que conviene saberse de memoria: ${P(50, 'es')} = ${h(1, 2)}; ${P(25, 'es')} = ${h(1, 4)}; ${P(10, 'es')} = ${h(1, 10)}; ${P(20, 'es')} = ${h(1, 5)}; ${P(75, 'es')} = ${h(3, 4)}; ${P(1, 'es')} = ${h(1, 100)}.</p>
        <p>Elige la opción correcta.</p>`,
      en: `<h2>How it works</h2>
        <p>A percentage is a fraction with denominator 100: <strong>${P(75, 'en')} = ${h(75, 100)}</strong>. Simplify it and you get ${h(3, 4)}.</p>
        <p>Six of them are worth knowing by heart: ${P(50, 'en')} = ${h(1, 2)}; ${P(25, 'en')} = ${h(1, 4)}; ${P(10, 'en')} = ${h(1, 10)}; ${P(20, 'en')} = ${h(1, 5)}; ${P(75, 'en')} = ${h(3, 4)}; ${P(1, 'en')} = ${h(1, 100)}.</p>
        <p>Choose the correct option.</p>`,
    },
    instruccion: {
      pf: { es: '¿Qué fracción es este porcentaje?', en: 'Which fraction is this percentage?' },
      fp: { es: '¿Qué porcentaje es esta fracción?', en: 'Which percentage is this fraction?' },
    },
  },
  ej2: {
    nombre: { es: 'Escríbelo de otra forma', en: 'Write it another way' },
    detalle: { es: 'Porcentaje, decimal y fracción irreducible', en: 'Percentage, decimal and irreducible fraction' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>De porcentaje a decimal se divide entre 100 (la coma se corre dos lugares a la izquierda): ${P(55, 'es')} = ${D(55, 'es')}.</p>
        <p>De decimal a porcentaje se multiplica por 100: ${D(6, 'es')} = ${P(6, 'es')}.</p>
        <p>De porcentaje a fracción: ${P(55, 'es')} = ${h(55, 100)} = ${h(11, 20)} (se simplifica del todo).</p>
        <p>Escribe la respuesta y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>From a percentage to a decimal, divide by 100 (the decimal point moves two places to the left): ${P(55, 'en')} = ${D(55, 'en')}.</p>
        <p>From a decimal to a percentage, multiply by 100: ${D(6, 'en')} = ${P(6, 'en')}.</p>
        <p>From a percentage to a fraction: ${P(55, 'en')} = ${h(55, 100)} = ${h(11, 20)} (simplify it completely).</p>
        <p>Write the answer and press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      'p-d': { es: 'Escribe este porcentaje como decimal.', en: 'Write this percentage as a decimal.' },
      'p-f': { es: 'Escribe este porcentaje como fracción irreducible.', en: 'Write this percentage as an irreducible fraction.' },
      'd-p': { es: 'Escribe este decimal como porcentaje.', en: 'Write this decimal as a percentage.' },
      'f-p': { es: 'Escribe esta fracción como porcentaje.', en: 'Write this fraction as a percentage.' },
    },
  },
  ej3: {
    nombre: { es: 'Une las tres', en: 'Match the three' },
    detalle: { es: 'A cada fracción, su decimal y su porcentaje', en: 'Match each fraction with its decimal and its percentage' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cada fracción tiene su decimal y su porcentaje: ${h(3, 4)} = ${D(75, 'es')} = ${P(75, 'es')}.</p>
        <p>Toca un hueco y luego la ficha que va en él (o toca la ficha y se coloca sola). Sobra una ficha de cada clase: es un señuelo.</p>`,
      en: `<h2>How it works</h2>
        <p>Each fraction has its decimal and its percentage: ${h(3, 4)} = ${D(75, 'en')} = ${P(75, 'en')}.</p>
        <p>Tap a slot and then the chip that goes in it (or tap a chip and it drops in by itself). One chip of each kind is left over: it is a decoy.</p>`,
    },
    instruccion: {
      es: 'Coloca en cada fracción su decimal y su porcentaje. Sobra una ficha de cada clase.',
      en: 'Put the decimal and the percentage next to each fraction. One chip of each kind is left over.',
    },
    columnas: {
      fracciones: { es: 'Fracción', en: 'Fraction' }, decimales: { es: 'Decimal', en: 'Decimal' }, porcentajes: { es: 'Porcentaje', en: 'Percentage' },
    },
    hueco: { es: 'toca aquí', en: 'tap here' },
  },
  ej4: {
    nombre: { es: 'Ordena', en: 'Put them in order' },
    detalle: { es: 'Cuatro números en escrituras distintas', en: 'Four numbers written in different ways' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para ordenar, pásalos todos a la <strong>misma escritura</strong> (lo más cómodo es el porcentaje): ${D(2, 'es')} = ${P(2, 'es')}; ${h(1, 4)} = ${P(25, 'es')}.</p>
        <p>Toca los números en el orden que piden; si te equivocas, toca uno ya colocado para quitarlo.</p>`,
      en: `<h2>How it works</h2>
        <p>To put them in order, change them all to the <strong>same form</strong> (the percentage is usually the easiest): ${D(2, 'en')} = ${P(2, 'en')}; ${h(1, 4)} = ${P(25, 'en')}.</p>
        <p>Tap the numbers in the order asked; if you make a mistake, tap one already placed to remove it.</p>`,
    },
    instruccion: {
      'menor-mayor': { es: 'Ordénalos de menor a mayor.', en: 'Put them in order from smallest to largest.' },
      'mayor-menor': { es: 'Ordénalos de mayor a menor.', en: 'Put them in order from largest to smallest.' },
    },
  },
  correcto: { es: '¡Bien!', en: 'Well done!' },
  porQue: {
    'porcentaje-al-denominador': { es: 'Has puesto el porcentaje como denominador, pero el denominador del porcentaje es 100.', en: 'You put the percentage as the denominator, but the denominator of a percentage is 100.' },
    invertida: { es: 'Has escrito la fracción al revés.', en: 'You wrote the fraction upside down.' },
    'entre-diez': { es: 'Has dividido entre 10, y hay que dividir entre 100.', en: 'You divided by 10, but you have to divide by 100.' },
    vecina: { es: 'Esa es la fracción de otro porcentaje.', en: 'That is the fraction of a different percentage.' },
    'cifras-pegadas': { es: 'Has pegado el numerador y el denominador, y no es eso.', en: 'You stuck the numerator and the denominator together, and that is not it.' },
    'denominador-como-porcentaje': { es: 'El denominador no es el porcentaje.', en: 'The denominator is not the percentage.' },
    'coma-mal': { es: 'Tienes las cifras bien, pero la coma está mal puesta.', en: 'You have the right digits, but the decimal point is in the wrong place.' },
    'decimal-con-signo': { es: 'Has escrito un decimal con el signo de porcentaje: un porcentaje es el decimal por 100.', en: 'You wrote a decimal with a percent sign: a percentage is the decimal times 100.' },
    'coma-de-mas': { es: 'Has corrido la coma tres lugares, y son dos.', en: 'You moved the decimal point three places, but it is two.' },
    'unidades-como-decimas': { es: 'Un porcentaje de una cifra son centésimas, no décimas.', en: 'A one-digit percentage is hundredths, not tenths.' },
    'numero-tal-cual': { es: 'Has dejado el número como estaba: hay que dividir entre 100.', en: 'You left the number as it was: you have to divide by 100.' },
    'por-diez': { es: 'Has multiplicado por 10, y hay que multiplicar por 100.', en: 'You multiplied by 10, but you have to multiply by 100.' },
    'sin-simplificar': { es: 'Vale lo mismo, pero se puede simplificar más: la fracción tiene que ser irreducible.', en: 'It has the same value, but it can be simplified further: the fraction must be irreducible.' },
    'otra-respuesta': { es: 'No es esa.', en: 'That is not it.' },
    'otra-pareja': { es: 'Hay fichas que no van con esa fracción.', en: 'Some chips do not go with that fraction.' },
    'orden-al-reves': { es: 'Los has ordenado al revés.', en: 'You put them in the wrong order.' },
    'sin-pasar-a-la-misma-escritura': { es: 'Pásalos todos a porcentaje antes de ordenarlos.', en: 'Change them all to percentages before ordering them.' },
  },
};

// ─── Explicaciones (también las de «No lo sé»): la regla, el paso del ítem y «La respuesta es …» ───

export function explicaFaciles(item, { idioma }) {
  const p = item.p, f = fracE(p, 100);
  if (item.sentido === 'pf') {
    const paso = f.den === 100 ? `${P(p, idioma)} = ${h(p, 100)}` : `${P(p, idioma)} = ${h(p, 100)} = ${h(f.num, f.den)}`;
    return `${dos('Un porcentaje es una fracción de denominador 100; se simplifica.', 'A percentage is a fraction with denominator 100; simplify it.', idioma)} ${cf(paso)}.${fin(idioma, h(f.num, f.den))}`;
  }
  const m = 100 / f.den;
  const paso = f.den === 100 ? `${h(f.num, f.den)} = ${P(p, idioma)}`
    : `${h(f.num, f.den)} = ${h(f.num * m, 100)} = ${P(p, idioma)}`;
  return `${dos('Lleva la fracción a denominador 100: el numerador es el porcentaje.', 'Change the fraction to denominator 100: the numerator is the percentage.', idioma)} ${cf(paso)}.${fin(idioma, P(p, idioma))}`;
}

export function explicaOtraForma(item, { idioma }) {
  const p = item.p, f = fracE(p, 100);
  const bien = txt(respuestaBuena(item), idioma);
  let regla, paso;
  if (item.tipo === 'p-d') {
    regla = dos('Se divide entre 100: la coma se corre dos lugares a la izquierda.', 'Divide by 100: the decimal point moves two places to the left.', idioma);
    paso = `${P(p, idioma)} = ${p} : 100 = ${bien}`;
  } else if (item.tipo === 'd-p') {
    regla = dos('Se multiplica por 100: la coma se corre dos lugares a la derecha.', 'Multiply by 100: the decimal point moves two places to the right.', idioma);
    paso = `${D(p, idioma)} · 100 = ${bien}`;
  } else if (item.tipo === 'p-f') {
    regla = dos('El porcentaje es una fracción de denominador 100; se simplifica del todo.', 'The percentage is a fraction with denominator 100; simplify it completely.', idioma);
    const g = mcd(p, 100);
    paso = g === 1 ? `${P(p, idioma)} = ${h(p, 100)}` : `${P(p, idioma)} = ${h(p, 100)} = ${h(f.num, f.den)}  (${dos('dividiendo entre', 'dividing by', idioma)} ${g})`;
  } else {
    const m = 100 / f.den;
    regla = dos('Lleva la fracción a denominador 100: el numerador es el porcentaje.', 'Change the fraction to denominator 100: the numerator is the percentage.', idioma);
    paso = `${h(f.num, f.den)} = ${h(f.num * m, 100)} = ${bien}`;
  }
  return `${regla} ${cf(paso)}.${fin(idioma, bien)}`;
}

export function explicaUne(item, { idioma }) {
  const filas = item.ps.map(p => `${F(p, idioma)} = ${D(p, idioma)} = ${P(p, idioma)}`);
  const regla = dos('Pasa cada fracción a denominador 100 y escribe su porcentaje y su decimal (el porcentaje entre 100).',
    'Change each fraction to denominator 100 and write its percentage and its decimal (the percentage divided by 100).', idioma);
  return `${regla}${fin(idioma, cf(filas.join('; ')))}`;
}

export function explicaOrdena(item, { idioma }) {
  const regla = dos('Pasa los cuatro a porcentaje y ordénalos.', 'Change the four to percentages and put them in order.', idioma);
  const pasos = item.numeros.map(e => (e.t === 'p' ? txt(e, idioma) : `${txt(e, idioma)} = ${txt(escrituraComoPorcentaje(e), idioma)}`));
  const orden = item.solucion.map(i => txt(item.numeros[i], idioma)).join(item.orden === 'menor-mayor' ? ' &lt; ' : ' &gt; ');
  return `${regla} ${cf(pasos.join('; '))}.${fin(idioma, cf(orden))}`;
}
