// «No lo sé» en ortografia-ampliacion (tarea 182): la explicación termina en la forma que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  PORQUES, VERBOS, SIGLAS, AVANZADA, FORMAS, generarPorques, generarVerbos, generarSiglas, generarAvanzada,
  ayudaPorque, ayudaVerbo, ayudaElegir, opcionesVerbo, rellenar, MOTIVOS,
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
    assert.ok(p.includes(`«${rellenar(it.frase, it.buena)}»`), p);
    assert.ok(p.endsWith(`La respuesta es ${it.buena}.`), p);
  });
});

for (const [nombre, generar, banco, semilla] of [['siglas', generarSiglas, SIGLAS, 182023], ['puntuación avanzada', generarAvanzada, AVANZADA, 182024]]) {
  test(`ortografia-ampliacion, ${nombre}: dice qué falla en cada mala y termina en la buena`, () => {
    recorrer(generar, semilla, item => {
      const it = banco[item.i];
      assert.equal(item.opciones.find(o => o.k === 0).texto, it.bien, 'k = 0 es la que el ejercicio da por buena');
      const html = ayudaElegir(it);
      const p = plano(html);
      limpia(html, p);
      assert.ok(p.endsWith(`La respuesta es: ${it.bien}`), p);
      for (const [, id] of it.malas) assert.ok(MOTIVOS[id], `motivo de ${id}`);
      for (const [texto, id] of it.malas) assert.ok(p.includes(MOTIVOS[id]) && p.includes(texto), p);
    });
  });
}
