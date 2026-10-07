// m.c.d. y m.c.m. con factores primos (practicas/venn/): generadores,
// comprobaciones y diagnósticos, contra definiciones independientes por fuerza
// bruta (ni aritmetica.js ni logica.js se prueban contra sí mismas).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  NUMEROS, EXPONENTE_MAXIMO, generar, generarVenn, generarMcd, generarMcm, generarMezcla, clave,
  repartir, fichasDe, primosDe, factDe, exponente,
  esCorrectaVenn, diagnosticarVenn, explicarVenn, resumenVenn,
  diagnosticar, violaDesigualdad, explicar, solucionHtml, comprobaciones,
} from '../practicas/venn/logica.js';
import { TX, NOMBRE } from '../practicas/venn/textos.js';

const N = 3000;
const TIPOS = ['venn', 'mcd', 'mcm', 'mezcla'];
const IDIOMAS = ['es', 'en'];

// --- Definiciones independientes, por fuerza bruta ------------------------------

/** El mayor d que divide a los dos. */
const mcdBruto = (a, b) => {
  for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d;
};
/** El menor múltiplo común (positivo). */
const mcmBruto = (a, b) => {
  for (let m = Math.max(a, b); ; m += Math.max(a, b)) if (m % a === 0 && m % b === 0) return m;
};
const esPrimoBruto = n => {
  if (n < 2) return false;
  for (let d = 2; d < n; d++) if (n % d === 0) return false;
  return true;
};
const valor = f => f.reduce((v, [p, e]) => v * p ** e, 1);
const producto = lista => lista.reduce((v, p) => v * p, 1);
const primosDistintos = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0 && esPrimoBruto(d));
const ordenada = lista => [...lista].sort((x, y) => x - y);

const items = (tipo, cuantos = N, semilla = 2026) => {
  const rng = crearRng(semilla);
  return Array.from({ length: cuantos }, () => generar(tipo, rng));
};

/** Todas las respuestas que caben en los contadores (exponentes de 0 a `tope`). */
function* respuestas(item, tope) {
  const primos = primosDe(item);
  const total = (tope + 1) ** primos.length;
  for (let k = 0; k < total; k++) {
    let resto = k;
    yield primos.map(p => { const e = resto % (tope + 1); resto = Math.floor(resto / (tope + 1)); return [p, e]; });
  }
}

// --- Los números y los ítems ----------------------------------------------------

test('venn: los números tienen dos o tres primos distintos, todos hasta el 13, y están el 242, 286, 338 y 363', () => {
  for (const n of NUMEROS) {
    assert.ok(n >= 12 && n <= 400, `${n} fuera de rango`);
    const primos = primosDistintos(n);
    assert.ok(primos.length === 2 || primos.length === 3, `${n} tiene ${primos.length} primos`);
    assert.ok(primos.every(p => p <= 13), `${n} tiene un primo mayor que 13`);
  }
  for (const n of [242, 286, 338, 363]) assert.ok(NUMEROS.includes(n), `falta el ${n}`);
});

for (const tipo of TIPOS) {
  test(`venn (${tipo}): 3000 ítems bien formados, con el m.c.d. y el m.c.m. de verdad`, () => {
    for (const it of items(tipo)) {
      assert.equal(it.tipo, tipo);
      assert.ok(NUMEROS.includes(it.a) && NUMEROS.includes(it.b));
      assert.notEqual(it.a, it.b);
      assert.equal(valor(it.fa), it.a);
      assert.equal(valor(it.fb), it.b);
      for (const f of [it.fa, it.fb, it.comunes, it.soloA, it.soloB, it.solucion]) {
        assert.ok(f.every(([p, e]) => esPrimoBruto(p) && e >= 1), 'solo primos, con exponente ≥ 1');
        assert.deepEqual(f.map(([p]) => p), ordenada(f.map(([p]) => p)), 'bases de menor a mayor');
      }
      const g = mcdBruto(it.a, it.b), m = mcmBruto(it.a, it.b);
      assert.equal(valor(it.comunes), g, `m.c.d.(${it.a}, ${it.b})`);
      assert.equal(valor(it.solucion), it.pide === 'mcd' ? g : m, `${it.pide}(${it.a}, ${it.b})`);
      // Los contadores llegan a la respuesta, y les sobra para equivocarse por arriba.
      for (const [, e] of [...it.fa, ...it.fb]) assert.ok(e <= 4 && e < EXPONENTE_MAXIMO);
      assert.ok(primosDe(it).length <= 4, 'como mucho cuatro columnas');
      assert.equal(typeof clave(it), 'string');
    }
  });
}

test('venn: cada generador pide lo suyo, y la mezcla reparte m.c.d. y m.c.m.', () => {
  const rng = crearRng(7);
  for (let i = 0; i < 200; i++) {
    assert.equal(generarVenn(rng).pide, 'mcd');
    assert.equal(generarMcd(rng).pide, 'mcd');
    assert.equal(generarMcm(rng).pide, 'mcm');
  }
  const mezcla = Array.from({ length: N }, () => generarMezcla(rng));
  const deMcd = mezcla.filter(it => it.pide === 'mcd').length / N;
  assert.ok(deMcd > 0.42 && deMcd < 0.58, `m.c.d. en la mezcla: ${deMcd}`);
});

test('venn: repartir reconstruye a y b (comunes + soloA = fa, comunes + soloB = fb)', () => {
  for (const tipo of TIPOS) {
    for (const it of items(tipo, 1000, 11)) {
      const r = repartir(it.fa, it.fb);
      assert.deepEqual(r, { comunes: it.comunes, soloA: it.soloA, soloB: it.soloB });
      assert.deepEqual(ordenada([...fichasDe(r.comunes), ...fichasDe(r.soloA)]), fichasDe(it.fa));
      assert.deepEqual(ordenada([...fichasDe(r.comunes), ...fichasDe(r.soloB)]), fichasDe(it.fb));
      assert.equal(valor(r.comunes) * valor(r.soloA), it.a);
      assert.equal(valor(r.comunes) * valor(r.soloB), it.b);
      // Lo que queda a cada lado ya no tiene nada en común.
      assert.equal(mcdBruto(valor(r.soloA), valor(r.soloB)), 1);
    }
  }
});

test('venn: cuotas de ítems sin primos comunes, con uno divisor del otro y con 11 o 13', () => {
  for (const tipo of TIPOS) {
    const lista = items(tipo);
    const parte = cond => lista.filter(cond).length / lista.length;
    const sin = parte(it => mcdBruto(it.a, it.b) === 1);
    const divisor = parte(it => it.a % it.b === 0 || it.b % it.a === 0);
    const grandes = parte(it => (it.a * it.b) % 11 === 0 || (it.a * it.b) % 13 === 0);
    assert.ok(sin > 0.12 && sin < 0.18, `${tipo}: sin comunes ${sin}`);
    assert.ok(divisor > 0.12 && divisor < 0.18, `${tipo}: uno divisor del otro ${divisor}`);
    assert.ok(grandes > 0.2 && grandes < 0.3, `${tipo}: con 11 o 13 ${grandes}`);
    // En los dos sentidos: unas veces a es el divisor y otras lo es b.
    assert.ok(lista.some(it => it.b % it.a === 0) && lista.some(it => it.a % it.b === 0));
    assert.ok(lista.some(it => it.a < it.b) && lista.some(it => it.a > it.b));
  }
});

// --- Ejercicio 1: el Venn -------------------------------------------------------

test('venn (ej. 1): caben en 375 px (de 2 a 4 fichas por número)', () => {
  for (const it of items('venn')) {
    for (const f of [it.fa, it.fb]) {
      const n = fichasDe(f).length;
      assert.ok(n >= 2 && n <= 4, `${valor(f)} tiene ${n} fichas`);
    }
  }
});

/** Todos los repartos posibles de las fichas: cada una, a su lado o a «común». */
function* repartos(item) {
  const fa = fichasDe(item.fa), fb = fichasDe(item.fb);
  for (let ma = 0; ma < 2 ** fa.length; ma++) {
    for (let mb = 0; mb < 2 ** fb.length; mb++) {
      yield {
        soloA: fa.filter((_, i) => !(ma >> i & 1)), comunA: fa.filter((_, i) => ma >> i & 1),
        soloB: fb.filter((_, i) => !(mb >> i & 1)), comunB: fb.filter((_, i) => mb >> i & 1),
      };
    }
  }
}

test('venn (ej. 1): de todos los repartos posibles, vale justo el que deja en «común» el m.c.d. emparejado', () => {
  for (const it of items('venn', 400, 5)) {
    const g = mcdBruto(it.a, it.b);
    let buenos = 0;
    for (const z of repartos(it)) {
      // Verdad independiente: las fichas de a y las de b del centro son las mismas y multiplican el m.c.d.
      const verdad = ordenada(z.comunA).join() === ordenada(z.comunB).join() && producto(z.comunA) === g;
      assert.equal(esCorrectaVenn(it, z), verdad, `${it.a}, ${it.b}: ${JSON.stringify(z)}`);
      assert.equal(diagnosticarVenn(it, z) === null, verdad, `diagnóstico de ${it.a}, ${it.b}: ${JSON.stringify(z)}`);
      if (verdad) buenos++;
    }
    assert.ok(buenos >= 1);
  }
});

test('venn (ej. 1): con fichas sin repartir no está bien, aunque «común» esté perfecto', () => {
  for (const it of items('venn', 300, 9)) {
    const comunes = fichasDe(it.comunes);
    const z = { soloA: fichasDe(it.soloA), comunA: comunes, soloB: fichasDe(it.soloB), comunB: comunes };
    assert.equal(esCorrectaVenn(it, z), true);
    if (z.soloA.length) assert.equal(esCorrectaVenn(it, { ...z, soloA: z.soloA.slice(1) }), false);
    if (z.soloB.length) assert.equal(esCorrectaVenn(it, { ...z, soloB: z.soloB.slice(1) }), false);
    assert.equal(esCorrectaVenn(it, { soloA: [], comunA: [], soloB: [], comunB: [] }), false);
  }
});

test('venn (ej. 1): lo que dice cada diagnóstico es verdad', () => {
  const vistos = new Set();
  const veces = (lista, p) => lista.filter(q => q === p).length;
  for (const it of items('venn', 300, 3)) {
    for (const z of repartos(it)) {
      const d = diagnosticarVenn(it, z);
      if (!d) continue;
      vistos.add(d.codigo);
      const enA = it.a % d.p === 0, enB = it.b % d.p === 0;
      const ca = veces(z.comunA, d.p), cb = veces(z.comunB, d.p);
      const posibles = veces(fichasDe(it.comunes), d.p);
      if (d.codigo === 'no_comun') {
        assert.ok(enA !== enB, `${d.p} tendría que estar solo en uno de ${it.a} y ${it.b}`);
        assert.ok(ca + cb > 0);
      } else if (d.codigo === 'sobra') {
        assert.ok(enA && enB && Math.max(ca, cb) > posibles);
      } else {
        assert.equal(d.codigo, 'falta');
        assert.ok(enA && enB && Math.min(ca, cb) < posibles);
      }
      for (const idioma of IDIOMAS) {
        const html = explicarVenn(it, z, idioma);
        assert.ok(html.includes(`${d.p}`) && html.length > 20);
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['falta', 'no_comun', 'sobra']);
});

test('venn (ej. 1): el resumen da el m.c.d. y el m.c.m. de verdad', () => {
  for (const it of items('venn', 1000, 21)) {
    const g = mcdBruto(it.a, it.b), m = mcmBruto(it.a, it.b);
    for (const idioma of IDIOMAS) {
      const html = resumenVenn(it, idioma);
      assert.ok(html.includes(`= ${m}</span>`), `m.c.m. de ${it.a} y ${it.b}: ${html}`);
      if (g > 1) assert.ok(html.includes(`= ${g}</span>`), `m.c.d. de ${it.a} y ${it.b}: ${html}`);
      else assert.ok(/el m\.c\.d\. es 1|the GCD is 1/.test(html), html);
    }
  }
});

// --- Ejercicios 2, 3 y 4: las dos reglas ----------------------------------------

test('venn (ej. 2-4): factDe y exponente', () => {
  const it = items('mcd', 1, 1)[0];
  const primos = primosDe(it);
  assert.deepEqual(primos, ordenada(primosDistintos(it.a * it.b)));
  assert.deepEqual(factDe(it, primos.map(() => 0)), []);
  assert.deepEqual(factDe(it, primos.map((_, i) => (i === 0 ? 2 : 0))), [[primos[0], 2]]);
  assert.equal(exponente([[2, 3], [5, 1]], 2), 3);
  assert.equal(exponente([[2, 3], [5, 1]], 3), 0);
});

test('venn (ej. 2-4): la respuesta buena es la única que se da por buena', () => {
  for (const tipo of ['mcd', 'mcm', 'mezcla']) {
    for (const it of items(tipo, 400, 13)) {
      const buena = it.pide === 'mcd' ? mcdBruto(it.a, it.b) : mcmBruto(it.a, it.b);
      assert.equal(diagnosticar(it, it.solucion), null);
      assert.equal(diagnosticar(it, 0), 'cero');
      for (const r of respuestas(it, 3)) {
        assert.equal(diagnosticar(it, r) === null, valor(r) === buena, `${tipo} ${it.pide}(${it.a}, ${it.b}) con ${JSON.stringify(r)}`);
      }
    }
  }
});

test('venn (ej. 2-4): «es_el_otro» exactamente cuando la respuesta es la otra cantidad, y «cero» cuando es 0', () => {
  for (const tipo of ['mcd', 'mcm', 'mezcla']) {
    let vistos = 0;
    for (const it of items(tipo, 400, 17)) {
      const otra = it.pide === 'mcd' ? mcmBruto(it.a, it.b) : mcdBruto(it.a, it.b);
      for (const r of respuestas(it, 3)) {
        const codigo = diagnosticar(it, r);
        assert.equal(codigo === 'es_el_otro', valor(r) === otra, `${tipo} ${it.pide}(${it.a}, ${it.b}) con ${JSON.stringify(r)}`);
        assert.notEqual(codigo, 'cero');
        if (codigo === 'es_el_otro') vistos++;
      }
    }
    assert.ok(vistos > 100);
  }
});

test('venn (ej. 2-4): lo que dice cada diagnóstico es verdad', () => {
  const vistos = { mcd: new Set(), mcm: new Set(), mezcla: new Set() };
  for (const tipo of ['mcd', 'mcm', 'mezcla']) {
    for (const it of items(tipo, 150, 19)) {
      const g = mcdBruto(it.a, it.b), m = mcmBruto(it.a, it.b);
      const menor = Math.min(it.a, it.b), mayor = Math.max(it.a, it.b);
      const primosG = primosDistintos(g), primosM = primosDistintos(m);
      for (const r of respuestas(it, 4)) {
        const codigo = diagnosticar(it, r);
        if (codigo === null) continue;
        vistos[tipo].add(codigo);
        const v = valor(r);
        const caso = `${tipo} ${it.pide}(${it.a}, ${it.b}) con ${v}: ${codigo}`;
        const comunDivisor = it.a % v === 0 && it.b % v === 0;
        const comunMultiplo = v % it.a === 0 && v % it.b === 0;
        const rompe = it.pide === 'mcd' ? v > menor : v < mayor;
        assert.equal(violaDesigualdad(it, r), rompe, caso);
        // En la mezcla la desigualdad va antes que cualquier regla; fuera de ella no se usa.
        if (codigo === 'desigualdad') { assert.equal(tipo, 'mezcla', caso); assert.ok(rompe, caso); continue; }
        if (tipo === 'mezcla' && codigo !== 'es_el_otro') assert.ok(!rompe, caso);
        if (codigo === 'es_el_otro') continue;
        assert.notEqual(codigo, 'otro', caso);
        if (it.pide === 'mcd') {
          assert.ok(['no_comun', 'exponente_mayor', 'falta_comun', 'se_queda_corto'].includes(codigo), caso);
          // Los tres primeros no son divisores comunes o se dejan un primo común; el último lo es, pero no el mayor.
          if (codigo === 'no_comun' || codigo === 'exponente_mayor') assert.ok(!comunDivisor, caso);
          if (codigo === 'falta_comun') assert.ok(comunDivisor && primosG.some(p => v % p !== 0), caso);
          if (codigo === 'se_queda_corto') assert.ok(comunDivisor && v < g && primosG.every(p => v % p === 0), caso);
        } else {
          assert.ok(['faltan_no_comunes', 'falta_comun', 'exponente_menor', 'se_pasa'].includes(codigo), caso);
          if (codigo !== 'se_pasa') assert.ok(!comunMultiplo, caso);
          if (codigo === 'faltan_no_comunes') assert.ok(primosM.some(p => g % p !== 0 && v % p !== 0), caso);
          if (codigo === 'se_pasa') assert.ok(comunMultiplo && v > m, caso);
        }
      }
    }
  }
  assert.deepEqual([...vistos.mcd].sort(), ['es_el_otro', 'exponente_mayor', 'falta_comun', 'no_comun', 'se_queda_corto']);
  assert.deepEqual([...vistos.mcm].sort(), ['es_el_otro', 'exponente_menor', 'falta_comun', 'faltan_no_comunes', 'se_pasa']);
  assert.ok(vistos.mezcla.has('desigualdad') && vistos.mezcla.has('es_el_otro'));
});

test('venn (ej. 2-4): el feedback nombra el primo que falla y sus números, en los dos idiomas', () => {
  const malo = /undefined|NaN|null|\[object|×|HCF|GCF|primos entre sí|coprime/;
  for (const tipo of ['mcd', 'mcm', 'mezcla']) {
    for (const it of items(tipo, 150, 23)) {
      for (const idioma of IDIOMAS) {
        assert.equal(explicar(it, it.solucion, idioma), '');
        for (const r of [0, ...respuestas(it, 3)]) {
          const codigo = diagnosticar(it, r);
          if (codigo === null) continue;
          const html = explicar(it, r, idioma);
          assert.ok(html.length > 30, `${codigo}: «${html}»`);
          assert.ok(!malo.test(html), `${codigo}: «${html}»`);
          if (codigo === 'desigualdad') {
            const v = valor(r);
            assert.ok(html.startsWith(TX.reglas.desigualdad[it.pide][idioma](v, it.pide === 'mcd' ? Math.min(it.a, it.b) : Math.max(it.a, it.b))), html);
          }
        }
      }
    }
  }
});

test('venn (ej. 2-4): la solución y las comprobaciones llevan los números de verdad', () => {
  const malo = /undefined|NaN|null|\[object|×|HCF|GCF/;
  for (const tipo of ['mcd', 'mcm', 'mezcla']) {
    for (const it of items(tipo, 1000, 29)) {
      const g = mcdBruto(it.a, it.b), m = mcmBruto(it.a, it.b);
      const v = it.pide === 'mcd' ? g : m;
      for (const idioma of IDIOMAS) {
        const sol = solucionHtml(it, idioma);
        assert.ok(!malo.test(sol), sol);
        if (it.pide === 'mcd' && g === 1) assert.ok(/el m\.c\.d\. es 1|the GCD is 1/.test(sol), sol);
        else assert.ok(sol.includes(`${v}</span>`) && sol.includes(NOMBRE[it.pide][idioma]), sol);
        const comp = comprobaciones(it, idioma);
        assert.ok(!malo.test(comp), comp);
        const signo = idioma === 'es' ? ':' : '÷';
        if (it.pide === 'mcd') {
          assert.ok(comp.includes(`${g} ≤ ${Math.min(it.a, it.b)}`), comp);
          assert.ok(comp.includes(`${it.a} ${signo} ${g} = ${it.a / g}<`) && comp.includes(`${it.b} ${signo} ${g} = ${it.b / g}<`), comp);
        } else {
          assert.ok(comp.includes(`${m} ≥ ${Math.max(it.a, it.b)}`), comp);
          assert.ok(comp.includes(`${m} ${signo} ${it.a} = ${m / it.a}<`) && comp.includes(`${m} ${signo} ${it.b} = ${m / it.b}<`), comp);
        }
      }
    }
  }
});

test('venn: textos en los dos idiomas, sin «×», sin HCF y sin «primos entre sí»', () => {
  const recorrer = (obj, ruta) => {
    if (obj && typeof obj === 'object' && 'es' in obj && 'en' in obj) {
      for (const idioma of IDIOMAS) {
        const v = obj[idioma];
        assert.ok(typeof v === 'string' || typeof v === 'function', `${ruta}.${idioma}`);
        if (typeof v === 'string') assert.ok(!/×|HCF|GCF|primos entre sí|coprime/.test(v), `${ruta}.${idioma}: ${v}`);
      }
      assert.equal(typeof obj.es, typeof obj.en, ruta);
      return;
    }
    assert.ok(obj && typeof obj === 'object', `${ruta} no es { es, en }`);
    for (const [k, v] of Object.entries(obj)) recorrer(v, `${ruta}.${k}`);
  };
  recorrer(TX, 'TX');
  recorrer(NOMBRE, 'NOMBRE');
  assert.equal(TX.ejercicios.length, 4);
});
