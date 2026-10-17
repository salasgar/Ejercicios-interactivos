# Entrega de la tarea 69 · Revisión de extremo a extremo de varios profesores y documentación

Sesión `s-20261017T215223-49ff9905` (PU2 T69, ALTO), 2026-10-17, atendida.

**Veredicto: SE ENTREGA** — 13 de 13 criterios PASAN, ninguna tarea reabierta
(`VEREDICTO.md`). Hallazgos fuera de criterio, para Juan Luis: `HALLAZGOS-FUERA-DE-CRITERIO.md`.
Salida literal del banco REST: `BANCO-REST.txt` (154 de 154; con `--baja`, 8 de 8).

## Ficheros entregados

Commit **`e92c936`** (`git show --stat`: 3 ficheros, +321 −2):

- `docs/practicas-como-empezar.md` (nuevo): la página para los compañeros, en llano (entrar y pedir
  el alta, la lista y los códigos, la contraseña de la lista, las tareas y la plantilla, repartir
  enlaces, ver resultados, qué hacer si algo no va). Es la que Juan Luis les puede mandar.
- `docs/practicas-unidad2.md`: aviso de los dos sistemas al principio y en §2, y **§9 Varios
  profesores** (quién es profesor y el administrador, el código del alumno y quién decide el
  sistema, tabla de colecciones, nombres cifrados, tareas por profesor, el panel, dar de alta a un
  compañero, las reglas y su banco, **las cuotas: cómo mirarlas en la consola y el umbral del
  70 %**, el informe en un espacio); §8 con los punteros.
- `README.md`: punto «Varios profesores» en la sección de las prácticas y apartado «Varios
  profesores: publicar las reglas y dar de alta a alguien» (con las cuotas).

## Lo comprobado

Todo en `VEREDICTO.md`, con el resultado literal de cada prueba: banco REST con las cuentas A y B;
el panel de A y de B en dos navegadores contra el Firestore real (códigos de 8 y de 4, lista
cifrada recuperada en otro navegador, plantilla y editor, asignación, progreso libre y por tarea,
fallos, «Hoy»); el administrador con la cuenta de Google de Juan Luis (solicitud → alta de un
compañero desechable, baja y vuelta a dar de alta de B, el sistema actual); el 7NPD registrado a
mano en el espacio de A y vuelta al modo antiguo al borrarlo; el informe sin `--espacio`, idéntico
al de antes de la 68; 375 px y los dos idiomas; `npm test` 884/884 sobre 8982a78, 904/904 sobre
361f6c1 y 918/918 en el árbol al comitear la documentación.

## Para la tarea siguiente

- **70**: este veredicto es el «se entrega» que pide su ficha para ejecutar el paso. Nota en
  `hechos/notas/s-20261017T215223-49ff9905-para-la-70.md` (el espacio de Juan Luis ya existe; el
  7NPD estuvo registrado en A y ya no).
- **Juan Luis**: limpieza en la consola y cuentas de prueba (hallazgos 2 y 3); decisiones menores
  (hallazgos 5 y 6).

## Cómo comprobarlo en un minuto

Leer `docs/practicas-como-empezar.md` como si fueras un compañero; `npm test`; y, con las cuentas
de prueba, `PROFE_A_EMAIL=… PROFE_A_CLAVE=… PROFE_B_EMAIL=… PROFE_B_CLAVE=… node herramientas/probar-reglas.mjs`.
