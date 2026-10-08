// PRÁCTICA «Divisores por parejas con rectángulos» — buscar divisores de n es
// buscar rectángulos de área n con lados enteros: salen por parejas y se para
// en la raíz entera.
//
// Reparto de ficheros: logica.js (puro), textos.js, practica.js (interfaz),
// estilos.css (vacío: todo lo necesario ya está en ../_comun/estilos.css).

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarRectangulos, parPara, clavePar, todasLasClaves, sonTodasLasParejas, raizEntera,
  generarBanco, generarParte3,
} from './logica.js';

// ─── Ejercicio 1: descubre los rectángulos ─────────────────────────────────────

function pintarLista(lista, encontrados, tt) {
  if (!encontrados.length) {
    lista.textContent = '';
    return;
  }
  const texto = encontrados.map(c => { const [a, b] = c.split('x').map(Number); return `${a} · ${b}`; }).join(', ');
  lista.innerHTML = `<strong>${tt(TX.rect.encontradas)}:</strong> ${texto}`;
}

function montarRectangulos(contenedor, item, api) {
  const { tt } = api;
  const n = item.n;
  const r = raizEntera(n);
  const anchoMaximo = Math.min(n, r + 3);
  let encontrados = [];
  let anchoExplorado = 1;

  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.rect.instruccion)(n)}</p>
    <div id="control"></div>
    <div id="rejilla" class="rejilla"></div>
    <p id="mensaje" class="aviso"></p>
    <p id="lista" class="frase"></p>
    <button type="button" class="comprobar" id="todas">${tt(TX.rect.ya_todas)}</button>`;

  const controlDiv = contenedor.querySelector('#control');
  const rejillaDiv = contenedor.querySelector('#rejilla');
  const mensaje = contenedor.querySelector('#mensaje');
  const lista = contenedor.querySelector('#lista');
  const botonTodas = contenedor.querySelector('#todas');

  function pintarAncho(w) {
    anchoExplorado = Math.max(anchoExplorado, w);
    const filas = Math.ceil(n / w);
    const total = filas * w;
    rejillaDiv.style.setProperty('--columnas', String(w));
    rejillaDiv.innerHTML = Array.from({ length: total }, (_, i) =>
      `<div class="rejilla__celda${i >= n ? ' rejilla__celda--tachada' : ''}"></div>`).join('');
    const par = parPara(w, n);
    if (par) {
      const clave = clavePar(par);
      if (!encontrados.includes(clave)) encontrados.push(clave);
      mensaje.textContent = '';
    } else {
      mensaje.textContent = tt(TX.rect.sobran)(w, total - n, n);
    }
    pintarLista(lista, encontrados, tt);
  }

  const control = pasos(controlDiv, {
    valor: 1, min: 1, max: anchoMaximo,
    nombre: tt(TX.rect.ancho),
    pinta: w => String(w),
    alCambiar: pintarAncho,
  });
  pintarAncho(1);

  botonTodas.addEventListener('click', () => {
    if (api.respondido()) return;
    control.bloquear();
    botonTodas.disabled = true;
    const correctas = todasLasClaves(n);
    const faltan = correctas.filter(c => !encontrados.includes(c));
    const acierto = faltan.length === 0;
    let html;
    if (acierto) {
      html = tt(TX.rect.correcto)(n);
    } else {
      const partes = [`<strong>${tt(TX.rect.faltan)}</strong> ${faltan.map(c => { const [a, b] = c.split('x').map(Number); return `${a} · ${b}`; }).join(', ')}.`];
      if (faltan.includes(clavePar([1, n]))) partes.push(tt(TX.rect.el_uno_y_el_propio));
      if (anchoExplorado < r) partes.push(tt(TX.rect.se_para_en)(r, n));
      html = partes.join(' ');
    }
    api.responder({ acierto, html, espera: 2600 });
  });
}

// ─── Ejercicio 2: sin dibujo, las parejas ──────────────────────────────────────

function montarBanco(contenedor, item, api) {
  const { tt } = api;
  const n = item.n;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.banco.instruccion)(n)}</p>
    <div class="botones-numeros" id="banco"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;

  const caja = contenedor.querySelector('#banco');
  const elegidos = new Set();
  const botones = item.banco.map(x => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = String(x);
    boton.setAttribute('aria-pressed', 'false');
    boton.addEventListener('click', () => {
      if (api.respondido()) return;
      const activo = boton.getAttribute('aria-pressed') === 'true';
      boton.setAttribute('aria-pressed', String(!activo));
      boton.classList.toggle('elegido', !activo);
      if (activo) elegidos.delete(x); else elegidos.add(x);
    });
    caja.append(boton);
    return { x, boton };
  });

  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    botones.forEach(({ x, boton }) => {
      boton.disabled = true;
      if (n % x === 0) boton.classList.add('bien');
      else if (elegidos.has(x)) boton.classList.add('mal');
    });
    const faltan = item.divisoresN.filter(d => !elegidos.has(d));
    const sobran = [...elegidos].filter(x => n % x !== 0);
    const acierto = faltan.length === 0 && sobran.length === 0;
    let html;
    if (acierto) {
      html = tt(TX.banco.acierto)(n);
    } else {
      const frases = [];
      faltan.forEach(d => frases.push(tt(TX.banco.falta)(d)));
      if (faltan.some(d => d === 1 || d === n)) frases.push(tt(TX.banco.el_uno_y_el_propio));
      sobran.forEach(x => {
        const cociente = Math.floor(n / x), resto = n % x;
        frases.push(tt(TX.banco.division_resto)(n, x, cociente, resto));
      });
      html = frases.join('<br>');
    }
    api.responder({ acierto, html, espera: 2600 });
  });
}

// ─── Ejercicio 3: ¿dónde se para? ───────────────────────────────────────────────

function montarParar(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.parar.pregunta)(item.n)}</p>
    <div class="operacion">${item.n}</div>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(valor => ({ valor, html: String(valor) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const acierto = valor === item.solucion;
      const html = acierto
        ? tt(TX.parar.correcto)(item.solucion, item.n)
        : tt(TX.parar.incorrecto)(valor, item.solucion, item.n);
      api.responder({ acierto, html, espera: 2200 });
    },
  });
}

function montarCuadrado(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.cuadrado.pregunta)(item.n, item.r)}</p>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(valor => ({ valor, html: String(valor) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const acierto = valor === item.solucion;
      const html = acierto
        ? tt(TX.cuadrado.correcto)(item.n, item.r)
        : tt(TX.cuadrado.incorrecto)(item.n, item.r);
      api.responder({ acierto, html, espera: 2200 });
    },
  });
}

function montarParte3(contenedor, item, api) {
  if (item.tipo === 'cuadrado') return montarCuadrado(contenedor, item, api);
  return montarParar(contenedor, item, api);
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'rectangulos',
  ejercicios: [
    {
      nombre: TX.rect.nombre,
      detalle: TX.rect.detalle,
      introduccion: TX.rect.introduccion,
      generar: generarRectangulos,
      clave: item => String(item.n),
      montar: montarRectangulos,
    },
    {
      nombre: TX.banco.nombre,
      detalle: TX.banco.detalle,
      generar: generarBanco,
      clave: item => String(item.n),
      montar: montarBanco,
    },
    {
      nombre: TX.parar.nombre,
      detalle: TX.parar.detalle,
      generar: generarParte3,
      montar: montarParte3,
    },
  ],
});
