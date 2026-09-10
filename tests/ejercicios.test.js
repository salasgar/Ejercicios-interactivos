import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIPOS, CONCEPTOS, crearRng, construirOpciones, tex, texFraccion, reducir } from '../src/ejercicios/index.js';
import { preguntaDe, feedbackDe } from '../src/textos.js';
import es from '../src/i18n/es.js';
import en from '../src/i18n/en.js';
import { aplicarNotacion, t } from '../src/i18n/index.js';

const SEMILLAS = 300;

for (const [id, tipo] of Object.entries(TIPOS)) {
  test(`${id}: ${SEMILLAS} ejercicios bien formados`, () => {
    assert.equal(tipo.id, id);
    assert.ok(CONCEPTOS[tipo.concepto], `concepto desconocido: ${tipo.concepto}`);
    const enunciados = new Set();
    for (let s = 1; s <= SEMILLAS; s++) {
      const rng = crearRng(s);
      const ej = tipo.generar(rng);
      assert.ok(ej.texto && ej.texto.clave, 'la pregunta debe ser { clave, params }');
      const conTipo = { ...ej, tipo: id };
      assert.ok(preguntaDe(conTipo, 'es').length > 0, `pregunta sin texto en español: ${ej.texto.clave}`);
      assert.ok(!/\{\w+\}/.test(preguntaDe(conTipo, 'es')), 'parámetro sin sustituir en la pregunta');
      assert.equal(typeof ej.enunciado, 'string');
      assert.ok(!/\\text/.test(ej.enunciado), 'el texto va en `texto`, no en el TeX');
      assert.ok(!/[:.]/.test(ej.enunciado.replace(/\\(cdot|div|frac|left|right|times)/g, '')), `TeX no neutro (usa {,} y \\div): ${ej.enunciado}`);
      assert.ok(ej.opciones.length === 4 || ej.opciones.length === 2, `semilla ${s}: debe haber 4 (o 2) opciones`);
      const correctas = ej.opciones.filter(o => o.correcta);
      assert.equal(correctas.length, 1, `semilla ${s}: debe haber exactamente una correcta`);
      assert.equal(correctas[0].error, null);
      const visibles = ej.opciones.map(o => o.tex ?? (typeof o.texto === 'string' ? o.texto : o.texto?.es));
      assert.equal(new Set(visibles).size, ej.opciones.length, `semilla ${s}: opciones repetidas en ${id}: ${visibles.join(' | ')}`);
      for (const o of ej.opciones) if (o.texto && typeof o.texto === 'object') assert.ok(o.texto.es && o.texto.en, 'texto de opción bilingüe incompleto');
      for (const o of ej.opciones) {
        const v = o.tex ?? (typeof o.texto === 'string' ? o.texto : o.texto?.es);
        assert.ok(typeof v === 'string' && v.length > 0, 'opción sin tex ni texto');
        assert.ok(!/NaN|undefined|Infinity/.test(v), `semilla ${s}: opción rara: ${v}`);
        if (!o.correcta) {
          assert.ok(o.error && o.error.id, `semilla ${s}: distractor sin error`);
          assert.ok(!('feedback' in o.error), 'el feedback va en la tabla `errores`, no en la opción');
          if (o.error.id !== 'generico') assert.ok(tipo.errores[o.error.id], `error ${o.error.id} sin entrada en la tabla de ${id}`);
          assert.ok(feedbackDe(id, o.error.id, 'es').length > 10, `feedback en español vacío para ${o.error.id}`);
          if (o.error.concepto) assert.ok(CONCEPTOS[o.error.concepto], `concepto desconocido ${o.error.concepto}`);
        }
      }
      assert.ok(!/NaN|undefined/.test(JSON.stringify(ej.texto) + ej.enunciado), `semilla ${s}: enunciado raro`);
      enunciados.add(JSON.stringify(ej.texto) + ej.enunciado + '|' + visibles.slice().sort().join(','));
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
    const ej = { ...TIPOS.divisibilidad.generar(crearRng(s)), tipo: 'divisibilidad' };
    const valores = ej.opciones.map(o => ({ v: Number(o.tex), ok: o.correcta }));
    const texto = preguntaDe(ej, 'es');
    let valido;
    let m;
    if ((m = texto.match(/múltiplo de (\d+)/))) valido = v => v % Number(m[1]) === 0;
    else if ((m = texto.match(/divisor de (\d+)/))) valido = v => Number(m[1]) % v === 0;
    else if ((m = texto.match(/divisible por (\d+)/))) valido = v => v % Number(m[1]) === 0;
    else if (/primo/.test(texto)) valido = esPrimo;
    else assert.fail(`pregunta desconocida: ${texto}`);
    for (const { v, ok } of valores) {
      assert.equal(valido(v), ok, `semilla ${s}: «${texto}» opción ${v} ${ok ? 'debería' : 'no debería'} ser válida`);
    }
  }
});

for (const [id, tipo] of Object.entries(TIPOS)) {
  test(`${id}: tablas bilingües completas (es y en) en errores, preguntas y nombre`, () => {
    assert.ok(tipo.nombre?.es && tipo.nombre?.en, 'nombre bilingüe');
    for (const [eid, e] of Object.entries(tipo.errores)) {
      assert.ok(e.es && e.es.length > 10, `${id}.errores.${eid}.es vacío`);
      assert.ok(e.en && e.en.length > 10, `${id}.errores.${eid}.en vacío`);
      assert.ok(e.concepto === null || e.concepto === undefined || CONCEPTOS[e.concepto], `concepto raro en ${eid}`);
    }
    for (const [pid, p] of Object.entries(tipo.preguntas ?? {})) {
      assert.ok(p.es && p.en, `${id}.preguntas.${pid} incompleta`);
    }
  });
}

// Tipos de cálculo: deben llevar solución paso a paso y, cada distractor con
// concepto, los pasos que llevan a él. Los pasos acaban en el valor de la opción.
const CON_PASOS = ['jerarquia', 'potencias', 'raices', 'enteros', 'divisibilidad', 'fracciones_equivalentes', 'suma_fracciones', 'producto_division_fracciones', 'decimales', 'expresiones_algebraicas', 'ecuaciones_primer_grado', 'proporcionalidad', 'porcentajes'];
const sinEspacios = x => String(x).replace(/\s+/g, '');
const acabaEn = (tex, valor) => sinEspacios(tex).endsWith('=' + sinEspacios(valor));

for (const id of CON_PASOS) {
  test(`${id}: solución paso a paso y pasos de cada distractor coherentes con los valores`, () => {
    const tipo = TIPOS[id];
    for (let s = 1; s <= 300; s++) {
      const ej = tipo.generar(crearRng(s));
      const correcta = ej.opciones.find(o => o.correcta);
      assert.ok(Array.isArray(ej.solucion) && ej.solucion.length > 0, `semilla ${s}: sin solución`);
      for (const p of ej.solucion) {
        assert.ok(p.tex && !p.mal, `semilla ${s}: paso de la solución raro`);
        assert.ok(!/[:.]/.test(p.tex.replace(/\\(cdot|div|frac|left|right|times|quad|sqrt|text)/g, '')), `semilla ${s}: TeX no neutro en un paso: ${p.tex}`);
        if (p.nota) {
          const clave = typeof p.nota === 'string' ? p.nota : p.nota.clave;
          assert.ok(tipo.notas?.[clave]?.es && tipo.notas?.[clave]?.en, `semilla ${s}: nota ${clave} sin texto bilingüe en ${id}`);
        }
      }
      // En divisibilidad los pasos son comprobaciones («24 = 6 · 4», «resto 3»): basta con que citen el valor.
      const coherente = tipo.pasosLibres ? (tex, v) => sinEspacios(tex).includes(sinEspacios(v)) : acabaEn;
      assert.ok(coherente(ej.solucion.at(-1).tex, correcta.tex), `semilla ${s}: la solución no acaba en la correcta (${ej.solucion.at(-1).tex} frente a ${correcta.tex})`);
      for (const o of ej.opciones) {
        if (o.correcta || o.error.id === 'generico') continue;
        assert.ok(Array.isArray(o.pasos) && o.pasos.length > 0, `semilla ${s}: distractor ${o.error.id} sin pasos`);
        assert.ok(o.pasos.some(p => p.mal), `semilla ${s}: ningún paso marcado como erróneo en ${o.error.id}`);
        assert.ok(o.pasos.some(p => coherente(p.tex, o.tex)), `semilla ${s}: los pasos de ${o.error.id} no acaban en su valor (${o.pasos.at(-1).tex} frente a ${o.tex})`);
      }
    }
  });
}

test('los diccionarios es y en tienen las mismas claves', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  for (const k of Object.keys(es)) assert.ok(es[k] && en[k], `clave vacía: ${k}`);
  assert.equal(t('ejercicio_de', { n: 3, total: 12 }, 'en'), 'Exercise 3 of 12');
});

test('aplicarNotacion adapta coma, producto y división', () => {
  assert.equal(aplicarNotacion('2{,}5 \\cdot 3 \\div 4', 'es'), '2{,}5 \\cdot 3 : 4');
  assert.equal(aplicarNotacion('2{,}5 \\cdot 3 \\div 4', 'en'), '2.5 \\times 3 \\div 4');
});

test('construirOpciones descarta repetidos y devuelve null si faltan', () => {
  const rng = crearRng(1);
  const err = { id: 'e', concepto: null };
  const correcta = { tex: '5', clave: 5 };
  assert.equal(construirOpciones(rng, correcta, [{ tex: '5', clave: 5, error: err }, { tex: '6', clave: 6, error: err }]), null);
  const ops = construirOpciones(rng, correcta, [
    { tex: '6', clave: 6, error: err }, { tex: '6', clave: 6, error: err }, { tex: '7', clave: 7, error: err },
  ], [{ tex: '8', clave: 8 }]);
  assert.equal(ops.length, 4);
  assert.deepEqual(ops.map(o => o.tex).sort(), ['5', '6', '7', '8']);
  assert.equal(ops.filter(o => o.correcta).length, 1);
  assert.equal(ops.find(o => o.tex === '8').error.id, 'generico');
  const conTexto = construirOpciones(rng, { texto: 'three squared', clave: 'a' }, [{ texto: 'three square', clave: 'b', error: err }, { texto: 'square three', clave: 'c', error: err }, { texto: 'three two', clave: 'd', error: err }]);
  assert.equal(conTexto.length, 4);
  assert.ok(conTexto.every(o => o.texto && !('tex' in o)));
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
