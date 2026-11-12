// PRÁCTICA «Multiplica y divide decimales» (unidad 5, semana 2, sesiones 5 y 6): colocar la coma, dividir
// entre un natural, dividir entre un decimal, comprobar una división, problemas (fruta al peso y gasolina)
// y combinadas con decimales. Seis ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (el hueco de la cuenta).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { aTexto, deTexto } from '../_comun/decimales.js';
import {
  TX, enunciadoComa, cuentaEntre, cuentaDecimal, divisionHecha, enunciadoProblema,
  explicaComa, explicaEntre, explicaDecimal, explicaEstaBien, explicaProblema, explicaCombinada,
} from './textos.js';
import { textoExpresion } from './logica.js';
import {
  D, claveDe, generarComa, generarEntre, generarDecimal, generarEstaBien, generarProblema, generarCombinada,
  errorDeComa, errorDeEntre, errorDeDecimal, errorDeEstaBien, errorDeProblema, errorDeCombinada,
} from './logica.js';

const HUECO = '<span class="hueco-fd">?</span>';
const num = (d, idioma) => aTexto(D(d), idioma);

const htmlCampoDecimal = nombre =>
  `<input type="text" class="campo-numero campo-numero--decimal" id="campo" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────

const enunciado1 = (item, { tt, idioma }) => {
  const e = enunciadoComa(item, idioma);
  return `<p class="instruccion">${tt(TX.ej1.instruccion[item.tipo])}</p>
    ${e.dato ? `<p class="instruccion instruccion--enunciado">${e.dato}</p>` : ''}
    <div class="operacion">${e.cuenta} = ${HUECO}</div>`;
};

const enunciado2 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej2.instruccion[item.tipo])}</p>
  <div class="operacion">${cuentaEntre(item, idioma)} = ${HUECO}</div>`;

const enunciado3 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej3.instruccion[item.tipo])}</p>
  <div class="operacion">${cuentaDecimal(item, idioma)}${item.tipo === 'escribir' ? ` = ${HUECO}` : ''}</div>`;

const enunciado4 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej4.instruccion)}</p>
  <div class="operacion"><span class="cuenta-frac">${divisionHecha(item, idioma)}</span></div>`;

const enunciado5 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej5.instruccion)}</p>
  <p class="instruccion instruccion--enunciado">${enunciadoProblema(item, idioma)}</p>`;

const enunciado6 = (item, { tt, idioma }) => `<p class="instruccion">${tt(TX.ej6.instruccion[item.tipo])}</p>
  <div class="operacion"><span class="cuenta-frac">${textoExpresion(item.expresion, idioma)} = ${HUECO}</span></div>`;

// ─── Montaje común ───────────────────────────────────────────────────────────────────────────

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

/** Elegir entre opciones: `htmlDe(opción, idioma)` y `valorDe(opción)` (lo que se pasa al feedback). */
function montarElegir(contenedor, item, api, { enunciado, TXej, htmlDe, valorDe }) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: htmlDe(o, api.idioma) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((o, i) => (o.correcta ? i : null)).filter(i => i !== null), valor);
      responder(item, api, TXej, elegida.correcta ? null : elegida.error, htmlDe(elegida, 'es'), valorDe(elegida));
    },
  });
}

const htmlNumero = (o, idioma) => num(o.d, idioma);
const htmlDivision = (o, idioma) => `${num(o.a, idioma)} : ${num(o.b, idioma)}`;

/** Escribir o elegir según `item.tipo` ('elegir' elige; 'equivalente' elige una división; lo demás se escribe). */
const montarDe = (enunciado, TXej, corregir, nombreCampo = TX.campos.resultado) => (contenedor, item, api) => {
  if (item.tipo === 'elegir') return montarElegir(contenedor, item, api, { enunciado, TXej, htmlDe: htmlNumero, valorDe: o => o.d });
  if (item.tipo === 'equivalente') return montarElegir(contenedor, item, api, { enunciado, TXej, htmlDe: htmlDivision, valorDe: o => ({ a: o.a, b: o.b }) });
  return montarEscribir(contenedor, item, api, { enunciado, TXej, corregir, nombreCampo });
};

/** Ej. 4: bien o mal. */
function montarEstaBien(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    clase: 'elecciones elecciones--2',
    opciones: [{ valor: 'bien', html: tt(TX.ej4.estaBien) }, { valor: 'mal', html: tt(TX.ej4.estaMal) }],
    alElegir(valor) {
      if (api.respondido()) return;
      const dijoBien = valor === 'bien';
      botones.marcar([item.estaBien ? 'bien' : 'mal'], valor);
      responder(item, api, TX.ej4, errorDeEstaBien(item, dijoBien), dijoBien ? 'bien' : 'mal', null);
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────

const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const ejercicio = (tx, generar, montar, enunciado, explicacion, noLoSe) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
  explicacion, ...(noLoSe ? { noLoSe } : {}),
});

arrancar({
  slug: 'multiplica-divide-decimales',
  ejercicios: [
    ejercicio(TX.ej1, generarComa, montarDe(enunciado1, TX.ej1, errorDeComa), enunciado1, explicaComa, NO_SE_HACERLO),
    ejercicio(TX.ej2, generarEntre, montarDe(enunciado2, TX.ej2, errorDeEntre, TX.campos.cociente), enunciado2, explicaEntre, NO_SE_HACERLO),
    ejercicio(TX.ej3, generarDecimal, montarDe(enunciado3, TX.ej3, errorDeDecimal, TX.campos.cociente), enunciado3, explicaDecimal, NO_SE_HACERLO),
    ejercicio(TX.ej4, generarEstaBien, montarEstaBien, enunciado4, explicaEstaBien),
    ejercicio(TX.ej5, generarProblema, montarDe(enunciado5, TX.ej5, errorDeProblema, TX.campos.resultado), enunciado5, explicaProblema, NO_SE_HACERLO),
    ejercicio(TX.ej6, generarCombinada, montarDe(enunciado6, TX.ej6, errorDeCombinada), enunciado6, explicaCombinada, NO_SE_HACERLO),
  ],
});
