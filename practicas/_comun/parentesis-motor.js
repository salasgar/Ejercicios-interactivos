// Motor de «Coloca los paréntesis» para cualquier conjunto de números (PU2, tarea 199):
// el de `practicas/parentesis/logica.js` (U1) con la aritmética inyectada. Puro: sin DOM
// ni red. Lo usan `coloca-enteros` (U3), `coloca-fracciones` (U4) y `coloca-decimales`
// (U5); la U1 sigue con su propio `logica.js`, y `tests/practicas-parentesis-motor.test.js`
// comprueba que con `ARITMETICA_NATURALES` este motor da lo mismo que aquel.
//
// ─── Expresiones y árboles (como en la U1) ────────────────────────────────────────
//
//   Una EXPRESIÓN es { numeros: [a, b, c…], operaciones: ['+', '*', '-', '/'], exponente: null | 2 | 3 }.
//   Los números son valores de la aritmética (enteros, Fraccion, Decimal); las operaciones,
//   en ASCII (`*` es el producto, `/` la división). El exponente va al final y se aplica a
//   lo que tiene delante: al último número o al grupo que se cierra ahí.
//   Un ÁRBOL es { v } (un número), { op, l, r } o { pot, x }.
//
// ─── Secuencias: cómo se escribe un árbol y cómo se resuelve ──────────────────────
//
//   Una lista plana, a nivel de un mismo paréntesis: { v }, { g: secuencia }, { pot, base }
//   (base { v } o { g }) y las operaciones como texto. Los pasos de `evaluar` son secuencias,
//   NO texto: la U4 escribe fracciones con raya y eso no sale de un `replace`. Se pintan con
//   `htmlSecuencia` / `htmlPasos`, que delegan cada número en `aritmetica.html`; `claveSecuencia`
//   da un texto plano (con ASCII, como el `textoSecuencia` de la U1) para claves y huellas.
//
// ─── La aritmética ────────────────────────────────────────────────────────────────
//
//   { nombre,
//     operar(a, op, b) → { valor } | { razon },     razones: 'negativo', 'inexacta', 'cero', 'grande'
//     potencia(base, e) → { valor } | { razon },
//     clave(v) → texto,                              mismo texto ⇔ mismo valor (3/4 y 6/8; 0,5 y 0,50)
//     comparar(a, b) → < 0, 0, > 0,
//     html(v, { idioma, detras, base, compacta }) → HTML del número:
//         detras: va justo detrás de una operación (un negativo, entre paréntesis: 5 · (−2));
//         base: es la base de una potencia (negativa o fracción, entre paréntesis: (−2)², (2/3)²);
//         compacta: en un chip (la raya, más pequeña) }
//   Todo lo que la U1 hace con números (Set, sort, ===, data-v) aquí pasa por `clave` y
//   `comparar`: un Set de objetos no deduplica, y dos chips del mismo valor serían dos
//   respuestas correctas (regla de oro).
//
//   ARITMETICA_NATURALES             la de la U1, exacta (tope 10 000; sin negativos ni inexactas)
//   aritmeticaEnteros({ tope })       la resta siempre se puede; inexacta, cero, grande (|v| > tope)
//   aritmeticaFracciones({ topeNum, topeDen })   Fraccion irreducible; cero y grande (por el irreducible)
//   aritmeticaDecimales({ cifras, tope, negativos })   Decimal (entero escalado, nunca coma flotante);
//                                      inexacta (no termina o pasa de `cifras` cifras), cero, negativo, grande
//
// ─── El motor ─────────────────────────────────────────────────────────────────────
//
//   const M = crearMotor(aritmetica) →
//     arboles(e), secuencia(arbol), evaluar(arbol) → { valor, pasos } | { invalido: { paso, razon, a, op, b }, pasos },
//     resultados(e) (valores distintos por clave, ordenados), analizar(e), sinParentesis(e),
//     interpretar(e, parentesis), colocacion(arbol, n), alcanzable(arbol, n), arbolQueDa(e, valor),
//     pistaPara(e, actual, faltan) (faltan: Set de CLAVES), textoColocacion(e, p), htmlColocacion(e, p, idioma),
//     htmlSecuencia(sec, idioma, opciones), htmlArbol(arbol, idioma), htmlPasos(pasos, idioma),
//     cadenaPasos(pasos, idioma) ('a = b = c'), htmlOperacion(a, op, b, idioma), htmlValor(v, idioma, opciones),
//     claveSecuencia(sec), claveExpresion(e), mismoValor(a, b), expresionDe(item), itemDe(tipo, e, extra),
//     buscar(rng, hacer, vale, reserva, { anterior, intentos }), estadisticas ({ llamadas, caidas }).

import { fmt } from './enteros.js';
import { Fraccion, aFraccion, comparar as compararFracciones, htmlFraccion, aTexto as textoFraccion } from './fracciones.js';
import {
  Decimal, decimal, sumar as sumarD, restar as restarD, multiplicar as multiplicarD, dividir as dividirD,
  comparar as compararD, aTexto as textoDecimal,
} from './decimales.js';

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 };
const SIGNOS = { '+': '+', '-': '−', '*': '·' };

/** El signo de una operación tal como se ve: «·», «−», «:» (o «÷» en inglés). */
export function signo(op, idioma = 'es') {
  if (op === '/') return idioma === 'en' ? '÷' : ':';
  return SIGNOS[op] ?? op;
}

// ─── Aritméticas ───────────────────────────────────────────────────────────────────

/** La de la U1: números naturales, sin restas negativas ni divisiones inexactas, hasta 10 000. */
export const ARITMETICA_NATURALES = Object.freeze({
  nombre: 'naturales',
  tope: 10000,
  operar(a, op, b) {
    let valor;
    if (op === '+') valor = a + b;
    else if (op === '*') valor = a * b;
    else if (op === '-') {
      if (b > a) return { razon: 'negativo' };
      valor = a - b;
    } else {
      if (b === 0) return { razon: 'cero' };
      if (a % b !== 0) return { razon: 'inexacta' };
      valor = a / b;
    }
    return valor > 10000 ? { razon: 'grande', valor } : { valor };
  },
  potencia(base, e) {
    let valor = 1;
    for (let i = 0; i < e; i++) valor *= base;
    return valor > 10000 ? { razon: 'grande', valor } : { valor };
  },
  clave: v => String(v),
  comparar: (a, b) => a - b,
  html: v => String(v),
});

const sinMenosCero = n => (n === 0 ? 0 : n);

/** Enteros: la resta siempre se puede; la división, solo si es exacta y no entre 0; |valor| ≤ tope. */
export function aritmeticaEnteros({ tope = 200 } = {}) {
  const dentro = valor => (Math.abs(valor) > tope ? { razon: 'grande', valor } : { valor: sinMenosCero(valor) });
  return Object.freeze({
    nombre: 'enteros',
    tope,
    operar(a, op, b) {
      if (op === '+') return dentro(a + b);
      if (op === '-') return dentro(a - b);
      if (op === '*') return dentro(a * b);
      if (b === 0) return { razon: 'cero' };
      if (a % b !== 0) return { razon: 'inexacta' };
      return dentro(a / b);
    },
    potencia(base, e) { return dentro(base ** e); },
    clave: v => String(sinMenosCero(v)),
    comparar: (a, b) => a - b,
    html(v, { detras = false, base = false } = {}) {
      return v < 0 && (detras || base) ? `(${fmt(v)})` : fmt(v);
    },
  });
}

/**
 * Fracciones exactas: cada resultado, irreducible; un entero se escribe como entero. `grande`
 * si el irreducible pasa de los topes (|numerador| > topeNum o denominador > topeDen); `cero`
 * al dividir entre 0. Admite como número un natural, una Fraccion o un { num, den } plano.
 */
export function aritmeticaFracciones({ topeNum = 60, topeDen = 36 } = {}) {
  const F = x => aFraccion(x).simplificar();
  const dentro = f => {
    const s = f.simplificar();
    return Math.abs(s.num) > topeNum || s.den > topeDen ? { razon: 'grande', valor: s } : { valor: s };
  };
  return Object.freeze({
    nombre: 'fracciones',
    topeNum,
    topeDen,
    operar(a, op, b) {
      const x = F(a), y = F(b);
      if (op === '+') return dentro(x.sumar(y));
      if (op === '-') return dentro(x.restar(y));
      if (op === '*') return dentro(x.multiplicar(y));
      if (y.esCero()) return { razon: 'cero' };
      return dentro(x.dividir(y));
    },
    potencia(base, e) { return dentro(F(base).potencia(e)); },
    clave: v => F(v).clave(),
    comparar: (a, b) => compararFracciones(F(a), F(b)),
    html(v, { detras = false, base = false, compacta = false } = {}) {
      const f = F(v);
      if (base && (f.num < 0 || f.den !== 1)) return `(${htmlFraccion(f, { compacta })})`;
      return htmlFraccion(f, { compacta, parentesis: detras });
    },
    texto: v => textoFraccion(F(v)),
  });
}

/** Un Decimal desde un Decimal, un entero o un { m, k } plano (lo que deja JSON). */
function aDecimalPlano(x) {
  if (x instanceof Decimal) return x;
  if (Number.isSafeInteger(x)) return decimal(x, 0);
  if (x && Number.isSafeInteger(x.m) && Number.isInteger(x.k)) return decimal(x.m, x.k);
  throw new Error(`${String(x)} no es un decimal`);
}

/**
 * Decimales en enteros escalados (`_comun/decimales.js`; nunca coma flotante). Cada resultado,
 * sin ceros de más. `inexacta`: la división no termina o un resultado pasa de `cifras` cifras
 * decimales (también una potencia); `cero`; `negativo` (con `negativos: false`); `grande` (|v| > tope).
 */
export function aritmeticaDecimales({ cifras = 3, tope = 500, negativos = false } = {}) {
  const D = aDecimalPlano;
  const TOPE = decimal(tope, 0);
  const dentro = d => {
    const n = d.normalizar();
    if (!negativos && n.m < 0) return { razon: 'negativo', valor: n };
    if (n.k > cifras) return { razon: 'inexacta', valor: n };
    if (compararD(n.abs(), TOPE) > 0) return { razon: 'grande', valor: n };
    return { valor: n };
  };
  const seguro = fn => { try { return fn(); } catch { return { razon: 'grande' }; } };
  return Object.freeze({
    nombre: 'decimales',
    cifras,
    tope,
    negativos,
    operar(a, op, b) {
      const x = D(a), y = D(b);
      return seguro(() => {
        if (op === '+') return dentro(sumarD(x, y));
        if (op === '-') return dentro(restarD(x, y));
        if (op === '*') return dentro(multiplicarD(x, y));
        if (y.esCero()) return { razon: 'cero' };
        const r = dividirD(x, y);
        return r.exacta ? dentro(r.cociente) : { razon: 'inexacta' };
      });
    },
    potencia(base, e) {
      return seguro(() => {
        let v = decimal(1, 0);
        for (let i = 0; i < e; i++) v = multiplicarD(v, D(base));
        return dentro(v);
      });
    },
    clave: v => D(v).clave(),
    comparar: (a, b) => compararD(D(a), D(b)),
    html(v, { idioma = 'es', detras = false, base = false } = {}) {
      const d = D(v).normalizar();
      const t = textoDecimal(d, idioma);
      return d.m < 0 && (detras || base) ? `(${t})` : t;
    },
    texto: v => textoDecimal(D(v).normalizar(), 'es'),
  });
}

// ─── El motor ──────────────────────────────────────────────────────────────────────

/** Un motor de «coloca los paréntesis» con la aritmética `A` (ver la cabecera). */
export function crearMotor(A) {
  const clave = v => A.clave(v);
  const texto = v => (A.texto ? A.texto(v) : A.clave(v));
  const mismoValor = (a, b) => clave(a) === clave(b);
  const htmlValor = (v, idioma = 'es', opciones = {}) => A.html(v, { idioma, ...opciones });

  // --- Árboles ---

  /** Clave estructural de un árbol (posición de los paréntesis y del exponente). */
  function claveArbol(arbol) {
    if (arbol.v !== undefined) return texto(arbol.v);
    if (arbol.pot) return `(${claveArbol(arbol.x)})^${arbol.pot}`;
    return `(${claveArbol(arbol.l)}${arbol.op}${claveArbol(arbol.r)})`;
  }

  function binarios(numeros, ops, desde, hasta) {
    if (desde === hasta) return [{ v: numeros[desde] }];
    const lista = [];
    for (let k = desde; k < hasta; k++) {
      for (const l of binarios(numeros, ops, desde, k)) {
        for (const r of binarios(numeros, ops, k + 1, hasta)) lista.push({ op: ops[k], l, r });
      }
    }
    return lista;
  }

  const largoBorde = arbol => (arbol.v !== undefined ? 1 : 1 + largoBorde(arbol.r));

  function ponerEnNivel(arbol, pot, nivel) {
    if (nivel === 0) return { pot, x: arbol };
    return { op: arbol.op, l: arbol.l, r: ponerEnNivel(arbol.r, pot, nivel - 1) };
  }

  /** Todas las agrupaciones (con el exponente en cada sitio donde se puede escribir). */
  function arboles({ numeros, operaciones, exponente }) {
    const base = binarios(numeros, operaciones, 0, numeros.length - 1);
    if (!exponente) return base;
    const lista = [];
    for (const arbol of base) {
      const n = largoBorde(arbol);
      for (let nivel = 0; nivel < n; nivel++) {
        const conPot = ponerEnNivel(arbol, exponente, nivel);
        if (secuencia(conPot).some(e => typeof e !== 'string' && e.pot)) lista.push(conPot);
      }
    }
    return lista;
  }

  // --- Secuencias ---

  function operando(arbol, lado, opPadre) {
    if (arbol.v !== undefined) return [{ v: arbol.v }];
    if (arbol.pot) {
      const x = arbol.x;
      return [{ pot: arbol.pot, base: x.v !== undefined ? { v: x.v } : { g: secuencia(x) } }];
    }
    const pide = PREC[arbol.op] < PREC[opPadre] || (lado === 'der' && PREC[arbol.op] === PREC[opPadre]);
    return pide ? [{ g: secuencia(arbol) }] : secuencia(arbol);
  }

  /** La secuencia plana de un árbol, con los paréntesis imprescindibles. */
  function secuencia(arbol) {
    if (arbol.v !== undefined || arbol.pot) return operando(arbol, 'izq', '+');
    return [...operando(arbol.l, 'izq', arbol.op), arbol.op, ...operando(arbol.r, 'der', arbol.op)];
  }

  /** Texto plano de una secuencia, en ASCII (`*`, `/`, `-`, `^2`): para claves, huellas y la prueba con la U1. */
  function claveSecuencia(sec) {
    return sec.map(e => {
      if (typeof e === 'string') return ` ${e} `;
      if (e.v !== undefined) return texto(e.v);
      if (e.g) return `(${claveSecuencia(e.g)})`;
      const b = e.base.v !== undefined ? texto(e.base.v) : `(${claveSecuencia(e.base.g)})`;
      return `${b}^${e.pot}`;
    }).join('');
  }

  /**
   * HTML de una secuencia. Un número que va justo detrás de una operación lleva `detras` (un
   * negativo sale entre paréntesis); el primero de la línea o de un grupo, no. La base de una
   * potencia lleva `base`: (−2)² sigue escrito así cuando el grupo se ha quedado en un número.
   */
  function htmlSecuencia(sec, idioma = 'es', { compacta = false } = {}) {
    let s = '';
    sec.forEach((e, i) => {
      const detras = i > 0 && typeof sec[i - 1] === 'string';
      if (typeof e === 'string') { s += ` ${signo(e, idioma)} `; return; }
      if (e.v !== undefined) { s += htmlValor(e.v, idioma, { detras, compacta }); return; }
      if (e.g) { s += `(${htmlSecuencia(e.g, idioma, { compacta })})`; return; }
      const b = e.base.v !== undefined ? htmlValor(e.base.v, idioma, { base: true, detras, compacta })
        : `(${htmlSecuencia(e.base.g, idioma, { compacta })})`;
      s += `${b}<sup>${e.pot}</sup>`;
    });
    return s;
  }

  const htmlArbol = (arbol, idioma = 'es', opciones = {}) => htmlSecuencia(secuencia(arbol), idioma, opciones);

  /** Una operación suelta para los mensajes: «−7 : 2», «5 · (−2)», «(−3)²». */
  function htmlOperacion(a, op, b, idioma = 'es') {
    if (String(op).startsWith('^')) return `${htmlValor(a, idioma, { base: true })}<sup>${b}</sup>`;
    return `${htmlValor(a, idioma)} ${signo(op, idioma)} ${htmlValor(b, idioma, { detras: true })}`;
  }

  // --- Resolver ---

  /** Una operación de la secuencia (paréntesis más interno, potencias, · y :, + y −; de izquierda a derecha). */
  function paso(sec) {
    for (let i = 0; i < sec.length; i++) {
      const e = sec[i];
      const grupo = typeof e === 'string' ? null : (e.g ? e : (e.base && e.base.g ? e.base : null));
      if (!grupo) continue;
      const r = paso(grupo.g);
      if (r.problema) return r;
      const interior = r.sec;
      const nuevoGrupo = interior.length === 1 && interior[0].v !== undefined ? interior[0] : { g: interior };
      const nuevo = e.g ? nuevoGrupo : { pot: e.pot, base: nuevoGrupo };
      return { sec: [...sec.slice(0, i), nuevo, ...sec.slice(i + 1)] };
    }
    for (let i = 0; i < sec.length; i++) {
      const e = sec[i];
      if (typeof e !== 'string' && e.pot) {
        const r = A.potencia(e.base.v, e.pot);
        if (r.razon) return { problema: { razon: r.razon, a: e.base.v, op: `^${e.pot}`, b: e.pot } };
        return { sec: [...sec.slice(0, i), { v: r.valor }, ...sec.slice(i + 1)] };
      }
    }
    for (const ops of [['*', '/'], ['+', '-']]) {
      const i = sec.findIndex(e => typeof e === 'string' && ops.includes(e));
      if (i === -1) continue;
      const a = sec[i - 1].v, op = sec[i], b = sec[i + 1].v;
      const r = A.operar(a, op, b);
      if (r.razon) return { problema: { razon: r.razon, a, op, b } };
      return { sec: [...sec.slice(0, i - 1), { v: r.valor }, ...sec.slice(i + 2)] };
    }
    throw new Error('secuencia sin nada que hacer');
  }

  /**
   * Evalúa un árbol paso a paso: { valor, pasos } o { invalido: { paso, razon, a, op, b }, pasos }
   * (los pasos llegan hasta la línea con la operación que no se puede hacer). Cada paso es una
   * SECUENCIA; la primera, la expresión entera.
   */
  function evaluar(arbol) {
    let sec = secuencia(arbol);
    const pasos = [sec];
    while (!(sec.length === 1 && sec[0].v !== undefined)) {
      const r = paso(sec);
      if (r.problema) return { invalido: { paso: pasos.length - 1, ...r.problema }, pasos };
      sec = r.sec;
      pasos.push(sec);
    }
    return { valor: sec[0].v, pasos };
  }

  /** La resolución en HTML: una línea por paso, «= …» salvo la primera (como la U1). */
  function htmlPasos(pasos, idioma = 'es') {
    return pasos.map((l, i) => `<div class="paso">${i ? '= ' : ''}${htmlSecuencia(l, idioma)}</div>`).join('');
  }

  /** La resolución en una línea: «2 + 3 · 4 = 2 + 12 = 14». */
  const cadenaPasos = (pasos, idioma = 'es') => pasos.map(l => htmlSecuencia(l, idioma)).join(' = ');

  // --- Resultados ---

  /** Los valores distintos (por clave) de una lista, de menor a mayor. */
  function distintos(valores) {
    const porClave = new Map();
    for (const v of valores) if (!porClave.has(clave(v))) porClave.set(clave(v), v);
    return [...porClave.values()].sort((x, y) => A.comparar(x, y));
  }

  /** Los valores distintos de los árboles válidos, de menor a mayor. */
  function resultados(expresion) {
    return distintos(arboles(expresion).map(evaluar).filter(r => r.valor !== undefined).map(r => r.valor));
  }

  const sinParentesis = expresion => interpretar(expresion, null).arbol;

  function analizar(expresion) {
    const todos = arboles(expresion);
    const evaluados = todos.map(a => ({ arbol: a, r: evaluar(a) }));
    const validos = evaluados.filter(e => e.r.valor !== undefined);
    const invalidos = evaluados.filter(e => e.r.valor === undefined);
    const valores = distintos(validos.map(e => e.r.valor));
    const defecto = evaluar(sinParentesis(expresion));
    const razones = new Set(invalidos.map(e => e.r.invalido.razon));
    return { todos, evaluados, validos, invalidos, valores, defecto, razones, hayGrande: razones.has('grande') };
  }

  // --- Lo que coloca el alumno ---
  // `parentesis` es { abre: [..], cierra: [..] }: por número, cuántos «(» a su izquierda y
  // cuántos «)» a su derecha (de 0 a 2 cada uno).

  function fichas(numeros, ops, parentesis) {
    const fs = [];
    numeros.forEach((n, i) => {
      for (let k = 0; k < (parentesis?.abre[i] ?? 0); k++) fs.push({ abre: true });
      fs.push({ n });
      for (let k = 0; k < (parentesis?.cierra[i] ?? 0); k++) fs.push({ cierra: true });
      if (i < ops.length) fs.push({ op: ops[i] });
    });
    return fs;
  }

  function plegar(lista) {
    lista = [...lista];
    for (const ops of [['*', '/'], ['+', '-']]) {
      let i = 1;
      while (i < lista.length) {
        if (typeof lista[i] === 'string' && ops.includes(lista[i])) {
          lista.splice(i - 1, 3, { op: lista[i], l: lista[i - 1], r: lista[i + 1] });
        } else i += 2;
      }
    }
    return lista[0];
  }

  function leer(fs, exponente) {
    let pos = 0;
    function secuenciaLeida() {
      const items = [];
      while (pos < fs.length && !fs[pos].cierra) {
        const f = fs[pos++];
        if (f.abre) { items.push(plegar(secuenciaLeida())); pos++; } else if (f.op) items.push(f.op); else items.push({ v: f.n });
      }
      return items;
    }
    const items = secuenciaLeida();
    if (exponente) items[items.length - 1] = { pot: exponente, x: items[items.length - 1] };
    return plegar(items);
  }

  function equilibrado(fs) {
    let nivel = 0;
    for (const f of fs) {
      if (f.abre) nivel++;
      if (f.cierra && --nivel < 0) return false;
    }
    return nivel === 0;
  }

  /** El árbol de lo que ha puesto el alumno: { arbol, redundantes } o { error: 'desequilibrados' | 'vacio' }. */
  function interpretar(expresion, parentesis) {
    const { numeros, operaciones, exponente } = expresion;
    if (!numeros.length) return { error: 'vacio' };
    const fs = fichas(numeros, operaciones, parentesis);
    if (!equilibrado(fs)) return { error: 'desequilibrados' };
    const arbol = leer(fs, exponente);
    if (!parentesis) return { arbol, redundantes: true };
    const base = leer(fichas(numeros, operaciones, null), exponente);
    return { arbol, redundantes: claveArbol(arbol) === claveArbol(base) };
  }

  /** La colocación mínima (abre/cierra por número) que da este árbol. */
  function colocacion(arbol, n) {
    const abre = Array(n).fill(0), cierra = Array(n).fill(0);
    let i = 0;
    function recorrer(sec) {
      for (const e of sec) {
        if (typeof e === 'string') continue;
        if (e.v !== undefined) { i++; continue; }
        const grupo = e.g ?? e.base?.g ?? null;
        if (grupo) {
          abre[i]++;
          recorrer(grupo);
          cierra[i - 1]++;
        } else i++;
      }
    }
    recorrer(secuencia(arbol));
    return { abre, cierra };
  }

  const sumaParentesis = c => [...c.abre, ...c.cierra].reduce((x, y) => x + y, 0);

  /** ¿Se escribe con a lo sumo dos paréntesis seguidos en cada hueco? */
  const alcanzable = (arbol, n) => [...colocacion(arbol, n).abre, ...colocacion(arbol, n).cierra].every(k => k <= 2);

  /** Un árbol válido que da `valor` (el de menos paréntesis), o null. */
  function arbolQueDa(expresion, valor) {
    const n = expresion.numeros.length;
    const k = clave(valor);
    let mejor = null, coste = Infinity;
    for (const a of arboles(expresion)) {
      const r = evaluar(a);
      if (r.valor === undefined || clave(r.valor) !== k) continue;
      const c = sumaParentesis(colocacion(a, n));
      if (c < coste) { mejor = a; coste = c; }
    }
    return mejor;
  }

  /**
   * La siguiente colocación de una pista: UN paréntesis más hacia la agrupación (la de menos
   * paréntesis) de un resultado que falta. `faltan` es un Set de CLAVES (`clave(v)`).
   */
  function pistaPara(expresion, actual, faltan) {
    const n = expresion.numeros.length;
    let objetivo = null;
    for (const a of arboles(expresion)) {
      const r = evaluar(a);
      if (r.valor === undefined || !faltan.has(clave(r.valor))) continue;
      const c = colocacion(a, n);
      if (!objetivo || sumaParentesis(c) < sumaParentesis(objetivo)) objetivo = c;
    }
    if (!objetivo) return null;
    const cabe = [...actual.abre, ...actual.cierra].every((k, i) => k <= [...objetivo.abre, ...objetivo.cierra][i]);
    const base = cabe ? { abre: [...actual.abre], cierra: [...actual.cierra] } : { abre: Array(n).fill(0), cierra: Array(n).fill(0) };
    for (const lado of ['abre', 'cierra']) {
      const i = base[lado].findIndex((k, j) => k < objetivo[lado][j]);
      if (i !== -1) { base[lado][i]++; return base; }
    }
    return cabe ? pistaPara(expresion, { abre: Array(n).fill(0), cierra: Array(n).fill(0) }, faltan) : null;
  }

  /** Lo que ha escrito el alumno, con sus paréntesis, en texto plano ASCII (como el de la U1). */
  function textoColocacion({ numeros, operaciones, exponente }, { abre, cierra }) {
    const partes = numeros.map((n, i) => `${'('.repeat(abre[i])}${texto(n)}${')'.repeat(cierra[i])}${i === numeros.length - 1 && exponente ? `^${exponente}` : ''}`);
    return partes.reduce((txt, p, i) => (i ? `${txt} ${operaciones[i - 1]} ${p}` : p), '');
  }

  /** Lo mismo en HTML: un número detrás de una operación y sin «(» delante lleva `detras`. */
  function htmlColocacion({ numeros, operaciones, exponente }, { abre, cierra }, idioma = 'es', { compacta = false } = {}) {
    const ultimo = numeros.length - 1;
    const partes = numeros.map((n, i) => {
      const base = i === ultimo && exponente && !cierra[i];
      const num = htmlValor(n, idioma, { detras: i > 0 && !abre[i], base: Boolean(base), compacta });
      return `${'('.repeat(abre[i])}${num}${')'.repeat(cierra[i])}${i === ultimo && exponente ? `<sup>${exponente}</sup>` : ''}`;
    });
    return partes.reduce((txt, p, i) => (i ? `${txt} ${signo(operaciones[i - 1], idioma)} ${p}` : p), '');
  }

  // --- Ítems y generadores ---

  /** La clave de una expresión (números por valor, operaciones y exponente): para no repetir ítems y para las huellas. */
  const claveExpresion = ({ numeros, operaciones, exponente }) => `${numeros.map(texto).join(' ')}|${operaciones.join('')}|${exponente ?? ''}`;

  const expresionDe = item => ({ numeros: item.numeros, operaciones: item.operaciones, exponente: item.exponente ?? null });

  /** El ítem de una expresión: { tipo, numeros, operaciones, exponente, resultados, sinParentesis, objetivo, …extra }. */
  function itemDe(tipo, expresion, extra = {}) {
    const an = analizar(expresion);
    return {
      tipo,
      numeros: expresion.numeros,
      operaciones: expresion.operaciones,
      exponente: expresion.exponente ?? null,
      resultados: an.valores,
      sinParentesis: an.defecto.valor,
      objetivo: null,
      ...extra,
    };
  }

  const estadisticas = { llamadas: 0, caidas: 0 };

  /**
   * Prueba `hacer()` hasta que salga una expresión que cumpla `vale(an, e)`, que se pueda
   * calcular sin paréntesis, que tenga todas sus agrupaciones al alcance del editor y que no sea
   * la de `anterior` (un ítem o una expresión). Si no sale en `intentos`, devuelve `reserva` y lo
   * cuenta en `estadisticas.caidas` (el test de cada práctica lo mide: menos del 1 %).
   */
  function buscar(rng, hacer, vale, reserva, { anterior = null, intentos = 20000 } = {}) {
    estadisticas.llamadas++;
    const evitar = anterior && anterior.numeros ? claveExpresion(expresionDe(anterior)) : null;
    for (let i = 0; i < intentos; i++) {
      const e = hacer();
      if (evitar !== null && claveExpresion(e) === evitar) continue;
      const an = analizar(e);
      if (an.defecto.valor !== undefined && an.todos.every(a => alcanzable(a, e.numeros.length)) && vale(an, e)) return e;
    }
    estadisticas.caidas++;
    return reserva;
  }

  return {
    aritmetica: A,
    clave, mismoValor, htmlValor, signo,
    claveArbol, arboles, secuencia, claveSecuencia, htmlSecuencia, htmlArbol, htmlOperacion,
    evaluar, htmlPasos, cadenaPasos,
    resultados, sinParentesis, analizar,
    interpretar, colocacion, alcanzable, arbolQueDa, pistaPara, textoColocacion, htmlColocacion,
    claveExpresion, expresionDe, itemDe, buscar, estadisticas,
  };
}

/**
 * Huella FNV-1a de 32 bits, en base 36 (la misma que `combinadas-fracciones` y
 * `multiplica-divide-decimales`): para excluir casos de examen sin escribirlos en claro.
 * Lo normal es pasarle `claveExpresion(e)`, calculada fuera del repositorio con este motor.
 */
export function huella(texto) {
  let h = 0x811c9dc5;
  for (const c of String(texto)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}

export { Fraccion, Decimal };
