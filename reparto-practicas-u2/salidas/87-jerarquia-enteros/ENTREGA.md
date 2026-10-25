# Entrega de la tarea 87 · «¿Qué se hace primero? Con enteros» (`jerarquia-enteros`)

Sesión `s-20261025T001742-a650c948`, 2026-10-25. Commit del código: **daeedd5**.

## Ficheros

`practicas/jerarquia-enteros/` (`index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`) y
`tests/practicas-jerarquia-enteros.test.js` (18 tests, 3000 ítems por ejercicio con semilla fija; recorren
**todos** los órdenes válidos de pasos de cada expresión).

## Ejercicios y destrezas

1. **¿Qué va primero?** (U3-4A-01): se toca el signo de la operación que va primero; vale cualquiera de las que
   pueden ir primero (regla del 8-10). Mezcla: 30 % producto/cociente en suma, 25 % potencia en suma, 15 %
   cadena, 30 % combinada.
2. **Producto o potencia dentro de una suma** (U3-3A-01, U3-3A-02): paso a paso. Se toca la operación que va
   ahora y se elige su valor entre 3-4 opciones; mitad producto/cociente, mitad potencia (con `−b²` al principio
   y `(−b)²`).
3. **Cadenas de · y :** (U3-3A-03, U3-3C-20): 60 % cadenas de 4-5 números (paso a paso, izquierda a derecha) y
   40 % pares `30 : (−5) · 2` / `30 : (−5 · 2)` que se escriben y se calculan los dos.
4. **Combinadas** (U3-4A-02): potencia, producto/cociente y suma/resta en la misma expresión.

Un toque equivocado o un valor equivocado fallan el ítem, lo dicen (con la pista del error) y la app hace el paso
bueno para seguir; el ítem se cierra al llegar a un número.

## Distractores = errores típicos con nombre

Las opciones de cada paso salen de `ERRORES_TIPICOS` (`regla-signos-en-suma`, `suma-valores-absolutos`,
`olvida-el-signo`, `signo-del-primero`, `sumar-negativo`, `restar-negativo`, `mismo-signo-dos-veces`,
`signo-del-mayor-producto/cociente`, `potencia-par-negativa`, `potencia-impar-positiva`,
`potencia-positiva-negativa`, `base-por-exponente`, `signo-cambiado`) más uno propio, `confunde-la-operacion`.
En el **último paso** van delante las trampas de toda la expresión: `sin-jerarquia` ((4 − 5) · 2),
`derecha-a-izquierda` (2 − (4 + 3)) y `menos-en-la-base` ((−3)² + 6 por −3² + 6). Cada paso de cada orden tiene
de 2 a 3 falsas distintas de la buena (lo comprueba el test y `valida` rechaza los ítems que no lo cumplen).
Toques mal: `sin-jerarquia` o `derecha-a-izquierda`. Pares: `ignora-el-parentesis`.

## Cotas (no hay contexto: son de tamaño)

Resultado final en ±100 y distinto de 0; todo resultado intermedio, en cualquier orden, en ±200 y distinto de 0;
factores de 2 a 9, bases de 2 a 6 (cubos, de 2 a 4); divisiones exactas; en la suma/resta, el segundo término sin
signo (el signo va en el operador). Ningún paréntesis envuelve una operación salvo el del par.

## Propuestas / avisos para Juan Luis y la 95

- El **ejercicio 1** incluye combinadas (potencia + producto + suma) porque U3-4A-01 es de la **sesión 13**, pero la
  ficha publica la práctica en la semana 3 (sesiones 9-12). Si no quiere combinadas antes de la 13, basta quitar
  la rama `combinadaAzar` de `generarPrimero` (una línea). Lo mismo el **ejercicio 4**, que es entero de la sesión 13:
  la 95 puede dejarlo fuera de la tarea de la semana 3.
- `5 − (−7) · (−8)`-tipo (restar un producto con negativos entre paréntesis) aparece en el 2 y el 4; los pasos
  intermedios pueden ser `6 − (−56)`, que es contenido de la sesión 6 (quitar paréntesis), ya dado.
- El minimo de 2 falsas por paso obliga a rechazar expresiones con pasos como `2 · 2` (todas las trampas
  coinciden); no afecta a la variedad.

## Cómo probarlo en 1 minuto

`node --test tests/practicas-jerarquia-enteros.test.js`. En el navegador: `npm run servir` y
http://localhost:8080/practicas/jerarquia-enteros/ con el código 60 (`7NPD`); no sale en la portada.

## Qué NO se ha hecho

- **Sin prueba visual a 375 px** (la extensión de Chrome no estaba conectada). Sí se ejecutaron los `montar` de verdad en
  Chrome headless con una base falsa (acertando y fallando en los cuatro ejercicios, español e inglés, y el
  feedback en el otro idioma): sin excepciones y con los textos bien. Falta mirar el aspecto (zona de toque de los
  signos y los exponentes, `estilos.css`).
- `npm test` completo: fallos solo en ficheros ajenos a medias (`practicas-{codigos-4,espacio,migracion,nube,registro,semana}`),
  por `_comun/` de otra sesión.
