// Práctica «Caza el error» de la unidad 3 (PU2, tarea 89): la interfaz. La lógica pura está en
// logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (enteros.js).
//
// Ejercicio 1 en columnas (JL, 22-11): el mismo cálculo hecho por varios alumnos. Se marca la línea mala de cada
// columna con error y se pulsa «Comprobar»; si está bien, se pregunta qué error hay en cada columna mala. Una sola
// llamada a `api.responder`: el primer fallo termina el ítem con la explicación de todas las columnas.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { lista, columnasPulsables, columnasFijas } from '../_comun/procedimiento.js';
import {
  TX, linea, nombreError, explicacion, explicacionColumnas, explicaDonde, explicaCual, explicaSiNo,
  enunciadoColumnas, columnasDe,
} from './textos.js';
import { generarDonde, generarCual, generarSiNo, claveItem, VALIDA_POR_ID, LETRAS } from './logica.js';

/** El cálculo sin números de línea; la primera línea es el enunciado. */
const procedimiento = item => lista(item.lineas.map(linea));

const enunciado = clave => (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion[clave])}</p>${procedimiento(item)}`;
const enunciadoDonde = (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion.donde)}</p>${columnasFijas(enunciadoColumnas(item), columnasDe(item))}`;

/** Lo que se anota del fallo: el error típico del ítem (o el que el alumno creyó ver, si era una pareja válida). */
const falloDe = (item, respuesta) => ({
  error: item.error ?? VALIDA_POR_ID[item.plantilla].parecido,
  respuesta: String(respuesta).slice(0, 80),
});

/** Lo marcado en las columnas, para el registro del profesor: «A:2 B:- C:1». */
const marcasEnTexto = marcas => marcas.map((m, j) => `${LETRAS[j]}:${m ?? '-'}`).join(' ');

function montarDonde(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.donde)}</p>`;
  const html = textos => explicacionColumnas(item, textos);
  const columnas = columnasPulsables(contenedor, {
    enunciadoHtml: enunciadoColumnas(item),
    columnas: columnasDe(item),
    textoComprobar: tt(TX.comprobar),
    alComprobar(marcas) {
      if (api.respondido()) return;
      columnas.corregir(item.solucion, { bien: tt(TX.col_bien), mal: tt(TX.col_mal) });
      const fallo = marcas.findIndex((m, j) => m !== item.solucion[j]);
      if (fallo >= 0) {
        // El error de la columna que ha fallado; si ha marcado una columna que estaba bien, el que creyó ver.
        const col = item.columnas[fallo];
        api.responder({ acierto: false, html, espera: 'boton', error: col.error ?? 've-un-error-donde-no-lo-hay', respuesta: marcasEnTexto(marcas) });
        return;
      }
      preguntar(0);
    },
  });

  /** La pregunta k: qué error hay en la columna mala k-ésima. Al acabar todas, acierto. */
  function preguntar(k) {
    if (api.respondido()) return;
    if (k === item.preguntas.length) { api.responder({ acierto: true, html, espera: 'boton' }); return; }
    const q = item.preguntas[k];
    contenedor.insertAdjacentHTML('beforeend', `<p class="instruccion instruccion--siguiente">${tt(TX.pregunta_col)(LETRAS[q.col])}</p>`);
    const nombres = elecciones(contenedor, {
      clase: 'elecciones nombres',
      opciones: q.opciones.map(id => ({ valor: id, html: nombreError(id, tt) })),
      alElegir(id) {
        if (api.respondido()) return;
        nombres.marcar([q.solucion], id);
        if (id !== q.solucion) { api.responder({ acierto: false, html, espera: 'boton', error: q.solucion, respuesta: id }); return; }
        preguntar(k + 1);
      },
    });
    nombres.elemento.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }
}

function montarCual(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciado('cual')(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map(id => ({ valor: id, html: nombreError(id, tt) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3600, ...falloDe(item, valor) });
    },
  });
}

function montarSiNo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciado('sino')(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'bien', html: tt(TX.bien) }, { valor: 'error', html: tt(TX.error) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3600, ...falloDe(item, valor) });
    },
  });
}

arrancar({
  slug: 'errores3',
  ejercicios: [
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciadoDonde, explicacion: explicaDonde },
    { nombre: TX.nombre.cual, detalle: TX.detalle.cual, introduccion: TX.introduccion.cual, generar: generarCual, clave: claveItem, montar: montarCual, enunciado: enunciado('cual'), explicacion: explicaCual },
    { nombre: TX.nombre.sino, detalle: TX.detalle.sino, introduccion: TX.introduccion.sino, generar: generarSiNo, clave: claveItem, montar: montarSiNo, enunciado: enunciado('sino'), explicacion: explicaSiNo },
  ],
});

