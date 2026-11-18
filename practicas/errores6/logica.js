// Práctica «Caza el error» de la unidad 6, Algebra (PU2, tarea 154): lógica pura (sin DOM ni red).
//
// Cada plantilla es UN error típico de `ERRORES_TIPICOS` (algebra.js) con sus números. Da una ecuación
// resuelta paso a paso, con la línea 1 (el enunciado) siempre bien. Si hay error, está en una sola
// línea y las de después SIGUEN de ella (el compañero no vuelve a equivocarse). Sin error, todas las
// líneas son equivalentes. Los ítems son DATOS (JSON): las líneas se guardan como texto y se pintan al
// montar, así que la base puede volver a montar el mismo ítem al cambiar de idioma.
//
//   { ec: '3x + 2 = 8' }   una ecuación (se lee con `aEcuacion` y se pinta con raya de fracción)
//   { raw: '3(x − 2) = 12' } texto tal cual (la única línea con paréntesis: el enunciado)
//   { t: {es, en} }        una frase ("No tiene solución")
//
// Ítem: { tipo: 'donde' | 'que' | 'corrige', plantilla, params, lineas, falsa (índice o null), error,
//         [opciones, solucion] (ej. 2), [bien, mal] (ej. 3) }.
//
// Casos de la hoja y del examen: HOJA (claves canónicas en claro) y HUELLAS_EXAMEN (FNV-1a de la forma
// canónica del enunciado, calculada fuera del repositorio). Las listas las calculó la tarea 159 a partir de las
// hojas 1-4 y los exámenes 1-4 y finales de la unidad 6 (`hechos/notas/…-errores6-reserva.txt`).

import {
  Ecuacion, termino, lineal, aEcuacion, aLineal, ERRORES_TIPICOS as E, huellaCanonica, leerExpresion,
} from '../_comun/algebra.js';
import { Fraccion, fraccion, aTexto as fracATexto } from '../_comun/fracciones.js';

const X = 'x';
const T = (c, l = null) => termino(c, l);
const MENOS = '−';
const num = v => (v < 0 ? `${MENOS}${-v}` : `${v}`);
const par = v => (v < 0 ? `(${MENOS}${-v})` : `${v}`); // factor negativo entre paréntesis: 6 · (−4)
const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
const sinCero = (rng, lo, hi) => { let v; do v = rng.entero(lo, hi); while (v === 0); return v; };
const conSigno = (rng, max) => (rng.azar() < 0.5 ? -1 : 1) * rng.entero(1, max);
/** Los términos de una lista, quitando los números que son 0 (no se escribe «+ 0»). */
const sinCeros = ts => ts.filter(t => t.letra !== null || !t.coef.equals(0));

// ─── Casos que no se pueden repetir ───────────────────────────────────────────

/** Claves canónicas (`Ecuacion.clave()`, las dos ordenaciones de los miembros) de los enunciados de las hojas 1-4 de la unidad 6 y de la primera
    línea de sus soluciones, en claro (el papel es del alumno). Calculadas fuera del repositorio por la tarea 159: `hechos/notas/…-errores6-reserva.txt`. */
export const HOJA = new Set([
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
/** Huellas (FNV-1a de la forma canónica, los dos órdenes) de las ecuaciones de los exámenes 1-4 y sus extra y de los finales de la unidad 6,
    calculadas fuera del repositorio por la tarea 159; los casos de examen no se escriben en claro. */
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
/** ¿Está reservado este enunciado (una Ecuacion)? */
export const reservado = q => HOJA.has(q.clave()) || HUELLAS_EXAMEN.has(huellaCanonica(q));

// ─── Ayudas ────────────────────────────────────────────────────────────────────

const L = (q, extra = {}) => ({ q, ...extra });
const seguir = q => q.pasos().map(p => L(p.ecuacion));
const reducida = q => { const { A, C } = q.forma(); return new Ecuacion([T(A, q.letra)], [T(C)]); };
const clave = s => (s instanceof Fraccion ? `n:${s.simplificar().num}/${s.simplificar().den}` : `s:${s.tipo}`);
const solucionDe = q => q.resolver();
const lin = (l, rhs) => new Ecuacion(sinCeros([T(l.a, X), T(l.b)]), [T(rhs)]);
const textoLinea = l => l.ec ?? l.raw ?? null;

/** Una línea guardada (JSON) a partir de la que construye la plantilla. */
const guardar = l => (l.t ? { t: l.t } : l.raw ? { raw: l.raw } : { ec: l.q.aTexto() });

// ─── Plantillas ────────────────────────────────────────────────────────────────
// id (= error típico), clase, corrige (¿tiene una solución que teclear?), params(rng) → objeto con números
// o null, caso(p) → Ecuacion del enunciado (para la hoja y el examen), cadena(p, mal) → { lineas: [L…], falsa },
// contexto(p) → lo que necesitan las funciones de los otros errores, hint(p, idioma).

export const PLANTILLAS = [];
const nueva = p => { PLANTILLAS.push(p); return p; };

const ECUACION = ['transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'invertir-coeficiente',
  'signo-al-dividir', 'signo-de-la-solucion', 'cero-x-como-x'];
const DENOMINADORES = ['mcm-solo-denominadores', 'olvidar-numerador'];
const PARENTESIS = ['distribuir-solo-primero', 'signo-solo-primero'];
const REDUCIR = ['suma-no-semejantes'];
export const CLASES = { ecuacion: ECUACION, denominadores: DENOMINADORES, parentesis: PARENTESIS, reducir: REDUCIR };
export const CLASE_DE = Object.fromEntries(Object.entries(CLASES).flatMap(([c, ids]) => ids.map(id => [id, c])));

/** Cadena genérica: se sustituye la ÚLTIMA línea de los pasos (el despeje) por la que da el error. */
function cadenaFinal(q0, mal, id) {
  const ps = q0.pasos().map(p => p.ecuacion);
  const buenas = [q0, ...ps];
  if (!mal) return { lineas: buenas.map(q => L(q)), falsa: null };
  const w = E[id].fn(ps.at(-2));
  if (!w) throw new Error('el error no se aplica');
  const lineas = [...buenas.slice(0, -1), w].map(q => L(q));
  return { lineas, falsa: lineas.length - 1 };
}
/** Cadena genérica: la primera línea tras el enunciado (`paso`) se sustituye por la errónea y se sigue de ella. */
function cadenaPrimera(q0, mal, w) {
  if (!mal) return { lineas: [L(q0), ...seguir(q0)], falsa: null };
  return { lineas: [L(q0), L(w), ...seguir(w)], falsa: 1 };
}

// 1 · Transponer sin cambiar el signo (x + 3 = 10 → x = 10 + 3)
nueva({
  id: 'transponer-sin-signo', corrige: true,
  params(rng) {
    const a = rng.entero(1, 6), s = sinCero(rng, -9, 12), b = conSigno(rng, 12);
    if (rng.azar() < 0.5) return { a, b, c: a * s + b, d: 0, dos: false };
    let c = rng.entero(1, 6); if (c === a) c = a + 1;
    return { a, b, c, d: a * s + b - c * s, dos: true };
  },
  caso: p => (p.dos
    ? new Ecuacion([T(p.a, X), T(p.b)], sinCeros([T(p.c, X), T(p.d)]))
    : new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)])),
  cadena(p, mal) {
    const q0 = this.caso(p);
    return cadenaPrimera(q0, mal, mal ? E['transponer-sin-signo'].fn(q0) : null);
  },
  hint: (p, i) => (i === 'en'
    ? 'A term that adds goes to the other side subtracting, and one that subtracts goes adding: it changes sign when it changes side.'
    : 'Un término que suma pasa restando y uno que resta pasa sumando: al cambiar de miembro cambia de signo.'),
});

// 2 · 3x = 12 → x = 12 − 3 (el factor pasa restando)
const paramsProducto = rng => { const a = rng.entero(2, 9), s = sinCero(rng, -9, 12), b = conSigno(rng, 12); return { a, b, c: a * s + b, orden: rng.entero(0, 1) }; };
const casoProducto = p => new Ecuacion(p.orden ? [T(p.b), T(p.a, X)] : [T(p.a, X), T(p.b)], [T(p.c)]);
nueva({
  id: 'pasar-factor-restando', corrige: true, params: paramsProducto, caso: casoProducto,
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `${fracATexto(A)} multiplies x, so it goes to the other side dividing: x = ${fracATexto(C)} : ${fracATexto(A)}.`
      : `${fracATexto(A)} multiplica a la x, así que pasa dividiendo: x = ${fracATexto(C)} : ${fracATexto(A)}.`;
  },
});

// 3 · 3x = 12 → x = 36 (multiplica en vez de dividir)
nueva({
  id: 'multiplicar-en-vez-de-dividir', corrige: true, params: paramsProducto, caso: casoProducto,
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `${fracATexto(A)} multiplies x, so it moves to the other side as a division: x = ${fracATexto(C)} : ${fracATexto(A)}, not ${fracATexto(C)} · ${fracATexto(A)}.`
      : `${fracATexto(A)} multiplica a la x, así que pasa dividiendo: x = ${fracATexto(C)} : ${fracATexto(A)}, no ${fracATexto(C)} · ${fracATexto(A)}.`;
  },
});

// 4 · 12x = 3 → x = 4 (divide al revés)
nueva({
  id: 'invertir-coeficiente', corrige: true,
  params(rng) { const a = rng.entero(4, 12), C = sinCero(rng, -3, 6), b = conSigno(rng, 10); return C === a || C === -a ? null : { a, b, c: b + C }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)]),
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `x = ${fracATexto(C)} : ${fracATexto(A)}: the number that multiplies x divides the number on the other side, not the other way round.`
      : `x = ${fracATexto(C)} : ${fracATexto(A)}: el número que multiplica a la x divide al del otro lado, no al revés.`;
  },
});

// 5 · −2x = 8 → x = 4 (pierde el signo del número que pasa dividiendo)
nueva({
  id: 'signo-al-dividir', corrige: true,
  params(rng) { const a = rng.entero(2, 9), s = sinCero(rng, -9, 12); return { a, b: rng.entero(1, 20), c: 0, s, orden: rng.entero(0, 1) }; },
  caso(p) { return new Ecuacion(p.orden ? [T(-p.a, X), T(p.b)] : [T(p.b), T(-p.a, X)], [T(p.b - p.a * p.s)]); },
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const { A, C } = this.caso(p).forma();
    return i === 'en'
      ? `Divide by ${fracATexto(A)} with its sign: x = ${fracATexto(C)} : (${fracATexto(A)}).`
      : `Se divide entre ${fracATexto(A)} con su signo: x = ${fracATexto(C)} : (${fracATexto(A)}).`;
  },
});

// 6 · x + 9 = 4 → x = 5 (pierde el signo de la solución)
nueva({
  id: 'signo-de-la-solucion', corrige: true,
  params(rng) { const a = rng.entero(1, 4), s = rng.entero(-12, -1), b = rng.entero(1, 20); return { a, b, c: a * s + b }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.c)]),
  cadena(p, mal) { return cadenaFinal(this.caso(p), mal, this.id); },
  hint(p, i) {
    const s = this.caso(p).resolver();
    return i === 'en' ? `The sign counts: the result is ${fracATexto(s)}, not ${fracATexto(s.opuesta())}.`
      : `El signo cuenta: el resultado es ${fracATexto(s)}, no ${fracATexto(s.opuesta())}.`;
  },
});

// 7 · x/2 + 1 = x/3 → 3x + 1 = 2x (multiplica solo los términos con denominador)
nueva({
  id: 'mcm-solo-denominadores', corrige: true,
  params(rng) {
    const d1 = rng.elegir([2, 3, 4, 5, 6]), d2 = rng.elegir([2, 3, 4, 5, 6]);
    if (d1 === d2) return null;
    const p = { d1, d2, b: rng.entero(1, 9), c: rng.entero(0, 9) };
    const s = this.caso(p).resolver();
    return s instanceof Fraccion && s.den === 1 && s.num !== 0 && E['mcm-solo-denominadores'].fn(this.caso(p)) ? p : null;
  },
  caso: p => new Ecuacion([T(fraccion(1, p.d1), X), T(p.b)], sinCeros([T(fraccion(1, p.d2), X), T(p.c)])),
  cadena(p, mal) { const q0 = this.caso(p); return cadenaPrimera(q0, mal, mal ? E[this.id].fn(q0) : null); },
  hint(p, i) {
    const m = this.caso(p).mcmDenominadores();
    return i === 'en' ? `Every term is multiplied by ${m}, also the ones without a denominator.`
      : `Se multiplican todos los términos por ${m}, también los que no tienen denominador.`;
  },
});

// 8 · 3x/4 por 12 → 3x (olvida multiplicar por el numerador)
nueva({
  id: 'olvidar-numerador', corrige: true,
  params(rng) {
    const d1 = rng.elegir([4, 5, 6, 7]), a = rng.elegir([2, 3, 4, 5].filter(k => mcd(k, d1) === 1));
    const d2 = rng.elegir([2, 3, 4, 5, 6].filter(d => d !== d1)), dos = rng.azar() < 0.7;
    const s = sinCero(rng, -12, 12);
    // c = s·(a/d1 + 1/d2) debe ser entero
    const bruto = fraccion(a, d1).sumar(dos ? fraccion(1, d2) : fraccion(0, 1)).multiplicar(s).simplificar();
    if (bruto.den !== 1) return null;
    const b = dos ? 0 : conSigno(rng, 9);
    const p = { a, d1, d2: dos ? d2 : 0, b, c: bruto.num + b };
    return E['olvidar-numerador'].fn(this.caso(p)) ? p : null;
  },
  caso: p => new Ecuacion(sinCeros([T(fraccion(p.a, p.d1), X), ...(p.d2 ? [T(fraccion(1, p.d2), X)] : []), T(p.b)]), [T(p.c)]),
  cadena(p, mal) { const q0 = this.caso(p); return cadenaPrimera(q0, mal, mal ? E[this.id].fn(q0) : null); },
  hint(p, i) {
    const m = this.caso(p).mcmDenominadores();
    return i === 'en'
      ? `${p.a}x/${p.d1} times ${m} is ${p.a * m / p.d1}x: ${m} : ${p.d1} = ${m / p.d1}, and then times the numerator ${p.a}.`
      : `${p.a}x/${p.d1} por ${m} es ${p.a * m / p.d1}x: ${m} : ${p.d1} = ${m / p.d1}, y después por el numerador ${p.a}.`;
  },
});

// 9 · 0x = 3 → x = 3 (da un valor cuando la x se ha ido)
nueva({
  id: 'cero-x-como-x', corrige: false,
  params(rng) { const b = sinCero(rng, -12, 12); let c = sinCero(rng, -12, 12); if (c === b) c = b + 1; return { a: rng.entero(2, 6), b, c }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b)], [T(p.a, X), T(p.c)]),
  cadena(p, mal) {
    const q0 = this.caso(p), ps = q0.pasos().filter(x => x.tipo === 'transponer' || x.tipo === 'reducir').map(x => x.ecuacion);
    const base = [q0, ...ps].map(q => L(q));
    if (!mal) return { lineas: [...base, L(null, { t: { es: 'No tiene solución', en: 'It has no solution' } })], falsa: null };
    return { lineas: [...base, L(E[this.id].fn(q0))], falsa: base.length };
  },
  hint(p, i) {
    const c = this.caso(p).forma().C;
    return i === 'en' ? `When the x disappears and 0x = ${fracATexto(c)} is left, no number makes it true: it has no solution.`
      : `Si la x desaparece y queda 0x = ${fracATexto(c)}, ningún número lo cumple: no tiene solución.`;
  },
});

// 10 · 3x + 2 + x → 5x (suma el número con las x)
nueva({
  id: 'suma-no-semejantes', corrige: true,
  params(rng) { const a = rng.entero(2, 6), c = rng.entero(1, 4), b = conSigno(rng, 12), s = rng.entero(1, 10); return Math.abs(a + c + b) <= 1 ? null : { a, b, c, e: (a + c) * s + b }; },
  caso: p => new Ecuacion([T(p.a, X), T(p.b), T(p.c, X)], [T(p.e)]),
  junta: p => new Ecuacion([T(p.a + p.c, X), T(p.b)], [T(p.e)]),
  cadena(p, mal) {
    const q0 = this.caso(p), bien = this.junta(p);
    if (!mal) return { lineas: [L(q0), L(bien), ...seguir(bien)], falsa: null };
    const w = lin(E[this.id].fn(aLineal(q0.izq)), p.e);
    return { lineas: [L(q0), L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `Only the terms with x are added; ${num(p.b)} has no x, so it stays apart.`
    : `Solo se suman los términos con x; el ${num(p.b)} no tiene x y se queda aparte.`),
});

// 11 · 3(x − 2) → 3x − 2 (multiplica solo el primer término)
const textoParentesis = (k, n, c) => `${k < 0 ? MENOS : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}(x ${n < 0 ? MENOS : '+'} ${Math.abs(n)}) = ${num(c)}`;
nueva({
  id: 'distribuir-solo-primero', corrige: true,
  params(rng) { const k = rng.entero(2, 6), n = conSigno(rng, 9), s = sinCero(rng, -8, 12); return { k, n, c: k * (s + n) }; },
  caso: p => new Ecuacion([T(p.k, X), T(p.k * p.n)], [T(p.c)]),
  raw: p => textoParentesis(p.k, p.n, p.c),
  cadena(p, mal) {
    const q0 = this.caso(p), l1 = L(q0, { raw: this.raw(p) });
    if (!mal) return { lineas: [l1, L(q0), ...seguir(q0)], falsa: null };
    const w = new Ecuacion([T(p.k, X), T(p.n)], [T(p.c)]);
    return { lineas: [l1, L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `${p.k} multiplies every term in the brackets: ${p.k} · ${par(p.n)} = ${num(p.k * p.n)}.`
    : `El ${p.k} multiplica a todos los términos del paréntesis: ${p.k} · ${par(p.n)} = ${num(p.k * p.n)}.`),
});

// 12 · −(x − 2) → −x − 2 (el signo menos solo cambia el primer término)
nueva({
  id: 'signo-solo-primero', corrige: true,
  params(rng) { const k = rng.entero(1, 4), n = conSigno(rng, 9), s = sinCero(rng, -8, 12); return { k, n, c: -k * (s + n) }; },
  caso: p => new Ecuacion([T(-p.k, X), T(-p.k * p.n)], [T(p.c)]),
  raw: p => textoParentesis(-p.k, p.n, p.c),
  cadena(p, mal) {
    const q0 = this.caso(p), l1 = L(q0, { raw: this.raw(p) });
    if (!mal) return { lineas: [l1, L(q0), ...seguir(q0)], falsa: null };
    const w = new Ecuacion([T(-p.k, X), T(p.k * p.n)], [T(p.c)]);
    return { lineas: [l1, L(w), ...seguir(w)], falsa: 1 };
  },
  hint: (p, i) => (i === 'en' ? `The minus sign changes every term in the brackets: ${MENOS}${p.k} · ${par(p.n)} = ${num(-p.k * p.n)}.`
    : `El signo menos cambia todos los términos del paréntesis: ${MENOS}${p.k} · ${par(p.n)} = ${num(-p.k * p.n)}.`),
});

export const PLANTILLA_POR_ID = Object.fromEntries(PLANTILLAS.map(p => [p.id, p]));

// ─── Qué explica cada error ────────────────────────────────────────────────────

/** Lo que cada función de error necesita, calculado con los números del ítem. */
function contexto(plantilla, p) {
  const q = plantilla.caso(p), red = reducida(q);
  const par = plantilla.id === 'distribuir-solo-primero' ? { k: p.k, n: p.n, c: p.c }
    : plantilla.id === 'signo-solo-primero' ? { k: -p.k, n: p.n, c: p.c } : null;
  return { q, red, par, lhs: aLineal(q.izq), rhs: q.forma().C.simplificar() };
}

/** La solución a la que llegaría un compañero que cometiera ESTE error con los números del ítem (o null si no se aplica). */
export function solucionConError(plantilla, id, p) {
  const c = contexto(plantilla, p);
  try {
    let r;
    switch (id) {
      case 'transponer-sin-signo': case 'mcm-solo-denominadores': case 'olvidar-numerador': {
        r = E[id].fn(c.q); return r ? clave(solucionDe(r)) : null;
      }
      case 'pasar-factor-restando': case 'multiplicar-en-vez-de-dividir': case 'invertir-coeficiente':
      case 'signo-al-dividir': case 'signo-de-la-solucion': case 'cero-x-como-x': {
        r = E[id].fn(c.red); return r ? clave(solucionDe(r)) : null;
      }
      case 'suma-no-semejantes': {
        r = E[id].fn(c.lhs); return r ? clave(solucionDe(lin(r, c.q.der.b))) : null;
      }
      case 'distribuir-solo-primero': case 'signo-solo-primero': {
        if (!c.par) return null;
        r = E[id].fn(c.par.k, lineal(1, c.par.n)); return r ? clave(solucionDe(lin(r, c.par.c))) : null;
      }
      default: return null;
    }
  } catch { return null; }
}

/** ¿Llevaría `id` al mismo resultado final que el cálculo malo del ítem? Entonces no puede ser distractor. */
export function explica(plantilla, id, p, malFinal) { return solucionConError(plantilla, id, p) === malFinal; }

/** El error bueno y tres que no se han cometido (los de su clase primero); barajados. */
export function opcionesDeNombre(rng, plantilla, p) {
  const malFinal = clave(solucionDe(ultimaEcuacion(plantilla, p, true)));
  const validos = Object.keys(CLASE_DE).filter(id => id !== plantilla.id && !explica(plantilla, id, p, malFinal));
  const mismos = rng.barajar(validos.filter(id => CLASE_DE[id] === CLASE_DE[plantilla.id]));
  const resto = rng.barajar(validos.filter(id => CLASE_DE[id] !== CLASE_DE[plantilla.id]));
  return rng.barajar([plantilla.id, ...[...mismos.slice(0, 2), ...resto].slice(0, 3)]);
}

function ultimaEcuacion(plantilla, p, mal) {
  const { lineas } = plantilla.cadena(p, mal);
  return lineas.filter(l => l.q).at(-1).q;
}

// ─── Generadores ───────────────────────────────────────────────────────────────

function conParams(plantilla, rng) {
  for (let i = 0; i < 800; i++) {
    const p = plantilla.params(rng);
    if (!p) continue;
    const q = plantilla.caso(p);
    if (reservado(q)) continue;
    try { if (plantilla.cadena(p, true).lineas.some(l => l.q === null && !l.t) || !plantilla.cadena(p, false).lineas) continue; } catch { continue; }
    // el cálculo malo tiene que acabar en otra solución que el bueno
    if (clave(solucionDe(ultimaEcuacion(plantilla, p, true))) === clave(solucionDe(ultimaEcuacion(plantilla, p, false)))
      && plantilla.id !== 'cero-x-como-x') continue;
    return p;
  }
  throw new Error(`La plantilla «${plantilla.id}» no encuentra números`);
}

const baseItem = (tipo, plantilla, p, mal, extra = {}) => {
  const { lineas, falsa } = plantilla.cadena(p, mal);
  return { tipo, plantilla: plantilla.id, params: p, lineas: lineas.map(guardar), falsa, error: mal ? plantilla.id : null, ...extra };
};

/** Ejercicio 1: ¿dónde está el error? Un tercio de los ítems no tiene ninguno. */
export function generarDonde(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('donde', pl, p, rng.azar() >= 1 / 3);
}

/** Ejercicio 2: ¿qué error es? Siempre hay error; cuatro nombres, uno solo verdadero. */
export function generarQue(rng) {
  const pl = rng.elegir(PLANTILLAS), p = conParams(pl, rng);
  return baseItem('que', pl, p, true, { opciones: opcionesDeNombre(rng, pl, p), solucion: pl.id });
}

/** Ejercicio 3: corrígelo. Solo las plantillas con una solución que se pueda teclear. */
export function generarCorrige(rng) {
  const pl = rng.elegir(PLANTILLAS.filter(x => x.corrige)), p = conParams(pl, rng);
  return baseItem('corrige', pl, p, true, {});
}

/** La solución buena del ejercicio 3 (Fraccion). */
export const resultadoBueno = item => { const pl = PLANTILLA_POR_ID[item.plantilla]; return solucionDe(pl.caso(item.params)); };
/** La solución a la que llega el cálculo malo (Fraccion o {tipo}). */
export const resultadoMalo = item => { const pl = PLANTILLA_POR_ID[item.plantilla]; return solucionDe(ultimaEcuacion(pl, item.params, true)); };

/**
 * Corrige lo que escribe el alumno (una Fraccion). { acierto, error }: 'repite-el-error' si pone lo mismo que el
 * cálculo malo, 'otro-resultado' en el resto.
 */
/** Lo que escribe el alumno en «Corrígelo»: entero, fracción o decimal exacto («3», «-5/2», «-0,125»). Fraccion o null. */
export function leerResultado(texto) {
  const r = leerExpresion(String(texto ?? '').replace(/^\s*x\s*=\s*/i, ''));
  return r.ok && r.valor.esConstante() && r.valor.b instanceof Fraccion ? r.valor.b : null;
}

export function corregirCorrige(item, escrito) {
  if (escrito.equals(resultadoBueno(item))) return { acierto: true, error: null };
  const mal = resultadoMalo(item);
  return { acierto: false, error: mal instanceof Fraccion && escrito.equals(mal) ? 'repite-el-error' : 'otro-resultado' };
}

/** Las ecuaciones de cada línea del ítem (null en las frases), para el test y para el registro. */
export function ecuacionesDe(item) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  return item.lineas.map((l, i) => (l.t ? null : l.raw ? pl.caso(item.params) : aEcuacion(l.ec)));
}

/** La explicación con los números del ítem (el error de la línea y cómo se hace bien). */
export function porque(item, idioma) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  return pl.hint(item.params, idioma);
}

/** La línea buena que habría ido en el sitio de la mala (en texto). */
export function lineaBuena(item) {
  const pl = PLANTILLA_POR_ID[item.plantilla];
  const { lineas } = pl.cadena(item.params, false);
  const l = lineas[item.falsa];
  return l.t ? { t: l.t } : { ec: l.q.aTexto() };
}

/** Las líneas de la resolución bien hecha, guardadas como las del ítem (para el «No lo sé» de «Corrígelo»). */
export function lineasBuenas(item) {
  return PLANTILLA_POR_ID[item.plantilla].cadena(item.params, false).lineas.map(guardar);
}

export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}|${item.falsa ?? 'x'}`;
export { textoLinea };

// ─── Pintar las líneas ─────────────────────────────────────────────────────────

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => String(s).replace(/[&<>]/g, c => ESCAPE[c]);
/** Una línea como HTML (letra en cursiva, fracciones con raya) o, con `html = false`, como texto plano. */
export function htmlLinea(l, idioma, html = true) {
  if (l.t) return l.t[idioma];
  if (l.raw) return html ? esc(l.raw).replace(/x/g, '<i>x</i>') : l.raw;
  return html ? aEcuacion(l.ec).aHtml() : aEcuacion(l.ec).aTexto();
}
