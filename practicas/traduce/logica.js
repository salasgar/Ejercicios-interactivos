// Práctica «Del enunciado al álgebra» de la unidad 6 (Algebra): lógica pura (sin DOM ni red).
// Cuatro ejercicios:
//   1. Elige la expresión   una frase («el doble de un número más 3») y cuatro expresiones
//   2. Escríbela            la frase y un campo libre; se lee con `leerExpresion` y se compara por forma canónica
//   3. Elige la frase       una expresión (2x − 3) y cuatro frases, en el idioma del ítem
//   4. Situaciones          una tarifa (parte fija + parte por unidad), su valor y cantidades con letras (edades, precios)
//
// Un ítem es DATOS (texto, no clases): las expresiones van como texto y se leen con `leerExpresion`.
// Los de elegir son { plantilla, clave, …, opciones, solucion, sesion }, con `opciones` ya barajadas:
// { valor, texto?, html, frases?, correcta, error, por_que }. `error` es el id de un error típico
// (de `ERRORES_TIPICOS` de `_comun/algebra.js` o de `ERRORES_TRADUCE`, aquí) y `por_que` {es, en}
// dice qué pasa con los números del ítem.
//
// Reglas de la unidad 6 que fija esta práctica (todas son semana 1, sesión 1; el valor de una
// tarifa, U6-1A-05, es de la sesión 2):
//  - Dos expresiones equivalentes (2x + 3 y 3 + 2x) son la misma respuesta: ninguna opción puede
//    equivaler a otra ni a la correcta (se comprueba por forma canónica, `Lineal.clave()`).
//  - Nada de paréntesis con letras (el doble de la suma… es la sesión 10) ni de reducir (x + x).
//  - Ni sucesiones ni coeficientes decimales: el acta (F0) no está firmada.
//  - Casos de hoja o de examen: `CASOS_HOJA` (en claro) y `HUELLAS_EXAMEN` (FNV-1a de la forma
//    canónica, nunca en claro). Al escribirla no existían la hoja ni el examen de la semana 1.

import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';
import { fraccion } from '../_comun/fracciones.js';
import {
  lineal, Lineal, FRASES, ERRORES_TIPICOS, distractores, huellaCanonica, leerExpresion,
} from '../_comun/algebra.js';

// ─── Errores propios de la práctica (los de `ERRORES_TIPICOS` se usan tal cual) ───────────

export const ERRORES_TRADUCE = {
  'otra-construccion': { nombre: { es: 'Ha elegido la expresión de otra frase', en: 'Chose the expression of a different phrase' } },
  'mas-y-menos-confundidos': { nombre: { es: 'Ha confundido «más» con «menos»', en: 'Mixed up “plus” and “minus”' } },
  'numeros-intercambiados': { nombre: { es: 'Ha intercambiado el número que multiplica con el que se suma', en: 'Swapped the number that multiplies with the number that is added' } },
  'multiplicador-equivocado': { nombre: { es: 'Ha elegido otro multiplicador (el doble, el triple, la mitad)', en: 'Chose a different multiplier (twice, three times, half)' } },
  'menos-como-por': { nombre: { es: 'Ha multiplicado en vez de restar', en: 'Multiplied instead of subtracting' } },
  'multiplicar-como-dividir': { nombre: { es: 'Ha dividido en vez de multiplicar', en: 'Divided instead of multiplying' } },
  'multiplicar-como-restar': { nombre: { es: 'Ha restado en vez de multiplicar', en: 'Subtracted instead of multiplying' } },
  'consecutivos-como-doble': { nombre: { es: 'Ha tomado el doble en vez del siguiente', en: 'Took the double instead of the next number' } },
  'consecutivos-como-pares': { nombre: { es: 'Ha sumado 2 a un número que se pedía consecutivo', en: 'Added 2 for a number that had to be consecutive' } },
  'pares-como-consecutivos': { nombre: { es: 'Ha sumado 1 a un número que se pedía par consecutivo', en: 'Added 1 for a number that had to be the next even number' } },
  'dentro-y-hace-confundidos': { nombre: { es: 'Ha confundido «dentro de» con «hace»', en: 'Mixed up “in … years’ time” and “… years ago”' } },
  'solo-uno': { nombre: { es: 'Ha contado solo la cantidad de uno de los dos', en: 'Counted only one of the two amounts' } },
  'solo-lo-variable': { nombre: { es: 'Ha olvidado la parte fija', en: 'Forgot the fixed part' } },
  'todo-por-la-cantidad': { nombre: { es: 'Ha multiplicado también la parte fija por la cantidad', en: 'Also multiplied the fixed part by the amount' } },
  'fijo-y-variable-al-reves': { nombre: { es: 'Ha puesto la parte fija con la letra y la parte por unidad sola', en: 'Put the letter with the fixed part and left the part per unit on its own' } },
  'multiplica-todo': { nombre: { es: 'Ha multiplicado entre sí la parte fija y la parte por unidad', en: 'Multiplied the fixed part by the part per unit' } },
  'suma-todo': { nombre: { es: 'Ha sumado los tres números en vez de multiplicar', en: 'Added the three numbers instead of multiplying' } },
  'otra-expresion': { nombre: { es: 'Ha escrito otra expresión', en: 'Wrote a different expression' } },
};

export const nombreDe = id => (ERRORES_TIPICOS[id] ?? ERRORES_TRADUCE[id])?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));

/** «Ha sumado…» → «Has sumado…»; «Added…» → «You added…» (para el feedback). */
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
const explicaError = (id, idioma) => segunda[idioma](nombreDe(id)[idioma]);

// ─── Casos reservados (hoja y examen de la semana 1: aún no existían al escribirla) ───────

/** Formas canónicas (`Lineal.clave()`, en claro) de los casos de la hoja de la semana 1. */
export const CASOS_HOJA = new Set();
/** Huellas FNV-1a (`huellaCanonica`) de los casos de examen de la semana 1: nunca en claro. */
export const HUELLAS_EXAMEN = new Set();
export const reservado = expr => CASOS_HOJA.has(expr.clave()) || HUELLAS_EXAMEN.has(huellaCanonica(expr));

function sinReservar(generar) {
  let it;
  for (let i = 0; i < 60; i++) {
    it = generar();
    if (!reservado(it.expr)) break;
  }
  const { expr: _e, ...item } = it;
  return item;
}

// ─── Cosas comunes ────────────────────────────────────────────────────────────────────────

const L0 = 'x';
const num = t => Number(t);
const fr = k => (String(k).includes('/') ? fraccion(num(String(k).split('/')[0]), num(String(k).split('/')[1])) : fraccion(num(k), 1));

/** Cómo se muestra una expresión: «x + 3», «2x − 3», y «3 − x» (no «−x + 3»). */
export const mostrar = (e, { constanteDelante = false } = {}) => {
  const delante = constanteDelante || (e.a.num < 0 && e.b.num > 0);
  return { texto: e.aTexto('es', { constanteDelante: delante }), html: e.aHtml({ constanteDelante: delante }) };
};
const cuenta = (e, o) => `<span class="cuenta">${mostrar(e, o).html}</span>`;
const leer = texto => leerExpresion(texto).valor;

/** Las tres falsas: primero las que salen de errores típicos, luego las de reserva; sin equivalentes entre sí ni con la buena. */
function falsas(rng, correcta, tipicas, reserva) {
  const vistas = new Set([correcta.clave()]);
  const salida = [];
  for (const { valor, error } of [...rng.barajar(tipicas), ...rng.barajar(reserva)]) {
    if (vistas.has(valor.clave())) continue;
    vistas.add(valor.clave());
    salida.push({ valor, error });
    if (salida.length === 3) break;
  }
  return salida;
}

const opcionDeExpresion = (e, error, frase, opts = {}) => {
  const m = mostrar(e, opts);
  return {
    valor: m.texto, texto: m.texto, html: `<span class="cuenta">${m.html}</span>`,
    correcta: error === null, error,
    por_que: error === null ? null : {
      es: `${cuenta(e, opts)}: ${explicaError(error, 'es')}.`,
      en: `${cuenta(e, opts)}: ${explicaError(error, 'en')}.`,
    },
  };
};

// ─── Ejercicio 1 · Elige la expresión (U6-1A-01, 1A-02, 1B-02) ────────────────────────────

/** Las frases de la semana 1: sin parejas (van en el 2), sin paréntesis (sesión 10) y sin reducir (sesión 3). */
export const FRASES_S1 = FRASES.filter(f => f.expresion(2) !== null && !['doble-de-la-suma', 'suma-consecutivos'].includes(f.id));

const PASO_BASE = { 'doble-mas': { base: () => lineal(2, 0, L0), es: 'el doble', en: 'twice', mas: 'más', plus: 'plus' },
  'mitad-menos': { base: () => lineal(fraccion(1, 2), 0, L0), es: 'la mitad', en: 'half of it', mas: 'menos', plus: 'minus' } };

function solucionDeFrase(f, n, expr) {
  const p = PASO_BASE[f.id];
  const pasos = p ? {
    es: ` (${p.es}: ${cuenta(p.base())}; ${p.mas} ${n}: ${cuenta(expr)})`,
    en: ` (${p.en}: ${cuenta(p.base())}; ${p.plus} ${n}: ${cuenta(expr)})`,
  } : { es: '', en: '' };
  return {
    es: `«${f.es(n)}» se escribe ${cuenta(expr)}${pasos.es}.`,
    en: `“${f.en(n)}” is written ${cuenta(expr)}${pasos.en}.`,
  };
}

function candidatosDeFrase(f, n, correcta) {
  const tipicas = distractores(f.errores(n), correcta);
  const reserva = [];
  for (const g of FRASES_S1) {
    if (g.id === f.id) continue;
    const e = g.expresion(n, L0);
    reserva.push({ valor: e, error: 'otra-construccion' });
  }
  return { tipicas, reserva };
}

export function generarElige(rng) {
  return sinReservar(() => {
    const f = rng.elegir(FRASES_S1);
    const n = rng.entero(2, 12);
    const expr = f.expresion(n, L0);
    const { tipicas, reserva } = candidatosDeFrase(f, n, expr);
    const opciones = rng.barajar([
      opcionDeExpresion(expr, null),
      ...falsas(rng, expr, tipicas, reserva).map(({ valor, error }) => opcionDeExpresion(valor, error)),
    ]);
    return {
      expr, plantilla: f.id, clave: `${f.id}|${n}`, instruccion: 'elige',
      frase: { es: f.es(n), en: f.en(n) }, glosa: f.glosa,
      opciones, solucion: solucionDeFrase(f, n, expr), sesion: 1,
    };
  });
}

// ─── Ejercicio 2 · Escríbela (U6-1A-01, 1A-02, 1A-04) ─────────────────────────────────────

/** Dos números relacionados: se da el primero (x) y se pide el otro (U6-1A-04). */
export const PAREJAS_S1 = [
  { id: 'consecutivos', es: 'Dos números son consecutivos y el menor es x. Escribe el mayor.',
    en: 'Two numbers are consecutive (seguidos) and the smaller one is x. Write the bigger one.',
    glosa: 'consecutive (seguidos)', expresion: () => lineal(1, 1, L0),
    errores: () => [[lineal(2, 0, L0), 'consecutivos-como-doble'], [lineal(1, 2, L0), 'consecutivos-como-pares']],
    paso: { es: 'el siguiente de x es x + 1', en: 'the number after x is x + 1' } },
  { id: 'pares-consecutivos', es: 'Dos números pares son consecutivos y el menor es x. Escribe el mayor.',
    en: 'Two even numbers (pares) are consecutive (seguidos) and the smaller one is x. Write the bigger one.',
    glosa: 'consecutive even numbers (pares seguidos)', expresion: () => lineal(1, 2, L0),
    errores: () => [[lineal(1, 1, L0), 'pares-como-consecutivos'], [lineal(2, 0, L0), 'consecutivos-como-doble']],
    paso: { es: 'entre dos pares seguidos hay 2: x + 2', en: 'two even numbers in a row differ by 2: x + 2' } },
  { id: 'numero-y-triple', es: 'Un número es x y otro es su triple. Escribe el otro.',
    en: 'One number is x and another one is three times as big. Write the other one.',
    glosa: 'three times as big (el triple)', expresion: () => lineal(3, 0, L0),
    errores: () => [[lineal(1, 3, L0), 'por-como-mas'], [lineal(fraccion(1, 3), 0, L0), 'multiplicar-como-dividir']],
    paso: { es: 'el triple de x es 3x', en: 'three times x is 3x' } },
];

export function generarEscribe(rng) {
  return sinReservar(() => {
    if (rng.azar() < 0.25) {
      const p = rng.elegir(PAREJAS_S1);
      const expr = p.expresion();
      return {
        expr, plantilla: `pareja-${p.id}`, clave: `pareja|${p.id}`, instruccion: 'escribe',
        frase: { es: p.es, en: p.en }, glosa: p.glosa, correcta: expr.aTexto(),
        errores: p.errores().map(([e, error]) => ({ texto: e.aTexto(), error })),
        solucion: { es: `${cuenta(expr)}: ${p.paso.es}.`, en: `${cuenta(expr)}: ${p.paso.en}.` }, sesion: 1,
      };
    }
    const f = rng.elegir(FRASES_S1);
    const n = rng.entero(2, 12);
    const expr = f.expresion(n, L0);
    const { tipicas, reserva } = candidatosDeFrase(f, n, expr);
    return {
      expr, plantilla: f.id, clave: `${f.id}|${n}`, instruccion: 'escribe',
      frase: { es: f.es(n), en: f.en(n) }, glosa: f.glosa, correcta: expr.aTexto(),
      errores: [...tipicas, ...reserva].map(({ valor, error }) => ({ texto: valor.aTexto(), error })),
      solucion: solucionDeFrase(f, n, expr), sesion: 1,
    };
  });
}

/** Lo teclea el alumno: Lineal con la letra x (cualquier letra vale como «un número»), o { ok: false, mensaje }. */
export function leerEscrito(texto) {
  const r = leerExpresion(texto);
  if (!r.ok) return { ok: false, mensaje: r.mensaje };
  const v = r.valor;
  const normal = v.letras().length === 1 && v.letra !== L0 ? new Lineal({ [L0]: v.a }, v.b, L0) : v;
  return { ok: true, valor: normal };
}

/** { valida, acierto, error } de lo escrito contra el ítem del ejercicio 2. */
export function corregirEscribe(item, texto) {
  const r = leerEscrito(texto);
  if (!r.ok) return { valida: false, mensaje: r.mensaje };
  if (r.valor.equals(leer(item.correcta))) return { valida: true, acierto: true };
  const e = item.errores.find(x => leer(x.texto).equals(r.valor));
  return { valida: true, acierto: false, error: e?.error ?? 'otra-expresion' };
}

// ─── Ejercicio 3 · Elige la frase (U6-1C-03) ──────────────────────────────────────────────

// Una frase es { k, n, op }: k el multiplicador ('1', '2', '3', '1/2', '1/3' o un entero), n el número que se suma o resta,
// op '0' (solo k), '+' (kx + n), '-' (kx − n) o 'n-' (n − kx).
const exprDe = s => (s.op === '0' ? lineal(fr(s.k), 0, L0) : s.op === '+' ? lineal(fr(s.k), s.n, L0)
  : s.op === '-' ? lineal(fr(s.k), -s.n, L0) : lineal(fr(s.k).opuesta(), s.n, L0));
const claveFrase = s => `${s.k}|${s.n}|${s.op}`;

const MULT = {
  es: { 2: 'el doble de un número', 3: 'el triple de un número', '1/2': 'la mitad de un número', '1/3': 'la tercera parte de un número' },
  en: { 2: 'twice a number', 3: 'three times a number', '1/2': 'half of a number', '1/3': 'a third of a number' },
};
const multiplo = (s, idioma) => MULT[idioma][s.k] ?? (idioma === 'es' ? `${numeroAEspanol(num(s.k))} veces un número` : `${numeroAIngles(num(s.k))} times a number`);

/** La frase del ítem, sin ambigüedad: con coma cuando hay dos operaciones («el doble de un número, más tres»). */
export function fraseDe(s, idioma) {
  const N = idioma === 'es' ? numeroAEspanol(s.n) : numeroAIngles(s.n);
  const es = idioma === 'es';
  if (s.k === '1') {
    if (s.op === '+') return es ? `${N} más que un número` : `${N} more than a number`;
    if (s.op === '-') return es ? `${N} menos que un número` : `${N} less than a number`;
    return es ? `${N} menos un número` : `${N} minus a number`;
  }
  const base = multiplo(s, idioma);
  if (s.op === '0') return base;
  if (s.op === 'n-') return es ? `${N} menos ${base}` : `${N} minus ${base}`;
  return es ? `${base}, ${s.op === '+' ? 'más' : 'menos'} ${N}` : `${base}, ${s.op === '+' ? 'plus' : 'minus'} ${N}`;
}

const ENTEROS_K = new Set(['2', '3']);
function candidatosFrase(s) {
  const c = [];
  const k = s.k;
  if (s.op === '+') {
    c.push([{ ...s, op: '-' }, 'mas-y-menos-confundidos'], [{ ...s, op: 'n-' }, 'mas-y-menos-confundidos']);
    if (k === '1') c.push([{ k: String(s.n), n: 0, op: '0' }, 'mas-como-por']);
  } else if (s.op === '-') {
    c.push([{ ...s, op: '+' }, 'mas-y-menos-confundidos'], [{ ...s, op: 'n-' }, 'menos-que-al-reves']);
    if (k === '1') c.push([{ k: String(s.n), n: 0, op: '0' }, 'menos-como-por']);
  } else if (s.op === 'n-') {
    c.push([{ ...s, op: '-' }, 'menos-que-al-reves'], [{ ...s, op: '+' }, 'mas-y-menos-confundidos']);
    if (k === '1') c.push([{ k: String(s.n), n: 0, op: '0' }, 'menos-como-por']);
  } else if (ENTEROS_K.has(k)) {
    c.push([{ k: '1', n: num(k), op: '+' }, 'por-como-mas']);
  } else {
    c.push([{ k: '1', n: num(k.split('/')[1]), op: '-' }, 'entre-como-menos']);
  }
  if (k !== '1' && s.op !== '0' && ENTEROS_K.has(k) && s.n >= 2 && s.n <= 12) c.push([{ k: String(s.n), n: num(k), op: s.op }, 'numeros-intercambiados']);
  if (k !== '1') for (const o of ['2', '3', '1/2']) if (o !== k) c.push([{ ...s, k: o }, 'multiplicador-equivocado']);
  return c;
}

const FORMAS_FRASE = [['1', '+'], ['1', '-'], ['1', 'n-'], ['2', '0'], ['3', '0'], ['1/2', '0'], ['1/3', '0'],
  ['2', '+'], ['2', '-'], ['3', '+'], ['3', '-'], ['1/2', '+'], ['1/2', '-']];

export function generarFrase(rng) {
  return sinReservar(() => {
    const [k, op] = rng.elegir(FORMAS_FRASE);
    const s = { k, n: op === '0' ? 0 : rng.entero(2, 12), op };
    const expr = exprDe(s);
    const vistas = new Set([expr.clave()]);
    const buenas = [];
    for (const [t, error] of rng.barajar(candidatosFrase(s))) {
      const e = exprDe(t);
      if (vistas.has(e.clave())) continue;
      vistas.add(e.clave());
      buenas.push({ t, error });
      if (buenas.length === 3) break;
    }
    const opcion = (t, error) => {
      const e = exprDe(t);
      const frases = { es: fraseDe(t, 'es'), en: fraseDe(t, 'en') };
      return {
        valor: claveFrase(t), frases, correcta: error === null, error,
        por_que: error === null ? null : {
          es: `«${frases.es}» es ${cuenta(e)}: ${explicaError(error, 'es')}.`,
          en: `“${frases.en}” is ${cuenta(e)}: ${explicaError(error, 'en')}.`,
        },
      };
    };
    const frase = { es: fraseDe(s, 'es'), en: fraseDe(s, 'en') };
    return {
      expr, plantilla: 'frase', clave: claveFrase(s), instruccion: 'frase',
      expresion: mostrar(expr).html, texto: mostrar(expr).texto,
      opciones: rng.barajar([opcion(s, null), ...buenas.map(b => opcion(b.t, b.error))]),
      solucion: { es: `${cuenta(expr)} se lee «${frase.es}».`, en: `${cuenta(expr)} is read “${frase.en}”.` }, sesion: 1,
    };
  });
}

// ─── Ejercicio 4 · Situaciones (U6-1A-03, 1A-05) ──────────────────────────────────────────

const dos = (n, idioma) => (idioma === 'es' ? n.toFixed(2).replace('.', ',') : n.toFixed(2));
const eur = n => ({ es: `${dos(n, 'es')} €`, en: `€${dos(n, 'en')}` });

/**
 * Cotas de realismo de cada contexto (regla de Juan Luis del 16-10): lo que puede salir en `f` (parte
 * fija, €), `p` (precio por unidad, €) y `c` (cantidad), y el tope de lo que se paga.
 */
export const COTAS = {
  movil: { f: [5, 15], p: [1, 3], c: [2, 12], tope: 60, letra: 'g' },
  taxi: { f: [3, 5], p: [1, 2], c: [2, 30], tope: 70, letra: 'k' },
  feria: { f: [2, 10], p: [1, 3], c: [2, 10], tope: 40, letra: 'a' },
  bici: { f: [2, 6], p: [2, 4], c: [2, 8], tope: 40, letra: 'h' },
  lapices: { f: [2, 6], p: [1, 2], c: [2, 20], tope: 50, letra: 'n' },
};

const CONTEXTOS = {
  movil: {
    glosa: 'for each (por cada)',
    intro: (f, p) => ({ es: `Un plan de móvil cuesta ${eur(f).es} al mes más ${eur(p).es} por cada gigabyte.`, en: `A mobile plan costs ${eur(f).en} a month plus ${eur(p).en} for each gigabyte.` }),
    pregunta: c => ({ es: `Si usas ${c} gigabytes en un mes, ¿cuántos euros pagas?`, en: `If you use ${c} gigabytes in a month, how many euros do you pay?` }),
  },
  taxi: {
    glosa: 'for each (por cada)',
    intro: (f, p) => ({ es: `Un taxi cobra ${eur(f).es} por empezar el viaje y ${eur(p).es} por cada kilómetro.`, en: `A taxi charges ${eur(f).en} to start the journey and ${eur(p).en} for each kilometre.` }),
    pregunta: c => ({ es: `Si el viaje mide ${c} kilómetros, ¿cuántos euros cuesta?`, en: `If the journey is ${c} kilometres long, how many euros does it cost?` }),
  },
  feria: {
    glosa: 'each (cada), altogether (en total)',
    intro: (f, p) => ({ es: `Entrar a la feria cuesta ${eur(f).es} y cada atracción cuesta ${eur(p).es}.`, en: `Getting into the fair costs ${eur(f).en} and each ride costs ${eur(p).en}.` }),
    pregunta: c => ({ es: `Si te subes a ${c} atracciones, ¿cuántos euros gastas en total?`, en: `If you go on ${c} rides, how many euros do you spend altogether?` }),
  },
  bici: {
    glosa: 'for each (por cada)',
    intro: (f, p) => ({ es: `Alquilar una bicicleta cuesta ${eur(f).es} de reserva más ${eur(p).es} por cada hora.`, en: `Renting a bike costs ${eur(f).en} to book it plus ${eur(p).en} for each hour.` }),
    pregunta: c => ({ es: `Si la alquilas ${c} horas, ¿cuántos euros pagas?`, en: `If you rent it for ${c} hours, how many euros do you pay?` }),
  },
  lapices: {
    glosa: 'each (cada), altogether (en total)',
    intro: (f, p) => ({ es: `Compras una carpeta de ${eur(f).es} y lápices a ${eur(p).es} cada uno.`, en: `You buy a folder for ${eur(f).en} and pencils at ${eur(p).en} each.` }),
    pregunta: c => ({ es: `Si compras ${c} lápices, ¿cuántos euros pagas en total?`, en: `If you buy ${c} pencils, how many euros do you pay altogether?` }),
  },
};

const unaFrase = (a, b) => ({ es: `${a.es} ${b.es}`, en: `${a.en} ${b.en}` });
const opcionNumero = (v, error, cuentaTexto) => ({
  valor: String(v), texto: String(v), html: `<span class="cuenta">${dos(v, 'es')}</span>`, frases: eur(v), numero: v, correcta: error === null, error,
  por_que: error === null ? null : {
    es: `<span class="cuenta">${cuentaTexto('es')}</span>: ${explicaError(error, 'es')}.`,
    en: `<span class="cuenta">${cuentaTexto('en')}</span>: ${explicaError(error, 'en')}.`,
  },
});

function generarTarifaExpresion(rng, id, cot) {
  const f = rng.entero(...cot.f);
  let p = rng.entero(...cot.p);
  if (p === f) p = p === cot.p[0] ? p + 1 : p - 1;
  const L = cot.letra;
  const correcta = new Lineal({ [L]: p }, f, L);
  const ctx = CONTEXTOS[id];
  const reserva = [
    [new Lineal({ [L]: f + p }, 0, L), 'todo-por-la-cantidad'],
    [new Lineal({ [L]: f }, p, L), 'fijo-y-variable-al-reves'],
    [new Lineal({ [L]: f * p }, 0, L), 'multiplica-todo'],
    [new Lineal({ [L]: p }, 0, L), 'solo-lo-variable'],
    [new Lineal({ [L]: p }, -f, L), 'mas-y-menos-confundidos'],
  ].map(([valor, error]) => ({ valor, error }));
  const o = { constanteDelante: true };
  const opciones = rng.barajar([
    opcionDeExpresion(correcta, null, null, o),
    ...falsas(rng, correcta, [], reserva).map(({ valor, error }) => opcionDeExpresion(valor, error, null, o)),
  ]);
  return {
    expr: correcta, plantilla: `tarifa-${id}`, clave: `tarifa|${id}|${f}|${p}`, tipo: 'expresion', instruccion: 'situacion-expresion', glosa: ctx.glosa,
    enunciado: unaFrase(ctx.intro(f, p), { es: '', en: '' }), letra: L,
    pregunta: ctx.pregunta(L), opciones,
    solucion: {
      es: `La parte fija es ${f} y la que depende de ${L} es ${p} por ${L}: ${cuenta(correcta, o)}.`,
      en: `The fixed part is ${f} and the part that depends on ${L} is ${p} times ${L}: ${cuenta(correcta, o)}.`,
    }, sesion: 1,
  };
}

function generarTarifaValor(rng, id, cot) {
  const f = rng.entero(...cot.f), p = rng.entero(...cot.p), c = rng.entero(...cot.c);
  const ctx = CONTEXTOS[id];
  const L = cot.letra;
  const buena = f + p * c;
  const d = (v, i) => dos(v, i);
  const pool = [
    [(f + p) * c, 'jerarquia-al-sustituir', i => `(${d(f, i)} + ${d(p, i)}) · ${c} = ${d((f + p) * c, i)}`],
    [f + num(`${p}${c}`), 'yuxtaponer-al-sustituir', i => `${d(f, i)} + ${p}${c} = ${d(f + num(`${p}${c}`), i)}`],
    [p * c, 'solo-lo-variable', i => `${d(p, i)} · ${c} = ${d(p * c, i)}`],
    [f + p + c, 'suma-todo', i => `${d(f, i)} + ${d(p, i)} + ${c} = ${d(f + p + c, i)}`],
    [p + f * c, 'fijo-y-variable-al-reves', i => `${d(p, i)} + ${d(f, i)} · ${c} = ${d(p + f * c, i)}`],
  ];
  const vistos = new Set([buena]);
  const falsasN = [];
  for (const [v, error, texto] of rng.barajar(pool)) {
    if (vistos.has(v)) continue;
    vistos.add(v);
    falsasN.push(opcionNumero(v, error, texto));
    if (falsasN.length === 3) break;
  }
  const expr = new Lineal({ [L]: p }, f, L);
  return {
    expr, plantilla: `valor-${id}`, clave: `valor|${id}|${f}|${p}|${c}`, tipo: 'valor', instruccion: 'situacion-valor', glosa: ctx.glosa,
    enunciado: unaFrase(ctx.intro(f, p), { es: '', en: '' }), letra: L,
    pregunta: ctx.pregunta(c), opciones: rng.barajar([opcionNumero(buena, null, () => ''), ...falsasN]),
    solucion: ['es', 'en'].reduce((o, i) => ({ ...o, [i]: `<span class="cuenta">${d(f, i)} + ${d(p, i)} · ${c} = ${d(f, i)} + ${d(p * c, i)} = ${d(buena, i)}</span>.` }), {}),
    sesion: 2,
  };
}

// Cantidades con letra (U6-1A-03): edades, precios y cantidades de cosas.
const x = (a, b = 0) => lineal(a, b, L0);
const CANTIDADES = [
  { id: 'hermano', n: [2, 9],
    es: n => `Sara tiene x años y su hermano Andrés tiene ${n} años más que ella. ¿Cuántos años tiene Andrés?`,
    en: n => `Sara is x years old and her brother Andrés is ${n} years older than her. How old is Andrés?`,
    glosa: 'older than (mayor que)', correcta: n => x(1, n), paso: n => `Sara: x; ${n} más: x + ${n}`, paso_en: n => `Sara: x; ${n} more: x + ${n}`,
    falsas: n => [[x(n), 'mas-como-por'], [x(1, -n), 'mas-y-menos-confundidos'], [x(n + 1), 'otra-expresion']] },
  { id: 'dentro', n: [2, 20],
    es: n => `Sara tiene x años. ¿Cuántos años tendrá dentro de ${n} años?`,
    en: n => `Sara is x years old. How old will she be in ${n} years' time?`,
    glosa: "in n years' time (dentro de n años)", correcta: n => x(1, n), paso: n => `dentro de ${n} años se suman ${n}: x + ${n}`, paso_en: n => `in ${n} years you add ${n}: x + ${n}`,
    falsas: n => [[x(n), 'mas-como-por'], [x(1, -n), 'dentro-y-hace-confundidos'], [x(-1, n), 'menos-que-al-reves']] },
  { id: 'hace', n: [2, 10],
    es: n => `Sara tiene x años. ¿Cuántos años tenía hace ${n} años?`,
    en: n => `Sara is x years old. How old was she ${n} years ago?`,
    glosa: 'n years ago (hace n años)', correcta: n => x(1, -n), paso: n => `hace ${n} años se restan ${n}: x − ${n}`, paso_en: n => `${n} years ago you take away ${n}: x − ${n}`,
    falsas: n => [[x(1, n), 'dentro-y-hace-confundidos'], [x(n), 'menos-como-por'], [x(-1, n), 'menos-que-al-reves']] },
  { id: 'cuadernos', n: [2, 9],
    es: n => `Un cuaderno cuesta x euros. ¿Cuántos euros cuestan ${n} cuadernos?`,
    en: n => `A notebook costs x euros. How many euros do ${n} notebooks cost?`,
    glosa: null, correcta: n => x(n), paso: n => `${n} cuadernos de x euros: ${n}x`, paso_en: n => `${n} notebooks at x euros each: ${n}x`,
    falsas: n => [[x(1, n), 'por-como-mas'], [x(fraccion(1, n)), 'multiplicar-como-dividir'], [x(1, -n), 'multiplicar-como-restar']] },
  { id: 'caramelos', n: [2, 4],
    es: n => `Emilio tiene x caramelos y José tiene ${n === 2 ? 'el doble' : n === 3 ? 'el triple' : 'el cuádruple'}. ¿Cuántos caramelos tienen entre los dos?`,
    en: n => `Emilio has x sweets and José has ${n === 2 ? 'twice as many' : n === 3 ? 'three times as many' : 'four times as many'}. How many sweets do they have altogether?`,
    glosa: 'altogether (en total)', correcta: n => x(n + 1), paso: n => `José: ${n}x; entre los dos: x + ${n}x = ${n + 1}x`, paso_en: n => `José: ${n}x; both: x + ${n}x = ${n + 1}x`,
    falsas: n => [[x(n), 'solo-uno'], [x(1, n), 'por-como-mas'], [x(1), 'solo-uno']] },
];

function generarCantidad(rng) {
  const c = rng.elegir(CANTIDADES);
  const n = rng.entero(...c.n);
  const correcta = c.correcta(n);
  const reserva = c.falsas(n).map(([valor, error]) => ({ valor, error }));
  const opciones = rng.barajar([
    opcionDeExpresion(correcta, null),
    ...falsas(rng, correcta, [], reserva).map(({ valor, error }) => opcionDeExpresion(valor, error)),
  ]);
  const pregunta = { es: c.es(n), en: c.en(n) };
  return {
    expr: correcta, plantilla: `cantidad-${c.id}`, clave: `cantidad|${c.id}|${n}`, tipo: 'cantidad', instruccion: 'situacion-cantidad', glosa: c.glosa,
    enunciado: pregunta, pregunta: null, opciones,
    solucion: { es: `${c.paso(n)}: ${cuenta(correcta)}.`, en: `${c.paso_en(n)}: ${cuenta(correcta)}.` }, sesion: 1,
  };
}

export function generarSituacion(rng) {
  return sinReservar(() => {
    const r = rng.azar();
    if (r < 0.3) return generarCantidad(rng);
    const id = rng.elegir(Object.keys(COTAS));
    return r < 0.65 ? generarTarifaExpresion(rng, id, COTAS[id]) : generarTarifaValor(rng, id, COTAS[id]);
  });
}

export const claveItem = item => `${item.plantilla}|${item.clave}`;
