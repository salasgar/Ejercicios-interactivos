// Práctica «¿m.c.d. o m.c.m.?»: textos propios y el banco de enunciados.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·»; GCD/LCM en inglés, m.c.d./m.c.m. en español;
// inglés sencillo; nada de «×», «HCF», «factor of» ni letras como incógnita.
//
// El banco (BANCO) tiene 36 plantillas: 24 limpias (12 m.c.d. + 12 m.c.m.) y
// 12 con trampa (6 + 6). Cada una es { clase, trampa, es, en, numeros, razon }:
//   clase    'mcd' | 'mcm'
//   trampa   true si una palabra del enunciado empuja hacia la clase contraria
//   es, en   (a, b[, c]) => texto del enunciado, con los números del ítem
//   numeros  rng => [a, b] o [a, b, c], los datos del ítem
//   razon    (a, b[, c]) => { es, en }: el porqué, con esos mismos números

function dosGrandes(rng) {
  let a = rng.entero(12, 96);
  let b = rng.entero(12, 96);
  while (b === a) b = rng.entero(12, 96);
  return [a, b];
}

function dosPequenos(rng) {
  let a = rng.entero(2, 20);
  let b = rng.entero(2, 20);
  while (b === a) b = rng.entero(2, 20);
  return [a, b];
}

function tresPequenos(rng) {
  const s = new Set();
  while (s.size < 3) s.add(rng.entero(3, 9));
  return [...s];
}

// --- Limpios m.c.d.: dos cantidades que hay que agrupar o cortar igual, lo más
// grande posible, sin que sobre nada. El tamaño del grupo/trozo es un divisor
// común; el mayor posible es el m.c.d. --------------------------------------

const LIMPIOS_MCD_PAQUETES = [
  { oEs: 'lápices', oEn: 'pencils', pEs: 'gomas', pEn: 'erasers', gEs: 'bolsas de regalo', gEn: 'gift bags' },
  { oEs: 'canicas', oEn: 'marbles', pEs: 'cuentas', pEn: 'beads', gEs: 'pulseras', gEn: 'bracelets' },
  { oEs: 'manzanas', oEn: 'apples', pEs: 'naranjas', pEn: 'oranges', gEs: 'cestas de fruta', gEn: 'fruit baskets' },
  { oEs: 'pegatinas', oEn: 'stickers', pEs: 'cromos', pEn: 'cards', gEs: 'sobres', gEn: 'packs' },
  { oEs: 'bombones', oEn: 'chocolates', pEs: 'caramelos', pEn: 'sweets', gEs: 'cajas', gEn: 'boxes' },
  { oEs: 'libros', oEn: 'books', pEs: 'cuadernos', pEn: 'notebooks', gEs: 'cajas', gEn: 'boxes' },
].map(d => ({
  clase: 'mcd',
  trampa: false,
  dice: ['mayor'],
  es: (a, b) => `Tienes ${a} ${d.oEs} y ${b} ${d.pEs}. Quieres hacer el mayor número posible de ${d.gEs} iguales, usando todo sin que sobre nada. ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `You have ${a} ${d.oEn} and ${b} ${d.pEn}. You want to make the largest possible number of identical ${d.gEn}, using them all with nothing left over. Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `El número de ${d.gEs} tiene que ser un divisor de ${a} y de ${b} (todas llevan lo mismo de cada cosa): el mayor posible es su máximo común divisor → m.c.d.`,
    en: `The number of ${d.gEn} must be a divisor of ${a} and ${b} (they all get the same amount of each thing): the largest one possible is their greatest common divisor → GCD.`,
  }),
  numeros: dosGrandes,
}));

const LIMPIOS_MCD_TROZOS = [
  { oEs: 'cuerda', oEn: 'rope', tEs: 'trozos', tEn: 'pieces', tsEs: 'cada trozo', tsEn: 'each piece' },
  { oEs: 'cinta', oEn: 'ribbon', tEs: 'trozos', tEn: 'pieces', tsEs: 'cada trozo', tsEn: 'each piece' },
  { oEs: 'tabla de madera', oEn: 'wooden board', tEs: 'tablones', tEn: 'planks', tsEs: 'cada tablón', tsEn: 'each plank' },
  { oEs: 'tela', oEn: 'fabric', tEs: 'retales', tEn: 'strips', tsEs: 'cada retal', tsEn: 'each strip' },
  { oEs: 'manguera', oEn: 'garden hose', tEs: 'trozos', tEn: 'pieces', tsEs: 'cada trozo', tsEn: 'each piece' },
  { oEs: 'cable', oEn: 'cable', tEs: 'trozos', tEn: 'pieces', tsEs: 'cada trozo', tsEn: 'each piece' },
].map(d => ({
  clase: 'mcd',
  trampa: false,
  dice: ['mayor'],
  es: (a, b) => `Un trozo de ${d.oEs} mide ${a} cm y otro mide ${b} cm. Quieres cortar los dos trozos en ${d.tEs} iguales, lo más largos posible, sin que sobre nada. ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `One piece of ${d.oEn} is ${a} cm long and another one is ${b} cm long. You want to cut both pieces into identical ${d.tEn}, as long as possible, with nothing left over. Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `La longitud de ${d.tsEs} tiene que ser un divisor de ${a} y de ${b}: la mayor posible es su máximo común divisor → m.c.d.`,
    en: `The length of ${d.tsEn} must be a divisor of ${a} and ${b}: the largest one possible is their greatest common divisor → GCD.`,
  }),
  numeros: dosGrandes,
}));

// --- Limpios m.c.m.: dos cosas que se repiten cada tantas unidades y acaban
// de coincidir; el momento en que vuelven a coincidir es un múltiplo común, y
// el primero es el m.c.m. -----------------------------------------------------

const LIMPIOS_MCM = [
  { sEs: 'Un autobús pasa cada', sEn: 'One bus goes by every', s2Es: 'otro pasa cada', s2En: 'another one goes by every', uEs: 'minutos', uEn: 'minutes', vEs: 'los dos acaban de pasar juntos', vEn: 'both of them have just gone by together' },
  { sEs: 'Un tren sale cada', sEn: 'One train leaves every', s2Es: 'otro sale cada', s2En: 'another one leaves every', uEs: 'minutos', uEn: 'minutes', vEs: 'los dos acaban de salir juntos', vEn: 'both of them have just left together' },
  { sEs: 'Un faro se enciende cada', sEn: 'One lighthouse flashes every', s2Es: 'otro se enciende cada', s2En: 'another one flashes every', uEs: 'segundos', uEn: 'seconds', vEs: 'los dos acaban de encenderse juntos', vEn: 'both of them have just flashed together' },
  { sEs: 'Una campana suena cada', sEn: 'One bell rings every', s2Es: 'otra suena cada', s2En: 'another one rings every', uEs: 'minutos', uEn: 'minutes', vEs: 'las dos acaban de sonar juntas', vEn: 'both of them have just rung together' },
  { sEs: 'Un corredor pasa por la meta cada', sEn: 'One runner passes the finish line every', s2Es: 'otro pasa cada', s2En: 'another one passes every', uEs: 'segundos', uEn: 'seconds', vEs: 'los dos acaban de pasar juntos', vEn: 'both of them have just passed together' },
  { sEs: 'Un semáforo cambia cada', sEn: 'One traffic light changes every', s2Es: 'otro cambia cada', s2En: 'another one changes every', uEs: 'segundos', uEn: 'seconds', vEs: 'los dos acaban de cambiar juntos', vEn: 'both of them have just changed together' },
  { sEs: 'Una luz parpadea cada', sEn: 'One light blinks every', s2Es: 'otra parpadea cada', s2En: 'another one blinks every', uEs: 'segundos', uEn: 'seconds', vEs: 'las dos acaban de parpadear juntas', vEn: 'both of them have just blinked together' },
  { sEs: 'Riegas un rosal cada', sEn: 'You water one rose bush every', s2Es: 'otro cada', s2En: 'another one every', uEs: 'días', uEn: 'days', vEs: 'hoy has regado los dos el mismo día', vEn: 'today you watered both on the same day' },
  { sEs: 'Un aspersor se activa cada', sEn: 'One sprinkler turns on every', s2Es: 'otro se activa cada', s2En: 'another one turns on every', uEs: 'minutos', uEn: 'minutes', vEs: 'los dos acaban de activarse juntos', vEn: 'both of them have just turned on together' },
  { sEs: 'Una alarma suena cada', sEn: 'One alarm goes off every', s2Es: 'otra suena cada', s2En: 'another one goes off every', uEs: 'minutos', uEn: 'minutes', vEs: 'las dos acaban de sonar juntas', vEn: 'both of them have just gone off together' },
  { sEs: 'Una cabina de la noria pasa por abajo cada', sEn: 'One Ferris wheel cabin passes the bottom every', s2Es: 'otra pasa cada', s2En: 'another one passes every', uEs: 'segundos', uEn: 'seconds', vEs: 'las dos acaban de pasar juntas por abajo', vEn: 'both of them have just passed the bottom together' },
  { sEs: 'Un metrónomo marca cada', sEn: 'One metronome ticks every', s2Es: 'otro marca cada', s2En: 'another one ticks every', uEs: 'segundos', uEn: 'seconds', vEs: 'los dos acaban de marcar juntos', vEn: 'both of them have just ticked together' },
].map(d => ({
  clase: 'mcm',
  trampa: false,
  dice: [],
  es: (a, b) => `${d.sEs} ${a} ${d.uEs} y ${d.s2Es} ${b} ${d.uEs}: ${d.vEs}. ¿Dentro de cuántos ${d.uEs} volverán a coincidir? ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `${d.sEn} ${a} ${d.uEn} and ${d.s2En} ${b} ${d.uEn}: ${d.vEn}. In how many ${d.uEn} will they coincide again? Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `El momento en que vuelven a coincidir tiene que ser múltiplo de ${a} y de ${b}: el primero que vale para los dos es su mínimo común múltiplo → m.c.m.`,
    en: `The moment they coincide again must be a multiple of ${a} and of ${b}: the first one that works for both is their least common multiple → LCM.`,
  }),
  numeros: dosPequenos,
}));

// --- Trampa A (m.c.d.): pregunta por el MENOR número de piezas, cuando en
// realidad hay que fijarse en el tamaño de cada pieza, no en cuántas hay. ----

// Todas dicen «MENOR número de piezas» y se resuelven por el tamaño de cada
// pieza (`tamano: true`): en el ejercicio 3 la razón buena es «tamano», no «va»,
// porque el número de piezas no divide a los datos.
const TRAMPA_A = [
  // Dos cosas que se cortan en trozos iguales.
  { oEs: 'trozos', oEn: 'pieces', genero: 'm',
    esF: (a, b) => `Tienes dos cuerdas, una de ${a} cm y otra de ${b} cm. Quieres cortarlas en trozos iguales, sin que sobre nada. ¿Cuál es el MENOR número de trozos que puedes obtener entre las dos?`,
    enF: (a, b) => `You have two ropes, one ${a} cm long and another ${b} cm long. You want to cut them into equal pieces, with nothing left over. What is the SMALLEST number of pieces you can get from both together?` },
  { oEs: 'tablones', oEn: 'planks', genero: 'm',
    esF: (a, b) => `Tienes dos tablas de madera, una de ${a} cm y otra de ${b} cm. Quieres cortarlas en tablones iguales, sin que sobre nada. ¿Cuál es el MENOR número de tablones que puedes obtener entre las dos?`,
    enF: (a, b) => `You have two wooden boards, one ${a} cm long and another ${b} cm long. You want to cut them into equal planks, with nothing left over. What is the SMALLEST number of planks you can get from both together?` },
  { oEs: 'retales', oEn: 'strips', genero: 'm',
    esF: (a, b) => `Tienes dos cintas, una de ${a} cm y otra de ${b} cm. Quieres cortarlas en retales iguales, sin que sobre nada. ¿Cuál es el MENOR número de retales que puedes obtener entre las dos?`,
    enF: (a, b) => `You have two ribbons, one ${a} cm long and another ${b} cm long. You want to cut them into equal strips, with nothing left over. What is the SMALLEST number of strips you can get from both together?` },
  // Dos clases de cosas que se reparten en grupos iguales, cada grupo de una sola clase.
  { oEs: 'ramos', oEn: 'bunches', genero: 'm',
    esF: (a, b) => `Tienes ${a} flores y ${b} hojas. Quieres hacer ramos iguales: unos solo de flores y otros solo de hojas, todos con el mismo número de unidades y sin que sobre nada. ¿Cuál es el MENOR número de ramos que puedes hacer?`,
    enF: (a, b) => `You have ${a} flowers and ${b} leaves. You want to make equal bunches: some with only flowers and some with only leaves, all with the same number of items and with nothing left over. What is the SMALLEST number of bunches you can make?` },
  { oEs: 'cajas', oEn: 'boxes', genero: 'f',
    esF: (a, b) => `Tienes ${a} juguetes y ${b} libros. Quieres guardarlos en cajas iguales: unas solo de juguetes y otras solo de libros, todas con el mismo número de objetos y sin que sobre nada. ¿Cuál es el MENOR número de cajas que puedes usar?`,
    enF: (a, b) => `You have ${a} toys and ${b} books. You want to store them in equal boxes: some with only toys and some with only books, all with the same number of objects and with nothing left over. What is the SMALLEST number of boxes you can use?` },
  { oEs: 'montones', oEn: 'stacks', genero: 'm',
    esF: (a, b) => `Tienes ${a} cuadernos y ${b} libros. Quieres hacer montones iguales: unos solo de cuadernos y otros solo de libros, todos con el mismo número de unidades y sin que sobre nada. ¿Cuál es el MENOR número de montones que puedes hacer?`,
    enF: (a, b) => `You have ${a} notebooks and ${b} books. You want to make equal stacks: some with only notebooks and some with only books, all with the same number of items and with nothing left over. What is the SMALLEST number of stacks you can make?` },
].map(d => ({
  clase: 'mcd',
  trampa: true,
  tamano: true,
  dice: ['menor'],
  es: (a, b) => `${d.esF(a, b)} ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `${d.enF(a, b)} Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `«menor número de ${d.oEs}» habla de ${d.genero === 'f' ? 'cuántas' : 'cuántos'} hay, no de su tamaño: ${d.genero === 'f' ? 'pocas' : 'pocos'} ${d.oEs} = ${d.oEs} grandes = el tamaño más grande que cabe en ${a} y ${b} → m.c.d.`,
    en: `«the smallest number of ${d.oEn}» talks about how many there are, not about their size: fewer ${d.oEn} = bigger ${d.oEn} = the largest size that fits into ${a} and ${b} → GCD.`,
  }),
  numeros: dosGrandes,
}));

// --- Trampa B (m.c.m.): «repartir sin que sobre» suena a m.c.d., pero pide el
// MENOR número que sea múltiplo de varios grupos: es un m.c.m. ----------------

const TRAMPA_B = [
  { oEs: 'caramelos', oEn: 'sweets', gEs: 'niños', gEn: 'kids' },
  { oEs: 'pegatinas', oEn: 'stickers', gEs: 'amigos', gEn: 'friends' },
  { oEs: 'bombones', oEn: 'chocolates', gEs: 'invitados', gEn: 'guests' },
  { oEs: 'canicas', oEn: 'marbles', gEs: 'bolsas', gEn: 'bags' },
  { oEs: 'chucherías', oEn: 'candies', gEs: 'mesas', gEn: 'tables' },
  { oEs: 'cromos', oEn: 'cards', gEs: 'jugadores', gEn: 'players' },
].map(d => ({
  clase: 'mcm',
  trampa: true,
  dice: ['menor'],
  es: (a, b, c) => `Quieres tener ${d.oEs} que se puedan repartir en partes iguales, sin que sobre nada, entre ${a} ${d.gEs}, entre ${b} ${d.gEs} o entre ${c} ${d.gEs}. ¿Cuál es el MENOR número de ${d.oEs} que puedes tener? ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b, c) => `You want to have ${d.oEn} that can be shared equally, with nothing left over, among ${a} ${d.gEn}, among ${b} ${d.gEn} or among ${c} ${d.gEn}. What is the SMALLEST number of ${d.oEn} you can have? Do you need the GCD or the LCM?`,
  razon: (a, b, c) => ({
    es: `«repartir en partes iguales sin que sobre nada» entre ${a}, entre ${b} y entre ${c} pide un número que sea múltiplo de ${a}, de ${b} y de ${c} a la vez: el menor que vale para los tres es su mínimo común múltiplo → m.c.m.`,
    en: `«shared equally with nothing left over» among ${a}, ${b} and ${c} asks for a number that is a multiple of ${a}, ${b} and ${c} at the same time: the smallest one that works for all three is their least common multiple → LCM.`,
  }),
  numeros: tresPequenos,
}));

export const BANCO = [
  ...LIMPIOS_MCD_PAQUETES, ...LIMPIOS_MCD_TROZOS, ...LIMPIOS_MCM, ...TRAMPA_A, ...TRAMPA_B,
];

export const TX = {
  nombre: {
    limpio: { es: 'Enunciados limpios', en: 'Clean problems' },
    trampa: { es: 'Con trampa', en: 'With a twist' },
    justificar: { es: 'Justifícalo', en: 'Justify it' },
  },
  detalle: {
    limpio: { es: 'Decide si hace falta el m.c.d. o el m.c.m.', en: 'Decide whether you need the GCD or the LCM' },
    trampa: { es: 'Cuidado: «mayor» y «menor» no siempre significan lo que parece', en: 'Careful: «smallest» and «largest» do not always mean what they seem' },
    justificar: { es: 'Elige la razón correcta', en: 'Choose the correct reason' },
  },
  boton: {
    mcd: { es: 'm.c.d.', en: 'GCD' },
    mcm: { es: 'm.c.m.', en: 'LCM' },
  },
  preguntaJustificar: { es: 'Ya se sabe que hace falta el', en: 'We already know we need the' },
  porque: { es: '¿Por qué?', en: 'Why?' },
  justificacion: {
    va: { es: 'porque el número que buscamos cabe en los datos (los divide)', en: 'because the number we are looking for goes into the data (it divides them)' },
    tamano: { es: 'porque primero se busca el tamaño de cada parte, y ese tamaño cabe en los datos (los divide)', en: 'because first we look for the size of each part, and that size goes into the data (it divides them)' },
    contiene: { es: 'porque el número que buscamos contiene a los datos (es múltiplo de ellos)', en: 'because the number we are looking for contains the data (it is a multiple of them)' },
    dice_mayor: { es: 'porque el enunciado dice «mayor»', en: 'because the problem says «largest»' },
    dice_menor: { es: 'porque el enunciado dice «menor»', en: 'because the problem says «smallest»' },
    datos_pequenos: { es: 'porque los datos son pequeños', en: 'because the numbers are small' },
    dos_datos: { es: 'porque hay dos datos', en: 'because there are two numbers' },
  },
};
