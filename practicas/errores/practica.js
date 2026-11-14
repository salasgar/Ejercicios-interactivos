// Práctica «Caza el error»: la interfaz. La lógica pura está en logica.js y el
// banco de procedimientos en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { esc } from '../_comun/textos.js';
import { TX, NOMBRES, html, explicaItem } from './textos.js';
import { generarHay, generarLinea, generarNombre, claveItem, PLANTILLA_POR_ID } from './logica.js';

function procedimiento(item, api) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${html(api.tt(l))}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

const explicacion = explicaItem;

// Los enunciados salen también en la traducción (sin los botones).
const enunciadoHay = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.hay)}</p>${procedimiento(item, textos)}`;
const enunciadoLinea = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.linea)}</p>${procedimiento(item, textos)}`;
const enunciadoNombre = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.nombre)}</p>${procedimiento(item, textos)}`;

function montarHay(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoHay(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'bien', html: tt(TX.bien) }, { valor: 'error', html: tt(TX.error) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3200 });
    },
  });
}

function montarLinea(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;   // las líneas son los botones
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: item.lineas.map((l, i) => ({
      valor: i,
      html: `<span class="procedimiento__n">${i + 1}</span>${html(tt(l))}`,
    })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3200 });
    },
  });
}

function montarNombre(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoNombre(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map(clave => ({ valor: clave, html: esc(tt(NOMBRES[clave])) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3200 });
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
      enunciado: enunciadoHay,
      explicacion,
    },
    {
      nombre: TX.nombre.linea,
      detalle: TX.detalle.linea,
      generar: generarLinea,
      clave: claveItem,
      montar: montarLinea,
      enunciado: enunciadoLinea,
      explicacion,
    },
    {
      nombre: TX.nombre.nombre,
      detalle: TX.detalle.nombre,
      generar: generarNombre,
      clave: claveItem,
      montar: montarNombre,
      enunciado: enunciadoNombre,
      explicacion,
    },
  ],
});
