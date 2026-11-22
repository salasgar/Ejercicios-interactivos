// Práctica «Caza el error»: la interfaz. La lógica pura está en logica.js y el
// banco de procedimientos en textos.js.
//
// Ejercicio 2 en columnas (JL, 22-11): el mismo ejercicio hecho por varios alumnos. Se marca la primera línea mala de
// cada columna con error y se pulsa «Comprobar»; si está bien, se pregunta qué error hay en cada columna mala. Una
// sola llamada a `api.responder`: el primer fallo termina el ítem con la explicación de todas las columnas.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { lista, columnasPulsables, columnasFijas } from '../_comun/procedimiento.js';
import { esc } from '../_comun/textos.js';
import { TX, NOMBRES, html, explicaItem, explicaHay, explicaNombre, explicacionColumnas, explicaColumnas } from './textos.js';
import { generarHay, generarColumnas, generarNombre, claveItem, LETRAS } from './logica.js';

/** El procedimiento sin números de línea (se confundían con los de la cuenta); la primera línea es el enunciado. */
const procedimiento = (item, api) => lista(item.lineas.map(l => html(api.tt(l))));

const explicacion = explicaItem;   // el feedback al responder; el «No lo sé» lleva su tarjeta (explicaHay…)

// Los enunciados salen también en la traducción (sin los botones).
const enunciadoHay = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.hay)}</p>${procedimiento(item, textos)}`;
const enunciadoNombre = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.nombre)}</p>${procedimiento(item, textos)}`;

/** Las columnas del ejercicio 2: los pasos de cada alumno, sin el enunciado (va una vez arriba). */
const columnasDe = (item, { tt }) => item.columnas.map((c, j) => ({ letra: LETRAS[j], lineasHtml: c.lineas.slice(1).map(l => html(tt(l))) }));
const enunciadoColumnas = (item, textos) => `<p class="instruccion">${textos.tt(TX.instruccion.linea)}</p>${columnasFijas(html(textos.tt(item.enunciado)), columnasDe(item, textos))}`;
/** Lo marcado en las columnas, para el registro del profesor: «A:2 B:- C:1». */
const marcasEnTexto = marcas => marcas.map((m, j) => `${LETRAS[j]}:${m ?? '-'}`).join(' ');

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

function montarColumnas(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;
  const htmlFin = textos => explicacionColumnas(item, textos);
  // El enunciado va fijo arriba (no se puede pulsar: en el enunciado no hay error) y debajo, las columnas.
  const columnas = columnasPulsables(contenedor, {
    enunciadoHtml: html(tt(item.enunciado)),
    columnas: columnasDe(item, api),
    textoComprobar: tt(TX.comprobar),
    alComprobar(marcas) {
      if (api.respondido()) return;
      columnas.corregir(item.solucion, { bien: tt(TX.col_bien), mal: tt(TX.col_mal) });
      const fallo = marcas.findIndex((m, j) => m !== item.solucion[j]);
      if (fallo >= 0) {
        // El error de la columna que ha fallado; si ha marcado una columna que estaba bien, que vio un error donde no lo había.
        const error = item.columnas[fallo].error ?? 've-un-error-donde-no-lo-hay';
        api.responder({ acierto: false, html: htmlFin, espera: 'boton', error, respuesta: marcasEnTexto(marcas) });
        return;
      }
      preguntar(0);
    },
  });

  /** La pregunta k: qué error hay en la columna mala k-ésima. Al acabar todas, acierto. */
  function preguntar(k) {
    if (api.respondido()) return;
    if (k === item.preguntas.length) { api.responder({ acierto: true, html: htmlFin, espera: 'boton' }); return; }
    const q = item.preguntas[k];
    contenedor.insertAdjacentHTML('beforeend', `<p class="instruccion instruccion--siguiente">${tt(TX.pregunta_col)(LETRAS[q.col])}</p>`);
    const nombres = elecciones(contenedor, {
      clase: 'elecciones nombres',
      opciones: q.opciones.map(clave => ({ valor: clave, html: esc(tt(NOMBRES[clave])) })),
      alElegir(clave) {
        if (api.respondido()) return;
        nombres.marcar([q.solucion], clave);
        if (clave !== q.solucion) { api.responder({ acierto: false, html: htmlFin, espera: 'boton', error: q.solucion, respuesta: clave }); return; }
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
      explicacion: explicaHay,
    },
    {
      nombre: TX.nombre.linea,
      detalle: TX.detalle.linea,
      introduccion: TX.introduccion_columnas,
      generar: generarColumnas,
      clave: claveItem,
      montar: montarColumnas,
      enunciado: enunciadoColumnas,
      explicacion: explicaColumnas,
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
  ],
});
