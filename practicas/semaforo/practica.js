// Práctica «Semáforo de divisibilidad»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica (generadores y comprobaciones) está en
// `logica.js`, puro y probado en `tests/practicas-semaforo.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, claseCorreccion } from '../_comun/piezas.js';
import {
  generarSemaforo1, generarSemaforo2, generarSinoOTrampa, generarCifra,
  esCorrecta, explicar,
} from './logica.js';
import { TX } from './textos.js';

// ─── Ejercicios 1 y 2: el semáforo (botones que se encienden y se apagan) ───────

const enunciadoSemaforo = (item, { tt }) => `
    <p class="instruccion">${tt(TX.ej1.pregunta)(item.n)}</p>
    <div class="operacion">${item.n}</div>`;

function montarSemaforo(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoSemaforo(item, api)}
    <div class="botones-numeros" id="botones" role="group" aria-label="divisores"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#botones');
  const comprobar = contenedor.querySelector('#comprobar');
  const encendidos = new Set();
  let ninguno = false;
  // Check solo vale con algo pulsado: un número o «Ninguno».
  const actualizarComprobar = () => { comprobar.disabled = !ninguno && encendidos.size === 0; };
  const botonNinguno = document.createElement('button');
  botonNinguno.type = 'button';
  botonNinguno.className = 'ninguno';
  botonNinguno.textContent = api.tt(TX.ninguno);
  botonNinguno.setAttribute('aria-pressed', 'false');
  const botones = item.divisores.map(d => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(d);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (api.respondido()) return;
      ninguno = false;
      botonNinguno.setAttribute('aria-pressed', 'false');
      if (encendidos.has(d)) { encendidos.delete(d); b.setAttribute('aria-pressed', 'false'); }
      else { encendidos.add(d); b.setAttribute('aria-pressed', 'true'); }
      actualizarComprobar();
    });
    caja.append(b);
    return [d, b];
  });
  botonNinguno.addEventListener('click', () => {
    if (api.respondido()) return;
    ninguno = true;
    encendidos.clear();
    botones.forEach(([, b]) => b.setAttribute('aria-pressed', 'false'));
    botonNinguno.setAttribute('aria-pressed', 'true');
    actualizarComprobar();
  });
  caja.append(botonNinguno);
  comprobar.addEventListener('click', () => {
    if (api.respondido() || comprobar.disabled) return;
    const respuesta = [...encendidos];
    const acierto = esCorrecta(item, respuesta);
    const pinta = (b, correcto, pulsado) => {
      b.disabled = true;
      const c = claseCorreccion(pulsado, correcto);
      if (c) b.classList.add(c);
    };
    botones.forEach(([d, b]) => pinta(b, item.correctos.includes(d), encendidos.has(d)));
    pinta(botonNinguno, item.correctos.length === 0, ninguno);
    api.responder({ acierto, html: ({ idioma }) => explicar(item, respuesta, idioma), espera: 2200 });
  });
}

// ─── Ejercicio 3: ¿es divisible? (y la trampa del 4, el 6 y el 24) ──────────────

function enunciadoSino(item, { tt }) {
  const pregunta = item.tipo === 'trampa'
    ? tt(TX.ej3.pregunta_trampa)(item.n)
    : tt(TX.ej3.pregunta_sino)(item.n).replace('__D__', item.d);
  return `<p class="instruccion">${pregunta}</p>`;
}

function montarSino(contenedor, item, api) {
  contenedor.innerHTML = enunciadoSino(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correctos], valor);
      api.responder({ acierto: valor === item.correctos, html: ({ idioma }) => explicar(item, valor, idioma), espera: 1800 });
    },
  });
}

// ─── Ejercicio 4: la cifra que falta ────────────────────────────────────────────

function enunciadoCifra(item, { tt }) {
  const texto = item.cifras.map((c, i) => (i === item.hueco ? '□' : c)).join('');
  const condicion = item.divisores.length === 1
    ? tt(TX.ej4.pregunta_uno)(item.divisores[0])
    : tt(TX.ej4.pregunta_dos)(item.divisores[0], item.divisores[1]);
  return `
    <p class="instruccion">${tt(TX.ej4.instruccion)}</p>
    <div class="operacion">${texto}</div>
    <p class="frase">${condicion}</p>`;
}

function montarCifra(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoCifra(item, api)}
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
      botones.forEach((x, v) => {
        const c = claseCorreccion(v === d, esCorrecta(item, v));
        if (c) x.classList.add(c);
      });
      api.responder({ acierto, html: ({ idioma }) => explicar(item, d, idioma), espera: 1800 });
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
      enunciado: enunciadoSemaforo,
    },
    {
      nombre: TX.ej2.nombre,
      detalle: TX.ej2.detalle,
      generar: generarSemaforo2,
      clave: item => `${item.n}`,
      montar: montarSemaforo,
      enunciado: enunciadoSemaforo,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      generar: generarSinoOTrampa,
      clave: item => `${item.tipo}-${item.n}-${item.d ?? ''}`,
      montar: montarSino,
      enunciado: enunciadoSino,
    },
    {
      nombre: TX.ej4.nombre,
      detalle: TX.ej4.detalle,
      generar: generarCifra,
      clave: item => `${item.cifras.join('')}-${item.hueco}`,
      montar: montarCifra,
      enunciado: enunciadoCifra,
    },
  ],
});
