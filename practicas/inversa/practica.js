// ESQUELETO de «Proporcionalidad inversa» de la unidad 7 (PU2, tarea 211). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 215
// (`reparto-practicas-u2/tareas/tarea-215-inversa.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test, y cambia cada `sinAyuda` por su `explicacion` («No lo sé», M22).

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea 215.',
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'inversa',
  ejercicios: [
    ejercicio('¿Es inversa?', 'Is it inverse?'),
    ejercicio('Completa la tabla', 'Complete the table'),
    ejercicio('Problemas', 'Problems'),
    ejercicio('Caza el error', 'Spot the mistake'),
  ],
});
