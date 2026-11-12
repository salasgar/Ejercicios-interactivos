// Ortografía: las letras (tarea 136, 2026-11-06): los bancos de ítems, cada uno con
// `nivel: 1 | 2 | 3`, los generadores (con `elegirDeNivel` de ../_comun/nivel.js), las
// explicaciones ligadas al ítem y los `idError`. Todo puro (sin DOM): lo prueba
// tests/practicas-ortografia-letras.test.js.
//
// Cuatro ejercicios, de más fácil a más difícil:
//   1. hay, ahí, ay; a ver, haber (y el repaso de la h)   HACHES
//   2. b o v                                              BV
//   3. g o j, y la diéresis                               GJ
//   4. Otras letras (ll/y, m/n, r/rr, c/z/qu, d/z, cc, x/s) OTRAS
//
// Los ejercicios 2-4 son «¿qué letra falta?»: la palabra con un hueco (`_`) y dos o tres
// botones. Cada ítem lleva la REGLA que lo decide (tabla REGLAS) y la explicación la dice
// con esa palabra. Cuando la letra equivocada también da una palabra que existe
// (tubo/tuvo, pero/perro), la palabra va dentro de una frase (`{}`) que fuerza una sola
// lectura, y las dos palabras están en EXISTEN con su significado.
//
// Cuidado al añadir ítems (lo comprueba el test, pero el significado hay que leerlo):
//   - La letra mala tiene que dar una palabra que NO existe. Si existe, va en frase y en EXISTEN.
//   - Nada de dobles grafías (cinc/zinc, biznieto/bisnieto…) ni de seseo (casa/caza).
//   - Nombres de persona inventados; «Madrid» e «Israel» son topónimos.

import { elegirDeNivel, nivelForzado } from '../_comun/nivel.js';
import { slug } from '../_comun/ortografia.js';

export { slug };

// --- Palabras que existen con las dos letras --------------------------------------------

/** Significado de cada palabra que también forma la letra mala: obliga a poner la palabra en una frase. */
export const EXISTEN = {
  tubo: 'es el cilindro hueco por donde pasa un líquido', tuvo: 'es del verbo «tener»',
  baca: 'es el portaequipajes del techo del coche', vaca: 'es el animal que da leche',
  bello: 'quiere decir «bonito»', vello: 'es el pelo fino del cuerpo',
  bienes: 'son las cosas que alguien posee', vienes: 'es del verbo «venir»',
  cabo: 'es un extremo o un final («al cabo de una hora»)', cavo: 'es del verbo «cavar»',
  grabar: 'es registrar sonido o imágenes, o marcar algo en una superficie', gravar: 'es cobrar un impuesto por algo',
  rebelar: 'es sublevarse contra alguien («rebelarse»)', revelar: 'es descubrir o contar un secreto',
  sabia: 'es la mujer que sabe mucho', savia: 'es el líquido que circula por las plantas',
  basto: 'quiere decir «áspero, poco fino»', vasto: 'quiere decir «muy extenso»',
  bota: 'es un calzado', vota: 'es del verbo «votar»',
  botar: 'es dar botes, rebotar', votar: 'es dar un voto',
  perro: 'es el animal que ladra', pero: 'es la conjunción que contrasta («quiero, pero no puedo»)',
  carro: 'es un vehículo de ruedas', caro: 'quiere decir «que cuesta mucho»',
};

// --- Reglas -----------------------------------------------------------------------------

// `patron`: sobre la palabra completa bien escrita. `texto`: la regla en una frase; `{p}` es la palabra
// (en negrita) y `{n}` la nota del ítem (una palabra de su familia, el plural…). `excepciones`: las
// palabras que no cumplen el patrón y que la regla declara a propósito.
export const REGLAS = {
  // b / v
  aba: { letra: 'b', patron: /(aba|abas|aban|ábamos)$/, texto: 'Los verbos en pasado acabados en <b>-aba, -abas, -aban, -ábamos</b> (el imperfecto de los verbos en -ar) se escriben con <b>b</b>: {p}.' },
  bu: { letra: 'b', patron: /^bu/, texto: 'Las palabras que empiezan por <b>bu-</b>, <b>bur-</b> o <b>bus-</b> se escriben con <b>b</b>: {p}.' },
  mb: { letra: 'b', patron: /mb/, texto: 'Después de la <b>m</b> solo puede ir <b>b</b> (nunca «mv»): {p}.' },
  'bl-br': { letra: 'b', patron: /b[lr]/, texto: 'Las sílabas <b>bl</b> y <b>br</b> se escriben con <b>b</b> (en español no existen «vl» ni «vr»): {p}.' },
  nv: { letra: 'v', patron: /nv/, texto: 'Después de la <b>n</b> se escribe <b>v</b> (nunca «nb»): {p}.' },
  ir: { letra: 'v', patron: /^(voy|vas|vamos|vais|van)$/, texto: 'El presente del verbo <b>ir</b> (voy, vas, va, vamos, vais, van) se escribe con <b>v</b>: {p}.' },
  ver: { letra: 'v', patron: /^(veo|ves|vemos|veis)$/, texto: 'El presente del verbo <b>ver</b> (veo, ves, ve, vemos, veis, ven) se escribe con <b>v</b>: {p}.' },
  llav: { letra: 'v', patron: /ll(av|ev)/, texto: '<b>Llave</b>, <b>llevar</b> y las palabras de su familia llevan <b>v</b>: {p}.' },
  adj: { letra: 'v', patron: /(ava|ave|avo|eva|eve|evo|iva|ivo)$/, texto: 'Los adjetivos acabados en <b>-ava, -ave, -avo, -eva, -eve, -evo, -iva, -ivo</b> se escriben con <b>v</b>: {p}.' },
  bir: { letra: 'b', patron: /bir$/, texto: 'Los verbos acabados en <b>-bir</b> se escriben con <b>b</b>: {p}. (Excepciones: hervir, servir y vivir.)' },
  bilidad: { letra: 'b', patron: /bilidad$/, texto: 'Las palabras acabadas en <b>-bilidad</b> se escriben con <b>b</b>: {p}. (Excepciones: movilidad y civilidad.)' },
  bundo: { letra: 'b', patron: /bundo$/, texto: 'Las palabras acabadas en <b>-bundo</b> se escriben con <b>b</b>: {p}.' },
  iba: { letra: 'b', patron: /^(iba|ibas|íbamos|iban)$/, texto: 'El imperfecto del verbo <b>ir</b> (iba, ibas, iba, íbamos, ibais, iban) se escribe siempre con <b>b</b>: {p}.' },
  tuve: { letra: 'v', patron: /(tuv|estuv|anduv)/, texto: 'Los pretéritos de <b>tener, estar y andar</b> (tuve, estuve, anduve…) se escriben con <b>v</b>: {p}.' },
  vice: { letra: 'v', patron: /^(vice|villa)/, texto: 'Las palabras que empiezan por <b>vice-</b> («en lugar de») o <b>villa-</b> se escriben con <b>v</b>: {p}.' },
  adv: { letra: 'v', patron: /^adv/, texto: 'Las palabras que empiezan por <b>adv-</b> se escriben con <b>v</b>: {p}.' },
  ev: { letra: 'v', patron: /^ev[aeio]/, texto: 'Las palabras que empiezan por <b>eva-, eve-, evi-, evo-</b> se escriben con <b>v</b>: {p}. (Excepciones: ebanista y ebanistería.)' },
  bien: { letra: 'b', patron: /^(bien|ben)/, texto: 'Las palabras con <b>bien-</b> o <b>bene-</b> (del latín «bien») se escriben con <b>b</b>: {p}.' },
  bi: { letra: 'b', patron: /^bi/, texto: 'El prefijo <b>bi-</b> o <b>bis-</b> («dos») se escribe con <b>b</b>: {p}.' },
  sub: { letra: 'b', patron: /^sub/, texto: 'El prefijo <b>sub-</b> («debajo») se escribe con <b>b</b>: {p}.' },
  buir: { letra: 'b', patron: /buir$/, texto: 'Los verbos acabados en <b>-buir</b> se escriben con <b>b</b>: {p}.' },
  'exc-bv': { letra: 'bv', patron: /^$/, excepciones: ['árabe', 'sílaba', 'hervir', 'servir', 'vivir', 'movilidad', 'civilidad', 'obvio'], texto: '{n}' },
  'homofono-bv': { letra: 'bv', patron: /^$/, excepciones: Object.keys(EXISTEN).filter(p => /[bv]/.test(p) && !/^(perro|pero|carro|caro)$/.test(p)), texto: 'La frase decide cuál de las dos palabras va: {p}.' },
  // g / j (y la diéresis)
  aje: { letra: 'j', patron: /(aje|eje)$/, texto: 'Las palabras acabadas en <b>-aje</b> y <b>-eje</b> se escriben con <b>j</b>: {p}.' },
  jero: { letra: 'j', patron: /j(ero|era|ería)$/, texto: 'Las palabras acabadas en <b>-jero, -jera, -jería</b> se escriben con <b>j</b>: {p}.' },
  gen: { letra: 'g', patron: /gen$/, texto: 'Las palabras acabadas en <b>-gen</b> se escriben con <b>g</b>: {p}.' },
  'gue-gui': { letra: 'g', patron: /gu[ei]/, texto: 'El sonido de «guerra» y «guitarra» se escribe <b>gue, gui</b>; la u no suena. Con j sería otro sonido: {p}.' },
  ej: { letra: 'j', patron: /^ej/, texto: 'Las palabras que empiezan por <b>ej-</b> se escriben con <b>j</b>: {p}.' },
  geo: { letra: 'g', patron: /^geo/, texto: 'Las palabras con <b>geo-</b> («tierra») se escriben con <b>g</b>: {p}.' },
  'ger-gir': { letra: 'g', patron: /(ger|gir)$/, texto: 'Los verbos acabados en <b>-ger</b> y <b>-gir</b> se escriben con <b>g</b>: {p}. (Excepciones: tejer y crujir.)' },
  gia: { letra: 'g', patron: /(gia|gio|gión)$/, texto: 'Las palabras acabadas en <b>-gia, -gio, -gión</b> se escriben con <b>g</b>: {p}.' },
  logia: { letra: 'g', patron: /logía$/, texto: 'Las palabras acabadas en <b>-logía</b> se escriben con <b>g</b>: {p}.' },
  gesimo: { letra: 'g', patron: /gésimo$/, texto: 'Los ordinales acabados en <b>-gésimo</b> se escriben con <b>g</b>: {p}.' },
  geno: { letra: 'g', patron: /gen[oa]$/, texto: 'Las palabras acabadas en <b>-geno, -gena</b> se escriben con <b>g</b>: {p}.' },
  'pret-j': { letra: 'j', patron: /(dij|traj|conduj|produj|traduj)/, texto: 'Los pretéritos de <b>decir</b> y <b>traer</b>, y los de los verbos acabados en <b>-ducir</b>, llevan <b>j</b>: {p}.' },
  jear: { letra: 'j', patron: /jear$/, texto: 'Los verbos acabados en <b>-jear</b> se escriben con <b>j</b>: {p}.' },
  jar: { letra: 'j', patron: /jar$/, texto: 'Los verbos acabados en <b>-jar</b> se escriben con <b>j</b>: {p}.' },
  dieresis: { letra: 'gü', patron: /gü[eií]/, texto: 'Cuando la u suena entre la g y la e o la i, lleva diéresis, <b>güe, güi</b>: {p}.' },
  'gua-guo': { letra: 'gu', patron: /gu[ao]/, texto: 'Delante de a y de o la u suena sola y no lleva diéresis: {p}.' },
  'gue-gui-sin': { letra: 'gu', patron: /gu[ei]/, texto: 'En <b>gue, gui</b> la u no suena: no lleva diéresis. La diéresis solo se pone cuando la u se pronuncia (pingüino): {p}.' },
  'memoria-j': { letra: 'j', patron: /j[ei]/, texto: 'Esta palabra se escribe con <b>j</b> delante de e o i, y hay que aprenderla: {p}.' },
  'memoria-g': { letra: 'g', patron: /g[ei]/, texto: 'Esta palabra se escribe con <b>g</b> delante de e o i: {p}.' },
  'exc-gj': { letra: 'gj', patron: /^$/, excepciones: ['tejer', 'crujir', 'ligero', 'ingeniero'], texto: '{n}' },
  // ll / y, m / n, r / rr, c / z / qu, d / z, cc, x / s
  ll: { letra: 'll', patron: /ll/, texto: 'Se escribe con <b>ll</b>: {p}. Ayuda pensar en una palabra de su familia: «{n}».' },
  y: { letra: 'y', patron: /y/, texto: 'Se escribe con <b>y</b>: {p}. Ayuda pensar en una palabra de su familia: «{n}».' },
  'y-corta': { letra: 'y', patron: /^y[oa]$/, texto: 'Las palabras cortas «yo» y «ya» se escriben con <b>y</b>: no existen «llo» ni «lla». Es uno de los fallos más frecuentes en los correos.' },
  'y-final': { letra: 'y', patron: /y(es)?$/, texto: 'Detrás de otra vocal, el sonido «i» del final de palabra se escribe <b>y</b> ({n}): {p}.' },
  'm-pb': { letra: 'm', patron: /m[pb]/, texto: 'Antes de <b>p</b> y de <b>b</b> se escribe siempre <b>m</b> (nunca «np» ni «nb»): {p}.' },
  'n-otras': { letra: 'n', patron: /n[ctsdv]/, texto: 'Delante de las demás consonantes (c, t, s, d, v…) se escribe <b>n</b>: {p}.' },
  rr: { letra: 'rr', patron: /[aeiouáéíóú]rr[aeiouáéíóú]/, texto: 'Entre dos vocales, el sonido fuerte de la r se escribe <b>rr</b>: {p}.' },
  'r-suave': { letra: 'r', patron: /[aeiou]r[aeiou]/, texto: 'Entre dos vocales, una sola <b>r</b> suena suave: {p}. Con <b>rr</b> sonaría fuerte, y sería otra palabra.' },
  'r-inicial': { letra: 'r', patron: /^r[aeiou]/, texto: 'Al principio de la palabra el sonido fuerte se escribe con una sola <b>r</b>: {p}.' },
  'r-tras': { letra: 'r', patron: /[nls]r/, texto: 'Detrás de <b>n, l o s</b> el sonido fuerte se escribe con una sola <b>r</b>: {p}.' },
  'ce-ci': { letra: 'c', patron: /c[ei]/, texto: 'Delante de e y de i, el sonido «z» se escribe <b>c</b> (cereza, cielo): {p}.' },
  'za-zo-zu': { letra: 'z', patron: /z[aouáóú]/, texto: 'Delante de a, o y u, el sonido «z» se escribe <b>z</b> (zapato, zumo): {p}.' },
  'que-qui': { letra: 'qu', patron: /qu[eiéí]/, texto: 'El sonido «k» delante de e y de i se escribe <b>qu</b> (la u no suena): {p}.' },
  ces: { letra: 'c', patron: /ces$/, texto: 'Las palabras que acaban en z cambian la z por <b>c</b> en el plural, porque delante de e se escribe c: {p}.' },
  'd-final': { letra: 'd', patron: /d$/, texto: 'Para saber si una palabra acaba en d o en z, di su plural: «{n}» lleva <b>d</b>, así que se escribe {p}.' },
  'd-final-propio': { letra: 'd', patron: /d$/, texto: 'Los nombres como {p} acaban en <b>d</b>, igual que ciudad o pared: nunca «Madriz».' },
  'z-final': { letra: 'z', patron: /z$/, texto: 'Para saber si una palabra acaba en d o en z, di su plural: «{n}» lleva c (la z cambia a c), así que se escribe {p}, con <b>z</b>.' },
  cc: { letra: 'cc', patron: /cc/, texto: 'Se escribe <b>cc</b> porque en su familia hay «ct» ({n}): {p}.' },
  'c-ion': { letra: 'c', patron: /[^c]ción$/, texto: 'Se escribe una sola <b>c</b> porque en su familia no hay «ct» ({n}): {p}.' },
  ex: { letra: 'x', patron: /^[eé]x/, texto: 'Se escribe con <b>x</b>: {p}. Casi todas las palabras que empiezan por <b>ex-</b> (extra-, exce-, exa-, exi-, expl-, expr-) llevan x.' },
  es: { letra: 's', patron: /^es/, texto: 'Se escribe con <b>s</b>, sin x: {p}.' },
  'exc-es': { letra: 's', patron: /^es/, texto: '{n}' },
  'pares-r': { letra: 'rr', patron: /^$/, excepciones: ['perro', 'pero', 'carro', 'caro'], texto: '{n}' },
};

// --- Ejercicio 1: hay, ahí, ay; a ver, haber --------------------------------------------

const OPC = {
  H1: ['hay', 'ahí', 'ay'],
  H2: ['a ver', 'haber'],
  AHA: ['a', 'ha'],
  EHE: ['e', 'he'],
  EH: ['echo', 'hecho'],
  HA: ['habría', 'abría'],
};

// nivel|frase con _|buena|clave de las opciones
const FRASES_H = [
  // Nivel 1: hay / ahí / ay
  '1|En mi clase _ veintiocho alumnos.|hay|H1',
  '1|¿Sabes si _ algún bolígrafo en tu estuche?|hay|H1',
  '1|Mañana _ que madrugar para la excursión.|hay|H1',
  '1|No _ pan para el desayuno.|hay|H1',
  '1|En el patio _ dos porterías de fútbol.|hay|H1',
  '1|Creo que _ un error en la cuenta.|hay|H1',
  '1|Deja la mochila _, junto a la puerta.|ahí|H1',
  '1|Mi casa está _, al lado del parque.|ahí|H1',
  '1|Yo no voy _ nunca; me da miedo.|ahí|H1',
  '1|Ponte _ y no te muevas.|ahí|H1',
  '1|Mira _ arriba: ¿ves el pájaro?|ahí|H1',
  '1|Siéntate _, en la silla de la ventana.|ahí|H1',
  '1|Me pillé el dedo con la puerta y solté un ¡_! enorme.|ay|H1',
  '1|Al caérsele el vaso, mi madre dijo ¡_! y fue a por la escoba.|ay|H1',
  '1|Pisé una chincheta y se me escapó un ¡_! de dolor.|ay|H1',
  '1|Cuando me torcí el tobillo, grité ¡_! varias veces.|ay|H1',
  '1|Mi abuela se levanta del sillón con un ¡_! cada mañana.|ay|H1',
  '1|El gato se asustó y mi hermana soltó un ¡_! de sorpresa.|ay|H1',
  // Nivel 2: a ver / haber
  '2|Voy _ si ya ha llegado el autobús.|a ver|H2',
  '2|Mira _ si encuentras mi estuche.|a ver|H2',
  '2|Abre la caja _ qué hay dentro.|a ver|H2',
  '2|Prueba otra vez, _ si ahora funciona.|a ver|H2',
  '2|Voy _ a mi abuela este fin de semana.|a ver|H2',
  '2|Hoy vamos _ una película en clase.|a ver|H2',
  '2|Llámame _ si has llegado bien a casa.|a ver|H2',
  '2|Asómate a la ventana _ si viene el tren.|a ver|H2',
  '2|Espera, _ si me acuerdo de la contraseña.|a ver|H2',
  '2|Pregunta en la tienda _ si queda pan.|a ver|H2',
  '2|En el cole tiene que _ más papeleras.|haber|H2',
  '2|Mañana va a _ examen de Lengua.|haber|H2',
  '2|Puede _ cola a la entrada del cine.|haber|H2',
  '2|Debe de _ un error en esta suma.|haber|H2',
  '2|Tiene que _ una solución más fácil.|haber|H2',
  '2|Después de _ estudiado tanto, aprobé.|haber|H2',
  '2|Podría _ venido antes, pero se durmió.|haber|H2',
  '2|Tenía que _ llegado ya, ¿dónde estará?|haber|H2',
  '2|Deberías _ avisado de que no venías.|haber|H2',
  // Nivel 3: a/ha, e/he, echo/hecho y habría/abría con frases más difíciles
  '3|Esa es la chica _ quien le presté el libro.|a|AHA',
  '3|El portero _ parado un penalti en el último minuto.|ha|AHA',
  '3|Fuimos _ pie hasta el pueblo vecino.|a|AHA',
  '3|Mi tío _ regresado de su viaje por Asia.|ha|AHA',
  '3|Se puso _ llorar sin motivo aparente.|a|AHA',
  '3|Me _ quedado sin batería en el móvil.|he|EHE',
  '3|Compré lápices _ ilustraciones para el trabajo.|e|EHE',
  '3|Nunca _ visto un atardecer tan bonito.|he|EHE',
  '3|Estuve con mi prima Ana _ Irene en el parque.|e|EHE',
  '3|Todavía no _ decidido qué voy a estudiar.|he|EHE',
  '3|Es un trabajo difícil _ imposible de terminar hoy.|e|EHE',
  '3|Yo siempre _ un vistazo antes de salir de casa.|echo|EH',
  '3|Ese es un _ comprobado por los científicos.|hecho|EH',
  '3|Si tienes frío, te _ mi chaqueta por encima.|echo|EH',
  '3|¿Quién ha _ esta travesura?|hecho|EH',
  '3|Cada noche _ las cortinas antes de dormir.|echo|EH',
  '3|Con ese gol, el partido está prácticamente _.|hecho|EH',
  '3|Si hubiera estudiado más, _ aprobado.|habría|HA',
  '3|La puerta se _ sola cada vez que pasábamos.|abría|HA',
  '3|Mi madre siempre _ la ventana al llegar.|abría|HA',
  '3|Sin tu ayuda, no _ conseguido terminar.|habría|HA',
  '3|Yo _ ido contigo si me lo hubieras pedido.|habría|HA',
  '3|Cada mañana el panadero _ la tienda a las siete.|abría|HA',
];

function leerHaches(linea) {
  const [nivel, texto, buena, clave] = linea.split('|');
  const opciones = OPC[clave];
  return { nivel: Number(nivel), texto, buena, opciones, clave };
}

export const HACHES = FRASES_H.map(leerHaches);

/** La frase del ítem 1 con `palabra` en el hueco. */
export const rellenarHaches = (item, palabra) => item.texto.replace('_', palabra);

const EXPLICA_H = {
  hay: f => `Va <b>hay</b>, del verbo <b>haber</b> (algo existe, se puede contar): «${f}». Se puede cambiar por «había». «Ahí» sería un lugar y «ay», un quejido.`,
  'ahí': f => `Va <b>ahí</b>, que es un lugar («allí», «en ese sitio»): «${f}». «Hay» es del verbo haber y «ay» es un quejido: ninguno señala un sitio.`,
  ay: f => `Va <b>ay</b>, un quejido o una exclamación (de dolor, de pena, de sorpresa): «${f}». No es el verbo haber («hay») ni un lugar («ahí»).`,
  'a ver': f => `Va <b>a ver</b>, en dos palabras: la preposición «a» y el verbo «ver» (mirar, comprobar): «${f}». No es el verbo haber.`,
  haber: f => `Va <b>haber</b>, junto y con h: es el verbo haber, que acaba en -r como todo infinitivo (hay, había, ha habido): «${f}». Con «a ver» (mirar) no tendría sentido.`,
  ha: f => `Va <b>ha</b>, del verbo <b>haber</b>: acompaña a un participio, y haber lleva h, ha también: «${f}». Se puede cambiar por «había». La preposición «a» no lleva h.`,
  a: f => `Va <b>a</b>, sin h: es la preposición, no el verbo haber: «${f}». Si lo cambias por «había», no tiene sentido.`,
  he: f => `Va <b>he</b>, del verbo <b>haber</b> (yo he…): «${f}». Haber lleva h, he también. Se puede cambiar por «había».`,
  e: f => `Va <b>e</b>, sin h: es la «y» de siempre, que se escribe «e» delante de una palabra que empieza por i o hi: «${f}». No es el verbo haber.`,
  echo: f => `Va <b>echo</b>, del verbo <b>echar</b> (yo echo): «${f}». Echar no lleva h, echo tampoco.`,
  hecho: f => `Va <b>hecho</b>, de la familia de <b>hacer</b> (he hecho, está hecho, un hecho): «${f}». Hacer lleva h, hecho también.`,
  'habría': f => `Va <b>habría</b>, del verbo <b>haber</b> (habría aprobado, habría ido): lleva h como él y suele ir con un participio: «${f}». «Abría» es del verbo abrir.`,
  'abría': f => `Va <b>abría</b>, del verbo <b>abrir</b> (la puerta se abría): «${f}». Abrir no lleva h. «Habría» es del verbo haber y va con un participio.`,
};

/** La explicación del ítem 1 (HTML): la regla aplicada a esa frase, con la palabra buena en `<b>`. */
export function explicacionHaches(item) {
  const rellena = rellenarHaches(item, `<b>${item.buena}</b>`).replace(/\.$/, '');
  return EXPLICA_H[item.buena](rellena);
}

/** La ayuda de «No lo sé» del ejercicio 1: la explicación del ítem y la respuesta, explícita al final. */
export const ayudaHaches = item => `${explicacionHaches(item)} La respuesta es <b>${item.buena}</b>.`;

/** `idError` del ejercicio 1: lo que puso el alumno en vez de lo bueno («ahi-por-hay»). */
export const idErrorHaches = (item, puesta) => `${slug(puesta)}-por-${slug(item.buena)}`;

// --- Ejercicios 2-4: ¿qué letra falta? ---------------------------------------------------

// nivel|regla|hueco (con _)|buena|[otras opciones, con comas]|[frase con {}]|[nota]
function leerLetras(complemento) {
  return linea => {
    const [nivel, regla, hueco, buena, malas, frase, nota] = linea.split('|');
    const otras = malas ? malas.split(',') : [complemento[buena]];
    const palabra = hueco.replace('_', buena);
    const mal = otras.map(o => hueco.replace('_', o));
    return { nivel: Number(nivel), regla, hueco, buena, opciones: [buena, ...otras], palabra, mal, frase: frase || null, nota: nota ? nota.trim() : null };
  };
}

const BV_COMPLEMENTO = { b: 'v', v: 'b' };
const GJ_COMPLEMENTO = { g: 'j', j: 'g' };

const LINEAS_BV = [
  // Nivel 1
  '1|aba|canta_a|b', '1|aba|juga_a|b', '1|aba|está_amos|b', '1|aba|mira_an|b',
  '1|bu|_uscar|b', '1|bu|_urbuja|b', '1|bu|_utaca|b',
  '1|mb|tam_ién|b', '1|mb|cam_iar|b', '1|mb|hom_re|b',
  '1|bl-br|_lanco|b', '1|bl-br|_razo|b', '1|bl-br|pue_lo|b',
  '1|nv|in_ierno|v', '1|nv|en_idia|v', '1|nv|con_ivir|v', '1|nv|en_iar|v',
  '1|ir|_as|v', '1|ir|_amos|v', '1|ir|_ais|v',
  '1|ver|_eo|v', '1|ver|_emos|v',
  '1|llav|lla_e|v', '1|llav|lle_ar|v', '1|llav|lle_o|v',
  // Nivel 2
  '2|adj|octa_a|v', '2|adj|sua_e|v', '2|adj|nue_o|v', '2|adj|bre_e|v', '2|adj|acti_a|v',
  '2|adj|deporti_o|v', '2|adj|escla_o|v', '2|adj|le_e|v', '2|adj|nue_a|v', '2|adj|positi_o|v',
  '2|bir|escri_ir|b', '2|bir|reci_ir|b', '2|bir|prohi_ir|b', '2|bir|su_ir|b', '2|bir|descri_ir|b',
  '2|bilidad|ama_ilidad|b', '2|bilidad|posi_ilidad|b', '2|bilidad|responsa_ilidad|b',
  '2|bundo|vaga_undo|b',
  '2|iba|i_a|b|v|Cuando era pequeña, {} al parque todos los días.',
  '2|iba|i_as|b|v|Antes {} andando al instituto, ¿verdad?',
  '2|iba|í_amos|b|v|Los sábados {} a la piscina en bici.',
  '2|tuve|tu_e|v|b|El domingo {} fiebre y no fui a clase.',
  '2|tuve|estu_e|v|b|Ayer {} en casa de mi abuela.',
  '2|tuve|andu_e|v|b|Ayer {} perdido un buen rato por el centro.',
  '2|vice|_icepresidenta|v', '2|vice|_icedirector|v', '2|vice|_illancico|v',
  '2|adv|ad_erbio|v', '2|adv|ad_ertir|v', '2|adv|ad_ersario|v',
  '2|ev|e_itar|v', '2|ev|e_aluar|v', '2|ev|e_ento|v',
  '2|bien|_ienestar|b', '2|bien|_enéfico|b', '2|bien|_endecir|b',
  '2|bi|_icicleta|b', '2|bi|_isabuela|b',
  '2|sub|su_marino|b', '2|sub|su_rayar|b', '2|sub|su_terráneo|b',
  '2|buir|distri_uir|b', '2|buir|contri_uir|b',
  '2|bl-br|ha_lar|b', '2|bl-br|a_rir|b',
  // Nivel 3: excepciones
  '3|exc-bv|ára_e|b||| «Árabe» acaba en -abe y lleva <b>b</b>: es una excepción a los adjetivos en -ave, -avo, que llevan v.',
  '3|exc-bv|síla_a|b||| «Sílaba» acaba en -aba y lleva <b>b</b>, como los verbos en -aba; en cambio «cantaba» es de un verbo.',
  '3|exc-bv|her_ir|v||| «Hervir» acaba en -vir y lleva <b>v</b>: es una excepción a los verbos en -bir (como servir y vivir).',
  '3|exc-bv|ser_ir|v||| «Servir» acaba en -vir y lleva <b>v</b>: es una excepción a los verbos en -bir (como hervir y vivir).',
  '3|exc-bv|mo_ilidad|v||| «Movilidad» viene de «móvil» y lleva <b>v</b>: es una excepción a las palabras en -bilidad.',
  '3|exc-bv|ci_ilidad|v||| «Civilidad» viene de «civil» y lleva <b>v</b>: es una excepción a las palabras en -bilidad.',
  '3|exc-bv|ob_io|v||| «Obvio» lleva <b>bv</b>: la b del prefijo ob- y la v de «via» («camino»); no es «obio».',
  // Nivel 3: homófonos, en frase
  '3|homofono-bv|tu_o|b||El agua sale por el {} de la fuente.',
  '3|homofono-bv|tu_o|v||Mi hermano {} fiebre toda la noche.',
  '3|homofono-bv|_aca|b||Pusimos las maletas en la {} del coche.',
  '3|homofono-bv|_aca|v||La {} da leche cada mañana.',
  '3|homofono-bv|_ello|b||¡Qué paisaje tan {}!',
  '3|homofono-bv|_ello|v||Tengo un poco de {} en los brazos.',
  '3|homofono-bv|_ienes|b||Los {} de la familia se repartieron entre todos.',
  '3|homofono-bv|_ienes|v||¿Cuándo {} a verme a mi casa?',
  '3|homofono-bv|ca_o|b||Se despidió al final, al {} de una hora.',
  '3|homofono-bv|ca_o|v||Yo {} un hoyo para plantar el árbol.',
  '3|homofono-bv|gra_ar|b||Quiero {} una canción en mi móvil.',
  '3|homofono-bv|gra_ar|v||El Gobierno quiere {} con más impuestos el tabaco.',
  '3|homofono-bv|re_elar|b||Los soldados se van a {} contra el jefe.',
  '3|homofono-bv|re_elar|v||No pienso {} el secreto a nadie.',
  '3|homofono-bv|sa_ia|b||Mi abuela es una mujer muy {}.',
  '3|homofono-bv|sa_ia|v||La {} sube por el tronco del árbol.',
  '3|homofono-bv|_asto|b||El jersey de lana era áspero y {}.',
  '3|homofono-bv|_asto|v||El desierto era enorme y {}.',
  '3|homofono-bv|_ota|b||Me he comprado una {} de goma para la lluvia.',
  '3|homofono-bv|_ota|v||Mi madre siempre {} en las elecciones.',
  '3|homofono-bv|_otar|b||La pelota empezó a {} en el suelo.',
  '3|homofono-bv|_otar|v||Hoy vamos a {} en clase para elegir al delegado.',
];

const LINEAS_GJ = [
  // Nivel 1
  '1|aje|gara_e|j', '1|aje|pasa_e|j', '1|aje|paisa_e|j', '1|aje|mensa_e|j',
  '1|ej|e_ercicio|j', '1|ej|e_emplo|j', '1|ej|e_ército|j', '1|ej|e_ecutar|j',
  '1|jero|relo_ero|j', '1|jero|extran_era|j',
  '1|gen|ori_en|g', '1|gen|mar_en|g', '1|gen|ima_en|g', '1|gen|vir_en|g',
  '1|gue-gui|_uerra|g', '1|gue-gui|_uitarra|g', '1|gue-gui|ho_uera|g', '1|gue-gui|á_uila|g',
  '1|geo|_eometría|g', '1|geo|_eografía|g',
  // Nivel 2
  '2|ger-gir|co_er|g', '2|ger-gir|reco_er|g', '2|ger-gir|ele_ir|g', '2|ger-gir|corre_ir|g',
  '2|ger-gir|prote_er|g', '2|ger-gir|fin_ir|g',
  '2|gia|ma_ia|g', '2|gia|cole_io|g', '2|gia|re_ión|g', '2|gia|reli_ión|g',
  '2|logia|biolo_ía|g', '2|logia|geolo_ía|g', '2|logia|tecnolo_ía|g',
  '2|gesimo|vi_ésimo|g', '2|gesimo|tri_ésimo|g',
  '2|geno|oxí_eno|g', '2|geno|hidró_eno|g', '2|geno|indí_ena|g',
  '2|pret-j|di_e|j', '2|pret-j|tra_e|j', '2|pret-j|condu_e|j', '2|pret-j|produ_e|j', '2|pret-j|tradu_o|j',
  '2|jear|ho_ear|j', '2|jear|co_ear|j', '2|jear|calle_ear|j',
  '2|jar|traba_ar|j', '2|jar|ba_ar|j', '2|jar|de_ar|j', '2|jar|mo_ar|j', '2|jar|via_ar|j',
  '2|aje|equipa_e|j', '2|aje|persona_e|j', '2|aje|masa_e|j',
  '2|jero|pasa_ero|j', '2|jero|mensa_ero|j', '2|jero|cerra_ería|j',
  // Nivel 3: la diéresis (gu / gü)
  '3|dieresis|pin_ino|gü|gu', '3|dieresis|ci_eña|gü|gu', '3|dieresis|para_ero|gü|gu',
  '3|dieresis|ver_enza|gü|gu', '3|dieresis|lin_ística|gü|gu', '3|dieresis|anti_edad|gü|gu',
  '3|dieresis|bilin_e|gü|gu', '3|dieresis|ambi_edad|gü|gu',
  '3|gua-guo|a_a|gu|gü', '3|gua-guo|anti_o|gu|gü', '3|gua-guo|len_a|gu|gü',
  '3|gue-gui-sin|_erra|gu|gü', '3|gue-gui-sin|_itarra|gu|gü', '3|gue-gui-sin|ho_era|gu|gü',
  '3|gue-gui-sin|á_ila|gu|gü', '3|gue-gui-sin|se_ir|gu|gü',
  // Nivel 3: excepciones y palabras «de memoria»
  '3|exc-gj|te_er|j||| «Tejer» lleva <b>j</b>: es una excepción a los verbos en -ger (coger, proteger), que llevan g.',
  '3|exc-gj|cru_ir|j||| «Crujir» lleva <b>j</b>: es una excepción a los verbos en -gir (elegir, dirigir), que llevan g.',
  '3|exc-gj|li_ero|g||| «Ligero» lleva <b>g</b>: las palabras en -jero llevan j (relojero, extranjero), pero esta es una excepción.',
  '3|exc-gj|in_eniero|g||| «Ingeniero» lleva <b>g</b> (viene de «ingenio»): las palabras en -jero llevan j, pero esta es una excepción.',
  '3|memoria-j|_efe|j', '3|memoria-j|_ersey|j', '3|memoria-j|_irafa|j', '3|memoria-j|_inete|j',
  '3|memoria-j|beren_ena|j', '3|memoria-j|_engibre|j', '3|memoria-j|a_eno|j', '3|memoria-j|mu_er|j',
  '3|memoria-j|ob_eto|j', '3|memoria-j|su_eto|j', '3|memoria-j|tar_eta|j',
  '3|memoria-g|_imnasio|g', '3|memoria-g|_igante|g', '3|memoria-g|a_enda|g', '3|memoria-g|_emelo|g',
];

const LINEAS_OTRAS = [
  // Nivel 1: ll / y, m / n, r / rr
  '1|y-corta|_o|y|ll|Mi hermana y {} fuimos al cine.', '1|y-corta|_a|y|ll|Mamá, {} he terminado los deberes.', '1|y|a_er|y|ll||anteayer', '1|y-final|ho_|y|ll||hoy, voy, soy', '1|y|pla_a|y|ll||playero',
  '1|y|re_es|y|ll||el rey', '1|y|a_uda|y|ll||ayudar',
  '1|ll|_ave|ll|y||llavero', '1|ll|_uvia|ll|y||llover', '1|ll|ca_e|ll|y||callejón', '1|ll|_egar|ll|y||llegada',
  '1|ll|si_a|ll|y||sillón', '1|ll|estre_a|ll|y||estrellado', '1|ll|amari_o|ll|y||amarillento', '1|ll|_orar|ll|y||llanto',
  '1|m-pb|ca_po|m|n', '1|m-pb|ta_bién|m|n', '1|m-pb|sie_pre|m|n', '1|m-pb|ho_bre|m|n', '1|m-pb|ca_bio|m|n', '1|m-pb|tie_po|m|n',
  '1|n-otras|i_vitar|n|m', '1|n-otras|e_volver|n|m', '1|n-otras|ba_co|n|m', '1|n-otras|ca_sado|n|m', '1|n-otras|co_tento|n|m', '1|n-otras|pa_talón|n|m',
  '1|rr|ca_etera|rr|r', '1|rr|tie_a|rr|r', '1|rr|sie_a|rr|r', '1|rr|co_er|rr|r', '1|rr|ba_er|rr|r', '1|rr|to_e|rr|r',
  '1|pares-r|pe_o|rr|r|Mi {} duerme todas las noches en el sofá.|«Perro» (el animal) lleva <b>rr</b>: entre vocales, la rr suena fuerte. Con una sola r sería «pero», que es otra palabra.',
  '1|pares-r|ca_o|rr|r|Empuja el {} de la compra, por favor.|«Carro» (el vehículo) lleva <b>rr</b>: suena fuerte entre vocales. Con una sola r sería «caro», que es otra palabra.',
  '1|pares-r|pe_o|r|rr|Quiero salir al patio, {} está lloviendo.|«Pero» (la conjunción) lleva una sola <b>r</b>: entre vocales suena suave. Con rr sería «perro», el animal.',
  '1|pares-r|ca_o|r|rr|Ese reloj es muy {} y no puedo comprarlo.|«Caro» (que cuesta mucho) lleva una sola <b>r</b>: entre vocales suena suave. Con rr sería «carro», el vehículo.',
  '1|r-tras|En_ique|r|rr', '1|r-tras|hon_a|r|rr', '1|r-tras|al_ededor|r|rr', '1|r-tras|Is_ael|r|rr', '1|r-tras|en_edar|r|rr', '1|r-inicial|_atón|r|rr',
  // Nivel 2: c / z / qu y los plurales en -ces
  '2|ce-ci|_ereza|c|z,qu', '2|ce-ci|_ielo|c|z,qu', '2|ce-ci|_iudad|c|z,qu', '2|ce-ci|_ebolla|c|z,qu',
  '2|za-zo-zu|_apato|z|c,qu', '2|za-zo-zu|_umo|z|c,qu', '2|za-zo-zu|_anahoria|z|c,qu', '2|za-zo-zu|a_ul|z|c,qu',
  '2|za-zo-zu|cabe_a|z|c,qu', '2|za-zo-zu|pi_arra|z|c,qu',
  '2|que-qui|_ince|qu|c,z', '2|que-qui|_iero|qu|c,z', '2|que-qui|a_í|qu|c,z', '2|que-qui|pe_eño|qu|c,z',
  '2|que-qui|má_ina|qu|c,z', '2|que-qui|ra_eta|qu|c,z',
  '2|ces|lápi_es|c|z|Tengo tres {} en el estuche.', '2|ces|ve_es|c|z|Voy a la biblioteca dos {} por semana.',
  '2|ces|lu_es|c|z|Apaga las {} del pasillo, por favor.', '2|ces|pe_es|c|z|En el acuario hay {} de muchos colores.',
  '2|ces|feli_es|c|z|Los niños estaban muy {} en el parque.', '2|ces|raí_es|c|z|Las {} de ese árbol son muy profundas.',
  // Nivel 3: d / z finales, cc / c y x / s
  '3|d-final|verda_|d|z||verdades', '3|d-final|pare_|d|z||paredes', '3|d-final|ciuda_|d|z||ciudades',
  '3|d-final|amista_|d|z||amistades', '3|d-final|actitu_|d|z||actitudes', '3|d-final-propio|Madri_|d|z',
  '3|z-final|lápi_|z|d||lápices', '3|z-final|feli_|z|d||felices', '3|z-final|arro_|z|d||arroces',
  '3|z-final|cru_|z|d||cruces', '3|z-final|lu_|z|d||luces',
  '3|cc|a_ión|cc|c||acto, actor', '3|cc|dire_ión|cc|c||director', '3|cc|le_ión|cc|c||lectura',
  '3|cc|cole_ión|cc|c||colectivo', '3|cc|constru_ión|cc|c||constructor', '3|cc|perfe_ión|cc|c||perfecto',
  '3|c-ion|afi_ión|c|cc||aficionado', '3|c-ion|aten_ión|c|cc||atento', '3|c-ion|can_ión|c|cc||cantar',
  '3|c-ion|rela_ión|c|cc||relato', '3|c-ion|condi_ión|c|cc||condicional', '3|c-ion|na_ión|c|cc||nacional',
  '3|ex|e_traño|x|s', '3|ex|e_plicar|x|s', '3|ex|e_cursión|x|s', '3|ex|é_ito|x|s', '3|ex|e_acto|x|s',
  '3|ex|e_amen|x|s', '3|ex|e_traordinario|x|s', '3|ex|e_quisito|x|s', '3|ex|e_celente|x|s',
  '3|es|e_trella|s|x', '3|es|e_tricto|s|x', '3|es|e_pontáneo|s|x', '3|es|e_céptico|s|x', '3|es|e_trés|s|x',
  '3|exc-es|e_pléndido|s|x||«Espléndido» y «esplendor» llevan <b>s</b>, aunque «explicar» y «explorar» lleven x.',
];

const sinHuecosRaros = (banco, nombre) => {
  for (const it of banco) if ((it.hueco.match(/_/g) ?? []).length !== 1) throw new Error(`${nombre}: «${it.hueco}» no tiene un solo hueco`);
  return banco;
};

export const BV = sinHuecosRaros(LINEAS_BV.map(leerLetras(BV_COMPLEMENTO)), 'BV');
export const GJ = sinHuecosRaros(LINEAS_GJ.map(leerLetras(GJ_COMPLEMENTO)), 'GJ');
export const OTRAS = sinHuecosRaros(LINEAS_OTRAS.map(leerLetras({})), 'OTRAS');

/** Dónde está cada banco, para los tests. */
export const BANCOS = { haches: HACHES, bv: BV, gj: GJ, otras: OTRAS };

/** La frase de un ítem de letras partida por el hueco: { antes, despues }. */
export function partesLetras(item) {
  const [w1, w2] = item.hueco.split('_');
  if (!item.frase) return { antes: w1, despues: w2 };
  const [pre, post] = item.frase.split('{}');
  return { antes: pre + w1, despues: w2 + post };
}

/** La palabra bien escrita con la letra `letra` (para comprobar si la mala existe). */
export const palabraCon = (item, letra) => item.hueco.replace('_', letra);

/** La explicación de un ítem de letras (HTML): la regla aplicada a esa palabra. Con `nota` o regla de nota, la nota. */
export function explicacionLetras(item) {
  const regla = REGLAS[item.regla];
  const palabra = `<b>${item.palabra}</b>`;
  const base = regla.texto.replaceAll('{p}', palabra).replaceAll('{n}', item.nota ?? '');
  const significado = EXISTEN[item.palabra.toLowerCase()];
  if (item.regla === 'homofono-bv') {
    const otra = item.mal[0];
    return `Aquí va <b>${item.palabra}</b>: ${significado}. Con la otra letra sería «${otra}», que ${EXISTEN[otra] ?? 'es otra palabra'}.`;
  }
  return base;
}

/** La ayuda de «No lo sé» de los ejercicios 2-4: la explicación del ítem y la respuesta, explícita al final. */
export const ayudaLetras = item => `${explicacionLetras(item)} La respuesta es <b>${item.buena}</b>: <b>${item.palabra}</b>.`;

/**
 * `idError` de los ejercicios 2-4: qué puso el alumno en vez de qué («v-por-b»). La diéresis tiene los
 * suyos (`sin-dieresis`, `dieresis-de-mas`) y las letras finales d/z llevan `-final`.
 */
export function idErrorLetras(item, puesta) {
  if (['dieresis', 'gua-guo', 'gue-gui-sin'].includes(item.regla)) return puesta === 'gu' ? 'sin-dieresis' : 'dieresis-de-mas';
  const sufijo = /-final/.test(item.regla) || item.regla === 'z-final' ? '-final' : '';
  return `${slug(puesta)}${sufijo}-por-${slug(item.buena)}`;
}

// --- Generadores ----------------------------------------------------------------------

/**
 * El generador de un banco: elige un ítem según los puntos y las vidas (`elegirDeNivel`) y baraja
 * sus botones. Ítem: { i, nivel, orden }: `i`, la posición en el banco; `nivel`, el del alumno (para
 * la etiqueta); `orden`, las opciones barajadas. `forzado` es la función del `?nivel=` (por defecto
 * la de la base; los tests pasan la suya).
 */
export function generadorDe(banco, forzado = nivelForzado) {
  return (rng, sesion) => {
    const { item, actual } = elegirDeNivel(rng, banco, sesion, { forzado: forzado() });
    return { i: banco.indexOf(item), nivel: actual, orden: rng.barajar(item.opciones) };
  };
}
