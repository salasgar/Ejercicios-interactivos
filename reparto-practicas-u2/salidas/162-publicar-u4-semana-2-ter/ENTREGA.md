# Entrega de la tarea 162 · Tercera publicación de fraccion-de y suma-resta (semana 2 de la U4)

Sesión `s-20261106T124028-694d9f2a`, 2026-11-06. Commit: **223e2fe** (solo `docs/practicas-unidad4.md`: **no se publica nada**;
`catalogo.js` sin tocar).

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `fraccion-de` (103, 51) | **no pasa**: el ej. 4 `dos` saca un caso de U4-1A-01 como su primer paso; el ej. 2, pasos de problemas U4-2A-02; y el ahorro de `dos` pone libros de cientos de euros | sin publicar · `hechos/reabiertas/103--s-20261106T124028-694d9f2a-revision.md` (MEDIO, corta) |
| `suma-resta` (104, 52) | **no pasa**: el ej. 3 saca casos U4-2C-03 del examen semanal 2 conmutados; el ej. 5 no excluye nada; faltan casos de las hojas 2 y 3 y del final | sin publicar · `hechos/reabiertas/104--s-20261106T124028-694d9f2a-revision.md` (MEDIO, corta) |

Lo que pedían las reabiertas del 2-11 **sí está hecho**: `queda` ya no saca U4-1A-01, 2A-02 ni 3A-04, y los ej. 1 y 2 de `suma-resta` no
sacan ningún caso de la hoja 2 ni de examen, en ningún orden. Lo que falla ahora es lo que esas reabiertas no miraban: otras variantes,
otros ejercicios y otras hojas. **Las dos se quedan sin publicador**: tienen que estar publicadas antes del **jue 17-12**.

El papel no ha cambiado desde el último barrido (`find … -newermt '2026-11-02 15:00'`: nada).

## Cómo se revisó
- **Barrido propio** (guiones en el scratchpad de la sesión; leen los casos en claro y no se comitean): los tres
  `casos-examen-semanaN.tsv` (enunciado y `correcta`), `examen-semanaN.tex` y `-extra.tex`, los cuatro `.tex` del final (modelos 1 y 2,
  recuperación, adaptado-A) y las tres hojas sin recuadros de apoyo. Claves sacadas del papel, no de la práctica: (a) fracción y
  cantidades de cada caso de U4-1A-01, 2A-02 y 3A-04, contra cada fracción **suelta** de cada ítem con su total; (b) parejas (parte, otra)
  sin orden para el ej. 3 de `fraccion-de`; (c) **términos con signo, sin orden**, de cada suma o resta lineal del papel (también los
  paréntesis de las combinadas y las líneas de los «encuentra el error»), contra los cinco ejercicios de `suma-resta`. 20000 ítems por
  ejercicio y semilla, de 3 a 5 semillas. Cada coincidencia se leyó en su contexto y se clasificó con el criterio de la 117: cuenta la
  misma tarea con los mismos datos, y también cuando la pregunta de uno es un paso del problema del otro.
- Recuentos (los casos, en las reabiertas; los de examen, solo por destreza y variante):
  - `fraccion-de` ej. 1: 0. Ej. 2: 118 de 100000 con pasos de U4-2A-02. Ej. 3: 0 (la única coincidencia es la entrada `[15, 27]` de
    `RESERVADOS.parte`, que ya no está en la hoja 1). Ej. 4: `queda` 0; `dos` 257 de 100000 con U4-1A-01 v1.
  - `suma-resta` ej. 1 y 2: 0 de examen; salen casos de las hojas 2 y 3 que `RESERVADOS` no lista. Ej. 3: 143 de 60000 con U4-2C-03
    conmutado. Ej. 4: 539 de 60000 con `HUELLAS_SUMAS`. Ej. 5: 1311 de 60000 con `HUELLAS_SUMAS`, más casos de las hojas
    (1/3 + 1/6, de la hoja 3, es el 8 % de sus ítems).
- **Regla de oro**: 3000 ítems de cada ejercicio de opción múltiple (`fraccion-de` 4, `suma-resta` 4 y 5): una sola buena, ninguna opción
  repetida o equivalente por valor, el ej. 5 con exactamente una línea mal o ninguna y sus dos razones distintas. Leídos a mano 30 ítems
  del ej. 4 de cada práctica con sus opciones: ningún distractor se puede dar por bueno.
- **Realismo** (3000 ítems): la clase de `fraccion-de`, siempre de 12 a 36; la pizza de `suma-resta` ej. 4, siempre de 3 a 15 trozos.
  **Falla** el ahorro de `fraccion-de` ej. 4 `dos`: el libro cuesta más de 60 € en el 90 % de esos ítems (está en la reabierta).
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent`, «Probar sin código», guion de la 119
  adaptado): un acierto y un fallo de **cada** uno de los 9 ejercicios a 375 px en español, con el feedback ligado a los números del
  ítem, las fracciones enteras, sin desbordes y sin excepciones en la consola. No se hicieron inglés ni 1100 px: las dos se reabren y la
  tarea que las publique las hará enteras.
- Tests: `node --test tests/practicas-comun.test.js tests/practicas-fraccion-de.test.js tests/practicas-suma-resta.test.js` 77/77;
  `npm test` 1585/1585.

## Propuesta de la tarea de la semana 2 (para Juan Luis; no está creada)
**Sigue en espera.** El plan A de `salidas/110-publicar-u4-semana2/ENTREGA.md` (7 ★ + 3 a elegir; lun 21-12 → jue 7-1) vale tal cual en
cuanto se publiquen las dos; los repasos de su lista «elegir» (`equivalentes` 4, `compara` 1, `simplifica` 3) ya están publicados. Sin
`suma-resta` no hay tarea de la semana 2 que valga (plan B de la 110). Si se publica `suma-resta` y no `fraccion-de`, vale el plan B de la
110 sin cambios. **La 121 no puede montarla todavía.**

## Hallazgos fuera de criterio (no bloquean; deciden Juan Luis o la coordinadora)
1. **Problemas inversos** en `fraccion-de` ej. 4 `parte` y `restante`: salen con los mismos tres números que un caso de U4-1A-01 (la
   cantidad del examen es la respuesta de la práctica y la respuesta del examen es su dato; 64 de 20000) o de U4-2A-02. No es la misma
   tarea ni un paso de ella; si se quieren fuera, son claves `n/d|total` más.
2. **3C-11 del examen semanal 3, opciones que están bien**: cinco cuentas correctas de las opciones (no la que está mal) salen en el ej. 2
   de `suma-resta`. Con el criterio de la 119 (una opción que no es la respuesta no da la respuesta), no se reabre por ellas.
3. **Un paso compartido**: en `fraccion-de` ej. 4 `dos`, un ítem con una fracción y el total de un U4-2A-02 y otra fracción distinta
   comparte el primer paso con el examen sin preguntarlo. La reabierta lo excluye de paso (sobre-exclusión, como la 103), pero no era fallo.
4. **El tablón** llevaba desde el 5-11 sin regenerarse entero (sin filas 162 y 163, con la 122, la 134 y la 137 sin LISTA): se regeneró al
   reclamar, con un guion que recalcula todas las filas desde `hechos/`.

## Ficheros (git show --stat 223e2fe)
```
 docs/practicas-unidad4.md | 12 +++++++-----
 1 file changed, 7 insertions(+), 5 deletions(-)
```
