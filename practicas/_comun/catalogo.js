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
  // El slug se queda (es la clave del progreso guardado y de las tareas); la carpeta y la URL, sin Pablo desde el 27-10.
  { id: 46, slug: 'fichas-de-pablo', ruta: 'fichas-del-parchis/', unidad: 2, nombre: { es: 'Las fichas del parchís', en: 'Ludo counters' }, nEjercicios: 8, disponible: true },
  // Unidad 3, Integers (PU2, tareas 80-91; filas puestas por la 79 el 2026-10-25, con un esqueleto en
  // cada carpeta). Cada una pone su `disponible: true` cuando la publique su tarea de la semana (93-96).
  { id: 33, slug: 'termometro', ruta: 'termometro/', unidad: 3, nombre: { es: 'La recta y el termómetro', en: 'The number line and the thermometer' }, nEjercicios: 5, disponible: true },
  { id: 34, slug: 'opuestos', ruta: 'opuestos/', unidad: 3, nombre: { es: 'Opuesto y valor absoluto', en: 'Opposite and absolute value' }, nEjercicios: 4, disponible: true },
  { id: 35, slug: 'situaciones', ruta: 'situaciones/', unidad: 3, nombre: { es: 'Enteros en la vida real', en: 'Integers in real life' }, nEjercicios: 3, disponible: true },
  { id: 36, slug: 'saltos', ruta: 'saltos/', unidad: 3, nombre: { es: 'Sumas y restas con saltos', en: 'Adding and subtracting with jumps' }, nEjercicios: 5, disponible: true },
  { id: 37, slug: 'dos-signos', ruta: 'dos-signos/', unidad: 3, nombre: { es: 'Dos signos seguidos', en: 'Two signs in a row' }, nEjercicios: 4, disponible: true },
  { id: 38, slug: 'signos-producto', ruta: 'signos-producto/', unidad: 3, nombre: { es: 'La regla de los signos', en: 'The rule of signs' }, nEjercicios: 5, disponible: true },
  { id: 39, slug: 'potencias-enteros', ruta: 'potencias-enteros/', unidad: 3, nombre: { es: 'Productos y potencias con signo', en: 'Signs in products and powers' }, nEjercicios: 4, disponible: true },
  { id: 40, slug: 'jerarquia-enteros', ruta: 'jerarquia-enteros/', unidad: 3, nombre: { es: '¿Qué se hace primero? Con enteros', en: 'What comes first? With integers' }, nEjercicios: 4, disponible: true },
  { id: 41, slug: 'parentesis-enteros', ruta: 'parentesis-enteros/', unidad: 3, nombre: { es: 'Paréntesis y corchetes', en: 'Brackets' }, nEjercicios: 5, disponible: true },
  { id: 42, slug: 'errores3', ruta: 'errores3/', unidad: 3, nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: true },
  { id: 43, slug: 'variacion', ruta: 'variacion/', unidad: 3, nombre: { es: 'Subidas, bajadas y diferencias', en: 'Rises, falls and differences' }, nEjercicios: 5, disponible: true },
  { id: 44, slug: 'leelo3', ruta: 'leelo3/', unidad: 3, nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 4, disponible: true },
  // Ortografía española (2026-10-23): no es de Matemáticas. Un ejercicio ★ en cada tarea
  // semanal desde la U3 (decisión de Juan Luis; el reparto por semanas, en
  // apuntes-1eso-bilingue/comun/CALENDARIO-CURSO-2026-27.md). `unidad: 3` ya no decide nada en
  // la portada (manda `seccion`); `transversal` hace que en las tareas de otras unidades no salga
  // como «repaso U3». El 45 porque del 33 al 44 son de la unidad 3 (PU2, tareas 79-91).
  //
  // `seccion` (opcional; desde el 2026-11-03, tarea 134): la práctica no sale en la sección de su
  // unidad sino en una sección propia de la portada (ver SECCIONES, más abajo). La ortografía son
  // seis prácticas («bloques»): la 45, «lo más frecuente», y las 64-68, una por tema. Son bloques
  // separados y no ejercicios nuevos de la 45 porque el progreso se guarda por posición y las
  // tareas citan `['ortografia', n]`: en una práctica, lo nuevo solo podría ir al final.
  { id: 45, slug: 'ortografia', ruta: 'ortografia/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: lo más frecuente', en: 'Spanish spelling: the most frequent slips' }, nEjercicios: 11, disponible: true },
  // Los bloques nuevos (PU2, tareas 135-139; filas y esqueletos puestos por la 134). Cada uno pone
  // su `disponible: true` cuando lo publique su tarea de revisión (140-142).
  { id: 64, slug: 'ortografia-tildes', ruta: 'ortografia-tildes/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: las tildes', en: 'Spanish spelling: accents' }, nEjercicios: 4, disponible: false },
  { id: 65, slug: 'ortografia-letras', ruta: 'ortografia-letras/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: las letras', en: 'Spanish spelling: letters' }, nEjercicios: 4, disponible: false },
  { id: 66, slug: 'ortografia-puntuacion', ruta: 'ortografia-puntuacion/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: puntuación y mayúsculas', en: 'Spanish spelling: punctuation and capitals' }, nEjercicios: 4, disponible: false },
  { id: 67, slug: 'ortografia-palabras', ruta: 'ortografia-palabras/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: palabras que se confunden', en: 'Spanish spelling: confusable words' }, nEjercicios: 3, disponible: false },
  { id: 68, slug: 'ortografia-ampliacion', ruta: 'ortografia-ampliacion/', unidad: 3, transversal: true, seccion: 'ortografia', nombre: { es: 'Ortografía: ampliación', en: 'Spanish spelling: going further' }, nEjercicios: 4, disponible: false },
  // Unidad 4, Fractions (PU2, tareas 99-108; filas puestas por la 98 el 2026-10-26, con un esqueleto en
  // cada carpeta). Cada una pone su `disponible: true` cuando la publique su tarea de la semana (109-111).
  { id: 47, slug: 'que-fraccion', ruta: 'que-fraccion/', unidad: 4, nombre: { es: '¿Qué fracción es?', en: 'What fraction is it?' }, nEjercicios: 4, disponible: true },
  { id: 48, slug: 'equivalentes', ruta: 'equivalentes/', unidad: 4, nombre: { es: 'Fracciones equivalentes', en: 'Equivalent fractions' }, nEjercicios: 4, disponible: true },
  { id: 49, slug: 'simplifica', ruta: 'simplifica/', unidad: 4, nombre: { es: 'Simplifica', en: 'Simplify' }, nEjercicios: 3, disponible: true },
  { id: 50, slug: 'compara', ruta: 'compara/', unidad: 4, nombre: { es: 'Compara y ordena', en: 'Compare and order' }, nEjercicios: 4, disponible: true },
  { id: 51, slug: 'fraccion-de', ruta: 'fraccion-de/', unidad: 4, nombre: { es: 'La fracción de una cantidad', en: 'A fraction of a quantity' }, nEjercicios: 4, disponible: false },
  { id: 52, slug: 'suma-resta', ruta: 'suma-resta/', unidad: 4, nombre: { es: 'Suma y resta', en: 'Adding and subtracting' }, nEjercicios: 5, disponible: false },
  { id: 53, slug: 'multiplica-divide', ruta: 'multiplica-divide/', unidad: 4, nombre: { es: 'Multiplica y divide', en: 'Multiply and divide' }, nEjercicios: 5, disponible: false },
  { id: 54, slug: 'combinadas-fracciones', ruta: 'combinadas-fracciones/', unidad: 4, nombre: { es: '¿Qué se hace primero? Con fracciones', en: 'What comes first? With fractions' }, nEjercicios: 3, disponible: false },
  { id: 55, slug: 'errores4', ruta: 'errores4/', unidad: 4, nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: false },
  { id: 56, slug: 'leelo4', ruta: 'leelo4/', unidad: 4, nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 4, disponible: true },
  // Unidad 5, Decimals (PU2, tareas 123-129; filas puestas por la 122 el 2026-11-05, con un esqueleto en
  // cada carpeta). Cada una pone su `disponible: true` cuando la publique su tarea de la semana (130-131).
  { id: 57, slug: 'lee-decimales', ruta: 'lee-decimales/', unidad: 5, nombre: { es: 'Lee y escribe decimales', en: 'Read and write decimals' }, nEjercicios: 4, disponible: false },
  { id: 58, slug: 'compara-decimales', ruta: 'compara-decimales/', unidad: 5, nombre: { es: 'Compara, ordena y redondea', en: 'Compare, order and round' }, nEjercicios: 4, disponible: false },
  { id: 59, slug: 'suma-resta-decimales', ruta: 'suma-resta-decimales/', unidad: 5, nombre: { es: 'Suma y resta decimales', en: 'Add and subtract decimals' }, nEjercicios: 4, disponible: false },
  { id: 60, slug: 'multiplica-divide-decimales', ruta: 'multiplica-divide-decimales/', unidad: 5, nombre: { es: 'Multiplica y divide decimales', en: 'Multiply and divide decimals' }, nEjercicios: 6, disponible: false },
  { id: 61, slug: 'fraccion-decimal', ruta: 'fraccion-decimal/', unidad: 5, nombre: { es: 'De fracción a decimal y vuelta', en: 'Fractions and decimals' }, nEjercicios: 4, disponible: false },
  { id: 62, slug: 'errores5', ruta: 'errores5/', unidad: 5, nombre: { es: 'Caza el error', en: 'Spot the mistake' }, nEjercicios: 3, disponible: false },
  { id: 63, slug: 'leelo5', ruta: 'leelo5/', unidad: 5, nombre: { es: 'Léelo en inglés', en: 'Say it in English' }, nEjercicios: 4, disponible: false },
  // La plantilla es el ejemplo del contrato: funciona, pero no sale en la portada.
  { id: 31, slug: 'plantilla', ruta: 'plantilla/', unidad: null, nombre: { es: 'Práctica de plantilla', en: 'Template practice' }, nEjercicios: 2, disponible: true },
];

/** Id de la práctica de plantilla (la portada no la enseña). */
export const ID_PLANTILLA = 31;

/**
 * Las unidades del curso. `desde` ('AAAA-MM-DD') es el día en que la portada
 * pasa a tenerla por unidad actual. Las fechas de la 1 y la 2 son de relleno
 * (importan las de las unidades 3, 4 y 5: el 16-11, el 14-12 y el 18-1 la portada cambia sola). Una
 * unidad sin prácticas ni tareas publicadas no sale.
 */
export const UNIDADES = [
  { n: 1, desde: '2026-09-14', titulo: { es: 'Números naturales, potencias y raíces', en: 'Natural numbers, powers and roots' } },
  { n: 2, desde: '2026-10-13', titulo: { es: 'Divisibilidad', en: 'Divisibility' } },
  { n: 3, desde: '2026-11-16', titulo: { es: 'Números enteros', en: 'Integers' } },
  { n: 4, desde: '2026-12-14', titulo: { es: 'Fracciones', en: 'Fractions' } },
  { n: 5, desde: '2027-01-18', titulo: { es: 'Números decimales', en: 'Decimals' } },
];

/**
 * Las secciones de la portada que no son una unidad (las prácticas con `seccion`). Salen debajo
 * de la unidad actual, plegadas: el alumno llega a sus ejercicios por la tarea semanal, y la
 * sección es para practicar por su cuenta.
 */
export const SECCIONES = [
  { id: 'ortografia', titulo: { es: 'Ortografía', en: 'Spanish spelling' } },
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
