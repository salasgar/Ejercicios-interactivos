// ESQUELETO de «Razones y proporciones» de la unidad 7 (PU2, tarea 211). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 212
// (`reparto-practicas-u2/tareas/tarea-212-razones.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test, y cambia cada `sinAyuda` por su `explicacion` («No lo sé», M22).

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea 212.',
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'razones',
  ejercicios: [
    ejercicio('La razón', 'Write the ratio'),
    ejercicio('Equivalentes y la más sencilla', 'Equivalent ratios and simplest form'),
    ejercicio('¿Forman proporción?', 'Do they form a proportion?'),
    ejercicio('El término que falta', 'The missing term'),
  ],
});
