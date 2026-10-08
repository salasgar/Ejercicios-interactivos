// Práctica «Fábrica de divisores»: textos propios.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·»; inglés sencillo; el 1 es divisor de todo número.

export const TX = {
  nombre: {
    construir: { es: 'Construye el divisor', en: 'Build the divisor' },
    contar: { es: '¿Cuántos divisores tiene?', en: 'How many divisors does it have?' },
    divisible: { es: 'Sin dividir', en: 'Without dividing' },
  },
  detalle: {
    construir: { es: 'Elige los exponentes hasta llegar al divisor pedido', en: 'Choose the exponents to reach the given divisor' },
    contar: { es: 'Suma 1 a cada exponente y multiplica', en: 'Add 1 to each exponent and multiply' },
    divisible: { es: 'Decide mirando los exponentes, sin dividir', en: 'Decide by looking at the exponents, without dividing' },
  },
  construir: {
    instruccion: { es: n => `Construye el ${n}`, en: n => `Build ${n}` },
    exponenteDe: { es: p => `Exponente de ${p}`, en: p => `Exponent of ${p}` },
    feedbackBien: { es: (d, explicacion) => `${d} = ${explicacion}`, en: (d, explicacion) => `${d} = ${explicacion}` },
    feedbackMal: {
      es: (tuyo, tuExplicacion, d, explicacion) => `${tuyo ? `Tú: ${tuyo} = ${tuExplicacion}. ` : ''}${d} = ${explicacion}.`,
      en: (tuyo, tuExplicacion, d, explicacion) => `${tuyo ? `Yours: ${tuyo} = ${tuExplicacion}. ` : ''}${d} = ${explicacion}.`,
    },
    clausula: {
      es: (p, exp, max) => `el ${p} con exponente ${exp} (≤ ${max})`,
      en: (p, exp, max) => `${p} with exponent ${exp} (≤ ${max})`,
    },
  },
  contar: {
    pregunta: { es: '¿Cuántos divisores tiene?', en: 'How many divisors does it have?' },
    feedbackBien: { es: cuenta => `✓ ${cuenta}.`, en: cuenta => `✓ ${cuenta}.` },
    // `cuenta` = «(2+1) · (1+1) = 6», con la cuenta completa.
    feedbackOlvido: {
      es: (tuyo, cuenta) => `${tuyo} no es correcto: has olvidado sumar 1 a cada exponente (el exponente 0 también vale). La cuenta buena: ${cuenta}.`,
      en: (tuyo, cuenta) => `${tuyo} is not correct: you forgot to add 1 to each exponent (the exponent 0 counts too). The right count: ${cuenta}.`,
    },
    feedbackMal: {
      es: (tuyo, cuenta) => `${tuyo} no es correcto. La cuenta buena: ${cuenta}.`,
      en: (tuyo, cuenta) => `${tuyo} is not correct. The right count: ${cuenta}.`,
    },
    premio: { es: lista => `Sus divisores son: ${lista.join(', ')}.`, en: lista => `Its divisors are: ${lista.join(', ')}.` },
  },
  divisible: {
    pregunta: { es: (n, d) => `¿Es ${n} divisible entre ${d}? Míralo en la factorización de ${n}.`, en: (n, d) => `Is ${n} divisible by ${d}? Look at the factorisation of ${n}.` },
    // La factorización del divisor, antes de comparar exponentes: «12 = 2² · 3:».
    factorDelDivisor: { es: (d, fact) => `${d} = ${fact}:`, en: (d, fact) => `${d} = ${fact}:` },
    feedbackSiTiene: {
      es: (p, exp, necesita) => `el ${p} está con exponente ${exp} ≥ ${necesita}`,
      en: (p, exp, necesita) => `${p} is there with exponent ${exp} ≥ ${necesita}`,
    },
    feedbackNoFalta: { es: p => `el ${p} no está`, en: p => `${p} is not there` },
    feedbackNoPoco: {
      es: (p, exp, necesita) => `el ${p} está con exponente ${exp} < ${necesita}`,
      en: (p, exp, necesita) => `${p} is there but with exponent ${exp} < ${necesita}`,
    },
    conclusionSi: { es: '→ sí', en: '→ yes' },
    conclusionNo: { es: '→ no', en: '→ no' },
  },
};
