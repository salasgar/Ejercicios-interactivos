// LÓGICA PURA de «Problemas con ecuaciones» (unidad 6, semana 4, sesiones 13-14): elegir la incógnita, elegir la
// ecuación, resolver y contestar en contexto, saber qué pide el enunciado y comprobar que la solución tiene sentido
// (U6-2A-01, 2A-02, 2A-03, 3A-01, 3A-03, 4A-01, 4A-02, 4A-03, 4A-04, 4A-05, 4A-08, 4A-09 y 4C-01). Sin DOM.
//
// Todo exacto: las ecuaciones se resuelven con `Ecuacion.resolver()` de `_comun/algebra.js` (Fraccion); el dinero
// se maneja en céntimos enteros. Nada de coma flotante.
//
// Alcance (acta de la 144, propuesta del 6-11): una sola incógnita, ecuaciones de primer grado, sin x², sin
// porcentajes ni geometría con fórmula; el paréntesis solo aparece en el enunciado de la ecuación de
// «edades dentro de n años» (semana 3 ya dada: U6-3C-06). Los problemas llevan una cota de realismo por contexto.

import { deEcuacion, aEcuacion, huellaCanonica, ERRORES_TIPICOS } from '../_comun/algebra.js';

const MENOS = '−';
const cuenta = h => `<span class="cuenta">${h}</span>`;
export const bi = (es, en = es) => ({ es, en });

// ─── Errores con nombre ────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'incognita-dato': bi('Ha tomado como x un dato que el enunciado ya da', 'Took as x a number the statement already gives'),
  'olvidar-un-sumando': bi('Ha olvidado una de las cantidades al sumar', 'Forgot one of the quantities in the sum'),
  'veces-como-mas': bi('Ha traducido «veces» como «más»', 'Translated “times” as “more”'),
  'mas-que-al-equivocado': bi('Ha sumado lo que sobra a otra persona', 'Added the extra amount to the wrong person'),
  'consecutivos-como-multiplos': bi('Ha escrito los números seguidos como x, 2x y 3x', 'Wrote consecutive numbers as x, 2x and 3x'),
  'repetir-el-siguiente': bi('Ha repetido el mismo número en dos sumandos', 'Used the same number twice in the sum'),
  'menos-que-al-reves': bi('Ha restado donde había que sumar (o al revés)', 'Subtracted where it had to add (or the other way round)'),
  'olvidar-la-diferencia': bi('Ha olvidado la diferencia que da el enunciado', 'Forgot the difference the statement gives'),
  'olvidar-el-extra': bi('Ha olvidado lo que se paga aparte', 'Forgot the extra amount'),
  'restar-en-vez-de-sumar': bi('Ha restado lo que había que sumar', 'Subtracted what had to be added'),
  'multiplicar-el-extra': bi('Ha multiplicado lo que se paga aparte', 'Multiplied the extra amount'),
  'olvidar-el-multiplicador': bi('Ha olvidado el «por» del enunciado', 'Forgot the “times” of the statement'),
  'parentesis-olvidado': bi('Ha multiplicado solo una parte', 'Multiplied only one part'),
  'dos-lados': bi('Ha sumado solo dos lados', 'Added only two sides'),
  'olvidar-n': bi('Ha olvidado lo que mide de más', 'Forgot the extra length'),
  'sumar-n-una-vez': bi('Ha sumado lo que mide de más una sola vez', 'Added the extra length only once'),
  'contestar-x': bi('Ha contestado x, pero se pregunta otra cantidad', 'Answered x, but the question asks for another quantity'),
  'otra-cantidad': bi('Ha contestado otra cantidad del problema', 'Answered another quantity of the problem'),
  'otra-respuesta': bi('Otra respuesta', 'Another answer'),
  'sentido-ecuacion': bi('No se ha dado cuenta de que la ecuación está mal planteada', 'Did not notice the equation is set up wrongly'),
  'sentido-resolucion': bi('No se ha dado cuenta del error al resolver', 'Did not notice the mistake in solving'),
  'sentido-enunciado': bi('Ha culpado al enunciado, que está bien', 'Blamed the statement, which is fine'),
  'sentido-bien': bi('Ha dado por buena una solución que no puede ser', 'Accepted a solution that cannot be'),
  'sentido-mal': bi('Ha dado por mala una solución que está bien', 'Rejected a solution that is fine'),
};
const nombreTipico = id => ERRORES_PROPIOS[id] ?? ERRORES_TIPICOS[id]?.nombre ?? null;
export const nombreDe = nombreTipico;
export const ESTA_DEFINIDO = id => Boolean(nombreTipico(id));
const segunda = { es: t => t.replace(/^Ha /, 'Has '), en: t => `You ${t.charAt(0).toLowerCase()}${t.slice(1)}` };
export const explicaError = (id, idioma) => {
  const n = nombreTipico(id);
  return n ? segunda[idioma](n[idioma]) : '';
};

// ─── Casos reservados: ecuaciones de las hojas 1-4 y huellas de los exámenes 1-4, sus extra y los finales ───
// Fuente: reparto-practicas-u2/hechos/notas/s-20261118T131928-cf1250cf-errores6-reserva.txt (tarea 159, segunda pasada: la lista completa, la misma que errores6).

/** Formas canónicas (`Ecuacion.clave()`, en claro, los dos órdenes de los miembros) de las ecuaciones de las hojas 1-4. */
export const CASOS_HOJA = new Set([
  'x:1|b:6=b:15', 'b:15=x:1|b:6', 'x:4|b:5=x:9|b:0', 'x:9|b:0=x:4|b:5', 'x:2|b:0=x:2|b:0', 'x:7|b:0=x:8|b:0',
  'x:8|b:0=x:7|b:0', 'x:5|b:-2=b:18', 'b:18=x:5|b:-2', 'b:14=x:1|b:3', 'x:1|b:3=b:14', 'x:-2|b:9=b:3',
  'b:3=x:-2|b:9', 'x:4|b:-7=b:13', 'b:13=x:4|b:-7', 'x:2|b:3=b:14', 'b:14=x:2|b:3', 'x:5|b:23=b:3',
  'b:3=x:5|b:23', 'x:6|b:-5=b:13', 'b:13=x:6|b:-5', 'x:3|b:0=x:3|b:0', 'x:1|b:6=b:10', 'b:10=x:1|b:6',
  'x:5|b:0=x:5|b:0', 'x:1|b:-2=b:7', 'b:7=x:1|b:-2', 'x:1|b:9=b:21', 'b:21=x:1|b:9', 'x:-4|b:7=b:13',
  'b:13=x:-4|b:7', 'x:4|b:7=b:13', 'b:13=x:4|b:7', 'x:7|b:-4=b:13', 'b:13=x:7|b:-4', 'x:5|b:-8=b:27',
  'b:27=x:5|b:-8', 'x:-20|b:16=b:74', 'b:74=x:-20|b:16', 'x:1|b:5=b:13', 'b:13=x:1|b:5', 'x:1|b:-8=b:3',
  'b:3=x:1|b:-8', 'x:1|b:12=b:4', 'b:4=x:1|b:12', 'x:1|b:6=b:2', 'b:2=x:1|b:6', 'x:1|b:-3=b:-10',
  'b:-10=x:1|b:-3', 'b:15=x:1|b:9', 'x:1|b:9=b:15', 'x:1|b:6=b:14', 'b:14=x:1|b:6', 'x:6|b:0=b:42',
  'b:42=x:6|b:0', 'x:1/3|b:0=b:6', 'b:6=x:1/3|b:0', 'x:-5|b:0=b:30', 'b:30=x:-5|b:0', 'x:7|b:0=b:-21',
  'b:-21=x:7|b:0', 'x:1/5|b:0=b:-2', 'b:-2=x:1/5|b:0', 'x:5|b:0=b:35', 'b:35=x:5|b:0', 'x:-4|b:0=b:20',
  'b:20=x:-4|b:0', 'x:3|b:2=b:35', 'b:35=x:3|b:2', 'x:5|b:-4=b:21', 'b:21=x:5|b:-4', 'x:4|b:9=b:1',
  'b:1=x:4|b:9', 'x:1/2|b:-3=b:4', 'b:4=x:1/2|b:-3', 'b:31=x:6|b:7', 'x:6|b:7=b:31', 'x:7|b:20=b:-1',
  'b:-1=x:7|b:20', 'x:-1|b:0=b:6', 'b:6=x:-1|b:0', 'x:-1|b:8=b:3', 'b:3=x:-1|b:8', 'x:-1|b:2=b:9',
  'b:9=x:-1|b:2', 'x:-1|b:10=b:18', 'b:18=x:-1|b:10', 'x:-1|b:11=b:5', 'b:5=x:-1|b:11', 'x:-1|b:0=b:-6',
  'b:-6=x:-1|b:0', 'x:4|b:0=b:20', 'b:20=x:4|b:0', 'x:20|b:0=b:4', 'b:4=x:20|b:0', 'x:6|b:0=b:9',
  'b:9=x:6|b:0', 'x:10|b:0=b:4', 'b:4=x:10|b:0', 'x:-8|b:0=b:20', 'b:20=x:-8|b:0', 'x:9|b:0=b:-12',
  'b:-12=x:9|b:0', 'x:15|b:0=b:5', 'b:5=x:15|b:0', 'x:7|b:0=b:35', 'b:35=x:7|b:0', 'x:3|b:1=b:37',
  'b:37=x:3|b:1', 'b:44=x:4|b:4', 'x:4|b:4=b:44', 'x:2|b:-6=b:12', 'b:12=x:2|b:-6', 'x:4|b:7=b:39',
  'b:39=x:4|b:7', 'x:1/3|b:-2=b:5', 'b:5=x:1/3|b:-2', 'x:5|b:-9=b:26', 'b:26=x:5|b:-9', 'x:4|b:3=b:23',
  'b:23=x:4|b:3', 'x:12|b:15=b:87', 'b:87=x:12|b:15', 'x:2|b:10=b:38', 'b:38=x:2|b:10', 'x:8|b:3=x:1|b:45',
  'x:1|b:45=x:8|b:3', 'x:9|b:-7=x:2|b:21', 'x:2|b:21=x:9|b:-7', 'x:1|b:14=x:3|b:-2', 'x:3|b:-2=x:1|b:14',
  'x:-3|b:9=x:1|b:1', 'x:1|b:1=x:-3|b:9', 'x:5|b:5=x:1|b:49', 'x:1|b:49=x:5|b:5', 'x:5|b:4=x:2|b:13',
  'x:2|b:13=x:5|b:4', 'x:3|b:7=x:1|b:-5', 'x:1|b:-5=x:3|b:7', 'x:4|b:-1=x:10|b:2', 'x:10|b:2=x:4|b:-1',
  'x:2|b:9=x:8|b:1', 'x:8|b:1=x:2|b:9', 'x:-1|b:5=x:4|b:8', 'x:4|b:8=x:-1|b:5', 'x:9|b:-4=x:3|b:6',
  'x:3|b:6=x:9|b:-4', 'x:3|b:-2=x:7|b:4', 'x:7|b:4=x:3|b:-2', 'x:4|b:1=x:4|b:6', 'x:4|b:6=x:4|b:1',
  'x:2|b:0=x:8|b:0', 'x:8|b:0=x:2|b:0', 'x:-3|b:8=x:-3|b:8', 'x:6|b:-1=x:1|b:39', 'x:1|b:39=x:6|b:-1',
  'x:-2|b:7=x:-2|b:6', 'x:-2|b:6=x:-2|b:7', 'x:-6|b:0=b:0', 'b:0=x:-6|b:0', 'x:10|b:-3=x:4|b:27',
  'x:4|b:27=x:10|b:-3', 'x:6|b:0=b:24', 'b:24=x:6|b:0', 'x:4|b:-12=b:20', 'b:20=x:4|b:-12', 'x:2|b:10=b:6',
  'b:6=x:2|b:10', 'x:-3|b:6=b:15', 'b:15=x:-3|b:6', 'x:-1|b:3=x:2|b:0', 'x:2|b:0=x:-1|b:3', 'x:3|b:-2=b:10',
  'b:10=x:3|b:-2', 'x:6|b:-3=x:1|b:7', 'x:1|b:7=x:6|b:-3', 'x:-1|b:8=x:2|b:2', 'x:2|b:2=x:-1|b:8',
  'x:-1|b:-3=x:-6|b:0', 'x:-6|b:0=x:-1|b:-3', 'x:1/5|b:0=b:12/5', 'b:12/5=x:1/5|b:0', 'x:3/4|b:0=b:6',
  'b:6=x:3/4|b:0', 'x:1/2|b:5=b:13', 'b:13=x:1/2|b:5', 'x:5/3|b:-2=b:8', 'b:8=x:5/3|b:-2', 'b:4=x:1/3|b:-1',
  'x:1/3|b:-1=b:4', 'x:1/2|b:0=b:6', 'b:6=x:1/2|b:0', 'x:2/15|b:0=b:2', 'b:2=x:2/15|b:0', 'x:1|b:0=b:4',
  'b:4=x:1|b:0', 'x:11/10|b:0=b:22', 'b:22=x:11/10|b:0', 'x:3/10|b:1=b:10', 'b:10=x:3/10|b:1',
  'x:1/3|b:1=x:1/2|b:-1', 'x:1/2|b:-1=x:1/3|b:1', 'x:-1/4|b:3=x:1|b:1/2', 'x:1|b:1/2=x:-1/4|b:3',
  'x:-2/3|b:7/6=x:-1|b:2', 'x:-1|b:2=x:-2/3|b:7/6', 'x:1/4|b:2=b:5', 'b:5=x:1/4|b:2', 'x:1|b:2=b:20',
  'b:20=x:1|b:2', 'x:1|b:8=b:5', 'b:5=x:1|b:8', 'x:1|b:8=b:20', 'b:20=x:1|b:8', 'x:3/2|b:-2=x:1/2|b:3',
  'x:1/2|b:3=x:3/2|b:-2', 'x:2/5|b:1=b:11/5', 'b:11/5=x:2/5|b:1', 'x:23/10|b:-1=x:3/10|b:7',
  'x:3/10|b:7=x:23/10|b:-1', 'x:1/6|b:7/6=b:2', 'b:2=x:1/6|b:7/6', 'x:6|b:-7=x:1|b:38', 'x:1|b:38=x:6|b:-7',
  'x:1|b:30=x:4|b:0', 'x:4|b:0=x:1|b:30', 'x:2|b:14=x:5|b:-10', 'x:5|b:-10=x:2|b:14', 'x:3/4|b:0=b:15',
  'b:15=x:3/4|b:0', 'x:5/6|b:6=x:1|b:0', 'x:1|b:0=x:5/6|b:6', 'x:1/3|b:4=x:1/2|b:0', 'x:1/2|b:0=x:1/3|b:4',
  'x:-1|b:9=b:20', 'b:20=x:-1|b:9', 'x:1|b:-9=b:20', 'b:20=x:1|b:-9', 'x:1|b:9=b:20', 'b:20=x:1|b:9',
  'x:9|b:0=b:20', 'b:20=x:9|b:0', 'x:4|b:0=b:85', 'b:85=x:4|b:0', 'x:5|b:0=b:85', 'b:85=x:5|b:0',
  'x:2|b:4=b:85', 'b:85=x:2|b:4', 'x:3|b:0=b:85', 'b:85=x:3|b:0', 'x:2|b:6=b:32', 'b:32=x:2|b:6',
  'x:2|b:-7=b:5', 'b:5=x:2|b:-7', 'x:-2|b:-1=x:3|b:4', 'x:3|b:4=x:-2|b:-1', 'x:7/10|b:0=b:14',
  'b:14=x:7/10|b:0', 'x:2/3|b:-1=x:1/2|b:1', 'x:1/2|b:1=x:2/3|b:-1', 'x:-1|b:10=x:4|b:1', 'x:4|b:1=x:-1|b:10',
  'x:4|b:0=b:72', 'b:72=x:4|b:0', 'x:6|b:0=b:48', 'b:48=x:6|b:0', 'x:3|b:3=b:99', 'b:99=x:3|b:3',
  'x:2|b:2=b:74', 'b:74=x:2|b:2', 'x:2|b:1=b:-27', 'b:-27=x:2|b:1', 'x:5|b:-8=x:1|b:36', 'x:1|b:36=x:5|b:-8',
  'x:5|b:3=b:38', 'b:38=x:5|b:3', 'x:2|b:10=b:64', 'b:64=x:2|b:10', 'x:7|b:-8=b:90', 'b:90=x:7|b:-8',
  'x:3|b:8=b:38', 'b:38=x:3|b:8', 'x:1|b:30=x:3|b:12', 'x:3|b:12=x:1|b:30', 'x:3|b:-4=x:4|b:-16',
  'x:4|b:-16=x:3|b:-4', 'x:-30|b:800=b:530', 'b:530=x:-30|b:800', 'x:-2|b:120=b:86', 'b:86=x:-2|b:120',
  'x:-1|b:74=x:1|b:38', 'x:1|b:38=x:-1|b:74', 'x:1|b:15=x:-2|b:90', 'x:-2|b:90=x:1|b:15', 'x:4|b:16/5=b:7',
  'b:7=x:4|b:16/5', 'x:3|b:33/2=b:111/5', 'b:111/5=x:3|b:33/2',
]);
/** Huellas FNV-1a (`huellaCanonica`) de las ecuaciones de examen (ya van los dos órdenes): nunca en claro. */
export const HUELLAS_EXAMEN = new Set([
  '197m7do', '1rtmzyg', '7vtpvu', '2o7txu', '177hi2y', 'vo9xx9', 'ewg0mr', '16omlz5', '85t25f', '1jufovk',
  '5twtpg', 'c42st', '10cwm2f', '189cebu', '1ml3t2i', '10yve64', 'gtbrrg', 'w8ikga', '12e49eq', '1ut3tm7',
  '15o517l', '3a01j9', '19xla7z', '1bn0f5m', 'qobgku', '1tyqyof', '1dewtkv', '1rhvu4t', '1nz1e87', '1421vkk',
  'jhk3qc', '105ggu0', 'j0xowq', 'umwhor', '463tl9', '1xsh51n', '1nzr3wv', 'e9kt0t', 'bh5l6x', 'nnudlv',
  'skol6p', 'hz3b0o', '1ofhva8', '2wjn4u', '1frow5q', '1j08e0r', '1oxlkwx', 'd6pfpe', 'du63p8', 'c8bbza',
  'b9u9nq', '1sbozxy', '1g0citi', 'iqlup1', '1rp5j4x', 'zylz0z', 'd5savj', '2nl9m', 'f77e0a', 'exblb2',
  '1ggfowu', '1q6554v', 'cqqmux', '1rlxhe6', 'r1vhu4', 'irq4ve', 'bxofre', 'rzc64i', 'vclysq', 'ooffue',
  '9s2rq0', 'sn8ehp', 'l818e3', '1eit5vr', '317k53', 'q8c984', '1ddk0t0', '1hg84ta', 'im14xm', '1og9tmv',
  'po43r5', '8l26ba', 'xjmo9u', '157fj6q', '1yyg3o2', '1u0t1k7', '1xvoas1', '1scp4ef', '1gak9cl', '1ot9qgp',
  '19s3o3b', '1n58ysw', '3614as', 'kogekm', '1ch033k', '1r23jsa', '1uwmcai', 'gubfkn', 'djs8j7', '1v0e92w',
  '13h8lk8', '129y86', '11j0dfe', '13s09yy', 'g6mryl', 'g2vach', '12lumc7', 'nfrjz', 'fmnkkn', '1k0q1lr',
  'ztyleh', '13hvhcd', 'casc8z', 'tn1qtn', '10xx06d', '19a2vu1', '1sgn8hf', '15xkykj', 'lv5m45', 'zuhzj3',
  '1wcho71', 'msfr0l', 'm557t4', 'vmavvk', 'e5f3ay', '1l3rhj2', '1c3tpdx', '17ciuqf', '1qkxg4h', '1i53krr',
  'vqphyw', '1vt4kh6', '1q4g0s6', 'bm2ab2', '1drl813', '1c4n2kn', 'ngg8ae', 'cb4e9u', '1hb14n2', '1sk0ipq',
  '1x3cs9d', '1ndye5v', 'l6yvdr', 'bl7o05', '183uu34', '13aym28', '14jld9x', 't0i80j', '9q8jw3', '1igw9t9',
  'kkxbtm', 'trewni', '71m0zf', '1qwozwb', 'p7sqq8', '1kkazos', '18p8h85', '1ifyg1b', '1pvi3a2', 'r4egl4',
  '1jdhdun', '1cfbwtr', '13jlijv', '1qihik9', '1v9woss', 'ezv2pk', '1scs9we', '17o7xgo', '1uasn96', 'zn06io',
  '3a2x77', '1ektngf', '1cc35rx', '1lqlimp', '1lz5mju', 'h3601w', 'fwn69m', 'kdz0h6', 'yzzsbk', 'f3piqc',
  'zjyzpi', '2ic9na', '1w2i2i2', '1u3iqak', 'mp4f72', '1gr0kuq', '156hjew', '1emekwo', 'jo48ga', '125chs5',
  '1s833h5', 'y9y7dw', 'evejpc', 't7z2dc', '19vxo1s', '211mm', 'woei52', '1h3vx75', '1xfuzxh', '133qotf',
  '3wb4qj', 'tzt85v', 'g05nih', 'oi4i36', 'k7ania', '10wgk30', '1jfxpd0', 'l50pi3', 'yttz83', '8ozh27',
  'wueylz', '1nxawbt', '467uw1', 't71ygt', 'udvzhx', 'y6btqa', '1o4i15e', 'bhrbrd', 'r0cntr', '1hcv1u7',
  'w5yx15', 'miypyy', '18cefui', 'yybe1l', '1msw2oz', 'rikt47', '1wvy2it', 'w9yw1l', 'usmcqt', 'p9o9bj',
  '1btl76h', 'wzxl23', '15bj4bf', '10cd0rb', 'eobflb', '1bey0dv', 'msbvkr', '1fjnjgl', '1klew83', 'vfkpj2',
  'wv0uni', 'q56i01', 'n0rirf', '1953i0d', '15tfxk1', '13wqio4', '2zjpe8', 'ntycbm', 'rbdjb0', 'mx6h9x',
  'f6penj', 'oflf0x', '6lgkab', 'u10fjk', 'zrglwo', 'q7dyp8', 'm951j0', 'aiuii9', '1bkknih', '7irbjm',
  '7a0f0a', 'g2v09g', 'yx8xo8', '2x9efg', '1q6e5c4', 'm8z49z', 'm0wz93', '194elfv', 'f68viz', 'd3p3wt',
  '1uusb5x', 'qdvx90', '1yfgbp2', '1adtdtk', '39d3j4', '18tys2y', '1bns943', 'wdn40n', 'dnggr9', '1pg3m7l',
  '1dlpv8', '1hrni0c', '76x36n', 'afyep', 'sq6903', '16vznl9', 'qfdxdl', '3ju88b', '1brqi04', 'lvtpo',
  '16wvcmx', 'zds6jb', '4jve5h', '1tj7fet', '1k479rz', 'zmu2ex', 'd9ws8v', 'nc7xib', '73370h', '9jnd4f',
  '1musds6', '1htbwsm', '1rap6dp', 'k117y7', '1p2p7by', '16tdpb2', '7yws7r', '1twfllj', '1pty7yz', 'ov5pat',
  '1pqw96k', '1y7z0r0', '1v3e8ro', '15uksks', '1ju82il', '14h7fad', '1iga21q', 'd9ivam', '1xad8n4', 'lozww1',
  '2sk56l', 'xjr2pq', 'w4pnxw', 't7vhhg', 'ofln6y', '104m6qw', '18iien4', '9fm1st', '1b0qoz3', '9wzbsk',
  'jq9lw8', '1fsmqel', 'h0lxez', 'emcqli', 'ooenrq', '4v7wpw', '1x5qi28', 'gb9lrx', 'k96tq9', '7k8wkt',
  '8n66rt', '9ddykx', '1k3j739', '131chh6', '1tndvma', '1hfsodd', '199ywgn', 'emqdnz', 'rwotpt', 'j73hna',
  '149og8u', '1ge4lns', '1l8sn4g', '1fa66vw', 'rb5x18', '88zjep', '1yfnzc9', '15esx69', 'fosmyb', '1wjb8uf',
  'vm3fd1', '1n5nupg', '1to8kng', 'a8ffgo', '683fm8', '1syqjf7', '1w8wro3', '1iavr6d', '1rhcy1d', '1h4w4r1',
  '1hug0fv', 't7vwvd', '14mxbb7', 'wrnp2d', 'e8jr6h', 'sy5c70', '139icy4', '9lyw3v', 'u2g709', 'yb3fld',
  'chs5vn', 'h3stz9', '15a6615', '1qkymrn', 'yp1wot', '8ofkv9', '6iy4vx', 'lyzil0', '8qneio', '37904f',
  '5mmdqj', '11gaysb', '1b0z4vp', 'sngxjo', 'rg1bmo', '1iz9nno', 'm1lvt4', 't1456k', '1qrkgm8', 'savqzt',
  '1hmeelz', '3x8bqx', 'ugjk8j', '1ygt3v0', 'ctkp60', '1fvx4vb', '1jg5bp7', 'qbqrxy', 'u0laze', '1dkaj96',
  'q492sm', '1tspci4', 'k5fb28', 'th3gzc', '3rdcfv', '13w9c29', '14tzbf', 'phlsix', '1ipkz7j', '19t4ecd',
  '1vc7jk7', '1uau39n', 'mf4ti3', '8aah2h', 'y1u143', 'sy5hpt', '1e5olst', '5ex5sh', '1ja8v4n', '1g4tu5v',
  '1tbcsxm', '1ulthay', '130bobq', 'lcvohq', '1nojdue', '19k5m4u', '1xyossh', 'mz2rul', 'lhynb', '1nhhbyv',
  '1s62h6x', '1ewg9st', '1kk5ypd', '1swzl5p', '6v1ixu', 'v9o7h2', 'nwoir6', '1eljfme', '1evd6ka', '1mlmmaq',
  'nthglv', '1oomzhn', '1w8f7rb', '1btsqw1', '1nm7y4x', '1csd2gl', 'zcl3x8', '11gysi6', '1t5ycga', '1mus0rm',
  'bv5t22', 'turbwi', 'rb3sil', '1xwh2kh', '161fp93', '1xl20mp', '4m8wmr', '10ztukv', '5egqbc', '1lpxlq0',
  'nktr5n', '17ytlw1', '2umacb', '1hkkrb7', '1pdi6x3', '1mm2go9', '19uql2z', 'o488rt', '1gy3t1q', '1drwaje',
  'w0p3nv', '1tcsmy5', '1lr14l6', '1plzotu', 'ezvw7r', '1tkxzjb', '188lso3', '7qrcgz', 'dovkej', '980qip',
  '1dmaj0h', '1nvmlgl', 'uixr3v', 'h66fqz', 'pk1ftf', '24t5tv', '18hzmhs', '718c2s', 'jv15h1', '1gnkygh',
  'ouqugk', 'a6wxu4', 'kf3icy', '13y5ghe', 't5xxu4', '1rxyrro', '139d9qq', 'll4rdq', '1shjd56', '1l6irne',
  '1ry24uv', '42ncad', '1nhh25r', 'njywe5', 'xl4v1v', 'momrbd', 'ajidg4', 'gbjc4g', '1a56hfk', '177zh5w',
  'f2kcuf', 'zgiowj', '1r0q22n', 'hm7sft', '1x3pued', 'idamsz', '7xfuzu', '1cvj8uq', 'mvcmil', 'vgm13',
  '182c7sw', '1uei6zg', '1nl6rlc', 'fblizk', '1odq907', 'lilr2v', 'pu0urk', '1m9acy2', '1iwzimi', '5e3gyy',
  'b86wq2', '1dk0uyo', 'kw5d8z', '1t2oxkl', '1decrek', '1v3cbrq', '1mup8a7', 'ay6sgh', '109qunv', '7at1zt',
  'ylt8i1', 'el6af', '1c1dfnm', '174iirq', '1gge1gk', '10ets7s', '19mj5va', 'fwwmli', '168pv6l', 'tiapmh',
  '1oedqsz', 'p86eq3', '1d7gnik', '1dym51g', 'hgevgv', '1xozyrr', 'tj2gu9', 'l0fjd1', 'rjq9oz', '1ljrqrf',
  '15n5exb', '1sew7dp', 'hmlh63', 'krc12f', '1j9sqy7', '48jxan', '12omn8u', '16fy4x4', '150n21r', '52qrst',
  '18tcxsc', '1g99s2g', '140vihm', 'wcmnii', '169jrmy', '1a43zlm', '1qa1d72', '1yerjxi', 'r5jv1f', '19qg6x9',
  'yoezq6', '11uo9pw', '15mjbmx', '1q5bts7', '1fhu1kg', 'l2gsfg', 'foktpe', '17l6wya', '1nejwvm', 't63nwg',
  '1mali3q', 'v8gso4', '1jwov4m', '1inugqc', '1ghgxkn', '1hvzhxj', '1j6syqe', '14lvqu6', 'z5sfvz', '8qwvpp',
  'w8lo1x', 'ifbrc1', 'eholmt', 'mb7izr', '17ejtb7', '15v2xa3', 'spvo2g', '10vpmjo', '49nnle', '8tzolu',
  'zl4wda', 'ql7ptq', '1vn7zey', 'xm2fxe', 'zgjje7', '1b9hcj7', 'jfykso', '1upb7dk', 'ku407q', 'w4lx2m',
  'ns057p', '15kfwqp', '1t88q6f', '1aenpg3', '1tpnzi1', '17zpwhn', 'dwzahb', 'wcq3g5', '1gdw06c', 'hhev4s',
  '16vsp3m', '1q3en7u', '125wji1', '1upn80t', '1trdace', 'd3e7vi', 'h5cwd2', 'io0uk6', 'r9qo00', '1hjx52w',
  '8epcuc', '1b4a1ks', 'y9jzff', '1lhgwcb', '166ojgp', 'eoix6r', '3dtqhz', 'dqlikl', '1vtyg3h', 'od29n7',
  '1a0pnam', 'elwdq8',
]);
export const reservado = parse => CASOS_HOJA.has(aEcuacion(parse).clave()) || HUELLAS_EXAMEN.has(huellaCanonica(parse));

// ─── Formatos ──────────────────────────────────────────────────────────────────────────────────

const mn = s => String(s).replace(/(\d|x|\)) - (?=\d|x|\()/g, `$1 ${MENOS} `).replace(/(^|[=(\s])-(?=\d|x)/g, `$1${MENOS}`);
/** Céntimos → «2,50» / «2.50». */
export const decimalDe = (c, idioma) => {
  if (c < 0) return MENOS + decimalDe(-c, idioma);
  const e = Math.trunc(c / 100), r = c % 100;
  return `${e}${idioma === 'es' ? ',' : '.'}${String(r).padStart(2, '0')}`;
};
/** Céntimos → «2,50 €» / «€2.50» (siempre con dos decimales). */
export const eurosDe = (c, idioma) => {
  const s = decimalDe(c, idioma);
  return idioma === 'es' ? `${s} €` : `€${s}`;
};
const euroCorto = (c, idioma) => eurosDe(c, idioma);

/** Una ecuación del problema: lo que se resuelve (`parse`, sin paréntesis) y lo que ve el alumno (`txt`). */
const Q = (parse, txt, txtEn = txt) => ({ parse, txt: { es: mn(txt), en: mn(txtEn) } });
const htmlEc = t => t.replace(/x/g, '<i>x</i>');

const fraccionATexto = (f, idioma) => {
  if (f.den === 1) return String(f.num).replace('-', MENOS);
  for (let k = 1; k <= 3; k++) {
    const p = 10 ** k;
    if ((f.num * p) % f.den === 0) {
      const v = Math.abs((f.num * p) / f.den);
      const s = String(Math.trunc(v / p)) + (idioma === 'es' ? ',' : '.') + String(v % p).padStart(k, '0').replace(/0+$/, '');
      return (f.num < 0 ? MENOS : '') + s;
    }
  }
  return `${f.num < 0 ? MENOS : ''}${Math.abs(f.num)}/${f.den}`;
};

const MULT = {
  es: { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple' },
  en: { 2: 'twice', 3: 'three times', 4: 'four times' },
};
const PAREJAS = [['Jim', 'Kate'], ['Hugo', 'Nora'], ['Ivo', 'Lena'], ['Teo', 'Greta']];
const HERMANOS = [['Eva', 'Leo'], ['Nora', 'Teo'], ['Lena', 'Bruno'], ['Greta', 'Ivo']];
const TRIOS = [['Sandra', 'Alberto', 'Carmen'], ['Olivia', 'Bruno', 'Greta'], ['Mara', 'Hugo', 'Lena']];

// ─── Los problemas ─────────────────────────────────────────────────────────────────────────────
//
// Cada plantilla devuelve un problema `P`:
//   enun, x (la incógnita, número; céntimos si `dinero`), escala (100 si `dinero`),
//   xDef, datos[3]  → ejercicio 1;
//   eq, errores[]   → ejercicio 2 (`{ id, parse, txt }`, solo vale el que da otra solución);
//   pedidos[]       → qué se pregunta (`{ id, frase, nombre, valor, esX, resp }`);
//   cantidades[]    → todas las cantidades del problema (ejercicio 4);
//   pasosMano       → solo con dinero (la resolución escrita a mano);
//   cota            → { min, max } de lo que puede valer la incógnita en ese contexto.

// `cuenta` (solo si el valor no es la x): la cuenta que lo calcula desde la x, con los números del ítem; recibe cómo se escribe
// una cantidad de ese problema («7», «2,50 €») y devuelve «7 + 6». El feedback y la tarjeta la enseñan: «Eva tiene 7 + 6 = 13 años».
const pedido = (id, frase, nombre, valor, resp, esX = false, cuenta = null) => ({ id, frase, nombre, valor, esX, resp, cuenta });
const cant = (nombre, valor) => ({ nombre, valor });

const PLANTILLAS = {};

PLANTILLAS.consecutivos = rng => {
  const n = rng.entero(5, 120), S = 3 * n + 3;
  const x = n;
  return {
    x, escala: 1, cota: { min: -50, max: 200 },
    enun: bi(`La suma de tres números consecutivos (seguidos) es ${S}.`, `The sum of three consecutive (seguidos) numbers is ${S}.`),
    xDef: bi('el menor de los tres números', 'the smallest of the three numbers'),
    datos: [
      bi(`la suma de los tres números (${S})`, `the sum of the three numbers (${S})`),
      bi('cuántos números hay (3)', 'how many numbers there are (3)'),
      bi('lo que se avanza de un número al siguiente (1)', 'how much you add to go from one number to the next (1)'),
    ],
    eq: Q(`x + x + 1 + x + 2 = ${S}`, `x + (x + 1) + (x + 2) = ${S}`),
    errores: [
      { id: 'consecutivos-como-multiplos', ...Q(`x + 2x + 3x = ${S}`, `x + 2x + 3x = ${S}`) },
      { id: 'olvidar-un-sumando', ...Q(`x + x + 1 = ${S}`, `x + (x + 1) = ${S}`) },
      { id: 'repetir-el-siguiente', ...Q(`x + x + 1 + x + 1 = ${S}`, `x + (x + 1) + (x + 1) = ${S}`) },
    ],
    pedidos: [
      pedido('mayor', bi('¿Cuál es el mayor de los tres números?', 'What is the largest of the three numbers?'), bi('el mayor de los tres', 'the largest of the three'), n + 2,
        v => bi(`El mayor de los tres números es ${v}.`, `The largest of the three numbers is ${v}.`), false, f => `${f(n)} + 2`),
      pedido('medio', bi('¿Cuál es el número del medio?', 'What is the middle number?'), bi('el número del medio', 'the middle number'), n + 1,
        v => bi(`El número del medio es ${v}.`, `The middle number is ${v}.`), false, f => `${f(n)} + 1`),
    ],
    cantidades: [cant(bi('el menor de los tres', 'the smallest of the three'), n), cant(bi('el del medio', 'the middle one'), n + 1),
      cant(bi('el mayor de los tres', 'the largest of the three'), n + 2), cant(bi('la suma de los tres', 'the sum of the three'), S)],
  };
};

const COSAS_PAR = [
  { es: 'lápices', en: 'pencils' }, { es: 'cromos', en: 'stickers' }, { es: 'caramelos', en: 'sweets' },
];

PLANTILLAS['reparto-veces'] = rng => {
  const [A, B] = rng.elegir(PAREJAS), k = rng.elegir([2, 3, 4]), n = rng.entero(3, 40), T = (k + 1) * n, c = rng.elegir(COSAS_PAR);
  return {
    x: n, escala: 1, cota: { min: 1, max: 200 },
    enun: bi(`${A} y ${B} han comprado ${T} ${c.es} entre los dos. ${B} ha comprado ${MULT.es[k]} de ${c.es} que ${A}.`,
      `${A} and ${B} bought ${T} ${c.en} altogether (en total). ${B} bought ${MULT.en[k]} as many ${c.en} as ${A}.`),
    xDef: bi(`los ${c.es} que ha comprado ${A}`, `the number of ${c.en} ${A} bought`),
    datos: [
      bi(`los ${c.es} que han comprado los dos juntos (${T})`, `the number of ${c.en} they bought altogether (${T})`),
      bi(`por cuánto hay que multiplicar los ${c.es} de ${A} para tener los de ${B} (${k})`, `how many times as many ${c.en} ${B} bought (${k})`),
      bi(`los ${c.es} que ha comprado ${B} más los de ${A}, sin contar nada más (${T})`, `the ${c.en} ${B} bought plus the ${c.en} ${A} bought (${T})`),
    ],
    eq: Q(`x + ${k}x = ${T}`, `x + ${k}x = ${T}`),
    errores: [
      { id: 'olvidar-un-sumando', ...Q(`${k}x = ${T}`, `${k}x = ${T}`) },
      { id: 'veces-como-mas', ...Q(`x + ${k} = ${T}`, `x + ${k} = ${T}`) },
      { id: 'mas-que-al-equivocado', ...Q(`x + x + ${k} = ${T}`, `x + (x + ${k}) = ${T}`) },
    ],
    pedidos: [
      pedido('B', bi(`¿Cuántos ${c.es} ha comprado ${B}?`, `How many ${c.en} did ${B} buy?`), bi(`los ${c.es} de ${B}`, `${B}'s ${c.en}`), k * n,
        v => bi(`${B} ha comprado ${v} ${c.es}.`, `${B} bought ${v} ${c.en}.`), false, f => `${k} · ${f(n)}`),
      pedido('A', bi(`¿Cuántos ${c.es} ha comprado ${A}?`, `How many ${c.en} did ${A} buy?`), bi(`los ${c.es} de ${A}`, `${A}'s ${c.en}`), n,
        v => bi(`${A} ha comprado ${v} ${c.es}.`, `${A} bought ${v} ${c.en}.`), true),
    ],
    cantidades: [cant(bi(`los ${c.es} de ${A}`, `${A}'s ${c.en}`), n), cant(bi(`los ${c.es} de ${B}`, `${B}'s ${c.en}`), k * n),
      cant(bi(`los ${c.es} de los dos juntos`, `the ${c.en} of both together`), T), cant(bi('el número de veces', 'the number of times'), k)],
  };
};

const COSAS_TRIO = [
  { es: 'pulseras de hilo', en: 'thread bracelets' }, { es: 'grullas de papel', en: 'paper cranes' }, { es: 'marcapáginas', en: 'bookmarks', m: true },
];

PLANTILLAS['reparto-tres'] = rng => {
  const [A, B, C] = rng.elegir(TRIOS), s = rng.entero(3, 30), n = rng.entero(2, 9), T = 5 * s + n, c = rng.elegir(COSAS_TRIO), la = c.m ? 'los' : 'las', Cuantas = c.m ? 'Cuántos' : 'Cuántas', cuantas = c.m ? 'cuántos' : 'cuántas', las = c.m ? 'los' : 'las';
  return {
    x: s, escala: 1, cota: { min: 1, max: 200 },
    enun: bi(`${A}, ${B} y ${C} han hecho ${T} ${c.es} entre los tres. ${B} ha hecho el doble que ${A}, y ${C} ha hecho ${n} más que ${B}.`,
      `${A}, ${B} and ${C} made ${T} ${c.en} altogether (en total). ${B} made twice as many as ${A}, and ${C} made ${n} more than ${B}.`),
    xDef: bi(`${la} ${c.es} que ha hecho ${A}`, `the number of ${c.en} ${A} made`),
    datos: [
      bi(`${la} ${c.es} que han hecho los tres juntos (${T})`, `the number of ${c.en} the three of them made (${T})`),
      bi(`${cuantas} ${c.es} más que ${B} ha hecho ${C} (${n})`, `how many more ${c.en} ${C} made than ${B} (${n})`),
      bi(`por cuánto hay que multiplicar ${la} ${c.es} de ${A} para tener ${las} de ${B} (2)`, `how many times as many ${c.en} ${B} made as ${A} (2)`),
    ],
    eq: Q(`x + 2x + 2x + ${n} = ${T}`, `x + 2x + (2x + ${n}) = ${T}`),
    errores: [
      { id: 'parentesis-olvidado', ...Q(`x + 2x + 2x + ${2 * n} = ${T}`, `x + 2x + 2(x + ${n}) = ${T}`) },
      { id: 'mas-que-al-equivocado', ...Q(`x + 2x + x + ${n} = ${T}`, `x + 2x + (x + ${n}) = ${T}`) },
      { id: 'olvidar-un-sumando', ...Q(`x + 2x = ${T}`, `x + 2x = ${T}`) },
      { id: 'olvidar-un-sumando', ...Q(`x + 2x + 2x = ${T}`, `x + 2x + 2x = ${T}`) },
    ],
    pedidos: [
      pedido('C', bi(`¿${Cuantas} ha hecho ${C}?`, `How many did ${C} make?`), bi(`${la} ${c.es} de ${C}`, `${C}'s ${c.en}`), 2 * s + n,
        v => bi(`${C} ha hecho ${v} ${c.es}.`, `${C} made ${v} ${c.en}.`), false, f => `2 · ${f(s)} + ${f(n)}`),
      pedido('B', bi(`¿${Cuantas} ha hecho ${B}?`, `How many did ${B} make?`), bi(`${la} ${c.es} de ${B}`, `${B}'s ${c.en}`), 2 * s,
        v => bi(`${B} ha hecho ${v} ${c.es}.`, `${B} made ${v} ${c.en}.`), false, f => `2 · ${f(s)}`),
    ],
    cantidades: [cant(bi(`${las} de ${A}`, `${A}'s`), s), cant(bi(`${las} de ${B}`, `${B}'s`), 2 * s), cant(bi(`${las} de ${C}`, `${C}'s`), 2 * s + n),
      cant(bi(`${las} de los tres juntos`, 'the three together'), T)],
  };
};

PLANTILLAS['edades-diferencia'] = rng => {
  const [M, m] = rng.elegir(HERMANOS), L = rng.entero(6, 16), n = rng.entero(2, 8), S = 2 * L + n;
  return {
    x: L, escala: 1, cota: { min: 1, max: 100 },
    enun: bi(`${M} tiene ${n} años más que su hermano ${m}. Entre los dos suman ${S} años.`,
      `${M} is ${n} years older than her brother ${m}. Their ages add up to ${S}.`),
    xDef: bi(`la edad de ${m}`, `${m}'s age`),
    datos: [
      bi(`la suma de las dos edades (${S})`, `the sum of the two ages (${S})`),
      bi(`los años de diferencia entre los hermanos (${n})`, `the number of years between the two (${n})`),
      bi('cuántos hermanos hay (2)', 'how many children there are (2)'),
    ],
    eq: Q(`x + x + ${n} = ${S}`, `x + (x + ${n}) = ${S}`),
    errores: [
      { id: 'olvidar-un-sumando', ...Q(`x + ${n} = ${S}`, `x + ${n} = ${S}`) },
      { id: 'menos-que-al-reves', ...Q(`x + x - ${n} = ${S}`, `x + (x - ${n}) = ${S}`) },
      { id: 'olvidar-la-diferencia', ...Q(`x + x = ${S}`, `x + x = ${S}`) },
    ],
    pedidos: [
      pedido('M', bi(`¿Cuántos años tiene ${M}?`, `How old is ${M}?`), bi(`la edad de ${M}`, `${M}'s age`), L + n,
        v => bi(`${M} tiene ${v} años.`, `${M} is ${v} years old.`), false, f => `${f(L)} + ${f(n)}`),
      pedido('m', bi(`¿Cuántos años tiene ${m}?`, `How old is ${m}?`), bi(`la edad de ${m}`, `${m}'s age`), L,
        v => bi(`${m} tiene ${v} años.`, `${m} is ${v} years old.`), true),
    ],
    cantidades: [cant(bi(`la edad de ${m}`, `${m}'s age`), L), cant(bi(`la edad de ${M}`, `${M}'s age`), L + n),
      cant(bi('la suma de las dos edades', 'the sum of the two ages'), S), cant(bi('los años de diferencia', 'the years between them'), n)],
  };
};

const COMPRAS = [
  { k_es: 'entradas de cine', k_en: 'cinema tickets', extra_es: 'unas palomitas', extra_en: 'a bag of popcorn', una_es: 'cada entrada', una_en: 'each ticket' },
  { k_es: 'entradas de museo', k_en: 'museum tickets', extra_es: 'una guía', extra_en: 'a guidebook', una_es: 'cada entrada', una_en: 'each ticket' },
];

PLANTILLAS.entradas = rng => {
  const c = rng.elegir(COMPRAS), k = rng.entero(2, 6), p = rng.entero(3, 25), b = rng.entero(2, 12), T = k * p + b;
  const e = (v, i) => euroCorto(v * 100, i);
  return {
    x: p * 100, escala: 100, dinero: true, cota: { min: 100, max: 6000 },
    enun: bi(`${k} ${c.k_es} y ${c.extra_es} de ${e(b, 'es')} cuestan ${e(T, 'es')} en total.`, `${k} ${c.k_en} and ${c.extra_en} for ${e(b, 'en')} cost ${e(T, 'en')} altogether (en total).`),
    xDef: bi(`el precio de ${c.una_es}`, `the price of ${c.una_en}`),
    datos: [
      bi(`lo que cuesta todo junto (${e(T, 'es')})`, `what everything costs together (${e(T, 'en')})`),
      bi(`cuántas ${c.k_es.split(' ')[0]} se compran (${k})`, `how many tickets are bought (${k})`),
      bi(`lo que cuesta lo que se paga aparte (${e(b, 'es')})`, `what the extra costs (${e(b, 'en')})`),
    ],
    eq: Q(`${k}x + ${b} = ${T}`, `${k}x + ${b} = ${T}`),
    errores: [
      { id: 'olvidar-el-extra', ...Q(`${k}x = ${T}`, `${k}x = ${T}`) },
      { id: 'restar-en-vez-de-sumar', ...Q(`${k}x - ${b} = ${T}`, `${k}x - ${b} = ${T}`) },
      { id: 'multiplicar-el-extra', ...Q(`x + ${k * b} = ${T}`, `x + ${k * b} = ${T}`) },
    ],
    pedidos: [
      pedido('una', bi(`¿Cuánto cuesta ${c.una_es}?`, `How much does ${c.una_en} cost?`), bi(`el precio de ${c.una_es}`, `the price of ${c.una_en}`), p * 100,
        v => bi(`${c.una_es[0].toUpperCase()}${c.una_es.slice(1)} cuesta ${eurosDe(v, 'es')}.`, `${c.una_en[0].toUpperCase()}${c.una_en.slice(1)} costs ${eurosDe(v, 'en')}.`), true),
      pedido('todas', bi(`¿Cuánto cuestan las ${k} ${c.k_es}, sin lo que se paga aparte?`, `How much do the ${k} ${c.k_en} cost, without the extra?`), bi(`lo que cuestan las ${k} ${c.k_es}`, `what the ${k} ${c.k_en} cost`), k * p * 100,
        v => bi(`Las ${k} ${c.k_es} cuestan ${eurosDe(v, 'es')}.`, `The ${k} ${c.k_en} cost ${eurosDe(v, 'en')}.`), false, f => `${k} · ${f(p * 100)}`),
    ],
    cantidades: [cant(bi(`el precio de ${c.una_es}`, `the price of ${c.una_en}`), p * 100), cant(bi(`lo que cuestan las ${k} ${c.k_es}`, `what the ${k} ${c.k_en} cost`), k * p * 100),
      cant(bi('lo que cuesta todo', 'the total cost'), T * 100), cant(bi('lo que cuesta lo que se paga aparte', 'the cost of the extra'), b * 100)],
    pasosMano: idioma => [
      `${k}x = ${T} ${MENOS} ${b}`, `${k}x = ${T - b}`, `x = ${T - b} ${idioma === 'es' ? ':' : '÷'} ${k}`, `x = ${p}`,
    ],
  };
};

PLANTILLAS.cuadernos = rng => {
  const k = rng.entero(2, 6), p = 5 * rng.entero(10, 120), b = 5 * rng.entero(10, 80), T = k * p + b;
  const d = (v, i) => decimalDe(v, i), eu = (v, i) => eurosDe(v, i);
  const num = (v, i) => (v % 100 === 0 ? String(v / 100) : d(v, i));
  const dot = v => (v % 100 === 0 ? String(v / 100) : d(v, 'en'));
  return {
    x: p, escala: 100, dinero: true, cota: { min: 50, max: 1000 },
    enun: bi(`${k} cuadernos iguales y un bolígrafo de ${eu(b, 'es')} cuestan ${eu(T, 'es')} en total.`, `${k} identical notebooks and a pen that costs ${eu(b, 'en')} cost ${eu(T, 'en')} altogether (en total).`),
    xDef: bi('el precio de un cuaderno', 'the price of one notebook'),
    datos: [
      bi(`lo que cuesta todo junto (${eu(T, 'es')})`, `what everything costs together (${eu(T, 'en')})`),
      bi(`cuántos cuadernos se compran (${k})`, `how many notebooks are bought (${k})`),
      bi(`lo que cuesta el bolígrafo (${eu(b, 'es')})`, `what the pen costs (${eu(b, 'en')})`),
    ],
    eq: { parse: `${k}x + ${dot(b)} = ${dot(T)}`, txt: { es: `${k}x + ${num(b, 'es')} = ${num(T, 'es')}`, en: `${k}x + ${num(b, 'en')} = ${num(T, 'en')}` } },
    errores: [
      { id: 'olvidar-el-extra', parse: `${k}x = ${dot(T)}`, txt: { es: `${k}x = ${num(T, 'es')}`, en: `${k}x = ${num(T, 'en')}` } },
      { id: 'restar-en-vez-de-sumar', parse: `${k}x - ${dot(b)} = ${dot(T)}`, txt: { es: `${k}x ${MENOS} ${num(b, 'es')} = ${num(T, 'es')}`, en: `${k}x ${MENOS} ${num(b, 'en')} = ${num(T, 'en')}` } },
      { id: 'olvidar-el-multiplicador', parse: `x + ${dot(b)} = ${dot(T)}`, txt: { es: `x + ${num(b, 'es')} = ${num(T, 'es')}`, en: `x + ${num(b, 'en')} = ${num(T, 'en')}` } },
    ],
    pedidos: [
      pedido('uno', bi('¿Cuánto cuesta cada cuaderno?', 'How much does each notebook cost?'), bi('el precio de un cuaderno', 'the price of one notebook'), p,
        v => bi(`Cada cuaderno cuesta ${eurosDe(v, 'es')}.`, `Each notebook costs ${eurosDe(v, 'en')}.`), true),
      pedido('cuadernos', bi(`¿Cuánto cuestan los ${k} cuadernos, sin el bolígrafo?`, `How much do the ${k} notebooks cost, without the pen?`), bi(`lo que cuestan los ${k} cuadernos`, `what the ${k} notebooks cost`), k * p,
        v => bi(`Los ${k} cuadernos cuestan ${eurosDe(v, 'es')}.`, `The ${k} notebooks cost ${eurosDe(v, 'en')}.`), false, f => `${k} · ${f(p)}`),
    ],
    cantidades: [cant(bi('el precio de un cuaderno', 'the price of one notebook'), p), cant(bi(`lo que cuestan los ${k} cuadernos`, `what the ${k} notebooks cost`), k * p),
      cant(bi('lo que cuesta todo', 'the total cost'), T), cant(bi('lo que cuesta el bolígrafo', 'the price of the pen'), b)],
    pasosMano: idioma => [
      `${k}x = ${num(T, idioma)} ${MENOS} ${num(b, idioma)}`, `${k}x = ${num(T - b, idioma)}`, `x = ${num(T - b, idioma)} ${idioma === 'es' ? ':' : '÷'} ${k}`, `x = ${num(p, idioma)}`,
    ],
  };
};

const SITIOS = [
  { es: 'Un patio rectangular', en: 'A rectangular playground', una_es: 'el patio', una_en: 'the playground', largo: 'm', borde_es: 'su valla', borde_en: 'its fence', min: 8, max: 35, n: [3, 15] },
  { es: 'Un póster rectangular', en: 'A rectangular poster', una_es: 'el póster', una_en: 'the poster', largo: 'cm', borde_es: 'su marco', borde_en: 'its frame', min: 15, max: 35, n: [5, 15] },
];

PLANTILLAS.perimetro = rng => {
  const s = rng.elegir(SITIOS), w = rng.entero(s.min, s.max), n = rng.entero(...s.n), P = 4 * w + 2 * n, u = s.largo;
  return {
    x: w, escala: 1, cota: { min: 1, max: 50 }, unidad: u,
    enun: bi(`${s.es} mide ${n} ${u} más de largo que de ancho. ${s.borde_es[0].toUpperCase()}${s.borde_es.slice(1)} mide ${P} ${u} en total.`,
      `${s.en} is ${n} ${u} longer than it is wide. ${s.borde_en[0].toUpperCase()}${s.borde_en.slice(1)} is ${P} ${u} long in total.`),
    xDef: bi(`lo que mide ${s.una_es} de ancho`, `the width of ${s.una_en}`),
    datos: [
      bi(`lo que mide ${s.borde_es} en total (${P} ${u})`, `the total length of ${s.borde_en} (${P} ${u})`),
      bi(`lo que mide ${s.una_es} de largo más de lo que mide de ancho (${n} ${u})`, `how much longer ${s.una_en} is than it is wide (${n} ${u})`),
      bi('cuántos lados tiene un rectángulo (4)', 'how many sides a rectangle has (4)'),
    ],
    eq: Q(`x + x + ${n} + x + x + ${n} = ${P}`, `x + (x + ${n}) + x + (x + ${n}) = ${P}`),
    errores: [
      { id: 'dos-lados', ...Q(`x + x + ${n} = ${P}`, `x + (x + ${n}) = ${P}`) },
      { id: 'olvidar-n', ...Q(`x + x + x + x = ${P}`, `4x = ${P}`) },
      { id: 'sumar-n-una-vez', ...Q(`x + x + x + x + ${n} = ${P}`, `4x + ${n} = ${P}`) },
    ],
    pedidos: [
      pedido('largo', bi(`¿Cuánto mide ${s.una_es} de largo?`, `How long is ${s.una_en}?`), bi(`lo que mide ${s.una_es} de largo`, `the length of ${s.una_en}`), w + n,
        v => bi(`${s.una_es[0].toUpperCase()}${s.una_es.slice(1)} mide ${v} ${u} de largo.`, `${s.una_en[0].toUpperCase()}${s.una_en.slice(1)} is ${v} ${u} long.`), false, f => `${f(w)} + ${f(n)}`),
      pedido('ancho', bi(`¿Cuánto mide ${s.una_es} de ancho?`, `How wide is ${s.una_en}?`), bi(`lo que mide ${s.una_es} de ancho`, `the width of ${s.una_en}`), w,
        v => bi(`${s.una_es[0].toUpperCase()}${s.una_es.slice(1)} mide ${v} ${u} de ancho.`, `${s.una_en[0].toUpperCase()}${s.una_en.slice(1)} is ${v} ${u} wide.`), true),
    ],
    cantidades: [cant(bi('lo que mide de ancho', 'the width'), w), cant(bi('lo que mide de largo', 'the length'), w + n),
      cant(bi('lo que mide en total su contorno', 'the total length around it'), P), cant(bi('lo que mide de largo más que de ancho', 'how much longer than wide'), n)],
  };
};

PLANTILLAS.pienso = rng => {
  const k = rng.elegir([2, 3, 4, 5, 6]), x = rng.entero(2, 60), resta = rng.azar() < 0.4;
  const b = rng.entero(1, resta ? Math.min(20, k * x - 1) : 20);
  const R = resta ? k * x - b : k * x + b;
  const op = resta ? '-' : '+';
  const par = resta ? `${k}x - ${k * b}` : `${k}x + ${k * b}`;
  return {
    x, escala: 1, cota: { min: -50, max: 200 },
    enun: bi(`Pienso un número, lo multiplico por ${k} y ${resta ? 'le resto' : 'le sumo'} ${b}. Me sale ${R}.`, `I think of a number, multiply it by ${k} and ${resta ? 'subtract' : 'add'} ${b}. I get ${R}.`),
    xDef: bi('el número que he pensado', 'the number I thought of'),
    datos: [
      bi(`el resultado que me sale (${R})`, `the result I get (${R})`),
      bi(`el número por el que lo multiplico (${k})`, `the number I multiply by (${k})`),
      bi(`lo que ${resta ? 'le resto' : 'le sumo'} (${b})`, `what I ${resta ? 'subtract' : 'add'} (${b})`),
    ],
    eq: Q(`${k}x ${op} ${b} = ${R}`, `${k}x ${op} ${b} = ${R}`),
    errores: [
      { id: 'parentesis-olvidado', ...Q(`${par} = ${R}`, `${k}(x ${op} ${b}) = ${R}`) },
      { id: 'olvidar-el-multiplicador', ...Q(`x ${op} ${b} = ${R}`, `x ${op} ${b} = ${R}`) },
      { id: 'restar-en-vez-de-sumar', ...Q(`${k}x = ${resta ? R - b : R + b}`, `${k}x = ${resta ? R - b : R + b}`) },
    ],
    pedidos: [
      pedido('numero', bi('¿Qué número he pensado?', 'What number did I think of?'), bi('el número pensado', 'the number I thought of'), x,
        v => bi(`He pensado el ${v}.`, `I thought of ${v}.`), true),
      pedido('doble', bi('¿Cuánto es el doble del número que he pensado?', 'What is double the number I thought of?'), bi('el doble del número pensado', 'double the number I thought of'), 2 * x,
        v => bi(`El doble del número que he pensado es ${v}.`, `Double the number I thought of is ${v}.`), false, f => `2 · ${f(x)}`),
    ],
    cantidades: [cant(bi('el número pensado', 'the number I thought of'), x), cant(bi('el doble del número pensado', 'double the number I thought of'), 2 * x),
      cant(bi('el resultado', 'the result'), R), cant(bi(`el número multiplicado por ${k}`, `the number times ${k}`), k * x)],
  };
};

export const TIPOS = Object.keys(PLANTILLAS);

// ─── Resolución y comprobaciones ───────────────────────────────────────────────────────────────

const igual = (f, n) => f.num === n * f.den;
/** La solución (Fraccion) de una ecuación en texto. */
export const solucionDe = parse => deEcuacion(parse).resolver();
/** La solución de la ecuación del problema, escalada a la unidad de `x` (céntimos o la unidad). */
export const solucionEscalada = (P, parse) => { const f = solucionDe(parse); return { num: f.num * P.escala, den: f.den }; };
/** ¿Tiene sentido como cantidad de ese contexto? (natural dentro de la cota; en euros, céntimos exactos y positivos) */
export const razonable = (P, f) => {
  const v = f.num * P.escala;
  if (v % f.den !== 0) return false;
  const w = v / f.den;
  return w >= P.cota.min && w <= P.cota.max;
};

function construir(rng, tipo) {
  for (let i = 0; i < 80; i++) {
    const P = PLANTILLAS[tipo](rng);
    P.tipo = tipo;
    if (!reservado(P.eq.parse)) return validar(P);
  }
  throw new Error(`«${tipo}»: no se encuentra un problema que no sea de la hoja ni del examen`);
}

function validar(P) {
  const s = solucionDe(P.eq.parse);
  if (!igual({ num: s.num * P.escala, den: s.den }, P.x)) throw new Error(`«${P.tipo}»: la ecuación ${P.eq.parse} no da x = ${P.x}`);
  P.errores = P.errores.map(e => ({ ...e, sol: solucionDe(e.parse) }));
  return P;
}

const nuevoProblema = (rng, tipo = rng.elegir(TIPOS)) => construir(rng, tipo);
export const problema = nuevoProblema;

const fmtX = (P, idioma) => (P.dinero ? eurosDe(P.x, idioma) : String(P.x));
/** Una cantidad del problema con su unidad. */
export const fmtVal = (P, v, idioma) => (P.dinero ? eurosDe(v, idioma) : String(v));
const cuentaHtml = t => cuenta(htmlEc(t));
const htmlTexto = (P, idioma) => cuentaHtml(P.eq.txt[idioma]);

const itemBase = (P, plantilla, clave, extra = {}) => ({
  plantilla, clave: `${P.tipo}|${clave}`, tipo: P.tipo, enun: P.enun, dinero: Boolean(P.dinero), sesion: 13, ...extra,
});

/** Texto de la resolución en el idioma, línea a línea. */
export function resolucion(P, idioma) {
  if (P.pasosMano) return P.pasosMano(idioma);
  const q = deEcuacion(P.eq.parse);
  const lineas = q.pasos().map(p => p.ecuacion.aTexto(idioma));
  return lineas;
}

const resolucionHtml = (P, idioma) => `<ul class="desarrollo">${resolucion(P, idioma).map(l => `<li>${cuentaHtml(l)}</li>`).join('')}</ul>`;

// ─── Ejercicio 1 · ¿Qué es x? (U6-4A-01) ───────────────────────────────────────────────────────

export function generarIncognita(rng) {
  const P = nuevoProblema(rng);
  const ops = rng.barajar([
    { valor: 'buena', texto: P.xDef, correcta: true, error: null },
    ...P.datos.map((d, i) => ({ valor: `dato${i}`, texto: d, correcta: false, error: 'incognita-dato' })),
  ]);
  return itemBase(P, 'incognita', P.enun.es, {
    opciones: ops, xDef: P.xDef, eqTxt: P.eq.txt, x: P.x, solucion: null,
    // lo que se enseña al final
    ecuacionHtml: { es: htmlTexto(P, 'es'), en: htmlTexto(P, 'en') },
  });
}

export const solucionIncognita = item => ({
  es: `<i>x</i> es lo que no sabes y quieres calcular: <strong>${item.xDef.es}</strong>. Lo demás (${item.opciones.filter(o => !o.correcta).length} opciones) ya lo da el enunciado. Con esa <i>x</i> sale la ecuación ${item.ecuacionHtml.es}.`,
  en: `<i>x</i> is what you do not know and want to find: <strong>${item.xDef.en}</strong>. The other options are numbers the statement already gives. With that <i>x</i> you get the equation ${item.ecuacionHtml.en}.`,
});

export const porQueDato = (op, idioma) => ({
  es: `Eso ya lo dice el enunciado: es ${op.texto.es}.`,
  en: `The statement already tells you that: it is ${op.texto.en}.`,
})[idioma];

// ─── Ejercicio 2 · ¿Qué ecuación? (U6-2A-01, 3A-01, 4C-01) ────────────────────────────────────

export function generarEcuacion(rng) {
  for (let i = 0; i < 200; i++) {
    const it = intentoEcuacion(rng);
    if (it) return it;
  }
  throw new Error('generarEcuacion: no se encuentran tres ecuaciones con soluciones distintas');
}

function intentoEcuacion(rng) {
  const P = nuevoProblema(rng);
  const buena = { valor: P.eq.parse, correcta: true, error: null, txt: P.eq.txt };
  const pool = rng.barajar(P.errores);
  const elegidos = [];
  const sols = [solucionDe(P.eq.parse)];
  for (const e of pool) {
    if (sols.some(s => s.num * e.sol.den === e.sol.num * s.den)) continue;
    sols.push(e.sol);
    elegidos.push({ valor: e.parse, correcta: false, error: e.id, txt: e.txt, sol: e.sol });
    if (elegidos.length === 3) break;
  }
  if (elegidos.length < 3) return null;
  return itemBase(P, 'ecuacion', P.enun.es, {
    pregunta: bi('¿Qué ecuación plantea el problema, con x = ' + P.xDef.es + '?', 'Which equation sets up the problem, with x = ' + P.xDef.en + '?'),
    opciones: rng.barajar([buena, ...elegidos]), xDef: P.xDef, eqTxt: P.eq.txt, x: P.x,
  });
}

export const solucionEcuacion = item => ({
  es: `La ecuación buena es ${cuentaHtml(item.eqTxt.es)}: así sale <i>x</i> = ${fmtVal({ dinero: item.dinero }, item.x, 'es')}.`,
  en: `The right equation is ${cuentaHtml(item.eqTxt.en)}: that gives <i>x</i> = ${fmtVal({ dinero: item.dinero }, item.x, 'en')}.`,
});

/** Por qué falla una ecuación equivocada, con su solución. */
export function porQueEcuacion(item, op, idioma) {
  const f = op.sol;
  const sol = fraccionATexto(item.dinero ? { num: f.num * 100, den: f.den } : f, idioma);
  const solTxt = item.dinero && f.den === 1 && (f.num * 100) % 1 === 0 ? decimalDe(Math.round(f.num * 100 / f.den), idioma) : sol;
  return {
    es: `${explicaError(op.error, 'es')}. Esa ecuación da <i>x</i> = ${item.dinero ? solTxt : sol}, y con ese valor no se cumple el enunciado.`,
    en: `${explicaError(op.error, 'en')}. That equation gives <i>x</i> = ${item.dinero ? solTxt : sol}, and with that value the statement is not true.`,
  }[idioma];
}

// ─── Ejercicio 3 · Resuelve y contesta (U6-2A-02, 2A-03, 3A-03, 4A-01 a 4A-05, 4A-09) ─────────

export function generarResuelve(rng) {
  const P = nuevoProblema(rng);
  const ped = rng.elegir(P.pedidos);
  return itemBase(P, 'resuelve', `${P.enun.es}|${ped.id}`, {
    pregunta: ped.frase, xDef: P.xDef, eqTxt: P.eq.txt, x: P.x, valor: ped.valor, esX: ped.esX, nombreP: ped.nombre,
    frases: { es: ped.resp(ped.valor).es, en: ped.resp(ped.valor).en },
    // pasos de resolución para el feedback
    pasos: { es: resolucion(P, 'es'), en: resolucion(P, 'en') },
    soluciones: P.errores.map(e => ({ id: e.id, valor: Math.round(Number(e.sol.num) * P.escala / Number(e.sol.den)), exacto: (e.sol.num * P.escala) % e.sol.den === 0 })),
    contexto: P,
  });
}

/** Lee lo que teclea el alumno: un número natural, o dinero con hasta dos decimales (en céntimos). */
export function leerCantidad(texto, { dinero = false } = {}) {
  let s = String(texto ?? '').trim().replace(/\s+/g, ' ');
  if (s === '') return { ok: false, motivo: 'vacio' };
  if (dinero) s = s.replace(/^€\s*/, '').replace(/\s*€$/, '');
  if (/^x\s*=/.test(s)) return { ok: false, motivo: 'x' };
  if (/[a-zA-Z]/.test(s)) return { ok: false, motivo: 'letras' };
  if (dinero) {
    const m = /^(\d{1,5})(?:[.,](\d{1,2}))?$/.exec(s);
    if (!m) return { ok: false, motivo: 'basura' };
    return { ok: true, valor: Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0') || 0) };
  }
  const m = /^(\d{1,6})$/.exec(s);
  if (!m) return { ok: false, motivo: 'basura' };
  return { ok: true, valor: Number(m[1]) };
}

export const MENSAJES_CANTIDAD = {
  vacio: bi('', ''),
  x: bi('Escribe solo el número, sin «x =».', 'Write only the number, without “x =”.'),
  letras: bi('Escribe solo el número, sin letras.', 'Write only the number, no letters.'),
  basura: bi('Escribe un número (sin más signos).', 'Write a number (no other signs).'),
};

/** Corrige lo que contesta el alumno. */
export function corregirResuelve(item, texto) {
  const r = leerCantidad(texto, { dinero: item.dinero });
  if (!r.ok) return { valida: false, mensaje: MENSAJES_CANTIDAD[r.motivo] };
  if (r.valor === item.valor) return { valida: true, acierto: true, valor: r.valor };
  if (r.valor === item.x && !item.esX) return { valida: true, acierto: false, error: 'contestar-x', valor: r.valor };
  const e = item.soluciones.find(s => s.exacto && s.valor === r.valor);
  const otra = item.contexto.cantidades.find(c => c.valor === r.valor);
  return { valida: true, acierto: false, error: e ? e.id : otra ? 'otra-cantidad' : 'otra-respuesta', valor: r.valor, otra };
}

/** El feedback con las cuatro fases. */
export function feedbackResuelve(item, idioma, r = null) {
  const P = item.contexto;
  const lead = !r || r.acierto ? '' : leadResuelve(item, r, idioma);
  const xv = fmtX(P, idioma);
  const t = {
    es: { x: `<i>x</i> = ${P.xDef.es}`, ec: 'Ecuación', res: 'Resolución', resp: 'Respuesta', val: `<i>x</i> = ${xv}` },
    en: { x: `<i>x</i> = ${P.xDef.en}`, ec: 'Equation', res: 'Solving', resp: 'Answer', val: `<i>x</i> = ${xv}` },
  }[idioma];
  return `${lead}<ol class="fases">
    <li>${t.x}</li>
    <li>${t.ec}: ${cuentaHtml(P.eq.txt[idioma])}</li>
    <li>${t.res}: ${resolucionHtml(P, idioma)}</li>
    <li>${t.resp}: ${item.frases[idioma]}</li></ol>`;
}

function leadResuelve(item, r, idioma) {
  if (r.error === 'contestar-x') {
    return idioma === 'es'
      ? `Has contestado el valor de <i>x</i> (${item.xDef.es}), pero se pregunta ${item.nombreP.es}. `
      : `You gave the value of <i>x</i> (${item.xDef.en}), but the question asks for ${item.nombreP.en}. `;
  }
  if (r.error === 'otra-cantidad') {
    return idioma === 'es' ? `Has contestado con ${r.otra.nombre.es}, pero se pregunta por ${item.nombreP.es}. ` : `That number is ${r.otra.nombre.en}, but the question asks for ${item.nombreP.en}. `;
  }
  if (r.error !== 'otra-respuesta') return `${explicaError(r.error, idioma)}. `;
  return '';
}

// ─── Ejercicio 4 · ¿Qué pide? (U6-4A-01, 4A-08) ────────────────────────────────────────────────

/** La frase de respuesta de un pedido; si el valor no es la x, con la cuenta delante del valor («Eva tiene 7 + 6 = 13 años.»). */
export function frasesConCuenta(P, ped) {
  const r = ped.resp(ped.valor);
  if (ped.esX || !ped.cuenta) return r;
  const una = idioma => {
    const v = fmtVal(P, ped.valor, idioma), i = r[idioma].lastIndexOf(v);
    const cta = `${ped.cuenta(c => fmtVal(P, c, idioma))} = ${v}`;
    return i < 0 ? r[idioma] : `${r[idioma].slice(0, i)}${cta}${r[idioma].slice(i + v.length)}`;
  };
  return { es: una('es'), en: una('en') };
}

export function generarPide(rng) {
  for (let i = 0; i < 200; i++) {
    const it = intentoPide(rng);
    if (it) return it;
  }
  throw new Error('generarPide: no se encuentran cuatro respuestas distintas');
}

function intentoPide(rng) {
  const P = nuevoProblema(rng);
  const candidatos = P.pedidos.filter(p => !p.esX);
  const ped = candidatos.length ? rng.elegir(candidatos) : rng.elegir(P.pedidos);
  const otras = [];
  const vistos = new Set([ped.valor]);
  for (const c of rng.barajar(P.cantidades)) {
    if (vistos.has(c.valor)) continue;
    vistos.add(c.valor);
    otras.push({ valor: c.valor, correcta: false, nombre: c.nombre, error: c.valor === P.x ? 'contestar-x' : 'otra-cantidad' });
    if (otras.length === 3) break;
  }
  if (otras.length < 3) return null;
  const correcta = { valor: ped.valor, correcta: true, nombre: ped.nombre, error: null };
  return itemBase(P, 'pide', `${P.enun.es}|${ped.id}`, {
    pregunta: ped.frase, opciones: rng.barajar([correcta, ...otras]), x: P.x, xDef: P.xDef, valor: ped.valor, nombreP: ped.nombre, esX: ped.esX,
    frases: frasesConCuenta(P, ped), eqTxt: P.eq.txt, contexto: P,
  });
}

export function solucionPide(item, idioma) {
  const P = item.contexto;
  const xs = `<i>x</i> = ${fmtX(P, idioma)} (${P.xDef[idioma]})`;
  return idioma === 'es'
    ? `Se ha resuelto la ecuación ${cuentaHtml(item.eqTxt.es)}: ${xs}. Pero el enunciado pregunta ${item.nombreP.es}: ${item.frases.es}`
    : `The equation ${cuentaHtml(item.eqTxt.en)} gives ${xs}. But the question asks for ${item.nombreP.en}: ${item.frases.en}`;
}

/** Lo que se enseña al fallar: por qué no es y cuál es la respuesta. */
export const solucionPideCorta = (item, idioma) => item.frases[idioma];

export function porQuePide(item, op, idioma) {
  if (op.error === 'contestar-x') {
    return idioma === 'es' ? `Ese es el valor de <i>x</i> (${item.xDef.es}), pero se pregunta ${item.nombreP.es}.` : `That is the value of <i>x</i> (${item.xDef.en}), but the question asks for ${item.nombreP.en}.`;
  }
  return idioma === 'es' ? `Has contestado con ${op.nombre.es}, pero se pregunta por ${item.nombreP.es}.` : `That number is ${op.nombre.en}, but the question asks for ${item.nombreP.en}.`;
}

// ─── Ejercicio 5 · ¿Tiene sentido? (U6-4A-08) ──────────────────────────────────────────────────

export const OPCIONES_SENTIDO = ['bien', 'ecuacion', 'resolucion', 'enunciado'];
const ERROR_DE_SENTIDO = { bien: 'sentido-mal', ecuacion: 'sentido-ecuacion', resolucion: 'sentido-resolucion', enunciado: 'sentido-enunciado' };

const ERRORES_DE_RESOLVER = ['transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'signo-de-la-solucion'];

/** Un fallo al resolver que dé una solución que no puede ser, o null. */
function falloAlResolver(P) {
  const q = deEcuacion(P.eq.parse);
  for (const id of ERRORES_DE_RESOLVER) {
    let paso;
    try { paso = ERRORES_TIPICOS[id].fn(q); } catch { paso = null; }
    if (!paso) continue;
    const f = paso.resolver();
    if (f && typeof f.num === 'number' && !razonable(P, f)) return { id, paso, sol: f };
  }
  return null;
}

export function generarSentido(rng) {
  for (let i = 0; i < 200; i++) {
    const P = nuevoProblema(rng);
    const tipo = rng.elegir(['bien', 'bien', 'ecuacion', 'ecuacion', 'resolucion']);
    if (tipo === 'bien') return sentidoBien(P);
    if (tipo === 'ecuacion') {
      const malas = rng.barajar(P.errores.filter(e => e.sol && !razonable(P, e.sol) && centimosExactos(P, e.sol)));
      if (malas.length) return sentidoEcuacion(P, malas[0]);
    } else {
      const f = falloAlResolver(P);
      if (f && centimosExactos(P, f.sol)) {
        const it = sentidoResolucion(P, f);
        if (!P.dinero || (it.linea.es && it.linea.en)) return it;
      }
    }
  }
  throw new Error('generarSentido: no se encuentra un caso');
}

const solTexto = (P, f, idioma) => {
  if (!P.dinero) return fraccionATexto(f, idioma);
  const c = f.num * 100;
  if (c % f.den === 0) {
    const cents = c / f.den;
    return cents < 0 ? `${MENOS}${eurosDe(-cents, idioma)}` : eurosDe(cents, idioma);
  }
  return fraccionATexto(f, idioma);
};

/** Pasa las fracciones de un texto a decimales (coma en español, punto en inglés; hasta céntimos), o null si alguna no es exacta. */
export function fraccionesADecimales(texto, idioma) {
  let ok = true;
  const t = texto.replace(/(\d+)\/(\d+)/g, (_, n, d) => {
    const c = Number(n) * 100;
    if (c % Number(d) !== 0) { ok = false; return _; }
    const cents = c / Number(d), e = Math.trunc(cents / 100), r = cents % 100;
    return `${e}${r === 0 ? '' : (idioma === 'es' ? ',' : '.') + String(r).padStart(2, '0').replace(/0$/, '')}`;
  });
  return ok ? t : null;
}
/** En dinero, la solución tiene que ser un número exacto de céntimos: nunca un precio con fracción. */
const centimosExactos = (P, f) => !P.dinero || (f.num * 100) % f.den === 0;

const baseSentido = (P, donde, extra) => itemBase(P, 'sentido', `${P.enun.es}|${donde}|${extra.clave}`, {
  correcta: donde === 'bien' ? 'bien' : donde, donde, xDef: P.xDef, eqTxt: P.eq.txt, x: P.x, contexto: P, ...extra,
});

function sentidoBien(P) {
  return baseSentido(P, 'bien', { clave: P.eq.parse, ecuacion: P.eq.txt, linea: null, solucionTxt: { es: solTexto(P, solucionDe(P.eq.parse), 'es'), en: solTexto(P, solucionDe(P.eq.parse), 'en') } });
}
function sentidoEcuacion(P, e) {
  return baseSentido(P, 'ecuacion', {
    clave: e.parse, ecuacion: e.txt, linea: null, errorId: e.id,
    solucionTxt: { es: solTexto(P, e.sol, 'es'), en: solTexto(P, e.sol, 'en') }, solValor: { num: e.sol.num, den: e.sol.den },
  });
}
function sentidoResolucion(P, f) {
  const linea = { es: f.paso.aTexto('es'), en: f.paso.aTexto('en') };
  if (P.dinero) { linea.es = fraccionesADecimales(linea.es, 'es'); linea.en = fraccionesADecimales(linea.en, 'en'); }
  return baseSentido(P, 'resolucion', {
    clave: `${P.eq.parse}|${f.id}`, ecuacion: P.eq.txt, linea, errorId: f.id,
    solucionTxt: { es: solTexto(P, f.sol, 'es'), en: solTexto(P, f.sol, 'en') }, solValor: { num: f.sol.num, den: f.sol.den },
  });
}

/** Qué hace absurda la solución, en una frase. */
export function absurdo(item, idioma) {
  const P = item.contexto, f = item.solValor;
  const v = item.solucionTxt[idioma];
  const dineroMal = P.dinero && f.den !== 1;
  const negativa = f.num < 0;
  if (negativa) return idioma === 'es' ? `<i>x</i> = ${v} es negativo y ${P.xDef.es} no puede serlo` : `<i>x</i> = ${v} is negative and ${P.xDef.en} cannot be`;
  if (dineroMal || f.den !== 1) return idioma === 'es' ? `<i>x</i> = ${v} no es un valor posible para ${P.xDef.es}` : `<i>x</i> = ${v} is not a possible value for ${P.xDef.en}`;
  return idioma === 'es' ? `<i>x</i> = ${v} no es un valor creíble para ${P.xDef.es}` : `<i>x</i> = ${v} is not a believable value for ${P.xDef.en}`;
}

export function solucionSentido(item, idioma) {
  const P = item.contexto;
  const buena = cuentaHtml(P.eq.txt[idioma]);
  if (item.donde === 'bien') {
    return idioma === 'es'
      ? `Sí tiene sentido: <i>x</i> = ${item.solucionTxt.es} (${P.xDef.es}) es un valor posible y la ecuación ${buena} recoge el enunciado.`
      : `Yes, it makes sense: <i>x</i> = ${item.solucionTxt.en} (${P.xDef.en}) is a possible value and the equation ${buena} fits the statement.`;
  }
  if (item.donde === 'ecuacion') {
    return idioma === 'es'
      ? `No tiene sentido: ${absurdo(item, 'es')}. La solución está bien calculada, pero la ecuación ${cuentaHtml(item.ecuacion.es)} no recoge el enunciado (${explicaError(item.errorId, 'es').toLowerCase()}). La buena es ${buena}.`
      : `It does not make sense: ${absurdo(item, 'en')}. The solution is worked out correctly, but the equation ${cuentaHtml(item.ecuacion.en)} does not fit the statement (${explicaError(item.errorId, 'en').toLowerCase()}). The right one is ${buena}.`;
  }
  const primero = resolucion(P, idioma)[0];
  return idioma === 'es'
    ? `No tiene sentido: ${absurdo(item, 'es')}. La ecuación ${buena} está bien; el error está al resolverla: la línea ${cuentaHtml(item.linea.es)} no sale de ahí (${explicaError(item.errorId, 'es').toLowerCase()}). Bien sería ${cuentaHtml(primero)}.`
    : `It does not make sense: ${absurdo(item, 'en')}. The equation ${buena} is fine; the mistake is when solving it: the line ${cuentaHtml(item.linea.en)} does not follow from it (${explicaError(item.errorId, 'en').toLowerCase()}). It should be ${cuentaHtml(primero)}.`;
}

export const claveItem = item => `${item.plantilla}|${item.clave}`;
export const errorDeSentido = (item, elegida) => (elegida === 'bien' ? 'sentido-bien' : item.donde === 'bien' ? 'sentido-mal' : ERROR_DE_SENTIDO[elegida]);
