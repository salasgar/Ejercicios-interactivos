# Entrega de la tarea 118 · Revisión y publicación de multiplica-divide, combinadas-fracciones y errores4 (semana 3 de la U4)

Sesión `s-20261030T084305-921ac985`, 2026-10-30, encadenada tras la 117. Commit: **f4c927b** (solo `docs/practicas-unidad4.md`: no se publica nada;
`catalogo.js` sin tocar). Léase con la ENTREGA de la 117 (`salidas/117-publicar-u4-semanas-1-2/ENTREGA.md`): mismo método, mismo hallazgo.

## Resultado
| Práctica (tarea, id) | Lo que pedía su reabierta (111) | Veredicto | Estado |
|---|---|---|---|
| `multiplica-divide` (105, 53) | hecho y bien en el navegador | **no pasa**: casos de los exámenes semanales 2 y 3, del final y de las hojas 2 y 3 | sin publicar · `hechos/reabiertas/105--s-20261030T084305-921ac985-revision.md` (MEDIO) |
| `combinadas-fracciones` (106, 54) | hecho y bien en el navegador | **no pasa, por poco**: tres ejercicios de la hoja 3 (3 de 40000) | sin publicar · `hechos/reabiertas/106--s-20261030T084305-921ac985-revision.md` (MEDIO, muy corta) |
| `errores4` (107, 55) | hecho y bien en el navegador | **no pasa**: una igualdad del examen final y tres de la hoja 2 | sin publicar · `hechos/reabiertas/107--s-20261030T084305-921ac985-revision.md` (MEDIO) |

Los casos de examen, como en la 117, **solo por su sitio** (fichero, destreza, apartado) y cuántos salen; nunca en claro en el repositorio.

## Cómo se revisó
- **Lo que pedían las reabiertas** (commits c74fd31, 755fa2a y 3b97c41), en el código y en el navegador **con clics de ratón** (Chrome headless
  por CDP, «Probar sin código», 375 y 1100 px, es y en):
  - `multiplica-divide` ej. 2: el enunciado pide la irreducible; «En el dibujo: 1 parcela de 4» / «1 piece out of 9» (singular con 1). Ej. 5: base
    con numerador ≥ 2; «el exponente afecta también al denominador» solo a quien elevó solo el numerador.
  - `combinadas-fracciones` ej. 1: tocar la segunda de «2/3 : 1/12 · 2/3» da el aviso de izquierda a derecha; en «−4/5 · 3/5 : 3/5» valen las dos
    (no cambia el valor: regla de Juan Luis). Ej. 2 hasta el final: en el último paso no hay opción de «izquierda a derecha».
  - `errores4` ej. 1, 2 y 3: los nombres nuevos («Ha multiplicado los denominadores en una suma … sin ampliarlos», «Ha invertido las dos
    fracciones»); la potencia en la línea 2.
  - **Ninguna excepción en la consola** y sin desbordes a 375 px.
  - Lo que no se hizo: el acierto **y** el fallo de **cada** ejercicio en las cuatro combinaciones; lo hará entero la tarea que las publique.
- **Regla de oro**: los tests de las tres barren por valor 3000 ítems por ejercicio (`npm test` 1355/1355), con las fuerzas brutas que pidió la 111.
- **Casos del papel**: 20000 ítems por ejercicio (semilla 118) contra `U4-2C-*`, `U4-2A-06`, `U4-3*` de los TSV de las semanas 2 y 3, los
  apartados 2, 3 y 5b de los tres modelos del final y los ejercicios de las hojas 2 y 3 y del banco (`CASOS` de `comprobar-semana2.py` y
  `-semana3.py`). Misma regla que la 117: misma tarea con los mismos datos; los recuadros de ejemplo no cuentan. Dos excepciones, para Juan
  Luis: las **potencias** (48 posibles, 11 en las hojas: se piden solo las de examen) y la **inversa** (una sola fracción, como una marca de la recta).

## Propuesta de la tarea de la app de la semana 3 (para Juan Luis; no está creada)
La de la ENTREGA de la 111 vale **tal cual**: las reabiertas no cambian el número ni el orden de los ejercicios. Tarea del **lun 11-1 al jue 14-1**
(el final es el vie 15-1): **plan A** (7 ★ + 3 a elegir, `['ortografia', 7]` el primer ★) con las tres publicadas; su **plan B** si falta alguna.
El «a elegir» `['suma-resta', 4]` necesita que `suma-resta` (reabierta por la 117) esté publicada.

## Lo que queda sin publicador
Las tres reabiertas (MEDIO; ficheros disjuntos entre sí y con las cuatro de la 117: caben las siete a la vez) y después una tarea de publicación
nueva (ALTO) para las siete, que da de alta la coordinadora. Plazo de estas tres: **mar 22-12** (límite jue 7-1).
