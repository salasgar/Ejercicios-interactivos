// Práctica «La recta y el termómetro» (unidad 3, tarea 80): la interfaz (los `montar`)
// y la llamada a `arrancar`. La lógica está en `logica.js`, pura y probada en
// `tests/practicas-termometro.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, leerEntero, campoEntero } from '../_comun/enteros.js';
import { crearRecta } from '../_comun/recta-enteros.js';
import {
  generarColoca, errorColoca, generarTemperatura, errorTemperatura, generarComparar, simbolo, errorComparar,
  generarOrden, ordenBien, errorOrden, cadenaOrden, generarClases, cajaDe, escribe, fallosClases, errorClases,
} from './logica.js';
import { TX } from './textos.js';

const CAJAS = ['positivo', 'negativo', 'ninguno'];

// ─── Ejercicio 1: coloca el entero ────────────────────────────────────────────────

const enunciadoColoca = (item, { tt }) => `<p class="instruccion">${tt(TX.ej1.pregunta)(item.objetivo)}</p>`;

function montarColoca(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoColoca(item, api)}
    <div id="recta"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  let elegido = null;
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    tipo: 'recta', min: item.min, max: item.max, paso: item.paso, numeros: item.numeros, nombre: api.tt(TX.ej1.recta),
    alTocar(valor) {
      if (api.respondido()) return;
      if (elegido !== null) recta.desmarcar(elegido);
      elegido = valor;
      recta.marcar(valor);
      boton.disabled = false;
    },
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || elegido === null) return;
    boton.hidden = true;
    recta.bloquear();
    const acierto = elegido === item.objetivo;
    recta.desmarcar(elegido);
    if (acierto) recta.marcar(elegido, 're-toque--bien');
    else { recta.marcar(elegido, 're-toque--mal'); recta.marcar(item.objetivo, 're-toque--falta'); }
    const toque = elegido;
    const error = acierto ? null : errorColoca(item, toque);
    api.responder({
      acierto,
      error: error ?? undefined,
      respuesta: fmt(toque),
      html: ({ tt }) => {
        const bien = tt(TX.ej1.bien)(item.objetivo, item.paso);
        if (acierto) return `${bien}.`;
        const queDijo = error === 'signo-cambiado' ? TX.ej1.simetrico : error === 'marca-vecina' ? TX.ej1.vecina : TX.ej1.otra;
        return `${tt(queDijo)(item.objetivo, toque)}. ${bien}.`;
      },
      espera: 2200,
    });
  });
}

// ─── Ejercicio 2: ¿qué temperatura marca? ─────────────────────────────────────────

const enunciadoTemperatura = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.ej2.contexto[item.contexto])} ${tt(TX.ej2.escala)(item.paso)}</p><p>${tt(TX.ej2.pregunta)}</p>`;

function montarTemperatura(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoTemperatura(item, api)}
    <div id="termometro"></div>
    <div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const termometro = crearRecta(contenedor.querySelector('#termometro'), {
    tipo: 'termometro', min: item.min, max: item.max, paso: item.paso, numeros: [0, item.min, item.max],
    nivel: item.valor, unidad: '°C', nombre: api.tt(TX.ej2.campo),
  });
  const campo = campoEntero(contenedor.querySelector('#campo'), { nombre: api.tt(TX.ej2.campo), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    termometro.bloquear();
    const acierto = valor === item.valor;
    const error = acierto ? undefined : errorTemperatura(item, valor);
    api.responder({
      acierto,
      error,
      respuesta: fmt(valor),
      html: ({ tt }) => {
        const bien = `${tt(TX.ej2.bien)(item.valor, item.paso)}.`;
        if (acierto) return bien;
        const queDijo = error === 'signo-cambiado' ? tt(TX.ej2.signo)(item.valor)
          : error === 'cuenta-marcas' ? tt(TX.ej2.marcas)(item.valor, valor, item.paso)
            : tt(TX.ej2.otro)(valor);
        return `${queDijo}. ${bien}`;
      },
      espera: 2400,
    });
  }
}

// ─── Ejercicio 3: mayor o menor ───────────────────────────────────────────────────

const enunciadoComparar = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.ej3.pregunta)}</p><div class="operacion">${fmt(item.a)} □ ${fmt(item.b)}</div>`;

function montarComparar(contenedor, item, api) {
  contenedor.innerHTML = enunciadoComparar(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: '<', html: '&lt;' }, { valor: '>', html: '&gt;' }],
    alElegir(elegido) {
      if (api.respondido()) return;
      const buena = simbolo(item);
      botones.marcar([buena], elegido);
      const acierto = elegido === buena;
      const error = errorComparar(item, elegido) ?? undefined;
      contenedor.querySelector('.operacion').innerHTML = `${fmt(item.a)} ${buena === '<' ? '&lt;' : '&gt;'} ${fmt(item.b)}`;
      if (!acierto) {
        const zona = document.createElement('div');
        contenedor.append(zona);
        const paso = Math.max(Math.abs(item.a), Math.abs(item.b)) > 10 ? 2 : 1;
        crearRecta(zona, {
          tipo: 'recta', min: -10 * paso, max: 10 * paso, paso, numeros: 'algunas', nombre: api.tt(TX.ej3.recta),
          puntos: [{ valor: item.a, etiqueta: fmt(item.a), clase: 're-punto--bien' }, { valor: item.b, etiqueta: fmt(item.b), clase: 're-punto--bien' }],
        }).bloquear();
      }
      api.responder({
        acierto,
        error,
        respuesta: elegido,
        html: ({ tt }) => {
          const bien = `${tt(TX.ej3.bien)(item.a, item.b)}.`;
          if (acierto) return bien;
          const queDijo = error === 'compara-como-naturales' ? tt(TX.ej3.naturales)(item.a, item.b) : tt(TX.ej3.absoluto)(item.a, item.b);
          return `${queDijo}. ${bien}`;
        },
        espera: 2200,
      });
    },
  });
}

// ─── Ejercicio 4: ordena ──────────────────────────────────────────────────────────

const enunciadoOrden = (item, { tt }) =>
  `<p class="instruccion">${tt(TX.ej4.pregunta)(item.creciente)}</p>`;

function montarOrden(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoOrden(item, api)}
    <div class="fichas" id="tarjetas"></div>
    <p class="fichas-titulo">${api.tt(TX.ej4.tuOrden)}</p>
    <div class="fichas fichas--orden" id="orden" aria-live="polite"></div>
    <div class="acciones">
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>
      <button type="button" class="secundario" id="borrar">${api.t.borrar}</button>
    </div>`;
  const tarjetas = contenedor.querySelector('#tarjetas');
  const orden = contenedor.querySelector('#orden');
  const boton = contenedor.querySelector('#comprobar');
  const borrar = contenedor.querySelector('#borrar');
  const elegidos = [];
  const botones = item.numeros.map(valor => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ficha';
    b.textContent = fmt(valor);
    b.addEventListener('click', () => {
      if (api.respondido() || elegidos.includes(valor)) return;
      elegidos.push(valor);
      pintar();
    });
    tarjetas.append(b);
    return [valor, b];
  });
  function pintar() {
    for (const [valor, b] of botones) b.disabled = elegidos.includes(valor) || api.respondido();
    orden.innerHTML = elegidos.map(v => `<span class="ficha ficha--puesta">${fmt(v)}</span>`).join('');
    boton.disabled = elegidos.length !== item.numeros.length;
  }
  borrar.addEventListener('click', () => { if (api.respondido()) return; elegidos.length = 0; pintar(); });
  boton.addEventListener('click', () => {
    if (api.respondido() || elegidos.length !== item.numeros.length) return;
    boton.hidden = true;
    borrar.hidden = true;
    const mio = [...elegidos];
    const acierto = ordenBien(item, mio);
    const error = acierto ? undefined : errorOrden(item, mio);
    for (const [, b] of botones) b.disabled = true;
    orden.querySelectorAll('.ficha').forEach(f => f.classList.add(acierto ? 'ficha--bien' : 'ficha--mal'));
    api.responder({
      acierto,
      error,
      respuesta: mio.map(fmt).join(', '),
      html: ({ tt }) => {
        const bien = `${tt(TX.ej4.bien)(cadenaOrden(item))}.`;
        if (acierto) return bien;
        const queDijo = error === 'ordena-como-naturales' ? tt(TX.ej4.naturales)
          : error === 'orden-al-reves' ? tt(TX.ej4.reves) : tt(TX.ej4.suyo)(mio.map(fmt).join(', '));
        return `${queDijo}. ${bien}`;
      },
      espera: 2400,
    });
  });
  pintar();
}

// ─── Ejercicio 5: ¿positivo, negativo o ninguno? ──────────────────────────────────

const enunciadoClases = (item, { tt }) => `<p class="instruccion">${tt(TX.ej5.pregunta)}</p>`;

function montarClases(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoClases(item, api)}
    <div class="fichas" id="pila"></div>
    <div class="cajas" id="cajas">${CAJAS.map(c => `
      <div class="caja" role="group" data-caja="${c}" aria-label="${tt(TX.ej5.cajas[c])}"><span class="caja__titulo">${tt(TX.ej5.cajas[c])}</span><span class="caja__dentro"></span></div>`).join('')}
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const pila = contenedor.querySelector('#pila');
  const boton = contenedor.querySelector('#comprobar');
  const respuesta = item.numeros.map(() => null);   // la caja de cada número
  let elegido = null;                               // índice del número seleccionado
  const ficha = (i, clase = '') => `<button type="button" class="ficha ${clase}" data-i="${i}">${escribe(item.numeros[i])}</button>`;
  function pintar() {
    pila.innerHTML = item.numeros.map((_, i) => (respuesta[i] === null ? ficha(i, i === elegido ? 'ficha--elegida' : '') : '')).join('');
    for (const c of CAJAS) {
      contenedor.querySelector(`[data-caja="${c}"] .caja__dentro`).innerHTML =
        item.numeros.map((_, i) => (respuesta[i] === c ? ficha(i, 'ficha--puesta') : '')).join('');
    }
    boton.disabled = respuesta.some(r => r === null);
  }
  contenedor.addEventListener('click', ev => {
    if (api.respondido()) return;
    const f = ev.target.closest('.ficha');
    const caja = ev.target.closest('.caja');
    if (f) {
      const i = Number(f.dataset.i);
      if (respuesta[i] !== null) { respuesta[i] = null; elegido = null; } else elegido = i === elegido ? null : i;
      ev.stopPropagation();
      pintar();
    } else if (caja && elegido !== null) {
      respuesta[elegido] = caja.dataset.caja;
      elegido = null;
      pintar();
    }
  });
  boton.addEventListener('click', () => {
    if (api.respondido() || respuesta.some(r => r === null)) return;
    boton.hidden = true;
    const fallos = fallosClases(item, respuesta);
    const acierto = fallos.length === 0;
    contenedor.querySelectorAll('.caja .ficha').forEach(f => {
      f.disabled = true;
      f.classList.add(cajaDe(item.numeros[Number(f.dataset.i)].valor) === respuesta[Number(f.dataset.i)] ? 'ficha--bien' : 'ficha--mal');
    });
    contenedor.querySelectorAll('.caja').forEach(c => c.classList.add('caja--cerrada'));
    api.responder({
      acierto,
      error: acierto ? undefined : errorClases(fallos),
      respuesta: fallos.map(f => `${escribe(f.numero)}: ${f.puesto}`).join('; '),
      html: ({ tt }) => (acierto ? `${tt(TX.ej5.bien)}.` : fallos.map(f => {
        if (f.numero.valor === 0) return `${tt(TX.ej5.cero)}.`;
        if (f.numero.mas) return `${tt(TX.ej5.mas)(f.numero.valor)}.`;
        return `${tt(TX.ej5.otro)(f.numero.valor, tt(TX.ej5.cajaTexto[f.correcto]))}.`;
      }).join(' ')),
      espera: 2200,
    });
  });
  pintar();
}

// ─── La práctica ───────────────────────────────────────────────────────────────────

arrancar({
  slug: 'termometro',
  ejercicios: [
    {
      nombre: TX.ej1.nombre, detalle: TX.ej1.detalle, introduccion: TX.ej1.introduccion,
      generar: generarColoca, clave: i => `${i.min}:${i.objetivo}`, montar: montarColoca, enunciado: enunciadoColoca,
    },
    {
      nombre: TX.ej2.nombre, detalle: TX.ej2.detalle, introduccion: TX.ej2.introduccion,
      generar: generarTemperatura, clave: i => `${i.paso}:${i.max}:${i.valor}`, montar: montarTemperatura, enunciado: enunciadoTemperatura,
    },
    {
      nombre: TX.ej3.nombre, detalle: TX.ej3.detalle, introduccion: TX.ej3.introduccion,
      generar: generarComparar, clave: i => `${i.a}:${i.b}`, montar: montarComparar, enunciado: enunciadoComparar,
    },
    {
      nombre: TX.ej4.nombre, detalle: TX.ej4.detalle, introduccion: TX.ej4.introduccion,
      generar: generarOrden, clave: i => `${i.creciente}:${i.numeros.join()}`, montar: montarOrden, enunciado: enunciadoOrden,
    },
    {
      nombre: TX.ej5.nombre, detalle: TX.ej5.detalle, introduccion: TX.ej5.introduccion,
      generar: generarClases, clave: i => i.numeros.map(escribe).join(), montar: montarClases, enunciado: enunciadoClases,
    },
  ],
});
