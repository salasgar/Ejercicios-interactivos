// «La fracción de una cantidad» (PU2, tarea 103). Cuatro ejercicios de la unidad 4:
//   1. Calcula         3/5 de 40; el alumno escribe el resultado (con pistas)         (U4-1C-08, 1C-09)
//   2. Con contexto    la misma cuenta dentro de un problema                          (U4-1A-01)
//   3. ¿Qué fracción?  la parte y el total → la fracción irreducible, en dos casillas  (U4-1C-04, 1A-03)
//   4. El problema     dos pasos, cuatro respuestas: lo que queda, el resto, el total  (U4-1A-01, 1A-02, 2A-02, 2A-03)
// La lógica (generadores, cotas, errores) está en `logica.js`; las frases, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, campoNumero, leerNumero } from '../_comun/piezas.js';
import { fraccion, htmlFraccion, htmlRaya, aTexto } from '../_comun/fracciones.js';
import {
  F, ESCENARIOS, generarCalculo, generarContexto, generarParte, generarProblema,
  errorDeCalculo, errorDeParte,
} from './logica.js';
import {
  TX, enunciadoContexto, enunciadoParte, enunciadoProblema, solucionProblema, explicaOpcion,
} from './textos.js';

const frItem = x => htmlFraccion(fraccion(x.n, x.d));

// ─── Ejercicios 1 y 2: escribir el resultado ───────────────────────────────────

const enunciadoCalculo = (item, { idioma, tt }) => `
  <p class="instruccion">${tt(TX.calculo.instruccion)}</p>
  <div class="operacion">${frItem(item)} ${tt(TX.calculo.de)} ${item.total} =</div>`;

const enunciadoCon = (item, { idioma, tt }) => {
  const e = enunciadoContexto(item, idioma);
  return `
    <p class="instruccion instruccion--enunciado">${e.texto}</p>
    <p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

/** Feedback de un fallo en los ejercicios 1 y 2: el error explicado con los números del ítem y la cuenta buena. */
function feedbackFallo(item, v, error, { tt }, TXej) {
  const escrito = tt(TX.calculo.escribio)(v);
  const explicacion = TX.calculo.fallo[error] ? tt(TX.calculo.fallo[error])(item) : '';
  return `${escrito} ${explicacion} ${tt(TXej.razon)(item)}`.replace(/\s+/g, ' ').trim();
}

function montarResultado(contenedor, item, api, { enunciado, TXej, conPistas }) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciado(item, api)}
    <div class="fila-campo"><span id="campo"></span><span class="unidad-campo" id="unidad"></span></div>
    <div class="pistas-fd" id="pistas" aria-live="polite"></div>
    ${conPistas ? `<button type="button" class="secundario" id="pista">${tt(TX.pista)}</button>` : ''}
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  if (item.ctx) contenedor.querySelector('#unidad').textContent = enunciadoContexto(item, api.idioma).unidad;
  const boton = contenedor.querySelector('#comprobar');
  const botonPista = contenedor.querySelector('#pista');
  const campo = campoNumero(contenedor.querySelector('#campo'), {
    nombre: tt(TXej.nombre_campo), cifras: 5, idioma: api.idioma, boton, alEnviar: comprobar,
  });
  boton.addEventListener('click', () => comprobar(campo.valor()));

  // Las pistas (ejercicio 1): primero dividir, después multiplicar; cada una cuenta como ayuda.
  let pistas = 0;
  const maxPistas = item.n === 1 ? 1 : 2;
  if (botonPista) {
    botonPista.addEventListener('click', () => {
      if (api.respondido() || pistas >= maxPistas) return;
      pistas++;
      const texto = tt(pistas === 1 ? TX.calculo.pista1 : TX.calculo.pista2)(item);
      contenedor.querySelector('#pistas').insertAdjacentHTML('beforeend', `<p class="pista-fd">${texto}</p>`);
      if (pistas >= maxPistas) botonPista.hidden = true;
    });
  }

  function comprobar(v) {
    if (api.respondido() || v === null) return;
    campo.bloquear();
    boton.hidden = true;
    if (botonPista) botonPista.hidden = true;
    if (v === item.resultado) return api.responder({ acierto: true, pistas, html: ({ tt }) => tt(TXej.razon)(item) });
    const error = errorDeCalculo(item, v);
    api.responder({
      acierto: false,
      pistas,
      error,
      respuesta: String(v),
      html: txt => feedbackFallo(item, v, error, txt, TXej),
      espera: 2600,
    });
  }
}

const montarCalculo = (contenedor, item, api) => montarResultado(contenedor, item, api, { enunciado: enunciadoCalculo, TXej: TX.calculo, conPistas: true });
const montarContexto = (contenedor, item, api) => montarResultado(contenedor, item, api, { enunciado: enunciadoCon, TXej: TX.contexto, conPistas: false });

// ─── Ejercicio 3: ¿qué fracción es? ────────────────────────────────────────────

const enunciadoParteHtml = (item, { idioma, tt }) => {
  const e = enunciadoParte(item, idioma);
  return `
    <p class="instruccion instruccion--enunciado">${e.texto}</p>
    <p class="instruccion"><strong>${e.pregunta}</strong> ${tt(TX.parte.instruccion)}</p>`;
};

function montarParte(contenedor, item, api) {
  const { tt } = api;
  const casilla = (id, nombre) => `<input type="text" inputmode="numeric" autocomplete="off" spellcheck="false" class="campo-numero campo-fraccion" id="${id}" aria-label="${nombre}" style="--cifras:3">`;
  contenedor.innerHTML = `
    ${enunciadoParteHtml(item, api)}
    <div class="operacion operacion--campo">${htmlRaya(casilla('arriba', tt(TX.parte.arriba)), casilla('abajo', tt(TX.parte.abajo)))}</div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;
  const arriba = contenedor.querySelector('#arriba'), abajo = contenedor.querySelector('#abajo');
  const boton = contenedor.querySelector('#comprobar');
  const leer = () => {
    const n = leerNumero(arriba.value), d = leerNumero(abajo.value);
    return n === null || d === null || d < 1 ? null : fraccion(n, d);
  };
  const actualizar = () => {
    boton.disabled = leer() === null;
    for (const c of [arriba, abajo]) c.classList.toggle('campo-numero--malo', c.value.trim() !== '' && leerNumero(c.value) === null);
  };
  for (const c of [arriba, abajo]) {
    c.addEventListener('input', actualizar);
    c.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  }
  boton.addEventListener('click', comprobar);

  function comprobar() {
    const v = leer();
    if (api.respondido() || v === null) return;
    arriba.disabled = abajo.disabled = true;
    boton.hidden = true;
    const error = errorDeParte(item, v);
    if (error === null) return api.responder({ acierto: true, html: ({ tt }) => tt(TX.parte.razon)(item) });
    api.responder({
      acierto: false,
      error,
      respuesta: aTexto(v),
      html: ({ tt }) => {
        const explicacion = TX.parte.fallo[error] ? tt(TX.parte.fallo[error])(item) : '';
        return `${tt(TX.parte.escribio)(htmlFraccion(v))} ${explicacion} ${tt(TX.parte.razon)(item)}`.replace(/\s+/g, ' ').trim();
      },
      espera: 2800,
    });
  }
}

// ─── Ejercicio 4: el problema ──────────────────────────────────────────────────

const enunciadoProblemaHtml = (item, { idioma, tt }) => {
  const e = enunciadoProblema(item, idioma);
  return `
    <p class="instruccion">${tt(TX.problema.instruccion)}</p>
    <p class="instruccion instruccion--enunciado">${e.texto}</p>
    <p class="instruccion"><strong>${e.pregunta}</strong></p>`;
};

function montarProblema(contenedor, item, api) {
  const { tt, idioma } = api;
  const unidad = ESCENARIOS[item.variante][item.esc].unidad[idioma];
  contenedor.innerHTML = enunciadoProblemaHtml(item, api);
  const buena = item.opciones.findIndex(o => o.error === null);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map((o, i) => ({
      valor: i,
      html: o.tipo === 'cantidad' ? `${o.v} ${unidad}` : htmlFraccion(F(o)),
    })),
    alElegir(i) {
      if (api.respondido()) return;
      const elegida = item.opciones[i];
      botones.marcar([buena], i);
      if (elegida.error === null) {
        return api.responder({ acierto: true, html: ({ idioma }) => solucionProblema(item, idioma) });
      }
      api.responder({
        acierto: false,
        error: elegida.error,
        respuesta: elegida.tipo === 'cantidad' ? String(elegida.v) : aTexto(F(elegida)),
        html: ({ idioma }) => `${explicaOpcion(item, elegida, idioma)} ${solucionProblema(item, idioma)}`.trim(),
        espera: 3000,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'fraccion-de',
  ejercicios: [
    {
      nombre: TX.calculo.nombre,
      detalle: TX.calculo.detalle,
      introduccion: TX.calculo.introduccion,
      generar: generarCalculo,
      clave: item => `${item.n}/${item.d}:${item.total}`,
      montar: montarCalculo,
      enunciado: enunciadoCalculo,
    },
    {
      nombre: TX.contexto.nombre,
      detalle: TX.contexto.detalle,
      introduccion: TX.contexto.introduccion,
      generar: generarContexto,
      clave: item => `${item.ctx}:${item.n}/${item.d}:${item.total}`,
      montar: montarContexto,
      enunciado: enunciadoCon,
    },
    {
      nombre: TX.parte.nombre,
      detalle: TX.parte.detalle,
      introduccion: TX.parte.introduccion,
      generar: generarParte,
      clave: item => `${item.ctx}:${item.parte}/${item.total}`,
      montar: montarParte,
      enunciado: enunciadoParteHtml,
    },
    {
      nombre: TX.problema.nombre,
      detalle: TX.problema.detalle,
      introduccion: TX.problema.introduccion,
      generar: generarProblema,
      clave: item => `${item.variante}:${item.esc}:${item.total}:${item.f1.n}/${item.f1.d}:${item.f2 ? `${item.f2.n}/${item.f2.d}` : ''}`,
      montar: montarProblema,
      enunciado: enunciadoProblemaHtml,
    },
  ],
});
