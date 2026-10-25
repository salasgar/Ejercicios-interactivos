// «Enteros en la vida real»: textos propios, siempre { es, en }. Las frases de cada
// situación se construyen con el contexto y el entero del ítem (`frase`, `fraseResultado`).
//
// Vocabulario de U3-1B-04 (to owe, to deposit, to withdraw, to rise, to fall, sea level,
// BC / AD): la palabra que decide la respuesta lleva su aclaración entre paréntesis en
// inglés. Los sótanos, siempre «el segundo sótano» en español y «basement 2» en inglés.

import { fmt } from '../_comun/enteros.js';
import { cuentaPaso } from './logica.js';

const ORDINAL = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto'];
const grados = k => ({ es: `${k} ${k === 1 ? 'grado' : 'grados'}`, en: `${k} ${k === 1 ? 'degree' : 'degrees'}` });
const plantas = k => ({ es: `${k} ${k === 1 ? 'planta' : 'plantas'}`, en: `${k} ${k === 1 ? 'floor' : 'floors'}` });

export const NOMBRE_CONTEXTO = {
  temperatura: { es: 'la temperatura', en: 'temperature' },
  planta: { es: 'el ascensor', en: 'the lift' },
  saldo: { es: 'el dinero', en: 'money' },
  mar: { es: 'el nivel del mar', en: 'sea level' },
  buceo: { es: 'el mar', en: 'the sea' },
  anios: { es: 'los años', en: 'years' },
};

/** La frase de una situación (ejercicios 1 y 2): { es, en } por contexto, función del entero. */
export const FRASES = {
  temperatura: {
    es: n => (n < 0 ? `Hace ${grados(-n).es} bajo cero` : n > 0 ? `Hace ${grados(n).es} sobre cero` : 'Hace 0 grados'),
    en: n => (n < 0 ? `It is ${grados(-n).en} below zero (bajo cero)` : n > 0 ? `It is ${grados(n).en} above zero` : 'It is 0 degrees'),
  },
  planta: {
    es: n => (n < 0 ? `El ascensor está en el ${ORDINAL[-n]} sótano` : n > 0 ? `El ascensor está en la planta ${n}` : 'El ascensor está en la planta baja'),
    en: n => (n < 0 ? `The lift is in basement ${-n} (sótano ${-n})` : n > 0 ? `The lift is on floor ${n}` : 'The lift is on the ground floor (planta baja)'),
  },
  saldo: {
    es: n => (n < 0 ? `Debo ${-n} € a mi amigo` : `Tengo ${n} € en la hucha`),
    en: n => (n < 0 ? `I owe (debo) €${-n} to my friend` : `I have €${n} in my piggy bank`),
  },
  mar: {
    es: n => (n < 0 ? `Un lugar está a ${-n} m bajo el nivel del mar` : `Un lugar está a ${n} m sobre el nivel del mar`),
    en: n => (n < 0 ? `A place is ${-n} m below sea level (nivel del mar)` : `A place is ${n} m above sea level (nivel del mar)`),
  },
  buceo: {
    es: n => (n < 0 ? `Un buceador está a ${-n} m bajo el agua` : `Una gaviota vuela a ${n} m sobre el agua`),
    en: n => (n < 0 ? `A diver is ${-n} m under the water` : `A seagull flies ${n} m above the water`),
  },
  anios: {
    es: n => (n < 0 ? `Ocurrió en el año ${-n} a. C.` : `Ocurrió en el año ${n} d. C.`),
    en: n => (n < 0 ? `It happened in the year ${-n} BC (a. C.)` : `It happened in the year ${n} AD (d. C.)`),
  },
};

/** La frase de una situación en un idioma. */
export const frase = (ctx, n, idioma) => FRASES[ctx][idioma](n);

/** El resultado del ejercicio 3 dicho con una frase: «Ahora hace 2 grados» o «Ahora hace 2 grados bajo cero». Nunca 0. */
export const FRASES_RESULTADO = {
  temperatura: {
    es: r => (r < 0 ? `Ahora hace ${grados(-r).es} bajo cero` : `Ahora hace ${grados(r).es}`),
    en: r => (r < 0 ? `Now it is ${grados(-r).en} below zero (bajo cero)` : `Now it is ${grados(r).en}`),
  },
  planta: {
    es: r => (r < 0 ? `El ascensor está en el ${ORDINAL[-r]} sótano` : `El ascensor está en la planta ${r}`),
    en: r => (r < 0 ? `The lift is in basement ${-r} (sótano ${-r})` : `The lift is on floor ${r}`),
  },
  saldo: {
    es: r => (r < 0 ? `Ahora debes ${-r} € al banco` : `Ahora tienes ${r} € en la cuenta`),
    en: r => (r < 0 ? `Now you owe (debes) €${-r} to the bank` : `Now you have €${r} in the account`),
  },
};
export const fraseResultado = (ctx, r, idioma) => FRASES_RESULTADO[ctx][idioma](r);

/** El enunciado del ejercicio 3: la situación de partida y qué cambia. */
export const ENUNCIADO_PASO = {
  temperatura: {
    es: ({ s, dir, m }) => `Por la mañana ${frase('temperatura', s, 'es').toLowerCase()}. Durante el día la temperatura ${dir > 0 ? 'sube' : 'baja'} ${grados(m).es}. ¿Qué temperatura hace ahora?`,
    en: ({ s, dir, m }) => `In the morning ${frase('temperatura', s, 'en').replace(/^It is/, 'it is')}. During the day the temperature ${dir > 0 ? 'rises (sube)' : 'falls (baja)'} ${grados(m).en}. What is the temperature now?`,
  },
  planta: {
    es: ({ s, dir, m }) => `${frase('planta', s, 'es')}. ${dir > 0 ? 'Sube' : 'Baja'} ${plantas(m).es}. ¿Dónde está ahora?`,
    en: ({ s, dir, m }) => `${frase('planta', s, 'en')}. It goes ${dir > 0 ? 'up (sube)' : 'down (baja)'} ${plantas(m).en}. Where is it now?`,
  },
  saldo: {
    es: ({ s, dir, m }) => `${s < 0 ? `Debes ${-s} € al banco` : `Tu cuenta tiene ${s} €`}. ${dir > 0 ? `Ingresas ${m} €` : `Sacas ${m} €`}. ¿Cómo queda tu cuenta?`,
    en: ({ s, dir, m }) => `${s < 0 ? `You owe (debes) €${-s} to the bank` : `Your account has €${s}`}. ${dir > 0 ? `You deposit (ingresas) €${m}` : `You withdraw (sacas) €${m}`}. How is your account now?`,
  },
};

/** El botón que enseña el salto en la recta o el termómetro. */
export const BOTON_SALTO = {
  temperatura: {
    es: ({ dir, m }) => `${dir > 0 ? '▲ Sube' : '▼ Baja'} ${grados(m).es}`,
    en: ({ dir, m }) => `${dir > 0 ? '▲ Rises (sube)' : '▼ Falls (baja)'} ${grados(m).en}`,
  },
  planta: {
    es: ({ dir, m }) => `${dir > 0 ? '▲ Sube' : '▼ Baja'} ${plantas(m).es}`,
    en: ({ dir, m }) => `${dir > 0 ? '▲ Goes up (sube)' : '▼ Goes down (baja)'} ${plantas(m).en}`,
  },
  saldo: {
    es: ({ dir, m }) => `${dir > 0 ? '▲ Ingresas' : '▼ Sacas'} ${m} €`,
    en: ({ dir, m }) => `${dir > 0 ? '▲ Deposit (ingresas)' : '▼ Withdraw (sacas)'} €${m}`,
  },
};

/** Palabra clave de cada contexto para explicar el signo (ejercicio 1). */
const CLAVE = {
  temperatura: { neg: { es: 'bajo cero', en: 'below zero' }, pos: { es: 'sobre cero', en: 'above zero' } },
  planta: { neg: { es: 'sótano', en: 'basement' }, pos: { es: 'planta', en: 'floor' } },
  saldo: { neg: { es: 'debo', en: 'I owe' }, pos: { es: 'tengo', en: 'I have' } },
  mar: { neg: { es: 'bajo el nivel del mar', en: 'below sea level' }, pos: { es: 'sobre el nivel del mar', en: 'above sea level' } },
  buceo: { neg: { es: 'bajo el agua', en: 'under the water' }, pos: { es: 'sobre el agua', en: 'above the water' } },
  anios: { neg: { es: 'a. C.', en: 'BC' }, pos: { es: 'd. C.', en: 'AD' } },
};

const tipo = n => (n < 0 ? 'neg' : 'pos');
const lado = (n, idioma) => (idioma === 'es' ? (n < 0 ? 'por debajo de cero' : 'por encima de cero') : (n < 0 ? 'below zero' : 'above zero'));

export const TX = {
  entero: {
    nombre: { es: '¿Qué entero es?', en: 'Which integer is it?' },
    detalle: { es: 'Escribe con un entero lo que pasa', en: 'Write what happens as an integer' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lees una situación y escribes el <strong>entero</strong> que le corresponde. Lo que queda <strong>por debajo de cero</strong> (bajo cero, un sótano, una deuda, bajo el nivel del mar, antes de Cristo) es <strong>negativo</strong>.</p>
        <p>Por ejemplo: <strong>«El ascensor está en el segundo sótano» es −2</strong>. Con el botón <strong>+/−</strong> pones el signo menos.</p>`,
      en: `<h2>How it works</h2>
        <p>You read a situation and write the <strong>integer</strong> that goes with it. What is <strong>below zero</strong> (below zero, a basement, a debt, below sea level, before Christ) is <strong>negative</strong>.</p>
        <p>For example: <strong>“The lift is in basement 2” is −2</strong>. Use the <strong>+/−</strong> button to write the minus sign.</p>`,
    },
    instruccion: { es: 'Escribe el entero de esta situación.', en: 'Write the integer for this situation.' },
    nombre_campo: { es: 'Entero', en: 'Integer' },
    razon: {
      es: (ctx, n) => (n === 0
        ? `El 0 es el punto de partida: no es positivo ni negativo. La respuesta es <span class="cuenta">0</span>.`
        : `«${CLAVE[ctx][tipo(n)].es}» es ${lado(n, 'es')}: ${n < 0 ? 'negativo' : 'positivo'}. La respuesta es <span class="cuenta">${fmt(n)}</span>.`),
      en: (ctx, n) => (n === 0
        ? `0 is the starting point: it is neither positive nor negative. The answer is <span class="cuenta">0</span>.`
        : `“${CLAVE[ctx][tipo(n)].en}” is ${lado(n, 'en')}: ${n < 0 ? 'negative' : 'positive'}. The answer is <span class="cuenta">${fmt(n)}</span>.`),
    },
    contrario: {
      es: (n, v) => `Has escrito ${fmt(v)}: es el signo contrario.`,
      en: (n, v) => `You wrote ${fmt(v)}: that is the opposite sign.`,
    },
    escribio: { es: v => `Has escrito ${fmt(v)}.`, en: v => `You wrote ${fmt(v)}.` },
  },
  situacion: {
    nombre: { es: '¿Qué situación es?', en: 'Which situation is it?' },
    detalle: { es: 'Elige la frase que dice lo mismo que el entero', en: 'Choose the sentence that says the same as the integer' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Te damos un <strong>entero</strong> y un tema. Elige la frase de <strong>ese tema</strong> que dice lo mismo.</p>
        <p>Por ejemplo, con <strong>−4</strong> y la temperatura, la frase es <strong>«Hace 4 grados bajo cero»</strong>; «Hace 4 grados sobre cero» es <strong>4</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>We give you an <strong>integer</strong> and a topic. Choose the sentence about <strong>that topic</strong> that says the same.</p>
        <p>For example, with <strong>−4</strong> and temperature, the sentence is <strong>“It is 4 degrees below zero (bajo cero)”</strong>; “It is 4 degrees above zero” is <strong>4</strong>.</p>`,
    },
    pregunta: {
      es: (ctx, n) => `Tema: <strong>${NOMBRE_CONTEXTO[ctx].es}</strong>. ¿Qué frase se escribe con este entero?`,
      en: (ctx, n) => `Topic: <strong>${NOMBRE_CONTEXTO[ctx].en}</strong>. Which sentence is written with this integer?`,
    },
    bien: {
      es: (ctx, n) => `«${frase(ctx, n, 'es')}»: ${CLAVE[ctx][tipo(n)].es} es ${lado(n, 'es')}, así que es <span class="cuenta">${fmt(n)}</span>.`,
      en: (ctx, n) => `“${frase(ctx, n, 'en')}”: ${CLAVE[ctx][tipo(n)].en} is ${lado(n, 'en')}, so it is <span class="cuenta">${fmt(n)}</span>.`,
    },
    contrario: {
      es: (ctx, n, v) => `«${frase(ctx, v, 'es')}» es <span class="cuenta">${fmt(v)}</span>, el signo contrario. Con ${fmt(n)} la frase es «${frase(ctx, n, 'es')}».`,
      en: (ctx, n, v) => `“${frase(ctx, v, 'en')}” is <span class="cuenta">${fmt(v)}</span>, the opposite sign. With ${fmt(n)} the sentence is “${frase(ctx, n, 'en')}”.`,
    },
    otro_tema: {
      es: (ctx, n, otro, v) => `«${frase(otro, v, 'es')}» habla de ${NOMBRE_CONTEXTO[otro].es}, no de ${NOMBRE_CONTEXTO[ctx].es}. Con ${fmt(n)} la frase de ${NOMBRE_CONTEXTO[ctx].es} es «${frase(ctx, n, 'es')}».`,
      en: (ctx, n, otro, v) => `“${frase(otro, v, 'en')}” is about ${NOMBRE_CONTEXTO[otro].en}, not ${NOMBRE_CONTEXTO[ctx].en}. With ${fmt(n)} the sentence about ${NOMBRE_CONTEXTO[ctx].en} is “${frase(ctx, n, 'en')}”.`,
    },
  },
  paso: {
    nombre: { es: 'Un paso', en: 'One step' },
    detalle: { es: 'Un problema de un paso, con la recta o el termómetro', en: 'A one-step problem, with the number line or the thermometer' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lees el problema, tocas el botón para ver el <strong>salto</strong> y escribes el <strong>resultado</strong>. Después eliges la frase que lo dice bien.</p>
        <p>Por ejemplo: hace 3 grados bajo cero y la temperatura sube 5 grados: <strong>−3 + 5 = 2</strong>, y la frase es <strong>«Ahora hace 2 grados»</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>You read the problem, tap the button to see the <strong>jump</strong> and write the <strong>result</strong>. Then you choose the sentence that says it right.</p>
        <p>For example: it is 3 degrees below zero and the temperature rises 5 degrees: <strong>−3 + 5 = 2</strong>, and the sentence is <strong>“Now it is 2 degrees”</strong>.</p>`,
    },
    instruccion: { es: 'Mira el salto, escribe el resultado y elige la frase.', en: 'Look at the jump, write the result and choose the sentence.' },
    frase_pregunta: { es: '¿Qué frase dice el resultado?', en: 'Which sentence says the result?' },
    nombre_campo: { es: 'Resultado', en: 'Result' },
    recta: { es: 'Recta numérica', en: 'Number line' },
    termometro: { es: 'Termómetro', en: 'Thermometer' },
    bien: {
      es: it => `<span class="cuenta">${cuentaPaso(it)} = ${fmt(it.r)}</span>.`,
      en: it => `<span class="cuenta">${cuentaPaso(it)} = ${fmt(it.r)}</span>.`,
    },
    fallo: {
      'regla-signos-en-suma': {
        es: (it, a, b) => `Los dos movimientos van hacia el mismo lado: se suman, ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}, y el signo se queda.`,
        en: (it, a, b) => `Both moves go the same way: they add up, ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}, and the sign stays.`,
      },
      'suma-valores-absolutos': {
        es: (it, a, b) => `Un movimiento va hacia arriba y el otro hacia abajo: se restan, ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(it.r)}, no se suman.`,
        en: (it, a, b) => `One move goes up and the other goes down: they are subtracted, ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(it.r)}, not added.`,
      },
      'olvida-el-signo': {
        es: it => `El resultado queda por debajo de cero: lleva el signo menos, ${fmt(it.r)}.`,
        en: it => `The result is below zero: it has a minus sign, ${fmt(it.r)}.`,
      },
      'signo-del-primero': {
        es: (it, a, b) => `El signo del resultado es el del número que más se mueve (${fmt(Math.abs(a) > Math.abs(b) ? a : b)}), no el del primero.`,
        en: (it, a, b) => `The sign of the result is the sign of the number that moves more (${fmt(Math.abs(a) > Math.abs(b) ? a : b)}), not the sign of the first one.`,
      },
      'signo-cambiado': {
        es: it => `El resultado queda ${lado(it.r, 'es')}: ${fmt(it.r)}, no ${fmt(-it.r)}.`,
        en: it => `The result is ${lado(it.r, 'en')}: ${fmt(it.r)}, not ${fmt(-it.r)}.`,
      },
      'otro-error': {
        es: () => '',
        en: () => '',
      },
    },
    frase_mal: {
      es: (it, ctx) => `El resultado es ${fmt(it.r)}, y se dice «${fraseResultado(ctx, it.r, 'es')}».`,
      en: (it, ctx) => `The result is ${fmt(it.r)}, and we say “${fraseResultado(ctx, it.r, 'en')}”.`,
    },
  },
};
