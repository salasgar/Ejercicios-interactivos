# Entrega de la tarea 37 · Tarea de la semana y arreglos de la base

Sesión: s-20261015T173031-efad3f35 · commits 42bb8cd (código y tests) y dae33d6 (dos erratas de la documentación).

## Ficheros entregados (git show --stat 42bb8cd)

Nuevos: `practicas/_comun/tareas.js`, `practicas/semana.html`, `practicas/semana.js`,
`tests/practicas-semana.test.js`.
Cambiados: `practicas/_comun/{base,codigos,piezas,textos}.js`, `practicas/_comun/estilos.css`,
`practicas/index.html`, `practicas/portada.js`, `practicas/profesor.{html,js}`,
`practicas/resultados.js`, `practicas/plantilla/practica.js` (solo comentarios),
`docs/practicas-unidad2.md`, `README.md`. No se ha tocado ninguna `practicas/<slug>/`, ni
`divisores/`, ni `firestore.rules`, ni el contador, ni los formatos de los códigos de alumno y
de práctica.

## Enlaces de cada tarea (los comunes, para Classroom)

| Tarea | Enlace | En la portada desde |
|---|---|---|
| 1 · Semana 1 · Múltiplos, divisores y criterios | https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=1 | lun 19-10-2026 |
| 2 · Semana 2 · Números primos y factorización | https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=2 | lun 26-10-2026 |
| 3 · Semana 3 · m.c.d. y m.c.m. con factores primos | https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=3 | lun 2-11-2026 |
| 4 · Semana 4 · Problemas y errores típicos | https://salasgar.github.io/Ejercicios-interactivos/practicas/semana.html?t=4 | lun 9-11-2026 |

Con `&c=CÓDIGO` el enlace es el de un alumno (el panel los da todos: «Enlaces a» → la tarea).
Los ejercicios de cada semana son los del borrador de temporización de la coordinadora
(`hechos/notas/s-20261008T174225-f75f5cdb-temporizacion.md`), copiados tal cual; las fechas
`desde`, con el calendario retrasado una semana (incidencia s-20261015T200500-cb08efae de la
carpeta de apuntes).

## Cómo probarlo en un minuto

1. `npm run servir` y http://localhost:8080/practicas/semana.html?t=1 (en local, con muchas
   pestañas a la vez `http.server` puede cortar conexiones: ver las trampas de la ficha).
2. Escribe un código de alumno (el panel los da). Sale el objetivo, el marcador a 0 y las dos
   listas con el nombre de cada ejercicio.
3. Pulsa «Empezar» en un ★: se abre ESE ejercicio de su práctica, con «← Tarea de la semana»
   arriba; al salir (o al terminarlo) se vuelve a la tarea y el marcador se mueve.
4. «Ver mi código (lo que llevo)» da el código de 20 caracteres; pégalo en
   `practicas/profesor.html`, sección 2, y elige «Ver: Tareas de la semana».
5. `?idioma=en` en el enlace: todo en inglés (mismo criterio que la base).

## Comprobado

- `npm test`: 697 de 697 (59 propios: `practicas-comun` y `practicas-semana`).
- En Chrome sin cabeza a 375 px, en español y en inglés: entrar, abrir un ★ y volver, terminar
  un ejercicio entero desde `&semana=1` (con la plantilla) y volver, marcador a medias y
  cumplida, código a medias y final, portada, y el panel leyendo los dos códigos mezclados en
  un texto. Ancho siempre 375.
- Las 31 prácticas y la plantilla, a 375 px: el menú tiene sus ejercicios, cada ejercicio se
  abre con `?ejercicio=n&semana=1` sin error, y tras una respuesta nada pasa de 375 px.
