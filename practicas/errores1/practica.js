// Práctica «Caza el error (unidad 1)»: la interfaz. La lógica pura está en logica.js y el
// banco de procedimientos en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { lista, lineasPulsables } from '../_comun/procedimiento.js';
import { esc } from '../_comun/textos.js';
import { TX, NOMBRES, html, explicacion, explicacionPasos, explicaHay, explicaLinea, explicaNombre, explicaPasos } from './textos.js';
import { generarHay, generarLinea, generarNombre, generarPasos, claveItem, clavePasos } from './logica.js';

/** El procedimiento sin números de línea (se confundían con los de la cuenta); la primera línea es el enunciado. */
const procedimiento = (item, { tt }) => lista(item.lineas.map(l => html(tt(l))));

const enunciadoHay = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.hay)}</p>${procedimiento(item, textos)}`;
const enunciadoLinea = (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;
const enunciadoNombre = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.nombre)}</p>${procedimiento(item, textos)}`;
const enunciadoPasos = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.pasos)}</p>${procedimiento(item, textos)}`;

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
  contenedor.innerHTML = enunciadoLinea(item, api);
  // El enunciado va fijo arriba: no se puede pulsar (en el enunciado no hay error).
  const botones = lineasPulsables(contenedor, {
    lineasHtml: item.lineas.map(l => html(tt(l))),
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

function montarPasos(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoPasos(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: tt(TX.si) }, { valor: 'no', html: tt(TX.no) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacionPasos(item, textos), espera: 3600 });
    },
  });
}

arrancar({
  slug: 'errores1',
  ejercicios: [
    {
      nombre: TX.nombre.hay,
      detalle: TX.detalle.hay,
      introduccion: TX.introduccion,
      generar: generarHay,
      clave: claveItem,
      montar: montarHay,
      enunciado: enunciadoHay,
      explicacion: explicaHay,
    },
    {
      nombre: TX.nombre.linea,
      detalle: TX.detalle.linea,
      generar: generarLinea,
      clave: claveItem,
      montar: montarLinea,
      enunciado: enunciadoLinea,
      explicacion: explicaLinea,
    },
    {
      nombre: TX.nombre.nombre,
      detalle: TX.detalle.nombre,
      generar: generarNombre,
      clave: claveItem,
      montar: montarNombre,
      enunciado: enunciadoNombre,
      explicacion: explicaNombre,
    },
    {
      nombre: TX.nombre.pasos,
      detalle: TX.detalle.pasos,
      introduccion: TX.introduccion_pasos,
      generar: generarPasos,
      clave: clavePasos,
      montar: montarPasos,
      enunciado: enunciadoPasos,
      explicacion: explicaPasos,
    },
  ],
});
