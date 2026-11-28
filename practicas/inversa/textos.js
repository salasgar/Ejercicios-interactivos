// Práctica «Proporcionalidad inversa»: textos propios, siempre { es, en }. Reglas: «·» y «:», nunca «×» ni «÷»; sin letras
// ni «constante»; coma en español y punto en inglés; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM.
// El método es el producto: «lo de arriba por lo de abajo da siempre lo mismo» en las tablas (U7-2C-01/02/03).

import { CONTEXTOS, DIRECTOS, dinero, dineroCelda, datoProblema, pedidoProblema, resultadoCaza, planteamientoCaza } from './logica.js';

const t = (i, es, en) => (i === 'es' ? es : en);
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = s => `<span class="cuenta">${s}</span>`;

/** Un valor «y» nativo (céntimos o unidades), para frases y cuentas. */
export const fv = (ctx, v, i) => ((CONTEXTOS[ctx] ?? DIRECTOS[ctx]).din ? dinero(v, i) : String(v));
/** Para la casilla de la tabla (sin unidad). */
export const celdaY = (ctx, v, i) => (CONTEXTOS[ctx].din ? dineroCelda(v, i) : String(v));
const SING = { días: 'día', horas: 'hora', days: 'day', hours: 'hour' };
/** «1 hora» / «5 horas»: la unidad en singular cuando el valor es 1. */
const conUnidad = (v, u) => `${v} ${String(v) === '1' ? (SING[u] ?? u) : u}`;
const mult = ctx => (CONTEXTOS[ctx].din ? 100 : 1);

export const CABECERAS = {
  obreros: { x: { es: 'Obreros', en: 'Workers' }, y: { es: 'Días', en: 'Days' } },
  grifos: { x: { es: 'Grifos', en: 'Taps' }, y: { es: 'Horas', en: 'Hours' } },
  caballos: { x: { es: 'Caballos', en: 'Horses' }, y: { es: 'Días que dura', en: 'Days it lasts' } },
  amigos: { x: { es: 'Amigos', en: 'Friends' }, y: { es: 'Cada uno paga (€)', en: 'Each pays (€)' } },
  num: { x: { es: '', en: '' }, y: { es: '', en: '' } },
};

// ─── Los contextos de problema ───────────────────────────────────────────────────────────────────

const PROB = {
  obreros: {
    dato: (a, b, i) => t(i, `${a} obreros tardan ${conUnidad(b, 'días')} en pintar un edificio.`, `${a} workers take ${conUnidad(b, 'days')} to paint a building.`),
    pregunta: (c_, i) => t(i, `¿Cuántos días tardarán ${c_} obreros, trabajando al mismo ritmo?`, `How many days will ${c_} workers take, working at the same pace?`),
    etq: { es: 'días', en: 'days' },
    por: { es: 'Con más obreros se tarda menos', en: 'With more workers it takes less time' },
  },
  grifos: {
    dato: (a, b, i) => t(i, `${a} grifos iguales llenan un depósito en ${conUnidad(b, 'horas')}.`, `${a} identical taps fill a tank (depósito) in ${conUnidad(b, 'hours')}.`),
    pregunta: (c_, i) => t(i, `¿Cuántas horas tardarán ${c_} grifos iguales?`, `How many hours will ${c_} identical taps take?`),
    etq: { es: 'horas', en: 'hours' },
    por: { es: 'Con más grifos se tarda menos', en: 'With more taps it takes less time' },
  },
  caballos: {
    dato: (a, b, i) => t(i, `El pienso para ${a} caballos dura ${conUnidad(b, 'días')}, y todos comen lo mismo cada día.`, `The feed for ${a} horses lasts ${conUnidad(b, 'days')}, and they all eat the same amount each day.`),
    pregunta: (c_, i) => t(i, `¿Cuántos días durará el mismo pienso con ${c_} caballos?`, `How many days will the same feed last for ${c_} horses?`),
    etq: { es: 'días', en: 'days' },
    por: { es: 'Con más caballos el pienso dura menos', en: 'With more horses the feed lasts less time' },
  },
  amigos: {
    dato: (a, b, i) => t(i, `${a} amigos compran un regalo y cada uno paga lo mismo: ${b}.`, `${a} friends buy a present and each one pays the same: ${b}.`),
    pregunta: (c_, i) => t(i, `Si fueran ${c_} amigos, ¿cuánto pagaría cada uno?`, `If there were ${c_} friends, how much would each one pay?`),
    etq: { es: '€ cada uno', en: '€ each' },
    por: { es: 'Con más amigos, cada uno paga menos', en: 'With more friends, each one pays less' },
  },
  coche: {
    dato: (a, b, i) => t(i, `Un coche va a ${a} km/h y tarda ${conUnidad(b, 'horas')} en hacer un viaje.`, `A car goes at ${a} km/h and takes ${conUnidad(b, 'hours')} to make a trip.`),
    pregunta: (c_, i) => t(i, `¿Cuántas horas tardaría a ${c_} km/h en hacer el mismo viaje?`, `How many hours would it take to make the same trip at ${c_} km/h?`),
    etq: { es: 'horas', en: 'hours' },
    por: { es: 'A más velocidad se tarda menos', en: 'At a higher speed it takes less time' },
  },
  fruta: {
    dato: (a, b, i) => t(i, `Compro ${a} kg de naranjas por ${b}.`, `I buy ${a} kg of oranges for ${b}.`),
    pregunta: (c_, i) => t(i, `¿Cuánto cuestan ${c_} kg?`, `How much do ${c_} kg cost?`),
    etq: { es: '€', en: '€' },
    por: { es: 'Más kilos cuestan más', en: 'More kilos cost more' },
  },
  receta: {
    dato: (a, b, i) => t(i, `Para ${a} personas hacen falta ${b} g de arroz.`, `For ${a} people you need ${b} g of rice.`),
    pregunta: (c_, i) => t(i, `¿Cuántos gramos hacen falta para ${c_} personas?`, `How many grams do you need for ${c_} people?`),
    etq: { es: 'g', en: 'g' },
    por: { es: 'Para más personas hace falta más arroz', en: 'For more people you need more rice' },
  },
};
export const etiquetaProblema = (it, i) => PROB[it.ctx].etq[i];
export const datoProblemaTx = (it, i) => PROB[it.ctx].dato(it.a, fv(it.ctx, datoProblema(it), i), i);
export const preguntaProblema = (it, i) => PROB[it.ctx].pregunta(it.c, i);

// ─── Ejercicio 1: ¿es inversa? ───────────────────────────────────────────────────────────────────

export function explicaEsInversa(it, { idioma = 'es' } = {}) {
  const i = idioma, prods = it.cols.map(col => `${col.x} · ${col.y} = ${col.x * col.y}`);
  const lista = prods.map(c).join(', ');
  return it.si
    ? t(i, `Sí. Se multiplica lo de arriba por lo de abajo en cada columna: ${lista}. Da lo mismo en todas. La respuesta es: sí.`,
      `Yes. Multiply the top number by the bottom number in each column: ${lista}. It is the same in all of them. The answer is: yes.`)
    : t(i, `No. Se multiplica lo de arriba por lo de abajo en cada columna: ${lista}. No da lo mismo en todas. La respuesta es: no.`,
      `No. Multiply the top number by the bottom number in each column: ${lista}. It is not the same in all of them. The answer is: no.`);
}

// ─── Ejercicio 2: completa la tabla ──────────────────────────────────────────────────────────────

export function explicaCompleta(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx } = it, ref = it.cols[it.ref], m = mult(ctx);
  const hy = it.huecos.find(h => h.que === 'y'), hx = it.huecos.find(h => h.que === 'x');
  const cy = it.cols[hy.col], cxh = it.cols[hx.col], P = fv(ctx, it.P * m, i);
  const prod = `${ref.x} · ${fv(ctx, ref.y, i)} = ${P}`;
  const pasoY = `${P} : ${cy.x} = ${fv(ctx, cy.y, i)}`;
  const pasoX = `${P} : ${fv(ctx, cxh.y, i)} = ${cxh.x}`;
  return t(i,
    `<ol class="pasos-ayuda"><li>Busca la columna con los dos números y multiplícalos: ${c(prod)}. Ese número es el mismo en todas las columnas.</li>
      <li>Casilla de abajo, con ${cy.x} arriba: se divide ${c(pasoY)}.</li>
      <li>Casilla de arriba, con ${fv(ctx, cxh.y, i)} abajo: se divide ${c(pasoX)}.</li></ol>
      <p>La respuesta es ${fv(ctx, cy.y, i)} y ${cxh.x}.</p>`,
    `<ol class="pasos-ayuda"><li>Find the column with both numbers and multiply them: ${c(prod)}. That number is the same in every column.</li>
      <li>Bottom box, with ${cy.x} on top: divide ${c(pasoY)}.</li>
      <li>Top box, with ${fv(ctx, cxh.y, i)} below: divide ${c(pasoX)}.</li></ol>
      <p>The answer is ${fv(ctx, cy.y, i)} and ${cxh.x}.</p>`);
}

// ─── Ejercicio 3: problemas ──────────────────────────────────────────────────────────────────────

export function explicaProblema(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx } = it, m = mult(ctx), b = datoProblema(it), r = pedidoProblema(it);
  const P = fv(ctx, it.P * m, i);
  const prod = `${it.a} · ${fv(ctx, b, i)} = ${P}`, div = `${P} : ${it.c} = ${fv(ctx, r, i)}`;
  const e = PROB[ctx].etq[i];
  const res = ctx === 'amigos' ? fv(ctx, r, i) : conUnidad(r, e);
  return t(i,
    `<ol class="pasos-ayuda"><li>${PROB[ctx].por.es}: es inversa. Los dos datos multiplicados dan siempre lo mismo: ${c(prod)}.</li>
      <li>Para ${it.c}: se divide ${c(div)}.</li></ol><p>La respuesta es ${res}.</p>`,
    `<ol class="pasos-ayuda"><li>${PROB[ctx].por.en}: it is inverse. The two numbers multiplied always give the same result: ${c(prod)}.</li>
      <li>For ${it.c}: divide ${c(div)}.</li></ol><p>The answer is ${res}.</p>`);
}

// ─── Ejercicio 4: caza el error ──────────────────────────────────────────────────────────────────

/** Las líneas de la resolución que se enseña (cuentas bien hechas para su planteamiento). */
export function lineasCaza(it, i) {
  const { ctx, a, c: cc, b } = it, f = v => fv(ctx, v, i), res = resultadoCaza(it);
  if (planteamientoCaza(it) === 'inversa') {
    return [`${a} · ${f(b)} = ${f(a * b)}`, `${f(a * b)} : ${cc} = ${f(res)}`];
  }
  if (it.tipo === 'bien-directa') return [`${f(b)} : ${a} = ${f(b / a)}`, `${f(b / a)} · ${cc} = ${f(res)}`];
  return [`${f(b)} · ${cc} : ${a} = ${f(res)}`];
}
export const enunciadoCaza = (it, i) => `${PROB[it.ctx].dato(it.a, fv(it.ctx, it.b, i), i)} ${PROB[it.ctx].pregunta(it.c, i)}`;
export const resolucionCaza = (it, i) => `<p class="resolucion"><strong>${t(i, `Resolución de ${it.nombre}:`, `${it.nombre}’s solution:`)}</strong></p>
  <ul class="resolucion-lineas">${lineasCaza(it, i).map(l => `<li>${c(l)}</li>`).join('')}</ul>
  <p class="resolucion">${t(i, `Respuesta de ${it.nombre}: ${fv(it.ctx, resultadoCaza(it), i)}${etqAdd(it, i)}.`, `${it.nombre}’s answer: ${fv(it.ctx, resultadoCaza(it), i)}${etqAdd(it, i)}.`)}</p>`;
const etqAdd = (it, i) => {
  const e = PROB[it.ctx].etq[i];
  const n = String(resultadoCaza(it));
  return it.ctx === 'amigos' || it.ctx === 'fruta' ? '' : ` ${n === '1' ? (SING[e] ?? e) : e}`;
};

export function explicaCaza(it, { idioma = 'es' } = {}) {
  const i = idioma, { ctx, a, c: cc, b } = it, f = v => fv(ctx, v, i), por = PROB[ctx].por[i], porMin = por[0].toLowerCase() + por.slice(1);
  const bien = f(it.bien), bienU = ctx === 'receta' ? `${bien} g` : bien;
  if (it.tipo === 'bien-inversa') return t(i,
    `Está bien. ${por}: es inversa, y se multiplica: ${c(`${a} · ${f(b)} = ${f(it.P * mult(ctx))}`)}. Después se divide: ${c(`${f(it.P * mult(ctx))} : ${cc} = ${bienU}`)}.`,
    `It is right. ${por}: it is inverse, so you multiply: ${c(`${a} · ${f(b)} = ${f(it.P * mult(ctx))}`)}. Then you divide: ${c(`${f(it.P * mult(ctx))} : ${cc} = ${bienU}`)}.`);
  if (it.tipo === 'inversa-como-directa') return t(i,
    `Está mal: ${porMin}, así que es inversa, y se ha resuelto como si fuera directa. Bien: ${c(`${a} · ${f(b)} = ${f(a * b)}`)} y ${c(`${f(a * b)} : ${cc} = ${bienU}`)}.`,
    `It is wrong: ${porMin}, so it is inverse, but it was solved as if it were direct. Right way: ${c(`${a} · ${f(b)} = ${f(a * b)}`)} and ${c(`${f(a * b)} : ${cc} = ${bienU}`)}.`);
  if (it.tipo === 'bien-directa') return t(i,
    `Está bien. ${por}: es directa. Lo que vale 1: ${c(`${f(b)} : ${a} = ${f(b / a)}`)}. Para ${cc}: ${c(`${f(b / a)} · ${cc} = ${bienU}`)}.`,
    `It is right. ${por}: it is direct. What 1 is worth: ${c(`${f(b)} : ${a} = ${f(b / a)}`)}. For ${cc}: ${c(`${f(b / a)} · ${cc} = ${bienU}`)}.`);
  return t(i,
    `Está mal: ${porMin}, así que es directa, y se ha resuelto como si fuera inversa. Bien: ${c(`${f(b)} : ${a} = ${f(b / a)}`)} y ${c(`${f(b / a)} · ${cc} = ${bienU}`)}.`,
    `It is wrong: ${porMin}, so it is direct, but it was solved as if it were inverse. Right way: ${c(`${f(b)} : ${a} = ${f(b / a)}`)} and ${c(`${f(b / a)} · ${cc} = ${bienU}`)}.`);
}

// ─── Textos de la práctica ───────────────────────────────────────────────────────────────────────

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

export const TX = {
  ej1: {
    nombre: { es: '¿Es inversa?', en: 'Is it inverse?' },
    detalle: { es: 'Multiplica cada columna y decide', en: 'Multiply each column and decide' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una tabla es de <strong>proporcionalidad inversa</strong> cuando, si un número se hace el doble, el de abajo se hace la mitad. Para comprobarlo, <strong>multiplica</strong> los dos números de cada columna: si da lo mismo en todas, es inversa.</p>
        <p>Ejemplo: 2 → 12 y 4 → 6. ${c('2 · 12 = 24')} y ${c('4 · 6 = 24')}. Da lo mismo: sí es inversa.</p>
        <p>Otro: 2 → 12 y 4 → 8. ${c('2 · 12 = 24')} pero ${c('4 · 8 = 32')}. No da lo mismo: no es inversa.</p>`,
      en: `<h2>How it works</h2>
        <p>A table is <strong>inversely proportional</strong> (proporcionalidad inversa) when, if one number becomes twice as big, the number below becomes half as big. To check it, <strong>multiply</strong> the two numbers in each column: if it is the same in all of them, it is inverse.</p>
        <p>Example: 2 → 12 and 4 → 6. ${c('2 · 12 = 24')} and ${c('4 · 6 = 24')}. It is the same: it is inverse.</p>
        <p>Another one: 2 → 12 and 4 → 8. ${c('2 · 12 = 24')} but ${c('4 · 8 = 32')}. It is not the same: it is not inverse.</p>`,
    },
    instruccion: { es: '¿Es una tabla de proporcionalidad inversa?', en: 'Is it an inverse proportionality table?' },
    si: { es: 'Sí', en: 'Yes' }, no: { es: 'No', en: 'No' },
    solucion: bi((i, it) => explicaEsInversa(it, { idioma: i })),
  },
  ej2: {
    nombre: { es: 'Completa la tabla', en: 'Complete the table' },
    detalle: { es: 'Rellena los dos huecos', en: 'Fill in the two blanks' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Busca la columna que tiene <strong>los dos números</strong> y <strong>multiplícalos</strong>. Ese número es el mismo en todas las columnas. Para rellenar un hueco, <strong>divide</strong> ese número entre el que sí tienes.</p>
        <p>Ejemplo: 3 obreros tardan 8 días: ${c('3 · 8 = 24')}. Con 6 obreros: ${c('24 : 6 = 4')} días. Para tardar 2 días: ${c('24 : 2 = 12')} obreros.</p>
        <p>Escribe los números y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Find the column that has <strong>both numbers</strong> and <strong>multiply them</strong>. That number is the same in every column. To fill a blank, <strong>divide</strong> that number by the one you have.</p>
        <p>Example: 3 workers take 8 days: ${c('3 · 8 = 24')}. With 6 workers: ${c('24 : 6 = 4')} days. To take 2 days: ${c('24 : 2 = 12')} workers.</p>
        <p>Type the numbers and press <strong>Check</strong>.</p>`,
    },
    instruccion: { es: 'Completa la tabla de proporcionalidad inversa.', en: 'Complete the inverse proportionality table.' },
    solucion: bi((i, it) => explicaCompleta(it, { idioma: i })),
  },
  ej3: {
    nombre: { es: 'Problemas', en: 'Problems' },
    detalle: { es: 'Más de uno, menos de otro', en: 'More of one, less of the other' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Si con <strong>más</strong> de una cosa hace falta <strong>menos</strong> de la otra (más obreros, menos días), es <strong>inversa</strong>. Se multiplican los dos datos y se divide entre el número nuevo.</p>
        <p>Ejemplo: 4 obreros tardan 6 días. ${c('4 · 6 = 24')}. Con 8 obreros: ${c('24 : 8 = 3')} días.</p>`,
      en: `<h2>How it works</h2>
        <p>If with <strong>more</strong> of one thing you need <strong>less</strong> of the other (more workers, fewer days), it is <strong>inverse</strong>. Multiply the two numbers you are given and divide by the new number.</p>
        <p>Example: 4 workers take 6 days. ${c('4 · 6 = 24')}. With 8 workers: ${c('24 : 8 = 3')} days.</p>`,
    },
    solucion: bi((i, it) => explicaProblema(it, { idioma: i })),
  },
  ej4: {
    nombre: { es: 'Caza el error', en: 'Spot the mistake' },
    detalle: { es: '¿Está bien resuelto?', en: 'Is it solved correctly?' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lee el problema y decide primero si es <strong>directo</strong> (más de uno, más del otro) o <strong>inverso</strong> (más de uno, menos del otro). Después mira si la resolución usa el método que toca.</p>
        <p>Ejemplo: más obreros, menos días: es inverso, y se resuelve multiplicando y dividiendo. Si la resolución solo divide y multiplica por lo que vale 1, está mal planteada.</p>`,
      en: `<h2>How it works</h2>
        <p>Read the problem and first decide whether it is <strong>direct</strong> (more of one, more of the other) or <strong>inverse</strong> (more of one, less of the other). Then check whether the solution uses the right method.</p>
        <p>Example: more workers, fewer days: it is inverse, and you solve it by multiplying and dividing. If the solution works out what 1 is worth, it is set up wrongly.</p>`,
    },
    pregunta: { es: '¿Está bien resuelto?', en: 'Is it solved correctly?' },
    opciones: {
      bien: { es: 'Está bien', en: 'It is right' },
      'mal-directa': { es: 'Está mal: es inverso y se ha resuelto como directo', en: 'It is wrong: it is inverse but was solved as direct' },
      'mal-inversa': { es: 'Está mal: es directo y se ha resuelto como inverso', en: 'It is wrong: it is direct but was solved as inverse' },
    },
    solucion: bi((i, it) => explicaCaza(it, { idioma: i })),
  },
};
