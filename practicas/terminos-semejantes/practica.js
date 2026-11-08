// ESQUELETO de «Términos semejantes» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 147
// (`reparto-practicas-u2/tareas/tarea-147-terminos-semejantes.md`) sustituye esta carpeta entera,
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
  slug: 'terminos-semejantes',
  ejercicios: [
    ejercicio('¿Semejantes?', 'Like terms?'),
    ejercicio('Coeficiente y parte literal', 'Coefficient and variable part'),
    ejercicio('Reduce', 'Simplify'),
    ejercicio('Caza el error', 'Spot the mistake'),
  ],
});
