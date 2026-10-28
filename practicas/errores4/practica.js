// Práctica «Caza el error» de la unidad 4 (PU2, tarea 107): la interfaz. La lógica pura está en
// logica.js, los textos en textos.js y los nombres de los errores en `ERRORES_TIPICOS` (fracciones.js).

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero } from '../_comun/piezas.js';
import { ERRORES_TIPICOS, fraccion, aTexto } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import { campoFraccion } from './campo.js';
import {
  ex, generarBienMal, generarLinea, generarArregla, corregirArregla, claveItem,
  PLANTILLA_POR_ID, COMPARACION_POR_ID, porqueComparacion, relacionBuena,
} from './logica.js';

const REL = { '<': '&lt;', '>': '&gt;', '=': '=' };
const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);
/** La igualdad (o la comparación) en línea: `izq rel der`. */
const cuenta = (izq, rel, der) => `<span class="cuenta-frac">${ex(izq)} ${REL[rel]} ${ex(der)}</span>`;
const esComparacion = item => Boolean(COMPARACION_POR_ID[item.plantilla]);

/** Las tres líneas del cálculo; la primera tal cual y las demás con «= » delante. */
const linea = (expr, i) => `${i ? '= ' : ''}${ex(expr)}`;
function procedimiento(item, clase = 'procedimiento') {
  const filas = item.lineas.map((l, i) =>
    `<li class="procedimiento__linea"><span class="procedimiento__n">${i + 1}</span><span>${linea(l, i)}</span></li>`);
  return `<ol class="${clase}">${filas.join('')}</ol>`;
}

/** Por qué está mal, con los números del ítem (la explicación de la plantilla o la de la comparación). */
const porque = item => (esComparacion(item) ? porqueComparacion(item.plantilla, item.params) : PLANTILLA_POR_ID[item.plantilla].porque(item.params));

/** Lo que se ve tras responder en el ejercicio 1. */
function explicacionBienMal(item, { tt }) {
  if (item.verdadera) return `${tt(TX.es_verdadera)} ${cuenta(item.izq, item.rel, item.der)}`;
  const bien = esComparacion(item)
    ? `${tt(TX.verdadera_cmp)} ${cuenta(item.izq, relacionBuena(item.params), item.der)}`
    : `${tt(TX.bien_es)} ${cuenta(item.izq, '=', aTexto(PLANTILLA_POR_ID[item.plantilla].bien(item.params)))}`;
  return `${tt(TX.es_falsa)} ${cuenta(item.izq, item.rel, item.der)}<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}<br>${tt(porque(item))}<br>${bien}`;
}

const enunciadoBienMal = (item, { tt }) =>
  `<p class="instruccion">${tt(esComparacion(item) ? TX.instruccion.bienmal_cmp : TX.instruccion.bienmal)}</p><p class="igualdad">${cuenta(item.izq, item.rel, item.der)}</p>`;

function montarBienMal(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoBienMal(item, api);
  const primera = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'verdadera', html: tt(TX.verdadera) }, { valor: 'falsa', html: tt(TX.falsa) }],
    alElegir(valor) {
      if (api.respondido()) return;
      if (item.verdadera || valor === 'verdadera') {
        // Verdadera y lo es (acierto), verdadera y no lo es, o falsa cuando era verdadera.
        const acierto = item.verdadera && valor === 'verdadera';
        primera.marcar([item.verdadera ? 'verdadera' : 'falsa'], valor);
        api.responder({
          acierto, html: textos => explicacionBienMal(item, textos), espera: 3600,
          ...(acierto ? {} : { error: item.verdadera ? 've-un-error-donde-no-lo-hay' : item.error, respuesta: tt(TX[valor]) }),
        });
        return;
      }
      // Falsa y lo es: falta el nombre del error.
      primera.marcar(['falsa'], 'falsa');
      contenedor.insertAdjacentHTML('beforeend', `<p class="instruccion instruccion--siguiente">${tt(TX.instruccion.nombre)}</p>`);
      const nombres = elecciones(contenedor, {
        clase: 'elecciones nombres',
        opciones: item.opciones.map(id => ({ valor: id, html: nombreError(id, tt) })),
        alElegir(id) {
          if (api.respondido()) return;
          nombres.marcar([item.solucion], id);
          api.responder({
            acierto: id === item.solucion, html: textos => explicacionBienMal(item, textos), espera: 3600,
            error: item.error, respuesta: id,
          });
        },
      });
    },
  });
}

// ─── Ejercicio 2 ───────────────────────────────────────────────────────────────

function explicacionLinea(item, { tt }) {
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  const n = item.falsa + 1;
  return `${tt(TX.la_linea_es)(n)} <span class="linea-mala">${linea(item.lineas[item.falsa], item.falsa)}</span>`
    + `<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}`
    + `<br>${tt(plantilla.porque(item.params))}`
    + `<br>${tt(TX.bien_es)} <span class="linea-mala">${linea(plantilla.corregida(item.params), item.falsa)}</span>`;
}

const enunciadoLinea = (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion.linea)}</p>${procedimiento(item)}`;

function montarLinea(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion.linea)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: item.lineas.map((l, i) => ({ valor: i, html: `<span class="procedimiento__n">${i + 1}</span>${linea(l, i)}` })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({
        acierto: valor === item.solucion, html: textos => explicacionLinea(item, textos), espera: 3600,
        error: item.error, respuesta: `linea-${valor + 1}`,
      });
    },
  });
}

// ─── Ejercicio 3 ───────────────────────────────────────────────────────────────

function explicacionArregla(item, resultado, escrito, { tt }) {
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  const bien = aTexto(fraccion(item.bien.num, item.bien.den));
  const tuyo = escrito ? `${tt(TX.tu_resultado)} ${ex(aTexto(escrito))}. ` : '';
  const cabecera = resultado.error === 'sin-simplificar'
    ? `${tuyo}${tt(TX.es_irreducible)} ${cuenta(item.izq, '=', bien)}`
    : `${tuyo}${resultado.error === 'repite-el-error' ? `${tt(TX.repite)} ` : ''}${tt(TX.bien_es)} ${cuenta(item.izq, '=', bien)}`;
  return `${cabecera}<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}<br>${tt(plantilla.porque(item.params))}`;
}

const enunciadoArregla = (item, { tt }) =>
  `<p class="instruccion">${tt(item.natural ? TX.instruccion.arregla_nat : TX.instruccion.arregla)}</p><p class="igualdad">${cuenta(item.izq, '=', item.der)}</p>`;

function montarArregla(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(item.natural ? TX.instruccion.arregla_nat : TX.instruccion.arregla)}</p>
    <p class="igualdad">${cuenta(item.izq, '=', item.der)}</p>
    <p class="igualdad igualdad--campo"><span class="cuenta-frac">${ex(item.izq)} =</span> <span id="campo"></span></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const sitio = contenedor.querySelector('#campo');
  const actualizar = v => { boton.disabled = v === null; };
  const campo = item.natural
    ? (() => {
        const c = campoNumero(sitio, { nombre: tt(TX.nombre_resultado), cifras: 4, idioma: api.idioma, boton, alEnviar: () => comprobar() });
        return { valor: () => (c.valor() === null ? null : fraccion(c.valor(), 1)), bloquear: c.bloquear, elemento: c.elemento };
      })()
    : campoFraccion(sitio, { arriba: tt(TX.nombre_arriba), abajo: tt(TX.nombre_abajo), alCambiar: actualizar, alEnviar: () => comprobar() });
  if (!item.natural) actualizar(campo.valor());

  function comprobar() {
    const escrito = campo.valor();
    if (api.respondido() || escrito === null) return;
    const resultado = corregirArregla(item, escrito);
    campo.bloquear();
    boton.hidden = true;
    campo.elemento.classList.add(resultado.acierto ? 'respuesta--bien' : 'respuesta--mal');
    api.responder({
      acierto: resultado.acierto, html: textos => explicacionArregla(item, resultado, resultado.acierto ? null : escrito, textos), espera: 3200,
      ...(resultado.acierto ? {} : { error: resultado.error, respuesta: aTexto(escrito) }),
    });
  }
  boton.addEventListener('click', comprobar);
}

arrancar({
  slug: 'errores4',
  ejercicios: [
    { nombre: TX.nombre.bienmal, detalle: TX.detalle.bienmal, introduccion: TX.introduccion.bienmal, generar: generarBienMal, clave: claveItem, montar: montarBienMal, enunciado: enunciadoBienMal },
    { nombre: TX.nombre.linea, detalle: TX.detalle.linea, introduccion: TX.introduccion.linea, generar: generarLinea, clave: claveItem, montar: montarLinea, enunciado: enunciadoLinea },
    { nombre: TX.nombre.arregla, detalle: TX.detalle.arregla, introduccion: TX.introduccion.arregla, generar: generarArregla, clave: claveItem, montar: montarArregla, enunciado: enunciadoArregla },
  ],
});
