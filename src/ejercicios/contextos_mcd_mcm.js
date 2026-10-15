// Banco de contextos de los problemas de m.c.d. y m.c.m. (tarea 25 del reparto
// de la unidad 2). Un alumno que practique mucho no debe ver siempre el mismo
// enunciado: cada problema elige al azar uno de estos contextos y genera los
// números dentro de su rango.
//
// Cada contexto declara:
//   - esquema: la forma del problema (ver ESQUEMAS), que fija si pide m.c.d. o m.c.m.;
//   - pide: 'mcd' o 'mcm' (redundante con el esquema, a propósito: se comprueba en los tests);
//   - unidad: { es, en } de los datos y de la respuesta;
//   - rango: cómo se generan los datos a y b (ver datosDelRango en divisibilidad.js):
//       g: [mín, máx] del m.c.d., que se multiplica por `paso` (1 si no se dice);
//       cof: [mín, máx] de los cocientes a / g y b / g (distintos y sin divisores comunes);
//       max: el mayor dato que tiene sentido en el contexto; min: el menor (2 si no se dice);
//       maxMcm: tope del m.c.m. (para que la respuesta no sea absurda);
//       ordenados: a > b (largo y ancho de un rectángulo);
//       evitar: parejas de datos que no salen (las de la hoja de Juan Luis: sus números no se copian);
//   - origen: 'hoja N' (hoja «Problemas de enunciado» de cursos anteriores), 'examen 2024-25',
//     'app' (el que ya tenía la app) o 'nuevo';
//   - es, en: el enunciado con {a} y {b}. En inglés sencillo y, entre paréntesis, la
//     palabra no matemática de la que depende la respuesta.
//
// Reglas de contenido: sin letras, sin decimales, sin dinero, sin nombres propios,
// «divisor» y GCD, sin «primos entre sí».

export const ESQUEMAS = {
  coincidencia: { pide: 'mcm', nombre: 'Coincidencia (minutos, segundos o días)' },
  grupos: { pide: 'mcd', nombre: 'Reparto en grupos iguales, lo más grandes o lo más numerosos posible' },
  cortar: { pide: 'mcd', nombre: 'Cortar en trozos iguales lo más largos posible' },
  baldosas: { pide: 'mcd', nombre: 'Cubrir un rectángulo con cuadrados iguales lo más grandes posible' },
  menor_cantidad: { pide: 'mcm', nombre: 'La menor cantidad que se puede repartir de dos formas sin que sobre' },
  paquetes: { pide: 'mcm', nombre: 'Igualar paquetes: el menor número para que no sobre ninguno' },
};

const MIN = { es: 'minutos', en: 'minutes' };
const SEG = { es: 'segundos', en: 'seconds' };
const DIAS = { es: 'días', en: 'days' };
const M = { es: 'm', en: 'm' };
const CM = { es: 'cm', en: 'cm' };

export const CONTEXTOS = [
  // --- Coincidencia (m.c.m.) ---------------------------------------------------
  {
    id: 'autobuses', esquema: 'coincidencia', pide: 'mcm', unidad: MIN, origen: 'app',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 50 },
    es: 'Un autobús sale cada {a} minutos y otro cada {b} minutos, y acaban de salir a la vez. ¿Cuál es el menor número de minutos que tiene que pasar para que vuelvan a salir a la vez?',
    en: 'One bus leaves every {a} minutes and another every {b} minutes. They have just left at the same time. What is the smallest number of minutes before they leave at the same time again? (leaves = sale; smallest = menor)',
  },
  {
    id: 'visitas', esquema: 'coincidencia', pide: 'mcm', unidad: DIAS, origen: 'hoja 1',
    rango: { g: [2, 7], cof: [2, 6], min: 6, max: 35, maxMcm: 200, evitar: [[14, 21]] },
    es: 'Mi abuelo viene a visitarme una vez cada {a} días y mi tía una vez cada {b} días. Hoy han venido los dos. ¿Dentro de cuántos días, como mínimo, volverán a venir los dos el mismo día?',
    en: 'My grandfather visits me once every {a} days and my aunt once every {b} days. Today they both came. What is the smallest number of days before they both come on the same day again? (once every = una vez cada; smallest = menor)',
  },
  {
    id: 'cine', esquema: 'coincidencia', pide: 'mcm', unidad: DIAS, origen: 'examen 2024-25',
    rango: { g: [2, 6], cof: [2, 7], min: 6, max: 30, maxMcm: 150, evitar: [[12, 18]] },
    es: 'Dos amigos van al cine: uno va una vez cada {a} días y el otro una vez cada {b} días. Hoy se han encontrado en el cine. ¿Dentro de cuántos días, como mínimo, volverán a encontrarse allí?',
    en: 'Two friends go to the cinema: one goes once every {a} days and the other once every {b} days. Today they met at the cinema. What is the smallest number of days before they meet there again? (met = se encontraron; smallest = menor)',
  },
  {
    id: 'feria', esquema: 'coincidencia', pide: 'mcm', unidad: MIN, origen: 'examen 2024-25',
    rango: { g: [2, 5], cof: [2, 7], min: 4, max: 30, evitar: [[6, 9], [9, 15], [6, 15]] },
    es: 'En la feria, el tiovivo empieza una vuelta cada {a} minutos y la noria cada {b} minutos. Acaban de empezar a la vez. ¿Cuál es el menor número de minutos que tiene que pasar para que vuelvan a empezar a la vez?',
    en: 'At the fair, the merry-go-round starts every {a} minutes and the big wheel starts every {b} minutes. They have just started at the same time. What is the smallest number of minutes before they start at the same time again? (merry-go-round = tiovivo; big wheel = noria; smallest = menor)',
  },
  {
    id: 'luces', esquema: 'coincidencia', pide: 'mcm', unidad: SEG, origen: 'nuevo',
    rango: { g: [2, 5], cof: [2, 9], min: 4, max: 40 },
    es: 'Una luz se enciende cada {a} segundos y otra cada {b} segundos. Ahora se encienden a la vez. ¿Cuál es el menor número de segundos que tiene que pasar para que vuelvan a encenderse a la vez?',
    en: 'One light flashes every {a} seconds and another every {b} seconds. They flash at the same time now. What is the smallest number of seconds before they flash at the same time again? (flashes = se enciende; smallest = menor)',
  },
  {
    id: 'circuito', esquema: 'coincidencia', pide: 'mcm', unidad: SEG, origen: 'nuevo',
    rango: { g: [2, 5], cof: [2, 7], min: 6, max: 30 },
    es: 'Dos coches de juguete dan vueltas a un circuito. Uno tarda {a} segundos en cada vuelta y el otro {b} segundos. Salen juntos de la línea de salida. ¿Cuántos segundos, como mínimo, tienen que pasar para que vuelvan a cruzar juntos la línea de salida?',
    en: 'Two toy cars go round a track. One takes {a} seconds for each lap and the other takes {b} seconds. They start together from the start line. What is the smallest number of seconds before they are on the start line together again? (lap = vuelta; start line = línea de salida; smallest = menor)',
  },
  {
    id: 'videojuego', esquema: 'coincidencia', pide: 'mcm', unidad: SEG, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 45 },
    es: 'En un videojuego aparece una moneda cada {a} segundos y una estrella cada {b} segundos. Acaban de aparecer las dos a la vez. ¿Cuál es el menor número de segundos que tiene que pasar para que vuelvan a aparecer a la vez?',
    en: 'In a video game, a coin appears every {a} seconds and a star appears every {b} seconds. They have just appeared at the same time. What is the smallest number of seconds before they appear at the same time again? (appears = aparece; smallest = menor)',
  },
  {
    id: 'huerto_riego', esquema: 'coincidencia', pide: 'mcm', unidad: DIAS, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 7], min: 4, max: 15 },
    es: 'En el huerto del instituto regamos los tomates cada {a} días y las lechugas cada {b} días. Hoy hemos regado las dos cosas. ¿Dentro de cuántos días, como mínimo, volveremos a regar las dos cosas el mismo día?',
    en: 'In the school garden we water the tomatoes every {a} days and the lettuces every {b} days. Today we watered both. What is the smallest number of days before we water both on the same day again? (water = regar; smallest = menor)',
  },

  // --- Reparto en grupos iguales (m.c.d.) -------------------------------------
  {
    id: 'lapices', esquema: 'grupos', pide: 'mcd', unidad: { es: 'grupos', en: 'groups' }, origen: 'app',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 50 },
    es: 'Hay {a} lápices y {b} gomas. Se quieren hacer grupos iguales, sin que sobre nada y con el mayor número posible de grupos. ¿Cuántos grupos se hacen?',
    en: 'There are {a} pencils and {b} erasers. We want to make equal groups, with nothing left over and with the greatest possible number of groups. How many groups can we make? (left over = sobrar)',
  },
  {
    id: 'cestas', esquema: 'grupos', pide: 'mcd', unidad: { es: 'cestas', en: 'baskets' }, origen: 'hoja 4',
    rango: { g: [3, 8], cof: [2, 7], min: 6, max: 50 },
    es: 'Una frutería tiene {a} manzanas y {b} naranjas. Quiere hacer cestas iguales con todas ellas, sin que sobre ninguna fruta, y el mayor número posible de cestas. ¿Cuántas cestas puede hacer?',
    en: 'A fruit shop has {a} apples and {b} oranges. It wants to make equal baskets with all of them, with no fruit left over, and as many baskets as possible. How many baskets can it make? (left over = sobrar; as many as possible = el mayor número posible)',
  },
  {
    // La hoja hace equipos de chicas y de chicos; aquí, sin mezclar dos clases.
    id: 'equipos', esquema: 'grupos', pide: 'mcd', unidad: { es: 'alumnos', en: 'students' }, origen: 'hoja 8',
    rango: { g: [3, 7], cof: [2, 7], min: 6, max: 50 },
    es: 'En una competición del instituto participan {a} alumnos de una clase y {b} de otra. Se hacen equipos sin mezclar las dos clases, todos con el mismo número de alumnos y lo más grandes posible. ¿Cuántos alumnos tiene cada equipo?',
    en: 'In a school competition, {a} students from one class and {b} students from another class take part. We make teams without mixing the two classes, all with the same number of students and as large as possible. How many students are there in each team? (as large as possible = lo más grandes posible)',
  },
  {
    id: 'cromos', esquema: 'grupos', pide: 'mcd', unidad: { es: 'sobres', en: 'packs' }, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 50 },
    es: 'Tengo {a} cromos de fútbol y {b} cromos de animales. Quiero hacer sobres iguales con todos ellos, sin que sobre ninguno, y el mayor número posible de sobres. ¿Cuántos sobres puedo hacer?',
    en: 'I have {a} football stickers and {b} animal stickers. I want to make equal packs with all of them, with none left over, and as many packs as possible. How many packs can I make? (stickers = cromos; as many as possible = el mayor número posible)',
  },
  {
    id: 'pulseras', esquema: 'grupos', pide: 'mcd', unidad: { es: 'pulseras', en: 'bracelets' }, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 50 },
    es: 'Tenemos {a} cuentas rojas y {b} cuentas azules para hacer pulseras iguales, usando todas las cuentas. Queremos hacer el mayor número posible de pulseras. ¿Cuántas pulseras podemos hacer?',
    en: 'We have {a} red beads and {b} blue beads to make equal bracelets, using all the beads. We want to make as many bracelets as possible. How many bracelets can we make? (beads = cuentas; bracelets = pulseras; as many as possible = el mayor número posible)',
  },
  {
    id: 'merienda', esquema: 'grupos', pide: 'mcd', unidad: { es: 'bolsas', en: 'bags' }, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 9], min: 4, max: 50 },
    es: 'Para la merienda de una excursión tenemos {a} bocadillos y {b} botellas de agua. Queremos hacer bolsas iguales con todo, sin que sobre nada, y el mayor número posible de bolsas. ¿Cuántas bolsas podemos hacer?',
    en: 'For a picnic on a school trip we have {a} sandwiches and {b} bottles of water. We want to make equal bags with everything, with nothing left over, and as many bags as possible. How many bags can we make? (left over = sobrar; as many as possible = el mayor número posible)',
  },
  {
    id: 'huerto_filas', esquema: 'grupos', pide: 'mcd', unidad: { es: 'plantas', en: 'plants' }, origen: 'nuevo',
    rango: { g: [2, 7], cof: [2, 7], min: 4, max: 50 },
    es: 'En el huerto del instituto tenemos {a} tomateras y {b} lechugas. Queremos plantarlas en filas con el mismo número de plantas en todas, sin mezclar tomateras y lechugas, y con las filas lo más largas posible. ¿Cuántas plantas hay en cada fila?',
    en: 'In the school garden we have {a} tomato plants and {b} lettuces. We want to plant them in rows with the same number of plants in every row, without mixing tomato plants and lettuces, and with rows as long as possible. How many plants are there in each row? (rows = filas; as long as possible = lo más largas posible)',
  },
  {
    id: 'biblioteca', esquema: 'grupos', pide: 'mcd', unidad: { es: 'libros', en: 'books' }, origen: 'nuevo',
    rango: { g: [2, 7], cof: [2, 7], min: 4, max: 50 },
    es: 'En la biblioteca de clase hay {a} cómics y {b} libros de cuentos. Queremos colocarlos en estantes con el mismo número de libros en cada uno, sin mezclar cómics y cuentos, y con el mayor número posible de libros en cada estante. ¿Cuántos libros van en cada estante?',
    en: 'In the class library there are {a} comics and {b} storybooks. We want to put them on shelves with the same number of books on each shelf, without mixing comics and storybooks, and with as many books as possible on each shelf. How many books go on each shelf? (shelves = estantes; as many as possible = el mayor número posible)',
  },

  // --- Cortar en trozos iguales (m.c.d.) --------------------------------------
  {
    id: 'cuerdas', esquema: 'cortar', pide: 'mcd', unidad: M, origen: 'hoja 10',
    rango: { g: [2, 9], cof: [2, 7], min: 6, max: 60, evitar: [[12, 18]] },
    es: 'Tenemos una cuerda de {a} m y otra de {b} m. Queremos cortarlas en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos metros mide cada trozo?',
    en: 'We have a rope of {a} m and another of {b} m. We want to cut them into equal pieces, as long as possible, with nothing left over. How many metres long is each piece? (rope = cuerda; pieces = trozos; as long as possible = lo más largos posible)',
  },
  {
    id: 'farolas', esquema: 'cortar', pide: 'mcd', unidad: M, origen: 'hoja 9',
    rango: { g: [4, 9], paso: 5, cof: [2, 7], min: 40, max: 300, evitar: [[180, 198]] },
    es: 'Una calle mide {a} m y otra {b} m. Ponemos farolas en las dos calles, una en cada extremo y siempre a la misma distancia entre dos farolas seguidas. Las queremos lo más separadas posible. ¿Cuántos metros hay entre dos farolas seguidas?',
    en: 'One street is {a} m long and another is {b} m long. We put lampposts along both streets, with one at each end and always the same distance between two lampposts next to each other. We want them as far apart as possible. How many metres are there between two lampposts next to each other? (lampposts = farolas; next to each other = seguidas; as far apart as possible = lo más separadas posible)',
  },
  {
    id: 'cintas', esquema: 'cortar', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [3, 12], cof: [2, 7], min: 10, max: 90 },
    es: 'Para decorar la fiesta tenemos una cinta de {a} cm y otra de {b} cm. Las cortamos en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos centímetros mide cada trozo?',
    en: 'To decorate for the party we have a ribbon of {a} cm and another of {b} cm. We cut them into equal pieces, as long as possible, with nothing left over. How many centimetres long is each piece? (ribbon = cinta; as long as possible = lo más largos posible)',
  },
  {
    id: 'listones', esquema: 'cortar', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [5, 15], cof: [2, 7], min: 20, max: 120 },
    es: 'En clase de Tecnología tenemos dos listones de madera de {a} cm y de {b} cm. Queremos cortarlos en trozos iguales, lo más largos posible, sin que sobre madera. ¿Cuántos centímetros mide cada trozo?',
    en: 'In the technology class we have two wooden strips of {a} cm and {b} cm. We want to cut them into equal pieces, as long as possible, with no wood left over. How many centimetres long is each piece? (wooden strips = listones; as long as possible = lo más largos posible)',
  },
  {
    id: 'arboles', esquema: 'cortar', pide: 'mcd', unidad: M, origen: 'nuevo',
    rango: { g: [2, 8], cof: [2, 7], min: 10, max: 60 },
    es: 'Vamos a plantar árboles en dos lados del patio: uno mide {a} m y el otro {b} m. Habrá un árbol en cada esquina y siempre la misma distancia entre dos árboles seguidos, y queremos que esa distancia sea la mayor posible. ¿Cuántos metros hay entre dos árboles seguidos?',
    en: 'We are going to plant trees along two sides of the playground: one side is {a} m long and the other is {b} m long. There will be a tree at each corner and always the same distance between two trees next to each other, and we want this distance to be as long as possible. How many metres are there between two trees next to each other? (corner = esquina; next to each other = seguidos; as long as possible = la mayor posible)',
  },
  {
    id: 'regaliz', esquema: 'cortar', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 7], min: 6, max: 42 },
    es: 'Tenemos dos tiras de regaliz de {a} cm y de {b} cm. Las cortamos en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos centímetros mide cada trozo?',
    en: 'We have two liquorice laces of {a} cm and {b} cm. We cut them into equal pieces, as long as possible, with nothing left over. How many centimetres long is each piece? (liquorice laces = tiras de regaliz; as long as possible = lo más largos posible)',
  },
  {
    // «El menor número de trozos» pide el m.c.d. (U2-4A-01: «menor» no decide).
    id: 'cuerdas_menos_trozos', esquema: 'cortar', pide: 'mcd', unidad: M, origen: 'nuevo',
    rango: { g: [2, 9], cof: [2, 7], min: 6, max: 60, evitar: [[12, 18]] },
    es: 'Cortamos una cuerda de {a} m y otra de {b} m en trozos iguales, sin que sobre nada, y queremos el menor número posible de trozos. ¿Cuántos metros mide cada trozo?',
    en: 'We cut a rope of {a} m and another of {b} m into equal pieces, with nothing left over, and we want the smallest possible number of pieces. How many metres long is each piece? (rope = cuerda; smallest number of pieces = el menor número de trozos)',
  },

  // --- Cubrir un rectángulo con cuadrados (m.c.d.) ----------------------------
  {
    id: 'habitacion', esquema: 'baldosas', pide: 'mcd', unidad: CM, origen: 'hoja 5',
    rango: { g: [2, 8], paso: 10, cof: [2, 9], min: 250, max: 800, ordenados: true, evitar: [[770, 420]] },
    es: 'Una habitación mide {a} cm de largo y {b} cm de ancho. Queremos cubrir el suelo con baldosas cuadradas iguales, lo más grandes posible, sin cortar ninguna. ¿Cuántos centímetros mide el lado de cada baldosa?',
    en: 'A room is {a} cm long and {b} cm wide. We want to cover the floor with equal square tiles, as big as possible, without cutting any tile. How many centimetres long is the side of each tile? (floor = suelo; tiles = baldosas; as big as possible = lo más grandes posible)',
  },
  {
    id: 'cuadricula', esquema: 'baldosas', pide: 'mcd', unidad: CM, origen: 'hoja 12',
    rango: { g: [2, 4], cof: [2, 9], min: 10, max: 30, ordenados: true, evitar: [[21, 18]] },
    es: 'Una hoja de papel mide {a} cm de largo y {b} cm de ancho. Queremos dividirla en cuadrados iguales, lo más grandes posible, sin que sobre papel. ¿Cuántos centímetros mide el lado de cada cuadrado?',
    en: 'A sheet of paper is {a} cm long and {b} cm wide. We want to divide it into equal squares, as big as possible, with no paper left over. How many centimetres long is the side of each square? (sheet = hoja; as big as possible = lo más grandes posible)',
  },
  {
    id: 'huerto_parcelas', esquema: 'baldosas', pide: 'mcd', unidad: M, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 7], min: 6, max: 40, ordenados: true },
    es: 'El huerto del instituto es un rectángulo de {a} m de largo y {b} m de ancho. Queremos dividirlo en parcelas cuadradas iguales, lo más grandes posible, usando todo el huerto. ¿Cuántos metros mide el lado de cada parcela?',
    en: 'The school garden is a rectangle {a} m long and {b} m wide. We want to divide it into equal square plots, as big as possible, using all the garden. How many metres long is the side of each plot? (plots = parcelas; as big as possible = lo más grandes posible)',
  },
  {
    id: 'bizcocho', esquema: 'baldosas', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 7], min: 6, max: 40, ordenados: true },
    es: 'Un bizcocho rectangular mide {a} cm de largo y {b} cm de ancho. Queremos cortarlo en trozos cuadrados iguales, lo más grandes posible, sin que sobre nada. ¿Cuántos centímetros mide el lado de cada trozo?',
    en: 'A rectangular cake is {a} cm long and {b} cm wide. We want to cut it into equal square pieces, as big as possible, with nothing left over. How many centimetres long is the side of each piece? (cake = bizcocho; as big as possible = lo más grandes posible)',
  },
  {
    id: 'corcho', esquema: 'baldosas', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [5, 15], cof: [2, 5], min: 20, max: 120, ordenados: true },
    es: 'Un tablón de corcho mide {a} cm de largo y {b} cm de ancho. Queremos cubrirlo con fotos cuadradas iguales, lo más grandes posible, sin dejar huecos y sin cortar ninguna foto. ¿Cuántos centímetros mide el lado de cada foto?',
    en: 'A noticeboard is {a} cm long and {b} cm wide. We want to cover it with equal square photos, as big as possible, with no gaps and without cutting any photo. How many centimetres long is the side of each photo? (noticeboard = tablón de corcho; gaps = huecos; as big as possible = lo más grandes posible)',
  },
  {
    id: 'pixeles', esquema: 'baldosas', pide: 'mcd', unidad: { es: 'píxeles', en: 'pixels' }, origen: 'nuevo',
    rango: { g: [4, 8], paso: 4, cof: [2, 9], min: 48, max: 300, ordenados: true },
    es: 'En un videojuego, el mapa mide {a} píxeles de ancho y {b} píxeles de alto. Queremos dividirlo en bloques cuadrados iguales, lo más grandes posible, sin que sobre espacio. ¿Cuántos píxeles mide el lado de cada bloque?',
    en: 'In a video game, the map is {a} pixels wide and {b} pixels high. We want to divide it into equal square blocks, as big as possible, with no space left over. How many pixels long is the side of each block? (blocks = bloques; as big as possible = lo más grandes posible)',
  },
  {
    // «El menor número de baldosas» pide el m.c.d. (U2-4A-01: «menor» no decide).
    id: 'patio_menos_baldosas', esquema: 'baldosas', pide: 'mcd', unidad: CM, origen: 'nuevo',
    rango: { g: [2, 8], paso: 10, cof: [2, 9], min: 200, max: 800, ordenados: true },
    es: 'Un patio mide {a} cm de largo y {b} cm de ancho. Queremos cubrirlo con baldosas cuadradas iguales, sin cortar ninguna, y usar el menor número posible de baldosas. ¿Cuántos centímetros mide el lado de cada baldosa?',
    en: 'A playground is {a} cm long and {b} cm wide. We want to cover it with equal square tiles, without cutting any tile, and use the smallest possible number of tiles. How many centimetres long is the side of each tile? (tiles = baldosas; smallest number of tiles = el menor número de baldosas)',
  },

  // --- La menor cantidad que se reparte de dos formas (m.c.m.) ----------------
  {
    id: 'clase', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'alumnos', en: 'students' }, origen: 'hoja 16',
    rango: { g: [2, 3], cof: [2, 5], min: 4, max: 15, maxMcm: 30, evitar: [[6, 10]] },
    es: 'Una clase se puede dividir en grupos de {a} sin que sobre nadie, y también en grupos de {b} sin que sobre nadie. ¿Cuál es el menor número de alumnos que puede tener la clase?',
    en: 'A class can be split into groups of {a} with nobody left over, and also into groups of {b} with nobody left over. What is the smallest number of students the class can have? (split = dividir; left over = sobrar; smallest = menor)',
  },
  {
    id: 'globos', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'globos', en: 'balloons' }, origen: 'hoja 13',
    rango: { g: [2, 4], cof: [2, 7], min: 4, max: 24, evitar: [[18, 15], [15, 12], [18, 12]] },
    es: 'Tengo una bolsa de globos. Puedo repartirlos a partes iguales entre {a} niños y también entre {b} niños, sin que sobre ninguno. ¿Cuál es el menor número de globos que puede tener la bolsa?',
    en: 'I have a bag of balloons. I can share them equally among {a} children and also among {b} children, with none left over. What is the smallest number of balloons the bag can have? (balloons = globos; share equally = repartir a partes iguales; smallest = menor)',
  },
  {
    id: 'mesas', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'invitados', en: 'guests' }, origen: 'hoja 19',
    rango: { g: [2, 3], cof: [2, 5], min: 4, max: 12, evitar: [[6, 9], [9, 12], [6, 12]] },
    es: 'En una fiesta, los invitados pueden sentarse todos en mesas de {a} y también todos en mesas de {b}, sin que quede ningún sitio vacío. ¿Cuál es el menor número de invitados que puede haber?',
    en: 'At a party, all the guests can sit at tables of {a} and also all at tables of {b}, with no empty seats. What is the smallest number of guests there can be? (guests = invitados; empty seats = sitios vacíos; smallest = menor)',
  },
  {
    id: 'caramelos', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'caramelos', en: 'sweets' }, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20 },
    es: 'Una bolsa de caramelos se puede repartir a partes iguales entre {a} amigos y también entre {b} amigos, sin que sobre ninguno. ¿Cuál es el menor número de caramelos que puede tener la bolsa?',
    en: 'A bag of sweets can be shared equally among {a} friends and also among {b} friends, with none left over. What is the smallest number of sweets the bag can have? (sweets = caramelos; share equally = repartir a partes iguales; smallest = menor)',
  },
  {
    id: 'desfile', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'alumnos', en: 'students' }, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20 },
    es: 'En el desfile de carnaval, los alumnos de un curso pueden ir todos en filas de {a} y también todos en filas de {b}, sin que sobre nadie. ¿Cuál es el menor número de alumnos que puede haber?',
    en: 'In the carnival parade, the students of one year group can all walk in rows of {a} and also all in rows of {b}, with nobody left over. What is the smallest number of students there can be? (rows = filas; left over = sobrar; smallest = menor)',
  },
  {
    id: 'huevos', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'huevos', en: 'eggs' }, origen: 'nuevo',
    rango: { g: [2, 6], cof: [2, 5], min: 4, max: 30 },
    es: 'Tenemos unos huevos que se pueden guardar todos en cajas de {a} y también todos en cajas de {b}, con todas las cajas llenas y sin que sobre ningún huevo. ¿Cuál es el menor número de huevos que puede haber?',
    en: 'We have some eggs that can all be put in boxes of {a} and also all in boxes of {b}, with all the boxes full and no eggs left over. What is the smallest number of eggs there can be? (full = llenas; left over = sobrar; smallest = menor)',
  },
  {
    id: 'cartas', esquema: 'menor_cantidad', pide: 'mcm', unidad: { es: 'cartas', en: 'cards' }, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 7], min: 4, max: 28 },
    es: 'Tenemos unas cartas que se pueden colocar todas en montones de {a} y también todas en montones de {b}, sin que sobre ninguna. ¿Cuál es el menor número de cartas que puede haber?',
    en: 'We have some cards that can all be put in piles of {a} and also all in piles of {b}, with none left over. What is the smallest number of cards there can be? (piles = montones; left over = sobrar; smallest = menor)',
  },

  // --- Igualar paquetes (m.c.m.) ----------------------------------------------
  {
    id: 'hamburguesas', esquema: 'paquetes', pide: 'mcm', unidad: { es: 'hamburguesas', en: 'burgers' }, origen: 'hoja 2',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20, evitar: [[6, 4], [36, 40]] },
    es: 'Las hamburguesas vienen en paquetes de {a} y los panecillos en paquetes de {b}. Queremos el mismo número de hamburguesas que de panecillos, para que no sobre ninguno. ¿Cuál es el menor número de hamburguesas que tenemos que comprar para conseguirlo?',
    en: 'Burgers come in packs of {a} and buns come in packs of {b}. We want the same number of burgers and buns, so that none are left over. What is the smallest number of burgers we need to buy? (buns = panecillos; left over = sobrar; smallest = menor)',
  },
  {
    id: 'pelotas', esquema: 'paquetes', pide: 'mcm', unidad: { es: 'pelotas', en: 'balls' }, origen: 'hoja 7',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20, evitar: [[12, 16]] },
    es: 'Un amigo compra pelotas de ping-pong en paquetes de {a} y otro en paquetes de {b}. Al final los dos tienen el mismo número de pelotas. ¿Cuál es el menor número de pelotas que puede tener cada uno?',
    en: 'One friend buys ping-pong balls in packs of {a} and another friend buys them in packs of {b}. In the end they both have the same number of balls. What is the smallest number of balls each one can have? (in the end = al final; smallest = menor)',
  },
  {
    id: 'vasos_platos', esquema: 'paquetes', pide: 'mcm', unidad: { es: 'vasos', en: 'cups' }, origen: 'nuevo',
    rango: { g: [2, 5], cof: [2, 5], min: 4, max: 25 },
    es: 'Para una fiesta, los vasos de papel vienen en paquetes de {a} y los platos de papel en paquetes de {b}. Queremos el mismo número de vasos que de platos. ¿Cuál es el menor número de vasos que tenemos que comprar para conseguirlo?',
    en: 'For a party, paper cups come in packs of {a} and paper plates come in packs of {b}. We want the same number of cups and plates. What is the smallest number of cups we need to buy? (cups = vasos; plates = platos; smallest = menor)',
  },
  {
    id: 'tornillos', esquema: 'paquetes', pide: 'mcm', unidad: { es: 'tornillos', en: 'screws' }, origen: 'nuevo',
    rango: { g: [2, 5], cof: [2, 5], min: 4, max: 25 },
    es: 'En el taller de Tecnología, los tornillos vienen en bolsas de {a} y las tuercas en bolsas de {b}. Necesitamos una tuerca para cada tornillo, sin que sobre ninguna. ¿Cuál es el menor número de tornillos que tenemos que comprar para conseguirlo?',
    en: 'In the technology workshop, screws come in bags of {a} and nuts come in bags of {b}. We need one nut for each screw, with none left over. What is the smallest number of screws we need to buy? (screws = tornillos; nuts = tuercas; smallest = menor)',
  },
  {
    id: 'pegatinas', esquema: 'paquetes', pide: 'mcm', unidad: { es: 'pegatinas', en: 'stickers' }, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20 },
    es: 'Las pegatinas vienen en hojas de {a} y los cuadernos en paquetes de {b}. Queremos poner una pegatina en cada cuaderno, sin que sobre nada. ¿Cuál es el menor número de pegatinas que tenemos que comprar para conseguirlo?',
    en: 'Stickers come in sheets of {a} and notebooks come in packs of {b}. We want to put one sticker on each notebook, with nothing left over. What is the smallest number of stickers we need to buy? (notebooks = cuadernos; left over = sobrar; smallest = menor)',
  },
  {
    id: 'torres', esquema: 'paquetes', pide: 'mcm', unidad: CM, origen: 'nuevo',
    rango: { g: [2, 4], cof: [2, 5], min: 4, max: 20 },
    es: 'Hacemos dos torres: una con cubos de {a} cm de alto y otra con cubos de {b} cm de alto. Queremos que las dos torres tengan la misma altura. ¿Cuál es la menor altura, en centímetros, que pueden tener?',
    en: 'We build two towers: one with blocks {a} cm tall and the other with blocks {b} cm tall. We want both towers to have the same height. What is the smallest height, in centimetres, they can have? (tall = de alto; height = altura; smallest = menor)',
  },
  {
    id: 'pasos', esquema: 'paquetes', pide: 'mcm', unidad: CM, origen: 'nuevo',
    rango: { g: [2, 3], paso: 5, cof: [4, 7], min: 40, max: 80, maxMcm: 600 },
    es: 'Dos amigos salen juntos de la misma línea y caminan en la misma dirección. Los pasos de uno miden {a} cm y los del otro {b} cm. ¿A cuántos centímetros de la línea, como mínimo, vuelven a pisar los dos en el mismo sitio?',
    en: 'Two friends start together from the same line and walk in the same direction. One friend\'s steps are {a} cm long and the other friend\'s steps are {b} cm long. What is the smallest distance from the line, in centimetres, where they both step on the same spot again? (steps = pasos; step on = pisar; same spot = mismo sitio; smallest = menor)',
  },
];
