// «No lo sé» en ortografia-palabras (tarea 182): la explicación termina en la palabra que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  JUNTAS, HOMOFONOS, NUMEROS_Y_SIMBOLOS, generarJuntas, generarHomofonos, generarNumeros,
  ayudaJuntas, ayudaHomofono, ayudaNumero, opcionesHomofono, opcionesNumero, rellenar, fraseCitada,
} from '../practicas/ortografia-palabras/logica.js';

const N = 1000;
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: i % 10, vidas: 5, anterior: null, idioma: 'es' });

function recorrer(generar, banco, ayuda, semilla, opciones) {
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) {
    const item = generar(rng, sesion(i));
    const it = banco[item.i];
    const html = ayuda(it);
    const p = plano(html);
    assert.doesNotMatch(html, /undefined|NaN|\[object|×/, p);
    assert.doesNotMatch(p, /\bnull\b/, p);
    assert.ok(p.endsWith(`La respuesta es ${it.buena}.`), p);
    assert.ok(p.includes(`«${fraseCitada(rellenar(it.frase, it.buena))}»`), p);
    assert.ok(opciones(it, item).includes(it.buena), 'la buena es una de las opciones');
    // Revisión 192: es una práctica de ortografía; la tarjeta no puede tener ella misma faltas de puntuación.
    assert.doesNotMatch(p, /\.»\./, `punto dentro y fuera de las comillas: ${p}`);
    // («… el saludo. «ola» es…»; empezar párrafo con la palabra citada en negrita, «<b>sino</b>, junto…», sí vale).
    for (const parrafo of html.split('<p>').map(plano)) {
      assert.doesNotMatch(parrafo, /\. «[a-záéíóú]/, `frase en minúscula detrás de punto: ${parrafo}`);
    }
  }
}

test('ortografia-palabras, ¿junto o separado?: la frase con la palabra buena y la respuesta', () => {
  recorrer(generarJuntas, JUNTAS, ayudaJuntas, 182011, it => it.opciones);
});

test('ortografia-palabras, suenan igual: la frase con el homófono bueno y la respuesta', () => {
  recorrer(generarHomofonos, HOMOFONOS, ayudaHomofono, 182012, opcionesHomofono);
});

test('ortografia-palabras, números y símbolos: la frase con la forma buena y la respuesta', () => {
  recorrer(generarNumeros, NUMEROS_Y_SIMBOLOS, ayudaNumero, 182013, (it, item) => opcionesNumero(it, item.orden));
});
