// LÓGICA PURA de «Paréntesis» de la unidad 6 (semana 3, sesión 10): quitar un paréntesis con un número o un
// signo menos delante, elegir el desarrollo correcto, resolver ecuaciones con paréntesis y cazar el error
// (U6-3C-06, 3C-07, 3C-08, 3C-09 y 3C-10). Sin DOM. Todo exacto: coeficientes enteros y `Fraccion` de
// `_comun/algebra.js`; nunca coma flotante ni `eval`.
//
// Alcance: UNA letra (x); un solo paréntesis por miembro, con dos términos dentro (uno con x y un número);
// sin x², sin corchetes, sin denominadores. El paréntesis puede ir solo (3(x − 2)), con un menos delante
// (−(x − 2)), con un número negativo (−2(3 − x)) o detrás de un término (4 − (5 − 2x), 5x − 2(x − 4)).
//
// Un «caso» es { pre, k, inner }: pre + k(inner), con pre una lista de términos (puede estar vacía) y k un
// entero distinto de 0 (k = 0 en un miembro sin paréntesis, que solo lleva pre).

import {
  termino, sumaDeTerminos, expandirTerminos, terminosATexto, terminosAHtml, lineal, deTexto, leerExpresion, Ecuacion,
  huellaCanonica, ERRORES_TIPICOS, distribuirSoloPrimero, signoSoloPrimero, multiplicarSoloLaX, sumarAntesDelParentesis,
  transponerSinSigno, pasarFactorRestando, signoAlDividir, invertirCoeficiente, multiplicarEnVezDeDividir, aLineal,
} from '../_comun/algebra.js';
import { aFraccion } from '../_comun/fracciones.js';

const MENOS = '−';
const T = (c, l = 'x') => termino(c, l);
const N = c => termino(c, null);
const abs = Math.abs;
const cuenta = html => `<span class="cuenta">${html}</span>`;
const sgn = (rng, p = 0.45) => (rng.azar() < p ? -1 : 1);

// ─── Errores (con nombre) ──────────────────────────────────────────────────────────────────────

/** Errores propios de la práctica; los demás salen de `ERRORES_TIPICOS` de la base. */
export const ERRORES_PROPIOS = {
  'signo-del-segundo': { es: 'Ha multiplicado bien pero se ha equivocado en el signo del segundo término', en: 'Multiplied correctly but got the sign of the second term wrong' },
  'signo-solo-segundo': { es: 'Ha cambiado el signo solo del segundo término del paréntesis', en: 'Changed the sign of the second term in the brackets only' },
  'sin-multiplicar': { es: 'Ha quitado el paréntesis sin multiplicar por el número de delante', en: 'Removed the brackets without multiplying by the number in front' },
  'menos-olvidado': { es: 'Ha quitado el paréntesis sin cambiar ningún signo', en: 'Removed the brackets without changing any sign' },
  'otra-expresion': { es: 'Otra expresión', en: 'Another expression' },
  'otra-solucion': { es: 'Otra solución', en: 'Another solution' },
};
export const nombreDe = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));
/** «Ha sumado…» → «Has sumado…»; «Added…» → «You added…». */
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
export const explicaError = (id, idioma) => segunda[idioma](nombreDe(id)[idioma]);

/** Las familias de «Caza el error»: cada error con nombre pertenece a una. */
export const FAMILIAS = {
  'un-termino': ['distribuir-solo-primero', 'multiplicar-solo-la-x'],
  signo: ['signo-solo-primero', 'signo-del-segundo', 'signo-solo-segundo'],
  'sin-multiplicar': ['sin-multiplicar', 'menos-olvidado'],
};
export const OPCIONES_ERROR = Object.keys(FAMILIAS);
export const familiaDe = id => OPCIONES_ERROR.find(f => FAMILIAS[f].includes(id)) ?? null;

// ─── Casos reservados (la hoja y el examen de la semana 3 no existían al escribirla) ────────────

/** Formas canónicas (`clave()`, en claro) de los casos de la hoja de la semana 3. */
export const CASOS_HOJA = new Set();
/** Huellas FNV-1a (`huellaCanonica`) de los casos de examen de la semana 3: nunca en claro. */
export const HUELLAS_EXAMEN = new Set();
/** ¿Esta expresión (o ecuación) es de la hoja o del examen? Por forma canónica del desarrollo, no del texto. */
export const reservado = x => {
  const clave = x instanceof Ecuacion ? x.clave() : aLineal(x).clave();
  return CASOS_HOJA.has(clave) || HUELLAS_EXAMEN.has(huellaCanonica(x));
};

// ─── Cómo se escribe un caso ───────────────────────────────────────────────────────────────────

const unir = (ts, html) => (html ? terminosAHtml(ts) : terminosATexto(ts));
const parentesis = (k, inner, html) => `${abs(k) === 1 ? '' : abs(k)}(${unir(inner, html)})`;

/** pre + k(inner): `3(x − 2)`, `−(x − 2)`, `4 − (5 − 2x)`, `5x − 2(x − 4)`. */
export function textoDeCaso({ pre, k, inner }, html = false) {
  if (!k) return unir(pre, html);
  const br = parentesis(k, inner, html);
  if (!pre.length) return `${k < 0 ? MENOS : ''}${br}`;
  return `${unir(pre, html)} ${k < 0 ? MENOS : '+'} ${br}`;
}
/** Los términos del caso con el paréntesis quitado, en el orden escrito (sin reducir). */
export const terminosDeCaso = ({ pre, k, inner }) => [...pre, ...(k ? expandirTerminos(k, inner) : [])];
/** El caso, reducido. */
export const valorDeCaso = caso => sumaDeTerminos(terminosDeCaso(caso));
const numT = c => `${c < 0 ? MENOS : ''}${abs(c)}`;

// ─── Errores aplicados a un caso ───────────────────────────────────────────────────────────────

/** Todos los resultados equivocados de un caso, aunque dos den lo mismo: [{ id, valor: Lineal }]. */
export function candidatosBrutos(caso) {
  const { pre, k, inner } = caso;
  const bien = valorDeCaso(caso);
  const con = e => (e === null ? null : sumaDeTerminos([...pre, ...expandirTerminosSuma(e)]));
  // Con un menos delante (k = −1) no se multiplica por ningún número: solo hay error de signo o de olvido.
  const lista = k === -1
    ? [['signo-solo-primero', con(signoSoloPrimero(k, inner))], ['signo-solo-segundo', conSignoSoloSegundo(caso)]]
    : [
      ['distribuir-solo-primero', con(distribuirSoloPrimero(k, inner))],
      ['signo-solo-primero', k < 0 ? con(signoSoloPrimero(k, inner)) : null],
      ['multiplicar-solo-la-x', con(multiplicarSoloLaX(k, inner))],
      ['signo-del-segundo', conSignoDelSegundo(caso)],
    ];
  lista.push([abs(k) === 1 ? 'menos-olvidado' : 'sin-multiplicar', sumaDeTerminos([...pre, ...inner])]);
  if (k > 0 && pre.length === 1 && pre[0].letra === null) {
    lista.push(['sumar-antes-del-parentesis', sumarAntesDelParentesis(pre[0].coef, k, inner)]);
  }
  return lista
    .filter(([, v]) => v !== null)
    .map(([id, v]) => ({ id, valor: aLineal(v) }))
    .filter(c => !c.valor.equals(bien));
}

/** Los resultados equivocados de un caso, sin dos iguales (se queda el primero). */
export function candidatosDe(caso) {
  const vistos = new Set();
  return candidatosBrutos(caso).filter(c => {
    const clave = c.valor.clave();
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
}
const expandirTerminosSuma = e => aLineal(e).terminos();

/** −(x − 2) = x + 2: cambia el signo solo del segundo término (el primero queda como estaba dentro). */
function conSignoSoloSegundo({ pre, inner }) {
  if (inner.length < 2) return null;
  return sumaDeTerminos([...pre, ...inner.map((t, i) => (i === 0 ? t : termino(t.coef.opuesta(), t.letra)))]);
}

function conSignoDelSegundo({ pre, k, inner }) {
  const ex = expandirTerminos(k, inner);
  if (ex.length < 2) return null;
  const mal = ex.map((t, i) => (i === 0 ? t : termino(t.coef.opuesta(), t.letra)));
  return sumaDeTerminos([...pre, ...mal]);
}

// ─── Generar casos ─────────────────────────────────────────────────────────────────────────────

const coefInner = rng => rng.entero(1, 5) * sgn(rng);
const numInner = rng => rng.entero(1, 9) * sgn(rng, 0.5);

/** Los dos términos del paréntesis, en uno u otro orden: (x − 2), (5 − 2x), (−x − 1). */
function dentro(rng) {
  const ts = [T(coefInner(rng)), N(numInner(rng))];
  return rng.azar() < 0.55 ? ts : [ts[1], ts[0]];
}

const PLANTILLAS = ['numero', 'numero', 'negativo', 'menos', 'con-numero', 'con-numero', 'con-x'];

function casoDePlantilla(rng, plantilla) {
  const inner = dentro(rng);
  switch (plantilla) {
    case 'numero': return { pre: [], k: rng.entero(2, 6), inner };
    case 'negativo': return { pre: [], k: -rng.entero(2, 6), inner };
    case 'menos': return { pre: [], k: -1, inner };
    case 'con-numero': return { pre: [N(rng.entero(1, 9) * sgn(rng))], k: rng.elegir([1, 2, 3, 4, 5]) * sgn(rng, 0.5), inner };
    default: return { pre: [T(rng.entero(2, 8) * sgn(rng, 0.3))], k: rng.elegir([1, 2, 3, 4]) * sgn(rng, 0.5), inner };
  }
}

/** Que el resultado conserve la x y que no se reserve; se repite hasta que sirva. */
function casoValido(rng, plantillas = PLANTILLAS, extra = () => true) {
  for (let i = 0; i < 200; i++) {
    const plantilla = rng.elegir(plantillas);
    const caso = casoDePlantilla(rng, plantilla);
    const v = valorDeCaso(caso);
    if (v.a.num === 0 || reservado(v)) continue;
    if (caso.pre.length && caso.k === 1) continue;       // «4 + 1(…)» no existe: sería «4 + (…)»
    if (!extra(caso, v)) continue;
    return { plantilla, caso, valor: v };
  }
  throw new Error('casoValido: sin caso');
}

const kDicho = k => ({
  es: k === -1 ? 'el signo menos' : `el ${numT(k)}`,
  en: k === -1 ? 'the minus sign' : `the ${numT(k)}`,
});

/** La explicación del desarrollo, con los números del ítem (regla 8). */
function solucionDeDesarrollo(caso) {
  const { k, inner, pre } = caso;
  const origen = cuenta(textoDeCaso(caso, true));
  const v = valorDeCaso(caso);
  const final = cuenta(v.aHtml());
  const tex = terminosDeCaso(caso);
  const ex = cuenta(unir(tex, true));
  const productos = cuenta(inner.map(t => `${abs(k) === 1 && k < 0 ? `(${MENOS}1)` : k < 0 ? `(${numT(k)})` : numT(k)} · ${t.coef.num < 0 ? `(${unir([t], true)})` : unir([t], true)}`).join(' + '));
  const dicho = kDicho(k);
  const reduce = pre.length && unir(tex, false) !== v.aTexto();
  const colaEs = reduce ? ` Se juntan los semejantes: ${final}.` : '';
  const colaEn = reduce ? ` Put the like terms together: ${final}.` : '';
  if (k === -1) {
    return {
      es: `En ${origen} ${dicho.es} cambia el signo de <strong>todos</strong> los términos del paréntesis: ${ex}.${colaEs}`,
      en: `In ${origen} ${dicho.en} changes the sign of <strong>every</strong> term in the brackets: ${ex}.${colaEn}`,
    };
  }
  // Con algo delante del paréntesis, la igualdad de los productos lleva solo lo del paréntesis (Revisión 191):
  // «(−2) · 4 + (−2) · 4x = −8 − 8x; con lo de delante, 2x − 8 − 8x».
  const dentro = cuenta(unir(expandirTerminos(k, inner), true));
  const igualdad = pre.length ? { es: `${productos} = ${dentro}; con lo de delante, ${ex}`, en: `${productos} = ${dentro}; with what is in front, ${ex}` } : { es: `${productos} = ${ex}`, en: `${productos} = ${ex}` };
  return {
    es: `En ${origen} ${dicho.es} multiplica a <strong>cada</strong> término del paréntesis: ${igualdad.es}.${colaEs}`,
    en: `In ${origen} ${dicho.en} multiplies <strong>every</strong> term in the brackets: ${igualdad.en}.${colaEn}`,
  };
}

// ─── Ejercicio 1 · Quita el paréntesis (U6-3C-06, 3C-07, 3C-08) ─────────────────────────────────

export function generarQuita(rng) {
  const { plantilla, caso, valor } = casoValido(rng);
  return {
    plantilla, clave: textoDeCaso(caso), origen: textoDeCaso(caso), htmlOrigen: textoDeCaso(caso, true),
    correcta: valor.aTexto(), htmlCorrecta: valor.aHtml(),
    errores: candidatosDe(caso).map(c => ({ error: c.id, texto: c.valor.aTexto() })),
    solucion: solucionDeDesarrollo(caso), sesion: 10,
  };
}

/** Corrige lo que teclea el alumno: sin paréntesis, solo la x, y igual (por forma canónica) al desarrollo. */
export function corregirQuita(item, texto) {
  const r = leerExpresion(texto, { letras: ['x'] });
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  const bien = deTexto(item.correcta);
  if (r.valor.equals(bien)) return { valida: true, acierto: true };
  const e = item.errores.find(x => deTexto(x.texto).equals(r.valor));
  return { valida: true, acierto: false, error: e ? e.error : 'otra-expresion' };
}

// ─── Ejercicio 2 · ¿Cuál es el desarrollo? (U6-3C-06, 3C-07, 3C-08) ────────────────────────────

export function generarDesarrollo(rng) {
  for (let i = 0; i < 200; i++) {
    const { plantilla, caso, valor } = casoValido(rng, PLANTILLAS, (c, v) => candidatosDe(c).length >= 3);
    const malos = rng.barajar(candidatosDe(caso)).slice(0, 3);
    const ops = [{ valor: valor.aTexto(), html: valor.aHtml(), correcta: true, error: null }, ...malos.map(m => ({ valor: m.valor.aTexto(), html: m.valor.aHtml(), correcta: false, error: m.id }))];
    return {
      plantilla, clave: textoDeCaso(caso), origen: textoDeCaso(caso), htmlOrigen: textoDeCaso(caso, true),
      opciones: rng.barajar(ops), solucion: solucionDeDesarrollo(caso), sesion: 10,
    };
  }
  throw new Error('generarDesarrollo');
}

// ─── Ecuaciones con paréntesis ─────────────────────────────────────────────────────────────────

const ladoTerminos = lado => terminosDeCaso(lado);

/** La ecuación escrita sin paréntesis, con los términos en el orden escrito (sin reducir). */
export const ecuacionExpandida = ({ izq, der }) => new Ecuacion(ladoTerminos(izq), ladoTerminos(der));

const textoEcuacion = ({ izq, der }, html) => `${textoDeCaso(izq, html)} = ${textoDeCaso(der, html)}`;

function ecuacionValida(eq) {
  const q = ecuacionExpandida(eq);
  const s = q.resolver();
  if (!s || s.tipo) return null;
  const f = aFraccion(s).simplificar();
  if (abs(f.num) > 40 || f.den > 6) return null;
  return { q, solucion: f };
}

const NIVEL_ALTO = ['dos-lados', 'dos-lados', 'menos-delante'];
const NIVEL_MEDIO = ['solo', 'solo', 'con-numero', 'x-a-la-derecha'];

function ecuacionDePlantilla(rng, plantilla) {
  const inner = dentro(rng);
  switch (plantilla) {
    case 'solo': return { izq: { pre: [], k: rng.entero(2, 6), inner }, der: { pre: [N(rng.entero(1, 40))], k: 0, inner: [] } };
    case 'con-numero': return { izq: { pre: [N(rng.entero(1, 9))], k: rng.elegir([2, 3, 4, 5]) * sgn(rng, 0.3), inner }, der: { pre: [N(rng.entero(1, 30) * sgn(rng, 0.3))], k: 0, inner: [] } };
    case 'x-a-la-derecha': return { izq: { pre: [N(rng.entero(1, 9))], k: -1, inner }, der: { pre: [T(rng.entero(2, 8))], k: 0, inner: [] } };
    case 'menos-delante': return { izq: { pre: [N(rng.entero(1, 9))], k: -1, inner }, der: { pre: [N(rng.entero(1, 30) * sgn(rng, 0.3))], k: rng.elegir([2, 3, 4]) * sgn(rng, 0.5), inner: dentro(rng) } };
    default: return { izq: { pre: [], k: rng.elegir([2, 3, 4, 5]) * sgn(rng, 0.4), inner }, der: { pre: [N(rng.entero(1, 20) * sgn(rng, 0.4))], k: rng.elegir([2, 3, 4]) * sgn(rng, 0.5), inner: dentro(rng) } };
  }
}

function ecuacionAleatoria(rng, nivel) {
  const plantillas = nivel === 'alto' ? NIVEL_ALTO : NIVEL_MEDIO;
  for (let i = 0; i < 400; i++) {
    const plantilla = rng.elegir(plantillas);
    const eq = ecuacionDePlantilla(rng, plantilla);
    const v = ecuacionValida(eq);
    if (!v) continue;
    if (v.solucion.den > 1 && rng.azar() > 0.12) continue;     // casi siempre entera; la fraccionaria es el reto
    if (reservado(v.q)) continue;
    return { plantilla, eq, ...v };
  }
  throw new Error('ecuacionAleatoria');
}

/** Candidatos de solución equivocada: lo mismo de cada paréntesis mal quitado, y los errores de ecuación. */
function solucionesMalas(eq, q) {
  const mapa = new Map();
  const ver = (id, ec) => {
    const s = ec.resolver();
    if (!s || s.tipo) return;
    const f = aFraccion(s).simplificar();
    const clave = `${f.num}/${f.den}`;
    if (!mapa.has(clave)) mapa.set(clave, { error: id, fraccion: f });
  };
  for (const lado of ['izq', 'der']) {
    if (!eq[lado].k) continue;
    for (const c of candidatosDe(eq[lado])) {
      const otro = lado === 'izq' ? 'der' : 'izq';
      const nuevo = lado === 'izq' ? new Ecuacion(c.valor, ladoTerminos(eq[otro])) : new Ecuacion(ladoTerminos(eq[otro]), c.valor);
      ver(c.id, nuevo);
    }
  }
  for (const [id, fn] of [['transponer-sin-signo', transponerSinSigno], ['pasar-factor-restando', pasarFactorRestando], ['signo-al-dividir', signoAlDividir], ['invertir-coeficiente', invertirCoeficiente], ['multiplicar-en-vez-de-dividir', multiplicarEnVezDeDividir]]) {
    const mal = fn(q);
    if (mal) ver(id, mal);
  }
  const buena = aFraccion(q.resolver()).simplificar();
  mapa.delete(`${buena.num}/${buena.den}`);
  return mapa;
}

const fraccionTexto = f => (f.den === 1 ? numT(f.num) : `${numT(f.num)}/${f.den}`);

function solucionDeEcuacion(eq, q, solucion) {
  const origen = cuenta(textoEcuacion(eq, true));
  const expandida = cuenta(q.aHtml());
  const pasos = q.pasos().filter(p => p.tipo !== 'cambiar-miembros').map(p => cuenta(p.ecuacion.aHtml()));
  const cadena = [expandida, ...pasos].filter((x, i, a) => a.indexOf(x) === i).join(' → ');
  return {
    es: `Primero se quitan los paréntesis en ${origen}: ${cadena}. La solución es <strong>${fraccionTexto(solucion)}</strong>.`,
    en: `First remove the brackets in ${origen}: ${cadena}. The solution is <strong>${fraccionTexto(solucion)}</strong>.`,
  };
}

export function generarResuelve(rng) {
  const nivel = rng.azar() < 0.65 ? 'medio' : 'alto';
  const { plantilla, eq, q, solucion } = ecuacionAleatoria(rng, nivel);
  const malas = solucionesMalas(eq, q);
  return {
    plantilla, nivel, clave: textoEcuacion(eq), origen: textoEcuacion(eq), htmlOrigen: textoEcuacion(eq, true),
    solucion: fraccionTexto(solucion), htmlSolucionTexto: fraccionTexto(solucion),
    errores: [...malas.values()].map(m => ({ error: m.error, texto: fraccionTexto(m.fraccion) })),
    explicacion: solucionDeEcuacion(eq, q, solucion), sesion: 10,
  };
}

/** Lo que teclea el alumno: un número («6», «−2», «1/3»), con o sin «x =» delante. */
export function leerSolucion(texto) {
  const t = String(texto ?? '').replace(/^\s*x\s*=\s*/i, '');
  const l = deTexto(t, { letras: ['x'] });
  return l && l.esConstante() ? l.b : null;
}

export function corregirResuelve(item, texto) {
  const v = leerSolucion(texto);
  if (v === null) {
    const r = leerExpresion(String(texto ?? '').replace(/^\s*x\s*=\s*/i, ''), { letras: ['x'] });
    return { valida: false, mensaje: r.ok ? { es: 'Escribe solo el número, por ejemplo x = 6.', en: 'Write just the number, for example x = 6.' } : r.mensaje };
  }
  const bien = leerSolucion(item.solucion);
  if (v.equals(bien)) return { valida: true, acierto: true };
  const e = item.errores.find(x => leerSolucion(x.texto).equals(v));
  return { valida: true, acierto: false, error: e ? e.error : 'otra-solucion' };
}

// ─── Ejercicio 4 · Caza el error (U6-3C-06, 3C-07, 3C-09) ──────────────────────────────────────

export function generarErrores(rng) {
  const ecuacion = rng.azar() < 0.4;
  const hayError = rng.azar() < 0.66;
  for (let i = 0; i < 300; i++) {
    const c = ecuacion
      ? casoValido(rng, ['numero', 'numero', 'negativo', 'menos', 'con-numero'])
      : casoValido(rng);
    const { caso, valor } = c;
    const todos = candidatosBrutos(caso).filter(x => familiaDe(x.id));
    let mostrado = valor, error = null;
    if (hayError) {
      if (!todos.length) continue;
      const e = rng.elegir(todos);
      mostrado = e.valor;
      error = e.id;
      // La familia del error tiene que ser única: ningún otro error con nombre da el mismo resultado.
      const familias = new Set(todos.filter(x => x.valor.equals(mostrado)).map(x => familiaDe(x.id)));
      if (familias.size !== 1) continue;
    }
    let origen, resultado, htmlOrigen, htmlResultado;
    if (ecuacion) {
      const c0 = rng.entero(2, 30) * sgn(rng, 0.3);
      origen = `${textoDeCaso(caso)} = ${numT(c0)}`;
      htmlOrigen = `${textoDeCaso(caso, true)} = ${numT(c0)}`;
      resultado = `${mostrado.aTexto()} = ${numT(c0)}`;
      htmlResultado = `${mostrado.aHtml()} = ${numT(c0)}`;
      if (reservado(new Ecuacion(valor, c0))) continue;
    } else {
      origen = textoDeCaso(caso); htmlOrigen = textoDeCaso(caso, true);
      resultado = mostrado.aTexto(); htmlResultado = mostrado.aHtml();
    }
    return {
      plantilla: ecuacion ? 'ecuacion' : 'expresion', clave: `${origen}|${resultado}`, ecuacion,
      origen, resultado, htmlOrigen, htmlResultado,
      correcta: error === null ? 'ninguno' : familiaDe(error), error,
      solucion: error === null
        ? { es: `Está bien: ${solucionDeDesarrollo(caso).es}`, en: `It is right: ${solucionDeDesarrollo(caso).en}` }
        : solucionDeError(caso, valor, error),
      sesion: 10,
    };
  }
  throw new Error('generarErrores');
}

function solucionDeError(caso, valor, error) {
  const bien = cuenta(valor.aHtml());
  const origen = cuenta(textoDeCaso(caso, true));
  return {
    es: `${explicaError(error, 'es')}. ${origen} bien hecho es ${bien}.`,
    en: `${explicaError(error, 'en')}. ${origen} done right is ${bien}.`,
  };
}

export const claveItem = item => item.clave;
export { lineal };
