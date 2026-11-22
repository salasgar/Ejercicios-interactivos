// Familias del ejercicio 2 («Señala el paso») en columnas (tarea 235, JL 22-11): el mismo cálculo hecho por 2-4
// alumnos. Una familia es una expresión con varios caminos BUENOS (valores distintos de pensar lo mismo) y varios
// caminos MALOS (cada uno con un error del catálogo NOMBRES).
//
// Una ruta es { id, lineas(params) → [expresión, paso, paso, …], error?: { linea, nombre }, porque?: {es, en} }.
// La línea 0 es el enunciado; el error cuenta con el enunciado como 0. Los textos de las líneas llevan «:» para la
// división (en inglés se escribe «÷») y los exponentes `2^3`. Cada línea de una ruta buena vale lo mismo que el
// enunciado; en una mala, las líneas anteriores al error valen lo mismo y la del error no (lo comprueba `evaluar`
// aquí y el test).

const L = (es, en) => ({ es, en });
const bien = (es, en) => L(`Está bien: ${es}`, `It is right: ${en}`);

/** Valor de una expresión de las líneas: números, + − · : ^ ( ) y √. Devuelve NaN si no se entiende. */
export function evaluar(texto) {
  const t = texto.replace(/\s+/g, '').replace(/÷/g, ':').match(/\d+|[+−·:^()√]/g) ?? [];
  let i = 0;
  const atomo = () => {
    const x = t[i++];
    if (x === '(') { const v = suma(); if (t[i++] !== ')') return NaN; return v; }
    if (x === '√') return Math.sqrt(Number(t[i++]));
    return /^\d+$/.test(x ?? '') ? Number(x) : NaN;
  };
  const potencia = () => { const b = atomo(); if (t[i] === '^') { i++; return b ** Number(t[i++]); } return b; };
  const producto = () => {
    let v = potencia();
    while (t[i] === '·' || t[i] === ':') v = t[i++] === '·' ? v * potencia() : v / potencia();
    return v;
  };
  const suma = () => {
    let v = producto();
    while (t[i] === '+' || t[i] === '−') v = t[i++] === '+' ? v + producto() : v - producto();
    return v;
  };
  const v = suma();
  return i === t.length ? v : NaN;
}

const CUADRADOS_PARES = [16, 36, 64, 100, 144, 196, 256, 324, 400];   // el 4 no: 4 : 2 = 2 = √4
const par = (rng, min, max) => [rng.entero(min, max), rng.entero(min, max)];

export const FAMILIAS = [
  {
    id: 'suma-producto',
    peso: 1,
    numeros: rng => {
      const [a, b] = par(rng, 2, 9), c = rng.entero(2, 9);
      return rng.azar() < 0.5 ? { a, b, c, d: null } : { a, b, c, d: rng.entero(1, Math.min(9, a + b * c - 1)) };
    },
    bien: [
      {
        id: 'producto-primero',
        porque: bien('el producto se hace antes de sumar.', 'the multiplication is done before adding.'),
        lineas: ({ a, b, c, d }) => d === null
          ? [`${a} + ${b} · ${c}`, `${a} + ${b * c}`, `${a + b * c}`]
          : [`${a} + ${b} · ${c} − ${d}`, `${a} + ${b * c} − ${d}`, `${a + b * c} − ${d}`, `${a + b * c - d}`],
      },
      {
        id: 'producto-entre-parentesis',
        porque: bien('el paréntesis que sobra no cambia nada: el producto va antes de sumar.', 'the extra brackets change nothing: the multiplication comes before adding.'),
        lineas: ({ a, b, c, d }) => d === null
          ? [`${a} + ${b} · ${c}`, `${a} + (${b} · ${c})`, `${a} + ${b * c}`, `${a + b * c}`]
          : [`${a} + ${b} · ${c} − ${d}`, `${a} + (${b} · ${c}) − ${d}`, `${a + b * c} − ${d}`, `${a + b * c - d}`],
      },
    ],
    mal: [
      {
        id: 'suma-antes',
        error: { linea: 1, nombre: 'sumaAntes' },
        lineas: ({ a, b, c, d }) => d === null
          ? [`${a} + ${b} · ${c}`, `${a + b} · ${c}`, `${(a + b) * c}`]
          : [`${a} + ${b} · ${c} − ${d}`, `${a + b} · ${c} − ${d}`, `${(a + b) * c} − ${d}`, `${(a + b) * c - d}`],
      },
    ],
  },
  {
    id: 'potencia-producto-suma',
    peso: 2,
    numeros: rng => ({ a: rng.entero(3, 5), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    bien: [
      {
        id: 'potencia-primero',
        porque: bien('primero la potencia y el producto, y después la suma.', 'first the power and the multiplication, then the addition.'),
        lineas: ({ a, b, c }) => [`${a}^2 + ${b} · ${c}`, `${a * a} + ${b * c}`, `${a * a + b * c}`],
      },
      {
        id: 'potencia-y-luego-producto',
        porque: bien('la potencia y el producto se hacen antes de sumar, en el orden que sea.', 'the power and the multiplication come before adding, in any order.'),
        lineas: ({ a, b, c }) => [`${a}^2 + ${b} · ${c}`, `${a}^2 + ${b * c}`, `${a * a} + ${b * c}`, `${a * a + b * c}`],
      },
      {
        id: 'potencia-como-producto',
        porque: bien(`una potencia es un producto de factores iguales.`, 'a power is a product of equal factors.'),
        lineas: ({ a, b, c }) => [`${a}^2 + ${b} · ${c}`, `${a} · ${a} + ${b} · ${c}`, `${a * a} + ${b * c}`, `${a * a + b * c}`],
      },
    ],
    mal: [
      {
        id: 'potencia-por-dos',
        error: { linea: 1, nombre: 'potencia' },
        lineas: ({ a, b, c }) => [`${a}^2 + ${b} · ${c}`, `${a} · 2 + ${b} · ${c}`, `${2 * a} + ${b * c}`, `${2 * a + b * c}`],
      },
      {
        id: 'suma-antes-del-producto',
        error: { linea: 2, nombre: 'sumaAntes' },
        lineas: ({ a, b, c }) => [`${a}^2 + ${b} · ${c}`, `${a * a} + ${b} · ${c}`, `${a * a + b} · ${c}`, `${(a * a + b) * c}`],
      },
    ],
  },
  {
    id: 'resta-parentesis-resta',
    peso: 2,
    numeros: rng => {
      const b = rng.entero(5, 12), c = rng.entero(3, 9), d = rng.entero(1, 3);
      return { a: rng.entero(b + c + d + 3, 60), b, c, d };
    },
    bien: [
      {
        id: 'parentesis-primero',
        porque: bien('primero el paréntesis y después las restas, de izquierda a derecha.', 'first the brackets, then the subtractions from left to right.'),
        lineas: ({ a, b, c, d }) => [`${a} − (${b} + ${c}) − ${d}`, `${a} − ${b + c} − ${d}`, `${a - b - c} − ${d}`, `${a - b - c - d}`],
      },
      {
        id: 'quitar-parentesis',
        porque: bien('al quitar un paréntesis que va detrás de un menos, los sumandos pasan a restarse.', 'when you remove brackets after a minus sign, the numbers inside are subtracted.'),
        lineas: ({ a, b, c, d }) => [`${a} − (${b} + ${c}) − ${d}`, `${a} − ${b} − ${c} − ${d}`, `${a - b} − ${c} − ${d}`, `${a - b - c} − ${d}`, `${a - b - c - d}`],
      },
    ],
    mal: [
      {
        id: 'olvida-el-parentesis',
        error: { linea: 1, nombre: 'restaAntes' },
        lineas: ({ a, b, c, d }) => [`${a} − (${b} + ${c}) − ${d}`, `${a} − ${b} + ${c} − ${d}`, `${a - b + c} − ${d}`, `${a - b + c - d}`],
      },
      {
        id: 'resta-al-reves',
        error: { linea: 2, nombre: 'restaDerIzq' },
        lineas: ({ a, b, c, d }) => [`${a} − (${b} + ${c}) − ${d}`, `${a} − ${b + c} − ${d}`, `${a} − ${b + c - d}`, `${a - (b + c - d)}`],
      },
    ],
  },
  {
    id: 'producto-por-potencia',
    peso: 2,
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(3, 9) }),
    bien: [
      {
        id: 'potencia-y-producto',
        porque: bien('la potencia va antes que el producto.', 'the power comes before the multiplication.'),
        lineas: ({ a, b }) => [`${a} · ${b}^2`, `${a} · ${b * b}`, `${a * b * b}`],
      },
      {
        id: 'producto-de-factores',
        porque: bien('la potencia se escribe como un producto y se multiplica de izquierda a derecha.', 'the power is written as a product and multiplied from left to right.'),
        lineas: ({ a, b }) => [`${a} · ${b}^2`, `${a} · ${b} · ${b}`, `${a * b} · ${b}`, `${a * b * b}`],
      },
    ],
    mal: [
      {
        id: 'potencia-por-dos',
        error: { linea: 1, nombre: 'potencia' },
        lineas: ({ a, b }) => [`${a} · ${b}^2`, `${a} · ${2 * b}`, `${2 * a * b}`],
      },
      {
        id: 'exponente-al-producto',
        error: { linea: 1, nombre: 'expProducto' },
        lineas: ({ a, b }) => [`${a} · ${b}^2`, `(${a} · ${b})^2`, `${a * b}^2`, `${(a * b) ** 2}`],
      },
    ],
  },
  {
    id: 'cuadrado-de-suma',
    peso: 2,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b }; },
    bien: [
      {
        id: 'suma-y-cuadrado',
        porque: bien('primero el paréntesis y después se eleva al cuadrado todo el resultado.', 'first the brackets, then the whole result is squared.'),
        lineas: ({ a, b }) => [`(${a} + ${b})^2`, `${a + b}^2`, `${(a + b) ** 2}`],
      },
      {
        id: 'suma-y-producto',
        porque: bien('primero el paréntesis; después el cuadrado se escribe como el producto de dos factores iguales.', 'first the brackets; then the square is written as a product of two equal factors.'),
        lineas: ({ a, b }) => [`(${a} + ${b})^2`, `${a + b}^2`, `${a + b} · ${a + b}`, `${(a + b) ** 2}`],
      },
    ],
    mal: [
      {
        id: 'exponente-a-cada-sumando',
        error: { linea: 1, nombre: 'expSuma' },
        lineas: ({ a, b }) => [`(${a} + ${b})^2`, `${a}^2 + ${b}^2`, `${a * a} + ${b * b}`, `${a * a + b * b}`],
      },
      {
        id: 'cuadrado-por-dos',
        error: { linea: 1, nombre: 'potencia' },
        lineas: ({ a, b }) => [`(${a} + ${b})^2`, `${a + b} · 2`, `${2 * (a + b)}`],
      },
    ],
  },
  {
    id: 'raiz-mas-producto',
    peso: 1,
    numeros: rng => ({ n: rng.elegir(CUADRADOS_PARES), k: rng.entero(2, 9), j: rng.entero(2, 9) }),
    bien: [
      {
        id: 'raiz-primero',
        porque: ({ n }) => bien(`la raíz de ${n} es ${Math.sqrt(n)}, porque ${Math.sqrt(n)} · ${Math.sqrt(n)} = ${n}; el producto va antes de sumar.`,
          `the square root of ${n} is ${Math.sqrt(n)}, because ${Math.sqrt(n)} · ${Math.sqrt(n)} = ${n}; the multiplication comes before adding.`),
        lineas: ({ n, k, j }) => [`√${n} + ${k} · ${j}`, `${Math.sqrt(n)} + ${k} · ${j}`, `${Math.sqrt(n)} + ${k * j}`, `${Math.sqrt(n) + k * j}`],
      },
      {
        id: 'producto-primero',
        porque: ({ n }) => bien(`el producto se hace antes de sumar y la raíz de ${n} es ${Math.sqrt(n)}.`,
          `the multiplication is done before adding and the square root of ${n} is ${Math.sqrt(n)}.`),
        lineas: ({ n, k, j }) => [`√${n} + ${k} · ${j}`, `√${n} + ${k * j}`, `${Math.sqrt(n)} + ${k * j}`, `${Math.sqrt(n) + k * j}`],
      },
    ],
    mal: [
      {
        id: 'raiz-es-la-mitad',
        error: { linea: 1, nombre: 'raizMitad' },
        excluidos: ['potencia'],
        lineas: ({ n, k, j }) => [`√${n} + ${k} · ${j}`, `${n} : 2 + ${k} · ${j}`, `${n / 2} + ${k * j}`, `${n / 2 + k * j}`],
      },
    ],
  },
  {
    id: 'productos-independientes',
    peso: 1,
    numeros: rng => {
      const [a, b] = par(rng, 2, 9);
      let [c, d] = par(rng, 2, 9);
      while (a * b === c * d) [c, d] = par(rng, 2, 9);
      return { a, b, c, d };
    },
    bien: [
      {
        id: 'dos-productos-a-la-vez',
        porque: bien('los dos productos no dependen uno de otro, así que se hacen en el mismo paso.', 'the two multiplications do not depend on each other, so they are done in the same step.'),
        lineas: ({ a, b, c, d }) => [`${a} · ${b} + ${c} · ${d}`, `${a * b} + ${c * d}`, `${a * b + c * d}`],
      },
      {
        id: 'un-producto-por-linea',
        porque: bien('se hace un producto en cada línea y luego se suma.', 'one multiplication is done in each line and then the numbers are added.'),
        lineas: ({ a, b, c, d }) => [`${a} · ${b} + ${c} · ${d}`, `${a * b} + ${c} · ${d}`, `${a * b} + ${c * d}`, `${a * b + c * d}`],
      },
    ],
    mal: [
      {
        id: 'suma-antes-del-segundo-producto',
        error: { linea: 2, nombre: 'sumaAntes' },
        lineas: ({ a, b, c, d }) => [`${a} · ${b} + ${c} · ${d}`, `${a * b} + ${c} · ${d}`, `${a * b + c} · ${d}`, `${(a * b + c) * d}`],
      },
    ],
  },
];

export const SORTEO = FAMILIAS.flatMap(f => Array(f.peso).fill(f));
export const FAMILIA_POR_ID = Object.fromEntries(FAMILIAS.map(f => [f.id, f]));
