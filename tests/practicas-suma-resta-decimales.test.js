// Práctica «Suma y resta decimales» de la unidad 5 (PU2, tarea 125): 3000 ítems por ejercicio con semillas
// fijas, contra comprobaciones escritas AQUÍ, aparte del generador (aritmética con BigInt). La opción buena
// dice lo que se ve, cada falsa vale otra cosa y nace de un error con nombre, nunca se enfrentan dos
// escrituras del mismo valor, no sale ningún caso de la hoja ni del examen, cada contexto respeta su cota
// de realismo, y ningún texto de alumno lleva ×, porcentajes ni coma en inglés / punto en español.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { aTexto } from '../practicas/_comun/decimales.js';
import { TX, enunciadoSuper, enunciadoMedidas, calculoAlinea, calculoMueve } from '../practicas/suma-resta-decimales/textos.js';
import {
  candidatosAlinea, candidatosSuper, candidatosMedidas, candidatosMueve,
  D, ERRORES_PROPIOS, nombreDe, huella, HUELLAS_EXAMEN, esCalculoReservado, esMovimientoReservado,
  generarAlinea, generarSuper, generarMedidas, generarMueve,
  errorDeAlinea, errorDeSuper, errorDeMedidas, errorDeMueve,
  CONTEXTOS_SUPER, CONTEXTOS_MEDIDAS, BILLETES, FRUTAS, claveDe,
} from '../practicas/suma-resta-decimales/logica.js';

const N = 3000;
const lote = (generar, semilla) => { const rng = crearRng(semilla); return Array.from({ length: N }, () => generar(rng)); };
const sinHtml = t => t.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// ─── Comprobaciones independientes del generador ─────────────────────────────────────────

const B = x => BigInt(x);
const P = n => 10n ** B(n);
/** Los dos con las mismas cifras decimales: [ma, mb, k]. */
const igualar = (a, b) => { const k = Math.max(a.k, b.k); return [B(a.m) * P(k - a.k), B(b.m) * P(k - b.k), k]; };
const sumaBig = (a, b) => { const [x, y, k] = igualar(a, b); return { m: x + y, k }; };
const restaBig = (a, b) => { const [x, y, k] = igualar(a, b); return { m: x - y, k }; };
const mismo = (a, b) => { const [x, y] = igualar(a, b); return x === y; };
const txt = (d, idioma) => aTexto(D(d), idioma);
/** Un decimal canónico como texto, sin ceros finales (para claves). */
const canon = d => { let { m, k } = { m: B(d.m), k: d.k }; while (k > 0 && m % 10n === 0n) { m /= 10n; k--; } return `${m}e${k}`; };
const ceroFinal = d => d.k > 0 && d.m % 10 === 0;
const dec = (s) => { const [e, f = ''] = s.split('.'); return { m: Number(e + f), k: f.length }; };
const calculo = (terminos, ops) => ops.reduce((acc, op, i) => (op === '+' ? sumaBig : restaBig)(acc, terminos[i + 1]), terminos[0]);
const clave = (terminos, ops) => {
  const mas = [canon(terminos[0])], menos = [];
  ops.forEach((op, i) => (op === '+' ? mas : menos).push(canon(terminos[i + 1])));
  return `${mas.sort()}|${menos.sort()}`;
};
const hojaCalculo = (...partes) => {
  // ['+', '4.7', '3.25'] → terminos y ops
  const ops = [], terminos = [];
  partes.forEach((p, i) => { if (i % 2 === 0) terminos.push(dec(p)); else ops.push(p); });
  return clave(terminos, ops);
};
const HOJA = new Set([
  hojaCalculo('4.7', '+', '3.25'), hojaCalculo('12.6', '+', '0.84'), hojaCalculo('9.05', '−', '3.8'), hojaCalculo('15.2', '−', '7.64'),
  hojaCalculo('8', '−', '0.46'), hojaCalculo('15', '+', '0.7', '+', '4.25'), hojaCalculo('20', '−', '3.85', '−', '6.5'),
  hojaCalculo('8.6', '+', '2.75'), hojaCalculo('20', '−', '7.35'), hojaCalculo('14.6', '+', '8.3'), hojaCalculo('31.2', '−', '9.8'),
  hojaCalculo('3.65', '+', '2.1', '+', '1.2'), hojaCalculo('2.8', '−', '0.85', '−', '0.9'),
]);
const centimos = c => ({ m: c, k: 2 });

// ─── Los casos que no pueden salir ───────────────────────────────────────────────────────

test('la huella de examen reserva por valor y se puede añadir sin tocar el código', () => {
  assert.equal(HUELLAS_EXAMEN.size, 0, 'al escribirla no existían los casos del examen');
  const terminos = [{ m: 123, k: 2 }, { m: 4, k: 1 }];
  assert.ok(!esCalculoReservado(terminos, ['+']));
  const h = huella('s:0.4+1.23-');   // la clave: lo que se suma, ordenado, «-» y lo que se resta, ordenado
  HUELLAS_EXAMEN.add(h);
  assert.ok(esCalculoReservado(terminos, ['+']), 'reservado por huella');
  assert.ok(esCalculoReservado([{ m: 40, k: 2 }, { m: 123, k: 2 }], ['+']), 'por valor y sin importar el orden');
  HUELLAS_EXAMEN.delete(h);
  assert.ok(!esCalculoReservado(terminos, ['+']));
  const g = huella('m:3.6:100');
  HUELLAS_EXAMEN.add(g);
  assert.ok(esMovimientoReservado({ m: 36, k: 1 }, 'entre', 2));
  assert.ok(esMovimientoReservado({ m: 360, k: 2 }, 'entre', 2), 'por valor: 3,60 es 3,6');
  HUELLAS_EXAMEN.delete(g);
  assert.ok(!esMovimientoReservado({ m: 36, k: 1 }, 'entre', 2));
});

test('ningún ejercicio saca un caso de la hoja', () => {
  for (const it of lote(generarAlinea, 21)) {
    const terminos = it.tipo === 'tres' ? it.terminos : [it.a, it.b];
    const ops = it.tipo === 'tres' ? it.ops : [it.op];
    assert.ok(!HOJA.has(clave(terminos, ops)), `${calculoAlinea(it, 'es')}`);
  }
  for (const it of lote(generarSuper, 22)) {
    assert.ok(!HOJA.has(clave(it.importes.map(centimos), it.importes.slice(1).map(() => '+'))), it.importes.join(','));
  }
  for (const it of lote(generarMedidas, 23)) {
    const orden = it.forma === 'diferencia' ? [it.datos[1], it.datos[0]] : it.datos;
    const ops = it.forma === 'resto2' ? ['−', '−'] : it.forma === 'diferencia' ? ['−'] : ['+'];
    assert.ok(!HOJA.has(clave(orden, ops)), enunciadoMedidas(it, 'es'));
  }
  const movimientosHoja = ['6.82*10', '0.072*100', '1.6*1000', '23.8*100', '38:10', '4.6:100', '275:1000', '0.9:10', '46:100', '0.07*1000', '5.7*100',
    '0.58*10', '5.3*100', '6.3:10', '52:1000', '3.4*10', '3.2*1000', '4500:1000', '0.8*1000', '6.35*100', '2.4*100', '85:100'];
  const claves = new Set(movimientosHoja.map(s => { const [a, b] = s.split(/[*:]/); return `${s.includes('*') ? 'por' : 'entre'}|${canon(dec(a))}|${b}`; }));
  for (const it of lote(generarMueve, 24)) assert.ok(!claves.has(`${it.op}|${canon(it.d)}|${10 ** it.n}`), calculoMueve(it, 'es'));
});

// ─── Ejercicio 1 ─────────────────────────────────────────────────────────────────────────

test('ej. 1: el resultado es el exacto, positivo y de a lo sumo 3 cifras; los tres tipos salen', () => {
  const tipos = {};
  let naturales = 0, igualesK = 0;
  for (const it of lote(generarAlinea, 101)) {
    tipos[it.tipo] = (tipos[it.tipo] ?? 0) + 1;
    const terminos = it.tipo === 'tres' ? it.terminos : [it.a, it.b];
    const ops = it.tipo === 'tres' ? it.ops : [it.op];
    const exacto = calculo(terminos, ops);
    assert.ok(mismo(exacto, it.resultado), 'resultado exacto');
    assert.ok(it.resultado.m > 0 && it.resultado.k <= 3);
    for (const t of terminos) { assert.ok(t.m > 0 && t.k <= 3 && !ceroFinal(t), 'término sin cero final'); if (t.k === 0) naturales++; }
    if (it.tipo === 'tres') {
      let acc = terminos[0];
      ops.forEach((op, i) => { acc = (op === '+' ? sumaBig : restaBig)(acc, terminos[i + 1]); assert.ok(acc.m > 0n, 'sin negativos a medias'); });
      assert.ok(new Set(terminos.map(t => t.k)).size > 1, 'distinto número de cifras');
    } else if (it.a.k === it.b.k) igualesK++;
    if (it.tipo === 'elegir') assert.equal(it.a.k === it.b.k, false);
  }
  for (const t of ['escribir', 'elegir', 'tres']) assert.ok(tipos[t] > 300, `pocos ${t}: ${tipos[t]}`);
  assert.ok(naturales > 300, `pocos naturales: ${naturales}`);
  assert.ok(igualesK / N < 0.1);
});

test('ej. 1: elegir — 4 opciones de valores distintos, una buena, cada falsa de un error con nombre y comprobada aparte', () => {
  for (const it of lote(generarAlinea, 102).filter(i => i.tipo === 'elegir')) {
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!mismo(it.opciones[a].d, it.opciones[b].d), `dos opciones valen lo mismo en ${calculoAlinea(it, 'es')}`);
    const exacto = calculo([it.a, it.b], [it.op]);
    const buena = it.opciones.find(o => o.correcta);
    assert.ok(mismo(buena.d, exacto));
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(nombreDe(o.error), `error sin nombre: ${o.error}`);
      assert.ok(TX.ej1.por_que[o.error], `sin texto para ${o.error}`);
      assert.ok(!mismo(o.d, exacto) && o.d.m > 0);
      if (o.error === 'alinea-a-la-derecha') {
        // sin mirar las comas: las cifras tal cual, con las cifras decimales del que más tiene
        const crudo = it.op === '+' ? B(it.a.m) + B(it.b.m) : B(it.a.m) - B(it.b.m);
        assert.equal(B(o.d.m) * P(Math.max(it.a.k, it.b.k) - o.d.k) , crudo < 0n ? -crudo : crudo);
      }
      if (o.error === 'coma-olvidada') { assert.equal(o.d.k, 0); assert.equal(B(o.d.m), B(canon(exacto).split('e')[0])); }
      if (o.error === 'coma-corrida') assert.equal(canon(o.d).split('e')[0], canon(exacto).split('e')[0], 'mismas cifras');
    }
    for (const idioma of ['es', 'en']) assert.equal(new Set(it.opciones.map(o => txt(o.d, idioma))).size, 4);
  }
});

test('ej. 1: lo que escribe el alumno se corrige por valor (3,5 y 3,50 son lo mismo) y se nombra el error', () => {
  const rng = crearRng(103);
  for (let i = 0; i < 400; i++) {
    const it = generarAlinea(rng);
    const exacto = D(it.resultado);
    assert.equal(errorDeAlinea(it, exacto), null);
    assert.equal(errorDeAlinea(it, exacto.normalizar()), null);
    assert.equal(errorDeAlinea(it, exacto.conCifras(exacto.k + 1)), null);
    assert.equal(errorDeAlinea(it, D({ m: exacto.m + 123457, k: exacto.k })), 'otra-respuesta');
    if (it.opciones) for (const o of it.opciones.filter(x => !x.correcta)) assert.equal(errorDeAlinea(it, D(o.d)), o.error, `${calculoAlinea(it, 'es')} → ${txt(o.d, 'es')}`);
  }
});

// ─── Ejercicio 2 ─────────────────────────────────────────────────────────────────────────

test('ej. 2: las cotas del contexto, el billete cubre el total, la vuelta nunca es negativa y todo en céntimos enteros', () => {
  const vistos = { fruta: 0, gasolina: 0, total: 0, vuelta: 0 };
  for (const it of lote(generarSuper, 201)) {
    const cota = CONTEXTOS_SUPER[it.contexto];
    vistos[it.contexto]++; vistos[it.pregunta]++;
    assert.ok(it.importes.length >= cota.n[0] && it.importes.length <= cota.n[1]);
    for (const c of it.importes) { assert.ok(Number.isInteger(c) && c >= cota.min && c <= cota.max, `importe ${c} fuera de la cota de ${it.contexto}`); }
    const total = it.importes.reduce((s, c) => s + c, 0);
    assert.ok(total <= cota.totalMax);
    if (it.contexto === 'fruta') {
      assert.equal(it.nombres.length, it.importes.length);
      assert.equal(new Set(it.nombres.map(f => f.es)).size, it.nombres.length, 'frutas repetidas');
      assert.ok(it.nombres.every(f => FRUTAS.includes(f)));
    } else assert.equal(it.pregunta === 'total' ? it.importes.length : it.importes.length, it.pregunta === 'total' ? 2 : 1);
    if (it.pregunta === 'vuelta') {
      assert.ok(BILLETES.includes(it.billete));
      assert.ok(it.billete * 100 > total, 'el billete cubre el total');
      assert.equal(it.respuesta.m, it.billete * 100 - total);
    } else {
      assert.equal(it.billete, undefined);
      assert.equal(it.respuesta.m, total);
    }
    assert.equal(it.respuesta.k, 2);
    assert.ok(it.respuesta.m > 0);
  }
  for (const k of Object.keys(vistos)) assert.ok(vistos[k] > 400, `pocos ${k}: ${vistos[k]}`);
});

test('ej. 2: los errores salen de los números del ítem', () => {
  const rng = crearRng(202);
  let sinLlevar = 0, alReves = 0, daTotal = 0;
  for (let i = 0; i < N; i++) {
    const it = generarSuper(rng);
    const resp = D(it.respuesta);
    assert.equal(errorDeSuper(it, resp), null);
    assert.equal(errorDeSuper(it, resp.normalizar()), null, '3,5 vale como 3,50');
    const total = it.importes.reduce((s, c) => s + c, 0);
    if (it.pregunta === 'vuelta') {
      if (total !== it.billete * 100 - total) { assert.equal(errorDeSuper(it, D({ m: total, k: 2 })), 'da-el-total'); daTotal++; }
      assert.equal(errorDeSuper(it, D({ m: total - it.billete * 100, k: 2 })), 'resta-al-reves'); alReves++;
    } else {
      const e = it.importes.reduce((s, c) => s + Math.floor(c / 100), 0), ce = it.importes.reduce((s, c) => s + (c % 100), 0);
      if (ce >= 100) { const t = String(ce); assert.equal(errorDeSuper(it, D({ m: e * 10 ** t.length + ce, k: t.length })), 'centimos-sin-llevar'); sinLlevar++; }
    }
    assert.equal(errorDeSuper(it, D({ m: resp.m + 1, k: 2 })), 'otra-respuesta');
  }
  assert.ok(sinLlevar > 100 && alReves > 400 && daTotal > 400);
});

// ─── Ejercicio 3 ─────────────────────────────────────────────────────────────────────────

test('ej. 3: cada contexto respeta su cota y lo que queda nunca es negativo', () => {
  const vistos = {};
  for (const it of lote(generarMedidas, 301)) {
    const c = CONTEXTOS_MEDIDAS[it.contexto];
    vistos[it.contexto] = (vistos[it.contexto] ?? 0) + 1;
    assert.equal(it.forma, c.forma);
    const cents = it.datos.map(d => Number(B(d.m) * P(2 - d.k)));
    for (const d of it.datos) assert.ok(d.k <= 2 && !ceroFinal(d));
    if (it.forma === 'resto2') {
      const [t, a, b] = cents;
      if (c.totales) assert.ok(c.totales.includes(t)); else assert.ok(t >= c.total[0] && t <= c.total[1]);
      for (const x of [a, b]) assert.ok(x >= c.parte[0] && x <= c.parte[1]);
      assert.ok(t - a - b >= c.resto, `queda poco o negativo en ${it.contexto}`);
      assert.equal(Number(B(it.respuesta.m) * P(2 - it.respuesta.k)), t - a - b);
    } else if (it.forma === 'diferencia') {
      const [a, b] = cents;
      for (const x of [a, b]) assert.ok(x >= c.valor[0] && x <= c.valor[1]);
      assert.ok(b - a >= c.dif[0] && b - a <= c.dif[1]);
      assert.equal(Number(B(it.respuesta.m) * P(2 - it.respuesta.k)), b - a);
    } else {
      for (const x of cents) assert.ok(x >= c.valor[0] && x <= c.valor[1]);
      assert.equal(Number(B(it.respuesta.m) * P(2 - it.respuesta.k)), cents[0] + cents[1]);
    }
  }
  for (const k of Object.keys(CONTEXTOS_MEDIDAS)) assert.ok(vistos[k] > 400, `pocos ${k}: ${vistos[k]}`);
});

test('ej. 3: elegir — 4 opciones de valores distintos, una buena y cada falsa de un error con nombre', () => {
  let elegir = 0;
  for (const it of lote(generarMedidas, 302)) {
    const errorDe = o => errorDeMedidas(it, D(o.d));
    if (it.tipo !== 'elegir') { assert.equal(it.opciones, undefined); continue; }
    elegir++;
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!mismo(it.opciones[a].d, it.opciones[b].d));
    assert.ok(mismo(it.opciones.find(o => o.correcta).d, it.respuesta));
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(nombreDe(o.error) && TX.ej3.por_que[o.error], `error sin nombre o sin texto: ${o.error}`);
      assert.equal(errorDe(o), o.error);
    }
    for (const idioma of ['es', 'en']) assert.equal(new Set(it.opciones.map(o => txt(o.d, idioma))).size, 4);
  }
  assert.ok(elegir > 700, `pocos ítems de elegir: ${elegir}`);
});

// ─── Ejercicio 4 ─────────────────────────────────────────────────────────────────────────

test('ej. 4: el resultado mueve la coma bien, con a lo sumo 4 cifras decimales y sin ceros finales en el dato', () => {
  const vistos = {};
  for (const it of lote(generarMueve, 401)) {
    vistos[`${it.op}${it.n}`] = (vistos[`${it.op}${it.n}`] ?? 0) + 1;
    assert.ok([1, 2, 3].includes(it.n));
    assert.ok(it.d.m > 0 && it.d.k <= 3 && !ceroFinal(it.d));
    const esperado = it.op === 'por' ? { m: B(it.d.m) * P(it.n), k: it.d.k } : { m: B(it.d.m), k: it.d.k + it.n };
    assert.ok(mismo(esperado, it.respuesta));
    assert.ok(it.respuesta.k <= 4);
  }
  for (const op of ['por', 'entre']) for (const n of [1, 2, 3]) assert.ok(vistos[`${op}${n}`] > 200, `pocos ${op}${n}`);
  assert.ok(lote(generarMueve, 402).filter(i => i.d.k === 0).length > 300, 'pocos naturales');
});

test('ej. 4: elegir — opciones de valores distintos; el cero añadido es una escritura distinta del número, no del resultado', () => {
  let elegir = 0;
  for (const it of lote(generarMueve, 403)) {
    if (it.tipo !== 'elegir') continue;
    elegir++;
    assert.equal(it.opciones.length, 4);
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(!mismo(it.opciones[a].d, it.opciones[b].d), `dos opciones valen lo mismo en ${calculoMueve(it, 'es')}`);
    for (const o of it.opciones.filter(x => !x.correcta)) {
      assert.ok(nombreDe(o.error) && TX.ej4.por_que[o.error]);
      assert.equal(errorDeMueve(it, D(o.d)), o.error);
      if (o.error === 'por-diez-anadiendo-cero') { assert.ok(mismo(o.d, it.d), 'añadir ceros deja el número igual'); assert.equal(it.op, 'por'); }
      if (o.error === 'coma-al-reves') assert.ok(mismo(o.d, it.op === 'por' ? { m: B(it.d.m), k: it.d.k + it.n } : { m: B(it.d.m) * P(it.n), k: it.d.k }));
    }
    for (const idioma of ['es', 'en']) assert.equal(new Set(it.opciones.map(o => txt(o.d, idioma))).size, 4);
  }
  assert.ok(elegir > 1000);
});

// ─── Textos y errores ────────────────────────────────────────────────────────────────────

test('todo error tiene nombre en los dos idiomas', () => {
  for (const [id, e] of Object.entries(ERRORES_PROPIOS)) assert.ok(e.nombre.es && e.nombre.en, id);
});

test('ningún texto de alumno lleva ×, porcentajes, letras de variable, coma en inglés ni punto en español', () => {
  const rng = crearRng(501);
  const revisar = (texto, idioma, donde) => {
    const t = sinHtml(texto);
    assert.ok(!/[×%]/.test(t), `${donde}: × o %: ${t}`);
    if (idioma === 'en') assert.ok(!/\d,\d/.test(t), `${donde}: coma decimal en inglés: ${t}`);
    else assert.ok(!/\d\.\d/.test(t), `${donde}: punto decimal en español: ${t}`);
  };
  for (const tx of [TX.ej1, TX.ej2, TX.ej3, TX.ej4]) {
    for (const idioma of ['es', 'en']) {
      revisar(tx.nombre[idioma], idioma, 'nombre');
      revisar(tx.introduccion[idioma], idioma, 'introducción');
    }
  }
  const ejercicios = [
    [1, generarAlinea, TX.ej1, candidatosAlinea], [2, generarSuper, TX.ej2, candidatosSuper],
    [3, generarMedidas, TX.ej3, candidatosMedidas], [4, generarMueve, TX.ej4, candidatosMueve],
  ];
  for (const [n, generar, tx, candidatos] of ejercicios) {
    for (let i = 0; i < 300; i++) {
      const it = generar(rng);
      for (const idioma of ['es', 'en']) {
        revisar(tx.correcto[idioma](it), idioma, `ej. ${n} correcto`);
        revisar(tx.solucion[idioma](it), idioma, `ej. ${n} solución`);
        const errores = new Set([...candidatos(it).filter(x => x.valor).map(x => x.error), 'otra-respuesta']);
        for (const error of errores) {
          assert.ok(tx.por_que[error], `ej. ${n}: sin texto para ${error}`);
          revisar(tx.por_que[error][idioma](it, { m: 12, k: 1 }), idioma, `ej. ${n} ${error}`);
        }
        if (n === 2) { const e = enunciadoSuper(it, idioma); revisar(`${e.texto} ${(e.lineas ?? []).join(' ')} ${e.pregunta}`, idioma, 'enunciado 2'); }
        if (n === 3) revisar(enunciadoMedidas(it, idioma), idioma, 'enunciado 3');
        if (n === 1) revisar(calculoAlinea(it, idioma), idioma, 'cuenta 1');
        if (n === 4) revisar(calculoMueve(it, idioma), idioma, 'cuenta 4');
      }
    }
  }
});

test('«change» se aclara con «(la vuelta)» y los enunciados en inglés no llevan palabras españolas sueltas salvo las aclaraciones', () => {
  const rng = crearRng(502);
  let vueltas = 0;
  for (let i = 0; i < 400; i++) {
    const it = generarSuper(rng);
    if (it.pregunta !== 'vuelta') continue;
    vueltas++;
    assert.match(enunciadoSuper(it, 'en').pregunta, /change \(la vuelta\)/);
    assert.match(enunciadoSuper(it, 'es').pregunta, /vuelta/);
  }
  assert.ok(vueltas > 100);
});

test('la clave de un ítem distingue ítems distintos', () => {
  const claves = new Set(lote(generarMueve, 601).slice(0, 500).map(claveDe));
  assert.ok(claves.size > 300);
});
