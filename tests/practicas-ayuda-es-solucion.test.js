// «No lo sé» en «¿Es solución?» (tarea 175): la explicación lleva la comprobación que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import {
  generarComprueba, generarQueEcuacion, generarIdentidad, generarInventa, errorDeComprueba, errorDeIdentidad,
  errorDeInventa, ecuacionDe, htmlDe, valorMiembro, ecuacion3, ecuacionesConSolucion, F,
} from '../practicas/es-solucion/logica.js';
import { explicaComprueba, explicaQueEcuacion, explicaIdentidad, explicaInventa } from '../practicas/es-solucion/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' });
const SI = { es: 'Sí, es solución', en: 'Yes, it is a solution' };
const NO = { es: 'No, no es solución', en: 'No, it is not a solution' };

function recorrer(generar, semilla, comprobar) {
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) {
    const item = generar(rng, sesion(i));
    for (const idioma of IDIOMAS) comprobar(item, idioma, textosDe(idioma));
  }
}

test('es-solucion, «compruébalo»: la explicación termina en el sí o el no que da por bueno el ejercicio', () => {
  recorrer(generarComprueba, 175041, (item, idioma, ctx) => {
    const q = ecuacionDe(item);
    const v = F({ num: item.v, den: 1 });
    const cumple = valorMiembro(q.terminosIzq, v).equals(valorMiembro(q.terminosDer, v));
    assert.equal(cumple, item.esSolucion);
    assert.equal(errorDeComprueba(item, item.esSolucion ? 'si' : 'no'), null, 'lo que se da por bueno');
    const html = explicaComprueba(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    assert.ok(html.endsWith(`<span class="cuenta">${(item.esSolucion ? SI : NO)[idioma]}</span>.`), que);
    assert.ok(plano(html).includes(item.esSolucion ? ' = ' : ' ≠ '), que);
    assert.doesNotMatch(html, /undefined|NaN|×/, que);
  });
});

test('es-solucion, «¿qué ecuación?»: la explicación comprueba la ecuación buena y la nombra al final', () => {
  recorrer(generarQueEcuacion, 175042, (item, idioma, ctx) => {
    const buenas = item.opciones.filter(o => o.correcta);
    assert.equal(buenas.length, 1);
    const q = ecuacionDe(buenas[0].e);
    assert.ok(valorMiembro(q.terminosIzq, F({ num: item.s, den: 1 })).equals(valorMiembro(q.terminosDer, F({ num: item.s, den: 1 }))), 'lo que se da por bueno');
    const html = explicaQueEcuacion(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    assert.ok(html.endsWith(`${htmlDe(buenas[0].e)}.`), que);
    assert.ok(plano(html).includes(' = '), que);
    // La regla manda probar en cada ecuación: cuál es la buena es lo que el alumno no sabe (revisión 191).
    assert.match(plano(html), /en cada ecuación|in each equation/, que);
    assert.doesNotMatch(html, /undefined|NaN|×/, que);
  });
});

test('es-solucion, «¿identidad o ecuación?»: la explicación termina en lo que el ejercicio da por bueno', () => {
  recorrer(generarIdentidad, 175043, (item, idioma, ctx) => {
    assert.equal(errorDeIdentidad(item, item.tipo), null, 'lo que se da por bueno');
    assert.ok(ecuacion3(item));
    const html = explicaIdentidad(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    const nombre = item.tipo === 'identidad' ? { es: 'Identidad', en: 'Identity' } : { es: 'Ecuación', en: 'Equation' };
    assert.ok(html.endsWith(`<span class="cuenta">${nombre[idioma]}</span>.`), que);
    assert.doesNotMatch(html, /undefined|NaN|×/, que);
  });
});

test('es-solucion, «inventa una»: la ecuación del ejemplo tiene la solución pedida', () => {
  recorrer(generarInventa, 175044, (item, idioma, ctx) => {
    const html = explicaInventa(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    const e = ecuacionesConSolucion(item.s).find(o => o.a >= 2 && o.b > 0 && !o.delante);
    assert.ok(e, `hay ejemplo para x = ${item.s}`);
    assert.equal(errorDeInventa(ecuacionDe(e), item), null, 'el ejemplo tiene la solución pedida');
    assert.ok(html.endsWith(`${htmlDe(e)}.`), que);
    assert.ok(plano(html).includes(' = '), que);
    assert.doesNotMatch(html, /undefined|NaN|×/, que);
  });
});
