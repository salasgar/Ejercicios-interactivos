# Entrega · Tarea 38 · Progreso en la nube entre aparatos; puntos y «qué falla más» en el panel

Sesión: s-20261015T204306-1ed3fc83 · Commits: 5a43e60 (firestore.rules) y 51543cf (código, tests y docs)

## Ficheros (git show --stat)
- 5a43e60: firestore.rules (bloque `match /practicas/{doc}`: `allow get` con la condición de nombre; `list` sigue solo del profesor). **Publicada por Juan Luis el 15-10 a las 20:58Z** (comprobado: GET de un documento → 404/200; listar → 403).
- 51543cf: practicas/_comun/nube.js (nuevo), practicas/_comun/{base,textos}.js, practicas/semana.js, practicas/profesor.js, practicas/resultados.js, tests/practicas-nube.test.js (nuevo, 13 tests), docs/practicas-unidad2.md, README.md.

## Qué hace
- Al entrar con el código (práctica o página de la semana) se lee el documento `practicas/{slug}--{código}`, se fusiona con lo del navegador y se sube solo si la nube no lo tenía. Nada se sube antes de haber intentado leer. Sin red / 404 / 403: se sigue con lo del navegador.
- Cada subida vuelve a leer y fusiona antes de escribir (en cola).
- Panel: puntos de cada tarea (columna y CSV), con `estadoTarea`, la misma función del marcador del alumno; vistas «Qué falla más · todas las prácticas» y «Qué falla más · tarea N» con CSV.
- Textos ES/EN en la entrada: «puedes seguir desde cualquier móvil u ordenador entrando con el mismo código».

## Cómo probarlo en 1 minuto
1. Ventana normal: `https://salasgar.github.io/Ejercicios-interactivos/practicas/recta/?c=KTFN` (código de prueba, n.º 61, fuera de los 51 alumnos). Haz un par de ítems de un ejercicio (o termina uno).
2. Ventana privada (otro «aparato»), mismo enlace: aparece lo mismo. Haz algo en otro ejercicio.
3. Vuelve a la ventana normal y recarga: está lo de las dos.
4. `…/practicas/semana.html?t=1&c=KTFN` en la ventana privada: el marcador cuenta lo de los dos aparatos.
5. Panel → Cargar de la nube → «Tareas de la semana» (columna de puntos) y «Qué falla más · tarea 1». Ojo: si la lista de nombres está escrita, KTFN no cuenta en «Qué falla más» (solo cuentan los de la lista).
