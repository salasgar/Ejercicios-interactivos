// ESQUELETO de «¿Qué se hace primero? Con fracciones» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 106
// (`reparto-practicas-u2/tareas/tarea-106-combinadas-fracciones.md`) sustituye esta carpeta entera,
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
  slug: 'combinadas-fracciones',
  ejercicios: [
    ejercicio('¿Cuál primero?', 'Which one first?'),
    ejercicio('Un paso cada vez', 'One step at a time'),
    ejercicio('Caza el error', 'Spot the mistake'),
  ],
});
