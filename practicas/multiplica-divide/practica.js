// Práctica «Multiplica y divide» (unidad 4, tarea 105): la interfaz (los `montar`) y la llamada a
// `arrancar`. La lógica está en `logica.js`, pura y probada en
// `tests/practicas-multiplica-divide.test.js`; los textos, en `textos.js`; el campo de la
// fracción, en `campo.js`.
//
// «Comprobar» se oculta al responder (T58). Cada fallo pasa a `api.responder` con su `error` (el
// id del error típico) y la `respuesta` del alumno. Las ayudas de «Simplifica antes» y de los
// dos métodos de dividir son optativas y no cuentan como pista.

import { arrancar } from '../_comun/base.js';
import { htmlFraccion, htmlCuenta, aTexto } from '../_comun/fracciones.js';
import { crearFigura } from '../_comun/dibujo-fracciones.js';
import { campoFraccion } from './campo.js';
import {
  TX, fr, fraseParte, htmlTachado, htmlPorLaInversa, htmlEnCruz,
  feedbackMultiplica, feedbackParte, feedbackInversa, feedbackProductoInversa, feedbackDivide, feedbackPotencia,
} from './textos.js';
import {
  F, generarMultiplica, generarParte, generarInversa, generarDivide, generarPotencia,
  errorDeMultiplica, errorDeParte, errorDeInversa, errorDeProductoInversa, errorDeDivide, errorDePotencia,
  partesDeLaParte, cancelaciones,
} from './logica.js';

const operacion = html => `<div class="operacion">${html}</div>`;
const enLinea = (...partes) => htmlCuenta(partes.map(p => (Array.isArray(p) ? F(p) : p)));
const texto = f => aTexto(f);

/**
 * Un campo para la fracción y «Comprobar», con (si se quiere) botones de ayuda delante.
 * `alComprobar(r)` se llama una vez, con la Fraccion escrita.
 */
function pedirFraccion(zona, api, alComprobar, ayudas = []) {
  const { tt } = api;
  zona.insertAdjacentHTML('beforeend', `
    ${ayudas.length ? `<div class="ayudas">${ayudas.map((a, i) => `<button type="button" class="secundario" data-ayuda="${i}">${a.texto}</button>`).join('')}</div><div class="paso-ayuda" aria-live="polite"></div>` : ''}
    <div class="zona-campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`);
  const boton = zona.querySelector('.comprobar');
  const campo = campoFraccion(zona.querySelector('.zona-campo'), {
    nombre: { numerador: tt(TX.numerador), denominador: tt(TX.denominador) }, boton, alEnviar: comprobar,
  });
  const salida = zona.querySelector('.paso-ayuda');
  const botonesAyuda = [...zona.querySelectorAll('[data-ayuda]')];
  const mostradas = new Set();
  botonesAyuda.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido()) return;
    mostradas.add(i);
    salida.innerHTML = [...mostradas].sort().map(k => `<p>${ayudas[k].html()}</p>`).join('');
  }));
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(r) {
    if (api.respondido() || r === null) return;
    campo.bloquear();
    boton.hidden = true;
    botonesAyuda.forEach(b => { b.hidden = true; });
    alComprobar(r);
  }
  return campo;
}

// ─── Ejercicio 1: multiplica ───────────────────────────────────────────────────

const enunciadoMultiplica = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.multiplica)}</p>${operacion(`${enLinea(item.a, '·', item.b, '=', '□')}`)}`;

function montarMultiplica(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoMultiplica(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const ayudas = cancelaciones(item.a, item.b).hay
    ? [{ texto: api.tt(TX.simplifica_antes), html: () => htmlTachado(item) }]
    : [];
  pedirFraccion(zona, api, r => {
    const error = errorDeMultiplica(item, r);
    api.responder({ acierto: !error, html: ctx => feedbackMultiplica(item, ctx, error ?? undefined), error: error ?? undefined, respuesta: texto(r) });
  }, ayudas);
}

// ─── Ejercicio 2: la fracción de una fracción ──────────────────────────────────

const enunciadoParte = (item, api) => `<p class="instruccion">${fraseParte(item, api)}</p>`;

function montarParte(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoParte(item, api)}<div id="dibujo"></div><div id="zona"></div>`;
  const { x, y } = partesDeLaParte(item);
  const figura = crearFigura(contenedor.querySelector('#dibujo'), {
    tipo: 'cuadricula', filas: item.filas, columnas: item.columnas, sombreadas: x,
    nombre: api.tt({ es: 'El todo, dividido en trozos', en: 'The whole, divided into pieces' }),
  });
  pedirFraccion(contenedor.querySelector('#zona'), api, r => {
    const error = errorDeParte(item, r);
    for (const i of y) figura.marcar(i, 'fd-parte--bien');
    api.responder({ acierto: !error, html: ctx => feedbackParte(item, ctx, error ?? undefined), error: error ?? undefined, respuesta: texto(r) });
  });
}

// ─── Ejercicio 3: la inversa ───────────────────────────────────────────────────

const enunciadoInversa = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.inversa)}</p>${operacion(htmlFraccion(F(item.f)))}`;

function montarInversa(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoInversa(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  pedirFraccion(zona, api, r => {
    if (!r.equals(F(item.valor))) {
      const error = errorDeInversa(item, r);
      return api.responder({ acierto: false, html: ctx => feedbackInversa(item, ctx, error), error, respuesta: texto(r) });
    }
    zona.innerHTML = `<p class="instruccion">${tt(TX.enunciado.inversa2)}</p>${operacion(enLinea(item.f, '·', item.valor, '=', '□'))}<div id="zona2"></div>`;
    pedirFraccion(zona.querySelector('#zona2'), api, r2 => {
      const acierto = r2.equals(F([1, 1]));
      const error = acierto ? undefined : errorDeProductoInversa(item, r2);
      api.responder({ acierto, html: ctx => feedbackProductoInversa(item, ctx, error), error, respuesta: texto(r2) });
    });
  });
}

// ─── Ejercicio 4: divide ───────────────────────────────────────────────────────

const enunciadoDivide = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.divide)}</p>${operacion(enLinea(item.a, ':', item.b, '=', '□'))}`;

function montarDivide(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoDivide(item, api)}<div id="zona"></div>`;
  pedirFraccion(contenedor.querySelector('#zona'), api, r => {
    const error = errorDeDivide(item, r);
    api.responder({ acierto: !error, html: ctx => feedbackDivide(item, ctx, error ?? undefined), error: error ?? undefined, respuesta: texto(r) });
  }, [
    { texto: api.tt(TX.por_la_inversa), html: () => htmlPorLaInversa(item) },
    { texto: api.tt(TX.en_cruz), html: () => htmlEnCruz(item) },
  ]);
}

// ─── Ejercicio 5: potencias ────────────────────────────────────────────────────

const enunciadoPotencia = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.potencia)}</p>${operacion(`<span class="cuenta-frac">(${fr(item.base)})<sup>${item.exp}</sup> = □</span>`)}`;

function montarPotencia(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoPotencia(item, api)}<div id="zona"></div>`;
  pedirFraccion(contenedor.querySelector('#zona'), api, r => {
    const error = errorDePotencia(item, r);
    api.responder({ acierto: !error, html: ctx => feedbackPotencia(item, ctx, error ?? undefined), error: error ?? undefined, respuesta: texto(r) });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const clavePar = p => `${p[0]}/${p[1]}`;

arrancar({
  slug: 'multiplica-divide',
  ejercicios: [
    { nombre: TX.nombres.multiplica, detalle: TX.detalles.multiplica, introduccion: TX.introduccion.multiplica, generar: generarMultiplica, clave: i => `${clavePar(i.a)}·${clavePar(i.b)}`, montar: montarMultiplica, enunciado: enunciadoMultiplica },
    { nombre: TX.nombres.parte, detalle: TX.detalles.parte, introduccion: TX.introduccion.parte, generar: generarParte, clave: i => `${i.contexto}${clavePar(i.a)}${clavePar(i.c)}`, montar: montarParte, enunciado: enunciadoParte },
    { nombre: TX.nombres.inversa, detalle: TX.detalles.inversa, introduccion: TX.introduccion.inversa, generar: generarInversa, clave: i => clavePar(i.f), montar: montarInversa, enunciado: enunciadoInversa },
    { nombre: TX.nombres.divide, detalle: TX.detalles.divide, introduccion: TX.introduccion.divide, generar: generarDivide, clave: i => `${clavePar(i.a)}:${clavePar(i.b)}`, montar: montarDivide, enunciado: enunciadoDivide },
    { nombre: TX.nombres.potencia, detalle: TX.detalles.potencia, introduccion: TX.introduccion.potencia, generar: generarPotencia, clave: i => `${clavePar(i.base)}^${i.exp}`, montar: montarPotencia, enunciado: enunciadoPotencia },
  ],
});
