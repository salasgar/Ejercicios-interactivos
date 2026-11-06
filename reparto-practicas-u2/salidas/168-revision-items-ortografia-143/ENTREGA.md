# ENTREGA · Tarea 168 · Revisión de los ítems nuevos de la 143 y §6 con alrededor / en medio

Sesión: `s-20261106T144157-a6fa2e7c`. Commit del código: **`ac96790`**. Fecha: 2026-11-06.

## Ficheros
`practicas/ortografia/tildes.js` (2 frases), `practicas/ortografia/signos.js` (1 ítem), `docs/practicas-ortografia.md` (§6, una
entrada). Ningún ítem aprobado antes de la 143 se toca; ningún nivel cambia; ningún ítem se quita (la clave es la posición).

## Veredicto
**47 ítems leídos** (los que añadió la 143 con `git show 444f826`: 2 de e/he, 2 de echo/hecho, 5 de porque, 3 pares de comas,
13 interrogativos, 10 diacríticas, 10 de signos, 2 incisos), cada uno con las dos palabras (o con cada mala) puestas:
**44 bien, 3 corregidos, 0 quitados.** Ningún nivel queda corto.

| Ej. | Antes | Después | Por qué |
|---|---|---|---|
| 9 diacríticas (n. 3) | `No me acuerdo _ cerré la puerta.` | `No recuerdo _ cerré la puerta.` | «acordarse» pide «de» (DPD, *acordar(se)*); la frase modelaba el queísmo en un ejercicio de ortografía. Sigue evaluando el «si» que pregunta. |
| 9 diacríticas (n. 3) | `Mira _ está abierta la tienda.` | `Comprueba _ está abierta la tienda.` | Con «sí», «Mira, sí está abierta la tienda» solo pide una coma: el distractor no era inequívocamente falso para un alumno de 1.º. «Comprueba» no admite esa lectura. |
| 10 signos (n. 3) | `Tengo dos hermanos, Pablo y Marta.` (y sus dos malas) | `Tengo un hermano, una hermana y un perro.` (malas: `…hermano,una…` falta espacio; `…hermano , una…` sobra espacio) | La «buena» no lo era sin discusión: delante de una enumeración que anuncia, la norma pide dos puntos («Tengo dos hermanos: …»), y además se puede leer como vocativo. Ahora es una coma de enumeración; evalúa lo mismo (el espacio tras la coma). |

Revisados con especial cuidado, y bien: los cinco «¿Sabes _ …?» de nivel 3 (con la otra palabra ninguno se puede decir: no son
del tipo «Dime _ quieres»); los relativos sin tilde (`donde`, `quien`, `como`); el «sí» de contraste; los cuatro «si … porque»
de nivel 3 (con «por qué» no hay frase; «Explícame si te ríes porque es gracioso» se queda aunque es la menos natural, porque
hace pareja con «Explícame por qué…» del mismo nivel, que es lo que el nivel 3 entrena); los tres pares de comas (cada sentido lo
dice una sola frase).

**§6:** añadidas **alrededor / al rededor** y **en medio / enmedio** en la línea de las palabras juntas o separadas, con la
misma forma que la lista de `proyecto.md`. `grep -rn "al rededor\|enmedio" practicas/`: solo `ortografia-palabras/logica.js`,
que los tiene en su lista de exclusión (nunca como malos).

## Cómo se probó
`node --test tests/practicas-ortografia.test.js tests/practicas-ortografia-comun.test.js`: 35/35. `npm test`: 1595/1595.
Las explicaciones de los tres ítems cambiados salen de las mismas plantillas (`DIACRITICA.si`, `ESPACIO_ANTES`, `SIN_ESPACIO`),
que encajan con las frases nuevas.

## Hallazgos fuera de criterio (decisiones para Juan Luis)
1. **Niveles discutibles, no cambiados** (cambiarlos descompensaría los 8/8/8 de los ejercicios 7 y 11): el par «—No, tengo
   calor / —No tengo calor» (nivel 2) es igual de fácil que «—No, tengo hambre» (nivel 1); el inciso «Mi prima, que estudia en
   Madrid, …» (nivel 2) mide lo mismo que «Mi abuela, que vive en Murcia, …» (nivel 1). Ninguno es un error.
2. **El §6 y la lista de `proyecto.md` no recogen dos pares que `ortografia-palabras/logica.js` ya excluye**: *enhorabuena / en
   hora buena* y *tal vez / talvez* (la RAE admite las dos). Convendría añadirlos a las dos listas para que los bloques futuros
   no los usen como malos (decisión de la coordinadora; no es de esta ficha).
3. **Nombres de pila**: «Sara» (signos, nivel 2) coincide con el nombre de una alumna real, como otros nombres sueltos ya
   aprobados del banco. El test `sin-nombres-de-alumnos` busca a propósito pares nombre-apellido y no nombres sueltos, así que
   se queda; si Juan Luis prefiere bancos sin ningún nombre de pila de sus alumnos, es una regla nueva para todos los bloques.
