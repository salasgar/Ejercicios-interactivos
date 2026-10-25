// Práctica «Las fichas de Pablo» (tarea 97 de PU2): fuerza bruta con definiciones independientes
// de las de la propia práctica (productos, restos y Euclides de `aritmetica.js`), semillas fijas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mcd, mcm } from '../practicas/_comun/aritmetica.js';
import { TX } from '../practicas/fichas-de-pablo/textos.js';
import { fichaHtml, montonHtml, colorTxt, desglose } from '../practicas/fichas-de-pablo/dibujo.js';
import {
  PRIMOS_FICHA, PRIMOS_BASICOS, TOPE_MONTON, TOPE_GRANDE, FACTORES_ANADIR,
  exp, valor, fichas, nFichas, colores, igual, claveMonton, juntar, quitar, comunes, montonMinimo, deNumero, deExps, submontones,
  numeroDivisores, indice, productoFichas,
  generarLee, diagnosticarLee, generarConstruye, diagnosticarConstruye, generarProducto, diagnosticarProducto, diagnosticarAnadir,
  generarQuita, diagnosticarQuita, resto, generarRegla, diagnosticarDivisible, diagnosticarCociente, diagnosticarColorFalta,
  generarDivisores, diagnosticarContar, diagnosticarNinguna, diagnosticarElige, generarMcd, generarMcm, diagnosticarMcd, diagnosticarMcm,
  parejasEn, CASOS_PAREJA,
} from '../practicas/fichas-de-pablo/logica.js';

const N = 3000;
const items = (generar, j, semilla = 7) => { const rng = crearRng(semilla + j); return Array.from({ length: N }, () => generar(rng)); };
const cuota = (lista, pred) => lista.filter(pred).length / lista.length;
const cerca = (lista, pred, objetivo, nombre) => {
  const c = cuota(lista, pred);
  assert.ok(Math.abs(c - objetivo) <= 0.05, `${nombre}: ${(c * 100).toFixed(1)} % (se esperaba ${objetivo * 100} % ± 5)`);
};
/** El valor de un montón por su definición: el producto de sus fichas. */
const producto = m => fichas(m).reduce((v, p) => v * p, 1);
/** Cuántos divisores tiene n, contándolos. */
const contarDivisores = n => { let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c; };
const topeExp = p => (p === 2 ? 4 : p > 7 ? 2 : 3);
const todosLosMontones = (maxExp, primos = PRIMOS_FICHA) => {
  let lista = [{}];
  for (const p of primos) lista = lista.flatMap(m => Array.from({ length: maxExp + 1 }, (_, e) => (e ? { ...m, [p]: e } : m)));
  return lista;
};

// --- El montón --------------------------------------------------------------------------------

test('montón: valor, juntar, quitar, comunes y montón mínimo coinciden con la aritmética de siempre', () => {
  const rng = crearRng(1);
  for (let i = 0; i < 2000; i++) {
    const a = deNumero(rng.entero(1, 2000)), b = deNumero(rng.entero(1, 2000));
    if (!a || !b) continue;
    assert.equal(valor(a), producto(a));
    assert.equal(valor(juntar(a, b)), valor(a) * valor(b));
    assert.equal(valor(comunes(a, b)), mcd(valor(a), valor(b)));
    assert.equal(valor(montonMinimo(a, b)), mcm(valor(a), valor(b)));
    assert.equal(valor(quitar(juntar(a, b), b)), valor(a));
  }
  assert.equal(valor({}), 1);
  assert.equal(nFichas({}), 0);
  assert.equal(indice({}), '1');
  assert.equal(indice({ 2: 3, 5: 1 }), '2<sup>3</sup> · 5');
  assert.equal(productoFichas({ 2: 3, 5: 1 }), '2 · 2 · 2 · 5');
  assert.equal(deNumero(17 * 19), null, 'un primo sin ficha');
  assert.equal(deNumero(40) && claveMonton(deNumero(40)), claveMonton({ 2: 3, 5: 1 }));
});

test('montón: el número de divisores sale de los exponentes y se puede contar', () => {
  for (const m of submontones({ 2: 3, 3: 2, 5: 1, 7: 1 })) assert.equal(numeroDivisores(m), contarDivisores(valor(m)));
  assert.equal(submontones({ 2: 2, 7: 1 }).length, 6);
});

test('dibujo: cada ficha lleva su primo escrito y cada color sus dos nombres', () => {
  for (const p of PRIMOS_FICHA) {
    assert.match(fichaHtml(p), new RegExp(`>${p}</span>`));
    assert.match(fichaHtml(p, { boton: true }), new RegExp(`>${p}</button>`));
    assert.match(colorTxt(p, 'es'), /\(.+\)/);
    assert.match(colorTxt(p, 'en'), /\(.+\)/);
  }
  assert.match(montonHtml({}), /ninguna ficha \/ no counters/);
  assert.equal((montonHtml({ 2: 3, 5: 1 }).match(/fp-ficha /g) ?? []).length, 4);
  assert.match(desglose({ 2: 3, 5: 1 }, 'es'), /3 verdes \(green\), 1 amarilla \(yellow\)/);
  assert.match(desglose({ 2: 3, 5: 1 }, 'en'), /3 green \(verdes\), 1 yellow \(amarilla\)/);
  assert.match(desglose({ 11: 2 }, 'es'), /2 blancas del 11/);
});

// --- Ejercicio 1 --------------------------------------------------------------------------------

test('ejercicio 1: cotas, 8 % sin fichas y 10 % con ficha blanca; el diagnóstico reconoce cada error', () => {
  const lista = items(generarLee, 1);
  for (const { m } of lista) {
    assert.equal(valor(m), producto(m));
    assert.ok(valor(m) <= TOPE_MONTON && nFichas(m) <= 5);
    assert.ok(colores(m).length <= 3);
    for (const p of colores(m)) assert.ok(PRIMOS_FICHA.includes(p) && exp(m, p) <= topeExp(p));
  }
  cerca(lista, it => nFichas(it.m) === 0, 0.08, 'sin fichas');
  const conBlanca = cuota(lista, it => colores(it.m).some(p => p > 7));
  assert.ok(conBlanca >= 0.08 && conBlanca <= 0.15, `blancas ${conBlanca}`);
  for (const it of lista.slice(0, 800)) {
    assert.equal(diagnosticarLee(it, valor(it.m)).acierto, true);
    const d = diagnosticarLee(it, producto(it.m) + 1);
    assert.equal(d.acierto, false);
    assert.ok(d.error);
  }
  // Los errores con nombre.
  assert.equal(diagnosticarLee({ m: {} }, 0).error, 'ninguna-es-cero');
  assert.equal(diagnosticarLee({ m: { 2: 3, 5: 1 } }, 30).error, 'exponente-como-producto');   // 2 · 3 · 5
  assert.equal(diagnosticarLee({ m: { 2: 1, 3: 1, 7: 1 } }, 12).error, 'suma-de-fichas');
  assert.equal(diagnosticarLee({ m: { 2: 3, 5: 1 } }, 4).error, 'numero-de-fichas');
});

// --- Ejercicio 2 --------------------------------------------------------------------------------

test('ejercicio 2: números de 4 a 500, de 1 a 4 colores; un solo montón es correcto', () => {
  const lista = items(generarConstruye, 2);
  for (const { m } of lista) {
    assert.ok(valor(m) >= 4 && valor(m) <= 500, `valor ${valor(m)}`);
    assert.ok(colores(m).length >= 1 && colores(m).length <= 4);
    for (const p of colores(m)) assert.ok(exp(m, p) <= 4);
  }
  const conBlanca = cuota(lista, it => colores(it.m).some(p => p > 7));
  assert.ok(conBlanca >= 0.08 && conBlanca <= 0.15, `blancas ${conBlanca}`);
  // Todo montón posible: solo el de la factorización acierta, y ninguno falla sin nombre.
  for (const it of lista.slice(0, 40)) {
    for (const st of todosLosMontones(4, PRIMOS_BASICOS)) {
      const d = diagnosticarConstruye(it, st);
      assert.equal(d.acierto, valor(st) === valor(it.m), `${indice(st)} para ${valor(it.m)}`);
      if (!d.acierto) assert.ok(d.error);
    }
  }
  // 8 con una verde y una azul: el exponente leído como un producto.
  assert.equal(diagnosticarConstruye({ m: { 2: 3 } }, { 2: 1, 3: 1 }).error, 'potencia-como-producto');
  assert.equal(diagnosticarConstruye({ m: { 2: 3, 3: 1 } }, { 2: 2, 3: 1 }).error, 'faltan-fichas');
  assert.equal(diagnosticarConstruye({ m: { 2: 3, 3: 1 } }, { 2: 3, 3: 2 }).error, 'sobran-fichas');
});

// --- Ejercicio 3 --------------------------------------------------------------------------------

test('ejercicio 3: producto ≤ 100 000 con algún color común; un 25 % pregunta qué fichas se añaden', () => {
  const lista = items(generarProducto, 3);
  cerca(lista, it => it.tipo === 'anadir', 0.25, 'añadir');
  for (const it of lista.filter(x => x.tipo === 'construir')) {
    assert.ok(valor(it.a) <= TOPE_MONTON && valor(it.b) <= TOPE_MONTON);
    assert.ok(valor(juntar(it.a, it.b)) <= TOPE_GRANDE);
    assert.equal(valor(juntar(it.a, it.b)), valor(it.a) * valor(it.b));
    assert.ok(colores(it.a).some(p => exp(it.b, p) > 0), 'comparten un color');
    for (const p of PRIMOS_FICHA) assert.ok(exp(juntar(it.a, it.b), p) <= 6);
    assert.ok(!igual(juntar(it.a, it.b), montonMinimo(it.a, it.b)), 'el producto no es el m.c.m.');
    assert.ok(!igual(juntar(it.a, it.b), comunes(it.a, it.b)), 'ni el m.c.d.');
  }
  for (const it of lista.filter(x => x.tipo === 'construir').slice(0, 30)) {
    for (const st of todosLosMontones(6, PRIMOS_BASICOS).filter((_, i) => i % 7 === 0)) {
      const d = diagnosticarProducto(it, st);
      assert.equal(d.acierto, valor(st) === valor(it.a) * valor(it.b));
      if (!d.acierto) assert.ok(d.error);
    }
  }
  // Los errores con nombre, calculados con el ítem.
  const a = { 2: 3, 5: 1 }, b = { 2: 1, 5: 1, 7: 2 };
  assert.equal(diagnosticarProducto({ a, b }, montonMinimo(a, b)).error, 'monton-mayor');
  assert.equal(diagnosticarProducto({ a, b }, comunes(a, b)).error, 'solo-comunes');
  assert.equal(diagnosticarProducto({ a: { 2: 3 }, b: { 2: 1, 7: 1 } }, deNumero(8 + 14)).error, 'suma-en-vez-de-producto');
});

test('ejercicio 3 (añadir): cuatro opciones distintas, una sola buena, cada mala de un error con nombre', () => {
  const lista = items(generarProducto, 3).filter(x => x.tipo === 'anadir');
  assert.ok(lista.length > 500);
  const vistos = new Set();
  for (const it of lista) {
    assert.ok(FACTORES_ANADIR.includes(it.k));
    assert.ok(valor(it.a) <= 500);
    assert.equal(it.opciones.length, 4);
    assert.equal(new Set(it.opciones.map(claveMonton)).size, 4, 'ningún par de opciones es el mismo montón');
    assert.equal(valor(it.opciones[it.buena]), it.k);
    it.opciones.forEach((m, i) => {
      if (i === it.buena) { assert.equal(it.errores[i], null); return; }
      assert.notEqual(valor(m), it.k, 'un distractor distinto del bueno');
      assert.match(it.errores[i], /^(una-de-mas|una-de-menos|otro-color)$/);
      vistos.add(it.errores[i]);
      assert.equal(diagnosticarAnadir(it, i).error, it.errores[i]);
    });
    assert.equal(diagnosticarAnadir(it, it.buena).acierto, true);
  }
  assert.equal(vistos.size, 3, 'salen los tres errores');
});

// --- Ejercicio 4 --------------------------------------------------------------------------------

test('ejercicio 4: un 70 % divide; en el resto falta justo un color; d no es 1 ni a', () => {
  const lista = items(generarQuita, 4);
  cerca(lista, it => it.divide, 0.7, 'divide');
  for (const it of lista) {
    assert.ok(valor(it.a) <= TOPE_MONTON && colores(it.a).length >= 2 && colores(it.a).length <= 4);
    assert.ok(nFichas(it.d) >= 1 && nFichas(it.d) <= 3, 'de 1 a 3 fichas');
    assert.notEqual(valor(it.d), 1);
    assert.notEqual(valor(it.d), valor(it.a));
    assert.equal(it.divide, valor(it.a) % valor(it.d) === 0, 'divide ⇔ el resto es 0');
    if (it.divide) assert.equal(valor(resto(it)) * valor(it.d), valor(it.a));
    else {
      const faltan = PRIMOS_FICHA.filter(p => exp(it.d, p) > exp(it.a, p));
      assert.deepEqual(faltan, [it.falta], 'falta un solo color');
    }
  }
  for (const it of lista.slice(0, 200)) {
    if (it.divide) {
      for (const q of submontones(it.a)) {
        const d = diagnosticarQuita(it, { tipo: 'quita', q });
        assert.equal(d.acierto, igual(q, it.d));
        if (!d.acierto) assert.match(d.error, /^(quita-de-mas|quita-de-menos|color-equivocado)$/);
      }
      assert.equal(diagnosticarQuita(it, { tipo: 'atasca', color: null }).error, 'se-atasca-sin-motivo');
    } else {
      assert.equal(diagnosticarQuita(it, { tipo: 'quita', q: { 2: 1 } }).error, 'divide-lo-indivisible');
      for (const p of colores(it.d)) assert.equal(diagnosticarQuita(it, { tipo: 'atasca', color: p }).acierto, p === it.falta);
    }
  }
});

// --- Ejercicio 5 --------------------------------------------------------------------------------

test('ejercicio 5: mitad divisibles; entre las que no, a mayor que d y fichas de sobra en más del 40 %', () => {
  const lista = items(generarRegla, 5);
  cerca(lista, it => it.divisible, 0.5, 'divisibles');
  for (const it of lista) {
    assert.ok(valor(it.a) <= TOPE_MONTON);
    assert.equal(it.divisible, valor(it.a) % valor(it.d) === 0);
    if (it.divisible) {
      assert.equal(it.opciones.length, 4);
      assert.equal(new Set(it.opciones.map(claveMonton)).size, 4, 'ninguna opción repetida');
      assert.equal(valor(it.opciones[it.buena]), valor(it.a) / valor(it.d));
      it.opciones.forEach((m, i) => {
        if (i === it.buena) return;
        assert.notEqual(valor(m), valor(it.a) / valor(it.d));
        assert.match(it.errores[i], /^(cociente-con-el-menor|cociente-sin-quitar|exponente-mal)$/);
      });
    } else {
      assert.ok(colores(it.d).length >= 2);
      assert.deepEqual(PRIMOS_FICHA.filter(p => exp(it.d, p) > exp(it.a, p)), [it.falta]);
    }
  }
  const no = lista.filter(it => !it.divisible);
  assert.ok(cuota(no, it => valor(it.a) > valor(it.d)) >= 0.4, 'a mayor que d');
  assert.ok(cuota(no, it => it.sobra) >= 0.4, 'sobran fichas de otros colores');
  assert.ok(no.some(it => it.ausente), 'a veces el color falta del todo');
  for (const it of lista.slice(0, 400)) {
    assert.equal(diagnosticarDivisible(it, it.divisible ? 'si' : 'no').acierto, true);
    const mal = diagnosticarDivisible(it, it.divisible ? 'no' : 'si');
    assert.equal(mal.acierto, false);
    assert.match(mal.error, /^(cree-que-no-se-puede|mayor-es-divisible|ninguna-ficha-de-ese-color|mira-solo-un-color)$/);
    if (it.divisible) {
      it.opciones.forEach((_, i) => assert.equal(diagnosticarCociente(it, i).acierto, i === it.buena));
    } else {
      for (const p of colores(it.d)) assert.equal(diagnosticarColorFalta(it, p).acierto, p === it.falta);
    }
  }
});

// --- Ejercicio 6 --------------------------------------------------------------------------------

test('ejercicio 6: como mucho 12 divisores; contar, elegir (un 10 % el 1) y «ninguna ficha»', () => {
  const lista = items(generarDivisores, 6);
  for (const it of lista) {
    assert.ok(colores(it.a).length >= 2 && colores(it.a).length <= 3);
    assert.ok(valor(it.a) <= TOPE_MONTON);
    assert.ok(numeroDivisores(it.a) <= 12);
    assert.equal(numeroDivisores(it.a), contarDivisores(valor(it.a)), 'el número de divisores, contado');
    if (it.tipo === 'elegir') assert.equal(valor(it.a) % valor(it.d), 0);
  }
  cerca(lista, it => it.tipo === 'contar', 0.45, 'contar');
  cerca(lista, it => it.tipo === 'elegir', 0.45, 'elegir');
  cerca(lista, it => it.tipo === 'ninguna', 0.1, 'ninguna');
  cerca(lista.filter(it => it.tipo === 'elegir'), it => nFichas(it.d) === 0, 0.1, 'd = 1');
  for (const it of lista.filter(x => x.tipo === 'contar').slice(0, 500)) {
    const n = contarDivisores(valor(it.a));
    assert.equal(diagnosticarContar(it, n).acierto, true);
    assert.equal(diagnosticarContar(it, n + 100).acierto, false);
  }
  // La elección de fichas se compara por número de fichas de cada color, no por posición.
  const it = { tipo: 'elegir', a: { 2: 2, 3: 1 }, d: { 2: 1, 3: 1 } };
  assert.equal(diagnosticarElige(it, deExps([1, 1])).acierto, true);
  assert.equal(diagnosticarElige(it, deExps([2, 0])).error, 'eleccion-mal');
  // Errores con nombre.
  const a = { 2: 2, 3: 1, 5: 1 };   // 3 · 2 · 2 = 12
  assert.equal(diagnosticarContar({ a }, 2).error, 'sin-el-mas-uno');           // 2 · 1 · 1
  assert.equal(diagnosticarContar({ a }, 4).error, 'numero-de-fichas');         // 2 + 1 + 1
  assert.equal(diagnosticarContar({ a }, 7).error, 'suma-de-los-mas-uno');      // 3 + 2 + 2
  assert.equal(diagnosticarNinguna(1).acierto, true);
  assert.equal(diagnosticarNinguna(0).error, 'ninguna-es-cero');
});

// --- Ejercicios 7 y 8 ---------------------------------------------------------------------------

function pareja(generar, j) {
  const lista = items(generar, j);
  for (const it of lista) {
    for (const m of [it.a, it.b]) {
      assert.ok(valor(m) <= TOPE_MONTON && colores(m).length >= 1 && colores(m).length <= 3);
      for (const p of colores(m)) assert.ok(PRIMOS_BASICOS.includes(p) && exp(m, p) <= topeExp(p), 'solo 2, 3, 5 y 7');
    }
    assert.ok(!igual(it.a, it.b));
    assert.ok(CASOS_PAREJA.includes(it.caso));
  }
  cerca(lista, it => it.caso === 'normal', 0.55, 'normal');
  cerca(lista, it => it.caso === 'sin-comunes', 0.15, 'sin comunes');
  cerca(lista, it => it.caso === 'divide', 0.15, 'uno divide al otro');
  cerca(lista, it => it.caso === 'exclusivo', 0.15, 'color exclusivo');
  for (const it of lista) {
    const g = mcd(valor(it.a), valor(it.b));
    if (it.caso === 'sin-comunes') assert.equal(g, 1);
    else assert.ok(g > 1);
    if (it.caso === 'divide') assert.equal(valor(it.b) % valor(it.a), 0);
    else {
      assert.notEqual(g, valor(it.a), 'a no divide a b');
      assert.notEqual(g, valor(it.b));
    }
    if (it.caso === 'exclusivo') assert.ok(PRIMOS_BASICOS.some(p => (exp(it.a, p) > 0) !== (exp(it.b, p) > 0)));
  }
  return lista;
}

test('ejercicio 7: reparto de casos, m.c.d. por exponentes igual al de Euclides y diagnóstico de cualquier marca', () => {
  const lista = pareja(generarMcd, 7);
  for (const it of lista) assert.equal(valor(comunes(it.a, it.b)), mcd(valor(it.a), valor(it.b)));
  for (const it of lista.slice(0, 600)) {
    const g = mcd(valor(it.a), valor(it.b));
    for (const sel of submontones(it.a)) {
      const d = diagnosticarMcd(it, { tipo: 'marca', sel });
      assert.equal(d.acierto, valor(sel) === g && nFichas(sel) === nFichas(comunes(it.a, it.b)));
      if (!d.acierto) assert.match(d.error, /^(incluye-no-comunes|coge-el-mayor|olvida-pareja|parejas-mal)$/);
      // Las parejas que se dibujan en b nunca son más que las fichas marcadas ni que las de b.
      const par = parejasEn(it.b, sel);
      assert.ok(nFichas(par) <= nFichas(sel) && nFichas(par) <= nFichas(it.b));
    }
    if (it.caso === 'sin-comunes') {
      assert.equal(diagnosticarMcd(it, { tipo: 'ninguna', mcd: 1 }).acierto, true);
      assert.equal(diagnosticarMcd(it, { tipo: 'ninguna', mcd: 0 }).error, 'mcd-cero');
    } else {
      assert.equal(diagnosticarMcd(it, { tipo: 'ninguna', mcd: 1 }).error, 'olvida-pareja');
    }
  }
  // Los errores con nombre, con 120 y 75.
  const a = { 2: 3, 3: 1, 5: 1 }, b = { 3: 1, 5: 2 };
  assert.equal(diagnosticarMcd({ a, b }, { tipo: 'marca', sel: { 3: 1, 5: 1 } }).acierto, true);
  assert.equal(diagnosticarMcd({ a, b }, { tipo: 'marca', sel: { 2: 1, 3: 1, 5: 1 } }).error, 'incluye-no-comunes');
  assert.equal(diagnosticarMcd({ a: { 2: 1, 5: 2 }, b: { 5: 1 } }, { tipo: 'marca', sel: { 5: 2 } }).error, 'coge-el-mayor');
  assert.equal(diagnosticarMcd({ a, b }, { tipo: 'marca', sel: { 3: 1 } }).error, 'olvida-pareja');
});

test('ejercicio 8: reparto de casos, m.c.m. ≤ 100 000 igual al de Euclides y diagnóstico de cualquier montón', () => {
  const lista = pareja(generarMcm, 8);
  for (const it of lista) {
    assert.ok(valor(montonMinimo(it.a, it.b)) <= TOPE_GRANDE);
    assert.equal(valor(montonMinimo(it.a, it.b)), mcm(valor(it.a), valor(it.b)));
  }
  for (const it of lista.slice(0, 40)) {
    const l = mcm(valor(it.a), valor(it.b));
    for (const st of todosLosMontones(5, PRIMOS_BASICOS).filter((_, i) => i % 3 === 0)) {
      const d = diagnosticarMcm(it, st);
      assert.equal(d.acierto, valor(st) === l);
      if (!d.acierto) assert.ok(d.error);
    }
  }
  // Los errores con nombre, con 120 y 75.
  const a = { 2: 3, 3: 1, 5: 1 }, b = { 3: 1, 5: 2 };
  assert.equal(diagnosticarMcm({ a, b }, { 3: 1, 5: 1 }).error, 'solo-comunes');
  assert.equal(diagnosticarMcm({ a, b }, juntar(a, b)).error, 'junta-todo');
  assert.equal(diagnosticarMcm({ a, b }, { 2: 3, 3: 1, 5: 1 }).error, 'menor-exponente');
  assert.equal(diagnosticarMcm({ a, b }, { 3: 1, 5: 2 }).error, 'falta-color');
  assert.equal(diagnosticarMcm({ a, b }, { 2: 3, 3: 1, 5: 3 }).error, 'fichas-mal');
});

// --- Textos ---------------------------------------------------------------------------------------

test('textos: ningún texto de alumno con ×, con «factor» entre números ni con HCF; los exponentes con <sup>', () => {
  const lee = items(generarLee, 1).slice(0, 60), con = items(generarConstruye, 2).slice(0, 60), pr = items(generarProducto, 3).slice(0, 80);
  const qu = items(generarQuita, 4).slice(0, 80), re = items(generarRegla, 5).slice(0, 80), di = items(generarDivisores, 6).slice(0, 80);
  const m7 = items(generarMcd, 7).slice(0, 60), m8 = items(generarMcm, 8).slice(0, 60);
  const textos = [];
  const todos = (obj, args) => { for (const idioma of ['es', 'en']) textos.push(String(obj[idioma](...args))); };
  for (const ej of Object.values(TX)) for (const v of Object.values(ej)) if (v?.es && typeof v.es === 'string') textos.push(v.es, v.en);
  for (const { m } of lee) { todos(TX.lee.buena, [m]); for (const e of ['exponente-como-producto', 'suma-de-fichas', 'numero-de-fichas', 'ninguna-es-cero']) todos(TX.lee.nota, [e, m]); }
  for (const { m } of con) {
    todos(TX.construye.buena, [m]); todos(TX.construye.instruccion, [valor(m)]); todos(TX.construye.tuyas, [{ 2: 1 }, valor(m)]);
    for (const e of ['potencia-como-producto', 'faltan-fichas', 'sobran-fichas', 'monton-equivocado']) todos(TX.construye.nota, [e, m, 3]);
  }
  for (const it of pr) {
    if (it.tipo === 'anadir') { todos(TX.producto.instruccionAnadir, [valor(it.a), it.k]); todos(TX.producto.buenaAnadir, [it.a, it.k]); continue; }
    todos(TX.producto.buena, [it.a, it.b]); todos(TX.producto.instruccion, [valor(it.a), valor(it.b)]);
    for (const e of ['monton-mayor', 'solo-comunes', 'suma-en-vez-de-producto', 'fichas-mal']) todos(TX.producto.nota, [e, it.a, it.b, 2]);
  }
  for (const it of qu) {
    todos(TX.quita.instruccion, [it.a, it.d]);
    if (it.divide) todos(TX.quita.buena, [it.a, it.d]); else todos(TX.quita.buenaNo, [it.a, it.d, it.falta]);
    for (const e of ['se-atasca-sin-motivo', 'quita-de-mas', 'quita-de-menos', 'divide-lo-indivisible', 'color-equivocado']) todos(TX.quita.nota, [e, it.a, it.d, colores(it.d)[0]]);
  }
  for (const it of re) {
    todos(TX.regla.pregunta, [it.a, it.d]);
    if (it.divisible) { todos(TX.regla.buena, [it.a, it.d]); todos(TX.regla.pideCociente, [it.a, it.d]); for (const e of ['cociente-con-el-menor', 'cociente-sin-quitar', 'exponente-mal']) todos(TX.regla.notaCociente, [e, it.a, it.d]); }
    else { todos(TX.regla.buenaNo, [it.a, it.d, it.falta]); for (const e of ['mayor-es-divisible', 'mira-solo-un-color', 'ninguna-ficha-de-ese-color']) todos(TX.regla.nota, [e, it.a, it.d, it.falta]); }
    todos(TX.regla.nota, ['cree-que-no-se-puede', it.a, it.d, colores(it.d)[0]]);
  }
  for (const it of di) {
    if (it.tipo === 'contar') { todos(TX.divisores.contar, [it.a]); todos(TX.divisores.buenaContar, [it.a]); }
    if (it.tipo === 'ninguna') todos(TX.divisores.ninguna, [it.a]);
    if (it.tipo === 'elegir') { todos(TX.divisores.elegir, [it.a, it.d]); todos(TX.divisores.buenaElegir, [it.d]); todos(TX.divisores.tuyas, [{ 2: 1 }, it.d]); }
    for (const e of ['sin-el-mas-uno', 'numero-de-fichas', 'suma-de-los-mas-uno', 'ninguna-es-cero']) todos(TX.divisores.nota, [e, it.a]);
  }
  for (const it of m7) {
    todos(TX.mcd.instruccion, [it.a, it.b]); todos(TX.mcd.buena, [it.a, it.b]);
    for (const e of ['incluye-no-comunes', 'coge-el-mayor', 'olvida-pareja', 'mcd-cero', 'parejas-mal']) todos(TX.mcd.nota, [e, it.a, it.b, colores(it.a)[0]]);
  }
  for (const it of m8) {
    todos(TX.mcm.instruccion, [it.a, it.b]); todos(TX.mcm.buena, [it.a, it.b]);
    for (const e of ['solo-comunes', 'junta-todo', 'menor-exponente', 'falta-color', 'fichas-mal']) todos(TX.mcm.nota, [e, it.a, it.b, colores(it.a)[0]]);
  }
  assert.ok(textos.length > 2000);
  for (const t of textos) {
    assert.ok(!t.includes('×'), `× en: ${t}`);
    assert.ok(!/undefined|NaN|\[object/.test(t), `texto roto: ${t}`);
    assert.ok(!/\bHCF\b|\bGCF\b/.test(t), `HCF en: ${t}`);
    // «factor» solo en «factor primo» / «prime factor» (y «factorización»/«factorisation»).
    for (const m of t.matchAll(/\bfactor(?:es|s)?\b/gi)) {
      const antes = t.slice(Math.max(0, m.index - 6), m.index), despues = t.slice(m.index + m[0].length, m.index + m[0].length + 8);
      assert.ok(/prime $/i.test(antes) || /^ primos?/i.test(despues), `«factor» entre números en: ${t}`);
    }
    assert.ok(!/<sup>[^<]*<\/sup>[^ ,.;:)<·]*\^/.test(t), `exponente con ^ en: ${t}`);
  }
  // Los colores, siempre en los dos idiomas: cada nombre de color lleva la traducción entre paréntesis
  // un poco más allá («verde (green)», «2 blancas del 11 (white)»), salvo que ya sea la traducción.
  const COLOR = /\b(verdes?|azul(?:es)?|amarill[oa]s?|roj[oa]s?|blancos?|blancas?|green|blue|yellow|red|white)\b/gi;
  for (const t of textos) {
    const sinTags = t.replace(/<[^>]+>/g, '');
    for (const m of sinTags.matchAll(COLOR)) {
      if (sinTags[m.index - 1] === '(') continue;   // es la traducción
      assert.ok(/^[^()]{0,14}\(/.test(sinTags.slice(m.index + m[0].length)), `color sin traducir (${m[0]}) en: ${sinTags}`);
    }
  }
});
