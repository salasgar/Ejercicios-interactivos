// ESQUELETO de «Del enunciado al álgebra» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila
// del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 145
// (`reparto-practicas-u2/tareas/tarea-145-traduce.md`) sustituye esta carpeta entera, empezando por
// `logica.js` y su test.

import { arrancar } from '../_comun/base.js';

const EN_PREPARACION = { es: 'Este ejercicio está en preparación.', en: 'This exercise is not ready yet.' };
const ejercicio = (es, en) => ({
  nombre: { es, en },
  detalle: EN_PREPARACION,
  generar: () => ({}),
  montar(contenedor, item, api) { contenedor.innerHTML = `<p class="instruccion">${api.tt(EN_PREPARACION)}</p>`; },
});

arrancar({
  slug: 'traduce',
  ejercicios: [
    ejercicio('Elige la expresión', 'Choose the expression'),
    ejercicio('Escríbela', 'Write it'),
    ejercicio('Elige la frase', 'Choose the words'),
    ejercicio('Situaciones', 'Real-life situations'),
  ],
});
