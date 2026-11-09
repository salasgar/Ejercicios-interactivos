// LÓGICA PURA de «Términos semejantes» (unidad 6, semana 1, sesión 3): reconocer semejantes, coeficiente y
// parte literal, reducir y cazar el error de una reducción (U6-1C-12, 1C-13, 1C-14, 1C-15, y U6-1C-04 en lo que
// toca a un solo término). Sin DOM. Todo exacto: los coeficientes son enteros o `Fraccion` de `_comun/algebra.js`.
//
// Alcance: SIN x² (ni como pareja «x y x²»: el punto (d) del acta no está), SIN paréntesis, SIN productos de
// letras. Una letra (x) o dos (x, y; solo reducir y cazar el error). Coeficientes enteros de 1 a 9.

import {
  termino, reducir, aLineal, Lineal, leerExpresion, huellaCanonica, terminosATexto, terminosAHtml,
  sumarNoSemejantes, ERRORES_TIPICOS,
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
  'perder-signo': { es: 'Ha perdido un signo: restar no es sumar', en: 'Lost a sign: subtracting is not adding' },
  'otra-expresion': { es: 'Otra expresión', en: 'Another expression' },
};
export const nombreDe = id => (ERRORES_PROPIOS[id] ?? ERRORES_TIPICOS[id])?.nombre ?? ERRORES_PROPIOS[id];
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

/** «Ha sumado…» → «Has sumado…»; «Added…» → «You added…». */
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
export const explicaError = (id, idioma) => segunda[idioma](nombreDe(id)[idioma]);

// ─── Casos reservados (la hoja y el examen de la semana 1 no existían al escribirla) ───────────

/** Formas canónicas (`Lineal.clave()`, en claro) de los casos de la hoja de la semana 1. */
export const CASOS_HOJA = new Set();
/** Huellas FNV-1a (`huellaCanonica`) de los casos de examen de la semana 1: nunca en claro. */
export const HUELLAS_EXAMEN = new Set();
export const reservado = expr => {
  const e = aLineal(expr);
  return CASOS_HOJA.has(e.clave()) || HUELLAS_EXAMEN.has(huellaCanonica(e));
};

function sinReservar(generar) {
  let it;
  for (let i = 0; i < 60; i++) {
    it = generar();
    if (!it.expr || !reservado(it.expr)) break;
  }
  const { expr: _e, ...item } = it;
  return item;
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

/** Dos términos; la respuesta es 'si' o 'no'. */
export function generarSemejantes(rng) {
  const tipo = rng.elegir(['misma-letra', 'misma-letra', 'dos-numeros', 'letra-y-numero', 'letras-distintas']);
  let a, b, si, error = null, expr = null;
  if (tipo === 'misma-letra') {
    const c1 = coef(rng, { uno: 0.25 });
    let c2 = coef(rng, { uno: 0.25 });
    if (c2 === c1) c2 = c1 > 0 ? -c1 : abs(c1) + (abs(c1) < 9 ? 1 : -1);
    [a, b, si] = [T(c1), T(c2), true];
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
    [a, b, si] = [T(c1), N(rng.azar() < 0.3 ? -n : n), false];
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
  if (a.coef.num === b.coef.num && a.letra === b.letra) return generarSemejantes(rng);
  return {
    expr, plantilla: tipo, clave: `${textoDe(a)}|${textoDe(b)}`,
    a: textoDe(a), b: textoDe(b), htmlA: htmlDe(a), htmlB: htmlDe(b),
    correcta: si ? 'si' : 'no', error, solucion: solucionSemejantes(a, b, si),
    letraA: a.letra, letraB: b.letra, sesion: 3,
  };
}

const literal = t => (t.letra === null ? { es: 'sin letra', en: 'no letter' } : { es: `la parte literal es ${t.letra}`, en: `the variable part is ${t.letra}` });

function solucionSemejantes(a, b, si) {
  const ca = cuenta(htmlDe(a)), cb = cuenta(htmlDe(b));
  if (si && a.letra === null) return { es: `${ca} y ${cb} son semejantes: los dos números, sin letra, son semejantes entre sí.`, en: `${ca} and ${cb} are like terms: two numbers with no letter are like terms.` };
  if (si) return { es: `${ca} y ${cb} son semejantes: los dos llevan la misma parte literal (<i>${a.letra}</i>); lo que cambia es el coeficiente.`, en: `${ca} and ${cb} are like terms: both have the same variable part (<i>${a.letra}</i>); only the coefficient changes.` };
  const dice = (t, i) => literal(t)[i];
  return {
    es: `${ca} y ${cb} no son semejantes: en ${ca} ${dice(a, 'es')} y en ${cb} ${dice(b, 'es')}. Se mira la parte literal, no el número.`,
    en: `${ca} and ${cb} are not like terms: in ${ca} ${dice(a, 'en')} and in ${cb} ${dice(b, 'en')}. Look at the variable part, not at the number.`,
  };
}

// ─── Ejercicio 2 · Coeficiente y parte literal (U6-1C-01, 1C-04) ───────────────────────────────

const opcion = (texto, error, porQue, html = null) => ({ valor: texto, texto, html: html ?? cuenta(texto), correcta: error === null, error, por_que: porQue });
const italica = l => cuenta(`<i>${l}</i>`);

export function generarCoeficiente(rng) {
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
    const cero = opcion('0', 'x-sin-coeficiente', { es: `${tt} es ${num(c)}${letra}: el coeficiente es ${num(c)}, no 0.`, en: `${tt} is ${num(c)}${letra}: the coefficient is ${num(c)}, not 0.` });
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
    plantilla: pregunta, clave: `${pregunta}|${tt}`, pregunta, termino: tt, htmlTermino: htmlDe(t),
    opciones: rng.barajar(ops), solucion, sesion: 3,
  };
}

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

/** Lo que daría cada error con esta suma de términos: { error, valor: Lineal | null }. */
export function candidatosDe(ts) {
  const e = aLineal(ts);
  const { grupos } = reducir(ts);
  const sumaPerdiendoSigno = grupos.reduce((acc, g) => {
    const primero = g.terminos[0].coef.num < 0 ? -1 : 1;
    const s = primero * g.terminos.reduce((t, x) => t + abs(x.coef.num), 0);
    if (g.letra === null) acc.b = s; else acc.coefs[g.letra] = s;
    return acc;
  }, { coefs: {}, b: 0 });
  const perder = new Lineal(sumaPerdiendoSigno.coefs, sumaPerdiendoSigno.b, e.letra);
  const sinUno = ts.some(t => t.letra !== null && abs(t.coef.num) === 1)
    ? aLineal(ts.map(t => (t.letra !== null && abs(t.coef.num) === 1 ? termino(0, t.letra) : t)))
    : null;
  const lista = [
    { error: 'suma-no-semejantes', valor: sumarNoSemejantes(e) },
    { error: 'perder-signo', valor: perder },
    { error: 'x-sin-coeficiente', valor: sinUno },
  ];
  return lista.map(c => ({ ...c, valor: c.valor && !c.valor.equals(e) ? c.valor : null }));
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
    const errores = candidatosDe(ts).filter(c => c.valor).map(c => ({ texto: c.valor.aTexto(), error: c.error }));
    return {
      expr: e, plantilla, clave: textoDeTerminos(ts), dosLetras, letras: dosLetras ? ['x', 'y'] : ['x'],
      origen: textoDeTerminos(ts), htmlOrigen: htmlDeTerminos(ts),
      correcta: e.aTexto(), errores,
      solucion: { es: solucionReducir(ts, 'es'), en: solucionReducir(ts, 'en') }, sesion: 3,
    };
  });
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
  return { valida: true, acierto: false, error: e?.error ?? 'otra-expresion' };
}

// ─── Ejercicio 4 · Caza el error (U6-1C-15) ────────────────────────────────────────────────────

export const OPCIONES_ERROR = ['suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente'];

/** Una reducción escrita en una línea: la buena (un tercio) o con un error de los tres. */
export function generarErrores(rng) {
  return sinReservar(() => {
    const quiere = rng.elegir([null, 'suma-no-semejantes', 'perder-signo', 'x-sin-coeficiente']);
    for (let i = 0; i < 400; i++) {
      const plantilla = rng.elegir(PLANTILLAS);
      const ts = terminosDePlantilla(rng, plantilla);
      if (!valida(ts)) continue;
      const e = aLineal(ts);
      const cands = candidatosDe(ts);
      let mal = null;
      if (quiere !== null) {
        const c = cands.find(x => x.error === quiere);
        if (!c || !c.valor) continue;
        // El resultado mal escrito encaja con UN solo error y no es la respuesta buena.
        if (cands.filter(x => x.valor && x.valor.equals(c.valor)).length !== 1) continue;
        if (c.valor.equals(e)) continue;
        mal = c.valor;
      }
      const rhs = mal ?? e;
      const origen = textoDeTerminos(ts);
      return {
        expr: e, plantilla: quiere ?? 'bien', clave: `${origen}|${quiere ?? 'bien'}`,
        origen, htmlOrigen: htmlDeTerminos(ts), resultado: rhs.aTexto(), htmlResultado: rhs.aHtml(),
        error: quiere, correcta: quiere ?? 'ninguno',
        solucion: { es: solucionErrores(ts, rhs, quiere, 'es'), en: solucionErrores(ts, rhs, quiere, 'en') }, sesion: 3,
      };
    }
    throw new Error('generarErrores: no encuentro un ítem');
  });
}

function solucionErrores(ts, rhs, error, idioma) {
  const buena = aLineal(ts);
  const lo = cuenta(terminosAHtml(ts));
  const bien = cuenta(buena.aHtml());
  const pasos = gruposTexto(ts, idioma).join('; ');
  if (error === null) {
    return idioma === 'es' ? `No hay ningún error: ${lo} = ${bien} (${pasos}).` : `There is no mistake: ${lo} = ${bien} (${pasos}).`;
  }
  const mal = cuenta(rhs.aHtml());
  return idioma === 'es'
    ? `${lo} no es ${mal}: ${explicaError(error, 'es')}. Bien hecho: ${pasos}; el resultado es ${bien}.`
    : `${lo} is not ${mal}: ${explicaError(error, 'en')}. Done properly: ${pasos}; the result is ${bien}.`;
}

export const claveItem = item => `${item.plantilla}|${item.clave}`;
