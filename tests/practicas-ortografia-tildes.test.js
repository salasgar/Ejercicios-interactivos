// Ortografía: las tildes (practicas/ortografia-tildes/, tarea 135): el motor de reglas
// `acentuar` contra una tabla hecha aparte, los cuatro bancos ítem a ítem (la forma escrita
// a mano tiene que ser la que da el motor), los niveles, el equilibrio, los generadores por
// fuerza bruta (nunca por encima del nivel) y los idError. El significado de cada frase y la
// partición en sílabas se revisan a mano; los `montar`, con clics en el navegador.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearRng } from '../practicas/_comun/rng.js';
import { nivelDe } from '../practicas/_comun/nivel.js';
import {
  acentuar, clase, razon, nucleoValido, nucleo, tipoUnion, sinTildes, parsear, escritaDe, llevaTilde, letraConTilde,
  TONICA, TILDE, VOCALES_BANCO, MATES,
  generarTonica, generarTilde, generarVocales, generarMates, clasesDe, nombreClase,
  explicacionTonica1, explicacionTonica2, explicacionTilde, explicacionVocales, explicacionAun, explicacionMates,
  idErrorTonica1, idErrorTonica2, idErrorTilde, idErrorVocales, idErrorAun, idErrorMates,
} from '../practicas/ortografia-tildes/logica.js';

const PATRON_ID = /^[a-z0-9-]{1,40}$/;

// Lo que nunca es distractor (docs/practicas-ortografia.md, §6): ninguna palabra de los bancos, con o sin tilde.
const LISTA_NEGRA = ['solo', 'sólo', 'este', 'éste', 'ese', 'ése', 'aquel', 'aquél', 'guion', 'guión', 'truhan', 'truhán', 'hui', 'huí', 'fie', 'fié', 'rio', 'frio',
  'sion', 'ruan', 'período', 'periodo', 'vídeo', 'video', 'cardíaco', 'cardiaco', 'olimpíada', 'olimpiada', 'alvéolo', 'alveolo', 'policíaco', 'policiaco',
  'fútbol', 'futbol', 'chófer', 'chofer', 'icono', 'ícono', 'élite', 'elite', 'quilómetro', 'quilometro', 'octógono', 'octágono', 'cinc', 'zinc', 'biznieto', 'bisnieto'];

const ejercicios = [
  { nombre: 'tónica', banco: TONICA, generar: generarTonica },
  { nombre: '¿lleva tilde?', banco: TILDE, generar: generarTilde },
  { nombre: 'diptongos e hiatos', banco: VOCALES_BANCO, generar: generarVocales },
  { nombre: 'matemáticas', banco: MATES, generar: generarMates },
];
const palabrasDe = banco => banco.filter(it => it.tipo !== 'aun');
const porNivel = (banco, n) => banco.filter(it => it.nivel === n);

test('acentuar: una tabla hecha aparte de los bancos (reglas generales, hiatos, monosílabos, mayúsculas)', () => {
  const tabla = [
    [['re', 'loj'], 1, 'reloj'], [['pa', 'pel'], 1, 'papel'], [['ca', 'fe'], 1, 'café'], [['ca', 'sa'], 0, 'casa'], [['la', 'piz'], 0, 'lápiz'],
    [['ar', 'bol'], 0, 'árbol'], [['me', 'sa'], 0, 'mesa'], [['mu', 'si', 'ca'], 0, 'música'], [['can', 'cion'], 1, 'canción'], [['ca', 'mion'], 1, 'camión'],
    [['so', 'fa'], 1, 'sofá'], [['des', 'pues'], 1, 'después'], [['ja', 'mas'], 1, 'jamás'], [['e', 'xa', 'men'], 1, 'examen'],
    [['e', 'xa', 'me', 'nes'], 1, 'exámenes'], [['jo', 'ven'], 0, 'joven'], [['jo', 've', 'nes'], 0, 'jóvenes'], [['bi', 'ceps'], 0, 'bíceps'],
    [['ro', 'bots'], 1, 'robots'], [['co', 'mics'], 0, 'cómics'], [['jer', 'sey'], 1, 'jersey'], [['vi', 'rrey'], 1, 'virrey'],
    [['cui', 'da', 'te'], 0, 'cuídate'], [['es', 'tu', 'diais'], 2, 'estudiáis'], [['pro', 'hi', 'be'], 1, 'prohíbe'], [['fue'], 0, 'fue'], [['dio'], 0, 'dio'],
    [['di', 'a'], 0, 'día'], [['pa', 'is'], 1, 'país'], [['ra', 'iz'], 1, 'raíz'], [['bu', 'ho'], 0, 'búho'], [['ba', 'ul'], 1, 'baúl'], [['o', 'ir'], 1, 'oír'],
    [['po', 'e', 'ta'], 1, 'poeta'], [['le', 'on'], 1, 'león'], [['a', 'e', 're', 'o'], 1, 'aéreo'], [['rui', 'do'], 0, 'ruido'], [['cui', 'da', 'do'], 1, 'cuidado'],
    [['tam', 'bien'], 1, 'también'], [['ciu', 'dad'], 1, 'ciudad'], [['An', 'gel'], 0, 'Ángel'], [['A', 'fri', 'ca'], 0, 'África'],
    [['de', 'vuel', 've', 'me', 'lo'], 1, 'devuélvemelo'], [['ca', 'rac', 'ter'], 1, 'carácter'], [['ca', 'rac', 'te', 'res'], 2, 'caracteres'],
    [['ve', 'hi', 'cu', 'lo'], 1, 'vehículo'], [['a', 'hin', 'co'], 1, 'ahínco'], [['qui', 'mi', 'ca'], 0, 'química'], [['gui', 'ta', 'rra'], 1, 'guitarra'],
    [['pa', 'ra', 'guas'], 1, 'paraguas'], [['dia', 'me', 'tro'], 0, 'diámetro'], [['i', 'de', 'a'], 1, 'idea'], [['re', 'hen'], 1, 'rehén'],
    [['cam', 'biais'], 1, 'cambiáis'], [['a', 've', 'ri', 'guais'], 3, 'averiguáis'], [['trian', 'gu', 'lo'], 0, 'triángulo'], [['vein', 'tiun'], 1, 'veintiún'],
  ];
  assert.ok(tabla.length >= 40);
  for (const [silabas, tonica, esperada] of tabla) assert.equal(acentuar(silabas, tonica), esperada, silabas.join('-'));
});

test('clase y razón: agudas, llanas, esdrújulas, sobresdrújulas y el motivo de cada tilde', () => {
  assert.equal(clase(['pa', 'pel'], 1), 'aguda');
  assert.equal(clase(['ca', 'sa'], 0), 'llana');
  assert.equal(clase(['mu', 'si', 'ca'], 0), 'esdrujula');
  assert.equal(clase(['cuen', 'ta', 'me', 'lo'], 0), 'sobresdrujula');
  assert.equal(clase(['fue'], 0), 'monosilaba');
  const motivos = [
    [['ca', 'mion'], 1, 'aguda-con'], [['re', 'loj'], 1, 'aguda-sin'], [['jer', 'sey'], 1, 'aguda-sin'], [['ro', 'bots'], 1, 'aguda-sin'],
    [['la', 'piz'], 0, 'llana-con'], [['bi', 'ceps'], 0, 'llana-con'], [['e', 'xa', 'men'], 1, 'llana-sin'], [['ca', 'sa'], 0, 'llana-sin'],
    [['mu', 'si', 'ca'], 0, 'esdrujula'], [['di', 'a'], 0, 'hiato'], [['dio'], 0, 'monosilaba'],
  ];
  for (const [s, t, motivo] of motivos) assert.equal(razon(s, t).motivo, motivo, s.join('-'));
});

test('núcleos: una vocal, un diptongo o un triptongo por sílaba; la u de que, qui, gue y gui no cuenta', () => {
  for (const s of ['ca', 'cion', 'ruid', 'qui', 'que', 'gui', 'gue', 'gu', 'guais', 'diais', 'bien', 'cuid', 'tiun', 'ia']) assert.ok(nucleoValido(s), s);
  for (const s of ['ae', 'eo', 'oa', 'pa-e', 'iuo', '']) assert.ok(!nucleoValido(s), s);
  assert.equal(nucleo('qui'), 'i');
  assert.equal(nucleo('gu'), 'u');
  assert.equal(nucleo('guais'), 'uai');
  assert.equal(nucleo('cion'), 'io');
});

test('tipoUnion: hiato, triptongo, ui/iu, diptongo y hiato de abiertas', () => {
  const casos = [
    [['di', 'a'], 0, 'hiato'], [['bu', 'ho'], 0, 'hiato'], [['es', 'tu', 'diais'], 2, 'triptongo'], [['rui', 'do'], 0, 'ui-iu'],
    [['tam', 'bien'], 1, 'diptongo'], [['po', 'e', 'ta'], 1, 'hiato-abiertas'], [['re', 'hen'], 1, 'hiato-abiertas'], [['ca', 'sa'], 0, null],
  ];
  for (const [s, t, esperado] of casos) assert.equal(tipoUnion(s, t), esperado, s.join('-'));
});

test('parsear: la notación de los bancos (sílabas, tónica, tildes a mano y -mente)', () => {
  const lapiz = parsear("'lá-piz", 2);
  assert.deepEqual({ palabra: lapiz.palabra, escrita: lapiz.escrita, silabas: lapiz.silabas, tonica: lapiz.tonica, mente: lapiz.mente, nivel: lapiz.nivel },
    { palabra: 'lapiz', escrita: 'lápiz', silabas: ['la', 'piz'], tonica: 0, mente: false, nivel: 2 });
  const facil = parsear("'fá-cil|mente", 3);
  assert.deepEqual(facil.silabas, ['fa', 'cil', 'men', 'te']);
  assert.equal(facil.escrita, 'fácilmente');
  assert.equal(facil.palabra, 'facilmente');
  assert.equal(escritaDe(facil), 'fácilmente');
  assert.equal(parsear("'Án-gel", 3).palabra, 'Angel');
  assert.throws(() => parsear('la-piz', 1), /tónica/);
  assert.equal(sinTildes('Ángel, camión, pingüino y ñu'), 'Angel, camion, pingüino y ñu', 'solo quita las tildes agudas');
});

for (const { nombre, banco } of ejercicios) {
  test(`${nombre}: cada ítem tiene su nivel y la forma escrita a mano es la que da el motor`, () => {
    for (const it of palabrasDe(banco)) {
      assert.ok([1, 2, 3].includes(it.nivel), it.escrita);
      assert.equal(it.silabas.join(''), it.palabra, it.escrita);
      assert.ok(it.silabas.every(nucleoValido), `un solo núcleo por sílaba: ${it.escrita}`);
      assert.equal(sinTildes(it.escrita).toLowerCase(), it.palabra.toLowerCase(), `la forma escrita solo difiere en tildes: ${it.escrita}`);
      assert.equal(escritaDe(it), it.escrita, `el motor da «${escritaDe(it)}» y el banco dice «${it.escrita}»`);
      assert.ok(it.tonica >= 0 && it.tonica < (it.mente ? it.silabas.length - 2 : it.silabas.length), it.escrita);
    }
    const palabras = palabrasDe(banco).map(it => it.palabra.toLowerCase());
    assert.equal(new Set(palabras).size, palabras.length, 'sin palabras repetidas dentro del ejercicio');
  });

  test(`${nombre}: al menos 16 ítems por nivel`, () => {
    for (const n of [1, 2, 3]) assert.ok(porNivel(banco, n).length >= 16, `nivel ${n}: ${porNivel(banco, n).length}`);
  });

  test(`${nombre}: ninguna palabra de la lista negra (lo que nunca es distractor)`, () => {
    for (const it of banco) {
      const formas = it.tipo === 'aun' ? [] : [it.palabra, it.escrita, it.mala].filter(Boolean);
      for (const f of formas) assert.ok(!LISTA_NEGRA.includes(f.toLowerCase()), f);
    }
  });
}

test('tónica: cada clase aparece al menos una cuarta parte de las veces en su nivel', () => {
  for (const n of [1, 2, 3]) {
    const items = porNivel(TONICA, n);
    for (const c of clasesDe(items[0])) {
      const cuantas = items.filter(it => it.clase === c).length;
      assert.ok(cuantas / items.length >= 0.25, `nivel ${n}, ${c}: ${cuantas} de ${items.length}`);
    }
    assert.ok(items.every(it => clasesDe(it).includes(it.clase)), 'la clase buena está entre los botones');
  }
  assert.deepEqual(clasesDe({ nivel: 1 }), ['aguda', 'llana', 'esdrujula']);
  assert.deepEqual(clasesDe({ nivel: 3 }), ['aguda', 'llana', 'esdrujula', 'sobresdrujula']);
  assert.ok(TONICA.every(it => !it.mente && it.silabas.length >= 2), 'sin adverbios en -mente ni monosílabos');
});

test('¿lleva tilde? y diptongos: entre el 40 % y el 60 % de las palabras de cada nivel llevan tilde', () => {
  for (const [nombre, banco] of [['¿lleva tilde?', TILDE], ['diptongos e hiatos', palabrasDe(VOCALES_BANCO)]]) {
    for (const n of [1, 2, 3]) {
      const items = porNivel(banco, n);
      const con = items.filter(llevaTilde).length;
      assert.ok(con / items.length >= 0.4 && con / items.length <= 0.6, `${nombre}, nivel ${n}: ${con} de ${items.length}`);
    }
  }
});

test('¿lleva tilde?: en el nivel 3 están los adverbios en -mente, los monosílabos y las mayúsculas', () => {
  const tres = porNivel(TILDE, 3);
  assert.equal(tres.filter(it => it.mente).length, 4);
  assert.ok(tres.some(it => it.silabas.length === 1));
  assert.ok(tres.some(it => /^[A-ZÁÉÍÓÚ]/.test(it.escrita) && llevaTilde(it)));
  assert.ok(TILDE.filter(it => it.nivel < 3).every(it => !it.mente && it.silabas.length > 1));
});

test('diptongos e hiatos: todas las palabras tienen dos vocales juntas, y cada tipo de unión aparece', () => {
  const palabras = palabrasDe(VOCALES_BANCO);
  assert.ok(palabras.every(it => it.union !== null), 'todas tienen vocales juntas');
  for (const tipo of ['hiato', 'diptongo', 'ui-iu', 'triptongo', 'hiato-abiertas']) assert.ok(palabras.some(it => it.union === tipo), tipo);
  for (const it of palabras) {
    const i = letraConTilde(it);
    if (llevaTilde(it)) assert.equal(it.escrita[i], 'áéíóúÁÉÍÓÚ'.includes(it.escrita[i]) ? it.escrita[i] : null, `la letra ${i} de ${it.escrita} lleva la tilde`);
    else assert.equal(i, null);
    assert.equal(it.palabra.length, it.escrita.length, 'una letra por letra: se toca la letra de la palabra');
  }
});

test('diptongos e hiatos: aún / aun solo en frase, dos de cada, en el nivel 3, con una sola lectura', () => {
  const aun = VOCALES_BANCO.filter(it => it.tipo === 'aun');
  assert.equal(aun.length, 4);
  assert.ok(aun.every(it => it.nivel === 3));
  assert.equal(aun.filter(it => it.buena.toLowerCase() === 'aún').length, 2);
  for (const it of aun) {
    assert.equal(sinTildes(it.buena).toLowerCase(), 'aun');
    assert.equal(sinTildes(it.otra).toLowerCase(), 'aun');
    assert.notEqual(it.buena, it.otra);
    assert.ok(it.buena.toLowerCase() === 'aún' ? /todav|^(Son las|Lucía)/i.test(it.antes + it.despues) || it.razon === 'todavia' : it.razon === 'incluso');
    assert.equal(it.antes === '' ? it.buena[0] === it.buena[0].toUpperCase() : it.buena[0] === it.buena[0].toLowerCase(), true, 'mayúscula solo al principio de la frase');
    assert.ok(!/\b(aun|aún)\b/i.test(it.antes + it.despues), 'la otra forma no aparece en la frase');
  }
});

test('matemáticas: las dos opciones difieren solo en una tilde, la mitad con y la mitad sin, y el motor da la buena', () => {
  for (const it of MATES) {
    assert.notEqual(it.escrita, it.mala, it.escrita);
    assert.equal(sinTildes(it.escrita), sinTildes(it.mala), `solo se diferencian en una tilde: ${it.escrita} / ${it.mala}`);
    assert.equal(it.lleva, it.escrita !== it.palabra);
    assert.ok(it.lleva ? it.mala === it.palabra : /[áéíóú]/.test(it.mala), `la mala: ${it.mala}`);
    assert.equal(it.escrita, acentuar(it.silabas, it.tonica));
    assert.ok(!it.antes.includes('_') && !it.despues.includes('_'));
    assert.ok(it.antes.length + it.despues.length > 12, 'una frase de verdad, que fuerce la palabra');
  }
  for (const n of [1, 2, 3]) {
    const items = porNivel(MATES, n);
    const con = items.filter(it => it.lleva).length;
    assert.ok(con / items.length >= 0.4 && con / items.length <= 0.6, `nivel ${n}: ${con} de ${items.length}`);
  }
});

test('generadores: por fuerza bruta, nunca un ítem por encima del nivel del alumno, y el 70 % del suyo', () => {
  for (const { nombre, banco, generar } of ejercicios) {
    for (const nivel of [1, 2, 3]) {
      const sesion = { puntos: [0, 3, 7][nivel - 1], vidas: 5 };
      assert.equal(nivelDe(sesion), nivel);
      const rng = crearRng(135 * 7 + nivel);
      let delSuyo = 0;
      const vistos = new Set();
      for (let k = 0; k < 3000; k++) {
        const item = generar(rng, sesion);
        const it = banco[item.i];
        assert.ok(it, `${nombre}: índice ${item.i}`);
        assert.ok(it.nivel <= nivel, `${nombre}: nivel ${it.nivel} para un alumno de nivel ${nivel}`);
        assert.equal(item.nivel, nivel, 'la etiqueta es el nivel del alumno');
        assert.ok(JSON.stringify(item).length < 80, 'ítem pequeño y serializable');
        if (it.nivel === nivel) delSuyo++;
        vistos.add(item.i);
      }
      assert.ok(delSuyo / 3000 > (nivel === 1 ? 0.99 : 0.65), `${nombre}, nivel ${nivel}: ${delSuyo / 3000}`);
      assert.equal(vistos.size, banco.filter(it => it.nivel <= nivel).length, `${nombre}, nivel ${nivel}: salen todos`);
    }
  }
});

test('generadores: con pocas vidas no suben, y el orden de los botones varía', () => {
  const rng = crearRng(1350);
  for (const { banco, generar } of ejercicios) {
    for (let k = 0; k < 500; k++) assert.equal(banco[generar(rng, { puntos: 9, vidas: 2 }).i].nivel, 1);
  }
  for (const generar of [generarVocales, generarMates]) {
    const ordenes = new Set();
    for (let k = 0; k < 200; k++) ordenes.add(generar(rng, { puntos: 9, vidas: 5 }).orden);
    assert.deepEqual([...ordenes].sort(), [0, 1]);
  }
});

test('explicaciones: llevan la palabra bien escrita en negrita y su regla', () => {
  for (const it of TONICA) {
    assert.ok(explicacionTonica1(it).includes(`<b>${it.palabra}</b>`), it.escrita);
    assert.ok(explicacionTonica1(it).includes(`«${it.silabas[it.tonica]}»`), it.escrita);
    assert.ok(explicacionTonica2(it).includes(`<b>${it.escrita}</b>`), it.escrita);
    assert.ok(explicacionTonica2(it).includes(nombreClase(it.clase)), it.escrita);
  }
  for (const it of TILDE) assert.ok(explicacionTilde(it).includes(`<b>${it.escrita}</b>`), it.escrita);
  for (const it of palabrasDe(VOCALES_BANCO)) assert.ok(explicacionVocales(it).includes(`<b>${it.escrita}</b>`), it.escrita);
  for (const it of MATES) assert.ok(explicacionMates(it).includes(`<b>${it.escrita}</b>`), it.escrita);
  for (const it of VOCALES_BANCO.filter(i => i.tipo === 'aun')) assert.ok(explicacionAun(it).includes(`<b>${it.buena.toLowerCase()}</b>`));
  const textos = [...TILDE.map(explicacionTilde), ...palabrasDe(VOCALES_BANCO).map(explicacionVocales), ...MATES.map(explicacionMates)];
  for (const t of textos) assert.ok(!/undefined|NaN|\[object/.test(t), t);
});

test('explicaciones: la regla aplicada a esa palabra', () => {
  const de = (banco, escrita) => banco.find(it => it.escrita === escrita);
  assert.match(explicacionTilde(de(TILDE, 'lápiz')), /llana y acaba en z, que no es vocal, n ni s: las llanas llevan tilde/);
  assert.match(explicacionTilde(de(TILDE, 'reloj')), /aguda y acaba en j.*No lleva tilde/);
  assert.match(explicacionTilde(de(TILDE, 'camión')), /aguda y acaba en n/);
  assert.match(explicacionTilde(de(TILDE, 'música')), /esdrújulas siempre llevan tilde/);
  assert.match(explicacionTilde(de(TILDE, 'bíceps')), /s detrás de otra consonante/);
  assert.match(explicacionTilde(de(TILDE, 'jersey')), /y, que cuenta como consonante/);
  assert.match(explicacionTilde(de(TILDE, 'dio')), /una sola sílaba/);
  assert.match(explicacionTilde(de(TILDE, 'Ángel')), /mayúsculas también llevan tilde/);
  assert.match(explicacionTilde(de(TILDE, 'fácilmente')), /conservan la tilde del adjetivo, y <b>fácil<\/b> la lleva/);
  assert.match(explicacionTilde(de(TILDE, 'tranquilamente')), /<b>tranquila<\/b> no la lleva.*tampoco/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'día')), /hiato.*siempre lleva tilde/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'ruido')), /diptongo.*no lleva tilde/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'también')), /diptongo.*en la vocal abierta/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'cuídate')), /segunda vocal/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'poeta')), /dos vocales abiertas/);
  assert.match(explicacionVocales(de(VOCALES_BANCO, 'estudiáis')), /triptongo/);
});

test('idError: el patrón de siempre y estable por confusión (no por palabra)', () => {
  const ids = new Set();
  for (const it of TONICA) {
    ids.add(idErrorTonica1(it));
    for (const c of clasesDe(it)) ids.add(idErrorTonica2(c, it));
  }
  for (const it of TILDE) {
    ids.add(idErrorTilde(it, []));
    ids.add(idErrorTilde(it, [it.tonica === 0 ? 1 : 0]));
  }
  for (const it of palabrasDe(VOCALES_BANCO)) {
    ids.add(idErrorVocales(it, []));
    ids.add(idErrorVocales(it, [0]));
  }
  for (const it of VOCALES_BANCO.filter(i => i.tipo === 'aun')) ids.add(idErrorAun(it));
  for (const it of MATES) ids.add(idErrorMates(it));
  for (const id of ids) assert.match(id, PATRON_ID, id);
  assert.ok(ids.size < 60, `pocos ids, por confusión: ${ids.size}`);
  for (const id of ['tonica-mal', 'clase-aguda-por-llana', 'sin-tilde-llana', 'sin-tilde-esdrujula', 'tilde-de-mas-aguda', 'tilde-en-monosilabo', 'sin-tilde-mente', 'sin-tilde-hiato',
    'tilde-en-diptongo', 'aun-por-aun-con-tilde', 'aun-con-tilde-por-aun', 'sin-tilde-mates', 'tilde-de-mas-mates']) assert.ok(ids.has(id), id);
});
