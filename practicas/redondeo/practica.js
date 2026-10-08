// Redondeo y estimación (repaso de la unidad 1). Tres ejercicios:
//   1. En la recta: tocar dónde cae el número y la marca más cercana.
//   2. A tres órdenes: decena, centena y millar, y si es por exceso o por defecto.
//   3. Estimar y cazar el error: estimar una cuenta, ¿es razonable?, cantidad en contexto.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, ETIQUETA_ORDEN } from './textos.js';
import {
  ORDENES, redondear, fmt, leerEntero, cifraDecisiva, fraccionDe, generarRecta, posicionCorrecta, esAciertoRecta,
  generarTres, esAciertoTres, generarEstimacion, diferenciaCon, esAciertoEstimar,
  esAciertoRazonable, esAciertoContexto,
} from './logica.js';

const SIGNO = { '+': '+', '·': '·' };

/** Un número con separador de miles en el idioma del ítem. */
const num = (n, api) => fmt(n, api.idioma);
const cuentaDe = (op, terminos, api) => terminos.map(t => num(t, api)).join(` ${SIGNO[op]} `);

// ─── Ejercicio 1: en la recta ───────────────────────────────────────────────────

function montarRecta(contenedor, item, api) {
  const { tt } = api;
  const T = TX.recta;
  const [inf, sup] = item.marcas;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.pregunta)(num(item.n, api), item.orden)}</p>
    <div class="operacion">${num(item.n, api)}</div>
    <p class="instruccion redondeo-paso">${tt(T.paso1)}</p>
    <div class="recta" id="recta" role="button" tabindex="0" aria-label="${api.esc(tt(T.paso1))}">
      <div class="recta__pista" id="pista">
        <div class="recta__linea"></div>
        <div class="recta__marca" style="left:0"></div>
        <div class="recta__marca" style="left:100%"></div>
        <span class="recta__etiqueta" style="left:0">${num(inf, api)}</span>
        <span class="recta__etiqueta" style="left:100%">${num(sup, api)}</span>
      </div>
    </div>
    <p class="instruccion redondeo-paso">${tt(item.medio ? T.paso2_medio : T.paso2)}</p>
    <p class="redondeo-aviso" id="aviso" role="status"></p>`;

  const recta = contenedor.querySelector('#recta');
  const pista = contenedor.querySelector('#pista');
  const aviso = contenedor.querySelector('#aviso');
  let x = null;
  let punto = null;

  const poner = (fraccion, clase, etiqueta) => {
    const p = document.createElement('span');
    p.className = `recta__punto ${clase}`;
    p.style.left = `${fraccion * 100}%`;
    if (etiqueta) p.innerHTML = `<span class="recta__valor">${etiqueta}</span>`;
    pista.append(p);
    return p;
  };

  recta.addEventListener('click', ev => {
    if (api.respondido()) return;
    const r = pista.getBoundingClientRect();
    x = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
    if (punto) punto.remove();
    punto = poner(x, 'recta__punto--mio');
    aviso.textContent = '';
  });

  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: item.marcas.map(m => ({ valor: m, html: num(m, api) })),
    alElegir(valor) {
      if (api.respondido()) return;
      if (x === null) { aviso.textContent = tt(T.falta_posicion); return; }
      const buenaPos = posicionCorrecta(item, x);
      const acierto = esAciertoRecta(item, x, valor);
      botones.marcar([item.redondeado], valor);
      recta.classList.add('recta--cerrada');
      if (punto) punto.classList.add(buenaPos ? 'recta__punto--bien' : 'recta__punto--mal');
      poner(fraccionDe(item.n, item.orden), 'recta__punto--real', num(item.n, api));
      const c = cifraDecisiva(item.n, item.orden);
      let html = tt(T.entre)(num(item.n, api), num(inf, api), num(sup, api));
      if (item.medio) html += tt(T.medio)(num(item.redondeado, api));
      else html += item.exceso ? tt(T.sube)(num(item.redondeado, api), c) : tt(T.baja)(num(item.redondeado, api), c);
      if (!buenaPos) html += tt(T.posicion_mal)(num(item.n, api));
      api.responder({ acierto, html, espera: 2600 });
    },
  });
}

// ─── Ejercicio 2: a tres órdenes ────────────────────────────────────────────────

function montarTres(contenedor, item, api) {
  const { tt } = api;
  const T = TX.tres;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.pregunta)(num(item.n, api))}</p>
    <div class="operacion">${num(item.n, api)}</div>
    <p class="instruccion">${tt(T.leyenda)}</p>
    <div class="tres-filas">${ORDENES.map(o => `
      <div class="tres-fila" data-o="${o}">
        <label for="tres-${o}">${tt(ETIQUETA_ORDEN[o])}</label>
        <input type="text" inputmode="numeric" id="tres-${o}" class="redondeo-entero" autocomplete="off">
        <div class="tres-sentido">
          <button type="button" class="eleccion" data-s="exceso" aria-pressed="false" aria-label="${api.esc(tt(T.exceso_aria))}">${tt(T.exceso)}</button>
          <button type="button" class="eleccion" data-s="defecto" aria-pressed="false" aria-label="${api.esc(tt(T.defecto_aria))}">${tt(T.defecto)}</button>
        </div>
      </div>`).join('')}
    </div>
    <p class="redondeo-aviso" id="aviso" role="status"></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;

  const aviso = contenedor.querySelector('#aviso');
  const sentido = {};
  contenedor.querySelectorAll('.tres-fila').forEach(fila => {
    const o = Number(fila.dataset.o);
    fila.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => {
      if (api.respondido()) return;
      sentido[o] = b.dataset.s;
      fila.querySelectorAll('[data-s]').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    }));
  });

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const respuestas = { redondeados: {}, excesos: {} };
    for (const o of ORDENES) {
      const v = leerEntero(contenedor.querySelector(`#tres-${o}`).value);
      if (v === null || !sentido[o]) { aviso.textContent = tt(T.incompleto); return; }
      respuestas.redondeados[o] = v;
      respuestas.excesos[o] = sentido[o] === 'exceso';
    }
    const acierto = esAciertoTres(item, respuestas);
    ev.target.style.display = 'none';
    aviso.textContent = '';
    for (const o of ORDENES) {
      const fila = contenedor.querySelector(`.tres-fila[data-o="${o}"]`);
      const bien = respuestas.redondeados[o] === item.redondeados[o] && respuestas.excesos[o] === item.excesos[o];
      fila.classList.add(bien ? 'tres-fila--bien' : 'tres-fila--mal');
      fila.querySelectorAll('input, button').forEach(e => { e.disabled = true; });
    }
    const filas = ORDENES.map(o => tt(T.fila)(num(item.n, api), o, num(item.redondeados[o], api), cifraDecisiva(item.n, o)));
    api.responder({ acierto, html: filas.join('<br>'), espera: 3600 });
  });
}

// ─── Ejercicio 3: estimar y cazar el error ──────────────────────────────────────

function montarEstimar(contenedor, item, api) {
  const { tt } = api;
  const T = TX.estimar;
  const fijo = item.ordenes.length === 1;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(fijo ? T.instr_fijo : T.instr_elige)}</p>
    <div class="operacion">${cuentaDe(item.op, item.terminos, api)}</div>
    ${fijo ? '' : '<div class="botones-numeros" id="ordenes"></div>'}
    <label class="instruccion" for="est">${tt(T.est_label)}</label>
    <input type="text" inputmode="numeric" id="est" class="redondeo-entero" autocomplete="off">
    <label class="instruccion" for="dif">${tt(T.dif_label)}</label>
    <input type="text" inputmode="numeric" id="dif" class="redondeo-entero" autocomplete="off">
    <p class="redondeo-aviso" id="aviso" role="status"></p>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;

  let orden = fijo ? item.ordenes[0] : null;
  const caja = contenedor.querySelector('#ordenes');
  if (caja) {
    caja.innerHTML = item.ordenes.map(o => `<button type="button" data-o="${o}" aria-pressed="false">${tt(T.orden_btn)(o)}</button>`).join('');
    caja.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      if (api.respondido()) return;
      orden = Number(b.dataset.o);
      caja.querySelectorAll('button').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    }));
  }
  const est = contenedor.querySelector('#est'), dif = contenedor.querySelector('#dif');
  const aviso = contenedor.querySelector('#aviso');

  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const miEst = leerEntero(est.value), miDif = leerEntero(dif.value);
    if (orden === null || miEst === null || miDif === null) { aviso.textContent = tt(T.falta); return; }
    const acierto = esAciertoEstimar(item, orden, miEst, miDif);
    ev.target.style.display = 'none';
    aviso.textContent = '';
    est.disabled = dif.disabled = true;
    caja?.querySelectorAll('button').forEach(b => { b.disabled = true; });
    const redondeados = item.terminos.map(t => num(redondear(t, orden), api));
    const cuenta = `${redondeados.join(` ${SIGNO[item.op]} `)} = ${num(item.estimaciones[orden], api)}`;
    api.responder({
      acierto,
      html: tt(T.estimar_fb)(orden, cuenta, num(item.exacto, api), num(diferenciaCon(item, orden), api)),
      espera: 3200,
    });
  });
}

function montarRazonable(contenedor, item, api) {
  const { tt } = api;
  const T = TX.estimar;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.pregunta_razonable)(cuentaDe(item.op, item.terminos, api), num(item.propuesto, api))}</p>
    <p class="instruccion">${tt(T.pista_razonable)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const acierto = esAciertoRazonable(item, valor === 'si');
      botones.marcar([item.razonable ? 'si' : 'no'], valor);
      const rs = item.terminos.map(t => num(redondear(t, item.orden), api));
      const est = `${rs.join(` ${SIGNO[item.op]} `)} = ${num(item.estimacion, api)}`;
      const propuesto = num(item.propuesto, api), exacto = num(item.exacto, api);
      const html = item.razonable
        ? tt(T.razonable_si)(est, propuesto)
        : tt(T.razonable_no[item.motivo])(est, propuesto, exacto, num(item.terminos[0], api), num(item.terminos[1], api));
      api.responder({ acierto, html, espera: 3200 });
    },
  });
}

function montarContexto(contenedor, item, api) {
  const { tt } = api;
  const T = TX.estimar;
  const frase = TX.estimar.contextos[item.contexto];
  contenedor.innerHTML = `
    <p class="instruccion">${tt(T.pregunta_contexto)(item.orden)}</p>
    <p class="redondeo-frase">${tt(frase)(num(item.n, api), '<span class="hueco hueco--corto" id="hueco">&nbsp;</span>')}</p>`;
  const hueco = contenedor.querySelector('#hueco');
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4',
    opciones: item.opciones.map(v => ({ valor: v, html: num(v, api) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const acierto = esAciertoContexto(item, valor);
      botones.marcar([item.correcto], valor);
      hueco.textContent = num(item.correcto, api);
      hueco.classList.add('hueco--bien');
      api.responder({
        acierto,
        html: tt(T.contexto_fb)(num(item.n, api), item.orden, num(item.correcto, api), cifraDecisiva(item.n, item.orden)),
        espera: 2800,
      });
    },
  });
}

function montarEstimacion(contenedor, item, api) {
  if (item.tipo === 'estimar') return montarEstimar(contenedor, item, api);
  if (item.tipo === 'razonable') return montarRazonable(contenedor, item, api);
  return montarContexto(contenedor, item, api);
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'redondeo',
  ejercicios: [
    {
      nombre: TX.recta.nombre,
      detalle: TX.recta.detalle,
      introduccion: TX.recta.introduccion,
      generar: generarRecta,
      clave: item => `${item.n}/${item.orden}`,
      montar: montarRecta,
    },
    {
      nombre: TX.tres.nombre,
      detalle: TX.tres.detalle,
      introduccion: TX.tres.introduccion,
      generar: generarTres,
      clave: item => String(item.n),
      montar: montarTres,
    },
    {
      nombre: TX.estimar.nombre,
      detalle: TX.estimar.detalle,
      introduccion: TX.estimar.introduccion,
      generar: generarEstimacion,
      montar: montarEstimacion,
    },
  ],
});
