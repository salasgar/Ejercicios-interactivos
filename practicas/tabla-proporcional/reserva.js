// Casos de la hoja 1 y del examen 1 de la unidad 7, solo por huella FNV-1a del caso normalizado por valor
// (`huellaCaso` de ../_comun/proporcion.js). Los de la hoja llevan su descripción; los del examen, nunca en claro.
// Calculados sobre todo el espacio de cada generador (tarea 213, reabierta del 26-11-2026).

export const HUELLAS_RESERVADAS = new Set([
  // Hoja 1
  '1fl9pbl', // recuadro: 3 latas 2,70 € y 5 latas 4,50 € (0,90 € cada una)
  '6t6wou', // tabla A: manzanas, 2, 3 y 5 kg a 1,70 € el kilo
  '4l1n0m', // tabla C: bolígrafos, 3, 6 y 10 a 1,30 €
  '1lpjwjy', // ej. a): aceite, 2 botellas 11,80 € (5,90 € cada una)
  'w10klp', // ej. b): aparcamiento, 3 h 5,70 € (1,90 € la hora)
  'gezr97', // ej. c): patatas, 4 kg 3,60 € (0,90 € el kilo)
  // Examen 1
  '1aoxp36', '173ytmr', '1vvzfd2', 'eqpwjo',
  'id3492', 'g0etuf', '2cbyce', 'kvzlgk',
  // Hoja 2 (dos columnas)
  '9sh9fc', // ej. 7 a): 12 caballos, 36,00 € al día → 15
  '6ev2c6', // ej. 8 a): 3 kg, 4,80 € → 7 kg
  'q5op8l', // ej. 8 c): 4 personas, 2 huevos → 10
  // Examen 2: tres ejercicios con dos columnas y el precio por unidad con una
  'mtr036', 'pkhdnq', '78qvoz', '2hwwcc', 'bppisu', '21sl89',
  '12jtyyf', 'xo55lw', '1w4qy6u', '1bumml2',
  // Repaso del examen 3 (tabla directa con las dos columnas de un problema)
  '15cyj0f', '18spygm', 'fhlbba', 'u4jy79',
]);
