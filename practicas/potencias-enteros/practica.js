// ESQUELETO de «Productos y potencias con signo» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 86
// (`reparto-practicas-u2/tareas/tarea-86-potencias-enteros.md`) sustituye esta carpeta entera,
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
  slug: 'potencias-enteros',
  ejercicios: [
    ejercicio('Cuenta los negativos', 'Count the negatives'),
    ejercicio('Potencia de base negativa', 'Power with a negative base'),
    ejercicio('¿Cuál es la base?', 'What is the base?'),
    ejercicio('Cuadrados y raíces', 'Squares and roots'),
  ],
});
