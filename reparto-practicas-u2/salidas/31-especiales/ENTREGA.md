# Entrega — Tarea 31: Potencias especiales, verdadero o falso

Commit: `c35b796` («Práctica especiales: potencias especiales, verdadero o falso (repaso U1)»)

## Ficheros entregados

- `practicas/especiales/logica.js` — las catorce plantillas (7 pensadas como
  verdaderas, 7 como falsas); la verdad de cada ítem se calcula evaluando los
  dos lados con los números concretos (nunca declarada a mano).
- `practicas/especiales/textos.js` — renderizado de cada igualdad y su
  explicación, { es, en }.
- `practicas/especiales/practica.js` — interfaz: ejercicio 1 con racha
  visible (🔥), ejercicio 2 con cuatro opciones.
- `practicas/especiales/index.html`, `estilos.css` (vacío).
- `tests/practicas-especiales.test.js` (6 tests, 3000 ítems por generador,
  fuerza bruta independiente).

## Qué tiene

Catálogo: id 28, slug `especiales`, `nEjercicios: 2`.

1. **¿Verdadero o falso?** Catorce plantillas con las igualdades que se
   confunden: a⁰=1, a⁰=0, a⁰=a, 0ⁿ=0, 1ⁿ=1, 1ⁿ=n, a¹=a, a¹=1, 10ⁿ=«1 seguido
   de n ceros», 10ⁿ=10·n, aⁿ=a·n, a³=(a+1)², 2⁴=4² (la excepción famosa,
   con peso bajo: ≈2 % de los ítems) y aⁿ=a·a·…·a (la propia definición).
   Racha visible. Feedback con la cuenta real («1·1·1·1·1 = 1, no 5»).
   **El 0⁰ no aparece nunca**: solo la plantilla `0ⁿ=0` usa base 0, y ahí el
   exponente es siempre ≥ 1.
2. **¿Cuál es la falsa?** Cuatro igualdades de plantillas distintas (una
   falsa + tres verdaderas, elegidas sin repetir y barajadas), tocar la
   falsa.

Destrezas: 3C-01, 3C-05 a 3C-10, 3C-29, 3C-30, 3B-01 a 3B-03 (inventario de
la unidad 1).

## Cómo probarlo en 1 minuto

```
npm run servir
```
`http://localhost:8080/practicas/especiales/`, «Probar sin código», y entrar
en cualquiera de los dos ejercicios.

## Tests

`node --test tests/practicas-comun.test.js tests/practicas-especiales.test.js`
→ 41 en verde: 3000 ítems por ejercicio comprobados contra una fuerza bruta
independiente (no reutiliza las funciones de `logica.js`); verifica que la
proporción verdadero/falso del ejercicio 1 queda entre 40 % y 60 %, que la
plantilla 2⁴=4² no pasa del 5 %, que las catorce plantillas aparecen, que
ninguna plantilla pensada como falsa sale verdadera por casualidad (ni al
revés), que el ejercicio 2 tiene siempre exactamente una falsa y que su
posición no está siempre en el mismo sitio (regla de oro). `npm test`
completo → 271 tests en verde.

## Probado en el navegador

Chrome headless (puppeteer-core instalado fuera del repositorio, cortando
`firestore.googleapis.com`), 375 px: los dos ejercicios, varios ítems
acertando y fallando, en español. Sin errores de JavaScript, sin
desplazamiento horizontal. No se repitió la comprobación completa en inglés
con ventana ancha porque el componente de idioma y el layout responsive son
los mismos que usan ya todas las prácticas (base común, probada en la
tarea 01 y en las demás entregas).

## Propuestas pendientes (para la tarea 18)

- Poner `disponible: true` en el catálogo para `especiales`.

## Trampas encontradas (para la ficha de la tarea 31)

- Ninguna nueva más allá de la ya anotada en la ficha (2⁴ = 4² no debe
  generalizarse): se controló con un peso bajo (0,3 frente a 1 de las demás,
  ≈2 % de los ítems) en vez de excluirla del todo.
