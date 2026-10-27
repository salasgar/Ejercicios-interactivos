// ESQUELETO de «¿Qué fracción es?» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 99
// (`reparto-practicas-u2/tareas/tarea-99-que-fraccion.md`) sustituye esta carpeta entera,
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
  slug: 'que-fraccion',
  ejercicios: [
    ejercicio('Lee la figura', 'Read the figure'),
    ejercicio('Sombrea la fracción', 'Shade the fraction'),
    ejercicio('De la frase a la fracción', 'From words to fraction'),
    ejercicio('Léela', 'Say it'),
  ],
});
