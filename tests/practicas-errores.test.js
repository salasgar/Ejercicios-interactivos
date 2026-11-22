// Práctica «Caza el error»: cada afirmación de cada línea de cada procedimiento
// se comprueba por fuerza bruta con definiciones propias (no con
// `aritmetica.js`, que también usa el banco). Para cada ítem generado se calcula
// qué líneas son válidas (cada línea frente a lo que dicen las anteriores) y se
// exige que la primera línea falsa sea la declarada y que sea la única.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarHay, generarColumnas, generarNombre, nombresExcluidos, FAMILIAS, FAMILIA_POR_ID, columnasPosibles } from '../practicas/errores/logica.js';
import { PLANTILLAS, PLANTILLA_POR_ID, NOMBRES, CLAVES_NOMBRES, CONFUNDIBLES, RUTAS, rutaDe } from '../practicas/errores/textos.js';
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
  // ── rutas propias de las columnas del ejercicio 2 (sin el enunciado) ──
  'c-mcd-divisores': ({ a, b }, [l0, l1, l2]) => {
    const [com, resto] = l2.split('. El mayor es ');
    const comunesBF = divsBF(a).filter(d => b % d === 0);
    return [nums(l0).slice(1).join() === divsBF(a).join(), nums(l1).slice(1).join() === divsBF(b).join(),
      nums(com).join() === comunesBF.join() && nums(resto)[0] === gcdBF(a, b) && nums(resto).at(-1) === gcdBF(a, b)];
  },
  'c-mcd-1-divisores': ({ a, b }, [l0, l1, l2]) => [
    nums(l0).slice(1).join() === divsBF(a).join(), nums(l1).slice(1).join() === divsBF(b).join(),
    /^El único divisor común es el 1/.test(l2) && divsBF(a).filter(d => b % d === 0).join() === '1' && nums(l2).at(-1) === gcdBF(a, b)],
  'c-mcd-1-primos': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    const primos = f => f.split(' · ').map(t => Number(t.split('^')[0]));
    return [valor(fx) === +x && valor(fy) === +y && +x === a && +y === b && [...primos(fx), ...primos(fy)].every(primoBF),
      !primos(fx).some(p => primos(fy).includes(p)), nums(l2).at(-1) === gcdBF(a, b)];
  },
  'c-mcm-multiplos': ({ a, b }, [l0, l1, l2]) => {
    const l = lcmBF(a, b), [, ...m1] = nums(l0), [, ...m2] = nums(l1);
    return [m1.every((x, i) => x === a * (i + 1)) && m1.at(-1) === l, m2.every((x, i) => x === b * (i + 1)) && m2.at(-1) === l,
      nums(l2)[0] === l && nums(l2).at(-1) === l && m1.filter(x => m2.includes(x))[0] === l];
  },
  'c-mcm-cruzado': ({ a, b }, [l0, l1, l2]) => {
    const [, x, fx, y, fy] = l0.match(/^(\d+) = (.+) y (\d+) = (.+)$/);
    const claim = valor(tras(l1, ': '));
    return [valor(fx) === +x && valor(fy) === +y && +x === a && +y === b, claim === lcmBF(a, b), nums(l2).at(-1) === claim];
  },
  'c-arbol-1': (p, l) => VERIFICADORES.arbol(p, l),
  'c-arbol-2': (p, l) => VERIFICADORES.arbol(p, l),
  arbol: ({ n }, [l0, l1, l2]) => {
    const [, t, c, d] = l0.match(/^(\d+) = (\d+) · (\d+)$/).map(Number);
    const partes = l1.split(' y ').map(s => {
      const primo = s.match(/^(\d+) es primo$/);
      if (primo) return primoBF(+primo[1]) ? +primo[1] : NaN;
      const [, x, fs] = s.match(/^(\d+) = (.+)$/), f = fs.split(' · ').map(Number);
      return f.every(primoBF) && f.reduce((u, v) => u * v, 1) === +x ? +x : NaN;
    });
    return [t === n && c * d === n && c > 1 && d > 1, partes.join() === [c, d].join(),
      valor(tras(l2, ' = ')) === n && tras(l2, ' = ').split(' · ').every(f => primoBF(+f.split('^')[0]))];
  },
  'c-divisiones': ({ n }, [l0, l1]) => {
    const pasos = l0.split('; ').map(s => s.match(/^(\d+) : (\d+) = (\d+)$/).slice(1).map(Number));
    const cadena = pasos.every(([y, p, z], i) => primoBF(p) && y === p * z && (i === 0 ? y === n : y === pasos[i - 1][2])) && pasos.at(-1)[2] === 1;
    const usados = pasos.map(([, p]) => p).sort((u, v) => u - v).join();
    const enF = tras(l1, ' = ').split(' · ').flatMap(f => { const [p, e = '1'] = f.split('^'); return Array(+e).fill(+p); }).join();
    return [cadena, valor(tras(l1, ' = ')) === n && usados === enF];
  },
  'c-div3-suma': ({ n }, [l0, l1, l2]) => [
    sumaBF(n) === nums(l0).at(-1) && nums(l0).slice(1, -1).join() === cifrasBF(n).join(), sumaBF(n) % 3 !== 0 && nums(l1)[0] === sumaBF(n), n % 3 !== 0],
  'c-div3-division': ({ n }, [l0, l1]) => {
    const [x, d, q, r] = nums(l0);
    return [x === n && d === 3 && q * 3 + r === n && r >= 0 && r < 3, r !== 0 && n % 3 !== 0];
  },
  'c-3y9-division': ({ n }, [l0, l1, l2]) => {
    const ok = (l, dd) => { const [x, d, q, r] = nums(l); return x === n && d === dd && q * d + r === n && r >= 0 && r < d; };
    return [ok(l0, 3) && nums(l0)[3] === 0, ok(l1, 9) && nums(l1)[3] !== 0, n % 3 === 0 && n % 9 !== 0];
  },
  'c-3y9-tres-nueve': ({ n }, [l0, l1, l2]) => [sumaBF(n) === nums(l0).at(-1), sumaBF(n) % 3 === 0 && n % 3 === 0, n % 9 === 0],
  'c-3y9-ultima-cifra': ({ n }, [l0, l1, l2]) => {
    const d = n % 10;
    // La línea 0 vale si el criterio de la última cifra diera bien con este número; la 2 es consecuencia de las anteriores.
    return [(n % 3 === 0) === (d % 3 === 0), nums(l1)[0] === d && d % 3 !== 0, true];
  },
  'c-divisores-probando': ({ n }, [l0, l1]) => [
    nums(l0)[0] === n && nums(tras(l0, 'entre ')).join() === divsBF(n).join(), nums(l1).slice(1).join() === divsBF(n).join()],
  'c-primo-divisores': ({ n }, [l0, l1]) => [nums(l0).slice(1).join() === divsBF(n).join(), divsBF(n).length > 2 && !primoBF(n)],
  'c-minutos-horas-primero': ({ h, m, d }, [l0, l1, l2]) => {
    const [d0, una, x] = nums(l0), [h1, m1, H, M] = nums(l1), [x2, H2, M2, HH, MM] = nums(l2);
    return [d0 === d && una === 1 && 60 + x === d, h1 === h && m1 === m && H === h + 1 && M === m,
      x2 === x && H2 === H && M2 === M && HH * 60 + MM === H * 60 + M + x && HH * 60 + MM === h * 60 + m + d && MM < 60];
  },
  'c-minutos-hasta-la-hora': ({ h, m, d }, [l0, l1, l2]) => {
    const [h0, m0, H, cero, y] = nums(l0), [d1, y1, z, una, w] = nums(l1), [HH, MM] = nums(l2);
    return [h0 === h && m0 === m && H === h + 1 && cero === 0 && y === 60 - m,
      d1 === d && y1 === y && z === d - y && una === 1 && 60 + w === z,
      HH * 60 + MM === h * 60 + m + d && MM < 60];
  },
  'c-relacion-multiplo': ({ a, b, k }, [l0, l1]) => [nums(l0).join() === [a, b, k].join() && a === b * k, nums(l1).join() === [a, b].join() && a % b === 0],
  'c-relacion-divisor': ({ a, b }, [l0, l1]) => {
    const [x, y, q, r] = nums(l0);
    return [x === a && y === b && q * b + r === a && r === 0, nums(l1).join() === [b, a].join() && a % b === 0];
  },
};

/** Válida por línea de una columna (con el enunciado en la 0, que siempre vale). */
function validasColumna(c, params) {
  const pl = PLANTILLA_POR_ID[c.ruta];
  const desfase = pl && !pl.enunciado ? 0 : 1;   // e-minutos y b-minutos-ok llevan el enunciado en sus líneas
  return [...Array(desfase).fill(true), ...VERIFICADORES[c.ruta](params, c.lineas.slice(desfase).map(l => l.es))];
}
const falsasDe = v => v.map((x, j) => (x ? -1 : j)).filter(j => j >= 0);

/** Válida por línea del ítem: el enunciado que la plantilla pone aparte (línea 0) no se verifica, siempre vale. */
function validas(item) {
  const desfase = PLANTILLA_POR_ID[item.plantilla].enunciado ? 1 : 0;
  return [...Array(desfase).fill(true), ...VERIFICADORES[item.plantilla](item.params, item.lineas.slice(desfase).map(l => l.es))];
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

// ─── Ejercicio 2 en columnas (JL, 22-11) ────────────────────────────────────────

const columnas = (semilla, n = 3000) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => generarColumnas(rng)); };

test('ejercicio 2: 2-4 columnas que empiezan por el enunciado; 1-2 bien (todas sus líneas verdaderas) y 1-2 con UNA línea falsa (fuerza bruta)', () => {
  const combinaciones = {}, familias = new Set();
  for (const item of columnas(201)) {
    assert.equal(item.tipo, 'columnas');
    familias.add(item.plantilla);
    const cols = item.columnas;
    assert.ok(cols.length >= 2 && cols.length <= 4, cols.length);
    const bien = cols.filter(c => !c.error), mal = cols.filter(c => c.error);
    assert.ok(bien.length >= 1 && bien.length <= 2 && mal.length >= 1 && mal.length <= 2, `${bien.length} bien, ${mal.length} mal`);
    combinaciones[`${bien.length}+${mal.length}`] = (combinaciones[`${bien.length}+${mal.length}`] ?? 0) + 1;
    assert.equal(new Set(mal.map(c => c.error)).size, mal.length, 'dos columnas con el mismo error');
    assert.equal(new Set(cols.map(c => c.ruta)).size, cols.length, 'dos columnas de la misma ruta');
    assert.equal(new Set(cols.map(c => JSON.stringify(c.lineas))).size, cols.length, 'dos columnas iguales');
    for (const c of cols) {
      assert.deepEqual(c.lineas[0], item.enunciado, 'todas empiezan por el enunciado');
      assert.ok(c.lineas.length >= 3, `${c.ruta}: al menos dos pasos`);
      const v = validasColumna(c, item.params);
      assert.equal(v.length, c.lineas.length, c.ruta);
      assert.deepEqual(falsasDe(v), c.error ? [c.falsa] : [], `${c.ruta} ${JSON.stringify(item.params)}: ${c.lineas.map(l => l.es).join(' | ')}`);
      if (c.error) {
        assert.ok(c.falsa >= 1, 'el enunciado nunca es la línea mala');
        assert.equal(c.error, rutaDe(c.ruta).error.nombre);
        assert.ok(NOMBRES[c.error], c.error);
      }
      for (const l of c.lineas) assert.deepEqual(nums(l.es), nums(l.en), `${c.ruta}: números distintos entre idiomas: ${l.es} / ${l.en}`);
    }
    assert.deepEqual(item.solucion, cols.map(c => c.falsa));
    assert.deepEqual(JSON.parse(JSON.stringify(item)), item, 'datos puros');
  }
  assert.equal(familias.size, FAMILIAS.length, 'salen todas las familias');
  for (const k of ['1+1', '1+2', '2+1', '2+2']) assert.ok(combinaciones[k] > 3000 * 0.02, `combinación ${k}: ${combinaciones[k]}`);
  assert.ok(3000 - combinaciones['1+1'] > 3000 * 0.3, `con 3 o 4 columnas: ${3000 - combinaciones['1+1']} de 3000`);
});

test('ejercicio 2: sale cada ruta de cada familia, buena o mala (ninguna se queda sin ver)', () => {
  const vistas = new Set();
  for (const item of columnas(202)) for (const c of item.columnas) vistas.add(`${item.plantilla}/${c.ruta}`);
  for (const fa of FAMILIAS) for (const id of [...fa.bien, ...fa.mal]) assert.ok(vistas.has(`${fa.id}/${id}`), `${fa.id}/${id} no sale nunca`);
  // Y todas las rutas propias están en alguna familia.
  const enFamilias = new Set(FAMILIAS.flatMap(fa => [...fa.bien, ...fa.mal]));
  for (const r of RUTAS) assert.ok(enFamilias.has(r.id), `${r.id} no está en ninguna familia`);
});

test('ejercicio 2: las rutas buenas de una familia son buenas y las malas, malas (ninguna cambia de lado)', () => {
  for (const fa of FAMILIAS) {
    for (const id of fa.bien) assert.equal(rutaDe(id).error, null, `${fa.id}: ${id} está entre las buenas y tiene error`);
    for (const id of fa.mal) assert.ok(rutaDe(id).error, `${fa.id}: ${id} está entre las malas y no tiene error`);
  }
});

test('ejercicio 2: una pregunta por columna mala, con el nombre bueno y dos que no pueden describirla (regla de oro)', () => {
  const posiciones = new Set();
  for (const item of columnas(203)) {
    const malas = item.columnas.map((c, j) => (c.error ? j : -1)).filter(j => j >= 0);
    assert.deepEqual(item.preguntas.map(q => q.col), malas);
    for (const q of item.preguntas) {
      const c = item.columnas[q.col];
      assert.equal(q.solucion, c.error);
      assert.equal(q.opciones.length, 3);
      assert.equal(new Set(q.opciones).size, 3);
      assert.ok(q.opciones.includes(c.error));
      posiciones.add(q.opciones.indexOf(c.error));
      const fuera = nombresExcluidos(rutaDe(c.ruta));
      for (const o of q.opciones) {
        assert.ok(o in NOMBRES, o);
        if (o !== c.error) assert.ok(!fuera.has(o), `${c.ruta}: ${o} describe también la columna`);
      }
    }
  }
  assert.equal(posiciones.size, 3, 'la respuesta buena sale en las tres posiciones');
});

test('ejercicio 2: «ya no puedo seguir» y «el m.c.m. con los primos del m.c.d.» no salen como distractores de sus parecidos', () => {
  // c-mcm-cruzado y e-mcm-comunes pueden ir en el mismo ítem; cada pregunta excluye a la otra (son confundibles).
  assert.ok(nombresExcluidos(rutaDe('c-mcm-cruzado')).has('mcmComunes'));
  assert.ok(nombresExcluidos(rutaDe('c-3y9-tres-nueve')).has('ultimaCifra3'));
  assert.ok(nombresExcluidos(rutaDe('c-3y9-ultima-cifra')).has('tres9'));
});

test('ejercicio 2: el ejemplo de la introducción, m.c.d. de 12 y 18, sale con sus columnas', () => {
  const { bien, mal } = columnasPosibles(FAMILIA_POR_ID.mcd, { a: 12, b: 18 });
  assert.deepEqual(bien.map(c => c.ruta), ['b-mcd-ok', 'c-mcd-divisores']);
  assert.deepEqual(mal.map(c => [c.ruta, c.lineas[c.falsa].es]), [['e-cruzado', 'Para el m.c.d. cojo los primos comunes con el mayor exponente: 2^2 · 3^2']]);
  assert.equal(mal[0].lineas.at(-1).es, 'm.c.d.(12, 18) = 36');
});

test('ejercicio 2: con dos alumnos que lo hacen bien, los dos llegan a lo mismo; las horas y los números, creíbles', () => {
  for (const item of columnas(204)) {
    const bien = item.columnas.filter(c => !c.error);
    // La última línea de cada columna buena termina en el mismo número (el resultado), salvo en las de sí/no.
    if (['mcd', 'mcd-1', 'mcm'].includes(item.plantilla)) assert.equal(new Set(bien.map(c => nums(c.lineas.at(-1).es).at(-1))).size, 1, JSON.stringify(bien));
    if (item.plantilla === 'horas') {
      const { h, m, d } = item.params;
      assert.ok(m + d > 120 && m + d < 160 && h >= 8 && h <= 15, JSON.stringify(item.params));
      for (const c of bien) assert.ok(c.lineas.at(-1).es.endsWith(`${h + 2}:${String(m + d - 120).padStart(2, '0')}.`), c.lineas.at(-1).es);
    }
    for (const c of item.columnas) for (const l of c.lineas) {
      assert.ok(!l.es.includes('×') && !l.en.includes('×'), l.es);
      assert.ok(!/["']/.test(l.es) && !/["]/.test(l.en), l.en);
      assert.doesNotMatch(l.es + l.en, /undefined|NaN|null|HCF|línea \d|line \d/, l.es);
      // Hasta 1000: el mayor es el m.c.d. «cruzado» de 52 y 338 (2^2 · 13^2 = 676), el resultado de un error.
      for (const x of nums(l.es)) assert.ok(x <= 1000, `número poco creíble: ${l.es}`);
    }
  }
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
    assert.deepEqual(validas(item).map((x, j) => (x ? -1 : j)).filter(j => j >= 0), [item.error.linea]);
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

// ─── Reabierta de la tarea 14 (2026-10-08) ───────────────────────────────────

test('e-sin-terminar: «impar es primo» no sale como distractor (describe lo mismo)', () => {
  assert.ok(nombresExcluidos(PLANTILLA_POR_ID['e-sin-terminar']).has('imparPrimo'));
  assert.ok(nombresExcluidos(PLANTILLA_POR_ID['e-impar-primo']).has('sinTerminar'));
  const rng = crearRng(21);
  for (let i = 0; i < 2000; i++) {
    const it = generarNombre(rng);
    if (it.plantilla === 'e-sin-terminar') assert.ok(!it.opciones.includes('imparPrimo'), JSON.stringify(it));
  }
});

test('e-olvida-1-n: la línea 1 lleva todas las parejas (con 1 · n); solo la 2 olvida el 1 y el propio número', () => {
  const p = PLANTILLA_POR_ID['e-olvida-1-n'];
  const rng = crearRng(5);
  for (let i = 0; i < 50; i++) {
    const params = p.numeros(rng), n = params.n, lineas = p.lineas(params);
    assert.ok(lineas[0].es.includes(`${n} = 1 · ${n}`), lineas[0].es);
    const divs = nums(lineas[1].es.split(':')[1]);
    assert.ok(!divs.includes(1) && !divs.includes(n));
  }
});

test('e-cruzado: la línea marcada dice para qué es («Para el m.c.d.»), en los dos idiomas', () => {
  const p = PLANTILLA_POR_ID['e-cruzado'];
  const l = p.lineas(p.numeros(crearRng(1)))[1];
  assert.match(l.es, /^Para el m\.c\.d\./);
  assert.match(l.en, /^For the GCD/);
});

test('instrucción del ejercicio 2: pide la PRIMERA línea que está mal, en los dos idiomas', async () => {
  const { TX } = await import('../practicas/errores/textos.js');
  for (const t of [TX.instruccion.linea, TX.detalle.linea]) {
    assert.match(t.es, /PRIMERA/);
    assert.match(t.en, /FIRST/);
  }
});

test('b-primo-ok no usa letras como incógnita; b-factores-11-13 solo nombra los primos que aparecen', () => {
  const rng = crearRng(9);
  const ok = PLANTILLA_POR_ID['b-primo-ok'];
  for (let i = 0; i < 30; i++) {
    const params = ok.numeros(rng);
    const texto = [...ok.lineas(params), ok.porque(params)].map(l => l.es + l.en).join(' ');
    assert.ok(!/\bp\b/.test(texto), texto);
  }
  const b = PLANTILLA_POR_ID['b-factores-11-13'];
  for (const n of [242, 286, 338, 363]) {
    const es = b.porque({ n }).es;
    for (const g of [11, 13]) assert.equal(es.includes(String(g)), n % g === 0, `${n}: ${es}`);
  }
});

test('decisión del 9-10: sin la plantilla «factor = divisor»; el m.c.m. se nombra «distinto de cero»', () => {
  assert.equal(PLANTILLA_POR_ID['b-factor-divisor'], undefined);
  const p = PLANTILLA_POR_ID['b-lcm-nombres'];
  const lineas = p.lineas(p.numeros(crearRng(3)));
  const tercera = lineas[2];
  assert.match(tercera.es, /distinto de cero/);
  assert.match(tercera.en, /other than zero/);
  for (const pl of PLANTILLAS) for (const l of (pl.lineas(pl.numeros(crearRng(4)))))
    assert.doesNotMatch(l.es, /es factor de|a menor múltiplo común es/);
});

// ─── Reapertura de la tarea 14 (decisiones del 14-11) ───────────────────────

test('el banco tiene 28 plantillas, 14 con error y 14 sin error (el comentario de textos.js lo dice)', () => {
  assert.equal(PLANTILLAS.length, 28);
  assert.equal(PLANTILLAS.filter(p => p.error).length, 14);
  assert.equal(PLANTILLAS.filter(p => !p.error).length, 14);
});

test('e-mcd-cero: la corrección dice que el 1 es el ÚNICO divisor común, en los dos idiomas', () => {
  const p = PLANTILLA_POR_ID['e-mcd-cero'];
  const rng = crearRng(1414);
  for (let i = 0; i < 20; i++) {
    const params = p.numeros(rng);
    const { es, en } = p.corregida(params);
    assert.match(es, /único divisor que tienen en común \d+ y \d+ es el 1/);
    assert.match(en, /only divisor that \d+ and \d+ have in common is 1/);
  }
});

test('textos del banco: sin comillas rectas en lo que ve el alumno (en inglés “ ”, en español « »)', () => {
  const rng = crearRng(1515);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 20; i++) {
      const params = p.numeros(rng);
      const textos = [...p.lineas(params), p.corregida?.(params), p.porque?.(params)].filter(Boolean);
      for (const t of textos) for (const idioma of ['es', 'en']) assert.ok(!/["']/.test(t[idioma].replace(/\b\w+'\w+\b/g, '')), `${p.id} ${idioma}: ${t[idioma]}`);
    }
  }
});

// ─── Revisión de Juan Luis (22-11): enunciado aparte, sin números, la regla rota ────────────────

test('cada ítem empieza por el enunciado (lo que se pide), que nunca es la línea del error', async () => {
  const { lineasDe, errorDe } = await import('../practicas/errores/logica.js');
  const rng = crearRng(2211);
  for (const p of PLANTILLAS) {
    const params = p.numeros(rng);
    const [enun] = lineasDe(p, params);
    for (const idioma of ['es', 'en']) assert.match(enun[idioma], /^(Calcula|Descompón|Escribe|¿|Sale|Hay que|Find|Write|Work out|Is |How are|It leaves|Two ropes)/, `${p.id}: ${enun[idioma]}`);
    assert.match(enun.es, /\?|\.$/, p.id);
    if (p.error) assert.ok(errorDe(p).linea >= 1, p.id);
    if (p.enunciado) assert.deepEqual(nums(p.enunciado(params).es), nums(p.enunciado(params).en), `${p.id}: números distintos entre idiomas`);
  }
});

test('los enunciados de problemas llevan su pregunta (las horas: «¿A qué hora llega?»)', () => {
  for (const id of ['e-minutos', 'b-minutos-ok']) {
    const p = PLANTILLA_POR_ID[id];
    const [l0] = p.lineas(p.numeros(crearRng(7)));
    assert.match(l0.es, /¿A qué hora llega\?$/);
    assert.match(l0.en, /What time does it arrive\?$/);
  }
});

test('cada error tiene su regla en los dos idiomas', async () => {
  const { REGLAS } = await import('../practicas/errores/textos.js');
  for (const c of CLAVES_NOMBRES) assert.ok(REGLAS[c]?.es && REGLAS[c]?.en, c);
});

test('la interfaz ya no numera las líneas', () => {
  for (const f of ['practica.js', 'estilos.css', 'textos.js']) {
    const t = readFileSync(new URL(`../practicas/errores/${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(t, /procedimiento__n|líneas numeradas|numbered lines/, f);
  }
});
