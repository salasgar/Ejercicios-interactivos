// «No lo sé» en `multiplica-divide` (revisión del 13-11, tarea 190): cada explicación lleva la solución del
// ítem calculada aquí con `fracciones.js` (no copiada de la explicación), en los dos idiomas, y vigila lo que se
// corrigió: la regla va delante (antes «Si se puede, el resultado se simplifica» iba al final), la tarjeta dice
// entre qué número se simplifica (el m.c.d. de los términos de la cuenta) y acaba en «La respuesta es …» (en la
// inversa, las dos respuestas). `tests/practicas-no-lo-se.test.js` ya comprueba que reutiliza el feedback.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion, htmlFraccion } from '../practicas/_comun/fracciones.js';
import { mcd } from '../practicas/_comun/aritmetica.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { declaracionDe } from '../practicas/_comun/base.js';
import * as L from '../practicas/multiplica-divide/logica.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const F = ([n, d]) => fraccion(n, d);
const N = 1200;
const practica = await declaracionDe(CATALOGO.find(f => f.slug === 'multiplica-divide'));
const [ej1, ej2, ej3, ej4, ej5] = practica.ejercicios;
const items = (def, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => def.generar(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};

function sana(html, donde) {
  assert.equal(typeof html, 'string', donde);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\d\s*\/\s*\d/, `fracción con barra — ${donde}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /: [A-ZÁÉÍÓÚÑ]/, `mayúscula tras «:» — ${donde}: ${plano(html)}`);
  // La regla vieja, detrás de la respuesta, no vuelve.
  assert.doesNotMatch(html, /Si se puede, el resultado se simplifica|If you can, simplify the result/, donde);
}

const respuesta = (valor, idioma) => `${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${htmlFraccion(valor)}.`;

/** La cuenta sin simplificar se simplifica entre su m.c.d., y eso da la irreducible; si ya lo es, no se habla de m.c.d. */
function simplificacion(html, bruto, buena, idioma, donde) {
  const n = Math.abs(bruto.num), d = bruto.den, g = mcd(n, d);
  assert.ok(fraccion(Math.sign(bruto.num) * (n / g), d / g).mismaForma(buena), `${donde}: dividir entre el m.c.d. da la irreducible`);
  if (g > 1) {
    const frase = idioma === 'es' ? `entre ${g}, el m.c.d. de ${n} y ${d}.` : `by ${g}, the GCD of ${n} and ${d}.`;
    assert.ok(html.includes(frase), `${donde}: entre qué se simplifica — ${plano(html)}`);
  } else {
    assert.doesNotMatch(html, /m\.c\.d\.|GCD/, `${donde}: ya es irreducible — ${plano(html)}`);
  }
}

test('multiplica-divide · ejercicio 1: la regla delante, el m.c.d. si hay que simplificar y la respuesta al final', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej1, 21)) {
    const html = ej1.explicacion(item, textosDe(idioma));
    sana(html, `multiplica ${idioma}`);
    const bruto = F(item.a).multiplicar(F(item.b)), buena = bruto.simplificar();
    assert.ok(buena.mismaForma(F(item.valor)) && L.errorDeMultiplica(item, buena) === null, 'es la que da por buena el ejercicio');
    assert.ok(html.startsWith(idioma === 'es' ? 'Se multiplica arriba por arriba y abajo por abajo' : 'Multiply top by top and bottom by bottom'));
    assert.ok(html.endsWith(respuesta(buena, idioma)), `acaba en la respuesta: ${plano(html)}`);
    simplificacion(html, bruto, buena, idioma, 'multiplica');
    assert.equal(/fracción con un 1 abajo|fraction with 1 at the bottom/.test(html), item.a[1] === 1 || item.b[1] === 1, 'el natural, solo si lo hay');
  }
});

test('multiplica-divide · ejercicio 2: el producto, el m.c.d. si hay que simplificar y la respuesta al final', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej2, 22)) {
    const html = ej2.explicacion(item, textosDe(idioma));
    sana(html, `parte ${idioma}`);
    const bruto = F(item.a).multiplicar(F(item.c)), buena = bruto.simplificar();
    assert.ok(buena.mismaForma(F(item.valor)) && L.errorDeParte(item, buena) === null);
    assert.ok(html.endsWith(respuesta(buena, idioma)), `acaba en la respuesta: ${plano(html)}`);
    simplificacion(html, bruto, buena, idioma, 'parte');
    // El dibujo cuenta los trozos de verdad: a·c de b·d.
    assert.equal(L.partesDeLaParte(item).y.length, item.a[0] * item.c[0]);
    assert.ok(plano(html).includes(` ${item.a[0] * item.c[0]} `) && plano(html).includes(` ${item.filas * item.columnas}.`), 'los trozos del dibujo');
  }
});

test('multiplica-divide · ejercicio 3: los dos pasos, el natural como fracción con 1 abajo y las dos respuestas', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej3, 23)) {
    const html = ej3.explicacion(item, textosDe(idioma));
    sana(html, `inversa ${idioma}`);
    const f = F(item.f), inversa = fraccion(f.den * Math.sign(f.num), Math.abs(f.num));
    assert.ok(inversa.mismaForma(F(item.valor)), 'es la que da por buena el ejercicio (compara con item.valor)');
    assert.ok(f.multiplicar(inversa).equals(1), 'por su inversa da 1');
    const fin = idioma === 'es' ? `Las respuestas son ${htmlFraccion(inversa)} y 1.` : `The answers are ${htmlFraccion(inversa)} and 1.`;
    assert.ok(html.endsWith(fin), `acaba en las dos respuestas: ${plano(html)}`);
    const conUno = htmlFraccion(f, { conUno: true });
    assert.equal(html.includes(`${htmlFraccion(f)} ${idioma === 'es' ? 'es' : 'is'} ${conUno}.`), item.f[1] === 1, 'el natural se escribe con 1 abajo, solo si lo es');
  }
});

test('multiplica-divide · ejercicio 4: la regla delante, el natural solo si divide, el m.c.d. y la respuesta al final', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej4, 24)) {
    const html = ej4.explicacion(item, textosDe(idioma));
    sana(html, `divide ${idioma}`);
    const b = F(item.b), inversa = fraccion(b.den * Math.sign(b.num), Math.abs(b.num));
    const bruto = F(item.a).multiplicar(inversa), buena = bruto.simplificar();
    assert.ok(buena.mismaForma(F(item.valor)) && L.errorDeDivide(item, buena) === null);
    assert.ok(html.startsWith(idioma === 'es' ? 'Dividir entre una fracción es multiplicar por su inversa' : 'To divide by a fraction, multiply by its reciprocal'));
    assert.ok(html.endsWith(respuesta(buena, idioma)), `acaba en la respuesta: ${plano(html)}`);
    simplificacion(html, bruto, buena, idioma, 'divide');
    assert.equal(/fracción con un 1 abajo|fraction with 1 at the bottom/.test(html), item.b[1] === 1, 'el natural, solo cuando es el divisor');
    assert.equal(/signos|signs/.test(html), item.a[0] < 0 || item.b[0] < 0, 'el signo, solo con una negativa');
  }
});

test('multiplica-divide · ejercicio 5: la potencia ya es irreducible y la tarjeta acaba en la respuesta', () => {
  for (const idioma of IDIOMAS) for (const item of items(ej5, 25)) {
    const html = ej5.explicacion(item, textosDe(idioma));
    sana(html, `potencia ${idioma}`);
    const base = F(item.base);
    const buena = fraccion(base.num ** item.exp, base.den ** item.exp);
    assert.ok(buena.esIrreducible() && buena.mismaForma(F(item.valor)) && L.errorDePotencia(item, buena) === null);
    assert.ok(html.endsWith(respuesta(buena, idioma)), `acaba en la respuesta: ${plano(html)}`);
    assert.ok(plano(html).includes(idioma === 'es' ? `aquí, ${item.exp}.` : `here, ${item.exp}.`));
    assert.doesNotMatch(html, /m\.c\.d\.|GCD/);
  }
});
