// «Enteros en la vida real» (PU2, tarea 82). Tres ejercicios sobre situaciones con
// números negativos (temperatura, plantas, dinero, nivel del mar, buceo, años):
//   1. ¿Qué entero es?     una situación → el alumno escribe el entero      (U3-1C-01)
//   2. ¿Qué situación es?  un entero y un tema → elige entre tres frases    (U3-1C-01)
//   3. Un paso             sube/baja, ingresa/saca: salto en el termómetro o
//                          la recta, resultado y frase                      (U3-1C-16)
// La lógica (generadores, cotas, errores) está en `logica.js`; las frases, en `textos.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { fmt, campoEntero } from '../_comun/enteros.js';
import { crearRecta } from '../_comun/recta-enteros.js';
import {
  generarEntero, generarSituacion, generarPaso, opcionBuena, frasesPaso, esCorrectoPaso,
  errorDePaso, terminosPaso, vistaPaso,
} from './logica.js';
import { TX, frase, fraseResultado, ENUNCIADO_PASO, BOTON_SALTO } from './textos.js';

// ─── Ejercicio 1: ¿qué entero es? ──────────────────────────────────────────────

const enunciadoEntero = (item, { idioma, tt }) => `
  <p class="instruccion">${tt(TX.entero.instruccion)}</p>
  <p class="instruccion instruccion--enunciado">${frase(item.ctx, item.n, idioma)}</p>`;

function montarEntero(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    ${enunciadoEntero(item, api)}
    <div id="campo"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoEntero(contenedor.querySelector('#campo'), {
    nombre: tt(TX.entero.nombre_campo), boton, alEnviar: comprobar,
  });
  boton.addEventListener('click', () => comprobar(campo.valor()));

  function comprobar(valor) {
    if (api.respondido() || valor === null) return;
    campo.bloquear();
    boton.hidden = true;
    const acierto = valor === item.n;
    if (acierto) return api.responder({ acierto: true, html: ({ tt }) => tt(TX.entero.razon)(item.ctx, item.n) });
    const contrario = item.n !== 0 && valor === -item.n;
    api.responder({
      acierto: false,
      error: contrario ? 'signo-cambiado' : 'otro-error',
      respuesta: fmt(valor),
      html: ({ tt }) => `${contrario ? `${tt(TX.entero.contrario)(item.n, valor)} ` : `${tt(TX.entero.escribio)(valor)} `}${tt(TX.entero.razon)(item.ctx, item.n)}`,
      espera: 2200,
    });
  }
}

// ─── Ejercicio 2: ¿qué situación es? ───────────────────────────────────────────

const enunciadoSituacion = (item, { tt }) => `
  <p class="instruccion">${tt(TX.situacion.pregunta)(item.ctx, item.n)}</p>
  <div class="operacion">${fmt(item.n)}</div>`;

function montarSituacion(contenedor, item, api) {
  const { tt, idioma } = api;
  contenedor.innerHTML = enunciadoSituacion(item, api);
  const buena = opcionBuena(item);
  const botones = elecciones(contenedor, {
    clase: 'elecciones elecciones--frases',
    opciones: item.opciones.map((o, i) => ({ valor: i, html: frase(o.ctx, o.v, idioma) })),
    alElegir(i) {
      if (api.respondido()) return;
      const elegida = item.opciones[i];
      botones.marcar([item.opciones.indexOf(buena)], i);
      if (elegida.error === null) {
        return api.responder({ acierto: true, html: ({ tt }) => tt(TX.situacion.bien)(item.ctx, item.n) });
      }
      api.responder({
        acierto: false,
        error: elegida.error,
        respuesta: `${elegida.ctx}: ${fmt(elegida.v)}`,
        html: ({ tt }) => (elegida.error === 'signo-cambiado'
          ? tt(TX.situacion.contrario)(item.ctx, item.n, elegida.v)
          : tt(TX.situacion.otro_tema)(item.ctx, item.n, elegida.ctx, elegida.v)),
        espera: 2600,
      });
    },
  });
}

// ─── Ejercicio 3: un paso ──────────────────────────────────────────────────────

const enunciadoPaso = (item, { idioma, tt }) => `
  <p class="instruccion">${tt(TX.paso.instruccion)}</p>
  <p class="instruccion instruccion--enunciado">${ENUNCIADO_PASO[item.ctx][idioma](item)}</p>`;

function montarPaso(contenedor, item, api) {
  const { tt, idioma } = api;
  const vista = vistaPaso(item);
  contenedor.innerHTML = `
    ${enunciadoPaso(item, api)}
    <div id="recta"></div>
    <button type="button" class="secundario boton-salto" id="salto">${BOTON_SALTO[item.ctx][idioma](item)}</button>
    <div id="campo"></div>
    <p class="instruccion">${tt(TX.paso.frase_pregunta)}</p>
    <div id="frases"></div>
    <button type="button" class="comprobar" id="comprobar" disabled>${api.t.comprobar}</button>`;

  // La recta o el termómetro: arranca en el valor de partida; el botón enseña el salto.
  const recta = crearRecta(contenedor.querySelector('#recta'), {
    ...vista,
    unidad: item.ctx === 'temperatura' ? '°C' : '',
    nivel: item.s,
    puntos: [{ valor: item.s, etiqueta: fmt(item.s) }],
    nombre: tt(vista.tipo === 'recta' ? TX.paso.recta : TX.paso.termometro),
  });
  const etiqueta = `${item.dir > 0 ? '+' : '−'}${item.m}`;
  const botonSalto = contenedor.querySelector('#salto');
  let saltado = false;
  const saltar = (animar = true) => {
    if (saltado) return;
    saltado = true;
    botonSalto.disabled = true;
    recta.saltar({ desde: item.s, hasta: item.r, etiqueta, animar });
  };
  botonSalto.addEventListener('click', () => saltar());

  // El resultado (un entero) y la frase (una de dos).
  const boton = contenedor.querySelector('#comprobar');
  const campo = campoEntero(contenedor.querySelector('#campo'), { nombre: tt(TX.paso.nombre_campo), alEnviar: () => comprobar() });
  let elegida = null;
  const listo = () => campo.valor() !== null && elegida !== null;
  const actualizar = () => { boton.disabled = !listo(); };
  campo.elemento.addEventListener('input', actualizar);
  contenedor.querySelector('.campo-entero__signo').addEventListener('click', actualizar);
  const frases = frasesPaso(item);
  const caja = contenedor.querySelector('#frases');
  caja.className = 'elecciones elecciones--frases';
  caja.innerHTML = frases.map((f, i) => `<button type="button" class="eleccion" data-i="${i}">${fraseResultado(item.ctx, f.v, idioma)}</button>`).join('');
  const botonesFrase = [...caja.querySelectorAll('.eleccion')];
  botonesFrase.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido()) return;
    elegida = i;
    botonesFrase.forEach((x, j) => x.classList.toggle('eleccion--elegida', j === i));
    actualizar();
  }));
  boton.addEventListener('click', () => comprobar());

  function comprobar() {
    if (api.respondido() || !listo()) return;
    const valor = campo.valor();
    const vFrase = frases[elegida].v;
    const acierto = esCorrectoPaso(item, valor, vFrase);
    campo.bloquear();
    recta.bloquear();
    boton.hidden = true;
    // Los cuatro estados: la elegida buena, la elegida mala, la buena que no se eligió.
    botonesFrase.forEach((b, i) => {
      b.disabled = true;
      b.classList.remove('eleccion--elegida');
      if (frases[i].error === null) b.classList.add('eleccion--correcta');
      else if (i === elegida) b.classList.add('eleccion--mal');
    });
    saltar();
    if (acierto) return api.responder({ acierto: true, html: ({ tt }) => `${tt(TX.paso.bien)(item)}`, espera: 1800 });
    const [a, b] = terminosPaso(item);
    const errorNumero = valor === item.r ? null : errorDePaso(item, valor);
    const error = errorNumero ?? 'signo-cambiado';
    api.responder({
      acierto: false,
      error,
      respuesta: `${fmt(valor)}; ${fmt(vFrase)}`,
      html: ({ tt }) => {
        const cuenta = tt(TX.paso.bien)(item);
        const explicacion = errorNumero ? tt(TX.paso.fallo[errorNumero])(item, a, b) : tt(TX.paso.frase_mal)(item, item.ctx);
        return `${cuenta} ${explicacion}`.trim();
      },
      espera: 2800,
    });
  }
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'situaciones',
  ejercicios: [
    {
      nombre: TX.entero.nombre,
      detalle: TX.entero.detalle,
      introduccion: TX.entero.introduccion,
      generar: generarEntero,
      clave: item => `${item.ctx}:${item.n}`,
      montar: montarEntero,
      enunciado: enunciadoEntero,
    },
    {
      nombre: TX.situacion.nombre,
      detalle: TX.situacion.detalle,
      introduccion: TX.situacion.introduccion,
      generar: generarSituacion,
      clave: item => `${item.ctx}:${item.n}`,
      montar: montarSituacion,
      enunciado: enunciadoSituacion,
    },
    {
      nombre: TX.paso.nombre,
      detalle: TX.paso.detalle,
      introduccion: TX.paso.introduccion,
      generar: generarPaso,
      clave: item => `${item.ctx}:${item.s}:${item.dir}:${item.m}`,
      montar: montarPaso,
      enunciado: enunciadoPaso,
    },
  ],
});
