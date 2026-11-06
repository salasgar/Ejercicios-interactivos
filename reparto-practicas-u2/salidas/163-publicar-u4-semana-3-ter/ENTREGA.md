# Entrega de la tarea 163 · Tercera publicación de multiplica-divide, combinadas-fracciones y errores4 (semana 3 de la U4)

Sesión `s-20261106T144236-e32305eb`, 2026-11-06. Commit: **d983891** (solo `docs/practicas-unidad4.md`: **no se publica nada**;
`catalogo.js` sin tocar).

## Resultado
| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `multiplica-divide` (105, 53) | **no pasa**: casos de la hoja 3 que no lista (ej. 1 y 4) y tres casos de examen U4-3C-10 con el signo en el otro operando | sin publicar · `hechos/reabiertas/105--s-20261106T144236-e32305eb-revision.md` (MEDIO, corta) |
| `combinadas-fracciones` (106, 54) | **no pasa, por poco**: expresiones de la hoja 3 que no lista; en el ej. 3, líneas de en medio que son casos de la hoja y el paso malo de una caja del final | sin publicar · `hechos/reabiertas/106--s-20261106T144236-e32305eb-revision.md` (MEDIO, corta) |
| `errores4` (107, 55) | **no pasa**: cinco casos de los exámenes semanales 1 y 3 (U4-1C-08, U4-1A-01, U4-2C-12) y casos de las hojas 1, 2 y 3 | sin publicar · `hechos/reabiertas/107--s-20261106T144236-e32305eb-revision.md` (MEDIO, corta) |

Lo que pedían las reabiertas del 2-11 **sí está hecho** en las tres. Lo que falla ahora es lo que esas reabiertas no miraban, como en la
162: `errores4` filtra por plantilla y no por la expresión que ve el alumno, y ningún barrido anterior comparaba sus cuentas de una sola
operación; las listas de la hoja 3 de `multiplica-divide` y `combinadas-fracciones` estaban incompletas. **Las tres se quedan sin
publicador**: plazo **mar 22-12** (límite jue 7-1; mejor antes del mar 8-12, el de la 121).

El papel no ha cambiado desde el último barrido (`find … -newermt '2026-11-02 15:00'`: nada).

## Cómo se revisó
- **Barrido propio** (guiones en el scratchpad de la sesión; leen los casos en claro y no se comitean): los tres `casos-examen-semanaN.tsv`
  (enunciado y `correcta`), `examen-semanaN.tex` y `-extra.tex`, los cuatro `.tex` del final (modelos 1 y 2, recuperación y adaptado-A,
  con sus cajas «Find the mistake») y las tres hojas sin recuadros de apoyo. Claves sacadas del papel, no de las prácticas: firma
  «números, operaciones y valor» de toda cuenta (encuentra cualquier reordenación y cualquier sitio del signo), términos con signo sin
  orden, igualdades «cuenta = resultado», potencias, inversas, «fracción de una cantidad», fracción de una fracción (también «… of the
  rest»), simplificar, comparar, y los **pasos** de cada combinada del papel. 20000 ítems por ejercicio (100000 en `combinadas`), semillas
  163, 7 y 11; los casos que van a las reabiertas, contados otra vez con 100000 ítems y clave exacta.
- **Comprobación del barrido**: antes de fiarse de un cero, se miró que el lector ve los casos que las prácticas ya excluyen. La primera
  versión no veía los apartados `\mbox{a) …}` ni los «X and Y» de las hojas (1 de 31): arreglado, ve todos los que siguen en las hojas.
- Recuentos (los casos, en las reabiertas; los de examen, solo por destreza y variante):
  - `multiplica-divide`: ej. 1, hoja 3 6b y 7a (3 y 9 de 100000); ej. 4, hoja 3 3b, 3c y la corrección de 12b (9, 8 y 5 de 100000) y
    U4-3C-10 del semanal 3 (v2, v4, extra 1) con el signo en el divisor (8 de 100000). Ej. 2, 3 y 5: nada que no sea una excepción ya
    pendiente de Juan Luis.
  - `combinadas-fracciones`: ej. 1 y 2, hoja 3 8c y 9a (1 de 100000 cada una); ej. 3, la primera línea, 9a (1 de 100000); líneas de
    en medio de dos operaciones que son 8a, 8b, 8c y 12d (6 de 100000) y el paso malo de la caja del modelo 1 (2 de 100000).
  - `errores4`: U4-2C-12 (extra 1 y 2) de 20 a 41 por variante y ejercicio; U4-1C-08 (v1 y v2) de 32 a 110; U4-1A-01 (v1) de 7 a 11; en
    20000 ítems y en los tres ejercicios. Hojas 1, 2 y 3: 13 casos (listados en la reabierta).
- **Regla de oro**: 3000 ítems por ejercicio, por valor: en `combinadas` ej. 2, de 2 a 3 falsas en cada paso de cada orden válido, distintas
  entre sí y de la buena, todas con su error; ej. 3, una sola línea mala, en su sitio y del tipo dicho, y el error cambia el resultado. En
  `errores4`, verdaderas y falsas bien marcadas, una sola línea falsa en el ej. 2, ningún nombre de error de su grupo ni que explique el
  resultado mostrado, y el corrector del ej. 3. En `multiplica-divide` (sin opciones), la buena nunca se nombra como error y los dos errores
  del ej. 5 dan valores distintos de la buena y entre sí. Leídos a mano 12 ítems del ej. 2 de `combinadas` con sus opciones, 10 del ej. 3,
  14 del ej. 1 y 10 del ej. 2 de `errores4` y 6 potencias: ningún distractor se puede dar por bueno. Sin fallos.
- **Regla de Juan Luis** (jerarquía): en `1/2 · 2/3 + 3/4 · 1/5`, tocar cualquiera de los dos productos vale.
- **Realismo** (3000 ítems): las cuadrículas del ej. 2 de `multiplica-divide`, siempre dentro del máximo de su contexto.
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent`, «Probar sin código», servidor propio en el 8163):
  los **11 ejercicios** a 375 y 1100 px, en español y en inglés (44 combinaciones): se pintan, sin desbordes, ninguna fracción rota, sin
  excepciones en la consola, y el feedback de un fallo dice los números del ítem. No se hizo el acierto y el fallo de cada ejercicio en las
  cuatro combinaciones: las tres se reabren y la tarea que las publique lo hará entero.
- Tests: `node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js tests/practicas-combinadas-fracciones.test.js
  tests/practicas-errores4.test.js` 104/104; `npm test` 1624/1624.

## Propuesta de la tarea de la semana 3 (para Juan Luis; no está creada)
**Sigue en espera.** El plan A de `salidas/111-publicar-u4-semana3/ENTREGA.md` (7 ★ + 3 a elegir, `['ortografia', 7]` el primer ★; tarea del
**lun 11-1 al jue 14-1**, el final es el vie 15-1) vale tal cual en cuanto se publiquen las tres: las reabiertas no cambian el número ni el
orden de los ejercicios. Su «a elegir» `['suma-resta', 4]` necesita también `suma-resta`, que la 162 reabrió hoy; si no está publicada a
tiempo, en su lugar `['simplifica', 3]` (publicada). Sin `multiplica-divide` no hay tarea de la semana 3 que valga (plan B de la 111). **La
121 no puede montarla todavía.**

## Hallazgos fuera de criterio (no bloquean; deciden Juan Luis o la coordinadora)
1. **Una tarea de publicación nueva** para las cinco de la U4 sin publicar (103-107): las cinco reabiertas tocan carpetas disjuntas y caben a
   la vez; después, una sola publicación (ALTO) puede revisarlas todas. Que esa sesión use una clave que no dependa ni del orden ni del sitio
   del signo, mire **todas** las líneas que enseña un ítem y compruebe primero que su lector ve los casos que ya están excluidos.
2. **Excepciones pendientes** de la 118 y la 120 (siguen igual): inversas sueltas; potencias de las hojas en el ej. 5 de `multiplica-divide`
   (ahora seis); las tres potencias que son un paso de una cuenta del final (salen también en `errores4`).
3. **`combinadas` ej. 3**: las líneas de una sola operación coinciden a veces con cuentas sueltas del papel (en la reabierta).
4. **Variantes sin signo** de los U4-3C-10 en `multiplica-divide` ej. 4 (resultado distinto): no se cuentan.
5. En `multiplica-divide` ej. 5, el feedback de quien deja la base sin elevar habla de «multiplicar por el exponente» (en la reabierta, de
   paso).

## Ficheros (git show --stat d983891)
```
 docs/practicas-unidad4.md | 11 +++++++----
 1 file changed, 7 insertions(+), 4 deletions(-)
```
