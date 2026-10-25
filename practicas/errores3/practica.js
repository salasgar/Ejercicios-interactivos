// Práctica «Caza el error» de la unidad 3 (PU2, tarea 89): la interfaz. La lógica pura está en
// logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (enteros.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { esc } from '../_comun/textos.js';
import { html as htmlEntero, aTexto, ERRORES_TIPICOS } from '../_comun/enteros.js';
import { TX } from './textos.js';
import { generarDonde, generarCual, generarSiNo, claveItem, PLANTILLA_POR_ID, VALIDA_POR_ID } from './logica.js';

/** Texto con números a HTML seguro, con los exponentes `2^3` como <sup>. */
const texto = t => esc(t).replace(/\^(\d+)/g, '<sup>$1</sup>');
const nombreError = (id, tt) => texto(tt(ERRORES_TIPICOS[id].nombre));
/** Una línea del cálculo: la primera tal cual y las demás con «= » delante. */
const linea = (expr, i) => `${i ? '= ' : ''}${htmlEntero(expr)}`;

function procedimiento(item) {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${linea(l, i)}</span></li>`);
  return `<ol class="procedimiento">${filas.join('')}</ol>`;
}

/** La explicación del ítem con sus números: dónde está el error, cómo se llama y cómo sería bien, o por qué no era error. */
function explicacion(item, { tt }) {
  if (item.falsa === null) return texto(tt(VALIDA_POR_ID[item.plantilla].porque(item.params)));
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  const n = item.falsa + 1;
  return `${tt(TX.la_linea_es)(n)} <span class="linea-mala">${linea(item.lineas[item.falsa], item.falsa)}</span>`
    + `<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}`
    + `<br>${texto(tt(plantilla.porque(item.params)))}`
    + `<br>${tt(TX.correcta)} <span class="linea-mala">= ${htmlEntero(plantilla.corregida(item.params))}</span>`;
}

const enunciado = clave => (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion[clave])}</p>${procedimiento(item)}`;

/** Lo que se anota del fallo: el error típico del ítem (o el que el alumno creyó ver, si era una pareja válida). */
const falloDe = (item, respuesta) => ({
  error: item.error ?? VALIDA_POR_ID[item.plantilla].parecido,
  respuesta: String(respuesta).slice(0, 80),
});

function montarDonde(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.donde)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: item.lineas.map((l, i) => ({ valor: i, html: `<span class="procedimiento__n">${i + 1}</span>${linea(l, i)}` })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3600, ...falloDe(item, aTexto(item.lineas[valor])) });
    },
  });
}

function montarCual(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.cual)}</p>${procedimiento(item)}`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map(id => ({ valor: id, html: nombreError(id, tt) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3600, ...falloDe(item, valor) });
    },
  });
}

function montarSiNo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.sino)}</p>${procedimiento(item)}`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'bien', html: tt(TX.bien) }, { valor: 'error', html: tt(TX.error) }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: textos => explicacion(item, textos), espera: 3600, ...falloDe(item, valor) });
    },
  });
}

arrancar({
  slug: 'errores3',
  ejercicios: [
    { nombre: TX.nombre.donde, detalle: TX.detalle.donde, introduccion: TX.introduccion.donde, generar: generarDonde, clave: claveItem, montar: montarDonde, enunciado: enunciado('donde') },
    { nombre: TX.nombre.cual, detalle: TX.detalle.cual, introduccion: TX.introduccion.cual, generar: generarCual, clave: claveItem, montar: montarCual, enunciado: enunciado('cual') },
    { nombre: TX.nombre.sino, detalle: TX.detalle.sino, introduccion: TX.introduccion.sino, generar: generarSiNo, clave: claveItem, montar: montarSiNo, enunciado: enunciado('sino') },
  ],
});
