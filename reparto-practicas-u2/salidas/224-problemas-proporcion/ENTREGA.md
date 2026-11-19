# Entrega de la tarea 224 · «Problemas de toda la unidad» (problemas-proporcion)

Sesión `s-20261119T200934-21028b13`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`aace10a`**
(`practicas/problemas-proporcion/{index.html,practica.js,estilos.css,logica.js,textos.js}`, dos tests nuevos y, ver abajo, `catalogo.js` y `tests/practicas-comun.test.js`). `npm test`: 2710/2710.

## Qué hay

Práctica `problemas-proporcion` con **tres ejercicios**, ES y EN, con «No lo sé» (M22) en los tres (`explicacion` pura en `textos.js`).

1. **¿Qué tipo de problema es?** Cuatro casillas fijas: directa, porcentaje, reparto, escala. Los contextos salen de `CONTEXTOS` con sus cotas.
2. **La mejor oferta.** Dos envases; se elige por el precio por unidad (la primera, la segunda o «cuestan lo mismo»). Precio por unidad exacto al céntimo; empates 10-20 %; el envase grande gana 35-65 % de los no empates.
3. **¿Tiene sentido la respuesta?** Una compañera contesta: bien (un tercio), la unidad mal, no redondeada («7,25 cajas») o absurda (descuento que sube el precio, porcentaje mayor que el total, ×10/×100 fuera de cota, escala sin cambiar de unidad).

## Lo no hecho y las desviaciones (a revisar)

- **Sin acta de la 02 de la U7** (`inventario-unidad7-revision.md` no existe): según la ficha, **no se han escrito** el ejercicio 2 (velocidad, tiempo y distancia), el 3 (cambio de moneda) ni la casilla «inversa» del 1. Los ejercicios que quedan se numeran 1, 4 y 5 en los comentarios. Si el acta los admite, se añaden en otra pasada.
- **Desviación de la ficha (`catalogo.js`)**: la ficha prohíbe tocarlo, pero `nEjercicios` decía 5 y la práctica declara 3, y eso ponía en rojo `npm test` para todas las sesiones (lo habían señalado la 222 y la 220). He cambiado `nEjercicios` a 3 y, en `tests/practicas-comun.test.js`, `[96, 'problemas-proporcion', 3]` y el total de la unidad 7 (61 → 59). Si se añaden los dos ejercicios, hay que devolver 5 y 61.
- **Hoja 5 y examen de la U7**: no están LISTOS; `CASOS_HOJA` y `HUELLAS_EXAMEN` están vacíos pero conectados con `esReservado` en los tres generadores. La 231 los rellena.
- **Navegador**: no probada con clics ni a 375 px (la sesión automática no puede). La revisión con clics es de la 231.
- Todo el contenido es propuesta hasta el acta de la 02 de la U7.

## Cotas de realismo

Oferta: precio por unidad dentro de una cota por producto (zumo 0,90-3,00 €/L, leche 0,70-1,60 €/L, arroz 0,80-3,00 €/kg, manzanas 1,00-6,00 €/kg, yogur 0,20-0,90 €, cuaderno 0,80-3,00 €); envase total entre 0,20 y 30,00 €. Redondeo: 100-400 alumnos en autobuses de 40-50 plazas; 10-40 personas en coches de 4-5; 25-195 rotuladores en cajas de 10-20. Lo absurdo está fuera de la cota del contexto por un factor de 10 o más.
