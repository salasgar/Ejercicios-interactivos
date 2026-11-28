// «¿Qué porcentaje? ¿De cuánto?» (PU2, tarea 220). Cuatro ejercicios de la unidad 7:
//   1. ¿Qué porcentaje es?  12 de 80: parte entre total, a porcentaje          (U7-3A-02, 3C-06)
//   2. ¿De cuánto?          el 20 % es 30: ¿cuál es el total?                  (U7-3A-04, 3C-07)
//   3. ¿Cuál de los tres?   piden la parte, el porcentaje o el total; no se calcula  (U7-3A-07)
//   4. Problemas            con contexto: el porcentaje, el total o la parte   (U7-3A-02, 3A-04, 3C-06, 3C-07)
// La lógica está en `logica.js`; las frases y las explicaciones, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto } from '../_comun/proporcion.js';
import {
  generarPorcentaje, generarTotal, generarTipo, generarProblema, leerCampo, errorDe, trioDe,
  errorProblema, aciertaProblema, unidadLectura, unidadDeCampo, PREGUNTAS,
} from './logica.js';
import {
  TX, PIDEN, enunciadoPorcentaje, enunciadoTotal, enunciadoTipo, enunciadoProblema,
  explicaPorcentaje, feedbackPorcentaje, explicaTotal, feedbackTotal, explicaTipo, feedbackTipo,
  explicaProblema, feedbackProblema,
} from './textos.js';

const campoTexto = (id, nombre) => `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" class="campo-numero" id="${id}" aria-label="${nombre}" style="--cifras:6">`;
const marca = (campo, malo) => campo.classList.toggle('campo-numero--malo', malo);

/** Un ejercicio de una casilla numérica: enunciado, campo, «Comprobar». `unidad` es opcional (problemas). */
function montarCampo({ enunciado, unidadTexto, leer, comprobar }) {
  return (contenedor, item, api) => {
    const { tt, idioma } = api;
    const u = unidadTexto ? unidadTexto(item, idioma) : '';
    contenedor.innerHTML = `
      ${enunciado(item, api)}
      <div class="fila-campo">${campoTexto('valor', tt(TX.campo))}${u ? `<span class="unidad-campo">${u}</span>` : ''}</div>
      <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
    const campo = contenedor.querySelector('#valor');
    const boton = contenedor.querySelector('#comprobar');
    const lee = () => leer(item, campo.value, idioma);
    const actualizar = () => {
      boton.disabled = lee() === null;
      marca(campo, campo.value.trim() !== '' && lee() === null);
    };
    campo.addEventListener('input', actualizar);
    campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (!boton.disabled) alPulsar(); } });
    boton.addEventListener('click', alPulsar);

    function alPulsar() {
      const v = lee();
      if (api.respondido() || v === null) return;
      campo.disabled = true;
      boton.hidden = true;
      comprobar(item, v, api);
    }
  };
}

const enunciadoSimple = enun => (item, { idioma }) => `<p class="instruccion instruccion--enunciado">${enun(item, idioma)}</p>`;
const leerPorcentaje = (item, texto, idioma) => leerCampo(texto, idioma, '%');
const leerNumero = (item, texto, idioma) => leerCampo(texto, idioma);
const leerProblema = (item, texto, idioma) => leerCampo(texto, idioma, unidadLectura(item));

const comprobarTrio = (pregunta, unidad, explica, feedback, buena) => (item, v, api) => {
  const { P, A, T } = trioDe(item);
  if (v.valor.equals(buena(P, A, T))) return api.responder({ acierto: true, html: ({ idioma }) => explica(item, idioma) });
  const e = errorDe(pregunta, P, A, T, v, unidad);
  api.responder({
    acierto: false,
    error: e,
    respuesta: `${v.valor.num}/${v.valor.den}`,
    html: ({ idioma }) => feedback(item, { escrito: aTexto(v, idioma), error: e }, idioma),
    espera: 3400,
  });
};

const comprobarProblema = (item, v, api) => {
  if (aciertaProblema(item, v)) return api.responder({ acierto: true, html: ({ idioma }) => explicaProblema(item, idioma) });
  const e = errorProblema(item, v);
  api.responder({
    acierto: false,
    error: e,
    respuesta: `${v.valor.num}/${v.valor.den}`,
    html: ({ idioma }) => feedbackProblema(item, { escrito: aTexto(v, idioma), error: e }, idioma),
    espera: 3400,
  });
};

// ─── Ejercicio 3: ¿cuál de los tres? ───────────────────────────────────────────

const enunciadoTipoHtml = (item, { idioma }) => `<p class="instruccion instruccion--enunciado">${enunciadoTipo(item, idioma)}</p>`;

function montarTipo(contenedor, item, api) {
  contenedor.innerHTML = enunciadoTipoHtml(item, api);
  const botones = elecciones(contenedor, {
    opciones: PREGUNTAS.map(k => ({ valor: k, html: api.tt(PIDEN[k]) })),
    alElegir(k) {
      if (api.respondido()) return;
      botones.marcar([item.pregunta], k);
      if (k === item.pregunta) return api.responder({ acierto: true, html: ({ idioma }) => explicaTipo(item, idioma) });
      api.responder({
        acierto: false,
        error: `pide-${item.pregunta}-y-elige-${k}`,
        respuesta: k,
        html: ({ idioma }) => feedbackTipo(item, k, idioma),
        espera: 3400,
      });
    },
  });
}

arrancar({
  slug: 'que-porcentaje',
  ejercicios: [
    {
      nombre: TX.porcentaje.nombre,
      detalle: TX.porcentaje.detalle,
      introduccion: TX.porcentaje.introduccion,
      generar: generarPorcentaje,
      clave: item => `${item.p}:${item.N}`,
      montar: montarCampo({
        enunciado: enunciadoSimple(enunciadoPorcentaje), unidadTexto: () => '%', leer: leerPorcentaje,
        comprobar: comprobarTrio('porcentaje', '%', explicaPorcentaje, feedbackPorcentaje, P => P),
      }),
      enunciado: enunciadoSimple(enunciadoPorcentaje),
      explicacion: (item, { idioma }) => explicaPorcentaje(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.total.nombre,
      detalle: TX.total.detalle,
      introduccion: TX.total.introduccion,
      generar: generarTotal,
      clave: item => `${item.p}:${item.N}`,
      montar: montarCampo({
        enunciado: enunciadoSimple(enunciadoTotal), leer: leerNumero,
        comprobar: comprobarTrio('total', null, explicaTotal, feedbackTotal, (P, A, T) => T),
      }),
      enunciado: enunciadoSimple(enunciadoTotal),
      explicacion: (item, { idioma }) => explicaTotal(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.tipo.nombre,
      detalle: TX.tipo.detalle,
      introduccion: TX.tipo.introduccion,
      generar: generarTipo,
      clave: item => `${item.ctx}:${item.pregunta}:${item.total}:${item.p}`,
      montar: montarTipo,
      enunciado: enunciadoTipoHtml,
      explicacion: (item, { idioma }) => explicaTipo(item, idioma),
    },
    {
      nombre: TX.problema.nombre,
      detalle: TX.problema.detalle,
      introduccion: TX.problema.introduccion,
      generar: generarProblema,
      clave: item => `${item.ctx}:${item.pregunta}:${item.total}:${item.p}`,
      montar: montarCampo({
        enunciado: (item, { idioma }) => `<p class="instruccion instruccion--enunciado">${enunciadoProblema(item, idioma)}</p>`,
        unidadTexto: unidadDeCampo, leer: leerProblema, comprobar: comprobarProblema,
      }),
      enunciado: (item, { idioma }) => `<p class="instruccion instruccion--enunciado">${enunciadoProblema(item, idioma)}</p>`,
      explicacion: (item, { idioma }) => explicaProblema(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
  ],
});
