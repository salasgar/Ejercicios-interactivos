// «No lo sé» en `division` (tarea 187): la explicación lleva la solución que el ejercicio da por buena,
// calculada con la lógica de la práctica. 1000+ ítems por ejercicio, en los dos idiomas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { T } from '../practicas/_comun/textos.js';
import { crearRng } from '../practicas/_comun/rng.js';
import * as L from '../practicas/division/logica.js';
import * as X from '../practicas/division/textos.js';

const IDIOMAS = ['es', 'en'];
const ctx = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const N = 1000;
const sano = html => assert.doesNotMatch(html, /undefined|NaN|\[object|null/, plano(html));

test('ej. 1: la explicación da el cociente, el resto y la prueba que calcula la lógica', () => {
  const rng = crearRng(601);
  for (let n = 0; n < N; n++) {
    const item = L.generarCajas(rng);
    const { q, r } = L.dividir(item.D, item.d);
    assert.deepEqual([q, r], [item.q, item.r]);
    for (const idioma of IDIOMAS) {
      const html = X.explicaCajas(item, ctx(idioma));
      sano(html);
      const texto = plano(html);
      assert.ok(texto.includes(`${idioma === 'es' ? 'Prueba:' : 'Check:'} ${item.D} = ${item.d} · ${q} + ${r}.`), texto);
      assert.match(texto, new RegExp(`${item.D} − ${item.d * q} = ${r}`));
      // por qué no cabe otra caja: con una más harían falta más objetos de los que hay
      assert.ok(item.d * (q + 1) > item.D);
      assert.ok(texto.includes(`${q + 1} ${idioma === 'es' ? 'llevarían' : 'would need'} ${item.d * (q + 1)}`), texto);
      assert.doesNotMatch(texto, /\b1 (cajas|boxes)\b/, texto);
      // acaba en la respuesta, sin dos puntos tras «es»
      assert.ok(texto.endsWith(idioma === 'es' ? `La respuesta es cociente ${q} y resto ${r}.` : `The answer is quotient ${q} and remainder ${r}.`), texto);
    }
  }
});

// En la unidad 1 no hay letras: nada de «D = d · q + r» en las tarjetas.
const SIN_LETRAS = /\b[Ddqr] =|· q\b|\+ r\b/;

test('ej. 2: la explicación da la prueba buena o el veredicto de la inversa', () => {
  const rng = crearRng(602);
  const vistos = new Set();
  for (let n = 0; n < N; n++) {
    const item = L.generarPruebaOInversa(rng);
    vistos.add(item.tipo);
    for (const idioma of IDIOMAS) {
      const texto = plano(X.explicaPrueba(item, ctx(idioma)));
      sano(texto);
      assert.doesNotMatch(texto, SIN_LETRAS, texto);
      assert.doesNotMatch(texto, /\b(es|is):/, texto);
      if (item.tipo === 'prueba') {
        assert.ok(L.esPruebaDe(item.opciones[item.solucion], item.D, item.d));
        assert.ok(texto.endsWith(`${item.D} = ${item.d} · ${item.q} + ${item.r}.`), texto);
      } else {
        assert.equal(item.solucion, L.respuestaInversa(item));
        const fin = {
          a: L.divTxt(item.D, item.a, idioma), b: L.divTxt(item.D, item.b, idioma),
        };
        // la respuesta es el texto del botón, entre comillas
        const [abre, cierra] = idioma === 'es' ? ['«', '»'] : ['“', '”'];
        if (item.solucion === 'a' || item.solucion === 'b') {
          assert.ok(texto.endsWith(`${abre}${idioma === 'es' ? 'Solo de' : 'Only'} ${fin[item.solucion]}${cierra}.`), texto);
          // dice por qué vale una y por qué no vale la otra, con su divisor
          const [buena, otro] = item.solucion === 'a' ? [item.a, item.b] : [item.b, item.a];
          assert.ok(item.r < buena && item.r >= otro);
          assert.ok(texto.includes(`${item.r} ${idioma === 'es' ? 'no es menor que' : 'is not less than'} ${otro}.`), texto);
        } else {
          const buscado = { ambas: { es: 'De las dos', en: 'Both of them' }, ninguna: { es: 'De ninguna', en: 'Neither of them' } }[item.solucion][idioma];
          assert.ok(texto.endsWith(`${abre}${buscado}${cierra}.`), texto);
        }
      }
    }
  }
  assert.deepEqual([...vistos].sort(), ['inversa', 'prueba']);
});

test('ej. 3: la explicación da el número que el ejercicio da por bueno', () => {
  const rng = crearRng(603);
  for (let n = 0; n < N; n++) {
    const item = L.generarSignificado(rng);
    const solucion = L.solucionSignificado(item);
    assert.equal(solucion, item.solucion);
    for (const idioma of IDIOMAS) {
      const texto = plano(X.explicaSignificado(item, ctx(idioma)));
      sano(texto);
      // el número con su unidad: lo que sobra se cuenta en objetos; lo demás, en cajas (coches, mesas…)
      const cosa = X.COSAS[item.clave];
      const plural = item.pide === 'sueltos' ? cosa[idioma] : cosa.caja[idioma];
      const fin = texto.match(new RegExp(`${idioma === 'es' ? 'La respuesta es' : 'The answer is'} (\\d+) (.+)\\.$`));
      assert.ok(fin, texto);
      assert.equal(Number(fin[1]), solucion, texto);
      if (solucion === 1) assert.notEqual(fin[2], plural, texto);
      else assert.equal(fin[2], plural, texto);
    }
  }
});

test('ej. 4: la explicación da Sí o No según la lógica', () => {
  const rng = crearRng(604);
  for (let n = 0; n < N; n++) {
    const item = L.generarPuede(rng);
    assert.equal(item.solucion, L.puedeSer(item));
    for (const idioma of IDIOMAS) {
      const c = ctx(idioma);
      const texto = plano(X.explicaPuede(item, c));
      sano(texto);
      const boton = item.solucion ? c.t.si : c.t.no;
      assert.ok(texto.endsWith(idioma === 'es' ? `La respuesta es «${boton}».` : `The answer is “${boton}”.`), texto);
      assert.doesNotMatch(texto, SIN_LETRAS, texto);
      // la regla «el resto es menor que el divisor» va una sola vez, y sin glosa en inglés en la tarjeta en español
      assert.ok((texto.match(/menor que el divisor|less than the divisor/g) ?? []).length === 1, texto);
      if (idioma === 'es') assert.doesNotMatch(texto, /remainder/, texto);
    }
  }
});
