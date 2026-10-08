# Entrega — Tarea 07: Divisiones sucesivas guiadas

Commit: `d9ef271`

## Ficheros entregados

- `practicas/divisiones/{index.html,practica.js,logica.js,textos.js,estilos.css}`
- `tests/practicas-divisiones.test.js`

## Qué tiene

Tres ejercicios (destrezas U2-2C-10, U2-2C-11, U2-2C-12, U2-2B-02):

1. **La escalera de divisiones.** El alumno pulsa, paso a paso, el MENOR primo
   (2, 3, 5, 7, 11 o 13) que divide al número actual, hasta llegar a 1. Si no
   divide, o divide pero no es el menor, la app explica por qué (criterio de
   divisibilidad para 2/3/5; división con resto para 7/11/13, que no tienen
   un criterio sencillo a este nivel) y sigue ella misma con el paso correcto.
   El ítem es acierto solo si no hubo ningún error en todo el camino.
2. **La forma de potencias.** Se da la lista de primos («2 · 2 · 3 · 3 · 3») y
   el alumno fija, con steppers, el exponente de cada base candidata (las que
   aparecen, más una que no, para que poner 0 también sea una respuesta
   válida). Un 20 % de los ítems son potencias de 10.
3. **Comprobar multiplicando.** Dos variantes sobre una factorización de dos
   primos: «¿cuánto vale?» (cuatro opciones numéricas) o «¿es correcta esta
   igualdad?» (sí/no). Las opciones falsas son siempre inequívocamente falsas:
   el error clásico de tratar p^e como p·e, el de intercambiar los exponentes
   entre las dos bases, y el valor correcto ± un factor.

## Cómo probarlo en 1 minuto

```
npm run servir
```

y abrir `http://localhost:8080/practicas/divisiones/?idioma=es` (o `?idioma=en`).
Entrar con cualquier código (o «Probar sin código») y hacer los tres ejercicios.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-divisiones.test.js`:
18 tests propios en verde, por fuerza bruta con definiciones independientes de
`aritmetica.js` (factorización, valor de una factorización, menor primo que
divide), semilla fija, ≥1500 ítems por comprobación. Verifican también la
regla de oro (ninguna posición de las opciones gana más del 70 %) y las cuotas
de variedad de cada generador.

## Probado en el navegador

Con `puppeteer-core` (Chrome del sistema, peticiones a Firestore cortadas):
menú, los tres ejercicios en español e inglés, en 375 px y en 1280 px, acierto
y fallo en cada uno, las dos variantes del ejercicio 3. El feedback de cada
error muestra los números reales del ítem (nunca una regla genérica).

## Propuestas pendientes (para la tarea 18)

- Poner `disponible: true` para `divisiones` en `catalogo.js`.

Sin cambios en el contrato de la base ni en `practicas/_comun/`.
