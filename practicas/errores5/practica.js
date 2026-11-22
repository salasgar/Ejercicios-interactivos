// Práctica «Caza el error» de la unidad 5, Decimals (PU2, tarea 128): la interfaz. La lógica pura está
// en logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (decimales.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { lista, columnasPulsables, columnasFijas } from '../_comun/procedimiento.js';
import { aTexto } from '../_comun/decimales.js';
import { TX, explicacionDe, explicacionColumnas, enunciadoColumnas, columnasDe, linea, nombreError, explicaDonde, explicaQue, explicaCorrige } from './textos.js';
import { campoDecimal } from './campo.js';
import {
  generarDonde, generarQue, generarCorrige, claveItem,
  corregirCorrige, resultadoBueno, LETRAS,
} from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;

/** El cálculo sin números de línea (se confundían con los de la cuenta: «2= 212 · 9»); la primera es el enunciado. */
const procedimiento = (item, idioma) => lista(item.lineas.map(l => linea(l, idioma)));

/** La explicación del ítem (vive en textos.js, para que el «No lo sé» la reutilice). */
const explicacion = explicacionDe;

// ─── Ejercicio 1: ¿dónde está el error? ────────────────────────────────────────

const enunciadoDonde = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.instruccion.donde)}</p>${columnasFijas(enunciadoColumnas(item, idioma), columnasDe(item, idioma))}`;

/** Lo marcado en las columnas, para el registro del profesor: «A:2 B:- C:1». */
const marcasEnTexto = marcas => marcas.map((m, j) => `${LETRAS[j]}:${m ?? '-'}`).join(' ');

// El mismo cálculo en 2-4 columnas (JL, 22-11): se marca la línea mala de cada columna con error y se pulsa
// «Comprobar»; si está bien, se pregunta qué error hay en cada columna mala. Una sola llamada a `api.responder`:
// el primer fallo termina el ítem con la explicación de todas las columnas.
function montarDonde(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.donde)}</p>`;
  const html = textos => explicacionColumnas(item, textos);
  const columnas = columnasPulsables(contenedor, {
    enunciadoHtml: enunciadoColumnas(item, idioma),
    columnas: columnasDe(item, idioma),
    textoComprobar: tt(TX.comprobar),
    alComprobar(marcas) {
      if (api.respondido()) return;
      columnas.corregir(item.solucion, { bien: tt(TX.col_bien), mal: tt(TX.col_mal) });
      const fallo = marcas.findIndex((m, j) => m !== item.solucion[j]);
      if (fallo >= 0) {
        api.responder({ acierto: false, html, espera: 'boton', error: item.columnas[fallo].error ?? 've-un-error-donde-no-lo-hay', respuesta: marcasEnTexto(marcas) });
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

// ─── Ejercicio 2: ¿qué error es? ───────────────────────────────────────────────

const enunciadoQue = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.instruccion.que)}</p>${procedimiento(item, idioma)}`;

function montarQue(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoQue(item, api);
  const nombres = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map(id => ({ valor: id, html: nombreError(id, tt) })),
    alElegir(id) {
      if (api.respondido()) return;
      nombres.marcar([item.solucion], id);
      const acierto = id === item.solucion;
      api.responder({
        acierto, html: textos => explicacion(item, textos), espera: 3600,
        ...(acierto ? {} : { error: item.error, respuesta: id }),
      });
    },
  });
}

// ─── Ejercicio 3: corrígelo ────────────────────────────────────────────────────

const enunciadoCorrige = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.instruccion.corrige)}</p>${procedimiento(item, idioma)}`;

function montarCorrige(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = `${enunciadoCorrige(item, api)}
    <p class="igualdad igualdad--campo"><span>${tt(TX.resultado_bien)}</span> <span id="campo"></span></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoDecimal(contenedor.querySelector('#campo'), { nombre: tt(TX.nombre_resultado), boton, alEnviar: () => comprobar() });

  function comprobar() {
    const escrito = campo.valor();
    if (api.respondido() || escrito === null) return;
    const resultado = corregirCorrige(item, escrito);
    campo.bloquear();
    boton.hidden = true;
    campo.elemento.classList.add(resultado.acierto ? 'respuesta--bien' : 'respuesta--mal');
    api.responder({
      acierto: resultado.acierto, espera: 3600,
      html: textos => `${resultado.acierto ? '' : `${textos.tt(TX.resultado_bien)} ${cuenta(aTexto(resultadoBueno(item), textos.idioma, item.cifras))}<br>`}${explicacion(item, textos, { escrito: resultado.acierto ? null : escrito, resultado })}`,
      ...(resultado.acierto ? {} : { error: resultado.error === 'repite-el-error' ? item.error : resultado.error, respuesta: aTexto(escrito, 'es') }),
    });
  }
  boton.addEventListener('click', comprobar);
}

arrancar({
  slug: 'errores5',
  ejercicios: [
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciadoDonde, explicacion: explicaDonde },
    { nombre: TX.nombre.que, detalle: TX.detalle.que, introduccion: TX.introduccion.que, generar: generarQue, clave: claveItem, montar: montarQue, enunciado: enunciadoQue, explicacion: explicaQue },
    { nombre: TX.nombre.corrige, detalle: TX.detalle.corrige, introduccion: TX.introduccion.corrige, generar: generarCorrige, clave: claveItem, montar: montarCorrige, enunciado: enunciadoCorrige, explicacion: explicaCorrige, noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' } },
  ],
});
