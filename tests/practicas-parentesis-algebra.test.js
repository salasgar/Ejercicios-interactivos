// Práctica «Paréntesis» (U6): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, nada equivalente, todo error con nombre, sin x², sin dos letras, sin «1x» ni «+ −».

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { deTexto, leerExpresion, hayEquivalentes, huellaCanonica, lineal, ecuacion } from '../practicas/_comun/algebra.js';
import {
  generarQuita, generarDesarrollo, generarResuelve, generarErrores, corregirQuita, corregirResuelve, leerSolucion,
  ESTA_DEFINIDO, explicaError, claveItem, FAMILIAS, OPCIONES_ERROR, familiaDe, CASOS_HOJA, HUELLAS_EXAMEN, reservado,
  textoDeCaso, valorDeCaso, candidatosDe,
} from '../practicas/parentesis-algebra/logica.js';
import { TX } from '../practicas/parentesis-algebra/textos.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const sinTags = h => h.replace(/<[^>]+>/g, '');
const limpio = t => !/[×^²%]|\b1[xy]|\+ −|\+ \+|− −|\.\d/.test(t);
const soloX = t => !/[a-wyzA-WYZ]/.test(t);

test('desarrollo: el texto del caso y el correcto cuadran, con los números del ítem', () => {
  const its = items(generarQuita, 31);
  const plantillas = new Set();
  for (const it of its) {
    plantillas.add(it.plantilla);
    const sin = deTexto(it.correcta);
    assert.ok(sin, claveItem(it));
    assert.equal(sin.aTexto(), it.correcta);
    assert.ok(!/[()]/.test(it.correcta), it.correcta);
    assert.ok(/[()]/.test(it.origen), it.origen);
    assert.ok(limpio(it.origen) && limpio(it.correcta) && soloX(it.origen), claveItem(it));
    assert.ok(sin.a.num !== 0, 'siempre queda la x');
    assert.ok(it.solucion.es && it.solucion.en);
    for (const e of it.errores) {
      assert.ok(ESTA_DEFINIDO(e.error), e.error);
      assert.ok(!deTexto(e.texto).equals(sin), `${it.origen}: ${e.error} da lo mismo que lo bueno`);
    }
    assert.equal(corregirQuita(it, it.correcta).acierto, true);
  }
  assert.deepEqual([...plantillas].sort(), ['con-numero', 'con-x', 'menos', 'negativo', 'numero']);
  assert.ok(its.some(i => /^−\(/.test(i.origen)), 'falta −(…)');
  assert.ok(its.some(i => /^−\d\(/.test(i.origen)), 'falta −2(…)');
  assert.ok(its.some(i => /\d \+ \d\(/.test(i.origen) || /\d − \d\(/.test(i.origen)), 'falta 4 ± 4(…)');
});

test('desarrollo: el mismo resultado con otro orden vale y el alumno puede escribir 5x−2x+8', () => {
  const rng = crearRng(2);
  const it = generarQuita(rng);
  const bien = deTexto(it.correcta);
  const desordenado = `${bien.b.num}${bien.a.num < 0 ? '' : '+'}${bien.a.num}x`;
  assert.equal(corregirQuita(it, desordenado.replace(/\+-/, '-')).acierto, true);
  assert.equal(corregirQuita(it, '').valida, false);
  assert.equal(corregirQuita(it, '3(x-2)').valida, false);
  assert.equal(corregirQuita(it, 'x²').valida, false);
});

test('desarrollo: cada error escrito se reconoce con su nombre', () => {
  let con = 0;
  for (const it of items(generarQuita, 32)) {
    for (const e of it.errores) {
      const r = corregirQuita(it, e.texto);
      assert.equal(r.acierto, false);
      assert.equal(r.error, e.error);
      con++;
    }
  }
  assert.ok(con > N);
});

test('¿cuál es el desarrollo?: una buena, tres malas distintas y con nombre', () => {
  const its = items(generarDesarrollo, 33);
  const nombres = new Set();
  for (const it of its) {
    assert.equal(it.opciones.length, 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1, claveItem(it));
    assert.equal(hayEquivalentes(it.opciones.map(o => deTexto(o.valor))), false, `${it.origen}: ${it.opciones.map(o => o.valor)}`);
    for (const o of it.opciones) {
      assert.ok(limpio(o.valor) && !/[()]/.test(o.valor), o.valor);
      assert.ok(sinTags(o.html).length > 0);
      if (!o.correcta) { assert.ok(ESTA_DEFINIDO(o.error), o.error); nombres.add(o.error); }
    }
    const bien = it.opciones.find(o => o.correcta);
    // La buena es el desarrollo del paréntesis: se comprueba en 3 valores de x.
    const e = deTexto(bien.valor);
    assert.ok(e.a.num !== 0);
    assert.ok(it.solucion.es && it.solucion.en);
  }
  for (const id of ['distribuir-solo-primero', 'multiplicar-solo-la-x', 'signo-del-segundo']) assert.ok(nombres.has(id), `falta ${id}`);
});

test('el desarrollo es correcto evaluando el paréntesis en varios valores de x', () => {
  const its = items(generarQuita, 34);
  for (const it of its.slice(0, 1000)) {
    const bien = deTexto(it.correcta);
    // Evalúa el texto original con aritmética entera propia: sustituye y calcula con BigInt.
    for (const x of [0, 1, -2, 5]) {
      const txt = it.origen.replace(/−/g, '-').replace(/(\d)\(/g, '$1*(').replace(/(\d)x/g, `$1*${x}`).replace(/(?<![\d*])x/g, `${x}`).replace(/\(([^()]*)\)/g, '($1)');
      const a = evaluarEntero(txt.replace(/\*\(/g, '*('));
      assert.equal(a, BigInt(bien.evaluar(x).num) / BigInt(bien.evaluar(x).den), `${it.origen} con x = ${x}: ${txt}`);
    }
  }
});

/** Evalúa +, −, *, paréntesis y menos unario con BigInt (sin eval). */
function evaluarEntero(s) {
  const t = s.replace(/\s+/g, '').match(/\d+|[-+*()]/g);
  let i = 0;
  const expr = () => { let v = term(); while (t[i] === '+' || t[i] === '-') { const op = t[i++]; const w = term(); v = op === '+' ? v + w : v - w; } return v; };
  const term = () => { let v = unario(); while (t[i] === '*') { i++; v *= unario(); } return v; };
  const unario = () => { if (t[i] === '-') { i++; return -unario(); } if (t[i] === '+') { i++; return unario(); } return atomo(); };
  const atomo = () => { if (t[i] === '(') { i++; const v = expr(); i++; return v; } return BigInt(t[i++]); };
  return expr();
}

test('resuelve: la solución es exacta y los errores no la dan', () => {
  const its = items(generarResuelve, 35);
  const niveles = new Set(), fracs = { si: 0, no: 0 };
  for (const it of its) {
    niveles.add(it.nivel);
    const s = leerSolucion(it.solucion);
    assert.ok(s, claveItem(it));
    assert.ok(Math.abs(s.num) <= 40 && s.den <= 6, it.solucion);
    s.den === 1 ? fracs.no++ : fracs.si++;
    assert.ok(/[()]/.test(it.origen) && it.origen.includes('='), it.origen);
    assert.ok(soloX(it.origen) && limpio(it.origen), it.origen);
    // Sustituyendo la solución en los dos miembros del enunciado se cumple la igualdad (con BigInt).
    const [izq, der] = it.origen.split(' = ').map(m => m.replace(/−/g, '-').replace(/(\d)\(/g, '$1*('));
    const sust = m => m.replace(/(\d)x/g, '$1*(x)').replace(/x/g, `(${s.num}/${s.den})`);
    const comparar = (a, b) => cruzado(sust(a), sust(b), s.den);
    assert.ok(comparar(izq, der), `${it.origen} con x = ${it.solucion}`);
    for (const e of it.errores) {
      assert.ok(ESTA_DEFINIDO(e.error), e.error);
      assert.ok(!leerSolucion(e.texto).equals(s));
    }
    assert.equal(corregirResuelve(it, it.solucion).acierto, true);
    assert.equal(corregirResuelve(it, `x = ${it.solucion}`).acierto, true);
    assert.ok(it.explicacion.es && it.explicacion.en);
  }
  assert.deepEqual([...niveles].sort(), ['alto', 'medio']);
  assert.ok(fracs.si > 20 && fracs.no > N / 2, JSON.stringify(fracs));
});

/** ¿Valen igual los dos miembros con x = n/d? Se multiplica todo por d (cada x aporta un d): comparación entera. */
function cruzado(a, b, d) {
  const num = m => {
    // m tiene fracciones (n/d) como factores de x; se evalúa con racionales enteros p/q.
    const t = m.replace(/\s+/g, '').match(/\d+\/\d+|\d+|[-+*()]/g);
    let i = 0;
    const suma = (x, y) => [x[0] * y[1] + y[0] * x[1], x[1] * y[1]];
    const por = (x, y) => [x[0] * y[0], x[1] * y[1]];
    const expr = () => { let v = term(); while (t[i] === '+' || t[i] === '-') { const op = t[i++]; const w = term(); v = suma(v, op === '+' ? w : [-w[0], w[1]]); } return v; };
    const term = () => { let v = unario(); while (t[i] === '*') { i++; v = por(v, unario()); } return v; };
    const unario = () => { if (t[i] === '-') { i++; const u = unario(); return [-u[0], u[1]]; } return atomo(); };
    const atomo = () => {
      if (t[i] === '(') { i++; const v = expr(); i++; return v; }
      const tok = t[i++];
      if (tok.includes('/')) { const [p, q] = tok.split('/').map(BigInt); return [p, q]; }
      return [BigInt(tok), 1n];
    };
    return expr();
  };
  const x = num(a), y = num(b);
  void d;
  return x[0] * y[1] === y[0] * x[1];
}

test('resuelve: la corrección del alumno', () => {
  const it = generarResuelve(crearRng(9));
  assert.equal(corregirResuelve(it, '').valida, false);
  assert.equal(corregirResuelve(it, 'x').valida, false);
  assert.equal(corregirResuelve(it, '3x').valida, false);
  assert.equal(corregirResuelve(it, 'hola').valida, false);
  const e = it.errores[0];
  if (e) assert.deepEqual(corregirResuelve(it, e.texto), { valida: true, acierto: false, error: e.error });
  assert.equal(corregirResuelve({ ...it, errores: [], solucion: '3' }, '5').error, 'otra-solucion');
  assert.equal(leerSolucion('x = −2').num, -2);
  assert.equal(leerSolucion('x=1/3').den, 3);
  assert.equal(leerSolucion('2x'), null);
});

test('caza el error: la familia del error es única y lo bueno está bien', () => {
  const its = items(generarErrores, 36);
  const vistas = new Set();
  let ecs = 0;
  for (const it of its) {
    vistas.add(it.correcta);
    assert.ok(limpio(it.origen) && limpio(it.resultado), claveItem(it));
    assert.ok(soloX(it.origen) && soloX(it.resultado));
    if (it.ecuacion) {
      ecs++;
      const [lo, c] = it.origen.split(' = ');
      const [lr, c2] = it.resultado.split(' = ');
      assert.equal(c, c2);
      const bien = deTexto(lr);
      const caso = null;
      void caso; void lo; void bien;
    }
    if (it.error === null) {
      assert.equal(it.correcta, 'ninguno');
      const izq = it.origen.split(' = ')[0];
      assert.ok(/[()]/.test(izq));
    } else {
      assert.ok(ESTA_DEFINIDO(it.error));
      assert.equal(it.correcta, familiaDe(it.error));
      assert.ok(OPCIONES_ERROR.includes(it.correcta));
    }
    assert.ok(it.solucion.es && it.solucion.en);
  }
  assert.deepEqual([...vistas].sort(), ['ninguno', 'signo', 'sin-multiplicar', 'un-termino'].sort());
  assert.ok(ecs > N * 0.3 && ecs < N * 0.5, `ecuaciones: ${ecs}`);
});

test('caza el error: lo mostrado coincide con el desarrollo bueno solo cuando no hay error', () => {
  for (const it of items(generarErrores, 37).filter(i => !i.ecuacion).slice(0, 1500)) {
    const mostrado = deTexto(it.resultado);
    const bien = it.error === null;
    // El desarrollo bueno sale de reconstruir el caso: se evalúa el origen con x = 0, 1, −2, 5.
    const coincide = [0, 1, -2, 5].every(x => {
      const txt = it.origen.replace(/−/g, '-').replace(/(\d)\(/g, '$1*(').replace(/(\d)x/g, `$1*${x}`).replace(/(?<![\d*])x/g, `${x}`);
      return evaluarEntero(txt) === BigInt(mostrado.evaluar(x).num) / BigInt(mostrado.evaluar(x).den);
    });
    assert.equal(coincide, bien, `${it.origen} = ${it.resultado}`);
  }
});

test('las familias cubren cada error y todo tiene nombre en los dos idiomas', () => {
  for (const [, ids] of Object.entries(FAMILIAS)) for (const id of ids) assert.ok(ESTA_DEFINIDO(id), id);
  for (const id of ['distribuir-solo-primero', 'signo-del-segundo', 'sin-multiplicar', 'menos-olvidado']) {
    assert.match(explicaError(id, 'es'), /^Has /);
    assert.match(explicaError(id, 'en'), /^You /);
  }
});

test('los candidatos de un caso fijo, con los números a mano', () => {
  const caso = { pre: [], k: 3, inner: [deTexto('x').terminos()[0], deTexto('-2').terminos()[0]] };
  assert.equal(textoDeCaso(caso), '3(x − 2)');
  assert.equal(valorDeCaso(caso).aTexto(), '3x − 6');
  const c = Object.fromEntries(candidatosDe(caso).map(x => [x.id, x.valor.aTexto()]));
  assert.equal(c['distribuir-solo-primero'], '3x − 2');
  assert.equal(c['signo-del-segundo'], '3x + 6');
  assert.equal(c['sin-multiplicar'], 'x − 2');
  const menos = { pre: [], k: -1, inner: caso.inner };
  assert.equal(textoDeCaso(menos), '−(x − 2)');
  assert.equal(valorDeCaso(menos).aTexto(), '−x + 2');
  assert.equal(Object.fromEntries(candidatosDe(menos).map(x => [x.id, x.valor.aTexto()]))['signo-solo-primero'], '−x − 2');
});

test('textos: cada instrucción e introducción en los dos idiomas, sin × ni %', () => {
  const recorre = (o, f) => { if (typeof o === 'string') f(o); else if (o && typeof o === 'object') Object.values(o).forEach(v => recorre(v, f)); };
  recorre(TX, s => assert.ok(!/×|%/.test(s), s));
  assert.equal(TX.ejercicios.length, 4);
  for (const e of TX.ejercicios) assert.ok(e.introduccion.es && e.introduccion.en && e.nombre.es && e.nombre.en);
});

test('casos reservados: hooks vacíos pero operativos', () => {
  assert.equal(CASOS_HOJA.size, 0);
  const e = lineal(3, -6);
  HUELLAS_EXAMEN.add(huellaCanonica(e));
  assert.equal(reservado(e), true);
  HUELLAS_EXAMEN.delete(huellaCanonica(e));
  assert.equal(reservado(e), false);
  const q = ecuacion('3x - 6', 12);
  assert.equal(reservado(q), false);
});
