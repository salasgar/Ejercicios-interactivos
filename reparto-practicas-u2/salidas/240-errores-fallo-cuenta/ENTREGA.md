# ENTREGA · Tarea 240 · errores (U2): el fallo de cuenta en las columnas

Sesión: s-20261123T123904-c9b7e2ff (relevo de s-20261123T110004-4d0bcd21, que dejó el código y los tests sin
comitear, en verde; revisado contra la ficha y heredado sin cambios). Commit del código: **788ceda**.

## Ficheros
- `practicas/errores/logica.js`: `columnaDeCuenta` y el trozo de `generarColumnas` (con una sola columna mala con
  nombre, la mitad de las veces otra con un fallo de cuenta, sacada de la ruta buena con la cuenta al final, que deja
  de salir bien en el ítem); las preguntas tipo test, solo para los errores con nombre.
- `practicas/errores/textos.js`: `CUENTA` (`fallo-de-cuenta`), `CUENTAS` (por ruta: la cuenta, su valor, la última
  línea, los cercanos y los valores prohibidos), `porqueCuenta`, `TX.fallo_cuenta` y la explicación de la columna en
  `explicacionColumnas` (sin nombre ni regla en negrita: «Se ha equivocado al hacer la cuenta.», «2^2 · 3 = 12, no 13.»
  y «Lo correcto es: m.c.d.(24, 36) = 12.»).
- `tests/practicas-errores.test.js`, `tests/practicas-ayuda-errores.test.js`: dos tests nuevos y los de columnas
  adaptados (46 en verde en los dos ficheros; `npm test` 2756/2756).

## Dónde sale y cuánto (20 000 ítems del ejercicio 2, semilla 7)
- En el **9,8 %** de los ítems (la ficha pide al menos un 8 %; el test lo comprueba con 205).
- Familia **mcd** (ruta `b-mcd-ok`): 49,7 % de sus ítems. Valor ±1, ±2 (±10 si el m.c.d. llega a 20); nunca 0, 1, los
  datos, el «cruzado» (los comunes con el mayor exponente), el m.c.m. ni la potencia como producto.
- Familia **mcm** (`b-mcm-ok`): 9,3 % (casi siempre sale con dos columnas malas con nombre, y entonces no hay fallo de
  cuenta). Nunca el m.c.d., «solo los comunes», la potencia como producto, el producto de los datos ni los datos.
- Familia **horas** (`b-minutos-ok`): 50,5 %. «h + 2 = h + 3» o «h + 4» (h + 1 es el error «de cien en cien» y h, no
  sumar). Realismo: la salida es de 8 a 15 h, así que la llegada mala va de las 11 a las 19 h.
- **No** sale en las listas de divisores o de múltiplos, ni en las factorizaciones, ni en los «sí/no» de
  divisibilidad (decisión de la ficha).
- Al fallar, el registro anota `fallo-de-cuenta` (`practica.js` toma `item.columnas[fallo].error`; no cambia).

## Probada en Chrome (http://localhost:8080/practicas/errores/?probar=1&ejercicio=2)
- es, ancho: m.c.d.(24, 36) con C «= 13» — acertando (B y C marcadas; una sola pregunta, la de B) y el feedback de las
  tres columnas; m.c.d.(52, 338) con B «= 36» — fallando (solo A marcada): −1 vida y la explicación de la cuenta.
- en: GCD(12, 18) con C «= 7» — «I don’t know»: «Made a mistake in the calculation. 2 · 3 = 6, not 7.», sin regla, y «The
  mistake is in columns B and C».
- 375 px (en un marco: la ventana no se dejaba estrechar): m.c.m.(18, 15) con C «= 89»; dos columnas por fila, sin
  desplazamiento lateral.

## Cómo probarlo en 1 minuto
`npm run servir` y la URL de arriba; pulsar «No lo sé» hasta que una columna acabe en una cuenta mal hecha (1 de cada 10).
