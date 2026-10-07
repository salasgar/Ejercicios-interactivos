// Práctica «Caza el error»: cada afirmación de cada línea de cada procedimiento
// se comprueba por fuerza bruta con definiciones propias (no con
// `aritmetica.js`, que también usa el banco). Para cada ítem generado se calcula
// qué líneas son válidas (cada línea frente a lo que dicen las anteriores) y se
// exige que la primera línea falsa sea la declarada y que sea la única.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarHay, generarLinea, generarNombre, nombresExcluidos } from '../practicas/errores/logica.js';
import { PLANTILLAS, PLANTILLA_POR_ID, NOMBRES, CLAVES_NOMBRES, CONFUNDIBLES } from '../practicas/errores/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

// ─── Definiciones independientes ─────────────────────────────────────────────

const gcdBF = (a, b) => { for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d; return 1; };
const lcmBF = (a, b) => { let k = Math.max(a, b); while (k % a || k % b) k++; return k; };
const divsBF = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);
const primoBF = n => n >= 2 && divsBF(n).length === 2;
const nums = s => (s.match(/\d+/g) ?? []).map(Number);
/** «2^3 · 3^2 · 5» → 360. */
const valor = s => s.trim().split(' · ').reduce((v, t) => { const [b, e = '1'] = t.split('^'); return v * Number(b) ** Number(e); }, 1);
const tras = (s, marca) => s.slice(s.lastIndexOf(marca) + marca.length).replace(/\.$/, '');
const cifrasBF = n => [...String(n)].map(Number);
const sumaBF = n => cifrasBF(n).reduce((a, b) => a + b, 0);
const ultimo = lineas => lineas.at(-1);

/** ¿Cada «n = x · y» de la lista es verdad? */
const productosOk = (texto, n) => [...texto.matchAll(/(\d+) = (\d+) · (\d+)/g)].every(([, t, x, y]) => Number(t) === Number(x) * Number(y)) && texto.includes(String(n));

// Para cada plantilla: función (params, líneas en español) → [bool por línea], «la línea es válida».
const VERIFICADORES = {
  'e-cruzado': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    const claim = valor(tras(l1, ': '));
    return [valor(fx) === Number(x) && valor(fy) === Number(y) && +x === a && +y === b,
      claim === gcdBF(a, b), nums(l2).at(-1) === claim];
  },
  'e-mcm-comunes': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    const claim = valor(tras(l1, ': '));
    return [valor(fx) === +x && valor(fy) === +y && +x === a && +y === b, claim === lcmBF(a, b), nums(l2).at(-1) === claim];
  },
  'e-potencia': ({ b, e, k }, [l0, l1, l2]) => {
    const x = nums(l1).at(-1);   // «b^e = b · e = x»
    const [u, v, w] = nums(l2);
    return [true, b ** e === x && b * e === x, u === x && u * v === w && v === k];
  },
  'e-ultima-cifra-3': ({ n }, [l0, l1, l2]) => {
    const d = n % 10;
    return [(n % 3 === 0) === (d % 3 === 0), d % 3 === 0, true];
  },
  'e-tres-nueve': ({ n }, [l0, l1, l2]) => [
    sumaBF(n) === nums(l0).at(-1), sumaBF(n) % 3 === 0, n % 9 === 0],
  'e-sin-terminar': ({ n, a, b }, [l0]) => [a * b === n, primoBF(a) && primoBF(b)],
  'e-multiplo-divisor-a': ({ a, b, k }, [l0]) => [a === b * k, b % a === 0],
  'e-multiplo-divisor-b': ({ a, b, k }, [l0]) => [a === b * k, b % a === 0],
  'e-mcd-cero': ({ a, b }, [l0, l1, l2]) => [
    nums(l0).slice(1).join() === divsBF(a).join(), nums(l1).slice(1).join() === divsBF(b).join(), nums(l2).at(-1) === gcdBF(a, b)],
  'e-olvida-1-n': ({ n }, [l0, l1]) => [
    [...l0.matchAll(/(\d+) = (\d+) · (\d+)/g)].every(([, t, x, y]) => +t === n && +x * +y === n),
    nums(l1).slice(1).join() === divsBF(n).join()],
  'e-olvida-n': ({ n }, [l0, l1]) => [
    [...l0.matchAll(/(\d+) = (\d+) · (\d+)/g)].every(([, t, x, y]) => +t === n && +x * +y === n),
    nums(l1).slice(1).join() === divsBF(n).join()],
  'e-minutos': ({ h, m, d }, [l0, l1, l2, l3]) => {
    const T = m + d, x = nums(l2).at(-1);
    const [h1, hh, mm] = [nums(l3)[0], nums(l3).at(-2), nums(l3).at(-1)];
    return [nums(l0)[0] === h && nums(l0)[1] === m && nums(l0)[2] === d, nums(l1).at(-1) === T, 60 * 1 + x === T,
      h1 === h && hh === h + 1 && mm === x];
  },
  'e-impar-primo': ({ n }, [l0, l1, l2]) => [
    n % 2 === 1, Array.from({ length: n }, (_, i) => i + 1).filter(k => k % 2 === 1 && k >= 3).every(primoBF), true],
  'e-trozos': ({ a, b }, [l0, l1, l2, l3]) => {
    const g = gcdBF(a, b);
    return [true, nums(l1).at(-1) === g, nums(l2)[0] === g, nums(l3)[0] === a / g + b / g];
  },
  // ── sin error ──
  'b-orden-factores': ({ n }, [l0, l1]) => [valor(tras(l0, ' = ')) === n, valor(tras(l1, ': ').split(' = ')[0]) === n],
  'b-dos-arboles': ({ n }, [l0, l1, l2]) => [l0, l1].map(l => {
    const t = nums(l).slice(1);   // quita el número del árbol
    const [tot, x, y, ...hojas] = t;
    return tot === n && x * y === n && hojas.reduce((p, q) => p * q, 1) === n && hojas.every(primoBF);
  }).concat([valor(tras(l2, ' = ')) === n]),
  'b-factor-divisor': ({ n, d, k }, [l0, l1, l2]) => [n === d * k, n % d === 0, n % d === 0],
  'b-mcd-hcf': ({ a, b }, [l0, l1]) => [nums(l0).at(-1) === gcdBF(a, b), nums(l1).slice(2).every(x => x === gcdBF(a, b) || x === a || x === b)],
  'b-lcm-nombres': ({ a, b }, [l0, l1, l2]) => {
    const l = lcmBF(a, b), [, ...m1] = nums(l0), [, ...m2] = nums(l1);
    return [m1.every((x, i) => x === a * (i + 1)) && m1.at(-1) === l, m2.every((x, i) => x === b * (i + 1)) && m2.at(-1) === l,
      nums(l2).at(-1) === l && nums(l2)[0] === l && m1.filter(x => m2.includes(x))[0] === l, true];
  },
  'b-divisible-por': ({ n }, [l0, l1]) => [sumaBF(n) === nums(l0).at(-1), sumaBF(n) % 3 === 0 && n % 3 === 0],
  'b-criterio-3-no-9': ({ n }, [l0, l1, l2]) => [sumaBF(n) === nums(l0).at(-1),
    sumaBF(n) % 3 === 0 && sumaBF(n) % 9 !== 0, n % 3 === 0 && n % 9 !== 0],
  'b-factores-11-13': ({ n }, [l0, l1, l2]) => {
    const [t, p, m] = nums(l0), [mm, ...hojas] = nums(l1);
    return [t === n && p * m === n, mm === m && hojas.reduce((x, y) => x * y, 1) === m && hojas.every(primoBF), valor(tras(l2, ' = ')) === n];
  },
  'b-mcm-ok': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    return [valor(fx) === +x && valor(fy) === +y, valor(tras(l1, ': ')) === lcmBF(a, b), nums(l2).at(-1) === lcmBF(a, b)];
  },
  'b-mcd-ok': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    return [valor(fx) === +x && valor(fy) === +y, valor(tras(l1, ': ')) === gcdBF(a, b), nums(l2).at(-1) === gcdBF(a, b)];
  },
  'b-divisores-ok': ({ n }, [l0, l1]) => [
    [...l0.matchAll(/(\d+) = (\d+) · (\d+)/g)].every(([, t, x, y]) => +t === n && +x * +y === n),
    nums(l1).slice(1).join() === divsBF(n).join()],
  'b-impar-no-primo': ({ n }, [l0, l1]) => [n % 2 === 1 && nums(l0)[1] === n && nums(l0)[2] * nums(l0)[3] === n, !primoBF(n)],
  'b-primo-ok': ({ n }, [l0, l1, l2]) => {
    const t = nums(l0), probados = t.slice(1, -1).filter(x => x !== n);
    const esperados = Array.from({ length: n }, (_, i) => i + 2).filter(p => primoBF(p) && p * p <= n);
    const [q, , , q2, nn] = nums(l1);   // «q y q · q = q2, que ya pasa de n»
    const siguiente = Array.from({ length: n + 2 }, (_, i) => i + 2).find(p => primoBF(p) && p * p > n);
    return [primoBF(n) && esperados.every(p => n % p !== 0) && probados.join() === esperados.join(),
      q === siguiente && q * q === q2 && q2 > n && nn === n, primoBF(n)];
  },
  'b-razonable': ({ a, b, cantidad }, [l0, l1]) => {
    const v = nums(l0).at(-1);
    return cantidad === 'mcd'
      ? [v === gcdBF(a, b), nums(l1)[0] <= nums(l1)[1] && nums(l1)[1] === Math.min(a, b) && v === nums(l1)[0]]
      : [v === lcmBF(a, b), nums(l1)[0] >= nums(l1)[1] && nums(l1)[1] === Math.max(a, b) && v === nums(l1)[0]];
  },
  'b-minutos-ok': ({ h, m, d }, [l0, l1, l2, l3]) => {
    const T = m + d, x = nums(l2).at(-1);
    return [nums(l0)[0] === h && nums(l0)[1] === m && nums(l0)[2] === d, nums(l1).at(-1) === T, 120 + x === T,
      nums(l3)[0] === h && nums(l3)[1] === 2 && nums(l3)[2] === h + 2 && nums(l3).at(-2) === h + 2 && nums(l3).at(-1) === x];
  },
};

function validas(item) {
  return VERIFICADORES[item.plantilla](item.params, item.lineas.map(l => l.es));
}

// ─── El banco ────────────────────────────────────────────────────────────────

test('catálogo: errores tiene 3 ejercicios', () => {
  assert.equal(CATALOGO.find(p => p.slug === 'errores').nEjercicios, 3);
});

test('banco: al menos 24 plantillas, 8 sin error, y cada una con su verificador', () => {
  assert.ok(PLANTILLAS.length >= 24, `hay ${PLANTILLAS.length}`);
  assert.ok(PLANTILLAS.filter(p => !p.error).length >= 8);
  assert.equal(new Set(PLANTILLAS.map(p => p.id)).size, PLANTILLAS.length);
  for (const p of PLANTILLAS) assert.equal(typeof VERIFICADORES[p.id], 'function', p.id);
});

test('NOMBRES: de 10 a 12 entradas en los dos idiomas, y cada una es el error de alguna plantilla', () => {
  assert.ok(CLAVES_NOMBRES.length >= 10 && CLAVES_NOMBRES.length <= 12);
  for (const c of CLAVES_NOMBRES) {
    assert.ok(NOMBRES[c].es && NOMBRES[c].en, c);
    assert.ok(PLANTILLAS.some(p => p.error?.nombre === c), `${c} no es el error de ninguna plantilla`);
  }
  for (const p of PLANTILLAS.filter(p => p.error)) assert.ok(NOMBRES[p.error.nombre], p.id);
  for (const [a, b] of CONFUNDIBLES) assert.ok(NOMBRES[a] && NOMBRES[b]);
});

test('cada plantilla da de 2 a 4 líneas en los dos idiomas con cualquier params, y su corrección o explicación', () => {
  const rng = crearRng(7);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 300; i++) {
      const params = p.numeros(rng);
      const lineas = p.lineas(params);
      assert.ok(lineas.length >= 2 && lineas.length <= 4, p.id);
      for (const l of lineas) assert.ok(typeof l.es === 'string' && l.es && typeof l.en === 'string' && l.en, p.id);
      if (p.error) {
        assert.ok(p.error.linea >= 0 && p.error.linea < lineas.length, p.id);
        const c = p.corregida(params);
        assert.ok(c.es && c.en, p.id);
      } else {
        const c = p.porque(params);
        assert.ok(c.es && c.en, p.id);
      }
      if (p.id !== 'b-mcd-hcf') assert.deepEqual(lineas.map(l => nums(l.es)), lineas.map(l => nums(l.en)), `${p.id}: números distintos entre idiomas`);
    }
  }
});

test('reglas de contenido: sin ×, sin HCF fuera de la plantilla GCD/HCF, sin «primos entre sí», sin letras como incógnita', () => {
  const rng = crearRng(8);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 100; i++) {
      const params = p.numeros(rng);
      const textos = [...p.lineas(params).flatMap(l => [l.es, l.en]), ...Object.values((p.error ? p.corregida : p.porque)(params))];
      for (const t of textos) {
        assert.ok(!t.includes('×'), `${p.id}: ${t}`);
        assert.ok(!/entre sí|coprim|relatively prime/i.test(t), `${p.id}: ${t}`);
        assert.ok(!/múltiplo de 0|divisible entre 0/i.test(t), `${p.id}: ${t}`);
        if (p.id !== 'b-mcd-hcf') assert.ok(!/HCF|GCF/.test(t), `${p.id}: ${t}`);
      }
    }
  }
});

test('plantillas con error: exactamente una línea es falsa y es la declarada; las demás, válidas (fuerza bruta)', () => {
  const rng = crearRng(11);
  for (const p of PLANTILLAS.filter(p => p.error)) {
    for (let i = 0; i < 400; i++) {
      const params = p.numeros(rng);
      const v = VERIFICADORES[p.id](params, p.lineas(params).map(l => l.es));
      assert.equal(v.length, p.lineas(params).length, p.id);
      const falsas = v.map((x, j) => (x ? -1 : j)).filter(j => j >= 0);
      assert.deepEqual(falsas, [p.error.linea], `${p.id} ${JSON.stringify(params)}: ${JSON.stringify(v)}`);
    }
  }
});

test('plantillas sin error: todas las líneas válidas (fuerza bruta)', () => {
  const rng = crearRng(12);
  for (const p of PLANTILLAS.filter(p => !p.error)) {
    for (let i = 0; i < 400; i++) {
      const params = p.numeros(rng);
      const v = VERIFICADORES[p.id](params, p.lineas(params).map(l => l.es));
      assert.equal(v.length, p.lineas(params).length, p.id);
      assert.ok(v.every(Boolean), `${p.id} ${JSON.stringify(params)}: ${JSON.stringify(v)}`);
    }
  }
});

// ─── Ejercicio 1 ──────────────────────────────────────────────────────────────

test('ejercicio 1: la solución coincide con la fuerza bruta y es datos puros', () => {
  const rng = crearRng(101);
  for (let i = 0; i < 3000; i++) {
    const item = generarHay(rng);
    const v = validas(item);
    const hayError = v.some(x => !x);
    assert.equal(item.solucion, hayError ? 'error' : 'bien');
    assert.equal(item.error === null, !hayError);
    assert.deepEqual(item.opciones, ['bien', 'error']);
    assert.deepEqual(JSON.parse(JSON.stringify(item)), item);
  }
});

test('ejercicio 1: «bien» y «error» salen entre el 40 % y el 60 % en 3000 ítems', () => {
  const rng = crearRng(102);
  let bien = 0;
  for (let i = 0; i < 3000; i++) if (generarHay(rng).solucion === 'bien') bien++;
  assert.ok(bien >= 1200 && bien <= 1800, `bien = ${bien}`);
});

test('ejercicio 1: salen todas las plantillas', () => {
  const rng = crearRng(103);
  const vistas = new Set();
  for (let i = 0; i < 3000; i++) vistas.add(generarHay(rng).plantilla);
  assert.equal(vistas.size, PLANTILLAS.length);
});

// ─── Ejercicio 2 ──────────────────────────────────────────────────────────────

test('ejercicio 2: solo procedimientos con error; la línea correcta es la única falsa (fuerza bruta)', () => {
  const rng = crearRng(201);
  for (let i = 0; i < 2000; i++) {
    const item = generarLinea(rng);
    assert.ok(item.error);
    const v = validas(item);
    assert.deepEqual(v.map((x, j) => (x ? -1 : j)).filter(j => j >= 0), [item.solucion]);
    assert.equal(item.opciones.length, item.lineas.length);
    assert.deepEqual(item.opciones, item.lineas.map((_, j) => j));
  }
});

test('ejercicio 2: ninguna posición es la correcta en más del 70 % de los ítems', () => {
  const rng = crearRng(202);
  const cuenta = {};
  for (let i = 0; i < 3000; i++) { const s = generarLinea(rng).solucion; cuenta[s] = (cuenta[s] ?? 0) + 1; }
  for (const [pos, c] of Object.entries(cuenta)) assert.ok(c / 3000 <= 0.7, `posición ${pos}: ${c}`);
});

// ─── Ejercicio 3 ──────────────────────────────────────────────────────────────

test('ejercicio 3: cuatro nombres distintos; los tres falsos no están excluidos ni son confundibles con el bueno', () => {
  const rng = crearRng(301);
  for (let i = 0; i < 3000; i++) {
    const item = generarNombre(rng);
    const plantilla = PLANTILLA_POR_ID[item.plantilla];
    assert.ok(item.error);
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4);
    assert.ok(item.opciones.includes(item.solucion));
    assert.equal(item.solucion, plantilla.error.nombre);
    const fuera = nombresExcluidos(plantilla);
    for (const o of item.opciones) {
      assert.ok(o in NOMBRES, o);
      if (o !== item.solucion) assert.ok(!fuera.has(o), `${plantilla.id}: ${o}`);
    }
    // El procedimiento sigue siendo el de la plantilla y tiene su error (fuerza bruta).
    assert.deepEqual(validas(item).map((x, j) => (x ? -1 : j)).filter(j => j >= 0), [plantilla.error.linea]);
  }
});

test('ejercicio 3: ningún nombre es el correcto en más del 70 % de los ítems', () => {
  const rng = crearRng(302);
  const cuenta = {};
  for (let i = 0; i < 3000; i++) { const s = generarNombre(rng).solucion; cuenta[s] = (cuenta[s] ?? 0) + 1; }
  for (const [n, c] of Object.entries(cuenta)) assert.ok(c / 3000 <= 0.7, `${n}: ${c}`);
  assert.equal(Object.keys(cuenta).length, CLAVES_NOMBRES.length);
});

test('ejercicio 3: de verdad hay tres distractores disponibles para cada plantilla (no se queda corto)', () => {
  for (const p of PLANTILLAS.filter(p => p.error)) {
    const fuera = nombresExcluidos(p);
    assert.ok(CLAVES_NOMBRES.filter(c => !fuera.has(c)).length >= 3, p.id);
  }
});
