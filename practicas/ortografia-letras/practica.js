// Ortografía: las letras (id 65; la escribe la tarea 136, 2026-11-06).
// Los cuatro ejercicios, en orden de dificultad, cada uno con tres niveles
// (../_comun/nivel.js) y las piezas de ../_comun/ortografia.js:
//
//   1. hay, ahí, ay; a ver, haber (y, en el nivel 3, a/ha, e/he, echo/hecho, habría/abría)
//   2. b o v
//   3. g o j, y la diéresis
//   4. Otras letras (ll/y, m/n, r/rr, c/z/qu, d/z, cc, x/s)
//
// Los bancos, las reglas y las explicaciones están en logica.js; los textos, en textos.js.
// El contrato de la base, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { montarHueco, TXO } from '../_comun/ortografia.js';
import { etiquetaNivel } from '../_comun/nivel.js';
import { TX } from './textos.js';
import {
  HACHES, BV, GJ, OTRAS, generadorDe, partesLetras,
  explicacionHaches, idErrorHaches, explicacionLetras, idErrorLetras,
} from './logica.js';

function montarHaches(contenedor, item, api) {
  const it = HACHES[item.i];
  const [antes, despues] = it.texto.split('_');
  montarHueco(contenedor, api, {
    antes, despues, opciones: item.orden, buena: it.buena, instruccion: TXO.hueco,
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    explicacion: () => explicacionHaches(it),
    idError: puesta => idErrorHaches(it, puesta),
    espera: 3200,
  });
}

const montarLetras = banco => (contenedor, item, api) => {
  const it = banco[item.i];
  const { antes, despues } = partesLetras(it);
  montarHueco(contenedor, api, {
    antes, despues, opciones: item.orden, buena: it.buena,
    instruccion: it.opciones.some(o => o.length > 1) ? TX.letras : TX.letra,
    etiqueta: etiquetaNivel(item.nivel, api.esc),
    explicacion: () => explicacionLetras(it),
    idError: puesta => idErrorLetras(it, puesta),
    espera: 3200,
  });
};

const ejercicio = (tx, banco, montar) => ({
  nombre: tx.nombre,
  detalle: tx.detalle,
  introduccion: tx.introduccion,
  generar: generadorDe(banco),
  clave: item => String(item.i),
  montar,
});

arrancar({
  slug: 'ortografia-letras',
  idioma: 'es',
  ejercicios: [
    ejercicio(TX.haches, HACHES, montarHaches),
    ejercicio(TX.bv, BV, montarLetras(BV)),
    ejercicio(TX.gj, GJ, montarLetras(GJ)),
    ejercicio(TX.otras, OTRAS, montarLetras(OTRAS)),
  ],
});
