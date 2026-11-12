// «No lo sé» en «Resuelve» (tarea 176): la explicación de cada ejercicio, con los números del ítem.
// También las cuentas de comprobación, que comparten el feedback (practica.js) y la explicación.

import { terminosAHtml, terminosATexto, termino, MENOS } from '../_comun/algebra.js';
import { aTexto as textoFraccion, fraccion } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  ecDe, ecuacionAC, ecuacionSolucion, solDe, nombreDe, movimientos, lineasPrevias, lineasDeResolucion, solucionDe,
} from './logica.js';

export const cuenta = html => `<span class="cuenta">${html}</span>`;
export const htmlEc = ec => ec.aHtml();
export const htmlDatos = datos => htmlEc(ecDe(datos));
export const htmlSol = s => htmlEc(ecuacionSolucion(s));

/** El número entre paréntesis si hace falta (negativo o fracción). */
export const entreParentesis = s => (s.num < 0 || s.den !== 1 ? `(${textoFraccion(s)})` : textoFraccion(s));

/** «4 · 2 + 6»: un miembro con la x sustituida por s. */
function sustituido(terminosLista, s) {
  return terminosLista.map((t, i) => {
    const c = t.coef.simplificar();
    const abs = Math.abs(c.num);
    const cuerpo = t.letra === null ? textoFraccion(fraccion(abs, c.den))
      : (abs === 1 && c.den === 1 ? entreParentesis(s) : `${textoFraccion(fraccion(abs, c.den))} · ${entreParentesis(s)}`);
    const signo = c.num < 0 ? (i === 0 ? MENOS : ` ${MENOS} `) : (i === 0 ? '' : ' + ');
    return `${signo}${cuerpo}`;
  }).join('');
}

/** «Comprobación (x = 2): 4 · 2 + 6 = 14 y 12 + 2 = 14 ✓». */
export function comprobacion(ec, s, tt) {
  const vi = ec.izq.evaluar(s), vd = ec.der.evaluar(s);
  return `${tt(TX.ej3.comprobacion)} (x = ${textoFraccion(s)}): ${cuenta(`${sustituido(ec.terminosIzq, s)} = ${textoFraccion(vi.simplificar())}`)}`
    + ` ${tt(TX.ej3.y)} ${cuenta(`${sustituido(ec.terminosDer, s)} = ${textoFraccion(vd.simplificar())}`)} ✓`;
}

/** La resolución completa de una ecuación: cada línea en su cuenta. */
export const resolucionHtml = ec => [ec, ...ec.pasos().map(p => p.ecuacion)].map(e => cuenta(htmlEc(e))).join(' → ');

/** La suma de los números de una lista de términos, tal como se escribe: «3 − 5». */
export const sumaDeNumeros = ts => terminosATexto(ts.map(t => termino(t.coef, null)));

/** Un entero con el menos U+2212. */
const ent = n => textoFraccion(fraccion(n, 1));
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (idioma, t) => (idioma === 'es' ? `La respuesta es ${t}.` : `The answer is ${t}.`);

// ─── Ejercicio 1: el primer paso ──────────────────────────────────────────────────────────────

export function explicaPrimerPaso(item, { idioma }) {
  const es = idioma === 'es';
  const m = movimientos(ecDe(item));
  const neg = ts => terminosAHtml(ts.map(t => termino(t.coef.opuesta(), t.letra)));
  const lista = [];
  if (m.xd.length) {
    lista.push(es
      ? `Los términos con x del segundo miembro, ${cuenta(terminosAHtml(m.xd))}, pasan a la izquierda con el signo cambiado: ${cuenta(neg(m.xd))}.`
      : `The terms with x on the right-hand side, ${cuenta(terminosAHtml(m.xd))}, move to the left with their sign changed: ${cuenta(neg(m.xd))}.`);
  }
  if (m.ci.length) {
    lista.push(es
      ? `Los números del primer miembro, ${cuenta(terminosAHtml(m.ci))}, pasan a la derecha con el signo cambiado: ${cuenta(neg(m.ci))}.`
      : `The numbers on the left-hand side, ${cuenta(terminosAHtml(m.ci))}, move to the right with their sign changed: ${cuenta(neg(m.ci))}.`);
  }
  const buena = cuenta(htmlDatos(item.opciones[item.buena]));
  const consejo = es ? ' Consejo: lo que cambia de miembro siempre cambia de signo.' : ' Tip: whatever changes side always changes sign.';
  return `${pasos(lista)}${respuesta(idioma, buena)}${consejo}`;
}

// ─── Ejercicio 2: paso a paso ─────────────────────────────────────────────────────────────────

export function explicaPasoAPaso(item, { idioma, tt }) {
  const es = idioma === 'es';
  const ultima = lineasPrevias(item).at(-1);
  const s = solDe(item);
  const l1 = cuenta(htmlEc(ecuacionAC(item.A, item.C)));
  const lista = [es
    ? `Suma los números de la x, cada uno con su signo: ${cuenta(`${sumaDeNumeros(ultima.terminosIzq)} = ${ent(item.A)}`)}.`
    : `Add the numbers in front of x, each with its sign: ${cuenta(`${sumaDeNumeros(ultima.terminosIzq)} = ${ent(item.A)}`)}.`,
  ultima.terminosDer.length < 2
    ? (es ? `El número del segundo miembro se copia: ${cuenta(ent(item.C))}.` : `The number on the right-hand side is copied: ${cuenta(ent(item.C))}.`)
    : (es ? `Suma los números del segundo miembro: ${cuenta(`${sumaDeNumeros(ultima.terminosDer)} = ${ent(item.C)}`)}.` : `Add the numbers on the right-hand side: ${cuenta(`${sumaDeNumeros(ultima.terminosDer)} = ${ent(item.C)}`)}.`),
  es
    ? `Queda ${l1}. El número de la x pasa dividiendo: ${cuenta(`${ent(item.C)} : ${entreParentesis(fraccion(item.A, 1))}`)}, y sale ${cuenta(htmlSol(s))}.`
    : `You get ${l1}. The number in front of x moves across as a division: ${cuenta(`${ent(item.C)} : ${entreParentesis(fraccion(item.A, 1))}`)}, and you get ${cuenta(htmlSol(s))}.`];
  return `${pasos(lista)}${comprobacion(ecDe(item), s, tt)}. ${respuesta(idioma, `${cuenta(ent(item.A))}, ${cuenta(ent(item.C))} ${es ? 'y' : 'and'} ${cuenta(htmlSol(s))}`)}`;
}

// ─── Ejercicio 3: resuélvela ──────────────────────────────────────────────────────────────────

export function explicaResuelve(item, { idioma, tt }) {
  const es = idioma === 'es';
  const ec = ecDe(item);
  const s = solDe(item);
  const regla = es
    ? 'Pasa los términos con x a un miembro y los números al otro (cambian de signo), suma lo semejante y divide entre el número de la x.'
    : 'Move the terms with x to one side and the numbers to the other side (their sign changes), add the like terms and divide by the number in front of x.';
  return `${regla} ${tt(TX.ej3.resolucion)} ${resolucionHtml(ec)}. ${comprobacion(ec, s, tt)}. ${respuesta(idioma, cuenta(htmlSol(s)))}`;
}

// ─── Ejercicio 4: ¿está bien resuelta? ────────────────────────────────────────────────────────

export function explicaResolucion(item, { idioma, tt }) {
  const es = idioma === 'es';
  const consejo = es ? ' Consejo: comprueba cada paso con la línea de justo encima.' : ' Tip: check each step against the line just above it.';
  if (item.malo === 0) {
    const ec = lineasDeResolucion(item)[0];
    return `${es ? 'Cada paso sale bien de la línea de arriba.' : 'Every step follows correctly from the line above.'} ${comprobacion(ec, solucionDe(ec), tt)}. ${respuesta(idioma, tt(TX.ej4.todoBien).toLowerCase())}${consejo}`;
  }
  const nombre = (nombreDe(item.error)?.[idioma] ?? '').toLowerCase();
  const k = item.malo;
  const frase = es
    ? `El paso ${k} no sale de la línea de arriba. Tendría que ser ${cuenta(htmlDatos(item.correcta))}. Error: ${nombre}.`
    : `Step ${k} does not follow from the line above. It should be ${cuenta(htmlDatos(item.correcta))}. Mistake: ${nombre}.`;
  return `${frase} ${respuesta(idioma, tt(TX.ej4.paso)(k).toLowerCase())}${consejo}`;
}
