// Casos de la hoja 2 y del examen 2 de la unidad 7 (sesión 5), solo por huella `huellaCaso` del caso normalizado por valor.
// Los de la hoja llevan su descripción; los del examen, nunca en claro (tarea 215, reabierta del 26-11-2026).

export const HUELLAS_RESERVADAS = new Set([
  'mydktq', // ej. 1 a) autocares (5, 54) y (6, 45)
  '1iy4bgp', // ej. 1 b) gastado y lo que queda (6, 24) y (12, 18)
  '12bd8re', // ej. 1 c) libro (10, 18) y (20, 9)
  '1ximiom', // ej. 4 A) (2, 9), (3, 6), (6, 3)
  '1r7811g', // ej. 4 B) (5, 25), (10, 20), (15, 15)
  '1bkyi58', // ej. 4 C) (12, 40), (16, 30), (24, 20)
  '1ae4wvx', // apoyo: regalo de 42,00 €, 2, 3 y 6 amigos
  '1r77xm', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '14ay9j4', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '1rbj8zy', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  'frr85h', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '1hdzyn3', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '1ee2cp9', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '1fa1ane', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  'hv5z5w', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '12xasgq', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  'iidvwv', // ej. 3) camiones, 2, 3, 4, 6 y 8 (96 viajes)
  '1cgo8tu', // ej. 4 A) grifos 2, 3, 6 y 9, 6, 3 h
  '1oe5w5y', // ej. 4 C) 12, 16, 24 km/h y 40, 30, 20 min
  'vzm7dg', // apoyo: 5 limpiadores, 8 h → 4
  '1uw7feg', // apoyo: 5 limpiadores, 8 h → 4
  'cr0qvi', // ej. 5 a) 4 pintores, 9 días → 6
  '2ryuuv', // ej. 5 b) 6 grifos, 14 h → 7
  'o21u88', // ej. 5 b) 6 grifos, 14 h → 7
  '11zeyow', // ej. 5 c) 8 jardineros, 15 días → 10 días
  'dan3h6', // ej. 5 c) 8 jardineros, 15 días → 10 días
  '45825', // ej. 6) 6 pintores, 12 días → 3
  '18uhyb7', // ej. 7 a) 12 caballos, 36,00 € al día → 15
  '1q2a8aj', // ej. 7 b) 12 caballos, 25 días → 15
  'mxlyyx', // ej. 8 a) 3 kg, 4,80 € → 7 kg
  'qao8nx', // ej. 8 b) 80 km/h, 3 h → 120 km/h
  '159umfb', // ej. 8 b) 80 km/h, 3 h → 120 km/h
  '1lrf0l6', // ej. 8 c) 4 personas, 2 huevos → 10
  '1yycufx', // ej. 8 d) 10 máquinas, 9 h → 6
  '1ghcw39', // ej. 8 d) 10 máquinas, 9 h → 6
  'xvz3ya', // ej. 9 a) 6 máquinas, 2 h 20 min → 4
  '1ubyck6', // ej. 9 a) 6 máquinas, 2 h 20 min → 4
  'o46umj', // ej. 9 b) 3 cocineros, 2 h 40 min → 4
  '4bpzx4', // ej. 9 b) 3 cocineros, 2 h 40 min → 4
  '1cvcw16', // ej. 9 c) 100 km/h, 1 h 12 min → 90 km/h
  '12vq3lf', // ej. 9 c) 100 km/h, 1 h 12 min → 90 km/h
  '11zr2jv', // ej. 10 a) 10 perros, 4 semanas → 14
  '1jcq0vd', // ej. 10 a) 10 perros, 4 semanas → 14
  '1yl46cm', // ej. 10 b) 10 perros, 4 semanas → 8
  '3ia8s8', // ej. 10 b) 10 perros, 4 semanas → 8
  '10i9675', // examen 2
  '10wgj39', // examen 2
  '1168dv7', // examen 2
  '14klvgj', // examen 2
  '151bjhe', // examen 2
  '1595724', // examen 2
  '17w4tx6', // examen 2
  '18ym7lw', // examen 2
  '1923zw4', // examen 2
  '19wk2rn', // examen 2
  '1a6byf4', // examen 2
  '1amkvl9', // examen 2
  '1dwhn6s', // examen 2
  '1jzatvw', // examen 2
  '1mh22k9', // examen 2
  '1oj6mai', // examen 2
  '1p2g6x4', // examen 2
  '1ub0d5j', // examen 2
  '1vlatui', // examen 2
  '1voemsz', // examen 2
  '1vw72wv', // examen 2
  '1vyla4b', // examen 2
  '1w8larv', // examen 2
  '1wy0fnv', // examen 2
  '1x7jkte', // examen 2
  '40mmpq', // examen 2
  '730mzi', // examen 2
  'adqsy0', // examen 2
  'bqsjbv', // examen 2
  'c6yt4n', // examen 2
  'c7pija', // examen 2
  'e5kdyg', // examen 2
  'eyqei4', // examen 2
  'h4wn4v', // examen 2
  'i4yeai', // examen 2
  'iobc6q', // examen 2
  'l7vn5j', // examen 2
  'o5m5th', // examen 2
  'qie8vl', // examen 2
  't39bgp', // examen 2
  'tbcn7z', // examen 2
  'wga7vd', // examen 2
  'xg7hns', // examen 2
  'z3xtgw', // examen 2
  '55de24', // examen 2 (repaso, problema directo del ej. 4)
  '11gnldz', // examen 2 (repaso, problema directo del ej. 4)
  '1ta45az', // examen 2 (repaso, problema directo del ej. 4)
  '6kox7b', // examen 2 (repaso, problema directo del ej. 4)
  '1tk9794', // examen 2 (repaso, problema directo del ej. 4)
  '1frg6kr', // examen 2 (repaso, problema directo del ej. 4)
  '87ylu3', // examen 2 (repaso, problema directo del ej. 4)
  '1m5jzl2', // examen 2 (repaso, problema directo del ej. 4)
]);
