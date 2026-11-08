// ESQUELETO de «Quita denominadores» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 152
// (`reparto-practicas-u2/tareas/tarea-152-denominadores.md`) sustituye esta carpeta entera, empezando
// por `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'denominadores',
  ejercicios: [
    ejercicio('¿Por cuánto multiplico?', 'What do I multiply by?'),
    ejercicio('Sin denominadores', 'Without fractions'),
    ejercicio('Resuélvela', 'Solve it'),
    ejercicio('Paso a paso', 'Step by step'),
  ],
});
