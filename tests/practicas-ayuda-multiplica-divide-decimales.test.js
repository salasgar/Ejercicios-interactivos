// «No lo sé» en multiplica-divide-decimales: cada explicación lleva la solución del ítem, calculada
// aquí con las funciones de la lógica y de decimales.js (no copiada de la explicación).

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto, deTexto, sumar, multiplicar, porPotenciaDe10, comparar } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/multiplica-divide-decimales/logica.js';
import * as X from '../practicas/multiplica-divide-decimales/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const items = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, (_, i) => fn(rng, { aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: IDIOMAS[i % 2] }));
};
const FINAL = { es: 'La respuesta es', en: 'The answer is' };

/**
 * La explicación acaba con «La respuesta es <strong>X</strong>.» y X es lo que se calcula aquí. Además (revisión
 * de la tarea 190), nada de «1 cifras», «1 decimal places», «0 cifras decimales» ni «….».
 */
function comprobar(html, idioma, esperado, que) {
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.doesNotMatch(plano(html), /\b1 cifras|\b1 decimal places|\b0 cifras|\b0 decimal places|…\./, `${que}: ${plano(html)}`);
  const m = html.match(new RegExp(`${FINAL[idioma]} <strong>(.*?)</strong>\\.$`));
  assert.ok(m, `${que}: no acaba con la respuesta — ${plano(html)}`);
  assert.equal(m[1], esperado, `${que}: ${plano(html)}`);
}
const OPCION = { es: t => `«${t}»`, en: t => `“${t}”` };
const conDos = (d, idioma) => aTexto(L.D(d).conCifras(2), idioma);

test('ej. 1: la explicación acaba con el resultado, calculado con enteros escalados', () => {
  for (const item of items(L.generarComa, 1)) {
    const buena = item.forma === 'producto'
      ? multiplicar(L.D(item.a), L.D(item.b))
      : porPotenciaDe10(L.D(item.d), item.op === 'por' ? -item.p : item.p);
    for (const idioma of IDIOMAS) {
      const html = X.explicaComa(item, ctx(idioma));
      comprobar(html, idioma, aTexto(buena.normalizar(), idioma), `ej1 ${idioma}`);
      if (item.forma === 'producto') {
        // El producto sin comas que da el enunciado sale en la tarjeta, y el recuento de cifras es el bueno.
        assert.ok(html.includes(`${item.a.m} · ${item.b.m} = ${item.a.m * item.b.m}`), `ej1 ${idioma}: falta el producto sin comas — ${plano(html)}`);
        const k = L.D(item.a).k + L.D(item.b).k;
        assert.ok(plano(html).includes(idioma === 'es' ? `en total, ${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}` : `${k} decimal ${k === 1 ? 'place' : 'places'} in total`), `ej1 ${idioma}: ${plano(html)}`);
      } else {
        // La regla es la del ítem: «por 0,01» → izquierda, «entre 0,01» → derecha, y nombra la potencia de 10 que toca.
        const izq = item.op === 'por';
        assert.match(plano(html), idioma === 'es' ? (izq ? /a la izquierda/ : /a la derecha/) : (izq ? /to the left/ : /to the right/), `ej1 ${idioma}: ${plano(html)}`);
        assert.ok(plano(html).includes(String(10 ** item.p)), `ej1 ${idioma}: falta ${10 ** item.p} — ${plano(html)}`);
      }
    }
  }
});

test('ej. 2: la explicación acaba con el cociente exacto (cociente · divisor = dividendo)', () => {
  for (const item of items(L.generarEntre, 2)) {
    assert.equal(comparar(multiplicar(L.D(item.cociente), L.D({ m: item.divisor, k: 0 })), L.D(item.dividendo)), 0);
    for (const idioma of IDIOMAS) comprobar(X.explicaEntre(item, ctx(idioma)), idioma, aTexto(L.D(item.cociente).normalizar(), idioma), `ej2 ${idioma}`);
  }
});

test('ej. 2: la división larga, paso a paso, cuadra y sus cifras dan el cociente; la coma, solo si hay decimales', () => {
  const PASO = /<li>(.*?)<\/li>/g;
  const CUENTA = /<span class="cuenta">(\d+) : (\d+) = (\d+)<\/span>(?:, (?:sobran (\d+)|(\d+) left over))?/;
  for (const item of items(L.generarEntre, 22)) {
    for (const idioma of IDIOMAS) {
      const html = X.explicaEntre(item, ctx(idioma));
      assert.doesNotMatch(html, /debajo de la del dividendo|under the one of the dividend/, `ej2 ${idioma}: ${plano(html)}`);
      const pasos = [...html.matchAll(PASO)].map(m => m[1]);
      assert.ok(pasos.length >= 2, `ej2 ${idioma}: sin pasos — ${plano(html)}`);
      let entero = null, decimales = '', resto = 0;
      pasos.forEach((p, i) => {
        const m = p.match(CUENTA);
        assert.ok(m, `ej2 ${idioma}: paso sin cuenta — ${p}`);
        const [parcial, divisor, cifra] = [Number(m[1]), Number(m[2]), Number(m[3])], r = Number(m[4] ?? m[5] ?? 0);
        assert.equal(divisor, item.divisor);
        assert.equal(parcial, cifra * divisor + r, `ej2 ${idioma}: ${p}`);
        assert.ok(r < divisor, `ej2 ${idioma}: resto ${r} — ${p}`);
        if (i === 0) entero = cifra;
        else {
          assert.ok(cifra <= 9, `ej2 ${idioma}: cifra ${cifra} — ${p}`);
          assert.ok(parcial >= resto * 10 && parcial <= resto * 10 + 9, `ej2 ${idioma}: no baja bien — ${p}`);
          decimales += cifra;
        }
        resto = r;
        if (i === 1) assert.match(p, idioma === 'es' ? /^Se pone la coma en el cociente/ : /^Put the decimal point in the quotient/, `ej2 ${idioma}: ${p}`);
      });
      assert.equal(resto, 0, `ej2 ${idioma}: el último resto no es 0 — ${plano(html)}`);
      const q = { m: entero * 10 ** decimales.length + Number(decimales || 0), k: decimales.length };
      assert.equal(comparar(L.D(q), L.D(item.cociente)), 0, `ej2 ${idioma}: los pasos dan ${aTexto(L.D(q), idioma)} — ${plano(html)}`);
    }
  }
});

test('ej. 3: la explicación acaba con el cociente o con la división sin coma en el divisor', () => {
  for (const item of items(L.generarDecimal, 3)) {
    assert.equal(comparar(multiplicar(L.D(item.cociente), L.D(item.divisor)), L.D(item.dividendo)), 0);
    const s = L.D(item.divisor).k;
    for (const idioma of IDIOMAS) {
      const esperado = item.tipo === 'equivalente'
        ? `${aTexto(porPotenciaDe10(L.D(item.dividendo), s).normalizar(), idioma)} : ${aTexto(porPotenciaDe10(L.D(item.divisor), s).normalizar(), idioma)}`
        : aTexto(L.D(item.cociente).normalizar(), idioma);
      comprobar(X.explicaDecimal(item, ctx(idioma)), idioma, esperado, `ej3 ${item.tipo} ${idioma}`);
    }
  }
});

test('ej. 4: la explicación dice «está bien» solo cuando la prueba cuadra', () => {
  for (const item of items(L.generarEstaBien, 4)) {
    const cuadraMostrado = L.cuadra(item.a, item.b, item.mostrado.cociente, item.mostrado.resto);
    assert.equal(cuadraMostrado, item.estaBien);
    for (const idioma of IDIOMAS) {
      const html = X.explicaEstaBien(item, ctx(idioma));
      // La respuesta es la opción tal como sale en el botón, entre comillas.
      comprobar(html, idioma, OPCION[idioma](cuadraMostrado ? X.TX.ej4.estaBien[idioma] : X.TX.ej4.estaMal[idioma]), `ej4 ${idioma}`);
      // Las pruebas que enseña son verdad: divisor · cociente + resto = lo que dice.
      const pruebas = [...plano(html).matchAll(/([\d.,]+) · ([\d.,]+) \+ ([\d.,]+) = ([\d.,]+)/g)];
      assert.equal(pruebas.length, cuadraMostrado ? 1 : 2, `ej4 ${idioma}: ${plano(html)}`);
      for (const [, b, q, r, total] of pruebas) {
        const d = t => deTexto(t);
        assert.equal(comparar(sumar(multiplicar(d(b), d(q)), d(r)), d(total)), 0, `ej4 ${idioma}: ${b} · ${q} + ${r} ≠ ${total}`);
      }
      if (!cuadraMostrado) {
        // Dice por qué falla y la última prueba es la buena (da el dividendo).
        const razon = { 'resto-sin-deshacer': idioma === 'es' ? 'sin coma' : 'with no point', 'cociente-coma-corrida': idioma === 'es' ? 'coma mal puesta' : 'wrong place', 'cociente-redondeado': idioma === 'es' ? 'redondeado' : 'rounded' }[item.error];
        assert.ok(plano(html).includes(razon), `ej4 ${idioma} ${item.error}: ${plano(html)}`);
        assert.equal(comparar(deTexto(pruebas[1][4]), L.D(item.a)), 0, `ej4 ${idioma}: la prueba buena no da el dividendo`);
      }
    }
  }
});

test('ej. 5: la explicación acaba con la respuesta del problema', () => {
  for (const item of items(L.generarProblema, 5)) {
    const r = aTexto(L.respuestaProblema(item), 'es');
    for (const idioma of IDIOMAS) {
      const html = X.explicaProblema(item, ctx(idioma));
      // El dinero, siempre con sus dos decimales (14,80 €, no 14,8 €).
      const valor = item.tipo === 'litros' ? aTexto(L.respuestaProblema(item), idioma) : conDos(L.respuestaProblema(item), idioma);
      const esperado = item.tipo === 'litros' ? `${valor} L` : (idioma === 'en' ? `€${valor}` : `${valor} €`);
      comprobar(html, idioma, esperado, `ej5 ${item.tipo} ${idioma} (${r})`);
      assert.doesNotMatch(plano(html), /\d[.,]\d €|€\d+[.,]\d(?!\d)|\d[.,]\d euros/, `ej5 ${idioma}: euros con un decimal — ${plano(html)}`);
      if (item.redondeo) {
        // Enseña la cifra siguiente y decide bien si se sube o se deja.
        const m = plano(html).match(idioma === 'es' ? /cifra siguiente, (\d): como es (5 o más|menor que 5)/ : /next digit, (\d): it is (5 or more|less than 5)/);
        assert.ok(m, `ej5 ${idioma}: sin la cifra siguiente — ${plano(html)}`);
        assert.equal(Number(m[1]) >= 5, m[2] === '5 o más' || m[2] === '5 or more');
      }
    }
  }
});

test('ej. 6: la explicación acaba con el resultado de la combinada, por jerarquía', () => {
  for (const item of items(L.generarCombinada, 6)) {
    const buena = L.evaluar(item.expresion);
    for (const idioma of IDIOMAS) {
      const html = X.explicaCombinada(item, ctx(idioma));
      comprobar(html, idioma, aTexto(buena.normalizar(), idioma), `ej6 ${idioma}`);
      // Del paréntesis solo se habla si lo hay; nada de «un paso por línea» (los pasos van en una línea).
      assert.equal(/paréntesis|brackets/.test(html), L.tienParentesis(item.expresion), `ej6 ${idioma}: ${plano(html)}`);
      assert.doesNotMatch(html, /por línea|per line/);
    }
  }
});
