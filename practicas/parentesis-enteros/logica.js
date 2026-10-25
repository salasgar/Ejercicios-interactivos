// Paréntesis y corchetes (unidad 3, PU2 tarea 88). Aquí está toda la aritmética,
// PURA (sin DOM): generadores, comprobaciones y errores típicos. La pantalla está en
// practica.js. Se prueba en `tests/practicas-parentesis-enteros.test.js`.
//
// Ítems (datos puros, sirven de clave y de registro de fallos):
//   1 quita     { antes, signoPar, dentro, despues, expr }   a ± (b ± c) ± d
//   2 calcula   { expr }                                     9 − (2 − 7 + 3) + (−2 + 6)
//   3 potencia  { tipo, exprs, valores, meta }               1 − (3 + 5)² frente a 1 − (3 + 5²)
//   4 corchetes { expr }                                     [10 − (14 − 21)] − 3
//   5 colocar   { numeros, ops, objetivo, expr }             −3 · 2 + 5 · 3 = 39
// Cada `expr` es texto que `analizar` vuelve a leer (`aTexto` de enteros.js).
// Todo valor, final o intermedio, queda dentro de ±TOPE.

import {
  analizar, evaluar, aTexto, html, num, terminos, deTerminos, nodoEn, reemplazar, valorLiteral,
  cadenaDePasos, ERRORES_TIPICOS,
} from '../_comun/enteros.js';

export const TOPE = 200;

const par = (arg, forma = '(') => ({ tipo: 'par', forma, arg });
const hijo = (ruta, k) => (ruta ? `${ruta}.${k}` : k);
const suma = lista => lista.reduce((s, t) => s + t.signo * t.valor, 0);
const mismos = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

/** [{ signo, valor | arbol }] → árbol (el primero lleva su menos delante si es negativo). */
const deLista = lista => deTerminos(lista.map(t => ({ signo: t.signo, arbol: t.arbol ?? num(t.valor) })));

/** ¿Todo valor, intermedio o final, de la expresión está dentro de ±TOPE y se puede calcular? */
export function enRango(x) {
  try {
    return cadenaDePasos(x).every(e => !e.paso || Math.abs(e.paso.valor) <= TOPE) && Math.abs(evaluar(x)) <= TOPE;
  } catch {
    return false;
  }
}

/** La expresión como líneas de html unidas con « = »: la resolución paso a paso, de dentro afuera. */
export function cadenaHtml(x, opciones = {}) {
  return cadenaDePasos(x).map(e => html(e.arbol, opciones)).join(' = ');
}

/** Los resultados equivocados que explican los errores típicos: [{ id, valor }], sin repetidos ni el bueno. */
function sinRepetir(candidatos, correcto) {
  const vistos = new Set([correcto]);
  const salida = [];
  for (const { id, valor } of candidatos) {
    if (valor === null || valor === undefined || vistos.has(valor)) continue;
    vistos.add(valor);
    salida.push({ id, valor });
  }
  return salida;
}

/** El error que explica `respuesta` entre `candidatos`, o 'otro'. */
export const errorDe = (candidatos, respuesta) => candidatos.find(c => c.valor === respuesta)?.id ?? 'otro';

// ─── Ejercicio 1: quita el paréntesis (U3-3C-17, U3-3C-18) ──────────────────────────

export function generarQuita(rng) {
  const signoPar = rng.elegir([1, -1, -1]);
  const n = rng.elegir([2, 2, 3]);
  const dentro = Array.from({ length: n }, (_, i) => ({
    signo: i === 0 ? (rng.azar() < 0.25 ? -1 : 1) : rng.elegir([1, -1]),
    valor: rng.entero(1, 15),
  }));
  // Mejor con los dos signos dentro: si no, no se nota qué cambia.
  if (dentro.every(t => t.signo === dentro[0].signo) && rng.azar() < 0.8) dentro[n - 1].signo = -dentro[0].signo;
  const forma = rng.elegir(['antes', 'antes', 'antes-despues', 'primero']);
  const termino = () => ({ signo: rng.elegir([1, -1]), valor: rng.entero(1, 20) });
  const antes = forma === 'primero' ? [] : [{ signo: rng.azar() < 0.15 ? -1 : 1, valor: rng.entero(1, 20) }];
  const despues = forma === 'antes' ? [] : [termino()];
  const item = { antes, signoPar, dentro, despues };
  item.expr = aTexto(arbolQuita(item));
  return item;
}

export const arbolQuita = item => deLista([...item.antes, { signo: item.signoPar, arbol: par(deLista(item.dentro)) }, ...item.despues]);

/** Los signos que tienen que quedar a los números de dentro. */
export const signosBuenos = item => item.dentro.map(t => t.signo * item.signoPar);

/** La expresión reescrita sin paréntesis con los signos que da el alumno a los números de dentro. */
export const reescritura = (item, signos) => deLista([
  ...item.antes,
  ...item.dentro.map((t, i) => ({ signo: signos[i], valor: t.valor })),
  ...item.despues,
]);

/** null si está bien; si no, el id del error: cambia-con-mas, ignora-el-menos-de-delante, menos-solo-al-primero o signos-a-medias. */
export function errorQuita(item, signos) {
  if (mismos(signos, signosBuenos(item))) return null;
  if (item.signoPar > 0) return 'cambia-con-mas';
  if (mismos(signos, item.dentro.map(t => t.signo))) return 'ignora-el-menos-de-delante';
  if (item.dentro.length > 1 && mismos(signos, item.dentro.map((t, i) => (i === 0 ? -t.signo : t.signo)))) return 'menos-solo-al-primero';
  return 'signos-a-medias';
}

// ─── Ejercicio 2: calcula (U3-3A-04, U3-3C-16) ──────────────────────────────────────

export function generarCalcula(rng) {
  const nTop = rng.elegir([2, 3, 3]);
  const nPar = nTop === 2 ? 1 : rng.elegir([1, 2, 2]);
  const conPar = new Set(rng.barajar([...Array(nTop).keys()]).slice(0, nPar));
  const terminosTop = [];
  for (let i = 0; i < nTop; i++) {
    const signo = i === 0 ? (!conPar.has(0) && rng.azar() < 0.12 ? -1 : 1) : rng.elegir([1, -1]);
    if (!conPar.has(i)) { terminosTop.push({ signo, valor: rng.entero(1, 20) }); continue; }
    const n = rng.elegir([2, 3, 3]);
    const dentro = Array.from({ length: n }, (_, k) => ({ signo: k === 0 ? (rng.azar() < 0.25 ? -1 : 1) : rng.elegir([1, -1]), valor: rng.entero(1, 12) }));
    if (dentro.every(t => t.signo === dentro[0].signo)) dentro[n - 1].signo = -dentro[0].signo;
    while (suma(dentro) === 0) dentro[n - 1].valor++;
    terminosTop.push({ signo, dentro });
  }
  // Casi siempre, un paréntesis precedido de − (el error de la semana).
  const primeroConMenos = terminosTop.findIndex((t, i) => i > 0 && t.dentro);
  if (primeroConMenos > 0 && !terminosTop.some(t => t.dentro && t.signo < 0) && rng.azar() < 0.85) terminosTop[primeroConMenos].signo = -1;
  const arbol = deLista(terminosTop.map(t => ({ signo: t.signo, arbol: t.dentro ? par(deLista(t.dentro)) : num(t.valor) })));
  return { expr: aTexto(arbol) };
}

/** Los términos de primer nivel: números o paréntesis con sus términos (valores sin signo). */
export function descomponer(item) {
  return terminos(analizar(item.expr)).map(t => (t.arbol.tipo === 'par'
    ? { signo: t.signo, par: true, dentro: terminos(t.arbol.arg).map(u => ({ signo: u.signo, valor: u.arbol.valor })) }
    : { signo: t.signo, par: false, valor: t.arbol.valor }));
}

/** Ruta 1: opera lo de dentro de cada paréntesis. 9 − (2 − 7 + 3) + (−2 + 6) → 9 − (−2) + 4. */
export const operandoDentro = item => deLista(descomponer(item).map(t => ({ signo: t.signo, arbol: num(t.par ? suma(t.dentro) : t.valor) })));

/** Ruta 2: quita los paréntesis (+ no cambia los signos, − los cambia todos). */
export const quitandoParentesis = item => deLista(descomponer(item).flatMap(t => (t.par
  ? t.dentro.map(u => ({ signo: u.signo * t.signo, valor: u.valor }))
  : [{ signo: t.signo, valor: t.valor }])));

/** Los resultados que dan los errores típicos de la semana con los números del ítem. */
export function erroresCalcula(item) {
  const d = descomponer(item);
  const total = parteDe => d.reduce((s, t) => s + (t.par ? parteDe(t) : t.signo * t.valor), 0);
  const bien = evaluar(item.expr);
  return sinRepetir([
    // 5 − (2 − 7) = 5 − 2 − 7: el menos solo al primer número de dentro.
    { id: 'menos-solo-al-primero', valor: total(t => (t.signo < 0 ? -t.dentro[0].signo * t.dentro[0].valor + suma(t.dentro.slice(1)) : t.signo * suma(t.dentro))) },
    // 5 − (2 − 7) = 5 + 2 − 7: se olvida del menos de delante.
    { id: 'ignora-el-menos-de-delante', valor: total(t => suma(t.dentro)) },
    // 5 + (2 − 7) = 5 − 2 + 7: cambia los signos aunque delante hay un +.
    { id: 'cambia-con-mas', valor: total(t => (t.signo > 0 ? -suma(t.dentro) : t.signo * suma(t.dentro))) },
    // 5 − (2 − 7) = 5 − (−5) = 5 − 5: resta el negativo como si fuera positivo.
    { id: 'restar-negativo', valor: total(t => (suma(t.dentro) < 0 ? t.signo * -suma(t.dentro) : t.signo * suma(t.dentro))) },
  ], bien);
}

// ─── Ejercicio 3: ¿al paréntesis o al número? (U3-4A-06, U3-4A-03) ──────────────────

const texto = s => aTexto(analizar(s));

function parejaPotencia(rng) {
  const c = rng.entero(1, 12), a = rng.entero(2, 7), b = rng.entero(2, 6), n = rng.elegir([2, 2, 2, 3]);
  const o = rng.elegir(['+', '+', '−']), s = rng.elegir(['+', '−', '−']);
  if (o === '−' && a === b) return null;
  return {
    tipo: 'par-pot',
    exprs: [texto(`${c} ${s} (${a} ${o} ${b})^${n}`), texto(`${c} ${s} (${a} ${o} ${b}^${n})`)],
    meta: { c, a, b, n, o, s },
  };
}

function parejaProducto(rng) {
  const a = rng.entero(2, 6), b = rng.entero(2, 5), n = rng.elegir([2, 2, 3]);
  return { tipo: 'prod-neg', exprs: [texto(`(−${a} · ${b})^${n}`), texto(`−${a} · ${b}^${n}`)], meta: { a, b, n } };
}

function sola(rng) {
  const c = rng.entero(1, 9), k = rng.entero(2, 4), a = rng.entero(1, 9), b = rng.entero(2, 5), d = rng.entero(2, 5);
  const s = rng.elegir(['+', '−']);
  switch (rng.entero(1, 3)) {
    case 1: return { tipo: 'sola', exprs: [texto(`${c} ${s} ${k} · (${a} − ${b}^2)`)], meta: { c, k, a, b } };
    case 2: return a === b ? null : { tipo: 'sola', exprs: [texto(`${c} − (${a} − ${b})^2`)], meta: { c, a, b } };
    default: return { tipo: 'sola', exprs: [texto(`${c} ${s} ${k} · (${a} ${rng.elegir(['+', '−'])} ${b} · ${d})`)], meta: { c, k, a, b, d } };
  }
}

export function generarPotencia(rng) {
  for (let i = 0; i < 300; i++) {
    const r = rng.azar();
    const item = r < 0.45 ? parejaPotencia(rng) : r < 0.75 ? parejaProducto(rng) : sola(rng);
    if (!item || !item.exprs.every(enRango)) continue;
    item.valores = item.exprs.map(evaluar);
    if (item.valores.length === 2 && item.valores[0] === item.valores[1]) continue;
    return item;
  }
  throw new Error('generarPotencia: no sale ningún ítem');
}

/** Los resultados equivocados de la expresión `i` del ítem (el de la otra, si es una pareja, y los errores de jerarquía). */
export function erroresPotencia(item, i) {
  const expr = item.exprs[i];
  const otra = item.exprs.length === 2 ? [{ id: 'confunde-las-dos', valor: item.valores[1 - i] }] : [];
  return sinRepetir([
    ...otra,
    ...['ignora-el-parentesis', 'sin-jerarquia', 'derecha-a-izquierda'].map(id => ({ id, valor: ERRORES_TIPICOS[id].fn(expr) })),
  ], item.valores[i]);
}

// ─── Ejercicio 4: de dentro afuera (U3-4A-07) ───────────────────────────────────────

export function generarCorchetes(rng) {
  const n = () => rng.entero(1, 15);
  const sg = () => rng.elegir([1, -1]);
  const primero = () => (rng.azar() < 0.25 ? -1 : 1);
  const interno = largo => ({ signo: sg(), arbol: par(deLista(Array.from({ length: largo }, (_, k) => ({ signo: k === 0 ? primero() : sg(), valor: n() })))) });
  const corchete = (signo, largo = 2) => ({ signo, arbol: par(deLista([{ signo: primero(), valor: n() }, interno(largo)]), '[') });
  const r = rng.azar();
  const lista = r < 0.25 ? [{ signo: 1, valor: n() }, corchete(sg())]
    : r < 0.45 ? [corchete(1), { signo: sg(), valor: n() }]
    : r < 0.75 ? [corchete(1), corchete(sg())]
    : [{ signo: 1, valor: n() }, corchete(sg(), 3)];
  const arbol = deLista(lista);
  if (!enRango(arbol)) return generarCorchetes(rng);
  return { expr: aTexto(arbol) };
}

const contienePar = n => {
  switch (n.tipo) {
    case 'par': return true;
    case 'neg': case 'pos': return contienePar(n.arg);
    case 'pot': return contienePar(n.base);
    case 'op': return contienePar(n.izq) || contienePar(n.der);
    default: return false;
  }
};

/** Las rutas de los paréntesis o corchetes que ya se pueden calcular: los que no tienen otro dentro. */
export function internos(x) {
  const salida = [];
  (function ver(n, ruta) {
    switch (n.tipo) {
      case 'par': if (contienePar(n.arg)) ver(n.arg, hijo(ruta, 'arg')); else salida.push(ruta); break;
      case 'neg': case 'pos': ver(n.arg, hijo(ruta, 'arg')); break;
      case 'pot': ver(n.base, hijo(ruta, 'base')); break;
      case 'op': ver(n.izq, hijo(ruta, 'izq')); ver(n.der, hijo(ruta, 'der')); break;
      default: break;
    }
  }(analizar(x), ''));
  return salida;
}

/** Las rutas de todos los paréntesis y corchetes que quedan por calcular. */
export function pendientes(x) {
  const salida = [];
  (function ver(n, ruta) {
    switch (n.tipo) {
      case 'par': salida.push(ruta); ver(n.arg, hijo(ruta, 'arg')); break;
      case 'neg': case 'pos': ver(n.arg, hijo(ruta, 'arg')); break;
      case 'pot': ver(n.base, hijo(ruta, 'base')); break;
      case 'op': ver(n.izq, hijo(ruta, 'izq')); ver(n.der, hijo(ruta, 'der')); break;
      default: break;
    }
  }(analizar(x), ''));
  return salida;
}

/** Lo que vale el paréntesis o corchete de `ruta`. */
export const valorEn = (x, ruta) => evaluar(nodoEn(x, ruta).arg);

/** El árbol con ese paréntesis ya calculado: queda un número (puede ser negativo). */
export const calculado = (x, ruta, valor) => reemplazar(x, ruta, num(valor));

/** Los resultados equivocados de un paréntesis cuando se calcula mal (errores de las sumas y restas). */
export function erroresDe(x, ruta) {
  const dentro = nodoEn(x, ruta).arg;
  const bien = evaluar(dentro);
  const ts = terminos(dentro).map(t => ({ signo: t.signo, valor: evaluar(t.arbol) }));
  const valor = ts.reduce((s, t) => s + t.signo * t.valor, 0);
  return sinRepetir([
    { id: 'derecha-a-izquierda', valor: ERRORES_TIPICOS['derecha-a-izquierda'].fn(dentro) },
    { id: 'olvida-el-signo', valor: ERRORES_TIPICOS['olvida-el-signo'].fn(valor, 0) },
    { id: 'suma-valores-absolutos', valor: ts.length === 2 ? ERRORES_TIPICOS['suma-valores-absolutos'].fn(ts[0].signo * ts[0].valor, ts[1].signo * ts[1].valor) : null },
    { id: 'signo-cambiado', valor: -valor },
  ], bien);
}

/** Los resultados equivocados del último paso, cuando ya no quedan paréntesis (se opera de derecha a izquierda o se cambia el signo). */
export function erroresResto(x) {
  const bien = evaluar(x);
  return sinRepetir([
    { id: 'derecha-a-izquierda', valor: ERRORES_TIPICOS['derecha-a-izquierda'].fn(x) },
    { id: 'signo-cambiado', valor: -bien },
  ], bien);
}

// ─── Ejercicio 5: coloca los paréntesis (U3-4A-04) ──────────────────────────────────

const SIMBOLO = { '+': '+', '−': '−', '·': '·' };

/** El texto de la expresión con un par de paréntesis desde el número `abre` hasta el número `cierra` (o sin ellos). */
export function textoColocado(item, abre = -1, cierra = -1) {
  return item.numeros.map((v, k) => {
    const s = `${k === abre ? '(' : ''}${v < 0 ? `−${-v}` : v}${k === cierra ? ')' : ''}`;
    return k < item.ops.length ? `${s} ${SIMBOLO[item.ops[k]]}` : s;
  }).join(' ');
}

/** Todas las colocaciones de un par de paréntesis sobre dos o más números seguidos (no sobre todos): [{ abre, cierra, texto, valor }]. */
export function colocaciones(item) {
  const n = item.numeros.length;
  const lista = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      const t = textoColocado(item, i, j);
      lista.push({ abre: i, cierra: j, texto: t, valor: evaluar(t) });
    }
  }
  return lista;
}

export function generarColocar(rng) {
  for (let i = 0; i < 400; i++) {
    const n = rng.elegir([3, 3, 4, 4, 4]);
    const numeros = Array.from({ length: n }, () => rng.entero(2, 9));
    if (rng.azar() < 0.2) numeros[0] = -numeros[0];
    const ops = Array.from({ length: n - 1 }, () => rng.elegir(['+', '−', '·']));
    if (!ops.includes('·') || ops.every(o => o === '·')) continue;
    const item = { numeros, ops };
    item.expr = textoColocado(item);
    const todas = colocaciones(item);
    if (![item.expr, ...todas.map(c => c.texto)].every(enRango)) continue;
    const sin = evaluar(item.expr);
    const posibles = [...new Set(todas.map(c => c.valor))].filter(v => v !== sin);
    if (!posibles.length) continue;
    item.objetivo = rng.elegir(posibles);
    return item;
  }
  throw new Error('generarColocar: no sale ningún ítem');
}

/** Las colocaciones que dan el resultado pedido (vale cualquiera). */
export const buenas = item => colocaciones(item).filter(c => c.valor === item.objetivo);

// ─── El generador de cada ejercicio ─────────────────────────────────────────────────

const GENERADORES = [generarQuita, generarCalcula, generarPotencia, generarCorchetes, generarColocar];

/** Ítem del ejercicio `n` (1 a 5). */
export const generar = (n, rng) => GENERADORES[n - 1](rng);
