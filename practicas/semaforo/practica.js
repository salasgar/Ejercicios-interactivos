// Práctica «Semáforo de divisibilidad»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica (generadores y comprobaciones) está en
// `logica.js`, puro y probado en `tests/practicas-semaforo.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  generarSemaforo1, generarSemaforo2, generarSinoOTrampa, generarCifra,
  esCorrecta, explicar,
} from './logica.js';
import { TX } from './textos.js';

// ─── Ejercicios 1 y 2: el semáforo (botones que se encienden y se apagan) ───────

function montarSemaforo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.ej1.pregunta)(item.n)}</p>
    <div class="operacion">${item.n}</div>
    <div class="botones-numeros" id="botones" role="group" aria-label="divisores"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#botones');
  const encendidos = new Set();
  const botones = item.divisores.map(d => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(d);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (api.respondido()) return;
      if (encendidos.has(d)) { encendidos.delete(d); b.setAttribute('aria-pressed', 'false'); }
      else { encendidos.add(d); b.setAttribute('aria-pressed', 'true'); }
    });
    caja.append(b);
    return [d, b];
  });
  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const respuesta = [...encendidos];
    const acierto = esCorrecta(item, respuesta);
    botones.forEach(([d, b]) => {
      b.disabled = true;
      if (item.correctos.includes(d)) b.classList.add('bien');
      else if (encendidos.has(d)) b.classList.add('mal');
    });
    api.responder({ acierto, html: explicar(item, respuesta, api.idioma), espera: 2200 });
  });
}

// ─── Ejercicio 3: ¿es divisible? (y la trampa del 4, el 6 y el 24) ──────────────

function montarSino(contenedor, item, api) {
  const { tt } = api;
  const pregunta = item.tipo === 'trampa'
    ? tt(TX.ej3.pregunta_trampa)(item.n)
    : tt(TX.ej3.pregunta_sino)(item.n).replace('__D__', item.d);
  contenedor.innerHTML = `<p class="instruccion">${pregunta}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correctos], valor);
      api.responder({ acierto: valor === item.correctos, html: explicar(item, valor, api.idioma), espera: 1800 });
    },
  });
}

// ─── Ejercicio 4: la cifra que falta ────────────────────────────────────────────

function montarCifra(contenedor, item, api) {
  const { tt } = api;
  const texto = item.cifras.map((c, i) => (i === item.hueco ? '□' : c)).join('');
  const condicion = item.divisores.length === 1
    ? tt(TX.ej4.pregunta_uno)(item.divisores[0])
    : tt(TX.ej4.pregunta_dos)(item.divisores[0], item.divisores[1]);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.ej4.instruccion)}</p>
    <div class="operacion">${texto}</div>
    <p class="frase">${condicion}</p>
    <div class="botones-numeros" id="botones" role="group" aria-label="cifras"></div>`;
  const caja = contenedor.querySelector('#botones');
  const botones = [];
  for (let d = 0; d <= 9; d++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(d);
    b.addEventListener('click', () => {
      if (api.respondido()) return;
      botones.forEach(x => { x.disabled = true; });
      const acierto = esCorrecta(item, d);
      if (acierto) b.classList.add('bien');
      else { b.classList.add('mal'); botones[item.solucion].classList.add('bien'); }
      api.responder({ acierto, html: explicar(item, d, api.idioma), espera: 1800 });
    });
    caja.append(b);
    botones.push(b);
  }
}

// ─── La práctica ─────────────────────────────────────────────────────────────────

arrancar({
  slug: 'semaforo',
  ejercicios: [
    {
      nombre: TX.ej1.nombre,
      detalle: TX.ej1.detalle,
      generar: generarSemaforo1,
      clave: item => `${item.n}`,
      montar: montarSemaforo,
    },
    {
      nombre: TX.ej2.nombre,
      detalle: TX.ej2.detalle,
      generar: generarSemaforo2,
      clave: item => `${item.n}`,
      montar: montarSemaforo,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      generar: generarSinoOTrampa,
      clave: item => `${item.tipo}-${item.n}-${item.d ?? ''}`,
      montar: montarSino,
    },
    {
      nombre: TX.ej4.nombre,
      detalle: TX.ej4.detalle,
      generar: generarCifra,
      clave: item => `${item.cifras.join('')}-${item.hueco}`,
      montar: montarCifra,
    },
  ],
});
