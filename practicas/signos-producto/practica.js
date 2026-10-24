// ESQUELETO de «La regla de los signos» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 85
// (`reparto-practicas-u2/tareas/tarea-85-signos-producto.md`) sustituye esta carpeta entera,
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
  slug: 'signos-producto',
  ejercicios: [
    ejercicio('Multiplica', 'Multiply'),
    ejercicio('Divide', 'Divide'),
    ejercicio('El factor que falta', 'The missing factor'),
    ejercicio('¿Suma o producto?', 'Sum or product?'),
    ejercicio('¿Cuál está bien escrito?', 'Which one is written correctly?'),
  ],
});
