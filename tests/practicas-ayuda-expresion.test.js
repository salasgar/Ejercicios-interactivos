// «No lo sé» en `expresion` (tarea 188): la explicación lleva la expresión que da por buena el ejercicio.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/expresion/logica.js';
import { TX } from '../practicas/expresion/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => { const rng = crearRng(semilla); return Array.from({ length: n }, (_, i) => fn(rng, { aciertos: i % 12, fallos: 0, puntos: 0, vidas: 5, anterior: null })); };

const ejercicios = [['generarSin', 1], ['generarCon', 2], ['generarPotencias', 3]];
const SIN_TODO = new Set(['frase_mas_por', 'frase_menos_por', 'frase_mas_entre']);

for (const [nombre, semilla] of ejercicios) {
  test(`expresion · ${nombre}: la explicación lleva la expresión buena y su valor`, () => {
    let elegidos = 0, sinTodo = 0;
    for (const idioma of IDIOMAS) for (const item of generar(L[nombre], semilla)) {
      const html = L.explicaExpresion(item, ctx(idioma));
      const texto = plano(html);
      const modelo = plano(L.cuenta(L.aFichas(item.modelo), L.evaluar(item.modelo), idioma));
      assert.ok(texto.includes(modelo), `${modelo} en ${texto}`);
      assert.ok(!/undefined|NaN|\[object/.test(texto), texto);
      if (SIN_TODO.has(item.plantilla)) {
        // Revisión 193: «La frase no dice «todo», así que no hay paréntesis» no vale siempre; la tarjeta usa la jerarquía.
        assert.ok(!/no dice «todo»|does not say “all”/.test(texto), texto);
        assert.ok(texto.includes(idioma === 'es' ? `Solo el ${item.numeros.b} va ` : `Only ${item.numeros.b} is `), texto);
        assert.ok(texto.includes(idioma === 'es' ? 'no hace falta paréntesis' : 'you do not need brackets'), texto);
        sinTodo++;
      } else assert.ok(texto.includes(plano(L.plantillaPorId(item.plantilla).explica[idioma](item.numeros).replace(/:$/, ''))));
      if (item.tipo === 'elegir') elegidos++;
    }
    if (nombre === 'generarPotencias') assert.ok(elegidos > 0, 'hay ítems de elegir');
    else assert.equal(elegidos, 0);
    if (nombre === 'generarSin') assert.ok(sinTodo > 0, 'salen las frases sin «todo»');
  });
}

test('expresion: la explicación es distinta en cada idioma y TX tiene los dos', () => {
  const [item] = generar(L.generarSin, 9, 1);
  assert.notEqual(L.explicaExpresion(item, ctx('es')), L.explicaExpresion(item, ctx('en')));
  assert.ok(TX.la_expresion_es.es && TX.la_expresion_es.en);
});
