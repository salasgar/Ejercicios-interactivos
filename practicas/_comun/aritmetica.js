// Aritmética de la unidad 2 (Divisibilidad) que comparten las prácticas:
// primos, factorizaciones, divisores, m.c.d., m.c.m. y criterios. Todo puro.
//
// Una factorización es una lista [[primo, exponente], …] con las bases de
// menor a mayor y exponentes ≥ 1; la del 1 es la lista vacía.

/** ¿Es primo? (El 0 y el 1 no son ni primos ni compuestos.) */
export function esPrimo(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** Los primos menores que 200. */
export const PRIMOS = Array.from({ length: 200 }, (_, n) => n).filter(esPrimo);

/** Factorización de n ≥ 1: `factorizar(72)` → [[2, 3], [3, 2]]. */
export function factorizar(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error(`No se puede factorizar ${n}`);
  const f = [];
  for (let p = 2; p * p <= n; p++) {
    let e = 0;
    while (n % p === 0) { n /= p; e++; }
    if (e) f.push([p, e]);
  }
  if (n > 1) f.push([n, 1]);
  return f;
}

/** El número que vale una factorización: [[2, 3], [3, 2]] → 72. */
export function valorDe(f) {
  return f.reduce((v, [p, e]) => v * p ** e, 1);
}

/** Mayor entero cuyo cuadrado no pasa de n. */
export function raizEntera(n) {
  let r = Math.floor(Math.sqrt(n));
  while (r * r > n) r--;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}

/** Parejas de divisores de n ≥ 1: `parejasDivisores(24)` → [[1, 24], [2, 12], [3, 8], [4, 6]]. */
export function parejasDivisores(n) {
  const parejas = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) parejas.push([d, n / d]);
  return parejas;
}

/** Divisores de n ≥ 1, de menor a mayor, con el 1 y el propio n. */
export function divisores(n) {
  return [...new Set(parejasDivisores(n).flat())].sort((a, b) => a - b);
}

const mcd2 = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };

/** Máximo común divisor de dos o más números. */
export function mcd(...numeros) {
  return numeros.reduce(mcd2);
}

/** Mínimo común múltiplo de dos o más números (ninguno 0). */
export function mcm(...numeros) {
  return numeros.reduce((a, b) => a / mcd2(a, b) * b);
}

/** Cifras de n, de izquierda a derecha: `cifras(308)` → [3, 0, 8]. */
export function cifras(n) {
  return [...String(n)].map(Number);
}

export function sumaCifras(n) {
  return cifras(n).reduce((s, c) => s + c, 0);
}

// --- Criterios de divisibilidad -----------------------------------------------

export const CRITERIOS = [2, 3, 5, 9, 10, 11];

/**
 * Lo que dice el criterio de divisibilidad entre `d` (2, 3, 5, 9, 10 u 11)
 * sobre `n` ≥ 0: { divisible, razon: { es, en } }. La razón es una frase corta
 * con los números de ese caso, sin mayúscula ni punto, para meterla en el
 * feedback: «la suma de sus cifras es 12, que es múltiplo de 3».
 */
export function criterio(n, d) {
  const c = cifras(n);
  const ultima = c.at(-1);
  if (d === 2) {
    const divisible = ultima % 2 === 0;
    return { divisible, razon: {
      es: `acaba en ${ultima}, que es una cifra ${divisible ? 'par' : 'impar'}`,
      en: `it ends in ${ultima}, which is an ${divisible ? 'even' : 'odd'} digit`,
    } };
  }
  if (d === 5) {
    const divisible = ultima === 0 || ultima === 5;
    return { divisible, razon: {
      es: divisible ? `acaba en ${ultima}` : `acaba en ${ultima}, y no en 0 ni en 5`,
      en: divisible ? `it ends in ${ultima}` : `it ends in ${ultima}, not in 0 or 5`,
    } };
  }
  if (d === 10) {
    const divisible = ultima === 0;
    return { divisible, razon: {
      es: divisible ? 'acaba en 0' : `acaba en ${ultima}, y no en 0`,
      en: divisible ? 'it ends in 0' : `it ends in ${ultima}, not in 0`,
    } };
  }
  if (d === 3 || d === 9) {
    const suma = sumaCifras(n);
    const divisible = suma % d === 0;
    const cuenta = c.length > 1 ? `${c.join(' + ')} = ${suma}` : `${suma}`;
    return { divisible, razon: {
      es: `la suma de sus cifras es ${cuenta}, que ${divisible ? 'es' : 'no es'} múltiplo de ${d}`,
      en: `the sum of its digits is ${cuenta}, which ${divisible ? 'is' : 'is not'} a multiple of ${d}`,
    } };
  }
  if (d === 11) {
    // Cifras en lugar impar (1.ª, 3.ª…) y en lugar par, contando desde la
    // izquierda. Se resta la suma menor de la mayor: aún no hay negativos.
    const impares = c.filter((_, i) => i % 2 === 0), pares = c.filter((_, i) => i % 2 === 1);
    const suma = lista => (lista.length > 1 ? `${lista.join(' + ')} = ${lista.reduce((s, x) => s + x, 0)}` : `${lista[0] ?? 0}`);
    const a = impares.reduce((s, x) => s + x, 0), b = pares.reduce((s, x) => s + x, 0);
    const diferencia = Math.abs(a - b);
    const divisible = diferencia % 11 === 0;
    const resta = `${Math.max(a, b)} − ${Math.min(a, b)} = ${diferencia}`;
    return { divisible, razon: {
      es: `las cifras de lugar impar suman ${suma(impares)} y las de lugar par suman ${suma(pares)}; la diferencia es ${resta}, que ${divisible ? 'es' : 'no es'} múltiplo de 11`,
      en: `the digits in odd places add up to ${suma(impares)} and the digits in even places add up to ${suma(pares)}; the difference is ${resta}, which ${divisible ? 'is' : 'is not'} a multiple of 11`,
    } };
  }
  throw new Error(`No hay criterio de divisibilidad entre ${d}`);
}

// --- Operaciones con factorizaciones --------------------------------------------

const comoMapa = f => new Map(f);
const comoFact = mapa => [...mapa].filter(([, e]) => e > 0).sort((a, b) => a[0] - b[0]);
const bases = (...fs) => [...new Set(fs.flatMap(f => f.map(([p]) => p)))];

function combinar(fs, exponente) {
  const mapas = fs.map(comoMapa);
  return comoFact(new Map(bases(...fs).map(p => [p, exponente(mapas.map(m => m.get(p) ?? 0))])));
}

/** Producto: se suman los exponentes. */
export function multiplicarFact(f, g) {
  return combinar([f, g], ([a, b]) => a + b);
}

/** ¿Es `f` múltiplo de `g`? (Todos los primos de g están en f con exponente mayor o igual.) */
export function esMultiploFact(f, g) {
  const mf = comoMapa(f);
  return g.every(([p, e]) => (mf.get(p) ?? 0) >= e);
}

/** Cociente f : g (se restan los exponentes), o `null` si f no es múltiplo de g. */
export function dividirFact(f, g) {
  return esMultiploFact(f, g) ? combinar([f, g], ([a, b]) => a - b) : null;
}

/** m.c.d.: los primos comunes con el menor exponente. */
export function mcdFact(...fs) {
  return combinar(fs, es => Math.min(...es));
}

/** m.c.m.: todos los primos con el mayor exponente. */
export function mcmFact(...fs) {
  return combinar(fs, es => Math.max(...es));
}

/** `2<sup>3</sup> · 3<sup>2</sup> · 5` (punto medio, sin exponente 1; la del 1 es «1»). */
export function htmlFact(f) {
  return f.length ? f.map(([p, e]) => (e === 1 ? `${p}` : `${p}<sup>${e}</sup>`)).join(' · ') : '1';
}

/** `2^3 · 3^2 · 5`, para textos sin HTML (CSV, `aria-label`, tests). */
export function textoFact(f) {
  return f.length ? f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(' · ') : '1';
}
