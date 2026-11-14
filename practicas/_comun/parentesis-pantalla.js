// Pantalla de «Coloca los paréntesis» para cualquier aritmética (PU2, tarea 199): la interfaz
// de `practicas/parentesis/practica.js` (U1) sacada a funciones, con el motor
// (`parentesis-motor.js`) y los textos inyectados. Mismo comportamiento que la U1: 400 ms por
// línea de la resolución, hasta dos paréntesis seguidos por hueco, pista, borrar, el valor sin
// paréntesis ya encendido, «no agrupan / ya lo tenías / ya con otros», y al encenderlos todos
// `responder({ acierto: true, pistas, html, espera: 5000 })`. Los números (chips, resolución,
// objetivo) los pinta `aritmetica.html`, así que una fracción sale con raya (compacta en los chips)
// y un decimal con coma o punto según el idioma.
//
//   const P = crearPantalla(motor, propios)   // propios: textos { es, en } que mandan sobre TEXTOS
//   P.montarTodos, P.montarDiana               // el `montar` de un ejercicio
//   P.enunciadoTodos, P.enunciadoDiana         // su `enunciado` (la traducción tras responder)
//   P.explicaTodos(item, ctx, { consejo, extra }), P.explicaDiana(item, ctx, { consejo })
//   P.explicaImposibles(item, ctx, { consejo }) // explicaTodos + una agrupación que no se puede, con su motivo
//   P.agrupacionImposible(expresion), P.resumenHtml(item, textos, formas), P.crearEditor(…), P.TX
//
// Sin CSS en `_comun/estilos.css`: los estilos del editor (.expr, .celda, .hueco-p, .chip…)
// van en el `estilos.css` de cada práctica (copiados de `parentesis/estilos.css`).

import { TEXTOS } from './parentesis-textos.js';

const MS_POR_LINEA = 400;
const MAX_SEGUIDOS = 2;

const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });
const hayAlgo = p => [...p.abre, ...p.cierra].some(k => k > 0);
const cuenta = h => `<span class="cuenta">${h}</span>`;
const lista = filas => `<ul class="resumen">${filas.map(f => `<li>${f}</li>`).join('')}</ul>`;

/** Los textos comunes con los de la práctica por encima (`imposible` y `motivo`, razón a razón). */
export function mezclarTextos(propios = {}) {
  return {
    ...TEXTOS,
    ...propios,
    imposible: { ...TEXTOS.imposible, ...(propios.imposible ?? {}) },
    motivo: { ...TEXTOS.motivo, ...(propios.motivo ?? {}) },
  };
}

export function crearPantalla(M, propios = {}) {
  const TX = mezclarTextos(propios);
  const n$ = (v, idioma, opciones) => M.htmlValor(v, idioma, opciones);

  /** El editor: cada número con un hueco «(» a la izquierda y un hueco «)» a la derecha. */
  function crearEditor(contenedor, item, api, { alCambiar, activo }) {
    const { tt } = api;
    const n = item.numeros.length;
    const p = ceros(n);
    const caja = document.createElement('div');
    caja.className = 'expr';
    caja.setAttribute('role', 'group');
    const celdas = item.numeros.map((num, i) => {
      const visto = n$(num, api.idioma, { detras: false });
      const plano = visto.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return `
      <span class="celda">
        <button type="button" class="hueco-p" data-i="${i}" data-lado="abre" aria-label="${tt(TX.hueco_abre)} ${plano}"></button>
        <span class="num">${visto}</span>
        <button type="button" class="hueco-p" data-i="${i}" data-lado="cierra" aria-label="${tt(TX.hueco_cierra)} ${plano}"></button>
        ${i === n - 1 && item.exponente ? `<sup class="exp">${item.exponente}</sup>` : ''}
      </span>
      ${i < n - 1 ? `<span class="signo">${M.signo(item.operaciones[i], api.idioma)}</span>` : ''}`;
    });
    caja.innerHTML = celdas.join('');
    contenedor.append(caja);
    const botones = [...caja.querySelectorAll('.hueco-p')];

    const pintar = (rojo = false, resaltar = null) => {
      botones.forEach(b => {
        const k = p[b.dataset.lado][Number(b.dataset.i)];
        b.textContent = (b.dataset.lado === 'abre' ? '(' : ')').repeat(k);
        b.classList.toggle('hueco-p--puesto', k > 0);
        b.classList.toggle('hueco-p--rojo', rojo && k > 0);
        b.classList.toggle('hueco-p--nuevo', resaltar !== null && resaltar.i === Number(b.dataset.i) && resaltar.lado === b.dataset.lado);
      });
    };
    pintar();

    botones.forEach(b => b.addEventListener('click', () => {
      if (!activo()) return;
      const i = Number(b.dataset.i), lado = b.dataset.lado;
      p[lado][i] = (p[lado][i] + 1) % (MAX_SEGUIDOS + 1);
      pintar();
      alCambiar();
    }));

    return {
      p,
      pintar,
      poner(nuevo, resaltar = null) {
        p.abre.splice(0, n, ...nuevo.abre);
        p.cierra.splice(0, n, ...nuevo.cierra);
        pintar(false, resaltar);
      },
      borrar() { this.poner(ceros(n)); },
      colocacion: () => ({ abre: [...p.abre], cierra: [...p.cierra] }),
      bloquear() { botones.forEach(b => { b.disabled = true; }); },
    };
  }

  /** La expresión sin paréntesis, fija (el ítem ya respondido). */
  const exprFija = (item, idioma) => `<div class="expr expr--fija">${M.htmlArbol(M.sinParentesis(M.expresionDe(item)), idioma)}</div>`;

  /**
   * Cada resultado con una forma de conseguirlo. `formas` (Map clave → colocación del alumno, o
   * null para la de sin paréntesis) manda; si no está, la agrupación de menos paréntesis.
   */
  function resumenHtml(item, { idioma }, formas = null) {
    const e = M.expresionDe(item);
    const filas = item.resultados.map(v => {
      const k = M.clave(v);
      const forma = formas?.has(k)
        ? (formas.get(k) ? M.htmlColocacion(e, formas.get(k), idioma) : M.htmlArbol(M.sinParentesis(e), idioma))
        : M.htmlArbol(M.arbolQueDa(e, v), idioma);
      return `<li><span class="cuenta">${forma} = ${n$(v, idioma)}</span></li>`;
    });
    return `<ul class="resumen">${filas.join('')}</ul>`;
  }

  // ─── Encontrar todos los resultados ──────────────────────────────────────────

  const enunciadoTodos = (item, { tt }) => `<p class="instruccion">${tt(TX.instruccion_todos)}</p>`;

  function montarTodos(contenedor, item, api) {
    const { tt } = api;
    const e = M.expresionDe(item);
    const total = item.resultados.length;

    if (api.respondido()) {
      contenedor.innerHTML = `${exprFija(item, api.idioma)}
        <p class="instruccion">${tt(TX.todos_titulo)}</p>${resumenHtml(item, api, null)}`;
      return;
    }

    contenedor.innerHTML = enunciadoTodos(item, api);
    const formas = new Map();            // clave del valor → colocación del alumno (null: sin paréntesis)
    const encontrados = new Set();       // claves
    let pistas = 0, ronda = 0, terminado = false;

    const editor = crearEditor(contenedor, item, api, { alCambiar: () => evaluarColocacion(), activo: () => !terminado });
    contenedor.insertAdjacentHTML('beforeend', `
      <div class="acciones">
        <button type="button" class="secundario" id="pista">${tt(TX.pista)}</button>
        <button type="button" class="secundario" id="borrar">${tt(TX.borrar)}</button>
      </div>
      <div class="resolucion" id="resolucion" aria-live="polite"></div>
      <p class="mensaje" id="mensaje" aria-live="polite"></p>
      <p class="contador-chips" id="contador-chips"></p>
      <div class="chips" id="chips"></div>`);
    const resolucion = contenedor.querySelector('#resolucion');
    const mensaje = contenedor.querySelector('#mensaje');
    const chips = contenedor.querySelector('#chips');
    const contador = contenedor.querySelector('#contador-chips');

    // Un chip por valor: data-k es su posición en `item.resultados` (nunca el valor: 3/4 y 6/8).
    const indice = new Map(item.resultados.map((v, i) => [M.clave(v), i]));
    chips.innerHTML = item.resultados.map((v, i) => `<span class="chip" data-k="${i}">${n$(v, api.idioma, { compacta: true })}</span>`).join('');
    const encender = v => {
      const k = M.clave(v);
      encontrados.add(k);
      chips.querySelector(`[data-k="${indice.get(k)}"]`)?.classList.add('chip--on');
      contador.textContent = tt(TX.resultados)(encontrados.size, total);
    };
    formas.set(M.clave(item.sinParentesis), null);
    encender(item.sinParentesis);

    function mostrarMensaje(texto, clase = '') {
      mensaje.className = `mensaje ${clase}`.trim();
      mensaje.innerHTML = texto;
    }

    function limpiarResolucion() {
      ronda++;
      resolucion.innerHTML = '';
      mostrarMensaje('');
    }

    function evaluarColocacion(resaltado = null) {
      limpiarResolucion();
      const colocada = editor.colocacion();
      const r = M.interpretar(e, colocada);
      if (r.error) {
        editor.pintar(!resaltado && hayAlgo(colocada), resaltado);
        if (r.error === 'desequilibrados') mostrarMensaje(tt(TX.desequilibrados), 'mensaje--aviso');
        return;
      }
      editor.pintar(false, resaltado);
      const ev = M.evaluar(r.arbol);
      const miRonda = ronda;
      const lineas = ev.pasos;
      let k = 0;
      const siguienteLinea = () => {
        if (miRonda !== ronda || !contenedor.isConnected) return;
        const ultima = k === lineas.length - 1;
        const mala = ultima && ev.valor === undefined;
        resolucion.insertAdjacentHTML('beforeend',
          `<div class="paso${mala ? ' paso--mal' : ''}${ultima && !mala ? ' paso--final' : ''}">${k ? '= ' : ''}${M.htmlSecuencia(lineas[k], api.idioma)}</div>`);
        k++;
        if (!ultima) { setTimeout(siguienteLinea, MS_POR_LINEA); return; }
        terminarLineas();
      };
      const terminarLineas = () => {
        if (ev.valor === undefined) {
          const { razon, a, op, b } = ev.invalido;
          mostrarMensaje(tt(TX.imposible[razon])(M.htmlOperacion(a, op, b, api.idioma)), 'mensaje--mal');
          return;
        }
        const kv = M.clave(ev.valor);
        if (encontrados.has(kv)) {
          const cual = r.redundantes ? TX.no_agrupan
            : M.mismoValor(ev.valor, item.sinParentesis) ? TX.ya_lo_tenias : TX.ya_con_otros;
          mostrarMensaje(tt(cual), 'mensaje--neutro');
          return;
        }
        formas.set(kv, colocada);
        encender(ev.valor);
        mostrarMensaje(tt(TX.nuevo), 'mensaje--bien');
        if (encontrados.size === total) setTimeout(terminar, 900);
      };
      siguienteLinea();
    }

    function terminar() {
      if (terminado || api.respondido()) return;
      terminado = true;
      editor.bloquear();
      contenedor.querySelectorAll('.acciones button').forEach(b => { b.disabled = true; });
      api.responder({
        acierto: true,
        pistas,
        html: textos => `${textos.tt(TX.todos_titulo)}${resumenHtml(item, textos, formas)}`,
        espera: 5000,
      });
    }

    contenedor.querySelector('#borrar').addEventListener('click', () => {
      if (terminado) return;
      editor.borrar();
      limpiarResolucion();
    });

    contenedor.querySelector('#pista').addEventListener('click', () => {
      if (terminado) return;
      const faltan = new Set(item.resultados.map(M.clave).filter(k => !encontrados.has(k)));
      const sig = M.pistaPara(e, editor.colocacion(), faltan);
      if (!sig) return;
      pistas++;
      const antes = editor.colocacion();
      let cambiado = null;
      for (const lado of ['abre', 'cierra']) sig[lado].forEach((k, i) => { if (k !== antes[lado][i]) cambiado = { i, lado }; });
      editor.poner(sig, cambiado);
      evaluarColocacion(cambiado);
    });

    contador.textContent = tt(TX.resultados)(encontrados.size, total);
  }

  // ─── Una diana ────────────────────────────────────────────────────────────────

  const enunciadoDiana = (item, { tt, idioma }) => `
      <p class="instruccion">${tt(TX.objetivo)}</p>
      <div class="objetivo">${n$(item.objetivo, idioma)}</div>`;

  function montarDiana(contenedor, item, api) {
    const { tt } = api;
    const e = M.expresionDe(item);

    contenedor.innerHTML = enunciadoDiana(item, api);
    if (api.respondido()) {
      contenedor.insertAdjacentHTML('beforeend', exprFija(item, api.idioma));
      return;
    }
    const editor = crearEditor(contenedor, item, api, { alCambiar: () => { mensaje.innerHTML = ''; editor.pintar(); }, activo: () => !api.respondido() });
    contenedor.insertAdjacentHTML('beforeend', `
      <div class="acciones">
        <button type="button" class="secundario" id="borrar">${tt(TX.borrar)}</button>
      </div>
      <p class="mensaje mensaje--aviso" id="mensaje" aria-live="polite"></p>
      <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`);
    const mensaje = contenedor.querySelector('#mensaje');

    contenedor.querySelector('#borrar').addEventListener('click', () => {
      if (api.respondido()) return;
      editor.borrar();
      mensaje.innerHTML = '';
    });

    contenedor.querySelector('#comprobar').addEventListener('click', ev => {
      if (api.respondido()) return;
      const colocada = editor.colocacion();
      const r = M.interpretar(e, colocada);
      if (r.error) {
        editor.pintar(true);
        mensaje.innerHTML = tt(TX.sin_cerrar);
        return;
      }
      editor.bloquear();
      contenedor.querySelectorAll('.acciones button').forEach(b => { b.disabled = true; });
      ev.target.hidden = true;
      const suyo = M.evaluar(r.arbol);
      const suyoTexto = ({ tt: t2, idioma }) => `<p>${t2(TX.tu_agrupacion)} ${cuenta(M.htmlColocacion(e, colocada, idioma))}</p>
        <div class="resolucion resolucion--fija">${M.htmlPasos(suyo.pasos, idioma)}</div>`;
      if (suyo.valor !== undefined && M.mismoValor(suyo.valor, item.objetivo)) return api.responder({ acierto: true, html: suyoTexto, espera: 2600 });
      const diagnostico = ({ tt: t2, idioma }) => {
        if (suyo.valor !== undefined) return `<p>${t2(TX.da)} ${cuenta(n$(suyo.valor, idioma))}, ${t2(TX.no)} ${cuenta(n$(item.objetivo, idioma))}.</p>`;
        const { razon, a, op, b } = suyo.invalido;
        return `<p>${t2(TX.imposible[razon])(M.htmlOperacion(a, op, b, idioma))}</p>`;
      };
      const buena = M.arbolQueDa(e, item.objetivo);
      const solucion = M.evaluar(buena);
      api.responder({
        acierto: false,
        respuesta: M.textoColocacion(e, colocada),
        html: textos => `${suyoTexto(textos)}${diagnostico(textos)}<p>${textos.tt(TX.una_que_da)(n$(item.objetivo, textos.idioma))} ${cuenta(M.htmlArbol(buena, textos.idioma))}</p>
          <div class="resolucion resolucion--fija">${M.htmlPasos(solucion.pasos, textos.idioma)}</div>`,
      });
    });
  }

  // ─── «No lo sé» ───────────────────────────────────────────────────────────────

  /** Una agrupación (la de menos paréntesis) que da `valor`, resuelta en una línea. */
  const cadenaQueDa = (e, valor, idioma) => M.cadenaPasos(M.evaluar(M.arbolQueDa(e, valor)).pasos, idioma);

  /** Todos los resultados, cada uno con una agrupación que lo consigue, y la lista de valores. */
  function explicaTodos(item, { tt, idioma }, { consejo = TX.consejo_todos, extra = '' } = {}) {
    const e = M.expresionDe(item);
    const filas = item.resultados.map(v => cuenta(cadenaQueDa(e, v, idioma)));
    const valores = item.resultados.map(v => cuenta(n$(v, idioma)));
    const enLista = valores.length > 1 ? `${valores.slice(0, -1).join(', ')} ${tt(TX.y)} ${valores.at(-1)}` : valores[0];
    return `<p>${tt(consejo)}</p>${extra}${lista(filas)}<p>${tt(TX.la_respuesta_es)} ${enLista}.</p>`;
  }

  /** Una agrupación que no se puede calcular (la de menos paréntesis; entre 0, la última opción), o null. */
  function agrupacionImposible(e) {
    const n = e.numeros.length;
    const parentesis = a => { const c = M.colocacion(a, n); return [...c.abre, ...c.cierra].reduce((x, y) => x + y, 0); };
    const malas = M.arboles(e)
      .map(a => ({ a, r: M.evaluar(a) }))
      .filter(x => x.r.invalido && x.r.invalido.razon !== 'grande')
      .sort((x, y) => (x.r.invalido.razon === 'cero') - (y.r.invalido.razon === 'cero') || parentesis(x.a) - parentesis(y.a));
    return malas.length ? { arbol: malas[0].a, ...malas[0].r.invalido } : null;
  }

  /** Como explicaTodos, con una agrupación que no cuenta y por qué (si la hay). */
  function explicaImposibles(item, ctx, { consejo = TX.consejo_todos } = {}) {
    const { tt, idioma } = ctx;
    const mala = agrupacionImposible(M.expresionDe(item));
    const extra = mala && TX.motivo[mala.razon]
      ? `<p>${tt(TX.por_ejemplo)} ${cuenta(M.htmlArbol(mala.arbol, idioma))} ${tt(TX.no_cuenta)} ${tt(TX.motivo[mala.razon])(cuenta(M.htmlOperacion(mala.a, mala.op, mala.b, idioma)), mala.a, mala.b)}.</p>`
      : '';
    return explicaTodos(item, ctx, { consejo, extra });
  }

  /** La diana: vale cualquier colocación que dé el objetivo; se enseña una, resuelta. */
  function explicaDiana(item, { tt, idioma }, { consejo = TX.consejo_diana } = {}) {
    const e = M.expresionDe(item);
    const arbol = M.arbolQueDa(e, item.objetivo);
    const objetivo = n$(item.objetivo, idioma);
    const texto = typeof consejo[idioma] === 'function' ? consejo[idioma](objetivo) : tt(consejo);
    return `<p>${texto}</p><p>${cuenta(cadenaQueDa(e, item.objetivo, idioma))}</p>`
      + `<p>${tt(TX.la_respuesta_es)} ${cuenta(M.htmlArbol(arbol, idioma))}.</p>`;
  }

  return {
    TX, crearEditor, resumenHtml, enunciadoTodos, montarTodos, enunciadoDiana, montarDiana,
    explicaTodos, explicaImposibles, explicaDiana, agrupacionImposible, cadenaQueDa,
  };
}
