// Práctica «Problemas con ecuaciones» de la unidad 6 (Algebra, semana 4): elegir la incógnita, elegir la ecuación,
// resolver y contestar, saber qué pide el problema y comprobar que la solución tiene sentido. Contrato de la base en
// `../_comun/base.js`; la lógica (problemas, distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarIncognita, generarEcuacion, generarResuelve, generarPide, generarSentido, corregirResuelve,
  solucionIncognita, porQueDato, solucionEcuacion, porQueEcuacion, feedbackResuelve, solucionPide, solucionPideCorta, porQuePide,
  solucionSentido, errorDeSentido, OPCIONES_SENTIDO, claveItem, fmtVal, explicaError,
} from './logica.js';

const cuenta = h => `<span class="cuenta">${h}</span>`;
const htmlEc = t => cuenta(t.replace(/x/g, '<i>x</i>'));
const problema = (item, tt) => `<p class="problema">${tt(item.enun)}</p>`;

// ─── Enunciados (también los usa la base para enseñar la traducción) ───────────────────────────

const enunciadoIncognita = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.incognita)}</p>${problema(item, tt)}`;
const enunciadoEcuacion = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.ecuacion)}</p>${problema(item, tt)}<p class="pregunta">${tt(item.pregunta)}</p>`;
const enunciadoResuelve = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones.resuelve)}</p>${problema(item, tt)}<p class="pregunta">${tt(item.pregunta)}</p>`;
const enunciadoPide = (item, { tt, idioma }) => `
    <p class="instruccion">${tt(TX.instrucciones.pide)}</p>${problema(item, tt)}
    <p class="trabajo">${tt(TX.etiquetas.ecuacion)}: ${htmlEc(item.eqTxt[idioma])}<br>${tt(TX.etiquetas.resuelto)}: ${cuenta(`<i>x</i> = ${fmtVal({ dinero: item.dinero }, item.x, idioma)}`)} (${tt(item.xDef)})</p>
    <p class="pregunta">${tt(item.pregunta)}</p>`;
const enunciadoSentido = (item, { tt, idioma }) => `
    <p class="instruccion">${tt(TX.instrucciones.sentido)}</p>${problema(item, tt)}
    <div class="trabajo">
      <p>${tt(TX.etiquetas.ecuacion)}: ${htmlEc(item.ecuacion[idioma])}</p>
      ${item.linea ? `<p>${tt(TX.etiquetas.linea)}: ${htmlEc(item.linea[idioma])}</p>` : ''}
      <p>${tt(TX.etiquetas.solucion)}: ${cuenta(`<i>x</i> = ${item.solucionTxt[idioma]}`)} (${tt(item.xDef)})</p>
    </div>`;

// ─── Montaje de los ejercicios de elegir ───────────────────────────────────────────────────────

function montarElegir(contenedor, item, api, enunciado, opciones, clase, alElegir) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase,
    opciones,
    alElegir(valor) {
      if (api.respondido()) return;
      const r = alElegir(valor);
      botones.marcar(r.correctas, valor);
      api.responder({ ...r.respuesta, espera: 2800 });
    },
  });
}

function montarIncognita(contenedor, item, api) {
  const opciones = item.opciones.map(o => ({ valor: o.valor, html: `<i>x</i> = ${api.esc(api.tt(o.texto))}` }));
  montarElegir(contenedor, item, api, enunciadoIncognita, opciones, 'elecciones elecciones--1', valor => {
    const o = item.opciones.find(x => x.valor === valor);
    return {
      correctas: item.opciones.filter(x => x.correcta).map(x => x.valor),
      respuesta: {
        acierto: o.correcta, error: o.error ?? undefined, respuesta: o.texto.es,
        html: ({ tt, idioma }) => (o.correcta ? '' : `${porQueDato(o, idioma)} `) + solucionIncognita(item)[idioma],
      },
    };
  });
}

function montarEcuacion(contenedor, item, api) {
  const opciones = item.opciones.map(o => ({ valor: o.valor, html: htmlEc(o.txt[api.idioma]) }));
  montarElegir(contenedor, item, api, enunciadoEcuacion, opciones, 'elecciones elecciones--1', valor => {
    const o = item.opciones.find(x => x.valor === valor);
    return {
      correctas: item.opciones.filter(x => x.correcta).map(x => x.valor),
      respuesta: {
        acierto: o.correcta, error: o.error ?? undefined, respuesta: o.txt.es,
        html: ({ idioma }) => (o.correcta ? '' : `${porQueEcuacion(item, o, idioma)} `) + solucionEcuacion(item)[idioma],
      },
    };
  });
}

function montarPide(contenedor, item, api) {
  const opciones = item.opciones.map(o => ({ valor: String(o.valor), html: cuenta(fmtVal({ dinero: item.dinero }, o.valor, api.idioma)) }));
  montarElegir(contenedor, item, api, enunciadoPide, opciones, 'elecciones', valor => {
    const o = item.opciones.find(x => String(x.valor) === valor);
    return {
      correctas: item.opciones.filter(x => x.correcta).map(x => String(x.valor)),
      respuesta: {
        acierto: o.correcta, error: o.error ?? undefined, respuesta: fmtVal({ dinero: item.dinero }, o.valor, 'es'),
        html: ({ idioma }) => o.correcta ? solucionPide(item, idioma) : `${porQuePide(item, o, idioma)} ${solucionPideCorta(item, idioma)}`,
      },
    };
  });
}

function montarSentido(contenedor, item, api) {
  const opciones = OPCIONES_SENTIDO.map(id => ({ valor: id, html: api.esc(api.tt(TX.sentido[id])) }));
  montarElegir(contenedor, item, api, enunciadoSentido, opciones, 'elecciones elecciones--1', valor => {
    const acierto = valor === item.correcta;
    return {
      correctas: [item.correcta],
      respuesta: {
        acierto, error: acierto ? undefined : errorDeSentido(item, valor), respuesta: valor,
        html: ({ idioma }) => (acierto ? '' : `${explicaError(errorDeSentido(item, valor), idioma)}. `) + solucionSentido(item, idioma),
      },
    };
  });
}

// ─── Resuelve y contesta: un campo con el número ───────────────────────────────────────────────

function montarResuelve(contenedor, item, api) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    ${enunciadoResuelve(item, api)}
    <input type="text" class="campo-expresion" inputmode="${item.dinero ? 'decimal' : 'numeric'}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(tt(TX.etiquetas.campo))}" placeholder="${esc(tt(TX.etiquetas.placeholder))}">
    <p class="aviso-campo" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('.campo-expresion');
  const aviso = contenedor.querySelector('.aviso-campo');
  const boton = contenedor.querySelector('#comprobar');

  const estado = () => {
    const v = campo.value.trim();
    if (v === '') return { listo: false };
    const r = corregirResuelve(item, v);
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
    const r = corregirResuelve(item, campo.value);
    campo.disabled = true;
    boton.hidden = true;
    campo.classList.add(r.acierto ? 'campo-expresion--bien' : 'campo-expresion--mal');
    api.responder({
      acierto: r.acierto,
      error: r.acierto ? undefined : r.error,
      respuesta: campo.value.trim(),
      espera: 4000,
      html: ({ idioma }) => feedbackResuelve(item, idioma, r),
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

const ejercicio = (i, { generar, montar, enunciado }) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave: claveItem, montar, enunciado,
});

arrancar({
  slug: 'problemas-ecuaciones',
  ejercicios: [
    ejercicio(0, { generar: generarIncognita, montar: montarIncognita, enunciado: enunciadoIncognita }),
    ejercicio(1, { generar: generarEcuacion, montar: montarEcuacion, enunciado: enunciadoEcuacion }),
    ejercicio(2, { generar: generarResuelve, montar: montarResuelve, enunciado: enunciadoResuelve }),
    ejercicio(3, { generar: generarPide, montar: montarPide, enunciado: enunciadoPide }),
    ejercicio(4, { generar: generarSentido, montar: montarSentido, enunciado: enunciadoSentido }),
  ],
});
