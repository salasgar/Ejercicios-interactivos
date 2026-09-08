import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csvResumen, csvDetalle, aCsv, fecha } from '../src/ui/csv.js';
import { texAPlano, traducirTex } from '../src/ui/formulas.js';
import { generarTarea, responder, resumen, ejercicioActual } from '../src/motor.js';

test('aCsv usa BOM, punto y coma, coma decimal y entrecomilla lo necesario', () => {
  const csv = aCsv(['a', 'b'], [[1.5, 'x;y'], [true, 'di "hola"']]);
  assert.ok(csv.startsWith('﻿'));
  assert.equal(csv.slice(1), 'a;b\r\n1,5;"x;y"\r\nsí;"di ""hola"""\r\n');
});

test('texAPlano convierte fracciones, potencias y comas', () => {
  assert.equal(texAPlano('2 + 3 \\cdot 10^{2}'), '2 + 3 · 10^2');
  assert.equal(texAPlano('8 \\div 2'), '8 : 2');
  assert.equal(texAPlano('-\\frac{3}{4}'), '-3/4');
  assert.equal(texAPlano('2{,}5'), '2,5');
});

test('csvResumen y csvDetalle producen una fila por alumno y por respuesta', () => {
  let p = generarTarea({ id: 't', titulo: 'Tarea 1', ejercicios: [{ tipo: 'enteros', cantidad: 2 }] }, 9, 1700000000000);
  p = responder(p, ejercicioActual(p).opciones.findIndex(o => o.error?.concepto), 1700000001000);
  p = responder(p, ejercicioActual(p).opciones.findIndex(o => o.correcta), 1700000002000);
  const base = { usuario: 'ana', nombre: 'Ana', grupo: '1A', tarea: 'Tarea 1' };
  const r = csvResumen([{ ...base, resumen: resumen(p), empezadaEn: p.empezadaEn, terminadaEn: p.terminadaEn }]);
  const lineasR = r.trim().split('\r\n');
  assert.equal(lineasR.length, 2);
  assert.ok(lineasR[0].includes('Errores: Números enteros'));
  assert.ok(lineasR[1].startsWith('ana;Ana;1A;Tarea 1;4;2;1;50;2;no'));
  const d = csvDetalle([{ ...base, progreso: p }]);
  const lineasD = d.trim().split('\r\n');
  assert.equal(lineasD.length, 3);
  assert.ok(lineasD[1].includes(';no;'));
  assert.ok(lineasD[2].includes(';sí;'));
  assert.ok(!/\\/.test(d), 'no debe quedar TeX en el CSV');
});

test('fecha con formato español', () => {
  assert.match(fecha(Date.UTC(2026, 8, 8, 10, 5)), /^08\/09\/2026 \d{2}:\d{2}$/);
  assert.equal(fecha(null), '');
});

test('traducirTex traduce las palabras de las fórmulas al inglés', () => {
  assert.equal(traducirTex('24 \\div 7 = 3 \\text{ resto } 3', 'en'), '24 \\div 7 = 3 \\text{ remainder } 3');
  assert.equal(traducirTex('\\text{mcm}(4, 6) = 12', 'en'), '\\text{lcm}(4, 6) = 12');
  assert.equal(traducirTex('\\text{mcm}(4, 6) = 12', 'es'), '\\text{mcm}(4, 6) = 12');
});
