// ESQUELETO de «¿Qué se hace primero? Con enteros» (PU2, tarea 79). Solo existe para que su
// fila del catálogo cargue (`disponible: false`: no la ve nadie). La tarea 87
// (`reparto-practicas-u2/tareas/tarea-87-jerarquia-enteros.md`) sustituye esta carpeta entera,
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
  slug: 'jerarquia-enteros',
  ejercicios: [
    ejercicio('¿Qué va primero?', 'What comes first?'),
    ejercicio('Producto o potencia dentro de una suma', 'A product or a power inside a sum'),
    ejercicio('Cadenas de · y :', 'Chains of · and :'),
    ejercicio('Combinadas', 'Mixed operations'),
  ],
});
