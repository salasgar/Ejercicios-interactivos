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
  { oEs: 'lápices', oEn: 'pencils', pEs: 'gomas', pEn: 'erasers', gEs: 'bolsas de regalo', gEn: 'gift bags', sEs: 'cada bolsa', sEn: 'each bag' },
  { oEs: 'canicas', oEn: 'marbles', pEs: 'cuentas', pEn: 'beads', gEs: 'pulseras', gEn: 'bracelets', sEs: 'cada pulsera', sEn: 'each bracelet' },
  { oEs: 'manzanas', oEn: 'apples', pEs: 'naranjas', pEn: 'oranges', gEs: 'cestas de fruta', gEn: 'fruit baskets', sEs: 'cada cesta', sEn: 'each basket' },
  { oEs: 'pegatinas', oEn: 'stickers', pEs: 'cromos', pEn: 'cards', gEs: 'sobres', gEn: 'packs', sEs: 'cada sobre', sEn: 'each pack' },
  { oEs: 'bombones', oEn: 'chocolates', pEs: 'caramelos', pEn: 'sweets', gEs: 'cajas', gEn: 'boxes', sEs: 'cada caja', sEn: 'each box' },
  { oEs: 'libros', oEn: 'books', pEs: 'cuadernos', pEn: 'notebooks', gEs: 'cajas', gEn: 'boxes', sEs: 'cada caja', sEn: 'each box' },
].map(d => ({
  clase: 'mcd',
  trampa: false,
  es: (a, b) => `Tienes ${a} ${d.oEs} y ${b} ${d.pEs}. Quieres hacer ${d.gEs} iguales, lo más grandes posible, usando todo sin que sobre nada. ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `You have ${a} ${d.oEn} and ${b} ${d.pEn}. You want to make identical ${d.gEn}, as large as possible, using them all with nothing left over. Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `El número de ${d.oEs.split(' ')[0]} y ${d.pEs.split(' ')[0]} que caben en ${d.sEs} tiene que ser un divisor de ${a} y de ${b}: el mayor posible es su máximo común divisor → m.c.d.`,
    en: `The number of ${d.oEn.split(' ')[0]} and ${d.pEn.split(' ')[0]} that fit in ${d.sEn} must be a divisor of ${a} and ${b}: the largest one possible is their greatest common divisor → GCD.`,
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

const TRAMPA_A = [
  { oEs: 'baldosas cuadradas', oEn: 'square tiles', cEs: 'dos paredes', cEn: 'two walls', genero: 'f' },
  { oEs: 'cajas', oEn: 'boxes', cEs: 'un lote de juguetes y otro de libros', cEn: 'one batch of toys and one of books', genero: 'f' },
  { oEs: 'montones', oEn: 'stacks', cEs: 'un paquete de folios y otro de cartulinas', cEn: 'one pack of sheets and one of cards', genero: 'm' },
  { oEs: 'ramos', oEn: 'bunches', cEs: 'un cubo de flores y otro de hojas', cEn: 'one bucket of flowers and one of leaves', genero: 'm' },
  { oEs: 'lotes', oEn: 'batches', cEs: 'una bolsa de pelotas y otra de conos', cEn: 'one bag of balls and one of cones', genero: 'm' },
  { oEs: 'cajones', oEn: 'crates', cEs: 'un palé de botellas y otro de latas', cEn: 'one pallet of bottles and one of cans', genero: 'm' },
].map(d => ({
  clase: 'mcd',
  trampa: true,
  es: (a, b) => `Tienes ${d.cEs}, de ${a} y ${b} unidades. Quieres repartirlo todo en ${d.oEs} iguales, sin que sobre nada. ¿Cuál es el MENOR número de ${d.oEs} que puedes usar? ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b) => `You have ${d.cEn}, with ${a} and ${b} units. You want to split it all into identical ${d.oEn}, with nothing left over. What is the SMALLEST number of ${d.oEn} you can use? Do you need the GCD or the LCM?`,
  razon: (a, b) => ({
    es: `«menor número de ${d.oEs}» habla de cuántas hay, no de su tamaño: ${d.genero === 'f' ? 'pocas' : 'pocos'} ${d.oEs} = ${d.oEs} grandes = el tamaño más grande que cabe en ${a} y ${b} → m.c.d.`,
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
  es: (a, b, c) => `Quieres repartir ${d.oEs} en grupos de ${a}, de ${b} o de ${c} ${d.gEs}, sin que sobre ninguno en ningún caso. ¿Cuál es el MENOR número de ${d.oEs} que puede ser? ¿Hace falta el m.c.d. o el m.c.m.?`,
  en: (a, b, c) => `You want to share out ${d.oEn} into groups of ${a}, ${b} or ${c} ${d.gEn}, with none left over in any case. What is the SMALLEST number of ${d.oEn} it can be? Do you need the GCD or the LCM?`,
  razon: (a, b, c) => ({
    es: `«repartir en grupos ... sin que sobre ninguno» pide un número que sea múltiplo de ${a}, de ${b} y de ${c} a la vez: el menor que vale para los tres es su mínimo común múltiplo → m.c.m.`,
    en: `«share out into groups ... with none left over» asks for a number that is a multiple of ${a}, ${b} and ${c} at the same time: the smallest one that works for all three is their least common multiple → LCM.`,
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
    contiene: { es: 'porque el número que buscamos contiene a los datos (es múltiplo de ellos)', en: 'because the number we are looking for contains the data (it is a multiple of them)' },
    dice_mayor: { es: 'porque el enunciado dice «mayor»', en: 'because the problem says «largest»' },
    dice_menor: { es: 'porque el enunciado dice «menor»', en: 'because the problem says «smallest»' },
    datos_pequenos: { es: 'porque los datos son pequeños', en: 'because the numbers are small' },
    dos_datos: { es: 'porque hay dos datos', en: 'because there are two numbers' },
  },
};
