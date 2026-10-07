// Práctica «Múltiplos y divisores en la recta numérica»: la interfaz (los
// `montar`) y la llamada a `arrancar`. La lógica está en `logica.js`, puro y
// probado en `tests/practicas-recta.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { generarMultiplos, generarDivisores, generarVF, esCorrecta, explicar } from './logica.js';
import { TX } from './textos.js';

// ─── Ejercicios 1 y 2: marca en la recta (filas de diez, toque para encender) ───

function montarRecta(contenedor, item, api) {
  const { tt } = api;
  const pregunta = item.tipo === 'multiplos' ? tt(TX.ej1.pregunta)(item.n) : tt(TX.ej2.pregunta)(item.n);
  contenedor.innerHTML = `
    <p class="instruccion">${pregunta}</p>
    <div id="recta"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const recta = contenedor.querySelector('#recta');
  const marcados = new Set();
  const celdas = new Map();
  const filas = Math.ceil((item.hasta + 1) / 10);
  for (let f = 0; f < filas; f++) {
    const fila = document.createElement('div');
    fila.className = 'rejilla';
    fila.style.setProperty('--columnas', '10');
    for (let c = 0; c < 10; c++) {
      const valor = f * 10 + c;
      if (valor > item.hasta) break;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rejilla__celda';
      b.textContent = String(valor);
      b.addEventListener('click', () => {
        if (api.respondido()) return;
        if (marcados.has(valor)) { marcados.delete(valor); b.classList.remove('rejilla__celda--marcada'); }
        else { marcados.add(valor); b.classList.add('rejilla__celda--marcada'); }
      });
      celdas.set(valor, b);
      fila.append(b);
    }
    recta.append(fila);
  }
  contenedor.querySelector('#comprobar').addEventListener('click', () => {
    if (api.respondido()) return;
    const respuesta = [...marcados];
    const acierto = esCorrecta(item, respuesta);
    const buenos = new Set(item.correctos);
    celdas.forEach((b, valor) => {
      b.disabled = true;
      if (buenos.has(valor)) b.classList.add('rejilla__celda--bien');
      else if (marcados.has(valor)) b.classList.add('rejilla__celda--mal');
    });
    api.responder({ acierto, html: explicar(item, respuesta, api.idioma), espera: 2400 });
  });
}

// ─── Ejercicio 3: ¿verdadero o falso? ───────────────────────────────────────────

function fraseVF(item, api) {
  const { tt } = api;
  const plantilla = TX.ej3.frase[item.plantilla];
  return item.a !== undefined ? tt(plantilla)(item.a, item.b) : tt(plantilla)(item.n);
}

function montarVF(contenedor, item, api) {
  contenedor.innerHTML = `<p class="frase">${fraseVF(item, api)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'v', html: api.t.verdadero }, { valor: 'f', html: api.t.falso }],
    alElegir(valor) {
      if (api.respondido()) return;
      const buena = item.verdad ? 'v' : 'f';
      botones.marcar([buena], valor);
      api.responder({ acierto: valor === buena, html: explicar(item, null, api.idioma), espera: 1800 });
    },
  });
}

// ─── La práctica ─────────────────────────────────────────────────────────────────

arrancar({
  slug: 'recta',
  ejercicios: [
    {
      nombre: TX.ej1.nombre,
      detalle: TX.ej1.detalle,
      generar: generarMultiplos,
      clave: item => `${item.n}`,
      montar: montarRecta,
    },
    {
      nombre: TX.ej2.nombre,
      detalle: TX.ej2.detalle,
      generar: generarDivisores,
      clave: item => `${item.n}`,
      montar: montarRecta,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      generar: generarVF,
      clave: item => `${item.plantilla}-${item.n ?? ''}-${item.a ?? ''}-${item.b ?? ''}`,
      montar: montarVF,
    },
  ],
});
