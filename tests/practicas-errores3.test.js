// Práctica «Caza el error» de la unidad 3 (PU2, tarea 89): la lógica se prueba por fuerza bruta con
// semillas fijas (3000 ítems por ejercicio). Los valores de cada línea se calculan con un evaluador
// propio (JavaScript), no con las funciones de la práctica ni con `evaluar` de enteros.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { ERRORES_TIPICOS, evaluar } from '../practicas/_comun/enteros.js';
import { CATALOGO } from '../practicas/_comun/catalogo.js';
import * as L from '../practicas/errores3/logica.js';
import { TX, REGLAS } from '../practicas/errores3/textos.js';

const N = 3000;
const generar = (fn, semilla = 17) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => fn(rng)); };

/** Valor de una línea escrita (`−(−8)^2 + 3`), con JavaScript. */
function valor(texto) {
  const t = texto.replace(/−/g, '-').replace(/·/g, '*').replace(/:/g, '/').replace(/(\([^()]*\)|\d+)\^(\d+)/g, 'Math.pow($1,$2)');
  return Function(`"use strict"; return (${t});`)();
}
const signo = n => (n < 0 ? -1 : 1);

/** Índices de las líneas falsas: su valor no es el de la anterior. */
const falsas = lineas => lineas.map((l, i) => (i > 0 && valor(l) !== valor(lineas[i - 1]) ? i : -1)).filter(i => i >= 0);

/** El valor de la línea mala, calculado a mano por plantilla (independiente de ERRORES_TIPICOS). */
const MAL = {
  'regla-signos-en-suma': ([a, b, c]) => -a - b + c,
  'suma-valores-absolutos': ([a, b, c]) => signo(Math.abs(a) >= Math.abs(b) ? a : b) * (Math.abs(a) + Math.abs(b)) + c,
  'olvida-el-signo': ([a, b, c]) => -(a + b) + c,
  'signo-del-primero': ([a, b, c]) => signo(a) * Math.abs(a + b) + c,
  'restar-negativo': ([a, b, c]) => a - Math.abs(b) + c,
  'sumar-negativo': ([a, b, c]) => a + Math.abs(b) + c,
  'opuesto-del-opuesto': ([a, c]) => -a + c,
  'menos-solo-al-primero': ([a, b, c]) => a - b + c,
  'mismo-signo-dos-veces': ([a, p, q]) => a + p * q,
  'signo-del-mayor-producto': ([a, b, c]) => signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a * b) + c,
  'signo-del-mayor-cociente': ([a, b, c]) => signo(Math.abs(a) > Math.abs(b) ? a : b) * Math.abs(a / b) + c,
  'potencia-par-negativa': ([b, n, c]) => -(Math.abs(b) ** n) + c,
  'potencia-impar-positiva': ([b, n, c]) => Math.abs(b) ** n + c,
  'potencia-positiva-negativa': ([b, n, c]) => -(b ** n) + c,
  'base-por-exponente': ([b, n, c]) => b * n + c,
  'menos-en-la-base': ([a, n, c]) => a ** n + c,
  'signos-antes-de-la-potencia': ([b, n, c]) => Math.abs(b) ** n + c,
  'derecha-a-izquierda': ([a, b, c]) => a - (b + c),
  'sin-jerarquia': ([a, b, c, s]) => (a + s * b) * c,
};

/** Todas las líneas que ve el alumno: las del cálculo (ej. 2 y 3) o las de todas las columnas (ej. 1). */
const lineasDe = item => (item.columnas ? item.columnas.flatMap(c => c.lineas) : item.lineas);

test('textos de la lógica: evaluador propio y evaluador de la base coinciden en las líneas', () => {
  for (const item of [...generar(L.generarDonde), ...generar(L.generarSiNo, 3)].slice(0, 2000)) {
    for (const l of lineasDe(item)) assert.equal(valor(l), evaluar(l), l);
  }
});

test('hay una plantilla por cada error del banco y cada una sale en grupo', () => {
  assert.equal(L.PLANTILLAS.length, 19);
  for (const p of L.PLANTILLAS) {
    assert.ok(ERRORES_TIPICOS[p.error], p.error);
    assert.ok(L.GRUPO_DE[p.error], `${p.error} sin grupo`);
    assert.ok(MAL[p.error], `${p.error} sin comprobación a mano`);
    assert.equal(p.id, p.error);
  }
  const enGrupos = Object.values(L.GRUPOS).flat();
  assert.equal(new Set(enGrupos).size, enGrupos.length, 'un error en dos grupos');
  assert.deepEqual([...enGrupos].sort(), L.PLANTILLAS.map(p => p.error).sort());
  for (const v of L.VALIDAS) assert.ok(ERRORES_TIPICOS[v.parecido], `${v.id}: parecido ${v.parecido}`);
});

// ─── Ejercicio 1 en columnas (JL, 22-11) ────────────────────────────────────────

test('ejercicio 1: 2-4 columnas que empiezan por el enunciado; 1-2 bien (todas sus líneas verdaderas) y 1-2 con UNA línea falsa', () => {
  const combinaciones = {}, familias = new Set();
  for (const item of generar(L.generarDonde)) {
    assert.equal(item.tipo, 'donde');
    familias.add(item.plantilla);
    const { columnas } = item;
    assert.ok(columnas.length >= 2 && columnas.length <= 4, columnas.length);
    const bien = columnas.filter(c => !c.error), mal = columnas.filter(c => c.error);
    assert.ok(bien.length >= 1 && bien.length <= 2 && mal.length >= 1 && mal.length <= 2, `${bien.length} bien, ${mal.length} mal`);
    combinaciones[`${bien.length}+${mal.length}`] = (combinaciones[`${bien.length}+${mal.length}`] ?? 0) + 1;
    assert.equal(new Set(mal.map(c => c.error)).size, mal.length, 'dos columnas con el mismo error');
    assert.equal(new Set(columnas.map(c => c.lineas.join('|'))).size, columnas.length, 'dos columnas iguales');
    for (const c of columnas) {
      assert.equal(c.lineas[0], item.enunciado, 'todas empiezan por el enunciado');
      assert.ok(c.lineas.length >= 3, c.lineas.join(' | '));
      assert.deepEqual(falsas(c.lineas), c.error ? [c.falsa] : [], `${c.ruta}: ${c.lineas.join(' | ')}`);
      if (c.error) assert.ok(c.falsa >= 1, 'el enunciado nunca es la línea mala');
      assert.match(c.lineas.at(-1), /^−?\d+$/, 'la última línea es el resultado');
    }
    // Todas las columnas acaban en el mismo número si están bien, y las malas en otro.
    const buenas = new Set(bien.map(c => valor(c.lineas.at(-1))));
    assert.equal(buenas.size, 1);
    for (const c of mal) assert.ok(!buenas.has(valor(c.lineas.at(-1))), `${c.ruta}: la columna mala acaba en el resultado bueno`);
    assert.deepEqual(item.solucion, columnas.map(c => c.falsa));
  }
  assert.equal(familias.size, L.FAMILIAS.length, 'salen todas las familias');
  for (const k of ['1+1', '1+2', '2+1', '2+2']) assert.ok(combinaciones[k] > N * 0.02, `combinación ${k}: ${combinaciones[k]}`);
  assert.ok((N - combinaciones['1+1']) > N * 0.3, `con 3 o 4 columnas: ${N - combinaciones['1+1']} de ${N}`);
});

test('ejercicio 1: la línea mala vale lo que dice el error típico y la corrección vale lo de la línea anterior', () => {
  for (const item of generar(L.generarDonde, 29)) {
    for (const c of item.columnas.filter(c => c.error)) {
      const { corregida } = L.explicaColumna(c);
      assert.equal(valor(corregida), valor(c.lineas[c.falsa - 1]), `${c.ruta}: corregida`);
      assert.notEqual(valor(corregida), valor(c.lineas[c.falsa]));
      if (c.ruta === c.error) assert.equal(valor(c.lineas[c.falsa]), MAL[c.error](c.params), `${c.error}: ${c.lineas.join(' | ')}`);
    }
  }
});

test('ejercicio 1: el fallo de cuenta (sin nombre), como mucho uno por ítem, cerca del bueno y nunca un error con nombre', () => {
  let conCuenta = 0;
  for (const item of generar(L.generarDonde, 31)) {
    const cuentas = item.columnas.filter(c => c.error === L.CUENTA);
    assert.ok(cuentas.length <= 1);
    if (!cuentas.length) continue;
    conCuenta++;
    const [c] = cuentas;
    assert.equal(c.falsa, c.lineas.length - 1, 'la última cuenta');
    const bien = valor(c.lineas[c.falsa - 1]), mal = valor(c.lineas[c.falsa]);
    assert.ok([1, 2, 10].includes(Math.abs(mal - bien)), `${bien} → ${mal}`);
    assert.notEqual(mal, -bien, 'no es el signo cambiado');
    // No coincide con el resultado de ninguna otra columna ni con los errores de signos aplicados a esa última cuenta.
    for (const o of item.columnas) if (o !== c) assert.notEqual(valor(o.lineas.at(-1)), mal, `${c.lineas.join(' | ')}`);
    const m = /^(−?\d+) ([+−]) (\d+)$/.exec(c.lineas[c.falsa - 1]);
    if (m) {
      const a = Number(m[1].replace('−', '-')), b = (m[2] === '−' ? -1 : 1) * Number(m[3]);
      const SUMAS = { 'regla-signos-en-suma': (x, y) => x < 0 && y < 0, 'suma-valores-absolutos': (x, y) => x < 0 !== y < 0, 'olvida-el-signo': (x, y) => x + y < 0, 'signo-del-primero': () => true };
      for (const [id, vale] of Object.entries(SUMAS)) if (vale(a, b)) assert.notEqual(MAL[id]([a, b, 0]), mal, `${a} ${b}: ${id}`);
    }
    // Sale de una ruta buena que no está en el ítem: no es un calco de otra columna.
    for (const o of item.columnas) if (o !== c) assert.notDeepEqual(o.lineas.slice(0, -1), c.lineas.slice(0, -1));
  }
  assert.ok(conCuenta > N * 0.08, `con fallo de cuenta: ${conCuenta} de ${N}`);
});

test('ejercicio 1: el ejemplo de Juan Luis, 5 − (3 − 7), sale con sus cuatro columnas', () => {
  const fa = L.FAMILIA_POR_ID.parentesis;
  const { bien, mal } = L.columnasPosibles(fa, [5, 3, -7]);
  assert.deepEqual(bien.map(c => c.lineas.slice(1)), [['5 − 3 + 7', '2 + 7', '9'], ['5 − (−4)', '5 + 4', '9']]);
  assert.deepEqual(mal.map(c => [c.error, c.lineas.slice(1)]), [['menos-solo-al-primero', ['5 − 3 − 7', '2 − 7', '−5']], ['restar-negativo', ['5 − (−4)', '5 − 4', '1']]]);
});

test('ejercicio 1: una pregunta por columna mala, con el nombre bueno y dos de otro grupo (regla de oro)', () => {
  for (const item of generar(L.generarDonde, 30)) {
    // Solo las columnas con un error con nombre llevan pregunta; la del fallo de cuenta, no (JL, 23-11).
    const malas = item.columnas.map((c, j) => (c.error && c.error !== L.CUENTA ? j : -1)).filter(j => j >= 0);
    assert.deepEqual(item.preguntas.map(q => q.col), malas);
    assert.ok(malas.length >= 1, 'siempre hay al menos un error con nombre');
    for (const q of item.preguntas) {
      const c = item.columnas[q.col];
      assert.equal(q.solucion, c.error);
      assert.equal(q.opciones.length, 3);
      assert.equal(new Set(q.opciones).size, 3);
      assert.ok(q.opciones.includes(c.error));
      for (const o of q.opciones) if (o !== c.error) assert.notEqual(L.GRUPO_DE[o], L.GRUPO_DE[c.error], `${o} y ${c.error}, mismo grupo`);
    }
  }
});

test('ejercicio 2: tres errores distintos, el del ítem y dos de otro grupo', () => {
  const items = generar(L.generarCual);
  for (const item of items) {
    assert.equal(item.tipo, 'cual');
    assert.equal(item.opciones.length, 3);
    assert.equal(new Set(item.opciones).size, 3);
    assert.ok(item.opciones.includes(item.solucion));
    assert.equal(item.solucion, item.error);
    assert.deepEqual(falsas(item.lineas), [item.falsa]);
    for (const id of item.opciones) {
      assert.ok(ERRORES_TIPICOS[id], id);
      if (id !== item.error) assert.notEqual(L.GRUPO_DE[id], L.GRUPO_DE[item.error], `${id} frente a ${item.error}`);
    }
    // Los nombres son frases distintas, en los dos idiomas.
    for (const idioma of ['es', 'en']) {
      assert.equal(new Set(item.opciones.map(id => ERRORES_TIPICOS[id].nombre[idioma])).size, 3);
    }
  }
  // La respuesta buena sale en las tres posiciones.
  for (const i of [0, 1, 2]) assert.ok(items.some(it => it.opciones[i] === it.solucion), `posición ${i}`);
});

test('ejercicio 2: ninguna de las otras dos opciones describe también el cálculo (grupos, y casos que la ficha cita)', () => {
  // −2 − 3 = 5 no se explica con «sumar un negativo» ni «restar un negativo»: son del grupo de los paréntesis con negativos.
  for (const id of ['sumar-negativo', 'restar-negativo']) assert.notEqual(L.GRUPO_DE[id], L.GRUPO_DE['regla-signos-en-suma']);
  // 3 − (−2) = 3 − 2 es también «olvidar que el opuesto de un negativo es positivo»: mismo grupo.
  assert.equal(L.GRUPO_DE['restar-negativo'], L.GRUPO_DE['opuesto-del-opuesto']);
  // Pares que dan el mismo valor con otros números (ver ENTREGA de la 79): mismo grupo, nunca enfrentados.
  assert.equal(L.GRUPO_DE['olvida-el-signo'], L.GRUPO_DE['signo-del-primero']);
  assert.equal(L.GRUPO_DE['menos-solo-al-primero'], L.GRUPO_DE['restar-negativo']);
  // −3² = 9 y −(−3)² = 9 se explican de forma parecida: mismo grupo.
  assert.equal(L.GRUPO_DE['menos-en-la-base'], L.GRUPO_DE['signos-antes-de-la-potencia']);
  // El signo del mayor en un producto y «el signo del primero» en una suma: mismo grupo.
  assert.equal(L.GRUPO_DE['signo-del-mayor-producto'], L.GRUPO_DE['signo-del-primero']);
});

test('ejercicio 3: mitad y mitad; los «está bien» tienen todas las líneas verdaderas y los «error», exactamente una falsa', () => {
  const items = generar(L.generarSiNo);
  let bien = 0;
  const vistas = new Set();
  for (const item of items) {
    assert.equal(item.tipo, 'si-no');
    assert.deepEqual(item.opciones, ['bien', 'error']);
    if (item.solucion === 'bien') {
      bien++;
      assert.equal(item.falsa, null);
      assert.equal(item.error, null);
      assert.deepEqual(falsas(item.lineas), [], item.lineas.join(' | '));
      assert.ok(L.VALIDA_POR_ID[item.plantilla]);
    } else {
      assert.equal(item.solucion, 'error');
      assert.deepEqual(falsas(item.lineas), [item.falsa], item.lineas.join(' | '));
    }
    vistas.add(item.plantilla);
  }
  assert.ok(bien > N * 0.46 && bien < N * 0.54, `bien: ${bien}`);
  assert.equal(vistas.size, L.PLANTILLAS.length + L.VALIDAS.length);
});

test('todos los ítems: lo que ve el alumno respeta las reglas de la unidad', () => {
  const items = [...generar(L.generarDonde, 41), ...generar(L.generarCual, 42), ...generar(L.generarSiNo, 43)];
  for (const item of items) {
    for (const l of lineasDe(item)) {
      // Solo cifras, + − · : ( ) ^ y espacios; el menos es U+2212; nada de letras, decimales ni corchetes.
      assert.match(l, /^[\d\s+−·:()^]+$/, l);
      assert.doesNotMatch(l, /^\+|\(\+|--|−\s*−|\+\s*−|·\s*−|:\s*−/, `signos seguidos o + al empezar: ${l}`);
      // Ningún número fuera de lo creíble para un ejercicio de papel: hasta 300 en valor absoluto.
      for (const n of l.match(/\d+/g)) assert.ok(Number(n) <= 300, l);
      assert.ok(Math.abs(valor(l)) <= 300, l);
    }
  }
});

test('todos los textos, en los dos idiomas: sin ×, sin guion como menos, sin (+', () => {
  const textos = [];
  const recoger = t => { for (const idioma of ['es', 'en']) textos.push(typeof t[idioma] === 'function' ? t[idioma](3) : t[idioma]); };
  for (const grupo of ['nombre', 'detalle', 'instruccion', 'introduccion']) for (const t of Object.values(TX[grupo])) recoger(t);
  for (const clave of ['bien', 'error', 'esta_bien', 'la_linea_es', 'comprobar', 'col_bien', 'col_mal', 'columna', 'pregunta_col', 'fallo_cuenta']) recoger(TX[clave]);
  for (const r of Object.values(REGLAS)) recoger(r);
  for (const item of generar(L.generarDonde, 44).slice(0, 500)) for (const c of item.columnas) {
    const { porque, corregida } = L.explicaColumna(c);
    recoger(porque);
    if (corregida && c.error !== L.CUENTA) textos.push(corregida);   // la del fallo de cuenta es solo el número
  }
  for (const e of Object.values(ERRORES_TIPICOS)) recoger(e.nombre);
  const rng = crearRng(5);
  for (const p of L.PLANTILLAS) for (let i = 0; i < 300; i++) {
    const params = L.PLANTILLA_POR_ID[p.id].numeros(rng);
    if (params) { recoger(p.porque(params)); textos.push(p.corregida(params)); }
  }
  for (const v of L.VALIDAS) for (let i = 0; i < 300; i++) {
    const params = v.numeros(rng);
    if (params) {
      const t = v.porque(params);
      recoger(t);
      assert.match(t.es, /^Está bien/);
      assert.match(t.en, /^It is right/);
    }
  }
  for (const t of textos) {
    assert.ok(t && t.length > 3);
    assert.doesNotMatch(t, /×/, t);
    assert.doesNotMatch(t, /\(\+/, t);
    assert.doesNotMatch(t, /(^|[\s(])-\d/, `guion como menos: ${t}`);
    assert.doesNotMatch(t, /\d-\d|\s-\s/, `guion entre números: ${t}`);
  }
});

test('ejercicio 3: las parejas válidas explican con los números del ítem', () => {
  for (const item of generar(L.generarSiNo, 77)) {
    if (item.solucion !== 'bien') continue;
    const texto = L.VALIDA_POR_ID[item.plantilla].porque(item.params);
    assert.ok(/\d/.test(texto.es) && /\d/.test(texto.en), item.plantilla);
    // El texto cita algún número de los desarrollos (los del paso que explica), en los dos idiomas.
    const citados = item.lineas.slice(1).flatMap(l => l.match(/\d+/g));
    assert.ok(citados.some(v => texto.es.includes(v) && texto.en.includes(v)), `${item.plantilla}: ${texto.es} / ${item.lineas.join(' | ')}`);
  }
});

test('claveItem distingue los ítems y el catálogo declara 3 ejercicios', () => {
  const [a, b] = generar(L.generarDonde, 9);
  assert.equal(L.claveItem(a), L.claveItem(a));
  assert.notEqual(L.claveItem(a), L.claveItem({ ...b, params: [...b.params, 1] }));
  assert.equal(CATALOGO.find(f => f.slug === 'errores3').nEjercicios, 3);
});

test('cada error del banco tiene su regla en los dos idiomas (JL, 22-11)', () => {
  for (const p of L.PLANTILLAS) assert.ok(REGLAS[p.error]?.es && REGLAS[p.error]?.en, p.error);
});
