// ESQUELETO de «¿Qué porcentaje? ¿De cuánto?» de la unidad 7 (PU2, tarea 211). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 220
// (`reparto-practicas-u2/tareas/tarea-220-que-porcentaje.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test, y cambia cada `sinAyuda` por su `explicacion` («No lo sé», M22).

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea 220.',
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'que-porcentaje',
  ejercicios: [
    ejercicio('¿Qué porcentaje es?', 'What percentage is it?'),
    ejercicio('¿De cuánto?', 'Of how much?'),
    ejercicio('¿Cuál de los tres problemas es?', 'Which of the three?'),
    ejercicio('Problemas', 'Problems'),
  ],
});
