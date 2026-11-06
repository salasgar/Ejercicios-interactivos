// Ortografía: las tildes (id 64; tarea 135, 2026-11-06). Cuatro ejercicios, de más fácil
// a más difícil, cada uno con tres niveles (../_comun/nivel.js) y las piezas de
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.
//
//   1. La sílaba tónica (aguda, llana, esdrújula): dos pasos.
//   2. ¿Lleva tilde? (reglas generales): tocar la sílaba o «Ninguna».
//   3. Diptongos e hiatos: tocar la letra o «Ninguna»; en el nivel 3, también aún / aun.
//   4. Las palabras de Matemáticas: hueco con la palabra con y sin tilde.
//
// Los bancos, el motor `acentuar` y las explicaciones, en logica.js.

import { arrancar } from '../_comun/base.js';
import { etiquetaNivel } from '../_comun/nivel.js';
import { montarHueco, montarTocar, montarDosPasos } from '../_comun/ortografia.js';
import { TX } from './textos.js';
import {
  TONICA, TILDE, VOCALES_BANCO, MATES,
  generarTonica, generarTilde, generarVocales, generarMates,
  clasesDe, nombreClase, llevaTilde, letraConTilde,
  explicacionTonica1, explicacionTonica2, explicacionTilde, explicacionVocales, explicacionAun, explicacionMates,
  idErrorTonica1, idErrorTonica2, idErrorTilde, idErrorVocales, idErrorAun, idErrorMates,
} from './logica.js';

// --- 1. La sílaba tónica ------------------------------------------------------------

function montarTonica(contenedor, item, api) {
  const it = TONICA[item.i];
  const marcada = it.silabas.map((s, i) => (i === it.tonica ? `<b>${api.esc(s.toUpperCase())}</b>` : api.esc(s))).join('-');
  montarDosPasos(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    paso1: {
      instruccion: TX.tonica.paso1,
      piezas: it.silabas,
      buenas: [it.tonica],
      unidas: true,
      explicacion: () => explicacionTonica1(it),
      idError: idErrorTonica1,
    },
    paso2: {
      instruccion: TX.tonica.paso2,
      pregunta: `<p class="oracion">${marcada}</p>`,
      opciones: clasesDe(it).map(k => ({ k, texto: nombreClase(k) })),
      buena: it.clase,
      explicacion: () => explicacionTonica2(it),
      idError: k => idErrorTonica2(k, it),
    },
  });
}

const enunciadoTonica = item => `<p class="instruccion">${TX.tonica.paso1}</p><p class="oracion">${TONICA[item.i].silabas.join('-')}</p>`;

// --- 2. ¿Lleva tilde? ---------------------------------------------------------------

function montarTilde(contenedor, item, api) {
  const it = TILDE[item.i];
  montarTocar(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    instruccion: TX.tilde.instruccion,
    piezas: it.silabas,
    buenas: llevaTilde(it) ? [it.tonica] : [],
    ninguna: true,
    unidas: true,
    explicacion: () => explicacionTilde(it),
    idError: tocadas => idErrorTilde(it, tocadas),
  });
}

const enunciadoTilde = item => `<p class="instruccion">${TX.tilde.instruccion}</p><p class="oracion">${TILDE[item.i].silabas.join('-')}</p>`;

// --- 3. Diptongos e hiatos ----------------------------------------------------------

function montarVocales(contenedor, item, api) {
  const it = VOCALES_BANCO[item.i];
  const etiqueta = etiquetaNivel(item.nivel, api.esc);
  if (it.tipo === 'aun') {
    const orden = item.orden === 1 ? [it.otra, it.buena] : [it.buena, it.otra];
    return montarHueco(contenedor, api, {
      etiqueta,
      instruccion: TX.vocales.hueco,
      antes: it.antes,
      despues: it.despues,
      opciones: orden,
      buena: it.buena,
      explicacion: () => explicacionAun(it),
      idError: () => idErrorAun(it),
    });
  }
  const buena = letraConTilde(it);
  montarTocar(contenedor, api, {
    etiqueta,
    instruccion: TX.vocales.instruccion,
    piezas: [...it.palabra],
    buenas: buena === null ? [] : [buena],
    ninguna: true,
    unidas: true,
    explicacion: () => explicacionVocales(it),
    idError: tocadas => idErrorVocales(it, tocadas),
  });
}

const enunciadoVocales = item => {
  const it = VOCALES_BANCO[item.i];
  return it.tipo === 'aun'
    ? `<p class="instruccion">${TX.vocales.hueco}</p><p class="oracion">${it.antes}…${it.despues}</p>`
    : `<p class="instruccion">${TX.vocales.instruccion}</p><p class="oracion">${it.palabra}</p>`;
};

// --- 4. Las palabras de Matemáticas ---------------------------------------------------

function montarMates(contenedor, item, api) {
  const it = MATES[item.i];
  const orden = item.orden === 1 ? [it.mala, it.escrita] : [it.escrita, it.mala];
  montarHueco(contenedor, api, {
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    antes: it.antes,
    despues: it.despues,
    opciones: orden,
    buena: it.escrita,
    explicacion: () => explicacionMates(it),
    idError: () => idErrorMates(it),
  });
}

const enunciadoMates = item => `<p class="instruccion">¿Qué palabra va en el hueco?</p><p class="oracion">${MATES[item.i].antes}…${MATES[item.i].despues}</p>`;

arrancar({
  slug: 'ortografia-tildes',
  idioma: 'es',
  ejercicios: [
    { nombre: TX.tonica.nombre, detalle: TX.tonica.detalle, introduccion: TX.tonica.introduccion, generar: generarTonica, clave: item => String(item.i), montar: montarTonica, enunciado: enunciadoTonica },
    { nombre: TX.tilde.nombre, detalle: TX.tilde.detalle, introduccion: TX.tilde.introduccion, generar: generarTilde, clave: item => String(item.i), montar: montarTilde, enunciado: enunciadoTilde },
    { nombre: TX.vocales.nombre, detalle: TX.vocales.detalle, introduccion: TX.vocales.introduccion, generar: generarVocales, clave: item => String(item.i), montar: montarVocales, enunciado: enunciadoVocales },
    { nombre: TX.mates.nombre, detalle: TX.mates.detalle, introduccion: TX.mates.introduccion, generar: generarMates, clave: item => String(item.i), montar: montarMates, enunciado: enunciadoMates },
  ],
});
