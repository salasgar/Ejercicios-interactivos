// ESQUELETO de «Paréntesis y corchetes» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 88
// (`reparto-practicas-u2/tareas/tarea-88-parentesis-enteros.md`) sustituye esta carpeta entera,
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
  slug: 'parentesis-enteros',
  ejercicios: [
    ejercicio('Quita el paréntesis', 'Remove the brackets'),
    ejercicio('Calcula', 'Work it out'),
    ejercicio('¿Al paréntesis o al número?', 'The whole bracket or one number?'),
    ejercicio('De dentro afuera', 'From the inside out'),
    ejercicio('Coloca los paréntesis', 'Place the brackets'),
  ],
});
