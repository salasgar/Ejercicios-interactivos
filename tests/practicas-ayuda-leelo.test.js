// «No lo sé» en «Léelo en inglés» (tarea 186): la explicación de cada ejercicio lleva la solución del
// ítem, calculada con la lógica de la práctica, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T, esc } from '../practicas/_comun/textos.js';
import {
  generarEscuchar, opcionesEscuchar, generarLeer, opcionesLeer, generarCompletar, comprobarCompletar,
} from '../practicas/leelo/logica.js';
import { explicaEscuchar, explicaLeer, explicaCompletar, piezas } from '../practicas/leelo/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc });
const plano = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const generar = (fn, semilla) => {
  const rng = crearRng(semilla);
  return Array.from({ length: N }, () => fn(rng));
};
const limpio = (h, donde) => {
  assert.doesNotMatch(h, /undefined|NaN|\[object|null|×/, `${donde}: ${plano(h)}`);
  assert.ok(plano(h).length > 40, `${donde}: demasiado corta`);
};

test('leelo, ejercicio 1: la explicación lleva lo que se oye y la notación correcta', () => {
  for (const item of generar(generarEscuchar, 1871)) {
    const { correcta } = opcionesEscuchar(item);
    for (const idioma of IDIOMAS) {
      const h = explicaEscuchar(item, textosDe(idioma));
      limpio(h, `ej1 ${idioma}`);
      assert.ok(h.includes(correcta), `lleva la notación ${correcta}: ${plano(h)}`);
    }
    assert.notEqual(explicaEscuchar(item, textosDe('es')), explicaEscuchar(item, textosDe('en')));
  }
});

test('leelo, ejercicio 2: la explicación lleva la lectura correcta, en el estilo del ítem', () => {
  for (const item of generar(generarLeer, 1872)) {
    const { correcta } = opcionesLeer(item);
    for (const idioma of IDIOMAS) {
      const h = explicaLeer(item, textosDe(idioma));
      limpio(h, `ej2 ${idioma}`);
      assert.ok(h.includes(esc(correcta)), `lleva la lectura «${correcta}»: ${plano(h)}`);
    }
  }
});

test('leelo: las piezas de la explicación componen la lectura entera (en orden)', () => {
  for (const item of [...generar(generarEscuchar, 1873).slice(0, 300), ...generar(generarLeer, 1874).slice(0, 300)]) {
    const palabras = piezas(item, item.estilo).map(([ing]) => ing);
    const leido = opcionesLeer(item).correcta;
    for (const p of palabras) assert.ok(leido.includes(p), `«${p}» no está en «${leido}»`);
  }
});

test('leelo, ejercicio 3: la explicación lleva la frase correcta y la regla de la plantilla', () => {
  const vistas = new Set();
  for (const item of generar(generarCompletar, 1875)) {
    assert.ok(comprobarCompletar(item), 'la frase del ítem es verdadera');
    vistas.add(item.plantilla);
    const frase = item.frase.replace('___', item.solucion);
    for (const idioma of IDIOMAS) {
      const h = explicaCompletar(item, textosDe(idioma));
      limpio(h, `ej3 ${idioma} ${item.plantilla}`);
      assert.ok(h.includes(esc(frase)), `lleva la frase «${frase}»: ${plano(h)}`);
    }
    assert.notEqual(explicaCompletar(item, textosDe('es')), explicaCompletar(item, textosDe('en')));
  }
  assert.equal(vistas.size, 11, 'salen las 11 plantillas');
});
