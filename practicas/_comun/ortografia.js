// Piezas de los ejercicios de ortografía (tarea 134, 2026-11-03), generalizadas de los
// `montar` de ../ortografia/practica.js (que no se toca) para que los cinco bloques
// (ortografia-tildes, -letras, -puntuacion, -palabras y -ampliacion) no las repitan.
// El contrato completo está en docs/practicas-ortografia.md, §3.
//
//   montarHueco     la frase con un hueco y los botones de las palabras que pueden ir en él
//   montarElegir    «¿Cuál está bien escrita?» o «¿Qué frase dice esto?»: frases como botones
//   montarTocar     piezas (sílabas, palabras, letras) que se tocan: una, o varias y «Comprobar»
//   montarDosPasos  primero tocar y, si se acierta, elegir (si falla el primero, se acaba ahí)
//
// Todas: se llaman desde el `montar(contenedor, item, api)` del ejercicio con el `api` de la
// base, pintan la corrección (la buena en verde; lo elegido mal, en rojo) y llaman UNA vez a
// `api.responder` con `error` y `respuesta` al fallar. `explicacion` e `idError` pueden ser un
// texto o una función de lo que contestó el alumno. `etiqueta` (opcional) es un HTML que va
// arriba del todo: la de `etiquetaNivel` (./nivel.js).
//
// Lo puro (TXO, slug, barajarOpciones, conjuntoIgual) no necesita el navegador y lo prueba
// tests/practicas-ortografia-comun.test.js; los `montar`, con clics.

import { elecciones, claseCorreccion } from './piezas.js';

/** Textos comunes de la ortografía (solo español). */
export const TXO = {
  hueco: '¿Qué palabra va en el hueco?',
  escrita: '¿Cuál está bien escrita?',
  significado: '¿Qué frase dice esto?',
  tocar: 'Toca la respuesta.',
  tocar_varias: 'Toca todas las que correspondan y pulsa «Comprobar».',
  comprobar: 'Comprobar',
  ninguna: 'Ninguna',
  bien: 'Está bien',
  mal: 'Está mal',
};

/** Un texto como identificador: sin tildes, en minúsculas y con guiones («Haber» → «haber», «por qué» → «por-que»). */
export const slug = texto => String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** Las opciones como datos para el ítem: [{ k, texto }] barajadas, con `k` su posición en `textos` (la buena suele ser la 0). */
export function barajarOpciones(rng, textos) {
  return rng.barajar(textos.map((texto, k) => ({ k, texto })));
}

/** ¿Tienen las dos listas los mismos elementos (sin importar el orden ni las repeticiones)? */
export function conjuntoIgual(a, b) {
  const x = new Set(a.map(String)), y = new Set(b.map(String));
  return x.size === y.size && [...x].every(v => y.has(v));
}

// Los estilos de estas piezas, en un solo sitio: se ponen en la página la primera vez que se
// monta una (así los bloques no repiten nada en su estilos.css). Son los de ../ortografia/estilos.css
// y los de las piezas nuevas.
export const ESTILOS = `
.oracion { font-size: 1.3rem; line-height: 2.1; margin: .2rem 0 1.2rem; text-align: center; }
.oracion .hueco { min-height: 1.7em; vertical-align: baseline; }
.contexto { font-style: italic; margin-bottom: .6rem; }
.sentido { font-size: 1.1rem; font-weight: 600; background: var(--primario-claro); color: var(--primario-oscuro); border-radius: 10px; padding: .6rem .9rem; margin-bottom: 1rem; }
.frases .eleccion { text-align: left; font-size: 1.1rem; }
.esquina-nivel { text-align: right; margin: -.3rem 0 .4rem; }
.piezas-tocar button { font-size: 1.25rem; font-variant-numeric: normal; }
.piezas-tocar--unidas { gap: 0; }
.piezas-tocar--unidas button { border-radius: 0; margin-left: -2px; }
.piezas-tocar--unidas button:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
.piezas-tocar--unidas button:last-child { border-radius: 0 8px 8px 0; }
.paso-hecho { color: var(--correcto); margin: -.4rem 0 1rem; text-align: center; }
`;

function ponerEstilos() {
  if (typeof document === 'undefined' || document.querySelector('style[data-ortografia]')) return;
  const estilo = document.createElement('style');
  estilo.dataset.ortografia = '';
  estilo.textContent = ESTILOS;
  document.head.append(estilo);
}

const aplicar = (f, valor) => (typeof f === 'function' ? f(valor) : f);
/** Lo que se le pasa a `api.responder`: `error` y `respuesta` solo al fallar. */
const respuestaDe = (acierto, html, espera, error, respuesta) => ({ acierto, html, espera, ...(acierto ? {} : { error, respuesta: String(respuesta).slice(0, 60) }) });
const cabecera = ({ etiqueta = '', contexto = '', instruccion = '', pregunta = '' }) => `
    ${etiqueta ? `<div class="esquina-nivel">${etiqueta}</div>` : ''}
    ${contexto ? `<p class="contexto">${contexto}</p>` : ''}
    ${instruccion ? `<p class="instruccion">${instruccion}</p>` : ''}
    ${pregunta}`;

// --- Hueco --------------------------------------------------------------------------

/**
 * La frase `antes` + hueco + `despues` y un botón por opción (clase `si-no` si son dos,
 * `elecciones` si son más). Al responder, la buena se escribe en verde en el hueco.
 *
 *   montarHueco(contenedor, api, { antes: 'Mi hermano ', despues: ' llegado.', opciones: ['a', 'ha'],
 *     buena: 'ha', explicacion: '…', idError: 'a-por-ha' });
 *
 * `respuestaDe(valor)`: lo que se guarda como respuesta del alumno (por defecto, la palabra).
 * `antes`, `despues` y las opciones son texto (se escapan); `explicacion`, HTML.
 */
export function montarHueco(contenedor, api, opciones) {
  ponerEstilos();
  construirHueco(contenedor, api, opciones, r => api.responder(r));
}

function construirHueco(contenedor, api, { antes = '', despues = '', opciones, buena, explicacion, idError, respuestaDe: respuesta = v => v, espera = 2600, instruccion = TXO.hueco, contexto, etiqueta }, fin) {
  const { esc } = api;
  contenedor.innerHTML = `${cabecera({ etiqueta, contexto, instruccion })}
    <p class="oracion">${esc(antes)}<span class="hueco hueco--corto">&nbsp;</span>${esc(despues)}</p>`;
  const hueco = contenedor.querySelector('.hueco');
  const botones = elecciones(contenedor, {
    clase: opciones.length === 2 ? 'si-no' : '',
    opciones: opciones.map(valor => ({ valor, html: esc(valor) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([buena], valor);
      // En el hueco, siempre la buena y en verde (en rojo parecería que es la mala).
      hueco.textContent = buena;
      hueco.classList.add('hueco--bien');
      const acierto = valor === buena;
      fin(respuestaDe(acierto, aplicar(explicacion, valor), espera, aplicar(idError, valor), respuesta(valor)));
    },
  });
}

// --- Elegir -------------------------------------------------------------------------

/**
 * Frases (u otras opciones) como botones, una debajo de otra. `opciones`: [{ k, texto }] ya
 * barajadas por el generador (`barajarOpciones`), o [{ k, html }] si llevan marcas; `buena`, la
 * `k` de la correcta. `contexto` (cursiva, arriba) y `pregunta` (HTML debajo de la instrucción:
 * la frase de «¿qué frase dice esto?», por ejemplo) son opcionales.
 *
 *   montarElegir(contenedor, api, { instruccion: TXO.escrita, opciones: item.opciones, buena: 0,
 *     explicacion: k => '…', idError: k => '…' });
 */
export function montarElegir(contenedor, api, opciones) {
  ponerEstilos();
  construirElegir(contenedor, api, opciones, r => api.responder(r));
}

function construirElegir(contenedor, api, { instruccion = TXO.escrita, contexto, pregunta, opciones, buena, explicacion, idError, espera = 3500, etiqueta }, fin) {
  contenedor.innerHTML = cabecera({ etiqueta, contexto, instruccion, pregunta });
  const textoDe = o => o.texto ?? o.html.replace(/<[^>]*>/g, '');
  const botones = elecciones(contenedor, {
    clase: 'elecciones frases',
    opciones: opciones.map(o => ({ valor: o.k, html: o.html ?? api.esc(o.texto) })),
    alElegir(k) {
      if (api.respondido()) return;
      botones.marcar([buena], k);
      const acierto = String(k) === String(buena);
      fin(respuestaDe(acierto, aplicar(explicacion, k), espera, aplicar(idError, k), textoDe(opciones.find(o => String(o.k) === String(k)))));
    },
  });
}

// --- Tocar --------------------------------------------------------------------------

/**
 * Las `piezas` (textos: sílabas, palabras, letras) como botones en fila. `buenas`: los índices
 * correctos ([] si la respuesta es «Ninguna»).
 *   multiple: false   una pulsación responde (y entonces `buenas` tiene uno, o ninguno);
 *   multiple: true    las piezas se marcan y desmarcan, y responde «Comprobar» (acierta si
 *                     lo marcado coincide exactamente con `buenas`);
 *   ninguna           true (o un texto) añade un botón «Ninguna», que responde con [].
 * `unidas: true` pinta las piezas pegadas, como una palabra partida en sílabas (la-piz).
 * Al responder: verde lo bien tocado, borde de puntos lo que faltaba y rojo tachado lo que no
 * iba (`claseCorreccion`). `explicacion` e `idError` reciben la lista de índices tocados.
 */
export function montarTocar(contenedor, api, opciones) {
  ponerEstilos();
  construirTocar(contenedor, api, opciones, r => api.responder(r));
}

function construirTocar(contenedor, api, { instruccion, contexto, pregunta, piezas, buenas, multiple = false, ninguna = null, unidas = false, explicacion, idError, espera = 3000, etiqueta }, fin) {
  const { esc } = api;
  const orden = instruccion ?? (multiple ? TXO.tocar_varias : TXO.tocar);
  const textoNinguna = typeof ninguna === 'string' ? ninguna : TXO.ninguna;
  contenedor.innerHTML = `${cabecera({ etiqueta, contexto, instruccion: orden, pregunta })}
    <div class="botones-numeros piezas-tocar${unidas ? ' piezas-tocar--unidas' : ''}" role="group">
      ${piezas.map((p, i) => `<button type="button" data-i="${i}" aria-pressed="false">${esc(p)}</button>`).join('')}
    </div>
    ${ninguna ? `<div class="botones-numeros"><button type="button" data-ninguna="1">${esc(textoNinguna)}</button></div>` : ''}
    ${multiple ? `<button type="button" class="comprobar">${esc(TXO.comprobar)}</button>` : ''}`;
  const botones = [...contenedor.querySelectorAll('[data-i]')];
  const botonNinguna = contenedor.querySelector('[data-ninguna]');
  const comprobar = contenedor.querySelector('.comprobar');

  const responder = tocadas => {
    if (api.respondido()) return;
    botones.forEach((b, i) => {
      b.disabled = true;
      const clase = claseCorreccion(tocadas.includes(i), buenas.includes(i));
      if (clase) b.classList.add(clase);
    });
    if (botonNinguna) {
      botonNinguna.disabled = true;
      const clase = claseCorreccion(tocadas.length === 0, buenas.length === 0);
      if (clase) botonNinguna.classList.add(clase);
    }
    if (comprobar) comprobar.hidden = true;
    const acierto = conjuntoIgual(tocadas, buenas);
    const respuesta = tocadas.length ? tocadas.map(i => piezas[i]).join(' ') : textoNinguna;
    fin(respuestaDe(acierto, aplicar(explicacion, tocadas), espera, aplicar(idError, tocadas), respuesta));
  };

  botones.forEach((b, i) => b.addEventListener('click', () => {
    if (api.respondido()) return;
    if (!multiple) return responder([i]);
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  }));
  botonNinguna?.addEventListener('click', () => responder([]));
  comprobar?.addEventListener('click', () => responder(botones.flatMap((b, i) => (b.getAttribute('aria-pressed') === 'true' ? [i] : []))));
}

// --- Esqueletos -------------------------------------------------------------------------

/**
 * Un ejercicio válido para la base que todavía no existe: lo usan los esqueletos de los bloques
 * (tarea 134) hasta que su tarea (135-139) escriba el de verdad en su sitio.
 */
export const enConstruccion = tarea => ({
  nombre: { es: 'En construcción', en: 'Under construction' },
  detalle: { es: `Lo escribe la tarea ${tarea} del reparto`, en: `Written by task ${tarea} of the plan` },
  generar: () => ({ n: 0 }),
  montar(contenedor) {
    contenedor.innerHTML = `<p class="instruccion">Este ejercicio todavía no está: lo escribe la tarea ${tarea} del reparto.</p>`;
  },
});

// --- Dos pasos ----------------------------------------------------------------------

/**
 * Primero `paso1` (las opciones de `montarTocar`) y, si se acierta, `paso2` (las de
 * `montarElegir`) debajo. Si el primero falla, el ítem termina ahí con su explicación; si
 * acierta, su `explicacion` (si la hay) queda escrita encima del segundo, y la del segundo es
 * la del ítem. El patrón de la unidad 3; lo usa «La sílaba tónica» (ortografia-tildes, 1).
 *
 *   montarDosPasos(contenedor, api, { etiqueta, paso1: { piezas, buenas, … }, paso2: { opciones, buena, … } });
 */
export function montarDosPasos(contenedor, api, { paso1, paso2, etiqueta }) {
  ponerEstilos();
  contenedor.innerHTML = '<div class="paso paso--1"></div><div class="paso paso--2"></div>';
  const [caja1, caja2] = contenedor.querySelectorAll('.paso');
  construirTocar(caja1, api, { etiqueta, ...paso1 }, r => {
    if (!r.acierto) return api.responder(r);
    if (r.html) caja1.insertAdjacentHTML('beforeend', `<p class="paso-hecho">${r.html}</p>`);
    construirElegir(caja2, api, paso2, r2 => api.responder(r2));
  });
}
