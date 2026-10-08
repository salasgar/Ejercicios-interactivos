// Práctica «El exponente y su base»: lógica pura (sin DOM ni red).

// --- Ejercicio 1: ¿a qué afecta el exponente? -----------------------------------
//
// Cinco formas de expresión; cada una tiene una «base del exponente» (lo que de
// verdad se eleva) y, en las que llevan paréntesis, un «decoy» interior (el
// último número dentro del grupo, que es el error típico de creer que solo él
// se eleva).

export const FORMAS = ['simple', 'grupo', 'suma', 'sumagrupo', 'intermedia'];

/** El identificador de región que es la base correcta, según la forma. */
export function idBaseDe(forma) {
  return forma === 'simple' || forma === 'suma' ? 'b' : 'grupo';
}

function numero(rng, min = 2, max = 9) {
  return rng.entero(min, max);
}

/** Las regiones tocables de cada forma (ids de los data-id de la práctica). */
export const REGIONES = {
  simple: ['a', 'b'],
  suma: ['a', 'b'],
  grupo: ['b', 'grupo'],
  sumagrupo: ['b', 'grupo'],
  intermedia: ['a', 'c', 'grupo'],
};

/**
 * Una parte de la expresión: { forma, a, b, c, e }. Se descartan los números con los
 * que tocar una región equivocada daría el mismo valor (3 · 3², 5 · (2 + 3)²), porque
 * entonces «lo que has tocado daría…» no se notaría.
 */
export function generarParte(rng) {
  for (;;) {
    const forma = rng.elegir(FORMAS);
    const e = rng.elegir([2, 3]);
    const a = numero(rng);
    const b = numero(rng);
    const p = forma === 'intermedia' ? { forma, a, b, c: numero(rng), e } : { forma, a, b, e };
    if (REGIONES[forma].every(id => id === idBaseDe(forma) || valorTocado(p, id) !== valorParte(p))) return p;
  }
}

/** El valor que saldría si el exponente afectara a la región tocada `id`. */
export function valorTocado(p, id) {
  if (id === idBaseDe(p.forma)) return valorParte(p);
  if (p.forma === 'simple') return p.a ** p.e * p.b;
  if (p.forma === 'suma') return p.a ** p.e + p.b;
  if (p.forma === 'intermedia' && id === 'a') return p.a ** p.e * (p.b + p.c);
  return valorErroneoParte(p); // grupo, sumagrupo e intermedia con la c: elevar solo el último número
}

/** El valor correcto de una parte (la base del exponente es la que manda). */
export function valorParte(p) {
  if (p.forma === 'simple') return p.a * p.b ** p.e;
  if (p.forma === 'suma') return p.a + p.b ** p.e;
  if (p.forma === 'grupo') return (p.a * p.b) ** p.e;
  if (p.forma === 'sumagrupo') return (p.a + p.b) ** p.e;
  return p.a * (p.b + p.c) ** p.e; // intermedia
}

/** El valor que saldría con el error típico (elevar solo el decoy, o solo la base sin el resto). */
export function valorErroneoParte(p) {
  if (p.forma === 'simple') return (p.a * p.b) ** p.e; // eleva el producto entero
  if (p.forma === 'suma') return (p.a + p.b) ** p.e; // eleva la suma entera
  if (p.forma === 'grupo') return p.a * p.b ** p.e; // eleva solo el último número
  if (p.forma === 'sumagrupo') return p.a + p.b ** p.e; // eleva solo el último sumando
  return p.a * (p.b + p.c ** p.e); // intermedia: eleva solo el último número del grupo
}

/** La cuenta con la base correcta, paso a paso: «2 · 5² = 2 · 25 = 50». */
export function cuentaParte(p) {
  const { a, b, c, e } = p;
  if (p.forma === 'simple') return `${a} · ${b}<sup>${e}</sup> = ${a} · ${b ** e} = ${valorParte(p)}`;
  if (p.forma === 'suma') return `${a} + ${b}<sup>${e}</sup> = ${a} + ${b ** e} = ${valorParte(p)}`;
  if (p.forma === 'grupo') return `(${a} · ${b})<sup>${e}</sup> = ${a * b}<sup>${e}</sup> = ${valorParte(p)}`;
  if (p.forma === 'sumagrupo') return `(${a} + ${b})<sup>${e}</sup> = ${a + b}<sup>${e}</sup> = ${valorParte(p)}`;
  return `${a} · (${b} + ${c})<sup>${e}</sup> = ${a} · ${b + c}<sup>${e}</sup> = ${a} · ${(b + c) ** e} = ${valorParte(p)}`;
}

/** La cuenta del error típico: lo que saldría si el exponente afectara a otra parte. */
export function cuentaErronea(p) {
  const { a, b, c, e } = p;
  if (p.forma === 'simple') return `(${a} · ${b})<sup>${e}</sup> = ${a * b}<sup>${e}</sup> = ${valorErroneoParte(p)}`;
  if (p.forma === 'suma') return `(${a} + ${b})<sup>${e}</sup> = ${a + b}<sup>${e}</sup> = ${valorErroneoParte(p)}`;
  if (p.forma === 'grupo') return `${a} · ${b}<sup>${e}</sup> = ${a} · ${b ** e} = ${valorErroneoParte(p)}`;
  if (p.forma === 'sumagrupo') return `${a} + ${b}<sup>${e}</sup> = ${a} + ${b ** e} = ${valorErroneoParte(p)}`;
  return `${a} · (${b} + ${c}<sup>${e}</sup>) = ${a} · (${b} + ${c ** e}) = ${valorErroneoParte(p)}`;
}

/** La cuenta de lo que el alumno ha tocado: el exponente afectando solo a esa región. */
export function cuentaTocada(p, id) {
  const { a, b, c, e } = p;
  const v = valorTocado(p, id);
  if (p.forma === 'simple') return `${a}<sup>${e}</sup> · ${b} = ${a ** e} · ${b} = ${v}`;
  if (p.forma === 'suma') return `${a}<sup>${e}</sup> + ${b} = ${a ** e} + ${b} = ${v}`;
  if (p.forma === 'intermedia' && id === 'a') return `${a}<sup>${e}</sup> · (${b} + ${c}) = ${a ** e} · ${b + c} = ${v}`;
  return cuentaErronea(p); // grupo, sumagrupo e intermedia con la c
}

/** Lectura en inglés de una potencia: «three to the power of four». */
const PALABRAS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
export function lecturaIngles(base, exponente) {
  if (exponente === 2) return `${PALABRAS[base]} squared`;
  if (exponente === 3) return `${PALABRAS[base]} cubed`;
  return `${PALABRAS[base]} to the power of ${PALABRAS[exponente]}`;
}

/** Ítem: { tipo: 'alcance', partes: [parte] o [parte, parte], preguntada }. */
export function generarAlcance(rng) {
  const dosPartes = rng.azar() < 0.3;
  const partes = dosPartes ? [generarParte(rng), generarParte(rng)] : [generarParte(rng)];
  const preguntada = dosPartes ? rng.entero(0, 1) : 0;
  return { tipo: 'alcance', partes, preguntada };
}

/** ¿La región tocada es la base del exponente de la parte preguntada? */
export function aciertaAlcance(item, idSeleccionado) {
  return idSeleccionado === idBaseDe(item.partes[item.preguntada].forma);
}

// --- Ejercicio 2: multiplicación repetida ---------------------------------------

const BASES_REPETIDA = [2, 3, 4, 5, 6, 7, 8, 9];
const EXPONENTES_REPETIDA = [2, 3, 4];

/** Ítem «repetida»: construir base^exponente como producto repetido con fichas. */
export function generarRepetida(rng) {
  const base = rng.elegir(BASES_REPETIDA);
  const exponente = rng.elegir(EXPONENTES_REPETIDA);
  const necesarias = [];
  for (let i = 0; i < exponente; i++) {
    if (i > 0) necesarias.push({ valor: '·', tipo: 'op' });
    necesarias.push({ valor: base, tipo: 'num' });
  }
  const valorPotencia = base ** exponente;
  const productoSimple = base * exponente;
  const decoys = [{ valor: valorPotencia, tipo: 'num' }, { valor: productoSimple, tipo: 'num' }, { valor: '·', tipo: 'op' }];
  const fichas = rng.barajar([...necesarias, ...decoys]).map((f, i) => ({ ...f, id: i }));
  return { tipo: 'repetida', base, exponente, fichas };
}

/** La secuencia correcta de fichas: [base, '·', base, '·', …] (exponente veces la base). */
export function secuenciaCorrecta(item) {
  const r = [];
  for (let i = 0; i < item.exponente; i++) {
    if (i > 0) r.push('·');
    r.push(item.base);
  }
  return r;
}

/** ¿La secuencia formada por el alumno es exactamente la correcta? */
export function aciertaRepetida(item, secuencia) {
  const correcta = secuenciaCorrecta(item);
  return correcta.length === secuencia.length && correcta.every((v, i) => v === secuencia[i]);
}

/** Ítem «potencia»: dado el producto repetido, construir base^exponente con steppers. */
export function generarPotencia(rng) {
  const base = rng.elegir(BASES_REPETIDA);
  const exponente = rng.elegir(EXPONENTES_REPETIDA);
  return { tipo: 'potencia', base, exponente };
}

export function aciertaPotencia(item, base, exponente) {
  return base === item.base && exponente === item.exponente;
}

/** Ítem del ejercicio 2: 'repetida', 'potencia' o 'valor', a partes iguales. */
export function generarMultiplicacion(rng) {
  const r = rng.azar();
  if (r < 1 / 3) return generarRepetida(rng);
  if (r < 2 / 3) return generarPotencia(rng);
  return generarValor(rng);
}

/** Ítem «valor»: ¿cuánto vale base^exponente?, con cuatro opciones distintas. */
export function generarValor(rng) {
  const base = rng.elegir(BASES_REPETIDA);
  const exponente = rng.elegir(EXPONENTES_REPETIDA);
  const correcta = base ** exponente;
  const candidatos = new Set([correcta]);
  const opciones = [correcta];
  const intentar = valor => {
    if (Number.isInteger(valor) && valor > 0 && !candidatos.has(valor)) {
      candidatos.add(valor);
      opciones.push(valor);
      return true;
    }
    return false;
  };
  intentar(base * exponente);
  intentar(exponente ** base);
  for (let delta = base, intentos = 0; opciones.length < 4 && intentos < 20; delta += base, intentos++) {
    if (!intentar(correcta - delta)) intentar(correcta + delta);
  }
  while (opciones.length < 4) { // red de seguridad, no debería hacer falta nunca
    const extra = correcta + opciones.length * 7 + 1;
    intentar(extra);
  }
  return { tipo: 'valor', base, exponente, opciones: rng.barajar(opciones), correcta };
}

// --- Ejercicio 3: el cuadrado de la suma, con áreas -----------------------------

const LADOS_AREAS = [2, 3, 4, 5, 6];

/** Ítem «areas»: cuadrado de lado a+b, con la variante de comparar con (a·b)². */
export function generarAreas(rng) {
  const a = rng.elegir(LADOS_AREAS);
  const b = rng.elegir(LADOS_AREAS);
  const variante = rng.azar() < 0.3;
  return { tipo: 'areas', a, b, variante };
}

/** Las dos preguntas del ítem y sus respuestas correctas. */
export function respuestasAreas(item) {
  if (item.variante) {
    return { pregunta1: (item.a * item.b) ** 2, pregunta2: item.a ** 2 * item.b ** 2 };
  }
  return { pregunta1: (item.a + item.b) ** 2, pregunta2: item.a ** 2 + item.b ** 2 };
}

export function aciertaAreas(item, respuesta1, respuesta2) {
  const { pregunta1, pregunta2 } = respuestasAreas(item);
  return respuesta1 === pregunta1 && respuesta2 === pregunta2;
}
