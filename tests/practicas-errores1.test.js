// Práctica «Caza el error (unidad 1)»: cada línea de cada procedimiento se
// comprueba con definiciones propias (un evaluador de expresiones con árbol y
// aritmética de fuerza bruta), no con `aritmetica.js`. Para cada ítem generado
// se calcula qué líneas son válidas y se exige que la única falsa sea la
// declarada; en los procedimientos sin error, que todas lo sean.
//
// Un paso de un desarrollo es válido si resuelve una o varias operaciones cuyos
// dos operandos YA son números (operaciones independientes en un mismo paso: bien).
// Resolver una operación que todavía depende de otra sin escribir el resultado
// intermedio es el error «saltoPaso».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { generarHay, generarLinea, generarNombre, nombresExcluidos } from '../practicas/errores1/logica.js';
import { PLANTILLAS, PLANTILLA_POR_ID, NOMBRES, CLAVES_NOMBRES, CONFUNDIBLES } from '../practicas/errores1/textos.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';

// ─── Evaluador de expresiones (independiente del banco) ───────────────────────────

/** «3 + 4 · 5^2» → árbol. Precedencia: ^ (derecha) > · > + y − (izquierda a derecha). */
function arbol(texto) {
  const t = texto.replace(/−/g, '-').replace(/·/g, '*').match(/\d+|[-+*^()]/g);
  let i = 0;
  const hoja = v => ({ hoja: true, v });
  const nodo = (op, a, b) => ({ op, a, b });
  function atomo() {
    const x = t[i++];
    if (x === '(') { const e = suma(); assert.equal(t[i++], ')'); return e; }
    assert.ok(/^\d+$/.test(x), `token ${x} en «${texto}»`);
    return hoja(Number(x));
  }
  function potencia() {
    const base = atomo();
    if (t[i] === '^') { i++; return nodo('^', base, potencia()); }
    return base;
  }
  function producto() {
    let a = potencia();
    while (t[i] === '*') { i++; a = nodo('*', a, potencia()); }
    return a;
  }
  function suma() {
    let a = producto();
    while (t[i] === '+' || t[i] === '-') { const op = t[i++]; a = nodo(op, a, producto()); }
    return a;
  }
  const r = suma();
  assert.equal(i, t.length, `sobra algo en «${texto}»`);
  return r;
}
const valorDe = n => {
  if (n.hoja) return n.v;
  const a = valorDe(n.a), b = valorDe(n.b);
  switch (n.op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    default: { let p = 1; for (let k = 0; k < b; k++) p *= a; return p; }
  }
};
const evaluable = n => !n.hoja && n.a.hoja && n.b.hoja;
/** ¿Se puede pasar de `p` a `q` sustituyendo algunas operaciones evaluables por su resultado? */
function obtenible(p, q) {
  if (p.hoja) return q.hoja && p.v === q.v;
  if (q.hoja) return evaluable(p) && valorDe(p) === q.v;
  return p.op === q.op && obtenible(p.a, q.a) && obtenible(p.b, q.b);
}
const mismo = (p, q) => JSON.stringify(p) === JSON.stringify(q);
const val = s => valorDe(arbol(s));
const sinIgual = l => l.replace(/^= /, '');

/** Un desarrollo en cadena: línea 0 siempre válida; las demás, si son un paso válido de la anterior. */
function cadena(lineas) {
  const ts = lineas.map(l => arbol(sinIgual(l)));
  return ts.map((t, i) => i === 0 || (!mismo(ts[i - 1], t) && Boolean(obtenible(ts[i - 1], t))));
}

// ─── Definiciones auxiliares ───────────────────────────────────────────────────

const nums = s => (s.match(/\d+/g) ?? []).map(Number);
const tras = (s, marca) => s.slice(s.lastIndexOf(marca) + marca.length).replace(/\.$/, '');
/** «a + b = r» → la igualdad es verdad. */
const igualdad = l => { const [izq, der] = l.replace(/\.$/, '').split(' = '); return val(izq) === Number(der) ? val(izq) : null; };
const iguales = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const digito = (n, u) => Math.floor(n / u) % 10;
/** Redondeo a múltiplos de u, con el 5 hacia arriba. */
function redondeo(n, u) { const base = n - (n % u); return n - base >= u / 2 ? base + u : base; }

// Para cada plantilla: (params, líneas en español) → [bool por línea], «la línea es válida».
const VERIFICADORES = {
  'e-suma-antes-1': (p, ls) => cadena(ls),
  'e-suma-antes-2': (p, ls) => cadena(ls),
  'e-suma-antes-3': (p, ls) => cadena(ls),
  'e-salto-potencia-suma': (p, ls) => cadena(ls),
  'e-potencia-numero': (p, ls) => cadena(ls),
  'e-resta-antes': (p, ls) => cadena(ls),
  'e-resta-derecha-izquierda': (p, ls) => cadena(ls),
  'e-potencia-suma': (p, ls) => cadena(ls),
  'e-potencia-producto': (p, ls) => cadena(ls),
  'e-exponente-suma': (p, ls) => cadena(ls),
  'e-exponente-producto': (p, ls) => cadena(ls),
  'e-salto-resta-producto': (p, ls) => cadena(ls),
  'e-salto-potencia-producto': (p, ls) => cadena(ls),
  'e-salto-parentesis-producto': (p, ls) => cadena(ls),
  'e-raiz-mitad': ({ n, k }, [l0, l1, l2]) => {
    const [x, y, dos, r] = nums(l1);
    const [s, kk, t] = nums(l2);
    return [iguales(nums(l0), [n, k]), x === n && y === n && dos === 2 && r * r === n, s === r && kk === k && s + kk === t];
  },
  'e-resto-mayor-division': ({ d, q, r0 }, [l0, l1, l2]) => {
    const n = d * q + r0, [dd, c, x] = nums(l1), [nn, x2, r, c2, r2] = nums(l2);
    return [iguales(nums(l0), [n, d]), dd === d && d * c === x,
      nn === n && x2 === x && n - x === r && c2 === c && r2 === r && r < d];
  },
  'e-resto-mayor-cajas': ({ d, q, r0 }, [l0, l1]) => {
    const n = d * q + r0, [c, r, dd, c2, r2, nn] = nums(l1);
    return [iguales(nums(l0), [n, d]), nn === n && dd === d && c === c2 && r === r2 && d * c + r === n && r < d];
  },
  'e-redondeo-centenas': ({ n }, [l0, l1, l2]) => [
    iguales(nums(l0), [n]), iguales(nums(l1), [digito(n, 10), 5]) && digito(n, 10) >= 5,
    nums(l2).at(-1) === redondeo(n, 100)],
  'e-redondeo-decenas': ({ n }, [l0, l1, l2]) => [
    iguales(nums(l0), [n]), iguales(nums(l1), [n % 10, 5]) && n % 10 >= 5,
    nums(l2).at(-1) === redondeo(n, 10)],
  'e-olvida-parentesis-suma': ({ a, b, c }, [l0, l1, l2]) => {
    const e = tras(l1, ': '), esperado = (a + b) * c, [lhs, rhs] = l2.split(' = ');
    return [iguales(nums(l0), [a, b, c]), val(e) === esperado, val(lhs) === val(e) && val(lhs) === Number(rhs)];
  },
  'e-olvida-parentesis-resta': ({ a, b, c }, [l0, l1, l2]) => {
    const e = tras(l1, ': '), esperado = a - (b + c), [lhs, rhs] = l2.split(' = ');
    return [iguales(nums(l0), [a, b, c]), val(e) === esperado, val(lhs) === val(e) && val(lhs) === Number(rhs)];
  },
  // ── sin error ──
  'b-parentesis-redundante': (p, ls) => cadena(ls),
  'b-con-y-sin-parentesis': ({ a, b, c }, [l0, l1, l2]) => [
    igualdad(l0) === a + b * c, igualdad(l1) === a + b * c, nums(l2).at(-1) === a + b * c],
  'b-independientes-productos': (p, ls) => cadena(ls),
  'b-independientes-potencias': (p, ls) => cadena(ls),
  'b-brackets-parentheses': ({ a, b, c }, [l0, l1, l2]) => {
    const [x, y, s] = nums(l1), [aa, ss, r] = nums(l2);
    return [iguales(nums(l0), [a, b, c]), x === b && y === c && s === b + c, aa === a && ss === s && r === a * s];
  },
  'b-times-multiplied-by': ({ a, b, c }, [l0, l1, l2]) => {
    const [x, y, z] = nums(l1), [u, v, w] = nums(l2);
    return [iguales(nums(l0), [a, b, c]), x === a && y === b && z === a * b, u === z && v === c && w === a * b + c];
  },
  'b-potencia-suma-ok': (p, ls) => cadena(ls),
  'b-potencia-producto-ok': (p, ls) => cadena(ls),
  'b-resta-ok': (p, ls) => cadena(ls),
  'b-raiz-ok': ({ n, k }, [l0, l1, l2]) => {
    const [x, r, a, b, y] = nums(l1), [s, kk, t] = nums(l2);
    return [iguales(nums(l0), [n, k]), x === n && a === r && b === r && r * r === n && y === n, s === r && kk === k && s + kk === t];
  },
  'b-resto-ok': ({ d, q, r }, [l0, l1]) => {
    const n = d * q + r, [c, rr, dd, c2, r2, nn, r3, d2] = nums(l1);
    return [iguales(nums(l0), [n, d]), c === q && rr === r && dd === d && c2 === q && r2 === r && nn === n && d * c + rr === n && r3 === r && d2 === d && r < d];
  },
  'b-redondeo-ok': ({ n, sube, centenas }, [l0, l1, l2]) => {
    const u = centenas ? 100 : 10, dig = digito(n, u / 10);
    const [x, cinco] = nums(l1);
    return [iguales(nums(l0), [n]),
      x === dig && cinco === 5 && (dig >= 5) === sube && l1.includes(sube ? '5 o más' : 'menos de 5'),
      nums(l2).at(-1) === redondeo(n, u)];
  },
  'b-parentesis-traduccion-ok': ({ a, b, c }, [l0, l1, l2]) => {
    const e = tras(l1, ': '), [lhs, rhs] = l2.split(' = ');
    return [iguales(nums(l0), [a, b, c]), val(e) === (a + b) * c, val(lhs) === val(e) && val(lhs) === Number(rhs)];
  },
};

function validas(item) {
  return VERIFICADORES[item.plantilla](item.params, item.lineas.map(l => l.es));
}

// ─── El evaluador se prueba a sí mismo ──────────────────────────────────────────

test('evaluador: precedencia, paréntesis y pasos válidos', () => {
  assert.equal(val('3 + 4 · 5'), 23);
  assert.equal(val('(3 + 4) · 5'), 35);
  assert.equal(val('2 · 3^2'), 18);
  assert.equal(val('(2 · 3)^2'), 36);
  assert.equal(val('20 − 5 − 3'), 12);
  assert.equal(val('20 − (5 − 3)'), 18);
  assert.deepEqual(cadena(['3 + 4 · 5', '= 3 + 20', '= 23']), [true, true, true]);
  assert.deepEqual(cadena(['3 + 4 · 5', '= 7 · 5', '= 35']), [true, false, true]);
  assert.deepEqual(cadena(['12 − 3 · 2 + 4', '= 6 + 4', '= 10']), [true, false, true]);   // salto: dos operaciones que dependen una de otra
  assert.deepEqual(cadena(['2 · 3 + 4 · 5', '= 6 + 20', '= 26']), [true, true, true]);     // independientes: bien
  assert.deepEqual(cadena(['7 + (3 · 2)', '= 7 + 6', '= 13']), [true, true, true]);        // paréntesis redundante: bien
  assert.deepEqual(cadena(['7 + 3 · 2', '= 7 + 6', '= 13']), [true, true, true]);
  assert.deepEqual(cadena(['5^3 + 2', '= 5 · 3 + 2', '= 15 + 2', '= 17']), [true, false, true, true]);
});

// ─── El banco ────────────────────────────────────────────────────────────────

test('catálogo: errores1 tiene 3 ejercicios', () => {
  assert.equal(CATALOGO.find(p => p.slug === 'errores1').nEjercicios, 3);
});

test('banco: al menos 24 plantillas, 8 sin error, 16 con error, y cada una con su verificador', () => {
  assert.ok(PLANTILLAS.length >= 24, `hay ${PLANTILLAS.length}`);
  assert.ok(PLANTILLAS.filter(p => !p.error).length >= 8);
  assert.ok(PLANTILLAS.filter(p => p.error).length >= 16);
  assert.equal(new Set(PLANTILLAS.map(p => p.id)).size, PLANTILLAS.length);
  for (const p of PLANTILLAS) assert.equal(typeof VERIFICADORES[p.id], 'function', p.id);
  for (const id of Object.keys(VERIFICADORES)) assert.ok(PLANTILLA_POR_ID[id], `verificador de ${id} sin plantilla`);
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
      assert.deepEqual(lineas.map(l => nums(l.es)), lineas.map(l => nums(l.en)), `${p.id}: números distintos entre idiomas`);
    }
  }
});

test('reglas de contenido: sin ×, sin «primos entre sí», sin letras sueltas como incógnita, sin / ni *', () => {
  const rng = crearRng(8);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 100; i++) {
      const params = p.numeros(rng);
      const textos = [...p.lineas(params).flatMap(l => [l.es, l.en]), ...Object.values((p.error ? p.corregida : p.porque)(params))];
      for (const t of textos) {
        assert.ok(!t.includes('×'), `${p.id}: ${t}`);
        assert.ok(!/entre sí|coprim|relatively prime|\bHCF\b|\bGCF\b/i.test(t), `${p.id}: ${t}`);
        assert.ok(!/[*/]/.test(t), `${p.id}: ${t}`);
        assert.ok(!/(^|\s)[a-z] [=+−·]/.test(t), `${p.id}: letra como incógnita en ${t}`);
      }
    }
  }
});

test('el español usa «:» y el inglés «÷» para dividir, y nunca al revés', () => {
  const rng = crearRng(9);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 100; i++) {
      for (const l of p.lineas(p.numeros(rng))) {
        assert.ok(!/ ÷ /.test(l.es), `${p.id}: ${l.es}`);
        assert.ok(!/\d : \d/.test(l.en), `${p.id}: ${l.en}`);
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

test('plantillas sin error: todas las líneas válidas (cada línea vale lo mismo que la anterior)', () => {
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

test('los desarrollos en cadena de las plantillas con error valen lo mismo salvo en la línea mal; el salto sí mantiene el valor', () => {
  const rng = crearRng(13);
  for (const p of PLANTILLAS.filter(p => p.id.startsWith('e-salto'))) {
    for (let i = 0; i < 300; i++) {
      const ls = p.lineas(p.numeros(rng)).map(l => sinIgual(l.es));
      const vs = ls.map(val);
      assert.ok(vs.every(v => v === vs[0]), `${p.id}: ${ls.join(' | ')}`);   // el valor no cambia: el error es de escritura
    }
  }
});

test('la corrección de cada plantilla con error escribe una igualdad verdadera', () => {
  const rng = crearRng(14);
  for (const p of PLANTILLAS.filter(p => p.error)) {
    for (let i = 0; i < 200; i++) {
      const c = p.corregida(p.numeros(rng)).es;
      if (/^\S*[\d(]/.test(c) && !/[a-zA-ZáéíóúÁÉÍÓÚ]{3}/.test(c)) {
        const partes = c.replace(/\.$/, '').split(' = ');
        const vs = partes.map(val);
        assert.ok(vs.every(v => v === vs[0]), `${p.id}: ${c}`);
      }
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
