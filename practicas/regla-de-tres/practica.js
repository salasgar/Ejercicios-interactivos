// «Problemas de proporcionalidad directa» (PU2, tarea 214). Cuatro ejercicios de la unidad 7 (sesión 3):
//   1. ¿Cuánto cuesta 1?     dos casillas: lo que vale 1 y lo que piden        (U7-1A-01, 1A-02)
//   2. ¿Qué planteamiento?   cuatro regla-de-tres, sin el resultado            (U7-1A-04)
//   3. Resuelve y contesta   el número y su unidad; las dos direcciones         (U7-1A-05, 1C-10)
//   4. ¿Tiene sentido?       una solución dada; se elige el motivo              (U7-1C-13)
// La lógica (generadores, errores, cotas) está en `logica.js`; las frases y las explicaciones, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { mismoValor, aTexto } from '../_comun/proporcion.js';
import {
  Q, unoDe, unidadDe, txt, generarUnidad, generarPlanteamiento, generarContesta, generarSentido,
  valorDeUno, leerCampo, errorUno, errorCasilla, errorContesta, solucion, unidadBuena, MOTIVOS,
} from './logica.js';
import {
  TX, MOTIVO, enunciadoDe, enunciadoContesta, enunciadoPlanteamiento, enunciadoSentido, htmlPlanteamiento,
  explicaUnidad, feedbackUnidad, explicaPlanteamiento, feedbackPlanteamiento, explicaContesta, feedbackContesta,
  explicaSentido, nombreDeUnidad, textoSolucion,
} from './textos.js';

const campoTexto = (id, nombre) => `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" class="campo-numero" id="${id}" aria-label="${nombre}" style="--cifras:6">`;
const marca = (campo, malo) => campo.classList.toggle('campo-numero--malo', malo);

// ─── Ejercicio 1: ¿cuánto cuesta 1? ────────────────────────────────────────────

const enunciadoUnidad = (item, { idioma, tt }) => `
  <p class="instruccion instruccion--enunciado">${enunciadoDe(item, idioma)}</p>
  <p class="instruccion">${tt(TX.unidad.instruccion)}</p>`;

function montarUnidad(contenedor, item, api) {
  const { tt, idioma } = api;
  const B = unidadDe(item, 'B', idioma);
  contenedor.innerHTML = `
    ${enunciadoUnidad(item, api)}
    <div class="fila-campo"><span class="fila-campo__etiqueta">${unoDe(item, idioma)} →</span>${campoTexto('c1', tt(TX.unidad.campo1))}<span class="unidad-campo">${B}</span></div>
    <div class="fila-campo"><span class="fila-campo__etiqueta">${txt(item, 'c', idioma)} →</span>${campoTexto('c2', tt(TX.unidad.campo2))}<span class="unidad-campo">${B}</span></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const c1 = contenedor.querySelector('#c1'), c2 = contenedor.querySelector('#c2');
  const boton = contenedor.querySelector('#comprobar');
  const unidad = Q(item, 'b').unidad;
  const leer = campo => leerCampo(campo.value, idioma, unidad);
  const actualizar = () => {
    boton.disabled = leer(c1) === null || leer(c2) === null;
    for (const c of [c1, c2]) marca(c, c.value.trim() !== '' && leer(c) === null);
  };
  for (const c of [c1, c2]) {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (!boton.disabled) comprobar(); } });
  }
  boton.addEventListener('click', comprobar);

  function comprobar() {
    const v1 = leer(c1), v2 = leer(c2);
    if (api.respondido() || v1 === null || v2 === null) return;
    c1.disabled = c2.disabled = true;
    boton.hidden = true;
    const ok1 = mismoValor(v1, valorDeUno(item)), ok2 = mismoValor(v2, Q(item, 'd'));
    if (ok1 && ok2) return api.responder({ acierto: true, html: ({ idioma }) => explicaUnidad(item, idioma) });
    const paso = ok1 ? 1 : 0;
    const escrito = paso === 0 ? v1 : v2;
    const error = paso === 0 ? errorUno(item, escrito) : errorCasilla(item, escrito);
    api.responder({
      acierto: false,
      error,
      respuesta: `${v1.valor.num}/${v1.valor.den} | ${v2.valor.num}/${v2.valor.den}`,
      html: ({ idioma }) => feedbackUnidad(item, { paso, escrito: aTexto(escrito, idioma), error }, idioma),
      espera: 3200,
    });
  }
}

// ─── Ejercicio 2: ¿qué planteamiento? ──────────────────────────────────────────

const enunciadoPlan = (item, { idioma }) => {
  const e = enunciadoPlanteamiento(item, idioma);
  return `<p class="instruccion instruccion--enunciado">${e.texto}</p><p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarPlanteamiento(contenedor, item, api) {
  const { idioma } = api;
  contenedor.innerHTML = enunciadoPlan(item, api);
  const buena = item.opciones.findIndex(o => o.error === null);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((o, i) => ({ valor: i, html: htmlPlanteamiento(item, o.tipo, idioma) })),
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([buena], i);
      const elegida = item.opciones[i];
      if (elegida.error === null) return api.responder({ acierto: true, html: ({ idioma }) => explicaPlanteamiento(item, idioma) });
      api.responder({
        acierto: false,
        error: elegida.error,
        respuesta: elegida.tipo,
        html: ({ idioma }) => feedbackPlanteamiento(item, elegida.error, idioma),
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 3: resuelve y contesta ──────────────────────────────────────────

const enunciadoCon = (item, { idioma, tt }) => `
  <p class="instruccion instruccion--enunciado">${enunciadoContesta(item, idioma)}</p>
  <p class="instruccion">${tt(TX.contesta.unidad)}:</p>`;

function montarContesta(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = `
    ${enunciadoCon(item, api)}
    <div class="fila-campo">${campoTexto('valor', tt(TX.contesta.campo))}</div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('#valor');
  const boton = contenedor.querySelector('#comprobar');
  let unidad = null;
  const botones = elecciones(contenedor, {
    opciones: item.orden.map(id => ({ valor: id, html: nombreDeUnidad(item, id, idioma) })),
    clase: 'elecciones elecciones--3',
    alElegir(id) {
      if (api.respondido()) return;
      unidad = id;
      [...botones.elemento.querySelectorAll('.eleccion')].forEach((b, i) => b.classList.toggle('eleccion--marcada', item.orden[i] === id));
      actualizar();
    },
  });
  contenedor.insertBefore(botones.elemento, contenedor.querySelector('.fila-campo'));
  const leer = () => leerCampo(campo.value, idioma, null);
  function actualizar() {
    boton.disabled = leer() === null || unidad === null;
    marca(campo, campo.value.trim() !== '' && leer() === null);
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (!boton.disabled) comprobar(); } });
  boton.addEventListener('click', comprobar);

  function comprobar() {
    const v = leer();
    if (api.respondido() || v === null || unidad === null) return;
    campo.disabled = true;
    boton.hidden = true;
    const valorBien = v.valor.equals(solucion(item).valor);
    const unidadBien = unidad === unidadBuena(item);
    botones.marcar([unidadBuena(item)], unidad);
    if (valorBien && unidadBien) return api.responder({ acierto: true, html: ({ idioma }) => explicaContesta(item, idioma) });
    const error = valorBien ? 'unidad-equivocada' : errorContesta(item, v);
    api.responder({
      acierto: false,
      error,
      respuesta: `${v.valor.num}/${v.valor.den} ${unidad}`,
      html: ({ idioma }) => feedbackContesta(item, { escrito: aTexto(v, idioma), error, unidadBien, valorBien }, idioma),
      espera: 3400,
    });
  }
}

// ─── Ejercicio 4: ¿tiene sentido? ──────────────────────────────────────────────

const enunciadoSent = (item, { idioma }) => {
  const e = enunciadoSentido(item, idioma);
  return `<p class="instruccion instruccion--enunciado">${e.texto}</p><p class="dado">${e.dado}</p><p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarSentido(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoSent(item, api);
  const botones = elecciones(contenedor, {
    opciones: MOTIVOS.map(m => ({ valor: m, html: tt(MOTIVO[m]) })),
    clase: 'elecciones',
    alElegir(m) {
      if (api.respondido()) return;
      botones.marcar([item.motivo], m);
      if (m === item.motivo) return api.responder({ acierto: true, html: ({ idioma }) => explicaSentido(item, idioma) });
      api.responder({
        acierto: false,
        error: m === 'ok' ? 'da-por-buena-una-absurda' : `confunde-con-${m}`,
        respuesta: m,
        html: ({ idioma }) => explicaSentido(item, idioma),
        espera: 3600,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'regla-de-tres',
  ejercicios: [
    {
      nombre: TX.unidad.nombre,
      detalle: TX.unidad.detalle,
      introduccion: TX.unidad.introduccion,
      generar: generarUnidad,
      clave: item => `${item.ctx}:${item.a}:${item.b}:${item.c}`,
      montar: montarUnidad,
      enunciado: enunciadoUnidad,
      explicacion: (item, { idioma }) => explicaUnidad(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.plan.nombre,
      detalle: TX.plan.detalle,
      introduccion: TX.plan.introduccion,
      generar: generarPlanteamiento,
      clave: item => `${item.ctx}:${item.a}:${item.b}:${item.c}`,
      montar: montarPlanteamiento,
      enunciado: enunciadoPlan,
      explicacion: (item, { idioma }) => explicaPlanteamiento(item, idioma),
    },
    {
      nombre: TX.contesta.nombre,
      detalle: TX.contesta.detalle,
      introduccion: TX.contesta.introduccion,
      generar: generarContesta,
      clave: item => `${item.sentido}:${item.ctx}:${item.a}:${item.b}:${item.c}`,
      montar: montarContesta,
      enunciado: enunciadoCon,
      explicacion: (item, { idioma }) => explicaContesta(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.sentido.nombre,
      detalle: TX.sentido.detalle,
      introduccion: TX.sentido.introduccion,
      generar: generarSentido,
      clave: item => `${item.motivo}:${item.ctx}:${item.a}:${item.b}:${item.c}`,
      montar: montarSentido,
      enunciado: enunciadoSent,
      explicacion: (item, { idioma }) => explicaSentido(item, idioma),
    },
  ],
});
