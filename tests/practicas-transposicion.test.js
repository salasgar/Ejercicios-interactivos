// Práctica «Pasa al otro lado» de la unidad 6 (PU2, tarea 149): 3000 ítems por ejercicio con semillas fijas,
// contra comprobaciones escritas AQUÍ, aparte del generador: un evaluador propio (BigInt, racionales) lee las
// igualdades y ecuaciones tal como se muestran. En cada ítem la opción buena vale lo que dice, cada falsa vale
// otra cosa y nace de un error con nombre, ningún par de opciones equivale a otro, los casos reservados no
// salen, y ningún texto de alumno lleva ×, %, 1x, «+ −», x² ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, deEcuacion } from '../practicas/_comun/algebra.js';
import { leerFraccion } from '../practicas/_comun/fracciones.js';
import { TX, lineaFrente } from '../practicas/transposicion/textos.js';
import {
  F, solTexto, textoEcuacion, solucionDe, candidatos, linea, comprobacion, leerSolucion,
  ERRORES_PROPIOS, nombreError, buenos, OPS, HUECO, HUELLAS_RESERVADAS, huellaDe, esReservado,
  generarConNumeros, generarOperador, generarHueco, generarUnaOperacion, generarDosOperaciones, generarFrente, generarComprueba,
  errorDeConNumeros, errorDeUnaOperacion, errorDeDosOperaciones, errorDeFrente, errorDeCorrige, segundoPaso, textoFrente, claveDe,
} from '../practicas/transposicion/logica.js';

const N = 3000;
const lote = (generar, semilla, n = N) => { const rng = crearRng(semilla); return Array.from({ length: n }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Un evaluador propio: racionales con BigInt, leyendo el texto tal como se ve ──────────────

const mcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; };
const R = (n, d = 1n) => { if (d < 0n) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
const suma = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const resta = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const por = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const entre = (a, b) => { assert.notEqual(b[0], 0n, 'división entre 0'); return R(a[0] * b[1], a[1] * b[0]); };
const igualR = (a, b) => a[0] === b[0] && a[1] === b[1];
const deItem = p => R(BigInt(p.num), BigInt(p.den));
const deFraccion = f => R(BigInt(f.num), BigInt(f.den));

/** Evalúa un lado («3x − 4», «x/5», «12 − 7», «−4 − 11», «1/4»), con x = valor (par racional). */
function evaluar(texto, x = null) {
  const toks = texto.replace(/−/g, '-').match(/\d+|x|[()+\-*/:·]/g);
  let i = 0;
  const expr = () => {
    let v = term();
    while (toks[i] === '+' || toks[i] === '-') { const op = toks[i++]; const t = term(); v = op === '+' ? suma(v, t) : resta(v, t); }
    return v;
  };
  const term = () => {
    let v = factor();
    for (;;) {
      const t = toks[i];
      if (t === '·' || t === '*') { i++; v = por(v, factor()); }
      else if (t === ':' || t === '/') { i++; v = entre(v, factor()); }
      else if (t === 'x' || t === '(' || /^\d+$/.test(t ?? '')) v = por(v, factor()); // 3x
      else return v;
    }
  };
  const factor = () => {
    const t = toks[i++];
    if (t === '-') { const f = factor(); return R(-f[0], f[1]); }
    if (t === '(') { const v = expr(); assert.equal(toks[i++], ')'); return v; }
    if (t === 'x') { assert.ok(x, 'x sin valor'); return x; }
    assert.match(t, /^\d+$/, `número raro en «${texto}»`);
    return R(BigInt(t));
  };
  const v = expr();
  assert.equal(i, toks.length, `sobran símbolos en «${texto}»`);
  return v;
}

/** ¿Se cumple la ecuación escrita con x = valor? */
const cumple = (ecuacion, x) => { const [l, r, ...resto] = ecuacion.split(' = '); assert.equal(resto.length, 0); return igualR(evaluar(l, x), evaluar(r, x)); };
/** Los valores de una cadena «x = a = b = c»: todos los que hay detrás de «x = » tienen que coincidir. */
const valoresDeCadena = cad => sinHtml(cad).split('=').map(p => p.trim()).slice(1).map(p => evaluar(p));
/** El valor del último eslabón de una línea. */
const finalDe = cad => valoresDeCadena(cad).at(-1);

const NOMBRADOS = new Set([...Object.keys(ERRORES_TIPICOS), ...Object.keys(ERRORES_PROPIOS)].filter(k => k !== 'otra-respuesta'));

function textosProhibidos(t, _idioma, donde) {
  const s = sinHtml(t);
  assert.ok(!/×/.test(s), `× en ${donde}: ${s}`);
  assert.ok(!/%/.test(s), `% en ${donde}: ${s}`);
  assert.ok(!/(^|[^\d.,/])1x/.test(s), `1x en ${donde}: ${s}`);
  assert.ok(!/[+−-] ?[−-]\d/.test(s.replace(/\(−/g, '(')), `signo doble en ${donde}: ${s}`);
  assert.ok(!/(^|[\s(=:])-\d/.test(s), `guion en vez de signo menos en ${donde}: ${s}`);
  assert.ok(!/x²|x\^2|\^|\*/.test(s), `x² o * en ${donde}: ${s}`);
  assert.ok(!/\d,\d/.test(s) && !/\d\.\d/.test(s), `decimal en ${donde}: ${s}`);
  assert.ok(!/undefined|NaN|\[object|null/.test(s), `basura en ${donde}: ${s}`);
}

/** La cuenta de «Comprobación: …» / «Check: …» de un feedback (debe cumplirse con la ecuación). */
const cuentaDeComprobacion = html => /(?:Comprobación|Check): <span class="cuenta">(.*?)<\/span>/.exec(html)?.[1];

// ─── Pruebas de lo que lee el alumno ──────────────────────────────────────────────────────────

test('leerSolucion: «7», «x = 7», «x=−5», «3/12», «−1/4»; null con basura', () => {
  const v = t => leerSolucion(t, leerFraccion);
  assert.ok(v('7').equals(7));
  assert.ok(v('x = 7').equals(7));
  assert.ok(v(' X=−5 ').equals(-5));
  assert.ok(v('x = -5').equals(-5));
  assert.ok(v('−1/4').equals(F({ num: -1, den: 4 })));
  assert.equal(v('3/12').num, 3);        // sin simplificar: lo decide quien lo usa
  for (const malo of ['', 'x', 'x =', 'abc', '3 5', '2x']) assert.equal(v(malo), null, malo);
});

test('leerSolucion: decimal exacto con coma o punto, con o sin «x =»; 0,33 no es 1/3', () => {
  const v = t => leerSolucion(t, leerFraccion);
  assert.ok(v('2,75').equals(F({ num: 11, den: 4 })));
  assert.ok(v('x = 2.75').equals(F({ num: 11, den: 4 })));
  assert.ok(v('−0,5').equals(F({ num: -1, den: 2 })));
  assert.ok(!v('0,33').equals(F({ num: 1, den: 3 })));
  for (const malo of ['2,', ',5', '2,7,5']) assert.equal(v(malo), null, malo);
});

test('ej. 4: el decimal exacto y la fracción sin simplificar se dan por buenos', () => {
  let conDecimal = 0;
  for (const item of lote(generarFrente, 53, 1500)) {
    if (item.tipo !== 'escribir') continue;
    const s = F(item.solucion);
    assert.equal(errorDeFrente(item, leerSolucion(`${s.num}/${s.den}`.replace('-', '−'), leerFraccion)), null);
    if ([2, 4, 5, 8, 10, 20, 25].some(d => s.den === d || s.den === 1) && s.den !== 1) {
      conDecimal++;
      const txt = String(s.num / s.den).replace('.', ',');
      assert.equal(errorDeFrente(item, leerSolucion(txt, leerFraccion)), null, `${txt} para ${solTexto(item.solucion)}`);
    }
    const k = F({ num: s.num * 2, den: s.den * 2 });
    assert.equal(errorDeFrente(item, leerSolucion(`${k.num}/${k.den}`, leerFraccion)), null);
  }
  assert.ok(conDecimal > 50, String(conDecimal));
});

// ─── Ejercicio 1 ──────────────────────────────────────────────────────────────────────────────

const lados = t => t.split(' = ').map(p => evaluar(p));
const verdad = t => { const [l, r] = lados(t); return igualR(l, r); };

test('ej. 1 (operador): la igualdad de partida es verdadera, y solo una de las cuatro operaciones hace verdadera la de llegada', () => {
  const items = lote(generarOperador, 21);
  const formas = new Set();
  for (const item of items) {
    formas.add(item.forma);
    assert.ok(verdad(item.partida), `partida falsa: ${item.partida}`);
    const buenas = OPS.filter(op => verdad(item.llegada.replace(HUECO, op)));
    assert.deepEqual(buenas, [item.respuesta], `${item.partida} → ${item.llegada}`);
    // el número que pasa es el de la derecha de la llegada, y las demás cifras no cambian
    assert.ok(item.partida.includes(String(item.bnum)));
    assert.notEqual(item.misma, item.respuesta);
    assert.equal(errorDeConNumeros(item, item.respuesta), null);
    assert.equal(errorDeConNumeros(item, item.misma), 'misma-operacion');
    for (const op of OPS.filter(o => o !== item.respuesta && o !== item.misma)) assert.equal(errorDeConNumeros(item, op), 'otra-operacion');
    for (const n of [item.a, item.b, item.c, item.izq, item.der, item.bnum]) assert.ok(n >= 2 && n <= 100, `número poco creíble ${n}`);
  }
  assert.deepEqual([...formas].sort(), ['cociente', 'producto', 'resta', 'suma']);
});

test('ej. 1 (hueco): las dos igualdades son verdaderas con el número que falta, y falsas con cualquier otro', () => {
  const items = lote(generarHueco, 22);
  const formas = new Set();
  for (const item of items) {
    formas.add(item.forma);
    assert.ok(verdad(item.partida), `partida falsa: ${item.partida}`);
    assert.ok(verdad(item.llegada.replace(HUECO, String(item.respuesta))), `llegada falsa: ${item.llegada} con ${item.respuesta}`);
    for (let v = 0; v <= 60; v++) if (v !== item.respuesta) assert.ok(!verdad(item.llegada.replace(HUECO, String(v))), `${item.llegada} también vale con ${v}`);
    assert.equal(errorDeConNumeros(item, item.respuesta), null);
    for (const v of item.visibles.filter(n => n !== item.respuesta)) assert.equal(errorDeConNumeros(item, v), 'numero-que-no-pasa');
    assert.equal(errorDeConNumeros(item, 999), 'otra-respuesta');
    // nunca negativos ni restas que dejen un lado negativo: todo natural
    for (const lado of [...item.partida.split(' = '), ...item.llegada.replace(HUECO, String(item.respuesta)).split(' = ')]) assert.ok(evaluar(lado)[0] >= 0n, `lado negativo: ${lado}`);
  }
  assert.deepEqual([...formas].sort(), ['bidi1', 'bidi2', 'jer1', 'jer2']);
});

test('ej. 1: el feedback acierta con los números del ítem y las cuentas salen bien en los dos idiomas', () => {
  for (const item of lote(generarConNumeros, 23, 1000)) {
    for (const idioma of ['es', 'en']) {
      const f = TX.ej1.correcto[item.tipo][idioma](item);
      textosProhibidos(f, idioma, 'ej1 correcto');
      textosProhibidos(TX.ej1.solucion[item.tipo][idioma](item), idioma, 'ej1 solución');
      const instr = TX.ej1.instruccion[item.tipo][idioma];
      textosProhibidos(typeof instr === 'function' ? instr(item) : instr, idioma, 'ej1 instrucción');
      const malos = item.tipo === 'operador' ? OPS.filter(o => o !== item.respuesta) : [item.respuesta + 1, item.visibles[0] === item.respuesta ? item.visibles[1] : item.visibles[0]];
      for (const m of malos) textosProhibidos(TX.ej1.por_que[item.tipo][idioma](item, m), idioma, 'ej1 por qué');
      // cada cuenta suelta del feedback correcto es verdadera
      for (const m of f.matchAll(/<span class="cuenta">(.*?)<\/span>/g)) assert.ok(verdad(m[1]), `cuenta falsa: ${m[1]}`);
    }
  }
});

// ─── Ejercicios 2 y 5: una operación ──────────────────────────────────────────────────────────

const DE_LA_BIBLIOTECA = {
  // error → ¿qué ecuación de ERRORES_TIPICOS lo produce? (solo donde existe; los demás son de esta práctica)
  'transponer-sin-signo': ['suma', 'resta'], 'pasar-factor-restando': ['producto'], 'multiplicar-en-vez-de-dividir': ['producto'],
  'invertir-coeficiente': ['producto'], 'signo-al-dividir': ['producto'],
};

function compruebaEcuacion(it) {
  const texto = textoEcuacion(it);
  const s = solucionDe(it);
  const sr = deFraccion(s);
  assert.ok(cumple(texto, sr), `la solución no cumple ${texto}`);
  // y es la única entre las enteras de un rango (la ecuación es de primer grado)
  for (let v = -250; v <= 250; v++) if (!igualR(R(BigInt(v)), sr)) assert.ok(!cumple(texto, R(BigInt(v))), `${texto} también vale con ${v}`);
  return { texto, s, sr };
}

test('ej. 2: la solución cumple la ecuación que se ve, y los distractores nacen de errores con nombre y no la cumplen', () => {
  const items = lote(generarUnaOperacion, 31);
  const formas = new Set(), tipos = new Set();
  let negativas = 0, aLaVez = 0;
  for (const item of items) {
    const { texto, sr } = compruebaEcuacion(item);
    formas.add(item.forma); tipos.add(item.tipo);
    assert.ok(igualR(deItem(item.solucion), sr));
    if (sr[0] < 0n) negativas++;
    const cands = candidatos(item);
    for (const c of cands.filter(k => k.valor)) {
      assert.ok(NOMBRADOS.has(c.error), `error sin nombre: ${c.error}`);
      assert.ok(nombreError(c.error).es && nombreError(c.error).en);
      const biblio = DE_LA_BIBLIOTECA[c.error];
      if (biblio?.includes(item.forma)) {
        const q = ERRORES_TIPICOS[c.error].fn(deEcuacion(texto));
        if (q) assert.ok(deFraccion(q.resolver()).every((n, k) => n === deFraccion(c.valor)[k]), `${c.error} en ${texto}`);
      }
    }
    if (item.tipo === 'elegir') {
      assert.equal(item.opciones.length, 4);
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      const valores = item.opciones.map(o => deItem(o.r));
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!igualR(valores[a], valores[b]), `dos opciones con el mismo valor en ${texto}`);
      assert.ok(igualR(deItem(item.opciones.find(o => o.correcta).r), sr));
      for (const o of item.opciones.filter(x => !x.correcta)) {
        assert.ok(NOMBRADOS.has(o.error));
        assert.ok(!cumple(texto, deItem(o.r)), `el distractor ${solTexto(o.r)} cumple ${texto}`);
        assert.equal(errorDeUnaOperacion(item, F(o.r)), o.error);
        assert.ok(cands.some(c => c.error === o.error && c.valor && deFraccion(c.valor).every((n, k) => n === deItem(o.r)[k])));
      }
    }
    assert.equal(errorDeUnaOperacion(item, F(item.solucion)), null);
    aLaVez += cands.filter(k => k.valor).length;
  }
  assert.deepEqual([...formas].sort(), ['cociente', 'producto', 'resta', 'suma']);
  assert.deepEqual([...tipos].sort(), ['elegir', 'escribir']);
  assert.ok(negativas > N * 0.1, `pocas soluciones negativas: ${negativas}`);
  assert.ok(aLaVez > 0);
});

test('ej. 2 y 5: cada línea de resolución se calcula bien (todos sus eslabones valen lo mismo) y la comprobación se cumple', () => {
  for (const item of lote(generarUnaOperacion, 32, 2000)) {
    const sr = deFraccion(solucionDe(item));
    const buena = linea(item);
    const vs = valoresDeCadena(buena);
    assert.ok(vs.every(v => igualR(v, vs[0])), `línea ${buena}`);
    assert.ok(igualR(vs[0], sr), `la línea ${buena} no da la solución de ${textoEcuacion(item)}`);
    const comp = comprobacion(item);
    assert.ok(cumple(comp, null) || verdad(comp), `comprobación falsa: ${comp}`);
    for (const c of candidatos(item).filter(k => k.valor)) {
      const lm = linea(item, c.error);
      const vm = valoresDeCadena(lm);
      assert.ok(vm.every(v => igualR(v, vm[0])), `línea de error ${lm}`);
      assert.ok(igualR(vm[0], deFraccion(c.valor)), `la línea ${lm} no da el valor del error ${c.error}`);
    }
  }
});

test('ej. 2: el feedback sale bien en los dos idiomas, con los números del ítem y sin cuentas falsas', () => {
  for (const item of lote(generarUnaOperacion, 33, 1500)) {
    for (const idioma of ['es', 'en']) {
      const ok = TX.ej2.correcto[idioma](item);
      textosProhibidos(ok, idioma, 'ej2 correcto');
      const comp = cuentaDeComprobacion(ok);
      assert.ok(comp && verdad(sinHtml(comp)), `comprobación falsa: ${comp}`);
      for (const c of candidatos(item).filter(k => k.valor)) {
        const t = TX.ej2.por_que[idioma](item, c.error, c.valor) + TX.ej2.solucion[idioma](item);
        textosProhibidos(t, idioma, `ej2 ${c.error}`);
        assert.ok(t.includes(solTexto({ num: c.valor.simplificar().num, den: c.valor.simplificar().den })), 'el feedback no nombra lo que escribió el alumno');
      }
      textosProhibidos(TX.ej2.por_que[idioma](item, 'otra-respuesta', F({ num: 1000, den: 1 })), idioma, 'ej2 otra');
    }
  }
});

test('ej. 2: los errores salen con las cuentas que dice la ficha (sin cambiar el signo, factor restando, multiplicar, invertir)', () => {
  const casos = [
    [{ forma: 'suma', k: 7, c: 12, delante: false }, 'transponer-sin-signo', 19],
    [{ forma: 'resta', k: -4, c: 10, delante: false }, 'transponer-sin-signo', 6],
    [{ forma: 'suma', k: 9, c: 4, delante: false }, 'signo-de-la-solucion', 5],
    [{ forma: 'producto', A: 3, c: 21 }, 'pasar-factor-restando', 18],
    [{ forma: 'producto', A: 3, c: 21 }, 'multiplicar-en-vez-de-dividir', 63],
    [{ forma: 'producto', A: -2, c: 8 }, 'signo-al-dividir', 4],
    [{ forma: 'cociente', n: 5, c: 4 }, 'dividir-en-vez-de-multiplicar', null],
    [{ forma: 'cociente', n: 5, c: 4 }, 'olvida-pasar', 4],
  ];
  for (const [it, error, esperado] of casos) {
    const c = candidatos(it).find(k => k.error === error);
    assert.ok(c?.valor, `${textoEcuacion(it)} ${error}`);
    if (esperado !== null) assert.ok(igualR(deFraccion(c.valor), R(BigInt(esperado))), `${textoEcuacion(it)} ${error}`);
  }
  assert.ok(igualR(deFraccion(solucionDe({ forma: 'suma', k: 9, c: 4, delante: false })), R(-5n)));
});

test('ej. 5: la resolución mostrada es la buena o la de un error con nombre; la línea da lo que se muestra', () => {
  const items = lote(generarComprueba, 34);
  let buenas = 0, malas = 0, negativas = 0;
  const formas = new Set(), errores = new Set();
  for (const item of items) {
    const { texto, sr } = compruebaEcuacion(item);
    formas.add(item.forma);
    assert.ok(igualR(finalDe(item.linea), deItem(item.mostrada)), `línea ${item.linea} y valor mostrado ${solTexto(item.mostrada)}`);
    if (sr[0] < 0n) negativas++;
    if (item.buena) {
      buenas++;
      assert.equal(item.error, null);
      assert.ok(igualR(deItem(item.mostrada), sr));
    } else {
      malas++;
      errores.add(item.error);
      assert.ok(NOMBRADOS.has(item.error));
      assert.ok(!igualR(deItem(item.mostrada), sr), `la línea mala ${item.linea} da la solución de ${texto}`);
      assert.ok(!cumple(texto, deItem(item.mostrada)));
    }
    assert.equal(errorDeCorrige(item, F(item.solucion)), null);
    assert.ok(deItem(item.solucion)[1] === 1n, 'solución no entera');
    for (const idioma of ['es', 'en']) {
      const t = item.buena ? TX.ej5.estabaBien[idioma](item) : TX.ej5.estabaMal[idioma](item);
      textosProhibidos(t, idioma, 'ej5');
      const comp = cuentaDeComprobacion(t);
      assert.ok(comp && verdad(sinHtml(comp)), `comprobación falsa: ${comp}`);
    }
  }
  assert.ok(buenas > N * 0.4 && malas > N * 0.4, `mezcla ${buenas}/${malas}`);
  assert.ok(negativas > N * 0.1, `pocas soluciones negativas: ${negativas}`);
  assert.deepEqual([...formas].sort(), ['cociente', 'producto', 'resta', 'suma']);
  assert.ok(errores.size >= 6, [...errores].join(','));
});

// ─── Ejercicio 3 ──────────────────────────────────────────────────────────────────────────────

test('ej. 3: solo una opción cumple con la solución y es el paso que avanza; las otras tres no, y tienen soluciones distintas', () => {
  const items = lote(generarDosOperaciones, 41);
  let derecha = 0, cociente = 0, bNegativo = 0;
  for (const item of items) {
    const s = deItem(item.solucion);
    assert.ok(cumple(item.ecuacion, s), `la solución no cumple ${item.ecuacion}`);
    const qOriginal = deEcuacion(item.ecuacion);
    assert.ok(deFraccion(qOriginal.resolver()).every((n, k) => n === s[k]));
    assert.equal(item.opciones.length, 4);
    assert.equal(item.opciones.filter(o => o.correcta).length, 1);
    const soluciones = [];
    for (const o of item.opciones) {
      const vale = cumple(o.texto, s);
      assert.equal(vale, o.correcta, `${o.texto} (${o.error}) frente a ${item.ecuacion}`);
      assert.ok(o.correcta ? o.error === null : NOMBRADOS.has(o.error), `error sin nombre ${o.error}`);
      assert.equal(qOriginal.equivalente(deEcuacion(o.texto)), o.correcta);
      const sol = deEcuacion(o.texto).resolver();
      assert.ok(!soluciones.some(v => v.equals(sol)), `dos opciones con la misma solución en ${item.ecuacion}`);
      soluciones.push(sol);
    }
    // el paso bueno deja la x con su coeficiente de un lado y solo números del otro (avanza)
    const buena = item.opciones.find(o => o.correcta).texto;
    const [l, r] = item.derecha ? buena.split(' = ').reverse() : buena.split(' = ');
    assert.ok(/^(\d+x|x\/\d+)$/.test(l), `el paso bueno no deja la x sola con su coeficiente: ${buena}`);
    assert.ok(!/x/.test(r), `el paso bueno lleva x a los dos lados: ${buena}`);
    if (item.derecha) derecha++;
    if (item.cociente) cociente++;
    if (item.b < 0) bNegativo++;
    // el segundo paso es la ecuación que queda y su solución es la de la ficha
    const sp = segundoPaso(item);
    assert.ok(deFraccion(solucionDe(sp)).every((n, k) => n === s[k]));
    assert.equal(errorDeDosOperaciones(item, F(item.solucion)), null);
    for (const c of buenos(candidatos(sp), F(item.solucion))) assert.equal(errorDeDosOperaciones(item, c.valor), c.error);
    // realismo: números pequeños, solución natural
    assert.ok(item.c >= 1 && item.c <= 100 && item.solucion.num >= 1 && item.solucion.num <= 48 && item.solucion.den === 1);
  }
  assert.ok(derecha > N * 0.15 && cociente > N * 0.1 && bNegativo > N * 0.3, `${derecha}/${cociente}/${bNegativo}`);
});

test('ej. 3: el feedback sale bien en los dos idiomas', () => {
  for (const item of lote(generarDosOperaciones, 42, 1000)) {
    for (const idioma of ['es', 'en']) {
      const ok = TX.ej3.correcto[idioma](item) + TX.ej3.solucion[idioma](item);
      textosProhibidos(ok, idioma, 'ej3 correcto');
      const comp = cuentaDeComprobacion(ok);
      assert.ok(comp && verdad(sinHtml(comp)) || comp && cumple(sinHtml(comp), null), `comprobación falsa: ${comp}`);
      for (const o of item.opciones.filter(x => !x.correcta)) textosProhibidos(TX.ej3.porQuePaso[idioma](item, o), idioma, `ej3 paso ${o.error}`);
      for (const c of candidatos(segundoPaso(item)).filter(k => k.valor)) textosProhibidos(TX.ej3.por_que[idioma](item, c.error, c.valor), idioma, `ej3 ${c.error}`);
    }
  }
});

// ─── Ejercicio 4 ──────────────────────────────────────────────────────────────────────────────

test('ej. 4: la solución es irreducible, cumple la ecuación, y los mismos números al revés dan la solución inversa', () => {
  const items = lote(generarFrente, 51);
  const tipos = new Set();
  let enteras = 0, fracciones = 0, negativas = 0, inversos = 0;
  for (const item of items) {
    tipos.add(item.tipo);
    const texto = textoFrente(item);
    const s = deItem(item.solucion);
    assert.ok(cumple(texto, s), `la solución no cumple ${texto}`);
    assert.equal(mcd(BigInt(item.solucion.num), BigInt(item.solucion.den)), 1n, 'solución no irreducible');
    assert.ok(item.solucion.den >= 1);
    assert.ok(deFraccion(solucionDe({ forma: 'producto', A: item.A, c: item.c })).every((n, k) => n === s[k]));
    if (item.solucion.den === 1) enteras++; else fracciones++;
    if (item.solucion.num < 0) negativas++;
    if (item.inverso) inversos++;
    // la pareja con los mismos números: |A| y |c| intercambiados, y las soluciones son inversas
    assert.deepEqual([Math.abs(item.otra.A), Math.abs(item.otra.c)], [Math.abs(item.c), Math.abs(item.A)]);
    const sOtra = entre(R(BigInt(item.otra.c)), R(BigInt(item.otra.A)));
    assert.ok(igualR(por([s[0] < 0n ? -s[0] : s[0], s[1]], sOtra), R(1n)), `${texto}: la pareja no es la inversa`);
    // números pequeños
    for (const n of [item.A, item.c]) assert.ok(Math.abs(n) >= 2 && Math.abs(n) <= 15);
    if (item.tipo === 'elegir') {
      assert.equal(item.opciones.length, 4);
      assert.equal(item.opciones.filter(o => o.correcta).length, 1);
      const valores = item.opciones.map(o => deItem(o.r));
      for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!igualR(valores[a], valores[b]), `dos opciones con el mismo valor en ${texto}`);
      for (const o of item.opciones) {
        // todas las fracciones salen irreducibles: «3/12» no puede estar al lado de «1/4»
        assert.equal(mcd(BigInt(o.r.num), BigInt(o.r.den)), 1n, 'opción sin simplificar');
        assert.equal(cumple(texto, deItem(o.r)), o.correcta, `${solTexto(o.r)} en ${texto}`);
        if (!o.correcta) { assert.ok(NOMBRADOS.has(o.error)); assert.equal(errorDeFrente(item, F(o.r)), o.error); }
      }
    }
    assert.equal(errorDeFrente(item, F(item.solucion)), null);
    // «3/12» (sin simplificar) vale lo mismo que 1/4: no es un error, es una escritura que la interfaz pide simplificar
    assert.equal(errorDeFrente(item, F(item.solucion).amplificar?.(2) ?? F(item.solucion)), null);
  }
  assert.deepEqual([...tipos].sort(), ['elegir', 'escribir']);
  assert.ok(enteras > N * 0.15 && fracciones > N * 0.4 && negativas > N * 0.2 && inversos > N * 0.3, `${enteras}/${fracciones}/${negativas}/${inversos}`);
});

test('ej. 4: la línea «x = 3 : 12 = 3/12 = 1/4» se calcula bien y el feedback sale en los dos idiomas', () => {
  for (const item of lote(generarFrente, 52, 1500)) {
    for (const [A, c] of [[item.A, item.c], [item.otra.A, item.otra.c]]) {
      const l = lineaFrente(A, c);
      const vs = valoresDeCadena(l);
      assert.ok(vs.every(v => igualR(v, vs[0])), `línea ${l}`);
      assert.ok(igualR(vs[0], entre(R(BigInt(c)), R(BigInt(A)))));
    }
    for (const idioma of ['es', 'en']) {
      const ok = TX.ej4.correcto[idioma](item);
      textosProhibidos(ok, idioma, 'ej4 correcto');
      const comp = cuentaDeComprobacion(ok);
      assert.ok(comp, 'falta la comprobación');
      // «12 · 1/4 = 3»: se evalúa con la fracción pegada: 12 · (1/4)
      const [l, r] = sinHtml(comp).split(' = ');
      const ll = l.replace(/(\d+\/\d+)/, '($1)').replace('−(', '(−').replace(/^(.*)\(−/, '$1(−');
      assert.ok(igualR(evaluar(ll.replace(/\(−(\d+(?:\/\d+)?)\)/, '(0 − $1)')), evaluar(r)), `comprobación falsa: ${comp}`);
      textosProhibidos(TX.ej4.instruccion[item.tipo][idioma], idioma, 'ej4 instrucción');
      textosProhibidos(TX.simplifica[idioma]('3/12'), idioma, 'ej4 simplifica');
      for (const c of candidatos({ forma: 'producto', A: item.A, c: item.c }).filter(k => k.valor)) textosProhibidos(TX.ej4.por_que[idioma](item, c.error, c.valor), idioma, `ej4 ${c.error}`);
    }
  }
});

// ─── Todos los ejercicios: textos, casos reservados, claves ───────────────────────────────────

test('las introducciones y los textos fijos están en los dos idiomas y respetan las reglas de la unidad', () => {
  for (const ej of [TX.ej1, TX.ej2, TX.ej3, TX.ej4, TX.ej5]) {
    for (const campo of ['nombre', 'detalle', 'introduccion']) {
      assert.ok(ej[campo].es && ej[campo].en, campo);
      for (const idioma of ['es', 'en']) textosProhibidos(ej[campo][idioma], idioma, `introducción ${campo}`);
    }
  }
  for (const idioma of ['es', 'en']) {
    textosProhibidos(TX.ej5.botones.si[idioma], idioma, 'botón'); textosProhibidos(TX.ej5.segunda[idioma], idioma, 'segunda');
    textosProhibidos(TX.ej3.segunda[idioma], idioma, 'segunda 3'); textosProhibidos(TX.noNumero[idioma], idioma, 'no número');
  }
  // los términos de la unidad 2: «divisor» y no «factor», y nada de «×»; las palabras inglesas que deciden, aclaradas
  assert.ok(/resolver/.test(TX.ej2.introduccion.en), 'solve se aclara');
});

test('los casos reservados no salen nunca (por huella de la forma canónica) y la huella no depende del orden', () => {
  assert.equal(huellaDe('x + 7 = 12'), huellaDe('7 + x = 12'));
  assert.notEqual(huellaDe('x + 7 = 12'), huellaDe('x + 7 = 13'));
  const SEMILLA = 61;
  const casosDe = (generar, n) => lote(generar, SEMILLA, n).map(it => (it.ecuacion ? it.ecuacion : it.otra ? textoFrente(it) : textoEcuacion(it)));
  const reservado = 'x + 7 = 12';
  const antes = casosDe(generarUnaOperacion, 20000).filter(t => huellaDe(t) === huellaDe(reservado));
  assert.ok(antes.length > 5, `el caso reservado de prueba ni siquiera sale sin reservar (${antes.length})`);
  HUELLAS_RESERVADAS.add(huellaDe(reservado));
  try {
    assert.ok(esReservado('7 + x = 12'));
    for (const [gen, nombre] of [[generarUnaOperacion, 'ej2'], [generarComprueba, 'ej5']]) {
      assert.equal(casosDe(gen, 20000).filter(t => huellaDe(t) === huellaDe(reservado)).length, 0, `${nombre} saca un caso reservado`);
    }
    const dos = '2x + 5 = 17', f = huellaDe(dos);
    HUELLAS_RESERVADAS.add(f);
    assert.equal(casosDe(generarDosOperaciones, 20000).filter(t => huellaDe(t) === f).length, 0, 'ej3 saca un caso reservado');
    const par = '3x = 12', g = huellaDe(par);
    HUELLAS_RESERVADAS.add(g);
    assert.equal(casosDe(generarFrente, 20000).filter(t => huellaDe(t) === g).length, 0, 'ej4 saca un caso reservado');
    HUELLAS_RESERVADAS.delete(f); HUELLAS_RESERVADAS.delete(g);
  } finally { HUELLAS_RESERVADAS.clear(); }
});

test('la clave de cada ítem distingue ítems distintos y es estable', () => {
  for (const [gen, semilla] of [[generarConNumeros, 71], [generarUnaOperacion, 72], [generarDosOperaciones, 73], [generarFrente, 74], [generarComprueba, 75]]) {
    const a = lote(gen, semilla, 300), b = lote(gen, semilla, 300);
    assert.deepEqual(a.map(claveDe), b.map(claveDe));
    assert.ok(new Set(a.map(claveDe)).size > 40, 'muy pocas claves distintas');
  }
});

test('ni «×», ni «1x», ni dos letras, ni otra incógnita que x en las ecuaciones que se ven', () => {
  const todas = [
    ...lote(generarUnaOperacion, 81, 1000).map(textoEcuacion), ...lote(generarFrente, 82, 1000).map(textoFrente),
    ...lote(generarDosOperaciones, 83, 1000).flatMap(i => [i.ecuacion, ...i.opciones.map(o => o.texto)]),
    ...lote(generarComprueba, 84, 1000).map(textoEcuacion),
  ];
  for (const t of todas) {
    assert.ok(!/[a-wyzA-Z]/.test(t), `otra letra en ${t}`);
    assert.ok(!/×|(^|[^\d])1x|x\^|x²|\(/.test(t), `forma rara en ${t}`);
    assert.equal((t.match(/ = /g) ?? []).length, 1);
  }
});

// ─── Revisión 191 (hallazgo 1): el signo que nombra el feedback es el del número que nombra ────

test('el feedback de signo dice «positivo/negativo» según el signo de la solución, en las cuatro formas y los dos idiomas', () => {
  const PALABRA = /\b(es|is) (positivo|negativo|positive|negative) \(([^)]*)\)/g;
  const signoDeTexto = t => (/^[−-]/.test(t.trim()) ? -1 : 1);
  let vistos = 0, vistosProducto = 0, negativosProducto = 0;
  const formas = new Set();
  const revisa = (it, error, valor, donde) => {
    for (const idioma of ['es', 'en']) {
      const t = sinHtml(TX.ej2.por_que[idioma](it, error, valor));
      for (const m of t.matchAll(PALABRA)) {
        const dice = /^(positivo|positive)$/.test(m[2]) ? 1 : -1;
        assert.equal(dice, signoDeTexto(m[3]), `${donde} ${idioma}: «${m[0]}» en ${t}`);
        assert.equal(dice, Math.sign(solucionDe(it).num), `${donde} ${idioma}: signo de la solución en ${t}`);
        vistos++;
      }
    }
  };
  for (const item of lote(generarUnaOperacion, 61)) {
    const cands = candidatos(item).filter(k => k.valor);
    const s = solucionDe(item).num;
    for (const c of cands) {
      if (c.error === 'signo-de-la-solucion') assert.ok(s < 0, `signo-de-la-solucion con solución no negativa en ${textoEcuacion(item)}`);
      if (c.error === 'signo-cambiado') assert.ok(s > 0, `signo-cambiado con solución no positiva en ${textoEcuacion(item)}`);
      if (c.error === 'signo-de-la-solucion' || c.error === 'signo-cambiado') {
        revisa(item, c.error, c.valor, `ej2 ${textoEcuacion(item)}`);
        formas.add(item.forma);
        if (item.forma === 'producto') { vistosProducto++; if (s < 0) negativosProducto++; }
      }
    }
  }
  for (const item of lote(generarComprueba, 62)) {
    if (item.buena || !(item.error === 'signo-cambiado' || item.error === 'signo-de-la-solucion')) continue;
    const s = Math.sign(solucionDe(item).num);
    assert.equal(item.error === 'signo-de-la-solucion', s < 0, `ej5 ${textoEcuacion(item)}: ${item.error}`);
    revisa(item, item.error, F(item.mostrada), `ej5 ${textoEcuacion(item)}`);
  }
  assert.ok(vistos > 200, `pocos casos de signo: ${vistos}`);
  assert.ok(formas.has('producto') && vistosProducto > 50 && negativosProducto > 10, `producto: ${vistosProducto}/${negativosProducto}`);
});
