// PRÁCTICA «¿Qué fracción es?» (unidad 4, semana 1): partes iguales de un todo, escribir la
// fracción de un dibujo o de un grupo, sombrearla y leerla en voz alta. Cuatro ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems, distractores y errores), textos.js,
// practica.js (interfaz), estilos.css (los campos de arriba y abajo de la fracción).
// Las figuras vienen de `../_comun/dibujo-fracciones.js` y la fracción, de `../_comun/fracciones.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero } from '../_comun/piezas.js';
import { crearFigura } from '../_comun/dibujo-fracciones.js';
import { fraccion, htmlFraccion, htmlRaya } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import {
  generarLeeFigura, generarSombrea, generarFrase, generarLee, errorLeeFigura, errorSombrea,
  errorFrase, contextoDe, claveDe,
} from './logica.js';

const comoTexto = f => `${f.num}/${f.den}`;
const frHtml = o => htmlFraccion({ num: o.num, den: o.den });

/**
 * Dos campos, uno encima del otro con la raya en medio, para escribir una fracción.
 * `valor()` es la fracción escrita (sin simplificar) o null si falta algo o el denominador es 0.
 */
function campoFraccion(contenedor, { nombres, idioma, alCambiar, alEnviar }) {
  contenedor.innerHTML = `<div class="campo-fraccion">${htmlRaya('<span data-arriba></span>', '<span data-abajo></span>')}</div>`;
  const dos = ['arriba', 'abajo'].map((cual, i) => campoNumero(contenedor.querySelector(`[data-${cual}]`), {
    nombre: nombres[i], cifras: 3, idioma,
    alEnviar: () => { const f = valor(); if (f) alEnviar(f); },
  }));
  const valor = () => {
    const a = dos[0].valor(), b = dos[1].valor();
    return a === null || b === null || b === 0 ? null : fraccion(a, b);
  };
  dos.forEach(d => d.elemento.addEventListener('input', () => alCambiar(valor())));
  return { valor, bloquear() { dos.forEach(d => d.bloquear()); } };
}

function nombresCampos(tt) {
  return [tt(TX.ej1.arriba), tt(TX.ej1.abajo)];
}

// ─── Ejercicio 1: lee la figura ───────────────────────────────────────────────────────

const enunciado1 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej1.instruccion)(item)}</p>`;

function montarLeeFigura(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado1(item, api)}
    <div id="figura"></div>
    <div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  crearFigura(contenedor.querySelector('#figura'), {
    tipo: item.tipo, partes: item.den, filas: item.filas, columnas: item.columnas,
    sombreadas: item.num, figuras: item.figuras, nombre: tt(TX.ej1.nombreFigura),
  });
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoFraccion(contenedor.querySelector('#campo'), {
    nombres: nombresCampos(tt), idioma: api.idioma,
    alCambiar: f => { boton.disabled = !f; },
    alEnviar: comprobar,
  });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(f) {
    if (api.respondido() || !f) return;
    campo.bloquear();
    boton.hidden = true;
    const error = errorLeeFigura(item, f);
    api.responder({
      acierto: error === null,
      error: error ?? undefined,
      respuesta: comoTexto(f),
      html: ({ tt }) => (error === null ? tt(TX.ej1.correcto)(item) : tt(TX.ej1.por_que[error])(item) + tt(TX.ej1.solucion)(item)),
      espera: 2400,
    });
  }
}

// ─── Ejercicio 2: sombrea la fracción ─────────────────────────────────────────────────

const enunciado2 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej2.instruccion)(item)}</p>`;

function montarSombrea(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado2(item, api)}
    <div id="figura"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const figura = crearFigura(contenedor.querySelector('#figura'), {
    tipo: item.tipo, partes: item.partes, filas: item.filas, columnas: item.columnas,
    sombreadas: 0, figuras: 1, nombre: tt(TX.ej2.nombreFigura)(item),
    alTocar: i => {
      if (api.respondido()) return;
      figura.alternar(i);
      boton.disabled = figura.sombreadas().length === 0;
    },
  });
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const elegidas = figura.sombreadas();
    boton.hidden = true;
    figura.bloquear();
    const error = errorSombrea(item, elegidas.length);
    // Cuatro estados: las que valen en verde, las de más tachadas y, si faltan, las que faltaban punteadas.
    elegidas.slice(0, item.objetivo).forEach(i => figura.marcar(i, 'fd-parte--bien'));
    elegidas.slice(item.objetivo).forEach(i => figura.marcar(i, 'fd-parte--mal'));
    const libres = Array.from({ length: item.partes }, (_, i) => i).filter(i => !elegidas.includes(i));
    libres.slice(0, Math.max(0, item.objetivo - elegidas.length)).forEach(i => figura.marcar(i, 'fd-parte--falta'));
    api.responder({
      acierto: error === null,
      error: error ?? undefined,
      respuesta: String(elegidas.length),
      html: ({ tt }) => (error === null
        ? tt(TX.ej2.correcto)(item)
        : tt(TX.ej2.por_que[error])(item, elegidas.length) + tt(TX.ej2.solucion)(item)),
      espera: 2400,
    });
  });
}

// ─── Ejercicio 3: de la frase a la fracción ───────────────────────────────────────────

const enunciado3 = (item, { tt }) => {
  const c = contextoDe(item.contexto);
  return `<p class="instruccion instruccion--enunciado">${tt(c)(item.n, item.k)} ${tt(c.pregunta)}</p>
    <p class="instruccion">${tt(item.modo === 'elegir' ? TX.ej3.elige : TX.ej3.escribe)}</p>`;
};

function feedback3(item, error, equivalente) {
  return ({ tt }) => {
    if (error === null) return (equivalente ? tt(TX.ej3.equivalente)(item) : '') + tt(TX.ej3.correcto)(item);
    return tt(TX.ej3.por_que[error])(item) + tt(TX.ej3.solucion)(item);
  };
}

function montarFrase(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado3(item, api)}<div id="respuesta"></div>`;
  const zona = contenedor.querySelector('#respuesta');
  if (item.modo === 'elegir') {
    const botones = elecciones(zona, {
      opciones: item.opciones.map(o => ({ valor: comoTexto(o), html: frHtml(o) })),
      alElegir(valor) {
        if (api.respondido()) return;
        const elegida = item.opciones.find(o => comoTexto(o) === valor);
        botones.marcar(item.opciones.filter(o => o.correcta).map(comoTexto), valor);
        api.responder({
          acierto: elegida.correcta,
          error: elegida.error ?? undefined,
          respuesta: valor,
          html: feedback3(item, elegida.error, false),
          espera: 2200,
        });
      },
    });
    return;
  }
  zona.innerHTML = `<div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const boton = zona.querySelector('#comprobar');
  const campo = campoFraccion(zona.querySelector('#campo'), {
    nombres: nombresCampos(tt), idioma: api.idioma,
    alCambiar: f => { boton.disabled = !f; },
    alEnviar: comprobar,
  });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  function comprobar(f) {
    if (api.respondido() || !f) return;
    campo.bloquear();
    boton.hidden = true;
    const error = errorFrase(item, f);
    api.responder({
      acierto: error === null,
      error: error ?? undefined,
      respuesta: comoTexto(f),
      html: feedback3(item, error, error === null && !f.mismaForma(fraccion(item.k, item.n))),
      espera: 2400,
    });
  }
}

// ─── Ejercicio 4: léela ───────────────────────────────────────────────────────────────

const enunciado4 = (item, { tt, esc }) => (item.sentido === 'lectura'
  ? `<p class="instruccion">${tt(TX.ej4.instruccionLectura)(item)}</p>
     <div class="operacion">${htmlFraccion({ num: item.num, den: item.den })}</div>`
  : `<p class="instruccion">${tt(TX.ej4.instruccionFraccion)(item)}</p>
     <div class="operacion">${esc(item.texto)}</div>`);

function montarLee(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const esLectura = item.sentido === 'lectura';
  const valorDe = o => (esLectura ? o.texto : comoTexto(o));
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map(o => ({ valor: valorDe(o), html: esLectura ? api.esc(o.texto) : frHtml(o) })),
    clase: esLectura ? 'elecciones' : '',
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => valorDe(o) === valor);
      botones.marcar(item.opciones.filter(o => o.correcta).map(valorDe), valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.error ?? undefined,
        respuesta: valor,
        html: ({ tt }) => (elegida.correcta ? '' : tt(TX.ej4.por_que[elegida.error])(item, esLectura ? elegida.texto : '') ) + tt(TX.ej4.solucion)(item),
        espera: 2200,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre,
  detalle: tx.detalle,
  introduccion: tx.introduccion,
  generar,
  clave: claveDe,
  montar,
  enunciado,
});

arrancar({
  slug: 'que-fraccion',
  ejercicios: [
    ejercicio(TX.ej1, generarLeeFigura, montarLeeFigura, enunciado1),
    ejercicio(TX.ej2, generarSombrea, montarSombrea, enunciado2),
    ejercicio(TX.ej3, generarFrase, montarFrase, enunciado3),
    ejercicio(TX.ej4, generarLee, montarLee, enunciado4),
  ],
});
