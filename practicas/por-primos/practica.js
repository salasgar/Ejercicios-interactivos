// Práctica «Multiplica y divide por primos»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en `logica.js`, puro y probado en
// `tests/practicas-por-primos.test.js`.

import { arrancar } from '../_comun/base.js';
import { htmlFact, valorDe } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import { BASES, generar, factDe, expsDe, botonesActivos, tocar, esCorrecta, explicar, estadoPrimos } from './logica.js';

const pot = (p, e) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`);
const numero = f => `${valorDe(f)}${f.length ? ` = ${htmlFact(f)}` : ''}`;

/** Los primos del número, cada uno en su <span> para poder resaltar el que cambia. */
function pintarFact(f, cambiado = null) {
  if (!f.length) return '1';
  return f.map(([p, e]) => `<span class="pp-primo${p === cambiado ? ' pp-cambio' : ''}">${pot(p, e)}</span>`).join(' · ');
}

const enunciado = ejercicio => (item, { tt }) => `
    <p class="instruccion">${tt(TX[`e${ejercicio}`].regla)}</p>
    <div class="pp-numero"><span class="pp-etiqueta">${tt(TX.objetivo)}</span>
      <div class="operacion">${numero(item.objetivo)}</div></div>
    <div class="pp-numero"><span class="pp-etiqueta">${tt(TX.tuNumero)}</span>
      <div class="operacion">${numero(item.partida)}</div></div>`;

function montar(ejercicio) {
  return (contenedor, item, api) => {
    const { tt } = api;
    const j = ejercicio;
    contenedor.innerHTML = `
      <p class="instruccion">${tt(TX[`e${j}`].regla)}</p>
      <div class="pp-numero"><span class="pp-etiqueta">${tt(TX.objetivo)}</span>
        <div class="operacion" id="pp-objetivo">${numero(item.objetivo)}</div></div>
      <div class="pp-numero"><span class="pp-etiqueta">${tt(TX.tuNumero)}</span>
        <div class="operacion" id="pp-actual"></div></div>
      ${j >= 3 ? `<p class="pp-toques">${tt(TX.toques)}: <strong id="pp-n">0</strong></p>` : ''}
      <div class="pp-botones" id="pp-botones"></div>
      <div class="pp-acciones">
        <button type="button" class="discreto" id="pp-deshacer">${tt(TX.deshacer)}</button>
        <button type="button" class="discreto" id="pp-reiniciar">${tt(TX.reiniciar)}</button>
      </div>
      <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
    const zonaActual = contenedor.querySelector('#pp-actual');
    const zonaBotones = contenedor.querySelector('#pp-botones');
    const deshacer = contenedor.querySelector('#pp-deshacer');
    const reiniciar = contenedor.querySelector('#pp-reiniciar');
    const comprobar = contenedor.querySelector('#comprobar');
    const contador = contenedor.querySelector('#pp-n');

    let actual = item.partida;
    const historial = [];
    let fin = false;

    const pintar = (cambiado = null) => {
      if (!fin) zonaActual.innerHTML = `${valorDe(actual)}${actual.length ? ` = ${pintarFact(actual, cambiado)}` : ''}`;
      if (contador) contador.textContent = String(historial.length);
      const act = botonesActivos(j, actual);
      zonaBotones.querySelectorAll('button').forEach(b => {
        const lista = b.dataset.signo === '+' ? act.mult : act.div;
        b.disabled = fin || !lista?.[BASES.indexOf(Number(b.dataset.p))];
      });
      deshacer.disabled = fin || !historial.length;
      reiniciar.disabled = fin || !historial.length;
    };

    const filas = [];
    if (j !== 4) filas.push(['+', '·']);
    if (j !== 3) filas.push(['−', ':']);
    zonaBotones.innerHTML = filas.map(([signo, simbolo]) => `
      <div class="pp-fila">${BASES.map(p => `<button type="button" class="pp-boton" data-p="${p}" data-signo="${signo === '+' ? '+' : '-'}"
        aria-label="${(signo === '+' ? tt(TX.multiplicar) : tt(TX.dividir))(p)}">${simbolo} ${p}</button>`).join('')}</div>`).join('');
    zonaBotones.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      if (api.respondido()) return;
      const p = Number(b.dataset.p);
      const siguiente = tocar(j, actual, p, b.dataset.signo === '+' ? 1 : -1);
      if (!siguiente) return;
      historial.push(actual);
      actual = siguiente;
      pintar(p);
    }));
    deshacer.addEventListener('click', () => { if (historial.length && !api.respondido()) { actual = historial.pop(); pintar(); } });
    reiniciar.addEventListener('click', () => { if (!api.respondido()) { actual = item.partida; historial.length = 0; pintar(); } });
    pintar();

    comprobar.addEventListener('click', () => {
      if (api.respondido()) return;
      comprobar.hidden = true;
      fin = true;
      deshacer.hidden = reiniciar.hidden = true;
      const acierto = esCorrecta(item, actual);
      const final = actual;
      // Los cuatro estados de la corrección, en los primos del número final.
      const chips = estadoPrimos(item, final);
      zonaActual.innerHTML = `${valorDe(final)}${final.length ? ' = ' : ''}`
        + `<span class="botones-numeros pp-chips">${chips.map(c => `<button type="button" disabled class="${c.estado}">${c.e ? pot(c.p, c.e) : c.p}</button>`).join('')}</span>`;
      pintar();
      api.responder({
        acierto,
        html: ({ idioma }) => explicar(item, final, idioma),
        respuesta: htmlFact(final).replace(/<sup>(\d+)<\/sup>/g, '^$1'),
        espera: 3200,
      });
    });
  };
}

arrancar({
  slug: 'por-primos',
  ejercicios: [1, 2, 3, 4].map(j => ({
    nombre: TX[`e${j}`].nombre,
    detalle: TX[`e${j}`].detalle,
    introduccion: TX[`e${j}`].introduccion,
    generar: (rng) => generar(j, rng),
    montar: montar(j),
    enunciado: enunciado(j),
  })),
});
