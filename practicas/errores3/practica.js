// ESQUELETO de «Caza el error» de la unidad 3 (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 89
// (`reparto-practicas-u2/tareas/tarea-89-errores3.md`) sustituye esta carpeta entera,
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
  slug: 'errores3',
  ejercicios: [
    ejercicio('¿Dónde está el error?', 'Where is the mistake?'),
    ejercicio('¿Qué error es?', 'Which mistake is it?'),
    ejercicio('¿Error o no?', 'Mistake or not?'),
  ],
});
