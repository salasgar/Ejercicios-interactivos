// «No lo sé» en ortografia-ampliacion (tarea 182): la explicación termina en la forma que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  PORQUES, VERBOS, SIGLAS, AVANZADA, FORMAS, generarPorques, generarVerbos, generarSiglas, generarAvanzada,
  ayudaPorque, ayudaVerbo, ayudaElegir, opcionesVerbo, rellenar, MOTIVOS, REGLA_ELEGIR, fraseCitada,
} from '../practicas/ortografia-ampliacion/logica.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });
const limpia = (html, p) => {
  assert.doesNotMatch(html, /undefined|NaN|\[object|×/, p);
  assert.doesNotMatch(p, /\bnull\b/, p);
};

function recorrer(generar, semilla, comprobar) {
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) comprobar(generar(rng, sesion(i)));
}

test('ortografia-ampliacion, porque / por qué: termina en la forma buena, que es una de las cuatro', () => {
  recorrer(generarPorques, 182021, item => {
    const it = PORQUES[item.i];
    const html = ayudaPorque(it);
    const p = plano(html);
    limpia(html, p);
    assert.ok(FORMAS.includes(it.buena));
    assert.ok(p.endsWith(`La respuesta es ${it.buena}.`), p);
  });
});

test('ortografia-ampliacion, formas verbales: la frase con la forma buena y la respuesta', () => {
  recorrer(generarVerbos, 182022, item => {
    const it = VERBOS[item.i];
    const html = ayudaVerbo(it);
    const p = plano(html);
    limpia(html, p);
    assert.ok(opcionesVerbo(it, item.orden).includes(it.buena));
    assert.ok(p.includes(`«${fraseCitada(rellenar(it.frase, it.buena))}»`), p);
    // Revisión 192: el punto va detrás de las comillas y no se duplica (lo que enseña el ejercicio 4).
    assert.doesNotMatch(p, /\.»\./, p);
    assert.ok(p.endsWith(`La respuesta es ${it.buena}.`), p);
  });
});

test('ortografia-ampliacion, porque / por qué: el consejo nombra también el «por» que pide el verbo', () => {
  for (const it of PORQUES) assert.match(plano(ayudaPorque(it)), /lleva un «por» que pide el verbo/);
});

for (const [nombre, generar, banco, semilla] of [['siglas', generarSiglas, SIGLAS, 182023], ['puntuación avanzada', generarAvanzada, AVANZADA, 182024]]) {
  test(`ortografia-ampliacion, ${nombre}: da la regla de cada confusión, sin repetirla, y termina en la buena`, () => {
    recorrer(generar, semilla, item => {
      const it = banco[item.i];
      assert.equal(item.opciones.find(o => o.k === 0).texto, it.bien, 'k = 0 es la que el ejercicio da por buena');
      const html = ayudaElegir(it);
      const p = plano(html);
      limpia(html, p);
      assert.ok(p.endsWith(`La respuesta es ${it.bien}`), p);
      assert.doesNotMatch(p, /respuesta es:/, 'sin dos puntos entre el verbo y el atributo');
      for (const [, id] of it.malas) assert.ok(MOTIVOS[id], `motivo de ${id}`);
      for (const [, id] of it.malas) {
        const regla = REGLA_ELEGIR[id];
        assert.ok(regla, `regla de ${id}`);
        // Revisión 192: la misma regla una sola vez (las ONGs / las ONG's la repetían).
        assert.equal(p.split(regla).length - 1, 1, p);
      }
      // Las malas no se copian enteras en la tarjeta: solo se enseña escrita la buena.
      const antesDeLaRespuesta = p.slice(0, p.lastIndexOf('La respuesta es '));
      for (const [texto] of it.malas) assert.ok(!antesDeLaRespuesta.includes(texto), p);
    });
  });
}

test('ortografia-ampliacion: cada confusión de los ejercicios 3 y 4 tiene su regla, en una frase con mayúscula y punto', () => {
  assert.deepEqual(Object.keys(REGLA_ELEGIR).sort(), Object.keys(MOTIVOS).sort());
  for (const [id, regla] of Object.entries(REGLA_ELEGIR)) assert.match(regla, /^[A-ZÁÉÍÓÚ].*\.$/, id);
});
