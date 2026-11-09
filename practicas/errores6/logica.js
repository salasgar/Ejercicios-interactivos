// Práctica «Caza el error» de la unidad 6, Algebra (PU2, tarea 154): lógica pura (sin DOM ni red).
//
// Cada plantilla es UN error típico de `ERRORES_TIPICOS` (algebra.js) con sus números. Da una ecuación
// resuelta paso a paso, con la línea 1 (el enunciado) siempre bien. Si hay error, está en una sola
// línea y las de después SIGUEN de ella (el compañero no vuelve a equivocarse). Sin error, todas las
// líneas son equivalentes. Los ítems son DATOS (JSON): las líneas se guardan como texto y se pintan al
// montar, así que la base puede volver a montar el mismo ítem al cambiar de idioma.
//
//   { ec: '3x + 2 = 8' }   una ecuación (se lee con `aEcuacion` y se pinta con raya de fracción)
//   { raw: '3(x − 2) = 12' } texto tal cual (la única línea con paréntesis: el enunciado)
//   { t: {es, en} }        una frase ("No tiene solución")
//
// Ítem: { tipo: 'donde' | 'que' | 'corrige', plantilla, params, lineas, falsa (índice o null), error,
//         [opciones, solucion] (ej. 2), [bien, mal] (ej. 3) }.
//
// Casos de la hoja y del examen: HOJA (claves canónicas en claro) y HUELLAS_EXAMEN (FNV-1a de la forma
// canónica del enunciado, calculada fuera del repositorio). Al escribir esta práctica no existían ni la
// hoja ni el examen de la unidad 6, así que ambas están vacías: la tarea de publicación coteja.

import {
  Ecuacion, termino, lineal, aEcuacion, aLineal, ERRORES_TIPICOS as E, huellaCanonica,
} from '../_comun/algebra.js';
import { Fraccion, fraccion, aTexto as fracATexto } from '../_comun/fracciones.js';

const X = 'x';
const T = (c, l = null) => termino(c, l);
const MENOS = '−';
const num = v => (v < 0 ? `${MENOS}${-v}` : `${v}`);
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const sinCero = (rng, lo, hi) => { let v; do v = rng.entero(lo, hi); while (v === 0); return v; };
const conSigno = (rng, max) => (rng.azar() < 0.5 ? -1 : 1) * rng.entero(1, max);
/** Los términos de una lista, quitando los números que son 0 (no se escribe «+ 0»). */
const sinCeros = ts => ts.filter(t => t.letra !== null || !t.coef.equals(0));

// ─── Casos que no se pueden repetir ───────────────────────────────────────────

/** Claves canónicas (`Ecuacion.clave()`) de los enunciados de las hojas de la unidad 6, en claro. Vacío al escribirla. */
export const HOJA = new Set([]);
/** Huellas (FNV-1a de la forma canónica) de los enunciados de los exámenes de la unidad 6. Vacío al escribirla. */
export const HUELLAS_EXAMEN = new Set([]);
/** ¿Está reservado este enunciado (una Ecuacion)? */
export const reservado = q => HOJA.has(q.clave()) || HUELLAS_EXAMEN.has(huellaCanonica(q));

// ─── Ayudas ────────────────────────────────────────────────────────────────────

const L = (q, extra = {}) => ({ q, ...extra });
const seguir = q => q.pasos().map(p => L(p.ecuacion));
const reducida = q => { const { A, C } = q.forma(); return new Ecuacion([T(A, q.letra)], [T(C)]); };
const clave = s => (s instanceof Fraccion ? `n:${s.simplificar().num}/${s.simplificar().den}` : `s:${s.tipo}`);
const solucionDe = q => q.resolver();
const lin = (l, rhs) => new Ecuacion(sinCeros([T(l.a, X), T(l.b)]), [T(rhs)]);
const textoLinea = l => l.ec ?? l.raw ?? null;

/** Una línea guardada (JSON) a partir de la que construye la plantilla. */
const guardar = l => (l.t ? { t: l.t } : l.raw ? { raw: l.raw } : { ec: l.q.aTexto() });

// ─── Plantillas ────────────────────────────────────────────────────────────────
// id (= error típico), clase, corrige (¿tiene una solución que teclear?), params(rng) → objeto con números
// o null, caso(p) → Ecuacion del enunciado (para la hoja y el examen), cadena(p, mal) → { lineas: [L…], falsa },
// contexto(p) → lo que necesitan las funciones de los otros errores, hint(p, idioma).

export const PLANTILLAS = [];
const nueva = p => { PLANTILLAS.push(p); return p; };

const ECUACION = ['transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'invertir-coeficiente',
  'signo-al-dividir', 'signo-de-la-solucion', 'cero-x-como-x'];
const DENOMINADORES = ['mcm-solo-denominadores', 'olvidar-numerador'];
const PARENTESIS = ['distribuir-solo-primero', 'signo-solo-primero'];
const REDUCIR = ['suma-no-semejantes'];
export const CLASES = { ecuacion: ECUACION, denominadores: DENOMINADORES, parentesis: PARENTESIS, reducir: REDUCIR };
export const CLASE_DE = Object.fromEntries(Object.entries(CLASES).flatMap(([c, ids]) => ids.map(id => [id, c])));

/** Cadena genérica: se sustituye la ÚLTIMA línea de los pasos (el despeje) por la que da el error. */
function cadenaFinal(q0, mal, id) {
  const ps = q0.pasos().map(p => p.ecuacion);
  const buenas = [q0, ...ps];
  if (!mal) return { lineas: buenas.map(q => L(q)), falsa: null };
  const w = E[id].fn(ps.at(-2));
  if (!w) throw new Error('el error no se aplica');
  const lineas = [...buenas.slice(0, -1), w].map(q => L(q));
  return { lineas, falsa: lineas.length - 1 };
}
/** Cadena genérica: la primera línea tras el enunciado (`paso`) se sustituye por la errónea y se sigue de ella. */
function cadenaPrimera(q0, mal, w) {
  if (!mal) return { lineas: [L(q0), ...seguir(q0)], falsa: null };
  return { lineas: [L(q0), L(w), ...seguir(w)], falsa: 1 };
}

// 1 · Transponer sin cambiar el signo (x + 3 = 10 → x = 10 + 3)
nueva({
  id: 'transponer-sin-signo', corrige: true,
  params(rng) {
    const a = rng.entero(1, 6), s = sinCero(rng, -9, 12), b = conSigno(rng, 12);
    if (rng.azar() < 0.5) return { a, b, c: a * s + b, d: 0, dos: false };
    let c = rng.entero(1, 6); if (c === a) c = a + 1;
    return { a, b, c, d: a * s + b - c * s, dos: true };
  },
  caso: p => (p.dos
    ? new Ecuacion([T(p.a, X), T(p.b)], sinCeros([T(p.c, X), T(p.d)]))
    : new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)])),
  cadena(p, mal) {
    const q0 = this.caso(p);
    return cadenaPrimera(q0, mal, mal ? E['transponer-sin-signo'].fn(q0) : null);
  },
  hint: (p, i) => (i === 'en'
    ? 'A term that adds goes to the other side subtracting, and one that subtracts goes adding: it changes sign when it changes side.'
    : 'Un término que suma pasa restando y uno que resta pasa sumando: al cambiar de miembro cambia de signo.'),
});

// 2 · 3x = 12 → x = 12 − 3 (el factor pasa restando)
const paramsProducto = rng => { const a = rng.entero(2, 9), s = sinCero(rng, -9, 12), b = conSigno(rng, 12); return { a, b, c: a * s + b, orden: rng.entero(0, 1) }; };
const casoProducto = p => new Ecuacion(p.orden ? [T(p.b), T(p.a, X)] : [T(p.a, X), T(p.b)], [T(p.c)]);
nueva({
  id: 'pasar-factor-restando', corrige: true, params: paramsProducto, caso: casoProducto,
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `${fracATexto(A)} multiplies x, so it goes to the other side dividing: x = ${fracATexto(C)} : ${fracATexto(A)}.`
      : `${fracATexto(A)} multiplica a la x, así que pasa dividiendo: x = ${fracATexto(C)} : ${fracATexto(A)}.`;
  },
});

// 3 · 3x = 12 → x = 36 (multiplica en vez de dividir)
nueva({
  id: 'multiplicar-en-vez-de-dividir', corrige: true, params: paramsProducto, caso: casoProducto,
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `${fracATexto(A)} multiplies x, so it passes dividing: x = ${fracATexto(C)} : ${fracATexto(A)}, not ${fracATexto(C)} · ${fracATexto(A)}.`
      : `${fracATexto(A)} multiplica a la x, así que pasa dividiendo: x = ${fracATexto(C)} : ${fracATexto(A)}, no ${fracATexto(C)} · ${fracATexto(A)}.`;
  },
});

// 4 · 12x = 3 → x = 4 (divide al revés)
nueva({
  id: 'invertir-coeficiente', corrige: true,
  params(rng) { const a = rng.entero(4, 12), C = sinCero(rng, -3, 6), b = conSigno(rng, 10); return C === a || C === -a ? null : { a, b, c: b + C }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)]),
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `x = ${fracATexto(C)} : ${fracATexto(A)}: the number that multiplies x divides the number on the other side, not the other way round.`
      : `x = ${fracATexto(C)} : ${fracATexto(A)}: el número que multiplica a la x divide al del otro lado, no al revés.`;
  },
});

// 5 · −2x = 8 → x = 4 (pierde el signo del número que pasa dividiendo)
nueva({
  id: 'signo-al-dividir', corrige: true,
  params(rng) { const a = rng.entero(2, 9), s = sinCero(rng, -9, 12); return { a, b: rng.entero(1, 20), c: 0, s, orden: rng.entero(0, 1) }; },
  caso(p) { return new Ecuacion(p.orden ? [T(-p.a, X), T(p.b)] : [T(p.b), T(-p.a, X)], [T(p.b - p.a * p.s)]); },
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `Divide by ${fracATexto(A)} with its sign: x = ${fracATexto(C)} : (${fracATexto(A)}).`
      : `Se divide entre ${fracATexto(A)} con su signo: x = ${fracATexto(C)} : (${fracATexto(A)}).`;
  },
});

// 6 · x + 9 = 4 → x = 5 (pierde el signo de la solución)
nueva({
  id: 'signo-de-la-solucion', corrige: true,
  params(rng) { const a = rng.entero(1, 4), s = rng.entero(-12, -1), b = rng.entero(1, 20); return { a, b, c: a * s + b }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)]),
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const s = this.caso(p).resolver();
    return i === 'en' ? `The sign counts: the result is ${fracATexto(s)}, not ${fracATexto(s.opuesta())}.`
      : `El signo cuenta: el resultado es ${fracATexto(s)}, no ${fracATexto(s.opuesta())}.`;
  },
});

// 7 · x/2 + 1 = x/3 → 3x + 1 = 2x (multiplica solo los términos con denominador)
nueva({
  id: 'mcm-solo-denominadores', corrige: true,
  params(rng) {
    const d1 = rng.elegir([2, 3, 4, 5, 6]), d2 = rng.elegir([2, 3, 4, 5, 6]);
    if (d1 === d2) return null;
    const p = { d1, d2, b: rng.entero(1, 9), c: rng.entero(0, 9) };
    const s = this.caso(p).resolver();
    return s instanceof Fraccion && s.den === 1 && s.num !== 0 && E['mcm-solo-denominadores'].fn(this.caso(p)) ? p : null;
  },
  caso: p => new Ecuacion([T(fraccion(1, p.d1), X), T(p.b)], sinCeros([T(fraccion(1, p.d2), X), T(p.c)])),
  cadena(p, mal) { const q0 = this.caso(p); return cadenaPrimera(q0, mal, mal ? E[this.id].fn(q0) : null); },
  hint(p, i) {
    const m = this.caso(p).mcmDenominadores();
    return i === 'en' ? `Every term is multiplied by ${m}, also the ones without a denominator.`
      : `Se multiplican todos los términos por ${m}, también los que no tienen denominador.`;
  },
});

// 8 · 3x/4 por 12 → 3x (olvida multiplicar por el numerador)
nueva({
  id: 'olvidar-numerador', corrige: true,
  params(rng) {
    const d1 = rng.elegir([4, 5, 6, 7]), a = rng.elegir([2, 3, 4, 5].filter(k => mcd(k, d1) === 1));
    const d2 = rng.elegir([2, 3, 4, 5, 6].filter(d => d !== d1)), dos = rng.azar() < 0.7;
    const s = sinCero(rng, -12, 12);
    // c = s·(a/d1 + 1/d2) debe ser entero
    const bruto = fraccion(a, d1).sumar(dos ? fraccion(1, d2) : fraccion(0, 1)).multiplicar(s).simplificar();
    if (bruto.den !== 1) return null;
    const b = dos ? 0 : conSigno(rng, 9);
    const p = { a, d1, d2: dos ? d2 : 0, b, c: bruto.num + b };
    return E['olvidar-numerador'].fn(this.caso(p)) ? p : null;
  },
  caso: p => new Ecuacion(sinCeros([T(fraccion(p.a, p.d1), X), ...(p.d2 ? [T(fraccion(1, p.d2), X)] : []), T(p.b)]), [T(p.c)]),
  cadena(p, mal) { const q0 = this.caso(p); return cadenaPrimera(q0, mal, mal ? E[this.id].fn(q0) : null); },
  hint(p, i) {
    const m = this.caso(p).mcmDenominadores();
    return i === 'en'
      ? `${p.a}x/${p.d1} times ${m} is ${p.a * m / p.d1}x: ${m} : ${p.d1} = ${m / p.d1}, and then times the numerator ${p.a}.`
      : `${p.a}x/${p.d1} por ${m} es ${p.a * m / p.d1}x: ${m} : ${p.d1} = ${m / p.d1}, y después por el numerador ${p.a}.`;
  },
});

// 9 · 0x = 3 → x = 3 (da un valor cuando la x se ha ido)
nueva({
  id: 'cero-x-como-x', corrige: false,
  params(rng) { const b = sinCero(rng, -12, 12); let c = sinCero(rng, -12, 12); if (c === b) c = b + 1; return { a: rng.entero(2, 6), b, c }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.a, X), T(p.c)]),
  cadena(p, mal) {
    const q0 = this.caso(p), ps = q0.pasos().filter(x => x.tipo === 'transponer' || x.tipo === 'reducir').map(x => x.ecuacion);
    const base = [q0, ...ps].map(q => L(q));
    if (!mal) return { lineas: [...base, L(null, { t: { es: 'No tiene solución', en: 'It has no solution' } })], falsa: null };
    return { lineas: [...base, L(E[this.id].fn(q0))], falsa: base.length };
  },
  hint(p, i) {
    const c = this.caso(p).forma().C;
    return i === 'en' ? `When the x disappears and 0x = ${fracATexto(c)} is left, no number makes it true: it has no solution.`
      : `Si la x desaparece y queda 0x = ${fracATexto(c)}, ningún número lo cumple: no tiene solución.`;
  },
});

// 10 · 3x + 2 + x → 5x (suma el número con las x)
nueva({
  id: 'suma-no-semejantes', corrige: true,
  params(rng) { const a = rng.entero(2, 6), c = rng.entero(1, 4), b = conSigno(rng, 12), s = rng.entero(1, 10); return Math.abs(a + c + b) <= 1 ? null : { a, b, c, e: (a + c) * s + b }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b), T(p.c, X)], [T(p.e)]),
  junta: p => new Ecuacion([T(p.a + p.c, X), T(p.b)], [T(p.e)]),
  cadena(p, mal) {
    const q0 = this.caso(p), bien = this.junta(p);
    if (!mal) return { lineas: [L(q0), L(bien), ...seguir(bien)], falsa: null };
    const w = lin(E[this.id].fn(aLineal(q0.izq)), p.e);
    return { lineas: [L(q0), L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `Only the terms with x are added; ${num(p.b)} has no x, so it stays apart.`
    : `Solo se suman los términos con x; el ${num(p.b)} no tiene x y se queda aparte.`),
});

// 11 · 3(x − 2) → 3x − 2 (multiplica solo el primer término)
const textoParentesis = (k, n, c) => `${k < 0 ? MENOS : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}(x ${n < 0 ? MENOS : '+'} ${Math.abs(n)}) = ${num(c)}`;
nueva({
  id: 'distribuir-solo-primero', corrige: true,
  params(rng) { const k = rng.entero(2, 6), n = conSigno(rng, 9), s = sinCero(rng, -8, 12); return { k, n, c: k * (s + n) }; },
  caso: p => new Ecuacion([T(p.k, X), T(p.k * p.n)], [T(p.c)]),
  raw: p => textoParentesis(p.k, p.n, p.c),
  cadena(p, mal) {
    const q0 = this.caso(p), l1 = L(q0, { raw: this.raw(p) });
    if (!mal) return { lineas: [l1, L(q0), ...seguir(q0)], falsa: null };
    const w = new Ecuacion([T(p.k, X), T(p.n)], [T(p.c)]);
    return { lineas: [l1, L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `${p.k} multiplies every term in the brackets: ${p.k} · ${num(p.n)} = ${num(p.k * p.n)}.`
    : `El ${p.k} multiplica a todos los términos del paréntesis: ${p.k} · ${num(p.n)} = ${num(p.k * p.n)}.`),
});

// 12 · −(x − 2) → −x − 2 (el signo menos solo cambia el primer término)
nueva({
  id: 'signo-solo-primero', corrige: true,
  params(rng) { const k = rng.entero(1, 4), n = conSigno(rng, 9), s = sinCero(rng, -8, 12); return { k, n, c: -k * (s + n) }; },
  caso: p => new Ecuacion([T(-p.k, X), T(-p.k * p.n)], [T(p.c)]),
  raw: p => textoParentesis(-p.k, p.n, p.c),
  cadena(p, mal) {
    const q0 = this.caso(p), l1 = L(q0, { raw: this.raw(p) });
    if (!mal) return { lineas: [l1, L(q0), ...seguir(q0)], falsa: null };
    const w = new Ecuacion([T(-p.k, X), T(p.k * p.n)], [T(p.c)]);
    return { lineas: [l1, L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `The minus sign changes every term in the brackets: ${MENOS}${p.k} · ${num(p.n)} = ${num(-p.k * p.n)}.`
    : `El signo menos cambia todos los términos del paréntesis: ${MENOS}${p.k} · ${num(p.n)} = ${num(-p.k * p.n)}.`),
});

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

// ─── Qué explica cada error ────────────────────────────────────────────────────

/** Lo que cada función de error necesita, calculado con los números del ítem. */
function contexto(plantilla, p) {
  const q = plantilla.caso(p), red = reducida(q);
  const par = plantilla.id === 'distribuir-solo-primero' ? { k: p.k, n: p.n, c: p.c }
    : plantilla.id === 'signo-solo-primero' ? { k: -p.k, n: p.n, c: p.c } : null;
  return { q, red, par, lhs: aLineal(q.izq), rhs: q.forma().C.simplificar() };
}

/** La solución a la que llegaría un compañero que cometiera ESTE error con los números del ítem (o null si no se aplica). */
export function solucionConError(plantilla, id, p) {
  const c = contexto(plantilla, p);
  try {
    let r;
    switch (id) {
      case 'transponer-sin-signo': case 'mcm-solo-denominadores': case 'olvidar-numerador': {
        r = E[id].fn(c.q); return r ? clave(solucionDe(r)) : null;
      }
      case 'pasar-factor-restando': case 'multiplicar-en-vez-de-dividir': case 'invertir-coeficiente':
      case 'signo-al-dividir': case 'signo-de-la-solucion': case 'cero-x-como-x': {
        r = E[id].fn(c.red); return r ? clave(solucionDe(r)) : null;
      }
      case 'suma-no-semejantes': {
        r = E[id].fn(c.lhs); return r ? clave(solucionDe(lin(r, c.q.der.b))) : null;
      }
      case 'distribuir-solo-primero': case 'signo-solo-primero': {
        if (!c.par) return null;
        r = E[id].fn(c.par.k, lineal(1, c.par.n)); return r ? clave(solucionDe(lin(r, c.par.c))) : null;
      }
      default: return null;
    }
  } catch { return null; }
}

/** ¿Llevaría `id` al mismo resultado final que el cálculo malo del ítem? Entonces no puede ser distractor. */
export function explica(plantilla, id, p, malFinal) { return solucionConError(plantilla, id, p) === malFinal; }

/** El error bueno y tres que no se han cometido (los de su clase primero); barajados. */
export function opcionesDeNombre(rng, plantilla, p) {
  const malFinal = clave(solucionDe(ultimaEcuacion(plantilla, p, true)));
  const validos = Object.keys(CLASE_DE).filter(id => id !== plantilla.id && !explica(plantilla, id, p, malFinal));
  const mismos = rng.barajar(validos.filter(id => CLASE_DE[id] === CLASE_DE[plantilla.id]));
  const resto = rng.barajar(validos.filter(id => CLASE_DE[id] !== CLASE_DE[plantilla.id]));
  return rng.barajar([plantilla.id, ...[...mismos.slice(0, 2), ...resto].slice(0, 3)]);
}

function ultimaEcuacion(plantilla, p, mal) {
  const { lineas } = plantilla.cadena(p, mal);
  return lineas.filter(l => l.q).at(-1).q;
}

// ─── Generadores ───────────────────────────────────────────────────────────────

function conParams(plantilla, rng) {
  for (let i = 0; i < 800; i++) {
    const p = plantilla.params(rng);
    if (!p) continue;
    const q = plantilla.caso(p);
    if (reservado(q)) continue;
    try { if (plantilla.cadena(p, true).lineas.some(l => l.q === null && !l.t) || !plantilla.cadena(p, false).lineas) continue; } catch { continue; }
    // el cálculo malo tiene que acabar en otra solución que el bueno
    if (clave(solucionDe(ultimaEcuacion(plantilla, p, true))) === clave(solucionDe(ultimaEcuacion(plantilla, p, false)))
      && plantilla.id !== 'cero-x-como-x') continue;
    return p;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}

const baseItem = (tipo, plantilla, p, mal, extra = {}) => {
  const { lineas, falsa } = plantilla.cadena(p, mal);
  return { tipo, plantilla: plantilla.id, params: p, lineas: lineas.map(guardar), falsa, error: mal ? plantilla.id : null, ...extra };
};

/** Ejercicio 1: ¿dónde está el error? Un tercio de los ítems no tiene ninguno. */
export function generarDonde(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('donde', pl, p, rng.azar() >= 1 / 3);
}

/** Ejercicio 2: ¿qué error es? Siempre hay error; cuatro nombres, uno solo verdadero. */
export function generarQue(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('que', pl, p, true, { opciones: opcionesDeNombre(rng, pl, p), solucion: pl.id });
}

/** Ejercicio 3: corrígelo. Solo las plantillas con una solución que se pueda teclear. */
export function generarCorrige(rng) {
  const pl = rng.elegir(PLANTILLAS.filter(x => x.corrige)), p = conParams(pl, rng);
  return baseItem('corrige', pl, p, true, {});
}

/** La solución buena del ejercicio 3 (Fraccion). */
export const resultadoBueno = item => { const pl = PLANTILLA_POR_ID[item.plantilla]; return solucionDe(pl.caso(item.params)); };
/** La solución a la que llega el cálculo malo (Fraccion o {tipo}). */
export const resultadoMalo = item => { const pl = PLANTILLA_POR_ID[item.plantilla]; return solucionDe(ultimaEcuacion(pl, item.params, true)); };

/**
 * Corrige lo que escribe el alumno (una Fraccion). { acierto, error }: 'repite-el-error' si pone lo mismo que el
 * cálculo malo, 'otro-resultado' en el resto.
 */
export function corregirCorrige(item, escrito) {
  if (escrito.equals(resultadoBueno(item))) return { acierto: true, error: null };
  const mal = resultadoMalo(item);
  return { acierto: false, error: mal instanceof Fraccion && escrito.equals(mal) ? 'repite-el-error' : 'otro-resultado' };
}

/** Las ecuaciones de cada línea del ítem (null en las frases), para el test y para el registro. */
export function ecuacionesDe(item) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  return item.lineas.map((l, i) => (l.t ? null : l.raw ? pl.caso(item.params) : aEcuacion(l.ec)));
}

/** La explicación con los números del ítem (el error de la línea y cómo se hace bien). */
export function porque(item, idioma) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  return pl.hint(item.params, idioma);
}

/** La línea buena que habría ido en el sitio de la mala (en texto). */
export function lineaBuena(item) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  const { lineas } = pl.cadena(item.params, false);
  const l = lineas[item.falsa];
  return l.t ? { t: l.t } : { ec: l.q.aTexto() };
}

export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}|${item.falsa ?? 'x'}`;
export { textoLinea };

// ─── Pintar las líneas ─────────────────────────────────────────────────────────

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => String(s).replace(/[&<>]/g, c => ESCAPE[c]);
/** Una línea como HTML (letra en cursiva, fracciones con raya) o, con `html = false`, como texto plano. */
export function htmlLinea(l, idioma, html = true) {
  if (l.t) return l.t[idioma];
  if (l.raw) return html ? esc(l.raw).replace(/x/g, '<i>x</i>') : l.raw;
  return html ? aEcuacion(l.ec).aHtml() : aEcuacion(l.ec).aTexto();
}
