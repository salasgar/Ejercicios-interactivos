// ESQUELETO de «Subidas, bajadas y diferencias» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 90
// (`reparto-practicas-u2/tareas/tarea-90-variacion.md`) sustituye esta carpeta entera,
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
  slug: 'variacion',
  ejercicios: [
    ejercicio('¿Cuánto ha cambiado?', 'How much has it changed?'),
    ejercicio('La diferencia', 'The difference'),
    ejercicio('El dato que falta', 'The missing piece'),
    ejercicio('Antes y después de Cristo', 'BC and AD'),
    ejercicio('Del enunciado a la cuenta', 'From words to a calculation'),
  ],
});
