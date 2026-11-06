// Ortografía: puntuación y mayúsculas (id 66; la escribe la tarea 137, 2026-11-06).
// Cuatro ejercicios, de más fácil a más difícil, cada uno con tres niveles
// (../_comun/nivel.js) y las piezas de ../_comun/ortografia.js:
//
//   1. Mayúsculas                  tocar las palabras con la mayúscula o la minúscula mal puesta
//   2. El punto y la coma          «¿cuál está bien escrita?»
//   3. Dos puntos, suspensivos y el saludo   igual
//   4. El correo al profesor       igual, y «¿asunto o cuerpo?» (nivel 3)
//
// Los bancos, las explicaciones y los `idError` están en logica.js; los textos, en
// textos.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { montarElegir, montarTocar, TXO } from '../_comun/ortografia.js';
import { etiquetaNivel } from '../_comun/nivel.js';
import { TX } from './textos.js';
import {
  MAYUSCULAS, PUNTO_COMA, DOS_PUNTOS, BANCO_CORREOS, esAsuntoCuerpo,
  generarMayusculas, generarPuntoComa, generarDosPuntos, generarCorreos,
  piezasMayusculas, buenasMayusculas, explicacionMayusculas, idErrorMayusculas,
  explicacionElegir, idErrorElegir,
} from './logica.js';

function montarMayusculas(contenedor, item, api) {
  const frase = MAYUSCULAS[item.i];
  montarTocar(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    instruccion: TX.mayusculas.instruccion,
    piezas: piezasMayusculas(frase),
    buenas: buenasMayusculas(frase),
    multiple: true,
    explicacion: tocadas => explicacionMayusculas(frase, tocadas),
    idError: tocadas => idErrorMayusculas(frase, tocadas),
    espera: 4200,
  });
}

/** «¿Cuál está bien escrita?» sobre un banco: las opciones vienen barajadas en el ítem. */
const montarEscrita = (banco, instruccion) => (contenedor, item, api) => {
  const ficha = banco[item.i];
  montarElegir(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    instruccion,
    opciones: item.opciones,
    buena: 0,
    explicacion: k => explicacionElegir(ficha, k),
    idError: k => idErrorElegir(ficha, k),
    espera: 5000,
  });
};

function montarCorreo(contenedor, item, api) {
  const ficha = BANCO_CORREOS[item.i];
  if (!esAsuntoCuerpo(ficha)) return montarEscrita(BANCO_CORREOS, TX.correos.instruccion)(contenedor, item, api);
  montarElegir(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    instruccion: TX.correos.instruccionAsunto,
    pregunta: `<p class="sentido">${api.esc(ficha.texto)}</p>`,
    opciones: item.opciones,
    buena: ficha.donde,
    explicacion: k => explicacionElegir(ficha, k),
    idError: k => idErrorElegir(ficha, k),
    espera: 4500,
  });
}

const clave = item => String(item.i);

arrancar({
  slug: 'ortografia-puntuacion',
  idioma: 'es',
  ejercicios: [
    { nombre: TX.mayusculas.nombre, detalle: TX.mayusculas.detalle, introduccion: TX.mayusculas.introduccion, generar: generarMayusculas, clave, montar: montarMayusculas },
    { nombre: TX.puntoComa.nombre, detalle: TX.puntoComa.detalle, introduccion: TX.puntoComa.introduccion, generar: generarPuntoComa, clave, montar: montarEscrita(PUNTO_COMA, TXO.escrita) },
    { nombre: TX.dosPuntos.nombre, detalle: TX.dosPuntos.detalle, introduccion: TX.dosPuntos.introduccion, generar: generarDosPuntos, clave, montar: montarEscrita(DOS_PUNTOS, TXO.escrita) },
    { nombre: TX.correos.nombre, detalle: TX.correos.detalle, introduccion: TX.correos.introduccion, generar: generarCorreos, clave, montar: montarCorreo },
  ],
});
