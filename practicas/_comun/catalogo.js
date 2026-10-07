// Catálogo de las prácticas de la unidad 2. Lo fija el reparto PU2 (ficha de
// la tarea 01): el `id` viaja dentro del código de resultado, así que NO se
// renumera ni se reordena. `ruta` es relativa a `practicas/`; `nEjercicios` es
// el número de ejercicios que la práctica tiene que declarar (la base lo
// comprueba al arrancar). `disponible` decide si la portada la enlaza.

export const CATALOGO = [
  { id: 0, slug: 'divisores', ruta: '../divisores/', nombre: { es: 'Divisor, múltiplo, divisible', en: 'Divisor, multiple, divisible' }, nEjercicios: 5, disponible: true },
  { id: 1, slug: 'semaforo', ruta: 'semaforo/', nombre: { es: 'Semáforo de divisibilidad', en: 'Divisibility traffic light' }, nEjercicios: 4, disponible: false },
  { id: 2, slug: 'rectangulos', ruta: 'rectangulos/', nombre: { es: 'Divisores por parejas', en: 'Divisors in pairs' }, nEjercicios: 3, disponible: false },
  { id: 3, slug: 'recta', ruta: 'recta/', nombre: { es: 'Múltiplos y divisores en la recta', en: 'Multiples and divisors on the number line' }, nEjercicios: 3, disponible: false },
  { id: 4, slug: 'criba', ruta: 'criba/', nombre: { es: 'Criba y números primos', en: 'Sieve and prime numbers' }, nEjercicios: 3, disponible: false },
  { id: 5, slug: 'arbol', ruta: 'arbol/', nombre: { es: 'Árbol de factores', en: 'Factor tree' }, nEjercicios: 3, disponible: false },
  { id: 6, slug: 'divisiones', ruta: 'divisiones/', nombre: { es: 'Divisiones sucesivas', en: 'Repeated division' }, nEjercicios: 3, disponible: false },
  { id: 7, slug: 'fabrica', ruta: 'fabrica/', nombre: { es: 'Fábrica de divisores', en: 'Divisor factory' }, nEjercicios: 3, disponible: false },
  { id: 8, slug: 'venn', ruta: 'venn/', nombre: { es: 'm.c.d. y m.c.m. con factores primos', en: 'GCD and LCM with prime factors' }, nEjercicios: 4, disponible: false },
  { id: 9, slug: 'imposibles', ruta: 'imposibles/', nombre: { es: 'Detector de imposibles', en: 'Impossible answers' }, nEjercicios: 3, disponible: false },
  { id: 10, slug: 'clasificador', ruta: 'clasificador/', nombre: { es: '¿m.c.d. o m.c.m.?', en: 'GCD or LCM?' }, nEjercicios: 3, disponible: false },
  { id: 11, slug: 'reloj', ruta: 'reloj/', nombre: { es: 'Reloj de coincidencias', en: 'Coincidence clock' }, nEjercicios: 3, disponible: false },
  { id: 12, slug: 'baldosas', ruta: 'baldosas/', nombre: { es: 'Baldosas y cuerdas', en: 'Tiles and ropes' }, nEjercicios: 3, disponible: false },
  { id: 13, slug: 'errores', ruta: 'errores/', nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: false },
  { id: 14, slug: 'leelo', ruta: 'leelo/', nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 3, disponible: false },
  { id: 15, slug: 'factorizaciones', ruta: 'factorizaciones/', nombre: { es: 'Operar con factorizaciones', en: 'Working with factorisations' }, nEjercicios: 3, disponible: false },
  { id: 16, slug: 'parentesis', ruta: 'parentesis/', nombre: { es: 'Coloca los paréntesis (repaso de la unidad 1)', en: 'Place the brackets (unit 1 review)' }, nEjercicios: 4, disponible: false },
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
