// Coloca los paréntesis (repaso de la unidad 1). Interfaz de los cuatro ejercicios.
// Toda la aritmética está en logica.js; aquí solo hay pantalla.

import { arrancar } from '../_comun/base.js';
import { TX } from './textos.js';
import {
  generar, expresionDe, interpretar, evaluar, sinParentesis, textoArbol, textoColocacion,
  formatear, lineaHtml, textoPasos, textoOperacion, arbolQueDa, pistaPara,
} from './logica.js';

const MS_POR_LINEA = 400;
const MAX_SEGUIDOS = 2;

const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });
const hayAlgo = p => [...p.abre, ...p.cierra].some(k => k > 0);

/** El editor: números con un hueco «(» a la izquierda y un hueco «)» a la derecha. */
function crearEditor(contenedor, item, api, { alCambiar, activo }) {
  const { tt } = api;
  const n = item.numeros.length;
  const p = ceros(n);
  const caja = document.createElement('div');
  caja.className = 'expr';
  caja.setAttribute('role', 'group');
  const celdas = item.numeros.map((num, i) => `
    <span class="celda">
      <button type="button" class="hueco-p" data-i="${i}" data-lado="abre" aria-label="${tt(TX.hueco_abre)} ${num}"></button>
      <span class="num">${num}</span>
      <button type="button" class="hueco-p" data-i="${i}" data-lado="cierra" aria-label="${tt(TX.hueco_cierra)} ${num}"></button>
      ${i === n - 1 && item.exponente ? `<sup class="exp">${item.exponente}</sup>` : ''}
    </span>
    ${i < n - 1 ? `<span class="signo">${formatear(` ${item.operaciones[i]} `, api.idioma).trim()}</span>` : ''}`);
  caja.innerHTML = celdas.join('');
  contenedor.append(caja);
  const botones = [...caja.querySelectorAll('.hueco-p')];
  const boton = (i, lado) => botones.find(b => Number(b.dataset.i) === i && b.dataset.lado === lado);

  const pintar = (rojo = false, resaltar = null) => {
    botones.forEach(b => {
      const k = p[b.dataset.lado][Number(b.dataset.i)];
      b.textContent = (b.dataset.lado === 'abre' ? '(' : ')').repeat(k);
      b.classList.toggle('hueco-p--puesto', k > 0);
      b.classList.toggle('hueco-p--rojo', rojo && k > 0);
      b.classList.toggle('hueco-p--nuevo', resaltar !== null && resaltar.i === Number(b.dataset.i) && resaltar.lado === b.dataset.lado);
    });
  };
  pintar();

  botones.forEach(b => b.addEventListener('click', () => {
    if (!activo()) return;
    const i = Number(b.dataset.i), lado = b.dataset.lado;
    p[lado][i] = (p[lado][i] + 1) % (MAX_SEGUIDOS + 1);
    pintar();
    alCambiar();
  }));

  return {
    p,
    pintar,
    poner(nuevo, resaltar = null) {
      p.abre.splice(0, n, ...nuevo.abre);
      p.cierra.splice(0, n, ...nuevo.cierra);
      pintar(false, resaltar);
    },
    borrar() { this.poner(ceros(n)); },
    colocacion: () => ({ abre: [...p.abre], cierra: [...p.cierra] }),
    bloquear() { botones.forEach(b => { b.disabled = true; }); },
  };
}

/** Resumen de las agrupaciones: cada resultado con una forma de conseguirlo. */
function resumenHtml(item, api, formas) {
  const e = expresionDe(item);
  const filas = item.resultados.map(v => {
    const texto = formas?.get(v) ?? textoArbol(arbolQueDa(e, v));
    return `<li><span class="cuenta">${formatear(texto, api.idioma)} = ${v}</span></li>`;
  });
  return `<ul class="resumen">${filas.join('')}</ul>`;
}

// ─── Ejercicios 1 a 3: encontrar todos los resultados ─────────────────────────────

function montarTodos(contenedor, item, api) {
  const { tt } = api;
  const e = expresionDe(item);
  const total = item.resultados.length;

  // Ítem ya respondido (la traducción): solo se enseña la expresión y las agrupaciones.
  if (api.respondido()) {
    contenedor.innerHTML = `<div class="expr expr--fija">${formatear(textoArbol(sinParentesis(e)), api.idioma)}</div>
      <p class="instruccion">${tt(TX.todos_titulo)}</p>${resumenHtml(item, api, null)}`;
    return;
  }

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.instruccion_todos)}</p>`;
  const formas = new Map();            // valor → cómo lo ha conseguido el alumno
  const encontrados = new Set();
  let pistas = 0, ronda = 0, terminado = false;

  const editor = crearEditor(contenedor, item, api, { alCambiar: () => evaluarColocacion(), activo: () => !terminado });
  contenedor.insertAdjacentHTML('beforeend', `
    <div class="acciones">
      <button type="button" class="secundario" id="pista">${tt(TX.pista)}</button>
      <button type="button" class="secundario" id="borrar">${tt(TX.borrar)}</button>
    </div>
    <div class="resolucion" id="resolucion" aria-live="polite"></div>
    <p class="mensaje" id="mensaje" aria-live="polite"></p>
    <p class="contador-chips" id="contador-chips"></p>
    <div class="chips" id="chips"></div>`);
  const resolucion = contenedor.querySelector('#resolucion');
  const mensaje = contenedor.querySelector('#mensaje');
  const chips = contenedor.querySelector('#chips');
  const contador = contenedor.querySelector('#contador-chips');

  chips.innerHTML = item.resultados.map(v => `<span class="chip" data-v="${v}">${v}</span>`).join('');
  const encender = v => {
    encontrados.add(v);
    chips.querySelector(`[data-v="${v}"]`)?.classList.add('chip--on');
    contador.textContent = tt(TX.resultados)(encontrados.size, total);
  };
  formas.set(item.sinParentesis, textoArbol(sinParentesis(e)));
  encender(item.sinParentesis);

  function mostrarMensaje(texto, clase = '') {
    mensaje.className = `mensaje ${clase}`.trim();
    mensaje.innerHTML = texto;
  }

  function limpiarResolucion() {
    ronda++;
    resolucion.innerHTML = '';
    mostrarMensaje('');
  }

  /** Evalúa lo que hay puesto. `resaltado` (de una pista) es el hueco que acaba de cambiar. */
  function evaluarColocacion(resaltado = null) {
    limpiarResolucion();
    const colocada = editor.colocacion();
    const r = interpretar(e, colocada);
    if (r.error) {
      // con una pista a medias no se pone en rojo: es normal que falte el otro paréntesis
      editor.pintar(!resaltado && hayAlgo(colocada), resaltado);
      if (r.error === 'desequilibrados') mostrarMensaje(tt(TX.desequilibrados), 'mensaje--aviso');
      return;
    }
    editor.pintar(false, resaltado);
    const ev = evaluar(r.arbol);
    const miRonda = ronda;
    const lineas = ev.pasos;
    let k = 0;
    const siguienteLinea = () => {
      if (miRonda !== ronda || !contenedor.isConnected) return;
      const ultima = k === lineas.length - 1;
      const mala = ultima && ev.valor === undefined;
      resolucion.insertAdjacentHTML('beforeend',
        `<div class="paso${mala ? ' paso--mal' : ''}${ultima && !mala ? ' paso--final' : ''}">${k ? '= ' : ''}${lineaHtml(lineas[k], api.idioma)}</div>`);
      k++;
      if (!ultima) { setTimeout(siguienteLinea, MS_POR_LINEA); return; }
      terminarLineas();
    };
    const terminarLineas = () => {
      if (ev.valor === undefined) {
        const { razon, a, op, b } = ev.invalido;
        mostrarMensaje(tt(TX.imposible[razon])(textoOperacion(a, op, b, api.idioma)), 'mensaje--mal');
        return;
      }
      if (encontrados.has(ev.valor)) {
        mostrarMensaje(tt(r.redundantes ? TX.no_agrupan : TX.ya_lo_tenias), 'mensaje--neutro');
        return;
      }
      formas.set(ev.valor, textoColocacion(e, colocada));
      encender(ev.valor);
      mostrarMensaje(tt(TX.nuevo), 'mensaje--bien');
      if (encontrados.size === total) setTimeout(terminar, 900);
    };
    siguienteLinea();
  }

  function terminar() {
    if (terminado || api.respondido()) return;
    terminado = true;
    editor.bloquear();
    contenedor.querySelectorAll('.acciones button').forEach(b => { b.disabled = true; });
    api.responder({
      acierto: true,
      pistas,
      html: `${tt(TX.todos_titulo)}${resumenHtml(item, api, formas)}`,
      espera: 5000,
    });
  }

  contenedor.querySelector('#borrar').addEventListener('click', () => {
    if (terminado) return;
    editor.borrar();
    limpiarResolucion();
  });

  contenedor.querySelector('#pista').addEventListener('click', () => {
    if (terminado) return;
    const faltan = new Set(item.resultados.filter(v => !encontrados.has(v)));
    const sig = pistaPara(e, editor.colocacion(), faltan);
    if (!sig) return;
    pistas++;
    // el hueco que ha cambiado, para resaltarlo
    const antes = editor.colocacion();
    let cambiado = null;
    for (const lado of ['abre', 'cierra']) sig[lado].forEach((k, i) => { if (k !== antes[lado][i]) cambiado = { i, lado }; });
    editor.poner(sig, cambiado);
    evaluarColocacion(cambiado);
  });

  contador.textContent = tt(TX.resultados)(encontrados.size, total);
}

// ─── Ejercicio 4: una diana ─────────────────────────────────────────────────────────

function montarDiana(contenedor, item, api) {
  const { tt } = api;
  const e = expresionDe(item);
  const resuelto = api.respondido();

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.objetivo)}</p>
    <div class="objetivo">${item.objetivo}</div>`;
  if (resuelto) {
    contenedor.insertAdjacentHTML('beforeend', `<div class="expr expr--fija">${formatear(textoArbol(sinParentesis(e)), api.idioma)}</div>`);
    return;
  }
  const editor = crearEditor(contenedor, item, api, { alCambiar: () => { mensaje.innerHTML = ''; editor.pintar(); }, activo: () => !api.respondido() });
  contenedor.insertAdjacentHTML('beforeend', `
    <div class="acciones">
      <button type="button" class="secundario" id="borrar">${tt(TX.borrar)}</button>
    </div>
    <p class="mensaje mensaje--aviso" id="mensaje" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`);
  const mensaje = contenedor.querySelector('#mensaje');

  contenedor.querySelector('#borrar').addEventListener('click', () => {
    if (api.respondido()) return;
    editor.borrar();
    mensaje.innerHTML = '';
  });

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const colocada = editor.colocacion();
    const r = interpretar(e, colocada);
    if (r.error) {
      editor.pintar(true);
      mensaje.innerHTML = tt(TX.sin_cerrar);
      return;
    }
    editor.bloquear();
    contenedor.querySelectorAll('.acciones button').forEach(b => { b.disabled = true; });
    ev.target.hidden = true;
    const suyo = evaluar(r.arbol);
    const suyoTexto = `<p>${tt(TX.tu_agrupacion)} <span class="cuenta">${formatear(textoColocacion(e, colocada), api.idioma)}</span></p>
      <div class="resolucion resolucion--fija">${textoPasos(suyo.pasos, api.idioma)}</div>`;
    if (suyo.valor === item.objetivo) return api.responder({ acierto: true, html: suyoTexto, espera: 2600 });
    let diagnostico;
    if (suyo.valor === undefined) {
      const { razon, a, op, b } = suyo.invalido;
      diagnostico = `<p>${tt(TX.imposible[razon])(textoOperacion(a, op, b, api.idioma))}</p>`;
    } else diagnostico = `<p>${tt(TX.da)} <span class="cuenta">${suyo.valor}</span>, ${api.idioma === 'es' ? 'no' : 'not'} ${item.objetivo}.</p>`;
    const buena = arbolQueDa(e, item.objetivo);
    const solucion = evaluar(buena);
    api.responder({
      acierto: false,
      html: `${suyoTexto}${diagnostico}<p>${tt(TX.una_que_da)(item.objetivo)} <span class="cuenta">${formatear(textoArbol(buena), api.idioma)}</span></p>
        <div class="resolucion resolucion--fija">${textoPasos(solucion.pasos, api.idioma)}</div>`,
    });
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────

const EJERCICIOS = TX.ejercicios.map((x, i) => ({
  nombre: x.nombre,
  detalle: x.detalle,
  introduccion: x.introduccion,
  // En los tres primeros no hay fallos: solo cuentan las pistas (cinco expresiones).
  ...(i < 3 ? { objetivo: 5, penalizacion: 0 } : {}),
  generar: rng => generar(i + 1, rng),
  montar: i < 3 ? montarTodos : montarDiana,
}));

arrancar({ slug: 'parentesis', ejercicios: EJERCICIOS });
