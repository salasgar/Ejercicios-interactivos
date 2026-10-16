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
  RELACIONES, EJERCICIOS_ACTUALES, generar, esCorrecta, solucionArrastrar, claveDe, cumple,
} from './logica.js';
import { T as TX, textoOperacion, frase, fraseNegada, razon, fraseRazonada, explicacion, cerrar } from './textos.js';

// No se repite el mismo ítem dos veces seguidas; `numeros` (el ejercicio 4)
// se excluye a propósito, porque el barajado cambia aunque la operación no.
const clave = claveDe;
const BICHO_VIVO = new URL('./bicho-vivo.svg', import.meta.url).href;
const BICHO_MUERTO = new URL('./bicho-muerto.svg', import.meta.url).href;

// ─── Ejercicio 0: patrón ELEGIR («de» / «entre») ───────────────────────────────

// Los enunciados salen también en la traducción, sin botones ni fichas.
const operacion = (item, idioma) => `<div class="operacion">${textoOperacion(item.op, idioma)}</div>`;

function enunciadoPreposicion(item, { t, idioma }, hueco = '') {
  const tx = TX[idioma];
  return `
    <p class="instruccion">${tx.instruccion.preposicion}</p>
    ${operacion(item, idioma)}
    ${hueco && '<div class="flecha" aria-hidden="true">↓</div>'}
    <div class="frase">
      <span class="numero">${item.x}</span> ${t.es} ${tx.palabra[item.relacion]}
      <span class="hueco hueco--corto" ${hueco}></span>
      <span class="numero">${item.y}</span>
    </div>`;
}

function montarPreposicion(contenedor, item, api) {
  const { idioma } = api;
  const tx = TX[idioma];
  contenedor.innerHTML = enunciadoPreposicion(item, api, 'id="hueco"');
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
      api.responder({
        acierto,
        html: ({ idioma: i }) => {
          const buena = `${frase(item.relacion, item.x, item.y, i)}.`;
          return acierto ? buena : `${TX[i].se_dice}<br>${buena}`;
        },
      });
    },
  });
}

// ─── Ejercicios 1, 2 y 3: patrón ELEGIR (divisor / múltiplo / divisible) ───────

function enunciadoEleccion(item, { t, idioma }, hueco = '') {
  return `
    <p class="instruccion">${TX[idioma].instruccion.eleccion}</p>
    ${operacion(item, idioma)}
    ${hueco && '<div class="flecha" aria-hidden="true">↓</div>'}
    <div class="frase"><span class="numero">${item.x}</span> ${t.es} <span class="hueco" ${hueco}></span> <span class="numero">${item.y}</span></div>`;
}

function montarEleccion(contenedor, item, api) {
  const { idioma } = api;
  const tx = TX[idioma];
  contenedor.innerHTML = enunciadoEleccion(item, api, 'id="hueco"');
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
        const otras = item.correctas.filter(r => r !== valor);
        api.responder({
          acierto: true,
          html: ({ t, idioma: i }) => {
            const extra = otras.length ? `<br>${t.tambien} ${unir(otras.map(r => frase(r, item.x, item.y, i)), i)}.` : '';
            return `${frase(valor, item.x, item.y, i)}.${extra}`;
          },
          espera: otras.length ? 2600 : 1300,
        });
        return;
      }
      api.responder({
        acierto: false,
        html: ({ t, idioma: i }) => `${cerrar(`${fraseNegada(valor, item.x, item.y, i)}; ${explicacion(valor, item.x, item.y, i, { conAlReves: false })}`)}<br>
          ${t.fijate} <span class="cuenta">${razon(item.correctas[0], item.x, item.y, i)}</span>.
          ${t.por_eso} ${unir(item.correctas.map(r => frase(r, item.x, item.y, i)), i)}.`,
      });
    },
  });
}

// ─── Ejercicio 4: patrón ARRASTRAR (tocar, dedo, ratón o lápiz) ───────────────

function enunciadoArrastrar(item, { t, idioma }) {
  const tx = TX[idioma];
  return `
    <p class="instruccion">${tx.instruccion.arrastrar}</p>
    <div class="frase">
      <span class="hueco hueco--ficha" data-hueco="0"></span> ${t.es} ${tx.relacion[item.relacion]}
      <span class="hueco hueco--ficha" data-hueco="1"></span>
    </div>`;
}

function montarArrastrar(contenedor, item, api) {
  const { t } = api;
  const colocadas = [null, null];
  contenedor.innerHTML = `
    ${enunciadoArrastrar(item, api)}
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
      api.responder({ acierto: true, html: ({ idioma: i }) => `${frase(item.relacion, x, y, i)}: <span class="cuenta">${razon(item.relacion, x, y, i)}</span>.`, espera: 1800 });
      return;
    }
    const [sx, sy] = solucionArrastrar(item);
    const alReves = cumple(item.relacion, y, x);
    api.responder({
      acierto: false,
      html: ({ t: ti, idioma: i }) => `${cerrar(`${fraseNegada(item.relacion, x, y, i)}; ${explicacion(item.relacion, x, y, i)}`)}${alReves ? '' : `<br>
        ${ti.por_ejemplo} ${frase(item.relacion, sx, sy, i)}, <span class="cuenta">${razon(item.relacion, sx, sy, i)}</span>.`}`,
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

// En la traducción, la consigna y las frases de los bichos, en lista.
function enunciadoBichos(item, { idioma }) {
  return `
    <p class="consigna consigna--${item.modo}">${TX[idioma].instruccion.bichos[item.modo]}</p>
    <ul>${item.frases.map(f => `<li>${frase(f.relacion, f.x, f.y, idioma)}</li>`).join('')}</ul>`;
}

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
      api.responder({ acierto: true, html: ({ idioma: i }) => `${esMentira ? TX[i].bichos.aplastado : TX[i].bichos.acertado} ${cerrar(fraseRazonada(buena, i))}`, espera: esMentira ? 3200 : 2200 });
      return;
    }
    api.responder({
      acierto: false,
      html: ({ idioma: i }) => {
        const b = TX[i].bichos;
        return `${pulsada.verdadera ? b.este_verdad : b.este_mentia} ${cerrar(fraseRazonada(pulsada, i))}<br>
        ${b.habia_que[item.modo]} ${esMentira ? b.el_que_mentia : b.el_sincero} ${cerrar(fraseRazonada(buena, i))}`;
      },
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
    enunciado: n === 0 ? enunciadoPreposicion : n === 4 ? enunciadoArrastrar : n === 5 ? enunciadoBichos : enunciadoEleccion,
  })),
});
