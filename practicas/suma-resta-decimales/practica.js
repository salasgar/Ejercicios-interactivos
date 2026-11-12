// PRÁCTICA «Suma y resta decimales» (unidad 5, semana 1, sesión 3): alinear la coma, un problema de
// supermercado (fruta al peso y gasolina, con la vuelta), medidas y mover la coma al multiplicar y dividir
// por 10, 100 y 1000. Cuatro ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (el hueco de la cuenta y la lista de la compra).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto, deTexto } from '../_comun/decimales.js';
import { explicaAlinea, explicaSuper, explicaMedidas, explicaMueve } from './ayuda.js';
import { TX, calculoAlinea, calculoMueve, enunciadoSuper, enunciadoMedidas } from './textos.js';
import {
  D, claveDe, generarAlinea, generarSuper, generarMedidas, generarMueve,
  errorDeAlinea, errorDeSuper, errorDeMedidas, errorDeMueve,
} from './logica.js';

const HUECO = '<span class="hueco-fd">?</span>';
const num = (d, idioma) => aTexto(D(d), idioma);

/** Un campo para escribir un decimal (la coma o el punto valen en los dos idiomas). */
const htmlCampoDecimal = nombre =>
  `<input type="text" class="campo-numero campo-numero--decimal" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej1.instruccion[item.tipo])}</p>
  <div class="operacion">${calculoAlinea(item, idioma)} = ${HUECO}</div>`;

const enunciado2 = (item, { tt, idioma }) => {
  const e = enunciadoSuper(item, idioma);
  return `<p class="instruccion">${tt(TX.ej2.instruccion)}</p>
    <p class="instruccion instruccion--enunciado">${e.texto}</p>
    ${e.lineas ? `<ul class="lista-compra">${e.lineas.join('')}</ul>` : ''}
    <p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

const enunciado3 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej3.instruccion[item.tipo])}</p>
  <p class="instruccion instruccion--enunciado">${enunciadoMedidas(item, idioma)}</p>`;

const enunciado4 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej4.instruccion[item.tipo])}</p>
  <div class="operacion">${calculoMueve(item, idioma)} = ${HUECO}</div>`;

// ─── Montaje común: escribir un decimal o elegir entre cuatro ────────────────────────────────

function responder(item, api, TXej, error, respuesta, valor) {
  api.responder({
    acierto: error === null,
    error: error ?? undefined,
    respuesta,
    espera: 2800,
    html: ({ tt }) => (error === null ? tt(TXej.correcto)(item) : tt(TXej.por_que[error])(item, valor) + tt(TXej.solucion)(item)),
  });
}

function montarEscribir(contenedor, item, api, { enunciado, TXej, corregir, nombreCampo }) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado(item, api)}${htmlCampoDecimal(api.esc(tt(nombreCampo)))}
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
    responder(item, api, TXej, corregir(item, valor), campo.value.trim(), { m: valor.m, k: valor.k });
  };
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

function montarElegir(contenedor, item, api, { enunciado, TXej }) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: num(o.d, api.idioma) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
      responder(item, api, TXej, elegida.correcta ? null : elegida.error, num(elegida.d, 'es'), elegida.d);
    },
  });
}

const montarDe = (enunciado, TXej, corregir, nombreCampo = TX.campos.resultado) => (contenedor, item, api) => (
  item.tipo === 'elegir'
    ? montarElegir(contenedor, item, api, { enunciado, TXej })
    : montarEscribir(contenedor, item, api, { enunciado, TXej, corregir, nombreCampo }));

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────

const NO_SE = { es: 'No sé hacerlo', en: 'I don’t know how' };

const ejercicio = (tx, generar, montar, enunciado, explicacion) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
  explicacion, noLoSe: NO_SE,
});

arrancar({
  slug: 'suma-resta-decimales',
  ejercicios: [
    ejercicio(TX.ej1, generarAlinea, montarDe(enunciado1, TX.ej1, errorDeAlinea), enunciado1, explicaAlinea),
    ejercicio(TX.ej2, generarSuper, montarDe(enunciado2, TX.ej2, errorDeSuper, TX.campos.importe), enunciado2, explicaSuper),
    ejercicio(TX.ej3, generarMedidas, montarDe(enunciado3, TX.ej3, errorDeMedidas), enunciado3, explicaMedidas),
    ejercicio(TX.ej4, generarMueve, montarDe(enunciado4, TX.ej4, errorDeMueve), enunciado4, explicaMueve),
  ],
});
