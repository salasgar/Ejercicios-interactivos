// Práctica «Compara y ordena» (PU2, tarea 102): la interfaz (los `montar`) y la llamada a
// `arrancar`. La lógica está en `logica.js`, puro y probado en `tests/practicas-compara.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto, fraccion, htmlCuenta, htmlFraccion } from '../_comun/fracciones.js';
import { crearRectaFracciones } from '../_comun/dibujo-fracciones.js';
import {
  generarComparar, simboloComparar, errorComparar, explicarComparar,
  CAJAS, generarCajas, cajaDe, fallosCajas, errorCajas, explicarCajas,
  generarOrden, ordenBien, errorOrden, explicarOrden,
  generarRecta, fraccionRecta, errorRecta, explicarRecta,
} from './logica.js';
import { TX } from './textos.js';

const fr = ({ num, den }) => fraccion(num, den);
const H = f => htmlFraccion(fr(f));
const T = f => aTexto(fr(f));

// ─── Ejercicio 1: mayor o menor ────────────────────────────────────────────────

const enunciadoComparar = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.comp.pregunta)}</p><div class="operacion">${htmlCuenta([fr(item.a), '□', fr(item.b)])}</div>`;

function montarComparar(contenedor, item, api) {
  contenedor.innerHTML = enunciadoComparar(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: '<', html: '&lt;' }, { valor: '>', html: '&gt;' }],
    alElegir(elegido) {
      if (api.respondido()) return;
      const buena = simboloComparar(item);
      botones.marcar([buena], elegido);
      const acierto = elegido === buena;
      contenedor.querySelector('.operacion').innerHTML = htmlCuenta([fr(item.a), buena, fr(item.b)]);
      api.responder({
        acierto,
        html: ({ idioma }) => explicarComparar(item, acierto ? null : elegido, idioma),
        espera: 2400,
        ...(acierto ? {} : { error: errorComparar(item, elegido), respuesta: `${T(item.a)} ${elegido} ${T(item.b)}` }),
      });
    },
  });
}

// ─── Ejercicio 2: frente a 1 y a 1/2 ───────────────────────────────────────────
// Se toca una fracción y después la caja donde va (como en `termometro`). «Comprobar» cuando
// están todas colocadas.

const enunciadoCajas = (item, { tt }) => `<p class="instruccion">${tt(TX.cajas.pregunta)}</p>`;

function montarCajas(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoCajas(item, api)}
    <div class="fichas" id="pila"></div>
    <div class="cajas" id="cajas">${CAJAS.map(c => `
      <div class="caja" role="group" data-caja="${c}"><span class="caja__titulo">${tt(TX.cajas.cajas[c])}</span><span class="caja__dentro"></span></div>`).join('')}
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const pila = contenedor.querySelector('#pila');
  const boton = contenedor.querySelector('#comprobar');
  const respuesta = item.fracs.map(() => null);
  let elegido = null;
  const ficha = (i, clase = '') => `<button type="button" class="ficha ${clase}" data-i="${i}">${H(item.fracs[i])}</button>`;
  function pintar() {
    pila.innerHTML = item.fracs.map((_, i) => (respuesta[i] === null ? ficha(i, i === elegido ? 'ficha--elegida' : '') : '')).join('');
    for (const c of CAJAS) {
      contenedor.querySelector(`[data-caja="${c}"] .caja__dentro`).innerHTML =
        item.fracs.map((_, i) => (respuesta[i] === c ? ficha(i, 'ficha--puesta') : '')).join('');
    }
    boton.disabled = respuesta.some(r => r === null);
  }
  contenedor.addEventListener('click', ev => {
    if (api.respondido()) return;
    const f = ev.target.closest('.ficha');
    const caja = ev.target.closest('.caja');
    if (f) {
      const i = Number(f.dataset.i);
      if (respuesta[i] !== null) { respuesta[i] = null; elegido = null; } else elegido = i === elegido ? null : i;
      ev.stopPropagation();
      pintar();
    } else if (caja && elegido !== null) {
      respuesta[elegido] = caja.dataset.caja;
      elegido = null;
      pintar();
    }
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || respuesta.some(r => r === null)) return;
    boton.hidden = true;
    const fallos = fallosCajas(item, respuesta);
    contenedor.querySelectorAll('.caja .ficha').forEach(f => {
      const i = Number(f.dataset.i);
      f.disabled = true;
      f.classList.add(cajaDe(item.fracs[i]) === respuesta[i] ? 'ficha--bien' : 'ficha--mal');
    });
    contenedor.querySelectorAll('.caja').forEach(c => c.classList.add('caja--cerrada'));
    const acierto = fallos.length === 0;
    const copia = [...respuesta];
    api.responder({
      acierto,
      html: ({ idioma }) => explicarCajas(item, fallosCajas(item, copia), idioma),
      espera: 3600,
      ...(acierto ? {} : { error: errorCajas(item, fallos), respuesta: fallos.map(f => `${T(item.fracs[f.i])}: ${f.puesto}`).join('; ') }),
    });
  });
  pintar();
}

// ─── Ejercicio 3: ordena ───────────────────────────────────────────────────────

const enunciadoOrden = (item, { tt }) => `<p class="instruccion">${tt(TX.orden.pregunta)(item.creciente)}</p>`;

function montarOrden(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoOrden(item, api)}
    <div class="fichas" id="tarjetas"></div>
    <p class="fichas-titulo">${api.tt(TX.orden.tuOrden)}</p>
    <div class="fichas fichas--orden" id="orden" aria-live="polite"></div>
    <div class="acciones">
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>
      <button type="button" class="secundario" id="borrar">${api.t.borrar}</button>
    </div>`;
  const tarjetas = contenedor.querySelector('#tarjetas');
  const orden = contenedor.querySelector('#orden');
  const boton = contenedor.querySelector('#comprobar');
  const borrar = contenedor.querySelector('#borrar');
  const elegidos = [];
  const botones = item.fracs.map((f, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ficha';
    b.innerHTML = H(f);
    b.addEventListener('click', () => {
      if (api.respondido() || elegidos.includes(i)) return;
      elegidos.push(i);
      pintar();
    });
    tarjetas.append(b);
    return b;
  });
  function pintar() {
    botones.forEach((b, i) => { b.disabled = elegidos.includes(i) || api.respondido(); });
    orden.innerHTML = elegidos.map(i => `<span class="ficha ficha--puesta">${H(item.fracs[i])}</span>`).join('');
    boton.disabled = elegidos.length !== item.fracs.length;
  }
  borrar.addEventListener('click', () => { if (api.respondido()) return; elegidos.length = 0; pintar(); });
  boton.addEventListener('click', () => {
    if (api.respondido() || elegidos.length !== item.fracs.length) return;
    boton.hidden = true;
    borrar.hidden = true;
    const mio = [...elegidos];
    const acierto = ordenBien(item, mio);
    botones.forEach(b => { b.disabled = true; });
    orden.querySelectorAll('.ficha').forEach(f => f.classList.add(acierto ? 'ficha--bien' : 'ficha--mal'));
    api.responder({
      acierto,
      html: ({ idioma }) => explicarOrden(item, acierto ? null : mio, idioma),
      espera: 3600,
      ...(acierto ? {} : { error: errorOrden(item, mio), respuesta: mio.map(i => T(item.fracs[i])).join(', ') }),
    });
  });
  pintar();
}

// ─── Ejercicio 4: en la recta ──────────────────────────────────────────────────
// Se toca una marca (se puede cambiar) y se pulsa «Comprobar». Los números de la recta
// son solo los enteros: hay que contar huecos.

const enunciadoRecta = (item, { tt }) => `<p class="instruccion instruccion--enunciado">${tt(TX.recta.pregunta)(htmlFraccion(fraccionRecta(item)))}</p>`;

function montarRecta(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoRecta(item, api)}
    <div id="recta"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  let elegida = null;
  const recta = crearRectaFracciones(contenedor.querySelector('#recta'), {
    min: item.min, max: item.max, den: item.den, numeros: 'enteros', nombre: api.tt(TX.recta.nombreRecta),
    alTocar(f) {
      if (api.respondido()) return;
      if (elegida) recta.desmarcar(elegida);
      elegida = f;
      recta.marcar(f, 'fd-toque--elegida');
      boton.disabled = false;
    },
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || !elegida) return;
    boton.hidden = true;
    recta.bloquear();
    const buena = fraccionRecta(item);
    const acierto = elegida.equals(buena);
    const toque = elegida;
    recta.desmarcar(toque);
    if (acierto) recta.marcar(toque, 'fd-toque--bien');
    else { recta.marcar(toque, 'fd-toque--mal'); recta.marcar(buena, 'fd-toque--falta'); }
    api.responder({
      acierto,
      html: ({ idioma }) => explicarRecta(item, acierto ? null : toque, idioma),
      espera: 2800,
      ...(acierto ? {} : { error: errorRecta(item, toque), respuesta: aTexto(toque) }),
    });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'compara',
  ejercicios: [
    {
      nombre: TX.comp.nombre, detalle: TX.comp.detalle, introduccion: TX.comp.introduccion,
      generar: generarComparar, clave: i => `${T(i.a)}:${T(i.b)}`, montar: montarComparar, enunciado: enunciadoComparar,
    },
    {
      nombre: TX.cajas.nombre, detalle: TX.cajas.detalle, introduccion: TX.cajas.introduccion,
      generar: generarCajas, clave: i => i.fracs.map(T).join(','), montar: montarCajas, enunciado: enunciadoCajas,
    },
    {
      nombre: TX.orden.nombre, detalle: TX.orden.detalle, introduccion: TX.orden.introduccion,
      generar: generarOrden, clave: i => `${i.creciente}:${i.fracs.map(T).join(',')}`, montar: montarOrden, enunciado: enunciadoOrden,
    },
    {
      nombre: TX.recta.nombre, detalle: TX.recta.detalle, introduccion: TX.recta.introduccion,
      generar: generarRecta, clave: i => `${i.min}:${i.max}:${i.num}/${i.den}`, montar: montarRecta, enunciado: enunciadoRecta,
    },
  ],
});
