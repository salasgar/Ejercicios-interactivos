// «Problemas de toda la unidad» (PU2, tarea 224), unidad 7. Tres ejercicios (sin acta de la 02 no se escriben la
// velocidad ni el cambio de moneda): 1. ¿Qué tipo de problema es?  4. La mejor oferta  5. ¿Tiene sentido la respuesta?
// La lógica está en `logica.js`; las frases y las explicaciones, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TIPOS, generarTipo, generarOferta, errorOferta, generarSentido, MOTIVOS } from './logica.js';
import {
  TX, TIPO, MOTIVO, enunciadoTipo, explicaTipo, feedbackTipo, enunciadoOferta, opcionesOferta, explicaOferta,
  feedbackOferta, enunciadoSentido, explicaSentido,
} from './textos.js';

// ─── Ejercicio 1 ───────────────────────────────────────────────────────────────

const enunciadoT = (item, { idioma, tt }) => `
  <p class="instruccion instruccion--enunciado">${enunciadoTipo(item, idioma)}</p>
  <p class="instruccion"><strong>${tt(TX.tipo.pregunta)}</strong></p>`;

function montarTipo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoT(item, api);
  const botones = elecciones(contenedor, {
    opciones: TIPOS.map(t => ({ valor: t, html: tt(TIPO[t]) })),
    clase: 'elecciones',
    alElegir(t) {
      if (api.respondido()) return;
      botones.marcar([item.tipo], t);
      if (t === item.tipo) return api.responder({ acierto: true, html: ({ idioma }) => explicaTipo(item, idioma) });
      api.responder({
        acierto: false,
        error: `confunde-con-${t}`,
        respuesta: t,
        html: ({ idioma }) => feedbackTipo(item, t, idioma),
        espera: 3200,
      });
    },
  });
}

// ─── Ejercicio 4 ───────────────────────────────────────────────────────────────

const enunciadoO = (item, { idioma }) => {
  const e = enunciadoOferta(item, idioma);
  return `<p class="instruccion instruccion--enunciado">${e.texto}</p><p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarOferta(contenedor, item, api) {
  contenedor.innerHTML = enunciadoO(item, api);
  const textos = opcionesOferta(item, api.idioma);
  const botones = elecciones(contenedor, {
    opciones: textos.map((html, i) => ({ valor: i, html })),
    clase: 'elecciones elecciones--3',
    alElegir(i) {
      if (api.respondido()) return;
      botones.marcar([item.buena], i);
      if (i === item.buena) return api.responder({ acierto: true, html: ({ idioma }) => explicaOferta(item, idioma) });
      const error = errorOferta(item, i);
      api.responder({
        acierto: false,
        error,
        respuesta: String(i),
        html: ({ idioma }) => feedbackOferta(item, error, idioma),
        espera: 3400,
      });
    },
  });
}

// ─── Ejercicio 5 ───────────────────────────────────────────────────────────────

const enunciadoS = (item, { idioma }) => {
  const e = enunciadoSentido(item, idioma);
  return `<p class="instruccion instruccion--enunciado">${e.texto}</p><p class="dado">${e.dado}</p><p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarSentido(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoS(item, api);
  const botones = elecciones(contenedor, {
    opciones: MOTIVOS.map(m => ({ valor: m, html: tt(MOTIVO[m]) })),
    clase: 'elecciones',
    alElegir(m) {
      if (api.respondido()) return;
      botones.marcar([item.motivo], m);
      if (m === item.motivo) return api.responder({ acierto: true, html: ({ idioma }) => explicaSentido(item, idioma) });
      api.responder({
        acierto: false,
        error: m === 'ok' ? 'da-por-buena-una-mala' : `confunde-con-${m}`,
        respuesta: m,
        html: ({ idioma }) => explicaSentido(item, idioma),
        espera: 3600,
      });
    },
  });
}

arrancar({
  slug: 'problemas-proporcion',
  ejercicios: [
    {
      nombre: TX.tipo.nombre, detalle: TX.tipo.detalle, introduccion: TX.tipo.introduccion,
      generar: generarTipo,
      clave: item => `${item.tipo}:${item.ctx}:${Object.values(item.v).join(',')}`,
      montar: montarTipo, enunciado: enunciadoT,
      explicacion: (item, { idioma }) => explicaTipo(item, idioma),
    },
    {
      nombre: TX.oferta.nombre, detalle: TX.oferta.detalle, introduccion: TX.oferta.introduccion,
      generar: generarOferta,
      clave: item => `${item.prod}:${item.e.flat().join(',')}`,
      montar: montarOferta, enunciado: enunciadoO,
      explicacion: (item, { idioma }) => explicaOferta(item, idioma),
    },
    {
      nombre: TX.sentido.nombre, detalle: TX.sentido.detalle, introduccion: TX.sentido.introduccion,
      generar: generarSentido,
      clave: item => `${item.motivo}:${item.ctx}:${item.mostrado}:${item.total ?? Object.values(item.v).join(',')}`,
      montar: montarSentido, enunciado: enunciadoS,
      explicacion: (item, { idioma }) => explicaSentido(item, idioma),
    },
  ],
});
