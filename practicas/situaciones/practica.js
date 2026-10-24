// ESQUELETO de «Enteros en la vida real» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 82
// (`reparto-practicas-u2/tareas/tarea-82-situaciones.md`) sustituye esta carpeta entera,
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
  slug: 'situaciones',
  ejercicios: [
    ejercicio('¿Qué entero es?', 'Which integer is it?'),
    ejercicio('¿Qué situación es?', 'Which situation is it?'),
    ejercicio('Un paso', 'One step'),
  ],
});
