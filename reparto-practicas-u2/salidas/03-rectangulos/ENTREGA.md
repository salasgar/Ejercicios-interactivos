# Entrega — Tarea 03: Divisores por parejas con rectángulos

Commit: `9fa847a` («Práctica rectangulos: divisores por parejas con rectángulos»)

## Ficheros entregados

- `practicas/rectangulos/logica.js` — generadores y comprobaciones, puro.
- `practicas/rectangulos/textos.js` — textos { es, en }.
- `practicas/rectangulos/practica.js` — interfaz y `arrancar(...)`.
- `practicas/rectangulos/index.html`
- `practicas/rectangulos/estilos.css` (vacío: todo lo necesario ya está en
  `../_comun/estilos.css` y `../../css/estilos.css`).
- `tests/practicas-rectangulos.test.js` (8 tests, por fuerza bruta independiente).

## Qué tiene

Tres ejercicios (catálogo: id 2, slug `rectangulos`, `nEjercicios: 3`):

1. **Descubre los rectángulos** (introducción con botón «Empezar»). n entre 12 y
   60, nunca primo, 20 % cuadrados perfectos. Control de ancho (stepper −/valor/+,
   `../_comun/piezas.js: pasos`), rejilla (`.rejilla`/`.rejilla__celda`) que se
   dibuja al elegir el ancho; si el ancho no divide a n, la última fila sale con
   celdas tachadas y un mensaje con el resto («con ancho 5 sobran 2 celdas: 5 no
   es divisor de 24»). Botón «Ya están todas»: acierto si la lista de parejas
   encontradas es exactamente la de `parejasDivisores(n)`; si falla, dice las
   parejas que faltan, recuerda que el 1 y el propio número siempre son
   divisores si falta esa pareja, y si el alumno no exploró hasta la raíz
   entera, lo dice con los números concretos.
2. **Sin dibujo: las parejas**. n entre 20 y 120, nunca primo. Banco de 12
   números distintos (todos los divisores de n más distractores que no
   dividen), botones de `.botones-numeros` que se tocan para marcar/desmarcar.
   «Comprobar»: acierto si el conjunto tocado es exactamente el de los
   divisores; si falla, cada número marcado de más sale con su división con
   resto («77 : 36 = 2, resto 5») y cada divisor que faltó, con el aviso del 1
   y el propio número si corresponde.
3. **¿Dónde se para?** (sin introducción). Mitad y mitad entre dos tipos: (a)
   «¿hasta qué número hay que probar?» con cuatro opciones numéricas distintas
   (raíz entera, n/2, el menor primo que no divide a n, y un ajuste para que las
   cuatro sean distintas); (b) «36 = 6 · 6, ¿cuántas veces se escribe el 6 en la
   lista de divisores?» con opciones fijas 0/1/2/r (correcta siempre 1). Las
   dos usan `elecciones` de `../_comun/piezas.js`.

Destrezas cubiertas: U2-1C-13 (parejas de divisores sin olvidar el 1 ni el
propio número), U2-1C-14 (parar en la raíz entera; la pareja central de un
cuadrado perfecto se escribe una vez), U2-1B-04 (vocabulario *divisor pair*).

## Cómo probarlo en 1 minuto

```
npm run servir
```
Abrir `http://localhost:8080/practicas/rectangulos/`, «Probar sin código», y
entrar en cualquiera de los tres ejercicios.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-rectangulos.test.js`
→ 42 tests en verde (8 propios: generadores por fuerza bruta independiente,
regla de oro de las opciones del ejercicio 3 —ninguna opción correcta domina
más del 70 %—, variedad de cuadrados perfectos, banco de 12 números con
divisores/distractores correctos). `npm test` completo: 250 tests en verde,
sin fallos en ningún fichero propio ni ajeno.

## Probado en el navegador

Chrome headless (puppeteer-core instalado fuera del repositorio, en
`/tmp/pptr-test/`, cortando las peticiones a `firestore.googleapis.com`),
ventana de 375 px: los tres ejercicios, acertando y fallando en cada uno,
en español y en inglés. Sin errores de JavaScript en consola, sin
desplazamiento horizontal. Carpeta temporal borrada al terminar.

## Propuestas pendientes (para la tarea 18)

- Poner `disponible: true` en el catálogo para `rectangulos`.

## Trampas encontradas (para la ficha de la tarea 03)

- Los ejercicios con `introduccion` muestran una tarjeta con su propio botón
  «Empezar» antes del primer ítem: al probar con Puppeteer hace falta un
  segundo clic en «Empezar» (el primero abre el ejercicio, el segundo cierra
  la introducción) antes de que aparezca el ítem.
- El menú de ejercicios usa `[data-ejercicio="N"]` en cada botón «Empezar»:
  es el selector fiable para abrir un ejercicio concreto desde un script,
  en vez de buscar por texto (los tres botones dicen «Empezar» a la vez).
