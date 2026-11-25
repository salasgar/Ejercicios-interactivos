// Subtipos de los generadores de proporcionalidad y porcentajes y destrezas del inventario de la
// unidad 7 que declara cada uno (tarea 233 del reparto PU2). Fuerza bruta: 3000 ítems por subtipo,
// con la correcta recalculada aparte desde los parámetros del enunciado, las cotas de realismo de
// cada contexto (acta de la U7), el dinero exacto al céntimo y la regla de oro: ninguna opción vale
// lo mismo que otra.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// index.js primero: los generadores importan de él y el ciclo solo se resuelve así.
import { TIPOS, crearRng } from '../src/ejercicios/index.js';
import { preguntaDe } from '../src/textos.js';
import { SUBTIPOS as subProp } from '../src/ejercicios/proporcionalidad.js';
import { SUBTIPOS as subPorc } from '../src/ejercicios/porcentajes.js';
import {
  COMPRA_PESO, RECETAS, OBREROS, ESCALAS, REPARTOS, GRUPOS, REBAJAS, SUBIDAS, SUBIDA, IVA_CONTEXTOS, DESCUENTOS, INTERES,
} from '../src/ejercicios/contextos_proporcionalidad.js';

const ID_U7 = /^U7-[1-5][ABC]-\d{2}$/;
const SEMILLAS = 3000;
const INVENTARIO = (() => {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'docencia', 'rutas.json'), 'utf8'));
    return path.join(cfg.apuntes, '7. Proportionality', 'inventario-unidad7.tsv');
  } catch (e) { return null; }
})();

const TIPOS_U7 = ['proporcionalidad', 'porcentajes'];
for (const id of TIPOS_U7) {
  const tipo = TIPOS[id];
  test(`${id}: cada subtipo declara destrezas con identificador U7-… y el módulo es su unión`, () => {
    assert.ok(tipo.subtipos?.length > 0, `${id}: sin subtipos`);
    const ids = tipo.subtipos.map(s => s.id);
    assert.equal(new Set(ids).size, ids.length, 'ids de subtipo repetidos');
    for (const { id: sid, items } of tipo.subtipos) {
      assert.ok(Array.isArray(items) && items.length > 0, `${sid}: sin items`);
      for (const it of items) assert.match(it, ID_U7, `${sid}: identificador raro «${it}»`);
      assert.equal(new Set(items).size, items.length, `${sid}: items repetidos`);
    }
    assert.deepEqual(tipo.items, [...new Set(tipo.subtipos.flatMap(s => s.items))].sort());
  });

  test(`${id}: todos los ids existen en el inventario de la unidad 7 y ninguno es tipo_test = no (si está el fichero)`, { skip: !(INVENTARIO && fs.existsSync(INVENTARIO)) && 'sin el inventario (carpeta de iCloud)' }, () => {
    const filas = fs.readFileSync(INVENTARIO, 'utf8').normalize('NFC').split('\n').slice(1).filter(Boolean).map(f => f.split('\t'));
    const porId = new Map(filas.map(f => [f[0], f]));
    for (const it of tipo.items) {
      assert.ok(porId.has(it), `${it} no está en el inventario`);
      assert.notEqual(porId.get(it)[8], 'no', `${it} es tipo_test = no`);
    }
  });
}

// ---------------------------------------------------------------------------
// Parámetros del enunciado y recálculo independiente de la correcta (en céntimos o unidades).

const cents = s => Math.round(parseFloat(String(s).replace(',', '.')) * 100);
const dec = s => parseFloat(String(s).replace(',', '.'));
const valorOpcion = o => Number(o.tex.replace('{,}', '.'));
const ctxDe = (clave, prefijo, lista) => {
  const c = lista.find(x => clave === `${prefijo}_${x.id}`);
  assert.ok(c, `clave sin contexto: ${clave}`);
  return c;
};
const enRango = (v, [min, max], que) => assert.ok(v >= min && v <= max, `${que} = ${v} fuera de [${min}, ${max}]`);
const entero = (v, que) => assert.ok(Number.isInteger(v), `${que} = ${v} no es entero`);

/** { valor (en las unidades de la opción) } y comprobación de cotas, por subtipo. */
const COMPROBACIONES = {
  directa_unidad({ texto: { clave, params: { a, b, c } } }) {
    const ctx = ctxDe(clave, 'directa_unidad', COMPRA_PESO);
    const total = cents(b);
    entero(total * c / a, 'precio');
    const precioKg = total / a;
    entero(precioKg, 'precio por kg');
    enRango(a, ctx.kg, 'kg'); enRango(c, ctx.kg, 'kg pedidos');
    enRango(precioKg, ctx.precioKg, 'precio por kg');
    assert.ok(precioKg * c <= ctx.maxTotal, 'total absurdo');
    return precioKg * c / 100;
  },
  directa_receta({ texto: { clave, params: { a, b, c } } }) {
    const ctx = ctxDe(clave, 'directa_receta', RECETAS);
    enRango(a, ctx.personas, 'personas'); enRango(c, ctx.personas, 'personas pedidas');
    const u = b / a;
    entero(u, 'cantidad por persona');
    enRango(u, ctx.porPersona, 'cantidad por persona');
    assert.ok(b <= ctx.max && b * c / a <= ctx.max && b * c / a >= 50 && b >= 50, 'cantidad fuera de cocina');
    return b * c / a;
  },
  inversa({ texto: { clave, params: { a, b, c } } }) {
    const ctx = ctxDe(clave, 'inversa', OBREROS);
    enRango(a, ctx.n, 'trabajadores'); enRango(c, ctx.n, 'trabajadores nuevos');
    enRango(b, ctx.t, 'tiempo');
    const r = a * b / c;
    entero(r, 'resultado');
    enRango(r, ctx.t, 'tiempo resultado');
    return r;
  },
  escala_a_real({ texto: { clave, params: { N, cm } } }) {
    const ctx = ctxDe(clave, 'escala_a_real', ESCALAS);
    assert.ok(ctx.escalas.includes(N), `escala 1 : ${N} no permitida`);
    enRango(cm, ctx.cmPlano, 'cm del plano');
    const real = cm * N / ctx.divisor;
    enRango(real, [ctx.realMin, ctx.realMax], 'medida real');
    return real;
  },
  escala_a_plano({ texto: { clave, params: { N, real } } }) {
    const ctx = ctxDe(clave, 'escala_a_plano', ESCALAS);
    assert.ok(ctx.escalas.includes(N), `escala 1 : ${N} no permitida`);
    enRango(dec(real), [ctx.realMin, ctx.realMax], 'medida real');
    const cm = dec(real) * ctx.divisor / N;
    assert.ok(Math.abs(cm - Math.round(cm)) < 1e-9, `cm del plano no entero: ${cm}`);
    enRango(Math.round(cm), ctx.cmPlano, 'cm del plano');
    return Math.round(cm);
  },
  reparto_razon({ texto: { params: { total, a, b } } }) {
    const t = cents(total);
    assert.ok(a !== b && a >= 1 && b >= 1 && a <= 9 && b <= 9);
    assert.equal(t % (a + b), 0, 'el reparto no es exacto al céntimo');
    enRango(t, [100, 600000], 'premio (cents)');
    return t * a / (a + b) / 100;
  },
  reparto_aportaciones({ texto: { clave, params: { lista, total } } }) {
    const ctx = ctxDe(clave, 'reparto_aportaciones', REPARTOS);
    const datos = lista.split(/,| y /).map(s => Number(s.trim()));
    enRango(datos.length, ctx.personas, 'personas');
    for (const d of datos) { enRango(d, ctx.dato, 'dato'); assert.equal(d % ctx.paso, 0); }
    const t = cents(total), suma = datos.reduce((x, y) => x + y, 0);
    assert.equal((t * datos[0]) % suma, 0, 'el reparto no es exacto al céntimo');
    enRango(t, ctx.premio, 'premio (cents)');
    return t * datos[0] / suma / 100;
  },

  porcentaje_facil({ texto: { params: { p, cantidad } } }) {
    assert.ok([1, 10, 20, 25, 50, 75].includes(p));
    assert.equal(cantidad * p % 100, 0);
    return cantidad * p / 100;
  },
  grupo_parte({ texto: { clave, params: { t, p } } }) {
    const ctx = ctxDe(clave, 'grupo_parte', GRUPOS);
    enRango(t, ctx.t, 'total'); enRango(p, [1, 99], 'porcentaje');
    assert.equal(t * p % 100, 0, 'personas no enteras');
    return t * p / 100;
  },
  grupo_resto({ texto: { clave, params: { t, p } } }) {
    const ctx = ctxDe(clave, 'grupo_resto', GRUPOS);
    enRango(t, ctx.t, 'total'); enRango(p, [1, 99], 'porcentaje');
    assert.equal(t * p % 100, 0, 'personas no enteras');
    return t - t * p / 100;
  },
  grupo_total({ texto: { clave, params: { p, n } } }) {
    const ctx = ctxDe(clave, 'grupo_total', GRUPOS);
    enRango(p, [1, 99], 'porcentaje');
    assert.equal(n * 100 % p, 0, 'total no entero');
    enRango(n * 100 / p, ctx.t, 'total');
    return n * 100 / p;
  },
  grupo_cual({ texto: { clave, params: { t, n } } }) {
    const ctx = ctxDe(clave, 'grupo_cual', GRUPOS);
    enRango(t, ctx.t, 'total');
    assert.equal(n * 100 % t, 0, 'el porcentaje no sale exacto');
    enRango(n * 100 / t, [1, 99], 'porcentaje');
    return n * 100 / t;
  },
  descuento({ texto: { clave, params: { precio, p } } }) {
    const ctx = ctxDe(clave, 'descuento', REBAJAS.map(r => ({ ...r })));
    assert.ok(DESCUENTOS.includes(p), `descuento ${p} fuera de la lista`);
    const c = cents(precio);
    enRango(c, ctx.precio, 'precio'); assert.equal(c * p % 100, 0);
    return c * (100 - p) / 100 / 100;
  },
  subida({ texto: { clave, params: { precio, p } } }) {
    const ctx = ctxDe(clave, 'subida', SUBIDAS);
    enRango(p, [SUBIDA.min, SUBIDA.max], 'subida');
    const c = cents(precio);
    enRango(c, ctx.precio, 'precio'); assert.equal(c * p % 100, 0);
    return c * (100 + p) / 100 / 100;
  },
  iva({ texto: { clave, params: { precio, p } } }) {
    const ctx = ctxDe(clave, 'iva', IVA_CONTEXTOS);
    assert.ok(ctx.iva.includes(p) && [4, 10, 21].includes(p), `IVA ${p}`);
    const c = cents(precio);
    enRango(c, ctx.precio, 'precio'); assert.equal(c * p % 100, 0);
    return c * (100 + p) / 100 / 100;
  },
  precio_original({ texto: { clave, params: { precio, p } } }) {
    const ctx = ctxDe(clave, 'precio_original', REBAJAS);
    assert.ok(DESCUENTOS.includes(p));
    const f = cents(precio);
    assert.equal(f * 100 % (100 - p), 0, 'el original no sale exacto');
    const o = f * 100 / (100 - p);
    enRango(o, ctx.precio, 'precio original');
    return o / 100;
  },
  interes_simple({ texto: { params: { capital, p } } }) {
    const c = cents(capital);
    enRango(p, INTERES.tipo, 'tipo'); enRango(c, INTERES.capital.map(x => x * 100), 'capital');
    assert.equal(c * p % 100, 0);
    return c * p / 100 / 100;
  },
  interes_compuesto({ texto: { params: { capital, p, anos } } }) {
    enRango(p, INTERES.tipo, 'tipo'); enRango(anos, [2, 3], 'años');
    let cap = cents(capital), total = 0;
    enRango(cap, INTERES.capital.map(x => x * 100), 'capital');
    for (let y = 0; y < anos; y++) {
      assert.equal(cap * p % 100, 0, `interés del año ${y + 1} no exacto al céntimo`);
      const i = cap * p / 100;
      total += i; cap += i;
    }
    return total / 100;
  },
};

const DINERO = new Set(['directa_unidad', 'reparto_razon', 'reparto_aportaciones', 'descuento', 'subida', 'iva', 'precio_original', 'interes_simple', 'interes_compuesto']);

const subtipos = [
  ...subProp.map(s => ({ tipoId: 'proporcionalidad', ...s })),
  ...subPorc.map(s => ({ tipoId: 'porcentajes', ...s })),
];

test('todo subtipo tiene su comprobación en este test', () => {
  assert.deepEqual(subtipos.map(s => s.id).sort(), Object.keys(COMPROBACIONES).sort());
});

for (const { tipoId, id, generar } of subtipos) {
  test(`${tipoId}/${id}: ${SEMILLAS} ítems con 4 opciones de valor distinto, una correcta y bien calculada, y las cotas del contexto`, () => {
    const comprobar = COMPROBACIONES[id];
    for (let s = 1; s <= SEMILLAS; s++) {
      const ej = generar(crearRng(s));
      const donde = `semilla ${s} (${ej.texto.clave})`;
      assert.equal(ej.opciones.length, 4, donde);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `${donde}: ${correctas.length} correctas`);
      // Regla de oro: ninguna opción vale lo mismo que otra.
      const valores = ej.opciones.map(valorOpcion);
      assert.equal(new Set(valores).size, 4, `${donde}: dos opciones valen lo mismo: ${ej.opciones.map(o => o.tex).join(' | ')}`);
      for (const v of valores) assert.ok(Number.isFinite(v) && v >= 0, `${donde}: valor raro ${v}`);
      // La correcta es lo que sale del enunciado, calculado aparte.
      const esperado = comprobar(ej);
      assert.ok(Math.abs(valorOpcion(correctas[0]) - esperado) < 1e-9, `${donde}: la correcta ${correctas[0].tex} no es ${esperado}`);
      // Dinero: siempre con dos decimales, en céntimos exactos.
      if (DINERO.has(id)) for (const o of ej.opciones) assert.match(o.tex, /^\d+\{,\}\d\d$/, `${donde}: dinero mal escrito «${o.tex}»`);
      else for (const o of ej.opciones) assert.ok(!/\.\d/.test(o.tex), `${donde}: punto decimal en «${o.tex}»`);
      // La solución acaba en la correcta; los pasos de cada distractor, en su valor.
      const ult = ej.solucion[ej.solucion.length - 1].tex;
      assert.ok(ult.endsWith(`= ${correctas[0].tex}`), `${donde}: la solución acaba en «${ult}», no en ${correctas[0].tex}`);
      assert.equal(ej.enunciado, '');
      for (const o of ej.opciones.filter(x => !x.correcta)) {
        assert.ok(o.error?.id && TIPOS[tipoId].errores[o.error.id], `${donde}: distractor sin error válido`);
        assert.ok(o.pasos?.some(p => p.mal), `${donde}: distractor sin paso erróneo`);
        assert.ok(o.pasos[o.pasos.length - 1].tex.endsWith(`= ${o.tex}`), `${donde}: los pasos del distractor ${o.tex} acaban en «${o.pasos[o.pasos.length - 1].tex}»`);
      }
      // Textos: sin parámetros sin sustituir, números a la española o a la inglesa, % con espacio duro solo en español.
      const es = preguntaDe({ ...ej, tipo: tipoId }, 'es'), en = preguntaDe({ ...ej, tipo: tipoId }, 'en');
      assert.ok(!/[{}]/.test(es + en), `${donde}: parámetro sin sustituir`);
      assert.ok(!/\d\.\d/.test(es), `${donde}: punto decimal en español: ${es}`);
      assert.ok(!/\d,\d/.test(en), `${donde}: coma decimal en inglés: ${en}`);
      assert.ok(!/\d%/.test(es) && !/ %/.test(en), `${donde}: «%» mal escrito`);
    }
  });
}
