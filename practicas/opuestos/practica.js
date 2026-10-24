// ESQUELETO de «Opuesto y valor absoluto» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 81
// (`reparto-practicas-u2/tareas/tarea-81-opuestos.md`) sustituye esta carpeta entera,
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
  slug: 'opuestos',
  ejercicios: [
    ejercicio('El opuesto', 'The opposite'),
    ejercicio('Distancia al cero', 'Distance from zero'),
    ejercicio('Opuesto y valor absoluto', 'Opposite and absolute value'),
    ejercicio('¿Quiénes están a esa distancia?', 'Which integers are that far from zero?'),
  ],
});
