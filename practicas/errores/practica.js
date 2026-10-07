// Práctica «Caza el error»: la interfaz. La lógica pura está en logica.js y el
// banco de procedimientos en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { esc } from '../_comun/textos.js';
import { TX, NOMBRES } from './textos.js';
import { generarHay, generarLinea, generarNombre, claveItem, PLANTILLA_POR_ID } from './logica.js';

/** Texto de una línea a HTML seguro, con los exponentes `2^3` como <sup>. */
const html = texto => esc(texto).replace(/\^(\d+)/g, '<sup>$1</sup>');

function procedimiento(item, api) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${html(api.tt(l))}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

/** La explicación del ítem, con sus números: la corrección (con error) o por qué no era error (sin error). */
function explicacion(item, api) {
  const { tt } = api;
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  if (!item.error) return `${tt(TX.esta_bien)} ${html(tt(plantilla.porque(item.params)))}`;
  const n = item.error.linea + 1;
  const mala = `<span class="cuenta">${n}. ${html(tt(item.lineas[item.error.linea]))}</span>`;
  return `${tt(TX.la_linea_es)(n)} ${mala}<br>${esc(tt(NOMBRES[item.error.nombre]))}<br>${tt(TX.correcta)} ${html(tt(plantilla.corregida(item.params)))}`;
}

function montarHay(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.hay)}</p>${procedimiento(item, api)}`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'bien', html: tt(TX.bien) }, { valor: 'error', html: tt(TX.error) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: explicacion(item, api), espera: 3200 });
    },
  });
}

function montarLinea(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: item.lineas.map((l, i) => ({
      valor: i,
      html: `<span class="procedimiento__n">${i + 1}</span>${html(tt(l))}`,
    })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: explicacion(item, api), espera: 3200 });
    },
  });
}

function montarNombre(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.nombre)}</p>${procedimiento(item, api)}`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map(clave => ({ valor: clave, html: esc(tt(NOMBRES[clave])) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: explicacion(item, api), espera: 3200 });
    },
  });
}

arrancar({
  slug: 'errores',
  ejercicios: [
    {
      nombre: TX.nombre.hay,
      detalle: TX.detalle.hay,
      introduccion: TX.introduccion,
      generar: generarHay,
      clave: claveItem,
      montar: montarHay,
    },
    {
      nombre: TX.nombre.linea,
      detalle: TX.detalle.linea,
      generar: generarLinea,
      clave: claveItem,
      montar: montarLinea,
    },
    {
      nombre: TX.nombre.nombre,
      detalle: TX.detalle.nombre,
      generar: generarNombre,
      clave: claveItem,
      montar: montarNombre,
    },
  ],
});
