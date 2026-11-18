# ENTREGA tarea 157 · Revisión y publicación de la semana 2 de la unidad 6

**Al cierre de la tercera pasada (s-20261118T082459-455aef79, 18-11), LISTA**: publicadas `terminos-semejantes`, `transposicion` (8501c5e) y `es-solucion` (b4d950f); ver «Tercera pasada».

Sesión s-20261117T233504-6c5e5c74 (18-11, de 23:35Z a ~00:50Z). **PARCIAL**: se publica `terminos-semejantes` (de la semana 1; la 157
la publica junto con las suyas, propuesta 1 de la 156). `es-solucion` y `transposicion` siguen sin publicar: están reabiertas.

Commit: 52ad72e (`practicas/_comun/catalogo.js`: `disponible: true` de la id 71; `docs/practicas-unidad6.md`: la semana 2 en §6 con
sus cotas y la línea «**Publicadas**»). `npm test` 2474/2474.

## Tercera pasada (18-11, s-20261118T082459-455aef79, encadenada desde la 156)

Se repite la revisión sobre una copia de ed82f09, con las semillas y el criterio de abajo. Los scripts están en /tmp/pu2-4c9a/ (llevan
casos de examen en claro y no salen de /tmp).

| Práctica | Casos del papel | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `transposicion` (149, 96b46da) | 0 en los cinco ejercicios. En el ej. 1: hoja 2, 23 casos del papel, 0 salen; examen 2 y extra, 48 y 0. En el resto: 0 | 0 fallos en 5 × 20000 | 0,98 % (ej. 4) | bien | **publicada** (8501c5e) |
| `es-solucion` (148, 8c5aebf + ed82f09 → 63c6253) | Ítems: 0 (examen 2 y extra, repasos, finales, hojas 1-3). Ejemplo fijo de la introducción del ej. 3: era de la hoja 2; tras 63c6253, 0 de 27 fijos | 0 fallos en 4 × 20000 | 4,3 % (ej. 4) | bien (también sobre 63c6253) | reabierta (`hechos/reabiertas/148--s-20261118T082459-455aef79-revision.md`), atendida en 63c6253 y **publicada** (b4d950f) |

- `transposicion`: el grep de los casos del examen 2 en su código y sus tests da 0, por texto (en los dos órdenes de lados) y por forma
  canónica, también en los comentarios. En los campos, ninguna escritura correcta se rechaza ni se acepta ninguna incorrecta. Las cuentas
  del feedback son exactas. Tests 79/79. Quedan dos detalles menores, que no impiden publicar:
  - en `signo-cambiado` y `signo-de-la-solucion` la cuenta buena sale dos veces seguidas («x = −11 : 7 = −11/7. x = −11 : 7 = −11/7.»);
  - el feedback en inglés del ej. 1 usa comillas españolas: «With «−» you get…».
- `es-solucion`: los ocho puntos de la reabierta de la 157 están resueltos. Las 124 huellas de `reserva.js` son exactamente las de las
  notas, las cuentas son exactas y `index.html` ya carga `./estilos.css`. Tests 72/72. Queda **un bloqueo de dos líneas**: el ejemplo
  de la introducción del ej. 3 es la misma identidad que la hoja 2, ej. 2 c), con los miembros cambiados. El resto de lo que señala la
  reabierta es recomendable, pero no bloquea.
- En los clics, el ej. 4 de `es-solucion` dio alguna vez «sin feedback» al fallar. Lo causaba el script, no la práctica: tras un acierto,
  la práctica pasa sola al ítem siguiente a los 3,6 s, y a veces la espera del script se quedaba corta. Repetido con más espera, el
  acierto y el fallo salen bien en los cuatro casos (es/en, 375/1100).

- Segunda vuelta sobre 63c6253, que solo cambia `textos.js`: el ejemplo de la introducción del ej. 3 pasa a 4x + 2x = 6x, y la cuenta
  del primer término negativo pasa de «−3 · (−3) = −(−9) = 9» a «(−3) · (−3) = 9». Resultados:
  - los 27 ejemplos fijos, 0 en el papel (solo el ej. 4 con s = 8, que no se puede evitar porque el único dato es la solución);
  - las cuentas del feedback siguen siendo exactas en 4 × 20000, y el paso «−(−n)» ya no sale en los ej. 1-2;
  - tests 72/72;
  - clics en los 16 casos, con acierto y fallo, sin errores de JavaScript ni desbordes. Las dos cargas que fallaron con
    `ERR_CONNECTION_RESET` eran del servidor de pruebas y se repitieron.
- No se han hecho los puntos 2 y 4 de la reabierta, que no bloquean: la notación del eco en el ej. 4 y «Izquierda: (−3) = −3». Quedan
  para una pasada futura.

**Tarea semanal 2: plan A** (abajo): ya están publicadas las tres prácticas.

## Qué se ha revisado y cómo

Dos pasadas, cada una sobre una copia de HEAD en /tmp (83348e3 y después 9e73728). Entre las dos, las sesiones de la 147 y la 149
atendieron las reabiertas de la primera pasada (714ff62 y ab3a6da).

- **Con clics** (CDP, `Input.dispatchMouseEvent`, Chrome sin ventana), a 375 y 1100 px, en español y en inglés: en cada ejercicio de
  las tres prácticas, un ítem acertado y uno fallado, en las dos pasadas. Sin errores de JavaScript, sin diálogos y sin desbordes
  horizontales. Los feedbacks de fallo se han leído a 375 px.
- **Cotejo de casos**: 20000 ítems por ejercicio, con semilla fija (157000 + n para `es-solucion`, 157100 + n para `transposicion` y
  157200 + n para `terminos-semejantes`). Se compara con la hoja en claro y, por huella de la forma canónica calculada fuera del
  repositorio, con el examen de la semana y su extra, con el repaso de los exámenes siguientes y con los cinco finales. Criterio: la misma
  tarea con sus datos (la ecuación reducida con coeficientes exactos, sin orden de términos ni de miembros; en «compruébalo», con el mismo
  valor). Los cuestionarios Forms se miran aparte: no son examen y no se reservan (como en la 156).
- **Regla de oro** con aritmética propia (BigInt y fracciones) sobre el texto mostrado; campos con respuestas tecleadas variadas;
  **variedad** (ningún ítem en más del 10 %); **feedback** por tipo de error en los dos idiomas; notación y sesiones del acta.

## Resultado

| Práctica | Casos del papel | Regla de oro | Variedad (máx.) | Clics | Veredicto |
|---|---|---|---|---|---|
| `terminos-semejantes` (147) | 1.ª pasada: U6-1C-17 del examen 1 (6 sumas, 39 ítems en los ej. 3-4) · 2.ª (714ff62): 0 en todo | 0 fallos (también los «bien» ambiguos, arreglados) | 8,9 % (ej. 2) | bien | **publicada** |
| `es-solucion` (148) | sin reserva: hoja 2, examen 2 (U6-2C-02 y 2C-03) y final modelo 2 en los ej. 1-3 (hasta 9 casos · 685 ítems en el ej. 3) | 0 fallos | 4,3 % | bien | **reabierta**, sin publicar |
| `transposicion` (149) | 1.ª: sin reserva (hasta 30 casos · 942 ítems en el ej. 1) · 2.ª (ab3a6da): ej. 2-5, 0; ej. 1, hoja 2 11 · 251 y examen 2 19 · 478 | 0 fallos | 1,8 % | bien | **reabierta** (dos veces), sin publicar |

`terminos-semejantes`, recuentos de la segunda pasada (expresiones del papel · las que salen · ítems): hoja 1, 0 en los cuatro ejercicios;
examen 1 y extra 12/2/108/169 · 0 · 0; repasos de los exámenes 2-4 y finales, 0. Solo salen los recuadros de ejemplo de la hoja (fuera de
criterio, como en la 156).

## Reabiertas

- `hechos/reabiertas/147--s-20261117T233504-6c5e5c74-revision.md` (atendida en 714ff62; publicada).
- `hechos/reabiertas/148--s-20261117T233504-6c5e5c74-revision.md`: sin reserva (huellas ya calculadas en
  `hechos/notas/s-20261117T233504-6c5e5c74-es-solucion-huellas.txt` y casos de la hoja en `…-es-solucion-hoja-claves.txt`); cuentas falsas
  con coeficientes no enteros en el feedback (`cuentaMiembro`); `index.html` sin `./estilos.css`; «Eso ya es la solución escrita» con
  `x = 3` cuando se pide 5; dos «:» seguidos; nombres de error del registro dentro del feedback; «pasar el factor restando» con coeficiente −1.
  Al cerrar esta tarea la tiene una sesión (s-20261118T003437-6d4c097c).
- `hechos/reabiertas/149--s-20261117T233504-6c5e5c74-revision.md` (atendida en ab3a6da) y
  `…-revision2.md`: solo el ej. 1. La huella se hace con los lados en el orden en que se generan, y las del papel están en el otro orden;
  tampoco mira la igualdad de llegada. El test compara un hash consigo mismo, y un comentario lleva un caso del examen 2 (de a65524a).

Quien publique `es-solucion` y `transposicion` (una tercera pasada de la 157) solo tiene que repetir el cotejo y los clics sobre el código
nuevo: los scripts de esta revisión están en /tmp/pu2-157-6c5e/ (llevan casos de examen en claro; no salen de /tmp, y /tmp se borra al
reiniciar el Mac).

## Propuesta de la tarea semanal 2 (para Juan Luis; no está creada: la monta la 160 en el panel y la programa en Classroom la tarea 34 del reparto de la U6)

`U6 · Semana 2 · Ecuaciones` / `U6 · Week 2 · Equations` · `unidad: 6` · `desde: '2027-02-08'` · `hasta: '2027-02-11'` (sale el **lun 8-2 a
las 8:00**; entrega el **jue 11-2 a las 23:59**; la prueba 2 es el vie 12-2). Sesiones: 5 lun 8-2 (ecuación, solución, identidad, la
balanza), 6 mar 9-2 (transposición con números, ecuaciones de una operación), 7 jue 11-2 (dos operaciones, `3x = 12` frente a `12x = 3`).
Como en la 156 y la 131, lo de la sesión que se da **el mismo día** del plazo (la 7) va «a elegir»; sus nucleares (U6-2C-09, 2C-11) pasan
a ★ de repaso en la tarea 3. El repaso de la semana 1 sigue al de la prueba 2 (valor numérico y reducir). 10 puntos por ejercicio.

### Plan A (con `es-solucion`, `transposicion` y `terminos-semejantes` publicadas): 8 ★ + 2 a elegir = 100 puntos

| | Ejercicio | Destreza (sesión) |
|---|---|---|
| ★ | `['ortografia', 11]` Sin coma entre el sujeto y el verbo | — (ortografía) |
| ★ | `['es-solucion', 1]` Compruébalo | U6-2C-02 nuclear (5) |
| ★ | `['es-solucion', 2]` ¿Qué ecuación? | U6-2C-02 nuclear (5) |
| ★ | `['transposicion', 1]` Con números | U6-2C-06 nuclear (6) |
| ★ | `['transposicion', 2]` Una operación | U6-2C-07, 2C-08 nucleares (6) |
| ★ | `['transposicion', 5]` Comprueba y corrige | U6-2C-07, 2C-08 nucleares, 2C-02 (6) |
| ★ | `['valor-numerico', 1]` Sustituye y calcula (repaso) | U6-1C-05, 1C-06 nucleares (2) |
| ★ | `['terminos-semejantes', 3]` Reduce (repaso) | U6-1C-13, 1C-14 nucleares (3) |
| elegir | `['es-solucion', 3]` ¿Identidad o ecuación? | U6-2C-03, 2C-01 nuclear (5) |
| elegir | `['es-solucion', 4]` Inventa una | U6-2C-04 (5) |
| elegir | `['transposicion', 3]` Dos operaciones, paso a paso | U6-2C-09 nuclear (7) |
| elegir | `['transposicion', 4]` 3x = 12 frente a 12x = 3 | U6-2C-11 nuclear (7) |

### Plan B (sin `es-solucion`): 8 ★ + 2 a elegir = 100 puntos

Los ★ de `transposicion`, la ortografía y los dos de repaso, como en el plan A; en lugar de los dos ★ de `es-solucion`,
`['valor-numerico', 3]` ¿Qué valor? (U6-1C-05 nuclear: buscar el valor que da un número, preludio de la ecuación) y
`['terminos-semejantes', 4]` Caza el error (U6-1C-15 nuclear). «A elegir»: `['transposicion', 3]` y `['transposicion', 4]`.

### Plan C (sin `transposicion`)

La semana pierde tres ★ y sus dos «a elegir»: no vale la pena como tarea de la semana 2. Se manda la ortografía, `es-solucion` (los cuatro
ejercicios, 1-2 ★ y 3-4 a elegir) y el repaso de la semana 1 (`valor-numerico` 1 y 3, `terminos-semejantes` 3 y 4), y se avisa.

Si el lun 8-2 están publicadas las tres, plan A; si falta una, el plan que toque.

## Hallazgos fuera de criterio (para Juan Luis)

- **Cuestionarios Forms**: los generadores sacan casos de los cuestionarios semanales (en `transposicion`, el cuestionario 2 en los cinco
  ejercicios; en `es-solucion` y `terminos-semejantes`, unos pocos). Como en la 156, no se reservan porque no son examen; si quieres que
  se reserven, las huellas de `transposicion` ya están calculadas (filas «Q2-forms» de `hechos/notas/…-transposicion-huellas.txt`).
- `terminos-semejantes`: la y sigue saliendo en casi la mitad de los ítems del ej. 1; el ej. 2 tiene un 8,9 % del mismo coeficiente.
- El caso de examen que quedó en claro en el historial de badfdcb (incidencia s-20261117T023530-f7aa1ea7) sigue ahí, y otro del examen 2
  en un comentario de `transposicion` desde a65524a (en su segunda reabierta).

## Cómo comprobarlo en 1 minuto

`npm run servir` y http://localhost:8080/practicas/terminos-semejantes/?probar=1 («Probar sin código»). La portada no enseña la U6 hasta
el 1-2-2027 (`UNIDADES.desde`): para verla antes, fecha de prueba en `unidadActual`.
