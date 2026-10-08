// Práctica «Divisiones sucesivas guiadas»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica (generadores y comprobaciones) está en
// `logica.js`, puro y probado en `tests/practicas-divisiones.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { htmlFact } from '../_comun/aritmetica.js';
import {
  PRIMOS_ESCALERA, generarEscalera, evaluarEleccion, razonNoDivide, razonNoMenor, explicarEscalera,
  generarPotencias, exponenteDe, esFactorizacionCorrecta, explicarPotencias,
  generarEjercicio3, explicarEj3,
} from './logica.js';
import { TX } from './textos.js';

const EXPONENTE_MAXIMO = 6;

// ─── Ejercicio 1: la escalera de divisiones ─────────────────────────────────────
// El alumno pulsa, paso a paso, el MENOR primo que divide al número actual. Si
// se equivoca (no divide, o divide pero no es el menor), la app lo explica y
// sigue ella misma con el paso correcto: el ítem termina siempre al llegar a 1,
// y es acierto solo si no hubo ningún error en todo el camino.

function montarEscalera(contenedor, item, api) {
  const { tt } = api;
  let m = item.n;
  let errores = 0;
  const realizados = [];
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.escalera.instruccion)}</p>
    <div class="operacion" id="numero">${m}</div>
    <p class="frase" id="mensaje"></p>
    <div class="botones-numeros" id="botones" role="group" aria-label="primos"></div>`;
  const numeroEl = contenedor.querySelector('#numero');
  const mensajeEl = contenedor.querySelector('#mensaje');
  const cajaBotones = contenedor.querySelector('#botones');

  const botones = PRIMOS_ESCALERA.map(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(p);
    b.addEventListener('click', () => manejar(p));
    cajaBotones.append(b);
    return b;
  });

  function avanzar(p) {
    realizados.push([m, p]);
    m /= p;
    numeroEl.textContent = String(m);
    if (m === 1) {
      botones.forEach(b => { b.disabled = true; });
      api.responder({ acierto: errores === 0, html: explicarEscalera(item.n, realizados, api.idioma), espera: 2600 });
    }
  }

  function manejar(p) {
    if (api.respondido() || m === 1) return;
    const { resultado, correcto } = evaluarEleccion(m, p);
    if (resultado === 'no_divide') {
      errores++;
      mensajeEl.innerHTML = razonNoDivide(m, p, api.idioma);
      avanzar(correcto);
    } else if (resultado === 'no_menor') {
      errores++;
      mensajeEl.innerHTML = razonNoMenor(p, correcto, api.idioma);
      avanzar(correcto);
    } else {
      mensajeEl.textContent = '';
      avanzar(p);
    }
  }
}

// ─── Ejercicio 2: la forma de potencias ─────────────────────────────────────────
// Se da la lista de primos («2 · 2 · 2 · 3 · 3 · 5») y el alumno fija, con
// steppers, el exponente de cada base candidata (las que aparecen, más una que
// no, para que poner 0 también sea una respuesta válida).

function montarPotencias(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.potencias.instruccion)}</p>
    <div class="operacion" id="lista">${item.lista.join(' · ')}</div>
    <div class="grupo-pasos" id="controles"></div>
    <button type="button" class="comprobar" id="comprobar">${api.t.comprobar}</button>`;
  const cajaControles = contenedor.querySelector('#controles');
  const controles = item.bases.map(p => pasos(cajaControles, {
    max: EXPONENTE_MAXIMO,
    nombre: tt(TX.potencias.exponente_de(p)),
    pinta: e => (e === 0 ? `${p}` : `${p}<sup>${e}</sup>`),
  }));
  contenedor.querySelector('#comprobar').addEventListener('click', ev => {
    if (api.respondido()) return;
    const exponentes = controles.map(c => c.valor());
    const acierto = esFactorizacionCorrecta(item, exponentes);
    controles.forEach(c => c.bloquear());
    ev.target.hidden = true;
    api.responder({ acierto, html: explicarPotencias(item.factorizacion, api.idioma), espera: 2200 });
  });
}

// ─── Ejercicio 3: comprobar multiplicando ───────────────────────────────────────
// Variante «valor» (opciones numéricas) o «sino» (¿es correcta esta igualdad?),
// según `item.tipo`. Las tres opciones falsas son siempre inequívocamente
// falsas: el error clásico de tratar p^e como p·e, ese mismo error en solo uno
// de los factores, y el valor correcto ± un factor.

function montarValor(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.ej3.pregunta_valor)(htmlFact(item.factorizacion))}</p>`;
  const botones = elecciones(contenedor, {
    opciones: item.opciones.map(v => ({ valor: v, html: String(v) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({ acierto: valor === item.solucion, html: explicarEj3(item.factorizacion, api.idioma), espera: 2000 });
    },
  });
}

function montarSino(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.ej3.pregunta_sino)(htmlFact(item.factorizacion), item.valorMostrado)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const correcta = item.igualdadCorrecta ? 'si' : 'no';
      botones.marcar([correcta], valor);
      api.responder({ acierto: valor === correcta, html: explicarEj3(item.factorizacion, api.idioma), espera: 2000 });
    },
  });
}

function montarEj3(contenedor, item, api) {
  if (item.tipo === 'sino') return montarSino(contenedor, item, api);
  return montarValor(contenedor, item, api);
}

// ─── La práctica ─────────────────────────────────────────────────────────────────

arrancar({
  slug: 'divisiones',
  ejercicios: [
    {
      nombre: TX.escalera.nombre,
      detalle: TX.escalera.detalle,
      generar: generarEscalera,
      clave: item => String(item.n),
      montar: montarEscalera,
    },
    {
      nombre: TX.potencias.nombre,
      detalle: TX.potencias.detalle,
      generar: generarPotencias,
      clave: item => item.lista.join(','),
      montar: montarPotencias,
    },
    {
      nombre: TX.ej3.nombre,
      detalle: TX.ej3.detalle,
      generar: generarEjercicio3,
      montar: montarEj3,
    },
  ],
});
