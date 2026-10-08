// Práctica «El exponente y su base» — ver el contrato en ../plantilla/practica.js.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarAlcance, aciertaAlcance, idBaseDe, valorParte, valorErroneoParte,
  generarMultiplicacion, secuenciaCorrecta, aciertaRepetida, aciertaPotencia,
  generarAreas, respuestasAreas, aciertaAreas, cuentaParte, cuentaErronea, cuentaTocada, lecturaIngles,
} from './logica.js';

// ─── Ejercicio 1: ¿a qué afecta el exponente? ──────────────────────────────────

function chip(id, valor) {
  return `<span class="exp-chip exp-click" data-id="${id}">${valor}</span>`;
}

function renderParte(p, i, activa) {
  const sup = `<sup class="exp-sup${activa ? ' exp-sup-activa' : ''}">${p.e}</sup>`;
  let cuerpo;
  if (p.forma === 'simple') cuerpo = `${chip('a', p.a)} · ${chip('b', p.b)}${sup}`;
  else if (p.forma === 'suma') cuerpo = `${chip('a', p.a)} + ${chip('b', p.b)}${sup}`;
  else if (p.forma === 'grupo') cuerpo = `<span class="exp-grupo exp-click" data-id="grupo">(${p.a} · ${chip('b', p.b)})</span>${sup}`;
  else if (p.forma === 'sumagrupo') cuerpo = `<span class="exp-grupo exp-click" data-id="grupo">(${p.a} + ${chip('b', p.b)})</span>${sup}`;
  else cuerpo = `${chip('a', p.a)} · <span class="exp-grupo exp-click" data-id="grupo">(${p.b} + ${chip('c', p.c)})</span>${sup}`;
  return `<span class="exp-parte" data-parte="${i}">${cuerpo}</span>`;
}

function montarAlcance(contenedor, item, api) {
  const { tt } = api;
  const dos = item.partes.length === 2;
  const html = item.partes.map((p, i) => renderParte(p, i, i === item.preguntada)).join(' <span class="exp-op">+</span> ');
  contenedor.innerHTML = `
    <p class="instruccion">${dos ? tt(TX.alcance.instruccion_dos) : tt(TX.alcance.instruccion_una)}</p>
    <div class="operacion exp-expresion">${html}</div>`;
  const activaRoot = contenedor.querySelector(`[data-parte="${item.preguntada}"]`);
  const parte = item.partes[item.preguntada];
  const correctaId = idBaseDe(parte.forma);
  let resuelto = false;
  activaRoot.querySelectorAll('.exp-click').forEach(el => {
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      if (api.respondido() || resuelto) return;
      resuelto = true;
      const id = el.dataset.id;
      const acierto = aciertaAlcance(item, id);
      activaRoot.querySelectorAll('.exp-click').forEach(x => {
        x.style.pointerEvents = 'none';
        if (x.dataset.id === id) x.classList.add(acierto ? 'exp-click--bien' : 'exp-click--mal');
        else if (x.dataset.id === correctaId) x.classList.add('exp-click--correcta');
      });
      const correcta = cuentaParte(parte);
      // «Si afectara a otra parte» (acierto) es el error típico; «lo que has tocado daría» (fallo) es la región tocada.
      const html2 = acierto ? tt(TX.alcance.bien)(correcta, cuentaErronea(parte)) : tt(TX.alcance.mal)(correcta, cuentaTocada(parte, id));
      api.responder({ acierto, html: html2, espera: 1800 });
    });
  });
}

// ─── Ejercicio 2: multiplicación repetida (tres subtipos) ──────────────────────

function montarRepetida(contenedor, item, api) {
  const { tt, t } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.repetida.instruccion_construir)(item.base, item.exponente)}</p>
    <p class="pequeno">${item.base}<sup>${item.exponente}</sup> = ${lecturaIngles(item.base, item.exponente)}</p>
    <div class="frase" id="secuencia"></div>
    <div class="banco" id="banco"></div>
    <button type="button" class="comprobar" id="comprobar">${t.comprobar}</button>`;
  const secuenciaEl = contenedor.querySelector('#secuencia');
  const bancoEl = contenedor.querySelector('#banco');
  const usados = [];
  const disponibles = new Set(item.fichas.map(f => f.id));

  function pintar() {
    secuenciaEl.innerHTML = usados.length
      ? usados.map(id => `<button type="button" class="ficha" data-id="${id}" data-rol="secuencia">${item.fichas.find(f => f.id === id).valor}</button>`).join('')
      : `<span class="pequeno">${tt(TX.repetida.instruccion_deshacer)}</span>`;
    bancoEl.innerHTML = item.fichas
      .filter(f => disponibles.has(f.id))
      .map(f => `<button type="button" class="ficha" data-id="${f.id}" data-rol="banco">${f.valor}</button>`).join('');
    secuenciaEl.querySelectorAll('[data-rol="secuencia"]').forEach(b => b.addEventListener('click', () => {
      if (api.respondido()) return;
      const id = Number(b.dataset.id);
      usados.splice(usados.indexOf(id), 1);
      disponibles.add(id);
      pintar();
    }));
    bancoEl.querySelectorAll('[data-rol="banco"]').forEach(b => b.addEventListener('click', () => {
      if (api.respondido()) return;
      const id = Number(b.dataset.id);
      disponibles.delete(id);
      usados.push(id);
      pintar();
    }));
  }
  pintar();

  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const valores = usados.map(id => item.fichas.find(f => f.id === id).valor);
    const acierto = aciertaRepetida(item, valores);
    contenedor.querySelectorAll('.ficha').forEach(b => { b.disabled = true; });
    const p = secuenciaCorrecta(item).join(' ');
    const html = acierto ? tt(TX.repetida.bien)(item.base, item.exponente, p) : tt(TX.repetida.mal)(p, item.base, item.exponente);
    api.responder({ acierto, html, espera: 1600 });
  });
}

function montarPotencia(contenedor, item, api) {
  const { tt, t } = api;
  const prod = Array(item.exponente).fill(item.base).join(' · ');
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.potencia.instruccion)}</p>
    <div class="operacion">${prod}</div>
    <div class="operacion" id="vista"></div>
    <div class="grupo-pasos" id="pasos"></div>
    <button type="button" class="comprobar" id="comprobar">${t.comprobar}</button>`;
  const vista = contenedor.querySelector('#vista');
  function pintarVista() { vista.innerHTML = `${basePaso.valor()}<sup>${expPaso.valor()}</sup>`; }
  const basePaso = pasos(contenedor.querySelector('#pasos'), { valor: 2, min: 2, max: 9, nombre: tt(TX.potencia.base), alCambiar: pintarVista });
  const expPaso = pasos(contenedor.querySelector('#pasos'), { valor: 2, min: 2, max: 4, nombre: tt(TX.potencia.exponente), alCambiar: pintarVista });
  pintarVista();
  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const b = basePaso.valor(), e = expPaso.valor();
    basePaso.bloquear();
    expPaso.bloquear();
    const acierto = aciertaPotencia(item, b, e);
    const html = acierto ? tt(TX.potencia.bien)(item.base, item.exponente, prod) : tt(TX.potencia.mal)(item.base, item.exponente, prod, b, e);
    api.responder({ acierto, html, espera: 1600 });
  });
}

function montarValor(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.valor.pregunta)(item.base, item.exponente)}</p>
    <p class="pequeno">${item.base}<sup>${item.exponente}</sup> = ${lecturaIngles(item.base, item.exponente)}</p>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(v => ({ valor: v, html: String(v) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.correcta], valor);
      const acierto = valor === item.correcta;
      const html = acierto ? tt(TX.valor.bien)(item.base, item.exponente, item.correcta) : tt(TX.valor.mal)(item.base, item.exponente, item.correcta, valor);
      api.responder({ acierto, html, espera: 1600 });
    },
  });
}

function montarMultiplicacion(contenedor, item, api) {
  if (item.tipo === 'repetida') montarRepetida(contenedor, item, api);
  else if (item.tipo === 'potencia') montarPotencia(contenedor, item, api);
  else montarValor(contenedor, item, api);
}

// ─── Ejercicio 3: el cuadrado de la suma, con áreas ────────────────────────────

function svgAreas(a, b, etiqueta) {
  const lado = a + b;
  const colorA = '#bfdbfe', colorB = '#fde68a', colorAB = '#bbf7d0', trazo = '#1d4ed8';
  const lineas = [];
  for (let i = 1; i < lado; i++) {
    lineas.push(`<line x1="${i}" y1="0" x2="${i}" y2="${lado}" stroke="#e2e8f0" stroke-width="0.03"/>`);
    lineas.push(`<line x1="0" y1="${i}" x2="${lado}" y2="${i}" stroke="#e2e8f0" stroke-width="0.03"/>`);
  }
  const txt = (x, y, valor) => `<text x="${x}" y="${y}" font-size="0.4" text-anchor="middle" dominant-baseline="middle" fill="#1e293b" font-weight="700">${valor}</text>`;
  return `
    <svg viewBox="0 0 ${lado} ${lado}" class="exp-areas-svg" role="img" aria-label="${etiqueta}">
      <rect x="0" y="0" width="${a}" height="${a}" fill="${colorA}" stroke="${trazo}" stroke-width="0.04"/>
      <rect x="${a}" y="0" width="${b}" height="${a}" fill="${colorAB}" stroke="${trazo}" stroke-width="0.04"/>
      <rect x="0" y="${a}" width="${a}" height="${b}" fill="${colorAB}" stroke="${trazo}" stroke-width="0.04"/>
      <rect x="${a}" y="${a}" width="${b}" height="${b}" fill="${colorB}" stroke="${trazo}" stroke-width="0.04"/>
      ${lineas.join('')}
      ${txt(a / 2, a / 2, a * a)}
      ${txt(a + b / 2, a / 2, a * b)}
      ${txt(a / 2, a + b / 2, a * b)}
      ${txt(a + b / 2, a + b / 2, b * b)}
    </svg>`;
}

/** Teclado numérico propio (sin entrada nativa): dígitos, borrar y aceptar. */
function crearTeclado(contenedor, { onAceptar }) {
  const caja = document.createElement('div');
  caja.innerHTML = `
    <div class="operacion" id="pantalla">0</div>
    <div class="botones-numeros" id="digitos"></div>`;
  contenedor.append(caja);
  const pantalla = caja.querySelector('#pantalla');
  const digitosEl = caja.querySelector('#digitos');
  let texto = '';
  function pintar() { pantalla.textContent = texto || '0'; }
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '←', 'OK'];
  digitosEl.innerHTML = teclas.map(k => `<button type="button" data-k="${k}">${k}</button>`).join('');
  digitosEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k;
    if (k === '←') { texto = texto.slice(0, -1); pintar(); return; }
    if (k === 'OK') { digitosEl.querySelectorAll('button').forEach(x => { x.disabled = true; }); onAceptar(Number(texto || '0')); return; }
    if (texto.length < 5) texto += k;
    pintar();
  }));
}

function montarAreas(contenedor, item, api) {
  const { tt } = api;
  const lado = item.a + item.b;
  // La variante (a · b)² no tiene que ver con un cuadrado de lado a + b: va sin dibujo.
  contenedor.innerHTML = `
    <p class="instruccion">${item.variante ? tt(TX.areas.instruccion_prod)(item.a, item.b) : tt(TX.areas.instruccion)(item.a, item.b)}</p>
    <div id="dibujo"></div>
    <div id="pasos"></div>
    <div id="preguntas"></div>`;
  if (!item.variante) {
    const dibujo = contenedor.querySelector('#dibujo');
    const pintarDibujo = split => { dibujo.innerHTML = svgAreas(split, lado - split, tt(TX.areas.aria_cuadrado)(lado)); };
    pintarDibujo(item.a);
    pasos(contenedor.querySelector('#pasos'), {
      valor: item.a, min: 1, max: lado - 1, nombre: 'a',
      pinta: v => `${v} / ${lado - v}`,
      alCambiar: pintarDibujo,
    });
  }

  const preguntasEl = contenedor.querySelector('#preguntas');
  let respuesta1 = null;
  const { pregunta1, pregunta2 } = respuestasAreas(item);

  function preguntaUno() {
    preguntasEl.innerHTML = `<p class="instruccion">${item.variante ? tt(TX.areas.pregunta1_prod)(item.a, item.b) : tt(TX.areas.pregunta1_suma)(item.a, item.b)}</p>`;
    crearTeclado(preguntasEl, {
      onAceptar(valor) {
        if (api.respondido()) return;
        respuesta1 = valor;
        preguntaDos();
      },
    });
  }
  function preguntaDos() {
    preguntasEl.innerHTML = `<p class="instruccion">${item.variante ? tt(TX.areas.pregunta2_prod)(item.a, item.b) : tt(TX.areas.pregunta2_suma)(item.a, item.b)}</p>`;
    crearTeclado(preguntasEl, {
      onAceptar(valor) {
        if (api.respondido()) return;
        const acierto = aciertaAreas(item, respuesta1, valor);
        const html = acierto
          ? (item.variante ? tt(TX.areas.bien_prod)(item.a, item.b) : tt(TX.areas.bien_suma)(item.a, item.b, item.a * item.b))
          : (item.variante ? tt(TX.areas.mal)(pregunta1, pregunta2) : tt(TX.areas.mal_suma)(item.a, item.b, pregunta1, pregunta2));
        api.responder({ acierto, html, espera: 2200 });
      },
    });
  }
  preguntaUno();
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'exponente',
  ejercicios: [
    {
      nombre: TX.alcance.nombre,
      detalle: TX.alcance.detalle,
      generar: generarAlcance,
      montar: montarAlcance,
    },
    {
      nombre: TX.repetida.nombre,
      detalle: TX.repetida.detalle,
      generar: generarMultiplicacion,
      montar: montarMultiplicacion,
    },
    {
      nombre: TX.areas.nombre,
      detalle: TX.areas.detalle,
      generar: generarAreas,
      montar: montarAreas,
    },
  ],
});
