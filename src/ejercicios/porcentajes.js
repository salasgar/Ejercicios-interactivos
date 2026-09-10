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
};
const E = erroresDe(errores);

export const preguntas = {
  calcula_porcentaje: { es: 'Calcula el {p}% de {cantidad}:', en: 'Work out {p}% of {cantidad}:' },
  descuento: { es: 'Un artículo de {precio} € tiene un descuento del {p}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € has a {p}% discount. What is its new price?' },
  aumento: { es: 'Un artículo de {precio} € sube un {p}%. ¿Cuánto cuesta ahora?', en: 'An item costing {precio} € goes up by {p}%. What is its new price?' },
  interes: { es: 'Si depositas {capital} € al {p}% de interés simple anual, ¿cuántos euros de interés obtienes en {anos} años?', en: 'If you deposit {capital} € at {p}% simple annual interest, how many euros of interest do you earn in {anos} years?' },
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

const FORMAS = [calcularPorcentaje, calcularPorcentaje, aumentoDescuento, aumentoDescuento, interesSimple];

export default {
  id: 'porcentajes',
  nombre: { es: 'Porcentajes', en: 'Percentages' },
  curso: 1,
  concepto: 'porcentajes',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
