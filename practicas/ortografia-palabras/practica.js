// Ortografía: palabras que se confunden (id 67; tarea 138, 2026-11-06). Tres ejercicios, en
// orden de dificultad, cada uno con tres niveles (../_comun/nivel.js):
//
//   1. ¿Junto o separado?                   una frase con hueco; botones junto / separado
//   2. Suenan igual, se escriben distinto    una frase con hueco; los dos (o tres) homófonos
//   3. Números y símbolos                    una frase con hueco; la buena y una mala, barajadas
//
// Los bancos, las explicaciones y los idError están en logica.js; las piezas, en
// ../_comun/ortografia.js. El contrato, en docs/practicas-ortografia.md, §3.

import { arrancar } from '../_comun/base.js';
import { montarHueco, TXO } from '../_comun/ortografia.js';
import { etiquetaNivel, nivelForzado } from '../_comun/nivel.js';
import { TX } from './textos.js';
import {
  partes, JUNTAS, generarJuntas, explicacionJuntas, ayudaJuntas, idErrorJuntas,
  HOMOFONOS, opcionesHomofono, generarHomofonos, explicacionHomofono, ayudaHomofono, idErrorHomofono,
  NUMEROS_Y_SIMBOLOS, generarNumeros, opcionesNumero, explicacionNumero, ayudaNumero, idErrorNumero,
} from './logica.js';

const enunciado = () => `<p class="instruccion">${TXO.hueco}</p>`;

/** Un ejercicio de hueco: `banco`, su generador y cómo salen las opciones, la explicación y el idError. */
const ejercicioHueco = ({ textos, banco, generar, opciones, explicacion, ayuda, idError }) => ({
  nombre: textos.nombre,
  detalle: textos.detalle,
  introduccion: textos.introduccion,
  generar: (rng, sesion) => generar(rng, sesion, { forzado: nivelForzado() }),
  clave: item => String(item.i),
  enunciado,
  explicacion: item => ayuda(banco[item.i]),
  montar(contenedor, item, api) {
    const it = banco[item.i];
    montarHueco(contenedor, api, {
      ...partes(it.frase),
      opciones: opciones(it, item),
      buena: it.buena,
      explicacion: explicacion(it),
      idError: puso => idError(it, puso),
      etiqueta: etiquetaNivel(item.nivel, api.esc),
    });
  },
});

arrancar({
  slug: 'ortografia-palabras',
  idioma: 'es',
  ejercicios: [
    ejercicioHueco({ textos: TX.juntas, banco: JUNTAS, generar: generarJuntas, opciones: it => it.opciones, explicacion: explicacionJuntas, ayuda: ayudaJuntas, idError: idErrorJuntas }),
    ejercicioHueco({ textos: TX.homofonos, banco: HOMOFONOS, generar: generarHomofonos, opciones: opcionesHomofono, explicacion: explicacionHomofono, ayuda: ayudaHomofono, idError: idErrorHomofono }),
    ejercicioHueco({ textos: TX.numeros, banco: NUMEROS_Y_SIMBOLOS, generar: generarNumeros, opciones: (it, item) => opcionesNumero(it, item.orden), explicacion: explicacionNumero, ayuda: ayudaNumero, idError: idErrorNumero }),
  ],
});
