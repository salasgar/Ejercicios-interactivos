// Práctica «Del enunciado al álgebra» de la unidad 6 (Algebra): elegir la expresión de una frase,
// escribirla, elegir la frase de una expresión y resolver situaciones con una letra. Contrato de
// la base en `../_comun/base.js`; la lógica (ítems, distractores, corrección) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, explicaTraduce, NO_SE_HACERLO } from './textos.js';
import {
  generarElige, generarEscribe, generarFrase, generarSituacion, corregirEscribe, claveItem, nombreDe,
} from './logica.js';

const glosa = (item, { tt }) => (item.glosa ? `<p class="glosa">${tt(TX.escribe.glosa)}: ${tt({ es: item.glosa, en: item.glosa })}</p>` : '');
const cuentaHtml = h => `<span class="cuenta">${h}</span>`;

const enunciadoFrase = (item, api) => `
    <p class="instruccion">${api.tt(TX.instrucciones[item.instruccion])}</p>
    <p class="frase">«${api.esc(api.tt(item.frase))}»</p>
    ${glosa(item, api)}`;

const enunciadoExpresion = (item, api) => `
    <p class="instruccion">${api.tt(TX.instrucciones.frase)}</p>
    <p class="frase">${cuentaHtml(item.expresion)}</p>`;

const enunciadoSituacion = (item, api) => `
    <p class="instruccion">${api.tt(TX.instrucciones[item.instruccion])}</p>
    <p class="frase">${api.esc(api.tt(item.enunciado))}${item.pregunta ? ` ${api.esc(api.tt(item.pregunta))}` : ''}</p>
    ${item.tipo === 'expresion' ? `<p class="glosa">${api.esc(api.tt({ es: `La letra es ${item.letra}.`, en: `The letter is ${item.letra}.` }))}</p>` : ''}
    ${glosa(item, api)}`;

function montarElegir(contenedor, item, api, enunciado, htmlOpcion) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase: 'elecciones elecciones--1',
    opciones: item.opciones.map(o => ({ valor: o.valor, html: htmlOpcion(o, api) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => o.valor === valor);
      botones.marcar(item.opciones.filter(o => o.correcta).map(o => o.valor), valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.error ?? undefined,
        respuesta: elegida.texto ?? elegida.frases?.es ?? elegida.valor,
        espera: 2200,
        html: ({ tt }) => (elegida.correcta ? '' : `${tt(elegida.por_que)} `) + tt(item.solucion),
      });
    },
  });
}

const montarExpresion = (c, item, api) => montarElegir(c, item, api, enunciadoFrase, o => o.html);
const montarFrase = (c, item, api) => montarElegir(c, item, api, enunciadoExpresion, (o, a) => a.esc(a.tt(o.frases)));
const montarSituacion = (c, item, api) => montarElegir(c, item, api, enunciadoSituacion, (o, a) => (item.tipo === 'valor' ? a.esc(a.tt(o.frases)) : o.html));

function montarEscribe(contenedor, item, api) {
  const { tt, esc } = api;
  contenedor.innerHTML = `
    ${enunciadoFrase(item, api)}
    <input type="text" class="campo-expresion" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(tt(TX.escribe.campo))}" placeholder="2x + 3">
    <p class="aviso-campo" aria-live="polite"></p>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const campo = contenedor.querySelector('.campo-expresion');
  const aviso = contenedor.querySelector('.aviso-campo');
  const boton = contenedor.querySelector('#comprobar');

  const estado = () => {
    const v = campo.value.trim();
    if (v === '') return { listo: false };
    const r = corregirEscribe(item, v);
    return r.valida ? { listo: true } : { listo: false, mensaje: r.mensaje };
  };
  const actualizar = () => {
    const e = estado();
    aviso.textContent = e.mensaje ? tt(e.mensaje) : '';
    campo.classList.toggle('campo-expresion--malo', Boolean(e.mensaje));
    campo.setAttribute('aria-invalid', String(Boolean(e.mensaje)));
    boton.disabled = !e.listo;
  };
  function comprobar() {
    if (api.respondido() || !estado().listo) return;
    const r = corregirEscribe(item, campo.value);
    campo.disabled = true;
    boton.hidden = true;
    campo.classList.add(r.acierto ? 'campo-expresion--bien' : 'campo-expresion--mal');
    api.responder({
      acierto: r.acierto,
      error: r.acierto ? undefined : r.error,
      respuesta: campo.value.trim(),
      espera: 2200,
      html: ({ tt: t, idioma }) => `${r.acierto ? '' : `${nombreDe(r.error)[idioma]}. `}${t(item.solucion)}`,
    });
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
}

const ejercicio = (i, { generar, montar, enunciado, noLoSe }) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave: claveItem, montar, enunciado,
  explicacion: explicaTraduce,
  ...(noLoSe ? { noLoSe: NO_SE_HACERLO } : {}),
});

arrancar({
  slug: 'traduce',
  ejercicios: [
    ejercicio(0, { generar: generarElige, montar: montarExpresion, enunciado: enunciadoFrase }),
    ejercicio(1, { generar: generarEscribe, montar: montarEscribe, enunciado: enunciadoFrase, noLoSe: true }),
    ejercicio(2, { generar: generarFrase, montar: montarFrase, enunciado: enunciadoExpresion }),
    ejercicio(3, { generar: generarSituacion, montar: montarSituacion, enunciado: enunciadoSituacion }),
  ],
});
