// PRÁCTICA «Escalas» (unidad 7, sesiones 16-18): del plano a la realidad, de la realidad al plano, ¿qué escala es?
// y ¿qué escala le va? (PU2, tarea 222). Ficheros: logica.js (puro), textos.js, practica.js (interfaz), estilos.css.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import {
  generarARealidad, claveARealidad, errorARealidad, generarAlPlano, claveAlPlano, errorAlPlano, generarQueEscala, claveQueEscala,
  generarEncaja, claveEncaja, leerMedida,
} from './logica.js';
import {
  TX, NO_SE_HACERLO, NOMBRE_ERROR, quePaso, enunciadoARealidad, enunciadoAlPlano, enunciadoQueEscala, enunciadoEncaja,
  explicaARealidad, explicaAlPlano, explicaQueEscala, explicaEncaja,
} from './textos.js';

const instr = s => `<p class="instruccion">${s}</p>`;
const campo = (nombre) =>
  `<input type="text" class="campo-numero campo-reparto" id="c0" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

function feedbackError(error, item, { tt, idioma }, solucion) {
  const nombre = NOMBRE_ERROR[error] ?? NOMBRE_ERROR['otra-respuesta'];
  const que = error === 'otra-respuesta' ? '' : `<p>${quePaso(error, item, idioma)}</p>`;
  return `<p><strong>${tt(nombre)}.</strong></p>${que}${tt(solucion)(item)}`;
}

function montarCampo(contenedor, item, api, { enun, etiqueta, unidad, corregir, solucion }) {
  contenedor.innerHTML = `${enun}
    <p class="respuesta-linea"><label class="etiqueta-campo" for="c0">${etiqueta}</label> ${campo(api.esc(etiqueta))}</p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const caja = contenedor.querySelector('#c0'), boton = contenedor.querySelector('#comprobar');
  const valida = () => leerMedida(caja.value, unidad, api.idioma) !== null;
  const actualizar = () => {
    const malo = caja.value.trim() !== '' && !valida();
    caja.classList.toggle('campo-numero--malo', malo);
    caja.setAttribute('aria-invalid', String(malo));
    boton.disabled = !valida() || api.respondido();
  };
  const comprobar = () => {
    if (api.respondido() || !valida()) return;
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

const enunciado1 = (item, { idioma, tt }) => `${instr(enunciadoARealidad(item, idioma))}${instr(tt(TX.ej1.instruccion))}`;

function montar1(contenedor, item, api) {
  montarCampo(contenedor, item, api, {
    enun: enunciado1(item, api), etiqueta: item.unidad === 'km' ? 'km' : 'm', unidad: item.unidad, solucion: TX.ej1.solucion,
    corregir: texto => errorARealidad(item, texto, api.idioma),
  });
}
const enunciado2 = (item, { idioma, tt }) => `${instr(enunciadoAlPlano(item, idioma))}${instr(tt(TX.ej2.instruccion))}`;
function montar2(contenedor, item, api) {
  montarCampo(contenedor, item, api, {
    enun: enunciado2(item, api), etiqueta: 'cm', unidad: 'cm', solucion: TX.ej2.solucion,
    corregir: texto => errorAlPlano(item, texto, api.idioma),
  });
}

function montarElegir(contenedor, item, api, { enun, tx }) {
  contenedor.innerHTML = `${enun}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.ops.map(o => ({ valor: o.id, html: `<span class="cuenta">${o.texto}</span>` })),
    alElegir(valor) {
      if (api.respondido()) return;
      const op = item.ops.find(o => o.id === valor), buena = item.ops.find(o => o.correcta);
      botones.marcar([buena.id], valor);
      api.responder({
        acierto: op.correcta, error: op.error ?? undefined, respuesta: op.texto, espera: op.correcta ? 2500 : 'boton',
        html: textos => (op.correcta ? textos.tt(tx.solucion)(item) : feedbackError(op.error, { ...item, elegida: op }, textos, tx.solucion)),
      });
    },
  });
}
const enunciado3 = (item, { idioma, tt }) => `${instr(enunciadoQueEscala(item, idioma))}${instr(tt(TX.ej3.instruccion))}`;
const montar3 = (contenedor, item, api) => montarElegir(contenedor, item, api, { enun: enunciado3(item, api), tx: TX.ej3 });
const enunciado4 = (item, { idioma, tt }) => `${instr(enunciadoEncaja(item, idioma))}${instr(tt(TX.ej4.instruccion))}`;
const montar4 = (contenedor, item, api) => montarElegir(contenedor, item, api, { enun: enunciado4(item, api), tx: TX.ej4 });

const ejercicio = (tx, generar, clave, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar: rng => generar(rng), clave, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'escalas',
  ejercicios: [
    ejercicio(TX.ej1, generarARealidad, claveARealidad, montar1, enunciado1, explicaARealidad, true),
    ejercicio(TX.ej2, generarAlPlano, claveAlPlano, montar2, enunciado2, explicaAlPlano, true),
    ejercicio(TX.ej3, generarQueEscala, claveQueEscala, montar3, enunciado3, explicaQueEscala, false),
    ejercicio(TX.ej4, generarEncaja, claveEncaja, montar4, enunciado4, explicaEncaja, false),
  ],
});
