# Entrega de la tarea 87 · «¿Qué se hace primero? Con enteros» (`jerarquia-enteros`)

Sesión `s-20261025T001742-a650c948`, 2026-10-25. Commit del código: **daeedd5** (primera entrega) y el de la reabierta del 25-10 (**5031e17**).

## Ficheros

`practicas/jerarquia-enteros/` (`index.html`, `practica.js`, `logica.js`, `textos.js`, `estilos.css`) y
`tests/practicas-jerarquia-enteros.test.js` (18 tests, 3000 ítems por ejercicio con semilla fija; recorren
**todos** los órdenes válidos de pasos de cada expresión).

## Ejercicios y destrezas

1. **¿Qué va primero?** (U3-4A-01): se toca el signo de la operación que va primero; vale cualquiera de las que
   pueden ir primero (regla del 8-10). Mezcla: 40 % producto/cociente en suma, 35 % potencia en suma, 25 %
   cadena. **Sin combinadas** (reabierta del 25-10: son de la sesión 13); un test lo comprueba.
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

## Para la 95 y la 96

- **Ejercicios 1-3 (sesiones 9-12): semana 3, tarea de la 95.** El ejercicio 1 ya no lleva combinadas.
- **Ejercicio 4 «Combinadas» (U3-4A-02, sesión 13): fuera de la tarea de la semana 3**; lo mete la 96 en la tarea de
  la semana 4. Se puede publicar la práctica entera en la 95 (un alumno puede entrar al ejercicio 4 por libre).
- Restar un producto con negativos (`6 − 8 · (−7)`) pasa por un paso intermedio `6 − (−56)`, que es contenido de la
  sesión 6 (quitar paréntesis), ya dado.
- El mínimo de 2 falsas por paso hace que `valida` rechace expresiones con pasos como `2 · 2` (todas las
  trampas coinciden); no afecta a la variedad.

## Cómo probarlo en 1 minuto

`node --test tests/practicas-jerarquia-enteros.test.js` (19 tests). En el navegador: `npm run servir` y
http://localhost:8080/practicas/jerarquia-enteros/ con el código 60 (`7NPD`); no sale en la portada.

## Prueba en navegador (reabierta del 25-10)

Chrome headless (la extensión sigue desconectada) con un banco de pruebas fuera del repositorio: un servidor de
Node que sirve el repo y sustituye `base.js` por una base falsa (así no se escribe nada en Firestore ni hace falta
código de alumno), y un iframe de **375 px reales** dentro de la ventana (Chrome headless no baja de 500 px).

- Ejecutados los `montar` de verdad, acertando y fallando, en los cuatro ejercicios (también cada tipo de ítem:
  cadena y par en el 3), en español y en inglés, y el feedback en el otro idioma: **sin excepciones**, sin
  `undefined`/`NaN`, sin `×` ni guion como menos.
- **375 px y 900 px: ningún desbordamiento horizontal** (`scrollWidth = clientWidth`), ningún elemento fuera del
  viewport, **ninguna zona de toque menor de 32 px** (signos, exponentes, botones, opciones).
- «Comprobar» desaparece al responder (ejercicio 3, pares); el ejercicio 1 y el paso a paso no tienen «Comprobar»
  (se responde tocando o eligiendo).
- Capturas a 375 px en `capturas/`: `ej1-fallo-es`, `ej2-opciones-es` (a medias, con las tres opciones),
  `ej2-fallo-es`, `ej3-par-fallo-en`, `ej4-acierto-es`.
- **Lo visto**: el feedback cita los números del ítem; los signos tocables y los marcados (rojo el equivocado, borde
  de puntos los que valían) se leen bien, aunque con las cadenas largas el ejercicio 1 ocupa dos líneas.
  **No es** una prueba con el entorno real (código 60, base completa): falta, y la base de la 71 está a medias.
- **Arreglado**: nada de la práctica; lo único tocado en la reabierta es quitar las combinadas del ejercicio 1 y su test.
- `npm test` completo: fallos solo en ficheros ajenos a medias (`practicas-{codigos-4,espacio,migracion,nube,registro,semana}`),
  por `_comun/` de otra sesión.
