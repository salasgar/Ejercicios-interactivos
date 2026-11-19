# Entrega de la tarea 219 · «El tanto por ciento de una cantidad» (tanto-por-ciento)

Sesión `s-20261119T194015-4ba838ab`, 2026-11-19 (lanzador automático, sin nadie mirando). Commit del código: **`a7be4f3`**
(`practicas/tanto-por-ciento/{index.html,practica.js,estilos.css,logica.js,textos.js}` y dos tests nuevos). `npm test`: 2580/2580.

## Qué hay

Práctica id 91, `disponible: false` (la publica la 227), cuatro ejercicios; solo se pide la parte (el p % de N), todo exacto
(p · N múltiplo de 100):

1. **De cabeza**: 1, 2, 3, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75 y 90 % de N con N en 20-800 y múltiplo de lo que hace exacta la cuenta (U7-3A-01, 3C-02). «No lo sé» con el atajo.
2. **Con el decimal**: el resto de porcentajes (1-99), un tercio de ellos de una cifra (el 8 % es 0,08); solo se mira el resultado (U7-3C-04). «No lo sé».
3. **¿Qué operación?**: cuatro cuentas sin hacer (decimal, fracción `15/100 · 80` u «80 : 100 · 15»); tres errores con nombre de valor distinto (U7-3C-05). Sin «No lo sé» (elección).
4. **Problemas**: contextos de «la parte» del banco (clase, encuesta, club, tiros, test, ahorros), p entre 5 y 95, personas enteras, dinero con dos decimales; respuesta con su unidad (U7-3C-02, 3C-04). «No lo sé».

Ids de destreza: PROPUESTA de la 211 (F0 sin firmar); si cambian, los pone al día la 227.

## Tests

3000 ítems por ejercicio (exactitud por BigInt, ej. 3 con una sola cuenta buena y cuatro valores distintos y decimales exactos, ej. 4 dentro de cota, sin personas partidas, variedad ≤ 10 %); explicaciones de 1000 ítems por ejercicio e idioma con la solución, sin «×», con «%» bien escrito (ES con espacio duro, EN pegado) y acabadas en «La respuesta es»/«The answer is».

## Lo provisional y lo no hecho

- **Navegador**: no se ha probado con clics ni a 375 px (la sesión automática no abre servidor ni Chrome). Lo mira la 227 al publicar; ojo a la opción `15/100 · 80` del ej. 3 (fracción con raya).
- No hay hoja ni examen del paquete 1 con casos de este tema en el reparto de la U7 (ni acta de la 02): los métodos (atajos del 10 % y del 1 %, decimal) son PROPUESTAS; la 227 las contrasta. Los casos de «qué porcentaje es» y de totales/descuentos (otras sesiones) no están.
- Revisión de realismo con las cotas del banco `proporcion.js` y p entre 5 y 95 en los problemas.
