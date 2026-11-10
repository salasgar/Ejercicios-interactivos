// Práctica «Problemas con ecuaciones» (U6, semana 4): 3000 ítems por ejercicio con semillas fijas.
// Una sola buena, nada equivalente, todo error con nombre, cotas de realismo y nada que no se haya dado.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { huellaCanonica, deEcuacion } from '../practicas/_comun/algebra.js';
import {
  generarIncognita, generarEcuacion, generarResuelve, generarPide, generarSentido, corregirResuelve, leerCantidad,
  feedbackResuelve, solucionSentido, solucionPide, solucionEcuacion, solucionIncognita, porQueEcuacion, porQuePide,
  ESTA_DEFINIDO, claveItem, CASOS_HOJA, HUELLAS_EXAMEN, reservado, solucionDe, razonable, TIPOS,
  problema, decimalDe, eurosDe, errorDeSentido, OPCIONES_SENTIDO,
} from '../practicas/problemas-ecuaciones/logica.js';
import { TX } from '../practicas/problemas-ecuaciones/textos.js';

const N = 3000;
const items = (generar, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => generar(rng));
};
const plano = h => String(h).replace(/<[^>]+>/g, '');
const IDIOMAS = ['es', 'en'];
/** Nada de ×, %, x², «1x», «+ −», ni dos letras en una ecuación (se mira lo que ve el alumno). */
const limpio = t => !/[×%²^]|\b1x|\+ −|\+ -|[a-wyz]x|x[a-wyz]\b|=\s*=|NaN|undefined/.test(plano(t).replace(/[A-Z][a-z]+/g, '').replace(/[a-z]{2,}/g, ''));
const sinPalabras = t => !/NaN|undefined|\[object/.test(plano(t));

/** Evalúa un lado de la ecuación tal como se escribe (con paréntesis y coma decimal). */
const lado = (s, v) => {
  const e = s.replace(/−/g, '-').replace(/,/g, '.').replace(/(\d)x/g, '$1*x').replace(/(\d)\(/g, '$1*(').replace(/x\(/g, 'x*(');
  return new Function('x', `return ${e};`)(v);
};
const dif = (t, v) => { const [a, b] = t.split('='); return lado(a, v) - lado(b, v); };

test('todas las plantillas salen y la ecuación del texto vale lo mismo que la que se resuelve', () => {
  const rng = crearRng(1);
  const vistos = new Set();
  for (let i = 0; i < N; i++) {
    const P = problema(rng);
    vistos.add(P.tipo);
    for (const idioma of IDIOMAS) {
      assert.ok(Math.abs(dif(P.eq.txt[idioma], 3) - dif(P.eq.parse, 3)) < 1e-9, `${P.eq.txt[idioma]} vs ${P.eq.parse}`);
      assert.ok(Math.abs(dif(P.eq.txt[idioma], 7) - dif(P.eq.parse, 7)) < 1e-9, `${P.eq.txt[idioma]} vs ${P.eq.parse}`);
      for (const e of P.errores) {
        assert.ok(Math.abs(dif(e.txt[idioma], 3) - dif(e.parse, 3)) < 1e-9, `${e.txt[idioma]} vs ${e.parse}`);
        assert.ok(Math.abs(dif(e.txt[idioma], 11) - dif(e.parse, 11)) < 1e-9, `${e.txt[idioma]} vs ${e.parse}`);
      }
    }
    const s = solucionDe(P.eq.parse);
    assert.equal(s.num * P.escala, P.x * s.den, `${P.tipo}: ${P.eq.parse}`);
    assert.ok(razonable(P, s), `${P.tipo} x=${P.x}`);
    assert.ok(P.x >= P.cota.min && P.x <= P.cota.max);
  }
  assert.deepEqual([...vistos].sort(), [...TIPOS].sort());
});

test('¿Qué es x?: una sola buena y tres datos del enunciado, con error con nombre', () => {
  const its = items(generarIncognita, 31);
  for (const it of its) {
    assert.equal(it.opciones.length, 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(it.opciones.map(o => o.texto.es)).size, 4, claveItem(it));
    assert.equal(new Set(it.opciones.map(o => o.texto.en)).size, 4, claveItem(it));
    for (const o of it.opciones) {
      assert.ok(o.texto.es && o.texto.en);
      if (!o.correcta) assert.ok(ESTA_DEFINIDO(o.error));
    }
    // cada dato incluye el número que da el enunciado, que aparece en el enunciado
    for (const o of it.opciones.filter(o => !o.correcta)) {
      const n = /\((\d+(?:[.,]\d+)?[^)]*)\)/.exec(o.texto.es);
      assert.ok(n, o.texto.es);
    }
    for (const idioma of IDIOMAS) assert.ok(sinPalabras(solucionIncognita(it)[idioma]) && sinPalabras(it.enun[idioma]));
  }
});

test('¿Qué ecuación?: cuatro soluciones distintas y la buena reproduce los datos', () => {
  const its = items(generarEcuacion, 32);
  for (const it of its) {
    assert.equal(it.opciones.length, 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const sols = it.opciones.map(o => solucionDe(o.valor));
    for (let i = 0; i < sols.length; i++) for (let j = i + 1; j < sols.length; j++) {
      assert.notEqual(sols[i].num * sols[j].den, sols[j].num * sols[i].den, `${claveItem(it)}: ${it.opciones[i].valor} y ${it.opciones[j].valor}`);
    }
    const buena = it.opciones.find(o => o.correcta);
    const s = solucionDe(buena.valor);
    assert.equal(s.num * (it.dinero ? 100 : 1), it.x * s.den);
    assert.equal(new Set(it.opciones.map(o => o.txt.es)).size, 4);
    for (const o of it.opciones) {
      for (const idioma of IDIOMAS) assert.ok(limpio(o.txt[idioma]), o.txt[idioma]);
      if (!o.correcta) {
        assert.ok(ESTA_DEFINIDO(o.error), o.error);
        for (const idioma of IDIOMAS) assert.ok(sinPalabras(porQueEcuacion(it, o, idioma)));
      }
    }
    for (const idioma of IDIOMAS) assert.ok(sinPalabras(solucionEcuacion(it)[idioma]));
  }
});

test('Resuelve y contesta: la respuesta pedida sale de x y está en las cotas de su contexto', () => {
  const its = items(generarResuelve, 33);
  const pidenOtra = its.filter(i => !i.esX).length;
  assert.ok(pidenOtra > N * 0.3 && pidenOtra < N * 0.9, `pedidos que no son x: ${pidenOtra}`);
  for (const it of its) {
    const P = it.contexto;
    assert.ok(Number.isInteger(it.valor), claveItem(it));
    assert.ok(it.valor >= (P.dinero ? 10 : 1) || P.tipo === 'consecutivos');
    if (P.dinero) assert.ok(it.valor <= 20000 && it.x % 5 === 0, `${it.x}`);
    else assert.ok(it.valor <= 200, `${it.valor}`);
    const buena = corregirResuelve(it, P.dinero ? decimalDe(it.valor, 'es') : String(it.valor));
    assert.deepEqual([buena.valida, buena.acierto], [true, true]);
    if (P.dinero) assert.equal(corregirResuelve(it, decimalDe(it.valor, 'en')).acierto, true);
    if (!it.esX) {
      const x = corregirResuelve(it, P.dinero ? decimalDe(it.x, 'es') : String(it.x));
      assert.equal(x.acierto, false);
      assert.equal(x.error, 'contestar-x');
    }
    assert.equal(corregirResuelve(it, '').valida, false);
    assert.equal(corregirResuelve(it, 'x = 4').valida, false);
    for (const idioma of IDIOMAS) {
      const f = feedbackResuelve(it, idioma, corregirResuelve(it, '1'));
      assert.ok(sinPalabras(f));
      assert.equal((f.match(/<li>/g) ?? []).length >= 4, true, 'cuatro fases');
    }
  }
});

test('Resuelve y contesta: lo que se lee', () => {
  assert.deepEqual(leerCantidad('12'), { ok: true, valor: 12 });
  assert.equal(leerCantidad('7,5').ok, false);
  assert.equal(leerCantidad('x=12').motivo, 'x');
  assert.equal(leerCantidad('12 años').motivo, 'letras');
  assert.deepEqual(leerCantidad('2,5', { dinero: true }), { ok: true, valor: 250 });
  assert.deepEqual(leerCantidad('2.50 €', { dinero: true }), { ok: true, valor: 250 });
  assert.deepEqual(leerCantidad('€7', { dinero: true }), { ok: true, valor: 700 });
  assert.equal(leerCantidad('2,505', { dinero: true }).ok, false);
});

test('¿Qué pide?: cuatro respuestas distintas, la buena es la pedida y no x salvo que se pida x', () => {
  const its = items(generarPide, 34);
  for (const it of its) {
    assert.equal(it.opciones.length, 4, claveItem(it));
    assert.equal(new Set(it.opciones.map(o => o.valor)).size, 4, claveItem(it));
    assert.equal(it.opciones.filter(o => o.correcta).length, 1);
    const buena = it.opciones.find(o => o.correcta);
    assert.equal(buena.valor, it.valor);
    if (!it.esX) assert.notEqual(it.valor, it.x);
    const x = it.opciones.find(o => o.valor === it.x);
    if (x && !x.correcta) assert.equal(x.error, 'contestar-x');
    for (const o of it.opciones) if (!o.correcta) assert.ok(ESTA_DEFINIDO(o.error));
    for (const idioma of IDIOMAS) {
      assert.ok(sinPalabras(solucionPide(it, idioma)));
      for (const o of it.opciones) if (!o.correcta) assert.ok(sinPalabras(porQuePide(it, o, idioma)));
    }
  }
  // casi siempre se pide otra cantidad: es lo que enseña el ejercicio
  assert.ok(its.filter(i => !i.esX).length > N * 0.6);
});

test('¿Tiene sentido?: las absurdas lo son de verdad, las buenas no, y salen los tres casos', () => {
  const its = items(generarSentido, 35);
  const por = { bien: 0, ecuacion: 0, resolucion: 0 };
  for (const it of its) {
    por[it.donde]++;
    const P = it.contexto;
    assert.equal(it.correcta, it.donde);
    if (it.donde === 'bien') {
      assert.equal(razonable(P, solucionDe(P.eq.parse)), true, claveItem(it));
      assert.equal(it.linea, null);
    } else {
      assert.equal(razonable(P, it.solValor), false, claveItem(it));
      assert.ok(ESTA_DEFINIDO(it.errorId), it.errorId);
      if (it.donde === 'resolucion') assert.ok(it.linea.es && it.linea.en);
      // la ecuación buena sigue siendo la del problema: las dos formas nunca coinciden
      if (it.donde === 'ecuacion') assert.notEqual(it.ecuacion.es, P.eq.txt.es);
    }
    for (const idioma of IDIOMAS) {
      assert.ok(sinPalabras(solucionSentido(it, idioma)), claveItem(it));
      assert.ok(limpio(it.ecuacion[idioma]) || it.ecuacion[idioma].includes('('), it.ecuacion[idioma]);
    }
    for (const o of OPCIONES_SENTIDO) if (o !== it.correcta) assert.ok(ESTA_DEFINIDO(errorDeSentido(it, o)), `${it.donde}/${o}`);
  }
  for (const [k, v] of Object.entries(por)) assert.ok(v > N * 0.1, `${k}: ${v}`);
  assert.ok(por.bien > N * 0.25 && por.bien < N * 0.6, `bien: ${por.bien}`);
});

test('la opción «el enunciado está mal» nunca es la buena', () => {
  for (const it of items(generarSentido, 36)) assert.notEqual(it.correcta, 'enunciado');
});

test('cotas de realismo por contexto', () => {
  const rng = crearRng(37);
  for (let i = 0; i < N; i++) {
    const P = problema(rng);
    const nums = (P.enun.es.match(/\d+/g) ?? []).map(Number);
    switch (P.tipo) {
      case 'perimetro': assert.ok(P.x >= 1 && P.x + nums[0] <= 50 && nums[0] <= 15, P.enun.es); break;
      case 'edades-diferencia': assert.ok(P.x >= 6 && P.x <= 16 && nums[0] >= 2 && nums[0] <= 8, P.enun.es); break;
      case 'consecutivos': assert.ok(P.x >= 5 && P.x + 2 <= 200); break;
      case 'entradas': assert.ok(P.x / 100 >= 3 && P.x / 100 <= 25 && nums[2] <= 200, P.enun.es); break;
      case 'cuadernos': assert.ok(P.x >= 50 && P.x <= 600, P.enun.es); break;
      case 'pienso': assert.ok(P.x >= 2 && P.x <= 60); break;
      case 'reparto-veces': assert.ok(P.x >= 3 && P.x * 5 <= 200); break;
      case 'reparto-tres': assert.ok(P.x >= 3 && 5 * P.x + 9 <= 200); break;
      default: break;
    }
  }
});

test('dinero: se escribe con dos decimales (coma o punto) y sin €€', () => {
  assert.equal(decimalDe(250, 'es'), '2,50');
  assert.equal(decimalDe(250, 'en'), '2.50');
  assert.equal(decimalDe(5, 'es'), '0,05');
  assert.equal(eurosDe(700, 'es'), '7,00 €');
  assert.equal(eurosDe(700, 'en'), '€7.00');
  assert.equal(eurosDe(1250, 'en'), '€12.50');
});

test('acta U6: sin «veces más», sin jardín ni edades futuras, y todo euro con dos decimales', () => {
  assert.ok(!TIPOS.includes('edades-futuro'));
  const rng = crearRng(39);
  for (let i = 0; i < N; i++) {
    const P = problema(rng);
    const todos = [P.enun, P.xDef, ...P.datos, P.eq.txt, ...P.pedidos.map(p => p.frase), ...P.cantidades.map(c => c.nombre)];
    for (const t of todos) {
      assert.ok(!/veces más|jard[ií]n/i.test(t.es) && !/garden/i.test(t.en), t.es);
      for (const m of t.es.matchAll(/(\d+(?:,\d+)?) €/g)) assert.match(m[1], /^\d+,\d\d$/, t.es);
      for (const m of t.en.matchAll(/€(\d+(?:\.\d+)?)/g)) assert.match(m[1], /^\d+\.\d\d$/, t.en);
    }
    for (const p of P.pedidos) for (const idioma of IDIOMAS) {
      const r = p.resp(p.valor)[idioma];
      for (const m of r.matchAll(/(\d+(?:,\d+)?) €/g)) assert.match(m[1], /^\d+,\d\d$/, r);
      for (const m of r.matchAll(/€(\d+(?:\.\d+)?)/g)) assert.match(m[1], /^\d+\.\d\d$/, r);
    }
  }
});

test('ningún texto de alumno con ×, porcentajes ni x² (enunciados, ecuaciones y textos fijos, en los dos idiomas)', () => {
  const rng = crearRng(38);
  for (let i = 0; i < N; i++) {
    const P = problema(rng);
    for (const idioma of IDIOMAS) {
      const todos = [P.enun[idioma], P.xDef[idioma], ...P.datos.map(d => d[idioma]), P.eq.txt[idioma], ...P.errores.map(e => e.txt[idioma]),
        ...P.pedidos.map(p => p.frase[idioma]), ...P.cantidades.map(c => c.nombre[idioma])];
      for (const t of todos) assert.ok(!/[×%²]|x\^|\b1x|\+ −|\+ -|undefined|NaN/.test(t), t);
    }
  }
  const fijos = JSON.stringify(TX);
  assert.ok(!/[×%²]/.test(fijos));
  for (const e of TX.ejercicios) assert.ok(e.introduccion.es && e.introduccion.en && e.nombre.es && e.nombre.en);
});

test('la resolución escrita termina en x = valor', () => {
  const rng = crearRng(39);
  for (let i = 0; i < 500; i++) {
    const it = generarResuelve(rng);
    for (const idioma of IDIOMAS) {
      const ultima = it.pasos[idioma].at(-1);
      assert.match(ultima, /^x = /);
    }
    assert.ok(deEcuacion(it.contexto.eq.parse));
  }
});

test('casos reservados: hooks vacíos pero operativos', () => {
  assert.equal(CASOS_HOJA.size, 0);
  assert.equal(HUELLAS_EXAMEN.size, 0);
  const parse = 'x + 2x = 30';
  HUELLAS_EXAMEN.add(huellaCanonica(parse));
  assert.equal(reservado(parse), true);
  assert.equal(reservado('3x + 2 = 5'), false);
  HUELLAS_EXAMEN.delete(huellaCanonica(parse));
  assert.equal(reservado(parse), false);
});
