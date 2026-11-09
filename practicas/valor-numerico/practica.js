// PRÁCTICA «Valor numérico» (unidad 6, semana 1, sesión 2): sustituir la letra por un número y calcular.
// Tres ejercicios: sustituye y calcula, la tabla de valores y «¿qué expresión vale N?».
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (la tabla y la expresión destacada).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { deTexto } from '../_comun/algebra.js';
import { TX, xIgual } from './textos.js';
import {
  F, numTexto, htmlDe, claveDe, generarSustituye, generarTabla, generarQueValor, errorDeSustituye, erroresDeTabla,
} from './logica.js';

/** Lo que escribe el alumno como número (2,5; 5/2; −3), o null. */
const leer = texto => { const l = deTexto(texto); return l && l.esConstante() ? l.b : null; };

const campo = (id, nombre, extra = '') =>
  `<input type="text" class="campo-numero ${extra}" id="${id}" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej1.instruccion[item.tipo])}</p>
  <p class="expresion-destacada">${htmlDe(item.e)} <span class="con-x">${idioma === 'es' ? 'con' : 'when'} ${xIgual(item.v, idioma)}</span></p>`;

function htmlTabla(item, api, { campos }) {
  const { tt, idioma } = api;
  const cab = item.xs.map(x => `<th scope="col">${x < 0 ? '−' : ''}${Math.abs(x)}</th>`).join('');
  const fila = item.xs.map((x, col) => {
    const k = item.huecos.indexOf(col);
    if (k < 0) return `<td>${numTexto(item.valores[col], idioma)}</td>`;
    return `<td>${campos ? campo(`h${k}`, api.esc(tt(TX.campos.valorDe)({ num: x, den: 1 })), 'campo-tabla') : '<span class="hueco-fd">?</span>'}</td>`;
  }).join('');
  return `<div class="tabla-valores-envoltura"><table class="tabla-valores">
    <tr><th scope="row"><i>x</i></th>${cab}</tr>
    <tr><th scope="row">${htmlDe(item.e)}</th>${fila}</tr></table></div>`;
}

const enunciado2 = (item, api) => `<p class="instruccion">${api.tt(TX.ej2.instruccion)}</p>${htmlTabla(item, api, { campos: false })}`;

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)(item)}</p>`;

// ─── Montaje ─────────────────────────────────────────────────────────────────────────────────

function montarEscribir(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado1(item, api)}${campo('campo', api.esc(tt(TX.campos.resultado)), 'campo-numero--valor')}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar');
  const actualizar = () => {
    const malo = caja.value.trim() !== '' && leer(caja.value) === null;
    caja.classList.toggle('campo-numero--malo', malo);
    caja.setAttribute('aria-invalid', String(malo));
    boton.disabled = leer(caja.value) === null || api.respondido();
  };
  const comprobar = () => {
    const valor = leer(caja.value);
    if (api.respondido() || valor === null) return;
    caja.disabled = true;
    boton.hidden = true;
    const error = errorDeSustituye(item, valor);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: caja.value.trim(), espera: 2800,
      html: ({ tt }) => (error === null ? tt(TX.ej1.correcto)(item) : tt(TX.ej1.por_que[error])(item, valor) + tt(TX.ej1.solucion)(item)),
    });
  };
  caja.addEventListener('input', actualizar);
  caja.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

function montarElegir(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: numTexto(o.r, api.idioma) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const o = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null), valor);
      api.responder({
        acierto: o.correcta, error: o.error ?? undefined, respuesta: numTexto(o.r, 'es'), espera: 2800,
        html: ({ tt }) => (o.correcta ? tt(TX.ej1.correcto)(item) : tt(TX.ej1.por_que[o.error])(item, F(o.r)) + tt(TX.ej1.solucion)(item)),
      });
    },
  });
}

const montar1 = (contenedor, item, api) => (item.tipo === 'elegir' ? montarElegir(contenedor, item, api) : montarEscribir(contenedor, item, api));

function montar2(contenedor, item, api) {
  contenedor.innerHTML = `<p class="instruccion">${api.tt(TX.ej2.instruccion)}</p>${htmlTabla(item, api, { campos: true })}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const cajas = item.huecos.map((_, k) => contenedor.querySelector(`#h${k}`)), boton = contenedor.querySelector('#comprobar');
  const valores = () => cajas.map(c => leer(c.value));
  const actualizar = () => {
    cajas.forEach(c => {
      const malo = c.value.trim() !== '' && leer(c.value) === null;
      c.classList.toggle('campo-numero--malo', malo);
      c.setAttribute('aria-invalid', String(malo));
    });
    boton.disabled = valores().some(v => v === null) || api.respondido();
  };
  const comprobar = () => {
    const vs = valores();
    if (api.respondido() || vs.some(v => v === null)) return;
    cajas.forEach(c => { c.disabled = true; });
    boton.hidden = true;
    const errores = erroresDeTabla(item, vs);
    cajas.forEach((c, k) => c.classList.add(errores[k] === null ? 'campo-tabla--bien' : 'campo-tabla--mal'));
    const k = errores.findIndex(e => e !== null);
    const error = k < 0 ? null : errores[k];
    const sub = k < 0 ? null : { e: item.e, v: { num: item.xs[item.huecos[k]], den: 1 } };
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: cajas.map(c => c.value.trim()).join(' ; '), espera: 3200,
      html: ({ tt }) => (error === null ? tt(TX.ej2.correcto)(item) : tt(TX.ej2.por_que[error])(sub, vs[k]) + tt(TX.ej2.solucion)(item)),
    });
  };
  cajas.forEach(c => {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  });
  boton.addEventListener('click', comprobar);
  actualizar();
}

function montar3(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado3(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: htmlDe(o.e) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const o = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null), valor);
      api.responder({
        acierto: o.correcta, error: o.error ?? undefined, respuesta: o.e.forma === 'parentesis' ? `${o.e.k}(x${o.e.c < 0 ? '−' : '+'}${Math.abs(o.e.c)})` : `${o.e.a}x${o.e.b < 0 ? '−' : '+'}${Math.abs(o.e.b)}`, espera: 3000,
        html: ({ tt }) => (o.correcta ? tt(TX.ej3.correcto)(item) : tt(TX.ej3.por_que)(item, o) + tt(TX.ej3.solucion)(item)),
      });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
});

arrancar({
  slug: 'valor-numerico',
  ejercicios: [
    ejercicio(TX.ej1, generarSustituye, montar1, enunciado1),
    ejercicio(TX.ej2, generarTabla, montar2, enunciado2),
    ejercicio(TX.ej3, generarQueValor, montar3, enunciado3),
  ],
});
