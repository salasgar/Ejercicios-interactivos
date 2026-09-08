import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numeroAIngles, numeroAInglesSinAnd, numeroAEspanol } from '../src/ejercicios/palabras.js';
import { TIPOS, crearRng } from '../src/ejercicios/index.js';

// ---------------------------------------------------------------------------
// Conversores número → palabras.

test('numeroAIngles: casos básicos', () => {
  assert.equal(numeroAIngles(0), 'zero');
  assert.equal(numeroAIngles(1), 'one');
  assert.equal(numeroAIngles(13), 'thirteen');
  assert.equal(numeroAIngles(19), 'nineteen');
  assert.equal(numeroAIngles(20), 'twenty');
  assert.equal(numeroAIngles(21), 'twenty-one');
  assert.equal(numeroAIngles(31), 'thirty-one');
  assert.equal(numeroAIngles(99), 'ninety-nine');
});

test('numeroAIngles: casos difíciles con centenas', () => {
  assert.equal(numeroAIngles(100), 'one hundred');
  assert.equal(numeroAIngles(101), 'one hundred and one');
  assert.equal(numeroAIngles(200), 'two hundred');
  assert.equal(numeroAIngles(173), 'one hundred and seventy-three');
  assert.equal(numeroAInglesSinAnd(173), 'one hundred seventy-three');
  assert.equal(numeroAInglesSinAnd(101), 'one hundred one');
});

test('numeroAIngles: miles', () => {
  assert.equal(numeroAIngles(1000), 'one thousand');
  assert.equal(numeroAIngles(1001), 'one thousand and one');
  assert.equal(numeroAInglesSinAnd(1001), 'one thousand one');
  assert.equal(numeroAIngles(2000), 'two thousand');
  assert.equal(numeroAIngles(2005), 'two thousand and five');
  assert.equal(numeroAIngles(1234), 'one thousand two hundred and thirty-four');
  assert.equal(numeroAIngles(1000000), 'one million');
});

test('numeroAEspanol: casos básicos', () => {
  assert.equal(numeroAEspanol(0), 'cero');
  assert.equal(numeroAEspanol(1), 'uno');
  assert.equal(numeroAEspanol(11), 'once');
  assert.equal(numeroAEspanol(12), 'doce');
  assert.equal(numeroAEspanol(13), 'trece');
  assert.equal(numeroAEspanol(15), 'quince');
  assert.equal(numeroAEspanol(16), 'dieciséis');
  assert.equal(numeroAEspanol(19), 'diecinueve');
  assert.equal(numeroAEspanol(21), 'veintiuno');
  assert.equal(numeroAEspanol(31), 'treinta y uno');
});

test('numeroAEspanol: casos difíciles con centenas', () => {
  assert.equal(numeroAEspanol(100), 'cien');
  assert.equal(numeroAEspanol(101), 'ciento uno');
  assert.equal(numeroAEspanol(173), 'ciento setenta y tres');
  assert.equal(numeroAEspanol(200), 'doscientos');
  assert.equal(numeroAEspanol(500), 'quinientos');
  assert.equal(numeroAEspanol(700), 'setecientos');
  assert.equal(numeroAEspanol(900), 'novecientos');
});

test('numeroAEspanol: miles y millón', () => {
  assert.equal(numeroAEspanol(1000), 'mil');
  assert.equal(numeroAEspanol(1001), 'mil uno');
  assert.equal(numeroAEspanol(2000), 'dos mil');
  assert.equal(numeroAEspanol(2300), 'dos mil trescientos');
  assert.equal(numeroAEspanol(21000), 'veintiún mil');
  assert.equal(numeroAEspanol(1000000), 'un millón');
});

// ---------------------------------------------------------------------------
// Comprobaciones específicas de los dos tipos de ejercicio.

test('lenguaje_ingles: nunca usa la otra forma válida (con/sin "and") como distractor', () => {
  for (let s = 1; s <= 500; s++) {
    const ej = TIPOS.lenguaje_ingles.generar(crearRng(s));
    if (ej.texto.clave !== 'numero_en_palabras') continue;
    const n = Number(ej.enunciado);
    const validas = new Set([numeroAIngles(n), numeroAInglesSinAnd(n)]);
    for (const o of ej.opciones) {
      if (!o.correcta) assert.ok(!validas.has(o.texto), `semilla ${s}: distractor "${o.texto}" es en realidad una forma válida de ${n}`);
    }
  }
});

test('lenguaje_ingles: "que_numero" tiene la palabra interpolada en la pregunta', () => {
  for (let s = 1; s <= 200; s++) {
    const ej = TIPOS.lenguaje_ingles.generar(crearRng(s));
    if (ej.texto.clave === 'que_numero') {
      assert.ok(ej.texto.params.palabras.length > 0);
      const correcta = ej.opciones.find(o => o.correcta);
      assert.equal(correcta.tex, String(Number(correcta.tex)));
    }
  }
});

test('lenguaje_ingles: aparecen varias de las formas de ejercicio', () => {
  const claves = new Set();
  for (let s = 1; s <= 300; s++) claves.add(TIPOS.lenguaje_ingles.generar(crearRng(s)).texto.clave);
  for (const clave of ['numero_en_palabras', 'que_numero', 'como_se_lee', 'bien_escrito', 'ordinal', 'se_escribe']) {
    assert.ok(claves.has(clave), `no se generó nunca la forma "${clave}"`);
  }
});

test('lenguaje_ingles: "se_escribe" sale aproximadamente 1 de cada 4 veces, con 2 opciones Correct/Incorrect', () => {
  let veces = 0;
  for (let s = 1; s <= 800; s++) {
    const ej = TIPOS.lenguaje_ingles.generar(crearRng(s));
    if (ej.texto.clave !== 'se_escribe') continue;
    veces++;
    assert.equal(ej.opciones.length, 2, `semilla ${s}: se_escribe debe tener 2 opciones`);
    assert.ok(typeof ej.texto.params.n !== 'undefined' && ej.texto.params.palabras, `semilla ${s}: faltan params`);
    const textos = ej.opciones.map(o => o.texto);
    assert.deepEqual(textos[0], { es: 'Correcto', en: 'Correct' });
    assert.deepEqual(textos[1], { es: 'Incorrecto', en: 'Incorrect' });
    assert.equal(ej.opciones.filter(o => o.correcta).length, 1);
  }
  assert.ok(veces > 800 * 0.15 && veces < 800 * 0.4, `frecuencia rara de "se_escribe": ${veces}/800`);
});

test('lenguaje_espanol: nunca usa "veintiún mil" ni casos de apócope dudosa como correcta', () => {
  for (let s = 1; s <= 500; s++) {
    const ej = TIPOS.lenguaje_espanol.generar(crearRng(s));
    if (ej.texto.clave !== 'numero_en_palabras') continue;
    const correcta = ej.opciones.find(o => o.correcta);
    assert.ok(!/\bveintiún\b|\bciento un\b|\btreinta y un\b/.test(correcta.texto), `semilla ${s}: forma con apócope dudosa: ${correcta.texto}`);
  }
});

test('lenguaje_espanol: aparecen varias de las formas de ejercicio', () => {
  const claves = new Set();
  for (let s = 1; s <= 300; s++) claves.add(TIPOS.lenguaje_espanol.generar(crearRng(s)).texto.clave);
  for (const clave of ['numero_en_palabras', 'que_numero', 'como_se_lee', 'se_escribe']) {
    assert.ok(claves.has(clave), `no se generó nunca la forma "${clave}"`);
  }
});

test('lenguaje_espanol: "se_escribe" sale aproximadamente 1 de cada 4 veces, con 2 opciones Correcto/Incorrecto', () => {
  let veces = 0;
  for (let s = 1; s <= 800; s++) {
    const ej = TIPOS.lenguaje_espanol.generar(crearRng(s));
    if (ej.texto.clave !== 'se_escribe') continue;
    veces++;
    assert.equal(ej.opciones.length, 2, `semilla ${s}: se_escribe debe tener 2 opciones`);
    assert.ok(typeof ej.texto.params.n !== 'undefined' && ej.texto.params.palabras, `semilla ${s}: faltan params`);
    const textos = ej.opciones.map(o => o.texto);
    assert.deepEqual(textos[0], { es: 'Correcto', en: 'Correct' });
    assert.deepEqual(textos[1], { es: 'Incorrecto', en: 'Incorrect' });
    assert.equal(ej.opciones.filter(o => o.correcta).length, 1);
  }
  assert.ok(veces > 800 * 0.15 && veces < 800 * 0.4, `frecuencia rara de "se_escribe": ${veces}/800`);
});

test('lenguaje_espanol: "se_escribe" detecta la falta de tilde en dieciséis/veintidós/veintitrés/veintiséis', () => {
  let visto = false;
  for (let s = 1; s <= 3000 && !visto; s++) {
    const ej = TIPOS.lenguaje_espanol.generar(crearRng(s));
    if (ej.texto.clave !== 'se_escribe') continue;
    const distractor = ej.opciones.find(o => !o.correcta);
    if (distractor?.error?.id === 'sin_tilde') visto = true;
  }
  assert.ok(visto, 'nunca se generó el distractor "sin_tilde"');
});
