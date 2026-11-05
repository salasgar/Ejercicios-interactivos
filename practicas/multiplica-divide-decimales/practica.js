// ESQUELETO de «Multiplica y divide decimales» de la unidad 5 (PU2, tarea 122). Solo existe para
// que su fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 126
// (`reparto-practicas-u2/tareas/tarea-126-multiplica-divide-decimales.md`) sustituye esta
// carpeta entera, empezando por `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'multiplica-divide-decimales',
  ejercicios: [
    ejercicio('Coloca la coma', 'Place the point'),
    ejercicio('Divide entre un natural', 'Divide by a whole number'),
    ejercicio('Divide entre un decimal', 'Divide by a decimal'),
    ejercicio('¿Está bien?', 'Is it right?'),
    ejercicio('Problemas', 'Problems'),
  ],
});
