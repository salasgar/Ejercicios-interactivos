// Práctica «Fábrica de divisores»: textos propios.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·»; inglés sencillo; el 1 es divisor de todo número.

export const TX = {
  nombre: {
    contar: { es: '¿Cuántos divisores tiene?', en: 'How many divisors does it have?' },
    divisible: { es: 'Sin dividir', en: 'Without dividing' },
  },
  detalle: {
    contar: { es: 'Suma 1 a cada exponente y multiplica', en: 'Add 1 to each exponent and multiply' },
    divisible: { es: 'Decide mirando los exponentes, sin dividir', en: 'Decide by looking at the exponents, without dividing' },
  },
  contar: {
    pregunta: { es: '¿<strong>Cuántos divisores</strong> tiene?', en: '<strong>How many divisors</strong> does it have?' },
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
    pregunta: { es: (n, d) => `¿Es ${n} <strong>divisible entre ${d}</strong>? Míralo en la factorización de ${n}.`, en: (n, d) => `Is ${n} <strong>divisible by ${d}</strong>? Look at the factorisation of ${n}.` },
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

// ─── Explicaciones del botón «No lo sé» (tarea 184) ─────────────────────────────

const RESPUESTA = {
  es: x => `La respuesta es ${x}.`,
  en: x => `The answer is ${x}.`,
};
const pot = ([p, e]) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);

export function explicaContar(item, { idioma }) {
  const regla = idioma === 'es'
    ? 'Para contar los divisores: se suma 1 a cada exponente y se multiplican los resultados.'
    : 'To count the divisors: add 1 to each exponent and multiply the results.';
  const pasos = item.fact.map(([p, e]) => `<li>${idioma === 'es' ? `el ${p} tiene exponente ${e}` : `${p} has exponent ${e}`}: <span class="cuenta">${e} + 1 = ${e + 1}</span>.</li>`);
  const cuenta = item.fact.map(([, e]) => e + 1).join(' · ');
  const producto = `<span class="cuenta">${cuenta} = ${item.solucion}</span>`;
  const mult = item.fact.length > 1 ? `<p>${idioma === 'es' ? 'Multiplicamos' : 'We multiply'}: ${producto}.</p>` : '';
  const tiene = idioma === 'es' ? `${item.n} tiene ${item.solucion} divisores.` : `${item.n} has ${item.solucion} divisors.`;
  return `<p>${regla}</p><ol class="pasos-ayuda">${pasos.join('')}</ol>${mult}<p>${tiene} ${RESPUESTA[idioma](`<strong>${item.solucion}</strong>`)}</p>`;
}

export function explicaDivisible(item, { idioma }) {
  const regla = idioma === 'es'
    ? `Un número es divisible entre ${item.d} si en su factorización están todos los primos de ${item.d}, cada uno con un exponente al menos igual.`
    : `A number is divisible by ${item.d} if its factorisation has all the primes of ${item.d}, each with an exponent at least as big.`;
  const fMapa = new Map(item.fact);
  const pasos = item.factD.map(([p, necesita]) => {
    const tiene = fMapa.get(p) ?? 0;
    const texto = tiene === 0
      ? (idioma === 'es' ? `el ${p} no aparece en ${item.n}` : `${p} is not in ${item.n}`)
      : (idioma === 'es'
        ? `el ${p} tiene exponente ${tiene} en ${item.n} y hace falta ${necesita}`
        : `${p} has exponent ${tiene} in ${item.n} and ${necesita} is needed`);
    const ok = tiene >= necesita;
    return `<li>${texto}: ${ok ? (idioma === 'es' ? 'vale' : 'it is enough') : (idioma === 'es' ? 'no vale' : 'it is not enough')}.</li>`;
  });
  const cabecera = `<p>${item.n} = ${item.fact.map(pot).join(' · ')}; ${item.d} = ${item.factD.map(pot).join(' · ')}.</p>`;
  const conclusion = item.divisible
    ? (idioma === 'es' ? `Todos valen, así que ${item.n} es divisible entre ${item.d}.` : `All of them are enough, so ${item.n} is divisible by ${item.d}.`)
    : (idioma === 'es' ? `Alguno no vale, así que ${item.n} no es divisible entre ${item.d}.` : `One is not enough, so ${item.n} is not divisible by ${item.d}.`);
  const si = idioma === 'es' ? 'Sí' : 'Yes';
  return `<p>${regla}</p>${cabecera}<ol class="pasos-ayuda">${pasos.join('')}</ol><p>${conclusion} ${RESPUESTA[idioma](`<strong>${item.divisible ? si : 'No'}</strong>`)}</p>`;
}
