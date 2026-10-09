# Entrega — Tarea 12, Reloj de coincidencias

Commit: `d6e06ae`

## Ficheros entregados

- `practicas/reloj/index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`
- `tests/practicas-reloj.test.js`

## Qué tiene

Tres ejercicios, todos sobre el m.c.m. como «cuándo vuelven a coincidir»:

1. **Predice la coincidencia**: dos luces (azul y naranja) con periodos 2-12 s sobre
   una línea de tiempo tocable de 0 a 60 s (dos filas de `.rejilla`, 31 columnas cada
   una). El alumno toca el segundo; después se anima la línea mostrando los múltiplos
   de cada color hasta el final. Feedback con las dos listas de encendidos.
2. **La hora de reloj**: dos steppers (horas 0-23, minutos de 5 en 5) para dar la hora
   exacta en que dos vehículos vuelven a salir juntos. Periodos de dos cifras,
   m.c.m. entre 40 y 180 min; la hora inicial (6-20 h) garantiza que nunca se cruza la
   medianoche. El feedback siempre muestra la descomposición («84 min = 1 h 24 min;
   …»), y si la respuesta coincide con el error típico de sumar los minutos como si
   llegaran a 100 (no a 60), lo dice explícitamente.
3. **Cada cuántos días**: entrada numérica (teclado nativo del dispositivo). Mitad de
   los ítems con tres periodos pequeños (m.c.m. ≤ 60), mitad con dos periodos donde
   uno ya es múltiplo del otro (la pista dice que no hace falta calcular nada).

Destrezas cubiertas: U2-1A-02, U2-4A-02, U2-2A-03, U2-3A-04, U2-4A-07.

## Decisión propia (no es un cambio del contrato)

La línea de tiempo se hizo con **dos filas de 31 columnas** (0-30 y 31-60), no con
una fila de 61 con lupa, por simplicidad: a 375 px da celdas de ~11 px, legibles y
tocables con el pulgar sin zoom. Queda anotado en «Trampas conocidas» de la ficha.

## Tests

`tests/practicas-reloj.test.js`: 9 tests, con generación de 1200 ítems por cada uno
de los cuatro generadores (línea, hora, tres, multiplo) comprobados contra un m.c.m.
por fuerza bruta (búsqueda incremental, no `aritmetica.mcm`) y una suma de minutos a
pulso (no `sumarMinutos` de `logica.js`). Todo en verde: `npm test` → 257/257.

## Cómo probarlo en 1 minuto

```
npm run servir
```
Abrir `http://localhost:8080/practicas/reloj/?c=AAAA` (o «Probar sin código»), hacer
un ítem de cada uno de los tres ejercicios, acertando y fallando, en español y en
inglés, en una ventana de 375 px y en una de escritorio. Probado con Chrome headless
(`puppeteer-core` instalado fuera del repositorio) sin errores de consola, incluido
salir a mitad de la animación del ejercicio 1 (se cancela sola, `contenedor.isConnected`).

## Petición a la tarea 18

Poner `disponible: true` para `reloj` en `practicas/_comun/catalogo.js`.

## Propuestas / cambios de contrato

Ninguno: el contrato de la base (01) se ha usado tal cual, incluida la pieza `pasos`
de `piezas.js` para los steppers de minutos (truco: valor = índice 0-11, `pinta` lo
multiplica por 5).
Commit: 6d4628d (reabierta del 9-10): rótulo de la hora encima de los contadores; «Marca la hora».
