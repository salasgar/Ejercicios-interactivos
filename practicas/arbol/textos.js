// Árbol de factores: textos propios, siempre como { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan a `montar` en `api.t`. Un texto con números
// es una función en cada idioma.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»,
// nunca «×»; inglés sencillo; aquí «factor» sí vale (factor tree, prime
// factor, el factor de un producto); el feedback habla de los números del ítem.

import { unir } from '../_comun/textos.js';
import { esPrimo, factorizar, htmlFact } from '../_comun/aritmetica.js';
import { porQueCompuesto, primosAProbar, explicar, rutasDe, nodoEn, solucionCompletar } from './logica.js';

const cuenta = texto => `<span class="cuenta">${texto}</span>`;

export const TX = {
  // Lo que comparten los tres ejercicios
  no_es_primo: {
    es: (c, a, b) => `${c} no es primo: ${cuenta(`${c} = ${a} · ${b}`)}`,
    en: (c, a, b) => `${c} is not prime: ${cuenta(`${c} = ${a} · ${b}`)}`,
  },
  es_primo_pequeno: {
    es: p => `${p} es primo: sus únicos divisores son 1 y ${p}`,
    en: p => `${p} is prime: its only divisors are 1 and ${p}`,
  },
  es_primo_probando: {
    es: (p, lista, q) => `${p} es primo: no es divisible entre ${lista}, y ${cuenta(`${q} · ${q} = ${q * q}`)} ya se pasa de ${p}`,
    en: (p, lista, q) => `${p} is prime: it is not divisible by ${lista}, and ${cuenta(`${q} · ${q} = ${q * q}`)} is already greater than ${p}`,
  },
  ni: { es: 'ni', en: 'or' },
  otro_arbol: {
    es: (n, fact) => `Otro árbol, misma factorización: ${cuenta(`${n} = ${fact}`)}`,
    en: (n, fact) => `Another factor tree, same prime factorisation: ${cuenta(`${n} = ${fact}`)}`,
  },

  construir: {
    nombre: { es: 'Construye el árbol', en: 'Build the factor tree' },
    detalle: { es: 'Parte cada número hasta que solo queden primos', en: 'Split each number until only prime numbers are left' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Tienes que construir el <strong>árbol de factores</strong> de un número. De cada número del árbol decides si <strong>es primo</strong> (se rodea con un círculo) o si <strong>se puede partir</strong> en un producto de dos números (salen dos ramas). Tú eliges el producto: todos valen.</p>
        <p>El árbol está terminado cuando todos los números de las puntas son primos. Cuidado con los que parecen primos y no lo son.</p>`,
      en: `<h2>How it works</h2>
        <p>You have to build the <strong>factor tree</strong> of a number. For each number in the tree, you decide: is it <strong>prime</strong> (it gets a circle), or can you <strong>split</strong> it into a product of two numbers (it gets two branches)? You choose the product: they all work.</p>
        <p>The tree is finished when all the numbers at the ends are prime. Be careful: some numbers look prime, but they are not.</p>`,
    },
    instruccion: {
      es: 'Construye el árbol de factores: de cada número, decide si es primo o si se puede partir.',
      en: 'Build the factor tree: for each number, decide if it is prime or if you can split it.',
    },
    pregunta: { es: n => `¿${n} es primo?`, en: n => `Is ${n} a prime number?` },
    si_primo: { es: 'Sí, es primo', en: 'Yes, it is prime' },
    no_partir: { es: 'No, se puede partir', en: 'No, I can split it' },
    elige: { es: n => `Elige un producto: ${n} =`, en: n => `Choose a product: ${n} =` },
    todo_rodeado: { es: 'Todas las puntas del árbol están rodeadas.', en: 'All the ends of the tree have a circle.' },
    terminado: { es: 'Terminado', en: 'Finished' },
    nodo_primo: { es: n => `${n}, primo`, en: n => `${n}, prime` },
    nodo_abierto: { es: n => `${n}, sin decidir`, en: n => `${n}, not decided yet` },
    otros_arboles: {
      es: 'Hay otros árboles, pero la factorización es la misma.',
      en: 'There are other factor trees, but the prime factorisation is the same.',
    },
    fallos: { es: 'En este árbol:', en: 'In this tree:' },
  },

  terminada: {
    nombre: { es: '¿Está terminada?', en: 'Is it finished?' },
    detalle: { es: 'Decide si una factorización tiene todos sus factores primos', en: 'Decide if all the factors of a factorisation are prime' },
    instruccion: {
      es: '¿Está terminada esta factorización? Está terminada cuando <strong>todos los factores son primos</strong>.',
      en: 'Is this prime factorisation finished? It is finished when <strong>all the factors are prime numbers</strong>.',
    },
    si: { es: 'Sí, terminada', en: 'Yes, finished' },
    no: { es: 'No', en: 'No' },
    toca: { es: 'No está terminada. Toca el factor que no es primo.', en: 'It is not finished. Tap the factor that is not prime.' },
    todos_primos: { es: lista => `Está terminada: ${lista} son primos`, en: lista => `It is finished: ${lista} are prime` },
    un_primo: { es: p => `Está terminada: ${p} es primo`, en: p => `It is finished: ${p} is prime` },
    seria: { es: (n, fact) => `Terminada sería ${cuenta(`${n} = ${fact}`)}`, en: (n, fact) => `The finished one is ${cuenta(`${n} = ${fact}`)}` },
    no_era_ese: { es: (p, c) => `${p} es primo. El factor que no es primo es ${c}`, en: (p, c) => `${p} is prime. The factor that is not prime is ${c}` },
    factor: { es: (base, e) => (e > 1 ? `${base} elevado a ${e}` : `${base}`), en: (base, e) => (e > 1 ? `${base} to the power of ${e}` : `${base}`) },
  },

  completar: {
    nombre: { es: 'Completa el árbol', en: 'Complete the factor tree' },
    detalle: { es: 'Coloca los números que faltan en un árbol', en: 'Put the missing numbers in a factor tree' },
    instruccion: {
      es: 'Completa el árbol de factores: lleva cada número a su hueco. Sobran dos.',
      en: 'Complete the factor tree: put each number in its box. Two numbers are not needed.',
    },
    hueco: { es: 'hueco', en: 'empty box' },
    bien: { es: (n, fact) => `Todas las ramas cuadran: ${cuenta(`${n} = ${fact}`)}`, en: (n, fact) => `All the branches are right: ${cuenta(`${n} = ${fact}`)}` },
    rama_mal: { es: (a, b, producto, valor) => `${cuenta(`${a} · ${b} = ${producto}`)}, no ${valor}`, en: (a, b, producto, valor) => `${cuenta(`${a} · ${b} = ${producto}`)}, not ${valor}` },
    faltaban: { es: lista => `Los números que faltaban eran ${lista}`, en: lista => `The missing numbers were ${lista}` },
    correcto: { es: 'El árbol completo:', en: 'The complete tree:' },
  },
};

// ─── Explicaciones del botón «No lo sé» (tarea 184) ─────────────────────────────

const RESPUESTA = {
  es: x => `La respuesta es ${x}.`,
  en: x => `The answer is ${x}.`,
};
const ayuda = {
  construir: {
    regla: {
      es: 'Parte cada número en un producto de dos y sigue con los que no sean primos hasta que todas las puntas sean primos.',
      en: 'Split each number into a product of two, and keep going with the ones that are not prime until all the ends are prime.',
    },
    parte: {
      es: (c, p, r) => `${cuenta(`${c} = ${p} · ${r}`)}: ${!esPrimo(r) ? `${p} es primo; ${r} se puede partir` : p === r ? `${p} es primo` : `${p} y ${r} son primos`}.`,
      en: (c, p, r) => `${cuenta(`${c} = ${p} · ${r}`)}: ${!esPrimo(r) ? `${p} is prime; ${r} can be split` : p === r ? `${p} is prime` : `${p} and ${r} are prime`}.`,
    },
    puntas: { es: 'Ya todas las puntas son primos.', en: 'Now all the ends are prime.' },
  },
  terminada: {
    regla: { es: 'Mira cada factor de la igualdad y pregúntate si es primo.', en: 'Look at each factor in the equality and ask yourself: is it prime?' },
    no: { es: c => `No, no está terminada. El factor que no es primo es ${c}`, en: c => `No, it is not finished. The factor that is not prime is ${c}` },
    si: { es: 'Sí, está terminada', en: 'Yes, it is finished' },
  },
  completar: {
    regla: {
      es: 'En cada rama, el producto de los dos números de abajo es el número de arriba. Si falta uno, se divide o se multiplica. En negrita, los que faltaban:',
      en: 'In each branch, the product of the two numbers below is the number above. If one is missing, divide or multiply. In bold, the missing ones:',
    },
    faltan: { es: l => `Los números de los huecos son ${l}`, en: l => `The numbers for the empty boxes are ${l}` },
  },
};

/** «101 es primo: no es divisible entre 2, 3, 5 ni 7, y 11 · 11 = 121 ya se pasa de 101». */
export function porQuePrimo(p, { tt }) {
  const { probados, siguiente } = primosAProbar(p);
  if (probados.length < 2) return tt(TX.es_primo_pequeno)(p);
  return tt(TX.es_primo_probando)(p, `${probados.slice(0, -1).join(', ')} ${tt(TX.ni)} ${probados.at(-1)}`, siguiente);
}

export const porQueNoPrimo = (c, { tt }) => tt(TX.no_es_primo)(c, ...porQueCompuesto(c));
export const igualdadFinal = n => cuenta(`${n} = ${htmlFact(factorizar(n))}`);

/** Por qué una factorización está terminada: todos son primos y, del mayor, por qué lo es. */
export function razonTerminada(item, textos) {
  const { tt, idioma } = textos;
  const bases = item.igualdad.map(([base]) => base);
  const frase = bases.length > 1 ? tt(TX.terminada.todos_primos)(unir(bases, idioma)) : tt(TX.terminada.un_primo)(bases[0]);
  const mayor = Math.max(...bases);
  return `${frase}.${mayor > 13 ? ` ${porQuePrimo(mayor, textos)}.` : ''}`;
}

/** Por qué no está terminada, y cómo sería terminada. */
export function razonNoTerminada(item, textos) {
  const { tt } = textos;
  return `${porQueNoPrimo(item.compuesto, textos)}. ${tt(TX.terminada.seria)(item.n, htmlFact(explicar(item).factorizacion))}.`;
}

/** Ejercicio 1: un árbol posible, partiendo siempre por el primo más pequeño. */
export function explicaConstruir(item, { tt }) {
  const pasos = [];
  for (let c = item.n; !esPrimo(c);) {
    const [p, r] = porQueCompuesto(c);
    pasos.push(`<li>${tt(ayuda.construir.parte)(c, p, r)}</li>`);
    c = r;
  }
  const f = igualdadFinal(item.n);
  return `<p>${tt(ayuda.construir.regla)}</p><ol class="pasos-ayuda">${pasos.join('')}</ol><p>${tt(ayuda.construir.puntas)} ${tt(RESPUESTA)(f)}</p>`;
}

/** Ejercicio 2: si todos los factores son primos, está terminada; si no, cuál no lo es. */
export function explicaTerminada(item, textos) {
  const { tt } = textos;
  const cierre = item.terminada ? tt(ayuda.terminada.si) : tt(ayuda.terminada.no)(item.compuesto);
  const razon = item.terminada ? razonTerminada(item, textos) : razonNoTerminada(item, textos);
  return `<p>${tt(ayuda.terminada.regla)}</p><p>${razon}</p><p>${tt(RESPUESTA)(`<strong>${cierre}</strong>`)}</p>`;
}

/** Ejercicio 3: las ramas que tienen un hueco, con sus cuentas, y los números que faltan. */
export function explicaCompletar(item, { tt, idioma }) {
  const huecos = new Set(item.huecos);
  const ramas = rutasDe(item.arbol)
    .filter(ruta => { const nodo = nodoEn(item.arbol, ruta); return nodo.hijos.length && [ruta, ruta + '0', ruta + '1'].some(r => huecos.has(r)); })
    .map(ruta => {
      const nodo = nodoEn(item.arbol, ruta);
      const [a, b] = nodo.hijos.map((h, i) => (huecos.has(ruta + i) ? `<strong>${h.valor}</strong>` : h.valor));
      return `<li>${cuenta(`${huecos.has(ruta) ? `<strong>${nodo.valor}</strong>` : nodo.valor} = ${a} · ${b}`)}</li>`;
    });
  const lista = unir(solucionCompletar(item).map(String), idioma);
  return `<p>${tt(ayuda.completar.regla)}</p><ol class="pasos-ayuda">${ramas.join('')}</ol><p>${tt(RESPUESTA)(`<strong>${lista}</strong>`)}</p>`;
}
