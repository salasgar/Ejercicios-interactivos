// Práctica «Del enunciado a la expresión»: el analizador, la equivalencia
// estructural, los paréntesis que sobran y los tres generadores se comprueban
// contra definiciones INDEPENDIENTES de `logica.js`: el valor de una
// expresión se calcula aquí traduciéndola a JavaScript, la equivalencia se
// decide sustituyendo los números por otros al azar, y el resultado de cada
// problema está escrito a mano, plantilla por plantilla, a partir de su
// enunciado (no de la familia a la que pertenece).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { practicaPorSlug } from '../practicas/_comun/catalogo.js';
import { PLANTILLAS, TX } from '../practicas/expresion/textos.js';
import {
  analizar, aFichas, evaluar, equivalentes, quitarSobrantes, corregir,
  FAMILIAS, instanciar, modeloDe, erroresDe, plantillaPorId, numerosValidos,
  generarSin, generarCon, generarPotencias, claveItem, P_VARIANTE, MAX_FICHAS, sumaRepetida,
} from '../practicas/expresion/logica.js';

// ─── Definiciones independientes ────────────────────────────────────────────────

/** Fichas → expresión de JavaScript; `sust` cambia cada número por otro valor. */
function aJs(fichas, sust = n => n) {
  return fichas.map((f, i) => {
    if (typeof f === 'number') return `(${sust(f)})`;
    if (f === '²') {
      // «**» asocia por la derecha: x²²² es ((x²)²)² = x⁸, no x**2**2**2.
      if (fichas[i - 1] === '²') return '';
      let k = 1;
      while (fichas[i + k] === '²') k++;
      return `**${2 ** k}`;
    }
    return { '+': '+', '-': '-', '·': '*', ':': '/', '(': '(', ')': ')', '√': 'Math.sqrt' }[f];
  }).join(' ');
}
const valorJs = (fichas, sust) => Function(`"use strict"; return (${aJs(fichas, sust)});`)();
// Tolerancia relativa (más un pelo absoluto, por las cancelaciones exactas tipo x − x).
const casi = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(Math.abs(x), Math.abs(y)) + 1e-12;

/**
 * ¿Dan lo mismo dos expresiones con CUALQUIER número? Se cambian los números
 * por valores al azar (el mismo número, el mismo valor) varias veces.
 */
function mismaExpresion(f1, f2, rng) {
  let comparadas = 0;
  for (let k = 0; k < 40 && comparadas < 6; k++) {
    const valores = new Map();
    const sust = n => { if (!valores.has(n)) valores.set(n, 0.7 + 0.9 * rng.azar()); return valores.get(n); };
    const x = valorJs(f1, sust), y = valorJs(f2, sust);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue; // raíz de un negativo, división entre 0
    if (!casi(x, y)) return false;
    comparadas++;
  }
  return comparadas > 0 ? true : null; // null: nunca tienen valor (no se puede decidir)
}

const arbol = fichas => {
  const r = analizar(fichas);
  assert.ok(r.ok, `no se analiza: ${fichas.join(' ')} (${r.error})`);
  return r.arbol;
};
/** '(7+3)·2' → fichas (números de varias cifras incluidos). */
const F = texto => texto.match(/\d+|[^\d\s]/g).map(t => (/\d/.test(t) ? Number(t) : t));

/** Expresión al azar (como fichas), con paréntesis de más y de menos. */
function expresionAlAzar(rng, numeros, hojas, { raiz = true } = {}) {
  const hacer = n => {
    if (n === 1) {
      const v = [rng.elegir(numeros)];
      return rng.azar() < 0.15 ? ['(', ...v, ')'] : v;
    }
    const tiro = rng.azar();
    let e;
    if (tiro < 0.12) e = [...envolver(hacer(n)), '²'];
    else if (raiz && tiro < 0.22) e = ['√', ...envolver(hacer(n))];
    else {
      const k = rng.entero(1, n - 1);
      const a = hacer(k), b = hacer(n - k);
      e = [...(rng.azar() < 0.5 ? envolver(a) : a), rng.elegir(['+', '-', '·', ':']), ...(rng.azar() < 0.5 ? envolver(b) : b)];
    }
    return rng.azar() < 0.2 ? ['(', ...e, ')'] : e;
  };
  const envolver = e => (e.length === 1 ? e : ['(', ...e, ')']);
  return hacer(hojas);
}

// El resultado de cada problema, leído de su enunciado.
const RESULTADO = {
  cuadernos: n => n.a * n.b + n.c * n.d,
  cajas_botes: n => n.a * n.b + n.c * n.d,
  entradas: n => n.a * n.b + n.c * n.d,
  huevos: n => n.a * n.b + n.c,
  autobuses: n => n.a * n.b + n.c,
  libros: n => n.a - n.b * n.c,
  sillas: n => n.a - n.b * n.c,
  frase_menos_por: n => n.a - n.b * n.c,
  cine: n => n.a * n.b - n.c,
  vasos: n => n.a * n.b - n.c,
  tienda: n => n.a * n.b * n.c,
  excursion_clases: n => n.a * n.b * n.c,
  caramelos_bolsas: n => ((n.a * n.b) / n.c) * n.d,
  feria: n => n.a + n.b * n.c,
  frase_mas_por: n => n.a + n.b * n.c,
  frase_mas_entre: n => n.a + n.b / n.c,
  pizza: n => (n.a + n.b) / n.c,
  cromos: n => (n.a + n.b) / n.c,
  frase_todo_entre: n => (n.a + n.b) / n.c,
  menu: n => (n.a + n.b) * n.c,
  correr: n => (n.a + n.b) * n.c,
  frase_todo_por: n => (n.a + n.b) * n.c,
  libro_estuche: n => n.a - n.b - n.c,
  frase_menos_suma: n => n.a - (n.b + n.c),
  camisetas: n => (n.a - n.b) * n.c,
  frase_resta_por: n => (n.a - n.b) * n.c,
  excursion_precio: n => n.a / (n.b + n.c),
  caramelos_reparto: n => n.a / (n.b + n.c),
  lapices: n => (n.a * n.b + n.c) / n.d,
  frase_resta_entre: n => (n.a - n.b) / n.c,
  galletas: n => (n.a - n.b) / n.c,
  frase_mas_producto: n => n.a + n.b * n.c,
  frase_menos_producto: n => n.a - n.b * n.c,
  frase_suma_productos: n => n.a * n.b + n.c * n.d,
  frase_mas_cociente: n => n.a + n.b / n.c,
  entradas_cambio: n => n.a - n.b * n.c,
  frase_cuadrado_suma: n => (n.a + n.b) ** 2,
  patio: n => (n.a + n.b) * (n.a + n.b),
  frase_suma_cuadrados: n => n.a ** 2 + n.b ** 2,
  parcelas: n => n.a * n.a + n.b * n.b,
  frase_raiz_suma: n => Math.sqrt(n.a + n.b),
  baldosas_cuadrado: n => Math.sqrt(n.a + n.b),
  frase_suma_raices: n => Math.sqrt(n.a) + Math.sqrt(n.b),
  frase_por_cuadrado: n => n.a * n.b ** 2,
  suelo: n => n.a * (n.b * n.b),
  frase_cuadrado_producto: n => (n.a * n.b) ** 2,
  lados: n => n.a * Math.sqrt(n.b),
  cuerda: n => Math.sqrt(n.a) - n.b,
  frase_cuadrado_diferencia: n => (n.a - n.b) ** 2,
  frase_diferencia_cuadrados: n => n.a ** 2 - n.b ** 2,
  salon: n => n.a * n.a - n.b,
};

// ─── analizar ───────────────────────────────────────────────────────────────────

test('analizar: la jerarquía normal y los paréntesis escritos', () => {
  const n = v => ({ op: 'n', v });
  assert.deepEqual(arbol(F('7+3·2')), { op: '+', a: n(7), b: { op: '·', a: n(3), b: n(2) } });
  assert.deepEqual(arbol(F('(7+3)·2')), { op: '·', a: { op: '()', a: { op: '+', a: n(7), b: n(3) } }, b: n(2) });
  assert.deepEqual(arbol(F('20-5-3')), { op: '-', a: { op: '-', a: n(20), b: n(5) }, b: n(3) });
  assert.deepEqual(arbol(F('24:4:2')), { op: ':', a: { op: ':', a: n(24), b: n(4) }, b: n(2) });
  assert.deepEqual(arbol(F('3·4²')), { op: '·', a: n(3), b: { op: '²', a: n(4) } });
  assert.deepEqual(arbol(F('√9+16')), { op: '+', a: { op: '√', a: n(9) }, b: n(16) });
  assert.deepEqual(arbol(F('√(9+16)')), { op: '√', a: { op: '()', a: { op: '+', a: n(9), b: n(16) } } });
  assert.deepEqual(arbol(F('(3+4)²')), { op: '²', a: { op: '()', a: { op: '+', a: n(3), b: n(4) } } });
});

test('analizar: rechaza las secuencias mal formadas y dice por qué', () => {
  const casos = [
    ['', 'vacia'],
    ['7+·3', 'falta_numero'],      // dos operadores seguidos
    ['7+', 'falta_numero'],
    ['·7', 'falta_numero'],
    ['²', 'falta_numero'],
    ['7+²', 'falta_numero'],
    ['√', 'falta_numero'],
    ['√+3', 'falta_numero'],
    ['(7+)', 'falta_numero'],
    ['7 3', 'falta_operador'],     // dos números seguidos
    ['7(3+2)', 'falta_operador'],
    ['(3+2)7', 'falta_operador'],
    ['7²3', 'falta_operador'],
    ['7√9', 'falta_operador'],
    ['(7+3', 'sin_cerrar'],        // paréntesis sin cerrar
    ['((7+3)·2', 'sin_cerrar'],
    ['7+3)', 'sin_abrir'],
    [')7+3', 'sin_abrir'],
    ['()', 'parentesis_vacio'],
    ['7+()', 'parentesis_vacio'],
    ['√9²', 'raiz_ambigua'],
    ['√(9+16)²', 'raiz_ambigua'],
  ];
  for (const [texto, error] of casos) {
    const r = analizar(texto ? F(texto) : []);
    assert.equal(r.ok, false, texto);
    assert.equal(r.error, error, texto);
    assert.ok(TX.malformada[r.error], `falta el texto del error ${r.error}`);
  }
  for (const e of Object.values(TX.malformada)) assert.ok(e.es && e.en);
});

test('analizar y aFichas: ida y vuelta, y evaluar coincide con JavaScript (4000 expresiones al azar)', () => {
  const rng = crearRng(2401);
  let conValor = 0;
  for (let i = 0; i < 4000; i++) {
    const fichas = expresionAlAzar(rng, [2, 3, 4, 9, 12, 16, 36], rng.entero(1, 5));
    const r = analizar(fichas);
    if (!r.ok) { assert.equal(r.error, 'raiz_ambigua', fichas.join(' ')); continue; }
    assert.deepEqual(aFichas(r.arbol), fichas);
    const esperado = valorJs(fichas), mio = evaluar(r.arbol);
    if (mio === null) {
      // Sin valor exacto: división entre 0, raíz no exacta (o de un negativo) o fuera de rango.
      continue;
    }
    conValor++;
    assert.ok(casi(mio, esperado), `${fichas.join(' ')}: ${mio} ≠ ${esperado}`);
  }
  assert.ok(conValor > 2000, `pocas expresiones con valor: ${conValor}`);
});

test('evaluar: casos fijos, y null cuando no hay valor exacto', () => {
  const v = texto => evaluar(arbol(F(texto)));
  assert.equal(v('7+3·2'), 13);
  assert.equal(v('(7+3)·2'), 20);
  assert.equal(v('36:(4+2)'), 6);
  assert.equal(v('36:4+2'), 11);
  assert.equal(v('(3+4)²'), 49);
  assert.equal(v('3²+4²'), 25);
  assert.equal(v('3·4²'), 48);
  assert.equal(v('(3·4)²'), 144);
  assert.equal(v('√(9+16)'), 5);
  assert.equal(v('√9+√16'), 7);
  assert.equal(v('5:2'), 2.5);
  assert.equal(v('3-10'), -7);
  assert.equal(v('7:(3-3)'), null);
  assert.equal(v('√8'), null);
  assert.equal(v('√(3-7)'), null);
});

// ─── equivalentes ───────────────────────────────────────────────────────────────

test('equivalentes: acepta la conmutativa, los paréntesis que sobran y las formas iguales', () => {
  const iguales = [
    ['2·(7+3)', '(7+3)·2'], ['(7+3)·2', '(3+7)·2'], ['7+3·2', '3·2+7'], ['7+3·2', '7+(2·3)'],
    ['3·12+5·8', '8·5+12·3'], ['3·12+5·8', '(3·12)+(5·8)'], ['9·12·3', '3·9·12'], ['9·12·3', '12·(3·9)'],
    ['50-(12+3)', '50-12-3'], ['50-(12+3)', '50-3-12'], ['(26+3)·5', '26·5+3·5'], ['(24+36):4', '24:4+36:4'],
    ['5·24:6·2', '5·24·2:6'], ['((7+3))·2', '(7+3)·2'], ['(3+4)²', '(3+4)·(4+3)'], ['(3·4)²', '3²·4²'],
    ['17²-5', '17·17-5'], ['√(9+16)', '√(16+9)'], ['√9+√16', '√16+√9'], ['4·√36', '√36·4'],
    ['36:(4+2)', '36:(2+4)'], ['3²+4²', '4²+3²'],
  ];
  const rng = crearRng(7);
  for (const [x, y] of iguales) {
    assert.ok(equivalentes(arbol(F(x)), arbol(F(y))), `${x} ≡ ${y}`);
    assert.ok(mismaExpresion(F(x), F(y), rng), `control: ${x} ≡ ${y}`);
  }
});

test('equivalentes: rechaza lo que solo coincide en el valor, y la resta y la división al revés', () => {
  const distintas = [
    ['7+3·2', '(7+3)·2'], ['50-12', '12-50'], ['24:4', '4:24'], ['36:(4+2)', '36:4+2'],
    ['50-(12+3)', '50-12+3'], ['(3+4)²', '3²+4²'], ['3·4²', '(3·4)²'], ['√(9+16)', '√9+√16'],
    ['√(9+16)', '√9+16'], ['2+2', '2·2'], ['2·2', '2²+2-1'], ['4:2', '4-2'], ['3+6', '3·3'],
    ['1·5', '5:1'], ['8-4', '8:2'], ['4·√36', '√(4·36)'], ['10-2·3', '(10-2)·3'], ['6+4:2', '(6+4):2'],
  ];
  for (const [x, y] of distintas) assert.ok(!equivalentes(arbol(F(x)), arbol(F(y))), `${x} ≢ ${y}`);
  // Varias de esas parejas valen lo mismo: es justo lo que no puede colar.
  assert.equal(evaluar(arbol(F('2+2'))), evaluar(arbol(F('2·2'))));
  assert.equal(evaluar(arbol(F('3+6'))), evaluar(arbol(F('3·3'))));
  assert.equal(evaluar(arbol(F('8-4'))), evaluar(arbol(F('8:2'))));
});

test('equivalentes: coincide con sustituir los números por otros (6000 parejas al azar, sin raíces)', () => {
  const rng = crearRng(99);
  let iguales = 0;
  for (let i = 0; i < 6000; i++) {
    const numeros = [3, 5, 7];
    const f1 = expresionAlAzar(rng, numeros, rng.entero(1, 3), { raiz: false });
    const f2 = expresionAlAzar(rng, numeros, rng.entero(1, 3), { raiz: false });
    const mio = equivalentes(arbol(f1), arbol(f2));
    const control = Boolean(mismaExpresion(f1, f2, rng));
    assert.equal(mio, control, `${f1.join(' ')}  frente a  ${f2.join(' ')}`);
    if (mio) iguales++;
  }
  assert.ok(iguales > 150, `pocas parejas equivalentes para que la prueba valga: ${iguales}`);
});

// ─── Paréntesis que sobran ──────────────────────────────────────────────────────

test('quitarSobrantes: casos fijos', () => {
  const limpia = texto => { const r = quitarSobrantes(arbol(F(texto))); return [aFichas(r.arbol).join(''), r.quitados]; };
  assert.deepEqual(limpia('7+(3·2)'), ['7+3·2', 1]);
  assert.deepEqual(limpia('40-(5·6)'), ['40-5·6', 1]);
  assert.deepEqual(limpia('(2·3)+(4·5)'), ['2·3+4·5', 2]);
  assert.deepEqual(limpia('(7+3)·2'), ['(7+3)·2', 0]);
  assert.deepEqual(limpia('((7+3))·2'), ['(7+3)·2', 1]);
  assert.deepEqual(limpia('50-(12+3)'), ['50-(12+3)', 0]);
  assert.deepEqual(limpia('(7)+3'), ['7+3', 1]);
  assert.deepEqual(limpia('(7+3)'), ['7+3', 1]);
  assert.deepEqual(limpia('3·(4²)'), ['3·4²', 1]);
  assert.deepEqual(limpia('(3·4)²'), ['(3·4)²', 0]);
  assert.deepEqual(limpia('√(9)+16'), ['√9+16', 1]);
  assert.deepEqual(limpia('√(9+16)'), ['√(9+16)', 0]);
  assert.deepEqual(limpia('(√9)²'), ['(√9)²', 0]);
  assert.deepEqual(limpia('36:(4·3)'), ['36:(4·3)', 0]);
  assert.deepEqual(limpia('(36:4)·3'), ['36:4·3', 1]);
});

test('quitarSobrantes: quita todos los que no cambian el valor y ninguno más (3000 expresiones al azar)', () => {
  const rng = crearRng(31);
  let conParentesis = 0;
  for (let i = 0; i < 3000; i++) {
    // Cada número, una sola vez: con números repetidos, (5 − 3) · 5 : 5 y
    // 5 − 3 · 5 : 5 son la misma expresión y el paréntesis «sobraría» de rebote.
    let siguiente = 2;
    const fichas = expresionAlAzar(rng, [0], rng.entero(1, 5)).map(f => (typeof f === 'number' ? siguiente++ : f));
    const r = analizar(fichas);
    if (!r.ok) continue;
    const { arbol: limpio, quitados } = quitarSobrantes(r.arbol);
    const limpias = aFichas(limpio);
    const abiertos = f => f.filter(x => x === '(').length;
    assert.equal(quitados, abiertos(fichas) - abiertos(limpias), fichas.join(' '));
    assert.ok(analizar(limpias).ok, limpias.join(' '));
    assert.notEqual(mismaExpresion(fichas, limpias, rng), false, `${fichas.join(' ')} → ${limpias.join(' ')}`);
    // Mínima: quitar cualquiera de los que quedan estropea la expresión o cambia lo que vale.
    const pila = [];
    limpias.forEach((f, k) => {
      if (f === '(') pila.push(k);
      if (f !== ')') return;
      const desde = pila.pop();
      const sin = limpias.filter((_, j) => j !== desde && j !== k);
      conParentesis++;
      if (analizar(sin).ok) assert.ok(!mismaExpresion(limpias, sin, rng), `sobraba uno más: ${limpias.join(' ')} → ${sin.join(' ')}`);
    });
  }
  assert.ok(conParentesis > 500);
});

// ─── El banco de enunciados ─────────────────────────────────────────────────────

test('banco: al menos 30 plantillas, con id único, familia, enunciado y explicación en los dos idiomas', () => {
  assert.ok(PLANTILLAS.length >= 30, `solo hay ${PLANTILLAS.length}`);
  assert.equal(new Set(PLANTILLAS.map(p => p.id)).size, PLANTILLAS.length);
  assert.deepEqual(Object.keys(RESULTADO).sort(), PLANTILLAS.map(p => p.id).sort());
  for (const ej of [1, 2, 3]) assert.ok(PLANTILLAS.filter(p => p.ej === ej).length >= 8, `ejercicio ${ej}`);
  assert.ok(PLANTILLAS.filter(p => p.ej === 2 && p.sobra).length >= 3);
  assert.ok(PLANTILLAS.every(p => !p.sobra || p.ej === 2));
  const usadas = new Set(PLANTILLAS.map(p => p.familia));
  for (const familia of Object.keys(FAMILIAS)) assert.ok(usadas.has(familia), `familia sin plantillas: ${familia}`);
  for (const p of PLANTILLAS) assert.ok(FAMILIAS[p.familia], `${p.id}: familia ${p.familia}`);
});

test('familias: el modelo y los errores están bien escritos, y ningún error es equivalente al modelo', () => {
  const rng = crearRng(5);
  const numeros = { a: 23, b: 7, c: 5, d: 3 };
  for (const [nombre, familia] of Object.entries(FAMILIAS)) {
    const modelo = instanciar(familia.modelo, numeros);
    assert.ok(analizar(modelo).ok, `${nombre}: ${familia.modelo}`);
    assert.ok(familia.errores.length >= 2, nombre);
    for (const [texto, tipo] of familia.errores) {
      const error = instanciar(texto, numeros);
      assert.ok(analizar(error).ok, `${nombre}: ${texto}`);
      assert.ok(TX.error[tipo]?.es && TX.error[tipo]?.en, `${nombre}: tipo de error ${tipo}`);
      assert.ok(!equivalentes(arbol(modelo), arbol(error)), `${nombre}: ${texto} es equivalente al modelo`);
      assert.ok(!mismaExpresion(modelo, error, rng), `control, ${nombre}: ${texto} vale siempre lo mismo que el modelo`);
    }
    // Los errores de una familia son distintos entre sí (cada uno, su explicación).
    const errores = familia.errores.map(([texto]) => arbol(instanciar(texto, numeros)));
    errores.forEach((e, i) => errores.slice(i + 1).forEach(f => assert.ok(!equivalentes(e, f), `${nombre}: errores repetidos`)));
  }
  // La trampa de la ficha: las dos frases se distinguen con los mismos números.
  assert.equal(evaluar(modeloDe(plantillaPorId('frase_cuadrado_suma'), { a: 3, b: 4 })), 49);
  assert.equal(evaluar(modeloDe(plantillaPorId('frase_suma_cuadrados'), { a: 3, b: 4 })), 25);
});

test('banco: cada plantilla da es y en con sus números, y su modelo es el resultado del problema', () => {
  const rng = crearRng(2024);
  for (const p of PLANTILLAS) {
    let validos = 0;
    for (let i = 0; i < 400; i++) {
      const numeros = p.numeros(rng);
      if (!numerosValidos(p, numeros)) continue;
      validos++;
      const modelo = modeloDe(p, numeros);
      const resultado = RESULTADO[p.id](numeros);
      assert.ok(Number.isInteger(resultado) && resultado > 0, `${p.id} ${JSON.stringify(numeros)}: ${resultado}`);
      assert.equal(evaluar(modelo), resultado, `${p.id} ${JSON.stringify(numeros)}`);
      assert.ok(casi(valorJs(aFichas(modelo)), resultado), p.id);
      for (const idioma of ['es', 'en']) {
        const enunciado = p[idioma](numeros), explica = p.explica[idioma](numeros);
        assert.ok(enunciado.length > 10 && explica.length > 10, `${p.id} ${idioma}`);
        assert.ok(!/undefined|NaN|×/.test(enunciado + explica), `${p.id} ${idioma}: ${enunciado} ${explica}`);
        const escritos = (enunciado.match(/\d+/g) ?? []).map(Number);
        for (const v of Object.values(numeros)) assert.ok(escritos.includes(v), `${p.id} ${idioma}: falta el ${v} en «${enunciado}»`);
        // Ni un número de más en el enunciado (salvo el 2 de «dm²» o «cm²»).
        for (const v of escritos) assert.ok(Object.values(numeros).includes(v), `${p.id} ${idioma}: sobra el ${v} en «${enunciado}»`);
      }
      assert.notEqual(p.es(numeros), p.en(numeros), p.id);
    }
    assert.ok(validos >= 40, `${p.id}: solo ${validos} de 400 juegos de números valen`);
  }
});

/** Los trozos de una expresión que se calculan por separado (cada subárbol), como fichas. */
function pasos(nodo) {
  if (nodo.op === 'n') return [];
  return [aFichas(nodo), ...pasos(nodo.a), ...(nodo.b ? pasos(nodo.b) : [])];
}

test('banco: ningún paso intermedio del problema deja de ser natural (no salen 22,5 bolsas)', () => {
  const bolsas = plantillaPorId('caramelos_bolsas');
  // 3 cajas de 30 caramelos en bolsas de 4: 90 : 4 = 22,5 bolsas, aunque 22,5 · 2 = 45.
  assert.equal(RESULTADO.caramelos_bolsas({ a: 3, b: 30, c: 4, d: 2 }), 45);
  assert.equal(numerosValidos(bolsas, { a: 3, b: 30, c: 4, d: 2 }), false);
  assert.equal(numerosValidos(bolsas, { a: 5, b: 36, c: 8, d: 2 }), false);
  assert.equal(numerosValidos(bolsas, { a: 3, b: 40, c: 4, d: 2 }), true);
  const rng = crearRng(808);
  for (const p of PLANTILLAS) {
    for (let i = 0; i < 400; i++) {
      const numeros = p.numeros(rng);
      if (!numerosValidos(p, numeros)) continue;
      for (const paso of pasos(modeloDe(p, numeros))) {
        const valor = valorJs(paso);
        assert.ok(Number.isInteger(valor) && valor > 0, `${p.id} ${JSON.stringify(numeros)}: ${paso.join(' ')} = ${valor}`);
      }
    }
  }
});

// ─── Los tres ejercicios ────────────────────────────────────────────────────────

/** Variantes del modelo que TIENEN que valer: fichas con los sumandos y factores cambiados de sitio. */
function conmutada(nodo, rng) {
  if (nodo.op === 'n') return nodo;
  if (nodo.op === '()' || nodo.op === '²' || nodo.op === '√') return { op: nodo.op, a: conmutada(nodo.a, rng) };
  const a = conmutada(nodo.a, rng), b = conmutada(nodo.b, rng);
  const hoja = x => x.op === 'n' || x.op === '()' || x.op === '²' || x.op === '√';
  // Solo se cambian de sitio dos operandos «enteros» de una suma o de un producto.
  const cambia = (nodo.op === '+' || nodo.op === '·') && hoja(a) && hoja(b) && rng.azar() < 0.7;
  return cambia ? { op: nodo.op, a: b, b: a } : { op: nodo.op, a, b };
}

function comprobarItem(item, ej, rng) {
  const p = plantillaPorId(item.plantilla);
  assert.ok(p, item.plantilla);
  assert.equal(p.ej, ej);
  const resultado = RESULTADO[p.id](item.numeros);
  const valores = Object.values(item.numeros);
  assert.ok(valores.every(v => Number.isInteger(v) && v > 0));
  assert.equal(new Set(valores).size, valores.length, `números repetidos: ${claveItem(item)}`);

  // La respuesta correcta es verdad: el modelo vale el resultado del problema.
  const modelo = aFichas(item.modelo);
  assert.ok(Number.isInteger(resultado) && resultado > 0, claveItem(item));
  assert.ok(casi(valorJs(modelo), resultado), claveItem(item));
  assert.ok(modelo.length <= MAX_FICHAS, `el modelo no cabe en la línea: ${modelo.join(' ')}`);

  // Ninguna variante errónea vale lo mismo que el modelo, ni es la misma expresión.
  const errores = erroresDe(p, item.numeros);
  for (const e of errores) {
    const fichas = aFichas(e.arbol);
    const valor = valorJs(fichas);
    assert.ok(!(Number.isFinite(valor) && casi(valor, resultado)), `${claveItem(item)}: ${fichas.join(' ')} también da ${resultado}`);
    assert.ok(!mismaExpresion(modelo, fichas, rng), `${claveItem(item)}: ${fichas.join(' ')}`);
  }
  return { p, modelo, errores, resultado };
}

function comprobarMontar(item, ej, rng) {
  const { p, modelo, errores, resultado } = comprobarItem(item, ej, rng);
  assert.deepEqual(item.solucion, modelo);
  assert.deepEqual(item.opciones, [...new Set(Object.values(item.numeros))].sort((x, y) => x - y));
  // El modelo se acepta, y también con los operandos cambiados de sitio.
  const bien = corregir(item, modelo);
  assert.equal(bien.estado, 'bien', claveItem(item));
  assert.equal(bien.valor, resultado);
  const otra = aFichas(conmutada(item.modelo, rng));
  assert.ok(mismaExpresion(modelo, otra, rng));
  assert.equal(corregir(item, otra).estado, 'bien', `${claveItem(item)}: ${otra.join(' ')}`);
  assert.equal(corregir(item, ['(', ...modelo, ')']).estado, 'bien');
  // Los errores declarados se rechazan y se reconocen.
  for (const e of errores) {
    const r = corregir(item, aFichas(e.arbol));
    assert.equal(r.estado, 'mal', `${claveItem(item)}: ${aFichas(e.arbol).join(' ')}`);
    assert.equal(r.tipo, e.tipo);
    assert.equal(r.casualidad, false);
  }
  // Mal formada: no es acierto ni fallo.
  assert.equal(corregir(item, modelo.slice(0, -1).concat('+')).estado, 'malformada');
  // Dejarse un número se dice.
  const corto = corregir(item, [item.opciones[0]]);
  if (item.opciones.length > 1) {
    assert.equal(corto.estado, 'mal');
    assert.deepEqual(corto.faltan, item.opciones.slice(1));
  }
  return p;
}

test('ejercicio 1: 1500 ítems; el modelo es el resultado, sin paréntesis, y los errores no valen', () => {
  const rng = crearRng(11);
  const vistas = new Set();
  let anterior = null;
  for (let i = 0; i < 1500; i++) {
    const item = generarSin(rng, { anterior });
    assert.equal(item.tipo, 'montar');
    const p = comprobarMontar(item, 1, rng);
    assert.ok(!item.solucion.includes('('), `ejercicio 1 con paréntesis: ${p.id}`);
    assert.ok(!item.solucion.includes('²') && !item.solucion.includes('√'));
    if (anterior) assert.notEqual(item.plantilla, anterior.plantilla);
    vistas.add(p.id);
    anterior = item;
  }
  assert.equal(vistas.size, PLANTILLAS.filter(p => p.ej === 1).length, 'alguna plantilla no sale nunca');
});

test('ejercicio 2: 1500 ítems; paréntesis imprescindible y, cerca del 30 %, uno que sobra', () => {
  const rng = crearRng(22);
  const vistas = new Set();
  let sobran = 0;
  for (let i = 0; i < 1500; i++) {
    const item = generarCon(rng, { anterior: null });
    assert.equal(item.tipo, 'montar');
    const p = comprobarMontar(item, 2, rng);
    vistas.add(p.id);
    const { quitados } = quitarSobrantes(item.modelo);
    assert.equal(quitados, 0, `el modelo de ${p.id} lleva un paréntesis que sobra`);
    assert.ok(!item.solucion.includes('²') && !item.solucion.includes('√'));
    if (p.sobra) {
      sobran++;
      assert.ok(!item.solucion.includes('('), p.id);
      // Con el paréntesis de más también vale, y se avisa de que sobraba.
      const k = item.solucion.findIndex(f => f === '·' || f === ':');
      const conParentesis = [...item.solucion.slice(0, k - 1), '(', ...item.solucion.slice(k - 1, k + 2), ')', ...item.solucion.slice(k + 2)];
      const r = corregir(item, conParentesis);
      assert.equal(r.estado, 'bien', conParentesis.join(' '));
      assert.equal(r.quitados, 1);
      assert.deepEqual(aFichas(r.limpia), item.solucion);
    } else {
      assert.ok(item.solucion.includes('('), `${p.id} no lleva paréntesis`);
      // Sin el paréntesis es otra expresión: es imprescindible (o hay que desarrollar).
      const sin = item.solucion.filter(f => f !== '(' && f !== ')');
      assert.equal(corregir(item, sin).estado, 'mal', `${p.id}: ${sin.join(' ')}`);
    }
  }
  assert.equal(vistas.size, PLANTILLAS.filter(p => p.ej === 2).length, 'alguna plantilla no sale nunca');
  assert.ok(Math.abs(sobran / 1500 - P_VARIANTE) < 0.05, `sobra en el ${Math.round(sobran / 15)} %`);
});

test('ejercicio 3: 2000 ítems; montar y, cerca del 30 %, elegir entre el modelo y su gemela', () => {
  const rng = crearRng(33);
  const vistas = new Set();
  const posicion = [0, 0];
  let elegir = 0;
  for (let i = 0; i < 2000; i++) {
    const item = generarPotencias(rng, { anterior: null });
    vistas.add(`${item.tipo}/${item.plantilla}`);
    if (item.tipo === 'montar') {
      const p = comprobarMontar(item, 3, rng);
      assert.ok(item.solucion.includes('²') || item.solucion.includes('√'), p.id);
      continue;
    }
    elegir++;
    assert.equal(item.tipo, 'elegir');
    const { modelo, resultado } = comprobarItem(item, 3, rng);
    assert.equal(item.opciones.length, 2);
    posicion[item.solucion]++;
    // La opción correcta es el modelo; la otra es inequívocamente falsa.
    assert.deepEqual(aFichas(item.opciones[item.solucion]), modelo);
    const falsa = aFichas(item.opciones[1 - item.solucion]);
    const valorFalsa = valorJs(falsa);
    assert.ok(!(Number.isFinite(valorFalsa) && casi(valorFalsa, resultado)), `${claveItem(item)}: ${falsa.join(' ')}`);
    assert.ok(!mismaExpresion(modelo, falsa, rng), `${claveItem(item)}: ${falsa.join(' ')}`);
    assert.ok(!equivalentes(item.opciones[0], item.opciones[1]));
    // Las dos opciones usan los mismos números: solo cambia cómo se agrupan.
    const numeros = f => f.filter(x => typeof x === 'number').sort((x, y) => x - y);
    assert.deepEqual(numeros(falsa), numeros(modelo));
  }
  const de3 = PLANTILLAS.filter(p => p.ej === 3);
  assert.equal(vistas.size, 2 * de3.length, 'alguna plantilla no sale nunca en alguna de las dos variantes');
  assert.ok(Math.abs(elegir / 2000 - P_VARIANTE) < 0.05, `elegir en el ${Math.round(elegir / 20)} %`);
  // No gana quien pulsa siempre el mismo botón.
  for (const veces of posicion) assert.ok(veces / elegir <= 0.7, `una posición acierta el ${Math.round(100 * veces / elegir)} %`);
});

test('corregir: un acierto por otro camino vale, y una coincidencia de valor no', () => {
  const item = { tipo: 'montar', plantilla: 'menu', numeros: { a: 12, b: 3, c: 5 }, modelo: modeloDe(plantillaPorId('menu'), { a: 12, b: 3, c: 5 }) };
  assert.equal(corregir(item, F('(12+3)·5')).estado, 'bien');
  assert.equal(corregir(item, F('5·(3+12)')).estado, 'bien');
  assert.equal(corregir(item, F('12·5+3·5')).estado, 'bien');
  assert.deepEqual(corregir(item, F('12+3·5')), { estado: 'mal', valor: 27, faltan: [], tipo: 'par_falta', casualidad: false });
  assert.equal(corregir(item, F('12+3·')).estado, 'malformada');
  // (2 + 2) · 3 = 12 y 2 · 2 · 3 = 12: mismo valor, otra expresión.
  const doses = { tipo: 'montar', plantilla: 'menu', numeros: { a: 2, b: 2, c: 3 }, modelo: arbol(F('(2+2)·3')) };
  const r = corregir(doses, F('2·2·3'));
  assert.equal(r.estado, 'mal');
  assert.equal(r.casualidad, true);
});

test('corregir: el producto escrito como suma repetida es un acierto, y se dice qué número faltaba', () => {
  const item = (id, numeros) => ({ tipo: 'montar', plantilla: id, numeros, modelo: modeloDe(plantillaPorId(id), numeros) });
  const rng = crearRng(4);
  const valen = [
    ['lados', { a: 2, b: 49 }, '√49+√49', [2]],
    ['lados', { a: 3, b: 64 }, '√64+√64+√64', [3]],
    ['huevos', { a: 3, b: 12, c: 5 }, '12+12+12+5', [3]],
    ['huevos', { a: 3, b: 12, c: 5 }, '5+12+(12+12)', [3]],
    ['tienda', { a: 2, b: 12, c: 3 }, '12·3+12·3', [2]],
    ['menu', { a: 12, b: 3, c: 2 }, '(12+3)+(12+3)', [2]],
    ['menu', { a: 12, b: 3, c: 2 }, '12+12+3+3', [2]],
    ['suelo', { a: 6, b: 3 }, '3²+3²+3²+3²+3²+3²', [6]],
    ['cuadernos', { a: 2, b: 5, c: 3, d: 4 }, '5+5+4+4+4', [2, 3]],
    ['libros', { a: 50, b: 2, c: 8 }, '50-8-8', [2]],
  ];
  for (const [id, numeros, texto, veces] of valen) {
    const it = item(id, numeros);
    const r = corregir(it, F(texto));
    assert.equal(r.estado, 'bien', `${id}: ${texto}`);
    assert.deepEqual(r.repetida, veces, `${id}: ${texto}`);
    assert.deepEqual(sumaRepetida(arbol(F(texto)), it.modelo), veces);
    // Control independiente: vale lo mismo que el modelo cambiando los DEMÁS números por otros.
    const fijos = new Set(veces), otros = new Map();
    const sust = n => { if (fijos.has(n)) return n; if (!otros.has(n)) otros.set(n, 0.7 + 0.9 * rng.azar()); return otros.get(n); };
    assert.ok(casi(valorJs(F(texto), sust), valorJs(aFichas(it.modelo), sust)), `control, ${id}: ${texto}`);
    for (const idioma of ['es', 'en']) assert.ok(veces.every(v => TX.repetida[idioma](veces).includes(String(v))));
  }
  // El modelo de siempre no es «suma repetida».
  assert.equal(corregir(item('lados', { a: 2, b: 49 }), F('2·√49')).repetida, null);
  const noValen = [
    ['lados', { a: 2, b: 49 }, '49+49'],           // falta la raíz
    ['lados', { a: 2, b: 49 }, '√49·√49'],         // multiplica en vez de sumar
    ['lados', { a: 3, b: 64 }, '√64+√64'],         // dos veces, y son tres
    ['lados', { a: 2, b: 49 }, '√49'],
    ['huevos', { a: 3, b: 12, c: 5 }, '12+12+5'],
    ['huevos', { a: 3, b: 12, c: 5 }, '12+12+12'],
    ['menu', { a: 12, b: 3, c: 2 }, '12+12+3'],    // la trampa de siempre: solo se dobla el 12
    ['libros', { a: 50, b: 2, c: 8 }, '50-8+8'],
    ['libro_estuche', { a: 40, b: 12, c: 5 }, '40-12'],
  ];
  for (const [id, numeros, texto] of noValen) {
    const r = corregir(item(id, numeros), F(texto));
    assert.equal(r.estado, 'mal', `${id}: ${texto}`);
    assert.ok(r.faltan.length > 0, `${id}: ${texto}`);
  }
});

test('textos: los números que faltan se enumeran con comas («3, 4 y 5»)', () => {
  assert.equal(TX.faltan.es([3]), 'No has usado el 3.');
  assert.equal(TX.faltan.es([3, 4]), 'No has usado los números 3 y 4.');
  assert.equal(TX.faltan.es([3, 4, 5]), 'No has usado los números 3, 4 y 5.');
  assert.equal(TX.faltan.en([3]), 'You did not use 3.');
  assert.equal(TX.faltan.en([3, 4]), 'You did not use 3 and 4.');
  assert.equal(TX.faltan.en([3, 4, 5]), 'You did not use 3, 4 and 5.');
  assert.ok(TX.repetida.es([2, 3]).includes('los números 2 y 3') && TX.repetida.es([2]).includes('el 2 '));
});

test('catálogo: la práctica declara los tres ejercicios que fija el reparto', () => {
  assert.equal(practicaPorSlug('expresion').nEjercicios, 3);
  for (const ej of ['sin', 'con', 'potencias']) {
    for (const campo of ['nombre', 'detalle', 'introduccion']) assert.ok(TX[ej][campo].es && TX[ej][campo].en, `${ej}.${campo}`);
  }
});
