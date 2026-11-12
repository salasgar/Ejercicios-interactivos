// Práctica «Caza el error» de la unidad 5, Decimals (PU2, tarea 128): la interfaz. La lógica pura está
// en logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (decimales.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto } from '../_comun/decimales.js';
import { TX, explicacionDe, linea, nombreError, explicaDonde, explicaQue, explicaCorrige } from './textos.js';
import { campoDecimal } from './campo.js';
import {
  generarDonde, generarQue, generarCorrige, claveItem,
  corregirCorrige, resultadoBueno,
} from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;

function procedimiento(item, idioma) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${linea(l, idioma)}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

/** La explicación del ítem (vive en textos.js, para que el «No lo sé» la reutilice). */
const explicacion = explicacionDe;

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
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciadoDonde, explicacion: explicaDonde },
    { nombre: TX.nombre.que, detalle: TX.detalle.que, introduccion: TX.introduccion.que, generar: generarQue, clave: claveItem, montar: montarQue, enunciado: enunciadoQue, explicacion: explicaQue },
    { nombre: TX.nombre.corrige, detalle: TX.detalle.corrige, introduccion: TX.introduccion.corrige, generar: generarCorrige, clave: claveItem, montar: montarCorrige, enunciado: enunciadoCorrige, explicacion: explicaCorrige, noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' } },
  ],
});
