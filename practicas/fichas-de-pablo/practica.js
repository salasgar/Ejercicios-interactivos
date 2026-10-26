// «Las fichas del parchís» (tarea 97 de PU2; renombrada y ejercicio 6 rehecho en la 114): la hoja de refuerzo de la unidad 2 como ejercicios
// interactivos. Cada número es un montón de fichas de colores, una por factor primo; multiplicar
// es juntar, dividir es quitar, el m.c.d. son las fichas que tienen los dos y el m.c.m. es el
// montón más pequeño que contiene a los dos.
//
// La interfaz; los generadores y los diagnósticos están en logica.js (puro, con su test), cómo se
// dibuja una ficha en dibujo.js y los textos en textos.js. Tras responder, la traducción enseña
// `enunciado` y el feedback en el otro idioma (el `html` de `api.responder` es una función del idioma).

import { arrancar } from '../_comun/base.js';
import { campoNumero, elecciones, pasos } from '../_comun/piezas.js';
import { TX } from './textos.js';
import { fichaHtml, montonHtml } from './dibujo.js';
import {
  PRIMOS_FICHA, MAX_FICHAS_COLOR, MAX_FICHAS_PRODUCTO,
  colores, exp, valor, indice, nFichas, deExps, limpiar, comunes, juntar, montonMinimo,
  generarLee, diagnosticarLee, generarConstruye, diagnosticarConstruye,
  generarProducto, diagnosticarProducto, diagnosticarAnadir, generarQuita, diagnosticarQuita,
  generarRegla, diagnosticarDivisible, diagnosticarCociente, diagnosticarColorFalta,
  generarTablaDivisores, productoCasilla, diagnosticarTabla,
  generarMcd, diagnosticarMcd, parejasEn, generarMcm, diagnosticarMcm,
} from './logica.js';

const unir = (...partes) => partes.filter(Boolean).join(' ');
/** El montón como texto corto para el registro de fallos: «2^3 · 5». */
const textoMonton = m => (nFichas(m) ? colores(m).map(p => (exp(m, p) === 1 ? `${p}` : `${p}^${exp(m, p)}`)).join(' · ') : '1');
const escena = (...html) => `<div class="fp-escena">${html.join('')}</div>`;
/** «40 = 2³ · 5» y debajo sus fichas. */
const igualEscrito = m => (indice(m) === `${valor(m)}` ? `${valor(m)}` : `${valor(m)} = ${indice(m)}`);
const numeroConFichas = m => `<div class="fp-numero"><span class="fp-valor">${igualEscrito(m)}</span>${montonHtml(m)}</div>`;

// ─── Piezas propias ────────────────────────────────────────────────────────────────

/**
 * Las fichas de un montón, cada una tocable. Las del mismo color son indistinguibles: la selección
 * es el montón de las fichas pulsadas (cuántas de cada color), nunca cuáles.
 */
function fichasTocables(contenedor, m, { alCambiar, clase = '', clasesFicha = '' }) {
  const caja = document.createElement('div');
  caja.className = unir('fp-escena fp-tocables', clase);
  caja.innerHTML = colores(m).map(p => `<span class="fp-grupo">${
    Array.from({ length: exp(m, p) }, () => fichaHtml(p, { boton: true, clases: clasesFicha, atributos: `data-p="${p}" aria-pressed="false"` })).join('')
  }</span>`).join('');
  contenedor.append(caja);
  const botones = [...caja.querySelectorAll('button')];
  let bloqueado = false;
  botones.forEach(b => b.addEventListener('click', () => {
    if (bloqueado) return;
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    alCambiar();
  }));
  return {
    seleccion: () => limpiar(Object.fromEntries(PRIMOS_FICHA.map(p => [p, botones.filter(b => Number(b.dataset.p) === p && b.getAttribute('aria-pressed') === 'true').length]))),
    bloquear() { bloqueado = true; botones.forEach(b => { b.disabled = true; }); },
  };
}

/** Un contador −/+ por color para construir un montón; se ve la ficha del color y cuántas hay. */
function controlesMonton(contenedor, { max, tt, alCambiar }) {
  const caja = document.createElement('div');
  caja.className = 'grupo-pasos fp-controles';
  contenedor.append(caja);
  const ctl = PRIMOS_FICHA.map(p => pasos(caja, {
    max,
    nombre: tt(TX.construye.cuantas)(p),
    pinta: e => `${fichaHtml(p, { clases: 'fp-ficha--mini' })}<span class="fp-cuantas">${e}</span>`,
    alCambiar: () => alCambiar(),
  }));
  return { monton: () => deExps(ctl.map(c => c.valor())), bloquear: () => ctl.forEach(c => c.bloquear()) };
}

/** El montón del alumno, dibujado, y su valor. */
const vistaMonton = (m, tt) => `<div class="fp-tuyo"><span class="fp-etiqueta">${tt(TX.comun.tuMonton)}</span> ${montonHtml(m)}<span class="fp-valor">${nFichas(m) ? `${indice(m)} = ${valor(m)}` : '1'}</span></div>`;

/** Cierra el ítem: una sola llamada a `api.responder` con el diagnóstico. */
function terminar(api, diag, { html, respuesta, espera = 3500 }) {
  api.responder({ acierto: diag.acierto, html, espera, ...(diag.acierto ? {} : { error: diag.error }), respuesta });
}

// ─── Ejercicio 1: lee las fichas ───────────────────────────────────────────────────

const enunciadoLee = (item, { tt }) => `<p class="instruccion">${tt(TX.lee.instruccion)}</p>${escena(montonHtml(item.m))}`;

function montarLee(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoLee(item, api)}<div id="campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const campo = campoNumero(contenedor.querySelector('#campo'), { nombre: tt(TX.lee.campo), idioma: api.idioma, boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(n) {
    if (api.respondido() || n === null) return;
    campo.bloquear();
    boton.hidden = true;
    const diag = diagnosticarLee(item, n);
    terminar(api, diag, {
      respuesta: String(n),
      html: ({ tt }) => unir(tt(TX.lee.buena)(item.m), diag.acierto ? '' : tt(TX.lee.nota)(diag.error, item.m)),
    });
  }
}

// ─── Ejercicio 2: construye el montón ───────────────────────────────────────────────

const enunciadoConstruye = (item, { tt }) => `<p class="instruccion">${tt(TX.construye.instruccion)(valor(item.m))}</p>`;

function montarConstruye(contenedor, item, api) {
  const { tt } = api;
  const n = valor(item.m);
  contenedor.innerHTML = `${enunciadoConstruye(item, api)}
    <div class="operacion" id="expresion"></div>
    <div id="controles"></div>
    <div id="vista"></div>
    <button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const pintar = () => {
    const st = ctl.monton();
    contenedor.querySelector('#expresion').innerHTML = `${n} = ${nFichas(st) ? indice(st) : '□'}`;
    contenedor.querySelector('#vista').innerHTML = vistaMonton(st, tt);
  };
  const ctl = controlesMonton(contenedor.querySelector('#controles'), { max: MAX_FICHAS_COLOR, tt, alCambiar: pintar });
  pintar();
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const st = ctl.monton();
    ctl.bloquear();
    boton.hidden = true;
    const diag = diagnosticarConstruye(item, st);
    terminar(api, diag, {
      respuesta: textoMonton(st),
      html: ({ tt }) => unir(
        diag.acierto ? '' : tt(TX.construye.tuyas)(st, n),
        diag.acierto ? '' : tt(TX.construye.nota)(diag.error, item.m, diag.color),
        tt(TX.construye.buena)(item.m),
      ),
    });
  });
}

// ─── Ejercicio 3: multiplicar es juntar ──────────────────────────────────────────────

function enunciadoProducto(item, { tt }) {
  if (item.tipo === 'anadir') {
    return `<p class="instruccion">${tt(TX.producto.instruccionAnadir)(valor(item.a), item.k)}</p>${escena(numeroConFichas(item.a))}`;
  }
  return `<p class="instruccion">${tt(TX.producto.instruccion)(valor(item.a), valor(item.b))}</p>${escena(numeroConFichas(item.a), numeroConFichas(item.b))}`;
}

function montarProducto(contenedor, item, api) {
  const { tt } = api;
  if (item.tipo === 'anadir') return montarAnadir(contenedor, item, api);
  contenedor.innerHTML = `${enunciadoProducto(item, api)}
    <div id="controles"></div>
    <div id="vista"></div>
    <button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const pintar = () => { contenedor.querySelector('#vista').innerHTML = vistaMonton(ctl.monton(), tt); };
  const ctl = controlesMonton(contenedor.querySelector('#controles'), { max: MAX_FICHAS_PRODUCTO, tt, alCambiar: pintar });
  pintar();
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const st = ctl.monton();
    ctl.bloquear();
    boton.hidden = true;
    const diag = diagnosticarProducto(item, st);
    terminar(api, diag, {
      respuesta: textoMonton(st),
      html: ({ tt }) => unir(
        diag.acierto ? '' : tt(TX.producto.tuyas)(st),
        diag.acierto ? '' : tt(TX.producto.nota)(diag.error, item.a, item.b, diag.color),
        tt(TX.producto.buena)(item.a, item.b),
      ),
    });
  });
}

function montarAnadir(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoProducto(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4 fp-opciones',
    opciones: item.opciones.map((m, i) => ({ valor: i, html: montonHtml(m) })),
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([item.buena], i);
      const diag = diagnosticarAnadir(item, i);
      terminar(api, diag, {
        respuesta: textoMonton(item.opciones[i]),
        html: ({ tt }) => unir(diag.acierto ? '' : tt(TX.producto.notaAnadir)(diag.error), tt(TX.producto.buenaAnadir)(item.a, item.k)),
      });
    },
  });
}

// ─── Ejercicio 4: dividir es quitar ──────────────────────────────────────────────────

const enunciadoQuita = (item, { tt }) => `<p class="instruccion">${tt(TX.quita.instruccion)(item.a, item.d)}</p>${escena(numeroConFichas(item.d))}`;

// Solo divisiones exactas (Juan Luis, 2026-10-25): sin botón «Pablo se atasca». El caso en que
// falta un color se practica en el ejercicio 5.
function montarQuita(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoQuita(item, api)}<div id="fichas"></div>
    <div class="fp-acciones">
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>
    </div>`;
  const boton = contenedor.querySelector('#comprobar');
  const toca = fichasTocables(contenedor.querySelector('#fichas'), item.a, {
    clase: 'fp-quitando',
    alCambiar: () => { boton.disabled = nFichas(toca.seleccion()) === 0; },
  });
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const q = toca.seleccion();
    toca.bloquear();
    boton.hidden = true;
    const diag = diagnosticarQuita(item, { tipo: 'quita', q });
    terminar(api, diag, {
      respuesta: textoMonton(q),
      html: ({ tt }) => unir(
        tt(TX.quita.buena)(item.a, item.d),
        diag.acierto ? '' : tt(TX.quita.nota)(diag.error, item.a, item.d, diag.color),
      ),
    });
  });
}

// ─── Ejercicio 5: la regla ───────────────────────────────────────────────────────────

const enunciadoRegla = (item, { tt }) => `<p class="instruccion">${tt(TX.regla.pregunta)(item.a, item.d)}</p>${escena(numeroConFichas(item.a), numeroConFichas(item.d))}`;

function montarRegla(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoRegla(item, api)}<div id="paso"></div>`;
  const paso = contenedor.querySelector('#paso');
  const resumen = ({ tt }) => (item.divisible ? tt(TX.regla.buena)(item.a, item.d) : tt(TX.regla.buenaNo)(item.a, item.d, item.falta));

  const primero = elecciones(paso, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(dice) {
      if (api.respondido()) return;
      const diag = diagnosticarDivisible(item, dice);
      if (!diag.acierto) {
        primero.marcar([item.divisible ? 'si' : 'no'], dice);
        return terminar(api, diag, {
          respuesta: dice === 'si' ? api.t.si : api.t.no,
          html: ({ tt }) => unir(tt(TX.regla.nota)(diag.error, item.a, item.d, item.falta), resumen({ tt })),
        });
      }
      primero.marcar([dice], dice);
      segundo(dice);
    },
  });

  /** Segunda pregunta, solo si ha acertado la primera: el cociente o el color que falta. */
  function segundo(dice) {
    const caja = document.createElement('div');
    caja.className = 'fp-paso2';
    paso.append(caja);
    if (item.divisible) {
      caja.innerHTML = `<p class="instruccion">${tt(TX.regla.pideCociente)(item.a, item.d)}</p>`;
      const cocientes = elecciones(caja, {
        clase: 'elecciones elecciones--4 fp-opciones',
        opciones: item.opciones.map((m, i) => ({ valor: i, html: `<span class="fp-texto">${indice(m)}</span>` })),
        alElegir(i) {
          if (api.respondido()) return;
          cocientes.marcar([item.buena], i);
          const diag = diagnosticarCociente(item, i);
          terminar(api, diag, {
            respuesta: `${api.t.si}; ${textoMonton(item.opciones[i])}`,
            html: ({ tt }) => unir(diag.acierto ? '' : tt(TX.regla.notaCociente)(diag.error, item.a, item.d), resumen({ tt })),
          });
        },
      });
      return;
    }
    caja.innerHTML = `<p class="instruccion">${tt(TX.regla.pideColor)(item.a)}</p>`;
    const cs = elecciones(caja, {
      clase: `elecciones elecciones--${Math.min(4, Math.max(2, colores(item.d).length))} fp-opciones`,
      opciones: colores(item.d).map(p => ({ valor: p, html: fichaHtml(p) })),
      alElegir(p) {
        if (api.respondido()) return;
        cs.marcar([item.falta], p);
        const diag = diagnosticarColorFalta(item, p);
        terminar(api, diag, {
          respuesta: `${api.t.no}; ${p}`,
          html: ({ tt }) => unir(diag.acierto ? '' : tt(TX.regla.notaColor), resumen({ tt })),
        });
      },
    });
  }
}

// ─── Ejercicio 6: los divisores son elecciones ───────────────────────────────────────

const enunciadoDivisores = (item, { tt }) => `<p class="instruccion">${tt(TX.divisores.instruccion)(item.a)}</p>`;

/**
 * La tabla: una casilla por divisor, cada una con todas las fichas del número apagadas y, a la
 * derecha, el producto de las encendidas (1 al empezar). «Comprobar» marca en rojo las casillas que
 * repiten un divisor y dice cuántos faltan, sin decir cuáles; se puede volver a pulsar. `api.responder`
 * solo vale una vez por ítem: cada comprobación con fallos se cuenta y el ítem se cierra, con todos los
 * fallos (uno como fallo y el resto como `pistas`), al conseguir todos los divisores.
 */
function montarDivisores(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoDivisores(item, api)}
    <div class="fp-tabla" id="tabla"></div>
    <div id="aviso" class="fp-aviso" role="status" aria-live="polite"></div>
    <button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const tabla = contenedor.querySelector('#tabla'), aviso = contenedor.querySelector('#aviso'), boton = contenedor.querySelector('.comprobar');
  const casillas = Array.from({ length: item.n }, (_, i) => {
    const caja = document.createElement('div');
    caja.className = 'fp-casilla';
    caja.setAttribute('role', 'group');
    caja.setAttribute('aria-label', tt(TX.divisores.casilla)(i + 1));
    caja.innerHTML = '<div class="fp-casilla__fichas"></div><span class="fp-casilla__producto">1</span>';
    tabla.append(caja);
    const producto = caja.querySelector('.fp-casilla__producto');
    const toca = fichasTocables(caja.querySelector('.fp-casilla__fichas'), item.a, {
      clase: 'fp-casilla__tocables', clasesFicha: 'fp-ficha--mini',
      alCambiar: () => { producto.textContent = String(productoCasilla(toca.seleccion())); limpiarMarcas(); },
    });
    return { caja, toca };
  });
  const limpiarMarcas = () => casillas.forEach(c => c.caja.classList.remove('fp-casilla--repetida', 'fp-casilla--bien'));
  const estado = () => casillas.map(c => c.toca.seleccion());

  let fallidas = 0, primerError = null, ultimoEstado = null;
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const st = estado();
    const diag = diagnosticarTabla(item, st);
    if (!diag.ok) {
      fallidas++;
      primerError ??= diag.error;
      ultimoEstado = st;
      casillas.forEach((c, i) => c.caja.classList.toggle('fp-casilla--repetida', diag.repetidos.includes(diag.valores[i])));
      aviso.innerHTML = `<div class="aviso aviso--error">${tt(TX.divisores.parcial)(item.a, diag)}</div>`;
      return;
    }
    casillas.forEach(c => { c.toca.bloquear(); c.caja.classList.add('fp-casilla--bien'); });
    boton.hidden = true;
    aviso.innerHTML = '';
    const resumen = ({ tt }) => unir(fallidas ? tt(TX.divisores.fallos)(fallidas) : '', tt(TX.divisores.buena)(item.a));
    api.responder({
      acierto: fallidas === 0,
      pistas: Math.max(0, fallidas - 1),
      html: resumen,
      espera: 3500,
      ...(fallidas ? { error: primerError, respuesta: ultimoEstado.map(m => valor(m)).join(', ') } : {}),
    });
  });
}

// ─── Ejercicio 7: el m.c.d. ────────────────────────────────────────────────────────────

const enunciadoMcd = (item, { tt }) => `<p class="instruccion">${tt(TX.mcd.instruccion)(item.a, item.b)}</p>`;

/** El montón de b, con la pareja de cada ficha marcada de a: las `parejas[p]` primeras de cada color. */
function montonConParejas(b, parejas) {
  const grupos = colores(b).map(p => `<span class="fp-grupo">${
    Array.from({ length: exp(b, p) }, (_, i) => fichaHtml(p, { clases: i < (parejas[p] ?? 0) ? 'fp-pareja' : '' })).join('')
  }</span>`).join('');
  return `<span class="fp-monton">${grupos}</span>`;
}

function montarMcd(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoMcd(item, api)}
    <div class="fp-escena fp-dos">
      <div class="fp-numero"><span class="fp-valor">${valor(item.a)} = ${indice(item.a)}</span><div id="fichas"></div></div>
      <div class="fp-numero"><span class="fp-valor">${valor(item.b)} = ${indice(item.b)}</span><div id="donde-b"></div></div>
    </div>
    <div class="fp-acciones">
      <button type="button" class="comprobar" disabled>${api.t.comprobar}</button>
      <button type="button" class="fp-atasca" id="ninguna">${tt(TX.mcd.ninguna)}</button>
    </div>
    <div id="paso2"></div>`;
  const boton = contenedor.querySelector('.comprobar'), ninguna = contenedor.querySelector('#ninguna');
  const dibujaB = () => { contenedor.querySelector('#donde-b').innerHTML = montonConParejas(item.b, parejasEn(item.b, toca.seleccion())); };
  const toca = fichasTocables(contenedor.querySelector('#fichas'), item.a, {
    alCambiar: () => { boton.disabled = nFichas(toca.seleccion()) === 0; dibujaB(); },
  });
  dibujaB();

  const respuestaDe = diag => ({ tt }) => unir(tt(TX.mcd.buena)(item.a, item.b), diag.acierto ? '' : tt(TX.mcd.nota)(diag.error, item.a, item.b, diag.color));
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const sel = toca.seleccion();
    toca.bloquear();
    boton.hidden = true;
    ninguna.hidden = true;
    const diag = diagnosticarMcd(item, { tipo: 'marca', sel });
    terminar(api, diag, { respuesta: textoMonton(sel), html: respuestaDe(diag) });
  });
  ninguna.addEventListener('click', () => {
    if (api.respondido()) return;
    toca.bloquear();
    boton.hidden = true;
    ninguna.hidden = true;
    if (nFichas(comunes(item.a, item.b))) {
      // Sí hay parejas: el fallo es inmediato.
      const diag = diagnosticarMcd(item, { tipo: 'ninguna', mcd: null });
      return terminar(api, diag, { respuesta: tt(TX.mcd.ninguna), html: respuestaDe(diag) });
    }
    const caja = contenedor.querySelector('#paso2');
    caja.innerHTML = `<p class="instruccion">${tt(TX.mcd.pideMcd)}</p>`;
    const mcd = elecciones(caja, {
      clase: 'si-no',
      opciones: [{ valor: 1, html: '1' }, { valor: 0, html: '0' }],
      alElegir(v) {
        if (api.respondido()) return;
        mcd.marcar([1], v);
        const diag = diagnosticarMcd(item, { tipo: 'ninguna', mcd: v });
        terminar(api, diag, { respuesta: `${tt(TX.mcd.ninguna)}; ${v}`, html: respuestaDe(diag) });
      },
    });
  });
}

// ─── Ejercicio 8: el m.c.m. ────────────────────────────────────────────────────────────

const enunciadoMcm = (item, { tt }) => `<p class="instruccion">${tt(TX.mcm.instruccion)(item.a, item.b)}</p>${escena(numeroConFichas(item.a), numeroConFichas(item.b))}`;

function montarMcm(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoMcm(item, api)}
    <div id="controles"></div>
    <div id="vista"></div>
    <button type="button" class="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('.comprobar');
  const pintar = () => { contenedor.querySelector('#vista').innerHTML = vistaMonton(ctl.monton(), tt); };
  const ctl = controlesMonton(contenedor.querySelector('#controles'), { max: 8, tt, alCambiar: pintar });
  pintar();
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const st = ctl.monton();
    ctl.bloquear();
    boton.hidden = true;
    const diag = diagnosticarMcm(item, st);
    terminar(api, diag, {
      respuesta: textoMonton(st),
      html: ({ tt }) => unir(
        diag.acierto ? '' : tt(TX.mcm.tuyas)(st),
        diag.acierto ? '' : tt(TX.mcm.nota)(diag.error, item.a, item.b, diag.color),
        tt(TX.mcm.buena)(item.a, item.b),
      ),
    });
  });
}

// ─── La práctica ────────────────────────────────────────────────────────────────────────

arrancar({
  slug: 'fichas-de-pablo',
  ejercicios: [
    { nombre: TX.lee.nombre, detalle: TX.lee.detalle, introduccion: TX.lee.introduccion, generar: generarLee, montar: montarLee, enunciado: enunciadoLee },
    { nombre: TX.construye.nombre, detalle: TX.construye.detalle, introduccion: TX.construye.introduccion, generar: generarConstruye, montar: montarConstruye, enunciado: enunciadoConstruye },
    { nombre: TX.producto.nombre, detalle: TX.producto.detalle, introduccion: TX.producto.introduccion, generar: generarProducto, montar: montarProducto, enunciado: enunciadoProducto },
    { nombre: TX.quita.nombre, detalle: TX.quita.detalle, objetivo: 8, introduccion: TX.quita.introduccion, generar: generarQuita, montar: montarQuita, enunciado: enunciadoQuita },
    { nombre: TX.regla.nombre, detalle: TX.regla.detalle, introduccion: TX.regla.introduccion, generar: generarRegla, montar: montarRegla, enunciado: enunciadoRegla },
    { nombre: TX.divisores.nombre, detalle: TX.divisores.detalle, introduccion: TX.divisores.introduccion, generar: generarTablaDivisores, montar: montarDivisores, enunciado: enunciadoDivisores },
    { nombre: TX.mcd.nombre, detalle: TX.mcd.detalle, objetivo: 8, introduccion: TX.mcd.introduccion, generar: generarMcd, montar: montarMcd, enunciado: enunciadoMcd },
    { nombre: TX.mcm.nombre, detalle: TX.mcm.detalle, objetivo: 8, introduccion: TX.mcm.introduccion, generar: generarMcm, montar: montarMcm, enunciado: enunciadoMcm },
  ],
});
