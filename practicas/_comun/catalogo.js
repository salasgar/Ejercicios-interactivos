// Catálogo de las prácticas de la unidad 2. Lo fija el reparto PU2 (ficha de
// la tarea 01): el `id` viaja dentro del código de resultado, así que NO se
// renumera ni se reordena. `ruta` es relativa a `practicas/`; `nEjercicios` es
// el número de ejercicios que la práctica tiene que declarar (la base lo
// comprueba al arrancar). `disponible` decide si la portada la enlaza.
//
// Las que siguen con `disponible: false` existen y funcionan, pero la revisión
// final (tarea 18, 2026-10-08) encontró en ellas algo que penaliza una
// respuesta correcta o que no se puede contestar. Cada una tiene su reapertura
// en `reparto-practicas-u2/hechos/reabiertas/`; quien la cierre pone aquí su
// `disponible: true` (solo ese campo de su fila).

export const CATALOGO = [
  { id: 0, slug: 'divisores', ruta: '../divisores/', nombre: { es: 'Divisor, múltiplo, divisible', en: 'Divisor, multiple, divisible' }, nEjercicios: 6, disponible: true },
  { id: 1, slug: 'semaforo', ruta: 'semaforo/', nombre: { es: 'Semáforo de divisibilidad', en: 'Divisibility traffic light' }, nEjercicios: 4, disponible: true },
  { id: 2, slug: 'rectangulos', ruta: 'rectangulos/', nombre: { es: 'Divisores por parejas', en: 'Divisors in pairs' }, nEjercicios: 3, disponible: true },
  { id: 3, slug: 'recta', ruta: 'recta/', nombre: { es: 'Múltiplos y divisores en la recta', en: 'Multiples and divisors on the number line' }, nEjercicios: 3, disponible: true },
  { id: 4, slug: 'criba', ruta: 'criba/', nombre: { es: 'Criba y números primos', en: 'Sieve and prime numbers' }, nEjercicios: 3, disponible: true },
  { id: 5, slug: 'arbol', ruta: 'arbol/', nombre: { es: 'Árbol de factores', en: 'Factor tree' }, nEjercicios: 3, disponible: true },
  { id: 6, slug: 'divisiones', ruta: 'divisiones/', nombre: { es: 'Divisiones sucesivas', en: 'Repeated division' }, nEjercicios: 3, disponible: true },
  { id: 7, slug: 'fabrica', ruta: 'fabrica/', nombre: { es: 'Fábrica de divisores', en: 'Divisor factory' }, nEjercicios: 3, disponible: true },
  { id: 8, slug: 'venn', ruta: 'venn/', nombre: { es: 'm.c.d. y m.c.m. con factores primos', en: 'GCD and LCM with prime factors' }, nEjercicios: 4, disponible: true },
  { id: 9, slug: 'imposibles', ruta: 'imposibles/', nombre: { es: 'Detector de imposibles', en: 'Impossible answers' }, nEjercicios: 3, disponible: true },
  { id: 10, slug: 'clasificador', ruta: 'clasificador/', nombre: { es: '¿m.c.d. o m.c.m.?', en: 'GCD or LCM?' }, nEjercicios: 3, disponible: true },
  { id: 11, slug: 'reloj', ruta: 'reloj/', nombre: { es: 'Reloj de coincidencias', en: 'Coincidence clock' }, nEjercicios: 3, disponible: true },
  { id: 12, slug: 'baldosas', ruta: 'baldosas/', nombre: { es: 'Baldosas y cuerdas', en: 'Tiles and ropes' }, nEjercicios: 3, disponible: true },
  { id: 13, slug: 'errores', ruta: 'errores/', nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: true },
  { id: 14, slug: 'leelo', ruta: 'leelo/', nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 3, disponible: true },
  { id: 15, slug: 'factorizaciones', ruta: 'factorizaciones/', nombre: { es: 'Operar con factorizaciones', en: 'Working with factorisations' }, nEjercicios: 3, disponible: true },
  { id: 16, slug: 'parentesis', ruta: 'parentesis/', nombre: { es: 'Coloca los paréntesis (repaso de la unidad 1)', en: 'Place the brackets (unit 1 review)' }, nEjercicios: 4, disponible: true },
  { id: 17, slug: 'jerarquia', ruta: 'jerarquia/', nombre: { es: '¿Qué se hace primero? (repaso de la unidad 1)', en: 'What comes first? (unit 1 review)' }, nEjercicios: 4, disponible: true },
  { id: 18, slug: 'exponente', ruta: 'exponente/', nombre: { es: 'El exponente y su base (repaso de la unidad 1)', en: 'The index and its base (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 19, slug: 'raiz', ruta: 'raiz/', nombre: { es: 'Raíz cuadrada con cuadrados (repaso de la unidad 1)', en: 'Square roots with squares (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 20, slug: 'division', ruta: 'division/', nombre: { es: 'División entera: cajas y resto (repaso de la unidad 1)', en: 'Division with remainder: boxes (unit 1 review)' }, nEjercicios: 4, disponible: true },
  { id: 21, slug: 'expresion', ruta: 'expresion/', nombre: { es: 'Del enunciado a la expresión (repaso de la unidad 1)', en: 'From words to expression (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 22, slug: 'redondeo', ruta: 'redondeo/', nombre: { es: 'Redondeo y estimación (repaso de la unidad 1)', en: 'Rounding and estimating (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 23, slug: 'constructor', ruta: 'constructor/', nombre: { es: 'Constructor de números (repaso de la unidad 1)', en: 'Number builder (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 24, slug: 'distributiva', ruta: 'distributiva/', nombre: { es: 'Distributiva con rectángulos (repaso de la unidad 1)', en: 'Distributive property with rectangles (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 25, slug: 'potencias10', ruta: 'potencias10/', nombre: { es: 'Potencias de 10 y números grandes (repaso de la unidad 1)', en: 'Powers of 10 and big numbers (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 26, slug: 'dictado', ruta: 'dictado/', nombre: { es: 'Dictado de números (repaso de la unidad 1)', en: 'Number dictation (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 27, slug: 'mental', ruta: 'mental/', nombre: { es: 'Cálculo mental con estrategia (repaso de la unidad 1)', en: 'Mental maths strategies (unit 1 review)' }, nEjercicios: 3, disponible: true },
  { id: 28, slug: 'especiales', ruta: 'especiales/', nombre: { es: 'Potencias especiales: ¿verdadero o falso? (repaso de la unidad 1)', en: 'Special powers: true or false? (unit 1 review)' }, nEjercicios: 2, disponible: true },
  { id: 29, slug: 'errores1', ruta: 'errores1/', nombre: { es: 'Caza el error (unidad 1)', en: 'Spot the mistake (unit 1)' }, nEjercicios: 3, disponible: false },
  { id: 30, slug: 'propiedades', ruta: 'propiedades/', nombre: { es: 'Propiedades de las potencias (ampliación de la unidad 1)', en: 'Laws of indices (unit 1 extension)' }, nEjercicios: 3, disponible: true },
  // La plantilla es el ejemplo del contrato: funciona, pero no sale en la portada.
  { id: 31, slug: 'plantilla', ruta: 'plantilla/', nombre: { es: 'Práctica de plantilla', en: 'Template practice' }, nEjercicios: 2, disponible: true },
];

/** Id de la práctica de plantilla (la portada no la enseña). */
export const ID_PLANTILLA = 31;

/** El código de resultado tiene sitio para seis ejercicios por práctica. */
export const MAX_EJERCICIOS = 6;

export function practicaPorSlug(slug) {
  return CATALOGO.find(p => p.slug === slug) ?? null;
}

export function practicaPorId(id) {
  return CATALOGO.find(p => p.id === id) ?? null;
}
