// Práctica «Léelo en inglés» de la unidad 5: 3000 ítems por ejercicio con semillas fijas, en los dos
// idiomas, contra lectores de inglés y de español escritos AQUÍ, aparte del generador. La opción buena
// dice lo que se ve, cada falsa dice otra cosa (o no es una lectura), nunca se enfrentan dos formas
// válidas (nought / zero, proof / test…), ningún par de opciones vale lo mismo, y no sale ni ×, ni
// porcentajes, ni letras como incógnitas, ni un caso de la hoja, ni un punto en español ni una coma
// en inglés dentro de un número.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import {
  decimal, deTexto, aTexto, comparar, dividir, hayIguales, ORDENES, lecturasValidas, esLecturaValida, dinero,
} from '../practicas/_comun/decimales.js';
import {
  numeroAIngles, numeroAEspanol, VOCABULARIO, SINONIMOS, terminoDe, COTAS, ERRORES_LEELO,
  generarPalabra, generarLeelo, generarConsigna, generarCompleta, PLANTILLAS_LEELO, PLANTILLAS_CONSIGNA, PLANTILLAS_COMPLETA,
  nombreDe, ESTA_DEFINIDO, esReservado, RESERVADOS_HOJA, HUELLAS_EXAMEN, huella, claveItem,
} from '../practicas/leelo5/logica.js';
import { TX } from '../practicas/leelo5/textos.js';

const N = 3000;
const DESPLAZAMIENTO = Number(process.env.SEMILLA_LEELO5 ?? 0);     // para probar con otras semillas: SEMILLA_LEELO5=100 node --test …
const items = (generar, semilla) => {
  const rng = crearRng(semilla + DESPLAZAMIENTO);
  return Array.from({ length: N }, (_, i) => generar(rng, { idioma: i % 2 ? 'en' : 'es' }));
};
const plano = html => html.replace(/<[^>]+>/g, '');
const correcta = it => it.opciones.find(o => o.correcta);
const falsas = it => it.opciones.filter(o => !o.correcta);
const texto = it => plano(it.notacion);

// ─── Lectores independientes ─────────────────────────────────────────────────────────────

const CARD = new Map(Array.from({ length: 100000 }, (_, k) => [numeroAIngles(k), k]));
const DIG = { nought: 0, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
const cardinal = t => (t === 'nought' || t === 'zero' ? 0 : CARD.get(t) ?? null);

/** «three point seven five» → Decimal; «point five» → 0,5; «seventy-five» → 75; null si no es una lectura (cifras sueltas). */
function leerDecimalEn(t) {
  const m = t.match(/^(?:(.+?) )?point (.+)$/);
  if (!m) { const n = cardinal(t); return n === null ? null : decimal(n, 0); }
  const entera = m[1] === undefined ? 0 : cardinal(m[1]);
  const cifras = m[2].split(' ');
  if (entera === null || !cifras.every(c => c in DIG)) return null;
  const k = cifras.length;
  return decimal(entera * 10 ** k + Number(cifras.map(c => DIG[c]).join('')), k);
}

/** «three euros seventy-five», «fifty cents», «three euros and five cents» → céntimos en un Decimal(2). */
function leerDineroEn(t) {
  let m = t.match(/^(.+?) euros? (?:and )?(.+?) cents?$/);
  if (m) { const e = cardinal(m[1]), c = cardinal(m[2]); return e !== null && c !== null && c < 100 ? decimal(e * 100 + c, 2) : null; }
  m = t.match(/^(.+?) euros? (.+)$/);
  if (m) { const e = cardinal(m[1]), c = cardinal(m[2]); return e !== null && c !== null && c < 100 ? decimal(e * 100 + c, 2) : null; }
  m = t.match(/^(.+?) euros?$/);
  if (m) { const e = cardinal(m[1]); return e === null ? null : decimal(e * 100, 2); }
  m = t.match(/^(.+?) cents?$/);
  if (m) { const c = cardinal(m[1]); return c !== null && c < 100 ? decimal(c, 2) : null; }
  return null;
}

const fem = t => t.replace(/ientos\b/g, 'ientas').replace(/uno$/, 'una').replace(/\bun$/, 'una');
const ES = new Map(Array.from({ length: 1000 }, (_, k) => [numeroAEspanol(k), k]));
const ESF = new Map(Array.from({ length: 1000 }, (_, k) => [fem(numeroAEspanol(k)), k]));
const ORDEN_ES = { décima: 1, décimas: 1, centésima: 2, centésimas: 2, milésima: 3, milésimas: 3 };

/** «tres unidades y setenta y cinco centésimas», «cinco milésimas», «tres coma cero cinco» → Decimal; null si no se entiende. */
function leerDecimalEs(t) {
  let m = t.match(/^(.+?) coma (.+)$/);
  if (m) {
    const e = ES.get(m[1]);
    const palabras = m[2].split(' ');
    let z = 0;
    while (palabras[0] === 'cero') { z++; palabras.shift(); }
    const resto = palabras.join(' ');
    const n = resto === '' ? 0 : ES.get(resto);
    if (e === undefined || n === undefined) return null;
    const k = z + (resto === '' ? 0 : String(n).length);
    return decimal(e * 10 ** k + n, k);
  }
  m = t.match(/^(.+?) unidad(?:es)? y (.+) (décimas?|centésimas?|milésimas?)$/);
  if (m) {
    const e = ESF.get(m[1]), n = ESF.get(m[2]);
    if (e === undefined || n === undefined) return null;
    const k = ORDEN_ES[m[3]];
    return decimal(e * 10 ** k + n, k);
  }
  m = t.match(/^(.+?) unidad(?:es)?$/);
  if (m && ESF.has(m[1])) return decimal(ESF.get(m[1]), 0);
  m = t.match(/^(.+) (décimas?|centésimas?|milésimas?)$/);
  if (m && ESF.has(m[1])) return decimal(ESF.get(m[1]), ORDEN_ES[m[2]]);
  return ES.has(t) ? decimal(ES.get(t), 0) : null;
}

const OPS = { plus: '+', minus: '-', times: '*', 'multiplied by': '*', 'divided by': ':' };
const SIM = { '+': '+', '−': '-', '·': '*', ':': ':' };
function leerCuentaEn(t) {
  const m = t.match(/^(.+?) (plus|minus|times|multiplied by|divided by) (.+?) (?:equals|is) (.+)$/);
  if (!m) return null;
  const a = leerDecimalEn(m[1]), b = leerDecimalEn(m[3]), c = leerDecimalEn(m[4]);
  return a && b && c ? { a, op: OPS[m[2]], b, c } : null;
}
const mismaCuenta = (x, y) => x.op === y.op && x.a.equals(y.a) && x.b.equals(y.b) && x.c.equals(y.c);
// ─── Comprobaciones de cualquier ítem ────────────────────────────────────────────────────

const SIN_COMA_EN_INGLES = ['completa_separador_millares'];
function revisarItem(it, donde) {
  assert.equal(it.opciones.length, 4, `${donde}: cuatro opciones`);
  assert.equal(it.opciones.filter(o => o.correcta).length, 1, `${donde}: una sola correcta`);
  assert.equal(new Set(it.opciones.map(o => o.texto)).size, 4, `${donde}: opciones repetidas`);
  assert.ok(correcta(it).error === null);
  for (const f of falsas(it)) {
    assert.ok(ESTA_DEFINIDO(f.error), `${donde}: error «${f.error}» sin nombre`);
    assert.ok(f.por_que?.es && f.por_que?.en, `${donde}: falta por_que`);
    assert.ok(nombreDe(f.error).es && nombreDe(f.error).en);
  }
  assert.ok(it.solucion.es && it.solucion.en);
  assert.ok([1, 2, 3, 5, 6].includes(it.sesion), `${donde}: sesión ${it.sesion}`);
  assert.ok(TX.instrucciones[it.instruccion], `${donde}: instrucción ${it.instruccion}`);
  // Ningún par de sinónimos válidos entre las opciones (ni como correcta y distractor).
  const textos = it.opciones.map(o => o.texto.toLowerCase());
  for (const [a, b] of SINONIMOS) assert.ok(!(textos.includes(a) && textos.includes(b)), `${donde}: «${a}» y «${b}» enfrentadas`);
  // Escritura.
  const todo = [plano(it.notacion), ...it.opciones.flatMap(o => [plano(o.texto), o.por_que?.es ?? '', o.por_que?.en ?? '']), it.solucion.es, it.solucion.en].map(plano);
  for (const t of todo) {
    assert.ok(!t.includes('×'), `${donde}: × en «${t}»`);
    assert.ok(!/%|por ciento|percent/i.test(t), `${donde}: porcentaje en «${t}»`);
    assert.ok(!/\bmixed (number|fraction)|\bnúmero mixto|\bfracción mixta/i.test(t), `${donde}: número mixto en «${t}»`);
    assert.ok(!/\b[xyn]\s*=|=\s*[xyn]\b/.test(t.replace(/\b(in|an|on|ten|one)\b/g, '')), `${donde}: letra como incógnita en «${t}»`);
  }
  // Un punto en un número español o una coma en uno inglés (salvo la coma de millares de 1B-05).
  const puntoEnEs = t => /\d\.\d/.test(t);
  const comaEnEn = t => /\d,\d/.test(t);
  for (const f of it.opciones) {
    assert.ok(!puntoEnEs(plano(f.por_que?.es ?? '')), `${donde}: punto en español en «${f.por_que?.es}»`);
    if (!SIN_COMA_EN_INGLES.includes(it.plantilla)) assert.ok(!comaEnEn(plano(f.por_que?.en ?? '')), `${donde}: coma en inglés en «${f.por_que?.en}»`);
  }
  assert.ok(!puntoEnEs(plano(it.solucion.es)), `${donde}: punto en español en «${it.solucion.es}»`);
  if (!SIN_COMA_EN_INGLES.includes(it.plantilla)) assert.ok(!comaEnEn(plano(it.solucion.en)), `${donde}: coma en inglés en «${it.solucion.en}»`);
  // Los casos de la hoja y del examen no salen (la notación y la opción buena).
  if (!SIN_COMA_EN_INGLES.includes(it.plantilla)) {
    for (const t of [plano(it.notacion), plano(correcta(it).texto)]) {
      for (const tok of t.match(/\d+[.,]\d+/g) ?? []) {
        const d = deTexto(tok);
        // Solo son «casos» los números que se leen o se escriben (no los resultados intermedios de una cuenta).
        if (['leer_decimal', 'leer_dinero', 'leer_en_espanol'].includes(it.plantilla) || it.plantilla.startsWith('cifras_') || it.plantilla.startsWith('consigna_') || (it.plantilla.startsWith('completa_') && it.plantilla !== 'completa_tipo')) {
          assert.ok(!esReservado(d.normalizar()), `${donde}: caso de la hoja «${tok}»`);
        }
      }
    }
  }
}

function revisarTodos(lista, nombre) {
  lista.forEach((it, i) => revisarItem(it, `${nombre} #${i} ${it.plantilla}`));
}

// ─── Ejercicio 1 · La palabra ────────────────────────────────────────────────────────────

test('el vocabulario: ids únicos, familias, y ni «zero» ni «test» como término', () => {
  assert.equal(new Set(VOCABULARIO.map(v => v.id)).size, VOCABULARIO.length);
  const ens = VOCABULARIO.map(v => v.en);
  for (const prohibido of ['zero', 'test', 'to the nearest tenth', 'digits after the decimal point', 'decimal comma']) assert.ok(!ens.includes(prohibido), prohibido);
  for (const v of VOCABULARIO) {
    if (v.contrario) assert.ok(terminoDe(v.contrario), `contrario de ${v.id}`);
    assert.ok(v.en && v.es && [1, 2, 3, 5, 6].includes(v.sesion));
  }
});

test('ej. 1: el término correcto está en la opción buena, ninguna falsa es del mismo grupo, nunca dos sinónimos', () => {
  const lista = items(generarPalabra, 11);
  revisarTodos(lista, 'ej1');
  const vistos = new Set();
  for (const it of lista) {
    vistos.add(it.plantilla);
    const sentido = it.plantilla === 'palabra_en_es' ? 'en' : 'es';
    const t = VOCABULARIO.find(v => v[sentido] === texto(it));
    assert.ok(t, `término «${texto(it)}»`);
    const claveBuena = sentido === 'en' ? t.es : t.en;
    assert.equal(correcta(it).texto, claveBuena);
    for (const f of falsas(it)) {
      const v = VOCABULARIO.find(x => x[sentido === 'en' ? 'es' : 'en'] === f.texto) ?? [terminoDe('tenths'), terminoDe('hundredths'), terminoDe('thousandths')].map(x => x.confusion).find(c => c[sentido === 'en' ? 'es' : 'en'] === f.texto);
      assert.ok(v, `opción «${f.texto}» no sale del vocabulario`);
      assert.notEqual(v.familia ?? '', t.familia, `«${f.texto}» es de la misma familia que «${t.en}»`);
      assert.notEqual(v.id, t.id);
    }
  }
  assert.deepEqual([...vistos].sort(), ['palabra_en_es', 'palabra_es_en']);
  // Los confundibles (tenths / tens, dividend / divisor…) salen como distractor del término.
  const confunde = lista.filter(it => falsas(it).some(f => f.error === 'confunde-parecidas' || f.error === 'confunde-contrarios'));
  assert.ok(confunde.length > N / 10, 'salen pocos confundibles');
});

test('ej. 1: todos los términos de la lista salen como pregunta y como respuesta', () => {
  const lista = items(generarPalabra, 12);
  const preguntados = new Set(lista.map(texto));
  for (const v of VOCABULARIO) assert.ok(preguntados.has(v.en) || preguntados.has(v.es), `«${v.en}» nunca se pregunta`);
});

// ─── Ejercicio 2 · Léelo ─────────────────────────────────────────────────────────────────

const lista2 = items(generarLeelo, 21);

test('ej. 2: sale cada plantilla y ningún ítem rompe las reglas generales', () => {
  revisarTodos(lista2, 'ej2');
  const vistas = new Set(lista2.map(it => it.plantilla));
  for (const p of ['leer_decimal', 'leer_dinero', 'cifras_de_palabras_en', 'cifras_de_palabras_es', 'leer_en_espanol', 'leer_cuenta_suma', 'leer_cuenta_resta', 'leer_cuenta_producto', 'leer_cuenta_cociente']) assert.ok(vistas.has(p), `falta ${p}`);
  assert.ok(new Set(lista2.map(claveItem)).size > N * 0.8, 'muchos ítems repetidos');
});

test('ej. 2: leer un decimal: la buena lee el decimal; las falsas, otro valor o ninguna lectura; ninguna es válida ni «de la calle»', () => {
  for (const it of lista2.filter(i => i.plantilla === 'leer_decimal')) {
    const d = deTexto(texto(it));
    const k = aTexto(d, 'en').split('.')[1]?.length ?? 0;
    assert.ok(k >= 1 && k <= 3, `cifras decimales: ${texto(it)}`);
    const { e, dec } = { e: aTexto(d, 'en').split('.')[0], dec: aTexto(d, 'en').split('.')[1] };
    assert.ok(e.length <= 2, 'parte entera de hasta dos cifras');
    assert.ok(!dec.endsWith('0'), 'sin ceros finales');
    const lectura = leerDecimalEn(correcta(it).texto);
    assert.ok(lectura && lectura.equals(d), `«${correcta(it).texto}» no lee ${texto(it)}`);
    const calle = [`${e === '0' ? 'nought' : numeroAIngles(Number(e))} point ${numeroAIngles(Number(dec))}`, `${numeroAIngles(Number(e))} ${numeroAIngles(Number(dec))}`];
    const valores = [];
    for (const f of falsas(it)) {
      const v = leerDecimalEn(f.texto);
      assert.ok(v === null || !v.equals(d), `«${f.texto}» lee ${texto(it)}`);
      assert.ok(!esLecturaValida(d, f.texto, 'en'), `«${f.texto}» es una lectura válida de ${texto(it)}`);
      if (dec.length === 2 && dec[0] !== '0') assert.ok(!calle.includes(f.texto), `«${f.texto}» se oye en la calle`);
      if (v) valores.push(v);
    }
    assert.ok(!hayIguales(valores), 'dos falsas leen lo mismo');
    assert.ok(lecturasValidas(d, 'en').includes(correcta(it).texto));
  }
});

test('ej. 2: dinero: dos cifras de céntimos, la buena lee la cantidad, las falsas otra', () => {
  const dineros = lista2.filter(i => i.plantilla === 'leer_dinero');
  assert.ok(dineros.length > 300);
  for (const it of dineros) {
    const d = deTexto(texto(it).replace('€', '').trim());
    assert.equal(d.k, 2);
    assert.ok(comparar(d, decimal(5, 2)) >= 0 && comparar(d, decimal(6000, 2)) < 0, `cantidad fuera de cota ${texto(it)}`);
    assert.equal(texto(it), dinero(d, it.notacion.includes('€') && /^<div class="operacion">€/.test(it.notacion) ? 'en' : 'es'));
    const l = leerDineroEn(correcta(it).texto);
    assert.ok(l && l.equals(d), `«${correcta(it).texto}» no lee ${texto(it)}`);
    const valores = [];
    for (const f of falsas(it)) {
      const v = leerDineroEn(f.texto);
      assert.ok(v === null || !v.equals(d), `«${f.texto}» lee ${texto(it)}`);
      if (v) valores.push(v);
    }
    assert.ok(!hayIguales(valores));
  }
});

test('ej. 2: de las palabras a las cifras: la buena es el valor que dicen, ninguna falsa vale lo mismo, y los ceros de en medio salen', () => {
  const ceros = [];
  for (const it of lista2.filter(i => i.plantilla.startsWith('cifras_de_palabras'))) {
    const idioma = it.plantilla.endsWith('_en') ? 'en' : 'es';
    const valor = idioma === 'en' ? leerDecimalEn(texto(it)) : leerDecimalEs(texto(it));
    assert.ok(valor, `no se entiende «${texto(it)}»`);
    const opcionValor = o => deTexto(o.texto);
    assert.ok(opcionValor(correcta(it)).equals(valor), `«${texto(it)}» no es ${correcta(it).texto}`);
    const vals = it.opciones.map(opcionValor);
    assert.ok(vals.every(Boolean), 'una opción no es un número');
    assert.ok(!hayIguales(vals), `dos opciones valen lo mismo: ${it.opciones.map(o => o.texto)}`);
    if (/\.0\d|,0\d/.test(correcta(it).texto)) ceros.push(it);
  }
  assert.ok(ceros.length > 100, 'salen pocos ceros de en medio');
});

test('ej. 2: los números salen con coma en un ítem en español y con punto en uno en inglés', () => {
  lista2.forEach((it, i) => {
    const idioma = i % 2 ? 'en' : 'es';
    const numeros = [plano(it.notacion), ...(it.plantilla.startsWith('cifras_') ? it.opciones.map(o => o.texto) : [])].join(' ');
    if (idioma === 'es') assert.ok(!/\d\.\d/.test(numeros), `punto en un ítem en español: ${numeros}`);
    else assert.ok(!/\d,\d/.test(numeros), `coma en un ítem en inglés: ${numeros}`);
  });
});

test('ej. 2: leer en español con los órdenes: la buena lee el decimal, las falsas no, y el nombre del último orden es el de la cifra', () => {
  for (const it of lista2.filter(i => i.plantilla === 'leer_en_espanol')) {
    const d = deTexto(texto(it));
    assert.ok(leerDecimalEs(correcta(it).texto)?.equals(d), `«${correcta(it).texto}» no lee ${texto(it)}`);
    assert.ok(esLecturaValida(d, correcta(it).texto, 'es'));
    const valores = [];
    for (const f of falsas(it)) {
      const v = leerDecimalEs(f.texto);
      assert.ok(v && !v.equals(d), `«${f.texto}» lee ${texto(it)}`);
      assert.ok(!esLecturaValida(d, f.texto, 'es'));
      valores.push(v);
    }
    assert.ok(!hayIguales(valores));
    assert.ok(falsas(it).some(f => f.error === 'orden-mal-nombrado'));
  }
});

test('ej. 2: leer una cuenta: la buena lee la cuenta de la pantalla, las falsas, otra; cotas de las cifras', () => {
  const cuentas = lista2.filter(i => i.plantilla.startsWith('leer_cuenta'));
  assert.ok(cuentas.length > 600);
  for (const it of cuentas) {
    const m = texto(it).match(/^(\S+) (\+|−|·|:) (\S+) = (\S+)$/);
    assert.ok(m, `notación rara «${texto(it)}»`);
    const [a, b, c] = [m[1], m[3], m[4]].map(deTexto);
    const op = SIM[m[2]];
    const esperada = { a, op, b, c };
    for (const x of [a, b, c]) assert.ok(x.k <= 3 && x.normalizar().k === x.k, `cifras de ${aTexto(x, 'en')}`);
    const buena = leerCuentaEn(correcta(it).texto);
    assert.ok(buena && mismaCuenta(buena, esperada), `«${correcta(it).texto}» no lee ${texto(it)}`);
    // La cuenta es verdadera.
    const k = Math.max(a.k, b.k);
    const A = a.m * 10 ** (k - a.k), B = b.m * 10 ** (k - b.k);
    if (op === '+') assert.ok(c.equals(decimal(A + B, k)));
    if (op === '-') assert.ok(c.equals(decimal(A - B, k)) && c.m > 0);
    if (op === '*') assert.ok(c.equals(decimal(a.m * b.m, a.k + b.k)));
    if (op === ':') assert.ok(a.equals(decimal(c.m * b.m, c.k + b.k)), 'división exacta');
    for (const f of falsas(it)) {
      const l = leerCuentaEn(f.texto);
      assert.ok(l === null || !mismaCuenta(l, esperada), `«${f.texto}» lee ${texto(it)}`);
    }
    assert.equal(new Set(it.opciones.map(o => o.texto)).size, 4);
    assert.ok(falsas(it).some(f => f.error === 'operacion-cambiada'));
  }
});

// ─── Ejercicio 3 · La consigna ───────────────────────────────────────────────────────────

const lista3 = items(generarConsigna, 31);
const es = tok => aTexto(deTexto(tok), 'es');
const REDONDEO_ES = { 'to the nearest whole number': 'a la unidad más cercana', 'to one decimal place': 'a la décima', 'to two decimal places': 'a la centésima' };

/** La traducción que tiene que ser la única buena de cada consigna, escrita aquí con las reglas del enunciado. */
function esperadaDe(en) {
  let m;
  if ((m = en.match(/^Round (\S+) (to the nearest whole number|to one decimal place|to two decimal places)\.$/))) return `Redondea ${es(m[1])} ${REDONDEO_ES[m[2]]}`;
  if ((m = en.match(/^Write (\S+) as a fraction in its simplest form\.$/))) return `Escribe ${es(m[1])} como fracción irreducible (la más simple)`;
  if ((m = en.match(/^Write a decimal that is between (\S+) and (\S+)\.$/))) return `Escribe un decimal que esté entre ${es(m[1])} y ${es(m[2])}`;
  if ((m = en.match(/^Write (.+) in (ascending|descending) order\.$/))) {
    const nums = m[1].split(', ').map(es);
    return `Ordena ${nums.slice(0, -1).join('; ')} y ${nums.at(-1)} ${m[2] === 'ascending' ? 'de menor a mayor' : 'de mayor a menor'}`;
  }
  if ((m = en.match(/^Which number is (greater|smaller), (\S+) or (\S+)\?$/))) return `¿Qué número es ${m[1] === 'greater' ? 'mayor' : 'menor'}, ${es(m[2])} o ${es(m[3])}?`;
  if ((m = en.match(/^Estimate (\S+) \+ (\S+) by rounding to the nearest whole number\.$/))) return `Estima ${es(m[1])} + ${es(m[2])} redondeando a la unidad más cercana`;
  if ((m = en.match(/^Convert (\d+)(\d+)? to a decimal\.$/))) return null;     // la fracción va en HTML: se comprueba aparte
  if ((m = en.match(/^Divide (\S+) by (\S+) with two decimal places in the quotient\.$/))) return `Divide ${es(m[1])} entre ${es(m[2])} con dos cifras decimales en el cociente`;
  throw new Error(`consigna sin regla: «${en}»`);
}

test('ej. 3: cada consigna tiene una sola traducción verdadera, la marcada; las demás cambian la palabra que decide', () => {
  revisarTodos(lista3, 'ej3');
  const vistas = new Set(lista3.map(i => i.plantilla));
  for (const f of PLANTILLAS_CONSIGNA) assert.ok([...vistas].some(v => v.startsWith('consigna_')), f.name);
  assert.equal(vistas.size, new Set(PLANTILLAS_CONSIGNA).size, `plantillas: ${[...vistas]}`);   // algunas están repetidas en la lista para que salgan más
  for (const it of lista3) {
    const en = texto(it);
    if (it.plantilla === 'consigna_convertir') {
      const f = it.notacion.match(/<span>(\d+)<\/span><span>(\d+)<\/span>/);
      assert.ok(f, 'fracción de la consigna');
      // La fracción va con raya: la buena es «Pasa <fracción> a decimal» con esa misma fracción; ninguna falsa acaba en «a decimal».
      const [, n, d] = f;
      assert.equal(correcta(it).texto, `Pasa ${n}/${d} a decimal`);
      assert.equal(correcta(it).html, `Pasa <span class="frac frac--compacta"><span>${n}</span><span>${d}</span></span> a decimal`);
      for (const o of falsas(it)) assert.ok(!/ a decimal$/.test(o.texto), `«${o.texto}» acaba como la buena`);
      continue;
    }
    const esperada = esperadaDe(en);
    const iguales = it.opciones.filter(o => o.texto === esperada);
    assert.equal(iguales.length, 1, `«${en}»: ${it.opciones.map(o => o.texto).join(' | ')}`);
    assert.ok(iguales[0].correcta, `«${en}»: la buena no es «${esperada}»`);
  }
});

test('ej. 3: los números de las consignas están dentro de las cotas de cada contexto', () => {
  for (const it of lista3) {
    const en = texto(it);
    for (const tok of en.match(/\d+\.\d+/g) ?? []) {
      const d = deTexto(tok);
      assert.ok(d.k <= 3 && !esReservado(d.normalizar()), `número ${tok}`);
      assert.ok(comparar(d, 100) < 0, `número ${tok} demasiado grande`);
    }
    if (it.plantilla === 'consigna_entre') {
      const [a, b] = en.match(/\d+\.\d+/g).map(deTexto);
      assert.equal(comparar(decimal(b.m, b.k), decimal(a.m + 1, a.k)), 0, 'consecutivos');
    }
    if (it.plantilla === 'consigna_orden') {
      const ns = en.match(/\d+(\.\d+)?/g).map(deTexto);
      assert.equal(ns.length, 3);
      assert.ok(!hayIguales(ns), 'tres números distintos');
    }
    if (it.plantilla === 'consigna_mayor') {
      const [a, b] = en.match(/\d+\.\d+/g).map(deTexto);
      assert.notEqual(comparar(a, b), 0);
    }
  }
});

// ─── Ejercicio 4 · Completa ──────────────────────────────────────────────────────────────

const lista4 = items(generarCompleta, 41);

const verdadera = (a, palabra, b) => ({ 'greater than': comparar(a, b) > 0, 'less than': comparar(a, b) < 0, 'equal to': comparar(a, b) === 0 }[palabra]);

test('ej. 4: sale cada plantilla y ningún ítem rompe las reglas generales', () => {
  revisarTodos(lista4, 'ej4');
  const vistas = new Set(lista4.map(i => i.plantilla));
  for (const p of ['completa_orden', 'completa_lugares', 'completa_comparar', 'completa_entre', 'completa_vuelta', 'completa_litro', 'completa_pesa', 'completa_rol', 'completa_tipo', 'completa_separador_decimal', 'completa_separador_millares']) assert.ok(vistas.has(p), `falta ${p}`);
  assert.equal(PLANTILLAS_COMPLETA.length >= 10, true);
  for (const it of lista4) assert.ok(it.notacion.includes('class="hueco'), 'sin hueco');
});

test('ej. 4: cada frase tiene una sola palabra verdadera, la marcada', () => {
  for (const it of lista4) {
    const t = texto(it);
    const palabra = correcta(it).texto;
    const nombres = it.opciones.map(o => o.texto);
    let m;
    switch (it.plantilla) {
      case 'completa_orden': {
        m = t.match(/^In (\S+), the (\d) is in the  place\.$/);
        const d = deTexto(m[1]);
        const dec = aTexto(d, 'en').split('.')[1];
        const todas = aTexto(d, 'en').replace('.', '');
        assert.equal(todas.split(m[2]).length, 2, 'la cifra repetida');
        const k = dec.indexOf(m[2]) + 1;
        assert.ok(k >= 1);
        assert.equal(palabra, ORDENES[-k].en);
        for (const f of nombres.filter(x => x !== palabra)) assert.notEqual(f, ORDENES[-k].en);
        assert.ok(nombres.includes({ 1: 'tens', 2: 'hundreds', 3: 'thousands' }[k]), 'falta el parecido');
        break;
      }
      case 'completa_lugares': {
        m = t.match(/^(\S+) has  decimal places?\.$/);
        const k = aTexto(deTexto(m[1]), 'en').split('.')[1].length;
        assert.equal(palabra, numeroAIngles(k));
        assert.equal(t.includes(k === 1 ? ' place.' : ' places.'), true, 'place / places');
        break;
      }
      case 'completa_comparar': {
        m = t.match(/^(\S+) is  (\S+)\.$/);
        const [a, b] = [deTexto(m[1]), deTexto(m[2])];
        assert.notEqual(comparar(a, b), 0);
        assert.ok(verdadera(a, palabra, b), `«${t}» con «${palabra}»`);
        for (const f of nombres.filter(x => x !== palabra)) assert.ok(!verdadera(a, f, b), `«${t}» con «${f}» también es verdad`);
        assert.ok(nombres.includes('between') && nombres.includes('equal to'));
        break;
      }
      case 'completa_entre': {
        m = t.match(/^(\S+) is  (\S+) and (\S+)\.$/);
        const [x, lo, hi] = [deTexto(m[1]), deTexto(m[2]), deTexto(m[3])];
        assert.ok(comparar(lo, x) < 0 && comparar(x, hi) < 0);
        assert.equal(palabra, 'between');
        for (const f of nombres.filter(n => n !== palabra)) assert.ok(!(verdadera(x, f, lo) && verdadera(x, f, hi)), `«${f}» vale para los dos`);
        break;
      }
      case 'completa_vuelta': {
        m = t.match(/^(\S+) pays with a €(\d+) note \(billete\) and the book costs €(\S+)\. (\S+)'s  is €(\S+)\.$/);
        const [billete, precio, cambio] = [Number(m[2]), deTexto(m[3]), deTexto(m[5])];
        assert.ok(COTAS.libro.billetes.includes(billete), 'billete');
        assert.ok(precio.m >= COTAS.libro.min * 100 && precio.m <= COTAS.libro.max * 100 && precio.m < billete * 100, 'precio');
        assert.ok(cambio.equals(decimal(billete * 100 - precio.m, 2)) && cambio.m > 0, 'la vuelta');
        assert.equal(precio.k, 2); assert.equal(cambio.k, 2);
        assert.equal(palabra, 'change');
        break;
      }
      case 'completa_litro': {
        m = t.match(/€(\d\.\d\d)  litre/);
        const precio = deTexto(m[1]);
        assert.ok(precio.m >= COTAS.gasolina.min && precio.m <= COTAS.gasolina.max && precio.k === 2, `gasolina ${m[1]}`);
        const l = t.match(/buys (\d+) litres/);
        if (l) assert.ok(Number(l[1]) >= COTAS.litros.min && Number(l[1]) <= COTAS.litros.max);
        assert.equal(palabra, 'per');
        break;
      }
      case 'completa_pesa': {
        m = t.match(/^(.+?)  (\S+) kg\.$/);
        const kg = deTexto(m[2]);
        const cota = m[1] === 'A bag of potatoes' ? COTAS.bolsa : m[1] === 'A parcel' ? COTAS.paquete : m[1] === 'A newborn baby' ? COTAS.recien : COTAS.persona;
        assert.ok(kg.k === 1 && kg.m >= cota.min && kg.m <= cota.max, `peso ${t}`);
        assert.equal(palabra, 'weighs');
        assert.ok(!nombres.includes('weighed'));
        break;
      }
      case 'completa_rol': {
        m = t.match(/^In (\S+) : (\S+) = (\S+), remainder (\S+), the number (\S+) is the \.$/);
        const [a, b, c, r, x] = m.slice(1).map(deTexto);
        const res = dividir(a, b, 2);
        assert.ok(res.cociente.equals(c) && res.resto.equals(r), 'cociente y resto de la división');
        assert.ok(b.k === 0 && b.m % 10 !== 0 && b.m >= 3 && b.m <= 49);
        const valores = { dividend: a, divisor: b, quotient: c, remainder: r };
        assert.ok(!hayIguales(Object.values(valores)), 'cuatro valores distintos');
        assert.ok(valores[palabra].equals(x), `«${t}» con «${palabra}»`);
        for (const f of nombres.filter(n => n !== palabra)) assert.ok(!valores[f].equals(x));
        // El cálculo es cierto: a = b · c + r
        assert.ok(a.equals(decimal(b.m * c.m * 10 ** Math.max(0, r.k - c.k) + r.m * 10 ** Math.max(0, c.k - r.k), Math.max(c.k, r.k))));
        break;
      }
      case 'completa_tipo': {
        m = it.notacion.match(/<span>(\d+)<\/span><span>(\d+)<\/span>/);
        let [n, d] = [Number(m[1]), Number(m[2])];
        const mcd = (x, y) => (y ? mcd(y, x % y) : x);
        d /= mcd(n, d);
        let r = d;
        for (const p of [2, 5]) while (r % p === 0) r /= p;
        assert.equal(palabra, r === 1 ? 'terminating' : 'recurring');
        assert.ok(plano(it.notacion).includes('…') === (r !== 1), 'puntos suspensivos sin arco');
        break;
      }
      case 'completa_separador_decimal':
        assert.equal(palabra, 'point');
        break;
      case 'completa_separador_millares':
        assert.equal(palabra, 'thousands');
        assert.ok(/\d,\d{3}/.test(t));
        break;
      default:
        throw new Error(`plantilla ${it.plantilla}`);
    }
  }
});

test('ej. 4: ninguna palabra falsa es una forma válida de la buena', () => {
  const validas = { weighs: ['weighs', 'weighed'], per: ['per', 'a', 'each'], change: ['change', 'the change'], point: ['point', 'dot'], 'greater than': ['greater than', 'more than', 'bigger than'], 'less than': ['less than', 'smaller than', 'fewer than'], recurring: ['recurring', 'repeating'], terminating: ['terminating', 'exact'] };
  for (const it of lista4) {
    const palabra = correcta(it).texto;
    for (const f of falsas(it)) {
      assert.ok(!(validas[palabra] ?? []).filter(v => v !== palabra).includes(f.texto), `«${f.texto}» vale como «${palabra}»`);
      assert.ok(f.texto.length > 0);
    }
  }
});

// ─── Reservados ──────────────────────────────────────────────────────────────────────────

test('los casos reservados: la hoja en claro, el examen por huella (60)', () => {
  assert.ok(RESERVADOS_HOJA.size > 200);
  for (const t of ['6.28', '0.07', '12.5', '9.304', '15.06', '2.005', '6.318', '4.726', '0.15']) assert.ok(esReservado(deTexto(t)), t);
  for (const t of ['6.280', '6.2800']) assert.ok(esReservado(deTexto(t)), `${t} vale lo mismo que un caso de la hoja`);
  for (const t of ['3.75', '4.07', '0.543']) assert.ok(!esReservado(deTexto(t)), t);
  assert.equal(HUELLAS_EXAMEN.size, 60);
  for (const t of ['0.007', '4.08', '0.009']) assert.ok(esReservado(deTexto(t)), t);
  assert.equal(huella('3.75'), huella('3.75'));
  assert.notEqual(huella('3.75'), huella('3.76'));
});

test('ningún ítem de ningún ejercicio lleva un caso de la hoja (notación y opción buena)', () => {
  let revisados = 0;
  for (const lista of [lista2, lista3, lista4]) {
    for (const it of lista) {
      if (it.plantilla === 'completa_separador_millares' || it.plantilla === 'completa_tipo') continue;   // la decimal de una fracción no es un caso
      for (const t of [plano(it.notacion), plano(correcta(it).texto)]) {
        for (const tok of t.match(/\d+[.,]\d+/g) ?? []) {
          if (it.plantilla.startsWith('leer_cuenta')) continue;      // los operandos y el resultado de una cuenta no son «casos» de lectura
          revisados++;
          assert.ok(!esReservado(deTexto(tok).normalizar()), `${it.plantilla}: «${tok}»`);
        }
      }
    }
  }
  assert.ok(revisados > 5000, `solo se han revisado ${revisados} números`);
});

test('3000 ítems de cada ejercicio con otras semillas: ningún decimal reservado en el enunciado ni en la opción buena', () => {
  let revisados = 0;
  for (const [generar, semilla] of [[generarLeelo, 2], [generarConsigna, 3], [generarCompleta, 4]]) {
    const rng = crearRng(910000 + semilla);
    for (let i = 0; i < 3000; i++) {
      const it = generar(rng, { idioma: i % 2 ? 'en' : 'es' });
      if (it.plantilla.startsWith('leer_cuenta') || it.plantilla === 'completa_separador_millares' || it.plantilla === 'completa_tipo') continue;
      for (const tok of `${plano(it.notacion)} ${plano(correcta(it).texto)}`.match(/\d+[.,]\d+/g) ?? []) {
        revisados++;
        assert.ok(!esReservado(deTexto(tok).normalizar()), `${it.plantilla}: «${tok}»`);
      }
    }
  }
  assert.ok(revisados > 3000, `solo se han revisado ${revisados} números`);
});

test('los nombres de los errores propios están en los dos idiomas y no se pisan con los de la base', () => {
  for (const [id, e] of Object.entries(ERRORES_LEELO)) {
    assert.ok(e.nombre.es && e.nombre.en, id);
    assert.ok(!/ I /.test(e.nombre.en));
  }
});

test('ningún texto de opción lleva marcado HTML y las de «convertir» llevan la fracción con raya en `html`', () => {
  let convertir = 0;
  for (const generar of [generarPalabra, generarLeelo, generarConsigna, generarCompleta]) {
    const rng = crearRng(920000 + generar.name.length);
    for (let i = 0; i < 600; i++) {
      const it = generar(rng, 5);
      for (const o of it.opciones) {
        assert.ok(!/</.test(o.texto), `${it.plantilla}: «${o.texto}»`);
        if (it.plantilla === 'consigna_convertir') {
          convertir++;
          assert.match(o.html, /class="frac/, o.texto);
          assert.ok(!/\d+\/\d+/.test(o.html), o.html);
        }
      }
    }
  }
  assert.ok(convertir > 40, `solo ${convertir} opciones de convertir`);
});

test('completa_vuelta no usa «Her»/«she» con nombres de chico y consigna_orden no separa con comas en español', () => {
  const rng = crearRng(930001);
  for (let i = 0; i < 1500; i++) {
    const it = generarCompleta(rng, 5);
    if (it.plantilla === 'completa_vuelta') assert.ok(!/\bHer\b/.test(JSON.stringify(it)) && !/\bshe\b/.test(JSON.stringify(it)));
    const c = generarConsigna(rng, 5);
    if (c.plantilla === 'consigna_orden') for (const o of c.opciones) assert.ok(!/\d,\d+, \d/.test(o.texto), o.texto);
  }
});
