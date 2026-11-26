// «No lo sé» de «Tablas de proporcionalidad» (PU2 tarea 213): la explicación de cada ítem contiene la solución
// calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  CTX_CONSTANTE, generarEsProporcional, generarCompleta, generarConstante, generarDirectas, valorHueco, unidadHueco,
  solucionConstante, dinero, dineroCelda, decimal, CONTEXTOS,
} from '../practicas/tabla-proporcional/logica.js';
import { explicaEsProporcional, explicaCompleta, explicaConstante, explicaDirectas, fx, fy } from '../practicas/tabla-proporcional/textos.js';

const N = 1000;
const IDIOMAS = ['es', 'en'];
const texto = h => h.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };

test('ej. 1: la explicación dice la respuesta y la cuenta del par doble/triple', () => {
  for (const it of lote(generarEsProporcional, 21)) for (const idioma of IDIOMAS) {
    const x = texto(explicaEsProporcional(it, { idioma }));
    const { i, j, m } = it.par;
    assert.ok(x.includes(it.si ? (idioma === 'es' ? 'La respuesta es: sí' : 'The answer is: yes') : (idioma === 'es' ? 'La respuesta es: no' : 'The answer is: no')), x);
    assert.ok(x.includes(texto(fx(it.ctx, it.cols[j].x))));
    if (!it.si) assert.ok(x.includes(`${m} · ${fy(it.ctx, it.cols[i].y, idioma)} = ${fy(it.ctx, m * it.cols[i].y, idioma)}`), x);
    if (it.si) {
      const col = it.cols[0], u = col.x / CONTEXTOS[it.ctx].xMul;
      assert.ok(x.includes(`${fy(it.ctx, col.y, idioma)} : ${u} = ${fy(it.ctx, col.y / u, idioma)}`), x);
    }
  }
});

test('ej. 2: la explicación trae los dos huecos con su unidad', () => {
  for (const it of lote(generarCompleta, 22)) for (const idioma of IDIOMAS) {
    const x = texto(explicaCompleta(it, { idioma }));
    for (const h of it.huecos) {
      const col = it.cols[h.col];
      const v = h.que === 'x' ? fx(it.ctx, col.x) : fy(it.ctx, col.y, idioma);
      assert.ok(x.includes(v), `${v} en ${x}`);
      assert.ok(valorHueco(it, h) && (unidadHueco(it, h) !== undefined));
    }
    assert.ok(x.includes(idioma === 'es' ? 'La respuesta es' : 'The answer is'));
    const ref = it.cols[it.ref], u = ref.x / CONTEXTOS[it.ctx].xMul;
    if (u === 1) assert.ok(!x.includes(`: 1 =`), x);
    else assert.ok(x.includes(`${fy(it.ctx, ref.y, idioma)} : ${u} = ${fy(it.ctx, ref.y / u, idioma)}`), x);
    // arriba, la fila de x; abajo, la de y
    const hy = it.huecos.find(h => h.que === 'y'), hx = it.huecos.find(h => h.que === 'x');
    const [ab, ar] = idioma === 'es' ? ['Casilla de abajo, con ', 'Casilla de arriba, con '] : ['Bottom box, with ', 'Top box, with '];
    assert.ok(x.includes(ab + fx(it.ctx, it.cols[hy.col].x)), x);
    assert.ok(x.includes(ar + fy(it.ctx, it.cols[hx.col].y, idioma)), x);
  }
});

test('ej. 3: la explicación termina en la solución, en el formato del idioma', () => {
  for (const it of lote(generarConstante, 23)) for (const idioma of IDIOMAS) {
    const x = texto(explicaConstante(it, { idioma }));
    const c = CTX_CONSTANTE[it.ctx], sol = solucionConstante(it);
    const esperado = c.din ? dinero(it.k, idioma) : `${decimal(sol, idioma)} ${c.unidadY}`;
    assert.ok(x.includes(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} ${esperado}`), x);
    assert.ok(x.includes(` : ${it.cols[0].x / (c.xMul ?? 1)} = ${esperado}`), x);
    if (c.din) assert.ok(x.includes(dineroCelda(it.k, idioma)));
  }
});

test('ej. 4: la explicación repite la respuesta y el porqué del banco', () => {
  for (const it of lote(generarDirectas, 24)) for (const idioma of IDIOMAS) {
    const x = texto(explicaDirectas(it, { idioma }));
    assert.ok(x.includes(it.por[idioma]));
    const resp = idioma === 'es' ? (it.si ? 'sí' : 'no') : (it.si ? 'yes' : 'no');
    assert.ok(x.endsWith(`${resp}.`), x);
  }
});
