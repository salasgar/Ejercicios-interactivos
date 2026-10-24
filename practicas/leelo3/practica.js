// ESQUELETO de «Léelo en inglés» de la unidad 3 (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 91
// (`reparto-practicas-u2/tareas/tarea-91-leelo3.md`) sustituye esta carpeta entera,
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
  slug: 'leelo3',
  ejercicios: [
    ejercicio('Los enteros', 'Integers'),
    ejercicio('Sumas, restas y productos', 'Adding, subtracting, multiplying'),
    ejercicio('Potencias', 'Powers'),
    ejercicio('Palabras y símbolos', 'Words and symbols'),
  ],
});
