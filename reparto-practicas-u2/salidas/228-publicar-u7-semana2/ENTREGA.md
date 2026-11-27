# ENTREGA tarea 228 · Revisión y publicación del paquete 2 de la unidad 7

Sesión `s-20261127T075238-3a50920a` (27-11-2026, desde las 07:52 UTC), lanzada por el lanzador automático, sin nadie delante. Releva a
`s-20261126T215433-a6fda056` (26-11, 21:54-22:23 UTC; caducó a las 00:36Z sin cierre), que hizo la **primera pasada** (commit 8d8d15c):
no publicó nada y reabrió 212 (sigue publicada), 213, 214, 215, 216 y 217, con sus listas de reserva en `hechos/notas/`. Las seis
reabiertas cerraron entre el 26-11 por la noche y el 27-11 a las 07:54Z; esta sesión hace la **segunda pasada** sobre su código, con los
guiones que dejó la primera en /tmp/pu2-228-a6fd (copia de HEAD en `arbol/`, servida en el puerto 8328, con la línea de `base.js` que
expone el ítem al script, solo en la copia).

## Qué se publicó

Commit **d308587**: `practicas/_comun/catalogo.js` (`disponible: true` de los ids 85, 86, 88 y 89) y `docs/practicas-unidad7.md` (filas
del paquete 2 en §6 y la línea «**Publicadas** (a 2026-11-27)»). La portada no enseña la U7 hasta el lun 1-3-2027 (`UNIDADES`): hasta
entonces solo se abren por su URL.

| Práctica | Resultado |
|---|---|
| `tabla-proporcional` (213, paquete 1) | **Publicada.** Lo de sus dos reabiertas (227 y 228), comprobado |
| `regla-de-tres` (214, paquete 1) | **Publicada.** Ídem |
| `directa-o-inversa` (216) | **Publicada** |
| `repartos` (217) | **Publicada**, con una reabierta de redacción que **sigue publicada** (`hechos/reabiertas/217--s-20261127T075238-3a50920a-revision.md`): en el ej. 4 la línea de debajo repite la regla en negrita y, en «sumar en vez de multiplicar», sin números del ítem |
| `inversa` (215) | Reabierta por esta sesión (`hechos/reabiertas/215--s-20261127T075238-3a50920a-revision.md`: su «Caza el error» sacaba un caso del repaso del paquete 1 del examen 2), cerrada en b45a69e y **publicada por el relevo en 5478fca**, con una reabierta de redacción que **sigue publicada** (`hechos/reabiertas/215--s-20261127T112436-3d9a8b14-revision.md`: «1 horas» y la viñeta suelta de la resolución del ej. 4). Ver «Relevo» abajo |

## Antes de revisar: Pages en rojo (incidencia)

La publicación de Pages llevaba en rojo desde las 06:33Z (8 fallos: `directa-o-inversa`, `repartos`, sus «No lo sé» y la carga del
catálogo). Las reabiertas 216 (f7a744b) y 217 (a888b00) crearon `practicas/<slug>/reserva.js` y lo importan, pero no lo nombraron en
`git commit -- rutas`, y sus terminadas lo dan por comiteado. Se comitearon los dos ficheros sin tocarlos (**18db116**), tras comprobar
que el resto de las dos carpetas era igual a HEAD y que sus tests pasaban: `hechos/incidencias/s-20261127T075238-3a50920a.md`. Pages,
en verde desde el run de las 07:58Z.

## Cómo se revisó (segunda pasada, sobre 18db116, con la 213 ya cerrada en 0fa3d89)

- **Barridos** de 20 000 ítems por ejercicio con semilla fija (`barrido.mjs` y `barrido-tabla-regla.mjs`), con aritmética propia (enteros y
  `BigInt`): regla de oro (la buena con cada falsa y las falsas entre sí; en `directa-o-inversa`, las cuatro cuentas distintas y una sola
  buena; en `repartos`, la casilla del ej. 3 y la línea mala del ej. 4 recalculadas), variedad, cotas, notación y textos (enunciado,
  feedback de cada error y «No lo sé», buscando «÷», «×», el guion como signo, dobles espacios, el dinero sin dos decimales, la coma o el
  punto del otro idioma y la razón en un párrafo con una división).
- **Clics reales** (Chrome sin ventana, `Input.dispatchMouseEvent` e `insertText`; `clics.mjs`) en las cinco prácticas: cada ejercicio en
  español y en inglés, a 375 y a 1200 px, un acierto y un fallo: 76 combinaciones, ninguna con errores de JavaScript, diálogos ni desbordes
  (una carga de `inversa` cortada por `http.server`, la conocida). Leídos a mano los feedbacks de fallo a 375 px en las capturas. Fecha del
  navegador: 9-3-2027.
- **Cotejo con el papel**, por valor y sin contexto ni unidades: la hoja 2 (`hoja-unidad7-semana2.tex`), en claro; el examen 2
  (`casos-examen-semana2.tsv`), solo por huella. Además, las tres del paquete 1 (`razones`, `tabla-proporcional`, `regla-de-tres`) contra
  el repaso del paquete 1 del examen 2 (U7-1C-04, 1A-01, 1C-10) y los problemas directos de la hoja 2, con 200 000 ítems por ejercicio.

## Recuentos del cotejo (nunca los casos del examen)

| Práctica | Hoja 2 | Examen 2 |
|---|---|---|
| `inversa` ej. 1-3 | 0 | 0 |
| `inversa` ej. 4 | 0 | **85 de 200 000** (un caso del repaso del paquete 1: un problema directo «a ⟶ b; 1 ⟶ ?») → reabierta |
| `directa-o-inversa` ej. 2 y 3 (el ej. 1 son situaciones sin números propios: no hay casos) | 0 | 0 |
| `repartos` ej. 1-4 | 0 | 0 |
| `razones` ej. 4 | — | 0 en 200 000 |
| `tabla-proporcional` ej. 1-3 | 0 en 200 000 | 0 en 200 000 |
| `regla-de-tres` ej. 1-4 | 0 en 200 000 | 0 en 200 000 |

## Resultados por práctica

- **`tabla-proporcional`**: regla de oro, 0 fallos; variedad máxima 0,06 %; receta ≤ 1000 g en los tres ejercicios; «:» para dividir; la
  tabla del ej. 2 cabe a 375 px; arriba y abajo, en su sitio en el feedback del ej. 2.
- **`regla-de-tres`**: regla de oro, 0 fallos; variedad máxima 0,35 % (ej. 2).
- **`directa-o-inversa`**: regla de oro, 0 fallos (cuatro cuentas, cuatro valores); variedad máxima 3,5 % (ej. 1, banco de 32), un tercio de
  cada clase en el ej. 2; el dinero con dos decimales en el banco y en los pares del feedback («10,00 € → 40,00 €»; «€10.00 → €40.00»).
- **`repartos`**: todo reparto exacto; la casilla del ej. 3, única; la línea mala del ej. 4 repartida 35/32/33 %; variedad máxima 0,25 %;
  «:» para dividir y la razón en otro párrafo; «Caza el error» con el formato de Juan Luis (sin números en los recuadros, ordinal, regla en
  negrita, «Lo correcto es:»). Lo de su reabierta de redacción no impide publicar.
- **`inversa`**: todo lo de su reabierta anterior, arreglado (reserva, «:», enunciados del acta, receta ≤ 1000 g, tabla a 375 px, «Está mal:
  con más…»); regla de oro, 0 fallos; variedad máxima 1,1 %. Solo falla el caso del examen.

**Falsas alarmas del barrido** (para la próxima pasada): «no suman pero en la razón: dos casillas defendibles» en el ej. 3 de `repartos`
(las casillas son «no suman el total» y «suman el total, pero no están en la razón»: excluyentes); «mayúscula tras dos puntos» (nombres
propios: «cada uno: Maya, 3 sobres»); «N € en inglés» (dos cantidades seguidas al quitar los saltos de línea); la «coma decimal» del ej. 1 de
`tabla-proporcional` (la serialización del propio guion); la columna suelta de las latas de la hoja 1 en el ej. 3 de `tabla-proporcional`
(el criterio aceptado en la 227 es la tabla con dos o más columnas). Y en `cotejo-p1.mjs`, los ítems «al revés» de `regla-de-tres`
(`sentido: 'inversa'`) se comparaban con la respuesta `c` como dato: con la clave (b, a, d), la que usa la práctica, 0 casos.

## Relevo: la publicación de `inversa` (s-20261127T112436-3d9a8b14, 27-11, 11:24-11:40 UTC)

La sesión de arriba caducó a las 09:52Z sin cierre, con la publicación de las cuatro comiteada (d308587), esta ENTREGA y su último latido
sin comitear, y en `docs/practicas-unidad7.md` el «banco de 31» de `directa-o-inversa` cambiado a 32 (comprobado: `BANCO` tiene 32; va en
5478fca). Las tres reabiertas del paquete 2 ya estaban cerradas: 215 (b45a69e), 216 (f7a744b, antes) y 217 (51cfa73, de redacción; sigue
publicada). Sobre una copia nueva de HEAD (71baa8f), con los mismos guiones (`pasada2.sh`):

- **Cotejo**: 0 ítems de `inversa` con huella del examen 2 en 200 000 de los ej. 3 y 4 (`inv4d.mjs`), ni con las ocho huellas nuevas ni
  con las de antes; la hoja 2 y el examen 2, 0 en las tres del paquete 2 (`barrido.mjs`); el paquete 1, 0 (`cotejo-p1-v2.mjs`).
- **Barrido** de 20 000 ítems por ejercicio: regla de oro y cotas sin fallos; variedad máxima 1,1 % (ej. 3). Los avisos «N € en inglés» del
  ej. 4 de `inversa` y del ej. 1 de `directa-o-inversa` son dos líneas que se juntan al quitar los saltos («€9.00 : 5 = €1.80 €1.80 · 7»),
  no fallos.
- **Clics reales** en `inversa` (`clics.mjs inversa`): los cuatro ejercicios, es y en, a 375 y 1200 px, un acierto y un fallo: 16
  combinaciones, sin errores de JavaScript, diálogos ni desbordes.
- **Lo que no se vio antes**, en las capturas: «Respuesta de Iker: 1 horas.» Barrido propio (`plural1.mjs`): «1 horas / 1 hours /
  1 días / 1 days» en el 2,2-2,6 % de los ítems de los ej. 3 y 4 de `inversa` (enunciado y solución); 0 en `directa-o-inversa` y
  `repartos` (`plural1b.mjs`). Y la resolución del ej. 4 va en un `<ul>` sin estilo: la viñeta queda pegada al margen y la cuenta,
  centrada. Es redacción y presentación, no cambia ninguna respuesta y la portada no enseña la U7 hasta el 1-3: se publica y se reabre
  la 215 con plazo antes del lun 1-3, como la 217 de la primera pasada.

Commit **5478fca**: `catalogo.js` (`disponible: true` del id 87) y `docs/practicas-unidad7.md` («Publicadas» y el banco de 32). `npm test`
2845/2845. Quedan publicadas las cinco del paquete 1 y del paquete 2 que dependían de esta tarea: **vale el plan A**.

## Propuesta de la tarea semanal 2 (para Juan Luis; no está creada: la monta la 232 en el panel y la programa en Classroom la tarea 40 del reparto de la U7)

`U7 · 2 · Proporcionalidad inversa y repartos` / `U7 · 2 · Inverse proportion and sharing` (el nombre lo decide Juan Luis en la 232) ·
`unidad: 7` · `desde: '2027-03-08'` · `hasta: '2027-03-11'` (sale el **lun 8-3 a las 8:00**; entrega el **jue 11-3 a las 23:59**; la
prueba 2 es el vie 12-3). Segunda de las **cinco** tareas de la app (acta de la U7, punto u). Sesiones (acta): 5 lun 8-3 (inversa, tabla,
directa, inversa o ninguna), 6 mar 9-3 (problemas de inversa, decidir antes de resolver), 7 jue 11-3 (repartos). Lo de la sesión 7, que se
da **el mismo día** del plazo, va «a elegir». 10 puntos por ejercicio.

**El ★ de ortografía**: `['ortografia-tildes', 2]` ¿Lleva tilde?, de la fila «U7 · 2» de `comun/CALENDARIO-CURSO-2026-27.md` (la puso la
tarea 03 de la U7 el 24-11); el bloque `ortografia-tildes` (id 64) sigue con `disponible: true`.

### Plan A (con `inversa` publicada; **el que vale** desde 5478fca): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 2]` ¿Lleva tilde? | — (ortografía) |
| ★ | `['inversa', 1]` ¿Es inversa? | U7-2C-01 (5) |
| ★ | `['inversa', 2]` Completa la tabla | U7-2C-03 (5) |
| ★ | `['inversa', 3]` Problemas | U7-2A-01 (6) |
| ★ | `['inversa', 4]` Caza el error | U7-2A-02 (6) |
| ★ | `['directa-o-inversa', 1]` Clasifica la situación | U7-2C-02 (5-6) |
| ★ | `['directa-o-inversa', 3]` ¿Qué planteamiento? | U7-2A-02 (6) |
| ★ | `['regla-de-tres', 3]` Resuelve y contesta | U7-1A-01, 1A-05 (3; repaso, «a elegir» el 1-3) |
| elegir | `['directa-o-inversa', 2]` Clasifica la tabla | U7-2C-01, 2C-02 (5) |
| elegir | `['repartos', 1]` Cuenta las partes · `['repartos', 2]` Reparte · `['repartos', 3]` ¿Está bien repartido? · `['repartos', 4]` Caza el error | U7-2C-04, 2A-05, 2C-05 (7) |
| elegir | `['regla-de-tres', 1]` ¿Cuánto cuesta 1? · `['regla-de-tres', 2]` ¿Qué planteamiento? · `['regla-de-tres', 4]` ¿Tiene sentido? | U7-1A-02, 1C-13, 1A-05 (3; repaso) |
| elegir | `['tabla-proporcional', 4]` ¿Directamente proporcionales? | U7-1C-08 (2; repaso) |
| elegir | `['leelo7', 1]` … `['leelo7', 4]` | U7-1B-01, 1B-02, 2B-01 (desde el 8-3 enseña también lo del paquete 2) |

### Plan B (sin `inversa`; ya no hace falta): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia-tildes', 2]` ¿Lleva tilde? | — (ortografía) |
| ★ | `['directa-o-inversa', 1]` Clasifica la situación | U7-2C-02 (5-6) |
| ★ | `['directa-o-inversa', 2]` Clasifica la tabla | U7-2C-01, 2C-02 (5) |
| ★ | `['directa-o-inversa', 3]` ¿Qué planteamiento? | U7-2A-02 (6) |
| ★ | `['leelo7', 1]` La palabra | U7-1B-01, 2B-01 (1-6) |
| ★ | `['regla-de-tres', 2]` ¿Qué planteamiento? | U7-1C-13 (3; repaso) |
| ★ | `['regla-de-tres', 3]` Resuelve y contesta | U7-1A-01, 1A-05 (3; repaso) |
| ★ | `['tabla-proporcional', 4]` ¿Directamente proporcionales? | U7-1C-08 (2; repaso) |
| elegir | `['repartos', 1]` … `['repartos', 4]` | U7-2C-04, 2A-05, 2C-05 (7) |
| elegir | `['regla-de-tres', 1]` · `['regla-de-tres', 4]` · `['leelo7', 2]` … `['leelo7', 4]` | repaso y vocabulario |

## Propuestas (para la coordinadora)

1. **La lección de la incidencia**, a las fichas de las prácticas que aún se reabran: antes de cerrar, `git status --porcelain practicas/<slug>`
   tiene que salir vacío (un fichero nuevo no entra en `git commit -- rutas` si no se nombra).
2. **`docs/practicas-unidad7.md`, §7 y la entrada** siguen diciendo «propuesta… sin firmar» (F0 se firmó el 24-11) y «`unidades` solo si el
   acta…» (el acta, punto n, la deja en la U7): no es de esta tarea, porque ir al día con el acta toca también `DESTREZAS` de `registro.js`.
   Lo repite la propuesta 3 de la 227.
3. **`directa-o-inversa/practica.js`**: el comentario de cabecera cita destrezas que no son las de `DESTREZAS` (`'directa-o-inversa':
   ['U7-2A-02', 'U7-2C-02']`): el ej. 1 dice U7-2A-02 y el 3, U7-2C-01 y 2C-03. Menor; que lo ajuste la próxima reabierta de esa práctica.

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/repartos/?probar=1&idioma=es (un fallo del ej. 4: «Caza el error» sin números en los
recuadros) y http://localhost:8080/practicas/directa-o-inversa/?probar=1&idioma=en (un fallo del ej. 1: el dinero con dos decimales en los
pares). Los guiones de la revisión, en /tmp/pu2-228-a6fd (se pierden al reiniciar el Mac).
