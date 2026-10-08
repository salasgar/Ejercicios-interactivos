// Práctica «Divisor, múltiplo, divisible»: la práctica 0 del catálogo (tarea
// 17 del reparto PU2), migrada sobre la base común. Mismos cinco ejercicios,
// mismos códigos de alumno y mismo comportamiento que los alumnos ya conocen.
//
// `objetivo`, `penalizacion` y `vidas` no se declaran a propósito: se toman
// los valores por defecto de `../practicas/_comun/contador.js` (puntos, vidas
// y racha desde el 2026-10-08), para que esta práctica herede sin tocarla
// cualquier ajuste de la base.

import { arrancar } from '../practicas/_comun/base.js';
import { elecciones } from '../practicas/_comun/piezas.js';
import { unir } from '../practicas/_comun/textos.js';
import {
  RELACIONES, EJERCICIOS_ACTUALES, generar, esCorrecta, solucionArrastrar, claveDe,
} from './logica.js';
import { T as TX, textoOperacion, frase, fraseNegada, razon, fraseRazonada } from './textos.js';

// No se repite el mismo ítem dos veces seguidas; `numeros` (el ejercicio 4)
// se excluye a propósito, porque el barajado cambia aunque la operación no.
const clave = claveDe;
const BICHO_VIVO = new URL('./bicho-vivo.svg', import.meta.url).href;
const BICHO_MUERTO = new URL('./bicho-muerto.svg', import.meta.url).href;

// ─── Ejercicio 0: patrón ELEGIR («de» / «entre») ───────────────────────────────

function montarPreposicion(contenedor, item, api) {
  const { t, idioma } = api;
  const tx = TX[idioma];
  contenedor.innerHTML = `
    <p class="instruccion">${tx.instruccion.preposicion}</p>
    <div class="operacion">${textoOperacion(item.op, idioma)}</div>
    <div class="flecha" aria-hidden="true">↓</div>
    <div class="frase">
      <span class="numero">${item.x}</span> ${t.es} ${tx.palabra[item.relacion]}
      <span class="hueco hueco--corto" id="hueco"></span>
      <span class="numero">${item.y}</span>
    </div>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: ['de', 'entre'].map(valor => ({ valor, html: tx.preposicion[valor] })),
    alElegir(valor) {
      if (api.respondido()) return;
      const acierto = valor === item.correcta;
      const hueco = contenedor.querySelector('#hueco');
      hueco.textContent = tx.preposicion[valor];
      hueco.classList.add(acierto ? 'hueco--bien' : 'hueco--mal');
      botones.marcar([item.correcta], valor);
      const buena = `${frase(item.relacion, item.x, item.y, idioma)}.`;
      api.responder({ acierto, html: acierto ? buena : `${tx.se_dice}<br>${buena}` });
    },
  });
}

// ─── Ejercicios 1, 2 y 3: patrón ELEGIR (divisor / múltiplo / divisible) ───────

function montarEleccion(contenedor, item, api) {
  const { t, idioma } = api;
  const tx = TX[idioma];
  contenedor.innerHTML = `
    <p class="instruccion">${tx.instruccion.eleccion}</p>
    <div class="operacion">${textoOperacion(item.op, idioma)}</div>
    <div class="flecha" aria-hidden="true">↓</div>
    <div class="frase"><span class="numero">${item.x}</span> ${t.es} <span class="hueco" id="hueco"></span> <span class="numero">${item.y}</span></div>`;
  const botones = elecciones(contenedor, {
    opciones: RELACIONES.map(valor => ({ valor, html: tx.relacion[valor] })),
    alElegir(valor) {
      if (api.respondido()) return;
      const acierto = item.correctas.includes(valor);
      const hueco = contenedor.querySelector('#hueco');
      hueco.textContent = tx.relacion[valor];
      hueco.classList.add(acierto ? 'hueco--bien' : 'hueco--mal');
      botones.marcar(item.correctas, valor);
      if (acierto) {
        const otras = item.correctas.filter(r => r !== valor).map(r => frase(r, item.x, item.y, idioma));
        const extra = otras.length ? `<br>${t.tambien} ${unir(otras, idioma)}.` : '';
        api.responder({ acierto: true, html: `${frase(valor, item.x, item.y, idioma)}.${extra}`, espera: otras.length ? 2600 : 1300 });
        return;
      }
      api.responder({
        acierto: false,
        html: `${fraseNegada(valor, item.x, item.y, idioma)}.<br>
          ${t.fijate} <span class="cuenta">${razon(item.correctas[0], item.x, item.y, idioma)}</span>.
          ${t.por_eso} ${unir(item.correctas.map(r => frase(r, item.x, item.y, idioma)), idioma)}.`,
      });
    },
  });
}

// ─── Ejercicio 4: patrón ARRASTRAR (tocar, dedo, ratón o lápiz) ───────────────

function montarArrastrar(contenedor, item, api) {
  const { t, idioma } = api;
  const tx = TX[idioma];
  const colocadas = [null, null];
  contenedor.innerHTML = `
    <p class="instruccion">${tx.instruccion.arrastrar}</p>
    <div class="frase">
      <span class="hueco hueco--ficha" data-hueco="0"></span> ${t.es} ${tx.relacion[item.relacion]}
      <span class="hueco hueco--ficha" data-hueco="1"></span>
    </div>
    <div class="banco" id="banco">${item.numeros.map((num, i) => `<span class="sitio" data-sitio="${i}"><button type="button" class="ficha" data-ficha="${i}">${num}</button></span>`).join('')}</div>
    <button type="button" id="comprobar" class="comprobar" disabled>${t.comprobar}</button>`;

  function pintarFichas() {
    contenedor.querySelectorAll('.ficha').forEach(ficha => {
      const i = Number(ficha.dataset.ficha);
      const h = colocadas.indexOf(i);
      const destino = h >= 0 ? contenedor.querySelector(`[data-hueco="${h}"]`) : contenedor.querySelector(`[data-sitio="${i}"]`);
      if (ficha.parentElement !== destino) destino.append(ficha);
    });
    contenedor.querySelectorAll('[data-hueco]').forEach((el, h) => el.classList.toggle('hueco--lleno', colocadas[h] !== null));
    contenedor.querySelector('#comprobar').disabled = colocadas.includes(null);
  }
  function colocar(i, h) {
    const antes = colocadas.indexOf(i);
    const ocupante = colocadas[h];
    if (antes >= 0) colocadas[antes] = null;
    if (ocupante !== null && ocupante !== i && antes >= 0) colocadas[antes] = ocupante;
    colocadas[h] = i;
  }
  function quitar(i) {
    const h = colocadas.indexOf(i);
    if (h >= 0) colocadas[h] = null;
  }
  function huecoEn(x, y) {
    const margen = 18;
    return [...contenedor.querySelectorAll('[data-hueco]')].findIndex(el => {
      const r = el.getBoundingClientRect();
      return x >= r.left - margen && x <= r.right + margen && y >= r.top - margen && y <= r.bottom + margen;
    });
  }
  function tocar(i) {
    if (colocadas.includes(i)) quitar(i);
    else if (colocadas.includes(null)) colocar(i, colocadas.indexOf(null));
    pintarFichas();
  }
  contenedor.querySelectorAll('.ficha').forEach(ficha => {
    const i = Number(ficha.dataset.ficha);
    ficha.addEventListener('pointerdown', ev => {
      if (api.respondido() || ev.button > 0) return;
      ev.preventDefault();
      ficha.setPointerCapture?.(ev.pointerId);
      const x0 = ev.clientX, y0 = ev.clientY;
      let arrastrando = false;
      const mover = e => {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!arrastrando && Math.hypot(dx, dy) > 6) { arrastrando = true; ficha.classList.add('ficha--arrastrando'); }
        if (arrastrando) ficha.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const soltar = e => {
        ficha.removeEventListener('pointermove', mover);
        ficha.removeEventListener('pointerup', soltar);
        ficha.removeEventListener('pointercancel', soltar);
        ficha.style.transform = '';
        ficha.classList.remove('ficha--arrastrando');
        if (e.type === 'pointercancel') return pintarFichas();
        if (!arrastrando) return tocar(i);
        const h = huecoEn(e.clientX, e.clientY);
        if (h >= 0) colocar(i, h); else quitar(i);
        pintarFichas();
      };
      ficha.addEventListener('pointermove', mover);
      ficha.addEventListener('pointerup', soltar);
      ficha.addEventListener('pointercancel', soltar);
    });
    // Con el teclado (Intro o espacio) no hay eventos de puntero: `detail` es 0.
    ficha.addEventListener('click', ev => { if (ev.detail === 0 && !api.respondido()) tocar(i); });
  });
  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido() || colocadas.includes(null)) return;
    const [x, y] = colocadas.map(i => item.numeros[i]);
    const acierto = esCorrecta(item, [x, y]);
    contenedor.querySelector('#comprobar').hidden = true;
    contenedor.querySelectorAll('.ficha').forEach(f => { f.disabled = true; });
    contenedor.querySelectorAll('[data-hueco]').forEach(el => el.classList.add(acierto ? 'hueco--bien' : 'hueco--mal'));
    if (acierto) {
      api.responder({ acierto: true, html: `${frase(item.relacion, x, y, idioma)}: <span class="cuenta">${razon(item.relacion, x, y, idioma)}</span>.`, espera: 1800 });
      return;
    }
    const [sx, sy] = solucionArrastrar(item);
    api.responder({
      acierto: false,
      html: `${fraseNegada(item.relacion, x, y, idioma)}.<br>
        ${t.por_ejemplo} ${frase(item.relacion, sx, sy, idioma)}, <span class="cuenta">${razon(item.relacion, sx, sy, idioma)}</span>.`,
    });
  });
  pintarFichas();
}

// ─── Ejercicio 5: ¿QUIÉN MIENTE? (los bichos) ───────────────────────────────────
//
// N bichos (sprites de Scratch, el mismo escarabajo con el color girado), cada
// uno con una frase en su bocadillo. La consigna alterna: «pulsa el que
// MIENTE» (solo uno miente) o «pulsa el que dice la VERDAD» (solo uno la
// dice). Al acertar, el mentiroso aparece aplastado y al sincero le salen
// corazones. Sin cronómetro: lo que cuenta es leer las frases.

function montarBichos(contenedor, item, api) {
  const { idioma } = api;
  const tx = TX[idioma];
  const esMentira = item.modo === 'mentira';
  contenedor.innerHTML = `
    <p class="consigna consigna--${item.modo}">${tx.instruccion.bichos[item.modo]}</p>
    <div class="bichos bichos--${item.frases.length}">
      ${item.frases.map((f, i) => `
        <button type="button" class="bicho" data-bicho="${i}" style="--tono: ${item.tonos[i]}deg">
          <span class="bocadillo">${frase(f.relacion, f.x, f.y, idioma)}</span>
          <span class="bicho__cuerpo"><img src="${BICHO_VIVO}" alt="" width="84" height="76"></span>
        </button>`).join('')}
    </div>`;
  const botones = [...contenedor.querySelectorAll('.bicho')];
  botones.forEach(boton => boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const i = Number(boton.dataset.bicho);
    const acierto = esCorrecta(item, i);
    const pulsada = item.frases[i];
    const buena = item.frases[item.objetivo];
    botones.forEach((b, j) => {
      b.disabled = true;
      b.querySelector('.bocadillo').classList.add(item.frases[j].verdadera ? 'bocadillo--verdad' : 'bocadillo--mentira');
    });
    boton.classList.add(acierto ? 'bicho--bien' : 'bicho--mal');
    botones[item.objetivo].classList.add('bicho--objetivo');
    if (acierto && esMentira) {
      boton.querySelector('img').src = BICHO_MUERTO;
      boton.classList.add('bicho--aplastado');
    } else if (acierto) {
      boton.querySelector('.bicho__cuerpo').insertAdjacentHTML('beforeend', '<span class="corazones" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i></span>');
      boton.classList.add('bicho--amor');
    }
    if (acierto) {
      api.responder({ acierto: true, html: `${esMentira ? tx.bichos.aplastado : tx.bichos.acertado} ${fraseRazonada(buena, idioma)}.`, espera: 2200 });
      return;
    }
    api.responder({
      acierto: false,
      html: `${pulsada.verdadera ? tx.bichos.este_verdad : tx.bichos.este_mentia} ${fraseRazonada(pulsada, idioma)}.<br>
        ${tx.bichos.habia_que[item.modo]} ${esMentira ? tx.bichos.el_que_mentia : tx.bichos.el_sincero} ${fraseRazonada(buena, idioma)}.`,
    });
  }));
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'divisores',
  ejercicios: EJERCICIOS_ACTUALES.map(n => ({
    nombre: { es: TX.es.ejercicios[n].nombre, en: TX.en.ejercicios[n].nombre },
    detalle: { es: TX.es.ejercicios[n].detalle, en: TX.en.ejercicios[n].detalle },
    generar: (rng, sesion) => generar(n, rng, sesion),
    clave,
    montar: n === 0 ? montarPreposicion : n === 4 ? montarArrastrar : n === 5 ? montarBichos : montarEleccion,
  })),
});
