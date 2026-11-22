// Práctica «Caza el error de la unidad 1»: textos propios y el banco de procedimientos.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): producto con «·»;
// división «:» en español y «÷» en inglés; inglés sencillo; sin letras como
// incógnita; nada que no se haya dado (números naturales, sin negativos).
//
// Una plantilla es un procedimiento de alumno de 2 a 4 líneas:
//   { id, error, excluidos?, numeros(rng) → params, lineas(params) → [{ es, en }],
//     corregida(params) | porque(params) → { es, en } }
// `error` es null (el procedimiento está bien) o { linea (desde 0), nombre }.
// Los exponentes se escriben `2^3`; la interfaz los pinta con <sup>.
//
// Los desarrollos en cadena (`cad`) son una expresión por línea, con «= »
// delante de las siguientes. Cada paso de un desarrollo bien escrito resuelve
// una o varias operaciones INDEPENDIENTES a la vez, pero nunca dos operaciones
// que dependen una de otra (eso es «saltarse un resultado intermedio»). Saltarse un
// paso NO es un error en los ejercicios 1-3 (todas sus igualdades son verdaderas y se
// ve «Está bien»); solo se pregunta por ello en el ejercicio 4, con el banco PASOS.
// Un paréntesis redundante, `7 + (3 · 2)`, no es un error.

// ─── Nombres de los errores (lista cerrada) ────────────────────────────────────

export const NOMBRES = {
  sumaAntes: { es: 'Ha hecho la suma antes que el producto.', en: 'Added before multiplying.' },
  restaAntes: { es: 'Ha restado antes de resolver el paréntesis.', en: 'Subtracted before working out the brackets.' },
  restaDerIzq: { es: 'Ha hecho la resta de derecha a izquierda.', en: 'Subtracted from right to left.' },
  potencia: { es: 'Ha tratado la potencia como un producto.', en: 'Treated a power as a product.' },
  expSuma: { es: 'Ha repartido el exponente en la suma.', en: 'Shared the exponent over the sum.' },
  expProducto: { es: 'Ha aplicado el exponente al producto entero.', en: 'Raised the whole product to the power.' },
  raizMitad: { es: 'Ha tomado la raíz como la mitad.', en: 'Took the square root as half.' },
  restoMayor: { es: 'Ha dejado un resto mayor que el divisor.', en: 'Left a remainder bigger than the divisor.' },
  redondeo: { es: 'Ha redondeado por defecto cuando tocaba por exceso.', en: 'Rounded down when it should have rounded up.' },
  olvidaParentesis: { es: 'Ha olvidado el paréntesis al traducir el enunciado.', en: 'Forgot the brackets when writing the statement as an expression.' },
};
export const CLAVES_NOMBRES = Object.keys(NOMBRES);

/** La regla que rompe cada error, para recordarla en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  sumaAntes: { es: 'La multiplicación se hace antes que la suma.', en: 'Multiplication comes before addition.' },
  restaAntes: { es: 'Primero se hace lo que hay dentro del paréntesis.', en: 'First you work out what is inside the brackets.' },
  restaDerIzq: { es: 'Las sumas y las restas se hacen de izquierda a derecha.', en: 'Additions and subtractions go from left to right.' },
  potencia: { es: 'Una potencia es un producto de factores iguales: el exponente dice cuántas veces se multiplica la base.', en: 'A power is a product of equal factors: the exponent says how many times you multiply the base.' },
  expSuma: { es: 'El exponente de un paréntesis no se reparte entre los sumandos: primero se suma y después se eleva.', en: 'The exponent of a bracket is not shared between the numbers you add: first add, then raise to the power.' },
  expProducto: { es: 'El exponente solo afecta al número que lleva justo debajo, y la potencia va antes que la multiplicación.', en: 'The exponent only applies to the number right below it, and the power comes before the multiplication.' },
  raizMitad: { es: 'La raíz cuadrada de un número es el número que, multiplicado por sí mismo, da el primero.', en: 'The square root of a number is the number that, multiplied by itself, gives the first one.' },
  restoMayor: { es: 'El resto de una división siempre es menor que el divisor.', en: 'The remainder of a division is always smaller than the divisor.' },
  redondeo: { es: 'Si la cifra siguiente es 5 o más, se redondea hacia arriba.', en: 'If the next digit is 5 or more, you round up.' },
  olvidaParentesis: { es: 'Si el enunciado pide hacer una suma o una resta antes, esa operación va entre paréntesis.', en: 'If the problem asks you to add or subtract first, that operation goes in brackets.' },
};

/**
 * Pares de nombres que podrían confundirse sobre un mismo procedimiento: ninguno
 * sale como distractor del otro (regla de oro: todo distractor, inequívocamente falso).
 */
export const CONFUNDIBLES = [
  ['sumaAntes', 'olvidaParentesis'],
  ['restaAntes', 'olvidaParentesis'],
  ['restaAntes', 'restaDerIzq'],
  ['expSuma', 'expProducto'],
  ['potencia', 'expProducto'],
];

// ─── Textos de la interfaz ─────────────────────────────────────────────────────

export const TX = {
  nombre: {
    hay: { es: '¿Hay un error?', en: 'Is there a mistake?' },
    linea: { es: 'Señala el paso', en: 'Point to the step' },
    nombre: { es: 'Nombra el error', en: 'Name the mistake' },
    pasos: { es: '¿Paso a paso?', en: 'Step by step?' },
  },
  detalle: {
    hay: { es: 'Un procedimiento de un alumno: ¿está bien o no?', en: 'A student\'s work: is it right or not?' },
    linea: { es: 'Este procedimiento tiene un error: toca la línea donde está', en: 'This work has a mistake: tap the line where it is' },
    nombre: { es: 'Este procedimiento tiene un error: ¿cuál es?', en: 'This work has a mistake: which one is it?' },
    pasos: { es: 'Las cuentas están bien: ¿se ha saltado algún paso?', en: 'The sums are right: is any step missing?' },
  },
  instruccion: {
    hay: { es: 'Mira el procedimiento. ¿Está bien o hay un error?', en: 'Look at the work. Is it right or is there a mistake?' },
    linea: { es: 'Hay un error. Toca la línea donde está.', en: 'There is a mistake. Tap the line where it is.' },
    nombre: { es: 'Hay un error. ¿Qué error ha cometido?', en: 'There is a mistake. What mistake was made?' },
    pasos: { es: 'Mira el procedimiento. ¿Se ha saltado algún paso?', en: 'Look at the work. Is any step missing?' },
  },
  introduccion_pasos: {
    es: '<p>Aquí <strong>no hay cuentas mal hechas</strong>: todas las igualdades son verdaderas. Lo que tienes que ver es si el alumno ha ido <strong>paso a paso</strong> o se ha saltado algún paso.</p><p>En un paso caben varias operaciones si son <strong>independientes</strong> (ninguna necesita el resultado de otra). Se salta un paso cuando, en la misma línea, se hace una operación con el resultado de otra operación que todavía no está escrito.</p>',
    en: '<p>Here <strong>no sum is wrong</strong>: every equality is true. You only have to see if the student worked <strong>step by step</strong> or skipped a step.</p><p>A step can have several operations if they are <strong>independent</strong> (none of them needs the result of another one). A step is skipped when, in one line, an operation uses the result of another operation that is not written yet.</p>',
  },
  si: { es: 'Sí, falta un paso', en: 'Yes, a step is missing' },
  no: { es: 'No, está paso a paso', en: 'No, it is step by step' },
  // `k` es el número de la línea (desde 1): falta un paso entre la línea k y la siguiente.
  falta_paso: {
    es: k => `Sí se ha saltado un paso, ${entreLineas(k - 1, k, 'es')}. Faltaría:`,
    en: k => `Yes, a step is missing, ${entreLineas(k - 1, k, 'en')}. This line is missing:`,
  },
  paso_a_paso: { es: 'No se ha saltado ninguno.', en: 'No step is missing.' },
  introduccion: {
    es: '<p>Cada ejercicio te enseña el trabajo de un alumno, línea a línea. La primera línea es lo que se pide. Hay trabajos con <strong>un solo error</strong> y trabajos <strong>sin error</strong>.</p><p>Ojo: hay cosas que parecen un error y no lo son (por ejemplo, un paréntesis que sobra, o hacer dos productos independientes en el mismo paso).</p>',
    en: '<p>Each exercise shows a student\'s work, line by line. The first line is the question. Some work has <strong>exactly one mistake</strong> and some has <strong>no mistake</strong>.</p><p>Careful: some things look like a mistake and are not (for example, brackets that are not needed, or doing two independent multiplications in the same step).</p>',
  },
  bien: { es: 'Está bien', en: 'It is right' },
  error: { es: 'Hay un error', en: 'There is a mistake' },
  esta_bien: { es: 'Está bien: no hay ningún error.', en: 'It is right: there is no mistake.' },
};

// ─── Ayudas del banco ──────────────────────────────────────────────────────────

const L = (es, en) => ({ es, en });
/** Un desarrollo: una expresión por línea, «= » delante de las siguientes (igual en los dos idiomas). */
const cad = exprs => exprs.map((e, i) => L(i ? `= ${e}` : e, i ? `= ${e}` : e));
/** Una frase con números, igual en los dos idiomas. */
const ig = t => L(t, t);

/** Un «a» y un «b» sin repetir nada raro. */
const par = (rng, min, max) => [rng.entero(min, max), rng.entero(min, max)];
/** Dos números DISTINTOS: donde se comparan dos operaciones («a² y b²») no pueden salir dos idénticas. */
const parDistinto = (rng, min, max) => {
  const a = rng.entero(min, max);
  let b = rng.entero(min, max - 1);
  if (b >= a) b += 1;
  return [a, b];
};

const CUADRADOS_PARES = [16, 36, 64, 100, 144, 196, 256, 324, 400];   // el 4 no: 4 : 2 = 2 = √4
const CUADRADOS = [16, 25, 36, 49, 64, 81, 100, 121, 144, 169];

/** Un número de 4 cifras con la cifra de las decenas ≥ 5 (o < 5) para redondear a las centenas. */
function numeroCentenas(rng, sube) {
  for (;;) {
    const n = rng.entero(1100, 9899);
    const d = Math.floor(n / 10) % 10;
    if (n % 100 !== 0 && (d >= 5) === sube) return n;
  }
}
/** Un número de 3 cifras con la cifra de las unidades ≥ 5 (o < 5) para redondear a las decenas. */
function numeroDecenas(rng, sube) {
  for (;;) {
    const n = rng.entero(110, 989);
    if (n % 10 !== 0 && (n % 10 >= 5) === sube) return n;
  }
}
const aCentenas = n => Math.round(n / 100) * 100;
const aDecenas = n => Math.round(n / 10) * 10;

// ─── El banco: 34 plantillas (21 con error, 13 sin error) ───────────────────────

export const PLANTILLAS = [
  // ── Con error ──
  {
    id: 'e-suma-antes-1',
    error: { linea: 1, nombre: 'sumaAntes' },
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => cad([`${a} + ${b} · ${c}`, `${a + b} · ${c}`, `${(a + b) * c}`]),
    corregida: ({ a, b, c }) => ig(`${a} + ${b} · ${c} = ${a} + ${b * c} = ${a + b * c}`),
  },
  {
    id: 'e-suma-antes-2',
    error: { linea: 1, nombre: 'sumaAntes' },
    numeros: rng => {
      const [a, b] = par(rng, 2, 9), c = rng.entero(2, 9);
      return { a, b, c, d: rng.entero(1, Math.min(9, a + b * c - 1)) };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} + ${b} · ${c} − ${d}`, `${a + b} · ${c} − ${d}`, `${(a + b) * c} − ${d}`, `${(a + b) * c - d}`]),
    corregida: ({ a, b, c, d }) => ig(`${a} + ${b} · ${c} − ${d} = ${a} + ${b * c} − ${d} = ${a + b * c} − ${d} = ${a + b * c - d}`),
  },
  {
    id: 'e-resta-antes',
    error: { linea: 1, nombre: 'restaAntes' },
    numeros: rng => { const b = rng.entero(5, 15), c = rng.entero(3, 9); return { a: rng.entero(b + c + 3, 60), b, c }; },
    lineas: ({ a, b, c }) => cad([`${a} − (${b} + ${c})`, `${a} − ${b} + ${c}`, `${a - b} + ${c}`, `${a - b + c}`]),
    corregida: ({ a, b, c }) => ig(`${a} − (${b} + ${c}) = ${a} − ${b + c} = ${a - b - c}`),
  },
  {
    id: 'e-resta-derecha-izquierda',
    error: { linea: 2, nombre: 'restaDerIzq' },
    numeros: rng => {
      const b = rng.entero(6, 15), c = rng.entero(4, 9), d = rng.entero(1, 3);
      return { a: rng.entero(b + c + d + 3, 70), b, c, d };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} − ${b} − ${c} − ${d}`, `${a - b} − ${c} − ${d}`, `${a - b} − ${c - d}`, `${a - b - (c - d)}`]),
    corregida: ({ a, b, c, d }) => ig(`${a} − ${b} − ${c} − ${d} = ${a - b} − ${c} − ${d} = ${a - b - c} − ${d} = ${a - b - c - d}`),
  },
  {
    id: 'e-potencia-suma',
    error: { linea: 1, nombre: 'potencia' },
    numeros: rng => ({ b: rng.elegir([2, 3, 5]), e: rng.elegir([3, 4]), k: rng.entero(2, 9) }),
    lineas: ({ b, e, k }) => cad([`${b}^${e} + ${k}`, `${b} · ${e} + ${k}`, `${b * e} + ${k}`, `${b * e + k}`]),
    corregida: ({ b, e, k }) => ig(`${b}^${e} + ${k} = ${Array(e).fill(b).join(' · ')} + ${k} = ${b ** e} + ${k} = ${b ** e + k}`),
  },
  {
    id: 'e-potencia-producto',
    error: { linea: 1, nombre: 'potencia' },
    numeros: rng => ({ k: rng.entero(2, 9), b: rng.entero(3, 9) }),
    lineas: ({ k, b }) => cad([`${k} · ${b}^2`, `${k} · ${2 * b}`, `${k * 2 * b}`]),
    corregida: ({ k, b }) => ig(`${k} · ${b}^2 = ${k} · ${b} · ${b} = ${k} · ${b * b} = ${k * b * b}`),
  },
  {
    id: 'e-exponente-suma',
    error: { linea: 1, nombre: 'expSuma' },
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b }; },
    lineas: ({ a, b }) => cad([`(${a} + ${b})^2`, `${a}^2 + ${b}^2`, `${a * a} + ${b * b}`, `${a * a + b * b}`]),
    corregida: ({ a, b }) => ig(`(${a} + ${b})^2 = ${a + b}^2 = ${(a + b) ** 2}`),
  },
  {
    id: 'e-exponente-producto',
    error: { linea: 1, nombre: 'expProducto' },
    numeros: rng => ({ a: rng.entero(2, 5), b: rng.entero(2, 6) }),
    lineas: ({ a, b }) => cad([`${a} · ${b}^2`, `(${a} · ${b})^2`, `${a * b}^2`, `${(a * b) ** 2}`]),
    corregida: ({ a, b }) => ig(`${a} · ${b}^2 = ${a} · ${b * b} = ${a * b * b}`),
  },
  {
    id: 'e-raiz-mitad',
    error: { linea: 1, nombre: 'raizMitad' },
    excluidos: ['potencia'],
    numeros: rng => ({ n: rng.elegir(CUADRADOS_PARES), k: rng.entero(2, 9) }),
    lineas: ({ n, k }) => [
      L(`Calculo √${n} + ${k}.`, `I work out √${n} + ${k}.`),
      L(`√${n} = ${n} : 2 = ${n / 2}`, `√${n} = ${n} ÷ 2 = ${n / 2}`),
      ig(`${n / 2} + ${k} = ${n / 2 + k}`),
    ],
    corregida: ({ n, k }) => {
      const r = Math.sqrt(n);
      return L(`√${n} = ${r}, porque ${r} · ${r} = ${n}. Luego ${r} + ${k} = ${r + k}.`, `√${n} = ${r}, because ${r} · ${r} = ${n}. So ${r} + ${k} = ${r + k}.`);
    },
  },
  {
    id: 'e-resto-mayor-division',
    error: { linea: 2, nombre: 'restoMayor' },
    numeros: rng => { const d = rng.entero(3, 9); return { d, q: rng.entero(2, 9), r0: rng.entero(1, d - 1) }; },
    lineas: ({ d, q, r0 }) => [
      L(`${d * q + r0} : ${d}`, `${d * q + r0} ÷ ${d}`),
      ig(`${d} · ${q - 1} = ${d * (q - 1)}`),
      L(`${d * q + r0} − ${d * (q - 1)} = ${r0 + d}, así que el cociente es ${q - 1} y el resto es ${r0 + d}.`, `${d * q + r0} − ${d * (q - 1)} = ${r0 + d}, so the quotient is ${q - 1} and the remainder is ${r0 + d}.`),
    ],
    corregida: ({ d, q, r0 }) => L(
      `Cociente ${q} y resto ${r0}, porque ${d} · ${q} + ${r0} = ${d * q + r0}. Con resto ${r0 + d}, aún cabía otro ${d}.`,
      `Quotient ${q} and remainder ${r0}, because ${d} · ${q} + ${r0} = ${d * q + r0}. With a remainder of ${r0 + d}, another ${d} still fitted.`),
  },
  {
    id: 'e-resto-mayor-cajas',
    error: { linea: 1, nombre: 'restoMayor' },
    numeros: rng => { const d = rng.entero(3, 9); return { d, q: rng.entero(3, 9), r0: rng.entero(1, d - 1) }; },
    lineas: ({ d, q, r0 }) => [
      L(`Tengo ${d * q + r0} caramelos y los meto en cajas de ${d}. ¿Cuántas cajas lleno y cuántos caramelos sobran?`, `I have ${d * q + r0} sweets and I put them in boxes of ${d}. How many boxes do I fill and how many sweets are left?`),
      L(`Lleno ${q - 1} cajas y sobran ${r0 + d} caramelos, porque ${d} · ${q - 1} + ${r0 + d} = ${d * q + r0}.`, `I fill ${q - 1} boxes and ${r0 + d} sweets are left, because ${d} · ${q - 1} + ${r0 + d} = ${d * q + r0}.`),
    ],
    corregida: ({ d, q, r0 }) => L(
      `Lleno ${q} cajas y sobran ${r0}, porque ${d} · ${q} + ${r0} = ${d * q + r0}. Con ${r0 + d} caramelos, aún cabía otra caja de ${d}.`,
      `I fill ${q} boxes and ${r0} are left, because ${d} · ${q} + ${r0} = ${d * q + r0}. With ${r0 + d} sweets, another box of ${d} still fitted.`),
  },
  {
    id: 'e-suma-antes-3',
    error: { linea: 2, nombre: 'sumaAntes' },
    numeros: rng => { const [b, c] = par(rng, 2, 9); return { a: rng.entero(2, 5), b, c, d: rng.entero(2, 9) }; },
    lineas: ({ a, b, c, d }) => cad([`${a}^2 + ${b} + ${c} · ${d}`, `${a * a} + ${b} + ${c} · ${d}`, `${a * a + b + c} · ${d}`, `${(a * a + b + c) * d}`]),
    corregida: ({ a, b, c, d }) => ig(`${a}^2 + ${b} + ${c} · ${d} = ${a * a} + ${b} + ${c * d} = ${a * a + b} + ${c * d} = ${a * a + b + c * d}`),
  },
  {
    id: 'e-potencia-numero',
    error: { linea: 2, nombre: 'potencia' },
    numeros: rng => { const [p, q] = par(rng, 2, 9); return { p, q, b: rng.elegir([2, 3, 5]), e: rng.elegir([3, 4]) }; },
    lineas: ({ p, q, b, e }) => cad([`${p} · ${q} + ${b}^${e}`, `${p * q} + ${b}^${e}`, `${p * q} + ${b * e}`, `${p * q + b * e}`]),
    corregida: ({ p, q, b, e }) => ig(`${p} · ${q} + ${b}^${e} = ${p * q} + ${b}^${e} = ${p * q} + ${b ** e} = ${p * q + b ** e}`),
  },
  {
    id: 'e-redondeo-centenas',
    error: { linea: 2, nombre: 'redondeo' },
    numeros: rng => ({ n: numeroCentenas(rng, true) }),
    lineas: ({ n }) => [
      L(`Redondeo ${n} a las centenas.`, `I round ${n} to the nearest hundred.`),
      L(`La cifra de las decenas es ${Math.floor(n / 10) % 10}, que es 5 o más.`, `The tens digit is ${Math.floor(n / 10) % 10}, which is 5 or more.`),
      L(`Dejo las centenas como están: ${Math.floor(n / 100) * 100}.`, `I keep the hundreds as they are: ${Math.floor(n / 100) * 100}.`),
    ],
    corregida: ({ n }) => L(
      `${n} se redondea a ${aCentenas(n)}.`,
      `${n} rounds to ${aCentenas(n)}.`),
  },
  {
    id: 'e-redondeo-decenas',
    error: { linea: 2, nombre: 'redondeo' },
    numeros: rng => ({ n: numeroDecenas(rng, true) }),
    lineas: ({ n }) => [
      L(`Redondeo ${n} a las decenas.`, `I round ${n} to the nearest ten.`),
      L(`La cifra de las unidades es ${n % 10}, que es 5 o más.`, `The units digit is ${n % 10}, which is 5 or more.`),
      L(`Dejo las decenas como están: ${Math.floor(n / 10) * 10}.`, `I keep the tens as they are: ${Math.floor(n / 10) * 10}.`),
    ],
    corregida: ({ n }) => L(
      `${n} se redondea a ${aDecenas(n)}.`,
      `${n} rounds to ${aDecenas(n)}.`),
  },
  {
    id: 'e-olvida-parentesis-suma',
    error: { linea: 1, nombre: 'olvidaParentesis' },
    excluidos: ['sumaAntes'],
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => [
      L(`Sumo ${a} y ${b} y multiplico el resultado por ${c}.`, `I add ${a} and ${b} and multiply the result by ${c}.`),
      L(`Escribo: ${a} + ${b} · ${c}`, `I write: ${a} + ${b} · ${c}`),
      ig(`${a} + ${b * c} = ${a + b * c}`),
    ],
    corregida: ({ a, b, c }) => ig(`(${a} + ${b}) · ${c} = ${a + b} · ${c} = ${(a + b) * c}`),
  },
  {
    id: 'e-olvida-parentesis-resta',
    error: { linea: 1, nombre: 'olvidaParentesis' },
    excluidos: ['restaAntes'],
    numeros: rng => { const b = rng.entero(3, 12), c = rng.entero(3, 9); return { a: rng.entero(b + c + 3, 60), b, c }; },
    lineas: ({ a, b, c }) => [
      L(`A ${a} le resto la suma de ${b} y ${c}.`, `From ${a} I take away the sum of ${b} and ${c}.`),
      L(`Escribo: ${a} − ${b} + ${c}`, `I write: ${a} − ${b} + ${c}`),
      ig(`${a - b} + ${c} = ${a - b + c}`),
    ],
    corregida: ({ a, b, c }) => ig(`${a} − (${b} + ${c}) = ${a} − ${b + c} = ${a - b - c}`),
  },

  // ── Sin error ──
  {
    id: 'b-parentesis-redundante',
    error: null,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => cad([`${a} + (${b} · ${c})`, `${a} + ${b * c}`, `${a + b * c}`]),
    porque: ({ b, c }) => L(
      `Está bien: el paréntesis de (${b} · ${c}) sobra, porque el producto ya iba primero, pero no es un error.`,
      `It is right: the brackets around (${b} · ${c}) are not needed, because the multiplication comes first anyway, but that is not a mistake.`),
  },
  {
    id: 'b-con-y-sin-parentesis',
    error: null,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => [
      ig(`${a} + (${b} · ${c}) = ${a + b * c}`),
      ig(`${a} + ${b} · ${c} = ${a + b * c}`),
      L(`Con paréntesis o sin ellos, el resultado es ${a + b * c}.`, `With or without brackets, the answer is ${a + b * c}.`),
    ],
    porque: ({ a, b, c }) => L(
      `Está bien: ${a} + (${b} · ${c}) y ${a} + ${b} · ${c} son lo mismo, porque el producto va primero.`,
      `It is right: ${a} + (${b} · ${c}) and ${a} + ${b} · ${c} are the same, because the multiplication comes first.`),
  },
  {
    id: 'b-independientes-productos',
    error: null,
    numeros: rng => {
      const [a, b] = par(rng, 2, 9);
      let [c, d] = par(rng, 2, 9);
      // «a · b y c · d» nunca son la misma operación (ni con los factores cambiados de orden).
      while (Math.min(a, b) === Math.min(c, d) && Math.max(a, b) === Math.max(c, d)) [c, d] = par(rng, 2, 9);
      return { a, b, c, d };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} · ${b} + ${c} · ${d}`, `${a * b} + ${c * d}`, `${a * b + c * d}`]),
    porque: ({ a, b, c, d }) => L(
      `Está bien: ${a} · ${b} y ${c} · ${d} no dependen una de otra, así que se pueden hacer en el mismo paso.`,
      `It is right: ${a} · ${b} and ${c} · ${d} do not depend on each other, so they can be done in the same step.`),
  },
  {
    id: 'b-independientes-potencias',
    error: null,
    numeros: rng => { const [a, b] = parDistinto(rng, 2, 9); return { a, b }; },
    lineas: ({ a, b }) => cad([`${a}^2 + ${b}^2`, `${a * a} + ${b * b}`, `${a * a + b * b}`]),
    porque: ({ a, b }) => L(
      `Está bien: ${a}^2 y ${b}^2 no dependen una de otra, así que se pueden hacer en el mismo paso.`,
      `It is right: ${a}^2 and ${b}^2 do not depend on each other, so they can be done in the same step.`),
  },
  {
    id: 'b-brackets-parentheses',
    error: null,
    numeros: rng => { const [b, c] = par(rng, 2, 9); return { a: rng.entero(2, 9), b, c, palabra: rng.elegir(['brackets', 'parentheses']) }; },
    lineas: ({ a, b, c, palabra }) => [
      ig(`${a} · (${b} + ${c})`),
      L(`Primero lo de dentro del paréntesis: ${b} + ${c} = ${b + c}.`, `First what is inside the ${palabra}: ${b} + ${c} = ${b + c}.`),
      ig(`${a} · ${b + c} = ${a * (b + c)}.`),
    ],
    porque: ({ palabra }) => L(
      'Está bien: lo de dentro del paréntesis se hace primero.',
      `It is right: what is inside the ${palabra} is done first. In English, “brackets” and “parentheses” mean the same.`),
  },
  {
    id: 'b-times-multiplied-by',
    error: null,
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 9), c: rng.entero(2, 9), v: rng.elegir(['corta', 'larga']) }),
    lineas: ({ a, b, c, v }) => [
      v === 'corta'
        ? L(`Calculo ${a} por ${b} más ${c}.`, `I work out ${a} times ${b} plus ${c}.`)
        : L(`Calculo ${a} multiplicado por ${b} más ${c}.`, `I work out ${a} multiplied by ${b} plus ${c}.`),
      ig(`${a} · ${b} = ${a * b}`),
      ig(`${a * b} + ${c} = ${a * b + c}`),
    ],
    porque: ({ v }) => v === 'corta'
      ? L('Está bien: el producto se hace antes de sumar.', 'It is right: the multiplication is done before adding. “Times” and “multiplied by” mean the same.')
      : L('Está bien: el producto se hace antes de sumar. «Por» y «multiplicado por» significan lo mismo.', 'It is right: the multiplication is done before adding. “Multiplied by” and “times” mean the same.'),
  },
  {
    id: 'b-potencia-suma-ok',
    error: null,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b }; },
    lineas: ({ a, b }) => cad([`(${a} + ${b})^2`, `${a + b}^2`, `${(a + b) ** 2}`]),
    porque: ({ a, b }) => L(
      `Está bien: primero el paréntesis, ${a} + ${b} = ${a + b}, y después se eleva al cuadrado todo el resultado.`,
      `It is right: first the brackets, ${a} + ${b} = ${a + b}, and then the whole result is squared.`),
  },
  {
    id: 'b-potencia-producto-ok',
    error: null,
    numeros: rng => ({ a: rng.entero(2, 5), b: rng.entero(2, 6), c: rng.entero(2, 9) }),
    lineas: ({ a, b, c }) => cad([`${a} · ${b}^2 + ${c}`, `${a} · ${b * b} + ${c}`, `${a * b * b} + ${c}`, `${a * b * b + c}`]),
    porque: ({ b }) => L(
      `Está bien: primero la potencia (${b}^2), después el producto y por último la suma.`,
      `It is right: first the power (${b}^2), then the multiplication and finally the addition.`),
  },
  {
    id: 'b-resta-ok',
    error: null,
    numeros: rng => { const b = rng.entero(6, 15), c = rng.entero(2, 5); return { a: rng.entero(b + c + 3, 60), b, c }; },
    lineas: ({ a, b, c }) => cad([`${a} − ${b} − ${c}`, `${a - b} − ${c}`, `${a - b - c}`]),
    porque: () => L(
      'Está bien: las restas se hacen de izquierda a derecha.',
      'It is right: subtractions are done from left to right.'),
  },
  {
    id: 'b-raiz-ok',
    error: null,
    numeros: rng => ({ n: rng.elegir(CUADRADOS), k: rng.entero(2, 9) }),
    lineas: ({ n, k }) => {
      const r = Math.sqrt(n);
      return [
        L(`Calculo √${n} + ${k}.`, `I work out √${n} + ${k}.`),
        L(`√${n} = ${r}, porque ${r} · ${r} = ${n}`, `√${n} = ${r}, because ${r} · ${r} = ${n}`),
        ig(`${r} + ${k} = ${r + k}`),
      ];
    },
    porque: ({ n }) => L(
      `Está bien: la raíz cuadrada de ${n} es el número que multiplicado por sí mismo da ${n}.`,
      `It is right: the square root of ${n} is the number that gives ${n} when multiplied by itself.`),
  },
  {
    id: 'b-resto-ok',
    error: null,
    numeros: rng => { const d = rng.entero(3, 9); return { d, q: rng.entero(2, 9), r: rng.entero(1, d - 1) }; },
    lineas: ({ d, q, r }) => [
      L(`${d * q + r} : ${d}`, `${d * q + r} ÷ ${d}`),
      L(`Cociente ${q} y resto ${r}, porque ${d} · ${q} + ${r} = ${d * q + r}, y ${r} es menor que ${d}.`, `Quotient ${q} and remainder ${r}, because ${d} · ${q} + ${r} = ${d * q + r}, and ${r} is smaller than ${d}.`),
    ],
    porque: ({ d, r }) => L(
      `Está bien: el resto ${r} es menor que el divisor ${d}.`,
      `It is right: the remainder ${r} is smaller than the divisor ${d}.`),
  },
  {
    id: 'b-redondeo-ok',
    error: null,
    numeros: rng => {
      const sube = rng.azar() < 0.5, centenas = rng.azar() < 0.5;
      return { sube, centenas, n: centenas ? numeroCentenas(rng, sube) : numeroDecenas(rng, sube) };
    },
    lineas: ({ n, sube, centenas }) => {
      const dig = centenas ? Math.floor(n / 10) % 10 : n % 10;
      const r = centenas ? aCentenas(n) : aDecenas(n);
      return [
        centenas ? L(`Redondeo ${n} a las centenas.`, `I round ${n} to the nearest hundred.`) : L(`Redondeo ${n} a las decenas.`, `I round ${n} to the nearest ten.`),
        centenas
          ? (sube ? L(`La cifra de las decenas es ${dig}, que es 5 o más.`, `The tens digit is ${dig}, which is 5 or more.`) : L(`La cifra de las decenas es ${dig}, que es menos de 5.`, `The tens digit is ${dig}, which is less than 5.`))
          : (sube ? L(`La cifra de las unidades es ${dig}, que es 5 o más.`, `The units digit is ${dig}, which is 5 or more.`) : L(`La cifra de las unidades es ${dig}, que es menos de 5.`, `The units digit is ${dig}, which is less than 5.`)),
        sube
          ? L(`Redondeo hacia arriba, a ${centenas ? 'la centena' : 'la decena'} siguiente: ${r}.`, `I round up, to the next ${centenas ? 'hundred' : 'ten'}: ${r}.`)
          : L(`Dejo ${centenas ? 'las centenas' : 'las decenas'} como están: ${r}.`, `I keep the ${centenas ? 'hundreds' : 'tens'} as they are: ${r}.`),
      ];
    },
    porque: ({ sube }) => sube
      ? L('Está bien: con 5 o más se sube.', 'It is right: with 5 or more you round up.')
      : L('Está bien: con menos de 5 se deja igual.', 'It is right: with less than 5 you round down.'),
  },
  {
    id: 'b-parentesis-traduccion-ok',
    error: null,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => [
      L(`Sumo ${a} y ${b} y multiplico el resultado por ${c}.`, `I add ${a} and ${b} and multiply the result by ${c}.`),
      L(`Escribo: (${a} + ${b}) · ${c}`, `I write: (${a} + ${b}) · ${c}`),
      ig(`${a + b} · ${c} = ${(a + b) * c}`),
    ],
    porque: () => L(
      'Está bien: la suma va entre paréntesis porque se hace antes que el producto.',
      'It is right: the sum goes in brackets because it is done before the multiplication.'),
  },
];

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

// ─── Ejercicio 4: ¿paso a paso? ────────────────────────────────────────────────
//
// Todas las igualdades son verdaderas. Una plantilla es un desarrollo en cadena:
//   { id, salta, entre?, numeros(rng) → params, lineas(params) → [{ es, en }],
//     falta(params) → línea que falta (solo si salta) y `entre`: se escribiría entre la línea
//     `entre` y la siguiente (contando desde 1; por defecto, entre las dos últimas), porque(params) → { es, en } }
// `salta` es la etiqueta declarada; el test la comprueba con un evaluador propio
// (un paso es válido si solo resuelve operaciones cuyos dos operandos ya son números).

export const PASOS = [
  // ── Se ha saltado un paso ──
  {
    id: 's-resta-producto',
    salta: true,
    entre: 1,
    numeros: rng => {
      const b = rng.entero(2, 6), c = rng.entero(2, 6);
      return { a: rng.entero(b * c + 1, 50), b, c, d: rng.entero(2, 9) };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} − ${b} · ${c} + ${d}`, `${a - b * c} + ${d}`, `${a - b * c + d}`]),
    falta: ({ a, b, c, d }) => `${a} − ${b * c} + ${d}`,
    porque: ({ b, c }) => L(
      `Primero el producto ${b} · ${c}, y después la resta y la suma.`,
      `First the product ${b} · ${c}, then the subtraction and the addition.`),
  },
  {
    id: 's-potencia-producto',
    salta: true,
    entre: 1,
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 6), c: rng.entero(2, 5) }),
    lineas: ({ a, b, c }) => cad([`${a} + ${b} · ${c}^2`, `${a} + ${b * c * c}`, `${a + b * c * c}`]),
    falta: ({ a, b, c }) => `${a} + ${b} · ${c * c}`,
    porque: ({ b, c }) => L(
      `Primero la potencia ${c}^2, después el producto por ${b}.`,
      `First the power ${c}^2, then the product by ${b}.`),
  },
  {
    id: 's-parentesis-producto',
    salta: true,
    numeros: rng => {
      const [a, b] = par(rng, 2, 9), c = rng.entero(2, 6);
      return { a, b, c, d: rng.entero(2, 9) };
    },
    lineas: ({ a, b, c, d }) => cad([`(${a} + ${b}) · ${c} − ${d}`, `${a + b} · ${c} − ${d}`, `${(a + b) * c - d}`]),
    falta: ({ a, b, c, d }) => `${(a + b) * c} − ${d}`,
    porque: ({ a, b, c }) => L(
      `Primero el producto ${a + b} · ${c}, después la resta.`,
      `First the product ${a + b} · ${c}, then the subtraction.`),
  },
  {
    id: 's-potencia-suma',
    salta: true,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b, c: rng.entero(2, 9) }; },
    lineas: ({ a, b, c }) => cad([`${a}^2 + ${b} · ${c}`, `${a * a} + ${b} · ${c}`, `${a * a + b * c}`]),
    falta: ({ a, b, c }) => `${a * a} + ${b * c}`,
    porque: ({ b, c }) => L(
      `Primero el producto ${b} · ${c}, después la suma.`,
      `First the product ${b} · ${c}, then the addition.`),
  },
  {
    id: 's-raiz-producto',
    salta: true,
    numeros: rng => {
      const r = rng.elegir([4, 5, 6, 7, 8, 9]), b = rng.entero(2, 5);
      return { r, b, d: rng.entero(1, b * r - 1) };
    },
    lineas: ({ r, b, d }) => cad([`${b} · √${r * r} − ${d}`, `${b} · ${r} − ${d}`, `${b * r - d}`]),
    falta: ({ r, b, d }) => `${b * r} − ${d}`,
    porque: ({ r, b }) => L(
      `Primero el producto ${b} · ${r}, después la resta.`,
      `First the product ${b} · ${r}, then the subtraction.`),
  },
  {
    id: 's-parentesis-resta',
    salta: true,
    numeros: rng => {
      const c = rng.entero(5, 12), d = rng.entero(2, 4);
      return { a: rng.entero(2, 9), b: rng.entero(2, 6), c, d };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} + ${b} · (${c} − ${d})`, `${a} + ${b} · ${c - d}`, `${a + b * (c - d)}`]),
    falta: ({ a, b, c, d }) => `${a} + ${b * (c - d)}`,
    porque: ({ a, b, c, d }) => L(
      `Primero el producto ${b} · ${c - d}, después la suma de ${a}.`,
      `First the product ${b} · ${c - d}, then add ${a}.`),
  },
  {
    id: 's-potencia-producto-2',
    salta: true,
    numeros: rng => ({ a: rng.entero(2, 6), b: rng.entero(2, 5), c: rng.entero(2, 5) }),
    lineas: ({ a, b, c }) => cad([`${a} · ${b}^2 − ${c}`, `${a} · ${b * b} − ${c}`, `${a * b * b - c}`]),
    falta: ({ a, b, c }) => `${a * b * b} − ${c}`,
    porque: ({ a, b }) => L(
      `Primero el producto ${a} · ${b * b}, después la resta.`,
      `First the product ${a} · ${b * b}, then the subtraction.`),
  },
  // ── Paso a paso (una operación por línea, o varias independientes) ──
  {
    id: 'p-una-por-linea',
    salta: false,
    numeros: rng => {
      const [a, b] = par(rng, 2, 9), c = rng.entero(2, 9);
      return { a, b, c, d: rng.entero(1, Math.min(9, a + b * c - 1)) };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} + ${b} · ${c} − ${d}`, `${a} + ${b * c} − ${d}`, `${a + b * c} − ${d}`, `${a + b * c - d}`]),
    porque: () => L('Cada línea resuelve una sola operación.', 'Each line works out one operation only.'),
  },
  {
    id: 'p-dos-independientes',
    salta: false,
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 9), c: rng.entero(2, 6) }),
    lineas: ({ a, b, c }) => cad([`${a} · ${b} + ${c}^2`, `${a * b} + ${c * c}`, `${a * b + c * c}`]),
    porque: ({ a, b, c }) => L(
      `${a} · ${b} y ${c}^2 no dependen una de otra: caben en el mismo paso.`,
      `${a} · ${b} and ${c}^2 do not depend on each other: they fit in the same step.`),
  },
  {
    id: 'p-potencia-producto',
    salta: false,
    numeros: rng => ({ a: rng.entero(2, 5), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    lineas: ({ a, b, c }) => cad([`${a}^2 + ${b} · ${c}`, `${a * a} + ${b * c}`, `${a * a + b * c}`]),
    porque: ({ a, b, c }) => L(
      `${a}^2 y ${b} · ${c} no dependen una de otra: caben en el mismo paso.`,
      `${a}^2 and ${b} · ${c} do not depend on each other: they fit in the same step.`),
  },
  {
    id: 'p-dos-parentesis',
    salta: false,
    numeros: rng => {
      const [a, b] = par(rng, 2, 8), c = rng.entero(5, 12);
      return { a, b, c, d: rng.entero(2, c - 1) };
    },
    lineas: ({ a, b, c, d }) => cad([`(${a} + ${b}) · (${c} − ${d})`, `${a + b} · ${c - d}`, `${(a + b) * (c - d)}`]),
    porque: ({ a, b, c, d }) => L(
      `${a} + ${b} y ${c} − ${d} no dependen una de otra: caben en el mismo paso.`,
      `${a} + ${b} and ${c} − ${d} do not depend on each other: they fit in the same step.`),
  },
  {
    id: 'p-raiz-producto',
    salta: false,
    numeros: rng => ({ r: rng.elegir([4, 5, 6, 7, 8, 9]), b: rng.entero(2, 9), c: rng.entero(2, 9) }),
    lineas: ({ r, b, c }) => cad([`√${r * r} + ${b} · ${c}`, `${r} + ${b * c}`, `${r + b * c}`]),
    porque: ({ r, b, c }) => L(
      `√${r * r} y ${b} · ${c} no dependen una de otra: caben en el mismo paso.`,
      `√${r * r} and ${b} · ${c} do not depend on each other: they fit in the same step.`),
  },
  {
    id: 'p-dos-productos',
    salta: false,
    numeros: rng => {
      const a = rng.entero(4, 9), b = rng.entero(4, 9), c = rng.entero(2, 3), d = rng.entero(2, 3);
      return { a, b, c, d };
    },
    lineas: ({ a, b, c, d }) => cad([`${a} · ${b} − ${c} · ${d}`, `${a * b} − ${c * d}`, `${a * b - c * d}`]),
    porque: ({ a, b, c, d }) => L(
      `${a} · ${b} y ${c} · ${d} no dependen una de otra: caben en el mismo paso.`,
      `${a} · ${b} and ${c} · ${d} do not depend on each other: they fit in the same step.`),
  },
  {
    id: 'p-potencia-una',
    salta: false,
    numeros: rng => ({ a: rng.entero(2, 9), b: rng.entero(2, 5), c: rng.entero(2, 5) }),
    lineas: ({ a, b, c }) => cad([`${a} + ${b}^2 · ${c}`, `${a} + ${b * b} · ${c}`, `${a} + ${b * b * c}`, `${a + b * b * c}`]),
    porque: () => L('Cada línea resuelve una sola operación.', 'Each line works out one operation only.'),
  },
  {
    id: 'p-parentesis-resta',
    salta: false,
    numeros: rng => { const b = rng.entero(5, 15), c = rng.entero(3, 9); return { a: rng.entero(b + c + 3, 60), b, c }; },
    lineas: ({ a, b, c }) => cad([`${a} − (${b} + ${c})`, `${a} − ${b + c}`, `${a - b - c}`]),
    porque: () => L('Cada línea resuelve una sola operación.', 'Each line works out one operation only.'),
  },
];

export const PASOS_POR_ID = Object.fromEntries(PASOS.map(p => [p.id, p]));

// ─── Explicaciones («No lo sé» y feedback) ─────────────────────────────────────

import { esc } from '../_comun/textos.js';
import { errorEnLinea, lineaN, entreLineas, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

/** Texto de una línea a HTML seguro, con los exponentes `2^3` como <sup>. */
export const html = texto => esc(texto).replace(/\^(\d+)/g, '<sup>$1</sup>');

/** La línea mala del ítem, en un <span>, sin número. */
const lineaMala = (item, tt) => `<span class="linea-mala">${html(tt(item.lineas[item.error.linea]))}</span>`;
/** «Lo correcto es: …» con la cuenta bien hecha de la plantilla. */
const loCorrecto = (item, tt) => `${tt(LO_CORRECTO)} ${html(minuscula(tt(PLANTILLA_POR_ID[item.plantilla].corregida(item.params))))}`;
const regla = (item, tt) => reglaEnNegrita(html(tt(REGLAS[item.error.nombre])));

/** La explicación del ítem, con sus números: la corrección (con error) o por qué no era error (sin error). */
export function explicacion(item, { tt, idioma }) {
  const plantilla = PLANTILLA_POR_ID[item.plantilla];
  if (!item.error) {
    // Los `porque` ya empiezan por «Está bien: …»: no se repite el arranque.
    const porque = tt(plantilla.porque(item.params));
    return /^(Está bien|It is right)/.test(porque) ? html(porque) : `${tt(TX.esta_bien)} ${html(porque)}`;
  }
  // JL, 22-11: la línea con ordinal y sin número delante, el error como frase, la regla rota en negrita y lo correcto.
  return `${errorEnLinea(item.error.linea, idioma)} ${lineaMala(item, tt)}<br>${esc(tt(NOMBRES[item.error.nombre]))}${regla(item, tt)}${loCorrecto(item, tt)}`;
}

/** Feedback del ejercicio 4: la línea que falta con sus números, o por qué caben las operaciones en un paso. */
export function explicacionPasos(item, { tt }) {
  const plantilla = PASOS_POR_ID[item.plantilla];
  if (item.salta) {
    const k = plantilla.entre ?? item.lineas.length - 1;
    return `${tt(TX.falta_paso)(k)} ${html(`= ${plantilla.falta(item.params)}`)}<br>${html(tt(plantilla.porque(item.params)))}`;
  }
  return `${tt(TX.paso_a_paso)} ${html(tt(plantilla.porque(item.params)))}`;
}

// ─── «No lo sé»: la regla del ejercicio, la línea mala y cómo se hace bien, y la respuesta (revisión 193) ───
//
// La tarjeta no copia el feedback (`explicacion`, `explicacionPasos`): le faltaba la regla delante, cerraba con
// «La respuesta es: …» (dos puntos entre verbo y atributo), en el ej. 3 el nombre del error salía en el cuerpo y
// otra vez como respuesta, y en los ej. 1 y 4 el veredicto («Está bien», «Sí se ha saltado…») iba al principio y
// al final. Mismo formato que `practicas/errores/` (la de la U2).

const REGLA = {
  hay: { es: 'Repasa cada línea: sus cuentas y la regla que usa. Si alguna falla, hay un error.', en: 'Check each line: its calculations and the rule it uses. If one of them fails, there is a mistake.' },
  linea: { es: 'Repasa las líneas en orden y para en la primera cuya cuenta o regla falla.', en: 'Check the lines in order and stop at the first one with a wrong calculation or a wrong rule.' },
  nombre: { es: 'Busca la línea mala y compárala con cómo se hace bien: lo que cambia da el nombre del error.', en: 'Find the wrong line and compare it with the right way: what is different gives the name of the mistake.' },
  pasos: {
    es: 'En un paso caben varias operaciones si ninguna necesita el resultado de otra; si lo necesita, ese resultado se escribe antes, en su propia línea.',
    en: 'A step can have several operations if none of them needs the result of another one; if it does, that result is written first, in its own line.',
  },
};
const FALLA = { es: 'Esta línea falla:', en: 'This line is wrong:' };
const FALTA_LINEA = {
  es: k => `${mayuscula(entreLineas(k - 1, k, 'es'))} falta esta:`,
  en: k => `This line is missing ${entreLineas(k - 1, k, 'en')}:`,
};
const mayuscula = t => t[0].toUpperCase() + t.slice(1);
const RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cierre = (idioma, txt) => `<p><strong>${RESPUESTA[idioma]} ${txt}.</strong></p>`;
const entreComillas = (idioma, txt) => (idioma === 'es' ? `«${txt}»` : `“${txt}”`);
const sinPunto = txt => txt.replace(/\.$/, '');
/** Minúscula tras dos puntos («Bien hecho sería: con 5 o más…»). */
const minuscula = txt => (/^[A-ZÁÉÍÓÚ][a-záéíóúñ]/.test(txt) ? txt[0].toLowerCase() + txt.slice(1) : txt);

/**
 * La línea mala, qué error es, la regla rota en negrita y cómo queda bien hecha (JL, 22-11). En el ej. 2 la línea es
 * la respuesta: aquí se cita sin decir cuál es. En el ej. 3 el nombre del error es la respuesta: aquí no sale.
 */
function malaYBuena(item, { tt, idioma }, ej = 'hay') {
  const mala = ej === 'linea' ? `${tt(FALLA)} ${lineaMala(item, tt)}` : `${errorEnLinea(item.error.linea, idioma)} ${lineaMala(item, tt)}`;
  const nombre = ej === 'nombre' ? '' : `<br>${esc(tt(NOMBRES[item.error.nombre]))}`;
  return `<p>${mala}${nombre}${regla(item, tt)}${loCorrecto(item, tt)}</p>`;
}

/** Sin error: el porqué de la plantilla sin su «Está bien:» (la respuesta ya lo dice al final). */
function porQueEstaBien(item, { tt }) {
  const porque = tt(PLANTILLA_POR_ID[item.plantilla].porque(item.params)).replace(/^(Está bien|It is right): /, '');
  return `<p>${html(porque[0].toUpperCase() + porque.slice(1))}</p>`;
}

/** «No lo sé» del ejercicio 1: ¿está bien o hay un error? */
export function explicaHay(item, ctx) {
  const { tt, idioma } = ctx;
  const cuerpo = item.error ? malaYBuena(item, ctx) : porQueEstaBien(item, ctx);
  return `<p>${tt(REGLA.hay)}</p>${cuerpo}${cierre(idioma, entreComillas(idioma, esc(tt(item.error ? TX.error : TX.bien))))}`;
}

/** «No lo sé» del ejercicio 2: la primera línea que está mal. */
export function explicaLinea(item, ctx) {
  const { tt, idioma } = ctx;
  return `<p>${tt(REGLA.linea)}</p>${malaYBuena(item, ctx, 'linea')}${cierre(idioma, lineaN(item.solucion, idioma))}`;
}

/** «No lo sé» del ejercicio 3: el nombre del error (solo al final). */
export function explicaNombre(item, ctx) {
  const { tt, idioma } = ctx;
  return `<p>${tt(REGLA.nombre)}</p>${malaYBuena(item, ctx, 'nombre')}${cierre(idioma, entreComillas(idioma, esc(sinPunto(tt(NOMBRES[item.solucion])))))}`;
}

/** «No lo sé» del ejercicio 4: ¿falta un paso? La línea que falta con sus números, o por qué caben en un paso. */
export function explicaPasos(item, ctx) {
  const { tt, idioma } = ctx;
  const plantilla = PASOS_POR_ID[item.plantilla];
  const porque = html(tt(plantilla.porque(item.params)));
  let cuerpo = `<p>${porque}</p>`;
  if (item.salta) {
    const k = plantilla.entre ?? item.lineas.length - 1;
    cuerpo = `<p>${tt(FALTA_LINEA)(k)} <span class="cuenta">${html(`= ${plantilla.falta(item.params)}`)}</span><br>${porque}</p>`;
  }
  return `<p>${tt(REGLA.pasos)}</p>${cuerpo}${cierre(idioma, entreComillas(idioma, esc(tt(item.solucion === 'si' ? TX.si : TX.no))))}`;
}
