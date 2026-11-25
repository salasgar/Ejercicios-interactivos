// Proporcionalidad directa e inversa, escalas y repartos (unidad 7): problemas con
// enunciado, sin fórmula. Cada subtipo declara las destrezas del inventario de la unidad 7
// que cubre (`items`), como en expresiones_algebraicas.js. El dinero va en céntimos enteros.
// Los contextos y sus cotas de realismo están en contextos_proporcionalidad.js.

import { construirOpciones, conReintentos, erroresDe, tex, redondear, mcd } from './index.js';
import { COMPRA_PESO, RECETAS, OBREROS, ESCALAS, REPARTOS, eurosTex, eurosEs, eurosEn } from './contextos_proporcionalidad.js';

const e = (id, es, en) => [id, { concepto: 'proporcionalidad', es, en }];
export const errores = Object.fromEntries([
  e('multiplica_sin_hallar_unidad', 'Antes de multiplicar hay que hallar cuánto vale una sola unidad, dividiendo primero.', 'Before multiplying you must first find the value of a single unit, by dividing first.'),
  e('suma_la_diferencia', 'Esto es una proporcionalidad: no se suma lo que cambia el dato, se multiplica por el valor de una unidad.', 'This is a proportion: you do not add what the figure changes by, you multiply by the value of one unit.'),
  e('trata_como_inversa', 'Si hay más cantidad, el resultado también es mayor: es proporcionalidad directa, no hay que dividir al revés.', 'With more quantity the result is also greater: this is direct proportion, so you must not divide the other way round.'),
  e('multiplica_los_dos_datos', 'Has multiplicado dos cantidades de la misma magnitud: falta el valor de una unidad.', 'You multiplied two quantities of the same kind: the value of one unit is missing.'),
  e('se_queda_en_el_valor_de_una_unidad', 'Eso es lo que vale una sola unidad; falta multiplicarlo por la cantidad que piden.', 'That is what a single unit is worth; you still have to multiply it by the amount asked for.'),
  e('no_ajusta_al_cambiar', 'Al cambiar el número de trabajadores, el tiempo también cambia: no se queda igual.', 'When the number of workers changes, the time changes too: it does not stay the same.'),
  e('trata_como_suma', 'La proporcionalidad inversa no es una diferencia: hay que multiplicar y dividir, no sumar ni restar.', 'Inverse proportionality is not a difference: you must multiply and divide, not add or subtract.'),
  e('trata_como_directa', 'Con más trabajadores se tarda menos: es proporcionalidad inversa, no hay que multiplicar por el cambio.', 'With more workers it takes less time: this is inverse proportion, so you must not scale up by the change.'),
  e('olvida_dividir_entre_los_nuevos', 'Eso es el trabajo total; falta repartirlo entre los nuevos trabajadores.', 'That is the total work; you still have to share it among the new workers.'),
  e('confunde_dias_con_obreros', 'Esa cifra es el número de trabajadores (o de máquinas), no el tiempo que pide la pregunta.', 'That figure is the number of workers (or machines), not the time the question asks for.'),
  e('no_cambia_de_unidad', 'Has dejado el resultado en centímetros: falta pasarlo a la unidad que piden.', 'You left the result in centimetres: you still have to change it to the unit asked for.'),
  e('cambia_mal_de_unidad', 'El cambio de unidad está mal hecho: revisa cuántos centímetros tiene un metro o un kilómetro.', 'The change of unit is wrong: check how many centimetres there are in a metre or a kilometre.'),
  e('olvida_la_escala', 'Esa es la medida del plano: falta aplicar la escala para pasarla a la realidad.', 'That is the measurement on the plan: you still have to apply the scale to get the real one.'),
  e('no_divide_entre_la_escala', 'Has pasado a centímetros reales, pero falta dividir entre la escala para obtener la medida del plano.', 'You changed to real centimetres, but you still have to divide by the scale to get the measurement on the plan.'),
  e('no_aplica_la_escala', 'Esa es la medida real: falta aplicar la escala para pasarla al plano.', 'That is the real measurement: you still have to apply the scale to get the plan.'),
  e('multiplica_en_vez_de_dividir', 'Del real al plano se divide entre la escala, no se multiplica.', 'From real life to the plan you divide by the scale, you do not multiply.'),
  e('reparte_a_partes_iguales', 'Un reparto proporcional no es a partes iguales: cada parte depende del número al que es proporcional.', 'A proportional share is not split equally: each part depends on the number it is proportional to.'),
  e('invierte_las_partes', 'Has calculado la parte de otra persona: revisa a quién corresponde la parte que te piden.', 'You worked out someone else’s part: check whose part is being asked for.'),
  e('multiplica_sin_dividir_entre_suma', 'Antes de multiplicar por la parte hay que dividir el total entre la suma de todas las partes.', 'Before multiplying by the part, you must divide the total by the sum of all the parts.'),
  e('se_queda_en_el_valor_de_una_parte', 'Eso es lo que vale una sola parte; falta multiplicarlo por el número de partes que le tocan.', 'That is what a single part is worth; you still have to multiply it by the number of parts it gets.'),
]);
const E = erroresDe(errores);

export const preguntas = {
  reparto_razon: { es: 'Un premio de {total} € se reparte entre dos amigos en la razón {a} : {b}. ¿Cuántos euros recibe el primero?', en: 'A prize of €{total_en} is shared between two friends in the ratio {a} : {b}. How many euros does the first one get?' },
  ...Object.fromEntries(COMPRA_PESO.map(c => [`directa_unidad_${c.id}`, { es: c.es, en: c.en }])),
  ...Object.fromEntries(RECETAS.map(c => [`directa_receta_${c.id}`, { es: c.es, en: c.en }])),
  ...Object.fromEntries(OBREROS.map(c => [`inversa_${c.id}`, { es: c.es, en: c.en }])),
  ...Object.fromEntries(ESCALAS.flatMap(c => [
    [`escala_a_real_${c.id}`, { es: c.es_real, en: c.en_real }],
    [`escala_a_plano_${c.id}`, { es: c.es_plano, en: c.en_plano }],
  ])),
  ...Object.fromEntries(REPARTOS.map(c => [`reparto_aportaciones_${c.id}`, { es: c.es, en: c.en }])),
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  hallar_unidad: { es: 'Hallamos cuánto vale una unidad.', en: 'We find the value of one unit.' },
  multiplicar_unidad: { es: 'Multiplicamos el valor de una unidad por la cantidad pedida.', en: 'We multiply the value of one unit by the amount asked for.' },
  hallar_unidad_receta: { es: 'Hallamos la cantidad para una persona.', en: 'We find the amount for one person.' },
  multiplicar_personas: { es: 'Multiplicamos por el número de personas.', en: 'We multiply by the number of people.' },
  trabajo_total: { es: 'Calculamos el trabajo total, en trabajadores por unidad de tiempo: no cambia aunque cambien los trabajadores.', en: 'We work out the total work, in workers times time: it stays the same even if the number of workers changes.' },
  dividir_entre_nuevos: { es: 'Repartimos ese trabajo total entre los nuevos trabajadores.', en: 'We share that total work among the new workers.' },
  escala_a_cm: { es: 'Multiplicamos la medida del plano por la escala: sale en centímetros reales.', en: 'We multiply the measurement on the plan by the scale: it comes out in real centimetres.' },
  cm_a_unidad: { es: 'Pasamos los centímetros a la unidad que piden.', en: 'We change the centimetres into the unit asked for.' },
  real_a_cm: { es: 'Pasamos la medida real a centímetros.', en: 'We change the real measurement into centimetres.' },
  dividir_entre_escala: { es: 'Dividimos entre la escala para obtener los centímetros del plano.', en: 'We divide by the scale to get the centimetres on the plan.' },
  sumar_partes: { es: 'Sumamos los números a los que hay que repartir de forma proporcional.', en: 'We add the numbers the amount has to be shared proportionally to.' },
  hallar_valor_parte: { es: 'Dividimos el total entre esa suma para saber cuánto vale cada parte.', en: 'We divide the total by that sum to find the value of each part.' },
  multiplicar_por_parte: { es: 'Multiplicamos el valor de una parte por las partes que le tocan al primero.', en: 'We multiply the value of one part by the number of parts the first one gets.' },
};

// --- Utilidades --------------------------------------------------------------------------------
const T = tex;
const paso = (t, nota = null, calculo = null) => ({ tex: t, nota, calculo });
const mal = (t, calculo = null) => ({ tex: t, mal: true, calculo });
const dinero = (c, error, pasos) => ({ tex: eurosTex(c), clave: c, error, pasos });
const num = (v, error, pasos) => ({ tex: T(v), clave: redondear(v), error, pasos });
const entero = (rng, [min, max]) => rng.entero(min, max);
const decEs = v => String(redondear(v)).replace('.', ',');
const decEn = v => String(redondear(v));
const exacto = (a, b) => a % b === 0;
/** Los candidatos que valen (los nulos no), en orden aleatorio: así ningún error queda muerto. */
const pool = (rng, lista) => rng.barajar(lista.filter(Boolean));

// --- Subtipos ----------------------------------------------------------------------------------
function directaUnidad(rng) {
  const ctx = rng.elegir(COMPRA_PESO);
  const a = entero(rng, ctx.kg), c = entero(rng, ctx.kg);
  if (a === c) return null;
  const precioKg = Math.round(entero(rng, ctx.precioKg) / 10) * 10;
  const b = a * precioKg, correcta = c * precioKg;
  if (correcta > ctx.maxTotal) return null;
  const invertida = exacto(b * a, c) ? b * a / c : null;
  return {
    texto: { clave: `directa_unidad_${ctx.id}`, params: { a, c, b: eurosEs(b), b_en: eurosEn(b) } },
    enunciado: '',
    correcta: dinero(correcta),
    solucion: [
      paso(`${eurosTex(b)} \\div ${a} = ${eurosTex(precioKg)}`, 'hallar_unidad'),
      paso(`${eurosTex(precioKg)} \\cdot ${c} = ${eurosTex(correcta)}`, 'multiplicar_unidad'),
    ],
    distractores: pool(rng, [
      dinero(b * c, E('multiplica_sin_hallar_unidad'), [mal(`${eurosTex(b)} \\cdot ${c} = ${eurosTex(b * c)}`)]),
      dinero(b + (c - a) * 100, E('suma_la_diferencia'), [mal(`${eurosTex(b)} + ${c - a} = ${eurosTex(b + (c - a) * 100)}`)]),
      invertida !== null && dinero(invertida, E('trata_como_inversa'), [mal(`${eurosTex(b)} \\cdot ${a} \\div ${c} = ${eurosTex(invertida)}`)]),
      dinero(a * c * 100, E('multiplica_los_dos_datos'), [mal(`${a} \\cdot ${c} = ${eurosTex(a * c * 100)}`)]),
      dinero(precioKg, E('se_queda_en_el_valor_de_una_unidad'), [paso(`${eurosTex(b)} \\div ${a} = ${eurosTex(precioKg)}`), mal(`x = ${eurosTex(precioKg)}`)]),
    ]),
  };
}

function directaReceta(rng) {
  const ctx = rng.elegir(RECETAS);
  const a = entero(rng, ctx.personas), c = entero(rng, ctx.personas);
  if (a === c) return null;
  const u = rng.entero(ctx.porPersona[0] / ctx.paso, ctx.porPersona[1] / ctx.paso) * ctx.paso;
  const b = a * u, correcta = c * u;
  if (b > ctx.max || correcta > ctx.max || b < 50 || correcta < 50) return null;
  const invertida = exacto(b * a, c) ? b * a / c : null;
  return {
    texto: { clave: `directa_receta_${ctx.id}`, params: { a, b, c } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(b)} \\div ${a} = ${T(u)}`, 'hallar_unidad_receta'),
      paso(`${T(u)} \\cdot ${c} = ${T(correcta)}`, 'multiplicar_personas'),
    ],
    distractores: pool(rng, [
      num(b * c, E('multiplica_sin_hallar_unidad'), [mal(`${T(b)} \\cdot ${c} = ${T(b * c)}`)]),
      num(b + (c - a), E('suma_la_diferencia'), [mal(`${T(b)} + ${c - a} = ${T(b + (c - a))}`)]),
      invertida !== null && num(invertida, E('trata_como_inversa'), [mal(`${T(b)} \\cdot ${a} \\div ${c} = ${T(invertida)}`)]),
      num(a * c, E('multiplica_los_dos_datos'), [mal(`${a} \\cdot ${c} = ${T(a * c)}`)]),
      num(u, E('se_queda_en_el_valor_de_una_unidad'), [paso(`${T(b)} \\div ${a} = ${T(u)}`), mal(`x = ${T(u)}`)]),
    ]),
  };
}

function inversa(rng) {
  const ctx = rng.elegir(OBREROS);
  const a = entero(rng, ctx.n), c = entero(rng, ctx.n);
  if (a === c) return null;
  const g = mcd(a, c), m = c / g, n = a / g;
  const kMax = Math.floor(ctx.t[1] / Math.max(m, n));
  if (kMax < 1) return null;
  const k = rng.entero(1, kMax);
  const tiempo = m * k, correcta = n * k;
  if (tiempo < ctx.t[0] || correcta < ctx.t[0]) return null;
  const total = a * tiempo;
  const directa = exacto(tiempo * c, a) ? tiempo * c / a : null;
  const suma = tiempo + (c - a);
  return {
    texto: { clave: `inversa_${ctx.id}`, params: { a, b: tiempo, c } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${a} \\cdot ${tiempo} = ${T(total)}`, 'trabajo_total'),
      paso(`${T(total)} \\div ${c} = ${T(correcta)}`, 'dividir_entre_nuevos'),
    ],
    distractores: pool(rng, [
      num(tiempo, E('no_ajusta_al_cambiar'), [mal(`x = ${T(tiempo)}`)]),
      suma >= 1 && num(suma, E('trata_como_suma'), [mal(`${T(tiempo)} + (${c} - ${a}) = ${T(suma)}`)]),
      directa !== null && num(directa, E('trata_como_directa'), [mal(`${T(tiempo)} \\cdot ${c} \\div ${a} = ${T(directa)}`)]),
      num(total, E('olvida_dividir_entre_los_nuevos'), [mal(`${a} \\cdot ${tiempo} = ${T(total)}`)]),
      num(c, E('confunde_dias_con_obreros'), [mal(`x = ${T(c)}`)]),
    ]),
  };
}

/** Escala: del plano a la realidad (`aReal`) o de la realidad al plano. */
const escala = aReal => rng => {
  const ctx = rng.elegir(ESCALAS);
  const N = rng.elegir(ctx.escalas);
  const cm = entero(rng, ctx.cmPlano);
  const real = cm * N / ctx.divisor;
  if (real < ctx.realMin || real > ctx.realMax) return null;
  const aUnidad = x => `${T(x)} \\div ${T(ctx.divisor)}`;
  if (aReal) {
    const cmReales = cm * N;
    return {
      texto: { clave: `escala_a_real_${ctx.id}`, params: { N, cm } },
      enunciado: '',
      correcta: num(real),
      solucion: [
        paso(`${cm} \\cdot ${T(N)} = ${T(cmReales)}`, 'escala_a_cm'),
        paso(`${aUnidad(cmReales)} = ${T(real)}`, 'cm_a_unidad'),
      ],
      distractores: pool(rng, [
        num(cmReales, E('no_cambia_de_unidad'), [paso(`${cm} \\cdot ${T(N)} = ${T(cmReales)}`), mal(`x = ${T(cmReales)}`)]),
        num(real * 10, E('cambia_mal_de_unidad'), [paso(`${cm} \\cdot ${T(N)} = ${T(cmReales)}`), mal(`${T(cmReales)} \\div ${T(ctx.divisor / 10)} = ${T(real * 10)}`)]),
        num(real / 10, E('cambia_mal_de_unidad'), [paso(`${cm} \\cdot ${T(N)} = ${T(cmReales)}`), mal(`${T(cmReales)} \\div ${T(ctx.divisor * 10)} = ${T(real / 10)}`)]),
        num(cm, E('olvida_la_escala'), [mal(`x = ${cm}`)]),
      ]),
    };
  }
  const multiplicado = real * N / ctx.divisor;
  const cmReal = real * ctx.divisor;
  return {
    texto: { clave: `escala_a_plano_${ctx.id}`, params: { N, real: decEs(real), real_en: decEn(real) } },
    enunciado: '',
    correcta: num(cm),
    solucion: [
      paso(`${T(real)} \\cdot ${T(ctx.divisor)} = ${T(cmReal)}`, 'real_a_cm'),
      paso(`${T(cmReal)} \\div ${T(N)} = ${T(cm)}`, 'dividir_entre_escala'),
    ],
    distractores: pool(rng, [
      num(cmReal, E('no_divide_entre_la_escala'), [paso(`${T(real)} \\cdot ${T(ctx.divisor)} = ${T(cmReal)}`), mal(`x = ${T(cmReal)}`)]),
      num(real, E('no_aplica_la_escala'), [mal(`x = ${T(real)}`)]),
      num(cm * 10, E('cambia_mal_de_unidad'), [paso(`${T(real)} \\cdot ${T(ctx.divisor)} = ${T(cmReal)}`), mal(`${T(cmReal)} \\div ${T(N / 10)} = ${T(cm * 10)}`)]),
      num(cm / 10, E('cambia_mal_de_unidad'), [paso(`${T(real)} \\cdot ${T(ctx.divisor)} = ${T(cmReal)}`), mal(`${T(cmReal)} \\div ${T(N * 10)} = ${T(cm / 10)}`)]),
      num(multiplicado, E('multiplica_en_vez_de_dividir'), [mal(`${T(real)} \\cdot ${T(N)} \\div ${T(ctx.divisor)} = ${T(multiplicado)}`)]),
    ]),
  };
};

function repartoRazon(rng) {
  const a = rng.entero(1, 9), b = rng.entero(1, 9);
  if (a === b || mcd(a, b) !== 1) return null;
  const suma = a + b;
  const k = 50 * rng.entero(2, 120);
  const total = suma * k, correcta = a * k, otra = b * k;
  const entre = exacto(total, a) ? total / a : null;
  return {
    texto: { clave: 'reparto_razon', params: { total: eurosEs(total), total_en: eurosEn(total), a, b } },
    enunciado: '',
    correcta: dinero(correcta),
    solucion: [
      paso(`${a} + ${b} = ${suma}`, 'sumar_partes'),
      paso(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`, 'hallar_valor_parte'),
      paso(`${eurosTex(k)} \\cdot ${a} = ${eurosTex(correcta)}`, 'multiplicar_por_parte'),
    ],
    distractores: pool(rng, [
      dinero(total / 2, E('reparte_a_partes_iguales'), [mal(`${eurosTex(total)} \\div 2 = ${eurosTex(total / 2)}`)]),
      dinero(otra, E('invierte_las_partes'), [paso(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`), mal(`${eurosTex(k)} \\cdot ${b} = ${eurosTex(otra)}`)]),
      dinero(total * a, E('multiplica_sin_dividir_entre_suma'), [mal(`${eurosTex(total)} \\cdot ${a} = ${eurosTex(total * a)}`)]),
      dinero(k, E('se_queda_en_el_valor_de_una_parte'), [mal(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`)]),
      entre !== null && dinero(entre, E('multiplica_sin_dividir_entre_suma'), [mal(`${eurosTex(total)} \\div ${a} = ${eurosTex(entre)}`)]),
    ]),
  };
}

function repartoAportaciones(rng) {
  const ctx = rng.elegir(REPARTOS);
  const n = entero(rng, ctx.personas);
  const datos = Array.from({ length: n }, () => rng.entero(ctx.dato[0] / ctx.paso, ctx.dato[1] / ctx.paso) * ctx.paso);
  if (new Set(datos).size < 2) return null;
  const suma = datos.reduce((x, y) => x + y, 0);
  const k = 10 * rng.entero(1, 100);
  const total = suma * k;
  if (total < ctx.premio[0] || total > ctx.premio[1]) return null;
  const correcta = datos[0] * k;
  const otro = datos[n - 1] * k;
  const igual = exacto(total, n) ? total / n : null;
  const lista = datos.length === 2 ? `${datos[0]} y ${datos[1]}` : `${datos.slice(0, -1).join(', ')} y ${datos[n - 1]}`;
  const listaEn = datos.length === 2 ? `${datos[0]} and ${datos[1]}` : `${datos.slice(0, -1).join(', ')} and ${datos[n - 1]}`;
  return {
    texto: { clave: `reparto_aportaciones_${ctx.id}`, params: { lista, lista_en: listaEn, total: eurosEs(total), total_en: eurosEn(total) } },
    enunciado: '',
    correcta: dinero(correcta),
    solucion: [
      paso(`${datos.join(' + ')} = ${suma}`, 'sumar_partes'),
      paso(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`, 'hallar_valor_parte'),
      paso(`${eurosTex(k)} \\cdot ${datos[0]} = ${eurosTex(correcta)}`, 'multiplicar_por_parte'),
    ],
    distractores: pool(rng, [
      igual !== null && dinero(igual, E('reparte_a_partes_iguales'), [mal(`${eurosTex(total)} \\div ${n} = ${eurosTex(igual)}`)]),
      dinero(otro, E('invierte_las_partes'), [paso(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`), mal(`${eurosTex(k)} \\cdot ${datos[n - 1]} = ${eurosTex(otro)}`)]),
      dinero(total * datos[0], E('multiplica_sin_dividir_entre_suma'), [mal(`${eurosTex(total)} \\cdot ${datos[0]} = ${eurosTex(total * datos[0])}`)]),
      dinero(k, E('se_queda_en_el_valor_de_una_parte'), [mal(`${eurosTex(total)} \\div ${suma} = ${eurosTex(k)}`)]),
    ]),
  };
}

export const SUBTIPOS = [
  { id: 'directa_unidad', items: ['U7-1A-02', 'U7-1C-10'], forma: directaUnidad },
  { id: 'directa_receta', items: ['U7-1A-01'], forma: directaReceta },
  { id: 'inversa', items: ['U7-2A-01'], forma: inversa },
  { id: 'escala_a_real', items: ['U7-4A-01'], forma: escala(true) },
  { id: 'escala_a_plano', items: ['U7-4A-02'], forma: escala(false) },
  { id: 'reparto_razon', items: ['U7-2C-04'], forma: repartoRazon },
  { id: 'reparto_aportaciones', items: ['U7-2A-05'], forma: repartoAportaciones },
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
  id: 'proporcionalidad',
  nombre: { es: 'Proporcionalidad', en: 'Proportionality' },
  curso: 1,
  concepto: 'proporcionalidad',
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
