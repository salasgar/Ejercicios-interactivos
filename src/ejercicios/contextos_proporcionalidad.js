// Banco de contextos de los generadores de proporcionalidad y porcentajes (tarea 233 del reparto
// PU2, unidad 7). Cada contexto declara su cota de realismo (acta de la U7, «Cotas de realismo
// aprobadas») y un test la comprueba en miles de ítems (tests/proporcionalidad-items.test.js).
// El dinero va siempre en CÉNTIMOS enteros: nada de flotantes.

const dos = c => `${Math.floor(c / 100)}.${String(c % 100).padStart(2, '0')}`;
/** Céntimos → «3{,}60» (TeX), «3,60» (texto en español) y «3.60» (texto en inglés); siempre dos decimales. */
export const eurosTex = c => dos(c).replace('.', '{,}');
export const eurosEs = c => dos(c).replace('.', ',');
export const eurosEn = c => dos(c);

/** Un porcentaje en el texto: «20 %» con espacio duro en español, «20%» en inglés. */
const P = ' %';

// --- Compra al peso (directa, reducción a la unidad). precio por kg en céntimos ----------------
export const COMPRA_PESO = [
  { id: 'manzanas', kg: [2, 12], precioKg: [150, 350], maxTotal: 5000,
    es: 'Si {a} kg de manzanas cuestan {b} €, ¿cuántos euros cuestan {c} kg?', en: 'If {a} kg of apples cost €{b_en}, how many euros do {c} kg cost?' },
  { id: 'naranjas', kg: [2, 12], precioKg: [100, 300], maxTotal: 5000,
    es: 'En una frutería, {a} kg de naranjas cuestan {b} €. ¿Cuántos euros cuestan {c} kg de esas naranjas?', en: 'At a greengrocer’s, {a} kg of oranges cost €{b_en}. How many euros do {c} kg of those oranges cost?' },
  { id: 'patatas', kg: [2, 12], precioKg: [80, 200], maxTotal: 4000,
    es: 'Si {a} kg de patatas cuestan {b} €, ¿cuántos euros cuestan {c} kg?', en: 'If {a} kg of potatoes cost €{b_en}, how many euros do {c} kg cost?' },
  { id: 'tomates', kg: [2, 12], precioKg: [150, 400], maxTotal: 5000,
    es: 'En el mercado, {a} kg de tomates cuestan {b} €. ¿Cuántos euros cuestan {c} kg?', en: 'At the market, {a} kg of tomatoes cost €{b_en}. How many euros do {c} kg cost?' },
  { id: 'pollo', kg: [2, 8], precioKg: [400, 900], maxTotal: 7000,
    es: 'Si {a} kg de pollo cuestan {b} €, ¿cuántos euros cuestan {c} kg?', en: 'If {a} kg of chicken cost €{b_en}, how many euros do {c} kg cost?' },
];

// --- Recetas para 2-12 personas, cantidades de cocina (50-1000 g, hasta 2 L) --------------------
export const RECETAS = [
  { id: 'harina', personas: [2, 12], porPersona: [25, 100], paso: 25, max: 1000,
    es: 'Una receta de bizcocho para {a} personas lleva {b} g de harina. ¿Cuántos gramos de harina lleva para {c} personas?', en: 'A sponge cake recipe for {a} people uses {b} g of flour. How many grams of flour does it use for {c} people?' },
  { id: 'arroz', personas: [2, 12], porPersona: [50, 100], paso: 10, max: 1000,
    es: 'Para {a} personas, una paella lleva {b} g de arroz. ¿Cuántos gramos de arroz lleva para {c} personas?', en: 'For {a} people, a paella uses {b} g of rice. How many grams of rice does it need for {c} people?' },
  { id: 'leche', personas: [2, 12], porPersona: [100, 200], paso: 50, max: 2000,
    es: 'Una receta de natillas para {a} personas lleva {b} mL de leche. ¿Cuántos mililitros de leche lleva para {c} personas?', en: 'A custard recipe for {a} people uses {b} mL of milk. How many millilitres of milk does it use for {c} people?' },
  { id: 'pasta', personas: [2, 12], porPersona: [50, 80], paso: 10, max: 1000,
    es: 'Para {a} personas hacen falta {b} g de pasta. ¿Cuántos gramos hacen falta para {c} personas?', en: 'For {a} people you need {b} g of pasta. How many grams do you need for {c} people?' },
];

// --- Inversa: todos al mismo ritmo y dicho en el enunciado --------------------------------------
export const OBREROS = [
  { id: 'pintores', n: [2, 12], t: [2, 60], unidad: 'días',
    es: 'Si {a} pintores, todos al mismo ritmo, pintan un edificio en {b} días, ¿cuántos días tardarán {c} pintores al mismo ritmo?', en: 'If {a} painters, all working at the same rate, paint a building in {b} days, how many days will {c} painters take at the same rate?' },
  { id: 'maquinas', n: [2, 12], t: [2, 24], unidad: 'horas',
    es: '{a} máquinas iguales hacen un pedido en {b} horas. ¿Cuántas horas tardarán {c} máquinas iguales?', en: '{a} identical machines complete an order in {b} hours. How many hours will {c} identical machines take?' },
  { id: 'grifos', n: [2, 12], t: [2, 24], unidad: 'horas',
    es: '{a} grifos iguales llenan un depósito en {b} horas. ¿Cuántas horas tardarán {c} grifos iguales?', en: '{a} identical taps fill a tank in {b} hours. How many hours will {c} identical taps take?' },
  { id: 'voluntarios', n: [2, 12], t: [2, 30], unidad: 'días',
    es: '{a} voluntarios, todos al mismo ritmo, limpian un monte en {b} días. ¿Cuántos días tardarán {c} voluntarios al mismo ritmo?', en: '{a} volunteers, all working at the same rate, clean up a hillside in {b} days. How many days will {c} volunteers take at the same rate?' },
];

// --- Escalas: planos 1:50, 1:100, 1:200; mapas de 1:25 000 a 1:1 000 000 ------------------------
export const ESCALAS = [
  { id: 'mapa', escalas: [25000, 50000, 100000, 200000, 250000, 500000, 1000000], cmPlano: [2, 30], realMin: 1, realMax: 250, divisor: 100000, unidad: 'km',
    es_real: 'En un mapa a escala 1 : {N}, la distancia entre dos pueblos mide {cm} cm. ¿Cuántos kilómetros hay en la realidad entre los dos pueblos?',
    en_real: 'On a map with a scale of 1 : {N}, two villages are {cm} cm apart. How many kilometres apart are they in real life?',
    es_plano: 'Dos pueblos están a {real} km. ¿Cuántos centímetros los separan en un mapa a escala 1 : {N}?',
    en_plano: 'Two villages are {real_en} km apart. How many centimetres apart are they on a map with a scale of 1 : {N}?' },
  { id: 'plano', escalas: [50, 100, 200], cmPlano: [1, 20], realMin: 2, realMax: 10, divisor: 100, unidad: 'm',
    es_real: 'En un plano a escala 1 : {N}, una habitación mide {cm} cm de largo. ¿Cuántos metros mide en la realidad?',
    en_real: 'On a plan with a scale of 1 : {N}, a room is {cm} cm long. How many metres long is it in real life?',
    es_plano: 'Una habitación mide {real} m de largo. ¿Cuántos centímetros mide en un plano a escala 1 : {N}?',
    en_plano: 'A room is {real_en} m long. How many centimetres long is it on a plan with a scale of 1 : {N}?' },
];

// --- Repartos entre 2 y 4 personas, exactos al céntimo -------------------------------------------
export const REPARTOS = [
  { id: 'loteria', personas: [2, 4], dato: [5, 50], paso: 5, premio: [2000, 300000],
    es: 'Para un décimo de lotería, unos amigos ponen {lista} € (cada cual lo suyo). El décimo da un premio de {total} €, que se reparte en proporción a lo que puso cada uno. ¿Cuántos euros le tocan al primero?',
    en: 'For a lottery ticket, some friends put in €{lista_en} (each one their own part). The ticket wins €{total_en}, which is shared in proportion to what each one put in. How many euros does the first one get?' },
  { id: 'horas', personas: [2, 4], dato: [2, 10], paso: 1, premio: [3000, 150000],
    es: 'Unos socios trabajan {lista} horas en un encargo y cobran {total} € en total, repartidos en proporción a las horas trabajadas. ¿Cuántos euros cobra el primero?',
    en: 'Some partners work {lista_en} hours on a job and are paid €{total_en} in total, shared in proportion to the hours worked. How many euros does the first one get?' },
];

// --- Porcentaje de un grupo: número entero de personas (1-99 %) ----------------------------------
export const GRUPOS = [
  { id: 'instituto', t: [100, 1200],
    parte: ['En un instituto de {t} alumnos, el {p}' + P + ' va en autobús. ¿Cuántos alumnos van en autobús?', 'In a school with {t} students, {p}% come by bus. How many students come by bus?'],
    resto: ['En un instituto de {t} alumnos, el {p}' + P + ' va en autobús. ¿Cuántos alumnos no van en autobús?', 'In a school with {t} students, {p}% come by bus. How many students do not come by bus?'],
    total: ['El {p}' + P + ' de los alumnos de un instituto va en autobús, y son {n}. ¿Cuántos alumnos tiene el instituto?', '{p}% of the students at a school come by bus, and that is {n} students. How many students does the school have?'],
    cual: ['En un instituto de {t} alumnos, {n} van en autobús. ¿Qué porcentaje de los alumnos va en autobús?', 'In a school with {t} students, {n} come by bus. What percentage of the students come by bus?'] },
  { id: 'fabrica', t: [200, 2400],
    parte: ['Una fábrica tiene {t} empleados y despide al {p}' + P + '. ¿Cuántos empleados despide?', 'A factory has {t} employees and lays off {p}% of them. How many employees does it lay off?'],
    resto: ['Una fábrica tiene {t} empleados y despide al {p}' + P + '. ¿Cuántos empleados se quedan?', 'A factory has {t} employees and lays off {p}% of them. How many employees stay?'],
    total: ['Una fábrica despide al {p}' + P + ' de sus empleados, y son {n} personas. ¿Cuántos empleados tenía la fábrica?', 'A factory lays off {p}% of its employees, and that is {n} people. How many employees did the factory have?'],
    cual: ['Una fábrica tiene {t} empleados y despide a {n}. ¿Qué porcentaje de los empleados despide?', 'A factory has {t} employees and lays off {n}. What percentage of the employees does it lay off?'] },
  { id: 'pueblo', t: [200, 5000],
    parte: ['En un pueblo de {t} vecinos, el {p}' + P + ' tiene perro. ¿Cuántos vecinos tienen perro?', 'In a village of {t} people, {p}% have a dog. How many people have a dog?'],
    resto: ['En un pueblo de {t} vecinos, el {p}' + P + ' tiene perro. ¿Cuántos vecinos no tienen perro?', 'In a village of {t} people, {p}% have a dog. How many people do not have a dog?'],
    total: ['En un pueblo, el {p}' + P + ' de los vecinos tiene perro, y son {n}. ¿Cuántos vecinos tiene el pueblo?', 'In a village, {p}% of the people have a dog, and that is {n} people. How many people live in the village?'],
    cual: ['En un pueblo de {t} vecinos, {n} tienen perro. ¿Qué porcentaje de los vecinos tiene perro?', 'In a village of {t} people, {n} have a dog. What percentage of the people have a dog?'] },
  { id: 'club', t: [100, 1000],
    parte: ['Un club deportivo tiene {t} socios y el {p}' + P + ' juega al tenis. ¿Cuántos socios juegan al tenis?', 'A sports club has {t} members and {p}% play tennis. How many members play tennis?'],
    resto: ['Un club deportivo tiene {t} socios y el {p}' + P + ' juega al tenis. ¿Cuántos socios no juegan al tenis?', 'A sports club has {t} members and {p}% play tennis. How many members do not play tennis?'],
    total: ['En un club deportivo, el {p}' + P + ' de los socios juega al tenis, y son {n}. ¿Cuántos socios tiene el club?', 'In a sports club, {p}% of the members play tennis, and that is {n} members. How many members does the club have?'],
    cual: ['Un club deportivo tiene {t} socios y {n} juegan al tenis. ¿Qué porcentaje de los socios juega al tenis?', 'A sports club has {t} members and {n} play tennis. What percentage of the members play tennis?'] },
];

// --- Precios: descuentos (5-70 %), subidas (1-20 %) y IVA de España (4, 10, 21 %) ----------------
export const DESCUENTOS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70];
export const SUBIDA = { min: 1, max: 20 };
export const IVAS = [4, 10, 21];

export const REBAJAS = [
  { id: 'zapatillas', precio: [2500, 12000], paso: 100,
    descuento: ['Unas zapatillas de {precio} € tienen un descuento del {p}' + P + '. ¿Cuántos euros cuestan ahora?', 'A pair of trainers costing €{precio_en} has a {p}% discount. How many euros do they cost now?'],
    original: ['Unas zapatillas rebajadas un {p}' + P + ' cuestan {precio} €. ¿Cuántos euros costaban antes de la rebaja?', 'A pair of trainers with {p}% off costs €{precio_en}. How many euros did they cost before the sale?'] },
  { id: 'abrigo', precio: [4000, 20000], paso: 100,
    descuento: ['Un abrigo de {precio} € está rebajado un {p}' + P + '. ¿Cuántos euros cuesta ahora?', 'A coat costing €{precio_en} is {p}% off. How many euros does it cost now?'],
    original: ['Un abrigo rebajado un {p}' + P + ' cuesta {precio} €. ¿Cuántos euros costaba antes de la rebaja?', 'A coat with {p}% off costs €{precio_en}. How many euros did it cost before the sale?'] },
  { id: 'bici', precio: [15000, 60000], paso: 500,
    descuento: ['Una bicicleta de {precio} € tiene un descuento del {p}' + P + '. ¿Cuántos euros cuesta ahora?', 'A bicycle costing €{precio_en} has a {p}% discount. How many euros does it cost now?'],
    original: ['Una bicicleta rebajada un {p}' + P + ' cuesta {precio} €. ¿Cuántos euros costaba antes de la rebaja?', 'A bicycle with {p}% off costs €{precio_en}. How many euros did it cost before the sale?'] },
  { id: 'mochila', precio: [1500, 6000], paso: 100,
    descuento: ['Una mochila de {precio} € tiene un descuento del {p}' + P + '. ¿Cuántos euros cuesta ahora?', 'A backpack costing €{precio_en} has a {p}% discount. How many euros does it cost now?'],
    original: ['Una mochila rebajada un {p}' + P + ' cuesta {precio} €. ¿Cuántos euros costaba antes de la rebaja?', 'A backpack with {p}% off costs €{precio_en}. How many euros did it cost before the sale?'] },
];

export const SUBIDAS = [
  { id: 'alquiler', precio: [30000, 120000], paso: 5000,
    es: 'El alquiler mensual de un piso, {precio} €, sube un {p}' + P + '. ¿Cuántos euros se pagan ahora al mes?', en: 'The monthly rent of a flat, €{precio_en}, goes up by {p}%. How many euros is paid per month now?' },
  { id: 'sueldo', precio: [90000, 300000], paso: 5000,
    es: 'Un sueldo de {precio} € al mes sube un {p}' + P + '. ¿Cuántos euros se cobran ahora al mes?', en: 'A monthly salary of €{precio_en} goes up by {p}%. How many euros is earned per month now?' },
  { id: 'abono', precio: [2000, 8000], paso: 500,
    es: 'El abono mensual de transporte cuesta {precio} € y sube un {p}' + P + '. ¿Cuántos euros cuesta ahora?', en: 'A monthly transport pass costs €{precio_en} and goes up by {p}%. How many euros does it cost now?' },
];

export const IVA_CONTEXTOS = [
  { id: 'libro', precio: [800, 3000], iva: [4],
    es: 'Un libro cuesta {precio} € sin IVA, y el IVA es del {p}' + P + '. ¿Cuántos euros cuesta con IVA?', en: 'A book costs €{precio_en} before VAT, and VAT is {p}%. How many euros does it cost including VAT?' },
  { id: 'menu', precio: [1000, 3500], iva: [10],
    es: 'Un menú de restaurante cuesta {precio} € sin IVA, y el IVA es del {p}' + P + '. ¿Cuántos euros cuesta con IVA?', en: 'A restaurant set menu costs €{precio_en} before VAT, and VAT is {p}%. How many euros does it cost including VAT?' },
  { id: 'patinete', precio: [10000, 40000], iva: [21],
    es: 'Un patinete eléctrico cuesta {precio} € sin IVA, y el IVA es del {p}' + P + '. ¿Cuántos euros cuesta con IVA?', en: 'An electric scooter costs €{precio_en} before VAT, and VAT is {p}%. How many euros does it cost including VAT?' },
  { id: 'movil', precio: [15000, 90000], iva: [21],
    es: 'Un móvil cuesta {precio} € sin IVA, y el IVA es del {p}' + P + '. ¿Cuántos euros cuesta con IVA?', en: 'A mobile phone costs €{precio_en} before VAT, and VAT is {p}%. How many euros does it cost including VAT?' },
];

// --- Interés: 1-5 % anual sobre 100-10 000 € ---------------------------------------------------
export const INTERES = { tipo: [1, 5], capital: [100, 10000], pasoCapital: 100 };
