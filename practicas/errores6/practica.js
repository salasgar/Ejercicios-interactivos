// Práctica «Caza el error» de la unidad 6, Algebra (PU2, tarea 154): la interfaz. La lógica pura está en
// logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (algebra.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto as fracATexto } from '../_comun/fracciones.js';
import { TX, cuenta, nombreError, explicacion, explicaDonde, explicaQue, explicaCorrige } from './textos.js';
import {
  generarDonde, generarQue, generarCorrige, claveItem, htmlLinea, resultadoBueno, corregirCorrige, leerResultado,
} from './logica.js';

const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));

function procedimiento(item, idioma) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${linea(l, idioma)}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
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
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoCorrige(item, api)}
    <p class="igualdad igualdad--campo"><span><i>x</i> =</span> <span id="campo"></span></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.inputMode = 'text';
  campo.className = 'campo-numero';
  campo.autocomplete = 'off';
  campo.spellcheck = false;
  campo.setAttribute('autocorrect', 'off');
  campo.setAttribute('enterkeyhint', 'done');
  campo.style.setProperty('--cifras', 7);
  campo.setAttribute('aria-label', tt(TX.nombre_resultado));
  contenedor.querySelector('#campo').append(campo);

  const valor = () => leerResultado(campo.value);
  const actualizar = () => {
    const v = valor(), malo = v === null && campo.value.trim() !== '';
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
    boton.disabled = v === null;
  };
  function comprobar() {
    const escrito = valor();
    if (api.respondido() || escrito === null) return;
    const resultado = corregirCorrige(item, escrito);
    campo.disabled = true;
    boton.hidden = true;
    campo.classList.add(resultado.acierto ? 'respuesta--bien' : 'respuesta--mal');
    api.responder({
      acierto: resultado.acierto, espera: 3600,
      html: textos => `${resultado.acierto ? '' : `${textos.tt(TX.resultado_bien)} ${cuenta(`<i>x</i> = ${fracATexto(resultadoBueno(item))}`)}<br>`}${explicacion(item, textos, { escrito: resultado.acierto ? null : escrito, resultado })}`,
      ...(resultado.acierto ? {} : { error: resultado.error === 'repite-el-error' ? item.error : resultado.error, respuesta: fracATexto(escrito) }),
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

arrancar({
  slug: 'errores6',
  ejercicios: [
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciadoDonde, explicacion: explicaDonde },
    { nombre: TX.nombre.que, detalle: TX.detalle.que, introduccion: TX.introduccion.que, generar: generarQue, clave: claveItem, montar: montarQue, enunciado: enunciadoQue, explicacion: explicaQue },
    { nombre: TX.nombre.corrige, detalle: TX.detalle.corrige, introduccion: TX.introduccion.corrige, generar: generarCorrige, clave: claveItem, montar: montarCorrige, enunciado: enunciadoCorrige, explicacion: explicaCorrige, noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' } },
  ],
});
