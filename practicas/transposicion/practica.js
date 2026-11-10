// PRÁCTICA «Pasa al otro lado» (unidad 6, semana 2): transponer con números, ecuaciones de una y dos
// operaciones, `3x = 12` frente a `12x = 3` y «¿está bien resuelta?». Cinco ejercicios.
//
// Reparto de ficheros: logica.js (puro: ítems, errores, corrección), textos.js, practica.js (interfaz),
// estilos.css (la igualdad, la flecha y la resolución).

import { arrancar } from '../_comun/base.js';
import { elecciones, leerNumero } from '../_comun/piezas.js';
import { deEcuacion } from '../_comun/algebra.js';
import { leerFraccion } from '../_comun/fracciones.js';
import { TX, solHtml, llegadaCon } from './textos.js';
import {
  F, solTexto, plano, ital, leerSolucion, textoEcuacion, OPS, HUECO,
  claveDe, generarConNumeros, generarUnaOperacion, generarDosOperaciones, generarFrente, generarComprueba,
  errorDeConNumeros, errorDeUnaOperacion, errorDeDosOperaciones, errorDeFrente, errorDeCorrige, textoFrente,
} from './logica.js';

/** Una ecuación escrita como texto, en HTML (la x en cursiva; `x/n` con raya). */
const ecHtml = texto => deEcuacion(texto).aHtml();
/** Lo que escribe el alumno como solución: un número, una fracción o «x = …»; Fraccion o null. */
const leerSol = texto => leerSolucion(texto, leerFraccion);

const campo = (id, nombre, extra = '') =>
  `<input type="text" class="campo-numero ${extra}" id="${id}" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${nombre}">`;

const solucionDe = r => `<i>x</i> = ${solHtml(r)}`;

/**
 * Un campo con su botón «Comprobar»: valida lo que se teclea, lo pasa a `leer` y llama a
 * `alComprobar(valor, texto)`. `aviso(valor)` puede devolver un texto que impide comprobar (no gasta intento).
 */
function campoYBoton(caja, api, { id, nombre, leer, alComprobar, aviso = () => null, clase = 'campo-numero--valor' }) {
  caja.insertAdjacentHTML('beforeend', `${campo(id, nombre, clase)}<p class="aviso-campo" id="${id}-aviso" aria-live="polite" hidden></p>
    <button type="button" class="comprobar" id="${id}-boton" disabled>${api.t.comprobar}</button>`);
  const entrada = caja.querySelector(`#${id}`), boton = caja.querySelector(`#${id}-boton`), nota = caja.querySelector(`#${id}-aviso`);
  const actualizar = () => {
    const v = leer(entrada.value);
    const malo = entrada.value.trim() !== '' && v === null;
    const texto = v === null ? null : aviso(v);
    entrada.classList.toggle('campo-numero--malo', malo);
    entrada.setAttribute('aria-invalid', String(malo));
    nota.hidden = !texto;
    nota.textContent = texto ?? '';
    boton.disabled = v === null || Boolean(texto) || api.respondido();
  };
  const comprobar = () => {
    const v = leer(entrada.value);
    if (api.respondido() || v === null || aviso(v)) return;
    entrada.disabled = true;
    boton.hidden = true;
    alComprobar(v, entrada.value.trim());
  };
  entrada.addEventListener('input', actualizar);
  entrada.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); comprobar(); } });
  boton.addEventListener('click', comprobar);
  actualizar();
  entrada.focus?.({ preventScroll: true });
}

// ─── Ejercicio 1: Con números ────────────────────────────────────────────────────────────────

const conHueco = t => t.replace(HUECO, `<span class="hueco-fd">${HUECO}</span>`);

const enunciado1 = (item, { tt }) => `<p class="instruccion">${item.tipo === 'operador' ? tt(TX.ej1.instruccion.operador)(item) : tt(TX.ej1.instruccion.hueco)}</p>
  <p class="igualdad">${item.partida}</p><p class="flecha" aria-hidden="true">↓</p><p class="igualdad">${conHueco(item.llegada)}</p>`;

function montar1(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado1(item, api)}<div id="respuesta"></div>`;
  const caja = contenedor.querySelector('#respuesta');
  if (item.tipo === 'operador') {
    const botones = elecciones(caja, {
      opciones: OPS.map(op => ({ valor: op, html: op })), clase: 'elecciones elecciones--4 elecciones--operaciones',
      alElegir(op) {
        if (api.respondido()) return;
        const error = errorDeConNumeros(item, op);
        botones.marcar([item.respuesta], op);
        api.responder({
          acierto: error === null, error: error ?? undefined, respuesta: op, espera: 2800,
          html: ({ tt: t2 }) => (error === null ? t2(TX.ej1.correcto.operador)(item) : t2(TX.ej1.por_que.operador)(item, op) + t2(TX.ej1.solucion.operador)(item)),
        });
      },
    });
    return;
  }
  campoYBoton(caja, api, {
    id: 'campo', nombre: api.esc(tt(TX.campos.resultado)), leer: t => leerNumero(t, api.idioma),
    alComprobar(v, texto) {
      const error = errorDeConNumeros(item, v);
      api.responder({
        acierto: error === null, error: error ?? undefined, respuesta: texto, espera: 3000,
        html: ({ tt: t2 }) => (error === null ? t2(TX.ej1.correcto.hueco)(item) : t2(TX.ej1.por_que.hueco)(item, v) + t2(TX.ej1.solucion.hueco)(item)),
      });
    },
  });
}

// ─── Ejercicio 2: Una operación ──────────────────────────────────────────────────────────────

const enunciado2 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej2.instruccion[item.tipo])}</p>
  <p class="expresion-destacada">${ecHtml(textoEcuacion(item))}</p>`;

function montar2(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado2(item, api)}<div id="respuesta"></div>`;
  const caja = contenedor.querySelector('#respuesta');
  const responder = (error, texto, v) => api.responder({
    acierto: error === null, error: error ?? undefined, respuesta: texto, espera: 3000,
    html: ({ tt: t2 }) => (error === null ? t2(TX.ej2.correcto)(item) : t2(TX.ej2.por_que)(item, error, v) + t2(TX.ej2.solucion)(item)),
  });
  if (item.tipo === 'elegir') {
    const botones = elecciones(caja, {
      opciones: item.opciones.map((o, i) => ({ valor: String(i), html: solucionDe(o.r) })),
      alElegir(valor) {
        if (api.respondido()) return;
        const o = item.opciones[Number(valor)];
        botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null), valor);
        responder(o.error, `x = ${solTexto(o.r)}`, F(o.r));
      },
    });
    return;
  }
  campoYBoton(caja, api, {
    id: 'campo', nombre: api.esc(tt(TX.campos.solucion)), leer: leerSol,
    alComprobar: (v, texto) => responder(errorDeUnaOperacion(item, v), texto, v),
  });
}

// ─── Ejercicio 3: Dos operaciones, paso a paso ───────────────────────────────────────────────

const enunciado3 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej3.instruccion)}</p>
  <p class="expresion-destacada">${ecHtml(item.ecuacion)}</p>`;

function montar3(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado3(item, api)}<div id="respuesta"></div><div id="segunda"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: item.opciones.map((o, i) => ({ valor: String(i), html: ecHtml(o.texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const o = item.opciones[Number(valor)];
      botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null), valor);
      if (!o.correcta) {
        api.responder({
          acierto: false, error: o.error, respuesta: o.texto.replace(/ /g, ''), espera: 3600,
          html: ({ tt: t2 }) => t2(TX.ej3.porQuePaso)(item, o) + t2(TX.ej3.solucion)(item),
        });
        return;
      }
      const segunda = contenedor.querySelector('#segunda');
      segunda.innerHTML = `<p class="instruccion">${tt(TX.ej3.segunda)}</p>`;
      campoYBoton(segunda, api, {
        id: 'campo', nombre: api.esc(tt(TX.campos.solucion)), leer: leerSol,
        alComprobar(v, texto) {
          const error = errorDeDosOperaciones(item, v);
          api.responder({
            acierto: error === null, error: error ?? undefined, respuesta: texto, espera: 3200,
            html: ({ tt: t2 }) => (error === null ? t2(TX.ej3.correcto)(item) : t2(TX.ej3.por_que)(item, error, v) + t2(TX.ej3.solucion)(item)),
          });
        },
      });
    },
  });
}

// ─── Ejercicio 4: 3x = 12 frente a 12x = 3 ───────────────────────────────────────────────────

const enunciado4 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej4.instruccion[item.tipo])}</p>
  <p class="expresion-destacada">${ecHtml(textoFrente(item))}</p>`;

function montar4(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado4(item, api)}<div id="respuesta"></div>`;
  const caja = contenedor.querySelector('#respuesta');
  const responder = (error, texto, v) => api.responder({
    acierto: error === null, error: error ?? undefined, respuesta: texto, espera: 3600,
    html: ({ tt: t2 }) => (error === null ? t2(TX.ej4.correcto)(item) + (v.den !== 1 && !v.esIrreducible() ? ` ${t2(TX.simplifica)(solTexto(item.solucion))}` : '') : t2(TX.ej4.por_que)(item, error, v) + t2(TX.ej4.solucion)(item)),
  });
  if (item.tipo === 'elegir') {
    const botones = elecciones(caja, {
      opciones: item.opciones.map((o, i) => ({ valor: String(i), html: solucionDe(o.r) })),
      alElegir(valor) {
        if (api.respondido()) return;
        const o = item.opciones[Number(valor)];
        botones.marcar(item.opciones.map((x, i) => (x.correcta ? i : null)).filter(i => i !== null), valor);
        responder(o.error, `x = ${solTexto(o.r)}`, F(o.r));
      },
    });
    return;
  }
  campoYBoton(caja, api, {
    id: 'campo', nombre: api.esc(tt(TX.campos.solucionFraccion)), leer: leerSol,
    alComprobar: (v, texto) => responder(errorDeFrente(item, v), texto, v),
  });
}

// ─── Ejercicio 5: Comprueba y corrige ────────────────────────────────────────────────────────

const enunciado5 = (item, { tt }) => `<p class="instruccion">${tt(TX.ej5.instruccion)}</p>
  <p class="expresion-destacada">${ecHtml(textoEcuacion(item))}</p>
  <p class="resolucion">${ital(item.linea)}</p>`;

function montar5(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `${enunciado5(item, api)}<div id="respuesta"></div><div id="segunda"></div>`;
  const botones = elecciones(contenedor.querySelector('#respuesta'), {
    opciones: [{ valor: 'si', html: tt(TX.ej5.botones.si) }, { valor: 'no', html: tt(TX.ej5.botones.no) }], clase: 'si-no',
    alElegir(valor) {
      if (api.respondido()) return;
      const dice = valor === 'si';
      if (item.buena) {
        botones.marcar(['si'], valor);
        api.responder({
          acierto: dice, error: dice ? undefined : 'da-por-mala', respuesta: dice ? 'sí' : 'no', espera: 3000,
          html: ({ tt: t2 }) => t2(TX.ej5.estabaBien)(item),
        });
        return;
      }
      if (dice) {
        botones.marcar(['no'], valor);
        api.responder({
          acierto: false, error: item.error, respuesta: 'sí', espera: 3600,
          html: ({ tt: t2 }) => t2(TX.ej5.estabaMal)(item),
        });
        return;
      }
      botones.marcar(['no'], valor);
      const segunda = contenedor.querySelector('#segunda');
      segunda.innerHTML = `<p class="instruccion">${tt(TX.ej5.segunda)}</p>`;
      campoYBoton(segunda, api, {
        id: 'campo', nombre: api.esc(tt(TX.campos.solucion)), leer: leerSol,
        alComprobar(v, texto) {
          const error = errorDeCorrige(item, v);
          api.responder({
            acierto: error === null, error: error ?? undefined, respuesta: texto, espera: 3400,
            html: ({ tt: t2 }) => (error === null ? t2(TX.ej5.estabaMal)(item) : t2(TX.ej5.correccionMal)(item, error, v)),
          });
        },
      });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────────────────

const ejercicio = (tx, generar, montar, enunciado) => ({
  nombre: tx.nombre, detalle: tx.detalle, introduccion: tx.introduccion, generar, clave: claveDe, montar, enunciado,
});

arrancar({
  slug: 'transposicion',
  ejercicios: [
    ejercicio(TX.ej1, generarConNumeros, montar1, enunciado1),
    ejercicio(TX.ej2, generarUnaOperacion, montar2, enunciado2),
    ejercicio(TX.ej3, generarDosOperaciones, montar3, enunciado3),
    ejercicio(TX.ej4, generarFrente, montar4, enunciado4),
    ejercicio(TX.ej5, generarComprueba, montar5, enunciado5),
  ],
});
