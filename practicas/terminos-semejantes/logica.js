// LÓGICA PURA de «Términos semejantes» (unidad 6, semana 1, sesión 3): reconocer semejantes, coeficiente y
// parte literal, reducir y cazar el error de una reducción (U6-1C-12, 1C-13, 1C-14, 1C-15, y U6-1C-04 en lo que
// toca a un solo término). Sin DOM. Todo exacto: los coeficientes son enteros o `Fraccion` de `_comun/algebra.js`.
//
// Alcance: SIN x² (ni como pareja «x y x²»: el punto (d) del acta no está), SIN paréntesis, SIN productos de
// letras. Una letra (x o y) o dos (x e y; solo reducir y cazar el error). La y sale en los cuatro ejercicios sin
// que el enunciado la defina (la usan la hoja 1 y la destreza U6-1C-15: «3x + 2y no se reduce»). Coeficientes
// enteros de 1 a 9.
//
// Casos reservados (los de la hoja, los exámenes y los finales no salen nunca): la clave es la TAREA CON SUS
// DATOS, no la expresión reducida: ej. 1, la pareja sin orden; ej. 2, la pregunta y el término (solo
// «coeficiente»; los términos con coeficiente ±1 sin número, x y −x, y los números sueltos NO se reservan: son
// la destreza U6-1C-01 misma, «x es 1x», no un caso); ej. 3, la suma SIN reducir (los términos ordenados); ej. 4,
// esa suma y el resultado mostrado. Las claves de la hoja van en claro; las de examen, por huella FNV-1a.

import {
  termino, reducir, aLineal, Lineal, leerExpresion, huellaCanonica, terminosATexto, terminosAHtml,
  sumarNoSemejantes, ERRORES_TIPICOS, aTerminos, huella,
} from '../_comun/algebra.js';

const MENOS = '−';
const T = (c, l = 'x') => termino(c, l);
const N = c => termino(c, null);

// ─── Errores (con nombre) ──────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'semejantes-por-el-numero': { es: 'Ha mirado solo el número: dos términos son semejantes por su parte literal, no por su número', en: 'Looked only at the number: like terms have the same variable part, not the same number' },
  'semejantes-ignorando-la-letra': { es: 'Ha dado por semejantes dos términos con letras distintas', en: 'Said two terms with different letters are like terms' },
  'no-ve-semejantes': { es: 'Ha dado por distintos dos términos que tienen la misma parte literal', en: 'Said two terms with the same variable part are not like terms' },
  'signo-fuera': { es: 'Ha dejado el signo fuera del coeficiente', en: 'Left the sign out of the coefficient' },
  'x-sin-coeficiente': { es: 'Ha tratado una letra sin número como si valiera 0', en: 'Treated a letter with no number as if it were worth 0' },
  'letra-como-coeficiente': { es: 'Ha dicho la letra en vez del número', en: 'Said the letter instead of the number' },
  'termino-entero': { es: 'Ha dicho el término entero', en: 'Said the whole term' },
  'coeficiente-como-literal': { es: 'Ha dicho el número en vez de la letra', en: 'Said the number instead of the letter' },
  'otra-letra': { es: 'Ha elegido una letra que no está en el término', en: 'Chose a letter that is not in the term' },
  'perder-signo': { es: 'Ha leído un menos como un más: restar no es sumar', en: 'Read a minus as a plus: subtracting is not adding' },
  'otra-expresion': { es: 'Otra expresión', en: 'Another expression' },
};
export const nombreDe = id => (ERRORES_PROPIOS[id] ?? ERRORES_TIPICOS[id])?.nombre ?? ERRORES_PROPIOS[id];
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

/** «Ha sumado…» → «Has sumado…»; «Added…» → «You added…». */
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
export const explicaError = (id, idioma) => segunda[idioma](nombreDe(id)[idioma]);

/** El error con el término del ítem entre paréntesis, si lo hay («−x se ha sumado como +x»). */
export function explicaErrorConTermino(id, idioma, signo = null) {
  const base = explicaError(id, idioma);
  if (!signo) return base;
  const c = html => `<span class="cuenta">${html}</span>`;
  return idioma === 'es'
    ? `${base} (${c(signo.antes)} se ha sumado como ${c(signo.despues)})`
    : `${base} (${c(signo.antes)} was added as ${c(signo.despues)})`;
}

// ─── Casos reservados ──────────────────────────────────────────────────────────────────────────

/** Claves en claro de los casos de la hoja de la semana 1 (se rellenan al final del módulo). */
export const CASOS_HOJA = new Set();
/** Huellas FNV-1a de las claves de los casos de examen (semanas 1-4 y finales): nunca en claro. */
export const HUELLAS_EXAMEN = new Set([
  '102s6nf', '10kll3p', '11bjkbg', '11fwcxu', '11hs9i5', '11tw9p0', '12131m4', '129emax', '13e5hg2', '13ht2me',
  '13k7u91', '157rpel', '15coqwu', '15d3qd', '15gxti8', '16kngx6', '16m8l3t', '17025jy', '17wymgr', '17xeb8h',
  '17yekqi', '1859sxk', '186w0gf', '18gw2m7', '18l3lna', '19c6drv', '19lh85c', '19ovpf8', '19sqcdw', '19uktj9',
  '19x83ml', '1a9cyz6', '1admkbg', '1b28w8t', '1biaglk', '1c29nzi', '1cg6uyq', '1daujwm', '1dgt26r', '1e7btry',
  '1f8we8', '1fljsnh', '1fzxspz', '1gkjye', '1gz8tot', '1h079v5', '1h44b7c', '1hpn9qv', '1i7q9cb', '1i8haus',
  '1ic7ji5', '1je5rcf', '1jnwn6q', '1js0hu7', '1jxhfwa', '1kk53fp', '1klgdx8', '1lombx5', '1m4x0xz', '1m7zn4b',
  '1mqjwhg', '1n1kce9', '1n96rby', '1nin300', '1nwongo', '1o2mady', '1o8uidn', '1ogpoow', '1ouy730', '1p06wz7',
  '1p5igx9', '1p6kbq7', '1p9fkiy', '1phxwj8', '1pisi4j', '1py20pe', '1q0ec2d', '1q5y8m2', '1qdnvd0', '1qiqlz9',
  '1r3gh3u', '1r8ik4n', '1rohawa', '1rrzsey', '1s3snux', '1sw8a2d', '1tk1nly', '1un046k', '1v6l7cx', '1w5q0qi',
  '1xgndal', '1ypz7q7', '1ys2th', '3a3tic', '3e64lo', '3ouz9j', '3u7oy6', '4v60vz', '4y3a03', '57k5zs',
  '6eiaiz', '6s54xr', '7qtqpv', '7vbf99', '7ywct3', '827cj3', '8ia8as', '8lbk2c', '8menci', '8mf9m', '8miqu4',
  '968ycy', '9n10h0', '9orqg4', '9qjtul', '9xdsww', 'aapp7y', 'an28it', 'avxblx', 'ayedjw', 'bjbt05', 'bot6nf',
  'bp1ui8', 'bv3eh4', 'c1ndxt', 'cj1cde', 'cy1eg', 'd9xxuy', 'dekyi4', 'dndfrg', 'e1mvt9', 'e5rx66', 'e9y6y5',
  'eihnmw', 'ex0y5h', 'f1rvvn', 'f8mh', 'fm5eve', 'g2y62', 'gmi6gj', 'h2xurv', 'hdenh4', 'iavnze', 'ilqz23',
  'izvdgy', 'jkzxb9', 'jz9hod', 'k1t30k', 'k5vdfv', 'lau8qe', 'lfx51a', 'm5rsqx', 'mecevg', 'n5dzz0', 'ns30kp',
  'nvzcdc', 'o0dn39', 'qrs6ba', 'saezdh', 'u09318', 'ubpaiv', 'v5i95s', 'vpns0a', 'wd3oqp', 'xb8zbs', 'xm2x80',
  'xyqyia', 'ynfk7m', 'ynk0po', 'yyzy9e', 'z02lki', 'zetml', 'zfmz6i', 'zn95b6', 'zw9pxg',
]);

const textoUno = t => terminosATexto([t]);
const ordenados = ts => [...aTerminos(ts)].sort((p, q) => {
  const lp = p.letra ?? '~', lq = q.letra ?? '~';
  return lp < lq ? -1 : lp > lq ? 1 : p.coef.num - q.coef.num;
});
/** Ej. 1: la pareja sin orden («4x~9x»). */
export const clavePar = (a, b) => `par|${[a, b].sort().join('~')}`;
/** Ej. 2: la pregunta y el término. Los de coeficiente ±1 sin número y los números sueltos no se reservan (null). */
export const claveCoeficiente = t => (t.letra === null || Math.abs(t.coef.num) === 1 ? null : `coeficiente|${textoUno(t)}`);
/** Ej. 3: la suma sin reducir, con los términos ordenados (2x + 7 − 5x − 3 y 7 − 3 + 2x − 5x son lo mismo). */
export const claveSuma = ts => `suma|${terminosATexto(ordenados(ts))}`;
/** Ej. 4: la suma y el resultado mostrado. */
export const claveError = (ts, resultado) => `error|${terminosATexto(ordenados(ts))}|${resultado}`;
export const reservado = clave => clave !== null && (CASOS_HOJA.has(clave) || HUELLAS_EXAMEN.has(huella(clave)));

/** Genera hasta que el ítem no sea un caso reservado (cada ítem trae su `reserva`, que no sale al alumno). */
function sinReservar(generar) {
  for (let i = 0; i < 300; i++) {
    const { reserva, ...item } = generar();
    if (!reservado(reserva)) return item;
  }
  throw new Error('sinReservar: no encuentro un ítem que no sea un caso reservado');
}

// ─── Cosas comunes ─────────────────────────────────────────────────────────────────────────────

const abs = Math.abs;
/** Un coeficiente entero: «−4», «1». */
export const num = c => `${c < 0 ? MENOS : ''}${abs(c)}`;
const cuenta = html => `<span class="cuenta">${html}</span>`;
const coef = (rng, { uno = 0.2 } = {}) => {
  const m = rng.azar() < uno ? 1 : rng.entero(2, 9);
  return rng.azar() < 0.4 ? -m : m;
};

export const textoDeTerminos = ts => terminosATexto(ts);
export const htmlDeTerminos = ts => terminosAHtml(ts);
const textoDe = t => terminosATexto([t]);
const htmlDe = t => terminosAHtml([t]);

// ─── Ejercicio 1 · ¿Semejantes? (U6-1C-12) ─────────────────────────────────────────────────────

/** La letra del ítem: la y sale a menudo, para que no sea ella la que delata la respuesta. */
const letraDe = rng => (rng.azar() < 0.4 ? 'y' : 'x');

function intentoSemejantes(rng) {
  const tipo = rng.elegir(['misma-letra', 'misma-letra', 'dos-numeros', 'letra-y-numero', 'letras-distintas']);
  let a, b, si, error = null;
  const L = letraDe(rng);
  if (tipo === 'misma-letra') {
    const c1 = coef(rng, { uno: 0.25 });
    let c2 = coef(rng, { uno: 0.25 });
    if (c2 === c1) c2 = c1 > 0 ? -c1 : abs(c1) + (abs(c1) < 9 ? 1 : -1);
    [a, b, si] = [T(c1, L), T(c2, L), true];
    error = 'no-ve-semejantes';
  } else if (tipo === 'dos-numeros') {
    const n1 = rng.entero(1, 9) * (rng.azar() < 0.4 ? -1 : 1);
    const n2 = rng.entero(1, 9) * (rng.azar() < 0.4 ? -1 : 1);
    [a, b, si] = [N(n1), N(n2), true];
    error = 'no-ve-semejantes';
  } else if (tipo === 'letra-y-numero') {
    const c1 = coef(rng, { uno: 0.15 });
    const mismo = rng.azar() < 0.5;
    const n = mismo ? abs(c1) : rng.entero(1, 9);
    [a, b, si] = [T(c1, L), N(rng.azar() < 0.3 ? -n : n), false];
    error = (abs(b.coef.num) === abs(c1)) ? 'semejantes-por-el-numero' : 'semejantes-ignorando-la-letra';
    if (rng.azar() < 0.5) [a, b] = [b, a];
  } else {
    const c1 = coef(rng, { uno: 0.15 });
    const mismo = rng.azar() < 0.5;
    const c2 = mismo ? c1 : coef(rng, { uno: 0.15 });
    [a, b, si] = [T(c1, 'x'), T(c2, 'y'), false];
    error = (c1 === c2 || abs(c1) === abs(c2)) ? 'semejantes-por-el-numero' : 'semejantes-ignorando-la-letra';
    if (rng.azar() < 0.5) [a, b] = [b, a];
  }
  if (a.coef.num === b.coef.num && a.letra === b.letra) return null;
  return {
    reserva: clavePar(textoDe(a), textoDe(b)), plantilla: tipo, clave: `${textoDe(a)}|${textoDe(b)}`,
    a: textoDe(a), b: textoDe(b), htmlA: htmlDe(a), htmlB: htmlDe(b),
    correcta: si ? 'si' : 'no', error, solucion: solucionSemejantes(a, b, si),
    letraA: a.letra, letraB: b.letra, sesion: 3,
  };
}

/** Dos términos; la respuesta es 'si' o 'no'. */
export function generarSemejantes(rng) {
  return sinReservar(() => {
    for (;;) { const it = intentoSemejantes(rng); if (it) return it; }
  });
}

/** Qué parte literal tiene cada término, con el término delante (−1 no tiene letra; x tiene la x). */
const quePartes = (t, ct, idioma) => (t.letra === null
  ? (idioma === 'es' ? `${ct} no tiene letra` : `${ct} has no letter`)
  : (idioma === 'es' ? `${ct} tiene la letra <i>${t.letra}</i>` : `${ct} has the letter <i>${t.letra}</i>`));

function solucionSemejantes(a, b, si) {
  const ca = cuenta(htmlDe(a)), cb = cuenta(htmlDe(b));
  if (si && a.letra === null) return { es: `${ca} y ${cb} son semejantes: los dos números, sin letra, son semejantes entre sí.`, en: `${ca} and ${cb} are like terms: two numbers with no letter are like terms.` };
  if (si) return { es: `${ca} y ${cb} son semejantes: los dos llevan la misma parte literal (<i>${a.letra}</i>); lo que cambia es el coeficiente.`, en: `${ca} and ${cb} are like terms: both have the same variable part (<i>${a.letra}</i>); only the coefficient changes.` };
  return {
    es: `${ca} y ${cb} no son semejantes: ${quePartes(a, ca, 'es')} y ${quePartes(b, cb, 'es')}. Se mira la parte literal, no el número.`,
    en: `${ca} and ${cb} are not like terms: ${quePartes(a, ca, 'en')} and ${quePartes(b, cb, 'en')}. Look at the variable part, not at the number.`,
  };
}

// ─── Ejercicio 2 · Coeficiente y parte literal (U6-1C-01, 1C-04) ───────────────────────────────

const opcion = (texto, error, porQue, html = null) => ({ valor: texto, texto, html: html ?? cuenta(texto), correcta: error === null, error, por_que: porQue });
const italica = l => cuenta(`<i>${l}</i>`);

function intentoCoeficiente(rng) {
  const letra = rng.elegir(['x', 'x', 'y']);
  const pregunta = rng.azar() < 0.65 ? 'coeficiente' : 'literal';
  const c = coef(rng, { uno: pregunta === 'coeficiente' ? 0.3 : 0 });
  const t = T(c, letra);
  const tt = textoDe(t);
  const ct = cuenta(htmlDe(t));
  const otra = letra === 'x' ? 'y' : 'x';
  let ops;
  let solucion;
  if (pregunta === 'coeficiente') {
    const signo = c < 0 ? { es: 'menos', en: 'minus' } : { es: 'más', en: 'plus' };
    const buena = opcion(num(c), null, null);
    const dePorLetra = opcion(letra, 'letra-como-coeficiente', { es: `${letra} es la letra, no el número.`, en: `${letra} is the letter, not the number.` }, italica(letra));
    const entero = opcion(tt, 'termino-entero', { es: `${tt} es el término entero; el coeficiente es solo el número.`, en: `${tt} is the whole term; the coefficient is just the number.` }, ct);
    const signoFuera = opcion(num(-c), 'signo-fuera', c < 0
      ? { es: `En ${tt} el signo menos también es del coeficiente.`, en: `In ${tt} the minus sign is part of the coefficient.` }
      : { es: `${tt} no lleva signo menos.`, en: `${tt} has no minus sign.` });
    const cero = opcion('0', 'x-sin-coeficiente', { es: 'Sin número delante, la letra no vale 0: lleva un número escondido.', en: 'With no number in front, the letter is not worth 0: it has a hidden number.' });
    ops = abs(c) === 1 ? [buena, signoFuera, cero, dePorLetra] : c < 0 ? [buena, signoFuera, dePorLetra, entero] : [buena, dePorLetra, entero];
    void signo;
    solucion = abs(c) === 1
      ? { es: `${ct} es ${num(c)}<i>${letra}</i>: el coeficiente es <strong>${num(c)}</strong>.`, en: `${ct} is ${num(c)}<i>${letra}</i>: the coefficient is <strong>${num(c)}</strong>.` }
      : { es: `En ${ct} el número que multiplica a la letra es <strong>${num(c)}</strong>: ese es el coeficiente (con su signo).`, en: `In ${ct} the number that multiplies the letter is <strong>${num(c)}</strong>: that is the coefficient (with its sign).` };
  } else {
    ops = [
      opcion(letra, null, null, italica(letra)),
      opcion(num(c), 'coeficiente-como-literal', { es: `${num(c)} es el coeficiente (el número); la parte literal es la letra.`, en: `${num(c)} is the coefficient (the number); the variable part is the letter.` }),
      opcion(tt, 'termino-entero', { es: `${tt} es el término entero; la parte literal es solo la letra.`, en: `${tt} is the whole term; the variable part is just the letter.` }, ct),
      opcion(otra, 'otra-letra', { es: `En ${tt} no hay ${otra}.`, en: `There is no ${otra} in ${tt}.` }, italica(otra)),
    ];
    solucion = { es: `En ${ct} la letra es <strong><i>${letra}</i></strong>: esa es la parte literal.`, en: `In ${ct} the letter is <strong><i>${letra}</i></strong>: that is the variable part.` };
  }
  return {
    reserva: pregunta === 'coeficiente' ? claveCoeficiente(t) : null,
    plantilla: pregunta, clave: `${pregunta}|${tt}`, pregunta, termino: tt, htmlTermino: htmlDe(t),
    opciones: rng.barajar(ops), solucion, sesion: 3,
  };
}

export const generarCoeficiente = rng => sinReservar(() => intentoCoeficiente(rng));

// ─── Reducir: expresiones sin reducir ──────────────────────────────────────────────────────────

/** Una suma de términos sin reducir, con su letra o letras. Cada plantilla garantiza al menos un grupo reducible. */
function terminosDePlantilla(rng, plantilla) {
  const ts = [];
  switch (plantilla) {
    case 'una-letra': {
      const n = rng.entero(3, 4);
      for (let i = 0; i < n; i++) ts.push(T(coef(rng, { uno: 0.25 })));
      break;
    }
    case 'con-numeros': {
      ts.push(T(coef(rng, { uno: 0.2 })), N(rng.entero(1, 9) * (rng.azar() < 0.4 ? -1 : 1)), T(coef(rng, { uno: 0.2 })));
      if (rng.azar() < 0.7) ts.push(N(rng.entero(1, 9) * (rng.azar() < 0.4 ? -1 : 1)));
      break;
    }
    default: { // dos-letras
      ts.push(T(coef(rng, { uno: 0.15 }), 'x'), T(coef(rng, { uno: 0.15 }), 'y'), T(coef(rng, { uno: 0.15 }), 'x'), T(coef(rng, { uno: 0.25 }), 'y'));
    }
  }
  return rng.barajar(ts);
}

const PLANTILLAS = ['una-letra', 'una-letra', 'con-numeros', 'con-numeros', 'dos-letras'];

/** Que se pueda reducir, que no salga 0, que ningún grupo salga 0 y que sea distinta de lo escrito. */
function valida(ts) {
  const r = reducir(ts);
  if (r.resultado.equals(0)) return false;
  if (r.grupos.some(g => g.total.coef.num === 0 && g.letra !== null)) return false;
  if (!r.grupos.some(g => g.terminos.length >= 2)) return false;
  return !r.grupos.some(g => g.total.coef.num === 0);
}

/**
 * Lo que daría cada error con esta suma de términos: [{ error, valor: Lineal, signo? }].
 * - suma-no-semejantes: 3x + 2 = 5x.
 * - perder-signo: UN término que resta (escrito con «−» entre términos, no el primero) se lee como «+»:
 *   −x se suma como +x. Una entrada por término; `signo` dice cuál (para el feedback con los números del ítem).
 * - x-sin-coeficiente: cualquier subconjunto no vacío de las letras sin número (x, −x) cuenta como 0.
 */
export function candidatosDe(ts) {
  const terms = aTerminos(ts);
  const e = aLineal(terms);
  const lista = [{ error: 'suma-no-semejantes', valor: sumarNoSemejantes(e) }];
  terms.forEach((t, i) => {
    if (i === 0 || t.coef.num >= 0) return;
    const mas = termino(-t.coef.num, t.letra);
    lista.push({
      error: 'perder-signo',
      valor: aLineal(terms.map((u, j) => (j === i ? mas : u))),
      signo: { antes: terminosAHtml([t]), despues: `+${terminosAHtml([mas])}` },
    });
  });
  const unos = terms.map((t, i) => (t.letra !== null && abs(t.coef.num) === 1 ? i : -1)).filter(i => i >= 0);
  for (let m = 1; m < 2 ** unos.length; m++) {
    const cero = new Set(unos.filter((_, k) => m & (1 << k)));
    lista.push({ error: 'x-sin-coeficiente', valor: aLineal(terms.map((t, i) => (cero.has(i) ? termino(0, t.letra) : t))) });
  }
  return lista.map(c => ({ ...c, valor: c.valor && !c.valor.equals(e) ? c.valor : null })).filter(c => c.valor);
}

const gruposTexto = (ts, idioma) => {
  const r = reducir(ts);
  return r.grupos.map(g => {
    const suma = g.terminos.map((t, i) => {
      const c = t.coef.num;
      return i === 0 ? num(c) : `${c < 0 ? MENOS : '+'} ${abs(c)}`;
    }).join(' ');
    const total = g.total.coef.num;
    const nombre = g.letra === null ? (idioma === 'es' ? 'números' : 'numbers') : `<i>${g.letra}</i>`;
    return g.terminos.length === 1 ? null : `${nombre}: ${suma} = ${num(total)}`;
  }).filter(Boolean);
};

/** El paso a paso del feedback: se juntan los semejantes y se suman sus coeficientes. */
export function solucionReducir(ts, idioma) {
  const r = reducir(ts);
  const origen = terminosAHtml(ts);
  const agrupados = terminosAHtml(r.agrupados);
  const res = r.resultado.aHtml();
  const pasos = gruposTexto(ts, idioma).join('; ');
  const yaJuntos = terminosATexto(ts) === terminosATexto(r.agrupados);
  if (yaJuntos) {
    return idioma === 'es'
      ? `${cuenta(origen)}: los semejantes ya están juntos; se suman sus coeficientes (${pasos}). Resultado: ${cuenta(res)}.`
      : `${cuenta(origen)}: the like terms are already together; add their coefficients (${pasos}). Result: ${cuenta(res)}.`;
  }
  return idioma === 'es'
    ? `${cuenta(origen)} = ${cuenta(agrupados)}: se juntan los semejantes y se suman sus coeficientes (${pasos}). Resultado: ${cuenta(res)}.`
    : `${cuenta(origen)} = ${cuenta(agrupados)}: group the like terms and add their coefficients (${pasos}). Result: ${cuenta(res)}.`;
}

// ─── Ejercicio 3 · Reduce (U6-1C-13, 1C-14) ────────────────────────────────────────────────────

export function generarReducir(rng) {
  return sinReservar(() => {
    let ts, plantilla;
    for (let i = 0; i < 200; i++) {
      plantilla = rng.elegir(PLANTILLAS);
      ts = terminosDePlantilla(rng, plantilla);
      if (valida(ts)) break;
    }
    const e = aLineal(ts);
    const dosLetras = e.letras().length > 1;
    return {
      reserva: claveSuma(ts), plantilla, clave: textoDeTerminos(ts), dosLetras, letras: dosLetras ? ['x', 'y'] : ['x'],
      origen: textoDeTerminos(ts), htmlOrigen: htmlDeTerminos(ts),
      correcta: e.aTexto(), errores: erroresDe(ts, e),
      solucion: { es: solucionReducir(ts, 'es'), en: solucionReducir(ts, 'en') }, sesion: 3,
    };
  });
}

/** Los errores con nombre que el alumno puede teclear: un valor por error, distinto de la buena y de los demás. */
function erroresDe(ts, e) {
  const cands = candidatosDe(ts);
  const vistos = [];
  const salida = [];
  for (const c of cands) {
    if (c.valor.equals(e) || vistos.some(v => v.valor.equals(c.valor))) continue;
    if (cands.some(o => o.error !== c.error && o.valor.equals(c.valor))) continue; // lo explicarían dos errores
    vistos.push(c);
    salida.push({ texto: c.valor.aTexto(), error: c.error, ...(c.signo ? { signo: c.signo } : {}) });
  }
  return salida;
}

/** ¿Hay dos términos con la misma letra (o dos números) sin juntar? Entonces aún no está reducida. */
export function sinReducirAun(terminos) {
  const vistos = new Set();
  for (const t of terminos) {
    const k = t.letra ?? '#';
    if (vistos.has(k)) return true;
    vistos.add(k);
  }
  return false;
}

export const MENSAJE_SIN_REDUCIR = {
  es: 'Todavía hay términos semejantes sin juntar.',
  en: 'There are still like terms you have not added together.',
};

/** Corrige lo que teclea el alumno en «Reduce». */
export function corregirReducir(item, texto) {
  const r = leerExpresion(texto, { letras: item.letras, variasLetras: item.dosLetras });
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  if (sinReducirAun(r.terminos)) return { valida: false, mensaje: MENSAJE_SIN_REDUCIR };
  const buena = leerExpresion(item.correcta, { variasLetras: true }).valor;
  if (r.valor.equals(buena)) return { valida: true, acierto: true };
  const e = item.errores.find(x => leerExpresion(x.texto, { variasLetras: true }).valor.equals(r.valor));
  return { valida: true, acierto: false, error: e?.error ?? 'otra-expresion', ...(e?.signo ? { signo: e.signo } : {}) };
}

// ─── Ejercicio 4 · Caza el error (U6-1C-15) ────────────────────────────────────────────────────

export const OPCIONES_ERROR = ['suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente'];

/**
 * Una reducción escrita en una línea: la buena (un tercio) o con un error de los tres. El resultado mal escrito
 * encaja con UN solo error (y con ese, aunque dos términos lo den igual): si lo explicaran dos, se descarta.
 */
export function generarErrores(rng) {
  return sinReservar(() => {
    const quiere = rng.elegir([null, 'suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente']);
    for (let i = 0; i < 400; i++) {
      const plantilla = rng.elegir(PLANTILLAS);
      const ts = terminosDePlantilla(rng, plantilla);
      if (!valida(ts)) continue;
      const e = aLineal(ts);
      let mal = null;
      let signo = null;
      if (quiere !== null) {
        const cands = candidatosDe(ts).filter(x => x.error === quiere);
        if (!cands.length) continue;
        const c = rng.elegir(cands);
        if (candidatosDe(ts).some(x => x.error !== quiere && x.valor.equals(c.valor))) continue;
        mal = c.valor;
        signo = c.signo ?? null;
      }
      const rhs = mal ?? e;
      const origen = textoDeTerminos(ts);
      return {
        reserva: claveError(ts, rhs.aTexto()), plantilla: quiere ?? 'bien', clave: `${origen}|${quiere ?? 'bien'}|${rhs.aTexto()}`,
        origen, htmlOrigen: htmlDeTerminos(ts), resultado: rhs.aTexto(), htmlResultado: rhs.aHtml(),
        error: quiere, correcta: quiere ?? 'ninguno', signo,
        solucion: { es: solucionErrores(ts, rhs, quiere, 'es', signo), en: solucionErrores(ts, rhs, quiere, 'en', signo) }, sesion: 3,
      };
    }
    throw new Error('generarErrores: no encuentro un ítem');
  });
}

function solucionErrores(ts, rhs, error, idioma, signo = null) {
  const buena = aLineal(ts);
  const lo = cuenta(terminosAHtml(ts));
  const bien = cuenta(buena.aHtml());
  const pasos = gruposTexto(ts, idioma).join('; ');
  if (error === null) {
    return idioma === 'es' ? `No hay ningún error: ${lo} = ${bien} (${pasos}).` : `There is no mistake: ${lo} = ${bien} (${pasos}).`;
  }
  const mal = cuenta(rhs.aHtml());
  const porQue = explicaErrorConTermino(error, idioma, signo);
  return idioma === 'es'
    ? `${lo} no es ${mal}. ${porQue}. Bien hecho: ${pasos}; el resultado es ${bien}.`
    : `${lo} is not ${mal}. ${porQue}. Done properly: ${pasos}; the result is ${bien}.`;
}

export const claveItem = item => `${item.plantilla}|${item.clave}`;

// ─── Los casos de la hoja 1 (en claro; `hoja-unidad6-semana1.tex`, ejercicios de «Like terms and simplifying») ───

const leerTerminos = texto => {
  const r = leerExpresion(texto.replaceAll('-', MENOS), { variasLetras: true });
  if (!r.ok) throw new Error(`CASOS_HOJA: no leo «${texto}»`);
  return r.terminos;
};
(function cargarHoja() {
  // Ej. 1a: las parejas de 4x con 9x, 4, −x, 7 y 4y.
  for (const otro of ['9x', '4', '-x', '7', '4y']) CASOS_HOJA.add(clavePar('4x', otro.replaceAll('-', MENOS)));
  // Ej. 1 (términos): el coeficiente de 7x, 2x y −6x (−x no: ±1 sin número no se reserva).
  for (const t of ['7x', '2x', '-6x']) CASOS_HOJA.add(claveCoeficiente(leerTerminos(t)[0]));
  // Sumas de la hoja (ej. 3 y 4): cada una con su resultado bien hecho.
  const sumas = [
    '4x+6x', '9x-2x', '10x-x', 'x-7x', '-3x+8x', '2x+x-4x', '7x-7x', '-x-x',                    // 1b
    '3x+4+2x+1', '6x-2-x+9', '2x+7-5x-3', '4-x+6x-4', '8x+2-3x-5x', '-x+5-2x-8',                // Simplify a-f
    '3x+5+2x', '7x+3', '8+x+1', '4x+3y', 'x+x+x', '5x+4-2x',                                      // lo que no se reduce y Leo
    'x+x+x+6+x+6', 'x+x+3+2x-1',                                                                  // perímetros
  ];
  for (const e of sumas) {
    const ts = leerTerminos(e);
    CASOS_HOJA.add(claveSuma(ts));
    CASOS_HOJA.add(claveError(ts, aLineal(ts).aTexto()));
  }
  // Resultados mal escritos que enseña la hoja: «10x», «5x + 5», «6x + 5», «3x + 7» (A-D de 3x + 5 + 2x), «4x + 5 = 9x»,
  // «2x + 3 = 5x», «6x + 1 = 7x», «8x − x = 8x» y «5x + 4 − 2x = 3x + 4» (ya está arriba).
  const malos = [['3x+5+2x', ['10x', '5x+5', '6x+5', '3x+7']], ['4x+5', ['9x']], ['2x+3', ['5x']], ['6x+1', ['7x']], ['8x-x', ['8x']]];
  for (const [e, rs] of malos) {
    const ts = leerTerminos(e);
    CASOS_HOJA.add(claveSuma(ts));
    for (const r of rs) CASOS_HOJA.add(claveError(ts, aLineal(leerTerminos(r)).aTexto()));
  }
})();
