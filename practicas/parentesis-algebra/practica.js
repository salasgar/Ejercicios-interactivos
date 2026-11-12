// Práctica «Paréntesis» de la unidad 6 (Algebra, semana 3): quitar paréntesis, elegir el desarrollo,
// resolver ecuaciones con paréntesis y cazar el error. Contrato de la base en `../_comun/base.js`; la
// lógica (ítems, distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarQuita, generarDesarrollo, generarResuelve, generarErrores, corregirQuita, corregirResuelve, claveItem,
  explicaError, OPCIONES_ERROR,
} from './logica.js';

import { explicaQuita, explicaDesarrollo, explicaResuelve, explicaErrores } from './ayuda.js';

const cuenta = h => `<span class="cuenta">${h}</span>`;

const enunciadoQuita = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.quita)}</p>
    <p class="frase">${cuenta(item.htmlOrigen)}</p>`;

const enunciadoDesarrollo = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.desarrollo)}</p>
    <p class="frase">${cuenta(item.htmlOrigen)}</p>`;

const enunciadoResuelve = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.resuelve)}</p>
    <p class="frase">${cuenta(item.htmlOrigen)}</p>`;

const enunciadoErrores = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.errores)}</p>
    <p class="frase">${cuenta(`${item.htmlOrigen} → ${item.htmlResultado}`)}</p>`;

function montarElegir(contenedor, item, api, enunciado, opciones, clase, alElegir) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase,
    opciones,
    alElegir(valor) {
      if (api.respondido()) return;
      const r = alElegir(valor);
      botones.marcar(r.correctas, valor);
      api.responder({ ...r.respuesta, espera: 2400 });
    },
  });
}

function montarDesarrollo(contenedor, item, api) {
  const opciones = item.opciones.map(o => ({ valor: o.valor, html: cuenta(o.html) }));
  montarElegir(contenedor, item, api, enunciadoDesarrollo, opciones, 'elecciones elecciones--1', valor => {
    const o = item.opciones.find(x => x.valor === valor);
    return {
      correctas: item.opciones.filter(x => x.correcta).map(x => x.valor),
      respuesta: {
        acierto: o.correcta, error: o.correcta ? undefined : o.error, respuesta: o.valor,
        html: ({ tt, idioma }) => (o.correcta ? '' : `${explicaError(o.error, idioma)}. `) + tt(item.solucion),
      },
    };
  });
}

function montarErrores(contenedor, item, api) {
  const ids = ['ninguno', ...OPCIONES_ERROR];
  const opciones = ids.map(id => ({ valor: id, html: api.esc(api.tt(TX.errores[id])) }));
  montarElegir(contenedor, item, api, enunciadoErrores, opciones, 'elecciones elecciones--1', valor => {
    const acierto = valor === item.correcta;
    const aviso = acierto ? null : item.error === null ? TX.errores.noHayError : valor === 'ninguno' ? TX.errores.haError : TX.errores.otroError;
    return {
      correctas: [item.correcta],
      respuesta: {
        acierto, error: acierto ? undefined : `elegido-${valor}`, respuesta: valor,
        html: ({ tt }) => (aviso ? `${tt(aviso)} ` : '') + tt(item.solucion),
      },
    };
  });
}

/** Un campo de texto con «Comprobar»: `corregir(item, texto)` devuelve { valida, mensaje } o { valida, acierto, error }. */
function montarCampo(contenedor, item, api, { enunciado, corregir, etiqueta, placeholder, solucion }) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    ${enunciado(item, api)}
    <input type="text" class="campo-expresion" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(tt(etiqueta))}" placeholder="${placeholder}">
    <p class="aviso-campo" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('.campo-expresion');
  const aviso = contenedor.querySelector('.aviso-campo');
  const boton = contenedor.querySelector('#comprobar');

  const estado = () => {
    const v = campo.value.trim();
    if (v === '') return { listo: false };
    const r = corregir(item, v);
    return r.valida ? { listo: true } : { listo: false, mensaje: r.mensaje };
  };
  const actualizar = () => {
    const e = estado();
    aviso.textContent = e.mensaje ? tt(e.mensaje) : '';
    campo.classList.toggle('campo-expresion--malo', Boolean(e.mensaje));
    campo.setAttribute('aria-invalid', String(Boolean(e.mensaje)));
    boton.disabled = !e.listo;
  };
  function comprobar() {
    if (api.respondido() || !estado().listo) return;
    const r = corregir(item, campo.value);
    campo.disabled = true;
    boton.hidden = true;
    campo.classList.add(r.acierto ? 'campo-expresion--bien' : 'campo-expresion--mal');
    api.responder({
      acierto: r.acierto,
      error: r.acierto ? undefined : r.error,
      respuesta: campo.value.trim(),
      espera: 2400,
      html: ({ tt: t, idioma }) => `${r.acierto || r.error === 'otra-expresion' || r.error === 'otra-solucion' ? '' : `${explicaError(r.error, idioma)}. `}${t(solucion(item))}`,
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

const montarQuita = (contenedor, item, api) => montarCampo(contenedor, item, api, {
  enunciado: enunciadoQuita, corregir: corregirQuita, etiqueta: TX.campos.expresion, placeholder: TX.campos.placeholderExpresion, solucion: it => it.solucion,
});
const montarResuelve = (contenedor, item, api) => montarCampo(contenedor, item, api, {
  enunciado: enunciadoResuelve, corregir: corregirResuelve, etiqueta: TX.campos.solucion, placeholder: TX.campos.placeholderSolucion, solucion: it => it.explicacion,
});

const NO_SE = { es: 'No sé hacerlo', en: 'I don’t know how' };
const ejercicio = (i, { generar, montar, enunciado, explicacion, noLoSe }) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave: claveItem, montar, enunciado, explicacion,
  ...(noLoSe ? { noLoSe: NO_SE } : {}),
});

arrancar({
  slug: 'parentesis-algebra',
  ejercicios: [
    ejercicio(0, { generar: generarQuita, montar: montarQuita, enunciado: enunciadoQuita, explicacion: explicaQuita, noLoSe: true }),
    ejercicio(1, { generar: generarDesarrollo, montar: montarDesarrollo, enunciado: enunciadoDesarrollo, explicacion: explicaDesarrollo }),
    ejercicio(2, { generar: generarResuelve, montar: montarResuelve, enunciado: enunciadoResuelve, explicacion: explicaResuelve, noLoSe: true }),
    ejercicio(3, { generar: generarErrores, montar: montarErrores, enunciado: enunciadoErrores, explicacion: explicaErrores }),
  ],
});
