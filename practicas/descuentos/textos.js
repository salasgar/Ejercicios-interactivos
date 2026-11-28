// Práctica «Descuentos y aumentos»: textos propios, siempre { es, en }. Reglas: «·», nunca «×»; «rebajado un 20 %» y
// «sube un 10 %»; el porcentaje de un precio se calcula con su fracción (20 % = 20 : 100) o con ·0,20; cada
// explicación habla de LOS NÚMEROS DE ESE ÍTEM.

import {
  dinero, pct, factorTxt, multiplicadorTxt, cambioDe, finalDe, multiplicadorDe, conIva, respuestaQuePiden,
} from './logica.js';

const t = (i, es, en) => (i === 'es' ? es : en);
const c = s => `<span class="cuenta">${s}</span>`;
const parrafos = ps => ps.map(p => `<p>${p}</p>`).join('');
const pasos = ps => `<ol class="pasos-ayuda">${ps.map(p => `<li>${p}</li>`).join('')}</ol>`;
export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };
const ej = (es, en) => ({ es, en });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Frases de enunciado ─────────────────────────────────────────────────────────────────────────

/** «Una camiseta cuesta 25,00 €.» */
export const cuesta = (it, i) => {
  const { prod, P } = it, verbo = prod.pl && i === 'es' ? 'cuestan' : t(i, 'cuesta', 'costs');
  return `${prod.suj[i]} ${verbo} ${dinero(P, i)}.`;
};
/** La frase del cambio: «Está rebajada un 20 %.» / «Sube un 10 %.». */
export function frase(it, i) {
  const { prod, p, tipo } = it;
  if (tipo === 'descuento') {
    const fem = ['camiseta', 'sudadera', 'chaqueta', 'bici', 'cine'].includes(prod.id);
    const es = prod.pl ? `Están rebajadas un ${pct(p, 'es')}.` : fem ? `Está rebajada un ${pct(p, 'es')}.` : `Está rebajado un ${pct(p, 'es')}.`;
    const en = `It is reduced by ${pct(p, 'en')}.`;
    return i === 'es' ? es : en;
  }
  return t(i, `Sube un ${pct(p, 'es')}.`, `It goes up by ${pct(p, 'en')}.`);
}
const nombreCambio = (tipo, i) => (tipo === 'descuento' ? t(i, 'el descuento', 'the discount') : t(i, 'el aumento', 'the increase'));
const nombreFinal = (tipo, i) => (tipo === 'descuento' ? t(i, 'el precio rebajado', 'the reduced price') : t(i, 'el precio nuevo', 'the new price'));

export const enunciadoDosPasos = (it, i) => `${cuesta(it, i)} ${frase(it, i)}`;

// ─── Qué ha pasado con cada error ────────────────────────────────────────────────────────────────

export const NOMBRE_ERROR = {
  'campos-cambiados': { es: 'Has puesto cada número en el campo del otro', en: 'You put each number in the other box' },
  'restar-el-porcentaje-como-numero': { es: 'Has restado el porcentaje como si fueran euros', en: 'You took the percentage off as if it were euros' },
  'sumar-el-porcentaje-como-numero': { es: 'Has sumado el porcentaje como si fueran euros', en: 'You added the percentage as if it were euros' },
  'descuento-por-precio-final': { es: 'Te has quedado en el descuento (o en el aumento)', en: 'You stopped at the discount (or the increase)' },
  'precio-final-por-descuento': { es: 'Has dado el precio final donde pedían el descuento', en: 'You gave the final price where the discount was asked' },
  'aumento-por-descuento': { es: 'Has cambiado el signo: has sumado en vez de restar, o al revés', en: 'You used the wrong sign: you added instead of subtracting, or the other way round' },
  'porcentaje-entre-mil': { es: 'Has dividido entre 1000 en vez de entre 100', en: 'You divided by 1000 instead of 100' },
  'dividir-entre-el-porcentaje': { es: 'Has dividido el precio entre el porcentaje', en: 'You divided the price by the percentage' },
  'multiplicar-por-el-porcentaje': { es: 'Has elegido el porcentaje, no el multiplicador', en: 'You chose the percentage, not the multiplier' },
  'multiplicador-del-otro-signo': { es: 'Has elegido el multiplicador del otro signo', en: 'You chose the multiplier with the wrong sign' },
  'multiplicador-entre-mil': { es: 'Se te ha ido una coma en el multiplicador', en: 'The decimal point is in the wrong place in the multiplier' },
  'iva-como-decimas': { es: 'Has puesto mal la coma del multiplicador', en: 'The decimal point is in the wrong place in the multiplier' },
  'porcentaje-como-centesimas': { es: 'Has puesto el porcentaje como centésimas del multiplicador', en: 'You wrote the percentage as hundredths of the multiplier' },
  'coma-de-mas': { es: 'Se te ha ido una coma', en: 'The decimal point is in the wrong place' },
  'sube-y-baja-se-queda-igual': { es: 'Has creído que sube y baja lo mismo y se queda igual', en: 'You thought going up and down by the same percentage leaves it unchanged' },
  'otra-respuesta': { es: 'Ese número no sale de ningún camino habitual', en: 'That number does not come from any usual method' },
};

export function quePaso(id, it, i) {
  const P = it.P, p = it.p, tipo = it.tipo ?? (it.r ? 'aumento' : 'descuento'), pp = it.r ?? p;
  switch (id) {
    case 'restar-el-porcentaje-como-numero':
    case 'sumar-el-porcentaje-como-numero':
      return t(i, `Un ${pct(pp, 'es')} no son ${pp} euros: es ${pp} de cada 100, o sea, ${c(`${pp} : 100 · ${dinero(P, 'es')}`)}.`,
        `${pct(pp, 'en')} is not €${pp}: it is ${pp} out of every 100, that is, ${c(`${pp} : 100 · ${dinero(P, 'en')}`)}.`);
    case 'descuento-por-precio-final':
      return t(i, `${cap(nombreCambio(tipo, 'es'))} es solo una parte: falta ${tipo === 'descuento' ? 'restarlo al' : 'sumarlo al'} precio.`,
        `${cap(nombreCambio(tipo, 'en'))} is only one part: you still have to ${tipo === 'descuento' ? 'take it off' : 'add it to'} the price.`);
    case 'precio-final-por-descuento':
      return t(i, 'Aquí piden lo que se descuenta (o se sube), no el precio final.', 'Here they ask for the amount taken off (or added), not the final price.');
    case 'aumento-por-descuento':
      return tipo === 'descuento'
        ? t(i, 'Una rebaja se resta: el precio final tiene que ser menor que el de partida.', 'A reduction is taken off: the final price must be lower than the starting one.')
        : t(i, 'Una subida se suma: el precio final tiene que ser mayor que el de partida.', 'An increase is added: the final price must be higher than the starting one.');
    case 'porcentaje-entre-mil':
      return t(i, 'El porcentaje es «de cada 100»: se divide entre 100, no entre 1000.', 'A percentage is “out of every 100”: you divide by 100, not by 1000.');
    case 'dividir-entre-el-porcentaje':
      return t(i, `No se divide entre ${pp}: se multiplica por ${pp} y se divide entre 100.`, `You do not divide by ${pp}: you multiply by ${pp} and divide by 100.`);
    case 'campos-cambiados':
      return t(i, 'El primer campo es lo que cambia el precio; el segundo, cómo queda.', 'The first box is how much the price changes; the second is how it ends up.');
    case 'sube-y-baja-se-queda-igual':
      return t(i, `El segundo ${pct(p, 'es')} se calcula sobre el precio NUEVO, no sobre el de partida.`, `The second ${pct(p, 'en')} is worked out on the NEW price, not on the starting one.`);
    default:
      return t(i, 'Repasa qué se calcula en cada paso.', 'Check what is worked out in each step.');
  }
}

// ─── Explicaciones («No lo sé» y feedback) ───────────────────────────────────────────────────────

export function explicaDosPasos(it, { idioma = 'es' } = {}) {
  const i = idioma, { P, p, tipo } = it, cambio = cambioDe(P, p), final = finalDe(P, p, tipo), D = v => dinero(v, i), r = tipo === 'descuento';
  return pasos([
    t(i, `${r ? 'Descuento' : 'Aumento'}: ${c(`${pct(p, i)} de ${D(P)} = ${p} : 100 · ${D(P)} = ${D(cambio)}`)}.`,
      `${r ? 'Discount' : 'Increase'}: ${c(`${pct(p, i)} of ${D(P)} = ${p} : 100 · ${D(P)} = ${D(cambio)}`)}.`),
    t(i, `Precio ${r ? 'rebajado' : 'nuevo'}: ${c(`${D(P)} ${r ? '−' : '+'} ${D(cambio)} = ${D(final)}`)}.`,
      `${r ? 'Reduced' : 'New'} price: ${c(`${D(P)} ${r ? '−' : '+'} ${D(cambio)} = ${D(final)}`)}.`),
    t(i, `La respuesta es: ${r ? 'descuento' : 'aumento'}, ${D(cambio)}; precio ${r ? 'rebajado' : 'nuevo'}, ${D(final)}.`,
      `The answer is: ${r ? 'discount' : 'increase'}, ${D(cambio)}; ${r ? 'reduced' : 'new'} price, ${D(final)}.`),
  ]);
}

export function explicaUnPaso(it, { idioma = 'es' } = {}) {
  const i = idioma, { p, tipo } = it, r = tipo === 'descuento', D = v => dinero(v, i);
  const m = multiplicadorDe(p, tipo), M = multiplicadorTxt(m, i);
  const paso1 = t(i, `${r ? 'Rebajar' : 'Subir'} un ${pct(p, i)} es quedarse con ${c(pct(r ? 100 - p : 100 + p, 'es'))} del precio: ${c(`${r ? 100 - p : 100 + p} : 100 = ${M}`)}.`,
    `${r ? 'Reducing' : 'Raising'} by ${pct(p, i)} means keeping ${c(pct(r ? 100 - p : 100 + p, 'en'))} of the price: ${c(`${r ? 100 - p : 100 + p} : 100 = ${M}`)}.`);
  if (it.modo === 'elegir') {
    return pasos([paso1, t(i, `La respuesta es: se multiplica por ${M}.`, `The answer is: you multiply by ${M}.`)]);
  }
  const final = finalDe(it.P, p, tipo);
  return pasos([paso1,
    t(i, `Precio ${r ? 'rebajado' : 'nuevo'}: ${c(`${M} · ${D(it.P)} = ${D(final)}`)}.`, `${r ? 'Reduced' : 'New'} price: ${c(`${M} · ${D(it.P)} = ${D(final)}`)}.`),
    t(i, `La respuesta es ${D(final)}.`, `The answer is ${D(final)}.`)]);
}

export function explicaIva(it, { idioma = 'es' } = {}) {
  const i = idioma, { P, r } = it, iva = cambioDe(P, r), D = v => dinero(v, i);
  return pasos([
    t(i, `IVA: ${c(`${pct(r, i)} de ${D(P)} = ${r} : 100 · ${D(P)} = ${D(iva)}`)}.`, `VAT: ${c(`${pct(r, i)} of ${D(P)} = ${r} : 100 · ${D(P)} = ${D(iva)}`)}.`),
    t(i, `Con IVA: ${c(`${D(P)} + ${D(iva)} = ${D(conIva(it))}`)}.`, `With VAT: ${c(`${D(P)} + ${D(iva)} = ${D(conIva(it))}`)}.`),
    t(i, `La respuesta es ${D(conIva(it))}.`, `The answer is ${D(conIva(it))}.`),
  ]);
}

export const pideTexto = (it, i) => {
  const r = it.tipo === 'descuento';
  if (it.pregunta === 'cambio') return r ? t(i, '¿Cuánto se descuenta?', 'How much is taken off?') : (it.tipo === 'iva' ? t(i, '¿Cuánto es el IVA?', 'How much is the VAT?') : t(i, '¿Cuánto sube?', 'How much does it go up?'));
  return r ? t(i, '¿Cuánto hay que pagar?', 'How much do you have to pay?') : t(i, '¿Cuánto hay que pagar ahora?', 'How much do you have to pay now?');
};
export function enunciadoQuePiden(it, i) {
  const { prod, p, P, tipo } = it;
  if (tipo === 'iva') {
    const ent = prod.suj[i], verbo = prod.pl && i === 'es' ? 'cuestan' : t(i, 'cuesta', 'costs');
    return t(i, `${ent} ${verbo} ${dinero(P, 'es')} sin IVA. El IVA es del ${pct(p, 'es')}.`, `${ent} ${verbo} ${dinero(P, 'en')} before VAT. The VAT is ${pct(p, 'en')}.`);
  }
  return enunciadoDosPasos({ prod, p, P, tipo }, i);
}
export function explicaQuePiden(it, { idioma = 'es' } = {}) {
  const i = idioma, { p, P, tipo, pregunta } = it, cambio = cambioDe(P, p), final = finalDe(P, p, tipo === 'iva' ? 'aumento' : tipo), D = v => dinero(v, i);
  const r = tipo === 'descuento', nom = tipo === 'iva' ? t(i, 'IVA', 'VAT') : r ? t(i, 'Descuento', 'Discount') : t(i, 'Aumento', 'Increase');
  const ps = [t(i, `${nom}: ${c(`${pct(p, i)} de ${D(P)} = ${p} : 100 · ${D(P)} = ${D(cambio)}`)}.`, `${nom}: ${c(`${pct(p, i)} of ${D(P)} = ${p} : 100 · ${D(P)} = ${D(cambio)}`)}.`)];
  if (pregunta === 'final') ps.push(t(i, `Precio final: ${c(`${D(P)} ${r ? '−' : '+'} ${D(cambio)} = ${D(final)}`)}.`, `Final price: ${c(`${D(P)} ${r ? '−' : '+'} ${D(cambio)} = ${D(final)}`)}.`));
  ps.push(t(i, `La respuesta es ${D(respuestaQuePiden(it))}.`, `The answer is ${D(respuestaQuePiden(it))}.`));
  return pasos(ps);
}

export const enunciadoCaza = (it, i) => {
  const { prod, P, p, orden, nombre } = it, A = nombre[i] ?? nombre;
  const primero = orden === 'sube-baja' ? t(i, `sube un ${pct(p, 'es')}`, `goes up by ${pct(p, 'en')}`) : t(i, `baja un ${pct(p, 'es')}`, `goes down by ${pct(p, 'en')}`);
  const luego = orden === 'sube-baja' ? t(i, `baja un ${pct(p, 'es')}`, `goes down by ${pct(p, 'en')}`) : t(i, `sube un ${pct(p, 'es')}`, `goes up by ${pct(p, 'en')}`);
  const sujeto = cap(prod.suj[i]);
  return t(i,
    `${sujeto} cuesta ${dinero(P, 'es')}. Primero ${primero} y después ${luego}. ${A} dice que vuelve a costar ${dinero(P, 'es')}. Compruébalo.`,
    `${sujeto} costs ${dinero(P, 'en')}. First it ${primero} and then it ${luego}. ${A} says it costs ${dinero(P, 'en')} again. Check it.`);
};
export function explicaCaza(it, { idioma = 'es' } = {}) {
  const i = idioma, { P, p, orden, medio, final } = it, D = v => dinero(v, i);
  const s = orden === 'sube-baja', c1 = cambioDe(P, p), c2 = cambioDe(medio, p), dif = P - final;
  const mas = dif > 0;
  return pasos([
    t(i, `Primer cambio: ${c(`${pct(p, i)} de ${D(P)} = ${D(c1)}`)}; ${s ? 'sube' : 'baja'}: ${c(`${D(P)} ${s ? '+' : '−'} ${D(c1)} = ${D(medio)}`)}.`,
      `First change: ${c(`${pct(p, i)} of ${D(P)} = ${D(c1)}`)}; ${s ? 'up' : 'down'}: ${c(`${D(P)} ${s ? '+' : '−'} ${D(c1)} = ${D(medio)}`)}.`),
    t(i, `Segundo cambio, sobre el precio nuevo: ${c(`${pct(p, i)} de ${D(medio)} = ${D(c2)}`)}; ${s ? 'baja' : 'sube'}: ${c(`${D(medio)} ${s ? '−' : '+'} ${D(c2)} = ${D(final)}`)}.`,
      `Second change, on the new price: ${c(`${pct(p, i)} of ${D(medio)} = ${D(c2)}`)}; ${s ? 'down' : 'up'}: ${c(`${D(medio)} ${s ? '−' : '+'} ${D(c2)} = ${D(final)}`)}.`),
    t(i, `La respuesta es ${D(medio)} y ${D(final)}: no se queda igual, cuesta ${D(Math.abs(dif))} ${mas ? 'menos' : 'más'}.`,
      `The answer is ${D(medio)} and ${D(final)}: it does not stay the same, it costs ${D(Math.abs(dif))} ${mas ? 'less' : 'more'}.`),
  ]);
}

// ─── Pantalla ────────────────────────────────────────────────────────────────────────────────────

export const TX = {
  ej1: {
    nombre: ej('En dos pasos', 'In two steps'),
    detalle: ej('El descuento y el precio final', 'The discount and the final price'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Primero se calcula <strong>cuánto</strong> cambia el precio: el porcentaje del precio. Después se <strong>resta</strong> (rebaja) o se <strong>suma</strong> (subida).</p>
        <p>Ejemplo: una camiseta de 24,00 € rebajada un 25 %. Descuento: ${c('25 : 100 · 24,00 € = 6,00 €')}. Precio rebajado: ${c('24,00 € − 6,00 € = 18,00 €')}.</p>`,
      en: `<h2>How it works</h2>
        <p>First work out <strong>how much</strong> the price changes: the percentage of the price. Then <strong>subtract</strong> (reduction) or <strong>add</strong> (increase).</p>
        <p>Example: a €24.00 T-shirt reduced by 25%. Discount: ${c('25 : 100 · €24.00 = €6.00')}. Reduced price: ${c('€24.00 − €6.00 = €18.00')}.</p>`,
    },
    instruccion: ej('Escribe cuánto cambia el precio y cuál es el precio final.', 'Write how much the price changes and what the final price is.'),
    cambioDe: ej('Cambio de precio', 'Price change'), final: ej('Precio final', 'Final price'),
    solucion: { es: it => explicaDosPasos(it, { idioma: 'es' }), en: it => explicaDosPasos(it, { idioma: 'en' }) },
  },
  ej2: {
    nombre: ej('En un paso', 'In one step'),
    detalle: ej('Multiplicar por 0,80 o por 1,20', 'Multiply by 0.80 or by 1.20'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Rebajar un 40 % es <strong>quedarse con el 60 %</strong>: se multiplica por ${c('0,60')}. Subir un 40 % es <strong>pasar al 140 %</strong>: se multiplica por ${c('1,40')}.</p>
        <p>Ejemplo: 60,00 € rebajados un 40 %: ${c('0,60 · 60,00 € = 36,00 €')}.</p>`,
      en: `<h2>How it works</h2>
        <p>Reducing by 40% means <strong>keeping 60%</strong>: you multiply by ${c('0.60')}. Raising by 40% means <strong>going to 140%</strong>: you multiply by ${c('1.40')}.</p>
        <p>Example: €60.00 reduced by 40%: ${c('0.60 · €60.00 = €36.00')}.</p>`,
    },
    instruccionElegir: ej('¿Por qué número se multiplica el precio para sacar el precio final?', 'What number do you multiply the price by to get the final price?'),
    instruccionCalcular: ej('Escribe el precio final.', 'Write the final price.'),
    final: ej('Precio final', 'Final price'),
    solucion: { es: it => explicaUnPaso(it, { idioma: 'es' }), en: it => explicaUnPaso(it, { idioma: 'en' }) },
  },
  ej3: {
    nombre: ej('El IVA', 'VAT'),
    detalle: ej('Precio con IVA del 4, 10 o 21 %', 'Price with 4%, 10% or 21% VAT'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>El IVA es un impuesto que se <strong>suma</strong> al precio. Es del 4 %, del 10 % o del 21 %, según lo que se compre.</p>
        <p>Ejemplo: un videojuego de 20,00 € sin IVA, con el 21 %: IVA ${c('21 : 100 · 20,00 € = 4,20 €')}; con IVA ${c('20,00 € + 4,20 € = 24,20 €')}.</p>`,
      en: `<h2>How it works</h2>
        <p>VAT (IVA) is a tax that is <strong>added</strong> to the price. It is 4%, 10% or 21%, depending on what you buy.</p>
        <p>Example: a €20.00 video game before VAT, with 21%: VAT ${c('21 : 100 · €20.00 = €4.20')}; with VAT ${c('€20.00 + €4.20 = €24.20')}.</p>`,
    },
    instruccion: ej('Escribe el precio con IVA.', 'Write the price with VAT.'),
    final: ej('Precio con IVA', 'Price with VAT'),
    solucion: { es: it => explicaIva(it, { idioma: 'es' }), en: it => explicaIva(it, { idioma: 'en' }) },
  },
  ej4: {
    nombre: ej('¿Qué piden?', 'What are they asking for?'),
    detalle: ej('¿El descuento o el precio final?', 'The discount or the final price?'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lee la <strong>pregunta</strong>: unas veces piden <strong>cuánto</strong> cambia el precio y otras <strong>cómo queda</strong>.</p>
        <p>Ejemplo: 24,00 € rebajados un 25 %. «¿Cuánto se descuenta?» es 6,00 €; «¿cuánto hay que pagar?» es 18,00 €.</p>`,
      en: `<h2>How it works</h2>
        <p>Read the <strong>question</strong>: sometimes they ask <strong>how much</strong> the price changes and sometimes <strong>how it ends up</strong>.</p>
        <p>Example: €24.00 reduced by 25%. “How much is taken off?” is €6.00; “how much do you have to pay?” is €18.00.</p>`,
    },
    instruccion: ej('Elige la respuesta a la pregunta.', 'Choose the answer to the question.'),
    solucion: { es: it => explicaQuePiden(it, { idioma: 'es' }), en: it => explicaQuePiden(it, { idioma: 'en' }) },
  },
  ej5: {
    nombre: ej('¿Vuelve a costar lo mismo?', 'Back to the same price?'),
    detalle: ej('¿Sube y baja lo mismo y se queda igual?', 'Up and down by the same percentage: the same?'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Cada porcentaje se calcula sobre <strong>el precio que hay en ese momento</strong>. Si sube y luego baja, el segundo porcentaje es de un precio mayor.</p>
        <p>Ejemplo: 100,00 € suben un 10 %: ${c('100,00 € + 10,00 € = 110,00 €')}. Bajan un 10 %: ${c('10 : 100 · 110,00 € = 11,00 €')}, y ${c('110,00 € − 11,00 € = 99,00 €')}. No es 100,00 €.</p>`,
      en: `<h2>How it works</h2>
        <p>Each percentage is worked out on <strong>the price at that moment</strong>. If it goes up and then down, the second percentage is of a different price.</p>
        <p>Example: €100.00 goes up by 10%: ${c('€100.00 + €10.00 = €110.00')}. Then down by 10%: ${c('10 : 100 · €110.00 = €11.00')}, and ${c('€110.00 − €11.00 = €99.00')}. It is not €100.00.</p>`,
    },
    instruccion: ej('Escribe el precio después del primer cambio y el precio final.', 'Write the price after the first change and the final price.'),
    medio: ej('Después del primer cambio', 'After the first change'), final: ej('Precio final', 'Final price'),
    solucion: { es: it => explicaCaza(it, { idioma: 'es' }), en: it => explicaCaza(it, { idioma: 'en' }) },
  },
};
export { factorTxt };
