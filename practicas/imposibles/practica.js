// Práctica «Detector de imposibles» — Unidad 2.
//
// Tres ejercicios:
//  1. puede      ¿Puede ser un m.c.d. o un m.c.m. así? (desigualdades)
//  2. producto   la comprobación g · m = a · b (y por qué no vale con tres)
//  3. nombrar    nombrar la respuesta de un mini-problema con una expresión

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, BANCO_NOMBRAR } from './textos.js';
import { generarPuede, generarProducto, generarNombrar, valorExpr } from './logica.js';

// ─── Ejercicio 1: ¿Puede ser? ───────────────────────────────────────────────

function enunciadoPuede(item, api) {
  const { tt } = api;
  if (item.contexto !== null) {
    const plantilla = TX.contextos[item.cantidad][item.contexto];
    return tt(plantilla)(item.a, item.b, item.propuesto);
  }
  const etiqueta = tt(TX.etiquetaExpr[item.cantidad])(item.a, item.b);
  return `${etiqueta} = ${item.propuesto}. ${tt(TX.puedeSer)}`;
}

function explicacionPuede(item, api) {
  const { tt } = api;
  const previo = item.contexto !== null ? `${tt(TX.feedbackPuede.contexto[item.cantidad])(item.a, item.b, item.contexto)} ` : '';
  if (item.puede) return previo + tt(TX.feedbackPuede.correcto[item.cantidad])(item.propuesto, item.a, item.b);
  if (item.violacion === 'cero') return previo + tt(TX.feedbackPuede.cero);
  if (item.violacion === 'mayor') return previo + tt(TX.feedbackPuede.mayor)(item.propuesto, Math.min(item.a, item.b));
  return previo + tt(TX.feedbackPuede.menor)(item.propuesto, Math.max(item.a, item.b));
}

function montarPuede(contenedor, item, api) {
  const { tt, esc } = api;
  contenedor.innerHTML = `<p class="instruccion">${esc(enunciadoPuede(item, api))}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [
      { valor: 'si', html: api.t.si },
      { valor: 'no', html: api.t.no },
    ],
    alElegir(valor) {
      if (api.respondido()) return;
      const buena = item.puede ? 'si' : 'no';
      botones.marcar([buena], valor);
      api.responder({ acierto: valor === buena, html: explicacionPuede(item, api), espera: 1800 });
    },
  });
}

// ─── Ejercicio 2: la comprobación del producto ─────────────────────────────

function montarProducto(contenedor, item, api) {
  const { tt, esc, idioma } = api;
  const tres = item.tipo === 'tres';
  const nombres = idioma === 'es' ? 'm.c.d. · m.c.m.' : 'GCD · LCM';
  const instruccion = tres ? TX.producto.instruccionTres : TX.producto.instruccionDos;
  const base = tres ? `${item.a} · ${item.b} · ${item.c} = ${item.a * item.b * item.c}` : `${item.a} · ${item.b} = ${item.a * item.b}`;
  contenedor.innerHTML = `
    <p class="instruccion">${esc(tt(instruccion))}</p>
    <div class="operacion">${base}</div>
    <div class="flecha" aria-hidden="true">↓</div>
    <div class="operacion">${nombres} = ${item.g} · ${item.m} = ${item.g * item.m}</div>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [
      { valor: 'cuadra', html: tt(TX.producto.boton.cuadra) },
      { valor: 'noCuadra', html: tt(TX.producto.boton.noCuadra) },
    ],
    alElegir(valor) {
      if (api.respondido()) return;
      const buena = item.cuadra ? 'cuadra' : 'noCuadra';
      botones.marcar([buena], valor);
      const html = tres
        ? tt(TX.producto.feedbackTres)(item.a, item.b, item.c, item.g, item.m)
        : tt(item.cuadra ? TX.producto.feedbackCuadra : TX.producto.feedbackNoCuadra)(item.a, item.b, item.g, item.m);
      api.responder({ acierto: valor === buena, html, espera: 2200 });
    },
  });
}

// ─── Ejercicio 3: nómbralo ──────────────────────────────────────────────────

function textoExpr(c, idioma) {
  if (c.fn === 'prod') return `${c.x} · ${c.y}`;
  return idioma === 'es' ? `${c.fn === 'mcd' ? 'm.c.d.' : 'm.c.m.'}(${c.x}, ${c.y})` : `${c.fn === 'mcd' ? 'GCD' : 'LCM'}(${c.x}, ${c.y})`;
}

function montarNombrar(contenedor, item, api) {
  const { tt, esc, idioma } = api;
  const plantilla = BANCO_NOMBRAR[item.plantilla];
  const r = valorExpr(item.cantidad, item.a, item.b);
  const enunciado = tt(plantilla)(item.a, item.b, r);
  contenedor.innerHTML = `<p class="instruccion">${esc(enunciado)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4',
    opciones: item.opciones.map(o => ({ valor: o.valor, html: esc(textoExpr(o, idioma)) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const elegida = item.opciones.find(o => o.valor === valor);
      const correcta = item.opciones.find(o => o.valor === item.solucion);
      const acierto = valor === item.solucion;
      const html = acierto
        ? esc(tt(TX.nombrar.bienElEraRespuesta))
        : `${esc(tt(TX.nombrar.valorDe)(textoExpr(elegida, idioma), valorExpr(elegida.fn, elegida.x, elegida.y)))}, ${esc(tt(TX.nombrar.yLaRespuestaEra))} ${esc(textoExpr(correcta, idioma))} = ${valorExpr(correcta.fn, correcta.x, correcta.y)}.`;
      api.responder({ acierto, html, espera: 2200 });
    },
  });
}

// ─── La práctica ────────────────────────────────────────────────────────────

arrancar({
  slug: 'imposibles',
  ejercicios: [
    {
      nombre: TX.nombre.puede,
      detalle: TX.detalle.puede,
      generar: generarPuede,
      montar: montarPuede,
    },
    {
      nombre: TX.nombre.producto,
      detalle: TX.detalle.producto,
      generar: generarProducto,
      montar: montarProducto,
    },
    {
      nombre: TX.nombre.nombrar,
      detalle: TX.detalle.nombrar,
      generar: generarNombrar,
      montar: montarNombrar,
    },
  ],
});
