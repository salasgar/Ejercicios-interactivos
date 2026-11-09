// Práctica «Léelo en inglés» de la unidad 6: 3000 ítems por ejercicio con semillas fijas. Cuatro
// opciones, una buena; ningún texto repetido; cada falsa con un error definido y su «por qué» en los
// dos idiomas; nunca se enfrentan dos formas válidas (SINONIMOS); ni ×, ni porcentajes, ni x²; y en
// «Léelo» un lector de inglés escrito AQUÍ, aparte del generador, confirma qué dice cada opción.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  VOCABULARIO, SINONIMOS, ERRORES_LEELO, generarPalabra, generarLeelo, generarConsigna, generarCompleta,
  nombreDe, ESTA_DEFINIDO, esReservado, RESERVADOS_HOJA, HUELLAS_EXAMEN, claveItem, PLANTILLAS_LEELO,
} from '../practicas/leelo6/logica.js';
import { TX } from '../practicas/leelo6/textos.js';

const N = 3000;
const DESP = Number(process.env.SEMILLA_LEELO6 ?? 0);
const items = (generar, semilla) => {
  const rng = crearRng(semilla + DESP);
  return Array.from({ length: N }, () => generar(rng));
};
const plano = h => h.replace(/<[^>]+>/g, '');
const correcta = it => it.opciones.find(o => o.correcta);

const GEN = [['palabra', generarPalabra, 11], ['leelo', generarLeelo, 22], ['consigna', generarConsigna, 33], ['completa', generarCompleta, 44]];

for (const [nombre, gen, semilla] of GEN) {
  test(`leelo6 · ${nombre}: estructura de 3000 ítems`, () => {
    const vistos = new Set();
    for (const it of items(gen, semilla)) {
      assert.equal(it.opciones.length, 4, it.plantilla);
      assert.equal(it.opciones.filter(o => o.correcta).length, 1, `${it.plantilla}: una sola buena`);
      const textos = it.opciones.map(o => o.texto);
      assert.equal(new Set(textos).size, 4, `${it.plantilla}: textos repetidos ${textos}`);
      assert.ok(TX.instrucciones[it.instruccion], `instrucción ${it.instruccion}`);
      assert.ok(it.solucion.es && it.solucion.en);
      for (const o of it.opciones.filter(x => !x.correcta)) {
        assert.ok(ESTA_DEFINIDO(o.error), `${it.plantilla}: error ${o.error}`);
        assert.ok(o.por_que.es && o.por_que.en);
      }
      const todo = it.opciones.map(o => o.texto).join(' ') + plano(it.notacion) + it.solucion.es + it.solucion.en;
      assert.ok(!/×|%|x²|undefined|NaN|\[object/.test(todo), `${it.plantilla}: ${todo}`);
      vistos.add(claveItem(it));
    }
    assert.ok(vistos.size > 40, `variedad: ${vistos.size}`);
  });
}

test('leelo6 · nunca se enfrentan sinónimos válidos', () => {
  for (const [nombre, gen, semilla] of GEN) {
    for (const it of items(gen, semilla)) {
      const ts = it.opciones.map(o => o.texto.toLowerCase());
      for (const [a, b] of SINONIMOS) {
        assert.ok(!(ts.includes(a.toLowerCase()) && ts.includes(b.toLowerCase())), `${nombre}: ${a} / ${b}`);
      }
    }
  }
});

test('leelo6 · palabra: en cada ítem, dos términos de la misma familia no se enfrentan', () => {
  const fam = new Map(VOCABULARIO.flatMap(v => [[v.en, v.familia], [v.es, v.familia]]));
  for (const it of items(generarPalabra, 11)) {
    const fs = it.opciones.map(o => fam.get(o.texto));
    assert.ok(fs.every(Boolean), 'término desconocido');
    assert.equal(new Set(fs).size, 4, it.opciones.map(o => o.texto).join(' | '));
  }
});

// ─── Lector independiente de inglés (expresiones y ecuaciones de una letra) ─────────────

const N_EN = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const UNIDADES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const DECENAS = ['', '', 'twenty', 'thirty', 'forty'];
const DE = new Map();
for (let k = 1; k <= 49; k++) DE.set(k < 20 ? UNIDADES[k] : DECENAS[Math.floor(k / 10)] + (k % 10 ? `-${UNIDADES[k % 10]}` : ''), k);
/** Devuelve [a, b, c] de «a x + b = c»; c null si no hay «equals». Null si no entiende la frase. */
function leerEn(t) {
  let [izq, der] = t.split(/ (?:equals|is equal to) /);
  const c = der === undefined ? null : DE.get(der);
  if (der !== undefined && c === undefined) return null;
  let b = 0, signo = 1;
  const m = izq.match(/^(minus )?(?:(\S+) (?:times )?)?(\w) ?(?:(?:over|divided by) (\S+))?(?: (plus|minus) (\S+))?$/);
  if (!m) return null;
  const [, neg, coef, , den, op, cons] = m;
  const k = coef === undefined ? 1 : DE.get(coef);
  if (k === undefined) return null;
  let a = (neg ? -1 : 1) * k;
  if (den !== undefined) { const d = DE.get(den); if (!d) return null; a = a / d; }
  if (op) { const v = DE.get(cons); if (v === undefined) return null; b = op === 'plus' ? v : -v; }
  void signo;
  return [a, b, c];
}

test('leelo6 · léelo: el lector de inglés confirma que la buena es la fórmula y las falsas no', () => {
  let comprobadas = 0;
  for (const it of items(generarLeelo, 22)) {
    if (it.plantilla !== 'leer_expresion' && it.plantilla !== 'leer_ecuacion') continue;
    const [a0, b0, c0] = leerEn(correcta(it).texto) ?? [];
    assert.ok(a0 !== undefined, `no leo la buena: ${correcta(it).texto}`);
    for (const o of it.opciones.filter(x => !x.correcta)) {
      const r = leerEn(o.texto);
      if (!r) continue;
      comprobadas++;
      assert.ok(r[0] !== a0 || r[1] !== b0 || r[2] !== c0, `la falsa dice lo mismo: ${o.texto} = ${correcta(it).texto}`);
    }
  }
  assert.ok(comprobadas > 1000, `comprobadas ${comprobadas}`);
});

test('leelo6 · sin casos reservados (hoy están vacíos) y errores bilingües', () => {
  assert.equal(RESERVADOS_HOJA.size + HUELLAS_EXAMEN.size, 0);
  assert.equal(esReservado({ clave: () => 'x' }), false);
  for (const id of Object.keys(ERRORES_LEELO)) assert.ok(nombreDe(id).es && nombreDe(id).en, id);
  assert.ok(PLANTILLAS_LEELO.length >= 5);
});

test('leelo6 · las plantillas de completa y consigna salen todas', () => {
  const pl = new Set(items(generarCompleta, 44).map(i => i.plantilla));
  assert.ok(pl.size >= 12, [...pl].join());
  const pc = new Set(items(generarConsigna, 33).map(i => i.plantilla));
  assert.equal(pc.size, 4, [...pc].join());
});
