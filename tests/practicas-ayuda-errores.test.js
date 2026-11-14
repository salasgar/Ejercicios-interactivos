// «No lo sé» en «Caza el error» (tarea 186): la explicación de cada ejercicio lleva la solución del ítem,
// calculada con la lógica de la práctica (no copiada de la explicación), en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import { generarHay, generarLinea, generarNombre } from '../practicas/errores/logica.js';
import { explicaItem, NOMBRES, PLANTILLAS, PLANTILLA_POR_ID, html } from '../practicas/errores/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc });
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;

function comun(item, idioma, h) {
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, plano(h));
  assert.ok(plano(h).length > 30, 'demasiado corta');
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  if (!item.error) {
    assert.ok(/Está bien|It is right/.test(h), `sin error: «${plano(h)}»`);
    assert.ok(h.includes(html(plantilla.porque(item.params)[idioma])), 'lleva el porqué de la plantilla');
  } else {
    const n = item.error.linea + 1;
    assert.ok(h.includes(idioma === 'es' ? `en la línea ${n}.` : `in line ${n}.`), `lleva la línea ${n}: ${plano(h)}`);
    assert.ok(h.includes(html(item.lineas[item.error.linea][idioma])), 'cita la línea que está mal');
    assert.ok(h.includes(html(plantilla.corregida(item.params)[idioma])), 'lleva la cuenta bien hecha');
    assert.ok(h.includes(esc(NOMBRES[item.error.nombre][idioma])), 'lleva el nombre del error');
  }
}

for (const [nombre, generador, semilla] of [['hay', generarHay, 1861], ['linea', generarLinea, 1862], ['nombre', generarNombre, 1863]]) {
  test(`errores, ejercicio «${nombre}»: la explicación lleva la solución del ítem (${N} ítems, es y en)`, () => {
    const rng = crearRng(semilla);
    let conError = 0;
    for (let i = 0; i < N; i++) {
      const item = generador(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] });
      if (item.error) conError++;
      const es = explicaItem(item, textosDe('es')), en = explicaItem(item, textosDe('en'));
      comun(item, 'es', es);
      comun(item, 'en', en);
      assert.notEqual(es, en);
      if (nombre === 'linea') assert.equal(item.solucion, item.error.linea, 'la solución es la línea del error');
      if (nombre === 'nombre') assert.equal(item.solucion, item.error.nombre);
    }
    if (nombre === 'hay') assert.ok(conError > N * 0.4 && conError < N * 0.6, 'sale de los dos tipos');
  });
}

test('errores: todas las plantillas dan explicación en los dos idiomas', () => {
  assert.ok(PLANTILLAS.length >= 28);
  const rng = crearRng(1864);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 50; i++) {
      const params = p.numeros(rng);
      const item = { plantilla: p.id, params, lineas: p.lineas(params), error: p.error };
      for (const idioma of IDIOMAS) comun(item, idioma, explicaItem(item, textosDe(idioma)));
    }
  }
});
