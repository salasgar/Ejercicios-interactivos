// Práctica «Repartos proporcionales»: textos propios, siempre { es, en }. Reglas: «·» y «:», nunca «×» ni «÷»; la razón
// («a : b») y una división no van en el mismo párrafo; sin porcentajes ni fracciones; coma en español y punto en
// inglés; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM. Los nombres de los dueños son inventados.

import { dinero, nombresDe, cadaDe } from './logica.js';
import { errorEnLinea, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

const NBSP = ' ';
const t = (i, es, en) => (i === 'es' ? es : en);
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = s => `<span class="cuenta">${s}</span>`;
export const razon = (a, b) => `${a}${NBSP}:${NBSP}${b}`;
export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

// ─── Números con su unidad ───────────────────────────────────────────────────────────────────────

/** Una cantidad del contexto (céntimos / mL / cromos) para las frases; `sinUnidad` para las cuentas de cromos. */
export function fv(ctx, v, i, { cromos = false } = {}) {
  if (ctx === 'paga') return dinero(v, i);
  if (ctx === 'refresco') return `${v}${NBSP}mL`;
  return cromos ? `${v}${NBSP}${t(i, v === 1 ? 'cromo' : 'cromos', v === 1 ? 'card' : 'cards')}` : String(v);
}
/** La unidad que se escribe tras el campo. */
export const etiquetaUnidad = (ctx, i) => ({ paga: '€', refresco: 'mL', cromos: t(i, 'cromos', 'cards') })[ctx];
const sobres = (n, i) => t(i, n === 1 ? 'sobre' : 'sobres', n === 1 ? 'pack' : 'packs');
const partes = (n, i) => t(i, n === 1 ? 'parte' : 'partes', n === 1 ? 'part' : 'parts');

const dueno = (it, k, i) => nombresDe(it)[i][k];
const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
/** Quién es el dueño en una frase: «Nora», «el zumo», «la leche». */
const sujeto = (it, k, i) => (it.ctx === 'refresco' ? nombresDe(it).art[i][k] : dueno(it, k, i));
/** «a Nora» / «al zumo» / «a la leche» (en inglés, sin preposición). */
const aSujeto = (it, k, i) => {
  const x = sujeto(it, k, i);
  if (i === 'en') return x;
  return x.startsWith('el ') ? `al ${x.slice(3)}` : `a ${x}`;
};
/** «a Nora le tocan 2 partes» / «the juice gets 4 parts». */
const tocan = (it, k, i) => {
  const n = k === 0 ? it.a : it.b;
  return i === 'es' ? `${aSujeto(it, k, i)} le ${n === 1 ? 'toca' : 'tocan'} ${n} ${partes(n, i)}` : `${sujeto(it, k, i)} gets ${n} ${partes(n, i)}`;
};
/** «Nora tiene 2 partes» / «el zumo lleva 2 partes». */
const lleva = (it, k, i) => {
  const n = k === 0 ? it.a : it.b;
  return `${sujeto(it, k, i)} ${i === 'es' ? (it.ctx === 'refresco' ? 'lleva' : 'tiene') : 'has'} ${n} ${partes(n, i)}`;
};

/** El enunciado del reparto: dice proporcional a qué y escribe la razón. */
export function enunciadoReparto(it, i) {
  const { ctx, a, b, T } = it, A = dueno(it, 0, i), B = dueno(it, 1, i), r = razon(a, b);
  if (ctx === 'paga') {
    return t(i,
      `${A} y ${B} han cobrado ${dinero(T, 'es')} por un trabajo y se lo reparten en proporción a las horas que ha trabajado cada uno: ${A}, ${a} h; ${B}, ${b} h. Es decir, en la razón ${r}.`,
      `${A} and ${B} earned ${dinero(T, 'en')} for a job and share it in proportion to the hours each one worked: ${A}, ${a} h; ${B}, ${b} h. That is, in the ratio ${r}.`);
  }
  if (ctx === 'cromos') {
    return t(i,
      `${A} y ${B} se reparten ${T} cromos en proporción a los sobres que ha puesto cada uno: ${A}, ${a} ${sobres(a, i)}; ${B}, ${b} ${sobres(b, i)}. Es decir, en la razón ${r}.`,
      `${A} and ${B} share ${T} cards in proportion to the packs each one put in: ${A}, ${a} ${sobres(a, i)}; ${B}, ${b} ${sobres(b, i)}. That is, in the ratio ${r}.`);
  }
  return t(i,
    `Se preparan ${T} mL de refresco mezclando ${A} y ${B} en la razón ${r}: por cada ${a === 1 ? '' : `${a} `}${partes(a, i)} de ${A}, ${b} de ${B}.`,
    `${T} mL of drink are made by mixing ${A} and ${B} in the ratio ${r}: for every ${a === 1 ? '' : `${a} `}${partes(a, i)} of ${A}, ${b} of ${B}.`);
}

// ─── Qué ha pasado con cada error ────────────────────────────────────────────────────────────────

export const NOMBRE_ERROR = {
  'partes-multiplicadas': { es: 'Has multiplicado las partes', en: 'You multiplied the parts' },
  'contar-personas': { es: 'Has contado las personas', en: 'You counted the people' },
  'partes-iguales': { es: 'Has repartido a partes iguales', en: 'You shared it equally' },
  'dividir-entre-un-termino': { es: 'Has dividido entre un solo número de la razón', en: 'You divided by only one number of the ratio' },
  'dividir-entre-dos': { es: 'Has dividido entre 2 en vez de entre todas las partes', en: 'You divided by 2 instead of by all the parts' },
  'dividir-entre-cada-termino': { es: 'Has dividido el total entre cada número de la razón', en: 'You divided the total by each number of the ratio' },
  intercambiadas: { es: 'Las partes están al revés', en: 'The parts are the wrong way round' },
  'quedarse-en-una-parte': { es: 'Te has quedado en lo que vale una parte', en: 'You stopped at what one part is worth' },
  'razonar-sumando': { es: 'Has repartido sumando en vez de multiplicar', en: 'You added instead of multiplying' },
  'sumar-en-vez-de-multiplicar': { es: 'Has sumado en vez de multiplicar', en: 'You added instead of multiplying' },
  'otra-respuesta': { es: 'Ese número no sale de ningún camino habitual', en: 'That number does not come from any usual method' },
};

/** Una frase para el error reconocido, con los números del ítem. */
export function quePaso(id, it, i) {
  const { ctx, a, b, u, T } = it, S = a + b;
  switch (id) {
    case 'partes-multiplicadas':
      return t(i, `Las partes se suman, no se multiplican: ${c(`${a} + ${b} = ${S}`)} partes, no ${a * b}.`,
        `Parts are added, not multiplied: ${c(`${a} + ${b} = ${S}`)} parts, not ${a * b}.`);
    case 'contar-personas':
      return t(i, `No son 2 partes: cada uno tiene las suyas. Hay ${c(`${a} + ${b} = ${S}`)} partes.`,
        `There are not 2 parts: each one has their own. There are ${c(`${a} + ${b} = ${S}`)} parts.`);
    case 'partes-iguales':
      return t(i, `No se reparte a partes iguales: ${lleva(it, 0, i)} y ${sujeto(it, 1, i)} ${b}. El total se divide entre ${S}, no entre 2.`,
        `It is not shared equally: ${lleva(it, 0, i)} and ${sujeto(it, 1, i)} ${b}. The total is divided by ${S}, not by 2.`);
    case 'dividir-entre-dos':
      return t(i, `El total se divide entre todas las partes (${S}), no entre 2.`, `The total is divided by all the parts (${S}), not by 2.`);
    case 'dividir-entre-un-termino':
    case 'dividir-entre-cada-termino':
      return t(i, `El total se divide entre todas las partes (${S}), no entre ${a} ni entre ${b}.`,
        `The total is divided by all the parts (${S}), not by ${a} or by ${b}.`);
    case 'intercambiadas':
      return t(i, `Están al revés: ${tocan(it, 0, i)}, no ${b}.`, `They are the wrong way round: ${tocan(it, 0, i)}, not ${b}.`);
    case 'quedarse-en-una-parte':
      return t(i, `${fv(ctx, u, i, { cromos: true })} es lo que vale UNA parte; ${tocan(it, 0, i)}.`,
        `${fv(ctx, u, i, { cromos: true })} is what ONE part is worth; ${tocan(it, 0, i)}.`);
    case 'razonar-sumando':
    case 'sumar-en-vez-de-multiplicar':
      return t(i, 'Cada uno recibe tantas partes como le tocan: se multiplica, no se suma.',
        'Each one gets as many parts as they are due: you multiply, you do not add.');
    default:
      return t(i, 'Repasa las partes y lo que vale una.', 'Check the parts and what one part is worth.');
  }
}

// ─── Pasos del reparto bien hecho ────────────────────────────────────────────────────────────────

/** Los párrafos con la solución completa (sin razón: solo divisiones y productos). */
export function pasosBien(it, i) {
  const { ctx, a, b, u, T } = it, S = a + b, F = v => fv(ctx, v, i), A = cap(dueno(it, 0, i)), B = cap(dueno(it, 1, i));
  return [
    t(i, `Partes en total: ${c(`${a} + ${b} = ${S}`)}.`, `Parts in total: ${c(`${a} + ${b} = ${S}`)}.`),
    t(i, `Una parte: ${c(`${F(T)} : ${S} = ${F(u)}`)}.`, `One part: ${c(`${F(T)} : ${S} = ${F(u)}`)}.`),
    t(i, `${A}: ${c(`${a} · ${F(u)} = ${F(a * u)}`)}. ${B}: ${c(`${b} · ${F(u)} = ${F(b * u)}`)}.`,
      `${A}: ${c(`${a} · ${F(u)} = ${F(a * u)}`)}. ${B}: ${c(`${b} · ${F(u)} = ${F(b * u)}`)}.`),
    t(i, `Comprobación: ${c(`${F(a * u)} + ${F(b * u)} = ${F(T)}`)}.`, `Check: ${c(`${F(a * u)} + ${F(b * u)} = ${F(T)}`)}.`),
  ];
}
const parrafos = ps => ps.map(p => `<p>${p}</p>`).join('');

// ─── Explicaciones («No lo sé» y feedback) ───────────────────────────────────────────────────────

export function explicaCuenta(it, { idioma = 'es' } = {}) {
  const i = idioma, { a, b, u, T, ctx } = it, S = a + b, F = v => fv(ctx, v, i);
  return parrafos([
    t(i, `Partes en total: ${c(`${a} + ${b} = ${S}`)}.`, `Parts in total: ${c(`${a} + ${b} = ${S}`)}.`),
    t(i, `Una parte vale: ${c(`${F(T)} : ${S} = ${F(u)}`)}.`, `One part is worth: ${c(`${F(T)} : ${S} = ${F(u)}`)}.`),
    t(i, `Respuesta: hay ${S} partes y una parte vale ${fv(ctx, u, i, { cromos: true })}.`, `Answer: there are ${S} parts and one part is worth ${fv(ctx, u, i, { cromos: true })}.`),
  ]);
}
export function explicaReparte(it, { idioma = 'es' } = {}) {
  const i = idioma;
  return parrafos([...pasosBien(it, i),
    t(i, `Respuesta: ${cap(dueno(it, 0, i))}, ${fv(it.ctx, it.a * it.u, i, { cromos: true })}; ${cap(dueno(it, 1, i))}, ${fv(it.ctx, it.b * it.u, i, { cromos: true })}.`,
      `Answer: ${cap(dueno(it, 0, i))}, ${fv(it.ctx, it.a * it.u, i, { cromos: true })}; ${cap(dueno(it, 1, i))}, ${fv(it.ctx, it.b * it.u, i, { cromos: true })}.`)]);
}

/** El reparto que se enseña en el ejercicio 3 y en el 4. */
export const repartoDado = (it, i) => {
  const { ctx } = it, [x, y] = it.dado, F = v => fv(ctx, v, i);
  const A = cap(dueno(it, 0, i)), B = cap(dueno(it, 1, i));
  return `${A}, ${F(x)}; ${B}, ${F(y)}.`;
};

export function explicaEstaBien(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx, a, b, u, T, tipo } = it, [x, y] = it.dado, F = v => fv(ctx, v, i);
  const suma = c(`${F(x)} + ${F(y)} = ${F(x + y)}`);
  if (tipo === 'bien') {
    return parrafos([
      t(i, `Sí está bien repartido. Suman el total: ${suma}.`, `Yes, it is shared correctly. They add up to the total: ${suma}.`),
      t(i, `Y guardan la razón ${razon(a, b)}.`, `And they keep the ratio ${razon(a, b)}.`),
      t(i, `${c(`${a} · ${F(u)} = ${F(x)}`)} y ${c(`${b} · ${F(u)} = ${F(y)}`)}.`, `${c(`${a} · ${F(u)} = ${F(x)}`)} and ${c(`${b} · ${F(u)} = ${F(y)}`)}.`),
    ]);
  }
  const bien = t(i, `Bien hecho: ${c(`${F(T)} : ${a + b} = ${F(u)}`)}; ${c(`${a} · ${F(u)} = ${F(a * u)}`)} y ${c(`${b} · ${F(u)} = ${F(b * u)}`)}.`,
    `Done correctly: ${c(`${F(T)} : ${a + b} = ${F(u)}`)}; ${c(`${a} · ${F(u)} = ${F(a * u)}`)} and ${c(`${b} · ${F(u)} = ${F(b * u)}`)}.`);
  if (tipo === 'no-suman') {
    return parrafos([
      t(i, `Está mal: las partes no suman el total. ${suma}, y el total es ${F(T)}.`, `It is wrong: the parts do not add up to the total. ${suma}, and the total is ${F(T)}.`),
      bien,
    ]);
  }
  return parrafos([
    t(i, `Está mal: suman el total (${suma}), pero no están en la razón ${razon(a, b)}.`,
      `It is wrong: they add up to the total (${suma}), but they are not in the ratio ${razon(a, b)}.`),
    bien,
  ]);
}

// ─── Ejercicio 4: las tres líneas ────────────────────────────────────────────────────────────────

/** Las tres líneas de la resolución (texto plano, con «:» para dividir) tal como las hizo el compañero. */
export function lineasCaza(it, i) {
  const { ctx, a, b, u, T, error } = it, F = v => fv(ctx, v, i), A = cap(dueno(it, 0, i)), B = cap(dueno(it, 1, i)), S = it.partes;
  const L1 = error === 'partes-iguales' ? `1 + 1 = 2 ${partes(2, i)}`
    : (error === 'partes-multiplicadas' ? `${a} · ${b} = ${S} ${partes(S, i)}` : `${a} + ${b} = ${S} ${partes(S, i)}`);
  const L2 = `${F(T)} : ${it.divisor} = ${F(it.una)}`;
  const [x, y] = cadaDe(it);
  const L3 = it.suma
    ? `${A}: ${F(u)} + ${a} = ${F(x)}; ${B}: ${F(u)} + ${b} = ${F(y)}`
    : `${A}: ${it.mult[0]} · ${F(it.una)} = ${F(x)}; ${B}: ${it.mult[1]} · ${F(it.una)} = ${F(y)}`;
  return [L1, L2, L3];
}

/** Lo correcto: las tres líneas bien hechas. */
export function lineasBien(it, i) {
  const { ctx, a, b, u, T } = it, S = a + b, F = v => fv(ctx, v, i), A = cap(dueno(it, 0, i)), B = cap(dueno(it, 1, i));
  return [`${a} + ${b} = ${S} ${partes(S, i)}`, `${F(T)} : ${S} = ${F(u)}`,
    `${A}: ${a} · ${F(u)} = ${F(a * u)}; ${B}: ${b} · ${F(u)} = ${F(b * u)}`];
}

const REGLAS4 = {
  'partes-iguales': { es: 'Cada uno recibe las partes que le tocan en la razón.', en: 'Each one gets the parts the ratio gives them.' },
  'partes-multiplicadas': { es: 'Las partes de la razón se suman.', en: 'The parts of the ratio are added.' },
  'dividir-entre-un-termino': { es: 'El total se divide entre todas las partes.', en: 'The total is divided by all the parts.' },
  'dividir-entre-dos': { es: 'El total se divide entre todas las partes.', en: 'The total is divided by all the parts.' },
  'sumar-en-vez-de-multiplicar': { es: 'Cada uno recibe tantas partes como le tocan: se multiplica.', en: 'Each one gets as many parts as they are due: you multiply.' },
  intercambiadas: { es: 'A cada uno le tocan las partes que dice la razón, en su orden.', en: 'Each one gets the parts the ratio gives them, in that order.' },
};

export function explicaCaza(it, { idioma = 'es' } = {}) {
  const i = idioma, mala = lineasCaza(it, i)[it.mala], bien = lineasBien(it, i), F = v => fv(it.ctx, v, i);
  return parrafos([
    `${errorEnLinea(it.mala, i)} <span class="linea-mala">${c(mala)}</span><br>${NOMBRE_ERROR[it.error][i]}.${reglaEnNegrita(REGLAS4[it.error][i])}${quePaso(it.error, it, i)}`,
    `${LO_CORRECTO[i]}<br>${bien.map(l => `<span class="linea-mala">${c(l)}</span>`).join('<br>')}`,
    t(i, `Comprobación: ${c(`${F(it.a * it.u)} + ${F(it.b * it.u)} = ${F(it.T)}`)}.`, `Check: ${c(`${F(it.a * it.u)} + ${F(it.b * it.u)} = ${F(it.T)}`)}.`),
  ]);
}

// ─── Textos fijos ────────────────────────────────────────────────────────────────────────────────

const ej = (es, en) => ({ es, en });
export const TX = {
  ej1: {
    nombre: ej('Cuenta las partes', 'Count the parts'),
    detalle: ej('Cuántas partes hay y cuánto vale una', 'How many parts there are and what one is worth'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Repartir en una razón es repartir en <strong>partes</strong>. Con la razón 2 : 3, uno tiene 2 partes y el otro 3.</p>
        <p>Se <strong>suman</strong> las partes y se divide el total entre ese número. Ejemplo, con 60 € para repartir: ${c('2 + 3 = 5')} partes, y una parte vale ${c('60 : 5 = 12')} €.</p>`,
      en: `<h2>How it works</h2>
        <p>Sharing in a ratio (razón) means sharing in <strong>parts</strong>. With the ratio 2 : 3, one person gets 2 parts and the other 3.</p>
        <p>You <strong>add</strong> the parts and divide the total by that number. Example, with €60 to share: ${c('2 + 3 = 5')} parts, and one part is worth ${c('€60 : 5 = €12')}.</p>`,
    },
    instruccion: ej('Escribe cuántas partes hay en total y cuánto vale una parte.', 'Write how many parts there are in total and what one part is worth.'),
    partes: ej('Partes en total', 'Parts in total'), una: ej('Una parte vale', 'One part is worth'),
    solucion: bi((i, it) => explicaCuenta(it, { idioma: i })),
  },
  ej2: {
    nombre: ej('Reparte', 'Share it out'),
    detalle: ej('Cuánto le toca a cada uno', 'How much each one gets'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Primero, lo que vale una parte; después, cada uno recibe <strong>tantas partes como le tocan</strong>: se multiplica.</p>
        <p>Ejemplo con 60 € en la razón 2 : 3: una parte vale 12 €. Uno recibe ${c('2 · 12 = 24')} € y el otro ${c('3 · 12 = 36')} €. Comprueba: ${c('24 + 36 = 60')}.</p>`,
      en: `<h2>How it works</h2>
        <p>First, what one part is worth; then each one gets <strong>as many parts as they are due</strong>: you multiply.</p>
        <p>Example with €60 in the ratio 2 : 3: one part is worth €12. One gets ${c('2 · €12 = €24')} and the other ${c('3 · €12 = €36')}. Check: ${c('€24 + €36 = €60')}.</p>`,
    },
    instruccion: ej('Escribe lo que le toca a cada uno.', 'Write what each one gets.'),
    solucion: bi((i, it) => explicaReparte(it, { idioma: i })),
  },
  ej3: {
    nombre: ej('¿Está bien repartido?', 'Is it shared correctly?'),
    detalle: ej('Comprueba la suma y la razón', 'Check the sum and the ratio'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un reparto está bien si pasan <strong>dos cosas</strong>: las partes <strong>suman el total</strong> y cada una es la que toca en la razón.</p>
        <p>Ejemplo: 60 € en la razón 2 : 3. Con 30 € y 30 € suman 60 €, pero no están en la razón. Con 24 € y 36 €, sí.</p>`,
      en: `<h2>How it works</h2>
        <p>A sharing is correct when <strong>two things</strong> happen: the parts <strong>add up to the total</strong> and each one is the right amount for the ratio.</p>
        <p>Example: €60 in the ratio 2 : 3. With €30 and €30 they add up to €60, but they are not in the ratio. With €24 and €36, they are.</p>`,
    },
    instruccion: ej('Mira el reparto que han hecho. ¿Está bien?', 'Look at the sharing they made. Is it correct?'),
    reparto: ej('Reparto', 'Sharing'),
    opciones: {
      bien: ej('Está bien repartido', 'It is shared correctly'),
      'no-suman': ej('Está mal: las dos partes no suman el total', 'It is wrong: the two parts do not add up to the total'),
      'no-razon': ej('Está mal: suman el total, pero no están en la razón pedida', 'It is wrong: they add up to the total, but they are not in the ratio'),
    },
    solucion: bi((i, it) => explicaEstaBien(it, { idioma: i })),
  },
  ej4: {
    nombre: ej('Caza el error', 'Spot the mistake'),
    detalle: ej('Una línea del reparto está mal', 'One line of the sharing is wrong'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Un compañero ha hecho un reparto en <strong>tres líneas</strong>: las partes, lo que vale una y lo que recibe cada uno. <strong>Una</strong> línea está mal.</p>
        <p>Repasa cada línea: las partes se <strong>suman</strong>, el total se divide entre <strong>todas</strong> las partes y cada uno recibe sus partes <strong>multiplicando</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>A classmate has done a sharing in <strong>three lines</strong>: the parts, what one is worth and what each one gets. <strong>One</strong> line is wrong.</p>
        <p>Check each line: the parts are <strong>added</strong>, the total is divided by <strong>all</strong> the parts and each one gets their parts by <strong>multiplying</strong>.</p>`,
    },
    instruccion: ej('Toca la línea que está mal.', 'Tap the line that is wrong.'),
    solucion: bi((i, it) => explicaCaza(it, { idioma: i })),
  },
};
