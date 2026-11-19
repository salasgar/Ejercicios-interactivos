// Práctica «Razones y proporciones» (PU2, tarea 212, unidad 7, sesión 1): la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en logica.js y los textos en textos.js; pruebas en
// tests/practicas-razones.test.js y tests/practicas-ayuda-razones.test.js.

import { arrancar } from '../_comun/base.js';
import { campoNumero, elecciones } from '../_comun/piezas.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';
import {
  generarRazon, claveRazon, buenaRazon, errorRazon,
  generarEquivalentes, claveEquivalentes, errorEquivalentes, errorSencilla,
  generarProporcion, claveProporcion, errorProporcion,
  generarTermino, claveTermino, errorTermino, leerRespuesta,
} from './logica.js';
import {
  TX, respuestaRazon, enunciadoRazon, feedbackRazon, explicaRazon,
  enunciadoEquivalentes, feedbackEquivalentes, explicaEquivalentes,
  enunciadoProporcion, feedbackProporcion, explicaProporcion,
  enunciadoTermino, feedbackTermino, explicaTermino,
} from './textos.js';

const htmlOpcion = o => htmlFraccion(fraccion(o.num, o.den), { conUno: true });
const noLoSe = { es: 'No sé hacerlo', en: 'I don’t know how' };

// Elegir entre cuatro fracciones (ejercicio 1 y ejercicio 2 (a)).
function montarElegir(contenedor, item, api, { enunciado, errorDe, feedback }) {
  contenedor.innerHTML = enunciado(item, { idioma: api.idioma });
  const buena = respuestaRazon(buenaRazon(item));
  const caja = elecciones(contenedor, {
    clase: 'elecciones elecciones--4 botones-fracciones',
    opciones: item.opciones.map(o => ({ valor: respuestaRazon(o), html: htmlOpcion(o) })),
    alElegir(valor) {
      if (api.respondido()) return;
      caja.marcar([buena], valor);
      const acierto = valor === buena;
      const error = acierto ? null : errorDe(item, valor);
      api.responder({
        acierto,
        html: ({ idioma }) => feedback(item, error, valor, idioma),
        espera: 3200,
        ...(acierto ? {} : { error: error ?? 'otra-fraccion', respuesta: valor }),
      });
    },
  });
}

// Escribir la razón más sencilla: dos campos, uno sobre otro (ejercicio 2 (b)).
function montarSencilla(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoEquivalentes(item, { idioma: api.idioma })}
    <div class="respuesta-razon"><span class="frac"><span id="num"></span><span id="den"></span></span></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campoNum = campoNumero(contenedor.querySelector('#num'), { nombre: tt(TX.sencilla.arriba), cifras: 3, idioma: api.idioma });
  const campoDen = campoNumero(contenedor.querySelector('#den'), { nombre: tt(TX.sencilla.abajo), cifras: 3, idioma: api.idioma });
  const completa = () => campoNum.valor() !== null && campoDen.valor() !== null && campoDen.valor() > 0;
  const actualizar = () => { boton.disabled = !completa(); };
  [campoNum, campoDen].forEach(c => c.elemento.addEventListener('input', actualizar));
  actualizar();

  function comprobar() {
    if (api.respondido() || !completa()) return;
    const mia = { num: campoNum.valor(), den: campoDen.valor() };
    const error = errorSencilla(item, mia.num, mia.den);
    [campoNum, campoDen].forEach(c => { c.bloquear(); c.elemento.classList.add(error === null ? 'respuesta--bien' : 'respuesta--mal'); });
    boton.hidden = true;
    api.responder({
      acierto: error === null,
      html: ({ idioma }) => feedbackEquivalentes(item, error, mia, idioma),
      espera: 3200,
      ...(error === null ? {} : { error, respuesta: `${mia.num}/${mia.den}` }),
    });
  }
  boton.addEventListener('click', comprobar);
  [campoNum, campoDen].forEach(c => c.elemento.addEventListener('keydown', ev => { if (ev.key === 'Enter') comprobar(); }));
}

const montarEquivalentes = (contenedor, item, api) => (item.tipo === 'elegir'
  ? montarElegir(contenedor, item, api, { enunciado: enunciadoEquivalentes, errorDe: errorEquivalentes, feedback: (it, e, v, idioma) => feedbackEquivalentes(it, e, v, idioma) })
  : montarSencilla(contenedor, item, api));

// ¿Forman proporción?: sí o no, con «Siguiente» (se acierta al azar y hay que leer la razón).
function montarProporcion(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = enunciadoProporcion(item, { idioma: api.idioma });
  const buena = item.si ? 'si' : 'no';
  const caja = elecciones(contenedor, {
    clase: 'elecciones elecciones--2',
    opciones: [{ valor: 'si', html: tt(TX.prop.si) }, { valor: 'no', html: tt(TX.prop.no) }],
    alElegir(valor) {
      if (api.respondido()) return;
      caja.marcar([buena], valor);
      const error = errorProporcion(item, valor === 'si');
      api.responder({
        acierto: error === null,
        html: ({ idioma }) => feedbackProporcion(item, error, idioma),
        espera: 'boton',
        ...(error === null ? {} : { error, respuesta: valor === 'si' ? 'Sí' : 'No' }),
      });
    },
  });
}

// El término que falta: un campo con la x (se admite 15, 15,0 o 30/2).
function montarTermino(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoTermino(item, { idioma: api.idioma })}
    <div class="respuesta-x"><span class="respuesta-x__x">x =</span><input type="text" class="campo-numero" id="x" inputmode="text" autocomplete="off" spellcheck="false" aria-label="${tt(TX.term.nombreCampo)}" style="--cifras:4"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = contenedor.querySelector('#x');
  const leido = () => leerRespuesta(campo.value, api.idioma);
  const actualizar = () => { boton.disabled = leido() === null; };
  campo.addEventListener('input', actualizar);
  actualizar();

  function comprobar() {
    const valor = leido();
    if (api.respondido() || valor === null) return;
    const error = errorTermino(item, valor);
    campo.disabled = true;
    campo.classList.add(error === null ? 'respuesta--bien' : 'respuesta--mal');
    boton.hidden = true;
    api.responder({
      acierto: error === null,
      html: ({ idioma }) => feedbackTermino(item, error, idioma),
      espera: 3200,
      ...(error === null ? {} : { error, respuesta: campo.value.trim() }),
    });
  }
  boton.addEventListener('click', comprobar);
  campo.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
}

arrancar({
  slug: 'razones',
  ejercicios: [
    {
      nombre: TX.razon.nombre,
      detalle: TX.razon.detalle,
      introduccion: TX.razon.introduccion,
      generar: generarRazon,
      clave: claveRazon,
      montar: (c, item, api) => montarElegir(c, item, api, { enunciado: enunciadoRazon, errorDe: errorRazon, feedback: (it, e, v, idioma) => feedbackRazon(it, e, idioma) }),
      enunciado: enunciadoRazon,
      explicacion: explicaRazon,
    },
    {
      nombre: TX.equi.nombre,
      detalle: TX.equi.detalle,
      introduccion: TX.equi.introduccion,
      generar: generarEquivalentes,
      clave: claveEquivalentes,
      montar: montarEquivalentes,
      enunciado: enunciadoEquivalentes,
      explicacion: explicaEquivalentes,
      noLoSe,
    },
    {
      nombre: TX.prop.nombre,
      detalle: TX.prop.detalle,
      introduccion: TX.prop.introduccion,
      generar: generarProporcion,
      clave: claveProporcion,
      montar: montarProporcion,
      enunciado: enunciadoProporcion,
      explicacion: explicaProporcion,
    },
    {
      nombre: TX.term.nombre,
      detalle: TX.term.detalle,
      introduccion: TX.term.introduccion,
      generar: generarTermino,
      clave: claveTermino,
      montar: montarTermino,
      enunciado: enunciadoTermino,
      explicacion: explicaTermino,
      noLoSe,
    },
  ],
});
