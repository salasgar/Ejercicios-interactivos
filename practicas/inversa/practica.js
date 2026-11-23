// PRÁCTICA «Proporcionalidad inversa» (unidad 7, sesiones 5 y 6): ¿es inversa?, completa la tabla, problemas y
// caza el error (PU2, tarea 215). Ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  generarEsInversa, claveEsInversa, respuestaEsInversa, errorEsInversa,
  generarCompleta, claveCompleta, erroresDeCompleta, leerNumero, unidadHueco,
  generarProblema, claveProblema, errorDeProblema, unidadY,
  generarCaza, claveCaza, errorCaza, verdadCaza as verdad,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, CABECERAS, celdaY, etiquetaProblema, datoProblemaTx, preguntaProblema,
  enunciadoCaza, resolucionCaza, explicaEsInversa, explicaCompleta, explicaProblema, explicaCaza,
} from './textos.js';

const campo = (id, nombre) =>
  `<input type="text" class="campo-numero campo-tabla" id="${id}" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

function tablaHtml(ctx, cols, celdaDe, { tt }) {
  const cab = CABECERAS[ctx];
  const nombre = f => (cab[f].es ? `<th scope="row">${tt(cab[f])}</th>` : '<th scope="row" class="sin-nombre"></th>');
  const fila = f => cols.map((col, n) => `<td>${celdaDe(f, col, n)}</td>`).join('');
  return `<div class="tabla-valores-envoltura"><table class="tabla-valores">
    <tr>${nombre('x')}${fila('x')}</tr><tr>${nombre('y')}${fila('y')}</tr></table></div>`;
}

/** Un conjunto de opciones; `real` es el valor verdadero. */
function marcar(contenedor, api, opciones, real, alElegir) {
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: opciones.map(([valor, texto]) => ({ valor, html: api.tt(texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([real], valor);
      alElegir(valor);
    },
  });
}

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, api) => `<p class="instruccion">${api.tt(TX.ej1.instruccion)}</p>${tablaHtml('num', item.cols, (f, col) => col[f], api)}`;

function montar1(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  marcar(contenedor, api, [['si', TX.ej1.si], ['no', TX.ej1.no]], respuestaEsInversa(item) ? 'si' : 'no', valor => {
    const error = errorEsInversa(item, valor === 'si');
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: valor === 'si' ? 'sí' : 'no', espera: error === null ? 2500 : 'boton',
      html: ({ tt }) => tt(TX.ej1.solucion)(item),
    });
  });
}

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────────────

function tablaEj2(item, api, campos) {
  const huecoDe = (f, n) => item.huecos.findIndex(h => h.col === n && h.que === f);
  return tablaHtml(item.ctx, item.cols, (f, col, n) => {
    const k = huecoDe(f, n);
    if (k < 0) return f === 'x' ? col.x : celdaY(item.ctx, col.y, api.idioma);
    return campos ? campo(`h${k}`, api.esc(api.tt({ es: `Casilla ${k + 1}`, en: `Box ${k + 1}` }))) : '<span class="hueco-fd">?</span>';
  }, api);
}
const enunciado2 = (item, api) => `<p class="instruccion">${api.tt(TX.ej2.instruccion)}</p>${tablaEj2(item, api, false)}`;

function montar2(contenedor, item, api) {
  contenedor.innerHTML = `<p class="instruccion">${api.tt(TX.ej2.instruccion)}</p>${tablaEj2(item, api, true)}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const cajas = item.huecos.map((_, k) => contenedor.querySelector(`#h${k}`)), boton = contenedor.querySelector('#comprobar');
  const valida = c => leerNumero(c.value, unidadHueco(item, item.huecos[cajas.indexOf(c)]), api.idioma) !== null;
  const actualizar = () => {
    cajas.forEach(c => {
      const malo = c.value.trim() !== '' && !valida(c);
      c.classList.toggle('campo-numero--malo', malo);
      c.setAttribute('aria-invalid', String(malo));
    });
    boton.disabled = cajas.some(c => !valida(c)) || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || cajas.some(c => !valida(c))) return;
    cajas.forEach(c => { c.disabled = true; });
    boton.hidden = true;
    const errores = erroresDeCompleta(item, cajas.map(c => c.value), api.idioma);
    cajas.forEach((c, k) => c.classList.add(errores[k] === null ? 'campo-tabla--bien' : 'campo-tabla--mal'));
    const malo = errores.find(e => e !== null);
    api.responder({
      acierto: malo === undefined, error: malo ?? undefined, respuesta: cajas.map(c => c.value.trim()).join(' ; '),
      espera: malo === undefined ? 2500 : 'boton', html: ({ tt }) => tt(TX.ej2.solucion)(item),
    });
  };
  cajas.forEach(c => {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  });
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────────────

const enunciado3 = (item, api) => `<p class="instruccion">${datoProblemaTx(item, api.idioma)}</p><p class="instruccion">${preguntaProblema(item, api.idioma)}</p>`;

function montar3(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado3(item, api)}<p class="respuesta-linea"><input type="text" class="campo-numero campo-numero--valor" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(api.tt({ es: 'Respuesta', en: 'Answer' }))}"> <span class="etiqueta-campo">${etiquetaProblema(item, api.idioma)}</span></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar');
  const valido = () => leerNumero(caja.value, unidadY(item.ctx), api.idioma) !== null;
  const actualizar = () => {
    const malo = caja.value.trim() !== '' && !valido();
    caja.classList.toggle('campo-numero--malo', malo);
    caja.setAttribute('aria-invalid', String(malo));
    boton.disabled = !valido() || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || !valido()) return;
    caja.disabled = true;
    boton.hidden = true;
    const error = errorDeProblema(item, caja.value, api.idioma);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: caja.value.trim(), espera: error === null ? 2500 : 'boton',
      html: ({ tt }) => tt(TX.ej3.solucion)(item),
    });
  };
  caja.addEventListener('input', actualizar);
  caja.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────────────

const enunciado4 = (item, api) => `<p class="instruccion">${enunciadoCaza(item, api.idioma)}</p>${resolucionCaza(item, api.idioma)}<p class="instruccion">${api.tt(TX.ej4.pregunta)}</p>`;

function montar4(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const o = TX.ej4.opciones;
  marcar(contenedor, api, [['bien', o.bien], ['mal-directa', o['mal-directa']], ['mal-inversa', o['mal-inversa']]], verdad(item), valor => {
    const error = errorCaza(item, valor);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: valor, espera: error === null ? 2500 : 'boton',
      html: ({ tt }) => tt(TX.ej4.solucion)(item),
    });
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, clave, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar: rng => generar(rng), clave, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'inversa',
  ejercicios: [
    ejercicio(TX.ej1, generarEsInversa, claveEsInversa, montar1, enunciado1, explicaEsInversa, false),
    ejercicio(TX.ej2, generarCompleta, claveCompleta, montar2, enunciado2, explicaCompleta, true),
    ejercicio(TX.ej3, generarProblema, claveProblema, montar3, enunciado3, explicaProblema, true),
    ejercicio(TX.ej4, generarCaza, claveCaza, montar4, enunciado4, explicaCaza, false),
  ],
});
