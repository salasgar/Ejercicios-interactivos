// Perímetros y áreas de figuras planas: cuadrado, rectángulo, triángulo y
// círculo (con π ≈ 3,14, como se enseña en 1º ESO).

import { construirOpciones, conReintentos, erroresDe, tex, redondear } from './index.js';

export const errores = {
  confunde_perimetro_area: { concepto: 'perimetros_areas',
    es: 'Has usado la fórmula de la otra magnitud: revisa si te piden perímetro o área.', en: 'You used the formula for the other quantity: check whether you are asked for the perimeter or the area.' },
  cuenta_solo_dos_lados: { concepto: 'perimetros_areas',
    es: 'El perímetro es la suma de los cuatro lados, no solo de dos.', en: 'The perimeter is the sum of all four sides, not just two.' },
  suma_en_vez_de_multiplicar: { concepto: 'perimetros_areas',
    es: 'El área se calcula multiplicando, no sumando los lados.', en: 'The area is found by multiplying, not by adding the sides.' },
  olvida_dividir_entre_dos: { concepto: 'perimetros_areas',
    es: 'El área del triángulo es base por altura, dividido entre 2: te falta esa división.', en: 'The area of a triangle is base times height, divided by 2: you are missing that division.' },
  usa_diametro_como_radio: { concepto: 'perimetros_areas',
    es: 'Has usado el diámetro (el doble del radio) como si fuera el radio.', en: 'You used the diameter (double the radius) as if it were the radius.' },
  olvida_multiplicar_por_dos: { concepto: 'perimetros_areas',
    es: 'La longitud de la circunferencia es 2 por π por el radio: te falta multiplicar por 2.', en: 'The circumference is 2 times π times the radius: you are missing the multiplication by 2.' },
  no_eleva_al_cuadrado: { concepto: 'perimetros_areas',
    es: 'El área del círculo es π por el radio al cuadrado, no π por el radio.', en: 'The area of a circle is π times the radius squared, not π times the radius.' },
};
const E = erroresDe(errores);

export const preguntas = {
  perimetro_cuadrado: { es: '¿Cuál es el perímetro de un cuadrado de lado {l} cm?', en: 'What is the perimeter of a square with side {l} cm?' },
  area_cuadrado: { es: '¿Cuál es el área de un cuadrado de lado {l} cm?', en: 'What is the area of a square with side {l} cm?' },
  perimetro_rectangulo: { es: '¿Cuál es el perímetro de un rectángulo de {b} cm de base y {h} cm de altura?', en: 'What is the perimeter of a rectangle with base {b} cm and height {h} cm?' },
  area_rectangulo: { es: '¿Cuál es el área de un rectángulo de {b} cm de base y {h} cm de altura?', en: 'What is the area of a rectangle with base {b} cm and height {h} cm?' },
  area_triangulo: { es: '¿Cuál es el área de un triángulo de {base} cm de base y {altura} cm de altura?', en: 'What is the area of a triangle with base {base} cm and height {altura} cm?' },
  perimetro_circulo: { es: '¿Cuál es la longitud de la circunferencia de un círculo de radio {r} cm? (usa π ≈ 3,14)', en: 'What is the circumference of a circle with radius {r} cm? (use π ≈ 3.14)' },
  area_circulo: { es: '¿Cuál es el área de un círculo de radio {r} cm? (usa π ≈ 3,14)', en: 'What is the area of a circle with radius {r} cm? (use π ≈ 3.14)' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  formula_perimetro_cuadrado: { es: 'El perímetro del cuadrado es 4 veces el lado.', en: 'The perimeter of a square is 4 times the side.' },
  formula_area_cuadrado: { es: 'El área del cuadrado es el lado al cuadrado.', en: 'The area of a square is the side squared.' },
  formula_perimetro_rectangulo: { es: 'El perímetro del rectángulo es 2 por la suma de la base y la altura.', en: 'The perimeter of a rectangle is 2 times the sum of the base and the height.' },
  formula_area_rectangulo: { es: 'El área del rectángulo es la base por la altura.', en: 'The area of a rectangle is the base times the height.' },
  formula_area_triangulo: { es: 'El área del triángulo es la base por la altura, dividido entre 2.', en: 'The area of a triangle is the base times the height, divided by 2.' },
  formula_longitud_circunferencia: { es: 'La longitud de la circunferencia es 2 por π por el radio.', en: 'The circumference is 2 times π times the radius.' },
  formula_area_circulo: { es: 'El área del círculo es π por el radio al cuadrado.', en: 'The area of a circle is π times the radius squared.' },
};

const PI = 3.14;
const T = tex;
const r2 = v => redondear(v, 2);
const num = (v, error, pasos) => ({ tex: T(v), clave: r2(v), error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

function cuadrado(rng) {
  const l = rng.entero(2, 20);
  const perim = 4 * l, area = l * l;
  const pide = rng.moneda();
  const correcta = pide ? perim : area;
  return {
    texto: { clave: pide ? 'perimetro_cuadrado' : 'area_cuadrado', params: { l } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [pide
      ? paso(`4 \\cdot ${l} = ${T(perim)}`, 'formula_perimetro_cuadrado')
      : paso(`${l} \\cdot ${l} = ${T(area)}`, 'formula_area_cuadrado')],
    distractores: [
      num(pide ? area : perim, E('confunde_perimetro_area'), [
        mal(pide ? `${l} \\cdot ${l} = ${T(area)}` : `4 \\cdot ${l} = ${T(perim)}`),
      ]),
      pide
        ? num(2 * l, E('cuenta_solo_dos_lados'), [mal(`${l} + ${l} = ${T(2 * l)}`)])
        : num(2 * l, E('suma_en_vez_de_multiplicar'), [mal(`${l} + ${l} = ${T(2 * l)}`)]),
    ],
    genericos: [num(correcta + 1), num(Math.max(1, correcta - 1))],
  };
}

function rectangulo(rng) {
  let b = rng.entero(2, 20), h = rng.entero(2, 20);
  while (h === b) h = rng.entero(2, 20);
  const perim = 2 * (b + h), area = b * h;
  const pide = rng.moneda();
  const correcta = pide ? perim : area;
  return {
    texto: { clave: pide ? 'perimetro_rectangulo' : 'area_rectangulo', params: { b, h } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [pide
      ? paso(`2 \\cdot (${b} + ${h}) = 2 \\cdot ${T(b + h)} = ${T(perim)}`, 'formula_perimetro_rectangulo')
      : paso(`${b} \\cdot ${h} = ${T(area)}`, 'formula_area_rectangulo')],
    distractores: [
      num(pide ? area : perim, E('confunde_perimetro_area'), [
        mal(pide ? `${b} \\cdot ${h} = ${T(area)}` : `2 \\cdot (${b} + ${h}) = ${T(perim)}`),
      ]),
      pide
        ? num(b + h, E('cuenta_solo_dos_lados'), [mal(`${b} + ${h} = ${T(b + h)}`)])
        : num(b + h, E('suma_en_vez_de_multiplicar'), [mal(`${b} + ${h} = ${T(b + h)}`)]),
    ],
    genericos: [num(2 * b), num(2 * h)],
  };
}

function triangulo(rng) {
  const base = rng.entero(2, 20);
  let altura = rng.entero(2, 20);
  while ((base * altura) % 2 !== 0) altura = rng.entero(2, 20);
  const area = (base * altura) / 2;
  return {
    texto: { clave: 'area_triangulo', params: { base, altura } },
    enunciado: '',
    correcta: num(area),
    solucion: [
      paso(`${base} \\cdot ${altura} \\div 2 = ${T(base * altura)} \\div 2 = ${T(area)}`, 'formula_area_triangulo'),
    ],
    distractores: [
      num(base * altura, E('olvida_dividir_entre_dos'), [
        mal(`${base} \\cdot ${altura} = ${T(base * altura)}`),
      ]),
      num(base + altura, E('suma_en_vez_de_multiplicar'), [
        mal(`${base} + ${altura} = ${T(base + altura)}`),
      ]),
    ],
    genericos: [num(area + 1), num(Math.max(1, area - 1))],
  };
}

function circulo(rng) {
  const r = rng.entero(2, 15);
  const perim = r2(2 * PI * r), area = r2(PI * r * r);
  const pide = rng.moneda();
  const correcta = pide ? perim : area;
  const usaDiametro = pide ? r2(2 * PI * 2 * r) : r2(PI * (2 * r) ** 2);
  return {
    texto: { clave: pide ? 'perimetro_circulo' : 'area_circulo', params: { r } },
    enunciado: '',
    correcta: num(correcta),
    solucion: [pide
      ? paso(`2 \\cdot ${T(PI)} \\cdot ${r} = ${T(perim)}`, 'formula_longitud_circunferencia')
      : paso(`${T(PI)} \\cdot ${r}^{2} = ${T(PI)} \\cdot ${T(r * r)} = ${T(area)}`, 'formula_area_circulo')],
    distractores: [
      num(pide ? area : perim, E('confunde_perimetro_area'), [
        mal(pide ? `${T(PI)} \\cdot ${r}^{2} = ${T(area)}` : `2 \\cdot ${T(PI)} \\cdot ${r} = ${T(perim)}`),
      ]),
      pide
        ? num(r2(PI * r), E('olvida_multiplicar_por_dos'), [mal(`${T(PI)} \\cdot ${r} = ${T(r2(PI * r))}`)])
        : num(r2(PI * r), E('no_eleva_al_cuadrado'), [mal(`${T(PI)} \\cdot ${r} = ${T(r2(PI * r))}`)]),
      num(usaDiametro, E('usa_diametro_como_radio'), [
        mal(pide ? `2 \\cdot ${T(PI)} \\cdot ${2 * r} = ${T(usaDiametro)}` : `${T(PI)} \\cdot ${2 * r}^{2} = ${T(usaDiametro)}`),
      ]),
    ],
  };
}

const FORMAS = [cuadrado, rectangulo, triangulo, triangulo, circulo];

export default {
  id: 'perimetros_areas',
  nombre: { es: 'Perímetros y áreas', en: 'Perimeters and areas' },
  curso: 1,
  concepto: 'perimetros_areas',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const { texto, enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
