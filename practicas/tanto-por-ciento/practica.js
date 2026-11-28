// «El tanto por ciento de una cantidad» (PU2, tarea 219). Cuatro ejercicios de la unidad 7:
//   1. De cabeza            el 10 %, 50 %, 25 %… de una cantidad                  (U7-3A-01, 3C-05)
//   2. Con el decimal       el 15 % de 80: solo se mira el resultado              (U7-3C-04)
//   3. ¿Qué operación?      cuatro cuentas sin hacer; solo una vale               (U7-3C-04)
//   4. Problemas            la parte con su unidad                                (U7-3C-02, 3C-04)
// La lógica está en `logica.js`; las frases y las explicaciones, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto } from '../_comun/proporcion.js';
import {
  generarCabeza, generarDecimal, generarOperacion, generarProblema, parteDe, leerCampo, errorDe,
  errorProblema, aciertaProblema, unidadLectura,
} from './logica.js';
import {
  TX, enunciadoCabeza, enunciadoDecimal, enunciadoOperacion, enunciadoProblema, cuentaHtmlDe, unidadCampo,
  explicaCabeza, feedbackCabeza, explicaDecimal, feedbackDecimal, explicaOperacion, feedbackOperacion,
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

const comprobarCuenta = (explica, feedback, error) => (item, v, api) => {
  if (v.valor.equals(parteDe(item.p, item.N))) return api.responder({ acierto: true, html: ({ idioma }) => explica(item, idioma) });
  const e = error(item, v);
  api.responder({
    acierto: false,
    error: e,
    respuesta: `${v.valor.num}/${v.valor.den}`,
    html: ({ idioma }) => feedback(item, { escrito: aTexto(v, idioma), error: e }, idioma),
    espera: 3200,
  });
};

// ─── Ejercicio 3: ¿qué operación? ──────────────────────────────────────────────

const enunciadoOp = (item, { idioma }) => {
  const e = enunciadoOperacion(item, idioma);
  return `<p class="instruccion instruccion--enunciado">${e.texto}</p><p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarOperacion(contenedor, item, api) {
  const { idioma } = api;
  contenedor.innerHTML = enunciadoOp(item, api);
  const buena = item.opciones.findIndex(o => o.error === null);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((o, i) => ({ valor: i, html: `<span class="cuenta">${cuentaHtmlDe(item, o.tipo, idioma)}</span>` })),
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([buena], i);
      const elegida = item.opciones[i];
      if (elegida.error === null) return api.responder({ acierto: true, html: ({ idioma }) => explicaOperacion(item, idioma) });
      api.responder({
        acierto: false,
        error: elegida.error,
        respuesta: elegida.tipo,
        html: ({ idioma }) => feedbackOperacion(item, elegida.error, idioma),
        espera: 3200,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

const leerNumero = (item, texto, idioma) => leerCampo(texto, idioma);
const leerProblema = (item, texto, idioma) => leerCampo(texto, idioma, unidadLectura(item));
const errorCuenta = (item, v) => errorDe(item.p, item.N, v);

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

const enunProblema = (item, { idioma }) => `<p class="instruccion instruccion--enunciado">${enunciadoProblema(item, idioma)}</p>`;

arrancar({
  slug: 'tanto-por-ciento',
  ejercicios: [
    {
      nombre: TX.cabeza.nombre,
      detalle: TX.cabeza.detalle,
      introduccion: TX.cabeza.introduccion,
      generar: generarCabeza,
      clave: item => `${item.p}:${item.N}`,
      montar: montarCampo({
        enunciado: enunciadoSimple(enunciadoCabeza), leer: leerNumero,
        comprobar: comprobarCuenta(explicaCabeza, feedbackCabeza, errorCuenta),
      }),
      enunciado: enunciadoSimple(enunciadoCabeza),
      explicacion: (item, { idioma }) => explicaCabeza(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.decimal.nombre,
      detalle: TX.decimal.detalle,
      introduccion: TX.decimal.introduccion,
      generar: generarDecimal,
      clave: item => `${item.p}:${item.N}`,
      montar: montarCampo({
        enunciado: enunciadoSimple(enunciadoDecimal), leer: leerNumero,
        comprobar: comprobarCuenta(explicaDecimal, feedbackDecimal, errorCuenta),
      }),
      enunciado: enunciadoSimple(enunciadoDecimal),
      explicacion: (item, { idioma }) => explicaDecimal(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
    {
      nombre: TX.operacion.nombre,
      detalle: TX.operacion.detalle,
      introduccion: TX.operacion.introduccion,
      generar: generarOperacion,
      clave: item => `${item.p}:${item.N}:${item.estilo}`,
      montar: montarOperacion,
      enunciado: enunciadoOp,
      explicacion: (item, { idioma }) => explicaOperacion(item, idioma),
    },
    {
      nombre: TX.problema.nombre,
      detalle: TX.problema.detalle,
      introduccion: TX.problema.introduccion,
      generar: generarProblema,
      clave: item => `${item.ctx}:${item.total}:${item.p}`,
      montar: montarCampo({ enunciado: enunProblema, unidadTexto: unidadCampo, leer: leerProblema, comprobar: comprobarProblema }),
      enunciado: enunProblema,
      explicacion: (item, { idioma }) => explicaProblema(item, idioma),
      noLoSe: TX.no_se_hacerlo,
    },
  ],
});
