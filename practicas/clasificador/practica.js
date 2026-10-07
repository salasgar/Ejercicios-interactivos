// Práctica «¿m.c.d. o m.c.m.?» — Clasificar enunciados sin calcular.
//
// Tres ejercicios sobre el mismo banco de 36 enunciados (textos.js):
//  1. limpio      elegir m.c.d. o m.c.m.
//  2. trampa      igual, pero con una palabra que empuja al revés
//  3. justificar  la clase ya está puesta; elegir la razón correcta

import { arrancar } from '../_comun/base.js';
import { elecciones } from '../_comun/piezas.js';
import { BANCO, TX } from './textos.js';
import { generarLimpio, generarTrampa, generarJustificar } from './logica.js';

function montarClasificar(contenedor, item, api) {
  const { tt } = api;
  const plantilla = BANCO[item.plantilla];
  contenedor.innerHTML = `<p class="enunciado">${tt(plantilla)(...item.numeros)}</p>`;
  const botones = elecciones(contenedor, {
    clase: 'si-no clasificador-botones',
    opciones: [
      { valor: 'mcd', html: tt(TX.boton.mcd) },
      { valor: 'mcm', html: tt(TX.boton.mcm) },
    ],
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.clase], valor);
      api.responder({
        acierto: valor === item.clase,
        html: tt(plantilla.razon(...item.numeros)),
        espera: 2200,
      });
    },
  });
}

function montarJustificar(contenedor, item, api) {
  const { tt, esc } = api;
  const plantilla = BANCO[item.plantilla];
  const etiqueta = tt(item.clase === 'mcd' ? TX.boton.mcd : TX.boton.mcm);
  contenedor.innerHTML = `
    <p class="enunciado">${tt(plantilla)(...item.numeros)}</p>
    <p class="instruccion clasificador-justificar">${esc(tt(TX.preguntaJustificar))} <strong>${esc(etiqueta)}</strong>. ${esc(tt(TX.porque))}</p>`;
  const botones = elecciones(contenedor, {
    clase: `elecciones elecciones--${item.opciones.length}`,
    opciones: item.opciones.map(clave => ({ valor: clave, html: tt(TX.justificacion[clave]) })),
    alElegir(valor) {
      if (api.respondido()) return;
      botones.marcar([item.solucion], valor);
      api.responder({
        acierto: valor === item.solucion,
        html: tt(plantilla.razon(...item.numeros)),
        espera: 2200,
      });
    },
  });
}

arrancar({
  slug: 'clasificador',
  ejercicios: [
    {
      nombre: TX.nombre.limpio,
      detalle: TX.detalle.limpio,
      generar: generarLimpio,
      montar: montarClasificar,
    },
    {
      nombre: TX.nombre.trampa,
      detalle: TX.detalle.trampa,
      generar: generarTrampa,
      montar: montarClasificar,
    },
    {
      nombre: TX.nombre.justificar,
      detalle: TX.detalle.justificar,
      generar: generarJustificar,
      montar: montarJustificar,
    },
  ],
});
