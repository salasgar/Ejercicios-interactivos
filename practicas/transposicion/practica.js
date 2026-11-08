// ESQUELETO de «Pasa al otro lado» de la unidad 6 (PU2, tarea 144). Solo existe para que su fila del
// catálogo cargue (`disponible: false`: no la ve nadie). La tarea 149
// (`reparto-practicas-u2/tareas/tarea-149-transposicion.md`) sustituye esta carpeta entera, empezando
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
  slug: 'transposicion',
  ejercicios: [
    ejercicio('Con números', 'With numbers'),
    ejercicio('Una operación', 'One step'),
    ejercicio('Dos operaciones, paso a paso', 'Two steps'),
    ejercicio('3x = 12 frente a 12x = 3', 'Which way round?'),
    ejercicio('Comprueba y corrige', 'Check and fix'),
  ],
});
