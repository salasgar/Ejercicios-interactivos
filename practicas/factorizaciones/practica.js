// Práctica «Operar con factorizaciones»: la interfaz (los `montar`) y la
// llamada a `arrancar`. La lógica está en `logica.js`, puro y probado en
// `tests/practicas-factorizaciones.test.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones, pasos } from '../_comun/piezas.js';
import { htmlFact, valorDe } from '../_comun/aritmetica.js';
import { TX } from './textos.js';
import {
  generarProducto, generarMultiplo, generarCociente,
  primosDe, factDe, esCorrecta, explicar, explicarNoMultiplo, EXPONENTE_MAXIMO,
} from './logica.js';

const datos = (fa, a, fb, b) => `
  <div class="factorizaciones-datos">
    <div class="operacion">${a} = ${htmlFact(fa)}</div>
    <div class="operacion">${b} = ${htmlFact(fb)}</div>
  </div>`;

/**
 * Los steppers de exponentes (una columna por primo) y la expresión que se va
 * formando debajo. `tope(p)` da el máximo de cada primo (en el producto, la
 * suma; en los demás, uno fijo para no delatar la respuesta).
 */
function steppers(caja, item, api, tope) {
  const primos = primosDe(item);
  const expresion = document.createElement('div');
  expresion.className = 'operacion';
  const grupo = document.createElement('div');
  grupo.className = 'grupo-pasos';
  caja.append(grupo, expresion);
  const exponentes = () => controles.map(c => c.valor());
  const pintar = () => {
    const f = factDe(primos, exponentes());
    expresion.innerHTML = f.length ? `${htmlFact(f)} = ${valorDe(f)}` : '1';
  };
  const controles = primos.map(p => pasos(grupo, {
    max: tope(p),
    nombre: api.tt(TX.exponente_de)(p),
    pinta: e => (e === 0 ? `${p}` : `${p}<sup>${e}</sup>`),
    alCambiar: pintar,
  }));
  pintar();
  return { exponentes, bloquear: () => controles.forEach(c => c.bloquear()) };
}

/** Botón «Comprobar» + respuesta de un ítem construido con steppers. */
function comprobable(caja, item, api, panel) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'comprobar';
  boton.textContent = api.t.comprobar;
  caja.append(boton);
  boton.addEventListener('click', () => {
    if (api.respondido()) return;
    const mios = panel.exponentes();
    panel.bloquear();
    boton.hidden = true;
    api.responder({ acierto: esCorrecta(item, mios), html: explicar(item, mios, api.idioma), espera: 2600 });
  });
}

// ─── Ejercicio 1: el producto ──────────────────────────────────────────────────

function montarProducto(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.producto.instruccion)}</p>
    ${datos(item.fa, item.a, item.fb, item.b)}
    <div class="operacion">${tt(TX.producto_de)(item.a, item.b)} = ${item.a * item.b}</div>`;
  const maximo = Object.fromEntries(primosDe(item).map(p => [p, (item.fa.find(([q]) => q === p)?.[1] ?? 0) + (item.fb.find(([q]) => q === p)?.[1] ?? 0)]));
  const panel = steppers(contenedor, item, api, p => maximo[p]);
  comprobable(contenedor, item, api, panel);
}

// ─── Ejercicio 2: ¿es múltiplo? ────────────────────────────────────────────────

function montarMultiplo(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.multiplo.pregunta)(item.a, item.b)}</p>
    ${datos(item.fa, item.a, item.fb, item.b)}`;
  const segunda = document.createElement('div');
  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [{ valor: 'si', html: api.t.si }, { valor: 'no', html: api.t.no }],
    alElegir(valor) {
      if (api.respondido()) return;
      const dijoSi = valor === 'si';
      botones.marcar([item.esMultiplo ? 'si' : 'no'], valor);
      if (dijoSi !== item.esMultiplo) {
        return api.responder({ acierto: false, html: explicar(item, null, api.idioma), espera: 2600 });
      }
      if (!item.esMultiplo) return api.responder({ acierto: true, html: explicarNoMultiplo(item, api.idioma), espera: 2600 });
      // Sí y es verdad: queda la segunda parte, construir el número por el que se multiplica.
      segunda.innerHTML = `<p class="instruccion">${tt(TX.multiplo.segunda)(item.a, item.b)}</p>`;
      contenedor.append(segunda);
      const panel = steppers(segunda, item, api, () => EXPONENTE_MAXIMO);
      comprobable(segunda, item, api, panel);
    },
  });
}

// ─── Ejercicio 3: el cociente ──────────────────────────────────────────────────

function montarCociente(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `
    <p class="instruccion">${tt(TX.cociente.instruccion)}</p>
    ${datos(item.fa, item.a, item.fb, item.b)}
    <div class="operacion">${tt(TX.cociente.enunciado)(item.a, item.b)} = □</div>`;
  const panel = steppers(contenedor, item, api, () => EXPONENTE_MAXIMO);
  comprobable(contenedor, item, api, panel);
}

// ─── La práctica ───────────────────────────────────────────────────────────────

arrancar({
  slug: 'factorizaciones',
  ejercicios: [
    { nombre: TX.producto.nombre, detalle: TX.producto.detalle, introduccion: TX.producto.introduccion, generar: generarProducto, montar: montarProducto },
    { nombre: TX.multiplo.nombre, detalle: TX.multiplo.detalle, introduccion: TX.multiplo.introduccion, generar: generarMultiplo, montar: montarMultiplo },
    { nombre: TX.cociente.nombre, detalle: TX.cociente.detalle, introduccion: TX.cociente.introduccion, generar: generarCociente, montar: montarCociente },
  ],
});
