// ESQUELETO de «Problemas de toda la unidad» de la unidad 7 (PU2, tarea 211). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 224
// (`reparto-practicas-u2/tareas/tarea-224-problemas-proporcion.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test, y cambia cada `sinAyuda` por su `explicacion` («No lo sé», M22).

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  sinAyuda: 'Esqueleto en preparación: la explicación la escribe la tarea 224.',
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'problemas-proporcion',
  ejercicios: [
    ejercicio('¿Qué tipo de problema es?', 'What kind of problem is it?'),
    ejercicio('Velocidad, tiempo y distancia', 'Speed, time and distance'),
    ejercicio('Cambio de moneda', 'Changing money'),
    ejercicio('La mejor oferta', 'Best buy'),
    ejercicio('¿Tiene sentido la respuesta?', 'Does the answer make sense?'),
  ],
});
