# Traspaso — Revisión de la app y coordinación del reparto PU2 (tareas 40-55)

Actualizado: 2026-10-17 09:00 (hora peninsular) · Sesiones previas: 1 (la coordinadora s-20261016T122625-186b4bd8, Fable 5.1, del 16-10 al 17-10)

## Objetivo

Juan Luis revisa la app de prácticas (practicas/) ejercicio a ejercicio y va diciendo lo que
observa; la sesión coordinadora le da su opinión (incluido desacuerdo razonado), propone la
solución y convierte cada observación en una ficha nueva del reparto PU2 (numeradas al final:
la siguiente es la 56), que otras sesiones ejecutan con la frase de arranque. Además, la
coordinadora hace las cosas de fuera del reparto que él pide (Classroom, correos, rutina).

## Estado actual

El estado de cada tarea está en `reparto-practicas-u2/_ESTADO.md` (vista derivada de
`reparto-practicas-u2/hechos/`): 1-50 y 54 LISTAS (la 49 cerró el 17-10 a las 08:56, cuando Juan
Luis publicó las reglas de Firestore en la consola; la 50 pegó las tareas 11-14 de la U1 en
`tareas.js`, commit ae6c6f1; la 54 adaptó el informe diario, 1d380bd); **51 y 53 LIBRES**; 52
BLOQUEADA (espera a 51); 55 BLOQUEADA (espera a 51-53). Fuera del reparto, hecho el 16-10: tarea
de Classroom «2. Interactive exercises · Week 1 (100 points)» publicada (plazo jue 22-10 23:59),
51 correos con el código enviados desde murciaeduca, rutina diaria del informe creada,
`herramientas/informe-actividad.mjs` en `main`, semana 1 visible en la portada desde el 16-10.
Incidencia cerrada: la noche del 16-10 una sesión sin reclamo (id del entorno 1f09009c) reservó
`tareas.js` y `PROPUESTA.md` un rato y desapareció sin dejar cambios.

## Siguiente paso

Al retomar: `git fetch origin`, leer `_ESTADO.md`, listar `hechos/reclamos/` y `hechos/terminadas/`,
regenerar el tablón si hace falta y darle a Juan Luis la foto del momento con las frases de
arranque **solo de las LIBRES** (plantilla en `proyecto.md`). El 17-10 a las 09:00 las libres
eran la 51 (ALTO) y la 53 (MEDIO), y él ya tenía sus frases; cuando cierren, la 52 y después la 55. Después, seguir recibiendo sus
observaciones: cada una, opinión + ficha 56, 57… con el procedimiento de «Preferencias».

Banda de modelo para retomar: ALTO (Opus 5, esfuerzo Alto) — hay que juzgar observaciones
pedagógicas y escribir fichas que otras sesiones ejecutan sin preguntar; el diseño grande
(tareas v2) ya está hecho, así que no hace falta Fable.

## Decisiones tomadas

| Decisión | Por qué |
|---|---|
| Las observaciones de la revisión van al reparto PU2 como tareas 40+ (no a un reparto nuevo) | `proyecto.md` y el protocolo ya existen y las sesiones los conocen |
| La coordinadora no escribe código del producto; excepciones hechas: `herramientas/informe-actividad.mjs` (fichero nuevo, encargo directo de Juan Luis para la rutina) y `desde` de la semana 1 en `tareas.js` (necesario al publicar la tarea el 16-10) | Ficheros que ninguna tarea tocaba; el resto, siempre por ficha |
| Repaso de realismo obligatorio en todo problema de enunciado (regla 9 de `proyecto.md`, CLAUDE.md del repo y global, memoria) | Cuatro enunciados imposibles encontrados el 16-10 (noria, metrónomo, pista, pulseras con canicas) |
| Semáforo: botón «Ninguno / None» excluyente y Check deshabilitado hasta pulsar algo (T40) | El conjunto vacío es un caso deseado (~9 % en ej. 1) y nada decía cómo contestarlo; el envío vacío acertaba por azar |
| Cuatro estados visuales tras Check en toda la app: verde relleno / rojo tachado / verde punteado (faltaba) / gris | Color solo no basta; el tachado se lee en blanco y negro |
| Rectángulos ej. 1: celda de tamaño fijo por ítem = ancho disponible ÷ n, tope 20 px (T42, hecha) | Que el área se vea constante al cambiar el ancho y que el 1×60 quepa en un móvil |
| Léelo en inglés: distractores con los mismos números (inglés incorrecto de lista cerrada, estructura cambiada, -teen/-ty) (T43, hecha) | Los de antes se resolvían comparando dígitos |
| Código de resultado por práctica: ELIMINADO (T47, hecha); el de la tarea queda en un desplegable discreto (T44) | No es necesario: el panel lee la nube; eliminarlo quita el tope de 32 prácticas |
| Modelo de tareas v2: pool por unidad, tareas repaso/obligatoria/asignada, progreso POR TAREA en `practicas-tareas/`, asignaciones en `practicas-asignaciones/`, retraso en días | Aprobado entero por Juan Luis el 16-10: `salidas/45-diseno-tareas-v2/DISENO.md` |
| La tarea 1 (semana 1) conserva el modelo viejo para siempre (`progresoPorPractica: true`) | 51 alumnos dentro hasta el 22-10; los enlaces repartidos no pueden cambiar |
| Publicar el modelo v2 cuanto antes, sin tocar la tarea 1 y con un test en cada tarea | Decisión de Juan Luis en la 45; sustituye a la ventana 23-25 de octubre |
| Tareas de la U1 (ids 11-14, propuesta de la 46 aprobada) se pegan en `tareas.js` dentro de la 50, con `unidad: 1` y sin fechas | Son para el curso que viene y repaso voluntario mientras tanto |
| Escalera de divisiones: sin avance al fallar; divisores compuestos como distractores; «n =» delante de la lista de primos en el ej. 2 (T48, hecha) | El alumno tiene que hacer la escalera él; el error típico es dividir entre 4, 6, 9… |
| Correo a los alumnos: sin pedir el código de resultado; «Puedes entrar desde Classroom o con este enlace…»; «No hace falta que me envíes nada…»; «no se guardaría nada de lo que hicieras» | Redacción suya, aprobada el 16-10 |
| Informe diario: solo números de lista, grupos y códigos, nunca nombres | El repositorio es público |

## Descartado — no volver a proponer

| Se descartó | Motivo |
|---|---|
| Celdas de 1 mm (o 2 mm) fijos en Rectángulos | A 1 mm no se ven las celdas sobrantes; a 2 mm el 1×60 no cabe en un móvil. Él eligió la variante C |
| Metrónomo en segundos, o quitarlo | Lo quiso conservar en décimas de segundo con cota 3..30 (20-240 clics/min) |
| «two by three», «to the power four», «two to the second power», «is a prime», «between» como distractores de inglés incorrecto | Son válidos en alguna variante: regla de oro |
| Esconder el código de resultado por práctica en vez de eliminarlo | Él decidió eliminarlo; la 44 lo escondió por llegar antes la ficha vieja y la 47 lo eliminó |
| Ventana de publicación 23-25 de octubre para el modelo v2 | Él prefirió publicar cuanto antes sin tocar la tarea 1 |
| Avisar al alumno de que ya hizo un ejercicio en otra tarea | Decidido por él: la tarea pide sus puntos sin mirar lo anterior |
| Pedir a los alumnos que envíen el código de resultado por correo | El panel lee la nube |
| Tareas de la U1 con plazo ahora | La U1 terminó el 10-10; son para el curso que viene y repaso |
| Enviar los correos del código el lunes 19-10 | Adelantado al 16-10 al publicar la tarea ese día |

## Archivos

- `reparto-practicas-u2/_ESTADO.md` — tablón (vista derivada); `proyecto.md` — reglas, bandas, frase de arranque, regla 9 de realismo.
- `reparto-practicas-u2/tareas/tarea-40-…` a `tarea-55-…` — las fichas de esta revisión (la plantilla de secciones comunes se copia de `tarea-32-errores1.md`).
- `reparto-practicas-u2/hechos/notas/s-20261016T122625-186b4bd8.md` — nota de la coordinadora: cada alta, con hora.
- `reparto-practicas-u2/salidas/45-diseno-tareas-v2/DISENO.md` — el diseño aprobado del modelo v2 (especificación de las 49-55).
- `reparto-practicas-u2/salidas/46-tareas-unidad1/PROPUESTA.md` — las cuatro tareas de la U1 aprobadas (bloque listo para `tareas.js`).
- `herramientas/informe-actividad.mjs`, `tests/herramientas-informe.test.js` — informe diario (REST sin auth; umbrales en `UMBRALES`).
- `…/apuntes-1eso-bilingue/2. Divisibility/publicar_tarea_app_semana1.py` y `tarea-app-semana1-estado.json` — la tarea de Classroom (id del coursework).
- `…/apuntes-1eso-bilingue/Curso 2026-2027/codigos-app/borradores_codigos.py`, `codigos-alumnos.tsv`, `borradores-correo-codigos.json` — correos (texto final, `--enviar`, hora de envío por alumno). Datos sensibles: nunca al repo.
- Rutina: https://claude.ai/code/routines/trig_018p4Y73wGMvZu7Uxjf27Tc1 («Prácticas: informe diario…», 21:30 Madrid).
- Memoria de Claude (esta carpeta de proyecto): `repaso-realismo-enunciados.md`, `modelo-tareas-v2-decisiones.md`, `rutina-informe-actividad-practicas.md`, `tarea-app-semanal-correo-codigos.md`.

## Preferencias para este proyecto

- Tutearle; horas en hora peninsular (los hechos van en UTC: convertir).
- Cuando no esté de acuerdo con una observación, decirlo con el motivo y proponer alternativa; él decide y suele aceptar.
- Cada ficha: cabecera (precondición, duración de sesión, banda, encadenable, carpeta de salida, ficheros que toca), secciones comunes copiadas de `tarea-32-errores1.md` con el número sustituido (ojo: no usar una comprobación `\b32\b` sobre el cuerpo, que puede llevar un 32 legítimo), objetivo con la observación literal suya y la fecha, pasos concretos con código cuando ayuda, tests, «Cómo saber que ha terminado» con prueba en navegador, trampas, prohibido, salida.
- Las frases de arranque, literales y una por sesión, solo para las LIBRES, con el nombre `PU2 T<NN> (<BANDA>)` delante y la banda traducida; foto del momento antes (EN CURSO / LIBRES / BLOQUEADAS) sacada de `hechos/` con `git fetch` en ese instante.
- Las sesiones cierran en 10-30 minutos y casi nunca prueban en el navegador: decírselo a él para que mire en GitHub Pages lo que cierran.
- El código del repo se edita con Edit/Write (el candado del entorno solo ve esas herramientas y reserva el fichero ~30 min; una sesión en espera lo nota); `hechos/`, fichas y tablón, desde el shell. Commit siempre con rutas explícitas, nunca `git add .`.
- Al regenerar el tablón tras un alta, releer `hechos/` primero: hoy dos veces una sesión cerró su tarea en el minuto en que yo editaba la cabecera, y la dejé como PENDIENTE siendo LISTA.

## Contexto que no está en los archivos

- La tarea 1 (semana 1 de la U2) está viva del 16 al 22-10 con 51 alumnos; examen 1 el viernes 23-10; la semana 2 empieza el lunes 26-10 y lleva divisiones ej. 1 y 2 como ★ (la 48 ya está en `main`). Las tareas 2-4 usarán el modelo v2 si las 49-55 llegan antes del 26-10; si no, saldrán con el modelo viejo y no pasa nada.
- Pendiente de Juan Luis: poner la categoría «Tareas» a la tarea de Classroom (la API no deja); mirar en Pages lo que cerraron las 40-44 y 47-48 sin prueba en navegador (semáforo, clasificador, rectángulos ej. 1, léelo, fin de ejercicio sin código, escalera); comprobar que el informe diario llega a su Gmail cada noche a las 21:30 (primera ejecución el 16-10). Las reglas de Firestore nuevas ya están publicadas (17-10, 08:5x).
- **El arreglo del CSS común de los botones encendidos NO ha llegado a `main`** (último commit de `practicas/_comun/estilos.css` es 7d3f019, anterior a la revisión): la sesión «fuera del reparto» que él dijo que lo llevaba no lo publicó. Hoy semáforo lleva las reglas copiadas en su CSS (T40) y rectángulos en el suyo (31733ea); constructor sigue mostrando iguales los botones acertados y errados tras Check. Candidata a tarea 56 (MEDIO): mover las reglas al común y quitar las copias.
- Rutina diaria: pasa `--alumnos 51` y elige `--tarea` leyendo `tareas.js`; si cambia la lista del panel, actualizar la rutina. La 54 hará que el script elija solo la tarea obligatoria vigente.
- Unidad 3 (Integers) empieza el 16-11: hace falta un reparto nuevo (PU3) con su inventario de destrezas (hoy «por revisar») y el diseño del pool de prácticas con Juan Luis; diseño la última semana de octubre, construcción la primera de noviembre. Montar ese reparto es banda ALTO (Fable 5.1, esfuerzo Alto).
- Dilema sin resolver de otra sesión: penalizar según el tiempo de respuesta (memoria `dilema-penalizacion-por-tiempo`); con el modelo de vidas se quitaría. No proponerlo sin que él lo saque.
