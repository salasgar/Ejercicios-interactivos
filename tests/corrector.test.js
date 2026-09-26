// Lógica del corrector de exámenes semanales (corrector/logica.js): lectura de
// respuestas tecleadas, corrección con la puntuación del examen, estadísticas y CSV.

import test from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../corrector/logica.js';

// Una clave mínima con el formato que exporta comun/exportar_clave.py: 4 preguntas,
// dos versiones con orden de preguntas distinto.
function claveDePrueba() {
  const destrezas = ['1A-01', '1B-02', '1C-03', '1C-04'];
  const version = (codigo, orden, letras, extra = false) => ({
    codigo, extra, clave: letras,
    preguntas: orden.map((pos, i) => ({
      n: i + 1, pos, item: destrezas[pos - 1], correcta: letras[i], enunciado: `Work out: $\\ ${pos}+${pos}$`,
      opciones: [...'ABCD'].map(l => ({ letra: l, texto: `$${l}${pos}$`, expl: l === letras[i] ? 'bien' : `error ${l}` })),
    })),
  });
  return {
    formato: L.FORMATO_CLAVE, unidad: 1, semana: 1, fecha: '2026-09-18', n_preguntas: 4, opciones: 4, destrezas,
    versiones: [version('1111', [1, 2, 3, 4], 'ABCD'), version('2222', [4, 3, 2, 1], 'DDAA'), version('3333', [2, 1, 4, 3], 'BCDA', true)],
  };
}

test('comprobarClave acepta la clave de prueba y rechaza las rotas', () => {
  const clave = claveDePrueba();
  assert.equal(L.comprobarClave(clave), null);
  assert.match(L.comprobarClave(null), /No es/);
  assert.match(L.comprobarClave({ ...clave, formato: 99 }), /Formato/);
  const rota = claveDePrueba();
  rota.versiones[0].clave = 'ABCA';
  assert.match(L.comprobarClave(rota), /no casa/);
  const repetida = claveDePrueba();
  repetida.versiones[1].codigo = '1111';
  assert.match(L.comprobarClave(repetida), /repetido/);
});

test('versionDe busca por código, admitiendo número o texto con espacios', () => {
  const clave = claveDePrueba();
  assert.equal(L.versionDe(clave, 2222).codigo, '2222');
  assert.equal(L.versionDe(clave, ' 1111 ').codigo, '1111');
  assert.equal(L.versionDe(clave, '9999'), null);
  assert.equal(L.versionDe(null, '1111'), null);
});

test('limpiarTecleo: letras en cualquier caja, blancos y nulas; ignora el resto y corta en n', () => {
  assert.equal(L.limpiarTecleo('abBc', 20), 'ABBC');
  assert.equal(L.limpiarTecleo('a b-c_d0.', 20), 'A-B-C-D--');
  assert.equal(L.limpiarTecleo('a?bx', 20), 'A?B?');
  assert.equal(L.limpiarTecleo('a1e,fb', 20), 'AB');
  assert.equal(L.limpiarTecleo('ABCDABCD', 4), 'ABCD');
  assert.equal(L.limpiarTecleo(null, 4), '');
});

test('limpiarTecleo: U I O P valen siempre por A B C D', () => {
  assert.equal(L.limpiarTecleo('uiop', 20), 'ABCD');
  assert.equal(L.limpiarTecleo('UiOp', 20), 'ABCD');
  assert.equal(L.limpiarTecleo('u i-o?p', 20), 'A-B-C?D');   // blancos y nulas, igual
  assert.equal(L.limpiarTecleo('abcd', 20), 'ABCD');          // las letras siguen valiendo
  assert.equal(L.limpiarTecleo('u0o', 20), 'A-C');            // el 0 sigue siendo blanco, la O es C
  assert.equal(L.limpiarTecleo('uiop', 2), 'AB');
});

test('completar rellena con blancos y marcar cambia una casilla (la misma letra la deja en blanco)', () => {
  assert.equal(L.completar('AB', 4), 'AB--');
  assert.equal(L.completar('ABCDE', 4), 'ABCD');
  assert.equal(L.marcar('AB', 4, 4, 'C'), 'AB-C');
  assert.equal(L.marcar('AB-C', 4, 4, 'C'), 'AB');
  assert.equal(L.marcar('', 4, 1, 'D'), 'D');
  assert.equal(L.marcar('ABCD', 4, 2, 'A'), 'AACD');
});

test('corregir aplica +1, −1/3, blanco 0 y nota mínima 0', () => {
  const v = L.versionDe(claveDePrueba(), '1111'); // clave ABCD
  let c = L.corregir(v, 'ABCD');
  assert.deepEqual([c.aciertos, c.fallos, c.blancos, c.nulas, c.puntos, c.nota], [4, 0, 0, 0, 4, 10]);
  c = L.corregir(v, 'AB');
  assert.equal(c.respuestas, 'AB--');
  assert.deepEqual([c.aciertos, c.fallos, c.blancos, c.puntos, c.nota], [2, 0, 2, 2, 5]);
  c = L.corregir(v, 'ABDD'); // dos aciertos, un fallo, un acierto
  assert.deepEqual([c.aciertos, c.fallos, c.puntos, c.nota], [3, 1, 2.67, 6.67]);
  c = L.corregir(v, 'BBBB'); // un acierto, tres fallos: 1 − 1 = 0
  assert.deepEqual([c.aciertos, c.fallos, c.puntos, c.nota], [1, 3, 0, 0]);
  c = L.corregir(v, 'BADC'); // cuatro fallos: no baja de 0
  assert.deepEqual([c.puntos, c.nota], [0, 0]);
  c = L.corregir(v, 'A?B-');
  assert.deepEqual([c.aciertos, c.fallos, c.blancos, c.nulas, c.puntos], [1, 1, 1, 1, 0.67]);
  assert.deepEqual(c.detalle.map(d => d.estado), ['acierto', 'nula', 'fallo', 'blanco']);
  assert.deepEqual(c.detalle.map(d => d.item), ['1A-01', '1B-02', '1C-03', '1C-04']);
});

test('corregir respeta el orden impreso de cada versión (posición ≠ número)', () => {
  const v = L.versionDe(claveDePrueba(), '2222'); // preguntas 4,3,2,1; clave DDAA
  const c = L.corregir(v, 'DDAA');
  assert.equal(c.aciertos, 4);
  assert.deepEqual(c.detalle.map(d => d.pos), [4, 3, 2, 1]);
  assert.deepEqual(c.detalle.map(d => d.item), ['1C-04', '1C-03', '1B-02', '1A-01']);
});

test('corregir con preguntas anuladas: solo a quien no la acertó, y la nota sobre n − 1', () => {
  const v = { ...L.versionDe(claveDePrueba(), '1111'), anuladas: [2] }; // clave ABCD
  let c = L.corregir(v, 'ABCD'); // la acertó: se le queda como estaba
  assert.deepEqual([c.aciertos, c.anuladas, c.sobre, c.puntos, c.nota], [4, 0, 4, 4, 10]);
  c = L.corregir(v, 'A-C-'); // en blanco: 2 sobre 3 (= 2/4 × 4/3)
  assert.deepEqual([c.aciertos, c.blancos, c.anuladas, c.sobre, c.puntos, c.nota], [2, 1, 1, 3, 2, 6.67]);
  c = L.corregir(v, 'ADC-'); // fallada: deja de restar su 1/3
  assert.deepEqual([c.aciertos, c.fallos, c.anuladas, c.sobre, c.puntos, c.nota], [2, 0, 1, 3, 2, 6.67]);
  assert.deepEqual(c.detalle.map(d => d.estado), ['acierto', 'anulada', 'acierto', 'blanco']);
  assert.equal(c.detalle[1].real, 'fallo');
  c = L.corregir(v, 'BDAD'); // un acierto y dos fallos, más la anulada: 1 − 2/3 sobre 3
  assert.deepEqual([c.puntos, c.nota], [0.33, 1.11]);
  // Nadie adelanta a quien la acertó con el resto igual.
  assert.ok(L.corregir(v, 'ABC-').nota > L.corregir(v, 'ADC-').nota);
});

test('analizarAnuladas y textoAnuladas: «código:número» separados por comas', () => {
  const clave = claveDePrueba();
  assert.deepEqual(L.analizarAnuladas('', clave), { anuladas: {}, error: null });
  assert.deepEqual(L.analizarAnuladas('2222:3, 1111:4:2', clave).anuladas, { 2222: [3], 1111: [2, 4] });
  assert.match(L.analizarAnuladas('9999:1', clave).error, /no es un código/);
  assert.match(L.analizarAnuladas('1111', clave).error, /falta el número/);
  assert.match(L.analizarAnuladas('1111:5', clave).error, /no válidas/);
  assert.match(L.analizarAnuladas('1111:2:2', clave).error, /repetida/);
  assert.match(L.analizarAnuladas('1111:1:2:3:4', clave).error, /todas/);
  clave.versiones[1].anuladas = [3];
  clave.versiones[0].anuladas = [2, 4];
  assert.equal(L.textoAnuladas(clave), '1111:2:4, 2222:3');
  assert.equal(L.comprobarClave(clave), null);
  clave.versiones[0].anuladas = [7];
  assert.match(L.comprobarClave(clave), /anuladas no válidas/);
});

test('analizarAlumnos: 2 o 3 campos, identificadores como en la app y sin repetidos', () => {
  const { alumnos, errores } = L.analizarAlumnos(
    'María García López; 1ºA\nJuan Pérez Ruiz; juan.perez; 1ºC/D\nAna Ruiz; ana.ruiz@murciaeduca.es; 1ºA\nAna Ruiz; 1ºA\nsolo un campo\nMaría García Soto; 1ºA');
  assert.deepEqual(alumnos, [
    { id: 'maria.garcia', nombre: 'María García López', grupo: '1ºA' },
    { id: 'juan.perez', nombre: 'Juan Pérez Ruiz', grupo: '1ºC/D' },
    { id: 'ana.ruiz@murciaeduca.es', nombre: 'Ana Ruiz', grupo: '1ºA' },
    { id: 'ana.ruiz', nombre: 'Ana Ruiz', grupo: '1ºA' },
  ]);
  assert.equal(errores.length, 2);
  assert.match(errores[0], /Línea 5/);
  assert.match(errores[1], /Línea 6.*maria\.garcia/);
  // con existentes
  const otra = L.analizarAlumnos('María García López; 1ºA', alumnos);
  assert.equal(otra.alumnos.length, 0);
  assert.match(otra.errores[0], /ya existe/);
});

test('resumenSemana corrige cada registro con su versión y ordena por grupo y nombre', () => {
  const clave = claveDePrueba();
  const alumnos = [{ id: 'b', nombre: 'Beatriz', grupo: '1ºC/D' }, { id: 'a', nombre: 'Álvaro', grupo: '1ºA' }, { id: 'c', nombre: 'Carlos', grupo: '1ºA' }];
  const registros = [
    { semana: 1, alumno: 'b', codigo: '2222', respuestas: 'DDAA', obs: '', ts: 1 },
    { semana: 1, alumno: 'c', codigo: '1111', respuestas: 'AB--', obs: 'nula la 3', ts: 2 },
    { semana: 1, alumno: 'a', codigo: '1111', respuestas: 'BBBB', obs: '', ts: 3 },
    { semana: 1, alumno: 'x', codigo: '9999', respuestas: 'ABCD', obs: '', ts: 4 }, // código desconocido: se ignora
  ];
  const filas = L.resumenSemana(clave, registros, alumnos);
  assert.deepEqual(filas.map(f => [f.nombre, f.grupo, f.nota]), [['Álvaro', '1ºA', 0], ['Carlos', '1ºA', 5], ['Beatriz', '1ºC/D', 10]]);
  assert.equal(L.media(filas.map(f => f.nota)), 5);
  assert.equal(L.media([]), null);
});

test('estadisticasPreguntas agrupa por posición (destreza) y por versión', () => {
  const clave = claveDePrueba();
  const registros = [
    { semana: 1, alumno: 'a', codigo: '1111', respuestas: 'ABCD' },
    { semana: 1, alumno: 'b', codigo: '1111', respuestas: 'ABD-' },
    { semana: 1, alumno: 'c', codigo: '2222', respuestas: 'DDAB' }, // pos 4,3,2,1: bien, bien, bien, mal
  ];
  const s = L.estadisticasPreguntas(clave, registros);
  assert.deepEqual(s.map(p => [p.pos, p.item, p.n, p.aciertos, p.fallos, p.blancos]), [
    [1, '1A-01', 3, 2, 1, 0], [2, '1B-02', 3, 3, 0, 0], [3, '1C-03', 3, 2, 1, 0], [4, '1C-04', 3, 2, 0, 1],
  ]);
  assert.deepEqual(s[0].versiones['2222'], { numero: 4, correcta: 'A', n: 1, aciertos: 0, letras: { A: 0, B: 1, C: 0, D: 0, '-': 0, '?': 0 } });
  assert.deepEqual(s[2].versiones['1111'].letras, { A: 0, B: 0, C: 1, D: 1, '-': 0, '?': 0 });
});

test('opcionesElegidas: por versión, cada opción con su texto, su explicación y cuántos la eligieron', () => {
  const clave = claveDePrueba();
  clave.versiones[0].anuladas = [3];
  const registros = [
    { semana: 1, alumno: 'a', codigo: '1111', respuestas: 'ABCD' },
    { semana: 1, alumno: 'b', codigo: '1111', respuestas: 'ABD-' },   // la 3 anulada: su D cuenta igual
    { semana: 1, alumno: 'c', codigo: '1111', respuestas: 'AB??' },
    { semana: 1, alumno: 'd', codigo: '2222', respuestas: 'DDAB' },   // pos 1 es su nº 4: B, mal
  ];
  const r = L.opcionesElegidas(clave, L.estadisticasPreguntas(clave, registros));
  const p3 = r[2].versiones.find(v => v.codigo === '1111');
  assert.deepEqual(p3.opciones.map(o => [o.letra, o.cuenta, o.correcta]), [['A', 0, false], ['B', 0, false], ['C', 1, true], ['D', 1, false]]);
  assert.deepEqual([p3.numero, p3.n, p3.blancos, p3.nulas, p3.opciones[3].expl, p3.opciones[3].texto], [3, 3, 0, 1, 'error D', '$D3$']);
  const p4 = r[3].versiones.find(v => v.codigo === '1111');
  assert.deepEqual([p4.blancos, p4.nulas], [1, 1]);
  // Solo las versiones con registros, en el orden de la clave.
  assert.deepEqual(r[0].versiones.map(v => [v.codigo, v.numero]), [['1111', 1], ['2222', 4]]);
  assert.deepEqual(r[0].masElegido, { codigo: '2222', numero: 4, letra: 'B', texto: '$B1$', expl: 'error B', cuenta: 1, correcta: false });
  assert.equal(r[1].masElegido, null);                               // todos la acertaron
});

test('fichaAlumno reúne las semanas del alumno con la opción elegida y su explicación', () => {
  const clave = claveDePrueba();
  const claves = { 1: clave, 2: { ...clave, semana: 2, fecha: '2026-09-25' } };
  const registros = [
    { semana: 2, alumno: 'a', codigo: '2222', respuestas: 'DDAB' },
    { semana: 1, alumno: 'a', codigo: '1111', respuestas: 'AB-D' },
    { semana: 1, alumno: 'b', codigo: '1111', respuestas: 'ABCD' },
  ];
  const ficha = L.fichaAlumno(claves, registros, 'a');
  assert.deepEqual(ficha.map(s => [s.semana, s.fecha, s.nota]), [[1, '2026-09-18', 7.5], [2, '2026-09-25', 6.67]]);
  const p3 = ficha[0].preguntas[2];
  assert.deepEqual([p3.estado, p3.elegida, p3.buena.texto], ['blanco', null, '$C3$']);
  const p4 = ficha[1].preguntas[3];
  assert.deepEqual([p4.item, p4.estado, p4.elegida.expl, p4.buena.letra], ['1A-01', 'fallo', 'error B', 'A']);
});

test('CSV: «;», BOM, coma decimal y una fila por alumno o por respuesta', () => {
  const clave = claveDePrueba();
  const alumnos = [{ id: 'a', nombre: 'Álvaro; el de A', grupo: '1ºA' }];
  const registros = [{ semana: 1, alumno: 'a', codigo: '1111', respuestas: 'ABDD', obs: '', ts: 0 }];
  const resumen = L.csvResumen({ 1: clave }, registros, alumnos);
  const lineas = resumen.split('\r\n');
  assert.ok(resumen.startsWith('﻿Semana;Fecha examen;Usuario'));
  assert.equal(lineas[1], '1;2026-09-18;a;"Álvaro; el de A";1ºA;1111;ABDD;3;1;0;0;0;2,67;4;6,67;;');
  const detalle = L.csvDetalle({ 1: clave }, registros, alumnos).split('\r\n');
  assert.equal(detalle.length, 1 + 4 + 1);
  assert.equal(detalle[3], '1;a;"Álvaro; el de A";1ºA;1111;3;3;1C-03;D;C;fallo;D3;Work out: 3+3');
});

test('sinRegistrar deja solo a los que faltan por teclear esa semana', () => {
  const alumnos = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const registros = [
    { semana: 1, alumno: 'b' },
    { semana: 2, alumno: 'c' },   // otra semana: c sigue faltando en la 1
  ];
  assert.deepEqual(L.sinRegistrar(alumnos, registros, 1).map(a => a.id), ['a', 'c']);
  assert.deepEqual(L.sinRegistrar(alumnos, registros, 2).map(a => a.id), ['a', 'b']);
  assert.deepEqual(L.sinRegistrar(alumnos, [], 1).map(a => a.id), ['a', 'b', 'c']);
});

test('aPlano quita el LaTeX de enunciados y opciones', () => {
  assert.equal(L.aPlano('Work out: $\\ 7+4\\times 9$'), 'Work out: 7+4×9');
  assert.equal(L.aPlano('$2\\,574$'), '2 574');
  assert.equal(L.aPlano('$30-\\sqrt{16}$ and $2^{3}$'), '30-√16 and 2³');
  assert.equal(L.aPlano('Which number is \\emph{five thousand}? \\textbf{bold}\\ldots'), 'Which number is five thousand? bold…');
  // El redondeo de las explicaciones se escribe con flecha: «$47\to 50$ (hay un 7, sube)».
  assert.equal(L.aPlano('$47\\to 50$ y $32\\to 30$'), '47 → 50 y 32 → 30');
});
