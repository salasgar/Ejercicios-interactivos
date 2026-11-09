// LÓGICA PURA de «Quita denominadores» de la unidad 6 (semana 3, sesión 11): el m.c.m. de los denominadores,
// multiplicar los dos miembros por él, resolver y hacerlo paso a paso (U6-3C-11 y U6-3C-12). Sin DOM. Todo exacto:
// coeficientes `Fraccion` de `_comun/fracciones.js`; nunca coma flotante ni `eval`.
//
// Alcance (el acta de la unidad 6 no existía al escribirla: se queda en lo que dicen las destrezas 3C-11 y 3C-12):
// UNA letra (x); hasta tres términos con x y denominador natural (x/2, 3x/4), con o sin un número suelto en el
// primer miembro; el segundo miembro es un número. Sin x en el denominador, sin paréntesis, sin x² y sin x en
// los dos miembros (eso es 3C-13, que el inventario deja como propuesta). Cotas: denominadores de 2 a 12 con
// m.c.m. ≤ 36, numeradores de 1 a 5, números sueltos de 1 a 9, solución entera de −30 a 60, segundo miembro
// entero, distinto de 0 y de valor absoluto ≤ 150.

import {
  termino, Ecuacion, huellaCanonica, leerEcuacion, leerExpresion, deTexto, terminosATexto, terminosAHtml,
  mcmSoloDenominadores, olvidarNumerador, transponerSinSigno, pasarFactorRestando, signoAlDividir,
  invertirCoeficiente, multiplicarEnVezDeDividir, signoDeLaSolucion, ERRORES_TIPICOS,
} from '../_comun/algebra.js';
import { Fraccion, leerFraccion } from '../_comun/fracciones.js';
import { mcm, mcd } from '../_comun/aritmetica.js';

const MENOS = '−';
const abs = Math.abs;
const cuenta = html => `<span class="cuenta">${html}</span>`;
const numT = c => `${c < 0 ? MENOS : ''}${abs(c)}`;
const T = (n, d, letra = 'x') => termino(new Fraccion(n, d), letra);
const N = c => termino(new Fraccion(c, 1), null);
const por = (t, k) => termino(t.coef.multiplicar(k).simplificar(), t.letra);

// ─── Errores (con nombre) ──────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'producto-de-denominadores': { es: 'Ha multiplicado por el producto de los denominadores, que no es el menor número que sirve', en: 'Multiplied by the product of the denominators, which is not the smallest number that works' },
  'mayor-denominador': { es: 'Ha elegido el mayor de los denominadores, que no sirve para todos', en: 'Chose the biggest denominator, which does not work for all of them' },
  'suma-de-denominadores': { es: 'Ha sumado los denominadores', en: 'Added the denominators' },
  'mcd-en-vez-de-mcm': { es: 'Ha calculado el m.c.d. en vez del m.c.m.', en: 'Worked out the GCD instead of the LCM' },
  'multiplo-no-menor': { es: 'Ha elegido un múltiplo común que no es el menor', en: 'Chose a common multiple that is not the smallest' },
  'cada-por-su-denominador': { es: 'Ha multiplicado cada término por su propio denominador', en: 'Multiplied each term by its own denominator' },
  'un-solo-miembro': { es: 'Ha multiplicado por el m.c.m. solo un miembro de la ecuación', en: 'Multiplied only one side of the equation by the LCM' },
  'signo-perdido-al-multiplicar': { es: 'Ha cambiado un signo al multiplicar por el m.c.m.', en: 'Changed a sign when multiplying by the LCM' },
  'con-denominadores': { es: 'Ha dejado denominadores en la ecuación', en: 'Left denominators in the equation' },
  'otro-mcm': { es: 'Ha escrito otro número que no es el m.c.m.', en: 'Wrote another number that is not the LCM' },
  'otra-ecuacion': { es: 'Ha escrito una ecuación que no es equivalente a la de partida', en: 'Wrote an equation that is not equivalent to the one we started with' },
  'otra-solucion': { es: 'Otra solución', en: 'Another solution' },
};
export const nombreDe = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
export const explicaError = (id, idioma) => segunda[idioma](nombreDe(id)[idioma]);
const SIN_EXPLICAR = new Set(['otra-solucion']);
export const explicaSiHace = (id, idioma) => (id && !SIN_EXPLICAR.has(id) ? `${explicaError(id, idioma).replace(/\.$/, '')}. ` : '');

// ─── Casos reservados (la hoja y el examen de la semana 3 no existían al escribirla) ────────────

/** Formas canónicas (`clave()`, en claro) de los casos de la hoja de la semana 3. */
export const CASOS_HOJA = new Set();
/** Huellas FNV-1a (`huellaCanonica`) de los casos de examen de la semana 3: nunca en claro. */
export const HUELLAS_EXAMEN = new Set();
export const reservado = q => CASOS_HOJA.has(q.clave()) || HUELLAS_EXAMEN.has(huellaCanonica(q));

// ─── Generar la ecuación ───────────────────────────────────────────────────────────────────────

const DEN = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const PLANTILLAS = ['uno', 'uno', 'uno-numero', 'uno-numero', 'dos', 'dos', 'dos', 'dos-numero', 'dos-numero', 'tres'];
const NUM_DE = { uno: 1, 'uno-numero': 1, dos: 2, 'dos-numero': 2, tres: 3 };

const numeradorPara = (rng, d) => {
  for (;;) {
    const n = rng.azar() < 0.5 ? 1 : rng.entero(1, 5);
    if (mcd(n, d) === 1) return n;
  }
};

function denominadoresPara(rng, k) {
  for (let i = 0; i < 200; i++) {
    const ds = [];
    while (ds.length < k) {
      const d = rng.elegir(DEN);
      if (!ds.includes(d)) ds.push(d);
    }
    if (mcm(...ds) <= 36) return ds;
  }
  throw new Error('denominadoresPara');
}

/** Construye la ecuación: términos con x (signo, n, d), un número suelto c (0 si no hay) y el segundo miembro r. */
function construir(rng, plantilla) {
  const k = NUM_DE[plantilla];
  const ds = denominadoresPara(rng, k);
  const partes = ds.map((d, i) => ({ n: numeradorPara(rng, d), d, sg: i > 0 && rng.azar() < 0.3 ? -1 : 1 }));
  const conNumero = plantilla.endsWith('numero');
  const c = conNumero ? rng.entero(1, 9) * (rng.azar() < 0.5 ? -1 : 1) : 0;
  const L = mcm(...ds);
  const NN = partes.reduce((s, p) => s + p.sg * p.n * (L / p.d), 0);     // A = NN / L
  if (NN === 0) return null;
  const xs = [];
  for (let x0 = -30; x0 <= 60; x0++) if (x0 !== 0 && (NN * x0) % L === 0) xs.push(x0);
  const positivos = xs.filter(x => x > 0);
  const x0 = rng.elegir(rng.azar() < 0.82 && positivos.length ? positivos : xs);
  const r = (NN * x0) / L + c;
  if (r === 0 || abs(r) > 150) return null;
  const ts = partes.map(p => T(p.sg * p.n, p.d));
  const izq = c === 0 ? ts : rng.azar() < 0.2 ? [N(c), ...ts] : [...ts, N(c)];
  return { plantilla, q: new Ecuacion(izq, [N(r)]), x0 };
}

function casoValido(rng, extra = () => true) {
  for (let i = 0; i < 400; i++) {
    const caso = construir(rng, rng.elegir(PLANTILLAS));
    if (!caso || reservado(caso.q) || !extra(caso)) continue;
    return caso;
  }
  throw new Error('casoValido');
}

export const denominadoresDe = q => [...new Set([...q.terminosIzq, ...q.terminosDer].map(t => t.coef.simplificar().den).filter(d => d > 1))].sort((a, b) => a - b);
const lista = (xs, idioma) => (xs.length === 1 ? `${xs[0]}` : `${xs.slice(0, -1).join(', ')} ${idioma === 'es' ? 'y' : 'and'} ${xs[xs.length - 1]}`);

// ─── Candidatos equivocados ────────────────────────────────────────────────────────────────────

const claveSol = q => {
  const s = q.resolver();
  return s instanceof Fraccion ? `n:${s.num}/${s.den}` : `s:${s.tipo}`;
};

/** Los pasos «multiplicar por el m.c.m.» mal hechos: [{ id, ecuacion }] sin dos con la misma solución ni la buena. */
export function candidatosCerrados(q) {
  const m = q.mcmDenominadores();
  const buena = q.sinDenominadores(m);
  const conDen = t => t.coef.simplificar().den;
  const signoPerdido = buena.terminosIzq.length >= 2
    ? new Ecuacion(buena.terminosIzq.map((t, i) => (i === 1 ? termino(t.coef.opuesta(), t.letra) : t)), buena.terminosDer)
    : null;
  const crudos = [
    ['mcm-solo-denominadores', mcmSoloDenominadores(q, m)],
    ['olvidar-numerador', olvidarNumerador(q, m)],
    ['cada-por-su-denominador', new Ecuacion(q.terminosIzq.map(t => por(t, conDen(t))), q.terminosDer.map(t => por(t, conDen(t))))],
    ['un-solo-miembro', new Ecuacion(q.terminosIzq.map(t => por(t, m)), q.terminosDer)],
    ['signo-perdido-al-multiplicar', signoPerdido],
  ];
  const vistos = new Set([claveSol(buena)]);
  const salida = [];
  for (const [id, ecuacion] of crudos) {
    if (!ecuacion || !(ecuacion.resolver() instanceof Fraccion)) continue;
    const clave = claveSol(ecuacion);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push({ id, ecuacion });
  }
  return salida;
}

/** Los números equivocados en lugar del m.c.m.: [{ id, valor }] distintos entre sí y del bueno. */
export function candidatosMcm(dens) {
  const m = mcm(...dens);
  const crudos = [
    ['producto-de-denominadores', dens.reduce((a, b) => a * b, 1)],
    ['mayor-denominador', Math.max(...dens)],
    ['suma-de-denominadores', dens.reduce((a, b) => a + b, 0)],
    ['mcd-en-vez-de-mcm', mcd(...dens)],
    ['multiplo-no-menor', 2 * m],
  ];
  const vistos = new Set([m, 1]);
  const salida = [];
  for (const [id, valor] of crudos) {
    if (vistos.has(valor)) continue;
    vistos.add(valor);
    salida.push({ id, valor });
  }
  return salida;
}

// ─── Explicación con los números del ítem ──────────────────────────────────────────────────────

/** «3 + 2 = 5»: cada término del primer miembro con la solución puesta. */
function comprobacion(q, x0) {
  const valores = q.terminosIzq.map(t => termino(t.letra ? t.coef.multiplicar(x0).simplificar() : t.coef, null));
  return cuenta(`${terminosAHtml(valores)} = ${terminosAHtml(q.terminosDer)}`);
}

function explicacionCompleta(q, x0) {
  const dens = denominadoresDe(q);
  const m = q.mcmDenominadores();
  const pasos = q.pasos();
  const cadena = [q.sinDenominadores(m), ...pasos.filter(p => p.tipo !== 'denominadores' && p.tipo !== 'cambiar-miembros').map(p => p.ecuacion)]
    .map(e => cuenta(e.aHtml())).filter((x, i, a) => a.indexOf(x) === i).join(' → ');
  const origen = cuenta(q.aHtml());
  const ver = comprobacion(q, new Fraccion(x0, 1));
  return {
    es: `En ${origen} ${dens.length === 1 ? 'el denominador es' : 'los denominadores son'} ${lista(dens, 'es')}: el m.c.m. es <strong>${m}</strong>. Se multiplican <strong>todos</strong> los términos por ${m}: ${cadena}. Comprobación: ${ver} ✓`,
    en: `In ${origen} ${dens.length === 1 ? 'the denominator is' : 'the denominators are'} ${lista(dens, 'en')}: the LCM is <strong>${m}</strong>. Multiply <strong>every</strong> term by ${m}: ${cadena}. Check: ${ver} ✓`,
  };
}

// ─── Ejercicio 1 · ¿Por cuánto multiplico? (U6-3C-11, 3C-12) ───────────────────────────────────

export function generarMcm(rng) {
  const { plantilla, q } = casoValido(rng, c => NUM_DE[c.plantilla] >= 2 && candidatosMcm(denominadoresDe(c.q)).length >= 3);
  const dens = denominadoresDe(q);
  const m = q.mcmDenominadores();
  const malos = rng.barajar(candidatosMcm(dens)).slice(0, 3);
  const ops = [{ valor: String(m), correcta: true, error: null }, ...malos.map(c => ({ valor: String(c.valor), correcta: false, error: c.id }))];
  return {
    plantilla, clave: q.aTexto(), origen: q.aTexto(), htmlOrigen: q.aHtml(), dens, mcm: m,
    opciones: rng.barajar(ops),
    solucion: {
      es: `Los denominadores son ${lista(dens, 'es')}. El m.c.m. de ${lista(dens, 'es')} es <strong>${m}</strong>: es el menor número que es múltiplo de todos ellos, y por ${m} desaparecen todos los denominadores.`,
      en: `The denominators are ${lista(dens, 'en')}. The LCM of ${lista(dens, 'en')} is <strong>${m}</strong>: it is the smallest number that is a multiple of all of them, and multiplying by ${m} clears every denominator.`,
    },
    sesion: 11,
  };
}

// ─── Ejercicio 2 · Sin denominadores (U6-3C-11, 3C-12) ─────────────────────────────────────────

export function generarSin(rng) {
  const { plantilla, q } = casoValido(rng, c => candidatosCerrados(c.q).length >= 3);
  const m = q.mcmDenominadores();
  const buena = q.sinDenominadores(m);
  const malos = rng.barajar(candidatosCerrados(q)).slice(0, 3);
  const ops = [{ valor: buena.aTexto(), html: buena.aHtml(), correcta: true, error: null },
    ...malos.map(c => ({ valor: c.ecuacion.aTexto(), html: c.ecuacion.aHtml(), correcta: false, error: c.id }))];
  return {
    plantilla, clave: q.aTexto(), origen: q.aTexto(), htmlOrigen: q.aHtml(), mcm: m,
    opciones: rng.barajar(ops),
    solucion: {
      es: `El m.c.m. de ${lista(denominadoresDe(q), 'es')} es ${m}. Se multiplican <strong>los dos miembros, término a término</strong>, por ${m}: ${cuenta(q.aHtml())} → ${cuenta(buena.aHtml())}.`,
      en: `The LCM of ${lista(denominadoresDe(q), 'en')} is ${m}. Multiply <strong>both sides, term by term</strong>, by ${m}: ${cuenta(q.aHtml())} → ${cuenta(buena.aHtml())}.`,
    },
    sesion: 11,
  };
}

// ─── Ejercicio 3 · Resuélvela (U6-3C-11, 3C-12) ────────────────────────────────────────────────

const fraccionTexto = f => (f.den === 1 ? numT(f.num) : `${numT(f.num)}/${f.den}`);

/** Soluciones equivocadas con su error: de cada paso de multiplicar mal y de resolver mal la ecuación ya sin denominadores. */
function solucionesMalas(q) {
  const buena = q.sinDenominadores();
  const solBuena = claveSol(buena);
  const mapa = new Map();
  const ver = (id, ec) => {
    if (!ec) return;
    const s = ec.resolver();
    if (!(s instanceof Fraccion)) return;
    const f = s.simplificar();
    const clave = fraccionTexto(f);
    if (!mapa.has(clave) && claveSol(ec) !== solBuena) mapa.set(clave, { error: id, texto: clave });
  };
  for (const c of candidatosCerrados(q)) ver(c.id, c.ecuacion);
  for (const [id, fn] of [['transponer-sin-signo', transponerSinSigno], ['pasar-factor-restando', pasarFactorRestando], ['signo-al-dividir', signoAlDividir], ['invertir-coeficiente', invertirCoeficiente], ['multiplicar-en-vez-de-dividir', multiplicarEnVezDeDividir]]) ver(id, fn(buena));
  const s = buena.resolver();
  const f = s.simplificar();
  const signo = signoDeLaSolucion(buena);
  if (signo) { const clave = fraccionTexto(signo.resolver().simplificar()); if (!mapa.has(clave) && clave !== fraccionTexto(f)) mapa.set(clave, { error: 'signo-de-la-solucion', texto: clave }); }
  mapa.delete(fraccionTexto(f));
  return [...mapa.values()];
}

export function generarResuelve(rng) {
  const { plantilla, q, x0 } = casoValido(rng);
  return {
    plantilla, clave: q.aTexto(), origen: q.aTexto(), htmlOrigen: q.aHtml(),
    solucion: numT(x0), errores: solucionesMalas(q), explicacion: explicacionCompleta(q, x0), sesion: 11,
  };
}

/** Lo que teclea el alumno: un número («6», «−2», «1/3»), con o sin «x =» delante. */
export function leerSolucion(texto) {
  const t = String(texto ?? '').replace(/^\s*x\s*=\s*/i, '');
  const f = leerFraccion(t);
  return f ? f.simplificar() : null;
}

const MENSAJE_SOLO_NUMERO = { es: 'Escribe solo el número, por ejemplo x = 6.', en: 'Write just the number, for example x = 6.' };
const solucionLeida = texto => {
  const v = leerSolucion(texto);
  if (v !== null) return { ok: true, valor: v };
  const r = leerExpresion(String(texto ?? '').replace(/^\s*x\s*=\s*/i, ''), { letras: ['x'] });
  return { ok: false, mensaje: r.ok ? MENSAJE_SOLO_NUMERO : r.mensaje };
};

export function corregirResuelve(item, texto) {
  const r = solucionLeida(texto);
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  if (r.valor.equals(leerSolucion(item.solucion))) return { valida: true, acierto: true };
  const e = item.errores.find(x => leerSolucion(x.texto).equals(r.valor));
  return { valida: true, acierto: false, error: e ? e.error : 'otra-solucion' };
}

// ─── Ejercicio 4 · Paso a paso (U6-3C-11, 3C-12) ───────────────────────────────────────────────

export function generarPasos(rng) {
  const { plantilla, q, x0 } = casoValido(rng);
  const dens = denominadoresDe(q);
  return {
    plantilla, clave: q.aTexto(), origen: q.aTexto(), htmlOrigen: q.aHtml(), dens, mcm: q.mcmDenominadores(),
    cerrada: q.sinDenominadores().aTexto(),
    solucion: numT(x0),
    explicacion: explicacionCompleta(q, x0), sesion: 11,
  };
}

const MENSAJE_NUMERO = { es: 'Escribe un número, por ejemplo 12.', en: 'Write a number, for example 12.' };

function corregirMcm(item, texto) {
  const f = leerFraccion(texto);
  if (!f || f.den !== 1 || f.num < 1) return { valida: false, mensaje: MENSAJE_NUMERO };
  if (f.num === item.mcm) return { valida: true, acierto: true };
  const c = candidatosMcm(item.dens).find(x => x.valor === f.num);
  return { valida: true, acierto: false, error: c ? c.id : 'otro-mcm' };
}

function corregirCerrada(item, texto) {
  const r = leerEcuacion(texto, { letras: ['x'] });
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  const q = r.valor;
  if ([...q.terminosIzq, ...q.terminosDer].some(t => t.coef.simplificar().den !== 1)) return { valida: true, acierto: false, error: 'con-denominadores' };
  const original = leerEcuacion(item.origen).valor;
  if (q.equivalente(original)) return { valida: true, acierto: true };
  const c = candidatosCerrados(original).find(x => x.ecuacion.equivalente(q));
  return { valida: true, acierto: false, error: c ? c.id : 'otra-ecuacion' };
}

function corregirSolucionFinal(item, texto) {
  const r = solucionLeida(texto);
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  return r.valor.equals(leerSolucion(item.solucion)) ? { valida: true, acierto: true } : { valida: true, acierto: false, error: 'otra-solucion' };
}

export const PASOS = [corregirMcm, corregirCerrada, corregirSolucionFinal];

/** Corrige los tres huecos: devuelve los tres resultados y el acierto global (el error es el del primer hueco que falla). */
export function corregirPasos(item, textos) {
  const rs = PASOS.map((fn, i) => fn(item, textos[i] ?? ''));
  const valida = rs.every(r => r.valida);
  const fallo = rs.find(r => r.valida && !r.acierto);
  return { valida, pasos: rs, acierto: valida && !fallo, error: fallo?.error };
}

export const claveItem = item => item.clave;
export { deTexto, terminosATexto };
