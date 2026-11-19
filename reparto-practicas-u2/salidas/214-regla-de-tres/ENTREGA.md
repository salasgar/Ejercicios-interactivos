# Entrega de la tarea 214 · «Problemas de proporcionalidad directa» (regla-de-tres)

Sesión `s-20261119T191935-a6526529`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`75f14cc`**
(`practicas/regla-de-tres/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2559/2559.

## Qué hay

Práctica id 86, `disponible: false` (la publica la 227), cuatro ejercicios sobre los nueve contextos directos de `proporcion.js`
(frutería ×2, receta ×3, consumo del coche, gasolinera, cuadernos, entradas de cine):

1. **¿Cuánto cuesta 1?** Dos casillas: lo que vale 1 y lo que piden. (No sale el coche ni los huevos: «1 km» o «1 huevo» no se compra.) «No lo sé».
2. **¿Qué planteamiento?** Cuatro planteamientos con la x; solo uno es el bueno. Los otros tres son la x en la columna que no es,
   la proporción cruzada y sumar en vez de multiplicar. Los cuatro dan valores distintos (lo comprueba el test).
3. **Resuelve y contesta.** El número y su unidad (tres botones); sale en las dos direcciones (con más, más; y «con cuánto» al revés
   de la pregunta). «No lo sé».
4. **¿Tiene sentido?** Una solución dada y cuatro motivos: «sí», «va al revés», «unidad equivocada» o «número demasiado grande».
   Cada motivo es inequívoco: el de la unidad solo sale si el valor es creíble en la unidad del otro lado.

Ids de destreza (PROPUESTA de la 211, F0 sin firmar): U7-1A-01, 1A-02, 1A-04, 1A-05, 1C-10, 1C-13. Si F0 los cambia, lo pone al día la 227.

## Tests (`tests/practicas-regla-de-tres.test.js` y `tests/practicas-ayuda-regla-de-tres.test.js`)

3000 ítems por ejercicio dentro de la cota de su contexto y exactos; k = b : a (por cada 100 km en el coche) y d = b · c : a por
segundas vías; ej. 2 con cuatro valores distintos y uno solo bueno; ej. 3 con la solución de cada dirección y su unidad; ej. 4 con
cada motivo comprobado en valor, unidad y cota; variedad (ninguna clave pasa del 10 %); textos sin `×`, `%`, «inversa», NaN ni
undefined en ES y EN; explicaciones («No lo sé») con la solución calculada con `logica.js`, 1000 ítems por ejercicio e idioma.

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado la página con clics ni a 375 px (la sesión automática no puede abrir servidor ni Chrome, como en la 211). Lo mira la 227 al publicar.
- No hay hoja ni examen del paquete 1 en el reparto de la U7 (ni acta de la 02): el método (reducción a la unidad en el ej. 1) y
  tomar «la unidad» como una opción de error son PROPUESTAS; la 227 las contrasta.
- Revisión de realismo hecha a mano con los textos de 3000 ítems por contexto, y cota propia de cada contexto (la de `proporcion.js`).
- La inversa no sale con ese nombre: el ej. 3 la plantea como la pregunta al revés, y los textos de error no usan «inversa».
