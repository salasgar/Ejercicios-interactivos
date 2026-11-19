// PRÁCTICA «Repartos proporcionales» (unidad 7, sesión 2): cuenta las partes, reparte, ¿está bien repartido? y
// caza el error (PU2, tarea 217). Reparto de ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto } from '../_comun/proporcion.js';
import {
  generarCuenta, claveCuenta, erroresDeCuenta, generarReparte, claveReparte, erroresDeReparte, sumaEscrita,
  generarEstaBien, claveEstaBien, errorDeEstaBien, generarCaza, claveCaza, leerNumero, nombresDe, CONTEXTOS,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, NOMBRE_ERROR, quePaso, enunciadoReparto, repartoDado, lineasCaza, etiquetaUnidad, fv,
  explicaCuenta, explicaReparte, explicaEstaBien, explicaCaza,
} from './textos.js';

const campo = (id, nombre) =>
  `<input type="text" class="campo-numero campo-reparto" id="${id}" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;
const cuenta = s => `<span class="cuenta">${s}</span>`;

/** Lo que se dice tras fallar: qué error es, qué ha pasado y la solución. */
function feedbackError(error, item, { tt, idioma }, solucion, extra = '') {
  const nombre = NOMBRE_ERROR[error] ?? NOMBRE_ERROR['otra-respuesta'];
  const que = error === 'otra-respuesta' ? '' : `<p>${quePaso(error, item, idioma)}</p>`;
  return `<p><strong>${tt(nombre)}.</strong></p>${que}${extra}${tt(solucion)(item)}`;
}

// ─── Campos de número con su etiqueta y su unidad ────────────────────────────────────────────────

function filaCampo(id, etiqueta, unidad, api) {
  return `<p class="respuesta-linea"><label class="etiqueta-campo" for="${id}">${etiqueta}</label> ${campo(id, api.esc(etiqueta))}${unidad ? ` <span class="etiqueta-campo">${unidad}</span>` : ''}</p>`;
}

/** Monta N campos + Comprobar. `corregir(textos)` → { errores: [..], error, respuesta, extra }. */
function montarCampos(contenedor, item, api, { enun, filas, corregir, solucion }) {
  contenedor.innerHTML = `${enun}${filas.map((f, k) => filaCampo(`c${k}`, f.etiqueta, f.unidad, api)).join('')}
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const cajas = filas.map((_, k) => contenedor.querySelector(`#c${k}`)), boton = contenedor.querySelector('#comprobar');
  const valida = (c, k) => leerNumero(c.value, filas[k].unidadLeer, api.idioma) !== null;
  const actualizar = () => {
    cajas.forEach((c, k) => {
      const malo = c.value.trim() !== '' && !valida(c, k);
      c.classList.toggle('campo-numero--malo', malo);
      c.setAttribute('aria-invalid', String(malo));
    });
    boton.disabled = cajas.some((c, k) => !valida(c, k)) || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || cajas.some((c, k) => !valida(c, k))) return;
    cajas.forEach(c => { c.disabled = true; });
    boton.hidden = true;
    const { errores, error, respuesta, extra } = corregir(cajas.map(c => c.value));
    cajas.forEach((c, k) => c.classList.add(errores[k] === null ? 'campo-reparto--bien' : 'campo-reparto--mal'));
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta, espera: error === null ? 2500 : 'boton',
      html: textos => (error === null ? textos.tt(solucion)(item) : feedbackError(error, item, textos, solucion, extra)),
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
const unidadLeer = ctx => CONTEXTOS[ctx].unidad ?? null;

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { idioma, tt }) => `<p class="instruccion">${enunciadoReparto(item, idioma)}</p><p class="instruccion">${tt(TX.ej1.instruccion)}</p>`;

function montar1(contenedor, item, api) {
  const { idioma, tt } = api;
  montarCampos(contenedor, item, api, {
    enun: enunciado1(item, api), solucion: TX.ej1.solucion,
    filas: [
      { etiqueta: tt(TX.ej1.partes), unidad: '', unidadLeer: null },
      { etiqueta: tt(TX.ej1.una), unidad: etiquetaUnidad(item.ctx, idioma), unidadLeer: unidadLeer(item.ctx) },
    ],
    corregir: ([tp, tv]) => {
      const errores = erroresDeCuenta(item, tp, tv, idioma);
      return { errores, error: primerError(errores), respuesta: `${tp.trim()} ; ${tv.trim()}` };
    },
  });
}

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────────────

const enunciado2 = (item, { idioma, tt }) => `<p class="instruccion">${enunciadoReparto(item, idioma)}</p><p class="instruccion">${tt(TX.ej2.instruccion)}</p>`;

function montar2(contenedor, item, api) {
  const { idioma } = api, nombres = nombresDe(item)[idioma], u = unidadLeer(item.ctx);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  montarCampos(contenedor, item, api, {
    enun: enunciado2(item, api), solucion: TX.ej2.solucion,
    filas: nombres.map(n => ({ etiqueta: cap(n), unidad: etiquetaUnidad(item.ctx, idioma), unidadLeer: u })),
    corregir: ([ta, tb]) => {
      const errores = erroresDeReparte(item, ta, tb, idioma), error = primerError(errores);
      let extra = '';
      if (error === 'otra-respuesta') {
        const s = sumaEscrita(item, ta, tb, idioma);
        if (s !== null) {
          const total = fv(item.ctx, item.T, idioma), suya = aTexto(s, idioma);
          extra = `<p>${api.tt({ es: `Tus partes suman ${cuenta(suya)} y el total es ${total}.`, en: `Your parts add up to ${cuenta(suya)} and the total is ${total}.` })}</p>`;
        }
      }
      return { errores, error, respuesta: `${ta.trim()} ; ${tb.trim()}`, extra };
    },
  });
}

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────────────

const datos3 = (item, { idioma, tt }) => `<p class="instruccion">${enunciadoReparto(item, idioma)}</p>
  <p class="instruccion"><strong>${tt(TX.ej3.reparto)}:</strong> ${repartoDado(item, idioma)}</p><p class="instruccion">${tt(TX.ej3.instruccion)}</p>`;

function montar3(contenedor, item, api) {
  contenedor.innerHTML = `${datos3(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    clase: 'elecciones nombres',
    opciones: Object.keys(TX.ej3.opciones).map(v => ({ valor: v, html: api.tt(TX.ej3.opciones[v]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.tipo], valor);
      const error = errorDeEstaBien(item, valor);
      api.responder({
        acierto: error === null, error: error ?? undefined, respuesta: valor, espera: error === null ? 2500 : 'boton',
        html: textos => (error === null ? textos.tt(TX.ej3.solucion)(item) : `<p><strong>${textos.tt(NOMBRE_ERROR[item.error] ?? NOMBRE_ERROR['otra-respuesta'])}</strong></p>${textos.tt(TX.ej3.solucion)(item)}`),
      });
    },
  });
}

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────────────

const lineasHtml = (item, idioma) => lineasCaza(item, idioma).map(cuenta);
const enunciado4 = (item, { idioma, tt }) => `<p class="instruccion">${enunciadoReparto(item, idioma)}</p><p class="instruccion">${tt(TX.ej4.instruccion)}</p>
  <ol class="procedimiento">${lineasHtml(item, idioma).map((l, k) => `<li class="procedimiento__linea"><span class="procedimiento__n">${k + 1}</span><span>${l}</span></li>`).join('')}</ol>`;

function montar4(contenedor, item, api) {
  const { idioma, tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${enunciadoReparto(item, idioma)}</p><p class="instruccion">${tt(TX.ej4.instruccion)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'procedimiento procedimiento--botones',
    opciones: lineasHtml(item, idioma).map((l, k) => ({ valor: k, html: `<span class="procedimiento__n">${k + 1}</span>${l}` })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.mala], valor);
      const acierto = valor === item.mala;
      api.responder({
        acierto, espera: acierto ? 3000 : 'boton', html: textos => textos.tt(TX.ej4.solucion)(item),
        ...(acierto ? {} : { error: item.error, respuesta: `linea-${valor + 1}` }),
      });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, clave, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar: rng => generar(rng), clave, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'repartos',
  ejercicios: [
    ejercicio(TX.ej1, generarCuenta, claveCuenta, montar1, enunciado1, explicaCuenta, true),
    ejercicio(TX.ej2, generarReparte, claveReparte, montar2, enunciado2, explicaReparte, true),
    ejercicio(TX.ej3, generarEstaBien, claveEstaBien, montar3, datos3, explicaEstaBien, false),
    ejercicio(TX.ej4, generarCaza, claveCaza, montar4, enunciado4, explicaCaza, false),
  ],
});
