// «No lo sé» en «Términos semejantes» (tarea 175): la explicación lleva la solución que el ejercicio da por buena.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { T } from '../practicas/_comun/textos.js';
import { leerExpresion } from '../practicas/_comun/algebra.js';
import { generarSemejantes, generarCoeficiente, generarReducir, generarErrores, corregirReducir } from '../practicas/terminos-semejantes/logica.js';
import { explicaSemejantes, explicaCoeficiente, explicaReduce, explicaErrores, TX } from '../practicas/terminos-semejantes/textos.js';

const IDIOMAS = ['es', 'en'];
const textosDe = idioma => ({ idioma, t: T[idioma], tt: obj => obj[idioma], esc: x => x });
const plano = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const N = 1000;
const sesion = i => ({ aciertos: i % 10, fallos: 0, puntos: 0, vidas: 5, anterior: null, idioma: 'es' });

function recorrer(generar, semilla, comprobar) {
  const rng = crearRng(semilla);
  for (let i = 0; i < N; i++) {
    const item = generar(rng, sesion(i));
    for (const idioma of IDIOMAS) comprobar(item, idioma, textosDe(idioma));
  }
}

test('terminos-semejantes, «¿semejantes?»: la explicación lleva el porqué y el sí o el no del ítem', () => {
  recorrer(generarSemejantes, 175011, (item, idioma, ctx) => {
    const html = explicaSemejantes(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    // Los dos términos y lo que lleva cada uno (revisión 191: ya no se copia el feedback, que decía «en 3 sin letra»).
    assert.ok(html.includes(item.htmlA) && html.includes(item.htmlB), `los dos términos — ${que}`);
    const mismaLetra = item.letraA === item.letraB;
    assert.equal(item.correcta, mismaLetra ? 'si' : 'no', 'lo que se da por bueno');
    if (!mismaLetra) for (const l of [item.letraA, item.letraB]) assert.ok(plano(html).includes(l === null ? (idioma === 'es' ? 'no tiene letra' : 'has no letter') : ` ${l} `), `la letra de cada uno — ${que}`);
    assert.doesNotMatch(plano(html), / (en|in) -?\d+ (sin|no) /, `frase sin verbo — ${que}`);
    const sino = TX.semejantes[mismaLetra ? 'si' : 'no'][idioma];
    assert.ok(html.endsWith(idioma === 'es' ? `«${sino}».` : `“${sino}”.`), `el sí o el no al final — ${que}`);
  });
});

test('terminos-semejantes, «coeficiente y parte literal»: la explicación lleva la opción buena', () => {
  recorrer(generarCoeficiente, 175012, (item, idioma, ctx) => {
    const html = explicaCoeficiente(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    const buenas = item.opciones.filter(o => o.correcta);
    assert.equal(buenas.length, 1, que);
    assert.ok(html.includes(item.solucion[idioma]), que);
    assert.ok(html.endsWith(`${buenas[0].html}.`), `la opción buena al final — ${que}`);
  });
});

test('terminos-semejantes, «reduce»: la explicación termina en el resultado reducido', () => {
  recorrer(generarReducir, 175013, (item, idioma, ctx) => {
    const html = explicaReduce(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    assert.ok(corregirReducir(item, item.correcta).acierto, 'lo que se da por bueno');
    // Los pasos del feedback (la suma de coeficientes de cada letra), sin «A = A» ni «Resultado: R» repetido (revisión 191).
    const pasos = item.solucion[idioma].match(/\((.*)\)\. (Resultado|Result):/)[1];
    assert.ok(html.includes(pasos), `los pasos — ${que}`);
    const resultado = leerExpresion(item.correcta, { variasLetras: true }).valor.aHtml();
    assert.ok(html.endsWith(`<span class="cuenta">${resultado}</span>.`), `el resultado al final — ${que}`);
    assert.equal(html.split(`<span class="cuenta">${resultado}</span>`).length, 2, `el resultado, una sola vez — ${que}`);
    assert.doesNotMatch(html, /(<span class="cuenta">[^<]*(?:<[^s/][^>]*>[^<]*<\/[^>]+>[^<]*)*<\/span>) = \1/, `«A = A» — ${que}`);
  });
});

test('terminos-semejantes, «caza el error»: la explicación dice dónde está el error y lo que había que elegir', () => {
  recorrer(generarErrores, 175014, (item, idioma, ctx) => {
    const html = explicaErrores(item, ctx);
    const que = `${idioma}: ${plano(html)}`;
    assert.equal(item.correcta, item.error ?? 'ninguno', 'lo que se da por bueno');
    assert.ok(html.includes(item.solucion[idioma].replace(/(<\/span>): (Has|You) /, '$1. $2 ')), que);
    const opcion = TX.errores[item.correcta][idioma];
    assert.ok(html.endsWith(idioma === 'es' ? `«${opcion}».` : `“${opcion}”.`), `la opción buena al final — ${que}`);
  });
});

test('terminos-semejantes: ninguna explicación lleva restos ni «×»', () => {
  const casos = [[generarSemejantes, explicaSemejantes], [generarCoeficiente, explicaCoeficiente], [generarReducir, explicaReduce], [generarErrores, explicaErrores]];
  casos.forEach(([generar, explica], k) => recorrer(generar, 175020 + k, (item, idioma, ctx) => {
    assert.doesNotMatch(explica(item, ctx), /undefined|NaN|\[object|×/, `${idioma}: ${item.clave}`);
  }));
});
