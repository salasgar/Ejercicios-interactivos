// ESQUELETO de «Suma y resta decimales» de la unidad 5 (PU2, tarea 122). Solo existe para que
// su fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 125
// (`reparto-practicas-u2/tareas/tarea-125-suma-resta-decimales.md`) sustituye esta carpeta
// entera, empezando por `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'suma-resta-decimales',
  ejercicios: [
    ejercicio('Alinea la coma', 'Line up the points'),
    ejercicio('En la tienda', 'At the shop'),
    ejercicio('Medidas', 'Measures'),
    ejercicio('Mueve la coma', 'Move the point'),
  ],
});
