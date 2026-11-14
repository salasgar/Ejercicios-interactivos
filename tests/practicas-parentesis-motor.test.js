// Motor común de «Coloca los paréntesis» (practicas/_comun/parentesis-motor.js, tarea 199).
//   1. Equivalencia con la U1: con ARITMETICA_NATURALES, el motor da lo mismo que
//      practicas/parentesis/logica.js (la práctica que le gusta a Juan Luis) en 3000 ítems de
//      cada uno de sus cuatro ejercicios: árboles, resultados, validez y razón, pasos,
//      colocación, árbol que da cada valor y pistas.
//   2. Casos fijos de la ficha, con las cuatro aritméticas, y su escritura.
//   3. Alcanzables: con cada aritmética, en 200 expresiones al azar, TODAS las colocaciones del
//      editor (0-2 «(» y 0-2 «)» por número) dan exactamente los valores de `resultados`.
//   4. La clave de la expresión, `buscar` con `anterior` y el recuento de caídas en la reserva.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import * as U1 from '../practicas/parentesis/logica.js';
import {
  crearMotor, ARITMETICA_NATURALES, aritmeticaEnteros, aritmeticaFracciones, aritmeticaDecimales, huella,
} from '../practicas/_comun/parentesis-motor.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import { decimal } from '../practicas/_comun/decimales.js';

const NAT = crearMotor(ARITMETICA_NATURALES);
const ENT = crearMotor(aritmeticaEnteros({ tope: 200 }));
const FRA = crearMotor(aritmeticaFracciones({ topeNum: 60, topeDen: 36 }));
const DEC = crearMotor(aritmeticaDecimales({ cifras: 3, tope: 500, negativos: false }));
const plano = html => html.replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ex = (numeros, operaciones, exponente = null) => ({ numeros, operaciones, exponente });
const valorDe = (M, e, p = null) => M.evaluar(M.interpretar(e, p).arbol);
const ceros = n => ({ abre: Array(n).fill(0), cierra: Array(n).fill(0) });

// ─── 1. Equivalencia con la U1 ─────────────────────────────────────────────────────

for (const ejercicio of [1, 2, 3, 4]) {
  test(`equivalencia con la U1, ejercicio ${ejercicio}: 3000 ítems, todo igual`, () => {
    const rng = crearRng(19900 + ejercicio);
    const azar = crearRng(29900 + ejercicio);
    for (let i = 0; i < 3000; i++) {
      const item = U1.generar(ejercicio, rng);
      const e = U1.expresionDe(item);
      const n = e.numeros.length;
      const que = `${U1.textoExpresion(e)} (ej. ${ejercicio}, ítem ${i})`;
      const viejos = U1.arboles(e), nuevos = NAT.arboles(e);
      assert.deepEqual(nuevos.map(NAT.claveArbol), viejos.map(U1.clave), `árboles — ${que}`);
      assert.deepEqual(NAT.resultados(e), U1.resultados(e), `resultados — ${que}`);
      assert.deepEqual(NAT.resultados(e), item.resultados, `resultados del ítem — ${que}`);
      viejos.forEach((a, k) => {
        const rv = U1.evaluar(a), rn = NAT.evaluar(nuevos[k]);
        assert.equal(rn.valor, rv.valor, `valor — ${que}`);
        assert.equal(rn.invalido?.razon, rv.invalido?.razon, `razón — ${que}`);
        assert.equal(rn.invalido?.paso, rv.invalido?.paso, `paso del fallo — ${que}`);
        assert.deepEqual(rn.pasos.map(NAT.claveSecuencia), rv.pasos, `pasos — ${que}`);
        assert.deepEqual(NAT.colocacion(nuevos[k], n), U1.colocacion(a, n), `colocación — ${que}`);
        assert.equal(NAT.alcanzable(nuevos[k], n), U1.alcanzable(a, n), `alcanzable — ${que}`);
      });
      for (const v of item.resultados) {
        assert.equal(NAT.claveArbol(NAT.arbolQueDa(e, v)), U1.clave(U1.arbolQueDa(e, v)), `arbolQueDa(${v}) — ${que}`);
      }
      assert.equal(NAT.arbolQueDa(e, 99999), null);
      // Pistas: desde vacío, desde la primera pista y desde una colocación al azar.
      const faltanV = new Set(item.resultados.filter(v => v !== item.sinParentesis));
      const faltanK = new Set([...faltanV].map(NAT.clave));
      const desde = [ceros(n)];
      const primera = U1.pistaPara(e, ceros(n), faltanV);
      if (primera) desde.push(primera);
      desde.push({ abre: Array.from({ length: n }, () => azar.entero(0, 2)), cierra: Array.from({ length: n }, () => azar.entero(0, 2)) });
      for (const c of desde) assert.deepEqual(NAT.pistaPara(e, c, faltanK), U1.pistaPara(e, c, faltanV), `pista — ${que}`);
      // Lo que coloca el alumno: el mismo árbol, el mismo «no agrupan» y el mismo texto.
      const c = desde.at(-1);
      const iv = U1.interpretar(e, c), inn = NAT.interpretar(e, c);
      assert.equal(inn.error, iv.error, `interpretar — ${que}`);
      if (!iv.error) {
        assert.equal(NAT.claveArbol(inn.arbol), U1.clave(iv.arbol));
        assert.equal(inn.redundantes, iv.redundantes);
      }
      assert.equal(NAT.textoColocacion(e, c), U1.textoColocacion(e, c));
      assert.equal(plano(NAT.htmlArbol(U1.sinParentesis(e))), plano(U1.formatear(U1.textoExpresion(e))).replace(/<sup>/g, ''), `escritura — ${que}`);
    }
  });
}

// ─── 2. Casos fijos ────────────────────────────────────────────────────────────────

test('casos fijos: izquierda a derecha, restas con enteros, la base negativa y el ejemplo de la ficha', () => {
  assert.equal(valorDe(NAT, ex([12, 6, 2], ['/', '/'])).valor, 1, '12 : 6 : 2 = 1');
  const resta = ex([6, 1, 8], ['-', '-']);
  const r = valorDe(ENT, resta, { abre: [0, 1, 0], cierra: [0, 0, 1] });
  assert.equal(r.valor, 13, '6 − (1 − 8) = 13');
  assert.equal(plano(ENT.cadenaPasos(r.pasos)), '6 − (1 − 8) = 6 − (−7) = 13', 'el negativo detrás de una resta, entre paréntesis');
  assert.equal(valorDe(NAT, resta, { abre: [0, 1, 0], cierra: [0, 0, 1] }).invalido.razon, 'negativo', 'en la U1, 1 − 8 no se puede');

  const pot = valorDe(ENT, ex([-3, 1], ['+'], 2), { abre: [1, 0], cierra: [0, 1] });
  assert.equal(pot.valor, 4);
  assert.equal(plano(ENT.htmlSecuencia(pot.pasos[1])), '(−2)^2', '(−3 + 1)² se escribe (−2)² en el paso, nunca −2²');

  const e = ex([-4, 2, 3, 2], ['*', '+', '*'], 2);
  assert.equal(valorDe(ENT, e).valor, 4, '−4 · 2 + 3 · 2² = 4');
  assert.equal(valorDe(ENT, e, { abre: [1, 0, 0, 0], cierra: [0, 0, 1, 0] }).valor, -20, '(−4 · 2 + 3) · 2² = −20');
  assert.equal(plano(ENT.htmlArbol(ENT.sinParentesis(e))), '−4 · 2 + 3 · 2^2', 'el primero, sin paréntesis');

  assert.equal(valorDe(ENT, ex([7, 2], ['/'])).invalido.razon, 'inexacta', '7 : 2 en enteros');
  assert.equal(valorDe(ENT, ex([-7, 2], ['/'])).invalido.razon, 'inexacta');
  assert.equal(valorDe(DEC, ex([1, 3], ['/'])).invalido.razon, 'inexacta', '1 : 3 en decimales');
  assert.equal(valorDe(DEC, ex([decimal(1, 1), decimal(3, 0)], ['/'])).invalido.razon, 'inexacta', '0,1 : 3');
  assert.equal(valorDe(DEC, ex([1, 8], ['/'])).valor.clave(), '1/8', '1 : 8 = 0,125 (tres cifras) sí');
  assert.equal(valorDe(DEC, ex([1, 16], ['/'])).invalido.razon, 'inexacta', '1 : 16 = 0,0625 pasa de tres cifras');
  assert.equal(valorDe(DEC, ex([2, 5], ['-'])).invalido.razon, 'negativo', 'sin negativos en la U5');
  assert.equal(valorDe(DEC, ex([decimal(25, 2)], [], 3)).invalido?.razon, 'inexacta', '0,25³ pasa de tres cifras');
  assert.equal(valorDe(ENT, ex([15, 15], ['*'])).invalido.razon, 'grande', '225 > 200');
  assert.equal(valorDe(FRA, ex([fraccion(61, 2), 1], ['*'])).invalido.razon, 'grande', 'numerador > 60');
  // Ninguna división entre 0 se hace, con ninguna aritmética.
  for (const M of [NAT, ENT, FRA, DEC]) {
    const cero = valorDe(M, ex([5, 2, 2], ['/', '-']), { abre: [0, 1, 0], cierra: [0, 0, 1] });
    assert.equal(cero.invalido.razon, 'cero', `${M.aritmetica.nombre}: 5 : (2 − 2)`);
  }
});

test('casos fijos: un chip por valor (3/4 = 6/8; 0,5 = 0,50) y la escritura de cada aritmética', () => {
  const a = valorDe(FRA, ex([fraccion(1, 2), fraccion(1, 4)], ['+'])).valor;
  assert.equal(FRA.clave(a), FRA.clave(fraccion(3, 4)));
  assert.ok(FRA.mismoValor(fraccion(6, 8), fraccion(3, 4)));
  assert.equal(a.den, 4, 'cada resultado, irreducible');
  assert.ok(DEC.mismoValor(valorDe(DEC, ex([decimal(5, 1), 3], ['*'])).valor, decimal(150, 2)), '0,5 · 3 y 1,50');
  assert.ok(DEC.mismoValor(decimal(5, 1), decimal(50, 2)));
  // resultados deduplica por valor: (1/2 + 1/2) · 2 = 2 y 1/2 + 1/2 · 2 = 3/2 → dos; 1/4 · 2 = 1/2 = 2/4.
  const r = FRA.resultados(ex([fraccion(1, 2), fraccion(1, 2), 2], ['+', '*']));
  assert.deepEqual(r.map(f => f.clave()), ['3/2', '2']);
  const dosIguales = DEC.resultados(ex([decimal(5, 1), decimal(5, 1), 2], ['+', '*']));
  assert.equal(new Set(dosIguales.map(DEC.clave)).size, dosIguales.length);
  // Escritura: fracción con raya, decimal con coma o punto, el menos U+2212.
  assert.match(FRA.htmlValor(fraccion(3, 4), 'es'), /class="frac"/);
  assert.match(FRA.htmlValor(fraccion(3, 4), 'es', { compacta: true }), /frac--compacta/);
  assert.equal(FRA.htmlValor(fraccion(4, 2), 'es'), '2', 'un entero, como entero');
  assert.match(FRA.htmlValor(fraccion(-1, 3), 'es', { detras: true }), /^\(<span class="frac-neg">−/);
  assert.match(FRA.htmlValor(fraccion(2, 3), 'es', { base: true }), /^\(<span class="frac">/, '(2/3)²');
  assert.equal(DEC.htmlValor(decimal(150, 2), 'es'), '1,5', 'sin ceros de más');
  assert.equal(DEC.htmlValor(decimal(5, 1), 'en'), '0.5');
  assert.equal(ENT.htmlValor(-5, 'es'), '−5');
  assert.equal(ENT.htmlValor(-5, 'es', { detras: true }), '(−5)');
  assert.equal(plano(ENT.htmlOperacion(-7, '/', 2, 'en')), '−7 ÷ 2');
  assert.equal(plano(ENT.htmlOperacion(5, '*', -2, 'es')), '5 · (−2)');
  const conPar = ENT.htmlColocacion(ex([-3, 2, 4], ['+', '*']), { abre: [1, 0, 0], cierra: [0, 1, 0] }, 'es');
  assert.equal(plano(conPar), '(−3 + 2) · 4', 'el primero de un grupo, sin paréntesis de más');
  const frac4 = FRA.htmlArbol(FRA.sinParentesis(ex([fraccion(-1, 2), fraccion(1, 3), 3], ['+', '*'])), 'es');
  assert.doesNotMatch(plano(frac4), /\//, 'nunca una barra a la vista en las fracciones');
  assert.equal((frac4.match(/class="frac"/g) ?? []).length, 2, 'cada fracción con su raya');
  assert.ok(!/×/.test(plano(NAT.htmlOperacion(2, '*', 3))), 'producto con «·»');
});

test('casos fijos: un paréntesis solo alrededor del primer negativo no agrupa nada', () => {
  const e = ex([-3, 2, 4], ['+', '*']);
  const r = ENT.interpretar(e, { abre: [1, 0, 0], cierra: [1, 0, 0] });
  assert.equal(r.redundantes, true);
  assert.equal(ENT.interpretar(e, { abre: [1, 0, 0], cierra: [0, 0, 0] }).error, 'desequilibrados');
});

// ─── 3. Alcanzables ────────────────────────────────────────────────────────────────

/** Los valores (por clave) de TODAS las colocaciones del editor que se pueden calcular. */
function valoresDelEditor(M, e) {
  const n = e.numeros.length;
  const vistos = new Map();
  const claves = new Set();
  for (let m = 0; m < 9 ** n; m++) {
    const c = ceros(n);
    let r = m;
    for (let i = 0; i < n; i++) { c.abre[i] = r % 3; r = Math.floor(r / 3); c.cierra[i] = r % 3; r = Math.floor(r / 3); }
    const t = M.interpretar(e, c);
    if (t.error) continue;
    const k = M.claveArbol(t.arbol);
    if (vistos.has(k)) continue;
    const ev = M.evaluar(t.arbol);
    vistos.set(k, ev);
    if (ev.valor !== undefined) claves.add(M.clave(ev.valor));
  }
  return claves;
}

const AL_AZAR = {
  naturales: [NAT, rng => rng.entero(2, 12)],
  enteros: [ENT, (rng, i) => (i === 0 && rng.azar() < 0.5 ? -rng.entero(1, 9) : rng.entero(2, 9))],
  fracciones: [FRA, (rng, i) => (rng.azar() < 0.3 ? rng.entero(2, 5) : fraccion((i === 0 && rng.azar() < 0.3 ? -1 : 1) * rng.entero(1, 7), rng.elegir([2, 3, 4, 5, 6])).simplificar())],
  decimales: [DEC, rng => (rng.azar() < 0.4 ? rng.entero(2, 10) : decimal(rng.entero(1, 99), rng.elegir([1, 2])).normalizar())],
};

for (const [nombre, [M, numero]] of Object.entries(AL_AZAR)) {
  test(`alcanzables (${nombre}): en 200 expresiones, todas las colocaciones del editor dan exactamente los resultados`, () => {
    const rng = crearRng(4242 + nombre.length);
    let probadas = 0, conImposibles = 0;
    while (probadas < 200) {
      const largo = probadas % 2 ? 4 : 3;
      const ops = nombre === 'fracciones' ? ['+', '-', '*', '/'] : ['+', '-', '*', '/'];
      const e = ex(
        Array.from({ length: largo }, (_, i) => numero(rng, i)),
        Array.from({ length: largo - 1 }, () => rng.elegir(ops)),
        nombre !== 'fracciones' && probadas % 4 < 2 ? rng.elegir([2, 2, 3]) : null,
      );
      const an = M.analizar(e);
      if (!an.todos.every(a => M.alcanzable(a, largo))) continue;   // `buscar` ya las descarta
      probadas++;
      if (an.invalidos.length) conImposibles++;
      const chips = new Set(M.resultados(e).map(M.clave));
      assert.equal(chips.size, M.resultados(e).length, 'un chip por valor');
      assert.deepEqual([...valoresDelEditor(M, e)].sort(), [...chips].sort(), `${plano(M.htmlArbol(M.sinParentesis(e)))}`);
    }
    assert.ok(conImposibles > 0, 'también con agrupaciones que no se pueden');
  });
}

// ─── 4. Clave de la expresión, buscar y anterior ───────────────────────────────────

test('buscar: no repite la expresión anterior, cumple `vale` y cuenta las caídas en la reserva', () => {
  const M = crearMotor(aritmeticaEnteros({ tope: 200 }));
  const rng = crearRng(7);
  const hacer = () => ex([rng.entero(2, 3), 2, 2], [rng.elegir(['+', '*']), '*']);
  let anterior = null;
  for (let i = 0; i < 300; i++) {
    const e = M.buscar(rng, hacer, an => an.valores.length >= 1, ex([9, 9, 9], ['+', '+']), { anterior });
    if (anterior) assert.notEqual(M.claveExpresion(e), M.claveExpresion(anterior), 'dos seguidas, distintas');
    anterior = M.itemDe('todos', e);
  }
  assert.deepEqual(M.estadisticas, { llamadas: 300, caidas: 0 });
  const reserva = ex([1, 1, 1], ['+', '+']);
  assert.equal(M.buscar(rng, hacer, () => false, reserva, { intentos: 50 }), reserva);
  assert.equal(M.estadisticas.caidas, 1);
  // La clave va por valor: 0,5 y 0,50 son la misma expresión; 1/2 y 2/4, también.
  assert.equal(DEC.claveExpresion(ex([decimal(5, 1), 2], ['+'])), DEC.claveExpresion(ex([decimal(50, 2), 2], ['+'])));
  assert.equal(FRA.claveExpresion(ex([fraccion(2, 4), 2], ['+'])), FRA.claveExpresion(ex([fraccion(1, 2), 2], ['+'])));
  assert.notEqual(ENT.claveExpresion(ex([2, 3, 4], ['+', '*'])), ENT.claveExpresion(ex([2, 3, 4], ['+', '*'], 2)));
  assert.match(huella(ENT.claveExpresion(ex([-3, 2, 4], ['+', '*']))), /^[0-9a-z]+$/);
  assert.equal(huella('abc'), (() => { let h = 0x811c9dc5; for (const c of 'abc') { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); })());
});

test('itemDe: los resultados ordenados por valor, sin repetidos, y el de sin paréntesis entre ellos', () => {
  const item = FRA.itemDe('todos', ex([fraccion(1, 2), fraccion(1, 3), 3], ['+', '*']));
  assert.deepEqual(item.resultados.map(f => f.clave()), ['3/2', '5/2']);
  assert.ok(item.resultados.some(v => FRA.mismoValor(v, item.sinParentesis)));
  // El ítem sobrevive a JSON (la base lo compara con JSON.stringify y lo registra así).
  const copia = JSON.parse(JSON.stringify(item));
  assert.deepEqual(FRA.resultados(FRA.expresionDe(copia)).map(FRA.clave), item.resultados.map(FRA.clave));
  const d = DEC.itemDe('todos', ex([decimal(5, 1), 3, 2], ['*', '+']));
  const copiaD = JSON.parse(JSON.stringify(d));
  assert.deepEqual(DEC.resultados(DEC.expresionDe(copiaD)).map(DEC.clave), d.resultados.map(DEC.clave));
});
