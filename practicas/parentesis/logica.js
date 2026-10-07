// Coloca los paréntesis (repaso de la unidad 1): lógica pura, sin DOM ni red.
//
// Una EXPRESIÓN es { numeros: [a, b, c…], operaciones: ['+', '*', '-', '/'], exponente: null | 2 | 3 }.
// Las operaciones se guardan en ASCII (`*` es el producto, `/` la división);
// `formatear` las convierte en «·», «−», «:» o «÷» al pintarlas. El exponente
// va siempre al final y se aplica a lo que tiene delante: al último número o,
// si ahí se cierra un paréntesis, al grupo que cierra.
//
// Un ÁRBOL es una agrupación de la expresión:
//   { v }                  un número
//   { op, l, r }           una operación entre dos árboles
//   { pot, x }             el árbol x elevado a `pot` (solo sobre el último número
//                          o sobre un grupo que acaba en él)
// Un árbol es VÁLIDO si todas sus operaciones dan números naturales (sin restas
// negativas, sin divisiones inexactas ni entre 0) y ningún valor pasa de TOPE.

export const TOPE = 10000;

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 };

// --- Árboles -------------------------------------------------------------------

/** Clave estructural de un árbol: dos árboles son el mismo si tienen la misma clave. */
export function clave(arbol) {
  if (arbol.v !== undefined) return String(arbol.v);
  if (arbol.pot) return `(${clave(arbol.x)})^${arbol.pot}`;
  return `(${clave(arbol.l)}${arbol.op}${clave(arbol.r)})`;
}

/** Todos los árboles binarios sobre las hojas `hojas[desde..hasta]` (sin exponente). */
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

/** Número de nodos del borde derecho (la raíz, su hijo derecho… hasta la hoja). */
function largoBorde(arbol) {
  return arbol.v !== undefined ? 1 : 1 + largoBorde(arbol.r);
}

/** Todas las agrupaciones posibles de la expresión (con el exponente en cada sitio donde puede ir). */
export function arboles({ numeros, operaciones, exponente }) {
  const base = binarios(numeros, operaciones, 0, numeros.length - 1);
  if (!exponente) return base;
  const lista = [];
  for (const arbol of base) {
    const n = largoBorde(arbol);
    // nivel 0 = la raíz… n − 1 = la hoja: el exponente va en el nodo que ocupa ese lugar del borde derecho,
    // pero solo se puede escribir si ningún paréntesis lo encierra (el «²» va detrás del último «)»)
    for (let nivel = 0; nivel < n; nivel++) {
      const conPot = ponerEnNivel(arbol, exponente, nivel);
      if (potEnPrimerNivel(secuencia(conPot))) lista.push(conPot);
    }
  }
  return lista;
}

function potEnPrimerNivel(sec) {
  return sec.some(e => typeof e !== 'string' && e.pot);
}

/** Envuelve en el exponente el nodo del borde derecho que está `nivel` pasos por debajo de la raíz. */
function ponerEnNivel(arbol, pot, nivel) {
  if (nivel === 0) return { pot, x: arbol };
  return { op: arbol.op, l: arbol.l, r: ponerEnNivel(arbol.r, pot, nivel - 1) };
}

// --- Secuencias: cómo se escribe un árbol y cómo se resuelve ---------------------
//
// Una secuencia es una lista plana de elementos, a nivel de un mismo paréntesis:
//   { v }                  número
//   { g: secuencia }       grupo entre paréntesis
//   { pot, base }          potencia (base es { v } o { g })
//   'op'                   una operación ('+', '-', '*', '/')
// Se escriben los paréntesis imprescindibles para que la lectura normal
// (potencias, después · y :, después + y −, de izquierda a derecha) dé este árbol.

function operando(arbol, lado, opPadre) {
  if (arbol.v !== undefined) return [{ v: arbol.v }];
  if (arbol.pot) {
    const x = arbol.x;
    return [{ pot: arbol.pot, base: x.v !== undefined ? { v: x.v } : { g: secuencia(x) } }];
  }
  const pide = PREC[arbol.op] < PREC[opPadre] || (lado === 'der' && PREC[arbol.op] === PREC[opPadre]);
  return pide ? [{ g: secuencia(arbol) }] : secuencia(arbol);
}

/** La secuencia plana de un árbol (sin paréntesis alrededor del conjunto). */
export function secuencia(arbol) {
  if (arbol.v !== undefined || arbol.pot) return operando(arbol, 'izq', '+');
  return [...operando(arbol.l, 'izq', arbol.op), arbol.op, ...operando(arbol.r, 'der', arbol.op)];
}

/** Texto de una secuencia, en ASCII (`*`, `/`, `-`, `^2`); `formatear` lo adorna. */
export function textoSecuencia(sec) {
  return sec.map(e => {
    if (typeof e === 'string') return ` ${e} `;
    if (e.v !== undefined) return String(e.v);
    if (e.g) return `(${textoSecuencia(e.g)})`;
    const b = e.base.v !== undefined ? String(e.base.v) : `(${textoSecuencia(e.base.g)})`;
    return `${b}^${e.pot}`;
  }).join('');
}

/** Cómo se escribe el árbol, con los paréntesis imprescindibles. */
export function textoArbol(arbol) {
  return textoSecuencia(secuencia(arbol));
}

/** Convierte el texto interno al que ve el alumno (HTML): punto medio, signo menos, exponentes. */
export function formatear(texto, idioma = 'es') {
  return texto
    .replace(/\*/g, '·')
    .replace(/ - /g, ' − ')
    .replace(/ \/ /g, idioma === 'en' ? ' ÷ ' : ' : ')
    .replace(/\^(\d)/g, '<sup>$1</sup>');
}

/** Una operación suelta, a, op, b, para los mensajes: «8 − 15». */
export function textoOperacion(a, op, b, idioma = 'es') {
  return formatear(`${a} ${op} ${b}`, idioma);
}

// Un paso de la resolución: devuelve { sec, invalido } con la secuencia ya cambiada
// (o la misma si hay un problema).

function potencia(base, e) {
  let r = 1;
  for (let i = 0; i < e; i++) r *= base;
  return r;
}

/** Una operación entre naturales: { valor } o { razon, a, op, b }. */
function operar(a, op, b) {
  let valor;
  if (op === '+') valor = a + b;
  else if (op === '*') valor = a * b;
  else if (op === '-') {
    if (b > a) return { razon: 'negativo', a, op, b };
    valor = a - b;
  } else {
    if (b === 0) return { razon: 'cero', a, op, b };
    if (a % b !== 0) return { razon: 'inexacta', a, op, b };
    valor = a / b;
  }
  if (valor > TOPE) return { razon: 'grande', a, op, b, valor };
  return { valor };
}

/**
 * Hace UNA operación de la secuencia: primero el paréntesis más interno (el
 * primero por la izquierda); sin paréntesis, las potencias; después · y : de
 * izquierda a derecha; después + y − de izquierda a derecha. Un grupo que se
 * queda en un solo número pierde sus paréntesis en el mismo paso.
 */
function paso(sec) {
  // 1. paréntesis (también el de la base de una potencia)
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
  // 2. potencias
  for (let i = 0; i < sec.length; i++) {
    const e = sec[i];
    if (typeof e !== 'string' && e.pot) {
      const valor = potencia(e.base.v, e.pot);
      if (valor > TOPE) return { problema: { razon: 'grande', a: e.base.v, op: `^${e.pot}`, b: e.pot, valor } };
      return { sec: [...sec.slice(0, i), { v: valor }, ...sec.slice(i + 1)] };
    }
  }
  // 3. · y :   4. + y −
  for (const ops of [['*', '/'], ['+', '-']]) {
    const i = sec.findIndex(e => typeof e === 'string' && ops.includes(e));
    if (i === -1) continue;
    const r = operar(sec[i - 1].v, sec[i], sec[i + 1].v);
    if (r.razon) return { problema: r };
    return { sec: [...sec.slice(0, i - 1), { v: r.valor }, ...sec.slice(i + 2)] };
  }
  throw new Error('secuencia sin nada que hacer');
}

/**
 * Evalúa un árbol paso a paso. Devuelve { valor, pasos } o
 * { invalido: { paso, razon, a, op, b }, pasos } (los pasos llegan hasta la línea
 * con la operación que no se puede hacer). Cada paso es una línea de texto
 * interno (ver `formatear`); la primera es la expresión entera.
 */
export function evaluar(arbol) {
  let sec = secuencia(arbol);
  const pasos = [textoSecuencia(sec)];
  while (!(sec.length === 1 && sec[0].v !== undefined)) {
    const r = paso(sec);
    if (r.problema) return { invalido: { paso: pasos.length - 1, ...r.problema }, pasos };
    sec = r.sec;
    pasos.push(textoSecuencia(sec));
  }
  return { valor: sec[0].v, pasos };
}

/** El HTML de una línea de resolución. */
export function lineaHtml(linea, idioma = 'es') {
  return formatear(linea, idioma);
}

/** El HTML de toda la resolución: «a = b» en cada línea salvo la primera. */
export function textoPasos(pasos, idioma = 'es') {
  return pasos.map((l, i) => `<div class="paso">${i ? '= ' : ''}${lineaHtml(l, idioma)}</div>`).join('');
}

// --- Resultados -----------------------------------------------------------------

/** Los valores distintos de los árboles válidos, de menor a mayor. */
export function resultados(expresion) {
  const valores = new Set();
  for (const a of arboles(expresion)) {
    const r = evaluar(a);
    if (r.valor !== undefined) valores.add(r.valor);
  }
  return [...valores].sort((x, y) => x - y);
}

/** El árbol de la expresión sin ningún paréntesis (la lectura normal). */
export function sinParentesis(expresion) {
  return interpretar(expresion, null).arbol;
}

// --- Lo que coloca el alumno ----------------------------------------------------
//
// `parentesis` es { abre: [..], cierra: [..] }: por número, cuántos «(» hay a su
// izquierda y cuántos «)» a su derecha (de 0 a 2 cada uno).

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

/** Lee una lista de fichas y construye el árbol (el exponente va sobre el último elemento de la secuencia exterior). */
function leer(fs, exponente) {
  let pos = 0;
  function secuenciaLeida() {
    const items = [];   // árboles y operaciones, sin plegar
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

/** Aplica la jerarquía a una lista plana [árbol, op, árbol…]: primero · y :, luego + y −, de izquierda a derecha. */
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

function equilibrado(fs) {
  let nivel = 0;
  for (const f of fs) {
    if (f.abre) nivel++;
    if (f.cierra && --nivel < 0) return false;
  }
  return nivel === 0;
}

/**
 * El árbol que corresponde a lo que ha puesto el alumno.
 * → { arbol, redundantes } (`redundantes` es true si es el mismo árbol que sin
 * paréntesis: no agrupan nada) o { error: 'desequilibrados' | 'vacio' }.
 */
export function interpretar(expresion, parentesis) {
  const { numeros, operaciones, exponente } = expresion;
  if (!numeros.length) return { error: 'vacio' };
  const fs = fichas(numeros, operaciones, parentesis);
  if (!equilibrado(fs)) return { error: 'desequilibrados' };
  const arbol = leer(fs, exponente);
  if (!parentesis) return { arbol, redundantes: true };
  const base = leer(fichas(numeros, operaciones, null), exponente);
  return { arbol, redundantes: clave(arbol) === clave(base) };
}

/**
 * La colocación mínima de paréntesis (abre/cierra por número) que da este árbol,
 * con los paréntesis que `textoArbol` escribe. Es lo que usan la pista y el test.
 */
export function colocacion(arbol, n) {
  const abre = Array(n).fill(0), cierra = Array(n).fill(0);
  let i = 0;
  function recorrer(sec) {
    for (const e of sec) {
      if (typeof e === 'string') continue;
      if (e.v !== undefined) { i++; continue; }
      const grupo = e.g ?? e.base?.g ?? null;   // la secuencia de dentro del paréntesis, si lo hay
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

/** ¿Se puede escribir el árbol con a lo sumo dos paréntesis seguidos en cada hueco? */
export function alcanzable(arbol, n) {
  const c = colocacion(arbol, n);
  return [...c.abre, ...c.cierra].every(k => k <= 2);
}

// --- Generadores ----------------------------------------------------------------

/** Texto de una expresión sin paréntesis (con su exponente al final). */
export function textoExpresion(expresion) {
  return textoArbol(sinParentesis(expresion));
}

function analizar(expresion) {
  const todos = arboles(expresion);
  const evaluados = todos.map(a => ({ arbol: a, r: evaluar(a) }));
  const validos = evaluados.filter(e => e.r.valor !== undefined);
  const invalidos = evaluados.filter(e => e.r.valor === undefined);
  const valores = [...new Set(validos.map(e => e.r.valor))].sort((x, y) => x - y);
  const defecto = evaluar(sinParentesis(expresion));
  return { todos, validos, invalidos, valores, defecto, hayGrande: invalidos.some(e => e.r.invalido.razon === 'grande') };
}

function itemDe(tipo, expresion, extra = {}) {
  const an = analizar(expresion);
  return {
    tipo,
    numeros: expresion.numeros,
    operaciones: expresion.operaciones,
    exponente: expresion.exponente,
    resultados: an.valores,
    sinParentesis: an.defecto.valor,
    objetivo: null,
    ...extra,
  };
}

/** Ítem → expresión. */
export function expresionDe(item) {
  return { numeros: item.numeros, operaciones: item.operaciones, exponente: item.exponente };
}

/** Intenta hasta encontrar una expresión que cumpla `vale`; si no, usa la de reserva. */
function buscar(rng, hacer, vale, reserva) {
  for (let i = 0; i < 20000; i++) {
    const e = hacer();
    const an = analizar(e);
    if (an.defecto.valor !== undefined && !an.todos.some(a => !alcanzable(a, e.numeros.length)) && vale(an, e)) return e;
  }
  return reserva;
}

/** Ejercicio 1: tres números, + y ·; exactamente 2 resultados. */
function generar1(rng) {
  const hacer = () => ({
    numeros: [rng.entero(2, 9), rng.entero(2, 9), rng.entero(2, 9)],
    operaciones: rng.elegir([['+', '*'], ['*', '+']]),
    exponente: null,
  });
  return buscar(rng, hacer, an => an.valores.length === 2 && an.invalidos.length === 0,
    { numeros: [2, 3, 4], operaciones: ['+', '*'], exponente: null });
}

/** Ejercicio 2: tres números con + y · y un cuadrado (o un cubo) al final; 4 o 5 resultados. */
function generar2(rng) {
  const hacer = () => ({
    numeros: [rng.entero(2, 9), rng.entero(2, 6), rng.entero(2, rng.azar() < 0.2 ? 3 : 5)],
    operaciones: rng.elegir([['+', '*'], ['*', '+'], ['+', '*'], ['+', '+'], ['*', '*']]),
    exponente: rng.azar() < 0.15 ? 3 : 2,
  });
  return buscar(rng, hacer,
    an => an.valores.length >= 4 && an.valores.length <= 5 && an.invalidos.length === 0,
    { numeros: [5, 2, 3], operaciones: ['+', '*'], exponente: 2 });
}

/** Ejercicio 3: cuatro números con alguna resta o división; algún árbol inválido y ≥ 3 resultados. */
function generar3(rng) {
  const hacer = () => {
    const operaciones = [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/', '-', '/']));
    if (!operaciones.some(o => o === '-' || o === '/')) operaciones[rng.entero(0, 2)] = rng.elegir(['-', '/']);
    return { numeros: [0, 1, 2, 3].map(() => rng.entero(2, 12)), operaciones, exponente: null };
  };
  return buscar(rng, hacer,
    an => an.invalidos.length >= 1 && an.valores.length >= 3 && !an.hayGrande,
    { numeros: [12, 8, 2, 3], operaciones: ['-', '/', '+'], exponente: null });
}

/** Ejercicio 4: una diana. Tres números con cuadrado, o cuatro con las cuatro operaciones. */
function generar4(rng) {
  const tres = rng.azar() < 0.5;
  const hacer = tres
    ? () => ({
      numeros: [rng.entero(2, 9), rng.entero(2, 6), rng.entero(2, 5)],
      operaciones: rng.elegir([['+', '*'], ['*', '+'], ['+', '*']]),
      exponente: 2,
    })
    : () => ({
      numeros: [0, 1, 2, 3].map(() => rng.entero(2, 12)),
      operaciones: [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/', '+', '-'])),
      exponente: null,
    });
  return buscar(rng, hacer, an => an.valores.length >= 3 && !an.hayGrande,
    { numeros: [5, 2, 3], operaciones: ['+', '*'], exponente: 2 });
}

/** El ítem del ejercicio `ejercicio` (1 a 4). */
export function generar(ejercicio, rng) {
  if (ejercicio === 1) return itemDe('todos', generar1(rng));
  if (ejercicio === 2) return itemDe('todos', generar2(rng));
  if (ejercicio === 3) return itemDe('todos', generar3(rng));
  const e = generar4(rng);
  const item = itemDe('diana', e);
  const otros = item.resultados.filter(v => v !== item.sinParentesis);
  return { ...item, objetivo: rng.elegir(otros) };
}

/** Un árbol válido de la expresión que da `valor` (el de menos paréntesis), o null. */
export function arbolQueDa(expresion, valor) {
  const n = expresion.numeros.length;
  let mejor = null, coste = Infinity;
  for (const a of arboles(expresion)) {
    const r = evaluar(a);
    if (r.valor !== valor) continue;
    const c = colocacion(a, n);
    const k = [...c.abre, ...c.cierra].reduce((x, y) => x + y, 0);
    if (k < coste) { mejor = a; coste = k; }
  }
  return mejor;
}

/** La expresión tal como la ha escrito el alumno, con sus paréntesis (texto interno, ver `formatear`). */
export function textoColocacion({ numeros, operaciones, exponente }, { abre, cierra }) {
  const partes = numeros.map((n, i) => `${'('.repeat(abre[i])}${n}${')'.repeat(cierra[i])}${i === numeros.length - 1 && exponente ? `^${exponente}` : ''}`);
  return partes.reduce((txt, p, i) => (i ? `${txt} ${operaciones[i - 1]} ${p}` : p), '');
}

const sumaParentesis = c => [...c.abre, ...c.cierra].reduce((x, y) => x + y, 0);

/**
 * La siguiente colocación de una pista: añade UN paréntesis hacia una agrupación
 * cuyo resultado falta (la de menos paréntesis). Si lo que hay puesto no cabe
 * en esa agrupación, se empieza de cero con un solo paréntesis.
 * `faltan` es el conjunto de valores que aún no se han conseguido.
 */
export function pistaPara(expresion, actual, faltan) {
  const n = expresion.numeros.length;
  let objetivo = null;
  for (const a of arboles(expresion)) {
    const r = evaluar(a);
    if (r.valor === undefined || !faltan.has(r.valor)) continue;
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
  // ya estaba puesta toda la agrupación (pero su resultado no cuenta como nuevo): se vuelve a empezar
  return cabe ? pistaPara(expresion, { abre: Array(n).fill(0), cierra: Array(n).fill(0) }, faltan) : null;
}
