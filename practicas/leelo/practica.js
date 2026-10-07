// Práctica «Léelo en inglés»: el lenguaje de la unidad en inglés, con síntesis
// de voz. Tres ejercicios: oír y elegir la notación, ver la notación y elegir
// su lectura, y completar una frase con la palabra correcta. Contrato de la
// base en `../_comun/base.js` y `../plantilla/practica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarEscuchar, opcionesEscuchar,
  generarLeer, opcionesLeer,
  generarCompletar,
  leer, notacion,
} from './logica.js';

// ─── Síntesis de voz ────────────────────────────────────────────────────────
// `getVoices()` devuelve [] la primera vez en Chrome: hay que esperar a
// `voiceschanged` (hasta 1 s) antes de decidir si hay voz o no.

let promesaVoz = null;

function hayVozAhora() {
  return 'speechSynthesis' in window && speechSynthesis.getVoices().length > 0;
}

function detectarVoz() {
  if (!('speechSynthesis' in window)) return Promise.resolve(false);
  if (promesaVoz) return promesaVoz;
  promesaVoz = hayVozAhora() ? Promise.resolve(true) : new Promise(resolve => {
    const limite = setTimeout(() => resolve(hayVozAhora()), 1000);
    speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(limite); resolve(hayVozAhora()); }, { once: true });
  });
  return promesaVoz;
}

/** Lee `texto` en inglés. Voz en-GB si existe, si no cualquier en-*, si no la por defecto. */
function hablar(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); // Chrome deja la cola «pausada» tras ~15 s: se limpia antes de cada frase.
  const u = new SpeechSynthesisUtterance(texto);
  const voces = speechSynthesis.getVoices();
  u.voice = voces.find(v => v.lang === 'en-GB') ?? voces.find(v => v.lang?.startsWith('en')) ?? null;
  u.lang = 'en-GB';
  speechSynthesis.speak(u);
}

// ─── Utilidad de interfaz: las 4 opciones mezcladas ────────────────────────
// El orden de las opciones (y cuáles de un pool más grande entran) no influye
// en la lógica del ejercicio, así que aquí basta `Math.random`: la semilla de
// `rng` es cosa de qué ÍTEM toca, no de cómo se pintan sus botones.

function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function cuatroOpciones(correcta, pool) {
  const tres = barajar(pool).slice(0, 3);
  return barajar([correcta, ...tres]);
}

// ─── Ejercicio 1: Escúchalo ─────────────────────────────────────────────────

function montarEscuchar(contenedor, item, api) {
  const { tt } = api;
  const { correcta, pool } = opcionesEscuchar(item);
  const opciones = cuatroOpciones(correcta, pool);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.escuchar.detalle)}</p>
    <div id="voz"></div>
    <div id="caja-elecciones"></div>`;
  detectarVoz().then(hay => {
    const caja = contenedor.querySelector('#voz');
    if (!caja) return; // el alumno ya cambió de pantalla
    if (hay) {
      caja.innerHTML = `<button type="button" class="ancho" id="escuchar">${tt(TX.escuchar.escucha)}</button>`;
      caja.querySelector('#escuchar').addEventListener('click', () => hablar(leer(item)));
    } else {
      caja.innerHTML = `<p class="aviso">${tt(TX.escuchar.sin_voz)}</p><p class="operacion">${api.esc(leer(item))}</p>`;
    }
  });
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    opciones: opciones.map(texto => ({ valor: texto, html: texto })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([correcta], valor);
      api.responder({
        acierto: valor === correcta,
        html: `${tt(TX.escuchar.correcta)} ${api.esc(leer(item))}.`,
      });
    },
  });
}

// ─── Ejercicio 2: ¿Cómo se lee? ─────────────────────────────────────────────

function montarLeer(contenedor, item, api) {
  const { tt } = api;
  const { correcta, pool } = opcionesLeer(item);
  const opciones = cuatroOpciones(correcta, pool);
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.leer.detalle)}</p>
    <div class="operacion">${notacion(item)}</div>
    <div id="caja-elecciones"></div>
    <button type="button" class="secundario" id="oir" hidden>${tt(TX.leer.escucha)}</button>`;
  const botonOir = contenedor.querySelector('#oir');
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    opciones: opciones.map(texto => ({ valor: texto, html: api.esc(texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([correcta], valor);
      botonOir.hidden = false;
      api.responder({
        acierto: valor === correcta,
        html: valor === correcta ? '' : api.esc(correcta),
      });
    },
  });
  botonOir.addEventListener('click', () => hablar(correcta));
}

// ─── Ejercicio 3: Completa la frase ────────────────────────────────────────

function montarCompletar(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.completar.detalle)}</p>
    <div class="operacion">${api.esc(item.frase)}</div>
    <div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    opciones: item.opciones.map(texto => ({ valor: texto, html: api.esc(texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const fraseCompleta = item.frase.replace('___', item.solucion);
      api.responder({
        acierto: valor === item.solucion,
        html: `${tt(TX.completar.correcta_fue)} ${api.esc(fraseCompleta)}.`,
      });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────

arrancar({
  slug: 'leelo',
  ejercicios: [
    {
      nombre: TX.escuchar.nombre,
      detalle: TX.escuchar.detalle,
      generar: generarEscuchar,
      clave: item => JSON.stringify(item),
      montar: montarEscuchar,
    },
    {
      nombre: TX.leer.nombre,
      detalle: TX.leer.detalle,
      generar: generarLeer,
      clave: item => JSON.stringify({ ...item, estilo: undefined }),
      montar: montarLeer,
    },
    {
      nombre: TX.completar.nombre,
      detalle: TX.completar.detalle,
      generar: generarCompletar,
      clave: item => item.frase,
      montar: montarCompletar,
    },
  ],
});
