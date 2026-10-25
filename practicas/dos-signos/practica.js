// Práctica «Dos signos seguidos» (unidad 3, tarea 84): la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en `logica.js`, pura y probada en
// `tests/practicas-dos-signos.test.js`; los textos, en `textos.js`.
//
// Los ejercicios 1-3 tienen dos pasos (elegir el signo; calcular) y UNA sola llamada a
// `api.responder`: si falla el primer paso, el ítem termina ahí con su explicación.
// «Comprobar» se oculta al responder (T58) y las opciones se corrigen con los cuatro estados.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero } from '../_comun/enteros.js';
import { TX, feedbackSigno, feedbackUnSigno, feedbackNegativo, feedbackValorNegativo, feedbackQuita, feedbackValorQuita, feedbackBien } from './textos.js';
import {
  generarUnSigno, generarNegativo, generarQuita, generarBienEscrita,
  SIGNOS_OPCION, ver, errorDeSigno, errorDeValor, errorDeNegativo, errorDeValorNegativo,
  esReescrituraCorrecta, primerFallo, errorDeTermino, textoSinParentesis, ERROR_OTRO,
} from './logica.js';

const cuenta = html => `<span class="cuenta">${html}</span>`;

/** Segundo paso: un campo para el resultado y «Comprobar». `alComprobar(valor)` se llama una vez. */
function pedirResultado(zona, api, alComprobar) {
  zona.insertAdjacentHTML('beforeend', `<div id="campo"></div><button type="button" class="comprobar">${api.t.comprobar}</button>`);
  const boton = zona.querySelector('.comprobar');
  const campo = campoEntero(zona.querySelector('#campo'), { nombre: api.tt(TX.resultado), boton, alEnviar: comprobar });
  boton.addEventListener('click', () => comprobar(campo.valor()));
  campo.elemento.focus?.();
  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    alComprobar(valor);
  }
}

// ─── Ejercicio 1: un solo signo ────────────────────────────────────────────────

const enunciadoUnSigno = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.unsigno)}</p><div class="operacion">${item.texto}</div>`;

function montarUnSigno(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoUnSigno(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const botones = elecciones(zona, {
    clase: 'si-no',
    opciones: SIGNOS_OPCION.map(s => ({ valor: s, html: cuenta(ver(s)) })),
    alElegir(s) {
      if (api.respondido()) return;
      botones.marcar([item.signo], s);
      if (s !== item.signo) {
        return api.responder({ acierto: false, html: ctx => feedbackSigno(item, ctx), error: errorDeSigno(item), respuesta: ver(s) });
      }
      // El hueco del resultado no enseña la respuesta: en `−(−9)` el signo es el resultado.
      const queda = item.solo ? `${item.texto} = □` : `${item.texto} = ${item.a} ${ver(item.signo)} ${item.b} = □`;
      zona.insertAdjacentHTML('beforeend', `<p class="instruccion">${tt(TX.enunciado.unsigno2)}</p><div class="operacion">${queda}</div>`);
      pedirResultado(zona, api, valor => {
        const acierto = valor === item.valor;
        api.responder({
          acierto,
          html: ctx => feedbackUnSigno(item, ctx, acierto),
          error: acierto ? undefined : errorDeValor(item, valor),
          respuesta: fmt(valor),
        });
      });
    },
  });
}

// ─── Ejercicio 2: sumar o restar un negativo ───────────────────────────────────

const enunciadoNegativo = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.negativo)}</p><div class="operacion">${item.texto}</div>`;

function montarNegativo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciadoNegativo(item, api)}<div id="zona"></div>`;
  const zona = contenedor.querySelector('#zona');
  const reescrita = s => `${fmt(item.a)} ${ver(s)} ${item.b}`;
  const botones = elecciones(zona, {
    clase: 'si-no',
    opciones: SIGNOS_OPCION.map(s => ({ valor: s, html: cuenta(reescrita(s)) })),
    alElegir(s) {
      if (api.respondido()) return;
      botones.marcar([item.signo], s);
      if (s !== item.signo) {
        return api.responder({ acierto: false, html: ctx => feedbackNegativo(item, ctx), error: errorDeNegativo(item), respuesta: reescrita(s) });
      }
      zona.insertAdjacentHTML('beforeend', `<p class="instruccion">${tt(TX.enunciado.negativo2)}</p><div class="operacion">${item.reescrita} = □</div>`);
      pedirResultado(zona, api, valor => {
        const acierto = valor === item.valor;
        api.responder({
          acierto,
          html: ctx => feedbackValorNegativo(item, ctx, acierto),
          error: acierto ? undefined : errorDeValorNegativo(item, valor),
          respuesta: fmt(valor),
        });
      });
    },
  });
}

// ─── Ejercicio 3: quita los paréntesis y calcula ───────────────────────────────

const enunciadoQuita = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.quita)}</p><div class="operacion operacion--larga">${item.texto}</div>`;

function montarQuita(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoQuita(item, api)}
    <div class="quita-fichas" id="fichas">${item.terminos.map((t, i) => `
      <div class="quita-termino">
        <button type="button" class="quita-signo" data-i="${i}" aria-label="${tt(TX.signo_de)} ${t.mag}">+</button>
        <span class="quita-mag">${t.mag}</span>
      </div>`).join('')}</div>
    <div class="operacion operacion--larga" id="vista"></div>
    <div id="zona"><button type="button" class="comprobar" id="comprobar-signos">${tt(TX.comprobar_signos)}</button></div>`;
  const signos = item.terminos.map(() => '+');
  const botones = [...contenedor.querySelectorAll('.quita-signo')];
  const vista = contenedor.querySelector('#vista');
  const pintar = () => {
    botones.forEach((b, i) => { b.textContent = ver(signos[i]); b.classList.toggle('quita-signo--menos', signos[i] === '-'); });
    vista.innerHTML = textoSinParentesis(signos, item.terminos);
  };
  botones.forEach((b, i) => b.addEventListener('click', () => { if (!api.respondido()) { signos[i] = signos[i] === '+' ? '-' : '+'; pintar(); } }));
  pintar();

  const zona = contenedor.querySelector('#zona');
  contenedor.querySelector('#comprobar-signos').addEventListener('click', ev => {
    if (api.respondido()) return;
    const mios = [...signos];
    botones.forEach((b, i) => {
      b.disabled = true;
      b.classList.add(`quita-signo--${mios[i] === item.terminos[i].signo ? 'bien' : 'mal'}`);
    });
    ev.target.hidden = true;
    if (!esReescrituraCorrecta(item, mios)) {
      const i = primerFallo(item, mios);
      return api.responder({
        acierto: false,
        html: ctx => feedbackQuita(item, ctx, mios, i),
        error: errorDeTermino(item.terminos[i]),
        respuesta: textoSinParentesis(mios, item.terminos),
        espera: 2500,
      });
    }
    zona.insertAdjacentHTML('beforeend', `<p class="instruccion">${tt(TX.enunciado.quita2)}</p>`);
    pedirResultado(zona, api, valor => {
      const acierto = valor === item.valor;
      api.responder({
        acierto,
        html: ctx => feedbackValorQuita(item, ctx, acierto),
        error: acierto ? undefined : (valor === -item.valor ? 'signo-cambiado' : ERROR_OTRO),
        respuesta: fmt(valor),
        espera: 2000,
      });
    });
  });
}

// ─── Ejercicio 4: ¿cuál está bien escrita? ─────────────────────────────────────

const enunciadoBien = (item, { tt }) => `<p class="instruccion">${tt(TX.enunciado.bien)}</p>`;

function montarBien(contenedor, item, api) {
  contenedor.innerHTML = enunciadoBien(item, api);
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(o => ({ valor: o.texto, html: cuenta(o.texto) })),
    alElegir(texto) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => o.texto === texto);
      botones.marcar([item.buena], texto);
      api.responder({
        acierto: elegida.bien,
        html: ctx => feedbackBien(item, ctx, texto),
        error: elegida.error ?? undefined,
        respuesta: texto,
        espera: 2000,
      });
    },
  });
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'dos-signos',
  ejercicios: [
    {
      nombre: TX.nombres.unsigno, detalle: TX.detalles.unsigno, introduccion: TX.introduccion.unsigno,
      generar: generarUnSigno, clave: item => item.texto, montar: montarUnSigno, enunciado: enunciadoUnSigno,
    },
    {
      nombre: TX.nombres.negativo, detalle: TX.detalles.negativo, introduccion: TX.introduccion.negativo,
      generar: generarNegativo, clave: item => item.texto, montar: montarNegativo, enunciado: enunciadoNegativo,
    },
    {
      nombre: TX.nombres.quita, detalle: TX.detalles.quita, introduccion: TX.introduccion.quita,
      generar: generarQuita, clave: item => item.texto, montar: montarQuita, enunciado: enunciadoQuita,
    },
    {
      nombre: TX.nombres.bien, detalle: TX.detalles.bien, introduccion: TX.introduccion.bien,
      generar: generarBienEscrita, clave: item => item.buena, montar: montarBien, enunciado: enunciadoBien,
    },
  ],
});

