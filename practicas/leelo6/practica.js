// Práctica «Léelo en inglés» de la unidad 6 (Algebra): el vocabulario del álgebra, leer y
// escribir expresiones y ecuaciones, entender una consigna de examen en inglés y completar una
// frase. Los cuatro ejercicios son de elegir una opción. Contrato de la base en
// `../_comun/base.js` y `../plantilla/practica.js`; la lógica (ítems, distractores) está en `logica.js`.

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { TX, explicaLeelo } from './textos.js';
import { generarPalabra, generarLeelo, generarConsigna, generarCompleta, claveItem } from './logica.js';

const enunciadoElegir = (item, { tt }) => `
    <p class="instruccion">${tt(TX.instrucciones[item.instruccion])}</p>
    ${item.notacion}`;

function montarElegir(contenedor, item, api) {
  contenedor.innerHTML = `${enunciadoElegir(item, api)}<div id="caja-elecciones"></div>`;
  const botones = elecciones(contenedor.querySelector('#caja-elecciones'), {
    clase: 'elecciones elecciones--1',
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
        espera: 2200,
        html: ({ tt }) => (elegida.correcta ? '' : `${tt(elegida.por_que)} `) + tt(item.solucion),
      });
    },
  });
}

const ejercicio = (i, generar) => ({
  explicacion: explicaLeelo(i),
  nombre: TX.ejercicios[i].nombre,
  detalle: TX.ejercicios[i].detalle,
  introduccion: TX.ejercicios[i].introduccion,
  generar, clave: claveItem, montar: montarElegir, enunciado: enunciadoElegir,
});

arrancar({
  slug: 'leelo6',
  ejercicios: [
    ejercicio(0, generarPalabra),
    ejercicio(1, generarLeelo),
    ejercicio(2, generarConsigna),
    ejercicio(3, generarCompleta),
  ],
});
