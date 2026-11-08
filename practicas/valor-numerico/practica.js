// ESQUELETO de «Valor numérico» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 146
// (`reparto-practicas-u2/tareas/tarea-146-valor-numerico.md`) sustituye esta carpeta entera, empezando
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
  slug: 'valor-numerico',
  ejercicios: [
    ejercicio('Sustituye y calcula', 'Substitute and work out'),
    ejercicio('La tabla', 'The table'),
    ejercicio('¿Qué valor?', 'Which value?'),
  ],
});
