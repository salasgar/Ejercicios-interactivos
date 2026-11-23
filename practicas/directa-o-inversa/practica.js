// «¿Directa, inversa o ninguna?» (PU2, tarea 216), unidad 7 (sesión 6). Tres ejercicios:
//   1. Clasifica la situación   banco de situaciones con su condición; tres casillas       (U7-2A-02)
//   2. Clasifica la tabla       cociente constante, producto constante o ninguno             (U7-2C-02)
//   3. ¿Qué planteamiento?      cuatro cuentas, solo una resuelve el problema               (U7-2C-01, 2C-03)
// La lógica está en `logica.js`; los textos, las explicaciones y el feedback, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { CLASES, generarSituacion, generarTabla, generarPlanteamiento, errorDe } from './logica.js';
import {
  TX, CLASE, enunciadoSituacion, explicaSituacion, feedbackSituacion, enunciadoTabla, explicaTabla, feedbackTabla,
  enunciadoPlan, cuentaTexto, explicaPlan, feedbackPlan,
} from './textos.js';

function montarClasificar(contenedor, item, api, { enunciado, feedback }) {
  contenedor.innerHTML = enunciado(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--3 elecciones--fila',
    opciones: CLASES.map(c => ({ valor: c, html: api.tt(CLASE[c]) })),
    alElegir(elegida) {
      if (api.respondido()) return;
      botones.marcar([item.clase], elegida);
      if (elegida === item.clase) return api.responder({ acierto: true, html: ({ idioma }) => feedback(item, elegida, idioma, true), espera: 'boton' });
      api.responder({
        acierto: false,
        error: errorDe(item.clase, elegida),
        respuesta: elegida,
        html: ({ idioma }) => feedback(item, elegida, idioma, false),
        espera: 'boton',
      });
    },
  });
}

const enunciadoSit = (item, { idioma }) => enunciadoSituacion(item, idioma);
const enunciadoTab = (item, { idioma }) => enunciadoTabla(item, idioma);
const enunciadoPl = (item, { idioma }) => enunciadoPlan(item, idioma);

function montarPlanteamiento(contenedor, item, api) {
  contenedor.innerHTML = enunciadoPl(item, api);
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--4 elecciones--cuentas',
    opciones: item.opciones.map(tipo => ({ valor: tipo, html: `<span class="cuenta">${cuentaTexto(item, tipo, api.idioma)}</span>` })),
    alElegir(tipo) {
      if (api.respondido()) return;
      botones.marcar(['buena'], tipo);
      if (tipo === 'buena') return api.responder({ acierto: true, html: ({ idioma }) => explicaPlan(item, idioma) });
      api.responder({ acierto: false, error: tipo, respuesta: tipo, html: ({ idioma }) => feedbackPlan(item, tipo, idioma), espera: 3200 });
    },
  });
}

const clave = item => item.id ?? (item.xs ? `${item.xs.join(',')}|${item.ys.join(',')}` : `${item.sentido}:${item.ctx}:${item.a}:${item.b}:${item.c}`);

arrancar({
  slug: 'directa-o-inversa',
  ejercicios: [
    {
      nombre: TX.situacion.nombre,
      detalle: TX.situacion.detalle,
      introduccion: TX.situacion.introduccion,
      generar: generarSituacion,
      clave,
      montar: (c, item, api) => montarClasificar(c, item, api, {
        enunciado: enunciadoSit,
        feedback: (it, elegida, idioma, bien) => (bien ? explicaSituacion(it, idioma) : feedbackSituacion(it, elegida, idioma)),
      }),
      enunciado: enunciadoSit,
      explicacion: (item, { idioma }) => explicaSituacion(item, idioma),
    },
    {
      nombre: TX.tabla.nombre,
      detalle: TX.tabla.detalle,
      introduccion: TX.tabla.introduccion,
      generar: generarTabla,
      clave,
      montar: (c, item, api) => montarClasificar(c, item, api, {
        enunciado: enunciadoTab,
        feedback: (it, elegida, idioma, bien) => (bien ? explicaTabla(it, idioma) : feedbackTabla(it, elegida, idioma)),
      }),
      enunciado: enunciadoTab,
      explicacion: (item, { idioma }) => explicaTabla(item, idioma),
    },
    {
      nombre: TX.plan.nombre,
      detalle: TX.plan.detalle,
      introduccion: TX.plan.introduccion,
      generar: generarPlanteamiento,
      clave,
      montar: montarPlanteamiento,
      enunciado: enunciadoPl,
      explicacion: (item, { idioma }) => explicaPlan(item, idioma),
    },
  ],
});
