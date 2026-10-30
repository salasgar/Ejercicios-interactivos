# Entrega de la tarea 117 · Revisión y publicación de equivalentes, compara, fraccion-de y suma-resta (semanas 1 y 2 de la U4)

Sesión `s-20261030T081542-dab2aa98`, 2026-10-30. Commit: **3e35947** (solo `docs/practicas-unidad4.md`: no se publica nada; `catalogo.js` sin tocar).

## Resultado
| Práctica (tarea, id) | Lo que pedía su reabierta | Veredicto | Estado |
|---|---|---|---|
| `equivalentes` (100, 48) | hecho y bien en el navegador | **no pasa**: un filtro de la hoja que no filtra (orden de cadenas) y casos de examen | sin publicar · `hechos/reabiertas/100--s-20261030T081542-dab2aa98-revision.md` (MEDIO) |
| `compara` (102, 50) | hecho y bien en el navegador | **no pasa**: casos de examen y de la hoja 1 | sin publicar · `hechos/reabiertas/102--s-20261030T081542-dab2aa98-revision.md` (MEDIO) |
| `fraccion-de` (103, 51) | hecho y bien en el navegador | **no pasa**: casos de examen y de las hojas; tres textos del ej. 4 (concordancia con 1 y «11 partes de 3») | sin publicar · `hechos/reabiertas/103--s-20261030T081542-dab2aa98-revision.md` (MEDIO) |
| `suma-resta` (104, 52) | hecho y bien en el navegador | **no pasa**: casos de examen y de la hoja 2 | sin publicar · `hechos/reabiertas/104--s-20261030T081542-dab2aa98-revision.md` (MEDIO) |

**Por qué ahora y no antes:** los exámenes semanales de la U4 (`4. Fractions/exámenes-semanales/semana-N/casos-examen-semanaN.tsv`, 120 casos
por semana) y el examen final (modelos 1 y 2 y recuperación, `4. Fractions/examen-final/`) se escribieron el 28-10 por la tarde y la noche,
**después** de las revisiones de la 109 y la 110. La regla 6 de la ficha («casos que no copien las hojas, los exámenes semanales ni el final»)
se medía hasta ahora solo con las listas `RESERVADOS` de `comprobar-semanaN.py`, que reservaban casos para unos exámenes que todavía no
existían. Ahora existen, y las cuatro prácticas sacan casos suyos: de 0,1 % a 1,7 % de los ítems según el ejercicio, en algún caso del
examen final.

**Los casos de examen no se escriben en claro en el repositorio**: el repo y la web son públicos (Pages sirve también
`reparto-practicas-u2/`). Las reabiertas dicen **dónde** está cada caso (fichero, destreza, apartado) y cuántos salen, nunca cuál es; en
el código se excluyen por una huella FNV-1a de su clave (fragmento en la reabierta de la 100). Los casos de las hojas sí van en claro: los
alumnos ya las tienen.

## Cómo se revisó
- **Lo que pedían las reabiertas, en el código** (diffs 81b139a, a70a843, eb33bf0 y af88dbd) **y en el navegador con clics de ratón** (Chrome
  headless por CDP, `Input.dispatchMouseEvent` en el centro de cada botón, «Probar sin código», 375 y 1100 px, `?idioma=es` y `?idioma=en`):
  - `equivalentes` ej. 4: con el m.c.m. bien y un numerador mal, «El denominador 12 está bien, pero arriba de 3/4 no va 10: 3 · 3 = 9»;
    con 1/6 y 1/3 y los numeradores sin cambiar, «Has cambiado solo el denominador: 1/3 no es 1/6. Arriba también se multiplica por 2» (solo
    la que cambia); acierto bien.
  - `compara` ej. 2: 1/10 y 1/4 puestas en «entre 1/2 y 1» → «1/10 es menor que 1/2: 1 · 2 = 2 es menor que 10», sin el «Ojo» del
    numerador; ej. 4: tocar una marca entera → «Has tocado 0 / −1», no «0/5» ni «−5/5».
  - `fraccion-de` ej. 4: variantes `parte`, `restante`, `queda` y `dos`, con fallo: opciones de total dentro de la cota y mayores que el dato.
  - `suma-resta` ej. 4 con pizza (½ y ⅕; ¼ y ⅔: m.c.m. ≤ 12); ej. 5 a 375 px en inglés y en español: «denominators» entera, una razón por fila.
  - Pasada con un fallo por los demás ejercicios tocados (equivalentes 1-3, fraccion-de 1-3, suma-resta 1-3, compara 1 y 3): abren, corrigen y
    no desbordan. **Ninguna excepción en la consola** en toda la prueba.
  - Lo que no se hizo: el acierto **y** el fallo de **cada** ejercicio de las cuatro en las cuatro combinaciones (ancho × idioma). Como las
    cuatro vuelven a reabrirse, lo hará entero la tarea que las publique.
- **Regla de oro y realismo**: los tests de cada práctica ya barren 3000 ítems por valor (`npm test` 1355/1355). Además, a mano: 16 ítems del
  ej. 4 de `fraccion-de` leídos en es y en con todas sus explicaciones, y 3000 ítems para contar textos y opciones (de ahí los puntos 3-5 de
  la reabierta de la 103).
- **Casos del papel**: 20000 ítems por ejercicio (semilla 117) contra los casos del mismo tipo de los tres `casos-examen-semanaN.tsv`, los tres
  `.tex` del examen final y los ejercicios de las hojas 1 y 2 (`comprobar-semana1.py` y `-semana2.py`, diccionario `CASOS`). Cuenta solo la
  **misma tarea con los mismos datos**; los ejemplos de los recuadros «Recuerda», «Ejemplo» y «Ojo» no cuentan. «Caza el error» de
  `suma-resta` no copia ninguno (sus errores son otros). Los `RESERVADOS` de las hojas que **ningún examen ha usado** (p. ej. «recta en
  quintos» en `compara`) no se piden.

## Propuestas de la tarea de la app de las semanas 1 y 2 (para Juan Luis; no están creadas)
No cambian respecto a lo que dijeron la 109 y la 110: las reabiertas no tocan el número ni el orden de los ejercicios.
- **Semana 1** (lun 14-12 → jue 17-12): **plan A** de la ENTREGA de la 109 (6 ★ + 4 a elegir, `['ortografia', 5]` el primer ★) en cuanto
  `equivalentes` y `compara` estén publicadas; si no lo están el jue 10-12, su **plan B**.
- **Semana 2** (lun 21-12 → jue 7-1, con la Navidad en medio): **plan A** de la ENTREGA de la 110 (7 ★ + 3 a elegir, `['ortografia', 6]`; o la
  variante larga, ×100/120). Sin `suma-resta` publicada no hay tarea de la semana 2 que valga (plan B de la 110).

## Lo que queda sin publicador
Las cuatro reabiertas (MEDIO, cortas, ficheros disjuntos: caben a la vez) necesitan después una tarea de publicación nueva (ALTO), que da
de alta la coordinadora: `equivalentes` y `compara` antes del **jue 10-12**; `fraccion-de` y `suma-resta` antes del **jue 17-12**.

## Cómo comprobarlo en 1 minuto
`npm run servir` → http://localhost:8080/practicas/equivalentes/ → «Probar sin código» → ej. 2 hasta que salga 6/9 y 10/15 (sale; no
debería). Para los casos de examen: `exámenes-semanales/semana-2/casos-examen-semana2.tsv`, filas `U4-2C-03`, y el ej. 3 de
`suma-resta`: en unos cientos de ítems sale alguno.
