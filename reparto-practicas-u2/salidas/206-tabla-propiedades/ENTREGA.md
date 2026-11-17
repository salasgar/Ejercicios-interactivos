# ENTREGA · Tarea 206 · Reto «Tabla de propiedades» (`tabla-propiedades`, id 83)

Sesión s-20261116T235955-7bf1c8ea (Sonnet 5.5, 16-11 23:59Z a 17-11 ~00:40Z). Commit del código: `d956422`. `npm test`: 2449/2449.
**Sin publicar** (`disponible: false`; la publica la 207). Se prueba por URL: https://salasgar.github.io/Ejercicios-interactivos/practicas/tabla-propiedades/?probar=1

## Ficheros de código

`practicas/tabla-propiedades/{index.html,logica.js,textos.js,practica.js,estilos.css}`, `tests/practicas-tabla-propiedades.test.js`,
`practicas/_comun/catalogo.js` (solo la fila 83, junto a la 46), `practicas/portada.js` (descripción y bloque «Para toda la unidad · Reto opcional» de la U2),
`tests/practicas-comun.test.js` (la fila 83 en la lista fija), `docs/practicas-unidad2.md` (fila en el §6).
**Fuera de la ficha, necesario:** `tests/practicas-semana.test.js` (el test de la portada lista los bloques de la U2 y el bloque nuevo lo rompía: una línea).
No se ha tocado `tareas.js`, `base.js` ni `contador.js`.

## Niveles y banco finales

Un ejercicio (`nEjercicios: 1`, `objetivo: 54`, `penalizacion: 0`, `sinVidas: true`, `sinAyuda`), con el nivel deducido de los puntos (0 → 6 → 20 → 35 → 54):

| Nivel | Tabla | Números | Etiquetas | Etiquetas ya puestas | Puntos | Propiedades |
|---|---|---|---|---|---|---|
| 1 | 2 × 3 | 6 | 5 | sí | 6 | 5 fáciles |
| 2 | 2 × 4 | 8 | 6 | no | 14 | 2-3 medias + fáciles |
| 3 | 3 × 3 | 9 | 6 | no | 15 | 3-4 medias + fáciles |
| 4 | 4 × 3 | 12 | 7 | no | 19 | 2-3 difíciles (con «triangular» en ~1/3 de las tablas), 2 medias, el resto fáciles |

Banco (1 a 100): fáciles = par, impar, mayor/menor que 20…80, múltiplo de 5 y de 10; medias = primo, compuesto, cuadrado perfecto, múltiplo de 3, 4, 6, 9;
difíciles = múltiplo de 7 y de 11, divisor de 24/36/48/60/72/90/100, tiene 3/4/6 divisores, triangular. Nada de «tiene 2 divisores». Etiquetas en los dos idiomas
(«Divisor de 60» / «Divisor of 60»). El 1 puede salir y el feedback dice «no es primo ni compuesto».

## El generador, y lo que no cumple de la ficha

Sin casillas imposibles (cada casilla tiene ≥ 4 candidatos), sin etiquetas equivalentes, sin etiqueta que cumplan todos los números; los números salen de un
emparejamiento (siempre hay una solución: el test comprueba que `diseno` lo es). Nunca hizo falta la tabla de reserva (0 de 4800 tablas).
Variedad medida con 3000 tablas por nivel: **ninguna combinación de etiquetas por encima del 1,3 %** (tope pedido, 10 %). **Los números, por encima del 15 % pedido**
en los niveles 3 y 4: máximo ≈ 13 % (nivel 1), 15 % (2), 22 % (3) y 46 % (4). No es un descuido: una etiqueta como «cuadrado perfecto» (10 números) o «triangular» (13)
obliga a que 3-4 casillas de la tabla salgan de esos pocos números, y el 21 o el 1 se repiten. Lo que se hizo para bajarlo: las familias pesan igual (que «múltiplo de 5» no salga
en todas), las etiquetas con pocos números pesan menos y el reparto prefiere los números que cumplen pocas propiedades. Bajarlo más cuesta rechazar casi todas las tablas.
**El test fija topes por nivel (20 %, 20 %, 32 %, 60 %)**, no el 15 % de la ficha. **Decisión para la 207 o Juan Luis:** si se quiere más variedad en el nivel 4, la salida es
quitar «triangular» del azar (infografía solo por petición) o añadir etiquetas de muchos números al banco difícil.

## La pantalla

Arrastrar con ratón, dedo o lápiz (eventos de puntero, como `venn/`), tocar una pieza y después un hueco, y teclado (Intro o espacio). Una pieza colocada se mueve a otro hueco (si está
ocupado, se intercambian) o vuelve a la bandeja arrastrándola o tocando la bandeja. «Comprobar» sale desactivado hasta que están todas las piezas y dice cuántas faltan; no cuesta nada.
Un intento fallido enseña qué número no encaja y por qué (hasta 6 frases, «51 no es primo: 51 = 3 · 17»), marca las casillas en rojo y no mueve ninguna pieza; se registra con `api.intentoFallido`
(error `tabla-no-encaja`). Al acertar, `api.sumar(puntos del nivel)` y «Siguiente» pasa al nivel siguiente. **Repetir un ejercicio terminado** (la base lo reinicia con 0 puntos) empieza otra vez por el nivel 1;
la base no distingue una repetición de un primer intento, y volver a jugar los cuatro niveles no suma nada (ya está terminado).
Infografía de «triangular» (SVG de los triángulos de 1, 3, 6, 10 y 15 puntos) antes de la primera tabla del nivel 4 que la lleve: «¿Sabes ya lo que es un número triangular?»; «Sí» la recuerda en `localStorage`
(`practicas:tabla-propiedades:sabe:triangular`); «No» da la explicación larga (1, 1+2, 1+2+3…, y la lista hasta 100) y vuelve a salir hasta que conteste «Sí». Otra etiqueta con infografía: una entrada en `TX.infografias`,
otra en `DIBUJOS` (`practica.js`) y su familia en `FAMILIAS_CON_INFOGRAFIA` (`logica.js`).

## Tests (`tests/practicas-tabla-propiedades.test.js`, 15)

Propiedades contra listas a mano; niveles y puntos; nivel desde los puntos; 1200 tablas por nivel (tamaños, piezas, dificultad, solución del generador, sin casillas imposibles, sin etiquetas que no separen,
triangular solo en el nivel 4, variedad, no repite la anterior); corrector con 800 soluciones distintas de la del generador (permutaciones de filas y columnas, intercambios válidos) y números mal puestos
rechazados; cada razón para todos los (etiqueta, número) que fallan, en los dos idiomas; las frases de la ficha; textos en los dos idiomas sin «×»; fila del catálogo.

## Cómo se probó en el navegador

Chrome headless por CDP (`/private/tmp/claude-501/.../scratchpad/clics206.mjs`, fuera del repo), servidor `python3 -m http.server`, sin nube, con `?probar=1`:
- **375 px con el dedo simulado** (`Input.dispatchTouchEvent`, español) y **1200 px con el ratón** (inglés): los cuatro niveles completos, alternando arrastre y toque-toque; en los niveles 2, 3 y 4, un intento fallido
  (dos números intercambiados a propósito) con su feedback y las casillas en rojo, una pieza devuelta a la bandeja arrastrándola, y todas devueltas y recolocadas; el marcador pasa por 6, 20, 35 y 54 sobre 54; sin corazones; «Comprobar» desaparece al acertar.
- La infografía de «triangular» (nivel forzado a 4 con un `nivelDePuntos` inyectado solo en la prueba): «Sí» (recordado, no vuelve a salir tras recargar) y «No» (explicación y «Entendido»), en español y en inglés, a 375 px.
- Ningún desbordamiento horizontal en ninguna pantalla y consola limpia en la pasada completa. Algunas cargas dieron `ERR_CONNECTION_RESET` (servidor de Python en frío): se repitió hasta tener una pasada limpia.
- Capturas en `/private/tmp/claude-501/-Users-salasgar-Documents-git-Ejercicios-interactivos/8ebc8867-30e5-4286-a0a9-08f4440ab377/scratchpad/caps/`. **Sin probar en el navegador de verdad:** un móvil real (solo emulado) y el panel del profesor con el reto en una tarea (es de la 205/207).

## Para la 207

La fila 83 sigue con `disponible: false`. Hay que ponerla a `true`, añadir el reto a la tarea de la semana 3 de la U3 (`reto: [['tabla-propiedades', 1]]`; la 205 deja que sea de otra unidad) y revisar con clics; ver arriba la decisión sobre la variedad del nivel 4.
