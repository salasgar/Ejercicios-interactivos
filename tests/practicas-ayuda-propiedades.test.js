// «No lo sé» en `propiedades` (tarea 189): la explicación termina en la solución del ítem, calculada con la lógica.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/propiedades/logica.js';
import * as X from '../practicas/propiedades/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const plano = html => html.replace(/<sup>/g, '^').replace(/<\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1500) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const RESP = { es: 'La respuesta es', en: 'The answer is' };

test('propiedades · ejercicio 1: la explicación termina en los términos que quedan al juntar', () => {
  for (const idioma of IDIOMAS) for (const item of generar(rng => L.generarJuntar(rng, { aciertos: 5 }), 1)) {
    const t = plano(X.explicaJuntar(item, ctx(idioma)));
    const { terminos, ops } = L.resolver(item.terminos, item.operadores);
    const final = terminos.map((q, i) => (i ? `${idioma === 'en' && ops[i - 1] === ':' ? '÷' : ops[i - 1]} ` : '') + `${q.base}^${q.exp}`).join(' ');
    assert.ok(t.includes(`${RESP[idioma]} ${final}.`), `${final} :: ${t}`);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('propiedades · ejercicio 2: la explicación lleva la potencia solución', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarPotencias, 2)) {
    const t = plano(X.explicaPotencias(item, ctx(idioma)));
    assert.ok(t.includes(`${RESP[idioma]} ${item.base}^${item.solucion}.`), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});

test('propiedades · ejercicio 3: la explicación lleva la última cifra, calculada aparte', () => {
  for (const idioma of IDIOMAS) for (const item of generar(L.generarUltima, 3)) {
    const t = plano(X.explicaUltima(item, ctx(idioma)));
    const cifra = Number(BigInt(item.base) ** BigInt(item.exponente) % 10n);
    assert.equal(item.solucion, cifra);
    assert.ok(new RegExp(`${item.base}\\^${item.exponente} (acaba en|ends in) ${cifra}\\.$`).test(t), t);
    assert.ok(!/undefined|NaN/.test(t), t);
  }
});
