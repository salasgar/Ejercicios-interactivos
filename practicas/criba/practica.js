// Práctica «Criba de Eratóstenes y flashcards» — ver el contrato en
// ../plantilla/practica.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { factorizar, criterio, CRITERIOS } from '../_comun/aritmetica.js';
import { unir } from '../_comun/textos.js';
import { TX } from './textos.js';
import {
  generarCriba, aciertaTachar, PRIMOS_HASTA_100,
  generarFlashcard, claseDe, primosAProbar,
  generarRaiz, datosExplicacionRaiz,
} from './logica.js';

const PRIMOS_HASTA_100_SET = new Set(PRIMOS_HASTA_100);

/** Texto común a los ejercicios 2 y 3: por qué un número es primo o compuesto. */
function explicarClase(n, clase, api) {
  const { tt } = api;
  if (clase === 'ninguno') return tt(TX.flash.uno);
  if (clase === 'compuesto') {
    const p = factorizar(n)[0][0];
    const cuenta = `<span class="cuenta">${n} = ${p} · ${n / p}</span>`;
    const pista = CRITERIOS.includes(p) ? ` ${api.t.fijate} ${tt(criterio(n, p).razon)}.` : '';
    return `${tt(TX.flash.es_compuesto)(n)}: ${cuenta}.${pista}`;
  }
  if (n === 2) return tt(TX.flash.dos);
  const { probados, siguiente } = primosAProbar(n);
  if (!probados.length) return `${tt(TX.flash.es_primo)(n)}: ${tt(TX.flash.solo_dos)(n)}.`;
  const lista = unir(probados.map(String), api.idioma);
  return `${tt(TX.flash.es_primo)(n)}: ${tt(TX.flash.no_divisible)(lista)}, ${tt(TX.flash.se_pasa)(n, siguiente)}.`;
}

// ─── Ejercicio 1: la criba, paso a paso ─────────────────────────────────────────

function htmlCribaFinal() {
  let celdas = '';
  for (let n = 1; n <= 100; n++) {
    let clase = 'rejilla__celda';
    if (n === 1) clase += ' rejilla__celda--fija';
    else if (PRIMOS_HASTA_100_SET.has(n)) clase += ' rejilla__celda--bien';
    else clase += ' rejilla__celda--tachada';
    celdas += `<span class="${clase}">${n}</span>`;
  }
  return `<div class="rejilla" style="--columnas:10">${celdas}</div>`;
}

function explicacionTachar(item, seleccionadas, api) {
  const { tt } = api;
  const objetivo = new Set(item.objetivo);
  if (aciertaTachar(item, [...seleccionadas])) return tt(TX.criba.bien)(item.primo);
  const faltan = item.objetivo.filter(n => !seleccionadas.has(n)).length;
  const sobran = [...seleccionadas].filter(n => !objetivo.has(n)).length;
  const partes = [];
  if (faltan) partes.push(tt(TX.criba.mal_faltan)(faltan));
  if (sobran) partes.push(tt(TX.criba.mal_sobran)(sobran));
  return `${unir(partes, api.idioma)}.`;
}

function montarTachar(contenedor, item, api) {
  const { tt, t } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.criba.tachar)(item.primo)}</p>
    <div class="rejilla" id="rejilla" style="--columnas:10"></div>
    <button type="button" class="comprobar" id="comprobar">${t.comprobar}</button>`;
  const rejilla = contenedor.querySelector('#rejilla');
  const yaTachadas = new Set(item.yaTachadas);
  const objetivo = new Set(item.objetivo);
  const seleccionadas = new Set();

  for (let n = 1; n <= 100; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rejilla__celda';
    b.dataset.n = String(n);
    b.textContent = String(n);
    if (n === 1) {
      b.classList.add('rejilla__celda--fija');
      b.disabled = true;
      b.setAttribute('aria-label', tt(TX.criba.ni_primo_ni_compuesto));
    } else if (yaTachadas.has(n)) {
      b.classList.add('rejilla__celda--tachada');
      b.disabled = true;
    }
    rejilla.append(b);
  }

  // Tocar celda a celda o arrastrar: `elementFromPoint` encuentra la celda bajo
  // el puntero aunque el navegador capture el gesto en la celda donde empezó.
  function celdaEn(x, y) {
    const el = document.elementFromPoint(x, y);
    const b = el?.closest?.('.rejilla__celda');
    return b && rejilla.contains(b) && !b.disabled ? Number(b.dataset.n) : null;
  }
  function aplicar(n, activar) {
    const b = rejilla.querySelector(`[data-n="${n}"]`);
    if (!b || b.disabled) return;
    if (activar) { seleccionadas.add(n); b.classList.add('rejilla__celda--marcada'); }
    else { seleccionadas.delete(n); b.classList.remove('rejilla__celda--marcada'); }
  }
  let arrastrando = false, modo = true;
  function mover(ev) {
    if (!arrastrando) return;
    const n = celdaEn(ev.clientX, ev.clientY);
    if (n !== null) aplicar(n, modo);
  }
  function soltar() {
    arrastrando = false;
    document.removeEventListener('pointermove', mover);
    document.removeEventListener('pointerup', soltar);
  }
  rejilla.addEventListener('pointerdown', ev => {
    const n = celdaEn(ev.clientX, ev.clientY);
    if (n === null) return;
    ev.preventDefault();
    modo = !seleccionadas.has(n);
    aplicar(n, modo);
    arrastrando = true;
    document.addEventListener('pointermove', mover);
    document.addEventListener('pointerup', soltar);
  });

  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const acierto = aciertaTachar(item, [...seleccionadas]);
    rejilla.querySelectorAll('button').forEach(b => { b.disabled = true; });
    for (const n of objetivo) {
      const b = rejilla.querySelector(`[data-n="${n}"]`);
      b.classList.add(seleccionadas.has(n) ? 'rejilla__celda--bien' : 'rejilla__celda--mal');
    }
    for (const n of seleccionadas) {
      if (!objetivo.has(n)) rejilla.querySelector(`[data-n="${n}"]`)?.classList.add('rejilla__celda--mal');
    }
    api.responder({ acierto, html: explicacionTachar(item, seleccionadas, api), espera: 1500 });
  });
}

function montarPregunta11(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.pregunta11.instruccion)}</p>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(clave => ({ valor: clave, html: tt(TX.pregunta11.opcion[clave]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar(['buena'], valor);
      const acierto = valor === 'buena';
      const html = `${acierto ? tt(TX.pregunta11.bien) : tt(TX.pregunta11.mal)} ${tt(TX.pregunta11.final)} ${htmlCribaFinal()}`;
      api.responder({ acierto, html, espera: 2600 });
    },
  });
}

function montarCriba(contenedor, item, api) {
  if (item.tipo === 'tachar') montarTachar(contenedor, item, api);
  else montarPregunta11(contenedor, item, api);
}

// ─── Ejercicio 2: ¿primo, compuesto o ninguno? ──────────────────────────────────

function montarFlashcard(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.flash.pregunta)(item.n)}</p>
    <div class="operacion">${item.n}</div>`;
  const buena = claseDe(item.n);
  const botones = elecciones(contenedor, {
    opciones: ['primo', 'compuesto', 'ninguno'].map(valor => ({ valor, html: tt(TX.flash.opcion[valor]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);
      api.responder({ acierto: valor === buena, html: explicarClase(item.n, buena, api), espera: 1800 });
    },
  });
}

// ─── Ejercicio 3: ¿hasta qué primo hay que probar? ──────────────────────────────

function textoOpcion(o, api) {
  return o.tipo === 'mitad' ? api.tt(TX.raiz.mitad) : o.lista.join(', ');
}

function htmlExplicacionLista(item, api) {
  const { r, ultimo, siguiente } = datosExplicacionRaiz(item.n);
  return api.tt(TX.raiz.explicacion)(item.n, r, siguiente, ultimo);
}

function montarRaiz(contenedor, item, api) {
  const { tt, t } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.raiz.instruccion)(item.n)}</p>
    <div class="operacion">${item.n}</div>
    <div class="elecciones elecciones--4" id="opciones"></div>`;
  const caja = contenedor.querySelector('#opciones');
  let resuelto = false;
  const botones = item.opciones.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'eleccion';
    b.textContent = textoOpcion(o, api);
    caja.append(b);
    b.addEventListener('click', () => {
      if (api.respondido() || resuelto) return;
      botones.forEach(x => { x.disabled = true; });
      const correctaIdx = item.opciones.findIndex(op => op.correcta);
      botones[correctaIdx].classList.add('eleccion--correcta');
      if (!o.correcta) {
        b.classList.add('eleccion--mal');
        resuelto = true;
        api.responder({ acierto: false, html: htmlExplicacionLista(item, api) });
        return;
      }
      if (!item.compuesto) {
        resuelto = true;
        api.responder({ acierto: true, html: htmlExplicacionLista(item, api) });
        return;
      }
      mostrarPreguntaPrimo();
    });
    return b;
  });

  function mostrarPreguntaPrimo() {
    const caja2 = document.createElement('div');
    caja2.innerHTML = `<p class="instruccion">${tt(TX.raiz.primo_pregunta)}</p>`;
    contenedor.append(caja2);
    const botones2 = elecciones(contenedor, {
      clase: 'si-no',
      opciones: [{ valor: 'no', html: t.no }, { valor: 'si', html: t.si }],
      alElegir(valor) {
        if (api.respondido()) return;
        resuelto = true;
        botones2.marcar(['no'], valor);
        const acierto = valor === 'no';
        const html = `${htmlExplicacionLista(item, api)} ${explicarClase(item.n, 'compuesto', api)}`;
        api.responder({ acierto, html });
      },
    });
  }
}

// ─── La práctica ─────────────────────────────────────────────────────────────────

arrancar({
  slug: 'criba',
  ejercicios: [
    {
      nombre: TX.criba.nombre,
      detalle: TX.criba.detalle,
      objetivo: 5,
      introduccion: TX.criba.introduccion,
      generar: generarCriba,
      montar: montarCriba,
    },
    {
      nombre: TX.flash.nombre,
      detalle: TX.flash.detalle,
      generar: generarFlashcard,
      clave: item => String(item.n),
      montar: montarFlashcard,
    },
    {
      nombre: TX.raiz.nombre,
      detalle: TX.raiz.detalle,
      generar: generarRaiz,
      montar: montarRaiz,
    },
  ],
});
