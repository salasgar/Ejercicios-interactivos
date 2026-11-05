// PRÁCTICA «De fracción a decimal y vuelta» (unidad 5, semana 2, sesiones 5-6): de fracción a decimal,
// de decimal a fracción irreducible, los que hay que saberse (emparejar) y fracción contra decimal.
// Cuatro ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (las parejas y el signo del ejercicio 4).

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero } from '../_comun/piezas.js';
import { htmlFraccion, htmlRaya } from '../_comun/fracciones.js';
import { aTexto, deTexto } from '../_comun/decimales.js';
import { TX } from './textos.js';
import {
  D, claveDe, generarFraccionADecimal, generarDecimalAFraccion, generarParejas, generarFraccionODecimal,
  errorFraccionADecimal, errorTipo, errorDecimalAFraccion, evaluarParejas, errorSigno,
} from './logica.js';

const hf = f => htmlFraccion({ num: f.num, den: f.den });
const num = (d, idioma) => aTexto(D(d), idioma);
const CUADRO = '<span class="hueco-fd">□</span>';

/** Un campo para escribir un decimal (la coma o el punto valen en los dos idiomas). */
const htmlCampoDecimal = (nombre, id = 'campo') =>
  `<input type="text" class="campo-numero campo-numero--decimal" id="${id}" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

// ─── Ejercicio 1: de fracción a decimal ──────────────────────────────────────────────────

const enunciado1 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej1.instruccion[item.tipo === 'periodico' ? 'elegir' : item.tipo])}</p>
  <div class="operacion">${hf(item.f)}${item.tipo === 'escribir' ? ` = ${CUADRO}` : ''}</div>`;

function responder1(item, api, error, respuesta, valor) {
  api.responder({
    acierto: error === null,
    error: error ?? undefined,
    respuesta,
    espera: 2600,
    html: ({ tt }) => (error === null ? tt(TX.ej1.correcto)(item) : tt(TX.ej1.por_que[error])(item, valor) + tt(TX.ej1.solucion)(item)),
  });
}

function montarFraccionADecimal(contenedor, item, api) {
  const { tt } = api;
  if (item.tipo === 'escribir') {
    contenedor.innerHTML = `${enunciado1(item, api)}${htmlCampoDecimal(api.esc(tt(TX.campos.decimal)))}
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
    const campo = contenedor.querySelector('#campo'), boton = contenedor.querySelector('#comprobar');
    const escrito = () => deTexto(campo.value);
    const actualizar = () => {
      const malo = campo.value.trim() !== '' && escrito() === null;
      campo.classList.toggle('campo-numero--malo', malo);
      campo.setAttribute('aria-invalid', String(malo));
      boton.disabled = escrito() === null || api.respondido();
    };
    const comprobar = () => {
      const valor = escrito();
      if (api.respondido() || valor === null) return;
      campo.disabled = true;
      boton.hidden = true;
      responder1(item, api, errorFraccionADecimal(item, valor), campo.value.trim(), { m: valor.m, k: valor.k });
    };
    campo.addEventListener('input', actualizar);
    campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
    boton.addEventListener('click', comprobar);
    actualizar();
    return;
  }
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  const zona = contenedor.querySelector('#respuesta');
  if (item.tipo === 'tipo') {
    const botones = elecciones(zona, {
      clase: 'si-no',
      opciones: [{ valor: 'exacto', html: tt(TX.ej1.exacto) }, { valor: 'periodico', html: tt(TX.ej1.periodico) }],
      alElegir(valor) {
        if (api.respondido()) return;
        botones.marcar([item.periodica ? 'periodico' : 'exacto'], valor);
        responder1(item, api, errorTipo(item, valor), valor === 'exacto' ? 'Exacto' : 'Periódico', null);
      },
    });
    return;
  }
  const texto = o => `${num(o.d, api.idioma)}${o.puntos ? '…' : ''}`;
  const botones = elecciones(zona, {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: texto(o) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
      responder1(item, api, elegida.correcta ? null : elegida.error, texto(elegida), elegida.d);
    },
  });
}

// ─── Ejercicio 2: de decimal a fracción ──────────────────────────────────────────────────

const enunciado2 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej2.instruccion[item.tipo])}</p>
  <div class="operacion">${num(item.d, idioma)}${item.tipo === 'escribir' ? ` = ${htmlRaya(CUADRO, CUADRO)}` : ''}</div>`;

function responder2(item, api, error, respuesta, f) {
  api.responder({
    acierto: error === null,
    error: error ?? undefined,
    respuesta,
    espera: 3000,
    html: ({ tt }) => (error === null ? tt(TX.ej2.correcto)(item) : tt(TX.ej2.por_que[error])(item, f) + tt(TX.ej2.solucion)(item)),
  });
}

function montarDecimalAFraccion(contenedor, item, api) {
  const { tt } = api;
  if (item.tipo === 'elegir') {
    contenedor.innerHTML = `${enunciado2(item, api)}<div id="respuesta"></div>`;
    const botones = elecciones(contenedor.querySelector('#respuesta'), {
      opciones: item.opciones.map((o, i) => ({ valor: String(i), html: hf(o.f) })),
      alElegir(valor) {
        if (api.respondido()) return;
        const elegida = item.opciones[Number(valor)];
        botones.marcar(item.opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
        responder2(item, api, elegida.correcta ? null : elegida.error, `${elegida.f.num}/${elegida.f.den}`, elegida.f);
      },
    });
    return;
  }
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.ej2.instruccion.escribir)}</p>
    <div class="operacion">${num(item.d, api.idioma)} = ${htmlRaya('<span data-num></span>', '<span data-den></span>')}</div>
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
    const [numerador, denominador] = campos.map(c => c.valor());
    campos.forEach(c => c.bloquear());
    boton.hidden = true;
    const f = denominador > 0 ? { num: numerador, den: denominador } : null;
    responder2(item, api, errorDecimalAFraccion(item, numerador, denominador), `${numerador}/${denominador}`, f);
  }
}

// ─── Ejercicio 3: los que hay que saberse (parejas) ──────────────────────────────────────

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)}</p>`;

function montarParejas(contenedor, item, api) {
  const { tt } = api;
  const N = item.fracciones.length;
  contenedor.innerHTML = `${enunciado3(item, api)}
    <div class="parejas">
      <div class="parejas__col"><p class="parejas__titulo">${tt(TX.ej3.columnas.fracciones)}</p><div id="col-fracciones"></div></div>
      <div class="parejas__col"><p class="parejas__titulo">${tt(TX.ej3.columnas.decimales)}</p><div id="col-decimales"></div></div>
    </div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const colF = contenedor.querySelector('#col-fracciones'), colD = contenedor.querySelector('#col-decimales');
  const boton = contenedor.querySelector('#comprobar');
  const asignacion = Array(N).fill(null);   // fracción i → decimal j
  const dueno = j => asignacion.indexOf(j);  // decimal j → fracción i (o -1)
  let elegida = null, bloqueado = false, estados = null;

  const fichaF = [], fichaD = [];
  for (let i = 0; i < N; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pareja-ficha';
    b.innerHTML = hf(item.fracciones[i]);
    b.addEventListener('click', () => {
      if (bloqueado) return;
      if (asignacion[i] !== null) { asignacion[i] = null; elegida = i; } else elegida = elegida === i ? null : i;
      pintar();
    });
    colF.append(b);
    fichaF.push(b);
  }
  for (let j = 0; j < N; j++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pareja-ficha';
    b.textContent = num(item.decimales[j], api.idioma);
    b.addEventListener('click', () => {
      if (bloqueado) return;
      const otra = dueno(j);
      if (elegida === null) { if (otra !== -1) { asignacion[otra] = null; pintar(); } return; }
      if (otra !== -1) asignacion[otra] = null;
      asignacion[elegida] = j;
      elegida = null;
      pintar();
    });
    colD.append(b);
    fichaD.push(b);
  }

  function pintar() {
    for (let i = 0; i < N; i++) {
      const j = asignacion[i];
      const color = j === null ? '' : ` pareja-ficha--c${i}`;
      const estado = estados && estados[i] ? ` pareja-ficha--${estados[i]}` : '';
      fichaF[i].className = `pareja-ficha${color}${elegida === i ? ' pareja-ficha--elegida' : ''}${estado}`;
      fichaF[i].disabled = bloqueado;
      fichaF[i].setAttribute('aria-pressed', String(elegida === i));
    }
    for (let j = 0; j < N; j++) {
      const i = dueno(j);
      const estado = estados && i !== -1 && estados[i] ? ` pareja-ficha--${estados[i]}` : '';
      fichaD[j].className = `pareja-ficha${i === -1 ? '' : ` pareja-ficha--c${i}`}${estado}`;
      fichaD[j].disabled = bloqueado;
    }
    boton.disabled = bloqueado || asignacion.some(j => j === null);
  }

  boton.addEventListener('click', () => {
    if (api.respondido() || boton.disabled) return;
    const r = evaluarParejas(item, asignacion);
    estados = r.estados;
    bloqueado = true;
    elegida = null;
    boton.hidden = true;
    pintar();
    api.responder({
      acierto: r.acierto,
      error: r.error ?? undefined,
      respuesta: item.fracciones.map((f, i) => `${f.num}/${f.den}→${num(item.decimales[asignacion[i]], 'es')}`).join(' '),
      espera: 3200,
      html: ({ tt }) => {
        if (r.acierto) return tt(TX.ej3.correcto);
        const malas = r.malas.map(i => tt(TX.ej3.pareja)(item.fracciones[i], item.decimales[item.solucion[i]], item.decimales[asignacion[i]])).join('; ');
        const f = item.fracciones[r.malas[0]], buena = item.decimales[item.solucion[r.malas[0]]];
        return `${tt(TX.ej3.mal)}${malas}. ${tt(TX.ej3.por_que[r.error])(f, buena)}`;
      },
    });
  });

  pintar();
}

// ─── Ejercicio 4: ¿fracción o decimal? ───────────────────────────────────────────────────

const enunciado4 = (item, { tt, idioma }) => {
  const f = hf(item.f), d = num(item.d, idioma);
  const [izq, der] = item.orden === 'fd' ? [f, d] : [d, f];
  return `<p class="instruccion">${tt(TX.ej4.instruccion)}</p>
    <div class="operacion operacion--cmp">${izq} <span class="hueco-fd" data-signo>?</span> ${der}</div>`;
};

function montarFraccionODecimal(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const hueco = contenedor.querySelector('[data-signo]');
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    clase: 'elecciones elecciones--3 elecciones--signos',
    opciones: [{ valor: '<', html: '&lt;' }, { valor: '=', html: '=' }, { valor: '>', html: '&gt;' }],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.respuesta], valor);
      hueco.textContent = item.respuesta;
      const error = errorSigno(item, valor);
      api.responder({
        acierto: error === null,
        error: error ?? undefined,
        respuesta: valor,
        espera: 3000,
        html: ({ tt }) => (error === null ? tt(TX.ej4.correcto)(item) : tt(TX.ej4.por_que[error])(item) + tt(TX.ej4.solucion)(item)),
      });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
});

arrancar({
  slug: 'fraccion-decimal',
  ejercicios: [
    ejercicio(TX.ej1, generarFraccionADecimal, montarFraccionADecimal, enunciado1),
    ejercicio(TX.ej2, generarDecimalAFraccion, montarDecimalAFraccion, enunciado2),
    ejercicio(TX.ej3, generarParejas, montarParejas, enunciado3),
    ejercicio(TX.ej4, generarFraccionODecimal, montarFraccionODecimal, enunciado4),
  ],
});
