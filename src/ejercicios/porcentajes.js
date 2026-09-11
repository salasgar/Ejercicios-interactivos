// Porcentajes: calcular el tanto por ciento de una cantidad, aumentos y
// descuentos porcentuales, e interés simple (matemática financiera).

import { construirOpciones, conReintentos, erroresDe, tex, mcd } from './index.js';

export const errores = {
  olvida_dividir_entre_100: { concepto: 'porcentajes',
    es: 'Un tanto por ciento se calcula multiplicando y dividiendo entre 100; te falta la división.', en: 'A percentage is worked out by multiplying and then dividing by 100; you are missing the division.' },
  toma_la_mitad: { concepto: 'porcentajes',
    es: 'El porcentaje no siempre es la mitad: la mitad es el 50%, no cualquier otro tanto por ciento.', en: 'A percentage is not always half: half is 50%, not any other percentage.' },
  suma_el_porcentaje: { concepto: 'porcentajes',
    es: 'El tanto por ciento no se suma directamente a la cantidad: hay que multiplicar y dividir entre 100 primero.', en: 'The percentage is not added straight to the amount: you must multiply and divide by 100 first.' },
  olvida_sumar_o_restar: { concepto: 'porcentajes',
    es: 'Eso es solo el aumento o el descuento; falta sumarlo o restarlo al precio inicial.', en: 'That is just the increase or the decrease; you still need to add or subtract it from the original price.' },
  invierte_aumento_descuento: { concepto: 'porcentajes',
    es: 'Revisa si el precio sube o baja: has hecho lo contrario de lo que dice el enunciado.', en: 'Check whether the price goes up or down: you did the opposite of what the statement says.' },
  olvida_dividir_el_cambio: { concepto: 'porcentajes',
    es: 'Al calcular el aumento o el descuento también hay que dividir entre 100.', en: 'When working out the increase or decrease you also have to divide by 100.' },
  olvida_multiplicar_por_anos: { concepto: 'porcentajes',
    es: 'Eso son los intereses de un solo año; hay que multiplicarlos por el número de años.', en: 'That is the interest for just one year; you have to multiply it by the number of years.' },
  confunde_interes_con_capital_final: { concepto: 'porcentajes',
    es: 'Eso es el capital final (lo que tendrías en la cuenta), no los intereses ganados.', en: 'That is the final balance (what you would have in the account), not the interest earned.' },
  olvida_porcentaje_en_interes: { concepto: 'porcentajes',
    es: 'Te has olvidado del tanto por ciento: no todo el capital se convierte en interés cada año.', en: 'You forgot the percentage: not all the capital turns into interest every year.' },
  aplica_segundo_cambio_sobre_precio_inicial: { concepto: 'porcentajes',
    es: 'El segundo cambio se calcula sobre el precio ya modificado por el primero, no sobre el precio inicial.', en: 'The second change is worked out on the price already changed by the first one, not on the original price.' },
  invierte_segundo_cambio: { concepto: 'porcentajes',
    es: 'Revisa si el segundo cambio sube o baja el precio: has hecho lo contrario de lo que dice el enunciado.', en: 'Check whether the second change raises or lowers the price: you did the opposite of what the statement says.' },
  olvida_segundo_cambio: { concepto: 'porcentajes',
    es: 'Eso es solo el precio tras el primer cambio; falta aplicar también el segundo.', en: 'That is only the price after the first change; you still need to apply the second one too.' },
  trata_como_interes_simple: { concepto: 'porcentajes',
    es: 'En el interés compuesto, los intereses de cada año se calculan sobre el capital acumulado, no siempre sobre el mismo capital inicial.', en: 'With compound interest, each year’s interest is worked out on the accumulated capital, not always on the same original capital.' },
  olvida_segundo_ano: { concepto: 'porcentajes',
    es: 'Eso son solo los intereses del primer año; falta calcular también los del segundo.', en: 'That is only the first year’s interest; you still need to work out the second year’s too.' },
};
const E = erroresDe(errores);

export const preguntas = {
  calcula_porcentaje: { es: 'Calcula el {p}% de {cantidad}:', en: 'Work out {p}% of {cantidad}:' },
  descuento: { es: 'Un artículo de {precio} € tiene un descuento del {p}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € has a {p}% discount. What is its new price?' },
  aumento: { es: 'Un artículo de {precio} € sube un {p}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes up by {p}%. What is its new price?' },
  interes: { es: 'Si depositas {capital} € al {p}% de interés simple anual, ¿cuántos euros de interés obtienes en {anos} años?', en: 'If you deposit {capital} € at {p}% simple annual interest, how many euros of interest do you earn in {anos} years?' },
  sube_sube: { es: 'Un artículo de {precio} € sube un {p1}% y después sube otro {p2}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes up by {p1}% and then goes up another {p2}%. What is its new price?' },
  sube_baja: { es: 'Un artículo de {precio} € sube un {p1}% y después baja un {p2}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes up by {p1}% and then goes down by {p2}%. What is its new price?' },
  baja_sube: { es: 'Un artículo de {precio} € baja un {p1}% y después sube un {p2}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes down by {p1}% and then goes up by {p2}%. What is its new price?' },
  baja_baja: { es: 'Un artículo de {precio} € baja un {p1}% y después baja otro {p2}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes down by {p1}% and then goes down another {p2}%. What is its new price?' },
  interes_compuesto: { es: 'Si depositas {capital} € al {p}% de interés compuesto anual, ¿cuántos euros de interés obtienes en 2 años?', en: 'If you deposit {capital} € at {p}% compound annual interest, how many euros of interest do you earn in 2 years?' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  multiplicar_por_p: { es: 'Multiplicamos por el tanto por ciento.', en: 'We multiply by the percentage.' },
  dividir_entre_100: { es: 'Y dividimos entre 100.', en: 'And we divide by 100.' },
  calcular_cambio: { es: 'Calculamos el aumento o el descuento.', en: 'We work out the increase or decrease.' },
  sumar_aumento: { es: 'Sumamos el aumento al precio inicial.', en: 'We add the increase to the original price.' },
  restar_descuento: { es: 'Restamos el descuento al precio inicial.', en: 'We subtract the discount from the original price.' },
  interes_de_un_ano: { es: 'Calculamos el interés de un solo año.', en: 'We work out the interest for a single year.' },
  multiplicar_por_anos: { es: 'Multiplicamos por el número de años.', en: 'We multiply by the number of years.' },
  calcular_primer_cambio: { es: 'Calculamos el precio después del primer cambio.', en: 'We work out the price after the first change.' },
  calcular_segundo_cambio: { es: 'Calculamos el precio después del segundo cambio, aplicado sobre el precio ya cambiado.', en: 'We work out the price after the second change, applied to the already-changed price.' },
  interes_primer_ano: { es: 'Calculamos el interés del primer año y lo sumamos al capital.', en: 'We work out the first year’s interest and add it to the capital.' },
  interes_segundo_ano: { es: 'Calculamos el interés del segundo año, ya sobre el capital acumulado.', en: 'We work out the second year’s interest, this time on the accumulated capital.' },
  sumar_intereses: { es: 'Sumamos los intereses de los dos años.', en: 'We add the interest from both years.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: v, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

const PORCENTAJES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 4, 8];

/** Cantidad múltiplo de 100/mcd(100,p) y par, para que todas las cuentas salgan enteras. */
function cantidadLimpia(rng, p) {
  const base = 100 / mcd(100, p);
  const m = 2 * rng.entero(1, 10);
  return base * m;
}

function calcularPorcentaje(rng) {
  const p = rng.elegir(PORCENTAJES);
  const cantidad = cantidadLimpia(rng, p);
  const correcta = (cantidad * p) / 100;
  return {
    texto: { clave: 'calcula_porcentaje', params: { p, cantidad } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(cantidad)} \\cdot ${p} = ${T(cantidad * p)}`, 'multiplicar_por_p'),
      paso(`${T(cantidad * p)} \\div 100 = ${T(correcta)}`, 'dividir_entre_100'),
    ],
    distractores: [
      num(cantidad * p, E('olvida_dividir_entre_100'), [
        paso(`${T(cantidad)} \\cdot ${p} = ${T(cantidad * p)}`),
        mal(`x = ${T(cantidad * p)}`),
      ]),
      num(cantidad / 2, E('toma_la_mitad'), [
        mal(`${T(cantidad)} \\div 2 = ${T(cantidad / 2)}`),
      ]),
      num(cantidad + p, E('suma_el_porcentaje'), [
        mal(`${T(cantidad)} + ${p} = ${T(cantidad + p)}`),
      ]),
    ],
  };
}

function aumentoDescuento(rng) {
  const p = rng.elegir(PORCENTAJES);
  const precio = cantidadLimpia(rng, p);
  const cambio = (precio * p) / 100;
  const aumenta = rng.moneda();
  const correcta = aumenta ? precio + cambio : precio - cambio;
  const cambioSinCien = precio * p;
  return {
    texto: { clave: aumenta ? 'aumento' : 'descuento', params: { precio, p } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(precio)} \\cdot ${p} \\div 100 = ${T(cambio)}`, 'calcular_cambio'),
      paso(`${T(precio)} ${aumenta ? '+' : '-'} ${T(cambio)} = ${T(correcta)}`, aumenta ? 'sumar_aumento' : 'restar_descuento'),
    ],
    distractores: [
      num(cambio, E('olvida_sumar_o_restar'), [
        paso(`${T(precio)} \\cdot ${p} \\div 100 = ${T(cambio)}`),
        mal(`x = ${T(cambio)}`),
      ]),
      num(aumenta ? precio - cambio : precio + cambio, E('invierte_aumento_descuento'), [
        paso(`${T(precio)} \\cdot ${p} \\div 100 = ${T(cambio)}`),
        mal(`${T(precio)} ${aumenta ? '-' : '+'} ${T(cambio)} = ${T(aumenta ? precio - cambio : precio + cambio)}`),
      ]),
      num(aumenta ? precio + cambioSinCien : precio - cambioSinCien, E('olvida_dividir_el_cambio'), [
        mal(`${T(precio)} \\cdot ${p} = ${T(cambioSinCien)}`),
        paso(`${T(precio)} ${aumenta ? '+' : '-'} ${T(cambioSinCien)} = ${T(aumenta ? precio + cambioSinCien : precio - cambioSinCien)}`),
      ]),
    ],
  };
}

function interesSimple(rng) {
  const p = rng.elegir(PORCENTAJES);
  const capital = cantidadLimpia(rng, p);
  const anos = rng.entero(2, 8);
  const interesUnAno = (capital * p) / 100;
  const correcta = interesUnAno * anos;
  return {
    texto: { clave: 'interes', params: { capital, p, anos } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(capital)} \\cdot ${p} \\div 100 = ${T(interesUnAno)}`, 'interes_de_un_ano'),
      paso(`${T(interesUnAno)} \\cdot ${anos} = ${T(correcta)}`, 'multiplicar_por_anos'),
    ],
    distractores: [
      num(interesUnAno, E('olvida_multiplicar_por_anos'), [
        paso(`${T(capital)} \\cdot ${p} \\div 100 = ${T(interesUnAno)}`),
        mal(`x = ${T(interesUnAno)}`),
      ]),
      num(capital + correcta, E('confunde_interes_con_capital_final'), [
        paso(`${T(interesUnAno)} \\cdot ${anos} = ${T(correcta)}`),
        mal(`${T(capital)} + ${T(correcta)} = ${T(capital + correcta)}`),
      ]),
      num(capital * anos, E('olvida_porcentaje_en_interes'), [
        mal(`${T(capital)} \\cdot ${anos} = ${T(capital * anos)}`),
      ]),
    ],
  };
}

function aumentosSucesivos(rng) {
  const p1 = rng.elegir(PORCENTAJES), p2 = rng.elegir(PORCENTAJES);
  const precio = cantidadLimpia(rng, p1);
  const sube1 = rng.moneda();
  const cambio1 = (precio * p1) / 100;
  const intermedio = sube1 ? precio + cambio1 : precio - cambio1;
  if ((intermedio * p2) % 100 !== 0 || (precio * p2) % 100 !== 0) return null;
  const sube2 = rng.moneda();
  const cambio2 = (intermedio * p2) / 100;
  const correcta = sube2 ? intermedio + cambio2 : intermedio - cambio2;
  const cambio2SobrePrecioInicial = (precio * p2) / 100;
  const sobrePrecioInicial = sube2 ? intermedio + cambio2SobrePrecioInicial : intermedio - cambio2SobrePrecioInicial;
  const invertida = sube2 ? intermedio - cambio2 : intermedio + cambio2;
  const clave = sube1 ? (sube2 ? 'sube_sube' : 'sube_baja') : (sube2 ? 'baja_sube' : 'baja_baja');
  return {
    texto: { clave, params: { precio, p1, p2 } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [
      paso(`${T(precio)} ${sube1 ? '+' : '-'} ${T(cambio1)} = ${T(intermedio)}`, 'calcular_primer_cambio', `${T(precio)} \\cdot ${p1} \\div 100 = ${T(cambio1)}`),
      paso(`${T(intermedio)} ${sube2 ? '+' : '-'} ${T(cambio2)} = ${T(correcta)}`, 'calcular_segundo_cambio', `${T(intermedio)} \\cdot ${p2} \\div 100 = ${T(cambio2)}`),
    ],
    distractores: [
      num(sobrePrecioInicial, E('aplica_segundo_cambio_sobre_precio_inicial'), [
        paso(`${T(precio)} ${sube1 ? '+' : '-'} ${T(cambio1)} = ${T(intermedio)}`),
        mal(`${T(intermedio)} ${sube2 ? '+' : '-'} ${T(cambio2SobrePrecioInicial)} = ${T(sobrePrecioInicial)}`, `${T(precio)} \\cdot ${p2} \\div 100 = ${T(cambio2SobrePrecioInicial)}`),
      ]),
      num(invertida, E('invierte_segundo_cambio'), [
        paso(`${T(precio)} ${sube1 ? '+' : '-'} ${T(cambio1)} = ${T(intermedio)}`),
        mal(`${T(intermedio)} ${sube2 ? '-' : '+'} ${T(cambio2)} = ${T(invertida)}`),
      ]),
      num(intermedio, E('olvida_segundo_cambio'), [
        mal(`x = ${T(intermedio)}`),
      ]),
    ],
  };
}

function interesCompuesto(rng) {
  const p = rng.elegir(PORCENTAJES);
  const capital = cantidadLimpia(rng, p);
  const interesAno1 = (capital * p) / 100;
  const capitalAno1 = capital + interesAno1;
  if ((capitalAno1 * p) % 100 !== 0) return null;
  const interesAno2 = (capitalAno1 * p) / 100;
  const interesTotal = interesAno1 + interesAno2;
  const capitalFinal = capitalAno1 + interesAno2;
  const interesSimpleDosAnos = interesAno1 * 2;
  return {
    texto: { clave: 'interes_compuesto', params: { capital, p } },
    enunciado: '',
    correcta: num(interesTotal),
    solucion: [
      paso(`${T(capital)} \\cdot ${p} \\div 100 = ${T(interesAno1)}`, 'interes_primer_ano', `${T(capital)} + ${T(interesAno1)} = ${T(capitalAno1)}`),
      paso(`${T(capitalAno1)} \\cdot ${p} \\div 100 = ${T(interesAno2)}`, 'interes_segundo_ano'),
      paso(`${T(interesAno1)} + ${T(interesAno2)} = ${T(interesTotal)}`, 'sumar_intereses'),
    ],
    distractores: [
      num(interesSimpleDosAnos, E('trata_como_interes_simple'), [
        paso(`${T(capital)} \\cdot ${p} \\div 100 = ${T(interesAno1)}`),
        mal(`${T(interesAno1)} \\cdot 2 = ${T(interesSimpleDosAnos)}`),
      ]),
      num(interesAno1, E('olvida_segundo_ano'), [
        mal(`x = ${T(interesAno1)}`),
      ]),
      num(capitalFinal, E('confunde_interes_con_capital_final'), [
        paso(`${T(capitalAno1)} \\cdot ${p} \\div 100 = ${T(interesAno2)}`),
        mal(`${T(capitalAno1)} + ${T(interesAno2)} = ${T(capitalFinal)}`),
      ]),
    ],
  };
}

const FORMAS = [calcularPorcentaje, calcularPorcentaje, aumentoDescuento, aumentoDescuento, interesSimple, aumentosSucesivos, aumentosSucesivos, interesCompuesto];

export default {
  id: 'porcentajes',
  nombre: { es: 'Porcentajes', en: 'Percentages' },
  curso: 1,
  concepto: 'porcentajes',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    const { texto, enunciado, correcta, solucion, distractores } = datos;
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
