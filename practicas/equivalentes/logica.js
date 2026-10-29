// Práctica «Fracciones equivalentes» de la unidad 4 (Fractions): lógica pura (sin DOM ni red).
// Cuatro ejercicios de la semana 1 (sesión 2):
//   1. El término que falta   3/5 = □/20, 12/18 = 2/□ (ampliar o reducir)
//   2. ¿Son equivalentes?     dos fracciones, Sí o No, con los productos cruzados al responder
//   3. Equipos                ocho tarjetas que se reparten en dos o tres cajas (una por valor)
//   4. Común denominador      el m.c.m. de dos denominadores y las dos fracciones equivalentes
//
// Un ítem es DATOS (números sueltos). Todo error lleva un nombre de `ERRORES_PROPIOS` y se calcula
// con los números del ítem; ninguna opción vale lo mismo que otra (por valor, con enteros).

import { fraccion, productosCruzados } from '../_comun/fracciones.js';
import { mcm, mcd } from '../_comun/aritmetica.js';

export const fr = ({ num, den }) => fraccion(num, den);
const par = (num, den) => ({ num, den });
const irreducible = (p, q) => mcd(p, q) === 1;
export const DEN_MAX = 60;

export const ERRORES_PROPIOS = {
  'suma-la-diferencia': { nombre: { es: 'Ha sumado (o restado) la misma cantidad en vez de multiplicar (o dividir)', en: 'Added (or subtracted) the same amount instead of multiplying (or dividing)' } },
  'no-cambia-el-termino': { nombre: { es: 'Ha dejado el término sin cambiar', en: 'Left the term unchanged' } },
  'otra-respuesta': { nombre: { es: 'Ha dado otro número', en: 'Gave a different number' } },
  'suma-el-mismo-numero': { nombre: { es: 'Cree que son equivalentes porque a las dos les falta lo mismo (sumar el mismo número arriba y abajo)', en: 'Thinks they are equivalent because both are missing the same amount (added the same number to top and bottom)' } },
  'cambia-solo-un-termino': { nombre: { es: 'Ha cambiado solo un término de la fracción', en: 'Changed only one term of the fraction' } },
  'mismo-numerador': { nombre: { es: 'Cree que son equivalentes porque tienen el mismo numerador', en: 'Thinks they are equivalent because they have the same numerator' } },
  'no-ve-el-factor': { nombre: { es: 'No ha visto el número por el que se multiplica', en: 'Did not see the number you multiply by' } },
  'mezcla-valores': { nombre: { es: 'Ha puesto en la misma caja fracciones que no son equivalentes', en: 'Put fractions that are not equivalent in the same box' } },
  'valor-repetido-en-dos-cajas': { nombre: { es: 'Ha separado en dos cajas fracciones que son equivalentes', en: 'Split equivalent fractions between two boxes' } },
  'caja-vacia': { nombre: { es: 'Ha dejado una caja vacía', en: 'Left a box empty' } },
  'producto-de-denominadores': { nombre: { es: 'Ha multiplicado los denominadores en vez de buscar el m.c.m.', en: 'Multiplied the denominators instead of finding the LCM' } },
  'suma-de-denominadores': { nombre: { es: 'Ha sumado los denominadores', en: 'Added the denominators' } },
  'toma-el-mayor-denominador': { nombre: { es: 'Ha tomado el mayor de los denominadores', en: 'Took the larger denominator' } },
  'numerador-mal': { nombre: { es: 'Ha puesto mal un numerador (con el denominador común ya bien)', en: 'Got a numerator wrong (with the common denominator right)' } },
  'solo-cambia-el-denominador': { nombre: { es: 'Ha cambiado solo el denominador y ha dejado los numeradores', en: 'Changed only the denominator and left the numerators' } },
};

export const nombreDe = id => ERRORES_PROPIOS[id]?.nombre ?? null;

// Casos que se dejan libres para la hoja y los exámenes de la semana 1 (RESERVADOS en comprobar-semana1.py).
// Las claves de un ítem del ej. 1 son `izq=der` con `*` en el hueco; las parejas de los ej. 2 y 4, sin orden.
const RESERVADOS = new Set(['5/8=*/48', '7/9=28/*', '2/9=*/27', '5/6=35/*', '4/11=*/44', '21/56=*/8']);
const pareja = (a, b) => [`${a.num}/${a.den}`, `${b.num}/${b.den}`].sort().join(' y ');
const PAREJAS_RESERVADAS = new Set([
  // ej. 2 de la hoja (7a, 7b) y del examen
  '6/9 y 10/15', '8/10 y 9/12',
  // ej. 4: la hoja (9a-9d, por parejas) y comprobar-semana1.py (2/3 y 5/8; 3/10 y 4/15)
  '1/4 y 5/6', '1/6 y 4/9', '5/12 y 7/8', '1/2 y 3/5', '1/2 y 7/10', '3/5 y 7/10', '2/3 y 5/8', '3/10 y 4/15',
]);

// ─── Ejercicio 1: el término que falta ──────────────────────────────────────────────

/**
 * { ejercicio: 1, izq, der, hueco: 'num'|'den', respuesta, k, direccion }
 * `izq` es la fracción entera y `der` la otra con un término a `null` (el hueco). Ampliar:
 * izq = p/q, der = pk/qk; reducir: al revés. El factor k es entero de 2 a 6 y los denominadores ≤ 60.
 */
export function generarTermino(rng) {
  for (;;) {
    const q = rng.entero(2, 10), p = rng.entero(1, q - 1), k = rng.entero(2, 6);
    if (!irreducible(p, q) || q * k > DEN_MAX) continue;
    const direccion = rng.azar() < 0.5 ? 'ampliar' : 'reducir';
    const hueco = rng.azar() < 0.5 ? 'num' : 'den';
    const chica = par(p, q), grande = par(p * k, q * k);
    const izq = direccion === 'ampliar' ? chica : grande;
    const completa = direccion === 'ampliar' ? grande : chica;
    const clave = `${izq.num}/${izq.den}=${hueco === 'num' ? '*' : completa.num}/${hueco === 'den' ? '*' : completa.den}`;
    if (RESERVADOS.has(clave)) continue;
    return { ejercicio: 1, izq, der: { ...completa, [hueco]: null }, hueco, respuesta: completa[hueco], k, direccion };
  }
}

/** Error típico del número escrito en el hueco (null si acertó). */
export function errorTermino(item, valor) {
  if (valor === item.respuesta) return null;
  const otro = item.hueco === 'num' ? 'den' : 'num';
  const diferencia = item.der[otro] - item.izq[otro];
  if (valor === item.izq[item.hueco] + diferencia) return 'suma-la-diferencia';
  if (valor === item.izq[item.hueco]) return 'no-cambia-el-termino';
  return 'otra-respuesta';
}

// ─── Ejercicio 2: ¿son equivalentes? ───────────────────────────────────────────────

/**
 * { ejercicio: 2, a, b, equivalentes, error }  (`error`: el del «No» que se sugiere; null si lo son)
 * La mitad equivalentes (una es la otra ampliada por 2-6); la otra mitad, de tres errores típicos.
 */
export function generarSonEquivalentes(rng) {
  for (;;) {
    const q = rng.entero(2, 10), p = rng.entero(1, q - 1);
    if (!irreducible(p, q)) continue;
    const j = rng.azar() < 0.5 ? 1 : rng.entero(2, 3);
    const a = par(p * j, q * j);
    let b, error = null;
    if (rng.azar() < 0.5) {
      const k = rng.entero(2, 6);
      if (k === j) continue;
      b = par(p * k, q * k);
    } else {
      error = rng.elegir(['suma-el-mismo-numero', 'cambia-solo-un-termino', 'mismo-numerador']);
      if (error === 'suma-el-mismo-numero') { const c = rng.entero(1, 3); b = par(a.num + c, a.den + c); }
      else if (error === 'cambia-solo-un-termino') {
        const m = rng.entero(2, 4);
        b = rng.azar() < 0.5 ? par(a.num * m, a.den) : par(a.num, a.den * m);
      } else b = par(a.num, a.den + rng.entero(1, 3));
    }
    if (Math.max(a.den, b.den) > DEN_MAX || PAREJAS_RESERVADAS.has(pareja(a, b))) continue;
    const equivalentes = fr(a).equals(fr(b));
    if (equivalentes !== (error === null)) continue;
    return rng.azar() < 0.5 ? { ejercicio: 2, a, b, equivalentes, error } : { ejercicio: 2, a: b, b: a, equivalentes, error };
  }
}

/** Los dos productos cruzados de a y b: [a.num · b.den, a.den · b.num]. */
export const cruzados = item => productosCruzados(fr(item.a), fr(item.b));

/** Error típico de la respuesta Sí/No (null si acertó). */
export function errorEquivalentes(item, dijoSi) {
  if (dijoSi === item.equivalentes) return null;
  return item.equivalentes ? 'no-ve-el-factor' : item.error;
}

// ─── Ejercicio 3: equipos ───────────────────────────────────────────────────────────

/**
 * { ejercicio: 3, cajas: 2|3, tarjetas: [{ id, num, den, grupo }] }
 * Ocho tarjetas de 2 o 3 valores distintos; las de un mismo `grupo` son equivalentes entre sí y
 * ninguna lo es de otro grupo; no hay dos iguales.
 */
export function generarEquipos(rng) {
  const cajas = rng.azar() < 0.5 ? 2 : 3;
  const reparto = cajas === 2 ? rng.elegir([[4, 4], [5, 3]]) : [3, 3, 2];
  for (;;) {
    const valores = [];
    while (valores.length < cajas) {
      const q = rng.entero(2, 8), p = rng.entero(1, q - 1);
      if (irreducible(p, q) && !valores.some(v => fr(v).equals(fr(par(p, q))))) valores.push(par(p, q));
    }
    const tarjetas = [];
    let ok = true;
    reparto.forEach((n, grupo) => {
      const ks = rng.barajar([1, 2, 3, 4, 5, 6]).filter(k => valores[grupo].den * k <= 48).slice(0, n);
      if (ks.length < n) ok = false;
      ks.forEach(k => tarjetas.push({ num: valores[grupo].num * k, den: valores[grupo].den * k, grupo }));
    });
    if (!ok) continue;
    // Dos tarjetas con la misma escritura (3/5 de dos valores distintos no puede pasar, pero 1/2 y 2/4 sí se repiten por valor).
    return { ejercicio: 3, cajas, tarjetas: rng.barajar(tarjetas).map((t, id) => ({ ...t, id })) };
  }
}

/**
 * Corrige un reparto: `asignacion[id]` es la caja (0..cajas−1) o null. Devuelve
 * { acierto, error, estados: [{ id, estado: 'bien'|'mal'|'falta' }], valorDeCaja }.
 * El valor de una caja es el del grupo que más tarjetas tiene en ella (a igualdad, el de la
 * primera tarjeta); una tarjeta de otro grupo está «mal». Dos cajas con el mismo valor, o una
 * vacía, no son un acierto.
 */
export function evaluarEquipos(item, asignacion) {
  const valorDeCaja = Array.from({ length: item.cajas }, (_, c) => {
    const dentro = item.tarjetas.filter(t => asignacion[t.id] === c);
    if (!dentro.length) return null;
    const cuenta = new Map();
    for (const t of dentro) cuenta.set(t.grupo, (cuenta.get(t.grupo) ?? 0) + 1);
    const mayor = Math.max(...cuenta.values());
    return dentro.find(t => cuenta.get(t.grupo) === mayor).grupo;
  });
  const estados = item.tarjetas.map(t => ({
    id: t.id,
    estado: asignacion[t.id] === null || asignacion[t.id] === undefined ? 'falta' : (valorDeCaja[asignacion[t.id]] === t.grupo ? 'bien' : 'mal'),
  }));
  const hayMal = estados.some(e => e.estado === 'mal');
  const faltan = estados.some(e => e.estado === 'falta');
  const vacia = valorDeCaja.some(v => v === null);
  const repetido = new Set(valorDeCaja.filter(v => v !== null)).size < valorDeCaja.filter(v => v !== null).length;
  const acierto = !hayMal && !faltan && !vacia && !repetido;
  let error = null;
  if (!acierto) error = hayMal ? 'mezcla-valores' : (repetido ? 'valor-repetido-en-dos-cajas' : 'caja-vacia');
  return { acierto, error, estados, valorDeCaja };
}

// ─── Ejercicio 4: común denominador ─────────────────────────────────────────────────

/**
 * { ejercicio: 4, a, b, mcm, ea, eb }
 * Denominadores de 2 a 12, distintos, con m.c.m. ≤ 60; en la mitad de los ítems ninguno es múltiplo
 * del otro. `ea` y `eb` son las equivalentes con denominador el m.c.m.
 */
export function generarComun(rng) {
  for (;;) {
    const d1 = rng.entero(2, 12), d2 = rng.entero(2, 12);
    if (d1 === d2) continue;
    const m = mcm(d1, d2);
    if (m > DEN_MAX) continue;
    const multiplo = m === d1 || m === d2;
    if (multiplo && rng.azar() < 0.5) continue;
    const n1 = rng.entero(1, d1 - 1), n2 = rng.entero(1, d2 - 1);
    if (!irreducible(n1, d1) || !irreducible(n2, d2)) continue;
    const a = par(n1, d1), b = par(n2, d2);
    if (PAREJAS_RESERVADAS.has(pareja(a, b))) continue;
    return { ejercicio: 4, a, b, mcm: m, ea: par(n1 * (m / d1), m), eb: par(n2 * (m / d2), m) };
  }
}

/** Error típico del denominador común escrito (null si es el m.c.m.). */
export function errorMcm(item, valor) {
  if (valor === item.mcm) return null;
  const d1 = item.a.den, d2 = item.b.den;
  if (valor === d1 * d2) return 'producto-de-denominadores';
  if (valor === d1 + d2) return 'suma-de-denominadores';
  if (valor === Math.max(d1, d2)) return 'toma-el-mayor-denominador';
  return 'otra-respuesta';
}

/**
 * Error típico de los dos numeradores escritos (null si son los buenos). «Solo cambia el denominador»:
 * toda fracción cuyo denominador cambia conserva su numerador (y al menos una cambia); si no, es un
 * numerador mal puesto, del paso 2, que no tiene que ver con el m.c.m.
 */
export function errorNumeradores(item, n1, n2) {
  if (n1 === item.ea.num && n2 === item.eb.num) return null;
  const sinCambiar = [[item.a, n1], [item.b, n2]].filter(([x]) => x.den !== item.mcm);
  if (sinCambiar.length && sinCambiar.every(([x, n]) => n === x.num)) return 'solo-cambia-el-denominador';
  return 'numerador-mal';
}

export function claveDe(item) {
  switch (item.ejercicio) {
    case 1: return `1:${item.izq.num}/${item.izq.den}:${item.der.num}/${item.der.den}`;
    case 2: return `2:${item.a.num}/${item.a.den}:${item.b.num}/${item.b.den}`;
    case 3: return `3:${item.tarjetas.map(t => `${t.num}/${t.den}`).sort().join(',')}`;
    default: return `4:${item.a.num}/${item.a.den}:${item.b.num}/${item.b.den}`;
  }
}
