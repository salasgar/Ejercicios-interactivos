// El botón «No lo sé» de las prácticas (2026-11-12): el contador de ayudas, su fusión entre
// aparatos, el contrato (`explicacion`, `noLoSe`) y las explicaciones de las prácticas que ya
// lo tienen, por fuerza bruta: en los dos idiomas, con la solución del ítem y sin restos.

import test from 'node:test';
import assert from 'node:assert/strict';
import { ejercicioNuevo, anotar, ayudar, ayudasDelGrupo, queHaPasado, AYUDAS_POR_PUNTO } from '../practicas/_comun/contador.js';
import { fusionarEjercicio } from '../practicas/_comun/nube.js';
import { validarPractica } from '../practicas/_comun/base.js';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import { htmlFraccion } from '../practicas/_comun/fracciones.js';
import * as FD from '../practicas/fraccion-de/logica.js';
import * as FDT from '../practicas/fraccion-de/textos.js';
import * as MD from '../practicas/multiplica-divide/logica.js';
import * as MDT from '../practicas/multiplica-divide/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const generar = (fn, semilla, n = 1500) => {
  const rng = crearRng(semilla);
  const sesion = { aciertos: 0, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' };
  return Array.from({ length: n }, (_, i) => fn(rng, { ...sesion, aciertos: i % 12, idioma: IDIOMAS[i % 2] }));
};
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('contador: «No lo sé» no es un fallo; corta la racha y la tercera ayuda quita 1 punto', () => {
  assert.equal(AYUDAS_POR_PUNTO, 3);
  let ej = ejercicioNuevo();
  assert.equal(ej.ayudas, undefined, 'quien no pide ayuda guarda lo mismo que antes');
  for (let i = 0; i < 4; i++) ej = anotar(ej, true, 1);
  const antes = ej;
  ej = ayudar(ej);
  assert.deepEqual([ej.ayudas, ej.puntos, ej.racha, ej.vidas, ej.fallos, ej.aciertos], [1, 4, 0, 5, 0, 4]);
  assert.equal(antes.ayudas, undefined, 'no toca el de entrada');
  ej = ayudar(ej);
  assert.deepEqual([ej.ayudas, ej.puntos, ayudasDelGrupo(ej)], [2, 4, 2]);
  const dos = ej;
  ej = ayudar(ej);
  assert.deepEqual([ej.ayudas, ej.puntos, ej.vidas, ej.fallos, ayudasDelGrupo(ej)], [3, 3, 5, 0, 0]);
  assert.deepEqual(queHaPasado(dos, ej), { ganados: 0, perdidos: 1, extra: false, reinicio: false, vidas: 5 });
  // La racha se cortó: el quinto acierto seguido ya no da extra.
  ej = anotar(ej, true, 1);
  assert.equal(ej.puntos, 4);
});

test('contador: con 0 puntos la tercera ayuda no baja de 0, y un ejercicio terminado no cambia', () => {
  let ej = ejercicioNuevo();
  for (let i = 0; i < 6; i++) ej = ayudar(ej);
  assert.deepEqual([ej.ayudas, ej.puntos, ej.vidas, ej.reinicios], [6, 0, 5, 0]);
  let fin = ejercicioNuevo(1);
  fin = anotar(fin, true, 3);
  assert.equal(fin.terminado, true);
  assert.equal(ayudar(fin), fin);
});

test('contador: las ayudas son acumuladas (no vuelven a 0 al perder las vidas)', () => {
  let ej = ayudar(ayudar(ejercicioNuevo()));
  for (let i = 0; i < 5; i++) ej = anotar(ej, false, 1);
  assert.deepEqual([ej.reinicios, ej.ayudas, ej.fallos], [1, 2, 5]);
});

test('nube: al fusionar dos aparatos, de las ayudas se queda el máximo', () => {
  const a = { ...ejercicioNuevo(), puntos: 5, aciertos: 5, ayudas: 2 };
  const b = { ...ejercicioNuevo(), puntos: 3, aciertos: 3, ayudas: 4 };
  assert.equal(fusionarEjercicio(a, b).ayudas, 4);
  assert.equal(fusionarEjercicio(b, a).ayudas, 4);
  assert.deepEqual(fusionarEjercicio(a, b), fusionarEjercicio(b, a));
  const sin = { ...ejercicioNuevo(), puntos: 7, aciertos: 7 };
  assert.equal(fusionarEjercicio(sin, a).ayudas, 2);
  assert.equal('ayudas' in fusionarEjercicio(sin, { ...sin }), false, 'sin ayudas en ningún lado, el campo no aparece');
});

test('base: «explicacion» es una función y «noLoSe», un texto { es, en } que solo vale con ella', () => {
  const valido = () => ({ nombre: { es: 'a', en: 'a' }, detalle: { es: 'b', en: 'b' }, generar: () => ({}), montar: () => {} });
  const con = cambios => ({ slug: 'plantilla', ejercicios: [valido(), { ...valido(), ...cambios }] });
  assert.doesNotThrow(() => validarPractica(con({ explicacion: () => 'x' })));
  assert.doesNotThrow(() => validarPractica(con({ explicacion: () => 'x', noLoSe: { es: 'No sé hacerlo', en: 'I don’t know how' } })));
  assert.throws(() => validarPractica(con({ explicacion: 'x' })), /«explicacion» tiene que ser una función/);
  assert.throws(() => validarPractica(con({ explicacion: () => 'x', noLoSe: 'No sé' })), /«noLoSe» tiene que ser \{ es, en \}/);
  assert.throws(() => validarPractica(con({ noLoSe: { es: 'a', en: 'b' } })), /«noLoSe» sin «explicacion»/);
});

test('textos comunes del «No lo sé», en los dos idiomas', () => {
  for (const i of IDIOMAS) {
    for (const clave of ['no_lo_se', 'menu_ayuda', 'ayuda_titulo', 'ayuda_nota', 'ayuda_gratis', 'ayuda_pagada', 'ayuda_lee']) assert.ok(T[i][clave], `${i}.${clave}`);
    assert.match(T[i].ayuda_nota(0, 3), /0 (de|of) 3/);
    assert.notEqual(T[i].ayuda_nota(2, 3), T[i].ayuda_nota(1, 3).replace('1', '2'), 'la última gratis avisa de que la próxima cuesta');
    assert.match(T[i].ayuda_pagada(3, 1), /−1/);
    assert.doesNotMatch(T[i].ayuda_pagada(3, 0), /−1/);
  }
});

/** Una explicación vale si no tiene restos, no usa × y lleva la solución del ítem. */
function comprobar(html, que, solucion) {
  assert.equal(typeof html, 'string', que);
  assert.doesNotMatch(html, /undefined|NaN|\[object|null|×/, `${que}: ${plano(html)}`);
  assert.ok(html.length > 40, `${que}: demasiado corta`);
  if (solucion !== undefined) assert.ok(html.includes(solucion), `${que}: no lleva la solución ${solucion} — ${plano(html)}`);
}

test('fraccion-de: la explicación de cada ejercicio lleva los pasos y la solución del ítem', () => {
  for (const idioma of IDIOMAS) {
    for (const [fn, semilla] of [[FD.generarCalculo, 11], [FD.generarContexto, 12]]) {
      for (const item of generar(fn, semilla)) {
        const html = FDT.explicaCalculo(item, idioma);
        comprobar(html, `calculo ${idioma}`, `${item.total} : ${item.d} = ${item.total / item.d}`);
        assert.ok(plano(html).includes(` ${item.resultado}`), 'el resultado');
        assert.equal(html.includes('·'), item.n > 1, 'con numerador 1 no hay segundo paso');
      }
    }
    for (const item of generar(FD.generarParte, 13)) {
      const r = FD.respuestaParte(item);
      comprobar(FDT.explicaParte(item, textosDe(idioma)), `parte ${idioma}`, htmlFraccion(r));
    }
    for (const item of generar(FD.generarProblema, 14)) {
      comprobar(FDT.explicaProblema(item, idioma), `problema ${idioma}`, FDT.solucionProblema(item, idioma));
    }
  }
});

test('multiplica-divide: la explicación de cada ejercicio lleva la regla y el resultado del ítem', () => {
  const casos = [
    [MD.generarMultiplica, MDT.explicaMultiplica, MDT.feedbackMultiplica],
    [MD.generarParte, MDT.explicaParte, MDT.feedbackParte],
    [MD.generarInversa, MDT.explicaInversa, MDT.feedbackProductoInversa],
    [MD.generarDivide, MDT.explicaDivide, MDT.feedbackDivide],
    [MD.generarPotencia, MDT.explicaPotencia, MDT.feedbackPotencia],
  ];
  casos.forEach(([generador, explica, cuenta], k) => {
    for (const idioma of IDIOMAS) {
      const ctx = textosDe(idioma);
      for (const item of generar(generador, 20 + k)) {
        const html = explica(item, ctx);
        comprobar(html, `${explica.name} ${idioma}`, cuenta(item, ctx));
        assert.ok(html.includes(htmlFraccion(MD.F(item.valor))), `${explica.name}: el resultado`);
      }
    }
  });
  // El signo solo se comenta cuando hay alguna fracción negativa.
  const ctx = textosDe('es');
  for (const item of generar(MD.generarMultiplica, 31)) {
    assert.equal(/signos/.test(MDT.explicaMultiplica(item, ctx)), item.a[0] < 0 || item.b[0] < 0);
  }
});
