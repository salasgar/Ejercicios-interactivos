// PRÁCTICA «Porcentaje, fracción y decimal» (unidad 7): los porcentajes fáciles, escribir de otra forma,
// unir las tres escrituras y ordenar. Cuatro ejercicios.
//
// Reparto de ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero } from '../_comun/piezas.js';
import { htmlRaya } from '../_comun/fracciones.js';
import { deTexto } from '../_comun/decimales.js';
import {
  claveDe, txt, generarFaciles, generarOtraForma, generarUne, generarOrdena,
  evaluarOtraForma, evaluarUne, evaluarOrdena,
} from './logica.js';
import { TX, explicaFaciles, explicaOtraForma, explicaUne, explicaOrdena } from './textos.js';

const CUADRO = '<span class="hueco-tp">□</span>';
const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const feedback = (explica, item, error, ctx) =>
  `${ctx.tt(TX.porQue[error] ?? TX.porQue['otra-respuesta'])} ${explica(item, ctx)}`;

/** Lo que escribe el alumno en un campo de porcentaje o decimal, sin espacios ni «%». */
const limpiar = texto => String(texto).replace(/[\s  ]+/g, '').replace(/%$/, '');

// ─── Ejercicio 1: los porcentajes fáciles ────────────────────────────────────────────────

const enunciado1 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej1.instruccion[item.sentido])}</p>
  <div class="operacion">${txt(item.dado, idioma)}</div>`;

function montarFaciles(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: txt(o.e, api.idioma) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.correcta ? undefined : elegida.error,
        respuesta: txt(elegida.e, 'es').replace(/<[^>]+>/g, ''),
        espera: 2800,
        html: ctx => (elegida.correcta ? `${ctx.tt(TX.correcto)} ${explicaFaciles(item, ctx)}` : feedback(explicaFaciles, item, elegida.error, ctx)),
      });
    },
  });
}

// ─── Ejercicio 2: escríbelo de otra forma ────────────────────────────────────────────────

const enunciado2 = (item, { tt, idioma }) => {
  const hueco = item.a === 'f' ? htmlRaya(CUADRO, CUADRO) : CUADRO;
  return `<p class="instruccion">${tt(TX.ej2.instruccion[item.tipo])}</p>
    <div class="operacion">${txt(item.desde, idioma)} = ${hueco}</div>`;
};

function montarOtraForma(contenedor, item, api) {
  const { tt } = api;
  const terminar = (res, respuesta) => api.responder({
    acierto: res.acierto,
    error: res.acierto ? undefined : res.error,
    respuesta,
    espera: 3000,
    html: ctx => (res.acierto ? `${ctx.tt(TX.correcto)} ${explicaOtraForma(item, ctx)}` : feedback(explicaOtraForma, item, res.error, ctx)),
  });
  if (item.a === 'f') {
    contenedor.innerHTML = `<p class="instruccion">${tt(TX.ej2.instruccion[item.tipo])}</p>
      <div class="operacion">${txt(item.desde, api.idioma)} = ${htmlRaya('<span data-num></span>', '<span data-den></span>')}</div>
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
    const boton = contenedor.querySelector('#comprobar');
    const campos = ['data-num', 'data-den'].map((a, i) => campoNumero(contenedor.querySelector(`[${a}]`), {
      nombre: tt(i === 0 ? TX.campos.numerador : TX.campos.denominador), cifras: 4, idioma: api.idioma, alEnviar: comprobar,
    }));
    const actualizar = () => { boton.disabled = api.respondido() || campos.some(c => c.valor() === null); };
    campos.forEach(c => c.elemento.addEventListener('input', actualizar));
    boton.addEventListener('click', comprobar);
    function comprobar() {
      if (api.respondido() || campos.some(c => c.valor() === null)) return;
      const [num, den] = campos.map(c => c.valor());
      campos.forEach(c => c.bloquear());
      boton.hidden = true;
      const res = evaluarOtraForma(item, { num, den }) ?? { acierto: false, error: 'otra-respuesta' };
      terminar(res, `${num}/${den}`);
    }
    return;
  }
  const nombre = api.esc(tt(item.a === 'd' ? TX.campos.decimal : TX.campos.porcentaje));
  contenedor.innerHTML = `${enunciado2(item, api)}
    <input type="text" class="campo-numero campo-numero--decimal" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar');
  const escrito = () => deTexto(limpiar(campo.value));
  const actualizar = () => {
    const malo = campo.value.trim() !== '' && escrito() === null;
    campo.classList.toggle('campo-numero--malo', malo);
    campo.setAttribute('aria-invalid', String(malo));
    boton.disabled = escrito() === null || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || escrito() === null) return;
    campo.disabled = true;
    boton.hidden = true;
    const res = evaluarOtraForma(item, campo.value) ?? { acierto: false, error: 'otra-respuesta' };
    terminar(res, campo.value.trim());
  };
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

// ─── Ejercicio 3: une las tres ───────────────────────────────────────────────────────────

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)}</p>`;

function montarUne(contenedor, item, api) {
  const { tt, idioma } = api;
  const N = item.fracciones.length;
  contenedor.innerHTML = `${enunciado3(item, api)}
    <div class="une">
      <div class="une__fila une__fila--titulos"><span>${tt(TX.ej3.columnas.fracciones)}</span><span>${tt(TX.ej3.columnas.decimales)}</span><span>${tt(TX.ej3.columnas.porcentajes)}</span></div>
      <div id="filas"></div>
    </div>
    <p class="parejas__titulo">${tt(TX.ej3.columnas.decimales)}</p><div class="une__fichas" id="fichas-d"></div>
    <p class="parejas__titulo">${tt(TX.ej3.columnas.porcentajes)}</p><div class="une__fichas" id="fichas-p"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const filas = contenedor.querySelector('#filas'), boton = contenedor.querySelector('#comprobar');
  const asig = { d: Array(N).fill(null), p: Array(N).fill(null) };   // fracción i → ficha j
  const lista = { d: item.decimales, p: item.porcentajes };
  let sel = null, bloqueado = false, estados = null;
  const huecos = { d: [], p: [] }, fichas = { d: [], p: [] };

  for (let i = 0; i < N; i++) {
    const fila = document.createElement('div');
    fila.className = 'une__fila';
    fila.innerHTML = `<span class="une__frac">${txt(item.fracciones[i], idioma)}</span>`;
    for (const k of ['d', 'p']) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'une__hueco';
      b.addEventListener('click', () => {
        if (bloqueado) return;
        if (asig[k][i] !== null) { asig[k][i] = null; sel = null; } else sel = sel && sel.k === k && sel.i === i ? null : { k, i };
        pintar();
      });
      fila.append(b);
      huecos[k].push(b);
    }
    filas.append(fila);
  }
  for (const k of ['d', 'p']) {
    lista[k].forEach((e, j) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pareja-ficha';
      b.innerHTML = txt(e, idioma);
      b.addEventListener('click', () => {
        if (bloqueado) return;
        const dueno = asig[k].indexOf(j);
        if (dueno !== -1) { asig[k][dueno] = null; pintar(); return; }
        const destino = sel && sel.k === k ? sel.i : asig[k].indexOf(null);
        if (destino === -1) return;
        asig[k][destino] = j;
        sel = null;
        pintar();
      });
      contenedor.querySelector(`#fichas-${k}`).append(b);
      fichas[k].push(b);
    });
  }

  function pintar() {
    for (const k of ['d', 'p']) {
      for (let i = 0; i < N; i++) {
        const j = asig[k][i], est = estados ? estados[k][i] : null;
        const b = huecos[k][i];
        b.innerHTML = j === null ? `<span class="une__vacio">${tt(TX.ej3.hueco)}</span>` : txt(lista[k][j], idioma);
        b.className = `une__hueco${sel && sel.k === k && sel.i === i ? ' une__hueco--elegido' : ''}${est ? ` une__hueco--${est}` : ''}`;
        b.disabled = bloqueado;
      }
      fichas[k].forEach((b, j) => {
        b.className = `pareja-ficha${asig[k].includes(j) ? ' pareja-ficha--usada' : ''}`;
        b.disabled = bloqueado;
      });
    }
    boton.disabled = bloqueado || asig.d.includes(null) || asig.p.includes(null);
  }

  boton.addEventListener('click', () => {
    if (api.respondido() || boton.disabled) return;
    const r = evaluarUne(item, asig.d, asig.p);
    estados = { d: r.estadosD, p: r.estadosP };
    bloqueado = true;
    sel = null;
    boton.hidden = true;
    pintar();
    api.responder({
      acierto: r.acierto,
      error: r.error ?? undefined,
      respuesta: item.fracciones.map((f, i) => `${f.num}/${f.den}→${txt(item.decimales[asig.d[i]], 'es')}→${txt(item.porcentajes[asig.p[i]], 'es')}`).join(' ').replace(/<[^>]+>/g, ''),
      espera: 3400,
      html: ctx => (r.acierto ? `${ctx.tt(TX.correcto)} ${explicaUne(item, ctx)}` : feedback(explicaUne, item, r.error, ctx)),
    });
  });
  pintar();
}

// ─── Ejercicio 4: ordena ─────────────────────────────────────────────────────────────────

const enunciado4 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej4.instruccion[item.orden])}</p>`;

function montarOrdena(contenedor, item, api) {
  const { idioma } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}
    <div class="ordena__secuencia" id="secuencia"></div>
    <div class="ordena__fichas" id="fichas"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#secuencia'), pool = contenedor.querySelector('#fichas'), boton = contenedor.querySelector('#comprobar');
  const N = item.numeros.length, secuencia = [];
  let bloqueado = false, resultado = null;
  const fichas = item.numeros.map((e, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pareja-ficha';
    b.innerHTML = txt(e, idioma);
    b.addEventListener('click', () => {
      if (bloqueado) return;
      const pos = secuencia.indexOf(i);
      if (pos === -1) secuencia.push(i); else secuencia.splice(pos, 1);
      pintar();
    });
    pool.append(b);
    return b;
  });

  function pintar() {
    caja.innerHTML = Array.from({ length: N }, (_, p) => {
      const i = secuencia[p];
      const clase = resultado ? (item.solucion[p] === i ? ' ordena__casilla--bien' : ' ordena__casilla--mal') : '';
      return `<span class="ordena__casilla${clase}">${i === undefined ? '' : txt(item.numeros[i], idioma)}</span>`;
    }).join(`<span class="ordena__signo">${item.orden === 'menor-mayor' ? '&lt;' : '&gt;'}</span>`);
    fichas.forEach((b, i) => {
      b.classList.toggle('pareja-ficha--usada', secuencia.includes(i));
      b.disabled = bloqueado;
    });
    boton.disabled = bloqueado || secuencia.length < N;
  }

  boton.addEventListener('click', () => {
    if (api.respondido() || boton.disabled) return;
    const r = evaluarOrdena(item, secuencia);
    resultado = r;
    bloqueado = true;
    boton.hidden = true;
    pintar();
    api.responder({
      acierto: r.acierto,
      error: r.error ?? undefined,
      respuesta: secuencia.map(i => txt(item.numeros[i], 'es')).join(' ; ').replace(/<[^>]+>/g, ''),
      espera: 3400,
      html: ctx => (r.acierto ? `${ctx.tt(TX.correcto)} ${explicaOrdena(item, ctx)}` : feedback(explicaOrdena, item, r.error, ctx)),
    });
  });
  pintar();
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe } : {}),
});

arrancar({
  slug: 'tres-escrituras',
  ejercicios: [
    ejercicio(TX.ej1, generarFaciles, montarFaciles, enunciado1, explicaFaciles),
    ejercicio(TX.ej2, generarOtraForma, montarOtraForma, enunciado2, explicaOtraForma, NO_SE_HACERLO),
    ejercicio(TX.ej3, generarUne, montarUne, enunciado3, explicaUne),
    ejercicio(TX.ej4, generarOrdena, montarOrdena, enunciado4, explicaOrdena),
  ],
});
