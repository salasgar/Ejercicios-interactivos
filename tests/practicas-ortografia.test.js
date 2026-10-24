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
  PAREJAS, CLAVES_PAREJAS, partes, rellenar, otra, generadorHueco, generarRevision, estaBien, idError, slug,
} from '../practicas/ortografia/logica.js';
import { explicacion } from '../practicas/ortografia/textos.js';
import {
  VOCATIVO_ESCRITA, VOCATIVO_SIGNIFICADO, COMAS_SIGNIFICADO, generarVocativo, generarComas, opciones, buena as buenaComa, explicacionComa, idErrorComa,
} from '../practicas/ortografia/comas.js';
import { INTERROGATIVOS, listaDe, frase, alPrincipio, generadorTilde, explicacionTilde, idErrorTilde, PARES, PREGUNTAS, explicacionExtra, idErrorExtra } from '../practicas/ortografia/tildes.js';
import { SIGNOS, generarSignos, opcionesSignos, explicacionSignos, idErrorSignos } from '../practicas/ortografia/signos.js';
import { SUJETOS, INCISOS, frases as frasesSujeto, generarSujeto, opcionesSujeto, explicacionSujeto, idErrorSujeto } from '../practicas/ortografia/sujeto.js';

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
    assert.equal(id, `${slug(otra(pareja, buena))}-por-${slug(buena)}`);
  }
  assert.equal(rellenar('a_ha', 0, 'ha'), PAREJAS.a_ha.frases[0][0].replace('_', 'ha'));
});

test('ortografía: el aviso de «echado» también tras «¿Has…»', () => {
  const cama = PAREJAS.echo_hecho.frases.findIndex(f => f[0].startsWith('¿Has _'));
  assert.match(explicacion('echo_hecho', cama, esc), /detrás de «has» nunca va «echo».*«has echado»/);
});

// --- porque / por qué (ejercicio 5) --------------------------------------------------

test('ortografía, porque / por qué: «por qué» en una pregunta o tras un verbo de preguntar; «porque», nunca justo tras «¿»', () => {
  const INDIRECTAS = /^(Dime|Explícame|Explícanos|Me pregunto|Quiero saber) $/;
  PAREJAS.porque.frases.forEach((f, n) => {
    const { antes, buena } = partes('porque', n);
    assert.doesNotMatch(f[0], /\b(el|un) _/, `sin «el porqué»: ${f[0]}`);
    if (buena === 'por qué') assert.ok(antes.includes('¿') || INDIRECTAS.test(antes), `pregunta: ${f[0]}`);
    else assert.doesNotMatch(antes, /¿\s*$/, f[0]);
  });
  const llego = PAREJAS.porque.frases.findIndex(f => f[0].startsWith('Llego tarde'));
  assert.match(explicacion('porque', llego, esc), /Va <b>porque<\/b>.*Llego tarde ya que he perdido el autobús\.<\/i> ✓/);
  const dime = PAREJAS.porque.frases.findIndex(f => f[0].startsWith('Dime'));
  assert.match(explicacion('porque', dime, esc), /Va <b>por qué<\/b>.*aunque no lleve ¿\?/);
  assert.equal(idError('porque', dime, 'porque'), 'porque-por-por-que');
});

test('ortografía: el ejercicio 4 sigue mezclando solo las tres primeras parejas', () => {
  const rng = crearRng(3);
  for (let i = 0; i < 500; i++) assert.ok(['a_ha', 'e_he', 'echo_hecho'].includes(generarRevision(rng).pareja));
});

// --- Comas (ejercicios 6 y 7) ---------------------------------------------------------

const sinComas = t => t.replace(/,/g, '').replace(/\s+/g, ' ');
const comas = t => (t.match(/,/g) ?? []).length;

test('comas, vocativo «escrita»: las malas son la buena con alguna coma de menos', () => {
  for (const { voc, frases } of VOCATIVO_ESCRITA) {
    const [bien, ...malas] = frases;
    assert.ok(malas.length >= 1 && malas.length <= 2, bien);
    assert.ok(bien.toLowerCase().includes(voc.toLowerCase()), bien);
    assert.equal(new Set(frases).size, frases.length, bien);
    for (const m of malas) {
      assert.equal(sinComas(m), sinComas(bien), `solo cambian las comas: ${m}`);
      assert.ok(comas(m) < comas(bien), m);
    }
  }
});

test('comas, «significado»: dos frases que solo se diferencian en las comas, dos sentidos distintos', () => {
  for (const p of [...VOCATIVO_SIGNIFICADO, ...COMAS_SIGNIFICADO]) {
    assert.equal(p.frases.length, 2);
    assert.notEqual(p.frases[0], p.frases[1]);
    assert.equal(sinComas(p.frases[0]), sinComas(p.frases[1]), p.frases[0]);
    assert.equal(p.sentidos.length, 2);
    assert.notEqual(p.sentidos[0], p.sentidos[1]);
    assert.ok(p.por.length > 20);
  }
  assert.ok(VOCATIVO_SIGNIFICADO.length >= 6 && COMAS_SIGNIFICADO.length >= 8);
});

test('comas: los generadores, las opciones y la explicación casan', () => {
  const rng = crearRng(11);
  const tipos = { escrita: 0, significado: 0 };
  const cual = [0, 0];
  for (let i = 0; i < 3000; i++) {
    const v = generarVocativo(rng);
    tipos[v.tipo]++;
    const ops = opciones(v);
    assert.equal(new Set(ops.map(o => o.k)).size, ops.length);
    assert.ok(ops.some(o => o.k === buenaComa(v)));
    if (v.tipo === 'escrita') {
      assert.equal(ops.length, VOCATIVO_ESCRITA[v.i].frases.length);
      assert.ok(explicacionComa(v).includes(VOCATIVO_ESCRITA[v.i].frases[0]));
      assert.equal(idErrorComa(v), 'vocativo-sin-coma');
    } else {
      assert.equal(v.grupo, 'vocativo');
      assert.equal(idErrorComa(v), 'vocativo-significado');
    }
    const c = generarComas(rng);
    assert.equal(c.grupo, 'comas');
    cual[c.cual]++;
    assert.ok(explicacionComa(c).includes(COMAS_SIGNIFICADO[c.i].frases[c.cual]));
    assert.match(idErrorComa(c), /^[a-z0-9-]{1,40}$/);
  }
  assert.ok(tipos.escrita > 1300 && tipos.significado > 1300, JSON.stringify(tipos));
  assert.ok(cual[0] > 1300 && cual[1] > 1300, JSON.stringify(cual));
});

// --- Tildes (ejercicios 8 y 9) y signos (ejercicio 10) -------------------------------

test('tildes: cada frase tiene un hueco, su pareja y un motivo; las dos palabras salen a partes iguales', () => {
  for (const grupo of ['interrogativos', 'diacriticas']) {
    const lista = listaDe(grupo);
    lista.forEach(([texto], n) => {
      assert.equal(texto.split('_').length, 2, texto);
      const f = frase(grupo, n);
      assert.ok(f.opciones && f.opciones.includes(f.buena), texto);
      assert.notEqual(f.opciones[0], f.opciones[1]);
      if (alPrincipio(grupo, n)) assert.match(f.antes, /^[¿¡]?$/);
      else assert.ok(!/^[¿¡]?$/.test(f.antes));
      assert.match(explicacionTilde(grupo, n), new RegExp(`Va <b>${f.buena}</b>`, 'i'));
      assert.match(idErrorTilde(grupo, n), /^[a-z0-9-]{1,40}$/);
    });
    assert.equal(new Set(lista.map(f => f[0])).size, lista.length, `${grupo}: sin repetidas`);
    const rng = crearRng(5);
    const generar = generadorTilde(grupo);
    let con = 0;
    let huecos = 0;
    for (let i = 0; i < 4000; i++) {
      const it = generar(rng);
      if (it.tipo !== 'hueco') continue;
      huecos++;
      if (frase(grupo, it.n).buena === frase(grupo, it.n).opciones[1]) con++;
    }
    assert.ok(huecos > 2800 && huecos < 3200, `${grupo}: ${huecos} de 4000 son huecos`);
    assert.ok(con > huecos * 0.43 && con < huecos * 0.57, `${grupo}: ${con} de ${huecos} con tilde`);
  }
});

test('tildes, interrogativos: con tilde en preguntas, exclamaciones y «No sé _»; sin tilde, nunca en esos sitios', () => {
  INTERROGATIVOS.forEach(([texto, buena, motivo], n) => {
    const { antes } = frase('interrogativos', n);
    if (motivo === 'pregunta') assert.ok(antes.includes('¿'), texto);
    if (motivo === 'exclamacion') assert.match(antes, /¡$/, texto);
    if (motivo === 'indirecta') assert.ok(['No sé ', 'Mi hermana dice '].includes(antes), texto);
    if (motivo === 'no' || motivo === 'causa') assert.doesNotMatch(antes, /[¿¡]$|^No sé $/, texto);
    assert.equal(['no', 'causa'].includes(motivo), buena === frase('interrogativos', n).opciones[0], texto);
  });
  // Las que valen de las dos maneras no pueden estar.
  for (const prohibida of ['Me gusta _ cantas.', 'Dime _ quieres.']) assert.ok(!INTERROGATIVOS.some(f => f[0] === prohibida));
});

test('signos: las malas son la buena con un fallo de signos o espacios, y la explicación dice cuál', () => {
  const letras = t => t.replace(/[\s¿?¡!,.]/g, '');
  for (const { bien, malas } of SIGNOS) {
    assert.equal(malas.length, 2, bien);
    for (const [m, motivo] of malas) {
      assert.notEqual(m, bien);
      assert.equal(letras(m), letras(bien), `solo cambian signos y espacios: ${m}`);
      assert.ok(motivo.length > 20);
    }
  }
  const rng = crearRng(9);
  for (let i = 0; i < 500; i++) {
    const item = generarSignos(rng);
    const ops = opcionesSignos(item);
    assert.deepEqual([...ops.map(o => o.k)].sort(), [0, 1, 2]);
    assert.ok(explicacionSignos(item, 0).includes(SIGNOS[item.i].bien));
    for (const k of [1, 2]) {
      assert.ok(explicacionSignos(item, k).includes(SIGNOS[item.i].malas[k - 1][1]));
      assert.match(idErrorSignos(item, k), /^[a-z0-9-]{1,40}$/);
    }
  }
});

// --- Sujeto y verbo frente a inciso (ejercicio 11) -----------------------------------

test('sujeto: la buena no lleva coma y la mala solo la del sujeto; nunca la versión con dos comas', () => {
  SUJETOS.forEach((_, i) => {
    const fs = frasesSujeto({ tipo: 'sujeto', i });
    assert.equal(fs.length, 2);
    assert.equal((fs[0][0].match(/,/g) ?? []).length, 0, fs[0][0]);
    assert.equal((fs[1][0].match(/,/g) ?? []).length, 1, fs[1][0]);
    assert.equal(fs[1][0].replace(',', ''), fs[0][0]);
  });
});

test('inciso: la buena lleva las dos comas y cada mala solo una; ninguna empieza por un nombre de persona', () => {
  INCISOS.forEach(([antes], i) => {
    const fs = frasesSujeto({ tipo: 'inciso', i });
    assert.equal(fs.length, 3);
    assert.equal((fs[0][0].match(/,/g) ?? []).length, 2, fs[0][0]);
    for (const [m] of fs.slice(1)) {
      assert.equal((m.match(/,/g) ?? []).length, 1, m);
      assert.equal(m.replace(/,/g, ''), fs[0][0].replace(/,/g, ''));
    }
    // Con un nombre al principio, la de una coma se leería como vocativo (y valdría).
    assert.doesNotMatch(antes, /^(Lucía|Pablo|Marta|Marcos|Ana|Pedro|Sara|Laura|Juan)\b/, antes);
  });
});

test('sujeto e inciso: generador, opciones, explicación e identificador del error', () => {
  const rng = crearRng(13);
  const tipos = { sujeto: 0, inciso: 0 };
  for (let i = 0; i < 2000; i++) {
    const item = generarSujeto(rng);
    tipos[item.tipo]++;
    const ops = opcionesSujeto(item);
    assert.deepEqual([...ops.map(o => o.k)].sort(), item.tipo === 'sujeto' ? [0, 1] : [0, 1, 2]);
    assert.ok(explicacionSujeto(item, 0).includes(frasesSujeto(item)[0][0]));
    for (const o of ops.filter(o => o.k > 0)) assert.match(idErrorSujeto(item, o.k), /^[a-z0-9-]{1,40}$/);
  }
  assert.ok(tipos.sujeto > 850 && tipos.inciso > 850, JSON.stringify(tipos));
  const lapiz = { tipo: 'sujeto', i: 0, orden: [0, 1] };
  assert.match(explicacionSujeto(lapiz, 1), /«El lápiz que te dejé» es el sujeto, y «era…»/);
  const aquel = { tipo: 'inciso', i: 0, orden: [0, 1, 2] };
  assert.match(explicacionSujeto(aquel, 1), /«el que yo te dejé».*«Aquel lápiz era rojo\.».*le falta la de delante/);
});

test('tildes: los pares de Juan Luis solo cambian en la tilde (y la puntuación o el artículo que la deciden), con dos sentidos distintos', () => {
  const sinTildes = t => t.normalize('NFD').replace(/\u0301/g, '').normalize('NFC').toLowerCase().replace(/[^a-zñ ]/g, '').replace(/\bel /g, '');
  for (const grupo of ['interrogativos', 'diacriticas']) {
    for (const p of PARES[grupo]) {
      assert.equal(p.frases.length, 2);
      assert.notEqual(p.frases[0], p.frases[1]);
      assert.equal(sinTildes(p.frases[0]), sinTildes(p.frases[1]), p.frases[0]);
      assert.notEqual(p.sentidos[0], p.sentidos[1]);
      for (const cual of [0, 1]) assert.ok(explicacionExtra({ tipo: 'par', grupo, i: PARES[grupo].indexOf(p), cual }).includes(p.frases[cual]));
    }
  }
  // La silla: «tu silla» (la tuya) → no; «tú silla» (¿la llevarás tú?) → sí.
  assert.deepEqual(PREGUNTAS.map(q => [q.pregunta, q.respuesta]), [['¿Llevarás tu silla?', 'no'], ['¿Llevarás tú silla?', 'sí']]);
  assert.equal(idErrorExtra({ tipo: 'pregunta', i: 0 }), 'tu-tu-significado');
  assert.equal(idErrorExtra({ tipo: 'par', grupo: 'interrogativos', i: 0 }), 'tilde-significado');
  // En el 8 solo hay pares; las preguntas de sí o no salen en el 9.
  const rng = crearRng(21);
  const vistos = { interrogativos: new Set(), diacriticas: new Set() };
  for (const grupo of Object.keys(vistos)) for (let i = 0; i < 2000; i++) vistos[grupo].add(generadorTilde(grupo)(rng).tipo);
  assert.deepEqual([...vistos.interrogativos].sort(), ['hueco', 'par']);
  assert.deepEqual([...vistos.diacriticas].sort(), ['hueco', 'par', 'pregunta']);
});

test('tildes: las explicaciones nuevas usan la frase del ejercicio', () => {
  const L = listaDe('interrogativos');
  const examen = L.findIndex(f => f[0] === 'Mi hermana dice _ examen era difícil.');
  assert.match(explicacionTilde('interrogativos', examen), /«¿Qué examen era difícil\?»/);
  const como = L.findIndex(f => f[0] === '_ voy a ir, no me importa.');
  assert.ok(alPrincipio('interrogativos', como));
  assert.match(explicacionTilde('interrogativos', como), /Va <b>Como<\/b>, sin tilde.*«Ya que voy a ir, no me importa\.»/);
  const si = listaDe('diacriticas').findIndex(f => f[0] === '_ ha hecho los deberes; no le suspendas.');
  assert.match(explicacionTilde('diacriticas', si), /Va <b>Sí<\/b>/);
});
