// ESQUELETO de «Caza el error» de la unidad 5 (PU2, tarea 122). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 128
// (`reparto-practicas-u2/tareas/tarea-128-errores5.md`) sustituye esta carpeta entera, empezando
// por `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'errores5',
  ejercicios: [
    ejercicio('¿Dónde está el error?', 'Where is the mistake?'),
    ejercicio('¿Qué error es?', 'What went wrong?'),
    ejercicio('Corrígelo', 'Fix it'),
  ],
});
