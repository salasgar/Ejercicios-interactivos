// «No lo sé» de leelo5 (tareas 173 y 190): cada explicación lleva la explicación del ítem y su respuesta buena.
// La revisión 190 añadió: la regla de «Léelo» depende de la plantilla (la de «point» era falsa con dinero y
// con las lecturas en español) y no repite la que ya trae el ítem; la respuesta, entre las comillas del
// idioma, o con la coma o el punto del idioma si es un número; y la fracción de «Pasa … a decimal», sin escapar.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import { aTexto, deTexto } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/leelo5/logica.js';
import { explicaPalabra, explicaLeelo, explicaConsigna, explicaCompleta, opcionBuena } from '../practicas/leelo5/ayuda.js';

const IDIOMAS = ['es', 'en'];
const textosDe = (idioma, e = x => x) => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: e });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const ES_NUMERO = /^−?\d+([.,]\d+)?$/;

/** La respuesta que tiene que salir en la tarjeta, calculada aparte. */
function esperada(item, idioma) {
  const o = item.opciones.find(x => x.correcta);
  if (ES_NUMERO.test(o.texto)) return aTexto(deTexto(o.texto), idioma);
  const t = o.html ?? o.texto;
  return idioma === 'en' ? `“${t}”` : `«${t}»`;
}

for (const [nombre, generar, explica, semilla] of [
  ['palabra', L.generarPalabra, explicaPalabra, 1],
  ['leelo', L.generarLeelo, explicaLeelo, 2],
  ['consigna', L.generarConsigna, explicaConsigna, 3],
  ['completa', L.generarCompleta, explicaCompleta, 4],
]) {
  test(`leelo5 · ${nombre}: la explicación lleva la del ítem y la opción buena`, () => {
    const rng = crearRng(semilla);
    for (let i = 0; i < 1000; i++) {
      const idioma = IDIOMAS[i % 2];
      const item = generar(rng, { aciertos: i % 10, idioma });
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      for (const idi of IDIOMAS) {
        const html = explica(item, textosDe(idi));
        assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, plano(html));
        assert.ok(html.includes(item.solucion[idi]), `${nombre} ${idi}: la explicación del ítem`);
        assert.ok(html.endsWith(`${esperada(item, idi)}.</strong></p>`), `${nombre} ${idi}: la respuesta buena, al final: ${plano(html)}`);
        assert.notEqual(explica(item, textosDe('es')), explica(item, textosDe('en')));
        if (idi === 'en') assert.doesNotMatch(html.replace(item.solucion.en, ''), /«|»/, `en inglés, comillas inglesas: ${plano(html)}`);
      }
      // Con el escape de verdad, la fracción de «Pasa … a decimal» sigue siendo HTML.
      if (/<span class="frac/.test(opcionBuena(item))) {
        assert.ok(explica(item, textosDe('es', esc)).includes(opcionBuena(item)), 'la fracción no se escapa');
      }
    }
  });
}

test('leelo5 · leelo: la regla es la de su plantilla y no se repite', () => {
  const rng = crearRng(7);
  const vistas = new Set();
  for (let i = 0; i < 2000; i++) {
    const item = L.generarLeelo(rng, { aciertos: i % 10, idioma: IDIOMAS[i % 2] });
    vistas.add(item.plantilla);
    for (const idi of IDIOMAS) {
      const p = plano(explicaLeelo(item, textosDe(idi)));
      // Con dinero o leyendo en español no se lee «point» cifra a cifra.
      if (item.plantilla === 'leer_dinero' || item.plantilla === 'leer_en_espanol' || item.plantilla === 'cifras_de_palabras_es') {
        assert.doesNotMatch(p, /las cifras una a una|digits one by one/, `${item.plantilla} ${idi}: ${p}`);
      }
      assert.ok((p.match(/una a una|one by one/g) ?? []).length <= 1, `${item.plantilla} ${idi}: regla repetida: ${p}`);
    }
  }
  assert.ok(vistas.has('leer_dinero') && vistas.has('cifras_de_palabras_es') && vistas.has('leer_en_espanol'), [...vistas].join(' '));
});
