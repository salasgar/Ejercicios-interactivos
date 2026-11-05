// ESQUELETO de «Léelo en inglés» de la unidad 5 (PU2, tarea 122). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 129
// (`reparto-practicas-u2/tareas/tarea-129-leelo5.md`) sustituye esta carpeta entera, empezando por
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
  slug: 'leelo5',
  ejercicios: [
    ejercicio('La palabra', 'The word'),
    ejercicio('Léelo', 'Say it'),
    ejercicio('La consigna', 'The instruction'),
    ejercicio('Completa', 'Fill in'),
  ],
});
