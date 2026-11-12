# ENTREGA · Tarea 170 · Publicar `multiplica-divide`, `combinadas-fracciones` y `errores4` (semana 3 de la U4, cuarta publicación)

Este fichero lleva las dos pasadas de la 170: la **segunda** (arriba, sesión `s-20261112T183052-98cf3c42`) y la **primera** (abajo, sin
tocar, sesión `s-20261112T010355-f006a9a8`).

# Segunda pasada (12-11, s-20261112T183052-98cf3c42): solo lo reabierto el 12-11

Commit **25d833d** (`catalogo.js`: solo `disponible: true` de la fila 54; `docs/practicas-unidad4.md`: la línea de publicadas). Terminada
**PARCIAL** otra vez: se publica una de las tres y las otras dos vuelven a reabrirse, cada una por dos casos de la **hoja 2** escritos en
palabras. Las dos reabiertas son de una línea de datos: MEDIO, cortas.

## Veredicto

| Práctica (tarea, id) | Lo que pedía la reabierta del 12-11 | Veredicto | Estado |
|---|---|---|---|
| `combinadas-fracciones` (106, 54) | hecho: la hoja 3 8e, el U4-3A-01 de la recuperación y la caja de Pablo del modelo 2 ya no salen con el menos en otro sitio | **pasa** | **publicada** (25d833d) |
| `multiplica-divide` (105, 53) | hecho: ningún producto de U4-3C-09 ni de U4-2A-06, ni el «número : fracción» de U4-1A-02 | **no pasa**: el ej. 1 pide los productos de la hoja 2, ej. 12a-b («4/5 of 5/12», «4/9 of 3/8»), que la hoja escribe con «of» | sin publicar · `hechos/reabiertas/105--s-20261112T183052-98cf3c42-revision.md` |
| `errores4` (107, 55) | hecho: la suma de la caja de Sara en ninguna plantilla, la hoja 1 5b y 8e, ninguna comparación de los semanales | **no pasa**: salen las potencias de la hoja 2, ej. 13f-g («five sixths squared», «three quarters cubed»), en palabras | sin publicar · `hechos/reabiertas/107--s-20261112T183052-98cf3c42-revision.md` |

Los cuatro casos nuevos son de hoja (por eso van en claro) y son la misma trampa que el «a quarter of 52» de la primera pasada: **ningún
lector anterior leía las cuentas que la hoja escribe en palabras**. Con el criterio del 11-11 («el mismo enunciado o cuenta, con los mismos
datos») se reabren; la única exención de potencias de hoja es la del ej. 5 de `multiplica-divide`.

El papel no ha cambiado desde el 9-11 (`find … -newermt '2026-11-09 18:15'`: nada; último commit de la carpeta de la unidad, eeed01f).

## Cómo se revisó

- **Barrido propio** (guion en el scratchpad, fuera del repo), con un analizador propio de las cadenas de los ítems y una **clave propia**:
  átomos sin signo (en crudo y sin orden), número de sumas y restas, productos, cocientes y potencias, y el valor exacto; aparte, el número
  de menos, para separar «el signo en otro operando» (criterio) de «dos menos más o menos» (fuera de criterio). Casos del papel
  transcritos de los `.tsv` y `.tex` y comparaciones leídas de los seis `examen-u4-semanaN*.tex`.
- **Comprobación del lector**: ve las 11 de `EXPRESIONES_HOJA`, las 23 huellas de examen de `combinadas-fracciones`, las 12 huellas
  nuevas de producto y las 7 nuevas de cociente de `multiplica-divide`; de las comparaciones, 648 leídas y 54 parejas distintas.
- **666000 ítems**: 60000 por ejercicio en `multiplica-divide` (ej. 1, 2 y 4) y en `errores4` (ej. 1, 2 y 3), 102000 por ejercicio en
  `combinadas-fracciones`; semillas 170, 7 y 2026. 0 ítems que el analizador no lea.
- **Recuentos** (sin casos de examen en claro):
  - `combinadas-fracciones`: **0** casos de criterio en los tres ejercicios (ninguna expresión de las hojas 2 y 3, de U4-3A-01 y 3A-02 de
    los semanales y del final, ni ninguna primera línea de caja, con el mismo número de menos; ninguna línea de dos o más operaciones del
    ej. 3; ningún paso malo de caja). Solo la misma cuenta con **dos menos** más o menos que el papel: de 1 a 5 por ejercicio, fuera de
    criterio, como ya decía la reabierta.
  - `multiplica-divide`: 0 de U4-3C-09, U4-2A-06 y U4-1A-02; **33** ítems del ej. 1 con los productos de la hoja 2, ej. 12a-b.
  - `errores4`: 0 de la caja de Sara, de la hoja 1 5b y 8e y de las comparaciones (de las 54 parejas, 9 tienen denominadores de la
    práctica y ninguna la puede generar: solo saca parejas en las que el error se nota, y sus 163 parejas posibles salen todas en 600000
    ítems sin ninguna de esas 9); **692, 892 y 893** ítems (ej. 1, 2 y 3) con las potencias de la hoja 2, ej. 13f-g.
- **No se cuela nada por el cambio de `prohibido`** de la 107 (las comparaciones vuelven antes de mirar `PARAMS_HOJA` y `HUELLAS_EXAMEN`):
  esas dos listas son de sumas y una comparación no casaba nunca con ellas.
- **Navegador** (solo `combinadas-fracciones`, la que se publica): desde la primera pasada solo cambió su `logica.js` (la clave de
  exclusión), así que la prueba es de regresión. Chrome headless por CDP con clics de ratón (`Input.dispatchMouseEvent`), «Probar sin
  código», servidor propio en el 8170, idioma por URL: los tres ejercicios a 375 y a 1100 px, en español y en inglés (12 ítems, con aciertos
  y fallos en los tres), feedback con los números del ítem, fracciones enteras (capturas revisadas), sin desbordes, **consola limpia**.
- Tests: las cuatro baterías 110/110; `npm test` **1808/1808** con la publicación.

## Propuesta de la tarea de la semana 3 (para Juan Luis; no está creada)

**Sigue en espera.** El plan A de `salidas/111-publicar-u4-semana3/ENTREGA.md` (7 ★ + 3 a elegir, `['ortografia', 7]` el primer ★; del **lun
11-1 al jue 14-1**; el final es el vie 15-1) vale tal cual en cuanto se publiquen las tres: las reabiertas no cambian ni el número ni el
orden de los ejercicios, y su «a elegir» `['suma-resta', 4]` vale (la 169 publicó `suma-resta`). Puntúa sobre 100 (tarea 166): 10
ejercicios, 10 puntos cada uno. Sin `multiplica-divide` no hay tarea de la semana 3 que valga (plan B de la 111), así que **la 121 todavía
no puede montar la semana 3**. Si cuando cierre la 105 la 107 aún no estuviera, vale el plan A «sin `errores4`» de la 111 (con
`['suma-resta', 2]`, `['simplifica', 3]` y `['fraccion-de', 4]` en su lugar entre los «a elegir»), todos publicados.

## Hallazgos fuera de criterio (no bloquean; deciden Juan Luis o la coordinadora)

1. **`multiplica-divide` ej. 1**: dos productos que son **un paso** de las cajas «Find the mistake» del final (Marta, modelo 2; Nora,
   recuperación): 21 en 60000. No son el paso malo ni el caso entero.
2. **`errores4` ej. 2**: líneas **intermedias** que son fracciones de las simplificaciones de las hojas 1 y 2 (1238 en 60000), y el paso de
   simplificar el final de la caja de Marta (517); como pregunta del ítem, ninguna.
3. **`errores4`, comparaciones con los dos signos cambiados** respecto a una pareja del papel (plantilla `ignora-el-signo`): 4 parejas
   generables. Son otra comparación con otro resultado.
4. **`combinadas-fracciones`**: las de dos menos más o menos (arriba), como en la primera pasada.
5. Para la próxima pasada: los cuatro casos nuevos salen de un lector que no leía **cuentas en palabras de las hojas** («of» entre dos
   fracciones, «squared», «cubed»). Repasadas todas las cuentas en palabras de las hojas 1-3 (búsqueda de ordinales, «of», «times»,
   «divided by», «quotient», «sum», «difference», «subtract», «squared», «cubed»), con el barrido no queda ninguna más que estas tres
   prácticas pregunten: la hoja 1 5g («3 out of every 7» de 28), la hoja 2 9b (dos sumas y una resta en palabras), la hoja 3 1f («four
   thirds squared») y su «Write with numbers» (tres cocientes, ya en `PAREJAS_HOJA_DIVIDE`) dan 0. La hoja 2 9b también la tiene excluida
   `suma-resta` (publicada por la 169).

---

# Primera pasada (12-11, s-20261112T010355-f006a9a8)

Sesión `s-20261112T010355-f006a9a8`, 2026-11-12. Commit **0f656e7** (solo `docs/practicas-unidad4.md`: **no se publica nada**;
`catalogo.js` sin tocar). Terminada **PARCIAL**: esta tarea se vuelve a reclamar cuando cierren las tres reabiertas, para revisar solo lo
reabierto y publicar.

## Veredicto

| Práctica (tarea, id) | Veredicto | Estado |
|---|---|---|
| `multiplica-divide` (105, 53) | **no pasa**: el ej. 1 pide productos que son la cuenta entera de casos de examen (U4-3C-09 del semanal 3, U4-2A-06 del semanal 2) y el ej. 4, el cociente que resuelve un U4-1A-02 del final | sin publicar · `hechos/reabiertas/105--s-20261112T010355-f006a9a8-revision.md` (MEDIO, corta) |
| `combinadas-fracciones` (106, 54) | **no pasa, por muy poco**: su clave distingue un menos de restar de uno de signo; salen la hoja 3, 8e, y dos casos del final con el menos en otro sitio (1 a 3 veces en 102000) | sin publicar · `hechos/reabiertas/106--s-20261112T010355-f006a9a8-revision.md` (MEDIO, corta) |
| `errores4` (107, 55) | **no pasa**: el paso malo de una caja del final sale por otra plantilla; la hoja 1, 5b (en palabras) y 8e (simplificar); una comparación de U4-1C-19 del semanal 1 | sin publicar · `hechos/reabiertas/107--s-20261112T010355-f006a9a8-revision.md` (MEDIO, corta) |

Lo que pedían las reabiertas del 6-11 **sí está hecho** en las tres. Lo que falla es, otra vez, lo que nadie había mirado: problemas cuya
cuenta entera es un producto o un cociente, el menos de restar frente al de signo, las simplificaciones y las comparaciones de
`errores4`, y una huella atada a una sola plantilla. Todo entra en el criterio de reapertura del 11-11 (el mismo enunciado o cuenta, en
cualquier orden y con el signo en cualquier operando; la respuesta de un caso de examen pedida tal cual); lo que el criterio deja fuera
está abajo, en hallazgos, con sus recuentos.

**Además de lo reabierto, todo lo demás está revisado y en verde** (regla de oro, realismo, navegador): la tarea que las publique solo
tiene que comprobar lo de las tres reabiertas.

El papel no ha cambiado desde el último barrido (`find … -newermt '2026-11-09 18:15'`: nada; el último commit de la carpeta de la unidad
sigue siendo eeed01f, el de los nombres).

## Cómo se revisó

- **Barrido propio** (guiones en el scratchpad, fuera del repo). Lector del papel (el de la 169, ampliado con potencias, «of» como
  producto, operaciones en palabras —«divided by», «the quotient of A and B», «divide A by B»— y las cajas «Find the mistake» del final en
  `calculo` y en `array`): los tres `casos-examen-semanaN.tsv` (120 filas cada uno), `examen-u4-semanaN.tex` (1020 ítems cada uno) y
  `-extra.tex` (60), los cuatro `.tex` del final (modelos 1 y 2, recuperación y adaptado-A, con sus siete cajas) y las tres hojas sin
  recuadros de apoyo; 17250 trozos.
- **Comprobación del lector** (trampa de la 163), antes de fiarse de un cero: ve **todas** las huellas de examen de las tres prácticas
  (`multiplica-divide` 15 de producto, 23 de cociente y 7 de potencia; `combinadas-fracciones` 23; `errores4` las 18 de vista), las 11
  expresiones de hoja de `combinadas`, 12 de las 13 claves de hoja de `errores4` y 31 de las 35 parejas de hoja de `multiplica-divide`
  (las que no ve no están en las hojas: tres son del banco, B11a-c, y una es un problema de la hoja 2, 12c, escrito en palabras; la clave de
  hoja que no ve de `errores4` es un paso de ese mismo problema).
- **Clave propia, sacada del papel**: toda subexpresión de cada trozo, con sus átomos en valor absoluto (irreducibles y en crudo), el
  número de productos, cocientes y potencias y el valor; así salen todas las reordenaciones y el signo en cualquier operando, y la suma
  se distingue de la resta por el valor. Cada coincidencia se marca «entera» o «trozo de una cuenta mayor» y con el número de menos de
  cada lado, y se leyó en su contexto. Aparte: pasos «línea k → k+1» de cadenas de igualdades y de las cajas, fracción de una cantidad en
  problemas en palabras, parejas de un problema con contexto (producto y cociente) y comparaciones por pareja con signo.
- **Recuentos** (60000 ítems por ejercicio de `multiplica-divide` y `errores4`, 102000 de `combinadas`; semillas 170, 7 y 2026; casos
  reabribles, sin escribirlos):
  - `multiplica-divide`: ej. 1, 39 ítems de U4-3C-09 (6 casos) y 34 de U4-2A-06 (6 casos); ej. 4, 11 de U4-1A-02 (1 caso); ej. 2, 3 y 5,
    ninguno. Lo que pedía la reabierta del 6-11 (hoja 3 y el signo en el otro operando), 0.
  - `combinadas-fracciones`: ej. 1, 2 (hoja 3 8e y U4-3A-01 de la recuperación); ej. 2, 3 (hoja 3 8e); ej. 3, 2 primeras líneas (la
    recuperación y la caja de Pablo del modelo 2). Pasos de las cajas: el paso malo de ninguna caja con sus datos.
  - `errores4`: la suma de la caja de Sara (modelo 1) 133, 160 y 155 en los ej. 1, 2 y 3; hoja 1 5b 42, 84 y 54; hoja 1 8e 50, 55 y 57;
    U4-1C-19 del semanal 1, 436 comparaciones del ej. 1. U4-2C-12, U4-1C-08 y U4-1A-01 de los exámenes, 0.
- **Regla de oro**, 3000 ítems de cada uno de los 11 ejercicios, por valor con `_comun/fracciones.js`: `multiplica-divide`, la buena es la
  cuenta e irreducible y nunca se nombra como error, los dos métodos de dividir dan lo mismo, los dos errores de la potencia distintos
  entre sí y de la buena y bien nombrados; `combinadas`, ningún paso válido cambia el valor (regla de Juan Luis), en el ej. 2 de 2 a 3
  falsas distintas por valor, todas con su error, y en el ej. 3 una sola línea mala, en su sitio y del tipo dicho, y el error cambia el
  resultado; `errores4`, verdaderas y falsas bien marcadas (también las comparaciones), en el ej. 1 el nombre bueno entre tres, ninguno del
  mismo grupo ni que explique el resultado mostrado, en el ej. 2 exactamente una línea falsa y en su sitio, el corrector del ej. 3.
  **0 fallos.** Leídos a mano 30 ítems falsos del ej. 1 de `errores4` con sus nombres, 12 del ej. 2 y 30 pasos del ej. 2 de `combinadas`
  con todas sus opciones: ningún distractor ni nombre se puede dar por bueno.
- **Realismo**: el único contexto es el del ej. 2 de `multiplica-divide` (tableta y huerto ≤ 24 trozos, bandeja ≤ 20): 3000 ítems, todos
  dentro.
- **Navegador con clics de ratón** (Chrome headless por CDP, `Input.dispatchMouseEvent` en el centro del elemento visible, «Probar sin
  código», servidor propio en el 8170, idioma fijado por URL; el ítem se resuelve leyendo la pantalla con la lógica de la propia
  práctica): un acierto y un fallo de **cada uno de los 11 ejercicios** a **375 px** y a **1100 px**, cada práctica en **español** a un
  ancho y en **inglés** al otro (52 ítems; en `combinadas` ej. 2, la cadena entera tocando y eligiendo cada paso, con un valor malo en el
  fallo; en `errores4` ej. 1, también el nombre del error). El feedback dice qué ha pasado con los números del ítem; las fracciones se ven
  enteras (capturas revisadas); sin desbordes horizontales ni recortes; **sin excepciones ni errores en la consola**.
- Tests: `node --test tests/practicas-comun.test.js tests/practicas-multiplica-divide.test.js tests/practicas-combinadas-fracciones.test.js
  tests/practicas-errores4.test.js` 109/109; `npm test` 1807/1807.

## Propuesta de la tarea de la semana 3 (para Juan Luis; no está creada)

**Sigue en espera.** El plan A de `salidas/111-publicar-u4-semana3/ENTREGA.md` (7 ★ + 3 a elegir, `['ortografia', 7]` el primer ★, que es el
que el calendario pone para U4 · 3; tarea del **lun 11-1 al jue 14-1**, el final es el vie 15-1) vale tal cual en cuanto se publiquen las
tres: las reabiertas no cambian el número ni el orden de los ejercicios. Su «a elegir» `['suma-resta', 4]` **ya vale**: la 169 publicó
`suma-resta` (a9216a1), así que no hace falta el cambio a `['simplifica', 3]` que propuso la 163. Puntúa sobre 100 (tarea 166): 10
ejercicios, 10 puntos cada uno. Sin `multiplica-divide` no hay tarea de la semana 3 que valga (plan B de la 111). **La 121 puede montar ya
la semana 2** (la dejó lista la 169); la semana 3, no todavía.

## Hallazgos fuera de criterio (no bloquean; deciden Juan Luis o la coordinadora)

1. **La misma cuenta con dos menos más o menos que el papel** (`combinadas`, `errores4`): `1/3 − 2/3 · (−3/4)` frente a la hoja 3, 8a;
   `1/3 − 1/2 · (−2/5)` frente a la 12d; y, del final y del semanal 3, tres casos más (dos cajas y un U4-3A-01) escritos sin sus dos menos o
   con dos añadidos: de 1 a 3 veces por ejercicio en 102000. En `errores4`, la línea 2 de la caja de Marta (modelo 2) sin sus dos menos y
   ya simplificada sale como suma en los tres ejercicios (234, 293 y 311 en 60000), y en el ej. 3 de `combinadas`, esa misma pareja de
   líneas, 9 veces en 100000. El criterio habla del signo «en cualquier operando», no de quitar o poner dos; la clave nueva que pide la
   reabierta de la 106 los deja fuera con una línea (contar los menos por paridad) si se quiere.
2. **Pasos y trozos, no el caso**: sumas que son el segundo paso de la hoja 2, 2a (simplificar antes) en `errores4`; parejas de dos de las
   cuatro fracciones de un U4-1C-20 («Put in order») en las comparaciones de `errores4` (de 32 a 778 en 12096); el lado derecho de una
   cuenta mal hecha de U4-3C-11 en el ej. 1 de `multiplica-divide`; las líneas de una sola operación del ej. 3 de `combinadas`.
3. **La misma igualdad, otra pregunta**: el ej. 1 de `errores4` enseña la igualdad de un U4-2B-02 del semanal 2 («How do you read …?»)
   32 veces en 60000; el examen pide leerla en palabras.
4. **Opciones que no son la respuesta** (criterio de la 119 y del 11-11): las de U4-2A-04 en el ej. 1 de `multiplica-divide` y las cuentas
   bien hechas de U4-3C-11 en su ej. 4; una opción no buena de U4-1C-14 del semanal 1 en las simplificaciones de `errores4`.
5. Las **potencias de las hojas** en el ej. 5 de `multiplica-divide` y las **inversas sueltas** del ej. 3 (criterio del 11-11).
6. Cosméticos: a 375 px, una primera línea larga del ej. 3 de `combinadas` se parte dentro del paréntesis (las fracciones, enteras); en el
   ej. 2 de `errores4`, la línea de «elevar solo el numerador» de `(3/4)^3` se ve como `3 · 3 · 3/4` (vale lo mismo, pero no se lee como
   «3 · 3 · 3 partido por 4»); en la barra del ejercicio a 375 px, «Exercise 2 · A fraction of a fraction» ocupa tres renglones.
7. Para la próxima revisión: cada una de las cinco revisiones de la semana 3 ha encontrado algo que la anterior no miraba. Esta deja
   escrito qué miró (arriba) y en las tres reabiertas pide que la ENTREGA de cada reabierta diga cuántas huellas lee su guion de cada
   fichero; la que publique solo tiene que repetir el barrido de lo reabierto.

## Ficheros (git show --stat 0f656e7)
```
 docs/practicas-unidad4.md | 15 ++++++++-------
 1 file changed, 8 insertions(+), 7 deletions(-)
```
