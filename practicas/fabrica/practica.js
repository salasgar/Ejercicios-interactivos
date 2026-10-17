// Práctica «Fábrica de divisores» — Unidad 2.
//
// Dos ejercicios:
//  1. contar      cuántos divisores tiene (producto de exponentes + 1)
//  2. divisible   decidir sin dividir, mirando los exponentes
//
// Hasta el 2026-10-18 había otro antes, «Construye el divisor» (elegir los
// exponentes hasta formar el número pedido). Se quitó porque, como no se veía
// el número del que salía el divisor, lo que hacía el alumno era factorizar el
// número pedido (tarea 76 del reparto PU2). El progreso guardado con tres
// ejercicios se adapta solo: `quitados` en catalogo.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { htmlFact } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import { generarContar, olvidoSumarUno, divisores, generarDivisible } from './logica.js';

// ─── Ejercicio 1: ¿cuántos divisores tiene? ────────────────────────────────

const enunciadoContar = (item, { tt }) => `
    <p class="instruccion">${tt(TX.contar.pregunta)}</p>
    <div class="operacion">${htmlFact(item.fact)}</div>`;

function montarContar(contenedor, item, api) {
  contenedor.innerHTML = `
    ${enunciadoContar(item, api)}
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
    const cuenta = `${item.fact.map(([, e]) => `(${e}+1)`).join(' · ')} = ${item.solucion}`;
    const html = ({ tt }) => {
      if (acierto) {
        let bien = `${tt(TX.contar.feedbackBien)(cuenta)}`;
        if (item.premio) bien += ` ${tt(TX.contar.premio)(divisores(item.n))}`;
        return bien;
      }
      if (tuyo === olvidoSumarUno(item)) return tt(TX.contar.feedbackOlvido)(tuyo, cuenta);
      return tt(TX.contar.feedbackMal)(tuyo, cuenta);
    };
    api.responder({ acierto, html, espera: 2600 });
  });
}

// ─── Ejercicio 2: sin dividir ───────────────────────────────────────────────

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
  const cabecera = tt(TX.divisible.factorDelDivisor)(item.d, htmlFact(item.factD));
  return `${cabecera} ${clausulas.join('; ')} ${conclusion}`;
}

const enunciadoDivisible = (item, { tt }) => `<p class="instruccion">${tt(TX.divisible.pregunta)(item.n, item.d)}</p><div class="operacion">${htmlFact(item.fact)}</div>`;

function montarDivisible(contenedor, item, api) {
  contenedor.innerHTML = enunciadoDivisible(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const buena = item.divisible ? 'si' : 'no';
      botones.marcar([buena], valor);
      api.responder({ acierto: valor === buena, html: textos => explicacionDivisible(item, textos), espera: 2200 });
    },
  });
}

// ─── La práctica ────────────────────────────────────────────────────────────

arrancar({
  slug: 'fabrica',
  ejercicios: [
    {
      nombre: TX.nombre.contar,
      detalle: TX.detalle.contar,
      generar: generarContar,
      montar: montarContar,
      enunciado: enunciadoContar,
    },
    {
      nombre: TX.nombre.divisible,
      detalle: TX.detalle.divisible,
      generar: generarDivisible,
      montar: montarDivisible,
      enunciado: enunciadoDivisible,
    },
  ],
});
