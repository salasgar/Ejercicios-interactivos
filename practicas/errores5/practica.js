// Práctica «Caza el error» de la unidad 5, Decimals (PU2, tarea 128): la interfaz. La lógica pura está
// en logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (decimales.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { ERRORES_TIPICOS, aTexto } from '../_comun/decimales.js';
import { TX } from './textos.js';
import { campoDecimal } from './campo.js';
import {
  generarDonde, generarQue, generarCorrige, claveItem, PLANTILLA_POR_ID, htmlLinea, tieneCerosFinales,
  corregirCorrige, resultadoBueno,
} from './logica.js';

const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);
const cuenta = html => `<span class="cuenta">${html}</span>`;

/** Una línea del cálculo (la 1 tal cual; las demás ya empiezan por «= » o por su texto). */
const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));
function procedimiento(item, idioma) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${linea(l, idioma)}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

/** La explicación: qué línea, cómo se llama, por qué y cómo se hace bien. */
function explicacion(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  const p = PLANTILLA_POR_ID[item.plantilla];
  if (item.falsa === null) return `${tt(TX.todo_bien_es)}${tieneCerosFinales(item) ? `<br>${tt(TX.ceros)}` : ''}`;
  const buena = p.cadena(item.params, false).lineas[item.falsa];
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(aTexto(escrito, idioma))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : resultado?.error === 'cifras' ? `${tt(TX.cifras)} ` : '';
  return `${tuyo}${aviso}${tt(TX.la_linea_es)(item.falsa + 1)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}`
    + `<br>${p.porque(item.params, idioma)}`
    + `<br>${tt(TX.bien_es)} <span class="linea-mala">${linea(buena, idioma)}</span>`;
}

// ─── Ejercicio 1: ¿dónde está el error? ────────────────────────────────────────

const enunciadoDonde = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.instruccion.donde)}</p>${procedimiento(item, idioma)}`;

function montarDonde(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.donde)}</p>`;
  const correcta = item.falsa ?? 'ok';
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: [
      ...item.lineas.map((l, i) => ({ valor: i, html: `<span class="procedimiento__n">${i + 1}</span>${linea(l, idioma)}` })),
      { valor: 'ok', html: tt(TX.todo_bien) },
    ],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([correcta], valor);
      const acierto = valor === correcta;
      api.responder({
        acierto, html: textos => explicacion(item, textos), espera: 3600,
        ...(acierto ? {} : { error: item.error ?? 've-un-error-donde-no-lo-hay', respuesta: valor === 'ok' ? 'todo-bien' : `linea-${valor + 1}` }),
      });
    },
  });
  botones.elemento.lastElementChild.classList.add('eleccion--todo');
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
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciadoDonde },
    { nombre: TX.nombre.que, detalle: TX.detalle.que, introduccion: TX.introduccion.que, generar: generarQue, clave: claveItem, montar: montarQue, enunciado: enunciadoQue },
    { nombre: TX.nombre.corrige, detalle: TX.detalle.corrige, introduccion: TX.introduccion.corrige, generar: generarCorrige, clave: claveItem, montar: montarCorrige, enunciado: enunciadoCorrige },
  ],
});
