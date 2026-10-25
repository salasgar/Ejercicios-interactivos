// Práctica «La regla de los signos» (unidad 3, tarea 85): la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en `logica.js`, pura y probada en
// `tests/practicas-signos-producto.test.js`; los textos, en `textos.js`.
//
// Los ejercicios 1 y 4 tienen dos pasos (elegir; calcular) y UNA sola llamada a `api.responder`:
// si falla el primer paso, el ítem termina ahí. «Comprobar» se oculta al responder (T58).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero } from '../_comun/enteros.js';
import {
  TX, feedbackMultiplica, feedbackDivide, feedbackFalta, feedbackClase, feedbackValorSumaProducto, feedbackBien,
} from './textos.js';
import {
  generarMultiplica, generarDivide, generarFalta, generarSumaOProducto, generarBienEscrito,
  SIGNOS_OPCION, ver, errorDeSignoProducto, errorDeValorProducto, errorDeDivide, errorDeFalta,
  errorDeClase, errorDeValorSumaProducto, ERROR_OTRO,
} from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;

/** Un campo para el resultado y «Comprobar» (más, si se quiere, otro botón). `alComprobar(valor)` se llama una vez. */
function pedirResultado(zona, api, alComprobar, extra = null) {
  zona.insertAdjacentHTML('beforeend', `<div id="campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>${extra ? `<button type="button" class="secundario" id="extra">${extra.texto}</button>` : ''}`);
  const boton = zona.querySelector('.comprobar');
  const campo = campoEntero(zona.querySelector('#campo'), { nombre: api.tt(TX.resultado), boton, alEnviar: comprobar });
  const otro = zona.querySelector('#extra');
  boton.addEventListener('click', () => comprobar(campo.valor()));
  otro?.addEventListener('click', () => {
    if (api.respondido()) return;
    campo.bloquear(); boton.hidden = true; otro.hidden = true;
    extra.alPulsar();
  });
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    if (otro) otro.hidden = true;
    alComprobar(valor);
  }
}

// ─── Ejercicio 1: multiplica ───────────────────────────────────────────────────

const enunciadoMultiplica = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.multiplica)}</p><div class="operacion">${item.texto}</div>`;

function montarMultiplica(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoMultiplica(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const botones = elecciones(zona, {
    clase: 'si-no',
    opciones: SIGNOS_OPCION.map(s => ({ valor: s, html: cuenta(ver(s)) })),
    alElegir(s) {
      if (api.respondido()) return;
      botones.marcar([item.signo], s);
      if (s !== item.signo) {
        return api.responder({ acierto: false, html: ctx => feedbackMultiplica(item, ctx, false), error: errorDeSignoProducto(item), respuesta: ver(s) });
      }
      zona.insertAdjacentHTML('beforeend', `<p class="instruccion">${tt(TX.enunciado.multiplica2)}</p><div class="operacion">${item.texto} = □</div>`);
      pedirResultado(zona, api, valor => {
        const acierto = valor === item.valor;
        api.responder({
          acierto, html: ctx => feedbackMultiplica(item, ctx, acierto),
          error: acierto ? undefined : errorDeValorProducto(item, valor), respuesta: fmt(valor),
        });
      });
    },
  });
}

// ─── Ejercicio 2: divide ───────────────────────────────────────────────────────

const enunciadoDivide = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.divide)}</p><div class="operacion">${item.texto} = □</div>`;

function montarDivide(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoDivide(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const responder = (acierto, r) => api.responder({
    acierto, html: ctx => feedbackDivide(item, ctx, acierto),
    error: acierto ? undefined : errorDeDivide(item, r), respuesta: r === 'no-se-puede' ? api.tt(TX.no_se_puede) : fmt(r),
  });
  pedirResultado(zona, api, valor => responder(item.especial !== 'entre-cero' && valor === item.valor, valor),
    { texto: api.tt(TX.no_se_puede), alPulsar: () => responder(item.especial === 'entre-cero', 'no-se-puede') });
}

// ─── Ejercicio 3: el factor que falta ──────────────────────────────────────────

const enunciadoFalta = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.falta)}</p><div class="operacion">${item.texto}</div>`;

function montarFalta(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoFalta(item, api)}<div id="zona"></div>`;
  pedirResultado(contenedor.querySelector('#zona'), api, valor => {
    const acierto = valor === item.valor;
    api.responder({ acierto, html: ctx => feedbackFalta(item, ctx, acierto), error: acierto ? undefined : errorDeFalta(item, valor), respuesta: fmt(valor) });
  });
}

// ─── Ejercicio 4: ¿suma o producto? ────────────────────────────────────────────

const enunciadoMezcla = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.mezcla)}</p><div class="operacion">${item.texto}</div>`;

function montarMezcla(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoMezcla(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const buena = item.producto ? 'producto' : 'suma';
  const botones = elecciones(zona, {
    clase: 'si-no',
    opciones: [{ valor: 'producto', html: tt(TX.es_producto) }, { valor: 'suma', html: tt(TX.es_suma) }],
    alElegir(v) {
      if (api.respondido()) return;
      botones.marcar([buena], v);
      if (v !== buena) {
        return api.responder({ acierto: false, html: ctx => feedbackClase(item, ctx), error: errorDeClase(item), respuesta: v === 'producto' ? tt(TX.es_producto) : tt(TX.es_suma) });
      }
      zona.insertAdjacentHTML('beforeend', `<p class="instruccion">${tt(TX.enunciado.mezcla2)}</p>`);
      pedirResultado(zona, api, valor => {
        const acierto = valor === item.valor;
        api.responder({
          acierto, html: ctx => feedbackValorSumaProducto(item, ctx, acierto),
          error: acierto ? undefined : errorDeValorSumaProducto(item, valor) ?? ERROR_OTRO, respuesta: fmt(valor),
        });
      });
    },
  });
}

// ─── Ejercicio 5: ¿cuál está bien escrito? ─────────────────────────────────────

const enunciadoBien = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.bien)}</p>`;

function montarBien(contenedor, item, api) {
  contenedor.innerHTML = enunciadoBien(item, api);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(o => ({ valor: o.texto, html: cuenta(o.texto) })),
    alElegir(texto) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => o.texto === texto);
      botones.marcar([item.buena], texto);
      api.responder({ acierto: elegida.bien, html: ctx => feedbackBien(item, ctx, texto), error: elegida.error ?? undefined, respuesta: texto, espera: 2000 });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'signos-producto',
  ejercicios: [
    { nombre: TX.nombres.multiplica, detalle: TX.detalles.multiplica, introduccion: TX.introduccion.multiplica, generar: generarMultiplica, clave: i => i.texto, montar: montarMultiplica, enunciado: enunciadoMultiplica },
    { nombre: TX.nombres.divide, detalle: TX.detalles.divide, introduccion: TX.introduccion.divide, generar: generarDivide, clave: i => i.texto, montar: montarDivide, enunciado: enunciadoDivide },
    { nombre: TX.nombres.falta, detalle: TX.detalles.falta, introduccion: TX.introduccion.falta, generar: generarFalta, clave: i => i.texto, montar: montarFalta, enunciado: enunciadoFalta },
    { nombre: TX.nombres.mezcla, detalle: TX.detalles.mezcla, introduccion: TX.introduccion.mezcla, generar: generarSumaOProducto, clave: i => i.texto, montar: montarMezcla, enunciado: enunciadoMezcla },
    { nombre: TX.nombres.bien, detalle: TX.detalles.bien, introduccion: TX.introduccion.bien, generar: generarBienEscrito, clave: i => i.buena, montar: montarBien, enunciado: enunciadoBien },
  ],
});
