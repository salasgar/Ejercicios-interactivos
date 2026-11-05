// ESQUELETO de «De fracción a decimal y vuelta» de la unidad 5 (PU2, tarea 122). Solo existe
// para que su fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 127
// (`reparto-practicas-u2/tareas/tarea-127-fraccion-decimal.md`) sustituye esta carpeta entera,
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
  slug: 'fraccion-decimal',
  ejercicios: [
    ejercicio('De fracción a decimal', 'Fraction to decimal'),
    ejercicio('De decimal a fracción', 'Decimal to fraction'),
    ejercicio('Los que hay que saberse', 'Learn these by heart'),
    ejercicio('¿Cuál es mayor?', 'Which is bigger?'),
  ],
});
