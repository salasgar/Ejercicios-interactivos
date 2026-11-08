// Práctica «Caza el error» de la unidad 5, Decimals (PU2, tarea 128): lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS (JSON): la base vuelve a montar el mismo ítem al cambiar de idioma,
// así que las líneas del cálculo se guardan como SEGMENTOS y se escriben al pintar, con coma o punto
// según el idioma:
//   'texto'        tal cual (operadores, cifras sueltas)
//   { d: '2,50' }  un decimal, escrito con las cifras que tiene (2,50 no se normaliza)
//   { f: [3, 4] }  una fracción con raya
//   { p: [1, 3] }  su decimal periódico con puntos suspensivos (0,333…)
//   { t: {es,en} } una palabra o frase
//
// Cada plantilla es UN error típico de `ERRORES_TIPICOS` (decimales.js) con sus números. Da una
// cadena de TRES líneas: la 1 es el enunciado y nunca está mal; la 2 o la 3 es la mala. Las líneas
// de después de la mala siguen de ella (el compañero no vuelve a equivocarse). Sin error, las tres
// están bien, y alguna veces el resultado lleva ceros al final (3,50): no es un error (`NO_ES_ERROR`).
//
// Ítem: { tipo: 'donde' | 'que' | 'corrige', plantilla, params, lineas, falsa (0-2 o null), error, ... }.

import {
  decimal, deTexto, aTexto, sumar, restar, multiplicar, dividir, porPotenciaDe10, redondear, truncar,
  mismoValor, comparar, deFraccion, aTextoPeriodico, ERRORES_TIPICOS, MENOS,
} from '../_comun/decimales.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';

const E = ERRORES_TIPICOS;
const D = deTexto;
const tx = d => aTexto(d, 'es');
const pot10 = n => 10 ** n;
const sd = d => ({ d: tx(d) });
const sf = (n, d) => ({ f: [n, d] });
const st = (es, en) => ({ t: { es, en } });

// ─── Casos que no se pueden repetir (regla de oro de contenido, punto 9) ──────
// Los alumnos ya tienen en papel la hoja de la semana (en claro) y tendrán el examen (por huella).

const huella = s => {
  let h = 0x811c9dc5;
  for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
};
const norm = x => tx(D(String(x)).normalizar());
/** Clave de un caso: el tipo de cálculo y sus operandos sin ceros finales (los sumandos y los factores no importan en qué orden). */
export const claveCaso = (tipo, ops, conmuta = false) => {
  const o = ops.map(norm);
  return `${tipo}|${(conmuta ? o.sort() : o).join('|')}`;
};

const HOJA = new Set([
  // Sumas y restas (hoja 1: sesión 3 y estimar; hoja 2: repaso)
  ...[['4,7', '3,25'], ['12,6', '0,84'], ['8,6', '2,75'], ['3,6', '1,25'], ['2,5', '0,4'], ['14,6', '8,3'], ['5,6', '12,9'], ['6,7', '2,85']]
    .map(c => claveCaso('suma+', c, true)),
  ...[['9,05', '3,8'], ['15,2', '7,64'], ['8', '0,46'], ['20', '7,35'], ['31,2', '9,8'], ['13,8', '6,1'], ['12', '4,37'], ['0,9', '0,36']]
    .map(c => claveCaso('suma−', c)),
  // Productos
  ...[['3,4', '6'], ['0,15', '7'], ['2,6', '0,3'], ['1,25', '0,8'], ['0,07', '0,4'], ['4,3', '2,1'], ['0,6', '0,7'], ['3,9', '2,1'], ['2,5', '0,4'], ['0,5', '0,8'], ['2,4', '1,5']]
    .map(c => claveCaso('producto', c, true)),
  // ×10, ×100, ×1000 (el decimal y el exponente)
  ...[['6,82', 1], ['0,072', 2], ['1,6', 3], ['23,8', 2], ['0,58', 1], ['5,3', 2], ['3,4', 1]].map(c => claveCaso('por10', c)),
  // Divisiones (dividendo y divisor)
  ...[['7,5', '5'], ['0,84', '7'], ['21,6', '8'], ['0,045', '5'], ['3,6', '0,4'], ['1,5', '0,25'], ['7', '0,05'], ['2,04', '0,6'], ['0,3', '0,012'], ['4,8', '0,12'],
    ['14,9', '3'], ['8,15', '0,7'], ['2,53', '0,06'], ['3,1', '0,6'], ['2,7', '0,09'], ['9,6', '3'], ['11', '4'], ['17', '5'], ['21', '8'], ['23', '6'], ['6,3', '0,9'], ['9', '2']]
    .map(c => claveCaso('division', c)),
  // Fracciones (numerador y denominador)
  ...[['1', '4'], ['4', '9'], ['9', '40'], ['5', '3'], ['3', '4']].map(c => claveCaso('fraccion', c)),
  // Redondeos (el número que se redondea, sea cual sea el orden)
  ...['4,726', '9,153', '12,849', '5,97', '0,996', '6,349', '5,847', '4,98', '7,354', '15,996'].map(s => claveCaso('redondeo', [s])),
  // Comparaciones (la pareja, en cualquier orden)
  ...[['9,3', '9,25'], ['0,6', '0,59'], ['5,6', '5,6'], ['3,04', '3,4'], ['0,37', '0,4'], ['12,09', '12,1'], ['8,62', '8,602'], ['4,12', '4,7'], ['8,7', '8,12'],
    ['2,08', '2,8'], ['0,509', '0,51'], ['5,8', '5,79'], ['5,8', '5,093'], ['5,8', '5,791'], ['5,79', '5,791']].map(c => claveCaso('compara', c, true)),
]);

/** Huellas (FNV-1a de `claveCaso`) de los casos de los exámenes 1 y 2 y del final de la unidad 5. */
export const HUELLAS_EXAMEN = new Set(["1qm50tk","47nn6w","e2i56g","qk3wj4","znke80","2zrvpe","13sbsxw","1h4baqg","pgzn7","1wjpzkz","cqm24p","1l1rqhw","4nzf4x","6e3i1q","1vaece3","a1qjzo","b77gnn","1df64ac","11iulqa","1tq2npa","2g901g","pfenks","em9bow","585ysb","1t3wp7s","1ixktzy","xegl6t","1jhrt1k","1hgygf8","1pujpfe","1cp7rhi","lumgtk","idsxrv","2v0uv8","1vuehdb","19irqnf","qyrnm7","195esx3","14re1uc","1dk1l4g","1b7jvh0","1af7slm","78w26i","en8xun","1dgp45q","vtolxo","1k1cbtl","sjrip2","11l6qjd","fn3asl","ypqvci","9ptbwe","1l3e8xb","yf0scm","sfybs6","ei817d","zt7y9v","iqexj7","bfwm1","6ggiro","pewuzb","16bmj58","1hi5bra","14edfet","m6lagw","1w56vl2","1ni210","1qgq9id","et3hy5","p2e0df","1tr864i","1oazo6z","1gb3835","12a2dg7","diqp60","14lseex","rgusbf","zaex84","1q8joh6","pjx5tb","iqoiui","1cv3bd8","1d5cheg","96105a","rqsivq","sr3gfv","glawqr","1k0wj6y","1c0329x","ouaq24","p5j6co","1its2ud","1y1m6sf","14111yf","xqvymu","1f4y1nd","nfuoy5","w2xc6k","w0wn9i","1oz9r88","1nqzmls","qcpre1","pr65ud","14zpxty","pzk9at","1av3ftf","amqbi6","e7lezx","k3ymzv","1yco5j8","1aacpme","ox37vw","1vdqnkc","eqakds","1gkqofa","1mn32ep","1qsu5ba","gwida","l1wdyf","1ehjcc6","6ghjsh","1vzyg1p","262ol2","1civpx","10f67xs","1xs7pp2","uqjjcj","1l8qbsy","nvitwk","1db21eb","1xhi5s","nqa16z","fvyipr","1i0uoio","1fgd7xi","lsn636","124a1me","7vay9s","125nnzx","fymzzc","1fsjqo0","149s6ok","18f52gy","uwz70","v0hg2w","1fon1pp"]);
export { huella, HOJA };

const prohibida = clave => HOJA.has(clave) || HUELLAS_EXAMEN.has(huella(clave));
const prohibido = (plantilla, params) => prohibida(plantilla.caso(params)) || (plantilla.casoPrimera && prohibida(plantilla.casoPrimera(params)));

// ─── Ayudas para los números ───────────────────────────────────────────────────

/** Decimal de `k` cifras con la parte entera en [lo, hi] y la última cifra distinta de 0. */
function dec(rng, k, lo, hi) {
  for (let i = 0; i < 50; i++) {
    const m = rng.entero(Math.round(lo * pot10(k)), Math.round(hi * pot10(k)));
    if (k === 0 || m % 10 !== 0) return decimal(m, k);
  }
  return decimal(Math.round(lo * pot10(k)) + 1, k);
}
const mEntre = (rng, k, lo, hi) => {
  for (let i = 0; i < 50; i++) { const m = rng.entero(lo, hi); if (m % 10 !== 0) return decimal(m, k); }
  return decimal(lo + 1, k);
};
/** ¿Termina en cero la escritura (3,50)? */
const conCerosFinales = d => d.k > 0 && d.m % 10 === 0;
const digitoSiguiente = (s, c) => Math.floor(Math.abs(s.m) / pot10(s.k - c - 1)) % 10;
const cmpTexto = rel => (rel < 0 ? '<' : rel > 0 ? '>' : '=');

// ─── Plantillas ────────────────────────────────────────────────────────────────
// Cada una: id (= error), clase (a qué cálculo se aplica), tipo (para `claveCaso`), `corrige` (¿el resultado
// bueno se puede teclear?), `params(rng)`, `caso(p)`, `cadena(p, mal)` → { lineas, falsa },
// `bien(p)` (Decimal) y `malFinal(p)` (la última línea mala), `valorError(p)` (lo que da la función
// del error, para comprobar qué nombres NO explican el resultado), `args(id, p)` y `porque(p, idioma)`.

export const PLANTILLAS = [];
const nueva = p => { PLANTILLAS.push(p); return p; };

// — Sumar o restar alineando a la derecha —
nueva({
  id: 'alinea-a-la-derecha', clase: 'suma', tipo: 'suma', corrige: true,
  params(rng) {
    const [ka, kb] = rng.elegir([[1, 2], [2, 1], [0, 2], [2, 0]]);
    let a = ka === 0 ? decimal(rng.entero(2, 30), 0) : mEntre(rng, ka, ka === 1 ? 12 : 105, ka === 1 ? 99 : 399);
    let b = kb === 0 ? decimal(rng.entero(2, 30), 0) : mEntre(rng, kb, kb === 1 ? 12 : 105, kb === 1 ? 99 : 399);
    const op = rng.elegir(['+', MENOS]);
    if (op === MENOS && a.valor() < b.valor()) [a, b] = [b, a];
    const mal = E['alinea-a-la-derecha'].fn(a, b, op);
    return mal && mal.m > 0 ? [tx(a), tx(b), op] : null;
  },
  caso: p => claveCaso(`suma${p[2] === '+' ? '+' : '−'}`, [p[0], p[1]], p[2] === '+'),
  cadena(p, mal) {
    const [a, b, op] = [D(p[0]), D(p[1]), p[2]];
    const k = Math.max(a.k, b.k);
    const l1 = [sd(a), ` ${op} `, sd(b)];
    if (!mal) return { lineas: [l1, ['= ', sd(a.conCifras(k)), ` ${op} `, sd(b.conCifras(k))], ['= ', sd(this.bien(p))]], falsa: null };
    return { lineas: [l1, ['= ', `${a.m} ${op} ${b.m}`], ['= ', sd(this.malFinal(p))]], falsa: 1 };
  },
  bien: p => (p[2] === '+' ? sumar(p[0], p[1]) : restar(p[0], p[1])),
  malFinal: p => E['alinea-a-la-derecha'].fn(D(p[0]), D(p[1]), p[2]),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1]), p[2]]],
  porque(p, i) {
    const [a, b, op] = [D(p[0]), D(p[1]), p[2]], k = Math.max(a.k, b.k), T = x => aTexto(x, i);
    const pa = T(a.conCifras(k)), pb = T(b.conCifras(k));
    return i === 'en'
      ? `${T(a)} ${op} ${T(b)}: the decimal points go one under the other and the gaps are filled with zeros: ${pa} ${op} ${pb} = ${T(this.bien(p))}. Adding ${a.m} and ${b.m} without looking at the points gives another number.`
      : `${T(a)} ${op} ${T(b)}: las comas van una debajo de otra y los huecos se rellenan con ceros: ${pa} ${op} ${pb} = ${T(this.bien(p))}. Operar ${a.m} y ${b.m} sin mirar las comas da otro número.`;
  },
});

// — La coma del producto —
nueva({
  id: 'coma-mal-puesta', clase: 'producto', tipo: 'producto', corrige: true,
  params(rng) {
    const [ka, kb] = rng.elegir([[1, 1], [1, 2], [2, 1]]);
    const a = ka === 1 ? mEntre(rng, 1, 12, 99) : mEntre(rng, 2, 105, 399);
    const b = kb === 1 ? mEntre(rng, 1, 2, 9) : mEntre(rng, 2, 11, 99);
    return E['coma-mal-puesta'].fn(a, b) ? [tx(a), tx(b), rng.entero(0, 1)] : null;
  },
  caso: p => claveCaso('producto', [p[0], p[1]], true),
  cadena(p, mal) {
    const [a, b] = [D(p[0]), D(p[1])];
    const l1 = [sd(a), ' · ', sd(b)], l2 = ['= ', `${a.m} · ${b.m} = ${a.m * b.m}`];
    if (!mal) return { lineas: [l1, l2, ['= ', sd(p[2] ? this.bien(p).normalizar() : this.bien(p))]], falsa: null };
    return { lineas: [l1, l2, ['= ', sd(this.malFinal(p))]], falsa: 2 };
  },
  bien: p => multiplicar(p[0], p[1]),
  malFinal: p => E['coma-mal-puesta'].fn(D(p[0]), D(p[1])).normalizar(),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1])]],
  porque(p, i) {
    const [a, b] = [D(p[0]), D(p[1])], T = x => aTexto(x, i);
    return i === 'en'
      ? `${T(a)} · ${T(b)}: multiply as whole numbers (${a.m} · ${b.m} = ${a.m * b.m}). The product has as many decimal places as the two factors together: ${a.k} + ${b.k} = ${a.k + b.k}. So it is ${T(this.bien(p))}.`
      : `${T(a)} · ${T(b)}: se multiplica como si fueran enteros (${a.m} · ${b.m} = ${a.m * b.m}). El producto lleva tantas cifras decimales como los dos factores juntos: ${a.k} + ${b.k} = ${a.k + b.k}. Sale ${T(this.bien(p))}.`;
  },
});

// — Multiplicar por 10, 100 o 1000 añadiendo ceros —
nueva({
  id: 'por-diez-anadiendo-cero', clase: 'por10', tipo: 'por10', corrige: true,
  params(rng) {
    const k = rng.elegir([1, 2]);
    const d = k === 1 ? mEntre(rng, 1, 12, 99) : mEntre(rng, 2, 11, 99);
    const n = rng.entero(1, 3);
    return [tx(d), n, rng.entero(2, 9)];
  },
  caso: p => claveCaso('por10', [p[0], p[1]]),
  cadena(p, mal) {
    const [d, n, c] = [D(p[0]), p[1], p[2]];
    const l1 = [sd(d), ` · ${pot10(n)} + ${c}`];
    if (!mal) { const x = porPotenciaDe10(d, n); return { lineas: [l1, ['= ', sd(x), ` + ${c}`], ['= ', sd(sumar(x, c))]], falsa: null }; }
    const x = E['por-diez-anadiendo-cero'].fn(d, n);
    return { lineas: [l1, ['= ', sd(x), ` + ${c}`], ['= ', sd(sumar(x, c))]], falsa: 1 };
  },
  bien: p => sumar(porPotenciaDe10(D(p[0]), p[1]), p[2]),
  malFinal: p => sumar(E['por-diez-anadiendo-cero'].fn(D(p[0]), p[1]), p[2]),
  valorError: p => E['por-diez-anadiendo-cero'].fn(D(p[0]), p[1]),
  args: (id, p) => [[D(p[0]), p[1]]],
  porque(p, i) {
    const [d, n] = [D(p[0]), p[1]], T = x => aTexto(x, i);
    const x = porPotenciaDe10(d, n);
    return i === 'en'
      ? `${T(d)} · ${pot10(n)}: the decimal point moves ${n} place${n > 1 ? 's' : ''} to the right, so it is ${T(x)}. Adding a zero (${T(this.valorError(p))}) does not change the number. The total is ${T(this.bien(p))}.`
      : `${T(d)} · ${pot10(n)}: la coma se mueve ${n} lugar${n > 1 ? 'es' : ''} a la derecha y sale ${T(x)}. Añadir un cero (${T(this.valorError(p))}) no cambia el número. El total es ${T(this.bien(p))}.`;
  },
});

// — Redondear cortando y redondear en cadena —
const ORDEN = { 0: st('a la unidad', 'to the nearest whole number'), 1: st('a la décima', 'to one decimal place'), 2: st('a la centésima', 'to two decimal places') };
function redondeo(id) {
  return nueva({
    id, clase: 'redondeo', tipo: 'redondeo', corrige: true,
    params(rng) {
      const c = rng.entero(0, 2);
      const ks = id === 'redondea-en-cadena' ? c + 2 : rng.elegir([c + 1, c + 2]);
      const s = mEntre(rng, ks, 2 * pot10(ks), 19 * pot10(ks));
      if (E[id].fn(s, c) === null) return null;
      const a = decimal(rng.entero(1, Math.floor(s.valor() * 10) - 1), 1);
      if (a.m % 10 === 0) return null;
      const b = restar(s, a);
      return b.m > 0 && b.m % 10 !== 0 ? [tx(a), tx(b), c] : null;
    },
    caso: p => claveCaso('redondeo', [tx(sumar(p[0], p[1]))]),
    casoPrimera: p => claveCaso('suma+', [p[0], p[1]], true),
    cadena(p, mal) {
      const [a, b, c] = [D(p[0]), D(p[1]), p[2]], s = sumar(a, b);
      const l3 = r => ['≈ ', sd(r), ' (', ORDEN[c], ')'];
      return { lineas: [[sd(a), ' + ', sd(b)], ['= ', sd(s)], l3(mal ? this.malFinal(p) : this.bien(p))], falsa: mal ? 2 : null };
    },
    bien: p => redondear(sumar(p[0], p[1]), p[2]),
    malFinal: p => E[id].fn(sumar(p[0], p[1]), p[2]),
    valorError(p) { return this.malFinal(p); },
    args: (idx, p) => [[sumar(p[0], p[1]), p[2]]],
    cifras: p => p[2],
    porque(p, i) {
      const s = sumar(p[0], p[1]), c = p[2], T = x => aTexto(x, i), r = this.bien(p);
      const orden = ORDEN[c].t[i];
      if (id === 'redondea-truncando') {
        return i === 'en'
          ? `${T(s)} ${orden}: look at the next digit (${digitoSiguiente(s, c)}); if it is 5 or more, the last digit goes up. So it is ${T(r)}, not ${T(this.malFinal(p))}: cutting is not rounding.`
          : `${T(s)} ${orden}: se mira la cifra siguiente (${digitoSiguiente(s, c)}); si es 5 o más, la última sube. Sale ${T(r)}, no ${T(this.malFinal(p))}: cortar no es redondear.`;
      }
      const pasos = [T(s)];
      for (let k = s.k - 1; k >= c; k--) pasos.push(T(redondear(s, k)));
      return i === 'en'
        ? `${T(s)} ${orden}: round only once, from the original number, looking at the next digit (${digitoSiguiente(s, c)}): ${T(r)}. Rounding digit by digit (${pasos.join(' → ')}) gives ${T(this.malFinal(p))}.`
        : `${T(s)} ${orden}: se redondea una sola vez, desde el número original, mirando solo la cifra siguiente (${digitoSiguiente(s, c)}): ${T(r)}. Redondear cifra a cifra (${pasos.join(' → ')}) da ${T(this.malFinal(p))}.`;
    },
  });
}
redondeo('redondea-truncando');
redondeo('redondea-en-cadena');

// — Dividir: la coma del cociente, la coma solo en el divisor y el resto de la original —
nueva({
  id: 'olvida-coma-cociente', clase: 'division', tipo: 'division', corrige: true,
  params(rng) {
    const q = rng.elegir([1, 2]) === 1 ? mEntre(rng, 1, 11, 99) : mEntre(rng, 2, 101, 299);
    const b = rng.entero(2, 9);
    const a = multiplicar(q, b);
    return a.m % 10 === 0 || a.k !== q.k ? null : [tx(a), String(b)];
  },
  caso: p => claveCaso('division', [p[0], p[1]]),
  cadena(p, mal) {
    const [a, b] = [D(p[0]), D(p[1])], q = this.bien(p);
    const l1 = [sd(a), ' : ', sd(b)], l2 = ['= ', `${a.m} : ${b.m} = ${q.m}`];
    return { lineas: [l1, l2, ['= ', mal ? `${q.m}` : sd(q)]], falsa: mal ? 2 : null };
  },
  bien: p => dividir(p[0], p[1]).cociente,
  malFinal: p => E['olvida-coma-cociente'].fn(D(p[0]), D(p[1])),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1]), id === 'resto-sin-deshacer' ? 2 : null]],
  porque(p, i) {
    const [a, b] = [D(p[0]), D(p[1])], q = this.bien(p), T = x => aTexto(x, i);
    return i === 'en'
      ? `${T(a)} : ${T(b)}: divide as if there were no point (${a.m} : ${b.m} = ${q.m}); the point goes in the quotient when you bring down the first decimal digit. The quotient is ${T(q)}.`
      : `${T(a)} : ${T(b)}: se divide como si no hubiera coma (${a.m} : ${b.m} = ${q.m}); la coma va en el cociente al bajar la primera cifra decimal. El cociente es ${T(q)}.`;
  },
});

nueva({
  id: 'coma-solo-en-divisor', clase: 'division', tipo: 'division', corrige: true,
  params(rng) {
    const kb = rng.elegir([1, 2]);
    const b = kb === 1 ? mEntre(rng, 1, 12, 99) : mEntre(rng, 2, 11, 99);
    const q = rng.entero(2, 9), a = multiplicar(b, q);
    return a.m % 10 === 0 || !E['coma-solo-en-divisor'].fn(a, b) ? null : [tx(a), tx(b)];
  },
  caso: p => claveCaso('division', [p[0], p[1]]),
  cadena(p, mal) {
    const [a, b] = [D(p[0]), D(p[1])], l1 = [sd(a), ' : ', sd(b)];
    if (!mal) return { lineas: [l1, ['= ', sd(porPotenciaDe10(a, b.k)), ` : ${b.m}`], ['= ', sd(this.bien(p))]], falsa: null };
    return { lineas: [l1, ['= ', sd(a), ` : ${b.m}`], ['= ', sd(this.malFinal(p))]], falsa: 1 };
  },
  bien: p => dividir(p[0], p[1]).cociente,
  malFinal: p => E['coma-solo-en-divisor'].fn(D(p[0]), D(p[1])),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1]), id === 'resto-sin-deshacer' ? 2 : null]],
  porque(p, i) {
    const [a, b] = [D(p[0]), D(p[1])], q = this.bien(p), T = x => aTexto(x, i);
    return i === 'en'
      ? `${T(a)} : ${T(b)}: the point moves in the dividend and in the divisor, the same number of places: ${T(porPotenciaDe10(a, b.k))} : ${b.m} = ${T(q)}. Moving it only in the divisor gives ${T(this.malFinal(p))}.`
      : `${T(a)} : ${T(b)}: la coma se mueve en el dividendo y en el divisor, el mismo número de lugares: ${T(porPotenciaDe10(a, b.k))} : ${b.m} = ${T(q)}. Moverla solo en el divisor da ${T(this.malFinal(p))}.`;
  },
});

nueva({
  id: 'resto-sin-deshacer', clase: 'division', tipo: 'division', corrige: true,
  params(rng) {
    const kb = rng.elegir([1, 2]);
    const b = kb === 1 ? mEntre(rng, 1, 2, 9) : mEntre(rng, 2, 11, 99);
    const ka = rng.elegir([2, 3]);
    const a = ka === 2 ? mEntre(rng, 2, 110, 999) : mEntre(rng, 3, 1100, 9999);
    const { resto } = dividir(a, b, 2);
    return !resto.esCero() && E['resto-sin-deshacer'].fn(a, b, 2) ? [tx(a), tx(b)] : null;
  },
  caso: p => claveCaso('division', [p[0], p[1]]),
  cadena(p, mal) {
    const [a, b] = [D(p[0]), D(p[1])];
    const a2 = porPotenciaDe10(a, b.k), b2 = decimal(b.m, 0), { cociente, resto } = dividir(a2, b2, 2);
    return {
      lineas: [
        [sd(a), ' : ', sd(b), ' ', st('(cociente con dos decimales)', '(quotient with two decimal places)')],
        ['= ', sd(a2), ' : ', sd(b2), ' = ', sd(cociente), ', ', st('resto', 'remainder'), ' ', sd(resto)],
        [st('Resto de la división original: ', 'Remainder of the original division: '), sd(mal ? this.malFinal(p) : this.bien(p))],
      ],
      falsa: mal ? 2 : null,
    };
  },
  bien: p => dividir(p[0], p[1], 2).resto,
  malFinal: p => E['resto-sin-deshacer'].fn(D(p[0]), D(p[1]), 2),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1]), 2]],
  porque(p, i) {
    const [a, b] = [D(p[0]), D(p[1])], T = x => aTexto(x, i);
    const a2 = porPotenciaDe10(a, b.k), b2 = decimal(b.m, 0), { cociente, resto: r2 } = dividir(a2, b2, 2), resto = this.bien(p);
    return i === 'en'
      ? `${T(a)} : ${T(b)}: we did ${T(a2)} : ${b.m}, so the remainder was multiplied by ${pot10(b.k)}. The remainder of the original division is ${T(r2)} : ${pot10(b.k)} = ${T(resto)}. Proof: ${T(b)} · ${T(cociente)} + ${T(resto)} = ${T(a)}.`
      : `${T(a)} : ${T(b)}: se hizo ${T(a2)} : ${b.m}, así que el resto quedó multiplicado por ${pot10(b.k)}. El resto de la original es ${T(r2)} : ${pot10(b.k)} = ${T(resto)}. Prueba: ${T(b)} · ${T(cociente)} + ${T(resto)} = ${T(a)}.`;
  },
});

// — De fracción a decimal —
nueva({
  id: 'fraccion-al-reves', clase: 'fraccion', tipo: 'fraccion', corrige: true,
  params(rng) {
    const d = rng.elegir([2, 4, 5, 8, 10, 20, 25]), n = rng.entero(1, 2 * d - 1);
    const f = fraccion(n, d);
    return f.esIrreducible() && deFraccion(f) && E['fraccion-al-reves'].fn(f) ? [f.num, f.den] : null;
  },
  caso: p => claveCaso('fraccion', [p[0], p[1]]),
  cadena(p, mal) {
    const [n, d] = p, l1 = [sf(n, d)];
    return mal
      ? { lineas: [l1, ['= ', `${d} : ${n}`], ['= ', sd(this.malFinal(p))]], falsa: 1 }
      : { lineas: [l1, ['= ', `${n} : ${d}`], ['= ', sd(this.bien(p))]], falsa: null };
  },
  bien: p => deFraccion(fraccion(p[0], p[1])),
  malFinal: p => E['fraccion-al-reves'].fn(fraccion(p[0], p[1])).normalizar(),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[fraccion(p[0], p[1])]],
  porque(p, i) {
    const [n, d] = p, T = x => aTexto(x, i);
    return i === 'en'
      ? `${htmlFraccion(fraccion(n, d))} means ${n} : ${d}, the numerator divided by the denominator: ${T(this.bien(p))}. Dividing ${d} : ${n} gives ${T(this.malFinal(p))}.`
      : `${htmlFraccion(fraccion(n, d))} significa ${n} : ${d}, el numerador entre el denominador: ${T(this.bien(p))}. Dividir ${d} : ${n} da ${T(this.malFinal(p))}.`;
  },
});

nueva({
  id: 'periodico-por-redondeo', clase: 'fraccion', tipo: 'fraccion', corrige: false,
  params(rng) {
    const d = rng.elegir([3, 6, 9]), n = rng.entero(1, d - 1);
    const f = fraccion(n, d);
    return f.esIrreducible() && deFraccion(f) === null ? [f.num, f.den] : null;
  },
  caso: p => claveCaso('fraccion', [p[0], p[1]]),
  cadena(p, mal) {
    const [n, d] = p;
    return { lineas: [[sf(n, d)], ['= ', `${n} : ${d}`], ['= ', mal ? sd(this.malFinal(p)) : { p: [n, d] }]], falsa: mal ? 2 : null };
  },
  bien: () => null,
  malFinal: p => E['periodico-por-redondeo'].fn(fraccion(p[0], p[1])),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[fraccion(p[0], p[1])]],
  porque(p, i) {
    const [n, d] = p, T = x => aTexto(x, i), f = fraccion(n, d);
    return i === 'en'
      ? `${htmlFraccion(f)} = ${aTextoPeriodico(f, i)}: the digits keep repeating forever. ${T(this.malFinal(p))} is only the rounded number, not the same number.`
      : `${htmlFraccion(f)} = ${aTextoPeriodico(f, i)}: las cifras se repiten siempre. ${T(this.malFinal(p))} es solo el número redondeado, no el mismo número.`;
  },
});

// — Comparar —
nueva({
  id: 'compara-por-cifras', clase: 'comparacion', tipo: 'compara', corrige: false,
  params(rng) {
    const e = rng.entero(0, 9), k1 = rng.elegir([1, 2]), k2 = k1 + rng.entero(1, 2);
    const a = decimal(e * pot10(k1) + rng.entero(2, pot10(k1) - 1), k1), b = decimal(e * pot10(k2) + rng.entero(pot10(k2 - 1), pot10(k2) - 1), k2);
    if (a.m % 10 === 0 || b.m % 10 === 0 || !E['compara-por-cifras'].fn(a, b)) return null;
    return rng.azar() < 0.5 ? [tx(a), tx(b)] : [tx(b), tx(a)];
  },
  caso: p => claveCaso('compara', [p[0], p[1]], true),
  cadena(p, mal) {
    const [a, b] = [D(p[0]), D(p[1])], k = Math.max(a.k, b.k);
    const rel = mal ? this.malFinal(p) : this.bien(p);
    return { lineas: [[sd(a), st(' y ', ' and '), sd(b)], ['= ', sd(a.conCifras(k)), st(' y ', ' and '), sd(b.conCifras(k))], ['= ', sd(a), ` ${cmpTexto(rel)} `, sd(b)]], falsa: mal ? 2 : null };
  },
  bien: p => comparar(D(p[0]), D(p[1])),
  malFinal: p => E['compara-por-cifras'].fn(D(p[0]), D(p[1])),
  valorError(p) { return this.malFinal(p); },
  args: (id, p) => [[D(p[0]), D(p[1])]],
  porque(p, i) {
    const [a, b] = [D(p[0]), D(p[1])], k = Math.max(a.k, b.k), T = x => aTexto(x, i), r = cmpTexto(this.bien(p));
    return i === 'en'
      ? `${T(a)} and ${T(b)}: with the same number of decimal places, ${T(a.conCifras(k))} ${r} ${T(b.conCifras(k))}, so ${T(a)} ${r} ${T(b)}. The decimal parts are not compared as whole numbers (${a.m % pot10(a.k)} and ${b.m % pot10(b.k)}).`
      : `${T(a)} y ${T(b)}: con las mismas cifras decimales, ${T(a.conCifras(k))} ${r} ${T(b.conCifras(k))}, luego ${T(a)} ${r} ${T(b)}. No se comparan las partes decimales como números enteros (${a.m % pot10(a.k)} y ${b.m % pot10(b.k)}).`;
  },
});

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));
/** Los errores que se pueden nombrar (los de las plantillas más los hermanos de su clase) y a qué cálculo se aplican. */
export const CLASE_DE = {
  'alinea-a-la-derecha': 'suma', 'coma-mal-puesta': 'producto', 'por-diez-anadiendo-cero': 'por10', 'entre-diez-quitando-cero': 'por10',
  'redondea-truncando': 'redondeo', 'redondea-en-cadena': 'redondeo', 'redondea-otro-orden': 'redondeo',
  'olvida-coma-cociente': 'division', 'coma-solo-en-divisor': 'division', 'resto-sin-deshacer': 'division',
  'fraccion-al-reves': 'fraccion', 'periodico-por-redondeo': 'fraccion', 'numerador-como-decimas': 'fraccion',
  'compara-por-cifras': 'comparacion',
};

// ─── Pintar las líneas ─────────────────────────────────────────────────────────

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => String(s).replace(/[&<>]/g, c => ESCAPE[c]);
function segmento(s, idioma, html) {
  if (typeof s === 'string') return html ? esc(s) : s;
  if (s.d !== undefined) return aTexto(D(s.d), idioma);
  if (s.f) return html ? htmlFraccion(fraccion(s.f[0], s.f[1])) : `${s.f[0]}/${s.f[1]}`;
  if (s.p) return aTextoPeriodico(fraccion(s.p[0], s.p[1]), idioma, 3);
  return s.t[idioma];
}
/** Una línea del cálculo como texto plano en ese idioma (para los tests y el registro). */
export const textoLinea = (linea, idioma) => linea.map(s => segmento(s, idioma, false)).join('');
/** La misma línea como HTML (con la raya de las fracciones). */
export const htmlLinea = (linea, idioma) => linea.map(s => segmento(s, idioma, true)).join('');

// ─── Nombres de errores y qué explica cada resultado ───────────────────────────

/** ¿Este error, aplicado a los números del ítem, da lo mismo que el cálculo malo? Si es de otro cálculo, nunca. */
export function explica(plantilla, id, params) {
  if (CLASE_DE[id] !== plantilla.clase) return false;
  const mostrado = plantilla.valorError(params);
  for (const args of plantilla.args(id, params)) {
    let r;
    try { r = E[id].fn(...args); } catch { r = null; }
    if (r !== null && r !== undefined && mismoValor(r, mostrado)) return true;
  }
  return false;
}

/** El error bueno y tres que no se han cometido (los de su clase que darían otro resultado van primero); barajados. */
export function opcionesDeNombre(rng, plantilla, params) {
  const otros = Object.keys(CLASE_DE).filter(id => id !== plantilla.id && !explica(plantilla, id, params));
  const mismos = rng.barajar(otros.filter(id => CLASE_DE[id] === plantilla.clase));
  const resto = rng.barajar(otros.filter(id => CLASE_DE[id] !== plantilla.clase));
  return rng.barajar([plantilla.id, ...[...mismos.slice(0, 1), ...resto].slice(0, 3)]);
}

// ─── Generadores ───────────────────────────────────────────────────────────────

function conParams(plantilla, rng) {
  for (let i = 0; i < 600; i++) {
    const params = plantilla.params(rng);
    if (params && !prohibido(plantilla, params)) return params;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}
const baseItem = (tipo, p, params, mal, extra = {}) => {
  const { lineas, falsa } = p.cadena(params, mal);
  return { tipo, plantilla: p.id, params, lineas, falsa, error: mal ? p.id : null, ...extra };
};

/** Ejercicio 1: ¿dónde está el error? Un tercio de los ítems no tiene ninguno. */
export function generarDonde(rng) {
  const p = rng.elegir(PLANTILLAS), params = conParams(p, rng);
  return baseItem('donde', p, params, rng.azar() >= 1 / 3);
}

/** Ejercicio 2: ¿qué error es? Siempre hay error; cuatro nombres, uno solo verdadero. */
export function generarQue(rng) {
  const p = rng.elegir(PLANTILLAS), params = conParams(p, rng);
  return baseItem('que', p, params, true, { opciones: opcionesDeNombre(rng, p, params), solucion: p.id });
}

/** Ejercicio 3: corrígelo. Solo las plantillas cuyo resultado bueno se puede teclear. */
export function generarCorrige(rng) {
  const p = rng.elegir(PLANTILLAS.filter(x => x.corrige)), params = conParams(p, rng);
  return baseItem('corrige', p, params, true, { bien: tx(p.bien(params)), cifras: p.cifras ? p.cifras(params) : null });
}

/** El resultado bueno del ejercicio 3 como Decimal. */
export const resultadoBueno = item => PLANTILLA_POR_ID[item.plantilla].bien(item.params);

/**
 * Corrige lo que escribe el alumno (un Decimal). Devuelve { acierto, error }: 'repite-el-error' si pone
 * lo mismo que el cálculo malo, 'cifras' si el valor es bueno pero el enunciado pedía otro número de
 * decimales (redondeo), 'otro-resultado' en el resto.
 */
export function corregirCorrige(item, escrito) {
  const p = PLANTILLA_POR_ID[item.plantilla], bien = p.bien(item.params);
  if (mismoValor(escrito, bien)) {
    return item.cifras !== null && escrito.k !== item.cifras ? { acierto: false, error: 'cifras' } : { acierto: true, error: null };
  }
  if (mismoValor(escrito, p.malFinal(item.params))) return { acierto: false, error: 'repite-el-error' };
  return { acierto: false, error: 'otro-resultado' };
}

/** ¿Alguna línea acaba en cero tras la coma (3,50)? Entonces el feedback de «todo bien» lo recuerda. */
export function tieneCerosFinales(item) {
  const ultima = item.lineas.at(-1);
  return ultima.some(s => s && s.d !== undefined && conCerosFinales(D(s.d)));
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${item.params.join(',')}|${item.falsa ?? 'x'}`;
