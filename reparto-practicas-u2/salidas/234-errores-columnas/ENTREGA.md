# ENTREGA · Tarea 234 · «Caza el error» (U2, errores): ejercicio 2 en columnas

Sesión: s-20261122T121724-12f10dae · Commit del código: `31c9710` · 2026-11-22

## Ficheros entregados (`git show --stat 31c9710`)

- `practicas/errores/logica.js` — familias, `columnaDe`, `columnasPosibles`, `generarColumnas` (sustituye a `generarLinea`).
- `practicas/errores/textos.js` — `RUTAS` (19 rutas propias de las columnas), textos del ejercicio 2 (`introduccion_columnas`,
  `comprobar`, `col_bien`, `col_mal`, `columna`, `pregunta_col`, `la_linea_es`), `LETRAS`, `explicacionColumnas`
  (feedback) y `explicaColumnas` (tarjeta del «No lo sé»). Fuera `explicaLinea` y su regla, que eran solo del ejercicio 2 antiguo.
- `practicas/errores/practica.js` — `montarColumnas` (modelo: `montarDonde` de errores3) y el enunciado para la traducción con `columnasFijas`.
- `practicas/errores/estilos.css` — `.instruccion--siguiente`.
- `tests/practicas-errores.test.js`, `tests/practicas-ayuda-errores.test.js`.

Los ejercicios 1 y 3 no cambian (su banco sigue siendo de 28 plantillas). `practicas/_comun/` no se ha tocado.

## Cómo es el ejercicio 2

El enunciado una vez arriba (sin poderse pulsar) y debajo de 2 a 4 columnas, una por alumno: 1-2 bien, hechas de formas
distintas, y 1-2 con un error (errores distintos). No se dice cuántas están mal. El alumno toca en cada columna mala la
**PRIMERA** línea mala (aquí las líneas son frases, y en una columna mala las líneas que siguen al error se deducen de
él: por eso la instrucción dice «primera», como el ejercicio antiguo) y pulsa «Comprobar»; si acierta, una pregunta tipo
test por cada columna mala («¿Qué error hay en la columna B?») con el nombre bueno y dos de `NOMBRES` que no están en
`nombresExcluidos` de esa ruta (ni excluidos ni confundibles). Una sola llamada a `api.responder`, `espera: 'boton'`. En
el feedback y en la tarjeta, la línea mala se **cita** («El error está en esta línea: …»), sin ordinal: en una columna,
«la segunda línea» contaría el enunciado, que va arriba. Cada columna mala lleva el error como frase, la regla rota en
negrita (`regla-rota`) y lo correcto; cada buena, su porqué.

## Familias (10) y rutas

| Familia | Enunciado | Bien | Mal |
|---|---|---|---|
| mcd | Calcula el m.c.d. (pares con todos los primos comunes) | `b-mcd-ok` (descomposición), `c-mcd-divisores` (lista de divisores comunes) | `e-cruzado` |
| mcd-1 | Calcula el m.c.d. (pares sin primos comunes) | `c-mcd-1-divisores`, `c-mcd-1-primos` | `e-mcd-cero` |
| mcm | Calcula el m.c.m. (pares con algún primo no común) | `b-mcm-ok`, `c-mcm-multiplos` (solo si el m.c.m. ≤ 7 veces el menor: 12 y 10, 18 y 15, 75 y 30) | `e-mcm-comunes`, `c-mcm-cruzado` (la regla del m.c.d. usada para el m.c.m.) |
| factoriza | Descompón n en factores primos | `c-arbol-1`, `c-arbol-2` (dos árboles distintos = dos columnas), `b-orden-factores`, `c-divisiones` (divisiones sucesivas) | `e-sin-terminar` |
| div3 | ¿Es n divisible entre 3? (no lo es; acaba en 3, 6 o 9) | `c-div3-suma`, `c-div3-division` | `e-ultima-cifra-3` |
| div3y9 | ¿Es n divisible entre 3? ¿Y entre 9? (múltiplo de 3, no de 9) | `b-criterio-3-no-9`, `c-3y9-division` | `c-3y9-tres-nueve`, `c-3y9-ultima-cifra` (solo si la última cifra da la respuesta equivocada: 21, 24, 57…) |
| divisores | Escribe todos los divisores de n | `b-divisores-ok` (parejas), `c-divisores-probando` (dividir de 1 a n) | `e-olvida-1-n` o `e-olvida-n` (el mismo error: sale una) |
| primo | ¿Es n un número primo? (impar compuesto) | `b-impar-no-primo`, `c-primo-divisores` | `e-impar-primo` |
| horas | Sale a las … y tarda … minutos. ¿A qué hora llega? | `b-minutos-ok`, `c-minutos-horas-primero` (85 min = 1 h 25 min primero), `c-minutos-hasta-la-hora` (hasta la hora en punto y el resto) | `e-minutos` |
| relacion | ¿Qué relación hay entre a y b? | `c-relacion-multiplo`, `c-relacion-divisor` (división exacta) | `e-multiplo-divisor-a` o `-b` (el mismo error: sale una) |

**Fuera del ejercicio 2** (siguen en el 1 y el 3): `e-potencia` y `e-trozos` (con ese enunciado no hay dos formas buenas
que no sean la misma con otras palabras), `b-mcd-hcf`, `b-lcm-nombres`, `b-razonable` y `b-divisible-por` (no resuelven
el ejercicio: comentan el nombre o el resultado; `b-divisible-por` además solo es «otra forma» en español) y
`b-factores-11-13` (es un árbol: lo cubren `c-arbol-1/2`). Ningún error nuevo: las rutas malas propias usan nombres que ya
estaban en `NOMBRES` (`cruzado`, `tres9`, `ultimaCifra3`).

Decisiones de contenido (banda ALTO, «qué cuenta como otra forma correcta»):
- Una ruta buena es otro **procedimiento** (descomposición / lista de divisores / divisiones), no la misma cuenta con
  otras palabras. El orden de los factores y los dos árboles sí cuentan: son justo lo que parece error y no lo es.
- Ninguna línea de una columna buena escribe una igualdad falsa: las divisiones con resto se dicen con palabras («el
  cociente es 47 y el resto es 2»), nunca «143 : 3 = 47»; las horas, «Una hora después de las 9:50 son las 10:50», no
  «9:50 + 1 h =».
- `c-3y9-ultima-cifra` solo sale cuando el criterio equivocado da la respuesta equivocada: con 33 o 30 acertaría por
  casualidad y la columna «mala» llegaría a lo correcto.
- Horas: `m + d > 120` en esta familia (sin «2 horas y 0 minutos»).

## Reparto real en 3000 ítems (semilla 234)

- 2 columnas: 1056 · 3 columnas: 1762 · 4 columnas: 182 (64,8 % con 3 o 4).
- bien+mal: 1+1 1056 · 2+1 1473 · 1+2 289 · 2+2 182.
- Por familia: mcd 262, mcd-1 247, mcm 476, factoriza 250, div3 270, div3y9 494, divisores 248, primo 245, horas 262,
  relacion 246 (mcm y div3y9 con peso 2: son las que dan 4 columnas).

## Tests

- `node --test tests/practicas-comun.test.js tests/practicas-errores.test.js tests/practicas-ayuda-errores.test.js`: 95/95.
  `npm test` (antes del commit): 2732/2732.
- Nuevos: cada columna de 3000 ítems por fuerza bruta (verificadores independientes en el test para las 19 rutas
  propias; las buenas, todas sus líneas verdaderas; las malas, exactamente su línea); 1-2 bien y 1-2 mal, sin columnas
  ni errores repetidos; salen todas las familias y **todas las rutas** de cada una; 3-4 columnas en más del 30 %;
  preguntas (regla de oro, la buena en las tres posiciones); el ejemplo de la introducción (12 y 18); las buenas llegan
  al mismo resultado; las horas, creíbles; feedback y tarjeta columna a columna en es y en, sin ordinales ni «Se llama».

## Cómo probarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/errores/?c=AJJN&ejercicio=2 (con `&idioma=en` para el inglés).
Marcar la línea mala de cada columna mala → «Comprobar» → nombrar los errores; y probar marcando una columna buena.

**NO probado en el navegador.** La prueba con Chrome headless (servidor local + CDP, perfil temporal) la denegó el
clasificador de permisos de la sesión automática y no la he rehecho por otra vía. Lo que sí está comprobado: los tests,
que los módulos enlazan (importar `practica.js` en Node solo falla por la falta de `document`) y que `montarColumnas`
copia `montarDonde` de errores3, que ya se probó en Chrome en la fase 1. Pendiente de Juan Luis: un vistazo en 375 px
(dos columnas por fila; aquí las líneas son frases, más largas que las cuentas de errores3) y en ancho, en los dos idiomas.
