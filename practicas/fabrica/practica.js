// Práctica «Fábrica de divisores» — Unidad 2.
//
// Tres ejercicios:
//  1. construir   elegir exponentes hasta formar el divisor pedido
//  2. contar      cuántos divisores tiene (producto de exponentes + 1)
//  3. divisible   decidir sin dividir, mirando los exponentes

import { arrancar } from '../_comun/base.js';
import { pasos, elecciones } from '../_comun/piezas.js';
import { htmlFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import {
  generarConstruir, factDeConstruido, esConstruccionCorrecta,
  generarContar, olvidoSumarUno, divisores,
  generarDivisible,
} from './logica.js';

// ─── Ejercicio 1: construye el divisor ─────────────────────────────────────

function explicacionConstruir(item, exponentes, api) {
  const { tt } = api;
  const clausulas = item.fact.map(([p, e], i) => tt(TX.construir.clausula)(p, exponentes[i], e));
  const explicacion = clausulas.join(', ');
  const tuyo = valorDeExponentes(item.fact, exponentes);
  if (tuyo === item.objetivo) return tt(TX.construir.feedbackBien)(item.objetivo, explicacion);
  const clausulasBuenas = item.fact.map(([p, e], i) => tt(TX.construir.clausula)(p, item.expObjetivo[i], e));
  return tt(TX.construir.feedbackMal)(tuyo, explicacion, item.objetivo, clausulasBuenas.join(', '));
}

function valorDeExponentes(fact, exponentes) {
  return fact.reduce((v, [p], i) => v * p ** exponentes[i], 1);
}

function montarConstruir(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.construir.instruccion)(item.objetivo)}</p>
    <div class="operacion" id="construido"></div>
    <div class="grupo-pasos" id="bases"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const salida = contenedor.querySelector('#construido');
  const exponentes = () => controles.map(c => c.valor());
  const pintar = () => {
    const f = factDeConstruido(item.fact, exponentes());
    salida.innerHTML = f.length ? htmlFact(f) : '1';
  };
  const controles = item.fact.map(([p, e]) => pasos(contenedor.querySelector('#bases'), {
    max: e,
    nombre: tt(TX.construir.exponenteDe)(p),
    pinta: v => (v === 0 ? `${p}` : `${p}<sup>${v}</sup>`),
    alCambiar: pintar,
  }));
  pintar();

  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const mis = exponentes();
    const acierto = esConstruccionCorrecta(item, mis);
    controles.forEach(c => c.bloquear());
    contenedor.querySelector('#comprobar').hidden = true;
    api.responder({ acierto, html: explicacionConstruir(item, mis, api), espera: 2200 });
  });
}

// ─── Ejercicio 2: ¿cuántos divisores tiene? ────────────────────────────────

function montarContar(contenedor, item, api) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${esc(tt(TX.contar.pregunta))}</p>
    <div class="operacion">${htmlFact(item.fact)}</div>
    <div class="flecha" aria-hidden="true">↓</div>
    <div class="operacion" id="pantalla">0</div>
    <div class="botones-numeros" id="teclado"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const pantalla = contenedor.querySelector('#pantalla');
  let texto = '';
  const pintar = () => { pantalla.textContent = texto || '0'; };
  const teclado = contenedor.querySelector('#teclado');
  for (let d = 0; d <= 9; d++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(d);
    b.addEventListener('click', () => {
      if (api.respondido() || texto.length >= 2) return;
      texto += String(d);
      pintar();
    });
    teclado.append(b);
  }
  const borrar = document.createElement('button');
  borrar.type = 'button';
  borrar.textContent = api.t.borrar;
  borrar.addEventListener('click', () => {
    if (api.respondido()) return;
    texto = texto.slice(0, -1);
    pintar();
  });
  teclado.append(borrar);

  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido() || !texto) return;
    const tuyo = Number(texto);
    [...teclado.querySelectorAll('button')].forEach(b => { b.disabled = true; });
    contenedor.querySelector('#comprobar').hidden = true;
    const acierto = tuyo === item.solucion;
    let html;
    if (acierto) {
      const cuenta = item.fact.map(([, e]) => `(${e}+1)`).join(' · ');
      html = `${tt(TX.contar.feedbackBien)(`${cuenta} = ${item.solucion}`)}`;
      if (item.premio) html += ` ${tt(TX.contar.premio)(divisores(item.n))}`;
    } else if (tuyo === olvidoSumarUno(item)) {
      html = tt(TX.contar.feedbackOlvido)(tuyo, item.solucion);
    } else {
      html = tt(TX.contar.feedbackMal)(tuyo, item.solucion);
    }
    api.responder({ acierto, html, espera: 2600 });
  });
}

// ─── Ejercicio 3: sin dividir ───────────────────────────────────────────────

function explicacionDivisible(item, api) {
  const { tt } = api;
  const fMapa = new Map(item.fact);
  const clausulas = item.factD.map(([p, eNecesita]) => {
    const eTiene = fMapa.get(p) ?? 0;
    if (eTiene === 0) return tt(TX.divisible.feedbackNoFalta)(p);
    if (eTiene < eNecesita) return tt(TX.divisible.feedbackNoPoco)(p, eTiene, eNecesita);
    return tt(TX.divisible.feedbackSiTiene)(p, eTiene, eNecesita);
  });
  const conclusion = item.divisible ? tt(TX.divisible.conclusionSi) : tt(TX.divisible.conclusionNo);
  return `${clausulas.join('; ')} ${conclusion}`;
}

function montarDivisible(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.divisible.pregunta)(item.n, item.d)}</p><div class="operacion">${htmlFact(item.fact)}</div>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const buena = item.divisible ? 'si' : 'no';
      botones.marcar([buena], valor);
      api.responder({ acierto: valor === buena, html: explicacionDivisible(item, api), espera: 2200 });
    },
  });
}

// ─── La práctica ────────────────────────────────────────────────────────────

arrancar({
  slug: 'fabrica',
  ejercicios: [
    {
      nombre: TX.nombre.construir,
      detalle: TX.detalle.construir,
      generar: generarConstruir,
      montar: montarConstruir,
    },
    {
      nombre: TX.nombre.contar,
      detalle: TX.detalle.contar,
      generar: generarContar,
      montar: montarContar,
    },
    {
      nombre: TX.nombre.divisible,
      detalle: TX.detalle.divisible,
      generar: generarDivisible,
      montar: montarDivisible,
    },
  ],
});
