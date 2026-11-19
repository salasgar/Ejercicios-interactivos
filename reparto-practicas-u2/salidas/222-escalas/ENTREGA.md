# Entrega de la tarea 222 · «Escalas» (escalas)

Sesión `s-20261119T200932-4c6bd15b`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`6845905`**
(`practicas/escalas/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). Tests propios: 8 + 5 en verde. `npm test`: 2684/2686; los dos fallos son de `problemas-proporcion` (práctica de otra sesión con reclamo vivo: declara 3 ejercicios y el catálogo dice 5), no de esta.

## Qué hay

Práctica `escalas`, cuatro ejercicios, ES y EN, entrada solo por URL (`disponible` lo cambia la 230). Medidas en mm enteros y fracciones exactas; ninguna escala aplicada a un área. El cambio de unidad sale siempre a la vista, en el feedback y en la explicación.

1. **Del plano a la realidad.** Medida del plano en cm y escala 1 : N; se pide la medida real en la unidad del contexto (campo con unidad, acepta `3,5 m`, `350 cm`). Errores con nombre: sin cambio de unidad, dividir en vez de multiplicar, un salto de más o de menos. «No lo sé».
2. **De la realidad al plano.** Al revés, en cm. Errores: multiplicar en vez de dividir (se omite si el valor excede 10⁹), sin cambio de unidad, un salto. «No lo sé».
3. **¿Qué escala?** Cuatro escalas distintas por valor; error de razón invertida (N : 1).
4. **Elige la escala sensata.** Una opción da un dibujo de 5 a 30 cm; las otras, de menos de 1 cm o de más de 60 cm. Feedback con «menos de 1 cm» en vez de un decimal de tres cifras.

## Cotas de realismo

Plano de 5 a 300 mm; dibujo sensato de 5 a 30 cm; absurdo por debajo de 1 cm o por encima de 60 cm; familias plano, mapa y maqueta con medidas propias de cada objeto (`OBJETOS`, `BANCO_ENCAJA`).

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado la página con clics ni a 375 px (la sesión automática no puede). Lo mira la 230.
- **Hoja 4 y examen 4**: el 19-11 no estaban LISTOS (tareas 10 y 23 del reparto de la U7 sin terminar). No se ha excluido ningún caso: `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero conectados con `esReservado` en los tres generadores; la 230 los rellena con la huella `obj|D|pmm` (`claveBase`) y `obj|rmm|D` (ej. 4).
- Todo el contenido es propuesta hasta el acta de la 02 de la U7.
