// «No lo sé» en «Quita denominadores» (tarea 176): la explicación de cada ejercicio, con los números del ítem.

const cuenta = h => `<span class="cuenta">${h}</span>`;
const respuesta = (idioma, t) => (idioma === 'es' ? `La respuesta es ${t}.` : `The answer is ${t}.`);

const REGLA = {
  es: 'Regla: se multiplican todos los términos, de los dos miembros, por el m.c.m. de los denominadores.',
  en: 'Rule: multiply every term, on both sides, by the LCM of the denominators.',
};

export function explicaMcm(item, { idioma, tt }) {
  return `${REGLA[idioma]} ${tt(item.solucion)} ${respuesta(idioma, cuenta(String(item.mcm)))}`;
}

export function explicaSin(item, { idioma, tt }) {
  const buena = item.opciones.find(o => o.correcta);
  return `${REGLA[idioma]} ${tt(item.solucion)} ${respuesta(idioma, cuenta(buena.html))}`;
}

export function explicaResuelve(item, { idioma, tt }) {
  const regla = idioma === 'es'
    ? 'Primero se quitan los denominadores multiplicando todos los términos por el m.c.m.; después se resuelve como siempre.'
    : 'First clear the denominators by multiplying every term by the LCM; then solve as usual.';
  return `${regla} ${tt(item.explicacion)} ${respuesta(idioma, cuenta(`<i>x</i> = ${item.solucion}`))}`;
}

export function explicaPasos(item, { idioma, tt }) {
  const es = idioma === 'es';
  const tres = es
    ? `${cuenta(String(item.mcm))} (m.c.m.), ${cuenta(item.cerrada)} y ${cuenta(`<i>x</i> = ${item.solucion}`)}`
    : `${cuenta(String(item.mcm))} (LCM), ${cuenta(item.cerrada)} and ${cuenta(`<i>x</i> = ${item.solucion}`)}`;
  return `${REGLA[idioma]} ${tt(item.explicacion)} ${respuesta(idioma, tres)}`;
}
