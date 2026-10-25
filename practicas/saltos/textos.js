// Textos de «Sumas y restas con saltos» (PU2, tarea 83). Cada idioma tiene las mismas
// claves: `txt('es')` y `txt('en')`. Los textos con números son funciones, y los de
// feedback devuelven HTML con los números del ítem. El menos es U+2212 (`fmt`) y el
// producto no aparece; nada de paréntesis delante de un número (regla 1 de la unidad 3).

import { fmt } from '../_comun/enteros.js';
import {
  textoDe, valorDe, mayorDe, pasosIzquierdaADerecha, positivosDe, negativosDe,
} from './logica.js';

export const NOMBRES = [
  { nombre: { es: 'Salta en la recta', en: 'Jump on the number line' }, detalle: { es: 'Parte del primer número, salta y toca dónde llegas', en: 'Start at the first number, jump and tap where you land' } },
  { nombre: { es: '¿Qué signo tendrá?', en: 'Which sign will it have?' }, detalle: { es: 'Decide si saldrá positivo o negativo antes de calcular', en: 'Decide if it will be positive or negative before you work it out' } },
  { nombre: { es: 'De izquierda a derecha', en: 'From left to right' }, detalle: { es: 'Cuentas de tres o cuatro números, paso a paso', en: 'Sums with three or four numbers, step by step' } },
  { nombre: { es: 'Varios términos', en: 'Several terms' }, detalle: { es: 'Reparte positivos y negativos y súmalos aparte', en: 'Sort the positives and the negatives and add them separately' } },
  { nombre: { es: 'Varios movimientos', en: 'Several moves' }, detalle: { es: 'Problemas de buzos, ascensores, dinero y temperatura', en: 'Problems about divers, lifts, money and temperature' } },
];

const c = s => `<span class="cuenta">${s}</span>`;
const abs = Math.abs;
const lista = (items, y) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${y} ${items.at(-1)}`);
const mayuscula = s => s[0].toUpperCase() + s.slice(1);
/** `5 − 8` con el menos de verdad, sin el primer signo de más. */
const cuenta2 = ([x, y]) => textoDe([x, y]);

/** Frases del salto de una cuenta de dos términos [x, y]: cómo se llega al resultado. */
function camino(L, [x, y]) {
  const r = x + y;
  const cu = c(`${cuenta2([x, y])} = ${fmt(r)}`);
  if (L === 'es') {
    if (x > 0 && y < 0 && abs(y) < x) return `${c(cuenta2([x, y]))}: partes de ${x} y bajas ${abs(y)}, sin llegar al 0, así que ${cu}.`;
    if (x > 0 && y < 0) return `${c(cuenta2([x, y]))}: bajas ${x} hasta el 0 y todavía bajas ${abs(y) - x} más, así que ${cu}.`;
    if (x < 0 && y > 0 && y < abs(x)) return `${c(cuenta2([x, y]))}: empiezas debajo del 0 y subes ${y}, pero no llegas al 0 (te ${abs(x) - y === 1 ? 'falta' : 'faltan'} ${abs(x) - y}), así que ${cu}.`;
    if (x < 0 && y > 0) return `${c(cuenta2([x, y]))}: subes ${abs(x)} hasta el 0 y todavía subes ${y - abs(x)} más, así que ${cu}.`;
    if (x < 0 && y < 0) return `${c(cuenta2([x, y]))}: ya estás debajo del 0 y bajas ${abs(y)} más; ${abs(x)} y ${abs(y)} se suman hacia abajo, así que ${cu}.`;
    return `${cu}.`;
  }
  if (x > 0 && y < 0 && abs(y) < x) return `${c(cuenta2([x, y]))}: you start at ${x} and go down ${abs(y)}, without reaching 0, so ${cu}.`;
  if (x > 0 && y < 0) return `${c(cuenta2([x, y]))}: you go down ${x} to 0 and still go down ${abs(y) - x} more, so ${cu}.`;
  if (x < 0 && y > 0 && y < abs(x)) return `${c(cuenta2([x, y]))}: you start below 0 and go up ${y}, but you do not reach 0 (you are ${abs(x) - y} short), so ${cu}.`;
  if (x < 0 && y > 0) return `${c(cuenta2([x, y]))}: you go up ${abs(x)} to 0 and still go up ${y - abs(x)} more, so ${cu}.`;
  if (x < 0 && y < 0) return `${c(cuenta2([x, y]))}: you are already below 0 and go down ${abs(y)} more; ${abs(x)} and ${abs(y)} are added downwards, so ${cu}.`;
  return `${cu}.`;
}

/** El aviso que va delante cuando la respuesta del alumno coincide con un error típico de la base. */
const AVISO_ERROR = {
  es: {
    'regla-signos-en-suma': 'Aquí los dos números van hacia abajo: se suman y el resultado sigue siendo negativo.',
    'suma-valores-absolutos': 'Los signos son distintos: uno sube y el otro baja, así que se restan (no se suman).',
    'olvida-el-signo': 'Has restado bien, pero el resultado queda por debajo del 0: lleva el signo menos.',
    'signo-del-primero': 'El signo del resultado es el del número que más pesa (mayor valor absoluto), no el del primero.',
  },
  en: {
    'regla-signos-en-suma': 'Here both numbers go downwards: you add them and the answer is still negative.',
    'suma-valores-absolutos': 'The signs are different: one goes up and the other goes down, so you subtract (you do not add).',
    'olvida-el-signo': 'You subtracted well, but the answer is below 0: it needs the minus sign.',
    'signo-del-primero': 'The sign of the answer is the sign of the number that weighs more (greater absolute value), not the first one.',
  },
};

/** Los contextos del ejercicio 5: cómo se cuentan en cada idioma. */
const CONTEXTO = {
  es: {
    lead: 'Después',
    buzo: { head: t => `Un buceador está en el nivel ${fmt(t)} m (el 0 es la superficie).`, sube: n => `sube ${n} m`, baja: n => `baja ${n} m`, fin: v => `El buceador acaba en el nivel ${fmt(v)} m.` },
    ascensor: { head: t => `Un ascensor está en el piso ${fmt(t)} (el 0 es la calle y los pisos negativos son el garaje).`, sube: n => `sube ${n} ${n === 1 ? 'piso' : 'pisos'}`, baja: n => `baja ${n} ${n === 1 ? 'piso' : 'pisos'}`, fin: v => `El ascensor acaba en el piso ${fmt(v)}.` },
    saldo: { head: t => `Tu cuenta tiene ${fmt(t)} € (si el número es negativo, debes dinero).`, sube: n => `ingresas ${n} €`, baja: n => `gastas ${n} €`, fin: v => `Al final tienes ${fmt(v)} € en la cuenta.` },
    temperatura: { head: t => `Por la mañana, una ciudad está a ${fmt(t)} °C.`, sube: n => `sube ${n} ${n === 1 ? 'grado' : 'grados'}`, baja: n => `baja ${n} ${n === 1 ? 'grado' : 'grados'}`, fin: v => `Al final del día hay ${fmt(v)} °C.` },
    y: 'y',
  },
  en: {
    lead: 'Then',
    buzo: { head: t => `A diver is at level ${fmt(t)} m (0 is the surface).`, sube: n => `goes up ${n} m`, baja: n => `goes down ${n} m`, fin: v => `The diver ends at level ${fmt(v)} m.` },
    ascensor: { head: t => `A lift is on floor ${fmt(t)} (0 is the street and negative floors are the car park).`, sube: n => `goes up ${n} ${n === 1 ? 'floor' : 'floors'}`, baja: n => `goes down ${n} ${n === 1 ? 'floor' : 'floors'}`, fin: v => `The lift ends on floor ${fmt(v)}.` },
    saldo: { head: t => `Your account has ${fmt(t)} € (a negative number means you owe (deber) money).`, sube: n => `you pay in ${n} €`, baja: n => `you spend ${n} €`, fin: v => `At the end you have ${fmt(v)} € in the account.` },
    temperatura: { head: t => `In the morning, a city is at ${fmt(t)} °C.`, sube: n => `it goes up ${n} ${n === 1 ? 'degree' : 'degrees'}`, baja: n => `it goes down ${n} ${n === 1 ? 'degree' : 'degrees'}`, fin: v => `At the end of the day it is ${fmt(v)} °C.` },
    y: 'and',
  },
};

function enunciadoProblema(L, item) {
  const k = CONTEXTO[L], x = k[item.contexto];
  const movs = item.terminos.slice(1).map(t => (t > 0 ? x.sube(t) : x.baja(abs(t))));
  return `${x.head(item.terminos[0])} ${k.lead} ${lista(movs, k.y)}.`;
}

/** Los verbos a signos, para explicar cómo se escribe la cuenta. */
const verbos = {
  es: 'Sube, ingresa y «más» se escriben con +; baja, gasta y «menos» se escriben con −.',
  en: 'Going up, paying in and “more” are written with +; going down, spending and “less” are written with −.',
};

const ES = {
  // ─── Introducciones (un ejemplo resuelto) ───
  intro: [
    `<h2>Cómo se hace</h2>
      <p>Tienes una cuenta como <strong>3 − 7</strong>. Empiezas en el <strong>3</strong> y <strong>bajas 7</strong>: pasas por el 0 y llegas al <strong>−4</strong>.</p>
      <p>Toca en la recta la marca donde llegas y pulsa «Comprobar». Si no sabes dónde llegas, cuenta los saltos: con <strong>+</strong> subes y con <strong>−</strong> bajas.</p>`,
    `<h2>Cómo se hace</h2>
      <p>Antes de calcular, piensa: ¿el resultado será positivo o negativo? Por ejemplo, en <strong>−17 + 12</strong> el número que más pesa es el −17 (17 es mayor que 12) y es negativo: el resultado será <strong>negativo</strong>.</p>
      <p>Primero eliges el signo y después calculas: <strong>−17 + 12 = −5</strong>.</p>`,
    `<h2>Cómo se hace</h2>
      <p>En una cuenta con varios números se va de <strong>izquierda a derecha</strong>: <strong>2 − 4 + 3</strong> es primero 2 − 4 = −2, y después −2 + 3 = <strong>1</strong>.</p>
      <p>A veces la cuenta viene con palabras («estoy en el −3, subo 8 y bajo 2»): primero la escribes (<strong>−3 + 8 − 2</strong>) y después la calculas.</p>`,
    `<h2>Cómo se hace</h2>
      <p>En <strong>−6 + 5 − 4 + 8 − 9</strong>, cada número lleva el signo que tiene delante. Reparte los números: los positivos (5 y 8) por un lado y los negativos (−6, −4 y −9) por otro.</p>
      <p>Positivos: 5 + 8 = 13. Negativos: −6 − 4 − 9 = −19. Y ahora <strong>13 − 19 = −6</strong>.</p>
      <p>Si aparece un número y su opuesto (como 7 y −7), suman 0: se pueden tachar.</p>`,
    `<h2>Cómo se hace</h2>
      <p>Un buceador está en el nivel −12 m (el 0 es la superficie), sube 5 m y baja 8 m. La cuenta es <strong>−12 + 5 − 8</strong>: lo que sube es +, lo que baja es −. Sale <strong>−15</strong>: está a 15 m por debajo de la superficie.</p>
      <p>En cada problema eliges la cuenta, la calculas y eliges la frase de respuesta.</p>`,
  ],
  // ─── Ejercicio 1 ───
  salto: {
    orden: ([x, y]) => `<p class="instruccion">Empiezas en el <strong>${fmt(x)}</strong> y ${y < 0 ? 'bajas' : 'subes'} <strong>${abs(y)}</strong>. Toca en la recta dónde llegas.</p>`,
    explica: (terminos, error) => `${error ? `${AVISO_ERROR.es[error]} ` : ''}${camino('es', terminos)}`,
  },
  // ─── Ejercicio 2 ───
  signo: {
    orden: '<p class="instruccion">Antes de calcular: ¿saldrá positivo o negativo?</p>',
    calcula: '<p class="instruccion">Ahora calcula el resultado.</p>',
    positivo: 'Positivo', negativo: 'Negativo',
    razon(terminos) {
      const [x, y] = terminos;
      const sig = valorDe(terminos) < 0 ? 'negativo' : 'positivo';
      if (x < 0 && y < 0) return `${c(cuenta2(terminos))}: los dos números van hacia abajo, así que el resultado es negativo.`;
      const m = mayorDe(terminos), o = m === x ? y : x;
      return `${c(cuenta2(terminos))}: el número que más pesa es ${fmt(m)} (${abs(m)} es mayor que ${abs(o)}) y es ${m < 0 ? 'negativo' : 'positivo'}, así que el resultado es ${sig}.`;
    },
  },
  // ─── Ejercicio 3 ───
  cadena: {
    ordenNumeros: '<p class="instruccion">Calcula de izquierda a derecha.</p>',
    ordenPalabras: item => `<p class="instruccion instruccion--enunciado">Estás en el <strong>${fmt(item.terminos[0])}</strong> de la recta numérica. ${mayuscula(lista(item.terminos.slice(1).map(t => `${t > 0 ? 'subes' : 'bajas'} ${abs(t)}`), 'y'))}.</p>`,
    escribe: '<p class="instruccion">Elige la cuenta que corresponde.</p>',
    calcula: '<p class="instruccion">Ahora calcula.</p>',
    pasos: terminos => pasosIzquierdaADerecha(terminos).map(p => c(`${p.cuenta} = ${fmt(p.valor)}`)).join('; '),
    derecha: (terminos, mal) => `Con ${c(textoDe(terminos))} has ido de derecha a izquierda y así sale ${fmt(mal)}. Hay que ir de izquierda a derecha.`,
    verbos: verbos.es,
    cuentaBuena: terminos => `La cuenta es ${c(textoDe(terminos))}.`,
  },
  // ─── Ejercicio 4 ───
  agrupa: {
    orden: terminos => `<p class="instruccion">Cada número lleva el signo que tiene delante. Toca un número para repartirlo: una vez, a los positivos; otra vez, a los negativos.</p><div class="operacion">${textoDe(terminos)}</div>`,
    porRepartir: 'Por repartir', positivos: 'Positivos', negativos: 'Negativos',
    reparto: 'Comprobar el reparto', sumas: '<p class="instruccion">Suma cada grupo y después junta los dos resultados.</p>',
    sumaPos: 'Los positivos suman', sumaNeg: 'Los negativos suman', resultado: 'Resultado',
    mal: terminos => `Los positivos son ${c(positivosDe(terminos).map(fmt).join(', '))} y los negativos son ${c(negativosDe(terminos).map(fmt).join(', '))}: cada número va con el signo que tiene delante.`,
    explica: (terminos, pareja) => {
      const p = positivosDe(terminos), n = negativosDe(terminos), sp = valorDe(p), sn = valorDe(n);
      return `Positivos: ${c(`${textoDe(p)} = ${fmt(sp)}`)}. Negativos: ${c(`${textoDe(n)} = ${fmt(sn)}`)}. Juntos: ${c(`${textoDe([sp, sn])} = ${fmt(sp + sn)}`)}.${pareja ? ` Además, ${pareja} y −${pareja} son opuestos: suman 0 y se pueden tachar.` : ''}`;
    },
    sumaMal: (tipo, bueno) => (tipo === 'pos' ? `Los positivos se suman: la suma buena es ${fmt(bueno)}.` : `Los negativos se suman y la suma sigue siendo negativa: la suma buena es ${fmt(bueno)}.`),
  },
  // ─── Ejercicio 5 ───
  problema: {
    enunciado: item => `<p class="instruccion instruccion--enunciado">${enunciadoProblema('es', item)}</p>`,
    cuenta: '<p class="instruccion">Elige la cuenta que corresponde.</p>',
    calcula: '<p class="instruccion">Calcula el resultado.</p>',
    frase: '<p class="instruccion">Elige la frase de respuesta.</p>',
    fin: (contexto, v) => CONTEXTO.es[contexto].fin(v),
    verbos: verbos.es,
    cuentaBuena: terminos => `La cuenta es ${c(`${textoDe(terminos)} = ${fmt(valorDe(terminos))}`)}.`,
  },
  // ─── Comunes ───
  cuentaCon: terminos => `${textoDe(terminos)} = □`,
  elige: 'Elige',
  resultado: 'Resultado',
  bien: '¡Muy bien!',
};

const EN = {
  intro: [
    `<h2>How it works</h2>
      <p>You have a sum like <strong>3 − 7</strong>. You start at <strong>3</strong> and <strong>go down 7</strong>: you pass 0 and land on <strong>−4</strong>.</p>
      <p>Tap the mark where you land on the number line and press “Check”. If you are not sure, count the jumps: <strong>+</strong> goes up and <strong>−</strong> goes down.</p>`,
    `<h2>How it works</h2>
      <p>Before you work it out, think: will the answer be positive or negative? For example, in <strong>−17 + 12</strong> the number that weighs more is −17 (17 is greater than 12) and it is negative: the answer will be <strong>negative</strong>.</p>
      <p>First you choose the sign and then you calculate: <strong>−17 + 12 = −5</strong>.</p>`,
    `<h2>How it works</h2>
      <p>In a sum with several numbers you work <strong>from left to right</strong>: <strong>2 − 4 + 3</strong> is first 2 − 4 = −2, and then −2 + 3 = <strong>1</strong>.</p>
      <p>Sometimes the sum comes in words (“I am at −3, I go up 8 and I go down 2”): first you write it (<strong>−3 + 8 − 2</strong>) and then you work it out.</p>`,
    `<h2>How it works</h2>
      <p>In <strong>−6 + 5 − 4 + 8 − 9</strong>, each number keeps the sign in front of it. Sort the numbers: the positive ones (5 and 8) on one side and the negative ones (−6, −4 and −9) on the other.</p>
      <p>Positives: 5 + 8 = 13. Negatives: −6 − 4 − 9 = −19. And now <strong>13 − 19 = −6</strong>.</p>
      <p>If a number and its opposite appear (like 7 and −7), they make 0: you can cross them out.</p>`,
    `<h2>How it works</h2>
      <p>A diver is at level −12 m (0 is the surface), goes up 5 m and goes down 8 m. The sum is <strong>−12 + 5 − 8</strong>: going up is +, going down is −. The answer is <strong>−15</strong>: the diver is 15 m below the surface.</p>
      <p>In each problem you choose the sum, work it out and choose the answer sentence.</p>`,
  ],
  salto: {
    orden: ([x, y]) => `<p class="instruccion">You start at <strong>${fmt(x)}</strong> and go ${y < 0 ? 'down' : 'up'} <strong>${abs(y)}</strong>. Tap where you land on the number line.</p>`,
    explica: (terminos, error) => `${error ? `${AVISO_ERROR.en[error]} ` : ''}${camino('en', terminos)}`,
  },
  signo: {
    orden: '<p class="instruccion">Before you work it out: will it be positive or negative?</p>',
    calcula: '<p class="instruccion">Now work out the answer.</p>',
    positivo: 'Positive', negativo: 'Negative',
    razon(terminos) {
      const [x, y] = terminos;
      const sig = valorDe(terminos) < 0 ? 'negative' : 'positive';
      if (x < 0 && y < 0) return `${c(cuenta2(terminos))}: both numbers go downwards, so the answer is negative.`;
      const m = mayorDe(terminos), o = m === x ? y : x;
      return `${c(cuenta2(terminos))}: the number that weighs more is ${fmt(m)} (${abs(m)} is greater than ${abs(o)}) and it is ${m < 0 ? 'negative' : 'positive'}, so the answer is ${sig}.`;
    },
  },
  cadena: {
    ordenNumeros: '<p class="instruccion">Work it out from left to right.</p>',
    ordenPalabras: item => `<p class="instruccion instruccion--enunciado">You are at <strong>${fmt(item.terminos[0])}</strong> on the number line. ${mayuscula(lista(item.terminos.slice(1).map(t => `you go ${t > 0 ? 'up' : 'down'} ${abs(t)}`), 'and'))}.</p>`,
    escribe: '<p class="instruccion">Choose the sum that matches.</p>',
    calcula: '<p class="instruccion">Now work it out.</p>',
    pasos: terminos => pasosIzquierdaADerecha(terminos).map(p => c(`${p.cuenta} = ${fmt(p.valor)}`)).join('; '),
    derecha: (terminos, mal) => `With ${c(textoDe(terminos))} you went from right to left and got ${fmt(mal)}. You have to go from left to right.`,
    verbos: verbos.en,
    cuentaBuena: terminos => `The sum is ${c(textoDe(terminos))}.`,
  },
  agrupa: {
    orden: terminos => `<p class="instruccion">Each number keeps the sign in front of it. Tap a number to sort it: once for the positives, twice for the negatives.</p><div class="operacion">${textoDe(terminos)}</div>`,
    porRepartir: 'To sort', positivos: 'Positives', negativos: 'Negatives',
    reparto: 'Check the sorting', sumas: '<p class="instruccion">Add each group and then put the two answers together.</p>',
    sumaPos: 'The positives add up to', sumaNeg: 'The negatives add up to', resultado: 'Answer',
    mal: terminos => `The positives are ${c(positivosDe(terminos).map(fmt).join(', '))} and the negatives are ${c(negativosDe(terminos).map(fmt).join(', '))}: each number keeps the sign in front of it.`,
    explica: (terminos, pareja) => {
      const p = positivosDe(terminos), n = negativosDe(terminos), sp = valorDe(p), sn = valorDe(n);
      return `Positives: ${c(`${textoDe(p)} = ${fmt(sp)}`)}. Negatives: ${c(`${textoDe(n)} = ${fmt(sn)}`)}. Together: ${c(`${textoDe([sp, sn])} = ${fmt(sp + sn)}`)}.${pareja ? ` Also, ${pareja} and −${pareja} are opposites: they make 0 and you can cross them out.` : ''}`;
    },
    sumaMal: (tipo, bueno) => (tipo === 'pos' ? `The positives are added: the right sum is ${fmt(bueno)}.` : `The negatives are added and the sum is still negative: the right sum is ${fmt(bueno)}.`),
  },
  problema: {
    enunciado: item => `<p class="instruccion instruccion--enunciado">${enunciadoProblema('en', item)}</p>`,
    cuenta: '<p class="instruccion">Choose the sum that matches.</p>',
    calcula: '<p class="instruccion">Work out the answer.</p>',
    frase: '<p class="instruccion">Choose the answer sentence.</p>',
    fin: (contexto, v) => CONTEXTO.en[contexto].fin(v),
    verbos: verbos.en,
    cuentaBuena: terminos => `The sum is ${c(`${textoDe(terminos)} = ${fmt(valorDe(terminos))}`)}.`,
  },
  cuentaCon: terminos => `${textoDe(terminos)} = □`,
  elige: 'Choose',
  resultado: 'Answer',
  bien: 'Well done!',
};

const TEXTOS = { es: ES, en: EN };

/** Los textos de un idioma. */
export const txt = idioma => TEXTOS[idioma] ?? ES;

export { enunciadoProblema };
