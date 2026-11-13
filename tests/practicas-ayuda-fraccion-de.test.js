// «No lo sé» en `fraccion-de` (revisión del 13-11, tarea 190): cada explicación lleva la solución del ítem
// calculada aquí con `fracciones.js` y `logica.js` (no copiada de la explicación), en los dos idiomas, y vigila
// lo que se corrigió en la revisión: la unidad en lo que se pide (ej. 2), el m.c.d. en la regla (ej. 3), y en el
// ej. 4 la regla de cada variante delante, «La respuesta es …» con su unidad al final y el consejo bien elegido.
// `tests/practicas-no-lo-se.test.js` ya comprueba que la tarjeta reutiliza el paso a paso del feedback.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion, htmlFraccion } from '../practicas/_comun/fracciones.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import * as L from '../practicas/fraccion-de/logica.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const cuenta = c => `<span class="cuenta">${c}</span>`;
const N = 1200;
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'fraccion-de'));
const [ej1, ej2, ej3, ej4] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

/** Lo que vale cualquier tarjeta: sin restos, fracciones con raya, sin «×» y sin mayúscula tras «:». */
function sana(html, donde) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\d\s*\/\s*\d/, `fracción con barra — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), / · [A-ZÁÉÍÓÚÑ]/, `«·» separando frases — ${donde}: ${plano(html)}`);
}

test('fraccion-de · ejercicios 1 y 2: dividir, multiplicar y «La respuesta es …» con el resultado (y su unidad)', () => {
  for (const [def, semilla] of [[ej1, 11], [ej2, 12]]) {
    for (const idioma of IDIOMAS) for (const item of items(def, semilla)) {
      const html = def.explicacion(item, textosDe(idioma));
      sana(html, `calculo ${idioma}`);
      const r = fraccion(item.n, item.d).multiplicar(item.total);
      assert.ok(r.esEntera(), 'la cantidad es múltiplo del denominador');
      assert.equal(r.aEntero(), item.resultado);
      const unidad = item.ctx ? ` ${L.CONTEXTOS[item.ctx].unidad[idioma]}` : '';
      const fin = idioma === 'es' ? 'La respuesta es' : 'The answer is';
      assert.ok(html.includes(`${fin} ${cuenta(`${item.resultado}${unidad}`)}.`), `la respuesta: ${plano(html)}`);
      assert.ok(html.includes(`${item.total} : ${item.d} = ${item.total / item.d}`), 'primero se divide');
      if (item.n > 1) assert.ok(html.includes(`${item.total / item.d} · ${item.n} = ${item.resultado}`), 'después se multiplica');
      // Con contexto, lo que se pide lleva su unidad: «5/6 de 84 litros».
      if (item.ctx) assert.ok(html.includes(`${idioma === 'es' ? 'de' : 'of'} ${item.total}${unidad}.`), `qué se pide, con unidad: ${plano(html)}`);
      else assert.ok(!/^(Hay que|You have to)/.test(plano(html)), 'sin contexto no hay «qué se pide»');
    }
  }
});

test('fraccion-de · ejercicio 3: la regla dice el m.c.d. y la tarjeta acaba en la irreducible', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej3, 13)) {
    const html = ej3.explicacion(item, textosDe(idioma));
    sana(html, `parte ${idioma}`);
    const g = mcd(item.parte, item.total);
    const buena = fraccion(item.parte / g, item.total / g);
    assert.ok(buena.esIrreducible());
    assert.ok(buena.equals(L.respuestaParte(item)), 'es la que da por buena el ejercicio');
    assert.equal(L.errorDeParte(item, buena), null);
    assert.ok(html.startsWith(idioma === 'es' ? 'Arriba se escribe la parte y abajo, el total. Después se dividen los dos entre su m.c.d.' : 'Write the part on top and the whole at the bottom. Then divide both by their GCD'), `la regla delante: ${plano(html)}`);
    const fin = idioma === 'es' ? 'La respuesta es' : 'The answer is';
    assert.ok(html.endsWith(`${fin} ${cuenta(htmlFraccion(buena))}.`), `acaba en la respuesta: ${plano(html)}`);
    if (g > 1) assert.ok(html.includes(` ${g}: ${item.parte} : ${g} = ${item.parte / g}`), `divide entre el m.c.d. (${g}): ${plano(html)}`);
    if (item.tipo === 'partes') assert.ok(html.includes(`${item.parte} + ${item.otra} = ${item.total}`), 'el total se suma');
  }
});

const REGLAS = {
  es: {
    queda: 'Se calcula la parte del enunciado y se resta del total.',
    dos: 'Se calcula cada parte y se restan las dos del total.',
    parte: 'Se halla lo que vale una parte y se multiplica por el denominador.',
    restante: 'Se mira qué fracción falta, se halla lo que vale una parte y se multiplica por el denominador.',
  },
  en: {
    queda: 'Work out the part in the problem and subtract it from the whole.',
    dos: 'Work out each part and subtract both from the whole.',
    parte: 'Find what one part is worth and multiply by the denominator.',
    restante: 'See what fraction is missing, find what one part is worth and multiply by the denominator.',
  },
};

/** La respuesta del ejercicio 4, calculada aquí con las fracciones del ítem. */
function respuesta4(item) {
  const T = item.total;
  const de = f => fraccion(f.n, f.d).multiplicar(T).aEntero();
  if (item.variante === 'queda') return T - de(item.f1);
  if (item.variante === 'dos') return T - de(item.f1) - de(item.f2);
  // 'parte' y 'restante': el dato son unas partes; el total se reconstruye y tiene que cuadrar.
  const m = item.variante === 'parte' ? item.f1.n : item.f1.d - item.f1.n;
  assert.equal((item.dato / m) * item.f1.d, T, 'el dato cuadra con el total');
  return T;
}

test('fraccion-de · ejercicio 4: la regla de su variante delante, la respuesta con unidad al final y un consejo que vale', () => {
  const vistas = new Set();
  for (const idioma of IDIOMAS) for (const item of items(ej4, 14)) {
    vistas.add(item.variante);
    const html = ej4.explicacion(item, textosDe(idioma));
    sana(html, `problema ${idioma}`);
    const v = respuesta4(item);
    const buena = item.opciones.find(o => o.error === null);
    assert.equal(buena.tipo, 'cantidad');
    assert.equal(buena.v, v, 'la respuesta es la opción buena');
    assert.ok(html.startsWith(REGLAS[idioma][item.variante]), `la regla delante: ${plano(html)}`);
    const unidad = L.ESCENARIOS[item.variante][item.esc].unidad[idioma];
    const fin = `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${cuenta(`${v} ${unidad}`)}.`;
    if (item.variante === 'dos') {
      assert.ok(html.endsWith(fin), `acaba en la respuesta: ${plano(html)}`);
      assert.doesNotMatch(html, /Consejo|Tip/, 'en «dos» la regla ya dice cómo se hace');
    } else {
      const consejo = idioma === 'es' ? ` Consejo: dibújalo como una barra de ${item.f1.d} partes iguales.` : ` Tip: draw it as a bar of ${item.f1.d} equal parts.`;
      assert.ok(html.endsWith(`${fin}${consejo}`), `la respuesta y el consejo, al final: ${plano(html)}`);
    }
    assert.equal((plano(html).match(/Consejo|Tip/g) || []).length <= 1, true, 'como mucho un consejo');
  }
  assert.deepEqual([...vistas].sort(), ['dos', 'parte', 'queda', 'restante']);
});
