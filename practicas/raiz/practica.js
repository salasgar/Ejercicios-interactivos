// Práctica «Raíz cuadrada con cuadrados» (repaso de la unidad 1): la interfaz.
// La lógica pura (generadores) está en logica.js y los textos en textos.js.
// El contrato de la base está explicado en ../plantilla/practica.js.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarForma, generarSinDibujo, generarProblema, fichasEnLado, LADO_MAXIMO,
} from './logica.js';

const cuad = k => `${k}<sup>2</sup>`;

/** La explicación de un ítem con su raíz y su resto: entre qué cuadrados está, lo que sobra, la comprobación. */
function explicacion(n, k, r, api) {
  const { tt } = api;
  const x = TX.comun;
  if (r === 0) return tt(x.exacta)(n, k);
  return `${tt(x.entre)(n, k)}. ${tt(x.sobran)(n, k, r)} ${tt(x.comprobacion)(n, k, r)} ${tt(x.vocab)(n, k, r)}`;
}

// ─── Teclado propio con uno o dos campos ──────────────────────────────────────────

/**
 * Campos numéricos (se toca el que se quiere rellenar) y un teclado de cifras.
 * Se añade a `destino`. Devuelve valores() (null si está vacío), lleno(),
 * bloquear() y marcar(i, bien).
 */
function teclado(destino, etiquetas, alCambiar) {
  const caja = document.createElement('div');
  const textos = etiquetas.map(() => '');
  let activo = 0;
  caja.innerHTML = `
    <div class="campos">
      ${etiquetas.map((e, i) => `<button type="button" class="campo" data-i="${i}"><span class="campo__etiqueta">${e}</span><output class="campo__valor"></output></button>`).join('')}
    </div>
    <div class="botones-numeros teclado">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<button type="button" data-d="${d}">${d}</button>`).join('')}
      <button type="button" data-d="borrar" class="teclado__borrar" aria-label="⌫">⌫</button>
    </div>`;
  const campos = [...caja.querySelectorAll('.campo')];
  let bloqueado = false;
  const pintar = () => {
    campos.forEach((c, i) => {
      const v = c.querySelector('.campo__valor');
      v.textContent = textos[i] || '…';
      c.classList.toggle('campo--vacio', textos[i] === '');
      c.classList.toggle('campo--activo', !bloqueado && i === activo && etiquetas.length > 1);
    });
  };
  campos.forEach((c, i) => c.addEventListener('click', () => { if (!bloqueado) { activo = i; pintar(); } }));
  caja.querySelector('.teclado').addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b || bloqueado) return;
    if (b.dataset.d === 'borrar') {
      if (textos[activo] === '' && activo > 0) activo--;
      else textos[activo] = textos[activo].slice(0, -1);
    } else {
      let t = textos[activo] === '0' ? '' : textos[activo];
      if (t.length < 3) t += b.dataset.d;
      textos[activo] = t;
      if (t.length === 2 && activo < textos.length - 1) activo++;
    }
    pintar();
    alCambiar();
  });
  pintar();
  destino.append(caja);
  return {
    valores: () => textos.map(t => (t === '' ? null : Number(t))),
    lleno: () => textos.every(t => t !== ''),
    bloquear() { bloqueado = true; caja.querySelectorAll('button').forEach(b => { b.disabled = true; }); pintar(); },
    marcar(i, bien) { campos[i].classList.add(bien ? 'campo--bien' : 'campo--mal'); },
  };
}

// ─── Ejercicio 1: forma el cuadrado ───────────────────────────────────────────────

const PASO = 20;          // lo que ocupa una ficha (18 px + 2 de hueco)
const COLUMNAS = LADO_MAXIMO;
const SEPARACION = 16;    // hueco entre el cuadrado y las fichas que sobran

function montarForma(contenedor, item, api) {
  const { tt } = api;
  const { n } = item;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.forma.instruccion)(n)}</p>
    <div class="zona" id="zona"><div class="marco" id="marco"></div></div>
    <div class="selector-lado">
      <span class="selector-lado__nombre">${tt(TX.forma.lado)}</span>
      <div id="selector"></div>
    </div>
    <p class="estado-cuadrado" id="estado" aria-live="polite"></p>
    <button type="button" class="comprobar" id="este">${tt(TX.forma.este)}</button>
    <div id="fase2" hidden>
      <p class="instruccion">${tt(TX.forma.cuantas_sobran)}</p>
      <div id="teclado"></div>
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>
    </div>`;
  const zona = contenedor.querySelector('#zona');
  const marco = contenedor.querySelector('#marco');
  const estado = contenedor.querySelector('#estado');
  zona.style.width = `${COLUMNAS * PASO}px`;
  const piezas = Array.from({ length: n }, () => {
    const p = document.createElement('span');
    p.className = 'pieza';
    zona.append(p);
    return p;
  });

  // Coloca las fichas: las primeras en el cuadrado de lado s y el resto aparte, debajo.
  const colocar = s => {
    const { dentro, sobran, completo } = fichasEnLado(n, s);
    piezas.forEach((p, i) => {
      let x, y;
      if (i < dentro) { x = (i % s) * PASO; y = Math.floor(i / s) * PASO; }
      else { const j = i - dentro; x = (j % COLUMNAS) * PASO; y = s * PASO + SEPARACION + Math.floor(j / COLUMNAS) * PASO; }
      p.style.transform = `translate(${x}px, ${y}px)`;
      p.className = `pieza${i >= dentro ? ' pieza--fuera' : completo ? '' : ' pieza--roja'}`;
    });
    marco.style.width = `${s * PASO - 2}px`;
    marco.style.height = `${s * PASO - 2}px`;
    marco.className = `marco ${completo ? 'marco--completo' : 'marco--incompleto'}`;
    zona.style.height = `${s * PASO + (sobran ? SEPARACION + Math.ceil(sobran / COLUMNAS) * PASO : 0)}px`;
    estado.textContent = tt(completo ? TX.forma.completo : TX.forma.incompleto);
    estado.className = `estado-cuadrado ${completo ? 'estado-cuadrado--si' : 'estado-cuadrado--no'}`;
  };
  const lado = pasos(contenedor.querySelector('#selector'), {
    valor: 1, min: 1, max: LADO_MAXIMO, nombre: tt(TX.forma.lado), alCambiar: colocar,
  });
  colocar(1);

  const este = contenedor.querySelector('#este');
  const fase2 = contenedor.querySelector('#fase2');
  const comprobar = fase2.querySelector('#comprobar');
  let tec = null;

  este.addEventListener('click', () => {
    if (api.respondido()) return;
    const s = lado.valor();
    lado.bloquear();
    este.hidden = true;
    if (s !== item.raiz) {
      const motivo = s > item.raiz ? TX.forma.lado_grande : TX.forma.lado_pequeno;
      return api.responder({ acierto: false, html: `${tt(motivo)(s, n)} ${explicacion(n, item.raiz, item.resto, api)}`, espera: 4500 });
    }
    fase2.hidden = false;
    tec = teclado(fase2.querySelector('#teclado'), [tt(TX.forma.sobran)], () => { comprobar.disabled = !tec.lleno(); });
  });

  comprobar.addEventListener('click', () => {
    if (api.respondido() || !tec?.lleno()) return;
    const [tuyo] = tec.valores();
    const acierto = tuyo === item.resto;
    tec.bloquear();
    tec.marcar(0, acierto);
    comprobar.hidden = true;
    const base = explicacion(n, item.raiz, item.resto, api);
    api.responder({ acierto, html: acierto ? base : `${tt(TX.forma.resto_mal)(tuyo, n, item.raiz, item.resto)} ${base}`, espera: 3200 });
  });
}

// ─── Ejercicio 2: sin dibujo ────────────────────────────────────────────────────────

function montarSinDibujo(contenedor, item, api) {
  if (item.tipo === 'puede') return montarPuede(contenedor, item, api);
  const { tt } = api;
  const exacta = item.tipo === 'exacta';
  contenedor.innerHTML = `
    <p class="instruccion">${exacta ? tt(TX.sin.exacta_pregunta)(item.n) : tt(TX.sin.entera_pregunta)(item.n)}</p>
    <div class="operacion">${exacta ? `√${item.n}` : item.n}</div>
    ${exacta ? '' : `<p class="ayuda">${tt(TX.sin.entera_ayuda)}</p>`}
    <div id="teclado"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const comprobar = contenedor.querySelector('#comprobar');
  const etiquetas = exacta ? [tt(TX.sin.exacta_campo)] : [tt(TX.sin.campo_raiz), tt(TX.sin.campo_resto)];
  const tec = teclado(contenedor.querySelector('#teclado'), etiquetas, () => { comprobar.disabled = !tec.lleno(); });

  comprobar.addEventListener('click', () => {
    if (api.respondido() || !tec.lleno()) return;
    const [ku, ru] = tec.valores();
    tec.bloquear();
    comprobar.hidden = true;
    const n = item.n;
    if (exacta) {
      const acierto = ku === item.raiz;
      tec.marcar(0, acierto);
      let html = tt(TX.sin.exacta_bien)(n, item.raiz);
      if (!acierto) html = `${ku * 2 === n ? tt(TX.sin.exacta_mitad)(ku, n) : tt(TX.sin.exacta_mal)(ku, n)} ${html}`;
      return api.responder({ acierto, html, espera: 3000 });
    }
    const bienRaiz = ku === item.raiz, bienResto = ru === item.resto;
    tec.marcar(0, bienRaiz);
    tec.marcar(1, bienResto);
    let html = explicacion(n, item.raiz, item.resto, api);
    if (!(bienRaiz && bienResto) && ku * ku + ru === n && ru > 2 * ku) html = `${tt(TX.sin.resto_grande)(n, ku, ru)} ${html}`;
    api.responder({ acierto: bienRaiz && bienResto, html, espera: 3600 });
  });
}

function montarPuede(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.sin.puede_pregunta)(item.raiz, item.resto)}</p>`;
  const buena = item.puede ? 'si' : 'no';
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);
      api.responder({
        acierto: valor === buena,
        html: tt(item.puede ? TX.sin.puede_si : TX.sin.puede_no)(item.raiz, item.resto),
        espera: 4000,
      });
    },
  });
}

// ─── Ejercicio 3: problemas ─────────────────────────────────────────────────────────

function montarProblema(contenedor, item, api) {
  const { tt } = api;
  const enunciado = TX.prob[item.plantilla][item.variante];
  contenedor.innerHTML = `
    <p class="enunciado">${tt(enunciado)(item.n)}</p>
    <div id="teclado"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const comprobar = contenedor.querySelector('#comprobar');
  const campoLado = item.plantilla === 'sillas' ? (item.variante === 0 ? TX.prob.campo_sillas_fila : TX.prob.campo_filas) : TX.prob.campo_lado;
  const etiquetas = item.dosCampos ? [tt(campoLado), tt(TX.prob.campo_sobran)] : [tt(campoLado)];
  const tec = teclado(contenedor.querySelector('#teclado'), etiquetas, () => { comprobar.disabled = !tec.lleno(); });

  comprobar.addEventListener('click', () => {
    if (api.respondido() || !tec.lleno()) return;
    const [a, b = null] = tec.valores();
    tec.bloquear();
    comprobar.hidden = true;
    const bienLado = a === item.raiz, bienResto = !item.dosCampos || b === item.resto;
    tec.marcar(0, bienLado);
    if (item.dosCampos) tec.marcar(1, bienResto);
    const acierto = bienLado && bienResto;
    const buena = `${explicacion(item.n, item.raiz, item.resto, api)} ${tt(TX.prob.respuesta)(item.raiz, item.resto, item.dosCampos)}`;
    api.responder({ acierto, html: acierto ? buena : `${tt(TX.prob.tu_respuesta)(a, b)} ${buena}`, espera: 4200 });
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────────

arrancar({
  slug: 'raiz',
  ejercicios: [
    {
      nombre: TX.forma.nombre,
      detalle: TX.forma.detalle,
      introduccion: TX.forma.introduccion,
      generar: generarForma,
      clave: item => String(item.n),
      montar: montarForma,
    },
    {
      nombre: TX.sin.nombre,
      detalle: TX.sin.detalle,
      introduccion: TX.sin.introduccion,
      generar: generarSinDibujo,
      montar: montarSinDibujo,
    },
    {
      nombre: TX.prob.nombre,
      detalle: TX.prob.detalle,
      generar: generarProblema,
      montar: montarProblema,
    },
  ],
});
