// Reloj de coincidencias: tres ejercicios sobre el m.c.m. como momento en que
// dos (o tres) ritmos vuelven a coincidir. Ver ../_comun/base.js para el
// contrato de `arrancar` y ../plantilla/practica.js para el patrón comentado.

import { arrancar } from '../_comun/base.js';
import { pasos } from '../_comun/piezas.js';
import { TX, horaTexto } from './textos.js';
import {
  generarLinea, comprobarLinea,
  generarHora, comprobarHora, sumarMinutos,
  generarTresOMultiplo, comprobarTresOMultiplo,
} from './logica.js';

// ─── Ejercicio 1: predice la coincidencia (línea de tiempo tocable) ──────────

function filaRejilla(contenedor, desde, hasta) {
  const fila = document.createElement('div');
  fila.className = 'rejilla';
  fila.style.setProperty('--columnas', hasta - desde + 1);
  for (let s = desde; s <= hasta; s++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'rejilla__celda';
    boton.textContent = s % 5 === 0 ? String(s) : '';
    boton.dataset.segundo = String(s);
    boton.setAttribute('aria-label', String(s));
    fila.append(boton);
  }
  contenedor.append(fila);
  return fila;
}

function montarLinea(contenedor, item, api) {
  const { tt } = api;
  const x = TX.linea;
  contenedor.innerHTML = `<p class="instruccion">${tt(x.pregunta(...item.periodos))}</p>`;
  const caja = document.createElement('div');
  caja.className = 'reloj-linea';
  contenedor.append(caja);
  filaRejilla(caja, 0, 30);
  filaRejilla(caja, 31, 60);
  const celdas = [...caja.querySelectorAll('.rejilla__celda')];
  const celda = s => celdas[s];

  let animando = null;
  function cancelarAnimacion() {
    if (animando) cancelAnimationFrame(animando);
    animando = null;
  }

  function multiplos(periodo, limite) {
    const lista = [];
    for (let n = periodo; n <= limite; n += periodo) lista.push(n);
    return lista;
  }

  function animar() {
    const inicio = performance.now();
    const duracion = 3000;
    const [a, b] = item.periodos;
    function paso(ahora) {
      if (!contenedor.isConnected) { animando = null; return; }
      const t = Math.min(1, (ahora - inicio) / duracion);
      const segundo = Math.round(t * 60);
      celdas.forEach((c, s) => {
        c.classList.remove('rejilla__celda--azul', 'rejilla__celda--naranja', 'rejilla__celda--ambas');
        if (s > segundo || s === 0) return;
        const esA = s % a === 0, esB = s % b === 0;
        if (esA && esB) c.classList.add('rejilla__celda--ambas');
        else if (esA) c.classList.add('rejilla__celda--azul');
        else if (esB) c.classList.add('rejilla__celda--naranja');
      });
      if (t < 1) animando = requestAnimationFrame(paso);
      else animando = null;
    }
    animando = requestAnimationFrame(paso);
  }

  celdas.forEach(boton => boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const segundo = Number(boton.dataset.segundo);
    const acierto = comprobarLinea(item, segundo);
    cancelarAnimacion();
    celdas.forEach(c => { c.disabled = true; });
    celda(item.solucion).classList.add('rejilla__celda--bien');
    if (!acierto) boton.classList.add('rejilla__celda--mal');
    animar();
    const [a, b] = item.periodos;
    const listaA = multiplos(a, 60), listaB = multiplos(b, 60);
    const html = `${tt(x.lista(tt(x.azul), listaA))}; ${tt(x.lista(tt(x.naranja), listaB))}; ${tt(x.primera_vez(item.solucion))}.`;
    api.responder({ acierto, html, espera: 3200 });
  }));
}

// ─── Ejercicio 2: la hora de reloj (steppers de horas y minutos de 5 en 5) ───

function montarHora(contenedor, item, api) {
  const { tt } = api;
  const x = TX.hora;
  const [a, b] = item.periodos;
  contenedor.innerHTML = `<p class="instruccion">${tt(x.pregunta(a, b, item.inicio.h, item.inicio.m))}</p>`;
  const caja = document.createElement('div');
  caja.className = 'reloj-hora';
  contenedor.append(caja);

  const horas = pasos(caja, { valor: item.inicio.h, min: 0, max: 23, nombre: tt(x.horas), pinta: v => String(v).padStart(2, '0') });
  const separador = document.createElement('span');
  separador.className = 'reloj-separador';
  separador.textContent = ':';
  caja.append(separador);
  const minutos = pasos(caja, { valor: 0, min: 0, max: 11, nombre: tt(x.minutos), pinta: v => String(v * 5).padStart(2, '0') });

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'comprobar';
  boton.textContent = api.t.comprobar;
  contenedor.append(boton);

  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const h = horas.valor(), m = minutos.valor() * 5;
    const acierto = comprobarHora(item, h, m);
    horas.bloquear();
    minutos.bloquear();
    boton.hidden = true;

    const hExtra = Math.floor(item.solucion / 60), mExtra = item.solucion % 60;
    const intermedia = sumarMinutos(item.inicio.h, item.inicio.m, hExtra * 60);
    const descomposicion = tt(x.descomposicion(item.solucion, hExtra, mExtra, item.inicio, intermedia, item.horaSolucion));
    const correcta = `<span class="cuenta">${horaTexto(item.horaSolucion.h, item.horaSolucion.m)}</span>`;
    let html;
    if (acierto) {
      html = `${correcta}. ${descomposicion}`;
    } else {
      const esErrorTipico = item.errorTipico && h === item.errorTipico.h && m === item.errorTipico.m;
      const aviso = esErrorTipico ? ` ${tt(x.aviso_100)}` : '';
      html = `${correcta}.${aviso} ${descomposicion}`;
    }
    api.responder({ acierto, html, espera: 2600 });
  });
}

// ─── Ejercicio 3: tres datos pequeños, o uno múltiplo del otro ──────────────

function montarTres(contenedor, item, api) {
  const { tt } = api;
  const x = TX.tres;
  const pregunta = item.tipo === 'tres' ? tt(x.pregunta_tres(...item.periodos)) : tt(x.pregunta_multiplo(...item.periodos));
  contenedor.innerHTML = `
    <p class="instruccion">${pregunta}</p>
    <label class="instruccion" for="reloj-respuesta">${tt(x.respuesta_label)}</label>
    <input type="number" inputmode="numeric" id="reloj-respuesta" class="reloj-entero" autocomplete="off">
    <button type="button" class="comprobar" id="reloj-comprobar">${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('#reloj-respuesta');
  const boton = contenedor.querySelector('#reloj-comprobar');

  function comprobar() {
    if (api.respondido()) return;
    const respuesta = Number(campo.value);
    const acierto = comprobarTresOMultiplo(item, respuesta);
    campo.disabled = true;
    boton.hidden = true;
    const correcta = `<span class="cuenta">${item.solucion}</span>`;
    let html = `${correcta}.`;
    if (item.tipo === 'multiplo') {
      const [p1, p2] = item.periodos;
      const menor = Math.min(p1, p2), mayor = Math.max(p1, p2);
      html += ` ${tt(x.pista_multiplo(menor, mayor))}`;
    }
    api.responder({ acierto, html, espera: 2200 });
  }

  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); });
}

// ─── La práctica ──────────────────────────────────────────────────────────────

arrancar({
  slug: 'reloj',
  ejercicios: [
    {
      nombre: TX.linea.nombre,
      detalle: TX.linea.detalle,
      generar: generarLinea,
      montar: montarLinea,
    },
    {
      nombre: TX.hora.nombre,
      detalle: TX.hora.detalle,
      generar: generarHora,
      montar: montarHora,
    },
    {
      nombre: TX.tres.nombre,
      detalle: TX.tres.detalle,
      generar: generarTresOMultiplo,
      montar: montarTres,
    },
  ],
});
