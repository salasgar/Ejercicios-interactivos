// ESQUELETO de «Caza el error» de la unidad 4 (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 107
// (`reparto-practicas-u2/tareas/tarea-107-errores4.md`) sustituye esta carpeta entera,
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
  slug: 'errores4',
  ejercicios: [
    ejercicio('¿Bien o mal?', 'Right or wrong?'),
    ejercicio('La línea mala', 'The wrong line'),
    ejercicio('Arréglalo', 'Fix it'),
  ],
});
