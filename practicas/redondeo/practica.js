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

const enunciadoRecta = (item, textos) => `
    <p class="instruccion">${textos.tt(TX.recta.pregunta)(num(item.n, textos), item.orden)}</p>
    <div class="operacion">${num(item.n, textos)}</div>`;

function montarRecta(contenedor, item, api) {
  const { tt } = api;
  const T = TX.recta;
  const [inf, sup] = item.marcas;
  contenedor.innerHTML = `${enunciadoRecta(item, api)}
    <p class="instruccion redondeo-paso">${tt(T.paso1)}</p>
    <div class="recta" id="recta" role="button" tabindex="0" aria-label="${api.esc(tt(T.paso1).replace(/<[^>]+>/g, ''))}">
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
      const html = textos => {
        const { tt } = textos;
        let h = tt(T.entre)(num(item.n, textos), num(inf, textos), num(sup, textos));
        if (item.medio) h += tt(T.medio)(num(item.redondeado, textos));
        else h += item.exceso ? tt(T.sube)(num(item.redondeado, textos), c) : tt(T.baja)(num(item.redondeado, textos), c);
        if (!buenaPos) h += tt(T.posicion_mal)(num(item.n, textos));
        return h;
      };
      api.responder({ acierto, html, espera: 2600 });
    },
  });
}

// ─── Ejercicio 2: a tres órdenes ────────────────────────────────────────────────

const enunciadoTres = (item, textos) => `
    <p class="instruccion">${textos.tt(TX.tres.pregunta)(num(item.n, textos))}</p>
    <div class="operacion">${num(item.n, textos)}</div>
    <p class="instruccion">${textos.tt(TX.tres.leyenda)}</p>`;

function montarTres(contenedor, item, api) {
  const { tt } = api;
  const T = TX.tres;
  contenedor.innerHTML = `${enunciadoTres(item, api)}
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
    const html = textos => ORDENES.map(o => textos.tt(T.fila)(num(item.n, textos), o, num(item.redondeados[o], textos), cifraDecisiva(item.n, o))).join('<br>');
    api.responder({ acierto, html, espera: 3600 });
  });
}

// ─── Ejercicio 3: estimar y cazar el error ──────────────────────────────────────

const enunciadoEstimar = (item, textos) => `
    <p class="instruccion">${textos.tt(item.ordenes.length === 1 ? TX.estimar.instr_fijo : TX.estimar.instr_elige)}</p>
    <div class="operacion">${cuentaDe(item.op, item.terminos, textos)}</div>`;

function montarEstimar(contenedor, item, api) {
  const { tt } = api;
  const T = TX.estimar;
  const fijo = item.ordenes.length === 1;
  contenedor.innerHTML = `${enunciadoEstimar(item, api)}
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
    const html = textos => {
      const redondeados = item.terminos.map(t => num(redondear(t, orden), textos));
      const cuenta = `${redondeados.join(` ${SIGNO[item.op]} `)} = ${num(item.estimaciones[orden], textos)}`;
      return textos.tt(T.estimar_fb)(orden, cuenta, num(item.exacto, textos), num(diferenciaCon(item, orden), textos));
    };
    api.responder({
      acierto,
      html,
      espera: 3200,
    });
  });
}

const enunciadoRazonable = (item, textos) => `
    <p class="instruccion">${textos.tt(TX.estimar.pregunta_razonable)(cuentaDe(item.op, item.terminos, textos), num(item.propuesto, textos))}</p>
    <p class="instruccion">${textos.tt(TX.estimar.pista_razonable)}</p>`;

function montarRazonable(contenedor, item, api) {
  const T = TX.estimar;
  contenedor.innerHTML = enunciadoRazonable(item, api);
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const acierto = esAciertoRazonable(item, valor === 'si');
      botones.marcar([item.razonable ? 'si' : 'no'], valor);
      const html = textos => {
        const { tt } = textos;
        const rs = item.terminos.map(t => num(redondear(t, item.orden), textos));
        const est = `${rs.join(` ${SIGNO[item.op]} `)} = ${num(item.estimacion, textos)}`;
        const propuesto = num(item.propuesto, textos), exacto = num(item.exacto, textos);
        return item.razonable
          ? tt(T.razonable_si)(est, propuesto)
          : tt(T.razonable_no[item.motivo])(est, propuesto, exacto, num(item.terminos[0], textos), num(item.terminos[1], textos));
      };
      api.responder({ acierto, html, espera: 3200 });
    },
  });
}

const enunciadoContexto = (item, textos) => `
    <p class="instruccion">${textos.tt(TX.estimar.pregunta_contexto)(item.orden)}</p>
    <p class="redondeo-frase">${textos.tt(TX.estimar.contextos[item.contexto])(num(item.n, textos), '<span class="hueco hueco--corto" id="hueco">&nbsp;</span>')}</p>`;

function montarContexto(contenedor, item, api) {
  const T = TX.estimar;
  contenedor.innerHTML = enunciadoContexto(item, api);
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
        html: textos => textos.tt(T.contexto_fb)(num(item.n, textos), item.orden, num(item.correcto, textos), cifraDecisiva(item.n, item.orden)),
        espera: 2800,
      });
    },
  });
}

function enunciadoEstimacion(item, textos) {
  if (item.tipo === 'estimar') return enunciadoEstimar(item, textos);
  if (item.tipo === 'razonable') return enunciadoRazonable(item, textos);
  return enunciadoContexto(item, textos);
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
      enunciado: enunciadoRecta,
    },
    {
      nombre: TX.tres.nombre,
      detalle: TX.tres.detalle,
      introduccion: TX.tres.introduccion,
      generar: generarTres,
      clave: item => String(item.n),
      montar: montarTres,
      enunciado: enunciadoTres,
    },
    {
      nombre: TX.estimar.nombre,
      detalle: TX.estimar.detalle,
      introduccion: TX.estimar.introduccion,
      generar: generarEstimacion,
      montar: montarEstimacion,
      enunciado: enunciadoEstimacion,
    },
  ],
});
