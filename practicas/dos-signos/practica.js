// ESQUELETO de «Dos signos seguidos» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 84
// (`reparto-practicas-u2/tareas/tarea-84-dos-signos.md`) sustituye esta carpeta entera,
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
  slug: 'dos-signos',
  ejercicios: [
    ejercicio('Un solo signo', 'Just one sign'),
    ejercicio('Sumar o restar un negativo', 'Adding or subtracting a negative'),
    ejercicio('Quita los paréntesis y calcula', 'Remove the brackets and work it out'),
    ejercicio('¿Cuál está bien escrita?', 'Which one is written correctly?'),
  ],
});
