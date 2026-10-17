# Entrega tarea 53 · panel v2
Commit: 8102beb · sesión s-20261017T065943-9a261457
Ficheros: practicas/{profesor.js,profesor.html,resultados.js}, tests/practicas-resultados.test.js (11 tests nuevos); más una línea (progresoPorPractica: true en el fixture de la tarea 1) en tests/practicas-nube.test.js y tests/practicas-semana.test.js.

Qué enseña:
- «Cargar de la nube» lee practicas, divisores, practicas-tareas y practicas-asignaciones (si una falla, enseña las otras y lo dice).
- «Tareas de la semana»: retraso en cada celda ("2 d tarde"; en rojo "3 d de retraso" si no entregada); no asignados «—» (avance voluntario en gris) y sin contar; CSV con plazo, fecha de entrega, días de retraso y entrega (a tiempo/con retraso/sin entregar/pendiente).
- Vista «Retrasos en las tareas» (por alumno y por tarea, con CSV que añade detalle alumno×tarea).
- Sección «Asignar tareas»: casillas por alumno y tarea asignada; guarda solo lo cambiado; conserva ids no marcables aquí; exige haber cargado la nube.
- «Qué falla más»: filtro por tarea con el campo tarea (Sin tarea / Tarea N); tarea 1 incluye además fallos sin campo de sus ejercicios; las v2 usan los documentos de la tarea.
- Tarea 1 como hoy (probado en test).

Cómo probarlo en 1 minuto (con Google del profesor): profesor.html → lista con 3 nombres → «Cargar de la nube» → ver Tareas de la semana y Retrasos. Para asignar: poner temporalmente asignada: true en una tarea de prueba (id alto, desde lejano) en tareas.js, marcar el código 60 (alumno 61.º de la lista), guardar y comprobar por REST get practicas-asignaciones/<código>.
Sin probar: login de Google ni escritura real (solo carga del panel sin errores y vistas con lista de 3 nombres).
