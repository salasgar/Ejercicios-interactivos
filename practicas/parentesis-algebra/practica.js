// ESQUELETO de «Paréntesis» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila del catálogo
// cargue (`disponible: false`: no la ve nadie). La tarea 151
// (`reparto-practicas-u2/tareas/tarea-151-parentesis-algebra.md`) sustituye esta carpeta entera,
// empezando por `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'parentesis-algebra',
  ejercicios: [
    ejercicio('Quita el paréntesis', 'Expand the brackets'),
    ejercicio('¿Cuál es el desarrollo?', 'Which expansion?'),
    ejercicio('Resuelve con paréntesis', 'Solve with brackets'),
    ejercicio('Caza el error', 'Spot the mistake'),
  ],
});
