# ENTREGA · Tarea 244 · errores7: el fallo de cuenta en las columnas

Sesión: s-20261123T110212-cffcecef · commit **4120434** · 2026-11-23T12:15:56Z

## Ficheros (git show --stat 4120434)
- practicas/errores7/logica.js (+98: `CUENTA`, `CERCANOS`, `OTROS_CON_NOMBRE`, `cuentasConNombre`, `numerosDe`, `columnaDeCuenta`, `cuenta(p)` en cada ruta buena, `generarDonde`, `claveItem`)
- practicas/errores7/textos.js (`TX.fallo_cuenta`; `explicacionColumnas` sin nombre ni regla en esa columna)
- tests/practicas-errores7.test.js (test nuevo del fallo de cuenta y el de «5 · 1 km»; los de columnas, adaptados)
- tests/practicas-ayuda-errores7.test.js («No lo sé»: `TX.fallo_cuenta` y sin regla en esa columna)

## Qué hace
En el ejercicio 1 (columnas), cuando el ítem lleva **una** columna mala con nombre y queda alguna ruta buena sin usar,
con probabilidad 0,8 se añade una columna con un **fallo de cuenta**: esa ruta buena con la **última cuenta** mal
hecha. Se marca como las demás (entra en `solucion`), no lleva pregunta tipo test y su explicación es «Se ha
equivocado al hacer la cuenta.» + la cuenta bien hecha («6 · 4,00 € = 24,00 €, no 23,00 €.») + «Lo correcto es:» con
la línea buena. Al fallar en ella se registra `error: 'fallo-de-cuenta'` (practica.js ya pasaba `col.error`).

## Cotas de realismo del resultado equivocado
- Euros (directa, descuento, porcentaje de dinero): ±0,10 € o ±1 €.
- Alumnos (porcentaje de un centro): ±1 o ±2, siempre entero.
- Km (escala): ±0,1 km o ±1 km.
- Siempre positivo y a menos de la mitad del bueno de distancia (con 2 alumnos no hay fallo de cuenta).

## Nunca un error con nombre
El valor malo no puede ser: el resultado de ninguna columna posible de la familia (buenas y malas, salgan o no);
los errores del catálogo con los números del problema que no son columnas (`sumar-el-porcentaje-como-numero`,
`precio-final-por-descuento`, `escala-al-reves`, `subir-por-bajar`); la última cuenta con otra operación
(«3 · 2,00 € = 5,00 €» sería «Ha sumado en vez de multiplicar»; «5 · 1 km = 6 km» o «= 4 km», igual; la división
al revés); el bueno por o entre 10, 100 o 1000; ni un número que ya sale en la columna («Ha contestado otra cosa»).
Si no queda ningún valor seguro, el ítem va sin fallo de cuenta.

## Frecuencia (3000 ítems, semilla 31)
- Total: 826 de 3000 ítems, **27,5 %**.
- Por familia: directa 346/1072 (32 %), porcentaje 284/875 (32 %), escala 102/328 (31 %), descuento 94/725 (13 %:
  solo dos rutas buenas, así que solo cuando sale una columna buena).
- Sale de las diez rutas buenas.

## Tests
`node --test tests/practicas-comun.test.js tests/practicas-errores7.test.js tests/practicas-ayuda-errores7.test.js`:
74/74. `npm test`: 2756/2756.

## Probada en Chrome
http://localhost:8080/practicas/errores7/?probar=1&ejercicio=1 :
- es, 1200 px: «560,00 € : 100 · 50 = 279,00 €» (C, cuenta) y «= 560,00 € : 50» (D, con nombre); marcando las dos y
  contestando solo la pregunta de D → acierto (1/10); explicación de C sin regla en negrita.
- en, 375 px: «6 · €36.00 = €215.00» (A, cuenta) sin marcar → fallo; «Made a mistake in the calculation.» y
  «6 · €36.00 = €216.00, not €215.00.»
- en, 375 px: «90% of €150.00 = €135.10» → «I don’t know»: la tarjeta explica la C sin regla y la B con la suya.

## Cómo probarlo en 1 minuto
`npm run servir`, abrir la URL de arriba, recargar hasta ver una columna buena con el último número cambiado
(1 de cada 4 ítems), marcar su última línea y la línea mala de la otra columna mala: solo pregunta por esta.
