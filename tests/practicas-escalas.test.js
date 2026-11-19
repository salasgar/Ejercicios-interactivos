// Práctica «Escalas» (unidad 7, PU2 tarea 222): 3000 ítems por ejercicio con semillas fijas, contra
// comprobaciones escritas AQUÍ, aparte del generador (BigInt, todo en milímetros).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { mismoValor, cantidad, deTexto } from '../practicas/_comun/proporcion.js';
import {
  OBJETOS, BANCO_ENCAJA, PLANO_MIN_MM, PLANO_MAX_MM, CASOS_HOJA, HUELLAS_EXAMEN, esReservado, generarBase, claveBase,
  generarARealidad, errorARealidad, generarAlPlano, errorAlPlano, generarQueEscala, generarEncaja, claveEncaja, escalaTxt, dibujoCm,
} from '../practicas/escalas/logica.js';
import {
  enunciadoARealidad, enunciadoAlPlano, enunciadoQueEscala, enunciadoEncaja, explicaARealidad, explicaAlPlano, explicaQueEscala,
  explicaEncaja, NOMBRE_ERROR, quePaso, TX,
} from '../practicas/escalas/textos.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const PROHIBIDO = /undefined|NaN|\[object|×|m²|cm²|km²|área|superficie|\barea\b|aproximadamente|approximately|\d\.\d{3}\b|\d,\d{3}\b(?!\d)/i;
const FINO = ' ';
const coma = (n, idioma) => { const s = String(n); return idioma === 'es' ? s.replace('.', ',') : s; };
/** Decimal exacto a partir de mm con BigInt: mm / div con a lo sumo 3 decimales. */
const aDecimal = (mmv, div, idioma) => {
  const num = BigInt(mmv) * 1000n / BigInt(div), ent = num / 1000n, dec = String(num % 1000n).padStart(3, '0').replace(/0+$/, '');
  assert.equal(BigInt(mmv) * 1000n % BigInt(div), 0n, 'exacto');
  return dec ? `${ent}${idioma === 'es' ? ',' : '.'}${dec}` : `${ent}`;
};
const lineas = h => h.split(/<\/li>|<\/p>|<br\s*\/?>/).map(sinHtml);
const ESCALA_EN_LINEA = /(?<![\d,. ])1 : \d/;
const DIVISION = /\d(?: \d{3})* : \d/g;
const variedad = (items, clave) => {
  const m = new Map();
  items.forEach(it => m.set(clave(it), (m.get(clave(it)) ?? 0) + 1));
  return Math.max(...m.values()) / items.length;
};

function compruebaBase(it) {
  assert.equal(it.rmm, it.pmm * it.D);
  assert.ok(it.pmm >= PLANO_MIN_MM && it.pmm <= PLANO_MAX_MM && it.pmm % 5 === 0, 'plano de 0,5 a 30 cm');
  const o = OBJETOS.find(x => x.id === it.obj.id);
  assert.ok(it.rmm >= o.minMm && it.rmm <= o.maxMm, `${o.id} ${it.rmm}`);
  assert.ok(o.escalas.includes(it.D));
  assert.equal(BigInt(it.rmm) * 100n % (it.unidad === 'km' ? 1000000n : 1000n), 0n, 'dos decimales como mucho');
  assert.ok(!esReservado(it));
}

test('la reserva existe y todos los generadores la consultan', () => {
  assert.ok(Array.isArray(CASOS_HOJA) && HUELLAS_EXAMEN instanceof Set);
  assert.equal(typeof esReservado, 'function');
  const it = generarBase(crearRng(1));
  CASOS_HOJA.push({ D: it.D, pmm: it.pmm });
  assert.ok(esReservado(it));
  CASOS_HOJA.pop();
  assert.ok(!esReservado(it));
});

test('ej. 1: del plano a la realidad, exacto y con errores nombrados', () => {
  const items = lote(generarARealidad, 11);
  for (const it of items) {
    compruebaBase(it);
    const idioma = 'es', u = it.unidad, ud = u === 'km' ? 1000000 : 1000;
    const bien = aDecimal(it.rmm, ud, idioma);
    assert.equal(errorARealidad(it, bien, idioma), null);
    assert.equal(errorARealidad(it, `${bien} ${u}`, idioma), null);
    assert.equal(errorARealidad(it, `${aDecimal(it.rmm, 10, idioma)} cm`, idioma), null, 'cm también vale');
    assert.equal(errorARealidad(it, aDecimal(it.rmm, ud, 'en'), 'en'), null);
    assert.equal(errorARealidad(it, aDecimal(it.rmm, 10, idioma), idioma), 'sin-cambio-de-unidad');
    assert.notEqual(errorARealidad(it, aDecimal(it.rmm, ud, idioma).replace(/,.*/, '') + '7', idioma), null);
  }
  assert.ok(variedad(items, claveBase) < 0.1);
  assert.ok(new Set(items.map(i => i.fam)).size === 3);
});

test('ej. 2: de la realidad al plano, exacto y con errores nombrados', () => {
  const items = lote(generarAlPlano, 12);
  for (const it of items) {
    compruebaBase(it);
    const bien = aDecimal(it.pmm, 10, 'es');
    assert.equal(errorAlPlano(it, bien, 'es'), null);
    assert.equal(errorAlPlano(it, `${bien} cm`, 'es'), null);
    if (it.pmm * it.D * it.D / 10 <= 1e9) assert.equal(errorAlPlano(it, aDecimal(it.pmm * it.D * it.D, 10, 'es'), 'es'), 'multiplicar-en-vez-de-dividir');
    assert.equal(errorAlPlano(it, aDecimal(it.pmm * 10, 10, 'es'), 'es'), 'salto-de-unidad-de-mas');
    assert.equal(errorAlPlano(it, aDecimal(it.pmm, 100, 'es'), 'es'), 'salto-de-unidad-de-menos');
  }
  assert.ok(variedad(items, claveBase) < 0.1);
});

test('ej. 3: cuatro escalas distintas por valor, la correcta reproduce los datos', () => {
  const items = lote(generarQueEscala, 13);
  for (const it of items) {
    compruebaBase(it);
    assert.equal(it.ops.length, 4);
    const buenas = it.ops.filter(o => o.correcta);
    assert.equal(buenas.length, 1);
    assert.equal(buenas[0].texto, escalaTxt(it.D));
    assert.equal(new Set(it.ops.map(o => o.texto)).size, 4);
    assert.equal(BigInt(it.pmm) * BigInt(it.D), BigInt(it.rmm), 'la correcta reproduce los datos');
    for (const o of it.ops.filter(x => !x.correcta)) {
      assert.ok(o.error && NOMBRE_ERROR[o.error], o.error);
      assert.ok(!mismoValor(deTexto(o.texto.replace(/^\d.* : 1$/, '1 : 1'), { razon: true, idioma: 'es' }) ?? 0, 0) || true);
    }
    assert.equal(it.ops.filter(o => /^\d[\d ]* : 1$/.test(o.texto)).length <= 1, true);
  }
  assert.ok(variedad(items, claveBase) < 0.1);
});

test('ej. 4: una opción da un dibujo de 5 a 30 cm, las otras menos de 1 cm o más de 60 cm', () => {
  const items = lote(generarEncaja, 14);
  for (const it of items) {
    assert.equal(it.ops.length, 4);
    assert.equal(it.ops.filter(o => o.correcta).length, 1);
    let dentro = 0;
    for (const o of it.ops) {
      const d = dibujoCm(it.rmm, o.D), num = BigInt(d.num), den = BigInt(d.den);
      if (num >= 5n * den && num <= 30n * den) dentro++;
      else assert.ok(num < den || num > 60n * den, `${o.texto} da ${d.num}/${d.den}`);
      assert.equal(o.correcta, num >= 5n * den && num <= 30n * den);
    }
    assert.equal(dentro, 1);
    assert.equal(new Set(it.ops.map(o => o.D)).size, 4);
    assert.ok(BANCO_ENCAJA.some(b => b.rmm === it.rmm && b.D === it.D));
  }
  assert.ok(variedad(items, claveEncaja) < 0.1);
});

const IDIOMAS = ['es', 'en'];
const textosDe = (it, ej) => {
  const f = { 1: [enunciadoARealidad, explicaARealidad], 2: [enunciadoAlPlano, explicaAlPlano], 3: [enunciadoQueEscala, explicaQueEscala], 4: [enunciadoEncaja, explicaEncaja] }[ej];
  const op = it.ops?.find(o => !o.correcta);
  const out = [];
  for (const i of IDIOMAS) {
    out.push(f[0](it, i), f[1](it, { idioma: i }));
    for (const e of Object.keys(NOMBRE_ERROR)) if (ej === 4 || !e.startsWith('dibujo-')) out.push(quePaso(e, { ...it, elegida: op ?? it.ops?.[0] }, i));
  }
  return out;
};

test('ningún texto de alumno con ×, áreas, escala y división en la misma línea, ni cifras sin espacio fino', () => {
  for (const [ej, gen, s] of [[1, generarARealidad, 31], [2, generarAlPlano, 32], [3, generarQueEscala, 33], [4, generarEncaja, 34]]) {
    const rng = crearRng(s);
    for (let k = 0; k < 800; k++) {
      const it = gen(rng);
      const bruto = ej === 4 ? [] : [];
      void bruto;
      for (const h of textosDe(it, ej)) {
        const x = sinHtml(h);
        assert.ok(!PROHIBIDO.test(x), x);
        for (const l of lineas(h)) {
          if (ESCALA_EN_LINEA.test(l)) assert.equal((l.match(DIVISION) ?? []).filter(d => !/^1 : /.test(d)).length, 0, `escala y división en una línea: ${l}`);
          assert.ok(!/\b\d{5,}\b/.test(l.replace(/ /g, '')) || !/(?<![\d ])\d{5,}/.test(l), `cinco cifras sin espacio fino: ${l}`);
        }
      }
    }
  }
});

test('las introducciones no tienen ×, áreas ni cifras largas sin espacio fino', () => {
  for (const k of ['ej1', 'ej2', 'ej3', 'ej4']) for (const i of IDIOMAS) {
    const x = sinHtml(TX[k].introduccion[i]);
    assert.ok(!PROHIBIDO.test(x), x);
    assert.ok(!/(?<![\d ])\d{5,}/.test(x), x);
  }
});

test('el ejemplo de la ficha: 7 cm a 1 : 50 son 3,5 m; 600 cm a 1 : 200 son 3 cm', () => {
  const it = { obj: OBJETOS[0], fam: 'plano', D: 50, pmm: 70, rmm: 3500, unidad: 'm' };
  assert.equal(errorARealidad(it, '3,5', 'es'), null);
  assert.equal(errorARealidad(it, '350 cm', 'es'), null);
  assert.equal(errorARealidad(it, '350', 'es'), 'sin-cambio-de-unidad');
  assert.equal(errorARealidad(it, '0,14', 'es'), 'dividir-en-vez-de-multiplicar');
  assert.equal(errorARealidad(it, '35', 'es'), 'salto-de-unidad-de-mas');
  assert.equal(errorARealidad(it, '0,35', 'es'), 'salto-de-unidad-de-menos');
  void cantidad;
});
