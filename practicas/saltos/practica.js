// ESQUELETO de «Sumas y restas con saltos» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 83
// (`reparto-practicas-u2/tareas/tarea-83-saltos.md`) sustituye esta carpeta entera,
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
  slug: 'saltos',
  ejercicios: [
    ejercicio('Salta en la recta', 'Jump on the number line'),
    ejercicio('¿Qué signo tendrá?', 'Which sign will it have?'),
    ejercicio('De izquierda a derecha', 'From left to right'),
    ejercicio('Varios términos', 'Several terms'),
    ejercicio('Varios movimientos', 'Several moves'),
  ],
});
