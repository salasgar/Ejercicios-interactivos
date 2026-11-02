# Entrega de la tarea 120 · Segunda publicación de multiplica-divide, combinadas-fracciones y errores4 (semana 3 de la U4)

Sesión `s-20261102T141053-b5277421`, 2026-11-02 (encadenada tras la 119). Commit: **5e13b10** (solo `docs/practicas-unidad4.md`: **no se
publica nada**; `catalogo.js` sin tocar).

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `multiplica-divide` (105, 53) | **no pasa**: falta entera la hoja 2, ej. 11, que pedía la reabierta, y tres respuestas de U4-3C-11 del examen semanal 3 (una, el 1,8 % de los ítems del ej. 5) | sin publicar · `hechos/reabiertas/105--s-20261102T141053-b5277421-revision.md` (MEDIO, corta) |
| `combinadas-fracciones` (106, 54) | **no pasa, por muy poco**: dos casos de examen salen reordenados (1-2 de cada 100000 ítems) | sin publicar · `hechos/reabiertas/106--s-20261102T141053-b5277421-revision.md` (MEDIO, muy corta) |
| `errores4` (107, 55) | **no pasa**: tres igualdades de la hoja 2 salen con los sumandos en el otro orden (12-31 de 20000) | sin publicar · `hechos/reabiertas/107--s-20261102T141053-b5277421-revision.md` (MEDIO, muy corta) |

**Las tres se quedan sin publicador**, igual que `fraccion-de` y `suma-resta` (reabiertas por la 119): plazo **mar 22-12** (límite jue 7-1).
Las cinco reabiertas (103-107) tocan carpetas disjuntas y caben a la vez; después, **una sola tarea de publicación** (ALTO) puede revisar
y publicar las cinco, si la coordinadora la da de alta así.

## El hilo común: el orden
Las sesiones que cerraron las reabiertas del 30-10 excluyeron cada caso **en el orden en que está escrito** en la hoja o en el examen. Las
prácticas los sacan con los sumandos o los factores al revés («1/3 + 3/5 = 4/8» en vez de «3/5 + 1/3 = 4/8»), que es el mismo ejercicio.
Las reabiertas de la 119 y de esta piden lo mismo: **claves sin orden** para + y ·, y un test con un caso conmutado. Lo de
`multiplica-divide` es además un olvido: la hoja 2 no está en su lista.

## Cómo se revisó
- **Casos del papel, barrido independiente** (guiones en el scratchpad, no se comitean porque leen los casos en claro), 20000 ítems por
  ejercicio (100000 en `combinadas-fracciones`), contra los TSV de las tres semanas (con la columna `correcta`), las opciones de
  `examen-semanaN.tex` y `-extra.tex`, los cuatro `.tex` del final (también `adaptado-A` y las cajas «Find the mistake» del 5b, primera y
  última línea) y las hojas 2 y 3 sin recuadros. Claves propias, no las de las prácticas: productos sin orden, divisiones con orden,
  potencias por base y exponente, igualdades de `errores4` con el resultado mostrado y los sumandos sin orden, y expresiones combinadas por
  **números, operaciones y valor** (así sale cualquier reordenación).
  - `multiplica-divide`: ningún caso de U4-2C-08, 2C-09, 2C-12, 3C-06, 3C-07 ni 3C-10, tampoco conmutado; nada de la hoja 3 ni del banco; la
    pareja de la hoja 2, ej. 12c, ya no sale. Pero la hoja 2, ej. 11, sale entera (6 de sus 7 productos, de 2 a 20 veces). Y U4-3C-11:
    en «tres son correctas, ¿cuál está mal?», la respuesta es una cuenta mal hecha. Si la práctica pide esa cuenta, su solución da la
    respuesta. Pasa con tres variantes: una en el ej. 5 (362 de 20000), dos en el ej. 4 (1 y 2 de 20000).
  - `combinadas-fracciones`: las 82 expresiones de papel con dos o más operaciones; salen dos de examen reordenadas (arriba).
  - `errores4`: ningún caso de examen, tampoco conmutado; las tres igualdades de la hoja 2, conmutadas.
- **Navegador**: prueba de humo con clics de ratón (Chrome headless por CDP) de los 11 ejercicios a 375 px en español y a 1100 px en
  inglés: se pintan, ninguna fracción rota, sin desbordes ni excepciones, y el feedback de un fallo dice los números del ítem. No se hizo el
  acierto y el fallo de cada ejercicio en las cuatro combinaciones: las tres se reabren y su publicación los hará enteros.
- `npm test` 1364/1364.

## Propuesta de la tarea de la app de la semana 3 (para Juan Luis; no está creada)
**Sigue en espera.** La de `salidas/111-publicar-u4-semana3/ENTREGA.md` (confirmada por la 118) vale tal cual en cuanto se publiquen las
tres: tarea del **lun 11-1 al jue 14-1** (el final es el vie 15-1), **plan A** (7 ★ + 3 a elegir, `['ortografia', 7]` el primer ★); su plan B
si falta alguna (sin `multiplica-divide` no hay tarea de la semana 3 que valga). El «a elegir» `['suma-resta', 4]` necesita también
`suma-resta`, reabierta por la 119.

## Hallazgos fuera de criterio (no bloquean; decide Juan Luis)
1. **Potencias dentro de una cuenta del final**: tres de las 48 potencias del ej. 5 de `multiplica-divide` son un paso de una operación
   combinada de los modelos del final. No se cuentan como caso (la cuenta del examen pide más que la potencia), como la 118 tampoco contaba
   las inversas sueltas. Si se quieren quitar, son tres huellas.
2. Las **otras opciones** de U4-3C-11 (las tres cuentas bien hechas) también las puede pedir la práctica; no dan la respuesta, y se tratan
   como las opciones falsas de U4-1C-17 en la ENTREGA de la 119.
3. Las 11 potencias de las hojas 2 y 3 en el ej. 5 siguen pendientes de su decisión (ENTREGA de la 105: hay que ampliar antes bases o
   exponentes).

## Ficheros (git show --stat 5e13b10)
```
docs/practicas-unidad4.md | 8 +++++---
 1 file changed, 5 insertions(+), 3 deletions(-)
```

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/multiplica-divide/ → «Probar sin código» → ej. 1 hasta que salga «2 · 7/12» o
«7/12 · 2» (hoja 2, ej. 11b): sale en unos cientos de ítems.
