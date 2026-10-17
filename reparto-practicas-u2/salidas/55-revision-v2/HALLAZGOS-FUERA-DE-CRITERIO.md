# Hallazgos fuera de criterio · tarea 55

Sesión `s-20261017T085758-fd6852c8`, 2026-10-17. Ninguno impide usar el modelo v2 en la
semana 2 (lunes 26-10). Son decisiones de Juan Luis; esta tarea no cambia código.

## Para decidir

1. **La rutina del informe diario elige la tarea por su cuenta.** La rutina
   `trig_018p4Y73wGMvZu7Uxjf27Tc1` (leída, no tocada) no pasa `--tarea 1` fijo, pero su paso
   1 elige «la tarea cuyo `desde` sea el más reciente que no sea posterior a hoy» y se la pasa
   al script con `--tarea`. Con las tareas de hoy coincide con lo que elegiría el script (la
   1 hasta el 25-10 y la 2 desde el 26-10), pero deja de coincidir en cuanto haya una tarea
   **asignada** o de **repaso** con `desde` más reciente que la obligatoria de la semana: la
   rutina informaría de esa y no de la obligatoria. Además lleva escrito «el plazo de la
   semana 1 es el jueves 22-10», que ahora sale de `hasta` y el informe ya lo dice.
   **Propuesta:** quitar el paso 1 y el `--tarea` de la rutina (que el script elija con
   `tareaVigente`, como dice el diseño) y la frase del plazo. Se cambia desde claude.ai o
   pidiéndoselo a una sesión de Claude Code.

2. **Título de la portada.** Sigue diciendo «Prácticas de la unidad 2» / «Unit 2 practices»
   (`portada_titulo` en `_comun/textos.js`), y ya enseña dos unidades. Ya lo propuso la 52.
   Propuesta: «Prácticas de Matemáticas» / «Maths practice», o «Prácticas · 1.º ESO».

3. **Orden de las tareas de la unidad 1 en la portada.** La portada pone las tareas de cada
   unidad de la más nueva a la más antigua (pensado para la actual: la de esta semana,
   arriba). En la unidad 1, plegada y de repaso, salen «Semana 4, 3, 2, 1». ¿Se quieren en
   orden (1 → 4) en las unidades anteriores?

4. **«Cumplidas n/m» en «Tareas de la semana»** cuenta en el total las tareas que aún no se
   han publicado (2, 3 y 4, con `desde` futuro) y las de repaso (las 11-14 de la unidad 1),
   así que hoy un alumno con la tarea 1 hecha sale con «1/9». La vista «Retrasos» sí cuenta
   solo las publicadas y obligatorias; su CSV de detalle, en cambio, lista también las no
   publicadas como «pendiente». Propuesta: que «Cumplidas» cuente solo las obligatorias para
   ese alumno ya publicadas, y que el CSV de detalle quite las no publicadas.

5. **El informe dice «Tarea completa (100 puntos)»** aunque la tarea valga otra cosa (la de
   prueba valía 20; una de 10 ★ y nada a elegir vale 100, pero una de 5 ★ valdría 50).
   Propuesta: «Tarea completa (N puntos)» con el máximo de la tarea, o «Tarea cumplida».

## Para saber

6. **Una tarea recién añadida, con la caché del navegador vieja.** En la prueba, una pestaña
   que tenía en caché el `tareas.js` de antes de añadir la tarea 901 abrió un ejercicio con
   `&semana=901`: la base no conocía la tarea y lo trató como «tarea que no existe» (vuelve a
   la tarea al salir, pero guarda en la práctica libre). GitHub Pages deja cachear 10 minutos,
   así que solo puede pasar si se manda el enlace de una tarea nueva en los 10 minutos
   siguientes a publicarla. Basta con comitear la tarea con antelación (con `desde`, la
   portada no la enseña antes de tiempo).

7. **La portada cuenta lo del navegador** (ya documentado desde la tarea 38): en un aparato
   nuevo, la tarjeta de una tarea en la portada puede decir menos puntos de los que tiene el
   alumno hasta que abre la tarea, que trae la nube. Visto con el código 61: la portada decía
   «1 de 100» en la tarea 1 y la nube tenía más.

8. **Subidas cada 5 respuestas** (de la tarea 38, no de la v2): quien conteste 1-4 ítems y
   cierre la pestaña deja eso solo en su navegador hasta la siguiente vez que entre en esa
   práctica o en la tarea. En la fusión entre aparatos lo absorbe la página de la tarea, que
   sincroniza al entrar.

9. **Lo que no se pudo probar aquí:** un móvil de verdad (los 375 px se probaron con un
   iframe) y el inicio de sesión de Google del panel desde cero (la sesión ya estaba abierta).
