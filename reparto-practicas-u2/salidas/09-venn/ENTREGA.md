# Entrega de la tarea 09 · m.c.d. y m.c.m. con factores primos (Venn)

Sesión: s-20261007T212116-b15e0069 · Commit del código: `f5748e7`

## Ficheros entregados

- `practicas/venn/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
- `tests/practicas-venn.test.js` (20 tests)

URL local: `npm run servir` y http://localhost:8080/practicas/venn/

## Qué tiene

| Ej. | Qué hace el alumno | Destrezas |
|---|---|---|
| 1. Reparte los factores | Cada factor primo es una ficha (azul las de a, naranja las de b). Las lleva a «solo a», «común» o «solo b» tocando ficha y zona, o arrastrando. En «común», una azul y una naranja del mismo primo se ven como pareja; la que no tiene pareja lleva un «?» al lado. Al acertar, la app escribe el m.c.d. (lo común) y el m.c.m. (todo, contando lo común una vez). | U2-3C-03, U2-3C-04, U2-3B-01 |
| 2. El m.c.d. con factores primos | Las dos factorizaciones en columnas («—» donde falta un primo) y un contador de exponente por primo. Sin ningún primo elegido, pregunta «¿m.c.d. = 0 o m.c.d. = 1?». | U2-3C-03, U2-3C-05, U2-3C-08 |
| 3. El m.c.m. con factores primos | Igual, con el m.c.m. | U2-3C-04, U2-3C-05, U2-3C-06, U2-3C-08 |
| 4. Mezcla y comprobación | Pide al azar m.c.d. (en verde) o m.c.m. (en morado) y, tras responder, enseña las dos comprobaciones con los números. Si la respuesta rompe la desigualdad, el feedback lo dice antes que nada. | U2-3C-05, U2-3C-10 |

Números: de 12 a 400, con dos o tres primos distintos hasta el 13 y exponentes hasta 4.
En los cuatro ejercicios, 15 % de ítems sin primos comunes, 15 % con uno divisor del otro,
una de cada cuatro parejas con 11 o 13, y seis de cada diez con los dos números hasta 150.
En el Venn, de 2 a 4 fichas por número. El m.c.m. no pasa de 3000.

Errores que distingue el feedback (códigos de `diagnosticar`): `es_el_otro`, `cero`,
`desigualdad`, y además, para el m.c.d., `no_comun`, `exponente_mayor`, `falta_comun`,
`se_queda_corto`; para el m.c.m., `faltan_no_comunes`, `falta_comun`, `exponente_menor`,
`se_pasa` (con frase propia si la respuesta es a · b). En el Venn: `no_comun`, `sobra`, `falta`.
`falta_comun`, `se_queda_corto` y `se_pasa` no estaban en la ficha: los añadí para no dejar
esos casos en un «otro» sin explicación.

Parámetros del contador: los de la base (no declara ninguno).

## Cómo probarlo en 1 minuto

1. Abrir la URL, «Probar sin código», ejercicio 1. Tocar una ficha azul y después «solo
   (el número naranja)»: avisa de que no puede ir ahí. Llevar todas al centro y comprobar:
   dice qué primo no tiene pareja.
2. Ejercicio 2: pulsar «Comprobar» sin tocar nada → pregunta 0 o 1. Elegir 0.
3. Ejercicio 4: construir el m.c.m. cuando pide el m.c.d. → «Un m.c.d. de … no puede ser».

## Probado

- `node --test tests/practicas-comun.test.js tests/practicas-venn.test.js`: 59 de 59.
  `npm test`: 403 de 403 (con los ficheros a medias de otras sesiones en el árbol).
- Chrome sin ventana (puppeteer-core de fuera del repositorio, peticiones a Firestore
  cortadas), 375 px y 1024 px, modo alterno, `?idioma=es` y `?idioma=en`: los cuatro
  ejercicios acertando y fallando de varias maneras, colocación con toque-toque y con
  arrastre, la traducción tras responder. Sin errores de consola ni desplazamiento horizontal.
- No probado en un móvil de verdad (el arrastre con el dedo solo está probado con el ratón
  simulado; el toque-toque no depende de él).

## Para la tarea 18 y la coordinadora

- Poner `disponible: true` para `venn` en `practicas/_comun/catalogo.js`.
- **Fallo de la base, no parcheado:** `.comprobar { display: block }` de
  `practicas/_comun/estilos.css` anula el atributo `hidden`, así que el
  `boton.hidden = true` que hace la plantilla (y las prácticas que la copian) no esconde
  el botón «Comprobar» tras responder: se queda a la vista, apagado. Aquí está resuelto
  con `.comprobar[hidden] { display: none; }` en el CSS propio; lo suyo es ponerlo en la base.
- Los «círculos» del Venn son óvalos de esquinas muy redondeadas: con círculos de verdad,
  a 375 px las fichas de los lados se salían por la curva.
- La pregunta «m.c.d. = 0 o m.c.d. = 1» tiene una opción (el 0) que nunca es buena. Es el
  diagnóstico que pide la ficha («si dio 0…») y solo aparece si el alumno no elige ningún
  primo; no es un ejercicio de elegir, pero queda dicho.
