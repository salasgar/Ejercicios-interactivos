// «No lo sé» en `equivalentes` (tarea 171): la explicación lleva la solución del ítem, calculada
// con la lógica de la práctica. 1200 ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import { mcm } from '../practicas/_comun/aritmetica.js';
import * as L from '../practicas/equivalentes/logica.js';
import * as X from '../practicas/equivalentes/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, tt: o => o[idioma], esc: x => x });
const h = (num, den) => htmlFraccion({ num, den }, { compacta: true });
const hf = f => h(f.num, f.den);
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const generar = (fn, semilla, n = 1200) => {
  const rng = crearRng(semilla);
  return Array.from({ length: n }, () => fn(rng));
};

test('equivalentes · ejercicio 1: la explicación lleva el número del hueco', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarTermino, 201)) {
      const html = X.explicaTermino(item, ctx(idioma));
      assert.equal(L.errorTermino(item, item.respuesta), null, 'es lo que el ejercicio da por bueno');
      assert.ok(html.endsWith(`<span class="cuenta">${item.respuesta}</span>.`), 'termina con la solución');
      assert.ok(plano(html).includes(` ${item.k} `), 'el factor');
      // Revisión 190: decía «el otro término» sin decir cuál, y no hacía la cuenta del hueco como un paso.
      const conocido = item.hueco === 'num' ? 'den' : 'num';
      const op = item.direccion === 'ampliar' ? '·' : ':';
      const [de, a] = [item.izq[conocido], item.der[conocido]];
      assert.equal(item.direccion === 'ampliar' ? de * item.k : de / item.k, a);
      assert.ok(html.includes(`${de} ${op} ${item.k} = ${a}`), 'la cuenta del término conocido');
      assert.ok(html.includes(`${item.izq[item.hueco]} ${op} ${item.k} = ${item.respuesta}`), 'la cuenta del hueco');
      const p = plano(html);
      assert.ok(!/otro término|other term/.test(p));
      assert.ok(p.includes(idioma === 'es' ? (conocido === 'num' ? 'Arriba se pasa' : 'Abajo se pasa') : (conocido === 'num' ? 'On top,' : 'At the bottom,')), 'dice qué término se conoce');
    }
  }
});

test('equivalentes · ejercicio 2: la explicación dice Sí/No según los productos cruzados', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarSonEquivalentes, 202)) {
      const html = X.explicaSonEquivalentes(item, ctx(idioma));
      const [x, y] = L.cruzados(item);
      assert.equal(x === y, item.equivalentes);
      assert.ok(html.includes(`= ${x}<`) && html.includes(`= ${y}<`), 'los dos productos');
      const resp = item.equivalentes ? (idioma === 'es' ? 'Sí' : 'Yes') : 'No';
      assert.ok(html.endsWith(`<strong>${resp}</strong>.`));
      // Revisión 190: la regla iba como un paso de la lista y no decía qué se multiplica con qué.
      assert.ok(html.startsWith(idioma === 'es' ? 'Multiplica en cruz, el numerador de cada una por el denominador de la otra' : 'Cross-multiply, the numerator of each one by the denominator of the other'));
      assert.ok(!html.includes('<ol'), 'la regla no es un paso');
    }
  }
});

test('equivalentes · ejercicio 3: cada caja de la explicación reúne un grupo y su valor irreducible', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarEquipos, 203)) {
      const html = X.explicaEquipos(item, ctx(idioma));
      assert.equal((html.match(/<li>/g) || []).length, item.cajas);
      const r = L.evaluarEquipos(item, Object.fromEntries(item.tarjetas.map(t => [t.id, t.grupo])));
      assert.equal(r.acierto, true, 'el reparto de la explicación es el que el ejercicio da por bueno');
      for (const t of item.tarjetas) assert.ok(html.includes(h(t.num, t.den)), 'todas las tarjetas');
    }
  }
});

test('equivalentes · ejercicio 4: la explicación lleva el m.c.m. y los dos numeradores', () => {
  for (const idioma of IDIOMAS) {
    for (const item of generar(L.generarComun, 204)) {
      const html = X.explicaComun(item, ctx(idioma));
      assert.equal(item.mcm, mcm(item.a.den, item.b.den));
      assert.equal(L.errorMcm(item, item.mcm), null);
      assert.equal(L.errorNumeradores(item, item.ea.num, item.eb.num), null);
      assert.ok(html.includes(h(item.ea.num, item.mcm)) && html.includes(h(item.eb.num, item.mcm)));
      assert.ok(plano(html).includes(`= ${item.mcm}`) || plano(html).includes(`${item.mcm}`));
      // Revisión 190: el m.c.m. salía sin cómo buscarlo («está en las tablas de los dos») y la fracción que ya
      // tenía ese denominador se escribía «· 1» y «7/12 = 7/12».
      const mayor = Math.max(item.a.den, item.b.den), menor = Math.min(item.a.den, item.b.den);
      const p = plano(html);
      if (item.mcm === mayor) assert.ok(p.includes(`${mayor} ${idioma === 'es' ? 'ya es múltiplo de' : 'is already a multiple of'} ${menor}`));
      else {
        const lista = Array.from({ length: item.mcm / mayor }, (_, i) => mayor * (i + 1));
        assert.ok(lista.slice(0, -1).every(m => m % menor !== 0), 'el primero común es el m.c.m.');
        assert.ok(p.includes(lista.join(', ')), 'los múltiplos del mayor, hasta el m.c.m.');
      }
      for (const x of [item.a, item.b]) {
        if (x.den === item.mcm) assert.ok(!html.includes(`${hf(x)} = ${hf(x)}`) && !html.includes('· 1 ='), 'la que ya lo tiene se queda igual');
        else assert.ok(html.includes(`${item.mcm} : ${x.den} = ${item.mcm / x.den}`));
      }
      assert.ok(p.trim().startsWith(idioma === 'es' ? 'Múltiplos de' : 'Multiples of') || p.includes(idioma === 'es' ? 'ya es múltiplo' : 'already a multiple'));
    }
  }
});
