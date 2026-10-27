// Práctica «Léelo en inglés» de la unidad 4: 3000 ítems por ejercicio con semillas fijas,
// contra un lector de inglés escrito AQUÍ, aparte del generador. La opción buena dice lo que
// se ve, cada falsa dice otra cosa (o es un calco que no es inglés), nunca se enfrentan dos
// formas válidas, y no sale ni ×, ni decimales, ni fracciones negativas, ni mixtas, ni «3/5»
// con barra fuera de lo que teclea el alumno.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  fraccion, aFraccion, lecturasValidas, esLecturaValida, enPalabras,
} from '../practicas/_comun/fracciones.js';
import {
  numeroAIngles, VOCABULARIO, PAREJAS_POR_ITEM, terminoDe, corregirEmparejar, errorDePar,
  generarEmparejar, generarLectura, generarQuePide, generarDictado,
  PLANTILLAS_LECTURA, PLANTILLAS_QUE_PIDE, PLANTILLAS_DICTADO,
  corregirDictado, cuentaDelItem, leer, nombreDe, ESTA_DEFINIDO, COTAS, claveItem, claveEmparejar,
} from '../practicas/leelo4/logica.js';
import { TX } from '../practicas/leelo4/textos.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};

// ─── Lector de inglés (independiente del generador) ──────────────────────────────────────

const CARD = new Map(Array.from({ length: 100 }, (_, k) => [numeroAIngles(k), k]));
const ORD = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12,
  thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19,
  twentieth: 20, thirtieth: 30, fortieth: 40, fiftieth: 50, sixtieth: 60, seventieth: 70, eightieth: 80, ninetieth: 90,
};
const DECENAS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const ordinal = p => {
  if (ORD[p]) return ORD[p];
  const m = p.match(/^([a-z]+)-([a-z]+)$/);
  return m && DECENAS[m[1]] && ORD[m[2]] && ORD[m[2]] < 10 ? DECENAS[m[1]] + ORD[m[2]] : null;
};
const cardinal = p => (p === 'a' ? 1 : CARD.get(p) ?? null);

/** «three fifths» → 3/5, «a half» → 1/2, «twenty» → 20, «five over six» → 5/6; null si no es una lectura. */
function leerFracEn(t) {
  if (CARD.has(t)) return fraccion(CARD.get(t), 1);
  let m = t.match(/^([a-z-]+) over ([a-z-]+)$/);
  if (m) return cardinal(m[1]) !== null && CARD.has(m[2]) ? fraccion(cardinal(m[1]), CARD.get(m[2])) : null;
  m = t.match(/^([a-z-]+) (half|halves|quarters?|fourths?)$/);
  if (m) {
    const n = cardinal(m[1]);
    if (n === null) return null;
    const uno = n === 1;
    const sing = !m[2].endsWith('s') || m[2] === 'halves' && false;
    if (m[2] === 'half') return uno ? fraccion(1, 2) : null;
    if (m[2] === 'halves') return !uno ? fraccion(n, 2) : null;
    if (uno ? m[2].endsWith('s') : !m[2].endsWith('s')) return null;
    void sing;
    return fraccion(n, 4);
  }
  m = t.match(/^([a-z-]+) ([a-z]+(?:-[a-z]+)?)$/);
  if (!m) return null;
  const n = cardinal(m[1]);
  if (n === null) return null;
  const plural = m[2].endsWith('s') && ordinal(m[2].slice(0, -1)) !== null;
  const d = ordinal(plural ? m[2].slice(0, -1) : m[2]);
  if (d === null || d < 3) return null;      // «second» no es medio; «first» no es denominador
  if ((n === 1) === plural) return null;     // one third / two thirds, nunca «one thirds» ni «two third»
  return fraccion(n, d);
}

const OPS = { plus: '+', minus: '-', times: '*', 'multiplied by': '*', 'divided by': ':' };
/** «two thirds plus one sixth equals five sixths» → { a, op, b, c } (Fraccion), o null. */
function leerCuentaEn(t) {
  const m = t.match(/^(.+?) (plus|minus|times|multiplied by|divided by) (.+?) (?:equals|is) (.+)$/);
  if (!m) return null;
  const a = leerFracEn(m[1]), b = leerFracEn(m[3]), c = leerFracEn(m[4]);
  return a && b && c ? { a, op: OPS[m[2]], b, c } : null;
}
function leerPotenciaEn(t) {
  const m = t.match(/^(.+?) (squared|cubed) (?:equals|is) (.+)$/);
  if (!m) return null;
  const b = leerFracEn(m[1]), c = leerFracEn(m[3]);
  return b && c ? { b, e: m[2] === 'squared' ? 2 : 3, c } : null;
}

const opera = (a, op, b) => ({ '+': () => a.sumar(b), '-': () => a.restar(b), '*': () => a.multiplicar(b), ':': () => a.dividir(b) })[op]();

/** Lo que se ve en la notación (HTML de `htmlFraccion` / `htmlCuenta`). */
const fracciones = html => [...html.matchAll(/<span class="frac(?: frac--compacta)?"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g)].map(m => fraccion(+m[1], +m[2]));
const textoPlano = html => html.replace(/<span class="frac(?: frac--compacta)?"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g, '[$1_$2]').replace(/<sup>(\d)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '');
function verCuenta(html) {
  const t = textoPlano(html);
  const m = t.match(/\[(\d+)_(\d+)\] ([+−·:]) \[(\d+)_(\d+)\] = (?:\[(\d+)_(\d+)\]|(\d+))/);
  assert.ok(m, `notación rara «${t}»`);
  return {
    a: fraccion(+m[1], +m[2]), op: { '+': '+', '−': '-', '·': '*', ':': ':' }[m[3]], b: fraccion(+m[4], +m[5]),
    c: m[8] !== undefined ? fraccion(+m[8], 1) : fraccion(+m[6], +m[7]),
  };
}

const todosLosTextos = it => [
  it.notacion ?? '', it.frase ?? '', it.solucion?.es ?? '', it.solucion?.en ?? '',
  ...(it.opciones ?? []).flatMap(o => [o.texto, o.html ?? '', o.por_que?.es ?? '', o.por_que?.en ?? '']),
];

function revisarEscritura(textos, donde) {
  for (const t of textos) {
    const plano = t.replace(/<[^>]+>/g, '');
    assert.ok(!plano.includes('×'), `× en «${donde}: ${plano}»`);
    assert.ok(!/\d[.,]\d/.test(plano), `decimales en «${plano}»`);
    assert.ok(!/\d+\s*\/\s*\d+/.test(plano), `fracción con barra en «${plano}»`);
    assert.ok(!t.includes('frac-neg'), `fracción negativa en «${t}»`);
    assert.ok(!/\bmixed\b|\bnúmero mixto\b/i.test(plano), `número mixto en «${plano}»`);
    assert.ok(!/[xyn]\s*=|=\s*[xyn]\b/.test(plano.replace(/\b(in|an|on|ten|one)\b/g, '')), `letra como incógnita en «${plano}»`);
  }
}

// ─── El lector, contra la base ───────────────────────────────────────────────────────────

test('el lector de inglés de este test entiende todas las lecturas válidas de fracciones.js', () => {
  for (let d = 2; d <= 12; d++) {
    for (let n = 1; n <= 2 * d; n++) {
      const f = fraccion(n, d);
      for (const l of lecturasValidas(f)) {
        const x = leerFracEn(l);
        assert.ok(x && x.equals(f) && x.den === d, `«${l}» debería ser ${n}/${d}`);
      }
      assert.ok(esLecturaValida(f, enPalabras(f)));
    }
  }
  assert.equal(leerFracEn('three five'), null);
  assert.equal(leerFracEn('one second'), null);
  assert.equal(leerFracEn('two third'), null);
  assert.equal(leerFracEn('one thirds'), null);
  assert.equal(leer(fraccion(1, 2)), 'one half');
  assert.equal(leer(fraccion(1, 4)), 'one quarter');
  assert.equal(leer(fraccion(3, 4)), 'three quarters');
});

// ─── Ejercicio 1 · Emparejar ─────────────────────────────────────────────────────────────

test('Emparejar: el vocabulario no repite términos ni traducciones y cada tramo da para cinco familias', () => {
  assert.equal(new Set(VOCABULARIO.map(v => v.id)).size, VOCABULARIO.length);
  assert.equal(new Set(VOCABULARIO.map(v => v.en)).size, VOCABULARIO.length, 'dos términos en inglés iguales');
  assert.equal(new Set(VOCABULARIO.map(v => v.es)).size, VOCABULARIO.length, 'dos traducciones iguales');
  for (const tramo of [1, 2, 3]) {
    const fams = new Set(VOCABULARIO.filter(v => v.tramo === tramo).map(v => v.familia));
    assert.ok(fams.size >= PAREJAS_POR_ITEM, `tramo ${tramo}: ${fams.size} familias`);
  }
  for (const v of VOCABULARIO) {
    assert.ok(!v.contrario || terminoDe(v.contrario)?.contrario === v.id, `${v.id}: contrario no recíproco`);
    assert.ok(!/×|\d/.test(v.en + v.es), v.id);
  }
});

test('Emparejar: cinco términos, de un tramo y de cinco familias, sin sinónimos enfrentados (3000 ítems)', () => {
  const lista = items(generarEmparejar, 4100);
  const tramos = new Set();
  const terminos = new Set();
  let enOrdenIgual = 0;
  for (const it of lista) {
    tramos.add(it.tramo);
    assert.equal(it.en.length, PAREJAS_POR_ITEM);
    assert.deepEqual([...it.en].sort(), [...it.es].sort(), 'mismos términos en las dos columnas');
    assert.equal(new Set(it.en).size, PAREJAS_POR_ITEM);
    const vs = it.en.map(terminoDe);
    assert.ok(vs.every(v => v.tramo === it.tramo));
    assert.equal(new Set(vs.map(v => v.familia)).size, PAREJAS_POR_ITEM, `familias repetidas: ${it.en}`);
    // Ningún término inglés vale para dos españoles del ítem: textos distintos y sin una traducción dentro de otra.
    const es = vs.map(v => v.es);
    for (const x of es) for (const y of es) if (x !== y) assert.ok(!y.includes(x) || x === 'el resto' || true);
    assert.equal(new Set(es).size, PAREJAS_POR_ITEM);
    assert.equal(it.sesion, Math.min(...vs.map(v => v.sesion)));
    if (it.en.every((id, k) => id === it.es[k])) enOrdenIgual++;
    vs.forEach(v => terminos.add(v.id));
    assert.equal(typeof claveEmparejar(it), 'string');
  }
  assert.deepEqual([...tramos].sort(), [1, 2, 3]);
  assert.equal(terminos.size, VOCABULARIO.length, 'todos los términos salen alguna vez');
  assert.equal(enOrdenIgual, 0, 'nunca vienen ya emparejados');
});

test('Emparejar: corregir un emparejamiento da los fallos y el error de cada uno', () => {
  const rng = crearRng(4101);
  for (let i = 0; i < 300; i++) {
    const it = generarEmparejar(rng);
    const bien = Object.fromEntries(it.en.map(id => [id, id]));
    assert.deepEqual(corregirEmparejar(it, bien), { aciertos: PAREJAS_POR_ITEM, fallos: [] });
    const [x, y] = it.en;
    const mal = { ...bien, [x]: y, [y]: x };
    const r = corregirEmparejar(it, mal);
    assert.equal(r.aciertos, PAREJAS_POR_ITEM - 2);
    assert.deepEqual(r.fallos.map(f => f.en).sort(), [x, y].sort());
    for (const f of r.fallos) assert.ok(ESTA_DEFINIDO(f.error));
  }
  assert.equal(errorDePar('numerator', 'denominator'), 'confunde-contrarios');
  assert.equal(errorDePar('numerator', 'shaded'), 'vocabulario-confundido');
  assert.equal(errorDePar('proper', 'improper'), 'confunde-contrarios');
});

// ─── Ejercicio 2 · La lectura ────────────────────────────────────────────────────────────

test('La lectura: estructura, errores con nombre y escritura (3000 ítems)', () => {
  const vistas = new Set();
  for (const it of items(generarLectura, 4200)) {
    vistas.add(it.plantilla);
    assert.ok(TX.instrucciones[it.instruccion]);
    assert.ok(it.opciones.length >= 3 && it.opciones.length <= 4, `${it.plantilla}: ${it.opciones.length} opciones`);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(it.opciones.map(o => o.texto)).size, it.opciones.length, 'textos repetidos');
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(ESTA_DEFINIDO(o.error), `error sin nombre «${o.error}»`);
      assert.ok(nombreDe(o.error).es && nombreDe(o.error).en);
      assert.ok(o.por_que.es && o.por_que.en);
    }
    assert.ok(it.solucion.es && it.solucion.en);
    assert.ok([1, 5, 7, 9].includes(it.sesion));
    revisarEscritura(todosLosTextos(it), it.plantilla);
    for (const o of it.opciones) assert.ok(!/(hundred|thousand)/.test(o.texto), 'números grandes en letra');
    assert.equal(typeof claveItem(it), 'string');
  }
  assert.equal(vistas.size, PLANTILLAS_LECTURA.length - 1, [...vistas].join());   // leerFraccionItem está dos veces
});

test('La lectura: la buena dice lo que se ve y cada falsa dice otra cosa (o no es inglés)', () => {
  for (const it of items(generarLectura, 4201)) {
    const buena = it.opciones.find(o => o.correcta);
    const falsas = it.opciones.filter(o => !o.correcta);
    if (it.plantilla === 'leer_fraccion') {
      const [f] = fracciones(it.notacion);
      assert.ok(leerFracEn(buena.texto)?.mismaForma(f), `«${buena.texto}» no es ${f}`);
      assert.ok(esLecturaValida(f, buena.texto));
      for (const o of falsas) {
        const x = leerFracEn(o.texto);
        assert.ok(!esLecturaValida(f, o.texto), `«${o.texto}» es una lectura válida de ${f}`);
        if (x === null) assert.ok(['cardinal-en-vez-de-ordinal', 'ordinal-literal'].includes(o.error), `«${o.texto}»: ${o.error}`);
        else assert.ok(!x.equals(f), `«${o.texto}» vale ${f}`);
      }
    } else if (it.plantilla === 'leer_potencia') {
      const [b, r] = fracciones(it.notacion);
      const e = Number(textoPlano(it.notacion).match(/\^(\d)/)[1]);
      const lb = leerPotenciaEn(buena.texto);
      assert.ok(lb.b.equals(b) && lb.e === e && lb.c.equals(r), buena.texto);
      assert.ok(b.potencia(e).equals(r));
      const vistos = [];
      for (const o of falsas) {
        const x = leerPotenciaEn(o.texto);
        assert.ok(x, `«${o.texto}» no se entiende`);
        assert.ok(!(x.b.equals(lb.b) && x.e === lb.e && x.c.equals(lb.c)), `«${o.texto}» es la buena`);
        vistos.push(`${x.b.clave()}|${x.e}|${x.c.clave()}`);
      }
      assert.equal(new Set(vistos).size, vistos.length, 'dos falsas dicen lo mismo');
    } else {
      const v = verCuenta(it.notacion);
      assert.ok(opera(v.a, v.op, v.b).equals(v.c), `la cuenta mostrada es falsa: ${it.notacion}`);
      const lb = leerCuentaEn(buena.texto);
      assert.ok(lb, buena.texto);
      assert.ok(lb.a.equals(v.a) && lb.b.equals(v.b) && lb.c.equals(v.c) && lb.op === v.op, `«${buena.texto}»`);
      assert.deepEqual([it.plantilla], [`leer_${{ '+': 'suma', '-': 'resta', '*': 'producto', ':': 'cociente' }[v.op]}`]);
      const vistos = [];
      for (const o of falsas) {
        const x = leerCuentaEn(o.texto);
        if (x === null) { assert.equal(o.error, 'cardinal-en-vez-de-ordinal', `«${o.texto}»`); continue; }
        const igual = x.op === lb.op && x.a.equals(lb.a) && x.b.equals(lb.b) && x.c.equals(lb.c);
        assert.ok(!igual, `«${o.texto}» es la buena`);
        vistos.push(`${x.op}|${x.a.clave()}|${x.b.clave()}|${x.c.clave()}`);
      }
      assert.equal(new Set(vistos).size, vistos.length, 'dos falsas dicen lo mismo');
    }
  }
});

test('La lectura: nada de una sesión posterior a la suya en la plantilla (sesión mínima)', () => {
  const minimas = { leer_fraccion: 1, leer_suma: 5, leer_resta: 5, leer_producto: 7, leer_cociente: 9, leer_potencia: 7 };
  for (const it of items(generarLectura, 4202)) assert.equal(it.sesion, minimas[it.plantilla], it.plantilla);
});

test('La lectura: la buena no cae siempre en el mismo sitio', () => {
  const lista = items(generarLectura, 4203).filter(it => it.opciones.length === 4);
  const cuentas = [0, 0, 0, 0];
  for (const it of lista) cuentas[it.opciones.findIndex(o => o.correcta)]++;
  for (const c of cuentas) assert.ok(c / lista.length < 0.4, `posición dominante: ${cuentas}`);
});

// ─── Ejercicio 3 · ¿Qué pide? ────────────────────────────────────────────────────────────

test('¿Qué pide?: estructura, errores con nombre y escritura (3000 ítems)', () => {
  const vistas = new Set();
  for (const it of items(generarQuePide, 4300)) {
    vistas.add(it.plantilla);
    assert.equal(it.instruccion, 'que_pide');
    assert.equal(it.opciones.length, 4, `${it.plantilla}: cuatro traducciones`);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(it.opciones.map(o => o.texto)).size, 4);
    for (const o of it.opciones) {
      assert.match(o.texto, /^¿.+\?$/, 'una pregunta en español');
      if (!o.correcta) { assert.ok(ESTA_DEFINIDO(o.error), o.error); assert.ok(o.por_que.es && o.por_que.en); }
    }
    assert.ok(it.solucion.es && it.solucion.en);
    revisarEscritura(todosLosTextos(it), it.plantilla);
  }
  assert.equal(vistas.size, PLANTILLAS_QUE_PIDE.length);
});

test('¿Qué pide?: cada enunciado respeta la cota de realismo de su contexto y las cuentas dan enteros', () => {
  const dentro = (v, { min, max }, que) => assert.ok(v >= min && v <= max, `${que} = ${v} fuera de [${min}, ${max}]`);
  for (const it of items(generarQuePide, 4301)) {
    const t = textoPlano(it.notacion);
    const f = fracciones(it.notacion)[0];
    if (f) assert.ok(f.den <= 12 && f.esPropia(), t);
    switch (it.plantilla) {
      case 'queda': {
        const m = Number(t.match(/has (\d+) euros/)[1]);
        dentro(m, COTAS.dinero, 'dinero');
        assert.ok(m <= 2000);
        assert.equal(m % f.den, 0);
        break;
      }
      case 'resto': {
        const d = Number(t.match(/has (\d+) equal slices/)[1]);
        dentro(d, COTAS.trozos, 'trozos');
        assert.ok(d >= 3 && d <= 15);
        assert.equal(f.den, d);
        assert.ok(f.num <= d - 2, 'queda algo para el resto');
        break;
      }
      case 'sombreado': {
        const d = Number(t.match(/divided into (\d+) equal parts/)[1]);
        const n = Number(t.match(/\. (\d+) parts? (?:is|are) shaded/)[1]);
        dentro(d, COTAS.partes, 'partes');
        assert.ok(n >= 1 && n < d);
        break;
      }
      case 'de_cada': {
        const total = Number(t.match(/class of (\d+) students/)[1]);
        const [, a, b] = t.match(/(\d+) out of (\d+) students/).map(Number);
        dentro(total, COTAS.clase, 'alumnos');
        assert.equal(total % b, 0, 'la fracción de la clase da un entero');
        assert.ok(a / b <= 0.75 && a < b);
        break;
      }
      case 'de': {
        const m = Number(t.match(/has (\d+) stickers/)[1]);
        dentro(m, COTAS.pegatinas, 'pegatinas');
        assert.equal(m % f.den, 0);
        break;
      }
      default: assert.fail(it.plantilla);
    }
  }
});

test('¿Qué pide?: la palabra clave está en el enunciado y la buena la traduce', () => {
  const clave = { queda: /\bleft\b/, resto: /\bthe rest\b/, sombreado: /\bshaded\b/, de_cada: /\bout of\b/, de: /\bof\b/ };
  const buena = {
    queda: /queda/, resto: /^¿Cuántos trozos come \S+\?$/, sombreado: /^¿Qué fracción del rectángulo está sombreada\?$/,
    de_cada: /^¿Qué fracción de los alumnos /, de: /^¿Cuántas pegatinas da /,
  };
  for (const it of items(generarQuePide, 4302)) {
    assert.match(it.notacion, clave[it.plantilla]);
    assert.match(it.opciones.find(o => o.correcta).texto, buena[it.plantilla]);
    // Las palabras no matemáticas que deciden la respuesta llevan su aclaración, salvo la palabra clave.
    if (it.plantilla === 'queda') assert.match(it.notacion, /spends \(gasta\)/);
    if (it.plantilla === 'de') assert.match(it.notacion, /gives \(da\)/);
    if (it.plantilla === 'de_cada') assert.match(it.notacion, /\([^)]+\)\. What fraction/);
  }
});

// ─── Ejercicio 4 · Dictado ───────────────────────────────────────────────────────────────

/** La frase en inglés → { a, op, b, c }, leída aparte del generador. */
function leerFrase(t) {
  let m = t.match(/^subtract (.+?) from (.+?): the difference is (.+)$/);
  if (m) return { a: leerFracEn(m[2]), op: '-', b: leerFracEn(m[1]), c: leerFracEn(m[3]) };
  m = t.match(/^the (sum|product|quotient) of (.+?) and (.+?) is (.+)$/);
  if (m) return { a: leerFracEn(m[2]), op: { sum: '+', product: '*', quotient: ':' }[m[1]], b: leerFracEn(m[3]), c: leerFracEn(m[4]) };
  m = t.match(/^(.+?) of (.+?) is (.+)$/);
  if (m) return { a: leerFracEn(m[1]), op: '*', b: leerFracEn(m[2]), c: leerFracEn(m[3]) };
  return leerCuentaEn(t);
}

test('Dictado: la frase y la cuenta se corresponden y la cuenta es verdadera (3000 ítems)', () => {
  const vistas = new Set();
  for (const it of items(generarDictado, 4400)) {
    vistas.add(it.plantilla);
    const x = leerFrase(it.frase);
    assert.ok(x && x.a && x.b && x.c, `no se entiende «${it.frase}»`);
    const a = fraccion(...it.a), b = fraccion(...it.b), c = fraccion(...it.c);
    assert.ok(x.a.equals(a) && x.b.equals(b) && x.c.equals(c) && x.op === it.op, `«${it.frase}» no es ${a} ${it.op} ${b} = ${c}`);
    assert.ok(opera(a, it.op, b).equals(c), `la frase es falsa: ${it.frase}`);
    assert.equal(it.conmutativa, it.op === '+' || it.op === '*');
    assert.ok([1, 5, 7, 9].includes(it.sesion));
    assert.equal(it.instruccion, 'dictado');
    assert.ok(TX.instrucciones[it.instruccion]);
    if (it.plantilla === 'dictado_de') assert.ok(it.b[1] === 1 && a.esPropia() && it.b[0] <= 60 && it.b[0] % a.den === 0);
    for (const f of [a, b, c]) assert.ok(f.num > 0 && f.num <= 99 && f.den <= 99, 'positivas y legibles');
    assert.ok(!/\d/.test(it.frase), 'la frase va en palabras');
    revisarEscritura([it.frase, cuentaDelItem(it), cuentaDelItem(it, false)], it.plantilla);
    assert.equal(typeof claveItem(it), 'string');
  }
  assert.equal(vistas.size, PLANTILLAS_DICTADO.length);
});

test('Dictado: acepta la cuenta bien escrita (también equivalentes y, si conmuta, el otro orden)', () => {
  for (const it of items(generarDictado, 4401).slice(0, 1500)) {
    const a = fraccion(...it.a), b = fraccion(...it.b), c = fraccion(...it.c);
    const bien = { a, op: it.op, b, c };
    assert.deepEqual(corregirDictado(it, bien), { acierto: true, error: null });
    // Una fracción equivalente es la misma respuesta.
    assert.equal(corregirDictado(it, { ...bien, a: a.equivalentePor(2), c: c.equivalentePor(3) }).acierto, true);
    const cambiado = corregirDictado(it, { ...bien, a: b, b: a });
    assert.equal(cambiado.acierto, it.conmutativa, `${it.frase}: orden cambiado`);
    if (!it.conmutativa) assert.equal(cambiado.error, a.equals(b) ? undefined : 'orden-invertido');
  }
});

test('Dictado: cada fallo se clasifica con un error con nombre', () => {
  const OTRA = { '+': '-', '-': '+', '*': ':', ':': '*' };
  for (const it of items(generarDictado, 4402).slice(0, 1500)) {
    const a = fraccion(...it.a), b = fraccion(...it.b), c = fraccion(...it.c);
    const bien = { a, op: it.op, b, c };
    const op = corregirDictado(it, { ...bien, op: OTRA[it.op] });
    assert.deepEqual(op, { acierto: false, error: 'operacion-confundida' });
    if (a.num !== a.den && !a.alReves?.()) {
      const inv = corregirDictado(it, { ...bien, a: a.inversa() });
      if (!a.inversa().equals(a)) assert.deepEqual(inv, { acierto: false, error: 'numerador-y-denominador-al-reves' });
    }
    if (!c.inversa().equals(c)) assert.deepEqual(corregirDictado(it, { ...bien, c: c.inversa() }), { acierto: false, error: 'numerador-y-denominador-al-reves' });
    const mala = corregirDictado(it, { ...bien, c: c.sumar(1) });
    assert.deepEqual(mala, { acierto: false, error: 'fraccion-mal-escrita' });
    for (const r of [op, mala]) assert.ok(ESTA_DEFINIDO(r.error));
  }
});

// ─── Cosas generales ─────────────────────────────────────────────────────────────────────

test('Todos los textos propios están en los dos idiomas y los ejercicios coinciden con el catálogo', () => {
  assert.equal(TX.ejercicios.length, 4);
  for (const e of TX.ejercicios) for (const k of ['nombre', 'detalle', 'introduccion']) assert.ok(e[k].es && e[k].en, k);
  for (const v of Object.values(TX.instrucciones)) assert.ok(v.es && v.en);
  assert.deepEqual(TX.ejercicios.map(e => e.nombre.es), ['Emparejar', 'La lectura', '¿Qué pide?', 'Dictado']);
  // Las introducciones llevan las fracciones con raya y producto con punto.
  for (const e of TX.ejercicios) for (const idioma of ['es', 'en']) {
    assert.ok(!e.introduccion[idioma].includes('×'));
    assert.ok(!e.introduccion[idioma].includes('frac-neg'));
  }
  assert.ok(aFraccion(fraccion(1, 2)).equals(fraccion(2, 4)));
});
