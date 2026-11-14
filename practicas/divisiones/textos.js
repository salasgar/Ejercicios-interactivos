// Práctica «Divisiones sucesivas guiadas»: textos propios, siempre { es, en }.
// Los comunes (Comprobar, Siguiente, ¡Bien!…) llegan en `api.t`.

import { criterio, factorizar, htmlFact } from '../_comun/aritmetica.js';

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

// Primos de los botones de la escalera (los mismos que PRIMOS_ESCALERA de logica.js).
const PRIMOS_BOTONES = [2, 3, 5, 7, 11, 13];
const listaNi = (l, idioma) => (l.length < 2 ? `${l[0]}` : `${l.slice(0, -1).join(', ')} ${idioma === 'es' ? 'ni' : 'or'} ${l.at(-1)}`);

/**
 * Por qué ese primo es el que toca (revisión 193): los primos menores no dividen a m y ese sí, con el
 * criterio de los apuntes para 2, 3 y 5 (para 7, 11 y 13 se prueba dividiendo). Si m ya es primo, se
 * dice y se acaba.
 */
function motivoPaso(m, p, idioma) {
  const es = idioma === 'es';
  if (m === p) return es ? `${p} es primo, así que se divide entre él y sale 1` : `${p} is prime, so you divide by it and get 1`;
  const menores = PRIMOS_BOTONES.filter(q => q < p);
  const no = menores.length ? (es ? `no es divisible entre ${listaNi(menores, idioma)}; ` : `it is not divisible by ${listaNi(menores, idioma)}; `) : '';
  const si = [2, 3, 5].includes(p) ? criterio(m, p).razon[idioma] : (es ? `entre ${p}, sí` : `it is divisible by ${p}`);
  return `${no}${si}`;
}

export function explicaEscalera(item, { idioma }) {
  const regla = idioma === 'es'
    ? 'Prueba los primos en orden (2, 3, 5, 7…) y divide entre el primero que divida al número; sigue con el resultado hasta llegar a 1.'
    : 'Try the primes in order (2, 3, 5, 7…) and divide by the first one that divides the number; keep going with the result until you reach 1.';
  const pasos = item.pasos.map(([m, p]) => {
    const cuenta = idioma === 'es' ? `${m} : ${p} = ${m / p}` : `${m} ÷ ${p} = ${m / p}`;
    return `<li><span class="cuenta">${cuenta}</span>: ${motivoPaso(m, p, idioma)}.</li>`;
  });
  // Lo que se pulsa, en orden, y la factorización escrita con potencias, como en el feedback y los apuntes.
  const pulsados = item.pasos.map(([, p]) => String(p));
  const lista = pulsados.length < 2 ? pulsados[0] : `${pulsados.slice(0, -1).join(', ')} ${idioma === 'es' ? 'y' : 'and'} ${pulsados.at(-1)}`;
  const fact = `<span class="cuenta">${item.n} = ${htmlFact(factorizar(item.n))}</span>`;
  const cierre = idioma === 'es'
    ? `La respuesta es <strong>${lista}</strong>, en ese orden: ${fact}.`
    : `The answer is <strong>${lista}</strong>, in that order: ${fact}.`;
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
    // El texto del botón, entre comillas (revisión 193).
    const boton = `<strong>${si ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No'}</strong>`;
    cierre = `<p>${frase} ${RESPUESTA[idioma](idioma === 'es' ? `«${boton}»` : `“${boton}”`)}</p>`;
  } else {
    cierre = `<p>${RESPUESTA[idioma](`<strong>${valor}</strong>`)}</p>`;
  }
  return `<p>${regla}</p>${lista}${multiplicar}${cierre}`;
}
