// PRÁCTICA «Descuentos y aumentos» (unidad 7, sesiones 12-14): en dos pasos, en un paso, el IVA, ¿qué piden? y
// caza el error (PU2, tarea 221). Ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  generarDosPasos, claveDosPasos, erroresDeDosPasos, generarUnPaso, claveUnPaso, errorDeUnPasoCalcular, generarIva, claveIva,
  errorDeIva, generarQuePiden, claveQuePiden, generarCaza, claveCaza, erroresDeCaza, leerDinero, dinero, multiplicadorTxt, pct,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, NOMBRE_ERROR, quePaso, enunciadoDosPasos, enunciadoQuePiden, pideTexto, enunciadoCaza,
  explicaDosPasos, explicaUnPaso, explicaIva, explicaQuePiden, explicaCaza,
} from './textos.js';

const campo = (id, nombre) =>
  `<input type="text" class="campo-numero campo-reparto" id="${id}" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;
const instr = s => `<p class="instruccion">${s}</p>`;

function feedbackError(error, item, { tt, idioma }, solucion) {
  const nombre = NOMBRE_ERROR[error] ?? NOMBRE_ERROR['otra-respuesta'];
  const que = error === 'otra-respuesta' ? '' : `<p>${quePaso(error, item, idioma)}</p>`;
  return `<p><strong>${tt(nombre)}.</strong></p>${que}${tt(solucion)(item)}`;
}

function montarCampos(contenedor, item, api, { enun, filas, corregir, solucion }) {
  contenedor.innerHTML = `${enun}${filas.map((f, k) =>
    `<p class="respuesta-linea"><label class="etiqueta-campo" for="c${k}">${f}</label> ${campo(`c${k}`, api.esc(f))}</p>`).join('')}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const cajas = filas.map((_, k) => contenedor.querySelector(`#c${k}`)), boton = contenedor.querySelector('#comprobar');
  const valida = c => leerDinero(c.value, api.idioma) !== null;
  const actualizar = () => {
    cajas.forEach(c => {
      const malo = c.value.trim() !== '' && !valida(c);
      c.classList.toggle('campo-numero--malo', malo);
      c.setAttribute('aria-invalid', String(malo));
    });
    boton.disabled = cajas.some(c => !valida(c)) || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || cajas.some(c => !valida(c))) return;
    cajas.forEach(c => { c.disabled = true; });
    boton.hidden = true;
    const { errores, error, respuesta } = corregir(cajas.map(c => c.value));
    cajas.forEach((c, k) => c.classList.add(errores[k] === null ? 'campo-reparto--bien' : 'campo-reparto--mal'));
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta, espera: error === null ? 2500 : 'boton',
      html: textos => (error === null ? textos.tt(solucion)(item) : feedbackError(error, item, textos, solucion)),
    });
  };
  cajas.forEach(c => {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  });
  boton.addEventListener('click', comprobar);
  actualizar();
}
const primerError = errores => errores.find(e => e !== null) ?? null;

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { idioma, tt }) => `${instr(enunciadoDosPasos(item, idioma))}${instr(tt(TX.ej1.instruccion))}`;
function montar1(contenedor, item, api) {
  const { idioma, tt } = api;
  montarCampos(contenedor, item, api, {
    enun: enunciado1(item, api), solucion: TX.ej1.solucion,
    filas: [item.tipo === 'descuento' ? tt({ es: 'Descuento', en: 'Discount' }) : tt({ es: 'Aumento', en: 'Increase' }), tt(TX.ej1.final)],
    corregir: ([a, b]) => {
      const errores = erroresDeDosPasos(item, a, b, idioma);
      return { errores, error: primerError(errores), respuesta: `${a.trim()} ; ${b.trim()}` };
    },
  });
}

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────────────

const cambio2 = (item, { idioma }) => (item.tipo === 'descuento'
  ? (idioma === 'es' ? `Un precio está rebajado un ${pct(item.p, 'es')}.` : `A price is reduced by ${pct(item.p, 'en')}.`)
  : (idioma === 'es' ? `Un precio sube un ${pct(item.p, 'es')}.` : `A price goes up by ${pct(item.p, 'en')}.`));
const enunciado2 = (item, api) => (item.modo === 'elegir'
  ? `${instr(cambio2(item, api))}${instr(api.tt(TX.ej2.instruccionElegir))}`
  : `${instr(enunciadoDosPasos(item, api.idioma))}${instr(api.tt(TX.ej2.instruccionCalcular))}`);

function montar2(contenedor, item, api) {
  const { idioma } = api;
  if (item.modo === 'calcular') {
    montarCampos(contenedor, item, api, {
      enun: enunciado2(item, api), solucion: TX.ej2.solucion, filas: [api.tt(TX.ej2.final)],
      corregir: ([a]) => {
        const error = errorDeUnPasoCalcular(item, a, idioma);
        return { errores: [error], error, respuesta: a.trim() };
      },
    });
    return;
  }
  contenedor.innerHTML = `${enunciado2(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.ops.map(o => ({ valor: o.m, html: `<span class="cuenta">${multiplicadorTxt(o.m, idioma)}</span>` })),
    alElegir(valor) {
      if (api.respondido()) return;
      const op = item.ops.find(o => o.m === valor), buena = item.ops.find(o => o.correcta);
      botones.marcar([buena.m], valor);
      api.responder({
        acierto: op.correcta, error: op.error ?? undefined, respuesta: multiplicadorTxt(valor, idioma), espera: op.correcta ? 2500 : 'boton',
        html: textos => (op.correcta ? textos.tt(TX.ej2.solucion)(item) : feedbackError(op.error, item, textos, TX.ej2.solucion)),
      });
    },
  });
}

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────────────

const enunciado3 = (item, { idioma, tt }) => {
  const { prod, P, r } = item, verbo = prod.pl ? (idioma === 'es' ? 'cuestan' : 'cost') : (idioma === 'es' ? 'cuesta' : 'costs');
  const frase = idioma === 'es'
    ? `${prod.suj.es} ${verbo} ${dinero(P, 'es')} sin IVA. Para ${prod.clase.es}, el IVA es del ${pct(r, 'es')}.`
    : `${prod.suj.en} ${verbo} ${dinero(P, 'en')} before VAT. For ${prod.clase.en}, the VAT is ${pct(r, 'en')}.`;
  return `${instr(frase)}${instr(tt(TX.ej3.instruccion))}`;
};
function montar3(contenedor, item, api) {
  montarCampos(contenedor, item, api, {
    enun: enunciado3(item, api), solucion: TX.ej3.solucion, filas: [api.tt(TX.ej3.final)],
    corregir: ([a]) => {
      const error = errorDeIva(item, a, api.idioma);
      return { errores: [error], error, respuesta: a.trim() };
    },
  });
}

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────────────

const enunciado4 = (item, { idioma, tt }) => `${instr(enunciadoQuePiden(item, idioma))}${instr(`<strong>${pideTexto(item, idioma)}</strong>`)}${instr(tt(TX.ej4.instruccion))}`;
function montar4(contenedor, item, api) {
  const { idioma } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.ops.map(o => ({ valor: o.valor, html: `<span class="cuenta">${dinero(o.valor, idioma)}</span>` })),
    alElegir(valor) {
      if (api.respondido()) return;
      const op = item.ops.find(o => o.valor === valor), buena = item.ops.find(o => o.correcta);
      botones.marcar([buena.valor], valor);
      api.responder({
        acierto: op.correcta, error: op.error ?? undefined, respuesta: dinero(valor, idioma), espera: op.correcta ? 2500 : 'boton',
        html: textos => (op.correcta ? textos.tt(TX.ej4.solucion)(item) : feedbackError(op.error, item, textos, TX.ej4.solucion)),
      });
    },
  });
}

// ─── Ejercicio 5 ─────────────────────────────────────────────────────────────────────────────────

const enunciado5 = (item, { idioma, tt }) => `${instr(enunciadoCaza(item, idioma))}${instr(tt(TX.ej5.instruccion))}`;
function montar5(contenedor, item, api) {
  const { idioma, tt } = api;
  montarCampos(contenedor, item, api, {
    enun: enunciado5(item, api), solucion: TX.ej5.solucion, filas: [tt(TX.ej5.medio), tt(TX.ej5.final)],
    corregir: ([a, b]) => {
      const errores = erroresDeCaza(item, a, b, idioma);
      return { errores, error: primerError(errores), respuesta: `${a.trim()} ; ${b.trim()}` };
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, clave, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar: rng => generar(rng), clave, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'descuentos',
  ejercicios: [
    ejercicio(TX.ej1, generarDosPasos, claveDosPasos, montar1, enunciado1, explicaDosPasos, true),
    ejercicio(TX.ej2, generarUnPaso, claveUnPaso, montar2, enunciado2, explicaUnPaso, false),
    ejercicio(TX.ej3, generarIva, claveIva, montar3, enunciado3, explicaIva, true),
    ejercicio(TX.ej4, generarQuePiden, claveQuePiden, montar4, enunciado4, explicaQuePiden, false),
    ejercicio(TX.ej5, generarCaza, claveCaza, montar5, enunciado5, explicaCaza, true),
  ],
});
