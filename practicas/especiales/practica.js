// PRÁCTICA «Potencias especiales, verdadero o falso» (repaso de la unidad 1):
// las igualdades con las que todos se confunden (a⁰, 0ⁿ, 1ⁿ, a¹, potencias de
// 10…). La verdad de cada una se calcula con los números del ítem, nunca se
// declara a mano (ver logica.js).

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, renderPlantilla, explicarPlantilla } from './textos.js';
import { generarVF, generarFalsa, evaluar } from './logica.js';

// ─── Ejercicio 1: ¿verdadero o falso? ───────────────────────────────────────────

let racha = 0;

function montarVF(contenedor, item, api) {
  const { t, tt } = api;
  const { lado1, lado2 } = evaluar(item.id, item.vars);
  contenedor.innerHTML = `
    <p class="instruccion">${t.verdadero} / ${t.falso}</p>
    <div class="operacion">${renderPlantilla(item.id, item.vars)}</div>
    ${racha > 0 ? `<p class="frase">🔥 ${tt(TX.racha)(racha)}</p>` : ''}`;

  const botones = elecciones(contenedor, {
    clase: 'si-no',
    opciones: [
      { valor: true, html: t.verdadero },
      { valor: false, html: t.falso },
    ],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.verdad], valor);
      const acierto = valor === item.verdad;
      racha = acierto ? racha + 1 : 0;
      const html = tt(explicarPlantilla(item.id, item.vars, lado1, lado2));
      api.responder({ acierto, html, espera: 2000 });
    },
  });
}

// ─── Ejercicio 2: ¿cuál es la falsa? ────────────────────────────────────────────

function montarFalsa(contenedor, item, api) {
  const { tt } = api;
  contenedor.innerHTML = `<p class="instruccion">${tt(TX.instruccion2)}</p>`;
  const botones = elecciones(contenedor, {
    opciones: item.items.map((it, i) => ({ valor: i, html: renderPlantilla(it.id, it.vars) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      const acierto = valor === item.solucion;
      const falsa = item.items[item.solucion];
      const { lado1, lado2 } = evaluar(falsa.id, falsa.vars);
      const explicacionFalsa = tt(explicarPlantilla(falsa.id, falsa.vars, lado1, lado2));
      const html = acierto
        ? `${tt(TX.correcta2)} ${explicacionFalsa}`
        : `${tt(TX.incorrecta2)} ${renderPlantilla(falsa.id, falsa.vars)}. ${explicacionFalsa}`;
      api.responder({ acierto, html, espera: 2400 });
    },
  });
}

// ─── La práctica ────────────────────────────────────────────────────────────────

arrancar({
  slug: 'especiales',
  ejercicios: [
    {
      nombre: TX.nombre,
      detalle: TX.detalle,
      generar: generarVF,
      clave: item => `${item.id}-${JSON.stringify(item.vars)}`,
      montar: montarVF,
    },
    {
      nombre: TX.nombre2,
      detalle: TX.detalle2,
      generar: generarFalsa,
      montar: montarFalsa,
    },
  ],
});
