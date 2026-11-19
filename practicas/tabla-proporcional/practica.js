// PRÁCTICA «Tablas de proporcionalidad» (unidad 7, sesión 2): ¿es proporcional?, completa la tabla, lo que vale 1
// y ¿directamente proporcionales? (PU2, tarea 213).
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (la tabla y el campo con su etiqueta).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  generarEsProporcional, claveEsProporcional, respuestaEsProporcional, errorEsProporcional,
  generarCompleta, claveCompleta, erroresDeCompleta, leerNumero, unidadHueco,
  generarConstante, claveConstante, errorDeConstante, dineroCelda,
  generarDirectas, claveDirectas, errorDeDirectas, CTX_CONSTANTE,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, CABECERAS, celdaY, datoConstante, preguntaConstante, etiquetaConstante,
  preguntaDirectas, explicaEsProporcional, explicaCompleta, explicaConstante, explicaDirectas,
} from './textos.js';

const campo = (id, nombre) =>
  `<input type="text" class="campo-numero campo-tabla" id="${id}" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

/** La tabla de dos filas. `celdas(col, n)` devuelve el HTML de la casilla x e y de cada columna. */
function tablaHtml(ctx, cols, celdaDe, { tt }) {
  const cab = CABECERAS[ctx];
  const nombre = (f) => (cab[f].es ? `<th scope="row">${tt(cab[f])}</th>` : '<th scope="row" class="sin-nombre"></th>');
  const fila = f => cols.map((col, n) => `<td>${celdaDe(f, col, n)}</td>`).join('');
  return `<div class="tabla-valores-envoltura"><table class="tabla-valores">
    <tr>${nombre('x')}${fila('x')}</tr><tr>${nombre('y')}${fila('y')}</tr></table></div>`;
}

const marcarSiNo = (contenedor, api, item, real, alElegir) => {
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: [{ valor: 'si', html: api.tt(TX.ej1.si) }, { valor: 'no', html: api.tt(TX.ej1.no) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([real ? 'si' : 'no'], valor);
      alElegir(valor === 'si');
    },
  });
};

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────────────

const tablaEj1 = (item, api) => tablaHtml(item.ctx, item.cols, (f, col) => (f === 'x' ? col.x : celdaY(item.ctx, col.y, api.idioma)), api);
const enunciado1 = (item, api) => `<p class="instruccion">${api.tt(TX.ej1.instruccion)}</p>${tablaEj1(item, api)}`;

function montar1(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  marcarSiNo(contenedor, api, item, respuestaEsProporcional(item), dijoSi => {
    const error = errorEsProporcional(item, dijoSi);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: dijoSi ? 'sí' : 'no', espera: error === null ? 2500 : 'boton',
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

const CLAVE_CABECERA = { fruta: 'fruta', entrada: 'entradas', cuaderno: 'cuadernos', receta: 'receta', coche: 'coche' };

function datosEj3(item, api) {
  if (item.forma === 'frase') return `<p class="instruccion">${datoConstante(item, api.idioma)}</p><p class="instruccion">${preguntaConstante(item, api.idioma)}</p>`;
  const ctxTabla = CLAVE_CABECERA[item.ctx], din = CTX_CONSTANTE[item.ctx].din;
  return `<p class="instruccion">${preguntaConstante(item, api.idioma)}</p>${tablaHtml(ctxTabla, item.cols,
    (f, col) => (f === 'x' ? col.x : (din ? dineroCelda(col.y, api.idioma) : col.y)), api)}`;
}
const enunciado3 = (item, api) => datosEj3(item, api);

function montar3(contenedor, item, api) {
  contenedor.innerHTML = `${datosEj3(item, api)}<p class="respuesta-linea"><input type="text" class="campo-numero campo-numero--valor" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${api.esc(api.tt({ es: 'Respuesta', en: 'Answer' }))}"> <span class="etiqueta-campo">${etiquetaConstante(item, api.idioma)}</span></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar');
  const unidad = CTX_CONSTANTE[item.ctx].unidadY;
  const valido = () => leerNumero(caja.value, unidad, api.idioma) !== null;
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
    const error = errorDeConstante(item, caja.value, api.idioma);
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

const enunciado4 = (item, api) => `<p class="instruccion">${preguntaDirectas(item, api.idioma)}</p>`;

function montar4(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  marcarSiNo(contenedor, api, item, item.si, dijoSi => {
    const error = errorDeDirectas(item, dijoSi);
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: dijoSi ? 'sí' : 'no', espera: error === null ? 2500 : 'boton',
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
  slug: 'tabla-proporcional',
  ejercicios: [
    ejercicio(TX.ej1, generarEsProporcional, claveEsProporcional, montar1, enunciado1, explicaEsProporcional, false),
    ejercicio(TX.ej2, generarCompleta, claveCompleta, montar2, enunciado2, explicaCompleta, true),
    ejercicio(TX.ej3, generarConstante, claveConstante, montar3, enunciado3, explicaConstante, true),
    ejercicio(TX.ej4, generarDirectas, claveDirectas, montar4, enunciado4, explicaDirectas, false),
  ],
});
