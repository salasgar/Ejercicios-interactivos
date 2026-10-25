// «Las fichas de Pablo»: textos propios, siempre { es, en }. Los comunes (Comprobar, Siguiente,
// ¡Bien!…) están en `../_comun/textos.js` y llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no «factor», para la relación
// entre números; producto con «·», nunca «×»; inglés sencillo; los colores siempre en los dos
// idiomas (verde / green); y el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.

import { exp, colores, valor, indice, nFichas, quitar, juntar, comunes, montonMinimo, numeroDivisores, deNumero } from './logica.js';
import { fichaHtml, montonHtml, colorTxt, desglose, cuentaDe } from './dibujo.js';

const F = fichaHtml;
const M = montonHtml;
const cuenta = s => `<span class="cuenta">${s}</span>`;
/** El primer color de m con más de una ficha (para explicar el exponente). */
const conPotencia = m => colores(m).find(p => exp(m, p) > 1) ?? colores(m)[0];
const potencia = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);

/** Las líneas de las introducciones: tres ejemplos de la hoja de refuerzo. */
const M40 = { 2: 3, 5: 1 };
const M490 = { 2: 1, 5: 1, 7: 2 };

const LEYENDA = {
  es: `<strong>Una ficha por cada factor primo</strong>: ${F(2)} verde (green) = 2, ${F(3)} azul (blue) = 3, ${F(5)} amarilla (yellow) = 5, ${F(7)} roja (red) = 7. Para el 11, el 13… Pablo usa una ficha blanca (white) con el número escrito. El 1 es <strong>ninguna ficha</strong>.`,
  en: `<strong>One counter for each prime factor</strong>: ${F(2)} green (verde) = 2, ${F(3)} blue (azul) = 3, ${F(5)} yellow (amarilla) = 5, ${F(7)} red (roja) = 7. For 11, 13… Pablo uses a white counter (blanca) with the number written on it. The number 1 is <strong>no counters at all</strong>.`,
};

/** Cuenta de lo que quita Pablo al dividir (compartida por los ejercicios 4 y 5). */
const quedaTxt = {
  es: (a, d) => {
    const r = quitar(a, d);
    return `Pablo quita ${desglose(d, 'es')}; ${nFichas(r) ? `quedan ${desglose(r, 'es')}` : 'no queda ninguna ficha'}: ${cuenta(`${valor(a)} : ${valor(d)} = ${nFichas(r) ? `${indice(r)} = ` : ''}${valor(r)}`)}`;
  },
  en: (a, d) => {
    const r = quitar(a, d);
    return `Pablo takes away ${desglose(d, 'en')}; ${nFichas(r) ? `what is left is ${desglose(r, 'en')}` : 'no counters are left'}: ${cuenta(`${valor(a)} : ${valor(d)} = ${nFichas(r) ? `${indice(r)} = ` : ''}${valor(r)}`)}`;
  },
};

/** Por qué d no cabe en a: le falta el color c. */
const faltaTxt = {
  es: (a, d, c) => `${valor(a)} no es divisible entre ${valor(d)}: ${valor(d)} necesita ${exp(d, c)} de color ${colorTxt(c, 'es')} y ${valor(a)} ${exp(a, c) ? `solo tiene ${exp(a, c)}` : 'no tiene ninguna'}`,
  en: (a, d, c) => `${valor(a)} is not divisible by ${valor(d)}: ${valor(d)} needs ${exp(d, c)} of colour ${colorTxt(c, 'en')} and ${valor(a)} ${exp(a, c) ? `has only ${exp(a, c)}` : 'has none'}`,
};

export const TX = {
  comun: {
    tuMonton: { es: 'Tu montón', en: 'Your pile' },
    ninguna: { es: 'Ninguna ficha', en: 'No counters' },
    de: { es: 'de', en: 'of' },
  },

  // ─── 1. Lee las fichas ───────────────────────────────────────────────────────────
  lee: {
    nombre: { es: 'Lee las fichas', en: 'Read the counters' },
    detalle: { es: 'Escribe el número que forman las fichas de Pablo', en: "Write the number Pablo's counters make" },
    introduccion: {
      es: `<h2>Las fichas de Pablo</h2>
        <p>Pablo escribe cada número con fichas de parchís. ${LEYENDA.es}</p>
        <p>40 = 2<sup>3</sup> · 5: ${M(M40)} Son tres verdes (green) y una amarilla (yellow).</p>
        <p><strong>El exponente cuenta fichas del mismo color</strong>: 2<sup>3</sup> son tres verdes (green), no 2 · 3.</p>`,
      en: `<h2>Pablo's counters</h2>
        <p>Pablo writes every number with ludo counters. ${LEYENDA.en}</p>
        <p>40 = 2<sup>3</sup> · 5: ${M(M40)} That is three green (verde) and one yellow (amarilla).</p>
        <p><strong>The exponent counts counters of the same colour</strong>: 2<sup>3</sup> is three green (verde) counters, not 2 · 3.</p>`,
    },
    instruccion: { es: 'Escribe el número que forman las fichas de Pablo.', en: "Write the number Pablo's counters make." },
    campo: { es: 'Número', en: 'Number' },
    buena: {
      es: m => (nFichas(m) ? `${desglose(m, 'es')}: ${cuenta(cuentaDe(m))}` : `Ninguna ficha es el 1: ${cuenta('1')}`),
      en: m => (nFichas(m) ? `${desglose(m, 'en')}: ${cuenta(cuentaDe(m))}` : `No counters is the number 1: ${cuenta('1')}`),
    },
    nota: {
      es: (e, m) => ({
        'exponente-como-producto': `Ojo: el exponente cuenta fichas. ${potencia(conPotencia(m), exp(m, conPotencia(m)))} son ${exp(m, conPotencia(m))} fichas de color ${colorTxt(conPotencia(m), 'es')}, no ${conPotencia(m)} · ${exp(m, conPotencia(m))}.`,
        'suma-de-fichas': 'Las fichas se multiplican, no se suman.',
        'numero-de-fichas': 'Te piden el número que forman las fichas, no cuántas fichas hay.',
        'ninguna-es-cero': 'Ninguna ficha es el 1, no el 0: multiplicar por ninguna ficha no cambia el número.',
      })[e] ?? '',
      en: (e, m) => ({
        'exponente-como-producto': `Careful: the exponent counts counters. ${potencia(conPotencia(m), exp(m, conPotencia(m)))} is ${exp(m, conPotencia(m))} counters of colour ${colorTxt(conPotencia(m), 'en')}, not ${conPotencia(m)} · ${exp(m, conPotencia(m))}.`,
        'suma-de-fichas': 'Counters are multiplied, not added.',
        'numero-de-fichas': 'You are asked for the number the counters make, not how many counters there are.',
        'ninguna-es-cero': 'No counters is the number 1, not 0: multiplying by no counters does not change the number.',
      })[e] ?? '',
    },
  },

  // ─── 2. Construye el montón ──────────────────────────────────────────────────────
  construye: {
    nombre: { es: 'Construye el montón', en: 'Build the pile' },
    detalle: { es: 'Pon las fichas de cada color que hacen falta para un número', en: 'Choose the counters of each colour that a number needs' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Te doy un número y tú pones sus fichas. Con <strong>+</strong> y <strong>−</strong> eliges cuántas fichas de cada color.</p>
        <p>Por ejemplo, 24 = 2<sup>3</sup> · 3: ${M({ 2: 3, 3: 1 })} Son tres verdes (green) y una azul (blue). No son una verde (green) y una azul (blue): <strong>2<sup>3</sup> son tres fichas verdes (green)</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>I give you a number and you choose its counters. Use <strong>+</strong> and <strong>−</strong> to choose how many counters of each colour.</p>
        <p>For example, 24 = 2<sup>3</sup> · 3: ${M({ 2: 3, 3: 1 })} That is three green (verde) and one blue (azul). It is not one green (verde) and one blue (azul): <strong>2<sup>3</sup> is three green (verde) counters</strong>.</p>`,
    },
    instruccion: { es: n => `Construye el montón de fichas de <strong>${n}</strong>.`, en: n => `Build the pile of counters for <strong>${n}</strong>.` },
    cuantas: { es: p => `Fichas del ${p}`, en: p => `Counters of ${p}` },
    buena: {
      es: m => `${desglose(m, 'es')}: ${cuenta(cuentaDe(m))}.`,
      en: m => `${desglose(m, 'en')}: ${cuenta(cuentaDe(m))}.`,
    },
    tuyas: {
      es: (st, n) => `Tus fichas hacen ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}, no ${n}.`,
      en: (st, n) => `Your counters make ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}, not ${n}.`,
    },
    nota: {
      es: (e, m, color) => ({
        'potencia-como-producto': `Ojo: el exponente cuenta fichas del mismo color. ${potencia(conPotencia(m), exp(m, conPotencia(m)))} son ${exp(m, conPotencia(m))} fichas de color ${colorTxt(conPotencia(m), 'es')}, no ${conPotencia(m)} · ${exp(m, conPotencia(m))}.`,
        'faltan-fichas': `Te faltan fichas de color ${colorTxt(color, 'es')}.`,
        'sobran-fichas': `Te sobran fichas de color ${colorTxt(color, 'es')}.`,
        'monton-equivocado': `Mira el color ${colorTxt(color, 'es')}: no tiene las fichas que tocan.`,
      })[e] ?? '',
      en: (e, m, color) => ({
        'potencia-como-producto': `Careful: the exponent counts counters of the same colour. ${potencia(conPotencia(m), exp(m, conPotencia(m)))} is ${exp(m, conPotencia(m))} counters of colour ${colorTxt(conPotencia(m), 'en')}, not ${conPotencia(m)} · ${exp(m, conPotencia(m))}.`,
        'faltan-fichas': `You need more counters of colour ${colorTxt(color, 'en')}.`,
        'sobran-fichas': `You have too many counters of colour ${colorTxt(color, 'en')}.`,
        'monton-equivocado': `Look at colour ${colorTxt(color, 'en')}: it does not have the right number of counters.`,
      })[e] ?? '',
    },
  },

  // ─── 3. Multiplicar es juntar ─────────────────────────────────────────────────────
  producto: {
    nombre: { es: 'Multiplicar es juntar', en: 'Multiplying is putting the counters together' },
    detalle: { es: 'Junta las fichas de dos números para multiplicarlos', en: 'Put the counters of two numbers together to multiply them' },
    introduccion: {
      es: `<h2>Multiplicar es juntar</h2>
        <p>Para calcular 40 · 490, Pablo junta todas las fichas de 40 ${M(M40)} y todas las de 490 ${M(M490)} en un montón: ${M({ 2: 4, 5: 2, 7: 2 })}.</p>
        <p>Así, 40 · 490 = 2<sup>4</sup> · 5<sup>2</sup> · 7<sup>2</sup>. <strong>Juntar fichas es multiplicar, no sumar.</strong></p>`,
      en: `<h2>Multiplying is putting the counters together</h2>
        <p>To work out 40 · 490, Pablo puts all the counters of 40 ${M(M40)} and all the counters of 490 ${M(M490)} in one pile: ${M({ 2: 4, 5: 2, 7: 2 })}.</p>
        <p>So 40 · 490 = 2<sup>4</sup> · 5<sup>2</sup> · 7<sup>2</sup>. <strong>Putting counters together is multiplying, not adding.</strong></p>`,
    },
    instruccion: {
      es: (a, b) => `Construye el montón de <strong>${a} · ${b}</strong> juntando las fichas de los dos números, <strong>sin multiplicar</strong>.`,
      en: (a, b) => `Build the pile for <strong>${a} · ${b}</strong> by putting the counters of both numbers together, <strong>without multiplying</strong>.`,
    },
    instruccionAnadir: {
      es: (a, k) => `Pablo multiplica <strong>${a}</strong> por <strong>${k}</strong>. ¿Qué fichas añade al montón de ${a}?`,
      en: (a, k) => `Pablo multiplies <strong>${a}</strong> by <strong>${k}</strong>. Which counters does he add to the pile of ${a}?`,
    },
    buena: {
      es: (a, b) => `Se juntan las fichas de ${valor(a)} y de ${valor(b)}: ${cuenta(`${valor(a)} · ${valor(b)} = ${indice(juntar(a, b))} = ${valor(juntar(a, b))}`)}.`,
      en: (a, b) => `Put the counters of ${valor(a)} and ${valor(b)} together: ${cuenta(`${valor(a)} · ${valor(b)} = ${indice(juntar(a, b))} = ${valor(juntar(a, b))}`)}.`,
    },
    buenaAnadir: {
      es: (a, k) => `${cuenta(cuentaDe(deNumero(k)))}: Pablo añade ${desglose(deNumero(k), 'es')}. ${cuenta(`${valor(a)} · ${k} = ${indice(juntar(a, deNumero(k)))} = ${valor(a) * k}`)}.`,
      en: (a, k) => `${cuenta(cuentaDe(deNumero(k)))}: Pablo adds ${desglose(deNumero(k), 'en')}. ${cuenta(`${valor(a)} · ${k} = ${indice(juntar(a, deNumero(k)))} = ${valor(a) * k}`)}.`,
    },
    tuyas: {
      es: st => `Tu montón: ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}.`,
      en: st => `Your pile: ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}.`,
    },
    nota: {
      es: (e, a, b, color) => ({
        'monton-mayor': 'Has cogido el mayor número de fichas de cada color: eso es el m.c.m., no el producto. Para multiplicar se juntan todas las fichas.',
        'solo-comunes': 'Has cogido solo las fichas que tienen los dos: eso es el m.c.d., no el producto. Para multiplicar se juntan todas las fichas.',
        'suma-en-vez-de-producto': `Juntar fichas es multiplicar, no sumar: ${valor(a)} + ${valor(b)} = ${valor(a) + valor(b)} es otro número.`,
        'fichas-mal': `Mira el color ${colorTxt(color, 'es')}: ${valor(a)} tiene ${exp(a, color)} y ${valor(b)} tiene ${exp(b, color)}, así que juntas ${exp(a, color) + exp(b, color)}.`,
      })[e] ?? '',
      en: (e, a, b, color) => ({
        'monton-mayor': 'You took the largest number of counters of each colour: that is the LCM, not the product. To multiply, put all the counters together.',
        'solo-comunes': 'You took only the counters they both have: that is the GCD, not the product. To multiply, put all the counters together.',
        'suma-en-vez-de-producto': `Putting counters together is multiplying, not adding: ${valor(a)} + ${valor(b)} = ${valor(a) + valor(b)} is a different number.`,
        'fichas-mal': `Look at colour ${colorTxt(color, 'en')}: ${valor(a)} has ${exp(a, color)} and ${valor(b)} has ${exp(b, color)}, so you put ${exp(a, color) + exp(b, color)} together.`,
      })[e] ?? '',
    },
    notaAnadir: {
      es: e => ({ 'una-de-mas': 'Esa opción tiene una ficha de más.', 'una-de-menos': 'A esa opción le falta una ficha.', 'otro-color': 'Esa opción tiene una ficha de otro color.' })[e] ?? '',
      en: e => ({ 'una-de-mas': 'That option has one counter too many.', 'una-de-menos': 'That option has one counter too few.', 'otro-color': 'That option has a counter of another colour.' })[e] ?? '',
    },
  },

  // ─── 4. Dividir es quitar ─────────────────────────────────────────────────────────
  quita: {
    nombre: { es: 'Dividir es quitar', en: 'Dividing is taking counters away' },
    detalle: { es: 'Quita las fichas del divisor y lee lo que queda', en: 'Take away the counters of the divisor and read what is left' },
    introduccion: {
      es: `<h2>Dividir es quitar</h2>
        <p>9 000 = 2<sup>3</sup> · 3<sup>2</sup> · 5<sup>3</sup>: ${M({ 2: 3, 3: 2, 5: 3 })}.</p>
        <p>Para dividir 9 000 : 75, Pablo quita las fichas de 75 = 3 · 5<sup>2</sup>, que son una azul (blue) y dos amarillas (yellow), y lee lo que queda: ${M({ 2: 3, 3: 1, 5: 1 })}, es decir, 2<sup>3</sup> · 3 · 5 = 120.</p>
        <p>Aquí todas las divisiones son <strong>exactas</strong>: Pablo siempre tiene las fichas que quita. Lo que pasa cuando le falta alguna se ve en el ejercicio 5.</p>`,
      en: `<h2>Dividing is taking counters away</h2>
        <p>9 000 = 2<sup>3</sup> · 3<sup>2</sup> · 5<sup>3</sup>: ${M({ 2: 3, 3: 2, 5: 3 })}.</p>
        <p>To divide 9 000 : 75, Pablo takes away the counters of 75 = 3 · 5<sup>2</sup>, which are one blue (azul) and two yellow (amarillas), and reads what is left: ${M({ 2: 3, 3: 1, 5: 1 })}, that is, 2<sup>3</sup> · 3 · 5 = 120.</p>
        <p>Here every division is <strong>exact</strong>: Pablo always has the counters he takes away. What happens when one is missing comes in exercise 5.</p>`,
    },
    instruccion: {
      es: (a, d) => `Pablo divide <strong>${valor(a)} : ${valor(d)}</strong>. ${valor(a)} = ${indice(a)} y ${valor(d)} = ${indice(d)}. Toca las fichas de ${valor(a)} que Pablo quita.`,
      en: (a, d) => `Pablo divides <strong>${valor(a)} : ${valor(d)}</strong>. ${valor(a)} = ${indice(a)} and ${valor(d)} = ${indice(d)}. Tap the counters of ${valor(a)} that Pablo takes away.`,
    },
    atasca: { es: 'Pablo se atasca: no se puede', en: "Pablo gets stuck: it can't be done" },
    quienFalta: {
      es: d => `¿De qué color le falta una ficha a Pablo para quitar las de ${valor(d)}?`,
      en: d => `Which colour is Pablo missing to take away the counters of ${valor(d)}?`,
    },
    quitadas: { es: 'Quitadas', en: 'Taken away' },
    buena: { es: (a, d) => `${quedaTxt.es(a, d)}.`, en: (a, d) => `${quedaTxt.en(a, d)}.` },
    buenaNo: { es: (a, d, c) => `${faltaTxt.es(a, d, c)}.`, en: (a, d, c) => `${faltaTxt.en(a, d, c)}.` },
    nota: {
      es: (e, a, d, color) => ({
        'se-atasca-sin-motivo': `Sí se puede: ${valor(a)} tiene todas las fichas de ${valor(d)}; basta con quitarlas.`,
        'quita-de-mas': `Has quitado de más en el color ${colorTxt(color, 'es')}: ${valor(d)} solo tiene ${exp(d, color)}.`,
        'quita-de-menos': `Te faltaba quitar fichas de color ${colorTxt(color, 'es')}: ${valor(d)} tiene ${exp(d, color)}.`,
        'divide-lo-indivisible': 'No se puede quitar: cuando falta una ficha, Pablo se atasca.',
      })[e] ?? (e === 'color-equivocado' ? 'Esas no son las fichas de ese divisor.' : ''),
      en: (e, a, d, color) => ({
        'se-atasca-sin-motivo': `It can be done: ${valor(a)} has all the counters of ${valor(d)}; just take them away.`,
        'quita-de-mas': `You took away too many of colour ${colorTxt(color, 'en')}: ${valor(d)} has only ${exp(d, color)}.`,
        'quita-de-menos': `You had to take away more counters of colour ${colorTxt(color, 'en')}: ${valor(d)} has ${exp(d, color)}.`,
        'divide-lo-indivisible': 'It cannot be done: when a counter is missing, Pablo gets stuck.',
      })[e] ?? (e === 'color-equivocado' ? 'Those are not the counters of that divisor.' : ''),
    },
    notaColor: { es: 'El color que falta es otro.', en: 'The missing colour is a different one.' },
  },

  // ─── 5. La regla ───────────────────────────────────────────────────────────────────
  regla: {
    nombre: { es: 'La regla: tantas o más de cada color', en: 'The rule: as many or more of every colour' },
    detalle: { es: 'Decide si un número es divisible mirando solo las fichas', en: 'Decide if a number is divisible by looking only at the counters' },
    introduccion: {
      es: `<h2>La regla de Pablo</h2>
        <p><strong>Un número es divisible entre otro cuando tiene tantas o más fichas de cada color.</strong></p>
        <p>Por ejemplo, 1 350 = 2 · 3<sup>3</sup> · 5<sup>2</sup> ${M({ 2: 1, 3: 3, 5: 2 })}. ¿Es divisible entre 20 = 2<sup>2</sup> · 5 ${M({ 2: 2, 5: 1 })}? No: 20 necesita dos verdes (green) y 1 350 solo tiene una. Y entre 135 = 3<sup>3</sup> · 5 sí; el cociente es 2 · 5 = 10.</p>`,
      en: `<h2>Pablo's rule</h2>
        <p><strong>A number is divisible by another number when it has as many or more counters of every colour.</strong></p>
        <p>For example, 1 350 = 2 · 3<sup>3</sup> · 5<sup>2</sup> ${M({ 2: 1, 3: 3, 5: 2 })}. Is it divisible by 20 = 2<sup>2</sup> · 5 ${M({ 2: 2, 5: 1 })}? No: 20 needs two green (verde) and 1 350 has only one. And by 135 = 3<sup>3</sup> · 5 it is; the quotient is 2 · 5 = 10.</p>`,
    },
    pregunta: {
      es: (a, d) => `¿Es <strong>${valor(a)}</strong> divisible entre <strong>${valor(d)}</strong>? Mira solo las fichas.`,
      en: (a, d) => `Is <strong>${valor(a)}</strong> divisible by <strong>${valor(d)}</strong>? Look only at the counters.`,
    },
    pideCociente: {
      es: (a, d) => `Sí. ¿Cuál es el cociente ${valor(a)} : ${valor(d)} en forma de potencias?`,
      en: (a, d) => `Yes. What is the quotient ${valor(a)} : ${valor(d)} in index form?`,
    },
    // Con el número delante (Juan Luis, 25-10): «¿De qué color le falta al 36 una ficha?».
    pideColor: { es: a => `¿De qué color le falta al ${valor(a)} una ficha?`, en: a => `Which colour is ${valor(a)} missing a counter?` },
    buena: { es: (a, d) => `${quedaTxt.es(a, d)}.`, en: (a, d) => `${quedaTxt.en(a, d)}.` },
    buenaNo: { es: (a, d, c) => `${faltaTxt.es(a, d, c)}.`, en: (a, d, c) => `${faltaTxt.en(a, d, c)}.` },
    nota: {
      es: (e, a, d, c) => ({
        'cree-que-no-se-puede': `Sí es divisible: ${valor(a)} tiene tantas o más fichas de cada color que ${valor(d)}.`,
        'mayor-es-divisible': `Ser mayor no basta: ${valor(a)} es mayor que ${valor(d)}, pero ${valor(d)} necesita ${exp(d, c)} de color ${colorTxt(c, 'es')} y ${valor(a)} ${exp(a, c) ? `tiene ${exp(a, c)}` : 'no tiene ninguna'}.`,
        'mira-solo-un-color': `Hay que mirar todos los colores: en ${colorTxt(c, 'es')}, ${valor(d)} necesita ${exp(d, c)} y ${valor(a)} ${exp(a, c) ? `solo tiene ${exp(a, c)}` : 'no tiene ninguna'}. Aunque sobren fichas de otros colores, no vale.`,
        'ninguna-ficha-de-ese-color': `${valor(a)} no tiene ninguna ficha de color ${colorTxt(c, 'es')}, y ${valor(d)} necesita ${exp(d, c)}.`,
      })[e] ?? '',
      en: (e, a, d, c) => ({
        'cree-que-no-se-puede': `It is divisible: ${valor(a)} has as many or more counters of every colour than ${valor(d)}.`,
        'mayor-es-divisible': `Being bigger is not enough: ${valor(a)} is bigger than ${valor(d)}, but ${valor(d)} needs ${exp(d, c)} of colour ${colorTxt(c, 'en')} and ${valor(a)} ${exp(a, c) ? `has ${exp(a, c)}` : 'has none'}.`,
        'mira-solo-un-color': `You have to look at every colour: in ${colorTxt(c, 'en')}, ${valor(d)} needs ${exp(d, c)} and ${valor(a)} ${exp(a, c) ? `has only ${exp(a, c)}` : 'has none'}. Even if there are extra counters of other colours, it is not enough.`,
        'ninguna-ficha-de-ese-color': `${valor(a)} has no counters of colour ${colorTxt(c, 'en')}, and ${valor(d)} needs ${exp(d, c)}.`,
      })[e] ?? '',
    },
    notaCociente: {
      es: (e, a, d) => ({
        'cociente-con-el-menor': 'Has cogido el menor número de fichas de cada color: eso es lo que tienen los dos (el m.c.d.), no el cociente. El cociente es lo que queda al quitar.',
        'cociente-sin-quitar': `Eso es ${valor(a)} entero: no has quitado las fichas de ${valor(d)}.`,
        'exponente-mal': `Un exponente no coincide: a cada color de ${valor(a)} se le quitan las fichas de ${valor(d)}.`,
      })[e] ?? '',
      en: (e, a, d) => ({
        'cociente-con-el-menor': 'You took the smallest number of counters of each colour: that is what they both have (the GCD), not the quotient. The quotient is what is left after taking away.',
        'cociente-sin-quitar': `That is all of ${valor(a)}: you did not take away the counters of ${valor(d)}.`,
        'exponente-mal': `One exponent is wrong: from each colour of ${valor(a)} you take away the counters of ${valor(d)}.`,
      })[e] ?? '',
    },
    notaColor: { es: 'Le falta otro color: mira cuántas fichas de cada color tiene cada número.', en: 'A different colour is missing: look at how many counters of each colour each number has.' },
  },

  // ─── 6. Los divisores son elecciones ─────────────────────────────────────────────
  divisores: {
    nombre: { es: 'Los divisores son elecciones', en: 'Divisors are choices of counters' },
    detalle: { es: 'Cuenta los divisores y construye uno eligiendo fichas', en: 'Count the divisors and make one by choosing counters' },
    introduccion: {
      es: `<h2>Un divisor es una elección de fichas</h2>
        <p><strong>Un divisor de un número es cualquier elección de sus fichas</strong>, también ninguna. 28 = 2<sup>2</sup> · 7: ${M({ 2: 2, 7: 1 })}.</p>
        <p>De las verdes (green) puedes coger ninguna, una o dos (3 elecciones); de la roja (red), ninguna o una (2 elecciones): 3 · 2 = <strong>6 divisores</strong>. Ninguna ficha es el 1, que es divisor de todos los números.</p>
        <p>${M({})} = 1 &nbsp; ${M({ 2: 1 })} = 2 &nbsp; ${M({ 2: 2 })} = 4 &nbsp; ${M({ 7: 1 })} = 7 &nbsp; ${M({ 2: 1, 7: 1 })} = 14 &nbsp; ${M({ 2: 2, 7: 1 })} = 28</p>`,
      en: `<h2>A divisor is a choice of counters</h2>
        <p><strong>A divisor of a number is any choice of its counters</strong>, also none. 28 = 2<sup>2</sup> · 7: ${M({ 2: 2, 7: 1 })}.</p>
        <p>From the green (verde) counters you can take none, one or two (3 choices); from the red (roja) one, none or one (2 choices): 3 · 2 = <strong>6 divisors</strong>. No counters is the number 1, which is a divisor of every number.</p>
        <p>${M({})} = 1 &nbsp; ${M({ 2: 1 })} = 2 &nbsp; ${M({ 2: 2 })} = 4 &nbsp; ${M({ 7: 1 })} = 7 &nbsp; ${M({ 2: 1, 7: 1 })} = 14 &nbsp; ${M({ 2: 2, 7: 1 })} = 28</p>`,
    },
    contar: {
      es: a => `${valor(a)} = ${indice(a)}. ¿Cuántos divisores tiene ${valor(a)}?`,
      en: a => `${valor(a)} = ${indice(a)}. How many divisors does ${valor(a)} have?`,
    },
    campo: { es: 'Número de divisores', en: 'Number of divisors' },
    elegir: {
      es: (a, d) => `${valor(a)} = ${indice(a)}. Toca las fichas que forman el divisor <strong>${valor(d)}</strong>.`,
      en: (a, d) => `${valor(a)} = ${indice(a)}. Tap the counters that make the divisor <strong>${valor(d)}</strong>.`,
    },
    ninguna: {
      es: a => `${valor(a)} = ${indice(a)}. ¿Qué divisor es «no coger ninguna ficha»?`,
      en: a => `${valor(a)} = ${indice(a)}. Which divisor is “taking no counters”?`,
    },
    buenaContar: {
      es: a => `${cuenta(`${colores(a).map(p => `(${exp(a, p)} + 1)`).join(' · ')} = ${numeroDivisores(a)}`)}: de cada color se puede coger ninguna ficha o hasta todas, una elección más que el número de fichas.`,
      en: a => `${cuenta(`${colores(a).map(p => `(${exp(a, p)} + 1)`).join(' · ')} = ${numeroDivisores(a)}`)}: from each colour you can take no counters or up to all of them, one more choice than the number of counters.`,
    },
    buenaElegir: {
      es: d => (nFichas(d) ? `${desglose(d, 'es')}: ${cuenta(cuentaDe(d))}.` : 'Ninguna ficha es el divisor 1.'),
      en: d => (nFichas(d) ? `${desglose(d, 'en')}: ${cuenta(cuentaDe(d))}.` : 'No counters is the divisor 1.'),
    },
    tuyas: {
      es: (q, d) => `Tus fichas hacen ${cuenta(valor(q))}, no ${valor(d)}. Para el ${valor(d)} hacen falta ${desglose(d, 'es')}.`,
      en: (q, d) => `Your counters make ${cuenta(valor(q))}, not ${valor(d)}. For ${valor(d)} you need ${desglose(d, 'en')}.`,
    },
    buenaNinguna: {
      es: 'Ninguna ficha es el 1, que es divisor de todos los números (no es el 0).',
      en: 'No counters is the number 1, which is a divisor of every number (it is not 0).',
    },
    nota: {
      es: (e, a) => ({
        'sin-el-mas-uno': `Falta contar «ninguna»: de ${exp(a, colores(a)[0])} fichas se puede coger ninguna, una… hasta ${exp(a, colores(a)[0])}, que son ${exp(a, colores(a)[0]) + 1} elecciones.`,
        'numero-de-fichas': 'Has contado las fichas, no las elecciones: las elecciones de cada color se multiplican.',
        'suma-de-los-mas-uno': 'Las elecciones de cada color se multiplican, no se suman.',
        'ninguna-es-cero': 'Ninguna ficha es el 1, no el 0: el 0 no es divisor de ningún número.',
      })[e] ?? '',
      en: (e, a) => ({
        'sin-el-mas-uno': `You forgot “none”: from ${exp(a, colores(a)[0])} counters you can take none, one… up to ${exp(a, colores(a)[0])}, which is ${exp(a, colores(a)[0]) + 1} choices.`,
        'numero-de-fichas': 'You counted the counters, not the choices: the choices for each colour are multiplied.',
        'suma-de-los-mas-uno': 'The choices for each colour are multiplied, not added.',
        'ninguna-es-cero': 'No counters is the number 1, not 0: 0 is not a divisor of any number.',
      })[e] ?? '',
    },
  },

  // ─── 7. El m.c.d. ────────────────────────────────────────────────────────────────────
  mcd: {
    nombre: { es: 'El m.c.d.: las fichas que tienen los dos', en: 'The GCD: the counters they both have' },
    detalle: { es: 'Empareja las fichas iguales de dos números', en: 'Pair up the equal counters of two numbers' },
    introduccion: {
      es: `<h2>El m.c.d. son las fichas que tienen los dos</h2>
        <p>Pablo pone 40 ${M(M40)} junto a 490 ${M(M490)} y empareja las fichas iguales: una pareja de verdes (green) y una de amarillas (yellow) ${M({ 2: 1, 5: 1 })}.</p>
        <p>Las parejas son el m.c.d.: m.c.d.(40, 490) = 2 · 5 = 10. Si no hay ninguna pareja, el m.c.d. es 1 (no 0).</p>`,
      en: `<h2>The GCD is the counters they both have</h2>
        <p>Pablo puts 40 ${M(M40)} next to 490 ${M(M490)} and pairs up equal counters: one green (verde) pair and one yellow (amarilla) pair ${M({ 2: 1, 5: 1 })}.</p>
        <p>The pairs are the GCD: GCD(40, 490) = 2 · 5 = 10. If there is no pair at all, the GCD is 1 (not 0).</p>`,
    },
    instruccion: {
      es: (a, b) => `Toca en <strong>${valor(a)}</strong> las fichas que tienen pareja en <strong>${valor(b)}</strong>. Si no hay ninguna pareja, pulsa el botón.`,
      en: (a, b) => `Tap the counters of <strong>${valor(a)}</strong> that have a pair in <strong>${valor(b)}</strong>. If there is no pair, press the button.`,
    },
    ninguna: { es: 'Ninguna pareja', en: 'No pairs' },
    pideMcd: { es: '¿Cuál es el m.c.d.?', en: 'What is the GCD?' },
    de: { es: n => `Fichas de ${n}`, en: n => `Counters of ${n}` },
    buena: {
      es: (a, b) => {
        const g = comunes(a, b);
        if (!nFichas(g)) return `${valor(a)} = ${indice(a)} y ${valor(b)} = ${indice(b)} no tienen ninguna ficha en común: ${cuenta('m.c.d. = 1')} (ninguna ficha).`;
        const todo = nFichas(g) === nFichas(a) ? ` Todas las fichas de ${valor(a)} tienen pareja: el m.c.d. es ${valor(a)}, el pequeño.` : '';
        return `Parejas: ${desglose(g, 'es')}. ${cuenta(`m.c.d.(${valor(a)}, ${valor(b)}) = ${cuentaDe(g)}`)}.${todo}`;
      },
      en: (a, b) => {
        const g = comunes(a, b);
        if (!nFichas(g)) return `${valor(a)} = ${indice(a)} and ${valor(b)} = ${indice(b)} have no counter in common: ${cuenta('GCD = 1')} (no counters).`;
        const todo = nFichas(g) === nFichas(a) ? ` Every counter of ${valor(a)} has a pair: the GCD is ${valor(a)}, the smaller number.` : '';
        return `Pairs: ${desglose(g, 'en')}. ${cuenta(`GCD(${valor(a)}, ${valor(b)}) = ${cuentaDe(g)}`)}.${todo}`;
      },
    },
    nota: {
      es: (e, a, b, c) => ({
        'incluye-no-comunes': `${valor(b)} no tiene ninguna ficha de color ${colorTxt(c, 'es')}, así que las de ${valor(a)} no tienen pareja.`,
        'coge-el-mayor': `De color ${colorTxt(c, 'es')} solo hay pareja para tantas fichas como tiene el que menos: ${exp(a, c)} en ${valor(a)} y ${exp(b, c)} en ${valor(b)}. Coger las que más hay es el m.c.m.`,
        'olvida-pareja': 'Faltan parejas: busca en cada color las fichas que están en los dos números.',
        'mcd-cero': 'El m.c.d. no puede ser 0: si no tienen ninguna ficha en común, es 1 (el 1 es divisor de todos los números).',
        'parejas-mal': 'Revisa las parejas color por color.',
      })[e] ?? '',
      en: (e, a, b, c) => ({
        'incluye-no-comunes': `${valor(b)} has no counter of colour ${colorTxt(c, 'en')}, so those of ${valor(a)} have no pair.`,
        'coge-el-mayor': `In colour ${colorTxt(c, 'en')} you can pair only as many counters as the number with fewer: ${exp(a, c)} in ${valor(a)} and ${exp(b, c)} in ${valor(b)}. Taking the most is the LCM.`,
        'olvida-pareja': 'Some pairs are missing: look in each colour for the counters that are in both numbers.',
        'mcd-cero': 'The GCD cannot be 0: if they have no counter in common, it is 1 (the number 1 is a divisor of every number).',
        'parejas-mal': 'Check the pairs colour by colour.',
      })[e] ?? '',
    },
  },

  // ─── 8. El m.c.m. ────────────────────────────────────────────────────────────────────
  mcm: {
    nombre: { es: 'El m.c.m.: el montón más pequeño', en: 'The LCM: the smallest pile that contains both' },
    detalle: { es: 'Construye el montón más pequeño que contiene a los dos números', en: 'Build the smallest pile that contains both numbers' },
    introduccion: {
      es: `<h2>El m.c.m. es el montón más pequeño que contiene a los dos</h2>
        <p>Pablo quiere un múltiplo de 40 ${M(M40)} <strong>y</strong> de 490 ${M(M490)} con las menos fichas posibles. Para contener a 40 necesita al menos tres verdes (green) y una amarilla (yellow); para contener a 490, al menos una verde (green), una amarilla (yellow) y dos rojas (red).</p>
        <p>El montón más pequeño es ${M({ 2: 3, 5: 1, 7: 2 })}: m.c.m.(40, 490) = 2<sup>3</sup> · 5 · 7<sup>2</sup> = 1 960. De cada color, el <strong>mayor</strong> número de fichas.</p>`,
      en: `<h2>The LCM is the smallest pile that contains both</h2>
        <p>Pablo wants a multiple of 40 ${M(M40)} <strong>and</strong> of 490 ${M(M490)} with as few counters as possible. To contain 40 he needs at least three green (verde) and one yellow (amarilla); to contain 490, at least one green (verde), one yellow (amarilla) and two red (roja).</p>
        <p>The smallest pile is ${M({ 2: 3, 5: 1, 7: 2 })}: LCM(40, 490) = 2<sup>3</sup> · 5 · 7<sup>2</sup> = 1 960. From each colour, the <strong>largest</strong> number of counters.</p>`,
    },
    instruccion: {
      es: (a, b) => `Construye el montón más pequeño que contiene a <strong>${valor(a)}</strong> y a <strong>${valor(b)}</strong>.`,
      en: (a, b) => `Build the smallest pile that contains <strong>${valor(a)}</strong> and <strong>${valor(b)}</strong>.`,
    },
    buena: {
      es: (a, b) => `De cada color, el mayor número de fichas: ${cuenta(`m.c.m.(${valor(a)}, ${valor(b)}) = ${indice(montonMinimo(a, b))} = ${valor(montonMinimo(a, b))}`)}. Comprueba: ${cuenta(`${valor(montonMinimo(a, b))} = ${valor(a)} · ${valor(montonMinimo(a, b)) / valor(a)} = ${valor(b)} · ${valor(montonMinimo(a, b)) / valor(b)}`)}.`,
      en: (a, b) => `From each colour, the largest number of counters: ${cuenta(`LCM(${valor(a)}, ${valor(b)}) = ${indice(montonMinimo(a, b))} = ${valor(montonMinimo(a, b))}`)}. Check: ${cuenta(`${valor(montonMinimo(a, b))} = ${valor(a)} · ${valor(montonMinimo(a, b)) / valor(a)} = ${valor(b)} · ${valor(montonMinimo(a, b)) / valor(b)}`)}.`,
    },
    tuyas: {
      es: st => `Tu montón: ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}.`,
      en: st => `Your pile: ${cuenta(nFichas(st) ? `${indice(st)} = ${valor(st)}` : '1')}.`,
    },
    nota: {
      es: (e, a, b, c) => ({
        'solo-comunes': `Eso es el m.c.d. (${valor(comunes(a, b))}): ${valor(comunes(a, b))} no puede contener a ${Math.max(valor(a), valor(b))}. El montón tiene que contener las fichas de los dos.`,
        'junta-todo': `Eso es el producto ${valor(a)} · ${valor(b)}: sobran fichas. Si los dos tienen fichas del mismo color no hay que repetirlas, se coge el montón mayor.`,
        'menor-exponente': 'Para cada color hay que coger el mayor número de fichas, no el menor.',
        'falta-color': `Falta el color ${colorTxt(c, 'es')}: solo lo tiene uno de los dos, pero el montón también tiene que contenerlo.`,
        'fichas-mal': `Revisa el color ${colorTxt(c, 'es')}: hacen falta ${exp(montonMinimo(a, b), c)}.`,
      })[e] ?? '',
      en: (e, a, b, c) => ({
        'solo-comunes': `That is the GCD (${valor(comunes(a, b))}): ${valor(comunes(a, b))} cannot contain ${Math.max(valor(a), valor(b))}. The pile has to contain the counters of both numbers.`,
        'junta-todo': `That is the product ${valor(a)} · ${valor(b)}: there are too many counters. If both have counters of the same colour, you do not repeat them; you take the larger pile.`,
        'menor-exponente': 'For each colour you have to take the largest number of counters, not the smallest.',
        'falta-color': `Colour ${colorTxt(c, 'en')} is missing: only one of the two has it, but the pile has to contain it too.`,
        'fichas-mal': `Check colour ${colorTxt(c, 'en')}: you need ${exp(montonMinimo(a, b), c)}.`,
      })[e] ?? '',
    },
  },
};

export { M as montonTxt };
