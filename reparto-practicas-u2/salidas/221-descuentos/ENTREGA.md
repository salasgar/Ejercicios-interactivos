# Entrega de la tarea 221 · «Descuentos y aumentos» (descuentos)

Sesión `s-20261119T195945-9646472c`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`8114798`**
(`practicas/descuentos/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2673/2673.

## Qué hay

Práctica id 93, `disponible: false` (la publica la tarea de publicación de su semana), cinco ejercicios, en ES y EN. Dinero en céntimos enteros; todo precio cumple P · p % 100 = 0 y nunca es 100,00 € (donde «restar p euros» daría lo mismo que el p %).

1. **En dos pasos.** Descuento (10-70 %) o aumento (5-20 %, una de cada cuatro) y precio final, dos campos. Errores con nombre: campos cambiados, restar/sumar el porcentaje como euros, signo cambiado, quedarse en el descuento, dividir entre 1 000. «No lo sé».
2. **En un paso.** Mitad: elegir el multiplicador (0,80 / 0,20 / 1,20 / 0,08; 1,05 / 0,05 / 1,5 / 0,95; sin el 50 % por la coincidencia 0,50) con cuatro valores distintos; mitad: precio final por calculadora mental.
3. **El IVA.** Solo 4, 10 y 21 % según el producto (libro, fruta; cine, menú, tren; ropa, móvil, videojuego, bicicleta), siempre con el tipo en el enunciado y nunca al revés. «No lo sé».
4. **¿Qué piden?** Cuatro importes: el pedido (descuento/IVA o precio final) y los errores con nombre; sin el 50 %.
5. **Caza el error.** Sube y baja (o baja y sube) 5-20 %, precio múltiplo de 100 €: dos campos (después del primer cambio, final). Error: escribir el precio inicial; el feedback calcula el segundo porcentaje sobre el precio nuevo. «No lo sé».

## Tests

`tests/practicas-descuentos.test.js` (7 pruebas, 3000 ítems por ejercicio): valores por una segunda vía con BigInt, cotas por producto, opciones distintas por valor, errores nombrados, variedad ≤ 10 %, textos sin ×, sin «antes de la rebaja» ni encadenados fuera del ej. 5. `tests/practicas-ayuda-descuentos.test.js`: 1000 ítems × 2 idiomas con las cuentas y la solución en la explicación.

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado la página con clics ni a 375 px (la sesión automática no puede). Lo mira la tarea de publicación.
- **Hoja, examen y acta**: el 19-11 no existían la hoja 3, el examen 3 ni el acta; no se ha excluido ningún caso de examen. La publicación tiene que hacerlo con `claveDe` (ej. 1: prod|P|p; ej. 3: prod|P; ej. 5: prod|orden|p|P).
- Ej. 3 y 5 (y el «precio antes de la rebaja», que no está) siguen pendientes de acta: el método (p ÷ 100 · precio, luego restar o sumar) es PROPUESTA hasta que la haya.

## Propuestas

- Cuando haya acta, el ej. 4 admite ítems de «¿cuánto cuesta ahora?» con el 50 % usando valores que no coincidan.
