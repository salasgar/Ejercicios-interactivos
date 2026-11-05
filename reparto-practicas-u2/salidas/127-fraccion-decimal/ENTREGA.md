# Entrega de la tarea 127 · «De fracción a decimal y vuelta» (`fraccion-decimal`, id 61)

Sesión `s-20261105T234253-d771589f`, 2026-11-06. Commit del código: **`58c891b`**.

## Ficheros
`practicas/fraccion-decimal/{index.html, practica.js, logica.js, textos.js, estilos.css}` y `tests/practicas-fraccion-decimal.test.js` (16 tests, 3000 ítems por ejercicio, BigInt aparte del generador). `disponible: false`: sin publicar (la publica la 131, semana 2).

## Ejercicios y destrezas
| # | Nombre | Destrezas | Qué hace |
|---|---|---|---|
| 1 | De fracción a decimal | U5-2C-08 (y 2C-05), U5-2C-11 | escribir (35 %), elegir 4 (40 %), «¿exacto o periódico?» (13 %), elegir el periódico con «…» (12 %); decimal exacto hasta milésimas (den 2, 4, 5, 8, 10, 20, 25, 40, 50, valor ≤ 3); periódicos solo den 3, 6, 9, con tres cifras y «…», sin arco |
| 2 | De decimal a fracción | U5-2C-10 | siempre «forma irreducible»; elegir 4 (55 %) o escribir numerador y denominador; 1-3 cifras decimales, < 5; las impropias se quedan impropias |
| 3 | Los que hay que saberse | U5-2C-09 | seis parejas, tocar fracción y luego decimal; 3-5 de las seis de memoria y el resto de 12 «extras» |
| 4 | ¿Fracción o decimal? | U5-2C-12 | `<`, `=`, `>`; 17 % iguales, ~23 % con periódico (2/3 y 0,67), el resto exactas con decimal cercano |

Errores con nombre: los de `ERRORES_TIPICOS` de la base (`fraccion-al-reves`, `numerador-como-decimas`, `periodico-por-redondeo`, `decimas-por-centesimas`, `denominador-equivocado`) y 13 propios en `ERRORES_PROPIOS`. Cada fallo va a `api.responder` con `error` y `respuesta`.

## Lo que hay que saber
- **Regla de oro**: en el ej. 2 la fracción «sin simplificar» (75/100) vale lo mismo que la buena y es distractor **solo** porque el enunciado pide la irreducible (acta, punto k); es la única excepción y el test la comprueba (a lo sumo una, con su error, y simplificable).
- **Casos de la hoja 2 excluidos en claro**: fracciones del ej. 1 (conversiones y ejemplos del recuadro), decimales del ej. 5 y del recuadro, parejas fracción-decimal del ej. 2b/2c. **Examen**: no existen `casos-examen-semanaN.tsv`; se excluyen por huella FNV-1a (`HUELLAS_EXAMEN`, 5 huellas) los casos que citan `examen-final/ESPECIFICACIONES.md` (ej. 2d y 2e) y una idea de la propuesta de la semana 2. **La 131 debe cotejar** cuando existan los exámenes y añadir huellas (el conjunto está exportado). Aviso: 3/4 y las otras cinco de memoria **son** el ej. 1b de la hoja; el ej. 3 no puede evitarlas, así que cada ítem lleva siempre al menos un «extra» y nunca es exactamente el de la hoja.
- Nombre del ejercicio 4: «¿Fracción o decimal?» (sugerencia de la ENTREGA 122, punto 6), en vez de «¿Cuál es mayor?». Es un nombre, no cambia el catálogo.
- Realismo: no hay contextos; los valores están acotados (fracción ≤ 3, decimal ≤ 3,6 en el ej. 4, denominadores ≤ 1000).

## Propuestas (no decididas)
1. Ficha 127 dice sesión 6; por el acta, fracción→decimal es de la 5 y decimal→fracción de la 6 (ENTREGA 122, punto 7). No cambia nada.
2. Sin ítem de «0,5 de 40» (el acta no lo recoge).
3. Si la 128 (`errores5`) necesita errores de esta práctica (`numerador-como-decimas`, `denominador-como-decimas`), conviene subirlos a la base.

## Cómo probarlo en 1 minuto
`node --test tests/practicas-comun.test.js tests/practicas-fraccion-decimal.test.js` (62 en verde); `npm test` 1569/1569. En el navegador: `npm run servir`, http://localhost:8080/practicas/fraccion-decimal/ → «Probar sin código» (o `?ejercicio=3`). Probada en ES y EN, a 375 px sin desbordes, un ítem acertado y uno fallado de cada ejercicio.
