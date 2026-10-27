// ESQUELETO de «Simplifica» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 101
// (`reparto-practicas-u2/tareas/tarea-101-simplifica.md`) sustituye esta carpeta entera,
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
  slug: 'simplifica',
  ejercicios: [
    ejercicio('Paso a paso', 'Step by step'),
    ejercicio('¿Irreducible?', 'Lowest terms?'),
    ejercicio('De una vez', 'In one go'),
  ],
});
