// ESQUELETO de «El tanto por ciento de una cantidad» de la unidad 7 (PU2, tarea 211). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 219
// (`reparto-practicas-u2/tareas/tarea-219-tanto-por-ciento.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test, y cambia cada `sinAyuda` por su `explicacion` («No lo sé», M22).

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea 219.',
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'tanto-por-ciento',
  ejercicios: [
    ejercicio('De cabeza', 'In your head'),
    ejercicio('Con el decimal', 'Using the decimal'),
    ejercicio('¿Qué operación?', 'Which calculation?'),
    ejercicio('Problemas', 'Problems'),
  ],
});
