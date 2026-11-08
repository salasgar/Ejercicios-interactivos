// ESQUELETO de «Problemas con ecuaciones» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila
// del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 153
// (`reparto-practicas-u2/tareas/tarea-153-problemas-ecuaciones.md`) sustituye esta carpeta entera,
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
  slug: 'problemas-ecuaciones',
  ejercicios: [
    ejercicio('¿Qué es x?', 'What is x?'),
    ejercicio('¿Qué ecuación?', 'Which equation?'),
    ejercicio('Resuelve y contesta', 'Solve and answer'),
    ejercicio('¿Qué pide?', 'What are they asking for?'),
    ejercicio('¿Tiene sentido?', 'Does it make sense?'),
  ],
});
