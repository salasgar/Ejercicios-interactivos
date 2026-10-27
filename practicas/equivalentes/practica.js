// ESQUELETO de «Fracciones equivalentes» (PU2, tarea 98). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 100
// (`reparto-practicas-u2/tareas/tarea-100-equivalentes.md`) sustituye esta carpeta entera,
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
  slug: 'equivalentes',
  ejercicios: [
    ejercicio('El término que falta', 'The missing number'),
    ejercicio('¿Son equivalentes?', 'Are they equivalent?'),
    ejercicio('Equipos', 'Teams'),
    ejercicio('Común denominador', 'Common denominator'),
  ],
});
