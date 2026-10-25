// Práctica «Enteros en la vida real» (reparto-practicas-u2, tarea 82): fuerza bruta con
// 3000 ítems por ejercicio y semilla fija. Cotas de realismo, frases distintas en
// significado, años sin año 0, distractores con error típico con nombre y textos
// limpios (sin ×, sin guion como signo, sin letras, sin «(+»).

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { errorValido } from '../practicas/_comun/registro.js';
import { ERRORES_TIPICOS, fmt } from '../practicas/_comun/enteros.js';
import {
  CONTEXTOS, IDS, PASOS, ERRORES_PROPIOS, enCota, generarEntero, generarSituacion, generarPaso,
  opcionBuena, cuentaPaso, terminosPaso, frasesPaso, esCorrectoPaso, errorDePaso, vistaPaso,
} from '../practicas/situaciones/logica.js';
import { TX, FRASES, FRASES_RESULTADO, ENUNCIADO_PASO, BOTON_SALTO, NOMBRE_CONTEXTO, frase, fraseResultado } from '../practicas/situaciones/textos.js';

const N = 3000;
const IDIOMAS = ['es', 'en'];
const generar = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};

// Todo texto que ve el alumno: sin ×, sin guion delante de una cifra (el menos es U+2212),
// sin «(+» ni letras sueltas de variable.
function limpio(texto, donde) {
  const plano = String(texto).replace(/<[^>]*>/g, '');
  assert.ok(!plano.includes('×'), `× en ${donde}: ${plano}`);
  assert.ok(!/-\d/.test(plano), `guion como signo en ${donde}: ${plano}`);
  assert.ok(!plano.includes('(+'), `«(+» en ${donde}: ${plano}`);
  // Una letra de variable pegada a una cifra o a un operador («3x», «x + 2», «n = 4»); «y» suelta es la conjunción.
  assert.ok(!/\d[xyn](?![\p{L}])|(?<![\p{L}\d])[xyn]\s*[=+−·:]|[=+−·:]\s*[xyn](?![\p{L}\d])/u.test(plano), `letra de variable en ${donde}: ${plano}`);
}

// --- Contextos y cotas ---------------------------------------------------------------

test('cada contexto tiene cota, nombre y frases en los dos idiomas', () => {
  for (const ctx of IDS) {
    const c = CONTEXTOS[ctx];
    assert.ok(c.min < 0 && c.max > 0, ctx);
    assert.ok(NOMBRE_CONTEXTO[ctx].es && NOMBRE_CONTEXTO[ctx].en, ctx);
    for (const idioma of IDIOMAS) assert.equal(typeof FRASES[ctx][idioma], 'function', `${ctx} ${idioma}`);
  }
  // Cotas orientativas de la ficha (regla de realismo de 2026-10-16).
  assert.deepEqual([CONTEXTOS.temperatura.min, CONTEXTOS.temperatura.max], [-30, 45]);
  assert.deepEqual([CONTEXTOS.planta.min, CONTEXTOS.planta.max], [-5, 20]);
  assert.deepEqual([CONTEXTOS.saldo.min, CONTEXTOS.saldo.max], [-50, 300]);
  assert.deepEqual([CONTEXTOS.buceo.min, CONTEXTOS.buceo.max], [-40, 30]);
  assert.equal(CONTEXTOS.mar.min, -400);
  assert.ok(CONTEXTOS.mar.max <= 8849);
  assert.ok(CONTEXTOS.anios.min >= -3000 && CONTEXTOS.anios.max <= 2026);
});

test('enCota: respeta los límites, el 0 solo donde es posible y rechaza no enteros', () => {
  assert.ok(enCota('temperatura', 0) && enCota('planta', 0));
  assert.ok(!enCota('saldo', 0) && !enCota('anios', 0) && !enCota('mar', 0) && !enCota('buceo', 0));
  assert.ok(enCota('temperatura', -30) && !enCota('temperatura', -31) && !enCota('temperatura', 46));
  assert.ok(!enCota('planta', -6) && !enCota('planta', 21));
  assert.ok(!enCota('saldo', 1.5));
});

// --- Ejercicio 1: ¿qué entero es? ----------------------------------------------------

test('ejercicio 1: todos los ítems dentro de la cota de su contexto, y salen los seis contextos con los dos signos', () => {
  const vistos = new Set();
  for (const item of generar(generarEntero, 11)) {
    assert.ok(IDS.includes(item.ctx));
    assert.ok(enCota(item.ctx, item.n), `${item.ctx}: ${item.n} fuera de cota`);
    vistos.add(`${item.ctx}${Math.sign(item.n)}`);
  }
  for (const ctx of IDS) {
    assert.ok(vistos.has(`${ctx}-1`) && vistos.has(`${ctx}1`), `${ctx} sin los dos signos`);
  }
  assert.ok(vistos.has('temperatura0') && vistos.has('planta0'), 'el 0 sale en temperatura y plantas');
});

test('ejercicio 1: los metros sobre el nivel del mar van de 10 en 10 y el año 0 no existe', () => {
  for (const item of generar(generarEntero, 12)) {
    if (item.ctx === 'mar') assert.equal(Math.abs(item.n) % 10, 0);
    if (item.ctx === 'anios') assert.notEqual(item.n, 0);
  }
});

test('ejercicio 1: la frase, en los dos idiomas, dice la cantidad sin signo y la palabra del signo', () => {
  for (const item of generar(generarEntero, 13).slice(0, 600)) {
    for (const idioma of IDIOMAS) {
      const f = frase(item.ctx, item.n, idioma);
      limpio(f, `${item.ctx} ${item.n} ${idioma}`);
      const ordinal = item.ctx === 'planta' && item.n < 0 && idioma === 'es';   // «el cuarto sótano»: sin cifra
      if (item.n !== 0 && !ordinal) assert.ok(f.includes(String(Math.abs(item.n))), `${f} no dice ${Math.abs(item.n)}`);
      limpio(TX.entero.razon[idioma](item.ctx, item.n), 'razón');
    }
  }
});

// --- Ejercicio 2: ¿qué situación es? -------------------------------------------------

test('ejercicio 2: tres opciones, una buena; sentido contrario y otro tema, todos dentro de su cota', () => {
  for (const item of generar(generarSituacion, 21)) {
    assert.notEqual(item.n, 0);
    assert.ok(enCota(item.ctx, item.n));
    assert.equal(item.opciones.length, 3);
    assert.equal(item.opciones.filter(o => o.error === null).length, 1);
    for (const o of item.opciones) assert.ok(enCota(o.ctx, o.v), `${o.ctx} ${o.v} fuera de cota`);
    const bueno = opcionBuena(item);
    assert.deepEqual([bueno.ctx, bueno.v], [item.ctx, item.n]);
    const contrario = item.opciones.find(o => o.error === 'signo-cambiado');
    assert.deepEqual([contrario.ctx, contrario.v], [item.ctx, -item.n]);
    const otro = item.opciones.find(o => o.error === 'contexto-equivocado');
    assert.notEqual(otro.ctx, item.ctx);
    assert.equal(otro.v, -item.n);
  }
});

test('ejercicio 2: las tres frases son distintas en significado, no solo en el texto', () => {
  for (const item of generar(generarSituacion, 22)) {
    const significados = item.opciones.map(o => `${o.ctx}:${o.v}`);
    assert.equal(new Set(significados).size, 3, significados.join(' · '));
    for (const idioma of IDIOMAS) {
      const textos = item.opciones.map(o => frase(o.ctx, o.v, idioma));
      assert.equal(new Set(textos).size, 3, textos.join(' | '));
      // Solo una frase es del contexto del ítem con el valor del ítem.
      const iguales = item.opciones.filter(o => o.ctx === item.ctx && o.v === item.n);
      assert.equal(iguales.length, 1);
      textos.forEach(t => limpio(t, 'opción'));
    }
  }
});

test('ejercicio 2: todo distractor sale de un error típico con nombre, y el id vale para el registro', () => {
  const ids = new Set();
  for (const item of generar(generarSituacion, 23)) {
    for (const o of item.opciones.filter(x => x.error !== null)) {
      ids.add(o.error);
      assert.ok(ERRORES_TIPICOS[o.error] || ERRORES_PROPIOS[o.error], o.error);
      assert.equal(errorValido(o.error), o.error);
    }
  }
  assert.deepEqual([...ids].sort(), ['contexto-equivocado', 'signo-cambiado']);
  for (const e of Object.values(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en);
  // El sentido contrario es exactamente el error `signo-cambiado` de la base.
  assert.equal(ERRORES_TIPICOS['signo-cambiado'].fn(5), -5);
});

test('ejercicio 2: sale cada contexto, con sus dos signos, y años sin el año 0', () => {
  const vistos = new Set();
  for (const item of generar(generarSituacion, 24)) {
    vistos.add(item.ctx);
    for (const o of item.opciones) if (o.ctx === 'anios') assert.notEqual(o.v, 0);
  }
  assert.equal(vistos.size, IDS.length);
});

test('ejercicio 2: la pregunta y los comentarios, limpios y en los dos idiomas', () => {
  for (const item of generar(generarSituacion, 25).slice(0, 400)) {
    for (const idioma of IDIOMAS) {
      limpio(TX.situacion.pregunta[idioma](item.ctx, item.n), 'pregunta');
      limpio(TX.situacion.bien[idioma](item.ctx, item.n), 'bien');
      const contrario = item.opciones.find(o => o.error === 'signo-cambiado');
      limpio(TX.situacion.contrario[idioma](item.ctx, item.n, contrario.v), 'contrario');
      const otro = item.opciones.find(o => o.error === 'contexto-equivocado');
      limpio(TX.situacion.otro_tema[idioma](item.ctx, item.n, otro.ctx, otro.v), 'otro tema');
    }
  }
});

// --- Ejercicio 3: un paso --------------------------------------------------------------

test('ejercicio 3: valor inicial y final dentro de la cota, resultado distinto de 0, y la cuenta cuadra', () => {
  const vistos = new Set();
  for (const item of generar(generarPaso, 31)) {
    assert.ok(Object.keys(PASOS).includes(item.ctx));
    assert.ok(enCota(item.ctx, item.s), `inicio ${item.ctx}: ${item.s}`);
    assert.ok(enCota(item.ctx, item.r), `final ${item.ctx}: ${item.r}`);
    assert.ok(enCota(item.ctx, -item.r), `frase del signo contrario ${item.ctx}: ${-item.r}`);
    assert.notEqual(item.r, 0);
    assert.ok(item.dir === 1 || item.dir === -1);
    assert.equal(item.r, item.s + item.dir * item.m);
    const p = PASOS[item.ctx];
    assert.ok(item.m >= p.m[0] && item.m <= p.m[1] && item.m % p.paso === 0);
    vistos.add(`${item.ctx}${item.dir}${Math.sign(item.r)}`);
  }
  for (const ctx of Object.keys(PASOS)) for (const d of [1, -1]) for (const s of [1, -1]) {
    assert.ok(vistos.has(`${ctx}${d}${s}`), `falta ${ctx} dir ${d} resultado ${s}`);
  }
});

test('ejercicio 3: cambios creíbles (1 a 20 grados, plantas, saldo de un alumno)', () => {
  for (const item of generar(generarPaso, 32)) {
    if (item.ctx === 'temperatura') assert.ok(item.m >= 1 && item.m <= 20);
    if (item.ctx === 'planta') assert.ok(item.m >= 1 && item.m <= 10 && item.s >= -5 && item.s <= 10);
    if (item.ctx === 'saldo') assert.ok(item.s !== 0 && item.m >= 5 && item.m <= 100);
  }
});

test('ejercicio 3: la cuenta es una suma o resta sin paréntesis, y nunca un más delante del resultado', () => {
  for (const item of generar(generarPaso, 33).slice(0, 800)) {
    const cuenta = cuentaPaso(item);
    assert.match(cuenta, /^−?\d+ [+−] \d+$/);
    assert.ok(!cuenta.includes('('));
    limpio(`${cuenta} = ${fmt(item.r)}`, 'cuenta');
    const [a, b] = terminosPaso(item);
    assert.equal(a + b, item.r);
  }
});

test('ejercicio 3: dos frases, la del resultado y la del signo contrario, que no se confunden', () => {
  for (const item of generar(generarPaso, 34)) {
    const frases = frasesPaso(item);
    assert.equal(frases.length, 2);
    assert.equal(frases.filter(f => f.error === null).length, 1);
    assert.deepEqual(frases.map(f => f.v).sort((a, b) => a - b), [-Math.abs(item.r), Math.abs(item.r)]);
    for (const idioma of IDIOMAS) {
      const [x, y] = frases.map(f => fraseResultado(item.ctx, f.v, idioma));
      assert.notEqual(x, y);
      limpio(x, 'frase'); limpio(y, 'frase');
    }
    assert.equal(frases[0].error === null, !item.invertir);
  }
});

test('ejercicio 3: esCorrectoPaso exige el resultado y la frase de ese signo', () => {
  const item = { ctx: 'temperatura', s: -3, dir: 1, m: 5, r: 2, invertir: false };
  assert.ok(esCorrectoPaso(item, 2, 2));
  assert.ok(!esCorrectoPaso(item, 2, -2));
  assert.ok(!esCorrectoPaso(item, -2, 2));
  assert.ok(!esCorrectoPaso(item, 8, 2));
});

test('ejercicio 3: errorDePaso reconoce los errores típicos de la unidad con los números del ítem', () => {
  const casos = [
    [{ ctx: 'temperatura', s: -2, dir: -1, m: 3, r: -5 }, 5, 'regla-signos-en-suma'],
    [{ ctx: 'temperatura', s: -7, dir: 1, m: 3, r: -4 }, -10, 'suma-valores-absolutos'],
    [{ ctx: 'temperatura', s: 3, dir: -1, m: 7, r: -4 }, 4, 'olvida-el-signo'],
    [{ ctx: 'temperatura', s: -3, dir: 1, m: 5, r: 2 }, -2, 'signo-del-primero'],
    [{ ctx: 'temperatura', s: -3, dir: 1, m: 5, r: 2 }, -2, 'signo-del-primero'],
    [{ ctx: 'saldo', s: 20, dir: -1, m: 50, r: -30 }, 30, 'olvida-el-signo'],
    [{ ctx: 'temperatura', s: -3, dir: 1, m: 5, r: 2 }, 17, 'otro-error'],
  ];
  for (const [item, respuesta, esperado] of casos) assert.equal(errorDePaso(item, respuesta), esperado, `${item.s} ${item.dir} ${item.m} → ${respuesta}`);
  // Todo error devuelto vale para el registro de fallos.
  for (const item of generar(generarPaso, 35).slice(0, 500)) {
    for (const v of [-item.r, item.r + 1, Math.abs(item.s) + item.m, -item.s + item.m]) {
      const e = errorDePaso(item, v);
      assert.equal(errorValido(e), e);
      assert.ok(ERRORES_TIPICOS[e] || ERRORES_PROPIOS[e], e);
    }
  }
});

test('ejercicio 3: la recta o el termómetro enseña inicio, final y el 0, sin pasar de 30 o 21 marcas', () => {
  for (const item of generar(generarPaso, 36)) {
    const v = vistaPaso(item);
    assert.equal(v.tipo, item.ctx === 'saldo' ? 'recta' : 'termometro');
    assert.ok(v.min <= Math.min(item.s, item.r, 0) && v.max >= Math.max(item.s, item.r, 0));
    assert.equal(Math.abs(v.min) % v.paso, 0);
    assert.equal(Math.abs(v.max) % v.paso, 0);
    assert.ok((v.max - v.min) / v.paso + 1 <= (v.tipo === 'recta' ? 21 : 30));
  }
});

test('ejercicio 3: enunciados, botones y comentarios limpios en los dos idiomas', () => {
  for (const item of generar(generarPaso, 37).slice(0, 600)) {
    for (const idioma of IDIOMAS) {
      limpio(ENUNCIADO_PASO[item.ctx][idioma](item), `enunciado ${item.ctx}`);
      limpio(BOTON_SALTO[item.ctx][idioma](item), 'botón');
      limpio(TX.paso.bien[idioma](item), 'bien');
      limpio(TX.paso.frase_mal[idioma](item, item.ctx), 'frase mal');
      const [a, b] = terminosPaso(item);
      for (const [id, f] of Object.entries(TX.paso.fallo)) limpio(f[idioma](item, a, b), id);
    }
  }
});

test('el vocabulario de U3-1B-04 aparece aclarado en inglés donde decide la respuesta', () => {
  assert.match(FRASES.saldo.en(-12), /owe \(debo\)/);
  assert.match(FRASES.mar.en(-100), /sea level \(nivel del mar\)/);
  assert.match(FRASES.anios.en(-50), /BC \(a\. C\.\)/);
  assert.match(FRASES.anios.en(50), /AD \(d\. C\.\)/);
  assert.match(FRASES.temperatura.en(-3), /below zero \(bajo cero\)/);
  assert.match(FRASES_RESULTADO.saldo.en(-12), /owe \(debes\)/);
  assert.match(ENUNCIADO_PASO.saldo.en({ s: 10, dir: 1, m: 5 }), /deposit \(ingresas\)/);
  assert.match(ENUNCIADO_PASO.saldo.en({ s: 10, dir: -1, m: 5 }), /withdraw \(sacas\)/);
  assert.match(ENUNCIADO_PASO.temperatura.en({ s: 3, dir: 1, m: 5 }), /rises \(sube\)/);
  assert.match(ENUNCIADO_PASO.temperatura.en({ s: 3, dir: -1, m: 5 }), /falls \(baja\)/);
});

test('los sótanos, con la misma forma en todo el banco: «el segundo sótano» y «basement 2»', () => {
  for (let k = 1; k <= 5; k++) {
    assert.match(frase('planta', -k, 'es'), /^El ascensor está en el (primer|segundo|tercer|cuarto|quinto) sótano$/);
    assert.match(frase('planta', -k, 'en'), new RegExp(`^The lift is in basement ${k} \\(sótano ${k}\\)$`));
    assert.match(fraseResultado('planta', -k, 'es'), /sótano$/);
  }
  assert.equal(frase('planta', 0, 'es'), 'El ascensor está en la planta baja');
});

test('los textos de introducción y los comunes están en los dos idiomas y sin ×', () => {
  for (const clave of ['entero', 'situacion', 'paso']) {
    assert.ok(TX[clave].nombre.es && TX[clave].nombre.en && TX[clave].detalle.es && TX[clave].detalle.en);
    for (const idioma of IDIOMAS) limpio(TX[clave].introduccion[idioma], `introducción ${clave}`);
  }
});
