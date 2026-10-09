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
  falta_paso: {
    es: k => `Sí se ha saltado un paso, entre las líneas ${k} y ${k + 1}. Faltaría:`,
    en: k => `Yes, a step is missing, between lines ${k} and ${k + 1}. This line is missing:`,
  },
  paso_a_paso: { es: 'No se ha saltado ninguno.', en: 'No step is missing.' },
  introduccion: {
    es: '<p>Cada ejercicio te enseña el trabajo de un alumno, con las líneas numeradas. Hay trabajos con <strong>un solo error</strong> y trabajos <strong>sin error</strong>.</p><p>Ojo: hay cosas que parecen un error y no lo son (por ejemplo, un paréntesis que sobra, o hacer dos productos independientes en el mismo paso).</p>',
    en: '<p>Each exercise shows a student\'s work, with numbered lines. Some work has <strong>exactly one mistake</strong> and some has <strong>no mistake</strong>.</p><p>Careful: some things look like a mistake and are not (for example, brackets that are not needed, or doing two independent multiplications in the same step).</p>',
  },
  bien: { es: 'Está bien', en: 'It is right' },
  error: { es: 'Hay un error', en: 'There is a mistake' },
  linea: { es: 'Línea', en: 'Line' },
  esta_bien: { es: 'Está bien: no hay ningún error.', en: 'It is right: there is no mistake.' },
  hay_error_en: { es: n => `Hay un error, en la línea ${n}.`, en: n => `There is a mistake, in line ${n}.` },
  la_linea_es: { es: n => `El error está en la línea ${n}.`, en: n => `The mistake is in line ${n}.` },
  era: { es: 'Era:', en: 'It was:' },
  correcta: { es: 'Bien hecho sería:', en: 'The right way is:' },
};

// ─── Ayudas del banco ──────────────────────────────────────────────────────────

const L = (es, en) => ({ es, en });
/** Un desarrollo: una expresión por línea, «= » delante de las siguientes (igual en los dos idiomas). */
const cad = exprs => exprs.map((e, i) => L(i ? `= ${e}` : e, i ? `= ${e}` : e));
/** Una frase con números, igual en los dos idiomas. */
const ig = t => L(t, t);

/** Un «a» y un «b» sin repetir nada raro. */
const par = (rng, min, max) => [rng.entero(min, max), rng.entero(min, max)];

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
      `El resto ${r0 + d} no es menor que ${d}: aún cabe otro ${d}. Bien: cociente ${q} y resto ${r0}, porque ${d} · ${q} + ${r0} = ${d * q + r0}.`,
      `The remainder ${r0 + d} is not smaller than ${d}: another ${d} still fits. Right: quotient ${q} and remainder ${r0}, because ${d} · ${q} + ${r0} = ${d * q + r0}.`),
  },
  {
    id: 'e-resto-mayor-cajas',
    error: { linea: 1, nombre: 'restoMayor' },
    numeros: rng => { const d = rng.entero(3, 9); return { d, q: rng.entero(3, 9), r0: rng.entero(1, d - 1) }; },
    lineas: ({ d, q, r0 }) => [
      L(`Tengo ${d * q + r0} caramelos y los meto en cajas de ${d}: lleno todas las cajas que puedo.`, `I have ${d * q + r0} sweets and I put them in boxes of ${d}: I fill as many boxes as I can.`),
      L(`Lleno ${q - 1} cajas y sobran ${r0 + d} caramelos, porque ${d} · ${q - 1} + ${r0 + d} = ${d * q + r0}.`, `I fill ${q - 1} boxes and ${r0 + d} sweets are left, because ${d} · ${q - 1} + ${r0 + d} = ${d * q + r0}.`),
    ],
    corregida: ({ d, q, r0 }) => L(
      `Si sobran ${r0 + d}, aún cabe otra caja de ${d}. Bien: ${q} cajas llenas y sobran ${r0}, porque ${d} · ${q} + ${r0} = ${d * q + r0}.`,
      `If ${r0 + d} are left, another box of ${d} still fits. Right: ${q} full boxes and ${r0} left, because ${d} · ${q} + ${r0} = ${d * q + r0}.`),
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
      `Con 5 o más se redondea hacia arriba, a la centena siguiente: ${n} ≈ ${aCentenas(n)}.`,
      `With 5 or more you round up, to the next hundred: ${n} ≈ ${aCentenas(n)}.`),
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
      `Con 5 o más se redondea hacia arriba, a la decena siguiente: ${n} ≈ ${aDecenas(n)}.`,
      `With 5 or more you round up, to the next ten: ${n} ≈ ${aDecenas(n)}.`),
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
    numeros: rng => { const [a, b] = par(rng, 2, 9), [c, d] = par(rng, 2, 9); return { a, b, c, d }; },
    lineas: ({ a, b, c, d }) => cad([`${a} · ${b} + ${c} · ${d}`, `${a * b} + ${c * d}`, `${a * b + c * d}`]),
    porque: ({ a, b, c, d }) => L(
      `Está bien: ${a} · ${b} y ${c} · ${d} no dependen una de otra, así que se pueden hacer en el mismo paso.`,
      `It is right: ${a} · ${b} and ${c} · ${d} do not depend on each other, so they can be done in the same step.`),
  },
  {
    id: 'b-independientes-potencias',
    error: null,
    numeros: rng => { const [a, b] = par(rng, 2, 9); return { a, b }; },
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
