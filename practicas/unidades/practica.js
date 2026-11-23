// PRÁCTICA «Cambia de unidad» (unidad 7, sesiones 17-18): longitud, masa y capacidad, horas y minutos, complejo e
// incomplejo y ¿qué unidad? (PU2, tarea 223). Ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aHtml, cantidad, UNIDADES_MEDIDA } from '../_comun/proporcion.js';
import {
  generarLongitud, claveLongitud, errorCambio, respuestaCambio, generarMasaCapacidad, claveMasaCapacidad, generarTiempo, claveTiempo,
  generarComplejo, claveComplejo, errorComplejo, buenoComplejo, generarUnidad, claveUnidad, leerMedida, esOtraUnidad,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, NOMBRE_ERROR, quePaso, enunciadoLongitud, enunciadoMasaCapacidad, enunciadoTiempo, enunciadoComplejo, enunciadoUnidad,
  explicaCambio, explicaTiempo, explicaComplejo, explicaUnidad,
} from './textos.js';

const instr = s => `<p class="instruccion">${s}</p>`;
const campo = nombre =>
  `<input type="text" class="campo-numero campo-reparto" id="c0" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;
const AVISO = {
  es: u => `Es la misma cantidad; escríbela en ${UNIDADES_MEDIDA[u].nombre.es[1]}.`,
  en: u => `That is the same amount; write it in ${UNIDADES_MEDIDA[u].nombre.en[1]}.`,
};

function feedbackError(error, item, { tt, idioma }, solucion) {
  const nombre = NOMBRE_ERROR[error] ?? NOMBRE_ERROR['otra-respuesta'];
  const que = error === 'otra-respuesta' ? '' : `<p>${quePaso(error, item, idioma)}</p>`;
  return `<p><strong>${tt(nombre)}.</strong></p>${que}${tt(solucion)(item)}`;
}

function montarCampo(contenedor, item, api, { enun, unidad, bueno, corregir, solucion }) {
  contenedor.innerHTML = `${enun}
    <p class="respuesta-linea"><label class="etiqueta-campo" for="c0">${unidad}</label> ${campo(api.esc(unidad))}</p>
    <p class="aviso-unidad" id="aviso-unidad" role="status" hidden></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#c0'), boton = contenedor.querySelector('#comprobar'), aviso = contenedor.querySelector('#aviso-unidad');
  const valida = () => leerMedida(caja.value, unidad, api.idioma) !== null;
  const actualizar = () => {
    const malo = caja.value.trim() !== '' && !valida();
    caja.classList.toggle('campo-numero--malo', malo);
    caja.setAttribute('aria-invalid', String(malo));
    boton.disabled = !valida() || api.respondido();
    aviso.hidden = true;
  };
  const comprobar = () => {
    if (api.respondido() || !valida()) return;
    if (esOtraUnidad(leerMedida(caja.value, unidad, api.idioma), bueno, unidad)) {
      aviso.textContent = AVISO[api.idioma](unidad);
      aviso.hidden = false;
      return;
    }
    caja.disabled = true;
    boton.hidden = true;
    const error = corregir(caja.value);
    caja.classList.add(error === null ? 'campo-reparto--bien' : 'campo-reparto--mal');
    api.responder({
      acierto: error === null, error: error ?? undefined, respuesta: caja.value.trim(), espera: error === null ? 2500 : 'boton',
      html: textos => (error === null ? textos.tt(solucion)(item) : feedbackError(error, item, textos, solucion)),
    });
  };
  caja.addEventListener('input', actualizar);
  caja.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

function montarElegir(contenedor, item, api, { enun, tx, texto }) {
  contenedor.innerHTML = `${enun}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.ops.map(o => ({ valor: o.id, html: `<span class="cuenta">${texto(o, api.idioma)}</span>` })),
    alElegir(valor) {
      if (api.respondido()) return;
      const op = item.ops.find(o => o.id === valor), buena = item.ops.find(o => o.correcta);
      botones.marcar([buena.id], valor);
      api.responder({
        acierto: op.correcta, error: op.error ?? undefined, respuesta: texto(op, 'es').replace(/<[^>]+>/g, ''), espera: op.correcta ? 2500 : 'boton',
        html: textos => (op.correcta ? textos.tt(tx.solucion)(item) : feedbackError(op.error, { ...item, elegida: op.unidad }, textos, tx.solucion)),
      });
    },
  });
}

const enun = (f, tx) => (item, { idioma, tt }) => `${instr(f(item, idioma))}${instr(tt(tx.instruccion))}`;
const textoCantidad = it => (o, i) => aHtml(cantidad(o.valor, it.a), i);

const enunciado1 = enun(enunciadoLongitud, TX.ej1);
const montar1 = (contenedor, item, api) => montarCampo(contenedor, item, api, {
  enun: enunciado1(item, api), unidad: item.a, bueno: item.res, solucion: TX.ej1.solucion, corregir: texto => errorCambio(item, texto, api.idioma),
});
const enunciado2 = enun(enunciadoMasaCapacidad, TX.ej2);
const montar2 = (contenedor, item, api) => montarElegir(contenedor, item, api, { enun: enunciado2(item, api), tx: TX.ej2, texto: textoCantidad(item) });
const enunciado3 = enun(enunciadoTiempo, TX.ej3);
const montar3 = (contenedor, item, api) => montarElegir(contenedor, item, api, { enun: enunciado3(item, api), tx: TX.ej3, texto: textoCantidad(item) });
const enunciado4 = enun(enunciadoComplejo, TX.ej4);
const montar4 = (contenedor, item, api) => montarCampo(contenedor, item, api, {
  enun: enunciado4(item, api), unidad: item.pequena, bueno: buenoComplejo(item), solucion: TX.ej4.solucion, corregir: texto => errorComplejo(item, texto, api.idioma),
});
const enunciado5 = enun(enunciadoUnidad, TX.ej5);
const montar5 = (contenedor, item, api) => montarElegir(contenedor, item, api, {
  enun: enunciado5(item, api), tx: TX.ej5,
  texto: (o, i) => `${o.unidad} <small>${UNIDADES_MEDIDA[o.unidad].nombre[i][1]}</small>`,
});

const ejercicio = (tx, generar, clave, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar: rng => generar(rng), clave, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'unidades',
  ejercicios: [
    ejercicio(TX.ej1, generarLongitud, claveLongitud, montar1, enunciado1, explicaCambio, true),
    ejercicio(TX.ej2, generarMasaCapacidad, claveMasaCapacidad, montar2, enunciado2, explicaCambio, false),
    ejercicio(TX.ej3, generarTiempo, claveTiempo, montar3, enunciado3, explicaTiempo, false),
    ejercicio(TX.ej4, generarComplejo, claveComplejo, montar4, enunciado4, explicaComplejo, true),
    ejercicio(TX.ej5, generarUnidad, claveUnidad, montar5, enunciado5, explicaUnidad, false),
  ],
});
