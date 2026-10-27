// ESQUELETO de «Multiplica y divide» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 105
// (`reparto-practicas-u2/tareas/tarea-105-multiplica-divide.md`) sustituye esta carpeta entera,
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
  slug: 'multiplica-divide',
  ejercicios: [
    ejercicio('Multiplica', 'Multiply'),
    ejercicio('La fracción de una fracción', 'A fraction of a fraction'),
    ejercicio('La inversa', 'The reciprocal'),
    ejercicio('Divide', 'Divide'),
    ejercicio('Potencias', 'Powers'),
  ],
});
