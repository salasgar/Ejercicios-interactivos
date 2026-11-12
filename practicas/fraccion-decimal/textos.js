// Práctica «De fracción a decimal y vuelta»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, Sí, No…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 5): la coma en español y el punto en
// inglés (todo número sale de `aTexto(d, idioma)`); la fracción con raya (`htmlFraccion`); la división
// con «:» también en inglés; periódicos con puntos suspensivos, sin arco; sin porcentajes, letras,
// mixtos ni «×»; el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.

import { htmlFraccion } from '../_comun/fracciones.js';
import { aTexto } from '../_comun/decimales.js';
import { mcd } from '../_comun/aritmetica.js';
import { D, Fr, decimalDe, primerasCifras } from './logica.js';

const h = f => htmlFraccion({ num: f.num, den: f.den }, { compacta: true });
const n = (d, idioma) => aTexto(D(d), idioma);
/** Una cuenta corta que no se parte. */
const c = t => `<span class="cuenta">${t}</span>`;
/** Una cuenta con fracciones dentro. */
const cf = t => `<span class="cuenta-frac">${t}</span>`;
const SIGNO = { '<': '&lt;', '=': '=', '>': '&gt;' };
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });

/** La división de una fracción, con su resultado: «3 : 4 = 0,75» o «5 : 6 = 0,833…». */
export const divisionDe = (f, idioma) => {
  const exacto = decimalDe(f);
  const resultado = exacto ? n(exacto, idioma) : `${n(primerasCifras(f), idioma)}…`;
  return c(`${f.num} : ${f.den} = ${resultado}`);
};
/** El decimal de la fracción tal como se enseña (exacto, o con «…» si es periódico). */
const valorDe = (f, idioma) => (decimalDe(f) ? n(decimalDe(f), idioma) : `${n(primerasCifras(f), idioma)}…`);
/** 0,75 = 75/100 = 3/4 (o 0,3 = 3/10 si ya es irreducible). */
const cadenaDecimal = (item, idioma) => {
  const x = D(item.d), grande = { num: x.m, den: 10 ** x.k }, b = item.respuesta;
  const mismo = grande.num === b.num && grande.den === b.den;
  return cf(`${n(item.d, idioma)} = ${h(grande)}${mismo ? '' : ` = ${h(b)}`}`);
};
const unidades = k => 10 ** k;

export const TX = {
  campos: {
    decimal: { es: 'Decimal', en: 'Decimal' },
    numerador: { es: 'Numerador', en: 'Numerator' },
    denominador: { es: 'Denominador', en: 'Denominator' },
  },

  // ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'De fracción a decimal', en: 'Fraction to decimal' },
    detalle: { es: 'Divide el numerador entre el denominador', en: 'Divide the numerator by the denominator' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una fracción es una división: se divide el <strong>numerador</strong> (el de arriba) entre el <strong>denominador</strong> (el de abajo).</p>
        <p>Ejemplo: ${h({ num: 3, den: 8 })} = ${c('3 : 8 = 0,375')}.</p>
        <p>A veces la división <strong>no termina nunca</strong>: ${h({ num: 1, den: 3 })} = ${c('1 : 3 = 0,333…')} (el 3 se repite siempre). Es un decimal <strong>periódico</strong>.</p>
        <p>Resuelve cada ejercicio y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>A fraction is a division: divide the <strong>numerator</strong> (the top number) by the <strong>denominator</strong> (the bottom number).</p>
        <p>Example: ${h({ num: 3, den: 8 })} = ${c('3 : 8 = 0.375')}.</p>
        <p>Sometimes the division <strong>never ends</strong>: ${h({ num: 1, den: 3 })} = ${c('1 : 3 = 0.333…')} (the 3 repeats for ever). It is a <strong>recurring</strong> decimal.</p>
        <p>Solve each exercise and press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      escribir: { es: 'Escribe esta fracción como decimal.', en: 'Write this fraction as a decimal.' },
      elegir: { es: '¿Cuál es el decimal de esta fracción?', en: 'Which decimal is this fraction?' },
      tipo: { es: 'Divide el numerador entre el denominador. ¿El decimal termina o es periódico?', en: 'Divide the numerator by the denominator. Is the decimal terminating (it ends) or recurring (it never ends)?' },
    },
    exacto: { es: 'Exacto (termina)', en: 'Terminating (it ends)' },
    periodico: { es: 'Periódico (no termina)', en: 'Recurring (never ends)' },
    correcto: bi((i, item) => {
      const cuenta = divisionDe(item.f, i);
      if (item.tipo === 'tipo') {
        return item.periodica
          ? (i === 'es' ? `${cuenta}. La división no termina nunca.` : `${cuenta}. The division never ends.`)
          : (i === 'es' ? `${cuenta}. La división termina.` : `${cuenta}. The division ends.`);
      }
      return item.tipo === 'periodico'
        ? (i === 'es' ? `${cuenta}. La división no termina nunca.` : `${cuenta}. The division never ends.`)
        : (i === 'es' ? `${cuenta}.` : `${cuenta}.`);
    }),
    solucion: bi((i, item) => (i === 'es'
      ? `Se divide el numerador entre el denominador: ${divisionDe(item.f, i)}.`
      : `Divide the numerator by the denominator: ${divisionDe(item.f, i)}.`)),
    por_que: {
      'fraccion-al-reves': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de dividir al revés (${c(`${item.f.den} : ${item.f.num}`)}). `
        : `${n(v, i)} comes from dividing the wrong way round (${c(`${item.f.den} : ${item.f.num}`)}). `)),
      'numerador-como-decimas': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} no es: has puesto el numerador y el denominador detrás de la coma. Una fracción es una división. `
        : `${n(v, i)} is not right: you put the numerator and the denominator after the decimal point. A fraction is a division. `)),
      'denominador-como-decimas': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} no es: has puesto el denominador (${item.f.den}) detrás de la coma. Una fracción es una división. `
        : `${n(v, i)} is not right: you put the denominator (${item.f.den}) after the decimal point. A fraction is a division. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'periodico-por-redondeo': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} no es ${h(item.f)}: es solo su redondeo, porque la división no termina nunca. `
        : `${n(v, i)} is not ${h(item.f)}: it is only the rounded number, because the division never ends. `)),
      'corta-el-periodico': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} no es ${h(item.f)}: has parado en la primera cifra y la división no termina nunca. `
        : `${n(v, i)} is not ${h(item.f)}: you stopped at the first digit, and the division never ends. `)),
      'periodico-por-exacto': bi((i, item) => (i === 'es'
        ? `Esa división no termina nunca: ${divisionDe(item.f, i)}. `
        : `That division never ends: ${divisionDe(item.f, i)}. `)),
      'exacto-por-periodico': bi((i, item) => (i === 'es'
        ? `Esa división termina: ${divisionDe(item.f, i)}. `
        : `That division ends: ${divisionDe(item.f, i)}. `)),
      'otra-respuesta': bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),
    },
  },

  // ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: 'De decimal a fracción', en: 'Decimal to fraction' },
    detalle: { es: 'Escríbelo como fracción irreducible', en: 'Write it as a fraction in its simplest form' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un decimal se escribe como fracción con denominador 10, 100 o 1000 (tantos ceros como cifras decimales) y después se <strong>simplifica</strong> hasta que sea irreducible.</p>
        <p>Ejemplo: ${cf(`0,6 = ${h({ num: 6, den: 10 })} = ${h({ num: 3, den: 5 })}`)}.</p>
        <p>Si el decimal es mayor que 1, la fracción es <strong>impropia</strong> (el numerador es mayor que el denominador) y se queda así: ${cf(`1,5 = ${h({ num: 15, den: 10 })} = ${h({ num: 3, den: 2 })}`)}.</p>
        <p>Resuelve cada ejercicio y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Write the decimal as a fraction with denominator 10, 100 or 1000 (as many zeros as decimal places) and then <strong>simplify</strong> it until it cannot be simplified any more.</p>
        <p>Example: ${cf(`0.6 = ${h({ num: 6, den: 10 })} = ${h({ num: 3, den: 5 })}`)}.</p>
        <p>If the decimal is greater than 1, the fraction is <strong>improper</strong> (the numerator is greater than the denominator) and it stays that way: ${cf(`1.5 = ${h({ num: 15, den: 10 })} = ${h({ num: 3, den: 2 })}`)}.</p>
        <p>Solve each exercise and press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      elegir: { es: '¿Cuál es este decimal escrito como fracción irreducible?', en: 'Which is this decimal as a fraction in its simplest form?' },
      escribir: { es: 'Escribe este decimal como fracción irreducible (la más sencilla posible).', en: 'Write this decimal as a fraction in its simplest form.' },
    },
    correcto: bi((i, item) => (i === 'es' ? `${cadenaDecimal(item, i)}.` : `${cadenaDecimal(item, i)}.`)),
    solucion: bi((i, item) => {
      const x = D(item.d), g = mcd(x.m, unidades(x.k));
      const cuando = g > 1;
      return i === 'es'
        ? `${cadenaDecimal(item, i)}: ${x.k === 1 ? 'una cifra decimal, denominador 10' : `${x.k} cifras decimales, denominador ${unidades(x.k)}`}${cuando ? ` y arriba y abajo entre ${g}` : ''}.`
        : `${cadenaDecimal(item, i)}: ${x.k === 1 ? 'one decimal place, denominator 10' : `${x.k} decimal places, denominator ${unidades(x.k)}`}${cuando ? ` and top and bottom divided by ${g}` : ''}.`;
    }),
    por_que: {
      'sin-simplificar': bi((i, item, f) => {
        const g = f ? mcd(f.num, f.den) : 1;
        return i === 'es'
          ? `${f ? h(f) : 'Esa fracción'} vale lo mismo, pero se puede simplificar: arriba y abajo entre ${g}. Se pide la irreducible. `
          : `${f ? h(f) : 'That fraction'} has the same value, but it can be simplified: top and bottom divided by ${g}. You need the simplest form. `;
      }),
      'denominador-equivocado': bi((i, item) => (i === 'es'
        ? `El denominador lleva tantos ceros como cifras decimales: ${n(item.d, i)} tiene ${D(item.d).k}, así que va entre ${unidades(D(item.d).k)}. `
        : `The denominator has as many zeros as decimal places: ${n(item.d, i)} has ${D(item.d).k}, so it goes over ${unidades(D(item.d).k)}. `)),
      'un-cero-de-mas': bi((i, item) => (i === 'es'
        ? `Cuidado con los ceros: ${n(item.d, i)} tiene ${D(item.d).k} cifra${D(item.d).k === 1 ? '' : 's'} decimal${D(item.d).k === 1 ? '' : 'es'}, así que va entre ${unidades(D(item.d).k)}, no entre ${unidades(D(item.d).k + 1)}. `
        : `Careful with the zeros: ${n(item.d, i)} has ${D(item.d).k} decimal place${D(item.d).k === 1 ? '' : 's'}, so it goes over ${unidades(D(item.d).k)}, not over ${unidades(D(item.d).k + 1)}. `)),
      'fraccion-inversa': bi((i, item, f) => {
        const menor = D(item.d).m < unidades(D(item.d).k);
        return i === 'es'
          ? `${f ? h(f) : 'Esa fracción'} está al revés: ${n(item.d, i)} es ${menor ? 'menor' : 'mayor'} que 1, así que el numerador es ${menor ? 'menor' : 'mayor'} que el denominador. `
          : `${f ? h(f) : 'That fraction'} is upside down: ${n(item.d, i)} is ${menor ? 'less' : 'greater'} than 1, so the numerator is ${menor ? 'less' : 'greater'} than the denominator. `;
      }),
      'olvida-parte-entera': bi((i, item) => (i === 'es'
        ? `${n(item.d, i)} no es solo su parte decimal: tiene también parte entera. `
        : `${n(item.d, i)} is not just its decimal part: it has a whole part too. `)),
      'otra-respuesta': bi((i, item, f) => (i === 'es'
        ? `${f ? h(f) : 'Eso'} no es ${n(item.d, i)}. `
        : `${f ? h(f) : 'That'} is not ${n(item.d, i)}. `)),
    },
  },

  // ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: 'Los que hay que saberse', en: 'Learn these by heart' },
    detalle: { es: 'Une cada fracción con su decimal', en: 'Match each fraction with its decimal' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Hay fracciones que conviene saberse de memoria, porque salen muchísimo:</p>
        <p>${cf(`${h({ num: 1, den: 2 })} = 0,5 &nbsp; ${h({ num: 1, den: 4 })} = 0,25 &nbsp; ${h({ num: 3, den: 4 })} = 0,75`)}<br>
        ${cf(`${h({ num: 1, den: 5 })} = 0,2 &nbsp; ${h({ num: 1, den: 10 })} = 0,1 &nbsp; ${h({ num: 1, den: 100 })} = 0,01`)}</p>
        <p>Toca una fracción y después su decimal para unirlos. Si te equivocas, toca la fracción otra vez para soltarla. Cuando estén las seis parejas, pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Some fractions are worth knowing by heart, because they come up all the time:</p>
        <p>${cf(`${h({ num: 1, den: 2 })} = 0.5 &nbsp; ${h({ num: 1, den: 4 })} = 0.25 &nbsp; ${h({ num: 3, den: 4 })} = 0.75`)}<br>
        ${cf(`${h({ num: 1, den: 5 })} = 0.2 &nbsp; ${h({ num: 1, den: 10 })} = 0.1 &nbsp; ${h({ num: 1, den: 100 })} = 0.01`)}</p>
        <p>Tap a fraction and then its decimal to join them. If you make a mistake, tap the fraction again to let it go. When all six pairs are made, press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Une cada fracción con su decimal.', en: 'Match each fraction with its decimal.' },
    columnas: { fracciones: { es: 'Fracción', en: 'Fraction' }, decimales: { es: 'Decimal', en: 'Decimal' } },
    correcto: { es: 'Las seis parejas están bien.', en: 'All six pairs are right.' },
    pareja: bi((i, f, buena, elegida) => (i === 'es'
      ? `${cf(`${h(f)} = ${n(buena, i)}`)} (no ${n(elegida, i)})`
      : `${cf(`${h(f)} = ${n(buena, i)}`)} (not ${n(elegida, i)})`)),
    mal: { es: 'Mal hechas: ', en: 'Wrong pairs: ' },
    por_que: {
      'denominador-como-decimas': bi((i, f, buena) => (i === 'es'
        ? `El denominador no son las cifras de detrás de la coma. Una fracción es una división: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `
        : `The denominator is not the digits after the decimal point. A fraction is a division: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `)),
      'decimas-por-centesimas': bi((i, f, buena) => (i === 'es'
        ? `Fíjate en los ceros: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `
        : `Look at the zeros: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `)),
      'otra-pareja': bi((i, f, buena) => (i === 'es'
        ? `Divide el numerador entre el denominador: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `
        : `Divide the numerator by the denominator: ${c(`${f.num} : ${f.den} = ${n(buena, i)}`)}. `)),
    },
  },

  // ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────
  ej4: {
    nombre: { es: '¿Fracción o decimal?', en: 'Fraction or decimal?' },
    detalle: { es: 'Compara una fracción con un decimal', en: 'Compare a fraction with a decimal' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para comparar una fracción con un decimal, <strong>pasa la fracción a decimal</strong> (numerador entre denominador) y compara los dos decimales.</p>
        <p>Ejemplo: ${h({ num: 3, den: 5 })} y 0,65. Como ${c('3 : 5 = 0,6')} y 0,6 &lt; 0,65, entonces ${cf(`${h({ num: 3, den: 5 })} &lt; 0,65`)}.</p>
        <p>No compares el 3 con el 65: el 3 es un numerador, no una cifra decimal.</p>
        <p>A veces son <strong>el mismo número</strong>: ${cf(`${h({ num: 1, den: 4 })} = 0,25`)}. Entonces se pone =.</p>
        <p>Elige &lt;, = o &gt; y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>To compare a fraction with a decimal, <strong>change the fraction into a decimal</strong> (numerator divided by denominator) and compare the two decimals.</p>
        <p>Example: ${h({ num: 3, den: 5 })} and 0.65. Since ${c('3 : 5 = 0.6')} and 0.6 &lt; 0.65, then ${cf(`${h({ num: 3, den: 5 })} &lt; 0.65`)}.</p>
        <p>Do not compare the 3 with the 65: the 3 is a numerator, not a decimal digit.</p>
        <p>Sometimes they are <strong>the same number</strong>: ${cf(`${h({ num: 1, den: 4 })} = 0.25`)}. Then you put =.</p>
        <p>Choose &lt;, = or &gt; and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Elige el signo que va entre los dos números.', en: 'Choose the sign that goes between the two numbers.' },
    correcto: bi((i, item) => {
      const f = h(item.f), d = n(item.d, i);
      const [izq, der] = item.orden === 'fd' ? [f, d] : [d, f];
      const cuenta = `${divisionDe(item.f, i)}`;
      return i === 'es'
        ? `${cuenta}, así que ${cf(`${izq} ${SIGNO[item.respuesta]} ${der}`)}.`
        : `${cuenta}, so ${cf(`${izq} ${SIGNO[item.respuesta]} ${der}`)}.`;
    }),
    solucion: bi((i, item) => {
      const f = h(item.f), d = n(item.d, i);
      const [izq, der] = item.orden === 'fd' ? [f, d] : [d, f];
      return i === 'es'
        ? `Se pasa la fracción a decimal: ${divisionDe(item.f, i)}. Así que ${cf(`${izq} ${SIGNO[item.respuesta]} ${der}`)}. `
        : `Change the fraction into a decimal: ${divisionDe(item.f, i)}. So ${cf(`${izq} ${SIGNO[item.respuesta]} ${der}`)}. `;
    }),
    por_que: {
      'numerador-contra-decimas': bi((i, item) => (i === 'es'
        ? `No se compara el numerador (${item.f.num}) con las cifras de detrás de la coma (${D(item.d).m}). `
        : `You cannot compare the numerator (${item.f.num}) with the digits after the decimal point (${D(item.d).m}). `)),
      'fraccion-al-reves': bi((i, item) => (i === 'es'
        ? `Has dividido al revés: se divide el numerador (${item.f.num}) entre el denominador (${item.f.den}). `
        : `You divided the wrong way round: divide the numerator (${item.f.num}) by the denominator (${item.f.den}). `)),
      'periodico-por-redondeo': bi((i, item) => (i === 'es'
        ? `${h(item.f)} no es igual a ${n(item.d, i)}: su división no termina nunca y ${n(item.d, i)} es solo un redondeo. `
        : `${h(item.f)} is not equal to ${n(item.d, i)}: its division never ends and ${n(item.d, i)} is only a rounded number. `)),
      'no-ve-que-son-iguales': bi((i, item) => (i === 'es'
        ? `Son el mismo número: ${h(item.f)} y ${n(item.d, i)} valen lo mismo. `
        : `They are the same number: ${h(item.f)} and ${n(item.d, i)} have the same value. `)),
      'otra-respuesta': bi(() => ''),
    },
  },
};

// ─── «No lo sé»: la explicación de cada ejercicio (la regla y la cuenta del ítem) ──────────────
// Reutilizan `divisionDe`, `cadenaDecimal` y las `solucion` de arriba, y acaban con la respuesta tal
// como la da por buena el ejercicio: «La respuesta es <strong>…</strong>.».

const fin = (idioma, txt) => ` ${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <strong>${txt}</strong>.`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);

/** Ejercicio 1: de fracción a decimal (escribir, elegir, ¿periódico?, ¿exacto o periódico?). */
export function explicaFraccionADecimal(item, { idioma }) {
  const regla = dos('Una fracción es una división: se divide el numerador (arriba) entre el denominador (abajo).',
    'A fraction is a division: divide the numerator (top) by the denominator (bottom).', idioma);
  const periodico = item.tipo === 'periodico' || (item.tipo === 'tipo' && item.periodica);
  const cuenta = item.tipo === 'tipo' || item.tipo === 'periodico'
    ? `${divisionDe(item.f, idioma)} ${periodico
      ? dos('La división no termina nunca: hay cifras que se repiten.', 'The division never ends: some digits repeat.', idioma)
      : dos('La división termina.', 'The division ends.', idioma)}`
    : `${divisionDe(item.f, idioma)}.`;
  const resp = item.tipo === 'tipo'
    ? (item.periodica ? dos('que es periódico (no termina)', 'that it is recurring (never ends)', idioma) : dos('que es exacto (termina)', 'that it is terminating (it ends)', idioma))
    : valorDe(item.f, idioma);
  return `${regla} ${cuenta}${fin(idioma, resp)}`;
}

/** Ejercicio 2: de decimal a fracción irreducible. */
export function explicaDecimalAFraccion(item, { idioma }) {
  const regla = dos('Se escribe con denominador 10, 100 o 1000 (tantos ceros como cifras decimales) y se simplifica hasta la irreducible.',
    'Write it with denominator 10, 100 or 1000 (as many zeros as decimal places) and simplify it until it cannot be simplified any more.', idioma);
  return `${regla} ${TX.ej2.solucion[idioma](item)}${fin(idioma, cf(h(item.respuesta)))}`;
}

/** Ejercicio 3: parejas fracción-decimal (las seis, con su división). */
export function explicaParejas(item, { idioma }) {
  const regla = dos('Cada fracción es una división: numerador entre denominador. Haz cada cuenta y une la fracción con su decimal.',
    'Each fraction is a division: numerator divided by denominator. Work out each one and match the fraction with its decimal.', idioma);
  const pares = item.fracciones.map((f, i) => `${h(f)} = ${n(item.decimales[item.solucion[i]], idioma)}`);
  const cuentas = item.fracciones.map(f => divisionDe(f, idioma)).join(' ');
  return `${regla} ${cuentas}${fin(idioma, cf(pares.join('; ')))}`;
}

/** Ejercicio 4: ¿fracción o decimal? (<, = o >). */
export function explicaFraccionODecimal(item, { idioma }) {
  const regla = dos('Se pasa la fracción a decimal (numerador entre denominador) y se comparan los dos decimales.',
    'Change the fraction into a decimal (numerator divided by denominator) and compare the two decimals.', idioma);
  const f = h(item.f), d = n(item.d, idioma);
  const [izq, der] = item.orden === 'fd' ? [f, d] : [d, f];
  return `${regla} ${divisionDe(item.f, idioma)}.${fin(idioma, cf(`${izq} ${SIGNO[item.respuesta]} ${der}`))}`;
}
