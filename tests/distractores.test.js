// Verificación de distractores: que ninguna pregunta tenga dos respuestas
// correctas.
//
// LA REGLA. Un distractor tiene que ser INEQUÍVOCAMENTE FALSO. Si una opción
// puede darse por buena, la pregunta tiene dos respuestas correctas y el
// alumno acierta o falla por azar. El caso clásico:
//
//   «¿Cómo se escribe 43 en inglés?»  correcta: "forty-three"
//   distractor: "forty three"  -> TAMBIÉN es correcta. No vale.
//
// El mismo par SÍ vale en «¿cuál está bien escrito?», porque ahí el guion es
// justamente lo que se evalúa. Por eso la comprobación 2 distingue por tipo
// de pregunta: solo permite pares casi iguales cuando lo que se pide es la
// forma ESCRITA.
//
// Si añades un tipo de pregunta que pida la forma escrita, mételo en
// CLAVES_DE_FORMA_ESCRITA. Si lo que pides es cómo se LEE algo, no lo metas:
// dos opciones que se pronuncian igual son dos respuestas correctas.

import test from 'node:test';
import assert from 'node:assert/strict';
import { TIPOS, crearRng } from '../src/ejercicios/index.js';

const SEMILLAS = 3000;

/** Tipos de pregunta en los que lo evaluado es cómo se ESCRIBE algo. */
const CLAVES_DE_FORMA_ESCRITA = new Set([
  'bien_escrito', 'ordinal', 'numero_en_palabras', 'se_escribe',
]);

/** Ignora mayúsculas, tildes, espacios y guiones. */
const normalizar = s => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[\s\-]/g, '');

const textos = q => q.opciones
  .map(o => (typeof o.texto === 'string' ? o.texto : null))
  .filter(x => x !== null);

function recorrer(visitar) {
  for (const [id, tipo] of Object.entries(TIPOS)) {
    for (let semilla = 1; semilla <= SEMILLAS; semilla++) {
      const q = tipo.generar(crearRng(semilla));
      if (q && q.opciones) visitar(id, q);
    }
  }
}

test('ninguna pregunta repite el texto de una opción', () => {
  const fallos = [];
  recorrer((id, q) => {
    const t = textos(q);
    const repetidos = t.filter((x, i) => t.indexOf(x) !== i);
    if (repetidos.length) fallos.push(`${id} / ${q.texto?.clave}: «${repetidos[0]}» aparece dos veces`);
  });
  assert.deepEqual([...new Set(fallos)], [], `\n  ${[...new Set(fallos)].join('\n  ')}\n`);
});

test('en las preguntas de lectura no hay dos opciones que solo difieran en tildes, espacios o guiones', () => {
  const fallos = new Set();
  recorrer((id, q) => {
    if (CLAVES_DE_FORMA_ESCRITA.has(q.texto?.clave)) return;
    const vistos = new Map();
    for (const x of textos(q)) {
      const k = normalizar(x);
      const previo = vistos.get(k);
      if (previo !== undefined && previo !== x) {
        fallos.add(`${id} / ${q.texto?.clave}: «${previo}» y «${x}» son la misma respuesta`);
      }
      vistos.set(k, x);
    }
  });
  assert.deepEqual([...fallos], [], `\n  ${[...fallos].join('\n  ')}\n`);
});

test('toda opción declarada como distractor puede llegar a salir', () => {
  // construirOpciones toma los distractores EN ORDEN y se planta en 3: un
  // cuarto distractor sin barajar es código muerto que nunca ve el alumno.
  const alcanzados = new Map();
  recorrer((id, q) => {
    for (const o of q.opciones) {
      if (o.error && o.error.concepto) {
        if (!alcanzados.has(id)) alcanzados.set(id, new Set());
        alcanzados.get(id).add(o.error.id);
      }
    }
  });
  const fallos = [];
  for (const [id, tipo] of Object.entries(TIPOS)) {
    if (!tipo.errores) continue;
    const vistos = alcanzados.get(id) || new Set();
    const nunca = Object.keys(tipo.errores).filter(e => !vistos.has(e));
    if (nunca.length) fallos.push(`${id}: ${nunca.join(', ')}`);
  }
  assert.deepEqual(fallos, [], `\n  errores declarados que nunca llegan al alumno:\n  ${fallos.join('\n  ')}\n`);
});
