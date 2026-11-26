// Práctica «Léelo en inglés» de la unidad 7: 3000 ítems por ejercicio y por fecha, con semillas fijas. Cuatro
// opciones, una buena; ningún texto repetido; cada falsa con un error definido y su «por qué» en los dos idiomas;
// nunca se enfrentan dos formas válidas; el filtro por fecha (paquetes 1-4); ni ×, ni «20 %» con espacio en inglés,
// ni cinco cifras sin espacio fino; y en «Léelo» un lector de inglés escrito AQUÍ, aparte del generador, confirma
// qué dice cada opción. Los casos reservados existen y los consultan todos los generadores.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  VOCABULARIO, CONSIGNAS, COMPLETAS, OBJETOS, SINONIMOS, ERRORES_LEELO, PAQUETES_DESDE, DESDE_PAQUETE_3B, paqueteHoy,
  generarPalabra, generarLeelo, generarConsigna, generarCompleta, ESTA_DEFINIDO, esReservado, RESERVADOS_HOJA, HUELLAS_EXAMEN,
  claveItem, nombreDe,
} from '../practicas/leelo7/logica.js';
import { TX } from '../practicas/leelo7/textos.js';

const N = 3000;
const DESP = Number(process.env.SEMILLA_LEELO7 ?? 0);
// Una fecha de cada tramo: antes del 1-3 (hoy), paquete 1, 2, 3 (marzo), 3 (abril), 4.
const FECHAS = ['2026-11-19', '2027-03-02', '2027-03-09', '2027-03-16', '2027-04-06', '2027-04-13'];
const GEN = [['palabra', generarPalabra, 11], ['leelo', generarLeelo, 22], ['consigna', generarConsigna, 33], ['completa', generarCompleta, 44]];
const items = (generar, semilla, fecha, idiomaFijo = null) => {
  const rng = crearRng(semilla + DESP + Number(fecha.replace(/\D/g, '')) % 1000);
  return Array.from({ length: N }, (_, k) => generar(rng, { aciertos: k % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: idiomaFijo ?? (k % 2 ? 'en' : 'es'), fecha }));
};
const plano = h => h.replace(/<[^>]+>/g, '');
const correcta = it => it.opciones.find(o => o.correcta);
const todoElTexto = (it, lang = null) => [
  plano(it.notacion), ...it.opciones.map(o => plano(o.html ?? o.texto)), ...it.opciones.filter(o => !o.correcta).flatMap(o => (lang ? [o.por_que[lang]] : [o.por_que.es, o.por_que.en])),
  ...(lang ? [it.solucion[lang]] : [it.solucion.es, it.solucion.en]),
].map(plano).join(' | ');

// ─── Calendario ─────────────────────────────────────────────────────────────────────────

test('leelo7 · paqueteHoy y PAQUETES_DESDE', () => {
  assert.deepEqual(PAQUETES_DESDE, { 1: '2027-03-01', 2: '2027-03-08', 3: '2027-03-15', 4: '2027-04-12', 5: '2027-04-19' });
  assert.equal(DESDE_PAQUETE_3B, '2027-04-05');
  const casos = { '2026-11-19': 1, '2027-02-28': 1, '2027-03-01': 1, '2027-03-07': 1, '2027-03-08': 2, '2027-03-14': 2, '2027-03-15': 3, '2027-04-11': 3, '2027-04-12': 4, '2027-04-19': 5 };
  for (const [f, p] of Object.entries(casos)) assert.equal(paqueteHoy(f), p, f);
});

const PROHIBIDO = {
  // paquetes 1-2: nada de porcentajes, descuentos, IVA, escalas, mapas, planos ni maquetas
  '2026-11-19': /%|per cent|percent|porcent|discount|descuento|\bVAT\b|\bIVA\b|\bscale\b|escala|\bmaps?\b|\bmapa\b|\bplan\b|\bplano\b|\bmodel\b|maqueta|rebajado|sale price|increase|decrease|aumento|disminuci/i,
  '2027-03-02': /%|per cent|percent|porcent|discount|descuento|\bVAT\b|\bIVA\b|\bscale\b|escala|\bmaps?\b|\bmapa\b|\bplan\b|\bplano\b|\bmodel\b|maqueta|rebajado|sale price|increase|decrease|aumento|disminuci/i,
  '2027-03-09': /%|per cent|percent|porcent|discount|descuento|\bVAT\b|\bIVA\b|\bscale\b|escala|\bmaps?\b|\bmapa\b|\bplan\b|\bplano\b|\bmodel\b|maqueta|rebajado|sale price|increase|decrease|aumento|disminuci/i,
  // paquete 3, marzo: porcentajes sí; descuentos, aumentos, IVA y escalas no
  '2027-03-16': /discount|descuento|\bVAT\b|\bIVA\b|\bscale\b|escala|\bmaps?\b|\bmapa\b|\bplan\b|\bplano\b|\bmodel\b|maqueta|rebajado|sale price|increase|decrease|aumento|disminuci|subirla|bajarla/i,
  // paquete 3, abril: sin escalas
  '2027-04-06': /\bscale\b|escala|\bmaps?\b|\bmapa\b|\bplan\b|\bplano\b|\bmodel\b|maqueta/i,
};

for (const [nombre, gen, semilla] of GEN) {
  for (const fecha of FECHAS) {
    test(`leelo7 · ${nombre} · ${fecha}: estructura de ${N} ítems y filtro por fecha`, () => {
      const vistos = new Map();
      const p = paqueteHoy(fecha);
      for (const it of items(gen, semilla, fecha)) {
        assert.equal(it.opciones.length, 4, it.plantilla);
        assert.equal(it.opciones.filter(o => o.correcta).length, 1, `${it.plantilla}: una sola buena`);
        const textos = it.opciones.map(o => o.texto);
        assert.equal(new Set(textos).size, 4, `${it.plantilla}: textos repetidos ${textos}`);
        assert.ok(TX.instrucciones[it.instruccion], `instrucción ${it.instruccion}`);
        assert.ok(it.solucion.es && it.solucion.en);
        assert.ok(Number.isInteger(it.sesion) && it.paquete >= 1 && it.paquete <= p, `paquete ${it.paquete} con la fecha ${fecha}`);
        for (const o of it.opciones.filter(x => !x.correcta)) {
          assert.ok(ESTA_DEFINIDO(o.error), `${it.plantilla}: error ${o.error}`);
          assert.ok(o.por_que.es && o.por_que.en);
        }
        const todo = todoElTexto(it);
        assert.ok(!/×|undefined|NaN|\[object|\bnull\b/.test(todo), `${it.plantilla}: ${todo}`);
        const visible = [plano(it.notacion), ...it.opciones.map(o => plano(o.texto))].join(' | ');
        assert.ok(!/(^|\D)\d{5,}/.test(visible.replace(/\d{1,3}(\u202f\d{3})+/g, '')), `cinco cifras sin espacio fino: ${visible}`);
        if (PROHIBIDO[fecha]) assert.doesNotMatch(todo, PROHIBIDO[fecha], `${fecha}: ${todo}`);
        // Notación: en inglés «20%» (sin espacio) y en español «20 %» (con espacio de no separación).
        if (it.idioma === 'en' && (nombre === 'leelo' || nombre === 'consigna' || nombre === 'completa')) {
          assert.doesNotMatch(todoElTexto(it, 'en').replace(/Elige[^|]*/g, ''), /\d[\s\u00a0\u202f]%/, `20 % en inglés: ${todo}`);
        }
        if (it.idioma === 'es' && nombre === 'leelo') {
          const t = [plano(it.notacion), ...it.opciones.map(o => plano(o.html ?? o.texto)), it.solucion.es].join(' | ');
          assert.doesNotMatch(t, /\d%/, `20% sin espacio en español: ${t}`);
          assert.doesNotMatch(t, /\d [%]/, `espacio normal antes del %: ${t}`);
        }
        vistos.set(claveItem(it), (vistos.get(claveItem(it)) ?? 0) + 1);
      }
      const max = Math.max(...vistos.values());
      assert.ok(max <= N * 0.1, `variedad: ${vistos.size} ítems distintos; el más repetido sale ${max} veces de ${N}`);
    });
  }
}

test('leelo7 · nunca se enfrentan sinónimos válidos ni una opción contiene a otra', () => {
  for (const [nombre, gen, semilla] of GEN) {
    for (const fecha of ['2027-04-06', '2027-04-13']) {
      for (const it of items(gen, semilla, fecha)) {
        const ts = it.opciones.map(o => plano(o.texto).toLowerCase());
        for (const [a, b] of SINONIMOS) assert.ok(!(ts.includes(a.toLowerCase()) && ts.includes(b.toLowerCase())), `${nombre}: ${a} / ${b}`);
        if (nombre === 'consigna') {
          for (const x of ts) for (const y of ts) if (x !== y) assert.ok(!x.includes(y), `${nombre}: «${x}» contiene «${y}»`);
        }
      }
    }
  }
});

// ─── Bancos ─────────────────────────────────────────────────────────────────────────────

test('leelo7 · bancos: 20 términos (8 del paquete 1), 12 frases, consignas y objetos con paquete y sesión', () => {
  assert.ok(VOCABULARIO.length >= 20 && VOCABULARIO.filter(v => v.paquete === 1).length >= 8);
  assert.ok(COMPLETAS.length >= 12 && CONSIGNAS.length >= 12);
  assert.equal(new Set(VOCABULARIO.map(v => v.id)).size, VOCABULARIO.length);
  for (const e of [...VOCABULARIO, ...CONSIGNAS, ...COMPLETAS, ...OBJETOS]) {
    assert.ok(e.paquete >= 1 && e.paquete <= 5, e.id);
    assert.ok(Number.isInteger(e.sesion), e.id);
    assert.ok(e.paquete <= 4, `${e.id}: el paquete 5 espera al acta`);
  }
  for (const v of VOCABULARIO) {
    assert.ok(v.en && v.es && v.familia, v.id);
    if (v.contrario) {
      const c = VOCABULARIO.find(x => x.id === v.contrario);
      assert.ok(c, `${v.id}: contrario inexistente`);
      assert.notEqual(c.familia, v.familia, `${v.id}: contrario de su misma familia`);
    }
  }
  for (const c of CONSIGNAS) if (c.contrario) assert.ok(CONSIGNAS.find(x => x.id === c.contrario), c.id);
});

test('leelo7 · palabra: familias distintas y el contrario siempre entra (si ya se ha dado)', () => {
  const fam = new Map(VOCABULARIO.flatMap(v => [[v.en, v], [v.es, v]]));
  for (const fecha of FECHAS) {
    for (const it of items(generarPalabra, 11, fecha)) {
      const vs = it.opciones.map(o => fam.get(o.texto));
      assert.ok(vs.every(Boolean), 'término desconocido');
      assert.equal(new Set(vs.map(v => v.familia)).size, 4, it.opciones.map(o => o.texto).join(' | '));
      const t = fam.get(plano(it.notacion).trim());
      assert.ok(t, `enunciado ${plano(it.notacion)}`);
      assert.equal(correcta(it).texto === t.es || correcta(it).texto === t.en, true);
      const c = t.contrario && VOCABULARIO.find(x => x.id === t.contrario);
      if (c && fecha >= (c.desde ?? (c.paquete === 1 ? '0' : PAQUETES_DESDE[c.paquete]))) {
        assert.ok(it.opciones.some(o => vs.find(v => v === fam.get(o.texto)).id === c.id), `${t.id}: falta el contrario ${c.id}`);
      }
    }
  }
});

test('leelo7 · consigna: familias distintas y el contrario siempre entra (si ya se ha dado)', () => {
  const porEs = new Map(CONSIGNAS.map(c => [c.es, c]));
  for (const fecha of FECHAS) {
    for (const it of items(generarConsigna, 33, fecha)) {
      const cs = it.opciones.map(o => porEs.get(o.texto));
      assert.ok(cs.every(Boolean));
      assert.equal(new Set(cs.map(c => c.familia)).size, 4, it.opciones.map(o => o.texto).join(' | '));
      const c = porEs.get(correcta(it).texto);
      assert.equal(it.plantilla, `consigna_${c.id}`);
      if (c.contrario && PAQUETES_DESDE[CONSIGNAS.find(x => x.id === c.contrario).paquete] <= fecha) {
        const contrario = CONSIGNAS.find(x => x.id === c.contrario);
        if (fecha >= (contrario.desde ?? '0000')) assert.ok(it.opciones.some(o => o.texto === contrario.es), `${c.id}: falta el contrario`);
      }
    }
  }
});

// ─── Lector independiente de inglés (razones, porcentajes y escalas) ────────────────────

const U = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const D = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
function numeroEn(texto) {
  let total = 0, actual = 0;
  for (const w of texto.trim().toLowerCase().replace(/-/g, ' ').split(/\s+/)) {
    if (w === 'and') continue;
    if (U.includes(w)) actual += U.indexOf(w);
    else if (D[w]) actual += D[w];
    else if (w === 'hundred') actual *= 100;
    else if (w === 'million') { total += actual * 1000000; actual = 0; }
    else if (w === 'thousand') { total += actual * 1000; actual = 0; } else return NaN;
  }
  return total + actual;
}
/** La lectura como [a, b] (razón o escala) o [p] (porcentaje); null si no la entiende. */
function leerLectura(t) {
  let m = /^(.+) per cent$/.exec(t);
  if (m) { const p = numeroEn(m[1]); return Number.isNaN(p) ? null : { p }; }
  m = /^(.+) to (.+)$/.exec(t);
  if (m) { const a = numeroEn(m[1]), b = numeroEn(m[2]); return Number.isNaN(a) || Number.isNaN(b) ? null : { a, b }; }
  return null;
}
const sinEsp = t => t.replace(/[\s\u00a0\u202f]/g, '');
/** La notación como { a, b } o { p }; null si no la entiende. */
function leerNotacion(t) {
  const s = sinEsp(plano(t));
  let m = /^(\d+)\/(\d+)$/.exec(s);
  if (m) return { a: Number(m[1]), b: Number(m[2]) };
  m = /^(\d+):(\d+)$/.exec(s);
  if (m) return { a: Number(m[1]), b: Number(m[2]) };
  m = /^(\d+(?:[.,]\d+)?)%$/.exec(s);
  if (m) return { p: Number(m[1].replace(',', '.')) };
  return null;
}
const igualValor = (x, y) => (x.p !== undefined || y.p !== undefined ? x.p === y.p : x.a * y.b === y.a * x.b);

test('leelo7 · léelo: el lector de inglés confirma que solo una opción dice el objeto', () => {
  let comprobadas = 0;
  for (const fecha of ['2027-03-09', '2027-03-16', '2027-04-13']) {
    for (const it of items(generarLeelo, 22, fecha)) {
      const [modo] = it.plantilla.split('_');
      if (modo === 'leer') {
        const obj = leerNotacion(it.notacion.replace('<p class="operacion">', '').replace('</p>', ''));
        // El objeto sale de la solución («3/4 se lee…»): su notación está en el enunciado, con la raya como <span>.
        const t = plano(it.notacion).trim();
        const o = leerNotacion(/^\d+$/.test(t.replace(/\s/g, '')) && it.plantilla === 'leer_razon-fraccion' ? it.notacion.replace(/<[^>]+>/g, '/').replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/') : t);
        assert.ok(o ?? obj, `no leo el objeto: ${it.notacion}`);
        const objeto = o ?? obj;
        const lectBuena = leerLectura(correcta(it).texto);
        assert.ok(lectBuena, `no leo la buena: ${correcta(it).texto}`);
        assert.ok(igualValor(objeto, lectBuena), `la buena no dice el objeto: ${correcta(it).texto} / ${it.notacion}`);
        for (const f of it.opciones.filter(x => !x.correcta)) {
          const l = leerLectura(f.texto);
          assert.ok(l, `no leo la falsa: ${f.texto}`);
          assert.ok(!igualValor(objeto, l), `la falsa dice lo mismo: ${f.texto} / ${it.notacion}`);
          comprobadas++;
        }
      } else {
        const lect = leerLectura(plano(it.notacion).trim());
        assert.ok(lect, `no leo el enunciado: ${it.notacion}`);
        const claro = o => leerNotacion(o.texto);
        const buena = claro(correcta(it));
        assert.ok(buena && igualValor(buena, lect), `la buena no dice la lectura: ${correcta(it).texto} / ${it.notacion}`);
        for (const f of it.opciones.filter(x => !x.correcta)) {
          const n = claro(f);
          assert.ok(n, `no leo la falsa: ${f.texto}`);
          assert.ok(!igualValor(n, lect), `la falsa dice lo mismo: ${f.texto} / ${it.notacion}`);
          comprobadas++;
        }
      }
    }
  }
  assert.ok(comprobadas > 15000, `comprobadas ${comprobadas}`);
});

test('leelo7 · léelo: nunca 0,35 contra 35 %, ni 6/8 contra 3/4, ni 7/20', () => {
  for (const it of items(generarLeelo, 22, '2027-04-13')) {
    for (const o of it.opciones) assert.doesNotMatch(o.texto, /^0[.,]\d+$/, `decimal contra porcentaje: ${o.texto}`);
  }
});

// ─── Completa: comprobaciones de las frases, aparte del generador ───────────────────────

test('leelo7 · completa: la frase es correcta con la palabra buena (cuentas, concordancia)', () => {
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  for (const it of items(generarCompleta, 44, '2027-04-13')) {
    const f = plano(it.notacion).trim();
    assert.equal(f.split('______').length, 2, `un solo hueco: ${f}`);
    assert.doesNotMatch(f, /\ban ______/, f);
    if (/\b[Aa] ______/.test(f)) for (const o of it.opciones) assert.doesNotMatch(o.texto, /^[aeio]/i, `a/an: ${f} → ${o.texto}`);
    const id = it.plantilla.replace('completa_', '');
    const num = s => Number(String(s).replace(/[\u202f\u00a0\s]/g, ''));
    let m;
    if (id === 'out-of') { m = /^(\d+) ______ (\d+) pupils/.exec(f); assert.ok(m && num(m[1]) >= 2 && num(m[1]) < num(m[2]), f); }
    if (id === 'equivalent') { m = /ratios (\d+)\s:\s(\d+) and (\d+)\s:\s(\d+) are/.exec(f); assert.ok(m && num(m[1]) * num(m[4]) === num(m[2]) * num(m[3]), f); }
    if (id === 'simplest') { m = /ratio (\d+)\s:\s(\d+) in its ______ form is (\d+)\s:\s(\d+)\./.exec(f); assert.ok(m && num(m[1]) * num(m[4]) === num(m[2]) * num(m[3]) && mcd(num(m[3]), num(m[4])) === 1, f); }
    if (id === 'proportion') { m = /example (\d+)\/(\d+) = (\d+)\/(\d+)\./.exec(f); assert.ok(m && num(m[1]) * num(m[4]) === num(m[2]) * num(m[3]), f); }
    if (id === 'unit') { m = /^(\d+) pens cost €(\d+)\.00: the ______ rate is €(\d+)\.00 for one pen/.exec(f); assert.ok(m && num(m[1]) * num(m[3]) === num(m[2]), f); }
    if (id === 'share') { m = /^Share (\d+) sweets ______ the ratio (\d+)\s:\s(\d+)\./.exec(f); assert.ok(m && num(m[1]) % (num(m[2]) + num(m[3])) === 0 && num(m[2]) !== num(m[3]), f); }
    if (id === 'increase') { m = /from €(\d+(?:\.\d+)?) to €(\d+(?:\.\d+)?): it is a (\d+)% ______/.exec(f); assert.ok(m && num(m[2]) === num(m[1]) * (100 + num(m[3])) / 100, f); }
    if (id === 'discount') { m = /costs €(\d+(?:\.\d+)?) but has a (\d+)% ______: now it costs €(\d+(?:\.\d+)?)/.exec(f); assert.ok(m && num(m[3]) === num(m[1]) * (100 - num(m[2])) / 100, f); }
    if (id === 'scale-n') {
      m = /scale 1\s:\s([\d\u202f]+), 1 cm/.exec(f);
      assert.ok(m, f);
      assert.equal(correcta(it).texto, m[1]);
      for (const o of it.opciones.filter(x => !x.correcta)) assert.notEqual(num(o.texto), num(m[1]));
    }
    if (id === 'same') { m = /each makes (\d+) toys in (\d+) minutes/.exec(f); assert.ok(m && num(m[1]) / num(m[2]) <= 12, f); }
  }
});

// ─── Casos reservados ───────────────────────────────────────────────────────────────────

test('leelo7 · casos reservados: existen, los consultan todos los generadores y esReservado responde', () => {
  assert.ok(RESERVADOS_HOJA instanceof Set && HUELLAS_EXAMEN instanceof Set);
  assert.equal(esReservado('razon', [3, 4]), false);
  for (const id of Object.keys(ERRORES_LEELO)) assert.ok(nombreDe(id).es && nombreDe(id).en, id);
  const tieneH = RESERVADOS_HOJA.has, tieneE = HUELLAS_EXAMEN.has;
  RESERVADOS_HOJA.has = () => true;
  try {
    assert.equal(esReservado('razon', [3, 4]), true);
    const rng = crearRng(5);
    for (const [nombre, gen] of GEN) {
      if (nombre === 'palabra') { assert.ok(gen(rng, { fecha: '2027-04-13' })); continue; }
      assert.throws(() => gen(rng, { fecha: '2027-04-13' }), /No se ha podido generar/, `${nombre} no consulta los reservados`);
    }
  } finally { RESERVADOS_HOJA.has = tieneH; }
  HUELLAS_EXAMEN.has = () => true;
  try {
    for (const [nombre, gen] of GEN.filter(g => g[0] !== 'palabra')) assert.throws(() => gen(crearRng(6), { fecha: '2027-04-13' }), /No se ha podido generar/, `${nombre} no consulta las huellas`);
  } finally { HUELLAS_EXAMEN.has = tieneE; }
});
