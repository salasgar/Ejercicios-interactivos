import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIPOS, CONCEPTOS, crearRng, construirOpciones, tex, texFraccion, reducir } from '../src/ejercicios/index.js';

const SEMILLAS = 300;

for (const [id, tipo] of Object.entries(TIPOS)) {
  test(`${id}: ${SEMILLAS} ejercicios bien formados`, () => {
    assert.equal(tipo.id, id);
    assert.ok(CONCEPTOS[tipo.concepto], `concepto desconocido: ${tipo.concepto}`);
    const enunciados = new Set();
    for (let s = 1; s <= SEMILLAS; s++) {
      const rng = crearRng(s);
      const ej = tipo.generar(rng);
      assert.ok(ej.texto && ej.texto.length > 0, 'texto vacío');
      assert.equal(typeof ej.enunciado, 'string');
      assert.ok(!/\\text/.test(ej.enunciado), 'el texto va en `texto`, no en el TeX');
      assert.equal(ej.opciones.length, 4, `semilla ${s}: debe haber 4 opciones`);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `semilla ${s}: debe haber exactamente una correcta`);
      assert.equal(correctas[0].error, null);
      const texs = new Set(ej.opciones.map(o => o.tex));
      assert.equal(texs.size, 4, `semilla ${s}: opciones repetidas en ${id}: ${[...texs].join(' | ')}`);
      for (const o of ej.opciones) {
        assert.ok(o.tex.length > 0);
        assert.ok(!/NaN|undefined|Infinity/.test(o.tex), `semilla ${s}: TeX raro: ${o.tex}`);
        if (!o.correcta) {
          assert.ok(o.error && o.error.id && o.error.feedback, `semilla ${s}: distractor sin error`);
          if (o.error.concepto) assert.ok(CONCEPTOS[o.error.concepto], `concepto desconocido ${o.error.concepto}`);
        }
      }
      assert.ok(!/NaN|undefined/.test(ej.texto + ej.enunciado), `semilla ${s}: enunciado raro: ${ej.texto} ${ej.enunciado}`);
      enunciados.add(ej.texto + ej.enunciado + '|' + ej.opciones.map(o => o.tex).sort().join(','));
    }
    assert.ok(enunciados.size > SEMILLAS / 4, `${id}: poca variedad (${enunciados.size} ejercicios distintos)`);
  });

  test(`${id}: la misma semilla da el mismo ejercicio`, () => {
    const a = tipo.generar(crearRng(42)), b = tipo.generar(crearRng(42));
    assert.deepEqual(a, b);
  });

  test(`${id}: casi siempre hay algún distractor con concepto de refuerzo`, () => {
    let conConcepto = 0;
    for (let s = 1; s <= 100; s++) {
      const ej = tipo.generar(crearRng(s));
      if (ej.opciones.some(o => o.error?.concepto)) conConcepto++;
    }
    assert.ok(conConcepto >= 95, `${id}: solo ${conConcepto}/100 ejercicios con distractor con concepto`);
  });
}

test('divisibilidad: ningún distractor es también una respuesta válida', () => {
  const esPrimo = n => n > 1 && [...Array(n).keys()].slice(2).every(d => n % d !== 0);
  for (let s = 1; s <= 2000; s++) {
    const ej = TIPOS.divisibilidad.generar(crearRng(s));
    const valores = ej.opciones.map(o => ({ v: Number(o.tex), ok: o.correcta }));
    let valido;
    let m;
    if ((m = ej.texto.match(/múltiplo de (\d+)/))) valido = v => v % Number(m[1]) === 0;
    else if ((m = ej.texto.match(/divisor de (\d+)/))) valido = v => Number(m[1]) % v === 0;
    else if ((m = ej.texto.match(/divisible por (\d+)/))) valido = v => v % Number(m[1]) === 0;
    else if (/primo/.test(ej.texto)) valido = esPrimo;
    else assert.fail(`pregunta desconocida: ${ej.texto}`);
    for (const { v, ok } of valores) {
      assert.equal(valido(v), ok, `semilla ${s}: «${ej.texto}» opción ${v} ${ok ? 'debería' : 'no debería'} ser válida`);
    }
  }
});

test('construirOpciones descarta repetidos y devuelve null si faltan', () => {
  const rng = crearRng(1);
  const err = { id: 'e', concepto: null, feedback: 'f' };
  const correcta = { tex: '5', clave: 5 };
  assert.equal(construirOpciones(rng, correcta, [{ tex: '5', clave: 5, error: err }, { tex: '6', clave: 6, error: err }]), null);
  const ops = construirOpciones(rng, correcta, [
    { tex: '6', clave: 6, error: err }, { tex: '6', clave: 6, error: err }, { tex: '7', clave: 7, error: err },
  ], [{ tex: '8', clave: 8 }]);
  assert.equal(ops.length, 4);
  assert.deepEqual(ops.map(o => o.tex).sort(), ['5', '6', '7', '8']);
  assert.equal(ops.filter(o => o.correcta).length, 1);
  assert.equal(ops.find(o => o.tex === '8').error.id, 'generico');
});

test('tex usa coma decimal y texFraccion simplifica el signo', () => {
  assert.equal(tex(2.5), '2{,}5');
  assert.equal(tex(-3), '-3');
  assert.equal(tex(0.1 + 0.2), '0{,}3');
  assert.equal(texFraccion(-3, 4), '-\\frac{3}{4}');
  assert.equal(texFraccion(3, -4), '-\\frac{3}{4}');
  assert.equal(texFraccion(6, 1), '6');
  assert.equal(texFraccion(0, 9), '0');
  assert.deepEqual(reducir(6, -8), [-3, 4]);
});

test('el ejemplo del enunciado: 2 + 3·10² tiene 302 entre las opciones y feedback por error', () => {
  // Buscamos una semilla que produzca la forma a + b·c² y comprobamos la estructura.
  let encontrado = null;
  for (let s = 1; s < 500 && !encontrado; s++) {
    const ej = TIPOS.jerarquia.generar(crearRng(s));
    if (/\^\{2\}/.test(ej.enunciado)) encontrado = ej;
  }
  assert.ok(encontrado);
  const ids = encontrado.opciones.filter(o => !o.correcta).map(o => o.error.id);
  assert.ok(ids.includes('potencia_como_producto') || ids.includes('ignorar_exponente'));
  const potencias = encontrado.opciones.filter(o => o.error?.concepto === 'potencias');
  assert.ok(potencias.length >= 1, 'debe haber un distractor que refuerce potencias');
});
