// Catálogo de las prácticas de la unidad 2. Lo fija el reparto PU2 (ficha de
// la tarea 01): el `id` lo usan el panel y el progreso guardado, así que NO se
// renumera ni se reordena; una práctica nueva lleva el siguiente entero libre
// (ya no hay tope: el código de resultado por práctica, que limitaba los ids a
// 0-31, se eliminó el 2026-10-16). `ruta` es relativa a `practicas/`;
// `nEjercicios` es el número de ejercicios que la práctica tiene que declarar
// (la base lo comprueba al arrancar). `disponible` decide si la portada la enlaza.
// `unidad` es la unidad del curso a la que pertenece (ver UNIDADES, más abajo);
// la plantilla lleva `null` y no sale nunca en la portada.
//
// Las que siguen con `disponible: false` existen y funcionan, pero la revisión
// final (tarea 18, 2026-10-08) encontró en ellas algo que penaliza una
// respuesta correcta o que no se puede contestar. Cada una tiene su reapertura
// en `reparto-practicas-u2/hechos/reabiertas/`; quien la cierre pone aquí su
// `disponible: true` (solo ese campo de su fila).
//
// `quitados` (opcional): ejercicios que la práctica tenía y ya no tiene. El
// progreso se guarda por posición (lista `ej`, en el navegador y en la nube),
// así que una lista guardada antes del cambio no casa con los ejercicios de
// ahora. `{ antes: 3, posiciones: [1] }` dice que la práctica tenía 3
// ejercicios y se quitó el 1 (empezando en 1). `adaptarProgreso` (abajo) quita
// esas posiciones de toda lista que tenga exactamente `antes` elementos, y
// todo lo que lee un `ej` guardado pasa por ella antes de fusionar o contar.
// Un ejercicio nuevo va siempre al final (la lista corta de antes sigue
// valiendo tal cual). OJO: si una práctica con `quitados` vuelve a tener
// `antes` ejercicios, las listas nuevas se confundirían con las viejas; antes
// de eso hay que cambiar este mecanismo (o ese ejercicio va a otra práctica).
// Fábrica: el 1, «Construye el divisor», se quitó el 2026-10-18 (tarea 76).

export const CATALOGO = [
  { id: 0, slug: 'divisores', ruta: '../divisores/', unidad: 2, nombre: { es: 'Divisor, múltiplo, divisible', en: 'Divisor, multiple, divisible' }, nEjercicios: 6, disponible: true },
  { id: 1, slug: 'semaforo', ruta: 'semaforo/', unidad: 2, nombre: { es: 'Semáforo de divisibilidad', en: 'Divisibility traffic light' }, nEjercicios: 4, disponible: true },
  { id: 2, slug: 'rectangulos', ruta: 'rectangulos/', unidad: 2, nombre: { es: 'Divisores por parejas', en: 'Divisors in pairs' }, nEjercicios: 3, disponible: true },
  { id: 3, slug: 'recta', ruta: 'recta/', unidad: 2, nombre: { es: 'Múltiplos y divisores en la recta', en: 'Multiples and divisors on the number line' }, nEjercicios: 3, disponible: true },
  { id: 4, slug: 'criba', ruta: 'criba/', unidad: 2, nombre: { es: 'Criba y números primos', en: 'Sieve and prime numbers' }, nEjercicios: 3, disponible: true },
  { id: 5, slug: 'arbol', ruta: 'arbol/', unidad: 2, nombre: { es: 'Árbol de factores', en: 'Factor tree' }, nEjercicios: 3, disponible: true },
  { id: 6, slug: 'divisiones', ruta: 'divisiones/', unidad: 2, nombre: { es: 'Divisiones sucesivas', en: 'Repeated division' }, nEjercicios: 3, disponible: true },
  { id: 7, slug: 'fabrica', ruta: 'fabrica/', unidad: 2, nombre: { es: 'Fábrica de divisores', en: 'Divisor factory' }, nEjercicios: 2, quitados: { antes: 3, posiciones: [1] }, disponible: true },
  { id: 8, slug: 'venn', ruta: 'venn/', unidad: 2, nombre: { es: 'm.c.d. y m.c.m. con factores primos', en: 'GCD and LCM with prime factors' }, nEjercicios: 4, disponible: true },
  { id: 9, slug: 'imposibles', ruta: 'imposibles/', unidad: 2, nombre: { es: 'Detector de imposibles', en: 'Impossible answers' }, nEjercicios: 3, disponible: true },
  { id: 10, slug: 'clasificador', ruta: 'clasificador/', unidad: 2, nombre: { es: '¿m.c.d. o m.c.m.?', en: 'GCD or LCM?' }, nEjercicios: 3, disponible: true },
  { id: 11, slug: 'reloj', ruta: 'reloj/', unidad: 2, nombre: { es: 'Reloj de coincidencias', en: 'Coincidence clock' }, nEjercicios: 3, disponible: true },
  { id: 12, slug: 'baldosas', ruta: 'baldosas/', unidad: 2, nombre: { es: 'Baldosas y cuerdas', en: 'Tiles and ropes' }, nEjercicios: 3, disponible: true },
  { id: 13, slug: 'errores', ruta: 'errores/', unidad: 2, nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: true },
  { id: 14, slug: 'leelo', ruta: 'leelo/', unidad: 2, nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 3, disponible: true },
  { id: 15, slug: 'factorizaciones', ruta: 'factorizaciones/', unidad: 2, nombre: { es: 'Operar con factorizaciones', en: 'Working with factorisations' }, nEjercicios: 3, disponible: true },
  { id: 16, slug: 'parentesis', ruta: 'parentesis/', unidad: 1, nombre: { es: 'Coloca los paréntesis', en: 'Place the brackets' }, nEjercicios: 4, disponible: true },
  { id: 17, slug: 'jerarquia', ruta: 'jerarquia/', unidad: 1, nombre: { es: '¿Qué se hace primero?', en: 'What comes first?' }, nEjercicios: 4, disponible: true },
  { id: 18, slug: 'exponente', ruta: 'exponente/', unidad: 1, nombre: { es: 'El exponente y su base', en: 'The index and its base' }, nEjercicios: 3, disponible: true },
  { id: 19, slug: 'raiz', ruta: 'raiz/', unidad: 1, nombre: { es: 'Raíz cuadrada con cuadrados', en: 'Square roots with squares' }, nEjercicios: 3, disponible: true },
  { id: 20, slug: 'division', ruta: 'division/', unidad: 1, nombre: { es: 'División entera: cajas y resto', en: 'Division with remainder: boxes' }, nEjercicios: 4, disponible: true },
  { id: 21, slug: 'expresion', ruta: 'expresion/', unidad: 1, nombre: { es: 'Del enunciado a la expresión', en: 'From words to expression' }, nEjercicios: 3, disponible: true },
  { id: 22, slug: 'redondeo', ruta: 'redondeo/', unidad: 1, nombre: { es: 'Redondeo y estimación', en: 'Rounding and estimating' }, nEjercicios: 3, disponible: true },
  { id: 23, slug: 'constructor', ruta: 'constructor/', unidad: 1, nombre: { es: 'Constructor de números', en: 'Number builder' }, nEjercicios: 3, disponible: true },
  { id: 24, slug: 'distributiva', ruta: 'distributiva/', unidad: 1, nombre: { es: 'Distributiva con rectángulos', en: 'Distributive property with rectangles' }, nEjercicios: 3, disponible: true },
  { id: 25, slug: 'potencias10', ruta: 'potencias10/', unidad: 1, nombre: { es: 'Potencias de 10 y números grandes', en: 'Powers of 10 and big numbers' }, nEjercicios: 3, disponible: true },
  { id: 26, slug: 'dictado', ruta: 'dictado/', unidad: 1, nombre: { es: 'Dictado de números', en: 'Number dictation' }, nEjercicios: 3, disponible: true },
  { id: 27, slug: 'mental', ruta: 'mental/', unidad: 1, nombre: { es: 'Cálculo mental con estrategia', en: 'Mental maths strategies' }, nEjercicios: 2, disponible: true },
  { id: 28, slug: 'especiales', ruta: 'especiales/', unidad: 1, nombre: { es: 'Potencias especiales: ¿verdadero o falso?', en: 'Special powers: true or false?' }, nEjercicios: 2, disponible: true },
  { id: 29, slug: 'errores1', ruta: 'errores1/', unidad: 1, nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 4, disponible: true },
  { id: 30, slug: 'propiedades', ruta: 'propiedades/', unidad: 1, nombre: { es: 'Propiedades de las potencias (ampliación)', en: 'Laws of indices (extension)' }, nEjercicios: 3, disponible: true },
  { id: 32, slug: 'por-primos', ruta: 'por-primos/', unidad: 2, nombre: { es: 'Multiplica y divide por primos', en: 'Multiply and divide by primes' }, nEjercicios: 5, disponible: true },
  // Ortografía española (2026-10-23): no es de Matemáticas; va en la unidad 3 porque es
  // donde se usa (decisión de Juan Luis: un ejercicio ★ en cada tarea semanal de la U3, en
  // orden, de la semana 1 a la 4), y así en esas tareas no sale como «repaso». El 45 porque
  // del 33 al 44 son de la unidad 3 (reparto PU2, tareas 79-91).
  { id: 45, slug: 'ortografia', ruta: 'ortografia/', unidad: 3, nombre: { es: 'Ortografía', en: 'Spanish spelling' }, nEjercicios: 7, disponible: false },
  // La plantilla es el ejemplo del contrato: funciona, pero no sale en la portada.
  { id: 31, slug: 'plantilla', ruta: 'plantilla/', unidad: null, nombre: { es: 'Práctica de plantilla', en: 'Template practice' }, nEjercicios: 2, disponible: true },
];

/** Id de la práctica de plantilla (la portada no la enseña). */
export const ID_PLANTILLA = 31;

/**
 * Las unidades del curso. `desde` ('AAAA-MM-DD') es el día en que la portada
 * pasa a tenerla por unidad actual. Las fechas de la 1 y la 2 son de relleno
 * (solo importa la de la unidad 3: el 16-11 la portada cambia sola). Una
 * unidad sin prácticas ni tareas publicadas no sale.
 */
export const UNIDADES = [
  { n: 1, desde: '2026-09-14', titulo: { es: 'Números naturales, potencias y raíces', en: 'Natural numbers, powers and roots' } },
  { n: 2, desde: '2026-10-13', titulo: { es: 'Divisibilidad', en: 'Divisibility' } },
  { n: 3, desde: '2026-11-16', titulo: { es: 'Números enteros', en: 'Integers' } },
];

/** La unidad actual el día `hoy` ('AAAA-MM-DD'): la última cuyo `desde` ya ha llegado (o la primera, antes de empezar el curso). */
export function unidadActual(hoy, unidades = UNIDADES) {
  const llegadas = unidades.filter(u => u.desde <= hoy);
  return (llegadas.length ? llegadas[llegadas.length - 1] : unidades[0]).n;
}

/**
 * Las unidades con las fechas de un profesor: los títulos comunes de `UNIDADES`
 * y el `desde` de `fechas` ([{ n, desde }], lo que guarda su configuración).
 * Una unidad sin fecha suya conserva la del curso.
 */
export function unidadesCon(fechas = []) {
  return UNIDADES.map(u => {
    const suya = fechas.find(f => f?.n === u.n);
    return { ...u, desde: suya?.desde ?? u.desde };
  });
}

export function practicaPorSlug(slug) {
  return CATALOGO.find(p => p.slug === slug) ?? null;
}

export function practicaPorId(id) {
  return CATALOGO.find(p => p.id === id) ?? null;
}

/**
 * Una lista `ej` guardada (navegador, nube, espacio) puesta al día con los
 * ejercicios que tiene hoy la práctica `slug`: si la práctica declara
 * `quitados` y la lista tiene exactamente `quitados.antes` elementos, se le
 * quitan esas posiciones (los demás ejercicios se quedan en su sitio nuevo).
 * Cualquier otra cosa se devuelve tal cual (la misma lista, no una copia).
 */
export function adaptarProgreso(slug, ej) {
  const quitados = practicaPorSlug(slug)?.quitados;
  if (!quitados || !Array.isArray(ej) || ej.length !== quitados.antes) return ej;
  return ej.filter((_, i) => !quitados.posiciones.includes(i + 1));
}
