// Práctica «Quita denominadores» de la unidad 6 (Algebra, semana 3): elegir el m.c.m., elegir la ecuación sin
// denominadores, resolver y hacerlo paso a paso. Contrato de la base en `../_comun/base.js`; la lógica (ítems,
// distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarMcm, generarSin, generarResuelve, generarPasos, corregirResuelve, corregirPasos, claveItem, explicaSiHace,
} from './logica.js';

import { explicaMcm, explicaSin, explicaResuelve, explicaPasos } from './ayuda.js';

const cuenta = h => `<span class="cuenta">${h}</span>`;
const frase = (item, { tt }, instruccion) => `
    <p class="instruccion">${tt(instruccion)}</p>
    <p class="frase">${cuenta(item.htmlOrigen)}</p>`;

const enunciadoMcm = (item, api) => frase(item, api, TX.instrucciones.mcm);
const enunciadoSin = (item, api) => frase(item, api, TX.instrucciones.sin);
const enunciadoResuelve = (item, api) => frase(item, api, TX.instrucciones.resuelve);
const enunciadoPasos = (item, api) => frase(item, api, TX.instrucciones.pasos);

function montarElegir(contenedor, item, api, enunciado, opciones) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase: 'elecciones elecciones--1',
    opciones,
    alElegir(valor) {
      if (api.respondido()) return;
      const o = item.opciones.find(x => x.valor === valor);
      botones.marcar(item.opciones.filter(x => x.correcta).map(x => x.valor), valor);
      api.responder({
        acierto: o.correcta, error: o.correcta ? undefined : o.error, respuesta: o.valor, espera: 2400,
        html: ({ tt, idioma }) => (o.correcta ? '' : explicaSiHace(o.error, idioma)) + tt(item.solucion),
      });
    },
  });
}

const montarMcm = (contenedor, item, api) => montarElegir(contenedor, item, api, enunciadoMcm,
  item.opciones.map(o => ({ valor: o.valor, html: cuenta(o.valor) })));
const montarSin = (contenedor, item, api) => montarElegir(contenedor, item, api, enunciadoSin,
  item.opciones.map(o => ({ valor: o.valor, html: cuenta(o.html) })));

const CAMPO = (id, etiqueta, placeholder, esc, tt) => `
    <div class="paso-campo">
      <label class="paso-etiqueta" for="${id}">${esc(tt(etiqueta))}</label>
      <input type="text" id="${id}" class="campo-expresion" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${placeholder}">
      <p class="aviso-campo" aria-live="polite"></p>
    </div>`;

/** Uno o varios campos de texto con un solo «Comprobar»: `corregir(item, [textos])` → { valida, pasos, acierto, error }. */
function montarCampos(contenedor, item, api, { enunciado, campos, corregir, solucion }) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    ${enunciado(item, api)}
    ${campos.map((c, i) => CAMPO(`campo-${i}`, c.etiqueta, c.placeholder, esc, tt)).join('')}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const inputs = [...contenedor.querySelectorAll('.campo-expresion')];
  const avisos = [...contenedor.querySelectorAll('.aviso-campo')];
  const boton = contenedor.querySelector('#comprobar');

  const textos = () => inputs.map(i => i.value.trim());
  const estado = () => {
    const ts = textos();
    if (ts.some(t => t === '')) return { listo: false, mensajes: ts.map(() => null) };
    const r = corregir(item, ts);
    return { listo: r.valida, mensajes: r.pasos.map(p => (p.valida ? null : p.mensaje)) };
  };
  const actualizar = () => {
    const ts = textos();
    const e = estado();
    e.mensajes.forEach((m, i) => {
      const hay = Boolean(m) && ts[i] !== '';
      avisos[i].textContent = hay ? tt(m) : '';
      inputs[i].classList.toggle('campo-expresion--malo', hay);
      inputs[i].setAttribute('aria-invalid', String(hay));
    });
    boton.disabled = !e.listo;
  };
  function comprobar() {
    if (api.respondido() || !estado().listo) return;
    const ts = textos();
    const r = corregir(item, ts);
    inputs.forEach((inp, i) => {
      inp.disabled = true;
      inp.classList.add(r.pasos[i].acierto ? 'campo-expresion--bien' : 'campo-expresion--mal');
    });
    boton.hidden = true;
    api.responder({
      acierto: r.acierto,
      error: r.acierto ? undefined : r.error,
      respuesta: ts.join(' | '),
      espera: 2400,
      html: ({ tt: t, idioma }) => `${r.acierto ? '' : explicaSiHace(r.error, idioma)}${t(solucion(item))}`,
    });
  }
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', actualizar);
    inp.addEventListener('keydown', ev => {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      if (i < inputs.length - 1) inputs[i + 1].focus(); else comprobar();
    });
  });
  boton.addEventListener('click', comprobar);
  actualizar();
}

const montarResuelve = (contenedor, item, api) => montarCampos(contenedor, item, api, {
  enunciado: enunciadoResuelve,
  campos: [{ etiqueta: TX.campos.solucion, placeholder: TX.campos.placeholderSolucion }],
  corregir: (it, [t]) => { const r = corregirResuelve(it, t); return { valida: r.valida, pasos: [r], acierto: r.acierto, error: r.error }; },
  solucion: it => it.explicacion,
});

const montarPasos = (contenedor, item, api) => montarCampos(contenedor, item, api, {
  enunciado: enunciadoPasos,
  campos: [
    { etiqueta: TX.campos.mcm, placeholder: TX.campos.placeholderMcm },
    { etiqueta: TX.campos.cerrada, placeholder: TX.campos.placeholderCerrada },
    { etiqueta: TX.campos.final, placeholder: TX.campos.placeholderFinal },
  ],
  corregir: corregirPasos,
  solucion: it => it.explicacion,
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
  slug: 'denominadores',
  ejercicios: [
    ejercicio(0, { generar: generarMcm, montar: montarMcm, enunciado: enunciadoMcm, explicacion: explicaMcm }),
    ejercicio(1, { generar: generarSin, montar: montarSin, enunciado: enunciadoSin, explicacion: explicaSin }),
    ejercicio(2, { generar: generarResuelve, montar: montarResuelve, enunciado: enunciadoResuelve, explicacion: explicaResuelve, noLoSe: true }),
    ejercicio(3, { generar: generarPasos, montar: montarPasos, enunciado: enunciadoPasos, explicacion: explicaPasos, noLoSe: true }),
  ],
});
