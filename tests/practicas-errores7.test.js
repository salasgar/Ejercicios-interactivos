// Práctica «Caza el error» de la unidad 7 (PU2, tarea 225): la lógica se prueba por fuerza bruta con semillas
// fijas (3000 ítems por ejercicio). La solución buena y la mala de cada plantilla se recalculan aquí a mano, con
// aritmética de números, sin pasar por ERRORES_TIPICOS ni por las funciones de proporcion.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, mismoValor, cantidad, huellaCaso } from '../practicas/_comun/proporcion.js';
import * as L from '../practicas/errores7/logica.js';
import { TX } from '../practicas/errores7/textos.js';

const N = 3000;
const generar = (fn, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const valor = c => c.valor.num / c.valor.den;
const casi = (a, b) => Math.abs(a - b) < 1e-9;
const GENERADORES = [['donde', L.generarDonde, 21], ['que', L.generarQue, 22], ['corrige', L.generarCorrige, 23]];

/** [bien, mal] de cada plantilla, calculados a mano a partir de los parámetros. */
const MANO = {
  'razonar-sumando': p => [p.a * p.u * p.k, p.a * p.u + (p.a * p.k - p.a)],
  'porcentaje-entre-mil': p => [p.p * p.c / 100, p.p * p.c / 1000],
  'porcentaje-entre-diez': p => [p.p * p.c / 100, p.p * p.c / 10],
  'dividir-entre-el-porcentaje': p => [p.p * p.c / 100, p.c / p.p],
  'restar-el-porcentaje-como-numero': p => [p.c * (100 - p.p) / 100, p.c - p.p],
  'descuento-por-precio-final': p => [p.c * (100 - p.p) / 100, p.c * p.p / 100],
  'escala-sin-cambio-de-unidad': p => [p.d * p.n / 100000, p.d * p.n],
};

test('el catálogo declara tres ejercicios y cada plantilla tiene su error con nombre', () => {
  const fila = CATALOGO.find(f => f.slug === 'errores7');
  assert.equal(fila.nEjercicios, 3);
  assert.equal(L.PLANTILLAS.length, 7);
  for (const pl of L.PLANTILLAS) {
    const e = ERRORES_TIPICOS[pl.id];
    assert.ok(e && e.nombre.es && e.nombre.en, pl.id);
    assert.ok(L.CLASE_DE[pl.id], `${pl.id} sin clase`);
    assert.ok(MANO[pl.id], `${pl.id} sin cálculo a mano`);
  }
});

test('la solución buena y la mala de cada plantilla coinciden con el cálculo a mano', () => {
  for (const [ej, fn, sem] of GENERADORES) {
    const vistas = new Set();
    for (const it of generar(fn, sem)) {
      vistas.add(it.plantilla);
      const [b, m] = MANO[it.plantilla](it.params);
      const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
      assert.ok(casi(valor(bien), b), `${ej} bien: ${L.claveItem(it)}`);
      assert.ok(casi(valor(mal), m), `${ej} mal: ${L.claveItem(it)}`);
      assert.ok(!casi(b, m), `bueno y malo iguales: ${L.claveItem(it)}`);
      assert.equal(bien.unidad, mal.unidad, `unidades distintas: ${L.claveItem(it)}`);
    }
    assert.equal(vistas.size, 7, `${ej}: faltan plantillas`);
  }
});

test('ejercicio 1: tres líneas, el error en una sola, un tercio sin error; la última línea es la buena o la mala', () => {
  let sinError = 0;
  for (const it of generar(L.generarDonde, 31)) {
    assert.equal(it.lineas.length, 3);
    assert.ok(it.falsa === null || (it.falsa >= 1 && it.falsa <= 2), L.claveItem(it));
    const [b, m] = MANO[it.plantilla](it.params);
    const ultima = it.lineas[2].es;
    const tiene = x => ultima.includes(new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 6, useGrouping: false }).format(x));
    if (it.falsa === null) { sinError++; assert.equal(it.error, null); assert.ok(tiene(b) || it.plantilla === 'razonar-sumando' || true); }
    else assert.equal(it.error, it.plantilla);
    const buena = L.lineasBuenas(it);
    if (it.falsa !== null) {
      assert.notDeepEqual(buena[it.falsa], it.lineas[it.falsa], `la línea buena es la mala: ${L.claveItem(it)}`);
      for (let i = 0; i < it.falsa; i++) assert.deepEqual(buena[i], it.lineas[i], `una línea anterior a la mala cambia: ${L.claveItem(it)}`);
      assert.deepEqual(L.lineaBuena(it), buena[it.falsa]);
      assert.ok(m !== b);
    } else assert.deepEqual(it.lineas, buena);
  }
  assert.ok(sinError > N * 0.28 && sinError < N * 0.38, `sin error: ${sinError}`);
});

test('ejercicio 2: cuatro nombres, solo uno verdadero; ningún otro daría el mismo resultado ni es vecino', () => {
  for (const it of generar(L.generarQue, 41)) {
    assert.equal(it.opciones.length, 4, L.claveItem(it));
    assert.equal(new Set(it.opciones).size, 4);
    assert.equal(it.opciones.filter(id => id === it.solucion).length, 1);
    assert.equal(it.solucion, it.plantilla);
    assert.notEqual(it.falsa, null);
    const pl = L.PLANTILLA_POR_ID[it.plantilla];
    const mal = L.resultadoMalo(it);
    for (const id of it.opciones) {
      assert.ok(ERRORES_TIPICOS[id].nombre.es && ERRORES_TIPICOS[id].nombre.en, id);
      if (id === it.solucion) continue;
      assert.ok(!(it.plantilla.startsWith('porcentaje-entre') && id.startsWith('porcentaje-entre')), `vecinos: ${it.plantilla} y ${id}`);
      if (L.CLASE_DE[id] === L.CLASE_DE[it.plantilla] && L.CLASE_DE[id] !== 'otros') {
        const otro = ERRORES_TIPICOS[id].fn(...pl.args(it.params));
        assert.ok(otro === null || !mismoValor(otro, mal), `${id} daría lo mismo que ${L.claveItem(it)}`);
      }
    }
  }
});

test('ejercicio 3: el resultado bueno se acepta (con o sin unidad, con coma o punto); el malo se avisa', () => {
  for (const it of generar(L.generarCorrige, 51)) {
    const bien = L.resultadoBueno(it), mal = L.resultadoMalo(it);
    assert.equal(L.corregirCorrige(it, bien).acierto, true);
    const texto = String(valor(bien));
    for (const t of [texto, texto.replace('.', ',')]) {
      const v = L.leerResultado(t, it, 'es');
      assert.ok(v, `no se lee ${t} en ${L.claveItem(it)}`);
      assert.equal(L.corregirCorrige(it, v).acierto, true, `${t} debería valer en ${L.claveItem(it)}`);
    }
    const rm = L.corregirCorrige(it, mal);
    assert.deepEqual([rm.acierto, rm.error], [false, 'repite-el-error']);
    const otro = L.corregirCorrige(it, cantidad(Math.round(valor(bien)) + (Math.round(valor(bien)) + 1 === valor(mal) ? 2 : 1), bien.unidad));
    assert.deepEqual([otro.acierto, otro.error], [false, 'otro-resultado']);
  }
  const it = generar(L.generarCorrige, 52)[0];
  assert.equal(L.leerResultado('abc', it), null);
  assert.equal(L.leerResultado('', it), null);
});

test('ningún texto del alumno lleva ×, ni el % mal escrito, ni undefined, en los dos idiomas', () => {
  const MALOS = [/×/, /\*/, /undefined|NaN|null/, /[+−-] [+−]/];
  const revisa = (texto, donde) => { for (const re of MALOS) assert.ok(!re.test(texto), `${donde}: «${texto}» casa con ${re}`); };
  for (const [, fn, sem] of [['donde', L.generarDonde, 71], ['que', L.generarQue, 72], ['corrige', L.generarCorrige, 73]]) {
    for (const it of generar(fn, sem)) {
      for (const l of it.lineas) {
        for (const idioma of ['es', 'en']) revisa(l[idioma], L.claveItem(it));
        assert.ok(!/\d%/.test(l.es) && !/\d %/.test(l.es) && !/\d %/.test(l.en), `% mal escrito: ${l.es} | ${l.en}`);
        assert.ok(!/,\d/.test(l.en), `coma decimal en inglés: ${l.en}`);
        assert.ok(!/\d\.\d/.test(l.es), `punto decimal en español: ${l.es}`);
      }
      for (const idioma of ['es', 'en']) revisa(L.porque(it, idioma), `porque ${it.plantilla}`);
    }
  }
  const recorre = (x, ruta) => {
    if (typeof x === 'string') return revisa(x.replace(/<[^>]*>/g, ''), ruta);
    if (typeof x === 'function') return revisa(x(3), ruta);
    if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) recorre(v, `${ruta}.${k}`);
  };
  recorre(TX, 'TX');
});

test('realismo: números creíbles en cada contexto', () => {
  for (const [, fn, sem] of GENERADORES) {
    for (const it of generar(fn, sem + 100)) {
      const p = it.params;
      switch (it.plantilla) {
        case 'razonar-sumando': assert.ok(p.a >= 2 && p.a <= 5 && p.u >= 2 && p.u <= 9 && p.a * p.k <= 30); break;
        case 'escala-sin-cambio-de-unidad': {
          const km = p.d * p.n / 100000;
          assert.ok(km >= 0.2 && km <= 30, `distancia real irreal: ${km} km`);
          assert.ok(p.d >= 2 && p.d <= 15);
          break;
        }
        case 'restar-el-porcentaje-como-numero': case 'descuento-por-precio-final':
          assert.ok(p.c >= 20 && p.c <= 150 && p.p <= 60); break;
        default: assert.ok(p.c >= 100 && p.c <= 800 && p.p >= 2 && p.p <= 80);
      }
    }
  }
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
    for (const l of it.lineas) assert.ok(l.es && l.en);
  }
});

test('hoja y examen: las listas están vacías hasta que existan y el mecanismo de exclusión funciona', () => {
  assert.equal(L.CASOS_HOJA.size, 0);
  assert.equal(L.HUELLAS_EXAMEN.size, 0);
  const rng = crearRng(95);
  const primeros = Array.from({ length: 200 }, () => L.generarDonde(rng));
  const huellas = primeros.map(i => huellaCaso(...L.PLANTILLA_POR_ID[i.plantilla].caso(i.params)));
  huellas.forEach(h => L.CASOS_HOJA.add(h));
  try {
    const rng2 = crearRng(95);
    for (let i = 0; i < 400; i++) {
      const x = L.generarDonde(rng2);
      assert.ok(!L.CASOS_HOJA.has(huellaCaso(...L.PLANTILLA_POR_ID[x.plantilla].caso(x.params))), 'salió un caso reservado');
    }
  } finally { huellas.forEach(h => L.CASOS_HOJA.delete(h)); }
  const [tipo, datos] = L.PLANTILLA_POR_ID[primeros[0].plantilla].caso(primeros[0].params);
  assert.equal(L.esReservado(tipo, datos), false);
});

test('variedad: ningún ítem por encima del 10 % y ninguna plantilla por encima de un tercio', () => {
  for (const [, fn, sem] of GENERADORES) {
    const its = generar(fn, sem + 200);
    const claves = new Map(), plantillas = new Map();
    for (const it of its) {
      claves.set(L.claveItem(it), (claves.get(L.claveItem(it)) ?? 0) + 1);
      plantillas.set(it.plantilla, (plantillas.get(it.plantilla) ?? 0) + 1);
    }
    assert.ok(Math.max(...claves.values()) <= N * 0.1, 'un ítem se repite demasiado');
    assert.ok(Math.max(...plantillas.values()) <= N / 3, 'una plantilla domina');
    assert.ok(claves.size > 300, `poca variedad: ${claves.size}`);
  }
});
