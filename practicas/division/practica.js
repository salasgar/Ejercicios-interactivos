// Práctica «División entera: cajas y resto» (repaso de la unidad 1, tarea 23).
// La lógica pura está en logica.js y los textos en textos.js.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, COSAS } from './textos.js';
import {
  generarCajas, generarPruebaOInversa, generarSignificado, generarPuede,
  divTxt, solucionSignificado,
} from './logica.js';

// ─── Dibujo común: cajas llenas y objetos sueltos ────────────────────────────

const bolas = n => '<span class="div-bola"></span>'.repeat(n);

/** `c` cajas de `d` objetos y los `D − c · d` que quedan fuera, en HTML. */
function dibujo(D, d, c, nueva = false) {
  const cols = d <= 4 ? 2 : 3;
  const cajas = Array.from({ length: c }, (_, i) =>
    `<div class="div-caja${nueva && i === c - 1 ? ' div-caja--nueva' : ''}" style="--cols:${cols}">${bolas(d)}</div>`).join('');
  const fuera = D - c * d;
  return `<div class="div-cajas">${cajas}</div>`
    + `<div class="div-objetos">${'<span class="div-bola div-bola--suelta"></span>'.repeat(fuera)}</div>`;
}

const prueba = (D, d, q, r) => `${D} = ${d} · ${q} + ${r}`;
/** Número natural escrito, o null si está vacío o no lo es («6.9», «-2» o «1e1» no valen). */
const leerEntero = input => {
  const v = input.value.trim();
  return /^\d+$/.test(v) ? Number(v) : null;
};

// ─── Ejercicio 1: reparte en cajas ───────────────────────────────────────────

function montarCajas(contenedor, item, api) {
  const { tt } = api;
  const { D, d, q, r } = item;
  let cajas = 0;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.cajas.enunciado)(D, d)}</p>
    <div class="div-zona">
      <p class="div-etiqueta">${tt(TX.cajas.cajas_llenas)}: <strong id="n-cajas">0</strong></p>
      <div id="dibujo"></div>
    </div>
    <div class="div-botones">
      <button type="button" class="secundario" id="quitar">${tt(TX.cajas.deshacer)}</button>
      <button type="button" id="llenar">${tt(TX.cajas.llenar)}</button>
    </div>
    <div class="div-entradas">
      <label>${tt(TX.cajas.cociente)}<input type="number" inputmode="numeric" min="0" id="q" autocomplete="off"></label>
      <label>${tt(TX.cajas.resto)}<input type="number" inputmode="numeric" min="0" id="r" autocomplete="off"></label>
    </div>
    <button type="button" class="comprobar" id="listo">${tt(TX.cajas.ya_esta)}</button>`;
  const $ = s => contenedor.querySelector(s);
  const pintar = (nueva = false) => {
    $('#dibujo').innerHTML = dibujo(D, d, cajas, nueva);
    $('#n-cajas').textContent = cajas;
    $('#llenar').disabled = D - cajas * d < d;
    $('#quitar').disabled = cajas === 0;
  };
  pintar();
  $('#llenar').addEventListener('click', () => { if (api.respondido() || D - cajas * d < d) return; cajas++; pintar(true); });
  $('#quitar').addEventListener('click', () => { if (api.respondido() || cajas === 0) return; cajas--; pintar(); });

  $('#listo').addEventListener('click', ev => {
    if (api.respondido()) return;
    if (D - cajas * d >= d) {
      // Aún cabe otra caja llena: fallo, y se enseña cómo queda.
      bloquear();
      return api.responder({ acierto: false, html: `${tt(TX.cajas.aun_cabe)(D, d, cajas)} ${tt(TX.cajas.correcto)(q, r)}` + ` <span class="cuenta">${prueba(D, d, q, r)}</span>.` + dibujo(D, d, q) });
    }
    const mq = leerEntero($('#q')), mr = leerEntero($('#r'));
    if (mq === null || mr === null) return (mq === null ? $('#q') : $('#r')).focus();
    bloquear();
    const acierto = mq === q && mr === r;
    $('#q').classList.add(mq === q ? 'hueco--bien' : 'hueco--mal');
    $('#r').classList.add(mr === r ? 'hueco--bien' : 'hueco--mal');
    const tuya = `<span class="cuenta">${prueba(D, d, q, r)}</span>`;
    if (acierto) {
      return api.responder({
        acierto: true,
        html: `${tt(TX.cajas.prueba)}: ${tuya}.${r === 0 ? ` ${tt(TX.cajas.exacta)}` : ''}`,
        espera: 2200,
      });
    }
    api.responder({
      acierto: false,
      html: `${tt(TX.cajas.no_cuadra)(mq, mr)} ${tt(TX.cajas.correcto)(q, r)} ${tuya}.${r === 0 ? ` ${tt(TX.cajas.exacta)}` : ''}${dibujo(D, d, q)}`,
    });
    function bloquear() { contenedor.querySelectorAll('input, button').forEach(e => { e.disabled = true; }); ev.target.hidden = true; }
  });
}

// ─── Ejercicio 2: la prueba (y la prueba al revés) ───────────────────────────

const igualdadDe = o => `${o.izq} = ${o.a} · ${o.b} ${o.signo} ${o.c}`;

function montarPrueba(contenedor, item, api) {
  return item.tipo === 'prueba' ? montarPruebaDirecta(contenedor, item, api) : montarInversa(contenedor, item, api);
}

function montarPruebaDirecta(contenedor, item, api) {
  const { tt } = api;
  const { D, d, q, r, opciones, solucion } = item;
  contenedor.innerHTML = `<p class="div-pregunta">${tt(TX.prueba.pregunta)(D, d, q, r)}</p>`;
  const botones = elecciones(contenedor, {
    opciones: opciones.map((o, i) => ({ valor: i, html: igualdadDe(o) })),
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([solucion], i);
      const buena = prueba(D, d, q, r);
      if (i === solucion) return api.responder({ acierto: true, html: tt(TX.prueba.ok_prueba)(buena, D, d, q, r), espera: 2200 });
      const o = opciones[i];
      const valor = o.signo === '+' ? o.a * o.b + o.c : o.a * o.b * o.c;
      api.responder({
        acierto: false,
        html: `${tt(TX.prueba.esa_vale)(igualdadDe(o), tt(TX.prueba.no_vale_numeros)(o.izq, valor))}`
          + ` ${tt(TX.prueba.ok_prueba)(buena, D, d, q, r)}`,
      });
    },
  });
}

function montarInversa(contenedor, item, api) {
  const { tt } = api;
  const { a, b, r, D, solucion } = item;
  const idioma = api.idioma;
  contenedor.innerHTML = `<p class="div-pregunta">${tt(TX.prueba.pregunta_inversa)(prueba(D, a, b, r))}</p>`;
  const opciones = [
    { valor: 'a', html: tt(TX.prueba.solo)(divTxt(D, a, idioma)) },
    { valor: 'b', html: tt(TX.prueba.solo)(divTxt(D, b, idioma)) },
    { valor: 'ambas', html: tt(TX.prueba.ambas) },
    { valor: 'ninguna', html: tt(TX.prueba.ninguna) },
  ];
  const botones = elecciones(contenedor, {
    opciones,
    alElegir(v) {
      if (api.respondido()) return;
      botones.marcar([solucion], v);
      const explicacion = solucion === 'ambas' ? tt(TX.prueba.inversa_ambas)(a, b, r, D)
        : solucion === 'ninguna' ? tt(TX.prueba.inversa_ninguna)(D, a, b, r)
        : solucion === 'a' ? tt(TX.prueba.inversa_una)(D, a, b, r, b)
        : tt(TX.prueba.inversa_una)(D, b, a, r, a);
      api.responder({ acierto: v === solucion, html: explicacion, espera: 2600 });
    },
  });
}

// ─── Ejercicio 3: ¿qué significa el resto? ───────────────────────────────────

function montarSignificado(contenedor, item, api) {
  const { tt } = api;
  const { clave, D, d, q, r, pide, solucion } = item;
  const cosa = COSAS[clave];
  contenedor.innerHTML = `
    <p class="div-pregunta">${tt(TX.significado.enunciado)(D, cosa, d)}<br>${tt(TX.significado.preguntas[pide])(cosa)}</p>
    <div class="div-entradas">
      <label>${tt(TX.significado.respuesta)}<input type="number" inputmode="numeric" min="0" id="resp" autocomplete="off"></label>
    </div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const entrada = contenedor.querySelector('#resp');
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const mia = leerEntero(entrada);
    if (mia === null) return entrada.focus();
    entrada.disabled = true;
    ev.target.hidden = true;
    const acierto = mia === solucionSignificado({ q, r, pide });
    entrada.classList.add(acierto ? 'hueco--bien' : 'hueco--mal');
    const explicacion = pide === 'llenas' ? tt(TX.significado.ok_llenas)(D, d, q, r, cosa)
      : pide === 'sueltos' ? tt(TX.significado.ok_sueltos)(D, d, q, r)
      : r === 0 ? tt(TX.significado.ok_hacen_exacto)(D, d, q)
      : tt(TX.significado.ok_hacen)(D, d, q, r, cosa);
    // Quien pone «q» donde había que poner «q + 1» se olvidó del resto.
    const olvido = !acierto && pide === 'hacen' && r > 0 && mia === q ? ` ${tt(TX.significado.olvido)(cosa)}` : '';
    api.responder({ acierto, html: `${explicacion}${olvido}${dibujo(D, d, q)}`, espera: 2600 });
  });
}

// ─── Ejercicio 4: ¿puede ser? ────────────────────────────────────────────────

function montarPuede(contenedor, item, api) {
  const { tt } = api;
  const { variante, D, d, q, r, solucion } = item;
  contenedor.innerHTML = `<p class="div-pregunta">${variante === 'resto'
    ? tt(TX.puede.pregunta_resto)(d, r) : tt(TX.puede.pregunta_division)(D, d, q, r)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(v) {
      if (api.respondido()) return;
      const buena = solucion ? 'si' : 'no';
      botones.marcar([buena], v);
      let html;
      if (variante === 'resto') html = solucion ? tt(TX.puede.si_puede)(d, r) : tt(TX.puede.no_puede)(d, r);
      else if (solucion) html = tt(TX.puede.esta_bien)(D, d, q, r);
      else if (r >= d && d * q + r !== D) html = tt(TX.puede.mal_los_dos)(D, d, q, r);
      else if (r >= d) html = tt(TX.puede.mal_resto)(D, d, q, r);
      else html = tt(TX.puede.mal_cuenta)(D, d, q, r);
      api.responder({ acierto: v === buena, html, espera: 2400 });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────

arrancar({
  slug: 'division',
  ejercicios: [
    {
      nombre: TX.cajas.nombre, detalle: TX.cajas.detalle, introduccion: TX.cajas.introduccion,
      generar: generarCajas, clave: it => `${it.D}/${it.d}`, montar: montarCajas,
    },
    {
      nombre: TX.prueba.nombre, detalle: TX.prueba.detalle, introduccion: TX.prueba.introduccion,
      generar: generarPruebaOInversa,
      clave: it => (it.tipo === 'prueba' ? `p${it.D}/${it.d}` : `i${it.a}x${it.b}+${it.r}`),
      montar: montarPrueba,
    },
    {
      nombre: TX.significado.nombre, detalle: TX.significado.detalle, introduccion: TX.significado.introduccion,
      generar: generarSignificado, clave: it => `${it.clave}${it.D}/${it.d}${it.pide}`, montar: montarSignificado,
    },
    {
      nombre: TX.puede.nombre, detalle: TX.puede.detalle, introduccion: TX.puede.introduccion,
      generar: generarPuede, clave: it => `${it.variante}${it.D ?? ''}/${it.d}/${it.q ?? ''}/${it.r}`, montar: montarPuede,
    },
  ],
});
