// ESQUELETO de «Compara y ordena» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 102
// (`reparto-practicas-u2/tareas/tarea-102-compara.md`) sustituye esta carpeta entera,
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
  slug: 'compara',
  ejercicios: [
    ejercicio('Mayor o menor', 'Greater or less'),
    ejercicio('Frente a 1 y a un medio', 'Against 1 and a half'),
    ejercicio('Ordena', 'Put in order'),
    ejercicio('En la recta', 'On the number line'),
  ],
});
