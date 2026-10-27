// Práctica «Simplifica» (reparto-practicas-u2, tarea 101): la lógica se prueba por fuerza
// bruta (3000 ítems por ejercicio, semillas fijas) con un m.c.d. escrito aquí, no el de la base.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { fraccion } from '../practicas/_comun/fracciones.js';
import {
  BOTONES, generarPasos, fraccionDe, menorDivisorComun, evaluarPaso, avisoNoDivide, evaluarIrreducible, avisoTodavia, explicarPasos,
  generarIrreducibles, esIrreduciblePar, irreduciblesDe, errorIrreducibles, explicarIrreducibles,
  generarDeUnaVez, irreducibleDe, evaluarDeUnaVez, respuestaDeUnaVez, explicarDeUnaVez,
} from '../practicas/simplifica/logica.js';
import { TX } from '../practicas/simplifica/textos.js';

const N = 3000;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const generarN = (fn, semilla = 1, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => fn(rng)); };
const sinEtiquetas = s => s.replace(/<[^>]*>/g, ' ');

/** Todos los textos que ve el alumno, en los dos idiomas, para pasar la lista de prohibidos. */
function textosDe(items, ejercicio) {
  const textos = [];
  for (const item of items) {
    for (const idioma of ['es', 'en']) {
      if (ejercicio === 1) {
        let f = fraccionDe(item);
        const cadena = [f];
        for (const k of BOTONES) {
          textos.push(avisoNoDivide(f, k, idioma));
        }
        while (menorDivisorComun(f)) { textos.push(avisoTodavia(f, idioma)); f = f.simplificarPor(menorDivisorComun(f)); cadena.push(f); }
        textos.push(explicarPasos(cadena, idioma));
      } else if (ejercicio === 2) {
        textos.push(explicarIrreducibles(item, irreduciblesDe(item), idioma), explicarIrreducibles(item, [], idioma), explicarIrreducibles(item, [0, 1, 2, 3], idioma));
      } else {
        const buena = irreducibleDe(item);
        const respuestas = [
          { mcd: item.mcd, num: Math.abs(buena.num), den: buena.den, negativo: buena.num < 0 },
          { mcd: item.mcd + 1, num: Math.abs(buena.num), den: buena.den, negativo: buena.num < 0 },
          { mcd: item.mcd, num: Math.abs(item.num), den: item.den, negativo: item.num < 0 },
          { mcd: item.mcd, num: Math.abs(buena.num), den: buena.den, negativo: buena.num >= 0 },
          { mcd: item.mcd, num: Math.abs(buena.num) + 1, den: buena.den, negativo: false },
        ];
        for (const r of respuestas) textos.push(explicarDeUnaVez(item, evaluarDeUnaVez(item, r).error, r, idioma));
      }
    }
  }
  return textos;
}

// --- Ejercicio 1: paso a paso ----------------------------------------------------

test('paso a paso: términos de 1 a 100, m.c.d. > 1 y solo con primos de los botones', () => {
  for (const item of generarN(generarPasos)) {
    const n = Math.abs(item.num);
    assert.ok(n >= 1 && n <= 100 && item.den >= 2 && item.den <= 100, `${item.num}/${item.den}`);
    const g = gcd(n, item.den);
    assert.ok(g > 1, `${item.num}/${item.den}: m.c.d. ${g}`);
    let resto = g;
    for (const p of BOTONES) while (resto % p === 0) resto /= p;
    assert.equal(resto, 1, `${item.num}/${item.den}: m.c.d. ${g} necesita otros primos`);
    assert.ok(n < item.den, 'propia');
  }
});

test('paso a paso: cualquier secuencia de divisiones válidas llega a la irreducible', () => {
  const rng = crearRng(7);
  for (const item of generarN(generarPasos, 2)) {
    let f = fraccionDe(item);
    const buena = fraccion(item.num, item.den).simplificar();
    let pasos = 0;
    while (menorDivisorComun(f) !== null) {
      const posibles = BOTONES.filter(k => f.num % k === 0 && f.den % k === 0);
      const k = rng.elegir(posibles);
      const p = evaluarPaso(f, k);
      assert.equal(p.resultado, 'correcto');
      f = p.fraccion;
      assert.equal(f.equals(item), true);
      assert.ok(++pasos < 12);
    }
    assert.equal(gcd(f.num, f.den), 1);
    assert.deepEqual([f.num, f.den], [buena.num, buena.den]);
  }
});

test('paso a paso: «Es irreducible» solo es correcto cuando lo es; si no, dice entre qué se puede dividir', () => {
  for (const item of generarN(generarPasos, 3)) {
    const f = fraccionDe(item);
    const r = evaluarIrreducible(f);
    assert.equal(r.correcto, gcd(f.num, f.den) === 1);
    assert.equal(r.correcto, false, 'una fracción recién generada siempre se puede simplificar');
    assert.ok(f.num % r.k === 0 && f.den % r.k === 0);
    assert.equal(r.error, 'simplifica-a-medias');
    assert.equal(evaluarIrreducible(f.simplificar()).correcto, true);
  }
});

test('paso a paso: dividir entre algo que no divide a los dos es un fallo con su error y el signo se conserva', () => {
  for (const item of generarN(generarPasos, 4)) {
    const f = fraccionDe(item);
    for (const k of BOTONES) {
      const p = evaluarPaso(f, k);
      const dn = f.num % k === 0, dd = f.den % k === 0;
      if (dn && dd) {
        assert.equal(p.resultado, 'correcto');
        assert.equal(Math.sign(p.fraccion.num), Math.sign(f.num), 'el signo se conserva');
        assert.equal(p.fraccion.num * k, f.num);
        assert.equal(p.fraccion.den * k, f.den);
      } else {
        assert.equal(p.fraccion, undefined);
        assert.equal(p.error, dn ? 'simplifica-solo-numerador' : dd ? 'simplifica-solo-denominador' : 'no-divide-a-los-dos');
      }
    }
  }
});

test('paso a paso: al menos el 20 % de los ítems son negativos y otro tanto tiene un solo paso', () => {
  const items = generarN(generarPasos, 5);
  assert.ok(items.filter(i => i.num < 0).length >= N * 0.2);
  assert.ok(items.filter(i => i.num > 0).length >= N * 0.5);
  assert.ok(items.filter(i => gcd(i.num, i.den) < 4).length >= N * 0.1, 'hay ítems de un paso');
  assert.ok(items.filter(i => gcd(i.num, i.den) >= 6).length >= N * 0.3, 'hay ítems de varios pasos');
});

// --- Ejercicio 2: ¿irreducible? ---------------------------------------------------

test('¿irreducible?: cuatro fracciones, al menos una irreducible y una reducible, ninguna repetida ni equivalente', () => {
  for (const item of generarN(generarIrreducibles)) {
    assert.equal(item.fracs.length, 4);
    const buenas = item.fracs.filter(f => gcd(f.num, f.den) === 1).length;
    assert.ok(buenas >= 1 && buenas <= 3, `${buenas} irreducibles`);
    for (const f of item.fracs) {
      assert.ok(f.den >= 2 && f.den <= 99 && Math.abs(f.num) >= 2 && Math.abs(f.num) < f.den, `${f.num}/${f.den}`);
      assert.equal(esIrreduciblePar(f), gcd(f.num, f.den) === 1);
    }
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = item.fracs[i], b = item.fracs[j];
      assert.notEqual(Math.abs(a.num) * b.den, Math.abs(b.num) * a.den, `${a.num}/${a.den} y ${b.num}/${b.den} valen lo mismo`);
    }
  }
});

test('¿irreducible?: hay engañosas (reducible con los dos términos impares) y «feas» (irreducible con los dos compuestos)', () => {
  const compuesto = n => n > 3 && Array.from({ length: n }, (_, i) => i).slice(2).some(d => d < n && n % d === 0);
  for (const item of generarN(generarIrreducibles, 2)) {
    assert.ok(item.fracs.some(f => gcd(f.num, f.den) > 1 && Math.abs(f.num) % 2 === 1 && f.den % 2 === 1), 'reducible con términos impares');
    assert.ok(item.fracs.some(f => gcd(f.num, f.den) === 1 && compuesto(Math.abs(f.num)) && compuesto(f.den)), 'irreducible con términos compuestos');
  }
});

test('¿irreducible?: la respuesta buena no da error; marcar de más o de menos sí, con su nombre', () => {
  const items = generarN(generarIrreducibles, 3);
  assert.ok(items.filter(i => i.fracs.some(f => f.num < 0)).length >= N * 0.3, 'negativas');
  assert.ok(items.filter(i => i.fracs.every(f => f.num > 0)).length >= N * 0.3, 'positivas');
  let impares = 0;
  for (const item of items) {
    const buenas = irreduciblesDe(item);
    assert.equal(errorIrreducibles(item, buenas), null);
    assert.equal(errorIrreducibles(item, [...buenas].reverse()), null);
    const sobra = [0, 1, 2, 3].find(i => !buenas.includes(i));
    const e = errorIrreducibles(item, [...buenas, sobra]);
    assert.ok(e === 'cree-irreducible' || e === 'cree-irreducible-si-impares', e);
    if (e === 'cree-irreducible-si-impares') {
      impares++;
      assert.ok(Math.abs(item.fracs[sobra].num) % 2 === 1 && item.fracs[sobra].den % 2 === 1);
    }
    assert.equal(errorIrreducibles(item, buenas.slice(1)), 'cree-reducible');
    assert.equal(errorIrreducibles(item, []), 'cree-reducible');
  }
  assert.ok(impares > 0);
});

// --- Ejercicio 3: de una vez ------------------------------------------------------

test('de una vez: el m.c.d. y la irreducible coinciden con una cuenta independiente; un tercio con m.c.d. 1', () => {
  const items = generarN(generarDeUnaVez);
  for (const item of items) {
    const n = Math.abs(item.num);
    assert.ok(n >= 2 && n <= 100 && item.den >= 3 && item.den <= 100 && n < item.den, `${item.num}/${item.den}`);
    assert.equal(gcd(n, item.den), item.mcd);
    const buena = irreducibleDe(item);
    assert.equal(buena.num * item.mcd, item.num);
    assert.equal(buena.den * item.mcd, item.den);
    assert.equal(gcd(buena.num, buena.den), 1);
    assert.equal(Math.sign(buena.num), Math.sign(item.num));
  }
  const unos = items.filter(i => i.mcd === 1).length;
  assert.ok(unos > N * 0.28 && unos < N * 0.39, `${unos} con m.c.d. 1`);
  assert.ok(items.filter(i => i.num < 0).length >= N * 0.2, 'negativas');
});

test('de una vez: la respuesta buena acierta; los errores típicos se nombran y se explican con los números', () => {
  const nombres = new Set();
  for (const item of generarN(generarDeUnaVez, 2)) {
    const b = irreducibleDe(item);
    const buena = { mcd: item.mcd, num: Math.abs(b.num), den: b.den, negativo: b.num < 0 };
    const ok = evaluarDeUnaVez(item, buena);
    assert.deepEqual([ok.acierto, ok.error, ok.mcdOk, ok.fraccionOk], [true, null, true, true]);
    // m.c.d. mal
    const m = evaluarDeUnaVez(item, { ...buena, mcd: item.mcd + 1 });
    assert.equal(m.acierto, false);
    assert.equal(m.mcdOk, false);
    assert.equal(m.error, 'mcd-mal');
    // signo
    if (b.num < 0) assert.equal(evaluarDeUnaVez(item, { ...buena, negativo: false }).error, 'signo-perdido-al-simplificar');
    else assert.equal(evaluarDeUnaVez(item, { ...buena, negativo: true }).error, 'signo-cambiado');
    // la fracción sin simplificar (solo si de verdad se podía)
    if (item.mcd > 1) {
      const sin = evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(item.num), den: item.den, negativo: item.num < 0 });
      assert.equal(sin.error, 'simplifica-a-medias');
      for (const k of [2, 3, 5, 7]) {
        if (item.mcd % k === 0 && k < item.mcd) {
          const medias = fraccion(item.num, item.den).simplificarPor(k);
          const r = evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(medias.num), den: medias.den, negativo: medias.num < 0 });
          assert.equal(r.error, 'simplifica-a-medias');
          const solo = evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(item.num) / k, den: item.den, negativo: item.num < 0 });
          assert.equal(solo.error, 'simplifica-solo-numerador');
          const soloD = evaluarDeUnaVez(item, { mcd: item.mcd, num: Math.abs(item.num), den: item.den / k, negativo: item.num < 0 });
          assert.equal(soloD.error, 'simplifica-solo-denominador');
          const divComun = evaluarDeUnaVez(item, { ...buena, mcd: k });
          assert.equal(divComun.error, 'mcd-no-es-el-mayor');
        }
      }
    }
    nombres.add(m.error);
    assert.equal(respuestaDeUnaVez(buena).includes('undefined'), false);
  }
  assert.ok(nombres.has('mcd-mal'));
});

test('de una vez: un denominador 0 o vacío no se corrige como acierto', () => {
  const item = { num: 36, den: 48, mcd: 12 };
  assert.equal(evaluarDeUnaVez(item, { mcd: 12, num: 3, den: 0, negativo: false }).acierto, false);
  assert.equal(evaluarDeUnaVez(item, { mcd: 12, num: 6, den: 8, negativo: false }).error, 'simplifica-a-medias');
});

// --- Textos ------------------------------------------------------------------------

test('textos: nada de ×, de variables, de decimales ni de «/» como fracción; el feedback lleva los números del ítem', () => {
  const grupos = [
    [generarN(generarPasos, 9, 600), 1],
    [generarN(generarIrreducibles, 9, 600), 2],
    [generarN(generarDeUnaVez, 9, 600), 3],
  ];
  for (const [items, ej] of grupos) {
    for (const t of textosDe(items, ej)) {
      const plano = sinEtiquetas(t);
      assert.ok(!plano.includes('×'), plano);
      assert.ok(!/\d\s*\/\s*\d/.test(plano), `barra de fracción: ${plano}`);
      assert.ok(!/\d[.,]\d/.test(plano), `decimal: ${plano}`);
      assert.ok(!/(^|[^A-Za-zÁ-úñ])[xznk]([^A-Za-zÁ-úñ]|$)/.test(plano), `letra suelta: ${plano}`);
      assert.ok(!/\bfactor/i.test(plano), `«factor» entre números: ${plano}`);
      assert.ok(!/undefined|NaN|null/.test(plano), plano);
    }
  }
  // Con los números del ítem
  const item = { num: -36, den: 48, mcd: 12 };
  const r = { mcd: 6, num: 3, den: 4, negativo: true };
  const f = sinEtiquetas(explicarDeUnaVez(item, evaluarDeUnaVez(item, r).error, r, 'es')).replace(/\s+/g, ' ');
  assert.match(f, /6/);
  assert.match(f, /12/);
  assert.match(f, /36/);
  assert.match(f, /48/);
});

test('textos: todo texto propio existe en español y en inglés', () => {
  const revisa = (obj, ruta) => {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object' && !('es' in v && 'en' in v)) revisa(v, `${ruta}.${k}`);
      else if (v && typeof v === 'object') {
        assert.equal(typeof v.es, typeof v.en, `${ruta}.${k}`);
        assert.ok(v.es && v.en, `${ruta}.${k}`);
      }
    }
  };
  revisa(TX, 'TX');
});
