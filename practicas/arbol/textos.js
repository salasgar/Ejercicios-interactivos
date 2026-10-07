// Árbol de factores: textos propios, siempre como { es, en }. Los comunes
// (Comprobar, Siguiente…) llegan a `montar` en `api.t`. Un texto con números
// es una función en cada idioma.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»,
// nunca «×»; inglés sencillo; aquí «factor» sí vale (factor tree, prime
// factor, el factor de un producto); el feedback habla de los números del ítem.

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
      es: '¿Está terminada esta factorización? Está terminada cuando todos los factores son primos.',
      en: 'Is this prime factorisation finished? It is finished when all the factors are prime numbers.',
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
