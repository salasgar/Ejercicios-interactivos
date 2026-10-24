// ESQUELETO de «La recta y el termómetro» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 80
// (`reparto-practicas-u2/tareas/tarea-80-termometro.md`) sustituye esta carpeta entera,
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
  slug: 'termometro',
  ejercicios: [
    ejercicio('Coloca el entero', 'Place the integer'),
    ejercicio('¿Qué temperatura marca?', 'What does it show?'),
    ejercicio('Mayor o menor', 'Greater or less'),
    ejercicio('Ordena', 'Put in order'),
    ejercicio('¿Positivo, negativo o ninguno?', 'Positive, negative or neither?'),
  ],
});
