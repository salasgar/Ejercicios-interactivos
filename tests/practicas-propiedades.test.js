// Propiedades de las potencias y última cifra (practicas/propiedades/):
// los exponentes y las cifras se comprueban evaluando con BigInt, no con las
// funciones de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarJuntar, generarPotencias, generarUltima, razonNoJunta, exponenteJunto, juntar,
  terminado, resolver, evaluarCadena, ciclo, ultimaCifra, posicionEnCiclo,
  MIN_EXP, MAX_EXP, BASES_ULTIMA, CELDAS,
} from '../practicas/propiedades/logica.js';

const N = 3000;
const B = BigInt;

/** Valor de un término (base^exp)^k con BigInt. */
const valor = t => (B(t.base) ** B(t.exp)) ** B(t.k ?? 1);

/** Valor de la cadena evaluada de izquierda a derecha, con BigInt (la división tiene que ser exacta). */
function valorCadena(terminos, ops) {
  let v = valor(terminos[0]);
  ops.forEach((op, i) => {
    const w = valor(terminos[i + 1]);
    if (op === '·') v *= w;
    else { assert.equal(v % w, 0n, 'cociente no exacto'); v /= w; }
  });
  return v;
}

test('ejercicio 1: lo que queda al juntar todo vale lo mismo que la cadena, por fuerza bruta', () => {
  const rng = crearRng(3301);
  const largos = { 2: 0, 3: 0 };
  let ajenas = 0, cocientes = 0;
  for (let i = 0; i < N; i++) {
    const it = generarJuntar(rng, { aciertos: i % 12 });
    assert.equal(it.tipo, 'juntar');
    const { terminos, operadores } = it;
    assert.equal(operadores.length, terminos.length - 1);
    largos[terminos.length]++;
    // El valor de la cadena (con BigInt) es el de las potencias que quedan, también con BigInt.
    const queda = it.solucion;
    let v = valor({ base: queda[0].base, exp: queda[0].exp });
    const ajena = new Set(terminos.map(t => t.base)).size > 1;
    if (ajena) {
      ajenas++;
      // Con una base distinta la cadena no se reduce a una sola potencia: se comprueba
      // que lo que queda son dos términos y que la ajena sigue ahí.
      assert.equal(queda.length, 2);
      assert.notEqual(queda[0].base, queda[1].base);
      continue;
    }
    assert.equal(queda.length, 1);
    assert.equal(valorCadena(terminos, operadores), v);
    if (operadores.includes(':')) cocientes++;
    // Ningún exponente intermedio ni final sale de [MIN_EXP, MAX_EXP].
    queda.forEach(q => { assert.ok(q.exp >= MIN_EXP && q.exp <= MAX_EXP); });
  }
  assert.ok(largos[2] > 200 && largos[3] > 200, JSON.stringify(largos));
  assert.ok(ajenas > 100, `ajenas: ${ajenas}`);
  assert.ok(cocientes > 300, `cocientes: ${cocientes}`);
});

test('ejercicio 1: cada fusión posible da el exponente que da el valor (BigInt) y nunca hay exponentes negativos', () => {
  const rng = crearRng(3302);
  for (let i = 0; i < N; i++) {
    const { terminos, operadores } = generarJuntar(rng, { aciertos: 10 });
    const recorrer = (t, o) => {
      for (let j = 0; j < t.length - 1; j++) {
        const razon = razonNoJunta(t, o, j);
        if (t[j].base !== t[j + 1].base) { assert.equal(razon, 'bases'); continue; }
        if (j > 0 && o[j - 1] !== '·') { assert.equal(razon, 'orden'); continue; }
        assert.equal(razon, null);
        const e = exponenteJunto(t, o, j);
        assert.ok(e >= 0);
        // Misma operación con BigInt sobre el par.
        const a = valor(t[j]), b = valor(t[j + 1]);
        const par = o[j] === '·' ? a * b : a / b;
        assert.equal(par, B(t[j].base) ** B(e));
        const r = juntar(t, o, j, e);
        assert.equal(r.terminos.length, t.length - 1);
        recorrer(r.terminos, r.ops);
      }
    };
    recorrer(terminos, operadores);
    assert.ok(terminado(...Object.values(resolver(terminos, operadores))));
  }
});

test('ejercicio 1: la trampa de las bases distintas y del orden está presente y bien dicha', () => {
  const t = [{ base: 2, exp: 3, k: 1 }, { base: 3, exp: 2, k: 1 }];
  assert.equal(razonNoJunta(t, ['·'], 0), 'bases');
  const u = [{ base: 2, exp: 5, k: 1 }, { base: 2, exp: 3, k: 1 }, { base: 2, exp: 2, k: 1 }];
  assert.equal(razonNoJunta(u, [':', '·'], 1), 'orden'); // 2⁵ : 2³ · 2² ≠ 2⁵ : 2⁵
  assert.equal(razonNoJunta(u, ['·', ':'], 1), null);    // 2⁵ · 2³ : 2² sí
});

test('ejercicio 2: potencia de potencia y cadenas coinciden con BigInt; sin exponentes negativos', () => {
  const rng = crearRng(3303);
  const tipos = { potencia: 0, cadena: 0 };
  let conPotPot = 0, de4 = 0;
  for (let i = 0; i < N; i++) {
    const it = generarPotencias(rng, { aciertos: i % 14 });
    tipos[it.tipo]++;
    assert.ok(it.solucion >= MIN_EXP && it.solucion <= MAX_EXP + 12, `solución ${it.solucion}`);
    const v = valorCadena(it.terminos, it.operadores);
    assert.equal(v, B(it.base) ** B(it.solucion), JSON.stringify(it));
    if (it.tipo === 'potencia') {
      assert.equal(it.terminos.length, 1);
      assert.ok(it.terminos[0].k >= 2);
    } else {
      evaluarCadena(it.terminos, it.operadores).parciales.forEach(p => { assert.ok(p >= MIN_EXP && p <= MAX_EXP); });
      if (it.terminos.some(t => t.k > 1)) conPotPot++;
      if (it.terminos.length === 4) de4++;
    }
  }
  assert.ok(tipos.potencia > 400 && tipos.cadena > 400, JSON.stringify(tipos));
  assert.ok(conPotPot > 100, `con potencia de potencia: ${conPotPot}`);
  assert.ok(de4 > 100, `de cuatro potencias: ${de4}`);
});

test('ejercicio 3: el ciclo y la cifra coinciden con BigInt; los ciclos son 4, 2 y 1', () => {
  const rng = crearRng(3304);
  const ciclos = {};
  const bases = new Set();
  for (let i = 0; i < N; i++) {
    const it = generarUltima(rng);
    bases.add(it.base);
    assert.ok(BASES_ULTIMA.includes(it.base));
    assert.ok(it.exponente <= 30 && it.exponente > CELDAS);
    assert.equal(it.tabla.length, CELDAS);
    it.tabla.forEach((d, k) => assert.equal(d, Number((B(it.base) ** B(k + 1)) % 10n)));
    assert.equal(it.solucion, Number((B(it.base) ** B(it.exponente)) % 10n));
    // El ciclo: la menor L con la misma última cifra L potencias después, en todo el rango.
    const L = it.ciclo;
    for (let k = 1; k <= 30 - L; k++) {
      assert.equal(Number((B(it.base) ** B(k)) % 10n), Number((B(it.base) ** B(k + L)) % 10n));
    }
    for (let m = 1; m < L; m++) {
      let igual = true;
      for (let k = 1; k <= 12; k++) if ((B(it.base) ** B(k)) % 10n !== (B(it.base) ** B(k + m)) % 10n) igual = false;
      assert.ok(!igual, `ciclo ${L} no es el menor para ${it.base}`);
    }
    // La potencia del ciclo que acaba igual que la pedida.
    assert.equal(ultimaCifra(it.base, posicionEnCiclo(it.exponente, L)), it.solucion);
    ciclos[L] = (ciclos[L] ?? 0) + 1;
  }
  assert.deepEqual(Object.keys(ciclos).sort(), ['1', '2', '4']);
  assert.equal(bases.size, BASES_ULTIMA.length);
  assert.equal(ciclo(7), 4);
  assert.equal(ciclo(4), 2);
  assert.equal(ciclo(5), 1);
});

test('ninguna cifra o respuesta domina: la solución del ejercicio 3 no es la misma en más del 70 % de los ítems', () => {
  const rng = crearRng(3305);
  const cuenta = {};
  for (let i = 0; i < N; i++) { const s = generarUltima(rng).solucion; cuenta[s] = (cuenta[s] ?? 0) + 1; }
  Math.max(...Object.values(cuenta)) < 0.7 * N || assert.fail(JSON.stringify(cuenta));
});
