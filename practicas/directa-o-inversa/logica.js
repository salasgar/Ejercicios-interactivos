// «¿Directa, inversa o ninguna?» (PU2, tarea 216), unidad 7 (sesión 6): la lógica de los tres ejercicios.
//   1. Clasifica la situación   un banco de 31 situaciones con su condición («mismo precio», «al mismo ritmo»)  (U7-2A-02)
//   2. Clasifica la tabla       cociente constante (directa), producto constante (inversa) o ninguna            (U7-2C-02)
//   3. ¿Qué planteamiento?      un problema de un paso, directo o inverso, y cuatro cuentas, solo una buena     (U7-2C-01, 2C-03)
// Los ítems son JSON plano (el contador los guarda con cada fallo): las cantidades, como «num/den».

import { CONTEXTOS, generarDatos, cantidad } from '../_comun/proporcion.js';
import { fraccion } from '../_comun/fracciones.js';

export const CLASES = Object.freeze(['directa', 'inversa', 'ninguna']);
/** El id del error: la clase de verdad «-por-» la que se ha elegido (ninguna-por-inversa: era ninguna y ha dicho inversa). */
export const errorDe = (real, elegida) => `${real}-por-${elegida}`;

// ─── Ejercicio 1: el banco de situaciones ──────────────────────────────────────
// par = [x1, y1, x2, y2] con x2 = 2 · x1: directa y2 = 2 · y1; inversa y1 = 2 · y2; ninguna ni lo uno ni lo otro.

const S = (id, clase, cond, x, y, ux, uy, par) => ({ id, clase, cond, x, y, ux, uy, par });
const L = (es, en) => ({ es, en });

export const BANCO = Object.freeze([
  // ── Directa ──
  S('d-naranjas', 'directa', L('Las naranjas cuestan lo mismo cada kilo.', 'Oranges cost the same for every kilo.'),
    L('los kilos de naranjas que compras', 'the kilos of oranges you buy'), L('lo que pagas', 'what you pay'), L('kg', 'kg'), L('€', '€'), [2, 3, 4, 6]),
  S('d-gasolina', 'directa', L('La gasolina cuesta lo mismo cada litro.', 'Petrol costs the same for every litre.'),
    L('los litros que echas', 'the litres you put in'), L('lo que pagas', 'what you pay'), L('L', 'L'), L('€', '€'), [10, 15, 20, 30]),
  S('d-entradas', 'directa', L('Todas las entradas del cine cuestan lo mismo.', 'All the cinema tickets cost the same.'),
    L('el número de entradas', 'the number of tickets'), L('lo que pagas', 'what you pay'), L('entradas', 'tickets'), L('€', '€'), [3, 24, 6, 48]),
  S('d-harina', 'directa', L('Un bizcocho se hace siempre con la misma receta.', 'A sponge cake is always made with the same recipe.'),
    L('las personas para las que es el bizcocho', 'the people the cake is for'), L('los gramos de harina', 'the grams of flour'), L('personas', 'people'), L('g', 'g'), [4, 200, 8, 400]),
  S('d-sueldo', 'directa', L('Una persona cobra lo mismo por cada hora de trabajo.', 'A person is paid the same for every hour of work.'),
    L('las horas que trabaja', 'the hours worked'), L('lo que cobra', 'the pay'), L('horas', 'hours'), L('€', '€'), [5, 40, 10, 80]),
  S('d-vueltas', 'directa', L('Una atleta corre todas las vueltas al mismo ritmo.', 'An athlete runs every lap at the same pace.'),
    L('las vueltas que da a la pista', 'the laps of the track'), L('los minutos que tarda', 'the minutes it takes'), L('vueltas', 'laps'), L('min', 'min'), [2, 6, 4, 12]),
  S('d-coche', 'directa', L('Un coche gasta siempre la misma gasolina cada 100 km.', 'A car always uses the same petrol for every 100 km.'),
    L('los kilómetros que recorre', 'the kilometres it travels'), L('los litros que gasta', 'the litres it uses'), L('km', 'km'), L('L', 'L'), [100, 6, 200, 12]),
  S('d-cuadernos', 'directa', L('Todos los cuadernos cuestan lo mismo.', 'All the notebooks cost the same.'),
    L('el número de cuadernos', 'the number of notebooks'), L('lo que pagas', 'what you pay'), L('cuadernos', 'notebooks'), L('€', '€'), [4, 6, 8, 12]),
  S('d-pintura', 'directa', L('Cada bote de pintura cubre los mismos metros cuadrados de pared.', 'Every tin of paint covers the same area of wall.'),
    L('los botes de pintura', 'the tins of paint'), L('los metros cuadrados que se pintan', 'the square metres painted'), L('botes', 'tins'), L('m²', 'm²'), [2, 30, 4, 60]),
  S('d-grifo', 'directa', L('Un grifo echa siempre la misma agua cada minuto.', 'A tap always gives the same water every minute.'),
    L('los minutos que está abierto', 'the minutes it is open'), L('los litros de agua que salen', 'the litres of water that come out'), L('min', 'min'), L('L', 'L'), [3, 36, 6, 72]),
  S('d-tren', 'directa', L('Un tren va siempre a la misma velocidad.', 'A train always goes at the same speed.'),
    L('las horas de viaje', 'the hours of the journey'), L('los kilómetros que recorre', 'the kilometres it travels'), L('h', 'h'), L('km', 'km'), [2, 160, 4, 320]),
  // ── Inversa ──
  S('i-obreros', 'inversa', L('Todos los obreros trabajan al mismo ritmo y hay que hacer la misma obra.', 'All the workers work at the same rate and the job is always the same.'),
    L('los obreros', 'the workers'), L('los días que tardan', 'the days they take'), L('obreros', 'workers'), L('días', 'days'), [3, 12, 6, 6]),
  S('i-grifos', 'inversa', L('Los grifos son iguales y siempre se llena el mismo depósito.', 'The taps are all the same and the same tank is always filled. (tank = depósito)'),
    L('los grifos abiertos', 'the taps that are open'), L('las horas que tardan en llenarlo', 'the hours they take to fill it'), L('grifos', 'taps'), L('h', 'h'), [2, 8, 4, 4]),
  S('i-regalo', 'inversa', L('Unos amigos pagan a partes iguales el mismo regalo.', 'Some friends share the cost of the same present equally.'),
    L('los amigos que pagan', 'the friends who pay'), L('lo que paga cada uno', 'what each one pays'), L('amigos', 'friends'), L('€', '€'), [3, 20, 6, 10]),
  S('i-botellas', 'inversa', L('Se reparte siempre la misma agua en botellas iguales.', 'The same water is always shared out in bottles that are all the same.'),
    L('los litros que caben en cada botella', 'the litres in each bottle'), L('las botellas que se llenan', 'the bottles that are filled'), L('L', 'L'), L('botellas', 'bottles'), [2, 12, 4, 6]),
  S('i-pienso', 'inversa', L('Un granjero tiene un saco de pienso y todos los animales comen lo mismo cada día.', 'A farmer has a bag of feed and all the animals eat the same each day. (feed = pienso)'),
    L('los animales', 'the animals'), L('los días que dura el pienso', 'the days the feed lasts'), L('animales', 'animals'), L('días', 'days'), [10, 30, 20, 15]),
  S('i-paginas', 'inversa', L('Hay que leer un libro con las mismas páginas.', 'You have to read a book, always with the same number of pages.'),
    L('las páginas que lees cada día', 'the pages you read each day'), L('los días que tardas en acabarlo', 'the days you take to finish it'), L('páginas', 'pages'), L('días', 'days'), [10, 30, 20, 15]),
  S('i-velocidad', 'inversa', L('Un viaje es siempre de la misma distancia.', 'A journey is always the same distance.'),
    L('la velocidad a la que vas', 'the speed you go at'), L('las horas que tardas', 'the hours you take'), L('km/h', 'km/h'), L('h', 'h'), [40, 6, 80, 3]),
  S('i-maquinas', 'inversa', L('Las máquinas son iguales y hay que embotellar el mismo pedido.', 'The machines are all the same and the same order has to be bottled.'),
    L('las máquinas', 'the machines'), L('las horas que tardan', 'the hours they take'), L('máquinas', 'machines'), L('h', 'h'), [4, 12, 8, 6]),
  S('i-cajas', 'inversa', L('Hay que guardar los mismos 60 libros en cajas, todas con los mismos libros.', 'You have to put the same 60 books in boxes, all with the same number of books.'),
    L('los libros que caben en cada caja', 'the books in each box'), L('las cajas que hacen falta', 'the boxes you need'), L('libros', 'books'), L('cajas', 'boxes'), [5, 12, 10, 6]),
  S('i-trozos', 'inversa', L('Se reparte una tarta entera en trozos iguales.', 'A whole cake is cut into equal pieces.'),
    L('los trozos', 'the pieces'), L('lo que pesa cada trozo', 'the weight of each piece'), L('trozos', 'pieces'), L('g', 'g'), [4, 200, 8, 100]),
  // ── Ninguna de las dos ──
  S('n-edad-altura', 'ninguna', L('Una niña crece con los años.', 'A girl grows as the years go by.'),
    L('la edad de la niña', 'the girl’s age'), L('su altura', 'her height'), L('años', 'years'), L('cm', 'cm'), [5, 110, 10, 140]),
  S('n-paginas', 'ninguna', L('Un libro tiene 200 páginas.', 'A book has 200 pages.'),
    L('las páginas que has leído', 'the pages you have read'), L('las páginas que te quedan', 'the pages you have left'), L('páginas', 'pages'), L('páginas', 'pages'), [50, 150, 100, 100]),
  S('n-taxi', 'ninguna', L('Un taxi cobra 3 € por empezar y 1 € por cada kilómetro.', 'A taxi charges €3 to start and €1 for every kilometre.'),
    L('los kilómetros del viaje', 'the kilometres of the journey'), L('lo que se paga', 'what you pay'), L('km', 'km'), L('€', '€'), [2, 5, 4, 7]),
  S('n-gastado', 'ninguna', L('Tienes 50 € y los gastas en una tienda.', 'You have €50 and you spend it in a shop.'),
    L('el dinero que gastas', 'the money you spend'), L('el dinero que te queda', 'the money you have left'), L('€', '€'), L('€', '€'), [10, 40, 20, 30]),
  S('n-madre', 'ninguna', L('Una madre tiene 30 años más que su hija.', 'A mother is 30 years older than her daughter.'),
    L('la edad de la hija', 'the daughter’s age'), L('la edad de la madre', 'the mother’s age'), L('años', 'years'), L('años', 'years'), [5, 35, 10, 40]),
  S('n-peso', 'ninguna', L('Un chico crece y engorda con los años.', 'A boy grows and gets heavier as the years go by.'),
    L('la edad del chico', 'the boy’s age'), L('su peso', 'his weight'), L('años', 'years'), L('kg', 'kg'), [6, 22, 12, 40]),
  S('n-tarifa', 'ninguna', L('Una compañía cobra 20 € al mes por hablar todo lo que quieras.', 'A phone company charges €20 a month for as many calls as you want.'),
    L('los minutos que hablas', 'the minutes you talk'), L('lo que pagas', 'what you pay'), L('min', 'min'), L('€', '€'), [100, 20, 200, 20]),
  S('n-temperatura', 'ninguna', L('Un día de verano, a medida que avanza la mañana, sube la temperatura.', 'On a summer day, the temperature goes up as the morning goes on.'),
    L('la hora del día', 'the time of day'), L('la temperatura', 'the temperature'), L('h', 'h'), L('°C', '°C'), [6, 15, 12, 28]),
  S('n-banera', 'ninguna', L('Una bañera tiene 50 L de agua y se llena con un grifo que echa 10 L cada minuto.', 'A bath has 50 L of water and a tap that gives 10 L every minute fills it.'),
    L('los minutos que está abierto el grifo', 'the minutes the tap is open'), L('los litros que hay en la bañera', 'the litres in the bath'), L('min', 'min'), L('L', 'L'), [5, 100, 10, 150]),
  S('n-gimnasio', 'ninguna', L('Un gimnasio cobra 10 € de matrícula y 5 € por cada mes.', 'A gym charges €10 to join and €5 for every month.'),
    L('los meses que vas', 'the months you go'), L('lo que pagas en total', 'what you pay in total'), L('meses', 'months'), L('€', '€'), [2, 20, 4, 30]),
  S('n-vela', 'ninguna', L('Una vela mide 30 cm y se gasta 2 cm cada hora.', 'A candle is 30 cm long and burns 2 cm every hour.'),
    L('las horas que lleva encendida', 'the hours it has been lit'), L('lo que mide la vela', 'the length of the candle'), L('h', 'h'), L('cm', 'cm'), [3, 24, 6, 18]),
]);

export const situacionDe = id => BANCO.find(s => s.id === id);

/** La clase de un par por igualdades con enteros: x1 · y2 = x2 · y1 (directa), x1 · y1 = x2 · y2 (inversa). */
export function claseDePar([x1, y1, x2, y2]) {
  const dir = x1 * y2 === x2 * y1, inv = x1 * y1 === x2 * y2;
  if (dir && inv) return 'ambas';
  return dir ? 'directa' : inv ? 'inversa' : 'ninguna';
}

export function generarSituacion(rng) {
  const clase = rng.elegir(CLASES);
  const s = rng.elegir(BANCO.filter(b => b.clase === clase));
  return { n: 1, id: s.id, clase };
}

// ─── Ejercicio 2: la tabla ─────────────────────────────────────────────────────

const PRODUCTOS = [24, 36, 48, 60, 72, 90, 96, 120];
const divisores = n => Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);

/** La clase de una tabla [[x…],[y…]] con enteros: directa si y : x es constante, inversa si x · y lo es, si no ninguna. */
export function claseDeTabla([xs, ys]) {
  const dir = xs.every((x, i) => ys[i] * xs[0] === x * ys[0]);
  const inv = xs.every((x, i) => x * ys[i] === xs[0] * ys[0]);
  if (dir && inv) return 'ambas';
  return dir ? 'directa' : inv ? 'inversa' : 'ninguna';
}
/** ¿Hay una columna cuyo x es el doble o el triple del de otra? */
export const tieneDobleOTriple = xs => xs.some((x, i) => xs.some((z, j) => i !== j && (z === 2 * x || z === 3 * x)));

function columnasX(rng, m, ncols, candidatos) {
  const bases = candidatos.filter(d => candidatos.includes(m * d));
  if (!bases.length) return null;
  const d = rng.elegir(bases);
  const xs = [d, m * d];
  const resto = rng.barajar(candidatos.filter(v => !xs.includes(v)));
  while (xs.length < ncols && resto.length) xs.push(resto.pop());
  return xs.length === ncols ? xs.sort((p, q) => p - q) : null;
}

export function generarTabla(rng) {
  const clase = rng.elegir(CLASES);
  const subtipo = clase === 'ninguna' ? rng.elegir(['suma', 'resta', 'casilla']) : null;
  for (let i = 0; i < 500; i++) {
    const m = rng.elegir([2, 3]);
    const ncols = rng.elegir([3, 4]);
    let xs, ys;
    if (clase === 'directa' || subtipo === 'casilla' && rng.azar() < 0.5) {
      const k = rng.entero(2, 9);
      xs = columnasX(rng, m, ncols, Array.from({ length: Math.floor(120 / k) }, (_, j) => j + 1).filter(v => v <= 40));
      if (!xs) continue;
      ys = xs.map(x => k * x);
    } else if (clase === 'inversa' || subtipo === 'casilla') {
      const P = rng.elegir(PRODUCTOS);
      xs = columnasX(rng, m, ncols, divisores(P));
      if (!xs) continue;
      ys = xs.map(x => P / x);
    } else if (subtipo === 'suma') {
      const s = rng.entero(2, 20);
      xs = columnasX(rng, m, ncols, Array.from({ length: 40 }, (_, j) => j + 1));
      if (!xs) continue;
      ys = xs.map(x => x + s);
    } else {
      xs = columnasX(rng, m, ncols, Array.from({ length: 40 }, (_, j) => j + 1));
      if (!xs) continue;
      const s = xs[xs.length - 1] + rng.entero(2, 20);
      ys = xs.map(x => s - x);
    }
    if (subtipo === 'casilla') {
      const j = rng.entero(0, ncols - 1);
      const cambio = rng.elegir([-3, -2, -1, 1, 2, 3]);
      ys[j] += cambio;
    }
    if (ys.some(y => y < 1 || y > 120) || xs.some(x => x > 120)) continue;
    if (claseDeTabla([xs, ys]) !== clase) continue;
    if (!tieneDobleOTriple(xs)) continue;
    return { n: 2, clase, subtipo, xs, ys };
  }
  throw new Error('generarTabla: sin tabla');
}

// ─── Ejercicio 3: ¿qué planteamiento? ──────────────────────────────────────────

export const IDS_DIRECTA = Object.freeze(['fruteria-naranjas', 'fruteria-fresas', 'receta-harina', 'receta-leche', 'consumo-coche', 'gasolinera']);
export const IDS_INVERSA = Object.freeze(['pintores', 'grifos', 'maquinas', 'pienso']);
export const ctxDe = id => CONTEXTOS.find(c => c.id === id);

const guarda = c => `${c.valor.num}/${c.valor.den}`;
export const val = s => { const [n, d] = s.split('/').map(Number); return fraccion(n, d); };

/** El valor de x de cada cuenta del ítem: a ⟶ b, c ⟶ x. */
export function valorDe(item, tipo) {
  const a = val(item.a), b = val(item.b), c = val(item.c);
  switch (tipo) {
    case 'buena': return item.sentido === 'directa' ? b.multiplicar(c).dividir(a).simplificar() : a.multiplicar(b).dividir(c).simplificar();
    case 'inversa-en-directa': return a.multiplicar(b).dividir(c).simplificar(); // la inversa aplicada a una directa
    case 'directa-en-inversa': return b.multiplicar(c).dividir(a).simplificar(); // la directa aplicada a una inversa
    case 'productos-en-linea': return a.multiplicar(c).dividir(b).simplificar();
    case 'razonar-sumando': {
      const dif = item.sentido === 'directa' ? c.restar(a) : a.restar(c);
      return b.sumar(dif).simplificar();
    }
    default: throw new Error(`Planteamiento desconocido: ${tipo}`);
  }
}

export function generarPlanteamiento(rng) {
  for (let i = 0; i < 500; i++) {
    const sentido = rng.azar() < 0.5 ? 'directa' : 'inversa';
    const ctx = ctxDe(rng.elegir(sentido === 'directa' ? IDS_DIRECTA : IDS_INVERSA));
    const d = generarDatos(ctx, rng);
    const item = { n: 3, sentido, ctx: ctx.id, a: guarda(d.a), b: guarda(d.b), c: guarda(d.c) };
    const malos = sentido === 'directa'
      ? ['inversa-en-directa', 'productos-en-linea', 'razonar-sumando']
      : ['directa-en-inversa', 'productos-en-linea', 'razonar-sumando'];
    const tipos = ['buena', ...malos];
    const valores = tipos.map(t => valorDe(item, t));
    if (valores.some(v => v.num <= 0)) continue;
    if (valores.some((v, p) => valores.some((w, q) => p < q && v.equals(w)))) continue;
    return { ...item, opciones: rng.barajar(tipos) };
  }
  throw new Error('generarPlanteamiento: sin ítem con cuatro valores distintos');
}

export const unidadDe = (item, clave, idioma, uno = false) => {
  const spec = ctxDe(item.ctx).datos[clave];
  if (spec.etiqueta) return spec.etiqueta[idioma][uno ? 0 : 1];
  return spec.unidad;
};

export const Q = (item, clave) => cantidad(val(item[clave]), ctxDe(item.ctx).datos[clave].unidad ?? null);
