// Porcentajes (unidad 7): el tanto por ciento de una cantidad, el total, qué porcentaje es, rebajas,
// subidas, IVA, precio original e interés (simple de un año y compuesto de 2-3 años). Cada subtipo
// declara las destrezas del inventario de la unidad 7 que cubre (`items`). El dinero va en céntimos
// enteros. Los contextos y sus cotas están en contextos_proporcionalidad.js.
// Fuera, por el acta de la U7: el interés simple de varios años y los aumentos y descuentos sucesivos.

import { construirOpciones, conReintentos, erroresDe, tex, redondear, mcd } from './index.js';
import { GRUPOS, REBAJAS, SUBIDAS, SUBIDA, IVA_CONTEXTOS, DESCUENTOS, INTERES, eurosTex, eurosEs, eurosEn } from './contextos_proporcionalidad.js';

const e = (id, es, en) => [id, { concepto: 'porcentajes', es, en }];
export const errores = Object.fromEntries([
  e('olvida_dividir_entre_100', 'Un tanto por ciento se calcula multiplicando y dividiendo entre 100; te falta la división.', 'A percentage is worked out by multiplying and then dividing by 100; you are missing the division.'),
  e('multiplica_por_el_denominador', 'El 25 % es la cuarta parte: se divide entre 4, no se multiplica por 4 (y lo mismo con el 10 %, el 20 % y el 50 %).', '25% is a quarter: you divide by 4, you do not multiply by 4 (and the same goes for 10%, 20% and 50%).'),
  e('da_el_resto', 'Has calculado lo que queda (el resto), pero te piden la parte.', 'You worked out what is left (the rest), but the question asks for the part.'),
  e('da_la_parte', 'Has calculado la parte, pero te piden lo que queda (el resto).', 'You worked out the part, but the question asks for what is left (the rest).'),
  e('toma_la_mitad', 'El porcentaje no siempre es la mitad: la mitad es el 50 %, no cualquier otro tanto por ciento.', 'A percentage is not always half: half is 50%, not any other percentage.'),
  e('suma_el_porcentaje', 'El tanto por ciento no se suma directamente a la cantidad: hay que calcular el porcentaje de la cantidad.', 'The percentage is not added straight to the amount: you must work out the percentage of the amount.'),
  e('resta_el_porcentaje', 'El tanto por ciento no se resta directamente a la cantidad: hay que calcular el porcentaje de la cantidad.', 'The percentage is not subtracted straight from the amount: you must work out the percentage of the amount.'),
  e('suma_en_vez_de_restar', 'Te piden lo que queda: hay que restar la parte al total, no sumarla.', 'You are asked for what is left: you must subtract the part from the total, not add it.'),
  e('calcula_el_porcentaje_de_la_parte', 'El porcentaje es de la cantidad total, que es lo que te piden; tú lo has calculado sobre la parte.', 'The percentage is of the whole amount, which is what you are asked for; you worked it out on the part.'),
  e('multiplica_por_el_porcentaje', 'Para hallar el total no se multiplica por el porcentaje: se multiplica la parte por 100 y se divide entre el porcentaje.', 'To find the whole you do not multiply by the percentage: you multiply the part by 100 and divide by the percentage.'),
  e('se_queda_en_la_parte', 'Esa es la parte; el total es mayor y es lo que te piden.', 'That is the part; the whole is greater and it is what you are asked for.'),
  e('usa_el_complementario', 'El porcentaje que te dan es el de la parte, no el de lo que queda: revisa a qué corresponde.', 'The percentage you are given is the part’s, not the percentage of what is left: check what it belongs to.'),
  e('olvida_multiplicar_por_100', 'Para pasar una fracción a porcentaje hay que multiplicar por 100.', 'To change a fraction into a percentage you have to multiply by 100.'),
  e('da_el_complementario', 'Ese es el porcentaje de lo que no cumple: te piden el de la parte.', 'That is the percentage of those who do not: you are asked for the part’s.'),
  e('divide_al_reves', 'Hay que dividir la parte entre el total, no el total entre la parte.', 'You must divide the part by the whole, not the whole by the part.'),
  e('resta_en_vez_de_dividir', 'Para hallar qué porcentaje es una cantidad de otra hay que dividir, no restar.', 'To find what percentage one amount is of another you have to divide, not subtract.'),
  e('olvida_restar', 'Eso es solo el descuento; falta restarlo al precio inicial.', 'That is just the discount; you still need to subtract it from the original price.'),
  e('olvida_sumar', 'Eso es solo lo que sube (o el IVA); falta sumarlo al precio inicial.', 'That is just the increase (or the VAT); you still need to add it to the original price.'),
  e('invierte_aumento_descuento', 'Revisa si el precio sube o baja: has hecho lo contrario de lo que dice el enunciado.', 'Check whether the price goes up or down: you did the opposite of what the statement says.'),
  e('usa_el_porcentaje_como_euros', 'El porcentaje no son euros: hay que calcular ese porcentaje del precio.', 'The percentage is not a number of euros: you must work out that percentage of the price.'),
  e('suma_el_porcentaje_al_precio_final', 'El descuento se calcula sobre el precio de antes de rebajar, no sobre el que se paga ahora.', 'The discount is worked out on the price before the sale, not on the price paid now.'),
  e('divide_entre_el_descuento', 'Se paga el (100 − descuento) % del precio de antes: hay que dividir entre ese porcentaje, no entre el del descuento.', 'You pay (100 − discount)% of the old price: you must divide by that percentage, not by the discount.'),
  e('da_el_porcentaje_del_precio_final', 'Has calculado el porcentaje del precio que se paga ahora, no del de antes de rebajar.', 'You worked out the percentage of the price paid now, not of the price before the sale.'),
  e('confunde_interes_con_capital_final', 'Eso es el capital final (lo que tendrías en la cuenta), no los intereses ganados.', 'That is the final balance (what you would have in the account), not the interest earned.'),
  e('resta_el_interes', 'Los intereses se ganan: no se restan al capital, y lo que pides son los intereses.', 'Interest is earned: it is not subtracted from the capital, and what you are asked for is the interest.'),
  e('trata_como_interes_simple', 'En el interés compuesto, el interés de cada año se calcula sobre el capital acumulado, no siempre sobre el capital inicial.', 'With compound interest, each year’s interest is worked out on the accumulated capital, not always on the original capital.'),
  e('olvida_un_ano', 'Falta el interés de algún año: hay que sumar el de todos los años.', 'The interest of some year is missing: you must add the interest of every year.'),
  e('solo_el_ultimo_ano', 'Eso es solo el interés del último año: hay que sumar el de todos los años.', 'That is only the last year’s interest: you must add the interest of every year.'),
]);
const E = erroresDe(errores);

const P = ' %';
export const preguntas = {
  calcula_porcentaje: { es: 'Calcula el {p}' + P + ' de {cantidad}.', en: 'Work out {p}% of {cantidad}.' },
  interes_simple: { es: 'Depositas {capital} € en un banco que paga un {p}' + P + ' de interés al año. ¿Cuántos euros de interés ganas en un año?', en: 'You deposit €{capital_en} in a bank that pays {p}% interest per year. How many euros of interest do you earn in one year?' },
  interes_compuesto: { es: 'Depositas {capital} € a un {p}' + P + ' de interés compuesto anual, es decir, cada año el interés se calcula sobre lo que hay en la cuenta. ¿Cuántos euros de interés ganas en {anos} años?', en: 'You deposit €{capital_en} at {p}% compound interest per year, that is, each year the interest is worked out on what is in the account. How many euros of interest do you earn in {anos} years?' },
  ...Object.fromEntries(GRUPOS.flatMap(c => ['parte', 'resto', 'total', 'cual'].map(k => [`grupo_${k}_${c.id}`, { es: c[k][0], en: c[k][1] }]))),
  ...Object.fromEntries(REBAJAS.flatMap(c => [
    [`descuento_${c.id}`, { es: c.descuento[0], en: c.descuento[1] }],
    [`precio_original_${c.id}`, { es: c.original[0], en: c.original[1] }],
  ])),
  ...Object.fromEntries(SUBIDAS.map(c => [`subida_${c.id}`, { es: c.es, en: c.en }])),
  ...Object.fromEntries(IVA_CONTEXTOS.map(c => [`iva_${c.id}`, { es: c.es, en: c.en }])),
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  multiplicar_por_p: { es: 'Multiplicamos la cantidad por el tanto por ciento.', en: 'We multiply the amount by the percentage.' },
  dividir_entre_100: { es: 'Y dividimos entre 100.', en: 'And we divide by 100.' },
  restar_la_parte: { es: 'Restamos la parte al total para hallar lo que queda.', en: 'We subtract the part from the whole to find what is left.' },
  multiplicar_parte_100: { es: 'Multiplicamos la parte por 100.', en: 'We multiply the part by 100.' },
  dividir_entre_p: { es: 'Y dividimos entre el tanto por ciento.', en: 'And we divide by the percentage.' },
  dividir_entre_total: { es: 'Dividimos entre el total: sale el tanto por ciento.', en: 'We divide by the whole: that gives the percentage.' },
  calcular_cambio: { es: 'Calculamos el descuento, la subida o el IVA.', en: 'We work out the discount, the increase or the VAT.' },
  restar_descuento: { es: 'Restamos el descuento al precio inicial.', en: 'We subtract the discount from the original price.' },
  sumar_aumento: { es: 'Sumamos la subida (o el IVA) al precio inicial.', en: 'We add the increase (or the VAT) to the original price.' },
  porcentaje_que_se_paga: { es: 'Se paga el 100 % menos el descuento.', en: 'You pay 100% minus the discount.' },
  precio_por_100: { es: 'Multiplicamos lo que se paga por 100.', en: 'We multiply what is paid by 100.' },
  dividir_entre_lo_que_se_paga: { es: 'Y dividimos entre el porcentaje que se paga.', en: 'And we divide by the percentage that is paid.' },
  interes_un_ano: { es: 'Calculamos el interés de un año.', en: 'We work out one year’s interest.' },
  interes_ano_1: { es: 'Interés del primer año.', en: 'First year’s interest.' },
  interes_ano_2: { es: 'Interés del segundo año, ya sobre el capital acumulado.', en: 'Second year’s interest, now on the accumulated capital.' },
  interes_ano_3: { es: 'Interés del tercer año, sobre el capital acumulado.', en: 'Third year’s interest, on the accumulated capital.' },
  sumar_al_capital: { es: 'Sumamos ese interés al capital.', en: 'We add that interest to the capital.' },
  sumar_intereses: { es: 'Sumamos los intereses de todos los años.', en: 'We add the interest of all the years.' },
};

// --- Utilidades --------------------------------------------------------------------------------
const T = tex;
const paso = (t, nota = null, calculo = null) => ({ tex: t, nota, calculo });
const mal = (t, calculo = null) => ({ tex: t, mal: true, calculo });
const dinero = (c, error, pasos) => ({ tex: eurosTex(c), clave: c, error, pasos });
const num = (v, error, pasos) => ({ tex: T(v), clave: redondear(v), error, pasos });
const pool = (rng, lista) => rng.barajar(lista.filter(Boolean));
const exacto = (a, b) => a % b === 0;
/** Múltiplo de `paso` elegido en [min, max], o null si no cabe ninguno. */
const multiplo = (rng, paso_, min, max) => {
  const lo = Math.ceil(min / paso_), hi = Math.floor(max / paso_);
  return lo > hi ? null : paso_ * rng.entero(lo, hi);
};
/** Paso mínimo para que `cantidad · p / 100` salga entero. */
const unidadDe = p => 100 / mcd(100, p);

// --- Subtipos ----------------------------------------------------------------------------------
function porcentajeFacil(rng) {
  const p = rng.elegir([1, 10, 20, 25, 50, 75]);
  const u = unidadDe(p);
  const cantidad = multiplo(rng, u, 10, 1000);
  if (cantidad === null) return null;
  const correcta = cantidad * p / 100;
  return {
    texto: { clave: 'calcula_porcentaje', params: { p, cantidad } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(cantidad)} \\cdot ${p} = ${T(cantidad * p)}`, 'multiplicar_por_p'),
      paso(`${T(cantidad * p)} \\div 100 = ${T(correcta)}`, 'dividir_entre_100'),
    ],
    distractores: pool(rng, [
      num(cantidad * p, E('olvida_dividir_entre_100'), [mal(`${T(cantidad)} \\cdot ${p} = ${T(cantidad * p)}`)]),
      exacto(100, p) && num(cantidad * (100 / p), E('multiplica_por_el_denominador'), [mal(`${T(cantidad)} \\cdot ${100 / p} = ${T(cantidad * (100 / p))}`)]),
      num(cantidad - correcta, E('da_el_resto'), [paso(`${T(cantidad)} \\cdot ${p} \\div 100 = ${T(correcta)}`), mal(`${T(cantidad)} - ${T(correcta)} = ${T(cantidad - correcta)}`)]),
      exacto(cantidad, 2) && num(cantidad / 2, E('toma_la_mitad'), [mal(`${T(cantidad)} \\div 2 = ${T(cantidad / 2)}`)]),
      num(cantidad + p, E('suma_el_porcentaje'), [mal(`${T(cantidad)} + ${p} = ${T(cantidad + p)}`)]),
    ]),
  };
}

/** Datos de un grupo: total t, porcentaje p y parte n, con n entero. */
function datosGrupo(rng, ctx) {
  const p = rng.entero(2, 98);
  const t = multiplo(rng, unidadDe(p), ctx.t[0], ctx.t[1]);
  return t === null ? null : { p, t, n: t * p / 100 };
}

const grupoParte = resto => rng => {
  const ctx = rng.elegir(GRUPOS);
  const d = datosGrupo(rng, ctx);
  if (!d) return null;
  const { p, t, n } = d;
  const correcta = resto ? t - n : n;
  const pasos = [
    paso(`${T(t)} \\cdot ${p} = ${T(t * p)}`, 'multiplicar_por_p'),
    paso(`${T(t * p)} \\div 100 = ${T(n)}`, 'dividir_entre_100'),
  ];
  if (resto) pasos.push(paso(`${T(t)} - ${T(n)} = ${T(correcta)}`, 'restar_la_parte'));
  const previos = [paso(`${T(t)} \\cdot ${p} \\div 100 = ${T(n)}`)];
  return {
    texto: { clave: `grupo_${resto ? 'resto' : 'parte'}_${ctx.id}`, params: { t, p } },
    enunciado: '',
    correcta: num(correcta),
    solucion: pasos,
    distractores: pool(rng, resto ? [
      num(n, E('da_la_parte'), [mal(`${T(t)} \\cdot ${p} \\div 100 = ${T(n)}`)]),
      num(t * p, E('olvida_dividir_entre_100'), [mal(`${T(t)} \\cdot ${p} = ${T(t * p)}`)]),
      num(t - p, E('resta_el_porcentaje'), [mal(`${T(t)} - ${p} = ${T(t - p)}`)]),
      num(t + n, E('suma_en_vez_de_restar'), [...previos, mal(`${T(t)} + ${T(n)} = ${T(t + n)}`)]),
    ] : [
      num(t - n, E('da_el_resto'), [...previos, mal(`${T(t)} - ${T(n)} = ${T(t - n)}`)]),
      num(t * p, E('olvida_dividir_entre_100'), [mal(`${T(t)} \\cdot ${p} = ${T(t * p)}`)]),
      num(t + p, E('suma_el_porcentaje'), [mal(`${T(t)} + ${p} = ${T(t + p)}`)]),
      exacto(t, 2) && num(t / 2, E('toma_la_mitad'), [mal(`${T(t)} \\div 2 = ${T(t / 2)}`)]),
    ]),
  };
};

function grupoTotal(rng) {
  const ctx = rng.elegir(GRUPOS);
  const d = datosGrupo(rng, ctx);
  if (!d) return null;
  const { p, t, n } = d;
  const delaParte = exacto(n * p, 100) ? n * p / 100 : null;
  const complementario = exacto(n * (100 - p), p) ? n * (100 - p) / p : null;
  return {
    texto: { clave: `grupo_total_${ctx.id}`, params: { p, n } },
    enunciado: '',
    correcta: num(t),
    solucion: [
      paso(`${T(n)} \\cdot 100 = ${T(n * 100)}`, 'multiplicar_parte_100'),
      paso(`${T(n * 100)} \\div ${p} = ${T(t)}`, 'dividir_entre_p'),
    ],
    distractores: pool(rng, [
      delaParte !== null && num(delaParte, E('calcula_el_porcentaje_de_la_parte'), [mal(`${T(n)} \\cdot ${p} \\div 100 = ${T(delaParte)}`)]),
      num(n * p, E('multiplica_por_el_porcentaje'), [mal(`${T(n)} \\cdot ${p} = ${T(n * p)}`)]),
      num(n + p, E('suma_el_porcentaje'), [mal(`${T(n)} + ${p} = ${T(n + p)}`)]),
      complementario !== null && num(complementario, E('usa_el_complementario'), [mal(`${T(n)} \\cdot ${100 - p} \\div ${p} = ${T(complementario)}`)]),
      num(n, E('se_queda_en_la_parte'), [mal(`x = ${T(n)}`)]),
    ]),
  };
}

function grupoCual(rng) {
  const ctx = rng.elegir(GRUPOS);
  const p = rng.entero(1, 99);
  const t = multiplo(rng, unidadDe(p), ctx.t[0], ctx.t[1]);
  if (t === null) return null;
  const n = t * p / 100;
  const alReves = exacto(t * 100, n) ? t * 100 / n : null;
  return {
    texto: { clave: `grupo_cual_${ctx.id}`, params: { t, n } },
    enunciado: '',
    correcta: num(p),
    solucion: [
      paso(`${T(n)} \\cdot 100 = ${T(n * 100)}`, 'multiplicar_parte_100'),
      paso(`${T(n * 100)} \\div ${T(t)} = ${p}`, 'dividir_entre_total'),
    ],
    distractores: pool(rng, [
      num(n / t, E('olvida_multiplicar_por_100'), [mal(`${T(n)} \\div ${T(t)} = ${T(n / t)}`)]),
      num(100 - p, E('da_el_complementario'), [paso(`${T(n)} \\cdot 100 \\div ${T(t)} = ${p}`), mal(`100 - ${p} = ${100 - p}`)]),
      alReves !== null && num(alReves, E('divide_al_reves'), [mal(`${T(t)} \\cdot 100 \\div ${T(n)} = ${T(alReves)}`)]),
      num(t - n, E('resta_en_vez_de_dividir'), [mal(`${T(t)} - ${T(n)} = ${T(t - n)}`)]),
    ]),
  };
}

/** Descuento (signo −1) o subida (+1) de un precio. */
const cambioDePrecio = signo => rng => {
  const ctx = signo < 0 ? rng.elegir(REBAJAS) : rng.elegir(SUBIDAS);
  const p = signo < 0 ? rng.elegir(DESCUENTOS) : rng.entero(SUBIDA.min, SUBIDA.max);
  const precio = multiplo(rng, ctx.paso, ctx.precio[0], ctx.precio[1]);
  if (!exacto(precio * p, 100)) return null;
  const cambio = precio * p / 100;
  const correcta = precio + signo * cambio;
  if (correcta <= 0 || precio - p * 100 <= 0) return null;
  const en = signo < 0;
  return {
    texto: { clave: `${en ? 'descuento' : 'subida'}_${ctx.id}`, params: { precio: eurosEs(precio), precio_en: eurosEn(precio), p } },
    enunciado: '',
    correcta: dinero(correcta),
    solucion: [
      paso(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cambio)}`, 'calcular_cambio'),
      paso(`${eurosTex(precio)} ${en ? '-' : '+'} ${eurosTex(cambio)} = ${eurosTex(correcta)}`, en ? 'restar_descuento' : 'sumar_aumento'),
    ],
    distractores: pool(rng, [
      dinero(cambio, E(en ? 'olvida_restar' : 'olvida_sumar'), [mal(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cambio)}`)]),
      dinero(precio - signo * cambio, E('invierte_aumento_descuento'), [paso(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cambio)}`), mal(`${eurosTex(precio)} ${en ? '+' : '-'} ${eurosTex(cambio)} = ${eurosTex(precio - signo * cambio)}`)]),
      dinero(precio + signo * p * 100, E('usa_el_porcentaje_como_euros'), [mal(`${eurosTex(precio)} ${en ? '-' : '+'} ${p} = ${eurosTex(precio + signo * p * 100)}`)]),
    ]),
  };
};

function iva(rng) {
  const ctx = rng.elegir(IVA_CONTEXTOS);
  const p = rng.elegir(ctx.iva);
  const precio = multiplo(rng, unidadDe(p), ctx.precio[0], ctx.precio[1]);
  if (precio === null) return null;
  const cuota = precio * p / 100, correcta = precio + cuota;
  return {
    texto: { clave: `iva_${ctx.id}`, params: { precio: eurosEs(precio), precio_en: eurosEn(precio), p } },
    enunciado: '',
    correcta: dinero(correcta),
    solucion: [
      paso(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cuota)}`, 'calcular_cambio'),
      paso(`${eurosTex(precio)} + ${eurosTex(cuota)} = ${eurosTex(correcta)}`, 'sumar_aumento'),
    ],
    distractores: pool(rng, [
      dinero(cuota, E('olvida_sumar'), [mal(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cuota)}`)]),
      dinero(precio - cuota, E('invierte_aumento_descuento'), [paso(`${eurosTex(precio)} \\cdot ${p} \\div 100 = ${eurosTex(cuota)}`), mal(`${eurosTex(precio)} - ${eurosTex(cuota)} = ${eurosTex(precio - cuota)}`)]),
      dinero(precio + p * 100, E('usa_el_porcentaje_como_euros'), [mal(`${eurosTex(precio)} + ${p} = ${eurosTex(precio + p * 100)}`)]),
    ]),
  };
}

function precioOriginal(rng) {
  const ctx = rng.elegir(REBAJAS);
  const p = rng.elegir(DESCUENTOS);
  const original = multiplo(rng, ctx.paso, ctx.precio[0], ctx.precio[1]);
  const q = 100 - p;
  const final = original * q / 100;
  const sobreFinal = exacto(final * p, 100) ? final * p / 100 : null;
  const entreDescuento = exacto(final * 100, p) ? final * 100 / p : null;
  return {
    texto: { clave: `precio_original_${ctx.id}`, params: { precio: eurosEs(final), precio_en: eurosEn(final), p } },
    enunciado: '',
    correcta: dinero(original),
    solucion: [
      paso(`100 - ${p} = ${q}`, 'porcentaje_que_se_paga'),
      paso(`${eurosTex(final)} \\cdot 100 = ${eurosTex(final * 100)}`, 'precio_por_100'),
      paso(`${eurosTex(final * 100)} \\div ${q} = ${eurosTex(original)}`, 'dividir_entre_lo_que_se_paga'),
    ],
    distractores: pool(rng, [
      sobreFinal !== null && dinero(final + sobreFinal, E('suma_el_porcentaje_al_precio_final'), [mal(`${eurosTex(final)} + ${eurosTex(sobreFinal)} = ${eurosTex(final + sobreFinal)}`)]),
      dinero(final + p * 100, E('usa_el_porcentaje_como_euros'), [mal(`${eurosTex(final)} + ${p} = ${eurosTex(final + p * 100)}`)]),
      entreDescuento !== null && dinero(entreDescuento, E('divide_entre_el_descuento'), [paso(`${eurosTex(final)} \\cdot 100 = ${eurosTex(final * 100)}`), mal(`${eurosTex(final * 100)} \\div ${p} = ${eurosTex(entreDescuento)}`)]),
      sobreFinal !== null && dinero(sobreFinal, E('da_el_porcentaje_del_precio_final'), [mal(`${eurosTex(final)} \\cdot ${p} \\div 100 = ${eurosTex(sobreFinal)}`)]),
    ]),
  };
}

function interesSimple(rng) {
  const p = rng.entero(INTERES.tipo[0], INTERES.tipo[1]);
  const capital = multiplo(rng, INTERES.pasoCapital * 100, INTERES.capital[0] * 100, INTERES.capital[1] * 100);
  const interes = capital * p / 100;
  return {
    texto: { clave: 'interes_simple', params: { capital: eurosEs(capital), capital_en: eurosEn(capital), p } },
    enunciado: '',
    correcta: dinero(interes),
    solucion: [paso(`${eurosTex(capital)} \\cdot ${p} \\div 100 = ${eurosTex(interes)}`, 'interes_un_ano')],
    distractores: pool(rng, [
      dinero(capital + interes, E('confunde_interes_con_capital_final'), [paso(`${eurosTex(capital)} \\cdot ${p} \\div 100 = ${eurosTex(interes)}`), mal(`${eurosTex(capital)} + ${eurosTex(interes)} = ${eurosTex(capital + interes)}`)]),
      dinero(interes * 100, E('olvida_dividir_entre_100'), [mal(`${eurosTex(capital)} \\cdot ${p} = ${eurosTex(interes * 100)}`)]),
      dinero(p * 100, E('usa_el_porcentaje_como_euros'), [mal(`x = ${eurosTex(p * 100)}`)]),
      dinero(capital - interes, E('resta_el_interes'), [paso(`${eurosTex(capital)} \\cdot ${p} \\div 100 = ${eurosTex(interes)}`), mal(`${eurosTex(capital)} - ${eurosTex(interes)} = ${eurosTex(capital - interes)}`)]),
    ]),
  };
}

function interesCompuesto(rng) {
  const p = rng.entero(INTERES.tipo[0], INTERES.tipo[1]);
  const anos = rng.entero(2, 3);
  const capital = multiplo(rng, INTERES.pasoCapital * 100, INTERES.capital[0] * 100, INTERES.capital[1] * 100);
  const intereses = [], capitales = [capital];
  for (let y = 0; y < anos; y++) {
    const cap = capitales[y];
    if (!exacto(cap * p, 100)) return null;
    intereses.push(cap * p / 100);
    capitales.push(cap + intereses[y]);
  }
  const total = intereses.reduce((x, y) => x + y, 0);
  const pasos = [];
  intereses.forEach((i, y) => {
    pasos.push(paso(`${eurosTex(capitales[y])} \\cdot ${p} \\div 100 = ${eurosTex(i)}`, `interes_ano_${y + 1}`));
    if (y < anos - 1) pasos.push(paso(`${eurosTex(capitales[y])} + ${eurosTex(i)} = ${eurosTex(capitales[y + 1])}`, 'sumar_al_capital'));
  });
  pasos.push(paso(`${intereses.map(eurosTex).join(' + ')} = ${eurosTex(total)}`, 'sumar_intereses'));
  const previos = pasos.slice(0, -1);
  const sinUltimo = total - intereses[anos - 1];
  return {
    texto: { clave: 'interes_compuesto', params: { capital: eurosEs(capital), capital_en: eurosEn(capital), p, anos } },
    enunciado: '',
    correcta: dinero(total),
    solucion: pasos,
    distractores: pool(rng, [
      dinero(intereses[0] * anos, E('trata_como_interes_simple'), [mal(`${eurosTex(intereses[0])} \\cdot ${anos} = ${eurosTex(intereses[0] * anos)}`)]),
      dinero(capitales[anos], E('confunde_interes_con_capital_final'), [...previos, mal(`${eurosTex(capitales[anos - 1])} + ${eurosTex(intereses[anos - 1])} = ${eurosTex(capitales[anos])}`)]),
      dinero(sinUltimo, E('olvida_un_ano'), [mal(`${intereses.slice(0, -1).map(eurosTex).join(' + ')} = ${eurosTex(sinUltimo)}`)]),
      dinero(intereses[anos - 1], E('solo_el_ultimo_ano'), [...previos, mal(`x = ${eurosTex(intereses[anos - 1])}`)]),
    ]),
  };
}

export const SUBTIPOS = [
  { id: 'porcentaje_facil', items: ['U7-3C-02', 'U7-3C-04'], forma: porcentajeFacil },
  { id: 'grupo_parte', items: ['U7-3A-01', 'U7-3C-04'], forma: grupoParte(false) },
  { id: 'grupo_resto', items: ['U7-3A-01'], forma: grupoParte(true) },
  { id: 'grupo_total', items: ['U7-3A-02', 'U7-3C-07'], forma: grupoTotal },
  { id: 'grupo_cual', items: ['U7-3A-04', 'U7-3C-06'], forma: grupoCual },
  { id: 'descuento', items: ['U7-3A-05'], forma: cambioDePrecio(-1) },
  { id: 'subida', items: ['U7-3A-05'], forma: cambioDePrecio(1) },
  { id: 'iva', items: ['U7-3C-11'], forma: iva },
  { id: 'precio_original', items: ['U7-3A-06'], forma: precioOriginal },
  { id: 'interes_simple', items: ['U7-5A-08'], forma: interesSimple },
  { id: 'interes_compuesto', items: ['U7-5A-09'], forma: interesCompuesto },
].map(s => ({
  ...s,
  generar: conReintentos(rng => {
    const datos = s.forma(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: datos.texto, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
}));

export default {
  id: 'porcentajes',
  nombre: { es: 'Porcentajes', en: 'Percentages' },
  curso: 1,
  concepto: 'porcentajes',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
