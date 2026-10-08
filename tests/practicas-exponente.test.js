// Práctica «El exponente y su base»: cada ejercicio se comprueba por fuerza
// bruta contra una definición independiente, no contra las propias funciones
// de logica.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  generarAlcance, aciertaAlcance, idBaseDe, generarParte,
  generarRepetida, secuenciaCorrecta, aciertaRepetida,
  generarPotencia, aciertaPotencia,
  generarValor, generarMultiplicacion,
  generarAreas, respuestasAreas, aciertaAreas,
  cuentaParte, cuentaErronea, cuentaTocada, valorTocado, valorParte, REGIONES, lecturaIngles,
} from '../practicas/exponente/logica.js';
import { TX } from '../practicas/exponente/textos.js';

test('ejercicio 1: las cuentas del feedback terminan en el valor correcto y en el erróneo, y son distintos', () => {
  const rng = crearRng(5);
  // Valor de una expresión escrita con JavaScript, leída tal como se ve (sin <sup>).
  const js = parte => parte.replace(/<sup>(\d)<\/sup>/g, '**$1').replace(/·/g, '*');
  const valorEscrito = cuenta => Function(`"use strict"; return (${js(cuenta.split(' = ')[0])});`)();
  for (let i = 0; i < 3000; i++) {
    const p = generarParte(rng);
    const buena = cuentaParte(p), mala = cuentaErronea(p);
    const final = c => Number(c.split(' = ').at(-1));
    // Cada paso de la cadena vale lo mismo que el primero, y el último es el resultado.
    for (const c of [buena, mala]) {
      const v = valorEscrito(c);
      c.split(' = ').forEach(paso => assert.equal(Function(`"use strict"; return (${js(paso)});`)(), v, c));
      assert.equal(final(c), v);
    }
    assert.notEqual(final(buena), final(mala), `${buena} / ${mala}`);
  }
});

test('ejercicio 1: «lo que has tocado daría» corresponde a la región tocada, con su cuenta y su valor, y nunca coincide con el correcto', () => {
  const rng = crearRng(6);
  const js = parte => parte.replace(/<sup>(\d)<\/sup>/g, '**$1').replace(/·/g, '*');
  // Definición independiente: el exponente aplicado solo a la región tocada.
  const esperado = (p, id) => {
    const { a, b, c, e } = p;
    if (p.forma === 'simple') return id === 'a' ? (a ** e) * b : a * b ** e;
    if (p.forma === 'suma') return id === 'a' ? a ** e + b : a + b ** e;
    if (p.forma === 'grupo') return id === 'b' ? a * b ** e : (a * b) ** e;
    if (p.forma === 'sumagrupo') return id === 'b' ? a + b ** e : (a + b) ** e;
    return { a: a ** e * (b + c), c: a * (b + c ** e), grupo: a * (b + c) ** e }[id];
  };
  const vistos = new Set();
  for (let i = 0; i < 4000; i++) {
    const p = generarParte(rng);
    for (const id of REGIONES[p.forma]) {
      assert.equal(valorTocado(p, id), esperado(p, id), `${p.forma} ${id}`);
      if (id === idBaseDe(p.forma)) continue;
      vistos.add(`${p.forma}/${id}`);
      const cuenta = cuentaTocada(p, id);
      const v = Function(`"use strict"; return (${js(cuenta.split(' = ')[0])});`)();
      assert.equal(v, esperado(p, id), `${cuenta}`);
      assert.equal(Number(cuenta.split(' = ').at(-1)), v);
      cuenta.split(' = ').forEach(paso => assert.equal(Function(`"use strict"; return (${js(paso)});`)(), v, cuenta));
      assert.notEqual(v, valorParte(p), `tocar ${id} daría lo mismo: ${cuenta}`);
    }
  }
  assert.equal(vistos.size, 6); // simple/a suma/a grupo/b sumagrupo/b intermedia/a intermedia/c
});

test('ejercicio 2 (repetida): solo es acierto el producto de «exponente» factores iguales a la base', () => {
  const rng = crearRng(12);
  for (let i = 0; i < 300; i++) {
    const item = generarRepetida(rng);
    const valores = [...new Set(item.fichas.map(f => f.valor))];
    // definición independiente: alternancia número · número … con exponente números, todos iguales a la base
    const vale = seq => seq.length === 2 * item.exponente - 1
      && seq.every((v, k) => (k % 2 ? v === '·' : v === item.base));
    for (let t = 0; t < 400; t++) {
      const largo = rng.entero(1, 2 * item.exponente);
      const seq = Array.from({ length: largo }, () => rng.elegir(valores));
      assert.equal(aciertaRepetida(item, seq), vale(seq), JSON.stringify(seq));
    }
    // Los señuelos permiten otros productos con el mismo valor (2 · 8 = 16), pero no son «factores iguales a la base»:
    assert.equal(aciertaRepetida(item, [item.base, '·', item.base ** item.exponente]), false);
  }
});

test('ejercicio 2 (potencia): se avisa cuando lo que puso el alumno vale lo mismo (4 · 4 es 2⁴ y 4²)', () => {
  const casos = [[2, 4, 4, 2], [4, 2, 2, 4], [3, 4, 9, 2], [9, 2, 3, 4], [4, 3, 8, 2], [8, 2, 4, 3]];
  for (const [b, e, pb, pe] of casos) {
    assert.equal(b ** e, pb ** pe);
    const prod = Array(e).fill(b).join(' · ');
    assert.match(TX.potencia.mal.es(b, e, prod, pb, pe), /vale lo mismo/);
    assert.match(TX.potencia.mal.en(b, e, prod, pb, pe), /same value/);
  }
  const rng = crearRng(31);
  for (let i = 0; i < 1000; i++) {
    const item = generarPotencia(rng);
    const pb = rng.entero(2, 9), pe = rng.entero(2, 4);
    const prod = Array(item.exponente).fill(item.base).join(' · ');
    const igual = pb ** pe === item.base ** item.exponente;
    assert.equal(/vale lo mismo/.test(TX.potencia.mal.es(item.base, item.exponente, prod, pb, pe)), igual);
    assert.equal(aciertaPotencia(item, pb, pe), pb === item.base && pe === item.exponente);
  }
});

test('ejercicio 2 (valor): el feedback dice la cuenta de la opción elegida', () => {
  const rng = crearRng(41);
  for (let i = 0; i < 1000; i++) {
    const it = generarValor(rng);
    for (const o of it.opciones.filter(x => x !== it.correcta)) {
      const es = TX.valor.mal.es(it.base, it.exponente, it.correcta, o);
      const en = TX.valor.mal.en(it.base, it.exponente, it.correcta, o);
      assert.ok(es.startsWith(String(o)) && en.startsWith(String(o)));
      if (o === it.base * it.exponente) assert.match(es, new RegExp(`${it.base} · ${it.exponente}`));
      else if (o === it.exponente ** it.base) assert.match(es, new RegExp(`${it.exponente} elevado a ${it.base}`));
      else assert.match(es, /no es/);
    }
  }
});

test('textos: ninguna jerga ni «×», y los dos idiomas cubren lo mismo', () => {
  const todo = JSON.stringify(TX, (k, v) => (typeof v === 'function' ? v.toString() : v));
  assert.ok(!/stepper/i.test(todo));
  assert.ok(!todo.includes('×'));
  for (const [clave, grupo] of Object.entries(TX)) {
    for (const [k, v] of Object.entries(grupo)) assert.ok(v.es !== undefined && v.en !== undefined, `${clave}.${k}`);
  }
});

test('lectura en inglés', () => {
  assert.equal(lecturaIngles(3, 4), 'three to the power of four');
  assert.equal(lecturaIngles(5, 2), 'five squared');
  assert.equal(lecturaIngles(7, 3), 'seven cubed');
});

const IDS_POR_FORMA = {
  simple: ['a', 'b'],
  suma: ['a', 'b'],
  grupo: ['b', 'grupo'],
  sumagrupo: ['b', 'grupo'],
  intermedia: ['a', 'c', 'grupo'],
};

test('ejercicio 1: la base correcta es siempre la que la forma de la expresión dice, y ninguna otra región acierta', () => {
  const rng = crearRng(11);
  for (let i = 0; i < 2000; i++) {
    const p = generarParte(rng);
    const item = { partes: [p], preguntada: 0 };
    const idCorrecta = idBaseDe(p.forma);
    assert.ok(IDS_POR_FORMA[p.forma].includes(idCorrecta));
    for (const id of IDS_POR_FORMA[p.forma]) {
      assert.equal(aciertaAlcance(item, id), id === idCorrecta, `forma=${p.forma} id=${id}`);
    }
  }
});

test('ejercicio 1: idBaseDe coincide con la definición independiente por forma', () => {
  assert.equal(idBaseDe('simple'), 'b');
  assert.equal(idBaseDe('suma'), 'b');
  assert.equal(idBaseDe('grupo'), 'grupo');
  assert.equal(idBaseDe('sumagrupo'), 'grupo');
  assert.equal(idBaseDe('intermedia'), 'grupo');
});

test('ejercicio 1: con dos partes, solo importa la preguntada (la otra parte no afecta al acierto)', () => {
  const rng = crearRng(22);
  for (let i = 0; i < 500; i++) {
    const item = generarAlcance(rng);
    const preguntada = item.partes[item.preguntada];
    const idCorrecta = idBaseDe(preguntada.forma);
    assert.equal(aciertaAlcance(item, idCorrecta), true);
  }
});

test('ejercicio 1: aproximadamente un 30 % de los ítems llevan dos partes', () => {
  const rng = crearRng(33);
  let dos = 0;
  for (let i = 0; i < 3000; i++) if (generarAlcance(rng).partes.length === 2) dos++;
  const proporcion = dos / 3000;
  assert.ok(proporcion >= 0.2 && proporcion <= 0.4, `proporción con dos partes: ${proporcion}`);
});

test('ejercicio 2 (repetida): la secuencia correcta tiene la base exponente veces, separada por «·», y solo ella acierta', () => {
  const rng = crearRng(44);
  for (let i = 0; i < 1000; i++) {
    const item = generarRepetida(rng);
    const esperada = [];
    for (let k = 0; k < item.exponente; k++) { if (k > 0) esperada.push('·'); esperada.push(item.base); }
    assert.deepEqual(secuenciaCorrecta(item), esperada);
    assert.equal(aciertaRepetida(item, esperada), true);
    assert.equal(aciertaRepetida(item, esperada.slice(1)), false);
    assert.equal(aciertaRepetida(item, [...esperada, item.base]), false);

    const necesarias = esperada.length;
    const numerosNecesarios = esperada.filter(v => v === item.base).length;
    const disponiblesNumero = item.fichas.filter(f => f.tipo === 'num' && f.valor === item.base).length;
    const disponiblesOperador = item.fichas.filter(f => f.tipo === 'op').length;
    assert.ok(disponiblesNumero >= numerosNecesarios, `fichas numéricas insuficientes: ${disponiblesNumero} < ${numerosNecesarios}`);
    assert.ok(disponiblesOperador >= necesarias - numerosNecesarios, 'fichas de operador insuficientes');
  }
});

test('ejercicio 2 (potencia): solo acierta la base y el exponente exactos', () => {
  const rng = crearRng(55);
  for (let i = 0; i < 1000; i++) {
    const item = generarPotencia(rng);
    assert.equal(aciertaPotencia(item, item.base, item.exponente), true);
    assert.equal(aciertaPotencia(item, item.base + 1, item.exponente), false);
    assert.equal(aciertaPotencia(item, item.base, item.exponente + 1), false);
  }
});

test('ejercicio 2 (valor): las cuatro opciones son enteros positivos distintos y la correcta es base^exponente', () => {
  const rng = crearRng(66);
  for (let i = 0; i < 1000; i++) {
    const item = generarValor(rng);
    assert.equal(item.correcta, item.base ** item.exponente);
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4, `opciones repetidas: ${item.opciones}`);
    for (const o of item.opciones) assert.ok(Number.isInteger(o) && o > 0);
    assert.ok(item.opciones.includes(item.correcta));
  }
});

test('ejercicio 2: generarMultiplicacion reparte los tres subtipos a partes iguales (3000 ítems)', () => {
  const rng = crearRng(77);
  const cuentas = { repetida: 0, potencia: 0, valor: 0 };
  for (let i = 0; i < 3000; i++) cuentas[generarMultiplicacion(rng).tipo]++;
  for (const tipo of ['repetida', 'potencia', 'valor']) {
    const proporcion = cuentas[tipo] / 3000;
    assert.ok(proporcion >= 0.23 && proporcion <= 0.43, `${tipo}: ${proporcion}`);
  }
});

test('ejercicio 3: (a+b)² = a² + 2ab + b² siempre, y sin la variante nunca coincide con a² + b²', () => {
  const rng = crearRng(88);
  for (let i = 0; i < 2000; i++) {
    const item = generarAreas(rng);
    assert.ok(item.a >= 1 && item.a <= 6 && item.b >= 1 && item.b <= 6);
    const { pregunta1, pregunta2 } = respuestasAreas(item);
    if (item.variante) {
      assert.equal(pregunta1, (item.a * item.b) ** 2);
      assert.equal(pregunta2, item.a ** 2 * item.b ** 2);
      assert.equal(pregunta1, pregunta2); // (a·b)² = a²·b², la identidad que sí se cumple
    } else {
      assert.equal(pregunta1, (item.a + item.b) ** 2);
      assert.equal(pregunta2, item.a ** 2 + item.b ** 2);
      assert.equal(pregunta1, item.a ** 2 + 2 * item.a * item.b + item.b ** 2);
      assert.notEqual(pregunta1, pregunta2); // falta el 2ab: nunca coincide (a, b ≥ 1)
    }
    assert.equal(aciertaAreas(item, pregunta1, pregunta2), true);
    assert.equal(aciertaAreas(item, pregunta1, pregunta2 + 1), false);
  }
});

test('ejercicio 3: aproximadamente un 30 % de los ítems son la variante del producto', () => {
  const rng = crearRng(99);
  let variantes = 0;
  for (let i = 0; i < 3000; i++) if (generarAreas(rng).variante) variantes++;
  const proporcion = variantes / 3000;
  assert.ok(proporcion >= 0.2 && proporcion <= 0.4, `proporción variante: ${proporcion}`);
});
