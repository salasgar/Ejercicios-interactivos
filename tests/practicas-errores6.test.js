// Práctica «Caza el error» de la unidad 6 (PU2, tarea 154): la lógica se prueba por fuerza bruta con semillas
// fijas (3000 ítems por ejercicio). La solución buena y la mala de cada plantilla se recalculan aquí a mano, con
// racionales de BigInt, sin pasar por ERRORES_TIPICOS ni por la aritmética de algebra.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, aEcuacion } from '../practicas/_comun/algebra.js';
import { Fraccion, leerFraccion } from '../practicas/_comun/fracciones.js';
import * as L from '../practicas/errores6/logica.js';
import { TX } from '../practicas/errores6/textos.js';

const N = 3000;
const generar = (fn, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const B = BigInt;

// ─── Racionales de BigInt: [numerador, denominador] ───────────────────────────
const mcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const R = (n, d = 1) => { n = B(n); d = B(d); if (d < 0n) { n = -n; d = -d; } const g = mcdB(n, d) || 1n; return [n / g, d / g]; };
const sum = ([a, b], [c, d]) => R(a * d + c * b, b * d);
const res = (x, y) => sum(x, [-y[0], y[1]]);
const mul = ([a, b], [c, d]) => R(a * c, b * d);
const div = ([a, b], [c, d]) => R(a * d, b * c);
const igualR = (f, r) => B(f.num) * r[1] === r[0] * B(f.den);
const mcmN = (a, b) => (a * b) / Number(mcdB(B(a), B(b)));

/** [bien, mal] de cada plantilla, calculados a mano a partir de los parámetros. */
const MANO = {
  'transponer-sin-signo'(p) {
    if (!p.dos) return [div(R(p.c - p.b), R(p.a)), div(R(p.c + p.b), R(p.a))];
    return [div(R(p.d - p.b), R(p.a - p.c)), div(R(p.d + p.b), R(p.a + p.c))];
  },
  'pasar-factor-restando'(p) { const C = p.c - p.b; return [div(R(C), R(p.a)), R(C - p.a)]; },
  'multiplicar-en-vez-de-dividir'(p) { const C = p.c - p.b; return [div(R(C), R(p.a)), R(C * p.a)]; },
  'invertir-coeficiente'(p) { const C = p.c - p.b; return [div(R(C), R(p.a)), div(R(p.a), R(C))]; },
  'signo-al-dividir'(p) { return [R(p.s), R(-p.s)]; },
  'signo-de-la-solucion'(p) { const s = div(R(p.c - p.b), R(p.a)); return [s, mul(s, R(-1))]; },
  'mcm-solo-denominadores'(p) {
    const m = mcmN(p.d1, p.d2), c = B(p.c - p.b);
    return [div(mul(R(c), R(p.d1 * p.d2)), R(p.d2 - p.d1)), div(R(c), R(m / p.d1 - m / p.d2))];
  },
  'olvidar-numerador'(p) {
    const m = p.d2 ? mcmN(p.d1, p.d2) : p.d1, c = p.c - p.b;
    let bien = R(p.a, p.d1); if (p.d2) bien = sum(bien, R(1, p.d2));
    return [div(R(c), bien), div(R(m * c), R(m / p.d1 + (p.d2 ? m / p.d2 : 0)))];
  },
  'cero-x-como-x'() { return null; },
  'suma-no-semejantes'(p) { return [div(R(p.e - p.b), R(p.a + p.c)), div(R(p.e), R(p.a + p.c + p.b))]; },
  'distribuir-solo-primero'(p) { return [res(R(p.c, p.k), R(p.n)), div(R(p.c - p.n), R(p.k))]; },
  'signo-solo-primero'(p) { return [res(R(-p.c, p.k), R(p.n)), res(R(p.n), R(p.c, p.k))]; },
};

test('el catálogo declara tres ejercicios y cada plantilla tiene su error con nombre', () => {
  const fila = CATALOGO.find(f => f.slug === 'errores6');
  assert.equal(fila.nEjercicios, 3);
  assert.equal(fila.disponible, false, 'la publica la tarea de la semana, no esta');
  assert.equal(L.PLANTILLAS.length, 12);
  for (const pl of L.PLANTILLAS) {
    const e = ERRORES_TIPICOS[pl.id];
    assert.ok(e && e.nombre.es && e.nombre.en, pl.id);
    assert.ok(L.CLASE_DE[pl.id], `${pl.id} sin clase`);
  }
});

test('la solución buena y la mala de cada plantilla coinciden con el cálculo a mano', () => {
  for (const [ej, fn, sem] of [['donde', L.generarDonde, 21], ['que', L.generarQue, 22], ['corrige', L.generarCorrige, 23]]) {
    const its = generar(fn, sem);
    const vistas = new Set();
    for (const it of its) {
      vistas.add(it.plantilla);
      const mano = MANO[it.plantilla](it.params);
      if (mano === null) continue;
      const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
      assert.ok(bien instanceof Fraccion && mal instanceof Fraccion, `${ej} ${L.claveItem(it)}`);
      assert.ok(igualR(bien, mano[0]), `${ej} bien: ${L.claveItem(it)}`);
      assert.ok(igualR(mal, mano[1]), `${ej} mal: ${L.claveItem(it)}`);
      assert.ok(!igualR(bien, mano[1]), `bueno y malo iguales: ${L.claveItem(it)}`);
    }
    if (ej !== 'corrige') assert.equal(vistas.size, 12, `${ej}: faltan plantillas`);
    else assert.equal(vistas.size, 11, 'corrige: todas menos cero-x-como-x');
  }
});

test('ejercicio 1: solo la línea marcada deja de ser equivalente a la anterior; un tercio sin error', () => {
  const its = generar(L.generarDonde, 31);
  let sinError = 0;
  for (const it of its) {
    const eqs = L.ecuacionesDe(it);
    assert.ok(it.lineas.length >= 3 && it.lineas.length <= 7, L.claveItem(it));
    assert.ok(it.falsa === null || (it.falsa >= 1 && it.falsa < it.lineas.length), L.claveItem(it));
    if (it.falsa === null) sinError++;
    for (let i = 1; i < eqs.length; i++) {
      if (eqs[i] === null || eqs[i - 1] === null) {
        // la frase «no tiene solución» solo cierra una línea 0x = C
        assert.equal(it.plantilla, 'cero-x-como-x');
        assert.equal(eqs[i - 1].resolver().tipo, 'ninguna');
        continue;
      }
      const eq = eqs[i - 1].equivalente(eqs[i]);
      if (i === it.falsa) assert.ok(!eq, `la línea mala es equivalente: ${L.claveItem(it)}`);
      else assert.ok(eq, `la línea ${i + 1} no sigue de la anterior: ${L.claveItem(it)} → ${it.lineas.map(l => l.ec ?? l.raw ?? l.t.es).join(' | ')}`);
    }
    if (it.falsa !== null) {
      // la línea buena que habría ido en su sitio sí es equivalente a la anterior
      const buena = L.lineaBuena(it);
      if (buena.ec) assert.ok(eqs[it.falsa - 1].equivalente(aEcuacion(buena.ec)), `lineaBuena: ${L.claveItem(it)}`);
    }
  }
  assert.ok(sinError > N * 0.28 && sinError < N * 0.38, `sin error: ${sinError}`);
});

test('ejercicio 2: cuatro nombres, solo uno verdadero; ningún otro llevaría al mismo resultado', () => {
  const its = generar(L.generarQue, 41);
  for (const it of its) {
    assert.equal(it.opciones.length, 4, L.claveItem(it));
    assert.equal(new Set(it.opciones).size, 4);
    assert.equal(it.opciones.filter(id => id === it.solucion).length, 1);
    assert.equal(it.solucion, it.plantilla);
    assert.notEqual(it.falsa, null);
    const pl = L.PLANTILLA_POR_ID[it.plantilla];
    const mano = MANO[it.plantilla](it.params);
    for (const id of it.opciones) {
      assert.ok(ERRORES_TIPICOS[id].nombre.es && ERRORES_TIPICOS[id].nombre.en, id);
      if (id === it.solucion) continue;
      // el error alternativo, con los números del ítem, no da el resultado del cálculo malo
      const s = L.solucionConError(pl, id, it.params);
      const mal = L.resultadoMalo(it);
      const claveMal = mal instanceof Fraccion ? `n:${mal.simplificar().num}/${mal.simplificar().den}` : `s:${mal.tipo}`;
      assert.notEqual(s, claveMal, `${id} explicaría también ${L.claveItem(it)}`);
      if (mano) assert.ok(!(s === `n:${mano[1][0]}/${mano[1][1]}`), `${id} da lo mismo que el cálculo malo a mano: ${L.claveItem(it)}`);
    }
  }
});

test('ejercicio 3: la solución buena se acepta en cualquier escritura; el resultado malo se avisa', () => {
  const its = generar(L.generarCorrige, 51);
  for (const it of its) {
    assert.notEqual(it.plantilla, 'cero-x-como-x');
    const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
    assert.equal(L.corregirCorrige(it, bien).acierto, true);
    const grande = new Fraccion(bien.num * 6, bien.den * 6);
    assert.equal(L.corregirCorrige(it, grande).acierto, true, '6/6 de más también vale');
    assert.equal(L.corregirCorrige(it, leerFraccion(bien.den === 1 ? `${bien.num}` : `${bien.num}/${bien.den}`)).acierto, true);
    const rm = L.corregirCorrige(it, mal);
    assert.deepEqual([rm.acierto, rm.error], [false, 'repite-el-error']);
    let k = 1;
    while (new Fraccion(bien.num + k * bien.den, bien.den).equals(mal)) k++;
    const otro = L.corregirCorrige(it, new Fraccion(bien.num + k * bien.den, bien.den));
    assert.deepEqual([otro.acierto, otro.error], [false, 'otro-resultado']);
  }
});

test('las líneas se leen de vuelta y se escriben igual; solo el enunciado lleva paréntesis', () => {
  for (const [fn, sem] of [[L.generarDonde, 61], [L.generarQue, 62], [L.generarCorrige, 63]]) {
    for (const it of generar(fn, sem)) {
      it.lineas.forEach((l, i) => {
        if (l.ec) assert.equal(aEcuacion(l.ec).aTexto(), l.ec, `no se lee de vuelta: ${l.ec}`);
        if (l.raw) assert.equal(i, 0, 'una línea con paréntesis que no es la primera');
        if (i > 0) assert.ok(!/[()]/.test(l.ec ?? l.t.es), `paréntesis en la línea ${i + 1}: ${l.ec}`);
      });
    }
  }
});

test('ningún texto del alumno lleva ×, %, x², 1x, dos letras ni signos seguidos, en los dos idiomas', () => {
  const MALOS = [/×/, /%/, /x²/, /x\^/, /\*/, /(^|[^0-9.])1x/, /[+−-] [+−]/, /[a-wyz]\s?[0-9=]/i];
  const revisa = (texto, donde) => {
    for (const re of MALOS.slice(0, 7)) assert.ok(!re.test(texto), `${donde}: «${texto}» casa con ${re}`);
  };
  const vistos = new Set();
  for (const [fn, sem] of [[L.generarDonde, 71], [L.generarQue, 72], [L.generarCorrige, 73]]) {
    for (const it of generar(fn, sem)) {
      for (const l of it.lineas) for (const idioma of ['es', 'en']) revisa(L.htmlLinea(l, idioma, false), L.claveItem(it));
      for (const idioma of ['es', 'en']) {
        const txt = L.porque(it, idioma);
        if (!vistos.has(`${it.plantilla}${idioma}`)) { vistos.add(`${it.plantilla}${idioma}`); revisa(txt, `porque ${it.plantilla}`); }
      }
      // una sola letra: x
      for (const l of it.lineas) assert.ok(!/[a-wyz]/i.test((l.ec ?? l.raw ?? '').replace(/\s/g, '')), `otra letra: ${l.ec ?? l.raw}`);
      // realismo: números pequeños (nada de cifras de varias decenas de miles)
      for (const l of it.lineas) for (const n of (l.ec ?? l.raw ?? '').match(/\d+/g) ?? []) assert.ok(Number(n) <= 1500, `número fuera de cota: ${l.ec ?? l.raw}`);
    }
  }
  const recorre = (x, ruta) => {
    if (typeof x === 'string') return revisa(x.replace(/<[^>]*>/g, ''), ruta);
    if (typeof x === 'function') return revisa(x(3), ruta);
    if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) recorre(v, `${ruta}.${k}`);
  };
  recorre(TX, 'TX');
  for (const [id, e] of Object.entries(ERRORES_TIPICOS)) { if (L.CLASE_DE[id]) { revisa(e.nombre.es, id); revisa(e.nombre.en, id); } }
});

test('los nombres y los textos están en los dos idiomas', () => {
  const comprueba = (x, ruta) => {
    if (x && typeof x === 'object' && ('es' in x || 'en' in x)) {
      assert.ok(x.es !== undefined && x.en !== undefined && String(x.es).length && String(x.en).length, `falta un idioma en ${ruta}`);
    } else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) comprueba(v, `${ruta}.${k}`);
  };
  comprueba(TX, 'TX');
  for (const it of generar(L.generarQue, 81).slice(0, 300)) {
    for (const idioma of ['es', 'en']) assert.ok(L.porque(it, idioma).length > 10);
    for (const l of it.lineas) if (l.t) assert.ok(l.t.es && l.t.en);
  }
});

test('hoja y examen: el mecanismo de exclusión funciona (al escribirla no existían ni la hoja ni el examen)', () => {
  assert.equal(L.HOJA.size, 0);
  assert.equal(L.HUELLAS_EXAMEN.size, 0);
  const it = generar(L.generarDonde, 91)[0];
  const q = aEcuacion(it.lineas[0].ec ?? L.PLANTILLA_POR_ID[it.plantilla].caso(it.params).aTexto());
  assert.equal(L.reservado(q), false);
  L.HOJA.add(q.clave());
  try { assert.equal(L.reservado(q), true); } finally { L.HOJA.delete(q.clave()); }
  assert.equal(L.reservado(q), false);
  // y un enunciado reservado no sale: se reserva cada enunciado de los primeros 200 ítems y no vuelve a salir
  const rng = crearRng(95);
  const primeros = Array.from({ length: 200 }, () => L.generarDonde(rng));
  const claves = primeros.map(i => L.PLANTILLA_POR_ID[i.plantilla].caso(i.params).clave());
  claves.forEach(c => L.HOJA.add(c));
  try {
    const rng2 = crearRng(95);
    for (let i = 0; i < 400; i++) {
      const x = L.generarDonde(rng2);
      assert.ok(!L.HOJA.has(L.PLANTILLA_POR_ID[x.plantilla].caso(x.params).clave()), 'salió un enunciado reservado');
    }
  } finally { claves.forEach(c => L.HOJA.delete(c)); }
});

test('la clave del ítem distingue y hay variedad', () => {
  for (const [fn, sem] of [[L.generarDonde, 101], [L.generarQue, 102], [L.generarCorrige, 103]]) {
    const claves = new Set(generar(fn, sem).map(L.claveItem));
    assert.ok(claves.size > N * 0.5, `poca variedad: ${claves.size}`);
  }
});
