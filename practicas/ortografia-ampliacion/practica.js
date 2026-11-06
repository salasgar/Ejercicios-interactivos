// Ortografía: ampliación (id 68; tarea 139, 2026-11-06). Más allá de 1.º ESO; nunca es ★ en
// una tarea semanal. Cuatro ejercicios, en orden de dificultad, cada uno con tres niveles
// (../_comun/nivel.js):
//
//   1. porque, por qué, porqué, por que   una frase con hueco; los cuatro botones siempre
//   2. Formas verbales mal escritas        una frase con hueco; la buena y la mala, barajadas
//   3. Siglas, abreviaturas y prefijos     «¿cuál está bien escrita?»
//   4. Puntuación avanzada                 «¿cuál está bien escrita?»
//
// Los bancos, las explicaciones y los idError están en logica.js; las piezas, en
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { montarHueco, montarElegir, TXO } from '../_comun/ortografia.js';
import { etiquetaNivel } from '../_comun/nivel.js';
import { TX } from './textos.js';
import {
  partes, FORMAS, PORQUES, generarPorques, explicacionPorque, idErrorPorque,
  VERBOS, generarVerbos, opcionesVerbo, explicacionVerbo, idErrorVerbo,
  SIGLAS, AVANZADA, generarSiglas, generarAvanzada, explicacionElegir, idErrorElegir,
} from './logica.js';

const clave = item => String(item.i);

function montarPorque(contenedor, item, api) {
  const it = PORQUES[item.i];
  montarHueco(contenedor, api, {
    ...partes(it.frase),
    opciones: FORMAS,
    buena: it.buena,
    explicacion: explicacionPorque(it),
    idError: puso => idErrorPorque(it, puso),
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    espera: 4000,
  });
}

function montarVerbo(contenedor, item, api) {
  const it = VERBOS[item.i];
  montarHueco(contenedor, api, {
    ...partes(it.frase),
    opciones: opcionesVerbo(it, item.orden),
    buena: it.buena,
    explicacion: explicacionVerbo(it),
    idError: idErrorVerbo(it),
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    espera: 3500,
  });
}

/** «¿Cuál está bien escrita?» sobre un banco: las opciones vienen barajadas en el ítem. */
const montarEscrita = banco => (contenedor, item, api) => {
  const ficha = banco[item.i];
  montarElegir(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    instruccion: TXO.escrita,
    opciones: item.opciones,
    buena: 0,
    explicacion: k => explicacionElegir(ficha, k),
    idError: k => idErrorElegir(ficha, k),
    espera: 5000,
  });
};

const ejercicio = (textos, generar, montar) => ({
  nombre: textos.nombre, detalle: textos.detalle, introduccion: textos.introduccion, generar, clave, montar,
});

arrancar({
  slug: 'ortografia-ampliacion',
  idioma: 'es',
  ejercicios: [
    ejercicio(TX.porques, generarPorques, montarPorque),
    ejercicio(TX.verbos, generarVerbos, montarVerbo),
    ejercicio(TX.siglas, generarSiglas, montarEscrita(SIGLAS)),
    ejercicio(TX.avanzada, generarAvanzada, montarEscrita(AVANZADA)),
  ],
});
