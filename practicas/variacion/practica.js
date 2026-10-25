// Práctica «Subidas, bajadas y diferencias» / «Rises, falls and differences» (PU2, tarea 90).
// Unidad 3, Integers. La lógica pura está en `logica.js` y los textos (cada uno con sus números)
// en `textos.js`.
//
// Los ejercicios 2-5 se hacen por etapas (escribir un número, elegir la cuenta, prever el signo):
// `flujo` las encadena y, al primer fallo, entrega el ítem como fallado con la explicación
// completa; si todas salen bien, es un acierto. Mismo mecanismo que `saltos` (tarea 83), copiado
// porque cada práctica es de su tarea.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero } from '../_comun/enteros.js';
import { crearRecta } from '../_comun/recta-enteros.js';
import * as L from './logica.js';
import { NOMBRES, INTRODUCCION, txt } from './textos.js';

const p = s => `<p class="instruccion instruccion--enunciado">${s}</p>`;

// ─── Etapas ────────────────────────────────────────────────────────────────────

/** Encadena las etapas. Cada una es `(zona, avanzar, fallar)`; `fallar({ html, error, respuesta })`. */
function flujo(contenedor, api, etapas, final) {
  const siguiente = i => {
    if (api.respondido()) return;
    if (i === etapas.length) { api.responder({ acierto: true, html: final, espera: 2200 }); return; }
    const zona = document.createElement('div');
    zona.className = 'variacion-etapa';
    contenedor.append(zona);
    etapas[i](zona, () => siguiente(i + 1), fallo => api.responder({ acierto: false, ...fallo }));
  };
  siguiente(0);
}

/** Una etapa de elegir entre botones. `falla(valor)` da el fallo ({ html, error, respuesta }). */
const eleccion = ({ pregunta, opciones, buena, falla, clase }) => (zona, avanzar, fallar) => {
  zona.innerHTML = pregunta;
  const botones = elecciones(zona, {
    clase, opciones,
    alElegir(valor) {
      botones.marcar([buena], valor);
      if (valor === buena) avanzar(); else fallar(falla(valor));
    },
  });
};

/** Una etapa de escribir un entero y «Comprobar». */
const numero = (api, { pregunta, nombre, buena, falla, unidad = '' }) => (zona, avanzar, fallar) => {
  zona.innerHTML = `${pregunta}<div class="variacion-campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = zona.querySelector('.comprobar');
  const comprobar = valor => {
    campo.bloquear();
    boton.hidden = true;
    if (valor === buena) avanzar(); else fallar(falla(valor));
  };
  const campo = campoEntero(zona.querySelector('.variacion-campo'), { nombre, boton, alEnviar: comprobar });
  if (unidad) zona.querySelector('.variacion-campo').insertAdjacentHTML('beforeend', `<span class="variacion-unidad">${unidad}</span>`);
  boton.addEventListener('click', () => { const v = campo.valor(); if (v !== null) comprobar(v); });
};

/** El fallo de una etapa: la explicación del ítem, más el nombre del error típico si se reconoce. */
const fallo = (explica, error, respuesta) => ({
  error: error ?? undefined,
  respuesta: String(respuesta).slice(0, 80),
  html: ({ idioma }) => `${explica(idioma)}${error ? `<br>${txt(idioma).se_llama} ${txt(idioma).errorNombre(error)}` : ''}`,
  espera: 3200,
});

// ─── Ejercicio 1: ¿cuánto ha cambiado? ─────────────────────────────────────────

const enunciadoCambio = (item, { idioma }) => p(`${txt(idioma).cambio.enunciado(item)} ${txt(idioma).cambio.orden}`);

function montarCambio(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoCambio(item, api)}<div class="variacion-dibujo"></div>`;
  const T = txt(api.idioma).cambio;
  // El dibujo enseña el valor inicial y el final; el salto con su variación aparece al responder.
  const vista = L.vistaCambio(item);
  // Números solo en el 0 y en los dos valores (y en los extremos de la recta): con más se montan unos con otros.
  const numeros = [...new Set(vista.tipo === 'recta' ? [vista.min, 0, vista.max, item.i, item.f] : [0, item.i, item.f])];
  const recta = crearRecta(contenedor.querySelector('.variacion-dibujo'), {
    ...vista, numeros,
    unidad: item.ctx === 'temperatura' ? '°C' : '',
    nivel: item.i,
    puntos: [{ valor: item.i, etiqueta: vista.tipo === 'recta' ? '' : fmt(item.i) }, { valor: item.f, etiqueta: vista.tipo === 'recta' ? '' : fmt(item.f) }],
    nombre: txt(api.idioma).dibujo[vista.tipo],
  });
  const botones = elecciones(contenedor, {
    clase: 'elecciones nombres',
    opciones: item.opciones.map((o, n) => ({ valor: n, html: T.frase(item.ctx, o.dir, o.k) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      recta.saltar({ desde: item.i, hasta: item.f, etiqueta: `${item.v > 0 ? '+' : '−'}${Math.abs(item.v)}` });
      const o = item.opciones[valor];
      const ok = valor === item.solucion;
      api.responder({
        acierto: ok, error: o.error ?? undefined, respuesta: `${o.dir} ${o.k}`,
        html: ({ idioma }) => `${txt(idioma).cambio.explica(item)}${o.error ? `<br>${txt(idioma).se_llama} ${txt(idioma).errorNombre(o.error)}` : ''}`,
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 2: la diferencia ────────────────────────────────────────────────

const enunciadoDiferencia = (item, { idioma }) => p(txt(idioma).diferencia.enunciado(item));

function montarDiferencia(contenedor, item, api) {
  contenedor.innerHTML = enunciadoDiferencia(item, api);
  flujo(contenedor, api, [
    numero(api, {
      pregunta: '', nombre: txt(api.idioma).diferencia.enunciado(item), buena: item.d, unidad: txt(api.idioma).unidad(item),
      falla: valor => fallo(idioma => txt(idioma).diferencia.explica(item), L.errorDiferencia(item, valor), fmt(valor)),
    }),
  ], ({ idioma }) => txt(idioma).diferencia.explica(item));
}

// ─── Ejercicio 3: el dato que falta ────────────────────────────────────────────

const enunciadoFalta = (item, { idioma }) => p(txt(idioma).falta.enunciado(item));

function montarFalta(contenedor, item, api) {
  contenedor.innerHTML = enunciadoFalta(item, api);
  flujo(contenedor, api, [
    numero(api, {
      pregunta: '', nombre: txt(api.idioma).falta.enunciado(item), buena: item.r,
      falla: valor => fallo(idioma => txt(idioma).falta.explica(item), L.errorFalta(item, valor), fmt(valor)),
    }),
  ], ({ idioma }) => txt(idioma).falta.explica(item));
}

// ─── Ejercicio 4: antes y después de Cristo ────────────────────────────────────

const enunciadoAnios = (item, { idioma }) => p(txt(idioma).anios.enunciado(item));

function montarAnios(contenedor, item, api) {
  contenedor.innerHTML = enunciadoAnios(item, api);
  flujo(contenedor, api, [
    numero(api, {
      pregunta: '', nombre: txt(api.idioma).anios.enunciado(item), buena: item.d, unidad: txt(api.idioma).unidad(item),
      falla: valor => fallo(idioma => txt(idioma).anios.explica(item), L.errorAnios(item, valor), fmt(valor)),
    }),
  ], ({ idioma }) => txt(idioma).anios.explica(item));
}

// ─── Ejercicio 5: del enunciado a la cuenta ────────────────────────────────────

const enunciadoCuenta = (item, { idioma }) => p(txt(idioma).cuenta.enunciado(item));

function montarCuenta(contenedor, item, api) {
  const T = txt(api.idioma).cuenta;
  contenedor.innerHTML = enunciadoCuenta(item, api);
  const explica = idioma => txt(idioma).cuenta.explica(item);
  flujo(contenedor, api, [
    eleccion({
      pregunta: `<p class="instruccion">${T.qCuenta}</p>`, clase: 'elecciones nombres',
      opciones: item.opciones.map((o, n) => ({ valor: n, html: `<span class="cuenta">${o.texto}</span>` })),
      buena: item.solucion,
      falla: valor => fallo(explica, item.opciones[valor].error, item.opciones[valor].texto),
    }),
    eleccion({
      pregunta: `<p class="instruccion">${T.qSigno}</p>`, clase: 'si-no',
      opciones: [{ valor: 'positivo', html: T.positivo }, { valor: 'negativo', html: T.negativo }],
      buena: item.signo,
      falla: valor => fallo(explica, 'signo-cambiado', valor),
    }),
    numero(api, {
      pregunta: `<p class="instruccion">${T.qResultado}</p>`, nombre: T.qResultado, buena: item.r,
      falla: valor => fallo(explica, valor === -item.r ? 'signo-cambiado' : null, fmt(valor)),
    }),
  ], ({ idioma }) => explica(idioma));
}

arrancar({
  slug: 'variacion',
  ejercicios: [
    { nombre: NOMBRES.nombre[0], detalle: NOMBRES.detalle[0], introduccion: INTRODUCCION[0], generar: L.generarCambio, clave: L.claveItem, montar: montarCambio, enunciado: enunciadoCambio },
    { nombre: NOMBRES.nombre[1], detalle: NOMBRES.detalle[1], introduccion: INTRODUCCION[1], generar: L.generarDiferencia, clave: L.claveItem, montar: montarDiferencia, enunciado: enunciadoDiferencia },
    { nombre: NOMBRES.nombre[2], detalle: NOMBRES.detalle[2], introduccion: INTRODUCCION[2], generar: L.generarFalta, clave: L.claveItem, montar: montarFalta, enunciado: enunciadoFalta },
    { nombre: NOMBRES.nombre[3], detalle: NOMBRES.detalle[3], introduccion: INTRODUCCION[3], generar: L.generarAnios, clave: L.claveItem, montar: montarAnios, enunciado: enunciadoAnios },
    { nombre: NOMBRES.nombre[4], detalle: NOMBRES.detalle[4], introduccion: INTRODUCCION[4], generar: L.generarCuenta, clave: L.claveItem, montar: montarCuenta, enunciado: enunciadoCuenta },
  ],
});
