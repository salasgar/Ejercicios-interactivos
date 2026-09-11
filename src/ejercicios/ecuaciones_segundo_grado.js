// Ecuaciones de segundo grado: incompletas (ax²+c=0, ax²+bx=0) y completas
// sencillas con las dos raíces enteras. Como hay dos soluciones, la opción
// correcta las representa juntas en un solo texto («±k» o «a, b»).

import { construirOpciones, conReintentos, erroresDe, tex } from './index.js';

export const errores = {
  olvida_signo_mas_menos: { concepto: 'ecuaciones_segundo_grado',
    es: 'Al hacer la raíz cuadrada para despejar x hay dos soluciones, una positiva y otra negativa: no se puede olvidar el ±.', en: 'When taking the square root to isolate x there are two solutions, one positive and one negative: you cannot forget the ±.' },
  solo_solucion_negativa: { concepto: 'ecuaciones_segundo_grado',
    es: 'Al hacer la raíz cuadrada hay dos soluciones, una positiva y otra negativa: te falta la positiva.', en: 'When taking the square root there are two solutions, one positive and one negative: you are missing the positive one.' },
  no_saca_raiz: { concepto: 'ecuaciones_segundo_grado',
    es: 'Te has quedado en x², sin hacer la raíz cuadrada para despejar x.', en: 'You stopped at x², without taking the square root to isolate x.' },
  olvida_solucion_cero: { concepto: 'ecuaciones_segundo_grado',
    es: 'Cuando un producto es cero, alguno de los dos factores tiene que ser cero: x = 0 es también una solución.', en: 'When a product is zero, one of the two factors must be zero: x = 0 is also a solution.' },
  signo_segunda_solucion: { concepto: 'ecuaciones_segundo_grado',
    es: 'Al despejar x del segundo factor, revisa el signo: el término independiente cambia de signo al pasar al otro lado.', en: 'When isolating x from the second factor, check the sign: the constant term changes sign when it moves to the other side.' },
  olvida_dividir_segunda_solucion: { concepto: 'ecuaciones_segundo_grado',
    es: 'Te falta dividir entre el coeficiente de x para despejar la segunda solución.', en: 'You still need to divide by the coefficient of x to isolate the second solution.' },
  signo_de_las_raices: { concepto: 'ecuaciones_segundo_grado',
    es: 'Si el factor es (x − r), la solución es r, no −r: revisa el signo al despejar cada factor.', en: 'If the factor is (x − r), the solution is r, not −r: check the sign when isolating each factor.' },
  olvida_una_raiz: { concepto: 'ecuaciones_segundo_grado',
    es: 'Una ecuación de segundo grado completa tiene dos soluciones: te falta una.', en: 'A complete second-degree equation has two solutions: you are missing one.' },
  confunde_raices_con_coeficientes: { concepto: 'ecuaciones_segundo_grado',
    es: 'Esos son los coeficientes de la ecuación, no las soluciones: hay que factorizar para hallarlas.', en: 'Those are the equation’s coefficients, not its solutions: you have to factorise to find them.' },
};
const E = erroresDe(errores);

export const preguntas = {
  resuelve: { es: 'Resuelve la ecuación:', en: 'Solve the equation:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  aislar_x2: { es: 'Pasamos el término independiente al otro lado.', en: 'We move the constant term to the other side.' },
  dividir_entre_a: { es: 'Dividimos entre el coeficiente de x².', en: 'We divide by the coefficient of x².' },
  raiz_cuadrada: { es: 'Hacemos la raíz cuadrada en los dos lados: hay una solución positiva y otra negativa.', en: 'We take the square root on both sides: there is one positive and one negative solution.' },
  sacar_factor_comun: { es: 'Sacamos x factor común.', en: 'We take out x as a common factor.' },
  dos_soluciones: { es: 'Un producto es cero cuando alguno de los factores es cero.', en: 'A product is zero when one of its factors is zero.' },
  factorizar: { es: 'Factorizamos buscando dos números que sumados den el coeficiente de x cambiado de signo, y multiplicados el término independiente.', en: 'We factorise by looking for two numbers that add up to the coefficient of x with its sign changed, and multiply to the constant term.' },
};

const T = tex;
const signo = n => (n >= 0 ? '+' : '-');
const abs = n => Math.abs(n);
const raiz = (texto, clave, error, pasos) => ({ tex: texto, clave, error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
/** «ax²» o «ax» en TeX neutro, sin escribir el coeficiente cuando es 1. */
const terminoX2 = a => (a === 1 ? 'x^{2}' : `${T(a)}x^{2}`);
const terminoX = a => (a === 1 ? 'x' : a === -1 ? '-x' : `${T(a)}x`);

/** «x² ± bx ± c = 0» en TeX neutro, omitiendo un término cuando su coeficiente es 0 o 1. */
function enunciadoCuadraticaMonica(b, c) {
  const terminos = [[1, 2], [b, 1], [c, 0]].filter(([v]) => v !== 0);
  const cuerpo = terminos.map(([v, p], i) => {
    const s = i === 0 ? (v < 0 ? '-' : '') : (v < 0 ? '- ' : '+ ');
    const a = Math.abs(v);
    const parteNum = p > 0 && a === 1 ? '' : T(a);
    const parteX = p === 2 ? 'x^{2}' : p === 1 ? 'x' : '';
    return `${s}${parteNum}${parteX}`;
  }).join(' ');
  return `${cuerpo} = 0`;
}

function incompletaBicuadrada(rng) {
  const k = rng.entero(1, 9);
  const a = rng.entero(1, 5);
  const c = -a * k * k;
  const enunciado = `${terminoX2(a)} ${signo(c)} ${T(abs(c))} = 0`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: raiz(`\\pm ${k}`, `pm${k}`),
    solucion: [
      paso(`${terminoX2(a)} = ${T(-c)}`, 'aislar_x2'),
      paso(`x^{2} = ${T(-c / a)}`, 'dividir_entre_a'),
      paso(`x = \\pm ${k}`, 'raiz_cuadrada'),
    ],
    distractores: [
      raiz(`${k}`, `${k}`, E('olvida_signo_mas_menos'), [
        mal(`x = ${k}`),
      ]),
      raiz(`-${k}`, `-${k}`, E('solo_solucion_negativa'), [
        mal(`x = -${k}`),
      ]),
      raiz(`${k * k}`, `${k * k}`, E('no_saca_raiz'), [
        paso(`x^{2} = ${T(-c / a)}`),
        mal(`x = ${k * k}`),
      ]),
    ],
  };
}

function incompletaFactorComun(rng) {
  const a = rng.entero(1, 6);
  const raiz2 = (rng.moneda() ? 1 : -1) * rng.entero(1, 9);
  const b = -a * raiz2;
  const enunciado = `${terminoX2(a)} ${signo(b)} ${T(abs(b))}x = 0`;
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: raiz(`0, ${T(raiz2)}`, `0|${raiz2}`),
    solucion: [
      paso(`x(${terminoX(a)} ${signo(b)} ${T(abs(b))}) = 0`, 'sacar_factor_comun'),
      paso(`x = 0 \\quad ${terminoX(a)} ${signo(b)} ${T(abs(b))} = 0`, 'dos_soluciones'),
      paso(`x = 0, ${T(raiz2)}`, null),
    ],
    distractores: [
      raiz(`${T(raiz2)}`, `${raiz2}`, E('olvida_solucion_cero'), [
        mal(`x = ${T(raiz2)}`),
      ]),
      raiz(`0, ${T(-raiz2)}`, `0|${-raiz2}`, E('signo_segunda_solucion'), [
        paso(`x = 0 \\quad ${terminoX(a)} ${signo(b)} ${T(abs(b))} = 0`),
        mal(`x = 0, ${T(-raiz2)}`),
      ]),
      raiz(`0, ${T(b)}`, `0|${b}`, E('olvida_dividir_segunda_solucion'), [
        paso(`x = 0 \\quad ${terminoX(a)} = ${T(-b)}`),
        mal(`x = 0, ${T(b)}`),
      ]),
    ],
  };
}

function completaRaicesEnteras(rng) {
  let r1 = rng.entero(-9, 9);
  while (r1 === 0) r1 = rng.entero(-9, 9);
  let r2 = rng.entero(-9, 9);
  while (r2 === 0 || r2 === r1) r2 = rng.entero(-9, 9);
  const b = -(r1 + r2), c = r1 * r2;
  const enunciado = enunciadoCuadraticaMonica(b, c);
  const menor = Math.min(r1, r2), mayor = Math.max(r1, r2);
  return {
    texto: { clave: 'resuelve' },
    enunciado,
    correcta: raiz(`${T(menor)}, ${T(mayor)}`, `${menor}|${mayor}`),
    solucion: [
      paso(`(x ${signo(-menor)} ${T(abs(menor))})(x ${signo(-mayor)} ${T(abs(mayor))}) = 0`, 'factorizar'),
      paso(`x = ${T(menor)}, ${T(mayor)}`, null),
    ],
    distractores: [
      raiz(`${T(-mayor)}, ${T(-menor)}`, `${-mayor}|${-menor}`, E('signo_de_las_raices'), [
        mal(`x = ${T(-mayor)}, ${T(-menor)}`),
      ]),
      raiz(`${T(mayor)}`, `${mayor}`, E('olvida_una_raiz'), [
        mal(`x = ${T(mayor)}`),
      ]),
      raiz(`${T(b)}, ${T(c)}`, `${b}|${c}`, E('confunde_raices_con_coeficientes'), [
        mal(`x = ${T(b)}, ${T(c)}`),
      ]),
    ],
  };
}

const FORMAS = [incompletaBicuadrada, incompletaFactorComun, completaRaicesEnteras, completaRaicesEnteras];

export default {
  id: 'ecuaciones_segundo_grado',
  nombre: { es: 'Ecuaciones de segundo grado', en: 'Second-degree equations' },
  curso: 2,
  concepto: 'ecuaciones_segundo_grado',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
