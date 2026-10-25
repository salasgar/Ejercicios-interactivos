// Práctica «Opuesto y valor absoluto» (unidad 3, tarea 81): la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en `logica.js`, pura y probada en
// `tests/practicas-opuestos.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero } from '../_comun/enteros.js';
import { crearRecta } from '../_comun/recta-enteros.js';
import {
  RECTA, rectaPara, generarOpuesto, opuestoDe, errorOpuesto, generarDistancia, errorDistancia,
  generarOpuestoYAbsoluto, errorHueco, generarDistancias, aMarcar, mayorDe, errorMarcar, marcarBien,
} from './logica.js';
import { TX } from './textos.js';

const punto = (valor, clase = '') => ({ valor, etiqueta: fmt(valor), clase });

// ─── Ejercicio 1: el opuesto ───────────────────────────────────────────────────────

const enunciadoOpuesto = (item, { tt }) => `<p class="instruccion">${tt(item.modo === 'doble' ? TX.ej1.doble : TX.ej1.toca)(item.n)}</p>`;

function montarOpuesto(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoOpuesto(item, api)}
    <div id="recta"></div>
    ${item.modo === 'doble' ? '<div id="campo"></div>' : ''}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  let elegido = null;
  let campo = null;
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    ...RECTA, numeros: 'algunas', nombre: api.tt(TX.ej1.recta), puntos: [punto(item.n)],
    alTocar: item.modo === 'toca' ? valor => {
      if (api.respondido()) return;
      if (elegido !== null) recta.desmarcar(elegido);
      elegido = valor;
      recta.marcar(valor);
      boton.disabled = false;
    } : null,
  });
  if (item.modo === 'doble') campo = campoEntero(contenedor.querySelector('#campo'), { nombre: api.tt(TX.ej1.campo), boton, alEnviar: v => comprobar(v) });
  boton.addEventListener('click', () => comprobar(campo ? campo.valor() : elegido));
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    boton.hidden = true;
    campo?.bloquear();
    recta.bloquear();
    const buena = opuestoDe(item);
    const acierto = valor === buena;
    if (item.modo === 'toca') {
      recta.desmarcar(valor);
      if (acierto) recta.marcar(valor, 're-toque--bien');
      else { recta.marcar(valor, 're-toque--mal'); recta.marcar(buena, 're-toque--falta'); }
    } else {
      recta.ponerPuntos([punto(item.n), punto(buena, acierto ? 're-punto--bien' : 're-punto--hueco')]);
    }
    const error = acierto ? undefined : errorOpuesto(item, valor);
    api.responder({
      acierto,
      error,
      respuesta: fmt(valor),
      html: ({ tt }) => {
        const bien = `${tt(item.modo === 'doble' ? TX.ej1.bienDoble : TX.ej1.bien)(item.n)}.`;
        if (acierto) return bien;
        const queDijo = error === 'sin-cambiar-el-signo' ? tt(TX.ej1.sinCambiar)(item.n)
          : error === 'opuesto-del-opuesto' ? tt(TX.ej1.delOpuesto)(item.n) : tt(TX.ej1.otro)(item.n, valor);
        return `${queDijo}. ${bien}`;
      },
      espera: 2200,
    });
  }
}

// ─── Ejercicio 2: distancia al cero ────────────────────────────────────────────────

const enunciadoDistancia = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.ej2.pregunta)}</p><div class="operacion">|${fmt(item.n)}| = □</div>`;

function montarDistancia(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoDistancia(item, api)}
    <div id="recta"></div>
    <div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    ...RECTA, numeros: 'algunas', nombre: api.tt(TX.ej1.recta), puntos: [punto(item.n)],
  });
  const campo = campoEntero(contenedor.querySelector('#campo'), { nombre: api.tt(TX.ej2.campo), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    recta.bloquear();
    const acierto = valor === Math.abs(item.n);
    if (item.n !== 0) recta.saltar({ desde: item.n, hasta: 0, etiqueta: `${Math.abs(item.n)}`, clase: '', animar: true });
    contenedor.querySelector('.operacion').innerHTML = `|${fmt(item.n)}| = ${Math.abs(item.n)}`;
    const error = acierto ? undefined : errorDistancia(item, valor);
    api.responder({
      acierto,
      error,
      respuesta: fmt(valor),
      html: ({ tt }) => {
        const bien = `${tt(TX.ej2.bien)(item.n)}.`;
        if (acierto) return bien;
        return `${error === 'valor-absoluto-negativo' ? tt(TX.ej2.negativo)(item.n) : tt(TX.ej2.otro)(valor)}. ${bien}`;
      },
      espera: 2200,
    });
  }
}

// ─── Ejercicio 3: opuesto y valor absoluto ─────────────────────────────────────────

const enunciadoDoble = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.ej3.opuestoDe)(item.n)} □</p><p class="instruccion">${tt(TX.ej3.absolutoDe)(item.n)} □</p>`;

function montarDoble(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <div class="hueco-fila"><span>${tt(TX.ej3.opuestoDe)(item.n)}</span><div id="campo-opuesto"></div></div>
    <div class="hueco-fila"><span>${tt(TX.ej3.absolutoDe)(item.n)}</span><div id="campo-absoluto"></div></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const actualizar = () => { boton.disabled = api.respondido() || opuesto.valor() === null || absoluto.valor() === null; };
  const opuesto = campoEntero(contenedor.querySelector('#campo-opuesto'), { nombre: tt(TX.ej3.hueco), alEnviar: () => comprobar() });
  const absoluto = campoEntero(contenedor.querySelector('#campo-absoluto'), { nombre: tt(TX.ej3.hueco), alEnviar: () => comprobar() });
  contenedor.addEventListener('input', actualizar);
  contenedor.addEventListener('click', actualizar);
  boton.addEventListener('click', comprobar);
  function comprobar() {
    const o = opuesto.valor(), a = absoluto.valor();
    if (api.respondido() || o === null || a === null) return;
    opuesto.bloquear(); absoluto.bloquear();
    boton.hidden = true;
    const eo = errorHueco(item, 'opuesto', o), ea = errorHueco(item, 'absoluto', a);
    const acierto = !eo && !ea;
    if (!acierto) {
      const zona = document.createElement('div');
      contenedor.append(zona);
      crearRecta(zona, {
        ...rectaPara([item.n]), numeros: 'algunas', nombre: tt(TX.ej3.recta),
        puntos: [punto(item.n), punto(-item.n, 're-punto--bien')],
      }).bloquear();
    }
    api.responder({
      acierto,
      error: eo ?? ea ?? undefined,
      respuesta: `${fmt(o)}; ${fmt(a)}`,
      html: ({ tt }) => {
        const bien = tt(TX.ej3.bien)(item.n);
        if (acierto) return bien;
        const frases = [];
        if (eo === 'opuesto-del-opuesto') frases.push(tt(TX.ej3.delOpuesto)(item.n));
        else if (eo === 'sin-cambiar-el-signo') frases.push(tt(TX.ej3.sinCambiar)(item.n));
        if (ea === 'valor-absoluto-negativo') frases.push(tt(TX.ej3.negativo));
        else if (ea === 'absoluto-como-opuesto') frases.push(tt(TX.ej3.comoOpuesto)(item.n));
        return `${frases.join('. ')}${frases.length ? '. ' : ''}${tt(TX.ej3.explica)(item.n)}. ${bien}`;
      },
      espera: 3000,
    });
  }
}

// ─── Ejercicio 4: ¿quiénes están a esa distancia? ──────────────────────────────────

const enunciadoDistancias = (item, { tt }) =>
  `<p class="instruccion">${item.modo === 'marcar' ? tt(TX.ej4.marcar)(item.k) : tt(TX.ej4.comparar)(item.a, item.b)}</p>`;

function montarDistancias(contenedor, item, api) {
  if (item.modo === 'comparar') return montarComparar(contenedor, item, api);
  contenedor.innerHTML = `
    ${enunciadoDistancias(item, api)}
    <div id="recta"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const marcados = new Set();
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    ...RECTA, numeros: 'algunas', nombre: api.tt(TX.ej1.recta),
    alTocar(valor) {
      if (api.respondido()) return;
      if (marcados.has(valor)) { marcados.delete(valor); recta.desmarcar(valor); } else { marcados.add(valor); recta.marcar(valor); }
      boton.disabled = marcados.size === 0;
    },
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || marcados.size === 0) return;
    boton.hidden = true;
    recta.bloquear();
    const mios = [...marcados];
    const buenos = aMarcar(item);
    const acierto = marcarBien(item, mios);
    for (const v of new Set([...mios, ...buenos])) {
      recta.desmarcar(v);
      recta.marcar(v, buenos.includes(v) ? (marcados.has(v) ? 're-toque--bien' : 're-toque--falta') : 're-toque--mal');
    }
    const error = acierto ? undefined : errorMarcar(item, mios);
    api.responder({
      acierto,
      error,
      respuesta: mios.sort((x, y) => x - y).map(fmt).join(', '),
      html: ({ tt }) => {
        const bien = `${tt(TX.ej4.bienMarcar)(item.k)}.`;
        return acierto ? bien : `${tt(error === 'solo-uno' ? TX.ej4.soloUno : TX.ej4.marcaMal)}. ${bien}`;
      },
      espera: 2200,
    });
  });
}

function montarComparar(contenedor, item, api) {
  contenedor.innerHTML = enunciadoDistancias(item, api);
  const buena = mayorDe(item);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [item.a, item.b].map(v => ({ valor: v, html: fmt(v) })),
    alElegir(elegido) {
      if (api.respondido()) return;
      botones.marcar([buena], elegido);
      const acierto = elegido === buena;
      if (!acierto) {
        const zona = document.createElement('div');
        contenedor.append(zona);
        crearRecta(zona, { ...RECTA, numeros: 'algunas', nombre: api.tt(TX.ej4.recta), puntos: [punto(item.a, 're-punto--bien'), punto(item.b, 're-punto--bien')] }).bloquear();
      }
      api.responder({
        acierto,
        error: acierto ? undefined : 'compara-como-naturales',
        respuesta: fmt(elegido),
        html: ({ tt }) => `${acierto ? '' : `${tt(TX.ej4.naturales)(item.a, item.b)}. `}${tt(TX.ej4.bienComparar)(item.a, item.b)}.`,
        espera: 2200,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────────

arrancar({
  slug: 'opuestos',
  ejercicios: [
    {
      nombre: TX.ej1.nombre, detalle: TX.ej1.detalle, introduccion: TX.ej1.introduccion,
      generar: generarOpuesto, clave: i => `${i.modo}:${i.n}`, montar: montarOpuesto, enunciado: enunciadoOpuesto,
    },
    {
      nombre: TX.ej2.nombre, detalle: TX.ej2.detalle, introduccion: TX.ej2.introduccion,
      generar: generarDistancia, clave: i => `${i.n}`, montar: montarDistancia, enunciado: enunciadoDistancia,
    },
    {
      nombre: TX.ej3.nombre, detalle: TX.ej3.detalle, introduccion: TX.ej3.introduccion,
      generar: generarOpuestoYAbsoluto, clave: i => `${i.n}`, montar: montarDoble, enunciado: enunciadoDoble,
    },
    {
      nombre: TX.ej4.nombre, detalle: TX.ej4.detalle, introduccion: TX.ej4.introduccion,
      generar: generarDistancias, clave: i => `${i.modo}:${i.k ?? ''}:${i.a ?? ''}:${i.b ?? ''}`, montar: montarDistancias, enunciado: enunciadoDistancias,
    },
  ],
});
