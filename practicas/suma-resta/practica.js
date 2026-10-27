// ESQUELETO de «Suma y resta» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 104
// (`reparto-practicas-u2/tareas/tarea-104-suma-resta.md`) sustituye esta carpeta entera,
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
  slug: 'suma-resta',
  ejercicios: [
    ejercicio('Mismo denominador', 'Same denominator'),
    ejercicio('Distinto denominador, paso a paso', 'Different denominators, step by step'),
    ejercicio('Con naturales', 'With whole numbers'),
    ejercicio('¿Qué queda?', 'What is left?'),
    ejercicio('Caza el error', 'Spot the mistake'),
  ],
});
