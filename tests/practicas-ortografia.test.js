// Práctica de ortografía española (practicas/ortografia/): el banco de frases y
// las explicaciones. Lo que se puede comprobar por la forma: un solo hueco,
// la palabra que va detrás del hueco casa con la respuesta (participio tras
// «ha» / «he»; i- o hi- + consonante tras «e»; un auxiliar o «está», «un»…
// antes de «hecho»). El significado de cada frase hay que revisarlo a mano.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { esc } from '../practicas/_comun/textos.js';
import {
  PAREJAS, CLAVES_PAREJAS, partes, rellenar, otra, generadorHueco, generarRevision, estaBien, idError,
} from '../practicas/ortografia/logica.js';
import { explicacion } from '../practicas/ortografia/textos.js';

const IRREGULARES = ['hecho', 'roto', 'puesto', 'vuelto', 'escrito', 'visto', 'dicho', 'abierto', 'muerto', 'impreso'];
const esParticipio = palabra => /(ado|ido|ído)$/i.test(palabra) || IRREGULARES.includes(palabra.toLowerCase());
const todas = () => CLAVES_PAREJAS.flatMap(pareja => PAREJAS[pareja].frases.map((f, n) => ({ pareja, n, texto: f[0], buena: f[1] })));

test('ortografía: cada frase tiene un solo hueco, no al principio, y una respuesta de su pareja', () => {
  for (const { pareja, texto, buena } of todas()) {
    assert.equal(texto.split('_').length, 2, `un solo hueco: ${texto}`);
    assert.ok(!texto.startsWith('_') && !/^[¿¡]_/.test(texto), `el hueco no va al principio: ${texto}`);
    assert.ok([PAREJAS[pareja].sin, PAREJAS[pareja].con].includes(buena), texto);
    assert.doesNotMatch(texto, /hab[ií]a/i, `sin «había» (es la palabra del truco): ${texto}`);
    assert.doesNotMatch(texto, /\ba ver\b|\bhaber\b|\bha de\b/i, `ni «a ver», ni «haber», ni «ha de»: ${texto}`);
  }
});

test('ortografía: sin frases repetidas y al menos 12 de cada palabra', () => {
  const textos = todas().map(f => f.texto);
  assert.equal(new Set(textos).size, textos.length);
  for (const pareja of CLAVES_PAREJAS) {
    const p = PAREJAS[pareja];
    for (const palabra of [p.sin, p.con]) {
      assert.ok(p.frases.filter(f => f[1] === palabra).length >= 12, `${pareja}: frases con «${palabra}»`);
    }
  }
});

test('ortografía, a / ha: «ha» va delante de un participio y «a» nunca', () => {
  PAREJAS.a_ha.frases.forEach((f, n) => {
    const { siguiente, buena } = partes('a_ha', n);
    assert.equal(esParticipio(siguiente), buena === 'ha', f[0]);
  });
});

test('ortografía, e / he: «he» va delante de un participio; «e», delante de i- o hi- y de consonante', () => {
  PAREJAS.e_he.frases.forEach((f, n) => {
    const { siguiente, buena } = partes('e_he', n);
    if (buena === 'he') {
      assert.ok(esParticipio(siguiente), f[0]);
    } else {
      // Delante de hie- (hielo, hierro) se escribe «y»: no sirve para «e».
      assert.match(siguiente, /^h?[iíÍI][^aeiouáéíóú]/i, `«e» delante de i- o hi- + consonante: ${f[0]}`);
      assert.ok(!esParticipio(siguiente), f[0]);
    }
  });
});

test('ortografía, echo / hecho: «hecho» va tras un auxiliar, «está», «un», «muy», «bien» o «de»; «echo», nunca tras un auxiliar', () => {
  const AUX = ['he', 'has', 'ha', 'hemos', 'han'];
  const ANTES_DE_HECHO = [...AUX, 'está', 'un', 'muy', 'bien', 'de'];
  PAREJAS.echo_hecho.frases.forEach((f, n) => {
    const { antes, buena } = partes('echo_hecho', n);
    const anterior = antes.trim().split(/\s+/).at(-1).toLowerCase().replace(/^[¿¡]/, '');
    if (buena === 'hecho') assert.ok(ANTES_DE_HECHO.includes(anterior), `${f[0]} («${anterior}»)`);
    else assert.ok(!AUX.includes(anterior), f[0]);
  });
});

test('ortografía: los generadores dan las dos palabras a partes iguales, más o menos', () => {
  const rng = crearRng(7);
  for (const pareja of CLAVES_PAREJAS) {
    const generar = generadorHueco(pareja);
    let conH = 0;
    for (let i = 0; i < 2000; i++) {
      const item = generar(rng);
      assert.equal(item.pareja, pareja);
      if (partes(pareja, item.n).buena === PAREJAS[pareja].con) conH++;
    }
    assert.ok(conH > 850 && conH < 1150, `${pareja}: ${conH} de 2000 con h`);
  }
  let bien = 0;
  const vistas = new Set();
  for (let i = 0; i < 4000; i++) {
    const item = generarRevision(rng);
    vistas.add(item.pareja);
    const { buena } = partes(item.pareja, item.n);
    assert.ok([buena, otra(item.pareja, buena)].includes(item.puesta));
    if (estaBien(item)) bien++;
  }
  assert.equal(vistas.size, 3);
  assert.ok(bien > 1800 && bien < 2200, `${bien} de 4000 bien escritas`);
});

test('ortografía: las explicaciones prueban el truco con la frase del ítem', () => {
  // a / ha: «ha» → «había» queda bien; «a» → «había», no.
  const ha = PAREJAS.a_ha.frases.findIndex(f => f[0].startsWith('Mi hermano ya'));
  assert.match(explicacion('a_ha', ha, esc), /Va <b>ha<\/b>.*Mi hermano ya había llegado del instituto\..*✓/);
  const a = PAREJAS.a_ha.frases.findIndex(f => f[0].startsWith('Mañana voy'));
  assert.match(explicacion('a_ha', a, esc), /Va <b>a<\/b>.*Mañana voy había la playa.*✗/);
  // e / he: «e» dice por qué letra empieza la palabra de detrás.
  const hijos = PAREJAS.e_he.frases.findIndex(f => f[0].includes('padres _ hijos'));
  assert.match(explicacion('e_he', hijos, esc), /Va <b>e<\/b>.*«hijos» empieza por hi\b/);
  const isabel = PAREJAS.e_he.frases.findIndex(f => f[0].includes('Marta _ Isabel'));
  assert.match(explicacion('e_he', isabel, esc), /«Isabel» empieza por i\b/);
  const ido = PAREJAS.e_he.frases.findIndex(f => f[0].includes('_ ido'));
  assert.match(explicacion('e_he', ido, esc), /Va <b>he<\/b>.*yo he ido.*Yo había ido al cine/);
  // echo / hecho: tras «he», el aviso de «echado».
  const deberes = PAREJAS.echo_hecho.frases.findIndex(f => f[0].startsWith('Ya he _'));
  assert.match(explicacion('echo_hecho', deberes, esc), /Va <b>hecho<\/b>.*detrás de «he» nunca va «echo».*«he echado»/);
  const sal = PAREJAS.echo_hecho.frases.findIndex(f => f[0].includes('sal a la ensalada'));
  assert.match(explicacion('echo_hecho', sal, esc), /Va <b>echo<\/b>, del verbo <b>echar<\/b>/);
  // Todas tienen texto y dicen la palabra buena.
  for (const { pareja, n, buena } of todas()) assert.match(explicacion(pareja, n, esc), new RegExp(`Va <b>${buena}</b>`));
});

test('ortografía: el identificador del error vale para el panel', () => {
  for (const { pareja, n, buena } of todas()) {
    const id = idError(pareja, n, otra(pareja, buena));
    assert.match(id, /^[a-z0-9-]{1,40}$/);
    assert.equal(id, `${otra(pareja, buena)}-por-${buena}`);
  }
  assert.equal(rellenar('a_ha', 0, 'ha'), PAREJAS.a_ha.frases[0][0].replace('_', 'ha'));
});

test('ortografía: el aviso de «echado» también tras «¿Has…»', () => {
  const cama = PAREJAS.echo_hecho.frases.findIndex(f => f[0].startsWith('¿Has _'));
  assert.match(explicacion('echo_hecho', cama, esc), /detrás de «has» nunca va «echo».*«has echado»/);
});
