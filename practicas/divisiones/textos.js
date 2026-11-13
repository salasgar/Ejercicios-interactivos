// Práctica «Divisiones sucesivas guiadas»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

/**
 * Cierre de la factorización: multiplicar los factores devuelve el número de
 * partida (la factorización ES la respuesta; la cuenta solo sirve para comprobar).
 */
export function lineaComprobacion(n, factorizacion, idioma) {
  const factores = factorizacion.map(([p, e]) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`)).join(' · ');
  const valores = factorizacion.map(([p, e]) => p ** e).join(' · ');
  const cuenta = `<span class="cuenta">${factores} = ${valores} = ${n}</span>`;
  const frase = idioma === 'es'
    ? `Para comprobarlo, multiplica los factores: ${cuenta}. Sale el número de partida, ${n}.`
    : `To check it, multiply the factors: ${cuenta}. You get the number you started with, ${n}.`;
  return `<p>${frase}</p>`;
}

export const TX = {
  escalera: {
    nombre: { es: 'La escalera de divisiones', en: 'The division ladder' },
    detalle: { es: 'Divide paso a paso por el menor primo, hasta llegar a 1', en: 'Divide step by step by the smallest prime, down to 1' },
    instruccion: { es: 'Pulsa el <strong>MENOR primo</strong> que divide a este número', en: 'Press the <strong>SMALLEST prime</strong> that divides this number' },
  },
  potencias: {
    nombre: { es: 'La forma de potencias', en: 'The powers form' },
    detalle: { es: 'Escribe la lista de primos como un producto de potencias', en: 'Write the list of primes as a product of powers' },
    instruccion: { es: 'Estos son los primos. Pon el exponente de cada uno', en: 'These are the primes. Set the exponent of each one' },
    exponente_de: p => ({ es: `Exponente de ${p}`, en: `Exponent of ${p}` }),
  },
  ej3: {
    nombre: { es: 'Comprobar multiplicando', en: 'Check by multiplying' },
    detalle: { es: '¿Cuánto vale esta factorización?', en: 'What does this factorisation equal?' },
    pregunta_valor: { es: f => `¿Cuánto vale <strong>${f}</strong>?`, en: f => `What does <strong>${f}</strong> equal?` },
    pregunta_sino: { es: (f, v) => `¿Es correcto que <strong>${f} = ${v}</strong>?`, en: (f, v) => `Is it correct that <strong>${f} = ${v}</strong>?` },
    no_da: { es: 'no da', en: 'is not' },
    correcta: { es: 'La cuenta correcta es', en: 'The correct working is' },
  },
};

// ─── Explicaciones del botón «No lo sé» (tarea 184) ─────────────────────────────

const RESPUESTA = {
  es: x => `La respuesta es ${x}.`,
  en: x => `The answer is ${x}.`,
};

const veces = (p, e, idioma) => (idioma === 'es'
  ? `el ${p} aparece ${e} ${e === 1 ? 'vez' : 'veces'}`
  : `${p} appears ${e} time${e === 1 ? '' : 's'}`);

export function explicaEscalera(item, { idioma }) {
  const regla = idioma === 'es'
    ? 'Se divide siempre entre el menor primo que divide al número, hasta llegar a 1.'
    : 'Always divide by the smallest prime that divides the number, until you reach 1.';
  const pasos = item.pasos.map(([m, p]) => {
    const cuenta = idioma === 'es' ? `${m} : ${p} = ${m / p}` : `${m} ÷ ${p} = ${m / p}`;
    const motivo = idioma === 'es' ? `${p} es el menor primo que divide a ${m}` : `${p} is the smallest prime that divides ${m}`;
    return `<li><span class="cuenta">${cuenta}</span>: ${motivo}.</li>`;
  });
  const primos = item.pasos.map(([, p]) => p).join(' · ');
  const cierre = RESPUESTA[idioma](`<strong>${item.n} = ${primos}</strong>`);
  return `<p>${regla}</p><ol class="pasos-ayuda">${pasos.join('')}</ol><p>${cierre}</p>`;
}

export function explicaPotencias(item, { idioma }) {
  const regla = idioma === 'es'
    ? 'Se cuenta cuántas veces aparece cada primo en la lista; ese número es su exponente.'
    : 'Count how many times each prime appears in the list; that number is its exponent.';
  const pasos = item.factorizacion.map(([p, e]) => {
    const pot = e === 1 ? `${p}` : `${p}<sup>${e}</sup>`;
    return `<li>${veces(p, e, idioma)}: <span class="cuenta">${pot}</span>.</li>`;
  });
  const decoy = item.bases.filter(p => !item.factorizacion.some(([q]) => q === p));
  const nota = decoy.length
    ? `<p>${idioma === 'es' ? `El ${decoy[0]} no aparece: su exponente es 0.` : `${decoy[0]} does not appear: its exponent is 0.`}</p>`
    : '';
  const cierre = RESPUESTA[idioma](`<strong>${item.n} = ${item.factorizacion.map(([p, e]) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`)).join(' · ')}</strong>`);
  return `<p>${regla}</p><ol class="pasos-ayuda">${pasos.join('')}</ol>${nota}${lineaComprobacion(item.n, item.factorizacion, idioma)}<p>${cierre}</p>`;
}

export function explicaComprobar(item, { idioma }) {
  const f = item.factorizacion;
  const valor = f.reduce((a, [p, e]) => a * p ** e, 1);
  const regla = idioma === 'es'
    ? 'Se calcula cada potencia y después se multiplican los resultados.'
    : 'Work out each power, then multiply the results.';
  const pasos = f.filter(([, e]) => e > 1).map(([p, e]) => {
    const rep = Array(e).fill(p).join(' · ');
    return `<li><span class="cuenta">${p}<sup>${e}</sup> = ${rep} = ${p ** e}</span></li>`;
  });
  const producto = `<span class="cuenta">${f.map(([p, e]) => p ** e).join(' · ')} = ${valor}</span>`;
  const lista = pasos.length ? `<ol class="pasos-ayuda">${pasos.join('')}</ol>` : '';
  const multiplicar = `<p>${idioma === 'es' ? 'Multiplicamos' : 'We multiply'}: ${producto}.</p>`;
  let cierre;
  if (item.tipo === 'sino') {
    const si = item.igualdadCorrecta;
    const frase = idioma === 'es'
      ? `El valor es ${valor}, y la igualdad dice ${item.valorMostrado}.`
      : `The value is ${valor}, and the equality says ${item.valorMostrado}.`;
    cierre = `<p>${frase} ${RESPUESTA[idioma](`<strong>${si ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No'}</strong>`)}</p>`;
  } else {
    cierre = `<p>${RESPUESTA[idioma](`<strong>${valor}</strong>`)}</p>`;
  }
  return `<p>${regla}</p>${lista}${multiplicar}${cierre}`;
}
