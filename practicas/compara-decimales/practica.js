// Práctica «Compara, ordena y redondea» de la unidad 5 (PU2, tarea 124): la interfaz (los `montar`) y
// la llamada a `arrancar`. La lógica está en `logica.js`, puro y probado en
// `tests/practicas-compara-decimales.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto, decimal, deTexto } from '../_comun/decimales.js';
import {
  generarComparar, simboloComparar, errorComparar, explicarComparar,
  generarOrden, ordenBien, errorOrden, explicarOrden,
  generarEntre, estaEntre, errorEntre, errorEntreOpcion, explicarEntre,
  generarRedondeo, redondeoBueno, errorRedondeo, explicarRedondeo, consignaRedondeo,
} from './logica.js';
import { TX } from './textos.js';
import { explicaComparar, explicaOrden, explicaEntre, explicaRedondeo } from './ayuda.js';

const D =({ m, k }) => decimal(m, k);
const T = (d, idioma) => aTexto(D(d), idioma);

/** Campo para escribir un decimal (coma o punto en los dos idiomas); valida con `deTexto`. */
function campoDecimal(contenedor, { nombre, boton, alEnviar }) {
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.className = 'campo-numero';
  campo.setAttribute('inputmode', 'decimal');
  campo.setAttribute('autocomplete', 'off');
  campo.setAttribute('autocorrect', 'off');
  campo.setAttribute('enterkeyhint', 'done');
  campo.spellcheck = false;
  campo.style.setProperty('--cifras', 8);
  campo.setAttribute('aria-label', nombre);
  let bloqueado = false;
  const valor = () => deTexto(campo.value);
  const actualizar = () => {
    const malo = valor() === null && campo.value.trim() !== '';
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
    boton.disabled = bloqueado || valor() === null;
  };
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    if (!bloqueado && valor() !== null) alEnviar(valor());
  });
  contenedor.append(campo);
  actualizar();
  return { valor, bloquear() { bloqueado = true; campo.disabled = true; actualizar(); } };
}

// ─── Ejercicio 1: ¿cuál es mayor? ──────────────────────────────────────────────────────────

const frase = (item, idioma, medio) => `${T(item.a, idioma)} <span class="hueco-signo">${medio}</span> ${T(item.b, idioma)}`;

const enunciadoComparar = (item, { tt, idioma }) =>
  `<p class="instruccion">${tt(TX.comp.pregunta)}</p><div class="operacion">${frase(item, idioma, '□')}</div>`;

function montarComparar(contenedor, item, api) {
  contenedor.innerHTML = enunciadoComparar(item, api);
  const botones = elecciones(contenedor, {
    opciones: [{ valor: '<', html: '&lt;' }, { valor: '=', html: '=' }, { valor: '>', html: '&gt;' }],
    alElegir(elegido) {
      if (api.respondido()) return;
      const buena = simboloComparar(item);
      botones.marcar([buena], elegido);
      const acierto = elegido === buena;
      contenedor.querySelector('.operacion').innerHTML = frase(item, api.idioma, buena === '<' ? '&lt;' : buena === '>' ? '&gt;' : '=');
      api.responder({
        acierto,
        html: ({ idioma }) => explicarComparar(item, acierto ? null : elegido, idioma),
        espera: 2600,
        ...(acierto ? {} : { error: errorComparar(item, elegido), respuesta: `${T(item.a, api.idioma)} ${elegido} ${T(item.b, api.idioma)}` }),
      });
    },
  });
}

// ─── Ejercicio 2: ordena ───────────────────────────────────────────────────────────────────

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
  const botones = item.vals.map((v, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ficha';
    b.textContent = T(v, api.idioma);
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
    orden.innerHTML = elegidos.map(i => `<span class="ficha ficha--puesta">${T(item.vals[i], api.idioma)}</span>`).join('');
    boton.disabled = elegidos.length !== item.vals.length;
  }
  borrar.addEventListener('click', () => { if (api.respondido()) return; elegidos.length = 0; pintar(); });
  boton.addEventListener('click', () => {
    if (api.respondido() || elegidos.length !== item.vals.length) return;
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
      ...(acierto ? {} : { error: errorOrden(item, mio), respuesta: mio.map(i => T(item.vals[i], api.idioma)).join(', ') }),
    });
  });
  pintar();
}

// ─── Ejercicio 3: entre dos ────────────────────────────────────────────────────────────────

const enunciadoEntre = (item, { tt, idioma }) =>
  `<p class="instruccion instruccion--enunciado">${tt(item.modo === 'escribe' ? TX.entre.escribe : TX.entre.elige)(T(item.a, idioma), T(item.b, idioma))}</p>`;

function montarEntre(contenedor, item, api) {
  const { tt } = api;
  if (item.modo === 'elige') {
    contenedor.innerHTML = enunciadoEntre(item, api);
    const botones = elecciones(contenedor, {
      opciones: item.opciones.map((o, i) => ({ valor: String(i), html: T(o.d, api.idioma) })),
      alElegir(elegido) {
        if (api.respondido()) return;
        const buena = item.opciones.findIndex(o => o.error === null);
        botones.marcar([String(buena)], elegido);
        const error = errorEntreOpcion(item, Number(elegido));
        api.responder({
          acierto: error === null,
          html: ({ idioma }) => explicarEntre(item, error, idioma),
          espera: 2800,
          ...(error === null ? {} : { error, respuesta: T(item.opciones[Number(elegido)].d, api.idioma) }),
        });
      },
    });
    return;
  }
  contenedor.innerHTML = `
    ${enunciadoEntre(item, api)}
    <div class="fila-campo"><span id="campo"></span></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoDecimal(contenedor.querySelector('#campo'), { nombre: tt(TX.entre.campo), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(t) {
    if (api.respondido() || t === null) return;
    campo.bloquear();
    boton.hidden = true;
    const error = errorEntre(item, t);
    api.responder({
      acierto: error === null,
      html: ({ idioma }) => explicarEntre(item, error, idioma),
      espera: 2800,
      ...(error === null ? {} : { error, respuesta: aTexto(t, api.idioma) }),
    });
  }
}

// ─── Ejercicio 4: redondea ─────────────────────────────────────────────────────────────────

const enunciadoRedondeo = (item, { tt, idioma }) => {
  const formato = item.modo === 'escribe' ? ` <span class="formato">${tt(TX.red.formato[item.c])}</span>` : '';
  return `<p class="instruccion instruccion--enunciado">${consignaRedondeo(item, idioma)}${formato}</p>`;
};

function montarRedondeo(contenedor, item, api) {
  const { tt } = api;
  if (item.modo === 'elige') {
    contenedor.innerHTML = enunciadoRedondeo(item, api);
    const botones = elecciones(contenedor, {
      opciones: item.opciones.map((o, i) => ({ valor: String(i), html: T(o.d, api.idioma) })),
      alElegir(elegido) {
        if (api.respondido()) return;
        const buena = item.opciones.findIndex(o => o.error === null);
        botones.marcar([String(buena)], elegido);
        const error = item.opciones[Number(elegido)].error;
        api.responder({
          acierto: error === null,
          html: ({ idioma }) => explicarRedondeo(item, error, idioma),
          espera: 2800,
          ...(error === null ? {} : { error, respuesta: T(item.opciones[Number(elegido)].d, api.idioma) }),
        });
      },
    });
    return;
  }
  contenedor.innerHTML = `
    ${enunciadoRedondeo(item, api)}
    <div class="fila-campo"><span id="campo"></span></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoDecimal(contenedor.querySelector('#campo'), { nombre: tt(TX.red.campo), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(t) {
    if (api.respondido() || t === null) return;
    campo.bloquear();
    boton.hidden = true;
    const error = errorRedondeo(item, t);
    api.responder({
      acierto: error === null,
      html: ({ idioma }) => explicarRedondeo(item, error, idioma),
      espera: 2800,
      ...(error === null ? {} : { error, respuesta: aTexto(t, api.idioma) }),
    });
  }
}

// ─── La práctica ───────────────────────────────────────────────────────────────────────────

const claveDe = d => `${d.m}/${d.k}`;

arrancar({
  slug: 'compara-decimales',
  ejercicios: [
    {
      nombre: TX.comp.nombre, detalle: TX.comp.detalle, introduccion: TX.comp.introduccion,
      generar: generarComparar, clave: i => `${claveDe(i.a)}:${claveDe(i.b)}`, montar: montarComparar, enunciado: enunciadoComparar,
      explicacion: explicaComparar,
    },
    {
      nombre: TX.orden.nombre, detalle: TX.orden.detalle, introduccion: TX.orden.introduccion,
      generar: generarOrden, clave: i => `${i.creciente}:${i.vals.map(claveDe).join(',')}`, montar: montarOrden, enunciado: enunciadoOrden,
      explicacion: explicaOrden, noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.entre.nombre, detalle: TX.entre.detalle, introduccion: TX.entre.introduccion,
      generar: generarEntre, clave: i => `${i.modo}:${claveDe(i.a)}:${claveDe(i.b)}`, montar: montarEntre, enunciado: enunciadoEntre,
      explicacion: explicaEntre, noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.red.nombre, detalle: TX.red.detalle, introduccion: TX.red.introduccion,
      generar: generarRedondeo, clave: i => `${i.modo}:${claveDe(i.d)}:${i.c}`, montar: montarRedondeo, enunciado: enunciadoRedondeo,
      explicacion: explicaRedondeo, noLoSe: TX.no_se_hacerlo,
    },
  ],
});
