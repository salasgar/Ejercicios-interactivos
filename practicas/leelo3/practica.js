// Práctica «Léelo en inglés» de la unidad 3 (Integers): cuatro ejercicios de elegir entre
// opciones, uno por semana. Contrato de la base en `../_comun/base.js` y `../plantilla/practica.js`.
// La lógica (ítems, distractores y errores) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX } from './textos.js';
import {
  generarEnteros, generarOperaciones, generarPotencias, generarPalabras, claveDe,
} from './logica.js';

const enunciado = (item, { tt, esc }) => `
    <p class="instruccion">${tt(TX.instrucciones[item.instruccion])}</p>
    ${item.notacion ? `<div class="operacion">${item.notacion}</div>` : ''}
    ${item.frase ? `<p class="operacion">${esc(item.frase)}</p>` : ''}`;

function montar(contenedor, item, api) {
  contenedor.innerHTML = `${enunciado(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    opciones: item.opciones.map(o => ({ valor: o.texto, html: o.html ?? api.esc(o.texto) })),
    alElegir(valor) {
      if (api.respondido()) return;
      const elegida = item.opciones.find(o => o.texto === valor);
      const buenas = item.opciones.filter(o => o.correcta).map(o => o.texto);
      botones.marcar(buenas, valor);
      api.responder({
        acierto: elegida.correcta,
        error: elegida.error ?? undefined,
        respuesta: elegida.texto,
        html: ({ tt }) => (elegida.correcta ? '' : `${tt(elegida.por_que)} `) + tt(item.solucion),
      });
    },
  });
}

const ejercicio = (i, generar) => ({
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar,
  clave: claveDe,
  montar,
  enunciado,
});

arrancar({
  slug: 'leelo3',
  ejercicios: [
    ejercicio(0, generarEnteros),
    ejercicio(1, generarOperaciones),
    ejercicio(2, generarPotencias),
    ejercicio(3, generarPalabras),
  ],
});
