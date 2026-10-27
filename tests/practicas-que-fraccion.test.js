// Práctica «¿Qué fracción es?» de la unidad 4: 3000 ítems por ejercicio con semillas fijas.
// Se comprueba, aparte del generador y por valor (enteros, nunca decimales): que las figuras y
// las cotas de los contextos son creíbles, que las impropias entran (6/6 incluida), que ninguna
// opción vale lo mismo que otra, que cada distractor lleva un error con nombre y que ninguna
// lectura válida aparece como distractor. Y que ningún texto de alumno lleva ×, letras de
// variable, decimales, fracciones negativas ni números mixtos, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion, aFraccion, lecturasValidas, enPalabras, htmlFraccion } from '../practicas/_comun/fracciones.js';
import {
  fr, generarLeeFigura, generarSombrea, generarFrase, generarLee, errorLeeFigura, errorSombrea, errorFrase,
  CONTEXTOS, contextoDe, nombreDe, ERRORES_PROPIOS, PARTES_CUADRICULA, PARTES_MAX, claveDe,
} from '../practicas/que-fraccion/logica.js';
import { TX } from '../practicas/que-fraccion/textos.js';

const N = 3000;
const lote = (generar, semilla, sesion) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng, sesion));
};
const sinHtml = t => t.replace(/<[^>]+>/g, '');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-\s]+/g, ' ').trim();

// ─── Ejercicio 1 ────────────────────────────────────────────────────────────────────

test('ej. 1: figuras posibles, impropias incluida 6/6, y la consigna exacta cuando toca', () => {
  const items = lote(generarLeeFigura, 4701);
  let impropias = 0, seis = 0, exactas = 0, equivalentes = 0;
  const tipos = new Set();
  for (const it of items) {
    tipos.add(it.tipo);
    assert.ok(it.den >= 2 && it.den <= PARTES_MAX, `den ${it.den}`);
    assert.ok(it.num >= 1, 'al menos una sombreada');
    assert.equal(it.figuras, Math.max(1, Math.ceil(it.num / it.den)));
    assert.ok(it.figuras <= 2);
    assert.ok(it.num <= it.den * it.figuras);
    if (it.tipo === 'cuadricula') {
      assert.ok(PARTES_CUADRICULA.includes(it.den), `cuadrícula de ${it.den}`);
      assert.equal(it.filas * it.columnas, it.den);
    }
    if (it.num >= it.den) impropias++;
    if (it.num === it.den) seis++;
    if (it.exacta) exactas++; else equivalentes++;
    assert.notEqual(`${it.num}/${it.den}`, '13/13');
  }
  assert.deepEqual([...tipos].sort(), ['barra', 'cuadricula', 'pizza']);
  assert.ok(impropias > N * 0.15 && impropias < N * 0.4, `impropias: ${impropias}`);
  assert.ok(seis > 0, 'sale alguna k = n (6/6 es impropia)');
  assert.ok(exactas > N * 0.4 && equivalentes > N * 0.4);
});

test('ej. 1: la respuesta buena no falla, los errores típicos se reconocen y valen lo que dicen', () => {
  for (const it of lote(generarLeeFigura, 4702)) {
    const buena = fraccion(it.num, it.den);
    assert.equal(errorLeeFigura(it, buena), null);
    if (!it.exacta) assert.equal(errorLeeFigura(it, buena.equivalentePor(2)), null);
    else assert.equal(errorLeeFigura(it, buena.equivalentePor(2)), 'simplificada-sin-pedirlo');
    if (it.num < it.den) {
      const mal = fraccion(it.num, it.den - it.num);
      assert.equal(errorLeeFigura(it, mal), 'parte-entre-el-resto');
      assert.ok(!mal.equals(buena));
    }
    if (it.num !== it.den) assert.equal(errorLeeFigura(it, fraccion(it.den, it.num)), 'terminos-al-reves');
    if (it.figuras > 1) assert.equal(errorLeeFigura(it, fraccion(it.num, it.den * 2)), 'cuenta-todas-las-partes');
  }
});

// ─── Ejercicio 2 ────────────────────────────────────────────────────────────────────

test('ej. 2: fracción propia irreducible, figura con múltiplo del denominador y objetivo entero', () => {
  let conMultiplo = 0;
  for (const it of lote(generarSombrea, 4703)) {
    assert.ok(it.num >= 1 && it.num < it.den, 'propia');
    assert.ok(fraccion(it.num, it.den).esIrreducible(), `irreducible ${it.num}/${it.den}`);
    assert.equal(it.partes % it.den, 0, 'las partes son múltiplo del denominador');
    assert.ok(it.partes >= 2 && it.partes <= PARTES_MAX);
    assert.equal(it.objetivo, (it.num * it.partes) / it.den);
    assert.ok(Number.isInteger(it.objetivo) && it.objetivo > 0 && it.objetivo < it.partes);
    if (it.tipo === 'cuadricula') assert.equal(it.filas * it.columnas, it.partes);
    if (it.partes > it.den) conMultiplo++;
    assert.equal(errorSombrea(it, it.objetivo), null);
    assert.equal(it.objetivo + (it.partes - it.objetivo), it.partes);
    if (it.m > 1) assert.equal(errorSombrea(it, it.num), 'solo-el-numerador');
    assert.notEqual(errorSombrea(it, it.partes - it.objetivo === it.objetivo ? 0 : it.partes - it.objetivo), null);
  }
  assert.ok(conMultiplo > N * 0.3, `figuras con múltiplo: ${conMultiplo}`);
});

// ─── Ejercicio 3 ────────────────────────────────────────────────────────────────────

test('ej. 3: el total y la parte están en la cota del contexto y la parte es menor que el total', () => {
  const vistos = new Set();
  for (const it of lote(generarFrase, 4704)) {
    const c = contextoDe(it.contexto);
    vistos.add(it.contexto);
    assert.ok(c, it.contexto);
    assert.ok(it.n >= c.min && it.n <= c.max, `${c.id}: ${it.n} fuera de ${c.min}-${c.max}`);
    assert.ok(it.k >= 1 && it.k < it.n, `${c.id}: parte ${it.k} de ${it.n}`);
    assert.ok(it.k / it.n >= c.frac[0] - 1e-9 || it.k === 1, `${c.id}: ${it.k}/${it.n} muy pequeña`);
    assert.ok(it.k <= Math.max(1, Math.floor(it.n * c.frac[1])), `${c.id}: ${it.k}/${it.n} muy grande`);
    assert.notEqual(2 * it.k, it.n, 'la mitad no sale: sería equivalente a su resto');
  }
  assert.equal(vistos.size, CONTEXTOS.length);
});

test('ej. 3: cotas de realismo de cada contexto (acta del 26-10)', () => {
  const cota = { 'clase-gafas': [12, 36], 'clase-bici': [12, 36], tarta: [3, 15], equipo: [11, 25], caja: [6, 24] };
  for (const c of CONTEXTOS) assert.deepEqual([c.min, c.max], cota[c.id], c.id);
});

test('ej. 3: cuatro opciones, una buena, ninguna equivalente a otra, todas las falsas con error con nombre', () => {
  let elegir = 0, escribir = 0;
  for (const it of lote(generarFrase, 4705)) {
    if (it.modo === 'escribir') { escribir++; assert.equal(it.opciones, undefined); continue; }
    elegir++;
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const claves = it.opciones.map(o => fr(o).clave());
    assert.equal(new Set(claves).size, 4, `equivalentes: ${claves}`);
    for (const o of it.opciones) {
      if (o.correcta) { assert.equal(o.num, it.k); assert.equal(o.den, it.n); continue; }
      assert.ok(!fr(o).equals(fraccion(it.k, it.n)), `distractor ${o.num}/${o.den} vale lo mismo que ${it.k}/${it.n}`);
      assert.ok(nombreDe(o.error), `error sin nombre: ${o.error}`);
      assert.equal(errorFrase(it, fr(o)), o.error, `el error ${o.error} no se reconoce`);
    }
    assert.deepEqual(it.opciones.filter(o => !o.correcta).map(o => o.error).sort(), ['la-parte-que-falta', 'parte-entre-el-resto', 'terminos-al-reves']);
  }
  assert.ok(elegir > 1000 && escribir > 600);
});

test('ej. 3: una equivalente vale al escribir, y la buena siempre', () => {
  for (const it of lote(generarFrase, 4706)) {
    assert.equal(errorFrase(it, fraccion(it.k, it.n)), null);
    assert.equal(errorFrase(it, fraccion(it.k, it.n).simplificar()), null);
    assert.equal(errorFrase(it, fraccion(it.k, it.n).equivalentePor(3)), null);
  }
});

// ─── Ejercicio 4 ────────────────────────────────────────────────────────────────────

for (const idioma of ['en', 'es']) {
  test(`ej. 4 (${idioma}): cuatro opciones, ninguna lectura válida de la fracción como distractor, ninguna repetida`, () => {
    const items = lote(generarLee, idioma === 'en' ? 4707 : 4708, { idioma });
    let especiales = 0, lectura = 0, fraccionSentido = 0, impropias = 0;
    for (const it of items) {
      assert.equal(it.idioma, idioma);
      const buena = fraccion(it.num, it.den);
      assert.equal(it.texto, enPalabras(buena, idioma));
      assert.equal(it.opciones.length, 4);
      assert.equal(it.opciones.filter(o => o.correcta).length, 1);
      if (['1/2', '1/4', '3/4'].includes(`${it.num}/${it.den}`)) especiales++;
      if (it.num >= it.den) impropias++;
      assert.notEqual(`${it.num}/${it.den}`, '9/11');
      if (it.sentido === 'lectura') {
        lectura++;
        const validas = new Set(lecturasValidas(buena, idioma).map(norm));
        const textos = it.opciones.map(o => norm(o.texto));
        assert.equal(new Set(textos).size, 4, `lecturas repetidas: ${textos}`);
        for (const o of it.opciones) {
          if (o.correcta) { assert.ok(validas.has(norm(o.texto))); continue; }
          assert.ok(!validas.has(norm(o.texto)), `«${o.texto}» es una lectura válida de ${it.num}/${it.den}`);
          assert.ok(nombreDe(o.error), o.error);
        }
      } else {
        fraccionSentido++;
        const claves = it.opciones.map(o => fr(o).clave());
        assert.equal(new Set(claves).size, 4, `equivalentes: ${claves}`);
        for (const o of it.opciones) {
          if (o.correcta) { assert.ok(fr(o).equals(buena)); continue; }
          assert.ok(!fr(o).equals(buena));
          assert.ok(nombreDe(o.error), o.error);
          // Lo que lee el distractor no es una lectura de la fracción buena.
          assert.ok(!lecturasValidas(fr(o), idioma).map(norm).includes(norm(it.texto)), `«${it.texto}» también lee ${o.num}/${o.den}`);
        }
      }
    }
    assert.ok(especiales > N * 0.25 && especiales < N * 0.5, `especiales: ${especiales}`);
    assert.ok(lectura > N * 0.35 && fraccionSentido > N * 0.35);
    assert.ok(impropias > 0);
  });
}

test('ej. 4: nunca se enfrentan las parejas válidas (three quarters / three fourths, a half / one half…)', () => {
  const parejas = [['three quarters', 'three fourths'], ['a half', 'one half'], ['a quarter', 'one fourth'], ['a quarter', 'one quarter'], ['un medio', 'la mitad'], ['doceavos', 'dozavos']];
  for (const idioma of ['en', 'es']) {
    for (const it of lote(generarLee, 4709, { idioma })) {
      if (it.sentido !== 'lectura') continue;
      const textos = it.opciones.map(o => norm(o.texto));
      for (const [a, b] of parejas) assert.ok(!(textos.includes(norm(a)) && textos.includes(norm(b))), `${a} / ${b} juntas: ${textos}`);
    }
  }
});

// ─── Todos los ejercicios ────────────────────────────────────────────────────────────

test('claves distintas para ítems distintos y textos de alumno sin ×, letras, decimales ni mixtos', () => {
  const textos = [];
  const recoger = (it, extra = []) => textos.push(...extra);
  for (const idioma of ['es', 'en']) {
    const rng = crearRng(4710);
    for (let i = 0; i < 600; i++) {
      const a = generarLeeFigura(rng), b = generarSombrea(rng), c = generarFrase(rng), d = generarLee(rng, { idioma });
      assert.ok(claveDe(a) && claveDe(b) && claveDe(c) && claveDe(d));
      recoger(a, [TX.ej1.instruccion[idioma](a), TX.ej1.correcto[idioma](a), TX.ej1.solucion[idioma](a), TX.ej1.nombreFigura[idioma],
        TX.ej4.instruccionLectura[idioma](d), TX.ej4.instruccionFraccion[idioma](d),
        ...Object.values(TX.ej1.por_que).map(p => p[idioma](a))]);
      recoger(b, [TX.ej2.instruccion[idioma](b), TX.ej2.correcto[idioma](b), TX.ej2.solucion[idioma](b),
        ...Object.values(TX.ej2.por_que).map(p => p[idioma](b, 3))]);
      const ctx = contextoDe(c.contexto);
      recoger(c, [ctx[idioma](c.n, c.k), ctx.pregunta[idioma], TX.ej3.correcto[idioma](c), TX.ej3.solucion[idioma](c), TX.ej3.equivalente[idioma](c),
        ...Object.values(TX.ej3.por_que).map(p => p[idioma](c))]);
      recoger(d, [d.texto, TX.ej4.solucion[idioma](d), ...Object.values(TX.ej4.por_que).map(p => p[idioma](d, d.texto)),
        ...d.opciones.filter(o => o.texto).map(o => o.texto)]);
    }
  }
  for (const grupo of [TX.ej1, TX.ej2, TX.ej3, TX.ej4]) for (const campo of ['nombre', 'detalle', 'introduccion']) textos.push(grupo[campo].es, grupo[campo].en);
  assert.ok(textos.length > 5000);
  for (const t of textos) {
    assert.equal(typeof t, 'string');
    const limpio = sinHtml(t);
    assert.ok(!limpio.includes('×'), `× en «${limpio}»`);
    assert.ok(!/\d[.,]\d/.test(limpio.replace(/\d{1,3}(?:[.,]\d{3})+/g, '')), `decimal en «${limpio}»`);
    assert.ok(!/[−-]\s*\d+\s*\/\s*\d+/.test(limpio) && !/−\d/.test(limpio), `fracción negativa en «${limpio}»`);
    assert.ok(!/\d+\s+\d+\s*\/\s*\d+/.test(limpio), `número mixto en «${limpio}»`);
    assert.ok(!/\b[a-z]\s*=\s*\d/.test(limpio.replace(/<[^>]*>/g, '')), `ecuación en «${limpio}»`);
    // Ninguna fracción con barra fuera de una frase en inglés hablado.
    assert.ok(!/\d\s*\/\s*\d/.test(limpio), `barra de fracción en «${limpio}»`);
  }
});

test('todos los errores que producen los generadores tienen nombre en los dos idiomas', () => {
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) {
    assert.ok(e.nombre.es && e.nombre.en, id);
    assert.equal(id, id.toLowerCase());
    assert.ok(/^[a-z-]+$/.test(id), id);
  }
  assert.ok(nombreDe('parte-entre-el-resto').es, 'el de fracciones.js se resuelve');
});

test('htmlFraccion de las opciones del ej. 3 sigue siendo una raya (no una barra)', () => {
  const html = htmlFraccion(aFraccion('7/28'), { compacta: true });
  assert.ok(html.includes('class="frac'));
  assert.ok(!html.includes('/'.concat('28')));
});
