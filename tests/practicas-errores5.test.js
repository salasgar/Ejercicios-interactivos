// Práctica «Caza el error» de la unidad 5 (PU2, tarea 128): la lógica se prueba por fuerza bruta con semillas
// fijas (3000 ítems por ejercicio). El valor bueno y el malo de cada plantilla se recalculan aquí a mano, con
// enteros, sin pasar por ERRORES_TIPICOS ni por la aritmética de decimales.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import { ERRORES_TIPICOS, deTexto, aTexto, mismoValor, MENOS } from '../practicas/_comun/decimales.js';
import * as L from '../practicas/errores5/logica.js';
import { TX } from '../practicas/errores5/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };
const D = deTexto;
const p10 = n => 10n ** BigInt(n);
const B = BigInt;
/** Un Decimal es [m, 10^k] igual a [n, d]. */
const igual = (x, [n, d]) => B(x.m) * B(d) === B(n) * p10(x.k);
/** Cociente entero hacia el 0. */
const cociente = (p, q) => p / q;

/** [numerador, denominador] bueno y malo de cada plantilla, calculados a mano con BigInt. */
const MANO = {
  'alinea-a-la-derecha'([a, b, op]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k), s = op === '+' ? 1n : -1n;
    return {
      bien: [B(A.m) * p10(k - A.k) + s * B(Bb.m) * p10(k - Bb.k), p10(k)],
      mal: [B(A.m) + s * B(Bb.m), p10(k)],
    };
  },
  'coma-mal-puesta'([a, b]) {
    const A = D(a), Bb = D(b), m = B(A.m) * B(Bb.m);
    return { bien: [m, p10(A.k + Bb.k)], mal: [m, p10(Math.max(A.k, Bb.k))] };
  },
  'por-diez-anadiendo-cero'([d, n, c]) {
    const A = D(d);
    return { bien: [B(A.m) * p10(n) + B(c) * p10(A.k), p10(A.k)], mal: [B(A.m) + B(c) * p10(A.k), p10(A.k)] };
  },
  'redondea-truncando'([a, b, c]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k), S = B(A.m) * p10(k - A.k) + B(Bb.m) * p10(k - Bb.k);
    const dos = p10(k - c);
    return { bien: [cociente(S + dos / 2n, dos), p10(c)], mal: [cociente(S, dos), p10(c)] };
  },
  'redondea-en-cadena'([a, b, c]) {
    const A = D(a), Bb = D(b), k = Math.max(A.k, Bb.k);
    let S = B(A.m) * p10(k - A.k) + B(Bb.m) * p10(k - Bb.k), kk = k;
    const bien = [cociente(S + p10(k - c) / 2n, p10(k - c)), p10(c)];
    while (kk > c) { S = cociente(S + 5n, 10n); kk--; }
    return { bien, mal: [S, p10(c)] };
  },
  'olvida-coma-cociente'([a, b]) {
    const A = D(a);
    return { bien: [B(A.m), B(b) * p10(A.k)], mal: [B(A.m) / B(b), 1n] };
  },
  'coma-solo-en-divisor'([a, b]) {
    const A = D(a), Bb = D(b);
    return { bien: [B(A.m) * p10(Bb.k), B(Bb.m) * p10(A.k)], mal: [B(A.m), B(Bb.m) * p10(A.k)] };
  },
  'resto-sin-deshacer'([a, b]) {
    const A = D(a), Bb = D(b);
    const Q = cociente(B(A.m) * p10(Bb.k) * 100n, B(Bb.m) * p10(A.k));       // cociente cortado, en centésimas
    const den = p10(A.k + Bb.k) * 100n;
    const resto = B(A.m) * p10(Bb.k) * 100n - B(Bb.m) * Q * p10(A.k);          // resto de la original · den
    return { bien: [resto, den], mal: [resto * p10(Bb.k), den] };
  },
  'fraccion-al-reves'([n, d]) { return { bien: [B(n), B(d)], mal: [cociente(B(d) * 100n, B(n)), 100n] }; },
  'periodico-por-redondeo'([n, d]) { return { bien: null, mal: [cociente(200n * B(n) + B(d), 2n * B(d)), 100n] }; },
  'compara-por-cifras'([a, b]) {
    const A = D(a), Bb = D(b);
    const bien = B(A.m) * p10(Bb.k) - B(Bb.m) * p10(A.k);
    const mal = (B(A.m) % p10(A.k)) - (B(Bb.m) % p10(Bb.k));
    const signo = x => (x > 0n ? 1n : x < 0n ? -1n : 0n);
    return { bien: signo(bien), mal: signo(mal) };
  },
};
const finalDe = (item, idioma = 'es') => L.textoLinea(item.lineas.at(-1), idioma);

test('hay una plantilla por cada error que enseña la práctica, con nombre y cálculo a mano', () => {
  assert.equal(L.PLANTILLAS.length, 11);
  for (const p of L.PLANTILLAS) {
    assert.ok(ERRORES_TIPICOS[p.id], p.id);
    assert.ok(MANO[p.id], `${p.id} sin comprobación a mano`);
    assert.equal(L.CLASE_DE[p.id], p.clase);
  }
  assert.equal(new Set(L.PLANTILLAS.map(p => p.id)).size, 11);
  const ficha = CATALOGO.find(c => c.slug === 'errores5');
  assert.equal(ficha.nEjercicios, 3);
});

test('cada plantilla: el valor bueno y el malo coinciden con el cálculo a mano y son distintos', () => {
  const rng = crearRng(3);
  for (const p of L.PLANTILLAS) {
    let n = 0;
    for (let i = 0; i < 600 && n < 150; i++) {
      const params = p.params(rng);
      if (!params) continue;
      n++;
      const { bien, mal } = MANO[p.id](params);
      if (p.id === 'compara-por-cifras') {
        assert.equal(B(p.bien(params)), bien, `${p.id} ${params}`);
        assert.equal(B(p.malFinal(params)), mal, `${p.id} ${params}`);
        assert.equal(bien, -mal, 'la comparación mala es la contraria');
        assert.notEqual(bien, 0n);
        continue;
      }
      assert.ok(igual(p.malFinal(params), mal), `${p.id} ${params}: malFinal ${p.malFinal(params)}`);
      assert.ok(igual(p.valorError(params).normalizar ? p.valorError(params) : p.malFinal(params), p.id === 'por-diez-anadiendo-cero' ? [mal[0] - B(params[2]) * p10(D(params[0]).k), mal[1]] : mal));
      if (bien) {
        assert.ok(igual(p.bien(params), bien), `${p.id} ${params}: bien ${p.bien(params)}`);
        assert.ok(bien[0] * mal[1] !== mal[0] * bien[1], `${p.id} ${params}: el malo vale lo mismo que el bueno`);
      } else {
        assert.equal(p.corrige, false);
        assert.equal(p.bien(params), null);
      }
    }
    assert.ok(n >= 20, `${p.id}: solo ${n} casos`);
  }
});

test('ejercicio 1: la línea mala es la marcada; las anteriores están bien y el resultado malo es el de la plantilla', () => {
  const items = generar(L.generarDonde);
  const posiciones = new Set(), vistas = new Set();
  let sinError = 0;
  for (const item of items) {
    assert.equal(item.tipo, 'donde');
    assert.equal(item.lineas.length, 3);
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    const buena = p.cadena(item.params, false);
    assert.equal(buena.falsa, null);
    vistas.add(item.plantilla);
    if (item.falsa === null) {
      sinError++;
      assert.equal(item.error, null);
      assert.deepEqual(item.lineas, buena.lineas);
      if (MANO[p.id](item.params).bien && p.id !== 'compara-por-cifras') {
        // El resultado de la última línea vale lo bueno (aunque lleve ceros al final).
        const fin = D(finalDe(item).replace(/^[=≈] /, '').split(' ')[0].replace(/…$/, ''));
        assert.ok(fin === null || mismoValor(fin, p.bien(item.params)) || p.id === 'resto-sin-deshacer' || p.id === 'redondea-truncando', `${p.id}: ${finalDe(item)}`);
      }
    } else {
      assert.ok(item.falsa === 1 || item.falsa === 2, 'la línea 1 es el enunciado y nunca está mal');
      assert.equal(item.error, p.id);
      posiciones.add(item.falsa);
      // Antes de la mala, igual que la buena; la mala, distinta (en los dos idiomas); el resto sigue de ella.
      for (let i = 0; i < item.falsa; i++) assert.deepEqual(item.lineas[i], buena.lineas[i]);
      for (const idioma of ['es', 'en']) {
        assert.notEqual(L.textoLinea(item.lineas[item.falsa], idioma), L.textoLinea(buena.lineas[item.falsa], idioma), `${p.id}: ${item.params}`);
      }
    }
  }
  assert.deepEqual([...posiciones].sort(), [1, 2], 'el error no puede estar siempre en la misma línea');
  assert.equal(vistas.size, L.PLANTILLAS.length, 'todas las plantillas salen');
  assert.ok(sinError > N * 0.28 && sinError < N * 0.38, `sin error: ${sinError} de ${N} (un tercio)`);
});

test('el resultado malo que se ve es el del error de la plantilla (última línea o paso marcado)', () => {
  for (const item of generar(L.generarQue, 5)) {
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    const mal = L.textoLinea(item.lineas.at(-1), 'es');
    if (['por-diez-anadiendo-cero', 'coma-solo-en-divisor', 'fraccion-al-reves'].includes(p.id)) continue;   // el error está en la línea 2; la 3 sigue de él
    const texto = mal.replace(/^= /, '').replace(/^≈ /, '').replace(/ \(.*\)$/, '');
    if (p.id === 'compara-por-cifras') { assert.match(texto, /[<>]/); continue; }
    if (p.id === 'resto-sin-deshacer') { assert.ok(mismoValor(D(mal.split(': ')[1]), p.malFinal(item.params))); continue; }
    if (p.id === 'alinea-a-la-derecha' || p.id === 'olvida-coma-cociente') { assert.ok(mismoValor(D(texto), p.malFinal(item.params)), `${p.id}: ${mal}`); continue; }
    assert.ok(mismoValor(D(texto), p.malFinal(item.params)), `${p.id}: ${mal}`);
  }
});

test('ejercicio 2: cuatro nombres distintos, solo uno verdadero; los otros darían otro resultado', () => {
  const items = generar(L.generarQue);
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'que');
    assert.ok(item.falsa === 1 || item.falsa === 2);
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    vistas.add(p.id);
    assert.equal(item.opciones.length, 4);
    assert.equal(new Set(item.opciones).size, 4);
    assert.equal(item.solucion, p.id);
    assert.equal(item.opciones.filter(id => id === item.solucion).length, 1);
    for (const idioma of ['es', 'en']) assert.equal(new Set(item.opciones.map(id => ERRORES_TIPICOS[id].nombre[idioma])).size, 4);
    for (const id of item.opciones) {
      assert.ok(ERRORES_TIPICOS[id], `${id}: tiene que ser un error típico con nombre`);
      if (id === item.solucion) continue;
      // Un nombre falso o es de otro cálculo o, aplicado a estos números, da otro valor (o no se aplica).
      assert.equal(L.explica(p, id, item.params), false, `${id} también explica ${p.id} ${item.params}`);
      if (L.CLASE_DE[id] === p.clase) {
        for (const args of p.args(id, item.params)) {
          const r = ERRORES_TIPICOS[id].fn(...args);
          assert.ok(r === null || !mismoValor(r, p.valorError(item.params)), `${id} frente a ${p.id}`);
        }
      }
    }
  }
  assert.equal(vistas.size, L.PLANTILLAS.length);
});

test('ejercicio 3: la respuesta correcta por valor, con coma o punto y con o sin ceros finales', () => {
  const items = generar(L.generarCorrige);
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'corrige');
    const p = L.PLANTILLA_POR_ID[item.plantilla];
    assert.ok(p.corrige, `${p.id} no se puede teclear`);
    vistas.add(p.id);
    const bien = L.resultadoBueno(item);
    for (const idioma of ['es', 'en']) {
      const escrito = deTexto(aTexto(bien, idioma));
      assert.equal(L.corregirCorrige(item, escrito).acierto, true, `${p.id}: ${aTexto(bien, idioma)}`);
    }
    if (item.cifras === null) {
      assert.equal(L.corregirCorrige(item, bien.conCifras(bien.k + 1)).acierto, true, 'los ceros finales no son un error');
    } else {
      // Redondeo: el valor bueno con otro número de cifras no vale (el enunciado dice cuántas).
      assert.equal(bien.k, item.cifras);
      const mas = L.corregirCorrige(item, bien.conCifras(bien.k + 1));
      assert.deepEqual([mas.acierto, mas.error], [false, 'cifras']);
    }
    const mal = L.corregirCorrige(item, p.malFinal(item.params));
    assert.deepEqual([mal.acierto, mal.error], [false, 'repite-el-error']);
    const otro = L.corregirCorrige(item, deTexto('123,456'));
    assert.deepEqual([otro.acierto, otro.error], [false, 'otro-resultado']);
    assert.equal(mismoValor(p.malFinal(item.params), bien), false);
  }
  assert.equal(vistas.size, L.PLANTILLAS.filter(p => p.corrige).length);
});

test('el redondeo dice a qué orden y el valor bueno lleva justo esas cifras', () => {
  const rng = crearRng(9);
  for (const id of ['redondea-truncando', 'redondea-en-cadena']) {
    const p = L.PLANTILLA_POR_ID[id];
    const ordenes = new Set();
    for (let i = 0; i < 200; i++) {
      const params = p.params(rng);
      if (!params) continue;
      assert.equal(p.bien(params).k, params[2]);
      const { lineas } = p.cadena(params, true);
      ordenes.add(params[2]);
      for (const idioma of ['es', 'en']) assert.match(L.textoLinea(lineas[2], idioma), /\(.+\)/);
    }
    assert.deepEqual([...ordenes].sort(), [0, 1, 2]);
  }
});

test('los casos de la hoja de la semana (en claro) y los del examen (por huella) no salen nunca', () => {
  // Que la comprobación existe y no depende del orden de los sumandos ni de los ceros finales.
  assert.ok(L.HOJA.has(L.claveCaso('suma+', ['1,25', '3,6'], true)));
  assert.ok(L.HOJA.has(L.claveCaso('suma+', ['3,60', '1,250'], true)));
  assert.ok(L.HOJA.has(L.claveCaso('redondeo', ['6,3490'])));
  assert.ok(L.HOJA.has(L.claveCaso('division', ['9', '2'])));
  assert.ok(!L.HOJA.has(L.claveCaso('suma−', ['3,6', '1,25'])));
  assert.ok(L.HUELLAS_EXAMEN instanceof Set);
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 23)) {
      const clave = L.PLANTILLA_POR_ID[item.plantilla].caso(item.params);
      assert.ok(!L.HOJA.has(clave), `caso de la hoja: ${clave}`);
      assert.ok(!L.HUELLAS_EXAMEN.has(L.huella(clave)), `caso del examen: ${clave}`);
    }
  }
});

test('sin error, algunos resultados llevan ceros al final y el feedback lo recuerda', () => {
  const items = generar(L.generarDonde, 31).filter(i => i.falsa === null);
  assert.ok(items.some(L.tieneCerosFinales), 'tiene que salir algún 3,50 sin error');
  assert.ok(items.some(i => !L.tieneCerosFinales(i)));
});

test('los ítems son JSON (la base los guarda) y se pintan igual después de ida y vuelta', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 41).slice(0, 300)) {
      const copia = JSON.parse(JSON.stringify(item));
      assert.deepEqual(copia, item);
      for (const idioma of ['es', 'en']) assert.deepEqual(copia.lineas.map(l => L.htmlLinea(l, idioma)), item.lineas.map(l => L.htmlLinea(l, idioma)));
      assert.equal(L.claveItem(copia), L.claveItem(item));
    }
  }
});

const sinHtml = s => s.replace(/<[^>]*>/g, '');
/** Las reglas de la unidad en un texto que lee el alumno. */
function reglasDeTexto(texto, idioma, donde) {
  const t = sinHtml(texto);
  assert.ok(!t.includes('×'), `${donde}: «×»: ${t}`);
  assert.ok(!t.includes('%'), `${donde}: porcentaje: ${t}`);
  assert.ok(!/(?<![\d,.])\d{5,}/.test(t), `${donde}: más de cuatro cifras enteras: ${t}`);
  assert.ok(!/\b[xz]\b/.test(t), `${donde}: letra de variable: ${t}`);
  assert.ok(!/\d\.\d{3}\.\d|\d,\d{3},\d/.test(t), `${donde}: separador de millares: ${t}`);
  if (idioma === 'en') assert.ok(!/\d,\d/.test(t), `${donde}: coma decimal en inglés: ${t}`);
  else assert.ok(!/\d\.\d/.test(t), `${donde}: punto decimal en español: ${t}`);
  assert.ok(!t.includes('÷'), `${donde}: «÷»`);
}

test('ningún texto de alumno con ×, porcentajes, millares, letras ni coma en inglés o punto en español', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 53).slice(0, 1200)) {
      const p = L.PLANTILLA_POR_ID[item.plantilla];
      for (const idioma of ['es', 'en']) {
        for (const l of item.lineas) reglasDeTexto(L.textoLinea(l, idioma), idioma, `${p.id} línea`);
        reglasDeTexto(p.porque(item.params, idioma), idioma, `${p.id} porque`);
        if (item.falsa !== null) for (const l of p.cadena(item.params, false).lineas) reglasDeTexto(L.textoLinea(l, idioma), idioma, `${p.id} buena`);
      }
    }
  }
  for (const idioma of ['es', 'en']) {
    const textos = [];
    const recoger = o => { for (const v of Object.values(o)) { if (typeof v === 'string') textos.push(v); else if (v && typeof v === 'object' && !(idioma in v)) recoger(v); else if (v && typeof v[idioma] === 'string') textos.push(v[idioma]); } };
    recoger(TX);
    for (const t of textos) reglasDeTexto(t, idioma, 'TX');
    for (const e of Object.values(ERRORES_TIPICOS)) reglasDeTexto(e.nombre[idioma], idioma, 'nombre de error');
  }
});

test('los números son de hasta cuatro cifras enteras y el resto, sin contextos que acotar', () => {
  for (const fn of [L.generarDonde, L.generarQue, L.generarCorrige]) {
    for (const item of generar(fn, 61)) {
      for (const l of item.lineas) for (const s of l) {
        if (s && s.d !== undefined) assert.ok(Math.abs(D(s.d).valor()) < 10000, `${item.plantilla}: ${s.d}`);
      }
      for (const x of item.params) if (typeof x === 'string' && /,/.test(x)) assert.ok(Math.abs(D(x).valor()) < 10000);
    }
  }
  assert.ok(MENOS === '−');
});
