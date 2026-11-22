// Práctica «Caza el error (unidad 1)»: la interfaz. La lógica pura está en logica.js y el
// banco de procedimientos en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { lista, columnasPulsables, columnasFijas } from '../_comun/procedimiento.js';
import { esc } from '../_comun/textos.js';
import { TX, NOMBRES, html, explicacion, explicacionPasos, explicaHay, explicaLinea, explicaNombre, explicaPasos, explicacionColumnas, enunciadoColumnas, columnasDe, LETRAS } from './textos.js';
import { generarHay, generarColumnas, generarNombre, generarPasos, claveItem, clavePasos } from './logica.js';

/** El procedimiento sin números de línea (se confundían con los de la cuenta); la primera línea es el enunciado. */
const procedimiento = (item, { tt }) => lista(item.lineas.map(l => html(tt(l))));

const enunciadoHay = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.hay)}</p>${procedimiento(item, textos)}`;
const enunciadoLinea = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.linea)}</p>${columnasFijas(enunciadoColumnas(item, textos), columnasDe(item, textos))}`;
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

/** Lo marcado en las columnas, para el registro del profesor: «A:2 B:- C:1». */
const marcasEnTexto = marcas => marcas.map((m, j) => `${LETRAS[j]}:${m ?? '-'}`).join(' ');

/** Una sola llamada a `api.responder`: el primer fallo termina el ítem con la explicación de todas las columnas. */
function montarLinea(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;
  const cuerpo = textos => explicacionColumnas(item, textos);
  const columnas = columnasPulsables(contenedor, {
    enunciadoHtml: enunciadoColumnas(item, api),
    columnas: columnasDe(item, api),
    textoComprobar: tt(TX.comprobar),
    alComprobar(marcas) {
      if (api.respondido()) return;
      columnas.corregir(item.solucion, { bien: tt(TX.col_bien), mal: tt(TX.col_mal) });
      const fallo = marcas.findIndex((m, j) => m !== item.solucion[j]);
      if (fallo >= 0) {
        api.responder({ acierto: false, html: cuerpo, espera: 'boton', error: item.columnas[fallo].error ?? 've-un-error-donde-no-lo-hay', respuesta: marcasEnTexto(marcas) });
        return;
      }
      preguntar(0);
    },
  });

  function preguntar(k) {
    if (api.respondido()) return;
    if (k === item.preguntas.length) { api.responder({ acierto: true, html: cuerpo, espera: 'boton' }); return; }
    const q = item.preguntas[k];
    contenedor.insertAdjacentHTML('beforeend', `<p class="instruccion instruccion--siguiente">${tt(TX.pregunta_col)(LETRAS[q.col])}</p>`);
    const nombres = elecciones(contenedor, {
      clase: 'elecciones nombres',
      opciones: q.opciones.map(clave => ({ valor: clave, html: esc(tt(NOMBRES[clave])) })),
      alElegir(clave) {
        if (api.respondido()) return;
        nombres.marcar([q.solucion], clave);
        if (clave !== q.solucion) { api.responder({ acierto: false, html: cuerpo, espera: 'boton', error: q.solucion, respuesta: clave }); return; }
        preguntar(k + 1);
      },
    });
    nombres.elemento.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }
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
      generar: generarColumnas,
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
